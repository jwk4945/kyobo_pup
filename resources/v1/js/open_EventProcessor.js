import { AnimationManager } from "./open_AnimationManager.js";
import { config } from "./config.js";
import data from "./data.js";

/**
 * 모듈 변수
 * 
 */
let info = null; 
let ua = null;

export const EventProcessor = (function (){
    let _isAutoBottomStyle=false;
    let _isLinkToInsurance=true; // 확대오픈 시 보험 상품만 노출(service 제외)
    let didCallback=false;
    let _didTogglePageContents=false;

    let insuranceUrl;
    let insuranceImg;
    let insuranceName;
    let insuranceExplain;
    let insuranceCertificationMsg;
    let insurancePeriod;
    
    let _searchKeyword;
    let _contentsId;
    let _userKey;
    let _bannerHistorySeq;

    let _isUserInLastPage = true;
    let _surveyRadiosSelector = 'input[type="radio"][name="kyobolife-survey"]';
    let _nextButtonSelector = 'button#goNextBtn';


    function initSettingForBfCache() {
        window.addEventListener('pageshow', function(event) {
            if (event.persisted) {
                location.reload();
            }
        });
    }

    function initSetting(fileName, params){
        //교보문고 검색어
        _searchKeyword = document.querySelector('#srch_kywr_name').value;
        //콘텐츠 아이디
        _contentsId = document.querySelector('#csjr_ctts_num').value;

        // if(_contentsId==null || _contentsId==='')
        //     _contentsId = params.contentsId;
        // _contentsId.replace('.html','');
        if (_contentsId === null || _contentsId === '') {
            _contentsId = fileName;
        }

        _userKey = createUserKey(); //user key 생성
        setPropertiesForCss(); //css 전역변수 설정
        initSettingForReviewRadio(fileName); //피드백라디오(좋아요/싫어요) 기본이벤트처리
        setAutoHideElements(); //gnb(헤더) 자동 숨기기 설정
        getMethodForShowResult(params).call(this,params); //결과화면 처리함수 선택호출
        initSettingForBfCache(); // 브라우저 뒤로가기 캐쉬 초기화

        //bottom-sheet 추천상품정보 설정
        const linkInfoForInsurance = params.linkInfoForInsurance;
        insuranceUrl = linkInfoForInsurance.url;
        insuranceImg = linkInfoForInsurance.imgUrl;
        insuranceName = linkInfoForInsurance.name;
        insuranceExplain = linkInfoForInsurance.explain;
        insuranceCertificationMsg = linkInfoForInsurance.certificationMsg;
        insurancePeriod = linkInfoForInsurance.period;

        // 2023.04.26 확대오픈 시 서비스 제외 
        // const linkInfoForService = params.linkInfoForService;
        // serviceUrl = linkInfoForService.url;
        // serviceImg = linkInfoForService.imgUrl;
        // serviceName = linkInfoForService.name;
        // serviceExplain = linkInfoForService.explain;

        // //Bottom-sheet 생성
        // createBottomSheet();
        // // bottom-sheet 등장 자동/수동 설정
        // if(isAutoBottomStyle())
        //     setAutoBottomSheetEvent();
        // else
        //     setBottomSheetEvent();
    }

    function getMethodForShowResult({nextButtonSelector=_nextButtonSelector, surveyRadioSelector=_surveyRadiosSelector}){
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
        EventProcessor.setUserInLastPage(false);
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

    function initSettingForBalanceGame(){
        //첫 로딩 시점에는 결과페이지 아님
        setUserInLastPage(false);

        [...document.querySelectorAll('.balance-game input[name="kyobolife-survey"]')].forEach(input => {
            input.addEventListener('change', e => {
                setUserInLastPage(true);
                togglePageContents(true); // 뒤로가기가 없으므로 페이지 전환은 한번만(once)
                AnimationManager.setElemsAniOnScroll();
                document.documentElement.classList.remove('overflow-y-hidden');
                AnimationManager.setElemsAniOnResult();
                // 밸런스게임 라디오버튼 영역 높이 최소화(축소)
                document.querySelector('#survey-area').classList.add('shrink-height');
            });
        });
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

        EventProcessor.setUserInLastPage(false);

        swiper.on('slideChange',swiper=>{

            if((swiper.realIndex === swiper.slides.length-1) //마지막 슬라이드 도착했거나
              ||(swiper.realIndex === swiper.slides.length-2 && swiper.previousIndex === swiper.slides.length-1)) //마지막슬라이드에서 직전슬라이드로 돌아온 경우
            {
                togglePageContents();
                EventProcessor.setUserInLastPage(true);
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

    function initSettingForSubmitSurvey(bPost=true){
        if(bPost===false ||
            document.querySelector('.survey-form input[type="radio"][name="kyobolife-survey"]')===null)
            return;
        const submitBtn = document.querySelector('button#goNextBtn');
        if(submitBtn===null)
            return;

        submitBtn.addEventListener('click', e=>postSurveyInput());
    }

    // nav >> header
    // function setAutoHideElements(hideTargets){
    //     hideTargets = hideTargets || [
    //         document.querySelector('nav'),
    //         document.querySelector('#goFirstBtn')
    //     ];
    //     let isShowing = true;
    //     let prevScrollY = 0;
    //     let firstScrollY;
    //     let prevScrolledDown = false;
    //     // const scrollYValue = 100;
    //     const scrollYValue = 50;
    //     const gnb = document.querySelector('nav');
    //     if(gnb===null)
    //         return;

    //     window.addEventListener('scroll',e=>{
    //         let isScrollingDown = window.scrollY>prevScrollY;
    //         //화면 스크롤이 가장 위인 경우, 위로 스크롤하면 바로 등장
    //         if(!isScrollingDown && window.scrollY===0) {
    //             for(let target of hideTargets) {
    //                 if(target!==null && target.classList.contains('hide'))
    //                     target.elem.classList.remove('hide');
    //             }
    //         }
    //         else if(isShowing && isScrollingDown || !isShowing && !isScrollingDown){
    //             let hasChangedDirection = isScrollingDown^prevScrolledDown;
    //             prevScrolledDown = isScrollingDown;
    //             if(hasChangedDirection){
    //                 firstScrollY = window.scrollY;
    //                 return;
    //             }
    //             if(Math.abs(window.scrollY-firstScrollY)>scrollYValue){
    //                 isShowing = !isShowing;
    //                 for(let target of hideTargets) {
    //                     if(target!==null) {
    //                         if (isShowing)
    //                             target.classList.remove('hide');
    //                         else
    //                             target.classList.add('hide');
    //                     }
    //                 }
    //             }
    //         }
    //         prevScrollY = window.scrollY;
    //     });
    // }

    function setAutoHideElements(hideTargets){
        hideTargets = hideTargets || [
            document.querySelector('header'),
            document.querySelector('#goFirstBtn')
        ];
        let isShowing = true;
        let prevScrollY = 0;
        let firstScrollY;
        let prevScrolledDown = false;
        // const scrollYValue = 100;
        const scrollYValue = 30;
        const gnb = document.querySelector('header');
        if(gnb===null)
            return;

        window.addEventListener('scroll',e=>{
            let isScrollingDown = window.scrollY>prevScrollY;
            //화면 스크롤이 가장 위인 경우, 위로 스크롤하면 바로 등장
            if(!isScrollingDown && window.scrollY===0) {
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
                if(Math.abs(window.scrollY-firstScrollY)>scrollYValue){
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
    // nav >> header

    function createUserKey(){
        let userKey = getLocalStorage('user-key', true);
        if(userKey===null && _contentsId!==undefined) {
            const now = new Date();
            // userKey = currDate.toLocaleDateString("ko-KR").replace(/[\s\.]/g,'');
            // userKey += currDate.toLocaleTimeString("en-GB").replace(/[\:]/g,'');
            // userKey += '-';
            // userKey += Date.now().toString(36);

            const yyyy = now.getFullYear();
            const MM = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
            const dd = String(now.getDate()).padStart(2, '0');
            const HH = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');

            userKey = `${yyyy}${MM}${dd}${HH}${mm}${ss}` + '-' + Date.now().toString(36);;
            
        }
        if(userKey!==null){
            setLocalStorage('user-key',userKey, 14, true);
        }
        return userKey;
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


        // if(goFirstBtn!==null){
        //     goFirstBtn.addEventListener('click',e=>{
        //         const gnb = document.querySelector('nav');
        //         if(gnb!==null)
        //             gnb.classList.remove('hide');
        //         togglePageContents();

        //         if(callbackForPrev!==null)
        //             callbackForPrev();
        //         // document.documentElement.classList.add('overflow-y-hidden');
        //         setUserInLastPage(false);
        //     });
        // }

        // nav >> header
        if(goFirstBtn!==null){
            goFirstBtn.addEventListener('click',e=>{
                const gnb = document.querySelector('header');
                if(gnb!==null)
                    gnb.classList.remove('hide');
                togglePageContents();

                if(callbackForPrev!==null)
                    callbackForPrev();
                // document.documentElement.classList.add('overflow-y-hidden');
                setUserInLastPage(false);
            });
        }
        // // nav >> header
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

    function togglePageContents(bOnce=false){
        if( (bOnce===true && _didTogglePageContents===false) || bOnce===false) {
            [...document.querySelectorAll('[data-is-not-result-page=true]')].forEach(elem => elem.dataset.isNotResultPage = 'processing');
            [...document.querySelectorAll('[data-is-not-result-page=false]')].forEach(elem => elem.dataset.isNotResultPage = 'true');
            [...document.querySelectorAll('[data-is-not-result-page=processing]')].forEach(elem => elem.dataset.isNotResultPage = 'false');
            _didTogglePageContents = true;
        }

        showSelectiveResult();
    }

    function postSurveyInput(surveyResultTargets){
        surveyResultTargets = surveyResultTargets || {
            //설문비율 텍스트 elements
            arrSurveyResultTexts: document.querySelectorAll('.li-item-result .result-ratio'),
            //설문비율 그래프(가로바) elements
            arrSurveyResultBars: document.querySelectorAll('.li-item-result .painted-bar')
        }
        const list = [...document.querySelectorAll('.survey-form li')];
        const checkedIndex = list.findIndex(
            li=>li.querySelector('input[name="kyobolife-survey"]:checked')!==null
        );
        let checkedContents = list[checkedIndex].querySelector('.contents').textContent;
        if(checkedContents!==null)
            checkedContents = checkedContents.replace(/\s\s/g,'').trim();
        const url = `/journey/form/contents-survey`;
        const sendData = {
            srch_kywr_name: _searchKeyword // 교보문고 검색키워드,
            , csjr_ctts_num: _contentsId // 콘텐츠아이디
            , csjr_srvy_ansr_srmb: checkedIndex // 응답 라디오 순번
            , csjr_srvy_ansr_cntt: checkedContents // 응답 보기설문내용
        };
        postData(url, sendData, result=>{
            console.log(result);
            result.forEach(row=>{
                const idx = row.csjr_srvy_ansr_srmb;
                surveyResultTargets.arrSurveyResultTexts[idx].textContent = row.csjr_ctts_srvy_rate;
                surveyResultTargets.arrSurveyResultBars[idx].style.width = `${row.csjr_ctts_srvy_rate}%`;
            })
        })
    }

    function postBannerExposeInfo() {
        const url = `/journey/form/banner-expose`;
        const sendData = {
            srch_kywr_name: _searchKeyword // 교보문고 검색키워드
            , csjr_ctts_num: _contentsId // 콘텐츠아이디
            , bnnr_expr_mthd_dvsn_code: '003' // _isAutoBottomStyle ? '001':'002' // 자동 : 수동
            , bnnr_expr_cmdt_kind_code: '003' //_isLinkToInsurance ? '001':'002' // 보험 : 부가서비스
            , bnnr_expr_cmdt_name: getLinkInfos().linkName
            , bnnr_urladrs: getLinkInfos().linkUrl
        };
        postData(url, sendData, result=>{
            console.log(result);
            _bannerHistorySeq = result.csjr_ctts_advr_expr_srmb;
        })
    }

    function postBannerClickInfo(href, callback) {
        const url = `/journey/form/banner-visit`;
        const sendData = {
            csjr_ctts_advr_expr_srmb: _bannerHistorySeq // 배너이력순번
            , srch_kywr_name: _searchKeyword // 교보문고 검색키드,
            , csjr_ctts_num: _contentsId // 콘텐츠아이디
            , bnnr_expr_mthd_dvsn_code: '003' // _isAutoBottomStyle ? '001':'002' // 자동 : 수동        
            , bnnr_expr_cmdt_kind_code: '003' // _isLinkToInsurance ? '001':'002' // 보험 : 부가서비스
            , bnnr_expr_cmdt_name: getLinkInfos().linkName
            , bnnr_urladrs: getLinkInfos().linkUrl
        };
        postData(url, sendData, result=>{
            console.log(result);
            window.location.href=href;
            if(callback!==undefined)
                callback();
        })
    }

    function setAutoBottomSheetEvent(){
        const triggerElement = document.querySelector('#feedback-area');
        if(triggerElement===null)
            return;
        let prevScrollY=0;

        const handler = e =>{
            const hasScrolledDown = window.scrollY>prevScrollY;
            prevScrollY = window.scrollY;
            if(hasScrolledDown){
                const triggerRect = triggerElement.getBoundingClientRect();
                const screenHeight = document.documentElement.clientHeight;
                if(_isUserInLastPage && screenHeight*0.5 > triggerRect.top){
                    scrollToEndOfFeedbackArea(screenHeight, triggerRect);    // 화면을 피드백영역 하단으로 자동 스크롤
                    showBottomSheet(postBannerExposeInfo); // 바텀시트 등장
                    //한번만 동작하도록 이벤트 해제
                    window.removeEventListener('scroll',handler);
                }
            }
        }
        window.addEventListener('scroll',handler);
    }
    function scrollToEndOfFeedbackArea(screenHeight, triggerRect){
        const displayingHeight = screenHeight - triggerRect.top;
        const scrollValue = triggerRect.height - displayingHeight;
        document.body.style.transition=`margin 0.4s`;
        document.body.style.marginTop=`-${scrollValue}px`;
    }

    function getLinkInfos(){
        let linkUrl, linkImg, linkName, linkExplain, certificationMsg;
        
        linkUrl = insuranceUrl;
        linkImg = insuranceImg;
        linkName = insuranceName;
        linkExplain = insuranceExplain;
        certificationMsg = insuranceCertificationMsg;
        period = insurancePeriod; 
        
        return {linkUrl, linkImg, linkName, linkExplain, certificationMsg, period};
    }

    function handleScrollLock(bLock) {
        console.log('scroll Lock::: ' + bLock)
        console.log('scroll Lock::: ' + bLock)
        console.log('scroll Lock::: ' + bLock)
        console.log('scroll Lock::: ' + bLock)
        console.log('scroll Lock::: ' + bLock)
        if(bLock) {
            document.documentElement.classList.add('overflow-y-hidden');
            document.body.classList.add('overflow-y-hidden');
        }else{
            document.documentElement.classList.remove('overflow-y-hidden');
            document.body.classList.remove('overflow-y-hidden');
        }
        // document.querySelector('.main-wrapper').classList.toggle('overflow-y-hidden');
    }

    function createDimmedScreen(){
        const dimmed = document.createElement('div');
        dimmed.setAttribute('class', 'dimmed');
        document.body.appendChild(dimmed);
    }

    function showLoadingScreen(){
        const loadingScreen = document.querySelector('.loading-screen');
        if(loadingScreen===null)
            return;
        loadingScreen.dataset.isPlayingLoading='true';
    }

    function closeLoadingScreen(){
        const loadingScreen = document.querySelector('.loading-screen');
        if(loadingScreen===null)
            return;
        loadingScreen.dataset.isPlayingLoading='false';
    }


    function showBottomSheet(callBackFunc) {
        const bottomSheet = document.querySelector(".bottom-sheet-wrapper");
        if(bottomSheet===null || !bottomSheet.classList.contains('hide'))
            return;

        //dimmed screen 생성
        createDimmedScreen();
        //scroll Lock
        handleScrollLock(true);
        //bottom-sheet 숨기기 해제
        window.setTimeout(()=>bottomSheet.classList.toggle('hide')
            ,100);

        //callback function
        //tracking은 한번만 수행
        if(!didCallback) {
            callBackFunc();
            didCallback=true;
        }
    }
    function closeBottomSheet(){
        if(document.querySelector(".bottom-sheet-wrapper")===null)
            return;

        // 자동스크롤(TranslateY)된 Body(배경) 요소 복구
        // transformedElem.style.transform=`translate(${orgTranslateX}px, ${orgTranslateY}px)`;
        document.body.style.marginTop='';

        const bottomSheet = document.querySelector(".bottom-sheet-wrapper");
        bottomSheet.addEventListener('transitionend',()=> {
            const dimmed = document.querySelector('.dimmed');
            if(bottomSheet.classList.contains('hide') && dimmed!==null)
                dimmed.remove();
        });
        bottomSheet.classList.toggle('hide');
    }

    // function isLinkToInsurance() {
    //     if(_isLinkToInsurance===undefined)
    //         _isLinkToInsurance = Math.floor(Math.random()*10)<5;
    //     return _isLinkToInsurance;
    // }

    function isAutoBottomStyle() {
        _isAutoBottomStyle = Math.floor(Math.random()*10)<5;
        return _isAutoBottomStyle;
    }

    function setBottomSheetEvent() {
        if(document.querySelector('input#feedback-radio-01')===null)
            return;
        document.querySelector('input#feedback-radio-01').addEventListener(
            'change', ()=>showBottomSheet(postBannerExposeInfo)
        );
    }

    function getSurveyResult(contentsId){
        let result;
        console.log('get survey result==================');
        console.log('contentsId : ', contentsId);
        result = {};
        result.counts = [55, 45, 15];
        console.log('contentsId : ', contentsId);

        return result.counts;
    }

    function getResultOfSurvey(contentsId, callback){
        // const url = `http://localhost:8080/v1/contents/7D_003.html?contentsId?=${contentsId}`;
        const url = `/journey/form/contents-survey?ctts_num=${contentsId}`;
        const testData = {arr:[55,45]}
        fetch(url)
            .then(res=>res.json())
            .then(json=>callback(json))
            .catch(()=>callback(testData))
    }

    function postData(url,data, callback){
        let options = {
            method: 'POST', // *GET, POST, PUT, DELETE 등
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
        };

        // console.log(url);
        // console.log(data);

        // fetch(url, options)
        //     .then(res=>res.json())
        //     .then(result=>callback(result))
        //     .catch(error=>callback(error));

        fetch(url, options)
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status)
                }
                return res.json();
            })
            .then(data => callback(data))
            .catch(error => callback(error))
    }

    function postReview(value){
        const url = `/journey/form/contents-review`;
        const sendData = {
            srch_kywr_name: _searchKeyword
            , csjr_ctts_num: _contentsId
            , csjr_ctts_vltn_dvsn_code: value
            , terml_cnct_param_wrth: _userKey
        };
        postData(url, sendData, result=>{console.log(result)})
    }

    function removeLocalStorage(key, isGlobal=false){
        if(isGlobal){
            localStorage.removeItem(key);
        }else {
            let localData = localStorage.getItem(_contentsId);
            if (!isJsonString(localData) || localData===null)
                localData={};
            else {
                localData = JSON.parse(localData);
                delete localData[key];
            }
            localStorage.setItem(_contentsId, JSON.stringify(localData));
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

    function setLocalStorage(key, value, period, isGlobal=false) {
        const expiry = new Date(Date.now() + (period * 24 * 3600 * 1000))
            .toLocaleDateString().replace(/\s/g, '');
        const inputData = {
            value: value,
            expiry: expiry
        };
        let localData;
        if(isGlobal){
            localData = inputData;
        }else {
            localData = localStorage.getItem(_contentsId);
            localData = (localData === null ? {} : JSON.parse(localData));
            localData[key] = inputData;
        }
        localStorage.setItem(isGlobal? key:_contentsId, JSON.stringify(localData));
    }

    function getLocalStorage(key,isGlobal=false) {
        let localData = localStorage.getItem(isGlobal? key:_contentsId);
        if(localData===null || !isJsonString(localData)) {
            removeLocalStorage(key, isGlobal);
            return null;
        }
        localData = JSON.parse(localData);
        localData = isGlobal? localData : localData[key];
        const currDate = new Date().toLocaleDateString().replace(/\s/g,'');

        if(localData===undefined || new Date(currDate)>=new Date(localData.expiry)) {
            removeLocalStorage(key,isGlobal);
            return null;
        }
        return localData.value;
    }

    function setUserInLastPage(isTrue){
        _isUserInLastPage = isTrue;
    }

    function initSettingForReviewRadio(contentsId, radios){
        _contentsId = contentsId;
        radios = radios||document.querySelectorAll('input[name="feedback-radio"][type="radio"]');
        if(radios.length===0)
            return;

        const localCheckedValue = getLocalStorage('feedback-value');

        radios.forEach(radio=> {
            if(radio.value===localCheckedValue)
                radio.checked = true;
        });
    }
    function getUserKey(){
        return _userKey;
    }

    const setPropertiesForCss = function (){
        const _setPropertiesForCss = () => {
            document.documentElement.style.setProperty('--vscrollwidth', `${window.innerWidth - document.documentElement.clientWidth}px`);
            document.documentElement.style.setProperty('--1vw', `${Math.round(document.documentElement.clientWidth / 100 * 10) / 10}px`);
            document.documentElement.style.setProperty('--100vh-inner', `${document.documentElement.clientHeight}px`);
        }
        _setPropertiesForCss();
        window.addEventListener('resize',_setPropertiesForCss);
        window.addEventListener('resize',()=>AnimationManager.set100vh(document.documentElement.clientHeight));
    }
    return {setGoNextAndFirstBtn, isAutoBottomStyle, setAutoBottomSheetEvent
        , setBottomSheetEvent, setPropertiesForCss, getResultOfSurvey, togglePageContents
        , initSetting, setUserInLastPage, postReview, getLocalStorage, setLocalStorage}
})();

/** sns 공유하기  */
const shareKakao = (shareUrl) => {
    
    Kakao.init( config.kakao.apiKey.prod );

    const title = document.title; 
    const desc = document.querySelector("meta[property='og:description']").getAttribute("content");    
        
    Kakao.Share.sendDefault({
        // container: '#ka-share-btn',
        objectType: 'feed',
        content: {
          title: title, 
          description: desc, 
          imageUrl: 'https://contents.kyobobook.co.kr/resources/fo/images/common/ink/img_logo_kyobo@2x.png',
          link: {
            // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '모바일 교보문고',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });    
}

const shareFacebook = (shareUrl) => {
    window.open("https://www.facebook.com/sharer/sharer.php?u=" + shareUrl);
}

const shareSms = (shareUrl) => {
    location.href = (ua.device.isAndroid ? "sms:?body=" : "sms:&body=") + shareUrl;
}

/** render */
function setCheckedValue(radios, value) {
    console.log(radios)
    console.log(value)
    radios.forEach(radio => {
        if (radio.value === value) {
            radio.checked = true; 
        }
    })
}

function findByfileName(fileName) {    
    for (let obj of data) {
        if (obj.contentsId && obj.contentsId.includes(fileName)) {
            return obj; 
        }
    }
    return data[0]; 
}


function render(renderInfo) {
    // 보험 상품 info template literal
    console.log(renderInfo)

    // const data = { name: 'test name', explain: 'test explain' };
    const template = `
                        <section class="btm-area">
                            <p class="explain">${ renderInfo.explain }</p>
                            <a href=${ renderInfo.url }>
                                <div class="pd-area">
                                    <div class="clear">
                                        <div class="ci fl">
                                            <img src="../../../resources/v1/img/icon/img-ci-pd.png" alt="KYOBO 교보생명">
                                        </div>
                                        <dl class="fl">
                                            <dt class="name">${ renderInfo.name }</dt>
                                            <dd class="certificationMsg">
                                                <div class="certificationMsg-txt">${ renderInfo.certificationMsg }</div>
                                                <div class="certificationMsg-date">${ renderInfo.period }</div>
                                            </dd>
                                        </dl>
                                    </div>
                                    <div class="ico-arw"></div>
                                </div>
                            </a>
                        </section>                        
    `;

    document.querySelector('#output').innerHTML = template;

}


const checkUserAgent = () => {
    // userAgent 분기(문고는 백엔드에서 처리하고 있음. 임시로 프론트에서 처리하도록 작성함)
    ua = {
        device: {
            isMobile: true,
            isMobileApp: false,
            isIOS: true,
            isAndroid: false,
            isMSIE: false,
            isMac: false, 
        }
    };
}

function initialize(shareUrl) {
    console.log('initialize');

    // userAgent set
    checkUserAgent();

    const copyUrl = document.getElementById('url-copy-span');
    copyUrl.innerText = shareUrl; 
}

function handleShareButtonClick(event, url) {    
    if (event.target.innerHTML === '카카오톡') {
        shareKakao(url); 
    } else if (event.target.innerHTML === '페이스북') {
        shareFacebook(url);
    } else if (event.target.innerHTML === '메세지') {
        // event.preventDefault();
        shareSms(url); 
    } else if (event.target.innerHTML === 'URL 복사') {
        navigator.clipboard.writeText(url);
    }
}

// 1. EventProcessor.initSetting -> 기존 컨텐츠 init setting... 임시로 load 이벤트로 분리 
// 2. initialize -> 확대오픈/정식오픈 add 컨텐츠 init setting... DomContentLoaded에 정의. 
window.addEventListener('load', function() {
    console.log('window onLoad');
        
    const url = window.location.href; 
    const fileNameWithQuery = url.split('/').pop();
    const fileNameWithoutKeyword = fileNameWithQuery.split('?')[0];
    const fileNameWithoutPrefix = fileNameWithoutKeyword.replace('open_', '');

    // test url: http://127.0.0.1:5501/WEB-INF/views/journey/open_2D_091.html
    // 운영 url: https://life-marketing.kyobobook.co.kr/journey/2B_061?kywr=1LCB6roRfjT16
    const fileName = fileNameWithoutPrefix.replace('.html', '');

    // find By fileName
    info = findByfileName(fileName);
    render(info.linkInfoForInsurance);
    
    EventProcessor.initSetting(fileName, info);
});


document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded');    
    

    // 컨텐츠 평가(좋아요/싫어요) 저장 값 set
    const radios = document.querySelectorAll('input[name="feedback-radio"][type="radio"]');
    const localCheckedValue = EventProcessor.getLocalStorage('feedback-value');
    
    // setCheckedValue(radios, localCheckedValue);
    
    radios.forEach(radio => {
        radio.addEventListener('change', e => {
            console.log('change');
            // EventProcessor.postReview(e.target.value);
            EventProcessor.setLocalStorage('feedback-value', e.target.value, 14); //2주만 보관
        });
    });

    // document.getElementById('link-login').addEventListener("click", function(event) {
    //     event.preventDefault(); // 기본 이벤트 중단
    //     window.location.href = ""; 
    // });
      

    // 공유하기
    const currentUrl = window.location.href; 

    document.addEventListener('click', e => {
        e.stopPropagation(); 
        handleShareButtonClick(e, currentUrl); 
    });    

    
    initialize(currentUrl);

  });

  