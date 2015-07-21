/* Converts R,G,B to Hexadecimal
 *
 * INPUT   TYPE      VAlID RANGE
 * Red     Number    0 - 255
 * Green   Number    0 - 255
 * Blue    Number    0 - 255
 *
 * RETURN  TYPE      FORMAT
 *         String    '#XXXXXX'
 */

function rgbToHex(red, green, blue) {
    red_hex   = decimalToHex(red);
    green_hex = decimalToHex(green);
    blue_hex  = decimalToHex(blue);
    return ('#' + red_hex + green_hex + blue_hex).toUpperCase();
}

/* rgbToHex helper */
function decimalToHex(c) {
    var hex = c.toString(16);
    if (hex.length == 1) {
        hex = "0" + hex;
    }
    return hex;
}

/**
 * adapted from : http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 *
 * Converts an RGB color value to HSL. .
 *
 * INPUT   TYPE      VAlID RANGE
 * Red     Number    0 - 255
 * Green   Number    0 - 255
 * Blue    Number    0 - 255
 *
 * RETURN  TYPE      FORMAT
 *         Array     [hue(0-360), saturation(0-1), lightness(0-1)]
 */
function rgbToHsl(red, green, blue) {
    var hue, saturation, lightness;
    var max, min;
    red = red/255;
    green = green/255;
    blue = blue/255;
    max = Math.max(red, green, blue);
    min = Math.min(red, green, blue);

    lightness = (max + min) / 2;
    if (max == min) {
        hue = 0;
        saturation = 0;
    } else {
        var delta = max - min;
        if (lightness > 0.5) {
            saturation = delta / (2 - max - min);
        } else {
            saturation = delta / (max + min);
        }
        switch(max){
            case red:
                hue = (green - blue) / delta + (green < blue ? 6 : 0);
                break;
            case green:
                hue = (blue - red) / delta + 2;
                break;
            case blue:
                hue = (red - green) / delta + 4;
                break;
        }
        hue = hue / 6 * 360;
    }

    return [hue, saturation, lightness];
}

/**
 * adapted from : http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 *
 * Converts an HSL color value to RGB.
 *
 * INPUT        TYPE      VAlID RANGE
 * Hue          Number    0 - 360
 * Saturation   Number    0 - 1
 * Lightness    Number    0 - 1
 *
 * RETURN  TYPE      FORMAT
 *         Array     [red(0-255), green(0-255), blue(0-255)]
 */
function hslToRgb(hue, saturation, lightness) {
    var red, green, blue;

    hue = hue/360;

    if (saturation === 0) {
        red = green = blue = lightness;
    } else {
        var q, p;
        if (lightness < 0.5) {
          q = lightness * (1 + saturation);
        } else {
          q = lightness + saturation - lightness * saturation;
        }
        p = 2 * lightness - q;
        red = hueToRgb(p, q, hue + 1/3);
        green = hueToRgb(p, q, hue);
        blue = hueToRgb(p, q, hue - 1/3);
    }

    return [Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255)];
}

/* hslToRgb helper */
function hueToRgb(p, q, t) {
   if (t < 0) {
       t = t +1;
   }
   if (t > 1) {
       t = t -1;
   }
   if (t < 1/6) {
       return p + (q - p) * 6 * t;
   }
   if (t < 1/2) {
     return q;
   }
   if (t < 2/3) {
     return p + (q - p) * (2/3 - t) * 6;
   }
   return p;
}
