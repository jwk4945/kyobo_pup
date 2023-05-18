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

    // URL공유 토스트 팝업
    $('.btn_share_link').on('click', function(){
        $('.toast_wrap_share').addClass('on');
        setTimeout(function(){
            $('.toast_wrap_share').removeClass('on');
        }, 4500);
    });
    // //SNS 공유하기
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