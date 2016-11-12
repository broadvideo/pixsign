var myurls = {
	'common.list' : 'playlog!list.action',
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
		'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : common.view.video, 'mData' : 'videoid', 'bSortable' : false, 'sWidth' : '30%' },
						{'sTitle' : common.view.starttime, 'mData' : 'starttime', 'bSortable' : false, 'sWidth' : '30%' },
						{'sTitle' : common.view.endtime, 'mData' : 'endtime', 'bSortable' : false, 'sWidth' : '20%' }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(0)', nRow).html(aData.device.terminalid + '(' + aData.device.name + ')');
			if (aData.video != null) {
				$('td:eq(1)', nRow).html(aData.video.name);
			} else {
				$('td:eq(1)', nRow).html('');
			}
			return nRow;
		}
	});

	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	$('#MyTable').css('width', '100%');
	
}

