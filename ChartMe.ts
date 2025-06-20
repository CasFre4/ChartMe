import { Jimp, ResizeStrategy } from 'jimp'
import colorName from 'color-name'
import * as d3 from "d3"
import { SplitStrategy } from './constants'



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
    bundledColors?: colorPreBundled[]
} 
type colorNumbers = [number, number, number, number]
type distanceColors = {
    targetColor: colorNumbers
    currentColor: colorNumbers
}

type constructorType = {
    image: any
    fillColors?: colorEntry[]
    targetColors?: colorEntry[]
    bundledColors?: colorPreBundled[]
    width?: (number|undefined)
    height?: (number|undefined)
}
type graphType = {
        width?: number
        height?: number
        margin?: {[key: string]: number}
    }
type splitTypes = {
    splits?: number
    fillColors?: colorEntry[]
    targetColors?: colorEntry[]
    bundledColors?: colorsBundled
    splitstrategy?: string
}
export default class ChartMe {
    image: any
    data: number[][]
    bundle: colorsBundled
    // fillColors: colorEntry[]
    // targetColors: colorEntry[]
    // bundledColors: colorPreBundled[]
    width: number
    height: number
    // processed: {[key: string]: number}[]
    processed: {[key: string]: number}[]
    
    constructor({image, fillColors, targetColors, bundledColors, width, height}: constructorType) {
        this.bundle = checkValues({fillColors,targetColors, bundledColors})
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
        // console.log(this.data[50])
        // console.log(this.data[150])
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
                    rowData[x.toString()] = rowData[x.toString()] + 1
                } 
            }
            rowData.order = this.image.height - j
            processedArr.push(rowData)
        }
        this.processed = processedArr
        // this.processed = preprocess2electricbugalu(processedArr)
    }
    splitColors({splits, fillColors, targetColors, bundledColors, splitstrategy}: splitTypes) {
        // const newSplits: number 

        
            
        let newSplits: number
        if (splits === undefined) {
            newSplits = 1
        } else {
            newSplits = splits
        }
        const newData: number[][] = []
        //Start processing Image info
        for (const [j, row] of this.data.entries()) {
            const segments = biggestSegments(row) ///we will iterate through when we reach a new color we will measure how far it goes set a range then with the new color will do the same we will have a dict color index then for each index it will be an array of tuples with the range we graph the largest range for each color we will order them based smallest index then if there are gaps we will replace the beginning of the prev segment with half of whats missing and the beginning of next subtract half of whats missing
            const longSegs: PriorityQueue<Object> = new PriorityQueue
            for (const k of Object.keys(segments)) {
                for (let i; i < newSplits ; i++) {
                    const dequed: number[] | undefined = segments[k].dequeue()
                    if (!(dequed === undefined)) {
                        const tmp: {[key: string]: number[]} = {[k]: dequed}

                        longSegs.enqueue(tmp, dequed[0])
                    } else  {
                        break
                    } //Can proprotionately adjust so for every white in a segement I just add a white in length to the white segement in that area or I could do the most prominent color in the region or some combo of the two
                }///Have to figure out how to maintain shape of object with graph could be cutting off edges if segments arent long there
            }
            const completeSegments:Object[] = []
            let prev = longSegs.dequeue()
            if (!longSegs.isEmpty() && prev!==undefined) {
                while (!longSegs.isEmpty()) {
                    const current = longSegs.dequeue()
                    if (current===undefined) {
                        throw new Error("Segment processing error")
                    } else {
                        const prevKey: string = Object.keys(prev)[0]
                        const currentKey: string = Object.keys(current)[0]
                        const prevIndexStart: number = prev[prevKey][1]
                        const currentIndexEnd: number = current[currentKey][0]
                        if (prevKey === currentKey) {
                            // const prevIndex: number = prev[prevKey][1]
                            // const currentIndex: number = current[currentKey][0]
                            // const newPrev: number = prevIndex + Math.floor(((currentIndex-prevIndex)/2))
                            // prev[prevKey][1] = newPrev
                            current[currentKey][0] = prev[prevKey][1] + 1
                        } else if (splitstrategy===SplitStrategy.PROPORTIONAL) { //just shift pixels excess to sides 
                            // const segRange = [prevIndexStart + 1, currentIndexEnd]
                            const rowSeg: number[] = row.slice(prevIndexStart + 1, currentIndexEnd) 
                            const valuesDict:Object = {}
                            let prevAdjust: number = 0
                            let currentAdjust: number = 0
                            for (const value of rowSeg) {
                                if(!(value in valuesDict)) {
                                    valuesDict[value] = 0
                                } else {
                                    valuesDict[value] = valuesDict[value] + 1
                                }
                            }
                            if (prevKey in valuesDict) {
                                prevAdjust = valuesDict[prevKey]
                            }
                            if(currentKey in valuesDict) {
                                currentAdjust = valuesDict[currentKey]
                            }
                            if (prevAdjust + currentAdjust !== rowSeg.length) {
                                if ((prevAdjust + currentAdjust)%2!==0) {
                                    ++prevAdjust
                                }
                                const difference: number = (rowSeg.length - prevAdjust - currentAdjust)/2
                                prevAdjust = prevAdjust + difference
                                currentAdjust = currentAdjust + difference
                            }
                            prev[prevKey][1] = prev[prevKey][1] + prevAdjust
                            current[currentKey][0] = current[currentKey][0] - currentAdjust
                            
                        } else if (splitstrategy===SplitStrategy.HALF) { //half of first and half of second color
                            // const prevIndex: number = prev[prevKey][1]
                            // const currentIndex: number = current[currentKey][0]
                            const newPrev: number = prevIndexStart + Math.floor(((currentIndexEnd-prevIndexStart)/2))
                            prev[prevKey][1] = newPrev
                            current[currentKey][0] = newPrev + 1
                        } else { //Dominant
                            if (splitstrategy!==SplitStrategy.DOMINANT) {
                                console.log("WARNING: splitstrategy did not match any known split strategy defaulting to splitstrategy dominant.")
                            }
                            const rowSeg: number[] = row.slice(prevIndexStart + 1, currentIndexEnd) 
                            const valuesDict:Object = {}
                            for (const value of rowSeg) {
                                if(!(value in valuesDict)) {
                                    valuesDict[value] = 0
                                } else {
                                    valuesDict[value] = valuesDict[value] + 1
                                }
                            }
                            if (valuesDict[prevKey] > valuesDict[currentKey]) {
                                prev[prevKey][1] = prev[prevKey][1] + rowSeg.length
                            } else {
                                current[currentKey][0] = current[prevKey][0] - rowSeg.length 
                            }
                        }
                        
                    }
                    completeSegments.push(prev)
                    prev = current    
                    if (longSegs.isEmpty()) {
                        completeSegments.push(current)
                    }
                }
                
            } else {
               newData.push(row) 
            }
            // newData.push(newRow)
        } ///End processing image data start bundle shit....... If ahve user interface just manditorily ask about different colors maybe limit the split to 2 colors. Could also add little squares at the bottom or something to inidacate the color. So maybe you could select x color designate the color.
        ///Maybe make it so split doesnt affect all colors? idk would be a hastle. Also generally makes color changing more unform
        ///now tha tI think of it I could probably make another setting if I wanted to do that for for image editing or what not but I think that I could probably be fine without it for now unless people or /te want to use it
        ///Front end could also ask about which color to edit and if there is any missing data it auto fills it? sounds kinda slow idk.
        let bundle: colorsBundled

        if (((fillColors!==undefined&&targetColors!==undefined)||bundledColors!==undefined)&&!((fillColors!==undefined&&targetColors!==undefined)&&bundledColors!==undefined)){
            bundle = checkValues({fillColors, targetColors, bundledColors})
        } else if ((fillColors!==undefined&&targetColors===undefined)||(fillColors===undefined&&targetColors!==undefined)) {
            throw new Error("fillColors and targetColors in conjuction.")
        } else if ((fillColors!==undefined||targetColors!==undefined)&&bundledColors!==undefined) {
            throw new Error("Use either fillColors and targetColors or bundledColors.")
        } else {
            bundle = this.bundle
        }
        
        this.data = newData
        ///
    }
    
    cleanData() {
        const newData: number[][] = []
        for (const [j, row] of this.data.entries()) {
            const newRow: number[] = this.cleanRow(row)
            newData.push(newRow)
        }
        this.data = newData
    }
    cleanRow(row:number[]): number[] {
        const newRow: number[] = []
        for (const [i, x] of row.entries()) {
            // const x: number = row[i]
            if (i===0) {
                newRow.push(row[i+1])
                continue
            }
            // const next: number = row[i+1]
            if(i===row.length-1) {
                newRow.push(row[i-1])
                continue
            }
            const prev: number = row[i-1]
            const next: number = row[i+1]
            if (x!==prev && x!==next && prev===next) {
                newRow.push(next)
            } else if (next===-1 && prev!==-1 && x!==-1) {
                newRow.push(prev)
            } else {
                newRow.push(x)
            }
            
        }
        return newRow
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
            width = 2*this.image.width - margin.right - margin.left
        }
        if (height===undefined) {
            height = 2*this.image.height - margin.top - margin.bottom
        }
        
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
function biggestSegments(row: number[]) {
    const segmentDict: Object = {}
    let startIndex: number = 0
    let endIndex: number = 0
    for (const [index, value] of row.entries()) {
        if (!(row[index] in segmentDict)) {
            segmentDict[row[index]] = new PriorityQueue
        }
        if (index===0 || !(segmentDict[index] === segmentDict[index-1])) {
            if (index!==0) {
                segmentDict[row[index]].enqueue([startIndex, endIndex], startIndex - endIndex)
            }
            startIndex = index
            endIndex = index //a segement of one pixel will have the same start and end index
        } else {
            endIndex = index 
        }
    }
    return segmentDict
}
function segmentToRow(segemnts) {
    
}
function datafy(image, bundle: colorsBundled): number[][]{
    const data: number[][] = Array.from({ length: image.height}, () => Array(image.length).fill(null))
    // console.log(data)
    // console.log('bundle')
    // console.log(bundle)
    // image.write('./images/whyblue.png')
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        // console.log(`x: ${x}, y: ${y}`)
        // data.push()

        const red = image.bitmap.data[idx + 0]
        const green = image.bitmap.data[idx+1]
        const blue = image.bitmap.data[idx+2]
        const alpha = image.bitmap.data[idx + 3] //Will always have a value regardless of format jpg or non alpha png. Defaults to 255 for non-alpha.
        const color: colorNumbers = [red, green, blue, alpha]
        if (alpha!==0) {
            // console.log('color')
            // console.log(color)
            // return
            // console.log(getFillColor(color, bundle))
            // data[y][x] = getFillColor(color, bundle).closestIndex
            for (const pair of bundle) {
                if (pair.fcolor.every((val, i) => val === color[i])){
                    data[y][x] = pair.order
                    break
                }
            }
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
   
    
function checkValues ({fillColors, targetColors, bundledColors}: checkTypes): colorsBundled{
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
    if (!(bundledColors===undefined)) { //fillTarget not undefined
        ftcolors = [] 
        for (const [index, tmpcolor] of bundledColors.entries()) {
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