var myurls = {
	'onlinelog.devicestatlist' : 'onlinelog!devicestatlist.action',
	'onlinelog.list' : 'onlinelog!list.action',
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
		'sAjaxSource' : myurls['onlinelog.devicestatlist'],
		'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' },
		                {'sTitle' : common.view.onlineflag, 'mData' : 'onlineflag', 'bSortable' : false, 'sWidth' : '5%' },
						{'sTitle' : common.view.onlinetime, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '25%' },
						{'sTitle' : common.view.offlinetime, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '25%' },
						{'sTitle' : common.view.onlineduration, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : common.view.detail, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '5%' }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(0)', nRow).html(aData.terminalid + '(' + aData.name + ')');
			if (aData.onlineflag == 1) {
				$('td:eq(1)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
			} else if (aData.onlineflag == 0) {
				$('td:eq(1)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
			} else if (aData.onlineflag == 9) {
				$('td:eq(1)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
			}
			$('td:eq(2)', nRow).html('');
			$('td:eq(3)', nRow).html('');
			$('td:eq(4)', nRow).html('');
			if (aData.onlinelog != null && aData.onlinelog.length > 0) {
				$('td:eq(2)', nRow).html(aData.onlinelog[0].onlinetime);
				if (aData.onlinelog[0].offlinetime != null) {
					$('td:eq(3)', nRow).html(aData.onlinelog[0].offlinetime);
					$('td:eq(4)', nRow).html(transferIntToTime(aData.onlinelog[0].duration));
				}
			}
			$('td:eq(5)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-detail"><i class="fa fa-list-ul"></i> ' + common.view.more + '</a>');
			return nRow;
		}
	});

	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	$('#MyTable').css('width', '100%');
}

function initDetailModal() {
	var CurrentDevice;
	var CurrentDeviceid = 0;

	$('body').on('click', '.pix-detail', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentDevice = $('#MyTable').dataTable().fnGetData(index);
		CurrentDeviceid = CurrentDevice.deviceid;
		
		$('input[name="onlinelog.statdate"]').val('');
		$('#OnlinelogTable').dataTable().fnDraw(true);
		$('#OnlinelogModal').modal();
	});

	$('#OnlinelogTable').dataTable({
		'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ]
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['onlinelog.list'],
		'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'onlinelogid', 'bSortable' : false, 'sWidth' : '20%' },
		                {'sTitle' : common.view.onlinetime, 'mData' : 'onlinetime', 'bSortable' : false, 'sWidth' : '30%' },
						{'sTitle' : common.view.offlinetime, 'mData' : 'offlinetime', 'bSortable' : false, 'sWidth' : '30%' },
						{'sTitle' : common.view.onlineduration, 'mData' : 'duration', 'bSortable' : false, 'sWidth' : '15%' }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(0)', nRow).html(CurrentDevice.terminalid + '(' + CurrentDevice.name + ')');
			$('td:eq(3)', nRow).html(transferIntToTime(aData.duration));
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'deviceid','value':CurrentDeviceid });
			aoData.push({'name':'day','value':$('input[name="onlinelog.statdate"]').val() });
		} 
	});

	jQuery('#OnlinelogTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
	jQuery('#OnlinelogTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
	$('#OnlinelogTable').css('width', '100%').css('table-layout', 'fixed');

	$('input[name="onlinelog.statdate"]').on('change', function(e) {
		$('#OnlinelogTable').dataTable().fnDraw(true);
	});

}

$(".form_datetime").datetimepicker({
	autoclose: true,
	isRTL: Metronic.isRTL(),
	format: "yyyy-mm-dd",
	pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left"),
	language: "zh-CN",
	minView: 'month',
	todayBtn: true
});
