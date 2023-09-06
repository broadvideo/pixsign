var DeviceModule = function () {
	var _type = '0';
	var _submitflag = false;
	var _device = {};
	var _onlineflag = '';
	var _status = '';
	var DeviceTree = new BranchTree($('#DevicePortlet'));

	var init = function (type) {
		_type = type;
		initDeviceLicense();
		initDeviceTable();
		initDeviceEvent();
		initDeviceEditModal();
		initConfigModal();
		initDeviceFileModal();
		initMapModal();
		initMedialistModal();
	};

	var refresh = function () {
		$('#DeviceTable').dataTable()._fnAjaxUpdate();
		initDeviceLicense();
	};
	
	var initDeviceLicense = function () {
		$.ajax({
			url: 'device!getlicense.action',
			type : 'POST',
			data : {'type': _type},
			dataType: 'json',
			success : function(data, status) {
				if (data.errorcode == 0) {
					var maxdevices = data.aaData[0].maxdevices;
					var currentdevices = data.aaData[0].currentdevices;
					var devicePercent = 100;
					if (maxdevices > 0) {
						devicePercent = Math.floor(100*currentdevices/maxdevices);
					}
					if (devicePercent > 100) devicePercent = 100;
					var classDeviceProgress = 'progress-bar-success';
					if (devicePercent > 75 && devicePercent < 100) {
						classDeviceProgress = 'progress-bar-warning';
					} else if (devicePercent >= 100) {
						classDeviceProgress = 'progress-bar-danger';
					} 
					
					$('#CurrentDevices').html(common.view.currentdevices + ': ' + currentdevices + ' (' + devicePercent + '%)');
					$('#MaxDevices').html(maxdevices);
					$('#CurrentDevicesProgress').attr('class', 'progress-bar ' + classDeviceProgress);
					$('#CurrentDevicesProgress').attr('style', 'width: ' + devicePercent + '%');
				}
			}
		});
	};
	
	var initDeviceTable = function () {
		var oTable = $('#DeviceTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'device!list.action',
			'aoColumns' : [ {'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '5%' }, 
							{'sTitle' : common.view.device, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '15%' }, 
							{'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.branch, 'mData' : 'branchid', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.position, 'mData' : 'position', 'bSortable' : false, 'sWidth' : '15%' }, 
							{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '25%' }],
			'aoColumnDefs': [
		 					{'bSortable': false, 'aTargets': [ 0 ] }
		 				],
			'order': [],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
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
				devicehtml += aData.name;
				$('td:eq(1)', nRow).html(devicehtml);
				
				$('td:eq(3)', nRow).html(aData.branch.name);
				if (aData.longitude > 0) {
					$('td:eq(4)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-map"><i class="fa fa-map-marker"></i> ' + common.view.map + '</a><br/>' + aData.position);
				}
				
				var buttonhtml = '';
				if (aData.status == 1) {
					buttonhtml += '<div class="util-btn-margin-bottom-5">';
					buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-config"><i class="fa fa-cog"></i> ' + common.view.config + ' </a>';
					buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-pushconfig"><i class="fa fa-rss"></i> ' + common.view.syncconfig + ' </a>';
					buttonhtml += '</div>';
					
					buttonhtml += '<div class="util-btn-margin-bottom-5">';
					buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.syncplan + ' </a>';
					buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-file"><i class="fa fa-list-ul"></i> ' + common.view.fileview + '</a>';
					buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
					buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
					buttonhtml += '</div>';
				} else {
					buttonhtml += '<div class="util-btn-margin-bottom-5">';
					buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-config"><i class="fa fa-cog"></i> ' + common.view.config + ' </a>';
					buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
					buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
					buttonhtml += '</div>';
				}
				$('td:eq(5)', nRow).html(buttonhtml);

				if (aData.status == 1) {
					var rowdetail = '<span class="row-details row-details-close"></span>';
					$('td:eq(0)', nRow).html(rowdetail);
				} else {
					$('td:eq(0)', nRow).html('');
				}
				
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'type','value':_type });
				aoData.push({'name':'branchid','value':DeviceTree.branchid });
				aoData.push({'name':'onlineflag','value':_onlineflag });
				aoData.push({'name':'status','value':_status });
			}
		});
		$('#DeviceTable_wrapper').addClass('form-inline');
		$('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DeviceTable_wrapper .dataTables_length select').select2();
		$('#DeviceTable').css('width', '100%');

		function fnFormatDetails ( oTable, nTr ) {
			var aData = oTable.fnGetData( nTr );
			var sOut = '<table width="100%">';
			sOut += '<tr><td width="20%">' + common.view.hardkey + ':</td><td width="60%">' + aData.hardkey + '</td>';
			sOut += '</tr>';
			sOut += '<tr><td>IP:</td><td>'+aData.iip + '</td></tr>';
			sOut += '<tr><td>MAC:</td><td>'+aData.mac + '</td></tr>';
			sOut += '<tr><td>' + common.view.storageused + ':</td><td>' + PixData.transferIntToByte(aData.storageused) + '</td></tr>';
			sOut += '<tr><td>' + common.view.storageavail + ':</td><td>' + PixData.transferIntToByte(aData.storageavail) + '</td></tr>';
			sOut += '<tr><td>' + common.view.versioncode + ':</td><td>' + aData.boardtype + ' ' + aData.mtype + ' ' + aData.appname + ' ' + aData.vname + '(' + aData.vcode + ')</td></tr>';
			if (aData.networkmode == 0) {
				sOut += '<tr><td>' + common.view.networkmode + ':</td><td>' + common.view.networkmode_0 + '</td></tr>';
			} else if (aData.networkmode == 1) {
				sOut += '<tr><td>' + common.view.networkmode + ':</td><td>' + common.view.networkmode_1 + '</td></tr>';
			} else if (aData.networkmode == 2) {
				sOut += '<tr><td>' + common.view.networkmode + ':</td><td>' + common.view.networkmode_2 + '</td></tr>';
			} else if (aData.networkmode == 3) {
				sOut += '<tr><td>' + common.view.networkmode + ':</td><td>' + common.view.networkmode_3 + '</td></tr>';
			}
			sOut += '<tr><td>' + common.view.networksignal + ':</td><td>' + aData.networksignal + '</td></tr>';
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

		var onlinelist = [];
		onlinelist.push({id: 'All', text: 'All' });
		onlinelist.push({id: 'Online', text: 'Online' });
		onlinelist.push({id: 'Offline', text: 'Offline' });
		$('#OnlineSelect').select2({
			minimumResultsForSearch: -1,
			minimumInputLength: 0,
			data: onlinelist,
			initSelection: function(element, callback) {
				callback({id: '', text: 'All' });
			},
			dropdownCssClass: 'bigdrop', 
			escapeMarkup: function (m) { return m; } 
		});

	    $('#OnlineSelect').on('change', function(e) {
	    	if ($(this).val() == 'Unregister') {
	    		_onlineflag = '';
	    		_status = '0';
	    	} else if ($(this).val() == 'Offline') {
	    		_onlineflag = '0';
	    		_status = '1';
	    	} else if ($(this).val() == 'Online') {
	    		_onlineflag = '1';
	    		_status = '1';
	    	} else if ($(this).val() == 'All') {
	    		_onlineflag = '';
	    		_status = '';
	    	} 
	    	$('#DeviceTable').dataTable().fnDraw(true);
	    });

	};
	
	var initDeviceEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_device = $('#DeviceTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.delete + _device.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'device!delete.action',
						cache: false,
						data : {
							deviceid: _device.deviceid,
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
			_device = $('#DeviceTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.sync + _device.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'GET',
						url : 'device!sync.action',
						cache: false,
						data : {
							deviceid: _device.deviceid,
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
			_device = $('#DeviceTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.config + _device.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'GET',
						url : 'device!config.action',
						cache: false,
						data : {
							deviceid: _device.deviceid,
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
			_device = $('#DeviceTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.reboot + _device.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'GET',
						url : 'device!reboot.action',
						cache: false,
						data : {
							deviceid: _device.deviceid,
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
			_device = $('#DeviceTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.poweroff + _device.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'GET',
						url : 'device!poweroff.action',
						cache: false,
						data : {
							deviceid: _device.deviceid,
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

	var initDeviceEditModal = function () {
		var BranchTreeData = [];
		var _branchid = 0;

		$('#DeviceEditForm #BranchTree').jstree({
			'core' : {
				'multiple' : false,
				'data' : {
					'url': function(node) {
						return 'branch!listnode.action';
					},
					'data': function(node) {
						return {
							'id': node.id,
						}
					}
				}
			},
			'plugins' : ['unique'],
		});

		$.ajax({
			type : 'GET',
			url : 'org!get.action',
			data : '',
			success : function(data, status) {
				if (data.errorcode == 0) {
					var boardtype = $(data.org.boardtype.split(','));
					var boardtypelist = [];
					for (var i=0; i<boardtype.length; i++) {
						boardtypelist.push({
							id: boardtype[i],
							text: boardtype[i],
						})
					}
					if (boardtypelist.length < 2) {
						$('#BoardtypeSelect').parents('.form-group').css('display', 'none');
					} else {
						$('#BoardtypeSelect').select2({
							placeholder: common.tips.detail_select,
							minimumInputLength: 0,
							data: boardtypelist,
							dropdownCssClass: 'bigdrop', 
							escapeMarkup: function (m) { return m; } 
						});
					}
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});

		var formHandler = new FormHandler($('#DeviceEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['device.terminalid'] = {};
		formHandler.validateOption.rules['device.terminalid']['required'] = true;
		formHandler.validateOption.rules['device.name'] = {};
		formHandler.validateOption.rules['device.name']['required'] = true;
		formHandler.validateOption.rules['device.name']['maxlength'] = 32;
		formHandler.validateOption.submitHandler = function(form) {
			if ($('#DeviceEditForm #BranchTree').jstree('get_selected', false).length > 0) {
				$('#DeviceEditForm input[name="device.branchid"]').attr('value', $('#DeviceEditForm #BranchTree').jstree('get_selected', false)[0]);
			}
			$.ajax({
				type : 'POST',
				url : $('#DeviceEditForm').attr('action'),
				data : $('#DeviceEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#DeviceEditModal').modal('hide');
						bootbox.alert(common.tips.success);
						refresh();
					} else {
						$('#DeviceEditModal').modal('hide');
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					$('#DeviceEditModal').modal('hide');
					console.log('failue');
				}
			});
		};
		$('#DeviceEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#DeviceEditModal')).on('click', function(event) {
			if ($('#DeviceEditForm').valid()) {
				$('#DeviceEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#DeviceEditForm #BranchTree').jstree('deselect_all', true);
			$('#DeviceEditForm #BranchTree').jstree('select_node', DeviceTree.branchid);
			$('#DeviceEditForm input[name="device.type"]').val(_type);
			$('#DeviceEditForm').attr('action', 'device!add.action');
			$('#DeviceEditForm input[name="device.terminalid"]').removeAttr('readonly');
			$('#DeviceEditModal').modal();
		});
		
		$('body').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_device = $('#DeviceTable').dataTable().fnGetData(index);
			formHandler.setdata('device', _device);
			$('#DeviceEditForm #BranchTree').jstree('deselect_all', true);
			$('#DeviceEditForm #BranchTree').jstree('select_node', _device.branchid);
			$('#BoardtypeSelect').select2('val', _device.boardtype);
			$('#DeviceEditForm').attr('action', 'device!update.action');
			$('#DeviceEditForm input[name="device.terminalid"]').attr('readonly','readonly');
			$('#DeviceEditModal').modal();
		});
	};
	
	var initConfigModal = function () {
		$('body').on('click', '.pix-config', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_device = $('#DeviceTable').dataTable().fnGetData(index);
			var formdata = new Object();
			for (var name in _device) {
				formdata['device.' + name] = _device[name];
			}
			$('#ConfigForm').loadJSON(formdata);
			$('.volumeRange').ionRangeSlider({
				min: 0,
				max: 100,
				from: 0,
				type: 'single',
				step: 5,
				hasGrid: false
			});
			if ($('input[name="device.volumeflag"]:checked').val() == 1) {
				$('.volumeflag').css('display', '');
				$('.volumeRange').ionRangeSlider('update', {
					from: _device.volume,
				});
			} else {
				$('.volumeflag').css('display', 'none');
			}
			$('#ConfigModal').modal();
		});
		$('[type=submit]', $('#ConfigModal')).on('click', function(event) {
			$.ajax({
				type : 'POST',
				url : 'device!update.action',
				data : $('#ConfigForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#ConfigModal').modal('hide');
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
		});

		$('#ConfigModal').on('shown.bs.modal', function (e) {
			$('.volumeRange').ionRangeSlider('update', {
				from: _device.volume,
			});
		})
		$('input[name="device.volumeflag"]').click(function(e) {
			if ($('input[name="device.volumeflag"]:checked').val() == 1) {
				$('.volumeflag').css('display', '');
				$('.volumeRange').ionRangeSlider('update', {
					from: _device.volume,
				});
			} else {
				$('.volumeflag').css('display', 'none');
			}
		});
		$('#ConfigModal .form_time').datetimepicker({
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
	};
	
	var initDeviceFileModal = function () {
		$('body').on('click', '.pix-file', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_device = $('#DeviceTable').dataTable().fnGetData(index);
			$('#DeviceVideoTable').dataTable()._fnAjaxUpdate();
			$('#DeviceImageTable').dataTable()._fnAjaxUpdate();
			$('#DeviceFileModal').modal();
		});

		$('#DeviceVideoTable').dataTable({
			'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ]
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'devicefile!list.action',
			'aoColumns' : [ {'sTitle' : common.view.id, 'mData' : 'objid', 'bSortable' : false }, 
							{'sTitle' : '', 'mData' : 'devicefileid', 'bSortable' : false }, 
							{'sTitle' : common.view.filename, 'mData' : 'devicefileid', 'bSortable' : false }, 
							{'sTitle' : common.view.size, 'mData' : 'devicefileid', 'bSortable' : false }, 
							{'sTitle' : common.view.progress, 'mData' : 'progress', 'bSortable' : false },
							{'sTitle' : common.view.updatetime, 'mData' : 'updatetime', 'bSortable' : false }],
			'order': [],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				if (aData.video != null) {
					$('td:eq(1)', nRow).html('<img src="/pixsigdata' + aData.video.thumbnail + '" width="40px"></img>');
					$('td:eq(2)', nRow).html(aData.video.filename);
					$('td:eq(3)', nRow).html(PixData.transferIntToComma(aData.video.size));
				} else {
					$('td:eq(1)', nRow).html('');
					$('td:eq(2)', nRow).html('');
					$('td:eq(3)', nRow).html('');
				}
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
				aoData.push({'name':'deviceid','value':_device.deviceid },
							{'name':'objtype','value':'1' });
			} 
		});
		$('#DeviceVideoTable_wrapper').addClass('form-inline');
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
			'sAjaxSource' : 'devicefile!list.action',
			'aoColumns' : [ {'sTitle' : common.view.id, 'mData' : 'objid', 'bSortable' : false }, 
							{'sTitle' : '', 'mData' : 'devicefileid', 'bSortable' : false }, 
							{'sTitle' : common.view.filename, 'mData' : 'devicefileid', 'bSortable' : false }, 
							{'sTitle' : common.view.size, 'mData' : 'devicefileid', 'bSortable' : false }, 
							{'sTitle' : common.view.progress, 'mData' : 'progress', 'bSortable' : false },
							{'sTitle' : common.view.updatetime, 'mData' : 'updatetime', 'bSortable' : false }],
			'order': [],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				if (aData.image != null) {
					$('td:eq(1)', nRow).html('<img src="/pixsigdata' + aData.image.thumbnail + '" width="40px"></img>');
					$('td:eq(2)', nRow).html(aData.image.filename);
					$('td:eq(3)', nRow).html(PixData.transferIntToComma(aData.image.size));
				} else {
					$('td:eq(1)', nRow).html('');
					$('td:eq(2)', nRow).html('');
					$('td:eq(3)', nRow).html('');
				}
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
				aoData.push({'name':'deviceid','value':_device.deviceid },
							{'name':'objtype','value':'2' });
			} 
		});
		$('#DeviceImageTable_wrapper').addClass('form-inline');
		$('#DeviceImageTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
		$('#DeviceImageTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
		$('#DeviceImageTable').css('width', '100%').css('table-layout', 'fixed');

		$('body').on('click', '.pix-DeviceFileReload', function(event) {
			if ($('#portlet_tab1').hasClass('active')) {
				$('#DeviceVideoTable').dataTable()._fnAjaxUpdate();
			} else if ($('#portlet_tab2').hasClass('active')) {
				$('#DeviceImageTable').dataTable()._fnAjaxUpdate();
			}
		});			
	};
	
	
	var initMapModal = function () {
		var CurrentMap;

		$('body').on('click', '.pix-map', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_device = $('#DeviceTable').dataTable().fnGetData(index);
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
				var point = new BMap.Point(_device.longitude, _device.latitude);
				var marker = new BMap.Marker(point);
				var sContent =
					'<div><h4>' + _device.terminalid + ' - ' + _device.name + '</h4>' + 
					'<p>' + _device.addr1 + ' ' + _device.addr2 + '</p>' + 
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
					if (device.longitude > 0) {
						var point = new BMap.Point(device.longitude, device.latitude);
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
				var point = new google.maps.LatLng(parseFloat(_device.latitude), parseFloat(_device.longitude));
				var marker = new google.maps.Marker({
					position: point,
					map: CurrentMap,
					title: _device.terminalid
				});
				GoogleMarkers.push(marker);
				var sContent =
					'<div><h4>' + _device.terminalid + ' - ' + _device.name + '</h4>' + 
					'<p>' + _device.addr1 + '</p>' + 
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
					if (device.longitude > 0) {
						var point = new google.maps.LatLng(parseFloat(device.latitude), parseFloat(device.longitude));
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
	};
	
	var initMedialistModal = function () {
		var selectedMedialistid = 0;

		$('body').on('click', '.pix-medialist', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_device = $('#DeviceTable').dataTable().fnGetData(index);
			selectedMedialistid = 0;
			$('#MedialistTable').dataTable()._fnAjaxUpdate();
			$('#MedialistModal').modal();
		});
		
		$('#MedialistTable').dataTable({
			'sDom' : "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] // change per page values here
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'medialist!list.action',
			'aoColumns' : [ {'sTitle' : '', 'mData' : 'orgid', 'bSortable' : false, 'sWidth' : '10%' }, 
			                {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '15%' }, 
			                {'sTitle' : common.view.detail, 'mData' : 'medialistid', 'bSortable' : false, 'sWidth' : '75%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				if (_device != null && aData.medialistid == _device.defaultmedialistid) {
					$(nRow).addClass('active');
					$('td:eq(0)', nRow).html('<input type="checkbox" id="Check' + aData.medialistid + '" checked />');
				} else {
					$('td:eq(0)', nRow).html('<input type="checkbox" id="Check' + aData.medialistid + '" />');
				}
				
				var listhtml = '';
				for (var i=0; i<aData.medialistdtls.length; i++) {
					var medialistdtl = aData.medialistdtls[i];
					if (i % 6 == 0) {
						listhtml += '<div class="row" >';
					}
					listhtml += '<div class="col-md-2 col-xs-2">';
					if (medialistdtl.objtype == 1) {
						listhtml += '<div class="thumbs">';
						if (medialistdtl.video.thumbnail == null) {
							listhtml += '<img src="../img/video.jpg" class="imgthumb" width="100%" alt="' + medialistdtl.video.name + '" />';
						} else {
							listhtml += '<img src="/pixsigdata' + medialistdtl.video.thumbnail + '" class="imgthumb" width="100%" alt="' + medialistdtl.video.name + '" />';
						}
						listhtml += '</div>';
						listhtml += '<h6 class="pixtitle">' + medialistdtl.video.name + '</h6>';
					} else if (medialistdtl.objtype == 2) {
						var thumbwidth = medialistdtl.image.width > medialistdtl.image.height? 100 : 100*medialistdtl.image.width/medialistdtl.image.height;
						listhtml += '<div class="thumbs">';
						listhtml += '<img src="/pixsigdata' + medialistdtl.image.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + medialistdtl.image.name + '" />';
						listhtml += '</div>';
						listhtml += '<h6 class="pixtitle">' + medialistdtl.image.name + '</h6>';
					}
					listhtml += '</div>';
					if ((i+1) % 6 == 0 || (i+1) == aData.medialistdtls.length) {
						listhtml += '</div>';
					}
				}
				$('td:eq(2)', nRow).html(listhtml);
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#MedialistTable .thumbs').each(function(i) {
					$(this).height($(this).parent().width());
				});
			} 
		});
		$('#MedialistTable_wrapper').addClass('form-inline');
		$('#MedialistTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#MedialistTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#MedialistTable_wrapper .dataTables_length select').select2();
		$('#MedialistTable').css('width', '100%');
		
		$('#MedialistTable').on('click', 'tr', function () {
			var selectedRow = $('#MedialistTable').dataTable().fnGetData(this);
			if (selectedRow != null) {
				var rows = $("#MedialistTable").dataTable().fnGetNodes();
				for (var i=0; i<rows.length; i++) {
					var medialistid = $('#MedialistTable').dataTable().fnGetData(rows[i])['medialistid'];
					$('#Check'+medialistid).prop('checked', false);
					$(rows[i]).removeClass('active');
				}
				selectedMedialistid = selectedRow['medialistid'];
				$('#Check'+selectedMedialistid).prop('checked', true);
				$(this).toggleClass('active');
			}
		});
		
		$('[type=submit]', $('#MedialistModal')).on('click', function(event) {
			if (selectedMedialistid == 0) {
				return;
			}
			$.ajax({
				type : 'POST',
				url : 'device!update.action',
				data : {
					'device.deviceid': _device.deviceid,
					'device.defaultmedialistid': selectedMedialistid,
				},
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#MedialistModal').modal('hide');
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
		});
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();