var RegionColors = [];
RegionColors['0'] = '#BCC2F2';
RegionColors['1'] = '#99CCFF';
RegionColors['2'] = '#CCCC99';
RegionColors['3'] = '#CCCC99';
RegionColors['4'] = '#FFCCCC';
RegionColors['5'] = '#FF99CC';
RegionColors['6'] = '#CC99CC';
RegionColors['7'] = '#FFFF99';
RegionColors['A1'] = '#CC9966';
RegionColors['A2'] = '#CC9966';

function refreshMediaTable() {
	$('#IntVideoTable').dataTable()._fnAjaxUpdate();
	$('#ExtVideoTable').dataTable()._fnAjaxUpdate();
	$('#ImageTable').dataTable()._fnAjaxUpdate();
}

function redrawBundle(div, templet, templetdtl) {
	div.empty();
	div.css('position', 'relative');
	div.css('margin-left', 'auto');
	div.css('margin-right', 'auto');
	div.css('border', '1px solid #000');
	if (templet.bgimage != null) {
		div.append('<img class="layout-bg" src="/pixsigdata' + templet.bgimage.thumbnail + '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
	}
	for (var i=0; i<templet.templetdtls.length; i++) {
		div.append('<div id="BundledtlDiv' + templet.templetdtls[i].templetdtlid + '"></div>');
		if (templetdtl != null && templetdtl.templetdtlid == templet.templetdtls[i].templetdtlid) {
			redrawBundledtl($('#BundledtlDiv' + templet.templetdtls[i].templetdtlid), templet, templet.templetdtls[i], true);
		} else {
			redrawBundledtl($('#BundledtlDiv' + templet.templetdtls[i].templetdtlid), templet, templet.templetdtls[i], false);
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

function redrawBundledtl(div, templet, templetdtl, selected) {
	div.empty();
	div.attr("class", "region");
	div.attr('templetdtlid', templetdtl.templetdtlid);
	div.css('position', 'absolute');
	div.css('width', 100*templetdtl.width/templet.width + '%');
	div.css('height', 100*templetdtl.height/templet.height + '%');
	div.css('top', 100*templetdtl.topoffset/templet.height + '%');
	div.css('left', 100*templetdtl.leftoffset/templet.width + '%');

	var bgimage = '';
	if (templetdtl.bgimage != null) {
		bgimage = '/pixsigdata' + templetdtl.bgimage.thumbnail;
	} else if (templetdtl.mainflag == 1) {
		bgimage = '../img/region/region-play-main.jpg';
	} else if (templetdtl.type == '0') {
		bgimage = '../img/region/region-play.jpg';
	} else if (templetdtl.type == '4') {
		bgimage = '../img/region/region-videoin.jpg';
	} else if (templetdtl.type == '5') {
		bgimage = '../img/region/region-dvb.jpg';
	} else if (templetdtl.type == '6') {
		bgimage = '../img/region/region-stream.jpg';
	} else if (templetdtl.type == '8') {
		if (templetdtl.width > templetdtl.height) {
			bgimage = '../img/region/region-navigate-h.jpg';
		} else {
			bgimage = '../img/region/region-navigate-v.jpg';
		}
	} else if (templetdtl.type == '9') {
		bgimage = '../img/region/region-qrcode.jpg';
	}
	if (templetdtl.type == '0') {
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

	var text = "";
	if (templetdtl.objtype == 2) {
		text = templetdtl.text.text;
	}
	
	var templetdtlhtml = '';
	var border = '1px solid #000000';
	if (selected) {
		border = '3px solid #FF0000';
	}
	var templetdtlindex = templet.templetdtls.indexOf(templetdtl);
	if (templetdtl.type == '0' || templetdtl.type == '4' || templetdtl.type == '5' || templetdtl.type == '6' || templetdtl.type == '8' || templetdtl.type == '9') {
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + templetdtl.bgcolor + '; opacity:' + templetdtl.opacity/255 + '; "></div>';
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		templetdtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
		templetdtlhtml += '</div>';
	} else if (templetdtl.type == '1') {
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + templetdtl.bgcolor + '; opacity:' + templetdtl.opacity/255 + '; "></div>';
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		if (templetdtl.direction == 4) {
			templetdtlhtml += '<marquee class="templet-font" templetdtlindex="' + templetdtlindex + '" direction="left" behavior="scroll" scrollamount="1" scrolldelay="0" loop="-1" style="color:' + templetdtl.color + '; font-size:12px; ">';
			templetdtlhtml += text;
			templetdtlhtml += '</marquee>';
		} else {
			templetdtlhtml += '<p class="templet-font" templetdtlindex="' + templetdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + templetdtl.color + '; font-size:12px; ">';
			templetdtlhtml += text;
			templetdtlhtml += '</p>';
		}
		templetdtlhtml += '</div>';
	} else if (templetdtl.type == '2') {
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + templetdtl.bgcolor + '; opacity:' + templetdtl.opacity/255 + '; "></div>';
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		templetdtlhtml += '<p class="templet-font" templetdtlindex="' + templetdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + templetdtl.color + '; font-size:12px; ">';
		templetdtlhtml += new Date().pattern(templetdtl.dateformat);
		templetdtlhtml += '</p>';
		templetdtlhtml += '</div>';
	} else if (templetdtl.type == '3') {
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + templetdtl.bgcolor + '; opacity:' + templetdtl.opacity/255 + '; "></div>';
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		templetdtlhtml += '<div class="templet-font" templetdtlindex="' + templetdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + templetdtl.color + '; font-size:12px; ">';
		templetdtlhtml += '深圳 20 ~ 17℃ 多云转小雨 ';
		templetdtlhtml += '<img src="http://api.map.baidu.com/images/weather/day/duoyun.png" />';
		templetdtlhtml += '<img src="http://api.map.baidu.com/images/weather/night/xiaoyu.png" />';
		templetdtlhtml += '</div>';
		templetdtlhtml += '</div>';
	} else if (templetdtl.type == '7') {
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + templetdtl.bgcolor + '; opacity:' + templetdtl.opacity/255 + '; "></div>';
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		if (bgimage != '') {
			templetdtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
		}
		templetdtlhtml += '<p class="templet-font" templetdtlindex="' + templetdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + templetdtl.color + '; font-size:12px; ">';
		if (templetdtl.touchlabel != null) {
			templetdtlhtml += templetdtl.touchlabel;
		} else {
			templetdtlhtml += eval('common.view.region_type_7');
		}
		templetdtlhtml += '</p>';
		templetdtlhtml += '</div>';
	} else {
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + templetdtl.bgcolor + '; opacity:' + templetdtl.opacity/255 + '; "></div>';
		templetdtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		templetdtlhtml += '<p class="templet-font" templetdtlindex="' + templetdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + templetdtl.color + '; font-size:12px; ">';
		templetdtlhtml += eval('common.view.region_mainflag_' + templetdtl.mainflag) + eval('common.view.region_type_' + templetdtl.type);
		templetdtlhtml += '</p>';
		templetdtlhtml += '</div>';
	}
	div.html(templetdtlhtml);
}

function generateBundledtlHtml(templetdtl) {
	var templetdtlhtml = '';
	templetdtlhtml += '<div id="templetdtl_' + templetdtl.templetdtlid + '" regionenabled="1" templetdtlid="' + templetdtl.templetdtlid + '" name="' + eval('common.view.region_mainflag_' + templetdtl.mainflag) + eval('common.view.region_type_' + templetdtl.type) + '"';
	templetdtlhtml += 'ondblclick="" ';
	templetdtlhtml += 'class="region" ';
	templetdtlhtml += 'style="position: absolute; width:' + 100*templetdtl.width/CurrentTemplet.width + '%; height:' + 100*templetdtl.height/CurrentTemplet.height + '%; top: ' + 100*templetdtl.topoffset/CurrentTemplet.height + '%; left: ' + 100*templetdtl.leftoffset/CurrentTemplet.width + '%;">';
	templetdtlhtml += ' <div id="templetdtl_bg_' + templetdtl.templetdtlid + '" style="position:absolute; width:100%; height:100%; background-color:' + RegionColors[templetdtl.type] + '; opacity:.80; filter:alpha(opacity=80);">';
	if (templetdtl.bgimage != null) {
		templetdtlhtml += '<img src="/pixsigdata' + templetdtl.bgimage.thumbnail+ '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
	}
	templetdtlhtml += '<div id="templetdtl_selected_' + templetdtl.templetdtlid + '" width="100%" height="100%" style="display:none;position:absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0; background-color:#696969; opacity:.80; filter:alpha(opacity=80);" />';
	templetdtlhtml += '</div>';

	templetdtlhtml += '</div>';

	return templetdtlhtml;
}


function validBundledtl(templetdtl) {
	if ($('#BundledtlEditForm').valid()) {
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();

		if (CurrentTempletdtl.type == 0) {
			var objtype = $('#BundledtlEditForm input[name="templetdtl.objtype"]:checked').val();
			if (objtype == undefined) {
				objtype = 0;
			}
			if (objtype == 1) {
				templetdtl.objid = templetdtl.medialist.medialistid;
			} else if (objtype == 5) {
				templetdtl.widget.url = $('#BundledtlEditForm input[name="templetdtl.widget.url"]').val();
				templetdtl.objid = templetdtl.widget.widgetid;
			}
			templetdtl.objtype = objtype;
		} else if (CurrentTempletdtl.type == 1) {
			templetdtl.text.text = $('#BundledtlEditForm textarea[name="templetdtl.text.text"]').val();
			templetdtl.objtype = 2;
			templetdtl.objid = templetdtl.text.textid;
		} else if (CurrentTempletdtl.type == 5) {
			templetdtl.dvb = $('#BundledtlSelect').select2('data').dvb;
			templetdtl.objtype = 6;
			templetdtl.objid = $('#BundledtlSelect').val();
		} else if (CurrentTempletdtl.type == 6) {
			templetdtl.objtype = 1;
			templetdtl.objid = templetdtl.medialist.medialistid;
		} else if (CurrentTempletdtl.type == 7) {
			templetdtl.touchlabel = $('#BundledtlEditForm input[name="templetdtl.touchlabel"]').val();
			templetdtl.touchtype = $('#BundledtlEditForm input[name="templetdtl.touchtype"]:checked').val();
			if (templetdtl.touchtype == 2 && $('#SubBundleSelect').select2('data') != null) {
				templetdtl.touchtempletid = $('#SubBundleSelect').select2('data').id;
			}
			if (templetdtl.touchtype == 4) {
				templetdtl.touchapk = $('#BundledtlEditForm input[name="templetdtl.touchapk"]').val();
			}
			if (templetdtl.touchtype == 3) {
				var objtype = $('#BundledtlEditForm input[name="templetdtl.objtype"]:checked').val();
				if (objtype == undefined) {
					objtype = 0;
				}
				if (objtype == 1) {
					templetdtl.objid = templetdtl.medialist.medialistid;
				} else if (objtype == 5) {
					templetdtl.widget.url = $('#BundledtlEditForm input[name="templetdtl.widget.url"]').val();
					templetdtl.objid = templetdtl.widget.widgetid;
				}
				templetdtl.objtype = objtype;
			} else {
				templetdtl.objtype = 0;
				templetdtl.objid = 0;
			}
		} else if (CurrentTempletdtl.type == 12) {
			templetdtl.rss.url = $('#BundledtlEditForm input[name="templetdtl.rss.url"]').val();
			templetdtl.objtype = 7;
			templetdtl.objid = templetdtl.rss.rssid;
		} else if (CurrentTempletdtl.type == 13) {
			templetdtl.objtype = 1;
			templetdtl.objid = templetdtl.medialist.medialistid;
		}
		
		return true;
	}
	return false;
}

function enterBundledtlFocus(templetdtl) {
	redrawBundle($('#BundleDiv'), CurrentTemplet, templetdtl);
	$('#BundledtlEditForm').css('display' , 'block');
	$('.templetdtl-title').html(eval('common.view.region_mainflag_' + templetdtl.mainflag) + eval('common.view.region_type_' + templetdtl.type));
	
	var objtype = $('#BundledtlEditForm input[name="templetdtl.objtype"]:checked').val();
	$('input[name="templetdtl.objtype"][value="' + objtype + '"]').attr('checked', false);
	$('input[name="templetdtl.objtype"][value="' + objtype + '"]').parent().removeClass('checked');
	$('input[name="templetdtl.objtype"][value="' + templetdtl.objtype + '"]').attr('checked', true);
	$('input[name="templetdtl.objtype"][value="' + templetdtl.objtype + '"]').parent().addClass('checked');
	var touchtype = $('#BundledtlEditForm input[name="templetdtl.touchtype"]:checked').val();
	$('input[name="templetdtl.touchtype"][value="' + touchtype + '"]').attr('checked', false);
	$('input[name="templetdtl.touchtype"][value="' + touchtype + '"]').parent().removeClass('checked');
	$('input[name="templetdtl.touchtype"][value="' + templetdtl.touchtype + '"]').attr('checked', true);
	$('input[name="templetdtl.touchtype"][value="' + templetdtl.touchtype + '"]').parent().addClass('checked');

	if (CurrentTempletdtl.objtype == 2) {
		$('#BundledtlEditForm textarea[name="templetdtl.text.text"]').val(CurrentTempletdtl.text.text);
	} else if (CurrentTempletdtl.objtype == 3) {
		$('#BundledtlEditForm input[name="templetdtl.stream.url"]').val(CurrentTempletdtl.stream.url);
	} else if (CurrentTempletdtl.objtype == 5) {
		$('#BundledtlEditForm input[name="templetdtl.widget.url"]').val(CurrentTempletdtl.widget.url);
	} else if (CurrentTempletdtl.objtype == 7) {
		$('#BundledtlEditForm input[name="templetdtl.rss.url"]').val(CurrentTempletdtl.rss.url);
	}

	$('#BundledtlEditForm input[name="templetdtl.touchlabel"]').val(CurrentTempletdtl.touchlabel);
	$('#BundledtlEditForm input[name="templetdtl.touchapk"]').val(CurrentTempletdtl.touchapk);
	
	refreshBundledtlEdit();
	refreshBundledtlSelect();
	refreshSubBundleSelect();
	refreshMedialistDtl();
}

function refreshBundledtlEdit() {
	$('.templet-ctl').css("display", "none");
	if (CurrentTemplet.homeflag == 0) {
		$('.homeflag-0').css("display", "block");
	}
	if (CurrentTempletdtl.type == 0) {
		$('.regiontype-0').css("display", "block");
		$('#IntVideoTable').dataTable()._fnAjaxUpdate();
		if ($('#BundledtlEditForm input[name="templetdtl.objtype"]:checked').val() == 1) {
			$('.objtype-5').css("display", "none");
		} else if ($('#BundledtlEditForm input[name="templetdtl.objtype"]:checked').val() == 5) {
			$('.objtype-1').css("display", "none");
		}
	} else if (CurrentTempletdtl.type == 1) {
		$('.regiontype-1').css("display", "block");
	} else if (CurrentTempletdtl.type == 5) {
		$('.regiontype-5').css("display", "block");
	} else if (CurrentTempletdtl.type == 6) {
		$('.regiontype-6').css("display", "block");
	} else if (CurrentTempletdtl.type == 7) {
		$('.regiontype-7').css("display", "block");
		var touchtype = $('#BundledtlEditForm input[name="templetdtl.touchtype"]:checked').val();
		if (touchtype == 2) {
			$('.touchtype-3').css("display", "none");
			$('.touchtype-4').css("display", "none");
		} else if (touchtype == 3) {
			$('.touchtype-2').css("display", "none");
			$('.touchtype-4').css("display", "none");
			$('#IntVideoTable').dataTable()._fnAjaxUpdate();
			if ($('#BundledtlEditForm input[name="templetdtl.objtype"]:checked').val() == undefined) {
				$('#BundledtlEditForm input[name="templetdtl.objtype"][value="1"]').attr('checked', true);
				$('#BundledtlEditForm input[name="templetdtl.objtype"][value="1"]').parent().addClass('checked');
			}
			if ($('#BundledtlEditForm input[name="templetdtl.objtype"]:checked').val() == 1) {
				$('.objtype-5').css("display", "none");
			} else if ($('#BundledtlEditForm input[name="templetdtl.objtype"]:checked').val() == 5) {
				$('.objtype-1').css("display", "none");
			}
		} else if (touchtype == 4) {
			$('.touchtype-2').css("display", "none");
			$('.touchtype-3').css("display", "none");
		} else {
			$('.touchtype-2').css("display", "none");
			$('.touchtype-3').css("display", "none");
			$('.touchtype-4').css("display", "none");
		}
	} else if (CurrentTempletdtl.type == 12) {
		$('.regiontype-12').css("display", "block");
	} else if (CurrentTempletdtl.type == 13) {
		$('.regiontype-13').css("display", "block");
	}

    FormValidateOption.rules = {};
	if (CurrentTempletdtl.type == 0 && $('#BundledtlEditForm input[name="templetdtl.objtype"]:checked').val() == 5) {
    	FormValidateOption.rules['templetdtl.widget.url'] = {};
    	FormValidateOption.rules['templetdtl.widget.url']['required'] = true;
    } else if (CurrentTempletdtl.type == 1) {
    	FormValidateOption.rules['templetdtl.text.text'] = {};
    	FormValidateOption.rules['templetdtl.text.text']['required'] = true;
    } else if (CurrentTempletdtl.type == 5) {
    	FormValidateOption.rules['templetdtl.objid'] = {};
    	FormValidateOption.rules['templetdtl.objid']['required'] = true;
    } else if (CurrentTempletdtl.type == 7 && $('#BundledtlEditForm input[name="templetdtl.touchtype"]:checked').val() == 4) {
    	FormValidateOption.rules['templetdtl.touchapk'] = {};
    	FormValidateOption.rules['templetdtl.touchapk']['required'] = true;
    } else if (CurrentTempletdtl.type == 12) {
    	FormValidateOption.rules['templetdtl.rss.url'] = {};
    	FormValidateOption.rules['templetdtl.rss.url']['required'] = true;
	}
	$('#BundledtlEditForm').validate(FormValidateOption);
    $.extend($("#BundledtlEditForm").validate().settings, {
		rules: FormValidateOption.rules
	});
}

function refreshBundledtlSelect() {
	if (CurrentTempletdtl.type != 5 ) {
		return;
	}
	var url;
	if ($('input[name="templetdtl.objtype"]:checked').val() == 1) {
		url = 'medialist!list.action';
	} else if ($('input[name="templetdtl.objtype"]:checked').val() == 2) {
		url = 'text!list.action';
	} else if ($('input[name="templetdtl.objtype"]:checked').val() == 3) {
		url = 'stream!list.action';
	} else if ($('input[name="templetdtl.objtype"]:checked').val() == 5) {
		url = 'widget!list.action';
	} else if (CurrentTempletdtl.type == 5) {
		url = 'dvb!list.action';
	} else if (CurrentTempletdtl.type == 12) {
		url = 'rss!list.action';
	}
	$('#BundledtlSelect').select2({
		placeholder: common.tips.detail_select,
		//minimumResultsForSearch: -1,
		minimumInputLength: 0,
		ajax: { 
			url: url,
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
						if (item.medialistid) {
							return {
								name:item.name, 
								id:item.medialistid,
								medialist:item
							};
						} else if (item.textid) {
							return {
								name:item.name, 
								id:item.textid,
								text:item
							};
						} else if (item.streamid) {
							return {
								name:item.name + '(' + item.url + ')', 
								id:item.streamid,
								stream:item
							};
						} else if (item.widgetid) {
							return {
								name:item.name + '(' + item.url + ')', 
								id:item.widgetid,
								widget:item
							};
						} else if (item.dvbid) {
							return {
								name:item.name, 
								id:item.dvbid,
								dvb:item
							};
						} else if (item.rssid) {
							return {
								name:item.name, 
								id:item.rssid,
								rss:item
							};
						}
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
	if (CurrentTempletdtl.type == 5) {
		if (CurrentTempletdtl.dvb != null) {
			$('#BundledtlSelect').select2('data', {id: CurrentTempletdtl.dvb.dvbid, name: CurrentTempletdtl.dvb.name, dvb: CurrentTempletdtl.dvb });
		}
	} 
}

function refreshSubBundleSelect() {
	if ($('#BundledtlEditForm input[name="templetdtl.touchtype"]:checked').val() != 2 && CurrentTempletdtl.type != 7 ) {
		return;
	}
	
	var data = [];
	if (CurrentSubTemplets != null) {
		for (var i=0; i<CurrentSubTemplets.length; i++) {
			data.push({
				id: CurrentSubTemplets[i].templetid,
				name: CurrentSubTemplets[i].name,
				templet: CurrentSubTemplets[i]
			})
		}
	}
	
	$('#SubBundleSelect').select2({
		placeholder: common.tips.detail_select,
		//minimumResultsForSearch: -1,
		minimumInputLength: 0,
		data: data,
		formatResult: function (item) {
			if (item.templet != null && item.templet.snapshot != null) {
				return '<span><img src="/pixsigdata' + item.templet.snapshot + '" height="25" /> ' + item.name + '</span>';
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
	if ($('input[name="templetdtl.touchtype"]:checked').val() == 2) {
		var touchtemplets = CurrentSubTemplets.filter(function (el) {
			return el.templetid == CurrentTempletdtl.touchtempletid;
		});
		console.log(touchtemplets.length);
		if (touchtemplets.length > 0) {
			$('#SubBundleSelect').select2('data', {id: touchtemplets[0].templetid, name: touchtemplets[0].name, templet: touchtemplets[0] });
		}
	}
}

function refreshMedialistDtl() {
	if (CurrentTempletdtl.type == 0 || CurrentTempletdtl.type == 7) {
		if ($('input[name="templetdtl.objtype"]:checked').val() == 1) {
			$('#MedialistDtlTable').dataTable().fnClearTable();
			for (var i=0; i<CurrentTempletdtl.medialist.medialistdtls.length; i++) {
				var medialistdtl = CurrentTempletdtl.medialist.medialistdtls[i];
				var thumbwidth = 100;
				var thumbnail = '';
				var thumbhtml = '';
				var medianame = '';
				if (medialistdtl.objtype == 1 && medialistdtl.video.type == 1) {
					mediatype = common.view.intvideo;
					medianame = medialistdtl.video.name;
					if (medialistdtl.video.thumbnail == null) {
						thumbnail = '../img/video.jpg';
					} else {
						thumbnail = '/pixsigdata' + medialistdtl.video.thumbnail;
					}
				} else if (medialistdtl.objtype == 1 && medialistdtl.video.type == 2) {
					mediatype = common.view.extvideo;
					medianame = medialistdtl.video.name;
					if (medialistdtl.video.thumbnail == null) {
						thumbnail = '../img/video.jpg';
					} else {
						thumbnail = '/pixsigdata' + medialistdtl.video.thumbnail;
					}
				} else if (medialistdtl.objtype == 2) {
					mediatype = common.view.image;
					medianame = medialistdtl.image.name;
					thumbwidth = medialistdtl.image.width > medialistdtl.image.height? 100 : 100*medialistdtl.image.width/medialistdtl.image.height;
					thumbnail = '/pixsigdata' + medialistdtl.image.thumbnail;
				} else {
					mediatype = common.view.unknown;
				}
				if (thumbnail != '') {
					thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + medianame + '"></div>';
				}
				$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, mediatype, thumbhtml, medianame, 0, 0, 0]);
			}
		}
	} else if (CurrentTempletdtl.type == 6) {
		$('#StreamTable2').dataTable().fnClearTable();
		for (var i=0; i<CurrentTempletdtl.medialist.medialistdtls.length; i++) {
			var medialistdtl = CurrentTempletdtl.medialist.medialistdtls[i];
			if (medialistdtl.stream != null) {
				var html = '<div class="pix-title">' + medialistdtl.stream.name + '</div>';
				$('#StreamTable2').dataTable().fnAddData([medialistdtl.sequence, 'Stream', html, 0, 0, 0]);
			}
		}
	} else if (CurrentTempletdtl.type == 13) {
		$('#AudioTable2').dataTable().fnClearTable();
		for (var i=0; i<CurrentTempletdtl.medialist.medialistdtls.length; i++) {
			var medialistdtl = CurrentTempletdtl.medialist.medialistdtls[i];
			if (medialistdtl.audio != null) {
				var html = '<div class="pix-title">' + medialistdtl.audio.name + '</div>';
				$('#AudioTable2').dataTable().fnAddData([medialistdtl.sequence, 'Audio', html, 0, 0, 0]);
			}
		}
	}
}

$('#BundleDiv').click(function(e){
	var scale = CurrentTemplet.width / $('#BundleDiv').width();
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
		if (CurrentTempletdtl == null || CurrentTempletdtl != null && validBundledtl(CurrentTempletdtl)) {
			//CurrentTempletdtl = templetdtls[0];
			var index = 10000;
			for (var i=0; i<templetdtls.length; i++) {
				if (CurrentTempletdtl != null && CurrentTempletdtl.templetdtlid == templetdtls[i].templetdtlid) {
					index = i;
					break;
				}
			}
			var oldBundledtl = CurrentTempletdtl;
			if (index >= (templetdtls.length -1)) {
				CurrentTempletdtl = templetdtls[0];
			} else {
				CurrentTempletdtl = templetdtls[index+1];
			}
			enterBundledtlFocus(CurrentTempletdtl);
		}
	}
});

$('#BundledtlEditForm input[name="templetdtl.objtype"]').change(function(e) {
	refreshBundledtlEdit();
	refreshBundledtlSelect();
	refreshMedialistDtl();
	$('#BundledtlSelect').select2('data', {});
	if (validBundledtl(CurrentTempletdtl)) {
		redrawBundle($('#BundleDiv'), CurrentTemplet, CurrentTempletdtl);
	}
});

$('#BundledtlSelect').on('change', function(e) {
	if (validBundledtl(CurrentTempletdtl)) {
		redrawBundle($('#BundleDiv'), CurrentTemplet, CurrentTempletdtl);
	}
});	

$('#BundledtlEditForm input[name="templetdtl.touchtype"]').change(function(e) {
	refreshBundledtlEdit();
	refreshSubBundleSelect();
	refreshMedialistDtl();
	$('#SubBundleSelect').select2('data', {});
	if (validBundledtl(CurrentTempletdtl)) {
		redrawBundle($('#BundleDiv'), CurrentTemplet, CurrentTempletdtl);
	}
});

//本地视频table初始化
$('#IntVideoTable thead').css('display', 'none');
$('#IntVideoTable tbody').css('display', 'none');	
var intvideohtml = '';
$('#IntVideoTable').dataTable({
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
		if ($('#IntVideoContainer').length < 1) {
			$('#IntVideoTable').append('<div id="IntVideoContainer"></div>');
		}
		$('#IntVideoContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 6 == 0) {
			intvideohtml = '';
			intvideohtml += '<div class="row" >';
		}
		intvideohtml += '<div class="col-md-2 col-xs-2">';

		intvideohtml += '<div id="ThumbContainer" style="position:relative">';
		var thumbnail = '../img/video.jpg';
		var thumbwidth = 100;
		if (aData.thumbnail != null) {
			thumbnail = '/pixsigdata' + aData.thumbnail;
			thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
		}
		intvideohtml += '<div id="VideoThumb" class="thumbs">';
		intvideohtml += '<img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		if (aData.relate != null) {
			var thumbnail = '../img/video.jpg';
			var thumbwidth = 50;
			var thumbheight = 50;
			if (aData.relate.thumbnail != null) {
				thumbnail = '/pixsigdata' + aData.relate.thumbnail;
				aData.relate.width = aData.relate.width == null ? 100: aData.relate.width;
				aData.relate.height = aData.relate.height == null ? 100: aData.relate.height;
				thumbwidth = aData.relate.width > aData.relate.height ? 50 : 50*aData.relate.width/aData.relate.height;
				thumbheight = aData.relate.height > aData.relate.width ? 50 : 50*aData.relate.height/aData.relate.width;
			}
			intvideohtml += '<div id="RelateThumb">';
			intvideohtml += '<img src="' + thumbnail + '" width="100%" alt="' + aData.relate.name + '" thumbwidth="' + thumbwidth + '" thumbheight="' + thumbheight + '"/>';
			intvideohtml += '</div>';
		}
		intvideohtml += '<div class="mask">';
		intvideohtml += '<div>';
		intvideohtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
		intvideohtml += '<a class="btn default btn-sm green pix-medialistdtl-intvideo-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
		intvideohtml += '</div>';
		intvideohtml += '</div>';
		intvideohtml += '</div>';

		intvideohtml += '</div>';

		intvideohtml += '</div>';
		if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#IntVideoTable').dataTable().fnGetData().length) {
			intvideohtml += '</div>';
			if ((iDisplayIndex+1) != $('#IntVideoTable').dataTable().fnGetData().length) {
				intvideohtml += '<hr/>';
			}
			$('#IntVideoContainer').append(intvideohtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#IntVideoContainer .thumbs').each(function(i) {
			$(this).height($(this).parent().width());
		});
		$('#IntVideoContainer .mask').each(function(i) {
			$(this).height($(this).parent().parent().width() + 2);
		});
		$('#IntVideoContainer #RelateThumb').each(function(i) {
			var thumbwidth = $(this).find('img').attr('thumbwidth');
			var thumbheight = $(this).find('img').attr('thumbheight');
			$(this).css('position', 'absolute');
			$(this).css('left', (100-thumbwidth) + '%');
			$(this).css('top', '0');
			$(this).css('width', thumbwidth + '%');
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurrentMediaBranchid });
		aoData.push({'name':'folderid','value':CurrentMediaFolderid });
		aoData.push({'name':'type','value':1 });
	}
});
$('#IntVideoTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
$('#IntVideoTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
$('#IntVideoTable').css('width', '100%');

//引入视频table初始化
$('#ExtVideoTable thead').css('display', 'none');
$('#ExtVideoTable tbody').css('display', 'none');	
var extvideohtml = '';
$('#ExtVideoTable').dataTable({
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
		if ($('#ExtVideoContainer').length < 1) {
			$('#ExtVideoTable').append('<div id="ExtVideoContainer"></div>');
		}
		$('#ExtVideoContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 6 == 0) {
			extvideohtml = '';
			extvideohtml += '<div class="row" >';
		}
		extvideohtml += '<div class="col-md-2 col-xs-2">';

		extvideohtml += '<div id="ThumbContainer" style="position:relative">';
		var thumbnail = '../img/video.jpg';
		var thumbwidth = 100;
		if (aData.thumbnail != null) {
			thumbnail = '/pixsigdata' + aData.thumbnail;
			thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
		}
		extvideohtml += '<div id="VideoThumb" class="thumbs">';
		extvideohtml += '<img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		if (aData.relate != null) {
			var thumbnail = '../img/video.jpg';
			var thumbwidth = 50;
			var thumbheight = 50;
			if (aData.relate.thumbnail != null) {
				thumbnail = '/pixsigdata' + aData.relate.thumbnail;
				aData.relate.width = aData.relate.width == null ? 100: aData.relate.width;
				aData.relate.height = aData.relate.height == null ? 100: aData.relate.height;
				thumbwidth = aData.relate.width > aData.relate.height ? 50 : 50*aData.relate.width/aData.relate.height;
				thumbheight = aData.relate.height > aData.relate.width ? 50 : 50*aData.relate.height/aData.relate.width;
			}
			extvideohtml += '<div id="RelateThumb">';
			extvideohtml += '<img src="' + thumbnail + '" width="100%" alt="' + aData.relate.name + '" thumbwidth="' + thumbwidth + '" thumbheight="' + thumbheight + '"/>';
			extvideohtml += '</div>';
		}
		extvideohtml += '<div class="mask">';
		extvideohtml += '<div>';
		extvideohtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
		extvideohtml += '<a class="btn default btn-sm green pix-medialistdtl-extvideo-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
		extvideohtml += '</div>';
		extvideohtml += '</div>';
		extvideohtml += '</div>';

		extvideohtml += '</div>';

		extvideohtml += '</div>';
		if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#ExtVideoTable').dataTable().fnGetData().length) {
			extvideohtml += '</div>';
			if ((iDisplayIndex+1) != $('#ExtVideoTable').dataTable().fnGetData().length) {
				extvideohtml += '<hr/>';
			}
			$('#ExtVideoContainer').append(extvideohtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#ExtVideoContainer .thumbs').each(function(i) {
			$(this).height($(this).parent().width());
		});
		$('#ExtVideoContainer .mask').each(function(i) {
			$(this).height($(this).parent().parent().width() + 2);
		});
		$('#ExtVideoContainer #RelateThumb').each(function(i) {
			var thumbwidth = $(this).find('img').attr('thumbwidth');
			var thumbheight = $(this).find('img').attr('thumbheight');
			$(this).css('position', 'absolute');
			$(this).css('left', (100-thumbwidth) + '%');
			$(this).css('top', '0');
			$(this).css('width', thumbwidth + '%');
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurrentMediaBranchid });
		aoData.push({'name':'folderid','value':CurrentMediaFolderid });
		aoData.push({'name':'type','value':2 });
	}
});
$('#ExtVideoTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
$('#ExtVideoTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
$('#ExtVideoTable').css('width', '100%');

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
		if (aData.relate != null) {
			aData.relate.width = aData.relate.width == null ? 100: aData.relate.width;
			aData.relate.height = aData.relate.height == null ? 100: aData.relate.height;
			thumbwidth = aData.relate.width > aData.relate.height ? 50 : 50*aData.relate.width/aData.relate.height;
			thumbheight = aData.relate.height > aData.relate.width ? 50 : 50*aData.relate.height/aData.relate.width;
			imagehtml += '<div id="RelateThumb">';
			imagehtml += '<img src="/pixsigdata' + aData.relate.thumbnail + '" width="100%" alt="' + aData.relate.name + '" thumbwidth="' + thumbwidth + '" thumbheight="' + thumbheight + '"/>';
			imagehtml += '</div>';
		}
		imagehtml += '<div class="mask">';
		imagehtml += '<div>';
		imagehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
		imagehtml += '<a class="btn default btn-sm green pix-medialistdtl-image-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
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
		$('#ImageContainer #RelateThumb').each(function(i) {
			var thumbwidth = $(this).find('img').attr('thumbwidth');
			var thumbheight = $(this).find('img').attr('thumbheight');
			$(this).css('position', 'absolute');
			$(this).css('left', (100-thumbwidth) + '%');
			$(this).css('top', '0');
			$(this).css('width', thumbwidth + '%');
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurrentMediaBranchid });
		aoData.push({'name':'folderid','value':CurrentMediaFolderid });
	}
});
$('#ImageTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
$('#ImageTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
$('#ImageTable').css('width', '100%');

$('#nav_tab1').click(function(event) {
	$('#IntVideoDiv').css('display', '');
	$('#ExtVideoDiv').css('display', 'none');
	$('#ImageDiv').css('display', 'none');
	$('#IntVideoTable').dataTable()._fnAjaxUpdate();
});
$('#nav_tab2').click(function(event) {
	$('#IntVideoDiv').css('display', 'none');
	$('#ExtVideoDiv').css('display', '');
	$('#ImageDiv').css('display', 'none');
	$('#ExtVideoTable').dataTable()._fnAjaxUpdate();
});
$('#nav_tab3').click(function(event) {
	$('#IntVideoDiv').css('display', 'none');
	$('#ExtVideoDiv').css('display', 'none');
	$('#ImageDiv').css('display', '');
	$('#ImageTable').dataTable()._fnAjaxUpdate();
});

//播放明细Table初始化
$('#MedialistDtlTable').dataTable({
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
		$('td:eq(4)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-medialistdtl-up"><i class="fa fa-arrow-up"></i></button>');
		$('td:eq(5)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-medialistdtl-down"><i class="fa fa-arrow-down"></i></button>');
		$('td:eq(6)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn red btn-xs pix-medialistdtl-delete"><i class="fa fa-trash-o"></i></button>');
		return nRow;
	}
});

//增加本地视频到播放明细Table
$('body').on('click', '.pix-medialistdtl-intvideo-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#IntVideoTable').dataTable().fnGetData(rowIndex);
	var medialistdtl = {};
	medialistdtl.medialistdtlid = 0;
	medialistdtl.medialistid = CurrentTempletdtl.medialist.medialistid;
	medialistdtl.objtype = '1';
	medialistdtl.objid = data.videoid;
	medialistdtl.sequence = CurrentTempletdtl.medialist.medialistdtls.length + 1;
	medialistdtl.video = data;
	CurrentTempletdtl.medialist.medialistdtls[CurrentTempletdtl.medialist.medialistdtls.length] = medialistdtl;

	var thumbnail = '';
	if (data.thumbnail == null) {
		thumbnail = '../img/video.jpg';
	} else {
		thumbnail = '/pixsigdata' + data.thumbnail;
	}
	var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="100%" alt="' + data.name + '"></div>';
	$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, common.view.intvideo, thumbhtml, data.name, 0, 0, 0]);
	redrawBundle($('#BundleDiv'), CurrentTemplet, CurrentTempletdtl);
});

//增加引入视频到播放明细Table
$('body').on('click', '.pix-medialistdtl-extvideo-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#ExtVideoTable').dataTable().fnGetData(rowIndex);
	var medialistdtl = {};
	medialistdtl.medialistdtlid = 0;
	medialistdtl.medialistid = CurrentTempletdtl.medialist.medialistid;
	medialistdtl.objtype = '1';
	medialistdtl.objid = data.videoid;
	medialistdtl.sequence = CurrentTempletdtl.medialist.medialistdtls.length + 1;
	medialistdtl.video = data;
	CurrentTempletdtl.medialist.medialistdtls[CurrentTempletdtl.medialist.medialistdtls.length] = medialistdtl;

	var thumbnail = '';
	if (data.thumbnail == null) {
		thumbnail = '../img/video.jpg';
	} else {
		thumbnail = '/pixsigdata' + data.thumbnail;
	}
	var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="100%" alt="' + data.name + '"></div>';
	$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, common.view.extvideo, thumbhtml, data.name, 0, 0, 0]);
	redrawBundle($('#BundleDiv'), CurrentTemplet, CurrentTempletdtl);
});

//增加图片到播放明细Table
$('body').on('click', '.pix-medialistdtl-image-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#ImageTable').dataTable().fnGetData(rowIndex);
	var medialistdtl = {};
	medialistdtl.medialistdtlid = 0;
	medialistdtl.medialistid = CurrentTempletdtl.medialist.medialistid;
	medialistdtl.objtype = '2';
	medialistdtl.objid = data.imageid;
	medialistdtl.sequence = CurrentTempletdtl.medialist.medialistdtls.length + 1;
	medialistdtl.image = data;
	CurrentTempletdtl.medialist.medialistdtls[CurrentTempletdtl.medialist.medialistdtls.length] = medialistdtl;

	var thumbwidth = data.width > data.height? 100 : 100*data.width/data.height;
	var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="/pixsigdata' + data.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + data.name + '"></div>';
	$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, common.view.image, thumbhtml, data.name, 0, 0, 0]);
	redrawBundle($('#BundleDiv'), CurrentTemplet, CurrentTempletdtl);
});


//删除播放明细列表某行
$('body').on('click', '.pix-medialistdtl-delete', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	for (var i=rowIndex; i<$('#MedialistDtlTable').dataTable().fnSettings().fnRecordsDisplay(); i++) {
		var data = $('#MedialistDtlTable').dataTable().fnGetData(i);
		$('#MedialistDtlTable').dataTable().fnUpdate(i, parseInt(i), 0);
	}
	$('#MedialistDtlTable').dataTable().fnDeleteRow(rowIndex);
	
	for (var i=rowIndex; i<CurrentTempletdtl.medialist.medialistdtls.length; i++) {
		CurrentTempletdtl.medialist.medialistdtls[i].sequence = i;
	}
	CurrentTempletdtl.medialist.medialistdtls.splice(rowIndex, 1);
	redrawBundle($('#BundleDiv'), CurrentTemplet, CurrentTempletdtl);
});

//上移播放明细列表某行
$('body').on('click', '.pix-medialistdtl-up', function(event) {
	var rowIndex = $(event.target).attr('data-id');
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	if (rowIndex == 0) {
		return;
	}
	rowIndex = parseInt(rowIndex);
	var movedDta = $('#MedialistDtlTable').dataTable().fnGetData(rowIndex).slice(0);
	var prevData = $('#MedialistDtlTable').dataTable().fnGetData(rowIndex-1).slice(0);
	$('#MedialistDtlTable').dataTable().fnUpdate(prevData[1], rowIndex, 1);
	$('#MedialistDtlTable').dataTable().fnUpdate(prevData[2], rowIndex, 2);
	$('#MedialistDtlTable').dataTable().fnUpdate(prevData[3], rowIndex, 3);
	$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[1], rowIndex-1, 1);
	$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[2], rowIndex-1, 2);
	$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[3], rowIndex-1, 3);
	
	var temp = CurrentTempletdtl.medialist.medialistdtls[rowIndex];
	CurrentTempletdtl.medialist.medialistdtls[rowIndex] =  CurrentTempletdtl.medialist.medialistdtls[rowIndex-1];
	CurrentTempletdtl.medialist.medialistdtls[rowIndex].sequence = rowIndex+1;
	CurrentTempletdtl.medialist.medialistdtls[rowIndex-1] = temp;
	CurrentTempletdtl.medialist.medialistdtls[rowIndex-1].sequence = rowIndex;
	redrawBundle($('#BundleDiv'), CurrentTemplet, CurrentTempletdtl);
});

//下移播放明细列表某行
$('body').on('click', '.pix-medialistdtl-down', function(event) {
	var rowIndex = $(event.target).attr('data-id');
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	if (rowIndex == $('#MedialistDtlTable').dataTable().fnSettings().fnRecordsDisplay() - 1) {
		return;
	}
	rowIndex = parseInt(rowIndex);
	var movedDta = $('#MedialistDtlTable').dataTable().fnGetData(rowIndex).slice(0);
	var nextData = $('#MedialistDtlTable').dataTable().fnGetData(rowIndex+1).slice(0);
	$('#MedialistDtlTable').dataTable().fnUpdate(nextData[1], rowIndex, 1);
	$('#MedialistDtlTable').dataTable().fnUpdate(nextData[2], rowIndex, 2);
	$('#MedialistDtlTable').dataTable().fnUpdate(nextData[3], rowIndex, 3);
	$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[1], rowIndex+1, 1);
	$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[2], rowIndex+1, 2);
	$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[3], rowIndex+1, 3);
	
	var temp = CurrentTempletdtl.medialist.medialistdtls[rowIndex];
	CurrentTempletdtl.medialist.medialistdtls[rowIndex] = CurrentTempletdtl.medialist.medialistdtls[rowIndex+1];
	CurrentTempletdtl.medialist.medialistdtls[rowIndex].sequence = rowIndex+1;
	CurrentTempletdtl.medialist.medialistdtls[rowIndex+1] = temp;
	CurrentTempletdtl.medialist.medialistdtls[rowIndex+1].sequence = rowIndex+2;
	redrawBundle($('#BundleDiv'), CurrentTemplet, CurrentTempletdtl);
});


$('#StreamTable1').dataTable({
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
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(2)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-stream-add"><i class="fa fa-plus"></i></a>');
		return nRow;
	}
});
$('#StreamTable1_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#StreamTable1_wrapper .dataTables_length select').addClass('form-control input-small');
$('#StreamTable1_wrapper .dataTables_length select').select2();
$('#StreamTable1').css('width', '100%').css('table-layout', 'fixed');

$('#StreamTable2').dataTable({
	'sDom' : 't',
	'iDisplayLength' : -1,
	'aoColumns' : [ {'sTitle' : '', 'bSortable' : false, 'sWidth' : '40px' }, 
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '60px' }, 
					{'sTitle' : '', 'bSortable' : false, 'sClass': 'autowrap' }, 
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' },
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' },
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' }],
	'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
	'oLanguage' : { 'sZeroRecords' : common.view.empty,
					'sEmptyTable' : common.view.empty }, 
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-stream-up"><i class="fa fa-arrow-up"></i></button>');
		$('td:eq(4)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-stream-down"><i class="fa fa-arrow-down"></i></button>');
		$('td:eq(5)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn red btn-xs pix-stream-delete"><i class="fa fa-trash-o"></i></button>');
		return nRow;
	}
});

//增加Stream
$('body').on('click', '.pix-stream-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#StreamTable1').dataTable().fnGetData(rowIndex);
	var medialistdtl = {};
	medialistdtl.medialistdtlid = 0;
	medialistdtl.medialistid = CurrentTempletdtl.medialist.medialistid;
	medialistdtl.objtype = '5';
	medialistdtl.objid = data.streamid;
	medialistdtl.sequence = CurrentTempletdtl.medialist.medialistdtls.length + 1;
	medialistdtl.stream = data;
	CurrentTempletdtl.medialist.medialistdtls[CurrentTempletdtl.medialist.medialistdtls.length] = medialistdtl;

	var html = '<div class="pix-title">' + data.name + '</div>';
	$('#StreamTable2').dataTable().fnAddData([medialistdtl.sequence, 'Stream', html, 0, 0, 0]);
});

//删除Stream
$('body').on('click', '.pix-stream-delete', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	for (var i=rowIndex; i<$('#StreamTable2').dataTable().fnSettings().fnRecordsDisplay(); i++) {
		var data = $('#StreamTable2').dataTable().fnGetData(i);
		$('#StreamTable2').dataTable().fnUpdate(i, parseInt(i), 0);
	}
	$('#StreamTable2').dataTable().fnDeleteRow(rowIndex);
	
	for (var i=rowIndex; i<CurrentTempletdtl.medialist.medialistdtls.length; i++) {
		CurrentTempletdtl.medialist.medialistdtls[i].sequence = i;
	}
	CurrentTempletdtl.medialist.medialistdtls.splice(rowIndex, 1);
});

//上移
$('body').on('click', '.pix-stream-up', function(event) {
	var rowIndex = $(event.target).attr('data-id');
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	if (rowIndex == 0) {
		return;
	}
	rowIndex = parseInt(rowIndex);
	var movedDta = $('#StreamTable2').dataTable().fnGetData(rowIndex).slice(0);
	var prevData = $('#StreamTable2').dataTable().fnGetData(rowIndex-1).slice(0);
	$('#StreamTable2').dataTable().fnUpdate(prevData[1], rowIndex, 1);
	$('#StreamTable2').dataTable().fnUpdate(prevData[2], rowIndex, 2);
	$('#StreamTable2').dataTable().fnUpdate(movedDta[1], rowIndex-1, 1);
	$('#StreamTable2').dataTable().fnUpdate(movedDta[2], rowIndex-1, 2);
	
	var temp = CurrentTempletdtl.medialist.medialistdtls[rowIndex];
	CurrentTempletdtl.medialist.medialistdtls[rowIndex] =  CurrentTempletdtl.medialist.medialistdtls[rowIndex-1];
	CurrentTempletdtl.medialist.medialistdtls[rowIndex].sequence = rowIndex+1;
	CurrentTempletdtl.medialist.medialistdtls[rowIndex-1] = temp;
	CurrentTempletdtl.medialist.medialistdtls[rowIndex-1].sequence = rowIndex;
});

//下移
$('body').on('click', '.pix-stream-down', function(event) {
	var rowIndex = $(event.target).attr('data-id');
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	if (rowIndex == $('#BundleTextTable').dataTable().fnSettings().fnRecordsDisplay() - 1) {
		return;
	}
	rowIndex = parseInt(rowIndex);
	var movedDta = $('#StreamTable2').dataTable().fnGetData(rowIndex).slice(0);
	var nextData = $('#StreamTable2').dataTable().fnGetData(rowIndex+1).slice(0);
	$('#StreamTable2').dataTable().fnUpdate(nextData[1], rowIndex, 1);
	$('#StreamTable2').dataTable().fnUpdate(nextData[2], rowIndex, 2);
	$('#StreamTable2').dataTable().fnUpdate(movedDta[1], rowIndex+1, 1);
	$('#StreamTable2').dataTable().fnUpdate(movedDta[2], rowIndex+1, 2);
	
	var temp = CurrentTempletdtl.medialist.medialistdtls[rowIndex];
	CurrentTempletdtl.medialist.medialistdtls[rowIndex] = CurrentTempletdtl.medialist.medialistdtls[rowIndex+1];
	CurrentTempletdtl.medialist.medialistdtls[rowIndex].sequence = rowIndex+1;
	CurrentTempletdtl.medialist.medialistdtls[rowIndex+1] = temp;
	CurrentTempletdtl.medialist.medialistdtls[rowIndex+1].sequence = rowIndex+2;
});


$('#AudioTable1').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 10, 25, 50, 100 ],
					[ 10, 25, 50, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'audio!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '20%' },
					{'sTitle' : common.view.filename, 'mData' : 'filename', 'bSortable' : false, 'sWidth' : '70%', 'sClass':'pixtitle' },
					{'sTitle' : '', 'mData' : 'audioid', 'bSortable' : false, 'sWidth' : '5%' }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(2)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-audio-add"><i class="fa fa-plus"></i></a>');
		return nRow;
	}
});
$('#AudioTable1_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#AudioTable1_wrapper .dataTables_length select').addClass('form-control input-small');
$('#AudioTable1_wrapper .dataTables_length select').select2();
$('#AudioTable1').css('width', '100%').css('table-layout', 'fixed');

$('#AudioTable2').dataTable({
	'sDom' : 't',
	'iDisplayLength' : -1,
	'aoColumns' : [ {'sTitle' : '', 'bSortable' : false, 'sWidth' : '40px' }, 
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '60px' }, 
					{'sTitle' : '', 'bSortable' : false, 'sClass': 'autowrap' }, 
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' },
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' },
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' }],
	'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
	'oLanguage' : { 'sZeroRecords' : common.view.empty,
					'sEmptyTable' : common.view.empty }, 
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-audio-up"><i class="fa fa-arrow-up"></i></button>');
		$('td:eq(4)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-audio-down"><i class="fa fa-arrow-down"></i></button>');
		$('td:eq(5)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn red btn-xs pix-audio-delete"><i class="fa fa-trash-o"></i></button>');
		return nRow;
	}
});

//增加Audio
$('body').on('click', '.pix-audio-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#AudioTable1').dataTable().fnGetData(rowIndex);
	var medialistdtl = {};
	medialistdtl.medialistdtlid = 0;
	medialistdtl.medialistid = CurrentTempletdtl.medialist.medialistid;
	medialistdtl.objtype = '6';
	medialistdtl.objid = data.audioid;
	medialistdtl.sequence = CurrentTempletdtl.medialist.medialistdtls.length + 1;
	medialistdtl.audio = data;
	CurrentTempletdtl.medialist.medialistdtls[CurrentTempletdtl.medialist.medialistdtls.length] = medialistdtl;

	var html = '<div class="pix-title">' + data.name + '</div>';
	$('#AudioTable2').dataTable().fnAddData([medialistdtl.sequence, 'Audio', html, 0, 0, 0]);
});

//删除Audio
$('body').on('click', '.pix-audio-delete', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	for (var i=rowIndex; i<$('#AudioTable2').dataTable().fnSettings().fnRecordsDisplay(); i++) {
		var data = $('#AudioTable2').dataTable().fnGetData(i);
		$('#AudioTable2').dataTable().fnUpdate(i, parseInt(i), 0);
	}
	$('#AudioTable2').dataTable().fnDeleteRow(rowIndex);
	
	for (var i=rowIndex; i<CurrentTempletdtl.medialist.medialistdtls.length; i++) {
		CurrentTempletdtl.medialist.medialistdtls[i].sequence = i;
	}
	CurrentTempletdtl.medialist.medialistdtls.splice(rowIndex, 1);
});

//上移
$('body').on('click', '.pix-audio-up', function(event) {
	var rowIndex = $(event.target).attr('data-id');
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	if (rowIndex == 0) {
		return;
	}
	rowIndex = parseInt(rowIndex);
	var movedDta = $('#AudioTable2').dataTable().fnGetData(rowIndex).slice(0);
	var prevData = $('#AudioTable2').dataTable().fnGetData(rowIndex-1).slice(0);
	$('#AudioTable2').dataTable().fnUpdate(prevData[1], rowIndex, 1);
	$('#AudioTable2').dataTable().fnUpdate(prevData[2], rowIndex, 2);
	$('#AudioTable2').dataTable().fnUpdate(movedDta[1], rowIndex-1, 1);
	$('#AudioTable2').dataTable().fnUpdate(movedDta[2], rowIndex-1, 2);
	
	var temp = CurrentTempletdtl.medialist.medialistdtls[rowIndex];
	CurrentTempletdtl.medialist.medialistdtls[rowIndex] =  CurrentTempletdtl.medialist.medialistdtls[rowIndex-1];
	CurrentTempletdtl.medialist.medialistdtls[rowIndex].sequence = rowIndex+1;
	CurrentTempletdtl.medialist.medialistdtls[rowIndex-1] = temp;
	CurrentTempletdtl.medialist.medialistdtls[rowIndex-1].sequence = rowIndex;
});

//下移
$('body').on('click', '.pix-audio-down', function(event) {
	var rowIndex = $(event.target).attr('data-id');
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	if (rowIndex == $('#BundleTextTable').dataTable().fnSettings().fnRecordsDisplay() - 1) {
		return;
	}
	rowIndex = parseInt(rowIndex);
	var movedDta = $('#AudioTable2').dataTable().fnGetData(rowIndex).slice(0);
	var nextData = $('#AudioTable2').dataTable().fnGetData(rowIndex+1).slice(0);
	$('#AudioTable2').dataTable().fnUpdate(nextData[1], rowIndex, 1);
	$('#AudioTable2').dataTable().fnUpdate(nextData[2], rowIndex, 2);
	$('#AudioTable2').dataTable().fnUpdate(movedDta[1], rowIndex+1, 1);
	$('#AudioTable2').dataTable().fnUpdate(movedDta[2], rowIndex+1, 2);
	
	var temp = CurrentTempletdtl.medialist.medialistdtls[rowIndex];
	CurrentTempletdtl.medialist.medialistdtls[rowIndex] = CurrentTempletdtl.medialist.medialistdtls[rowIndex+1];
	CurrentTempletdtl.medialist.medialistdtls[rowIndex].sequence = rowIndex+1;
	CurrentTempletdtl.medialist.medialistdtls[rowIndex+1] = temp;
	CurrentTempletdtl.medialist.medialistdtls[rowIndex+1].sequence = rowIndex+2;
});


function initMediaBranchTree() {
	$.ajax({
		type : 'POST',
		url : 'branch!list.action',
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var branches = data.aaData;
				CurrentMediaBranchid = branches[0].branchid;
				
				if ( $("#MediaBranchTreeDiv").length > 0 ) {
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
				
				if ( $("#MediaFolderTreeDiv").length > 0 ) {
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