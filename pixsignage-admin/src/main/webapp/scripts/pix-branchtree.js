var CurBranchid;
var DropdownBranchid;
	
function initBranchTree() {
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
						$('#BranchContentDiv').removeClass("col-md-10");
						$('#BranchContentDiv').addClass("col-md-12");
					} else {
						var branchTreeDivData = [];
						createBranchTreeData(branches, branchTreeDivData);
						$('#BranchTreeDiv').jstree('destroy');
						$('#BranchTreeDiv').jstree({
							'json_data' : {
								'data' : branchTreeDivData
							},
							'plugins' : [ 'themes', 'json_data', 'ui' ],
							'core' : {
								'animation' : 100
							},
							'ui' : {
								'select_limit' : 1,
								'initially_select' : CurBranchid,
							},
							'themes' : {
								'theme' : 'proton',
								'icons' : false,
							}
						});
						$('#BranchTreeDiv').on('loaded.jstree', function() {
							$('#BranchTreeDiv').jstree('open_all');
						});
					}
				}

				if ( $("#BranchTreeDropdown").length > 0 ) {
					DropdownBranchid = branches[0].branchid;
					if (branches[0].children.length == 0) {
						$('#BranchTreeDropdown').css('display', 'none');
					} else {
						var branchTreeDropdownData = [];
						$('#BranchTitle').html(branches[0].name + ' <i class="fa fa-angle-down"></i>');
						createBranchTreeData(branches, branchTreeDropdownData);
						$('#BranchTreeDropdown .pre-scrollable').jstree('destroy');
						$('#BranchTreeDropdown .pre-scrollable').jstree({
							'json_data' : {
								'data' : branchTreeDropdownData
							},
							'plugins' : [ 'themes', 'json_data', 'ui' ],
							'core' : {
								'animation' : 100
							},
							'ui' : {
								'select_limit' : 1,
								'initially_select' : DropdownBranchid,
							},
							'themes' : {
								'theme' : 'proton',
								'icons' : false,
							}
						});
						$('#BranchTreeDropdown .pre-scrollable').on('loaded.jstree', function() {
							$('#BranchTreeDropdown .pre-scrollable').jstree('open_all');
						});
					}
				}
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
			treeData[i]['attr']['title'] = branches[i].name;
			treeData[i]['attr']['parentid'] = branches[i].parentid;
			if (treeData[i]['attr']['id'] == CurBranchid) {
				treeData[i]['attr']['class'] = 'jstree-selected';
			} else {
				treeData[i]['attr']['class'] = 'jstree-unselected';
			}
			treeData[i]['children'] = [];
			createBranchTreeData(branches[i].children, treeData[i]['children']);
		}
	}

	$('#BranchTreeDiv').on('select_node.jstree', function(event, data) {
		CurBranchid = data.rslt.obj.attr('id');
		refreshMyTable();
	});
	
	$('#BranchTreeDropdown .pre-scrollable').on('select_node.jstree', function(event, data) {
		DropdownBranchid = data.rslt.obj.attr('id');
		$('#BranchTitle').html(data.rslt.obj.attr('title') + ' <i class="fa fa-angle-down"></i>');
		refreshTableFromBranchDropdown();
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