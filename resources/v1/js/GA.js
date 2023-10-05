// import GAData  from './GAData.js';
import { exPilot, exOpen } from "./mo-data-contents.js";
import { getFileName } from "./mo-util-utils.js";
import ua from "./ua.js";


// event_name, ep_button_area, ep_button_area2, ep_button_name, ep_click_variable
export function setGAClickHandler(e) {
    // console.log(e.currentTarget);

    // get fileName
    const contentsId = getFileName();

    // get searchKeyword
    const searchKeyword = ua.searchKeyword;
    console.log(searchKeyword);

    // version prefix
    const v = 'DBS_' + (exPilot.includes(contentsId) ? 'p1' : 'o2') + '_';

    // 매개변수 셋팅
    const eventName = 'DBS_캠페인_MO';
    const epButtonArea = (GAData.find(el => el.contentsId === contentsId) || {}).ep_button_area || 'not found';
    const epButtonName = (GAData.find(el => el.contentsId === contentsId) || {}).ep_button_name || 'not found';
    // [키워드 그룹 + id + 키워드]: 배너 등록 시 '제목' = GA '이벤트 변수명' 과 동일 = (v + 'ep_click_varibale')
    const epClickVariable = (GAData.find(el => el.contentsId === contentsId) || {}).ep_click_variable || 'not found';
    const epClickVariable2 = (GAData.find(el => el.contentsId === contentsId) || {}).ep_click_variable2 || 'not found';

    // yy yn ny nn (동의유무 값) epSearchInternalSearchWord에 임시로 저장
    const epSearchInternalSearchWord = (document.getElementById('chkAgr1').checked ? 'Y' : 'N')
        + (document.getElementById('chkAgr2').checked ? 'Y' : 'N');


    // const goBackBtn = document.getElementById('goBackBtn');
    // goBackBtn.addEventListener('click', e => {
    //
    // })



    // 1. 뒤로가기
    if (e.currentTarget.id === 'goBackBtn') {
        e.preventDefault();

        ga360.GA_Event(eventName, epButtonArea + '_공통', '뒤로가기', '뒤로가기', v + epClickVariable);
        window.history.back();
    }

    // 2. 홈
    if (e.currentTarget.id === 'link_home') {
        e.preventDefault();

        ga360.GA_Event(eventName, epButtonArea + '_공통', '홈', '홈', v + epClickVariable);
        window.location.href = 'https://www.kyobobook.co.kr/';
    }

    // 3. 공유하기
    if (e.currentTarget.id === 'link_share') {
        ga360.GA_Event(eventName, epButtonArea + '_공통', '공유하기', '공유하기', v + epClickVariable);
    }

    // 4. 콘텐츠 평가
    if (e.currentTarget.name === 'feedback-radio') {
        if (e.currentTarget.id === 'feedback-radio-01') {
            ga360.GA_Event(eventName, epButtonArea + '_상세', '버튼명_좋아요', '콘텐츠평가', v + epClickVariable);
        } else if (e.currentTarget.id === 'feedback-radio-02') {
            ga360.GA_Event(eventName, epButtonArea + '_상세', '버튼명_싫어요', '콘텐츠평가', v + epClickVariable);
        }
    }

    // 5. 상품페이지 이동(상품배너 클릭)
    // 5-1. 1.0 콘텐츠 : render.js에 정의
    // 5-2. 2.0 pilot : html에 정의(하드코딩)
    if (e.currentTarget.id === 'linkForInsurance') {
        e.preventDefault();
        // 상품페이지 이동의 경우 ep_click_variable2 사용
        ga360.GA_Event(eventName, epButtonArea + '_상세', '상품페이지이동', '배너선택', v + epClickVariable2);
    }

    // 6. 상품페이지 이동2('확인하기' 버튼 클릭)
    if (e.currentTarget.id === 'confirm') {
        e.preventDefault();
        // 상품페이지 이동의 경우 ep_click_variable2 사용
        ga360.GA_Event(eventName, epButtonArea + '_상세', '상품페이지이동2', '동의영역버튼선택', v + epClickVariable2, epSearchInternalSearchWord);
    }

    // 7. 정답 확인하기 (6G_054, 13G_045, 7D_003, 12G_108, 14G_057, 19G_142)
    if (e.currentTarget.id === 'goNextBtn') { // goNextBtn: 정답 확인하기 버튼 / btnNext: 다음에하기 버튼
        const checked = document.querySelector('input[name="kyobolife-survey"]:checked').value;
        ga360.GA_Event(eventName, epButtonArea + '_메인', '정답 확인하기', checked, v + epClickVariable);
    }

    // 8. 포인트 팝업번호 2번 > '확인하기' 버튼
    if (e.currentTarget.id === 'btnNextPonintEnd01') {
        e.preventDefault();
        ga360.GA_Event(eventName, epButtonArea + '_상세', '상품페이지이동3', '포인트팝업확인', v + epClickVariable2, epSearchInternalSearchWord);
    }

}