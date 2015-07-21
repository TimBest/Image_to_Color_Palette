# Image to Color Palette

A Javascript library the takes an image and outputs the most dominate colors. Future plans involve rebuilding the library and adding a function that will turn the dominant colors into a sensible color scheme. --- http://www.timbest.net/Image_to_Color_Palette/

## Installation

Download:
[.zip](https://github.com/TimothyBest/Image_to_Color_Palette/zipball/master)
or
[.tar.gz](https://github.com/TimothyBest/Image_to_Color_Palette/tarball/master)

Then add the contents of the 'scripts' directory to your project

## Demo

Open Index.html in your browser to see an example of the project

## Usage

**findDominateColors(imageID, containerID):**
- imageID: is the id of an HTML img tag that holds an image you want to evaluate
- containerID: is the id of an HTML tag that will contain the functions output (a 2X11 table containing the 10 most dominant colors and their corresponding hex values)

example:
```HTML
<img id="my-image" src="images/my-image.jpg"/>
<div id="my-output-container"></div>

<input type="submit" value="Find Color Pallet" onclick="findDominateColors('my-image','my-output-container')"/>
```


**readURL(fileInput, imageID):**
- fileInput: a variable contatin the input tag that the file will be grabed from
- imageID: is the id of an HTML img tag that you want the image to upload to


example:
```HTML
  <img id="uploaded-image" src="images/upload_image.png"/>
  <input type="file" value="Upload File" onchange="readURL(this, 'uploaded-image');" accept="image/*" />
```
