import ChartMe, {PreProcessChart} from './ChartMe';

const imagePath = './images/testImage.png'

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
const fillColors = ['red', 'black']
const targetColors = ['white', 'blue']
PreProcessChart( {imagePath: imagePath, targetColors: fillColors} )
.catch(err => {
  console.error('Error:', err);
});