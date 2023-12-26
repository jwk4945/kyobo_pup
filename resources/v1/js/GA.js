// import GAData  from './GAData.js';
import { exPilot, exOpen } from "./mo-data-contents.js";
import { getIsAff, getFileName, getFullFileName } from "./mo-util-utils.js";
import ua from "./ua.js";
import * as ui from "./mo-view-ui.js";


// event_name, ep_button_area, ep_button_area2, ep_button_name, ep_click_variable
export function setGAClickHandler(e) {
    // console.log(e.currentTarget);

    // get fileName
    const contentsId = getFileName();
    const fullContentsId = getFullFileName();
    const isAff = getIsAff();

    // get searchKeyword
    const searchKeywordD = ua.searchKeywordD;

    // version prefix
    const v = 'DBS_' + fullContentsId.substring(0, 2) + '_';
    // console.log(v);

    // [제휴] 인지 아닌지
    let tempGAData = isAff ? affGAData : GAData;

    // 매개변수 셋팅
    const eventName = 'DBS_캠페인_MO';
    const epButtonArea = (tempGAData.find(el => el.contentsId === contentsId) || {}).ep_button_area || 'not found';
    const epButtonName = (tempGAData.find(el => el.contentsId === contentsId) || {}).ep_button_name || 'not found';
    // [키워드 그룹 + id + 키워드]: 배너 등록 시 '제목' = GA '이벤트 변수명' 과 동일 = (v + 'ep_click_varibale')
    const epClickVariable = (tempGAData.find(el => el.contentsId === contentsId) || {}).ep_click_variable || 'not found';
    const epClickVariable2 = (tempGAData.find(el => el.contentsId === contentsId) || {}).ep_click_variable2 || 'not found';

    // yy yn ny nn (동의유무 값) epSearchInternalSearchWord에 임시로 저장
    // [제휴]인 경우 임시 pass
    let epSearchInternalSearchWord = '';
    if (document.getElementById('chkAgr1') && document.getElementById('chkAgr2')) {
        epSearchInternalSearchWord = (document.getElementById('chkAgr1').checked ? 'Y' : 'N') + (document.getElementById('chkAgr2').checked ? 'Y' : 'N');
    }


    // [제휴]인 경우 임시 pass
    let tempFlags = '';
    if (!isAff) {
        tempFlags = ui.getFlags();
    }

    // 1. 뒤로가기
    if (e.currentTarget.id === 'goBackBtn') {
        e.preventDefault();

        ga360.GA_Event(eventName, epButtonArea + '_공통_' + searchKeywordD, '뒤로가기', '뒤로가기', v + epClickVariable);
        window.history.back();
    }

    // 2. 홈
    if (e.currentTarget.id === 'link_home') {
        e.preventDefault();

        ga360.GA_Event(eventName, epButtonArea + '_공통_' + searchKeywordD, '홈', '홈', v + epClickVariable);
        window.location.href = 'https://www.kyobobook.co.kr/';
    }

    // 3. 공유하기
    if (e.currentTarget.id === 'link_share') {
        ga360.GA_Event(eventName, epButtonArea + '_공통_' + searchKeywordD, '공유하기', '공유하기', v + epClickVariable);
    }

    // 4. 콘텐츠 평가
    if (e.currentTarget.name === 'feedback-radio') {
        if (e.currentTarget.id === 'feedback-radio-01') {
            ga360.GA_Event(eventName, epButtonArea + '_상세_' + searchKeywordD, '콘텐츠평가', '버튼명_좋아요', v + epClickVariable);
        } else if (e.currentTarget.id === 'feedback-radio-02') {
            ga360.GA_Event(eventName, epButtonArea + '_상세_' + searchKeywordD, '콘텐츠평가', '버튼명_싫어요', v + epClickVariable);
        }
    }

    // 5. 상품페이지 이동(상품배너 클릭)
    // 5-1. 1.0 콘텐츠 : render.js에 정의
    // 5-2. 2.0 pilot : html에 정의(하드코딩)
    if (e.currentTarget.id === 'linkForInsurance') {
        e.preventDefault();
        // 상품페이지 이동의 경우 ep_click_variable2 사용
        ga360.GA_Event(eventName, epButtonArea + '_상세_' + searchKeywordD, '상품페이지이동', '배너선택', v + epClickVariable2);
    }

    // 6. 상품페이지 이동2('확인하기' 버튼 클릭)
    if (e.currentTarget.id === 'confirm') {
        e.preventDefault();
        // 상품페이지 이동의 경우 ep_click_variable2 사용
        // if (Object.values(tempFlags).every(val => val === 'N')) {
        if (tempFlags.chkAgr1 === 'N') {
            // 🔷 a. 제3자동의 N일때 (eventFlag 상관 없음)
            ga360.GA_Event(eventName, epButtonArea + '_상세_' + searchKeywordD, '상품페이지이동2a', '동의영역버튼선택', v + epClickVariable2, epSearchInternalSearchWord);
        } else if ((ua.flag.eventFlag === 'N' && ua.isLogined && tempFlags.chkAgr1 === 'Y' && tempFlags.chkAgr2 === 'Y')) {
            // 🔷 b. default(이벤트 기간 N) && 전체 동의 && 로그인 한 경우
            ga360.GA_Event(eventName, epButtonArea + '_상세_' + searchKeywordD, '상품페이지이동2b', '동의영역버튼선택', v + epClickVariable2, epSearchInternalSearchWord);
        } else if (ua.flag.eventFlag === 'Y' && ua.flag.remainingPointsFlag === 'Y' && ua.isLogined) {
            if (tempFlags.chkAgr1 === 'Y' && tempFlags.chkAgr2 === 'Y') {
                // 🔷 c. 이벤트 기간 Y && 전체 동의 && 로그인 한 경우 -> event 지급 case !
                ga360.GA_Event(eventName, epButtonArea + '_상세_' + searchKeywordD, '상품페이지이동2c', '동의영역버튼선택', v + epClickVariable2, epSearchInternalSearchWord);
            } else if (tempFlags.chkAgr1 === 'Y' && tempFlags.chkAgr2 === 'N') {
                // 🔷 d. 이벤트 기간 Y && 제3자 동의 && 마케팅 미동의 && 로그인 한 경우
                ga360.GA_Event(eventName, epButtonArea + '_상세_' + searchKeywordD, '상품페이지이동2d', '동의영역버튼선택', v + epClickVariable2, epSearchInternalSearchWord);
            }
        } else if (ua.flag.eventFlag === 'Y' && ua.flag.remainingPointsFlag === 'N') {
            if (ua.isLogined) {
                if (tempFlags.chkAgr1 === 'Y' && tempFlags.chkAgr2 === 'N') {
                    // 🔷 e. 이벤트 기간 Y && 잔여포인트 N && 제3자 동의 && 마케팅 미동의 && 로그인 한 경우
                    ga360.GA_Event(eventName, epButtonArea + '_상세_' + searchKeywordD, '상품페이지이동2e', '동의영역버튼선택', v + epClickVariable2, epSearchInternalSearchWord);
                } else if (tempFlags.chkAgr1 === 'Y' && tempFlags.chkAgr2 === 'Y') {
                // 🔷 f. 이벤트 기간 Y && 잔여포인트 N && 제3자 동의 && 마케팅 동의 && 로그인 한 경우 -> default case !
                ga360.GA_Event(eventName, epButtonArea + '_상세_' + searchKeywordD, '상품페이지이동2f', '동의영역버튼선택', v + epClickVariable2, epSearchInternalSearchWord);
                }
            }
        }
    }

    // 7. 정답 확인하기 (6G_054, 13G_045, 7D_003, 12G_108, 14G_057, 19G_142)
    if (e.currentTarget.id === 'goNextBtn') { // goNextBtn: 정답 확인하기 버튼 / btnNext: 다음에하기 버튼
        const checked = document.querySelector('input[name="kyobolife-survey"]:checked').value;
        ga360.GA_Event(eventName, epButtonArea + '_메인_' + searchKeywordD, '정답 확인하기', checked, v + epClickVariable);
    }

    // 8. 포인트 팝업번호 0번 > '다음에 하기' 버튼 (이벤트 기간 N인 default 상태)
    if (e.currentTarget.id === 'btnNext') {
        e.preventDefault();
        ga360.GA_Event(eventName, epButtonArea + '_상세_' + searchKeywordD, '상품페이지이동4', '포인트팝업확인', v + epClickVariable2, epSearchInternalSearchWord);
    }

    // 9. 포인트 팝업번호 2번 > '확인하기' 버튼
    if (e.currentTarget.id === 'btnLoginPointEnd01') {
        e.preventDefault();
        ga360.GA_Event(eventName, epButtonArea + '_상세_' + searchKeywordD, '상품페이지이동5', '포인트팝업확인', v + epClickVariable2, epSearchInternalSearchWord);
    }

    // 10. [제휴]
    if (e.currentTarget.id === 'linkForHeymama') {
        ga360.GA_Event(eventName, epButtonArea + '_상세_' + searchKeywordD, '제휴 이동', '배너선택', v + epClickVariable, epSearchInternalSearchWord);
    }
    if (e.currentTarget.id === 'linkForDonots') {
        ga360.GA_Event(eventName, epButtonArea + '_상세_' + searchKeywordD, '제휴 이동', '배너선택', v + epClickVariable, epSearchInternalSearchWord);
    }

    // 11. 플로팅 UI
    if (e.currentTarget.id === 'btnPointWrap') {
        ga360.GA_Event(eventName, epButtonArea + '_상세_' + searchKeywordD, '플로팅UI클릭', '플로팅UI클릭', v + epClickVariable, epSearchInternalSearchWord);
    }

}

export function setGAClickHandler_PC(e) {

    // get fileName
    const contentsId = '2B_141'; // getFileName();
    const fullContentsId = 'o3_2B_141'; //getFullFileName();

    // get searchKeyword
    const searchKeywordD = ua.searchKeywordD;

    // version prefix
    const v = 'DBS_' + fullContentsId.substring(0, 2) + '_';
    // console.log(v);


    // 매개변수 셋팅
    const eventName = 'DBS_캠페인_PC';

    // yy yn ny nn (동의유무 값) epSearchInternalSearchWord에 임시로 저장
    // [제휴]인 경우 임시 pass
    let epSearchInternalSearchWord = '';
    if (document.getElementById('chkAgr1') && document.getElementById('chkAgr2')) {
        epSearchInternalSearchWord = (document.getElementById('chkAgr1').checked ? 'Y' : 'N') + (document.getElementById('chkAgr2').checked ? 'Y' : 'N');
    }




    // 공유하기
    if (e.currentTarget.id === 'btn_share') {
        ga360.GA_Event(eventName, '자산관리_재테크_전세보증보험_상세_' + searchKeywordD, '공유하기', '공유하기', 'DBS_o3_PC_자산관리_재테크_전세보증보험');
    }

    // 콘텐츠 평가
    if (e.currentTarget.name === 'feedback-radio') {
        if (e.currentTarget.id === 'feedback-radio-01') {
            ga360.GA_Event(eventName, '자산관리_재테크_전세보증보험_상세_' + searchKeywordD, '콘텐츠평가', '버튼명_좋아요', 'DBS_o3_PC_자산관리_재테크_전세보증보험');
        } else if (e.currentTarget.id === 'feedback-radio-02') {
            ga360.GA_Event(eventName, '자산관리_재테크_전세보증보험_상세_' + searchKeywordD, '콘텐츠평가', '버튼명_싫어요', 'DBS_o3_PC_자산관리_재테크_전세보증보험');
        }
    }

    // 상품페이지 이동
    if (e.currentTarget.id === 'linkForInsurance') {
        e.preventDefault();
        // 상품페이지 이동의 경우 ep_click_variable2 사용
        ga360.GA_Event(eventName, '자산관리_재테크_전세보증보험_상세_' + searchKeywordD, '상품페이지이동', '배너선택', 'DBS_o3_PC_교보1년저축보험(무배당)[D]');
    }

}