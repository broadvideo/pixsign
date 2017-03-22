var currentDevice;
var currentDeviceid;
var currentBundleschedules;

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
					{'sTitle' : common.view.bundleschedule, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '60%' }, 
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
		
		var bundleschedulehtml = '';
		if (aData.bundleschedules.length > 0) {
			for (var i=0; i<aData.bundleschedules.length; i++) {
				var schedule = aData.bundleschedules[i];
				bundleschedulehtml += '<div class="row">';
				bundleschedulehtml += '<div class="col-md-2 col-xs-2">';
				bundleschedulehtml += '<h3>' + schedule.starttime.substring(0,5) + ' </h3>';
				bundleschedulehtml += '</div>';
				bundleschedulehtml += '<div class="col-md-10 col-xs-10">';
				for (var j=0; j<schedule.bundlescheduledtls.length; j++) {
					var bundlescheduledtl = schedule.bundlescheduledtls[j];
					if (j % 4 == 0) {
						bundleschedulehtml += '<div class="row" >';
					}
					bundleschedulehtml += '<div class="col-md-3 col-xs-3">';
					var thumbwidth = bundlescheduledtl.bundle.width > bundlescheduledtl.bundle.height? 100 : 100*bundlescheduledtl.bundle.width/bundlescheduledtl.bundle.height;
					bundleschedulehtml += '<div class="thumbs">';
					bundleschedulehtml += '<img src="/pixsigdata' + bundlescheduledtl.bundle.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + bundlescheduledtl.bundle.name + '" />';
					bundleschedulehtml += '</div>';
					bundleschedulehtml += '<h6 class="pixtitle">' + bundlescheduledtl.bundle.name + '</h6>';
					bundleschedulehtml += '</div>';
					if ((j+1) % 4 == 0 || (j+1) == schedule.bundlescheduledtls.length) {
						bundleschedulehtml += '</div>';
					}
				}
				bundleschedulehtml += '</div>';
				bundleschedulehtml += '</div>';
			}
		} else {
			bundleschedulehtml = '';
		}
		$('td:eq(2)', nRow).html(bundleschedulehtml);
		
		$('td:eq(3)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-bundleschedule"><i class="fa fa-calendar-o"></i> ' + common.view.bundleschedule + '</a>');
		$('td:eq(4)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>');

		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#MyTable .thumbs').each(function(i) {
			$(this).height($(this).parent().width());
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurBranchid });
		aoData.push({'name':'devicegroupid','value':0 });
		aoData.push({'name':'type','value':'1' });
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
			scheduleTabHtml += '<div class="row"><div class="col-md-10 col-sm-10">';
			for (var j=0; j<schedule.bundlescheduledtls.length; j++) {
				var bundlescheduledtl = schedule.bundlescheduledtls[j];
				if (j % 4 == 0) {
					scheduleTabHtml += '<div class="row" >';
				}
				scheduleTabHtml += '<div class="col-md-3 col-xs-3">';
				var thumbwidth = bundlescheduledtl.bundle.width > bundlescheduledtl.bundle.height? 100 : 100*bundlescheduledtl.bundle.width/bundlescheduledtl.bundle.height;
				scheduleTabHtml += '<div class="thumbs">';
				scheduleTabHtml += '<img src="/pixsigdata' + bundlescheduledtl.bundle.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + bundlescheduledtl.bundle.name + '" />';
				scheduleTabHtml += '<div class="mask">';
				scheduleTabHtml += '<div>';
				scheduleTabHtml += '<br/><a href="javascript:;" class="btn default btn-sm red pix-del-bundlescheduledtl" bundlescheduleid="' + i + '" bundlescheduledtlid="' + j + '"><i class="fa fa-trash-o"></i></a>';
				scheduleTabHtml += '</div>';
				scheduleTabHtml += '</div>';
				scheduleTabHtml += '</div>';
				scheduleTabHtml += '<h6 class="pixtitle">' + bundlescheduledtl.bundle.name + '</h6>';
				scheduleTabHtml += '</div>';
				if ((j+1) % 4 == 0 || (j+1) == schedule.bundlescheduledtls.length) {
					scheduleTabHtml += '</div>';
				}
			}
			scheduleTabHtml += '</div>';
			scheduleTabHtml += '<div class="col-md-2 col-sm-2">';
			scheduleTabHtml += '<a href="javascript:;" class="btn btn-sm green pull-right pix-add-bundlescheduledtl" data-id="'+ i + '">' + common.view.add + '<i class="fa fa-trash-o"></i></a>';
			scheduleTabHtml += '<a href="javascript:;" class="btn btn-sm red pull-right pix-del-bundleschedule" data-id="'+ i + '">' + common.view.remove + '<i class="fa fa-trash-o"></i></a>';
			scheduleTabHtml += '</div>';
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
	$('#BundleScheduleDetail .thumbs').each(function(i) {
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
				bundleTableHtml += '<img src="/pixsigdata' + Bundles[i].snapshot + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + Bundles[i].name + '" />';
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
		} else {
			bootbox.alert(common.tips.error + data.errormsg);
		}
	},
	error : function() {
		console.log('failue');
	}
});

$('body').on('click', '.pix-bundleschedule', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	currentDevice = $('#MyTable').dataTable().fnGetData(index);
	currentDeviceid = currentDevice.deviceid;
	currentBundleschedules = currentDevice.bundleschedules;

	$('.bundleschedule-edit').css('display', 'none');
	$('.bundleschedule-add').css('display', 'none');
	$('.bundleschedule-view').css('display', 'block');				
	refreshBundleScheduleDetail();
	$('#BundleScheduleModal').modal();
});
$('#BundleScheduleModal').on('shown.bs.modal', function (e) {
	$('#BundleScheduleDetail .thumbs').each(function(i) {
		$(this).height($(this).parent().width());
		$(this).find('.mask').height($(this).parent().width() + 2);
	});
})

$('body').on('click', '.pix-add-bundleschedule', function(event) {
	$('.bundleschedule-edit').css('display', 'block');
	$('.bundleschedule-add').css('display', 'block');
	$('.bundleschedule-view').css('display', 'none');				
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
		$('.bundleschedule-edit').css('display', 'none');
		$('.bundleschedule-add').css('display', 'none');
		$('.bundleschedule-view').css('display', 'block');
		
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
			var bundlescheduledtl = {};
			bundlescheduledtl.bundlescheduledtlid = 'D' + Math.round(Math.random()*100000000);
			bundlescheduledtl.bundlescheduleid = bundleschedules[0].bundlescheduleid;
			bundlescheduledtl.bundleid = bundleid;
			bundlescheduledtl.bundle = bundlesels[0];
			bundlescheduledtl.sequence = bundleschedules[0].bundlescheduledtls.length + 1;
			bundleschedules[0].bundlescheduledtls.push(bundlescheduledtl);
			//bundleschedules[0].bundlescheduledtls[0] = bundlescheduledtl;
		} else {
			var bundleschedule = {};
			bundleschedule.bundlescheduleid = 'B' + Math.round(Math.random()*100000000);
			bundleschedule.bindtype = 1;
			bundleschedule.bindid = currentDeviceid;
			bundleschedule.bundleid = bundleid;
			bundleschedule.playmode = $('#BundleScheduleForm input[name=playmode]:checked').attr("value");
			bundleschedule.starttime = $('#BundleScheduleForm input[name=starttime]').val();
			bundleschedule.bundle = bundlesels[0];
			bundleschedule.bundlescheduledtls = [];
			var bundlescheduledtl = {};
			bundlescheduledtl.bundlescheduledtlid = 'D' + Math.round(Math.random()*100000000);
			bundlescheduledtl.bundlescheduleid = bundleschedule.bundlescheduleid;
			bundlescheduledtl.bundleid = bundleid;
			bundlescheduledtl.bundle = bundlesels[0];
			bundlescheduledtl.sequence = 1;
			bundleschedule.bundlescheduledtls.push(bundlescheduledtl);
			currentBundleschedules.push(bundleschedule);
		}
		
		currentBundleschedules.sort(function(a, b) {
			return (a.starttime > b.starttime);
		});
		refreshBundleScheduleDetail();
	}
});
$('#BundleScheduleForm .pix-cancel').on('click', function(event) {
	$('.bundleschedule-edit').css('display', 'none');
	$('.bundleschedule-add').css('display', 'none');
	$('.bundleschedule-view').css('display', 'block');				
});

$('body').on('click', '.pix-del-bundlescheduledtl', function(event) {
	var i = $(event.target).attr('bundlescheduleid');
	var j = $(event.target).attr('bundlescheduledtlid');
	if (i == undefined) {
		i = $(event.target).parent().attr('bundlescheduleid');
		j = $(event.target).parent().attr('bundlescheduledtlid');
	}
	currentBundleschedules[i].bundlescheduledtls.splice(j, 1);
	refreshBundleScheduleDetail();
});

$('body').on('click', '.pix-add-bundlescheduledtl', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	var bundleschedule = currentBundleschedules[index];
	
	$('.bundleschedule-edit').css('display', 'block');
	$('.bundleschedule-add').css('display', 'none');
	$('.bundleschedule-view').css('display', 'none');				
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	$('#BundleScheduleForm input[name="starttime"]').attr('value', bundleschedule.starttime);
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
		var bundleschedule = currentBundleschedules[i];
		bundleschedule.bundle = undefined;
		if (('' + bundleschedule.bundlescheduleid).indexOf('B') == 0) {
			bundleschedule.bundlescheduleid = '0';
		}
		for (var j=0; j<bundleschedule.bundlescheduledtls.length; j++) {
			var bundlescheduledtl = bundleschedule.bundlescheduledtls[j];
			bundlescheduledtl.bundle = undefined;
			if (('' + bundlescheduledtl.bundlescheduleid).indexOf('B') == 0) {
				bundlescheduledtl.bundlescheduleid = '0';
			}
			if (('' + bundlescheduledtl.bundlescheduledtlid).indexOf('D') == 0) {
				bundlescheduledtl.bundlescheduledtlid = '0';
			}
		}
	}
	$.ajax({
		type : 'POST',
		url : 'bundle!addbundleschedules.action',
		data : '{"bundleschedules":' + $.toJSON(currentBundleschedules) + '}',
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
			console.log('failue');
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
