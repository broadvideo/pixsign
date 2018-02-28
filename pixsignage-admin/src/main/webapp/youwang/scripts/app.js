$('.mode-switch .btn').click(function() {
    $(this).parent('.mode-switch').find('.btn').removeClass('selected')
    $(this).addClass('selected')
})

$('.tab-item').click(function() {
    $(this).parent('.colorful-tab').find('.tab-item').removeClass('selected')
    $(this).addClass('selected')
})

$('.custom-checkbox').click(function(){
    if ($(this).hasClass('checked')) {
        $(this).removeClass('checked')
        $(this).find('label:first').show()
        $(this).find('label:last').hide()
    } else {
        $(this).addClass('checked')
        $(this).find('label:first').hide()
        $(this).find('label:last').show()
    }
})