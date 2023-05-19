/**
 * [공통] 페이지 변수 정의 스크립트
 * 
 * apiKey, 
 */


/**
 * 공유하기
 * 
 * kakao, facebook, ... 
 */
const config = {
    kakao: {
      apiKey: {
        dev: '64a4eaa97d671ef76cb10a775fd56461',
        prod: '64a4eaa97d671ef76cb10a775fd56461'
      }
    },
    facebook: {
      apiKey: {
        dev: '',
        prod: ''
      }
    }
  };
  
  export { config };