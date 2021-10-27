'use strict';


// var gKeywords = {'happy': 12,'funny puk': 1}
var gImgs = [
    { id: 1, url: `<img src=meme-imgs/1.jpg>`, keywords: ['happy'] },
    { id: 2, url: `<img src=meme-imgs/2.jpg>`, keywords: ['happy'] },
    { id: 3, url: `<img src=meme-imgs/3.jpg>`, keywords: ['happy'] },
    { id: 4, url: `<img src=meme-imgs/4.jpg>`, keywords: ['happy'] },
    { id: 5, url: `<img src=meme-imgs/5.jpg>`, keywords: ['happy'] },
    { id: 6, url: `<img src=meme-imgs/6.jpg>`, keywords: ['happy'] },
    { id: 7, url: `<img src=meme-imgs/7.jpg>`, keywords: ['happy'] },
    { id: 8, url: `<img src=meme-imgs/8.jpg>`, keywords: ['happy'] },
    { id: 9, url: `<img src=meme-imgs/9.jpg>`, keywords: ['happy'] },
    { id: 10, url: `<img src=meme-imgs/10.jpg>`, keywords: ['happy'] },
    { id: 11, url: `<img src=meme-imgs/11.jpg>`, keywords: ['happy'] },
    { id: 12, url: `<img src=meme-imgs/12.jpg>`, keywords: ['happy'] },
    { id: 13, url: `<img src=meme-imgs/13.jpg>`, keywords: ['happy'] },
    { id: 14, url: `<img src=meme-imgs/14.jpg>`, keywords: ['happy'] },
    { id: 15, url: `<img src=meme-imgs/15.jpg>`, keywords: ['happy'] },
    { id: 16, url: `<img src=meme-imgs/16.jpg>`, keywords: ['happy'] },
    { id: 17, url: `<img src=meme-imgs/17.jpg>`, keywords: ['happy'] },
    { id: 18, url: `<img src=meme-imgs/18.jpg>`, keywords: ['happy'] },
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

function getimgs(){
    return gImgs
}
// document.querySelector('div').innerHTML=  gImgs[5].url
