$(document).ready(function (){

    // SNS 공유하기
    $('#btn_share').on('click', function(){
        if($(this).closest('.share_area').hasClass('active')){
            $(this).closest('.share_area').removeClass('active');
        } else{
            $(this).closest('.share_area').addClass('active');
        }
    });

    $('#btn_share_close').on('click', function(){
        if($(this).closest('.share_area').hasClass('active')){
            $(this).closest('.share_area').removeClass('active');
        } else{
            $(this).closest('.share_area').addClass('active');
        }
    });

    $('.btn_sns_share').on('click', function(){
        if($(this).closest('.share_area').hasClass('active')){
            $(this).closest('.share_area').removeClass('active');
        } else{
            $(this).closest('.share_area').addClass('active');
        }
    });

    // URL공유 토스트 팝업
    $('.btn_share_link').on('click', function(){
        $('.toast_wrap_share').addClass('on');
        setTimeout(function(){
            $('.toast_wrap_share').removeClass('on');
        }, 2500);
    });
    // // SNS 공유하기

    // 포인트 관련 플로팅 UI
    $(window).scroll(function() {
        const feedbackArea = document.querySelector('#feedback_area');
        const clientRect = feedbackArea.getBoundingClientRect();
        const relativeTop = clientRect.top; //뷰포트 상의 피드백 영역의 상대 위치
        const scrolledTopLength = window.pageYOffset; // 스크롤된 길이 
    
        const absoluteTop = scrolledTopLength + relativeTop; 
    
        // console.log(absoluteTop);
    
        const conBtm = document.getElementById("conBtm").offsetHeight;
        const footer = document.getElementById("footer").offsetHeight;
    
        const btm =  conBtm + footer;
    
        // console.log(btm);

        // gif 노출 관련
        if ($(this).scrollTop() <= (absoluteTop - btm)) {
            $('#btnPointWrap').fadeIn();
        } else {
            $('#btnPointWrap').fadeOut();
        }
    });

    //클릭시 스크롤 이동 이벤트
    $('.scrollToEv').on('click', function(){
        const insView = $('.con_btm_inner').offset().top;
        window.scrollTo({top: insView, behavior: "smooth"});
    });
    // // 포인트 관련 플로팅 UI

    // 퍼블임시 마케팅 수신동의만했을 때
    $('.chk_agr_mkt').on('click', function(){
        $('.toast_wrap_re').addClass('on');
        setTimeout(function(){
            $('.toast_wrap_re').removeClass('on');
        }, 2500);
    });
    // // 퍼블임시 마케팅 수신동의만했을 때


    // 퍼블임시 마케팅 수신 항복 미선택시 토스트 메세지
    $('.btn_agree').on('click', function(){
        $('.toast_wrap_agree').addClass('on');
        setTimeout(function(){
            $('.toast_wrap_agree').removeClass('on');
        }, 2500);
    });
    // // 퍼블임시 마케팅 수신 항복 미선택시 토스트 메세지

    // 퍼블임시 로그인 컨펌 팝업
    $('.confirm_btn_box .confirm_btn').on('click', function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $('#poplogin').removeClass('active');
            $('.dim').removeClass('active');
            $('html').removeClass('lock');
        } else{
            $(this).addClass('active');
            $('#poplogin').addClass('active'); 
            $('.dim').addClass('active');
            $('html').addClass('lock');
        }
    });

    $('.dialog-btn > button').on('click', function(){
        if($('#poplogin').hasClass('active')){
            $('#poplogin').removeClass('active');
            $('.dim').removeClass('active');
            $('html').removeClass('lock');
        } else{
            $('#poplogin').addClass('active');
            $('.dim').addClass('active');
            $('html').addClass('lock');
        }
    });
    // // 퍼블임시 로그인 컨펌 팝업
});

// 동의영역 전체 선택
function chkall() {
	if($("#chkAll").is(':checked')) {
		$("input[name=typ-all]").prop("checked", true);
	} else {
		$("input[name=typ-all]").prop("checked", false);
	}
}

$(document).on("click", "input:checkbox[name=typ-all]", function(e) {
	
	var chks = document.getElementsByName("typ-all");
	var chksChecked = 0;
	
	for(var i=0; i<chks.length; i++) {
		var cbox = chks[i];
		
		if(cbox.checked) {
			chksChecked++;
		}
	}
	
	if(chks.length == chksChecked){
		$("#chkAll").prop("checked", true);
	}else{
		$("#chkAll").prop("checked",false);
	}
	
});
// // 동의영역 전체 선택

// 약관팝업 노출
function popOpen(id) {
    var $lyAcive = $('#' + id);
    $('html').addClass('lock');

    $lyAcive.show();
    $lyAcive.addClass('open');
    $('.dim').addClass('active');
}

function popClose(id) {
    var $lyAcive = $('#' + id);
    $('html').removeClass('lock');

    $lyAcive.hide();
    $lyAcive.removeClass('open');
    $('.dim').removeClass('active');
}
// // 약관팝업 노출
