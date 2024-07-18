var ScheduleModule = function () {
	var _submitflag = false;
	var _devicetype = 1;
	var _bindtype = 1; //1: Device 2:Devicegroup
	var _bind;
	var _bindid;
	var _schedules;
	var _schedule;
	var _scheduledtls;
	var timestamp = new Date().getTime();

	var timestamp = new Date().getTime();

	var init = function () {
		initTable();
		initScheduleEvent();
		initScheduleModal();
	};

	var refresh = function () {
		$('#DeviceTable').dataTable()._fnAjaxUpdate();
		$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
	};
	
	var initTable = function () {
		if (Max1 > 0) {
			$('.device-navigator[devicetype="1"]').addClass('active');
			_devicetype = 1;
		} else if (Max2 > 0) {
			$('.device-navigator[devicetype="2"]').addClass('active');
			_devicetype = 2;
		} else if (Max6 > 0) {
			$('.device-navigator[devicetype="6"]').addClass('active');
			_devicetype = 6;
		} else if (Max7 > 0) {
			$('.device-navigator[devicetype="7"]').addClass('active');
			_devicetype = 7;
		} else if (Max10 > 0) {
			$('.device-navigator[devicetype="10"]').addClass('active');
			_devicetype = 10;
		} else if (Max13 > 0) {
			$('.device-navigator[devicetype="13"]').addClass('active');
			_devicetype = 13;
		} else if (Max15 > 0) {
			$('.device-navigator[devicetype="15"]').addClass('active');
			_devicetype = 15;
		}
		$('.device-navigator[devicetype="1"]').css('display', Max1==0?'none':'');
		$('.device-navigator[devicetype="2"]').css('display', Max2==0?'none':'');
		$('.device-navigator[devicetype="6"]').css('display', Max6==0?'none':'');
		$('.device-navigator[devicetype="7"]').css('display', Max7==0?'none':'');
		$('.device-navigator[devicetype="10"]').css('display', Max10==0?'none':'');
		$('.device-navigator[devicetype="13"]').css('display', Max13==0?'none':'');
		$('.device-navigator[devicetype="15"]').css('display', Max15==0?'none':'');

		$('.devicegroup-navigator').click(function(event) {
			_bindtype = 2;
			$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
		});
		$('.device-navigator').click(function(event) {
			_devicetype = $(this).attr('devicetype');
			_bindtype = 1;
			$('#DeviceTable').dataTable()._fnAjaxUpdate();
		});

		var ScheduleTree = new BranchTree($('#SchedulePortlet'), refresh);
		$('#DeviceTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'device!list.action',
			'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'terminalid', 'bSortable' : false, 'sWidth' : '10%' }, 
			                {'sTitle' : common.view.branch, 'mData' : 'branchid', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.onlineflag, 'mData' : 'onlineflag', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.schedule, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '60%' }, 
							{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '10%' }],
			'order': [],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				if (aData.name != aData.terminalid) {
					$('td:eq(0)', nRow).html(aData.name + '(' + aData.terminalid + ')');
				}
				$('td:eq(1)', nRow).html(aData.branch.name);
				if (aData.status == 0) {
					$('td:eq(2)', nRow).html('<span class="label label-sm label-default">' + common.view.unregister + '</span>');
				} else if (aData.onlineflag == 9) {
					$('td:eq(2)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
				} else if (aData.onlineflag == 1) {
					$('td:eq(2)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
				} else if (aData.onlineflag == 0) {
					$('td:eq(2)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
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
								schedulehtml += '<img src="/pixsigndata' + scheduledtl.bundle.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" />';
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
				$('td:eq(3)', nRow).html(schedulehtml);
				
				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				buttonhtml += '<a href="javascript:;" privilegeid="101010" deviceid="' + aData.deviceid + '" class="btn default btn-xs blue pix-schedule"><i class="fa fa-calendar-o"></i> ' + common.view.schedule + '</a>';
				buttonhtml += '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
				buttonhtml += '</div>';
				$('td:eq(4)', nRow).html(buttonhtml);

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
				aoData.push({'name':'branchid','value':ScheduleTree.branchid });
				aoData.push({'name':'type','value':_devicetype });
				aoData.push({'name':'devicegroupid','value':0 });
			}
		});
		$('#DeviceTable_wrapper').addClass('form-inline');
		$('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DeviceTable_wrapper .dataTables_length select').select2();
		$('#DeviceTable').css('width', '100%');

		var devicegroupTable = $('#DevicegroupTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'devicegroup!list.action',
			'aoColumns' : [ {'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '5%' }, 
							{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.detail, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '25%' },
							{'sTitle' : common.view.schedule, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '55%' }, 
							{'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '5%' }],
			'order': [],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				//$('td:eq(1)', nRow).html('<div id="DevicegroupDiv-'+ aData.devicegroupid + '"></div>');
				var listhtml = '';
				for (var i=0; i<aData.devices.length; i++) {
					listhtml += aData.devices[i].name + ' ';
					if (i > 6 && i<aData.devices.length-1) {
						listhtml += '...';
						break;
					}
				}
				$('td:eq(2)', nRow).html(listhtml);
				
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
								schedulehtml += '<img src="/pixsigndata' + scheduledtl.bundle.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" />';
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
				$('td:eq(3)', nRow).html(schedulehtml);
						
				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				buttonhtml += '<a href="javascript:;" privilegeid="101010" devicegroupid="' + aData.devicegroupid + '" class="btn default btn-xs blue pix-schedule"><i class="fa fa-calendar-o"></i> ' + common.view.schedule + '</a>';
				buttonhtml += '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
				buttonhtml += '</div>';
				$('td:eq(4)', nRow).html(buttonhtml);

				var rowdetail = '<span class="row-details row-details-close"></span>';
				$('td:eq(0)', nRow).html(rowdetail);
				

				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#DevicegroupTable .thumbs').each(function(i) {
					$(this).height($(this).parent().closest('div').width());
				});

				refreshFancybox();
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':ScheduleTree.branchid });
				aoData.push({'name':'type','value':1 });
			}
		});
		$('#DevicegroupTable_wrapper').addClass('form-inline');
		$('#DevicegroupTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DevicegroupTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DevicegroupTable_wrapper .dataTables_length select').select2();
		$('#DevicegroupTable').css('width', '100%');

		function fnFormatDetails ( oTable, nTr ) {
			var aData = oTable.fnGetData( nTr );
			var listhtml = '';
			for (var i=0; i<aData.devices.length; i++) {
				listhtml += aData.devices[i].name + ' ';
			}
			var sOut = '<table width="100%">';
			sOut += '<tr><td width="10%">' + common.view.detail + ':</td><td width="90%">' + listhtml + '</td>';
			sOut += '</tr>';
			return sOut;
		}

		$('#DevicegroupTable').on('click', ' tbody td .row-details', function () {
			var nTr = $(this).parents('tr')[0];
			if ( devicegroupTable.fnIsOpen(nTr) ) {
				/* This row is already open - close it */
				$(this).addClass('row-details-close').removeClass('row-details-open');
				devicegroupTable.fnClose( nTr );
			} else {
				/* Open this row */				
				$(this).addClass('row-details-open').removeClass('row-details-close');
				devicegroupTable.fnOpen( nTr, fnFormatDetails(devicegroupTable, nTr), 'details' );
			}
		});
	};
	
	var initScheduleEvent = function () {
		$('body').on('click', '.pix-sync', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			var url, data;
			if (_bindtype == 1) {
				_bind = $('#DeviceTable').dataTable().fnGetData(index);
				url = 'device!sync.action';
				data = { deviceid: _bind.deviceid };
			} else if (_bindtype == 2) {
				_bind = $('#DevicegroupTable').dataTable().fnGetData(index);
				url = 'devicegroup!sync.action';
				data = { devicegroupid: _bind.devicegroupid };
			}
			bootbox.confirm(common.tips.sync + _bind.name, function(result) {
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
	};

	var initScheduleModal = function () {
		var bundleselect = new BundleSelect($('#ScheduleModal'), TouchCtrl);

		function refreshScheduleDetail() {
			$('#ScheduleDetail').empty();
			if (_schedules.length > 0) {
				var scheduleTabHtml = '<h3></h3><ul class="timeline">';
				for (var i=0; i<_schedules.length; i++) {
					var schedule = _schedules[i];
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
							scheduleTabHtml += '<img src="/pixsigndata' + scheduledtl.bundle.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" />';
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
			bundleselect.refresh();
		}

		/*
		//Bundle table初始�?
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
			'order': [],
			'iDisplayLength' : 12,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
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
					bundlehtml += '<img src="/pixsigndata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
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

		//Touchbundle table初始�?
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
			'order': [],
			'iDisplayLength' : 12,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
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
					touchbundlehtml += '<img src="/pixsigndata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
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
		*/

		function refreshSelectedTable() {
			var selectedTableHtml = '';
			selectedTableHtml += '<tr>';
			for (var i=0; i<_scheduledtls.length; i++) {
				var scheduledtl = _scheduledtls[i];
				var name = '';
				if (scheduledtl.objtype == 1) {
					name = scheduledtl.bundle.name;
				}
				selectedTableHtml += '<td style="padding: 0px 10px 0px 0px;" width="' + (100/_scheduledtls.length) + '%"><div class="thumbs" style="width:100px; height:100px;">';
				if (scheduledtl.objtype == 1 && scheduledtl.bundle.snapshot != null) {
					var thumbwidth = scheduledtl.bundle.width > scheduledtl.bundle.height? 100 : 100*scheduledtl.bundle.width/scheduledtl.bundle.height;
					selectedTableHtml += '<img src="/pixsigndata' + scheduledtl.bundle.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" />';
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
			for (var i=0; i<_scheduledtls.length; i++) {
				var scheduledtl = _scheduledtls[i];
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
			$('#SelectedTable').width(110 * _scheduledtls.length);
			$('#SelectedTable .mask').each(function(i) {
				$(this).width($(this).parent().width() + 2);
				$(this).height($(this).parent().width() + 2);
			});
		}

		$('body').on('click', '.pix-schedule', function(event) {
			if (_bindtype == 1) {
				_bindid = $(event.target).attr('deviceid');
				if (_bindid == undefined) {
					_bindid = $(event.target).parent().attr('deviceid');
				}
				$.ajax({
					type : 'GET',
					url : 'device!get.action',
					data : {deviceid: _bindid},
					success : function(data, status) {
						if (data.errorcode == 0) {
							_bind = data.device;
							_schedules = _bind.schedules;
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
			} else if (_bindtype == 2) {
				_bindid = $(event.target).attr('devicegroupid');
				if (_bindid == undefined) {
					_bindid = $(event.target).parent().attr('devicegroupid');
				}
				$.ajax({
					type : 'GET',
					url : 'devicegroup!get.action',
					data : {devicegroupid: _bindid},
					success : function(data, status) {
						if (data.errorcode == 0) {
							_bind = data.devicegroup;
							_schedules = _bind.schedules;
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
			_schedule = {};
			_schedule.scheduleid = 'B' + Math.round(Math.random()*100000000);
			_schedule.scheduletype = 1;
			_schedule.attachflag = 0;
			_schedule.bindtype = _bindtype;
			_schedule.bindid = _bindid;
			_scheduledtls = [];
			refreshMediaTable();
			refreshSelectedTable();
		});

		$('body').on('click', '.pix-edit-scheduledtl', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_schedule = _schedules[index];
			_scheduledtls = _schedule.scheduledtls.slice(0);
			
			$('.schedule-edit').css('display', 'block');
			$('.schedule-add').css('display', 'none');
			$('.schedule-view').css('display', 'none');				
			$('.form-group').removeClass('has-error');
			$('.help-block').remove();
			$('#ScheduleForm input[name="starttime"]').attr('value', _schedule.starttime);
			refreshMediaTable();
			refreshSelectedTable();
		});

		$('body').on('click', '.pix-del-schedule', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_schedules.splice(index, 1);
			refreshScheduleDetail();
		});


		var formHandler = new FormHandler($('#ScheduleForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['bundle.name'] = {};
		formHandler.validateOption.rules['bundle.name']['required'] = true;
		formHandler.validateOption.rules['starttime'] = {};
		formHandler.validateOption.rules['starttime']['required'] = true;
		$('#ScheduleForm').validate(formHandler.validateOption);
		$.extend($('#ScheduleForm').validate().settings, {
			rules: formHandler.validateOption.rules
		});
		$('#ScheduleForm .pix-ok').on('click', function(event) {
			if ($('#ScheduleForm').valid()) {
				$('.schedule-edit').css('display', 'none');
				$('.schedule-add').css('display', 'none');
				$('.schedule-view').css('display', 'block');
				
				var starttime = $('#ScheduleForm input[name=starttime]').val();
				var schedules = _schedules.filter(function (el) {
					return (el.starttime == starttime);
				});
				if (schedules.length > 0) {
					schedules[0].playmode = $('#ScheduleForm input[name=playmode]:checked').attr("value");
					schedules[0].scheduledtls = _scheduledtls;
				} else {
					var schedule = {};
					schedule.scheduleid = 'B' + Math.round(Math.random()*100000000);
					schedule.scheduletype = 1;
					schedule.attachflag = 0;
					schedule.bindtype = _bindtype;
					schedule.bindid = _bindid;
					schedule.playmode = $('#ScheduleForm input[name=playmode]:checked').attr("value");
					schedule.starttime = $('#ScheduleForm input[name=starttime]').val();
					schedule.scheduledtls = _scheduledtls;
					_schedules.push(schedule);
				}
				
				_schedules.sort(function(a, b) {
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
		$('body').on('click', '.pix-bundle-set', function(event) {
			var scheduledtl = {};
			scheduledtl.scheduledtlid = 'D' + Math.round(Math.random()*100000000);
			scheduledtl.scheduleid = _schedule.scheduleid;
			scheduledtl.objtype = 1;
			scheduledtl.objid = bundleselect.getBundle().bundleid;
			scheduledtl.bundle = bundleselect.getBundle();
			scheduledtl.sequence = _scheduledtls.length + 1;
			_scheduledtls.push(scheduledtl);
			refreshSelectedTable();
		});
		$('body').on('click', '.pix-touchbundle-set', function(event) {
			var scheduledtl = {};
			scheduledtl.scheduledtlid = 'D' + Math.round(Math.random()*100000000);
			scheduledtl.scheduleid = _schedule.scheduleid;
			scheduledtl.objtype = 1;
			scheduledtl.objid = bundleselect.getBundle().bundleid;
			scheduledtl.bundle = bundleselect.getBundle();
			scheduledtl.sequence = _scheduledtls.length + 1;
			_scheduledtls.push(scheduledtl);
			refreshSelectedTable();
		});
		
		//删除SelectedTable
		$('body').on('click', '.pix-scheduledtl-del', function(event) {
			var index = $(event.target).attr('index');
			if (index == undefined) {
				index = $(event.target).parent().attr('index');
			}
			for (var i=index; i<_scheduledtls.length; i++) {
				_scheduledtls[i].sequence = i;
			}
			_scheduledtls.splice(index, 1);
			refreshSelectedTable();
		});

		$('[type=submit]', $('#ScheduleModal')).on('click', function(event) {
			for (var i=0; i<_schedules.length; i++) {
				var schedule = _schedules[i];
				if (i == _schedules.length - 1) {
					schedule.endtime = _schedules[0].starttime;
				} else {
					schedule.endtime = _schedules[i+1].starttime;
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
				attachflag: 0,
				bindtype: _bindtype,
				bindid: _bindid,
				schedules: _schedules
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
	
	var refreshFancybox = function() {
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
							        title: objid,
							    });
								BundlePreviewModule.preview($('#BundlePreview'), data.bundle, 800);
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
	};

	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
