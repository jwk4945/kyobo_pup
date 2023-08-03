import { AnimationManager } from "./open_AnimationManager.js";
import globalConfig from "./config.js";
import appData from "./ins_data.js";
import ua from "./ua.js";
import { renderInsuaranceView, renderConsentView } from "./render.js";

let info = null;

export const EventProcessor = (function (){
    let _isAutoBottomStyle=false;
    let _isLinkToInsurance;
    let didCallback=false;
    let _didTogglePageContents=false;

    let insuranceUrl;
    let insuranceImg;
    let insuranceName;
    let insuranceExplain;
    let insuranceCertificationMsg;
    let serviceUrl;
    let serviceImg;
    let serviceName;
    let serviceExplain;

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
        _contentsId = fileName; //document.querySelector('#csjr_ctts_num').value;

        if (_contentsId === null || _contentsId === '') {
            _contentsId = fileName;
        }

        _userKey = createUserKey(); //user key 생성
        setPropertiesForCss(); //css 전역변수 설정
        // initSettingForReviewRadio(params.contentsId); //피드백라디오(좋아요/싫어요) 기본이벤트처리
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

        // 2023.06.29 확대오픈 시 서비스 제거
        // const linkInfoForService = params.linkInfoForService;
        // serviceUrl = linkInfoForService.url;
        // serviceImg = linkInfoForService.imgUrl;
        // serviceName = linkInfoForService.name;
        // serviceExplain = linkInfoForService.explain;

        // 2023.06.29 확대오픈 시 Bottom Sheet 제거
        //Bottom-sheet 생성
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

    function setAutoHideElements(hideTargets){
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
    function createUserKey(){
        let userKey = getLocalStorage('user-key', true);
        if(userKey===null && _contentsId!==undefined) {
            const now = new Date();

            const yyyy = now.getFullYear();
            const MM = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
            const dd = String(now.getDate()).padStart(2, '0');
            const HH = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');

            userKey = `${yyyy}${MM}${dd}${HH}${mm}${ss}` + '-' + Date.now().toString(36);
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
        // const list = [...document.querySelectorAll('.survey-form li')];
        // const checkedIndex = list.findIndex(
        //     li=>li.querySelector('input[name="kyobolife-survey"]:checked')!==null
        // );
        // let checkedContents = list[checkedIndex].querySelector('.contents').textContent;
        // if(checkedContents!==null)
        //     checkedContents = checkedContents.replace(/\s\s/g,'').trim();

        // let checkedInput = document.querySelector('input[name="kyobolife-survey"]:checked');
        // let parent = checkedInput.parentElement;
        // let dlTextContent = parent.querySelector('dl').getAttribute('data-dl');

        let inputElement = document.getElementById('your-input-id');
        let checkedInput = document.querySelector('input[name="kyobolife-survey"]:checked')
        let dataSurvey = checkedInput.getAttribute('data-sv');

        const url = `/journey/form/contents-survey`;
        const sendData = {
            srch_kywr_name: _searchKeyword // 교보문고 검색키워드,
            , csjr_ctts_num: _contentsId // 콘텐츠아이디
            , csjr_srvy_ansr_srmb: checkedInput.value // 응답 라디오 순번
            , csjr_srvy_ansr_cntt: dataSurvey // 응답 보기설문내용
        };
        console.log(sendData);

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
            srch_kywr_name: _searchKeyword // 교보문고 검색키웓,
            , csjr_ctts_num: _contentsId // 콘텐츠아이디
            , bnnr_expr_mthd_dvsn_code: '003' // 자동 : 수동        -> 5/18 고정값 "003" 으로 변경
            , bnnr_expr_cmdt_kind_code: '003' // 보험 : 부가서비스    -> 5/18 고정값 "003" 으로 변경
            , bnnr_expr_cmdt_name: insuranceName  //getLinkInfos().linkName
            , bnnr_urladrs: insuranceUrl //getLinkInfos().linkUrl
        };
        postData(url, sendData, result=>{
            console.log(result);
            _bannerHistorySeq = result.csjr_ctts_advr_expr_srmb;
        })

        // // GA 레이어팝업노출
        // var gaVirtual = {};
        // gaVirtual.event_name = document.getElementById('event_name').value;
        // gaVirtual.ep_button_area = document.getElementById('ep_button_area').value;
        // gaVirtual.ep_button_area2 = document.getElementById('ep_button_area2').value;
        // gaVirtual.ep_button_name = '레이어팝업노출';
        // gaVirtual.ep_click_variable = _isAutoBottomStyle ? '노출방식_자동노출' : '노출방식_수동노출';
        //
        // ga360.GA_Virtual(gaVirtual);
    }

    function postBannerClickInfo(href, callback) {
        const url = `/journey/form/banner-visit`;
        const sendData = {
            csjr_ctts_advr_expr_srmb: 1 //_bannerHistorySeq // 배너이력순번
            , srch_kywr_name: _searchKeyword // 교보문고 검색키워드
            , csjr_ctts_num: _contentsId // 콘텐츠아이디
            , bnnr_expr_mthd_dvsn_code: '003' // 자동 : 수동          -> 5/18 고정값 "003" 으로 변경
            , bnnr_expr_cmdt_kind_code: '003' // 보험 : 부가서비스      -> 5/18 고정값 "003" 으로 변경
            , bnnr_expr_cmdt_name: getLinkInfos().linkName
            , bnnr_urladrs: getLinkInfos().linkUrl
        };
        postData(url, sendData, result=>{
            console.log('postBannerClickInfo::', result);
            window.location.href=href;
            if(callback!==undefined)
                callback();
        })

        // GA 더알아보기
        // const event_name = document.getElementById('event_name').value;
        // const ep_button_area = document.getElementById('ep_button_area').value;
        // const ep_button_area2 = document.getElementById('ep_button_area2').value;
        // const ep_click_variable = '상품_' + sendData.bnnr_expr_cmdt_name;
        //
        // ga360.GA_Event(event_name, ep_button_area, ep_button_area2, '더알아보기',ep_click_variable);
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
        if(isLinkToInsurance()) {
            linkUrl = insuranceUrl;
            linkImg = insuranceImg;
            linkName = insuranceName;
            linkExplain = insuranceExplain;
            certificationMsg = insuranceCertificationMsg;
        }
        else {
            linkUrl = serviceUrl;
            linkImg = serviceImg;
            linkName = serviceName;
            linkExplain = serviceExplain;
        }
        return {linkUrl, linkImg, linkName, linkExplain, certificationMsg};
    }

    function handleScrollLock(bLock) {
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

    function createBottomSheet() {
        const linkInfos = getLinkInfos(); //링크정보 불러오기
        const effectImgUrl = '../../../resources/v1/img/img-product-effect.gif';

        const bottomSheetWrapper = document.createElement('div');
        bottomSheetWrapper.setAttribute('class','bottom-sheet-wrapper hide');

        const closeBtnArea = document.createElement('div');
        closeBtnArea.setAttribute('class','bottom-sheet-close-btn-area');

        const closeBtn = document.createElement('a');
        closeBtn.setAttribute('class','close-btn')

        const closeBtnMsg = document.createElement('span');
        closeBtnMsg.style.display='none';
        closeBtnMsg.textContent = '닫기';

        const closeBtnImg = document.createElement('img');
        closeBtnImg.setAttribute('src', '../../../resources/v1/img/ico-30-svg-close-w.svg');

        const bottomSheet = document.createElement('div');
        bottomSheet.setAttribute('class', 'bottom-sheet fc-1');

        const headline = document.createElement('div');
        headline.setAttribute('class', 'headline');

        const ci = document.createElement('img');
        ci.setAttribute('src','../../../resources/v1/img/img-ci-kyobo.png');
        ci.setAttribute('width','80');

        const titleMsg = document.createElement('h4');
        titleMsg.setAttribute('class', 'fw-700');
        titleMsg.textContent = '이런 상품 어떠세요?'

        const recommendBox = document.createElement('div');
        recommendBox.setAttribute('class', 'recommend-product text-align-center');

        const bannerBox = document.createElement('div');
        bannerBox.setAttribute('class', 'banner-box text-align-center mt-10 fs-0');

        const bgCircle = document.createElement('div');
        bgCircle.setAttribute('class', 'bg-circle hide');

        const recommendImg = document.createElement('img');
        recommendImg.setAttribute('src', linkInfos.linkImg);
        recommendImg.setAttribute('width', '80');
        recommendImg.setAttribute('class', 'mt-10');

        const effectImg = document.createElement('img');
        effectImg.setAttribute('src', effectImgUrl);
        effectImg.setAttribute('width', '90');
        effectImg.setAttribute('class', 'mt-10');

        const recommendName = document.createElement('h4');
        recommendName.setAttribute('class', 'mt-10 fw-700');
        recommendName.textContent = linkInfos.linkName;

        const recommendExplain = document.createElement('p');
        recommendExplain.setAttribute('class', 'mt-10 mb-20 fs-7 fc-3');
        recommendExplain.textContent = linkInfos.linkExplain;

        const certification = document.createElement('div');
        certification.setAttribute('class', 'mt-5 certification');
        certification.textContent = linkInfos.certificationMsg;

        const kyoboLink = document.createElement('a');
        kyoboLink.setAttribute('href', linkInfos.linkUrl);
        kyoboLink.setAttribute('class', 'text-align-center fw-700 fs-6 mt-20 fc-2 kyobo-link')
        kyoboLink.textContent = '더 알아보기';
        kyoboLink.addEventListener('click',e=>{
            e.preventDefault();
            showLoadingScreen();
            window.setTimeout(()=>postBannerClickInfo(
                linkInfos.linkUrl
                , closeLoadingScreen)
                , 2000); //로딩스크린 2초후 실행
        })

        const arrowImg = document.createElement('img');
        arrowImg.setAttribute('src', '../../../resources/v1/img/ico-12-arrow-g.svg');

        //닫기버튼 만들기
        closeBtn.appendChild(closeBtnMsg);
        closeBtn.appendChild(closeBtnImg);
        closeBtn.addEventListener('click', e => {
            e.preventDefault();
            closeBottomSheet();
        });
        closeBtnArea.appendChild(closeBtn);

        //bottomsheet 타이틀 생성
        headline.appendChild(titleMsg);
        headline.appendChild(ci);

        //상품추천내용 생성
        bannerBox.appendChild(bgCircle);
        bannerBox.appendChild(recommendImg);
        bannerBox.appendChild(effectImg);
        recommendBox.appendChild(bannerBox);
        recommendBox.appendChild(recommendName);
        recommendBox.appendChild(recommendExplain);

        //더 알아보기
        kyoboLink.appendChild(arrowImg);

        //bottom sheet
        bottomSheet.appendChild(headline);
        bottomSheet.appendChild(recommendBox);
        if(linkInfos.certificationMsg!==undefined)
            bottomSheet.appendChild(certification);
        bottomSheet.appendChild(kyoboLink);

        //bottom sheet wrapper
        bottomSheetWrapper.appendChild(closeBtnArea);
        bottomSheetWrapper.appendChild(bottomSheet);
        bottomSheetWrapper.addEventListener('transitionend', () => {
            //상품이미지 배경(원) 애니메이션
            bgCircle.classList.toggle('hide');
            //scroll 잠그기
            if(bottomSheetWrapper.classList.contains('hide'))
                handleScrollLock(false);
        });

        document.body.appendChild(bottomSheetWrapper);
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

        // GA 레이어팝업노출
        var gaVirtual = {};
        gaVirtual.event_name = document.getElementById('event_name').value;
        gaVirtual.ep_button_area = document.getElementById('ep_button_area').value;
        gaVirtual.ep_button_area2 = document.getElementById('ep_button_area2').value;
        gaVirtual.ep_button_name = '레이어팝업노출';
        gaVirtual.ep_click_variable = _isAutoBottomStyle ? '노출방식_자동노출' : '노출방식_수동노출';

        ga360.GA_Virtual(gaVirtual);
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

    function isLinkToInsurance() {
        if(_isLinkToInsurance===undefined)
            _isLinkToInsurance = Math.floor(Math.random()*10)<5;
        return _isLinkToInsurance;
    }

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

        fetch(url, options)
            .then(res=>res.json())
            .then(result=>callback(result))
            .catch(error=>callback(error));
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

    function getConsent(accessToken) {
        const url = `/journey/consent/1`;

        fetch('/journey/consent/1', {
          method: 'GET',
          headers: {
              'accessToken': accessToken,
              'Content-type': 'application/json',
              'x-requested-with': 'XMLHttpRequest'
          },
          mode: 'cors',
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }).then(function (res) {
            if (res.ok) {
                ua.changeLoginStatus(true);
                return res.json();
            } else {
                throw new Error('Error: ' + res.status);
            }
        }).then(function (data) {
            console.log(data);
            console.log(ua);

            // ssoUrl + redirectUrl + channelCode(134)
            // self.location.href = "https://mmbr.kyobobook.co.kr/login?continue=" + "http://local.kybobook.co.kr:8080/journey/v2_2B_061" + "&loginChannel=" + "134";
            self.location.href = "https://mmbr.kyobobook.co.kr/login?continue=http://local.kyobobook.co.kr:8080/journey/v2_2B_061&loginChannel=134";
        }).catch(function (err) {
            console.log(err);
        });
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
            radio.addEventListener('change', e => {
                postReview(e.target.value);
                setLocalStorage('feedback-value', e.target.value, 14);//2주만 보관
            });
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
        , initSetting, setUserInLastPage, postReview, getLocalStorage, setLocalStorage, postBannerExposeInfo, postBannerClickInfo, showLoadingScreen, closeLoadingScreen, getConsent}
})();





/** sns 공유하기  */
const shareKakao = (shareUrl) => {

    if (!Kakao.isInitialized()) {
        Kakao.init( globalConfig.kakao.apiKey.prod );
    }

    const title = document.title;
    const desc = document.querySelector("meta[property='og:description']").getAttribute("content");
    const imageUrl = document.querySelector("meta[property='og:iamge']").getAttribute("content");

    Kakao.Share.sendDefault({
        // container: '#ka-share-btn',
        objectType: 'feed',
        content: {
            title: title,
            description: desc,
            imageUrl: imageUrl,
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
    radios.forEach(radio => {
        if (radio.value === value) {
            radio.checked = true;
        }
    })
}

function findByfileName(fileName) {
    for (let obj of appData) {
        if (obj.contentsId && obj.contentsId.includes(fileName)) {
            return obj;
        }
    }
    return appData[0];
}




function checkUserAgent() {
    console.log(ua.device);
}

function initialize(shareUrl) {
    // userAgent set
    checkUserAgent();

    const copyUrl = document.getElementById('url-copy-span');
    // 확대오픈 시 공유하기 pass
    if (copyUrl) {
        copyUrl.innerText = shareUrl;
    }
}

function handleShareButtonClick(event, url) {
    if (event.target.parentElement.id === 'ka-share-btn') {
        shareKakao(url);
    } else if (event.target.parentElement.id === 'fb-share-btn') {
        shareFacebook(url);
    } else if (event.target.parentElement.id === 'msg-share-btn') {
        // event.preventDefault();
        shareSms(url);
    } else if (event.target.innerHTML === 'URL 복사') {
        navigator.clipboard.writeText(url);
    } else if (event.target.parentElement.id === 'more-share-btn') {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'test text',
                url: url,
            })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        } else {
            console.log('Web Share API not supported');
        }
    }
}


// 1. EventProcessor.initSetting -> 기존 컨텐츠 init setting... 임시로 load 이벤트로 분리
// 2. initialize -> 확대오픈/정식오픈 add 컨텐츠 init setting... DomContentLoaded에 정의.
window.addEventListener('load', function() {
    console.log('window onLoad');
});

// 쿠키에서 accessToken 값을 가져오는 함수
function getAccessTokenFromCookie() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('accessToken=')) {
            return cookie.substring('accessToken='.length);
        }
    }
    return null;
}


document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded');

    const url = window.location.href;
    const fileNameWithQuery = url.split('/').pop();
    const fileNameWithoutKeyword = fileNameWithQuery.split('?')[0];
    // const fileNameWithoutPrefix = fileNameWithoutKeyword.replace('open_', '');
    const fileNameWithoutPrefix = fileNameWithoutKeyword.slice(3);


    // test url: http://127.0.0.1:5501/WEB-INF/views/journey/v2_2D_091.html
    // 운영 url: https://life-marketing.kyobobook.co.kr/journey/v2_2B_061?kywr=1LCB6roRfjT16
    // (prefix) v1: 임시오픈 / v2: 확대오픈 / o1: 정식오픈
    const fileName = fileNameWithoutPrefix.replace('.html', '');

    // find By fileName
    info = findByfileName(fileName);
    renderInsuaranceView(info);
    
    // 동의영역 view 
    renderConsentView();

    // initSetting
    EventProcessor.initSetting(fileName, info);

    // 컨텐츠 평가(좋아요/싫어요) 저장 값 set
    const radios = document.querySelectorAll('input[name="feedback-radio"][type="radio"]');
    const localCheckedValue = EventProcessor.getLocalStorage('feedback-value');

    setCheckedValue(radios, localCheckedValue);

    radios.forEach(radio => {
        radio.addEventListener('change', e => {
            console.log('change');
            EventProcessor.postReview(e.target.value);
            EventProcessor.setLocalStorage('feedback-value', e.target.value, 14); //2주만 보관
        });
    });


    // 공유하기
    const currentUrl = window.location.href;

    document.addEventListener('click', e => {
        e.stopPropagation();
        handleShareButtonClick(e, currentUrl);
    });


    const linkForInsurance = document.getElementById('linkForInsurance');
    linkForInsurance.addEventListener('click', e => {
        e.preventDefault();

        EventProcessor.showLoadingScreen();
        window.setTimeout(()=>
            EventProcessor.postBannerClickInfo(info.linkInfoForInsurance.url, EventProcessor.closeLoadingScreen()), 2000); //로딩스크린 2초후 실행
    });


    const accessToken = getAccessTokenFromCookie();
    // consent Test
    const headerClickInfo = document.getElementById('header');
    headerClickInfo.addEventListener('click', e=> {
        // console.log(accessToken);
        EventProcessor.getConsent(accessToken);
    });

    initialize(currentUrl);

});

