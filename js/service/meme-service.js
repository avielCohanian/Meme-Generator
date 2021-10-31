'use strict';


const PAGE_SIZE = 3
const KEY = 'MEMES'
const EMOJIS = ['😈', '👿', '💩', '👻', '☠️', '😋', '🤩', '🧐', '😎', '🤛', '🧟‍♂️', '🎃']
var gPageIdx = 0
var gId = 1;
var gAllImg = 25;
var gFilterBy;
var gMemes;
var gKeywords = { 'happy': 12, 'funny': 20, 'woman': 5, 'men': 7, 'animal': 8, 'dog': 9, 'bird': 5 }
var gImgs = [];
_createImgs()
var gShowImgs = gImgs
var gCurrMeme;





function _createImgs() {
    for (var i = 0; i < gAllImg; i++) {
        let keywords = []
        if (i % 2) { keywords.push('woman', 'smile') }
        if (i % 3) { keywords.push('funny') }
        if (i % 4) { keywords.push('men') }
        if (i % 5) { keywords.push('animal', 'dog', 'bird') }
        let img = _createImg(keywords)
        gImgs.push(img)
    }
}

function _createImg(keywords) {
    return {
        url: `meme-imgs-various-aspect-ratios/${gId}.jpg`,
        id: gId++,
        keywords,
    }
}

function restMeme(selectedImgId = 1) {
    gCurrMeme = {
        selectedImgId,
        selectedLineIdx: 0,
        lines: [{
            txtObj: { x: 100, y: 50, txt: '', id: 0 },
            size: 40,
            align: 'center-text-alignmentleft',
            colorTxt: 'white',
            colorBackground: 'black',
            isDrag: false,

        }
        ]
    }
}
function loadMyMemes() {
    gMemes = loadFromStorage(KEY)
    if (!gMemes) {
        gMemes = []
    }
    return gMemes
}

function getFilterImgs() {
    return gShowImgs
}
function getImgs() {
    return gImgs
}
function getCurrMeme() {
    return gCurrMeme
}
function getImgsForDisplayFilter() {
    if (gFilterBy === 'gallery' || gFilterBy === '') {
        gShowImgs = gImgs
        return
    }
    let sortImgs = gImgs.filter((img) => {
        return img.keywords.some(key => key === gFilterBy)
    })
    gShowImgs = sortImgs
}

function getImgById(id) {
    let currImg = gImgs.find(img => img.id === id)
    return currImg
}

function setFilter(val) {
    gFilterBy = val.toLowerCase()
    getImgsForDisplayFilter()
}
function setSize(el) {
    var allCategory = document.querySelectorAll('.category a')
    if (el) {
        let fontSize =  parseInt(el.style.fontSize) 
        console.log(fontSize);
        fontSize += 5 
        el.style.fontSize = fontSize +'px'
        console.log(fontSize);
    }
}

setSizee()
function setSizee() {
    var allCategory = document.querySelectorAll('.category a')
    allCategory.forEach(category => {
        for (const word in gKeywords) {
            if (word === category.innerText) category.style.fontSize = gKeywords[word] * 1.5 + 'px'
        }
    })
}

function setCurrMemeId(imgId) {
    gCurrMeme.selectedImgId = imgId
}
function setCurrImgLine(txt) { //LINE
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].txtObj.txt = txt
    drawText()
}
function setTxtColor(color) {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].colorTxt = color
}
function setBackgroundColor(color) {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].colorBackground = color
}
function setIncreaseFont() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].size += 1
}
function setDecreaseFont() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].size -= 1
}
function setCenterTextAlignment() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].align = 'center-text-alignment'
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].txtObj.x = gElCanvas.width / 2
}
function setAlignToRight() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].align = 'align-to-right'
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].txtObj.x = gElCanvas.width - 20
}
function setAlignToLeft() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].align = 'align-to-left'
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].txtObj.x = 20
}
function addNewImg(imgUrl) {
    gImgs.push({ id: gId++, url: imgUrl, keywords: ['happy'] })
    setCurrMemeId(gId)
}
function upTxt() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].txtObj.y -= 1
}
function downTxt() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].txtObj.y += 1
}
function saveMeme() {
    console.log(gMemes);
    console.log(gCurrMeme);
    gMemes.push(gCurrMeme)
    _saveMemeToStorage()
}
function updateStorageMeme(newSaveMemes) {
    gMemes = newSaveMemes
    _saveMemeToStorage()
}

function addTxt() {
    let y;
    if (gCurrMeme.lines.length < 2) {
        y = gElCanvas.height - 50
    } else {
        y = gElCanvas.height / 2
    }
    let newTxt = {
        txtObj: {
            x: 100, y: y, txt: ''
            , id: gCurrMeme.lines.length
        },
        size: 40,
        align: 'center-text-alignmentleft',
        colorTxt: 'white',
        colorBackground: 'black',
        isDrag: false,
    }
    gCurrMeme.selectedLineIdx = gCurrMeme.lines.length
    gCurrMeme.lines.push(newTxt)
}

function switchTxtLine() {
    gCurrMeme.selectedLineIdx++
    if (gCurrMeme.selectedLineIdx > gCurrMeme.lines.length - 1) {
        gCurrMeme.selectedLineIdx = 0
    }
}

function isTxtClicked({ y, x }) {
    const distance = gCurrMeme.lines.find(pos => {
        console.log(gCurrMeme.lines);
        return y + pos.size >= pos.txtObj.y && y - pos.size <= pos.txtObj.y && (x >= pos.txtObj.x || x <= pos.txtObj.x)
    })
    if (distance) {
        gCurrMeme.selectedLineIdx = distance.txtObj.id
        return true
    }
}


function drawText() {
    gCurrMeme.lines.forEach((currMemeTxt) => {
        let x = currMemeTxt.txtObj.x
        let y = currMemeTxt.txtObj.y
        let txt = currMemeTxt.txtObj.txt

        gCtx.lineWidth = 1;
        gCtx.strokeStyle = `${currMemeTxt.colorBackground}`;
        gCtx.fillStyle = `${currMemeTxt.colorTxt}`;
        gCtx.font = `${currMemeTxt.size}px Arial`;
        gCtx.fillText(txt, x, y);
        gCtx.strokeText(txt, x, y);
    });
    stripe()
}

function stripe() {
    let x = gCurrMeme.lines[gCurrMeme.selectedLineIdx].txtObj.x
    let y = gCurrMeme.lines[gCurrMeme.selectedLineIdx].txtObj.y
    let txt = gCurrMeme.lines[gCurrMeme.selectedLineIdx].txtObj.txt
    let size = gCurrMeme.lines[gCurrMeme.selectedLineIdx].size
    let lengthTxt = gCtx.measureText(txt)

    gCtx.beginPath();
    gCtx.moveTo(x - 50, y + 10);
    gCtx.lineTo(gElCanvas.width - 20, y + 10);

    gCtx.moveTo(x - 50, y - (size + 5));
    gCtx.lineTo(gElCanvas.width - 20, y - (size + 5));

    gCtx.moveTo(x - 50, y + 10);
    gCtx.lineTo(x - 50, y - (size + 5));


    gCtx.moveTo(gElCanvas.width - 20, y + 10);
    gCtx.lineTo(gElCanvas.width - 20, y - (size + 5));
    // console.log(gCtx.measureText(txt));
    // gCtx.beginPath();
    // gCtx.rect(x, lengthTxt.fontBoundingBoxAscent, lengthTxt.width, lengthTxt.actualBoundingBoxAscent );
    // gCtx.closePath();

    gCtx.stroke()
}


function setTxtDrag(drag) {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].isDrag = drag
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
    console.log(pos);
    return pos
}

function moveCurrLine(dx, dy) {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].txtObj.x += dx
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].txtObj.y += dy
}

function resizeCanvas() {
    const elContainer = document.querySelector('canvas')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}


function getEmoji() {
    let emojis = EMOJIS
    const fromIdx = gPageIdx * PAGE_SIZE
    emojis = emojis.slice(fromIdx, fromIdx + PAGE_SIZE)
    return emojis
}

function nextPage() {
    gPageIdx++;
    if (gPageIdx * PAGE_SIZE >= EMOJIS.length) {
        gPageIdx = 0;
    }
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



function _saveMemeToStorage() {
    saveToStorage(KEY, gMemes)
}