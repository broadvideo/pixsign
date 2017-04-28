var RegionLimits = [];
RegionLimits['0'] = 6;
RegionLimits['1'] = 4;
RegionLimits['2'] = 2;
RegionLimits['3'] = 1;
RegionLimits['4'] = 1;
RegionLimits['5'] = 1;
RegionLimits['6'] = 4;
RegionLimits['7'] = 40;
RegionLimits['8'] = 1;
RegionLimits['9'] = 1;
RegionLimits['10'] = 1;
RegionLimits['11'] = 1;
RegionLimits['12'] = 2;
RegionLimits['13'] = 1;
RegionLimits['A1'] = 1;
RegionLimits['A2'] = 1;

var RegionRatios = [];
RegionRatios['10'] = 0.8333; //5:6
RegionRatios['11'] = 1.7699; //1000:565

function redrawLayout(div, bundle, bundledtl) {
	div.empty();
	div.css('position', 'relative');
	div.css('margin-left', 'auto');
	div.css('margin-right', 'auto');
	div.css('border', '1px solid #000');
	if (bundle.bgimage != null) {
		div.append('<img class="bundle-bg" src="/pixsigdata' + bundle.bgimage.thumbnail + '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
	}
	for (var i=0; i<bundle.bundledtls.length; i++) {
		div.append('<div id="LayoutdtlDiv' + bundle.bundledtls[i].bundledtlid + '"></div>');
		if (bundledtl != null && bundledtl.bundledtlid == bundle.bundledtls[i].bundledtlid) {
			redrawLayoutdtl($('#LayoutdtlDiv' + bundle.bundledtls[i].bundledtlid), bundle, bundle.bundledtls[i], true);
		} else {
			redrawLayoutdtl($('#LayoutdtlDiv' + bundle.bundledtls[i].bundledtlid), bundle, bundle.bundledtls[i], false);
		}
	}
	var width = Math.floor(div.parent().width());
	var scale = bundle.width / width;
	var height = bundle.height / scale;
	div.css('width' , width);
	div.css('height' , height);
	$(div).find('.bundle-font').each(function() {
		var bundledtl = bundle.bundledtls[$(this).attr('bundledtlindex')];
		var fontsize = bundledtl.size * bundledtl.height / 100 / scale;
		var text = $(this).html();
		$(this).css('font-size', fontsize + 'px');
		$(this).css('line-height', bundledtl.height / scale + 'px');
		if (fontsize < 9) {
			$(this).html('');
			$(this).find('img').each(function() {
				$(this).css('display', 'none');
			});
		} else {
			$(this).find('img').each(function() {
				$(this).css('height', fontsize + 'px');
				$(this).css('display', 'inline');
			});
		}
	});
}

function redrawLayoutdtl(div, bundle, bundledtl, selected) {
	div.empty();
	div.attr("class", "region ui-draggable ui-resizable");
	div.attr('bundledtlid', bundledtl.bundledtlid);
	div.css('position', 'absolute');
	div.css('width', 100*bundledtl.width/bundle.width + '%');
	div.css('height', 100*bundledtl.height/bundle.height + '%');
	div.css('top', 100*bundledtl.topoffset/bundle.height + '%');
	div.css('left', 100*bundledtl.leftoffset/bundle.width + '%');
	var bundledtlhtml = '';
	var border = '1px solid #000000';
	if (selected) {
		border = '3px solid #FF0000';
	}
	var bgcolor = bundledtl.bgcolor;
	var bgimage = '';
	if (bundledtl.bgimage != null) {
		bgimage = '/pixsigdata' + bundledtl.bgimage.thumbnail;
	} else if (bundledtl.mainflag == 1) {
		bgimage = '../img/region/region-play-main.jpg';
	} else if (bundledtl.type == 0) {
		bgimage = '../img/region/region-play.jpg';
	} else if (bundledtl.type == 4) {
		bgimage = '../img/region/region-videoin.jpg';
	} else if (bundledtl.type == 5) {
		bgimage = '../img/region/region-dvb.jpg';
	} else if (bundledtl.type == 6) {
		bgimage = '../img/region/region-stream.jpg';
	} else if (bundledtl.type == 8) {
		if (bundledtl.width > bundledtl.height) {
			bgimage = '../img/region/region-navigate-h.jpg';
		} else {
			bgimage = '../img/region/region-navigate-v.jpg';
		}
	} else if (bundledtl.type == 9) {
		bgimage = '../img/region/region-qrcode.jpg';
	}
	if (bundledtl.type == 0) {
		if (bundledtl.objtype == 1 && bundledtl.medialist.medialistdtls.length > 0) {
			var medialistdtl = bundledtl.medialist.medialistdtls[0];
			if (medialistdtl.objtype == 1 && medialistdtl.video.thumbnail != null) {
				bgimage = '/pixsigdata' + medialistdtl.video.thumbnail;
			} else if (medialistdtl.objtype == 2 && medialistdtl.image.filename != null) {
				bgimage = '/pixsigdata' + medialistdtl.image.thumbnail;
			}
		} else if (bundledtl.objtype == 5) {
			bgimage = '../img/region/region-widget.jpg';
		}
	}

	var bundledtlindex = bundle.bundledtls.indexOf(bundledtl);

	bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bgcolor + '; opacity:' + bundledtl.opacity/255 + '; "></div>';
	if (bundledtl.type == '0' || bundledtl.type == '4' || bundledtl.type == '5' || bundledtl.type == '6' || bundledtl.type == '8' || bundledtl.type == '9') {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
		bundledtlhtml += '</div>';
	} else if (bundledtl.type == 1) {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		var text = bundledtl.text.text;
		if (bundledtl.direction == '4') {
			if (text == '') {
				text = '滚动文本';
			}
			bundledtlhtml += '<marquee class="bundle-font" bundledtlindex="' + bundledtlindex + '" direction="left" behavior="scroll" scrollamount="1" scrolldelay="0" loop="-1" style="color:' + bundledtl.color + '; font-size:12px; ">';
			bundledtlhtml += text;
			bundledtlhtml += '</marquee>';
		} else {
			if (text == '') {
				text = '静止文本';
			}
			bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.color + '; font-size:12px; ">';
			bundledtlhtml += text;
			bundledtlhtml += '</p>';
		}
		bundledtlhtml += '</div>';
	} else if (bundledtl.type == '2') {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.color + '; font-size:12px; ">';
		bundledtlhtml += new Date().pattern(bundledtl.dateformat);
		bundledtlhtml += '</p>';
		bundledtlhtml += '</div>';
	} else if (bundledtl.type == '3') {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<div class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.color + '; font-size:12px; ">';
		bundledtlhtml += '深圳 20 ~ 17℃ 多云转小雨 ';
		bundledtlhtml += '<img src="http://api.map.baidu.com/images/weather/day/duoyun.png" />';
		bundledtlhtml += '<img src="http://api.map.baidu.com/images/weather/night/xiaoyu.png" />';
		bundledtlhtml += '</div>';
		bundledtlhtml += '</div>';
	} else {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		if (bgimage != '') {
			bundledtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
		}
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.color + '; font-size:12px; ">';
		bundledtlhtml += eval('common.view.region_mainflag_' + bundledtl.mainflag) + eval('common.view.region_type_' + bundledtl.type);
		bundledtlhtml += '</p>';
		bundledtlhtml += '</div>';
	}

	bundledtlhtml += '<div class="btn-group" style="z-index:50; opacity:0.5; ">';
	bundledtlhtml += '<label class="btn btn-circle btn-default btn-xs">' + eval('common.view.region_mainflag_' + bundledtl.mainflag) + eval('common.view.region_type_' + bundledtl.type) + '</label>';
	bundledtlhtml += '</div>';
	div.html(bundledtlhtml);

	div.draggable({
		containment: div.parent(),
		stop: regionPositionUpdate,
		drag: regionPositionUpdate
	}).resizable({
		containment: div.parent(),
		minWidth: 25,
		minHeight: 25,
		stop: function(e, ui) {
			redrawLayout($('#LayoutDiv'), CurrentBundle, CurrentBundledtl);
		},
		resize: regionPositionUpdate
	});
}

function refreshLayoutBgImageSelect1(folderid) {
	$("#LayoutBgImageSelect1").select2({
		placeholder: common.tips.detail_select,
		minimumInputLength: 0,
		ajax: {
			url: 'image!list.action',
			type: 'GET',
			dataType: 'json',
			data: function (term, page) {
				return {
					sSearch: term,
					iDisplayStart: (page-1)*10,
					iDisplayLength: 10,
					folderid: folderid,
				};
			},
			results: function (data, page) {
				var more = (page * 10) < data.iTotalRecords; 
				return {
					results : $.map(data.aaData, function (item) { 
						return { 
							text:item.name, 
							id:item.imageid, 
							image:item, 
						};
					}),
					more: more
				};
			}
		},
		formatResult: function(data) {
			var width = 40;
			var height = 40 * data.image.height / data.image.width;
			if (data.image.width < data.image.height) {
				height = 40;
				width = 40 * data.image.width / data.image.height;
			}
			var html = '<span><img src="/pixsigdata' + data.image.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.image.name + '</span>'
			return html;
		},
		formatSelection: function(data) {
			var width = 30;
			var height = 30 * height / width;
			if (data.image.width < data.image.height) {
				height = 30;
				width = 30 * width / height;
			}
			var html = '<span><img src="/pixsigdata' + data.image.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/></span>'
			return html;
		},
		initSelection: function(element, callback) {
			if (CurrentBundle != null && CurrentBundle.bgimage != null) {
				callback({id: CurrentBundle.bgimage.imageid, text: CurrentBundle.bgimage.name, image: CurrentBundle.bgimage });
			}
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});
}

function refreshLayoutBgImageSelect2(folderid) {
	$("#LayoutBgImageSelect2").select2({
		placeholder: common.tips.detail_select,
		minimumInputLength: 0,
		ajax: {
			url: 'image!list.action',
			type: 'GET',
			dataType: 'json',
			data: function (term, page) {
				return {
					sSearch: term,
					iDisplayStart: (page-1)*10,
					iDisplayLength: 10,
					folderid: folderid,
				};
			},
			results: function (data, page) {
				var more = (page * 10) < data.iTotalRecords; 
				return {
					results : $.map(data.aaData, function (item) { 
						return { 
							text:item.name, 
							id:item.imageid, 
							image:item, 
						};
					}),
					more: more
				};
			}
		},
		formatResult: function(data) {
			var width = 40;
			var height = 40 * data.image.height / data.image.width;
			if (data.image.width < data.image.height) {
				height = 40;
				width = 40 * data.image.width / data.image.height;
			}
			var html = '<span><img src="/pixsigdata' + data.image.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.image.name + '</span>'
			return html;
		},
		formatSelection: function(data) {
			var width = 30;
			var height = 30 * height / width;
			if (data.image.width < data.image.height) {
				height = 30;
				width = 30 * width / height;
			}
			var html = '<span><img src="/pixsigdata' + data.image.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/></span>'
			return html;
		},
		initSelection: function(element, callback) {
			if (CurrentBundle != null && CurrentBundle.bgimage != null) {
				console.log(CurrentBundle.bgimage);
				callback({id: CurrentBundle.bgimage.imageid, text: CurrentBundle.bgimage.name, image: CurrentBundle.bgimage });
			}
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});
}

function refreshRegionBgImageSelect(folderid) {
	$("#RegionBgImageSelect").select2({
		placeholder: common.tips.detail_select,
		minimumInputLength: 0,
		ajax: {
			url: 'image!list.action',
			type: 'GET',
			dataType: 'json',
			data: function (term, page) {
				return {
					sSearch: term,
					iDisplayStart: (page-1)*10,
					iDisplayLength: 10,
					folderid: folderid,
				};
			},
			results: function (data, page) {
				var more = (page * 10) < data.iTotalRecords; 
				return {
					results : $.map(data.aaData, function (item) { 
						return { 
							text:item.name, 
							id:item.imageid, 
							image:item, 
						};
					}),
					more: more
				};
			}
		},
		formatResult: function(data) {
			var width = 40;
			var height = 40 * data.image.height / data.image.width;
			if (data.image.width < data.image.height) {
				height = 40;
				width = 40 * data.image.width / data.image.height;
			}
			var html = '<span><img src="/pixsigdata' + data.image.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.image.name + '</span>'
			return html;
		},
		formatSelection: function(data) {
			var width = 30;
			var height = 30 * height / width;
			if (data.image.width < data.image.height) {
				height = 30;
				width = 30 * width / height;
			}
			var html = '<span><img src="/pixsigdata' + data.image.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/></span>'
			return html;
		},
		initSelection: function(element, callback) {
			if (CurrentBundledtl != null && CurrentBundledtl.bgimage != null) {
				callback({id: CurrentBundledtl.bgimage.imageid, text: CurrentBundledtl.bgimage.name, image: CurrentBundledtl.bgimage });
			}
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});
}

function refreshAnimationSelect() {
	var animationlist = [
		{id: 'None', text: '无'}, 
		{id: 'Random', text: '随机'}, 
		{id: 'FadeIn', text: '淡入'}, 
		{id: 'SlideInLeft', text: '向左平移'}, 
		{id: 'SlideInRight', text: '向右平移'}, 
		{id: 'SlideInUp', text: '向下平移'}, 
		{id: 'SlideInDown', text: '向上平移'}, 
		{id: 'ZoomIn', text: '放大'}, 
		{id: 'RotateIn', text: '旋转'}, 
		{id: 'RotateInUpLeft', text: '旋转2'}, 
		{id: 'FlipInX', text: '翻转'}, 
		{id: 'RollIn', text: '翻滚'}, 

//		{id: 'DropOut', text: 'DropOut'}, 
//		{id: 'Landing', text: 'Landing'}, 
//		{id: 'TakingOff', text: 'TakingOff'}, 
//		{id: 'Flash', text: 'Flash'}, 
//		{id: 'Pulse', text: 'Pulse'}, 
//		{id: 'RubberBand', text: 'RubberBand'}, 
//		{id: 'Shake', text: 'Shake'}, 
//		{id: 'Swing', text: 'Swing'}, 
//		{id: 'Wobble', text: 'Wobble'}, 
//		{id: 'Bounce', text: 'Bounce'}, 
//		{id: 'Tada', text: 'Tada'}, 
//		{id: 'StandUp', text: 'StandUp'}, 
//		{id: 'Wave', text: 'Wave'}, 
//		{id: 'Hinge', text: 'Hinge'}, 
//		{id: 'RollIn', text: 'RollIn'}, 
//		{id: 'RollOut', text: 'RollOut'}, 
//		{id: 'BounceIn', text: 'BounceIn'}, 
//		{id: 'BounceInDown', text: 'BounceInDown'}, 
//		{id: 'BounceInLeft', text: 'BounceInLeft'}, 
//		{id: 'BounceInRight', text: 'BounceInRight'}, 
//		{id: 'BounceInUp', text: 'BounceInUp'}, 
//		{id: 'FadeIn', text: 'FadeIn'}, 
//		{id: 'FadeInUp', text: 'FadeInUp'}, 
//		{id: 'FadeInDown', text: 'FadeInDown'}, 
//		{id: 'FadeInLeft', text: 'FadeInLeft'}, 
//		{id: 'FadeInRight', text: 'FadeInRight'}, 
//		{id: 'FadeOut', text: 'FadeOut'}, 
//		{id: 'FadeOutDown', text: 'FadeOutDown'}, 
//		{id: 'FadeOutLeft', text: 'FadeOutLeft'}, 
//		{id: 'FadeOutRight', text: 'FadeOutRight'}, 
//		{id: 'FadeOutUp', text: 'FadeOutUp'}, 
//		{id: 'FlipInX', text: 'FlipInX'}, 
//		{id: 'FlipOutX', text: 'FlipOutX'}, 
//		{id: 'FlipOutY', text: 'FlipOutY'}, 
//		{id: 'RotateIn', text: 'RotateIn'}, 
//		{id: 'RotateInDownLeft', text: 'RotateInDownLeft'}, 
//		{id: 'RotateInDownRight', text: 'RotateInDownRight'}, 
//		{id: 'RotateInUpLeft', text: 'RotateInUpLeft'}, 
//		{id: 'RotateInUpRight', text: 'RotateInUpRight'}, 
//		{id: 'RotateOut', text: 'RotateOut'}, 
//		{id: 'RotateOutDownLeft', text: 'RotateOutDownLeft'}, 
//		{id: 'RotateOutDownRight', text: 'RotateOutDownRight'}, 
//		{id: 'RotateOutUpLeft', text: 'RotateOutUpLeft'}, 
//		{id: 'RotateOutUpRight', text: 'RotateOutUpRight'}, 
//		{id: 'SlideInLeft', text: 'SlideInLeft'}, 
//		{id: 'SlideInRight', text: 'SlideInRight'}, 
//		{id: 'SlideInUp', text: 'SlideInUp'}, 
//		{id: 'SlideInDown', text: 'SlideInDown'}, 
//		{id: 'SlideOutLeft', text: 'SlideOutLeft'}, 
//		{id: 'SlideOutRight', text: 'SlideOutRight'}, 
//		{id: 'SlideOutUp', text: 'SlideOutUp'}, 
//		{id: 'SlideOutDown', text: 'SlideOutDown'}, 
//		{id: 'ZoomIn', text: 'ZoomIn'}, 
//		{id: 'ZoomInDown', text: 'ZoomInDown'}, 
//		{id: 'ZoomInLeft', text: 'ZoomInLeft'}, 
//		{id: 'ZoomInRight', text: 'ZoomInRight'}, 
//		{id: 'ZoomInUp', text: 'ZoomInUp'}, 
//		{id: 'ZoomOut', text: 'ZoomOut'}, 
//		{id: 'ZoomOutDown', text: 'ZoomOutDown'}, 
//		{id: 'ZoomOutLeft', text: 'ZoomOutLeft'}, 
//		{id: 'ZoomOutRight', text: 'ZoomOutRight'}, 
//		{id: 'ZoomOutUp', text: 'ZoomOutUp'}, 
	];
	
	$("#AnimationSelect").select2({
		placeholder: common.tips.detail_select,
		minimumInputLength: 0,
		data: animationlist,
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});
}

function regionPositionUpdate(e, ui) {
	var bundledtlid = $(this).attr("bundledtlid");
	var bundledtls = CurrentBundle.bundledtls.filter(function (el) {
		return el.bundledtlid == bundledtlid;
	});

	var l = $(this).position().left / $('#LayoutDiv').width();
	var t = $(this).position().top / $('#LayoutDiv').height();
	if (RegionRatios[bundledtls[0].type] != undefined) {
		var w = $(this).width() / $('#LayoutDiv').width();
		var h = $(this).width() / parseFloat(RegionRatios[bundledtls[0].type]) / $('#LayoutDiv').height();
		if (t + h > 1) {
			h = 1 - t;
			w = h * $('#LayoutDiv').height() * parseFloat(RegionRatios[bundledtls[0].type]) / $('#LayoutDiv').width();
		}
	} else {
		var w = $(this).width() / $('#LayoutDiv').width();
		var h = $(this).height() / $('#LayoutDiv').height();
	}
	$(this).css("width" , (100 * parseFloat(w)) + '%');
	$(this).css("height" , (100 * parseFloat(h)) + '%');
	$(this).css("left" , (100 * parseFloat(l)) + '%');
	$(this).css("top" , (100 * parseFloat(t)) + '%');

	bundledtls[0].width = Math.round(CurrentBundle.width * w, 0);
	bundledtls[0].height = Math.round(CurrentBundle.height * h, 0);
	bundledtls[0].leftoffset = Math.round(CurrentBundle.width * l, 0);
	bundledtls[0].topoffset = Math.round(CurrentBundle.height * t, 0);

	if (CurrentBundledtl != null && bundledtls[0].bundledtlid == CurrentBundledtl.bundledtlid) {
		refreshSpinners();
	}
}

function updateRegionBtns() {
	updateRegionBtn('0');
	updateRegionBtn('1');
	updateRegionBtn('2');
	updateRegionBtn('3');
	updateRegionBtn('4');
	updateRegionBtn('5');
	updateRegionBtn('6');
	updateRegionBtn('7');
	updateRegionBtn('8');
	updateRegionBtn('9');
	updateRegionBtn('10');
	updateRegionBtn('11');
	updateRegionBtn('12');
	updateRegionBtn('13');
	updateRegionBtn('A1');
	updateRegionBtn('A2');
}

function updateRegionBtn(regiontype) {
	var bundledtls = CurrentBundle.bundledtls.filter(function (el) {
		return el.type == regiontype;
	});
	if (RegionLimits[regiontype] > bundledtls.length) {
		$('.pix-addregion[regiontype="' + regiontype + '"]').removeClass('disabled');
		$('.pix-addregion[regiontype="' + regiontype + '"]').removeClass('default');
		$('.pix-addregion[regiontype="' + regiontype + '"]').addClass('yellow');
	} else {
		$('.pix-addregion[regiontype="' + regiontype + '"]').addClass('disabled');
		$('.pix-addregion[regiontype="' + regiontype + '"]').removeClass('yellow');
		$('.pix-addregion[regiontype="' + regiontype + '"]').addClass('default');
	}
}

function refreshSpinners() {
	$('#spinner-x').spinner();
	$('#spinner-y').spinner();
	$('#spinner-w').spinner();
	$('#spinner-h').spinner();
	$('#spinner-x').spinner('setting', {value:parseInt(CurrentBundledtl.leftoffset), step: 1, min: 0, max: parseInt(CurrentBundle.width)-parseInt(CurrentBundledtl.width)});
	$('#spinner-y').spinner('setting', {value:parseInt(CurrentBundledtl.topoffset), step: 1, min: 0, max: parseInt(CurrentBundle.height)-parseInt(CurrentBundledtl.height)});
	$('#spinner-w').spinner('setting', {value:parseInt(CurrentBundledtl.width), step: 1, min: 1, max: parseInt(CurrentBundle.width)-parseInt(CurrentBundledtl.leftoffset)});
	$('#spinner-h').spinner('setting', {value:parseInt(CurrentBundledtl.height), step: 1, min: 1, max: parseInt(CurrentBundle.height)-parseInt(CurrentBundledtl.topoffset)});
}


FormValidateOption.rules = {};
FormValidateOption.rules['name'] = {};
FormValidateOption.rules['name']['required'] = true;
FormValidateOption.rules['name']['minlength'] = 2;
$('#BundleOptionForm').validate(FormValidateOption);

function validBundleOption(bundle) {
	if ($('#BundleOptionForm').valid()) {
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();

		bundle.name = $('#BundleOptionForm input[name=name]').attr('value');
		bundle.homeidletime = $('#BundleOptionForm input[name=homeidletime]').attr('value');
		if ($('#LayoutBgImageSelect2').select2('data') != null) {
			bundle.bgimageid =  $('#LayoutBgImageSelect2').select2('data').id;
			bundle.bgimage = $('#LayoutBgImageSelect2').select2('data').image;
		}
		bundle.description = $('#BundleOptionForm textarea').val();
		return true;
	}
	return false;
}

function validLayoutdtl(bundledtl) {
	if ($('#LayoutdtlEditForm').valid()) {
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();

		bundledtl.sleeptime = $('#LayoutdtlEditForm input[name=sleeptime]').attr('value');
		bundledtl.intervaltime = $('#LayoutdtlEditForm input[name=intervaltime]').attr('value');
		bundledtl.animation =  $('#AnimationSelect').select2('val');
		bundledtl.fitflag = $('#LayoutdtlEditForm input[name=fitflag]:checked').attr('value');
		bundledtl.volume = $('#LayoutdtlEditForm input[name=volume]').attr('value');
		bundledtl.direction = $('#LayoutdtlEditForm input[name=direction]:checked').attr('value');
		bundledtl.speed = $('#LayoutdtlEditForm input[name=speed]:checked').attr('value');
		bundledtl.color = $('#LayoutdtlEditForm input[name=color]').attr('value');
		bundledtl.size = $('#LayoutdtlEditForm input[name=size]').attr('value');
		bundledtl.dateformat = $('#LayoutdtlEditForm select[name=dateformat]').val();

		if ($('#RegionBgImageSelect').select2('data') != null) {
			bundledtl.bgimageid =  $('#RegionBgImageSelect').select2('data').id;
			bundledtl.bgimage = $('#RegionBgImageSelect').select2('data').image;
		}
		bundledtl.bgcolor = $('#LayoutdtlEditForm input[name=bgcolor]').attr('value');
		bundledtl.opacity = $('#LayoutdtlEditForm input[name=opacity]').attr('value');
		bundledtl.zindex = $('#LayoutdtlEditForm input[name=zindex]:checked').attr('value');

		return true;
	}
	return false;
}

function enterLayoutdtlFocus(bundledtl) {
	redrawLayout($('#LayoutDiv'), CurrentBundle, bundledtl);
	$('#LayoutEditForm').css('display' , 'none');
	$('#LayoutdtlEditForm').css('display' , 'block');
	$('.bundledtl-title').html(eval('common.view.region_mainflag_' + bundledtl.mainflag) + eval('common.view.region_type_' + bundledtl.type));
	$('.bundle-ctl').css("display", "none");
	$('.regiontype-' + bundledtl.type).css("display", "block");

	$('#LayoutdtlEditForm').loadJSON(bundledtl);
	//$('.colorPick').colorpicker();
	//$('.colorPick').colorpicker('setValue', bundledtl.color);
	//$('.bgcolorPick').colorpicker();
	//$('.bgcolorPick').colorpicker('setValue', bundledtl.bgcolor);
	
	$('.colorPick').wColorPicker({
	    theme           : 'classic',  // set theme
	    opacity         : 0.8,        // opacity level
	    color           : bundledtl.color,  // set init color
	    mode            : 'click',     // mode for palette (flat, hover, click)
	    position        : 'br',       // position of palette, (tl, tc, tr, rt, rm, rb, br, bc, bl, lb, lm, lt)
	    generateButton  : false,       // if mode not flat generate button or not
	    dropperButton   : false,      // optional dropper button to use in other apps
	    effect          : 'slide',    // only used when not in flat mode (none, slide, fade)
	    showSpeed       : 200,        // show speed for effects
	    hideSpeed       : 200,        // hide speed for effects
	    onMouseover     : null,       // callback for color mouseover
	    onMouseout      : null,       // callback for color mouseout
	    onSelect        : function(color){
	    	if (color.indexOf('#') == 0) {
		        $(".colorPick i").css('background', color);
		        $(".colorPick input").val(color);
		        CurrentBundledtl.color = color;
		        redrawLayout($('#LayoutDiv'), CurrentBundle, CurrentBundledtl);
	    	}
	    },
	    onDropper       : null        // callback when dropper is clicked
	});
    $(".colorPick i").css('background', bundledtl.color);
    $(".colorPick input").val(bundledtl.color);
	$('.bgcolorPick').wColorPicker({
	    theme           : 'classic',  // set theme
	    opacity         : 0.8,        // opacity level
	    color           : bundledtl.bgcolor,  // set init color
	    mode            : 'click',     // mode for palette (flat, hover, click)
	    position        : 'br',       // position of palette, (tl, tc, tr, rt, rm, rb, br, bc, bl, lb, lm, lt)
	    generateButton  : false,       // if mode not flat generate button or not
	    dropperButton   : false,      // optional dropper button to use in other apps
	    effect          : 'slide',    // only used when not in flat mode (none, slide, fade)
	    showSpeed       : 200,        // show speed for effects
	    hideSpeed       : 200,        // hide speed for effects
	    onMouseover     : null,       // callback for color mouseover
	    onMouseout      : null,       // callback for color mouseout
	    onSelect        : function(color){
	    	if (color.indexOf('#') == 0) {
		        $(".bgcolorPick i").css('background', color);
		        $(".bgcolorPick input").val(color);
		        CurrentBundledtl.bgcolor = color;
		        redrawLayout($('#LayoutDiv'), CurrentBundle, CurrentBundledtl);
	    	}
	    },
	    onDropper       : null        // callback when dropper is clicked
	});
    $(".bgcolorPick i").css('background', bundledtl.bgcolor);
    $(".bgcolorPick input").val(bundledtl.bgcolor);
	
	$(".intervalRange").ionRangeSlider({
		min: 5,
		max: 60,
		from: 10,
		type: 'single',
		step: 5,
		hasGrid: false
	});
	$(".intervalRange").ionRangeSlider("update", {
		from: bundledtl.intervaltime
	});
	$(".sleepRange").ionRangeSlider({
		min: 0,
		max: 60,
		from: 0,
		type: 'single',
		step: 5,
		hasGrid: false
	});
	$(".sleepRange").ionRangeSlider("update", {
		from: bundledtl.sleeptime
	});
	$(".sizeRange").ionRangeSlider({
		min: 10,
		max: 100,
		from: 50,
		type: 'single',
		step: 10,
		hasGrid: false,
		onChange: function(data) {
			CurrentBundledtl.size = $('#LayoutdtlEditForm input[name=size]').attr('value');
			redrawLayout($('#LayoutDiv'), CurrentBundle, CurrentBundledtl);
		}
	});
	$(".sizeRange").ionRangeSlider("update", {
		from: bundledtl.size
	});
	$(".volumeRange").ionRangeSlider({
		min: 0,
		max: 100,
		from: 0,
		type: 'single',
		step: 5,
		hasGrid: false
	});
	$(".volumeRange").ionRangeSlider("update", {
		from: bundledtl.volume
	});
	$(".opacityRange").ionRangeSlider({
		min: 0,
		max: 255,
		from: 255,
		type: 'single',
		step: 5,
		hasGrid: false,
		onChange: function(data) {
			CurrentBundledtl.opacity = $('#LayoutdtlEditForm input[name=opacity]').attr('value');
			redrawLayout($('#LayoutDiv'), CurrentBundle, CurrentBundledtl);
		}
	});
	$(".opacityRange").ionRangeSlider("update", {
		from: bundledtl.opacity
	});
	refreshSpinners();
	refreshRegionBgImageSelect();
	refreshAnimationSelect();
	$('#AnimationSelect').select2('val', bundledtl.animation);
}

$('#LayoutDiv').click(function(e){
	var scale = CurrentBundle.width / $('#LayoutDiv').width();
	var offset = $(this).offset();
	var posX = (e.pageX - offset.left) * scale;
	var posY = (e.pageY - offset.top) * scale;
	var bundledtls = CurrentBundle.bundledtls.filter(function (el) {
		var width = parseInt(el.width);
		var height = parseInt(el.height);
		var leftoffset = parseInt(el.leftoffset);
		var topoffset = parseInt(el.topoffset);
		return (posX > leftoffset) && (posX < (leftoffset + width)) && (posY > topoffset) && (posY < (topoffset + height));
	});
	if (bundledtls.length > 0) {
		bundledtls.sort(function(a, b) {
			return (a.width + a.height - b.width - b.height);
		});

		if (validLayoutdtl(CurrentBundledtl)) {
			var index = 10000;
			for (var i=0; i<bundledtls.length; i++) {
				if (CurrentBundledtl != null && CurrentBundledtl.bundledtlid == bundledtls[i].bundledtlid) {
					index = i;
					break;
				}
			}
			var oldLayoutdtl = CurrentBundledtl;
			if (index >= (bundledtls.length -1)) {
				CurrentBundledtl = bundledtls[0];
			} else {
				CurrentBundledtl = bundledtls[index+1];
			}
			enterLayoutdtlFocus(CurrentBundledtl);
		}
	}
});

$('#RegionBgImageSelect').on('change', function(e) {
	if ($('#RegionBgImageSelect').select2('data') != null) {
		CurrentBundledtl.bgimageid = $('#RegionBgImageSelect').select2('data').id;
		CurrentBundledtl.bgimage = $('#RegionBgImageSelect').select2('data').image;
	}
	redrawLayout($('#LayoutDiv'), CurrentBundle, CurrentBundledtl);
});	
$('#RegionBgImageRemove').on('click', function(e) {
	$('#RegionBgImageSelect').select2('val', '');
	CurrentBundledtl.bgimageid = 0;
	CurrentBundledtl.bgimage = null;
	redrawLayout($('#LayoutDiv'), CurrentBundle, CurrentBundledtl);
});	

$('#LayoutBgImageSelect2').on('change', function(e) {
	if ($('#LayoutBgImageSelect2').select2('data') != null) {
		CurrentBundle.bgimageid =  $('#LayoutBgImageSelect2').select2('data').id;
		CurrentBundle.bgimage = $('#LayoutBgImageSelect2').select2('data').image;
	}
	redrawLayout($('#LayoutDiv'), CurrentBundle, CurrentBundledtl);
});	
$('#LayoutBgImageRemove').on('click', function(e) {
	$('#LayoutBgImageSelect2').select2('val', '');
	CurrentBundle.bgimageid = 0;
	CurrentBundle.bgimage = null;
	redrawLayout($('#LayoutDiv'), CurrentBundle, CurrentBundledtl);
});	

$('#spinner-x,#spinner-y,#spinner-w,#spinner-h').on("change", function(e) {
	CurrentBundledtl.leftoffset = $('#spinner-x').spinner('value');
	CurrentBundledtl.topoffset = $('#spinner-y').spinner('value');
	CurrentBundledtl.width = $('#spinner-w').spinner('value');
	CurrentBundledtl.height = $('#spinner-h').spinner('value');
	redrawLayout($('#LayoutDiv'), CurrentBundle, CurrentBundledtl);
	refreshSpinners();
});	

$('#LayoutdtlEditForm input,select').on('change', function(e) {
	CurrentBundledtl.sleeptime = $('#LayoutdtlEditForm input[name=sleeptime]').attr('value');
	CurrentBundledtl.intervaltime = $('#LayoutdtlEditForm input[name=intervaltime]').attr('value');
	CurrentBundledtl.fitflag = $('#LayoutdtlEditForm input[name=fitflag]:checked').attr('value');
	CurrentBundledtl.volume = $('#LayoutdtlEditForm input[name=volume]').attr('value');
	CurrentBundledtl.direction = $('#LayoutdtlEditForm input[name=direction]:checked').attr('value');
	CurrentBundledtl.speed = $('#LayoutdtlEditForm input[name=speed]:checked').attr('value');
	CurrentBundledtl.color = $('#LayoutdtlEditForm input[name=color]').attr('value');
	CurrentBundledtl.size = $('#LayoutdtlEditForm input[name=size]').attr('value');
	CurrentBundledtl.dateformat = $('#LayoutdtlEditForm select[name=dateformat]').val();
	CurrentBundledtl.bgcolor = $('#LayoutdtlEditForm input[name=bgcolor]').attr('value');
	CurrentBundledtl.opacity = $('#LayoutdtlEditForm input[name=opacity]').attr('value');
	CurrentBundledtl.zindex = $('#LayoutdtlEditForm input[name=zindex]:checked').attr('value');
	redrawLayout($('#LayoutDiv'), CurrentBundle, CurrentBundledtl);
});

//================================设计对话框=========================================
//在设计对话框中新增区域
$('body').on('click', '.pix-addregion', function(event) {
	var regiontype = $(event.target).attr('regiontype');
	if (regiontype == undefined) {
		regiontype = $(event.target).parent().attr('regiontype');
	}
	
	var bundledtls = CurrentBundle.bundledtls.filter(function (el) {
		return el.type == regiontype;
	});
	if (RegionLimits[regiontype] <= bundledtls.length) {
		return;
	}
	
	var bundledtl = {};
	bundledtl.bundledtlid = '-' + Math.round(Math.random()*100000000);
	bundledtl.bundleid = CurrentBundleid;
	bundledtl.type = regiontype;
	bundledtl.mainflag = 0;
	bundledtl.leftoffset = CurrentBundle.height * 0.1;
	bundledtl.topoffset = CurrentBundle.width * 0.1;
	if (RegionRatios[regiontype] != undefined) {
		bundledtl.width = CurrentBundle.width * 0.2;
		bundledtl.height = CurrentBundle.width * 0.2 / RegionRatios[regiontype];
	} else {
		bundledtl.width = CurrentBundle.width * 0.2;
		bundledtl.height = CurrentBundle.height * 0.2;
	}
	if (bundledtl.type == 0) {
		bundledtl.zindex = 1;
	} else {
		bundledtl.zindex = 2;
	}
	bundledtl.bgimageid = 0;
	bundledtl.bgcolor = '#FFFFFF';
	if (CurrentBundle.bgimage != null) {
		bundledtl.opacity = 0;
	} else {
		bundledtl.opacity = 255;
	}
	bundledtl.sleeptime = 0;
	bundledtl.intervaltime = 10;
	bundledtl.animation = 'None';
	bundledtl.fitflag = 1;
	bundledtl.volume = 50;
	bundledtl.direction = 4;
	bundledtl.speed = 2;
	bundledtl.color = '#000000';
	if (bundledtl.type == '1' || bundledtl.type == '2' || bundledtl.type == '3') {
		bundledtl.size = 50;
	} else {
		bundledtl.size = 30;
	}
	bundledtl.dateformat = 'yyyy-MM-dd HH:mm';

	if (bundledtl.type == 0) {
		bundledtl.objtype = 1;
		bundledtl.medialist = {};
		bundledtl.medialist.medialistid = 0;
		bundledtl.medialist.medialistdtls = [];
		bundledtl.medialist.name = '';
		bundledtl.medialist0 = bundledtl.medialist;
		bundledtl.widget = {};
		bundledtl.widget.widgetid = 0;
		bundledtl.widget.name = '';
		bundledtl.widget.url = '';
		bundledtl.widget0 = bundledtl.widget;
	} else if (bundledtl.type == 1) {
		bundledtl.objtype = 2;
		bundledtl.text = {};
		bundledtl.text.textid = 0;
		bundledtl.text.name = '';
		bundledtl.text.text = '';
		bundledtl.text0 = bundledtl.text;
	} else if (bundledtl.type == 5) {
		bundledtl.objtype = 6;
	} else if (bundledtl.type == 6) {
		bundledtl.objtype = 1;
		bundledtl.medialist = {};
		bundledtl.medialist.medialistid = 0;
		bundledtl.medialist.medialistdtls = [];
		bundledtl.medialist.name = '';
		bundledtl.medialist0 = bundledtl.medialist;
	} else if (bundledtl.type == 7) {
		bundledtl.touchtype = 1;
		bundledtl.objtype = 0;
	} else if (bundledtl.type == 12) {
		bundledtl.objtype = 7;
		bundledtl.rss = {};
		bundledtl.rss.rssid = 0;
		bundledtl.rss.name = '';
		bundledtl.rss.url = '';
		bundledtl.rss0 = bundledtl.rss;
	} else {
		bundledtl.objtype = 0;
	}
	bundledtl.referflag = 0;
	bundledtl.objid = 0;
	
	CurrentBundle.bundledtls[CurrentBundle.bundledtls.length] = bundledtl;
	
	redrawLayout($('#LayoutDiv'), CurrentBundle, CurrentBundledtl);
	updateRegionBtns();
});

$('body').on('click', '.pix-region-delete', function(event) {
	if (CurrentBundledtl.mainflag == 1) {
		bootbox.alert(common.tips.region_remove_failed);
		return;
	}
	bootbox.confirm(common.tips.remove + eval('common.view.region_type_' + CurrentBundledtl.type), function(result) {
		if (result == true) {
			CurrentBundle.bundledtls.splice(CurrentBundle.bundledtls.indexOf(CurrentBundledtl), 1);
			CurrentBundledtl = CurrentBundle.bundledtls[0];
			updateRegionBtns();
			enterLayoutdtlFocus(CurrentBundledtl);
		}
	 });
});


$.ajax({
	type : 'POST',
	url : 'folder!list.action',
	data : { },
	success : function(data, status) {
		if (data.errorcode == 0) {
			var folders = data.aaData;
			var folderid = folders[0].folderid;
			
			var folderTreeDivData = [];
			createFolderTreeData(folders, folderTreeDivData);
			$('.foldertree').each(function() {
				$(this).jstree('destroy');
				$(this).jstree({
					'core' : {
						'multiple' : false,
						'data' : folderTreeDivData
					},
					'plugins' : ['unique', 'types'],
					'types' : {
						'default' : { 'icon' : 'fa fa-folder icon-state-warning icon-lg' }
					},
				});
				$(this).on('loaded.jstree', function() {
					$(this).jstree('select_node', folderid);
				});
				$(this).on('select_node.jstree', function(event, data) {
					folderid = data.instance.get_node(data.selected[0]).id;
					refreshLayoutBgImageSelect1(folderid);
					refreshLayoutBgImageSelect2(folderid);
					refreshRegionBgImageSelect(folderid);
				});
			});
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
