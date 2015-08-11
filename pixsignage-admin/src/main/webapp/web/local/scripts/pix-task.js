var myurls = {
	'common.list' : 'task!list.action',
	'schedule.listbytask' : 'schedule!listbytask.action',
	'schedulefile.list' : 'schedulefile!list.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

function initMyTable() {
	var oTable = $('#MyTable').dataTable({
		'sDom' : "<'row'<'col-md-6 col-sm-12'l><'col-md-12 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", //default layout without horizontal scroll(remove this setting to enable horizontal scroll for the table)
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [ {"sTitle" : "名称", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "类型", "mData" : "type", "bSortable" : false }, 
						{"sTitle" : "开始时间", "mData" : "fromdate", "bSortable" : false }, 
						{"sTitle" : "结束时间", "mData" : "todate", "bSortable" : false }, 
						{"sTitle" : "视频总量", "mData" : "filesize", "bSortable" : false }, 
						{"sTitle" : "创建者", "mData" : "createstaff.name", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "taskid", "bSortable" : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var data = $('#MyTable').dataTable().fnGetData(iDisplayIndex);
			if (data['type'] == 1) {
				$('td:eq(1)', nRow).html('<span class="label label-sm label-info">排期任务</span>');
			} else if (data['type'] == 2) {
				$('td:eq(1)', nRow).html('<span class="label label-sm label-success">即时任务</span>');
			}
			var filesize = parseInt(data['filesize'] / 1024);
			$('td:eq(4)', nRow).html(transferIntToComma(filesize) + ' KB');
			/*
			var dropdownBtn = '<div class="btn-group">';
			dropdownBtn += '<a class="btn default btn-sm blue" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">操作  <i class="fa fa-angle-down"></i></a>';
			dropdownBtn += '<ul class="dropdown-menu pull-right">';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-detail"><i class="fa fa-pencil"></i> 明细</a></li>';
			dropdownBtn += '</ul></div>';*/
			
			var dropdownBtn = '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-sm blue pix-detail"><i class="fa fa-list-ul"></i>&nbsp;&nbsp;明细</a>';
			$('td:eq(6)', nRow).html(dropdownBtn);
			return nRow;
		}
	});

    jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
    jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
    jQuery('#MyTable_wrapper .dataTables_length select').select2();
    
}

function initScheduleModal() {
	var currentTask;
	var currentTaskid = 0;
	var currentScheduleid = 0;

	$('body').on('click', '.pix-detail', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		currentTask = item;
		currentTaskid = item.taskid;
		currentScheduleid = 0;
		
		$('#ScheduleTable').dataTable()._fnAjaxUpdate();
		$('#SchedulefileTable').dataTable()._fnAjaxUpdate();
		$('#ScheduleModal').modal();
	});
	
	$('#ScheduleTable').dataTable({
		"sDom" : "<'row'<'col-md-6 col-sm-12'l>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", 
		"aLengthMenu" : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		"bProcessing" : true,
		"bServerSide" : true,
		"sAjaxSource" : myurls['schedule.listbytask'],
		'aoColumns' : [ {"sTitle" : "终端", "mData" : "device.name", "bSortable" : false }, 
						{"sTitle" : "类型", "mData" : "type", "bSortable" : false }, 
						//{"sTitle" : "起止时间", "mData" : "device.deviceid", "bSortable" : false }, 
						{"sTitle" : "视频总量", "mData" : "device.deviceid", "bSortable" : false }, 
						{"sTitle" : "已下载", "mData" : "device.deviceid", "bSortable" : false }, 
						{"sTitle" : "待下载", "mData" : "device.deviceid", "bSortable" : false }, 
						{"sTitle" : "开始下载时间", "mData" : "device.deviceid", "bSortable" : false }, 
						{"sTitle" : "剩余估算时间", "mData" : "device.deviceid", "bSortable" : false }, 
						{"sTitle" : "同步", "mData" : "syncstatus", "bSortable" : false }, 
						{"sTitle" : "状态", "mData" : "status", "bSortable" : false }],
		"iDisplayLength" : 10,
		"sPaginationType" : "bootstrap",
		"oLanguage" : DataTableLanguage,
		"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
			if (aData['type'] == 1) {
				$('td:eq(1)', nRow).html('<span class="label label-sm label-info">排期计划</span>');
			} else if (aData['type'] == 2) {
				$('td:eq(1)', nRow).html('<span class="label label-sm label-success">即时计划</span>');
			}
			//$('td:eq(2)', nRow).html(aData['fromdate'] + '～' + aData['todate']);
			$('td:eq(2)', nRow).html(transferIntToComma(parseInt(aData['filesize'] / 1024)) + ' KB');
			$('td:eq(3)', nRow).html(transferIntToComma(parseInt(aData['filesizecomplete'] / 1024)) + ' KB');
			var filesizeuncomplete = aData['filesize'] - aData['filesizecomplete'];
			$('td:eq(4)', nRow).html(transferIntToComma(parseInt( filesizeuncomplete / 1024)) + ' KB');
			if (aData['syncstarttime'] == null) {
				$('td:eq(5)', nRow).html('--');
			} else {
				$('td:eq(5)', nRow).html(aData['syncstarttime']);
			}
			if (aData.device.rate > 0) {
				var time = parseInt(filesizeuncomplete / aData.device.rate);
				$('td:eq(6)', nRow).html(''+ transferIntToTime(time));
			} else {
				$('td:eq(6)', nRow).html('--');
			}
			if (aData['syncstatus'] == 0) {
				$('td:eq(7)', nRow).html('<span class="label label-sm label-warning">待同步</span>');
			} else if (aData['syncstatus'] == 1) {
				$('td:eq(7)', nRow).html('<span class="label label-sm label-info">同步中</span>');
			} else if (aData['syncstatus'] == 2) {
				$('td:eq(7)', nRow).html('<span class="label label-sm label-success">已同步</span>');
			}
			if (aData['status'] == 0) {
				$('td:eq(8)', nRow).html('<span class="label label-sm label-default">失效</span>');
			} else if (aData['status'] == 1) {
				$('td:eq(8)', nRow).html('<span class="label label-sm label-success">有效</span>');
			}
			
			return nRow;
		},
		'fnServerParams': function(aoData) { 
	        aoData.push({'name':'taskid','value':currentTaskid });
	    }, 
	    'fnServerData': function ( sSource, aoData, fnCallback, oSettings ) {
	    	$.getJSON( sSource, aoData, function (json) {
	    		fnCallback(json);
	    		$('#ScheduleTable tbody tr:first').trigger('click');
	    	});
	    }
	});

    $('#ScheduleTable').on( 'click', 'tbody tr', function () {
        if (!$(this).hasClass('active')) {
        	$('#ScheduleTable tr.active').removeClass('active');
            $(this).addClass('active');
        }
        if ($('#ScheduleTable').dataTable().fnGetData(this) != null) {
            currentScheduleid = $('#ScheduleTable').dataTable().fnGetData(this)['scheduleid'];
            $('#SchedulefileTable').dataTable()._fnAjaxUpdate();
        }
    });
	
	$('#SchedulefileTable').dataTable({
		"sDom" : "<'row'<'col-md-6 col-sm-12'l>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", 
		"aLengthMenu" : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		"bProcessing" : true,
		"bServerSide" : true,
		"sAjaxSource" : myurls['schedulefile.list'],
		'aoColumns' : [ {"sTitle" : "类型", "mData" : "filetype", "bSortable" : false }, 
						{"sTitle" : "编号", "mData" : "fileid", "bSortable" : false }, 
						{"sTitle" : "文件名", "mData" : "filename", "bSortable" : false }, 
						{"sTitle" : "大小", "mData" : "filesize", "bSortable" : false }, 
						{"sTitle" : "进度", "mData" : "complete", "bSortable" : false }],
		"iDisplayLength" : 10,
		"sPaginationType" : "bootstrap",
		"oLanguage" : DataTableLanguage,
		"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
			if (aData['filetype'] == 0) {
				$('td:eq(0)', nRow).html('布局');
			} else if (aData['filetype'] == 1) {
				$('td:eq(0)', nRow).html('图片');
			} else if (aData['filetype'] == 2) {
				$('td:eq(0)', nRow).html('视频');
			} else if (aData['filetype'] == 3) {
				$('td:eq(0)', nRow).html('影片');
			} else if (aData['filetype'] == 4) {
				$('td:eq(0)', nRow).html('广告');
			}
			
			$('td:eq(3)', nRow).html(transferIntToComma(aData['filesize']));

			if (aData['complete'] == 0) {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-danger">' + aData['complete'] + '%</span>');
			} else if (aData['complete'] == 100) {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-success">' + aData['complete'] + '%</span>');
			} else {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-warning">' + aData['complete'] + '%</span>');
			}
			return nRow;
		},
		'fnServerParams': function(aoData) { 
	        aoData.push({'name':'scheduleid','value':currentScheduleid });
	    } 
	});

}
