var myurls = {
	'common.list' : 'devicegroup!list.action',
	'common.add' : 'devicegroup!add.action',
	'common.update' : 'devicegroup!update.action',
	'common.delete' : 'devicegroup!delete.action',
	'devicegrid.list' : 'devicegrid!list.action',
	'devicegroup.adddevicegrids' : 'devicegroup!adddevicegrids.action',
	'devicegroup.deletedevicegrids' : 'devicegroup!deletedevicegrids.action',
	'devicegroup.sync' : 'devicegroup!sync.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

var CurrentDevicegroup;
var CurrentDevicegroupid = 0;

var timestamp = new Date().getTime();

var oTable = $('#MyTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 10, 25, 50, 100 ],
					[ 10, 25, 50, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : myurls['common.list'],
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' },
					{'sTitle' : common.view.detail, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '65%' },
					{'sTitle' : common.view.schedule, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '5%' },
					{'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '5%' },
					{'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '5%' },
					{'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '5%' }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		var listhtml = '';
		for (var i=0; i<aData.devicegrids.length; i++) {
			var devicegrid = aData.devicegrids[i];
			if (i % 6 == 0) {
				listhtml += '<div class="row" >';
			}
			listhtml += '<div class="col-md-2 col-xs-2">';
			listhtml += '<a href="/pixsigdata' + devicegrid.snapshot + '?t=' + timestamp + '" class="fancybox">';
			listhtml += '<div class="thumbs">';
			var thumbwidth = devicegrid.width > devicegrid.height? 100 : 100*devicegrid.width/devicegrid.height;
			listhtml += '<img src="/pixsigdata' + devicegrid.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" />';
			listhtml += '</div>';
			listhtml += '</a>';
			listhtml += '<h6 class="pixtitle">' + devicegrid.name + '</h6>';
			listhtml += '</div>';
			if ((i+1) % 6 == 0 || (i+1) == aData.devicegrids.length) {
				listhtml += '</div>';
			}
		}
		$('td:eq(1)', nRow).html(listhtml);
		
		$('td:eq(2)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>');
		$('td:eq(3)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-detail"><i class="fa fa-list-ul"></i> ' + common.view.detail + '</a>');
		$('td:eq(4)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
		$('td:eq(5)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#MyTable .thumbs').each(function(i) {
			$(this).width($(this).parent().closest('div').width());
			$(this).height($(this).parent().closest('div').width());
		});
		$("#MyTable .fancybox").fancybox({
			openEffect	: 'none',
			closeEffect	: 'none',
			closeBtn : false,
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurBranchid });
		aoData.push({'name':'type','value':'2' });
	}
});

$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
$('#MyTable_wrapper .dataTables_length select').select2();
$('#MyTable').css('width', '100%');

$.ajax({
	type : 'POST',
	url : 'gridlayout!list.action',
	data : {},
	success : function(data, status) {
		if (data.errorcode == 0) {
			var gridlayouts = data.aaData;
			var gridlayoutTableHtml = '';
			gridlayoutTableHtml += '<tr>';
			for (var i=0; i<gridlayouts.length; i++) {
				gridlayoutTableHtml += '<td style="padding: 0px 20px 0px 0px;"><div id="GridlayoutDiv-' + gridlayouts[i].gridlayoutid + '"></div></td>';
			}
			gridlayoutTableHtml += '</tr>';
			gridlayoutTableHtml += '<tr>';
			for (var i=0; i<gridlayouts.length; i++) {
				gridlayoutTableHtml += '<td>';
				gridlayoutTableHtml += '<label class="radio-inline">';
				if (i == 0) {
					gridlayoutTableHtml += '<input type="radio" name="devicegroup.gridlayoutcode" value="' + gridlayouts[i].gridlayoutcode + '" checked>';
				} else {
					gridlayoutTableHtml += '<input type="radio" name="devicegroup.gridlayoutcode" value="' +gridlayouts[i].gridlayoutcode + '">';
				}
				if (gridlayouts[i].ratio == 1) {
					gridlayoutTableHtml += gridlayouts[i].xcount + 'x' + gridlayouts[i].ycount + '(16:9)';
				} else {
					gridlayoutTableHtml += gridlayouts[i].xcount + 'x' + gridlayouts[i].ycount + '(9:16)';
				}
				gridlayoutTableHtml += '</label></td>';
			}
			gridlayoutTableHtml += '</tr>';
			$('#GridlayoutTable').html(gridlayoutTableHtml);
			for (var i=0; i<gridlayouts.length; i++) {
				var gridlayout = gridlayouts[i];
				redrawGridlayout($('#GridlayoutDiv-' + gridlayout.gridlayoutid), gridlayout, 200);
			}
		} else {
			bootbox.alert(common.tips.error + data.errormsg);
		}
	},
	error : function() {
		console.log('failue');
	}
});

function redrawGridlayout(div, gridlayout, maxsize) {
	div.empty();
	div.attr('style', 'position:relative; margin-left:0; margin-right:auto; border: 0px solid #000; background:#FFFFFF;');
	for (var i=0; i<gridlayout.xcount; i++) {
		for (var j=0; j<gridlayout.ycount; j++) {
			var html = '<div style="position: absolute; width:' + (100/gridlayout.xcount);
			html += '%; height:' + (100/gridlayout.ycount);
			html += '%; left: ' + (i*100/gridlayout.xcount);
			html += '%; top: ' + (j*100/gridlayout.ycount);
			html += '%; border: 1px dotted #000; ">';
			div.append(html);
		}
	}
	var scale, width, height;
	if (gridlayout.width > gridlayout.height ) {
		width = maxsize;
		scale = gridlayout.width / width;
		height = gridlayout.height / scale;
		div.css('width' , width);
		div.css('height' , height);
	} else {
		height = maxsize;
		scale = gridlayout.height / height;
		width = gridlayout.width / scale;
		div.css('width' , width);
		div.css('height' , height);
	}
}

$('body').on('click', '.pix-delete', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentDevicegroup = $('#MyTable').dataTable().fnGetData(index);
	CurrentDevicegroupid = CurrentDevicegroup.devicegroupid;
	
	bootbox.confirm(common.tips.remove + CurrentDevicegroup.name + '"', function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : myurls['common.delete'],
				cache: false,
				data : {
					devicegroupid: CurrentDevicegroup.devicegroupid,
				},
				success : function(data, status) {
					if (data.errorcode == 0) {
						refreshMyTable();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});				
		}
	 });
});

$('body').on('click', '.pix-sync', function(event) {
	var target = $(event.target);
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		target = $(event.target).parent();
		index = $(event.target).parent().attr('data-id');
	}
	CurrentDevicegroup = $('#MyTable').dataTable().fnGetData(index);
	CurrentDevicegroupid = CurrentDevicegroup.devicegroupid;
	bootbox.confirm(common.tips.sync + CurrentDevicegroup.name + '"', function(result) {
		if (result == true) {
			$.ajax({
				type : 'GET',
				url : myurls['devicegroup.sync'],
				cache: false,
				data : {
					devicegroupid: CurrentDevicegroup.devicegroupid,
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
					console.log('failue');
				}
			});				
		}
	});
});

OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();

FormValidateOption.rules['devicegroup.name'] = {};
FormValidateOption.rules['devicegroup.name']['required'] = true;
FormValidateOption.submitHandler = function(form) {
	$.ajax({
		type : 'POST',
		url : $('#MyEditForm').attr('action'),
		data : $('#MyEditForm').serialize(),
		success : function(data, status) {
			if (data.errorcode == 0) {
				$('#MyEditModal').modal('hide');
				bootbox.alert(common.tips.success);
				refreshMyTable();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
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
	$('.gridlayout').css('display', '');
	$('#MyEditForm input[name="devicegroup.branchid"]').val(CurBranchid);
	$('#MyEditModal').modal();
});			


$('body').on('click', '.pix-update', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentDevicegroup = $('#MyTable').dataTable().fnGetData(index);
	CurrentDevicegroupid = CurrentDevicegroup.devicegroupid;
	var formdata = new Object();
	for (var name in CurrentDevicegroup) {
		formdata['devicegroup.' + name] = CurrentDevicegroup[name];
	}
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', myurls['common.update']);
	$('.gridlayout').css('display', 'none');
	$('#MyEditModal').modal();
});

//==============================终端组明细对话框====================================			
var selectedDevicegrids = [];
var selectedDevicegpDtls = [];

$('body').on('click', '.pix-detail', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentDevicegroup = $('#MyTable').dataTable().fnGetData(index);
	CurrentDevicegroupid = CurrentDevicegroup.devicegroupid;
	
	selectedDevicegrids = [];
	selectedDevicegpDtls = [];
	$('#DevicegridTable').dataTable()._fnAjaxUpdate();
	$('#DevicegpDtlTable').dataTable()._fnAjaxUpdate();
	
	$('#DevicegpDtlModal').modal();
});

//待选择终端格table初始化
$('#DevicegridTable').dataTable({
	'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 20, 40, 60, 100 ],
					[ 20, 40, 60, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : myurls['devicegrid.list'],
	'aoColumns' : [ {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'devicegridid', 'bSortable' : false }, 
	                {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.detail, 'mData' : 'devicegridid', 'bSortable' : false }],
	'iDisplayLength' : 20,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
		if ( $.inArray(aData.devicegridid, selectedDevicegrids) >= 0 ) {
			$(nRow).addClass('active');
			$('td:eq(0)', nRow).html('<input type="checkbox" id="DevicegridCheck' + aData.devicegridid + '" checked />');
		} else {
			$('td:eq(0)', nRow).html('<input type="checkbox" id="DevicegridCheck' + aData.devicegridid + '" />');
		}
		var detailhtml = '';
		detailhtml += '<a href="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="fancybox">';
		detailhtml += '<div class="thumbs">';
		var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
		detailhtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '" />';
		detailhtml += '</div>';
		detailhtml += '</a>';
		$('td:eq(2)', nRow).html(detailhtml);
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$("#DevicegridTable .fancybox").fancybox({
			openEffect	: 'none',
			closeEffect	: 'none',
			closeBtn : false,
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurBranchid });
		if (CurrentDevicegroup != null) {
			aoData.push({'name':'gridlayoutcode','value':CurrentDevicegroup.gridlayoutcode });
		}
		aoData.push({'name':'devicegroupid','value':'0' });
	} 
});

//已加入终端格table初始化
$('#DevicegpDtlTable').dataTable({
	'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 20, 40, 60, 100 ],
					[ 20, 40, 60, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : myurls['devicegrid.list'],
	'aoColumns' : [ {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'devicegridid', 'bSortable' : false }, 
	                {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.detail, 'mData' : 'devicegridid', 'bSortable' : false }],
	'iDisplayLength' : 20,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		if ( $.inArray(aData.devicegridid, selectedDevicegpDtls) >= 0 ) {
			$(nRow).addClass('active');
			$('td:eq(0)', nRow).html('<input type="checkbox" id="DevicegpDtlCheck' + aData.devicegridid + '" checked />');
		} else {
			$('td:eq(0)', nRow).html('<input type="checkbox" id="DevicegpDtlCheck' + aData.devicegridid + '" />');
		}
		var detailhtml = '';
		detailhtml += '<a href="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="fancybox">';
		detailhtml += '<div class="thumbs">';
		var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
		detailhtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '" />';
		detailhtml += '</div>';
		detailhtml += '</a>';
		$('td:eq(2)', nRow).html(detailhtml);
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$("#DevicegpDtlTable .fancybox").fancybox({
			openEffect	: 'none',
			closeEffect	: 'none',
			closeBtn : false,
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurBranchid });
		if (CurrentDevicegroup != null) {
			aoData.push({'name':'gridlayoutcode','value':CurrentDevicegroup.gridlayoutcode });
		}
		aoData.push({'name':'devicegroupid','value':CurrentDevicegroupid });
	} 
});

$('#DevicegridTable').on('click', 'tr', function () {
	var row = $('#DevicegridTable').dataTable().fnGetData(this);
	if (row == null) return;
	var devicegridid = row.devicegridid;
	var index = $.inArray(devicegridid, selectedDevicegrids);
	if (index >= 0) {
		selectedDevicegrids.splice(index, 1);
		$('#DevicegridCheck'+devicegridid).prop('checked', false);
	} else {
		selectedDevicegrids.push(devicegridid);
		$('#DevicegridCheck'+devicegridid).prop('checked', true);
	}
	$(this).toggleClass('active');
});
$('#CheckAll', $('#DevicegridTable')).on('click', function() {
	var rows = $("#DevicegridTable").dataTable().fnGetNodes();
	for (var i=0; i<rows.length; i++) {
		var devicegridid = $('#DevicegridTable').dataTable().fnGetData(rows[i]).devicegridid;
		if (this.checked) {
			$(rows[i]).addClass('active');
		} else {
			$(rows[i]).removeClass('active');
		}
		$('#DevicegridCheck'+devicegridid).prop('checked', this.checked);
		var index = $.inArray(devicegridid, selectedDevicegrids);
		if (index == -1 && this.checked) {
			selectedDevicegrids.push(devicegridid);
		} else if (index >= 0 && !this.checked) {
			selectedDevicegrids.splice(index, 1);
		}
    }
} );

$('#DevicegpDtlTable').on('click', 'tr', function () {
	var row = $('#DevicegpDtlTable').dataTable().fnGetData(this);
	if (row == null) return;
	var devicegridid = row.devicegridid;
	var index = $.inArray(devicegridid, selectedDevicegpDtls);
	if (index >= 0) {
		selectedDevicegpDtls.splice(index, 1);
		$('#DevicegpDtlCheck'+devicegridid).prop('checked', false);
	} else {
		selectedDevicegpDtls.push(devicegridid);
		$('#DevicegpDtlCheck'+devicegridid).prop('checked', true);
	}
	$(this).toggleClass('active');
});
$('#CheckAll', $('#DevicegpDtlTable')).on('click', function() {
	var rows = $("#DevicegpDtlTable").dataTable().fnGetNodes();
	for (var i=0; i<rows.length; i++) {
		var devicegridid = $('#DevicegpDtlTable').dataTable().fnGetData(rows[i]).devicegridid;
		if (this.checked) {
			$(rows[i]).addClass('active');
		} else {
			$(rows[i]).removeClass('active');
		}
		$('#DevicegpDtlCheck'+devicegridid).prop('checked', this.checked);
		var index = $.inArray(devicegridid, selectedDevicegpDtls);
		if (index == -1 && this.checked) {
			selectedDevicegpDtls.push(devicegridid);
		} else if (index >= 0 && !this.checked) {
			selectedDevicegpDtls.splice(index, 1);
		}
    }
} );

//选择终端加入终端组
$('body').on('click', '.pix-adddevicegpdtl', function(event) {
	$.ajax({
		type : 'POST',
		url : myurls['devicegroup.adddevicegrids'],
		data : '{"devicegroup":{"devicegroupid":' + CurrentDevicegroupid + '}, "detailids":' + $.toJSON(selectedDevicegrids) + '}',
		dataType : 'json',
		contentType : 'application/json;charset=utf-8',
		success : function(data, status) {
			if (data.errorcode == 0) {
				selectedDevicegrids = [];
				selectedDevicegpDtls = [];
				$('#DevicegridTable').dataTable()._fnAjaxUpdate();
				$('#DevicegpDtlTable').dataTable()._fnAjaxUpdate();
				refreshMyTable();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
});


//从终端组删除终端
$('body').on('click', '.pix-deletedevicegpdtl', function(event) {
	$.ajax({
		type : 'POST',
		url : myurls['devicegroup.deletedevicegrids'],
		data : '{"devicegroup":{"devicegroupid":' + CurrentDevicegroupid + '}, "detailids":' + $.toJSON(selectedDevicegpDtls) + '}',
		dataType : 'json',
		contentType : 'application/json;charset=utf-8',
		success : function(data, status) {
			if (data.errorcode == 0) {
				selectedDevicegrids = [];
				selectedDevicegpDtls = [];
				$('#DevicegridTable').dataTable()._fnAjaxUpdate();
				$('#DevicegpDtlTable').dataTable()._fnAjaxUpdate();
				refreshMyTable();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
});
