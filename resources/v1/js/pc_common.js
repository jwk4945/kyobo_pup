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

    // $('.dim').on('click', function(){
    //     if($('#popShare').hasClass('active')){
    //         $('#popShare').removeClass('active');
    //         $('#link_share').removeClass('active');
    //         $('.dim').removeClass('active');
    //         $('html').removeClass('lock');
    //     }
    // });

    // //SNS 공유하기


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

    // 로그인 컨펌 팝업
    // $('#header').on('click', function(){
    //     console.log(222)
    //     if($(this).hasClass('active')){
    //         $(this).removeClass('active');
    //         $('#poplogin').removeClass('active');
    //         $('.dim').removeClass('active');
    //         $('html').removeClass('lock');
    //     } else{
    //         $(this).addClass('active');
    //         $('#poplogin').addClass('active'); 
    //         $('.dim').addClass('active');
    //         $('html').addClass('lock');
    //     }
    // });

    // $('.dialog-btn > button').on('click', function(){
    //     if($('#poplogin').hasClass('active')){
    //         $('#poplogin').removeClass('active');
    //         $('.dim').removeClass('active');
    //         $('html').removeClass('lock');
    //     } else{
    //         $('#poplogin').addClass('active');
    //         $('.dim').addClass('active');
    //         $('html').addClass('lock');
    //     }
    // });
    // // 로그인 컨펌 팝업
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
}

function popClose(id) {
    var $lyAcive = $('#' + id);
    $('html').removeClass('lock');

    $lyAcive.hide();
    $lyAcive.removeClass('open');
}
// // 약관팝업 노출
