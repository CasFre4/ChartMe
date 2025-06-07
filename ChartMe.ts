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
class PriorityQueue<T> {
    private data: { item: T, priority: number }[] = [];
  
    enqueue(item: T, priority: number) {
      this.data.push({ item, priority });
      this.data.sort((a, b) => a.priority - b.priority); // Min-heap behavior
    }
    dequeue(): T | undefined {
      return this.data.shift()?.item;
    }
    peek(): T | undefined {
      return this.data[0]?.item;
    }
    isEmpty(): boolean {
      return this.data.length === 0;
    }
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
    const bundle: colorsBundled = checkValues({fillColors: fillColors, targetColors: targetColors, fillTarget: fillTarget})
    // fillColors = checkedValues.fillColors
    // targetColors = checkedValues.targetColors
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
function zipColors (fillColors: colorNumbers[], targetColors: colorNumbers[]): colorsBundled{
    let zip: colorsBundled = []
    const pq: PriorityQueue<number[]> = new PriorityQueue()
    for (const [row, fill] of fillColors.entries()) {
        const currentArr: number[] = []
        fillColors
        for (const [col, target] of targetColors.entries()) {
            pq.enqueue([row, col], distanceFlattened({targetColor: fill, currentColor: target}))
        }
    }
    const colsInUse: number[] = []
    const rowsInUse: number[] = []
    while (colsInUse.length < targetColors.length) {
        const [row, col] = pq.dequeue() ?? []
        if(!(colsInUse.includes(col) || rowsInUse.includes(row))){
            zip.push({fcolor: fillColors[row], tcolor: targetColors[col]})
            colsInUse.push(col)
            rowsInUse.push(row)
        }
    }
    return zip
}
   
    
function checkValues ({fillColors, targetColors, fillTarget}: checkTypes): colorsBundled{
    let fill: colorNumbers[] = []
    let target: colorNumbers[] = []
    
    if (fillColors === undefined && !(targetColors === undefined)) {
        const gray: number = 255/(targetColors.length - 1 )
        fill = Array(targetColors.length).fill(0).map((_, i) => [i * gray, i * gray, i * gray])
        for (const i in targetColors) {
            // fill[i] = colorCorrector(fillColors[i])
            target[i] = colorCorrector(targetColors[i])
        }
    } else if (!(fillColors === undefined) && targetColors === undefined) {
        const gray: number = 255/(fillColors.length - 1 )
        target = Array(fillColors.length).fill(0).map((_, i) => [i * gray, i * gray, i * gray])
        for (const i in fillColors) {
            fillColors[i] = colorCorrector(fillColors[i])
        }
    
    } else if (!(fillColors===undefined || targetColors===undefined)) {
        for (const i in fillColors) {
            fill[i] = colorCorrector(fillColors[i])
            target[i] = colorCorrector(targetColors[i])
        }
    }
    
    if ((fillColors === undefined) && (targetColors === undefined) && !(fillTarget === undefined)) {
        return fillTarget
    } else if (!(fillColors === undefined) && !(targetColors === undefined) && !(fillTarget === undefined)) {
        // const tmpArray = [...fillTarget, ...zipColors(fill, target)]
        const tcolorSet = new Set(fillTarget.map(obj => obj.tcolor))
        const zipped = zipColors(fill, target).filter(obj=> !tcolorSet.has(obj.tcolor))
        return [...fillTarget, ...zipped]
        
    } else if (!(fillColors === undefined) && !(targetColors === undefined) && (fillTarget === undefined)) {
        return zipColors(fill, target)
    } else { //if ((fillColors === undefined) && (targetColors === undefined) && (fillTarget === undefined))
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