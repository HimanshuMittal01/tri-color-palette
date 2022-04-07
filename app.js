const startHue = document.getElementById('start-hue');
const startSaturation = document.getElementById('start-saturation');
const startLightness = document.getElementById('start-lightness');
const saturationDiff = document.getElementById('saturation-diff');
const lightnessDiff = document.getElementById('lightness-diff');
const controls = document.querySelectorAll('.controls > input');

function getInputValue(numField) {
    let maxVal = parseInt(numField.max);
    let minVal = parseInt(numField.min);
    if (!numField.value) {
        return minVal;
    }
    let val = parseInt(numField.value);
    if (val > maxVal) {
        return maxVal;
    }
    if (val < minVal) {
        return minVal;
    }
    return val;
}

// https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalette() {
    // initiate colors array
    let arr = [];
    for (let i=0; i<6; i++) {
        arr.push({
            'h': 0,
            's': 0,
            'l': 0
        })
    }

    // parameters
    let sd = getInputValue(saturationDiff);
    let ld = getInputValue(lightnessDiff);

    // color-1
    arr[0]['h'] = getInputValue(startHue);
    arr[0]['s'] = getInputValue(startSaturation);
    arr[0]['l'] = getInputValue(startLightness);

    // color-2
    arr[1]['h'] = (arr[0]['h'] + 150)%360;
    arr[1]['s'] = Math.max(0, arr[0]['s'] - sd/2);
    arr[1]['l'] = Math.min(100, Math.max(0, arr[0]['l'] +(arr[0]['l']<=50 ? 50 : -50) + ld/2));

    // color-3
    arr[2]['h'] = (arr[0]['h'] + 210)%360;
    arr[2]['s'] = Math.min(100, arr[0]['s'] + sd/2);
    arr[2]['l'] = Math.min(100, Math.max(0, arr[0]['l'] +(arr[0]['l']<=50 ? 50 : -50) - ld/2));

    // color-4
    arr[3]['h'] = (arr[0]['h'] + 180)%360;
    arr[3]['s'] = 100 - arr[0]['s'];
    arr[3]['l'] = 100 - arr[0]['l'];

    // color-5
    arr[4]['h'] = (arr[3]['h'] + 150)%360;
    arr[4]['s'] = Math.min(100, arr[3]['s'] + sd/2);
    arr[4]['l'] = Math.min(100, Math.max(0, arr[3]['l'] +(arr[3]['l']<=50 ? 50 : -50) - ld/2));

    // color-6
    arr[5]['h'] = (arr[3]['h'] + 210)%360;
    arr[5]['s'] = Math.max(0, arr[3]['s'] - sd/2);
    arr[5]['l'] = Math.min(100, Math.max(0, arr[3]['l'] +(arr[3]['l']<=50 ? 50 : -50) + ld/2));

    // assign colors to boxes
    for (let i=0; i<6; i++) {
        let allPalettes = document.querySelectorAll('.palette');
        let palette = allPalettes[0];
        let box = palette.querySelector("[data-id='box-" + (i+1) + "'");
        let boxColor = hslToHex(arr[i]['h'], arr[i]['s'], arr[i]['l']);
        box.style.backgroundColor = boxColor;
        box.innerHTML = boxColor;
        box.style.color = (arr[i]['l'] > 50 ? "#000" : "#fff");

        console.log(arr[i]['h'], arr[i]['s'], arr[i]['l']);
    }
}

function startScript() {
    // set initial colors
    generatePalette();

    // add events to input
    controls.forEach((controlDom) => {
        controlDom.addEventListener('input', (e) => {
            generatePalette();
        })
    })
}

startScript();
