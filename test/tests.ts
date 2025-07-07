import ChartMe from '../src/ChartMe';
// import * as Jimp from 'jimp';
import { Jimp } from 'jimp';
// import { default as Jimp} from 'jimp'
// async function main () {
const imagePath = './images/reddragonedited.png'
const image = await Jimp.read(imagePath)
// get the image path from command line arguments
// const imagePath = process.argv[2];


if (!imagePath) {
  console.error('Please provide the image path as an argument.');
  process.exit(1);
}

// ChartMe( imagePath, 'red', [ 1 , 2 ,3 ] )
//   .catch(err => {
//     console.error('Error:', err);
//   });

const filCo0 = ['red', 'white']
const filCo1 = ['white', 'red', 'grey', 'green']

const filCo2 = ['red', 'black']
const filCo3 = ['black', 'red']
const targetColors = ['white', 'blue']
const outputPath = '../images/nearestNeighbor.png'
// PreProcessChart( {imagePath: imagePath, targetColors: filCo3} )
// PreProcessChart( {imagePath: imagePath, fillColors: filCo1} )

// PreProcessChart( {imagePath: imagePath, targetColors: filCo3, fillColors: filCo3} )
// PreProcessChart( {imagePath: imagePath, fillTarget: [{tcolor: 'red', fcolor: 'red'}, {tcolor: 'black', fcolor: 'green'}]} )//not working also coloring wrong change input so that its not bundledColors on entrance.
// PreProcessChart( {imagePath: imagePath, fillTarget: [{tcolor: [0, 0, 0, 255], fcolor: [255,0,0,255]}, {tcolor: [255, 255, 255, 255], fcolor: [255,255,255,255]}]} )
// recolorImage( {imagePath: imagePath, fillTarget: [{tcolor: 'black', fcolor: 'black'}, {tcolor: [150, 150, 150, 255], fcolor: 'white'}]} )

// getPreviewChart(image, {fillTarget: [{tcolor: 'black', fcolor: 'black'}, {tcolor: [150, 150, 150, 255], fcolor: 'white'}]} )
// ChartMe(imagePath, './data/data.txt', {fillTarget: [{tcolor: 'black', fcolor: 'black'}, {tcolor: [150, 150, 150, 255], fcolor: 'white'}]} )
// console.log('dont forget that the color maybe shouldnt depend on being first or second but more so on if it comes after another color?')
// console.log('10 followed by 0 and 1 followed by 11 on some lines in new data. line 54,55 probably check before hand to see if connected segements also this.bundle uses 0 1 11 10 but this.processed was using 0 1 2 3')
// console.log('split isnt splitting looks like its just nabbing 2 largest segments maybe?')
//4 colors
const defaultprop: number = 1/10
const proportion: number = 5
// console.log(image.height)
const newprop = defaultprop * proportion

//4 colors
// const chart = await new ChartMe({image: image, colorBundle: [{tcolor: [0,0,0,255], fcolor: 'green'}, {tcolor: [50,50,50,255], fcolor: 'yellow'}, {tcolor: [100, 100, 100, 255], fcolor: 'red'}, {tcolor: [150,150,150,255], fcolor: 'black'}], height: image.height * newprop, width: image.width * newprop}).load()
//3 colors 
// const chart = await new ChartMe({image: image, colorBundle: [{tcolor: [0,0,0,255], fcolor: 'blue'}, {tcolor: [100, 100, 100, 255], fcolor: 'red'}, {tcolor: [150,150,150,255], fcolor: 'black'}]}).load()
//3 colors but with modified height and width 4/5ths
// const chart = await new ChartMe({image: image, colorBundle: [{tcolor: [0,0,0,255], fcolor: 'green'}, {tcolor: [100,100,100,255], fcolor: 'black'}, {tcolor: [150, 150, 150, 255], fcolor: 'red'}], height: 200, width: 144}).load()

//twocolors also modified height and width to be 4/5 standard size
// const chart = await new ChartMe({image: image, colorBundle: [{tcolor: [0,0,0,255], fcolor: 'green'}, {tcolor: [100, 100, 100, 255], fcolor: 'red'}]}).load()
// chart.preview(outputPath)


image.flip({horizontal: true})
const chart = await new ChartMe({image: image, colorBundle: 
  [{tcolor: [50,51,50,255], fcolor: 'grey'},
  {tcolor: [33,28,25,255], fcolor: 'black'},
  {tcolor: [85,24,24,255], fcolor: 'red'},
  {tcolor: [100, 100, 100, 255], fcolor: 'yellow'},
  {tcolor: [150, 150, 150, 255], fcolor: 'blue'},
  ], height: image.height * newprop, width: image.width * newprop}).load()
chart.cleanData()
chart.splitColors({splits: 5})///change split so that it creates a color for every possible position
// chart.splitColors({splits: 4, colorBundle:
//   [{tcolor: [0,0,0,255], fcolor: 'lime'},
//   {tcolor: [50,50,50,255], fcolor: 'grey'},
//   {tcolor: [150, 150, 150, 255], fcolor: 'blue'},
//   {tcolor: [100,100,100,255], fcolor: 'magenta'}]})

chart.preprocess()

// chart.saveFile('./data.json')


// const chart = new ChartMe({})
// await chart.loadFile('./data.json')
// console.log(chart.processed)
const container = document.getElementById('my_dataviz')
if (container && container instanceof HTMLDivElement) {
  chart.graph({container: container, height: image.height/newprop - 20 - 40, width: image.width/newprop - 20 - 40})
}
// .catch(err => {
//   console.error('Error:', err);
// });
///0: green; 1: red; 2: black;
//While false start
// }
// main()