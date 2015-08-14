var myurls = {
	'common.list' : 'devicegroup!list.action',
	'common.add' : 'devicegroup!add.action',
	'common.update' : 'devicegroup!update.action',
	'common.delete' : 'devicegroup!delete.action',
	'device.list' : 'device!availlist.action',
	'devicegroupdtl.list' : 'devicegroupdtl!list.action',
	'devicegroupdtl.add' : 'devicegroupdtl!add.action',
	'devicegroupdtl.delete' : 'devicegroupdtl!delete.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

function initMyTable() {
	var oTable = $('#MyTable').dataTable({
		'sDom' : "<'row'<'col-md-6 col-sm-12'l><'col-md-12 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", //default layout without horizontal scroll(remove this setting to enable horizontal scroll for the table)
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [ {"sTitle" : "名称", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "创建者", "mData" : "createstaff.name", "bSortable" : false }, 
						{"sTitle" : "创建时间", "mData" : "createtime", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "devicegroupid", "bSortable" : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var dropdownBtn = '<div class="btn-group">';
			dropdownBtn += '<a class="btn default btn-sm blue" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">操作  <i class="fa fa-angle-down"></i></a>';
			dropdownBtn += '<ul class="dropdown-menu pull-right">';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-update"><i class="fa fa-edit"></i> 编辑</a></li>';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-detail"><i class="fa fa-list-ul"></i> 明细</a></li>';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-delete"><i class="fa fa-trash-o"></i> 删除</a></li>';
			dropdownBtn += '</ul></div>';
			$('td:eq(3)', nRow).html(dropdownBtn);
			return nRow;
		}
	});

    jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small'); // modify table search input
    jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small'); // modify table per page dropdown
    jQuery('#MyTable_wrapper .dataTables_length select').select2(); // initialize select2 dropdown
	
    
	var currentItem;
	$('body').on('click', '.pix-delete', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		var action = myurls['common.delete'];
		currentItem = item;
		
		bootbox.confirm('请确认是否删除"' + currentItem.name + '"', function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : action,
					cache: false,
					data : {
						'ids': currentItem['devicegroupid']
					},
					success : function(data, status) {
						if (data.errorcode == 0) {
							refreshMyTable();
						} else {
							bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
						}
					},
					error : function() {
						bootbox.alert('出错了！');
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
					bootbox.alert('操作成功');
					refreshMyTable();
				} else {
					bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert('出错了!');
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
		$('#MyEditModal').modal();
	});			

	
	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var data = $('#MyTable').dataTable().fnGetData(index);
		var action = myurls['common.update'];
		var formdata = new Object();
		for (var name in data) {
			formdata['devicegroup.' + name] = data[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', action);
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
		"sDom" : "<'row'<'col-md-6 col-sm-12'l><'col-md-12 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", //default layout without horizontal scroll(remove this setting to enable horizontal scroll for the table)
		"aLengthMenu" : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		"bProcessing" : true,
		"bServerSide" : true,
		"sAjaxSource" : myurls['device.list'],
		"aoColumns" : [ {'sTitle' : '终端ID', 'mData' : 'terminalid', 'bSortable' : false }, 
		                {'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : '位置', 'mData' : 'position', 'bSortable' : false }, 
						{'sTitle' : '终端类型', 'mData' : 'type', 'bSortable' : false }, 
						{'sTitle' : '操作', 'mData' : 'deviceid', 'bSortable' : false }],
		"iDisplayLength" : 10,
		"sPaginationType" : "bootstrap",
		"oLanguage" : DataTableLanguage,
		"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
			var data = $('#DeviceTable').dataTable().fnGetData(iDisplayIndex);
			if (data['type'] == 1) {
				$('td:eq(3)', nRow).html('普通终端');
			} else if (data['type'] == 2) {
				$('td:eq(3)', nRow).html('安卓终端');
			}
			$('td:eq(4)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-adddevicegpdtl">增加</button>');
			return nRow;
		},
		'fnServerParams': function(aoData) { 
	        aoData.push( {'name':'devicegroupid','value':currentDevicegroupid })
	    } 
	});

	jQuery('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); // modify table search input
	jQuery('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small'); // modify table per page dropdown
	
	
	//已加入终端table初始化
	$('#DevicegpDtlTable').dataTable({
		'sDom' : "<'row'<'col-md-6 col-sm-12'l><'col-md-12 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", //default layout without horizontal scroll(remove this setting to enable horizontal scroll for the table)
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['devicegroupdtl.list'],
		'aoColumns' : [ {'sTitle' : '终端ID', 'mData' : 'device.terminalid', 'bSortable' : false }, 
		                {'sTitle' : '名称', 'mData' : 'device.name', 'bSortable' : false }, 
						{'sTitle' : '位置', 'mData' : 'device.position', 'bSortable' : false }, 
						{'sTitle' : '终端类型', 'mData' : 'device.type', 'bSortable' : false }, 
						{'sTitle' : '操作', 'mData' : 'devicegroupdtlid', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var data = $('#DevicegpDtlTable').dataTable().fnGetData(iDisplayIndex);
			if (data.device.type == 1) {
				$('td:eq(3)', nRow).html('普通终端');
			} else if (data.device.type == 2) {
				$('td:eq(3)', nRow).html('安卓终端');
			}
			$('td:eq(4)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-deletedevicegpdtl">移除</button>');
			return nRow;
		},
		'fnServerParams': function(aoData) { 
            aoData.push( {'name':'devicegroupid','value':currentDevicegroupid })
        } 
	});

	jQuery('#DevicegpDtlTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); // modify table search input
	jQuery('#DevicegpDtlTable_wrapper .dataTables_length select').addClass('form-control input-small'); // modify table per page dropdown
	


	//选择终端加入终端组
	$('body').on('click', '.pix-adddevicegpdtl', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var data = $('#DeviceTable').dataTable().fnGetData(index);
		$.ajax({
			type : 'POST',
			url : myurls['devicegroupdtl.add'],
			data : {
				'devicegroupdtl.deviceid' : data.deviceid,
				'devicegroupdtl.devicegroupid' : currentDevicegroupid
			},
			success : function(data, status) {
				if (data.errorcode == 0) {
					bootbox.alert('操作成功');
					$('#DeviceTable').dataTable()._fnAjaxUpdate();
					$('#DevicegpDtlTable').dataTable()._fnAjaxUpdate();
				} else {
					bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert('出错了!');
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
			url : myurls['devicegroupdtl.delete'],
			data : {
				'devicegroupdtl.deviceid' : data.deviceid,
				'devicegroupdtl.devicegroupdtlid' : data.devicegroupdtlid
				//'ids' : data.devicegroupdtlid
			},
			success : function(data, status) {
				if (data.errorcode == 0) {
					bootbox.alert('操作成功');
					$('#DeviceTable').dataTable()._fnAjaxUpdate();
					$('#DevicegpDtlTable').dataTable()._fnAjaxUpdate();
				} else {
					bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert('出错了!');
			}
		});
	});
	
}
