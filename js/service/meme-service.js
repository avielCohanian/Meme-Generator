'use strict';
var gId = 19;

// var gKeywords = {'happy': 12,'funny puk': 1}
var gImgs = [
    { id: 1, url: `meme-imgs/1.jpg`, keywords: ['happy'] },
    { id: 2, url: `meme-imgs/2.jpg`, keywords: ['happy'] },
    { id: 3, url: `meme-imgs/3.jpg`, keywords: ['happy'] },
    { id: 4, url: `meme-imgs/4.jpg`, keywords: ['happy'] },
    { id: 5, url: `meme-imgs/5.jpg`, keywords: ['happy'] },
    { id: 6, url: `meme-imgs/6.jpg`, keywords: ['happy'] },
    { id: 7, url: `meme-imgs/7.jpg`, keywords: ['happy'] },
    { id: 8, url: `meme-imgs/8.jpg`, keywords: ['happy'] },
    { id: 9, url: `meme-imgs/9.jpg`, keywords: ['happy'] },
    { id: 10, url: `meme-imgs/10.jpg`, keywords: ['happy'] },
    { id: 11, url: `meme-imgs/11.jpg`, keywords: ['happy'] },
    { id: 12, url: `meme-imgs/12.jpg`, keywords: ['happy'] },
    { id: 13, url: `meme-imgs/13.jpg`, keywords: ['happy'] },
    { id: 14, url: `meme-imgs/14.jpg`, keywords: ['happy'] },
    { id: 15, url: `meme-imgs/15.jpg`, keywords: ['happy'] },
    { id: 16, url: `meme-imgs/16.jpg`, keywords: ['happy'] },
    { id: 17, url: `meme-imgs/17.jpg`, keywords: ['happy'] },
    { id: 18, url: `meme-imgs/18.jpg`, keywords: ['happy'] },
];
var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I never eat Falafel',
            size: 20,
            align: 'left',
            color: 'red'
        }
    ]
}
var gCurrMeme = {
    selectedImgId: 0,
    lines: {
        txt: '',
        size: 20,
        align: 'center-text-alignmentleft',
        colorTxt: 'black',
        colorBackground: 'white'
    }
}

function getImgs() {
    return gImgs
}
function getCurrImgs() {
    return gCurrMeme
}

function setCurrImgId(elId) {
    gCurrMeme.selectedImgId = elId
}
function setCurrImgTxt(txt) {
    gCurrMeme.lines.txt = txt
    drawText(txt)
    // console.log(txt);
}
function setTxtColor(color) {
    gCurrMeme.lines.colorTxt = color
}
function setBackgroundColor(color) {
    gCurrMeme.lines.colorBackground = color
}
function setIncreaseFont() {
    gCurrMeme.lines.size += 1
}
function setDecreaseFont() {
    gCurrMeme.lines.size -= 1
}
function setCenterTextAlignment() {
    gCurrMeme.lines.align = 'center-text-alignment'
}
function setAlignToRight() {
    gCurrMeme.lines.align = 'align-to-right'
}
function setAlignToLeft() {
    gCurrMeme.lines.align = 'align-to-left'
}
function addNewImg(img) {
    gImgs.push( { id: gId++, url: img, keywords: ['happy'] })
}





function drawText(txt) {
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = 'brown';
    gCtx.fillStyle = 'black';
    gCtx.font = '40px Arial';
    gCtx.fillText(txt, 10, 50);
    gCtx.strokeText(txt, 10, 50);
}










function doUploadImg(imgDataUrl, onSuccess) {

    const formData = new FormData();
    formData.append('img', imgDataUrl)

    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.text())
        .then((url) => {
            console.log('Got back live url:', url);
            onSuccess(url)
        })
        .catch((err) => {
            console.error(err)
        })
}
