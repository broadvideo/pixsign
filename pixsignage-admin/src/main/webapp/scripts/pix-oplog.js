var myurls = {
	'common.list' : 'oplog!list.action',
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
		'aoColumns' : [ {'sTitle' : common.view.type, 'mData' : 'type', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : common.view.name, 'mData' : 'staff.name', 'bSortable' : false, 'sWidth' : '25%' },
						{'sTitle' : common.view.loginname, 'mData' : 'staff.loginname', 'bSortable' : false, 'sWidth' : '25%' },
						{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false, 'sWidth' : '30%' }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			if (aData.type == 1) {
				$('td:eq(0)', nRow).html('<span class="label label-sm label-success">登录</span>');
			} else {
				$('td:eq(0)', nRow).html('<span class="label label-sm label-default">未知</span>');
			}
			return nRow;
		}
	});

	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	$('#MyTable').css('width', '100%');
	
}

