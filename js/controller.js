'use strict'
var gCanvas;
var gCtx;
var gStartPos;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gStorageId = 0


function onInit() {
    renderImgs()
    gCanvas = document.querySelector('canvas');
    gCtx = gCanvas.getContext('2d');
    restMeme()
    addListeners()
    loadMyMemes()
    renderEmoji()
    onSetLang('en')
}

function renderCanvas() {
    let currCanvasImg = getCurrImg()
    let imgs = getSortImgs()
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
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (!isTxtClicked(pos)) return
    console.log(!isTxtClicked(pos));
    setTxtDrag(true)
    gStartPos = pos
    document.body.style.cursor = 'grabbing'


    let img = getCurrImg();
    let currImg = img.lines[gCurrMeme.selectedLineIdx]
    document.querySelector('.txt-meme').value = currImg.txtObj.txt
    stripe(currImg.txtObj.x, currImg.txtObj.y, currImg.size)
}

function onMove(ev) {
    const currImg = getCurrImg();
    if (currImg.lines[gCurrMeme.selectedLineIdx].isDrag) {
        const pos = getEvPos(ev)
        console.log(pos);
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        gStartPos = pos
        movecurrImg(dx, dy)
        renderCanvas()
    }
}

function onUp() {
    setTxtDrag(false)
    document.body.style.cursor = 'grab'
}

function renderImgs() {
    let imgs = getSortImgs()
    let strHtml = ''
    imgs.forEach(img => {
        strHtml += ` <img onclick="SelectImg(${img.id})" src=${img.url}>`
    })
    document.querySelector('.images').innerHTML = strHtml
}

function SelectImg(elId) {
    let imgs = getSortImgs()
    let currImg = imgs.find(img => img.id === elId)
    document.body.classList.add('do-meme')
    openImg(currImg.url)
    setCurrImgId(elId)
}

function openImg(url) {
    var img = new Image()
    img.src = url
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
}
function closeImgEditing() {
    document.body.classList.remove('do-meme')
    document.querySelector('.txt-meme').value = ''
    // restMeme()
}

function onDrawText(txt) {
    setCurrImgTxt(txt)
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
    let currImg = getCurrImg()
    // currImg.selectedImgId = gStorageId
    // img.id = gStorageId++
    saveMeme()
    // renderCanvas()
    document.querySelector('.save-show').hidden = false
    setTimeout(() => {
        document.querySelector('.save-show').hidden = true
        onRestMeme()
    }, 1500);
}
function onRestMeme() {
    let currImg = getCurrImg()
    restMeme(currImg.selectedImgId)
    document.querySelector('.txt-meme').value = ''
    SelectImg(currImg.selectedImgId)
}

function onDeletMeme() {
    let storageImg = loadMyMemes() //gMemes
    console.log(storageImg);
    let currMeme = getCurrImg()
    console.log(currMeme);
    let currMemeStorage = storageImg.filter(img => img.selectedImgId === currMeme.selectedImgId)
    console.log(currMemeStorage);
    deletMeme(currMemeStorage)
    closeImgEditing()
    onMyMeme()
}
function onSearch() {
    let val = document.querySelector('.options input').value
    setSort(val)
    renderImgs()
}
function onSort(val, el) {
    if (val === 'Gallery') {
        closeMemePage()
        closeImgEditing()
    }
    setSize(el)
    setSort(val)
    renderImgs()
}
function onAddTxt() {
    addTxt()
    let currImg = getCurrImg();
    document.querySelector('.txt-meme').value = currImg.lines[gCurrMeme.selectedLineIdx].txtObj.txt
    renderImgs()
}
function onMoveTxtLine() {
    moveTxtLine()
    let currImg = getCurrImg();
    document.querySelector('.txt-meme').value = currImg.lines[gCurrMeme.selectedLineIdx].txtObj.txt
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

function onMyMeme() {
    closeMemePage()
    closeImgEditing()
    document.body.classList.add('my-meme')
    let storageImg = loadMyMemes()
    console.log(storageImg);
    if (!storageImg.length) {
        return document.querySelector('.memes-page-img').innerHTML = ''
    }
    let imgs = storageImg.map(img => {
        return getImgById(img.selectedImgId)
    })
    console.log(imgs);
    let strHtml = ''
    imgs.forEach((img, idx) => {
        strHtml += ` <img onclick="SelectMemeImg(${idx})" src=${img.url}>  <button onclick="onDeletMeme()" class="delet btn" data-trans="delet">delet</button>`
    })
    document.querySelector('.memes-page-img').innerHTML = strHtml
    doTrans()
}
function closeMemePage() {
    document.body.classList.remove('my-meme')
}

function SelectMemeImg(elId) {
    let storageImg = loadMyMemes() //gMemes
    let allImg = getImgs() //allImg
    let findImg = allImg.find(img => img.id === storageImg[elId].selectedImgId) //url
    document.body.classList.add('do-meme')
    openImg(findImg.url)
    // setCurrImgId(elId)
    let currMeme = storageImg.filter(img => img.selectedImgId === findImg.id)
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
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
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
    var imgContent = gCanvas.toDataURL('image/jpg')
    elLink.href = imgContent
}

function uploadImg() {
    const imgDataUrl = gCanvas.toDataURL("image/jpeg");

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

function oenMore() {
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