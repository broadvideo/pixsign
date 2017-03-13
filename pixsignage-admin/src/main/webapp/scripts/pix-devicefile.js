var currentTab = 1; //1-device 2-devicegroup
var currentDevicegroupid = 0;
var currentTab1Deviceid = 0;
var currentTab2Deviceid = 0;

function refreshLeftTab() {
	if (currentTab == 1) {
		$.ajax({
			type : 'POST',
			url : 'device!list.action',
			data : {
				devicegroupid: 0,
				type: 1,
			},
			success : function(data, status) {
				if (data.errorcode == 0) {
					var devices = data.aaData;
					var deviceTabHtml = '<ul class="nav nav-tabs tabs-left">';
					for (var i=0; i<devices.length; i++) {
						var device = devices[i];
						if (i == 0) {
							deviceTabHtml += '<li class="active">';
							currentTab1Deviceid = device.deviceid;
							refreshDeviceDetail();
						} else {
							deviceTabHtml += '<li>';
						}
						deviceTabHtml += '<a href="#DeviceDetail" class="pix-device" device-id="'+ device.deviceid + '" data-toggle="tab">' + device.name + '</a>';
						deviceTabHtml += '</li>';
					}
					deviceTabHtml += '</ul>';
					$('#LeftTab').html(deviceTabHtml);
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	} else {
		if (currentDevicegroupid == 0) {
			$('#LeftTab').html('');
			$('#DeviceDetail').css('display', 'none');
			return;
		}

		$.ajax({
			type : 'POST',
			url : 'device!list.action',
			data : {
				devicegroupid: currentDevicegroupid,
				type: 1
			},
			success : function(data, status) {
				if (data.errorcode == 0) {
					var devices = data.aaData;
					var deviceTabHtml = '<ul class="nav nav-tabs tabs-left">';
					for (var i=0; i<devices.length; i++) {
						var device = devices[i];
						if (i == 0) {
							deviceTabHtml += '<li class="active">';
							currentTab2Deviceid = device.deviceid;
							refreshDeviceDetail();
						} else {
							deviceTabHtml += '<li>';
						}
						deviceTabHtml += '<a href="#DeviceDetail" class="pix-device" device-id="'+ device.deviceid + '" data-toggle="tab">' + device.name + '</a>';
						deviceTabHtml += '</li>';
					}
					deviceTabHtml += '</ul>';
					$('#LeftTab').html(deviceTabHtml);
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	}
	
	$('body').on('click', '.pix-device', function(event) {
		var deviceid = $(event.target).attr('device-id');
		if (deviceid == undefined) {
			deviceid = $(event.target).parent().attr('device-id');
		}
		if (currentTab == 1 && currentTab1Deviceid != deviceid) {
			currentTab1Deviceid = deviceid;
			refreshDeviceDetail();
		} else if (currentTab == 2 && currentTab2Deviceid != deviceid) {
			currentTab2Deviceid = deviceid;
			refreshDeviceDetail();
		}
	});
}

function refreshDeviceDetail() {
	$('#DeviceDetail').css('display', 'block');
	$('#DeviceVideoTable').dataTable()._fnAjaxUpdate();
	$('#DeviceImageTable').dataTable()._fnAjaxUpdate();
}

function initDevicefiles() {
	$('#DevicegroupSelectPanel').css('display', 'none');
	refreshLeftTab();
	
	$('body').on('click', '#DeviceTab', function(event) {
		currentTab = 1;
		$('#DevicegroupSelectPanel').css('display', 'none');
		refreshLeftTab();
	});

	$('body').on('click', '#DevicegroupTab', function(event) {
		currentTab = 2;
		$('#DevicegroupSelectPanel').css('display', 'block');
		refreshLeftTab();
	});

	$('#DevicegroupSelect').select2({
		placeholder: common.tips.devicegroup_select,
		minimumInputLength: 0,
		ajax: {
			url: 'devicegroup!list.action',
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
							text:item.name, 
							id:item.devicegroupid 
						};
					}),
					more: more
				};
			}
		},
		formatResult: function (device) {
			return device.text;
		},
		formatSelection: function (device) {
			return device.text;
		},
		initSelection: function (element, callback) {
		},
		dropdownCssClass: 'bigdrop',
		escapeMarkup: function (m) { return m; }
	});
	
	$('#DevicegroupSelect').on('change', function(e) {
		currentDevicegroupid = $(this).select2('data').id;
		refreshLeftTab();
	});	

	$('#DeviceVideoTable').dataTable({
		'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : 'devicefile!list.action',
		'aoColumns' : [ {'sTitle' : common.view.id, 'mData' : 'devicefileid', 'bSortable' : false }, 
		                {'sTitle' : '', 'mData' : 'devicefileid', 'bSortable' : false }, 
						{'sTitle' : common.view.filename, 'mData' : 'devicefileid', 'bSortable' : false }, 
						{'sTitle' : common.view.size, 'mData' : 'devicefileid', 'bSortable' : false }, 
						{'sTitle' : common.view.progress, 'mData' : 'progress', 'bSortable' : false },
						{'sTitle' : common.view.updatetime, 'mData' : 'updatetime', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(0)', nRow).html(aData.video.videoid);
			$('td:eq(1)', nRow).html('<img src="/pixsigdata' + aData.video.thumbnail + '" width="40px"></img>');
			$('td:eq(2)', nRow).html(aData.video.filename);
			$('td:eq(3)', nRow).html(transferIntToComma(aData.video.size));
			if (aData.progress == 0) {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-danger">' + aData.progress + '%</span>');
			} else if (aData['progress'] == 100) {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-success">' + aData.progress + '%</span>');
			} else {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-warning">' + aData.progress + '%</span>');
			}
			return nRow;
		},
		'fnServerParams': function(aoData) {
			var deviceid;
			if (currentTab == 1) {
				deviceid = currentTab1Deviceid;
			} else if (currentTab == 2) {
				deviceid = currentTab2Deviceid;
			}
			aoData.push({'name':'deviceid','value':deviceid },
						{'name':'objtype','value':'1' });
		} 
	});

	$('#DeviceImageTable').dataTable({
		'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : 'devicefile!list.action',
		'aoColumns' : [ {'sTitle' : common.view.id, 'mData' : 'devicefileid', 'bSortable' : false }, 
		                {'sTitle' : '', 'mData' : 'devicefileid', 'bSortable' : false }, 
						{'sTitle' : common.view.filename, 'mData' : 'devicefileid', 'bSortable' : false }, 
						{'sTitle' : common.view.size, 'mData' : 'devicefileid', 'bSortable' : false }, 
						{'sTitle' : common.view.progress, 'mData' : 'progress', 'bSortable' : false },
						{'sTitle' : common.view.updatetime, 'mData' : 'updatetime', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(0)', nRow).html(aData.image.imageid);
			$('td:eq(1)', nRow).html('<img src="/pixsigdata' + aData.image.thumbnail + '" width="40px"></img>');
			$('td:eq(2)', nRow).html(aData.image.filename);
			$('td:eq(3)', nRow).html(transferIntToComma(aData.image.size));
			if (aData.progress == 0) {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-danger">' + aData.progress + '%</span>');
			} else if (aData['progress'] == 100) {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-success">' + aData.progress + '%</span>');
			} else {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-warning">' + aData.progress + '%</span>');
			}
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			var deviceid;
			if (currentTab == 1) {
				deviceid = currentTab1Deviceid;
			} else if (currentTab == 2) {
				deviceid = currentTab2Deviceid;
			}
			aoData.push({'name':'deviceid','value':deviceid },
						{'name':'objtype','value':'2' });
		} 
	});

}
