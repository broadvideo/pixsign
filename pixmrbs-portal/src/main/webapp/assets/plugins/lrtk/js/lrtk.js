//����ͼ�� www.lanrentuku.com��
$(document).ready(function () {
    $('.listimg').hover(function () {
        $(".summary", this).stop().animate({top: '110px'}, {queue: false, duration: 180});
    }, function () {
        $(".summary", this).stop().animate({top: '165px'}, {queue: false, duration: 180});
    });
});