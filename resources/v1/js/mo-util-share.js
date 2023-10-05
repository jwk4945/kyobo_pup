
import globalConfig from "./config.js";
import ua from "./ua.js";


export function handleShareButtonClick(event, url) {
    if (event.target.parentElement.id === 'ka-share-btn') {
        shareKakao(url);
    } else if (event.target.parentElement.id === 'fb-share-btn') {
        shareFacebook(url);
    } else if (event.target.parentElement.id === 'msg-share-btn') {
        // event.preventDefault();
        shareSms(url);
    } else if (event.target.innerHTML === 'URL 복사') {
        navigator.clipboard.writeText(url);
    } else if (event.target.parentElement.id === 'more-share-btn') {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'test text',
                url: url,
            })
                .then(() => console.log('Successful share'))
                .catch((err) => console.log(err));
        } else {
            console.log('Web Share API not supported');
        }
    }
}


const shareKakao = (shareUrl) => {

    Kakao.init( globalConfig.kakao.apiKey.prod );

    const title = document.title;
    const desc = document.querySelector("meta[property='og:description']").getAttribute("content");
    const imageUrl = document.querySelector("meta[property='og:image']").getAttribute("content");

    Kakao.Share.sendDefault({
        // container: '#ka-share-btn',
        objectType: 'feed',
        content: {
            title: title,
            description: desc,
            imageUrl: imageUrl,
            link: {
                // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
            },
        },
        buttons: [
            {
                title: '모바일 교보문고',
                link: {
                    mobileWebUrl: shareUrl,
                    webUrl: shareUrl,
                },
            },
        ],
    });
}

const shareFacebook = (shareUrl) => {
    // window.open("https://www.facebook.com/sharer/sharer.php?u=" + shareUrl);
    // window.open("http://www.facebook.com/share.php?u=" + shareUrl);
    const message = {
        "exec" : {
            "method": "outLink",
            "params": {
                "url": "https://www.facebook.com/sharer/sharer.php?u=" + shareUrl
            },
            "callback": ""
        }
    };

    if (window.webkit && window.webkit.messageHandlers ) {
        window.webkit.messageHandlers.callNative.postMessage(message);
    } else {
        window.open("https://www.facebook.com/sharer/sharer.php?u=" + shareUrl);
    }
}


const shareSms = (shareUrl) => {
    location.href = (ua.device.isAndroid ? "sms:?body=" : "sms:&body=") + shareUrl;
}
