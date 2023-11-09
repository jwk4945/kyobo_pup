import ua from "./ua.js";


/*
*
* ▶️ 동의하기
* @param
*
*/
export function postConsent(accessToken, sub, tempFlags) {
    const url = `/journey/consent/personal-information/agreement`;

    let sendData;
    if (tempFlags === '') {
        sendData = {
            bookstoreMemberNo: ua.bookstoreMemberNo
            , personalInformationAgreementFlag: 'N'
            , marketingConsentAgreementFlag: 'N'
            , marketingConsentAgreementSmsFlag: 'N'
            , marketingConsentAgreementEmailFlag: 'N'
        }
    } else {
        sendData = {
            bookstoreMemberNo: ua.bookstoreMemberNo
            , personalInformationAgreementFlag: tempFlags.chkAgr1
            , marketingConsentAgreementFlag: tempFlags.chkAgr2
            , marketingConsentAgreementSmsFlag: tempFlags.chkSms
            , marketingConsentAgreementEmailFlag: tempFlags.chkMail
        }
    }

    // 🔸 제3자제공동의 Y인 경우에만 수집
    if (tempFlags.chkAgr1 !== 'Y' && accessToken !== null && tempFlags !== '') {
        console.log('제 3자 제공 동의 N -> postConsent Exit. ');
        return;
    }

    fetch(url, {
        method: 'POST',
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
        body: JSON.stringify(sendData), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
    }).then(function (res) {
        if (res.ok) {
            ua.changeLoginStatus(true);

            return null;
            // return res.json();
        } else if (res.status === 403) {
            ua.changeLoginStatus(false);
            console.warn('로그인 토큰 만료');

            // ssoUrl + redirectUrl + channelCode(134)
            self.location.href = "https://mmbr.kyobobook.co.kr/login?continue=" + window.location.href + "&loginChannel=134";
            // self.location.href = "http://mmbr.ndev.kyobobook.co.kr/login?continue=" + window.location.href + "&loginChannel=134";
        } else {
            throw new Error('Error: ' + res.status);
        }
    }).then(function (data) {
        console.log(data);
        console.log(ua);
    }).catch(function (err) {
        console.log(err);
    });
}


/*
*
* ▶️ 교환권 회원발급 api
* @param {Long} mmbrNum(고객번호) - not null
*
*/
// 'LMSE1'
export function postEvent(accessToken, sub, isSmsEvent, smsEventType) {
    const url = `/journey/consent/personal-information/agreement/event`;
    const sendData = {
        mmbrNum: sub,
        smsEventYN: isSmsEvent,
        smsEventType: smsEventType,
    };

    fetch(url, {
        method: 'POST',
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
        body: JSON.stringify(sendData), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
    }).then(function (res) {
        if (res.ok) {
            return null;
        } else {
            throw new Error('Error: ' + res.status);
        }
    }).catch(function (err) {
        console.log(err);
    });
}

export function postReview(value, contentsId, searchKeyword, userKey){
    const url = `/journey/form/contents-review`;
    const sendData = {
        srch_kywr_name: searchKeyword
        , csjr_ctts_num: contentsId
        , csjr_ctts_vltn_dvsn_code: value
        , terml_cnct_param_wrth: userKey
    };
    postData(url, sendData, result=>{console.log(result)})
}

export function postBannerClickInfo(info, callback) {
    const url = `/journey/form/banner-visit`;
    const tmpContentsId = document.querySelector('#csjr_ctts_num').value;

    const sendData = {
        csjr_ctts_advr_expr_srmb: 1 //_bannerHistorySeq // 배너이력순번
        , srch_kywr_name: ua.searchKeyword // 교보문고 검색키워드
        , csjr_ctts_num: ua.contentsId // _contentsId // 콘텐츠아이디
        , bnnr_expr_mthd_dvsn_code: '003' // 자동 : 수동          -> 5/18 고정값 "003" 으로 변경
        , bnnr_expr_cmdt_kind_code: '003' // 보험 : 부가서비스      -> 5/18 고정값 "003" 으로 변경
        , bnnr_expr_cmdt_name: info.name //getLinkInfos().linkName
        , bnnr_urladrs: info.url //getLinkInfos().linkUrl
    };
    postData(url, sendData, result => {
        console.log('postBannerClickInfo::', result);
        window.location.href = info.url;
        if (callback !== undefined)
            callback();
    })
}

export function postAffBannerClickInfo(affInfo) {
    const url = `/journey/form/banner-visit`;
    const sendData = {
        csjr_ctts_advr_expr_srmb: 1 //_bannerHistorySeq // 배너이력순번
        , srch_kywr_name: ua.searchKeyword // 교보문고 검색키워드
        , csjr_ctts_num: ua.contentsId // _contentsId // 콘텐츠아이디
        , bnnr_expr_mthd_dvsn_code: '003' // 자동 : 수동          -> 5/18 고정값 "003" 으로 변경
        , bnnr_expr_cmdt_kind_code: '003' // 보험 : 부가서비스      -> 5/18 고정값 "003" 으로 변경
        , bnnr_expr_cmdt_name: affInfo.name //getLinkInfos().linkName
        , bnnr_urladrs: affInfo.url //getLinkInfos().linkUrl
    };
    postData(url, sendData, result => {
        console.log('postBannerClickInfo::', result);
        window.location.href = affInfo.url;
    })
}

export function postSurveyInput(surveyResultTargets){
    surveyResultTargets = surveyResultTargets || {
        //설문비율 텍스트 elements
        arrSurveyResultTexts: document.querySelectorAll('.li-item-result .result-ratio'),
        //설문비율 그래프(가로바) elements
        arrSurveyResultBars: document.querySelectorAll('.li-item-result .painted-bar')
    }

    let checkedInput = document.querySelector('input[name="kyobolife-survey"]:checked')
    let dataSurvey = checkedInput.getAttribute('data-sv');

    const url = `/journey/form/contents-survey`;
    const sendData = {
        srch_kywr_name: ua.searchKeyword // 교보문고 검색키워드,
        , csjr_ctts_num: ua.contentsId // 콘텐츠아이디
        , csjr_srvy_ansr_srmb: checkedInput.value // 응답 라디오 순번
        , csjr_srvy_ansr_cntt: dataSurvey // 응답 보기설문내용
    };

    postData(url, sendData, result=>{
        // console.log(result);
        result.forEach(row=>{
            const idx = row.csjr_srvy_ansr_srmb-1;
            surveyResultTargets.arrSurveyResultTexts[idx].textContent = row.csjr_ctts_srvy_rate;
            surveyResultTargets.arrSurveyResultBars[idx].style.width = `${row.csjr_ctts_srvy_rate}%`;
        })
    })
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
