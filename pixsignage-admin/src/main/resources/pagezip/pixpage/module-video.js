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
		if (PixPage.mode == 'preview') {
			$(zonediv).find('video').attr('src', '/pixsigdata' + _list[_curr].filepath);
		} else {
			$(zonediv).find('video').attr('src', '../../videos/' + _list[_curr].filename);
		}
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
			if (PixPage.mode == 'preview') {
				$(video_element).attr('src', '/pixsigdata' + pagezonedtls[0].video.filepath);
			} else {
				$(video_element).attr('src', '../../videos/' + pagezonedtls[0].video.filename);
			}
		}
		video_element.addEventListener('ended', play);
		$(zonediv).append(video_element);
		for (var i=0; i<pagezonedtls.length; i++) {
			_list.push(pagezonedtls[i].video);
		}

		if (zone.fixflag == 0) {
			var myElement = document.getElementById('PagezoneDiv' + zone.pagezoneid);
			var mc = new Hammer.Manager(myElement);
			var pan = new Hammer.Pan();
			var pinch = new Hammer.Pinch();
			var rotate = new Hammer.Rotate();
			pinch.recognizeWith(rotate);
			mc.add([pan, pinch, rotate]);
			
			var lastPosX = 0, lastPosY = 0, posX = 0, posY = 0;
			var scale = 1, last_scale = 1;
			var rotation = 0, last_rotation = 0, start_rotation = 0;
			var zindex = zone.zindex;
			mc.on('pan panend pinchstart pinch pinchend rotatestart rotate rotateend tap multitap', function(e) {
				e.preventDefault();
				if (zindex < PixPage.maxzindex) {
					PixPage.maxzindex ++;
					zindex = PixPage.maxzindex;
					$('#PagezoneDiv' + zone.pagezoneid).css('z-index', zindex);
					$('#PagezoneDiv' + zone.pagezoneid + ' video').html('');
				}
				switch (e.type) {
					case 'pan':
						posX = e.deltaX + lastPosX;
						posY = e.deltaY + lastPosY;
						break;
					case 'panend':
						lastPosX = posX;
						lastPosY = posY;
						break;
					case 'pinchstart':
						last_scale = scale;
						break;
					case 'pinch':
						scale = Math.max(1, Math.min(last_scale * e.scale, 10));
						break;
					case 'pinchend':
						last_scale = scale;
						break;
					case 'rotatestart':
						last_scale = scale;
						last_rotation = rotation;
						start_rotation = e.rotation;
						break;
					case 'rotate':
						rotation = last_rotation - start_rotation + e.rotation;
						break;
					case 'rotateend':
						last_scale = scale;
						last_rotation = rotation;
						break;
				}
				$('#PagezoneDiv' + zone.pagezoneid).css('-webkit-transform', 'translate3d(' + posX +'px,' + posY + 'px, 0 ) rotate(' + rotation + 'deg)' + ' scale3d(' + scale + ', ' + scale + ', 1 )');
			});
		}
	};
	
	this.resize = function (scalew, scaleh) {
		var shadow = '';
		shadow += Math.ceil(parseInt(zone.shadowh) / scalew) + 'px ';
		shadow += Math.ceil(parseInt(zone.shadowv) / scaleh) + 'px ';
		shadow += Math.ceil(parseInt(zone.shadowblur) / scalew) + 'px ';
		shadow += zone.shadowcolor;
		$(zonediv).css({
			'box-shadow': shadow, 
			'opacity': parseInt(zone.opacity)/255,
		});
		$(zonediv).find('video').css({
			'box-sizing': 'border-box',
			'border-color': zone.bdcolor, 
			'border-style': zone.bdstyle, 
			'border-width': Math.ceil(parseInt(zone.bdwidth) / scalew) + 'px', 
			'border-radius': Math.ceil(parseInt(zone.bdradius) / scalew) + 'px', 
		});
	};
	
	init();
};
