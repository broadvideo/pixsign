var myurls = {
	'common.list' : 'role!list.action',
	'common.add' : 'role!add.action',
	'common.update' : 'role!update.action',
	'common.delete' : 'role!delete.action',
	'privilege.list' : 'role!privilegelist.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

function initMyTable() {
	var oTable = $('#MyTable').dataTable({
		'sDom' : 'rt',
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false }, 
						{'sTitle' : common.view.operation, 'mData' : 'roleid', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var dropdownBtn = '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
			dropdownBtn += '&nbsp;&nbsp;<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
			$('td:eq(2)', nRow).html(dropdownBtn);
			return nRow;
		}
	});

	var currentItem;
	$('body').on('click', '.pix-delete', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		currentItem = item;
		
		bootbox.confirm(common.tips.remove + currentItem.name, function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : myurls['common.delete'],
					cache: false,
					data : {
						'role.roleid': currentItem['roleid']
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
}

function initMyEditModal() {
	var currentTreeData = [];
	var currentPrivileges = {};
	
	$.ajax({
		type : 'POST',
		url : myurls['privilege.list'],
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				createTreeData(data.aaData, currentTreeData);
				createTree(currentTreeData);
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
	
	function createTreeData(privileges, treeData) {
		for (var i=0; i<privileges.length; i++) {
			treeData[i] = {};
			treeData[i].id = privileges[i].privilegeid;
			treeData[i].text = privileges[i].name;
			treeData[i].state = {
				opened: true,
				checked: currentPrivileges[treeData[i].id] == undefined? false : true,
			}
			treeData[i].children = [];
			createTreeData(privileges[i].children, treeData[i].children);
		}
	}

	function refreshTreeData(treeData) {
		for (var i=0; i<treeData.length; i++) {
			treeData[i].state = {
				opened: true,
				checked: currentPrivileges[treeData[i].id] == undefined? false : true,
			}
			refreshTreeData(treeData[i].children);
		}
	}

	function createTree(treeData) {
		$('#PrivilegeTree').jstree('destroy');
		var treeview = $('#PrivilegeTree').jstree({
			'core' : {
				'data' : treeData
			},
			'checkbox' : {
				'checked_parent_open' : true,
				'three_state' : false,
				'tie_selection' : false,
			},
			'plugins' : ['checkbox'],
		});
		treeview.on('check_node.jstree', function(e, data) {
			treeview.jstree('check_node', data.node.parent);
		});
		treeview.on('uncheck_node.jstree', function(e, data) {
			for (var i=0; i < data.node.children.length; i++) {
				treeview.jstree('uncheck_node', data.node.children[i]);
			}
		});

	}
	
	
	
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	FormValidateOption.rules['role.name'] = {};
	FormValidateOption.rules['role.name']['required'] = true;
	FormValidateOption.rules['role.name']['minlength'] = 2;
	FormValidateOption.submitHandler = function(form) {
		var postData = {};
		postData.roleid = $('#MyEditForm input[name="role.roleid"]').val();
		postData.name = $('#MyEditForm input[name="role.name"]').val();
		postData.privileges = [];
		var privileges = $("#PrivilegeTree").jstree('get_checked', false);
		for (var i=0; i<privileges.length; i++) {
			var privilege = {};
			privilege.privilegeid = privileges[i];
			postData.privileges.push(privilege);
		}

		$.ajax({
			type : 'POST',
			url : $('#MyEditForm').attr('action'),
			data : '{"role":' + $.toJSON(postData) + '}',
			dataType : 'json',
			contentType : 'application/json;charset=utf-8',
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
	
	$('body').on('click', '.pix-add', function(event) {
		refreshForm('MyEditForm');
		$('#MyEditForm').attr('action', myurls['common.add']);
		currentPrivileges = {};
		refreshTreeData(currentTreeData);
		createTree(currentTreeData);
		$('#MyEditModal').modal();
	});			

	
	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in item) {
			formdata['role.' + name] = item[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', myurls['common.update']);
		currentPrivileges = {};
		for (var i=0; i<item.privileges.length; i++) {
			currentPrivileges[item.privileges[i].privilegeid] = item.privileges[i];
		}
		refreshTreeData(currentTreeData);
		createTree(currentTreeData);
		$('#MyEditModal').modal();
	});

}
