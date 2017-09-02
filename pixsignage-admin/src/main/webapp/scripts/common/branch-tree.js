var BranchTree = function (container) {
	var _self = this;
	this.container = container;
	this.branchid = null;
	this.folderid = null;
	var BranchTree = $(container).find('.branchtree');
	var FolderTree = $(container).find('.foldertree');

	var initBranchTree = function() {
		/*
		$.ajax({
			type : 'POST',
			url : 'branch!list.action',
			data : {},
			success : function(data, status) {
				if (data.errorcode == 0) {
					var branches = data.aaData;
					_self.branchid = branches[0].branchid;
					
					if ( BranchTree.length > 0 ) {
						if (branches[0].children.length == 0) {
							BranchTree.css('display', 'none');
							_self.folderid = null;
							initFolderTree();
							refreshTable();
						} else {
							var branchTreeDivData = [];
							createBranchTreeData(branches, branchTreeDivData);
							BranchTree.jstree('destroy');
							BranchTree.jstree({
								'core' : {
									'multiple' : false,
									'data' : branchTreeDivData
								},
								'plugins' : ['unique'],
							});
							BranchTree.on('loaded.jstree', function() {
								console.log(this.branchid, _self.branchid);
								BranchTree.jstree('select_node', _self.branchid);
							});
							BranchTree.on('select_node.jstree', function(event, data) {
								_self.branchid = data.instance.get_node(data.selected[0]).id;
								_self.folderid = null;
								initFolderTree();
								refreshTable();
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
		*/

		BranchTree.jstree('destroy');
		BranchTree.jstree({
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
		BranchTree.on('loaded.jstree', function() {
			_self.branchid = BranchTree.jstree(true).get_json('#')[0].id;
			BranchTree.jstree('select_node', _self.branchid);
		});
		BranchTree.on('select_node.jstree', function(event, data) {
			_self.branchid = data.instance.get_node(data.selected[0]).id;
			_self.folderid = null;
			initFolderTree();
			refreshTable();
		});
	}
	
	/*
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
	*/	
	
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
					
					if ( FolderTree.length > 0 ) {
						var folderTreeDivData = [];
						createFolderTreeData(folders, folderTreeDivData);
						
						var option = {};
						if (FolderTree.hasClass('editable')) {
							option = {
								'core' : {
									'multiple' : false,
									'check_callback' : true,
									"themes" : {
					                    "responsive": false
					                },
									'data' : folderTreeDivData
								},
								'plugins' : ['unique', 'contextmenu', 'types'],
								'types' : {
									'default' : { 'icon' : 'fa fa-folder icon-state-warning icon-lg' }
								},
								'unique' : {
									'duplicate' : function (name, counter) {
										return name + ' ' + counter;
									}
								},
								'contextmenu':{
									'items': function () {
										return {
											'Create': {
												'label': common.view.add,
												'action': function (data) {
													var ref = $.jstree.reference(data.reference);
													var sel = ref.get_selected();
													if(!sel.length) { return false; }
													sel = sel[0];
													sel = ref.create_node(sel);
													if (sel) {
														ref.edit(sel);
													}
												}
											},
											'Rename': {
												'label': common.view.edit,
												'action': function (data) {
													var ref = $.jstree.reference(data.reference);
													var obj = ref.get_node(data.reference);
													ref.edit(obj);
												}
											},
											'Delete': {
												'label': common.view.remove,
												'action': function (data) {
													var ref = $.jstree.reference(data.reference);
													var sel = ref.get_selected();
													if (!sel.length) { 
														return false; 
													}
													var obj = ref.get_node(data.reference);
													if (!obj.children.length) {
														ref.delete_node(sel);
													} else {
														bootbox.alert(common.tips.folder_remove_failed);
													}
												}
											}
										};
									}
								}
							};
						} else {
							option = {
								'core' : {
									'multiple' : false,
									'data' : folderTreeDivData
								},
								'plugins' : ['unique', 'types'],
								'types' : {
									'default' : { 'icon' : 'fa fa-folder icon-state-warning icon-lg' }
								},
							};
						}
						
						FolderTree.jstree('destroy');
						FolderTree.jstree(option);
						FolderTree.on('loaded.jstree', function() {
							FolderTree.jstree('select_node', _self.folderid);
						});
						FolderTree.on('select_node.jstree', function(event, data) {
							_self.folderid = data.instance.get_node(data.selected[0]).id;
							refreshTable();
						});
						
						if (FolderTree.hasClass('editable')) {
							FolderTree.on('create_node.jstree', function(event, data) {
								$.ajax({
									type : 'POST',
									url : 'folder!add.action',
									cache: false,
									data : {
										'folder.folderid' : 0,
										'folder.branchid' : _self.branchid,
										'folder.parentid' : data.node.parent,
										'folder.name' : data.node.text
									},
									success : function(result, status) {
										if (result.errorcode == 0) {
											data.instance.set_id(data.node, result.data.folderid);
										} else {
											data.instance.refresh();
											console.log('failue');
										}
									},
									error : function() {
										console.log('failue');
									}
								});				
							});
							FolderTree.on('rename_node.jstree', function (event, data) {
								$.ajax({
									type : 'POST',
									url : 'folder!update.action',
									cache: false,
									data : {
										'folder.folderid' : data.node.id,
										'folder.name' : data.node.text
									},
									success : function(result, status) {
										if (result.errorcode != 0) {
											data.instance.refresh();
											console.log('failue');
										}
									},
									error : function() {
										data.instance.refresh();
										console.log('failue');
									}
								});				
							});
							FolderTree.on('delete_node.jstree', function (event, data) {
								$.ajax({
									type : 'POST',
									url : 'folder!delete.action',
									cache: false,
									data : {
										'folder.folderid' : data.node.id
									},
									success : function(result, status) {
										if (result.errorcode != 0) {
											data.instance.refresh();
											bootbox.alert(common.tips.folder_remove_failed);
										}
									},
									error : function() {
										data.instance.refresh();
										bootbox.alert(common.tips.folder_remove_failed);
									}
								});				
							})
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
	
	var refreshTable = function() {
		$(container).find('table').dataTable()._fnAjaxUpdate();
	}
	
	initBranchTree();
};
