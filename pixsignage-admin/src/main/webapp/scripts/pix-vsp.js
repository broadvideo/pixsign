var myurls = {
	'common.list' : 'vsp!list.action',
	'common.add' : 'vsp!add.action',
	'common.update' : 'vsp!update.action',
	'common.delete' : 'vsp!delete.action',
	'vsp.validate' : 'vsp!validate.action',
	'app.list' : 'app!list.action',
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
						{'sTitle' : common.view.code, 'mData' : 'code', 'bSortable' : false }, 
						{'sTitle' : common.view.maxdevices, 'mData' : 'maxdevices', 'bSortable' : false }, 
						{'sTitle' : common.view.currentdevices, 'mData' : 'currentdevices', 'bSortable' : false }, 
						{'sTitle' : common.view.maxstorage, 'mData' : 'maxstorage', 'bSortable' : false }, 
						{'sTitle' : common.view.currentstorage, 'mData' : 'currentstorage', 'bSortable' : false }, 
						{'sTitle' : '', 'mData' : 'vspid', 'bSortable' : false },
						{'sTitle' : '', 'mData' : 'vspid', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(4)', nRow).html(transferIntToComma(aData.maxstorage) + ' MB');
			$('td:eq(5)', nRow).html(transferIntToComma(aData.currentstorage) + ' MB');
			$('td:eq(6)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
			if (aData.code != 'default') {
				$('td:eq(7)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
			} else {
				$('td:eq(7)', nRow).html('');
			}
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
		var item = $('#MyTable').dataTable().fnGetData(index);
		var action = myurls['common.delete'];
		currentItem = item;
		
		bootbox.confirm(common.tips.remove + currentItem.name, function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : action,
					cache: false,
					data : {
						'vsp.vspid': currentItem['vspid']
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
	var currentAppTreeData = [];
	var currentApps = {};
	
	$.ajax({
		type : 'POST',
		url : myurls['app.list'],
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				createAppTreeData(data.aaData, currentAppTreeData);
				createAppTree(currentAppTreeData);
			} else {
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
		}
	});
	
	function createAppTreeData(apps, treeData) {
		for (var i=0; i<apps.length; i++) {
			treeData[i] = {};
			treeData[i]['data'] = {};
			treeData[i]['data']['title'] = apps[i].mainboard + ' - ' + apps[i].description + '(' + apps[i].name + ')';
			treeData[i]['attr'] = {};
			treeData[i]['attr']['id'] = apps[i].appid;
			treeData[i]['attr']['parentid'] = 0;
			if (currentApps[treeData[i]['attr']['id']] == undefined) {
				treeData[i]['attr']['class'] = 'jstree-unchecked';
			} else {
				treeData[i]['attr']['class'] = 'jstree-checked';
			}
			treeData[i]['children'] = [];
		}
	}
	function refreshAppTreeData(treeData) {
		for (var i=0; i<treeData.length; i++) {
			if (currentApps[treeData[i]['attr']['id']] == undefined) {
				treeData[i]['attr']['class'] = 'jstree-unchecked';
			} else {
				treeData[i]['attr']['class'] = 'jstree-checked';
			}
			refreshAppTreeData(treeData[i]['children']);
		}
	}
	function createAppTree(treeData) {
		$('#AppTree').jstree('destroy');
		var treeview = $('#AppTree').jstree({
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
	
	FormValidateOption.rules = {};
	FormValidateOption.rules['vsp.name'] = {
		required: true,
		minlength: 2,
		remote: {
			url: myurls['vsp.validate'],
			type: 'post',
			data: {
				'vsp.vspid': function() {
					return $('#MyEditForm input[name="vsp.vspid"]').val();
				},
				'vsp.name': function() {
					return $('#MyEditForm input[name="vsp.name"]').val();
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
	FormValidateOption.rules['vsp.code'] = {
			required: true,
			minlength: 2,
			remote: {
				url: myurls['vsp.validate'],
				type: 'post',
				data: {
					'vsp.vspid': function() {
						return $('#MyEditForm input[name="vsp.vspid"]').val();
					},
					'vsp.code': function() {
						return $('#MyEditForm input[name="vsp.code"]').val();
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
		'vsp.name': {
			remote: common.tips.name_repeat
		},
		'vsp.code': {
			remote: common.tips.code_repeat
		},
	};
	FormValidateOption.rules['vsp.maxdevices'] = {};
	FormValidateOption.rules['vsp.maxdevices']['required'] = true;
	FormValidateOption.rules['vsp.maxdevices']['number'] = true;
	FormValidateOption.rules['vsp.maxstorage'] = {};
	FormValidateOption.rules['vsp.maxstorage']['required'] = true;
	FormValidateOption.rules['vsp.maxdevices']['number'] = true;
	
	FormValidateOption.submitHandler = function(form) {
		var apps = '';
		$("#AppTree").jstree('get_checked', null, true).each(function() {
			if (apps == '') {
				apps += this.id;
			} else {
				apps += ',' + this.id;
			}
		});
		$('#MyEditForm input[name="vsp.apps"]').val(apps);

		var data = jQuery("#MyEditForm").serializeArray();
		$.ajax({
			type : 'POST',
			url : $('#MyEditForm').attr('action'),
			data : data,
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
		var action = myurls['common.add'];
		refreshForm('MyEditForm');
		var checkboxes = $('#MyEditForm').find('input[type="checkbox"]');
		$.each( checkboxes, function( index, checkbox ) {
			$(checkbox).attr('checked');
			$(checkbox).parent().addClass('checked');
		});
		$('#MyEditForm').attr('action', action);
		$('#MyEditForm input[name="vsp.code"]').removeAttr('readonly');
		
		currentApps = {};
		refreshAppTreeData(currentAppTreeData);
		createAppTree(currentAppTreeData);
		
		$('#MyEditModal').modal();
	});			

	
	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		var action = myurls['common.update'];
		var formdata = new Object();
		for (var name in item) {
			formdata['vsp.' + name] = item[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		var checkboxes = $('#MyEditForm').find('input[type="checkbox"]');
		$.each( checkboxes, function( index, checkbox ) {
			if (formdata[$(checkbox).attr('name')] == 0) {
				$(checkbox).removeAttr('checked');
				$(checkbox).parent().removeClass('checked');
			} else {
				$(checkbox).attr('checked');
				$(checkbox).parent().addClass('checked');
			}
		});
		$('#MyEditForm').attr('action', action);
		$('#MyEditForm input[name="vsp.code"]').attr('readonly','readonly');
		
		currentApps = {};
		if (item.applist != null) {
			for (var i=0; i<item.applist.length; i++) {
				currentApps[item.applist[i].appid] = item.applist[i];
			}
		}
		refreshAppTreeData(currentAppTreeData);
		createAppTree(currentAppTreeData);
		
		$('#MyEditModal').modal();
	});

	$('input[name="vsp.expireflag"]').click(function(e) {
		if ($('input[name="vsp.expireflag"]:checked').val() == 0) {
			$('.expiretime').css('display', 'none');
		} else {
			$('.expiretime').css('display', 'block');
		}
	});  
}


