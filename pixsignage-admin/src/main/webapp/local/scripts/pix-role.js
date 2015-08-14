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
						[ 10, 25, 50, 100 ] // change per page values here
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [ {"sTitle" : "角色名称", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "创建者", "mData" : "createstaff.name", "bSortable" : false }, 
						{"sTitle" : "创建时间", "mData" : "createtime", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "roleid", "bSortable" : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var dropdownBtn = '<div class="btn-group">';
			dropdownBtn += '<a class="btn default btn-sm blue" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">操作  <i class="fa fa-angle-down"></i></a>';
			dropdownBtn += '<ul class="dropdown-menu pull-right">';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-update"><i class="fa fa-edit"></i> 编辑</a></li>';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-delete"><i class="fa fa-trash-o"></i> 删除</a></li>';
			dropdownBtn += '</ul></div>';
			$('td:eq(3)', nRow).html(dropdownBtn);
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
		var action = myurls['common.delete'];
		currentItem = item;
		
		bootbox.confirm('请确认是否删除"' + currentItem.name + '"', function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : action,
					cache: false,
					data : {
						'ids': currentItem['roleid']
					},
					success : function(data, status) {
						if (data.errorcode == 0) {
							refreshMyTable();
						} else {
							bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
						}
					},
					error : function() {
						bootbox.alert('出错了！');
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
					bootbox.alert('操作成功');
					refreshMyTable();
				} else {
					bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert('出错了!');
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
		var data = $('#MyTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in data) {
			formdata['role.' + name] = data[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', myurls['common.update']);
		currentPrivileges = {};
		for (var i=0; i<data.privileges.length; i++) {
			currentPrivileges[data.privileges[i].privilegeid] = data.privileges[i];
		}
		refreshTreeData(currentTreeData);
		createTree(currentTreeData);
		$('#MyEditModal').modal();
	});

}
