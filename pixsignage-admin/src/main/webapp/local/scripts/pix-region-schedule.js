var currentBindtype = 2;
var currentBindid = 0;
var currentDeviceData;
var currentDevicegroupData;
var currentRegionid = 0;
var currentRegiontype;
var currentRegionschedules;
var currentRegionschedule;

function refreshRegionTab() {
	$('.pix-addschedule').css('display', 'none');
	if (currentBindid == 0) {
		$('#RegionTab').html('');
		$('#ScheduleDetail').html('');
		return;
	}

	$.ajax({
		type : 'POST',
		url : 'layout!regionlist.action',
		data : {
			active: 'true'
		},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var regions = data.aaData;
				var regionTabHtml = '<ul class="nav nav-tabs tabs-left">';
				for (var i=0; i<regions.length; i++) {
					var region = regions[i];
					if (i == 0) {
						regionTabHtml += '<li class="active">';
						currentRegionid = region.regionid;
						currentRegiontype = region.type;
						refreshRegionschedule();
					} else {
						regionTabHtml += '<li>';
					}
					regionTabHtml += '<a href="#ScheduleDetail" class="pix-region" region-id="'+ region.regionid + '" region-type="'+ region.type + '" data-toggle="tab">' + region.name + '</a>';
					regionTabHtml += '</li>';
				}
				regionTabHtml += '</ul>';
				$('#RegionTab').html(regionTabHtml);
			} else {
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
		}
	});

	$('body').on('click', '.pix-region', function(event) {
		var regionid = $(event.target).attr('region-id');
		var regiontype = $(event.target).attr('region-type');
		if (regionid == undefined) {
			regionid = $(event.target).parent().attr('region-id');
			regiontype = $(event.target).parent().attr('region-type');
		}
		if (currentRegionid != regionid) {
			currentRegionid = regionid;
			currentRegiontype = regiontype;
			refreshRegionschedule();
		}
	});
}

function refreshRegionschedule() {
	$('.pix-addschedule').css('display', 'block');
	$.ajax({
		type : 'GET',
		url : 'regionschedule!list.action',
		data : {
			bindtype: currentBindtype,
			bindid: currentBindid,
			regionid: currentRegionid,
			playmode: '2'
		},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var schedules = data.aaData;
				currentRegionschedules = schedules;
				var scheduleTabHtml = '<ul class="timeline">';
				for (var i=0; i<schedules.length; i++) {
					var schedule = schedules[i];
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
						scheduleTabHtml += '<h2>媒体列表：' + schedule.medialist.name + '</h2>';
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
								scheduleTabHtml += '<img src="/pixsigdata' + medialistdtl.image.filename + '" alt="' + medialistdtl.image.name + '" width="100%" />';
								scheduleTabHtml += '<h6>' + medialistdtl.image.name + '</h6>';
							}
							scheduleTabHtml += '</div>';
							if ((j+1) % 6 == 0 || (j+1) == schedule.medialist.medialistdtls.length) {
								scheduleTabHtml += '</div>';
							}
						}						
						scheduleTabHtml += '</div>';
					} else if (schedule.objtype == 2) {
						scheduleTabHtml += '<h2>文本：' + schedule.text.name + '</h2>';
						scheduleTabHtml += '<div class="timeline-content">' + schedule.text.text + '</div>';
					} else if (schedule.objtype == 3) {
						scheduleTabHtml += '<h2>视频流：' + schedule.stream.name + '</h2>';
						scheduleTabHtml += '<div class="timeline-content">' + schedule.stream.url + '</div>';
					} else if (schedule.objtype == 4) {
						scheduleTabHtml += '<h2>数字频道：' + schedule.dvb.name + '</h2>';
						scheduleTabHtml += '<div class="timeline-content">' + schedule.dvb.frequency + 'MHz</div>';
					} else if (schedule.objtype == 5) {
						scheduleTabHtml += '<h2>Widget：' + schedule.widget.name + '</h2>';
						scheduleTabHtml += '<div class="timeline-content">' + schedule.widget.url + '</div>';
					}
					scheduleTabHtml += '<div class="timeline-footer">';
					scheduleTabHtml += '<a href="javascript:;" class="btn btn-sm red pull-right pix-schedule-delete" data-id="'+ i + '">删除<i class="fa fa-trash-o"></i></a>';
					scheduleTabHtml += '</div>';
					scheduleTabHtml += '</div>';
					scheduleTabHtml += '</li>';
				}
				$('#ScheduleDetail').html(scheduleTabHtml);
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
		$("#DeviceSelect").select2({
			placeholder: "请选择终端",
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
	} else if (currentBindtype == 2) {
		$("#DeviceSelect").select2({
			placeholder: "请选择终端组",
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
								id:item.devicegroupid 
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
	}

	$("#DeviceSelect").on("change", function(e) {
		currentBindid = $(this).select2('data').id;
		if (currentBindtype == 1) {
			currentDeviceData = $(this).select2('data');
		} else if (currentBindtype == 2) {
			currentDevicegroupData = $(this).select2('data');
		}
		refreshRegionTab();
	});	

}

function refreshRegionDtlSelect() {
	var url;
	if ($('input[name="regionschedule.objtype"]:checked').val() == 1) {
		url = 'medialist!list.action';
	} else if ($('input[name="regionschedule.objtype"]:checked').val() == 2) {
		url = 'text!list.action';
	} else if ($('input[name="regionschedule.objtype"]:checked').val() == 3) {
		url = 'stream!list.action';
	} else if ($('input[name="regionschedule.objtype"]:checked').val() == 4) {
		url = 'dvb!list.action';
	} else if ($('input[name="regionschedule.objtype"]:checked').val() == 5) {
		url = 'widget!list.action';
	}
	$('#RegionDtlSelect').select2({
		placeholder: '请选择对应内容',
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
								text:item.name, 
								id:item.medialistid,
								item:item
							};
						} else if (item.textid) {
							return {
								text:item.name, 
								id:item.textid,
								item:item
							};
						} else if (item.streamid) {
							return {
								text:item.name + '(' + item.url + ')', 
								id:item.streamid,
								item:item
							};
						} else if (item.dvbid) {
							return {
								text:item.name, 
								id:item.dvbid,
								item:item
							};
						} else if (item.widgetid) {
							return {
								text:item.name + '(' + item.url + ')', 
								id:item.widgetid,
								item:item
							};
						}
					}),
					more: more
				};
			}
		},
		formatResult: function (item) {
			return item.text;
		},
		formatSelection: function (item) {
			return item.text;
		},
		initSelection: function(element, callback) {
		},
		dropdownCssClass: 'bigdrop', 
		escapeMarkup: function (m) { return m; } 
	});
	$('#RegionDtlSelect').val('');
}

function initRegionSchedules() {
	$('.pix-addschedule').css('display', 'none');
	refreshSelect();
	
	$('body').on('click', '#DeviceTab', function(event) {
		currentBindtype = 1;
		if (currentDeviceData != null) {
			currentBindid = currentDeviceData.id;
		} else {
			currentBindid = 0;
		}
		refreshSelect();
		refreshRegionTab();
	});

	$('body').on('click', '#DevicegroupTab', function(event) {
		currentBindtype = 2;
		if (currentDevicegroupData != null) {
			currentBindid = currentDevicegroupData.id;
		} else {
			currentBindid = 0;
		}
		refreshSelect();
		refreshRegionTab();
	});


	FormValidateOption.rules['regionschedule.starttime'] = {};
	FormValidateOption.rules['regionschedule.starttime']['required'] = true;
	FormValidateOption.rules['regionschedule.objid'] = {};
	FormValidateOption.rules['regionschedule.objid']['required'] = true;
	FormValidateOption.ignore = null;
	FormValidateOption.submitHandler = function(form) {
		$.ajax({
			type : 'POST',
			url : 'regionschedule!add.action',
			data : $('#ScheduleForm').serialize(),
			dataType: 'json',
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#ScheduleModal').modal('hide');
					bootbox.alert('操作成功');
					refreshRegionschedule();
				} else {
					bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert('出错了!');
			}
		});
	};
	$('#ScheduleForm').validate(FormValidateOption);
	
	$('[type=submit]', $('#ScheduleModal')).on('click', function(event) {
		$('#ScheduleForm input[name="regionschedule.bindtype"]').attr('value', currentBindtype);
		$('#ScheduleForm input[name="regionschedule.bindid"]').attr('value', currentBindid);
		$('#ScheduleForm input[name="regionschedule.regionid"]').attr('value', currentRegionid);
		if ($('#ScheduleForm').valid()) {
			var starttime = $('#ScheduleForm input[name="regionschedule.starttime"]').attr('value');
			$('#ScheduleForm input[name="regionschedule.starttime"]').attr('value', '2000-01-01 ' + starttime);
			$('#ScheduleForm').submit();
		}
	});
	
	$('body').on('click', '.pix-addschedule', function(event) {
		$('#ScheduleForm input[name="regionschedule.starttime"]').attr('value', '');
		var objtype = $('input[name="regionschedule.objtype"]:checked').val();
		if (currentRegiontype == 0) {
			$('.objtype-0').css('display', 'block');
			$('.objtype-1').css('display', 'none');
			if (objtype == 2) {
				$('input[name="regionschedule.objtype"][value="1"]').attr('checked', true);
				$('input[name="regionschedule.objtype"][value="1"]').parent().addClass('checked');
				$('input[name="regionschedule.objtype"][value="2"]').attr('checked', false);
				$('input[name="regionschedule.objtype"][value="2"]').parent().removeClass('checked');
			}
		} else if (currentRegiontype == 1) {
			$('.objtype-0').css('display', 'none');
			$('.objtype-1').css('display', 'block');
			if (objtype != 2) {
				$('input[name="regionschedule.objtype"][value="2"]').attr('checked', true);
				$('input[name="regionschedule.objtype"][value="2"]').parent().addClass('checked');
				$('input[name="regionschedule.objtype"][value="' + objtype + '"]').attr('checked', false);
				$('input[name="regionschedule.objtype"][value="' + objtype + '"]').parent().removeClass('checked');
			}
		}
		refreshRegionDtlSelect();
		$('#ScheduleModal').modal();
	});

	$('body').on('click', '.pix-schedule-delete', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		currentRegionschedule = currentRegionschedules[index];
		bootbox.confirm('请确认是否删除开始时间为"' + currentRegionschedule.starttime.substring(0, 5) + '"的计划', function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : 'regionschedule!delete.action',
					cache: false,
					data : {
						'regionschedule.regionscheduleid': currentRegionschedule.regionscheduleid
					},
					success : function(data, status) {
						if (data.errorcode == 0) {
							refreshRegionschedule();
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
	
	$('input[name="regionschedule.objtype"]').click(function(e) {
		refreshRegionDtlSelect();
	});
	refreshRegionDtlSelect();

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
