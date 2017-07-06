var VideoZone = function (zonediv, zone) {
	this.zonediv = zonediv;
	this.zone = zone;
	
	var _list = [];
	var _curr = 0;
	
	var play = function() {
		_curr ++;
		if (_curr >= _list.length) {
			_curr = 0;
		}
		$(zonediv).find('video').attr('src', '../../videos/' + _list[_curr].filename);
		$(zonediv).find('video').load();
		$(zonediv).find('video').play();
	};
	
	var init = function () {
		var pagezonedtls = zone.pagezonedtls;
		var video_element = document.createElement('video');
		$(video_element).attr('autoplay', 'autoplay');
		$(video_element).css({
			'object-fit': 'fill',
			'width': '100%',
			'height': '100%',
		});
		if (pagezonedtls.length > 0) {
			$(video_element).attr('src', '../../videos/' + pagezonedtls[0].video.filename);
		}
		video_element.addEventListener('ended', play);
		$(zonediv).find('#PagezoneCT').append(video_element);
		for (var i=0; i<pagezonedtls.length; i++) {
			_list.push(pagezonedtls[i].video);
		}
	};
	
	this.resize = function (scalew, scaleh) {
		var shadow = '';
		shadow += (parseInt(zone.shadowh) / scalew) + 'px ';
		shadow += (parseInt(zone.shadowv) / scaleh) + 'px ';
		shadow += (parseInt(zone.shadowblur) / scalew) + 'px ';
		shadow += zone.shadowcolor;
		$(zonediv).find('#PagezoneCT').css({
			'box-shadow': shadow, 
			'opacity': parseInt(zone.opacity)/255,
		});
		$(zonediv).find('video').css({
			'border-color': zone.bdcolor, 
			'border-style': zone.bdstyle, 
			'border-width': (parseInt(zone.bdwidth) / scalew) + 'px', 
			'border-radius': (parseInt(zone.bdradius) / scalew) + 'px', 
			'box-sizing': 'border-box',
		});
	};
	
	init();
};
