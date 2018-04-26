var DeviceModule = function () {
	var _submitflag = false;
	var _device = {};
	var _page = {};
	var timestamp = new Date().getTime();

	var init = function () {
		initDeviceTable();
		initDeviceEvent();
		initPageModal();
		initBatchWizard();
	};

	var refresh = function () {
		$('#DeviceTable').dataTable()._fnAjaxUpdate();
	};
	
	var initDeviceTable = function () {
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
					devicehtml += aData.terminalid + '/' + aData.name;
				} else {
					devicehtml += aData.terminalid + '';
				}
				$('td:eq(0)', nRow).html(devicehtml);
				
				$('td:eq(1)', nRow).html(aData.branch.name);

				var planhtml = '';
				if (aData.defaultpage != null) {
					planhtml += '<a href="javascript:;" pageid="' + aData.defaultpageid + '" class="fancybox">';
					planhtml += '<div class="thumbs" style="width: 100px; height: 100px;">';
					if (aData.defaultpage.snapshot != '' && aData.defaultpage.snapshot != null) {
						var thumbwidth = aData.defaultpage.width > aData.defaultpage.height? 100 : 100*aData.defaultpage.width/aData.defaultpage.height;
						planhtml += '<img src="/pixsigdata' + aData.defaultpage.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
					}
					planhtml += '</div>';
					planhtml += '</a>';
					planhtml += '<h6 class="pixtitle">' + aData.defaultpage.name + '</h6>';
				}
				$('td:eq(2)', nRow).html(planhtml);

				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-page"><i class="fa fa-cog"></i> ' + common.view.config + ' </a>';
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
					var pageid = $(this).attr('pageid');

					$.ajax({
						type : 'GET',
						url : 'page!get.action',
						data : {pageid: pageid},
						success : function(data, status) {
							if (data.errorcode == 0) {
								$.fancybox({
									openEffect	: 'none',
									closeEffect	: 'none',
									closeBtn : false,
							        padding : 0,
							        content: '<div id="PagePreview"></div>',
							    });
								PagePreviewModule.preview($('#PagePreview'), data.page, 800);
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

	var initPageModal = function () {
		var pageselect = new PageSelect($('#PageModal'), TouchCtrl);

		$('body').on('click', '.pix-page', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_device = $('#DeviceTable').dataTable().fnGetData(index);
			_page = _device.defaultpage;
			$('#PageModal').modal();
		});
		$('#PageModal').on('shown.bs.modal', function (e) {
			pageselect.refresh();
			pageselect.setPage(_page);
		})
		$('[type=submit]', $('#PageModal')).on('click', function(event) {
			$.ajax({
				type : 'POST',
				url : 'device!update.action',
				data : {
					'device.deviceid': _device.deviceid,
					'device.defaultpageid': pageselect.getPage().pageid,
				},
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#PageModal').modal('hide');
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
		var pageselect = new PageSelect($('#BatchModal'), TouchCtrl);
		var bindselect = new BindSelect($('#BatchModal'));
		
		$('body').on('click', '.pix-batch', function(event) {
			bindselect.setBinds([]);
			initWizard();
			$('#BatchModal').modal();
		});

		$('#BatchModal').on('shown.bs.modal', function (e) {
			pageselect.refresh();
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
						if (validSelectPage()) {
							initData2();
						} else {
							return false;
						}
					} 
				},
				onNext: function (tab, navigation, index) {
					if (index == 1) {
						if (validSelectPage()) {
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
						pageselect.refresh();
					}
				}
			});

			$('#MyWizard').find('.button-previous').hide();
			$('#MyWizard .button-submit').click(function () {
				if (validSelectBinds()) {
					submitData();
				}
			}).hide();
			
			$('#MyWizard').bootstrapWizard('first');
		}

		function initTab1() {
		}

		function initData1() {
			pageselect.refresh();
		}

		function initTab2() {
		}

		function initData2() {
			bindselect.refresh();
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
			
			var page = pageselect.getPage();
			var binds = bindselect.getBinds();
			for (var i=0; i<binds.length; i++) {
				binds[i].device = undefined;
				binds[i].devicegroup = undefined;
			}
			
			$.ajax({
				type : 'POST',
				url : 'plan!batch.action',
				data : '{"page":' + $.toJSON(page) + ', "binds":' + $.toJSON(binds) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
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

		function validSelectPage() {
			if (pageselect.getPage() == null) {
				bootbox.alert(common.tips.page_zero);
				return false;
			}
			return true;
		}

		function validSelectBinds() {
			if (bindselect.getBinds().length == 0) {
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
