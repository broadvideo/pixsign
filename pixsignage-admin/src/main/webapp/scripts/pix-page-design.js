var ZoneLimits = [];
ZoneLimits['1'] = 100;
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

var ZoneRatios = [];

var PageScale = 1;

var CurrentMediaBranchid;
var CurrentMediaFolderid;

$('#PageModal').on('shown.bs.modal', function (e) {
	$('#ZoneEditPanel').css('display' , 'none');
	$('#PageDiv').empty();
	$('#PageDiv').css('position', 'relative');
	$('#PageDiv').css('margin-left', 'auto');
	$('#PageDiv').css('margin-right', 'auto');
	$('#PageDiv').css('border', '1px solid #000');
	if (CurrentObj.width > CurrentObj.height) {
		var width = Math.floor($('#PageDiv').parent().width());
		PageScale = CurrentObj.width / width;
		var height = CurrentObj.height / PageScale;
	} else {
		var height = Math.floor($('#PageDiv').parent().width());
		PageScale = CurrentObj.height / height;
		var width = CurrentObj.width / PageScale;
	}
	$('#PageDiv').css('width' , width);
	$('#PageDiv').css('height' , height);
	
	var pagezones = CurrentObj.pagezones;
	for (var i=0; i<pagezones.length; i++) {
		createZone(pagezones[i]);
		initOperation(pagezones[i]);
	}
	unselectAllZones();
})

function updatePagezonePos(e, ui) {
	var pagezoneid = $(this).attr('pagezoneid');
	var pagezones = CurrentObj.pagezones.filter(function (el) {
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

	pagezones[0].width = Math.round(CurrentObj.width * w, 0);
	pagezones[0].height = Math.round(CurrentObj.height * h, 0);
	pagezones[0].leftoffset = Math.round(CurrentObj.width * l, 0);
	pagezones[0].topoffset = Math.round(CurrentObj.height * t, 0);
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
			// insert text manually
			//document.execCommand('insertHTML', false, text);
			document.execCommand('insertText', false, text);
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
		'width': 100*pagezone.width/CurrentObj.width + '%',
		'height': 100*pagezone.height/CurrentObj.height + '%',
		'top': 100*pagezone.topoffset/CurrentObj.height + '%', 
		'left': 100*pagezone.leftoffset/CurrentObj.width + '%', 
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
		'border-color': pagezone.bdcolor, 
		'border-style': pagezone.bdstyle, 
		'border-width': (parseInt(pagezone.bdwidth) / PageScale) + 'px', 
		'border-top-right-radius': (parseInt(pagezone.bdtr) / PageScale) + 'px', 
		'border-top-left-radius': (parseInt(pagezone.bdtl) / PageScale) + 'px', 
		'border-bottom-left-radius': (parseInt(pagezone.bdbl) / PageScale) + 'px', 
		'border-bottom-right-radius': (parseInt(pagezone.bdbr) / PageScale) + 'px', 
		'padding': (parseInt(pagezone.padding) / PageScale) + 'px', 
	});
	if (pagezone.type == 1) {
		//Video Zone
		var shadow = '';
		shadow += (parseInt(pagezone.shadowh) / PageScale) + 'px ';
		shadow += (parseInt(pagezone.shadowv) / PageScale) + 'px ';
		shadow += (parseInt(pagezone.shadowblur) / PageScale) + 'px ';
		shadow += pagezone.shadowcolor;
		$(pagezoneDiv).find('#rotatable').css({
			'box-shadow': shadow, 
			'opacity': parseInt(pagezone.opacity)/255,
		});
		if (pagezone.pagezonedtls.length > 0 && pagezone.pagezonedtls[0].video != null) {
			$(pagezoneDiv).find('img').attr('src', '/pixsigdata' + pagezone.pagezonedtls[0].video.thumbnail);
			$(pagezoneDiv).find('img').attr('width', '100%');
			$(pagezoneDiv).find('img').attr('height', '100%');
		}
	} else if (pagezone.type == 2) {
		//Image Zone
		var shadow = '';
		shadow += (parseInt(pagezone.shadowh) / PageScale) + 'px ';
		shadow += (parseInt(pagezone.shadowv) / PageScale) + 'px ';
		shadow += (parseInt(pagezone.shadowblur) / PageScale) + 'px ';
		shadow += pagezone.shadowcolor;
		$(pagezoneDiv).find('#rotatable').css({
			'box-shadow': shadow, 
			'opacity': parseInt(pagezone.opacity)/255,
		});
		if (pagezone.pagezonedtls.length > 0 && pagezone.pagezonedtls[0].image != null) {
			$(pagezoneDiv).find('img').attr('src', '/pixsigdata' + pagezone.pagezonedtls[0].image.filepath);
			$(pagezoneDiv).find('img').attr('width', '100%');
			$(pagezoneDiv).find('img').attr('height', '100%');
		}
	} else if (pagezone.type == 3) {
		//Text Zone
		var shadow = '';
		shadow += (parseInt(pagezone.shadowh) / PageScale) + 'px ';
		shadow += (parseInt(pagezone.shadowv) / PageScale) + 'px ';
		shadow += (parseInt(pagezone.shadowblur) / PageScale) + 'px ';
		shadow += pagezone.shadowcolor;
		$(pagezoneDiv).find('#rotatable').css({
			'color': pagezone.color, 
			'font-family': pagezone.fontfamily, 
			'font-size': (parseInt(pagezone.fontsize) / PageScale) + 'px', 
			'text-decoration': pagezone.decoration, 
			'text-align': pagezone.align, 
			'font-weight': pagezone.fontweight, 
			'font-style': pagezone.fontstyle, 
			'line-height': (parseInt(pagezone.lineheight) / PageScale) + 'px', 
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
		var shadow = '';
		shadow += (parseInt(pagezone.shadowh) / PageScale) + 'px ';
		shadow += (parseInt(pagezone.shadowv) / PageScale) + 'px ';
		shadow += (parseInt(pagezone.shadowblur) / PageScale) + 'px ';
		shadow += pagezone.shadowcolor;
		$(pagezoneDiv).find('#rotatable').css({
			'color': pagezone.color, 
			'font-family': pagezone.fontfamily, 
			'font-size': (parseInt(pagezone.fontsize) / PageScale) + 'px', 
			'text-decoration': pagezone.decoration, 
			'text-align': pagezone.align, 
			'font-weight': pagezone.fontweight, 
			'font-style': pagezone.fontstyle, 
			'line-height': (parseInt(pagezone.lineheight) / PageScale) + 'px', 
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
	} else {
		$(pagezoneDiv).find('#rotatable').css({
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
	for (var i=0; i<CurrentObj.pagezones.length; i++) {
		pagezone = CurrentObj.pagezones[i];
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
	var scale = CurrentObj.width / $('#PageDiv').width();
	var offset = $(this).offset();
	var posX = (e.pageX - offset.left) * scale;
	var posY = (e.pageY - offset.top) * scale;
	var pagezones = CurrentObj.pagezones.filter(function (el) {
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

		if (validPagezone(CurrentZone)) {
			if ($('#rotatable[contenteditable=true]').length > 0) {
				return;
			}
			if (dblclick) {
				if (pagezones[0].type == 1) {
					//Video Zone
					CurrentZone = pagezones[0];
					$('.image-ctl').css('display', 'none');
					$('.video-ctl').css('display', '');
					$('#LibraryModal').modal();
				} else if (pagezones[0].type == 2) {
					//Image Zone
					CurrentZone = pagezones[0];
					$('.image-ctl').css('display', '');
					$('.video-ctl').css('display', 'none');
					$('#LibraryModal').modal();
				} else if (pagezones[0].type == 3) {
					//Text Zone
					CurrentZone = pagezones[0];
					var pagezonediv = $('#PagezoneDiv' + CurrentZone.pagezoneid);
					if (!$(pagezonediv).find('#rotatable').hasClass('dblclick')) {
						unselectAllZones();
						selectZone(CurrentZone);

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
					enterPagezoneFocus(CurrentZone);
				} else if (pagezones[0].type == 4) {
					//Scroll Zone
					CurrentZone = pagezones[0];
					$('#ScrollModal textarea[name="content"]').val(CurrentZone.content);
					$('#ScrollModal').modal();
				} else {
					return;
				}
			} else {
				CurrentZone = pagezones[0];
				unselectAllZones();
				selectZone(CurrentZone);
				enterPagezoneFocus(CurrentZone);
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
	validPagezone(CurrentZone);
});

function enterPagezoneFocus(pagezone) {
	if (pagezone == null) {
		$('#ZoneEditPanel').css('display' , 'none');
		return;
	}
	$('#ZoneEditPanel').css('display' , '');
	$('.zone-ctl').css('display', 'none');
	$('.zonetype-' + pagezone.type).css('display', 'block');
	$('#ZoneEditForm1').loadJSON(pagezone);
	$('#ZoneEditForm2').loadJSON(pagezone);
	$('#ZoneEditForm3').loadJSON(pagezone);
	$('#ZoneEditForm4').loadJSON(pagezone);
	$('#ZoneEditForm5').loadJSON(pagezone);
	$('#ZoneEditForm6').loadJSON(pagezone);

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
				CurrentZone.color = color;
				refreshPagezone(CurrentZone);
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
				CurrentZone.bgcolor = color;
				refreshPagezone(CurrentZone);
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
				CurrentZone.shadowcolor = color;
				refreshPagezone(CurrentZone);
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
				CurrentZone.bdcolor = color;
				refreshPagezone(CurrentZone);
			}
		},
		onDropper		: null		// callback when dropper is clicked
	});
	$('.bdcolorPick i').css('background', pagezone.bdcolor);
	$('.bdcolorPick input').val(pagezone.bdcolor);

	$('.opacityRange').ionRangeSlider({
		min: 0,
		max: 255,
		from: 255,
		type: 'single',
		step: 5,
		hasGrid: false,
		onChange: function(data) {
			CurrentZone.opacity = $('input[name=opacity]').val();
			refreshPagezone(CurrentZone);
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
			CurrentZone.bgopacity = $('input[name=bgopacity]').val();
			refreshPagezone(CurrentZone);
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
	$('#spinner-bdtl').spinner();
	$('#spinner-bdtl').spinner('setting', {value:parseInt(pagezone.bdtl), step: 1, min: 0, max: 255});
	$('#spinner-bdtr').spinner();
	$('#spinner-bdtr').spinner('setting', {value:parseInt(pagezone.bdtr), step: 1, min: 0, max: 255});
	$('#spinner-bdbl').spinner();
	$('#spinner-bdbl').spinner('setting', {value:parseInt(pagezone.bdbl), step: 1, min: 0, max: 255});
	$('#spinner-bdbr').spinner();
	$('#spinner-bdbr').spinner('setting', {value:parseInt(pagezone.bdbr), step: 1, min: 0, max: 255});

	refreshLocSpinners(pagezone);
	refreshFontStyle();
	refreshFontFamilySelect();
	refreshBdstyleSelect();
}

function refreshLocSpinners(pagezone) {
	$('#spinner-x').spinner();
	$('#spinner-x').spinner('setting', {value:parseInt(pagezone.leftoffset), step: 1, min: 0, max: parseInt(CurrentObj.width)-parseInt(pagezone.width)});
	$('#spinner-y').spinner();
	$('#spinner-y').spinner('setting', {value:parseInt(pagezone.topoffset), step: 1, min: 0, max: parseInt(CurrentObj.height)-parseInt(pagezone.height)});
	$('#spinner-w').spinner();
	$('#spinner-w').spinner('setting', {value:parseInt(pagezone.width), step: 1, min: 1, max: parseInt(CurrentObj.width)-parseInt(pagezone.leftoffset)});
	$('#spinner-h').spinner();
	$('#spinner-h').spinner('setting', {value:parseInt(pagezone.height), step: 1, min: 1, max: parseInt(CurrentObj.height)-parseInt(pagezone.topoffset)});
}

$('.collapse').on('shown.bs.collapse', function () {
	$('.opacityRange').ionRangeSlider('update');
	$('.bgopacityRange').ionRangeSlider('update');
});

$('.spinner').on('change', function(e) {
	CurrentZone.fontsize = $('#spinner-fontsize').spinner('value');
	CurrentZone.lineheight = $('#spinner-lineheight').spinner('value');
	CurrentZone.padding = $('#spinner-padding').spinner('value');
	CurrentZone.leftoffset = $('#spinner-x').spinner('value');
	CurrentZone.topoffset = $('#spinner-y').spinner('value');
	CurrentZone.width = $('#spinner-w').spinner('value');
	CurrentZone.height = $('#spinner-h').spinner('value');
	CurrentZone.shadowh = $('#spinner-shadowh').spinner('value');
	CurrentZone.shadowv = $('#spinner-shadowv').spinner('value');
	CurrentZone.shadowblur = $('#spinner-shadowblur').spinner('value');
	CurrentZone.bdwidth = $('#spinner-bdwidth').spinner('value');
	CurrentZone.bdtl = $('#spinner-bdtl').spinner('value');
	CurrentZone.bdtr = $('#spinner-bdtr').spinner('value');
	CurrentZone.bdbl = $('#spinner-bdbl').spinner('value');
	CurrentZone.bdbr = $('#spinner-bdbr').spinner('value');
	refreshPagezone(CurrentZone);
});	

$('.pix-bold').on('click', function(event) {
	if (CurrentZone.fontweight == 'bold') {
		CurrentZone.fontweight = 'normal';
	} else {
		CurrentZone.fontweight = 'bold';
	}
	refreshFontStyle();
	refreshPagezone(CurrentZone);
});	
$('.pix-italic').on('click', function(event) {
	if (CurrentZone.fontstyle == 'italic') {
		CurrentZone.fontstyle = 'normal';
	} else {
		CurrentZone.fontstyle = 'italic';
	}
	refreshFontStyle();
	refreshPagezone(CurrentZone);
});	
$('.pix-underline').on('click', function(event) {
	if (CurrentZone.decoration == 'underline') {
		CurrentZone.decoration = 'none';
	} else {
		CurrentZone.decoration = 'underline';
	}
	refreshFontStyle();
	refreshPagezone(CurrentZone);
});	
$('.pix-strikethrough').on('click', function(event) {
	if (CurrentZone.decoration == 'line-through') {
		CurrentZone.decoration = 'none';
	} else {
		CurrentZone.decoration = 'line-through';
	}
	refreshFontStyle();
	refreshPagezone(CurrentZone);
});
$('.pix-align-left').on('click', function(event) {
	if (CurrentZone.align == 'left') {
		CurrentZone.align = '';
	} else {
		CurrentZone.align = 'left';
	}
	refreshFontStyle();
	refreshPagezone(CurrentZone);
});	
$('.pix-align-right').on('click', function(event) {
	if (CurrentZone.align == 'right') {
		CurrentZone.align = '';
	} else {
		CurrentZone.align = 'right';
	}
	refreshFontStyle();
	refreshPagezone(CurrentZone);
});	
$('.pix-align-center').on('click', function(event) {
	if (CurrentZone.align == 'center') {
		CurrentZone.align = '';
	} else {
		CurrentZone.align = 'center';
	}
	refreshFontStyle();
	refreshPagezone(CurrentZone);
});	
$('.pix-align-justify').on('click', function(event) {
	if (CurrentZone.align == 'justify') {
		CurrentZone.align = '';
	} else {
		CurrentZone.align = 'justify';
	}
	refreshFontStyle();
	refreshPagezone(CurrentZone);
});	

function refreshFontStyle() {
	if (CurrentZone.fontweight == 'bold') {
		$('.pix-bold').removeClass('default');
		$('.pix-bold').addClass('blue');
	} else {
		$('.pix-bold').removeClass('blue');
		$('.pix-bold').addClass('default');
	}
	if (CurrentZone.fontstyle == 'italic') {
		$('.pix-italic').removeClass('default');
		$('.pix-italic').addClass('blue');
	} else {
		$('.pix-italic').removeClass('blue');
		$('.pix-italic').addClass('default');
	}
	if (CurrentZone.decoration == 'underline') {
		$('.pix-underline').removeClass('default');
		$('.pix-underline').addClass('blue');
		$('.pix-strikethrough').removeClass('blue');
		$('.pix-strikethrough').addClass('default');
	} else if (CurrentZone.decoration == 'line-through') {
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
	if (CurrentZone.align == 'left') {
		$('.pix-align-left').removeClass('default');
		$('.pix-align-left').addClass('blue');
		$('.pix-align-right').removeClass('blue');
		$('.pix-align-right').addClass('default');
		$('.pix-align-center').removeClass('blue');
		$('.pix-align-center').addClass('default');
		$('.pix-align-justify').removeClass('blue');
		$('.pix-align-justify').addClass('default');
	} else if (CurrentZone.align == 'right') {
		$('.pix-align-left').removeClass('blue');
		$('.pix-align-left').addClass('default');
		$('.pix-align-right').removeClass('default');
		$('.pix-align-right').addClass('blue');
		$('.pix-align-center').removeClass('blue');
		$('.pix-align-center').addClass('default');
		$('.pix-align-justify').removeClass('blue');
		$('.pix-align-justify').addClass('default');
	} else if (CurrentZone.align == 'center') {
		$('.pix-align-left').removeClass('blue');
		$('.pix-align-left').addClass('default');
		$('.pix-align-right').removeClass('blue');
		$('.pix-align-right').addClass('default');
		$('.pix-align-center').removeClass('default');
		$('.pix-align-center').addClass('blue');
		$('.pix-align-justify').removeClass('blue');
		$('.pix-align-justify').addClass('default');
	} else if (CurrentZone.align == 'justify') {
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
	var families = ['actor', 'advent pro', 'Architects Daughter', 'arial', 'Ariblk', 'arizonia', 'armata', 'AvantGardeLT Bookoblique', 
	                'AvantGardeLT Demi', 'BankGothicBold', 'BankGothicMedium', 'Bebas', 'belgrano', 'belleza', 'berlinsans', 'Bookman old', 
	                'Bookman old bi', 'Bookman old bold', 'Bookman old italic', 'candara', 'Century_Gothic', 'Century_Gothic_Bold', 
	                'ChaparralPro', 'ChaparralProBold', 'ComicSansMS', 'Cooper Std Black', 'Courgette-Regular', 'Curlz MT', 
	                'DJBAlmostPerfect', 'Diplomata', 'DiplomataSC', 'doppio one', 'DroidSans', 'electrolize', 'Eras BD', 'Forte', 'Fradm', 
	                'Fradmcn', 'Fradmit', 'Frahv', 'Frahvit', 'Framd', 'Framdcn', 'Framdit', 'FrederickatheGreat', 'fredoka one', 'Freeskpt', 
	                'Futura XBlk BT', 'gadugi', 'GoboldBoldItalic', 'Gothambold', 'Gothambook', 'Gothammedium', 'Humanist521', 'karla', 
	                'londrina solid', 'MV Boli', 'marven pro', 'MfReallyAwesome', 'MyriadPro', 'norican', 'nova slim', 'nunito', 'orbitron', 
	                'overlock', 'PT sana narrow', 'parisienne', 'Permanent Marker', 'philosopher', 'pontano sans', 'pratas', 'quando', 
	                'quixotic', 'RobotoBold', 'RobotoMedium', 'RobotoRegular', 'rockwell', 'RockwellExtraBold', 'russo one', 'Rye', 'sanchez', 
	                'sarina', 'Scandinavian', 'Scandinavian Black', 'SegoePrint', 'SegoeUI', 'SegoeUIB', 'signika', 'SketchBlock', 
	                'Taco modern', 'texgyreadventor-bold', 'Timesnewroman', 'trocchi', 'TwentyEightDaysLater', 'VastShadow', 'Verdana', 
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
			if (CurrentZone != null) {
				callback({id: CurrentZone.fontfamily, text: CurrentZone.fontfamily });
			}
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});
}
$('#FontFamilySelect').on('change', function(e) {
	if ($('#FontFamilySelect').select2('data') != null) {
		CurrentZone.fontfamily = $('#FontFamilySelect').select2('data').id;
	}
	refreshPagezone(CurrentZone);
});	

function refreshBdstyleSelect() {
	var bdstylelist = [
		{id: 'solid', text: 'solid'},
		{id: 'dashed', text: 'dashed'},
		{id: 'dotted', text: 'dotted'},
	];
	$('#BdstyleSelect').select2({
		placeholder: common.tips.detail_select,
		minimumInputLength: 0,
		data: bdstylelist,
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});
}
$('#BdstyleSelect').on('change', function(e) {
	if ($('#BdstyleSelect').select2('data') != null) {
		CurrentZone.bdstyle = $('#BdstyleSelect').select2('data').id;
	}
	refreshPagezone(CurrentZone);
});	

function validPagezone(pagezone) {
	if (pagezone != null && pagezone.type == 3) {
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
	
	var pagezones = CurrentObj.pagezones.filter(function (el) {
		return el.type == zonetype;
	});
	if (pagezones.length >= ZoneLimits[zonetype] ) {
		return;
	}
	
	var pagezone = {};
	pagezone.pagezoneid = '-' + Math.round(Math.random()*100000000);
	pagezone.pageid = CurrentId;
	pagezone.name = 'Zone_' + zonetype;
	pagezone.type = zonetype;
	pagezone.leftoffset = CurrentObj.height * 0.1;
	pagezone.topoffset = CurrentObj.width * 0.1;
	if (ZoneRatios[zonetype] != undefined) {
		pagezone.width = CurrentObj.width * 0.2;
		pagezone.height = CurrentObj.width * 0.2 / ZoneRatios[zonetype];
	} else {
		pagezone.width = CurrentObj.width * 0.2;
		pagezone.height = CurrentObj.height * 0.2;
	}
	pagezone.zindex = 52;
	pagezone.transform = 'matrix(1, 0, 0, 1, 0, 0)';
	pagezone.bdcolor = '#000000';
	pagezone.bdstyle = 'solid';
	pagezone.bdwidth = 0;
	pagezone.bdtl = 0;
	pagezone.bdtr = 0;
	pagezone.bdbl = 0;
	pagezone.bdbr = 0;
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
	pagezone.align = 'start';
	pagezone.lineheight = 80;
	pagezone.content = '';
	pagezone.pagezonedtls = [];
	
	CurrentObj.pagezones[CurrentObj.pagezones.length] = pagezone;
	
	unselectAllZones();
	CurrentZone = pagezone;
	createZone(pagezone);
	initOperation(pagezone);
	selectZone(CurrentZone);
	enterPagezoneFocus(pagezone);
});


$('[type=submit]', $('#ScrollModal')).on('click', function(event) {
	CurrentZone.content = $('#ScrollModal textarea[name="content"]').val();
	refreshPagezone(CurrentZone);
	$('#ScrollModal').modal('hide');
});


//图片table初始化
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
	'oLanguage' : DataTableLanguage,
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
		aoData.push({'name':'branchid','value':CurrentMediaBranchid });
		aoData.push({'name':'folderid','value':CurrentMediaFolderid });
	}
});
$('#ImageTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
$('#ImageTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
$('#ImageTable').css('width', '100%');

//视频table初始化
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
	'oLanguage' : DataTableLanguage,
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
		aoData.push({'name':'branchid','value':CurrentMediaBranchid });
		aoData.push({'name':'folderid','value':CurrentMediaFolderid });
		aoData.push({'name':'format','value':'mp4' });
	}
});
$('#VideoTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
$('#VideoTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
$('#VideoTable').css('width', '100%');

function refreshMediaTable() {
	$('#ImageTable').dataTable()._fnAjaxUpdate();
	$('#VideoTable').dataTable()._fnAjaxUpdate();
}

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
	refreshMediaTable();
	refreshPagezondtls();
})

function refreshPagezondtls() {
	$('#PagezonedtlTable').dataTable().fnClearTable();
	for (var i=0; i<CurrentZone.pagezonedtls.length; i++) {
		var pagezonedtl = CurrentZone.pagezonedtls[i];
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
	pagezonedtl.pagezoneid = CurrentZone.pagezoneid;
	pagezonedtl.objtype = '1';
	pagezonedtl.objid = data.videoid;
	pagezonedtl.sequence = CurrentZone.pagezonedtls.length + 1;
	pagezonedtl.video = data;
	CurrentZone.pagezonedtls.push(pagezonedtl);

	var thumbnail = '';
	if (data.thumbnail == null) {
		thumbnail = '../img/video.jpg';
	} else {
		thumbnail = '/pixsigdata' + data.thumbnail;
	}
	var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="100%" alt="' + data.name + '"></div>';
	$('#PagezonedtlTable').dataTable().fnAddData([pagezonedtl.sequence, common.view.intvideo, thumbhtml, data.name, 0, 0, 0]);
	refreshPagezone(CurrentZone);
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
	pagezonedtl.pagezoneid = CurrentZone.pagezoneid;
	pagezonedtl.objtype = '2';
	pagezonedtl.objid = data.imageid;
	pagezonedtl.sequence = CurrentZone.pagezonedtls.length + 1;
	pagezonedtl.image = data;
	CurrentZone.pagezonedtls.push(pagezonedtl);

	var thumbwidth = data.width > data.height? 100 : 100*data.width/data.height;
	var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="/pixsigdata' + data.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + data.name + '"></div>';
	$('#PagezonedtlTable').dataTable().fnAddData([pagezonedtl.sequence, common.view.image, thumbhtml, data.name, 0, 0, 0]);
	refreshPagezone(CurrentZone);
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
	
	for (var i=rowIndex; i<CurrentZone.pagezonedtls.length; i++) {
		CurrentZone.pagezonedtls[i].sequence = i;
	}
	CurrentZone.pagezonedtls.splice(rowIndex, 1);
	refreshPagezone(CurrentZone);
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
	
	var temp = CurrentZone.pagezonedtls[rowIndex];
	CurrentZone.pagezonedtls[rowIndex] =  CurrentZone.pagezonedtls[rowIndex-1];
	CurrentZone.pagezonedtls[rowIndex].sequence = rowIndex+1;
	CurrentZone.pagezonedtls[rowIndex-1] = temp;
	CurrentZone.pagezonedtls[rowIndex-1].sequence = rowIndex;
	refreshPagezone(CurrentZone);
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
	
	var temp = CurrentZone.pagezonedtls[rowIndex];
	CurrentZone.pagezonedtls[rowIndex] = CurrentZone.pagezonedtls[rowIndex+1];
	CurrentZone.pagezonedtls[rowIndex].sequence = rowIndex+1;
	CurrentZone.pagezonedtls[rowIndex+1] = temp;
	CurrentZone.pagezonedtls[rowIndex+1].sequence = rowIndex+2;
	refreshPagezone(CurrentZone);
});


initMediaBranchTree();
function initMediaBranchTree() {
	$.ajax({
		type : 'POST',
		url : 'branch!list.action',
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var branches = data.aaData;
				CurrentMediaBranchid = branches[0].branchid;
				
				if ( $('#MediaBranchTreeDiv').length > 0 ) {
					if (branches[0].children.length == 0) {
						$('#MediaBranchTreeDiv').css('display', 'none');
						CurrentMediaFolderid = null;
						initMediaFolderTree();
						refreshMediaTable();
					} else {
						var branchTreeDivData = [];
						createBranchTreeData(branches, branchTreeDivData);
						$('#MediaBranchTreeDiv').jstree('destroy');
						$('#MediaBranchTreeDiv').jstree({
							'core' : {
								'multiple' : false,
								'data' : branchTreeDivData
							},
							'plugins' : ['unique'],
						});
						$('#MediaBranchTreeDiv').on('loaded.jstree', function() {
							$('#MediaBranchTreeDiv').jstree('select_node', CurrentMediaBranchid);
						});
						$('#MediaBranchTreeDiv').on('select_node.jstree', function(event, data) {
							CurrentMediaBranchid = data.instance.get_node(data.selected[0]).id;
							CurrentMediaFolderid = null;
							initMediaFolderTree();
							refreshMediaTable();
						});
					}
				}
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
	function createBranchTreeData(branches, treeData) {
		for (var i=0; i<branches.length; i++) {
			treeData[i] = {};
			treeData[i].id = branches[i].branchid;
			treeData[i].text = branches[i].name;
			treeData[i].state = {
				opened: true,
			}
			treeData[i].children = [];
			createBranchTreeData(branches[i].children, treeData[i].children);
		}
	}	
}
function initMediaFolderTree() {
	$.ajax({
		type : 'POST',
		url : 'folder!list.action',
		data : {
			branchid: CurrentMediaBranchid
		},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var folders = data.aaData;
				CurrentMediaFolderid = folders[0].folderid;
				
				if ( $('#MediaFolderTreeDiv').length > 0 ) {
					var folderTreeDivData = [];
					createFolderTreeData(folders, folderTreeDivData);
					$('#MediaFolderTreeDiv').jstree('destroy');
					$('#MediaFolderTreeDiv').jstree({
						'core' : {
							'multiple' : false,
							'data' : folderTreeDivData
						},
						'plugins' : ['unique', 'types'],
						'types' : {
							'default' : { 'icon' : 'fa fa-folder icon-state-warning icon-lg' }
						},
					});
					$('#MediaFolderTreeDiv').on('loaded.jstree', function() {
						$('#MediaFolderTreeDiv').jstree('select_node', CurrentMediaFolderid);
					});
					$('#MediaFolderTreeDiv').on('select_node.jstree', function(event, data) {
						CurrentMediaFolderid = data.instance.get_node(data.selected[0]).id;
						refreshMediaTable();
					});
				}
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
	function createFolderTreeData(folders, treeData) {
		if (folders == null) return;
		for (var i=0; i<folders.length; i++) {
			treeData[i] = {};
			treeData[i].id = folders[i].folderid;
			treeData[i].text = folders[i].name;
			treeData[i].state = {
				opened: true,
			}
			treeData[i].children = [];
			createFolderTreeData(folders[i].children, treeData[i].children);
		}
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
	if (CurrentZone != null) {
		var pagezonediv = $('#PagezoneDiv' + CurrentZone.pagezoneid);
		var status = $(pagezonediv).find('#rotatable').hasClass('dblclick');
		if ((e.which == 46) && (status === false) && ((e.target.tagName).toLowerCase() !== 'input')) {
			bootbox.confirm(common.tips.remove + eval('common.view.pagezone_type_' + CurrentZone.type), function(result) {
				if (result == true) {
					CurrentObj.pagezones.splice(CurrentObj.pagezones.indexOf(CurrentZone), 1);
					CurrentZone = null;
					$(pagezonediv).remove();
					enterPagezoneFocus(CurrentZone);
				}
			 });
		}
	}
});


