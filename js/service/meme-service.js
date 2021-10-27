'use strict';
var gId = 19;
var gSortBy;
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
    { id: 10, url: `meme-imgs/10.jpg`, keywords: ['happy','Woman'] },
    { id: 11, url: `meme-imgs/11.jpg`, keywords: ['happy'] },
    { id: 12, url: `meme-imgs/12.jpg`, keywords: ['happy'] },
    { id: 13, url: `meme-imgs/13.jpg`, keywords: ['happy'] },
    { id: 14, url: `meme-imgs/14.jpg`, keywords: ['happy'] },
    { id: 15, url: `meme-imgs/15.jpg`, keywords: ['Funny'] },
    { id: 16, url: `meme-imgs/16.jpg`, keywords: ['happy', 'Funny'] },
    { id: 17, url: `meme-imgs/17.jpg`, keywords: ['happy'] },
    { id: 18, url: `meme-imgs/18.jpg`, keywords: ['happy'] },
];
var gShowImgs = gImgs

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
        txt: [{ x: 100, y: 50, txt: '' }],
        size: 40,
        align: 'center-text-alignmentleft',
        colorTxt: 'white',
        colorBackground: 'black',
        isDrag: false,
    }
}

function getImgs() {
    return gShowImgs
}
function getCurrImg() {
    return gCurrMeme
}
function getImgsForDisplaySort() {
    let sortImgs = gImgs.filter((img) => {
        return img.keywords.some(key => key === gSortBy)
    })
    gShowImgs = sortImgs
    console.log(gShowImgs);
}

function setSort(val) {
    gSortBy = val
    getImgsForDisplaySort()
}

function setCurrImgId(elId) {
    gCurrMeme.selectedImgId = elId
}
function setCurrImgTxt(txt) {
    gCurrMeme.lines.txt[0].txt = txt
    drawText(txt)
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
    gImgs.push({ id: gId++, url: img, keywords: ['happy'] })
    setCurrImgId(gId)
}
function upTxt() {
    gCurrMeme.lines.txt[0].y -= 1
}
function downTxt() {
    gCurrMeme.lines.txt[0].y += 1
}


function isTxtClicked(y) {
    const distance = gCurrMeme.lines.txt.find(txt => {
        return y >= txt.y && y <= txt.y + gCurrMeme.lines.size
    })
    if (distance) return true
}


function drawText(txt) {
    gCtx.lineWidth = 1;
    // gCtx.textAlign = "center"
    gCtx.strokeStyle = `${gCurrMeme.lines.colorBackground}`;
    gCtx.fillStyle = `${gCurrMeme.lines.colorTxt}`;
    gCtx.font = `${gCurrMeme.lines.size}px Arial`;
    // gCtx.textBaseline = 'middle'
    gCtx.fillText(txt, gCurrMeme.lines.txt[0].x, gCurrMeme.lines.txt[0].y);
    gCtx.strokeText(txt, gCurrMeme.lines.txt[0].x, gCurrMeme.lines.txt[0].y);
}


function setTxtDrag(isDrag) {
    gCurrMeme.lines.isDrag = isDrag
}


function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    // console.log(pos);
    return pos
}

function movecurrImg(dx, dy) {
    gCurrMeme.lines.txt[0].x += dx
    gCurrMeme.lines.txt[0].y += dy

}

function resizeCanvas() {
    const elContainer = document.querySelector('canvas')
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
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
