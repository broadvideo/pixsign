var CrashreportModule = function () {
	var _crashreport = {};

	var init = function () {
		initCrashreportTable();
		initCrashDtlModal();
	};

	var refresh = function () {
		$('#CrashreportTable').dataTable()._fnAjaxUpdate();
	};
	
	var initCrashreportTable = function () {
		$('#CrashreportTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'crashreport!list.action',
			'aoColumns' : [ {'sTitle' : common.view.hardkey, 'mData' : 'hardkey', 'bSortable' : false }, 
							{'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
							{'sTitle' : 'IP', 'mData' : 'clientip', 'bSortable' : false }, 
							{'sTitle' : common.view.name, 'mData' : 'clientname', 'bSortable' : false }, 
							{'sTitle' : 'OS', 'mData' : 'os', 'bSortable' : false }, 
							{'sTitle' : 'APP', 'mData' : 'appname', 'bSortable' : false }, 
							{'sTitle' : common.view.versionname, 'mData' : 'vname', 'bSortable' : false }, 
							{'sTitle' : common.view.versioncode, 'mData' : 'vcode', 'bSortable' : false }, 
							{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false }, 
							{'sTitle' : common.view.more, 'mData' : 'crashreportid', 'bSortable' : false }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var data = $('#MyTable').dataTable().fnGetData(iDisplayIndex);
				$('td:eq(9)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-detail"><i class="fa fa-credit-card"></i>' + common.view.more + ' </a>');
				return nRow;
			}
		});
		$('#CrashreportTable_wrapper').addClass('form-inline');
		$('#CrashreportTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#CrashreportTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#CrashreportTable_wrapper .dataTables_length select').select2();
		$('#CrashreportTable').css('width', '100%');
	};
	
	var initCrashDtlModal = function () {
		$('body').on('click', '.pix-detail', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_crashreport = $('#CrashreportTable').dataTable().fnGetData(index);
			$.ajax({
				type : 'POST',
				url : 'crashreport!get.action',
				data : {"crashreport.crashreportid" : _crashreport.crashreportid},
				success : function(data, status) {
					if (data.errorcode == 0) {
						var formdata = new Object();
						for (var name in data.crashreport) {
							formdata['crashreport.' + name] = data.crashreport[name];
						}
						$('#CrashDtlForm').loadJSON(formdata);
						$('#CrashDtlModal').modal();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
			
		});
	}
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
