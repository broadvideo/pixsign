var myurls = {
	'common.list' : 'media!imagelist.action',
	'common.add' : 'media!add.action',
	'common.update' : 'media!update.action',
	'common.delete' : 'media!delete.action',
	'branch.list' : 'branch!list.action'
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

function initMyTable() {
	$(".fancybox").fancybox({
		openEffect	: 'none',
		closeEffect	: 'none'
	});

	$("#MyTable thead").css("display", "none");
	$("#MyTable tbody").css("display", "none");
	
	var currentSelectBranchid = myBranchid;
	var thumbmailhtml = '';
	var oTable = $('#MyTable').dataTable({
		'sDom' : "<'row'<'col-md-6 col-sm-12'l><'col-md-12 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", //default layout without horizontal scroll(remove this setting to enable horizontal scroll for the table)
		'aLengthMenu' : [ [ 12, 24, 48, 96 ],
						[ 12, 24, 48, 96 ] // change per page values here
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [
						{"sTitle" : "视频名称", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "文件名", "mData" : "filename", "bSortable" : false }, 
						{"sTitle" : "文件大小", "mData" : "size", "bSortable" : false }, 
						{"sTitle" : "创建时间", "mData" : "createtime", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "orgid", "bSortable" : false }],
		'iDisplayLength' : 12,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		"fnPreDrawCallback": function (oSettings) {
			if ($('#MediaContainer').length < 1) {
				$('#MyTable').append('<div id="MediaContainer"></div>');
			}
			$('#MediaContainer').html(''); 
			return true;
		},
		"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			if (iDisplayIndex % 6 == 0) {
				thumbmailhtml = '';
				thumbmailhtml += '<div class="row" >';
			}
			thumbmailhtml += '<div class="col-md-2 col-xs-2">';
			thumbmailhtml += '<a class="fancybox" href="/image/' + aData['filename'] + '" title="' + aData['name'] + '">';
			thumbmailhtml += '<img src="media!getthumb.action?mediaid=' + aData['mediaid'] + '" alt="' + aData['name'] + '" /> </a>';
			thumbmailhtml += '<h6>' + aData['mediaid'] + '：' + aData['name'] + '<br>';
			var filesize = parseInt(aData['size'] / 1024);
			thumbmailhtml += '' + transferIntToComma(filesize) + 'KB</h6>';
			if (currentSelectBranchid == myBranchid) {
				thumbmailhtml += '<p><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-pencil"></i> </a>';
				thumbmailhtml += '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> </a> </p>';
			}
			thumbmailhtml += '</div>';
			if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
				thumbmailhtml += '</div>';
				if ((iDisplayIndex+1) != $('#MyTable').dataTable().fnGetData().length) {
					thumbmailhtml += '<hr/>';
				}
				$('#MediaContainer').append(thumbmailhtml);
			}
			return nRow;
		},
		'fnServerParams': function(aoData) { 
	        aoData.push({'name':'branchid','value':currentSelectBranchid });
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
		currentItem = item;
		
		bootbox.confirm('请确认是否删除"' + currentItem.name + '"', function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : myurls['common.delete'],
					cache: false,
					data : {
						'ids': currentItem['mediaid']
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


	$.ajax({
		type : 'POST',
		url : myurls['branch.list'],
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var currentBranchTreeData = [];
				createBranchTreeData(data.aaData, currentBranchTreeData);
				createSelectBranchTree(currentBranchTreeData);
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
			if (treeData[i]['attr']['id'] == currentSelectBranchid) {
				treeData[i]['attr']['class'] = 'jstree-selected';
			} else {
				treeData[i]['attr']['class'] = 'jstree-unselected';
			}
			treeData[i]['children'] = [];
			createBranchTreeData(branches[i].children, treeData[i]['children']);
		}
	}
	function createSelectBranchTree(treeData) {
		$('#SelectBranchTree').jstree('destroy');
	    $('#SelectBranchTree').jstree({
	        'json_data' : {
	            'data' : treeData
	        },
			'plugins' : [ 'themes', 'json_data', 'ui' ],
			'core' : {
				'animation' : 100
			},
			'ui' : {
				'select_limit' : 1,
				'initially_select' : currentSelectBranchid,
			},
			'themes' : {
				'theme' : 'proton',
				'icons' : false,
			}
		});
	    $('#SelectBranchTree').on('loaded.jstree', function() {
	    	$('#SelectBranchTree').jstree('open_all');
	    });
	}
	
	var BranchidList = [];
	var BranchnameList = [];
	$("#SelectBranchTree").on("select_node.jstree", function(event, data) {
		currentSelectBranchid = data.rslt.obj.attr('id');
		BranchidList = data.inst.get_path('#' + data.rslt.obj.attr('id'), true);
		BranchnameList = data.inst.get_path('#' + data.rslt.obj.attr('id'), false); 
		initBranchBreadcrumb(currentSelectBranchid);
		refreshMyTable();
	});
	
	$('body').on('click', '.pix-branch', function(event) {
		currentSelectBranchid = $(event.target).attr('data-id');
		initBranchBreadcrumb(currentSelectBranchid);
		refreshMyTable();
	});

	$('body').on('click', '.pix-full', function(event) {
		bootbox.alert('存储已达上限，无法上传文件。');
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
}

function initMyEditModal() {
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	FormValidateOption.rules['media.name'] = {};
	FormValidateOption.rules['media.name']['required'] = true;
	FormValidateOption.rules['media.name']['minlength'] = 2;
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
				bootbox.alert('出错了！');
			}
		});
	};
	$('#MyEditForm').validate(FormValidateOption);
	
	$('[type=submit]', $('#MyEditModal')).on('click', function(event) {
		if ($('#MyEditForm').valid()) {
			$('#MyEditForm').submit();
		}
	});
	
	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in item) {
			formdata['media.' + name] = item[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', myurls['common.update']);
		$('#MyEditModal').modal();
	});

}
