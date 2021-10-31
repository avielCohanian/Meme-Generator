'use strict'
var gElCanvas;
var gCtx;
var gStartPos;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gStorageId = 0


function onInit() {
    renderImgs()
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    restMeme()
    addListeners()
    loadMyMemes()
    renderEmoji()
}

function renderCanvas() {
    let currCanvasImg = getCurrMeme()
    let imgs = getFilterImgs()
    let currImg = imgs.find(img => img.id === currCanvasImg.selectedImgId)
    SelectImg(currImg.id)
    openImg(currImg.url)
    drawText()
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (!isTxtClicked(pos)) return
    console.log(!isTxtClicked(pos));
    setTxtDrag(true)
    gStartPos = pos
    document.body.style.cursor = 'grabbing'


    let img = getCurrMeme();
    let currMeme = img.lines[gCurrMeme.selectedLineIdx]
    document.querySelector('.txt-meme').value = currMeme.txtObj.txt
    stripe(currMeme.txtObj.x, currMeme.txtObj.y, currMeme.size)
}

function onMove(ev) {
    const currMeme = getCurrMeme();
    if (currMeme.lines[gCurrMeme.selectedLineIdx].isDrag) {
        const pos = getEvPos(ev)
        console.log(pos);
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        gStartPos = pos
        moveCurrLine(dx, dy)
        renderCanvas()
    }
}

function onUp() {
    setTxtDrag(false)
    document.body.style.cursor = 'grab'
}

function renderImgs() {
    let imgs = getFilterImgs()
    let strHtml = ''
    imgs.forEach(img => {
        strHtml += ` <img onclick="SelectImg(${img.id})" src=${img.url}>`
    })
    document.querySelector('.images').innerHTML = strHtml
}

function SelectImg(elId) {
    let imgs = getFilterImgs()
    let currImg = imgs.find(img => img.id === elId)
    document.body.classList.add('editor-meme')
    openImg(currImg.url)
    setCurrMemeId(elId)
}

function openImg(url) {
    var img = new Image()
    img.src = url
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}
function closeImgEditing() {
    document.body.classList.remove('editor-meme')
    document.querySelector('.txt-meme').value = ''
    // restMeme()
}

function onDrawText(txt) {
    setCurrImgLine(txt)
    renderCanvas()
}

function onTxtColorChange(txtColor) {
    setTxtColor(txtColor)
    renderCanvas()
}
function onBackColorChange(txtColor) {
    setBackgroundColor(txtColor)
    renderCanvas()
}
function increaseFont() {
    setIncreaseFont()
    renderCanvas()
}
function decreaseFont() {
    setDecreaseFont()
    renderCanvas()
}
function centerTextAlignment() {
    setCenterTextAlignment()
    renderCanvas()
}
function onAlignToRight() {
    setAlignToRight()
    renderCanvas()
}
function alignToLeft() {
    setAlignToLeft()
    renderCanvas()
}
function addImg(img) {
    addNewImg(img)
    renderCanvas()
}
function onUpTxt() {
    upTxt()
    renderCanvas()
}
function onDownTxt() {
    downTxt()
    renderCanvas()
}
function onSaveMeme() {
    saveMeme()
    document.querySelector('.save-show').hidden = false
    setTimeout(() => {
        document.querySelector('.save-show').hidden = true
        onRestMeme()
    }, 1500);
}
function onRestMeme() {
    let currMeme = getCurrMeme()
    restMeme(currMeme.selectedImgId)
    document.querySelector('.txt-meme').value = ''
    SelectImg(currMeme.selectedImgId)
}

function onDeleteMeme(saveMemeIdx) {
    let storageMeme = loadMyMemes()
    storageMeme.splice(saveMemeIdx, 1)
    updateStorageMeme(storageMeme)
    renderSaveMeme()
}
function onSearch() {
    let val = document.querySelector('.options input').value
    setFilter(val)
    renderImgs()
}
function onFilter(val, el) {
    if (val === 'gallery') {
        document.body.classList.remove('menu-open');
        closeSaveMemePage()
        closeImgEditing()
    }
    setSize(el)
    setFilter(val)
    renderImgs()
}
function onAddTxt() {
    addTxt()
    let currMeme = getCurrMeme();
    document.querySelector('.txt-meme').value = currMeme.lines[gCurrMeme.selectedLineIdx].txtObj.txt
}
function onSwitchTxtLine() { //better name switch lines
    switchTxtLine()
    let currMeme = getCurrMeme();
    document.querySelector('.txt-meme').value = currMeme.lines[gCurrMeme.selectedLineIdx].txtObj.txt
    // renderCanvas()
    // renderImgs()
}
function onNextPage() {
    nextPage()
    renderEmoji()
}
function emojiCanvas(el) {
    onDrawText(el.innerText)
}

function renderSaveMeme() {
    closeSaveMemePage()
    closeImgEditing()
    document.body.classList.remove('menu-open');
    document.body.classList.add('my-meme')// change class name
    let storageMemes = loadMyMemes() // s
    console.log(storageMemes);
    if (!storageMemes.length) {
        return document.querySelector('.memes-page-img').innerHTML = ''
    }
    let imgs = storageMemes.map(img => {
        return getImgById(img.selectedImgId)
    })
    console.log(imgs);
    let strHtml = ''
    imgs.forEach((img, idx) => {
        strHtml += ` <img onclick="SelectMemeImg(${idx})" src=${img.url}>  <button onclick="onDeleteMeme(${idx})" class="delete btn" data-trans="delete">delete</button>`
    })
    document.querySelector('.memes-page-img').innerHTML = strHtml
    doTrans()
}
function closeSaveMemePage() {
    document.body.classList.remove('my-meme')
}

function SelectMemeImg(elId) {
    let storageMeme = loadMyMemes() //gMemes
    let allImg = getImgs() //allImg
    let findImg = allImg.find(img => img.id === storageMeme[elId].selectedImgId) //url
    document.body.classList.add('editor-meme')
    openImg(findImg.url)
    // setCurrMemeId(elId)
    let currMeme = storageMeme.filter(img => img.selectedImgId === findImg.id)
    console.log(currMeme[0]);
    gCurrMeme = currMeme[0]
    drawText()
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

function doTrans() {
    var els = document.querySelectorAll('[data-trans]')
    els.forEach((el) => {
        if (el.nodeName === 'INPUT') {
            el.placeholder = getTransText(el)
        } else {
            el.innerText = getTransText(el)
        }
    })
}

function onSetLang(lang) {
    setLang(lang);
    doTrans();
}


function loadImageFromInput(ev, onImageReady) {
    document.querySelector('canvas').innerHTML = ''
    var reader = new FileReader()

    reader.onload = function (event) {
        var img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
        renderImg.bind(null, img)
        addImg(img)
    }
    reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    console.log(img);
}

function renderEmoji() {
    let emojis = getEmoji()
    let elEmojis = document.querySelectorAll('.emoji')
    elEmojis.forEach((emoji, idx) => {
        emoji.innerText = emojis[idx]
    })
}

function downloadImg(elLink) {
    var imgContent = gElCanvas.toDataURL('image/jpg')
    elLink.href = imgContent
}

function uploadImg() {
    const imgDataUrl = gElCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.user-msg').innerText = `Your photo is available here: ${uploadedImgUrl}`
        document.querySelector('.share-show').hidden = false
        document.querySelector('.share-container').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
        Share   
        </a>`
    }
    doUploadImg(imgDataUrl, onSuccess);
}

function openMore() {
    document.querySelector('.dropDown').hidden = false
}
function closeMore() {
    document.querySelector('.dropDown').hidden = true
}
function closeShare() {
    document.querySelector('.share-show').hidden = true
}

function toggleMenu() {
    document.body.classList.toggle('menu-open');
}