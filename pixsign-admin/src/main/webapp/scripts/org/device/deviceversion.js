var DeviceVersionModule = function () {
	var _devicetype = 1;
	var _device = {};
	this.DeviceTree = new BranchTree($('#DevicePortlet'));

	var init = function () {
		initDeviceTable();
		initAllDeviceModal();
		initSoloDeviceModal();
	};

	var refresh = function () {
		$('#DeviceTable').dataTable()._fnAjaxUpdate();
	};
	
	var initDeviceTable = function () {
		if (Max1 > 0) {
			$('.device-navigator[devicetype="1"]').addClass('active');
			_devicetype = 1;
		} else if (Max2 > 0) {
			$('.device-navigator[devicetype="2"]').addClass('active');
			_devicetype = 2;
		} else if (Max3 > 0) {
			$('.device-navigator[devicetype="3"]').addClass('active');
			_devicetype = 3;
		} else if (Max4 > 0) {
			$('.device-navigator[devicetype="4"]').addClass('active');
			_devicetype = 4;
		} else if (Max5 > 0) {
			$('.device-navigator[devicetype="5"]').addClass('active');
			_devicetype = 5;
		} else if (Max6 > 0) {
			$('.device-navigator[devicetype="6"]').addClass('active');
			_devicetype = 6;
		} else if (Max7 > 0) {
			$('.device-navigator[devicetype="7"]').addClass('active');
			_devicetype = 7;
		} else if (Max9 > 0) {
			$('.device-navigator[devicetype="9"]').addClass('active');
			_devicetype = 9;
		} else if (Max10 > 0) {
			$('.device-navigator[devicetype="10"]').addClass('active');
			_devicetype = 10;
		} else if (Max11 > 0) {
			$('.device-navigator[devicetype="11"]').addClass('active');
			_devicetype = 11;
		} else if (Max13 > 0) {
			$('.device-navigator[devicetype="13"]').addClass('active');
			_devicetype = 13;
		} else if (Max15 > 0) {
			$('.device-navigator[devicetype="15"]').addClass('active');
			_devicetype = 15;
		}
		$('.device-navigator[devicetype="1"]').css('display', Max1==0?'none':'');
		$('.device-navigator[devicetype="2"]').css('display', Max2==0?'none':'');
		$('.device-navigator[devicetype="3"]').css('display', Max3==0?'none':'');
		$('.device-navigator[devicetype="4"]').css('display', Max4==0?'none':'');
		$('.device-navigator[devicetype="5"]').css('display', Max5==0?'none':'');
		$('.device-navigator[devicetype="6"]').css('display', Max6==0?'none':'');
		$('.device-navigator[devicetype="7"]').css('display', Max7==0?'none':'');
		$('.device-navigator[devicetype="9"]').css('display', Max9==0?'none':'');
		$('.device-navigator[devicetype="10"]').css('display', Max10==0?'none':'');
		$('.device-navigator[devicetype="11"]').css('display', Max11==0?'none':'');
		$('.device-navigator[devicetype="13"]').css('display', Max13==0?'none':'');
		$('.device-navigator[devicetype="15"]').css('display', Max15==0?'none':'');

		$('.device-navigator').click(function(event) {
			_devicetype = $(this).attr('devicetype');
			$('#DeviceTable').dataTable()._fnAjaxUpdate();
		});

		$('#DeviceTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'device!list.action',
			'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'terminalid', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.onlineflag, 'mData' : 'onlineflag', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.mtype, 'mData' : 'mtype', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.appname, 'mData' : 'appname', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.versioncode, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.upgradeflag, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '10%' }],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				if (aData.name != aData.terminalid) {
					$('td:eq(0)', nRow).html(aData.name + '(' + aData.terminalid + ')');
				}
				if (aData.status == 0) {
					$('td:eq(1)', nRow).html('<span class="label label-sm label-default">' + common.view.unregister + '</span>');
				} else if (aData.onlineflag == 9) {
					$('td:eq(1)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
				} else if (aData.onlineflag == 1) {
					$('td:eq(1)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
				} else if (aData.onlineflag == 0) {
					$('td:eq(1)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
				}
				if (aData.mtype != null) {
					$('td:eq(2)', nRow).html(aData.mtype);
				} else {
					$('td:eq(2)', nRow).html('');
				}
				$('td:eq(4)', nRow).html(aData.vname + '(' + aData.vcode + ')');
				
				if (aData.upgradeflag == 0) {
					$('td:eq(5)', nRow).html('<span class="label label-sm label-default">' + common.view.upgradeflag_0 + '</span>');
				} else if (aData.upgradeflag == 1) {
					$('td:eq(5)', nRow).html('<span class="label label-sm label-success">' + common.view.upgradeflag_1 + '</span>');
				} else if (aData.upgradeflag == 2) {
					if (aData.appfile != null) {
						$('td:eq(5)', nRow).html('<span class="label label-sm label-warning">' + common.view.upgradeflag_2 + '</span>' + aData.appfile.vname + '(' + aData.appfile.vcode + ')');
					} else {
						$('td:eq(5)', nRow).html('<span class="label label-sm label-warning">' + common.view.upgradeflag_2 + '</span>');
					}
				} else {
					$('td:eq(5)', nRow).html('');
				}
				
				$('td:eq(6)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-upgrade"><i class="fa fa-delicious"></i> ' + common.view.upgradeflag + '</a>');

				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':DeviceTree.branchid });
				aoData.push({'name':'type','value':_devicetype });
				aoData.push({'name':'status','value':1 });
			}
		});
		$('#DeviceTable_wrapper').addClass('form-inline');
		$('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DeviceTable_wrapper .dataTables_length select').select2();
		$('#DeviceTable').css('width', '100%');
	};
	
	var initAllDeviceModal = function () {
		$('body').on('click', '.pix-all-upgrade', function(event) {
			$('#AllDeviceModal').modal();
		});

		$('[type=submit]', $('#AllDeviceModal')).on('click', function(event) {
			$.ajax({
				type : 'POST',
				url : 'device!updateupgradeflag.action',
				data : {
					branchid: DeviceTree.branchid,
					type: _devicetype, 
					upgradeflag: $('#AllDeviceForm input[name="upgradeflag"]:checked').val()
				},
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#AllDeviceModal').modal('hide');
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

	var initSoloDeviceModal = function () {
		var formHandler = new FormHandler($('#SoloDeviceForm'));
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : 'device!update.action',
				data : $('#SoloDeviceForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#SoloDeviceModal').modal('hide');
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
		$('#SoloDeviceForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#SoloDeviceModal')).on('click', function(event) {
			if ($('#SoloDeviceForm').valid()) {
				$('#SoloDeviceForm').submit();
			}
		});

		$('body').on('click', '.pix-upgrade', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_device = $('#DeviceTable').dataTable().fnGetData(index);
			formHandler.setdata('device', _device);
			refreshAppfile();
			$("#AppfileSelect").select2('val', _device.appfileid);
			if (_device.upgradeflag == 2) {
				$('.upgradeflag').css('display', '');
				formHandler.validateOption.rules = {};
				formHandler.validateOption.rules['device.appfileid'] = {};
				formHandler.validateOption.rules['device.appfileid']['required'] = true;
				$('#SoloDeviceForm').validate(formHandler.validateOption);
				$.extend($('#SoloDeviceForm').validate().settings, {
					rules: formHandler.validateOption.rules
				});
			} else {
				$('.upgradeflag').css('display', 'none');
				formHandler.validateOption.rules = {};
				$('#SoloDeviceForm').validate(formHandler.validateOption);
				$.extend($('#SoloDeviceForm').validate().settings, {
					rules: formHandler.validateOption.rules
				});
			}
			$('#SoloDeviceModal').modal();
		});

		$('#SoloDeviceForm input[name="device.upgradeflag"]').click(function(e) {
			if ($('#SoloDeviceForm input[name="device.upgradeflag"]:checked').val() == 2) {
				$('.upgradeflag').css('display', '');
				formHandler.validateOption.rules = {};
				formHandler.validateOption.rules['device.appfileid'] = {};
				formHandler.validateOption.rules['device.appfileid']['required'] = true;
				$('#SoloDeviceForm').validate(formHandler.validateOption);
				$.extend($('#SoloDeviceForm').validate().settings, {
					rules: formHandler.validateOption.rules
				});
			} else {
				$('.upgradeflag').css('display', 'none');
				$('input[name="device.appfileid"]').val(0);
				formHandler.validateOption.rules = {};
				$('#SoloDeviceForm').validate(formHandler.validateOption);
				$.extend($('#SoloDeviceForm').validate().settings, {
					rules: formHandler.validateOption.rules
				});
			}
		});  

		function refreshAppfile() {
			$.ajax({
				type : 'GET',
				url : 'appfile!list.action',
				data : {
					name: _device.appname,
					mtype: _device.mtype
				},
				dataType: 'json',
				success : function(data, status) {
					if (data.errorcode == 0) {
						var appfilelist = [];
						for (var i=0; i<data.aaData.length; i++) {
							appfilelist.push({
								id: data.aaData[i].appfileid,
								text: data.aaData[i].mtype + ' ' + data.aaData[i].name + ' ' + data.aaData[i].vname + '(' + data.aaData[i].vcode + ')'
							});
						}
						$("#AppfileSelect").select2({
							placeholder: common.tips.detail_select,
							minimumInputLength: 0,
							data: appfilelist,
							dropdownCssClass: "bigdrop", 
							escapeMarkup: function (m) { return m; } 
						});
					} else {
						bootbox.alert(data.errorcode + ": " + data.errormsg);
					}
				},
				error : function() {
					bootbox.alert('failure');
				}
			});
		}
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
