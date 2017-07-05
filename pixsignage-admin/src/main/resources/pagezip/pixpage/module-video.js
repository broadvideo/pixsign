var VideoCtrl = function(container) {
	var _self = this;
	this.container = container;
	
	var _list = [];
	var _curr = 0;
	
	this.addVideo = function(video) {
		_list.push(video);
	};
	
	var play = function() {
		_curr ++;
		if (_curr >= _list.length) {
			_curr = 0;
		}
		container.src = '../../videos/' + _list[_curr].filename;
		container.load();
		container.play();
	};

	var init = function(){
		container.addEventListener('ended', play);
	}
	init();
}

var VideoZone = function () {

	var init = function () {
		$('#PageDiv div[zonetype=1]').each(function() {
			var pagezoneid = $(this).attr('zoneid');
			var pagezones = Page.pagezones.filter(function (el) {
				return el.pagezoneid == pagezoneid;
			});
			
			var video_element = document.createElement('video');
			$(video_element).attr('autoplay', 'autoplay');
			$(video_element).css({
				'object-fit': 'fill',
				'width': '100%',
				'height': '100%',
			});
			if (pagezones[0].pagezonedtls.length > 0) {
				$(video_element).attr('src', '../../videos/' + pagezones[0].pagezonedtls[0].video.filename);
			}
			$(this).find('#PagezoneCT').append(video_element);
			videoctrl = new VideoCtrl(video_element);
			for (var i=0; i<pagezones[0].pagezonedtls.length; i++) {
				videoctrl.addVideo(pagezones[0].pagezonedtls[i].video);
			}
		});
	};

	return {
		init: init
	};
}();
