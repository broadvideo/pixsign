var DeviceModule = function () {
	var _submitflag = false;
	var _devicetype = 1;
	var _device = {};
	var _bundle = {};
	var timestamp = new Date().getTime();

	var init = function () {
		initDeviceTable();
		initDeviceEvent();
		initBundleModal();
		initBatchWizard();
	};

	var refresh = function () {
		$('#DeviceTable').dataTable()._fnAjaxUpdate();
	};
	
	var initDeviceTable = function () {
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

		$('.device-navigator').click(function(event) {
			_devicetype = $(this).attr('devicetype');
			$('#DeviceTable').dataTable()._fnAjaxUpdate();
		});

		var DeviceTree = new BranchTree($('#DevicePortlet'));

		var oTable = $('#DeviceTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'device!list.action',
			'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'terminalid', 'bSortable' : false, 'sWidth' : '15%' }, 
							{'sTitle' : common.view.branch, 'mData' : 'branchid', 'bSortable' : false, 'sWidth' : '15%' }, 
							{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' }, 
							{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var devicehtml = '';
				if (aData.status == 0) {
					devicehtml += '<span class="label label-sm label-default">' + common.view.unregister + '</span> ';
				} else if (aData.onlineflag == 1) {
					devicehtml += '<span class="label label-sm label-success">' + common.view.online + '</span> ';
				} else if (aData.onlineflag == 0) {
					devicehtml += '<span class="label label-sm label-warning">' + common.view.offline + '</span> ';
				} else if (aData.onlineflag == 9) {
					devicehtml += '<span class="label label-sm label-warning">' + common.view.offline + '</span> ';
				}
				if (aData.name != aData.terminalid) {
					devicehtml += aData.name + '(' + aData.terminalid + ')';
				} else {
					devicehtml += aData.terminalid + '';
				}
				$('td:eq(0)', nRow).html(devicehtml);
				
				$('td:eq(1)', nRow).html(aData.branch.name);

				var planhtml = '';
				if (aData.defaultbundle != null) {
					planhtml += '<a href="javascript:;" bundleid="' + aData.defaultbundleid + '" class="fancybox">';
					planhtml += '<div class="thumbs" style="width: 100px; height: 100px;">';
					if (aData.defaultbundle.snapshot != '' && aData.defaultbundle.snapshot != null) {
						var thumbwidth = aData.defaultbundle.width > aData.defaultbundle.height? 100 : 100*aData.defaultbundle.width/aData.defaultbundle.height;
						planhtml += '<img src="/pixsigdata' + aData.defaultbundle.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
					}
					planhtml += '</div>';
					planhtml += '</a>';
					planhtml += '<h6 class="pixtitle">' + aData.defaultbundle.name + '</h6>';
				}
				$('td:eq(2)', nRow).html(planhtml);

				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-bundle"><i class="fa fa-cog"></i> ' + common.view.config + ' </a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.syncplan + ' </a>';
				buttonhtml += '</div>';
				
				$('td:eq(3)', nRow).html(buttonhtml);
				
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				refreshFancybox();
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':DeviceTree.branchid });
				aoData.push({'name':'type','value':_devicetype });
				aoData.push({'name':'devicegroupid','value':0 });
			}
		});
		$('#DeviceTable_wrapper').addClass('form-inline');
		$('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DeviceTable_wrapper .dataTables_length select').select2();
		$('#DeviceTable').css('width', '100%');

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
							        title: bundleid,
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
					return false;
				})
			});
		}
	};
	
	var initDeviceEvent = function () {
		$('body').on('click', '.pix-sync', function(event) {
			var target = $(event.target);
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				target = $(event.target).parent();
				index = $(event.target).parent().attr('data-id');
			}
			_device = $('#DeviceTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.sync + _device.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'GET',
						url : 'device!sync.action',
						cache: false,
						data : {
							deviceid: _device.deviceid,
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
	};

	var initBundleModal = function () {
		var bundleselect = new BundleSelect($('#BundleModal'), TouchCtrl);

		$('body').on('click', '.pix-bundle', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_device = $('#DeviceTable').dataTable().fnGetData(index);
			_bundle = _device.defaultbundle;
			$('#BundleModal').modal();
		});
		$('#BundleModal').on('shown.bs.modal', function (e) {
			bundleselect.refresh();
			bundleselect.setBundle(_bundle);
		})
		$('[type=submit]', $('#BundleModal')).on('click', function(event) {
			$.ajax({
				type : 'POST',
				url : 'device!update.action',
				data : {
					'device.deviceid': _device.deviceid,
					'device.defaultbundleid': bundleselect.getBundle().bundleid,
				},
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#BundleModal').modal('hide');
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
		});
	};

	var initBatchWizard = function () {
		var bundleselect = new BundleSelect($('#BatchModal'), TouchCtrl);
		var deviceselect = new DeviceSelect($('#BatchModal'));
		
		$('body').on('click', '.pix-batch', function(event) {
			deviceselect.clear();
			initWizard();
			$('#BatchModal').modal();
		});

		$('#BatchModal').on('shown.bs.modal', function (e) {
			bundleselect.refresh();
		})

		function initWizard() {
			initTab1();
			initTab2();
			initData1();
			
			var handleTitle = function(tab, navigation, index) {
				var total = navigation.find('li').length;
				var current = index + 1;
				$('.step-title', $('#MyWizard')).text('Step ' + (index + 1) + ' of ' + total);
				jQuery('li', $('#MyWizard')).removeClass('done');
				var li_list = navigation.find('li');
				for (var i = 0; i < index; i++) {
					jQuery(li_list[i]).addClass('done');
				}
				if (current == 1) {
					$('#MyWizard').find('.button-previous').hide();
				} else {
					$('#MyWizard').find('.button-previous').show();
				}
				if (current >= total) {
					$('#MyWizard').find('.button-next').hide();
					$('#MyWizard').find('.button-submit').show();
				} else {
					$('#MyWizard').find('.button-next').show();
					$('#MyWizard').find('.button-submit').hide();
				}
				Metronic.scrollTo($('.page-title'));
				$('.form-group').removeClass('has-error');
			};

			// default form wizard
			$('#MyWizard').bootstrapWizard({
				'nextSelector': '.button-next',
				'previousSelector': '.button-previous',
				onTabClick: function (tab, navigation, index, clickedIndex) {
					if ((clickedIndex-index)>1) {
						return false;
					}
					if (index == 0 && clickedIndex == 1) {
						if (validSelectBundle()) {
							initData2();
						} else {
							return false;
						}
					} 
				},
				onNext: function (tab, navigation, index) {
					if (index == 1) {
						if (validSelectBundle()) {
							initData2();
						} else {
							return false;
						}
					}
				},
				onPrevious: function (tab, navigation, index) {
				},
				onTabShow: function (tab, navigation, index) {
					handleTitle(tab, navigation, index);
					if (index == 0) {
						bundleselect.refresh();
					}
				}
			});

			$('#MyWizard').find('.button-previous').hide();
			$('#MyWizard .button-submit').click(function () {
				if (validSelectDevices()) {
					submitData();
				}
			}).hide();
			
			$('#MyWizard').bootstrapWizard('first');
		}

		function initTab1() {
		}

		function initData1() {
			bundleselect.refresh();
		}

		function initTab2() {
		}

		function initData2() {
			deviceselect.refresh();
		}

		function submitData() {
			if (_submitflag) {
				return;
			}
			_submitflag = true;
			Metronic.blockUI({
				zIndex: 20000,
				animate: true
			});
			
			var defaultbundleid = bundleselect.getBundle() == null? 0 : bundleselect.getBundle().bundleid;
			var devices = deviceselect.getSelected();
			var deviceids = [];
			if (devices != null) {
				for (var i=0; i<devices.length; i++) {
					deviceids.push(devices[i].deviceid);
				}
			}
			
			$.ajax({
				type : 'POST',
				url : 'device!updatebundle.action',
				data : {
					'defaultbundleid': defaultbundleid,
					'deviceids': deviceids.join(','),
				},
				success : function(data, status) {
					_submitflag = false;
					Metronic.unblockUI();
					$('#BatchModal').modal('hide');
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
						$('#DeviceTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					_submitflag = false;
					Metronic.unblockUI();
					$('#BatchModal').modal('hide');
					console.log('failue');
				}
			});

		}

		function validSelectBundle() {
			if (bundleselect.getBundle() == null) {
				bootbox.alert(common.tips.bundle_zero);
				return false;
			}
			return true;
		}

		function validSelectDevices() {
			if (deviceselect.getSelected().length == 0) {
				bootbox.alert(common.tips.bind_zero);
				return false;
			}
			return true;
		}
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
