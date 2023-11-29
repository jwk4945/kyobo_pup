import insData from "./insData.js";
import AffData from "./affData.js";
import ua from "./ua.js";


let fileName;
let fullFileName;
let info;

export function getFileName() {
    // 🔷 url -> "2B_061" 추출
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

export function getFullFileName() {
    const url = window.location.href;
    const fileNameWithQuery = url.split('/').pop();
    const fileNameWithoutKeyword = fileNameWithQuery.split('?')[0];

    fullFileName = fileNameWithoutKeyword.replace('.html', '');

    return fullFileName;
}

export function getIsAff() {
    // 제휴 여부
    const url = window.location.href;
    const fileNameWithQuery = url.split('/').pop();
    const fileNameWithoutKeyword = fileNameWithQuery.split('?')[0];
    const fileNameWithoutPrefix = fileNameWithoutKeyword.substring(0, 2);

    const tempFileName = fileNameWithoutPrefix.replace('.html', '');

    if (tempFileName === 'h1') {
        ua.isHeymama = 'Y';
        return true;
    } else if (tempFileName === 'd1') {
        ua.isDonots = 'Y';
        return true;
    }

    return false;
}

export function getInfo() {
    // find By fileName
    info = findByfileName(getFileName());

    return info;
}
export function getAffInfo() {
    const affInfo = findAffByFileName(getFileName());

    return affInfo;
}


export function findByfileName(fileName) {
    // 🔷 insData 중에 처음 일치하는 값
    for (let obj of insData) {
        if (obj.contentsId && obj.contentsId.includes(fileName)) {
            return obj;
        }
    }
    return insData[0];
}

export function findAffByFileName() {
    for (let obj of AffData) {
        if (obj.contentsId && obj.contentsId.includes(fileName)) {
            return obj;
        }
    }
    return AffData[0];
}

export function setUserAgentsetUserAgent() {
    // const userAgent = navigator.userAgent.toLowerCase();
    //
    // if (userAgent.indexOf('android') > -1) {
    //     ua.setUserAgent('isMobile', true);
    //     ua.setUserAgent('isAndroid', true);
    // } else if (userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1) {
    //     ua.setUserAgent('isMobile', true);
    //     ua.setUserAgent('isIOS', true);
    // }
}
