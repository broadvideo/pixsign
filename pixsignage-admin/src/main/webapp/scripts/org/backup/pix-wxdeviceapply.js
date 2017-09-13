var myurls = {
	'wxdeviceapply.list' : 'wxdeviceapply!list.action',
	'wxdeviceapply.add' : 'wxdeviceapply!add.action',
	'wxdeviceapply.refresh' : 'wxdeviceapply!refresh.action',
	'wxdevice.list' : 'wxdevice!list.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

var CurrentWxdeviceapply = null;
var CurrentWxdeviceapplyid = 0;

function initMyTable() {
	var oTable = $('#MyTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['wxdeviceapply.list'],
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '12%' },
						{'sTitle' : common.view.count, 'mData' : 'count', 'bSortable' : false, 'sWidth' : '8%' },
						{'sTitle' : common.view.applytime, 'mData' : 'applytime', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : common.view.status, 'mData' : 'status', 'bSortable' : false, 'sWidth' : '10%' },
						{'sTitle' : common.view.comment, 'mData' : 'comment', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : common.view.audittime, 'mData' : 'audittime', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : '', 'mData' : 'wxdeviceapplyid', 'bSortable' : false, 'sWidth' : '5%' },
						{'sTitle' : '', 'mData' : 'wxdeviceapplyid', 'bSortable' : false, 'sWidth' : '5%' }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			if (aData.status == '0') {
				$('td:eq(3)', nRow).html('<span class="label label-sm label-danger">' + common.view.review_rejected + '</span>');
			} else if (aData.status == '1') {
				$('td:eq(3)', nRow).html('<span class="label label-sm label-info">' + common.view.review_wait + '</span>');
			} else if (aData.status == '2') {
				$('td:eq(3)', nRow).html('<span class="label label-sm label-success">' + common.view.review_passed + '</span>');
			} else {
				$('td:eq(3)', nRow).html('<span class="label label-sm label-default">' + common.view.unknown + '</span>');
			}
			if (aData.status == '1') {
				$('td:eq(6)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-refresh"><i class="fa fa-refresh"></i> ' + common.view.refresh + '</a>');
			} else if (aData.status == '2') {
				$('td:eq(6)', nRow).html('<a href="wxdeviceapply!export.action?wxdeviceapplyid=' + aData.wxdeviceapplyid + '" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-export"><i class="fa fa-download"></i> ' + common.view.export + '</a>');
			} else {
				$('td:eq(6)', nRow).html('');
			}
			$('td:eq(7)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-detail"><i class="fa fa-list"></i> ' + common.view.detail + '</a>');
			return nRow;
		}
	});

	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	$('#MyTable').css('width', '100%');
	
}

function initApplyModal() {
	FormValidateOption.rules['wxdeviceapply.count'] = {};
	FormValidateOption.rules['wxdeviceapply.count']['required'] = true;
	FormValidateOption.rules['wxdeviceapply.count']['number'] = true;
	FormValidateOption.rules['wxdeviceapply.reason'] = {};
	FormValidateOption.rules['wxdeviceapply.reason']['required'] = true;
	FormValidateOption.submitHandler = function(form) {
		$.ajax({
			type : 'POST',
			url : myurls['wxdeviceapply.add'],
			data : $('#ApplyForm').serialize(),
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#ApplyModal').modal('hide');
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
	$('#ApplyForm').validate(FormValidateOption);
	
	$('[type=submit]', $('#ApplyModal')).on('click', function(event) {
		if ($('#ApplyForm').valid()) {
			$('#ApplyForm').submit();
		}
	});
	
	$('body').on('click', '.pix-apply', function(event) {
		$('#ApplyForm input[name="wxdeviceapply.count"]').val('');
		$('#ApplyForm input[name="wxdeviceapply.reason"]').val('');
		$('#ApplyModal').modal();
	});			

	
	$('body').on('click', '.pix-refresh', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentWxdeviceapply = $('#MyTable').dataTable().fnGetData(index);
		$.ajax({
			type : 'POST',
			url : myurls['wxdeviceapply.refresh'],
			cache: false,
			data : {
				'wxdeviceapply.wxdeviceapplyid': CurrentWxdeviceapply.wxdeviceapplyid
			},
			success : function(data, status) {
				if (data.errorcode == 0) {
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
	});

	$('body').on('click', '.pix-list', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
	});

}

function initWxdeviceModal() {
	$('body').on('click', '.pix-detail', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentWxdeviceapply = $('#MyTable').dataTable().fnGetData(index);
		CurrentWxdeviceapplyid = CurrentWxdeviceapply.wxdeviceapplyid;
		$('#WxdeviceTable').dataTable()._fnAjaxUpdate();
		$('#WxdeviceModal').modal();
	});

	
	$('#WxdeviceTable').dataTable({
		"sDom" : "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", 
		"aLengthMenu" : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ]
						],
		"bProcessing" : true,
		"bServerSide" : true,
		"sAjaxSource" : myurls['wxdevice.list'],
		'aoColumns' : [ {'sTitle' : 'ID', 'mData' : 'wxdeviceid', 'bSortable' : false }, 
		                {'sTitle' : 'UUID', 'mData' : 'uuid', 'bSortable' : false }, 
						{'sTitle' : 'Major', 'mData' : 'major', 'bSortable' : false }, 
						{'sTitle' : 'Minor', 'mData' : 'minor', 'bSortable' : false }, 
						{'sTitle' : common.view.status, 'mData' : 'wxstatus', 'bSortable' : false }, 
						{'sTitle' : common.view.device, 'mData' : 'deviceid', 'bSortable' : false }],
		"iDisplayLength" : 10,
		"sPaginationType" : "bootstrap",
		"oLanguage" : DataTableLanguage,
		"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
			if (aData.wxstatus == '0') {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-default">' + common.view.inactive + '</span>');
			} else if (aData.wxstatus == '1') {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-success">' + common.view.active + '</span>');
			} else {
				$('td:eq(4)', nRow).html('');
			}
			if (aData.device != null) {
				$('td:eq(5)', nRow).html(aData.device.terminalid);
			} else {
				$('td:eq(5)', nRow).html('');
			}
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'wxdeviceapplyid','value':CurrentWxdeviceapplyid });
		},
	});

	jQuery('#WxdeviceTable_wrapper .dataTables_filter input').addClass('form-control input-medium');
	jQuery('#WxdeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
}



