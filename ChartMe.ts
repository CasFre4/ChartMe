import { Jimp } from 'jimp'
import colorName from 'color-name'
type ColorEntry = string | [number, number, number] | [number, number, number, number]
type colorBundle = {
    fcolor: ColorEntry
    tcolor: ColorEntry
}
type colorsBundled = colorBundle[]
type defaultTypes = {
    imagePath: string, 
    fillColors?: ColorEntry[],
    targetColors?: ColorEntry[],
    fillTarget?: colorBundle[]
} 
type checkTypes = { 
    fillColors?: ColorEntry[],
    targetColors?: ColorEntry[],
    fillTarget?: colorBundle[]
} 


async function ChartMe (imagePath: string, ...args: any[]) {
    for (const colorPair of args) {
        console.log(colorPair)
    }
    console.log(colorName['shart'])

    const image = await Jimp.read(imagePath)
    await image.greyscale()
    // console.log(colorName['red'][0])
    // console.log(colorName['red'][1])
    // console.log(colorName['red'][2])

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        if (image.bitmap.data[idx + 3] === 0) {
            console.log(`Alpha channel is red ${image.bitmap.data[idx+0]} green ${image.bitmap.data[idx+1]} blue ${image.bitmap.data[idx+2]}`)
            return
        }
        const red = image.bitmap.data[idx + 0]
        // const alpha = image.bitmap.data[idx + 3]
        // const green = image.bitmap.data[idx+1]
        // const blue = image.bitmap.data[idx+2]
        if (red > 50){
            image.bitmap.data[idx+0] = 255
            image.bitmap.data[idx+1] = 255
            image.bitmap.data[idx+2] = 255
        } else {
            image.bitmap.data[idx+0] = 0
            image.bitmap.data[idx+1] = 0
            image.bitmap.data[idx+2] = 0
        }
        
        // image.bitmap.data[idx+3] = alpha
    })
    image.write('./images/outputTest.png')

}
type checkedValuesTypes = {
    fillColors?: ColorEntry[],
    targetColors?: ColorEntry[]
}
type colorNumbers = [number, number, number, number] | [number, number, number]
type distanceColors = {
    targetColor: colorNumbers
    currentColor: colorNumbers
}
function euclideanDistance(a, b) {
    if (a.length !== b.length) {
      throw new Error("Points must have the same number of dimensions");
    }
  
    return Math.sqrt(
      a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0)
    );
}
function distanceFlattened({targetColor, currentColor}: distanceColors) {
    if (targetColor.length !== 3 && currentColor.length !== 3 && targetColor.length !== 4 && currentColor.length !== 4) {
        throw new Error(`Colors are not the correct length, should be 3 or 4`)
    }
    if (targetColor.length > currentColor.length) {
        return euclideanDistance(targetColor.slice(0, -1), currentColor)
    } else if (targetColor.length < currentColor.length) {
        return euclideanDistance(targetColor, currentColor.slice(0, -1))
    } else {
        return euclideanDistance(targetColor, currentColor)
    }
}

export async function PreProcessChart ({imagePath, fillColors, targetColors, fillTarget}: defaultTypes) {
    const checkedValues: checkTypes = checkValues({fillColors: fillColors, targetColors: targetColors, fillTarget: fillTarget})
    fillColors = checkedValues.fillColors
    targetColors = checkedValues.targetColors
    const image = await Jimp.read(imagePath)
    // await image.greyscale()
    // console.log(colorName['red'][0])
    // console.log(colorName['red'][1])
    // console.log(colorName['red'][2])
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        // if (image.bitmap.data[idx + 3] === 0) {
        //     console.log(`Alpha channel is red ${image.bitmap.data[idx+0]} green ${image.bitmap.data[idx+1]} blue ${image.bitmap.data[idx+2]}`)
        //     return
        // }
            
        const red = image.bitmap.data[idx + 0]
        const green = image.bitmap.data[idx+1]
        const blue = image.bitmap.data[idx+2]
        const alpha = image.bitmap.data[idx + 3]
        if (red > 50){
            image.bitmap.data[idx+0] = 255
            image.bitmap.data[idx+1] = 255
            image.bitmap.data[idx+2] = 255
        } else {
            image.bitmap.data[idx+0] = 0
            image.bitmap.data[idx+1] = 0
            image.bitmap.data[idx+2] = 0
        }
        
        // image.bitmap.data[idx+3] = alpha
    })

    image.write('./images/outputTest.png')
}
function zipColors (fillColors: ColorEntry[], targetColors: ColorEntry[]) {
    let zip: colorsBundled = []
    for (const fill of fillColors) {
        
        for (const target of targetColors) {

        }
    }
} 
function checkValues ({fillColors, targetColors, fillTarget}: checkTypes): colorsBundled{
    if (fillColors === undefined && !(targetColors === undefined)) {
        const gray: number = 255/(targetColors.length - 1 )
        fillColors = Array(targetColors.length).fill(0).map((_, i) => [i * gray, i * gray, i * gray])
    } else if (!(fillColors === undefined) && targetColors === undefined) {
        const gray: number = 255/(fillColors.length - 1 )
        targetColors = Array(fillColors.length).fill(0).map((_, i) => [i * gray, i * gray, i * gray])
    }
    if ((fillColors === undefined) && (targetColors === undefined) && !(fillTarget === undefined)) {
        return fillTarget
    } else if ((fillColors === undefined) && (targetColors === undefined) && (fillTarget === undefined)) {
        return [
            {
                'tcolor': colorName['white'],
                'fcolor': colorName['white']
            },
            {
                'tcolor': colorName['black'],
                'fcolor': colorName['black']
            },
        ]
    } else if (!(fillColors === undefined) && !(targetColors === undefined) && !(fillTarget === undefined)) {
        let tmpArray = [...fillTarget]
        for (const pair in fillColors) {
            
        }
    } else {
        throw new Error(`Colors misformatted`)
    }
    if (fillColors === undefined|| fillColors.length === 0) {
        if (targetColors ===undefined || targetColors.length === 0) {
            targetColors = [colorName['black'], colorName['white']]
            fillColors = [colorName['black'], colorName['white']]
        } else {
            const gray: number = 255/(targetColors.length - 1 )
            fillColors = Array(targetColors.length).fill(0).map((_, i) => [i * gray, i * gray, i * gray])
        }
    } else if (targetColors ===undefined || targetColors.length === 0) {
        const gray: number = 255/fillColors.length
        targetColors = Array(fillColors.length).fill(0).map((_, i) => [i * gray, i * gray, i * gray])
    } else {
        if (fillColors.length !== targetColors.length) {
            throw new Error('Length of target and fill colors should be equal')
        }
    }
    for (const index in fillColors) {
        fillColors[index] = colorCorrector(fillColors[index])
        targetColors[index] = colorCorrector(targetColors[index])
    }
}
function isTripleOrQuad( arr: any ): arr is [number, number, number] | [number, number, number, number] {
    return (
      Array.isArray(arr) &&
      (arr.length === 3 || arr.length === 4) &&
      arr.every(
        (item) =>
          typeof item === "number" &&
          Number.isFinite(item) &&
          item >= 0 &&
          item <= 255
      )
    );
  }
function colorCorrector (color: (string | [number, number, number] | [number,number,number,number])) : [number, number, number] | [number,number,number,number] {
    let fin_color: [number, number, number] | [number,number,number,number] 
    if (typeof color === "string") {
        fin_color = colorName[color]
    } else if (isTripleOrQuad(color)) {
        return color
    } else {
        throw new Error(`${color} is not valid rgb/rgba value`)
    }
    if (fin_color !== undefined) {
        return fin_color
    } else {
        throw new Error(`${color} is not valid color name.`)
    }
}
export default ChartMe