var RegionColors = [];
RegionColors[0] = '#BCC2F2';
RegionColors[1] = '#99CCFF';
RegionColors[2] = '#CCCC99';
RegionColors[3] = '#CCCC99';
RegionColors[4] = '#FFCCCC';
RegionColors[5] = '#FF99CC';
RegionColors[6] = '#CC99CC';
RegionColors[7] = '#FFFF99';
RegionColors[8] = '#CC9966';
RegionColors[9] = '#CC9966';

var CurrentLayoutid = 0;
var CurrentLayout;
var CurrentLayoutdtl;
var TempRegions;

function redrawLayout(div, layout, layoutdtl) {
	div.empty();
	div.css('position', 'relative');
	div.css('margin-left', 'auto');
	div.css('margin-right', 'auto');
	div.css('border', '1px solid #000');
	if (layout.bgimage != null) {
		div.append('<img class="layout-bg" src="/pixsigdata/image/preview/' + layout.bgimage.filename + '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
	}
	for (var i=0; i<layout.layoutdtls.length; i++) {
		div.append('<div id="LayoutdtlDiv' + layout.layoutdtls[i].layoutdtlid + '"></div>');
		if (layoutdtl != null && layoutdtl.layoutdtlid == layout.layoutdtls[i].layoutdtlid) {
			redrawLayoutdtl($('#LayoutdtlDiv' + layout.layoutdtls[i].layoutdtlid), layout, layout.layoutdtls[i], true);
		} else {
			redrawLayoutdtl($('#LayoutdtlDiv' + layout.layoutdtls[i].layoutdtlid), layout, layout.layoutdtls[i], false);
		}
	}
	var width = Math.floor(div.parent().width());
	var scale = layout.width / width;
	var height = layout.height / scale;
	div.css('width' , width);
	div.css('height' , height);
	$(div).find('.layout-font').each(function() {
		var layoutdtl = layout.layoutdtls[$(this).attr('layoutdtlindex')];
		var fontsize = layoutdtl.size * layoutdtl.height / 100 / scale;
		var text = $(this).html();
		$(this).css('font-size', fontsize + 'px');
		$(this).css('line-height', layoutdtl.height / scale + 'px');
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

function redrawLayoutdtl(div, layout, layoutdtl, selected) {
	div.empty();
	div.attr("class", "region ui-draggable ui-resizable");
	div.attr('layoutdtlid', layoutdtl.layoutdtlid);
	div.css('position', 'absolute');
	div.css('width', 100*layoutdtl.width/layout.width + '%');
	div.css('height', 100*layoutdtl.height/layout.height + '%');
	div.css('top', 100*layoutdtl.topoffset/layout.height + '%');
	div.css('left', 100*layoutdtl.leftoffset/layout.width + '%');
	var layoutdtlhtml = '';
	var border = '1px solid #000000';
	if (selected) {
		border = '3px solid #FF0000';
	}
	var bgcolor = layoutdtl.bgcolor;
	if (layoutdtl.region.regionid == 1) {
		bgcolor = '#6Fa8DC';
	} else if (layoutdtl.region.type == 0) {
		bgcolor = '#FFF2CC';
	}
	var layoutdtlindex = layout.layoutdtls.indexOf(layoutdtl);
	if (layoutdtl.region.type == 0) {
		layoutdtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bgcolor + '; opacity:0.5; "></div>';
		layoutdtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		if (layoutdtl.bgimage != null) {
			layoutdtlhtml += '<img src="/pixsigdata/image/preview/' + layoutdtl.bgimage.filename + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
		}
		layoutdtlhtml += '</div>';
	} else if (layoutdtl.region.type == 1) {
		layoutdtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bgcolor + '; opacity:' + layoutdtl.opacity/255 + '; "></div>';
		layoutdtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		if (layoutdtl.direction == 4) {
			layoutdtlhtml += '<marquee class="layout-font" layoutdtlindex="' + layoutdtlindex + '" direction="left" behavior="scroll" scrollamount="1" scrolldelay="0" loop="-1" style="color:' + layoutdtl.color + '; font-size:12px; ">';
			layoutdtlhtml += '滚动文本';
			layoutdtlhtml += '</marquee>';
		} else {
			layoutdtlhtml += '<p class="layout-font" layoutdtlindex="' + layoutdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + layoutdtl.color + '; font-size:12px; ">';
			layoutdtlhtml += '静止文本';
			layoutdtlhtml += '</p>';
		}
		layoutdtlhtml += '</div>';
	} else if (layoutdtl.region.type == 2) {
		layoutdtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bgcolor + '; opacity:' + layoutdtl.opacity/255 + '; "></div>';
		layoutdtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		layoutdtlhtml += '<p class="layout-font" layoutdtlindex="' + layoutdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + layoutdtl.color + '; font-size:12px; ">';
		layoutdtlhtml += new Date().pattern(layoutdtl.dateformat);
		layoutdtlhtml += '</p>';
		layoutdtlhtml += '</div>';
	} else if (layoutdtl.region.type == 3) {
		layoutdtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bgcolor + '; opacity:' + layoutdtl.opacity/255 + '; "></div>';
		layoutdtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		layoutdtlhtml += '<div class="layout-font" layoutdtlindex="' + layoutdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + layoutdtl.color + '; font-size:12px; ">';
		layoutdtlhtml += '深圳 20 ~ 17℃ 多云转小雨 ';
		layoutdtlhtml += '<img src="http://api.map.baidu.com/images/weather/day/duoyun.png" />';
		layoutdtlhtml += '<img src="http://api.map.baidu.com/images/weather/night/xiaoyu.png" />';
		layoutdtlhtml += '</div>';
		layoutdtlhtml += '</div>';
	}

	layoutdtlhtml += '<div class="btn-group" style="z-index:50; opacity:0.5; ">';
	layoutdtlhtml += '<label class="btn btn-circle btn-default btn-xs">' + layoutdtl.region.name + '</label>';
	layoutdtlhtml += '</div>';
	div.html(layoutdtlhtml);

	div.draggable({
		containment: div.parent(),
		stop: regionPositionUpdate,
		drag: regionPositionUpdate
	}).resizable({
		containment: div.parent(),
		minWidth: 25,
		minHeight: 25,
		stop: function(e, ui) {
			redrawLayout($('#LayoutDiv'), CurrentLayout, CurrentLayoutdtl);
		},
		resize: regionPositionUpdate
	});
}

function refreshLayoutBgImageSelect1() {
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
				};
			},
			results: function (data, page) {
				var more = (page * 10) < data.iTotalRecords; 
				return {
					results : $.map(data.aaData, function (item) { 
						return { 
							text:item.name, 
							id:item.imageid, 
							filename:item.filename, 
						};
					}),
					more: more
				};
			}
		},
		formatResult: function (media) {
			var html = '<span><img src="/pixsigdata/image/preview/' + media.filename + '" height="25" /> ' + media.text + '</span>'
			return html;
		},
		formatSelection: function (media) {
			var html = '<span><img src="/pixsigdata/image/preview/' + media.filename + '" height="25" /> ' + media.text + '</span>'
			return html;
		},
		initSelection: function(element, callback) {
			if (CurrentLayout != null && CurrentLayout.bgimage != null) {
				callback({id: CurrentLayout.bgimage.imageid, text: CurrentLayout.bgimage.name, filename: CurrentLayout.bgimage.filename });
			}
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});
}

function refreshRegionBgImageSelect() {
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
				};
			},
			results: function (data, page) {
				var more = (page * 10) < data.iTotalRecords; 
				return {
					results : $.map(data.aaData, function (item) { 
						return { 
							text:item.name, 
							id:item.imageid, 
							filename:item.filename, 
						};
					}),
					more: more
				};
			}
		},
		formatResult: function (media) {
			var html = '<span><img src="/pixsigdata/image/preview/' + media.filename + '" height="25" /> ' + media.text + '</span>'
			return html;
		},
		formatSelection: function (media) {
			var html = '<span><img src="/pixsigdata/image/preview/' + media.filename + '" height="25" /> ' + media.text + '</span>'
			return html;
		},
		initSelection: function(element, callback) {
			if (CurrentLayoutdtl != null && CurrentLayoutdtl.bgimage != null) {
				callback({id: CurrentLayoutdtl.bgimage.imageid, text: CurrentLayoutdtl.bgimage.name, filename: CurrentLayoutdtl.bgimage.filename });
			}
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});
}


$.ajax({
	type : "GET",
	url : 'layout!regionlist.action',
	data : {},
	success : function(data, status) {
		if (data.errorcode == 0) {
			TempRegions = data.aaData;
		} else {
			bootbox.alert(common.tips.error + data.errormsg);
		}
	},
	error : function() {
		bootbox.alert(common.tips.error);
	}
});

function regionPositionUpdate(e, ui) {
	var w = $(this).width() / $('#LayoutDiv').width();
	var h = $(this).height() / $('#LayoutDiv').height();
	var l = $(this).position().left / $('#LayoutDiv').width();
	var t = $(this).position().top / $('#LayoutDiv').height();
	$(this).css("width" , (100 * parseFloat(w)) + '%');
	$(this).css("height" , (100 * parseFloat(h)) + '%');
	$(this).css("left" , (100 * parseFloat(l)) + '%');
	$(this).css("top" , (100 * parseFloat(t)) + '%');

	var layoutdtlid = $(this).attr("layoutdtlid");
	var layoutdtls = CurrentLayout.layoutdtls.filter(function (el) {
		return el.layoutdtlid == layoutdtlid;
	});
	layoutdtls[0].width = Math.round(CurrentLayout.width * w, 0);
	layoutdtls[0].height = Math.round(CurrentLayout.height * h, 0);
	layoutdtls[0].leftoffset = Math.round(CurrentLayout.width * l, 0);
	layoutdtls[0].topoffset = Math.round(CurrentLayout.height * t, 0);

	if (CurrentLayoutdtl != null && layoutdtls[0].layoutdtlid == CurrentLayoutdtl.layoutdtlid) {
		refreshSpinners();
	}
}

function regionBtnUpdate() {
	var regionbtnhtml = '';
	regionbtnhtml += '<a class="btn default btn-sm yellow" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"><i class="fa fa-plus"></i> ' + common.view.addregion + '  <i class="fa fa-angle-down"></i></a>';
	regionbtnhtml += '<ul class="dropdown-menu pull-right">';
	for (var i=0; i<TempRegions.length; i++) {
		var region = TempRegions[i];
		var layoutdtls = CurrentLayout.layoutdtls.filter(function (el) {
			return el.regionid == region.regionid;
		});
		if (layoutdtls.length > 0) {
			regionbtnhtml += '<li><a href="javascript:;" data-id="" class="btn-sm disabled-link"><span class="disable-target">'+ region.name + ' </span></a></li>';
		} else {
			regionbtnhtml += '<li><a href="javascript:;" data-id="' + i + '" class="btn-sm pix-addregion"> '+ region.name + '</a></li>';
		}
	}
	regionbtnhtml += '</ul>';
	$('#RegionBtn').empty();
	$('#RegionBtn').append(regionbtnhtml);
}

function refreshSpinners() {
	$('#spinner-x').spinner();
	$('#spinner-y').spinner();
	$('#spinner-w').spinner();
	$('#spinner-h').spinner();
	$('#spinner-x').spinner('setting', {value:parseInt(CurrentLayoutdtl.leftoffset), step: 1, min: 0, max: parseInt(CurrentLayout.width)-parseInt(CurrentLayoutdtl.width)});
	$('#spinner-y').spinner('setting', {value:parseInt(CurrentLayoutdtl.topoffset), step: 1, min: 0, max: parseInt(CurrentLayout.height)-parseInt(CurrentLayoutdtl.height)});
	$('#spinner-w').spinner('setting', {value:parseInt(CurrentLayoutdtl.width), step: 1, min: 1, max: parseInt(CurrentLayout.width)-parseInt(CurrentLayoutdtl.leftoffset)});
	$('#spinner-h').spinner('setting', {value:parseInt(CurrentLayoutdtl.height), step: 1, min: 1, max: parseInt(CurrentLayout.height)-parseInt(CurrentLayoutdtl.topoffset)});
}


FormValidateOption.rules = {};
FormValidateOption.rules['name'] = {};
FormValidateOption.rules['name']['required'] = true;
FormValidateOption.rules['name']['minlength'] = 2;
$('#LayoutEditForm').validate(FormValidateOption);

function validLayout(layout) {
	if ($('#LayoutEditForm').valid()) {
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();

		layout.name = $('#LayoutEditForm input[name=name]').attr('value');
		if ($('#LayoutBgImageSelect2').select2('data') != null) {
			layout.bgimageid =  $('#LayoutBgImageSelect2').select2('data').id;
			layout.bgimage = {};
			layout.bgimage.imageid = $('#LayoutBgImageSelect2').select2('data').id;
			layout.bgimage.name = $('#LayoutBgImageSelect2').select2('data').text;
			layout.bgimage.filename = $('#LayoutBgImageSelect2').select2('data').filename;
		}
		layout.description = $('#LayoutEditForm textarea').val();
		return true;
	}
	return false;
}

function validLayoutdtl(layoutdtl) {
	if ($('#LayoutdtlEditForm').valid()) {
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();

		layoutdtl.intervaltime = $('#LayoutdtlEditForm input[name=intervaltime]').attr('value');
		layoutdtl.fitflag = $('#LayoutdtlEditForm input[name=fitflag]:checked').attr('value');
		layoutdtl.volume = $('#LayoutdtlEditForm input[name=volume]').attr('value');
		layoutdtl.direction = $('#LayoutdtlEditForm input[name=direction]:checked').attr('value');
		layoutdtl.speed = $('#LayoutdtlEditForm input[name=speed]:checked').attr('value');
		layoutdtl.color = $('#LayoutdtlEditForm input[name=color]').attr('value');
		layoutdtl.size = $('#LayoutdtlEditForm input[name=size]').attr('value');
		layoutdtl.dateformat = $('#LayoutdtlEditForm select[name=dateformat]').val();

		if ($('#RegionBgImageSelect').select2('data') != null) {
			layoutdtl.bgimageid =  $('#RegionBgImageSelect').select2('data').id;
			layoutdtl.bgimage = {};
			layoutdtl.bgimage.imageid = $('#RegionBgImageSelect').select2('data').id;
			layoutdtl.bgimage.name = $('#RegionBgImageSelect').select2('data').text;
			layoutdtl.bgimage.filename = $('#RegionBgImageSelect').select2('data').filename;
		}
		layoutdtl.bgcolor = $('#LayoutdtlEditForm input[name=bgcolor]').attr('value');
		layoutdtl.opacity = $('#LayoutdtlEditForm input[name=opacity]').attr('value');
		layoutdtl.zindex = $('#LayoutdtlEditForm input[name=zindex]:checked').attr('value');

		return true;
	}
	return false;
}

function enterLayoutdtlFocus(layoutdtl) {
	redrawLayout($('#LayoutDiv'), CurrentLayout, layoutdtl);
	$('#LayoutEditForm').css('display' , 'none');
	$('#LayoutdtlEditForm').css('display' , 'block');
	$('.layoutdtl-title').html(layoutdtl.region.name);
	if (layoutdtl.region.type == 0) {
		$('.textflag').css("display", "none");
		$('.dateflag').css("display", "none");
		$('.weatherflag').css("display", "none");
		$('.nontextflag').css("display", "block");
	} else if (layoutdtl.region.type == 1) {
		$('.nontextflag').css("display", "none");
		$('.dateflag').css("display", "none");
		$('.weatherflag').css("display", "none");
		$('.textflag').css("display", "block");
	} else if (layoutdtl.region.type == 2) {
		$('.nontextflag').css("display", "none");
		$('.textflag').css("display", "none");
		$('.weatherflag').css("display", "none");
		$('.dateflag').css("display", "block");
	} else if (layoutdtl.region.type == 3) {
		$('.nontextflag').css("display", "none");
		$('.textflag').css("display", "none");
		$('.dateflag').css("display", "none");
		$('.weatherflag').css("display", "block");
	}
	$('#LayoutdtlEditForm').loadJSON(layoutdtl);
	$('.colorPick').colorpicker();
	$('.colorPick').colorpicker('setValue', layoutdtl.color);
	$('.bgcolorPick').colorpicker();
	$('.bgcolorPick').colorpicker('setValue', layoutdtl.bgcolor);
	$(".intervalRange").ionRangeSlider({
		min: 5,
		max: 60,
		from: 10,
		type: 'single',
		step: 5,
		hasGrid: false
	});
	$(".intervalRange").ionRangeSlider("update", {
		from: layoutdtl.intervaltime
	});
	$(".sizeRange").ionRangeSlider({
		min: 10,
		max: 100,
		from: 50,
		type: 'single',
		step: 10,
		hasGrid: false,
		onChange: function(data) {
			CurrentLayoutdtl.size = $('#LayoutdtlEditForm input[name=size]').attr('value');
			redrawLayout($('#LayoutDiv'), CurrentLayout, CurrentLayoutdtl);
		}
	});
	$(".sizeRange").ionRangeSlider("update", {
		from: layoutdtl.size
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
		from: layoutdtl.volume
	});
	$(".opacityRange").ionRangeSlider({
		min: 0,
		max: 255,
		from: 255,
		type: 'single',
		step: 5,
		hasGrid: false,
		onChange: function(data) {
			CurrentLayoutdtl.opacity = $('#LayoutdtlEditForm input[name=opacity]').attr('value');
			redrawLayout($('#LayoutDiv'), CurrentLayout, CurrentLayoutdtl);
		}
	});
	$(".opacityRange").ionRangeSlider("update", {
		from: layoutdtl.opacity
	});
	refreshSpinners();
	refreshRegionBgImageSelect();	
}

$('#LayoutDiv').click(function(e){
	var scale = CurrentLayout.width / $('#LayoutDiv').width();
	var offset = $(this).offset();
	var posX = (e.pageX - offset.left) * scale;
	var posY = (e.pageY - offset.top) * scale;
	var layoutdtls = CurrentLayout.layoutdtls.filter(function (el) {
		var width = parseInt(el.width);
		var height = parseInt(el.height);
		var leftoffset = parseInt(el.leftoffset);
		var topoffset = parseInt(el.topoffset);
		return (posX > leftoffset) && (posX < (leftoffset + width)) && (posY > topoffset) && (posY < (topoffset + height));
	});
	if (layoutdtls.length > 0) {
		layoutdtls.sort(function(a, b) {
			return (a.width + a.height - b.width - b.height);
		});
		/*
		var index = 10000;
		for (var i=0; i<layoutdtls.length; i++) {
			if (CurrentLayoutdtl != null && CurrentLayoutdtl.regionid == layoutdtls[i].regionid) {
				index = i;
				break;
			}
		}
		var oldLayoutdtl = CurrentLayoutdtl;
		if (index >= (layoutdtls.length -1)) {
			CurrentLayoutdtl = layoutdtls[0];
		} else {
			CurrentLayoutdtl = layoutdtls[index+1];
		}*/

		if (CurrentLayoutdtl == null && validLayout(CurrentLayout) || CurrentLayoutdtl != null && validLayoutdtl(CurrentLayoutdtl)) {
			CurrentLayoutdtl = layoutdtls[0];
			enterLayoutdtlFocus(CurrentLayoutdtl);
		}
	}
});

$('#RegionBgImageSelect').on('change', function(e) {
	if ($('#RegionBgImageSelect').select2('data') != null) {
		CurrentLayoutdtl.bgimageid = $('#RegionBgImageSelect').select2('data').id;
		CurrentLayoutdtl.bgimage = {};
		CurrentLayoutdtl.bgimage.imageid = $('#RegionBgImageSelect').select2('data').id;
		CurrentLayoutdtl.bgimage.name = $('#RegionBgImageSelect').select2('data').text;
		CurrentLayoutdtl.bgimage.filename = $('#RegionBgImageSelect').select2('data').filename;
	}
	redrawLayout($('#LayoutDiv'), CurrentLayout, CurrentLayoutdtl);
});	
$('#RegionBgImageRemove').on('click', function(e) {
	$('#RegionBgImageSelect').select2('val', '');
	CurrentLayoutdtl.bgimageid = 0;
	CurrentLayoutdtl.bgimage = null;
	redrawLayout($('#LayoutDiv'), CurrentLayout, CurrentLayoutdtl);
});	

$('#LayoutBgImageSelect2').on('change', function(e) {
	if ($('#LayoutBgImageSelect2').select2('data') != null) {
		CurrentLayout.bgimageid =  $('#LayoutBgImageSelect2').select2('data').id;
		CurrentLayout.bgimage = {};
		CurrentLayout.bgimage.imageid = $('#LayoutBgImageSelect2').select2('data').id;
		CurrentLayout.bgimage.name = $('#LayoutBgImageSelect2').select2('data').text;
		CurrentLayout.bgimage.filename = $('#LayoutBgImageSelect2').select2('data').filename;
	}
	redrawLayout($('#LayoutDiv'), CurrentLayout, CurrentLayoutdtl);
});	
$('#LayoutBgImageRemove').on('click', function(e) {
	$('#LayoutBgImageSelect2').select2('val', '');
	CurrentLayout.bgimageid = 0;
	CurrentLayout.bgimage = null;
	redrawLayout($('#LayoutDiv'), CurrentLayout, CurrentLayoutdtl);
});	

$('#spinner-x,#spinner-y,#spinner-w,#spinner-h').on("change", function(e) {
	CurrentLayoutdtl.leftoffset = $('#spinner-x').spinner('value');
	CurrentLayoutdtl.topoffset = $('#spinner-y').spinner('value');
	CurrentLayoutdtl.width = $('#spinner-w').spinner('value');
	CurrentLayoutdtl.height = $('#spinner-h').spinner('value');
	redrawLayout($('#LayoutDiv'), CurrentLayout, CurrentLayoutdtl);
	refreshSpinners();
});	

$("#LayoutdtlEditForm input,select").on("change", function(e) {
	CurrentLayoutdtl.intervaltime = $('#LayoutdtlEditForm input[name=intervaltime]').attr('value');
	CurrentLayoutdtl.fitflag = $('#LayoutdtlEditForm input[name=fitflag]:checked').attr('value');
	CurrentLayoutdtl.volume = $('#LayoutdtlEditForm input[name=volume]').attr('value');
	CurrentLayoutdtl.direction = $('#LayoutdtlEditForm input[name=direction]:checked').attr('value');
	CurrentLayoutdtl.speed = $('#LayoutdtlEditForm input[name=speed]:checked').attr('value');
	CurrentLayoutdtl.color = $('#LayoutdtlEditForm input[name=color]').attr('value');
	CurrentLayoutdtl.size = $('#LayoutdtlEditForm input[name=size]').attr('value');
	CurrentLayoutdtl.dateformat = $('#LayoutdtlEditForm select[name=dateformat]').val();
	CurrentLayoutdtl.bgcolor = $('#LayoutdtlEditForm input[name=bgcolor]').attr('value');
	CurrentLayoutdtl.opacity = $('#LayoutdtlEditForm input[name=opacity]').attr('value');
	CurrentLayoutdtl.zindex = $('#LayoutdtlEditForm input[name=zindex]:checked').attr('value');
	redrawLayout($('#LayoutDiv'), CurrentLayout, CurrentLayoutdtl);
});

//================================设计对话框=========================================
//在设计对话框中新增区域
$('body').on('click', '.pix-addregion', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	
	var layoutdtl = {};
	layoutdtl.layoutdtlid = 'R' + Math.round(Math.random()*100000000);
	layoutdtl.layoutid = CurrentLayoutid;
	layoutdtl.region = TempRegions[index];
	layoutdtl.regionid = TempRegions[index].regionid;
	layoutdtl.leftoffset = CurrentLayout.height * 0.1;
	layoutdtl.topoffset = CurrentLayout.width * 0.1;
	layoutdtl.width = CurrentLayout.width * 0.2;
	layoutdtl.height = CurrentLayout.height * 0.2;
	if (layoutdtl.region.type == 0) {
		layoutdtl.zindex = 1;
	} else {
		layoutdtl.zindex = 2;
	}
	layoutdtl.bgimageid = 0;
	layoutdtl.bgcolor = '#000000';
	if (CurrentLayout.bgimage != null) {
		layoutdtl.opacity = 0;
	} else {
		layoutdtl.opacity = 255;
	}
	layoutdtl.intervaltime = 10;
	layoutdtl.fitflag = 1;
	layoutdtl.volume = 50;
	layoutdtl.direction = 4;
	layoutdtl.speed = 2;
	layoutdtl.color = '#FFFFFF';
	layoutdtl.size = 50;
	layoutdtl.dateformat = 'yyyy-MM-dd HH:mm';
	CurrentLayout.layoutdtls[CurrentLayout.layoutdtls.length] = layoutdtl;
	
	redrawLayout($('#LayoutDiv'), CurrentLayout, CurrentLayoutdtl);
	regionBtnUpdate();
});

$('body').on('click', '.pix-region-delete', function(event) {
	if (CurrentLayoutdtl.region.regionid == 1) {
		bootbox.alert(common.tips.region_remove_failed);
		return;
	}
	bootbox.confirm(common.tips.remove + CurrentLayoutdtl.region.name, function(result) {
		if (result == true) {
			CurrentLayout.layoutdtls.splice(CurrentLayout.layoutdtls.indexOf(CurrentLayoutdtl), 1);
			CurrentLayoutdtl = CurrentLayout.layoutdtls[0];
			regionBtnUpdate();
			enterLayoutdtlFocus(CurrentLayoutdtl);
		}
	 });
});

