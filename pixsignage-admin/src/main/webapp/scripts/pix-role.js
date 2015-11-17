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
						bootbox.alert(common.tips.error);
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
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
		}
	});
	
	function createTreeData(privileges, treeData) {
		for (var i=0; i<privileges.length; i++) {
			treeData[i] = {};
			treeData[i]['data'] = {};
			treeData[i]['data']['title'] = privileges[i].name;
			treeData[i]['attr'] = {};
			treeData[i]['attr']['id'] = privileges[i].privilegeid;
			treeData[i]['attr']['parentid'] = privileges[i].parentid;
			if (currentPrivileges[treeData[i]['attr']['id']] == undefined) {
				treeData[i]['attr']['class'] = 'jstree-unchecked';
			} else {
				treeData[i]['attr']['class'] = 'jstree-checked';
			}
			treeData[i]['children'] = [];
			createTreeData(privileges[i].children, treeData[i]['children']);
		}
	}

	function refreshTreeData(treeData) {
		for (var i=0; i<treeData.length; i++) {
			if (currentPrivileges[treeData[i]['attr']['id']] == undefined) {
				treeData[i]['attr']['class'] = 'jstree-unchecked';
			} else {
				treeData[i]['attr']['class'] = 'jstree-checked';
			}
			refreshTreeData(treeData[i]['children']);
		}
	}

	function createTree(treeData) {
		$('#PrivilegeTree').jstree('destroy');
		var treeview = $('#PrivilegeTree').jstree({
			'json_data' : {
				'data' : treeData
			},
			'plugins' : [ 'themes', 'json_data', 'checkbox' ],
			'core' : {
				'animation' : 100
			},
			'checkbox' : {
				'checked_parent_open' : true,
				'two_state' : true,
			},
			'themes' : {
				'theme' : 'proton',
				'icons' : false,
			}
		});
		treeview.on('loaded.jstree', function() {
			treeview.jstree('open_all');
		});
		treeview.on('check_node.jstree', function(e, data) {
			var parentNode = data.rslt.obj.attr('parentid');
			treeview.jstree('check_node', '#'+parentNode);
		});
		treeview.on('uncheck_node.jstree', function(e, data) {
			var allChildNodes = data.inst._get_children(data.rslt.obj);
			allChildNodes.each(function(idx, listItem) { 
				treeview.jstree('uncheck_node', '#'+$(listItem).attr("id"));
			});
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
		$("#PrivilegeTree").jstree('get_checked', null, true).each(function() {
			var privilege = {};
			privilege.privilegeid = this.id;
			postData.privileges.push(privilege);
		});

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
