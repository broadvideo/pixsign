var OnlinelogModule = function () {
	var _device = {};

	var init = function () {
		initDeviceTable();
		initDetailModal();
		refreshDeviceChart();
	};

	var refresh = function () {
		$('#DeviceTable').dataTable().fnDraw(true);
		refreshDeviceChart();
	};
	
	var initDeviceTable = function () {
		$('#DeviceTable').dataTable({
			'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 20, 60, 100 ],
							[ 10, 20, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'onlinelog!devicestatlist.action',
			'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '15%' },
			                {'sTitle' : common.view.onlineflag, 'mData' : 'onlineflag', 'bSortable' : false, 'sWidth' : '5%' },
							//{'sTitle' : common.view.onlinetime, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' },
							//{'sTitle' : common.view.offlinetime, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' },
							//{'sTitle' : common.view.onlineduration, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' },
							{'sTitle' : common.view.detail, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '5%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(0)', nRow).html(aData.name);
				if (aData.onlineflag == 1) {
					$('td:eq(1)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
				} else if (aData.onlineflag == 0) {
					$('td:eq(1)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
				} else if (aData.onlineflag == 9) {
					$('td:eq(1)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
				}
				$('td:eq(2)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-detail"><i class="fa fa-list-ul"></i> ' + common.view.more + '</a>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
			}
		});
		$('#DeviceTable_wrapper').addClass('form-inline');
		$('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DeviceTable_wrapper .dataTables_length select').select2();
		$('#DeviceTable').css('width', '100%');
	};
	
	var initDetailModal = function () {
		$('body').on('click', '.pix-detail', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_device = $('#DeviceTable').dataTable().fnGetData(index);
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
			'sAjaxSource' : 'onlinelog!list.action',
			'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'onlinelogid', 'bSortable' : false, 'sWidth' : '20%' },
			                {'sTitle' : common.view.onlinetime, 'mData' : 'onlinetime', 'bSortable' : false, 'sWidth' : '30%' },
							{'sTitle' : common.view.offlinetime, 'mData' : 'offlinetime', 'bSortable' : false, 'sWidth' : '30%' },
							{'sTitle' : common.view.onlineduration, 'mData' : 'duration', 'bSortable' : false, 'sWidth' : '15%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(0)', nRow).html(_device.terminalid + '(' + _device.name + ')');
				$('td:eq(3)', nRow).html(PixData.transferIntToTime(aData.duration));
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'deviceid','value':_device.deviceid });
				aoData.push({'name':'day','value':$('input[name="onlinelog.statdate"]').val() });
			} 
		});
		$('#OnlinelogTable').css('width', '100%').css('table-layout', 'fixed');

		$('input[name="onlinelog.statdate"]').on('change', function(e) {
			$('#OnlinelogTable').dataTable().fnDraw(true);
		});

		$('.form_datetime').datetimepicker({
			autoclose: true,
			isRTL: Metronic.isRTL(),
			format: 'yyyy-mm-dd',
			pickerPosition: (Metronic.isRTL() ? 'bottom-right' : 'bottom-left'),
			language: 'zh-CN',
			minView: 'month',
			todayBtn: true
		});
	};
	
	var refreshDeviceChart = function () {
		$.ajax({
			url: 'stat!devices.action',
			type : 'POST',
			data : {
			},
			dataType: 'json',
			success : function(data, status) {
				if (data.errorcode == 0 && data.aaData.length > 0) {
					$('#DeviceChart').css('display', '');
					var statdata = [];
					for (var i=0; i<data.aaData.length; i++) {
						statdata[i] = {};
						if (data.aaData[i].label == '1') {
							statdata[i].label = common.view.online + '(' + data.aaData[i].value + ')';
						} else if (data.aaData[i].label == '0') {
							statdata[i].label = common.view.offline + '(' + data.aaData[i].value + ')';
						//} else if (data.aaData[i].label == '0-0') {
						//	statdata[i].label = common.view.unregister + '(' + data.aaData[i].value + ')';
						} else {
							statdata[i].label = common.view.unknown + '(' + data.aaData[i].value + ')';
						}
						statdata[i].data = data.aaData[i].value;
					}
					
				    $.plot($('#DeviceChart'), statdata, {
				        series: {
				            pie: {
				                show: true,
				                radius: 1,
				                label: {
				                    show: true,
				                    radius: 3 / 4,
				                    formatter: function(label, series) {
			                            return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">' + label + '<br/>' + Math.round(series.percent) + '%</div>';
				                    },
				                    background: {
				                        opacity: 0.5
				                    }
				                }
				            }
				        },
				        legend: {
				            show: true
				        }
				    });
				} else {
					$('#DeviceChart').css('display', 'none');
				}
			}
		});
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
