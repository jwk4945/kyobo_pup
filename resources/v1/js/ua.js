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

    changeLoginStatus: function(state) {
        this.isLogined = state;
    }

};


export default ua;