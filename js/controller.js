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
}

function renderCanvas() {
    let currCanvasImg = getCurrImg()
    let imgs = getSortImgs()
    let currImg = imgs.find(img => img.id === currCanvasImg.selectedImgId)
    SelectImg(currImg.id)
    openImg(currImg.url)
    drawText()
    // drawText(currCanvasImg.lines[].txt.txt)
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        // resizeCanvas()
        // renderCanvas()
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
    if (!isTxtClicked(ev.offsetY, ev.offsetX)) return
    setTxtDrag(true)
    gStartPos = pos
    document.body.style.cursor = 'grabbing'


    let currImg = getCurrImg();
    document.querySelector('.txtMeme').value = currImg.lines[gCurrMeme.selectedLineIdx].txtObj.txt
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
    document.querySelector('.txtMeme').value = ''
    restMeme()
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
function onSaveMeme() {
    let currImg = getCurrImg()
    // currImg.selectedImgId = gStorageId
    // img.id = gStorageId++
    saveMeme()
    renderCanvas()
}
function onSearch() {
    let val = document.querySelector('.options input').value
    setSort(val)
    renderImgs()
}
function onSort(val, el) {
    // console.log(x.style.fontSize);
    setSize(el)
    setSort(val)
    renderImgs()
}
function onAddTxt() {
    addTxt()
    let currImg = getCurrImg();
    document.querySelector('.txtMeme').value = currImg.lines[gCurrMeme.selectedLineIdx].txtObj.txt
    renderImgs()
}
function onMoveTxtLine() {
    moveTxtLine()
    let currImg = getCurrImg();
    document.querySelector('.txtMeme').value = currImg.lines[gCurrMeme.selectedLineIdx].txtObj.txt
    // renderImgs()
}
function onMyMeme() {
    document.body.classList.add('my-meme')
    let storageImg = loadMyMemes()
    let imgs = storageImg.map(img => {
        return getImgById(img.selectedImgId)
    })
    console.log(imgs);
    let strHtml = ''
    imgs.forEach((img, idx) => {
        strHtml += ` <img onclick="SelectMemeImg(${idx})" src=${img.url}>`
    })
    document.querySelector('.memes-page').innerHTML = strHtml
}
function closeMemePage() {
    document.body.classList.remove('my-meme')
}

function SelectMemeImg(elId) {
    let storageImg = loadMyMemes()
    let allImg = getImgs()
    // console.log(storageImg);
    let findImg = allImg.find(img => img.id === storageImg[elId].selectedImgId) //url
    // console.log(findImg); 
    document.body.classList.add('do-meme')
    openImg(findImg.url)
    setCurrImgId(elId)

    let currMeme = storageImg.filter(img =>img.selectedImgId === findImg.id )
    console.log(currMeme[0]);
    gCurrMeme = currMeme[0]
    drawText()
  
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
        document.querySelector('.share-show').hidden = false
        document.querySelector('.share-container').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
        Share   
        </a>`
    }
    doUploadImg(imgDataUrl, onSuccess);
}

function closeShare() {
    document.querySelector('.share-show').hidden = true
}