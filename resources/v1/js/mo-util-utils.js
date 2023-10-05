import insData from "./insData.js";
import ua from "./ua.js";


let fileName;
let info;

export function getFileName() {
    const url = window.location.href;
    const fileNameWithQuery = url.split('/').pop();
    const fileNameWithoutKeyword = fileNameWithQuery.split('?')[0];
    // const fileNameWithoutPrefix = fileNameWithoutKeyword.replace('open_', '');
    const fileNameWithoutPrefix = fileNameWithoutKeyword.slice(3);


    // test url: http://127.0.0.1:5501/WEB-INF/views/journey/v2_2D_091.html
    // 운영 url: https://life-marketing.kyobobook.co.kr/journey/v2_2B_061?kywr=1LCB6roRfjT16
    // (prefix) v1: 임시오픈 / v2: 확대오픈 / o1: 정식오픈
    fileName = fileNameWithoutPrefix.replace('.html', '');

    return fileName;
}

export function getInfo() {
    // find By fileName
    info = findByfileName(getFileName());

    return info;
}


export function findByfileName(fileName) {
    for (let obj of insData) {
        if (obj.contentsId && obj.contentsId.includes(fileName)) {
            return obj;
        }
    }
    return insData[0];
}


export function checkUserAgent() {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf('android') > -1) {
        ua.setUserAgent('isMobile', true);
        ua.setUserAgent('isAndroid', true);
    } else if (userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1) {
        ua.setUserAgent('isMobile', true);
        ua.setUserAgent('isIOS', true);
    }
}
