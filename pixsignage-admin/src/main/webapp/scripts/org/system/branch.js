var BranchModule = function () {
	var _parentid = -1;
	var _branch = {};
	var BranchTree;
	var TreeData = [];

	var init = function () {
		initBranchTree();
		initBranchTable();
		initBranchEvent();
		initBranchEditModal();
		initDeviceModal();
	};

	var refresh = function () {
		$('#BranchTable').dataTable()._fnAjaxUpdate();
		$('#BranchPortlet .branchtree').jstree(true).refresh_node(_parentid);
	};
	
	var initBranchTree = function () {
		BranchTree = $('#BranchPortlet .branchtree');
		BranchTree.jstree('destroy');
		BranchTree.jstree({
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
		BranchTree.on('loaded.jstree', function() {
			_parentid = BranchTree.jstree(true).get_json('#')[0].id;
			BranchTree.jstree('select_node', _parentid);
			refresh();
		});
		BranchTree.on('select_node.jstree', function(event, data) {
			_parentid = data.instance.get_node(data.selected[0]).id;
			refresh();
		});
	};
	
	var initBranchTable = function () {
		$('#BranchTable').dataTable({
			'sDom' : 'rt',
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'branch!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
			        		{'sTitle' : common.view.code, 'mData' : 'code', 'bSortable' : false }, 
			        		{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false }, 
			        		{'sTitle' : '', 'mData' : 'branchid', 'bSortable' : false }, 
			        		{'sTitle' : '', 'mData' : 'branchid', 'bSortable' : false }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(3)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
				if (aData.childcount == 0) {
					$('td:eq(4)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
				} else {
					$('td:eq(4)', nRow).html('');
				}
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'parentid','value':_parentid });
			}
		});
		$('#BranchTable').css('width', '100%').css('table-layout', 'fixed');
	};

	var initBranchEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_branch = $('#BranchTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _branch.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'branch!delete.action',
						cache: false,
						data : {
							'branch.branchid': _branch.branchid
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
	};

	var initBranchEditModal = function () {
		var formHandler = new FormHandler($('#BranchEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['branch.name'] = {};
		formHandler.validateOption.rules['branch.name']['required'] = true;
		formHandler.validateOption.rules['branch.name']['minlength'] = 2;
		formHandler.validateOption.rules['branch.name']['remote'] = {
			url: 'branch!validate.action',
			type: 'post',
			data: {
				'branch.branchid': function() {
					return $('#BranchEditForm input[name="branch.branchid"]').val();
				},
				'branch.name': function() {
					return $('#BranchEditForm input[name="branch.name"]').val();
				}
			},
			dataFilter: function(responseString) {
				var response = $.parseJSON(responseString);
				if (response.errorcode == 0) {
					return true;
				}
				return false;
			}
		};
		formHandler.validateOption.messages = {
			'branch.name': {
				remote: common.tips.name_repeat
			},
		};
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#BranchEditForm').attr('action'),
				data : $('#BranchEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#BranchEditModal').modal('hide');
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
		$('#BranchEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#BranchEditModal')).on('click', function(event) {
			if ($('#BranchEditForm').valid()) {
				$('#BranchEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			formHandler.reset();
			$('#BranchEditForm').attr('action', 'branch!add.action');
			$('#BranchEditForm input[name="branch.parentid"]').attr('value', _parentid);
			$('#BranchEditModal').modal();
		});

		$('#BranchTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_branch = $('#BranchTable').dataTable().fnGetData(index);
			formHandler.setdata('branch', _branch);
			$('#BranchEditForm').attr('action', 'branch!update.action');
			$('#BranchEditModal').modal();
		});
	};

	var initDeviceModal = function () {
		var LeftTree = $('#LeftTreeDiv').find('.branchtree');
		var RightTree = $('#RightTreeDiv').find('.branchtree');
		var LeftBranchid = null;
		var RightBranchid = null;
		var LeftDevices = [];
		var RightDevices = [];
		
		$('body').on('click', '.pix-device', function(event) {
			LeftBranchid = null;
			RightBranchid = null;
			LeftDevices = [];
			RightDevices = [];
			$('#LeftTable').dataTable()._fnAjaxUpdate();
			$('#RightTable').dataTable()._fnAjaxUpdate();
			initBranchTreeData();
			$('#DeviceModal').modal();
		});
		
		function initBranchTreeData() {
			LeftTree.jstree('destroy');
			LeftTree.jstree({
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
			LeftTree.on('loaded.jstree', function() {
				LeftBranchid = LeftTree.jstree(true).get_json('#')[0].id;
				LeftTree.jstree('select_node', LeftBranchid);
			});
			LeftTree.on('select_node.jstree', function(event, data) {
				LeftBranchid = data.instance.get_node(data.selected[0]).id;
				LeftDevices = [];
				$('#LeftTable').dataTable()._fnAjaxUpdate();
			});

			RightTree.jstree('destroy');
			RightTree.jstree({
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
			RightTree.on('loaded.jstree', function() {
				RightBranchid = RightTree.jstree(true).get_json('#')[0].id;
				RightTree.jstree('select_node', RightBranchid);
			});
			RightTree.on('select_node.jstree', function(event, data) {
				RightBranchid = data.instance.get_node(data.selected[0]).id;
				RightDevices = [];
				$('#RightTable').dataTable()._fnAjaxUpdate();
			});
		}

		$('#LeftTable').dataTable({
			'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'device!list.action',
			'aoColumns' : [ {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'deviceid', 'bSortable' : false }, 
			                {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
							{'sTitle' : common.view.position, 'mData' : 'position', 'bSortable' : false },
							{'sTitle' : common.view.status, 'mData' : 'onlineflag', 'bSortable' : false }],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
				if ( $.inArray(aData.deviceid, LeftDevices) >= 0 ) {
					$(nRow).addClass('active');
					$('td:eq(0)', nRow).html('<input type="checkbox" id="LeftCheck' + aData.deviceid + '" checked />');
				} else {
					$('td:eq(0)', nRow).html('<input type="checkbox" id="LeftCheck' + aData.deviceid + '" />');
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
				aoData.push({'name':'branchid','value':LeftBranchid });
				aoData.push({'name':'type','value':'1' });
			} 
		});

		$('#RightTable').dataTable({
			'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'device!list.action',
			'aoColumns' : [ {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'deviceid', 'bSortable' : false }, 
			                {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
							{'sTitle' : common.view.position, 'mData' : 'position', 'bSortable' : false },
							{'sTitle' : common.view.status, 'mData' : 'onlineflag', 'bSortable' : false }],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				if ( $.inArray(aData.deviceid, RightDevices) >= 0 ) {
					$(nRow).addClass('active');
					$('td:eq(0)', nRow).html('<input type="checkbox" id="RightCheck' + aData.deviceid + '" checked />');
				} else {
					$('td:eq(0)', nRow).html('<input type="checkbox" id="RightCheck' + aData.deviceid + '" />');
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
				aoData.push({'name':'branchid','value':RightBranchid });
				aoData.push({'name':'type','value':'1' });
			} 
		});

		$('#LeftTable').on('click', 'tr', function () {
			var row = $('#LeftTable').dataTable().fnGetData(this);
			if (row == null) return;
			var deviceid = row.deviceid;
			var index = $.inArray(deviceid, LeftDevices);
			if (index >= 0) {
				LeftDevices.splice(index, 1);
				$('#LeftCheck'+deviceid).prop('checked', false);
			} else {
				LeftDevices.push(deviceid);
				$('#LeftCheck'+deviceid).prop('checked', true);
			}
			$(this).toggleClass('active');
		});
		$('#CheckAll', $('#LeftTable')).on('click', function() {
			var rows = $("#LeftTable").dataTable().fnGetNodes();
			for (var i=0; i<rows.length; i++) {
				var deviceid = $('#LeftTable').dataTable().fnGetData(rows[i]).deviceid;
				if (this.checked) {
					$(rows[i]).addClass('active');
				} else {
					$(rows[i]).removeClass('active');
				}
				$('#LeftCheck'+deviceid).prop('checked', this.checked);
				var index = $.inArray(deviceid, LeftDevices);
				if (index == -1 && this.checked) {
					LeftDevices.push(deviceid);
				} else if (index >= 0 && !this.checked) {
					LeftDevices.splice(index, 1);
				}
		    }
		});

		$('#RightTable').on('click', 'tr', function () {
			var row = $('#RightTable').dataTable().fnGetData(this);
			if (row == null) return;
			var deviceid = row.deviceid;
			var index = $.inArray(deviceid, RightDevices);
			if (index >= 0) {
				RightDevices.splice(index, 1);
				$('#RightCheck'+deviceid).prop('checked', false);
			} else {
				RightDevices.push(deviceid);
				$('#RightCheck'+deviceid).prop('checked', true);
			}
			$(this).toggleClass('active');
		});
		$('#CheckAll', $('#RightTable')).on('click', function() {
			var rows = $("#RightTable").dataTable().fnGetNodes();
			for (var i=0; i<rows.length; i++) {
				var deviceid = $('#RightTable').dataTable().fnGetData(rows[i]).deviceid;
				if (this.checked) {
					$(rows[i]).addClass('active');
				} else {
					$(rows[i]).removeClass('active');
				}
				$('#RightCheck'+deviceid).prop('checked', this.checked);
				var index = $.inArray(deviceid, RightDevices);
				if (index == -1 && this.checked) {
					RightDevices.push(deviceid);
				} else if (index >= 0 && !this.checked) {
					RightDevices.splice(index, 1);
				}
		    }
		} );

		$('body').on('click', '.pix-left2right', function(event) {
			$.ajax({
				type : 'POST',
				url : 'branch!adddevices.action',
				data : '{"branch":{"branchid":' + RightBranchid + '}, "deviceids":' + $.toJSON(LeftDevices) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					if (data.errorcode == 0) {
						LeftDevices = [];
						RightDevices = [];
						$('#LeftTable').dataTable()._fnAjaxUpdate();
						$('#RightTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		});

		$('body').on('click', '.pix-right2left', function(event) {
			$.ajax({
				type : 'POST',
				url : 'branch!adddevices.action',
				data : '{"branch":{"branchid":' + LeftBranchid + '}, "deviceids":' + $.toJSON(RightDevices) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					if (data.errorcode == 0) {
						LeftDevices = [];
						RightDevices = [];
						$('#LeftTable').dataTable()._fnAjaxUpdate();
						$('#RightTable').dataTable()._fnAjaxUpdate();
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

