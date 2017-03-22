var myurls = {
	'playlog.devicestatlist' : 'playlog!devicestatlist.action',
	'playlog.list' : 'playlog!list.action',
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
		'sAjaxSource' : myurls['playlog.devicestatlist'],
		'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' },
		                {'sTitle' : common.view.onlineflag, 'mData' : 'onlineflag', 'bSortable' : false, 'sWidth' : '5%' },
						{'sTitle' : common.view.video, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : common.view.starttime, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : common.view.endtime, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : common.view.duration, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '10%' },
						{'sTitle' : common.view.detail, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '5%' }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(0)', nRow).html(aData.terminalid + '(' + aData.name + ')');
			if (aData.onlineflag == 1) {
				$('td:eq(1)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
			} else if (aData.onlineflag == 0) {
				$('td:eq(1)', nRow).html('<span class="label label-sm label-info">' + common.view.idle + '</span>');
			} else if (aData.onlineflag == 9) {
				$('td:eq(1)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
			}
			$('td:eq(2)', nRow).html('');
			$('td:eq(3)', nRow).html('');
			$('td:eq(4)', nRow).html('');
			$('td:eq(5)', nRow).html('');
			if (aData.playlog != null && aData.playlog.length > 0) {
				if (aData.playlog[0].video != null) {
					$('td:eq(2)', nRow).html(aData.playlog[0].video.name);
				} if (aData.playlog[0].image != null) {
					$('td:eq(2)', nRow).html(common.view.image + ': ' + aData.playlog[0].image.name);
				}
				$('td:eq(3)', nRow).html(aData.playlog[0].starttime);
				$('td:eq(4)', nRow).html(aData.playlog[0].endtime);
				$('td:eq(5)', nRow).html(aData.playlog[0].duration);
			}

			$('td:eq(6)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-detail"><i class="fa fa-list-ul"></i> ' + common.view.more + '</a>');
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
		
		$('input[name="playlog.statdate"]').val('');
		$('#PlaylogTable').dataTable().fnDraw(true);
		//$('#PlaylogTable').dataTable()._fnAjaxUpdate();
		$('#PlaylogModal').modal();
	});

	$('#PlaylogTable').dataTable({
		'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ]
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['playlog.list'],
		'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'playlogid', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : common.view.video, 'mData' : 'mediaid', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : common.view.starttime, 'mData' : 'starttime', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : common.view.endtime, 'mData' : 'endtime', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : common.view.duration, 'mData' : 'duration', 'bSortable' : false, 'sWidth' : '20%' },],
		'iDisplayStart' : 0,
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(0)', nRow).html(CurrentDevice.terminalid + '(' + CurrentDevice.name + ')');
			if (aData.video != null) {
				$('td:eq(1)', nRow).html(aData.video.name);
			} if (aData.image != null) {
				$('td:eq(1)', nRow).html(common.view.image + ': ' + aData.image.name);
			}
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'deviceid','value':CurrentDeviceid });
			aoData.push({'name':'day','value':$('input[name="playlog.statdate"]').val() });
		} 
	});

	jQuery('#PlaylogTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
	jQuery('#PlaylogTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
	$('#PlaylogTable').css('width', '100%').css('table-layout', 'fixed');

	$('input[name="playlog.statdate"]').on('change', function(e) {
		$('#PlaylogTable').dataTable().fnDraw(true);
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
