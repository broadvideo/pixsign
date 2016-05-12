var currentBindtype = 2;
var currentBindid = 0;
var currentDeviceData;
var currentDevicegroupData;
var currentLayoutschedules;
var currentLayoutschedule;

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

function drawCanvasRegion(ctx, layoutdtl, left, top, width, height, fill) {
	if (layoutdtl.bgimage != null) {
		var region_bgimage = new Image();
		region_bgimage.src = '/pixsigdata' + layoutdtl.bgimage.thumbnail;
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

function refreshLayoutschedule() {
	if (currentBindid == 0) {
		$('.pix-addschedule').css('display', 'none');
		$('.pix-syncschedule').css('display', 'none');
		$('#DeviceDetail').html('');
		$('#ScheduleDetail').html('');
		return;
	}

	if (currentBindtype == 1) {
		$('#DeviceDetail').html('');
	} else if (currentBindtype == 2) {
		var devicehtml = '';
		for (var i=0; i<currentDevicegroupData.devices.length; i++) {
			devicehtml += currentDevicegroupData.devices[i].terminalid + ' ';
		}
		$('#DeviceDetail').html(devicehtml);
	}
	
	$('.pix-addschedule').css('display', 'block');
	$('.pix-syncschedule').css('display', 'block');
	$.ajax({
		type : 'GET',
		url : 'layoutschedule!list.action',
		data : {
			bindtype: currentBindtype,
			bindid: currentBindid
		},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var schedules = data.aaData;
				currentLayoutschedules = schedules;
				var scheduleTabHtml = '<ul class="timeline">';
				for (var i=0; i<schedules.length; i++) {
					var schedule = schedules[i];
					scheduleTabHtml += '<li class="timeline-grey">';
					scheduleTabHtml += '<div class="timeline-time">';
					scheduleTabHtml += '<span class="time">' + schedule.starttime.substring(0,5) + ' </span>';
					scheduleTabHtml += '</div>';
					scheduleTabHtml += '<div class="timeline-icon"><i class="fa fa-video-camera"></i></div>';
					scheduleTabHtml += '<div class="timeline-body">';
					scheduleTabHtml += '<div class="timeline-content">';
					scheduleTabHtml += '<div class="row"><div class="col-md-5 col-sm-5"><h2>' + schedule.layout.name + '</h2></div>';
					scheduleTabHtml += '<div class="col-md-5 col-sm-5"><canvas id="LayoutCanvas-'+ schedule.layoutscheduleid + '"></canvas></div>';
					scheduleTabHtml += '<div class="col-md-2 col-sm-2"><a href="javascript:;" class="btn btn-sm red pull-right pix-schedule-delete" data-id="'+ i + '">' + common.view.remove + '<i class="fa fa-trash-o"></i></a></div>';
					scheduleTabHtml += '</div>';
					scheduleTabHtml += '</div>';
					scheduleTabHtml += '</div>';
					scheduleTabHtml += '</li>';
				}
				$('#ScheduleDetail').html(scheduleTabHtml);
				
				for (var i=0; i<schedules.length; i++) {
					var schedule = schedules[i];
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
						layout_bgimage.src = '/pixsigdata' + layout.bgimage.thumbnail;
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
}

function refreshSelect() {
	if (currentBindtype == 1) {
		$('#DeviceSelect').select2({
			placeholder: common.tips.device_select,
			minimumInputLength: 0,
			ajax: {
				url: 'device!list.action',
				type: 'GET',
				dataType: 'json',
				data: function (term, page) {
					return {
						sSearch: term,
						iDisplayStart: (page-1)*10,
						iDisplayLength: 10,
						devicegroupid: 0,
					};
				},
				results: function (data, page) {
					var more = (page * 10) < data.iTotalRecords; 
					return {
						results : $.map(data.aaData, function (item) { 
							return { 
								text:item.name, 
								id:item.deviceid 
							};
						}),
						more: more
					};
				}
			},
			formatResult: function (device) {
				return device.text;
			},
			formatSelection: function (device) {
				return device.text;
			},
			initSelection: function (element, callback) {
				if (currentDeviceData != null) {
					callback({id : currentDeviceData.id, text : currentDeviceData.text});
				}
			},
			dropdownCssClass: "bigdrop",
			escapeMarkup: function (m) { return m; }
		});
		if (currentDeviceData == null) {
			$('#DeviceSelect').val('');
		}
	} else if (currentBindtype == 2) {
		$('#DeviceSelect').select2({
			placeholder: common.tips.devicegroup_select,
			minimumInputLength: 0,
			ajax: {
				url: 'devicegroup!list.action',
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
							return { 
								text:item.name, 
								id:item.devicegroupid,
								devices: item.devices
							};
						}),
						more: more
					};
				}
			},
			formatResult: function (device) {
				return device.text;
			},
			formatSelection: function (device) {
				return device.text;
			},
			initSelection: function (element, callback) {
				if (currentDevicegroupData != null) {
					callback({id : currentDevicegroupData.id, text : currentDevicegroupData.text});
				}
			},
			dropdownCssClass: "bigdrop",
			escapeMarkup: function (m) { return m; }
		});
		if (currentDevicegroupData == null) {
			$('#DeviceSelect').val('');
		}
	}
}

function initLayoutSchedules() {
	$('.pix-addschedule').css('display', 'none');
	$('.pix-syncschedule').css('display', 'none');
	refreshSelect();
	
	$('body').on('click', '#DeviceTab', function(event) {
		currentBindtype = 1;
		if (currentDeviceData != null) {
			currentBindid = currentDeviceData.id;
		} else {
			currentBindid = 0;
		}
		refreshSelect();
		refreshLayoutschedule();
	});

	$('body').on('click', '#DevicegroupTab', function(event) {
		currentBindtype = 2;
		if (currentDevicegroupData != null) {
			currentBindid = currentDevicegroupData.id;
		} else {
			currentBindid = 0;
		}
		refreshSelect();
		refreshLayoutschedule();
	});

	$("#DeviceSelect").on("change", function(e) {
		currentBindid = $(this).select2('data').id;
		if (currentBindtype == 1) {
			currentDeviceData = $(this).select2('data');
		} else if (currentBindtype == 2) {
			currentDevicegroupData = $(this).select2('data');
		}
		refreshLayoutschedule();
	});	

	$.ajax({
		type : 'POST',
		url : 'layout!list.action',
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var layouts = data.aaData;
				var layoutTableHtml = '';
				layoutTableHtml += '<tr>';
				for (var i=0; i<layouts.length; i++) {
					layoutTableHtml += '<td style="padding: 0px 20px 0px 0px;"><canvas id="LayoutCanvas' + layouts[i].layoutid + '"></canvas></td>';
				}
				layoutTableHtml += '</tr>';
				layoutTableHtml += '<tr>';
				for (var i=0; i<layouts.length; i++) {
					layoutTableHtml += '<td>';
					layoutTableHtml += '<label class="radio-inline">';
					if (i == 0) {
						layoutTableHtml += '<input type="radio" name="layoutschedule.layoutid" value="' + layouts[i].layoutid + '" checked>';
					} else {
						layoutTableHtml += '<input type="radio" name="layoutschedule.layoutid" value="' +layouts[i].layoutid + '">';
					}
					layoutTableHtml += layouts[i].name + '</label>';
					layoutTableHtml += '</td>';
				}
				layoutTableHtml += '</tr>';
				$('#LayoutTable').html(layoutTableHtml);
				
				for (var i=0; i<layouts.length; i++) {
					var layout = layouts[i];
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
						layout_bgimage.src = '/pixsigdata' + layout.bgimage.thumbnail;
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

	FormValidateOption.rules['layoutschedule.starttime'] = {};
	FormValidateOption.rules['layoutschedule.starttime']['required'] = true;
	FormValidateOption.rules['layoutschedule.layoutid'] = {};
	FormValidateOption.rules['layoutschedule.layoutid']['required'] = true;
	FormValidateOption.ignore = null;
	FormValidateOption.submitHandler = function(form) {
		$.ajax({
			type : 'POST',
			url : 'layoutschedule!add.action',
			data : $('#ScheduleForm').serialize(),
			dataType: 'json',
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#ScheduleModal').modal('hide');
					bootbox.alert(common.tips.success);
					refreshLayoutschedule();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert(common.tips.error);
			}
		});
	};
	$('#ScheduleForm').validate(FormValidateOption);
	
	$('[type=submit]', $('#ScheduleModal')).on('click', function(event) {
		$('#ScheduleForm input[name="layoutschedule.bindtype"]').attr('value', currentBindtype);
		$('#ScheduleForm input[name="layoutschedule.bindid"]').attr('value', currentBindid);
		if ($('#ScheduleForm').valid()) {
			$('#ScheduleForm').submit();
		}
	});
	
	$('body').on('click', '.pix-addschedule', function(event) {
		$('#ScheduleForm input[name="layoutschedule.starttime"]').attr('value', '');
		$('#ScheduleModal').modal();
	});

	$('body').on('click', '.pix-syncschedule', function(event) {
		$.ajax({
			type : 'POST',
			url : 'layoutschedule!sync.action',
			data : {
				bindtype: currentBindtype,
				bindid: currentBindid,
			},
			dataType: 'json',
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
	});

	$('body').on('click', '.pix-schedule-delete', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		currentLayoutschedule = currentLayoutschedules[index];
		bootbox.confirm(common.tips.remove + currentLayoutschedule.starttime.substring(0, 5), function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : 'layoutschedule!delete.action',
					cache: false,
					data : {
						'layoutschedule.layoutscheduleid': currentLayoutschedule.layoutscheduleid
					},
					success : function(data, status) {
						if (data.errorcode == 0) {
							refreshLayoutschedule();
						} else {
							bootbox.alert(common.tips.error + data.errormsg);
						}
					},
					error : function() {
						bootbox.alert(common.tips.error);
					}
				});				
			}
		 });
		
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

}
