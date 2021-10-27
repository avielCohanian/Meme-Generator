'use strict'
var gCanvas;
var gCtx;

function onInit() {
    renderImgs()
    gCanvas = document.querySelector('canvas');
    gCtx = gCanvas.getContext('2d');


    // addListeners()
}

function renderCanvas() {
    let currCanvasImg = getCurrImgs()
    let imgs = getImgs()
    let currImg = imgs.find(img => img.id === currCanvasImg.selectedImgId)
    // SelectImg(currImg.id)
    openImg(currImg.url)
    drawText(currCanvasImg.lines.txt)
    console.log(currCanvasImg);
    //     gCtx.fillStyle = "#ede5ff"
    //     gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
    //     renderCircle()
    // gCtx.restore()
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    // window.addEventListener('resize', () => {
    //     resizeCanvas()
    //     renderCanvas()
    // })
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
    if (!isCircleClicked(pos)) return
    setCircleDrag(true)
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    const circle = getCircle();
    if (circle.isDrag) {
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        gStartPos = pos
        moveCircle(dx, dy)
        renderCanvas()
    }
}

function onUp() {
    setCircleDrag(false)
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

function openImg(url){
    var img = new Image()
    img.src = url
    // img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    // }
}

function onDrawText(txt) {
    // gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    setCurrImgTxt(txt)
    renderCanvas()
}

function onTxtColorChange(txtColor) {
    setTxtColor(txtColor)
}
function onBackColorChange(txtColor) {
    setBackgroundColor(txtColor)
}
function increaseFont() {
    setIncreaseFont()
}
function decreaseFont() {
    setDecreaseFont()
}
function centerTextAlignment() {
    setCenterTextAlignment()
}
function alignToRight() {
    setAlignToRight()
}
function alignToLeft() {
    setAlignToLeft()
}
function addImg(img) {
    addNewImg(img)
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