/*
** 06/29 v2(확대오픈)
1	 자기개발 	        16B_011
2	 자녀_초중등 	       1B_067
3	 질병_척추/근골격계   4B_043
4	 일상생활_부부 	     8B_110
5	 건강관리_운동 외 	  7D_003
*
** 08/31 o1(정식오픈)
* 18B_023
* 9B_062
* 12G_108
* 14G_057
* 19G_142
*/
export default
[
    {
        contentsId: "",
        linkInfoForInsurance: {
            // 상품 링크 url
            url: "",
            // 상품명
            name: "",
            // 상품 이미지 url
            imgUrl: "",
            // 상품 설명
            explain: "",
            // 심의필
            certificationMsg: "",
            period: ""
        },
        gaParams: {
            // 매개변수1 : [ep_button_area] 자기개발_요즘20대들은모른다는문제_상세
            params1: "상세",
            // 매개변수2: [ep_button_area2] 상품페이지 이동
            params2: "상품페이지 이동",
            // 매개변수3: [ep_button_name] 배너선택
            params3: "배너선택",
            // 매개변수4: [ep_click_variable] "{{상품}}" 상품_(무)교보시작해요저축보험
            params4: "상품_",
        }
    },
    {
        contentsId: ["16B_011", "18B_023", "9B_062", "12G_108", "14G_057", "19G_142"],
        linkInfoForInsurance: {
            url: "https://www.kyobo.com/dgt/web/dtp/insurance-detail?isPdtCd=1000938&evcode=DCJ_MO",
            name: "교보1년저축보험(무배당)[D]",
            imgUrl: "/resources/v1/img/img-ci-pd.png",
            explain: "소액으로 차근차근 오늘부터 시작해요!",
            certificationMsg: "생명보험협회 심의필 제 2023-02901호",
            period: "(2023-07-04 ~ 2024-07-03)"
        },
        gaParams: {
            // 매개변수1 : [ep_button_area] 자기개발_요즘20대들은모른다는문제_상세
            params1: "자기개발_요즘20대들은모른다는문제_상세",
            // 매개변수2: [ep_button_area2] 상품페이지 이동
            params2: "상품페이지 이동",
            // 매개변수3: [ep_button_name] 배너선택
            params3: "배너선택",
            // 매개변수4: [ep_click_variable] "{{상품}}" 상품_(무)교보시작해요저축보험
            params4: "상품_교보1년저축보험(무배당)[D]",
        }
    },
    {
        contentsId: "1B_067",
        linkInfoForInsurance: {
            url: "http://www.kyobo.com/dgt/web/dtp/insurance-detail?isPdtCd=1000948&evcode=DCJ_MO",
            name: "(무)교보금쪽같은내아이보험(갱신형)Ⅱ(DM)",
            imgUrl: "/resources/v1/img/img-ci-pd.png",
            explain: "내 아이를 위한 금쪽같은 어린이 보험",
            certificationMsg: "생명보험협회 심의필 제 2022-05464호",
            period: '(2022-12-27 ~ 2023-12-26)'
        },
        gaParams: {
            // 매개변수1 : [ep_button_area] 자기개발_요즘20대들은모른다는문제_상세
            params1: "자녀_초중등_가스라이팅_상세",
            // 매개변수2: [ep_button_area2] 상품페이지 이동
            params2: "상품페이지 이동",
            // 매개변수3: [ep_button_name] 배너선택
            params3: "배너선택",
            // 매개변수4: [ep_click_variable] "{{상품}}" 상품_(무)교보시작해요저축보험
            params4: "상품_(무)교보금쪽같은내아이보험(갱신형)Ⅱ(DM)",
        }
    },
    {
        contentsId : "4B_043",
        linkInfoForInsurance: {
            url: 'http://www.kyobo.com/dgt/web/dtp/insurance-detail?isPdtCd=1000881&evcode=DCJ_MO',
            name: '(무)교보내맘쏙건강보험(DM)',
            imgUrl: '/resources/v1/img/img-ci-pd.png',
            explain: '부족한 보장을 꽉 채운 건강보험',
            certificationMsg: '생명보험협회 심의필 제 2022-05466호',
            period: "(2022-12-27 ~ 2023-12-26)"
        },
        gaParams: {
            // 매개변수1 : [ep_button_area] 자기개발_요즘20대들은모른다는문제_상세
            params1: "질병_척추근골격계_버섯목증후군_상세",
            // 매개변수2: [ep_button_area2] 상품페이지 이동
            params2: "상품페이지 이동",
            // 매개변수3: [ep_button_name] 배너선택
            params3: "배너선택",
            // 매개변수4: [ep_click_variable] "{{상품}}" 상품_(무)교보시작해요저축보험
            params4: "상품_(무)교보내맘쏙건강보험(DM)",
        }
    },
    {
        contentsId : "8B_110",
        linkInfoForInsurance: {
            url: 'http://www.kyobo.com/dgt/web/dtp/insurance-detail?isPdtCd=1000710&evcode=DCJ_MO',
            name: '(무)교보하나로케어종신보험Ⅱ(보증비용부과형)',
            imgUrl: '/resources/v1/img/img-ci-pd.png',
            explain: '평생 보장에 연금전환까지 하나로 OK!',
            certificationMsg: '생명보험협회 심의필 제 2023-02863호',
            period: "(2023-06-27 ~ 2024-06-26)"
        },
        gaParams: {
            // 매개변수1 : [ep_button_area] 자기개발_요즘20대들은모른다는문제_상세
            params1: "일상생활_부부_외벌이_상세",
            // 매개변수2: [ep_button_area2] 상품페이지 이동
            params2: "상품페이지 이동",
            // 매개변수3: [ep_button_name] 배너선택
            params3: "배너선택",
            // 매개변수4: [ep_click_variable] "{{상품}}" 상품_(무)교보시작해요저축보험
            params4: "상품_(무)교보하나로케어종신보험Ⅱ(보증비용부과형)",
        }
    },
    {
        contentsId : "7D_003",
        linkInfoForInsurance: {
            url: 'http://www.kyobo.com/dgt/web/dtp/insurance-detail?isPdtCd=1000898&evcode=DCJ_MO',
            name: '(무)교보간편해요건강보험(DM)',
            imgUrl: '/resources/v1/img/img-ci-pd.png',
            explain: '꼭 필요한 보장만으로 보험가입 OK!',
            certificationMsg: '생명보험협회 심의필 제 2023-02760호',
            period: "(2023-06-27 ~ 2024-06-26)"
        },
        gaParams: {
            // 매개변수1 : [ep_button_area] 자기개발_요즘20대들은모른다는문제_상세
            params1: "건강관리_운동외_건강검진_상세",
            // 매개변수2: [ep_button_area2] 상품페이지 이동
            params2: "상품페이지 이동",
            // 매개변수3: [ep_button_name] 배너선택
            params3: "배너선택",
            // 매개변수4: [ep_click_variable] "{{상품}}" 상품_(무)교보시작해요저축보험
            params4: "상품_(무)교보간편해요건강보험(DM)",
        }
    }
    /************************************ 기존 콘텐츠 ************************************/
    ,
    {
        contentsId : "2B_061",
        linkInfoForInsurance: {
            url: 'https://www.kyobo.com/dgt/web/dtp/insurance-detail?isPdtCd=1000938&evcode=DCJ_MO',
            name: '교보1년저축보험(무배당)[D]',
            imgUrl: '/resources/v1/img/img-ci-pd.png',
            explain: '소액으로 차근차근 오늘부터 시작해요!',
            certificationMsg: '생명보험협회 심의필 제 2023-02901호',
            period: "(2023-07-04 ~ 2024-07-03)"
        },
        gaParams: {
            // 매개변수1 : [ep_button_area] 자기개발_요즘20대들은모른다는문제_상세
            params1: "자산관리_재테크_스노우볼효과_상세",
            // 매개변수2: [ep_button_area2] 상품페이지 이동
            params2: "상품페이지 이동",
            // 매개변수3: [ep_button_name] 배너선택
            params3: "배너선택",
            // 매개변수4: [ep_click_variable] "{{상품}}" 상품_(무)교보시작해요저축보험
            params4: "상품_교보1년저축보험(무배당)[D]",
        }
    },
    {
        contentsId : "3C_033",
        linkInfoForInsurance: {
            url: 'http://www.kyobo.com/dgt/web/dtp/insurance-detail?isPdtCd=1000948&evcode=DCJ_MO',
            name: '(무)교보금쪽같은내아이보험(갱신형)Ⅱ(DM)',
            imgUrl: '/resources/v1/img/img-ci-pd.png',
            explain: '내 아이를 위한 금쪽같은 어린이 보험',
            certificationMsg: '생명보험협회 심의필 제 2022-05464호',
            period: "(2022-12-27 ~ 2023-12-26)"
        },
        gaParams: {
            // 매개변수1 : [ep_button_area] 자기개발_요즘20대들은모른다는문제_상세
            params1: "자녀_아동_유치원_상세",
            // 매개변수2: [ep_button_area2] 상품페이지 이동
            params2: "상품페이지 이동",
            // 매개변수3: [ep_button_name] 배너선택
            params3: "배너선택",
            // 매개변수4: [ep_click_variable] "{{상품}}" 상품_(무)교보시작해요저축보험
            params4: "상품_(무)교보금쪽같은내아이보험(갱신형)Ⅱ(DM)",
        }
    },
    {
        contentsId : "6G_054",
        linkInfoForInsurance: {
            url: 'http://www.kyobo.com/dgt/web/dtp/insurance-detail?isPdtCd=1000948&evcode=DCJ_MO',
            name: '(무)교보금쪽같은내아이보험(갱신형)Ⅱ(DM)',
            imgUrl: '/resources/v1/img/img-ci-pd.png',
            explain: '내 아이를 위한 금쪽같은 어린이 보험',
            certificationMsg: '생명보험협회 심의필 제 2022-05464호',
            period: "(2022-12-27 ~ 2023-12-26)"
        },
        gaParams: {
            // 매개변수1 : [ep_button_area] 자기개발_요즘20대들은모른다는문제_상세
            params1: "자녀_태아&신생아_임신검사_상세",
            // 매개변수2: [ep_button_area2] 상품페이지 이동
            params2: "상품페이지 이동",
            // 매개변수3: [ep_button_name] 배너선택
            params3: "배너선택",
            // 매개변수4: [ep_click_variable] "{{상품}}" 상품_(무)교보시작해요저축보험
            params4: "상품_(무)교보금쪽같은내아이보험(갱신형)Ⅱ(DM)",
        }
    },
    {
        contentsId : "13G_045",
        linkInfoForInsurance: {
            url: 'http://www.kyobo.com/dgt/web/dtp/insurance-detail?isPdtCd=1000881&evcode=DCJ_MO',
            name: '(무)교보내맘쏙건강보험(DM)',
            imgUrl: '/resources/v1/img/img-ci-pd.png',
            explain: '부족한 보장을 꽉 채운 건강보험',
            certificationMsg: '생명보험협회 심의필 제 2022-05466호',
            period: "(2022-12-27 ~ 2023-12-26)"
        },
        gaParams: {
            // 매개변수1 : [ep_button_area] 자기개발_요즘20대들은모른다는문제_상세
            params1: "질병_당뇨_식단_상세",
            // 매개변수2: [ep_button_area2] 상품페이지 이동
            params2: "상품페이지 이동",
            // 매개변수3: [ep_button_name] 배너선택
            params3: "배너선택",
            // 매개변수4: [ep_click_variable] "{{상품}}" 상품_(무)교보시작해요저축보험
            params4: "상품_(무)교보내맘쏙건강보험(DM)",
        }
    },
    {
        contentsId : "5B_041",
        linkInfoForInsurance: {
            url: 'http://www.kyobo.com/dgt/web/dtp/insurance-detail?isPdtCd=1000881&evcode=DCJ_MO',
            name: '(무)교보내맘쏙건강보험(DM)',
            imgUrl: '/resources/v1/img/img-ci-pd.png',
            explain: '부족한 보장을 꽉 채운 건강보험',
            certificationMsg: '생명보험협회 심의필 제 2022-05466호',
            period: "(2022-12-27 ~ 2023-12-26)"
        },
        gaParams: {
            // 매개변수1 : [ep_button_area] 자기개발_요즘20대들은모른다는문제_상세
            params1: "건강관리_운동_바디프로필_상세",
            // 매개변수2: [ep_button_area2] 상품페이지 이동
            params2: "상품페이지 이동",
            // 매개변수3: [ep_button_name] 배너선택
            params3: "배너선택",
            // 매개변수4: [ep_click_variable] "{{상품}}" 상품_(무)교보시작해요저축보험
            params4: "상품_(무)교보내맘쏙건강보험(DM)",
        }
    }
]