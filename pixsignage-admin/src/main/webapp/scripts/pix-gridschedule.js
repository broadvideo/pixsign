var currentDevicegrid;
var currentDevicegridid;
var currentGridschedules;

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
					{'sTitle' : common.view.gridschedule, 'mData' : 'devicegridid', 'bSortable' : false, 'sWidth' : '65%' }, 
					{'sTitle' : '', 'mData' : 'devicegridid', 'bSortable' : false, 'sWidth' : '5%' }, 
					{'sTitle' : '', 'mData' : 'devicegridid', 'bSortable' : false, 'sWidth' : '5%' }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(1)', nRow).html('<div id="DevicegridDiv-'+ aData.devicegridid + '"></div>');
		
		var gridschedulehtml = '';
		if (aData.gridschedules.length > 0) {
			for (var i=0; i<aData.gridschedules.length; i++) {
				var schedule = aData.gridschedules[i];
				gridschedulehtml += '<div class="row">';
				gridschedulehtml += '<div class="col-md-2 col-xs-2">';
				gridschedulehtml += '<h3>' + schedule.starttime.substring(0,5) + ' </h3>';
				gridschedulehtml += '</div>';
				gridschedulehtml += '<div class="col-md-10 col-xs-10">';
				for (var j=0; j<schedule.gridscheduledtls.length; j++) {
					var gridscheduledtl = schedule.gridscheduledtls[j];
					if (j % 4 == 0) {
						gridschedulehtml += '<div class="row" >';
					}
					gridschedulehtml += '<div class="col-md-3 col-xs-3">';
					var thumbwidth = gridscheduledtl.mediagrid.width > gridscheduledtl.mediagrid.height? 100 : 100*gridscheduledtl.mediagrid.width/gridscheduledtl.mediagrid.height;
					gridschedulehtml += '<div class="thumbs">';
					gridschedulehtml += '<img src="/pixsigdata' + gridscheduledtl.mediagrid.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + gridscheduledtl.mediagrid.name + '" />';
					gridschedulehtml += '</div>';
					gridschedulehtml += '<h6 class="pixtitle">' + gridscheduledtl.mediagrid.name + '</h6>';
					gridschedulehtml += '</div>';
					if ((j+1) % 4 == 0 || (j+1) == schedule.gridscheduledtls.length) {
						gridschedulehtml += '</div>';
					}
				}
				gridschedulehtml += '</div>';
				gridschedulehtml += '</div>';
			}
		} else {
			gridschedulehtml = '';
		}
		$('td:eq(2)', nRow).html(gridschedulehtml);
		
		$('td:eq(3)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-gridschedule"><i class="fa fa-calendar-o"></i> ' + common.view.schedule + '</a>');
		$('td:eq(4)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>');

		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#MyTable .thumbs').each(function(i) {
			$(this).height($(this).parent().width());
		});

		for (var i=0; i<$('#MyTable').dataTable().fnGetData().length; i++) {
			var devicegrid = $('#MyTable').dataTable().fnGetData(i);
			redrawDevicegridPreview($('#DevicegridDiv-' + devicegrid.devicegridid), devicegrid, Math.floor($('#DevicegridDiv-' + devicegrid.devicegridid).parent().width()));
		}
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
					bootbox.alert(common.tips.error);
				}
			});				
		}
	});
});


//Gridschedule Edit
function refreshGridscheduleDetail() {
	$('#GridscheduleDetail').empty();
	if (currentGridschedules.length > 0) {
		var scheduleTabHtml = '<h3></h3><ul class="timeline">';
		for (var i=0; i<currentGridschedules.length; i++) {
			var schedule = currentGridschedules[i];
			scheduleTabHtml += '<li class="timeline-grey">';
			scheduleTabHtml += '<div class="timeline-time">';
			scheduleTabHtml += '<span class="time">' + schedule.starttime.substring(0,5) + ' </span>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '<div class="timeline-icon"><i class="fa fa-video-camera"></i></div>';
			scheduleTabHtml += '<div class="timeline-body">';
			scheduleTabHtml += '<div class="timeline-content">';
			scheduleTabHtml += '<div class="row"><div class="col-md-10 col-sm-10">';
			for (var j=0; j<schedule.gridscheduledtls.length; j++) {
				var gridscheduledtl = schedule.gridscheduledtls[j];
				if (j % 4 == 0) {
					scheduleTabHtml += '<div class="row" >';
				}
				scheduleTabHtml += '<div class="col-md-3 col-xs-3">';
				var thumbwidth = gridscheduledtl.mediagrid.width > gridscheduledtl.mediagrid.height? 100 : 100*gridscheduledtl.mediagrid.width/gridscheduledtl.mediagrid.height;
				scheduleTabHtml += '<div class="thumbs">';
				scheduleTabHtml += '<img src="/pixsigdata' + gridscheduledtl.mediagrid.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + gridscheduledtl.mediagrid.name + '" />';
				scheduleTabHtml += '<div class="mask">';
				scheduleTabHtml += '<div>';
				scheduleTabHtml += '<br/><a href="javascript:;" class="btn default btn-sm red pix-del-gridscheduledtl" gridscheduleid="' + i + '" gridscheduledtlid="' + j + '"><i class="fa fa-trash-o"></i></a>';
				scheduleTabHtml += '</div>';
				scheduleTabHtml += '</div>';
				scheduleTabHtml += '</div>';
				scheduleTabHtml += '<h6 class="pixtitle">' + gridscheduledtl.mediagrid.name + '</h6>';
				scheduleTabHtml += '</div>';
				if ((j+1) % 4 == 0 || (j+1) == schedule.gridscheduledtls.length) {
					scheduleTabHtml += '</div>';
				}
			}
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '<div class="col-md-2 col-sm-2">';
			scheduleTabHtml += '<a href="javascript:;" class="btn btn-sm green pull-right pix-add-gridscheduledtl" data-id="'+ i + '">' + common.view.add + '<i class="fa fa-plus"></i></a>';
			scheduleTabHtml += '<a href="javascript:;" class="btn btn-sm red pull-right pix-del-gridschedule" data-id="'+ i + '">' + common.view.remove + '<i class="fa fa-trash-o"></i></a>';
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
	$('#GridscheduleDetail').html(scheduleTabHtml);
	$('#GridscheduleDetail .thumbs').each(function(i) {
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
					mediagridTableHtml += '<img src="/pixsigdata' + Mediagrids[i].snapshot + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + Mediagrids[i].name + '" />';
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
			} else {
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
		}
	});
}

$('body').on('click', '.pix-gridschedule', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	currentDevicegrid = $('#MyTable').dataTable().fnGetData(index);
	currentDevicegridid = currentDevicegrid.devicegridid;
	currentGridschedules = currentDevicegrid.gridschedules;

	$('.gridschedule-edit').css('display', 'none');
	$('.gridschedule-add').css('display', 'none');
	$('.gridschedule-view').css('display', 'block');				
	refreshGridscheduleDetail();
	refreshMediagridTable();
	$('#GridscheduleModal').modal();
});
$('#GridscheduleModal').on('shown.bs.modal', function (e) {
	$('#GridscheduleDetail .thumbs').each(function(i) {
		$(this).height($(this).parent().width());
		$(this).find('.mask').height($(this).parent().width() + 2);
	});
})

$('body').on('click', '.pix-add-gridschedule', function(event) {
	$('.gridschedule-edit').css('display', 'block');
	$('.gridschedule-add').css('display', 'block');
	$('.gridschedule-view').css('display', 'none');				
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	$('#GridscheduleForm input[name="starttime"]').attr('value', '');
});

FormValidateOption.rules = {};
FormValidateOption.rules['starttime'] = {};
FormValidateOption.rules['starttime']['required'] = true;
FormValidateOption.rules['mediagridid'] = {};
FormValidateOption.rules['mediagridid']['required'] = true;
$('#GridscheduleForm').validate(FormValidateOption);
$.extend($('#GridscheduleForm').validate().settings, {
	rules: FormValidateOption.rules
});
$('#GridscheduleForm .pix-ok').on('click', function(event) {
	var mediagridid = $('#GridscheduleForm input[name=mediagridid]:checked').attr("value");
	var mediagridsels = Mediagrids.filter(function (el) {
		return (el.mediagridid == mediagridid);
	});
	if ($('#GridscheduleForm').valid() && mediagridsels.length > 0) {
		$('.gridschedule-edit').css('display', 'none');
		$('.gridschedule-add').css('display', 'none');
		$('.gridschedule-view').css('display', 'block');
		
		var starttime = $('#GridscheduleForm input[name=starttime]').val();
		var gridschedules = currentGridschedules.filter(function (el) {
			return (el.starttime == starttime);
		});
		if (gridschedules.length > 0) {
			gridschedules[0].playmode = $('#GridscheduleForm input[name=playmode]:checked').attr("value");
			gridschedules[0].mediagridid = mediagridid;
			gridschedules[0].mediagrid = mediagridsels[0];
			var gridscheduledtl = {};
			gridscheduledtl.gridscheduledtlid = 'D' + Math.round(Math.random()*100000000);
			gridscheduledtl.gridscheduleid = gridschedules[0].gridscheduleid;
			gridscheduledtl.mediagridid = mediagridid;
			gridscheduledtl.mediagrid = mediagridsels[0];
			gridscheduledtl.sequence = gridschedules[0].gridscheduledtls.length + 1;
			gridschedules[0].gridscheduledtls.push(gridscheduledtl);
			//gridschedules[0].gridscheduledtls[0] = gridscheduledtl;
		} else {
			var gridschedule = {};
			gridschedule.gridscheduleid = 'B' + Math.round(Math.random()*100000000);
			gridschedule.devicegridid = currentDevicegridid;
			gridschedule.mediagridid = mediagridid;
			gridschedule.playmode = $('#GridscheduleForm input[name=playmode]:checked').attr("value");
			gridschedule.starttime = $('#GridscheduleForm input[name=starttime]').val();
			gridschedule.mediagrid = mediagridsels[0];
			gridschedule.gridscheduledtls = [];
			var gridscheduledtl = {};
			gridscheduledtl.gridscheduledtlid = 'D' + Math.round(Math.random()*100000000);
			gridscheduledtl.gridscheduleid = gridschedule.gridscheduleid;
			gridscheduledtl.mediagridid = mediagridid;
			gridscheduledtl.mediagrid = mediagridsels[0];
			gridscheduledtl.sequence = 1;
			gridschedule.gridscheduledtls.push(gridscheduledtl);
			currentGridschedules.push(gridschedule);
		}
		
		currentGridschedules.sort(function(a, b) {
			return (a.starttime > b.starttime);
		});
		refreshGridscheduleDetail();
	}
});
$('#GridscheduleForm .pix-cancel').on('click', function(event) {
	$('.gridschedule-edit').css('display', 'none');
	$('.gridschedule-add').css('display', 'none');
	$('.gridschedule-view').css('display', 'block');				
});

$('body').on('click', '.pix-del-gridscheduledtl', function(event) {
	var i = $(event.target).attr('gridscheduleid');
	var j = $(event.target).attr('gridscheduledtlid');
	if (i == undefined) {
		i = $(event.target).parent().attr('gridscheduleid');
		j = $(event.target).parent().attr('gridscheduledtlid');
	}
	currentGridschedules[i].gridscheduledtls.splice(j, 1);
	refreshGridscheduleDetail();
});

$('body').on('click', '.pix-add-gridscheduledtl', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	var gridschedule = currentGridschedules[index];
	
	$('.gridschedule-edit').css('display', 'block');
	$('.gridschedule-add').css('display', 'none');
	$('.gridschedule-view').css('display', 'none');				
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	$('#GridscheduleForm input[name="starttime"]').attr('value', gridschedule.starttime);
});

$('body').on('click', '.pix-del-gridschedule', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	currentGridschedules.splice(index, 1);
	refreshGridscheduleDetail();
});

$('[type=submit]', $('#GridscheduleModal')).on('click', function(event) {
	for (var i=0; i<currentGridschedules.length; i++) {
		var gridschedule = currentGridschedules[i];
		gridschedule.mediagrid = undefined;
		if (('' + gridschedule.gridscheduleid).indexOf('B') == 0) {
			gridschedule.gridscheduleid = '0';
		}
		for (var j=0; j<gridschedule.gridscheduledtls.length; j++) {
			var gridscheduledtl = gridschedule.gridscheduledtls[j];
			gridscheduledtl.mediagrid = undefined;
			if (('' + gridscheduledtl.gridscheduleid).indexOf('B') == 0) {
				gridscheduledtl.gridscheduleid = '0';
			}
			if (('' + gridscheduledtl.gridscheduledtlid).indexOf('D') == 0) {
				gridscheduledtl.gridscheduledtlid = '0';
			}
		}
	}
	$.ajax({
		type : 'POST',
		url : 'devicegrid!addgridschedules.action',
		data : '{"gridschedules":' + $.toJSON(currentGridschedules) + '}',
		dataType : 'json',
		contentType : 'application/json;charset=utf-8',
		beforeSend: function ( xhr ) {
			Metronic.startPageLoading({animate: true});
		},
		success : function(data, status) {
			Metronic.stopPageLoading();
			$('#GridscheduleModal').modal('hide');
			if (data.errorcode == 0) {
				bootbox.alert(common.tips.success);
				$('#MyTable').dataTable()._fnAjaxUpdate();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			$('#GridscheduleModal').modal('hide');
			bootbox.alert(common.tips.error);
		}
	});

	event.preventDefault();
});	


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
