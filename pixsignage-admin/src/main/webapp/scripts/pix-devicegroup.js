var myurls = {
	'devicegroup.list' : 'devicegroup!list.action',
	'devicegroup.add' : 'devicegroup!add.action',
	'devicegroup.update' : 'devicegroup!update.action',
	'devicegroup.delete' : 'devicegroup!delete.action',
	'device.list' : 'device!list.action',
	'devicegroup.adddevices' : 'devicegroup!adddevices.action',
	'devicegroup.deletedevices' : 'devicegroup!deletedevices.action',
	'devicegroup.sync' : 'devicegroup!sync.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

var CurrentDevicegroup;

function initMyTable() {
	var oTable = $('#MyTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['devicegroup.list'],
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' },
						{'sTitle' : common.view.detail, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '65%' },
						{'sTitle' : common.view.position, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '5%' }, 
						{'sTitle' : common.view.schedule, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '5%' },
						{'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '5%' },
						{'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '5%' },
						{'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '5%' }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var listhtml = '';
			for (var i=0; i<aData.devices.length; i++) {
				listhtml += aData.devices[i].name + ' ';
			}
			$('td:eq(1)', nRow).html(listhtml);
			
			$('td:eq(2)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-map"><i class="fa fa-map-marker"></i> ' + common.view.map + '</a>');
			$('td:eq(3)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>');
			$('td:eq(4)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-detail"><i class="fa fa-list-ul"></i> ' + common.view.detail + '</a>');
			$('td:eq(5)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
			$('td:eq(6)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':CurBranchid });
			aoData.push({'name':'type','value':'1' });
		}
	});

	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	$('#MyTable').css('width', '100%');

	$('body').on('click', '.pix-delete', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentDevicegroup = $('#MyTable').dataTable().fnGetData(index);
		
		bootbox.confirm(common.tips.remove + CurrentDevicegroup.name + '"', function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : myurls['devicegroup.delete'],
					cache: false,
					data : {
						devicegroupid: CurrentDevicegroup.devicegroupid,
					},
					success : function(data, status) {
						if (data.errorcode == 0) {
							refreshMyTable();
						} else {
							bootbox.alert(common.tips.error + data.errormsg);
						}
					},
					error : function() {
						console.log('failue');
					}
				});				
			}
		 });
	});
	
	$('body').on('click', '.pix-sync', function(event) {
		var target = $(event.target);
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			target = $(event.target).parent();
			index = $(event.target).parent().attr('data-id');
		}
		CurrentDevicegroup = $('#MyTable').dataTable().fnGetData(index);
		bootbox.confirm(common.tips.sync + CurrentDevicegroup.name + '"', function(result) {
			if (result == true) {
				$.ajax({
					type : 'GET',
					url : myurls['devicegroup.sync'],
					cache: false,
					data : {
						devicegroupid: CurrentDevicegroup.devicegroupid,
					},
					dataType : 'json',
					contentType : 'application/json;charset=utf-8',
					beforeSend: function ( xhr ) {
						Metronic.startPageLoading({animate: true});
					},
					success : function(data, status) {
						Metronic.stopPageLoading();
						if (data.errorcode == 0) {
							bootbox.alert(common.tips.success);
						} else {
							bootbox.alert(common.tips.error + data.errormsg);
						}
					},
					error : function() {
						Metronic.stopPageLoading();
						console.log('failue');
					}
				});				
			}
		});
	});
}

function initMyEditModal() {
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	FormValidateOption.rules['devicegroup.name'] = {};
	FormValidateOption.rules['devicegroup.name']['required'] = true;
	FormValidateOption.submitHandler = function(form) {
		$.ajax({
			type : 'POST',
			url : $('#MyEditForm').attr('action'),
			data : $('#MyEditForm').serialize(),
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#MyEditModal').modal('hide');
					bootbox.alert(common.tips.success);
					refreshMyTable();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	};
	$('#MyEditForm').validate(FormValidateOption);
	
	$('[type=submit]', $('#MyEditModal')).on('click', function(event) {
		if ($('#MyEditForm').valid()) {
			$('#MyEditForm').submit();
		}
	});
	
	$('body').on('click', '.pix-add', function(event) {
		var action = myurls['devicegroup.add'];
		refreshForm('MyEditForm');
		$('#MyEditForm').attr('action', action);
		$('#MyEditForm input[name="devicegroup.branchid"]').val(CurBranchid);
		$('#MyEditModal').modal();
	});			

	
	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentDevicegroup = $('#MyTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in CurrentDevicegroup) {
			formdata['devicegroup.' + name] = CurrentDevicegroup[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', myurls['devicegroup.update']);
		$('#MyEditModal').modal();
	});

}

function initMapModal() {
	var CurrentMap;

	$('body').on('click', '.pix-map', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentDevicegroup = $('#MyTable').dataTable().fnGetData(index);
		$('#DeviceMapModal').modal();
	});

	$('#DeviceMapModal').on('shown.bs.modal', function (e) {
		if (CurrentMap == null) {
			CurrentMap = new BMap.Map("DeviceMapDiv", {enableMapClick:false});
			CurrentMap.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));
			var point = new BMap.Point(114, 30);
			CurrentMap.centerAndZoom(point, 1);
		}
		CurrentMap.clearOverlays();
		var points = [];
		for (var i=0; i<CurrentDevicegroup.devices.length; i++) {
			var device = CurrentDevicegroup.devices[i];
			if (device.lontitude > 0 && device.latitude > 0) {
				var point = new BMap.Point(device.lontitude, device.latitude);
				points.push(point);
				var marker = new BMap.Marker(point, {title : device.terminalid});
				CurrentMap.addOverlay(marker);
				marker.addEventListener("click", function() {
					var terminalid = this.getTitle();
					var ds = CurrentDevicegroup.devices.filter(function (el) {
						return (el.terminalid == terminalid);
					});
					var sContent =
						'<div><h4>' + ds[0].terminalid + ' - ' + ds[0].name + '</h4>' + 
						'<p>' + ds[0].addr1 + ' ' + ds[0].addr2 + '</p>' + 
						'</div>';
					var infoWindow = new BMap.InfoWindow(sContent);
					this.openInfoWindow(infoWindow);
				});
			}
		}
		CurrentMap.setViewport(points);
	})
}

//==============================终端组明细对话框====================================			
function initDevicegpDtlModal() {
	var currentDevicegroupid = 0;
	var selectedDevices = [];
	var selectedDevicegpDtls = [];
	
	$('body').on('click', '.pix-detail', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var data = $('#MyTable').dataTable().fnGetData(index);
		currentDevicegroupid = data.devicegroupid;
		
		selectedDevices = [];
		selectedDevicegpDtls = [];
		$('#DeviceTable').dataTable()._fnAjaxUpdate();
		$('#DevicegpDtlTable').dataTable()._fnAjaxUpdate();
		
		$('#DevicegpDtlModal').modal();
	});
	
	//待选择终端table初始化
	$('#DeviceTable').dataTable({
		'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 20, 40, 60, 100 ],
						[ 20, 40, 60, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['device.list'],
		'aoColumns' : [ {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'deviceid', 'bSortable' : false }, 
		                {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
						{'sTitle' : common.view.position, 'mData' : 'position', 'bSortable' : false },
						{'sTitle' : common.view.status, 'mData' : 'onlineflag', 'bSortable' : false }],
		'iDisplayLength' : 20,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
			if ( $.inArray(aData.deviceid, selectedDevices) >= 0 ) {
				$(nRow).addClass('active');
				$('td:eq(0)', nRow).html('<input type="checkbox" id="DeviceCheck' + aData.deviceid + '" checked />');
			} else {
				$('td:eq(0)', nRow).html('<input type="checkbox" id="DeviceCheck' + aData.deviceid + '" />');
			}

			$('td:eq(1)', nRow).html(aData.terminalid + '(' + aData.name + ')');
			if (aData.status == 0) {
				$('td:eq(3)', nRow).html('<span class="label label-sm label-default">' + common.view.unregister + '</span>');
			} else if (aData.onlineflag == 9) {
				$('td:eq(3)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
			} else if (aData.onlineflag == 1) {
				$('td:eq(3)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
			} else if (aData.onlineflag == 0) {
				$('td:eq(3)', nRow).html('<span class="label label-sm label-info">' + common.view.idle + '</span>');
			}
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':CurBranchid });
			aoData.push({'name':'devicegroupid','value':'0' });
		} 
	});

	//已加入终端table初始化
	$('#DevicegpDtlTable').dataTable({
		'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 20, 40, 60, 100 ],
						[ 20, 40, 60, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['device.list'],
		'aoColumns' : [ {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'deviceid', 'bSortable' : false }, 
		                {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
						{'sTitle' : common.view.position, 'mData' : 'position', 'bSortable' : false },
						{'sTitle' : common.view.status, 'mData' : 'onlineflag', 'bSortable' : false }],
		'iDisplayLength' : 20,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			if ( $.inArray(aData.deviceid, selectedDevicegpDtls) >= 0 ) {
				$(nRow).addClass('active');
				$('td:eq(0)', nRow).html('<input type="checkbox" id="DevicegpDtlCheck' + aData.deviceid + '" checked />');
			} else {
				$('td:eq(0)', nRow).html('<input type="checkbox" id="DevicegpDtlCheck' + aData.deviceid + '" />');
			}
			
			$('td:eq(1)', nRow).html(aData.terminalid + '(' + aData.name + ')');
			if (aData.status == 0) {
				$('td:eq(3)', nRow).html('<span class="label label-sm label-default">' + common.view.unregister + '</span>');
			} else if (aData.onlineflag == 9) {
				$('td:eq(3)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
			} else if (aData.onlineflag == 1) {
				$('td:eq(3)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
			} else if (aData.onlineflag == 0) {
				$('td:eq(3)', nRow).html('<span class="label label-sm label-info">' + common.view.idle + '</span>');
			}
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':CurBranchid });
			aoData.push({'name':'devicegroupid','value':currentDevicegroupid });
		} 
	});

	$('#DeviceTable').on('click', 'tr', function () {
		var row = $('#DeviceTable').dataTable().fnGetData(this);
		if (row == null) return;
		var deviceid = row.deviceid;
		var index = $.inArray(deviceid, selectedDevices);
		if (index >= 0) {
			selectedDevices.splice(index, 1);
			$('#DeviceCheck'+deviceid).prop('checked', false);
		} else {
			selectedDevices.push(deviceid);
			$('#DeviceCheck'+deviceid).prop('checked', true);
		}
		$(this).toggleClass('active');
	});
	$('#CheckAll', $('#DeviceTable')).on('click', function() {
		var rows = $("#DeviceTable").dataTable().fnGetNodes();
		for (var i=0; i<rows.length; i++) {
			var deviceid = $('#DeviceTable').dataTable().fnGetData(rows[i]).deviceid;
			if (this.checked) {
				$(rows[i]).addClass('active');
			} else {
				$(rows[i]).removeClass('active');
			}
			$('#DeviceCheck'+deviceid).prop('checked', this.checked);
			var index = $.inArray(deviceid, selectedDevices);
			if (index == -1 && this.checked) {
				selectedDevices.push(deviceid);
			} else if (index >= 0 && !this.checked) {
				selectedDevices.splice(index, 1);
			}
	    }
	} );

	$('#DevicegpDtlTable').on('click', 'tr', function () {
		var row = $('#DevicegpDtlTable').dataTable().fnGetData(this);
		if (row == null) return;
		var deviceid = row.deviceid;
		var index = $.inArray(deviceid, selectedDevicegpDtls);
		if (index >= 0) {
			selectedDevicegpDtls.splice(index, 1);
			$('#DevicegpDtlCheck'+deviceid).prop('checked', false);
		} else {
			selectedDevicegpDtls.push(deviceid);
			$('#DevicegpDtlCheck'+deviceid).prop('checked', true);
		}
		$(this).toggleClass('active');
	});
	$('#CheckAll', $('#DevicegpDtlTable')).on('click', function() {
		var rows = $("#DevicegpDtlTable").dataTable().fnGetNodes();
		for (var i=0; i<rows.length; i++) {
			var deviceid = $('#DevicegpDtlTable').dataTable().fnGetData(rows[i]).deviceid;
			if (this.checked) {
				$(rows[i]).addClass('active');
			} else {
				$(rows[i]).removeClass('active');
			}
			$('#DevicegpDtlCheck'+deviceid).prop('checked', this.checked);
			var index = $.inArray(deviceid, selectedDevicegpDtls);
			if (index == -1 && this.checked) {
				selectedDevicegpDtls.push(deviceid);
			} else if (index >= 0 && !this.checked) {
				selectedDevicegpDtls.splice(index, 1);
			}
	    }
	} );

	//选择终端加入终端组
	$('body').on('click', '.pix-adddevicegpdtl', function(event) {
		$.ajax({
			type : 'POST',
			url : myurls['devicegroup.adddevices'],
			data : '{"devicegroup":{"devicegroupid":' + currentDevicegroupid + '}, "detailids":' + $.toJSON(selectedDevices) + '}',
			dataType : 'json',
			contentType : 'application/json;charset=utf-8',
			success : function(data, status) {
				if (data.errorcode == 0) {
					selectedDevices = [];
					selectedDevicegpDtls = [];
					$('#DeviceTable').dataTable()._fnAjaxUpdate();
					$('#DevicegpDtlTable').dataTable()._fnAjaxUpdate();
					refreshMyTable();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	});

	
	//从终端组删除终端
	$('body').on('click', '.pix-deletedevicegpdtl', function(event) {
		$.ajax({
			type : 'POST',
			url : myurls['devicegroup.deletedevices'],
			data : '{"devicegroup":{"devicegroupid":' + currentDevicegroupid + '}, "detailids":' + $.toJSON(selectedDevicegpDtls) + '}',
			dataType : 'json',
			contentType : 'application/json;charset=utf-8',
			success : function(data, status) {
				if (data.errorcode == 0) {
					selectedDevices = [];
					selectedDevicegpDtls = [];
					$('#DeviceTable').dataTable()._fnAjaxUpdate();
					$('#DevicegpDtlTable').dataTable()._fnAjaxUpdate();
					refreshMyTable();
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
