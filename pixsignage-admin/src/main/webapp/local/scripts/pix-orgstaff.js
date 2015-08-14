var myurls = {
	'common.list' : 'staff!list.action',
	'common.add' : 'staff!add.action',
	'common.update' : 'staff!update.action',
	'common.delete' : 'staff!delete.action',
	'staff.resetpassword' : 'staff!resetpassword.action',
	'role.list' : 'role!list.action',
	'branch.list' : 'branch!list.action',
	'staff.validate' : 'staff!validate.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

function initMyTable() {
	var oTable = $('#MyTable').dataTable({
		'sDom' : "<'row'<'col-md-6 col-sm-12'l><'col-md-12 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", //default layout without horizontal scroll(remove this setting to enable horizontal scroll for the table)
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [ {"sTitle" : "操作员姓名", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "登录名", "mData" : "loginname", "bSortable" : false }, 
						{"sTitle" : "部门", "mData" : "branch.name", "bSortable" : false }, 
						{"sTitle" : "创建时间", "mData" : "createtime", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "staffid", "bSortable" : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var data = $('#MyTable').dataTable().fnGetData(iDisplayIndex);
			var dropdownBtn = '<div class="btn-group">';
			dropdownBtn += '<a class="btn default btn-sm blue" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">操作  <i class="fa fa-angle-down"></i></a>';
			dropdownBtn += '<ul class="dropdown-menu pull-right">';
			if (data.loginname != 'admin') {
				dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-update"><i class="fa fa-edit"></i> 编辑</a></li>';
			}
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-password"><i class="fa fa-lock"></i> 重置密码</a></li>';
			if (data.loginname != 'admin') {
				dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-delete"><i class="fa fa-trash-o"></i> 删除</a></li>';
			}
			dropdownBtn += '</ul></div>';
			$('td:eq(4)', nRow).html(dropdownBtn);
			return nRow;
		}
	});
    jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small'); // modify table search input
    jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small'); // modify table per page dropdown
    jQuery('#MyTable_wrapper .dataTables_length select').select2(); // initialize select2 dropdown

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
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
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
	
	var currentEditBranchTreeData = [];
	var currentEditBranchid = 0;
	$.ajax({
		type : 'POST',
		url : myurls['branch.list'],
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				createBranchTreeData(data.aaData, currentEditBranchTreeData);
				createEditBranchTree(currentEditBranchTreeData);
			} else {
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
		}
	});
	function createBranchTreeData(branches, treeData) {
		for (var i=0; i<branches.length; i++) {
			treeData[i] = {};
			treeData[i]['data'] = {};
			treeData[i]['data']['title'] = branches[i].name;
			treeData[i]['attr'] = {};
			treeData[i]['attr']['id'] = branches[i].branchid;
			treeData[i]['attr']['parentid'] = branches[i].parentid;
			if (treeData[i]['attr']['id'] == currentEditBranchid) {
				treeData[i]['attr']['class'] = 'jstree-selected';
			} else {
				treeData[i]['attr']['class'] = 'jstree-unselected';
			}
			treeData[i]['children'] = [];
			createBranchTreeData(branches[i].children, treeData[i]['children']);
		}
	}
	function refreshEditBranchTreeData(treeData) {
		for (var i=0; i<treeData.length; i++) {
			if (treeData[i]['attr']['id'] == currentEditBranchid) {
				treeData[i]['attr']['class'] = 'jstree-selected';
			} else {
				treeData[i]['attr']['class'] = 'jstree-unselected';
			}
			refreshEditBranchTreeData(treeData[i]['children']);
		}
	}
	function createEditBranchTree(treeData) {
		$('#EditFormBranchTree').jstree('destroy');
	    $('#EditFormBranchTree').jstree({
	        'json_data' : {
	            'data' : treeData
	        },
			'plugins' : [ 'themes', 'json_data', 'ui' ],
			'core' : {
				'animation' : 100
			},
			'ui' : {
				'select_limit' : 1,
				'initially_select' : currentEditBranchid,
			},
			'themes' : {
				'theme' : 'proton',
				'icons' : false,
			}
		});
	    $('#EditFormBranchTree').on('loaded.jstree', function() {
	    	$('#EditFormBranchTree').jstree('open_all');
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
					remote: "登录名已存在"
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
						remote: "登录名已存在"
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
			$("#EditFormBranchTree").jstree('get_selected', null, true).each(function() {
				postData.branchid = this.id;
			});
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
			$("#EditFormBranchTree").jstree('get_selected', null, true).each(function() {
				postData.branchid = this.id;
			});
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
		currentEditBranchid = currentEditBranchTreeData[0].attr.id;
		refreshEditBranchTreeData(currentEditBranchTreeData);
		createEditBranchTree(currentEditBranchTreeData);
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
		var data = $('#MyTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in data) {
			formdata['staff.' + name] = data[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', myurls['common.update']);
		currentEditBranchid = data.branchid;
		refreshEditBranchTreeData(currentEditBranchTreeData);
		createEditBranchTree(currentEditBranchTreeData);
		currentRoles = {};
		for (var i=0; i<data.roles.length; i++) {
			currentRoles[data.roles[i].roleid] = data.roles[i];
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
		var data = $('#MyTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in data) {
			formdata['staff.' + name] = data[name];
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
