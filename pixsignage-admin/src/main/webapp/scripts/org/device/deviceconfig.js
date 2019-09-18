var DeviceConfigModule = function () {
	var _org = {};

	var init = function () {
		initDeviceConfigTable();
		initDeviceConfigEvent();
		initDeviceConfigModal();
	};

	var refresh = function () {
		$.ajax({
			type : 'GET',
			url : 'org!get.action',
			data : '',
			success : function(data, status) {
				if (data.errorcode == 0) {
					_org = data.org;
					$('#DeviceConfigTable').dataTable().fnClearTable();

					$('#DeviceConfigTable').dataTable().fnAddData([common.view.city, _org.city]);
					/*
					if (_org.upgradeflag == 1) {
						var upgradehtml = '<span class="label label-xs label-success">' + common.view.on + '</span>';
						$('#DeviceConfigTable').dataTable().fnAddData([common.view.upgradeflag, upgradehtml]);
					} else {
						var upgradehtml = '<span class="label label-xs label-warning">' + common.view.off + '</span>';
						$('#DeviceConfigTable').dataTable().fnAddData([common.view.upgradeflag, upgradehtml]);
					}*/
					if (_org.volumeflag == 1) {
						var volumehtml = '<span class="label label-xs label-success">' + common.view.volumeflag_on + '</span>';
						$('#DeviceConfigTable').dataTable().fnAddData([common.view.volumeflag, volumehtml]);
						$('#DeviceConfigTable').dataTable().fnAddData([common.view.volume, _org.volume]);
					} else {
						var volumehtml = '<span class="label label-xs label-warning">' + common.view.volumeflag_off + '</span>';
						$('#DeviceConfigTable').dataTable().fnAddData([common.view.volumeflag, volumehtml]);
					}
					if (_org.devicepassflag == 1) {
						var devicepasshtml = '<span class="label label-xs label-success">' + common.view.on + '</span>';
						$('#DeviceConfigTable').dataTable().fnAddData([common.view.devicepassflag, devicepasshtml]);
						$('#DeviceConfigTable').dataTable().fnAddData([common.view.devicepass, _org.devicepass]);
					} else {
						var devicepasshtml = '<span class="label label-xs label-warning">' + common.view.off + '</span>';
						$('#DeviceConfigTable').dataTable().fnAddData([common.view.devicepassflag, devicepasshtml]);
					}
					/*
					if (BundleCtrl) {
						if (_org.backupvideo != null) {
							var backupvideohtml = '';
							if (_org.backupvideo.thumbnail == null) {
								backupvideohtml = '<span><img src="../img/video.jpg" height="25" /> ' + _org.backupvideo.name + '</span>';
							} else {
								backupvideohtml = '<span><img src="/pixsigdata' + _org.backupvideo.thumbnail + '" height="25" /> ' + _org.backupvideo.name + '</span>';
							}
							$('#DeviceConfigTable').dataTable().fnAddData([common.view.backupvideo, backupvideohtml]);
						} else {
							$('#DeviceConfigTable').dataTable().fnAddData([common.view.backupvideo, '']);
						}
					}
					if (_org.defaultpage != null) {
						var defaultpagehtml = '';
						if (_org.defaultpage.snapshot == null) {
							defaultpagehtml = '<span>' + _org.defaultpage.name + '</span>';
						} else {
							defaultpagehtml = '<span><img src="/pixsigdata' + _org.defaultpage.snapshot + '" height="25" /> ' + _org.defaultpage.name + '</span>';
						}
						$('#DeviceConfigTable').dataTable().fnAddData([common.view.defaultpage, defaultpagehtml]);
					} else {
						$('#DeviceConfigTable').dataTable().fnAddData([common.view.defaultpage, '']);
					}
					*/
					if (SscreenCtrl) {
						if (_org.powerflag == 1) {
							var powerhtml = '<span class="label label-xs label-success">' + common.view.on + '</span>';
							$('#DeviceConfigTable').dataTable().fnAddData([common.view.powerflag, powerhtml]);
							$('#DeviceConfigTable').dataTable().fnAddData([common.view.poweron, _org.poweron]);
							$('#DeviceConfigTable').dataTable().fnAddData([common.view.poweroff, _org.poweroff]);
						} else {
							var powerhtml = '<span class="label label-xs label-warning">' + common.view.off + '</span>';
							$('#DeviceConfigTable').dataTable().fnAddData([common.view.powerflag, powerhtml]);
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
	};
	
	var initDeviceConfigTable = function () {
		$('#DeviceConfigTable').dataTable({
			'sDom' : 't',
			'iDisplayLength' : -1,
			'bSort' : false,
			'aoColumns' : [ {'sTitle' : common.view.name, 'bSortable' : false, 'sWidth' : '25%' },
							{'sTitle' : common.view.value, 'bSortable' : false, 'sWidth' : '75%' }],
			'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
			'oLanguage' : { 'sZeroRecords' : common.view.empty,
							'sEmptyTable' : common.view.empty }, 
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			}
		});

		refresh();
	};
	
	var initDeviceConfigEvent = function () {
		$('body').on('click', '.pix-push', function(event) {
			bootbox.confirm(common.tips.pushall, function(result) {
				if (result == true) {
					$.ajax({
						type : 'GET',
						url : 'device!config.action',
						cache: false,
						data : {},
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

	var initDeviceConfigModal = function () {
		var formHandler = new FormHandler($('#DeviceConfigForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['org.city'] = {};
		formHandler.validateOption.rules['org.city']['maxlength'] = 16;
		formHandler.validateOption.rules['org.devicepass'] = {};
		formHandler.validateOption.rules['org.devicepass']['required'] = true;
		formHandler.validateOption.rules['org.devicepass']['number'] = true;
		formHandler.validateOption.rules['org.devicepass']['minlength'] = 6;
		formHandler.validateOption.rules['org.devicepass']['maxlength'] = 6;
		formHandler.validateOption.rules['org.hightemperature'] = {};
		formHandler.validateOption.rules['org.hightemperature']['required'] = true;
		formHandler.validateOption.rules['org.hightemperature']['number'] = true;
		formHandler.validateOption.rules['org.hightemperature']['min'] = 40;
		formHandler.validateOption.rules['org.hightemperature']['max'] = 80;
		formHandler.validateOption.rules['org.lowtemperature'] = {};
		formHandler.validateOption.rules['org.lowtemperature']['required'] = true;
		formHandler.validateOption.rules['org.lowtemperature']['number'] = true;
		formHandler.validateOption.rules['org.lowtemperature']['min'] = 30;
		formHandler.validateOption.rules['org.lowtemperature']['max'] = 70;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#DeviceConfigForm').attr('action'),
				data : $('#DeviceConfigForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#DeviceConfigModal').modal('hide');
						bootbox.alert(common.tips.success);
						refresh();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		};
		$('#DeviceConfigForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#DeviceConfigModal')).on('click', function(event) {
			if ($('#DeviceConfigForm').valid()) {
				$('#DeviceConfigForm').submit();
			}
		});

		$('body').on('click', '.pix-update', function(event) {
			formHandler.setdata('org', _org);
			
			if ($('input[name="org.devicepassflag"]:checked').val() == 0) {
				$('.devicepassflag').css('display', 'none');
			} else {
				$('.devicepassflag').css('display', '');
			}

			if ($('input[name="org.powerflag"]:checked').val() == 0) {
				$('.powerflag').css('display', 'none');
			} else {
				if ($('input[name="org.poweron"]').val() == '') {
					$('input[name="org.poweron"]').val('07:00:00');
				}
				if ($('input[name="org.poweroff"]').val() == '') {
					$('input[name="org.poweroff"]').val('00:00:00');
				}
				$('.powerflag').css('display', '');
			}
			$('#DeviceConfigForm').attr('action', 'org!update.action');
			
			$('#BackupMediaSelect').select2({
				placeholder: common.tips.detail_select,
				minimumInputLength: 0,
				ajax: { 
					url: 'video!list.action',
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
									id:item.videoid,
									video:item,
								};
							}),
							more: more
						};
					}
				},
				formatResult: function (data) {
					if (data.video == null || data.video.thumbnail == null) {
						return '<span><img src="../img/video.jpg" height="25" /> ' + data.text + '</span>';
					} else {
						return '<span><img src="/pixsigdata' + data.video.thumbnail + '" height="25" /> ' + data.text + '</span>';
					}
				},
				formatSelection: function (data) {
					if (data.video == null || data.video.thumbnail == null) {
						return '<span><img src="../img/video.jpg" height="25" /> ' + data.text + '</span>';
					} else {
						return '<span><img src="/pixsigdata' + data.video.thumbnail + '" height="25" /> ' + data.text + '</span>';
					}
				},
				initSelection: function(element, callback) {
					if (_org.backupvideo != null) {
						callback({id: _org.backupvideoid, text: _org.backupvideo.name, video: _org.backupvideo });
					}
				},
				dropdownCssClass: 'bigdrop', 
				escapeMarkup: function (m) { return m; } 
			});

			$('#DefaultPageSelect').select2({
				placeholder: common.tips.detail_select,
				minimumInputLength: 0,
				ajax: { 
					url: 'page!list.action',
					type: 'GET',
					dataType: 'json',
					data: function (term, page) {
						return {
							sSearch: term, 
							iDisplayStart: (page-1)*10,
							iDisplayLength: 10,
							homeflag: 1,
						};
					},
					results: function (data, page) {
						var more = (page * 10) < data.iTotalRecords; 
						return {
							results : $.map(data.aaData, function (item) { 
								return { 
									text:item.name, 
									id:item.pageid,
									page:item,
								};
							}),
							more: more
						};
					}
				},
				formatResult: function (data) {
					if (data.page == null || data.page.snapshot == null) {
						return '<span>' + data.text + '</span>';
					} else {
						return '<span><img src="/pixsigdata' + data.page.snapshot + '" height="25" /> ' + data.text + '</span>';
					}
				},
				formatSelection: function (data) {
					if (data.page == null || data.page.snapshot == null) {
						return '<span>' + data.text + '</span>';
					} else {
						return '<span><img src="/pixsigdata' + data.page.snapshot + '" height="25" /> ' + data.text + '</span>';
					}
				},
				initSelection: function(element, callback) {
					if (_org.defaultpage != null) {
						callback({id: _org.defaultpageid, text: _org.defaultpage.name, page: _org.defaultpage });
					}
				},
				dropdownCssClass: 'bigdrop', 
				escapeMarkup: function (m) { return m; } 
			});

			$('#DeviceConfigModal').modal();
		});

		$('#DeviceConfigModal').on('shown.bs.modal', function (e) {
			$(".volumeRange").ionRangeSlider({
				min: 0,
				max: 100,
				from: _org.volume,
				type: 'single',
				step: 1,
				hasGrid: false
			});
			if ($('input[name="org.volumeflag"]:checked').val() == 1) {
				$('.volumeflag').css('display', '');
			} else {
				$('.volumeflag').css('display', 'none');
			}
		})

		$('input[name="org.volumeflag"]').click(function(e) {
			if ($('input[name="org.volumeflag"]:checked').val() == 1) {
				$('.volumeflag').css('display', '');
			} else {
				$('.volumeflag').css('display', 'none');
			}
		});  
		$('input[name="org.devicepassflag"]').click(function(e) {
			if ($('input[name="org.devicepassflag"]:checked').val() == 0) {
				$('.devicepassflag').css('display', 'none');
			} else {
				$('.devicepassflag').css('display', '');
			}
		});  


		$('input[name="org.powerflag"]').click(function(e) {
			if ($('input[name="org.powerflag"]:checked').val() == 0) {
				$('.powerflag').css('display', 'none');
			} else {
				if ($('input[name="org.poweron"]').val() == '') {
					$('input[name="org.poweron"]').val('07:00:00');
				}
				if ($('input[name="org.poweroff"]').val() == '') {
					$('input[name="org.poweroff"]').val('00:00:00');
				}
				$('.powerflag').css('display', '');
			}
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
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
