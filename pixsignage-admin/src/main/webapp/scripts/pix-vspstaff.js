var myurls = {
	'common.list' : 'staff!list.action',
	'common.add' : 'staff!add.action',
	'common.update' : 'staff!update.action',
	'common.delete' : 'staff!delete.action',
	'staff.resetpassword' : 'staff!resetpassword.action',
	'role.list' : 'role!list.action',
	'staff.validate' : 'staff!validate.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

function initMyTable() {
	var oTable = $('#MyTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '25%' }, 
						{'sTitle' : common.view.loginname, 'mData' : 'loginname', 'bSortable' : false, 'sWidth' : '25%' }, 
						{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false, 'sWidth' : '20%' }, 
						{'sTitle' : common.view.operation, 'mData' : 'staffid', 'bSortable' : false, 'sWidth' : '30%' }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var data = $('#MyTable').dataTable().fnGetData(iDisplayIndex);
			var dropdownBtn = '';
			if (data.loginname != 'admin') {
				dropdownBtn += '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				dropdownBtn += '&nbsp;&nbsp;<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-password"><i class="fa fa-lock"></i> ' + common.view.password_reset + '</a>';
				dropdownBtn += '&nbsp;&nbsp;<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
			} else {
				dropdownBtn += '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-password"><i class="fa fa-lock"></i> ' + common.view.password_reset + '</a>';
			}
			$('td:eq(3)', nRow).html(dropdownBtn);
			return nRow;
		}
	});

	jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	jQuery('#MyTable_wrapper .dataTables_length select').select2();
	
	var currentItem;
	$('body').on('click', '.pix-delete', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		currentItem = $('#MyTable').dataTable().fnGetData(index);
		
		bootbox.confirm(common.tips.remove + currentItem.name, function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : myurls['common.delete'],
					cache: false,
					data : {
						'staff.staffid': currentItem['staffid']
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
	var oper = 1;
	
	var currentRoleTreeData = [];
	var currentRoles = {};
	
	$.ajax({
		type : 'POST',
		url : myurls['role.list'],
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				createRoleTreeData(data.aaData, currentRoleTreeData);
				createRoleTree(currentRoleTreeData);
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
			treeData[i]['data'] = {};
			treeData[i]['data']['title'] = roles[i].name;
			treeData[i]['attr'] = {};
			treeData[i]['attr']['id'] = roles[i].roleid;
			treeData[i]['attr']['parentid'] = 0;
			if (currentRoles[treeData[i]['attr']['id']] == undefined) {
				treeData[i]['attr']['class'] = 'jstree-unchecked';
			} else {
				treeData[i]['attr']['class'] = 'jstree-checked';
			}
			treeData[i]['children'] = [];
		}
	}
	function refreshRoleTreeData(treeData) {
		for (var i=0; i<treeData.length; i++) {
			if (currentRoles[treeData[i]['attr']['id']] == undefined) {
				treeData[i]['attr']['class'] = 'jstree-unchecked';
			} else {
				treeData[i]['attr']['class'] = 'jstree-checked';
			}
			refreshRoleTreeData(treeData[i]['children']);
		}
	}
	function createRoleTree(treeData) {
		$('#RoleTree').jstree('destroy');
		var treeview = $('#RoleTree').jstree({
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
	

	function initEditForm() {
		if (oper == 1) {
			$('#MyEditForm .option1').css('display', 'block');
			$('#MyEditForm input[name="staff.loginname"]').removeAttr('readonly');
			$('#MyEditForm .option2').css('display', 'block');
			FormValidateOption.rules = {};
			FormValidateOption.rules['staff.loginname'] = {
				required: true,
				minlength: 4,
				remote: {
					url: myurls['staff.validate'],
					type: 'post',
					data: {
						'staff.staffid': function() {
							return $('#MyEditForm input[name="staff.staffid"]').val();
						},
						'staff.loginname': function() {
							return $('#MyEditForm input[name="staff.loginname"]').val();
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
				'staff.loginname': {
					remote: common.tips.loginname_repeat
				}
			};
			FormValidateOption.rules['staff.password'] = {};
			FormValidateOption.rules['staff.password']['required'] = true;
			FormValidateOption.rules['staff.password']['minlength'] = 5;
			FormValidateOption.rules['staff.password2'] = {};
			FormValidateOption.rules['staff.password2']['equalTo'] = '#StaffPassword';
			FormValidateOption.rules['staff.name'] = {};
			FormValidateOption.rules['staff.name']['required'] = true;
			FormValidateOption.rules['staff.name']['minlength'] = 2;
			$('#MyEditForm').validate(FormValidateOption);
			$.extend($("#MyEditForm").validate().settings, {
				rules: FormValidateOption.rules,
				messages: FormValidateOption.messages
			});
		} else if (oper == 2) {
			$('#MyEditForm .option1').css('display', 'block');
			$('#MyEditForm input[name="staff.loginname"]').attr('readonly','readonly');
			$('#MyEditForm .option2').css('display', 'none');
			FormValidateOption.rules = {};
			FormValidateOption.rules['staff.loginname'] = {
					required: true,
					minlength: 4,
					remote: {
						url: myurls['staff.validate'],
						type: 'post',
						data: {
							'staff.staffid': function() {
								return $('#MyEditForm input[name="staff.staffid"]').val();
							},
							'staff.loginname': function() {
								return $('#MyEditForm input[name="staff.loginname"]').val();
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
					'staff.loginname': {
						remote: common.tips.loginname_repeat
					}
				};
			FormValidateOption.rules['staff.name'] = {};
			FormValidateOption.rules['staff.name']['required'] = true;
			FormValidateOption.rules['staff.name']['minlength'] = 2;
			$('#MyEditForm').validate(FormValidateOption);
			$.extend($("#MyEditForm").validate().settings, {
				rules: FormValidateOption.rules,
				messages: FormValidateOption.messages
			});
		} else if (oper == 3) {
			$('#MyEditForm .option1').css('display', 'none');
			$('#MyEditForm .option2').css('display', 'block');
			FormValidateOption.rules = {};
			FormValidateOption.rules['staff.password'] = {};
			FormValidateOption.rules['staff.password']['required'] = true;
			FormValidateOption.rules['staff.password']['minlength'] = 5;
			FormValidateOption.rules['staff.password2'] = {};
			FormValidateOption.rules['staff.password2']['equalTo'] = '#StaffPassword';
			$('#MyEditForm').validate(FormValidateOption);
			$.extend($("#MyEditForm").validate().settings, {
				rules: FormValidateOption.rules
			});
		}
	}
	
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	FormValidateOption.submitHandler = function(form) {
		var postData = {};
		if (oper == 1) {
			postData.staffid = $('#MyEditForm input[name="staff.staffid"]').val();
			postData.loginname = $('#MyEditForm input[name="staff.loginname"]').val();
			postData.password = $('#MyEditForm input[name="staff.password"]').val();
			postData.name = $('#MyEditForm input[name="staff.name"]').val();
			postData.status = 1;
			postData.roles = [];
			$("#RoleTree").jstree('get_checked', null, true).each(function() {
				var role = {};
				role.roleid = this.id;
				postData.roles.push(role);
			});
		} else if (oper == 2) {
			postData.staffid = $('#MyEditForm input[name="staff.staffid"]').val();
			postData.loginname = $('#MyEditForm input[name="staff.loginname"]').val();
			postData.name = $('#MyEditForm input[name="staff.name"]').val();
			postData.status = 1;
			postData.roles = [];
			$("#RoleTree").jstree('get_checked', null, true).each(function() {
				var role = {};
				role.roleid = this.id;
				postData.roles.push(role);
			});
		} else if (oper == 3) {
			postData.staffid = $('#MyEditForm input[name="staff.staffid"]').val();
			postData.password = $('#MyEditForm input[name="staff.password"]').val();
		}

		$.ajax({
			type : 'POST',
			url : $('#MyEditForm').attr('action'),
			data : '{"staff":' + $.toJSON(postData) + '}',
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
		currentRoles = {};
		refreshRoleTreeData(currentRoleTreeData);
		createRoleTree(currentRoleTreeData);
		
		$('#MyEditForm input[name="staff.password"]').attr('value', '');
		$('#MyEditForm input[name="staff.password2"]').attr('value', '');
		oper = 1;
		initEditForm();
		
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
			formdata['staff.' + name] = item[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', myurls['common.update']);
		currentRoles = {};
		for (var i=0; i<item.roles.length; i++) {
			currentRoles[item.roles[i].roleid] = item.roles[i];
		}
		refreshRoleTreeData(currentRoleTreeData);
		createRoleTree(currentRoleTreeData);
		
		oper = 2;
		initEditForm();
		
		$('#MyEditModal').modal();
	});

	$('body').on('click', '.pix-password', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in item) {
			formdata['staff.' + name] = item[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', myurls['staff.resetpassword']);
		$('#MyEditForm input[name="staff.password"]').attr('value', '');
		$('#MyEditForm input[name="staff.password2"]').attr('value', '');
		
		oper = 3;
		initEditForm();
		
		$('#MyEditModal').modal();
	});			
}
