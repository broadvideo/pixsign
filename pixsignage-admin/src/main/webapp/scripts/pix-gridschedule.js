var currentDevicegrid;
var currentDevicegridid;
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
					if (j % 4 == 0) {
						schedulehtml += '<div class="row" >';
					}
					schedulehtml += '<div class="col-md-3 col-xs-3">';
					var thumbwidth = scheduledtl.mediagrid.width > scheduledtl.mediagrid.height? 100 : 100*scheduledtl.mediagrid.width/scheduledtl.mediagrid.height;

					schedulehtml += '<a href="javascript:;" mediagridid="' + scheduledtl.objid + '" class="fancybox">';
					schedulehtml += '<div class="thumbs">';
					schedulehtml += '<img src="/pixsigdata' + scheduledtl.mediagrid.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + scheduledtl.mediagrid.name + '" />';
					schedulehtml += '</div>';
					schedulehtml += '</a>';
					schedulehtml += '<h6 class="pixtitle">' + scheduledtl.mediagrid.name + '</h6>';
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

		for (var i=0; i<$('#MyTable').dataTable().fnGetData().length; i++) {
			var devicegrid = $('#MyTable').dataTable().fnGetData(i);
			redrawDevicegridPreview($('#DevicegridDiv-' + devicegrid.devicegridid), devicegrid, Math.floor($('#DevicegridDiv-' + devicegrid.devicegridid).parent().width()));
		}
		
		refreshFancybox();
	},
	'fnServerParams': function(aoData) { 
		//aoData.push({'name':'branchid','value':CurBranchid });
	}
});

$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
$('#MyTable_wrapper .dataTables_length select').select2();
$('#MyTable').css('width', '100%');

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
				url : 'devicegrid!sync.action',
				cache: false,
				data : {
					devicegridid: currentItem.devicegridid,
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
				var thumbwidth = scheduledtl.mediagrid.width > scheduledtl.mediagrid.height? 100 : 100*scheduledtl.mediagrid.width/scheduledtl.mediagrid.height;
				scheduleTabHtml += '<div class="thumbs">';
				scheduleTabHtml += '<img src="/pixsigdata' + scheduledtl.mediagrid.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
				scheduleTabHtml += '<div class="mask">';
				scheduleTabHtml += '<div>';
				scheduleTabHtml += '<br/><a href="javascript:;" class="btn default btn-sm red pix-del-scheduledtl" scheduleid="' + i + '" scheduledtlid="' + j + '"><i class="fa fa-trash-o"></i></a>';
				scheduleTabHtml += '</div>';
				scheduleTabHtml += '</div>';
				scheduleTabHtml += '</div>';
				scheduleTabHtml += '<h6 class="pixtitle">' + scheduledtl.mediagrid.name + '</h6>';
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
		var scheduleTabHtml = '<h3>' + common.tips.devicegrid_schedule_zero + '</h3>';
	}
	$('#ScheduleDetail').html(scheduleTabHtml);
	$('#ScheduleDetail .thumbs').each(function(i) {
		$(this).height($(this).parent().width());
		$(this).find('.mask').height($(this).parent().width() + 2);
	});
}

function refreshMediagridTable() {
	$.ajax({
		type : 'POST',
		url : 'mediagrid!list.action',
		data : {
			status: '1',
			gridlayoutcode: currentDevicegrid.gridlayoutcode,
		},
		success : function(data, status) {
			if (data.errorcode == 0) {
				Mediagrids = data.aaData;
				var mediagridTableHtml = '';
				mediagridTableHtml += '<tr>';
				for (var i=0; i<Mediagrids.length; i++) {
					var thumbwidth = Mediagrids[i].width > Mediagrids[i].height? 100 : 100*Mediagrids[i].width/Mediagrids[i].height;
					mediagridTableHtml += '<td style="padding: 0px 20px 0px 0px;" width="' + (100/Mediagrids.length) + '%"><div class="thumbs" style="width:200px; height:200px;">';
					mediagridTableHtml += '<a href="javascript:;" mediagridid="' + Mediagrids[i].mediagridid + '" class="fancybox">';
					mediagridTableHtml += '<img src="/pixsigdata' + Mediagrids[i].snapshot + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + Mediagrids[i].name + '" />';
					mediagridTableHtml += '</a>';
					mediagridTableHtml += '</div></td>';
				}
				mediagridTableHtml += '</tr>';
				mediagridTableHtml += '<tr>';
				for (var i=0; i<Mediagrids.length; i++) {
					mediagridTableHtml += '<td>';
					mediagridTableHtml += '<label class="radio-inline">';
					if (i == 0) {
						mediagridTableHtml += '<input type="radio" name="mediagridid" value="' + Mediagrids[i].mediagridid + '" checked>';
					} else {
						mediagridTableHtml += '<input type="radio" name="mediagridid" value="' +Mediagrids[i].mediagridid + '">';
					}
					mediagridTableHtml += Mediagrids[i].name + '</label>';
					mediagridTableHtml += '</td>';
				}
				mediagridTableHtml += '</tr>';
				$('#MediagridTable').html(mediagridTableHtml);
				$('#MediagridTable').width(220 * Mediagrids.length);
				refreshFancybox();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
}

$('body').on('click', '.pix-schedule', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	currentDevicegrid = $('#MyTable').dataTable().fnGetData(index);
	currentDevicegridid = currentDevicegrid.devicegridid;
	currentSchedules = currentDevicegrid.schedules;

	$('.schedule-edit').css('display', 'none');
	$('.schedule-add').css('display', 'none');
	$('.schedule-view').css('display', 'block');				
	refreshScheduleDetail();
	refreshMediagridTable();
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
FormValidateOption.rules['mediagridid'] = {};
FormValidateOption.rules['mediagridid']['required'] = true;
$('#ScheduleForm').validate(FormValidateOption);
$.extend($('#ScheduleForm').validate().settings, {
	rules: FormValidateOption.rules
});
$('#ScheduleForm .pix-ok').on('click', function(event) {
	var mediagridid = $('#ScheduleForm input[name=mediagridid]:checked').attr("value");
	var mediagridsels = Mediagrids.filter(function (el) {
		return (el.mediagridid == mediagridid);
	});
	if ($('#ScheduleForm').valid() && mediagridsels.length > 0) {
		$('.schedule-edit').css('display', 'none');
		$('.schedule-add').css('display', 'none');
		$('.schedule-view').css('display', 'block');
		
		var starttime = $('#ScheduleForm input[name=starttime]').val();
		var schedules = currentSchedules.filter(function (el) {
			return (el.starttime == starttime);
		});
		if (schedules.length > 0) {
			schedules[0].playmode = $('#ScheduleForm input[name=playmode]:checked').attr("value");
			var scheduledtl = {};
			scheduledtl.scheduledtlid = 'D' + Math.round(Math.random()*100000000);
			scheduledtl.scheduleid = schedules[0].scheduleid;
			scheduledtl.objtype = 9;
			scheduledtl.objid = mediagridid;
			scheduledtl.mediagrid = mediagridsels[0];
			scheduledtl.sequence = schedules[0].scheduledtls.length + 1;
			schedules[0].scheduledtls.push(scheduledtl);
			//schedules[0].scheduledtls[0] = scheduledtl;
		} else {
			var schedule = {};
			schedule.scheduleid = 'B' + Math.round(Math.random()*100000000);
			schedule.scheduletype = 2;
			schedule.bindtype = 3;
			schedule.bindid = currentDevicegridid;
			schedule.playmode = $('#ScheduleForm input[name=playmode]:checked').attr("value");
			schedule.starttime = $('#ScheduleForm input[name=starttime]').val();
			schedule.scheduledtls = [];
			var scheduledtl = {};
			scheduledtl.scheduledtlid = 'D' + Math.round(Math.random()*100000000);
			scheduledtl.scheduleid = schedule.scheduleid;
			scheduledtl.objtype = 9;
			scheduledtl.objid = mediagridid;
			scheduledtl.mediagrid = mediagridsels[0];
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
			scheduledtl.mediagrid = undefined;
			if (('' + scheduledtl.scheduleid).indexOf('B') == 0) {
				scheduledtl.scheduleid = '0';
			}
			if (('' + scheduledtl.scheduledtlid).indexOf('D') == 0) {
				scheduledtl.scheduledtlid = '0';
			}
		}
	}
	var data = {};
	data.scheduletype = 2;
	data.bindtype = 3;
	data.bindid = currentDevicegridid;
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
			var mediagridid = $(this).attr('mediagridid');
			$.ajax({
				type : 'GET',
				url : 'mediagrid!get.action',
				data : {mediagridid: mediagridid},
				success : function(data, status) {
					if (data.errorcode == 0) {
						$.fancybox({
							openEffect	: 'none',
							closeEffect	: 'none',
							closeBtn : false,
					        padding : 0,
					        content: '<div id="MediagridPreview"></div>',
					    });
						redrawMediagridPreview($('#MediagridPreview'), data.mediagrid, 800);
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
