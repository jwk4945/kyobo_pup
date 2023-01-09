const PageController = (function(){
    const barChartMaxHeight = 6000000; //bar-chart 최대치
    const [bar1, bar2, yellowBar] = document.querySelectorAll('.bar-area .bar'); // bar 차트 목록
    const [barLabel1, barLabel2, yellowBarLabel] = document.querySelectorAll('.bar-area .bar > .bar-label'); // bar 차트 label
    const pic03_leftOffset = (document.querySelector('#pic03').getBoundingClientRect().x
        + document.querySelector('#pic03').getBoundingClientRect().width);
    const controller = new ScrollMagic.Controller();

    const SceneOptObj = {
        'ani-start-tag' : {
            triggerElement: '#ani-start-tag',
            duration: 45,
            triggerHook: 0.7
        },
        'animation-vertical-line' : {
            triggerElement: '#ani-start-tag',
            duration: 110,
            triggerHook: 0.7
        },
        'pic01':{
            triggerElement: '#pic01',
            duration: 300,
            triggerHook: 0.9
        },
        'pic02-2':{
            triggerElement: '#pic02',
            duration: 400,
            triggerHook: 0.5
        },
        'pic03':{
            triggerElement: '#pic03-box',
            duration: 150,
            triggerHook: 0.8
        },
        'pic06':{
            triggerElement: '#pic06',
            duration: 250,
            triggerHook: 0.9
        },
        'pic07':{
            triggerElement: '#pic07',
            duration: 250,
            triggerHook: 0.9
        },
        'pic08':{
            triggerElement: '#pic08',
            duration: 150,
            triggerHook: 0.8
        },
        'description-6th':{
            triggerElement: '#pic08-description',
            duration: 90,
            triggerHook: 0.8
        },'title-msg-3':{
            triggerElement: 'section:nth-of-type(4) .title-msg',
            duration: 85,
            triggerHook: 0.8
        },'description-7th':{
            triggerElement: 'section:nth-of-type(4) .title-msg+h3',
            duration: 85,
            triggerHook: 0.8
        }
    }

    function calcBarHeight(barLabel){
        const figure = barLabel.textContent.replaceAll(',','')*1-1000000;
        return parseFloat(figure/barChartMaxHeight*100).toFixed(2);
    }
    function initBarChart() {
        bar1.style.height = `${calcBarHeight(barLabel1)}%`;
        bar2.style.height = `${calcBarHeight(barLabel2)}%`;
    }
    function initPosition(selector, styles){
        styles = styles || {opacity:'0', transform:'translateY(-100px)'}
    }
    function initHeadMsg() {
        const headMsg = document.querySelector('div.head-msg');
        headMsg.style.opacity='0';
        headMsg.style.transform='translateY(-100px)';
    }
    function initHeadMsgDescription() {
        const headMsgDescription = document.querySelector('#head-msg-description');
        headMsgDescription.style.opacity='0';
        headMsgDescription.style.transform='translateY(-100px)';
    }

    function initHeadTag(){
        const headTag = document.querySelector('span.tag');
        headTag.style.opacity='0';
        headTag.style.transform='translateY(-100px)';
    }
    function initChartArea(){
        const headTag = document.querySelector('.main-banner-wrapper');
        headTag.style.opacity='0';
        headTag.style.transform='translateY(-100px)';
    }
    function reserveAnimation(elem, toChangeStyles, startTime, duration='0.3s'){
        let strTransitionProperty='';
        let arrTransitionProperty = [];

        for(let style in toChangeStyles){
            strTransitionProperty += `, ${style}`;
            arrTransitionProperty.push(style);
        }
        strTransitionProperty = strTransitionProperty.replace(/,\s+/,'');

        elem.style.transitionDuration=duration;
        elem.style.transitionProperty=strTransitionProperty;
        setTimeout(()=>arrTransitionProperty.forEach(style=>
            elem.style[style]=toChangeStyles[style]
        ),startTime);
    }

    function initAnimationSetting(){
        // tag
        reserveAnimation(document.querySelector('span.tag')
            , {transform: 'translateY(0%)', opacity: '1'}
            , 100);

        // head-msg
        reserveAnimation(document.querySelector('div.head-msg')
            , {transform: 'translateY(0%)', opacity: '1'}
            , 500);

        // head-msg-description
        reserveAnimation(document.querySelector('#head-msg-description')
            , {transform: 'translateY(0%)', opacity: '1'}
            , 600);

        // chart-area
        reserveAnimation(document.querySelector('.main-banner-wrapper')
            , {transform: 'translateY(0%)', opacity: '1'}
            , 400
        );

        // yellow-bar
        reserveAnimation(yellowBar
            , {height: `${calcBarHeight(yellowBarLabel)}%`}
            , 750
            , '0.6s'
        );
    }
    function applyAnimationFromTag(){
        const aniElemList = [...document.querySelectorAll('*')]
            .filter(elem=>elem.getAttributeNames().toString().match('data-animation')!=null);
        // 원래 left position
        let orgPositionLeft;

        let idx=1;
        for(let elem of aniElemList){
            //scene 설정
            const scenePropObj = convertPropStr2Obj(elem.dataset.animationSceneProps);
            scenePropObj['triggerElement']=`[data-animation-id="${idx}"]`;
            elem.dataset.animationId=''+idx++;
            // animation 속성값을 각 element에 setting
            elem['animationProps'] = convertPropStr2Obj(elem.dataset.animationInfos);
            // element의 원래 left position 값 기록
            elem['orgPositionLeft'] = Math.ceil(elem.getBoundingClientRect().x);

            //스크롤 이벤트 중 스타일 css 변경
            new ScrollMagic.Scene(scenePropObj)
                .on('progress', e=>{
                    //animation 속성값
                    for(let dv in elem.animationProps) {
                        switch (dv) {
                            case 'translate-x':
                                animateFromTransformedLocation(elem, e.progress, elem.animationProps[dv]);
                                break;
                            case 'position-left':
                            case 'position-right':
                                let departure = elem.animationProps[dv]
                                if(dv === 'position-right') {
                                    departure = document.body.clientWidth-departure-elem.clientWidth;
                                }
                                animateFromStaticPosition(elem, e.progress, departure);
                                break;
                            case 'scale':
                                animateScale(elem, e.progress, elem.animationProps[dv]);
                                break;
                            case 'opacity':
                                animateOpacity(elem, e.progress, elem.animationProps[dv]);
                                break;
                        }
                    }
                })
                .addTo(controller);

            // 초기 스타일(css) 설정
            if(elem.animationProps['translate-x']!=null)
                elem.style.transform = `translateX(${elem.animationProps['translate-x']})`;
            if(elem.animationProps['position-left']!=null)
                elem.style.transform = `translateX(${elem.animationProps['position-left']-elem.orgPositionLeft}px)`;
            if(elem.animationProps['position-right']!=null)
                elem.style.transform = `translateX(${document.body.clientWidth-elem.animationProps['translate-x']-elem.clientWidth})`;
            if(elem.animationProps['scale']!=null)
                elem.style.transform = `scale(${elem.animationProps['scale']})`;
            if(elem.animationProps['opacity']!=null)
                elem.style.opacity = elem.animationProps['opacity'];
        }

        function convertPropStr2Obj(propsStr){
            let returnObj={};
            propsStr.split(';')
                .forEach(str=>{
                    str = str.split(':');
                    returnObj[str[0]] = str[1]*1;
                });
            return returnObj;
        }

        function animateFromTransformedLocation(elem, progress, translateX){
            elem.style.transform = `translateX(${(translateX*(1-progress)).toFixed(0)}px)`;
        }

        function animateFromStaticPosition(elem, progress, departure){
            let fromPosition = departure;
            let targetPosition = elem.orgPositionLeft;
            let translateX = (fromPosition-targetPosition) * (1-progress);
            elem.style.transform = `translateX(${translateX}px)`;
        }

        function animateScale(elem, progress, fromScale){
            elem.style.transform = `scale(${((fromScale-1)*(1-progress)+1).toFixed(1)})`;
        }

        function animateOpacity(elem, progress, opacity){
            elem.style.opacity = (opacity + (1-opacity)*progress)+'';
        }
    }
    function setScrollAnimation(){
        // "지금부터 위염에 좋지않은 습관을 알아볼게요 고정 pin"
        new ScrollMagic.Scene(SceneOptObj["ani-start-tag"])
            .setPin('#ani-start-tag')
            .addTo(controller);
        // 세로 선 애니메이션
        new ScrollMagic.Scene(SceneOptObj["animation-vertical-line"])
            .on('progress', e=> {
                const elem = document.querySelector('.animation-vertical.hide');
                elem.style.height = `${(e.progress * 100).toFixed(1)}%`;
                elem.style.opacity = `${(e.progress * 100).toFixed(1)}%`;
            })
            .addTo(controller);

        // pic02-중간지점
        new ScrollMagic.Scene(SceneOptObj["pic02-2"])
            .on('progress', e=> {
                const elem = e.target.triggerElement();
                const parent = elem.parentElement;
                //((2x-1)((2x-1)^2+1)+2)/4
                const calcFunc = ((2*e.progress-1)*(Math.pow(2*e.progress-1,2)+1)+2)/4;
                const translateX = parent.clientWidth*calcFunc;
                //console.log('x',(e.progress-0.5)*2, 'y',Math.pow((e.progress-0.5)*2,3)+1)
                elem.style.transform = `translateX(${translateX}px)`;
                elem.style.opacity = `${((1-e.progress) * 100).toFixed(1)}%`;
            })
            .addTo(controller);
        // pic03, 05
        new ScrollMagic.Scene(SceneOptObj["pic03"])
            .on('progress', e=> {
                const pic03Box = document.querySelector('#pic03-box');
                const pic05Box = document.querySelector('#pic05-box');
                pic03Box.style.transform = `translateX(-${(pic03_leftOffset*(1-e.progress)).toFixed(0)}px)`;
                pic05Box.style.transform = `translateX(${(pic03_leftOffset*(1-e.progress)).toFixed(0)}px)`;
            })
            .addTo(controller);

        // pic06.gif, 매운음식
        new ScrollMagic.Scene(SceneOptObj["pic06"])
            .on('progress', e=> {
                const elem = e.target.triggerElement();
                let styleText = `translateX(-${100-(e.progress * 100).toFixed(0)}%)`;
                styleText += ` rotate(-${45-(e.progress*45).toFixed(0)}deg)`;
                elem.style.transform = styleText;
                elem.style.opacity = `${(e.progress * 100).toFixed(1)}%`;
            })
            .addTo(controller);

    }

    //별점 클릭 이벤트
    function onClickStarPointsBox(){
        const starPointsBox = document.querySelector('#star-points-box');
        const emptyStars = [...starPointsBox.querySelectorAll('.empty-star')];
        const paintedStars = [...starPointsBox.querySelectorAll('.painted-star')];
        starPointsBox.addEventListener('click',event=>{
            let clickedStar =
                emptyStars.map((node,idx)=>{
                    return {idx, star:node}
                }).filter(node=>node.star===event.target)[0];
            clickedStar = clickedStar ||
                paintedStars.map((node,idx)=>{
                    return {idx, star:node}
                }).filter(node=>node.star===event.target)[0];

            emptyStars.forEach((node,idx)=>{
                if(idx<=clickedStar.idx) {
                    node.classList.add('display-none');
                    paintedStars[idx].classList.remove('display-none');
                }else{
                    node.classList.remove('display-none');
                    paintedStars[idx].classList.add('display-none');
                }
            });
        })
    }

    function onSubmit(){
        const frm = document.querySelector('form');
        frm.addEventListener('submit', event=>{
            event.preventDefault();
            alert('소중한 의견 감사합니다.');
        })
    }

    function bindEvents(){
        onClickStarPointsBox();
        onSubmit();
    }

    function initSetting() {
        initBarChart();
        initHeadMsg();
        initHeadMsgDescription();
        initHeadTag();
        initChartArea();
    }
    return {
        initSetting, initAnimationSetting
        , setScrollAnimation
        , bindEvents
        , applyAnimationFromTag
    }
})();

PageController.initSetting();
PageController.initAnimationSetting();
PageController.applyAnimationFromTag();
PageController.setScrollAnimation();
PageController.bindEvents();