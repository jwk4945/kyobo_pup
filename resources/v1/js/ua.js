/*
* {
  "personalInformationAgreementFlag": false,
  "marketingConsentAgreementFlag": false,
  "marketingConsentAgreementSmsFlag": false,
  "marketingConsentAgreementEmailFlag": false,
  "eventFlag": false,
  "remainingPointsFlag": false
}
* */

let ua = {
    isLogined: false,
    device: {
        isMobile: true,
        isMobileApp: false,
        isIOS: true,
        isAndroid: false,
        isMSIE: false,
        isMac: false,
    },
    flag: {
        personalInformationAgreementFlag: false,
        marketingConsentAgreementFlag: false,
        marketingConsentAgreementSmsFlag: false,
        marketingConsentAgreementEmailFlag: false,
        eventFlag: false,
        remainingPointsFlag: false
    },
    changeLoginStatus: function(state) {
        this.isLogined = state;
    },
};


export default ua;