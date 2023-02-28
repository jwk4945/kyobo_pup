class Calculation {
    constructor() {
        this._symbols = {};
        this.defineOperator("!", this.factorial,      "postfix", 6);
        this.defineOperator("^", Math.pow,            "infix",   5, true);
        this.defineOperator("*", this.multiplication, "infix",   4);
        this.defineOperator("/", this.division,       "infix",   4);
        this.defineOperator("+", this.last,           "prefix",  3);
        this.defineOperator("-", this.negation,       "prefix",  3);
        this.defineOperator("+", this.addition,       "infix",   2);
        this.defineOperator("-", this.subtraction,    "infix",   2);
        this.defineOperator(",", Array.of,            "infix",   1);
        this.defineOperator("(", this.last,           "prefix");
        this.defineOperator(")", null,                "postfix");
        this.defineOperator("min", Math.min);
        this.defineOperator("sqrt", Math.sqrt);
    }
    // Method allowing to extend an instance with more operators and functions:
    defineOperator(symbol, f, notation = "func", precedence = 0, rightToLeft = false) {
        // Store operators keyed by their symbol/name. Some symbols may represent
        // different usages: e.g. "-" can be unary or binary, so they are also
        // keyed by their notation (prefix, infix, postfix, func):
        if (notation === "func") precedence = 0;
        this._symbols[symbol] = Object.assign({}, this._symbols[symbol], {
            [notation]: {
                symbol, f, notation, precedence, rightToLeft,
                argCount: 1 + (notation === "infix")
            },
            symbol,
            regSymbol: symbol.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&')
                + (/\w$/.test(symbol) ? "\\b" : "") // add a break if it's a name
        });
    }
    last(...a)           { return a[a.length-1] }
    negation(a)          { return -a }
    addition(a, b)       { return a + b }
    subtraction(a, b)    { return a - b }
    multiplication(a, b) { return a * b }
    division(a, b)       { return a / b }
    factorial(a) {
        if (a%1 || !(+a>=0)) return NaN
        if (a > 170) return Infinity;
        let b = 1;
        while (a > 1) b *= a--;
        return b;
    }
    calculate(expression) {
        let match;
        const values = [],
            operators = [this._symbols["("].prefix],
            exec = _ => {
                let op = operators.pop();
                values.push(op.f(...[].concat(...values.splice(-op.argCount))));
                return op.precedence;
            },
            error = msg => {
                let notation = match ? match.index : expression.length;
                return `${msg} at ${notation}:\n${expression}\n${' '.repeat(notation)}^`;
            },
            pattern = new RegExp(
                // Pattern for numbers
                "\\d+(?:\\.\\d+)?|"
                // ...and patterns for individual operators/function names
                + Object.values(this._symbols)
                    // longer symbols should be listed first
                    .sort( (a, b) => b.symbol.length - a.symbol.length )
                    .map( val => val.regSymbol ).join('|')
                + "|(\\S)", "g"
            );
        let afterValue = false;
        pattern.lastIndex = 0; // Reset regular expression object
        do {
            match = pattern.exec(expression);
            const [token, bad] = match || [")", undefined],
                notNumber = this._symbols[token],
                notNewValue = notNumber && !notNumber.prefix && !notNumber.func,
                notAfterValue = !notNumber || !notNumber.postfix && !notNumber.infix;
            // Check for syntax errors:
            if (bad || (afterValue ? notAfterValue : notNewValue)) return error("Syntax error");
            if (afterValue) {
                // We either have an infix or postfix operator (they should be mutually exclusive)
                const curr = notNumber.postfix || notNumber.infix;
                do {
                    const prev = operators[operators.length-1];
                    if (((curr.precedence - prev.precedence) || prev.rightToLeft) > 0) break;
                    // Apply previous operator, since it has precedence over current one
                } while (exec()); // Exit loop after executing an opening parenthesis or function
                afterValue = curr.notation === "postfix";
                if (curr.symbol !== ")") {
                    operators.push(curr);
                    // Postfix always has precedence over any operator that follows after it
                    if (afterValue) exec();
                }
            } else if (notNumber) { // prefix operator or function
                operators.push(notNumber.prefix || notNumber.func);
                if (notNumber.func) { // Require an opening parenthesis
                    match = pattern.exec(expression);
                    if (!match || match[0] !== "(") return error("Function needs parentheses")
                }
            } else { // number
                values.push(+token);
                afterValue = true;
            }
        } while (match && operators.length);
        return operators.length ? error("Missing closing parenthesis")
            : match ? error("Too many closing parentheses")
                : values.pop() // All done!
    }
};

const AnimationManager=(function (){

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

const EventProcessor = (function (){
    let _isAutoBottomStyle=false;
    let _isLinkToInsurance;
    let didCallback=false;
    let _didTogglePageContents=false;

    let insuranceUrl;
    let insuranceImg;
    let insuranceName;
    let insuranceExplain;
    let insuranceCertificationMsg;
    let serviceUrl;
    let serviceImg;
    let serviceName;
    let serviceExplain;

    let _searchKeyword;
    let _contentsId;
    let _userKey;
    let _bannerHistorySeq;

    let _isUserInLastPage = true;
    let _surveyRadiosSelector = 'input[type="radio"][name="kyobolife-survey"]';
    let _nextButtonSelector = 'button#goNextBtn';

    function initSettingForBfCache() {
        window.addEventListener('pageshow', function(event) {
            if (event.persisted) {
                location.reload();
            }
        });
    }

    function initSetting(params){
        //교보문고 검색어
        _searchKeyword = document.querySelector('#srch_kywr_name').value;
        //콘텐츠 아이디
        _contentsId = document.querySelector('#csjr_ctts_num').value;

        if(_contentsId==null || _contentsId==='')
            _contentsId = params.contentsId;
        _contentsId.replace('.html','');

        _userKey = createUserKey(); //user key 생성
        setPropertiesForCss(); //css 전역변수 설정
        initSettingForReviewRadio(params.contentsId); //피드백라디오(좋아요/싫어요) 기본이벤트처리
        setAutoHideElements(); //gnb(헤더) 자동 숨기기 설정
        getMethodForShowResult(params).call(this,params); //결과화면 처리함수 선택호출
        initSettingForBfCache(); // 브라우저 뒤로가기 캐쉬 초기화

        //bottom-sheet 추천상품정보 설정
        const linkInfoForInsurance = params.linkInfoForInsurance;
        insuranceUrl = linkInfoForInsurance.url;
        insuranceImg = linkInfoForInsurance.imgUrl;
        insuranceName = linkInfoForInsurance.name;
        insuranceExplain = linkInfoForInsurance.explain;
        insuranceCertificationMsg = linkInfoForInsurance.certificationMsg;

        const linkInfoForService = params.linkInfoForService;
        serviceUrl = linkInfoForService.url;
        serviceImg = linkInfoForService.imgUrl;
        serviceName = linkInfoForService.name;
        serviceExplain = linkInfoForService.explain;

        //Bottom-sheet 생성
        createBottomSheet();
        // bottom-sheet 등장 자동/수동 설정
        if(isAutoBottomStyle())
            setAutoBottomSheetEvent();
        else
            setBottomSheetEvent();
    }

    function getMethodForShowResult({nextButtonSelector=_nextButtonSelector, surveyRadioSelector=_surveyRadiosSelector}){
        //설문조사 라디오버튼 selector
        _surveyRadiosSelector = surveyRadioSelector;

        // 1. 확인하기 버튼이 있는 경우
        _nextButtonSelector = nextButtonSelector;
        if(document.querySelector(_nextButtonSelector)!==null)
            return initSettingForSubmitButton;

        //2.밸런스 게임인 경우 (선택 시 바로 결과페이지 등장)
        else if(document.querySelector('.balance-game')!==null)
            return initSettingForBalanceGame;

        //3.팩트체크인 경우 (마지막 슬라이드 이후 결과페이지 등장)
        else if(document.querySelector('.fact-check')!==null)
            return initSettingForFactCheck;

        //4.결과화면이 없는 경우 (일반 정보제공형)
        else
            return ()=>{};
    }

    function initSettingForSubmitButton({bPostSurveyInput=true,
                                        forceEnableNextButton=false}){
        EventProcessor.setUserInLastPage(false);
        initSettingForButtonEnable(forceEnableNextButton); // 버튼 활성화 처리
        initSettingForSubmitSurvey(bPostSurveyInput); // 설문조사 결과 제출 및 가져오기
        setGoNextAndFirstBtn(); // 확인하기 / 뒤로가기 버튼 처리
    }

    function initSettingForButtonEnable(){
        const confirm = document.querySelector(_nextButtonSelector);

        //확인하기 버튼 활성화 처리
        [...document.querySelectorAll(_surveyRadiosSelector)].forEach(elem =>
            elem.addEventListener('change', e => {
                if (confirm !== null)
                    confirm.disabled = false;
            })
        );
    }

    function initSettingForBalanceGame(){
        //첫 로딩 시점에는 결과페이지 아님
        setUserInLastPage(false);

        [...document.querySelectorAll('.balance-game input[name="kyobolife-survey"]')].forEach(input => {
            input.addEventListener('change', e => {
                setUserInLastPage(true);
                togglePageContents(true); // 뒤로가기가 없으므로 페이지 전환은 한번만(once)
                AnimationManager.setElemsAniOnScroll();
                document.documentElement.classList.remove('overflow-y-hidden');
                AnimationManager.setElemsAniOnResult();
                // 밸런스게임 라디오버튼 영역 높이 최소화(축소)
                document.querySelector('#survey-area').classList.add('shrink-height');
            });
        });
    }

    function initSettingForFactCheck(){
        const swiper = new Swiper(".swiper-container",{
            loop: false,
            pagination:{
                el: '.swiper-pagination',
                type: 'bullets',
                bulletClass: 'swiper-my-bullet',
                bulletActiveClass: 'active',
            }
        });

        EventProcessor.setUserInLastPage(false);

        swiper.on('slideChange',swiper=>{

            if((swiper.realIndex === swiper.slides.length-1) //마지막 슬라이드 도착했거나
              ||(swiper.realIndex === swiper.slides.length-2 && swiper.previousIndex === swiper.slides.length-1)) //마지막슬라이드에서 직전슬라이드로 돌아온 경우
            {
                togglePageContents();
                EventProcessor.setUserInLastPage(true);
                document.querySelector('.swiper-pagination').classList.toggle('display-none');
                // 마지막 슬라이드
                if(swiper.realIndex === swiper.slides.length-1) {
                    document.querySelector('#nextDiv').style.marginTop = `-${document.querySelector('.swiper-wrapper').clientHeight}px`;
                    AnimationManager.setElemsAniOnScroll();
                    AnimationManager.setElemsAniOnResult();
                }
            }
        })
    }

    function initSettingForSubmitSurvey(bPost=true){
        if(bPost===false ||
            document.querySelector('.survey-form input[type="radio"][name="kyobolife-survey"]')===null)
            return;
        const submitBtn = document.querySelector('button#goNextBtn');
        if(submitBtn===null)
            return;

        submitBtn.addEventListener('click', e=>postSurveyInput());
    }

    function setAutoHideElements(hideTargets){
        hideTargets = hideTargets || [
            document.querySelector('nav'),
            document.querySelector('#goFirstBtn')
        ];
        let isShowing = true;
        let prevScrollY = 0;
        let firstScrollY;
        let prevScrolledDown = false;
        // const scrollYValue = 100;
        const scrollYValue = 50;
        const gnb = document.querySelector('nav');
        if(gnb===null)
            return;

        window.addEventListener('scroll',e=>{
            let isScrollingDown = window.scrollY>prevScrollY;
            //화면 스크롤이 가장 위인 경우, 위로 스크롤하면 바로 등장
            if(!isScrollingDown && window.scrollY===0) {
                for(let target of hideTargets) {
                    if(target!==null && target.classList.contains('hide'))
                        target.elem.classList.remove('hide');
                }
            }
            else if(isShowing && isScrollingDown || !isShowing && !isScrollingDown){
                let hasChangedDirection = isScrollingDown^prevScrolledDown;
                prevScrolledDown = isScrollingDown;
                if(hasChangedDirection){
                    firstScrollY = window.scrollY;
                    return;
                }
                if(Math.abs(window.scrollY-firstScrollY)>scrollYValue){
                    isShowing = !isShowing;
                    for(let target of hideTargets) {
                        if(target!==null) {
                            if (isShowing)
                                target.classList.remove('hide');
                            else
                                target.classList.add('hide');
                        }
                    }
                }
            }
            prevScrollY = window.scrollY;
        });
    }
    function createUserKey(){
        let userKey = getLocalStorage('user-key', true);
        if(userKey===null && _contentsId!==undefined) {
            const currDate = new Date();
            userKey = currDate.toLocaleDateString("ko-KR").replace(/[\s\.]/g,'');
            userKey += currDate.toLocaleTimeString("en-GB").replace(/[\:]/g,'');
            userKey += '-';
            userKey += Date.now().toString(36);
        }
        if(userKey!==null){
            setLocalStorage('user-key',userKey, 14, true);
        }
        return userKey;
    }
    function setGoNextAndFirstBtn(callbackForNext, callbackForPrev){
        const goNextBtn = document.querySelector('#goNextBtn');
        const goFirstBtn = document.querySelector('#goFirstBtn');

        // 확인하기버튼 callback
        callbackForNext = callbackForNext || (() => {
            if(document.querySelector('.li-item-result')===null)
                return;
            const index = [...document.querySelectorAll('.survey-form input[type="radio"]')]
                .findIndex(item => item === document.querySelector('.survey-form input[type="radio"]:checked'));
            document.querySelectorAll('.li-item-result')[index].classList.add('active');
            document.querySelectorAll('.li-item-result')[index].querySelector('small').classList.remove('fc-4');
        });
        // 돌아가기버튼 callback
        callbackForPrev = callbackForPrev || (() => {
            window.setTimeout(() => {
                [...document.querySelectorAll('.survey-form li')].forEach(li => li.style.transform = '');
                [...document.querySelectorAll('.li-item-result')].forEach(li => li.classList.remove('active'));
            }, 0);
        });

        if(goNextBtn!==null){
            goNextBtn.addEventListener('click',e=>{
                togglePageContents();
                callbackForNext();
                AnimationManager.setElemsAniOnScroll();
                // document.documentElement.classList.remove('overflow-y-hidden');
                setUserInLastPage(true);
                //애니메이션
                AnimationManager.setElemsAniOnResult();
            });
        }
        if(goFirstBtn!==null){
            goFirstBtn.addEventListener('click',e=>{
                const gnb = document.querySelector('nav');
                if(gnb!==null)
                    gnb.classList.remove('hide');
                togglePageContents();

                if(callbackForPrev!==null)
                    callbackForPrev();
                // document.documentElement.classList.add('overflow-y-hidden');
                setUserInLastPage(false);
            });
        }
    }

    function showSelectiveResult() {
        if (document.querySelector("#selective-result-area") !== null) {
            const radios = [...document.querySelectorAll(_surveyRadiosSelector)];
            const checkedIndex = radios.findIndex(radio => radio === document.querySelector(`${_surveyRadiosSelector}:checked`));
            [...document.querySelectorAll('#selective-result-area .selective-result')].forEach((result, idx) => {
                if (idx === checkedIndex)
                    result.classList.remove('display-none');
                else
                    result.classList.add('display-none');
            })
        }
    }

    function togglePageContents(bOnce=false){
        if( (bOnce===true && _didTogglePageContents===false) || bOnce===false) {
            [...document.querySelectorAll('[data-is-not-result-page=true]')].forEach(elem => elem.dataset.isNotResultPage = 'processing');
            [...document.querySelectorAll('[data-is-not-result-page=false]')].forEach(elem => elem.dataset.isNotResultPage = 'true');
            [...document.querySelectorAll('[data-is-not-result-page=processing]')].forEach(elem => elem.dataset.isNotResultPage = 'false');
            _didTogglePageContents = true;
        }

        showSelectiveResult();
    }

    function postSurveyInput(surveyResultTargets){
        surveyResultTargets = surveyResultTargets || {
            //설문비율 텍스트 elements
            arrSurveyResultTexts: document.querySelectorAll('.li-item-result .result-ratio'),
            //설문비율 그래프(가로바) elements
            arrSurveyResultBars: document.querySelectorAll('.li-item-result .painted-bar')
        }
        const list = [...document.querySelectorAll('.survey-form li')];
        const checkedIndex = list.findIndex(
            li=>li.querySelector('input[name="kyobolife-survey"]:checked')!==null
        );
        let checkedContents = list[checkedIndex].querySelector('.contents').textContent;
        if(checkedContents!==null)
            checkedContents = checkedContents.replace(/\s\s/g,'').trim();
        const url = `/journey/form/contents-survey`;
        const sendData = {
            srch_kywr_name: _searchKeyword // 교보문고 검색키워드,
            , csjr_ctts_num: _contentsId // 콘텐츠아이디
            , csjr_srvy_ansr_srmb: checkedIndex // 응답 라디오 순번
            , csjr_srvy_ansr_cntt: checkedContents // 응답 보기설문내용
        };
        postData(url, sendData, result=>{
            console.log(result);
            result.forEach(row=>{
                const idx = row.csjr_srvy_ansr_srmb;
                surveyResultTargets.arrSurveyResultTexts[idx].textContent = row.csjr_ctts_srvy_rate;
                surveyResultTargets.arrSurveyResultBars[idx].style.width = `${row.csjr_ctts_srvy_rate}%`;
            })
        })
    }

    function postBannerExposeInfo() {
        const url = `/journey/form/banner-expose`;
        const sendData = {
            srch_kywr_name: _searchKeyword // 교보문고 검색키웓,
            , csjr_ctts_num: _contentsId // 콘텐츠아이디
            , bnnr_expr_mthd_dvsn_code: _isAutoBottomStyle ? '001':'002' // 자동 : 수동
            , bnnr_expr_cmdt_kind_code: _isLinkToInsurance ? '001':'002' // 보험 : 부가서비스
            , bnnr_expr_cmdt_name: getLinkInfos().linkName
            , bnnr_urladrs: getLinkInfos().linkUrl
        };
        postData(url, sendData, result=>{
            console.log(result);
            _bannerHistorySeq = result.csjr_ctts_advr_expr_srmb;
        })
    }

    function postBannerClickInfo(href, callback) {
        const url = `/journey/form/banner-visit`;
        const sendData = {
            csjr_ctts_advr_expr_srmb: _bannerHistorySeq // 배너이력순번
            , srch_kywr_name: _searchKeyword // 교보문고 검색키웓,
            , csjr_ctts_num: _contentsId // 콘텐츠아이디
            , bnnr_expr_mthd_dvsn_code: _isAutoBottomStyle ? '001':'002' // 자동 : 수동
            , bnnr_expr_cmdt_kind_code: _isLinkToInsurance ? '001':'002' // 보험 : 부가서비스
            , bnnr_expr_cmdt_name: getLinkInfos().linkName
            , bnnr_urladrs: getLinkInfos().linkUrl
        };
        postData(url, sendData, result=>{
            console.log(result);
            window.location.href=href;
            if(callback!==undefined)
                callback();
        })
    }

    function setAutoBottomSheetEvent(){
        const triggerElement = document.querySelector('#feedback-area');
        if(triggerElement===null)
            return;
        let prevScrollY=0;

        const handler = e =>{
            const hasScrolledDown = window.scrollY>prevScrollY;
            prevScrollY = window.scrollY;
            if(hasScrolledDown){
                const triggerRect = triggerElement.getBoundingClientRect();
                const screenHeight = document.documentElement.clientHeight;
                if(_isUserInLastPage && screenHeight*0.5 > triggerRect.top){
                    scrollToEndOfFeedbackArea(screenHeight, triggerRect);    // 화면을 피드백영역 하단으로 자동 스크롤
                    showBottomSheet(postBannerExposeInfo); // 바텀시트 등장
                    //한번만 동작하도록 이벤트 해제
                    window.removeEventListener('scroll',handler);
                }
            }
        }
        window.addEventListener('scroll',handler);
    }
    function scrollToEndOfFeedbackArea(screenHeight, triggerRect){
        const displayingHeight = screenHeight - triggerRect.top;
        const scrollValue = triggerRect.height - displayingHeight;
        document.body.style.transition=`margin 0.4s`;
        document.body.style.marginTop=`-${scrollValue}px`;
    }

    function getLinkInfos(){
        let linkUrl, linkImg, linkName, linkExplain, certificationMsg;
        if(isLinkToInsurance()) {
            linkUrl = insuranceUrl;
            linkImg = insuranceImg;
            linkName = insuranceName;
            linkExplain = insuranceExplain;
            certificationMsg = insuranceCertificationMsg;
        }
        else {
            linkUrl = serviceUrl;
            linkImg = serviceImg;
            linkName = serviceName;
            linkExplain = serviceExplain;
        }
        return {linkUrl, linkImg, linkName, linkExplain, certificationMsg};
    }

    function handleScrollLock(bLock) {
        if(bLock) {
            document.documentElement.classList.add('overflow-y-hidden');
            document.body.classList.add('overflow-y-hidden');
        }else{
            document.documentElement.classList.remove('overflow-y-hidden');
            document.body.classList.remove('overflow-y-hidden');
        }
        // document.querySelector('.main-wrapper').classList.toggle('overflow-y-hidden');
    }

    function createDimmedScreen(){
        const dimmed = document.createElement('div');
        dimmed.setAttribute('class', 'dimmed');
        document.body.appendChild(dimmed);
    }

    function showLoadingScreen(){
        const loadingScreen = document.querySelector('.loading-screen');
        if(loadingScreen===null)
            return;
        loadingScreen.dataset.isPlayingLoading='true';
    }

    function closeLoadingScreen(){
        const loadingScreen = document.querySelector('.loading-screen');
        if(loadingScreen===null)
            return;
        loadingScreen.dataset.isPlayingLoading='false';
    }

    function createBottomSheet() {
        const linkInfos = getLinkInfos(); //링크정보 불러오기
        const effectImgUrl = '../../../resources/v1/img/img-product-effect.gif';

        const bottomSheetWrapper = document.createElement('div');
        bottomSheetWrapper.setAttribute('class','bottom-sheet-wrapper hide');

        const closeBtnArea = document.createElement('div');
        closeBtnArea.setAttribute('class','bottom-sheet-close-btn-area');

        const closeBtn = document.createElement('a');
        closeBtn.setAttribute('class','close-btn')

        const closeBtnMsg = document.createElement('span');
        closeBtnMsg.style.display='none';
        closeBtnMsg.textContent = '닫기';

        const closeBtnImg = document.createElement('img');
        closeBtnImg.setAttribute('src', '../../../resources/v1/img/ico-30-svg-close-w.svg');

        const bottomSheet = document.createElement('div');
        bottomSheet.setAttribute('class', 'bottom-sheet fc-1');

        const headline = document.createElement('div');
        headline.setAttribute('class', 'headline');

        const ci = document.createElement('img');
        ci.setAttribute('src','../../../resources/v1/img/img-ci-kyobo.png');
        ci.setAttribute('width','80');

        const titleMsg = document.createElement('h4');
        titleMsg.setAttribute('class', 'fw-700');
        titleMsg.textContent = '이런 상품 어떠세요?'

        const recommendBox = document.createElement('div');
        recommendBox.setAttribute('class', 'recommend-product text-align-center');

        const bannerBox = document.createElement('div');
        bannerBox.setAttribute('class', 'banner-box text-align-center mt-10 fs-0');

        const bgCircle = document.createElement('div');
        bgCircle.setAttribute('class', 'bg-circle hide');

        const recommendImg = document.createElement('img');
        recommendImg.setAttribute('src', linkInfos.linkImg);
        recommendImg.setAttribute('width', '80');
        recommendImg.setAttribute('class', 'mt-10');

        const effectImg = document.createElement('img');
        effectImg.setAttribute('src', effectImgUrl);
        effectImg.setAttribute('width', '90');
        effectImg.setAttribute('class', 'mt-10');

        const recommendName = document.createElement('h4');
        recommendName.setAttribute('class', 'mt-10 fw-700');
        recommendName.textContent = linkInfos.linkName;

        const recommendExplain = document.createElement('p');
        recommendExplain.setAttribute('class', 'mt-10 mb-20 fs-7 fc-3');
        recommendExplain.textContent = linkInfos.linkExplain;

        const certification = document.createElement('div');
        certification.setAttribute('class', 'mt-5 certification');
        certification.textContent = linkInfos.certificationMsg;

        const kyoboLink = document.createElement('a');
        kyoboLink.setAttribute('href', linkInfos.linkUrl);
        kyoboLink.setAttribute('class', 'text-align-center fw-700 fs-6 mt-20 fc-2')
        kyoboLink.textContent = '더 알아보기';
        kyoboLink.addEventListener('click',e=>{
            e.preventDefault();
            showLoadingScreen();
            window.setTimeout(()=>postBannerClickInfo(
                linkInfos.linkUrl
                , closeLoadingScreen)
                , 2000); //로딩스크린 2초후 실행
        })

        const arrowImg = document.createElement('img');
        arrowImg.setAttribute('src', '../../../resources/v1/img/ico-12-arrow-g.svg');

        //닫기버튼 만들기
        closeBtn.appendChild(closeBtnMsg);
        closeBtn.appendChild(closeBtnImg);
        closeBtn.addEventListener('click', e => {
            e.preventDefault();
            closeBottomSheet();
        });
        closeBtnArea.appendChild(closeBtn);

        //bottomsheet 타이틀 생성
        headline.appendChild(titleMsg);
        headline.appendChild(ci);

        //상품추천내용 생성
        bannerBox.appendChild(bgCircle);
        bannerBox.appendChild(recommendImg);
        bannerBox.appendChild(effectImg);
        recommendBox.appendChild(bannerBox);
        recommendBox.appendChild(recommendName);
        recommendBox.appendChild(recommendExplain);

        //더 알아보기
        kyoboLink.appendChild(arrowImg);

        //bottom sheet
        bottomSheet.appendChild(headline);
        bottomSheet.appendChild(recommendBox);
        if(linkInfos.certificationMsg!==undefined)
            bottomSheet.appendChild(certification);
        bottomSheet.appendChild(kyoboLink);

        //bottom sheet wrapper
        bottomSheetWrapper.appendChild(closeBtnArea);
        bottomSheetWrapper.appendChild(bottomSheet);
        bottomSheetWrapper.addEventListener('transitionend', () => {
            //상품이미지 배경(원) 애니메이션
            bgCircle.classList.toggle('hide');
            //scroll 잠그기
            if(bottomSheetWrapper.classList.contains('hide'))
                handleScrollLock(false);
        });

        document.body.appendChild(bottomSheetWrapper);
    }

    function showBottomSheet(callBackFunc) {
        const bottomSheet = document.querySelector(".bottom-sheet-wrapper");
        if(bottomSheet===null || !bottomSheet.classList.contains('hide'))
            return;

        //dimmed screen 생성
        createDimmedScreen();
        //scroll Lock
        handleScrollLock(true);
        //bottom-sheet 숨기기 해제
        window.setTimeout(()=>bottomSheet.classList.toggle('hide')
            ,100);

        //callback function
        //tracking은 한번만 수행
        if(!didCallback) {
            callBackFunc();
            didCallback=true;
        }
    }
    function closeBottomSheet(){
        if(document.querySelector(".bottom-sheet-wrapper")===null)
            return;

        // 자동스크롤(TranslateY)된 Body(배경) 요소 복구
        // transformedElem.style.transform=`translate(${orgTranslateX}px, ${orgTranslateY}px)`;
        document.body.style.marginTop='';

        const bottomSheet = document.querySelector(".bottom-sheet-wrapper");
        bottomSheet.addEventListener('transitionend',()=> {
            const dimmed = document.querySelector('.dimmed');
            if(bottomSheet.classList.contains('hide') && dimmed!==null)
                dimmed.remove();
        });
        bottomSheet.classList.toggle('hide');
    }

    function isLinkToInsurance() {
        if(_isLinkToInsurance===undefined)
            _isLinkToInsurance = Math.floor(Math.random()*10)<5;
        return _isLinkToInsurance;
    }

    function isAutoBottomStyle() {
        _isAutoBottomStyle = Math.floor(Math.random()*10)<5;
        return _isAutoBottomStyle;
    }

    function setBottomSheetEvent() {
        if(document.querySelector('input#feedback-radio-01')===null)
            return;
        document.querySelector('input#feedback-radio-01').addEventListener(
            'change', ()=>showBottomSheet(postBannerExposeInfo)
        );
    }

    function getSurveyResult(contentsId){
        let result;
        console.log('get survey result==================');
        console.log('contentsId : ', contentsId);
        result = {};
        result.counts = [55, 45, 15];
        console.log('contentsId : ', contentsId);

        return result.counts;
    }

    function getResultOfSurvey(contentsId, callback){
        // const url = `http://localhost:8080/v1/contents/7D_003.html?contentsId?=${contentsId}`;
        const url = `/journey/form/contents-survey?ctts_num=${contentsId}`;
        const testData = {arr:[55,45]}
        fetch(url)
            .then(res=>res.json())
            .then(json=>callback(json))
            .catch(()=>callback(testData))
    }

    function postData(url,data, callback){
        let options = {
            method: 'POST', // *GET, POST, PUT, DELETE 등
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
        };

        fetch(url, options)
            .then(res=>res.json())
            .then(result=>callback(result))
            .catch(error=>callback(error));
    }

    function postReview(value){
        const url = `/journey/form/contents-review`;
        const sendData = {
            srch_kywr_name: _searchKeyword
            , csjr_ctts_num: _contentsId
            , csjr_ctts_vltn_dvsn_code: value
            , terml_cnct_param_wrth: _userKey
        };
        postData(url, sendData, result=>{console.log(result)})
    }

    function removeLocalStorage(key, isGlobal=false){
        if(isGlobal){
            localStorage.removeItem(key);
        }else {
            let localData = localStorage.getItem(_contentsId);
            if (!isJsonString(localData) || localData===null)
                localData={};
            else {
                localData = JSON.parse(localData);
                delete localData[key];
            }
            localStorage.setItem(_contentsId, JSON.stringify(localData));
        }
    }
    function isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    function setLocalStorage(key, value, period, isGlobal=false) {
        const expiry = new Date(Date.now() + (period * 24 * 3600 * 1000))
            .toLocaleDateString().replace(/\s/g, '');
        const inputData = {
            value: value,
            expiry: expiry
        };
        let localData;
        if(isGlobal){
            localData = inputData;
        }else {
            localData = localStorage.getItem(_contentsId);
            localData = (localData === null ? {} : JSON.parse(localData));
            localData[key] = inputData;
        }
        localStorage.setItem(isGlobal? key:_contentsId, JSON.stringify(localData));
    }

    function getLocalStorage(key,isGlobal=false) {
        let localData = localStorage.getItem(isGlobal? key:_contentsId);
        if(localData===null || !isJsonString(localData)) {
            removeLocalStorage(key, isGlobal);
            return null;
        }
        localData = JSON.parse(localData);
        localData = isGlobal? localData : localData[key];
        const currDate = new Date().toLocaleDateString().replace(/\s/g,'');

        if(localData===undefined || new Date(currDate)>=new Date(localData.expiry)) {
            removeLocalStorage(key,isGlobal);
            return null;
        }
        return localData.value;
    }

    function setUserInLastPage(isTrue){
        _isUserInLastPage = isTrue;
    }

    function initSettingForReviewRadio(contentsId, radios){
        _contentsId = contentsId;
        radios = radios||document.querySelectorAll('input[name="feedback-radio"][type="radio"]');
        if(radios.length===0)
            return;

        const localCheckedValue = getLocalStorage('feedback-value');
        radios.forEach(radio=> {
            radio.addEventListener('change', e => {
                postReview(e.target.value);
                setLocalStorage('feedback-value', e.target.value, 14);//2주만 보관
            });
            if(radio.value===localCheckedValue)
                radio.checked = true;
        });
    }
    function getUserKey(){
        return _userKey;
    }

    const setPropertiesForCss = function (){
        const _setPropertiesForCss = () => {
            document.documentElement.style.setProperty('--vscrollwidth', `${window.innerWidth - document.documentElement.clientWidth}px`);
            document.documentElement.style.setProperty('--1vw', `${Math.round(document.documentElement.clientWidth / 100 * 10) / 10}px`);
            document.documentElement.style.setProperty('--100vh-inner', `${document.documentElement.clientHeight}px`);
        }
        _setPropertiesForCss();
        window.addEventListener('resize',_setPropertiesForCss);
        window.addEventListener('resize',()=>AnimationManager.set100vh(document.documentElement.clientHeight));
    }
    return {setGoNextAndFirstBtn, isAutoBottomStyle, setAutoBottomSheetEvent
        , setBottomSheetEvent, setPropertiesForCss, getResultOfSurvey, togglePageContents
        , initSetting, setUserInLastPage}
})();

// 퍼블 테스트
func changeStatusBarBgColor(bgColor: UIColor?) {
    if #available(iOS 13.0, *) {
        let window = UIApplication.shared.windows.first
        let statusBarManager = window?.windowScene?.statusBarManager
        
        let statusBarView = UIView(frame: statusBarManager?.statusBarFrame ?? .zero)
        statusBarView.backgroundColor = bgColor
        
        window?.addSubview(statusBarView)
    } else {
        let statusBarView = UIApplication.shared.value(forKey: "statusBar") as? UIView
        statusBarView?.backgroundColor = bgColor
    }
}

override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    
    changeStatusBarBgColor(bgColor: UIColor.red)
}