// const image
// import {Jimp} from 'jimp'
import { ResizeStrategy,JimpInstance } from 'jimp';
// import * as Jimp from 'jimp'
import colorName from 'color-name'
import * as d3 from "d3"
import { SplitStrategy } from '../constants/constants'
// import {saveJSON} from './node-utils'

// type JimpInstance = Jimp.JimpInstance;
// type JimpInstance = JimpType
// export enum ResizeStrategy {
//   NEAREST_NEIGHBOR = "nearestNeighbor",
//   BILINEAR = "bilinearInterpolation",
//   BICUBIC = "bicubicInterpolation",
//   HERMITE = "hermiteInterpolation",
//   BEZIER = "bezierInterpolation",
// }

type colorEntry = string | [number, number, number] | [number, number, number, number];
type colorBundleType = {
    [key: number] : colorType
}
type colorType = {
    fcolor: colorNumbers,
    tcolor: colorNumbers,
}
type colorPreBundled = {
    [key: number] : colorPreType
}
type colorPreType = {
    fcolor: colorEntry,
    tcolor: colorEntry 
}
type checkTypes = { 
    fillColors?: colorEntry[],
    targetColors?: colorEntry[],
    colorBundle?: colorPreBundled
} 
type colorNumbers = [number, number, number, number]
type distanceColors = {
    targetColor: colorNumbers
    currentColor: colorNumbers
}

type constructorType = {
    image?: any
    fillColors?: colorEntry[]
    targetColors?: colorEntry[]
    colorBundle?: colorPreBundled
    width?: (number|undefined)
    height?: (number|undefined)
    axisEnabled?: boolean|undefined
    // axisHeight?: number|undefined
    // axisWidth?: number|undefined
    xAxisSpacing?: number|undefined
    yAxisSpacing?: number|undefined
    xAxisTickSpacing?: number|undefined
    yAxisTickSpacing?: number|undefined
}
type graphType = {
        container: HTMLDivElement
        width?: number
        height?: number
        margin?: {[key: string]: number}
    }
type splitTypes = {
    splits?: number
    fillColors?: colorEntry[]
    targetColors?: colorEntry[]
    colorBundle?: colorPreBundled
    splitstrategy?: string
}
export default class ChartMe {
    image: any
    data: number[][]|undefined
    bundle: colorBundleType
    // fillColors: colorEntry[]
    // targetColors: colorEntry[]
    // bundledColors: colorPreBundled
    // imageheight: number
    // imagewidth: number
    // tocheck: number[]|undefined
    width: number|undefined
    height: number|undefined
    axisEnabled: boolean
    // axisHeight: number|undefined
    // axisWidth: number|undefined
    xAxisSpacing: number
    yAxisSpacing: number
    xAxisTickSpacing: number
    yAxisTickSpacing: number
    // processed: {[key: string]: number}[]
    processed: {[key: string]: number}[] | undefined
    
    constructor({image, fillColors, targetColors, colorBundle, width, height, axisEnabled, xAxisSpacing, yAxisSpacing, xAxisTickSpacing, yAxisTickSpacing}: constructorType) {
        if (axisEnabled) {
            this.axisEnabled = axisEnabled
        } else {
            this.axisEnabled = true
        }

        // this.axisHeight = axisHeight
        // this.axisWidth = axisWidth
        if (xAxisSpacing) {
            this.xAxisSpacing = xAxisSpacing
        } else {
            this.xAxisSpacing = 20
        }
        if (yAxisSpacing) {
            this.yAxisSpacing = yAxisSpacing
        } else {
            this.yAxisSpacing = 20
        }
        if (yAxisTickSpacing) {
            this.yAxisTickSpacing = yAxisTickSpacing
        } else {
            this.yAxisTickSpacing = this.yAxisSpacing
        }
        if (xAxisTickSpacing) {
            this.xAxisTickSpacing = xAxisTickSpacing
        } else {
            this.xAxisTickSpacing = this.xAxisSpacing
        }
        this.bundle = checkValues({fillColors,targetColors, colorBundle})
        this.image = image
        // let newHeight: number
        // let newWidth: number
        if (image) {
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
        // this.tocheck = [this.height -1 - 136,this.height - 1 - 137, this.height - 1 - 138]
        // if (this.height) {    
        //     this.tocheck = [this.height - 1 - 161]
        // }
        
    }
    async load() {
        
        if (this.image) {
            const value = ResizeStrategy.NEAREST_NEIGHBOR
            await recolorImage(this.image, this.bundle)
            this.image.resize({w: this.width, h:this.height, mode: value})
            this.data = datafy(this.image, this.bundle)
        } else {
            throw new Error("Image is undefined. If you are loading from file no need to call load(). Just use loadFile()")
        }
        // const value = ResizeStrategy.NEAREST_NEIGHBOR
        // await recolorImage(this.image, this.bundle)
        // this.image.resize({w: this.width, h:this.height, mode: value})
        // this.data = datafy(this.image, this.bundle)

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

    preprocess() {
        if (!this.data) {
            throw new Error("this.data undefined try calling load after calling new ChartMe")
        }
        const processedArr: {[key: string]: number}[] = []
        const bundlekeys: string[] = Object.keys(this.bundle)
        // let prevsum: number|undefined 
        for (const [j, row] of this.data.entries()) {
            const rowData: {[key: string]: number} = Object.fromEntries(bundlekeys.map(key => [key, 0]))
            for (const x of row) {
                // let rownum: number = rowData[x.toString()]
                if (x !== -1 ){
                    rowData[x.toString()] = rowData[x.toString()] + 1
                } 
            }
            // const currentsum: number = Object.values(rowData).reduce((acc, val) => acc + val, 0)
            // const unique: number[] = Array.from(new Set(row))
            // const nums: string = unique.map(n => `num ${n}: ${row.filter(v=>v===n).length}`).join(", ")
            // prevsum = currentsum
            rowData.order = this.image.height - j - 1
            processedArr.push(rowData)
        }
        this.processed = processedArr
        // this.processed = preprocess2electricbugalu(processedArr)
    }
    async saveFile(path: string) {
        const towrite: Object = {processed: this.processed, bundle: this.bundle, height: this.height, width: this.width}
        // const { saveJSON } = await import(`../server/saveJSON`);
        const saveJSON = typeof window === 'undefined' 
            ? (await import('../server/saveJSON')).saveJSON 
            : () => { throw new Error('saveJSON only works on server'); }
        await saveJSON(towrite, path);        
    }
    async loadJSON(data: any) {
        this.processed = data['processed']
            this.bundle = data['bundle']
            this.height = data['height']
            this.width = data['width']
    }
    async loadFile(path: string) {
        // console.log('CHARTMERUN')
        try {
            const res = await fetch(path);
            const data = await res.json();
            this.loadJSON(data)
            // console.log(`in load file - this.processed: ${this.processed}, this.width: ${this.width}, this.height: ${this.height}`)
        } catch(err){
            console.error("Error reading JSON:", err)
        }
        
    }
    splitColors({splits, fillColors, targetColors, colorBundle, splitstrategy}: splitTypes) {
        // const newSplits: number 

        let newbundle: colorBundleType
        if (!this.data) {
            throw new Error("this.data undefined try calling load() if you are loading from image")
        }
        if (((fillColors!==undefined&&targetColors!==undefined)||colorBundle!==undefined)&&!((fillColors!==undefined&&targetColors!==undefined)&&colorBundle!==undefined)){
            newbundle = checkValues({fillColors, targetColors, colorBundle})
        } else if ((fillColors!==undefined&&targetColors===undefined)||(fillColors===undefined&&targetColors!==undefined)) {
            throw new Error("fillColors and targetColors in conjuction.")
        } else if ((fillColors!==undefined||targetColors!==undefined)&&colorBundle!==undefined) {
            throw new Error("Use either fillColors and targetColors or bundledColors.")
        } else {
            newbundle = this.bundle
        }
            
        let newSplits: number
        if (splits === undefined) {
            newSplits = 1
        } else {
            newSplits = splits
        }
        const newData: number[][] = []
        //Start processing Image info
        if (Object.values(SplitStrategy).includes(splitstrategy as SplitStrategy)) {
                console.log("WARNING: splitstrategy did not match any known split strategy defaulting to splitstrategy dominant.")
            }
        for (const [_, row] of this.data.entries()) {
            const segments: {[key: number]: PriorityQueue<[number,number]>} = biggestSegments(row)

            const longSegs: PriorityQueue<{[key: string]: number[]}> = new PriorityQueue
            for (const k of Object.keys(segments)) {
                for (let i=0; i < newSplits + 1; i++) {
                    const dequed: number[] | undefined = segments[Number(k)].dequeue()
                    if (!(dequed === undefined)) {
                        const tmp: {[key: string]: number[]} = {[k]: dequed}//check these lines longSegs is empty
                        longSegs.enqueue(tmp, dequed[0])
                    } else  {
                        break
                    } //Can proprotionately adjust so for every white in a segement I just add a white in length to the white segement in that area or I could do the most prominent color in the region or some combo of the two
                }///Have to figure out how to maintain shape of object with graph could be cutting off edges if segments arent long there
            }
            let prevcolorinfo: Object|undefined
            let prevkey: string | undefined
            for (let i=0; i < longSegs.data.length; i++) {
                const colorinfo: Object = longSegs.data[i].item
                const currentkey: string = Object.keys(colorinfo)[0]
                if (prevcolorinfo!==undefined && (currentkey===prevkey)) {
                  
                    if (longSegs.data[i].item[currentkey][0] > longSegs.data[i-1].item[currentkey][0]) {
                        longSegs.data[i].item[currentkey][0] = longSegs.data[i-1].item[currentkey][0]
                    }
               
                    
                    if (longSegs.data[i].item[currentkey][1] < longSegs.data[i-1].item[currentkey][1]) {
                        longSegs.data[i].item[currentkey][1] = longSegs.data[i-1].item[currentkey][1]
                    }
                    
                    longSegs.data.splice(i-1, 1)
                    longSegs.data[i-1].priority = longSegs.data[i-1].item[currentkey][0]
                    const dequed: number[] | undefined = segments[Number(currentkey)].dequeue()
                    if (!(dequed === undefined)) {
                        const tmp: {[key: string]: number[]} = {[currentkey]: dequed}//check these lines longSegs is empty
                        longSegs.enqueue(tmp, dequed[0])
                    }
                    i = -1
                    prevcolorinfo = undefined
                    prevkey = undefined
                } else if (prevcolorinfo!==undefined && prevkey!==undefined && longSegs.data[i].item[currentkey][1] < longSegs.data[i-1].item[prevkey][1]) {
                    longSegs.data.splice(i, 1)
                    
                    i = -1
                    prevcolorinfo = undefined
                    prevkey = undefined
                    // prevcolorinfo = colorinfo
                    // prevkey = currentkey
                } else {
 
                    prevcolorinfo = colorinfo
                    prevkey = currentkey
                }
            }
            
            let prev = longSegs.dequeue()

             const completeSegments:{[key: string]: number[]}[] = []
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
  
                            current[currentKey][0] = prev[prevKey][1] + 1

                        } else if (splitstrategy===SplitStrategy.PROPORTIONAL) { //just shift pixels excess to sides 
                            const rowSeg: number[] = row.slice(prevIndexStart + 1, currentIndexEnd) 
                            const valuesDict:{[key: number]: number} = {}
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
                                prevAdjust = valuesDict[Number(prevKey)]
                            }
                            if(currentKey in valuesDict) {
                                currentAdjust = valuesDict[Number(currentKey)]
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
                            const newPrev: number = prevIndexStart + Math.floor(((currentIndexEnd-prevIndexStart)/2))
                            prev[prevKey][1] = newPrev
                            current[currentKey][0] = newPrev + 1
                        } else { //Dominant
                            const rowSeg: number[] = row.slice(prevIndexStart + 1, currentIndexEnd) 
                            const valuesDict:{[key: number]: number} = {}
                            for (const value of rowSeg) {
                                if(!(value in valuesDict)) {
                                    valuesDict[value] = 0
                                } else {
                                    valuesDict[value] = valuesDict[value] + 1
                                }
                            }
                            
                            if (valuesDict[Number(prevKey)] > valuesDict[Number(currentKey)]) {
                                prev[prevKey][1] = prev[prevKey][1] + rowSeg.length
                            } else {
                                current[currentKey][0] = current[currentKey][0] - rowSeg.length 
                            }
  
                        }
                
                    }
                    
                    completeSegments.push(prev)
                    prev = current    
                    if (longSegs.isEmpty()) {       
                        completeSegments.push(current)
                    }
                }
                
            } else if (prev) {
                completeSegments.push(prev)
            } else {
                throw new Error("prev empty")
            }
            
            const arrayToReturn:number[] = []
            // const arraySegmentUsed: string[] = []
            const keysInUse: number[] = []
            for(const segment of completeSegments) {
                const key = Object.keys(segment)[0]
                const numkey = Number(key)
                const range = segment[key]

                if(!keysInUse.includes(numkey)&&keysInUse.every(n=> numkey > n)) {
                    keysInUse.push(numkey)
                    arrayToReturn.push(...Array(range[1] - range[0] + 1).fill(numkey))
                } else {
                    for (const newkey of Object.keys(newbundle)) {
                        let newnumkey: number = numkey
                        if (newkey===key) {
                          
                            while(keysInUse.includes(newnumkey)||!keysInUse.every(n=> newnumkey > n)) {
                                newnumkey += 200        
                            }
                            keysInUse.push(newnumkey)
                            arrayToReturn.push(...Array(range[1] - range[0] + 1).fill(newnumkey))   
                            this.bundle[newnumkey] = newbundle[Number(key)]
                            break
                        }
                    }
                }
            } //Gotta assign bundle stuff before hand create new order stuff
            newData.push(arrayToReturn)
            
            // newData.push(newRow)
        } ///End processing image data start bundle shit....... If ahve user interface just manditorily ask about different colors maybe limit the split to 2 colors. Could also add little squares at the bottom or something to inidacate the color. So maybe you could select x color designate the color.
        ///Maybe make it so split doesnt affect all colors? idk would be a hastle. Also generally makes color changing more unform
        ///now tha tI think of it I could probably make another setting if I wanted to do that for for image editing or what not but I think that I could probably be fine without it for now unless people or /te want to use it
        ///Front end could also ask about which color to edit and if there is any missing data it auto fills it? sounds kinda slow idk.
        // console.log('this.data')
        // this.data.forEach(row => console.log(JSON.stringify(row)));
        // console.log('newData')
        // for (const [i, row] of newData.entries()) {
        //     console.log(i)
        //     console.log(JSON.stringify(row))
        // }
        // console.log('thisbundle')
        // console.log(this.bundle)
        this.data = newData
        ///
    }
    
    cleanData() {
        if (this.data) {
            const newData: number[][] = []
            for (const [_, row] of this.data.entries()) {
                const newRow: number[] = cleanRow(row)
                newData.push(newRow)
            }
            this.data = newData
        } else {
            throw new Error("this.data undefined")
        }
    }
    
    graph({container, width, height, margin}: graphType) {
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
        if (!this.processed || !this.width || !this.height) {
            throw new Error("this.processed, this.width, or this.height undefined undefined")
            }

        const keys = Object.keys(this.processed[0]).filter(k => k !== "order");
        const mycolors = Object.values(this.bundle).map(pair => `rgba(${pair.fcolor.join(",")})`)
        const svg = d3.select(container)
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

        var y = d3.scaleBand()
            .domain(this.processed.map(d => d.order.toString()).reverse())
            .range([ height,0 ]).padding(.40);
        if (this.axisEnabled) {
            svg.append("g")
            .call(d3.axisLeft(y)
            .tickFormat(d => (+d % this.yAxisSpacing === 0 ? d: "")))
            .selectAll(".tick line")
            .style("display", (_, i) => (i%this.yAxisTickSpacing===0?"block":"none"));
        }
        // var yAxis = d3.axisLeft(y)
        var x = d3.scaleLinear()
            .domain([0, this.width])
            .range([0, width])
        if (this.axisEnabled) {
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x)
                .tickFormat(d => (+d % this.xAxisSpacing === 0 ? d.toString(): "")))
                .selectAll<SVGLineElement, number>(".tick line")
                .style("display", (d) => d % this.xAxisTickSpacing===0?"block":"none");
        }
            // .style("display", (_, i) => (i%20===0?"block":"none"));
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
                // .attr("x", d => x(d[0]))
                .attr("x", 0)                
                .attr("y", d => y(d.data.order.toString())!)
                .attr("width", d => x(d[1]) - x(d[0]))
                .attr("height", y.bandwidth())
                .transition()
                .duration(1800)
                .attr("x", d => x(d[0]))
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

function biggestSegments(row: number[]): {[key: number]: PriorityQueue<[number, number]>} {
    const segmentDict: {[key: number]: PriorityQueue<[number, number]>} = {}
    let startIndex: number = 0
    let endIndex: number = 0
    for (const [index, _] of row.entries()) {
        if (!(row[index] in segmentDict)) {
            segmentDict[row[index]] = new PriorityQueue<[number, number]>
        }
        if (index===0 || (row[index] !== row[index-1])) {
            if (index!==0) {
                segmentDict[row[index-1]].enqueue([startIndex, endIndex], startIndex - endIndex)
            }
            startIndex = index
            endIndex = index //a segement of one pixel will have the same start and end index
        } else {
            endIndex = index 
            if (index===row.length-1) {
                segmentDict[row[index-1]].enqueue([startIndex, endIndex], startIndex - endIndex)
            }
        }
    }
    return segmentDict
}

function datafy(image: JimpInstance, bundle: colorBundleType): number[][]{
    const data: number[][] = Array.from({ length: image.height}, () => Array(image.width).fill(null))

    // image.write('./images/whyblue.png')
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {


        const red = image.bitmap.data[idx + 0]
        const green = image.bitmap.data[idx+1]
        const blue = image.bitmap.data[idx+2]
        const alpha = image.bitmap.data[idx + 3] //Will always have a value regardless of format jpg or non alpha png. Defaults to 255 for non-alpha.
        const color: colorNumbers = [red, green, blue, alpha]
        if (alpha!==0) {
            for (const key of Object.keys(bundle)) {
                const pair: colorType = bundle[Number(key)] 
                if (pair.fcolor.every((val, i) => val === color[i])){
                    data[y][x] = Number(key)
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
function euclideanDistance(a: number[], b: number[]) {
    if (a.length !== b.length) {
      throw new Error("Points must have the same number of dimensions");
    }
    return Math.sqrt(
      a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0)
    );
}
class PriorityQueue<T> {
    data: { item: T, priority: number }[] = [];
  
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
function getFillColor(currentColor: colorNumbers, colorsZipped: colorBundleType): getFillColorType{
    let closestColor: colorEntry = [0, 0, 0, 0]
    let closestDistance: number = 500
    let closestIndex: number = 0
    for (const key of Object.keys(colorsZipped)) {
        const targetBundle: colorType = colorsZipped[Number(key)]
        const targetColor: colorNumbers = targetBundle.tcolor
        const tmpdistflat = distanceFlattened({currentColor, targetColor})
        if (closestDistance > tmpdistflat) {
            closestDistance = tmpdistflat
            closestColor = targetBundle.fcolor
            closestIndex = Number(key)
        }
    }
    return {closestColor, closestIndex}
}
async function recolorImage (image: JimpInstance, bundle: colorBundleType) {

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (_, __, idx) => {
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

 
    
    


function zipColors (fillColors: colorNumbers[], targetColors: colorNumbers[]): colorBundleType{
    let zip: colorBundleType = {}
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
            zip[colsInUse.length] = {fcolor: fillColors[row], tcolor: targetColors[col]}
            colsInUse.push(col)
            rowsInUse.push(row)
        }
    }

    return zip
}
   
    
function checkValues ({fillColors, targetColors, colorBundle}: checkTypes): colorBundleType{
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
    let ftcolors: (colorBundleType | undefined)
    if (!(colorBundle===undefined)) { //fillTarget not undefined
        ftcolors = {} 
        for (const key of Object.keys(colorBundle)) {
            const tmpcolor: colorPreType = colorBundle[Number(key)] 
            const tmpbundle = {fcolor: colorCorrector(tmpcolor.fcolor), tcolor: colorCorrector(tmpcolor.tcolor)}
            ftcolors[Number(key)] = tmpbundle
        }
    } 
    
    if ((fill.length === 0) && (target.length === 0) && !(ftcolors === undefined)) {
        return ftcolors
    } else if (!(fill.length === 0) && !(target.length === 0) && !(ftcolors === undefined)) {
        // const tmpArray = [...ftcolors, ...zipColors(fill, target)]
        const tcolorSet = new Set(Object.entries(ftcolors).map(([_, obj]) => obj.tcolor))
        const zipped: colorBundleType = Object.fromEntries(Object.entries(zipColors(fill, target)).filter(([_, obj])=> !tcolorSet.has(obj.tcolor)))
        return {...zipped, ...ftcolors}
        
    } else if (!(fill.length === 0) && !(target.length === 0) && (ftcolors === undefined)) {
        return zipColors(fill, target)
    } else { //if ((fillColors === undefined) && (targetColors === undefined) && (ftcolors === undefined))
        const color0: colorType = {
                    'tcolor': [...colorName['white'], 255],
                    'fcolor': [...colorName['white'], 255],
                }
        const color1: colorType = {
                    'tcolor': [...colorName['black'], 255],
                    'fcolor': [...colorName['black'], 255],
                }
        const returnbundle = {0: color0, 1: color1}
        
        return returnbundle
    }
}
function cleanRow(row:number[]): number[] {
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
type ColorKey = keyof typeof colorName
function colorCorrector (color: colorEntry) : colorNumbers {
    let fin_color: colorNumbers
    if (typeof color === "string") {
        const tmpcolor: [number, number, number] = colorName[color as ColorKey]
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