var myurls = {
	'common.list' : 'device!list.action',
	'common.add' : 'device!add.action',
	'common.update' : 'device!update.action',
	'common.delete' : 'device!delete.action',
	'device.unregisterlist' : 'device!unregisterlist.action',
	'device.sync' : 'device!sync.action',
	'devicefile.list' : 'devicefile!list.action',
	'branch.list' : 'branch!list.action'
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

function initMyTable() {
	var currentSelectBranchid = myBranchid;
	
	var oTable = $('#MyTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [ {'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '5%' }, 
						{'sTitle' : '终端ID', 'mData' : 'terminalid', 'bSortable' : false, 'sWidth' : '10%' }, 
						{'sTitle' : '硬件码', 'mData' : 'hardkey', 'bSortable' : false, 'sWidth' : '10%' }, 
						{'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' }, 
						{'sTitle' : '位置', 'mData' : 'position', 'bSortable' : false, 'sWidth' : '15%' }, 
						{'sTitle' : '分组', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '10%' }, 
						{'sTitle' : '在线', 'mData' : 'onlineflag', 'bSortable' : false, 'sWidth' : '10%' }, 
						{'sTitle' : '计划', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '10%' }, 
						{'sTitle' : '更多操作', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' }],
		'aoColumnDefs': [
	 					{'bSortable': false, 'aTargets': [ 0 ] }
	 				],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var data = $('#MyTable').dataTable().fnGetData(iDisplayIndex);

			if (data.devicegroupid > 0) {
				$('td:eq(5)', nRow).html(data.devicegroup.name);
			} else {
				$('td:eq(5)', nRow).html('');
			}
			if (data['onlineflag'] == 9) {
				$('td:eq(6)', nRow).html('<span class="label label-sm label-default">离线</span>');
			} else if (data['onlineflag'] == 1) {
				$('td:eq(6)', nRow).html('<span class="label label-sm label-success">在线</span>');
			} else if (data['onlineflag'] == 0) {
				$('td:eq(6)', nRow).html('<span class="label label-sm label-info">空闲</span>');
			}
			
			var synchtml = '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> 同步</a>';
			$('td:eq(7)', nRow).html(synchtml);
			
			var dropdownBtn = '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-file"><i class="fa fa-list-ul"></i> 文件</a>';
			dropdownBtn += '&nbsp;&nbsp;<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> 编辑</a>';
			dropdownBtn += '&nbsp;&nbsp;<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-delete"><i class="fa fa-trash-o"></i> 解绑</a>';
			$('td:eq(8)', nRow).html(dropdownBtn);

			var rowdetail = '<span class="row-details row-details-close"></span>';
			$('td:eq(0)', nRow).html(rowdetail);
			
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':currentSelectBranchid });
		}
	});

	jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	jQuery('#MyTable_wrapper .dataTables_length select').select2();
	
	function fnFormatDetails ( oTable, nTr )
	{
		var aData = oTable.fnGetData( nTr );
		var sOut = '<table>';
		sOut += '<tr><td>IP地址:</td><td>'+aData['ip']+'</td></tr>';
		sOut += '<tr><td>MAC地址:</td><td>'+aData['mac']+'</td></tr>';
		sOut += '<tr><td>激活时间:</td><td>'+aData['activetime']+'</td></tr>';
		sOut += '</table>';
		 
		return sOut;
	}


	$('#MyTable').on('click', ' tbody td .row-details', function () {
		var nTr = $(this).parents('tr')[0];
		if ( oTable.fnIsOpen(nTr) )
		{
			/* This row is already open - close it */
			$(this).addClass('row-details-close').removeClass('row-details-open');
			oTable.fnClose( nTr );
		}
		else
		{
			/* Open this row */				
			$(this).addClass('row-details-open').removeClass('row-details-close');
			oTable.fnOpen( nTr, fnFormatDetails(oTable, nTr), 'details' );
		}
	});

	var currentItem;
	$('body').on('click', '.pix-delete', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		currentItem = $('#MyTable').dataTable().fnGetData(index);
		
		bootbox.confirm('请确认是否解绑"' + currentItem.name + '"', function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : myurls['common.delete'],
					cache: false,
					data : {
						'device.deviceid': currentItem['deviceid']
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

	$('body').on('click', '.pix-sync', function(event) {
		var target = $(event.target);
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			target = $(event.target).parent();
			index = $(event.target).parent().attr('data-id');
		}
		currentItem = $('#MyTable').dataTable().fnGetData(index);
		bootbox.confirm('是否同步播放计划至"' + currentItem.name + '"', function(result) {
			if (result == true) {
				$.ajax({
					type : 'GET',
					url : myurls['device.sync'],
					cache: false,
					data : {
						deviceid: currentItem.deviceid,
					},
					dataType : 'json',
					contentType : 'application/json;charset=utf-8',
					beforeSend: function ( xhr ) {
						Metronic.startPageLoading({animate: true});
					},
					success : function(data, status) {
						Metronic.stopPageLoading();
						if (data.errorcode == 0) {
							bootbox.alert('同步成功');
						} else {
							bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
						}
					},
					error : function() {
						Metronic.stopPageLoading();
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
				var currentSelectBranchTreeData = [];
				createSelectBranchTreeData(data.aaData, currentSelectBranchTreeData);
				createSelectBranchTree(currentSelectBranchTreeData);
			} else {
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
		}
	});
	function createSelectBranchTreeData(branches, treeData) {
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
			createSelectBranchTreeData(branches[i].children, treeData[i]['children']);
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
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		currentSelectBranchid = index;
		initBranchBreadcrumb(currentSelectBranchid);
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
	
	$('#UnDeviceTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ]
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['device.unregisterlist'],
		'aoColumns' : [ {'sTitle' : '终端ID', 'mData' : 'terminalid', 'bSortable' : false }, 
						{'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : '创建时间', 'mData' : 'createtime', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage
	});

	jQuery('#UnDeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small'); 
	jQuery('#UnDeviceTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
	jQuery('#UnDeviceTable_wrapper .dataTables_length select').select2(); 

	$('body').on('click', '.pix-DeviceReload', function(event) {
		if ($('#portlet_device1').hasClass('active')) {
			$('#MyTable').dataTable()._fnAjaxUpdate();
		} else if ($('#portlet_device2').hasClass('active')) {
			$('#UnDeviceTable').dataTable()._fnAjaxUpdate();
		}
	});			

	$('body').on('click', '#DeviceTab', function(event) {
		$('#MyTable').dataTable()._fnAjaxUpdate();
	});

	$('body').on('click', '#UnDeviceTab', function(event) {
		$('#UnDeviceTable').dataTable()._fnAjaxUpdate();
	});
	
}

function initMyEditModal() {
	var currentEditBranchTreeData = [];
	var currentEditBranchid = 0;
	$.ajax({
		type : 'POST',
		url : myurls['branch.list'],
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				createBranchTreeData(data.aaData, currentEditBranchTreeData);
				createEditBranchTree(currentEditBranchTreeData);
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
			if (treeData[i]['attr']['id'] == currentEditBranchid) {
				treeData[i]['attr']['class'] = 'jstree-selected';
			} else {
				treeData[i]['attr']['class'] = 'jstree-unselected';
			}
			treeData[i]['children'] = [];
			createBranchTreeData(branches[i].children, treeData[i]['children']);
		}
	}
	function refreshEditBranchTreeData(treeData) {
		for (var i=0; i<treeData.length; i++) {
			if (treeData[i]['attr']['id'] == currentEditBranchid) {
				treeData[i]['attr']['class'] = 'jstree-selected';
			} else {
				treeData[i]['attr']['class'] = 'jstree-unselected';
			}
			refreshEditBranchTreeData(treeData[i]['children']);
		}
	}
	function createEditBranchTree(treeData) {
		$('#EditFormBranchTree').jstree('destroy');
		$('#EditFormBranchTree').jstree({
			'json_data' : {
				'data' : treeData
			},
			'plugins' : [ 'themes', 'json_data', 'ui' ],
			'core' : {
				'animation' : 100
			},
			'ui' : {
				'select_limit' : 1,
				'initially_select' : currentEditBranchid,
			},
			'themes' : {
				'theme' : 'proton',
				'icons' : false,
			}
		});
		$('#EditFormBranchTree').on('loaded.jstree', function() {
			$('#EditFormBranchTree').jstree('open_all');
		});
	}

	
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	FormValidateOption.rules = {};
	FormValidateOption.rules['device.terminalid'] = {};
	FormValidateOption.rules['device.terminalid']['required'] = true;
	FormValidateOption.rules['device.terminalid']['minlength'] = 2;
	FormValidateOption.rules['device.name'] = {};
	FormValidateOption.rules['device.name']['required'] = true;
	FormValidateOption.rules['device.name']['minlength'] = 2;
	FormValidateOption.submitHandler = function(form) {
		$("#EditFormBranchTree").jstree('get_selected', null, true).each(function() {
			$('#MyEditForm input[name="device.branchid"]').attr('value', this.id);
		});
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
	
	$('body').on('click', '.pix-add', function(event) {
		refreshForm('MyEditForm');
		$('#MyEditForm').attr('action', myurls['common.add']);
		currentEditBranchid = currentEditBranchTreeData[0].attr.id;
		refreshEditBranchTreeData(currentEditBranchTreeData);
		createEditBranchTree(currentEditBranchTreeData);
		$('#MyEditModal').modal();
	});			

	
	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in item) {
			formdata['device.' + name] = item[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', myurls['common.update']);
		currentEditBranchid = item.branchid;
		refreshEditBranchTreeData(currentEditBranchTreeData);
		createEditBranchTree(currentEditBranchTreeData);
		$('#MyEditModal').modal();
	});

}


function initDeviceFileModal() {
	var currentDeviceid = 0;

	if (videoflag == 1) {
		$('.videoflag').css("display", "block");
	} else {
		$('.videoflag').css("display", "none");
	}
	if (imageflag == 1) {
		$('.imageflag').css("display", "block");
	} else {
		$('.imageflag').css("display", "none");
	}
	
	if (videoflag == 1) {
		$('#nav_tab1').addClass('active');
		$('#portlet_tab1').addClass('active');
	} else if (imageflag == 1) {
		$('#nav_tab2').addClass('active');
		$('#portlet_tab2').addClass('active');
	}

	$('body').on('click', '.pix-file', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		currentDeviceid = item.deviceid;
		
		$('#DeviceVideoTable').dataTable()._fnAjaxUpdate();
		$('#DeviceImageTable').dataTable()._fnAjaxUpdate();
		
		$('#DeviceFileModal').modal();
	});
	
	$('#DeviceVideoTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ]
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['devicefile.list'],
		'aoColumns' : [ {'sTitle' : '编号', 'mData' : 'devicefileid', 'bSortable' : false }, 
						{'sTitle' : '文件名', 'mData' : 'devicefileid', 'bSortable' : false }, 
						{'sTitle' : '大小', 'mData' : 'devicefileid', 'bSortable' : false }, 
						{'sTitle' : 'MD5', 'mData' : 'devicefileid', 'bSortable' : false },
						{'sTitle' : '完成', 'mData' : 'progress', 'bSortable' : false },
						{'sTitle' : '更新时间', 'mData' : 'updatetime', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(0)', nRow).html(aData.video.videoid);
			$('td:eq(1)', nRow).html(aData.video.filename);
			$('td:eq(2)', nRow).html(transferIntToComma(aData.video.size));
			$('td:eq(3)', nRow).html(aData.video.md5);
			if (aData.progress == 0) {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-danger">' + aData.progress + '%</span>');
			} else if (aData['progress'] == 100) {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-success">' + aData.progress + '%</span>');
			} else {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-warning">' + aData.progress + '%</span>');
			}
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'deviceid','value':currentDeviceid },
						{'name':'objtype','value':'1' });
		} 
	});

	jQuery('#DeviceVideoTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
	jQuery('#DeviceVideoTable_wrapper .dataTables_length select').addClass('form-control input-small'); 

	$('#DeviceImageTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ]
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['devicefile.list'],
		'aoColumns' : [ {'sTitle' : '编号', 'mData' : 'devicefileid', 'bSortable' : false }, 
						{'sTitle' : '文件名', 'mData' : 'devicefileid', 'bSortable' : false }, 
						{'sTitle' : '大小', 'mData' : 'devicefileid', 'bSortable' : false }, 
						{'sTitle' : 'MD5', 'mData' : 'devicefileid', 'bSortable' : false },
						{'sTitle' : '完成', 'mData' : 'progress', 'bSortable' : false },
						{'sTitle' : '更新时间', 'mData' : 'updatetime', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(0)', nRow).html(aData.image.imageid);
			$('td:eq(1)', nRow).html(aData.image.filename);
			$('td:eq(2)', nRow).html(transferIntToComma(aData.image.size));
			$('td:eq(3)', nRow).html(aData.image.md5);
			if (aData.progress == 0) {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-danger">' + aData.progress + '%</span>');
			} else if (aData['progress'] == 100) {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-success">' + aData.progress + '%</span>');
			} else {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-warning">' + aData.progress + '%</span>');
			}
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'deviceid','value':currentDeviceid },
						{'name':'objtype','value':'2' });
		} 
	});

	jQuery('#DeviceImageTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
	jQuery('#DeviceImageTable_wrapper .dataTables_length select').addClass('form-control input-small'); 

	$('body').on('click', '.pix-DeviceFileReload', function(event) {
		if ($('#portlet_tab1').hasClass('active')) {
			$('#DeviceVideoTable').dataTable()._fnAjaxUpdate();
		} else if ($('#portlet_tab2').hasClass('active')) {
			$('#DeviceImageTable').dataTable()._fnAjaxUpdate();
		}
	});			

}

