
let ua = {
    isLogined: false,
    bookstoreMemberNo: '',
    device: {
        isMobile: false,
        isMobileApp: false,
        isIOS: false,
        isAndroid: false,
        isMSIE: false,
        isMac: false,
    },
    flag: {
        allFlag: false, // 프론트에서 자체 관리 flag (서버에 전달X)
        personalInformationAgreementFlag: false, // 제 3자 정보 제공동의
        marketingConsentAgreementFlag: false, // 마케팅 정보 제공동의
        marketingConsentAgreementSmsFlag: false, // 마케팅 정보 sms 동의
        marketingConsentAgreementEmailFlag: false, // 마케팅 정보 email 동의
        eventFlag: false, // 이벤트 기간 여부
        remainingPointsFlag: false // 포인트 정책 여부
    },
    setUserAgent: function(deviceName, deviceFlag) {
        if (this.flag.hasOwnProperty(deviceName)) {
            this.flag[deviceName] = deviceFlag;
        }
    },
    changeLoginStatus: function(state) {
        this.isLogined = state;
    },
    changeFlag: function(flagName, flagValue) {
        if (this.flag.hasOwnProperty(flagName)) {
            this.flag[flagName] = flagValue;
        } else {
            console.log(`flag : ${flagName}`);
        }
    },
};


export default ua;