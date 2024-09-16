import { stdout } from 'process'

let a = 0,
    b = 0,
    c = 0

const cubeWidth = 10
const width = 160,
    height = 44
const zBuffer = new Array(width * height).fill(0)
const buffer = new Array(width * height).fill(' ')
const backgroundASCIICode = ' '
const distaceFromCam = 60
const K1 = 40
const incrementSpeed = 0.6

let x, y, z
let ooz
let xp, yp
let indx

const calcX = (i, j, k) => {
    return (
        j * Math.sin(a) * Math.sin(b) * Math.cos(c) -
        k * Math.cos(a) * Math.sin(b) * Math.cos(c) +
        j * Math.cos(a) * Math.sin(c) +
        k * Math.sin(a) * Math.sin(c) +
        i * Math.cos(b) * Math.cos(c)
    )
}

const calcY = (i, j, k) => {
    return (
        j * Math.cos(a) * Math.cos(c) +
        k * Math.sin(a) * Math.cos(c) -
        j * Math.sin(a) * Math.sin(b) * Math.sin(c) +
        k * Math.cos(a) * Math.sin(b) * Math.sin(c) -
        i * Math.cos(b) * Math.sin(c)
    )
}

const calcZ = (i, j, k) => {
    return (
        k * Math.cos(a) * Math.cos(b) -
        j * Math.sin(a) * Math.cos(b) +
        i * Math.sin(b)
    )
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const calcForSurface = (cubeX, cubeY, cubeZ, ch) => {
    x = calcX(cubeX, cubeY, cubeZ)
    y = calcY(cubeX, cubeY, cubeZ)
    z = calcZ(cubeX, cubeY, cubeZ) + distaceFromCam

    ooz = 1 / z
    xp = Math.floor(width / 2 + K1 * ooz * x * 2)
    yp = Math.floor(height / 2 + K1 * ooz * y)

    indx = xp + yp * width
    if (indx >= 0 && indx < width * height) {
        if (ooz > zBuffer[indx]) {
            zBuffer[indx] = ooz
            buffer[indx] = ch
        }
    }
}

const renderFrame = () => {
    console.clear()
    buffer.fill(backgroundASCIICode)
    zBuffer.fill(0)

    for (let cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += incrementSpeed) {
        for (let cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += incrementSpeed) {
            calcForSurface(cubeX, cubeY, -cubeWidth, '.')
            calcForSurface(cubeWidth, cubeY, cubeX, '$')
            calcForSurface(-cubeWidth, cubeY, -cubeX, 'g')
            calcForSurface(-cubeX, cubeY, cubeWidth, '%')
            calcForSurface(cubeX, -cubeWidth, cubeY, ';')
            calcForSurface(cubeX, cubeWidth, cubeY, '~')
        }
    }

    let output = ''
    for (let k = 0; k < width * height; k++) {
        output += buffer[k]
        if (k % width === width - 1) {
            output += '\n'
        }
    }
    stdout.write(output)

    a += 0.2
    b += 0.2
}

const main = async () => {
    console.clear()
    while (true) {
        renderFrame()
        await sleep(16)
    }
}

main()