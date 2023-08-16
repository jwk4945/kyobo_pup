$(document).ready(function (){
    // footer
    $('.footer_body .btn_more_body').on('click', function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $('.footer_body .footer_info_box').removeClass('active');
        } else{
            $(this).addClass('active');
            $('.footer_body .footer_info_box').addClass('active');
        }
    });

    // SNS 공유하기
    $('#link_share').on('click', function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $('#popShare').removeClass('active');
            $('.dim').removeClass('active');
            $('html').removeClass('lock');
        } else{
            $(this).addClass('active');
            $('#popShare').addClass('active'); 
            $('.dim').addClass('active');
            $('html').addClass('lock');
        }
    });

    $('#popShare > .btn_dialog_close').on('click', function(){
        if($('#popShare').hasClass('active')){
            $('#popShare').removeClass('active');
            $('#link_share').removeClass('active');
            $('.dim').removeClass('active');
            $('html').removeClass('lock');
        } else{
            $('#popShare').addClass('active');
            $('#link_share').addClass('active');
            $('.dim').addClass('active');
            $('html').addClass('lock');
        }
    });

    $('.dim').on('click', function(){
        if($('#popShare').hasClass('active')){
            $('#popShare').removeClass('active');
            $('#link_share').removeClass('active');
            $('.dim').removeClass('active');
            $('html').removeClass('lock');
        }
    });

    // URL공유 토스트 팝업
    $('.btn_share_link').on('click', function(){
        $('.toast_wrap_share').addClass('on');
        setTimeout(function(){
            $('.toast_wrap_share').removeClass('on');
        }, 3500);
    });
    // //SNS 공유하기

    // ios, android
    var appHidden = function() { 
		var agent = navigator.userAgent;
		agent = agent.toLowerCase();
		
		if (agent.indexOf("ipod") != -1 || agent.indexOf("iphone") != -1 || agent.indexOf("ipad") != -1) { // iOS일때
        $('body').addClass('ios');
    } else { // iOS가 아닐때
        $('body').addClass('android');
		}
    }; appHidden();
    // // ios, android

    // 마케팅 수신 항복 미선택시 토스트 메세지
    // $('.btn_agree').on('click', function(){
    //     $('.toast_wrap_agree').addClass('on');
    //     setTimeout(function(){
    //         $('.toast_wrap_agree').removeClass('on');
    //     }, 2500);
    // });

    // 제3자 제공 동의 유도 토스트 메세지
    // $('.chk_agr_mkt input').on('click', function(){
    //     if($(this).is(':checked')){
    //         console.log('체크됨');

    //         $('.toast_wrap_re').addClass('on');
    //         setTimeout(function(){
    //             $('.toast_wrap_re').removeClass('on');
    //         }, 2500);

    //     } else{
    //         console.log('체크안됨');
    //     }
    // });

    // 탑버튼
    $(window).scroll(function() {
        if ($(this).scrollTop() > 30) {
            $('.btn-fixed-top').fadeIn();
        } else {
            $('.btn-fixed-top').fadeOut();
        }
    });

    $(".btn-fixed-top").on('click', function () {
        $('html, body').stop().animate({ scrollTop: 0 }, 200);
        return false;
    });
    // // 탑버튼

    // 헤어 쉐도우 적용
    $(window).scroll(function() {
        if ($(this).scrollTop() > 5) {
            $('#header').addClass('shadow');
        } else {
            $('#header').removeClass('shadow');
        }
    });

    // 로그인 컨펌 팝업
    $('.link_login').on('click', function(){
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
    // // 로그인 컨펌 팝업
});

// 동의영역 전체 선택
function chkall() {
	if($("#chk-all").is(':checked')) {
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
		$("#chk-all").prop("checked", true);
	}else{
		$("#chk-all").prop("checked",false);
	}
	
});
// // 동의영역 전체 선택

// 약관팝업 노출
function popOpen(id) {
    var $lyAcive = $('#' + id);
    $('html').addClass('lock');

    $lyAcive.show();
    $lyAcive.addClass('open');
}

function popClose(id) {
    // var $lyAcive = $('#' + id);
    // $('html').removeClass('lock');

    // $lyAcive.hide();
    // $lyAcive.removeClass('open');
}
// // 약관팝업 노출
