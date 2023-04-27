import { Calculation } from "./open_CustomerJourneyUtils.js";


export const AnimationManager = (function (){

    let idxForTriggerElem = 1;
    let _100vh = document.documentElement.clientHeight;
    let onScrollAnimationInfos = [];
    let animationElements = {};
    let customFunctionList = [];

    let calculation = new Calculation();
    let playEndTime = Date.now();
    let tmp=0;

    const callbackScrollProcessor = ()=>onScrollProcessor(true);

   function loadElementsToAnimate(onScroll){
      const aniElems = [...document.querySelectorAll('*')].filter(elem=>{
         return elem.getAttributeNames().filter(attr=>attr.indexOf('data-animation')>-1)
             .length>0;
      });

      const aniOnLoadElems = aniElems.filter(elem=>
          elem.dataset.animationType !== undefined
         && elem.dataset.animationType.toLowerCase() === 'onload');
      const aniOnScrollElems = aniElems.filter(elem=>
          elem.dataset.animationType !== undefined
          && elem.dataset.animationType.toLowerCase() === 'onscroll');

      initCustomFunctions();
      setElemsAniOnLoad(aniOnLoadElems);
      setElemsAniOnScroll(aniOnScrollElems);
   }

   function setElemsAniOnLoad(elems) {
       if(elems===undefined){
           elems = [...document.querySelectorAll('*')].filter(elem=>
               elem.getAttributeNames().filter(attr=>attr.toLowerCase().indexOf('data-animation-type')>-1).length>0
               && elem.dataset.animationType==='onload'
           );
       }
       if(customFunctionList.length===0)
           initCustomFunctions();

       reserveAnimation(elems);
   }

   function setElemsAniOnScroll(elems){
       onScrollAnimationInfos=[];
       if(elems===undefined){
           animationElements={};
           elems = [...document.querySelectorAll('*')].filter(elem=>
               elem.getAttributeNames().filter(attr=>attr.toLowerCase().indexOf('data-animation-type')>-1).length>0
               && elem.dataset.animationType==='onscroll'
           );
       }
       if(customFunctionList.length===0)
           initCustomFunctions();

       elems.forEach(elem=>{
           let animationInfos = extractAnimationInfos(elem);
           for(let animationInfo of animationInfos) {
               onScrollAnimationInfos.push(animationInfo);

               if (animationInfo.stylePropsBefore !== undefined)
                   animationInfo.stylePropsBefore.applyStyles();

               if(animationInfo.stylePropsAfter !== undefined
               && animationInfo.isTriggered() && animationInfo.getProgress()===1)
                   animationInfo.stylePropsAfter.applyStyles();
           }
       });

       window.removeEventListener('scroll',callbackScrollProcessor);
       window.addEventListener('scroll',callbackScrollProcessor);
       onScrollProcessor(false);
       history.scrollRestoration='manual';
   }

   function setElemsAniOnResult(elems){
       if(elems===undefined){
           elems = [...document.querySelectorAll('*')].filter(elem=>
               elem.getAttributeNames().filter(attr=>attr.toLowerCase().indexOf('data-animation-type')>-1).length>0
               && elem.dataset.animationType==='onresult'
           );
       }
       if(customFunctionList.length===0)
           initCustomFunctions();

       elems.forEach(elem=> {
           elem.style.transitionProperty = '';
           elem.style.transitionDuration = '';
       })
       reserveAnimation(elems);
   }

   function reserveAnimation(elems){
       elems.forEach(elem=>{
           let animationInfos = extractAnimationInfos(elem);
           for(let animationInfo of animationInfos) {
               if (animationInfo.stylePropsBefore !== undefined)
                   animationInfo.stylePropsBefore.applyStyles();

               setTimeout(() => {
                   elem.style.transitionDuration = animationInfo.transitionDuration;
                   elem.style.transitionProperty = animationInfo.props.filter(e => e != null && e.trim() !== '').toString();

                   if (animationInfo.stylePropsAfter !== undefined)
                       animationInfo.stylePropsAfter.applyStyles();
                   if (animationInfo.addClassNm !== undefined)
                       elem.classList.add(animationInfo.addClassNm);
                   if (animationInfo.removeClassNm !== undefined)
                       elem.classList.remove(animationInfo.removeClassNm);
               }, animationInfo.startMs);
           }
       });
   }

   function onScrollProcessor(bLoop){
       if(Date.now()>playEndTime)
           playEndTime = Date.now() + 1000;

       onScrollAnimationInfos.filter(e=>e.isInPlayingArea()).forEach(animationsInfo=>{
           if(animationsInfo.stylePropsAfter!==undefined){
               animationsInfo.stylePropsAfter.props.forEach(prop => {
                   const calcValue = getAnimatedDigitValue(animationsInfo, prop, animationsInfo.getProgress());
                   const styleStr = animationsInfo.stylePropsAfter[prop].propNmPreFix
                       + calcValue
                       + animationsInfo.stylePropsAfter[prop].propNmSuffix;

                   //동일한 엘레먼트에서 중복된 애니메이션 속성이 이미 적용된 경우 이어붙이기
                   if(isDuplicatedProp(prop, animationsInfo))
                       animationsInfo.targetElement.style[prop] = animationsInfo.targetElement.style[prop]+styleStr;
                   else
                       animationsInfo.targetElement.style[prop] = styleStr;
               });
           }
       });
       if(bLoop && Date.now()<playEndTime)
           requestAnimationFrame(()=>onScrollProcessor(true));


       function getAnimatedDigitValue(animationsInfo, propNm, progress){
           const {stylePropsBefore, stylePropsAfter} = animationsInfo;
           const stylePropBefore = stylePropsBefore[propNm];
           const stylePropAfter = stylePropsAfter[propNm];
           if(stylePropAfter.hexColor!==undefined){
               let clone = {...stylePropBefore.hexColor};
               clone.red = Math.round(calculate(stylePropBefore.hexColor.red, stylePropAfter.hexColor.red, progress));
               clone.green = Math.round(calculate(stylePropBefore.hexColor.green, stylePropAfter.hexColor.green, progress));
               clone.blue = Math.round(calculate(stylePropBefore.hexColor.blue, stylePropAfter.hexColor.blue, progress));
               return clone.toHexString();
           }else{
               return calculate(stylePropBefore.propDigitValue, stylePropAfter.propDigitValue, progress);
           }
       }

       function calculate(fromValue, toValue, progress){
           return Math.round((fromValue + (toValue - fromValue) * progress) * 100) / 100;
       }

       function isDuplicatedProp(prop, animationsInfo){
           if(animationElements[animationsInfo.elementId].length===1)
               return false;
           const currIdx = animationElements[animationsInfo.elementId].findIndex(info=>info===animationsInfo);
           //현재 animationInfo 의 인덱스보다 이전 animationInfo가 존재하면서,
           //동일한 prop을 가진 경우 중복 prop임
           return animationElements[animationsInfo.elementId].filter(
               (info, idx) => idx < currIdx && info.props.filter(p => p === prop).length > 0
           ).length > 0;
       }
   }
    let isExecuting = false;
    function testOuter(animationInfos, progress, targetElement){

        let testInner = function() {
            isExecuting = true;
            onScrollProcessor();
            isExecuting = false;
        }

        if(isExecuting)
            return;
        requestAnimationFrame(testInner);
    }

   function extractAnimationInfos(elem){
    //    console.log(elem.dataset);
       const animationType = elem.dataset.animationType.toLowerCase();
       const infos = getAniInfosFromString(elem.dataset.animationInfos);
       let result=[];
       for(let info of infos) {
           let {
               'style-bf-ani': styleStrBefore, 'style-af-ani': styleStrAfter,
               'start-ms': startMs,
               'transition-duration': transitionDuration = '0.3s', 'transition-props': props,
               'add-class-nm': addClassNm, 'remove-class-nm': removeClassNm,
               'trigger-element': triggerElement, 'trigger-hook': triggerHook = 0.85,
               'onscroll-declared-animation-types': onScrollDeclaredAnimationTypes,
               'scroll-duration': scrollDuration = 200
           } = info;

           let stylePropsBefore = convertStyleStr2Obj(styleStrBefore, elem);
           let stylePropsAfter = convertStyleStr2Obj(styleStrAfter, elem);
           props = (props || '').replace(/[\'\"\[\]]/g, '').split(',');

           if (stylePropsAfter !== undefined) {
               props = [...props, ...stylePropsAfter.props
                   .map(e => stylePropsAfter[e].kebabCasePropNm)
                   .filter(e => !props.includes(e))];
           }

           if(elem.dataset.elementId===undefined) {
               elem.dataset.elementId = `scrollAnimationElem#${idxForTriggerElem}`;
               idxForTriggerElem++;
           }
           if (triggerElement === undefined)
               triggerElement = `[data-element-id='${elem.dataset.elementId}']`;

           const obj= {targetElement:elem
               , animationType
               , elementId : elem.dataset.elementId
               , stylePropsBefore
               , stylePropsAfter
               , startMs
               , transitionDuration
               , props: props.filter(e => e != null && e.trim() !== '')
               , addClassNm
               , removeClassNm
               , triggerElement
               , triggerHook
               , getBoundingClientRect(){
                    return this.targetElement.getBoundingClientRect();
               }
               , isTriggered(targetRect) {
                   targetRect = targetRect || this.getBoundingClientRect();
                   return _100vh*this.triggerHook > targetRect.top;
               }
               , isInPlayingArea() {
                    const targetRect = this.getBoundingClientRect();
                   return 0 <= targetRect.top && _100vh >= targetRect.top;
               }
               , getProgress() {
                   let progress = 0;
                   const targetRect = this.getBoundingClientRect();
                   if(!this.isTriggered(targetRect))
                       return progress;

                   const curr = targetRect.top;
                   const target = _100vh*triggerHook-this.scrollDuration;
                   return Math.min(1 + Math.round((target-curr)/scrollDuration*100)/100,1);
               }
               , triggerElementOffsetTop(){
                   let sumHeight = 0;
                   let elem = this.targetElement;

                   do{
                       sumHeight += elem.offsetTop;
                       elem = elem.offsetParent;
                   }while(elem!==null)

                   return sumHeight;
               }
               , onScrollDeclaredAnimationTypes : onScrollDeclaredAnimationTypes===undefined? undefined :
                   onScrollDeclaredAnimationTypes.split(';').map(str=>{
                       const prop = str.replace(/[\'\"\[\]]/g,'').split(':');
                       return {aniType : prop[0].trim()
                           , aniValues : prop[1].split(',').map(e=>e.trim())};
                   })
               , scrollDuration : Number(scrollDuration)
               , staticPositionLeft : Math.ceil(elem.getBoundingClientRect().x)
           };

           let aniInfos = animationElements[elem.dataset.elementId] || [];
           aniInfos.push(obj);
           animationElements[elem.dataset.elementId] = aniInfos;

           result.push(obj);
       }

       return result;


       function getAniInfosFromString(orgStr){
           let result=[];
           let animationInfoString = orgStr.replace(/\n/g,'');
           if(animationInfoString.match(/^\s*{.+}\s*$/)===null)
               animationInfoString = '{'+animationInfoString.trim()+'}';

           animationInfoString.match(/{.*?}/g).forEach(aniStr=> {
               let strings = aniStr.replace(/[{}]/g, '').match(/[^,\s]+?:\s*[\'\"].+?[\'\"]/g);
               let aniObj = {};

               strings.forEach(str => {
                   if (str === null || str.trim() === '')
                       return;
                   str = str.trim();
                   let propNm = str.match(/(.+?):/)[1];
                   let propValue = str.match(/:(.+)/)[1].replace(/[\'\"]/g, '').trim();
                   aniObj[propNm] = propValue;
               });

               if(Object.keys(aniObj).length>0)
                   result.push(aniObj);
           })
           return result;
       }
   }

   function convertStyleStr2Obj(styleStr, targetElement){
       if(styleStr === undefined)
           return undefined;

       let returnObj={props:[]};
       styleStr.replace(/[\'\"\[\]]/g,'').split(';').filter(str=>str.trim()!=='').forEach(stylePropStr=>{
           let [kebabCasePropNm, propValue] = stylePropStr.trim().split(':');
           let camelCasePropNm = kebabCasePropNm.replace(/-./g,a=>a.toUpperCase()).replace(/-/g,'');
           returnObj[camelCasePropNm] = {kebabCasePropNm:undefined, propValue:undefined
               , propDigitValue:undefined, propNmPreFix: undefined, propNmSuffix: undefined};
           returnObj[camelCasePropNm].kebabCasePropNm = kebabCasePropNm;
           propValue = convertFunctionValue(propValue,targetElement);
           returnObj[camelCasePropNm].propValue = propValue;

           const hexColor = propValue.match(/\#[a-zA-Z0-9]{6}(?=\s*)/);
           if(hexColor!==null){
               const hex = hexColor[0].replace("#",'');
               returnObj[camelCasePropNm].hexColor = {
                   red: (parseInt(hex,16)>>16) & 255
                   , green: (parseInt(hex,16)>>8) & 255
                   , blue: parseInt(hex,16) & 255
                   , toHexString() {
                       let str = '#';
                       str += this.red.toString(16);
                       str += this.green.toString(16);
                       str += this.blue.toString(16);
                       return str;
                   }
               }
               returnObj[camelCasePropNm].propNmPreFix='';
               returnObj[camelCasePropNm].propNmSuffix='';
           }else {
               const propPieces = propValue.match(/^(\D*?(?=-?\d))(-?[\d\.]*)(\D*)$/);
               if (propPieces !== null) {
                   returnObj[camelCasePropNm].propNmPreFix = propPieces[1];
                   returnObj[camelCasePropNm].propDigitValue = propPieces[2] !== '' ? Number(propPieces[2]) : '';
                   returnObj[camelCasePropNm].propNmSuffix = propPieces[3];
               }
           }

           returnObj[camelCasePropNm].toString = ()=>`${kebabCasePropNm}:${propValue};`;
           returnObj.props.push(camelCasePropNm);
       });
       returnObj.toString=function() {
           let printStr='';
           for(let propNm in this){
               printStr += this[propNm].toString();
           }
           return printStr;
       };
       returnObj.applyStyles=function(){
           this.props.forEach(camelCaseProp=> {
               const kebabCaseProp = camelCaseProp.replace(/[a-z][A-Z]/g,str=>str.charAt(0)+'-'+str.charAt(1).toLowerCase());
               const infoIdx = animationElements[targetElement.dataset.elementId]
                   .findIndex(aniInfo=>aniInfo.stylePropsBefore===this||aniInfo.stylePropsAfter===this);
               if(animationElements[targetElement.dataset.elementId].filter((info,idx)=>
                   idx<infoIdx &&
                   info.props.filter(prop=>prop===kebabCaseProp).length>0).length>0)
                   targetElement.style[camelCaseProp] = targetElement.style[camelCaseProp] + returnObj[camelCaseProp].propValue;
               else
                   targetElement.style[camelCaseProp] = returnObj[camelCaseProp].propValue;
           });
       }
       return returnObj;
   }

   function get100VhSize(){
       const div = document.createElement('div');
       div.style.height='100vh';
       div.style.position='fixed';

       document.querySelector('body').appendChild(div);
       const _100vh = div.clientHeight;
       div.remove();
       return _100vh;
   }

   function getOffsetTop(){
       let sumHeight = 0;
       let elem = this.targetElement;

       do{
           sumHeight += elem.offsetTop;
           elem = elem.offsetParent;
       }while(elem!==null)

       return sumHeight;
   }

   function initCustomFunctions(){
       customFunctionList = [
           {
               functionNm : 'getBrightnessAdjustedBgColor',
               functionRegex : /getBrightnessAdjustedBgColor\s*\(\s*[\d\.]+\s*\)/,
               getValue(str) {
                   const bgColor = getBackgroundColor();
                   const percent = Number(str.match(/[\d\.]+/));
                   const colorInfo = adjustBrightnessOfColor(bgColor.red, bgColor.green, bgColor.blue,percent);
                   return '#'+colorInfo.red.toString(16)+colorInfo.green.toString(16)+colorInfo.blue.toString(16);
               }
           },
           {
               functionNm : 'getOffsetLeftFromParent',
               functionRegex : /getOffsetLeftFromParent\s*\(.*\)/,
               getValue(str, targetElement) {
                   const offset = targetElement.offsetLeft - targetElement.parentElement.offsetLeft;
                   const suffix = str.match(/\([\s\'\"]*(.+?)[\s\'\"]*\)/);
                   return offset + (suffix!==null&&suffix.length>1? suffix[1]:'');
               }
           },
           {
               functionNm : 'getOffsetRightFromParent',
               functionRegex : /getOffsetRightFromParent\s*\(.*\)/,
               getValue(str, targetElement){
                   const offset = targetElement.parentElement.clientWidth - targetElement.offsetWidth;
                   const suffix = str.match(/\([\s\'\"]*(.+?)[\s\'\"]*\)/);
                   return offset + (suffix!==null&&suffix.length>1? suffix[1]:'');
               }
           },
           {
               /**
                * getOffsetFromLeftEdge
                * 스크린 왼쪽부터 요소의 왼쪽 면까지의 거리 계산
                * param1 : 접미어(단위)
                * param2 : 추가계산식
                */
               functionNm : 'getOffsetFromLeftEdge',
               functionRegex : /getOffsetFromLeftEdge\s*\(.*\)/,
               getValue(str, targetElement) {
                   const offset = targetElement.offsetLeft;
                   let params;
                   if(str.match(/getOffsetFromLeftEdge\((.*?)\)/)!==null)
                       params = str.match(/getOffsetFromLeftEdge\((.*?)\)/).map(str=>str.trim());
                   let suffix;
                   let formula;
                   if(params!==undefined && params[1]!==''){
                       params = params[1].replace(/[\"\']/g,'').split(',').map(str=>str.trim());
                       if(params.length>=1)
                           suffix = params[0];
                       if(params.length>=2)
                           formula=params[1];
                   }
                   let result = formula===undefined? offset : calculation.calculate(offset+formula);
                   result += (suffix===undefined? '':suffix);
                   return result;
               }
           },
           {
               /**
                * getOffsetFromRightEdge
                * 스크린 왼쪽부터 요소의 왼쪽 면까지의 거리 계산
                * param1 : 접미어(단위)
                * param2 : 추가계산식
                */
               functionNm : 'getOffsetFromRightEdge',
               functionRegex : /getOffsetFromRightEdge\s*\(.*\)/,
               getValue(str, targetElement) {
                   const offset = document.body.clientWidth - targetElement.clientWidth - targetElement.offsetLeft;
                   let params;
                   if(str.match(/getOffsetFromRightEdge\((.*?)\)/)!==null)
                       params = str.match(/getOffsetFromRightEdge\((.*?)\)/).map(str=>str.trim());
                   let suffix;
                   let formula;
                   if(params!==undefined && params[1]!==''){
                       params = params[1].replace(/[\"\']/g,'').split(',').map(str=>str.trim());
                       if(params.length>=1)
                           suffix = params[0];
                       if(params.length>=2)
                           formula=params[1];
                   }
                   let result = formula===undefined? offset : calculation.calculate(offset+formula);
                   result += (suffix===undefined? '':suffix);
                   return result;
               }
           },
           {
               functionNm: 'calcRatioOfScreenHeight',
               functionRegex : /calcRatioOfScreenHeight\s*\(.+\)/,
               getValue(str, targetElement) {
                   let param;
                   if(str.match(/calcRatioOfScreenHeight\((.*?)\)/)!==null)
                       param = parseFloat(str.match(/calcRatioOfScreenHeight\((.*?)\)/)[1]);

                   return _100vh*param;
               }
           }
       ];
   }

   function set100vh(new100vh){
        _100vh = new100vh;
   }

   function convertFunctionValue(str, targetElement){
       const declaredFunction = customFunctionList.find(f=>str.match(f.functionRegex));
       return declaredFunction===undefined? str : declaredFunction.getValue(str, targetElement);
   }

   function getBackgroundColor(){
       const bgColorStr = window.getComputedStyle(document.body).getPropertyValue('background-color');
       const bgColorArr = bgColorStr.match(/\d+/g).map(e=>Number(e));
       return {red: bgColorArr[0], green: bgColorArr[1], blue: bgColorArr[2]}
   }

   function adjustBrightnessOfColor(r, g, b, percent){
       return {red: Math.round(r*percent), green: Math.round(g*percent), blue: Math.round(b*percent)};
   }

   function addEventToStars(){
       const emptyStars = [...document.querySelectorAll('#star-points-box>.empty-star')];
       const halfFilledStars = [...document.querySelectorAll('#star-points-box>.half-filled-star')];
       const filledStars = [...document.querySelectorAll('#star-points-box>.filled-star')];
       const allStars = [...emptyStars, ...halfFilledStars, ...filledStars];

       allStars.forEach(star=>star.addEventListener('click', event=>{
           let idx = emptyStars.findIndex(e=>e===star);
           idx = idx===-1? halfFilledStars.findIndex(e=>e===star) : idx;
           idx = idx===-1? filledStars.findIndex(e=>e===star) : idx;

           let isHalf = false;
           isHalf = event.offsetX <= star.clientWidth / 2;

           for(let i=0; i<emptyStars.length; i++){
               emptyStars[i].classList.add('display-none');
               halfFilledStars[i].classList.add('display-none');
               filledStars[i].classList.remove('display-none');

               if(i>=idx){
                   filledStars[i].classList.add('display-none');
                   if(i===idx){
                       if(isHalf)
                           halfFilledStars[i].classList.remove('display-none');
                       else
                           filledStars[i].classList.remove('display-none');
                   }
                   else
                       emptyStars[i].classList.remove('display-none');
               }
           }

           const form = document.querySelector('form.visibility-hidden');
           if(form.classList.contains('visibility-hidden'))
            document.querySelector('form.visibility-hidden').classList.remove('visibility-hidden');
       }));
   }

   function addEventToTextArea(){
       const btn = document.querySelector('form button[type="submit"]');
       document.querySelector('#userComment').addEventListener('keyup',e=>{
           if(e.target.value.trim()==='')
               btn.disabled = true;
           else if(btn.disabled)
               btn.disabled = false;
       })
   }

    /**
     * 이미지슬라이드 넓이에 맞게 이미지를 반복 생성하는 함수
     *
     * @param selector          css 선택자 구문
     * @param isRandomSlides    이미지 생성의 random 출력 여부
     */
   function createImageSlides(selector='.image-slide-zone', isRandomSlides=true){
       let imageSlide = document.querySelector(selector);
       if (imageSlide!==null) {
           let images = imageSlide.querySelectorAll('img');
           if(images.length>0) {
               const targetWidth = imageSlide.clientWidth;
               let sumWidth = 0;
               let lastImgWidth;
               let widths = [];
               const documentFragment = new DocumentFragment();

               // 이미지를 이어붙인 넓이가 이미지슬라이드 넓이를 초과할 때까지 반복
               while (sumWidth <= targetWidth) {
                   let idxArr = [];

                   for (let i = 0; i < images.length; i++)
                       idxArr.push(i);

                   if (isRandomSlides) //랜덤여부가 설정된 경우 배열을 랜덤하게 mix
                       idxArr = mixArr(idxArr);

                   //이미지별 width 계산이 안된 최초에만 실행
                   if(widths.length===0) {
                       images = [...images];
                       //이미지별 width 계산
                       widths = images.map(img => img.clientWidth);
                   }
                   //이미지 clone배열 생성
                   images = images.map(img => img.cloneNode(true));

                   let i = 0;
                   while (i < idxArr.length && sumWidth <= targetWidth) {
                       let idx = idxArr[i++];
                       documentFragment.appendChild(images[idx]);
                       lastImgWidth = widths[idx];
                       sumWidth += lastImgWidth;
                   }
               }
               //마지막 이미지를 첫번째에 복사 삽입
               const lastImg = documentFragment.childNodes[documentFragment.childNodes.length-1].cloneNode(true);
               documentFragment.insertBefore(lastImg, documentFragment.querySelector('img'));

               imageSlide.innerHTML = '';
               imageSlide.appendChild(documentFragment);
               imageSlide.style.width=`${sumWidth+lastImgWidth}px`;
           }
       }
   }

    /**
     * 배열요소를 random하게 뒤섞는 함수
     *
     * @param array     배열
     * @returns {*[]}   random하게 뒤섞인 배열
     */
   function mixArr(array){
       let result=[];
       let tmp=[...array];
       while(result.length!==array.length){
           let randomIdx = Math.floor(Math.random()*tmp.length);
           result.push(tmp[randomIdx]);
           tmp.splice(randomIdx,1);
       }
       return result;
   }

    const imageSlides = [...document.querySelectorAll('.image-slide-inner-zone')];
    imageSlides.forEach(slide=>{
        let triggerHook=0.8;
        if(slide.dataset.animationInfos.match(/trigger-hook\s*:.*?[\d\.]+/)!=null)
            triggerHook = parseFloat(slide.dataset.animationInfos.match(/trigger-hook\s*:.*?([\d\.]+)/)[1]);
        slide.dataset.animationInfos += `, scroll-duration: '${_100vh}'`;
    })
    return {createImageSlides, loadElementsToAnimate, setElemsAniOnResult, addEventToStars, addEventToTextArea, setElemsAniOnLoad, setElemsAniOnScroll, set100vh};
}());
