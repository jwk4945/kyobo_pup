

export let info = {};
export let affInfo = {};

export function setInfo(newInfo) {
    Object.assign(info, newInfo);
}

export function setAffInfo(newInfo) {
    Object.assign(affInfo, newInfo);
}