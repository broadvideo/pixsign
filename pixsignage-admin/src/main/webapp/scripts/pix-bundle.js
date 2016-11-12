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
		if (aData.reviewflag == 0) {
			bundlehtml += '<h6><span class="label label-sm label-default">' + common.view.review_wait + '</span>';
		} else if (aData.reviewflag == 1) {
			bundlehtml += '<h6><span class="label label-sm label-success">' + common.view.review_passed + '</span>';
		} else if (aData.reviewflag == 2) {
			bundlehtml += '<h6><span class="label label-sm label-danger">' + common.view.review_rejected + '</span>';
		}

		bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="fancybox">';
		bundlehtml += '<div class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.layout.width > aData.layout.height? 100 : 100*aData.layout.width/aData.layout.height;
			bundlehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		}
		bundlehtml += '</div></a>';

		bundlehtml += '<div privilegeid="101010">';
		bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-bundle"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		if (aData.reviewflag == 1) {
			bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-push"><i class="fa fa-desktop"></i> ' + common.view.device + '</a>';
			bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
			bundlehtml += '<a href="bundle!export.action?bundleid=' + aData.bundleid + '" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-export"><i class="fa fa-download"></i> ' + common.view.export + '</a>';
		}
		bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a> </div>';

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
		aoData.push({'name':'touchflag','value':'0' });
	}
});
jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').select2();

$.ajax({
	type : 'POST',
	url : 'layout!publiclist.action',
	data : {},
	success : function(data, status) {
		if (data.errorcode == 0) {
			var layouts = data.aaData;
			var layoutTableHtml = '';
			layoutTableHtml += '<tr>';
			for (var i=0; i<layouts.length; i++) {
				layoutTableHtml += '<td style="padding: 0px 20px 0px 0px;"><div id="LayoutDiv-' + layouts[i].layoutid + '"></div></td>';
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
				redrawLayoutPreview($('#LayoutDiv-' + layout.layoutid), layout, 200);
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
//FormValidateOption.rules['bundle.name'] = {};
//FormValidateOption.rules['bundle.name']['required'] = true;
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
	for (var i=0; i<CurrentBundle.bundledtls.length; i++) {
		var bundledtl = CurrentBundle.bundledtls[i];
		bundledtl.medialist0 = {};
		bundledtl.medialist0.medialistid = 0;
		bundledtl.medialist0.medialistdtls = [];
		bundledtl.medialist0.type = 0;
		bundledtl.text0 = {};
		bundledtl.text0.textid = 0;
		bundledtl.text0.type = 0;
		bundledtl.stream0 = {};
		bundledtl.stream0.streamid = 0;
		bundledtl.stream0.type = 0;
		bundledtl.widget0 = {};
		bundledtl.widget0.widgetid = 0;
		bundledtl.widget0.type = 0;
		if (bundledtl.type == 0 && bundledtl.objtype == 1 && bundledtl.medialist != null) {
			bundledtl.medialist0 = bundledtl.medialist;
		}
		if (bundledtl.type == 1 && bundledtl.objtype == 1 && bundledtl.medialist != null) {
			bundledtl.medialist1 = bundledtl.medialist;
		}
		if (bundledtl.type == 0 && bundledtl.objtype == 2 &&  bundledtl.text != null) {
			bundledtl.text0 = bundledtl.text;
		}
		if (bundledtl.type == 1 && bundledtl.objtype == 2 && bundledtl.text != null) {
			bundledtl.text1 = bundledtl.text;
		}
		if (bundledtl.type == 0 && bundledtl.objtype == 3 &&  bundledtl.stream != null) {
			bundledtl.stream0 = bundledtl.stream;
		}
		if (bundledtl.type == 1 && bundledtl.objtype == 3 && bundledtl.stream != null) {
			bundledtl.stream1 = bundledtl.stream;
		}
		if (bundledtl.type == 0 && bundledtl.objtype == 5 &&  bundledtl.widget != null) {
			bundledtl.widget0 = bundledtl.widget;
		}
		if (bundledtl.type == 1 && bundledtl.objtype == 5 && bundledtl.widget != null) {
			bundledtl.widget1 = bundledtl.widget;
		}

		if (bundledtl.type == 1 && bundledtl.objtype == 6 && bundledtl.dvb != null) {
			bundledtl.dvb1 = bundledtl.dvb;
		}
	}
	CurrentBundleid = CurrentBundle.bundleid;
	CurrentBundledtl = CurrentBundle.bundledtls[0];
	
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	if (CurrentBundle.layout.width > CurrentBundle.layout.height) {
		$('#BundleCol1').attr('class', 'col-md-3 col-sm-3');
		$('#BundleCol2').attr('class', 'col-md-9 col-sm-9');
	} else {
		$('#BundleCol1').attr('class', 'col-md-2 col-sm-2');
		$('#BundleCol2').attr('class', 'col-md-10 col-sm-10');
	}
	
	$('#BundleModal').modal();
});

$('#BundleModal').on('shown.bs.modal', function (e) {
	enterBundledtlFocus(CurrentBundledtl);
	initMediaBranchTree();
})


//在设计对话框中进行提交
$('[type=submit]', $('#BundleModal')).on('click', function(event) {
	if (CurrentBundledtl != null && validBundledtl(CurrentBundledtl)) {

		$('#snapshot_div').show();
		redrawBundlePreview($('#snapshot_div'), CurrentBundle, 512, 0);
		html2canvas($('#snapshot_div'), {
			onrendered: function(canvas) {
				//console.log(canvas.toDataURL());
				CurrentBundle.snapshotdtl = canvas.toDataURL();
				$('#snapshot_div').hide();

				for (var i=0; i<CurrentBundle.bundledtls.length; i++) {
					var bundledtl = CurrentBundle.bundledtls[i];
					bundledtl.layoutdtl = undefined;
					bundledtl.medialist0 = undefined;
					bundledtl.text0 = undefined;
					bundledtl.widget0 = undefined;
					bundledtl.stream0 = undefined;
					if (bundledtl.medialist != undefined) {
						for (var j=0; j<bundledtl.medialist.medialistdtls.length; j++) {
							var medialistdtl = bundledtl.medialist.medialistdtls[j];
							medialistdtl.image = undefined;
							medialistdtl.video = undefined;
							medialistdtl.stream = undefined;
						}
					} 
				}
				CurrentBundle.layout = undefined;
				
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
		data : '{"bundle": { "bundleid":' + CurrentBundle.bundleid + '}, "devices":' + $.toJSON(SelectedDeviceList) + ', "devicegroups":' + $.toJSON(SelectedDevicegroupList) + '}',
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

