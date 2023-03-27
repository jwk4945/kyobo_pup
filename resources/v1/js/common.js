$(document).ready(function (){
    $('.footer_body .btn_more_body').on('click', function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $('.footer_body .footer_info_box').removeClass('active');
        } else{
            $(this).addClass('active');
            $('.footer_body .footer_info_box').addClass('active');
        }
    });
});
