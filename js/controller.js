'use strict'
var gCanvas;
var gCtx;
var gStartPos;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']



function onInit() {
    renderImgs()
    gCanvas = document.querySelector('canvas');
    gCtx = gCanvas.getContext('2d');


    addListeners()
}

function renderCanvas() {
    let currCanvasImg = getCurrImg()
    let imgs = getImgs()
    let currImg = imgs.find(img => img.id === currCanvasImg.selectedImgId)
    SelectImg(currImg.id)
    openImg(currImg.url)
    drawText(currCanvasImg.lines.txt[0].txt)
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
    })
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
    if (!isTxtClicked(ev.offsetY)) return
    setTxtDrag(true)
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    const currImg = getCurrImg();
    if (currImg.lines.isDrag) {
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
    let imgs = getImgs()
    let strHtml = ''
    imgs.forEach(img => {
        strHtml += ` <img onclick="SelectImg(${img.id})" src=${img.url}>`
    })
    document.querySelector('.images').innerHTML = strHtml
}

function SelectImg(elId) {
    let imgs = getImgs()
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

function onDrawText(txt) {
    // gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
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
function alignToRight() {
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
function onSearch() {
    let val = document.querySelector('.options input').value
    setSort(val)
    renderImgs()
}
function onSort(val) {
    setSort(val)
    renderImgs()
}




function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
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

        document.querySelector('.share-container').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`
    }
    doUploadImg(imgDataUrl, onSuccess);
}