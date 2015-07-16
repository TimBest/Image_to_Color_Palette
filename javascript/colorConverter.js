/* Converts H,S,V to R,G,B
 *
 * Input   Type      Name
 *   h     Number    Hue
 *   s     Number    Saturation
 *   v     Number    Value
 *
 * Return  Type      Name
 *         Array
 *  [0]    Number    Red
 *  [1]    Number    Green
 *  [2]    Number    Blue
 */
function hsvToRgb(h, s, v){
    var r, g, b;
    var hex, primaryColor, secondaryColor, i, j, k;
    hex = h/60;
    primaryColor =  Math.floor(hex);
    secondaryColor = hex - primaryColor;
    i = v * ( 1 - s );
    j = v * ( 1 - ( s * secondaryColor ) );
    k = v * ( 1 - ( s * ( 1 - secondaryColor ) ) );
    switch( primaryColor % 6 ) {
        case 0:
            r = v;
            g = k;
            b = i;
            break;
        case 1:
            r = j;
            g = v;
            b = i;
            break;
        case 2:
            r = i;
            g = v;
            b = k;
            break;
        case 3:
            r = i;
            g = j;
            b = v;
            break;
        case 4:
            r = k;
            g = i;
            b = v;
            break;
        case 5:
            r = v;
            g = i;
            b = j;
            break;
    }
    return [Math.round(r*255),Math.round(g*255),Math.round(b*255)];
}

/* Converts R,G,B to H,S,V
 *
 * Input   Type      Name
 *   r     Number    Red
 *   g     Number    Green
 *   b     Number    Blue
 *
 * Return  Type      Name
 *         Array
 *  [0]    Number    Hue
 *  [1]    Number    Saturation
 *  [2]    Number    Intensity
 */
function rgbToHsv(r, g, b){
    var h, s, v;
    var cMax, cMin, delta;

    r = r/255;
    g = g/255;
    b = b/255;

    cMax = Math.max(r,g,b);
    cMin = Math.min(r,g,b);
    delta = cMax - cMin;

    v = cMax;
    if ( delta == 0 ){
        s = 0;
        h = 0;
    }else if ( cMax == r ){
        h = 60 * (((g-b)/delta)%6);
        s = (delta/cMax);
    }else if (cMax == g){
        h = 60 * (((b-r)/delta)+2);
        s = (delta/cMax);
    }else if (cMax == b){
        h = 60 * (((r-g)/delta)+4);
        s = (delta/cMax);
    }
    if ( h < 0)
        h += 360;
    return [parseFloat(h).toFixed(1), parseFloat(s).toFixed(4), parseFloat(v).toFixed(4)];
}

/* Converts H,S,I to R,G,B
 *
 * Input   Type      Name
 *   h     Number    Hue
 *   s     Number    Saturation
 *   i     Number    Intensity
 *
 * Return  Type      Name
 *         Array
 *  [0]    Number    Red
 *  [1]    Number    Green
 *  [2]    Number    Blue
 */
function hsiToRgb(h, s, i){
    var r, g, b;

    if ( h <= 120){
        b = i * (1 - s);
        r = i * Math.round(1 + ((s * Math.cos(h))/(Math.cos(60 - h))));
        g = (3 * i) - (b + r);
    } else if ( h <= 240){
        h = h - 120;
        r = i * (1 - s);
        g = i * Math.round(1 + (( s * Math.cos(h))/(Math.cos(60 - h))));
        b = (3 * i) - (r + g);
    } else if ( h <= 360){
        h = h - 240;
        g = i * (1 - s);
        b = i * Math.round(1 + (( s * Math.cos(h))/(Math.cos(60 - h))));
        r = (3 * i) - (r + g);
    }

    return [Math.round(r*255),Math.round(g*255),Math.round(b*255)];
}

/* Converts R,G,B to H,S,I
 *
 * Input   Type      Name
 *   r     Number    red
 *   g     Number    green
 *   b     Number    blue
 *
 * Return  Type      Name
 *         Array
 *  [0]    Number    hue
 *  [1]    Number    saturation
 *  [2]    Number    intensity
 */
function rgbToHsi(r_1, g_1, b_1){
    var h, s, i;
    var cMax, cMin, delta;

    r = r_1/255;
    g = g_1/255;
    b = b_1/255;

    cMax = Math.max(r,g,b);
    cMin = Math.min(r,g,b);
    delta = cMax - cMin;

    i = (cMax-cMin)/2//(r+g+b)/3;
    s = 1 - (3/(r+g+b)) *cMin;
    if ( delta == 0 ){
        s = 0;
        h = 0;
    }else if ( cMax == r ){
        h = 60 * (((g-b)/delta)%6);
    }else if (cMax == g){
        h = 60 * (((b-r)/delta)+2);
    }else if (cMax == b){
        h = 60 * (((r-g)/delta)+4);
    }
    if ( h < 0)
        h += 360;
    return [h, s, i];
}

/* Converts R,G,B to Hexadecimal
 *
 * Input   Type      Name
 *   r     Number    Red
 *   g     Number    Green
 *   b     Number    Blue
 *
 * Return  Type      Format
 *         String    '#XXXXXX'
 */
function rgbToHex(r, g, b){
    return ('#' + decimalToTwoDigitHex(r) + decimalToTwoDigitHex(g) + decimalToTwoDigitHex(b)).toUpperCase();
}
function decimalToTwoDigitHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    //return [parseFloat(h*360).toFixed(1), parseFloat(s).toFixed(4), parseFloat(l).toFixed(4)];

    return [h*360, s, l];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    h=h/360;
    
    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}