var myurls = {
	'common.list' : 'devicegroup!list.action',
	'common.add' : 'devicegroup!add.action',
	'common.update' : 'devicegroup!update.action',
	'common.delete' : 'devicegroup!delete.action',
	'device.list' : 'device!list.action',
	'devicegroup.deviceadd' : 'devicegroup!deviceadd.action',
	'devicegroup.devicedelete' : 'devicegroup!devicedelete.action',
	'devicegroup.sync' : 'devicegroup!sync.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

function initMyTable() {
	var oTable = $('#MyTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '15%' },
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
			for (var i=0; i<aData.devices.length; i++) {
				listhtml += aData.devices[i].name + ' ';
			}
			$('td:eq(1)', nRow).html(listhtml);
			
			$('td:eq(2)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>');
			$('td:eq(3)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-detail"><i class="fa fa-list-ul"></i> ' + common.view.detail + '</a>');
			$('td:eq(4)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
			$('td:eq(5)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':CurBranchid });
		}
	});

	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	$('#MyTable').css('width', '100%');

	var currentItem;
	$('body').on('click', '.pix-delete', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		currentItem = item;
		
		bootbox.confirm(common.tips.remove + currentItem.name + '"', function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : myurls['common.delete'],
					cache: false,
					data : {
						'devicegroup.devicegroupid': currentItem['devicegroupid']
					},
					success : function(data, status) {
						if (data.errorcode == 0) {
							refreshMyTable();
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
	
	$('body').on('click', '.pix-sync', function(event) {
		var target = $(event.target);
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			target = $(event.target).parent();
			index = $(event.target).parent().attr('data-id');
		}
		currentItem = $('#MyTable').dataTable().fnGetData(index);
		bootbox.confirm(common.tips.sync + currentItem.name + '"', function(result) {
			if (result == true) {
				$.ajax({
					type : 'GET',
					url : myurls['devicegroup.sync'],
					cache: false,
					data : {
						devicegroupid: currentItem.devicegroupid,
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
}

function initMyEditModal() {
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	FormValidateOption.rules['devicegroup.name'] = {};
	FormValidateOption.rules['devicegroup.name']['required'] = true;
	FormValidateOption.rules['devicegroup.name']['minlength'] = 2;
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
		$('#MyEditForm input[name="devicegroup.branchid"]').val(CurBranchid);
		$('#MyEditModal').modal();
	});			

	
	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in item) {
			formdata['devicegroup.' + name] = item[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', myurls['common.update']);
		$('#MyEditModal').modal();
	});

}

//==============================终端组明细对话框====================================			
function initDevicegpDtlModal() {
	var currentDevicegroupid = 0;
	
	$('body').on('click', '.pix-detail', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var data = $('#MyTable').dataTable().fnGetData(index);
		currentDevicegroupid = data.devicegroupid;
		
		$('#DeviceTable').dataTable()._fnAjaxUpdate();
		$('#DevicegpDtlTable').dataTable()._fnAjaxUpdate();
		
		$('#DevicegpDtlModal').modal();
	});
	
	//待选择终端table初始化
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
			var data = $('#DeviceTable').dataTable().fnGetData(iDisplayIndex);
			$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-adddevicegpdtl">' + common.view.add + '</button>');
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':CurBranchid });
			aoData.push({'name':'devicegroupid','value':'0' })
		} 
	});

	jQuery('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
	jQuery('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
	
	
	//已加入终端table初始化
	$('#DevicegpDtlTable').dataTable({
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
			var data = $('#DevicegpDtlTable').dataTable().fnGetData(iDisplayIndex);
			$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-deletedevicegpdtl">' + common.view.remove + '</button>');
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':CurBranchid });
			aoData.push( {'name':'devicegroupid','value':currentDevicegroupid })
		} 
	});

	jQuery('#DevicegpDtlTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
	jQuery('#DevicegpDtlTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
	


	//选择终端加入终端组
	$('body').on('click', '.pix-adddevicegpdtl', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var data = $('#DeviceTable').dataTable().fnGetData(index);
		$.ajax({
			type : 'POST',
			url : myurls['devicegroup.deviceadd'],
			data : {
				'devicegroup.devicegroupid' : currentDevicegroupid,
				'device.deviceid' : data.deviceid
			},
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#DeviceTable').dataTable()._fnAjaxUpdate();
					$('#DevicegpDtlTable').dataTable()._fnAjaxUpdate();
					refreshMyTable();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert(common.tips.error);
			}
		});
	});

	
	//区域媒体列表选择对话框中，删除区域列表某行
	$('body').on('click', '.pix-deletedevicegpdtl', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var data = $('#DevicegpDtlTable').dataTable().fnGetData(index);
		$.ajax({
			type : 'POST',
			url : myurls['devicegroup.devicedelete'],
			data : {
				'devicegroup.devicegroupid' : currentDevicegroupid,
				'device.deviceid' : data.deviceid
			},
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#DeviceTable').dataTable()._fnAjaxUpdate();
					$('#DevicegpDtlTable').dataTable()._fnAjaxUpdate();
					refreshMyTable();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert(common.tips.error);
			}
		});
	});
	
}
