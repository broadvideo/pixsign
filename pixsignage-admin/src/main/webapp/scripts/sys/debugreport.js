var DebugreportModule = function () {
	var _debugreport = {};

	var init = function () {
		initDebugreportTable();
		initDebugModal();
	};

	var refresh = function () {
		$('#DebugreportTable').dataTable()._fnAjaxUpdate();
	};
	
	var initDebugreportTable = function () {
		$('#DebugreportTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'debugreport!list.action',
			'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'deviceid', 'bSortable' : false }, 
							{'sTitle' : common.view.hardkey, 'mData' : 'hardkey', 'bSortable' : false }, 
							{'sTitle' : common.view.onlineflag, 'mData' : 'deviceid', 'bSortable' : false }, 
							{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false }, 
							{'sTitle' : '', 'mData' : 'debugreportid', 'bSortable' : false }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(0)', nRow).html(aData.device.name + '(' + aData.device.terminalid + ')');
				if (aData.device.status == 0) {
					$('td:eq(2)', nRow).html('<span class="label label-sm label-default">' + common.view.unregister + '</span>');
				} else if (aData.device.onlineflag == 9) {
					$('td:eq(2)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
				} else if (aData.device.onlineflag == 1) {
					$('td:eq(2)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
				} else if (aData.device.onlineflag == 0) {
					$('td:eq(2)', nRow).html('<span class="label label-sm label-info">' + common.view.idle + '</span>');
				}
				$('td:eq(4)', nRow).html('<a href="/pixsigdata' + aData.filepath + '" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue"><i class="fa fa-cloud-download"></i>' + common.view.download + ' </a>');
				return nRow;
			}
		});
		$('#DebugreportTable_wrapper').addClass('form-inline');
		$('#DebugreportTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DebugreportTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DebugreportTable_wrapper .dataTables_length select').select2();
		$('#DebugreportTable').css('width', '100%');
	};
	
	var initDebugModal = function () {
		$('body').on('click', '.pix-collect', function(event) {
			$('#DeviceSelect').select2({
				placeholder: common.tips.detail_select,
				minimumInputLength: 0,
				ajax: { 
					url: 'device!list.action',
					type: 'GET',
					dataType: 'json',
					data: function (term, page) {
						return {
							sSearch: term, 
							iDisplayStart: (page-1)*10,
							iDisplayLength: 10,
						};
					},
					results: function (data, page) {
						var more = (page * 10) < data.iTotalRecords; 
						return {
							results : $.map(data.aaData, function (item) { 
								return { 
									text:item.terminalid, 
									id:item.deviceid,
									device:item, 
								};
							}),
							more: more
						};
					}
				},
				formatResult: function(data) {
					return '<span>' + data.device.name + '(' + data.device.terminalid + ')' + '</span>';
				},
				formatSelection: function(data) {
					return '<span>' + data.device.name + '(' + data.device.terminalid + ')' + '</span>';
				},
				dropdownCssClass: 'bigdrop', 
				escapeMarkup: function (m) { return m; } 
			});
			$('#DebugModal').modal();
		});

		$('[type=submit]', $('#DebugModal')).on('click', function(event) {
			$.ajax({
				type : 'GET',
				url : 'debugreport!collect.action',
				data : {
					deviceid: $('#DeviceSelect').val(),
				},
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				beforeSend: function ( xhr ) {
					Metronic.startPageLoading({animate: true});
				},
				success : function(data, status) {
					Metronic.stopPageLoading();
					$('#DebugModal').modal('hide');
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					$('#DebugModal').modal('hide');
					console.log('failue');
				}
			});

			event.preventDefault();
		});
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
