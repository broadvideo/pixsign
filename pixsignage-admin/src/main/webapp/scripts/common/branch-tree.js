var BranchTree = function (container) {
	var _self = this;
	this.container = container;
	this.branchid = null;
	this.folderid = null;

	var initBranchTree = function() {
		$.ajax({
			type : 'POST',
			url : 'branch!list.action',
			data : {},
			success : function(data, status) {
				if (data.errorcode == 0) {
					var branches = data.aaData;
					_self.branchid = branches[0].branchid;
					
					if ( $(container).find('.branchtree').length > 0 ) {
						if (branches[0].children.length == 0) {
							$(container).find('.branchtree').css('display', 'none');
							_self.folderid = null;
							initFolderTree();
							refreshMediaTable();
						} else {
							var branchTreeDivData = [];
							createBranchTreeData(branches, branchTreeDivData);
							$(container).find('.branchtree').jstree('destroy');
							$(container).find('.branchtree').jstree({
								'core' : {
									'multiple' : false,
									'data' : branchTreeDivData
								},
								'plugins' : ['unique'],
							});
							$(container).find('.branchtree').on('loaded.jstree', function() {
								console.log(this.branchid, _self.branchid);
								$(container).find('.branchtree').jstree('select_node', _self.branchid);
							});
							$(container).find('.branchtree').on('select_node.jstree', function(event, data) {
								_self.branchid = data.instance.get_node(data.selected[0]).id;
								_self.folderid = null;
								initFolderTree();
								refreshMediaTable();
							});
						}
					}
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	}
	
	var createBranchTreeData = function(branches, treeData) {
		for (var i=0; i<branches.length; i++) {
			treeData[i] = {};
			treeData[i].id = branches[i].branchid;
			treeData[i].text = branches[i].name;
			treeData[i].state = {
				opened: true,
			}
			treeData[i].children = [];
			createBranchTreeData(branches[i].children, treeData[i].children);
		}
	}	
	
	var initFolderTree = function() {
		$.ajax({
			type : 'POST',
			url : 'folder!list.action',
			data : {
				branchid: _self.branchid
			},
			success : function(data, status) {
				if (data.errorcode == 0) {
					var folders = data.aaData;
					_self.folderid = folders[0].folderid;
					
					if ( $(container).find('.foldertree').length > 0 ) {
						var folderTreeDivData = [];
						createFolderTreeData(folders, folderTreeDivData);
						$(container).find('.foldertree').jstree('destroy');
						$(container).find('.foldertree').jstree({
							'core' : {
								'multiple' : false,
								'data' : folderTreeDivData
							},
							'plugins' : ['unique', 'types'],
							'types' : {
								'default' : { 'icon' : 'fa fa-folder icon-state-warning icon-lg' }
							},
						});
						$(container).find('.foldertree').on('loaded.jstree', function() {
							$(container).find('.foldertree').jstree('select_node', _self.folderid);
						});
						$(container).find('.foldertree').on('select_node.jstree', function(event, data) {
							_self.folderid = data.instance.get_node(data.selected[0]).id;
							refreshMediaTable();
						});
					}
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	}
	
	var createFolderTreeData = function(folders, treeData) {
		if (folders == null) return;
		for (var i=0; i<folders.length; i++) {
			treeData[i] = {};
			treeData[i].id = folders[i].folderid;
			treeData[i].text = folders[i].name;
			treeData[i].state = {
				opened: true,
			}
			treeData[i].children = [];
			createFolderTreeData(folders[i].children, treeData[i].children);
		}
	}
	
	var refreshMediaTable = function() {
		$(container).find('table').dataTable()._fnAjaxUpdate();
	}
	
	initBranchTree();
};
