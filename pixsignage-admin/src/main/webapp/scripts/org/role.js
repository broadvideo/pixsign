var RoleModule = function () {
	var _role = {};

	var init = function () {
		initRoleTable();
		initRoleEvent();
		initRoleEditModal();
	};

	var refresh = function () {
		$('#RoleTable').dataTable()._fnAjaxUpdate();
	};
	
	var initRoleTable = function () {
		$('#RoleTable').dataTable({
			'sDom' : 'rt',
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'role!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'roleid', 'bSortable' : false }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> 编辑 </a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> 删除</a>';
				buttonhtml += '</div>';
				$('td:eq(2)', nRow).html(buttonhtml);
				return nRow;
			}
		});
		$('#RoleTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#RoleTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#RoleTable_wrapper .dataTables_length select').select2();
		$('#RoleTable').css('width', '100%');
	};
	
	var initRoleEvent = function () {
		$('#RoleTable').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_role = $('#RoleTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _role.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'role!delete.action',
						cache: false,
						data : {
							'role.roleid': _role.roleid
						},
						success : function(data, status) {
							if (data.errorcode == 0) {
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
				}
			 });
		});
	};

	var initRoleEditModal = function () {
		var TreeData = [];
		var _privileges = {};
		
		$.ajax({
			type : 'POST',
			url : 'role!privilegelist.action',
			data : {},
			success : function(data, status) {
				if (data.errorcode == 0) {
					createTreeData(data.aaData, TreeData);
					createTree(TreeData);
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
					checked: _privileges[treeData[i].id] == undefined? false : true,
				}
				treeData[i].children = [];
				createTreeData(privileges[i].children, treeData[i].children);
			}
		}
		function refreshTreeData(treeData) {
			for (var i=0; i<treeData.length; i++) {
				treeData[i].state = {
					opened: true,
					checked: _privileges[treeData[i].id] == undefined? false : true,
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

		var formHandler = new FormHandler($('#RoleEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['role.name'] = {};
		formHandler.validateOption.rules['role.name']['required'] = true;
		formHandler.validateOption.rules['role.name']['minlength'] = 2;
		formHandler.validateOption.submitHandler = function(form) {
			var postData = {};
			postData.roleid = $('#RoleEditForm input[name="role.roleid"]').val();
			postData.name = $('#RoleEditForm input[name="role.name"]').val();
			postData.privileges = [];
			var privileges = $("#PrivilegeTree").jstree('get_checked', false);
			for (var i=0; i<privileges.length; i++) {
				var privilege = {};
				privilege.privilegeid = privileges[i];
				postData.privileges.push(privilege);
			}

			$.ajax({
				type : 'POST',
				url : $('#RoleEditForm').attr('action'),
				data : '{"role":' + $.toJSON(postData) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#RoleEditModal').modal('hide');
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
		$('#RoleEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#RoleEditModal')).on('click', function(event) {
			if ($('#RoleEditForm').valid()) {
				$('#RoleEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#RoleEditForm').attr('action', 'role!add.action');
			_privileges = {};
			refreshTreeData(TreeData);
			createTree(TreeData);
			$('#RoleEditModal').modal();
		});

		$('#RoleTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_role = $('#RoleTable').dataTable().fnGetData(index);
			formHandler.setdata('role', _role);
			$('#RoleEditForm').attr('action', 'role!update.action');
			_privileges = {};
			for (var i=0; i<_role.privileges.length; i++) {
				_privileges[_role.privileges[i].privilegeid] = _role.privileges[i];
			}
			refreshTreeData(TreeData);
			createTree(TreeData);
			$('#RoleEditModal').modal();
		});
	};

	return {
		init: init,
		refresh: refresh,
	}
	
}();
