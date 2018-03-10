var ButtonZone = function (zonediv, zone) {
	this.zonediv = zonediv;
	this.zone = zone;

	var init = function () {
		var pagezonedtls = zone.pagezonedtls;
		if (pagezonedtls.length > 0 && pagezonedtls[0].image != null) {
			if (PixPage.mode == 'preview') {
				$(zonediv).css('background-image', 'url(/pixsigdata' + pagezonedtls[0].image.filepath + ')');
			} else {
				$(zonediv).css('background-image', 'url(image/' + pagezonedtls[0].image.filename + ')');
			}
			$(zonediv).css('background-size', '100% 100%');
			$(zonediv).css('background-position', 'center');
			$(zonediv).css('background-repeat', 'no-repeat');
		}
		var a_element = document.createElement('a');
		if (zone.touchtype == 0) {
			if (PixPage.mode != 'preview') {
				if (typeof(TeaTableAndroidBridge) == 'undefined') {
					closeAllAndroidWindow();
					a_element.href = 'javascript:history.back(-1)';
				} else {
					a_element.href = 'javascript:TeaTableAndroidBridge.back()';
				}
			}
		} else if (zone.touchtype == 1) {
			if (PixPage.mode != 'preview') {
				if (typeof(TeaTableAndroidBridge) == 'undefined') {
					closeAllAndroidWindow();
					a_element.href = 'index.html';
				} else {
					a_element.href = 'javascript:TeaTableAndroidBridge.backtohome()';
				}
			}
		} else if (zone.touchtype == 2) {
			if (PixPage.mode != 'preview') {
				closeAllAndroidWindow();
				a_element.href = zone.touchpageid + '.html';
			}
		} else if (zone.touchtype == 3) {
			if (zone.diyaction != null) {
				$(a_element).attr('href', 'javascript:;');
				$(a_element).attr('diyaction', zone.diyaction.code);
				$(a_element).click(function(e) {
					if (PixPage.diymodules.length > 0) {
						PixPage.diymodules[0].doAction($(a_element).attr('diyaction'));
					}
				});
			}
		}
		$(zonediv).wrap(a_element);
		var p_element = document.createElement('p');
		$(p_element).html(zone.content);
		$(zonediv).append(p_element);
		
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
					$('#PagezoneDiv' + zone.pagezoneid + ' p').html(zone.content);
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
	
	var closeAllAndroidWindow = function () {
		try {
			android.closeAllAndroidWindow();
		} catch (e) { }
	};

	this.resize = function (scalew, scaleh) {
		var shadow = '';
		shadow += (parseInt(zone.shadowh) / scalew) + 'px ';
		shadow += (parseInt(zone.shadowv) / scaleh) + 'px ';
		shadow += (parseInt(zone.shadowblur) / scalew) + 'px ';
		shadow += zone.shadowcolor;
		$(zonediv).css({
			'box-sizing': 'border-box',
			'border-color': zone.bdcolor, 
			'border-style': zone.bdstyle, 
			'border-width': Math.ceil(parseInt(zone.bdwidth) / scalew) + 'px', 
			'border-radius': Math.ceil(parseInt(zone.bdradius) / scalew) + 'px', 
			'color': zone.color, 
			'font-family': zone.fontfamily, 
			'font-size': Math.ceil(parseInt(zone.fontsize) / scalew) + 'px', 
			'text-decoration': zone.decoration, 
			'text-align': zone.align, 
			'font-weight': zone.fontweight, 
			'font-style': zone.fontstyle, 
			'line-height': Math.ceil(parseInt(zone.lineheight) / scaleh) + 'px', 
			'text-shadow': shadow, 
			'word-wrap': 'break-word',
		});
		$(zonediv).find('p').css({
			'word-wrap': 'break-word',
			'white-space': 'pre-wrap',
			'text-decoration': zone.decoration,
			'margin': '0 0 0px',
		});
	};
	
	init();
};
