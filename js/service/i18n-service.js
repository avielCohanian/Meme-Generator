'use strict'

var gTrans = {
    'gallery': {
        en: 'Gallery',
        he: 'גלריה'
    },
    'memes': {
        en: 'Memes',
        he: 'המימז שלי'
    },
    'about': {
        en: 'About',
        he: 'אוֹדוֹת'
    },
    'funny': {
        en: 'funny',
        he: 'מצחיק'
    },
    'animal': {
        en: 'animal',
        he: 'חיות'
    },
    'men': {
        en: 'men',
        he: 'גברים'
    },
    'woman': {
        en: 'woman',
        he: 'נשים'
    },
    'more...': {
        en: 'more...',
        he: 'עוד'
    },
    'bird': {
        en: 'bird',
        he: 'ציפור'
    },
    'smile': {
        en: 'smile',
        he: 'חיוך'
    },
    'fat': {
        en: 'fat',
        he: 'שמן'
    },
    'dog': {
        en: 'dog',
        he: 'כֶּלֶב'
    },
    'close': {
        en: 'close',
        he: 'סגור'
    },
    'back': {
        en: 'back',
        he: 'חזור'
    },
    'meme-save': {
        en: 'Meme Save',
        he: 'המימז נשמר'
    },
    'search': {
        en: 'Search',
        he: 'חיפוש'
    },
    'delet': {
        en: 'delet',
        he: 'מחק'
    },


}
var gCurrLang = 'en';

function getTrans(transKey) {
    var keyTrans = gTrans[transKey]
    if (!keyTrans) return 'UNKNOWN';
    var txt = keyTrans[gCurrLang]
    if (!txt) txt = keyTrans.en;
    return txt;
}

function setLang(lang) {
    gCurrLang = lang;
}

function getTransText(el) {
    var elTrans = el.dataset.trans
    return getTrans(elTrans)
}
