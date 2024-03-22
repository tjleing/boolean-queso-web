import {filenames} from './filenames.js'

let TIMEOUT = 30*1000;
let i = 0, len = filenames.length;
let img = document.getElementById("img");

removeAndAddNextImg();
function removeAndAddNextImg() {
    console.log(filenames[i]);
    img.src = "./img/"+filenames[i];
    i = (i+1) % len;
    setTimeout(removeAndAddNextImg, TIMEOUT);
}