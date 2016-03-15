var Layouts;
var Regions;
var currentDevice;
var currentDeviceid;
var currentRegion;
var currentLayoutschedules;
var currentRegionschedules;
var currentBundleschedules;

var RegionColors = [];
RegionColors[0] = '#BCC2F2';
RegionColors[1] = '#99CCFF';
RegionColors[2] = '#CCCC99';
RegionColors[3] = '#CCCC99';
RegionColors[4] = '#FFCCCC';
RegionColors[5] = '#FF99CC';
RegionColors[6] = '#CC99CC';
RegionColors[7] = '#FFFF99';
RegionColors[8] = '#CC9966';
RegionColors[9] = '#CC9966';

$('#MyTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 10, 25, 50, 100 ],
					[ 10, 25, 50, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'device!list.action',
	'aoColumns' : [ {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : common.view.position, 'mData' : 'position', 'bSortable' : false, 'sWidth' : '25%' }, 
					{'sTitle' : common.view.onlineflag, 'mData' : 'onlineflag', 'bSortable' : false, 'sWidth' : '10%' }, 
					//{'sTitle' : common.view.layoutschedule, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '10%' }, 
					//{'sTitle' : common.view.regionschedule, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : common.view.bundleschedule, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : common.view.sync, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '5%' }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		if (aData.status == 9) {
			$('td:eq(3)', nRow).html('<span class="label label-sm label-default">' + common.view.unregister + '</span>');
		} else if (aData.onlineflag == 9) {
			$('td:eq(3)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
		} else if (aData.onlineflag == 1) {
			$('td:eq(3)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
		} else if (aData.onlineflag == 0) {
			$('td:eq(3)', nRow).html('<span class="label label-sm label-info">' + common.view.idle + '</span>');
		}
		
		//$('td:eq(4)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-layoutschedule"><i class="fa fa-calendar-o"></i> ' + common.view.layoutschedule + '</a>');
		//$('td:eq(5)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-regionschedule"><i class="fa fa-calendar"></i> ' + common.view.regionschedule + '</a>');
		$('td:eq(4)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-bundleschedule"><i class="fa fa-calendar-o"></i> ' + common.view.bundleschedule + '</a>');
		$('td:eq(5)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>');

		return nRow;
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'devicegroupid','value':0 });
	}
});

jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').select2();

/*
$.ajax({
	type : 'POST',
	url : 'layout!list.action',
	data : {},
	success : function(data, status) {
		if (data.errorcode == 0) {
			Layouts = data.aaData;
			var layoutTableHtml = '';
			layoutTableHtml += '<tr>';
			for (var i=0; i<Layouts.length; i++) {
				layoutTableHtml += '<td style="padding: 0px 20px 0px 0px;"><canvas id="LayoutCanvas' + Layouts[i].layoutid + '"></canvas></td>';
			}
			layoutTableHtml += '</tr>';
			layoutTableHtml += '<tr>';
			for (var i=0; i<Layouts.length; i++) {
				layoutTableHtml += '<td>';
				layoutTableHtml += '<label class="radio-inline">';
				if (i == 0) {
					layoutTableHtml += '<input type="radio" name="layoutid" value="' + Layouts[i].layoutid + '" checked>';
				} else {
					layoutTableHtml += '<input type="radio" name="layoutid" value="' +Layouts[i].layoutid + '">';
				}
				layoutTableHtml += Layouts[i].name + '</label>';
				layoutTableHtml += '</td>';
			}
			layoutTableHtml += '</tr>';
			$('#LayoutTable').html(layoutTableHtml);
			
			for (var i=0; i<Layouts.length; i++) {
				var layout = Layouts[i];
				var canvas = document.getElementById('LayoutCanvas' + layout.layoutid);
				var ctx = canvas.getContext('2d');
				var scale;
				if (layout.width == 1920 || layout.width == 1080) {
					scale = 1920/160;
				} else {
					scale = 800/160;
				}
				canvas.width = layout.width/scale;
				canvas.height = layout.height/scale;

				if (layout.bgimage != null) {
					var layout_bgimage = new Image();
					layout_bgimage.src = '/pixsigdata' + layout.bgimage.filepath;
					layout_bgimage.onload = function(img, layout, ctx, canvaswidth, canvasheight) {
						return function() {
							//ctx.globalAlpha = 0.2;
							ctx.drawImage(img, 0, 0, canvaswidth, canvasheight);
							for (var j=0; j<layout.layoutdtls.length; j++) {
								var layoutdtl = layout.layoutdtls[j];
								var width = layoutdtl.width/scale;
								var height = layoutdtl.height/scale;
								var top = layoutdtl.topoffset/scale;
								var left = layoutdtl.leftoffset/scale;
								drawCanvasRegion(ctx, layoutdtl, left, top, width, height, false);
							}
						}
					}(layout_bgimage, layout, ctx, canvas.width, canvas.height);
				} else {
					for (var j=0; j<layout.layoutdtls.length; j++) {
						var layoutdtl = layout.layoutdtls[j];
						var width = layoutdtl.width/scale;
						var height = layoutdtl.height/scale;
						var top = layoutdtl.topoffset/scale;
						var left = layoutdtl.leftoffset/scale;
						drawCanvasRegion(ctx, layoutdtl, left, top, width, height, true);
					}
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

$.ajax({
	type : 'POST',
	url : 'layout!regionlist.action',
	data : {
		active: 'true'
	},
	success : function(data, status) {
		if (data.errorcode == 0) {
			Regions = data.aaData;
		} else {
			alert(data.errorcode + ": " + data.errormsg);
		}
	},
	error : function() {
		alert('failure');
	}
});
*/

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
					bootbox.alert(common.tips.error);
				}
			});				
		}
	});
});

/*
//LayoutSchedule Edit
function drawCanvasRegion(ctx, layoutdtl, left, top, width, height, fill) {
	if (layoutdtl.bgimage != null) {
		var region_bgimage = new Image();
		region_bgimage.src = '/pixsigdata' + layoutdtl.bgimage.filepath;
		region_bgimage.onload = function(img, ctx, left, top, width, height) {
			return function() {
				ctx.drawImage(img, left, top, width, height);
			}
		}(region_bgimage, ctx, left, top, width, height);
	} else {
		if (fill) {
			ctx.fillStyle = RegionColors[layoutdtl.regionid];
			ctx.fillRect(left,top,width,height);
		}
	}
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 2;
	ctx.strokeRect(left,top,width,height);
};

function refreshLayoutScheduleDetail() {
	$('#LayoutScheduleDetail').empty();
	if (currentLayoutschedules.length > 0) {
		var scheduleTabHtml = '<h3></h3><ul class="timeline">';
		for (var i=0; i<currentLayoutschedules.length; i++) {
			var schedule = currentLayoutschedules[i];
			scheduleTabHtml += '<li class="timeline-grey">';
			scheduleTabHtml += '<div class="timeline-time">';
			scheduleTabHtml += '<span class="time">' + schedule.starttime.substring(0,5) + ' </span>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '<div class="timeline-icon"><i class="fa fa-video-camera"></i></div>';
			scheduleTabHtml += '<div class="timeline-body">';
			scheduleTabHtml += '<div class="timeline-content">';
			scheduleTabHtml += '<div class="row"><div class="col-md-5 col-sm-5"><h2>' + schedule.layout.name + '</h2></div>';
			scheduleTabHtml += '<div class="col-md-5 col-sm-5"><canvas id="LayoutCanvas-'+ schedule.layoutscheduleid + '"></canvas></div>';
			scheduleTabHtml += '<div class="col-md-2 col-sm-2"><a href="javascript:;" class="btn btn-sm red pull-right pix-del-layoutschedule" data-id="'+ i + '">' + common.view.remove + '<i class="fa fa-trash-o"></i></a></div>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '</li>';
		}
		scheduleTabHtml += '</ul>';
	} else {
		var scheduleTabHtml = '<h3>' + common.tips.device_layoutschedule_zero + '</h3>';
	}
	$('#LayoutScheduleDetail').html(scheduleTabHtml);

	for (var i=0; i<currentLayoutschedules.length; i++) {
		var schedule = currentLayoutschedules[i];
		var canvas = document.getElementById('LayoutCanvas-' + schedule.layoutscheduleid);
		var layout = schedule.layout;
		var ctx = canvas.getContext('2d');
		var scale;
		if (layout.width == 1920 || layout.width == 1080) {
			scale = 1920/250;
		} else {
			scale = 800/250;
		}
		canvas.width = layout.width/scale;
		canvas.height = layout.height/scale;
		
		if (layout.bgimage != null) {
			var layout_bgimage = new Image();
			layout_bgimage.src = '/pixsigdata' + layout.bgimage.filepath;
			layout_bgimage.onload = function(img, layout, ctx, canvaswidth, canvasheight) {
				return function() {
					//ctx.globalAlpha = 0.2;
					ctx.drawImage(img, 0, 0, canvaswidth, canvasheight);
					for (var j=0; j<layout.layoutdtls.length; j++) {
						var layoutdtl = layout.layoutdtls[j];
						var width = layoutdtl.width/scale;
						var height = layoutdtl.height/scale;
						var top = layoutdtl.topoffset/scale;
						var left = layoutdtl.leftoffset/scale;
						drawCanvasRegion(ctx, layoutdtl, left, top, width, height, false);
					}
				}
			}(layout_bgimage, layout, ctx, canvas.width, canvas.height);
		} else {
			for (var j=0; j<layout.layoutdtls.length; j++) {
				var layoutdtl = layout.layoutdtls[j];
				var width = layoutdtl.width/scale;
				var height = layoutdtl.height/scale;
				var top = layoutdtl.topoffset/scale;
				var left = layoutdtl.leftoffset/scale;
				drawCanvasRegion(ctx, layoutdtl, left, top, width, height, true);
			}
		}
	}
}

$('body').on('click', '.pix-layoutschedule', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	currentDevice = $('#MyTable').dataTable().fnGetData(index);
	currentDeviceid = currentDevice.deviceid;
	
	$.ajax({
		type : 'GET',
		url : 'layoutschedule!list.action',
		data : {
			bindtype: '1',
			bindid: currentDeviceid
		},
		beforeSend: function ( xhr ) {
			Metronic.startPageLoading({animate: true});
		},
		success : function(data, status) {
			Metronic.stopPageLoading();
			if (data.errorcode == 0) {
				$('.layout-edit').css('display', 'none');
				$('.layout-view').css('display', 'block');				
				currentLayoutschedules = data.aaData;
				refreshLayoutScheduleDetail();
				$('#LayoutScheduleModal').modal();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			Metronic.stopPageLoading();
			bootbox.alert(common.tips.error);
		}
	});
});

$('body').on('click', '.pix-add-layoutschedule', function(event) {
	$('.layout-edit').css('display', 'block');
	$('.layout-view').css('display', 'none');				
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	$('#LayoutScheduleForm input[name="starttime"]').attr('value', '');
});

FormValidateOption.rules = {};
FormValidateOption.rules['starttime'] = {};
FormValidateOption.rules['starttime']['required'] = true;
FormValidateOption.rules['layoutid'] = {};
FormValidateOption.rules['layoutid']['required'] = true;
$('#LayoutScheduleForm').validate(FormValidateOption);
$.extend($('#LayoutScheduleForm').validate().settings, {
	rules: FormValidateOption.rules
});
$('#LayoutScheduleForm .pix-ok').on('click', function(event) {
	if ($('#LayoutScheduleForm').valid()) {
		$('.layout-edit').css('display', 'none');
		$('.layout-view').css('display', 'block');
		
		var starttime = $('#LayoutScheduleForm input[name=starttime]').val();
		var layoutschedules = currentLayoutschedules.filter(function (el) {
			return (el.starttime == starttime);
		});
		var layoutid = $('#LayoutScheduleForm input[name=layoutid]:checked').attr("value");
		var layoutsels = Layouts.filter(function (el) {
			return (el.layoutid == layoutid);
		});
		if (layoutschedules.length > 0) {
			layoutschedules[0].playmode = $('#LayoutScheduleForm input[name=playmode]:checked').attr("value");
			layoutschedules[0].layoutid = layoutid;
			layoutschedules[0].layout = layoutsels[0];
		} else {
			var layoutschedule = {};
			layoutschedule.layoutscheduleid = 'L' + Math.round(Math.random()*100000000);
			layoutschedule.bindtype = 1;
			layoutschedule.bindid = currentDeviceid;
			layoutschedule.layoutid = layoutid;
			layoutschedule.playmode = $('#LayoutScheduleForm input[name=playmode]:checked').attr("value");
			layoutschedule.starttime = $('#LayoutScheduleForm input[name=starttime]').val();
			layoutschedule.layout = layoutsels[0];
			currentLayoutschedules[currentLayoutschedules.length] = layoutschedule;

			currentLayoutschedules.sort(function(a, b) {
				return (a.starttime > b.starttime);
			});
		}
		refreshLayoutScheduleDetail();
	}
});
$('#LayoutScheduleForm .pix-cancel').on('click', function(event) {
	$('.layout-edit').css('display', 'none');
	$('.layout-view').css('display', 'block');				
});

$('body').on('click', '.pix-del-layoutschedule', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	currentLayoutschedules.splice(index, 1);
	refreshLayoutScheduleDetail();
});

$('[type=submit]', $('#LayoutScheduleModal')).on('click', function(event) {
	for (var i=0; i<currentLayoutschedules.length; i++) {
		if (('' + currentLayoutschedules[i].layoutscheduleid).indexOf('L') == 0) {
			currentLayoutschedules[i].layoutscheduleid = '0';
		}
	}
	$.ajax({
		type : 'POST',
		url : 'layout!addlayoutschedules',
		data : '{"devices":[' + $.toJSON(currentDevice) + '], "layoutschedules":' + $.toJSON(currentLayoutschedules) + '}',
		dataType : 'json',
		contentType : 'application/json;charset=utf-8',
		beforeSend: function ( xhr ) {
			Metronic.startPageLoading({animate: true});
		},
		success : function(data, status) {
			Metronic.stopPageLoading();
			$('#LayoutScheduleModal').modal('hide');
			if (data.errorcode == 0) {
				bootbox.alert(common.tips.success);
				$('#MyTable').dataTable()._fnAjaxUpdate();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			$('#LayoutScheduleModal').modal('hide');
			bootbox.alert(common.tips.error);
		}
	});

	event.preventDefault();
});	


//RegionSchedule Edit
function refreshRegionScheduleDetail() {
	$('#RegionScheduleDetail').empty();
	var schedules = currentRegionschedules.filter(function (el) {
		return (el.regionid == currentRegion.regionid);
	});
	if (schedules.length > 0) {
		var scheduleTabHtml = '<ul class="timeline">';
		for (var i=0; i<currentRegionschedules.length; i++) {
			var schedule = currentRegionschedules[i];
			if (schedule.regionid != currentRegion.regionid) {
				continue;
			}
			if (schedule.objtype == 1) {
				scheduleTabHtml += '<li class="timeline-green">';
			} else if (schedule.objtype == 2) {
				scheduleTabHtml += '<li class="timeline-blue">';
			} else if (schedule.objtype == 3) {
				scheduleTabHtml += '<li class="timeline-yellow">';
			} else if (schedule.objtype == 4) {
				scheduleTabHtml += '<li class="timeline-purple">';
			} else if (schedule.objtype == 5) {
				scheduleTabHtml += '<li class="timeline-grey">';
			}
			scheduleTabHtml += '<div class="timeline-time">';
			scheduleTabHtml += '<span class="time">' + schedule.starttime.substring(0,5) + ' </span>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '<div class="timeline-icon"><i class="fa fa-video-camera"></i></div>';
			scheduleTabHtml += '<div class="timeline-body">';
			if (schedule.objtype == 1) {
				scheduleTabHtml += '<h2>' + common.view.medialist + ' ' + schedule.medialist.name + '</h2>';
				scheduleTabHtml += '<div class="timeline-content">';
				for (var j=0; j<schedule.medialist.medialistdtls.length; j++) {
					var medialistdtl = schedule.medialist.medialistdtls[j];
					if (j % 6 == 0) {
						scheduleTabHtml += '<div class="row">';
					}
					scheduleTabHtml += '<div class="col-md-2 col-xs-2">';
					if (medialistdtl.objtype == 1) {
						if (medialistdtl.video.thumbnail == null) {
							scheduleTabHtml += '<img src="../local/img/video.jpg" alt="' + medialistdtl.video.name + '" width="100%" />';
						} else {
							scheduleTabHtml += '<img src="/pixsigdata' + medialistdtl.video.thumbnail + '" alt="' + medialistdtl.video.name + '" width="100%" />';
						}
						scheduleTabHtml += '<h6>' + medialistdtl.video.name + '</h6>';
					} else if (medialistdtl.objtype == 2) {
						scheduleTabHtml += '<img src="/pixsigdata' + medialistdtl.image.filepath + '" alt="' + medialistdtl.image.name + '" width="100%" />';
						scheduleTabHtml += '<h6>' + medialistdtl.image.name + '</h6>';
					}
					scheduleTabHtml += '</div>';
					if ((j+1) % 6 == 0 || (j+1) == schedule.medialist.medialistdtls.length) {
						scheduleTabHtml += '</div>';
					}
				}						
				scheduleTabHtml += '</div>';
			} else if (schedule.objtype == 2) {
				scheduleTabHtml += '<h2>' + common.view.text + ' ' + schedule.text.name + '</h2>';
				scheduleTabHtml += '<div class="timeline-content">' + schedule.text.text + '</div>';
			} else if (schedule.objtype == 3) {
				scheduleTabHtml += '<h2>' + common.view.stream + ' ' + schedule.stream.name + '</h2>';
				scheduleTabHtml += '<div class="timeline-content">' + schedule.stream.url + '</div>';
			} else if (schedule.objtype == 4) {
				scheduleTabHtml += '<h2>' + common.view.dvb + ' ' + schedule.dvb.name + '</h2>';
				scheduleTabHtml += '<div class="timeline-content">' + schedule.dvb.frequency + 'MHz</div>';
			} else if (schedule.objtype == 5) {
				scheduleTabHtml += '<h2>Widget：' + schedule.widget.name + '</h2>';
				scheduleTabHtml += '<div class="timeline-content">' + schedule.widget.url + '</div>';
			}
			scheduleTabHtml += '<div class="timeline-footer">';
			scheduleTabHtml += '<a href="javascript:;" class="btn btn-sm red pull-right pix-del-regionschedule" data-id="'+ i + '">' + common.view.remove + '<i class="fa fa-trash-o"></i></a>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '</li>';
		}
	} else {
		var scheduleTabHtml = '<h3>' + common.tips.regionschedule_zero + '</h3>';
	}
	$('#RegionScheduleDetail').html(scheduleTabHtml);
}

function refreshRegionDtlSelect() {
	var url;
	if ($('#RegionScheduleForm input[name="objtype"]:checked').val() == 1) {
		url = 'medialist!list.action';
	} else if ($('#RegionScheduleForm input[name="objtype"]:checked').val() == 2) {
		url = 'text!list.action';
	} else if ($('#RegionScheduleForm input[name="objtype"]:checked').val() == 3) {
		url = 'stream!list.action';
	} else if ($('#RegionScheduleForm input[name="objtype"]:checked').val() == 4) {
		url = 'dvb!list.action';
	} else if ($('#RegionScheduleForm input[name="objtype"]:checked').val() == 5) {
		url = 'widget!list.action';
	}
	$('#RegionDtlSelect').select2({
		placeholder: common.tips.detail_select,
		//minimumResultsForSearch: -1,
		minimumInputLength: 0,
		ajax: { 
			url: url,
			type: 'GET',
			dataType: 'json',
			data: function (term, page) {
				return {
					sSearch: term, 
					iDisplayStart: (page-1)*10,
					iDisplayLength: 10,
				};
			},
			results: function (data, page) {
				var more = (page * 10) < data.iTotalRecords; 
				return {
					results : $.map(data.aaData, function (item) {
						if (item.medialistid) {
							return {
								name:item.name, 
								id:item.medialistid,
								medialist:item
							};
						} else if (item.textid) {
							return {
								name:item.name, 
								id:item.textid,
								text:item
							};
						} else if (item.streamid) {
							return {
								name:item.name + '(' + item.url + ')', 
								id:item.streamid,
								stream:item
							};
						} else if (item.dvbid) {
							return {
								name:item.name, 
								id:item.dvbid,
								dvb:item
							};
						} else if (item.widgetid) {
							return {
								name:item.name + '(' + item.url + ')', 
								id:item.widgetid,
								widget:item
							};
						}
					}),
					more: more
				};
			}
		},
		formatResult: function (item) {
			if (item.medialist != null) {
				var html = '<div class="row"><div class="col-md-12 col-xs-12">' + item.name + '</div></div>';
				html += '<div class="row">';
				for (var i=0; i<item.medialist.medialistdtls.length; i++) {
					if (i >= 12) {
						break;
					}
					var medialistdtl = item.medialist.medialistdtls[i];
					html += '<div class="col-md-1 col-xs-1">';
					if (medialistdtl.objtype == 1) {
						if (medialistdtl.video.thumbnail == null) {
							html += '<img src="../local/img/video.jpg" alt="' + medialistdtl.video.name + '" width="100%" />';
						} else {
							html += '<img src="/pixsigdata' + medialistdtl.video.thumbnail + '" alt="' + medialistdtl.video.name + '" width="100%" />';
						}
					} else if (medialistdtl.objtype == 2) {
						html += '<img src="/pixsigdata' + medialistdtl.image.filepath + '" alt="' + medialistdtl.image.name + '" width="100%" />';
					}
					html += '</div>';
				}						
				html += '</div>';
				return html;
			} else {
				return item.name;
			}
		},
		formatSelection: function (item) {
			return item.name;				
		},
		initSelection: function(element, callback) {
		},
		dropdownCssClass: 'bigdrop', 
		escapeMarkup: function (m) { return m; } 
	});
	$('#RegionDtlSelect').val('');
}

$('body').on('click', '.pix-regionschedule', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	currentDevice = $('#MyTable').dataTable().fnGetData(index);
	currentDeviceid = currentDevice.deviceid;
	
	$.ajax({
		type : 'GET',
		url : 'regionschedule!list.action',
		data : {
			bindtype: '1',
			bindid: currentDeviceid
		},
		success : function(data, status) {
			if (data.errorcode == 0) {
				$('.region-edit').css('display', 'none');
				$('.region-view').css('display', 'block');				
				currentRegionschedules = data.aaData;
				currentRegion = Regions[0];

				var regionTabHtml = '<ul class="nav nav-tabs tabs-left">';
				for (var i=0; i<Regions.length; i++) {
					var region = Regions[i];
					if (i == 0) {
						regionTabHtml += '<li class="active">';
					} else {
						regionTabHtml += '<li>';
					}
					regionTabHtml += '<a href="#RegionScheduleDetail" class="pix-region" region-id="'+ region.regionid + '" region-type="'+ region.type + '" data-toggle="tab">' + region.name + '</a>';
					regionTabHtml += '</li>';
				}
				regionTabHtml += '</ul>';
				$('#LeftTab').html(regionTabHtml);

				refreshRegionScheduleDetail();
				$('#RegionScheduleModal').modal();
			} else {
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
		}
	});
});

$('body').on('click', '.pix-region', function(event) {
	var regionid = $(event.target).attr('region-id');
	if (regionid == undefined) {
		regionid = $(event.target).parent().attr('region-id');
	}
	currentRegion = Regions.filter(function (el) {
		return (el.regionid == regionid);
	})[0];
	refreshRegionScheduleDetail();
});

$('#RegionScheduleForm input[name="objtype"]').click(function(e) {
	refreshRegionDtlSelect();
});

$('body').on('click', '.pix-add-regionschedule', function(event) {
	$('.region-edit').css('display', 'block');
	$('.region-view').css('display', 'none');				
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	$('#RegionScheduleForm input[name="starttime"]').attr('value', '');
	var objtype = $('#RegionScheduleForm input[name="objtype"]:checked').val();
	if (currentRegion.type == 0) {
		$('.objtype-0').css('display', 'block');
		$('.objtype-1').css('display', 'none');
		if (objtype == 2) {
			$('#RegionScheduleForm input[name="objtype"][value="1"]').attr('checked', true);
			$('#RegionScheduleForm input[name="objtype"][value="1"]').parent().addClass('checked');
			$('#RegionScheduleForm input[name="objtype"][value="2"]').attr('checked', false);
			$('#RegionScheduleForm input[name="objtype"][value="2"]').parent().removeClass('checked');
		}
	} else if (currentRegion.type == 1) {
		$('.objtype-0').css('display', 'none');
		$('.objtype-1').css('display', 'block');
		if (objtype != 2) {
			$('#RegionScheduleForm input[name="objtype"][value="2"]').attr('checked', true);
			$('#RegionScheduleForm input[name="objtype"][value="2"]').parent().addClass('checked');
			$('#RegionScheduleForm input[name="objtype"][value="' + objtype + '"]').attr('checked', false);
			$('#RegionScheduleForm input[name="objtype"][value="' + objtype + '"]').parent().removeClass('checked');
		}
	}
	refreshRegionDtlSelect();
});

FormValidateOption.rules = {};
FormValidateOption.rules['starttime'] = {};
FormValidateOption.rules['starttime']['required'] = true;
FormValidateOption.rules['objid'] = {};
FormValidateOption.rules['objid']['required'] = true;
$('#RegionScheduleForm').validate(FormValidateOption);
$.extend($('#RegionScheduleForm').validate().settings, {
	rules: FormValidateOption.rules
});
$('#RegionScheduleForm .pix-ok').on('click', function(event) {
	if ($('#RegionScheduleForm').valid()) {
		$('.region-edit').css('display', 'none');
		$('.region-view').css('display', 'block');
		
		var starttime = $('#RegionScheduleForm input[name=starttime]').val();
		var regionschedules = currentRegionschedules.filter(function (el) {
			return (el.regionid == currentRegion.regionid && el.starttime == starttime);
		});
		var objtype = $('#RegionScheduleForm input[name=objtype]:checked').attr("value");
		if (regionschedules.length > 0) {
			regionschedules[0].playmode = $('#RegionScheduleForm input[name=playmode]:checked').attr("value");
			regionschedules[0].objtype = objtype;
			regionschedules[0].objid = $('#RegionDtlSelect').val();
			if (objtype == 1) {
				regionschedules[0].medialist = $('#RegionDtlSelect').select2('data').medialist;
			} else if (objtype == 2) {
				regionschedules[0].text = $('#RegionDtlSelect').select2('data').text;
			} else if (objtype == 3) {
				regionschedules[0].stream = $('#RegionDtlSelect').select2('data').stream;
			} else if (objtype == 4) {
				regionschedules[0].dvb = $('#RegionDtlSelect').select2('data').dvb;
			} else if (objtype == 5) {
				regionschedules[0].widget = $('#RegionDtlSelect').select2('data').widget;
			}
		} else {
			var regionschedule = {};
			regionschedule.regionscheduleid = 'R' + Math.round(Math.random()*100000000);
			regionschedule.regionid = currentRegion.regionid;
			regionschedule.bindtype = 1;
			regionschedule.bindid = currentDeviceid;
			regionschedule.playmode = $('#RegionScheduleForm input[name=playmode]:checked').attr("value");
			regionschedule.starttime = $('#RegionScheduleForm input[name=starttime]').val();
			regionschedule.objtype = objtype;
			regionschedule.objid = $('#RegionDtlSelect').val();
			if (objtype == 1) {
				regionschedule.medialist = $('#RegionDtlSelect').select2('data').medialist;
			} else if (objtype == 2) {
				regionschedule.text = $('#RegionDtlSelect').select2('data').text;
			} else if (objtype == 3) {
				regionschedule.stream = $('#RegionDtlSelect').select2('data').stream;
			} else if (objtype == 4) {
				regionschedule.dvb = $('#RegionDtlSelect').select2('data').dvb;
			} else if (objtype == 5) {
				regionschedule.widget = $('#RegionDtlSelect').select2('data').widget;
			}
			currentRegionschedules[currentRegionschedules.length] = regionschedule;

			currentRegionschedules.sort(function(a, b) {
				return (a.regionid <= b.regionid && a.starttime > b.starttime);
			});
		}
		refreshRegionScheduleDetail();
	}
});
$('#RegionScheduleForm .pix-cancel').on('click', function(event) {
	$('.region-edit').css('display', 'none');
	$('.region-view').css('display', 'block');				
});

$('body').on('click', '.pix-del-regionschedule', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	currentRegionschedules.splice(index, 1);
	refreshRegionScheduleDetail();
});

$('[type=submit]', $('#RegionScheduleModal')).on('click', function(event) {
	for (var i=0; i<currentRegionschedules.length; i++) {
		if (('' + currentRegionschedules[i].regionscheduleid).indexOf('R') == 0) {
			currentRegionschedules[i].regionscheduleid = '0';
		}
	}
	$.ajax({
		type : 'POST',
		url : 'layout!addregionschedules',
		data : '{"devices":[' + $.toJSON(currentDevice) + '], "regionschedules":' + $.toJSON(currentRegionschedules) + '}',
		dataType : 'json',
		contentType : 'application/json;charset=utf-8',
		beforeSend: function ( xhr ) {
			Metronic.startPageLoading({animate: true});
		},
		success : function(data, status) {
			Metronic.stopPageLoading();
			$('#RegionScheduleModal').modal('hide');
			if (data.errorcode == 0) {
				bootbox.alert(common.tips.success);
				$('#MyTable').dataTable()._fnAjaxUpdate();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			$('#RegionScheduleModal').modal('hide');
			bootbox.alert(common.tips.error);
		}
	});

	event.preventDefault();
});	
*/

//BundleSchedule Edit
function refreshBundleScheduleDetail() {
	$('#BundleScheduleDetail').empty();
	if (currentBundleschedules.length > 0) {
		var scheduleTabHtml = '<h3></h3><ul class="timeline">';
		for (var i=0; i<currentBundleschedules.length; i++) {
			var schedule = currentBundleschedules[i];
			scheduleTabHtml += '<li class="timeline-grey">';
			scheduleTabHtml += '<div class="timeline-time">';
			scheduleTabHtml += '<span class="time">' + schedule.starttime.substring(0,5) + ' </span>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '<div class="timeline-icon"><i class="fa fa-video-camera"></i></div>';
			scheduleTabHtml += '<div class="timeline-body">';
			scheduleTabHtml += '<div class="timeline-content">';
			scheduleTabHtml += '<div class="row"><div class="col-md-5 col-sm-5"><h2>' + schedule.bundle.name + '</h2></div>';
			scheduleTabHtml += '<div class="col-md-5 col-sm-5"><div id="BundlescheduleDiv-'+ schedule.bundlescheduleid + '"></div></div>';
			scheduleTabHtml += '<div class="col-md-2 col-sm-2"><a href="javascript:;" class="btn btn-sm red pull-right pix-del-bundleschedule" data-id="'+ i + '">' + common.view.remove + '<i class="fa fa-trash-o"></i></a></div>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '</li>';
		}
		scheduleTabHtml += '</ul>';
	} else {
		var scheduleTabHtml = '<h3>' + common.tips.device_bundleschedule_zero + '</h3>';
	}
	$('#BundleScheduleDetail').html(scheduleTabHtml);

	for (var i=0; i<currentBundleschedules.length; i++) {
		var schedule = currentBundleschedules[i];
		var bundle = schedule.bundle;
		redrawBundlePreview($('#BundlescheduleDiv-'+ schedule.bundlescheduleid), bundle, 250);
	}
}

$.ajax({
	type : 'POST',
	url : 'bundle!list.action',
	data : {},
	success : function(data, status) {
		if (data.errorcode == 0) {
			Bundles = data.aaData;
			var bundleTableHtml = '';
			bundleTableHtml += '<tr>';
			for (var i=0; i<Bundles.length; i++) {
				bundleTableHtml += '<td style="padding: 0px 20px 0px 0px;"><div id="BundleDiv-' + Bundles[i].bundleid + '"></div></td>';
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
			
			for (var i=0; i<Bundles.length; i++) {
				var bundle = Bundles[i];
				redrawBundlePreview($('#BundleDiv-' + bundle.bundleid), bundle, 200);
			}
		} else {
			alert(data.errorcode + ": " + data.errormsg);
		}
	},
	error : function() {
		alert('failure');
	}
});

$('body').on('click', '.pix-bundleschedule', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	currentDevice = $('#MyTable').dataTable().fnGetData(index);
	currentDeviceid = currentDevice.deviceid;
	
	$.ajax({
		type : 'GET',
		url : 'bundleschedule!list.action',
		data : {
			bindtype: '1',
			bindid: currentDeviceid
		},
		beforeSend: function ( xhr ) {
			Metronic.startPageLoading({animate: true});
		},
		success : function(data, status) {
			Metronic.stopPageLoading();
			if (data.errorcode == 0) {
				$('.bundle-edit').css('display', 'none');
				$('.bundle-view').css('display', 'block');				
				currentBundleschedules = data.aaData;
				refreshBundleScheduleDetail();
				$('#BundleScheduleModal').modal();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			Metronic.stopPageLoading();
			bootbox.alert(common.tips.error);
		}
	});
});

$('body').on('click', '.pix-add-bundleschedule', function(event) {
	$('.bundle-edit').css('display', 'block');
	$('.bundle-view').css('display', 'none');				
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	$('#BundleScheduleForm input[name="starttime"]').attr('value', '');
});

FormValidateOption.rules = {};
FormValidateOption.rules['starttime'] = {};
FormValidateOption.rules['starttime']['required'] = true;
FormValidateOption.rules['bundleid'] = {};
FormValidateOption.rules['bundleid']['required'] = true;
$('#BundleScheduleForm').validate(FormValidateOption);
$.extend($('#BundleScheduleForm').validate().settings, {
	rules: FormValidateOption.rules
});
$('#BundleScheduleForm .pix-ok').on('click', function(event) {
	if ($('#BundleScheduleForm').valid()) {
		$('.bundle-edit').css('display', 'none');
		$('.bundle-view').css('display', 'block');
		
		var starttime = $('#BundleScheduleForm input[name=starttime]').val();
		var bundleschedules = currentBundleschedules.filter(function (el) {
			return (el.starttime == starttime);
		});
		var bundleid = $('#BundleScheduleForm input[name=bundleid]:checked').attr("value");
		var bundlesels = Bundles.filter(function (el) {
			return (el.bundleid == bundleid);
		});
		if (bundleschedules.length > 0) {
			bundleschedules[0].playmode = $('#BundleScheduleForm input[name=playmode]:checked').attr("value");
			bundleschedules[0].bundleid = bundleid;
			bundleschedules[0].bundle = bundlesels[0];
		} else {
			var bundleschedule = {};
			bundleschedule.bundlescheduleid = 'B' + Math.round(Math.random()*100000000);
			bundleschedule.bindtype = 1;
			bundleschedule.bindid = currentDeviceid;
			bundleschedule.bundleid = bundleid;
			bundleschedule.playmode = $('#BundleScheduleForm input[name=playmode]:checked').attr("value");
			bundleschedule.starttime = $('#BundleScheduleForm input[name=starttime]').val();
			bundleschedule.bundle = bundlesels[0];
			currentBundleschedules[currentBundleschedules.length] = bundleschedule;

			currentBundleschedules.sort(function(a, b) {
				return (a.starttime > b.starttime);
			});
		}
		refreshBundleScheduleDetail();
	}
});
$('#BundleScheduleForm .pix-cancel').on('click', function(event) {
	$('.bundle-edit').css('display', 'none');
	$('.bundle-view').css('display', 'block');				
});

$('body').on('click', '.pix-del-bundleschedule', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	currentBundleschedules.splice(index, 1);
	refreshBundleScheduleDetail();
});

$('[type=submit]', $('#BundleScheduleModal')).on('click', function(event) {
	for (var i=0; i<currentBundleschedules.length; i++) {
		if (('' + currentBundleschedules[i].bundlescheduleid).indexOf('B') == 0) {
			currentBundleschedules[i].bundlescheduleid = '0';
		}
	}
	$.ajax({
		type : 'POST',
		url : 'bundle!addbundleschedules',
		data : '{"devices":[' + $.toJSON(currentDevice) + '], "bundleschedules":' + $.toJSON(currentBundleschedules) + '}',
		dataType : 'json',
		contentType : 'application/json;charset=utf-8',
		beforeSend: function ( xhr ) {
			Metronic.startPageLoading({animate: true});
		},
		success : function(data, status) {
			Metronic.stopPageLoading();
			$('#BundleScheduleModal').modal('hide');
			if (data.errorcode == 0) {
				bootbox.alert(common.tips.success);
				$('#MyTable').dataTable()._fnAjaxUpdate();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			$('#BundleScheduleModal').modal('hide');
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
