var OplogModule = function () {

	var init = function () {
		initOplogTable();
	};

	var refresh = function () {
		$('#OplogTable').dataTable()._fnAjaxUpdate();
	};
	
	var initOplogTable = function () {
		$('#OplogTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'oplog!list.action',
			'aoColumns' : [ {'sTitle' : common.view.type, 'mData' : 'type', 'bSortable' : false, 'sWidth' : '20%' },
							{'sTitle' : common.view.name, 'mData' : 'staff.name', 'bSortable' : false, 'sWidth' : '25%' },
							{'sTitle' : common.view.loginname, 'mData' : 'staff.loginname', 'bSortable' : false, 'sWidth' : '25%' },
							{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false, 'sWidth' : '30%' }],
			'order': [],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				if (aData.type == 1) {
					$('td:eq(0)', nRow).html('<span class="label label-sm label-success">Login</span>');
				} else {
					$('td:eq(0)', nRow).html('<span class="label label-sm label-default">' + common.view.unknown + '</span>');
				}
				return nRow;
			}
		});
		$('#OplogTable_wrapper').addClass('form-inline');
		$('#OplogTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#OplogTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#OplogTable_wrapper .dataTables_length select').select2();
		$('#OplogTable').css('width', '100%');
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
