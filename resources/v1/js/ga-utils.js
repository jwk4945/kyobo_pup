/* eslint-disable no-var */
/* globals KbbJS */

console.log('* [loaded] /CDN/js/ga360/util.js');
window.dataLayer = window.dataLayer || [];
window.ga360 = window.ga360 || {};

const pageDict = {
    'https://life-marketing.kyobobook.co.kr/journey/2D_015': '교보문고>DBS캠페인>자산관리_재테크_1억투자_10년후',
    'https://life-marketing.kyobobook.co.kr/journey/3A_024': '교보문고>DBS캠페인>자녀_아동_소아비만',
    'https://life-marketing.kyobobook.co.kr/journey/6B_019': '교보문고>DBS캠페인>자녀_태아&신생아_산후우울증',
    'https://life-marketing.kyobobook.co.kr/journey/13C_031': '교보문고>DBS캠페인>질병_당뇨_당뇨병음식',
    'https://life-marketing.kyobobook.co.kr/journey/2B_039': '교보문고>DBS캠페인>자산관리_재테크_보험계약대출',
    'https://life-marketing.kyobobook.co.kr/journey/3A_004': '교보문고>DBS캠페인>자녀_아동_셰어런팅',
    'https://life-marketing.kyobobook.co.kr/journey/6F_007': '교보문고>DBS캠페인>자녀_태아&신생아_부인과아기',
    'https://life-marketing.kyobobook.co.kr/journey/13G_029': '교보문고>DBS캠페인>질병_당뇨_당화혈색소',
    'https://life-marketing.kyobobook.co.kr/journey/v2_2B_061': '교보문고>DBS캠페인>자산관리_재테크_스노우볼효과',

    'https://life-marketing.kyobobook.co.kr/journey/v2_3C_033': '교보문고>DBS캠페인>자녀_아동_유치원',
    'https://life-marketing.kyobobook.co.kr/journey/v2_6G_054': '교보문고>DBS캠페인>자녀_태아&신생아_임신검사',
    'https://life-marketing.kyobobook.co.kr/journey/v2_13G_045': '교보문고>DBS캠페인>질병_당뇨_식단',
    'https://life-marketing.kyobobook.co.kr/journey/v2_5B_041': '교보문고>DBS캠페인>건강관리_운동_바디프로필',
    'https://life-marketing.kyobobook.co.kr/journey/v2_16B_011': '교보문고>DBS캠페인>자기개발_요즘20대들은모른다는문제',
    'https://life-marketing.kyobobook.co.kr/journey/v2_1B_067': '교보문고>DBS캠페인>자녀_초중등_가스라이팅',
    'https://life-marketing.kyobobook.co.kr/journey/v2_4B_043': '교보문고>DBS캠페인>질병_척추근골격계_버섯목증후군',
    'https://life-marketing.kyobobook.co.kr/journey/v2_8B_110': '교보문고>DBS캠페인>일상생활_부부_외벌이',
    'https://life-marketing.kyobobook.co.kr/journey/v2_7D_003': '교보문고>DBS캠페인>건강관리_운동외_건강검진'
};

const pageDictDev = {
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/2D_015': '교보문고>DBS캠페인>자산관리_재테크_1억투자_10년후',
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/3A_024': '교보문고>DBS캠페인>자녀_아동_소아비만',
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/6B_019': '교보문고>DBS캠페인>자녀_태아&신생아_산후우울증',
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/13C_031': '교보문고>DBS캠페인>질병_당뇨_당뇨병음식',
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/2B_039': '교보문고>DBS캠페인>자산관리_재테크_보험계약대출',
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/3A_004': '교보문고>DBS캠페인>자녀_아동_셰어런팅',
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/6F_007': '교보문고>DBS캠페인>자녀_태아&신생아_부인과아기',
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/13G_029': '교보문고>DBS캠페인>질병_당뇨_당화혈색소',

    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/v2_2B_061': '교보문고>DBS캠페인>자산관리_재테크_스노우볼효과',
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/v2_3C_033': '교보문고>DBS캠페인>자녀_아동_유치원',
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/v2_6G_054': '교보문고>DBS캠페인>자녀_태아&신생아_임신검사',
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/v2_13G_045': '교보문고>DBS캠페인>질병_당뇨_식단',
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/v2_5B_041': '교보문고>DBS캠페인>건강관리_운동_바디프로필',
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/v2_16B_011': '교보문고>DBS캠페인>자기개발_요즘20대들은모른다는문제',
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/v2_1B_067': '교보문고>DBS캠페인>자녀_초중등_가스라이팅',
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/v2_4B_043': '교보문고>DBS캠페인>질병_척추근골격계_버섯목증후군',
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/v2_8B_110': '교보문고>DBS캠페인>일상생활_부부_외벌이',
    'http://life-marketing-dev.kyobobook.co.kr:8080/journey/v2_7D_003': '교보문고>DBS캠페인>건강관리_운동외_건강검진'
};

// IIFE
;(function () {
    const ga360 = {
        AndroidWebview: 'GA_Android',
        iOS_Webview_WK: 'GA_iOS_WK',
        CommonData: {},
        isMoveFlag: false,
        browserInfo: navigator.userAgent
    };

    class Ga360Class {
        constructor() {
            this.init()
            this.domReady()
        }

        init() {
            console.log('---init---')
        }

        domReady() {
            this.render()
        }

        render() {
            // safari 에서는 window.cookieStore 를 사용할수없어 수정
            const user = navigator.userAgent;
            if ((window.safari !== undefined) || (user.indexOf("iPhone") > -1) || (user.indexOf("iPad") > -1)) {
                const pageviewObj = {}
                pageviewObj.ep_visit_channelOption = 'PC'

                if (ga360.browserInfo.indexOf("GA_Android") > -1 || ga360.browserInfo.indexOf("GA_iOS_WK") > -1) {
                    pageviewObj.ep_visit_channelOption = 'APP'
                }

                pageviewObj.ep_visit_siteOption = '교보문고'
                pageviewObj.ep_page_fullUrl = window.location.href
                pageviewObj.ep_page_noParameterUrl = window.location.origin + window.location.pathname
                pageviewObj.title = window.document.title //'교보문고>웰컴>웰컴 메인'
                pageviewObj.location = window.location.href // 'https://onk.ndev.kyobobook.co.kr/dd/ee'

                console.log('window.location.origin + window.location.pathname : ' + window.location.origin + window.location.pathname);

                if (pageDict[window.location.origin + window.location.pathname]) {
                    pageviewObj.ep_test_DevProd = "운영";
                    pageviewObj.title = pageDict[window.location.origin + window.location.pathname];
                } else if (pageDictDev[window.location.origin + window.location.pathname]) {
                    pageviewObj.ep_test_DevProd = "개발";
                    pageviewObj.title = pageDictDev[window.location.origin + window.location.pathname];
                }

                pageviewObj.up_loginState = "N"

                if (document.cookie.split("accessToken=")[1]) {
                    var accessToken = document.cookie.split("accessToken=")[1].split(";")[0];
                    if (accessToken) {
                        var tokenJson = parseToken(accessToken)
                        var myname = tokenJson["username"]
                        var objuid = SHA256(myname)
                        pageviewObj.up_uid = objuid
                        pageviewObj.up_loginState = "Y"
                    }
                }

                console.log('-------GA_Screen----------')
                GA_Screen(pageviewObj)
                console.log('-------GA_Screen-EndEnd---------')
            } else {
                // 2022.10.25 쿠키를 가져오기 위해 로직을 then 안으로 수정
                const pageviewObj = {}
                pageviewObj.ep_visit_channelOption = 'PC'

                let a = (navigator.userAgent || navigator.vendor || window.opera);
                if (ga360.browserInfo.indexOf("GA_Android") > -1 || ga360.browserInfo.indexOf("GA_iOS_WK") > -1) {
                    pageviewObj.ep_visit_channelOption = 'APP'
                } else if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
                    pageviewObj.ep_visit_channelOption = 'MOWEB'
                }

                pageviewObj.ep_visit_siteOption = '교보문고'
                pageviewObj.ep_page_fullUrl = window.location.href
                pageviewObj.ep_page_noParameterUrl = window.location.origin + window.location.pathname
                pageviewObj.title = window.document.title //'교보문고>웰컴>웰컴 메인'
                pageviewObj.location = window.location.href // 'https://onk.ndev.kyobobook.co.kr/dd/ee'

                console.log('window.location.origin + window.location.pathname : ' + window.location.origin + window.location.pathname);

                if (pageDict[window.location.origin + window.location.pathname]) {
                    pageviewObj.ep_test_DevProd = "운영";
                    pageviewObj.title = pageDict[window.location.origin + window.location.pathname];
                } else if (pageDictDev[window.location.origin + window.location.pathname]) {
                    pageviewObj.ep_test_DevProd = "개발";
                    pageviewObj.title = pageDictDev[window.location.origin + window.location.pathname];
                }

                pageviewObj.up_loginState = "N"

                if (document.cookie.split("accessToken=")[1]) {
                    var accessToken = document.cookie.split("accessToken=")[1].split(";")[0];
                    if (accessToken) {
                        var tokenJson = parseToken(accessToken)
                        var myname = tokenJson["username"]
                        var objuid = SHA256(myname)
                        pageviewObj.up_uid = objuid
                        pageviewObj.up_loginState = "Y"
                    }
                }
                console.log('-------GA_Screen----------')
                GA_Screen(pageviewObj)
                console.log('-------GA_Screen-EndEnd---------')
            }
            // console.log('-------GA_Event---------')
            // const event_name = 'click_검색_PC'
            // const ep_button_area = '검색'
            // const ep_button_area2 = ""
            // const ep_button_name = '검색_통합검색'
            // const ep_click_variable = '역행자'
            // this.GA_Event(event_name, ep_button_area, ep_button_area2, ep_button_name, ep_click_variable)
            // console.log('-------GA_Event-END---------')
        }
    }

    new Ga360Class();

    function Convert_Element(RemoveValue) {
        // let return_Value = new Object()
        console.log('-------RemoveValue---------')
        // if(RemoveValue.length() === 0){
        //   return RemoveValue
        // }
        // for (let key in RemoveValue) {
        //   if (RemoveValue[key] === '' || RemoveValue[key] === undefined || RemoveValue[key] === null) {
        //     delete RemoveValue[key]
        //   }
        // }
        return RemoveValue
    }

    // 하이브리드 코드
    function Hybrid(GADATA) {
        console.log('-------Hybrid---------')
        console.log(JSON.stringify(ga360.CommonData))
        console.log(JSON.stringify(GADATA))
        // GADATA.type = "P"
        console.log('-------Hybrid end---------')
        let emptyObject = JSON.parse(JSON.stringify(Convert_Element(ga360.CommonData)))
        emptyObject = Object.assign(emptyObject, Convert_Element(GADATA))
        if (ga360.browserInfo.indexOf("GA_Android") > -1) {
            console.log('-------Hybrid AndroidWebview---------')
            window.kyobogascriptAndroid.GA_DATA(JSON.stringify(emptyObject))
            console.log('-------Hybrid AndroidWebview enedendnende---------')
        } else if (ga360.browserInfo.indexOf("GA_iOS_WK") > -1) {
            webkit.messageHandlers.kyobogascriptCallbackHandler.postMessage(JSON.stringify(emptyObject))
        }
    }

    // 공통 화면 함수
    function GA_Screen(Object) {
        try {
            const CommonData = Object
            if (ga360.browserInfo.indexOf('GA_iOS_WK') > -1 || ga360.browserInfo.indexOf('GA_Android') > -1) {
                CommonData.type = 'P'
                Hybrid(CommonData)
            } else {
                console.log(CommonData)
                const w = window
                const d = document
                const s = 'script'
                const l = 'dataLayer'
                const i = 'GTM-TWGDFSP'
                w[l] = w[l] || []
                w[l].push(CommonData)
                w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'})
                const f = d.getElementsByTagName(s)[0];
                const j = d.createElement(s);
                const dl = l != 'dataLayer' ? '&l=' + l : ''
                j.async = true
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
                f.parentNode.insertBefore(j, f)
            }
        } catch (e) {
            console.log('APP 코드 시 ERROR')
            console.log(e)
        }
    }

    // 공통 이벤트 함수
    function GA_Event(event_name, ep_button_area, ep_button_area2, ep_button_name, ep_click_variable, ep_search_internalSearchWord) {
        try {
            console.log('-------ga-event-in-------')
            if (ga360.browserInfo.indexOf('GA_iOS_WK') > -1 || ga360.browserInfo.indexOf('GA_Android') > -1) {
                const GAData = {}
                GAData.event_name = event_name
                GAData.type = 'E'
                GAData.ep_button_area = ep_button_area
                GAData.ep_button_area2 = ep_button_area2
                GAData.ep_button_name = ep_button_name
                GAData.ep_click_variable = ep_click_variable
                GAData.ep_search_internalSearchWord = ep_search_internalSearchWord
                Hybrid(GAData)
            } else {
                console.log('-------ga-event-else-in-------')
                const w = window
                const d = document
                const s = 'script'
                const l = 'dataLayer'
                w[l] = w[l] || []
                w[l].push({
                    event: 'ga_event',
                    event_name: event_name,
                    ep_button_area: ep_button_area,
                    ep_button_area2: ep_button_area2,
                    ep_button_name: ep_button_name,
                    ep_click_variable: ep_click_variable,
                    ep_search_internalSearchWord: ep_search_internalSearchWord
                })
                console.log('-------ga-event-else-out-------')
                console.log(w[l])
            }
        } catch (e) {
            console.log('APP 코드 시 ERROR')
        }
    }

    // 공통 전자상거래 함수
    function EcommerceSet(E_step, items, actionList, addDimension, addMetric) {
        try {
            if (ga360.browserInfo.indexOf('GA_iOS_WK') > -1 || ga360.browserInfo.indexOf('GA_Android') > -1) {
                var APPData = new Object();
                APPData.event_name = E_step;
                APPData.type = "E";
                APPData.items = items;
                APPData.transaction = actionList;
                APPData = Object.assign(APPData, addDimension, addMetric);
                Hybrid(APPData)
            } else {
                var Ecommerce = new Object();
                var DataSend = new Object();
                Ecommerce = {items: []}
                Ecommerce.items = items;
                var EcommerceData = Object.assign({}, Ecommerce, actionList);

                DataSend = Object.assign({}, addDimension, addMetric)
                DataSend.event = 'ga_ecommerce';
                DataSend.event_name = E_step;
                DataSend.ecommerce = EcommerceData;
                dataLayer.push(DataSend);
                dataLayer.push({
                    'ecommerce': undefined,
                    'event_name': undefined,
                    'ep_ecommerce_section': undefined,
                    'ep_order_baroDreamType': undefined,
                    'ep_order_baroDreamPlace': undefined,
                    'ep_order_mainPayOption': undefined,
                    'ep_order_partnershipPointSave': undefined,
                    'ep_order_partnershipPointUse': undefined,
                    'ep_order_serviceFee': undefined,
                    'ep_order_giftPackingFee': undefined,
                    'ep_order_shippingInfo': undefined,
                    'ep_order_total': undefined,
                    'ep_order_bookTotal': undefined,
                    'ep_order_discount': undefined,
                    'ep_order_couponUsed': undefined,
                    'ep_order_pointUsed': undefined,
                    'ep_order_depositUsed': undefined,
                    'ep_order_cashUsed': undefined,
                    'ep_order_eBookcashUsed': undefined,
                    'ep_order_eticketUsed': undefined,
                    'ep_order_mileageUsed': undefined,
                    'ep_order_giftcardUsed': undefined,
                    'ep_order_partnershippointUse': undefined,
                    'ep_order_smilecashUsed': undefined,
                    'ep_order_pointReserve': undefined
                })
            }
        } catch (e) {
            console.log("APP 코드 시 ERROR")
        }
    }

    /**
     *
     *  Secure Hash Algorithm (SHA256)
     *  http://www.webtoolkit.info/
     *
     *  Original code by Angel Marin, Paul Johnston.
     *
     **/

    function SHA256(s) {
        var chrsz = 8;
        var hexcase = 0;

        function safe_add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        function S(X, n) {
            return (X >>> n) | (X << (32 - n));
        }

        function R(X, n) {
            return (X >>> n);
        }

        function Ch(x, y, z) {
            return ((x & y) ^ ((~x) & z));
        }

        function Maj(x, y, z) {
            return ((x & y) ^ (x & z) ^ (y & z));
        }

        function Sigma0256(x) {
            return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
        }

        function Sigma1256(x) {
            return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
        }

        function Gamma0256(x) {
            return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
        }

        function Gamma1256(x) {
            return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
        }

        function core_sha256(m, l) {

            var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1,
                0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
                0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786,
                0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
                0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147,
                0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
                0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B,
                0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
                0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A,
                0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
                0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);

            var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);

            var W = new Array(64);
            var a, b, c, d, e, f, g, h, i, j;
            var T1, T2;

            m[l >> 5] |= 0x80 << (24 - l % 32);
            m[((l + 64 >> 9) << 4) + 15] = l;

            for (var i = 0; i < m.length; i += 16) {
                a = HASH[0];
                b = HASH[1];
                c = HASH[2];
                d = HASH[3];
                e = HASH[4];
                f = HASH[5];
                g = HASH[6];
                h = HASH[7];

                for (var j = 0; j < 64; j++) {
                    if (j < 16) W[j] = m[j + i];
                    else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

                    T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                    T2 = safe_add(Sigma0256(a), Maj(a, b, c));

                    h = g;
                    g = f;
                    f = e;
                    e = safe_add(d, T1);
                    d = c;
                    c = b;
                    b = a;
                    a = safe_add(T1, T2);
                }

                HASH[0] = safe_add(a, HASH[0]);
                HASH[1] = safe_add(b, HASH[1]);
                HASH[2] = safe_add(c, HASH[2]);
                HASH[3] = safe_add(d, HASH[3]);
                HASH[4] = safe_add(e, HASH[4]);
                HASH[5] = safe_add(f, HASH[5]);
                HASH[6] = safe_add(g, HASH[6]);
                HASH[7] = safe_add(h, HASH[7]);
            }
            return HASH;
        }

        function str2binb(str) {
            var bin = Array();
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < str.length * chrsz; i += chrsz) {
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
            }
            return bin;
        }

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        }

        function binb2hex(binarray) {
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                    hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
            }
            return str;
        }

        s = Utf8Encode(s);
        return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
    }

    /**
     * JWT Payload 파싱
     * @param {string} token - JWT
     * @returns {string}
     */
    function parseToken(token) {
        // JWT payload 문자열 파싱
        let payload = token.split('.')
        if (payload.length < 2) return null
        payload = payload[1]
        // Base64 디코딩
        const decoded = decodeBase64(payload, 'json')
        const result = {}
        Object.keys(decoded).forEach(k => {
            const value = decoded[k]
            result[k] = value
        })
        return result
    }

    /**
     * Base64 문자열 디코딩
     * @see https://developer.mozilla.org/en-US/docs/Glossary/Base64#solution_1_%E2%80%93_escaping_the_string_before_encoding_it
     * @param {string} value - Base64 문자열
     * @param {'JSON'|'ARRAY'} [type] - JSON, ARRAY
     * @returns {string|string[]|JSON}
     */
    function decodeBase64(value, type) {
        value = replIncorrectTokenStr(value)
        let decoded
        try {
            decoded = decodeURIComponent(window.atob(value))
            return JSON.parse(decoded)
        } catch (err) {
            return value
        }
        return decoded
    }

    /**
     * token 값 base64 형식으로 변환
     * @param {string} base64String
     * @returns {string}
     */
    function replIncorrectTokenStr(base64String) {
        // console.log(base64String)
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/')
        return base64
    }

    // ======================== 1.20230118 함수 추가 ========================
// 1-1. 타임스탬프 함수
    function ep_test_hitTimestamp() {
        var now = new Date();
        var tzo = -now.getTimezoneOffset();
        var dif = tzo >= 0 ? '+' : '-';
        var pad = function(num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        };
        return now.getFullYear()
            + '-' + pad(now.getMonth()+1)
            + '-' + pad(now.getDate())
            + 'T' + pad(now.getHours())
            + ':' + pad(now.getMinutes())
            + ':' + pad(now.getSeconds())
            + pad(now.getMilliseconds())
            + dif + pad(tzo / 60)
            + ':' + pad(tzo % 60);
    }

// 1-2. GTM 초기화 함수
// 이전 데이터가 전송되는 것을 방지하기 위해 GTM 내 이벤트 매개변수를 초기화 시킵니다.
    function dataLayerUndefined() {
        var GTMSET = new Object();
        for (var value of dataLayer) {
            for (var key in value) {
                if(key.includes("ep_")) {
                    GTMSET[key] = undefined;
                }
            }
        }
        return dataLayer.push(GTMSET);
    }

// 1-3. 가상페이지뷰 전용 하이브리드 함수
// 핫트랙스 가상 페이지뷰 시 앱으로 전달할 때 사용되는 함수입니다.
    function VirHybrid(GADATA) {
        var emptyObject = Convert_Element2(GADATA);
        if (ga360.browserInfo.indexOf('HOTTRACKS') > -1 && document.location.hostname.includes('hottracks')) {
            if (ga360.browserInfo.indexOf('GA_Android_HOTTRACKS') > -1) window.hottracksgascriptAndroid.GA_DATA(JSON.stringify(emptyObject));
            else if (ga360.browserInfo.indexOf('GA_iOS_WK_HOTTRACKS') > -1) webkit.messageHandlers.hottracksgascriptCallbackHandler.postMessage(JSON.stringify(emptyObject));
        } else {
            if (ga360.browserInfo.indexOf('GA_Android') > -1) window.kyobogascriptAndroid.GA_DATA(JSON.stringify(emptyObject));
            else if (ga360.browserInfo.indexOf('GA_iOS_WK') > -1) webkit.messageHandlers.kyobogascriptCallbackHandler.postMessage(JSON.stringify(emptyObject));
        }
    }

// 1-4. 가상페이지뷰 함수
// 핫트랙스 가상 페이지뷰 시 호출합니다.
    function GA_Virtual(Object) {
        try {
            var GAData = Object;

            // safari 에서는 window.cookieStore 를 사용할수없어 수정
            const user = navigator.userAgent;
            if ((window.safari !== undefined) || (user.indexOf("iPhone") > -1) || (user.indexOf("iPad") > -1)) {
                GAData.ep_visit_channelOption = 'PC'

                if (ga360.browserInfo.indexOf("GA_Android") > -1 || ga360.browserInfo.indexOf("GA_iOS_WK") > -1) {
                    GAData.ep_visit_channelOption = 'APP'
                }

                GAData.ep_visit_siteOption = '교보문고'
                GAData.ep_page_fullUrl = window.location.href
                GAData.ep_page_noParameterUrl = window.location.origin + window.location.pathname
                GAData.title = window.document.title //'교보문고>웰컴>웰컴 메인'
                GAData.location = window.location.href // 'https://onk.ndev.kyobobook.co.kr/dd/ee'

                console.log('window.location.origin + window.location.pathname : ' + window.location.origin + window.location.pathname);

                if (pageDict[window.location.origin + window.location.pathname]) {
                    GAData.ep_test_DevProd = "운영";
                    GAData.title = pageDict[window.location.origin + window.location.pathname];
                } else if (pageDictDev[window.location.origin + window.location.pathname]) {
                    GAData.ep_test_DevProd = "개발";
                    GAData.title = pageDictDev[window.location.origin + window.location.pathname];
                }

                GAData.up_loginState = "N"

                if (document.cookie.split("accessToken=")[1]) {
                    var accessToken = document.cookie.split("accessToken=")[1].split(";")[0];
                    if (accessToken) {
                        var tokenJson = parseToken(accessToken)
                        var myname = tokenJson["username"]
                        var objuid = SHA256(myname)
                        GAData.up_uid = objuid
                        GAData.up_loginState = "Y"
                    }
                }
            } else {
                // 2022.10.25 쿠키를 가져오기 위해 로직을 then 안으로 수정
                GAData.ep_visit_channelOption = 'PC'

                let a = (navigator.userAgent || navigator.vendor || window.opera);
                if (ga360.browserInfo.indexOf("GA_Android") > -1 || ga360.browserInfo.indexOf("GA_iOS_WK") > -1) {
                    GAData.ep_visit_channelOption = 'APP'
                } else if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
                    GAData.ep_visit_channelOption = 'MOWEB'
                }

                GAData.ep_visit_siteOption = '교보문고'
                GAData.ep_page_fullUrl = window.location.href
                GAData.ep_page_noParameterUrl = window.location.origin + window.location.pathname
                GAData.title = window.document.title //'교보문고>웰컴>웰컴 메인'
                GAData.location = window.location.href // 'https://onk.ndev.kyobobook.co.kr/dd/ee'

                console.log('window.location.origin + window.location.pathname : ' + window.location.origin + window.location.pathname);

                if (pageDict[window.location.origin + window.location.pathname]) {
                    GAData.ep_test_DevProd = "운영";
                    GAData.title = pageDict[window.location.origin + window.location.pathname];
                } else if (pageDictDev[window.location.origin + window.location.pathname]) {
                    GAData.ep_test_DevProd = "개발";
                    GAData.title = pageDictDev[window.location.origin + window.location.pathname];
                }

                GAData.up_loginState = "N"

                if (document.cookie.split("accessToken=")[1]) {
                    var accessToken = document.cookie.split("accessToken=")[1].split(";")[0];
                    if (accessToken) {
                        var tokenJson = parseToken(accessToken)
                        var myname = tokenJson["username"]
                        var objuid = SHA256(myname)
                        GAData.up_uid = objuid
                        GAData.up_loginState = "Y"
                    }
                }
            }

            if (ga360.browserInfo.indexOf('GA_iOS_WK') > -1 || ga360.browserInfo.indexOf('GA_Android') > -1) {
                GAData.type = "P";
                GAData.ep_test_hitTimestamp = ep_test_hitTimestamp();
                GAData.ep_time_hour = ep_time_hour();
                GAData.ep_time_minute = ep_time_minute();
                // GAData.title = '' // 화면명
                // GAData.location = '' // URL
                VirHybrid(GAData);
            } else {
                GAData.event = 'ga_virtual';
                // GAData.title = '' // 화면명
                // GAData.location = '' // URL
                dataLayer.push(GAData);
                dataLayerUndefined();
            }
        } catch(e) {
            console.log("GA_Virtual 함수 ERROR");
            alert(e.toString())
        }
    }

    // ======================== 3. 수정 사항 없는 함수 ========================
// 3-1. 불필요 데이터 제거 함수
    function Convert_Element2(RemoveValue) {
        var return_Value = new Object();
        for (key in RemoveValue) {
            if(RemoveValue[key] === "" || RemoveValue[key] === undefined || RemoveValue[key] === null) {
                delete RemoveValue[key];
            }
        }
        return_Value = RemoveValue;
        return return_Value
    }

// 3-2. '시간' 추출 함수
    function ep_time_hour() {
        var now = new Date();
        var hours = ('0' + now.getHours()).slice(-2);
        return hours;
    }

// 3-3. '분' 추출 함수
    function ep_time_minute() {
        var now = new Date();
        var minutes = ('0' + now.getMinutes()).slice(-2);
        return minutes;
    }


    (function (a) {
        (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
    })(navigator.userAgent || navigator.vendor || window.opera);
    $.browser.isMobile = function () {
        let a = (navigator.userAgent || navigator.vendor || window.opera);
        return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
    }

    window.ga360 = {
        GA_Event: (event_name, ep_button_area, ep_button_area2, ep_button_name, ep_click_variable, ep_search_internalSearchWord) => {
            return GA_Event(event_name, ep_button_area, ep_button_area2, ep_button_name, ep_click_variable, ep_search_internalSearchWord)
        },
        EcommerceSet: (E_step, items, actionList, addDimension, addMetric) => {
            return EcommerceSet(E_step, items, actionList, addDimension, addMetric)
        },
        GA_Screen: (object) => {
            return GA_Screen(object)
        },
        parseToken: (token) => {
            return parseToken(token)
        },
        SHA256: (text) => {
            return SHA256(text)
        },
        GA_Virtual: (object) => {
            return GA_Virtual(object)
        }
    };
}())
