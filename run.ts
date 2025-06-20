import ChartMe from './ChartMe';
import {Jimp} from 'jimp'

const imagePath = './images/testImage.png'
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
const outputPath = './images/nearestNeighbor.png'
// PreProcessChart( {imagePath: imagePath, targetColors: filCo3} )
// PreProcessChart( {imagePath: imagePath, fillColors: filCo1} )

// PreProcessChart( {imagePath: imagePath, targetColors: filCo3, fillColors: filCo3} )
// PreProcessChart( {imagePath: imagePath, fillTarget: [{tcolor: 'red', fcolor: 'red'}, {tcolor: 'black', fcolor: 'green'}]} )//not working also coloring wrong change input so that its not bundledColors on entrance.
// PreProcessChart( {imagePath: imagePath, fillTarget: [{tcolor: [0, 0, 0, 255], fcolor: [255,0,0,255]}, {tcolor: [255, 255, 255, 255], fcolor: [255,255,255,255]}]} )
// recolorImage( {imagePath: imagePath, fillTarget: [{tcolor: 'black', fcolor: 'black'}, {tcolor: [150, 150, 150, 255], fcolor: 'white'}]} )

// getPreviewChart(image, {fillTarget: [{tcolor: 'black', fcolor: 'black'}, {tcolor: [150, 150, 150, 255], fcolor: 'white'}]} )
// ChartMe(imagePath, './data/data.txt', {fillTarget: [{tcolor: 'black', fcolor: 'black'}, {tcolor: [150, 150, 150, 255], fcolor: 'white'}]} )
const chart = await new ChartMe({image: image, fillTarget: [{tcolor: [0,0,0,255], fcolor: 'green'}, {tcolor: [150, 150, 150, 255], fcolor: 'red'}]}).load()
// chart.preview(outputPath)
chart.cleanData()
chart.preprocess()
// console.log(chart.processed[100])
// console.log(chart.data[100])

// console.log(chart.processed[150])
// console.log(chart.processed[249])
// console.log(chart.data[249])
chart.graph({})
// .catch(err => {
//   console.error('Error:', err);
// });