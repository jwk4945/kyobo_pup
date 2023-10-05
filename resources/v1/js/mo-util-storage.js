
import * as ui from "./mo-view-ui.js";

// 쿠키에서 accessToken 값을 가져오는 함수
export function getAccessTokenFromCookie() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('accessToken=')) {
            return cookie.substring('accessToken='.length);
        }
    }
    return null;
}

// accessToken에서 교보문고 회원번호(sub) 값을 가져오는 함수
export function getSubFromAccessToken(token) {
    try {
        return JSON.parse(atob(token.split('.')[1])).sub;
    } catch(err) {
        return null;
    }
    // const base64Url = token.split('.')[1];
    // const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    // }).join(''));
    //
    // return JSON.parse(jsonPayload);
}

export function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.kyobobook.co.kr";
}


export function setConsentLocalStorage() {
    const tempFlags = ui.getFlags();
    const expiryTime = new Date().getTime() + (10 * 60 * 1000); // 보관기간: 10분; test 시 1분 set

    for (let key in tempFlags) {
        if (tempFlags[key]) {
            localStorage.setItem(key, JSON.stringify({
                value: tempFlags[key],
                expiryTime: expiryTime
            }));
        } else {
            localStorage.removeItem(key);
        }
    }
}

export function getConsentLocalStorage() {
    const keys = ['chkAll', 'chkAgr1', 'chkAgr2', 'chkSms', 'chkMail'];

    keys.forEach(key => {
        // console.log('getConsentLocalStorage', key, ua.flag);
        const storedData = localStorage.getItem(key);

        if (storedData) {
            const { value, expiryTime } = JSON.parse(storedData);
            const currentTime = new Date().getTime();

            if (currentTime < expiryTime) {
                document.getElementById(key).checked = (value === 'Y' ? true : false);
                if (key === 'chkSms' || key === 'chkMail') {
                    document.getElementById('chkAgr2').checked = (value === 'Y' ? true : false);
                }
            } else {
                localStorage.removeItem(key);
            }
        }
    });
}


export function getLocalStorage(key, isGlobal = false, contentsId) {
    let localData = localStorage.getItem(isGlobal? key: contentsId);
    if (localData===null || !isJsonString(localData)) {
        removeLocalStorage(key, isGlobal);
        return null;
    }
    localData = JSON.parse(localData);
    localData = isGlobal? localData : localData[key];
    const currDate = new Date().toLocaleDateString().replace(/\s/g,'');

    if (localData===undefined || new Date(currDate) >= new Date(localData.expiry)) {
        removeLocalStorage(key, isGlobal);
        return null;
    }
    return localData.value;
}


export function setLocalStorage(key, value, period, isGlobal = false, contentsId) {
    const expiry = new Date(Date.now() + (period * 24 * 3600 * 1000))
        .toLocaleDateString().replace(/\s/g, '');
    const inputData = {
        value: value,
        expiry: expiry
    };

    let localData;
    if (isGlobal){
        localData = inputData;
    } else {
        localData = localStorage.getItem(contentsId);
        localData = (localData === null ? {} : JSON.parse(localData));
        localData[key] = inputData;
    }

    localStorage.setItem(isGlobal? key: contentsId, JSON.stringify(localData));
}

function removeLocalStorage(key, isGlobal=false, contentsId){
    if(isGlobal){
        localStorage.removeItem(key);
    }else {
        let localData = localStorage.getItem(contentsId);
        if (!isJsonString(localData) || localData===null)
            localData={};
        else {
            localData = JSON.parse(localData);
            delete localData[key];
        }
        localStorage.setItem(contentsId, JSON.stringify(localData));
    }
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}