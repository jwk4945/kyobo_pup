// console.log(1);
import ua from "./ua.js";
import * as storage from "./mo-util-storage.js";
import { getIsAff } from "./mo-util-utils.js";


export function popClose(pop) {
    // console.log(pop)
    document.documentElement.classList.remove('lock');

    pop.style.display = 'none';
    pop.classList.remove('open');
}

export function chkAll(chkAgr1, chkAgr2) {
    const chkAll = document.getElementById('chkAll');
    if (chkAgr1 && chkAgr2) {
        chkAll.checked = true;
    }
}

export function unchkAll(chkAgr1, chkAgr2) {
    const chkAll = document.getElementById('chkAll');
    if (!(chkAgr1 && chkAgr2)) {
        chkAll.checked = false;
    }
}


// 약관동의 flag 현재 값을 가져오는 함수
export function getFlags() {
    const tempFlags = {
        chkAll: document.getElementById('chkAll').checked ? 'Y' : 'N',
        chkAgr1: document.getElementById('chkAgr1').checked ? 'Y' : 'N',
        chkAgr2: document.getElementById('chkAgr2').checked ? 'Y' : 'N',
        chkSms: document.getElementById('chkSms').checked ? 'Y' : 'N',
        chkMail: document.getElementById('chkMail').checked ? 'Y' : 'N'
    }

    // console.log(tempFlags);
    return tempFlags;
}

// 약관동의 - 사용자 체크에 따라 ua.flag 업데이트
export function setFlags() {
    ua.changeFlag('personalInformationAgreementFlag', document.getElementById('chkAgr1').checked ? 'Y' : 'N');
    ua.changeFlag('marketingConsentAgreementFlag', document.getElementById('chkAgr2').checked ? 'Y' : 'N');
    ua.changeFlag('marketingConsentAgreementSmsFlag', document.getElementById('chkSms').checked ? 'Y' : 'N');
    ua.changeFlag('marketingConsentAgreementEmailFlag', document.getElementById('chkMail').checked ? 'Y' : 'N');

    // console.log(ua.flag);
}

export function showLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if(loadingScreen===null)
        return;
    loadingScreen.dataset.isPlayingLoading='true';
}

export function closeLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if(loadingScreen===null)
        return;
    loadingScreen.dataset.isPlayingLoading='false';
}



/** render */
export function setCheckedValue(radios, value) {
    radios.forEach(radio => {
        if (radio.value === value) {
            radio.checked = true;
        }
    })
}


export function setFooterView() {

    const linkLogin = document.getElementById("link_login");
    const linkLogout = document.getElementById("link_logout");

    const liLogin = document.getElementById("li_login");
    const liLogout = document.getElementById("li_logout");

    if (ua.isLogined) {
        // 로그인 됨
        liLogin.style.display = 'none';
        liLogout.style.display = 'block';

        linkLogout.addEventListener("click", function() {
            storage.deleteCookie("accessToken");
            storage.deleteCookie("refreshToken");

            location.reload();
        });
    } else {
        // 로그인 되지 않음
        liLogin.style.display = 'block';
        liLogout.style.display = 'none';

        document.getElementById("link_login").addEventListener("click", function() {
            self.location.href = "https://mmbr.kyobobook.co.kr/login?continue=" + window.location.href + "&loginChannel=134";
            // self.location.href = "http://mmbr.ndev.kyobobook.co.kr/login?continue=" + window.location.href + "&loginChannel=134";
        });
    }

}

export function setConsentView() {

    const isAff = getIsAff();
    if (isAff) {
        // [제휴]인 경우 임시 pass
        return;
    }
    // ua.changeFlag('eventFlag', 'Y');
    // ua.changeFlag('remainingPointsFlag', 'Y');
    // ua.changeFlag('personalInformationAgreementFlag', 'N');
    // ua.changeFlag('marketingConsentAgreementFlag', 'N');
    // ua.changeFlag('marketingConsentAgreementSmsFlag', 'N');
    // ua.changeFlag('marketingConsentAgreementEmailFlag', 'N');

    let agreeBox = document.getElementById("agreeBox");
    let allAgreeBox = document.getElementById("allAgreeBox");
    let perSonalAgreeBox = document.getElementById("personalAgreeBox");
    let marketAgreeBox = document.getElementById("marketAgreeBox");


    // 동의여부 "display" - from api
    perSonalAgreeBox.style.display = (!ua.isLogined || (ua.isLogined && ua.flag.personalInformationAgreementFlag !== 'Y')) ? 'flex' : 'none';
    marketAgreeBox.style.display = (!ua.isLogined || (ua.isLogined && ua.flag.marketingConsentAgreementFlag !== 'Y')) ? 'flex' : 'none';
    allAgreeBox.style.display = (perSonalAgreeBox.style.display === 'flex') || (marketAgreeBox.style.display === 'flex') ? 'flex' : 'none';

    // 동의여부 "check" - from api
    document.getElementById('chkAgr1').checked = ua.flag.personalInformationAgreementFlag === 'Y' ? true : false;
    document.getElementById('chkAgr2').checked = ua.flag.marketingConsentAgreementFlag === 'Y' ? true : false;
    document.getElementById('chkSms').checked = ua.flag.marketingConsentAgreementSmsFlag === 'Y' ? true : false;
    document.getElementById('chkMail').checked = ua.flag.marketingConsentAgreementEmailFlag === 'Y' ? true : false;

    // 기존 동의 이력이 있을 때 && 세션에 동의 이력이 있을 때
    // 1.
    // (서버) NNNN
    // (화면) NNNN
    // 2.
    // (서버) NNNN - 이전에 동의한 적이 없고
    // (화면) YNNN - Y가 1개 이상일 때
    // 3.
    // (서버) YNNN - 이전에 동의한 적이 있고
    // (화면) NYYN - Y가 1개 이상일 때
    const storageKeys = ['chkAll', 'chkAgr1', 'chkAgr2', 'chkSms', 'chkMail'];
    storageKeys.forEach(key => {
        const item = JSON.parse(localStorage.getItem(key));
        if (item && item.value === 'Y') {
            document.getElementById(key).checked = true;
        }
    });

    // 전체 동의 이력이 있으면 confirm 버튼 보이지 않게 처리
    // if (Object.values(ua.flag).every(val => val === 'Y')) {
    if (ua.flag.personalInformationAgreementFlag === 'Y' && ua.flag.marketingConsentAgreementFlag === 'Y' && ua.flag.marketingConsentAgreementSmsFlag === 'Y' && ua.flag.marketingConsentAgreementEmailFlag === 'Y' ) {
        document.querySelector('.confirm-btn-box').style.display = 'none';
    }
}

export function setEventView() {
    if (ua.flag.eventFlag === 'Y' && ua.flag.remainingPointsFlag === 'Y') {
        document.querySelectorAll('[class *= "eventView"]').forEach(e => {
            e.style.display = 'block';
        });
    }

    // 전체 동의 이력이 있을때, eventView 미노출
    if (ua.flag.marketingConsentAgreementFlag === 'Y' && ua.flag.personalInformationAgreementFlag === 'Y') {
        document.querySelectorAll('[class *= "eventView"]').forEach(e => {
            e.style.display = 'none';
        });
    }
}

export function handleConsentCheckboxChange(e) {
    // 체크 버튼
    const chkAll = document.getElementById('chkAll');
    const chkAgr1 = document.getElementById('chkAgr1');
    const chkAgr2 = document.getElementById('chkAgr2');
    const toastElem = document.querySelector('.toast_wrap_re');

    const chkSms = document.getElementById('chkSms');
    const chkMail = document.getElementById('chkMail');

    if (e.target === chkAll) {
        if (chkAll.checked) {
            chkAgr1.checked = true;
            chkAgr2.checked = true;
            chkSms.checked = true;
            chkMail.checked = true;
        } else {
            chkAgr1.checked = false;
            chkAgr2.checked = false;
            chkSms.checked = false;
            chkMail.checked = false;
        }
    }


    // chk-arg2 체크 시
    if (e.target === chkAgr2) {
        // toast 메세지 on
        if (!chkAgr1.checked  && chkAgr2.checked) {
            toastElem.classList.add('on');

            setTimeout(() => {
                toastElem.classList.remove('on');
            }, 2500);
        }
        // chk-arg2 체크 시 chkSms, chkMail checked로 변경
        if (chkAgr2.checked) {
            chkSms.checked = true;
            chkMail.checked = true;
        } else {
            chkSms.checked = false;
            chkMail.checked = false;
        }
    }
}

export function handleConfirmButtonClick(e, popup) {
    const elem = e.target;

    const popOpen = document.getElementById(popup);
    const dims = document.querySelectorAll('.dim');

    // if (elem.classList.contains('active')) {
    //     elem.classList.remove('active');
    //     popOpen.classList.remove('active');
    //     dims.forEach(dim => dim.classList.remove('active'));
    //     document.documentElement.classList.remove('lock');
    // } else {
    //     elem.classList.add('active');
    //     popOpen.classList.add('active');
    //     dims.forEach(dim => dim.classList.add('active'));
    //     document.documentElement.classList.add('lock');
    // }

    popOpen.classList.add('active');
    dims.forEach(dim => dim.classList.add('active'));
    document.documentElement.classList.add('lock');
}
export function handlePointNextButtonClick(e, popup) {
    const elem = e.target;
    const dims = document.querySelectorAll('.dim');
    const popOpen = document.getElementById(popup);

    if (popOpen.classList.contains('active')) {
        elem.classList.remove('active');
        popOpen.classList.remove('active');
        dims.forEach(dim => dim.classList.remove('active'));
        document.documentElement.classList.remove('lock');
    }
}

export function handleAgreeButtonClick(e) {

    // 체크 버튼
    const chkAgr1 = document.getElementById('chkAgr1');
    const chkAgr2 = document.getElementById('chkAgr2');
    const toastElem = document.querySelector('.toast_wrap_agree');

    const chkSms = document.getElementById('chkSms');
    const chkMail = document.getElementById('chkMail');

    const personalPop = document.getElementById('personalPop');
    const marketPop = document.getElementById('marketPop');

    if (e.target.id === 'personalAgrBtn') {
        // 개인정보 제3자 제공 - 동의
        chkAgr1.checked = true;

        popClose(personalPop);
        chkAll(chkAgr1.checked, chkAgr2.checked);
    } else if (e.target.id === 'personalDisAgrBtn') {
        // 개인정보 제3자 제공 - 동의안함
        chkAgr1.checked = false;
        popClose(personalPop);
        unchkAll(chkAgr1.checked, chkAgr2.checked);
    } else if (e.target.id === 'marketAgrBtn') {
        // 마케팅 수신 - 동의
        if (chkSms.checked || chkMail.checked) {
            chkAgr2.checked = true;

            popClose(marketPop);
            chkAll(chkAgr1.checked, chkAgr2.checked);
        } else if ((chkSms.checked && chkMail.checked) === false) {
            // 마케팅 수신 - 동의안함
            toastElem.classList.add('on');

            setTimeout(() => {
                toastElem.classList.remove('on');
            }, 2500);

        }
    } else if (e.target.id === 'marketDisAgrBtn') {
        // 마케팅 수신 - 동의안함
        chkAgr2.checked = false;
        chkSms.checked = false;
        chkMail.checked = false;
        popClose(marketPop);

        unchkAll(chkAgr1.checked, chkAgr2.checked);
    } else if (e.target.id === 'btnClose') {
        // pupup 내 'X' 클릭
        chkSms.checked = chkAgr2.checked ? true : false;
        chkMail.checked = chkAgr2.checked ? true : false;

        popClose(marketPop);
    }
}
