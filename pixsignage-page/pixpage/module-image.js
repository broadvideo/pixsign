var ImageZone = function (zonediv, zone) {
	this.zonediv = zonediv;
	this.zone = zone;
	
	var init = function () {
		var pagezonedtls = zone.pagezonedtls;
		if (pagezonedtls.length == 1 && pagezonedtls[0].image != null) {
			var img_element = document.createElement('img');
			if (PixPage.mode == 'preview') {
				$(img_element).attr('src', '/pixsigdata' + pagezonedtls[0].image.filepath);
			} else {
				$(img_element).attr('src', 'image/' + pagezonedtls[0].image.filename);
			}
			$(img_element).attr('width', '100%');
			$(img_element).attr('height', '100%');
			$(zonediv).append(img_element);
		} else if (pagezonedtls.length > 1) {
			var ul_element = document.createElement('ul');
			$(ul_element).addClass('bxslider');
			for (var i=0; i<pagezonedtls.length; i++) {
				if (pagezonedtls[i].image != null) {
					if (PixPage.mode == 'preview') {
						$(ul_element).append('<li><img src="/pixsigdata' + pagezonedtls[i].image.filepath + '" width="100%" height="100%"/></li>');
					} else {
						$(ul_element).append('<li><img src="image/' + pagezonedtls[i].image.filename + '" width="100%" height="100%"/></li>');
					}
				}
			}
			$(zonediv).append(ul_element);
			$(ul_element).bxSlider({
				auto: true,
				controls: false,
				pager: false,
				pause: 10000,
			});
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
					$('#PagezoneDiv' + zone.pagezoneid + ' img').html('');
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
		$(zonediv).find('img').css({
			'box-sizing': 'border-box',
			'border-color': zone.bdcolor, 
			'border-style': zone.bdstyle, 
			'border-width': Math.ceil(parseInt(zone.bdwidth) / scalew) + 'px', 
			'border-radius': Math.ceil(parseInt(zone.bdradius) / scalew) + 'px', 
		});

		$(zonediv).find('.bx-wrapper').css({
			'background-color': 'transparent', 
			'width': $(zonediv).width(),
			'height': $(zonediv).height(),
			'border': '0px',
			'-webkit-box-shadow': '0 0 0px',
			'box-shadow': '0 0 0px',
		});
		$(zonediv).find('.bx-viewport').css({
			'width': $(zonediv).width(),
			'height': $(zonediv).height(),
		});
		$(zonediv).find('.bx-viewport').find('img').css({
			'width': $(zonediv).width(),
			'height': $(zonediv).height(),
		});
		$(zonediv).find('.bx-viewport').find('li').css({
			'width': $(zonediv).width(),
			'height': $(zonediv).height(),
		});
	};
	
	init();
};
