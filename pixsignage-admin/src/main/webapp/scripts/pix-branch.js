var currentTreeData = [];
var tbodyhtml = '';
var myurls = {
	'common.list' : 'branch!list.action',
	'common.add' : 'branch!add.action',
	'common.update' : 'branch!update.action',
	'common.delete' : 'branch!delete.action',
	'branch.validate' : 'branch!validate.action',
	'branch.adddevices' : 'branch!adddevices.action',
	'device.list' : 'device!list.action',
};
var mytable_columns = [
	{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
	{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false }, 
	{'sTitle' : '', 'mData' : 'branchid', 'bSortable' : false }, 
	{'sTitle' : '', 'mData' : 'branchid', 'bSortable' : false }, 
	{'sTitle' : '', 'mData' : 'branchid', 'bSortable' : false }];

function refreshMyTable() {
	$.ajax({
		type : "POST",
		url : myurls['common.list'],
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				tbodyhtml = '';
				currentTreeData = [];
				generateTreeHtml(data.aaData);
				$('#MyTable tbody').html(tbodyhtml);
				$('.tree').treegrid({
					expanderExpandedClass: 'glyphicon glyphicon-minus',
					expanderCollapsedClass: 'glyphicon glyphicon-plus'
				});
			} else {
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
		}
	});
	
	function generateTreeHtml(treedata) {
		for (var i=0; i<treedata.length; i++) {
			currentTreeData.push(treedata[i]);
			if (tbodyhtml == '') {
				tbodyhtml += '<tr class="odd treegrid-' + treedata[i]['branchid'] + '">';
			} else {
				tbodyhtml += '<tr class="odd treegrid-' + treedata[i]['branchid'] + ' treegrid-parent-' + treedata[i]['parentid'] + '">';
			}
			for (var j=0; j<mytable_columns.length-3; j++) {
				tbodyhtml += '<td>' + eval('treedata[i].' + mytable_columns[j]['mData']) + '</td>';
			}

			tbodyhtml += '<td>';
			if (treedata[i].parentid == 0 || treedata[i].parent.parentid == 0) {
				tbodyhtml += '<a href="javascript:;" privilegeid="101010" data-id="' + (currentTreeData.length-1) + '" class="btn default btn-xs blue pix-add"><i class="fa fa-plus"></i> ' + common.view.add + '</a>';
			}
			tbodyhtml += '</td><td>'
			tbodyhtml += '<a href="javascript:;" privilegeid="101010" data-id="' + (currentTreeData.length-1) + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
			tbodyhtml += '</td><td>'
			if (treedata[i].parentid != 0 && treedata[i].children.length == 0) {
				tbodyhtml += '<a href="javascript:;" privilegeid="101010" data-id="' + (currentTreeData.length-1) + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
			}
			tbodyhtml += '</td></tr>'
			
			generateTreeHtml(treedata[i].children);
		}		
	}
}

function initMyTable() {
	var theadhtml = '<tr role="row">';
	for (var i=0; i<mytable_columns.length; i++) {
		theadhtml += '<th class="sorting_disabled" tabindex="0" rowspan="1" colspan="1">' + mytable_columns[i]['sTitle'] + '</th>';
	}
	theadhtml += '</tr>';
	$('#MyTable thead').html(theadhtml);
	
	refreshMyTable();


	var currentItem;
	$('body').on('click', '.pix-delete', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		currentItem = currentTreeData[index];;
		
		bootbox.confirm(common.tips.remove + currentItem.name, function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : myurls['common.delete'],
					cache: false,
					data : {
						'branch.branchid': currentItem['branchid']
					},
					success : function(data, status) {
						if (data.errorcode == 0) {
							refreshMyTable();
						} else {
							bootbox.alert(common.tips.error + data.errormsg);
						}
					},
					error : function() {
						bootbox.alert(common.tips.error);
					}
				});				
			}
		 });
		
	});
}

function initMyEditModal() {
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	FormValidateOption.rules = {};
	FormValidateOption.rules['branch.name'] = {
		required: true,
		minlength: 2,
		remote: {
			url: myurls['branch.validate'],
			type: 'post',
			data: {
				'branch.branchid': function() {
					return $('#MyEditForm input[name="branch.branchid"]').val();
				},
				'branch.name': function() {
					return $('#MyEditForm input[name="branch.name"]').val();
				}
			},
			dataFilter: function(responseString) {
				var response = $.parseJSON(responseString);
				if (response.errorcode == 0) {
					return true;
				}
				return false;
			}
		}
	};
	FormValidateOption.messages = {
		'branch.name': {
			remote: common.tips.name_repeat
		},
	};
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
				bootbox.alert(common.tips.error);
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
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var action = myurls['common.add'];
		refreshForm('MyEditForm');
		$('#MyEditForm').attr('action', action);
		$('#MyEditForm input[name="branch.parentid"]').attr('value', currentTreeData[index]['branchid']);
		$('#MyEditModal').modal();
	});			

	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var data = currentTreeData[index];
		var action = myurls['common.update'];
		var formdata = new Object();
		for (var name in data) {
			formdata['branch.' + name] = data[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', action);
		$('#MyEditModal').modal();
	});

}

function initDeviceModal() {
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
					alert(data.errorcode + ": " + data.errormsg);
				}
			},
			error : function() {
				alert('failure');
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
		'sAjaxSource' : myurls['device.list'],
		'aoColumns' : [ {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'deviceid', 'bSortable' : false }, 
		                {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
						{'sTitle' : common.view.position, 'mData' : 'position', 'bSortable' : false },
						{'sTitle' : common.view.status, 'mData' : 'onlineflag', 'bSortable' : false }],
		'iDisplayLength' : 20,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
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
		'sAjaxSource' : myurls['device.list'],
		'aoColumns' : [ {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'deviceid', 'bSortable' : false }, 
		                {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
						{'sTitle' : common.view.position, 'mData' : 'position', 'bSortable' : false },
						{'sTitle' : common.view.status, 'mData' : 'onlineflag', 'bSortable' : false }],
		'iDisplayLength' : 20,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
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
			url : myurls['branch.adddevices'],
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
				bootbox.alert(common.tips.error);
			}
		});
	});

	
	$('body').on('click', '.pix-right2left', function(event) {
		$.ajax({
			type : 'POST',
			url : myurls['branch.adddevices'],
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
				bootbox.alert(common.tips.error);
			}
		});
	});
	
}
