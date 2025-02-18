var myurls = {
	'bundle.list' : 'bundle!list.action',
	'bundle.add' : 'bundle!add.action',
	'bundle.update' : 'bundle!update.action',
	'bundle.delete' : 'bundle!delete.action',
	'bundle.review' : 'bundle!review.action',
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
	//for (var i=0; i<$('#MyTable').dataTable().fnGetData().length; i++) {
	//	var bundle = $('#MyTable').dataTable().fnGetData(i);
	//	redrawBundlePreview($('#BundleDiv-' + bundle.bundleid), bundle, Math.floor($('#BundleDiv-' + bundle.bundleid).parent().parent().width()));
	//}
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
	'sAjaxSource' : myurls['bundle.list'],
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

		bundlehtml += '<a href="javascript:;" bundleid="' + aData.bundleid + '" class="fancybox">';
		bundlehtml += '<div class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			bundlehtml += '<img src="/pixsigndata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		}
		bundlehtml += '</div></a>';

		bundlehtml += '<div privilegeid="101010">';
		bundlehtml += '<a href="javascript:;" bundleid="' + aData.bundleid + '" class="btn default btn-xs blue pix-detail"><i class="fa fa-stack-overflow"></i> ' + common.view.detail + '</a>';
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
		//for (var i=0; i<$('#MyTable').dataTable().fnGetData().length; i++) {
		//	var bundle = $('#MyTable').dataTable().fnGetData(i);
		//	redrawBundlePreview($('#BundleDiv-' + bundle.bundleid), bundle, Math.floor($('#BundleDiv-' + bundle.bundleid).parent().parent().width()));
		//}
		$('.thumbs').each(function(i) {
			$(this).width($(this).parent().closest('div').width());
			$(this).height($(this).parent().closest('div').width());
		});
		$('.fancybox').each(function(index,item) {
			$(this).click(function() {
				var bundleid = $(this).attr('bundleid');
				$.ajax({
					type : 'GET',
					url : 'bundle!get.action',
					data : {bundleid: bundleid},
					success : function(data, status) {
						if (data.errorcode == 0) {
							$.fancybox({
								openEffect	: 'none',
								closeEffect	: 'none',
								closeBtn : false,
						        padding : 0,
						        content: '<div id="BundlePreview"></div>',
						    });
							redrawBundlePreview($('#BundlePreview'), data.bundle, 800, 1);
						} else {
							bootbox.alert(common.tips.error + data.errormsg);
						}
					},
					error : function() {
						console.log('failue');
					}
				});
			    return false;
			})
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'reviewflag','value':'0' });
		aoData.push({'name':'homeflag','value':'1' });
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
			console.log('failue');
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
	$('#ReviewForm').attr('action', myurls['bundle.review']);
	$('#ReviewModal').modal();
});

//在列表页面中点击内容包设�?
$('body').on('click', '.pix-detail', function(event) {
	var bundleid = $(event.target).attr('bundleid');
	if (bundleid == undefined) {
		bundleid = $(event.target).parent().attr('bundleid');
	}
	$.ajax({
		type : 'GET',
		url : 'bundle!get.action',
		data : {bundleid: bundleid},
		success : function(data, status) {
			if (data.errorcode == 0) {
				CurrentBundle = data.bundle;
				CurrentBundleid = CurrentBundle.bundleid;
				CurrentBundledtl = CurrentBundle.bundledtls[0];
				
				$('.form-group').removeClass('has-error');
				$('.help-block').remove();
				if (CurrentBundle.width > CurrentBundle.height) {
					$('#BundleCol1').attr('class', 'col-md-6 col-sm-6');
					$('#BundleCol2').attr('class', 'col-md-6 col-sm-6');
				} else {
					$('#BundleCol1').attr('class', 'col-md-5 col-sm-5');
					$('#BundleCol2').attr('class', 'col-md-7 col-sm-7');
				}
				$('#BundleModal').modal();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
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
	if (bundle.bgimage != null) {
		div.append('<img class="layout-bg" src="/pixsigndata' + bundle.bgimage.thumbnail + '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
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

function redrawBundledtl(div, bundle, bundledtl, selected) {
	div.empty();
	div.attr("class", "region");
	div.attr('bundledtlid', bundledtl.bundledtlid);
	div.css('position', 'absolute');
	div.css('width', 100*bundledtl.width/bundle.width + '%');
	div.css('height', 100*bundledtl.height/bundle.height + '%');
	div.css('top', 100*bundledtl.topoffset/bundle.height + '%');
	div.css('left', 100*bundledtl.leftoffset/bundle.width + '%');

	var bgimage = null;
	if (bundledtl.bgimage != null) {
		bgimage = '/pixsigndata' + bundledtl.bgimage.thumbnail;
	} else if (bundledtl.mainflag == 1) {
		bgimage = '/pixsignage/img/region/region-play-main.jpg';
	} else if (bundledtl.type == '0') {
		bgimage = '/pixsignage/img/region/region-play.jpg';
	} else if (bundledtl.type == '4') {
		bgimage = '/pixsignage/img/region/region-videoin.jpg';
	} else if (bundledtl.type == '5') {
		bgimage = '/pixsignage/img/region/region-dvb.jpg';
	} else if (bundledtl.type == '6') {
		bgimage = '/pixsignage/img/region/region-stream.jpg';
	} else if (bundledtl.type == '8') {
		if (bundledtl.width > bundledtl.height) {
			bgimage = '/pixsignage/img/region/region-navigate-h.jpg';
		} else {
			bgimage = '/pixsignage/img/region/region-navigate-v.jpg';
		}
	} else if (bundledtl.type == '9') {
		bgimage = '/pixsignage/img/region/region-qrcode.jpg';
	}
	if (bundledtl.type == '0') {
		if (bundledtl.objtype == 1 && bundledtl.medialist.medialistdtls.length > 0) {
			var medialistdtl = bundledtl.medialist.medialistdtls[0];
			if (medialistdtl.objtype == 1 && medialistdtl.video.thumbnail != null) {
				bgimage = '/pixsigndata' + medialistdtl.video.thumbnail;
			} else if (medialistdtl.objtype == 2 && medialistdtl.image.filename != null) {
				bgimage = '/pixsigndata' + medialistdtl.image.thumbnail;
			}
		} else if (bundledtl.objtype == 5) {
			bgimage = '/pixsignage/img/region/region-widget.jpg';
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
	if (bundledtl.type == '0' || bundledtl.type == '4' || bundledtl.type == '5' || bundledtl.type == '6' || bundledtl.type == '8' || bundledtl.type == '9') {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.bgcolor + '; opacity:' + bundledtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
		bundledtlhtml += '</div>';
	} else if (bundledtl.type == '1') {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.bgcolor + '; opacity:' + bundledtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		if (bundledtl.direction == 4) {
			bundledtlhtml += '<marquee class="bundle-font" bundledtlindex="' + bundledtlindex + '" direction="left" behavior="scroll" scrollamount="1" scrolldelay="0" loop="-1" style="color:' + bundledtl.color + '; font-size:12px; ">';
			bundledtlhtml += text;
			bundledtlhtml += '</marquee>';
		} else {
			bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.color + '; font-size:12px; ">';
			bundledtlhtml += text;
			bundledtlhtml += '</p>';
		}
		bundledtlhtml += '</div>';
	} else if (bundledtl.type == '2') {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.bgcolor + '; opacity:' + bundledtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.color + '; font-size:12px; ">';
		bundledtlhtml += new Date().pattern(bundledtl.dateformat);
		bundledtlhtml += '</p>';
		bundledtlhtml += '</div>';
	} else if (bundledtl.type == '3') {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.bgcolor + '; opacity:' + bundledtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<div class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.color + '; font-size:12px; ">';
		bundledtlhtml += '深圳 20 ~ 17�? 多云转小�? ';
		bundledtlhtml += '<img src="http://api.map.baidu.com/images/weather/day/duoyun.png" />';
		bundledtlhtml += '<img src="http://api.map.baidu.com/images/weather/night/xiaoyu.png" />';
		bundledtlhtml += '</div>';
		bundledtlhtml += '</div>';
	} else if (bundledtl.type == '7') {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.bgcolor + '; opacity:' + bundledtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		if (bgimage != '') {
			bundledtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
		}
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.color + '; font-size:12px; ">';
		if (bundledtl.touchlabel != null) {
			bundledtlhtml += bundledtl.touchlabel;
		} else {
			bundledtlhtml += eval('common.view.region_type_7');
		}
		bundledtlhtml += '</p>';
		bundledtlhtml += '</div>';
	} else {
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; background:' + bundledtl.bgcolor + '; opacity:' + bundledtl.opacity/255 + '; "></div>';
		bundledtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.color + '; font-size:12px; ">';
		bundledtlhtml += eval('common.view.region_mainflag_' + bundledtl.mainflag) + eval('common.view.region_type_' + bundledtl.type);
		bundledtlhtml += '</p>';
		bundledtlhtml += '</div>';
	}
	div.html(bundledtlhtml);
}

function enterBundledtlFocus(bundledtl) {
	redrawBundle($('#BundleDiv'), CurrentBundle, bundledtl);
	$('#BundledtlEditForm').css('display' , 'block');
	$('.bundledtl-title').html(eval('common.view.region_mainflag_' + bundledtl.mainflag) + eval('common.view.region_type_' + bundledtl.type));
	
	if (CurrentBundledtl.objtype == 1) {
		$('.bundledtl-objtype').html(common.view.medialist);
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
				if (medialistdtl.objtype == 1) {
					mediatype = common.view.intvideo;
					medianame = medialistdtl.video.name;
					if (medialistdtl.video.thumbnail == null) {
						thumbnail = '/pixsignage/img/video.jpg';
					} else {
						thumbnail = '/pixsigndata' + medialistdtl.video.thumbnail;
					}
					thumbhtml += '<a href="/pixsigndata/video/preview/' + medialistdtl.video.videoid + '.mp4" class="fancybox">';
					thumbhtml += '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%"></div></a>';
				} else if (medialistdtl.objtype == 2) {
					mediatype = common.view.image;
					medianame = medialistdtl.image.name;
					thumbwidth = medialistdtl.image.width > medialistdtl.image.height? 100 : 100*medialistdtl.image.width/medialistdtl.image.height;
					thumbnail = '/pixsigndata' + medialistdtl.image.thumbnail;
					thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + medianame + '"></div>';
				} else {
					mediatype = common.view.unknown;
				}
				$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, mediatype, thumbhtml, medianame]);
			}
			$('.fancybox').click(function() {
				var myVideo = this.href;
				$.fancybox({
					openEffect	: 'none',
					closeEffect	: 'none',
					closeBtn : false,
		            padding : 0,
		            content: '<div id="video_container">Loading the player ... </div>',
		            afterShow: function(){
		            	jwplayer.key='rMF5t+PiENAlr4SobpLajtNkDjTaqzQToz13+5sNGLI=';
		                jwplayer('video_container').setup({ 
		                	stretching: 'fill',
		                	image: '/pixres/global/plugins/jwplayer/preview.jpg',
		                    file: myVideo,
		                    width: 760,
		                    height: 428,
		                    autostart: true,
		                    primary: 'flash', 
		                    bufferlength:10,
		                    flashplayer: '/pixres/global/plugins/jwplayer/jwplayer.flash.swf'
		                });
		            }
		        });
		        return false;
			});
		}
	} else if (CurrentBundledtl.objtype == 2) {
		$('.bundledtl-objvalue').css('display', 'block');
		$('.bundledtl-medialist').css('display', 'none');
		$('.bundledtl-objtype').html('文本');
		$('.bundledtl-objvalue').html(CurrentBundledtl.text.text);
	} else if (CurrentBundledtl.objtype == 3) {
		$('.bundledtl-objvalue').css('display', 'block');
		$('.bundledtl-medialist').css('display', 'none');
		$('.bundledtl-objtype').html('视频�?');
		$('.bundledtl-objvalue').html(CurrentBundledtl.stream.url);
	} else if (CurrentBundledtl.objtype == 5) {
		$('.bundledtl-objvalue').css('display', 'block');
		$('.bundledtl-medialist').css('display', 'none');
		$('.bundledtl-objtype').html('Widget');
		$('.bundledtl-objvalue').html(CurrentBundledtl.widget.url);
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
	var scale = CurrentBundle.width / $('#BundleDiv').width();
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

