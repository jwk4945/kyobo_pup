/*
    보험 상품 info template literal
    const data = { name: 'test name', explain: 'test explain' };
    href=${ renderInfo.linkInfoForInsurance.url }
*/

export function renderInsuaranceView(renderInfo, fileName) {
    console.log('renderInsuaranceView', renderInfo);

    const template = `
                <section class="btm-area">
                    <p class="explain">${ renderInfo.linkInfoForInsurance.explain }</p>
                    <a id="linkForInsurance"
                    onclick="ga360.GA_Event('DBS_캠페인_MO', '${ renderInfo.gaParams.params1 }', '${ renderInfo.gaParams.params2 }', '${ renderInfo.gaParams.params3 }', '${ renderInfo.gaParams.params4 }');">
                        <div class="pd-area">
                            <div class="clear">
                                <div class="ci fl">
                                    <img src="${ renderInfo.linkInfoForInsurance.imgUrl }" alt="KYOBO 교보생명">
                                </div>
                                <dl class="fl">
                                    <dt class="name">${ renderInfo.linkInfoForInsurance.name }</dt>
                                    <dd class="certificationMsg">
                                        <div class="certificationMsg-txt">${ renderInfo.linkInfoForInsurance.certificationMsg }</div>
                                        <div class="certificationMsg-date">${ renderInfo.linkInfoForInsurance.period }</div>
                                    </dd>
                                </dl>
                            </div>
                            <div class="ico-arw"></div>
                        </div>
                    </a>
                </section>                        
    `;

    if (fileName === '2B_061' || fileName === '2B_065') {
        document.querySelector('#ins_view').innerHTML = template;
    } else {
        document.querySelector('#output').innerHTML = template;
    }

}

export function renderConsentView(fileName) {
    console.log(fileName);
    if (fileName != '2B_061' && fileName != '2B_065') {
        return; 
    }
    
    // 개인정보 제3자 제공 동의 (선택)
    const personalTemplate = `
    <div id="personalPop" class="pop-area" style="display: none;">
        <div class="pop-inner">
            <div class="pop-header">
                개인정보 제3자 제공 동의 (선택)
                <a href="javascript:void(0);" class="btn-close" onclick="popClose('personalPop');">
                    <img src="../../../resources/v1/img/icon/ico-close-pop.png" alt="닫기">
                </a>
            </div>
            <div class="pop-cont">
                <div>
                    <p class="fs-15 fc-1">교보생명 보험 상품 서비스 이용을 위한</p>
                    <p class="fs-20 fc-1 fw-700">제3자 정보제공 동의 안내</p>
                </div>
                <div class="dl-box mt-20">
                    <dl>
                        <dt>제공 받는 자</dt>
                        <dd>교보생명보험(주)</dd>
                    </dl>
                </div>
                <div class="dl-box mt-10">
                    <dl>
                        <dt>제공 목적</dt>
                        <dd>교보문고 이용 고객 행태 자료 분석 및 보험 상품·서비스 소개</dd>
                    </dl>
                </div>
                <div class="dl-box mt-10">
                    <dl>
                        <dt>제공 항목</dt>
                        <dd>교보문고ID, 이름, 휴대전화번호, 성별, 생년월일, 본인확인(CI), 이메일, 교보문고 회원번호, 최근 2년 월별 통합포인트(적립, 차감, 잔여), 최근 2년 월별 구매도서 데이터(인터넷 중분류, 도서명, 구입권수, 구입액) , 교보문고 이용행동(입력 검색어, 퍼널 별 최종 단계, 교보생명 배너 클릭 여부, 노출 콘텐츠 ID, 콘텐츠 평가)</dd>
                    </dl>
                </div>
                <div class="dl-box mt-10">
                    <dl>
                        <dt>보유 및 이용 기간</dt>
                        <dd>동의 철회 시까지 (단, 관계법령에 따름)</dd>
                    </dl>
                </div>
                <div class="gray-box mt-40">
                    <dl>
                        <dt>동의를 거부하는 경우에 대한 안내</dt>
                        <dd>본 동의를 거부하실 수 있으나, 거부하는 경우에는 교보생명보험(주) 보험·서비스 소개 제공이 제한될 수 있습니다.</dd>
                    </dl>
                </div>
                <div class="gray-box mt-5">
                    <dl>
                        <dt>동의 철회를 위한 안내</dt>
                        <dd>본 동의를 하시더라도 당사 고객센터(1544-1900)를 통해 동의를 철회하실 수 있습니다.</dd>
                    </dl>
                </div>
            </div>
            <div class="pop-footer">
                <div class="btn-box">      
                    <a href="javascript:void(0);" class="btn btnConsent" onclick="popClose('personalPop');" id="personalDisAgrBtn">동의안함</a>
                    <a href="javascript:void(0);" class="btn btnConsent agree" id="personalAgrBtn">동의</a>
                </div>
            </div>
        </div>
    </div>
    `;

    document.querySelector('#cnst_personal_view').innerHTML = personalTemplate; 

    // 마케팅 수신 동의 (선택)
    const marketTemplate = `
    <div id="marketPop" class="pop-area" style="display: none;">
        <div class="pop-inner">
            <div class="pop-header">
                마케팅 수신 동의 (선택)
                <a href="javascript:void(0);" class="btn-close" onclick="popClose('marketPop');">
                    <img src="../../../resources/v1/img/icon/ico-close-pop.png" alt="닫기">
                </a>
            </div>
            <div class="pop-cont">
                <div>
                    <p class="fs-15 fc-1 fw-500">교보생명보험(주) 보험 상품·서비스 소개 등 다양한 정보를 제공합니다.</p>
                    <p class="fs-15 fc-1 fw-500 mt-5">고객은 수신 동의 철회를 통하여 언제든지 수신을 거부할 수 있습니다.</p>
                </div>
                <div class="fs-15 fc-1 fw-700 mt-15">
                    이에 동의하시겠습니까?
                </div>
                <div class="chk-area mt-15">
                    <div class="agree-box">
                        <label for="chk-sms">
                            <input type="checkbox" name="" id="chk-sms"><i></i><span>SMS(메신저 등)</span>
                        </label>
                    </div>
                    <div class="agree-box">
                        <label for="chk-mail">
                            <input type="checkbox" name="" id="chk-mail"><i></i><span>이메일</span>
                        </label>
                    </div>
                </div>
                <div class="gray-box mt-50">
                    <dl>
                        <dt>동의 철회를 위한 안내</dt>
                        <dd>본 동의를 하시더라도 당사 고객센터(1544-1900)를 통해 동의를 철회하실 수 있습니다.</dd>
                    </dl>
                </div>
            </div>
            <div class="pop-footer">
                <div class="btn-box">
                    <a href="javascript:void(0);" class="btn btnConsent" onclick="popClose('marketPop');" id="marketDisAgrBtn">동의안함</a>
                    <a href="javascript:void(0);" class="btn btnConsent agree btn_agree" id="marketAgrBtn">동의</a>
                </div>
            </div>
        </div>
        <!-- 마케팅 수신 항복 미선택시 토스트 메세지 -->
        <div class="toast_wrap_agree">
            <span class="toast_message">마케팅 수신 방법을 선택해주세요.</span>
        </div>
    </div>
    `;

    document.querySelector('#cnst_market_view').innerHTML = marketTemplate; 
}


