// console.log(1);
import ua from "./ua.js";
import { AnimationManager } from "./open_AnimationManager.js";

import * as post from "./mo-api-post.js";

import * as storage from "./mo-util-storage.js";
import * as utils from "./mo-util-utils.js";
import * as ui from "./mo-view-ui.js";
import * as ga from "./GA.js";

import { renderInsuaranceView, renderConsentView } from "./mo-view-render.js";
import { handleShareButtonClick } from "./mo-util-share.js";

import { getIsLogin, getAgreement, getIsEvent } from "./mo-api-get.js";
import { postEvent } from "./mo-api-post.js";

import { exPilot, exOpen } from "./mo-data-contents.js";
import { info, affInfo, setInfo, setAffInfo } from "./info.js";



// 🔶 set from domContentLoaded 'ua'
let _searchKeyword;
let _contentsId;
let _userKey;

let _surveyRadiosSelector = 'input[type="radio"][name="kyobolife-survey"]';
let _nextButtonSelector = 'button#goNextBtn';
let _isUserInLastPage = true;
let _didTogglePageContents = false;

let accessToken;
let currentUrl;


export const main = (function () {
    /******************************************************************************** 고객여정 1.0 initSetting */
    function initSetting(fileName, info) {

        // 교보문고 검색 키워드
        _searchKeyword = document.querySelector('#srch_kywr_name').value;
        ua.searchKeyword = document.querySelector('#srch_kywr_name').value;
        // 교보문고 검색 키워드 - decoded
        ua.searchKeywordD = document.querySelector('#srch_kywr_name_d').value;

        if ((document.querySelector('#srch_kywr_name_d').value).substring(0, 3) === 'LMS') {
            ua.isSmsEvent = 'Y';
            ua.smsEventType = document.querySelector('#srch_kywr_name_d').value;
        }

        const devices = (document.querySelector('#devices').value).replace(/[{ }]/g, '').split(',')
        devices.forEach(device => {
            const [key, value] = device.split("=");
            const boolValue = value === 'true';

            ua.setUserAgent(key, boolValue);
        })


        // contentsId
        //css 전역변수 설정
        _contentsId = fileName; //document.querySelector('#csjr_ctts_num').value;

        // user key 생성 .. ua에 임시 저장
        ua.userKey = createUserKey();
        _userKey = createUserKey();
        setPropertiesForCss();
        //gnb(헤더) 자동 숨기기 설정
        setAutoHideElements();
        //결과화면 처리함수 선택호출
        getMethodForShowResult(info).call(this, info);
        // 브라우저 뒤로가기 캐쉬 초기화
        initSettingForBfCache();
    }

    function createUserKey() {
        let userKey = storage.getLocalStorage('user-key', true, _contentsId);
        if(userKey === null && _contentsId !== undefined) {
            const now = new Date();

            const yyyy = now.getFullYear();
            const MM = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
            const dd = String(now.getDate()).padStart(2, '0');
            const HH = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');

            userKey = `${yyyy}${MM}${dd}${HH}${mm}${ss}` + '-' + Date.now().toString(36);
        }

        if (userKey !== null){
            storage.setLocalStorage('user-key',userKey, 14, true, _contentsId);
        }

        return userKey;
    }

    function setPropertiesForCss() {
        const _setPropertiesForCss = () => {
            document.documentElement.style.setProperty('--vscrollwidth', `${window.innerWidth - document.documentElement.clientWidth}px`);
            document.documentElement.style.setProperty('--1vw', `${Math.round(document.documentElement.clientWidth / 100 * 10) / 10}px`);
            document.documentElement.style.setProperty('--100vh-inner', `${document.documentElement.clientHeight}px`);
        }
        _setPropertiesForCss();
        window.addEventListener('resize',_setPropertiesForCss);
        window.addEventListener('resize',()=>AnimationManager.set100vh(document.documentElement.clientHeight));
    }

    function setAutoHideElements(hideTargets) {
        hideTargets = hideTargets || [
            // document.querySelector('nav'),
            document.querySelector('header'),
            // document.querySelector('#goFirstBtn')
        ];
        let isShowing = true;
        let prevScrollY = 0;
        let firstScrollY;
        let prevScrolledDown = false;
        // const scrollYValue = 50;
        const scrollYValue = 30;
        // const gnb = document.querySelector('nav');
        const gnb = document.querySelector('header');
        if(gnb===null)
            return;

        window.addEventListener('scroll',e => {
            if (window.scrollY <= 0) {
                return
            }

            let isScrollingDown = window.scrollY > prevScrollY;
            //화면 스크롤이 가장 위인 경우, 위로 스크롤하면 바로 등장
            if(!isScrollingDown && window.scrollY === 0) {
                for(let target of hideTargets) {
                    if(target!==null && target.classList.contains('hide'))
                        target.classList.remove('hide');
                }
            }
            else if(isShowing && isScrollingDown || !isShowing && !isScrollingDown){
                let hasChangedDirection = isScrollingDown^prevScrolledDown;
                prevScrolledDown = isScrollingDown;
                if(hasChangedDirection){
                    firstScrollY = window.scrollY;
                    return;
                }
                if(Math.abs(window.scrollY-firstScrollY) > scrollYValue){
                    isShowing = !isShowing;
                    for(let target of hideTargets) {
                        if(target!==null) {
                            if (isShowing)
                                target.classList.remove('hide');
                            else
                                target.classList.add('hide');
                        }
                    }
                }
            }
            prevScrollY = window.scrollY;
        });
    }

    function getMethodForShowResult({nextButtonSelector=_nextButtonSelector, surveyRadioSelector=_surveyRadiosSelector}) {
        //설문조사 라디오버튼 selector
        _surveyRadiosSelector = surveyRadioSelector;

        // 1. 확인하기 버튼이 있는 경우
        _nextButtonSelector = nextButtonSelector;
        if(document.querySelector(_nextButtonSelector)!==null)
            return initSettingForSubmitButton;

        //2.밸런스 게임인 경우 (선택 시 바로 결과페이지 등장)
        else if(document.querySelector('.balance-game')!==null)
            return initSettingForBalanceGame;

        //3.팩트체크인 경우 (마지막 슬라이드 이후 결과페이지 등장)
        else if(document.querySelector('.fact-check')!==null)
            return initSettingForFactCheck;

        //4.결과화면이 없는 경우 (일반 정보제공형)
        else
            return ()=>{};
    }

    function initSettingForSubmitButton({bPostSurveyInput=true,
                                            forceEnableNextButton=false}){
        setUserInLastPage(false);
        initSettingForButtonEnable(forceEnableNextButton); // 버튼 활성화 처리
        initSettingForSubmitSurvey(bPostSurveyInput); // 설문조사 결과 제출 및 가져오기
        setGoNextAndFirstBtn(); // 확인하기 / 뒤로가기 버튼 처리
    }

    function initSettingForButtonEnable(){
        const confirm = document.querySelector(_nextButtonSelector);

        //확인하기 버튼 활성화 처리
        [...document.querySelectorAll(_surveyRadiosSelector)].forEach(elem =>
            elem.addEventListener('change', e => {
                if (confirm !== null)
                    confirm.disabled = false;
            })
        );
    }

    function initSettingForSubmitSurvey(bPost=true){
        if(bPost===false ||
            document.querySelector('.survey-form input[type="radio"][name="kyobolife-survey"]')===null)
            return;
        const submitBtn = document.querySelector('button#goNextBtn');
        if(submitBtn===null)
            return;

        submitBtn.addEventListener('click', e => post.postSurveyInput());
    }

    function setGoNextAndFirstBtn(callbackForNext, callbackForPrev){
        const goNextBtn = document.querySelector('#goNextBtn');
        const goFirstBtn = document.querySelector('#goFirstBtn');

        // 확인하기버튼 callback
        callbackForNext = callbackForNext || (() => {
            if(document.querySelector('.li-item-result')===null)
                return;
            const index = [...document.querySelectorAll('.survey-form input[type="radio"]')]
                .findIndex(item => item === document.querySelector('.survey-form input[type="radio"]:checked'));
            document.querySelectorAll('.li-item-result')[index].classList.add('active');
            document.querySelectorAll('.li-item-result')[index].querySelector('small').classList.remove('fc-4');
        });
        // 돌아가기버튼 callback
        callbackForPrev = callbackForPrev || (() => {
            window.setTimeout(() => {
                [...document.querySelectorAll('.survey-form li')].forEach(li => li.style.transform = '');
                [...document.querySelectorAll('.li-item-result')].forEach(li => li.classList.remove('active'));
            }, 0);
        });

        if(goNextBtn!==null){
            goNextBtn.addEventListener('click',e=>{
                togglePageContents();
                callbackForNext();
                AnimationManager.setElemsAniOnScroll();
                // document.documentElement.classList.remove('overflow-y-hidden');
                setUserInLastPage(true);
                //애니메이션
                AnimationManager.setElemsAniOnResult();
            });
        }
        if(goFirstBtn!==null){
            goFirstBtn.addEventListener('click',e=>{
                const gnb = document.querySelector('nav');
                if(gnb!==null)
                    gnb.classList.remove('hide');
                togglePageContents();

                if(callbackForPrev!==null)
                    callbackForPrev();
                // document.documentElement.classList.add('overflow-y-hidden');
                setUserInLastPage(false);
            });
        }
    }

    function setUserInLastPage(isTrue){
        _isUserInLastPage = isTrue;
    }

    function initSettingForBfCache() {
        window.addEventListener('pageshow', function(event) {
            if (event.persisted) {
                location.reload();
            }
        });
    }

    function togglePageContents(bOnce=false){
        if( (bOnce===true && _didTogglePageContents===false) || bOnce===false) {
            [...document.querySelectorAll('[data-is-not-result-page=true]')].forEach(elem => elem.dataset.isNotResultPage = 'processing');
            [...document.querySelectorAll('[data-is-not-result-page=false]')].forEach(elem => elem.dataset.isNotResultPage = 'true');
            [...document.querySelectorAll('[data-is-not-result-page=processing]')].forEach(elem => elem.dataset.isNotResultPage = 'false');
            _didTogglePageContents = true;
        }

        showSelectiveResult();
    }

    function showSelectiveResult() {
        if (document.querySelector("#selective-result-area") !== null) {
            const radios = [...document.querySelectorAll(_surveyRadiosSelector)];
            const checkedIndex = radios.findIndex(radio => radio === document.querySelector(`${_surveyRadiosSelector}:checked`));
            [...document.querySelectorAll('#selective-result-area .selective-result')].forEach((result, idx) => {
                if (idx === checkedIndex)
                    result.classList.remove('display-none');
                else
                    result.classList.add('display-none');
            })
        }
    }


    function setUserInLastPage(isTrue){
        _isUserInLastPage = isTrue;
    }

    function initSettingForFactCheck(){
        const swiper = new Swiper(".swiper-container",{
            loop: false,
            pagination:{
                el: '.swiper-pagination',
                type: 'bullets',
                bulletClass: 'swiper-my-bullet',
                bulletActiveClass: 'active',
            }
        });

        main.setUserInLastPage(false);

        swiper.on('slideChange',swiper=>{

            if((swiper.realIndex === swiper.slides.length-1) //마지막 슬라이드 도착했거나
                ||(swiper.realIndex === swiper.slides.length-2 && swiper.previousIndex === swiper.slides.length-1)) //마지막슬라이드에서 직전슬라이드로 돌아온 경우
            {
                togglePageContents();
                main.setUserInLastPage(true);
                document.querySelector('.swiper-pagination').classList.toggle('display-none');
                // 마지막 슬라이드
                if(swiper.realIndex === swiper.slides.length-1) {
                    document.querySelector('#nextDiv').style.marginTop = `-${document.querySelector('.swiper-wrapper').clientHeight}px`;
                    AnimationManager.setElemsAniOnScroll();
                    AnimationManager.setElemsAniOnResult();
                }
            }
        })
    }

    /******************************************************************************** 고객여정 1.0 initSetting */



    function triggerLoadingScreen(info) {
        ui.showLoadingScreen();
        window.setTimeout(()=>
            post.postBannerClickInfo(info, ui.closeLoadingScreen()), 2000); //로딩스크린 2초후 실행
    }


    return {
        initSetting, createUserKey, setPropertiesForCss, setAutoHideElements, getMethodForShowResult, initSettingForBfCache, initSettingForSubmitButton
        , initSettingForButtonEnable, initSettingForSubmitSurvey, setGoNextAndFirstBtn, togglePageContents, showSelectiveResult, initSettingForFactCheck, setUserInLastPage
        , triggerLoadingScreen
    }
})();



document.addEventListener('DOMContentLoaded', function() {
    // 🔷 add GA event
    document.getElementById('goBackBtn').addEventListener('click', e => ga.setGAClickHandler(e));
    document.getElementById('link_home').addEventListener('click', e => ga.setGAClickHandler(e));
    document.getElementById('link_share').addEventListener('click', e => ga.setGAClickHandler(e));

    if (document.getElementById('feedback-radio-01')) {
        document.getElementById('feedback-radio-01').addEventListener('click', e => ga.setGAClickHandler(e));
    }
    if (document.getElementById('feedback-radio-02')) {
        document.getElementById('feedback-radio-02').addEventListener('click', e => ga.setGAClickHandler(e));
    }

    // [제휴]인 경우 임시 pass
    if (document.getElementById('confirm')) {
        document.getElementById('confirm').addEventListener('click', e => ga.setGAClickHandler(e));
    }

    // default 팝업 (팝업 번호 0번)
    if (document.getElementById('btnNext')) {
        document.getElementById('btnNext').addEventListener('click', e => ga.setGAClickHandler(e));
    }

    // 포인트에서는 확인하기 버튼 눌렀을 때 상품으로 이동
    if (document.getElementById('btnLoginPointEnd01')) {
        document.getElementById('btnLoginPointEnd01').addEventListener('click', e => ga.setGAClickHandler(e));
    }

    // 🔶 보험 영역 동적으로 render 하므로 render.js 에서 이벤트 등록
    // 파일럿 페이지인 경우 html 하드코딩 하므로 DOMContentLoaded 시점에 render 완료되기 때문에 아래에서 이벤트 등록
    if (document.getElementById('linkForInsurance')) {
        document.getElementById('linkForInsurance').addEventListener('click', e => ga.setGAClickHandler(e));
    }


    // 🔶 참여형(정답 확인하기)
    const goNextBtn = document.getElementById('goNextBtn');
    if (goNextBtn) {
        document.getElementById('goNextBtn').addEventListener('click', e => ga.setGAClickHandler(e));
    }

    // 🔶 [제휴] linkForHeymama / linkForDonots
    const linkForHeymama = document.getElementById('linkForHeymama');
    if (linkForHeymama) {
        linkForHeymama.addEventListener('click', e => ga.setGAClickHandler(e));
    }
    const linkForDonots = document.getElementById('linkForDonots');
    if (linkForDonots) {
        linkForDonots.addEventListener('click', e => ga.setGAClickHandler(e));
    }

    // 🔶 이벤트 플로팅 UI
    const btnPointWrap = document.getElementById('btnPointWrap');
    if (btnPointWrap) {
        btnPointWrap.addEventListener('click', e => ga.setGAClickHandler(e));
    }

});

document.addEventListener('DOMContentLoaded', function() {
    // 🔷🔷🔷 'DOMContentLoaded' 초기 셋팅
    // console.log('DOMContentLoaded');

    currentUrl = window.location.href;

    // 🔷 token set
    accessToken = storage.getAccessTokenFromCookie();
    // 🔷 bookstoreMemberNo(sub) set
    ua.bookstoreMemberNo = storage.getSubFromAccessToken(accessToken);

    // 🔷 fileName, info set
    const fileName = utils.getFileName();
    setInfo(utils.getInfo());
    console.log(info);

    const fullFileName = utils.getFullFileName();

    // 🔷 고객여정 1.0 initSetting
    main.initSetting(fileName, info);
    // 🔷 교보문고 검색 키워드
    // ua.searchKeyword = document.querySelector('#srch_kywr_name').value;
    // 🔷 contentsId
    ua.contentsId = fileName; //document.querySelector('#csjr_ctts_num').value;

    // 🔷 보험 상품 view
    renderInsuaranceView(info, fileName);

    // 🔷 동의영역 view
    renderConsentView(fileName);

    // 🔷 동의여부 "check" - from localStorage
    storage.getConsentLocalStorage();


    // 🔴 reset flag
    // const home = document.getElementById('feedback-area');
    // home.addEventListener('dblclick', e => {
    //     post.postConsent(accessToken, ua.bookstoreMemberNo, 'TEST');
    // });

    /*
    let touchTimer;
    document.addEventListener('touchstart', function(e) {
        touchTimer = setTimeout(function() {
            post.postConsent(accessToken, ua.bookstoreMemberNo, '');
        }, 20000);
    });
    document.addEventListener('touchend', function(e) {
        clearTimeout(touchTimer);
    });
    document.addEventListener('touchcancel', function(e) {
        clearTimeout(touchTimer);
    });
    */

    // 🔷 컨텐츠 평가(좋아요/싫어요) 저장 값 set
    const radios = document.querySelectorAll('input[name="feedback-radio"][type="radio"]');
    const localCheckedValue = storage.getLocalStorage('feedback-value');

    ui.setCheckedValue(radios, localCheckedValue);

    radios.forEach(radio => {
        radio.addEventListener('change', e => {
            // console.log('change');
            post.postReview(e.target.value, ua.contentsId, ua.searchKeyword, ua.userKey);
            storage.setLocalStorage('feedback-value', e.target.value, 14); //2주만 보관
        });
    });


    // 🔷 약관 동의 영역 check
    // const consentCheckbox = document.querySelectorAll('.agree-box input[type="checkbox"]');
    const consentCheckbox = document.querySelectorAll('.agree-area input[type="checkbox"]');

    consentCheckbox.forEach(checkbox => {
        checkbox.addEventListener('change', ui.handleConsentCheckboxChange);
        // checkbox.addEventListener('change', setConsentLocalStorage);
    });



    // 🔷 'linkForInsurance' add click event
    const linkForInsurance = document.getElementById('linkForInsurance');
    if (linkForInsurance) {
        linkForInsurance.addEventListener('click', e => {
            e.preventDefault();

            ui.showLoadingScreen();
            window.setTimeout(()=>
                post.postBannerClickInfo(info.linkInfoForInsurance, ui.closeLoadingScreen(info.linkInfoForInsurance)), 2000); //로딩스크린 2초후 실행
        });
    }



    // 🔷 'confirm' add click event
    const confirmClick = document.getElementById('confirm');
    if (confirmClick) {
        // [제휴]인 경우 임시 pass

        confirmClick.addEventListener('click', e => {

            // ua.changeFlag('eventFlag', 'N');
            // ua.changeFlag('remainingPointsFlag', 'Y');

            const tempFlags = ui.getFlags();

            // 🔷 poplogin, popPoint(1번), popPointEnd01(2번), popPointEnd02(3번)
            console.log('🔺before confirm 🔺eventFlag: ' + ua.flag.eventFlag + ", remainingPointsFlag: " + ua.flag.remainingPointsFlag + ", isLogined: " + ua.isLogined);


            // 🔷 0. 제3자동의만 N일때 (eventFlag 상관 없음)
            // if (Object.values(tempFlags).every(val => val === 'N')) {
            if (tempFlags.chkAgr1 === 'N') {
                // 🌈🌈 보험상품으로 이동
                main.triggerLoadingScreen(info.linkInfoForInsurance);
                return;
            }

            // 🔷 default. 이벤트 기간 N or (이벤트기간 Y && 잔여 포인트 N)
            if (ua.flag.eventFlag === 'N' || (ua.flag.eventFlag === 'Y' && ua.flag.remainingPointsFlag === 'N')) {

                if (ua.isLogined) {
                    // 🌈🌈 보험상품으로 이동
                    post.postConsent(accessToken, ua.bookstoreMemberNo, tempFlags);
                    main.triggerLoadingScreen(info.linkInfoForInsurance);
                } else if (!ua.isLogined) {
                    ui.handleConfirmButtonClick(e, 'poplogin');
                }

                return;
            }

            let tempFlagAfterConfirm;

            /* 팝업 케이스 재작성 ******************************************************************************************************* */
            // 🔷 'confirm' 클릭 시 이벤트 기간 N -> Y 예외 케이스 아래 작성
            getAgreement(accessToken).then(newFlag => {
                // getIsEvent().then(newFlag => {
                console.log('confirm -> newFlag: ', newFlag);
                // for (let flagName in newFlag) {
                //     ua.changeFlag(flagName, newFlag[flagName]);
                // }
                // ua.changeFlag('eventFlag', 'N');
                // ua.changeFlag('remainingPointsFlag', 'N');

                tempFlagAfterConfirm = {
                    eventFlag: newFlag ? newFlag.eventFlag : ua.flag.eventFlag,
                    remainingPointsFlag: newFlag ? newFlag.remainingPointsFlag : ua.flag.remainingPointsFlag
                };

                // 🔴 set test data
                // tempFlagAfterConfirm = {
                //     eventFlag: 'Y',
                //     remainingPointsFlag: 'Y'
                // };


                return getIsLogin(accessToken);
            }).then(newIsLogin => {
                ua.changeLoginStatus(newIsLogin);

                console.log('🔺after confirm 🔺eventFlag: ' + tempFlagAfterConfirm.eventFlag + ", remainingPointsFlag: " + tempFlagAfterConfirm.remainingPointsFlag + ", isLogined: " + ua.isLogined);

                // 🔷 1. 이벤트 기간 N
                if (tempFlagAfterConfirm.eventFlag === 'N') {
                    // 1-2. 로그인 여부
                    if (ua.isLogined) {
                        // 2번 팝업
                        ui.handleConfirmButtonClick(e, 'popPointEnd01');
                        return;
                    } else {
                        // 3번 팝업
                        ui.handleConfirmButtonClick(e, 'popPointEnd02');
                        return;
                    }
                }

                // 🔷 2. EVENT. 제3자제공동의 Y && 마케팅동의 Y
                if (tempFlags.chkAgr1 === 'Y' && tempFlags.chkAgr2 === 'Y') {
                    // 🔷 3. 이벤트기간 Y
                    if (tempFlagAfterConfirm.eventFlag === 'Y') {
                        // 3-1. 이벤트 기간 Y + 잔여 포인트 Y + 로그인 하지 않은 경우
                        // if (ua.flag.remainingPointsFlag === 'Y' && !ua.isLogined) {
                        //     ui.handleConfirmButtonClick(e, 'popPoint');
                        // }
                        // 3-2. 이벤트 기간 Y + 잔여 포인트 N + 로그인 한 경우
                        if (tempFlagAfterConfirm.remainingPointsFlag === 'N' && ua.isLogined) {
                            // 2번 팝업
                            ui.handleConfirmButtonClick(e, 'popPointEnd01');
                        }
                        // 3-3. 이벤트 기간 Y + 잔여 포인트 N + 로그인 하지 않은 경우
                        if (tempFlagAfterConfirm.remainingPointsFlag === 'N' && !ua.isLogined) {
                            // 3번 팝업
                            ui.handleConfirmButtonClick(e, 'popPointEnd02');
                        }
                        // 3-4. 이벤트 기간 Y + 잔여 포인트 Y
                        if (tempFlagAfterConfirm.remainingPointsFlag === 'Y') {
                            if (ua.isLogined) {
                                // 3-4-1. 로그인 한 경우
                                // user의 event 참여 시점의 new AcceessToken (from cookie)
                                const tempAccessToken = storage.getAccessTokenFromCookie();
                                ua.bookstoreMemberNo = storage.getSubFromAccessToken(tempAccessToken);
                                // event 호출(response 필요 X)
                                postEvent(tempAccessToken, ua.bookstoreMemberNo, ua.isSmsEvent, ua.smsEventType);

                                // 🌈🌈 보험상품으로 이동
                                console.log('교환권 회원 발급 api 호출 & 포인트 즉시 지급 >> 상품 이동');
                                post.postConsent(accessToken, ua.bookstoreMemberNo, tempFlags);
                                main.triggerLoadingScreen(info.linkInfoForInsurance);
                            } else if (!ua.isLogined) {
                                // 3-4-2. 로그인 하지 않은 경우
                                // 1번 팝업
                                ui.handleConfirmButtonClick(e, 'popPoint');
                            }
                        }
                    }
                } else if (tempFlags.chkAgr1 === 'Y') {
                    // 🔷 4. EVENT . 제3자 제공 동의 Y*
                    if (ua.isLogined) {
                        // 🌈🌈 보험상품으로 이동
                        post.postConsent(accessToken, ua.bookstoreMemberNo, tempFlags);
                        main.triggerLoadingScreen(info.linkInfoForInsurance);
                    } else if (!ua.isLogined) {
                        if (tempFlagAfterConfirm.eventFlag === 'N') {
                            // 0번 팝업
                            ui.handleConfirmButtonClick(e, 'poplogin');
                        } else if (tempFlagAfterConfirm.eventFlag === 'Y' && tempFlagAfterConfirm.remainingPointsFlag === 'N') {
                            // 3번 팝업
                            ui.handleConfirmButtonClick(e, 'popPointEnd02');
                        } else if (tempFlagAfterConfirm.eventFlag === 'Y') {
                            // 1번 팝업
                            ui.handleConfirmButtonClick(e, 'popPoint');
                        }
                    }
                    // 🔷 5. EVENT . 제3자제공동의 N && 마케팅동의 Y
                } //else if (tempFlags.chkAgr1 === 'N' && tempFlags.chkAgr2 === 'Y') {

                //}
            });
            /* 팝업 케이스 재작성 ******************************************************************************************************* */
        });
    }


    // 🔷 "확인하기" -> 다음에 하기 / 확인하기 / 로그인하기
    // 1. poplogin (팝업번호 0번: 이벤트 진행X시 팝업)
    // 1-1. 확인하기 -> 로그인 하기
    const consentClick = document.getElementById('btnLogin');
    if (consentClick) {
        consentClick.addEventListener('click', e => {
            const tempFlags = ui.getFlags();
            storage.setConsentLocalStorage();
            post.postConsent(accessToken, ua.bookstoreMemberNo, tempFlags);
        });
    }
    // 1-2. 확인하기 -> 다음에 하기
    const consentNextClick = document.getElementById('btnNext');
    if (consentNextClick) {
        consentNextClick.addEventListener('click', e => {
            const tempFlags = ui.getFlags();
            e.preventDefault();
            main.triggerLoadingScreen(info.linkInfoForInsurance);
        });
    }

    // 2. popPoint (팝업번호 1번)
    // 2-1. 다음에 하기
    const btnNextPonint = document.getElementById('btnNextPonint');
    if (btnNextPonint) {
        btnNextPonint.addEventListener('click', e => {
            const tempFlags = ui.getFlags();
            ui.handlePointNextButtonClick(e, 'popPoint');
            // e.preventDefault();
            // main.triggerLoadingScreen(info.linkInfoForInsurance);
        });
    }
    // 2-1. 로그인 하기
    const btnLoginPoint = document.getElementById('btnLoginPoint');
    if (btnLoginPoint) {
        btnLoginPoint.addEventListener('click', e => {
            const tempFlags = ui.getFlags();
            storage.setConsentLocalStorage();
            post.postConsent(accessToken, ua.bookstoreMemberNo, tempFlags);
        });
    }

    // 3. popPointEnd01 (팝업번호 2번)
    // 3-1. 다음에 하기
    const btnNextPonintEnd01 = document.getElementById('btnNextPonintEnd01');
    if (btnNextPonintEnd01) {
        btnNextPonintEnd01.addEventListener('click', e => {
            const tempFlags = ui.getFlags();
            ui.handlePointNextButtonClick(e, 'popPointEnd01');
            // e.preventDefault();
            // main.triggerLoadingScreen(info.linkInfoForInsurance);
        });
    }
    // 3-2. 확인하기
    const btnLoginPointEnd01 = document.getElementById('btnLoginPointEnd01');
    if (btnLoginPointEnd01) {
        btnLoginPointEnd01.addEventListener('click', e => {
            const tempFlags = ui.getFlags();
            e.preventDefault();
            main.triggerLoadingScreen(info.linkInfoForInsurance);
        });
    }

    // 3. popPointEnd02 (팝업번호 3번)
    // 3-1. 다음에 하기
    const btnNextPointEnd02 = document.getElementById('btnNextPointEnd02');
    if (btnNextPointEnd02) {
        btnNextPointEnd02.addEventListener('click', e => {
            const tempFlags = ui.getFlags();
            ui.handlePointNextButtonClick(e, 'popPointEnd02');
            // e.preventDefault();
            // main.triggerLoadingScreen(info.linkInfoForInsurance);
        });
    }
    // 3-1. 로그인하기
    const btnLoginPointEnd02 = document.getElementById('btnLoginPointEnd02');
    if (btnLoginPointEnd02) {
        btnLoginPointEnd02.addEventListener('click', e => {
            const tempFlags = ui.getFlags();
            storage.setConsentLocalStorage();
            post.postConsent(accessToken, ua.bookstoreMemberNo, tempFlags);
        });
    }


    // 🔷popup 내 '동의안함', '동의' 버튼 add click event
    document.querySelectorAll('.btnConsent').forEach(btn => {
        btn.addEventListener('click', ui.handleAgreeButtonClick);
    });


    // 🔷[제휴 배너 클릭]
    // 제휴 info setting
    setAffInfo(utils.getAffInfo());
    console.log(affInfo);

    // 헤이마마
    const linkForHeymamaClick = document.getElementById('linkForHeymama');
    if (linkForHeymamaClick) {
        linkForHeymamaClick.addEventListener('click', e => {
            post.postAffBannerClickInfo(affInfo.linkInfoForAff, '');
        });
    }

    // 도낫츠
    const linkForDonotsClick = document.getElementById('linkForDonots');
    if (linkForDonotsClick) {
        linkForDonotsClick.addEventListener('click', e => {
            post.postAffBannerClickInfo(affInfo.linkInfoForAff, '');
        });
    }


    // 🔷userAgent set
    // utils.checkUserAgent();


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


    // 🔷
    // initialize(currentUrl, accessToken);

});



document.addEventListener('DOMContentLoaded', async () => {
    // 🔷🔷🔷 'DOMContentLoaded' 비동기 api 셋팅
    // 🔷 1. isLogin -> agreement


    let agreeBox = document.getElementById("agreeBox");
    let allAgreeBox = document.getElementById("allAgreeBox");
    let perSonalAgreeBox = document.getElementById("personalAgreeBox");
    let marketAgreeBox = document.getElementById("marketAgreeBox");

    try {
        const isEvent = await getIsEvent();
        ua.changeFlag('eventFlag', isEvent.eventFlag);
        ua.changeFlag('remainingPointsFlag', isEvent.remainingPointsFlag);

        // 🔴 set test data
        // ua.changeFlag('eventFlag', 'Y');
        // ua.changeFlag('remainingPointsFlag', 'Y');

        const isLogin = await getIsLogin(accessToken);
        ua.changeLoginStatus(isLogin);

        if (ua.isLogined) {
            const agreementData = await getAgreement(accessToken);
            for (let flagName in agreementData) {
                ua.changeFlag(flagName, agreementData[flagName]);
            }
            // 🔷 set ConsentView (기존 동의 이력에 따른 display)
            ui.setConsentView();
        }


        /* 🔴set TEST data */
        // ua.changeFlag('eventFlag', 'Y');
        // ua.changeFlag('remainingPointsFlag', 'Y');
        // ua.changeFlag('personalInformationAgreementFlag', 'N');
        // ua.changeFlag('marketingConsentAgreementFlag', 'N');
        // ua.changeFlag('marketingConsentAgreementSmsFlag', 'N');
        // ua.changeFlag('marketingConsentAgreementEmailFlag', 'N');

        // 잔여포인트 N일때 기본화면 표시
        // 동의 N 일때 확인하기버튼 -> 상품 상세페이지 (loading)
        // 잔여포인트Api 한번 더체크하고 -> Y:로그인체크 N:로그인체크 -> 교환권 회원 발급 API 호출 -> N: 3번 팝업 Y: 상품 페이지 (포인트 즉시 지급에 대한 response는 필요X)




    } catch(err) {
        console.error(err);
    } finally {

        // 🔷 set Footer View & LOGIN page redirect
        ui.setFooterView();
        // 🔷 set Event View
        ui.setEventView();
    }


});
