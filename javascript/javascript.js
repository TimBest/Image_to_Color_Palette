function readURL(input) {
    if (input.files && input.files[0]) {
        var image = new FileReader();
        image.onload = function (e) {
            $('#myImage')
                .attr('src', e.target.result)
                .width(400)
                .height(300);
        };
        image.crossOrigin="";
        image.readAsDataURL(input.files[0]);
    }
}

/* Converts image to canvas
 *
 * Input      Type      Name
 * imageId    String    id of HTML img
 * canvasId   String    id of HTML canvas
 *
 * Return  Type      Name
 *         Object    used for canvas manipulation
 */
function imageToCanvas(imageId, canvasId){
    var image = document.getElementById(imageId);
    var canvas = document.getElementById(canvasId);
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    return ctx;
}

/* Converts canvas to image
 *
 * Input      Type      Name
 * canvasId   String    id of HTML canvas
 *
 * Return  Type      Name
 *         .png      image file
 */
function canvasToImage(canvasId) {
    var image = new Image();
    image.src = canvasId.toDataURL("image/png");
    return image;
}

/* Takes a canvas and image and returns the
 * top ten averaged colors
 *
 * Input      Type      Name
 * imageId    String    id of HTML img
 * canvasId   String    id of HTML canvas
 *
 * Return  Type      Name
 *         Array     10 hex values
 */
function findDominateColors(imageId, canvasId, colorPaletteId){
    var r, g, b;
    var h, s, l;
    var hsl, rgb, weight;
    var dominateColors = new Array();
    var hslTable = new HashTable();
    var hslHeap = new binaryHeap();

    imageToCanvas(imageId, canvasId);
    var c = document.getElementById(canvasId);
    var ctx = c.getContext("2d");
    var imgData = ctx.getImageData(0,0,c.width,c.height);

    /*convert canvas into hsvtable*/
    for (var i=0;i<imgData.data.length;i+=4)
    {
        /**
         * i   = Red (r) - The color red (from 0-255)
         * i+1 = Green (g) - The color green (from 0-255)
         * i+2 = Blue (b) - The color blue (from 0-255)
         * i+3 = Alpha (a) - The alpha channel (from 0-255; 0 is transparent and 255 is fully visible)
         */
        r = imgData.data[i];
        g = imgData.data[i+1];
        b = imgData.data[i+2];
        /*Alpha is not used*/
        hsl = rgbToHsl(r, g, b);
        h = hsl[0];
        s = hsl[1];
        l = hsl[2];
        /*divide values into 226 different coloured buckets
         * buckets are labelled by
         * 5 white
         * 5 black
         * 216 color
         */
        if( l <= 0.05){
            /*black cylinder*/
            /*divided into 5 slices
             * 0   =< h < 72  key:  Black0
             * 72  =< h < 144 key:  Black1
             * 144 =< h < 216 key:  Black2
             * 216 =< h < 288 key:  Black3
             * 288 =< h < 360 key:  Black4
            **/
            addToBucket  (hslTable, 'Black'+Math.floor(h/72), hsl);
        } else if ( 0.95 <= l){
            /*white bucket*/
            /*divided into 5 slices
             * 0   =< h < 72  key:  White0
             * 72  =< h < 144 key:  White1
             * 144 =< h < 216 key:  White2
             * 216 =< h < 288 key:  White3
             * 288 =< h < 360 key:  White4
            **/
            addToBucket  (hslTable, 'White'+Math.floor(h/72), hsl);
        } else {
            /*coloured bucket*/
             /*divided into 36 slices
             * 0   =< h < 10   key(firstHalf): Color0,
             * 10  =< h < 20   key(firstHalf): Color1,
             * ...
             * 350 =< h < 360  key(firstHalf): Color36,
             *
             * each slice divided into 6 equal volume sections
             * 0    =< s <= 40.8  key(secondHalf): 0
             * 40.8  < s <= 57.7  key(secondHalf): 1
             * 57.7  < s <= 70.7  key(secondHalf): 2
             * 70.7  < s <= 81.6  key(secondHalf): 3
             * 81.6  < s <= 91.3  key(secondHalf): 4
             * 91.3  < s <= 100   key(secondHalf): 5
             *
             * example: h=15;s=30;l=10; key= 'Color1,0'
             */
            addToBucket  (hslTable, 'Color'+Math.floor(h/10)+','+section(s), hsl);
        }
    }
    hslTable.each(function(k, v) {
        hslHeap.push(v);
        //document.write('key is: ' + k + ', value is: ' + v + '</br>');
    });
    for(var i=0;i<10;i++){
        if(hslHeap.size()==0)
            break;
        hsl = hslHeap.pop()[0];
        rgb = hslToRgb(hsl[0],hsl[1],hsl[2]);
        dominateColors[i] = rgbToHex(rgb[0],rgb[1],rgb[2]);

    }
    displayColors(dominateColors, colorPaletteId);
}

/* helper function for findDominateColors
 * takes the saturation value and returns the
 * bucket value that it should be placed in
 */
function section(s){
    if(s < 40.8)
        return 0;
    else if( s < 57.7)
        return 1;
    else if( s < 70.7)
        return 2;
    else if( s < 81.6)
        return 3;
    else if( s < 91.3)
        return 4;
    else if( s < 100)
        return 5;
}

/* helper function for findDominateColors
 * takes h,s,and l and averages them with
 * the existing bucket value.
 */
function addToBucket  (hTable, key, hsl ){
    var value, oldHsl, weight =1;
    if(hTable.hasItem(key)){
        value = hTable.getItem(key);
        oldHsl = value[0];
        weight = value[1];
        hsl[0] = (hsl[0]+(weight*oldHsl[0]))/(weight+1);
        hsl[1] = (hsl[1]+(weight*oldHsl[1]))/(weight+1);
        hsl[2] = (hsl[2]+(weight*oldHsl[2]))/(weight+1);
        weight++;
    }
    hTable.setItem(key, [hsl, weight]);
}

/* helper function for findDominateColors
 * displays a table of the hex value and it
 * corresponding using the array of 10 hex values
 */
function displayColors(dominateColors, colorPaletteId){
    var table = $('<table></table>');
    var row1 = $('<tr></tr>');
    var row2 = $('<tr></tr>');
    var cell1, cell2;

    $('#'+colorPaletteId).empty();

    row1.append('<th>Color</th>');
    row2.append('<th>Hex</th>');

    for(i=0; i<10; i++)
    {
        cell1 = $('<td></td>').text('').css('background-color',''+dominateColors[i]);
        cell2 = $('<td></td>').text('' + dominateColors[i]);
        row1.append(cell1);
        row2.append(cell2);
    }

    table.append(row1);
    table.append(row2);

    $('#'+colorPaletteId).append(table);

}
