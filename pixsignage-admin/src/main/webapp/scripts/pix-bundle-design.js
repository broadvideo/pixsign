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

var CurrentBundle;
var CurrentBundledtl;

function refreshTableFromBranchDropdown() {
	$('#IntVideoTable').dataTable()._fnAjaxUpdate();
	$('#ExtVideoTable').dataTable()._fnAjaxUpdate();
	$('#ImageTable').dataTable()._fnAjaxUpdate();
}

function redrawBundle(div, bundle, bundledtl) {
	div.empty();
	div.css('position', 'relative');
	div.css('margin-left', 'auto');
	div.css('margin-right', 'auto');
	div.css('border', '1px solid #000');
	if (bundle.layout.bgimage != null) {
		div.append('<img class="layout-bg" src="/pixsigdata' + bundle.layout.bgimage.thumbnail + '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
	}
	for (var i=0; i<bundle.bundledtls.length; i++) {
		div.append('<div id="BundledtlDiv' + bundle.bundledtls[i].bundledtlid + '"></div>');
		if (bundledtl != null && bundledtl.bundledtlid == bundle.bundledtls[i].bundledtlid) {
			redrawBundledtl($('#BundledtlDiv' + bundle.bundledtls[i].bundledtlid), bundle, bundle.bundledtls[i], true);
		} else {
			redrawBundledtl($('#BundledtlDiv' + bundle.bundledtls[i].bundledtlid), bundle, bundle.bundledtls[i], false);
		}
	}

	var width = Math.floor(div.parent().width());
	var scale = bundle.layout.width / width;
	var height = bundle.layout.height / scale;
	div.css('width' , width);
	div.css('height' , height);
	$(div).find('.bundle-font').each(function() {
		var bundledtl = bundle.bundledtls[$(this).attr('bundledtlindex')];
		var fontsize = bundledtl.layoutdtl.size * bundledtl.layoutdtl.height / 100 / scale;
		var text = $(this).html();
		$(this).css('font-size', fontsize + 'px');
		$(this).css('line-height', bundledtl.layoutdtl.height / scale + 'px');
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

function redrawBundledtl(div, bundle, bundledtl, selected) {
	div.empty();
	div.attr("class", "region");
	div.attr('bundledtlid', bundledtl.bundledtlid);
	div.css('position', 'absolute');
	div.css('width', 100*bundledtl.layoutdtl.width/bundle.layout.width + '%');
	div.css('height', 100*bundledtl.layoutdtl.height/bundle.layout.height + '%');
	div.css('top', 100*bundledtl.layoutdtl.topoffset/bundle.layout.height + '%');
	div.css('left', 100*bundledtl.layoutdtl.leftoffset/bundle.layout.width + '%');

	var bgimage = null;
	var text = "";
	if (bundledtl.objtype == 1 && bundledtl.type == 0 && bundledtl.medialist0.medialistdtls.length > 0) {
		var medialistdtl = bundledtl.medialist0.medialistdtls[0];
		if (medialistdtl.objtype == 1 && medialistdtl.video.thumbnail != null) {
			bgimage = '/pixsigdata' + medialistdtl.video.thumbnail;
		} else if (medialistdtl.objtype == 2 && medialistdtl.image.filename != null) {
			bgimage = '/pixsigdata' + medialistdtl.image.thumbnail;
		}
	} else if (bundledtl.objtype == 1 && bundledtl.type == 1 && bundledtl.medialist1.medialistdtls.length > 0) {
		var medialistdtl = bundledtl.medialist1.medialistdtls[0];
		if (medialistdtl.objtype == 1 && medialistdtl.video.thumbnail != null) {
			bgimage = '/pixsigdata' + medialistdtl.video.thumbnail;
		} else if (medialistdtl.objtype == 2 && medialistdtl.image.filename != null) {
			bgimage = '/pixsigdata' + medialistdtl.image.thumbnail;
		}
	} else if (bundledtl.objtype == 2 && bundledtl.type == 0) {
		text = bundledtl.text0.text;
	} else if (bundledtl.objtype == 2 && bundledtl.type == 1) {
		text = bundledtl.text1.text;
	}
	
	var bundledtlhtml = '';
	var border = '1px solid #000000';
	if (selected) {
		border = '3px solid #FF0000';
	}
	var bundledtlindex = bundle.bundledtls.indexOf(bundledtl);
	if (bundledtl.layoutdtl.region.type == 0) {
		if (bundledtl.objtype == 3) {
			bundledtlhtml += ' <div style="position:absolute; width:100%; height:100%; background:#A4C2F4; "></div>';
		} else if (bundledtl.objtype == 5) {
			bundledtlhtml += ' <div style="position:absolute; width:100%; height:100%; background:#FFF2CC; "></div>';
		} else {
			bundledtlhtml += ' <div style="position:absolute; width:100%; height:100%; background:#B4A7D6; "></div>';
		}
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		if (bgimage != null) {
			bundledtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
		} else if (bundledtl.layoutdtl.bgimage != null) {
			bundledtlhtml += '<img src="/pixsigdata' + bundledtl.layoutdtl.bgimage.thumbnail+ '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
		}
		bundledtlhtml += '</div>';
	} else if (bundledtl.layoutdtl.region.type == 1) {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.layoutdtl.bgcolor + '; opacity:' + bundledtl.layoutdtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		if (bundledtl.layoutdtl.direction == 4) {
			bundledtlhtml += '<marquee class="bundle-font" bundledtlindex="' + bundledtlindex + '" direction="left" behavior="scroll" scrollamount="1" scrolldelay="0" loop="-1" style="color:' + bundledtl.layoutdtl.color + '; font-size:12px; ">';
			bundledtlhtml += text;
			bundledtlhtml += '</marquee>';
		} else {
			bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.layoutdtl.color + '; font-size:12px; ">';
			bundledtlhtml += text;
			bundledtlhtml += '</p>';
		}
		bundledtlhtml += '</div>';
	} else if (bundledtl.layoutdtl.region.type == 2) {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.layoutdtl.bgcolor + '; opacity:' + bundledtl.layoutdtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.layoutdtl.color + '; font-size:12px; ">';
		bundledtlhtml += new Date().pattern(bundledtl.layoutdtl.dateformat);
		bundledtlhtml += '</p>';
		bundledtlhtml += '</div>';
	} else if (bundledtl.layoutdtl.region.type == 3) {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.layoutdtl.bgcolor + '; opacity:' + bundledtl.layoutdtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<div class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.layoutdtl.color + '; font-size:12px; ">';
		bundledtlhtml += '深圳 20 ~ 17℃ 多云转小雨 ';
		bundledtlhtml += '<img src="http://api.map.baidu.com/images/weather/day/duoyun.png" />';
		bundledtlhtml += '<img src="http://api.map.baidu.com/images/weather/night/xiaoyu.png" />';
		bundledtlhtml += '</div>';
		bundledtlhtml += '</div>';
	} else if (bundledtl.layoutdtl.region.type == 4) {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.layoutdtl.bgcolor + '; opacity:' + bundledtl.layoutdtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.layoutdtl.color + '; font-size:12px; ">';
		bundledtlhtml += 'Video-In';
		bundledtlhtml += '</p>';
		bundledtlhtml += '</div>';
	} else if (bundledtl.layoutdtl.region.type == 5) {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.layoutdtl.bgcolor + '; opacity:' + bundledtl.layoutdtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.layoutdtl.color + '; font-size:12px; ">';
		bundledtlhtml += 'DVB';
		bundledtlhtml += '</p>';
		bundledtlhtml += '</div>';
	} else if (bundledtl.layoutdtl.region.type == 6) {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.layoutdtl.bgcolor + '; opacity:' + bundledtl.layoutdtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.layoutdtl.color + '; font-size:12px; ">';
		bundledtlhtml += 'STREAM';
		bundledtlhtml += '</p>';
		bundledtlhtml += '</div>';
	} else {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.layoutdtl.bgcolor + '; opacity:' + bundledtl.layoutdtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.layoutdtl.color + '; font-size:12px; ">';
		bundledtlhtml += bundledtl.layoutdtl.region.name;
		bundledtlhtml += '</p>';
		bundledtlhtml += '</div>';
	}
	div.html(bundledtlhtml);
}

function generateBundledtlHtml(bundledtl) {
	var bundledtlhtml = '';
	bundledtlhtml += '<div id="bundledtl_' + bundledtl.bundledtlid + '" regionenabled="1" bundledtlid="' + bundledtl.bundledtlid + '" name="' + bundledtl.layoutdtl.region.name + '"';
	bundledtlhtml += 'ondblclick="" ';
	bundledtlhtml += 'class="region" ';
	bundledtlhtml += 'style="position: absolute; width:' + 100*bundledtl.layoutdtl.width/CurrentBundle.layout.width + '%; height:' + 100*bundledtl.layoutdtl.height/CurrentBundle.layout.height + '%; top: ' + 100*bundledtl.layoutdtl.topoffset/CurrentBundle.layout.height + '%; left: ' + 100*bundledtl.layoutdtl.leftoffset/CurrentBundle.layout.width + '%;">';
	bundledtlhtml += ' <div id="bundledtl_bg_' + bundledtl.bundledtlid + '" style="position:absolute; width:100%; height:100%; background-color:' + RegionColors[bundledtl.layoutdtl.regionid] + '; opacity:.80; filter:alpha(opacity=80);">';
	if (bundledtl.layoutdtl.bgimage != null) {
		bundledtlhtml += '<img src="/pixsigdata' + bundledtl.layoutdtl.bgimage.thumbnail+ '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
	}
	bundledtlhtml += '<div id="bundledtl_selected_' + bundledtl.bundledtlid + '" width="100%" height="100%" style="display:none;position:absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0; background-color:#696969; opacity:.80; filter:alpha(opacity=80);" />';
	bundledtlhtml += '</div>';

	bundledtlhtml += '</div>';

	return bundledtlhtml;
}


function validBundledtl(bundledtl) {
	if ($('#BundledtlEditForm').valid()) {
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();

		if (CurrentBundledtl.layoutdtl.region.type < 2) {
			var type = $('#BundledtlEditForm input[name="bundledtl.type"]:checked').val();
			var objtype = $('#BundledtlEditForm input[name="bundledtl.objtype"]:checked').val();
			if (type == undefined) {
				type = 0;
			}
			if (objtype == undefined) {
				objtype = 0;
			}
			if (type == 0) {
				if (objtype == 1) {
					bundledtl.objid = bundledtl.medialist0.medialistid;
					bundledtl.medialist = bundledtl.medialist0;
				} else if (objtype == 2) {
					bundledtl.text0.text = $('#BundledtlEditForm textarea[name="bundledtl.text.text"]').val();
					bundledtl.objid = bundledtl.text0.textid;
					bundledtl.text = bundledtl.text0;
				} else if (objtype == 3) {
					bundledtl.stream0.url = $('#BundledtlEditForm input[name="bundledtl.stream.url"]').val();
					bundledtl.objid = bundledtl.stream0.streamid;
					bundledtl.stream = bundledtl.stream0;
				} else if (objtype == 5) {
					bundledtl.widget0.url = $('#BundledtlEditForm input[name="bundledtl.widget.url"]').val();
					bundledtl.objid = bundledtl.widget0.widgetid;
					bundledtl.widget = bundledtl.widget0;
				}
			} else {
				if (objtype == 1) {
					bundledtl.medialist1 = $('#BundledtlSelect').select2('data').medialist;
					bundledtl.medialist = bundledtl.medialist1;
				} else if (objtype == 2) {
					bundledtl.text1 = $('#BundledtlSelect').select2('data').text;
					bundledtl.text = bundledtl.text1;
				} else if (objtype == 3) {
					bundledtl.stream1 = $('#BundledtlSelect').select2('data').stream;
					bundledtl.stream = bundledtl.stream1;
				} else if (objtype == 5) {
					bundledtl.widget1 = $('#BundledtlSelect').select2('data').widget;
					bundledtl.widget = bundledtl.widget1;
				}
				bundledtl.objid = $('#BundledtlSelect').val();
			}
			bundledtl.type = type;
			bundledtl.objtype = objtype;
		} else if (CurrentBundledtl.layoutdtl.region.type == 5) {
			bundledtl.dvb1 = $('#BundledtlSelect').select2('data').dvb;
			bundledtl.dvb = bundledtl.dvb1;
			bundledtl.objid = $('#BundledtlSelect').val();
			bundledtl.type = 1;
			bundledtl.objtype = 6;
		} else if (CurrentBundledtl.layoutdtl.region.type == 6) {
			bundledtl.objid = bundledtl.medialist0.medialistid;
			bundledtl.medialist = bundledtl.medialist0;
		}
		
		return true;
	}
	return false;
}

function enterBundledtlFocus(bundledtl) {
	redrawBundle($('#BundleDiv'), CurrentBundle, bundledtl);
	$('#BundledtlEditForm').css('display' , 'block');
	$('.bundledtl-title').html(bundledtl.layoutdtl.region.name);
	
	var type = $('#BundledtlEditForm input[name="bundledtl.type"]:checked').val();
	$('input[name="bundledtl.type"][value="' + type + '"]').attr('checked', false);
	$('input[name="bundledtl.type"][value="' + type + '"]').parent().removeClass('checked');
	$('input[name="bundledtl.type"][value="' + bundledtl.type + '"]').attr('checked', true);
	$('input[name="bundledtl.type"][value="' + bundledtl.type + '"]').parent().addClass('checked');
	var objtype = $('#BundledtlEditForm input[name="bundledtl.objtype"]:checked').val();
	$('input[name="bundledtl.objtype"][value="' + objtype + '"]').attr('checked', false);
	$('input[name="bundledtl.objtype"][value="' + objtype + '"]').parent().removeClass('checked');
	$('input[name="bundledtl.objtype"][value="' + bundledtl.objtype + '"]').attr('checked', true);
	$('input[name="bundledtl.objtype"][value="' + bundledtl.objtype + '"]').parent().addClass('checked');

	if (CurrentBundledtl.objtype == 2 && CurrentBundledtl.type == 0) {
		$('#BundledtlEditForm textarea[name="bundledtl.text.text"]').val(CurrentBundledtl.text0.text);
	} else if (CurrentBundledtl.objtype == 3 && CurrentBundledtl.type == 0) {
		$('#BundledtlEditForm input[name="bundledtl.stream.url"]').val(CurrentBundledtl.stream0.url);
	} else if (CurrentBundledtl.objtype == 5 && CurrentBundledtl.type == 0) {
		$('#BundledtlEditForm input[name="bundledtl.widget.url"]').val(CurrentBundledtl.widget0.url);
	}

	refreshBundledtlEdit();
	refreshBundledtlSelect();
	refreshMedialistDtl();
}

function refreshBundledtlEdit() {
	$('.bundle-ctl').css("display", "none");
	if (CurrentBundledtl.layoutdtl.region.type < 2) {
		if (CurrentBundledtl.layoutdtl.region.type == 0) {
			$('.regiontype-0').css("display", "block");
			$('#IntVideoTable').dataTable()._fnAjaxUpdate();
		} else if (CurrentBundledtl.layoutdtl.region.type == 1) {
			$('.regiontype-1').css("display", "block");
		} else if (CurrentBundledtl.layoutdtl.region.type == 6) {
			$('.regiontype-6').css("display", "block");
		}
		if ($('#BundledtlEditForm input[name="bundledtl.type"]:checked').val() == '1') {
			$('.public-0').css("display", "none");
		} else if ($('#BundledtlEditForm input[name="bundledtl.type"]:checked').val() == '0') {
			$('.public-1').css("display", "none");
			if ($('#BundledtlEditForm input[name="bundledtl.objtype"]:checked').val() == '1') {
				$('.objtype-2').css("display", "none");
				$('.objtype-3').css("display", "none");
				$('.objtype-4').css("display", "none");
				$('.objtype-5').css("display", "none");
			} else if ($('#BundledtlEditForm input[name="bundledtl.objtype"]:checked').val() == '2') {
				$('.objtype-1').css("display", "none");
				$('.objtype-3').css("display", "none");
				$('.objtype-4').css("display", "none");
				$('.objtype-5').css("display", "none");
			} else if ($('#BundledtlEditForm input[name="bundledtl.objtype"]:checked').val() == '3') {
				$('.objtype-1').css("display", "none");
				$('.objtype-2').css("display", "none");
				$('.objtype-4').css("display", "none");
				$('.objtype-5').css("display", "none");
			} else if ($('#BundledtlEditForm input[name="bundledtl.objtype"]:checked').val() == '5') {
				$('.objtype-1').css("display", "none");
				$('.objtype-2').css("display", "none");
				$('.objtype-3').css("display", "none");
				$('.objtype-4').css("display", "none");
			}
		}
	} else if (CurrentBundledtl.layoutdtl.region.type == 6) {
		$('.regiontype-6').css("display", "block");
	}

    FormValidateOption.rules = {};
    if ($('#BundledtlEditForm input[name="bundledtl.type"]:checked').val() == 1) {
    	FormValidateOption.rules['bundledtl.objid'] = {};
    	FormValidateOption.rules['bundledtl.objid']['required'] = true;
    } else if ($('#BundledtlEditForm input[name="bundledtl.objtype"]:checked').val() == 2) {
    	FormValidateOption.rules['bundledtl.text.text'] = {};
    	FormValidateOption.rules['bundledtl.text.text']['required'] = true;
    } else if ($('#BundledtlEditForm input[name="bundledtl.objtype"]:checked').val() == 3) {
    	FormValidateOption.rules['bundledtl.stream.url'] = {};
    	FormValidateOption.rules['bundledtl.stream.url']['required'] = true;
    } else if ($('#BundledtlEditForm input[name="bundledtl.objtype"]:checked').val() == 5) {
    	FormValidateOption.rules['bundledtl.widget.url'] = {};
    	FormValidateOption.rules['bundledtl.widget.url']['required'] = true;
	}
	$('#BundledtlEditForm').validate(FormValidateOption);
    $.extend($("#BundledtlEditForm").validate().settings, {
		rules: FormValidateOption.rules
	});
}

function refreshBundledtlSelect() {
	if ($('#BundledtlEditForm input[name="bundledtl.type"]:checked').val() == 0 && CurrentBundledtl.layoutdtl.region.type != 5 ) {
		return;
	}
	var url;
	if ($('input[name="bundledtl.objtype"]:checked').val() == 1) {
		url = 'medialist!list.action';
	} else if ($('input[name="bundledtl.objtype"]:checked').val() == 2) {
		url = 'text!list.action';
	} else if ($('input[name="bundledtl.objtype"]:checked').val() == 3) {
		url = 'stream!list.action';
	} else if ($('input[name="bundledtl.objtype"]:checked').val() == 5) {
		url = 'widget!list.action';
	} else if (CurrentBundledtl.layoutdtl.region.type == 5) {
		url = 'dvb!list.action';
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
						}
					}),
					more: more
				};
			}
		},
		formatResult: function (item) {
			if (item.medialist != null) {
				var html = '<div class="row"><div class="col-md-12 col-xs-12">' + item.name + '</div></div>';
				html += '<div class="row">';
				for (var i=0; i<item.medialist.medialistdtls.length; i++) {
					if (i >= 12) {
						break;
					}
					var medialistdtl = item.medialist.medialistdtls[i];
					html += '<div class="col-md-1 col-xs-1">';
					if (medialistdtl.objtype == 1) {
						if (medialistdtl.video.thumbnail == null) {
							html += '<img src="../img/video.jpg" alt="' + medialistdtl.video.name + '" width="100%" />';
						} else {
							html += '<img src="/pixsigdata' + medialistdtl.video.thumbnail + '" alt="' + medialistdtl.video.name + '" width="100%" />';
						}
					} else if (medialistdtl.objtype == 2) {
						html += '<img src="/pixsigdata' + medialistdtl.image.thumbnail + '" alt="' + medialistdtl.image.name + '" width="100%" />';
					}
					html += '</div>';
				}						
				html += '</div>';
				return html;
			} else {
				return item.name;
			}
		},
		formatSelection: function (item) {
			return item.name;				
		},
		dropdownCssClass: 'bigdrop', 
		escapeMarkup: function (m) { return m; } 
	});
	if ($('input[name="bundledtl.objtype"]:checked').val() == 1) {
		if (CurrentBundledtl.medialist1 != null) {
			$('#BundledtlSelect').select2('data', {id: CurrentBundledtl.medialist1.medialistid, name: CurrentBundledtl.medialist1.name, medialist: CurrentBundledtl.medialist1 });
		}
	} else if ($('input[name="bundledtl.objtype"]:checked').val() == 2) {
		if (CurrentBundledtl.text1 != null) {
			$('#BundledtlSelect').select2('data', {id: CurrentBundledtl.text1.textid, name: CurrentBundledtl.text1.name, text: CurrentBundledtl.text1 });
		}
	} else if ($('input[name="bundledtl.objtype"]:checked').val() == 3) {
		if (CurrentBundledtl.stream1 != null) {
			$('#BundledtlSelect').select2('data', {id: CurrentBundledtl.stream1.streamid, name: CurrentBundledtl.stream1.name, stream: CurrentBundledtl.stream1 });
		}
	} else if ($('input[name="bundledtl.objtype"]:checked').val() == 5) {
		if (CurrentBundledtl.widget1 != null) {
			$('#BundledtlSelect').select2('data', {id: CurrentBundledtl.widget1.widgetid, name: CurrentBundledtl.widget1.name, widget: CurrentBundledtl.widget1 });
		}
	} else if (CurrentBundledtl.layoutdtl.region.type == 5) {
		console.log(CurrentBundledtl.dvb1);
		if (CurrentBundledtl.dvb1 != null) {
			$('#BundledtlSelect').select2('data', {id: CurrentBundledtl.dvb1.dvbid, name: CurrentBundledtl.dvb1.name, dvb: CurrentBundledtl.dvb1 });
		}
	} 
}

function refreshMedialistDtl() {
	if (CurrentBundledtl.layoutdtl.region.type == 0) {
		if ($('input[name="bundledtl.objtype"]:checked').val() == 1 && $('input[name="bundledtl.type"]:checked').val() == 0) {
			$('#MedialistDtlTable').dataTable().fnClearTable();
			for (var i=0; i<CurrentBundledtl.medialist0.medialistdtls.length; i++) {
				var medialistdtl = CurrentBundledtl.medialist0.medialistdtls[i];
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
	} else if (CurrentBundledtl.layoutdtl.region.type == 6) {
		$('#StreamTable2').dataTable().fnClearTable();
		for (var i=0; i<CurrentBundledtl.medialist0.medialistdtls.length; i++) {
			var medialistdtl = CurrentBundledtl.medialist0.medialistdtls[i];
			if (medialistdtl.stream != null) {
				var html = '<div class="pix-title">' + medialistdtl.stream.name + '</div>';
				$('#StreamTable2').dataTable().fnAddData([medialistdtl.sequence, 'Stream', html, 0, 0, 0]);
			}
		}
	}
}

$('#BundleDiv').click(function(e){
	var scale = CurrentBundle.layout.width / $('#BundleDiv').width();
	var offset = $(this).offset();
	var posX = (e.pageX - offset.left) * scale;
	var posY = (e.pageY - offset.top) * scale;
	
	var bundledtls = CurrentBundle.bundledtls.filter(function (el) {
		var width = parseInt(el.layoutdtl.width);
		var height = parseInt(el.layoutdtl.height);
		var leftoffset = parseInt(el.layoutdtl.leftoffset);
		var topoffset = parseInt(el.layoutdtl.topoffset);
		return (posX > leftoffset) && (posX < (leftoffset + width)) && (posY > topoffset) && (posY < (topoffset + height));
	});
	if (bundledtls.length > 0) {
		bundledtls.sort(function(a, b) {
			return (a.layoutdtl.width + a.layoutdtl.height - b.layoutdtl.width - b.layoutdtl.height);
		});
		if (CurrentBundledtl == null || CurrentBundledtl != null && validBundledtl(CurrentBundledtl)) {
			//CurrentBundledtl = bundledtls[0];
			var index = 10000;
			for (var i=0; i<bundledtls.length; i++) {
				if (CurrentBundledtl != null && CurrentBundledtl.layoutdtl.regionid == bundledtls[i].layoutdtl.regionid) {
					index = i;
					break;
				}
			}
			var oldBundledtl = CurrentBundledtl;
			if (index >= (bundledtls.length -1)) {
				CurrentBundledtl = bundledtls[0];
			} else {
				CurrentBundledtl = bundledtls[index+1];
			}
			enterBundledtlFocus(CurrentBundledtl);
		}
	}
});

$('#BundledtlEditForm input[name="bundledtl.objtype"]').change(function(e) {
	refreshBundledtlEdit();
	refreshBundledtlSelect();
	refreshMedialistDtl();
	$('#BundledtlSelect').select2('data', {});
	if (validBundledtl(CurrentBundledtl)) {
		redrawBundle($('#BundleDiv'), CurrentBundle, CurrentBundledtl);
	}
});

$('#BundledtlEditForm input[name="bundledtl.type"]').change(function(e) {
	refreshBundledtlEdit();
	refreshBundledtlSelect();
	refreshMedialistDtl();
	if (validBundledtl(CurrentBundledtl)) {
		redrawBundle($('#BundleDiv'), CurrentBundle, CurrentBundledtl);
	}
});

$('#BundledtlSelect').on('change', function(e) {
	if (validBundledtl(CurrentBundledtl)) {
		redrawBundle($('#BundleDiv'), CurrentBundle, CurrentBundledtl);
	}
});	

//本地视频table初始化
$('#IntVideoTable thead').css('display', 'none');
$('#IntVideoTable tbody').css('display', 'none');	
var intvideohtml = '';
$('#IntVideoTable').dataTable({
	'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 12, 24, 48, 96 ],
					  [ 12, 24, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'video!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.filename, 'mData' : 'filename', 'bSortable' : false }, 
					{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'videoid', 'bSortable' : false }],
	'iDisplayLength' : 12,
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
		if (iDisplayIndex % 4 == 0) {
			intvideohtml = '';
			intvideohtml += '<div class="row" >';
		}
		intvideohtml += '<div class="col-md-3 col-xs-3">';

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
		if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#IntVideoTable').dataTable().fnGetData().length) {
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
		aoData.push({'name':'branchid','value':DropdownBranchid });
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
	'aLengthMenu' : [ [ 12, 24, 48, 96 ],
					  [ 12, 24, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'video!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.filename, 'mData' : 'filename', 'bSortable' : false }, 
					{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'videoid', 'bSortable' : false }],
	'iDisplayLength' : 12,
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
		if (iDisplayIndex % 4 == 0) {
			extvideohtml = '';
			extvideohtml += '<div class="row" >';
		}
		extvideohtml += '<div class="col-md-3 col-xs-3">';

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
		if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#ExtVideoTable').dataTable().fnGetData().length) {
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
		aoData.push({'name':'branchid','value':DropdownBranchid });
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
	'aLengthMenu' : [ [ 12, 24, 48, 96 ],
					  [ 12, 24, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'image!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.filename, 'mData' : 'filename', 'bSortable' : false }, 
					{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'imageid', 'bSortable' : false }],
	'iDisplayLength' : 12,
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
		if (iDisplayIndex % 4 == 0) {
			imagehtml = '';
			imagehtml += '<div class="row" >';
		}
		imagehtml += '<div class="col-md-3 col-xs-3">';
		
		imagehtml += '<div class="thumbs">';
		var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
		imagehtml += '<img src="/pixsigdata' + aData.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		imagehtml += '<div class="mask">';
		imagehtml += '<div>';
		imagehtml += '<h6 style="color:white;" class="pixtitle">' + aData.name + '</h6>';
		imagehtml += '<a class="btn default btn-sm green pix-medialistdtl-image-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
		imagehtml += '</div>';
		imagehtml += '</div>';
		imagehtml += '</div>';

		imagehtml += '</div>';
		if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#ImageTable').dataTable().fnGetData().length) {
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
			$(this).height($(this).parent().height() + 2);
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':DropdownBranchid });
	}
});
$('#ImageTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
$('#ImageTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
$('#ImageTable').css('width', '100%');

$('#nav_tab1').click(function(event) {
	$('#IntVideoTable').dataTable()._fnAjaxUpdate();
});
$('#nav_tab2').click(function(event) {
	$('#ExtVideoTable').dataTable()._fnAjaxUpdate();
});
$('#nav_tab3').click(function(event) {
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
	medialistdtl.medialistid = CurrentBundledtl.medialist0.medialistid;
	medialistdtl.objtype = '1';
	medialistdtl.objid = data.videoid;
	medialistdtl.sequence = CurrentBundledtl.medialist0.medialistdtls.length + 1;
	medialistdtl.video = data;
	CurrentBundledtl.medialist0.medialistdtls[CurrentBundledtl.medialist0.medialistdtls.length] = medialistdtl;

	var thumbnail = '';
	if (data.thumbnail == null) {
		thumbnail = '../img/video.jpg';
	} else {
		thumbnail = '/pixsigdata' + data.thumbnail;
	}
	var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="100%" alt="' + data.name + '"></div>';
	$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, common.view.intvideo, thumbhtml, data.name, 0, 0, 0]);
	redrawBundle($('#BundleDiv'), CurrentBundle, CurrentBundledtl);
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
	medialistdtl.medialistid = CurrentBundledtl.medialist0.medialistid;
	medialistdtl.objtype = '1';
	medialistdtl.objid = data.videoid;
	medialistdtl.sequence = CurrentBundledtl.medialist0.medialistdtls.length + 1;
	medialistdtl.video = data;
	CurrentBundledtl.medialist0.medialistdtls[CurrentBundledtl.medialist0.medialistdtls.length] = medialistdtl;

	var thumbnail = '';
	if (data.thumbnail == null) {
		thumbnail = '../img/video.jpg';
	} else {
		thumbnail = '/pixsigdata' + data.thumbnail;
	}
	var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="100%" alt="' + data.name + '"></div>';
	$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, common.view.extvideo, thumbhtml, data.name, 0, 0, 0]);
	redrawBundle($('#BundleDiv'), CurrentBundle, CurrentBundledtl);
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
	medialistdtl.medialistid = CurrentBundledtl.medialist0.medialistid;
	medialistdtl.objtype = '2';
	medialistdtl.objid = data.imageid;
	medialistdtl.sequence = CurrentBundledtl.medialist0.medialistdtls.length + 1;
	medialistdtl.image = data;
	CurrentBundledtl.medialist0.medialistdtls[CurrentBundledtl.medialist0.medialistdtls.length] = medialistdtl;

	var thumbwidth = data.width > data.height? 100 : 100*data.width/data.height;
	var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="/pixsigdata' + data.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + data.name + '"></div>';
	$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, common.view.image, thumbhtml, data.name, 0, 0, 0]);
	redrawBundle($('#BundleDiv'), CurrentBundle, CurrentBundledtl);
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
	
	for (var i=rowIndex; i<CurrentBundledtl.medialist0.medialistdtls.length; i++) {
		CurrentBundledtl.medialist0.medialistdtls[i].sequence = i;
	}
	CurrentBundledtl.medialist0.medialistdtls.splice(rowIndex, 1);
	redrawBundle($('#BundleDiv'), CurrentBundle, CurrentBundledtl);
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
	$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[1], rowIndex-1, 1);
	$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[2], rowIndex-1, 2);
	
	var temp = CurrentBundledtl.medialist0.medialistdtls[rowIndex];
	CurrentBundledtl.medialist0.medialistdtls[rowIndex] =  CurrentBundledtl.medialist0.medialistdtls[rowIndex-1];
	CurrentBundledtl.medialist0.medialistdtls[rowIndex].sequence = rowIndex+1;
	CurrentBundledtl.medialist0.medialistdtls[rowIndex-1] = temp;
	CurrentBundledtl.medialist0.medialistdtls[rowIndex-1].sequence = rowIndex;
	redrawBundle($('#BundleDiv'), CurrentBundle, CurrentBundledtl);
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
	$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[1], rowIndex+1, 1);
	$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[2], rowIndex+1, 2);
	
	var temp = CurrentBundledtl.medialist0.medialistdtls[rowIndex];
	CurrentBundledtl.medialist0.medialistdtls[rowIndex] = CurrentBundledtl.medialist0.medialistdtls[rowIndex+1];
	CurrentBundledtl.medialist0.medialistdtls[rowIndex].sequence = rowIndex+1;
	CurrentBundledtl.medialist0.medialistdtls[rowIndex+1] = temp;
	CurrentBundledtl.medialist0.medialistdtls[rowIndex+1].sequence = rowIndex+2;
	redrawBundle($('#BundleDiv'), CurrentBundle, CurrentBundledtl);
});


$('#StreamTable1').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 10, 25, 50, 100 ],
					[ 10, 25, 50, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'stream!list.action',
	'aoColumns' : [ {'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '20%' },
					{'sTitle' : 'URL', 'mData' : 'url', 'bSortable' : false, 'sWidth' : '70%' },
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
$('#StreamTable1').css('width', '100%');

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
	'oLanguage' : { 'sZeroRecords' : '列表为空',
					'sEmptyTable' : '列表为空' }, 
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
	medialistdtl.medialistid = CurrentBundledtl.medialist0.medialistid;
	medialistdtl.objtype = '5';
	medialistdtl.objid = data.streamid;
	medialistdtl.sequence = CurrentBundledtl.medialist0.medialistdtls.length + 1;
	medialistdtl.stream = data;
	CurrentBundledtl.medialist0.medialistdtls[CurrentBundledtl.medialist0.medialistdtls.length] = medialistdtl;

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
	
	for (var i=rowIndex; i<CurrentBundledtl.medialist0.medialistdtls.length; i++) {
		CurrentBundledtl.medialist0.medialistdtls[i].sequence = i;
	}
	CurrentBundledtl.medialist0.medialistdtls.splice(rowIndex, 1);
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
	
	var temp = CurrentBundledtl.medialist0.medialistdtls[rowIndex];
	CurrentBundledtl.medialist0.medialistdtls[rowIndex] =  CurrentBundledtl.medialist0.medialistdtls[rowIndex-1];
	CurrentBundledtl.medialist0.medialistdtls[rowIndex].sequence = rowIndex+1;
	CurrentBundledtl.medialist0.medialistdtls[rowIndex-1] = temp;
	CurrentBundledtl.medialist0.medialistdtls[rowIndex-1].sequence = rowIndex;
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
	
	var temp = CurrentBundledtl.medialist0.medialistdtls[rowIndex];
	CurrentBundledtl.medialist0.medialistdtls[rowIndex] = CurrentBundledtl.medialist0.medialistdtls[rowIndex+1];
	CurrentBundledtl.medialist0.medialistdtls[rowIndex].sequence = rowIndex+1;
	CurrentBundledtl.medialist0.medialistdtls[rowIndex+1] = temp;
	CurrentBundledtl.medialist0.medialistdtls[rowIndex+1].sequence = rowIndex+2;
});
