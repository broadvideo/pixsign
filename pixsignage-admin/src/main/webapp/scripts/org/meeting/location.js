var BranchModule = function () {
	var _parentid = -1;
	var _parent = {};
	var _branch = {};
	var BranchTree;
	var TreeData = [];

	var init = function () {
		initBranchTree();
		initBranchTable();
		initBranchEvent();
		initBranchEditModal();
		initDeviceModal();
	};

	var refresh = function () {
		$('#BranchTable').dataTable()._fnAjaxUpdate();
		$('#BranchPortlet .branchtree').jstree(true).refresh_node(_parentid);
	
			$('.pix-add').css('display', '');
		
	};
	
	var initBranchTree = function () {
		BranchTree = $('#BranchPortlet .branchtree');
		BranchTree.jstree('destroy');
		BranchTree.jstree({
			'core' : {
				'multiple' : false,
				'data' : {
					'url': function(node) {
						return 'location!listnode.action';
					},
					'data': function(node) {
						return {
							'id': node.id,
							'location':node.location,
						}
					}
				}
			},
			'plugins' : ['unique'],
		});
		BranchTree.on('loaded.jstree', function() {
			_parentid = BranchTree.jstree(true).get_json('#')[0].id;
			BranchTree.jstree('select_node', _parentid);
			refresh();
		});
		BranchTree.on('select_node.jstree', function(event, data) {
			_parentid = data.instance.get_node(data.selected[0]).id;
			_parent = data.instance.get_node(data.selected[0]).original.location;
			refresh();
		});
	};
	
	var initBranchTable = function () {
		$('#BranchTable').dataTable({
			'sDom' : 'rt',
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'location!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
			        		{'sTitle' : common.view.code, 'mData' : 'code', 'bSortable' : false }, 
			        		{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false }, 
			        		{'sTitle' : '', 'mData' : 'locationid', 'bSortable' : false }, 
			        		{'sTitle' : '', 'mData' : 'locationid', 'bSortable' : false }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(3)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
				if (aData.childrenCount == 0) {
					$('td:eq(4)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
				} else {
					$('td:eq(4)', nRow).html('');
				}
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'parentid','value':_parentid });
			}
		});
		$('#BranchTable').css('width', '100%').css('table-layout', 'fixed');
	};

	var initBranchEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_branch = $('#BranchTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _branch.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'location!delete.action',
						cache: false,
						data : {
							'location.locationid': _branch.locationid
						},
						success : function(data, status) {
							if (data.errorcode == 0) {
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

	var initBranchEditModal = function () {
		var formHandler = new FormHandler($('#BranchEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['location.name'] = {};
		formHandler.validateOption.rules['location.name']['required'] = true;
		formHandler.validateOption.rules['location.name']['minlength'] = 2;
		formHandler.validateOption.rules['location.name']['remote'] = {
			url: 'location!validate.action',
			type: 'post',
			data: {
				'location.locationid': function() {
					return $('#BranchEditForm input[name="location.locationid"]').val();
				},
				'location.name': function() {
					return $('#BranchEditForm input[name="location.name"]').val();
				}
			},
			dataFilter: function(responseString) {
				var response = $.parseJSON(responseString);
				if (response.errorcode == 0) {
					return true;
				}
				return false;
			}
		};
		formHandler.validateOption.messages = {
			'location.name': {
				remote: common.tips.name_repeat
			},
		};
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#BranchEditForm').attr('action'),
				data : $('#BranchEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#BranchEditModal').modal('hide');
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
		$('#BranchEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#BranchEditModal')).on('click', function(event) {
			if ($('#BranchEditForm').valid()) {
				$('#BranchEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			formHandler.reset();
			$('#BranchEditForm').attr('action', 'location!add.action');
			$('#BranchEditForm input[name="location.parentid"]').attr('value', _parentid);
			$('#BranchEditModal').modal();
		});

		$('#BranchTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_branch = $('#BranchTable').dataTable().fnGetData(index);
			formHandler.reset();
			formHandler.setdata('location', _branch);
			$('#BranchEditForm').attr('action', 'location!update.action');
			$('#BranchEditModal').modal();
		});
	};

	var initDeviceModal = function () {
		var LeftTree = $('#LeftTreeDiv').find('.branchtree');
		var RightTree = $('#RightTreeDiv').find('.branchtree');
		var LeftBranchid = null;
		var RightBranchid = null;
		var LeftDevices = [];
		var RightDevices = [];
		
		$('body').on('click', '.pix-device', function(event) {
			LeftBranchid = null;
			RightBranchid = null;
			LeftDevices = [];
			RightDevices = [];
			$('#LeftTable').dataTable()._fnAjaxUpdate();
			$('#RightTable').dataTable()._fnAjaxUpdate();
			initBranchTreeData();
			$('#DeviceModal').modal();
		});
		
		function initBranchTreeData() {
			LeftTree.jstree('destroy');
			LeftTree.jstree({
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
			LeftTree.on('loaded.jstree', function() {
				LeftBranchid = LeftTree.jstree(true).get_json('#')[0].id;
				LeftTree.jstree('select_node', LeftBranchid);
			});
			LeftTree.on('select_node.jstree', function(event, data) {
				LeftBranchid = data.instance.get_node(data.selected[0]).id;
				LeftDevices = [];
				$('#LeftTable').dataTable()._fnAjaxUpdate();
			});

			RightTree.jstree('destroy');
			RightTree.jstree({
				'core' : {
					'multiple' : false,
					'data' : {
						'url': function(node) {
							return 'location!listnode.action';
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
			RightTree.on('loaded.jstree', function() {
				RightBranchid = RightTree.jstree(true).get_json('#')[0].id;
				RightTree.jstree('select_node', RightBranchid);
			});
			RightTree.on('select_node.jstree', function(event, data) {
				RightBranchid = data.instance.get_node(data.selected[0]).id;
				RightDevices = [];
				$('#RightTable').dataTable()._fnAjaxUpdate();
			});
		}



	};

	return {
		init: init,
		refresh: refresh,
	}
	
}();

