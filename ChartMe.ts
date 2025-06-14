import { Jimp, ResizeStrategy } from 'jimp'
import colorName from 'color-name'
import * as d3 from "d3"

type colorEntry = string | [number, number, number] | [number, number, number, number]
type colorBundle = {
    fcolor: colorNumbers,
    tcolor: colorNumbers,
    order: number
}
type colorPreBundled = {
    fcolor: colorEntry,
    tcolor: colorEntry 
}
type colorsBundled = colorBundle[]
type defaultTypes = {
    fillColors?: colorEntry[],
    targetColors?: colorEntry[],
    fillTarget?: colorPreBundled[]
} 
type mainTypes = {
    inputPath: `${string}.${string}`,
    outputPath: `${string}.${string}`,
    fillColors?: colorEntry[],
    targetColors?: colorEntry[],
    fillTarget?: colorPreBundled[]
}
type checkTypes = { 
    fillColors?: colorEntry[],
    targetColors?: colorEntry[],
    fillTarget?: colorPreBundled[]
} 
type colorNumbers = [number, number, number, number]
type distanceColors = {
    targetColor: colorNumbers
    currentColor: colorNumbers
}

type constructorType = {
    image: any
    fillColors?: (colorEntry[]|undefined)
    targetColors?: (colorEntry[]|undefined)
    fillTarget?: (colorPreBundled[]|undefined)
    width?: (number|undefined)
    height?: (number|undefined)
}
type graphType = {
        width?: number
        height?: number
        margin?: {[key: string]: number}
    }

export default class ChartMe {
    image: any
    data: number[][]
    bundle: colorsBundled
    fillColors: colorEntry[]
    targetColors: colorEntry[]
    fillTarget: colorPreBundled[]
    width: number
    height: number
    // processed: {[key: string]: number}[]
    processed: {[key: string]: number}[]
    
    constructor({image, fillColors, targetColors, fillTarget, width, height}: constructorType) {
        this.bundle = checkValues({fillColors,targetColors, fillTarget})
        // console.log(this.bundle)
        // console.log(checkValues({fillColors,targetColors, fillTarget}))
        this.image = image
        // let newHeight: number
        // let newWidth: number
        if (width===undefined&&height===undefined) {
            this.height = image.height/10
            this.width = image.width/10
        } else if (width!==undefined&&height===undefined) {
            this.height = Math.floor(image.height * (width/image.width))
            this.width = width
        } else if (width===undefined&&height!==undefined) {
            this.width = Math.floor(image.width * (height/image.height))
            this.height = height
        } else if (width!==undefined&&height!==undefined) {
            this.width = width
            this.height = height
        } else {
            throw new Error("Width or height are not number")
        }
        
    }
    async load() {
        const value = ResizeStrategy.NEAREST_NEIGHBOR
        await recolorImage(this.image, this.bundle)
        this.image.resize({w: this.width, h:this.height, mode: value})
        this.data = datafy(this.image, this.bundle)
        console.log(this.data[50])
        console.log(this.data[150])
        return this
    }
    // async chart (inputPath: `${string}.${string}`='./image/testImage.png', outputPath: `${string}.${string}`='./data/data.txt', {fillColors, targetColors, fillTarget}: defaultTypes) {
    //     const image = await Jimp.read(inputPath)
    //     // await getPreviewChart(image, {fillColors, targetColors, fillTarget})
    //     await recolorImage(image, this.bundle)
    //     // for (const key in ResizeStrategy) {
    //     //     const value = ResizeStrategy[key as keyof typeof ResizeStrategy]

    //     //     const copy = image.clone()
    //     //     copy.resize({w: newWidth, h: newHeight, mode: value})
    //     //     await recolorImage(copy, {fillColors, targetColors, fillTarget})
    //     //     await copy.write(`./images/${value}.png`)
    //     // }
    //     // image.write(outputPath)
    //     const newWidth: number = image.width/10
    //     const newHeight: number = image.height/10
    //     const value = ResizeStrategy.NEAREST_NEIGHBOR
    //     // const copy = image.clone()
    //     image.resize({w: newWidth, h: newHeight, mode: value})
    //     const data = datafy(image, {fillColors, targetColors, fillTarget})
    async preview (outputPath: `${string}.${string}`) {
        this.image.write(outputPath)
        // graphData()
        
    }
    
    // preprocess() {
    //     const processedArr: {[key: string]: number}[] = []
    //     // console.log(this.bundle)
    //     const length: number = Object.keys(this.bundle).length
    //     // console.log(length)
    //     for (const [j, row] of this.data.entries()) {
    //         const rowData: {[key: string]: number} = Object.fromEntries(Array.from({length}, (_,i) => [i.toString(),0]))
    //         // console.log(rowData)
    //         for (const x of row) {
    //             // let rownum: number = rowData[x.toString()]
    //             if (x !== -1 ){
    //                 rowData[x.toString()] = x + 1
    //             } 
    //         }
    //         rowData.order = j
    //         processedArr.push(rowData)
    //     }
    //     this.processed = processedArr
    // }
     preprocess() {
        const processedArr: {[key: string]: number}[] = []
        // console.log(this.bundle)
        const length: number = Object.keys(this.bundle).length
        // console.log(length)
        for (const [j, row] of this.data.entries()) {
            const rowData: {[key: string]: number} = Object.fromEntries(Array.from({length}, (_,i) => [i.toString(),0]))
            // console.log(rowData)
            for (const x of row) {
                // let rownum: number = rowData[x.toString()]
                if (x !== -1 ){
                    rowData[x.toString()] = ++ rowData[x.toString()]
                } 
            }
            rowData.order = this.image.height - j
            processedArr.push(rowData)
        }
        this.processed = processedArr
        // this.processed = preprocess2electricbugalu(processedArr)
    }
    
    graph({width, height, margin}: graphType) {
        if (margin===undefined) {
            margin =  {
                top: 20,
                right: 20,
                bottom: 40,
                left:40
            }
        }
        if (width===undefined) {
            width = 3*this.image.width - margin.right - margin.left
        }
        if (height===undefined) {
            height = 3*this.image.height - margin.top - margin.bottom
        }

        const data = [30, 80, 45, 60];
        
        // const keys = Object.keys(this.processed[0])
        const keys = Object.keys(this.processed[0]).filter(k => k !== "order");
        const mycolors = Array.from(this.bundle, (pair, i) => `rgba(${pair.fcolor.join(",")})`)
        // const fillColors = Object.keys
        // console.log('keys')
        // console.log(keys)
        // const groups = Array.from({ length: this.image.height }, (_, i) => i.toString());
        // const stackData = stack(this.processed)
        // console.log(keys)
        const svg = d3.select("#my_dataviz")
        .append("svg")
            // .attr("width", 150)
            // .attr("height", 200)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.right})`)
            // .call(d3.axisBottom(x))

        const color = d3.scaleOrdinal<string,string>()
        .domain(keys)
        // .range(["rgba(255,0,0,255)", "rgba(255,153,0,255)"].reverse());
        .range(mycolors);
        // .range(['#e41a1c','#377eb8','#4daf4a'])
        // console.log(this.image.height)

        var y = d3.scaleBand()
        .domain(this.processed.map(d => d.order.toString()).reverse())
        .range([ height,0 ]);
         svg.append("g")
        .call(d3.axisLeft(y));

         var x = d3.scaleLinear()
            .domain([0, this.image.width])
            .range([0, width])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // var groups = d3.map(data, d => d.)
        const stackData = d3.stack().keys(keys)(this.processed)

        svg.append("g")
        .selectAll("g")
        .data(stackData)
        .enter().append("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .enter().append("rect")
                .attr("x", d => x(d[0]))
                
                .attr("y", d => y(d.data.order.toString())!)
                // .attr("y", d => console.log(y(d.data.order.toString())!))

                .attr("height", y.bandwidth())
                // .attr("width", d => console.log(d))
                // .attr("width", d => x(d[1]- d[0]))
                .attr("width", d => x(d[1]) - x(d[0]))
                // .attr("width", d => x(d[1]))
                
        // .attr("height", d => y(d[0]) - y(d[1]))
        // .attr("width", x.bandwidth());
        // .append("rect")
        // .attr("x", (d, i) => i * 40)
        // .attr("y", d => d[1])
        // .attr("width", 30)
        // .attr("height", d => d)
        // .attr("fill", "steelblue");
    }
    
}
// function preprocess2electricbugalu(processedData) {

// }
function datafy(image, bundle: colorsBundled): number[][]{
    // const bundle: colorsBundled = checkValues({fillColors: fillColors, targetColors: targetColors, fillTarget: fillTarget})
    const data: number[][] = Array.from({ length: image.height}, () => Array(image.length).fill(null))
    // console.log(data)

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        // console.log(`x: ${x}, y: ${y}`)
        // data.push()

        const red = image.bitmap.data[idx + 0]
        const green = image.bitmap.data[idx+1]
        const blue = image.bitmap.data[idx+2]
        const alpha = image.bitmap.data[idx + 3] //Will always have a value regardless of format jpg or non alpha png. Defaults to 255 for non-alpha.
        const color: colorNumbers = [red, green, blue, alpha]
        if (alpha!==0) {
            data[y][x] = getFillColor(color, bundle).closestIndex
        } else {
            data[y][x] = -1
        }

    })
    // image.write('./')
    return data
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
    asArray(): any[] {
        return this.data
    }
  }
function distanceFlattened({targetColor, currentColor}: distanceColors) {
    if (targetColor.length !== 4 && currentColor.length !== 4) {
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
type getFillColorType = {
    closestColor: colorNumbers, 
    closestIndex: number
}
function getFillColor(currentColor: colorNumbers, colorsZipped: colorsBundled): getFillColorType{
    let closestColor: colorEntry = [0, 0, 0, 0]
    let closestDistance: number = 500
    let closestIndex: number = 0
    for (const targetBundle of colorsZipped) {
        const targetColor: colorNumbers = targetBundle.tcolor
        const tmpdistflat = distanceFlattened({currentColor, targetColor})
        if (closestDistance > tmpdistflat) {
            closestDistance = tmpdistflat
            closestColor = targetBundle.fcolor
            closestIndex = targetBundle.order
        }
    }
    return {closestColor, closestIndex}
}
async function recolorImage (image, bundle: colorsBundled) {
    // const bundle: colorsBundled = checkValues({fillColors: fillColors, targetColors: targetColors, fillTarget: fillTarget})
    // const tcolors: colorNumbers[] 

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        const red = image.bitmap.data[idx + 0]
        const green = image.bitmap.data[idx+1]
        const blue = image.bitmap.data[idx+2]
        const alpha = image.bitmap.data[idx + 3] //Will always have a value regardless of format jpg or non alpha png. Defaults to 255 for non-alpha.
        const color: colorNumbers = [red, green, blue, alpha]
        const filler = getFillColor(color, bundle).closestColor
   
        image.bitmap.data[idx+0] = filler[0]
        image.bitmap.data[idx+1] = filler[1]
        image.bitmap.data[idx+2] = filler[2]
        if (!(alpha === 0)) {
            image.bitmap.data[idx+3] = filler[3]
        }
    })
    // image.write('./')
    return image
}

 
    
    


function zipColors (fillColors: colorNumbers[], targetColors: colorNumbers[]): colorsBundled{
    let zip: colorsBundled = []
    const pq: PriorityQueue<number[]> = new PriorityQueue()
    for (const [row, fill] of fillColors.entries()) {
        for (const [col, target] of targetColors.entries()) {
            pq.enqueue([row, col], distanceFlattened({targetColor: fill, currentColor: target}))
        }
    }
  
    const colsInUse: number[] = []
    const rowsInUse: number[] = []
    while (colsInUse.length < targetColors.length) {
        const [row, col] = pq.dequeue() ?? []
        if(!(colsInUse.includes(col) || rowsInUse.includes(row))){
            zip.push({fcolor: fillColors[row], tcolor: targetColors[col], order: colsInUse.length})
            colsInUse.push(col)
            rowsInUse.push(row)
        }
    }

    return zip
}
   
    
function checkValues ({fillColors, targetColors, fillTarget}: checkTypes): colorsBundled{
    let fill: colorNumbers[] = []
    let target: colorNumbers[] = []
    
    if (fillColors === undefined && !(targetColors === undefined)) { //fill undef target def
        const gray: number = 255/(targetColors.length - 1 )
        fill = Array(targetColors.length).fill(0).map((_, i) => [i * gray, i * gray, i * gray, 255])
        for (const i in targetColors) {
            // fill[i] = colorCorrector(fillColors[i])
            target[i] = colorCorrector(targetColors[i])
        }
    } else if (!(fillColors === undefined) && targetColors === undefined) { //fill def target def
   
        const gray: number = 255/(fillColors.length - 1 )
        target = Array(fillColors.length).fill(0).map((_, i) => [i * gray, i * gray, i * gray, 255])
        for (const i in fillColors) {
            fill[i] = colorCorrector(fillColors[i])
        }
    
    } else if (!(fillColors===undefined || targetColors===undefined)) {
        for (const i in fillColors) {
            fill[i] = colorCorrector(fillColors[i])
            target[i] = colorCorrector(targetColors[i])
        }
    }
    let ftcolors: (colorsBundled | undefined)
    if (!(fillTarget===undefined)) { //fillTarget not undefined
        ftcolors = [] 
        for (const [index, tmpcolor] of fillTarget.entries()) {
            const tmpbundle = {fcolor: colorCorrector(tmpcolor.fcolor), tcolor: colorCorrector(tmpcolor.tcolor), order: index}
            ftcolors.push(tmpbundle)
        }
    } else {
        ftcolors = undefined
    }
    
    if ((fill.length === 0) && (target.length === 0) && !(ftcolors === undefined)) {
        return ftcolors
    } else if (!(fill.length === 0) && !(target.length === 0) && !(ftcolors === undefined)) {
        // const tmpArray = [...ftcolors, ...zipColors(fill, target)]
        const tcolorSet = new Set(ftcolors.map(obj => obj.tcolor))
        const zipped = zipColors(fill, target).filter(obj=> !tcolorSet.has(obj.tcolor))
        return [...ftcolors, ...zipped]
        
    } else if (!(fill.length === 0) && !(target.length === 0) && (ftcolors === undefined)) {
        return zipColors(fill, target)
    } else { //if ((fillColors === undefined) && (targetColors === undefined) && (ftcolors === undefined))
        return [
            {
                'tcolor': [...colorName['white'], 255],
                'fcolor': [...colorName['white'], 255],
                'order': 0
            },
            {
                'tcolor': [...colorName['black'], 255],
                'fcolor': [...colorName['black'], 255],
                'order': 1
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
function colorCorrector (color: colorEntry) : colorNumbers {
    let fin_color: colorNumbers
    if (typeof color === "string") {
        const tmpcolor: [number, number, number] = colorName[color]
        fin_color = [...tmpcolor, 255]
    } else if (isTripleOrQuad(color)) {
        if (color.length === 3) {
            return [...color, 255]
        }
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
// export default ChartMe