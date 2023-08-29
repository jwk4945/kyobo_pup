// import GAData  from './GAData.js';


// event_name, ep_button_area, ep_button_area2, ep_button_name, ep_click_variable
function setGAClickHandler(e) {
    console.log(e.currentTarget);

    // get fileName
    const url = window.location.href;
    const fileNameWithQuery = url.split('/').pop();
    const fileNameWithoutKeyword = fileNameWithQuery.split('?')[0];
    // const fileNameWithoutPrefix = fileNameWithoutKeyword.replace('open_', '');
    const fileNameWithoutPrefix = fileNameWithoutKeyword.slice(3);
    const contentsId = fileNameWithoutPrefix.replace('.html', '');

    const eventName = 'DBS_캠페인_MO';
    const epButtonArea = (GAData.find(e => e.contentsId === contentsId) || {}).ep_button_area || 'not found';
    const epButtonName = (GAData.find(e => e.contentsId === contentsId) || {}).ep_button_name || 'not found';
    const epClickVariable = (GAData.find(e => e.contentsId === contentsId) || {}).ep_click_variable || 'not found';
    const epClickVariable2 = (GAData.find(e => e.contentsId === contentsId) || {}).ep_click_variable2 || 'not found';

    // yy yn ny nn (동의유무 값) epSearchInternalSearchWord에 임시로 저장
    const epSearchInternalSearchWord = (document.getElementById('chkAgr1').checked ? 'Y' : 'N')
                                     + (document.getElementById('chkAgr2').checked ? 'Y' : 'N');

    // 1. 뒤로가기
    if (e.currentTarget.id === 'goBackBtn') {
        e.preventDefault();

        ga360.GA_Event(eventName, epButtonArea + '공통', '뒤로가기', '뒤로가기',epClickVariable);
        window.history.back();
    }

    // 2. 홈
    if (e.currentTarget.id === 'link_home') {
        e.preventDefault();

        ga360.GA_Event('', epButtonArea + '공통', '홈', '홈', epClickVariable);
        window.location.href = 'https://www.kyobobook.co.kr/';
    }

    // 3. 공유하기
    if (e.currentTarget.id === 'link_share') {
        ga360.GA_Event(eventName, epButtonArea + '공통', '공유하기', '공유하기', epClickVariable);
    }

    // 4. 콘텐츠 평가
    if (e.currentTarget.name === 'feedback-radio') {
        if (e.currentTarget.id === 'feedback-radio-01') {
            ga360.GA_Event(eventName, epButtonArea + '상세', '버튼명_좋아요', '콘텐츠평가', epClickVariable);
        } else if (e.currentTarget.id === 'feedback-radio-02') {
            ga360.GA_Event(eventName, epButtonArea + '상세', '버튼명_싫어요', '콘텐츠평가', epClickVariable);
        }
    }

    // 5. 상품페이지 이동
    // render.js 에 정의
    if (e.currentTarget.id === 'linkForInsurance') {
        e.preventDefault();
        // 상품페이지 이동의 경우 ep_click_variable2 사용
        ga360.GA_Event(eventName, epButtonArea + '상세', '상품페이지이동', '배너선택', epClickVariable2);
    }

    // 6. 상품페이지 이동2
    if (e.currentTarget.id === 'confirm') {
        e.preventDefault();
        // 상품페이지 이동의 경우 ep_click_variable2 사용
        ga360.GA_Event(eventName, epButtonArea + '상세', '상품페이지이동2', '동의영역버튼선택', epClickVariable2, epSearchInternalSearchWord);
    }

    // 7. 정답 확인하기 (6G_054, 13G_045, 7D_003, 12G_108, 14G_057, 19G_142)
    if (e.currentTarget.id === 'goNextBtn') { // goNextBtn: 정답 확인하기 버튼 / btnNext: 다음에하기 버튼
        const checked = document.querySelector('input[name="kyobolife-survey"]:checked').value;
        ga360.GA_Event(eventName, epButtonArea + '메인', '정답 확인하기', checked, epClickVariable);
    }

}