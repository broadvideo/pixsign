var BranchModule = function () {
	var _branch = {};
	var TreeData = [];
	var Columns = [
		{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
		{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false }, 
		{'sTitle' : '', 'mData' : 'branchid', 'bSortable' : false }, 
		{'sTitle' : '', 'mData' : 'branchid', 'bSortable' : false }, 
		{'sTitle' : '', 'mData' : 'branchid', 'bSortable' : false }
	];

	var init = function () {
		initBranchTable();
		initBranchEvent();
		initBranchEditModal();
		initDeviceModal();
	};

	var refresh = function () {
		$.ajax({
			type : 'POST',
			url : 'branch!list.action',
			data : {},
			success : function(data, status) {
				if (data.errorcode == 0) {
					tbodyhtml = '';
					TreeData = [];
					generateTreeHtml(data.aaData);
					$('#BranchTable tbody').html(tbodyhtml);
					$('.tree').treegrid({
						expanderExpandedClass: 'glyphicon glyphicon-minus',
						expanderCollapsedClass: 'glyphicon glyphicon-plus'
					});
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
		
		function generateTreeHtml(treedata) {
			for (var i=0; i<treedata.length; i++) {
				TreeData.push(treedata[i]);
				if (tbodyhtml == '') {
					tbodyhtml += '<tr class="odd treegrid-' + treedata[i]['branchid'] + '">';
				} else {
					tbodyhtml += '<tr class="odd treegrid-' + treedata[i]['branchid'] + ' treegrid-parent-' + treedata[i]['parentid'] + '">';
				}
				for (var j=0; j<Columns.length-3; j++) {
					tbodyhtml += '<td>' + eval('treedata[i].' + Columns[j]['mData']) + '</td>';
				}

				tbodyhtml += '<td>';
				if (treedata[i].parentid == 0 || treedata[i].parent.parentid == 0 || treedata[i].parent.parent.parentid == 0) {
					tbodyhtml += '<a href="javascript:;" privilegeid="101010" data-id="' + (TreeData.length-1) + '" class="btn default btn-xs blue pix-add"><i class="fa fa-plus"></i> ' + common.view.add + '</a>';
				}
				tbodyhtml += '</td><td>'
				tbodyhtml += '<a href="javascript:;" privilegeid="101010" data-id="' + (TreeData.length-1) + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				tbodyhtml += '</td><td>'
				if (treedata[i].parentid != 0 && treedata[i].children.length == 0) {
					tbodyhtml += '<a href="javascript:;" privilegeid="101010" data-id="' + (TreeData.length-1) + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				}
				tbodyhtml += '</td></tr>'
				
				generateTreeHtml(treedata[i].children);
			}		
		}
	};
	
	var initBranchTable = function () {
		var theadhtml = '<tr role="row">';
		for (var i=0; i<Columns.length; i++) {
			theadhtml += '<th class="sorting_disabled" tabindex="0" rowspan="1" colspan="1">' + Columns[i]['sTitle'] + '</th>';
		}
		theadhtml += '</tr>';
		$('#BranchTable thead').html(theadhtml);
		refresh();
	};

	var initBranchEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_branch = TreeData[index];
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
		
		$('#BranchTable').on('click', '.pix-add', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			formHandler.reset();
			$('#BranchEditForm').attr('action', 'branch!add.action');
			$('#BranchEditForm input[name="branch.parentid"]').attr('value', TreeData[index]['branchid']);
			$('#BranchEditModal').modal();
		});

		$('#BranchTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_branch = TreeData[index];
			formHandler.setdata('branch', _branch);
			$('#BranchEditForm').attr('action', 'branch!update.action');
			$('#BranchEditModal').modal();
		});
	};

	var initDeviceModal = function () {
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
			$.ajax({
				type : 'POST',
				url : 'branch!list.action',
				data : {},
				success : function(data, status) {
					if (data.errorcode == 0) {
						var branches = data.aaData;
						LeftBranchid = branches[0].branchid;
						RightBranchid = branches[0].branchid;
						var branchTreeDivData = [];
						createBranchTreeData(branches, branchTreeDivData);
						
						$('#LeftTreeDiv').jstree('destroy');
						$('#LeftTreeDiv').jstree({
							'core' : {
								'multiple' : false,
								'data' : branchTreeDivData
							},
							'plugins' : ['unique'],
						});
						$('#LeftTreeDiv').on('loaded.jstree', function() {
							$('#LeftTreeDiv').jstree('select_node', LeftBranchid);
						});
						$('#LeftTreeDiv').on('select_node.jstree', function(event, data) {
							LeftBranchid = data.instance.get_node(data.selected[0]).id;
							LeftDevices = [];
							$('#LeftTable').dataTable()._fnAjaxUpdate();
						});
						
						$('#RightTreeDiv').jstree('destroy');
						$('#RightTreeDiv').jstree({
							'core' : {
								'multiple' : false,
								'data' : branchTreeDivData
							},
							'plugins' : ['unique'],
						});
						$('#RightTreeDiv').on('loaded.jstree', function() {
							$('#RightTreeDiv').jstree('select_node', RightBranchid);
						});
						$('#RightTreeDiv').on('select_node.jstree', function(event, data) {
							RightBranchid = data.instance.get_node(data.selected[0]).id;
							RightDevices = [];
							$('#RightTable').dataTable()._fnAjaxUpdate();
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

