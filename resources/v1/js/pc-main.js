// console.log(1);
import ua from "./ua.js";

import * as storage from "./mo-util-storage.js";
import * as post from "./mo-api-post.js";
import * as utils from "./mo-util-utils.js";
import * as ui from "./mo-view-ui.js";
import * as ga from "./GA.js";

import { renderInsuaranceView, renderConsentView } from "./mo-view-render.js";
import { handleShareButtonClick } from "./mo-util-share.js";
import { getIsLogin } from "./mo-api-get.js";


let accessToken;
let currentUrl;
let info;


function createUserKey() {
    let userKey = storage.getLocalStorage('user-key', true, ua.contentsId);
    if(userKey === null && ua.contentsId !== undefined) {
        const now = new Date();

        const yyyy = now.getFullYear();
        const MM = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const HH = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');

        userKey = `${yyyy}${MM}${dd}${HH}${mm}${ss}` + '-' + Date.now().toString(36);
    }

    if (userKey !== null){
        storage.setLocalStorage('user-key',userKey, 14, true, ua.contentsId);
    }

    return userKey;
}

document.addEventListener('DOMContentLoaded', function() {

    // 콘텐츠 ID
    ua.contentsId = utils.getFileName();
    // 교보문고 검색 키워드
    ua.searchKeyword = document.querySelector('#srch_kywr_name').value;
    // 교보문고 검색 키워드 - decoded
    ua.searchKeywordD = document.querySelector('#srch_kywr_name_d').value;

    // set userKey
    ua.userKey = createUserKey();


    const devices = (document.querySelector('#devices').value).replace(/[{ }]/g, '').split(',')
    devices.forEach(device => {
        const [key, value] = device.split("=");
        const boolValue = value === 'true';

        ua.setUserAgent(key, boolValue);
    });

    info = {
        linkInfoForInsurance: {
            url: "https://www.kyobo.com/dgt/web/dtp/insurance-detail?isPdtCd=1000938&evcode=DCJ_MO",
            name: "교보1년저축보험(무배당)[D]",
        }
    };

})


document.addEventListener('DOMContentLoaded', function() {
    // // 🔷 add GA event
    // document.getElementById('link_home').addEventListener('click', e => ga.setGAClickHandler(e));
    //
    // if (document.getElementById('feedback-radio-01')) {
    //     document.getElementById('feedback-radio-01').addEventListener('click', e => ga.setGAClickHandler(e));
    // }
    // if (document.getElementById('feedback-radio-02')) {
    //     document.getElementById('feedback-radio-02').addEventListener('click', e => ga.setGAClickHandler(e));
    // }
    //
    // // [제휴]인 경우 임시 pass
    // if (document.getElementById('confirm')) {
    //     document.getElementById('confirm').addEventListener('click', e => ga.setGAClickHandler(e));
    // }
    //
    // // default 팝업 (팝업 번호 0번)
    // if (document.getElementById('btnNext')) {
    //     document.getElementById('btnNext').addEventListener('click', e => ga.setGAClickHandler(e));
    // }
    //
    // // 포인트에서는 확인하기 버튼 눌렀을 때 상품으로 이동
    // if (document.getElementById('btnLoginPointEnd01')) {
    //     document.getElementById('btnLoginPointEnd01').addEventListener('click', e => ga.setGAClickHandler(e));
    // }
    //
    // // 🔶 보험 영역 동적으로 render 하므로 render.js 에서 이벤트 등록
    // // 파일럿 페이지인 경우 html 하드코딩 하므로 DOMContentLoaded 시점에 render 완료되기 때문에 아래에서 이벤트 등록
    // if (document.getElementById('linkForInsurance')) {
    //     document.getElementById('linkForInsurance').addEventListener('click', e => ga.setGAClickHandler(e));
    // }
    //
    //
    // // 🔶 이벤트 플로팅 UI
    // const btnPointWrap = document.getElementById('btnPointWrap');
    // if (btnPointWrap) {
    //     btnPointWrap.addEventListener('click', e => ga.setGAClickHandler(e));
    // }

});

document.addEventListener('DOMContentLoaded', function() {
    // 🔷🔷🔷 'DOMContentLoaded' 초기 셋팅
    // console.log('DOMContentLoaded');

    currentUrl = window.location.href;

    // 🔷 token set
    accessToken = storage.getAccessTokenFromCookie();
    // 🔷 bookstoreMemberNo(sub) set
    ua.bookstoreMemberNo = storage.getSubFromAccessToken(accessToken);


    // 🔷 isLogin?
    const linkLogin = document.getElementById("link_login");
    const linkLogout = document.getElementById("link_logout");

    getIsLogin(accessToken).then( res => {
        ua.changeLoginStatus(res);

        if (res) { // true
            linkLogin.style.display = 'none';
            linkLogout.style.display = 'block';

            linkLogout.addEventListener("click", function() {
                storage.deleteCookie("accessToken");
                storage.deleteCookie("refreshToken");

                location.reload();
            });
        } else { // false
            linkLogin.style.display = 'block';
            linkLogout.style.display = 'none';

            document.getElementById("link_login").addEventListener("click", function() {
                self.location.href = "https://mmbr.kyobobook.co.kr/login?continue=" + window.location.href + "&loginChannel=134";
                // self.location.href = "http://mmbr.ndev.kyobobook.co.kr/login?continue=" + window.location.href + "&loginChannel=134";
            });
        }
    });


    // 🔷 fileName, info set
    // const fileName = utils.getFileName();
    // setInfo(utils.getInfo());
    // console.log(info);

    // const fullFileName = utils.getFullFileName();

    // 🔷 고객여정 1.0 initSetting
    // main.initSetting(fileName, info);
    // 🔷 교보문고 검색 키워드
    // ua.searchKeyword = document.querySelector('#srch_kywr_name').value;
    // 🔷 contentsId
    // ua.contentsId = fileName; //document.querySelector('#csjr_ctts_num').value;

    // 🔷 보험 상품 view
    // renderInsuaranceView(info, fileName);

    // 🔷 동의영역 view
    // renderConsentView(fileName);

    // 🔷 동의여부 "check" - from localStorage
    storage.getConsentLocalStorage();


    // 🔷 컨텐츠 평가(좋아요/싫어요) 저장 값 set
    const radios = document.querySelectorAll('input[name="feedback-radio"][type="radio"]');
    const localCheckedValue = storage.getLocalStorage('feedback-value', false, ua.contentsId);

    ui.setCheckedValue(radios, localCheckedValue);

    radios.forEach(radio => {
        radio.addEventListener('change', e => {
            console.log('change');
            post.postReview(e.target.value, ua.contentsId, ua.searchKeyword, ua.userKey);
            storage.setLocalStorage('feedback-value', e.target.value, 14, false, ua.contentsId); //2주만 보관
        });
    });


    // 🔷 'linkForInsurance' add click event
    const linkForInsurance = document.getElementById('linkForInsurance');
    if (linkForInsurance) {
        linkForInsurance.addEventListener('click', e => {
            post.postBannerClickInfo(info.linkInfoForInsurance);
        });
    }


    // 🔷 sns share
    document.addEventListener('click', e => {
        e.stopPropagation();
        handleShareButtonClick(e, currentUrl);
    });

    // 🔷 sns share - url copy
    const copyUrl = document.getElementById('url-copy-span');
    if (copyUrl) {
        copyUrl.innerText = currentUrl;
    }



});


