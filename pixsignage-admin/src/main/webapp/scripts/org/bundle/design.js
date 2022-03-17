var BundleDesignModule = function (mode) {
	var _self = this;
	var _mode = mode;  //'bundle', 'templet'
	this.Object = {};
	this.Objectid = 0;
	this.Zone = {};
	this.Subobjects = [];
	
	var ZoneLimits = [];
	var ZoneRatios = [];
	var BundleScale = 1;

	var init = function () {
		ZoneLimits['0'] = 3;
		ZoneLimits['1'] = 30;
		ZoneLimits['2'] = 10;
		ZoneLimits['3'] = 100;
		ZoneLimits['4'] = 5;
		ZoneLimits['5'] = 2;
		ZoneLimits['6'] = 1;
		ZoneLimits['7'] = 100;
		ZoneLimits['8'] = 1;
		ZoneLimits['9'] = 1;
		ZoneLimits['10'] = 1;
		ZoneLimits['12'] = 1;
		ZoneLimits['13'] = 1;
		ZoneLimits['14'] = 4;
		ZoneLimits['15'] = 1;
		ZoneLimits['16'] = 1;
		ZoneLimits['17'] = 1;
		ZoneLimits['101'] = 1;
		ZoneLimits['102'] = 1;
		ZoneLimits['103'] = 1;
		ZoneLimits['104'] = 1;
		ZoneLimits['105'] = 1;
		
		initEvent();
	};

	this.show = function () {
		$('#ZoneEditPanel').css('display' , 'none');
		$('#BundleDiv').empty();
		$('#BundleDiv').css('position', 'relative');
		$('#BundleDiv').css('margin-left', 'auto');
		$('#BundleDiv').css('margin-right', 'auto');
		$('#BundleDiv').css('border', '1px solid #000');
		if (_self.Object.width > _self.Object.height) {
			var width = Math.floor($('#BundleDiv').parent().width());
			BundleScale = _self.Object.width / width;
			var height = _self.Object.height / BundleScale;
		} else {
			var height = Math.floor($('#BundleDiv').parent().width());
			BundleScale = _self.Object.height / height;
			var width = _self.Object.width / BundleScale;
		}
		$('#BundleDiv').css('width' , width);
		$('#BundleDiv').css('height' , height);
		
		var bundlezones = _self.Object.bundlezones;
		for (var i=0; i<bundlezones.length; i++) {
			createZone(bundlezones[i]);
		}
		unselectAllZones();
	};

	var createZone = function(bundlezone) {
		var bundlezone_div = document.createElement('div');
		bundlezone_div.id = 'BundlezoneDiv' + bundlezone.bundlezoneid;
		bundlezone_div.unselectable = 'off';
		$(bundlezone_div).attr('bundlezoneid', bundlezone.bundlezoneid);
		var background_div = document.createElement('div');
		background_div.id = 'background';
		var inner_div = document.createElement('div');
		inner_div.id = 'rotatable';
		$(bundlezone_div).append(background_div);
		$(bundlezone_div).append(inner_div);
		$('#BundleDiv').append(bundlezone_div);	

		if (bundlezone.type == 0) {
			//Advert Zone
			var p_element = document.createElement('p');
			$(inner_div).append(p_element);
		} else if (bundlezone.type == 1) {
			//Play Zone
			var img_element = document.createElement('img');
			$(inner_div).append(img_element);
		} else if (bundlezone.type == 2) {
			//Widget Zone
			var p_element = document.createElement('p');
			$(inner_div).append(p_element);
		} else if (bundlezone.type == 3) {
			//Text Zone
			var p_element = document.createElement('p');
			$(inner_div).append(p_element);
			$(inner_div).find('p').css({
				'word-wrap': 'break-word',
				'white-space': 'pre-wrap',
			});
		} else if (bundlezone.type == 4) {
			//Scroll Zone
			var marquee_element = document.createElement('marquee');
			$(marquee_element).attr('direction', 'left');
			$(marquee_element).attr('behavior', 'scroll');
			$(marquee_element).attr('scrollamount', '1');
			$(marquee_element).attr('scrolldelay', '0');
			$(marquee_element).attr('loop', '-1');
			$(inner_div).append(marquee_element);
		} else if (bundlezone.type == 5) {
			//Date Zone
			var p_element = document.createElement('p');
			$(inner_div).append(p_element);
		} else if (bundlezone.type == 6) {
			//Weather Zone
			var span_element = document.createElement('span');
			$(inner_div).append(span_element);
		} else if (bundlezone.type == 7) {
			//Button Zone
			var p_element = document.createElement('p');
			$(inner_div).append(p_element);
		} else if (bundlezone.type == 8) {
			//Navigator Zone
			var img_element = document.createElement('img');
			$(inner_div).append(img_element);
		} else if (bundlezone.type == 9) {
			//Control Zone
			var img_element = document.createElement('img');
			$(inner_div).append(img_element);
		} else if (bundlezone.type == 10) {
			//Menu Zone
		} else if (bundlezone.type == 12) {
			//RSS Zone
			var p_element = document.createElement('p');
			$(inner_div).append(p_element);
		} else if (bundlezone.type == 13) {
			//Audio Zone
			var p_element = document.createElement('p');
			$(inner_div).append(p_element);
		} else if (bundlezone.type == 14) {
			//Stream Zone
			var img_element = document.createElement('img');
			$(inner_div).append(img_element);
		} else if (bundlezone.type == 15) {
			//VideoIn Zone
			var img_element = document.createElement('img');
			$(inner_div).append(img_element);
		} else if (bundlezone.type == 16) {
			//DVB Zone
			var img_element = document.createElement('img');
			$(inner_div).append(img_element);
		} else if (bundlezone.type == 17) {
			//Page Zone
			var img_element = document.createElement('img');
			$(inner_div).append(img_element);
		} else if (bundlezone.type == 101 || bundlezone.type == 102 || bundlezone.type == 103 || bundlezone.type == 104) {
			//Massage Zone & Cloudia Zone
			var img_element = document.createElement('img');
			$(inner_div).append(img_element);
		} else {
			var p_element = document.createElement('p');
			$(p_element).append(eval('common.view.region_type_' + bundlezone.type));
			$(inner_div).append(p_element);
		}

		$(bundlezone_div).draggable({
			containment: '#BundleDiv',
			//stop: regionPositionUpdate,
			drag: updateBundlezonePos,
		});
		
		$(bundlezone_div).resizable({
			containment: '#BundleDiv',
			aspectRatio: false,
			handles: 'ne, nw, se, sw',
			stop: updateBundlezonePos,
		});

		refreshBundlezone(bundlezone);
	}

	var refreshBundlezone = function(bundlezone) {
		$('.bundlezone-title').html(eval('common.view.region_mainflag_' + bundlezone.mainflag) + eval('common.view.region_type_' + bundlezone.type));
		var bundlezoneDiv = $('#BundlezoneDiv' + bundlezone.bundlezoneid);
		$(bundlezoneDiv).css({
			'position': 'absolute',
			'width': 100*bundlezone.width/_self.Object.width + '%',
			'height': 100*bundlezone.height/_self.Object.height + '%',
			'top': 100*bundlezone.topoffset/_self.Object.height + '%', 
			'left': 100*bundlezone.leftoffset/_self.Object.width + '%', 
			'z-index': bundlezone.zindex,
			'-moz-transform': 'matrix(1, 0, 0, 1, 0, 0)',
			'-webkit-transform': 'matrix(1, 0, 0, 1, 0, 0)',
		});
		$(bundlezoneDiv).find('#rotatable').css({
			'position': 'absolute',
			'height': '100%', 
			'width': '100%', 
		});
		$(bundlezoneDiv).find('#background').css({
			'position': 'absolute',
			'width': '100%',
			'height': '100%',
			'opacity': parseInt(bundlezone.bgopacity)/255, 
			'background-color': bundlezone.bgcolor,
			'background-size': '100% 100%',
			'background-repeat': 'no-repeat',
		});
		if (bundlezone.bgimage != null) {
			$(bundlezoneDiv).find('#background').css({'background-image': 'url(/pixsigdata' + bundlezone.bgimage.thumbnail + ')' });
		} else {
			$(bundlezoneDiv).find('#background').css({'background-image': 'none'});
		}
		if (bundlezone.type == 0) {
			//Advert Zone
			$(bundlezoneDiv).find('p').html(bundlezone.content);
			$(bundlezoneDiv).find('#rotatable').css({
				'box-sizing': 'border-box',
				'color': '#FFFFFF', 
				'font-size': Math.ceil(50 * bundlezone.height / 100 / BundleScale) + 'px', 
				'line-height': Math.ceil(bundlezone.height / BundleScale) + 'px', 
				'word-wrap': 'break-word',
			});
		} else if (bundlezone.type == 1) {
			//Play Zone
			$(bundlezoneDiv).find('img').css({
				'box-sizing': 'border-box',
			});
			if (bundlezone.bundlezonedtls.length > 0 && bundlezone.bundlezonedtls[0].video != null) {
				$(bundlezoneDiv).find('img').attr('src', '/pixsigdata' + bundlezone.bundlezonedtls[0].video.thumbnail);
				$(bundlezoneDiv).find('img').attr('width', '100%');
				$(bundlezoneDiv).find('img').attr('height', '100%');
			} else if (bundlezone.bundlezonedtls.length > 0 && bundlezone.bundlezonedtls[0].image != null) {
				$(bundlezoneDiv).find('img').attr('src', '/pixsigdata' + bundlezone.bundlezonedtls[0].image.thumbnail);
				$(bundlezoneDiv).find('img').attr('width', '100%');
				$(bundlezoneDiv).find('img').attr('height', '100%');
			}
		} else if (bundlezone.type == 2) {
			//Widget Zone
			$(bundlezoneDiv).find('#rotatable').css({
				'box-sizing': 'border-box',
				'text-align': 'left', 
				'word-wrap': 'break-word',
			});
			$(bundlezoneDiv).find('p').html(bundlezone.content);
		} else if (bundlezone.type == 3) {
			//Text Zone
			var text_val = bundlezone.content;
			if (text_val == undefined || text_val == null || text_val == '') {
				text_val = 'Text';
			} else {
				text_val = text_val.replace(/&nbsp;/g, ' ');
			}
			$(bundlezoneDiv).find('p').html(text_val);

			$(bundlezoneDiv).find('#rotatable').css({
				'box-sizing': 'border-box',
				'color': bundlezone.color, 
				'font-size': Math.ceil(bundlezone.size * bundlezone.height / 100 / BundleScale) + 'px', 
				'line-height': Math.ceil(bundlezone.height / BundleScale) + 'px', 
				'word-wrap': 'break-word',
			});
		} else if (bundlezone.type == 4) {
			//Scroll Zone
			var text_val = bundlezone.content;
			if (text_val == undefined || text_val == null || text_val == '') {
				text_val = 'Scrolling Text';
			} else {
				text_val = text_val.replace(/&nbsp;/g, ' ');
			}
			$(bundlezoneDiv).find('marquee').html(text_val);
			$(bundlezoneDiv).find('marquee').attr('scrollamount', bundlezone.speed*3);
			
			$(bundlezoneDiv).find('#rotatable').css({
				'box-sizing': 'border-box',
				'color': bundlezone.color, 
				'font-size': Math.ceil(bundlezone.size * bundlezone.height / 100 / BundleScale) + 'px', 
				'line-height': Math.ceil(bundlezone.height / BundleScale) + 'px', 
				'word-wrap': 'break-word',
			});
		} else if (bundlezone.type == 5) {
			//Date Zone
			$(bundlezoneDiv).find('#rotatable').css({
				'box-sizing': 'border-box',
				'color': bundlezone.color, 
				'font-size': Math.ceil(bundlezone.size * bundlezone.height / 100 / BundleScale) + 'px', 
				'line-height': Math.ceil(bundlezone.height / BundleScale) + 'px', 
				'word-wrap': 'break-word',
			});
			$(bundlezoneDiv).find('p').html(new Date().pattern(bundlezone.dateformat));
		} else if (bundlezone.type == 6) {
			//Weather Zone
			$(bundlezoneDiv).find('span').css({
				'text-align': 'center',
				'overflow': 'hidden',
				'text-overflow': 'clip',
				'white-space': 'nowrap',
				'color': bundlezone.color,
				'font-size': Math.ceil(bundlezone.size * bundlezone.height / 100 / BundleScale) + 'px', 
				'line-height': Math.ceil(bundlezone.height / BundleScale) + 'px', 
			});
			$(bundlezoneDiv).find('span').html('City <img src="/pixsignage-page/image/weather/30.png" /> 30℃');
			$(bundlezoneDiv).find('img').each(function() {
				$(this).css('height', Math.ceil(bundlezone.size * bundlezone.height / 100 / BundleScale) + 'px');
				$(this).css('display', 'inline');
			});
		} else if (bundlezone.type == 7) {
			//Button Zone
			$(bundlezoneDiv).find('#rotatable').css({
				'box-sizing': 'border-box',
				'color': bundlezone.color, 
				'font-size': Math.ceil(bundlezone.size * bundlezone.height / 100 / BundleScale) + 'px', 
				'line-height': Math.ceil(bundlezone.height / BundleScale) + 'px', 
				'word-wrap': 'break-word',
			});
			$(bundlezoneDiv).find('p').html(bundlezone.touchlabel);
		} else if (bundlezone.type == 8) {
			//Navigator Zone
			if (bundlezone.width > bundlezone.height) {
				$(bundlezoneDiv).find('img').attr('src', '/pixsignage/img/zone/zone-navigate-h.jpg');
			} else {
				$(bundlezoneDiv).find('img').attr('src', '/pixsignage/img/zone/zone-navigate-v.jpg');
			}
			$(bundlezoneDiv).find('img').attr('width', '100%');
			$(bundlezoneDiv).find('img').attr('height', '100%');
		} else if (bundlezone.type == 9) {
			//Control Zone
			$(bundlezoneDiv).find('img').attr('src', '/pixsignage/img/zone/zone-qrcode.jpg');
			$(bundlezoneDiv).find('img').attr('width', '100%');
			$(bundlezoneDiv).find('img').attr('height', '100%');
		} else if (bundlezone.type == 10) {
			//Menu Zone
			var menuscale = 1;
			$(bundlezoneDiv).find('#rotatable').empty();
			$(bundlezoneDiv).find('#rotatable').css({
				'box-sizing': 'border-box',
				'color': bundlezone.color, 
				'overflow': 'hidden',
			});
			if (bundlezone.width > bundlezone.height) {
				var menupercent = 100*menuscale*bundlezone.height/bundlezone.width;
				for (var i=0; i<bundlezone.bundlezonedtls.length; i++) {
					var menu_div = document.createElement('div');
					var bgurl = '/pixsigdata' + bundlezone.bundlezonedtls[i].image.thumbnail;
					$(menu_div).css({
						'position': 'absolute',
						'height': '100%', 
						'width': menupercent + '%',
						'top': '0%',
						'left': i*menupercent + '%',
						'background-image': 'url(' + bgurl + ')',
						'background-size': 'contain',
						'background-position': 'center',
						'background-repeat': 'no-repeat',
					});
					$(bundlezoneDiv).find('#rotatable').append(menu_div);
				}
			} else {
				var menupercent = 100/menuscale*bundlezone.width/bundlezone.height;
				for (var i=0; i<bundlezone.bundlezonedtls.length; i++) {
					var menu_div = document.createElement('div');
					var bgurl = '/pixsigdata' + bundlezone.bundlezonedtls[i].image.thumbnail;
					$(menu_div).css({
						'position': 'absolute',
						'height': menupercent + '%',
						'width': '100%',
						'top': i*menupercent + '%',
						'left': '0%',
						'background-image': 'url(' + bgurl + ')',
						'background-size': 'contain',
						'background-position': 'center',
						'background-repeat': 'no-repeat',
					});
					$(bundlezoneDiv).find('#rotatable').append(menu_div);
				}
			}
		} else if (bundlezone.type == 12) {
			//RSS Zone
			$(bundlezoneDiv).find('#rotatable').css({
				'box-sizing': 'border-box',
				'text-align': 'left', 
				'word-wrap': 'break-word',
			});
			$(bundlezoneDiv).find('p').html(bundlezone.content);
		} else if (bundlezone.type == 13) {
			//Audio Zone
			$(bundlezoneDiv).find('#rotatable').css({
				'box-sizing': 'border-box',
				'text-align': 'left', 
				'word-wrap': 'break-word',
			});
			$(bundlezoneDiv).find('p').html('Audio');
		} else if (bundlezone.type == 14) {
			//Stream Zone
			$(bundlezoneDiv).find('img').attr('src', '/pixsignage/img/zone/zone-stream.jpg');
			$(bundlezoneDiv).find('img').attr('width', '100%');
			$(bundlezoneDiv).find('img').attr('height', '100%');
		} else if (bundlezone.type == 15) {
			//VideoIn Zone
			$(bundlezoneDiv).find('img').attr('src', '/pixsignage/img/zone/zone-videoin.jpg');
			$(bundlezoneDiv).find('img').attr('width', '100%');
			$(bundlezoneDiv).find('img').attr('height', '100%');
		} else if (bundlezone.type == 16) {
			//DVB Zone
			$(bundlezoneDiv).find('img').attr('src', '/pixsignage/img/zone/zone-dvb.jpg');
			$(bundlezoneDiv).find('img').attr('width', '100%');
			$(bundlezoneDiv).find('img').attr('height', '100%');
		} else if (bundlezone.type == 17) {
			//Page Zone
			$(bundlezoneDiv).find('img').css({
				'box-sizing': 'border-box',
			});
			if (bundlezone.bundlezonedtls.length > 0 && bundlezone.bundlezonedtls[0].page != null) {
				$(bundlezoneDiv).find('img').attr('src', '/pixsigdata' + bundlezone.bundlezonedtls[0].page.snapshot);
				$(bundlezoneDiv).find('img').attr('width', '100%');
				$(bundlezoneDiv).find('img').attr('height', '100%');
			}
		} else if (bundlezone.type == 101 || bundlezone.type == 102 || bundlezone.type == 103 || bundlezone.type == 104) {
			//Massage Zone & Cloudia Zone
			$(bundlezoneDiv).find('img').attr('src', '/pixsignage/img/zone/zone-' + bundlezone.type + '.jpg');
			$(bundlezoneDiv).find('img').attr('width', '100%');
			$(bundlezoneDiv).find('img').attr('height', '100%');
		} else {
			$(bundlezoneDiv).find('#rotatable').css({
				'box-sizing': 'border-box',
				'color': '#FFFFFF', 
				'font-size': Math.ceil(50 * bundlezone.height / 100 / BundleScale) + 'px', 
				'line-height': Math.ceil(bundlezone.height / BundleScale) + 'px', 
				'word-wrap': 'break-word',
			});
			$(bundlezoneDiv).find('p').css({
				'word-wrap': 'break-word',
				'text-align': 'center',
				'overflow': 'hidden',
				'text-overflow': 'clip',
				'white-space': 'nowrap',
			});
		}
	}

	var unselectAllZones = function() {
		for (var i=0; i<_self.Object.bundlezones.length; i++) {
			bundlezone = _self.Object.bundlezones[i];
			var bundlezonediv = $('#BundlezoneDiv' + bundlezone.bundlezoneid);
			$(bundlezonediv).css('z-index', bundlezone.zindex);
			$(bundlezonediv).css('cursor', 'default');
			$(bundlezonediv).find('#rotatable').css('cursor', 'default');
			$(bundlezonediv).removeClass('select_layer');
			$(bundlezonediv).draggable('disable');
			$(bundlezonediv).resizable('disable');
			$(bundlezonediv).find('div.ui-resizable-handle').removeClass('select');
			$(bundlezonediv).find('.ui-rotatable-handle').css('display', 'none');
		}
		$('.bundlezone-title').html('');
	};

	var selectZone = function(bundlezone) {
		var bundlezonediv = $('#BundlezoneDiv' + bundlezone.bundlezoneid);
		//$(bundlezonediv).css('z-index', '1000');
		$(bundlezonediv).css('cursor', 'move');
		$(bundlezonediv).find('#rotatable').css('cursor', 'move');
		$(bundlezonediv).addClass('select_layer');
		$(bundlezonediv).draggable('enable');
		$(bundlezonediv).resizable('enable');
		$(bundlezonediv).find('div.ui-resizable-handle').addClass('select');
		$(bundlezonediv).find('.ui-rotatable-handle').css('display', 'block');
		$('.bundlezone-title').html(eval('common.view.region_mainflag_' + bundlezone.mainflag) + eval('common.view.region_type_' + bundlezone.type));
	};

	var updateBundlezonePos = function(e, ui) {
		var bundlezoneid = $(this).attr('bundlezoneid');
		var bundlezones = _self.Object.bundlezones.filter(function (el) {
			return el.bundlezoneid == bundlezoneid;
		});

		var l = $(this).position().left / $('#BundleDiv').width();
		var t = $(this).position().top / $('#BundleDiv').height();
		var w = $(this).width() / $('#BundleDiv').width();
		var h = $(this).height() / $('#BundleDiv').height();

		bundlezones[0].width = Math.round(_self.Object.width * w, 0);
		bundlezones[0].height = Math.round(_self.Object.height * h, 0);
		bundlezones[0].leftoffset = Math.round(_self.Object.width * l, 0);
		bundlezones[0].topoffset = Math.round(_self.Object.height * t, 0);
		refreshLocSpinners(bundlezones[0]);
		refreshBundlezone(bundlezones[0]);
	}
	
	var refreshLocSpinners = function(bundlezone) {
		$('#spinner-x').spinner();
		$('#spinner-x').spinner('setting', {value:parseInt(bundlezone.leftoffset), step: 1, min: 0, max: parseInt(_self.Object.width)-parseInt(bundlezone.width)});
		$('#spinner-y').spinner();
		$('#spinner-y').spinner('setting', {value:parseInt(bundlezone.topoffset), step: 1, min: 0, max: parseInt(_self.Object.height)-parseInt(bundlezone.height)});
		$('#spinner-w').spinner();
		$('#spinner-w').spinner('setting', {value:parseInt(bundlezone.width), step: 1, min: 1, max: parseInt(_self.Object.width)-parseInt(bundlezone.leftoffset)});
		$('#spinner-h').spinner();
		$('#spinner-h').spinner('setting', {value:parseInt(bundlezone.height), step: 1, min: 1, max: parseInt(_self.Object.height)-parseInt(bundlezone.topoffset)});
	}

	var initEvent = function () {
		$('#BundleDiv').live('click', function (e) {
			var that = this;
			setTimeout(function () {
				var dblclick = parseInt($(that).data('double'), 10);
				if (dblclick > 0) {
					$(that).data('double', dblclick - 1);
				} else {
					bundlezoneClick.call(that, e, false);
				}
			}, 200);
		});
		$('#BundleDiv').live('dblclick', function (e) {
			$(this).data('double', 2);
			bundlezoneClick.call(this, e, true);
		});	   

		function bundlezoneClick(e, dblclick){
			var scale = _self.Object.width / $('#BundleDiv').width();
			var offset = $(this).offset();
			var posX = (e.pageX - offset.left) * scale;
			var posY = (e.pageY - offset.top) * scale;
			var bundlezones = _self.Object.bundlezones.filter(function (el) {
				var width = parseInt(el.width);
				var height = parseInt(el.height);
				var leftoffset = parseInt(el.leftoffset);
				var topoffset = parseInt(el.topoffset);
				return (posX > leftoffset) && (posX < (leftoffset + width)) && (posY > topoffset) && (posY < (topoffset + height));
			});
			if (bundlezones.length > 0) {
				bundlezones.sort(function(a, b) {
					return (parseInt(a.width) + parseInt(a.height) - parseInt(b.width) - parseInt(b.height));
				});

				if (validBundlezone(_self.Zone)) {
					if (dblclick) {
						if (bundlezones[0].type == 1) {
							//Play Zone
							_self.Zone = bundlezones[0];
							$('#LibraryModal #VideoLiTab').css('display', '');
							$('#LibraryModal #VideoLiTab').addClass('active');
							$('#LibraryModal #VideoLibraryTab').addClass('active');
							$('#LibraryModal #ImageLiTab').css('display', '');
							$('#LibraryModal #ImageLiTab').removeClass('active');
							$('#LibraryModal #ImageLibraryTab').removeClass('active');
							$('#LibraryModal #AudioLiTab').css('display', 'none');
							$('#LibraryModal #AudioLiTab').removeClass('active');
							$('#LibraryModal #AudioLibraryTab').removeClass('active');
							$('#LibraryModal #StreamLiTab').css('display', 'none');
							$('#LibraryModal #StreamLiTab').removeClass('active');
							$('#LibraryModal #StreamLibraryTab').removeClass('active');
							$('#LibraryModal').modal();
						} else if (bundlezones[0].type == 2) {
							//Widget Zone
							_self.Zone = bundlezones[0];
							$('#WebForm').loadJSON(_self.Zone);
							$('#WebModal').modal();
						} else if (bundlezones[0].type == 3 || bundlezones[0].type == 4) {
							//Text Zone & Scroll Zone
							_self.Zone = bundlezones[0];
							$('#TextForm').loadJSON(_self.Zone);
							$('#TextModal').modal();
						} else if (bundlezones[0].type == 7) {
							//Button Zone
							_self.Zone = bundlezones[0];
							$('#TouchForm').loadJSON(_self.Zone);
							refreshTouchtypeSelect();
							$('#TouchModal').modal();
						} else if (bundlezones[0].type == 10) {
							//Menu Zone
							_self.Zone = bundlezones[0];
							$('#LibraryModal #VideoLiTab').css('display', 'none');
							$('#LibraryModal #VideoLiTab').removeClass('active');
							$('#LibraryModal #VideoLibraryTab').removeClass('active');
							$('#LibraryModal #ImageLiTab').css('display', '');
							$('#LibraryModal #ImageLiTab').addClass('active');
							$('#LibraryModal #ImageLibraryTab').addClass('active');
							$('#LibraryModal #AudioLiTab').css('display', 'none');
							$('#LibraryModal #AudioLiTab').removeClass('active');
							$('#LibraryModal #AudioLibraryTab').removeClass('active');
							$('#LibraryModal #StreamLiTab').css('display', 'none');
							$('#LibraryModal #StreamLiTab').removeClass('active');
							$('#LibraryModal #StreamLibraryTab').removeClass('active');
							$('#LibraryModal').modal();
						} else if (bundlezones[0].type == 12) {
							//RSS Zone
							_self.Zone = bundlezones[0];
							$('#WebForm').loadJSON(_self.Zone);
							$('#WebModal').modal();
						} else if (bundlezones[0].type == 13) {
							//Audio Zone
							_self.Zone = bundlezones[0];
							$('#LibraryModal #VideoLiTab').css('display', 'none');
							$('#LibraryModal #VideoLiTab').removeClass('active');
							$('#LibraryModal #VideoLibraryTab').removeClass('active');
							$('#LibraryModal #ImageLiTab').css('display', 'none');
							$('#LibraryModal #ImageLiTab').removeClass('active');
							$('#LibraryModal #ImageLibraryTab').removeClass('active');
							$('#LibraryModal #AudioLiTab').css('display', '');
							$('#LibraryModal #AudioLiTab').addClass('active');
							$('#LibraryModal #AudioLibraryTab').addClass('active');
							$('#LibraryModal #StreamLiTab').css('display', 'none');
							$('#LibraryModal #StreamLiTab').removeClass('active');
							$('#LibraryModal #StreamLibraryTab').removeClass('active');
							$('#LibraryModal').modal();
						} else if (bundlezones[0].type == 14) {
							//Stream Zone
							_self.Zone = bundlezones[0];
							$('#LibraryModal #StreamLiTab').css('display', '');
							$('#LibraryModal #StreamLiTab').addClass('active');
							$('#LibraryModal #StreamLibraryTab').addClass('active');
							$('#LibraryModal #VideoLiTab').css('display', 'none');
							$('#LibraryModal #VideoLiTab').removeClass('active');
							$('#LibraryModal #VideoLibraryTab').removeClass('active');
							$('#LibraryModal #ImageLiTab').css('display', 'none');
							$('#LibraryModal #ImageLiTab').removeClass('active');
							$('#LibraryModal #ImageLibraryTab').removeClass('active');
							$('#LibraryModal').modal();
						} else if (bundlezones[0].type == 16) {
							//DVB Zone
							_self.Zone = bundlezones[0];
							$('#DVBSelect').select2({
								placeholder: common.tips.detail_select,
								minimumInputLength: 0,
								ajax: { 
									url: 'dvb!list.action',
									type: 'GET',
									dataType: 'json',
									data: function (term, page) {
										return {
											sSearch: term, 
											iDisplayStart: (page-1)*10,
											iDisplayLength: 10,
										};
									},
									results: function (data, page) {
										var more = (page * 10) < data.iTotalRecords; 
										return {
											results : $.map(data.aaData, function (item) {
												return {
													name:item.name, 
													id:item.dvbid,
													dvb:item
												};
											}),
											more: more
										};
									}
								},
								formatResult: function (item) {
									return item.name;
								},
								formatSelection: function (item) {
									return item.name;				
								},
								dropdownCssClass: 'bigdrop', 
								escapeMarkup: function (m) { return m; } 
							});
							console.log(_self.Zone);
							if (_self.Zone.bundlezonedtls[0] != null && _self.Zone.bundlezonedtls[0].dvb != null) {
								$('#DVBSelect').select2('data', {
									name:_self.Zone.bundlezonedtls[0].dvb.name, 
									id:_self.Zone.bundlezonedtls[0].dvb.dvbid,
									dvb:_self.Zone.bundlezonedtls[0].dvb
								});
							}
							$('#DVBModal').modal();
						} else if (bundlezones[0].type == 17) {
							//Page Zone
							_self.Zone = bundlezones[0];
							$('#PageSelect').select2({
								placeholder: common.tips.detail_select,
								minimumInputLength: 0,
								ajax: { 
									url: 'page!list.action',
									type: 'GET',
									dataType: 'json',
									data: function (term, page) {
										return {
											sSearch: term, 
											iDisplayStart: (page-1)*10,
											iDisplayLength: 10,
										};
									},
									results: function (data, page) {
										var more = (page * 10) < data.iTotalRecords; 
										return {
											results : $.map(data.aaData, function (item) {
												return {
													name:item.name, 
													id:item.pageid,
													page:item
												};
											}),
											more: more
										};
									}
								},
								formatResult: function (item) {
									var width = 40;
									var height = 40 * item.page.height / item.page.width;
									if (item.page.width < item.page.height) {
										height = 40;
										width = 40 * item.page.width / item.page.height;
									}
									var html = '<span><img src="/pixsigdata' + item.page.snapshot + '" width="' + width + 'px" height="' + height + 'px"/> ' + item.page.name + '</span>'
									return html;
								},
								formatSelection: function (item) {
									return item.name;				
								},
								dropdownCssClass: 'bigdrop', 
								escapeMarkup: function (m) { return m; } 
							});
							console.log(_self.Zone);
							if (_self.Zone.bundlezonedtls[0] != null && _self.Zone.bundlezonedtls[0].page != null) {
								$('#PageSelect').select2('data', {
									name:_self.Zone.bundlezonedtls[0].page.name, 
									id:_self.Zone.bundlezonedtls[0].page.pageid,
									page:_self.Zone.bundlezonedtls[0].page
								});
							}
							$('#PageModal').modal();
						} else {
							return;
						}
					} else {
						_self.Zone = bundlezones[0];
						unselectAllZones();
						selectZone(_self.Zone);
						enterBundlezoneFocus(_self.Zone);
					}
					
					e.stopPropagation();
				}
			}
		}

		function enterBundlezoneFocus(bundlezone) {
			if (bundlezone == null) {
				$('#ZoneEditPanel').css('display' , 'none');
				return;
			}
			$('#ZoneEditPanel').css('display' , '');
			$('.zone-ctl').css('display', 'none');
			$('.zonetype-' + bundlezone.type).css('display', 'block');
			$('.zoneform').loadJSON(bundlezone);

			$('.colorPick').wColorPicker({
				theme			: 'classic',  // set theme
				opacity			: 0.8,		// opacity level
				color			: bundlezone.color,  // set init color
				mode			: 'click',	 // mode for palette (flat, hover, click)
				position		: 'br',	   // position of palette, (tl, tc, tr, rt, rm, rb, br, bc, bl, lb, lm, lt)
				generateButton	: false,	   // if mode not flat generate button or not
				dropperButton	: false,	  // optional dropper button to use in other apps
				effect			: 'slide',	// only used when not in flat mode (none, slide, fade)
				showSpeed		: 200,		// show speed for effects
				hideSpeed		: 200,		// hide speed for effects
				onMouseover		: null,	   // callback for color mouseover
				onMouseout		: null,	   // callback for color mouseout
				onSelect		: function(color){
					if (color.indexOf('#') == 0) {
						$('.colorPick i').css('background', color);
						$('.colorPick input').val(color);
						_self.Zone.color = color;
						refreshBundlezone(_self.Zone);
					}
				},
				onDropper	   : null		// callback when dropper is clicked
			});
			$('.colorPick i').css('background', bundlezone.color);
			$('.colorPick input').val(bundlezone.color);
			
			$('.bgcolorPick').wColorPicker({
				theme			: 'classic',  // set theme
				opacity			: 0.8,		// opacity level
				color			: bundlezone.bgcolor,  // set init color
				mode			: 'click',	 // mode for palette (flat, hover, click)
				position		: 'br',	   // position of palette, (tl, tc, tr, rt, rm, rb, br, bc, bl, lb, lm, lt)
				generateButton	: false,	   // if mode not flat generate button or not
				dropperButton   : false,	  // optional dropper button to use in other apps
				effect			: 'slide',	// only used when not in flat mode (none, slide, fade)
				showSpeed		: 200,		// show speed for effects
				hideSpeed		: 200,		// hide speed for effects
				onMouseover		: null,	   // callback for color mouseover
				onMouseout		: null,	   // callback for color mouseout
				onSelect		: function(color) {
					if (color.indexOf('#') == 0) {
						$('.bgcolorPick i').css('background', color);
						$('.bgcolorPick input').val(color);
						_self.Zone.bgcolor = color;
						refreshBundlezone(_self.Zone);
					}
				},
				onDropper		: null		// callback when dropper is clicked
			});
			$('.bgcolorPick i').css('background', bundlezone.bgcolor);
			$('.bgcolorPick input').val(bundlezone.bgcolor);

			$('.intervalRange').ionRangeSlider({
				min: 5,
				max: 60,
				from: 10,
				type: 'single',
				step: 1,
				hasGrid: false,
				onChange: function(data) {
					_self.Zone.intervaltime = $('input[name=intervaltime]').val();
				}
			});
			$('.intervalRange').ionRangeSlider('update', {
				from: bundlezone.intervaltime
			});

			$('.sleepRange').ionRangeSlider({
				min: 0,
				max: 60,
				from: 10,
				type: 'single',
				step: 1,
				hasGrid: false,
				onChange: function(data) {
					_self.Zone.sleeptime = $('input[name=sleeptime]').val();
				}
			});
			$('.sleepRange').ionRangeSlider('update', {
				from: bundlezone.sleeptime
			});

			$('.volumeRange').ionRangeSlider({
				min: 0,
				max: 100,
				from: 50,
				type: 'single',
				step: 1,
				hasGrid: false,
				onChange: function(data) {
					_self.Zone.volume = $('input[name=volume]').val();
					refreshBundlezone(_self.Zone);
				}
			});
			$('.volumeRange').ionRangeSlider('update', {
				from: bundlezone.volume
			});

			$('.sizeRange').ionRangeSlider({
				min: 10,
				max: 100,
				from: 50,
				type: 'single',
				step: 1,
				hasGrid: false,
				onChange: function(data) {
					_self.Zone.size = $('input[name=size]').val();
					refreshBundlezone(_self.Zone);
				}
			});
			$('.sizeRange').ionRangeSlider('update', {
				from: bundlezone.size
			});

			$('.bgopacityRange').ionRangeSlider({
				min: 0,
				max: 255,
				from: 255,
				type: 'single',
				step: 5,
				hasGrid: false,
				onChange: function(data) {
					_self.Zone.bgopacity = $('input[name=bgopacity]').val();
					refreshBundlezone(_self.Zone);
				}
			});
			$('.bgopacityRange').ionRangeSlider('update', {
				from: bundlezone.bgopacity
			});

			$('#spinner-fontsize').spinner();
			$('#spinner-fontsize').spinner('setting', {value:parseInt(bundlezone.fontsize), step: 1, min: 12, max: 255});

			refreshAnimationSelect(bundlezone);
			refreshLocSpinners(bundlezone);
			new FolderImageSelect($('#BgImageGroup'), _self.Zone.bgimage);
		}

		$('#BgImageSelect').on('change', function(e) {
			if ($('#BgImageSelect').select2('data') != null) {
				_self.Zone.bgimageid = $('#BgImageSelect').select2('data').id;
				_self.Zone.bgimage = $('#BgImageSelect').select2('data').image;
			}
			refreshBundlezone(_self.Zone);
		});	
		$('#BgImageRemove').on('click', function(e) {
			$('#BgImageSelect').select2('val', '');
			_self.Zone.bgimageid = 0;
			_self.Zone.bgimage = null;
			refreshBundlezone(_self.Zone);
		});	

		$('.collapse').on('shown.bs.collapse', function () {
			$('.intervalRange').ionRangeSlider('update');
			$('.sleepRange').ionRangeSlider('update');
			$('.volumeRange').ionRangeSlider('update');
			$('.sizeRange').ionRangeSlider('update');
			$('.bgopacityRange').ionRangeSlider('update');
		});

		$('.spinner').on('change', function(e) {
			_self.Zone.fontsize = $('#spinner-fontsize').spinner('value');
			_self.Zone.leftoffset = $('#spinner-x').spinner('value');
			_self.Zone.topoffset = $('#spinner-y').spinner('value');
			_self.Zone.width = $('#spinner-w').spinner('value');
			_self.Zone.height = $('#spinner-h').spinner('value');
			refreshBundlezone(_self.Zone);
		});	

		function refreshAnimationSelect(bundlezone) {
			var animationlist = [
				{id: 'None', text: common.bundleanimation.none}, 
				{id: 'Random', text: common.bundleanimation.random}, 
				{id: 'FadeIn', text: common.bundleanimation.fadeIn}, 
				{id: 'SlideInLeft', text: common.bundleanimation.slideInLeft}, 
				{id: 'SlideInRight', text: common.bundleanimation.slideInRight}, 
				{id: 'SlideInUp', text: common.bundleanimation.slideInUp}, 
				{id: 'SlideInDown', text: common.bundleanimation.slideInDown}, 
				{id: 'ZoomIn', text: common.bundleanimation.zoomIn}, 
				{id: 'RotateIn', text: common.bundleanimation.rotateIn}, 
				{id: 'RotateInUpLeft', text: common.bundleanimation.rotateInUpLeft}, 
				{id: 'FlipInX', text: common.bundleanimation.flipInX}, 
				{id: 'RollIn', text: common.bundleanimation.rollIn}, 
//				{id: 'DropOut', text: 'DropOut'}, 
//				{id: 'Landing', text: 'Landing'}, 
//				{id: 'TakingOff', text: 'TakingOff'}, 
//				{id: 'Flash', text: 'Flash'}, 
//				{id: 'Pulse', text: 'Pulse'}, 
//				{id: 'RubberBand', text: 'RubberBand'}, 
//				{id: 'Shake', text: 'Shake'}, 
//				{id: 'Swing', text: 'Swing'}, 
//				{id: 'Wobble', text: 'Wobble'}, 
//				{id: 'Bounce', text: 'Bounce'}, 
//				{id: 'Tada', text: 'Tada'}, 
//				{id: 'StandUp', text: 'StandUp'}, 
//				{id: 'Wave', text: 'Wave'}, 
//				{id: 'Hinge', text: 'Hinge'}, 
//				{id: 'RollIn', text: 'RollIn'}, 
//				{id: 'RollOut', text: 'RollOut'}, 
//				{id: 'BounceIn', text: 'BounceIn'}, 
//				{id: 'BounceInDown', text: 'BounceInDown'}, 
//				{id: 'BounceInLeft', text: 'BounceInLeft'}, 
//				{id: 'BounceInRight', text: 'BounceInRight'}, 
//				{id: 'BounceInUp', text: 'BounceInUp'}, 
//				{id: 'FadeIn', text: 'FadeIn'}, 
//				{id: 'FadeInUp', text: 'FadeInUp'}, 
//				{id: 'FadeInDown', text: 'FadeInDown'}, 
//				{id: 'FadeInLeft', text: 'FadeInLeft'}, 
//				{id: 'FadeInRight', text: 'FadeInRight'}, 
//				{id: 'FadeOut', text: 'FadeOut'}, 
//				{id: 'FadeOutDown', text: 'FadeOutDown'}, 
//				{id: 'FadeOutLeft', text: 'FadeOutLeft'}, 
//				{id: 'FadeOutRight', text: 'FadeOutRight'}, 
//				{id: 'FadeOutUp', text: 'FadeOutUp'}, 
//				{id: 'FlipInX', text: 'FlipInX'}, 
//				{id: 'FlipOutX', text: 'FlipOutX'}, 
//				{id: 'FlipOutY', text: 'FlipOutY'}, 
//				{id: 'RotateIn', text: 'RotateIn'}, 
//				{id: 'RotateInDownLeft', text: 'RotateInDownLeft'}, 
//				{id: 'RotateInDownRight', text: 'RotateInDownRight'}, 
//				{id: 'RotateInUpLeft', text: 'RotateInUpLeft'}, 
//				{id: 'RotateInUpRight', text: 'RotateInUpRight'}, 
//				{id: 'RotateOut', text: 'RotateOut'}, 
//				{id: 'RotateOutDownLeft', text: 'RotateOutDownLeft'}, 
//				{id: 'RotateOutDownRight', text: 'RotateOutDownRight'}, 
//				{id: 'RotateOutUpLeft', text: 'RotateOutUpLeft'}, 
//				{id: 'RotateOutUpRight', text: 'RotateOutUpRight'}, 
//				{id: 'SlideInLeft', text: 'SlideInLeft'}, 
//				{id: 'SlideInRight', text: 'SlideInRight'}, 
//				{id: 'SlideInUp', text: 'SlideInUp'}, 
//				{id: 'SlideInDown', text: 'SlideInDown'}, 
//				{id: 'SlideOutLeft', text: 'SlideOutLeft'}, 
//				{id: 'SlideOutRight', text: 'SlideOutRight'}, 
//				{id: 'SlideOutUp', text: 'SlideOutUp'}, 
//				{id: 'SlideOutDown', text: 'SlideOutDown'}, 
//				{id: 'ZoomIn', text: 'ZoomIn'}, 
//				{id: 'ZoomInDown', text: 'ZoomInDown'}, 
//				{id: 'ZoomInLeft', text: 'ZoomInLeft'}, 
//				{id: 'ZoomInRight', text: 'ZoomInRight'}, 
//				{id: 'ZoomInUp', text: 'ZoomInUp'}, 
//				{id: 'ZoomOut', text: 'ZoomOut'}, 
//				{id: 'ZoomOutDown', text: 'ZoomOutDown'}, 
//				{id: 'ZoomOutLeft', text: 'ZoomOutLeft'}, 
//				{id: 'ZoomOutRight', text: 'ZoomOutRight'}, 
//				{id: 'ZoomOutUp', text: 'ZoomOutUp'}, 
			];
			
			$('#AnimationSelect').select2({
				placeholder: common.tips.detail_select,
				minimumInputLength: 0,
				data: animationlist,
				dropdownCssClass: 'bigdrop', 
				escapeMarkup: function (m) { return m; } 
			});
			$('#AnimationSelect').select2('val', bundlezone.animation);
		}

		function refreshTouchtypeSelect() {
			var touchtypelist = [];
			if (_self.Object.touchflag == 1) {
				touchtypelist.push({id: 0, text: common.view.bundle_touchtype_0 });
				touchtypelist.push({id: 1, text: common.view.bundle_touchtype_1 });
				touchtypelist.push({id: 2, text: common.view.bundle_touchtype_2 });
				touchtypelist.push({id: 3, text: common.view.bundle_touchtype_3 });
				touchtypelist.push({id: 4, text: common.view.bundle_touchtype_4 });
				touchtypelist.push({id: 5, text: common.view.bundle_touchtype_5 });
				touchtypelist.push({id: 6, text: common.view.bundle_touchtype_6 });
				touchtypelist.push({id: 9, text: common.view.bundle_touchtype_9 });
			} else {
				touchtypelist.push({id: 3, text: common.view.bundle_touchtype_3 });
				touchtypelist.push({id: 4, text: common.view.bundle_touchtype_4 });
				touchtypelist.push({id: 5, text: common.view.bundle_touchtype_5 });
				touchtypelist.push({id: 6, text: common.view.bundle_touchtype_6 });
				touchtypelist.push({id: 9, text: common.view.bundle_touchtype_9 });
			}
			$('#TouchtypeSelect').select2({
				placeholder: common.tips.detail_select,
				minimumInputLength: 0,
				minimumResultsForSearch: -1,
				data: touchtypelist,
				initSelection: function(element, callback) {
					if (_self.Zone != null) {
						callback({id: _self.Zone.touchtype, text: eval('common.view.bundle_touchtype_'+_self.Zone.touchtype) });
					}
				},
				dropdownCssClass: 'bigdrop', 
				escapeMarkup: function (m) { return m; } 
			});
			if (_self.Zone.touchtype == 2 || _self.Zone.touchtype == 3 || _self.Zone.touchtype == 4) {
				$('#TouchobjSelect').closest('.form-group').css('display', '');
				$('#TouchModal input[name="content"]').closest('.form-group').css('display', 'none');
				refreshTouchobjSelect(_self.Zone.touchtype);
			} else if (_self.Zone.touchtype == 5 || _self.Zone.touchtype == 6) {
				$('#TouchobjSelect').closest('.form-group').css('display', 'none');
				$('#TouchModal input[name="content"]').closest('.form-group').css('display', '');
			} else {
				$('#TouchobjSelect').closest('.form-group').css('display', 'none');
				$('#TouchModal input[name="content"]').closest('.form-group').css('display', 'none');
			}
		}
		$('#TouchtypeSelect').on('change', function(e) {
			$('#TouchobjSelect').select2('val', '');
			var touchtype = $('#TouchtypeSelect').select2('data').id;
			if (touchtype == 2 || touchtype == 3 || touchtype == 4) {
				$('#TouchobjSelect').closest('.form-group').css('display', '');
				$('#TouchModal input[name="content"]').closest('.form-group').css('display', 'none');
				refreshTouchobjSelect(touchtype);
			} else if (touchtype == 5 || touchtype == 6) {
				$('#TouchobjSelect').closest('.form-group').css('display', 'none');
				$('#TouchModal input[name="content"]').closest('.form-group').css('display', '');
			} else {
				$('#TouchobjSelect').closest('.form-group').css('display', 'none');
				$('#TouchModal input[name="content"]').closest('.form-group').css('display', 'none');
			}
		});	
		function refreshTouchobjSelect(touchtype) {
			if (touchtype == 2) {
				if (_mode == 'templet') {
					for (var i=0; i<_self.Subobjects.length; i++) {
						_self.Subobjects[i].bundleid = _self.Subobjects[i].templetid;
						_self.Subobjects[i].bundle = _self.Subobjects[i].templet;
					}
				}
				
				var data = [];
				if (_self.Subobjects != null) {
					for (var i=0; i<_self.Subobjects.length; i++) {
						data.push({
							id: _self.Subobjects[i].bundleid,
							name: _self.Subobjects[i].name,
							bundle: _self.Subobjects[i]
						})
					}
				}
				
				$('#TouchobjSelect').select2({
					placeholder: common.tips.detail_select,
					//minimumResultsForSearch: -1,
					minimumInputLength: 0,
					data: data,
					formatResult: function (item) {
						if (item.bundle != null && item.bundle.snapshot != null) {
							return '<span><img src="/pixsigdata' + item.bundle.snapshot + '" height="25" /> ' + item.name + '</span>';
						} else {
							return '<span>' + item.name + '</span>';
						}
					},
					formatSelection: function (item) {
						return item.name;				
					},
					dropdownCssClass: 'bigdrop', 
					escapeMarkup: function (m) { return m; } 
				});
				var touchbundles = _self.Subobjects.filter(function (el) {
					return el.bundleid == _self.Zone.touchobjid;
				});
				if (touchbundles.length > 0) {
					$('#TouchobjSelect').select2('data', {id: touchbundles[0].bundleid, name: touchbundles[0].name, bundle: touchbundles[0] });
				} else {
					$('#TouchobjSelect').select2('val', '');
				}
			} else if (touchtype == 3) {
				new FolderVideoSelect($('#TouchobjGroup'), _self.Zone.touchvideo);
			} else if (touchtype == 4) {
				new FolderImageSelect($('#TouchobjGroup'), _self.Zone.touchimage);
			}
		}
		
		$('.zoneform input,select').on('change', function(e) {
			_self.Zone.mainflag = $('.zoneform input[name=mainflag]:checked').attr('value');
			if (_self.Zone.mainflag == 1) {
				for (var i=0; i<_self.Object.bundlezones.length; i++) {
					_self.Object.bundlezones[i].mainflag = 0;
				}
				_self.Zone.mainflag = 1;
			}
			_self.Zone.sleeptime = $('.zoneform input[name=sleeptime]').attr('value');
			_self.Zone.intervaltime = $('.zoneform input[name=intervaltime]').attr('value');
			_self.Zone.fitflag = $('.zoneform input[name=fitflag]:checked').attr('value');
			_self.Zone.animation = $('#AnimationSelect').select2('val');
			_self.Zone.volume = $('.zoneform input[name=volume]').attr('value');
			_self.Zone.direction = $('.zoneform input[name=direction]:checked').attr('value');
			_self.Zone.speed = $('.zoneform input[name=speed]:checked').attr('value');
			_self.Zone.color = $('.zoneform input[name=color]').attr('value');
			_self.Zone.size = $('.zoneform input[name=size]').attr('value');
			_self.Zone.bgcolor = $('.zoneform input[name=bgcolor]').attr('value');
			_self.Zone.bgopacity = $('.zoneform input[name=bgopacity]').attr('value');
			_self.Zone.dateformat = $('.zoneform select[name=dateformat]').val();
			_self.Zone.zindex = $('.zoneform select[name=zindex]').val();
			refreshBundlezone(_self.Zone);
		});

		function validBundlezone(bundlezone) {
			return true;
		}

		//新增bundlezone
		$('body').on('click', '.pix-addzone', function(event) {
			var zonetype = $(event.target).attr('zonetype');
			if (zonetype == undefined) {
				zonetype = $(event.target).parent().attr('zonetype');
			}
			
			var bundlezones = _self.Object.bundlezones.filter(function (el) {
				return el.type == zonetype;
			});
			if (bundlezones.length >= ZoneLimits[zonetype] ) {
				return;
			}
			
			var bundlezone = {};
			bundlezone.bundlezoneid = '-' + Math.round(Math.random()*100000000);
			bundlezone.bundleid = _self.Objectid;
			bundlezone.name = 'Zone_' + zonetype;
			bundlezone.type = zonetype;
			bundlezone.mainflag = 0;
			bundlezone.leftoffset = _self.Object.height * 0.1;
			bundlezone.topoffset = _self.Object.width * 0.1;
			if (ZoneRatios[zonetype] != undefined) {
				bundlezone.width = _self.Object.width * 0.2;
				bundlezone.height = _self.Object.width * 0.2 / ZoneRatios[zonetype];
			} else {
				bundlezone.width = _self.Object.width * 0.2;
				bundlezone.height = _self.Object.height * 0.2;
			}
			bundlezone.zindex = 52;
			bundlezone.bgimageid = 0;
			bundlezone.bgcolor = '#999999';
			bundlezone.bgopacity = 120;
			bundlezone.sleeptime = 0;
			bundlezone.intervaltime = 10;
			bundlezone.sleeptime = 0;
			bundlezone.animation = 'None';
			bundlezone.fitflag = 1;
			bundlezone.volume = 50;
			bundlezone.direction = 4;
			bundlezone.speed = 2;
			bundlezone.color = '#FFFFFF';
			if (bundlezone.type == '3' || bundlezone.type == '4' || bundlezone.type == '5' || bundlezone.type == '6') {
				bundlezone.size = 50;
			} else {
				bundlezone.size = 30;
			}
			bundlezone.dateformat = 'yyyy-MM-dd HH:mm:ss';
			bundlezone.touchtype = '9';
			bundlezone.touchobjid = 0;
			bundlezone.content = '';
			bundlezone.bundlezonedtls = [];
			
			if (zonetype == 0) {
				var advertzones = _self.Object.bundlezones.filter(function (el) {
					return el.type == 0;
				});
				console.log('advertzones', advertzones);
				for (var i=1; i<=3; i++) {
					var find = false;
					for (var j=0; j<advertzones.length; j++) {
						if (advertzones[j].content == i) {
							find = true;
							break;
						}
					}
					if (!find) {
						bundlezone.content = i;
						console.log('bundlezone.content', bundlezone.content);
						break;
					}
				}
			}
			
			_self.Object.bundlezones.push(bundlezone);
			
			unselectAllZones();
			_self.Zone = bundlezone;
			createZone(bundlezone);
			selectZone(_self.Zone);
			enterBundlezoneFocus(bundlezone);
		});


		$('[type=submit]', $('#TextModal')).on('click', function(event) {
			_self.Zone.content = $('#TextModal textarea[name="content"]').val();
			refreshBundlezone(_self.Zone);
			$('#TextModal').modal('hide');
		});
		$('[type=submit]', $('#WebModal')).on('click', function(event) {
			_self.Zone.content = $('#WebModal textarea[name="content"]').val();
			refreshBundlezone(_self.Zone);
			$('#WebModal').modal('hide');
		});
		$('[type=submit]', $('#TouchModal')).on('click', function(event) {
			if ($('#TouchtypeSelect').select2('data') != null) {
				_self.Zone.touchtype = $('#TouchtypeSelect').select2('data').id;
			}
			if ($('#TouchobjSelect').select2('data') != null) {
				_self.Zone.touchobjid = $('#TouchobjSelect').select2('data').id;
				if (_self.Zone.touchtype == 2) {
					_self.Zone.touchbundle = $('#TouchobjSelect').select2('data').bundle;
				} else if (_self.Zone.touchtype == 3) {
					_self.Zone.touchvideo = $('#TouchobjSelect').select2('data').video;
				} else if (_self.Zone.touchtype == 4) {
					_self.Zone.touchimage = $('#TouchobjSelect').select2('data').image;
				}
			}
			_self.Zone.touchlabel = $('#TouchModal input[name="touchlabel"]').val();
			_self.Zone.content = $('#TouchModal input[name="content"]').val();
			refreshBundlezone(_self.Zone);
			$('#TouchModal').modal('hide');
		});
		$('[type=submit]', $('#DVBModal')).on('click', function(event) {
			var dvb = $('#DVBSelect').select2('data');
			if (dvb != null) {
				if (_self.Zone.bundlezonedtls.length == 0) {
					var bundlezonedtl = {};
					bundlezonedtl.bundlezonedtlid = 0;
					bundlezonedtl.bundlezoneid = _self.Zone.bundlezoneid;
					bundlezonedtl.objtype = '7';
					bundlezonedtl.objid = dvb.dvb.dvbid;
					bundlezonedtl.sequence = 1;
					bundlezonedtl.dvb = dvb.dvb;
					_self.Zone.bundlezonedtls.push(bundlezonedtl);
				} else {
					_self.Zone.bundlezonedtls[0].objtype = '7';
					_self.Zone.bundlezonedtls[0].objid = dvb.dvb.dvbid;
					_self.Zone.bundlezonedtls[0].dvb = dvb.dvb;
				}
			}
			$('#DVBModal').modal('hide');
		});
		$('[type=submit]', $('#PageModal')).on('click', function(event) {
			var page = $('#PageSelect').select2('data');
			console.log('page', page);
			if (page != null) {
				if (_self.Zone.bundlezonedtls.length == 0) {
					var bundlezonedtl = {};
					bundlezonedtl.bundlezonedtlid = 0;
					bundlezonedtl.bundlezoneid = _self.Zone.bundlezoneid;
					bundlezonedtl.objtype = '8';
					bundlezonedtl.objid = page.page.pageid;
					bundlezonedtl.sequence = 1;
					bundlezonedtl.page = page.page;
					_self.Zone.bundlezonedtls.push(bundlezonedtl);
					_self.Zone.content = page.page.pageid;
				} else {
					_self.Zone.bundlezonedtls[0].objtype = '8';
					_self.Zone.bundlezonedtls[0].objid = page.page.pageid;
					_self.Zone.bundlezonedtls[0].page = page.page;
					_self.Zone.content = page.page.pageid;
				}
			}
			refreshBundlezone(_self.Zone);
			$('#PageModal').modal('hide');
		});

		//图片table初始化
		var ImageTree = new BranchTree($('#ImageLibraryTab'));
		$('#ImageTable thead').css('display', 'none');
		$('#ImageTable tbody').css('display', 'none');	
		var imagehtml = '';
		$('#ImageTable').dataTable({
			'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 18, 30, 48, 96 ],
							  [ 18, 30, 48, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'image!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.filename, 'mData' : 'filename', 'bSortable' : false }, 
							{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'imageid', 'bSortable' : false }],
			'iDisplayLength' : 18,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#ImageContainer').length < 1) {
					$('#ImageTable').append('<div id="ImageContainer"></div>');
				}
				$('#ImageContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					imagehtml = '';
					imagehtml += '<div class="row" >';
				}
				imagehtml += '<div class="col-md-2 col-xs-2">';
				
				imagehtml += '<div id="ThumbContainer" style="position:relative">';
				var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
				imagehtml += '<div id="ImageThumb" class="thumbs">';
				imagehtml += '<img src="/pixsigdata' + aData.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				imagehtml += '<div class="mask">';
				imagehtml += '<div>';
				imagehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
				imagehtml += '<a class="btn default btn-sm green pix-bundlezonedtl-image-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
				imagehtml += '</div>';
				imagehtml += '</div>';
				imagehtml += '</div>';

				imagehtml += '</div>';

				imagehtml += '</div>';
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#ImageTable').dataTable().fnGetData().length) {
					imagehtml += '</div>';
					if ((iDisplayIndex+1) != $('#ImageTable').dataTable().fnGetData().length) {
						imagehtml += '<hr/>';
					}
					$('#ImageContainer').append(imagehtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#ImageContainer .thumbs').each(function(i) {
					$(this).height($(this).parent().width());
				});
				$('#ImageContainer .mask').each(function(i) {
					$(this).height($(this).parent().parent().width() + 2);
				});
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':ImageTree.branchid });
				aoData.push({'name':'folderid','value':ImageTree.folderid });
			}
		});
		$('#ImageTable_wrapper').addClass('form-inline');
		$('#ImageTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
		$('#ImageTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
		$('#ImageTable').css('width', '100%');

		//视频table初始化
		var VideoTree = new BranchTree($('#VideoLibraryTab'));
		$('#VideoTable thead').css('display', 'none');
		$('#VideoTable tbody').css('display', 'none');	
		var videohtml = '';
		$('#VideoTable').dataTable({
			'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 18, 30, 48, 96 ],
							  [ 18, 30, 48, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'video!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.filename, 'mData' : 'filename', 'bSortable' : false }, 
							{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'videoid', 'bSortable' : false }],
			'iDisplayLength' : 18,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#VideoContainer').length < 1) {
					$('#VideoTable').append('<div id="VideoContainer"></div>');
				}
				$('#VideoContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					videohtml = '';
					videohtml += '<div class="row" >';
				}
				videohtml += '<div class="col-md-2 col-xs-2">';
				
				videohtml += '<div id="ThumbContainer" style="position:relative">';
				var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
				videohtml += '<div id="VideoThumb" class="thumbs">';
				videohtml += '<img src="/pixsigdata' + aData.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				videohtml += '<div class="mask">';
				videohtml += '<div>';
				videohtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
				videohtml += '<a class="btn default btn-sm green pix-bundlezonedtl-video-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
				videohtml += '</div>';
				videohtml += '</div>';
				videohtml += '</div>';

				videohtml += '</div>';

				videohtml += '</div>';
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#VideoTable').dataTable().fnGetData().length) {
					videohtml += '</div>';
					if ((iDisplayIndex+1) != $('#VideoTable').dataTable().fnGetData().length) {
						videohtml += '<hr/>';
					}
					$('#VideoContainer').append(videohtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#VideoContainer .thumbs').each(function(i) {
					$(this).height($(this).parent().width());
				});
				$('#VideoContainer .mask').each(function(i) {
					$(this).height($(this).parent().parent().width() + 2);
				});
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':VideoTree.branchid });
				aoData.push({'name':'folderid','value':VideoTree.folderid });
				aoData.push({'name':'type','value':1 });
			}
		});
		$('#VideoTable_wrapper').addClass('form-inline');
		$('#VideoTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
		$('#VideoTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
		$('#VideoTable').css('width', '100%');

		//Audio table初始化
		var AudioTree = new BranchTree($('#AudioLibraryTab'));
		$('#AudioTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'audio!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false },
							{'sTitle' : common.view.filename, 'mData' : 'filename', 'bSortable' : false }, 
							{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false }, 
							{'sTitle' : '', 'mData' : 'audioid', 'bSortable' : false }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(3)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-bundlezonedtl-audio-add"><i class="fa fa-plus"></i></a>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':AudioTree.branchid });
			}
		});
		$('#AudioTable_wrapper').addClass('form-inline');
		$('#AudioTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#AudioTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#AudioTable_wrapper .dataTables_length select').select2();
		$('#AudioTable').css('width', '100%').css('table-layout', 'fixed');

		//Stream table初始化
		var StreamTree = new BranchTree($('#StreamLibraryTab'));
		$('#StreamTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'stream!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '20%' },
							{'sTitle' : 'URL', 'mData' : 'url', 'bSortable' : false, 'sWidth' : '70%', 'sClass':'pixtitle' },
							{'sTitle' : '', 'mData' : 'streamid', 'bSortable' : false, 'sWidth' : '5%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(2)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-bundlezonedtl-stream-add"><i class="fa fa-plus"></i></a>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':StreamTree.branchid });
			}
		});
		$('#StreamTable_wrapper').addClass('form-inline');
		$('#StreamTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#StreamTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#StreamTable_wrapper .dataTables_length select').select2();
		$('#StreamTable').css('width', '100%').css('table-layout', 'fixed');

		//播放明细Table初始化
		$('#BundlezonedtlTable').dataTable({
			'sDom' : 't',
			'iDisplayLength' : -1,
			'aoColumns' : [ {'sTitle' : '', 'bSortable' : false, 'sWidth' : '40px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '60px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '60px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sClass': 'autowrap' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' },
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' },
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' }],
			'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
			'oLanguage' : { 'sZeroRecords' : common.view.empty,
							'sEmptyTable' : common.view.empty }, 
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(0)', nRow).html(iDisplayIndex+1);
				$('td:eq(4)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-bundlezonedtl-up"><i class="fa fa-arrow-up"></i></button>');
				$('td:eq(5)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-bundlezonedtl-down"><i class="fa fa-arrow-down"></i></button>');
				$('td:eq(6)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn red btn-xs pix-bundlezonedtl-delete"><i class="fa fa-trash-o"></i></button>');
				return nRow;
			}
		});

		$('#LibraryModal').on('shown.bs.modal', function (e) {
			$('#ImageTable').dataTable()._fnAjaxUpdate();
			$('#VideoTable').dataTable()._fnAjaxUpdate();
			$('#BundlezonedtlTable').dataTable().fnClearTable();
			for (var i=0; i<_self.Zone.bundlezonedtls.length; i++) {
				var bundlezonedtl = _self.Zone.bundlezonedtls[i];
				var thumbwidth = 100;
				var thumbnail = '';
				var thumbhtml = '';
				var medianame = '';
				if (bundlezonedtl.objtype == 1) {
					mediatype = common.view.intvideo;
					medianame = bundlezonedtl.video.name;
					if (bundlezonedtl.video.thumbnail == null) {
						thumbnail = '../img/video.jpg';
					} else {
						thumbnail = '/pixsigdata' + bundlezonedtl.video.thumbnail;
					}
				} else if (bundlezonedtl.objtype == 2) {
					mediatype = common.view.image;
					medianame = bundlezonedtl.image.name;
					thumbwidth = bundlezonedtl.image.width > bundlezonedtl.image.height? 100 : 100*bundlezonedtl.image.width/bundlezonedtl.image.height;
					thumbnail = '/pixsigdata' + bundlezonedtl.image.thumbnail;
				} else if (bundlezonedtl.objtype == 5) {
					mediatype = common.view.stream;
					medianame = bundlezonedtl.stream.name;
				} else if (bundlezonedtl.objtype == 6) {
					mediatype = common.view.audio;
					medianame = bundlezonedtl.audio.name;
				} else {
					mediatype = common.view.unknown;
				}
				if (thumbnail != '') {
					thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + medianame + '"></div>';
				}
				$('#BundlezonedtlTable').dataTable().fnAddData([bundlezonedtl.sequence, mediatype, thumbhtml, medianame, 0, 0, 0]);
			}
		});
		$('#VideoLiTab').click(function(event) {
			$('#VideoTable').dataTable()._fnAjaxUpdate();
		});
		$('#ImageLiTab').click(function(event) {
			$('#ImageTable').dataTable()._fnAjaxUpdate();
		});

		//增加视频到播放明细Table
		$('body').on('click', '.pix-bundlezonedtl-video-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#VideoTable').dataTable().fnGetData(rowIndex);
			var bundlezonedtl = {};
			bundlezonedtl.bundlezonedtlid = 0;
			bundlezonedtl.bundlezoneid = _self.Zone.bundlezoneid;
			bundlezonedtl.objtype = '1';
			bundlezonedtl.objid = data.videoid;
			bundlezonedtl.sequence = _self.Zone.bundlezonedtls.length + 1;
			bundlezonedtl.video = data;
			_self.Zone.bundlezonedtls.push(bundlezonedtl);

			var thumbnail = '';
			if (data.thumbnail == null) {
				thumbnail = '../img/video.jpg';
			} else {
				thumbnail = '/pixsigdata' + data.thumbnail;
			}
			var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="100%" alt="' + data.name + '"></div>';
			$('#BundlezonedtlTable').dataTable().fnAddData([bundlezonedtl.sequence, common.view.intvideo, thumbhtml, data.name, 0, 0, 0]);
			refreshBundlezone(_self.Zone);
		});

		//增加图片到播放明细Table
		$('body').on('click', '.pix-bundlezonedtl-image-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#ImageTable').dataTable().fnGetData(rowIndex);
			var bundlezonedtl = {};
			bundlezonedtl.bundlezonedtlid = 0;
			bundlezonedtl.bundlezoneid = _self.Zone.bundlezoneid;
			bundlezonedtl.objtype = '2';
			bundlezonedtl.objid = data.imageid;
			bundlezonedtl.sequence = _self.Zone.bundlezonedtls.length + 1;
			bundlezonedtl.image = data;
			_self.Zone.bundlezonedtls.push(bundlezonedtl);

			var thumbwidth = data.width > data.height? 100 : 100*data.width/data.height;
			var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="/pixsigdata' + data.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + data.name + '"></div>';
			$('#BundlezonedtlTable').dataTable().fnAddData([bundlezonedtl.sequence, common.view.image, thumbhtml, data.name, 0, 0, 0]);
			refreshBundlezone(_self.Zone);
		});

		//增加Audio到播放明细Table
		$('body').on('click', '.pix-bundlezonedtl-audio-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#AudioTable').dataTable().fnGetData(rowIndex);
			var bundlezonedtl = {};
			bundlezonedtl.bundlezonedtlid = 0;
			bundlezonedtl.bundlezoneid = _self.Zone.bundlezoneid;
			bundlezonedtl.objtype = '6';
			bundlezonedtl.objid = data.audioid;
			bundlezonedtl.sequence = _self.Zone.bundlezonedtls.length + 1;
			bundlezonedtl.audio = data;
			_self.Zone.bundlezonedtls.push(bundlezonedtl);
			$('#BundlezonedtlTable').dataTable().fnAddData([bundlezonedtl.sequence, common.view.audio, '', data.name, 0, 0, 0]);
			refreshBundlezone(_self.Zone);
		});

		//增加Stream到播放明细Table
		$('body').on('click', '.pix-bundlezonedtl-stream-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#StreamTable').dataTable().fnGetData(rowIndex);
			var bundlezonedtl = {};
			bundlezonedtl.bundlezonedtlid = 0;
			bundlezonedtl.bundlezoneid = _self.Zone.bundlezoneid;
			bundlezonedtl.objtype = '5';
			bundlezonedtl.objid = data.streamid;
			bundlezonedtl.sequence = _self.Zone.bundlezonedtls.length + 1;
			bundlezonedtl.stream = data;
			_self.Zone.bundlezonedtls.push(bundlezonedtl);
			$('#BundlezonedtlTable').dataTable().fnAddData([bundlezonedtl.sequence, common.view.stream, '', data.name, 0, 0, 0]);
			refreshBundlezone(_self.Zone);
		});

		//删除播放明细列表某行
		$('body').on('click', '.pix-bundlezonedtl-delete', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			/*
			for (var i=rowIndex; i<$('#BundlezonedtlTable').dataTable().fnSettings().fnRecordsDisplay(); i++) {
				var data = $('#BundlezonedtlTable').dataTable().fnGetData(i);
				$('#BundlezonedtlTable').dataTable().fnUpdate(i, parseInt(i), 0);
			}*/
			$('#BundlezonedtlTable').dataTable().fnDeleteRow(rowIndex);
			
			for (var i=rowIndex; i<_self.Zone.bundlezonedtls.length; i++) {
				_self.Zone.bundlezonedtls[i].sequence = i;
			}
			_self.Zone.bundlezonedtls.splice(rowIndex, 1);
			refreshBundlezone(_self.Zone);
		});

		//上移播放明细列表某行
		$('body').on('click', '.pix-bundlezonedtl-up', function(event) {
			var rowIndex = $(event.target).attr('data-id');
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			if (rowIndex == 0) {
				return;
			}
			rowIndex = parseInt(rowIndex);
			var movedDta = $('#BundlezonedtlTable').dataTable().fnGetData(rowIndex).slice(0);
			var prevData = $('#BundlezonedtlTable').dataTable().fnGetData(rowIndex-1).slice(0);
			$('#BundlezonedtlTable').dataTable().fnUpdate(prevData[1], rowIndex, 1);
			$('#BundlezonedtlTable').dataTable().fnUpdate(prevData[2], rowIndex, 2);
			$('#BundlezonedtlTable').dataTable().fnUpdate(prevData[3], rowIndex, 3);
			$('#BundlezonedtlTable').dataTable().fnUpdate(movedDta[1], rowIndex-1, 1);
			$('#BundlezonedtlTable').dataTable().fnUpdate(movedDta[2], rowIndex-1, 2);
			$('#BundlezonedtlTable').dataTable().fnUpdate(movedDta[3], rowIndex-1, 3);
			
			var temp = _self.Zone.bundlezonedtls[rowIndex];
			_self.Zone.bundlezonedtls[rowIndex] =  _self.Zone.bundlezonedtls[rowIndex-1];
			_self.Zone.bundlezonedtls[rowIndex].sequence = rowIndex+1;
			_self.Zone.bundlezonedtls[rowIndex-1] = temp;
			_self.Zone.bundlezonedtls[rowIndex-1].sequence = rowIndex;
			refreshBundlezone(_self.Zone);
		});

		//下移播放明细列表某行
		$('body').on('click', '.pix-bundlezonedtl-down', function(event) {
			var rowIndex = $(event.target).attr('data-id');
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			if (rowIndex == $('#BundlezonedtlTable').dataTable().fnSettings().fnRecordsDisplay() - 1) {
				return;
			}
			rowIndex = parseInt(rowIndex);
			var movedDta = $('#BundlezonedtlTable').dataTable().fnGetData(rowIndex).slice(0);
			var nextData = $('#BundlezonedtlTable').dataTable().fnGetData(rowIndex+1).slice(0);
			$('#BundlezonedtlTable').dataTable().fnUpdate(nextData[1], rowIndex, 1);
			$('#BundlezonedtlTable').dataTable().fnUpdate(nextData[2], rowIndex, 2);
			$('#BundlezonedtlTable').dataTable().fnUpdate(nextData[3], rowIndex, 3);
			$('#BundlezonedtlTable').dataTable().fnUpdate(movedDta[1], rowIndex+1, 1);
			$('#BundlezonedtlTable').dataTable().fnUpdate(movedDta[2], rowIndex+1, 2);
			$('#BundlezonedtlTable').dataTable().fnUpdate(movedDta[3], rowIndex+1, 3);
			
			var temp = _self.Zone.bundlezonedtls[rowIndex];
			_self.Zone.bundlezonedtls[rowIndex] = _self.Zone.bundlezonedtls[rowIndex+1];
			_self.Zone.bundlezonedtls[rowIndex].sequence = rowIndex+1;
			_self.Zone.bundlezonedtls[rowIndex+1] = temp;
			_self.Zone.bundlezonedtls[rowIndex+1].sequence = rowIndex+2;
			refreshBundlezone(_self.Zone);
		});

		$(document).keydown(function (e) {
			if (_self.Zone != null) {
				var bundlezonediv = $('#BundlezoneDiv' + _self.Zone.bundlezoneid);
				var status = $(bundlezonediv).find('#rotatable').hasClass('dblclick');
				if ((e.which == 46) && (status === false) && ((e.target.tagName).toLowerCase() !== 'input')) {
					if (_self.Zone.mainflag == 1) {
						bootbox.alert(common.tips.region_remove_failed);
						return;
					}
					bootbox.confirm(common.tips.remove + eval('common.view.region_type_' + _self.Zone.type), function(result) {
						if (result == true) {
							_self.Object.bundlezones.splice(_self.Object.bundlezones.indexOf(_self.Zone), 1);
							_self.Zone = null;
							$(bundlezonediv).remove();
							enterBundlezoneFocus(_self.Zone);
						}
					 });
				}
			}
		});

		$('.pix-preview').on('click', function(event) {
			$('#PreviewForm input[name="content"]').val($.toJSON(_self.Object));
			$('#PreviewForm').submit();
		});
	};

	init();
};
