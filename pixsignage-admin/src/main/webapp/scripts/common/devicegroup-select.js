var DevicegroupSelect = function (container) {
	var _self = this;
	this.container = container;
	var _leftdevicegroups = [];
	var _rightdevicegroups = [];
	var _selected = [];
	
	var init = function() {
		var DevicegroupTree = new BranchTree($(container).find('#LeftPorlet'), _self.refresh);
		$(container).find('#LeftDevicegroupTable').dataTable({
			'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'devicegroup!list.action',
			'aoColumns' : [ {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '10%' }, 
			                {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' }, 
			                {'sTitle' : common.view.detail, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '60%' }],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				if ( $.inArray(aData.devicegroupid, _leftdevicegroups) >= 0 ) {
					$(nRow).addClass('active');
					$('td:eq(0)', nRow).html('<input type="checkbox" id="LeftCheck' + aData.devicegroupid + '" checked />');
				} else {
					$('td:eq(0)', nRow).html('<input type="checkbox" id="LeftCheck' + aData.devicegroupid + '" />');
				}

				$('td:eq(1)', nRow).html(aData.name);
				var listhtml = '';
				for (var i=0; i<aData.devices.length; i++) {
					listhtml += aData.devices[i].name + ' ';
					if (i > 6 && i<aData.devices.length-1) {
						listhtml += '...';
						break;
					}
				}
				$('td:eq(2)', nRow).html(listhtml);
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':DevicegroupTree.branchid });
				aoData.push({'name':'type','value':'1' });
			} 
		});
		$(container).find('#LeftDevicegroupTable_wrapper').addClass('form-inline');
		$(container).find('#LeftDevicegroupTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$(container).find('#LeftDevicegroupTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$(container).find('#LeftDevicegroupTable').css('width', '100%');

		//RightDevicegroupTable初始化
		$(container).find('#RightDevicegroupTable').dataTable({
			'sDom' : 't',
			'iDisplayLength' : -1,
			'aoColumns' : [ {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '10%' }, 
			                {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' }, 
			                {'sTitle' : common.view.detail, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '60%' }],
			'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
			'oLanguage' : { 'sZeroRecords' : common.view.empty,
							'sEmptyTable' : common.view.empty }, 
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				if ( $.inArray(aData.devicegroupid, _rightdevicegroups) >= 0 ) {
					$(nRow).addClass('active');
					$('td:eq(0)', nRow).html('<input type="checkbox" id="RightCheck' + aData.devicegroupid + '" checked />');
				} else {
					$('td:eq(0)', nRow).html('<input type="checkbox" id="RightCheck' + aData.devicegroupid + '" />');
				}
				
				$('td:eq(1)', nRow).html(aData.name);
				var listhtml = '';
				for (var i=0; i<aData.devices.length; i++) {
					listhtml += aData.devices[i].name + ' ';
					if (i > 6 && i<aData.devices.length-1) {
						listhtml += '...';
						break;
					}
				}
				$('td:eq(2)', nRow).html(listhtml);
				return nRow;
			}
		});

		$('#LeftDevicegroupTable').on('click', 'tr', function () {
			var devicegroup = $('#LeftDevicegroupTable').dataTable().fnGetData(this);
			if (devicegroup == null) return;
			var devicegroupid = devicegroup.devicegroupid;
			var index = -1;
			for (var i=0; i<_leftdevicegroups.length; i++) {
				if (_leftdevicegroups[i].devicegroupid == devicegroupid) {
					index = i;
					break;
				}
			}
			if (index >= 0) {
				_leftdevicegroups.splice(index, 1);
				$('#LeftCheck'+devicegroupid).prop('checked', false);
			} else {
				_leftdevicegroups.push(devicegroup);
				$('#LeftCheck'+devicegroupid).prop('checked', true);
			}
			$(this).toggleClass('active');
		});
		$('#CheckAll', $('#LeftDevicegroupTable')).on('click', function() {
			var rows = $("#LeftDevicegroupTable").dataTable().fnGetNodes();
			for (var i=0; i<rows.length; i++) {
				var devicegroup = $('#LeftDevicegroupTable').dataTable().fnGetData(rows[i]);
				var devicegroupid = devicegroup.devicegroupid;
				if (this.checked) {
					$(rows[i]).addClass('active');
				} else {
					$(rows[i]).removeClass('active');
				}
				$('#LeftCheck'+devicegroupid).prop('checked', this.checked);
				var index = -1;
				for (var j=0; j<_leftdevicegroups.length; j++) {
					if (_leftdevicegroups[j].devicegroupid == devicegroupid) {
						index = j;
						break;
					}
				}
				if (index == -1 && this.checked) {
					_leftdevicegroups.push(devicegroup);
				} else if (index >= 0 && !this.checked) {
					_leftdevicegroups.splice(index, 1);
				}
		    }
		});

		$('#RightDevicegroupTable').on('click', 'tr', function () {
			var devicegroup = $('#RightDevicegroupTable').dataTable().fnGetData(this);
			if (devicegroup == null) return;
			var devicegroupid = devicegroup.devicegroupid;
			var index = -1;
			for (var i=0; i<_rightdevicegroups.length; i++) {
				if (_rightdevicegroups[i].devicegroupid == devicegroupid) {
					index = i;
					break;
				}
			}
			if (index >= 0) {
				_rightdevicegroups.splice(index, 1);
				$('#RightCheck'+devicegroupid).prop('checked', false);
			} else {
				_rightdevicegroups.push(devicegroup);
				$('#RightCheck'+devicegroupid).prop('checked', true);
			}
			$(this).toggleClass('active');
		});
		$('#CheckAll', $('#RightDevicegroupTable')).on('click', function() {
			var rows = $("#RightDevicegroupTable").dataTable().fnGetNodes();
			for (var i=0; i<rows.length; i++) {
				var devicegroup = $('#RightDevicegroupTable').dataTable().fnGetData(rows[i]);
				var devicegroupid = devicegroup.devicegroupid;
				if (this.checked) {
					$(rows[i]).addClass('active');
				} else {
					$(rows[i]).removeClass('active');
				}
				$('#RightCheck'+devicegroupid).prop('checked', this.checked);
				var index = -1;
				for (var j=0; j<_rightdevicegroups.length; j++) {
					if (_rightdevicegroups[j].devicegroupid == devicegroupid) {
						index = j;
						break;
					}
				}
				if (index == -1 && this.checked) {
					_rightdevicegroups.push(devicegroup);
				} else if (index >= 0 && !this.checked) {
					_rightdevicegroups.splice(index, 1);
				}
		    }
		} );

		$('body').on('click', '.pix-left2right', function(event) {
			for (var i=0; i<_leftdevicegroups.length; i++) {
				var index = -1;
				for (var j=0; j<_selected.length; j++) {
					if (_selected[j].devicegroupid == _leftdevicegroups[i].devicegroupid) {
						index = j;
						break;
					}
				}
				if (index == -1) {
					_selected.push(_leftdevicegroups[i]);
				}
			}
			refreshRightDevicegroupTable();
		});

		$('body').on('click', '.pix-right2left', function(event) {
			for (var i=0; i<_rightdevicegroups.length; i++) {
				var index = -1;
				for (var j=0; j<_selected.length; j++) {
					if (_selected[j].devicegroupid == _rightdevicegroups[i].devicegroupid) {
						index = j;
						break;
					}
				}
				if (index >= 0) {
					_selected.splice(index, 1);
				}
			}
			refreshRightDevicegroupTable();
		});
	}
	
	function refreshRightDevicegroupTable() {
		_rightdevicegroups = [];
		$(container).find('#RightDevicegroupTable').dataTable().fnClearTable();
		for (var i=0; i<_selected.length; i++) {
			$(container).find('#RightDevicegroupTable').dataTable().fnAddData(_selected[i]);
		}
	}
	
	this.refresh = function(page) {
		_leftdevicegroups = [];
		_rightdevicegroups = [];
		$(container).find('#LeftDevicegroupTable').dataTable()._fnAjaxUpdate();
		refreshRightDevicegroupTable();
	}
	
	this.clear = function() {
		_leftdevicegroups = [];
		_rightdevicegroups = [];
		_selected = [];
		$(container).find('#LeftDevicegroupTable').dataTable()._fnAjaxUpdate();
		refreshRightDevicegroupTable();
	}
	
	this.getSelected = function() {
		return _selected;
	}

	init();
};
