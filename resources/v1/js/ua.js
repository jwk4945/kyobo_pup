
let ua = {
    contentsId: '',
    searchKeyword: '',
    searchKeywordD: '',
    userKey: '',
    isLogined: false,
    bookstoreMemberNo: '',
    isSmsEvent: 'N',
    smsEventType: '',
    isHeymama: 'N',
    isDonots: 'N',
    devices: {
        isMobile: false,
        isMobileApp: false,
        isIOS: false,
        isAndroid: false,
        isMSIE: false,
        isMac: false,
    },
    flag: {
        allFlag: 'N', // 프론트에서 자체 관리 flag (서버에 전달X)
        personalInformationAgreementFlag: 'N', // 제 3자 정보 제공동의
        marketingConsentAgreementFlag: 'N', // 마케팅 정보 제공동의
        marketingConsentAgreementSmsFlag: 'N', // 마케팅 정보 sms 동의
        marketingConsentAgreementEmailFlag: 'N', // 마케팅 정보 email 동의
        eventFlag: 'N', // 이벤트 기간 여부
        remainingPointsFlag: 'N' // 잔여 포인트 여부
    },
    setUserAgent: function(deviceName, deviceFlag) {
        if (this.devices.hasOwnProperty(deviceName)) {
            this.devices[deviceName] = deviceFlag;
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