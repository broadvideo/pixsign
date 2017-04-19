var currentDevice;
var currentDeviceid;
var currentSchedules;

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

$('#MyTable').dataTable({
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
			$('td:eq(1)', nRow).html('<span class="label label-sm label-info">' + common.view.idle + '</span>');
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
					var thumbwidth = scheduledtl.bundle.width > scheduledtl.bundle.height? 100 : 100*scheduledtl.bundle.width/scheduledtl.bundle.height;
					schedulehtml += '<a href="javascript:;" bundleid="' + scheduledtl.objid + '" class="fancybox">';
					schedulehtml += '<div class="thumbs">';
					schedulehtml += '<img src="/pixsigdata' + scheduledtl.bundle.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + scheduledtl.bundle.name + '" />';
					schedulehtml += '</div>';
					schedulehtml += '</a>';
					schedulehtml += '<h6 class="pixtitle">' + scheduledtl.bundle.name + '</h6>';
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
		
		$('td:eq(3)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-schedule"><i class="fa fa-calendar-o"></i> ' + common.view.schedule + '</a>');
		$('td:eq(4)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>');

		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#MyTable .thumbs').each(function(i) {
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

$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
$('#MyTable_wrapper .dataTables_length select').select2();
$('#MyTable').css('width', '100%');


$('body').on('click', '.pix-sync', function(event) {
	var target = $(event.target);
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		target = $(event.target).parent();
		index = $(event.target).parent().attr('data-id');
	}
	currentItem = $('#MyTable').dataTable().fnGetData(index);
	bootbox.confirm(common.tips.sync + currentItem.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'GET',
				url : 'device!sync.action',
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
	if (currentSchedules.length > 0) {
		var scheduleTabHtml = '<h3></h3><ul class="timeline">';
		for (var i=0; i<currentSchedules.length; i++) {
			var schedule = currentSchedules[i];
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
				if (j % 4 == 0) {
					scheduleTabHtml += '<div class="row" >';
				}
				scheduleTabHtml += '<div class="col-md-3 col-xs-3">';
				var thumbwidth = scheduledtl.bundle.width > scheduledtl.bundle.height? 100 : 100*scheduledtl.bundle.width/scheduledtl.bundle.height;
				scheduleTabHtml += '<div class="thumbs">';
				scheduleTabHtml += '<img src="/pixsigdata' + scheduledtl.bundle.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + scheduledtl.bundle.name + '" />';
				scheduleTabHtml += '<div class="mask">';
				scheduleTabHtml += '<div>';
				scheduleTabHtml += '<br/><a href="javascript:;" class="btn default btn-sm red pix-del-scheduledtl" scheduleid="' + i + '" scheduledtlid="' + j + '"><i class="fa fa-trash-o"></i></a>';
				scheduleTabHtml += '</div>';
				scheduleTabHtml += '</div>';
				scheduleTabHtml += '</div>';
				scheduleTabHtml += '<h6 class="pixtitle">' + scheduledtl.bundle.name + '</h6>';
				scheduleTabHtml += '</div>';
				if ((j+1) % 4 == 0 || (j+1) == schedule.scheduledtls.length) {
					scheduleTabHtml += '</div>';
				}
			}
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '<div class="col-md-2 col-sm-2">';
			scheduleTabHtml += '<a href="javascript:;" class="btn btn-sm green pull-right pix-add-scheduledtl" data-id="'+ i + '">' + common.view.add + '<i class="fa fa-plus"></i></a>';
			scheduleTabHtml += '<a href="javascript:;" class="btn btn-sm red pull-right pix-del-schedule" data-id="'+ i + '">' + common.view.remove + '<i class="fa fa-trash-o"></i></a>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '</li>';
		}
		scheduleTabHtml += '</ul>';
	} else {
		var scheduleTabHtml = '<h3>' + common.tips.device_schedule_zero + '</h3>';
	}
	$('#ScheduleDetail').html(scheduleTabHtml);
	$('#ScheduleDetail .thumbs').each(function(i) {
		$(this).height($(this).parent().width());
		$(this).find('.mask').height($(this).parent().width() + 2);
	});
}

$.ajax({
	type : 'POST',
	url : 'bundle!list.action',
	data : {
		reviewflag: '1',
		homeflag: '1',
	},
	success : function(data, status) {
		if (data.errorcode == 0) {
			Bundles = data.aaData;
			var bundleTableHtml = '';
			bundleTableHtml += '<tr>';
			for (var i=0; i<Bundles.length; i++) {
				var thumbwidth = Bundles[i].width > Bundles[i].height? 100 : 100*Bundles[i].width/Bundles[i].height;
				bundleTableHtml += '<td style="padding: 0px 20px 0px 0px;" width="' + (100/Bundles.length) + '%"><div class="thumbs" style="width:200px; height:200px;">';
				bundleTableHtml += '<a href="javascript:;" bundleid="' + Bundles[i].bundleid + '" class="fancybox">';
				bundleTableHtml += '<img src="/pixsigdata' + Bundles[i].snapshot + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + Bundles[i].name + '" />';
				bundleTableHtml += '</a>';
				bundleTableHtml += '</div></td>';
			}
			bundleTableHtml += '</tr>';
			bundleTableHtml += '<tr>';
			for (var i=0; i<Bundles.length; i++) {
				bundleTableHtml += '<td>';
				bundleTableHtml += '<label class="radio-inline">';
				if (i == 0) {
					bundleTableHtml += '<input type="radio" name="bundleid" value="' + Bundles[i].bundleid + '" checked>';
				} else {
					bundleTableHtml += '<input type="radio" name="bundleid" value="' +Bundles[i].bundleid + '">';
				}
				bundleTableHtml += Bundles[i].name + '</label>';
				bundleTableHtml += '</td>';
			}
			bundleTableHtml += '</tr>';
			$('#BundleTable').html(bundleTableHtml);
			$('#BundleTable').width(220 * Bundles.length);
			refreshFancybox();
		} else {
			bootbox.alert(common.tips.error + data.errormsg);
		}
	},
	error : function() {
		console.log('failue');
	}
});

$('body').on('click', '.pix-schedule', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	currentDevice = $('#MyTable').dataTable().fnGetData(index);
	currentDeviceid = currentDevice.deviceid;
	currentSchedules = currentDevice.schedules;

	$('.schedule-edit').css('display', 'none');
	$('.schedule-add').css('display', 'none');
	$('.schedule-view').css('display', 'block');				
	refreshScheduleDetail();
	$('#ScheduleModal').modal();
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
});

FormValidateOption.rules = {};
FormValidateOption.rules['starttime'] = {};
FormValidateOption.rules['starttime']['required'] = true;
FormValidateOption.rules['bundleid'] = {};
FormValidateOption.rules['bundleid']['required'] = true;
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
		var schedules = currentSchedules.filter(function (el) {
			return (el.starttime == starttime);
		});
		var bundleid = $('#ScheduleForm input[name=bundleid]:checked').attr("value");
		var bundlesels = Bundles.filter(function (el) {
			return (el.bundleid == bundleid);
		});
		if (schedules.length > 0) {
			schedules[0].playmode = $('#ScheduleForm input[name=playmode]:checked').attr("value");
			var scheduledtl = {};
			scheduledtl.scheduledtlid = 'D' + Math.round(Math.random()*100000000);
			scheduledtl.scheduleid = schedules[0].scheduleid;
			scheduledtl.objtype = 1;
			scheduledtl.objid = bundleid;
			scheduledtl.bundle = bundlesels[0];
			scheduledtl.sequence = schedules[0].scheduledtls.length + 1;
			schedules[0].scheduledtls.push(scheduledtl);
			//schedules[0].scheduledtls[0] = scheduledtl;
		} else {
			var schedule = {};
			schedule.scheduleid = 'B' + Math.round(Math.random()*100000000);
			schedule.scheduletype = 1;
			schedule.bindtype = 1;
			schedule.bindid = currentDeviceid;
			schedule.playmode = $('#ScheduleForm input[name=playmode]:checked').attr("value");
			schedule.starttime = $('#ScheduleForm input[name=starttime]').val();
			schedule.scheduledtls = [];
			var scheduledtl = {};
			scheduledtl.scheduledtlid = 'D' + Math.round(Math.random()*100000000);
			scheduledtl.scheduleid = schedule.scheduleid;
			scheduledtl.objtype = 1;
			scheduledtl.objid = bundleid;
			scheduledtl.bundle = bundlesels[0];
			scheduledtl.sequence = 1;
			schedule.scheduledtls.push(scheduledtl);
			currentSchedules.push(schedule);
		}
		
		currentSchedules.sort(function(a, b) {
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

$('body').on('click', '.pix-del-scheduledtl', function(event) {
	var i = $(event.target).attr('scheduleid');
	var j = $(event.target).attr('scheduledtlid');
	if (i == undefined) {
		i = $(event.target).parent().attr('scheduleid');
		j = $(event.target).parent().attr('scheduledtlid');
	}
	currentSchedules[i].scheduledtls.splice(j, 1);
	refreshScheduleDetail();
});

$('body').on('click', '.pix-add-scheduledtl', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	var schedule = currentSchedules[index];
	
	$('.schedule-edit').css('display', 'block');
	$('.schedule-add').css('display', 'none');
	$('.schedule-view').css('display', 'none');				
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	$('#ScheduleForm input[name="starttime"]').attr('value', schedule.starttime);
});

$('body').on('click', '.pix-del-schedule', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	currentSchedules.splice(index, 1);
	refreshScheduleDetail();
});

$('[type=submit]', $('#ScheduleModal')).on('click', function(event) {
	for (var i=0; i<currentSchedules.length; i++) {
		var schedule = currentSchedules[i];
		if (i == currentSchedules.length - 1) {
			schedule.endtime = currentSchedules[0].starttime;
		} else {
			schedule.endtime = currentSchedules[i+1].starttime;
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
	var data = {};
	data.scheduletype = 1;
	data.bindtype = 1;
	data.bindid = currentDeviceid;
	data.schedules = currentSchedules;
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
				$('#MyTable').dataTable()._fnAjaxUpdate();
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
			var bundleid = $(this).attr('bundleid');
			$.ajax({
				type : 'GET',
				url : 'bundle!get.action',
				data : {bundleid: bundleid},
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
