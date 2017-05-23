var myurls = {
	'device.list' : 'device!list.action',
	'device.update' : 'device!update.action',
	'device.delete' : 'device!delete.action',
};

function refreshMyTable() {
	$('#DeviceTable').dataTable()._fnAjaxUpdate();
	$('#UnDeviceTable').dataTable()._fnAjaxUpdate();
}			

var CurrentDevice;
var CurrentDeviceid = 0;

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
						{'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false, 'sWidth' : '10%' }, 
						{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' }, 
						{'sTitle' : common.view.position, 'mData' : 'position', 'bSortable' : false, 'sWidth' : '15%' }, 
						{'sTitle' : common.view.onlineflag, 'mData' : 'onlineflag', 'bSortable' : false, 'sWidth' : '5%' }, 
						{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '5%' },
						{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '5%' }],
		'aoColumnDefs': [
	 					{'bSortable': false, 'aTargets': [ 0 ] }
	 				],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			if (aData.lontitude > 0 && aData.latitude > 0) {
				$('td:eq(3)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-map"><i class="fa fa-map-marker"></i> ' + common.view.map + '</a><br/>' + aData.position);
			}
			if (aData.status == 0) {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-default">' + common.view.unregister + '</span>');
			} else if (aData.onlineflag == 1) {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
			} else if (aData.onlineflag == 0) {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
			} else if (aData.onlineflag == 9) {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
			}
			
			$('td:eq(5)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
			$('td:eq(6)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.unbind + '</a>');

			var rowdetail = '<span class="row-details row-details-close"></span>';
			$('td:eq(0)', nRow).html(rowdetail);
			
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':CurBranchid });
			aoData.push({'name':'type','value':'2' });
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
						{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':CurBranchid });
			aoData.push({'name':'type','value':'2' });
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
		sOut += '</tr>';
		sOut += '<tr><td>IP:</td><td>'+aData.iip + '</td></tr>';
		sOut += '<tr><td>' + common.view.city + ':</td><td>' + aData.city + '</td></tr>';
		sOut += '<tr><td>' + common.view.addr + ':</td><td>' + aData.addr1 + ' ' + aData.addr2 + '</td></tr>';
		sOut += '<tr><td>' + common.view.versioncode + ':</td><td>' + aData.mtype + ' ' + aData.appname + '(' + aData.version + ')</td></tr>';
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

	$('body').on('click', '.pix-DeviceReload', function(event) {
		refreshMyTable();
	});			

}


function initMyEditModal() {
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();

	FormValidateOption.rules = {};
	FormValidateOption.rules['device.terminalid'] = {};
	FormValidateOption.rules['device.terminalid']['required'] = true;
	FormValidateOption.rules['device.terminalid']['minlength'] = 2;
	FormValidateOption.rules['device.name'] = {};
	FormValidateOption.rules['device.name']['required'] = true;
	FormValidateOption.rules['device.name']['minlength'] = 2;
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
		CurrentDevice = $('#DeviceTable').dataTable().fnGetData(index);
		CurrentDeviceid = CurrentDevice.deviceid;
		$('#DeviceMapModal').modal();
	});

	$('#DeviceMapModal').on('shown.bs.modal', function (e) {
		if (CurrentMap == null) {
			CurrentMap = new BMap.Map("DeviceMapDiv", {enableMapClick:false});
			CurrentMap.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));    
		}
		CurrentMap.clearOverlays();
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
	})
}

