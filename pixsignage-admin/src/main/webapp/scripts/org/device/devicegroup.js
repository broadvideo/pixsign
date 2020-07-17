var DevicegroupModule = function () {
	var _devicegroup = {};
	this.DevicegroupTree = new BranchTree($('#DevicegroupPortlet'));

	var init = function () {
		initDevicegroupTable();
		initDevicegroupEvent();
		initDevicegroupEditModal();
		initDevicegroupDtlModal();
		initMapModal();
	};

	var refresh = function () {
		$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
	};
	
	var initDevicegroupTable = function () {
		var devicegroupTable = $('#DevicegroupTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'devicegroup!list.action',
			'aoColumns' : [ {'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '5%' }, 
							{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : common.view.detail, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '60%' },
							{'sTitle' : common.view.position, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '5%' }, 
							{'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '25%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var listhtml = '';
				for (var i=0; i<aData.devices.length; i++) {
					listhtml += aData.devices[i].name + ' ';
					if (i > 6 && i<aData.devices.length-1) {
						listhtml += '...';
						break;
					}
				}
				$('td:eq(2)', nRow).html(listhtml);
				
				$('td:eq(3)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-map"><i class="fa fa-map-marker"></i> ' + common.view.map + '</a>');
				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-detail"><i class="fa fa-list-ul"></i> ' + common.view.detail + '</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				buttonhtml += '</div>';
				$('td:eq(4)', nRow).html(buttonhtml);

				var rowdetail = '<span class="row-details row-details-close"></span>';
				$('td:eq(0)', nRow).html(rowdetail);
				
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':DevicegroupTree.branchid });
				aoData.push({'name':'type','value':'1' });
			}
		});
		$('#DevicegroupTable_wrapper').addClass('form-inline');
		$('#DevicegroupTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DevicegroupTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DevicegroupTable_wrapper .dataTables_length select').select2();
		$('#DevicegroupTable').css('width', '100%');

		function fnFormatDetails ( oTable, nTr ) {
			var aData = oTable.fnGetData( nTr );
			var listhtml = '';
			for (var i=0; i<aData.devices.length; i++) {
				listhtml += aData.devices[i].name + ' ';
			}
			var sOut = '<table width="100%">';
			sOut += '<tr><td width="10%">' + common.view.detail + ':</td><td width="90%">' + listhtml + '</td>';
			sOut += '</tr>';
			return sOut;
		}

		$('#DevicegroupTable').on('click', ' tbody td .row-details', function () {
			var nTr = $(this).parents('tr')[0];
			if ( devicegroupTable.fnIsOpen(nTr) ) {
				/* This row is already open - close it */
				$(this).addClass('row-details-close').removeClass('row-details-open');
				devicegroupTable.fnClose( nTr );
			} else {
				/* Open this row */				
				$(this).addClass('row-details-open').removeClass('row-details-close');
				devicegroupTable.fnOpen( nTr, fnFormatDetails(devicegroupTable, nTr), 'details' );
			}
		});
	};
	
	var initDevicegroupEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_devicegroup = $('#DevicegroupTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _devicegroup.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'devicegroup!delete.action',
						cache: false,
						data : {
							devicegroupid: _devicegroup.devicegroupid,
						},
						success : function(data, status) {
							if (data.errorcode == 0) {
								refresh();
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
			_devicegroup = $('#DevicegroupTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.sync + _devicegroup.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'GET',
						url : 'devicegroup!sync.action',
						cache: false,
						data : {
							devicegroupid: _devicegroup.devicegroupid,
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
	};

	var initDevicegroupEditModal = function () {
		var formHandler = new FormHandler($('#DevicegroupEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['devicegroup.name'] = {};
		formHandler.validateOption.rules['devicegroup.name']['required'] = true;
		formHandler.validateOption.rules['devicegroup.name']['maxlength'] = 32;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#DevicegroupEditForm').attr('action'),
				data : $('#DevicegroupEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#DevicegroupEditModal').modal('hide');
						bootbox.alert(common.tips.success);
						refresh();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		};
		$('#DevicegroupEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#DevicegroupEditModal')).on('click', function(event) {
			if ($('#DevicegroupEditForm').valid()) {
				$('#DevicegroupEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#DevicegroupEditForm input[name="devicegroup.branchid"]').val(DevicegroupTree.branchid);
			$('#DevicegroupEditForm').attr('action', 'devicegroup!add.action');
			$('#DevicegroupEditModal').modal();
		});
		
		$('body').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_devicegroup = $('#DevicegroupTable').dataTable().fnGetData(index);
			formHandler.setdata('devicegroup', _devicegroup);
			$('#DevicegroupEditForm').attr('action', 'devicegroup!update.action');
			$('#DevicegroupEditModal').modal();
		});
	};
	
	var initDevicegroupDtlModal = function () {
		var selectedDevices = [];
		var selectedDevicegpDtls = [];
		var _devicetype = 1;
		
		$('body').on('click', '.pix-detail', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_devicegroup = $('#DevicegroupTable').dataTable().fnGetData(index);
			selectedDevices = [];
			selectedDevicegpDtls = [];
			//$('#DevicegpDtlModal input[type=search]').val('').change();
			$('#DeviceTable').dataTable()._fnAjaxUpdate();
			$('#DevicegpDtlTable').dataTable()._fnAjaxUpdate();
			$('#DevicegpDtlModal').modal();
		});
		
		if (Max1 > 0) {
			$('.device-navigator[devicetype="1"]').addClass('active');
			_devicetype = 1;
		} else if (Max2 > 0) {
			$('.device-navigator[devicetype="2"]').addClass('active');
			_devicetype = 2;
		} else if (Max6 > 0) {
			$('.device-navigator[devicetype="6"]').addClass('active');
			_devicetype = 6;
		} else if (Max7 > 0) {
			$('.device-navigator[devicetype="7"]').addClass('active');
			_devicetype = 7;
		} else if (Max10 > 0) {
			$('.device-navigator[devicetype="10"]').addClass('active');
			_devicetype = 10;
		} else if (Max13 > 0) {
			$('.device-navigator[devicetype="13"]').addClass('active');
			_devicetype = 13;
		} else if (Max15 > 0) {
			$('.device-navigator[devicetype="15"]').addClass('active');
			_devicetype = 15;
		}
		$('.device-navigator[devicetype="1"]').css('display', Max1==0?'none':'');
		$('.device-navigator[devicetype="2"]').css('display', Max2==0?'none':'');
		$('.device-navigator[devicetype="6"]').css('display', Max6==0?'none':'');
		$('.device-navigator[devicetype="7"]').css('display', Max7==0?'none':'');
		$('.device-navigator[devicetype="10"]').css('display', Max10==0?'none':'');
		$('.device-navigator[devicetype="13"]').css('display', Max13==0?'none':'');
		$('.device-navigator[devicetype="15"]').css('display', Max15==0?'none':'');

		$('.device-navigator').click(function(event) {
			_devicetype = $(this).attr('devicetype');
			$('#DeviceTable').dataTable()._fnAjaxUpdate();
		});

		//待选择终端table初始化
		$('#DeviceTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'device!list.action',
			'aoColumns' : [ {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'deviceid', 'bSortable' : false }, 
			                {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
							{'sTitle' : common.view.branch, 'mData' : 'branchid', 'bSortable' : false },
							{'sTitle' : common.view.status, 'mData' : 'onlineflag', 'bSortable' : false }],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
				if ( $.inArray(aData.deviceid, selectedDevices) >= 0 ) {
					$(nRow).addClass('active');
					$('td:eq(0)', nRow).html('<input type="checkbox" id="DeviceCheck' + aData.deviceid + '" checked />');
				} else {
					$('td:eq(0)', nRow).html('<input type="checkbox" id="DeviceCheck' + aData.deviceid + '" />');
				}

				$('td:eq(1)', nRow).html(aData.terminalid + '(' + aData.name + ')');
				$('td:eq(2)', nRow).html(aData.branch.name);
				if (aData.status == 0) {
					$('td:eq(3)', nRow).html('<span class="label label-sm label-default">' + common.view.unregister + '</span>');
				} else if (aData.onlineflag == 9) {
					$('td:eq(3)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
				} else if (aData.onlineflag == 1) {
					$('td:eq(3)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
				} else if (aData.onlineflag == 0) {
					$('td:eq(3)', nRow).html('<span class="label label-sm label-info">' + common.view.offline + '</span>');
				}
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':DevicegroupTree.branchid });
				aoData.push({'name':'type','value':_devicetype });
				aoData.push({'name':'devicegroupid','value':'0' });
			} 
		});
		$('#DeviceTable_wrapper').addClass('form-inline');
		$('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DeviceTable_wrapper .dataTables_length select').select2();
		$('#DeviceTable').css('width', '100%');

		//已加入终端table初始化
		$('#DevicegpDtlTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'device!list.action',
			'aoColumns' : [ {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'deviceid', 'bSortable' : false }, 
			                {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
							{'sTitle' : common.view.branch, 'mData' : 'branchid', 'bSortable' : false },
							{'sTitle' : common.view.status, 'mData' : 'onlineflag', 'bSortable' : false }],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				if ( $.inArray(aData.deviceid, selectedDevicegpDtls) >= 0 ) {
					$(nRow).addClass('active');
					$('td:eq(0)', nRow).html('<input type="checkbox" id="DevicegpDtlCheck' + aData.deviceid + '" checked />');
				} else {
					$('td:eq(0)', nRow).html('<input type="checkbox" id="DevicegpDtlCheck' + aData.deviceid + '" />');
				}
				
				$('td:eq(1)', nRow).html(aData.terminalid + '(' + aData.name + ')');
				$('td:eq(2)', nRow).html(aData.branch.name);
				if (aData.status == 0) {
					$('td:eq(3)', nRow).html('<span class="label label-sm label-default">' + common.view.unregister + '</span>');
				} else if (aData.onlineflag == 9) {
					$('td:eq(3)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
				} else if (aData.onlineflag == 1) {
					$('td:eq(3)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
				} else if (aData.onlineflag == 0) {
					$('td:eq(3)', nRow).html('<span class="label label-sm label-info">' + common.view.offline + '</span>');
				}
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':DevicegroupTree.branchid });
				aoData.push({'name':'devicegroupid','value':_devicegroup.devicegroupid });
			} 
		});
		$('#DevicegpDtlTable_wrapper').addClass('form-inline');
		$('#DevicegpDtlTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DevicegpDtlTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DevicegpDtlTable_wrapper .dataTables_length select').select2();
		$('#DevicegpDtlTable').css('width', '100%');

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
				url : 'devicegroup!adddevices.action',
				data : '{"devicegroup":{"devicegroupid":' + _devicegroup.devicegroupid + '}, "detailids":' + $.toJSON(selectedDevices) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					if (data.errorcode == 0) {
						selectedDevices = [];
						selectedDevicegpDtls = [];
						$('#DeviceTable').dataTable()._fnAjaxUpdate();
						$('#DevicegpDtlTable').dataTable()._fnAjaxUpdate();
						refresh();
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
				url : 'devicegroup!deletedevices.action',
				data : '{"devicegroup":{"devicegroupid":' + _devicegroup.devicegroupid + '}, "detailids":' + $.toJSON(selectedDevicegpDtls) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					if (data.errorcode == 0) {
						selectedDevices = [];
						selectedDevicegpDtls = [];
						$('#DeviceTable').dataTable()._fnAjaxUpdate();
						$('#DevicegpDtlTable').dataTable()._fnAjaxUpdate();
						refresh();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		});
	};
	
	var initMapModal = function () {
		var CurrentMap;

		$('body').on('click', '.pix-map', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_devicegroup = $('#DevicegroupTable').dataTable().fnGetData(index);
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
			var points = [];
			for (var i=0; i<_devicegroup.devices.length; i++) {
				var device = _devicegroup.devices[i];
				if (device.longitude > 0 && device.latitude > 0) {
					var point = new BMap.Point(device.longitude, device.latitude);
					points.push(point);
					var marker = new BMap.Marker(point, {title : device.terminalid});
					CurrentMap.addOverlay(marker);
					marker.addEventListener("click", function() {
						var terminalid = this.getTitle();
						var ds = _devicegroup.devices.filter(function (el) {
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
		});

		var GoogleMarkers = [];
		var PreInfoWindow = null;
		$('#GoogleMapModal').on('shown.bs.modal', function (e) {
			if (CurrentMap == null) {
				CurrentMap = new google.maps.Map(document.getElementById('GoogleMapDiv'), {
					zoom: 1,
					center: new google.maps.LatLng(30, 114)
				});
			}
			for (var i = 0; i < GoogleMarkers.length; i++) {
				GoogleMarkers[i].setMap(null);
			}
			GoogleMarkers = [];
			var bounds = new google.maps.LatLngBounds();
			CurrentMap.setCenter(new google.maps.LatLng(30, 114));
			CurrentMap.setZoom(1);
			for (var i=0; i<_devicegroup.devices.length; i++) {
				var device = _devicegroup.devices[i];
				if (device.longitude > 0 && device.latitude > 0) {
					var point = new google.maps.LatLng(parseFloat(device.latitude), parseFloat(device.longitude));
					var marker = new google.maps.Marker({
						position: point,
						map: CurrentMap,
						title: device.terminalid
					});
					GoogleMarkers.push(marker);
					marker.addListener('click', function() {
						var terminalid = this.getTitle();
						 var ds = _devicegroup.devices.filter(function (el) {
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
					CurrentMap.fitBounds(bounds);
				}
			}
		});
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
