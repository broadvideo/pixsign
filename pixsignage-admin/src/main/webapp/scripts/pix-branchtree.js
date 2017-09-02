var CurBranchid;
	
function initBranchTree() {
	/*
	$.ajax({
		type : 'POST',
		url : 'branch!list.action',
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var branches = data.aaData;
				CurBranchid = branches[0].branchid;
				
				if ( $("#BranchTreeDiv").length > 0 ) {
					if (branches[0].children.length == 0) {
						$('#BranchTreeDiv').css('display', 'none');
						if ($('#BranchContentDiv') != null) {
							$('#BranchContentDiv').removeClass("col-md-10");
							$('#BranchContentDiv').addClass("col-md-12");
						}
					} else {
						var branchTreeDivData = [];
						createBranchTreeData(branches, branchTreeDivData);
						$('#BranchTreeDiv').jstree('destroy');
						$('#BranchTreeDiv').jstree({
							'core' : {
								'multiple' : false,
								'data' : branchTreeDivData
							},
							'plugins' : ['unique'],
						});
						$('#BranchTreeDiv').on('loaded.jstree', function() {
							$('#BranchTreeDiv').jstree('select_node', CurBranchid);
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
	function createBranchTreeData(branches, treeData) {
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

	$('#BranchTreeDiv').jstree('destroy');
	$('#BranchTreeDiv').jstree({
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
	$('#BranchTreeDiv').on('loaded.jstree', function() {
		CurBranchid = $('#BranchTreeDiv').jstree(true).get_json('#')[0].id;
		$('#BranchTreeDiv').jstree('select_node', CurBranchid);
	});
	$('#BranchTreeDiv').on('select_node.jstree', function(event, data) {
		CurBranchid = data.instance.get_node(data.selected[0]).id;
		if ($('#FolderTreeDiv').length > 0) {
			CurFolderid = null;
			initFolderTree();
		}
		refreshMyTable();
	});
	
	//var BranchidList = [];
	//var BranchnameList = [];
	//$("#BranchTreeDiv").on("select_node.jstree", function(event, data) {
		//CurBranchid = data.rslt.obj.attr('id');
		//BranchidList = data.inst.get_path('#' + data.rslt.obj.attr('id'), true);
		//BranchnameList = data.inst.get_path('#' + data.rslt.obj.attr('id'), false); 
		//initBranchBreadcrumb(CurBranchid);
		//refreshMyTable();
	//});
	
	/*
	$('body').on('click', '.pix-branch', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurBranchid = index;
		initBranchBreadcrumb(CurBranchid);
		refreshMyTable();
	});

	function initBranchBreadcrumb(branchid) {
		var html = '';
		var active = '';
		for (var i=0; i<BranchidList.length; i++) {
			if (BranchidList[i] == branchid) {
				active = 'active';
			} else {
				active = '';
			}
			html += '<li class="' + active + '">';
			if (i == 0) {
				html += '<i class="fa fa-home"></i>';
			}
			if (BranchidList[i] == branchid) {
				html += BranchnameList[i];
			} else {
				html += '<a href="javascript:;" data-id="' + BranchidList[i] + '" class="pix-branch">' + BranchnameList[i] + '</a>';
			}
			if (i < BranchidList.length-1) {
				html += '<i class="fa fa-angle-right"></i>';
			}
			html += '</li>';
		}
		$('#BranchBreadcrumb').html(html);
	}
	*/
	
}