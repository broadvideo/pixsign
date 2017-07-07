var CurrentBindtype = 1; //1: Device 2:Devicegroup
var CurrentBind;
var CurrentBindid;

var CurrentSchedules;
var CurrentSchedule;
var CurrentScheduledtls;

var timestamp = new Date().getTime();

function refreshMyTable() {
	$('#DeviceTable').dataTable()._fnAjaxUpdate();
	$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
}			

$('#DevicegroupNav').click(function(event) {
	CurrentBindtype = 2;
	$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
});
$('#DeviceNav').click(function(event) {
	CurrentBindtype = 1;
	$('#DeviceTable').dataTable()._fnAjaxUpdate();
});

$('#DeviceTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 10, 25, 50, 100 ],
					[ 10, 25, 50, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'device!list.action',
	'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'terminalid', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : common.view.onlineflag, 'mData' : 'onlineflag', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : common.view.schedule, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '60%' }, 
					{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '10%' }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		if (aData.name != aData.terminalid) {
			$('td:eq(0)', nRow).html(aData.name + '(' + aData.terminalid + ')');
		}
		if (aData.status == 0) {
			$('td:eq(1)', nRow).html('<span class="label label-sm label-default">' + common.view.unregister + '</span>');
		} else if (aData.onlineflag == 9) {
			$('td:eq(1)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
		} else if (aData.onlineflag == 1) {
			$('td:eq(1)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
		} else if (aData.onlineflag == 0) {
			$('td:eq(1)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
		}
		
		var schedulehtml = '';
		if (aData.schedules.length > 0) {
			for (var i=0; i<aData.schedules.length; i++) {
				var schedule = aData.schedules[i];
				schedulehtml += '<div class="row">';
				schedulehtml += '<div class="col-md-2 col-xs-2">';
				schedulehtml += '<h3>' + schedule.starttime.substring(0,5) + ' </h3>';
				schedulehtml += '</div>';
				schedulehtml += '<div class="col-md-10 col-xs-10">';
				for (var j=0; j<schedule.scheduledtls.length; j++) {
					var scheduledtl = schedule.scheduledtls[j];
					if (j % 4 == 0) {
						schedulehtml += '<div class="row" >';
					}
					schedulehtml += '<div class="col-md-3 col-xs-3">';
					schedulehtml += '<a href="javascript:;" objtype="' + scheduledtl.objtype + '" objid="' + scheduledtl.objid + '" class="fancybox">';
					schedulehtml += '<div class="thumbs">';
					if (scheduledtl.objtype == 1 && scheduledtl.bundle.snapshot != null) {
						var thumbwidth = scheduledtl.bundle.width > scheduledtl.bundle.height? 100 : 100*scheduledtl.bundle.width/scheduledtl.bundle.height;
						schedulehtml += '<img src="/pixsigdata' + scheduledtl.bundle.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" />';
					} else {
						schedulehtml += '<img src="/pixsignage/img/blank.png" class="imgthumb" width="100%" />';
					}
					schedulehtml += '</div>';
					schedulehtml += '</a>';
					if (scheduledtl.objtype == 1) {
						schedulehtml += '<h6 class="pixtitle">' + scheduledtl.bundle.name + '</h6>';
					}
					schedulehtml += '</div>';
					if ((j+1) % 4 == 0 || (j+1) == schedule.scheduledtls.length) {
						schedulehtml += '</div>';
					}
				}
				schedulehtml += '</div>';
				schedulehtml += '</div>';
			}
		} else {
			schedulehtml = '';
		}
		$('td:eq(2)', nRow).html(schedulehtml);
		
		$('td:eq(3)', nRow).html('<a href="javascript:;" privilegeid="101010" deviceid="' + aData.deviceid + '" class="btn default btn-xs blue pix-schedule"><i class="fa fa-calendar-o"></i> ' + common.view.schedule + '</a>');
		$('td:eq(4)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>');

		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#DeviceTable .thumbs').each(function(i) {
			$(this).width($(this).parent().closest('div').width());
			$(this).height($(this).parent().closest('div').width());
		});
		refreshFancybox();
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurBranchid });
		aoData.push({'name':'devicegroupid','value':0 });
	}
});
$('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
$('#DeviceTable_wrapper .dataTables_length select').select2();
$('#DeviceTable').css('width', '100%');

$('#DevicegroupTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 10, 25, 50, 100 ],
					[ 10, 25, 50, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'devicegroup!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : common.view.detail, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '25%' },
					{'sTitle' : common.view.schedule, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '55%' }, 
					{'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '5%' }, 
					{'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '5%' }],
	'iDisplayLength' : 20,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		//$('td:eq(1)', nRow).html('<div id="DevicegroupDiv-'+ aData.devicegroupid + '"></div>');
		var listhtml = '';
		for (var i=0; i<aData.devices.length; i++) {
			listhtml += aData.devices[i].name + ' ';
		}
		$('td:eq(1)', nRow).html(listhtml);
		
		var schedulehtml = '';
		if (aData.schedules.length > 0) {
			for (var i=0; i<aData.schedules.length; i++) {
				var schedule = aData.schedules[i];
				schedulehtml += '<div class="row">';
				schedulehtml += '<div class="col-md-2 col-xs-2">';
				schedulehtml += '<h3>' + schedule.starttime.substring(0,5) + ' </h3>';
				schedulehtml += '</div>';
				schedulehtml += '<div class="col-md-10 col-xs-10">';
				for (var j=0; j<schedule.scheduledtls.length; j++) {
					var scheduledtl = schedule.scheduledtls[j];
					if (j % 4 == 0) {
						schedulehtml += '<div class="row" >';
					}
					schedulehtml += '<div class="col-md-3 col-xs-3">';
					schedulehtml += '<a href="javascript:;" objtype="' + scheduledtl.objtype + '" objid="' + scheduledtl.objid + '" class="fancybox">';
					schedulehtml += '<div class="thumbs">';
					if (scheduledtl.objtype == 1 && scheduledtl.bundle.snapshot != null) {
						var thumbwidth = scheduledtl.bundle.width > scheduledtl.bundle.height? 100 : 100*scheduledtl.bundle.width/scheduledtl.bundle.height;
						schedulehtml += '<img src="/pixsigdata' + scheduledtl.bundle.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" />';
					} else {
						schedulehtml += '<img src="/pixsignage/img/blank.png" class="imgthumb" width="100%" />';
					}
					schedulehtml += '</div>';
					schedulehtml += '</a>';
					if (scheduledtl.objtype == 1) {
						schedulehtml += '<h6 class="pixtitle">' + scheduledtl.bundle.name + '</h6>';
					}
					schedulehtml += '</div>';
					if ((j+1) % 4 == 0 || (j+1) == schedule.scheduledtls.length) {
						schedulehtml += '</div>';
					}
				}
				schedulehtml += '</div>';
				schedulehtml += '</div>';
			}
		} else {
			schedulehtml = '';
		}
		$('td:eq(2)', nRow).html(schedulehtml);
				
		$('td:eq(3)', nRow).html('<a href="javascript:;" privilegeid="101010" devicegroupid="' + aData.devicegroupid + '" class="btn default btn-xs blue pix-schedule"><i class="fa fa-calendar-o"></i> ' + common.view.schedule + '</a>');
		$('td:eq(4)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>');

		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#DevicegroupTable .thumbs').each(function(i) {
			$(this).height($(this).parent().closest('div').width());
		});

		refreshFancybox();
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurBranchid });
		aoData.push({'name':'type','value':1 });
	}
});
$('#DevicegroupTable_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#DevicegroupTable_wrapper .dataTables_length select').addClass('form-control input-small');
$('#DevicegroupTable_wrapper .dataTables_length select').select2();
$('#DevicegroupTable').css('width', '100%');


$('body').on('click', '.pix-sync', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	var url, data;
	if (CurrentBindtype == 1) {
		CurrentBind = $('#DeviceTable').dataTable().fnGetData(index);
		url = 'device!sync.action';
		data = { deviceid: CurrentBind.deviceid };
	} else if (CurrentBindtype == 2) {
		CurrentBind = $('#DevicegroupTable').dataTable().fnGetData(index);
		url = 'devicegroup!sync.action';
		data = { devicegroupid: CurrentBind.devicegroupid };
	}
	bootbox.confirm(common.tips.sync + CurrentBind.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'GET',
				url : url,
				cache: false,
				data : data,
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				beforeSend: function ( xhr ) {
					Metronic.startPageLoading({animate: true});
				},
				success : function(data, status) {
					Metronic.stopPageLoading();
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					Metronic.stopPageLoading();
					console.log('failue');
				}
			});				
		}
	});
});


//Schedule Edit
function refreshScheduleDetail() {
	$('#ScheduleDetail').empty();
	if (CurrentSchedules.length > 0) {
		var scheduleTabHtml = '<h3></h3><ul class="timeline">';
		for (var i=0; i<CurrentSchedules.length; i++) {
			var schedule = CurrentSchedules[i];
			scheduleTabHtml += '<li class="timeline-grey">';
			scheduleTabHtml += '<div class="timeline-time">';
			scheduleTabHtml += '<span class="time">' + schedule.starttime.substring(0,5) + ' </span>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '<div class="timeline-icon"><i class="fa fa-video-camera"></i></div>';
			scheduleTabHtml += '<div class="timeline-body">';
			scheduleTabHtml += '<div class="timeline-content">';
			scheduleTabHtml += '<div class="row"><div class="col-md-10 col-sm-10">';
			for (var j=0; j<schedule.scheduledtls.length; j++) {
				var scheduledtl = schedule.scheduledtls[j];
				if (j % 6 == 0) {
					scheduleTabHtml += '<div class="row" >';
				}
				scheduleTabHtml += '<div class="col-md-2 col-xs-2">';
				scheduleTabHtml += '<div class="thumbs">';
				if (scheduledtl.objtype == 1 && scheduledtl.bundle.snapshot != null) {
					var thumbwidth = scheduledtl.bundle.width > scheduledtl.bundle.height? 100 : 100*scheduledtl.bundle.width/scheduledtl.bundle.height;
					scheduleTabHtml += '<img src="/pixsigdata' + scheduledtl.bundle.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" />';
				} else {
					scheduleTabHtml += '<img src="/pixsignage/img/blank.png" class="imgthumb" width="100%" />';
				}
				scheduleTabHtml += '</div>';
				if (scheduledtl.objtype == 1) {
					scheduleTabHtml += '<h6 class="pixtitle">' + scheduledtl.bundle.name + '</h6>';
				}
				scheduleTabHtml += '</div>';
				if ((j+1) % 6 == 0 || (j+1) == schedule.scheduledtls.length) {
					scheduleTabHtml += '</div>';
				}
			}
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '<div class="col-md-2 col-sm-2">';
			scheduleTabHtml += '<a href="javascript:;" class="btn btn-sm green pull-right pix-edit-scheduledtl" data-id="'+ i + '">' + common.view.edit + '<i class="fa fa-plus"></i></a>';
			scheduleTabHtml += '<a href="javascript:;" class="btn btn-sm red pull-right pix-del-schedule" data-id="'+ i + '">' + common.view.remove + '<i class="fa fa-trash-o"></i></a>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '</li>';
		}
		scheduleTabHtml += '</ul>';
	} else {
		var scheduleTabHtml = '<h3>' + common.tips.schedule_zero + '</h3>';
	}
	$('#ScheduleDetail').html(scheduleTabHtml);
	$('#ScheduleDetail .thumbs').each(function(i) {
		$(this).height($(this).parent().width());
	});
}

function refreshMediaTable() {
	$('#BundleTable').dataTable()._fnAjaxUpdate();
}

//Bundle table初始化
$('#BundleTable thead').css('display', 'none');
$('#BundleTable tbody').css('display', 'none');	
var bundlehtml = '';
$('#BundleTable').dataTable({
	'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 12, 30, 48, 96 ],
					  [ 12, 30, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'bundle!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'bundleid', 'bSortable' : false }],
	'iDisplayLength' : 12,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#BundleContainer').length < 1) {
			$('#BundleTable').append('<div id="BundleContainer"></div>');
		}
		$('#BundleContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 6 == 0) {
			bundlehtml = '';
			bundlehtml += '<div class="row" >';
		}
		bundlehtml += '<div class="col-md-2 col-xs-2">';
		
		bundlehtml += '<div id="ThumbContainer" style="position:relative">';
		bundlehtml += '<div id="BundleThumb" class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			bundlehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		} else {
			bundlehtml += '<img src="/pixsignage/img/blank.png" class="imgthumb" width="100%" />';
		}
		bundlehtml += '<div class="mask">';
		bundlehtml += '<div>';
		bundlehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
		bundlehtml += '<a class="btn default btn-sm green pix-scheduledtl-bundle-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
		bundlehtml += '</div>';
		bundlehtml += '</div>';
		bundlehtml += '</div>';

		bundlehtml += '</div>';

		bundlehtml += '</div>';
		if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#BundleTable').dataTable().fnGetData().length) {
			bundlehtml += '</div>';
			if ((iDisplayIndex+1) != $('#BundleTable').dataTable().fnGetData().length) {
				bundlehtml += '<hr/>';
			}
			$('#BundleContainer').append(bundlehtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#BundleContainer .thumbs').each(function(i) {
			$(this).width($(this).parent().width());
			$(this).height($(this).parent().width());
		});
		$('#BundleContainer .mask').each(function(i) {
			$(this).width($(this).parent().parent().width() + 2);
			$(this).height($(this).parent().parent().width() + 2);
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'touchflag','value':'0' });
	}
});
$('#BundleTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
$('#BundleTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
$('#BundleTable').css('width', '100%');

//Touchbundle table初始化
$('#TouchbundleTable thead').css('display', 'none');
$('#TouchbundleTable tbody').css('display', 'none');	
var touchbundlehtml = '';
$('#TouchbundleTable').dataTable({
	'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 12, 30, 48, 96 ],
					  [ 12, 30, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'bundle!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'bundleid', 'bSortable' : false }],
	'iDisplayLength' : 12,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#TouchbundleContainer').length < 1) {
			$('#TouchbundleTable').append('<div id="TouchbundleContainer"></div>');
		}
		$('#TouchbundleContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 6 == 0) {
			touchbundlehtml = '';
			touchbundlehtml += '<div class="row" >';
		}
		touchbundlehtml += '<div class="col-md-2 col-xs-2">';
		
		touchbundlehtml += '<div id="ThumbContainer" style="position:relative">';
		touchbundlehtml += '<div id="TouchbundleThumb" class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			touchbundlehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		} else {
			touchbundlehtml += '<img src="/pixsignage/img/blank.png" class="imgthumb" width="100%" />';
		}
		touchbundlehtml += '<div class="mask">';
		touchbundlehtml += '<div>';
		touchbundlehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
		touchbundlehtml += '<a class="btn default btn-sm green pix-scheduledtl-touchbundle-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
		touchbundlehtml += '</div>';
		touchbundlehtml += '</div>';
		touchbundlehtml += '</div>';

		touchbundlehtml += '</div>';

		touchbundlehtml += '</div>';
		if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#TouchbundleTable').dataTable().fnGetData().length) {
			touchbundlehtml += '</div>';
			if ((iDisplayIndex+1) != $('#TouchbundleTable').dataTable().fnGetData().length) {
				touchbundlehtml += '<hr/>';
			}
			$('#TouchbundleContainer').append(touchbundlehtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#TouchbundleContainer .thumbs').each(function(i) {
			$(this).height($(this).parent().width());
		});
		$('#TouchbundleContainer .mask').each(function(i) {
			$(this).height($(this).parent().parent().width() + 2);
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'touchflag','value':'1' });
		aoData.push({'name':'homeflag','value':'1' });
	}
});
$('#TouchbundleTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
$('#TouchbundleTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
$('#TouchbundleTable').css('width', '100%');

$('#nav_tab1').click(function(event) {
	$('#BundleDiv').css('display', '');
	$('#TouchbundleDiv').css('display', 'none');
	$('#BundleTable').dataTable()._fnAjaxUpdate();
});
$('#nav_tab2').click(function(event) {
	$('#BundleDiv').css('display', 'none');
	$('#TouchbundleDiv').css('display', '');
	$('#TouchbundleTable').dataTable()._fnAjaxUpdate();
});

function refreshSelectedTable() {
	var selectedTableHtml = '';
	selectedTableHtml += '<tr>';
	for (var i=0; i<CurrentScheduledtls.length; i++) {
		var scheduledtl = CurrentScheduledtls[i];
		var name = '';
		if (scheduledtl.objtype == 1) {
			name = scheduledtl.bundle.name;
		}
		selectedTableHtml += '<td style="padding: 0px 10px 0px 0px;" width="' + (100/CurrentScheduledtls.length) + '%"><div class="thumbs" style="width:100px; height:100px;">';
		if (scheduledtl.objtype == 1 && scheduledtl.bundle.snapshot != null) {
			var thumbwidth = scheduledtl.bundle.width > scheduledtl.bundle.height? 100 : 100*scheduledtl.bundle.width/scheduledtl.bundle.height;
			selectedTableHtml += '<img src="/pixsigdata' + scheduledtl.bundle.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" />';
		} else {
			selectedTableHtml += '<img src="/pixsignage/img/blank.png" class="imgthumb" width="100%" />';
		}
		selectedTableHtml += '<div class="mask">';
		selectedTableHtml += '<div>';
		selectedTableHtml += '<h6 class="pixtitle" style="color:white;">' + name + '</h6>';
		selectedTableHtml += '<a href="javascript:;" class="btn default btn-sm red pix-scheduledtl-del" index="' + i + '"><i class="fa fa-trash-o"></i></a>';
		selectedTableHtml += '</div>';
		selectedTableHtml += '</div>';
		selectedTableHtml += '</div></td>';
	}
	selectedTableHtml += '</tr>';
	selectedTableHtml += '<tr>';
	for (var i=0; i<CurrentScheduledtls.length; i++) {
		var scheduledtl = CurrentScheduledtls[i];
		selectedTableHtml += '<td>';
		if (scheduledtl.objtype == 1 && scheduledtl.bundle.touchflag == 0) {
			selectedTableHtml += '<h6 class="pixtitle">' + common.view.bundle + '</h6>';
		} else if (scheduledtl.objtype == 1 && scheduledtl.bundle.touchflag == 1) {
			selectedTableHtml += '<h6 class="pixtitle">' + common.view.touchbundle + '</h6>';
		}
		selectedTableHtml += '</div></td>';
	}
	selectedTableHtml += '</tr>';
	$('#SelectedTable').html(selectedTableHtml);
	$('#SelectedTable').width(110 * CurrentScheduledtls.length);
	$('#SelectedTable .mask').each(function(i) {
		$(this).width($(this).parent().width() + 2);
		$(this).height($(this).parent().width() + 2);
	});
}

$('body').on('click', '.pix-schedule', function(event) {
	if (CurrentBindtype == 1) {
		CurrentBindid = $(event.target).attr('deviceid');
		if (CurrentBindid == undefined) {
			CurrentBindid = $(event.target).parent().attr('deviceid');
		}
		$.ajax({
			type : 'GET',
			url : 'device!get.action',
			data : {deviceid: CurrentBindid},
			success : function(data, status) {
				if (data.errorcode == 0) {
					CurrentBind = data.device;
					CurrentSchedules = CurrentBind.schedules;
					$('.schedule-edit').css('display', 'none');
					$('.schedule-add').css('display', 'none');
					$('.schedule-view').css('display', 'block');
					$('.touch-ctrl').css('display', TouchCtrl?'':'none');
					refreshScheduleDetail();
					$('#ScheduleModal').modal();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	} else if (CurrentBindtype == 2) {
		CurrentBindid = $(event.target).attr('devicegroupid');
		if (CurrentBindid == undefined) {
			CurrentBindid = $(event.target).parent().attr('devicegroupid');
		}
		$.ajax({
			type : 'GET',
			url : 'devicegroup!get.action',
			data : {devicegroupid: CurrentBindid},
			success : function(data, status) {
				if (data.errorcode == 0) {
					CurrentBind = data.devicegroup;
					CurrentSchedules = CurrentBind.schedules;
					$('.schedule-edit').css('display', 'none');
					$('.schedule-add').css('display', 'none');
					$('.schedule-view').css('display', 'block');				
					$('.touch-ctrl').css('display', TouchCtrl?'':'none');
					refreshScheduleDetail();
					$('#ScheduleModal').modal();
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
$('#ScheduleModal').on('shown.bs.modal', function (e) {
	$('#ScheduleDetail .thumbs').each(function(i) {
		$(this).height($(this).parent().width());
		$(this).find('.mask').height($(this).parent().width() + 2);
	});
})

$('body').on('click', '.pix-add-schedule', function(event) {
	$('.schedule-edit').css('display', 'block');
	$('.schedule-add').css('display', 'block');
	$('.schedule-view').css('display', 'none');				
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	$('#ScheduleForm input[name="starttime"]').attr('value', '');
	CurrentSchedule = {};
	CurrentSchedule.scheduleid = 'B' + Math.round(Math.random()*100000000);
	CurrentSchedule.scheduletype = 2;
	CurrentSchedule.bindtype = CurrentBindtype;
	CurrentSchedule.bindid = CurrentBindid;
	CurrentScheduledtls = [];
	refreshMediaTable();
	refreshSelectedTable();
});

$('body').on('click', '.pix-edit-scheduledtl', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentSchedule = CurrentSchedules[index];
	CurrentScheduledtls = CurrentSchedule.scheduledtls.slice(0);
	
	$('.schedule-edit').css('display', 'block');
	$('.schedule-add').css('display', 'none');
	$('.schedule-view').css('display', 'none');				
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	$('#ScheduleForm input[name="starttime"]').attr('value', CurrentSchedule.starttime);
	refreshMediaTable();
	refreshSelectedTable();
});

$('body').on('click', '.pix-del-schedule', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentSchedules.splice(index, 1);
	refreshScheduleDetail();
});


FormValidateOption.rules = {};
FormValidateOption.rules['starttime'] = {};
FormValidateOption.rules['starttime']['required'] = true;
$('#ScheduleForm').validate(FormValidateOption);
$.extend($('#ScheduleForm').validate().settings, {
	rules: FormValidateOption.rules
});
$('#ScheduleForm .pix-ok').on('click', function(event) {
	if ($('#ScheduleForm').valid()) {
		$('.schedule-edit').css('display', 'none');
		$('.schedule-add').css('display', 'none');
		$('.schedule-view').css('display', 'block');
		
		var starttime = $('#ScheduleForm input[name=starttime]').val();
		var schedules = CurrentSchedules.filter(function (el) {
			return (el.starttime == starttime);
		});
		if (schedules.length > 0) {
			schedules[0].playmode = $('#ScheduleForm input[name=playmode]:checked').attr("value");
			schedules[0].scheduledtls = CurrentScheduledtls;
		} else {
			var schedule = {};
			schedule.scheduleid = 'B' + Math.round(Math.random()*100000000);
			schedule.scheduletype = 1;
			schedule.bindtype = CurrentBindtype;
			schedule.bindid = CurrentBindid;
			schedule.playmode = $('#ScheduleForm input[name=playmode]:checked').attr("value");
			schedule.starttime = $('#ScheduleForm input[name=starttime]').val();
			schedule.scheduledtls = CurrentScheduledtls;
			CurrentSchedules.push(schedule);
		}
		
		CurrentSchedules.sort(function(a, b) {
			return (a.starttime > b.starttime);
		});
		refreshScheduleDetail();
	}
});
$('#ScheduleForm .pix-cancel').on('click', function(event) {
	$('.schedule-edit').css('display', 'none');
	$('.schedule-add').css('display', 'none');
	$('.schedule-view').css('display', 'block');				
});

//增加Bundle到SelectedTable
$('body').on('click', '.pix-scheduledtl-bundle-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#BundleTable').dataTable().fnGetData(rowIndex);
	var scheduledtl = {};
	scheduledtl.scheduledtlid = 'D' + Math.round(Math.random()*100000000);
	scheduledtl.scheduleid = CurrentSchedule.scheduleid;
	scheduledtl.objtype = 1;
	scheduledtl.objid = data.bundleid;
	scheduledtl.bundle = data;
	scheduledtl.sequence = CurrentScheduledtls.length + 1;
	CurrentScheduledtls.push(scheduledtl);
	refreshSelectedTable();
});
//增加Touchbundle到SelectedTable
$('body').on('click', '.pix-scheduledtl-touchbundle-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#TouchbundleTable').dataTable().fnGetData(rowIndex);
	var scheduledtl = {};
	scheduledtl.scheduledtlid = 'D' + Math.round(Math.random()*100000000);
	scheduledtl.scheduleid = CurrentSchedule.scheduleid;
	scheduledtl.objtype = 1;
	scheduledtl.objid = data.bundleid;
	scheduledtl.bundle = data;
	scheduledtl.sequence = CurrentScheduledtls.length + 1;
	CurrentScheduledtls.push(scheduledtl);
	refreshSelectedTable();
});

//删除SelectedTable
$('body').on('click', '.pix-scheduledtl-del', function(event) {
	var index = $(event.target).attr('index');
	if (index == undefined) {
		index = $(event.target).parent().attr('index');
	}
	for (var i=index; i<CurrentScheduledtls.length; i++) {
		CurrentScheduledtls[i].sequence = i;
	}
	CurrentScheduledtls.splice(index, 1);
	refreshSelectedTable();
});

$('[type=submit]', $('#ScheduleModal')).on('click', function(event) {
	for (var i=0; i<CurrentSchedules.length; i++) {
		var schedule = CurrentSchedules[i];
		if (i == CurrentSchedules.length - 1) {
			schedule.endtime = CurrentSchedules[0].starttime;
		} else {
			schedule.endtime = CurrentSchedules[i+1].starttime;
		}
		if (('' + schedule.scheduleid).indexOf('B') == 0) {
			schedule.scheduleid = '0';
		}
		for (var j=0; j<schedule.scheduledtls.length; j++) {
			var scheduledtl = schedule.scheduledtls[j];
			scheduledtl.bundle = undefined;
			if (('' + scheduledtl.scheduleid).indexOf('B') == 0) {
				scheduledtl.scheduleid = '0';
			}
			if (('' + scheduledtl.scheduledtlid).indexOf('D') == 0) {
				scheduledtl.scheduledtlid = '0';
			}
		}
	}
	var data = {
		scheduletype: 1,
		bindtype: CurrentBindtype,
		bindid: CurrentBindid,
		schedules: CurrentSchedules
	};
	$.ajax({
		type : 'POST',
		url : 'schedule!batch.action',
		data : $.toJSON(data),
		dataType : 'json',
		contentType : 'application/json;charset=utf-8',
		beforeSend: function ( xhr ) {
			Metronic.startPageLoading({animate: true});
		},
		success : function(data, status) {
			Metronic.stopPageLoading();
			$('#ScheduleModal').modal('hide');
			if (data.errorcode == 0) {
				bootbox.alert(common.tips.success);
				$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
				$('#DeviceTable').dataTable()._fnAjaxUpdate();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			$('#ScheduleModal').modal('hide');
			console.log('failue');
		}
	});

	event.preventDefault();
});	


function refreshFancybox() {
	$('.fancybox').each(function(index,item) {
		$(this).click(function() {
			var objtype = $(this).attr('objtype');
			var objid = $(this).attr('objid');
			if (objtype == 1) {
				$.ajax({
					type : 'GET',
					url : 'bundle!get.action',
					data : {bundleid: objid},
					success : function(data, status) {
						if (data.errorcode == 0) {
							$.fancybox({
								openEffect	: 'none',
								closeEffect	: 'none',
								closeBtn : false,
						        padding : 0,
						        content: '<div id="BundlePreview"></div>',
						    });
							redrawBundlePreview($('#BundlePreview'), data.bundle, 800, 1);
						} else {
							bootbox.alert(common.tips.error + data.errormsg);
						}
					},
					error : function() {
						console.log('failue');
					}
				});
			}
			return false;
		})
	});
}


$('.form_time').datetimepicker({
	autoclose: true,
	isRTL: Metronic.isRTL(),
	format: 'hh:ii:ss',
	pickerPosition: (Metronic.isRTL() ? 'bottom-right' : 'bottom-left'),
	language: 'zh-CN',
	minuteStep: 5,
	startView: 1,
	maxView: 1,
	formatViewType: 'time'
});
