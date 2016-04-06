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
	{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
	{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false }, 
	{'sTitle' : '', 'mData' : 'branchid', 'bSortable' : false }, 
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
			for (var j=0; j<mytable_columns.length-4; j++) {
				tbodyhtml += '<td>' + eval('treedata[i].' + mytable_columns[j]['mData']) + '</td>';
			}

			tbodyhtml += '<td>';
			tbodyhtml += '<a href="javascript:;" privilegeid="101010" data-id="' + (currentTreeData.length-1) + '" class="btn default btn-xs green pix-device"><i class="fa fa-list-ul"></i> ' + common.view.device + '</a>';
			tbodyhtml += '</td><td>'
			tbodyhtml += '<a href="javascript:;" privilegeid="101010" data-id="' + (currentTreeData.length-1) + '" class="btn default btn-xs blue pix-add"><i class="fa fa-plus"></i> ' + common.view.add + '</a>';
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
