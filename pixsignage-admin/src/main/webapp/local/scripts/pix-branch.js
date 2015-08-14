var currentTreeData = [];
var tbodyhtml = '';
var myurls = {
	'common.list' : 'branch!list.action',
	'common.add' : 'branch!add.action',
	'common.update' : 'branch!update.action',
	'common.delete' : 'branch!delete.action',
	'branch.validate' : 'branch!validate.action',
};
var mytable_columns = [
						{"sTitle" : "名称", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "编码", "mData" : "code", "bSortable" : false }, 
						{"sTitle" : "企业归属", "mData" : "org.name", "bSortable" : false }, 
						{"sTitle" : "创建时间", "mData" : "createtime", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "branchid", "bSortable" : false }];

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
			if (treedata[i]['parentid'] == 0) {
				tbodyhtml += '<tr class="odd treegrid-' + treedata[i]['branchid'] + '">';
			} else {
				tbodyhtml += '<tr class="odd treegrid-' + treedata[i]['branchid'] + ' treegrid-parent-' + treedata[i]['parentid'] + '">';
			}
			for (var j=0; j<mytable_columns.length-1; j++) {
				tbodyhtml += '<td>' + eval('treedata[i].' + mytable_columns[j]['mData']) + '</td>';
			}
			tbodyhtml += '<td><div class="btn-group">';
			tbodyhtml += '<a class="btn default btn-sm blue" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">操作  <i class="fa fa-angle-down"></i></a>';
			tbodyhtml += '<ul class="dropdown-menu pull-right">';
			tbodyhtml += '<li><a href="javascript:;" privilegeid="101010" data-id="' + (currentTreeData.length-1) + '" class="btn-sm pix-add"><i class="fa fa-plus"></i> 新增</a></li>';
			tbodyhtml += '<li><a href="javascript:;" privilegeid="101010" data-id="' + (currentTreeData.length-1) + '" class="btn-sm pix-update"><i class="fa fa-edit"></i> 编辑</a></li>';
			if (treedata[i].parentid != 0 && treedata[i].children.length == 0) {
				tbodyhtml += '<li><a href="javascript:;" privilegeid="101010" data-id="' + (currentTreeData.length-1) + '" class="btn-sm pix-delete"><i class="fa fa-trash-o"></i> 删除</a></li>';
			}
			tbodyhtml += '</ul></div></td>';
			tbodyhtml += '</tr>';
			
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
		var action = myurls['common.delete'];
		
		bootbox.confirm('请确认是否删除"' + currentItem.name + '"', function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : action,
					cache: false,
					data : {
						'ids': currentItem['branchid']
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
	FormValidateOption.rules['branch.code'] = {
			required: true,
			minlength: 2,
			remote: {
				url: myurls['branch.validate'],
				type: 'post',
				data: {
					'branch.branchid': function() {
						return $('#MyEditForm input[name="branch.branchid"]').val();
					},
					'branch.code': function() {
						return $('#MyEditForm input[name="branch.code"]').val();
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
			remote: "名称已存在"
		},
		'branch.code': {
			remote: "编码已存在"
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
