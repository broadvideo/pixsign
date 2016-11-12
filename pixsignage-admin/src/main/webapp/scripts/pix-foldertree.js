var CurFolderid;
	
function initFolderTree() {
	$.ajax({
		type : 'POST',
		url : 'folder!list.action',
		data : {
			branchid: CurBranchid
		},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var folders = data.aaData;
				CurFolderid = folders[0].folderid;
				
				if ( $("#FolderTreeDiv").length > 0 ) {
					var folderTreeDivData = [];
					createFolderTreeData(folders, folderTreeDivData);
					$('#FolderTreeDiv').jstree('destroy');
					$('#FolderTreeDiv').jstree({
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
					});
					$('#FolderTreeDiv').on('loaded.jstree', function() {
						$('#FolderTreeDiv').jstree('select_node', CurFolderid);
					});
					$('#FolderTreeDiv').on('select_node.jstree', function(event, data) {
						CurFolderid = data.instance.get_node(data.selected[0]).id;
						refreshMyTable();
					});
					$('#FolderTreeDiv').on('create_node.jstree', function(event, data) {
						$.ajax({
							type : 'POST',
							url : 'folder!add.action',
							cache: false,
							data : {
								'folder.folderid' : 0,
								'folder.branchid' : CurBranchid,
								'folder.parentid' : data.node.parent,
								'folder.name' : data.node.text
							},
							success : function(result, status) {
								if (result.errorcode == 0) {
									data.instance.set_id(data.node, result.data.folderid);
								} else {
									data.instance.refresh();
									bootbox.alert(common.tips.error);
								}
							},
							error : function() {
								bootbox.alert(common.tips.error);
							}
						});				
					});
					$('#FolderTreeDiv').on('rename_node.jstree', function (event, data) {
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
									bootbox.alert(common.tips.error);
								}
							},
							error : function() {
								data.instance.refresh();
								bootbox.alert(common.tips.error);
							}
						});				
					});
					$('#FolderTreeDiv').on('delete_node.jstree', function (event, data) {
						console.log(data);
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
			} else {
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
		}
	});

	function createFolderTreeData(folders, treeData) {
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

}