var myurls = {
	'wxdevice.list' : 'wxdevice!list.action',
	'wxdevice.bind' : 'wxdevice!bind.action',
	'device.list' : 'device!list.action',
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
		'sAjaxSource' : myurls['wxdevice.list'],
		'aoColumns' : [ {'sTitle' : 'ID', 'mData' : 'wxdeviceid', 'bSortable' : false }, 
		                {'sTitle' : 'UUID', 'mData' : 'uuid', 'bSortable' : false }, 
						{'sTitle' : 'Major', 'mData' : 'major', 'bSortable' : false }, 
						{'sTitle' : 'Minor', 'mData' : 'minor', 'bSortable' : false }, 
						{'sTitle' : common.view.status, 'mData' : 'wxstatus', 'bSortable' : false }, 
						{'sTitle' : common.view.device, 'mData' : 'deviceid', 'bSortable' : false }, 
						{'sTitle' : '', 'mData' : 'wxdeviceid', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
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
			$('td:eq(6)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-bind"><i class="fa fa-edit"></i> ' + common.view.bind + '</a>');
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			//aoData.push({'name':'branchid','value':CurBranchid });
		}
	});

	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	$('#MyTable').css('width', '100%');
	
}

function initBindModal() {
	var currentWxdevice = null;
	var currentDevice = null;
	
	$('body').on('click', '.pix-bind', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		currentWxdevice = $('#MyTable').dataTable().fnGetData(index);
		currentDevice = null;
		$('#DeviceTable').dataTable()._fnAjaxUpdate();
		$('#DeviceModal').modal();
	});

	
	$('#DeviceTable').dataTable({
		"sDom" : "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", 
		"aLengthMenu" : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ]
						],
		"bProcessing" : true,
		"bServerSide" : true,
		"sAjaxSource" : myurls['device.list'],
		'aoColumns' : [ {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false, 'sWidth' : '10%' }, 
						{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' }, 
						{'sTitle' : common.view.position, 'mData' : 'position', 'bSortable' : false, 'sWidth' : '80%' }],
		"iDisplayLength" : 10,
		"sPaginationType" : "bootstrap",
		"oLanguage" : DataTableLanguage,
		"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
			$('td:eq(2)', nRow).html(aData.addr1 + ' ' + aData.addr2);
			return nRow;
		},
	});

	jQuery('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-medium');
	jQuery('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
	
	$('#DeviceTable').on( 'click', 'tbody tr', function () {
		if (!$(this).hasClass('active')) {
			$('#DeviceTable tr.active').removeClass('active');
			$(this).addClass('active');
		}
		if ($('#DeviceTable').dataTable().fnGetData(this) != null) {
			currentDevice = $('#DeviceTable').dataTable().fnGetData(this);
		}
	});
	
	$('[type=submit]', $('#DeviceModal')).on('click', function(event) {
		if (currentDevice == null) {
			return;
		}
		currentWxdevice.deviceid = currentDevice.deviceid;
		$.ajax({
			type : 'POST',
			url : myurls['wxdevice.bind'],
			data : '{"wxdevice":' + $.toJSON(currentWxdevice) + '}',
			dataType : 'json',
			contentType : 'application/json;charset=utf-8',
			success : function(data, status) {
				$('#DeviceModal').modal('hide');
				$('#MyTable').dataTable()._fnAjaxUpdate();
				if (data.errorcode == 0) {
					bootbox.alert(common.tips.success);
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				$('#DeviceModal').modal('hide');
				console.log('failue');
			}
		});
	});
}


