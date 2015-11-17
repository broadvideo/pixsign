var currentVchannelid = 0;
var currentVchannelschedules;
var currentVchannelschedule;

function refreshVchannelschedule() {
	if (currentVchannelid == 0) {
		$('.pix-addschedule').css('display', 'none');
		$('.pix-syncschedule').css('display', 'none');
		$('#ScheduleDetail').html('');
		return;
	}

	$('.pix-addschedule').css('display', 'block');
	$('.pix-syncschedule').css('display', 'block');
	$.ajax({
		type : 'GET',
		url : 'vchannelschedule!list.action',
		data : {
			vchannelid: currentVchannelid
		},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var schedules = data.aaData;
				currentVchannelschedules = schedules;
				var scheduleTabHtml = '<ul class="timeline">';
				for (var i=0; i<schedules.length; i++) {
					var schedule = schedules[i];
					if (i % 4 == 0) {
						scheduleTabHtml += '<li class="timeline-green">';
					} else if (i % 4 == 1) {
						scheduleTabHtml += '<li class="timeline-blue">';
					} else if (i % 4 == 2) {
						scheduleTabHtml += '<li class="timeline-yellow">';
					} else if (i % 4 == 3) {
						scheduleTabHtml += '<li class="timeline-purple">';
					}
					scheduleTabHtml += '<div class="timeline-time">';
					scheduleTabHtml += '<span class="time">' + schedule.starttime.substring(0,5) + ' </span>';
					scheduleTabHtml += '</div>';
					scheduleTabHtml += '<div class="timeline-icon"><i class="fa fa-video-camera"></i></div>';
					scheduleTabHtml += '<div class="timeline-body">';
					scheduleTabHtml += '<h2>' + schedule.playlist.name + '</h2>';
					scheduleTabHtml += '<div class="timeline-content">';
					
					for (var j=0; j<schedule.playlist.playlistdtls.length; j++) {
						var video = schedule.playlist.playlistdtls[j].video;
						if (j % 6 == 0) {
							scheduleTabHtml += '<div class="row">';
						}
						scheduleTabHtml += '<div class="col-md-2 col-xs-2">';
						if (video.thumbnail == null) {
							scheduleTabHtml += '<img src="../local/img/video.jpg" alt="' + video.name + '" width="100%" />';
						} else {
							scheduleTabHtml += '<img src="/pixsigdata' + video.thumbnail + '" alt="' + video.name + '" width="100%" />';
						}
						scheduleTabHtml += '<h6>' + video.name + '</h6>';
						scheduleTabHtml += '</div>';
						if ((j+1) % 6 == 0 || (j+1) == schedule.playlist.playlistdtls.length) {
							scheduleTabHtml += '</div>';
						}
					}
					
					scheduleTabHtml += '</div>';
					scheduleTabHtml += '<div class="timeline-footer">';
					//scheduleTabHtml += '<a href="javascript:;" class="btn btn-sm green pull-right pix-schedule-detail" data-id="'+ i + '">' + common.view.detail + '<i class="fa fa-arrow-circle-right"></i></a>';
					scheduleTabHtml += '<a href="javascript:;" class="btn btn-sm red pull-right pix-schedule-delete" data-id="'+ i + '">' + common.view.remove + '<i class="fa fa-trash-o"></i></a>';
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

function initVchannels() {
	$('.pix-addschedule').css('display', 'none');
	$('.pix-syncschedule').css('display', 'none');
	
	$.ajax({
		type : 'POST',
		url : 'vchannel!list.action',
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var vchannels = data.aaData;
				var vchannelTabHtml = '<ul class="nav nav-tabs tabs-left">';
				for (var i=vchannels.length; i>0; i--) {
					var vchannel = vchannels[i-1];
					if (i == vchannels.length) {
						vchannelTabHtml += '<li class="active">';
						currentVchannelid = vchannel.vchannelid;
						refreshVchannelschedule();
					} else {
						vchannelTabHtml += '<li>';
					}
					vchannelTabHtml += '<a href="#ScheduleTab" class="pix-vchannel" data-id="'+ vchannel.vchannelid + '" data-toggle="tab">' + vchannel.name + '</a>';
					vchannelTabHtml += '</li>';
				}
				vchannelTabHtml += '</ul>';
				$('#LeftTab').html(vchannelTabHtml);
			} else {
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
		}
	});

	$('#PlaylistSelect').select2({
		placeholder: common.tips.detail_select,
		//minimumResultsForSearch: -1,
		minimumInputLength: 0,
		ajax: { 
			url: 'playlist!list.action',
			type: 'GET',
			dataType: 'json',
			data: function (term, page) {
				return {
					sSearch: term, // search term
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
							id:item.playlistid,
							item:item
						};
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

	$('body').on('click', '.pix-vchannel', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		if (currentVchannelid != index) {
			currentVchannelid = index;
			refreshVchannelschedule();
		}
	});

	FormValidateOption.rules['vchannelschedule.starttime'] = {};
	FormValidateOption.rules['vchannelschedule.starttime']['required'] = true;
	FormValidateOption.rules['vchannelschedule.playlistid'] = {};
	FormValidateOption.rules['vchannelschedule.playlistid']['required'] = true;
	FormValidateOption.ignore = null;
	FormValidateOption.submitHandler = function(form) {
		$.ajax({
			type : 'POST',
			url : 'vchannelschedule!add.action',
			data : $('#ScheduleForm').serialize(),
			dataType: 'json',
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#ScheduleModal').modal('hide');
					bootbox.alert(common.tips.success);
					refreshVchannelschedule();
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
		$('#ScheduleForm input[name="vchannelschedule.vchannelid"]').attr('value', currentVchannelid);
		if ($('#ScheduleForm').valid()) {
			var starttime = $('#ScheduleForm input[name="vchannelschedule.starttime"]').attr('value');
			$('#ScheduleForm input[name="vchannelschedule.starttime"]').attr('value', '2000-01-01 ' + starttime);
			$('#ScheduleForm').submit();
		}
	});
	
	$('body').on('click', '.pix-addschedule', function(event) {
		if (currentVchannelid > 0) {
			$('#ScheduleForm input[name="vchannelschedule.starttime"]').attr('value', '');
			$('#ScheduleModal').modal();
		}
	});

	$('body').on('click', '.pix-syncschedule', function(event) {
		$.ajax({
			type : 'POST',
			url : 'vchannelschedule!sync.action',
			data : {
				vchannelid: currentVchannelid,
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
		currentVchannelschedule = currentVchannelschedules[index];
		bootbox.confirm(common.tips.remove + currentVchannelschedule.starttime.substring(0, 5), function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : 'vchannelschedule!delete.action',
					cache: false,
					data : {
						'vchannelschedule.vchannelscheduleid': currentVchannelschedule.vchannelscheduleid
					},
					success : function(data, status) {
						if (data.errorcode == 0) {
							refreshVchannelschedule();
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
