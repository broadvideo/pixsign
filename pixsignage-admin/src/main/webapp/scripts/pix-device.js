var myurls = {
	'device.list' : 'device!list.action',
	'device.add' : 'device!add.action',
	'device.update' : 'device!update.action',
	'device.delete' : 'device!delete.action',
	'device.sync' : 'device!sync.action',
	'device.config' : 'device!config.action',
	'device.reboot' : 'device!reboot.action',
	'device.poweroff' : 'device!poweroff.action',
	'device.screen' : 'device!screen.action',
	'device.screenlist' : 'device!screenlist.action',
	'devicefile.list' : 'devicefile!list.action',
	'device.utext' : 'device!utext.action',
	'device.ucancel' : 'device!ucancel.action',
};

function refreshMyTable() {
	$('#DeviceTable').dataTable()._fnAjaxUpdate();
	$('#UnDeviceTable').dataTable()._fnAjaxUpdate();
}

var CurrentDevice;
var CurrentDeviceid = 0;
var CurrentDevices;
var MapType = 0; //0-One Device 1-All Device

function initMyTable() {
	var oTable = $('#DeviceTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['device.list'],
		'aoColumns' : [ {'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '5%' }, 
						{'sTitle' : common.view.device, 'mData' : 'terminalid', 'bSortable' : false, 'sWidth' : '15%' }, 
						{'sTitle' : common.view.devicegroup, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '10%' }, 
						{'sTitle' : common.view.position, 'mData' : 'position', 'bSortable' : false, 'sWidth' : '15%' }, 
						{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '40%' }],
		'aoColumnDefs': [
	 					{'bSortable': false, 'aTargets': [ 0 ] }
	 				],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnPreDrawCallback': function (oSettings) {
			CurrentDevices = [];
			return true;
		},
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			CurrentDevices.push(aData);
			var devicehtml = '';
			if (aData.status == 0) {
				devicehtml += '<span class="label label-sm label-default">' + common.view.unregister + '</span> ';
			} else if (aData.onlineflag == 1) {
				devicehtml += '<span class="label label-sm label-success">' + common.view.online + '</span> ';
			} else if (aData.onlineflag == 0) {
				devicehtml += '<span class="label label-sm label-warning">' + common.view.offline + '</span> ';
			} else if (aData.onlineflag == 9) {
				devicehtml += '<span class="label label-sm label-warning">' + common.view.offline + '</span> ';
			}
			if (aData.name != aData.terminalid) {
				devicehtml += aData.terminalid + '/' + aData.name;
			} else {
				devicehtml += aData.terminalid + '';
			}
			$('td:eq(1)', nRow).html(devicehtml);
			
			if (aData.devicegroupid > 0) {
				$('td:eq(2)', nRow).html(aData.devicegroup.name);
			} else {
				$('td:eq(2)', nRow).html('');
			}
			if (aData.lontitude > 0 && aData.latitude > 0) {
				$('td:eq(3)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-map"><i class="fa fa-map-marker"></i> ' + common.view.map + '</a><br/>' + aData.position);
			}
			
			var buttonhtml = '';
			buttonhtml += '<div class="util-btn-margin-bottom-5">';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-config"><i class="fa fa-cog"></i> ' + common.view.config + ' </a>';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-pushconfig"><i class="fa fa-rss"></i> ' + common.view.syncconfig + ' </a>';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs yellow pix-reboot"><i class="fa fa-circle-o"></i> ' + common.view.reboot + '</a>';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs yellow pix-poweroff"><i class="fa fa-power-off"></i> ' + common.view.shutdown + '</a>';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.unbind + '</a>';
			buttonhtml += '</div>';
			
			buttonhtml += '<div class="util-btn-margin-bottom-5">';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.syncplan + ' </a>';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-screen"><i class="fa fa-camera"></i> ' + common.view.screen + '</a>';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-screenlist"><i class="fa fa-list-ol"></i> ' + common.view.screenview + '</a>';
			buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-file"><i class="fa fa-list-ul"></i> ' + common.view.fileview + '</a>';
			buttonhtml += '</div>';

			$('td:eq(4)', nRow).html(buttonhtml);

			var rowdetail = '<span class="row-details row-details-close"></span>';
			$('td:eq(0)', nRow).html(rowdetail);
			
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':CurBranchid });
			aoData.push({'name':'status','value':'1' });
		}
	});

	$('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#DeviceTable_wrapper .dataTables_length select').select2();
	$('#DeviceTable').css('width', '100%');

	$('#UnDeviceTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ]
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['device.list'],
		'aoColumns' : [ {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
						{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : common.view.devicegroup, 'mData' : 'devicegroupid', 'bSortable' : false }, 
						{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false },
						{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '5%' }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			if (aData.devicegroupid > 0) {
				$('td:eq(2)', nRow).html(aData.devicegroup.name);
			} else {
				$('td:eq(2)', nRow).html('');
			}
			$('td:eq(4)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update2"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':CurBranchid });
			aoData.push({'name':'status','value':'0' });
		}
	});

	$('#UnDeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small'); 
	$('#UnDeviceTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
	$('#UnDeviceTable_wrapper .dataTables_length select').select2(); 
	$('#UnDeviceTable').css('width', '100%');

	function fnFormatDetails ( oTable, nTr ) {
		var aData = oTable.fnGetData( nTr );
		var sOut = '<table width="100%">';
		sOut += '<tr><td width="20%">' + common.view.hardkey + ':</td><td width="60%">' + aData.hardkey + '</td>';
		if (aData.iip != '') {
			sOut += '<td rowspan="7"><img src="device!qrcode.action?deviceid=' + aData.deviceid + '" width="200"></img></td>';
		}
		sOut += '</tr>';
		sOut += '<tr><td>IP:</td><td>'+aData.iip + '</td></tr>';
		sOut += '<tr><td>MAC:</td><td>'+aData.mac + '</td></tr>';
		sOut += '<tr><td>' + common.view.storage + ':</td><td>' + transferIntToByte(aData.storageused) + '/' + transferIntToByte(aData.storageavail) + '</td></tr>';
		sOut += '<tr><td>' + common.view.city + ':</td><td>' + aData.city + '</td></tr>';
		sOut += '<tr><td>' + common.view.addr + ':</td><td>' + aData.addr1 + ' ' + aData.addr2 + '</td></tr>';
		sOut += '<tr><td>' + common.view.versioncode + ':</td><td>' + aData.mtype + ' ' + aData.appname + ' ' + aData.vname + '(' + aData.vcode + ')</td></tr>';
		sOut += '<tr><td>' + common.view.temperature + ':</td><td>' + aData.temperature + '</td></tr>';
		sOut += '<tr><td>' + common.view.downloadspeed + ':</td><td>' + aData.downloadspeed + ' KB/s</td></tr>';
		sOut += '<tr><td>' + common.view.downloadbytes + ':</td><td>' + transferIntToByte(aData.downloadbytes) + '</td></tr>';
		sOut += '<tr><td>' + common.view.networkmode + ':</td><td>' + aData.networkmode + '</td></tr>';
		sOut += '<tr><td>' + common.view.networksignal + ':</td><td>' + aData.networksignal + '</td></tr>';
		sOut += '<tr><td>' + common.view.brightness + ':</td><td>' + aData.brightness + '</td></tr>';
		sOut += '<tr><td>Tags:</td><td>' + aData.tags + '</td></tr>';
		sOut += '<tr><td>' + common.view.boardinfo + ':</td><td class="autowrap">' + aData.boardinfo + '</td></tr>';
		sOut += '<tr><td>' + common.view.refreshtime + ':</td><td>' + aData.refreshtime + '</td></tr>';
		sOut += '<tr><td>' + common.view.activetime + ':</td><td>' + aData.activetime + '</td></tr>';
		sOut += '</table>';
		 
		return sOut;
	}

	$('#DeviceTable').on('click', ' tbody td .row-details', function () {
		var nTr = $(this).parents('tr')[0];
		if ( oTable.fnIsOpen(nTr) ) {
			/* This row is already open - close it */
			$(this).addClass('row-details-close').removeClass('row-details-open');
			oTable.fnClose( nTr );
		} else {
			/* Open this row */				
			$(this).addClass('row-details-open').removeClass('row-details-close');
			oTable.fnOpen( nTr, fnFormatDetails(oTable, nTr), 'details' );
		}
	});

	var currentItem;
	$('body').on('click', '.pix-delete', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		currentItem = $('#DeviceTable').dataTable().fnGetData(index);
		
		bootbox.confirm(common.tips.unbind + currentItem.name, function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : myurls['device.delete'],
					cache: false,
					data : {
						'device.deviceid': currentItem['deviceid']
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
		currentItem = $('#DeviceTable').dataTable().fnGetData(index);
		bootbox.confirm(common.tips.sync + currentItem.name, function(result) {
			if (result == true) {
				$.ajax({
					type : 'GET',
					url : myurls['device.sync'],
					cache: false,
					data : {
						deviceid: currentItem.deviceid,
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

	$('body').on('click', '.pix-pushconfig', function(event) {
		var target = $(event.target);
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			target = $(event.target).parent();
			index = $(event.target).parent().attr('data-id');
		}
		currentItem = $('#DeviceTable').dataTable().fnGetData(index);
		bootbox.confirm(common.tips.config + currentItem.name, function(result) {
			if (result == true) {
				$.ajax({
					type : 'GET',
					url : myurls['device.config'],
					cache: false,
					data : {
						deviceid: currentItem.deviceid,
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

	$('body').on('click', '.pix-reboot', function(event) {
		var target = $(event.target);
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			target = $(event.target).parent();
			index = $(event.target).parent().attr('data-id');
		}
		currentItem = $('#DeviceTable').dataTable().fnGetData(index);
		bootbox.confirm(common.tips.reboot + currentItem.name, function(result) {
			if (result == true) {
				$.ajax({
					type : 'GET',
					url : myurls['device.reboot'],
					cache: false,
					data : {
						deviceid: currentItem.deviceid,
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

	$('body').on('click', '.pix-poweroff', function(event) {
		var target = $(event.target);
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			target = $(event.target).parent();
			index = $(event.target).parent().attr('data-id');
		}
		currentItem = $('#DeviceTable').dataTable().fnGetData(index);
		bootbox.confirm(common.tips.poweroff + currentItem.name, function(result) {
			if (result == true) {
				$.ajax({
					type : 'GET',
					url : myurls['device.poweroff'],
					cache: false,
					data : {
						deviceid: currentItem.deviceid,
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

	$('body').on('click', '.pix-DeviceReload', function(event) {
		refreshMyTable();
	});			

}


function initMyEditModal() {
	var currentEditBranchTreeData = [];
	var currentEditBranchid = 0;
	$.ajax({
		type : 'POST',
		url : 'branch!list.action',
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				createBranchTreeData(data.aaData, currentEditBranchTreeData);
				createEditBranchTree(currentEditBranchTreeData);
			} else {
				bootbox.alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			bootbox.alert('failure');
		}
	});
	function createBranchTreeData(branches, treeData) {
		for (var i=0; i<branches.length; i++) {
			treeData[i] = {};
			treeData[i].id = branches[i].branchid;
			treeData[i].text = branches[i].name;
			treeData[i].state = {
				opened: true,
			}
			treeData[i].children = [];
			createBranchTreeData(branches[i].children, treeData[i].children);
		}
	}
	function createEditBranchTree(treeData) {
		$('#EditFormBranchTree').jstree('destroy');
		$('#EditFormBranchTree').jstree({
			'core' : {
				'multiple' : false,
				'data' : treeData
			},
			'plugins' : ['unique'],
		});
		$('#EditFormBranchTree').on('loaded.jstree', function() {
			$('#EditFormBranchTree').jstree('select_node', currentEditBranchid);
		});
	}

	$.ajax({
		type : 'GET',
		url : 'classroom!list.action',
		data : {"iDisplayStart" :0,"iDisplayLength" :999},
		dataType: 'json',
		success : function(data, status) {
			if (data.errorcode == 0) {
				var externallist = [];
				for (var i=0; i<data.aaData.length; i++) {
					externallist.push({
						id: data.aaData[i].classroomid,
						text: data.aaData[i].name
					});
				}
				$("#ExternalSelect").select2({
					placeholder: common.tips.detail_select,
					minimumInputLength: 0,
					data: externallist,
					dropdownCssClass: "bigdrop", 
					escapeMarkup: function (m) { return m; } 
				});
			} else {
				bootbox.alert(data.errorcode + ": " + data.errmsg);
			}
		},
		error : function() {
			bootbox.alert('failure');
		}
	});

	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();

	FormValidateOption.rules = {};
	FormValidateOption.rules['device.terminalid'] = {};
	FormValidateOption.rules['device.terminalid']['required'] = true;
	FormValidateOption.rules['device.terminalid']['minlength'] = 2;
	FormValidateOption.rules['device.name'] = {};
	FormValidateOption.rules['device.name']['required'] = true;
	FormValidateOption.rules['device.name']['minlength'] = 2;
	FormValidateOption.submitHandler = function(form) {
		$('#MyEditForm input[name="device.branchid"]').attr('value', $("#EditFormBranchTree").jstree('get_selected', false)[0]);
		if ($('#ExternalSelect').select2('data') != null) {
			$('#MyEditForm input[name="device.externalid"]').attr('value', $('#ExternalSelect').select2('data').id);
			$('#MyEditForm input[name="device.externalname"]').attr('value', $('#ExternalSelect').select2('data').text);
		}
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

	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentDevice = $('#DeviceTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in CurrentDevice) {
			formdata['device.' + name] = CurrentDevice[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', myurls['device.update']);
		currentEditBranchid = CurrentDevice.branchid;
		createEditBranchTree(currentEditBranchTreeData);
		$("#ExternalSelect").select2('val', CurrentDevice.externalid);
		$('.calendar-ctrl').css('display', CalendarCtrl?'':'none');
		$('#MyEditModal').modal();
	});

	$('body').on('click', '.pix-update2', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentDevice = $('#UnDeviceTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in CurrentDevice) {
			formdata['device.' + name] = CurrentDevice[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', myurls['device.update']);
		$('#TagSelect').select2('val', $(CurrentDevice.tags.split(",")));
		currentEditBranchid = CurrentDevice.branchid;
		createEditBranchTree(currentEditBranchTreeData);
		//$("#ExternalSelect").select2('val', CurrentDevice.externalid);
		$('.calendar-ctrl').css('display', CalendarCtrl?'':'none');
		$('#MyEditModal').modal();
		$("#ExternalSelect").select2('val',CurrentDevice.externalid);
	});
}

function initConfigModal() {
	initTagSelect();
	function initTagSelect() {
		$.ajax({
			type : 'GET',
			url : 'org!get.action',
			data : '',
			success : function(data, status) {
				if (data.errorcode == 0) {
					var tags = $(data.org.tags.split(','));
					var taglist = [];
					for (var i=0; i<tags.length; i++) {
						taglist.push({
							id: tags[i],
							text: tags[i],
						})
					}
					$('#TagSelect').select2({
						multiple: true,
						minimumInputLength: 0,
						data: taglist,
						dropdownCssClass: "bigdrop", 
						escapeMarkup: function (m) { return m; } 
					});
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	}

	$('body').on('click', '.pix-config', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentDevice = $('#DeviceTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in CurrentDevice) {
			formdata['device.' + name] = CurrentDevice[name];
		}
		$('#ConfigForm').loadJSON(formdata);
		if ($('input[name="device.powerflag"]:checked').val() == 1) {
			if ($('input[name="device.poweron"]').val() == '') {
				$('input[name="device.poweron"]').val('07:00:00');
			}
			if ($('input[name="device.poweroff"]').val() == '') {
				$('input[name="device.poweroff"]').val('20:00:00');
			}
			$('.powerflag').css('display', '');
		} else {
			$('.powerflag').css('display', 'none');
		}
		$('#TagSelect').select2('val', $(CurrentDevice.tags.split(",")));
		$('#ConfigModal').modal();
	});
	$('[type=submit]', $('#ConfigModal')).on('click', function(event) {
		$.ajax({
			type : 'POST',
			url : myurls['device.update'],
			data : $('#ConfigForm').serialize(),
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#ConfigModal').modal('hide');
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
	});

	$('#ConfigModal').on('shown.bs.modal', function (e) {
		$(".volumeRange").ionRangeSlider({
			min: 0,
			max: 100,
			from: CurrentDevice.volume,
			type: 'single',
			step: 5,
			hasGrid: false
		});
		if ($('input[name="device.volumeflag"]:checked').val() == 1) {
			$('.volumeflag').css('display', '');
		} else {
			$('.volumeflag').css('display', 'none');
		}
	})
	$('input[name="device.volumeflag"]').click(function(e) {
		if ($('input[name="device.volumeflag"]:checked').val() == 1) {
			$('.volumeflag').css('display', '');
		} else {
			$('.volumeflag').css('display', 'none');
		}
	});
	$('input[name="device.powerflag"]').click(function(e) {
		if ($('input[name="device.powerflag"]:checked').val() == 1) {
			if ($('input[name="device.poweron"]').val() == '') {
				$('input[name="device.poweron"]').val('07:00:00');
			}
			if ($('input[name="device.poweroff"]').val() == '') {
				$('input[name="device.poweroff"]').val('20:00:00');
			}
			$('.powerflag').css('display', '');
		} else {
			$('.powerflag').css('display', 'none');
		}
	});  
}

function initScreenModal() {
	$('body').on('click', '.pix-screen', function(event) {
		var target = $(event.target);
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			target = $(event.target).parent();
			index = $(event.target).parent().attr('data-id');
		}
		currentItem = $('#DeviceTable').dataTable().fnGetData(index);
		bootbox.confirm(common.tips.screen + currentItem.name, function(result) {
			if (result == true) {
				$.ajax({
					type : 'GET',
					url : myurls['device.screen'],
					cache: false,
					data : {
						deviceid: currentItem.deviceid,
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

	$('body').on('click', '.pix-screenlist', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentDevice = $('#DeviceTable').dataTable().fnGetData(index);
		CurrentDeviceid = CurrentDevice.deviceid;
		$('#ScreenPreview').html('');
		$('#ScreenTable').dataTable()._fnAjaxUpdate();
		$('#ScreenModal').modal();
	});

	$('#ScreenTable thead').css('display', 'none');
	$('#ScreenTable tbody').css('display', 'none');	
	var screenhtml = '';
	$('#ScreenTable').dataTable({
		'sDom' : 'rt',
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['device.screenlist'],
		'aoColumns' : [ {'sTitle' : common.view.screentime, 'mData' : 'createtime', 'bSortable' : false, 'sWidth' : '80%' }, 
						{'sTitle' : common.view.screen, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' }],
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnPreDrawCallback': function (oSettings) {
			if ($('#ScreenContainer').length < 1) {
				$('#ScreenTable').append('<div id="ScreenContainer"></div>');
			}
			$('#ScreenContainer').html(''); 
			return true;
		},
		'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			if (iDisplayIndex % 6 == 0) {
				screenhtml = '';
				screenhtml += '<div class="row" >';
			}
			screenhtml += '<div class="col-md-2 col-xs-2">';

			screenhtml += '<h6>' + aData.createtime + '</h6>';
			screenhtml += '<a href="/pixsigdata' + aData.screen + '" class="fancybox">';
			screenhtml += '<div class="thumbs">';
			screenhtml += '<img src="/pixsigdata' + aData.screen + '" class="imgthumb" width="' + 100 + '%" />';
			screenhtml += '</div>';
			screenhtml += '</a>';

			screenhtml += '</div>';
			if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#ScreenTable').dataTable().fnGetData().length) {
				screenhtml += '</div>';
				if ((iDisplayIndex+1) != $('#ScreenTable').dataTable().fnGetData().length) {
					screenhtml += '<hr/>';
				}
				$('#ScreenContainer').append(screenhtml);
			}
			return nRow;
		},
		'fnDrawCallback': function(oSettings, json) {
			$("#ScreenTable .fancybox").fancybox({
				openEffect	: 'none',
				closeEffect	: 'none',
				closeBtn : false,
			});
			$('#ScreenTable .thumbs').each(function(i) {
				//$(this).width($(this).parent().closest('div').width());
				//$(this).height($(this).parent().closest('div').width());
			});
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'deviceid','value':CurrentDeviceid });
		},
	});
	$('#ScreenTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
	$('#ScreenTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
	$('#ScreenTable').css('width', '100%');
	//$('#ScreenTable').css('width', '100%').css('table-layout', 'fixed');

	$('body').on('click', '.pix-ScreenReload', function(event) {
		$('#ScreenTable').dataTable()._fnAjaxUpdate();
	});			
}

function initDeviceFileModal() {
	$('body').on('click', '.pix-file', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentDevice = $('#DeviceTable').dataTable().fnGetData(index);
		CurrentDeviceid = CurrentDevice.deviceid;
		
		$('#DeviceVideoTable').dataTable()._fnAjaxUpdate();
		$('#DeviceImageTable').dataTable()._fnAjaxUpdate();
		$('#GridVideoTable').dataTable()._fnAjaxUpdate();
		$('#GridImageTable').dataTable()._fnAjaxUpdate();
		
		$('#DeviceFileModal').modal();
	});

	$('#DeviceVideoTable').dataTable({
		'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ]
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['devicefile.list'],
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
			aoData.push({'name':'deviceid','value':CurrentDeviceid },
						{'name':'objtype','value':'1' });
		} 
	});
	$('#DeviceVideoTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
	$('#DeviceVideoTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
	$('#DeviceVideoTable').css('width', '100%').css('table-layout', 'fixed');

	$('#DeviceImageTable').dataTable({
		'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ]
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['devicefile.list'],
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
			aoData.push({'name':'deviceid','value':CurrentDeviceid },
						{'name':'objtype','value':'2' });
		} 
	});
	$('#DeviceImageTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
	$('#DeviceImageTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
	$('#DeviceImageTable').css('width', '100%').css('table-layout', 'fixed');

	$('#GridVideoTable').dataTable({
		'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ]
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['devicefile.list'],
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
			$('td:eq(0)', nRow).html(aData.mmediadtl.mmediadtlid);
			$('td:eq(1)', nRow).html('<img src="/pixsigdata' + aData.mmediadtl.video.thumbnail + '" width="40px"></img>');
			$('td:eq(2)', nRow).html(aData.mmediadtl.filename);
			$('td:eq(3)', nRow).html(transferIntToComma(aData.mmediadtl.size));
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
			aoData.push({'name':'deviceid','value':CurrentDeviceid },
						{'name':'objtype','value':'8' });
		} 
	});
	$('#GridVideoTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
	$('#GridVideoTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
	$('#GridVideoTable').css('width', '100%').css('table-layout', 'fixed');

	$('#GridImageTable').dataTable({
		'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ]
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['devicefile.list'],
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
			$('td:eq(0)', nRow).html(aData.mmediadtl.mmediadtlid);
			$('td:eq(1)', nRow).html('<img src="/pixsigdata' + aData.mmediadtl.image.thumbnail + '" width="40px"></img>');
			$('td:eq(2)', nRow).html(aData.mmediadtl.filename);
			$('td:eq(3)', nRow).html(transferIntToComma(aData.mmediadtl.size));
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
			aoData.push({'name':'deviceid','value':CurrentDeviceid },
						{'name':'objtype','value':'9' });
		} 
	});
	$('#GridImageTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
	$('#GridImageTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
	$('#GridImageTable').css('width', '100%').css('table-layout', 'fixed');

	$('body').on('click', '.pix-DeviceFileReload', function(event) {
		if ($('#portlet_tab1').hasClass('active')) {
			$('#DeviceVideoTable').dataTable()._fnAjaxUpdate();
		} else if ($('#portlet_tab2').hasClass('active')) {
			$('#DeviceImageTable').dataTable()._fnAjaxUpdate();
		} else if ($('#portlet_tab3').hasClass('active')) {
			$('#GridVideoTable').dataTable()._fnAjaxUpdate();
		} else if ($('#portlet_tab4').hasClass('active')) {
			$('#GridImageTable').dataTable()._fnAjaxUpdate();
		}
	});			
}

function initMapModal() {
	var CurrentMap;

	$('body').on('click', '.pix-map', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentDevice = $('#DeviceTable').dataTable().fnGetData(index);
		CurrentDeviceid = CurrentDevice.deviceid;
		MapType = 0;
		if (MapSource) {
			$('#GoogleMapModal').modal();
		} else {
			$('#BaiduMapModal').modal();
		}
	});

	$('body').on('click', '.pix-allmap', function(event) {
		MapType = 1;
		if (MapSource) {
			$('#GoogleMapModal').modal();
		} else {
			$('#BaiduMapModal').modal();
		}
	});

	$('#BaiduMapModal').on('shown.bs.modal', function (e) {
		if (CurrentMap == null) {
			CurrentMap = new BMap.Map("BaiduMapDiv", {enableMapClick:false});
			CurrentMap.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));
			var point = new BMap.Point(114, 30);
			CurrentMap.centerAndZoom(point, 1);
		}
		CurrentMap.clearOverlays();
		if (MapType == 0) {
			var point = new BMap.Point(CurrentDevice.lontitude, CurrentDevice.latitude);
			var marker = new BMap.Marker(point);
			var sContent =
				'<div><h4>' + CurrentDevice.terminalid + ' - ' + CurrentDevice.name + '</h4>' + 
				'<p>' + CurrentDevice.addr1 + ' ' + CurrentDevice.addr2 + '</p>' + 
				'</div>';
			var infoWindow = new BMap.InfoWindow(sContent);
			CurrentMap.centerAndZoom(point, 15);
			CurrentMap.addOverlay(marker);
			marker.addEventListener("click", function() {          
				this.openInfoWindow(infoWindow);
			});
			marker.openInfoWindow(infoWindow);
		} else {
			var points = [];
			for (var i=0; i<CurrentDevices.length; i++) {
				var device = CurrentDevices[i];
				if (device.lontitude > 0 && device.latitude > 0) {
					var point = new BMap.Point(device.lontitude, device.latitude);
					points.push(point);
					var marker = new BMap.Marker(point, {title : device.terminalid});
					CurrentMap.addOverlay(marker);
					marker.addEventListener("click", function() {
						var terminalid = this.getTitle();
						var ds = CurrentDevices.filter(function (el) {
							return (el.terminalid == terminalid);
						});
						var sContent =
							'<div><h4>' + ds[0].terminalid + ' - ' + ds[0].name + '</h4>' + 
							'<p>' + ds[0].addr1 + ' ' + ds[0].addr2 + '</p>' + 
							'</div>';
						var infoWindow = new BMap.InfoWindow(sContent);
						this.openInfoWindow(infoWindow);
						//var infoWindow = new BMap.InfoWindow(arr[this.zIndex].split(",")[2], opts); 
						//this.openInfoWindow(infoWindow);
					});
				}
			}
			CurrentMap.setViewport(points);
		}
	})

	var GoogleMarkers = [];
	var PreInfoWindow = null;
	$('#GoogleMapModal').on('shown.bs.modal', function (e) {
		if (CurrentMap == null) {
			CurrentMap = new google.maps.Map(document.getElementById('GoogleMapDiv'), {
				zoom: 4,
				center: new google.maps.LatLng(35, 103)
			});			
		}
		for (var i = 0; i < GoogleMarkers.length; i++) {
			GoogleMarkers[i].setMap(null);
		}
		GoogleMarkers = [];
		if (MapType == 0) {
			var point = new google.maps.LatLng(parseFloat(CurrentDevice.latitude), parseFloat(CurrentDevice.lontitude));
			var marker = new google.maps.Marker({
				position: point,
				map: CurrentMap,
				title: CurrentDevice.terminalid
			});
			GoogleMarkers.push(marker);
			var sContent =
				'<div><h4>' + CurrentDevice.terminalid + ' - ' + CurrentDevice.name + '</h4>' + 
				'<p>' + CurrentDevice.addr1 + '</p>' + 
				'</div>';
			var infowindow = new google.maps.InfoWindow({
				content: sContent
			});
			CurrentMap.setCenter(point);
			CurrentMap.setZoom(15);
			marker.addListener('click', function() {
				if (PreInfoWindow != null) PreInfoWindow.close();
				PreInfoWindow = infowindow;
				infowindow.open(CurrentMap, marker);
			});
			PreInfoWindow = infowindow;
			infowindow.open(CurrentMap, marker);
		} else {
			var bounds = new google.maps.LatLngBounds();
			for (var i=0; i<CurrentDevices.length; i++) {
				var device = CurrentDevices[i];
				if (device.lontitude > 0 && device.latitude > 0) {
					var point = new google.maps.LatLng(parseFloat(device.latitude), parseFloat(device.lontitude));
					var marker = new google.maps.Marker({
						position: point,
						map: CurrentMap,
						title: device.terminalid
					});
					GoogleMarkers.push(marker);
					marker.addListener('click', function() {
						var terminalid = this.getTitle();
						 var ds = CurrentDevices.filter(function (el) {
							return (el.terminalid == terminalid);
						});
						var sContent =
							'<div><h4>' + ds[0].terminalid + ' - ' + ds[0].name + '</h4>' + 
							'<p>' + ds[0].addr1 + '</p>' + 
							'</div>';
						var infowindow = new google.maps.InfoWindow({
							content: sContent
						});
						if (PreInfoWindow != null) PreInfoWindow.close();
						PreInfoWindow = infowindow;
						infowindow.open(CurrentMap, this);
					});
					bounds.extend(point);
					PreInfoWindow = null;
				}
			}
			CurrentMap.fitBounds(bounds);
		}
	})
}

function initUTextModal() {
	$('.colorPick').wColorPicker({
	    theme           : 'classic',  // set theme
	    opacity         : 0.8,        // opacity level
	    color           : '#FF0000',         // set init color
	    mode            : 'click',     // mode for palette (flat, hover, click)
	    position        : 'br',       // position of palette, (tl, tc, tr, rt, rm, rb, br, bc, bl, lb, lm, lt)
	    generateButton  : false,       // if mode not flat generate button or not
	    dropperButton   : false,      // optional dropper button to use in other apps
	    effect          : 'slide',    // only used when not in flat mode (none, slide, fade)
	    showSpeed       : 200,        // show speed for effects
	    hideSpeed       : 200,        // hide speed for effects
	    onMouseover     : null,       // callback for color mouseover
	    onMouseout      : null,       // callback for color mouseout
	    onSelect        : function(color){
	    	if (color.indexOf('#') == 0) {
		        $(".colorPick i").css('background', color);
		        $(".colorPick input").val(color);
	    	}
	    },
	    onDropper       : null        // callback when dropper is clicked
	});
    $(".colorPick i").css('background', '#FF0000');
    $(".colorPick input").val('#FF0000');
	$('.bgcolorPick').wColorPicker({
	    theme           : 'classic',  // set theme
	    opacity         : 0.8,        // opacity level
	    color           : '#FFFFFF',         // set init color
	    mode            : 'click',     // mode for palette (flat, hover, click)
	    position        : 'br',       // position of palette, (tl, tc, tr, rt, rm, rb, br, bc, bl, lb, lm, lt)
	    generateButton  : false,       // if mode not flat generate button or not
	    dropperButton   : false,      // optional dropper button to use in other apps
	    effect          : 'slide',    // only used when not in flat mode (none, slide, fade)
	    showSpeed       : 200,        // show speed for effects
	    hideSpeed       : 200,        // hide speed for effects
	    onMouseover     : null,       // callback for color mouseover
	    onMouseout      : null,       // callback for color mouseout
	    onSelect        : function(color){
	    	if (color.indexOf('#') == 0) {
		        $(".bgcolorPick i").css('background', color);
		        $(".bgcolorPick input").val(color);
	    	}
	    },
	    onDropper       : null        // callback when dropper is clicked
	});
    $(".bgcolorPick i").css('background', '#FFFFFF');
    $(".bgcolorPick input").val('#FFFFFF');

	$(".sizeRange").ionRangeSlider({
		min: 10,
		max: 100,
		from: 50,
		type: 'single',
		step: 10,
		hasGrid: false,
	});
	$(".opacityRange").ionRangeSlider({
		min: 0,
		max: 255,
		from: 255,
		type: 'single',
		step: 5,
		hasGrid: false,
	});
	$(".opacityRange").ionRangeSlider("update", {
		from: 255
	});

	$('#UTextModal').on('shown.bs.modal', function (e) {
		$(".sizeRange").ionRangeSlider("update", {
			from: 50
		});
		$(".opacityRange").ionRangeSlider("update", {
			from: 255
		});
	})

	FormValidateOption.rules = {};
	FormValidateOption.rules['text'] = {};
	FormValidateOption.rules['text']['required'] = true;
	FormValidateOption.rules['count'] = {};
	FormValidateOption.rules['count']['required'] = true;
	FormValidateOption.rules['count']['number'] = true;
	FormValidateOption.submitHandler = function(form) {
		$.ajax({
			type : 'POST',
			url : myurls['device.utext'],
			data : $('#UTextForm').serialize(),
			success : function(data, status) {
				$('#UTextModal').modal('hide');
				if (data.errorcode == 0) {
					bootbox.alert(common.tips.success);
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	};
	$('#UTextForm').validate(FormValidateOption);
	
	$('[type=submit]', $('#UTextModal')).on('click', function(event) {
		if ($('#UTextForm').valid()) {
			$('#UTextForm').submit();
		}
	});
	
	$('body').on('click', '.pix-utext', function(event) {
		$('#UTextModal').modal();
	});			

	$('body').on('click', '.pix-ucancel', function(event) {
		bootbox.confirm(common.tips.ucancel, function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : myurls['device.ucancel'],
					cache: false,
					data : {},
					success : function(data, status) {
						if (data.errorcode == 0) {
							bootbox.alert(common.tips.success);
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
}

$('.form_time').datetimepicker({
	autoclose: true,
	isRTL: Metronic.isRTL(),
	format: 'hh:ii:ss',
	pickerPosition: (Metronic.isRTL() ? 'bottom-right' : 'bottom-left'),
	language: 'zh-CN',
	minuteStep: 5,
	startView: 1,
	maxView: 1,
	formatViewType: 'time'
});

