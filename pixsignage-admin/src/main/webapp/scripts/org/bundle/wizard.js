var WizardModule = function () {
	var _bundle;
	var _design;
	var _bindlist = [];
	var _submitflag = false;

	var init = function () {
		_design = new BundleDesignModule('bundle');
		initWizard();
	};

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

	var initWizard = function () {
		initTab1();
		initTab2();
		initTab3();
		initTab4();
		initData1();

		$('#MyWizard').bootstrapWizard({
			'nextSelector': '.button-next',
			'previousSelector': '.button-previous',
			onTabClick: function (tab, navigation, index, clickedIndex) {
				if ((clickedIndex-index)>1) {
					return false;
				}
				if (index == 0 && clickedIndex == 1) {
					if ($('#BundleForm').valid()) {
						initData2();
					} else {
						return false;
					}
				} else if (index == 1 && clickedIndex == 2) {
					initData3();
				} else if (index == 2 && clickedIndex == 3) {
					if (_bindlist.length == 0) {
						bootbox.alert(common.tips.device_missed);
						return false;
					} else {
						initData4();
					}
				}
			},
			onNext: function (tab, navigation, index) {
				if (index == 1) {
					if ($('#BundleForm').valid()) {
						initData2();
					} else {
						return false;
					}
				} else if (index == 2) {
					initData3();
				} else if (index == 3) {
					if (_bindlist.length == 0) {
						bootbox.alert(common.tips.device_missed);
						return false;
					} else {
						initData4();
					}
				}
			},
			onPrevious: function (tab, navigation, index) {
			},
			onTabShow: function (tab, navigation, index) {
				var total = navigation.find('li').length;
				var current = index + 1;
				var $percent = (current / total) * 100;
				$('#MyWizard').find('.progress-bar').css({
					width: $percent + '%'
				});
				handleTitle(tab, navigation, index);
				
				if (index == 1) {
					_design.show();
				} else if (index == 3) {
					//enterBundledtlFocus(_bundlezone);
					//$('#VideoTable').dataTable()._fnAjaxUpdate();
				}
			}
		});

		$('#MyWizard').find('.button-previous').hide();
		$('#MyWizard .button-submit').click(function () {
			if (_submitflag) {
				return;
			}
			_submitflag = true;
			Metronic.blockUI({
				zIndex: 20000,
				animate: true
			});
			$('#snapshot_div').show();
			BundlePreviewModule.preview($('#snapshot_div'), _design.Object, 1024);
			html2canvas($('#snapshot_div'), {
				onrendered: function(canvas) {
					//console.log(canvas.toDataURL());
					_design.Object.snapshotdtl = canvas.toDataURL();
					$('#snapshot_div').hide();

					for (var i=0; i<_design.Object.bundlezones.length; i++) {
						for (var j=0; j<_design.Object.bundlezones[i].bundlezonedtls.length; j++) {
							_design.Object.bundlezones[i].bundlezonedtls[j].image = undefined;
							_design.Object.bundlezones[i].bundlezonedtls[j].video = undefined;
						}
					}
					for (var i=0; i<_bindlist.length; i++) {
						_bindlist[i].device = undefined;
						_bindlist[i].devicegroup = undefined;
					}
					$.ajax({
						type : 'POST',
						url : 'bundle!wizard.action',
						data : '{"bundle":' + $.toJSON(_design.Object) + ', "binds":' + $.toJSON(_bindlist) + '}',
						dataType : 'json',
						contentType : 'application/json;charset=utf-8',
						success : function(data, status) {
							_submitflag = false;
							Metronic.unblockUI();
							$('#BundleModal').modal('hide');
							if (data.errorcode == 0) {
								bootbox.alert(common.tips.success);
								initData1();
								$('#MyWizard').bootstrapWizard('first');
							} else {
								bootbox.alert(common.tips.error + data.errormsg);
								initData1();
								$('#MyWizard').bootstrapWizard('first');
							}
						},
						error : function() {
							_submitflag = false;
							Metronic.unblockUI();
							console.log('failue');
						}
					});
				}
			});
		}).hide();
	};
	
	var initTab1 = function () {
		var formHandler = new FormHandler($('#BundleForm'));
		formHandler.validateOption.rules = {};
		//formHandler.validateOption.rules['name'] = {};
		//formHandler.validateOption.rules['name']['required'] = true;
		$('#BundleForm').validate(formHandler.validateOption);

		$('#TempletTable thead').css('display', 'none');
		$('#TempletTable tbody').css('display', 'none');
		var templethtml = '';
		$('#TempletTable').dataTable({
			'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 12, 30, 48, 96 ],
							  [ 12, 30, 48, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'templet!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }],
			'iDisplayLength' : 12,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#TempletContainer').length < 1) {
					$('#TempletTable').append('<div id="TempletContainer"></div>');
				}
				$('#TempletContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 4 == 0) {
					templethtml = '';
					templethtml += '<div class="row" >';
				}
				templethtml += '<div class="col-md-3 col-xs-3">';
				templethtml += '<a href="javascript:;" templetid="' + aData.templetid + '" class="fancybox">';
				templethtml += '<div class="thumbs">';
				if (aData.snapshot != null) {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					templethtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				templethtml += '</div></a>';
				templethtml += '<label class="radio-inline">';
				if (iDisplayIndex == 0) {
					templethtml += '<input type="radio" name="bundle.templetid" value="' + aData.templetid + '" checked>';
				} else {
					templethtml += '<input type="radio" name="bundle.templetid" value="' + aData.templetid + '">';
				}
				templethtml += aData.name + '</label>';

				templethtml += '</div>';
				if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#TempletTable').dataTable().fnGetData().length) {
					templethtml += '</div>';
					if ((iDisplayIndex+1) != $('#TempletTable').dataTable().fnGetData().length) {
						templethtml += '<hr/>';
					}
					$('#TempletContainer').append(templethtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#TempletContainer .thumbs').each(function(i) {
					$(this).width($(this).parent().closest('div').width());
					$(this).height($(this).parent().closest('div').width());
				});
				$('.fancybox').each(function(index,item) {
					$(this).click(function() {
						var templetid = $(this).attr('templetid');
						$.ajax({
							type : 'GET',
							url : 'templet!get.action',
							data : {templetid: templetid},
							success : function(data, status) {
								if (data.errorcode == 0) {
									$.fancybox({
										openEffect	: 'none',
										closeEffect	: 'none',
										closeBtn : false,
								        padding : 0,
								        content: '<div id="TempletPreview"></div>',
								    });
									BundlePreviewModule.preview($('#TempletPreview'), data.templet, 800);
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
			},
			'fnServerParams': function(aoData) {
				var templetflag = $('#BundleForm input[name="templetflag"]:checked').val();
				var ratio = $('select[name="bundle.ratio"]').val();
				aoData.push({'name':'templetflag','value':templetflag });
				aoData.push({'name':'touchflag','value':'0' });
				aoData.push({'name':'ratio','value':ratio });
			}
		});
		jQuery('#TempletTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		jQuery('#TempletTable_wrapper .dataTables_length select').addClass('form-control input-small');
		jQuery('#TempletTable_wrapper .dataTables_length select').select2();

		$('#BundleForm input[name="templetflag"]').change(function(e) {
			refreshTemplet();
		});

		$('#BundleForm select[name="bundle.ratio"]').on('change', function(e) {
			refreshTemplet();
		});	

		function refreshTemplet() {
			$('#BundleForm input[name="bundle.templetid"]').val('0');
			var templetflag = $('#BundleForm input[name="templetflag"]:checked').val();
			if (templetflag == 0) {
				$('.templet-ctrl').css('display', 'none');
			} else {
				$('.templet-ctrl').css('display', '');
				$('#TempletTable').dataTable().fnDraw(true);
			}
		}

		refreshTemplet();
	};

	var initData1 = function () {
	};
	
	var initTab2 = function () {
	};
	
	var initData2 = function () {
		var ratio = $('select[name="bundle.ratio"]').val();
		var templetflag = $('#BundleForm input[name="templetflag"]:checked').val();
		var templetid;
		if (templetflag == 0) {
			_bundle = {};
			_bundle.name = $('#BundleForm input[name="name"]').val();
			_bundle.bundleid = 0;
			_bundle.homebundleid = 0;
			_bundle.templetid = 0;
			_bundle.touchflag = 0;
			_bundle.homeflag = 1;
			_bundle.status = 1;
			_bundle.bundlezones = [];
			if (ratio == 1) {
				// 16:9
				_bundle.width = 1920;
				_bundle.height = 1080;
			} else if (ratio == 2) {
				// 9:16
				_bundle.width = 1080;
				_bundle.height = 1920;
			} else if (ratio == 3) {
				// 4:3
				_bundle.width = 1920;
				_bundle.height = 1440;
			} else if (ratio == 4) {
				// 3:4
				_bundle.width = 1440;
				_bundle.height = 1920;
			}
		} else {
			templetid = $('#BundleForm input[name="bundle.templetid"]:checked').val();
			$.ajax({
				type : 'GET',
				url : 'templet!get.action',
				data : {templetid: templetid},
				success : function(data, status) {
					if (data.errorcode == 0) {
						_bundle = data.templet;
						_bundle.bundlezones = data.templet.templetzones;
						_bundle.bundleid = 0;
						_bundle.homebundleid = 0;
						_bundle.templetid = undefined;
						_bundle.hometempletid = undefined;
						for (var i=0; i<_bundle.bundlezones.length; i++) {
							var bundlezone = _bundle.bundlezones[i];
							bundlezone.bundleid = 0;
							bundlezone.bundlezoneid = '-' + Math.round(Math.random()*100000000);
							bundlezone.bundlezonedtls = bundlezone.templetzonedtls;
							bundlezone.templetid = undefined;
							bundlezone.hometempletid = undefined;
							bundlezone.templetzoneid = undefined;
							bundlezone.templetzonedtls = undefined;
							for (var j=0; j<bundlezone.bundlezonedtls.length; j++) {
								bundlezone.bundlezonedtls[j].bundlezonedtlid = 0;
								bundlezone.bundlezonedtls[j].bundlezoneid = bundlezone.bundlezoneid;
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
		}
		_design.Object = _bundle;
		_design.Objectid = _bundle.bundleid;
		_design.Zone = null;
		$('.touch-ctrl').css('display', TouchCtrl? '':'none');
		$('.rss-ctrl').css('display', StreamCtrl? '':'none');
		$('.stream-ctrl').css('display', StreamCtrl? '':'none');
		$('.dvb-ctrl').css('display', DvbCtrl? '':'none');
		$('.videoin-ctrl').css('display', VideoinCtrl? '':'none');
	};
	
	var initTab3 = function () {
		var DeviceTree = new BranchTree($('#DeviceTab'));
		$('#DeviceTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'device!list.action',
			'aoColumns' : [ {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
							{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.branch, 'mData' : 'branchid', 'bSortable' : false }, 
							{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false }],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(2)', nRow).html(aData.branch.name);
				$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-bind-device-add">' + common.view.add + '</button>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':DeviceTree.branchid });
				aoData.push({'name':'devicegroupid','value':'0' });
			}
		});
		$('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DeviceTable').css('width', '100%');

		var DevicegroupTree = new BranchTree($('#DevicegroupTab'));
		$('#DevicegroupTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'devicegroup!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.detail, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '80%' },
							{'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '10%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var listhtml = '';
				for (var i=0; i<aData.devices.length; i++) {
					listhtml += aData.devices[i].terminalid + ' ';
				}
				$('td:eq(1)', nRow).html(listhtml);
				$('td:eq(2)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-bind-devicegroup-add">' + common.view.add + '</button>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':DevicegroupTree.branchid });
				aoData.push({'name':'type','value':'1' });
			}
		});
		$('#DevicegroupTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DevicegroupTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DevicegroupTable').css('width', '100%');

		//SelectedBindTable初始化
		$('#SelectedBindTable').dataTable({
			'sDom' : 't',
			'iDisplayLength' : -1,
			'aoColumns' : [ {'sTitle' : '', 'bSortable' : false, 'sWidth' : '40px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '80px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '80px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '30px' }],
			'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
			'oLanguage' : { 'sZeroRecords' : common.view.empty,
							'sEmptyTable' : common.view.empty }, 
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(3)', nRow).html('<button index="' + iDisplayIndex + '" class="btn red btn-xs pix-bind-delete"><i class="fa fa-trash-o"></i></button>');
				return nRow;
			}
		});

		$('#nav_dtab1').click(function(event) {
			$('#DeviceDiv').css('display', '');
			$('#DevicegroupDiv').css('display', 'none');
			$('#DeviceTable').dataTable()._fnAjaxUpdate();
		});
		$('#nav_dtab2').click(function(event) {
			$('#DeviceDiv').css('display', 'none');
			$('#DevicegroupDiv').css('display', '');
			$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
		});
		//增加Device到SelectedBindTable
		$('body').on('click', '.pix-bind-device-add', function(event) {
			var rowIndex = $(event.target).attr('data-id');
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#DeviceTable').dataTable().fnGetData(rowIndex);
			if (_bindlist.filter(function (el) {
				return el.bindtype == 1 && el.bindid == data.deviceid;
			}).length > 0) {
				return;
			}
			var bind = {};
			bind.bindtype = 1;
			bind.bindid = data.deviceid;
			bind.device = data;
			_bindlist.push(bind);
			refreshSelectedBindTable();
		});
		//增加Devicegroup到SelectedBindTable
		$('body').on('click', '.pix-bind-devicegroup-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#DevicegroupTable').dataTable().fnGetData(rowIndex);
			if (_bindlist.filter(function (el) {
				return el.bindtype == 2 && el.bindid == data.devicegroupid;
			}).length > 0) {
				return;
			}

			var bind = {};
			bind.bindtype = 2;
			bind.bindid = data.devicegroupid;
			bind.devicegroup = data;
			_bindlist.push(bind);
			refreshSelectedBindTable();
		});
		//删除SelectedBindTable
		$('body').on('click', '.pix-bind-delete', function(event) {
			var index = $(event.target).attr('index');
			if (index == undefined) {
				index = $(event.target).parent().attr('index');
			}
			_bindlist.splice(index, 1);
			refreshSelectedBindTable();
		});
	};
	
	var initData3 = function () {
		_bindlist = [];
		refreshSelectedBindTable();
	};
	
	var initTab4 = function () {
	};
	
	var initData4 = function () {
		var SelectedDeviceList = [];
		var SelectedDevicegroupList = [];
		for (var i=0; i<_bindlist.length; i++) {
			console.log(_bindlist[i]);
			if (_bindlist[i].bindtype == 1) {
				console.log(_bindlist[i].device);
				SelectedDeviceList.push(_bindlist[i].device);
			} else if (_bindlist[i].bindtype == 2) {
				console.log(_bindlist[i].devicegroup);
				SelectedDevicegroupList.push(_bindlist[i].devicegroup);
			}
		}
		console.log(SelectedDeviceList, SelectedDevicegroupList);
		var deviceRowspan = SelectedDeviceList.length>1 ? SelectedDeviceList.length : 1;
		var devicegroupRowspan = SelectedDevicegroupList.length>1 ? SelectedDevicegroupList.length : 1;
		//var currentMediaSum = 0;
		//var filesize = parseInt(currentMediaSum / 1024);
		var html = '';
		html += '<tr>';
		html += '<td>' + common.view.bundle + '</td><td>' + _bundle.name + '</td>';
		html += '</tr>';
		//html += '<tr>';
		//html += '<td>视频总量</td><td>' + transferIntToComma(filesize) + ' KB</td>';
		//html += '</tr>';
		html += '<tr>';
		html += '<td rowspan="'+ deviceRowspan + '">' + common.view.device + '</td>';
		html += '<td>' + (SelectedDeviceList.length>0? SelectedDeviceList[0].name : '') + '</td>';
		html += '</tr>';
		for (var i=1; i<SelectedDeviceList.length; i++) {
			html += '<tr>';
			html += '<td>' + SelectedDeviceList[i].name + '</td>';
			html += '</tr>';
		}
		html += '<tr>';
		html += '<td rowspan="'+ devicegroupRowspan + '">' + common.view.devicegroup + '</td>';
		html += '<td>' + (SelectedDevicegroupList.length>0? SelectedDevicegroupList[0].name : '') + '</td>';
		html += '</tr>';
		for (var i=1; i<SelectedDevicegroupList.length; i++) {
			html += '<tr>';
			html += '<td>' + SelectedDevicegroupList[i].name + '</td>';
			html += '</tr>';
		}

		$('#ConfirmTable').empty();
		$('#ConfirmTable').append(html);
	};
	
	var refreshSelectedBindTable = function () {
		$('#SelectedBindTable').dataTable().fnClearTable();
		for (var i=0; i<_bindlist.length; i++) {
			var bind = _bindlist[i];
			var bindtype = '';
			var bindname = '';
			if (bind.bindtype == 1) {
				bindtype = common.view.device;
				bindname = bind.device.terminalid;
			} else if (bind.bindtype == 2) {
				bindtype = common.view.devicegroup;
				bindname = bind.devicegroup.name;
			}
			$('#SelectedBindTable').dataTable().fnAddData([(i+1), bindtype, bindname, 0]);
		}
	}
	
	return {
		init: init,
	}
	
}();
