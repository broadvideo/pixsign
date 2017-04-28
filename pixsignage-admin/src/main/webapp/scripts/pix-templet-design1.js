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

function redrawLayout(div, templet, templetdtl) {
	div.empty();
	div.css('position', 'relative');
	div.css('margin-left', 'auto');
	div.css('margin-right', 'auto');
	div.css('border', '1px solid #000');
	if (templet.bgimage != null) {
		div.append('<img class="templet-bg" src="/pixsigdata' + templet.bgimage.thumbnail + '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
	}
	for (var i=0; i<templet.templetdtls.length; i++) {
		div.append('<div id="LayoutdtlDiv' + templet.templetdtls[i].templetdtlid + '"></div>');
		if (templetdtl != null && templetdtl.templetdtlid == templet.templetdtls[i].templetdtlid) {
			redrawLayoutdtl($('#LayoutdtlDiv' + templet.templetdtls[i].templetdtlid), templet, templet.templetdtls[i], true);
		} else {
			redrawLayoutdtl($('#LayoutdtlDiv' + templet.templetdtls[i].templetdtlid), templet, templet.templetdtls[i], false);
		}
	}
	var width = Math.floor(div.parent().width());
	var scale = templet.width / width;
	var height = templet.height / scale;
	div.css('width' , width);
	div.css('height' , height);
	$(div).find('.templet-font').each(function() {
		var templetdtl = templet.templetdtls[$(this).attr('templetdtlindex')];
		var fontsize = templetdtl.size * templetdtl.height / 100 / scale;
		var text = $(this).html();
		$(this).css('font-size', fontsize + 'px');
		$(this).css('line-height', templetdtl.height / scale + 'px');
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

function redrawLayoutdtl(div, templet, templetdtl, selected) {
	div.empty();
	div.attr("class", "region ui-draggable ui-resizable");
	div.attr('templetdtlid', templetdtl.templetdtlid);
	div.css('position', 'absolute');
	div.css('width', 100*templetdtl.width/templet.width + '%');
	div.css('height', 100*templetdtl.height/templet.height + '%');
	div.css('top', 100*templetdtl.topoffset/templet.height + '%');
	div.css('left', 100*templetdtl.leftoffset/templet.width + '%');
	var templetdtlhtml = '';
	var border = '1px solid #000000';
	if (selected) {
		border = '3px solid #FF0000';
	}
	var bgcolor = templetdtl.bgcolor;
	var bgimage = '';
	if (templetdtl.bgimage != null) {
		bgimage = '/pixsigdata' + templetdtl.bgimage.thumbnail;
	} else if (templetdtl.mainflag == 1) {
		bgimage = '../img/region/region-play-main.jpg';
	} else if (templetdtl.type == 0) {
		bgimage = '../img/region/region-play.jpg';
	} else if (templetdtl.type == 4) {
		bgimage = '../img/region/region-videoin.jpg';
	} else if (templetdtl.type == 5) {
		bgimage = '../img/region/region-dvb.jpg';
	} else if (templetdtl.type == 6) {
		bgimage = '../img/region/region-stream.jpg';
	} else if (templetdtl.type == 8) {
		if (templetdtl.width > templetdtl.height) {
			bgimage = '../img/region/region-navigate-h.jpg';
		} else {
			bgimage = '../img/region/region-navigate-v.jpg';
		}
	} else if (templetdtl.type == 9) {
		bgimage = '../img/region/region-qrcode.jpg';
	}
	if (templetdtl.type == 0) {
		if (templetdtl.objtype == 1 && templetdtl.medialist.medialistdtls.length > 0) {
			var medialistdtl = templetdtl.medialist.medialistdtls[0];
			if (medialistdtl.objtype == 1 && medialistdtl.video.thumbnail != null) {
				bgimage = '/pixsigdata' + medialistdtl.video.thumbnail;
			} else if (medialistdtl.objtype == 2 && medialistdtl.image.filename != null) {
				bgimage = '/pixsigdata' + medialistdtl.image.thumbnail;
			}
		} else if (templetdtl.objtype == 5) {
			bgimage = '../img/region/region-widget.jpg';
		}
	}

	var templetdtlindex = templet.templetdtls.indexOf(templetdtl);

	templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bgcolor + '; opacity:' + templetdtl.opacity/255 + '; "></div>';
	if (templetdtl.type == '0' || templetdtl.type == '4' || templetdtl.type == '5' || templetdtl.type == '6' || templetdtl.type == '8' || templetdtl.type == '9') {
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		templetdtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
		templetdtlhtml += '</div>';
	} else if (templetdtl.type == 1) {
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		var text = templetdtl.text.text;
		if (templetdtl.direction == '4') {
			if (text == '') {
				text = '滚动文本';
			}
			templetdtlhtml += '<marquee class="templet-font" templetdtlindex="' + templetdtlindex + '" direction="left" behavior="scroll" scrollamount="1" scrolldelay="0" loop="-1" style="color:' + templetdtl.color + '; font-size:12px; ">';
			templetdtlhtml += text;
			templetdtlhtml += '</marquee>';
		} else {
			if (text == '') {
				text = '静止文本';
			}
			templetdtlhtml += '<p class="templet-font" templetdtlindex="' + templetdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + templetdtl.color + '; font-size:12px; ">';
			templetdtlhtml += text;
			templetdtlhtml += '</p>';
		}
		templetdtlhtml += '</div>';
	} else if (templetdtl.type == '2') {
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		templetdtlhtml += '<p class="templet-font" templetdtlindex="' + templetdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + templetdtl.color + '; font-size:12px; ">';
		templetdtlhtml += new Date().pattern(templetdtl.dateformat);
		templetdtlhtml += '</p>';
		templetdtlhtml += '</div>';
	} else if (templetdtl.type == '3') {
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		templetdtlhtml += '<div class="templet-font" templetdtlindex="' + templetdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + templetdtl.color + '; font-size:12px; ">';
		templetdtlhtml += '深圳 20 ~ 17℃ 多云转小雨 ';
		templetdtlhtml += '<img src="http://api.map.baidu.com/images/weather/day/duoyun.png" />';
		templetdtlhtml += '<img src="http://api.map.baidu.com/images/weather/night/xiaoyu.png" />';
		templetdtlhtml += '</div>';
		templetdtlhtml += '</div>';
	} else {
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		if (bgimage != '') {
			templetdtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
		}
		templetdtlhtml += '<p class="templet-font" templetdtlindex="' + templetdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + templetdtl.color + '; font-size:12px; ">';
		templetdtlhtml += eval('common.view.region_mainflag_' + templetdtl.mainflag) + eval('common.view.region_type_' + templetdtl.type);
		templetdtlhtml += '</p>';
		templetdtlhtml += '</div>';
	}

	templetdtlhtml += '<div class="btn-group" style="z-index:50; opacity:0.5; ">';
	templetdtlhtml += '<label class="btn btn-circle btn-default btn-xs">' + eval('common.view.region_mainflag_' + templetdtl.mainflag) + eval('common.view.region_type_' + templetdtl.type) + '</label>';
	templetdtlhtml += '</div>';
	div.html(templetdtlhtml);

	div.draggable({
		containment: div.parent(),
		stop: regionPositionUpdate,
		drag: regionPositionUpdate
	}).resizable({
		containment: div.parent(),
		minWidth: 25,
		minHeight: 25,
		stop: function(e, ui) {
			redrawLayout($('#LayoutDiv'), CurrentTemplet, CurrentTempletdtl);
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
			if (CurrentTemplet != null && CurrentTemplet.bgimage != null) {
				callback({id: CurrentTemplet.bgimage.imageid, text: CurrentTemplet.bgimage.name, image: CurrentTemplet.bgimage });
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
			if (CurrentTemplet != null && CurrentTemplet.bgimage != null) {
				callback({id: CurrentTemplet.bgimage.imageid, text: CurrentTemplet.bgimage.name, image: CurrentTemplet.bgimage });
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
			if (CurrentTempletdtl != null && CurrentTempletdtl.bgimage != null) {
				callback({id: CurrentTempletdtl.bgimage.imageid, text: CurrentTempletdtl.bgimage.name, image: CurrentTempletdtl.bgimage });
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
	var templetdtlid = $(this).attr("templetdtlid");
	var templetdtls = CurrentTemplet.templetdtls.filter(function (el) {
		return el.templetdtlid == templetdtlid;
	});

	var l = $(this).position().left / $('#LayoutDiv').width();
	var t = $(this).position().top / $('#LayoutDiv').height();
	if (RegionRatios[templetdtls[0].type] != undefined) {
		var w = $(this).width() / $('#LayoutDiv').width();
		var h = $(this).width() / parseFloat(RegionRatios[templetdtls[0].type]) / $('#LayoutDiv').height();
		if (t + h > 1) {
			h = 1 - t;
			w = h * $('#LayoutDiv').height() * parseFloat(RegionRatios[templetdtls[0].type]) / $('#LayoutDiv').width();
		}
	} else {
		var w = $(this).width() / $('#LayoutDiv').width();
		var h = $(this).height() / $('#LayoutDiv').height();
	}
	$(this).css("width" , (100 * parseFloat(w)) + '%');
	$(this).css("height" , (100 * parseFloat(h)) + '%');
	$(this).css("left" , (100 * parseFloat(l)) + '%');
	$(this).css("top" , (100 * parseFloat(t)) + '%');

	templetdtls[0].width = Math.round(CurrentTemplet.width * w, 0);
	templetdtls[0].height = Math.round(CurrentTemplet.height * h, 0);
	templetdtls[0].leftoffset = Math.round(CurrentTemplet.width * l, 0);
	templetdtls[0].topoffset = Math.round(CurrentTemplet.height * t, 0);

	if (CurrentTempletdtl != null && templetdtls[0].templetdtlid == CurrentTempletdtl.templetdtlid) {
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
	var templetdtls = CurrentTemplet.templetdtls.filter(function (el) {
		return el.type == regiontype;
	});
	if (RegionLimits[regiontype] > templetdtls.length) {
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
	$('#spinner-x').spinner('setting', {value:parseInt(CurrentTempletdtl.leftoffset), step: 1, min: 0, max: parseInt(CurrentTemplet.width)-parseInt(CurrentTempletdtl.width)});
	$('#spinner-y').spinner('setting', {value:parseInt(CurrentTempletdtl.topoffset), step: 1, min: 0, max: parseInt(CurrentTemplet.height)-parseInt(CurrentTempletdtl.height)});
	$('#spinner-w').spinner('setting', {value:parseInt(CurrentTempletdtl.width), step: 1, min: 1, max: parseInt(CurrentTemplet.width)-parseInt(CurrentTempletdtl.leftoffset)});
	$('#spinner-h').spinner('setting', {value:parseInt(CurrentTempletdtl.height), step: 1, min: 1, max: parseInt(CurrentTemplet.height)-parseInt(CurrentTempletdtl.topoffset)});
}


FormValidateOption.rules = {};
FormValidateOption.rules['name'] = {};
FormValidateOption.rules['name']['required'] = true;
FormValidateOption.rules['name']['minlength'] = 2;
$('#TempletOptionForm').validate(FormValidateOption);

function validTempletOption(templet) {
	if ($('#TempletOptionForm').valid()) {
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();

		templet.name = $('#TempletOptionForm input[name=name]').attr('value');
		templet.homeidletime = $('#TempletOptionForm input[name=homeidletime]').attr('value');
		if ($('#LayoutBgImageSelect2').select2('data') != null) {
			templet.bgimageid =  $('#LayoutBgImageSelect2').select2('data').id;
			templet.bgimage = $('#LayoutBgImageSelect2').select2('data').image;
		}
		templet.description = $('#TempletOptionForm textarea').val();
		return true;
	}
	return false;
}

function validLayoutdtl(templetdtl) {
	if ($('#LayoutdtlEditForm').valid()) {
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();

		templetdtl.sleeptime = $('#LayoutdtlEditForm input[name=sleeptime]').attr('value');
		templetdtl.intervaltime = $('#LayoutdtlEditForm input[name=intervaltime]').attr('value');
		templetdtl.animation =  $('#AnimationSelect').select2('val');
		templetdtl.fitflag = $('#LayoutdtlEditForm input[name=fitflag]:checked').attr('value');
		templetdtl.volume = $('#LayoutdtlEditForm input[name=volume]').attr('value');
		templetdtl.direction = $('#LayoutdtlEditForm input[name=direction]:checked').attr('value');
		templetdtl.speed = $('#LayoutdtlEditForm input[name=speed]:checked').attr('value');
		templetdtl.color = $('#LayoutdtlEditForm input[name=color]').attr('value');
		templetdtl.size = $('#LayoutdtlEditForm input[name=size]').attr('value');
		templetdtl.dateformat = $('#LayoutdtlEditForm select[name=dateformat]').val();

		if ($('#RegionBgImageSelect').select2('data') != null) {
			templetdtl.bgimageid =  $('#RegionBgImageSelect').select2('data').id;
			templetdtl.bgimage = $('#RegionBgImageSelect').select2('data').image;
		}
		templetdtl.bgcolor = $('#LayoutdtlEditForm input[name=bgcolor]').attr('value');
		templetdtl.opacity = $('#LayoutdtlEditForm input[name=opacity]').attr('value');
		templetdtl.zindex = $('#LayoutdtlEditForm input[name=zindex]:checked').attr('value');

		return true;
	}
	return false;
}

function enterLayoutdtlFocus(templetdtl) {
	redrawLayout($('#LayoutDiv'), CurrentTemplet, templetdtl);
	$('#LayoutEditForm').css('display' , 'none');
	$('#LayoutdtlEditForm').css('display' , 'block');
	$('.templetdtl-title').html(eval('common.view.region_mainflag_' + templetdtl.mainflag) + eval('common.view.region_type_' + templetdtl.type));
	$('.templet-ctl').css("display", "none");
	$('.regiontype-' + templetdtl.type).css("display", "block");

	$('#LayoutdtlEditForm').loadJSON(templetdtl);
	//$('.colorPick').colorpicker();
	//$('.colorPick').colorpicker('setValue', templetdtl.color);
	//$('.bgcolorPick').colorpicker();
	//$('.bgcolorPick').colorpicker('setValue', templetdtl.bgcolor);
	
	$('.colorPick').wColorPicker({
	    theme           : 'classic',  // set theme
	    opacity         : 0.8,        // opacity level
	    color           : templetdtl.color,  // set init color
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
		        CurrentTempletdtl.color = color;
		        redrawLayout($('#LayoutDiv'), CurrentTemplet, CurrentTempletdtl);
	    	}
	    },
	    onDropper       : null        // callback when dropper is clicked
	});
    $(".colorPick i").css('background', templetdtl.color);
    $(".colorPick input").val(templetdtl.color);
	$('.bgcolorPick').wColorPicker({
	    theme           : 'classic',  // set theme
	    opacity         : 0.8,        // opacity level
	    color           : templetdtl.bgcolor,  // set init color
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
		        CurrentTempletdtl.bgcolor = color;
		        redrawLayout($('#LayoutDiv'), CurrentTemplet, CurrentTempletdtl);
	    	}
	    },
	    onDropper       : null        // callback when dropper is clicked
	});
    $(".bgcolorPick i").css('background', templetdtl.bgcolor);
    $(".bgcolorPick input").val(templetdtl.bgcolor);
	
	$(".intervalRange").ionRangeSlider({
		min: 5,
		max: 60,
		from: 10,
		type: 'single',
		step: 5,
		hasGrid: false
	});
	$(".intervalRange").ionRangeSlider("update", {
		from: templetdtl.intervaltime
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
		from: templetdtl.sleeptime
	});
	$(".sizeRange").ionRangeSlider({
		min: 10,
		max: 100,
		from: 50,
		type: 'single',
		step: 10,
		hasGrid: false,
		onChange: function(data) {
			CurrentTempletdtl.size = $('#LayoutdtlEditForm input[name=size]').attr('value');
			redrawLayout($('#LayoutDiv'), CurrentTemplet, CurrentTempletdtl);
		}
	});
	$(".sizeRange").ionRangeSlider("update", {
		from: templetdtl.size
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
		from: templetdtl.volume
	});
	$(".opacityRange").ionRangeSlider({
		min: 0,
		max: 255,
		from: 255,
		type: 'single',
		step: 5,
		hasGrid: false,
		onChange: function(data) {
			CurrentTempletdtl.opacity = $('#LayoutdtlEditForm input[name=opacity]').attr('value');
			redrawLayout($('#LayoutDiv'), CurrentTemplet, CurrentTempletdtl);
		}
	});
	$(".opacityRange").ionRangeSlider("update", {
		from: templetdtl.opacity
	});
	refreshSpinners();
	refreshRegionBgImageSelect();
	refreshAnimationSelect();
	$('#AnimationSelect').select2('val', templetdtl.animation);
}

$('#LayoutDiv').click(function(e){
	var scale = CurrentTemplet.width / $('#LayoutDiv').width();
	var offset = $(this).offset();
	var posX = (e.pageX - offset.left) * scale;
	var posY = (e.pageY - offset.top) * scale;
	var templetdtls = CurrentTemplet.templetdtls.filter(function (el) {
		var width = parseInt(el.width);
		var height = parseInt(el.height);
		var leftoffset = parseInt(el.leftoffset);
		var topoffset = parseInt(el.topoffset);
		return (posX > leftoffset) && (posX < (leftoffset + width)) && (posY > topoffset) && (posY < (topoffset + height));
	});
	if (templetdtls.length > 0) {
		templetdtls.sort(function(a, b) {
			return (a.width + a.height - b.width - b.height);
		});

		if (validLayoutdtl(CurrentTempletdtl)) {
			var index = 10000;
			for (var i=0; i<templetdtls.length; i++) {
				if (CurrentTempletdtl != null && CurrentTempletdtl.templetdtlid == templetdtls[i].templetdtlid) {
					index = i;
					break;
				}
			}
			var oldLayoutdtl = CurrentTempletdtl;
			if (index >= (templetdtls.length -1)) {
				CurrentTempletdtl = templetdtls[0];
			} else {
				CurrentTempletdtl = templetdtls[index+1];
			}
			enterLayoutdtlFocus(CurrentTempletdtl);
		}
	}
});

$('#RegionBgImageSelect').on('change', function(e) {
	if ($('#RegionBgImageSelect').select2('data') != null) {
		CurrentTempletdtl.bgimageid = $('#RegionBgImageSelect').select2('data').id;
		CurrentTempletdtl.bgimage = $('#RegionBgImageSelect').select2('data').image;
	}
	redrawLayout($('#LayoutDiv'), CurrentTemplet, CurrentTempletdtl);
});	
$('#RegionBgImageRemove').on('click', function(e) {
	$('#RegionBgImageSelect').select2('val', '');
	CurrentTempletdtl.bgimageid = 0;
	CurrentTempletdtl.bgimage = null;
	redrawLayout($('#LayoutDiv'), CurrentTemplet, CurrentTempletdtl);
});	

$('#LayoutBgImageSelect2').on('change', function(e) {
	if ($('#LayoutBgImageSelect2').select2('data') != null) {
		CurrentTemplet.bgimageid =  $('#LayoutBgImageSelect2').select2('data').id;
		CurrentTemplet.bgimage = $('#LayoutBgImageSelect2').select2('data').image;
	}
	redrawLayout($('#LayoutDiv'), CurrentTemplet, CurrentTempletdtl);
});	
$('#LayoutBgImageRemove').on('click', function(e) {
	$('#LayoutBgImageSelect2').select2('val', '');
	CurrentTemplet.bgimageid = 0;
	CurrentTemplet.bgimage = null;
	redrawLayout($('#LayoutDiv'), CurrentTemplet, CurrentTempletdtl);
});	

$('#spinner-x,#spinner-y,#spinner-w,#spinner-h').on("change", function(e) {
	CurrentTempletdtl.leftoffset = $('#spinner-x').spinner('value');
	CurrentTempletdtl.topoffset = $('#spinner-y').spinner('value');
	CurrentTempletdtl.width = $('#spinner-w').spinner('value');
	CurrentTempletdtl.height = $('#spinner-h').spinner('value');
	redrawLayout($('#LayoutDiv'), CurrentTemplet, CurrentTempletdtl);
	refreshSpinners();
});	

$('#LayoutdtlEditForm input,select').on('change', function(e) {
	CurrentTempletdtl.sleeptime = $('#LayoutdtlEditForm input[name=sleeptime]').attr('value');
	CurrentTempletdtl.intervaltime = $('#LayoutdtlEditForm input[name=intervaltime]').attr('value');
	CurrentTempletdtl.fitflag = $('#LayoutdtlEditForm input[name=fitflag]:checked').attr('value');
	CurrentTempletdtl.volume = $('#LayoutdtlEditForm input[name=volume]').attr('value');
	CurrentTempletdtl.direction = $('#LayoutdtlEditForm input[name=direction]:checked').attr('value');
	CurrentTempletdtl.speed = $('#LayoutdtlEditForm input[name=speed]:checked').attr('value');
	CurrentTempletdtl.color = $('#LayoutdtlEditForm input[name=color]').attr('value');
	CurrentTempletdtl.size = $('#LayoutdtlEditForm input[name=size]').attr('value');
	CurrentTempletdtl.dateformat = $('#LayoutdtlEditForm select[name=dateformat]').val();
	CurrentTempletdtl.bgcolor = $('#LayoutdtlEditForm input[name=bgcolor]').attr('value');
	CurrentTempletdtl.opacity = $('#LayoutdtlEditForm input[name=opacity]').attr('value');
	CurrentTempletdtl.zindex = $('#LayoutdtlEditForm input[name=zindex]:checked').attr('value');
	redrawLayout($('#LayoutDiv'), CurrentTemplet, CurrentTempletdtl);
});

//================================设计对话框=========================================
//在设计对话框中新增区域
$('body').on('click', '.pix-addregion', function(event) {
	var regiontype = $(event.target).attr('regiontype');
	if (regiontype == undefined) {
		regiontype = $(event.target).parent().attr('regiontype');
	}
	
	var templetdtls = CurrentTemplet.templetdtls.filter(function (el) {
		return el.type == regiontype;
	});
	if (RegionLimits[regiontype] <= templetdtls.length) {
		return;
	}
	
	var templetdtl = {};
	templetdtl.templetdtlid = '-' + Math.round(Math.random()*100000000);
	templetdtl.templetid = CurrentTempletid;
	templetdtl.type = regiontype;
	templetdtl.mainflag = 0;
	templetdtl.leftoffset = CurrentTemplet.height * 0.1;
	templetdtl.topoffset = CurrentTemplet.width * 0.1;
	if (RegionRatios[regiontype] != undefined) {
		templetdtl.width = CurrentTemplet.width * 0.2;
		templetdtl.height = CurrentTemplet.width * 0.2 / RegionRatios[regiontype];
	} else {
		templetdtl.width = CurrentTemplet.width * 0.2;
		templetdtl.height = CurrentTemplet.height * 0.2;
	}
	if (templetdtl.type == 0) {
		templetdtl.zindex = 1;
	} else {
		templetdtl.zindex = 2;
	}
	templetdtl.bgimageid = 0;
	templetdtl.bgcolor = '#FFFFFF';
	if (CurrentTemplet.bgimage != null) {
		templetdtl.opacity = 0;
	} else {
		templetdtl.opacity = 255;
	}
	templetdtl.sleeptime = 0;
	templetdtl.intervaltime = 10;
	templetdtl.animation = 'None';
	templetdtl.fitflag = 1;
	templetdtl.volume = 50;
	templetdtl.direction = 4;
	templetdtl.speed = 2;
	templetdtl.color = '#000000';
	if (templetdtl.type == '1' || templetdtl.type == '2' || templetdtl.type == '3') {
		templetdtl.size = 50;
	} else {
		templetdtl.size = 30;
	}
	templetdtl.dateformat = 'yyyy-MM-dd HH:mm';

	if (templetdtl.type == 0) {
		templetdtl.objtype = 1;
		templetdtl.medialist = {};
		templetdtl.medialist.medialistid = 0;
		templetdtl.medialist.medialistdtls = [];
		templetdtl.medialist.name = '';
		templetdtl.widget = {};
		templetdtl.widget.widgetid = 0;
		templetdtl.widget.name = '';
		templetdtl.widget.url = '';
	} else if (templetdtl.type == 1) {
		templetdtl.objtype = 2;
		templetdtl.text = {};
		templetdtl.text.textid = 0;
		templetdtl.text.name = '';
		templetdtl.text.text = '';
	} else if (templetdtl.type == 5) {
		templetdtl.objtype = 6;
	} else if (templetdtl.type == 6) {
		templetdtl.objtype = 1;
		templetdtl.medialist = {};
		templetdtl.medialist.medialistid = 0;
		templetdtl.medialist.medialistdtls = [];
		templetdtl.medialist.name = '';
	} else if (templetdtl.type == 7) {
		templetdtl.touchtype = 1;
		templetdtl.objtype = 0;
	} else if (templetdtl.type == 12) {
		templetdtl.objtype = 7;
		templetdtl.rss = {};
		templetdtl.rss.rssid = 0;
		templetdtl.rss.name = '';
		templetdtl.rss.url = '';
	} else {
		templetdtl.objtype = 0;
	}
	templetdtl.objid = 0;
	
	CurrentTemplet.templetdtls[CurrentTemplet.templetdtls.length] = templetdtl;
	
	redrawLayout($('#LayoutDiv'), CurrentTemplet, CurrentTempletdtl);
	updateRegionBtns();
});

$('body').on('click', '.pix-region-delete', function(event) {
	if (CurrentTempletdtl.mainflag == 1) {
		bootbox.alert(common.tips.region_remove_failed);
		return;
	}
	bootbox.confirm(common.tips.remove + eval('common.view.region_type_' + CurrentTempletdtl.type), function(result) {
		if (result == true) {
			CurrentTemplet.templetdtls.splice(CurrentTemplet.templetdtls.indexOf(CurrentTempletdtl), 1);
			CurrentTempletdtl = CurrentTemplet.templetdtls[0];
			updateRegionBtns();
			enterLayoutdtlFocus(CurrentTempletdtl);
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
