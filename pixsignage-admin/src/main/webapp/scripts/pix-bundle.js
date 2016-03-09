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
	if (CurrentBundle != null && e.target == this) {
		var width = Math.floor($("#BundleDiv").parent().width());
		var scale = CurrentBundle.width / width;
		var height = CurrentBundle.height / scale;
		$("#BundleDiv").css("width" , width);
		$("#BundleDiv").css("height" , height);
	}
	for (var i=0; i<$('#MyTable').dataTable().fnGetData().length; i++) {
		var bundle = $('#MyTable').dataTable().fnGetData(i);
		if (bundle.layout.width > bundle.layout.height ) {
			var width = Math.floor($('#BundleDiv-' + bundle.bundleid).parent().width());
			var scale = bundle.layout.width / width;
			var height = bundle.layout.height / scale;
			$('#BundleDiv-' + bundle.bundleid).css("width" , width);
			$('#BundleDiv-' + bundle.bundleid).css("height" , height);
		} else {
			var height = Math.floor($('#BundleDiv-' + bundle.bundleid).parent().width());
			var scale = bundle.layout.height / height;
			var width = bundle.layout.width / scale;
			$('#BundleDiv-' + bundle.bundleid).css("width" , width);
			$('#BundleDiv-' + bundle.bundleid).css("height" , height);
		}
	}
});

function redrawBundlePreview(div, bundle) {
	div.empty();
	div.attr('bundleid', bundle.bundleid);
	div.attr('style', 'position:relative; margin-left:0; margin-right:auto; border: 1px solid #000; background:#000000;');
	if (bundle.layout.bgimage != null) {
		div.append('<img class="layout-bg" src="/pixsigdata' + bundle.layout.bgimage.filepath+ '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
	}
	for (var i=0; i<bundle.bundledtls.length; i++) {
		div.append(generateBundledtlPreviewHtml(bundle, bundle.bundledtls[i]));
	}
}

function generateBundledtlPreviewHtml(bundle, bundledtl) {
	var bgimage = null;
	if (bundledtl.objtype == 1 && bundledtl.medialist.medialistdtls.length > 0) {
		var medialistdtl = bundledtl.medialist.medialistdtls[0];
		if (medialistdtl.objtype == 1 && medialistdtl.video.thumbnail != null) {
			bgimage = '/pixsigdata' + medialistdtl.video.thumbnail;
		} else if (medialistdtl.objtype == 2 && medialistdtl.image.filepath != null) {
			bgimage = '/pixsigdata' + medialistdtl.image.filepath;
		}
	}
	var bundledtlhtml = '';
	bundledtlhtml += '<div style="position: absolute; width:' + 100*bundledtl.layoutdtl.width/bundle.layout.width;
	bundledtlhtml += '%; height:' + 100*bundledtl.layoutdtl.height/bundle.layout.height;
	bundledtlhtml += '%; top: ' + 100*bundledtl.layoutdtl.topoffset/bundle.layout.height;
	bundledtlhtml += '%; left: ' + 100*bundledtl.layoutdtl.leftoffset/bundle.layout.width;
	bundledtlhtml += '%; border: 1px solid #000; background:' + bundledtl.layoutdtl.bgcolor;
	if (bundledtl.layoutdtl.region.type != 0) {
		bundledtlhtml += '; opacity:.' + bundledtl.layoutdtl.opacity + '; ">';
	} else {
		bundledtlhtml += '; ">';
	}
	bundledtlhtml += ' <div style="position:absolute; width:100%; height:100%; ">';
	if (bgimage != null) {
		bundledtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
	} else if (bundledtl.layoutdtl.bgimage != null) {
		bundledtlhtml += '<img src="/pixsigdata' + bundledtl.layoutdtl.bgimage.filepath+ '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
	}
	bundledtlhtml += '</div>';
	bundledtlhtml += '</div>';
	return bundledtlhtml;
}

function drawCanvasRegion(ctx, bundle, layoutdtl, left, top, width, height, fill) {
	var bgimage = null;
	if (bundle != null) {
		for (var i=0; i<bundle.bundledtls.length; i++) {
			var bundledtl = bundle.bundledtls[i];
			if (bundledtl.regionid == layoutdtl.regionid && bundledtl.objtype == 1 && bundledtl.medialist.medialistdtls.length > 0) {
				var medialistdtl = bundledtl.medialist.medialistdtls[0];
				if (medialistdtl.objtype == 1 && medialistdtl.video.thumbnail != null) {
					bgimage = '/pixsigdata' + medialistdtl.video.thumbnail;
				} else if (medialistdtl.objtype == 2 && medialistdtl.image.filepath != null) {
					bgimage = '/pixsigdata' + medialistdtl.image.filepath;
				}
			}
		}
	}
	if (bgimage != null) {
		var region_bgimage = new Image();
		region_bgimage.src = bgimage;
		region_bgimage.onload = function(img, ctx, left, top, width, height) {
			return function() {
				ctx.drawImage(img, left, top, width, height);
			}
		}(region_bgimage, ctx, left, top, width, height);
	} else if (layoutdtl.bgimage != null) {
		var region_bgimage = new Image();
		region_bgimage.src = '/pixsigdata' + layoutdtl.bgimage.filepath;
		region_bgimage.onload = function(img, ctx, left, top, width, height) {
			return function() {
				ctx.drawImage(img, left, top, width, height);
			}
		}(region_bgimage, ctx, left, top, width, height);
	} else {
		if (fill) {
			ctx.fillStyle = RegionColors[layoutdtl.regionid];
			ctx.fillRect(left,top,width,height);
		}
	}
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 2;
	ctx.strokeRect(left,top,width,height);
};

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
		bundlehtml += '<h3>' + aData.name + '</h3>';
		bundlehtml += '<div id="BundleDiv-'+ aData.bundleid + '"></div>';
		bundlehtml += '<div privilegeid="101010">';
		bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-bundle"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-push"><i class="fa fa-desktop"></i> ' + common.view.device + '</a>';
		bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
		bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a> </div>';

		bundlehtml += '</div>';
		if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
			bundlehtml += '</div>';
			if ((iDisplayIndex+1) != $('#MyTable').dataTable().fnGetData().length) {
				bundlehtml += '<hr/>';
			}
			$('#BundleContainer').append(bundlehtml);
		}
		if ((iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
			for (var i=0; i<$('#MyTable').dataTable().fnGetData().length; i++) {
				var bundle = $('#MyTable').dataTable().fnGetData(i);
				redrawBundlePreview($('#BundleDiv-' + bundle.bundleid), bundle);
				if (bundle.layout.width > bundle.layout.height ) {
					var width = Math.floor($('#BundleDiv-' + bundle.bundleid).parent().width());
					var scale = bundle.layout.width / width;
					var height = bundle.layout.height / scale;
					$('#BundleDiv-' + bundle.bundleid).css("width" , width);
					$('#BundleDiv-' + bundle.bundleid).css("height" , height);
				} else {
					var height = Math.floor($('#BundleDiv-' + bundle.bundleid).parent().width());
					var scale = bundle.layout.height / height;
					var width = bundle.layout.width / scale;
					$('#BundleDiv-' + bundle.bundleid).css("width" , width);
					$('#BundleDiv-' + bundle.bundleid).css("height" , height);
				}
			}
		}
		return nRow;
	}
});
jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').select2();

$.ajax({
	type : 'POST',
	url : 'layout!list.action',
	data : {},
	success : function(data, status) {
		if (data.errorcode == 0) {
			var layouts = data.aaData;
			var layoutTableHtml = '';
			layoutTableHtml += '<tr>';
			for (var i=0; i<layouts.length; i++) {
				layoutTableHtml += '<td style="padding: 0px 20px 0px 0px;"><canvas id="LayoutCanvas' + layouts[i].layoutid + '"></canvas></td>';
			}
			layoutTableHtml += '</tr>';
			layoutTableHtml += '<tr>';
			for (var i=0; i<layouts.length; i++) {
				layoutTableHtml += '<td>';
				layoutTableHtml += '<label class="radio-inline">';
				if (i == 0) {
					layoutTableHtml += '<input type="radio" name="bundle.layoutid" value="' + layouts[i].layoutid + '" checked>';
				} else {
					layoutTableHtml += '<input type="radio" name="bundle.layoutid" value="' +layouts[i].layoutid + '">';
				}
				layoutTableHtml += layouts[i].name + '</label>';
				layoutTableHtml += '</td>';
			}
			layoutTableHtml += '</tr>';
			$('#LayoutTable').html(layoutTableHtml);
			
			for (var i=0; i<layouts.length; i++) {
				var layout = layouts[i];
				var canvas = document.getElementById('LayoutCanvas' + layout.layoutid);
				var ctx = canvas.getContext('2d');
				var scale;
				if (layout.width == 1920 || layout.width == 1080) {
					scale = 1920/160;
				} else {
					scale = 800/160;
				}
				canvas.width = layout.width/scale;
				canvas.height = layout.height/scale;

				if (layout.bgimage != null) {
					var layout_bgimage = new Image();
					layout_bgimage.src = '/pixsigdata' + layout.bgimage.filepath;
					layout_bgimage.onload = function(img, layout, ctx, canvaswidth, canvasheight) {
						return function() {
							//ctx.globalAlpha = 0.2;
							ctx.drawImage(img, 0, 0, canvaswidth, canvasheight);
							for (var j=0; j<layout.layoutdtls.length; j++) {
								var layoutdtl = layout.layoutdtls[j];
								var width = layoutdtl.width/scale;
								var height = layoutdtl.height/scale;
								var top = layoutdtl.topoffset/scale;
								var left = layoutdtl.leftoffset/scale;
								drawCanvasRegion(ctx, null, layoutdtl, left, top, width, height, false);
							}
						}
					}(layout_bgimage, layout, ctx, canvas.width, canvas.height);
				} else {
					for (var j=0; j<layout.layoutdtls.length; j++) {
						var layoutdtl = layout.layoutdtls[j];
						var width = layoutdtl.width/scale;
						var height = layoutdtl.height/scale;
						var top = layoutdtl.topoffset/scale;
						var left = layoutdtl.leftoffset/scale;
						drawCanvasRegion(ctx, null, layoutdtl, left, top, width, height, true);
					}
				}
			}
		} else {
			alert(data.errorcode + ": " + data.errormsg);
		}
	},
	error : function() {
		alert('failure');
	}
});

OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
FormValidateOption.rules['bundle.name'] = {};
FormValidateOption.rules['bundle.name']['required'] = true;
FormValidateOption.submitHandler = function(form) {
	$.ajax({
		type : 'POST',
		url : $('#MyEditForm').attr('action'),
		data : $('#MyEditForm').serialize(),
		success : function(data, status) {
			if (data.errorcode == 0) {
				$('#MyEditModal').modal('hide');
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
$('#MyEditForm').validate(FormValidateOption);

$('[type=submit]', $('#MyEditModal')).on('click', function(event) {
	if ($('#MyEditForm').valid()) {
		$('#MyEditForm').submit();
	}
});

$('body').on('click', '.pix-add', function(event) {
	var action = myurls['common.add'];
	refreshForm('MyEditForm');
	$('#MyEditForm').attr('action', action);
	$('.bundle-layout').css('display', 'block');
	CurrentBundle = null;
	CurrentBundleid = 0;
	$('#MyEditModal').modal();
});			


$('body').on('click', '.pix-update', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentBundle = $('#MyTable').dataTable().fnGetData(index);
	CurrentBundleid = CurrentBundle.bundleid;

	var action = myurls['common.update'];
	var formdata = new Object();
	for (var name in CurrentBundle) {
		formdata['bundle.' + name] = CurrentBundle[name];
	}
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', action);
	$('.bundle-layout').css('display', 'none');
	$('#MyEditModal').modal();
});

$('body').on('click', '.pix-sync', function(event) {
	var target = $(event.target);
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		target = $(event.target).parent();
		index = $(event.target).parent().attr('data-id');
	}
	CurrentBundle = $('#MyTable').dataTable().fnGetData(index);
	CurrentBundleid = CurrentBundle.bundleid;
	bootbox.confirm(common.tips.synclayout, function(result) {
		if (result == true) {
			$.ajax({
				type : 'GET',
				url : 'bundle!sync.action',
				cache: false,
				data : {
					bundleid: CurrentBundleid,
				},
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				beforeSend: function ( xhr ) {
					Metronic.startPageLoading({animate: true});
				},
				success : function(data, status) {
					Metronic.stopPageLoading();
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					Metronic.stopPageLoading();
					bootbox.alert(common.tips.error);
				}
			});				
		}
	});
});

$('body').on('click', '.pix-delete', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentBundle = $('#MyTable').dataTable().fnGetData(index);
	CurrentBundleid = CurrentBundle.bundleid;
	var action = myurls['common.delete'];
	
	bootbox.confirm(common.tips.remove + CurrentBundle.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : action,
				cache: false,
				data : {
					'bundle.bundleid': CurrentBundleid
				},
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#MyTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					bootbox.alert(common.tips.error);
				}
			});				
		}
	 });
	
});


//在列表页面中点击内容包设计
$('body').on('click', '.pix-bundle', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentBundle = $('#MyTable').dataTable().fnGetData(index);
	CurrentBundleid = CurrentBundle.bundleid;
	
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	if (CurrentBundle.layout.width > CurrentBundle.layout.height) {
		$('#BundleCol1').removeClass('col-md-2');
		$('#BundleCol1').removeClass('col-sm-2');
		$('#BundleCol1').addClass('col-md-3');
		$('#BundleCol1').addClass('col-sm-3');
		$('#BundleCol2').removeClass('col-md-10');
		$('#BundleCol2').removeClass('col-sm-10');
		$('#BundleCol2').addClass('col-md-9');
		$('#BundleCol2').addClass('col-sm-9');
	} else {
		$('#BundleCol1').removeClass('col-md-3');
		$('#BundleCol1').removeClass('col-sm-3');
		$('#BundleCol1').addClass('col-md-2');
		$('#BundleCol1').addClass('col-sm-2');
		$('#BundleCol2').removeClass('col-md-9');
		$('#BundleCol2').removeClass('col-sm-9');
		$('#BundleCol2').addClass('col-md-10');
		$('#BundleCol2').addClass('col-sm-10');
	}
	
	$('#BundleDiv').attr('bundleid', CurrentBundle.bundleid);
	$('#BundleDiv').attr('style', 'position:relative; margin-left:auto; margin-right:auto; border: 1px solid #000; background:#000000;');
	redrawBundle();
	
	CurrentBundledtl = CurrentBundle.bundledtls[0];
	enterBundledtlFocus(CurrentBundledtl);
	
	$('#BundleModal').modal();
});

$('#BundleModal').on('shown.bs.modal', function (e) {
	if (CurrentBundle != null) {
		var width = Math.floor($("#BundleDiv").parent().width());
		var scale = CurrentBundle.layout.width / width;
		var height = CurrentBundle.layout.height / scale;
		$("#BundleDiv").css("width" , width);
		$("#BundleDiv").css("height" , height);
	}
})


//在设计对话框中进行提交
$('[type=submit]', $('#BundleModal')).on('click', function(event) {
	if (CurrentBundledtl != null && leaveBundledtlFocus(CurrentBundledtl)) {
		$.ajax({
			type : 'POST',
			url : myurls['bundle.design'],
			data : '{"bundle":' + $.toJSON(CurrentBundle) + '}',
			dataType : 'json',
			contentType : 'application/json;charset=utf-8',
			beforeSend: function ( xhr ) {
				Metronic.startPageLoading({animate: true});
			},
			success : function(data, status) {
				Metronic.stopPageLoading();
				$('#BundleModal').modal('hide');
				if (data.errorcode == 0) {
					bootbox.alert(common.tips.success);
					$('#MyTable').dataTable()._fnAjaxUpdate();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				$('#BundleModal').modal('hide');
				bootbox.alert(common.tips.error);
			}
		});

		event.preventDefault();
	}
});	


var SelectedDeviceList = [];
var SelectedDevicegroupList = [];

//编制计划对话框中的设备table初始化
$('#DeviceTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 20, 40, 60, 100 ],
					[ 20, 40, 60, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : myurls['device.list'],
	'aoColumns' : [ {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
					{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.position, 'mData' : 'position', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'deviceid', 'bSortable' : false }],
	'iDisplayLength' : 20,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-adddevice">' + common.view.add + '</button>');
		return nRow;
	},
	'fnServerParams': function(aoData) { 
		aoData.push( {'name':'devicegroupid','value':'0' })
	}
});
jQuery('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');

//编制计划对话框中的设备组table初始化
$('#DeviceGroupTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 20, 40, 60, 100 ],
					[ 20, 40, 60, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : myurls['devicegroup.list'],
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'devicegroupid', 'bSortable' : false }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(1)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-adddevicegroup">' + common.view.add + '</button>');
		return nRow;
	}
});
jQuery('#DeviceGroupTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#DeviceGroupTable_wrapper .dataTables_length select').addClass('form-control input-small');

//编制计划对话框中的右侧设备选择列表初始化
$('#SelectedDeviceTable').dataTable({
	'sDom' : 't',
	'iDisplayLength' : -1,
	'aoColumns' : [ {'sTitle' : '#', 'bSortable' : false }, 
					{'sTitle' : common.view.name, 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'bSortable' : false }],
	'oLanguage' : { 'sZeroRecords' : common.view.empty,
					'sEmptyTable' : common.view.empty }, 
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(2)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-deletedevice">' + common.view.remove + '</button>');
		return nRow;
	}
});

//编制计划对话框中的右侧设备组选择列表初始化
$('#SelectedDevicegroupTable').dataTable({
	'sDom' : 't',
	'iDisplayLength' : -1,
	'aoColumns' : [ {'sTitle' : '#', 'bSortable' : false }, 
					{'sTitle' : common.view.name, 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'bSortable' : false }],
	'oLanguage' : { 'sZeroRecords' : common.view.empty,
					'sEmptyTable' : common.view.empty }, 
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(2)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-deletedevicegroup">' + common.view.remove + '</button>');
		return nRow;
	}
});

//编制计划对话框中，增加终端到终端列表
$('body').on('click', '.pix-adddevice', function(event) {
	var data = $('#DeviceTable').dataTable().fnGetData($(event.target).attr('data-id'));
	
	var d = SelectedDeviceList.filter(function (el) {
		return el.deviceid == data.deviceid;
	});	
	if (d.length == 0) {
		var device = {};
		device.deviceid = data.deviceid;
		device.name = data.name;
		device.rate = data.rate;
		device.sequence = SelectedDeviceList.length + 1;
		
		SelectedDeviceList[SelectedDeviceList.length] = device;
		$('#SelectedDeviceTable').dataTable().fnAddData([device.sequence, device.name, device.deviceid]);
	}
});

//编制计划对话框中，增加终端组到终端组列表
$('body').on('click', '.pix-adddevicegroup', function(event) {
	var data = $('#DeviceGroupTable').dataTable().fnGetData($(event.target).attr('data-id'));
	
	var d = SelectedDevicegroupList.filter(function (el) {
		return el.devicegroupid == data.devicegroupid;
	});	
	if (d.length == 0) {
		var devicegroup = {};
		devicegroup.devicegroupid = data.devicegroupid;
		devicegroup.name = data.name;
		devicegroup.sequence = SelectedDevicegroupList.length + 1;
		
		SelectedDevicegroupList[SelectedDevicegroupList.length] = devicegroup;
		$('#SelectedDevicegroupTable').dataTable().fnAddData([devicegroup.sequence, devicegroup.name, devicegroup.devicegroupid]);
	}
});

//编制计划对话框中，删除设备列表某行
$('body').on('click', '.pix-deletedevice', function(event) {
	var rowIndex = $(event.target).attr('data-id');
	for (var i=rowIndex; i<$('#SelectedDeviceTable').dataTable().fnSettings().fnRecordsDisplay(); i++) {
		var data = $('#SelectedDeviceTable').dataTable().fnGetData(i);
		$('#SelectedDeviceTable').dataTable().fnUpdate(i, parseInt(i), 0);
	}
	$('#SelectedDeviceTable').dataTable().fnDeleteRow(rowIndex);
	
	for (var i=rowIndex; i<SelectedDeviceList.length; i++) {
		SelectedDeviceList[i].sequence = i;
	}
	SelectedDeviceList.splice(rowIndex, 1);
});

//编制计划对话框中，删除设备组列表某行
$('body').on('click', '.pix-deletedevicegroup', function(event) {
	var rowIndex = $(event.target).attr('data-id');
	for (var i=rowIndex; i<$('#SelectedDevicegroupTable').dataTable().fnSettings().fnRecordsDisplay(); i++) {
		var data = $('#SelectedDevicegroupTable').dataTable().fnGetData(i);
		$('#SelectedDevicegroupTable').dataTable().fnUpdate(i, parseInt(i), 0);
	}
	$('#SelectedDevicegroupTable').dataTable().fnDeleteRow(rowIndex);
	
	for (var i=rowIndex; i<SelectedDevicegroupList.length; i++) {
		SelectedDevicegroupList[i].sequence = i;
	}
	SelectedDevicegroupList.splice(rowIndex, 1);
});

//在列表页面中点击终端
$('body').on('click', '.pix-push', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentBundle = $('#MyTable').dataTable().fnGetData(index);
	CurrentBundleid = CurrentBundle.bundleid;
	
	$('#SelectedDeviceTable').dataTable().fnClearTable();
	$('#SelectedDevicegroupTable').dataTable().fnClearTable();
	SelectedDeviceList = [];
	SelectedDevicegroupList = [];
	$('#PushModal').modal();
});

//在终端对话框中进行提交
$('[type=submit]', $('#PushModal')).on('click', function(event) {
	$.ajax({
		type : 'POST',
		url : myurls['bundle.push'],
		data : '{"bundle":' + $.toJSON(CurrentBundle) + ', "devices":' + $.toJSON(SelectedDeviceList) + ', "devicegroups":' + $.toJSON(SelectedDevicegroupList) + '}',
		dataType : 'json',
		contentType : 'application/json;charset=utf-8',
		beforeSend: function ( xhr ) {
			Metronic.startPageLoading({animate: true});
		},
		success : function(data, status) {
			Metronic.stopPageLoading();
			$('#PushModal').modal('hide');
			if (data.errorcode == 0) {
				bootbox.alert(common.tips.success);
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			$('#PushModal').modal('hide');
			bootbox.alert(common.tips.error);
		}
	});

	event.preventDefault();
});	

