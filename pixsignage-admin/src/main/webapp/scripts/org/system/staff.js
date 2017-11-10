var StaffModule = function () {
	var _staff = {};
	this.StaffTree = new BranchTree($('#StaffPortlet'));

	var init = function () {
		initStaffTable();
		initStaffEvent();
		initStaffEditModal();
	};

	var refresh = function () {
		$('#StaffTable').dataTable()._fnAjaxUpdate();
	};
	
	var initStaffTable = function () {
		$('#StaffTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'staff!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '20%' }, 
							{'sTitle' : common.view.loginname, 'mData' : 'loginname', 'bSortable' : false, 'sWidth' : '15%' }, 
							{'sTitle' : common.view.branch, 'mData' : 'branch.name', 'bSortable' : false, 'sWidth' : '15%' }, 
							{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false, 'sWidth' : '20%' }, 
							{'sTitle' : common.view.operation, 'mData' : 'staffid', 'bSortable' : false, 'sWidth' : '30%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				if (aData.loginname != 'admin' && aData.loginname != 'admin@' + aData.org.code) {
					buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + ' </a>';
					buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs yellow pix-password"><i class="fa fa-lock"></i> ' + common.view.password_reset + '</a>';
					buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				} else {
					buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-password"><i class="fa fa-lock"></i> ' + common.view.password_reset + '</a>';
				}
				buttonhtml += '</div>';
				$('td:eq(4)', nRow).html(buttonhtml);
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':StaffTree.branchid });
			}
		});
		$('#StaffTable_wrapper').addClass('form-inline');
		$('#StaffTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#StaffTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#StaffTable_wrapper .dataTables_length select').select2();
		$('#StaffTable').css('width', '100%');
	};

	var initStaffEvent = function () {
		$('#StaffTable').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_staff = $('#StaffTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _staff.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'staff!delete.action',
						cache: false,
						data : {
							'staff.staffid': _staff.staffid
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

		$('#StaffTable').on('click', '.pix-password', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_staff = $('#StaffTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.resetpassword + _staff.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'staff!resetpassword.action',
						cache: false,
						data : {
							'staff.staffid': _staff.staffid
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
	
	var initStaffEditModal = function () {
		var RoleTreeData = [];
		var BranchTreeData = [];
		var _roles = {};
		var Oper = 1;
		
		$.ajax({
			type : 'post',
			url : 'role!list.action',
			data : {},
			success : function(data, status) {
				if (data.errorcode == 0) {
					createRoleTreeData(data.aaData, RoleTreeData);
					createRoleTree(RoleTreeData);
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
		function createRoleTreeData(roles, treeData) {
			for (var i=0; i<roles.length; i++) {
				treeData[i] = {};
				treeData[i].id = roles[i].roleid;
				treeData[i].text = roles[i].name;
				treeData[i].state = {
					opened: true,
					checked: _roles[treeData[i].id] == undefined? false : true,
				}
				treeData[i].children = [];
			}
		}
		function refreshRoleTreeData(treeData) {
			for (var i=0; i<treeData.length; i++) {
				treeData[i].state = {
					opened: true,
					checked: _roles[treeData[i].id] == undefined? false : true,
				}
			}
		}
		function createRoleTree(treeData) {
			$('#StaffEditForm #RoleTree').jstree('destroy');
			var treeview = $('#StaffEditForm #RoleTree').jstree({
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
		}

		var BranchTeee = $('#StaffEditForm #BranchTree');
		BranchTeee.jstree('destroy');
		BranchTeee.jstree({
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
		
		var formHandler = new FormHandler($('#StaffEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['staff.loginname'] = {
			required: true,
			minlength: 4,
			remote: {
				url: 'staff!validate.action',
				type: 'post',
				data: {
					'staff.staffid': function() {
						return $('#StaffEditForm input[name="staff.staffid"]').val();
					},
					'staff.loginname': function() {
						return $('#StaffEditForm input[name="staff.loginname"]').val();
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
		formHandler.validateOption.messages = {
			'staff.loginname': {
				remote: common.tips.loginname_repeat
			}
		};
		formHandler.validateOption.rules['staff.name'] = {};
		formHandler.validateOption.rules['staff.name']['required'] = true;
		formHandler.validateOption.rules['staff.name']['minlength'] = 2;
		formHandler.validateOption.submitHandler = function(form) {
			var postData = {};
			if (Oper == 1) {
				postData.staffid = $('#StaffEditForm input[name="staff.staffid"]').val();
				postData.loginname = $('#StaffEditForm input[name="staff.loginname"]').val();
				postData.password = $('#StaffEditForm input[name="staff.password"]').val();
				postData.name = $('#StaffEditForm input[name="staff.name"]').val();
				postData.status = 1;
				if ($("#StaffEditForm #BranchTree").jstree('get_selected', false).length > 0) {
					postData.branchid = BranchTeee.jstree('get_selected', false)[0];
				}
				postData.roles = [];
				var roles = $('#StaffEditForm #RoleTree').jstree('get_checked', false);
				for (var i=0; i<roles.length; i++) {
					var role = {};
					role.roleid = roles[i];
					postData.roles.push(role);
				}
			} else if (Oper == 2) {
				postData.staffid = $('#StaffEditForm input[name="staff.staffid"]').val();
				postData.loginname = $('#StaffEditForm input[name="staff.loginname"]').val();
				postData.name = $('#StaffEditForm input[name="staff.name"]').val();
				postData.status = 1;
				if ($("#StaffEditForm #BranchTree").jstree('get_selected', false).length > 0) {
					postData.branchid = BranchTeee.jstree('get_selected', false)[0];
				}
				postData.roles = [];
				var roles = $('#StaffEditForm #RoleTree').jstree('get_checked', false);
				for (var i=0; i<roles.length; i++) {
					var role = {};
					role.roleid = roles[i];
					postData.roles.push(role);
				}
			}

			$.ajax({
				type : 'POST',
				url : $('#StaffEditForm').attr('action'),
				data : '{"staff":' + $.toJSON(postData) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#StaffEditModal').modal('hide');
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
		$('#StaffEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#StaffEditModal')).on('click', function(event) {
			if ($('#StaffEditForm').valid()) {
				$('#StaffEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#StaffEditForm').attr('action', 'staff!add.action');
			$('#StaffEditForm .password').css('display', '');
			$('#StaffEditForm input[name="staff.password"]').attr('value', '');
			$('#StaffEditForm input[name="staff.password2"]').attr('value', '');
			$('#StaffEditForm input[name="staff.loginname"]').removeAttr('readonly');
			formHandler.validateOption.rules['staff.password'] = {};
			formHandler.validateOption.rules['staff.password']['required'] = true;
			formHandler.validateOption.rules['staff.password']['minlength'] = 5;
			formHandler.validateOption.rules['staff.password2'] = {};
			formHandler.validateOption.rules['staff.password2']['equalTo'] = '#StaffPassword';
			$.extend($('#StaffEditForm').validate().settings, {
				rules: formHandler.validateOption.rules,
			});
			Oper = 1;
			BranchTeee.jstree('deselect_all', true);
			BranchTeee.jstree('select_node', 'ul > li:first');
			_roles = {};
			refreshRoleTreeData(RoleTreeData);
			createRoleTree(RoleTreeData);
			$('#StaffEditModal').modal();
		});

		$('#StaffTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_staff = $('#StaffTable').dataTable().fnGetData(index);
			formHandler.setdata('staff', _staff);
			$('#StaffEditForm').attr('action', 'staff!update.action');
			$('#StaffEditForm .password').css('display', 'none');
			$('#StaffEditForm input[name="staff.loginname"]').attr('readonly','readonly');
			formHandler.validateOption.rules['staff.password'] = {};
 			$.extend($('#StaffEditForm').validate().settings, {
				rules: formHandler.validateOption.rules,
			});
			Oper = 2;
			BranchTeee.jstree('deselect_all', true);
			BranchTeee.jstree('select_node', _staff.branchid);
			_roles = {};
			for (var i=0; i<_staff.roles.length; i++) {
				_roles[_staff.roles[i].roleid] = _staff.roles[i];
			}
			refreshRoleTreeData(RoleTreeData);
			createRoleTree(RoleTreeData);
			$('#StaffEditModal').modal();
		});
		
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();

