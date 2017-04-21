var CurrentBindtype = 3; //2: Devicegroup 3: Devicegrid
var CurrentBind;
var CurrentBindid;

var CurrentSchedules;
var CurrentSchedule;
var CurrentScheduledtls;

var CurrentMediaBranchid;
var CurrentMediaFolderid;

function refreshDevicegridTable() {
	$('#DevicegridTable').dataTable()._fnAjaxUpdate();
}			
function refreshDevicegridgroupTable() {
	$('#DevicegridgroupTable').dataTable()._fnAjaxUpdate();
}			

$('#DevicegridgroupNav').click(function(event) {
	CurrentBindtype = 2;
	refreshDevicegridgroupTable();
});
$('#DevicegridNav').click(function(event) {
	CurrentBindtype = 3;
	refreshDevicegridTable();
});

$('#DevicegridTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 10, 25, 50, 100 ],
					[ 10, 25, 50, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'devicegrid!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : common.view.detail, 'mData' : 'devicegridid', 'bSortable' : false, 'sWidth' : '15%' },
					{'sTitle' : common.view.schedule, 'mData' : 'devicegridid', 'bSortable' : false, 'sWidth' : '65%' }, 
					{'sTitle' : '', 'mData' : 'devicegridid', 'bSortable' : false, 'sWidth' : '5%' }, 
					{'sTitle' : '', 'mData' : 'devicegridid', 'bSortable' : false, 'sWidth' : '5%' }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(1)', nRow).html('<div id="DevicegridDiv-'+ aData.devicegridid + '"></div>');
		
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
					var name;
					var thumbwidth;
					if (j % 4 == 0) {
						schedulehtml += '<div class="row" >';
					}
					schedulehtml += '<div class="col-md-3 col-xs-3">';

					schedulehtml += '<a href="javascript:;" data-index="' + iDisplayIndex + '" schedule-index="' + i + '" scheduledtl-index="' + j + '" class="fancybox">';
					schedulehtml += '<div class="thumbs">';

					if (scheduledtl.objtype == 2) {
						name = scheduledtl.page.name;
						thumbwidth = scheduledtl.page.width > scheduledtl.page.height? 100 : 100*scheduledtl.page.width/scheduledtl.page.height;
						schedulehtml += '<img src="/pixsigdata' + scheduledtl.page.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
					} else if (scheduledtl.objtype == 3) {
						name = scheduledtl.video.name;
						thumbwidth = scheduledtl.video.width > scheduledtl.video.height? 100 : 100*scheduledtl.video.width/scheduledtl.video.height;
						schedulehtml += '<img src="/pixsigdata' + scheduledtl.video.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" />';
					} else if (scheduledtl.objtype == 4) {
						name = scheduledtl.image.name;
						thumbwidth = scheduledtl.image.width > scheduledtl.image.height? 100 : 100*scheduledtl.image.width/scheduledtl.image.height;
						schedulehtml += '<img src="/pixsigdata' + scheduledtl.image.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" />';
					} else if (scheduledtl.objtype == 9) {
						name = scheduledtl.mediagrid.name;
						thumbwidth = scheduledtl.mediagrid.width > scheduledtl.mediagrid.height? 100 : 100*scheduledtl.mediagrid.width/scheduledtl.mediagrid.height;
						schedulehtml += '<img src="/pixsigdata' + scheduledtl.mediagrid.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
					}
					schedulehtml += '</div>';
					schedulehtml += '</a>';
					schedulehtml += '<h6 class="pixtitle">' + name + '</h6>';
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
		
		$('td:eq(3)', nRow).html('<a href="javascript:;" privilegeid="101010" devicegridid="' + aData.devicegridid + '" class="btn default btn-xs blue pix-schedule"><i class="fa fa-calendar-o"></i> ' + common.view.schedule + '</a>');
		$('td:eq(4)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>');

		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#DevicegridTable .thumbs').each(function(i) {
			$(this).width($(this).parent().closest('div').width());
			$(this).height($(this).parent().closest('div').width());
		});

		for (var i=0; i<$('#DevicegridTable').dataTable().fnGetData().length; i++) {
			var devicegrid = $('#DevicegridTable').dataTable().fnGetData(i);
			redrawDevicegridPreview($('#DevicegridDiv-' + devicegrid.devicegridid), devicegrid, Math.floor($('#DevicegridDiv-' + devicegrid.devicegridid).parent().width()));
		}
		
		refreshFancybox();
	},
	'fnServerParams': function(aoData) { 
		//aoData.push({'name':'branchid','value':CurBranchid });
	}
});
$('#DevicegridTable_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#DevicegridTable_wrapper .dataTables_length select').addClass('form-control input-small');
$('#DevicegridTable_wrapper .dataTables_length select').select2();
$('#DevicegridTable').css('width', '100%');

$('#DevicegridgroupTable').dataTable({
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
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		//$('td:eq(1)', nRow).html('<div id="DevicegridgroupDiv-'+ aData.devicegroupid + '"></div>');
		var listhtml = '';
		for (var i=0; i<aData.devicegrids.length; i++) {
			listhtml += aData.devicegrids[i].name + ' ';
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
					var name;
					var thumbwidth;
					if (j % 4 == 0) {
						schedulehtml += '<div class="row" >';
					}
					schedulehtml += '<div class="col-md-3 col-xs-3">';

					schedulehtml += '<a href="javascript:;" data-index="' + iDisplayIndex + '" schedule-index="' + i + '" scheduledtl-index="' + j + '" class="fancybox">';
					schedulehtml += '<div class="thumbs">';

					if (scheduledtl.objtype == 2) {
						name = scheduledtl.page.name;
						thumbwidth = scheduledtl.page.width > scheduledtl.page.height? 100 : 100*scheduledtl.page.width/scheduledtl.page.height;
						schedulehtml += '<img src="/pixsigdata' + scheduledtl.page.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
					} else if (scheduledtl.objtype == 3) {
						name = scheduledtl.video.name;
						thumbwidth = scheduledtl.video.width > scheduledtl.video.height? 100 : 100*scheduledtl.video.width/scheduledtl.video.height;
						schedulehtml += '<img src="/pixsigdata' + scheduledtl.video.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" />';
					} else if (scheduledtl.objtype == 4) {
						name = scheduledtl.image.name;
						thumbwidth = scheduledtl.image.width > scheduledtl.image.height? 100 : 100*scheduledtl.image.width/scheduledtl.image.height;
						schedulehtml += '<img src="/pixsigdata' + scheduledtl.image.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" />';
					} else if (scheduledtl.objtype == 9) {
						name = scheduledtl.mediagrid.name;
						thumbwidth = scheduledtl.mediagrid.width > scheduledtl.mediagrid.height? 100 : 100*scheduledtl.mediagrid.width/scheduledtl.mediagrid.height;
						schedulehtml += '<img src="/pixsigdata' + scheduledtl.mediagrid.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
					}
					schedulehtml += '</div>';
					schedulehtml += '</a>';
					schedulehtml += '<h6 class="pixtitle">' + name + '</h6>';
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
		$('#DevicegridgroupTable .thumbs').each(function(i) {
			$(this).height($(this).parent().closest('div').width());
		});

		/*
		for (var i=0; i<$('#DevicegridgroupTable').dataTable().fnGetData().length; i++) {
			var devicegroup = $('#DevicegridgroupTable').dataTable().fnGetData(i);
			redrawDevicegridgroupPreview($('#DevicegridgroupDiv-' + devicegroup.devicegroupid), devicegroup, Math.floor($('#DevicegridgroupDiv-' + devicegroup.devicegroupid).parent().width()));
		}*/
		
		refreshFancybox();
	},
	'fnServerParams': function(aoData) { 
		//aoData.push({'name':'branchid','value':CurBranchid });
		aoData.push({'name':'type','value':2 });
	}
});
$('#DevicegridgroupTable_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#DevicegridgroupTable_wrapper .dataTables_length select').addClass('form-control input-small');
$('#DevicegridgroupTable_wrapper .dataTables_length select').select2();
$('#DevicegridgroupTable').css('width', '100%');

function redrawDevicegridPreview(div, devicegrid, maxsize) {
	div.empty();
	div.attr('devicegridid', devicegrid.devicegridid);
	div.attr('style', 'position:relative; margin-left:0; margin-right:auto; border: 1px solid #000; background:#FFFFFF;');

	for (var i=0; i<devicegrid.xcount; i++) {
		for (var j=0; j<devicegrid.ycount; j++) {
			var terminalid = '';
			for (var k=0; k<devicegrid.devices.length; k++) {
				var device = devicegrid.devices[k];
				if (device.xpos == i && device.ypos == j) {
					terminalid = device.terminalid;
					terminalid = terminalid.substr(terminalid.length-5,5);
				}
			}
			var html = '<div style="position: absolute; width:' + (100/devicegrid.xcount);
			html += '%; height:' + (100/devicegrid.ycount);
			html += '%; left: ' + (i*100/devicegrid.xcount);
			html += '%; top: ' + (j*100/devicegrid.ycount);
			html += '%; border: 1px solid #000; ">';
			html += '<div style="position:absolute; width:100%; height:100%; ">';
			html += '<p class="grid-font" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:#000; font-size:12px; ">';
			html += terminalid;
			html += '</p>';
			html += '</div>';
			html += '</div>';
			div.append(html);
		}
	}

	var width, scale, height;
	if (devicegrid.width > devicegrid.height ) {
		width = maxsize;
		scale = devicegrid.width / width;
		height = devicegrid.height / scale;
	} else {
		height = maxsize * 9 / 16;
		scale = devicegrid.height / height;
		width = devicegrid.width / scale;
	}
	div.css('width' , width);
	div.css('height' , height);
	$(div).find('.grid-font').each(function() {
		var lineheight = devicegrid.height / devicegrid.ycount / scale;
		var text = $(this).html();
		$(this).css('font-size', 0.2 * lineheight + 'px');
		$(this).css('line-height', lineheight + 'px');
	});
}

$('body').on('click', '.pix-sync', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	var url, data;
	if (CurrentBindtype == 2) {
		CurrentBind = $('#DevicegridgroupTable').dataTable().fnGetData(index);
		url = 'devicegroup!sync.action';
		data = { devicegroupid: CurrentBind.devicegroupid };
	} else if (CurrentBindtype == 3) {
		CurrentBind = $('#DevicegridTable').dataTable().fnGetData(index);
		url = 'devicegrid!sync.action';
		data = { devicegridid: CurrentBind.devicegridid };
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
				var name;
				var thumbwidth;
				if (j % 6 == 0) {
					scheduleTabHtml += '<div class="row" >';
				}
				scheduleTabHtml += '<div class="col-md-2 col-xs-2">';
				scheduleTabHtml += '<div class="thumbs">';
				if (scheduledtl.objtype == 2) {
					name = scheduledtl.page.name;
					thumbwidth = scheduledtl.page.width > scheduledtl.page.height? 100 : 100*scheduledtl.page.width/scheduledtl.page.height;
					scheduleTabHtml += '<img src="/pixsigdata' + scheduledtl.page.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
				} else if (scheduledtl.objtype == 3) {
					name = scheduledtl.video.name;
					thumbwidth = scheduledtl.video.width > scheduledtl.video.height? 100 : 100*scheduledtl.video.width/scheduledtl.video.height;
					scheduleTabHtml += '<img src="/pixsigdata' + scheduledtl.video.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" />';
				} else if (scheduledtl.objtype == 4) {
					name = scheduledtl.image.name;
					thumbwidth = scheduledtl.image.width > scheduledtl.image.height? 100 : 100*scheduledtl.image.width/scheduledtl.image.height;
					scheduleTabHtml += '<img src="/pixsigdata' + scheduledtl.image.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" />';
				} else if (scheduledtl.objtype == 9) {
					name = scheduledtl.mediagrid.name;
					thumbwidth = scheduledtl.mediagrid.width > scheduledtl.mediagrid.height? 100 : 100*scheduledtl.mediagrid.width/scheduledtl.mediagrid.height;
					scheduleTabHtml += '<img src="/pixsigdata' + scheduledtl.mediagrid.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
				}
				scheduleTabHtml += '</div>';
				scheduleTabHtml += '<h6 class="pixtitle">' + name + '</h6>';
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
	$('#MediagridTable').dataTable()._fnAjaxUpdate();
	$('#VideoTable').dataTable()._fnAjaxUpdate();
	$('#ImageTable').dataTable()._fnAjaxUpdate();
	$('#PageTable').dataTable()._fnAjaxUpdate();
}

//本地视频table初始化
$('#MediagridTable thead').css('display', 'none');
$('#MediagridTable tbody').css('display', 'none');	
var mediagridhtml = '';
$('#MediagridTable').dataTable({
	'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 12, 30, 48, 96 ],
					  [ 12, 30, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'mediagrid!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'mediagridid', 'bSortable' : false }],
	'iDisplayLength' : 12,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#MediagridContainer').length < 1) {
			$('#MediagridTable').append('<div id="MediagridContainer"></div>');
		}
		$('#MediagridContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 6 == 0) {
			mediagridhtml = '';
			mediagridhtml += '<div class="row" >';
		}
		mediagridhtml += '<div class="col-md-2 col-xs-2">';

		mediagridhtml += '<div id="ThumbContainer" style="position:relative">';
		var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
		mediagridhtml += '<div id="MediagridThumb" class="thumbs">';
		mediagridhtml += '<img src="/pixsigdata' + aData.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
		mediagridhtml += '<div class="mask">';
		mediagridhtml += '<div>';
		mediagridhtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
		mediagridhtml += '<a class="btn default btn-sm green pix-scheduledtl-mediagrid-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
		mediagridhtml += '</div>';
		mediagridhtml += '</div>';
		mediagridhtml += '</div>';

		mediagridhtml += '</div>';

		mediagridhtml += '</div>';
		if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#MediagridTable').dataTable().fnGetData().length) {
			mediagridhtml += '</div>';
			if ((iDisplayIndex+1) != $('#MediagridTable').dataTable().fnGetData().length) {
				mediagridhtml += '<hr/>';
			}
			$('#MediagridContainer').append(mediagridhtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#MediagridContainer .thumbs').each(function(i) {
			$(this).height($(this).parent().width());
		});
		$('#MediagridContainer .mask').each(function(i) {
			$(this).height($(this).parent().parent().width() + 2);
		});
	},
	'fnServerParams': function(aoData) {
		if (CurrentBind != null) {
			aoData.push({'name':'gridlayoutcode','value':CurrentBind.gridlayoutcode });
		}
		aoData.push({'name':'status','value':1 });
	}
});
$('#MediagridTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
$('#MediagridTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
$('#MediagridTable').css('width', '100%');

//视频table初始化
$('#VideoTable thead').css('display', 'none');
$('#VideoTable tbody').css('display', 'none');	
var videohtml = '';
$('#VideoTable').dataTable({
	'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 12, 30, 48, 96 ],
					  [ 12, 30, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'video!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'videoid', 'bSortable' : false }],
	'iDisplayLength' : 12,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#VideoContainer').length < 1) {
			$('#VideoTable').append('<div id="VideoContainer"></div>');
		}
		$('#VideoContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 6 == 0) {
			videohtml = '';
			videohtml += '<div class="row" >';
		}
		videohtml += '<div class="col-md-2 col-xs-2">';

		videohtml += '<div id="ThumbContainer" style="position:relative">';
		var thumbnail = '../img/video.jpg';
		var thumbwidth = 100;
		if (aData.thumbnail != null) {
			thumbnail = '/pixsigdata' + aData.thumbnail;
			thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
		}
		videohtml += '<div id="VideoThumb" class="thumbs">';
		videohtml += '<img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		videohtml += '<div class="mask">';
		videohtml += '<div>';
		videohtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
		videohtml += '<a class="btn default btn-sm green pix-scheduledtl-video-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
		videohtml += '</div>';
		videohtml += '</div>';
		videohtml += '</div>';

		videohtml += '</div>';

		videohtml += '</div>';
		if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#VideoTable').dataTable().fnGetData().length) {
			videohtml += '</div>';
			if ((iDisplayIndex+1) != $('#VideoTable').dataTable().fnGetData().length) {
				videohtml += '<hr/>';
			}
			$('#VideoContainer').append(videohtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#VideoContainer .thumbs').each(function(i) {
			$(this).height($(this).parent().width());
		});
		$('#VideoContainer .mask').each(function(i) {
			$(this).height($(this).parent().parent().width() + 2);
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurrentMediaBranchid });
		aoData.push({'name':'folderid','value':CurrentMediaFolderid });
		aoData.push({'name':'type','value':1 });
	}
});
$('#VideoTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
$('#VideoTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
$('#VideoTable').css('width', '100%');

//图片table初始化
$('#ImageTable thead').css('display', 'none');
$('#ImageTable tbody').css('display', 'none');	
var imagehtml = '';
$('#ImageTable').dataTable({
	'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 12, 30, 48, 96 ],
					  [ 12, 30, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'image!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'imageid', 'bSortable' : false }],
	'iDisplayLength' : 12,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#ImageContainer').length < 1) {
			$('#ImageTable').append('<div id="ImageContainer"></div>');
		}
		$('#ImageContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 6 == 0) {
			imagehtml = '';
			imagehtml += '<div class="row" >';
		}
		imagehtml += '<div class="col-md-2 col-xs-2">';
		
		imagehtml += '<div id="ThumbContainer" style="position:relative">';
		var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
		imagehtml += '<div id="ImageThumb" class="thumbs">';
		imagehtml += '<img src="/pixsigdata' + aData.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		imagehtml += '<div class="mask">';
		imagehtml += '<div>';
		imagehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
		imagehtml += '<a class="btn default btn-sm green pix-scheduledtl-image-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
		imagehtml += '</div>';
		imagehtml += '</div>';
		imagehtml += '</div>';

		imagehtml += '</div>';

		imagehtml += '</div>';
		if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#ImageTable').dataTable().fnGetData().length) {
			imagehtml += '</div>';
			if ((iDisplayIndex+1) != $('#ImageTable').dataTable().fnGetData().length) {
				imagehtml += '<hr/>';
			}
			$('#ImageContainer').append(imagehtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#ImageContainer .thumbs').each(function(i) {
			$(this).height($(this).parent().width());
		});
		$('#ImageContainer .mask').each(function(i) {
			$(this).height($(this).parent().parent().width() + 2);
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurrentMediaBranchid });
		aoData.push({'name':'folderid','value':CurrentMediaFolderid });
	}
});
$('#ImageTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
$('#ImageTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
$('#ImageTable').css('width', '100%');

//页面table初始化
$('#PageTable thead').css('display', 'none');
$('#PageTable tbody').css('display', 'none');	
var pagehtml = '';
$('#PageTable').dataTable({
	'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 12, 30, 48, 96 ],
					  [ 12, 30, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'page!pagelist.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'pageid', 'bSortable' : false }],
	'iDisplayLength' : 12,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#PageContainer').length < 1) {
			$('#PageTable').append('<div id="PageContainer"></div>');
		}
		$('#PageContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 6 == 0) {
			pagehtml = '';
			pagehtml += '<div class="row" >';
		}
		pagehtml += '<div class="col-md-2 col-xs-2">';
		
		pagehtml += '<div id="ThumbContainer" style="position:relative">';
		var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
		pagehtml += '<div id="PageThumb" class="thumbs">';
		pagehtml += '<img src="/pixsigdata' + aData.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		pagehtml += '<div class="mask">';
		pagehtml += '<div>';
		pagehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
		pagehtml += '<a class="btn default btn-sm green pix-scheduledtl-page-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
		pagehtml += '</div>';
		pagehtml += '</div>';
		pagehtml += '</div>';

		pagehtml += '</div>';

		pagehtml += '</div>';
		if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#PageTable').dataTable().fnGetData().length) {
			pagehtml += '</div>';
			if ((iDisplayIndex+1) != $('#PageTable').dataTable().fnGetData().length) {
				pagehtml += '<hr/>';
			}
			$('#PageContainer').append(pagehtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#PageContainer .thumbs').each(function(i) {
			$(this).height($(this).parent().width());
		});
		$('#PageContainer .mask').each(function(i) {
			$(this).height($(this).parent().parent().width() + 2);
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurrentMediaBranchid });
		aoData.push({'name':'folderid','value':CurrentMediaFolderid });
	}
});
$('#PageTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
$('#PageTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
$('#PageTable').css('width', '100%');

$('#nav_tab1').click(function(event) {
	$('#MediagridDiv').css('display', '');
	$('#VideoDiv').css('display', 'none');
	$('#ImageDiv').css('display', 'none');
	$('#PageDiv').css('display', 'none');
	$('#MediagridTable').dataTable()._fnAjaxUpdate();
});
$('#nav_tab2').click(function(event) {
	$('#MediagridDiv').css('display', 'none');
	$('#VideoDiv').css('display', '');
	$('#ImageDiv').css('display', 'none');
	$('#PageDiv').css('display', 'none');
	$('#VideoTable').dataTable()._fnAjaxUpdate();
});
$('#nav_tab3').click(function(event) {
	$('#MediagridDiv').css('display', 'none');
	$('#VideoDiv').css('display', 'none');
	$('#ImageDiv').css('display', '');
	$('#PageDiv').css('display', 'none');
	$('#ImageTable').dataTable()._fnAjaxUpdate();
});
$('#nav_tab4').click(function(event) {
	$('#MediagridDiv').css('display', 'none');
	$('#VideoDiv').css('display', 'none');
	$('#ImageDiv').css('display', 'none');
	$('#PageDiv').css('display', '');
	$('#PageTable').dataTable()._fnAjaxUpdate();
});


function refreshSelectedTable() {
	var selectedTableHtml = '';
	selectedTableHtml += '<tr>';
	for (var i=0; i<CurrentScheduledtls.length; i++) {
		var scheduledtl = CurrentScheduledtls[i];
		var name;
		var thumbwidth;
		selectedTableHtml += '<td style="padding: 0px 10px 0px 0px;" width="' + (100/CurrentScheduledtls.length) + '%"><div class="thumbs" style="width:100px; height:100px;">';
		if (scheduledtl.objtype == 2) {
			name = scheduledtl.page.name;
			thumbwidth = scheduledtl.page.width > scheduledtl.page.height? 100 : 100*scheduledtl.page.width/scheduledtl.page.height;
			selectedTableHtml += '<img src="/pixsigdata' + scheduledtl.page.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
		} else if (scheduledtl.objtype == 3) {
			name = scheduledtl.video.name;
			thumbwidth = scheduledtl.video.width > scheduledtl.video.height? 100 : 100*scheduledtl.video.width/scheduledtl.video.height;
			selectedTableHtml += '<img src="/pixsigdata' + scheduledtl.video.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" />';
		} else if (scheduledtl.objtype == 4) {
			name = scheduledtl.image.name;
			thumbwidth = scheduledtl.image.width > scheduledtl.image.height? 100 : 100*scheduledtl.image.width/scheduledtl.image.height;
			selectedTableHtml += '<img src="/pixsigdata' + scheduledtl.image.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" />';
		} else if (scheduledtl.objtype == 9) {
			name = scheduledtl.mediagrid.name;
			thumbwidth = scheduledtl.mediagrid.width > scheduledtl.mediagrid.height? 100 : 100*scheduledtl.mediagrid.width/scheduledtl.mediagrid.height;
			selectedTableHtml += '<img src="/pixsigdata' + scheduledtl.mediagrid.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
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
		if (scheduledtl.objtype == 2) {
			selectedTableHtml += '<h6 class="pixtitle">' + common.view.solopage + '</h6>';
		} else if (scheduledtl.objtype == 3) {
			selectedTableHtml += '<h6 class="pixtitle">' + common.view.solovideo + '</h6>';
		} else if (scheduledtl.objtype == 4) {
			selectedTableHtml += '<h6 class="pixtitle">' + common.view.soloimage + '</h6>';
		} else if (scheduledtl.objtype == 9) {
			selectedTableHtml += '<h6 class="pixtitle">' + common.view.mediagrid + '</h6>';
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
	if (CurrentBindtype == 2) {
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
					refreshScheduleDetail();
					initMediaBranchTree();
					$('#ScheduleModal').modal();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	} else if (CurrentBindtype == 3) {
		CurrentBindid = $(event.target).attr('devicegridid');
		if (CurrentBindid == undefined) {
			CurrentBindid = $(event.target).parent().attr('devicegridid');
		}
		$.ajax({
			type : 'GET',
			url : 'devicegrid!get.action',
			data : {devicegridid: CurrentBindid},
			success : function(data, status) {
				if (data.errorcode == 0) {
					CurrentBind = data.devicegrid;
					CurrentSchedules = CurrentBind.schedules;
					$('.schedule-edit').css('display', 'none');
					$('.schedule-add').css('display', 'none');
					$('.schedule-view').css('display', 'block');				
					refreshScheduleDetail();
					initMediaBranchTree();
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
			schedule.scheduletype = 2;
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

//增加Mediagrid到SelectedTable
$('body').on('click', '.pix-scheduledtl-mediagrid-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#MediagridTable').dataTable().fnGetData(rowIndex);
	var scheduledtl = {};
	scheduledtl.scheduledtlid = 'D' + Math.round(Math.random()*100000000);
	scheduledtl.scheduleid = CurrentSchedule.scheduleid;
	scheduledtl.objtype = 9;
	scheduledtl.objid = data.mediagridid;
	scheduledtl.mediagrid = data;
	scheduledtl.sequence = CurrentScheduledtls.length + 1;
	CurrentScheduledtls.push(scheduledtl);
	refreshSelectedTable();
});
//增加Video到SelectedTable
$('body').on('click', '.pix-scheduledtl-video-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#VideoTable').dataTable().fnGetData(rowIndex);
	var scheduledtl = {};
	scheduledtl.scheduledtlid = 'D' + Math.round(Math.random()*100000000);
	scheduledtl.scheduleid = CurrentSchedule.scheduleid;
	scheduledtl.objtype = 3;
	scheduledtl.objid = data.videoid;
	scheduledtl.video = data;
	scheduledtl.sequence = CurrentScheduledtls.length + 1;
	CurrentScheduledtls.push(scheduledtl);
	refreshSelectedTable();
});
//增加Image到SelectedTable
$('body').on('click', '.pix-scheduledtl-image-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#ImageTable').dataTable().fnGetData(rowIndex);
	var scheduledtl = {};
	scheduledtl.scheduledtlid = 'D' + Math.round(Math.random()*100000000);
	scheduledtl.scheduleid = CurrentSchedule.scheduleid;
	scheduledtl.objtype = 4;
	scheduledtl.objid = data.imageid;
	scheduledtl.image = data;
	scheduledtl.sequence = CurrentScheduledtls.length + 1;
	CurrentScheduledtls.push(scheduledtl);
	refreshSelectedTable();
});
//增加Page到SelectedTable
$('body').on('click', '.pix-scheduledtl-page-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#PageTable').dataTable().fnGetData(rowIndex);
	var scheduledtl = {};
	scheduledtl.scheduledtlid = 'D' + Math.round(Math.random()*100000000);
	scheduledtl.scheduleid = CurrentSchedule.scheduleid;
	scheduledtl.objtype = 2;
	scheduledtl.objid = data.pageid;
	scheduledtl.page = data;
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
			scheduledtl.mediagrid = undefined;
			scheduledtl.video = undefined;
			scheduledtl.image = undefined;
			scheduledtl.page = undefined;
			if (('' + scheduledtl.scheduleid).indexOf('B') == 0) {
				scheduledtl.scheduleid = '0';
			}
			if (('' + scheduledtl.scheduledtlid).indexOf('D') == 0) {
				scheduledtl.scheduledtlid = '0';
			}
		}
	}
	var data = {
		scheduletype: 2,
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
				$('#DevicegridgroupTable').dataTable()._fnAjaxUpdate();
				$('#DevicegridTable').dataTable()._fnAjaxUpdate();
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
			var data_index = $(this).attr('data-index');
			var schedule_index = $(this).attr('schedule-index');
			var scheduledtl_index = $(this).attr('scheduledtl-index');
			var scheduledtl;
			var grid;
			if (CurrentBindtype == 2) {
				grid = $('#DevicegridgroupTable').dataTable().fnGetData(data_index);
				scheduledtl = grid.schedules[schedule_index].scheduledtls[scheduledtl_index];
			} else if (CurrentBindtype == 3) {
				grid = $('#DevicegridTable').dataTable().fnGetData(data_index);
				scheduledtl = grid.schedules[schedule_index].scheduledtls[scheduledtl_index];
			}

			$.fancybox({
				openEffect	: 'none',
				closeEffect	: 'none',
				closeBtn : false,
				padding : 0,
				content: '<div id="MediagridPreview"></div>',
			});
			if (scheduledtl.objtype == 9) {
				redrawMediagridPreview($('#MediagridPreview'), scheduledtl.mediagrid, 800);
			} else {
				var thumbnail;
				if (scheduledtl.video != null) {
					thumbnail = '/pixsigdata' + scheduledtl.video.thumbnail;
				} else if (scheduledtl.image != null) {
					thumbnail = '/pixsigdata' + scheduledtl.image.thumbnail;
				} else if (scheduledtl.page != null) {
					thumbnail = '/pixsigdata' + scheduledtl.page.snapshot;
				} else if (scheduledtl.bundle != null) {
					thumbnail = '/pixsigdata' + scheduledtl.bundle.snapshot;
				}
				redrawSologridPreview($('#MediagridPreview'), grid, thumbnail, 800);
			}
			
			return false;
		})
	});
}

function initMediaBranchTree() {
	$.ajax({
		type : 'POST',
		url : 'branch!list.action',
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var branches = data.aaData;
				CurrentMediaBranchid = branches[0].branchid;
				
				if ( $("#MediaBranchTreeDiv").length > 0 ) {
					if (branches[0].children.length == 0) {
						$('#MediaBranchTreeDiv').css('display', 'none');
						CurrentMediaFolderid = null;
						initMediaFolderTree();
						refreshMediaTable();
					} else {
						var branchTreeDivData = [];
						createBranchTreeData(branches, branchTreeDivData);
						$('#MediaBranchTreeDiv').jstree('destroy');
						$('#MediaBranchTreeDiv').jstree({
							'core' : {
								'multiple' : false,
								'data' : branchTreeDivData
							},
							'plugins' : ['unique'],
						});
						$('#MediaBranchTreeDiv').on('loaded.jstree', function() {
							$('#MediaBranchTreeDiv').jstree('select_node', CurrentMediaBranchid);
						});
						$('#MediaBranchTreeDiv').on('select_node.jstree', function(event, data) {
							CurrentMediaBranchid = data.instance.get_node(data.selected[0]).id;
							CurrentMediaFolderid = null;
							initMediaFolderTree();
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
}


function initMediaFolderTree() {
	$.ajax({
		type : 'POST',
		url : 'folder!list.action',
		data : {
			branchid: CurrentMediaBranchid
		},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var folders = data.aaData;
				CurrentMediaFolderid = folders[0].folderid;
				
				if ( $("#MediaFolderTreeDiv").length > 0 ) {
					var folderTreeDivData = [];
					createFolderTreeData(folders, folderTreeDivData);
					$('#MediaFolderTreeDiv').jstree('destroy');
					$('#MediaFolderTreeDiv').jstree({
						'core' : {
							'multiple' : false,
							'data' : folderTreeDivData
						},
						'plugins' : ['unique', 'types'],
						'types' : {
							'default' : { 'icon' : 'fa fa-folder icon-state-warning icon-lg' }
						},
					});
					$('#MediaFolderTreeDiv').on('loaded.jstree', function() {
						$('#MediaFolderTreeDiv').jstree('select_node', CurrentMediaFolderid);
					});
					$('#MediaFolderTreeDiv').on('select_node.jstree', function(event, data) {
						CurrentMediaFolderid = data.instance.get_node(data.selected[0]).id;
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
