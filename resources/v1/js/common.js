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
    // //SNS 공유하기
});