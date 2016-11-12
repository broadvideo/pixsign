var myurls = {
	'common.list' : 'bundle!list.action',
	'common.add' : 'bundle!add.action',
	'common.update' : 'bundle!update.action',
	'common.delete' : 'bundle!delete.action',
	'bundle.design' : 'bundle!design.action',
	'bundle.push' : 'bundle!push.action',
	'image.list' : 'image!list.action',
	'device.list' : 'device!list.action',
	'devicegroup.list' : 'devicegroup!list.action',
};

$(window).resize(function(e) {
	if (CurrentBundle != null && CurrentBundle != undefined && e.target == this) {
		var width = Math.floor($('#BundleDiv').parent().width());
		var scale = CurrentBundle.width / width;
		var height = CurrentBundle.height / scale;
		$('#BundleDiv').css('width', width);
		$('#BundleDiv').css('height', height);
	}
	for (var i=0; i<$('#MyTable').dataTable().fnGetData().length; i++) {
		var bundle = $('#MyTable').dataTable().fnGetData(i);
		redrawBundlePreview($('#BundleDiv-' + bundle.bundleid), bundle, Math.floor($('#BundleDiv-' + bundle.bundleid).parent().parent().width()));
	}
});

$("#MyTable thead").css("display", "none");
$("#MyTable tbody").css("display", "none");
var bundlehtml = '';
var oTable = $('#MyTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 16, 36, 72, 108 ],
						[ 16, 36, 72, 108 ] 
						],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : myurls['common.list'],
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'bundleid', 'bSortable' : false }],
	'iDisplayLength' : 16,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#BundleContainer').length < 1) {
			$('#MyTable').append('<div id="BundleContainer"></div>');
		}
		$('#BundleContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 4 == 0) {
			bundlehtml = '';
			bundlehtml += '<div class="row" >';
		}
		bundlehtml += '<div class="col-md-3 col-xs-3">';
		bundlehtml += '<h3 class="pixtitle">' + aData.name + '</h3>';

		bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="fancybox">';
		bundlehtml += '<div class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.layout.width > aData.layout.height? 100 : 100*aData.layout.width/aData.layout.height;
			bundlehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		}
		bundlehtml += '</div></a>';

		bundlehtml += '<div privilegeid="101010">';
		bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-detail"><i class="fa fa-stack-overflow"></i> ' + common.view.detail + '</a>';
		bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-review"><i class="fa fa-eye"></i> ' + common.view.review + '</a> </div>';

		bundlehtml += '</div>';
		if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
			bundlehtml += '</div>';
			if ((iDisplayIndex+1) != $('#MyTable').dataTable().fnGetData().length) {
				bundlehtml += '<hr/>';
			}
			$('#BundleContainer').append(bundlehtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		for (var i=0; i<$('#MyTable').dataTable().fnGetData().length; i++) {
			var bundle = $('#MyTable').dataTable().fnGetData(i);
			redrawBundlePreview($('#BundleDiv-' + bundle.bundleid), bundle, Math.floor($('#BundleDiv-' + bundle.bundleid).parent().parent().width()));
		}
		$('.thumbs').each(function(i) {
			$(this).width($(this).parent().closest('div').width());
			$(this).height($(this).parent().closest('div').width());
		});
		$('.fancybox').each(function(index,item) {
			$(this).click(function() {
				var index = $(this).attr('data-id');
				var bundle = $('#MyTable').dataTable().fnGetData(index);
				$.fancybox({
					openEffect	: 'none',
					closeEffect	: 'none',
					closeBtn : false,
			        padding : 0,
			        content: '<div id="BundlePreview"></div>',
			    });
				redrawBundlePreview($('#BundlePreview'), bundle, 800, 1);
			    return false;
			})
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'reviewflag','value':'0' });
		aoData.push({'name':'touchflag','value':'0' });
	}
});
jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').select2();


$('#MedialistDtlTable').dataTable({
	'sDom' : 't',
	'iDisplayLength' : -1,
	'aoColumns' : [ {'sTitle' : '', 'bSortable' : false }, 
					{'sTitle' : '', 'bSortable' : false }, 
					{'sTitle' : '', 'bSortable' : false }, 
					{'sTitle' : '', 'bSortable' : false }],
	'oLanguage' : { 'sZeroRecords' : common.view.empty,
					'sEmptyTable' : common.view.empty }, 
});

FormValidateOption.submitHandler = function(form) {
	$.ajax({
		type : 'POST',
		url : $('#ReviewForm').attr('action'),
		data : $('#ReviewForm').serialize(),
		success : function(data, status) {
			if (data.errorcode == 0) {
				$('#ReviewModal').modal('hide');
				bootbox.alert(common.tips.success);
				$('#MyTable').dataTable()._fnAjaxUpdate();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			bootbox.alert(common.tips.error);
		}
	});
};
$('#ReviewForm').validate(FormValidateOption);

$('[type=submit]', $('#ReviewModal')).on('click', function(event) {
	if ($('#ReviewForm').valid()) {
		$('#ReviewForm').submit();
	}
});

$('body').on('click', '.pix-review', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentBundle = $('#MyTable').dataTable().fnGetData(index);
	CurrentBundleid = CurrentBundle.bundleid;
	$('#ReviewForm input[name="bundle.bundleid"]').val(CurrentBundleid);
	$('#ReviewForm').attr('action', myurls['common.update']);
	$('#ReviewModal').modal();
});

//在列表页面中点击内容包设计
$('body').on('click', '.pix-detail', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentBundle = $('#MyTable').dataTable().fnGetData(index);
	CurrentBundleid = CurrentBundle.bundleid;
	CurrentBundledtl = CurrentBundle.bundledtls[0];
	
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	if (CurrentBundle.layout.width > CurrentBundle.layout.height) {
		$('#BundleCol1').attr('class', 'col-md-6 col-sm-6');
		$('#BundleCol2').attr('class', 'col-md-6 col-sm-6');
	} else {
		$('#BundleCol1').attr('class', 'col-md-5 col-sm-5');
		$('#BundleCol2').attr('class', 'col-md-7 col-sm-7');
	}
	
	$('#BundleModal').modal();
});

$('#BundleModal').on('shown.bs.modal', function (e) {
	enterBundledtlFocus(CurrentBundledtl);
})


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
	if (bundledtl.layoutdtl.bgimage != null) {
		bgimage = '/pixsigdata' + bundledtl.layoutdtl.bgimage.thumbnail;
	} else if (bundledtl.layoutdtl.mainflag == 1) {
		bgimage = '../img/region/region-play-main.jpg';
	} else if (bundledtl.layoutdtl.type == '0') {
		bgimage = '../img/region/region-play.jpg';
	} else if (bundledtl.layoutdtl.type == '4') {
		bgimage = '../img/region/region-videoin.jpg';
	} else if (bundledtl.layoutdtl.type == '5') {
		bgimage = '../img/region/region-dvb.jpg';
	} else if (bundledtl.layoutdtl.type == '6') {
		bgimage = '../img/region/region-stream.jpg';
	} else if (bundledtl.layoutdtl.type == '8') {
		if (bundledtl.layoutdtl.width > bundledtl.layoutdtl.height) {
			bgimage = '../img/region/region-navigate-h.jpg';
		} else {
			bgimage = '../img/region/region-navigate-v.jpg';
		}
	} else if (bundledtl.layoutdtl.type == '9') {
		bgimage = '../img/region/region-qrcode.jpg';
	}
	if (bundledtl.layoutdtl.type == '0') {
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
	
	var text = "";
	if (bundledtl.objtype == 2) {
		text = bundledtl.text.text;
	}
	
	var bundledtlhtml = '';
	var border = '1px solid #000000';
	if (selected) {
		border = '3px solid #FF0000';
	}
	var bundledtlindex = bundle.bundledtls.indexOf(bundledtl);
	if (bundledtl.layoutdtl.type == '0' || bundledtl.layoutdtl.type == '4' || bundledtl.layoutdtl.type == '5' || bundledtl.layoutdtl.type == '6' || bundledtl.layoutdtl.type == '8' || bundledtl.layoutdtl.type == '9') {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.layoutdtl.bgcolor + '; opacity:' + bundledtl.layoutdtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
		bundledtlhtml += '</div>';
	} else if (bundledtl.layoutdtl.type == '1') {
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
	} else if (bundledtl.layoutdtl.type == '2') {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.layoutdtl.bgcolor + '; opacity:' + bundledtl.layoutdtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.layoutdtl.color + '; font-size:12px; ">';
		bundledtlhtml += new Date().pattern(bundledtl.layoutdtl.dateformat);
		bundledtlhtml += '</p>';
		bundledtlhtml += '</div>';
	} else if (bundledtl.layoutdtl.type == '3') {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.layoutdtl.bgcolor + '; opacity:' + bundledtl.layoutdtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<div class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.layoutdtl.color + '; font-size:12px; ">';
		bundledtlhtml += '深圳 20 ~ 17℃ 多云转小雨 ';
		bundledtlhtml += '<img src="http://api.map.baidu.com/images/weather/day/duoyun.png" />';
		bundledtlhtml += '<img src="http://api.map.baidu.com/images/weather/night/xiaoyu.png" />';
		bundledtlhtml += '</div>';
		bundledtlhtml += '</div>';
	} else if (bundledtl.layoutdtl.type == '7') {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.layoutdtl.bgcolor + '; opacity:' + bundledtl.layoutdtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.layoutdtl.color + '; font-size:12px; ">';
		if (bundledtl.touchlabel != null) {
			bundledtlhtml += bundledtl.touchlabel;
		} else {
			bundledtlhtml += eval('common.view.region_type_7');
		}
		bundledtlhtml += '</p>';
		bundledtlhtml += '</div>';
	} else {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.layoutdtl.bgcolor + '; opacity:' + bundledtl.layoutdtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.layoutdtl.color + '; font-size:12px; ">';
		bundledtlhtml += eval('common.view.region_mainflag_' + bundledtl.layoutdtl.mainflag) + eval('common.view.region_type_' + bundledtl.layoutdtl.type);
		bundledtlhtml += '</p>';
		bundledtlhtml += '</div>';
	}
	div.html(bundledtlhtml);
}

function enterBundledtlFocus(bundledtl) {
	redrawBundle($('#BundleDiv'), CurrentBundle, bundledtl);
	$('#BundledtlEditForm').css('display' , 'block');
	$('.bundledtl-title').html(eval('common.view.region_mainflag_' + bundledtl.layoutdtl.mainflag) + eval('common.view.region_type_' + bundledtl.layoutdtl.type));
	
	if (CurrentBundledtl.objtype == 1) {
		$('.bundledtl-objtype').html('媒体列表');
		$('.bundledtl-objvalue').css('display', 'none');
		$('.bundledtl-medialist').css('display', 'block');
		
		$('#MedialistDtlTable').dataTable().fnClearTable();
		if (CurrentBundledtl.medialist != null && CurrentBundledtl.medialist.medialistdtls != null) {
			for (var i=0; i<CurrentBundledtl.medialist.medialistdtls.length; i++) {
				var medialistdtl = CurrentBundledtl.medialist.medialistdtls[i];
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
				$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, mediatype, thumbhtml, medianame]);
			}
		}
	} else if (CurrentBundledtl.objtype == 2) {
		$('.bundledtl-objvalue').css('display', 'block');
		$('.bundledtl-medialist').css('display', 'none');
		$('.bundledtl-objtype').html('文本');
		$('.bundledtl-objvalue').html(CurrentBundledtl.text.text);
	} else if (CurrentBundledtl.objtype == 3) {
		$('.bundledtl-objvalue').css('display', 'block');
		$('.bundledtl-medialist').css('display', 'none');
		$('.bundledtl-objtype').html('视频流');
		$('.bundledtl-objvalue').html(CurrentBundledtl.stream.text);
	} else if (CurrentBundledtl.objtype == 5) {
		$('.bundledtl-objvalue').css('display', 'block');
		$('.bundledtl-medialist').css('display', 'none');
		$('.bundledtl-objtype').html('Widget');
		$('.bundledtl-objvalue').html(CurrentBundledtl.widget.text);
	} else if (CurrentBundledtl.objtype == 6) {
		$('.bundledtl-objvalue').css('display', 'block');
		$('.bundledtl-medialist').css('display', 'none');
		$('.bundledtl-objtype').html('DVB');
		$('.bundledtl-objvalue').html(CurrentBundledtl.dvb.name);
	} else {
		$('.bundledtl-objtype').css('display', 'none');
		$('.bundledtl-objvalue').css('display', 'none');
		$('.bundledtl-medialist').css('display', 'none');
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

		//CurrentBundledtl = bundledtls[0];
		var index = 10000;
		for (var i=0; i<bundledtls.length; i++) {
			if (CurrentBundledtl != null && CurrentBundledtl.bundledtlid == bundledtls[i].bundledtlid) {
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
});

