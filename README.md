# ChartMe: Image to chart generation.

**ChartMe** is a TypeScript library designed to take in an image and turn it into a chart while also providing customization options. 

## Features
- Recoloring images using proximity to color.
- Filtering a processed image to filter for outliers.
- Saving and loading preprocessed graph data.
- Recoloring following same colored segments.

## Installation

You can install the `chartme` package using `npm`:

```bash
npm install chartme
```

# Getting Started
### 1. Imports
```js
import ChartMe from 'chartme'
import {Jimp} from 'jimp'
```
### 2. Saving a model
```js
const image = await Jimp.read(imagePath)
const chart = await new ChartMe({image: image, colorBundle: [
    {tcolor: [0,0,0,255], fcolor: 'green'},
    {tcolor: [50,50,50,255], fcolor: 'yellow'},
    {tcolor: [100, 100, 100, 255], fcolor: 'red'},
    {tcolor: [150,150,150,255], fcolor: 'black'}],
    height: image.height/20, width: image.width/20})
    .load()//height and width define image resizing.
chart.cleanData()
chart.splitColors({splits: 3})
chart.preprocess()
chart.saveFile('./data.json')
```
<details>
<summary> Click to view chart </summary>
![Example Chart]()
</details>
### 3. Displaying graph
#### With saved file
```js
const chart = new ChartMe({})
await chart.loadFile('./data.json')
chart.graph({height: 190, width: 120})//height and width define size of chart
```
#### Without save file
```js
const image = await Jimp.read(imagePath)
const chart = await new ChartMe({image: image, colorBundle: [
    {tcolor: [0,0,0,255], fcolor: 'purple'},
    {tcolor: [100,100,100,255], fcolor: 'red'},
    {tcolor: [150, 150, 150, 255], fcolor: 'yellow'}]}).load()
chart.cleanData()
chart.splitColors({splits: 3})
chart.preprocess()
chart.graph({height: 190, width: 120})
```