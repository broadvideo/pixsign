var PageDesignModule = function (mode) {
	var _self = this;
	var _mode = mode;  //'page', 'template'
	this.Object = {};
	this.Objectid = 0;
	this.Zone = {};
	this.Subobjects = [];
	
	var ZoneLimits = [];
	var ZoneRatios = [];
	var PageScale = 1;

	var init = function () {
		ZoneLimits['1'] = 4;
		ZoneLimits['2'] = 100;
		ZoneLimits['3'] = 100;
		ZoneLimits['4'] = 5;
		ZoneLimits['5'] = 2;
		ZoneLimits['6'] = 1;
		ZoneLimits['7'] = 100;
		ZoneLimits['11'] = 1;
		ZoneLimits['12'] = 1;
		ZoneLimits['13'] = 1;
		ZoneLimits['14'] = 1;
		ZoneLimits['15'] = 1;
		ZoneLimits['21'] = 1;
		ZoneLimits['31'] = 1;
		
		initEvent();
	};

	var initEvent = function () {
		$('#PageModal').on('shown.bs.modal', function (e) {
			$('#ZoneEditPanel').css('display' , 'none');
			$('#PageDiv').empty();
			$('#PageDiv').css('position', 'relative');
			$('#PageDiv').css('margin-left', 'auto');
			$('#PageDiv').css('margin-right', 'auto');
			$('#PageDiv').css('border', '1px solid #000');
			if (_self.Object.width > _self.Object.height) {
				var width = Math.floor($('#PageDiv').parent().width());
				PageScale = _self.Object.width / width;
				var height = _self.Object.height / PageScale;
			} else {
				var height = Math.floor($('#PageDiv').parent().width());
				PageScale = _self.Object.height / height;
				var width = _self.Object.width / PageScale;
			}
			$('#PageDiv').css('width' , width);
			$('#PageDiv').css('height' , height);
			
			var pagezones = _self.Object.pagezones;
			for (var i=0; i<pagezones.length; i++) {
				createZone(pagezones[i]);
				initOperation(pagezones[i]);
			}
			unselectAllZones();
		})

		function updatePagezonePos(e, ui) {
			var pagezoneid = $(this).attr('pagezoneid');
			var pagezones = _self.Object.pagezones.filter(function (el) {
				return el.pagezoneid == pagezoneid;
			});

			var l = $(this).position().left / $('#PageDiv').width();
			var t = $(this).position().top / $('#PageDiv').height();
			var w = $(this).width() / $('#PageDiv').width();
			var h = $(this).height() / $('#PageDiv').height();
			/*
			if (ZoneRatios[pagezones[0].type] != undefined) {
				var w = $(this).width() / $('#PageDiv').width();
				var h = $(this).width() / parseFloat(ZoneRatios[pagezones[0].type]) / $('#PageDiv').height();
				if (t + h > 1) {
					h = 1 - t;
					w = h * $('#PageDiv').height() * parseFloat(ZoneRatios[pagezones[0].type]) / $('#PageDiv').width();
				}
			}*/
			//$(this).css('width' , (100 * parseFloat(w)) + '%');
			//$(this).css('height' , (100 * parseFloat(h)) + '%');
			//$(this).css('left' , (100 * parseFloat(l)) + '%');
			//$(this).css('top' , (100 * parseFloat(t)) + '%');

			pagezones[0].width = Math.round(_self.Object.width * w, 0);
			pagezones[0].height = Math.round(_self.Object.height * h, 0);
			pagezones[0].leftoffset = Math.round(_self.Object.width * l, 0);
			pagezones[0].topoffset = Math.round(_self.Object.height * t, 0);
			refreshLocSpinners(pagezones[0]);
		}

		function initOperation(pagezone) {
			var pagezoneDiv = $('#PagezoneDiv' + pagezone.pagezoneid);
			$(pagezoneDiv).draggable({
				containment: '#PageDiv',
				//stop: regionPositionUpdate,
				drag: updatePagezonePos,
			});
			
			$(pagezoneDiv).resizable({
				containment: '#PageDiv',
				aspectRatio: false,
				handles: 'ne, nw, se, sw',
				stop: updatePagezonePos,
			});
			/*
			if (isOpera) {
				var tr = $(pagezoneDiv).css('-o-transform').replace('matrix(', '').replace(')', '');
			} else if (isFirefox) {
				tr = $(pagezoneDiv).css('-moz-transform').replace('matrix(', '').replace(')', '');
			} else if (isChrome || isSafari) {
				tr = $(pagezoneDiv).css('-webkit-transform').replace('matrix(', '').replace(')', '');
			}
			$(pagezoneDiv).find('#rotatable').rotatable({
				mtx: [tr], 
				onrotate: function (a) {
					//set_rotation_angle_spinner_value(a);
				}
			});
			*/
		}

		function createZone(pagezone) {
			var pagezone_div = document.createElement('div');
			pagezone_div.id = 'PagezoneDiv' + pagezone.pagezoneid;
			pagezone_div.unselectable = 'off';
			$(pagezone_div).attr('pagezoneid', pagezone.pagezoneid);
			var background_div = document.createElement('div');
			background_div.id = 'background';
			var inner_div = document.createElement('div');
			inner_div.id = 'rotatable';
			$(pagezone_div).append(background_div);
			$(pagezone_div).append(inner_div);
			$('#PageDiv').append(pagezone_div);	

			if (pagezone.type == 1) {
				//Video Zone
				var img_element = document.createElement('img');
				$(inner_div).append(img_element);
			} else if (pagezone.type == 2) {
				//Image Zone
				var img_element = document.createElement('img');
				$(inner_div).append(img_element);
			} else if (pagezone.type == 3) {
				//Text Zone
				inner_div.addEventListener('paste', function(e) {
					// cancel paste
					e.preventDefault();
					// get text representation of clipboard
					var text = e.clipboardData.getData('text/plain');
					console.log(text);
					// insert text manually
					document.execCommand('insertHTML', false, text);
					//document.execCommand('insertText', false, text);
				});
				var p_element = document.createElement('p');
				p_element.className = 'clstextedit';
				$(inner_div).append(p_element);
			} else if (pagezone.type == 4) {
				//Scroll Zone
				var marquee_element = document.createElement('marquee');
				$(marquee_element).attr('direction', 'left');
				$(marquee_element).attr('behavior', 'scroll');
				$(marquee_element).attr('scrollamount', '1');
				$(marquee_element).attr('scrolldelay', '0');
				$(marquee_element).attr('loop', '-1');
				$(inner_div).append(marquee_element);
			} else if (pagezone.type == 5) {
				//Date Zone
				var p_element = document.createElement('p');
				$(inner_div).append(p_element);
			} else if (pagezone.type == 6) {
				//Web Zone
				var p_element = document.createElement('p');
				$(inner_div).append(p_element);
			} else if (pagezone.type == 7) {
				//Button Zone
				inner_div.addEventListener('paste', function(e) {
					// cancel paste
					e.preventDefault();
					// get text representation of clipboard
					var text = e.clipboardData.getData('text/plain');
					console.log(text);
					// insert text manually
					document.execCommand('insertHTML', false, text);
					//document.execCommand('insertText', false, text);
				});
				var p_element = document.createElement('p');
				p_element.className = 'clstextedit';
				$(inner_div).append(p_element);
			} else if (pagezone.type == 11 || pagezone.type == 12 || pagezone.type == 31) {
				//CalendarZone & MeetingZone
				var table = document.createElement('table');
				$(inner_div).append(table);
			} else if (pagezone.type == 21) {
				//Diy Zone
				var img_element = document.createElement('img');
				$(inner_div).append(img_element);
			} else {
				var p_element = document.createElement('p');
				$(p_element).append(eval('common.view.pagezone_type_' + pagezone.type));
				$(inner_div).append(p_element);
			}

			refreshPagezone(pagezone);
		}

		function refreshPagezone(pagezone) {
			var pagezoneDiv = $('#PagezoneDiv' + pagezone.pagezoneid);
			$(pagezoneDiv).css({
				'position': 'absolute',
				'width': 100*pagezone.width/_self.Object.width + '%',
				'height': 100*pagezone.height/_self.Object.height + '%',
				'top': 100*pagezone.topoffset/_self.Object.height + '%', 
				'left': 100*pagezone.leftoffset/_self.Object.width + '%', 
				'z-index': pagezone.zindex,
				'-moz-transform': pagezone.transform,
				'-webkit-transform': pagezone.transform,
			});
			$(pagezoneDiv).find('#background').css({
				'position': 'absolute',
				'width': '100%',
				'height': '100%',
				'background': pagezone.bgcolor, 
				'opacity': parseInt(pagezone.bgopacity)/255, 
			});
			$(pagezoneDiv).find('#rotatable').css({
				'position': 'absolute',
				'height': '100%', 
				'width': '100%', 
				'padding': Math.ceil(pagezone.padding / PageScale) + 'px', 
			});
			var shadow = '';
			shadow += Math.ceil(pagezone.shadowh / PageScale) + 'px ';
			shadow += Math.ceil(pagezone.shadowv / PageScale) + 'px ';
			shadow += Math.ceil(pagezone.shadowblur / PageScale) + 'px ';
			shadow += pagezone.shadowcolor;
			if (pagezone.type == 1) {
				//Video Zone
				$(pagezoneDiv).find('#rotatable').css({
					'box-shadow': shadow, 
					'opacity': parseInt(pagezone.opacity)/255,
				});
				$(pagezoneDiv).find('img').css({
					'box-sizing': 'border-box',
					'border-color': pagezone.bdcolor, 
					'border-style': pagezone.bdstyle, 
					'border-width': Math.ceil(pagezone.bdwidth / PageScale) + 'px', 
					'border-radius': Math.ceil(pagezone.bdradius / PageScale) + 'px', 
				});
				if (pagezone.pagezonedtls.length > 0 && pagezone.pagezonedtls[0].video != null) {
					$(pagezoneDiv).find('img').attr('src', '/pixsigdata' + pagezone.pagezonedtls[0].video.thumbnail);
					$(pagezoneDiv).find('img').attr('width', '100%');
					$(pagezoneDiv).find('img').attr('height', '100%');
				}
			} else if (pagezone.type == 2) {
				//Image Zone
				$(pagezoneDiv).find('#rotatable').css({
					'box-shadow': shadow, 
					'opacity': parseInt(pagezone.opacity)/255,
				});
				$(pagezoneDiv).find('img').css({
					'box-sizing': 'border-box',
					'border-color': pagezone.bdcolor, 
					'border-style': pagezone.bdstyle, 
					'border-width': Math.ceil(pagezone.bdwidth / PageScale) + 'px', 
					'border-radius': Math.ceil(pagezone.bdradius / PageScale) + 'px', 
				});
				if (pagezone.pagezonedtls.length > 0 && pagezone.pagezonedtls[0].image != null) {
					$(pagezoneDiv).find('img').attr('src', '/pixsigdata' + pagezone.pagezonedtls[0].image.filepath);
					$(pagezoneDiv).find('img').attr('width', '100%');
					$(pagezoneDiv).find('img').attr('height', '100%');
				}
			} else if (pagezone.type == 3) {
				//Text Zone
				$(pagezoneDiv).find('#rotatable').css({
					'box-sizing': 'border-box',
					'border-color': pagezone.bdcolor, 
					'border-style': pagezone.bdstyle, 
					'border-width': Math.ceil(pagezone.bdwidth / PageScale) + 'px', 
					'border-radius': Math.ceil(pagezone.bdradius / PageScale) + 'px', 
					'color': pagezone.color, 
					'font-family': pagezone.fontfamily, 
					'font-size': Math.ceil(pagezone.fontsize / PageScale) + 'px', 
					'text-decoration': pagezone.decoration, 
					'text-align': pagezone.align, 
					'font-weight': pagezone.fontweight, 
					'font-style': pagezone.fontstyle, 
					'line-height': Math.ceil(pagezone.lineheight / PageScale) + 'px', 
					'text-shadow': shadow,  
					'word-wrap': 'break-word',
				});
				$(pagezoneDiv).find('p').css({
					'word-wrap': 'break-word',
					'white-space': 'pre-wrap',
					'text-decoration': pagezone.decoration,
				});
				var text_val = pagezone.content;
				if (text_val == undefined || text_val == null || text_val == '') {
					text_val = 'Double click to edit';
				} else {
					text_val = text_val.replace(/&nbsp;/g, ' ');
				}
				$(pagezoneDiv).find('p').html(text_val);
			} else if (pagezone.type == 4) {
				//Scroll Zone
				$(pagezoneDiv).find('#rotatable').css({
					'box-sizing': 'border-box',
					'border-color': pagezone.bdcolor, 
					'border-style': pagezone.bdstyle, 
					'border-width': Math.ceil(pagezone.bdwidth / PageScale) + 'px', 
					'border-radius': Math.ceil(pagezone.bdradius / PageScale) + 'px', 
					'color': pagezone.color, 
					'font-family': pagezone.fontfamily, 
					'font-size': Math.ceil(pagezone.fontsize / PageScale) + 'px', 
					'text-decoration': pagezone.decoration, 
					'text-align': pagezone.align, 
					'font-weight': pagezone.fontweight, 
					'font-style': pagezone.fontstyle, 
					'line-height': Math.ceil(pagezone.lineheight / PageScale) + 'px', 
					'text-shadow': shadow,  
					'word-wrap': 'break-word',
				});
				$(pagezoneDiv).find('marquee').css({
					'text-decoration': pagezone.decoration,
				});
				var text_val = pagezone.content;
				if (text_val == undefined || text_val == null || text_val == '') {
					text_val = 'Scrolling Text';
				} else {
					text_val = text_val.replace(/&nbsp;/g, ' ');
				}
				$(pagezoneDiv).find('marquee').html(text_val);
			} else if (pagezone.type == 5) {
				//Date Zone
				$(pagezoneDiv).find('#rotatable').css({
					'box-sizing': 'border-box',
					'border-color': pagezone.bdcolor, 
					'border-style': pagezone.bdstyle, 
					'border-width': Math.ceil(pagezone.bdwidth / PageScale) + 'px', 
					'border-radius': Math.ceil(pagezone.bdradius / PageScale) + 'px', 
					'color': pagezone.color, 
					'font-family': pagezone.fontfamily, 
					'font-size': Math.ceil(pagezone.fontsize / PageScale) + 'px', 
					'text-decoration': pagezone.decoration, 
					'text-align': pagezone.align, 
					'font-weight': pagezone.fontweight, 
					'font-style': pagezone.fontstyle, 
					'line-height': Math.ceil(pagezone.lineheight / PageScale) + 'px', 
					'text-shadow': shadow,  
					'word-wrap': 'break-word',
				});
				$(pagezoneDiv).find('p').css({
					'text-decoration': pagezone.decoration,
				});
				$(pagezoneDiv).find('p').html(new Date().pattern(pagezone.dateformat));
			} else if (pagezone.type == 6) {
				//Web Zone
				$(pagezoneDiv).find('#rotatable').css({
					'box-sizing': 'border-box',
					'border-color': pagezone.bdcolor, 
					'border-style': pagezone.bdstyle, 
					'border-width': Math.ceil(pagezone.bdwidth / PageScale) + 'px', 
					'border-radius': Math.ceil(pagezone.bdradius / PageScale) + 'px', 
					'color': pagezone.color, 
					'text-align': 'left', 
					'word-wrap': 'break-word',
				});
				$(pagezoneDiv).find('p').html(pagezone.content);
			} else if (pagezone.type == 7) {
				//Button Zone
				$(pagezoneDiv).find('#rotatable').css({
					'box-sizing': 'border-box',
					'border-color': pagezone.bdcolor, 
					'border-style': pagezone.bdstyle, 
					'border-width': Math.ceil(pagezone.bdwidth / PageScale) + 'px', 
					'border-radius': Math.ceil(pagezone.bdradius / PageScale) + 'px', 
					'color': pagezone.color, 
					'font-family': pagezone.fontfamily, 
					'font-size': Math.ceil(pagezone.fontsize / PageScale) + 'px', 
					'text-decoration': pagezone.decoration, 
					'text-align': pagezone.align, 
					'font-weight': pagezone.fontweight, 
					'font-style': pagezone.fontstyle, 
					'line-height': Math.ceil(pagezone.lineheight / PageScale) + 'px', 
					'text-shadow': shadow,  
					'word-wrap': 'break-word',
				});
				if (pagezone.pagezonedtls.length > 0 && pagezone.pagezonedtls[0].image != null) {
					$(pagezoneDiv).find('#rotatable').css('background-image', 'url(/pixsigdata' + pagezone.pagezonedtls[0].image.filepath + ')');
					$(pagezoneDiv).find('#rotatable').css('background-size', '100% 100%');
					$(pagezoneDiv).find('#rotatable').css('background-position', 'center');
					$(pagezoneDiv).find('#rotatable').css('background-repeat', 'no-repeat');
				}
				$(pagezoneDiv).find('p').css({
					'word-wrap': 'break-word',
					'white-space': 'pre-wrap',
					'text-decoration': pagezone.decoration,
				});
				var text_val = pagezone.content;
				if (text_val == undefined || text_val == null || text_val == '') {
					text_val = '<br>';
				} else {
					text_val = text_val.replace(/&nbsp;/g, ' ');
				}
				$(pagezoneDiv).find('p').html(text_val);
			} else if (pagezone.type == 11 || pagezone.type == 12 || pagezone.type == 31) {
				var table = $(pagezoneDiv).find('table');
				$(table).attr('width', '100%');
				$(table).attr('height', '100%');
				$(table).attr('rules', pagezone.rules);
				$(table).empty();
				if (pagezone.type == 11) {
					for (var row=0; row<pagezone.rows; row++) {
						var tr_element = document.createElement('tr');
						$(table).append(tr_element);
						for (var col=0; col<pagezone.cols; col++) {
							var td_element = document.createElement('td');
							$(tr_element).append(td_element);
							if (col == 0 && row < 2) {
								$(td_element).html('0' + (row+8) + ':00');
							} else if (col == 0 && row >=2) {
								$(td_element).html('' + (row+8) + ':00');
							} else {
								$(td_element).html('' + row + col);
							}
						}
					}
					$(pagezoneDiv).find('tr td:first').attr('width', '30%');
				} else if (pagezone.type == 12) {
					for (var row=0; row<pagezone.rows; row++) {
						var tr_element = document.createElement('tr');
						$(table).append(tr_element);
						for (var col=0; col<pagezone.cols; col++) {
							var td_element = document.createElement('td');
							$(tr_element).append(td_element);
							if (col == 0) {
								if (row == 1 || row == 2) {
									$(td_element).html('0' + (row+7) + ':00');
								} else if (row > 2) {
									$(td_element).html('' + (row+7) + ':00');
								}
							} else {
								if (row == 0) {
									$(td_element).html('周' + col);
								} else {
									$(td_element).html('' + row + col);
								}
							}
						}
					}
				} else if (pagezone.type == 31) {
					for (var row=0; row<pagezone.rows; row++) {
						var tr_element = document.createElement('tr');
						$(table).append(tr_element);
						for (var col=0; col<pagezone.cols; col++) {
							var td_element = document.createElement('td');
							$(tr_element).append(td_element);
							if (col == 0 && row < 2) {
								$(td_element).html('0' + (row+8) + ':00');
							} else if (col == 0 && row >=2) {
								$(td_element).html('' + (row+8) + ':00');
							} else {
								$(td_element).html('' + row + col);
							}
						}
					}
					$(pagezoneDiv).find('tr td:first').attr('width', '30%');
				}
				$(pagezoneDiv).find('td').css({
					'border-width': Math.ceil(pagezone.rulewidth / PageScale) + 'px', 
					'border-color': pagezone.rulecolor,
					'text-decoration': pagezone.decoration, 
				});
				$(pagezoneDiv).find('#rotatable').css({
					'box-sizing': 'border-box',
					'border-color': pagezone.bdcolor, 
					'border-style': pagezone.bdstyle, 
					'border-width': Math.ceil(pagezone.bdwidth / PageScale) + 'px', 
					'border-radius': Math.ceil(pagezone.bdradius / PageScale) + 'px', 
					'color': pagezone.color, 
					'font-family': pagezone.fontfamily, 
					'font-size': Math.ceil(pagezone.fontsize / PageScale) + 'px', 
					'text-align': pagezone.align, 
					'font-weight': pagezone.fontweight, 
					'font-style': pagezone.fontstyle, 
					'word-wrap': 'break-word',
				});
			} else if (pagezone.type == 21) {
				//Diy Zone
				$(pagezoneDiv).find('#rotatable').css({
					'box-shadow': shadow, 
					'opacity': parseInt(pagezone.opacity)/255,
				});
				$(pagezoneDiv).find('img').css({
					'box-sizing': 'border-box',
					'border-color': pagezone.bdcolor, 
					'border-style': pagezone.bdstyle, 
					'border-width': Math.ceil(pagezone.bdwidth / PageScale) + 'px', 
					'border-radius': Math.ceil(pagezone.bdradius / PageScale) + 'px', 
				});
				if (pagezone.diy != null) {
					$(pagezoneDiv).find('img').attr('src', '/pixsigdata' + pagezone.diy.thumbnail);
					$(pagezoneDiv).find('img').attr('width', '100%');
					$(pagezoneDiv).find('img').attr('height', '100%');
				}
			} else {
				$(pagezoneDiv).find('#rotatable').css({
					'box-sizing': 'border-box',
					'border-color': pagezone.bdcolor, 
					'border-style': pagezone.bdstyle, 
					'border-width': Math.ceil(pagezone.bdwidth / PageScale) + 'px', 
					'border-radius': Math.ceil(pagezone.bdradius / PageScale) + 'px', 
					'color': '#FFFFFF', 
					'font-size': (50 / PageScale) + 'px', 
					'word-wrap': 'break-word',
				});
				$(pagezoneDiv).find('p').css({
					'word-wrap': 'break-word',
					'text-align': 'center',
					'overflow': 'hidden',
					'text-overflow': 'clip',
					'white-space': 'nowrap',
				});
			}
		}

		function unselectAllZones() {
			for (var i=0; i<_self.Object.pagezones.length; i++) {
				pagezone = _self.Object.pagezones[i];
				var pagezonediv = $('#PagezoneDiv' + pagezone.pagezoneid);
				$(pagezonediv).css('z-index', pagezone.zindex);
				$(pagezonediv).css('cursor', 'default');
				$(pagezonediv).find('#rotatable').css('cursor', 'default');
				$(pagezonediv).removeClass('select_layer');
				$(pagezonediv).draggable('disable');
				$(pagezonediv).resizable('disable');
				$(pagezonediv).find('div.ui-resizable-handle').removeClass('select');
				$(pagezonediv).find('.ui-rotatable-handle').css('display', 'none');
			}
		}

		function selectZone(pagezone) {
			var pagezonediv = $('#PagezoneDiv' + pagezone.pagezoneid);
			//$(pagezonediv).css('z-index', '1000');
			$(pagezonediv).css('cursor', 'move');
			$(pagezonediv).find('#rotatable').css('cursor', 'move');
			$(pagezonediv).addClass('select_layer');
			$(pagezonediv).draggable('enable');
			$(pagezonediv).resizable('enable');
			$(pagezonediv).find('div.ui-resizable-handle').addClass('select');
			$(pagezonediv).find('.ui-rotatable-handle').css('display', 'block');
		}

		$('#PageDiv').live('click', function (e) {
			var that = this;
			setTimeout(function () {
				var dblclick = parseInt($(that).data('double'), 10);
				if (dblclick > 0) {
					$(that).data('double', dblclick - 1);
				} else {
					pagezoneClick.call(that, e, false);
				}
			}, 200);
		});
		$('#PageDiv').live('dblclick', function (e) {
			$(this).data('double', 2);
			pagezoneClick.call(this, e, true);
		});	   

		function pagezoneClick(e, dblclick){
			var scale = _self.Object.width / $('#PageDiv').width();
			var offset = $(this).offset();
			var posX = (e.pageX - offset.left) * scale;
			var posY = (e.pageY - offset.top) * scale;
			var pagezones = _self.Object.pagezones.filter(function (el) {
				var width = parseInt(el.width);
				var height = parseInt(el.height);
				var leftoffset = parseInt(el.leftoffset);
				var topoffset = parseInt(el.topoffset);
				return (posX > leftoffset) && (posX < (leftoffset + width)) && (posY > topoffset) && (posY < (topoffset + height));
			});
			if (pagezones.length > 0) {
				pagezones.sort(function(a, b) {
					return (parseInt(a.width) + parseInt(a.height) - parseInt(b.width) - parseInt(b.height));
				});

				if (validPagezone(_self.Zone)) {
					if ($('#rotatable[contenteditable=true]').length > 0) {
						return;
					}
					if (dblclick) {
						if (pagezones[0].type == 1) {
							//Video Zone
							_self.Zone = pagezones[0];
							$('.image-ctl').css('display', 'none');
							$('.video-ctl').css('display', '');
							$('#LibraryModal').modal();
						} else if (pagezones[0].type == 2) {
							//Image Zone
							_self.Zone = pagezones[0];
							$('.image-ctl').css('display', '');
							$('.video-ctl').css('display', 'none');
							$('#LibraryModal').modal();
						} else if (pagezones[0].type == 3 || pagezones[0].type == 7) {
							//Text Zone & Button Zone
							_self.Zone = pagezones[0];
							var pagezonediv = $('#PagezoneDiv' + _self.Zone.pagezoneid);
							if (!$(pagezonediv).find('#rotatable').hasClass('dblclick')) {
								unselectAllZones();
								selectZone(_self.Zone);

								text_editable = 'dblclick';
								$(window).unbind('keydown');
								$(pagezonediv).find('#rotatable').css('cursor', 'text');
								$(pagezonediv).find('#rotatable').attr('contenteditable', true);
								$(pagezonediv).find('#rotatable').css('word-wrap', 'break-word');
								$(pagezonediv).find('#rotatable').trigger('focus');
								$(pagezonediv).draggable('disable');
								$('.ui-rotatable-handle').css('background', '#EEEEEE');
								//e.stopPropagation();
								$(pagezonediv).trigger('dblclick');
							}
							$(pagezonediv).resizable('disable');
							$(pagezonediv).find('.ui-rotatable-handle').css('display', 'none');
							$(pagezonediv).find('.ui-resizable-handle').removeClass('select');
							$(pagezonediv).draggable('disable');

							$(pagezonediv).find('#rotatable').attr('contenteditable', true);
							$(pagezonediv).find('#rotatable').addClass('dblclick');
							//$('.select_layer').find('#rotatable').selectText();
							$(pagezonediv).find('#rotatable').trigger('click');
							enterPagezoneFocus(_self.Zone);
						} else if (pagezones[0].type == 4) {
							//Scroll Zone
							_self.Zone = pagezones[0];
							$('#ScrollForm').loadJSON(_self.Zone);
							console.log('_self.Zone.sourcetype', _self.Zone.sourcetype);
							if (_self.Zone.sourcetype == 0) {
								$('#ScrollModal textarea[name="content"]').removeAttr('readonly');
							} else {
								$('#ScrollModal textarea[name="content"]').attr('readonly','readonly');
							}
							$('#ScrollModal').modal();
						} else if (pagezones[0].type == 6) {
							//Web Zone
							_self.Zone = pagezones[0];
							$('#WebModal textarea[name="content"]').val(_self.Zone.content);
							$('#WebModal').modal();
						} else {
							return;
						}
					} else {
						_self.Zone = pagezones[0];
						unselectAllZones();
						selectZone(_self.Zone);
						enterPagezoneFocus(_self.Zone);
					}
					
					e.stopPropagation();
				}
			}
		}

		//Text zone focus out function
		$('.select_layer').find('#rotatable').live('focusout', function (e) {
			$('.select_layer').find('#rotatable').removeClass('dblclick');
			$('.select_layer').find('#rotatable').attr('contenteditable', false);
			text_editable = 'click';
			validPagezone(_self.Zone);
		});

		function enterPagezoneFocus(pagezone) {
			if (pagezone == null) {
				$('#ZoneEditPanel').css('display' , 'none');
				return;
			}
			$('#ZoneEditPanel').css('display' , '');
			$('.zone-ctl').css('display', 'none');
			$('.zonetype-' + pagezone.type).css('display', 'block');
			$('.zoneform').loadJSON(pagezone);

			$('.colorPick').wColorPicker({
				theme			: 'classic',  // set theme
				opacity			: 0.8,		// opacity level
				color			: pagezone.color,  // set init color
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
						refreshPagezone(_self.Zone);
					}
				},
				onDropper	   : null		// callback when dropper is clicked
			});
			$('.colorPick i').css('background', pagezone.color);
			$('.colorPick input').val(pagezone.color);
			
			$('.bgcolorPick').wColorPicker({
				theme			: 'classic',  // set theme
				opacity			: 0.8,		// opacity level
				color			: pagezone.bgcolor,  // set init color
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
						refreshPagezone(_self.Zone);
					}
				},
				onDropper		: null		// callback when dropper is clicked
			});
			$('.bgcolorPick i').css('background', pagezone.bgcolor);
			$('.bgcolorPick input').val(pagezone.bgcolor);

			$('.shadowcolorPick').wColorPicker({
				theme			: 'classic',  // set theme
				opacity			: 0.8,		// opacity level
				color			: pagezone.shadowcolor,  // set init color
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
						$('.shadowcolorPick i').css('background', color);
						$('.shadowcolorPick input').val(color);
						_self.Zone.shadowcolor = color;
						refreshPagezone(_self.Zone);
					}
				},
				onDropper		: null		// callback when dropper is clicked
			});
			$('.shadowcolorPick i').css('background', pagezone.shadowcolor);
			$('.shadowcolorPick input').val(pagezone.shadowcolor);

			$('.bdcolorPick').wColorPicker({
				theme			: 'classic',  // set theme
				opacity			: 0.8,		// opacity level
				color			: pagezone.bdcolor,  // set init color
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
						$('.bdcolorPick i').css('background', color);
						$('.bdcolorPick input').val(color);
						_self.Zone.bdcolor = color;
						refreshPagezone(_self.Zone);
					}
				},
				onDropper		: null		// callback when dropper is clicked
			});
			$('.bdcolorPick i').css('background', pagezone.bdcolor);
			$('.bdcolorPick input').val(pagezone.bdcolor);

			$('.rulecolorPick').wColorPicker({
				theme			: 'classic',  // set theme
				opacity			: 0.8,		// opacity level
				color			: pagezone.rulecolor,  // set init color
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
						$('.rulecolorPick i').css('background', color);
						$('.rulecolorPick input').val(color);
						_self.Zone.rulecolor = color;
						refreshPagezone(_self.Zone);
					}
				},
				onDropper		: null		// callback when dropper is clicked
			});
			$('.rulecolorPick i').css('background', pagezone.rulecolor);
			$('.rulecolorPick input').val(pagezone.rulecolor);

			$('.opacityRange').ionRangeSlider({
				min: 0,
				max: 255,
				from: 255,
				type: 'single',
				step: 5,
				hasGrid: false,
				onChange: function(data) {
					_self.Zone.opacity = $('input[name=opacity]').val();
					refreshPagezone(_self.Zone);
				}
			});
			$('.opacityRange').ionRangeSlider('update', {
				from: pagezone.opacity
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
					refreshPagezone(_self.Zone);
				}
			});
			$('.bgopacityRange').ionRangeSlider('update', {
				from: pagezone.bgopacity
			});

			$('#spinner-fontsize').spinner();
			$('#spinner-fontsize').spinner('setting', {value:parseInt(pagezone.fontsize), step: 1, min: 12, max: 255});
			$('#spinner-lineheight').spinner();
			$('#spinner-lineheight').spinner('setting', {value:parseInt(pagezone.lineheight), step: 1, min: 0, max: 255});
			$('#spinner-padding').spinner();
			$('#spinner-padding').spinner('setting', {value:parseInt(pagezone.padding), step: 1, min: 0, max: 255});

			$('#spinner-shadowh').spinner();
			$('#spinner-shadowh').spinner('setting', {value:parseInt(pagezone.shadowh), step: 1, min: -99, max: 99});
			$('#spinner-shadowv').spinner();
			$('#spinner-shadowv').spinner('setting', {value:parseInt(pagezone.shadowv), step: 1, min: -99, max: 99});
			$('#spinner-shadowblur').spinner();
			$('#spinner-shadowblur').spinner('setting', {value:parseInt(pagezone.shadowblur), step: 1, min: 0, max: 99});
			
			$('#spinner-bdwidth').spinner();
			$('#spinner-bdwidth').spinner('setting', {value:parseInt(pagezone.bdwidth), step: 1, min: 0, max: 99});
			$('#spinner-bdradius').spinner();
			$('#spinner-bdradius').spinner('setting', {value:parseInt(pagezone.bdradius), step: 1, min: 0, max: 255});

			$('#spinner-rows').spinner();
			$('#spinner-rows').spinner('setting', {value:parseInt(pagezone.rows), step: 1, min: 1, max: 15});
			$('#spinner-cols').spinner();
			$('#spinner-cols').spinner('setting', {value:parseInt(pagezone.cols), step: 1, min: 1, max: 8});
			$('#spinner-rulewidth').spinner();
			$('#spinner-rulewidth').spinner('setting', {value:parseInt(pagezone.rulewidth), step: 1, min: 1, max: 99});

			refreshLocSpinners(pagezone);
			refreshFontStyle();
			refreshFontFamilySelect();
			
			refreshTouchtypeSelect();
			if (_self.Object.touchflag == 1) {
				refreshSubObjectSelect();
			}
			refreshDiyactionSelect();

			refreshAnimationSelect();
			$('.animationinitdelayRange').ionRangeSlider({
				min: 0,
				max: 10000,
				from: 0,
				type: 'single',
				step: 100,
				hasGrid: false,
				onChange: function(data) {
					_self.Zone.animationinitdelay = $('input[name=animationinitdelay]').val();
					refreshPagezone(_self.Zone);
				}
			});
			$('.animationinitdelayRange').ionRangeSlider('update', {
				from: pagezone.animationinitdelay
			});
			
			refreshDiySelect();
		}

		function refreshSubObjectSelect() {
			if (_mode == 'template') {
				for (var i=0; i<_self.Subobjects.length; i++) {
					_self.Subobjects[i].pageid = _self.Subobjects[i].templateid;
					_self.Subobjects[i].page = _self.Subobjects[i].template;
				}
			}
			
			var data = [];
			if (_self.Subobjects != null) {
				for (var i=0; i<_self.Subobjects.length; i++) {
					data.push({
						id: _self.Subobjects[i].pageid,
						name: _self.Subobjects[i].name,
						page: _self.Subobjects[i]
					})
				}
			}
			
			$('#SubObjectSelect').select2({
				placeholder: common.tips.detail_select,
				//minimumResultsForSearch: -1,
				minimumInputLength: 0,
				data: data,
				formatResult: function (item) {
					if (item.page != null && item.page.snapshot != null) {
						return '<span><img src="/pixsigdata' + item.page.snapshot + '" height="25" /> ' + item.name + '</span>';
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
			var touchpages = _self.Subobjects.filter(function (el) {
				return el.pageid == _self.Zone.touchpageid;
			});
			if (touchpages.length > 0) {
				$('#SubObjectSelect').select2('data', {id: touchpages[0].pageid, name: touchpages[0].name, page: touchpages[0] });
			} else {
				$('#SubObjectSelect').select2('val', '');
			}
		}
		
		function refreshLocSpinners(pagezone) {
			$('#spinner-x').spinner();
			$('#spinner-x').spinner('setting', {value:parseInt(pagezone.leftoffset), step: 1, min: 0, max: parseInt(_self.Object.width)-parseInt(pagezone.width)});
			$('#spinner-y').spinner();
			$('#spinner-y').spinner('setting', {value:parseInt(pagezone.topoffset), step: 1, min: 0, max: parseInt(_self.Object.height)-parseInt(pagezone.height)});
			$('#spinner-w').spinner();
			$('#spinner-w').spinner('setting', {value:parseInt(pagezone.width), step: 1, min: 1, max: parseInt(_self.Object.width)-parseInt(pagezone.leftoffset)});
			$('#spinner-h').spinner();
			$('#spinner-h').spinner('setting', {value:parseInt(pagezone.height), step: 1, min: 1, max: parseInt(_self.Object.height)-parseInt(pagezone.topoffset)});
		}

		$('.collapse').on('shown.bs.collapse', function () {
			$('.opacityRange').ionRangeSlider('update');
			$('.bgopacityRange').ionRangeSlider('update');
			$('.animationinitdelayRange').ionRangeSlider('update');
		});

		$('.spinner').on('change', function(e) {
			_self.Zone.fontsize = $('#spinner-fontsize').spinner('value');
			_self.Zone.lineheight = $('#spinner-lineheight').spinner('value');
			_self.Zone.padding = $('#spinner-padding').spinner('value');
			_self.Zone.leftoffset = $('#spinner-x').spinner('value');
			_self.Zone.topoffset = $('#spinner-y').spinner('value');
			_self.Zone.width = $('#spinner-w').spinner('value');
			_self.Zone.height = $('#spinner-h').spinner('value');
			_self.Zone.shadowh = $('#spinner-shadowh').spinner('value');
			_self.Zone.shadowv = $('#spinner-shadowv').spinner('value');
			_self.Zone.shadowblur = $('#spinner-shadowblur').spinner('value');
			_self.Zone.bdwidth = $('#spinner-bdwidth').spinner('value');
			_self.Zone.bdradius = $('#spinner-bdradius').spinner('value');
			_self.Zone.rows = $('#spinner-rows').spinner('value');
			_self.Zone.cols = $('#spinner-cols').spinner('value');
			_self.Zone.rulewidth = $('#spinner-rulewidth').spinner('value');
			refreshPagezone(_self.Zone);
		});	

		$('.pix-bold').on('click', function(event) {
			if (_self.Zone.fontweight == 'bold') {
				_self.Zone.fontweight = 'normal';
			} else {
				_self.Zone.fontweight = 'bold';
			}
			refreshFontStyle();
			refreshPagezone(_self.Zone);
		});	
		$('.pix-italic').on('click', function(event) {
			if (_self.Zone.fontstyle == 'italic') {
				_self.Zone.fontstyle = 'normal';
			} else {
				_self.Zone.fontstyle = 'italic';
			}
			refreshFontStyle();
			refreshPagezone(_self.Zone);
		});	
		$('.pix-underline').on('click', function(event) {
			if (_self.Zone.decoration == 'underline') {
				_self.Zone.decoration = 'none';
			} else {
				_self.Zone.decoration = 'underline';
			}
			refreshFontStyle();
			refreshPagezone(_self.Zone);
		});	
		$('.pix-strikethrough').on('click', function(event) {
			if (_self.Zone.decoration == 'line-through') {
				_self.Zone.decoration = 'none';
			} else {
				_self.Zone.decoration = 'line-through';
			}
			refreshFontStyle();
			refreshPagezone(_self.Zone);
		});
		$('.pix-align-left').on('click', function(event) {
			if (_self.Zone.align == 'left') {
				_self.Zone.align = '';
			} else {
				_self.Zone.align = 'left';
			}
			refreshFontStyle();
			refreshPagezone(_self.Zone);
		});	
		$('.pix-align-right').on('click', function(event) {
			if (_self.Zone.align == 'right') {
				_self.Zone.align = '';
			} else {
				_self.Zone.align = 'right';
			}
			refreshFontStyle();
			refreshPagezone(_self.Zone);
		});	
		$('.pix-align-center').on('click', function(event) {
			if (_self.Zone.align == 'center') {
				_self.Zone.align = '';
			} else {
				_self.Zone.align = 'center';
			}
			refreshFontStyle();
			refreshPagezone(_self.Zone);
		});	
		$('.pix-align-justify').on('click', function(event) {
			if (_self.Zone.align == 'justify') {
				_self.Zone.align = '';
			} else {
				_self.Zone.align = 'justify';
			}
			refreshFontStyle();
			refreshPagezone(_self.Zone);
		});	

		function refreshFontStyle() {
			if (_self.Zone.fontweight == 'bold') {
				$('.pix-bold').removeClass('default');
				$('.pix-bold').addClass('blue');
			} else {
				$('.pix-bold').removeClass('blue');
				$('.pix-bold').addClass('default');
			}
			if (_self.Zone.fontstyle == 'italic') {
				$('.pix-italic').removeClass('default');
				$('.pix-italic').addClass('blue');
			} else {
				$('.pix-italic').removeClass('blue');
				$('.pix-italic').addClass('default');
			}
			if (_self.Zone.decoration == 'underline') {
				$('.pix-underline').removeClass('default');
				$('.pix-underline').addClass('blue');
				$('.pix-strikethrough').removeClass('blue');
				$('.pix-strikethrough').addClass('default');
			} else if (_self.Zone.decoration == 'line-through') {
				$('.pix-underline').removeClass('blue');
				$('.pix-underline').addClass('default');
				$('.pix-strikethrough').removeClass('default');
				$('.pix-strikethrough').addClass('blue');
			} else {
				$('.pix-underline').removeClass('blue');
				$('.pix-underline').addClass('default');
				$('.pix-strikethrough').removeClass('blue');
				$('.pix-strikethrough').addClass('default');
			}
			if (_self.Zone.align == 'left') {
				$('.pix-align-left').removeClass('default');
				$('.pix-align-left').addClass('blue');
				$('.pix-align-right').removeClass('blue');
				$('.pix-align-right').addClass('default');
				$('.pix-align-center').removeClass('blue');
				$('.pix-align-center').addClass('default');
				$('.pix-align-justify').removeClass('blue');
				$('.pix-align-justify').addClass('default');
			} else if (_self.Zone.align == 'right') {
				$('.pix-align-left').removeClass('blue');
				$('.pix-align-left').addClass('default');
				$('.pix-align-right').removeClass('default');
				$('.pix-align-right').addClass('blue');
				$('.pix-align-center').removeClass('blue');
				$('.pix-align-center').addClass('default');
				$('.pix-align-justify').removeClass('blue');
				$('.pix-align-justify').addClass('default');
			} else if (_self.Zone.align == 'center') {
				$('.pix-align-left').removeClass('blue');
				$('.pix-align-left').addClass('default');
				$('.pix-align-right').removeClass('blue');
				$('.pix-align-right').addClass('default');
				$('.pix-align-center').removeClass('default');
				$('.pix-align-center').addClass('blue');
				$('.pix-align-justify').removeClass('blue');
				$('.pix-align-justify').addClass('default');
			} else if (_self.Zone.align == 'justify') {
				$('.pix-align-left').removeClass('blue');
				$('.pix-align-left').addClass('default');
				$('.pix-align-right').removeClass('blue');
				$('.pix-align-right').addClass('default');
				$('.pix-align-center').removeClass('blue');
				$('.pix-align-center').addClass('default');
				$('.pix-align-justify').removeClass('default');
				$('.pix-align-justify').addClass('blue');
			} else {
				$('.pix-align-left').removeClass('blue');
				$('.pix-align-left').addClass('default');
				$('.pix-align-right').removeClass('blue');
				$('.pix-align-right').addClass('default');
				$('.pix-align-center').removeClass('blue');
				$('.pix-align-center').addClass('default');
				$('.pix-align-justify').removeClass('blue');
				$('.pix-align-justify').addClass('default');
			}
		}

		function refreshFontFamilySelect() {
			var families = ['actor', 'advent_pro', 'Architects_Daughter', 'arial', 'Ariblk', 'arizonia', 'armata', 'AvantGardeLT_Bookoblique', 
			                'AvantGardeLT_Demi', 'BankGothicBold', 'BankGothicMedium', 'Bebas', 'belgrano', 'belleza', 'berlinsans', 'Bookman_old', 
			                'Bookman_old_bi', 'Bookman_old_bold', 'Bookman_old_italic', 'candara', 'Century_Gothic', 'Century_Gothic_Bold', 
			                'ChaparralPro', 'ChaparralProBold', 'ComicSansMS', 'Cooper_Std_Black', 'Courgette-Regular', 'Curlz_MT', 
			                'DJBAlmostPerfect', 'DiplomataSC', 'doppio_one', 'DroidSans', 'electrolize', 'Eras_BD', 'Forte', 'Fradm', 
			                'Fradmcn', 'Fradmit', 'Frahv', 'Frahvit', 'Framd', 'Framdcn', 'Framdit', 'FrederickatheGreat', 'fredoka_one', 'Freeskpt', 
			                'Futura_XBlk_BT', 'gadugi', 'GoboldBoldItalic', 'Gothambold', 'Gothambook', 'Gothammedium', 'Humanist521', 'karla', 
			                'londrina_solid', 'MV_Boli', 'marven_pro', 'MfReallyAwesome', 'MyriadPro', 'norican', 'nova_slim', 'nunito', 'orbitron', 
			                'overlock', 'PT_sana_narrow', 'parisienne', 'Permanent_Marker', 'philosopher', 'pontano_sans', 'pratas', 'quando', 
			                'quixotic', 'RobotoBold', 'RobotoMedium', 'RobotoRegular', 'rockwell', 'RockwellExtraBold', 'russo_one', 'Rye', 'sanchez', 
			                'sarina', 'Scandinavian', 'Scandinavian_Black', 'SegoePrint', 'SegoeUI', 'SegoeUIB', 'signika', 'SketchBlock', 
			                'Taco_modern', 'texgyreadventor-bold', 'Timesnewroman', 'TwentyEightDaysLater', 'VastShadow', 'Verdana', 
			                'yesteryear', 'twentyDaysLater'];
			var familylist = [];
			for (var i=0; i<families.length; i++) {
				familylist.push({
					id: families[i],
					text: families[i],
				})
			}
			$('#FontFamilySelect').select2({
				placeholder: common.tips.detail_select,
				minimumInputLength: 0,
				data: familylist,
				formatResult: function(data) {
					return '<span style="font-family: ' + data.text + '">' + data.text + '</span>'
				},
				formatSelection: function(data) {
					return '<span style="font-family: ' + data.text + '">' + data.text + '</span>'
				},
				initSelection: function(element, callback) {
					if (_self.Zone != null) {
						callback({id: _self.Zone.fontfamily, text: _self.Zone.fontfamily });
					}
				},
				dropdownCssClass: 'bigdrop', 
				escapeMarkup: function (m) { return m; } 
			});
		}
		$('#FontFamilySelect').on('change', function(e) {
			if ($('#FontFamilySelect').select2('data') != null) {
				_self.Zone.fontfamily = $('#FontFamilySelect').select2('data').id;
			}
			refreshPagezone(_self.Zone);
		});	

		function refreshTouchtypeSelect() {
			var touchtypelist = [];
			if (_self.Object.touchflag == 1) {
				touchtypelist.push({id: 0, text: common.view.touchtype_0 });
				touchtypelist.push({id: 1, text: common.view.touchtype_1 });
				touchtypelist.push({id: 2, text: common.view.touchtype_2 });
				touchtypelist.push({id: 3, text: common.view.touchtype_3 });
				touchtypelist.push({id: 9, text: common.view.touchtype_9 });
			} else {
				touchtypelist.push({id: 3, text: common.view.touchtype_3 });
				touchtypelist.push({id: 9, text: common.view.touchtype_9 });
			}
			$('#TouchtypeSelect').select2({
				placeholder: common.tips.detail_select,
				minimumInputLength: 0,
				minimumResultsForSearch: -1,
				data: touchtypelist,
				initSelection: function(element, callback) {
					if (_self.Zone != null) {
						callback({id: _self.Zone.touchtype, text: eval('common.view.touchtype_'+_self.Zone.touchtype) });
					}
				},
				dropdownCssClass: 'bigdrop', 
				escapeMarkup: function (m) { return m; } 
			});
			if (_self.Zone.touchtype == 2) {
				$('#SubObjectSelect').closest('.form-group').css('display', '');
				$('#DiyactionSelect').closest('.form-group').css('display', 'none');
			} else if (_self.Zone.touchtype == 3) {
				$('#SubObjectSelect').closest('.form-group').css('display', 'none');
				$('#DiyactionSelect').closest('.form-group').css('display', '');
			} else {
				$('#SubObjectSelect').closest('.form-group').css('display', 'none');
				$('#DiyactionSelect').closest('.form-group').css('display', 'none');
			}
		}
		$('#TouchtypeSelect').on('change', function(e) {
			if ($('#TouchtypeSelect').select2('data') != null) {
				_self.Zone.touchtype = $('#TouchtypeSelect').select2('data').id;
			}
			if (_self.Zone.touchtype == 2) {
				$('#SubObjectSelect').closest('.form-group').css('display', '');
				$('#DiyactionSelect').closest('.form-group').css('display', 'none');
			} else if (_self.Zone.touchtype == 3) {
				$('#SubObjectSelect').closest('.form-group').css('display', 'none');
				$('#DiyactionSelect').closest('.form-group').css('display', '');
			} else {
				$('#SubObjectSelect').closest('.form-group').css('display', 'none');
				$('#DiyactionSelect').closest('.form-group').css('display', 'none');
			}
		});	

		$('#SubObjectSelect').on('change', function(e) {
			if ($('#SubObjectSelect').select2('data') != null) {
				_self.Zone.touchpageid = $('#SubObjectSelect').select2('data').id;
			}
		});	

		function refreshDiyactionSelect() {
			var diyzones = _self.Object.pagezones.filter(function (el) {
				return el.diy != null;
			});
			var diyactionlist = [];
			if (diyzones.length > 0) {
				for (var i=0; i<diyzones[0].diy.diyactions.length; i++) {
					diyactionlist.push({
						id: diyzones[0].diy.diyactions[i].diyactionid,
						text: diyzones[0].diy.diyactions[i].name,
						diyaction: diyzones[0].diy.diyactions[i]
					})
				}
			}
			$('#DiyactionSelect').select2({
				placeholder: common.tips.detail_select,
				minimumInputLength: 0,
				minimumResultsForSearch: -1,
				data: diyactionlist,
				initSelection: function(element, callback) {
					if (_self.Zone != null && _self.Zone.touchtype == 3 && _self.Zone.diyaction != null) {
						callback({id: _self.Zone.diyaction.diyactionid, text: _self.Zone.diyaction.name, diyaction: _self.Zone.diyaction });
					}
				},
				dropdownCssClass: 'bigdrop', 
				escapeMarkup: function (m) { return m; } 
			});
		}
		$('#DiyactionSelect').on('change', function(e) {
			if ($('#DiyactionSelect').select2('data') != null) {
				_self.Zone.diyaction = $('#DiyactionSelect').select2('data').diyaction;
				_self.Zone.diyactionid = $('#DiyactionSelect').select2('data').id;
			}
		});	

		function refreshAnimationSelect() {
			var animations = [];
			animations.push({id: 'none', text: common.animation.none});
			animations.push({id: 'pulse', text: common.animation.pulse});
			animations.push({id: 'flash', text: common.animation.flash});
			animations.push({id: 'shake', text: common.animation.shake});
			animations.push({id: 'jackInTheBox', text: common.animation.jackInTheBox});
			animations.push({id: 'rubberBand', text: common.animation.rubberBand});
			animations.push({id: 'bounce', text: common.animation.bounce});
			animations.push({id: 'swing', text: common.animation.swing});
			animations.push({id: 'wobble', text: common.animation.wobble});
			animations.push({id: 'jello', text: common.animation.jello});
			animations.push({id: 'bounceIn', text: common.animation.bounceIn});
			animations.push({id: 'bounceInDown', text: common.animation.bounceInDown});
			animations.push({id: 'bounceInLeft', text: common.animation.bounceInLeft});
			animations.push({id: 'bounceInRight', text: common.animation.bounceInRight});
			animations.push({id: 'bounceInUp', text: common.animation.bounceInUp});
			animations.push({id: 'bounceOut', text: common.animation.bounceOut});
			animations.push({id: 'bounceOutDown', text: common.animation.bounceOutDown});
			animations.push({id: 'bounceOutLeft', text: common.animation.bounceOutLeft});
			animations.push({id: 'bounceOutRight', text: common.animation.bounceOutRight});
			animations.push({id: 'bounceOutUp', text: common.animation.bounceOutUp});
			animations.push({id: 'fadeIn', text: common.animation.fadeIn});
			animations.push({id: 'fadeInDown', text: common.animation.fadeInDown});
			animations.push({id: 'fadeInUp', text: common.animation.fadeInUp});
			animations.push({id: 'fadeInLeft', text: common.animation.fadeInLeft});
			animations.push({id: 'fadeInRight', text: common.animation.fadeInRight});
			animations.push({id: 'fadeOut', text: common.animation.fadeOut});
			animations.push({id: 'fadeOutDown', text: common.animation.fadeOutDown});
			animations.push({id: 'fadeOutLeft', text: common.animation.fadeOutLeft});
			animations.push({id: 'fadeOutRight', text: common.animation.fadeOutRight});
			animations.push({id: 'fadeOutUp', text: common.animation.fadeOutUp});
			animations.push({id: 'flip', text: common.animation.flip});
			animations.push({id: 'flipOutY', text: common.animation.flipOutY});
			animations.push({id: 'rollIn', text: common.animation.rollIn});
			animations.push({id: 'rotateIn', text: common.animation.rotateIn});
			animations.push({id: 'zoomInDown', text: common.animation.zoomInDown});
			animations.push({id: 'slideInLeft', text: common.animation.slideInLeft});
			animations.push({id: 'slideInRight', text: common.animation.slideInRight});
			animations.push({id: 'slideInDown', text: common.animation.slideInDown});
			$('#AnimationinitSelect').select2({
				placeholder: common.tips.detail_select,
				minimumInputLength: 0,
				minimumResultsForSearch: -1,
				data: animations,
				initSelection: function(element, callback) {
					if (_self.Zone != null) {
						callback({id: _self.Zone.animationinit, text: eval('common.animation.'+_self.Zone.animationinit) });
					}
				},
				dropdownCssClass: 'bigdrop', 
				escapeMarkup: function (m) { return m; } 
			});
			$('#AnimationclickSelect').select2({
				placeholder: common.tips.detail_select,
				minimumInputLength: 0,
				minimumResultsForSearch: -1,
				data: animations,
				clickSelection: function(element, callback) {
					if (_self.Zone != null) {
						callback({id: _self.Zone.animationclick, text: eval('common.animation.'+_self.Zone.animationclick) });
					}
				},
				dropdownCssClass: 'bigdrop', 
				escapeMarkup: function (m) { return m; } 
			});
		}
		$('#AnimationinitSelect').on('change', function(e) {
			if ($('#AnimationinitSelect').select2('data') != null) {
				_self.Zone.animationinit = $('#AnimationinitSelect').select2('data').id;
			}
			refreshPagezone(_self.Zone);
		});	
		$('#AnimationclickSelect').on('change', function(e) {
			if ($('#AnimationclickSelect').select2('data') != null) {
				_self.Zone.animationclick = $('#AnimationclickSelect').select2('data').id;
			}
			refreshPagezone(_self.Zone);
		});	

		function refreshDiySelect() {
			$('#DiySelect').select2({
				minimumInputLength: 0,
				ajax: {
					url: 'diy!list.action',
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
									text:item.name, 
									id:item.diyid, 
									diy:item, 
								};
							}),
							more: more
						};
					}
				},
				formatResult: function(data) {
					var width = 40;
					var height = 40 * data.diy.height / data.diy.width;
					if (data.diy.width < data.diy.height) {
						height = 40;
						width = 40 * data.diy.width / data.diy.height;
					}
					var html = '<span><img src="/pixsigdata' + data.diy.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.diy.name + '</span>';
					return html;
				},
				formatSelection: function(data) {
					var width = 30;
					var height = 30 * height / width;
					if (data.diy.width < data.diy.height) {
						height = 30;
						width = 30 * width / height;
					}
					var html = '<span><img src="/pixsigdata' + data.diy.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.diy.name + '</span>';
					return html;
				},
				initSelection: function(element, callback) {
					if (_self.Zone != null && _self.Zone.diy != null) {
						callback({id: _self.Zone.diy.diyid, text: _self.Zone.diy.name, diy: _self.Zone.diy });
					}
				},
				dropdownCssClass: 'bigdrop', 
				escapeMarkup: function (m) { return m; } 
			});
		}
		$('#DiySelect').on('change', function(e) {
			if ($('#DiySelect').select2('data') != null) {
				_self.Zone.diy = $('#DiySelect').select2('data').diy;
				_self.Zone.diyid = $('#DiySelect').select2('data').id;
			}
			refreshPagezone(_self.Zone);
		});	


		$('.zoneform input,select').on('change', function(e) {
			_self.Zone.dateformat = $('.zoneform select[name=dateformat]').val();
			_self.Zone.zindex = $('.zoneform select[name=zindex]').val();
			_self.Zone.bdstyle = $('.zoneform select[name=bdstyle]').val();
			_self.Zone.rules = $('.zoneform select[name=rules]').val();
			refreshPagezone(_self.Zone);
		});

		function validPagezone(pagezone) {
			if (pagezone != null && (pagezone.type == 3 || pagezone.type == 7)) {
				var pagezoneDiv = $('#PagezoneDiv' + pagezone.pagezoneid);
				var content = $(pagezoneDiv).find('p').html();
				if (content != 'Double click to edit') {
					pagezone.content = content;
				} else {
					pagezone.content = '';
				}
			}
			return true;
		}

		//新增pagezone
		$('body').on('click', '.pix-addzone', function(event) {
			var zonetype = $(event.target).attr('zonetype');
			if (zonetype == undefined) {
				zonetype = $(event.target).parent().attr('zonetype');
			}
			
			var pagezones = _self.Object.pagezones.filter(function (el) {
				return el.type == zonetype;
			});
			if (pagezones.length >= ZoneLimits[zonetype] ) {
				return;
			}
			
			var pagezone = {};
			pagezone.pagezoneid = '-' + Math.round(Math.random()*100000000);
			pagezone.pageid = _self.Objectid;
			pagezone.name = 'Zone_' + zonetype;
			pagezone.type = zonetype;
			pagezone.leftoffset = _self.Object.height * 0.1;
			pagezone.topoffset = _self.Object.width * 0.1;
			if (ZoneRatios[zonetype] != undefined) {
				pagezone.width = _self.Object.width * 0.2;
				pagezone.height = _self.Object.width * 0.2 / ZoneRatios[zonetype];
			} else {
				pagezone.width = _self.Object.width * 0.2;
				pagezone.height = _self.Object.height * 0.2;
			}
			pagezone.zindex = 52;
			pagezone.transform = 'matrix(1, 0, 0, 1, 0, 0)';
			pagezone.bdcolor = '#000000';
			pagezone.bdstyle = 'solid';
			pagezone.bdwidth = 0;
			pagezone.bdradius = 0;
			pagezone.bgcolor = '#999999';
			pagezone.bgopacity = 120;
			pagezone.opacity = 255;
			pagezone.padding = 0;
			pagezone.shadowh = 0;
			pagezone.shadowv = 0;
			pagezone.shadowblur = 0;
			pagezone.shadowcolor = '#000000';
			pagezone.color = '#FFFFFF';
			pagezone.fontfamily = 'DroidSans';
			pagezone.fontsize = 40;
			pagezone.fontweight = 'normal';
			pagezone.fontstyle = 'normal';
			pagezone.decoration = 'none';
			pagezone.align = 'center';
			pagezone.lineheight = 80;
			pagezone.touchtype = '9';
			pagezone.touchpageid = 0;
			pagezone.content = '';
			pagezone.pagezonedtls = [];
			if (pagezone.type == 5) {
				pagezone.dateformat = 'yyyy-MM-dd HH:mm:ss';
			}
			if (pagezone.type == 6) {
				pagezone.color = '#000000';
				pagezone.bgcolor = '#FFFFFF';
				pagezone.bgopacity = 0;
				pagezone.bdwidth = 1;
			}
			if (pagezone.type == 11) {
				pagezone.rows = 5;
				pagezone.cols = 2;
			} else if (pagezone.type == 12) {
				pagezone.rows = 9;
				pagezone.cols = 6;
			} else if (pagezone.type == 31) {
				pagezone.rows = 5;
				pagezone.cols = 3;
			} else {
				pagezone.rows = 1;
				pagezone.cols = 1;
			}
			pagezone.rules = 'all';
			pagezone.rulecolor = '#000000';
			pagezone.rulewidth = 1;
			pagezone.animationinit = 'none';
			pagezone.animationclick = 'none';
			pagezone.sourcetype = 0;
			
			_self.Object.pagezones.push(pagezone);
			
			unselectAllZones();
			_self.Zone = pagezone;
			createZone(pagezone);
			initOperation(pagezone);
			selectZone(_self.Zone);
			enterPagezoneFocus(pagezone);
		});


		$('[type=submit]', $('#ScrollModal')).on('click', function(event) {
			_self.Zone.sourcetype = $('#ScrollModal input[name="sourcetype"]:checked').val();
			_self.Zone.content = $('#ScrollModal textarea[name="content"]').val();
			refreshPagezone(_self.Zone);
			$('#ScrollModal').modal('hide');
		});
		$('#ScrollModal input[name="sourcetype"]').change(function(e) {
			var sourcetype = $('#ScrollModal input[name="sourcetype"]:checked').val();
			if (sourcetype == 0) {
				$('#ScrollModal textarea[name="content"]').removeAttr('readonly');
			} else {
				$('#ScrollModal textarea[name="content"]').attr('readonly','readonly');
			}
		});

		$('[type=submit]', $('#WebModal')).on('click', function(event) {
			_self.Zone.content = $('#WebModal textarea[name="content"]').val();
			refreshPagezone(_self.Zone);
			$('#WebModal').modal('hide');
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
				imagehtml += '<a class="btn default btn-sm green pix-pagezonedtl-image-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
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
				videohtml += '<a class="btn default btn-sm green pix-pagezonedtl-video-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
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
				aoData.push({'name':'format','value':'mp4' });
			}
		});
		$('#VideoTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
		$('#VideoTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
		$('#VideoTable').css('width', '100%');

		//播放明细Table初始化
		$('#PagezonedtlTable').dataTable({
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
				$('td:eq(4)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-pagezonedtl-up"><i class="fa fa-arrow-up"></i></button>');
				$('td:eq(5)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-pagezonedtl-down"><i class="fa fa-arrow-down"></i></button>');
				$('td:eq(6)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn red btn-xs pix-pagezonedtl-delete"><i class="fa fa-trash-o"></i></button>');
				return nRow;
			}
		});

		$('#LibraryModal').on('shown.bs.modal', function (e) {
			$('#ImageTable').dataTable()._fnAjaxUpdate();
			$('#VideoTable').dataTable()._fnAjaxUpdate();
			refreshPagezondtls();
		})

		function refreshPagezondtls() {
			$('#PagezonedtlTable').dataTable().fnClearTable();
			for (var i=0; i<_self.Zone.pagezonedtls.length; i++) {
				var pagezonedtl = _self.Zone.pagezonedtls[i];
				var thumbwidth = 100;
				var thumbnail = '';
				var thumbhtml = '';
				var medianame = '';
				if (pagezonedtl.objtype == 1) {
					mediatype = common.view.intvideo;
					medianame = pagezonedtl.video.name;
					if (pagezonedtl.video.thumbnail == null) {
						thumbnail = '../img/video.jpg';
					} else {
						thumbnail = '/pixsigdata' + pagezonedtl.video.thumbnail;
					}
				} else if (pagezonedtl.objtype == 2) {
					mediatype = common.view.image;
					medianame = pagezonedtl.image.name;
					thumbwidth = pagezonedtl.image.width > pagezonedtl.image.height? 100 : 100*pagezonedtl.image.width/pagezonedtl.image.height;
					thumbnail = '/pixsigdata' + pagezonedtl.image.thumbnail;
				} else {
					mediatype = common.view.unknown;
				}
				if (thumbnail != '') {
					thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + medianame + '"></div>';
				}
				$('#PagezonedtlTable').dataTable().fnAddData([pagezonedtl.sequence, mediatype, thumbhtml, medianame, 0, 0, 0]);
			}
		}

		$('body').on('click', '.pix-image-library', function(event) {
			$('.image-ctl').css('display', '');
			$('.video-ctl').css('display', 'none');
			$('#LibraryModal').modal();
		});

		$('body').on('click', '.pix-video-library', function(event) {
			$('.image-ctl').css('display', 'none');
			$('.video-ctl').css('display', '');
			$('#LibraryModal').modal();
		});

		//增加视频到播放明细Table
		$('body').on('click', '.pix-pagezonedtl-video-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#VideoTable').dataTable().fnGetData(rowIndex);
			var pagezonedtl = {};
			pagezonedtl.pagezonedtlid = 0;
			pagezonedtl.pagezoneid = _self.Zone.pagezoneid;
			pagezonedtl.objtype = '1';
			pagezonedtl.objid = data.videoid;
			pagezonedtl.sequence = _self.Zone.pagezonedtls.length + 1;
			pagezonedtl.video = data;
			_self.Zone.pagezonedtls.push(pagezonedtl);

			var thumbnail = '';
			if (data.thumbnail == null) {
				thumbnail = '../img/video.jpg';
			} else {
				thumbnail = '/pixsigdata' + data.thumbnail;
			}
			var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="100%" alt="' + data.name + '"></div>';
			$('#PagezonedtlTable').dataTable().fnAddData([pagezonedtl.sequence, common.view.intvideo, thumbhtml, data.name, 0, 0, 0]);
			refreshPagezone(_self.Zone);
		});

		//增加图片到播放明细Table
		$('body').on('click', '.pix-pagezonedtl-image-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#ImageTable').dataTable().fnGetData(rowIndex);
			var pagezonedtl = {};
			pagezonedtl.pagezonedtlid = 0;
			pagezonedtl.pagezoneid = _self.Zone.pagezoneid;
			pagezonedtl.objtype = '2';
			pagezonedtl.objid = data.imageid;
			pagezonedtl.sequence = _self.Zone.pagezonedtls.length + 1;
			pagezonedtl.image = data;
			_self.Zone.pagezonedtls.push(pagezonedtl);

			var thumbwidth = data.width > data.height? 100 : 100*data.width/data.height;
			var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="/pixsigdata' + data.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + data.name + '"></div>';
			$('#PagezonedtlTable').dataTable().fnAddData([pagezonedtl.sequence, common.view.image, thumbhtml, data.name, 0, 0, 0]);
			refreshPagezone(_self.Zone);
		});

		//删除播放明细列表某行
		$('body').on('click', '.pix-pagezonedtl-delete', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			for (var i=rowIndex; i<$('#PagezonedtlTable').dataTable().fnSettings().fnRecordsDisplay(); i++) {
				var data = $('#PagezonedtlTable').dataTable().fnGetData(i);
				$('#PagezonedtlTable').dataTable().fnUpdate(i, parseInt(i), 0);
			}
			$('#PagezonedtlTable').dataTable().fnDeleteRow(rowIndex);
			
			for (var i=rowIndex; i<_self.Zone.pagezonedtls.length; i++) {
				_self.Zone.pagezonedtls[i].sequence = i;
			}
			_self.Zone.pagezonedtls.splice(rowIndex, 1);
			refreshPagezone(_self.Zone);
		});

		//上移播放明细列表某行
		$('body').on('click', '.pix-pagezonedtl-up', function(event) {
			var rowIndex = $(event.target).attr('data-id');
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			if (rowIndex == 0) {
				return;
			}
			rowIndex = parseInt(rowIndex);
			var movedDta = $('#PagezonedtlTable').dataTable().fnGetData(rowIndex).slice(0);
			var prevData = $('#PagezonedtlTable').dataTable().fnGetData(rowIndex-1).slice(0);
			$('#PagezonedtlTable').dataTable().fnUpdate(prevData[1], rowIndex, 1);
			$('#PagezonedtlTable').dataTable().fnUpdate(prevData[2], rowIndex, 2);
			$('#PagezonedtlTable').dataTable().fnUpdate(prevData[3], rowIndex, 3);
			$('#PagezonedtlTable').dataTable().fnUpdate(movedDta[1], rowIndex-1, 1);
			$('#PagezonedtlTable').dataTable().fnUpdate(movedDta[2], rowIndex-1, 2);
			$('#PagezonedtlTable').dataTable().fnUpdate(movedDta[3], rowIndex-1, 3);
			
			var temp = _self.Zone.pagezonedtls[rowIndex];
			_self.Zone.pagezonedtls[rowIndex] =  _self.Zone.pagezonedtls[rowIndex-1];
			_self.Zone.pagezonedtls[rowIndex].sequence = rowIndex+1;
			_self.Zone.pagezonedtls[rowIndex-1] = temp;
			_self.Zone.pagezonedtls[rowIndex-1].sequence = rowIndex;
			refreshPagezone(_self.Zone);
		});

		//下移播放明细列表某行
		$('body').on('click', '.pix-pagezonedtl-down', function(event) {
			var rowIndex = $(event.target).attr('data-id');
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			if (rowIndex == $('#PagezonedtlTable').dataTable().fnSettings().fnRecordsDisplay() - 1) {
				return;
			}
			rowIndex = parseInt(rowIndex);
			var movedDta = $('#PagezonedtlTable').dataTable().fnGetData(rowIndex).slice(0);
			var nextData = $('#PagezonedtlTable').dataTable().fnGetData(rowIndex+1).slice(0);
			$('#PagezonedtlTable').dataTable().fnUpdate(nextData[1], rowIndex, 1);
			$('#PagezonedtlTable').dataTable().fnUpdate(nextData[2], rowIndex, 2);
			$('#PagezonedtlTable').dataTable().fnUpdate(nextData[3], rowIndex, 3);
			$('#PagezonedtlTable').dataTable().fnUpdate(movedDta[1], rowIndex+1, 1);
			$('#PagezonedtlTable').dataTable().fnUpdate(movedDta[2], rowIndex+1, 2);
			$('#PagezonedtlTable').dataTable().fnUpdate(movedDta[3], rowIndex+1, 3);
			
			var temp = _self.Zone.pagezonedtls[rowIndex];
			_self.Zone.pagezonedtls[rowIndex] = _self.Zone.pagezonedtls[rowIndex+1];
			_self.Zone.pagezonedtls[rowIndex].sequence = rowIndex+1;
			_self.Zone.pagezonedtls[rowIndex+1] = temp;
			_self.Zone.pagezonedtls[rowIndex+1].sequence = rowIndex+2;
			refreshPagezone(_self.Zone);
		});

		//图片table初始化
		var BGImageTree = new BranchTree($('#BGImageModal'));
		$('#BGImageTable thead').css('display', 'none');
		$('#BGImageTable tbody').css('display', 'none');	
		var bgimagehtml = '';
		$('#BGImageTable').dataTable({
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
				if ($('#BGImageContainer').length < 1) {
					$('#BGImageTable').append('<div id="BGImageContainer"></div>');
				}
				$('#BGImageContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					bgimagehtml = '';
					bgimagehtml += '<div class="row" >';
				}
				bgimagehtml += '<div class="col-md-2 col-xs-2">';
				
				bgimagehtml += '<div id="ThumbContainer" style="position:relative">';
				var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
				bgimagehtml += '<div id="BGImageThumb" class="thumbs">';
				bgimagehtml += '<img src="/pixsigdata' + aData.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				bgimagehtml += '<div class="mask">';
				bgimagehtml += '<div>';
				bgimagehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
				bgimagehtml += '<a class="btn default btn-sm green pix-bgimage-set" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
				bgimagehtml += '</div>';
				bgimagehtml += '</div>';
				bgimagehtml += '</div>';

				bgimagehtml += '</div>';

				bgimagehtml += '</div>';
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#BGImageTable').dataTable().fnGetData().length) {
					bgimagehtml += '</div>';
					if ((iDisplayIndex+1) != $('#BGImageTable').dataTable().fnGetData().length) {
						bgimagehtml += '<hr/>';
					}
					$('#BGImageContainer').append(bgimagehtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#BGImageContainer .thumbs').each(function(i) {
					$(this).height($(this).parent().width());
				});
				$('#BGImageContainer .mask').each(function(i) {
					$(this).height($(this).parent().parent().width() + 2);
				});
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':BGImageTree.branchid });
				aoData.push({'name':'folderid','value':BGImageTree.folderid });
			}
		});
		$('#BGImageTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
		$('#BGImageTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
		$('#BGImageTable').css('width', '100%');

		$('body').on('click', '.pix-bgimage-library', function(event) {
			$('#BGImageModal').modal();
		});
		$('#BGImageModal').on('shown.bs.modal', function (e) {
			$('#BGImageTable').dataTable()._fnAjaxUpdate();
			displayBGImagePreview();
		})
		//设置按键背景图片
		$('body').on('click', '.pix-bgimage-set', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#BGImageTable').dataTable().fnGetData(rowIndex);
			if (_self.Zone.pagezonedtls.length == 0) {
				var pagezonedtl = {};
				pagezonedtl.pagezonedtlid = 0;
				pagezonedtl.pagezoneid = _self.Zone.pagezoneid;
				pagezonedtl.objtype = '2';
				pagezonedtl.objid = data.imageid;
				pagezonedtl.sequence = 1;
				pagezonedtl.image = data;
				_self.Zone.pagezonedtls.push(pagezonedtl);
			} else {
				_self.Zone.pagezonedtls[0].objtype = '2';
				_self.Zone.pagezonedtls[0].objid = data.imageid;
				_self.Zone.pagezonedtls[0].image = data;
			}
			displayBGImagePreview();
			refreshPagezone(_self.Zone);
		});
		function displayBGImagePreview() {
			$('#BGImagePreview').height($('#BGImagePreview').width());
			if (_self.Zone.pagezonedtls.length > 0) {
				var backgroundimage = _self.Zone.pagezonedtls[0].image;
				if (backgroundimage != '') {
					$('#BGImagePreview').css('background-image', 'url(/pixsigdata' + backgroundimage.filepath + ')');
					var owidth = backgroundimage.width;
					var oheight = backgroundimage.height;
					var background_size = 'auto auto';
					if (owidth >= $('#BGImagePreview').width() || oheight >= $('#BGImagePreview').height()) {
						if (owidth > oheight) {
							background_size = '100% auto';
						} else {
							background_size = 'auto 100%';
						}
					}
					$('#BGImagePreview').css('background-size', background_size);
					$('#BGImagePreview').css('background-position', 'center');
					$('#BGImagePreview').css('background-repeat', 'no-repeat');
				} else {
					$('#BGImagePreview').css('background-image', '');
				}
			} else {
				$('#BGImagePreview').css('background-image', '');
			}
		}




		$(document).keydown(function (e) {
			if (e.which == 13 && text_editable == 'dblclick') {
				if (window.getSelection) {
					var selection = window.getSelection();
					var range = selection.getRangeAt(0);
					var br = document.createElement('br');
					var textNode = document.createTextNode('\u00a0'); //Passing ' ' directly will not end up being shown correctly
					range.deleteContents();//required or not?
					range.insertNode(br);
					range.collapse(false);
					range.insertNode(textNode);
					range.selectNodeContents(textNode);
					selection.removeAllRanges();
					selection.addRange(range);
					return false;
				}
			}
			if (_self.Zone != null) {
				var pagezonediv = $('#PagezoneDiv' + _self.Zone.pagezoneid);
				var status = $(pagezonediv).find('#rotatable').hasClass('dblclick');
				if ((e.which == 46) && (status === false) && ((e.target.tagName).toLowerCase() !== 'input')) {
					bootbox.confirm(common.tips.remove + eval('common.view.pagezone_type_' + _self.Zone.type), function(result) {
						if (result == true) {
							_self.Object.pagezones.splice(_self.Object.pagezones.indexOf(_self.Zone), 1);
							_self.Zone = null;
							$(pagezonediv).remove();
							enterPagezoneFocus(_self.Zone);
						}
					 });
				}
			}
		});

		$('.pix-preview').on('click', function(event) {
			$('#PreviewForm input[name="content"]').val($.toJSON(_self.Object));
			var pagezones = _self.Object.pagezones.filter(function (el) {
				return el.diy != null;
			});
			if (pagezones.length > 0) {
				$('#PreviewForm input[name="diycode"]').val(pagezones[0].diy.code);
			} else {
				$('#PreviewForm input[name="diycode"]').val('');
			}
			$('#PreviewForm').submit();
		});
	};

	init();
	
};
