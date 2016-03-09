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

function redrawBundle() {
	$('#BundleDiv').empty();
	if (CurrentBundle.layout.bgimage != null) {
		$('#BundleDiv').append('<img class="layout-bg" src="/pixsigdata' + CurrentBundle.layout.bgimage.filepath+ '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
	}
	for (var i=0; i<CurrentBundle.bundledtls.length; i++) {
		$('#BundleDiv').append(generateBundledtlHtml(CurrentBundle.bundledtls[i]));
	}
}

function generateBundledtlHtml(bundledtl) {
	var bundledtlhtml = '';
	bundledtlhtml += '<div id="bundledtl_' + bundledtl.bundledtlid + '" regionenabled="1" bundledtlid="' + bundledtl.bundledtlid + '" name="' + bundledtl.layoutdtl.region.name + '"';
	bundledtlhtml += 'ondblclick="" ';
	bundledtlhtml += 'class="region" ';
	bundledtlhtml += 'style="position: absolute; width:' + 100*bundledtl.layoutdtl.width/CurrentBundle.layout.width + '%; height:' + 100*bundledtl.layoutdtl.height/CurrentBundle.layout.height + '%; top: ' + 100*bundledtl.layoutdtl.topoffset/CurrentBundle.layout.height + '%; left: ' + 100*bundledtl.layoutdtl.leftoffset/CurrentBundle.layout.width + '%;">';
	bundledtlhtml += ' <div id="bundledtl_bg_' + bundledtl.bundledtlid + '" style="position:absolute; width:100%; height:100%; background-color:' + RegionColors[bundledtl.layoutdtl.regionid] + '; opacity:.80; filter:alpha(opacity=80);">';
	if (bundledtl.layoutdtl.bgimage != null) {
		bundledtlhtml += '<img src="/pixsigdata' + bundledtl.layoutdtl.bgimage.filepath+ '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
	}
	bundledtlhtml += '<div id="bundledtl_selected_' + bundledtl.bundledtlid + '" width="100%" height="100%" style="display:none;position:absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0; background-color:#696969; opacity:.80; filter:alpha(opacity=80);" />';
	bundledtlhtml += '</div>';

	bundledtlhtml += '</div>';

	return bundledtlhtml;
}


function leaveBundledtlFocus(bundledtl) {
	if ($('#BundledtlEditForm').valid()) {
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();

		var type = $('#BundledtlEditForm input[name="bundledtl.type"]:checked').val();
		var objtype = $('#BundledtlEditForm input[name="bundledtl.objtype"]:checked').val();
		if (type == undefined) {
			type = 0;
		}
		if (objtype == undefined) {
			objtype = 0;
		}
		if (type == 0 && bundledtl.type == 1) {
			if (objtype == 1) {
				bundledtl.medialist.medialistid = 0;
				bundledtl.medialist.type = 0;
			} else if (objtype == 2) {
				bundledtl.text = {};
				bundledtl.text.textid = 0;
				bundledtl.text.type = 0;
			} else if (objtype == 3) {
				bundledtl.stream = {};
				bundledtl.stream.streamid = 0;
				bundledtl.stream.type = 0;
			} else if (objtype == 5) {
				bundledtl.widget = {};
				bundledtl.widget.widgetid = 0;
				bundledtl.widget.type = 0;
			}
			bundledtl.objid = 0;
		}
		if (type == 0) {
			if (objtype == 1) {
				
			} else if (objtype == 2) {
				bundledtl.text.text = $('#BundledtlEditForm textarea[name="bundledtl.text.text"]').val();
			} else if (objtype == 3) {
				bundledtl.stream.url = $('#BundledtlEditForm input[name="bundledtl.stream.url"]').val();
			} else if (objtype == 5) {
				bundledtl.widget.url = $('#BundledtlEditForm input[name="bundledtl.widget.url"]').val();
			}
		} else {
			if (bundledtl.objtype == 1) {
				bundledtl.medialist = $('#BundledtlSelect').select2('data').medialist;
			} else if (bundledtl.objtype == 2) {
				bundledtl.text = $('#BundledtlSelect').select2('data').text;
			} else if (bundledtl.objtype == 3) {
				bundledtl.stream = $('#BundledtlSelect').select2('data').stream;
			} else if (bundledtl.objtype == 5) {
				bundledtl.widget = $('#BundledtlSelect').select2('data').widget;
			}
			bundledtl.objid = $('#BundledtlSelect').val();
		}
		bundledtl.type = type;
		bundledtl.objtype = objtype;
		
		var regiondiv = $('#bundledtl_' + bundledtl.bundledtlid);
		regiondiv.attr('style', 'position:absolute; width:' + 100*bundledtl.layoutdtl.width/CurrentBundle.layout.width 
				+ '%; height:' + 100*bundledtl.layoutdtl.height/CurrentBundle.layout.height 
				+ '%; top: ' + 100*bundledtl.layoutdtl.topoffset/CurrentBundle.layout.height 
				+ '%; left: ' + 100*bundledtl.layoutdtl.leftoffset/CurrentBundle.layout.width + '%;');
		if (bundledtl.layoutdtl.bgimage != null) {
			var regionbgdiv = $('#bundledtl_bg_' + bundledtl.bundledtlid);
			regionbgdiv.empty();
			regionbgdiv.append('<img src="/pixsigdata' + bundledtl.layoutdtl.bgimage.filepath+ '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
			regionbgdiv.append('<div id="bundledtl_selected_' + bundledtl.bundledtlid + '" width="100%" height="100%" style="display:none;position:absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0; background-color:#696969; opacity:.80; filter:alpha(opacity=80);" />');
		}

		$('#bundledtl_selected_' + bundledtl.bundledtlid).css('display' , 'none');
		return true;
	}
	return false;
}

function enterBundledtlFocus(bundledtl) {
	$('#BundledtlEditForm').css('display' , 'block');
	$('#bundledtl_selected_' + bundledtl.bundledtlid).css('display' , 'block');
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

	if (CurrentBundledtl.objtype == 2) {
		$('#BundledtlEditForm textarea[name="bundledtl.text.text"]').val(CurrentBundledtl.text.text);
	} else if (CurrentBundledtl.objtype == 3) {
		$('#BundledtlEditForm input[name="bundledtl.stream.url"]').val(CurrentBundledtl.stream.url);
	} else if (CurrentBundledtl.objtype == 5) {
		$('#BundledtlEditForm input[name="bundledtl.widget.url"]').val(CurrentBundledtl.widget.url);
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
		} else if (CurrentBundledtl.layoutdtl.region.type == 1) {
			$('.regiontype-1').css("display", "block");
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
	if ($('#BundledtlEditForm input[name="bundledtl.type"]:checked').val() == 0) {
		return;
	}
	var url;
	if ($('input[name="bundledtl.objtype"]:checked').val() == 1) {
		url = 'medialist!list.action';
	} else if ($('input[name="bundledtl.objtype"]:checked').val() == 2) {
		url = 'text!list.action';
	} else if ($('input[name="bundledtl.objtype"]:checked').val() == 3) {
		url = 'stream!list.action';
	} else if ($('input[name="bundledtl.objtype"]:checked').val() == 4) {
		url = 'dvb!list.action';
	} else if ($('input[name="bundledtl.objtype"]:checked').val() == 5) {
		url = 'widget!list.action';
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
						} else if (item.dvbid) {
							return {
								name:item.name, 
								id:item.dvbid,
								dvb:item
							};
						} else if (item.widgetid) {
							return {
								name:item.name + '(' + item.url + ')', 
								id:item.widgetid,
								widget:item
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
							html += '<img src="../local/img/video.jpg" alt="' + medialistdtl.video.name + '" width="100%" />';
						} else {
							html += '<img src="/pixsigdata' + medialistdtl.video.thumbnail + '" alt="' + medialistdtl.video.name + '" width="100%" />';
						}
					} else if (medialistdtl.objtype == 2) {
						html += '<img src="/pixsigdata' + medialistdtl.image.filepath + '" alt="' + medialistdtl.image.name + '" width="100%" />';
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
		if (CurrentBundledtl.medialist != null) {
			$('#BundledtlSelect').select2('data', {id: CurrentBundledtl.medialist.medialistid, name: CurrentBundledtl.medialist.name, medialist: CurrentBundledtl.medialist });
		}
	} else if ($('input[name="bundledtl.objtype"]:checked').val() == 2) {
		if (CurrentBundledtl.text != null) {
			$('#BundledtlSelect').select2('data', {id: CurrentBundledtl.text.textid, name: CurrentBundledtl.text.name, text: CurrentBundledtl.text });
		}
	} else if ($('input[name="bundledtl.objtype"]:checked').val() == 3) {
		if (CurrentBundledtl.stream != null) {
			$('#BundledtlSelect').select2('data', {id: CurrentBundledtl.stream.streamid, name: CurrentBundledtl.stream.name, stream: CurrentBundledtl.stream });
		}
	} else if ($('input[name="bundledtl.objtype"]:checked').val() == 5) {
		if (CurrentBundledtl.widget != null) {
			$('#BundledtlSelect').select2('data', {id: CurrentBundledtl.widget.widgetid, name: CurrentBundledtl.widget.name, widget: CurrentBundledtl.widget });
		}
	} 
}

function refreshMedialistDtl() {
	if ($('input[name="bundledtl.objtype"]:checked').val() == 1 && $('input[name="bundledtl.type"]:checked').val() == 0) {
		$('#MedialistDtlTable').dataTable().fnClearTable();
		for (var i=0; i<CurrentBundledtl.medialist.medialistdtls.length; i++) {
			var medialistdtl = CurrentBundledtl.medialist.medialistdtls[i];
			var thumbhtml = '';
			if (medialistdtl.objtype == 1 && medialistdtl.video.type == 1) {
				mediatype = common.view.video;
				if (medialistdtl.video.thumbnail == null) {
					thumbhtml = '<img src="../local/img/video.jpg" alt="' + medialistdtl.video.name + '" height="30" />' + medialistdtl.video.name;
				} else {
					thumbhtml = '<img src="/pixsigdata' + medialistdtl.video.thumbnail + '" alt="' + medialistdtl.video.name + '" height="30" />' + medialistdtl.video.name;
				}
			} else if (medialistdtl.objtype == 1 && medialistdtl.video.type == 2) {
				mediatype = common.view.extvideo;
				if (medialistdtl.video.thumbnail == null) {
					thumbhtml = '<img src="../local/img/video.jpg" alt="' + medialistdtl.video.name + '" height="30" />' + medialistdtl.video.name;
				} else {
					thumbhtml = '<img src="/pixsigdata' + medialistdtl.video.thumbnail + '" alt="' + medialistdtl.video.name + '" height="30" />' + medialistdtl.video.name;
				}
			} else if (medialistdtl.objtype == 2) {
				mediatype = common.view.image;
				var thumbhtml = '<img src="/pixsigdata' + medialistdtl.image.filepath + '" alt="' + medialistdtl.image.name + '" height="30" />' + medialistdtl.image.name;
			} else {
				mediatype = common.view.unknown;
			}
			$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, mediatype, thumbhtml, 0, 0, 0]);
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
		if (CurrentBundledtl == null || CurrentBundledtl != null && leaveBundledtlFocus(CurrentBundledtl)) {
			CurrentBundledtl = bundledtls[0];
			enterBundledtlFocus(CurrentBundledtl);
		}
	}
});

$('#BundledtlEditForm input[name="bundledtl.objtype"]').change(function(e) {
	refreshBundledtlEdit();
	refreshBundledtlSelect();
	refreshMedialistDtl();
});

$('#BundledtlEditForm input[name="bundledtl.type"]').change(function(e) {
	if ($('#BundledtlEditForm input[name="bundledtl.type"]:checked').val() == 0 && $('#BundledtlEditForm input[name="bundledtl.objtype"]:checked').val() == 1) {
		if (CurrentBundledtl.medialist == null || CurrentBundledtl.medialist.type == 1) {
			CurrentBundledtl.medialist = {};
			CurrentBundledtl.medialist.medialistid = 0;
			CurrentBundledtl.medialist.type = 0;
			CurrentBundledtl.medialist.medialistdtls = [];
		}
	}
	refreshBundledtlEdit();
	refreshBundledtlSelect();
	refreshMedialistDtl();
	if (CurrentBundledtl.type != $('input[name="bundledtl.type"]:checked').val()) {
		$('#BundledtlSelect').select2('data', '');
	}
});


//本地视频table初始化
$('#IntVideoTable thead').css('display', 'none');
$('#IntVideoTable tbody').css('display', 'none');	
var intvideohtml = '';
$('#IntVideoTable').dataTable({
	'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
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
		if (aData['thumbnail'] == null) {
			intvideohtml += '<img src="../local/img/video.jpg" alt="' + aData['name'] + '" width="100%" />';
		} else {
			intvideohtml += '<img src="/pixsigdata' + aData['thumbnail'] + '" alt="' + aData['name'] + '" width="100%" />';
		}
		intvideohtml += '<h6>' + aData['name'] + '</h6>';
		intvideohtml += '<p><button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-medialistdtl-intvideo-add">' + common.view.add + '</button></p>';
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
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'type','value':1 });
	}
});
jQuery('#IntVideoTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
jQuery('#IntVideoTable_wrapper .dataTables_length select').addClass("form-control input-small"); 

//引入视频table初始化
$('#ExtVideoTable thead').css('display', 'none');
$('#ExtVideoTable tbody').css('display', 'none');	
var extvideohtml = '';
$('#ExtVideoTable').dataTable({
	'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
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
		if (aData['thumbnail'] == null) {
			extvideohtml += '<img src="../local/img/video.jpg" alt="' + aData['name'] + '" width="100%" />';
		} else {
			extvideohtml += '<img src="/pixsigdata' + aData['thumbnail'] + '" alt="' + aData['name'] + '" width="100%" />';
		}
		extvideohtml += '<h6>' + aData['name'] + '</h6>';
		extvideohtml += '<p><button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-medialistdtl-extvideo-add">' + common.view.add + '</button></p>';
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
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'type','value':2 });
	}
});
jQuery('#ExtVideoTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
jQuery('#ExtVideoTable_wrapper .dataTables_length select').addClass("form-control input-small"); 

//图片table初始化
$('#ImageTable thead').css('display', 'none');
$('#ImageTable tbody').css('display', 'none');	
var imagehtml = '';
$('#ImageTable').dataTable({
	'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
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
		imagehtml += '<img src="/pixsigdata' + aData['filepath'] + '" alt="' + aData['name'] + '" width="100%" />';
		imagehtml += '<h6>' + aData['name'] + '</h6>';
		imagehtml += '<p><button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-medialistdtl-image-add">' + common.view.add + '</button></p>';
		imagehtml += '</div>';
		if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#ImageTable').dataTable().fnGetData().length) {
			imagehtml += '</div>';
			if ((iDisplayIndex+1) != $('#ImageTable').dataTable().fnGetData().length) {
				imagehtml += '<hr/>';
			}
			$('#ImageContainer').append(imagehtml);
		}
		return nRow;
	}
});
jQuery('#ImageTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
jQuery('#ImageTable_wrapper .dataTables_length select').addClass("form-control input-small"); 

//播放明细Table初始化
$('#MedialistDtlTable').dataTable({
	'sDom' : 't',
	'iDisplayLength' : -1,
	'aoColumns' : [ {'sTitle' : common.view.sequence, 'bSortable' : false, 'sWidth' : '50px' }, 
					{'sTitle' : common.view.type, 'bSortable' : false, 'sWidth' : '100px' }, 
					{'sTitle' : common.view.detail, 'bSortable' : false, 'sClass': 'autowrap' }, 
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' },
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' },
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' }],
	'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
	'oLanguage' : { 'sZeroRecords' : common.view.empty,
					'sEmptyTable' : common.view.empty }, 
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-medialistdtl-up"><i class="fa fa-arrow-up"></i></button>');
		$('td:eq(4)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-medialistdtl-down"><i class="fa fa-arrow-down"></i></button>');
		$('td:eq(5)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn red btn-xs pix-medialistdtl-delete">' + common.view.remove + '</button>');
		return nRow;
	}
});

//增加本地视频到播放明细Table
$('body').on('click', '.pix-medialistdtl-intvideo-add', function(event) {
	var data = $('#IntVideoTable').dataTable().fnGetData($(event.target).attr("data-id"));		
	var medialistdtl = {};
	medialistdtl.medialistdtlid = 0;
	medialistdtl.medialistid = CurrentBundledtl.medialist.medialistid;
	medialistdtl.objtype = '1';
	medialistdtl.objid = data.videoid;
	medialistdtl.sequence = CurrentBundledtl.medialist.medialistdtls.length + 1;
	medialistdtl.video = data;
	CurrentBundledtl.medialist.medialistdtls[CurrentBundledtl.medialist.medialistdtls.length] = medialistdtl;
	var thumbhtml = '';
	if (data.thumbnail == null) {
		thumbhtml = '<img src="../local/img/video.jpg" alt="' + data.name + '" height="30" />' + data.name;
	} else {
		thumbhtml = '<img src="/pixsigdata' + data.thumbnail + '" alt="' + data.name + '" height="30" />' + data.name;
	}
	$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, common.view.video, thumbhtml, 0, 0, 0]);
});

//增加引入视频到播放明细Table
$('body').on('click', '.pix-medialistdtl-extvideo-add', function(event) {
	var data = $('#ExtVideoTable').dataTable().fnGetData($(event.target).attr("data-id"));		
	var medialistdtl = {};
	medialistdtl.medialistdtlid = 0;
	medialistdtl.medialistid = CurrentBundledtl.medialist.medialistid;
	medialistdtl.objtype = '1';
	medialistdtl.objid = data.videoid;
	medialistdtl.sequence = CurrentBundledtl.medialist.medialistdtls.length + 1;
	medialistdtl.video = data;
	CurrentBundledtl.medialist.medialistdtls[CurrentBundledtl.medialist.medialistdtls.length] = medialistdtl;
	var thumbhtml = '';
	if (data.thumbnail == null) {
		thumbhtml = '<img src="../local/img/video.jpg" alt="' + data.name + '" height="30" />' + data.name;
	} else {
		thumbhtml = '<img src="/pixsigdata' + data.thumbnail + '" alt="' + data.name + '" height="30" />' + data.name;
	}
	$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, common.view.extvideo, thumbhtml, 0, 0, 0]);
});

//增加图片到播放明细Table
$('body').on('click', '.pix-medialistdtl-image-add', function(event) {
	var data = $('#ImageTable').dataTable().fnGetData($(event.target).attr("data-id"));
	var medialistdtl = {};
	medialistdtl.medialistdtlid = 0;
	medialistdtl.medialistid = CurrentBundledtl.medialist.medialistid;
	medialistdtl.objtype = '2';
	medialistdtl.objid = data.imageid;
	medialistdtl.sequence = CurrentBundledtl.medialist.medialistdtls.length + 1;
	medialistdtl.image = data;
	CurrentBundledtl.medialist.medialistdtls[CurrentBundledtl.medialist.medialistdtls.length] = medialistdtl;
	var thumbhtml = '<img src="/pixsigdata' + data.filepath + '" alt="' + data.name + '" height="30" />' + data.name;
	$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, common.view.image, thumbhtml, 0, 0, 0]);
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
	
	for (var i=rowIndex; i<CurrentBundledtl.medialist.medialistdtls.length; i++) {
		CurrentBundledtl.medialist.medialistdtls[i].sequence = i;
	}
	CurrentBundledtl.medialist.medialistdtls.splice(rowIndex, 1);
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
	
	var temp = CurrentBundledtl.medialist.medialistdtls[rowIndex];
	CurrentBundledtl.medialist.medialistdtls[rowIndex] =  CurrentBundledtl.medialist.medialistdtls[rowIndex-1];
	CurrentBundledtl.medialist.medialistdtls[rowIndex].sequence = rowIndex+1;
	CurrentBundledtl.medialist.medialistdtls[rowIndex-1] = temp;
	CurrentBundledtl.medialist.medialistdtls[rowIndex-1].sequence = rowIndex;
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
	
	var temp = CurrentBundledtl.medialist.medialistdtls[rowIndex];
	CurrentBundledtl.medialist.medialistdtls[rowIndex] = CurrentBundledtl.medialist.medialistdtls[rowIndex+1];
	CurrentBundledtl.medialist.medialistdtls[rowIndex].sequence = rowIndex+1;
	CurrentBundledtl.medialist.medialistdtls[rowIndex+1] = temp;
	CurrentBundledtl.medialist.medialistdtls[rowIndex+1].sequence = rowIndex+2;
});
