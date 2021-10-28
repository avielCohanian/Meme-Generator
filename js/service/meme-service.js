'use strict';
var gId = 19;
var gSortBy;
const KEY = 'MEMES'
var gMemes;
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
    { id: 10, url: `meme-imgs/10.jpg`, keywords: ['happy', 'Woman'] },
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
var gCurrMeme;

function restMeme() {
    gCurrMeme = {
        selectedImgId: 1,
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

function getSortImgs() {
    return gShowImgs
}
function getImgs() {
    return gImgs
}
function getCurrImg() {
    return gCurrMeme
}
function getImgsForDisplaySort() {
    if (gSortBy === 'Gallery') {
        gShowImgs = gImgs
        return
    }
    let sortImgs = gImgs.filter((img) => {
        return img.keywords.some(key => key === gSortBy)
    })
    gShowImgs = sortImgs
}

function getImgById(id) {
    let currImg = gImgs.find(img => img.id === id)
    return currImg
}

function setSort(val) {
    gSortBy = val
    getImgsForDisplaySort()
}
function setSize(el) {
    var allCategory = document.querySelectorAll('.category a')
    allCategory.forEach(category => category.style.fontSize = '1rem')
    if (el) {
        el.style.fontSize = '50px'
    }


}

function setCurrImgId(elId) {
    gCurrMeme.selectedImgId = elId
}
function setCurrImgTxt(txt) {
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
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].txtObj.x = gCanvas.width / 2
}
function setAlignToRight() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].align = 'align-to-right'
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].txtObj.x = gCanvas.width - 20
}
function setAlignToLeft() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].align = 'align-to-left'
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].txtObj.x = 20
}
function addNewImg(img) {
    gImgs.push({ id: gId++, url: img, keywords: ['happy'] })
    setCurrImgId(gId)
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
function deletMeme(NewMemes) {
    gMemes = NewMemes
    _saveMemeToStorage()
}




function addTxt() {
    let y;
    if (gCurrMeme.lines.length < 2) {
        y = gCanvas.height - 50
    } else {
        y = gCanvas.height / 2
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

function moveTxtLine() {
    gCurrMeme.selectedLineIdx++
    if (gCurrMeme.selectedLineIdx > gCurrMeme.lines.length - 1) {
        gCurrMeme.selectedLineIdx = 0
    }
}

function isTxtClicked(y, x) {
    // console.log(y);
    const distance = gCurrMeme.lines.find(pos => {
        console.log(gCurrMeme.lines);
        return y >= pos.txtObj.y - pos.size && y <= pos.txtObj.y && (x >= pos.txtObj.x || x <= pos.txtObj.x)
    })
    console.log(distance.txtObj.id);
    if (distance) {
        gCurrMeme.selectedLineIdx = distance.txtObj.id
        return true
    }
}


function drawText() {
    gCurrMeme.lines.forEach((currImgTxt) => {
        gCtx.lineWidth = 1;
        // gCtx.textAlign = "center"
        gCtx.strokeStyle = `${currImgTxt.colorBackground}`;
        gCtx.fillStyle = `${currImgTxt.colorTxt}`;
        gCtx.font = `${currImgTxt.size}px Arial`;
        // gCtx.textBaseline = 'middle'
        gCtx.fillText(currImgTxt.txtObj.txt, currImgTxt.txtObj.x, currImgTxt.txtObj.y);
        gCtx.strokeText(currImgTxt.txtObj.txt, currImgTxt.txtObj.x, currImgTxt.txtObj.y);
        // console.log('aa');
    });
}


function setTxtDrag(drag) {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].isDrag = drag
    // console.log(gCurrMeme.lines[gCurrMeme.selectedLineIdx].isDrag);
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
    return pos
}

function movecurrImg(dx, dy) {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].txtObj.x += dx
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].txtObj.y += dy

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



function _saveMemeToStorage() {
    saveToStorage(KEY, gMemes)
}