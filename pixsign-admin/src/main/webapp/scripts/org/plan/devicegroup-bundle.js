var DevicegroupModule = function () {
	var _submitflag = false;
	var _devicegroup = {};
	var _bundle = {};
	var timestamp = new Date().getTime();

	var init = function () {
		initDevicegroupTable();
		initDevicegroupEvent();
		initBundleModal();
		initBatchWizard();
	};

	var refresh = function () {
		$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
	};
	
	var initDevicegroupTable = function () {
		var DevicegroupTree = new BranchTree($('#DevicegroupPortlet'));

		var oTable = $('#DevicegroupTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'devicegroup!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : common.view.detail, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '50%' },
							{'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '20%' }, 
							{'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '20%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var listhtml = '';
				for (var i=0; i<aData.devices.length; i++) {
					listhtml += aData.devices[i].name + ' ';
					if (i > 6 && i<aData.devices.length-1) {
						listhtml += '...';
						break;
					}
				}
				$('td:eq(1)', nRow).html(listhtml);

				var planhtml = '';
				if (aData.defaultbundle != null) {
					planhtml += '<a href="javascript:;" bundleid="' + aData.defaultbundleid + '" class="fancybox">';
					planhtml += '<div class="thumbs" style="width: 100px; height: 100px;">';
					if (aData.defaultbundle.snapshot != '' && aData.defaultbundle.snapshot != null) {
						var thumbwidth = aData.defaultbundle.width > aData.defaultbundle.height? 100 : 100*aData.defaultbundle.width/aData.defaultbundle.height;
						planhtml += '<img src="/pixsigndata' + aData.defaultbundle.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
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
				aoData.push({'name':'branchid','value':DevicegroupTree.branchid });
				aoData.push({'name':'type','value':'1' });
			}
		});
		$('#DevicegroupTable_wrapper').addClass('form-inline');
		$('#DevicegroupTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DevicegroupTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DevicegroupTable_wrapper .dataTables_length select').select2();
		$('#DevicegroupTable').css('width', '100%');

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
	
	var initDevicegroupEvent = function () {
		$('body').on('click', '.pix-sync', function(event) {
			var target = $(event.target);
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				target = $(event.target).parent();
				index = $(event.target).parent().attr('data-id');
			}
			_devicegroup = $('#DevicegroupTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.sync + _devicegroup.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'GET',
						url : 'devicegroup!sync.action',
						cache: false,
						data : {
							devicegroupid: _devicegroup.devicegroupid,
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
			_devicegroup = $('#DevicegroupTable').dataTable().fnGetData(index);
			_bundle = _devicegroup.defaultbundle;
			$('#BundleModal').modal();
		});
		$('#BundleModal').on('shown.bs.modal', function (e) {
			bundleselect.refresh();
			bundleselect.setBundle(_bundle);
		})
		$('[type=submit]', $('#BundleModal')).on('click', function(event) {
			$.ajax({
				type : 'POST',
				url : 'devicegroup!update.action',
				data : {
					'devicegroup.devicegroupid': _devicegroup.devicegroupid,
					'devicegroup.defaultbundleid': bundleselect.getBundle().bundleid,
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
		var devicegroupselect = new DevicegroupSelect($('#BatchModal'));
		
		$('body').on('click', '.pix-batch', function(event) {
			devicegroupselect.clear();
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
				if (validSelectDevicegroups()) {
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
			devicegroupselect.refresh();
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
			var devicegroups = devicegroupselect.getSelected();
			var devicegroupids = [];
			if (devicegroups != null) {
				for (var i=0; i<devicegroups.length; i++) {
					devicegroupids.push(devicegroups[i].devicegroupid);
				}
			}
			
			$.ajax({
				type : 'POST',
				url : 'devicegroup!updatebundle.action',
				data : {
					'defaultbundleid': defaultbundleid,
					'devicegroupids': devicegroupids.join(','),
				},
				success : function(data, status) {
					_submitflag = false;
					Metronic.unblockUI();
					$('#BatchModal').modal('hide');
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
						$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
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

		function validSelectDevicegroups() {
			if (devicegroupselect.getSelected().length == 0) {
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
