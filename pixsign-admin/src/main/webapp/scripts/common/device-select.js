var DeviceSelect = function (container) {
	var _self = this;
	this.container = container;
	var _devicetype = 1;
	var _leftdevices = [];
	var _rightdevices = [];
	var _selected = [];
	
	var init = function() {
		if (typeof Max1 !='undefined' && Max1 > 0) {
			$('.select-device-navigator[devicetype="1"]').addClass('active');
			_devicetype = 1;
		} else if (typeof Max2 !='undefined' && Max2 > 0) {
			$('.select-device-navigator[devicetype="2"]').addClass('active');
			_devicetype = 2;
		} else if (typeof Max3 !='undefined' && Max3 > 0) {
			$('.select-device-navigator[devicetype="3"]').addClass('active');
			_devicetype = 3;
		} else if (typeof Max4 !='undefined' && Max4 > 0) {
			$('.select-device-navigator[devicetype="4"]').addClass('active');
			_devicetype = 4;
		} else if (typeof Max5 !='undefined' && Max5 > 0) {
			$('.select-device-navigator[devicetype="5"]').addClass('active');
			_devicetype = 5;
		} else if (typeof Max6 !='undefined' && Max6 > 0) {
			$('.select-device-navigator[devicetype="6"]').addClass('active');
			_devicetype = 6;
		} else if (typeof Max7 !='undefined' && Max7 > 0) {
			$('.select-device-navigator[devicetype="7"]').addClass('active');
			_devicetype = 7;
		} else if (typeof Max9 !='undefined' && Max9 > 0) {
			$('.select-device-navigator[devicetype="9"]').addClass('active');
			_devicetype = 9;
		} else if (typeof Max10 !='undefined' && Max10 > 0) {
			$('.select-device-navigator[devicetype="10"]').addClass('active');
			_devicetype = 10;
		} else if (typeof Max16 !='undefined' && Max16 > 0) {
			$('.select-device-navigator[devicetype="16"]').addClass('active');
			_devicetype = 16;
		}
		$('.select-device-navigator[devicetype="1"]').css('display', typeof Max1=='undefined'||Max1==0?'none':'');
		$('.select-device-navigator[devicetype="2"]').css('display', typeof Max2=='undefined'||Max2==0?'none':'');
		$('.select-device-navigator[devicetype="3"]').css('display', typeof Max3=='undefined'||Max3==0?'none':'');
		$('.select-device-navigator[devicetype="4"]').css('display', typeof Max4=='undefined'||Max4==0?'none':'');
		$('.select-device-navigator[devicetype="5"]').css('display', typeof Max5=='undefined'||Max5==0?'none':'');
		$('.select-device-navigator[devicetype="6"]').css('display', typeof Max6=='undefined'||Max6==0?'none':'');
		$('.select-device-navigator[devicetype="7"]').css('display', typeof Max7=='undefined'||Max7==0?'none':'');
		$('.select-device-navigator[devicetype="9"]').css('display', typeof Max9=='undefined'||Max9==0?'none':'');
		$('.select-device-navigator[devicetype="10"]').css('display', typeof Max10=='undefined'||Max10==0?'none':'');
		$('.select-device-navigator[devicetype="16"]').css('display', typeof Max16=='undefined'||Max16==0?'none':'');
		$('.select-device-navigator').click(function(event) {
			_devicetype = $(this).attr('devicetype');
			$(container).find('#LeftDeviceTable').dataTable()._fnAjaxUpdate();
		});
		
		var DeviceTree = new BranchTree($(container).find('#LeftPorlet'), _self.refresh);
		$(container).find('#LeftDeviceTable').dataTable({
			'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
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
				if ( $.inArray(aData.deviceid, _leftdevices) >= 0 ) {
					$(nRow).addClass('active');
					$('td:eq(0)', nRow).html('<input type="checkbox" id="LeftCheck' + aData.deviceid + '" checked />');
				} else {
					$('td:eq(0)', nRow).html('<input type="checkbox" id="LeftCheck' + aData.deviceid + '" />');
				}

				$('td:eq(1)', nRow).html(aData.terminalid + '(' + aData.name + ')');
				$('td:eq(2)', nRow).html(aData.branch.name);
				if (aData.status == 0) {
					$('td:eq(3)', nRow).html('<span class="label label-sm label-default">' + common.view.unregister + '</span>');
				} else if (aData.onlineflag == 0) {
					$('td:eq(3)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
				} else if (aData.onlineflag == 1) {
					$('td:eq(3)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
				}
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':DeviceTree.branchid });
				aoData.push({'name':'subbranchflag','value':0 });
				aoData.push({'name':'type','value':_devicetype });
				aoData.push({'name':'devicegroupid','value':0 });
			} 
		});
		$(container).find('#LeftDeviceTable_wrapper').addClass('form-inline');
		$(container).find('#LeftDeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$(container).find('#LeftDeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$(container).find('#LeftDeviceTable').css('width', '100%');

		//RightDeviceTable初始化
		$(container).find('#RightDeviceTable').dataTable({
			'sDom' : 't',
			'iDisplayLength' : -1,
			'aoColumns' : [ {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'deviceid', 'bSortable' : false }, 
			                {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
							{'sTitle' : common.view.branch, 'mData' : 'branchid', 'bSortable' : false }, 
							{'sTitle' : common.view.status, 'mData' : 'onlineflag', 'bSortable' : false }],
			'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
			'oLanguage' : { 'sZeroRecords' : common.view.empty,
							'sEmptyTable' : common.view.empty }, 
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				if ( $.inArray(aData.deviceid, _rightdevices) >= 0 ) {
					$(nRow).addClass('active');
					$('td:eq(0)', nRow).html('<input type="checkbox" id="RightCheck' + aData.deviceid + '" checked />');
				} else {
					$('td:eq(0)', nRow).html('<input type="checkbox" id="RightCheck' + aData.deviceid + '" />');
				}
				
				$('td:eq(1)', nRow).html(aData.terminalid + '(' + aData.name + ')');
				$('td:eq(2)', nRow).html(aData.branch.name);
				if (aData.status == 0) {
					$('td:eq(3)', nRow).html('<span class="label label-sm label-default">' + common.view.unregister + '</span>');
				} else if (aData.onlineflag == 0) {
					$('td:eq(3)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
				} else if (aData.onlineflag == 1) {
					$('td:eq(3)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
				}
				return nRow;
			}
		});

		$('#LeftDeviceTable').on('click', 'tr', function () {
			var device = $('#LeftDeviceTable').dataTable().fnGetData(this);
			if (device == null) return;
			var deviceid = device.deviceid;
			var index = -1;
			for (var i=0; i<_leftdevices.length; i++) {
				if (_leftdevices[i].deviceid == deviceid) {
					index = i;
					break;
				}
			}
			if (index >= 0) {
				_leftdevices.splice(index, 1);
				$('#LeftCheck'+deviceid).prop('checked', false);
			} else {
				_leftdevices.push(device);
				$('#LeftCheck'+deviceid).prop('checked', true);
			}
			$(this).toggleClass('active');
		});
		$('#CheckAll', $('#LeftDeviceTable')).on('click', function() {
			var rows = $("#LeftDeviceTable").dataTable().fnGetNodes();
			for (var i=0; i<rows.length; i++) {
				var device = $('#LeftDeviceTable').dataTable().fnGetData(rows[i]);
				var deviceid = device.deviceid;
				if (this.checked) {
					$(rows[i]).addClass('active');
				} else {
					$(rows[i]).removeClass('active');
				}
				$('#LeftCheck'+deviceid).prop('checked', this.checked);
				var index = -1;
				for (var j=0; j<_leftdevices.length; j++) {
					if (_leftdevices[j].deviceid == deviceid) {
						index = j;
						break;
					}
				}
				if (index == -1 && this.checked) {
					_leftdevices.push(device);
				} else if (index >= 0 && !this.checked) {
					_leftdevices.splice(index, 1);
				}
		    }
		});

		$('#RightDeviceTable').on('click', 'tr', function () {
			var device = $('#RightDeviceTable').dataTable().fnGetData(this);
			if (device == null) return;
			var deviceid = device.deviceid;
			var index = -1;
			for (var i=0; i<_rightdevices.length; i++) {
				if (_rightdevices[i].deviceid == deviceid) {
					index = i;
					break;
				}
			}
			if (index >= 0) {
				_rightdevices.splice(index, 1);
				$('#RightCheck'+deviceid).prop('checked', false);
			} else {
				_rightdevices.push(device);
				$('#RightCheck'+deviceid).prop('checked', true);
			}
			$(this).toggleClass('active');
		});
		$('#CheckAll', $('#RightDeviceTable')).on('click', function() {
			var rows = $("#RightDeviceTable").dataTable().fnGetNodes();
			for (var i=0; i<rows.length; i++) {
				var device = $('#RightDeviceTable').dataTable().fnGetData(rows[i]);
				var deviceid = device.deviceid;
				if (this.checked) {
					$(rows[i]).addClass('active');
				} else {
					$(rows[i]).removeClass('active');
				}
				$('#RightCheck'+deviceid).prop('checked', this.checked);
				var index = -1;
				for (var j=0; j<_rightdevices.length; j++) {
					if (_rightdevices[j].deviceid == deviceid) {
						index = j;
						break;
					}
				}
				if (index == -1 && this.checked) {
					_rightdevices.push(device);
				} else if (index >= 0 && !this.checked) {
					_rightdevices.splice(index, 1);
				}
		    }
		} );

		$('body').on('click', '.pix-left2right', function(event) {
			for (var i=0; i<_leftdevices.length; i++) {
				var index = -1;
				for (var j=0; j<_selected.length; j++) {
					if (_selected[j].deviceid == _leftdevices[i].deviceid) {
						index = j;
						break;
					}
				}
				if (index == -1) {
					_selected.push(_leftdevices[i]);
				}
			}
			refreshRightDeviceTable();
		});

		$('body').on('click', '.pix-right2left', function(event) {
			for (var i=0; i<_rightdevices.length; i++) {
				var index = -1;
				for (var j=0; j<_selected.length; j++) {
					if (_selected[j].deviceid == _rightdevices[i].deviceid) {
						index = j;
						break;
					}
				}
				if (index >= 0) {
					_selected.splice(index, 1);
				}
			}
			refreshRightDeviceTable();
		});
	}
	
	function refreshRightDeviceTable() {
		_rightdevices = [];
		$(container).find('#RightDeviceTable').dataTable().fnClearTable();
		for (var i=0; i<_selected.length; i++) {
			$(container).find('#RightDeviceTable').dataTable().fnAddData(_selected[i]);
		}
	}
	
	this.refresh = function(page) {
		_leftdevices = [];
		_rightdevices = [];
		$(container).find('#LeftDeviceTable').dataTable()._fnAjaxUpdate();
		refreshRightDeviceTable();
	}
	
	this.clear = function() {
		_leftdevices = [];
		_rightdevices = [];
		_selected = [];
		$(container).find('#LeftDeviceTable').dataTable()._fnAjaxUpdate();
		refreshRightDeviceTable();
	}
	
	this.getSelected = function() {
		return _selected;
	}

	init();
};
