
import ua from "./ua.js";


export const getIsLogin = async (accessToken) => {
    const url = `/journey/consent/is-login`;

    return await fetch(url, {
        method: 'GET',
        headers: {
            'accessToken': accessToken,
        }
    }).then(res => {
        if (!res.ok) {
            // throw new Error('로그인 되지 않음');
            console.log('로그인되지 않음');
            return false;
        }

        console.info('get isLogin API: ok ');
        return true;
    });
}

export const getAgreement = async (accessToken) => {
    const url = `/journey/consent/personal-information/agreement/${ua.bookstoreMemberNo}`;

    return await fetch(url, {
        method: 'GET',
        headers: {
            'accessToken': accessToken,
            'Content-type': 'application/json',
            // 'x-requested-with': 'XMLHttpRequest'
        },
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    }).then(res => {
        if (!res.ok) {
            throw new Error('agreement 실패');
        }
        console.info('get agreement API: ok');
        return res.json();
    })

}