var BundleModule = function () {
	var _bundle;
	var _design;
	var _submitflag = false;
	this.BundleTree = new BranchTree($('#BundlePortlet'));

	var init = function () {
		_design = new BundleDesignModule('bundle');
		initBundleTable();
		initBundleEvent();
		initBundleEditModal();
		initBundleDesignModal();
		initBundlePushModal();
	};

	var refresh = function () {
		$('#BundleTable').dataTable()._fnAjaxUpdate();
	};
	
	var initBundleTable = function () {
		$('#BundleTable thead').css('display', 'none');
		$('#BundleTable tbody').css('display', 'none');
		$('#BundleTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 16, 36, 72, 108 ],
								[ 16, 36, 72, 108 ] 
								],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'bundle!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }],
			'iDisplayLength' : 16,
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
				if (iDisplayIndex % 4 == 0) {
					bundlehtml = '';
					bundlehtml += '<div class="row" >';
				}
				bundlehtml += '<div class="col-md-3 col-xs-3">';
				bundlehtml += '<h3>' + aData.name + '</h3>';
				if (aData.reviewflag == 0) {
					bundlehtml += '<h6><span class="label label-sm label-default">' + common.view.review_wait + '</span></h6>';
				} else if (aData.reviewflag == 1) {
					bundlehtml += '<h6><span class="label label-sm label-success">' + common.view.review_passed + '</span></h6>';
				} else if (aData.reviewflag == 2) {
					bundlehtml += '<h6><span class="label label-sm label-danger">' + common.view.review_rejected + '</span></h6>';
				}

				bundlehtml += '<a href="javascript:;" bundleid="' + aData.bundleid + '" class="fancybox">';
				bundlehtml += '<div class="thumbs">';
				if (aData.snapshot != null && aData.snapshot != '') {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					bundlehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				bundlehtml += '</div></a>';
				
				bundlehtml += '<div class="util-btn-margin-bottom-5">';
				bundlehtml += '<a href="javascript:;" bundleid="' + aData.bundleid + '" class="btn default btn-xs blue pix-bundle"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
				bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				if (aData.reviewflag == 1) {
					bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-push"><i class="fa fa-desktop"></i> ' + common.view.device + '</a>';
					bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
					//bundlehtml += '<a href="bundle!export.action?bundleid=' + aData.bundleid + '" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-export"><i class="fa fa-download"></i> ' + common.view.export + '</a>';
				}
				bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				bundlehtml += '</div>';

				bundlehtml += '</div>';
				if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#BundleTable').dataTable().fnGetData().length) {
					bundlehtml += '</div>';
					if ((iDisplayIndex+1) != $('#BundleTable').dataTable().fnGetData().length) {
						bundlehtml += '<hr/>';
					}
					$('#BundleContainer').append(bundlehtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('.thumbs').each(function(i) {
					$(this).width($(this).parent().closest('div').width());
					$(this).height($(this).parent().closest('div').width());
				});
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
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':BundleTree.branchid });
				aoData.push({'name':'touchflag','value':'0' });
			},
		});
		$('#BundleTable_wrapper').addClass('form-inline');
		$('#BundleTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#BundleTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#BundleTable_wrapper .dataTables_length select').select2();
		$('#BundleTable').css('width', '100%').css('table-layout', 'fixed');
	};
	
	var initBundleEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_bundle = $('#BundleTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _bundle.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'bundle!delete.action',
						cache: false,
						data : {
							'bundle.bundleid': _bundle.bundleid
						},
						success : function(data, status) {
							if (data.errorcode == 0) {
								refresh();
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
			
		});

		$('body').on('click', '.pix-sync', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_bundle = $('#BundleTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.synclayout, function(result) {
				if (result == true) {
					$.ajax({
						type : 'GET',
						url : 'bundle!sync.action',
						cache: false,
						data : {
							bundleid: _bundle.bundleid,
						},
						dataType : 'json',
						contentType : 'application/json;charset=utf-8',
						beforeSend: function ( xhr ) {
							Metronic.blockUI({
								zIndex: 20000,
								animate: true
							});
						},
						success : function(data, status) {
							Metronic.unblockUI();
							if (data.errorcode == 0) {
								bootbox.alert(common.tips.success);
							} else {
								bootbox.alert(common.tips.error + data.errormsg);
							}
						},
						error : function() {
							Metronic.unblockUI();
							console.log('failue');
						}
					});				
				}
			});
		});

	};

	var initBundleEditModal = function () {
		var formHandler = new FormHandler($('#BundleEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['bundle.name'] = {};
		formHandler.validateOption.rules['bundle.name']['required'] = true;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#BundleEditForm').attr('action'),
				data : $('#BundleEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#BundleEditModal').modal('hide');
						bootbox.alert(common.tips.success);
						$('#BundleTable').dataTable().fnDraw(true);
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		};
		$('#BundleEditForm').validate(formHandler.validateOption);
		$('[type=submit]', $('#BundleEditModal')).on('click', function(event) {
			if ($('#BundleEditForm').valid()) {
				$('#BundleEditForm').submit();
			}
		});

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
					console.log($(this).parent().closest('div').width());
					$(this).width($(this).parent().closest('div').width());
					$(this).height($(this).parent().closest('div').width());
				});
				$('#TempletContainer .fancybox').each(function(index,item) {
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
								        title: templetid,
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
				var templetflag = $('#BundleEditForm input[name="templetflag"]:checked').val();
				var ratio = $('select[name="bundle.ratio"]').val();
				aoData.push({'name':'templetflag','value':templetflag });
				aoData.push({'name':'touchflag','value':'0' });
				aoData.push({'name':'ratio','value':ratio });
			}
		});
		function refreshTemplet() {
			$('#BundleEditForm input[name="bundle.templetid"]').val('0');
			var templetflag = $('#BundleEditForm input[name="templetflag"]:checked').val();
			if (templetflag != 0 && $('#BundleEditForm').attr('action') == 'bundle!add.action') {
				$('.templet-ctrl').css('display', '');
				$('#TempletTable').dataTable().fnDraw(true);
			} else {
				$('.templet-ctrl').css('display', 'none');
			}
		}
		$('#BundleEditModal').on('shown.bs.modal', function (e) {
			refreshTemplet();
		})
		$('#BundleEditForm input[name="templetflag"]').change(function(e) {
			refreshTemplet();
		});
		$('#BundleEditForm select[name="bundle.ratio"]').on('change', function(e) {
			refreshTemplet();
		});	

		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#BundleEditForm input[name="bundle.branchid"').val(BundleTree.branchid);
			$('#BundleEditForm').attr('action', 'bundle!add.action');
			$('.hide-update').css('display', 'block');
			$('#BundleEditModal').modal();
		});			

		$('#BundleTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			formHandler.setdata('bundle', $('#BundleTable').dataTable().fnGetData(index));
			$('#BundleEditForm').attr('action', 'bundle!update.action');
			$('.hide-update').css('display', 'none');
			$('#BundleEditModal').modal();
		});
	};
	
	var initBundleDesignModal = function () {
		$('#BundleModal').on('shown.bs.modal', function (e) {
			_design.show();
		})

		$('body').on('click', '.pix-bundle', function(event) {
			var bundleid = $(event.target).attr('bundleid');
			if (bundleid == undefined) {
				bundleid = $(event.target).parent().attr('bundleid');
			}
			$.ajax({
				type : 'GET',
				url : 'bundle!get.action',
				data : {bundleid: bundleid},
				success : function(data, status) {
					if (data.errorcode == 0) {
						_design.Object = data.bundle;
						_design.Objectid = data.bundle.bundleid;
						_design.Zone = null;
						$('.touch-ctrl').css('display', TouchCtrl? '':'none');
						$('.stream-ctrl').css('display', StreamCtrl? '':'none');
						$('.dvb-ctrl').css('display', DvbCtrl? '':'none');
						$('.videoin-ctrl').css('display', VideoinCtrl? '':'none');
						$('#BundleModal').modal();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		});

		$('[type=submit]', $('#BundleModal')).on('click', function(event) {
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
					$.ajax({
						type : 'POST',
						url : 'bundle!design.action',
						data : '{"bundle":' + $.toJSON(_design.Object) + '}',
						dataType : 'json',
						contentType : 'application/json;charset=utf-8',
						success : function(data, status) {
							_submitflag = false;
							Metronic.unblockUI();
							$('#BundleModal').modal('hide');
							if (data.errorcode == 0) {
								bootbox.alert(common.tips.success);
								$('#BundleTable').dataTable()._fnAjaxUpdate();
							} else {
								bootbox.alert(common.tips.error + data.errormsg);
							}
						},
						error : function() {
							_submitflag = false;
							Metronic.unblockUI();
							$('#BundleModal').modal('hide');
							console.log('failue');
						}
					});
				}
			});
		});
	}
	
	var initBundlePushModal = function () {
		var SelectedBindList = [];

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
		function refreshSelectedBindTable() {
			$('#SelectedBindTable').dataTable().fnClearTable();
			for (var i=0; i<SelectedBindList.length; i++) {
				var bind = SelectedBindList[i];
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
			if (SelectedBindList.filter(function (el) {
				return el.bindtype == 1 && el.bindid == data.deviceid;
			}).length > 0) {
				return;
			}
			var bind = {};
			bind.bindtype = 1;
			bind.bindid = data.deviceid;
			bind.device = data;
			SelectedBindList.push(bind);
			refreshSelectedBindTable();
		});
		//增加Devicegroup到SelectedBindTable
		$('body').on('click', '.pix-bind-devicegroup-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#DevicegroupTable').dataTable().fnGetData(rowIndex);
			if (SelectedBindList.filter(function (el) {
				return el.bindtype == 2 && el.bindid == data.devicegroupid;
			}).length > 0) {
				return;
			}

			var bind = {};
			bind.bindtype = 2;
			bind.bindid = data.devicegroupid;
			bind.devicegroup = data;
			SelectedBindList.push(bind);
			refreshSelectedBindTable();
		});
		//删除SelectedBindTable
		$('body').on('click', '.pix-bind-delete', function(event) {
			var index = $(event.target).attr('index');
			if (index == undefined) {
				index = $(event.target).parent().attr('index');
			}
			SelectedBindList.splice(index, 1);
			refreshSelectedBindTable();
		});

		//在列表页面中点击终端
		$('body').on('click', '.pix-push', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_bundle = $('#BundleTable').dataTable().fnGetData(index);
			$('#SelectedBindTable').dataTable().fnClearTable();
			SelectedBindList = [];
			$('#PushModal').modal();
		});

		//在终端对话框中进行提交
		$('[type=submit]', $('#PushModal')).on('click', function(event) {
			for (var i=0; i<SelectedBindList.length; i++) {
				SelectedBindList[i].device = undefined;
				SelectedBindList[i].devicegroup = undefined;
			}
			$.ajax({
				type : 'POST',
				url : 'bundle!push.action',
				data : '{"bundle": { "bundleid":' + _bundle.bundleid + '}, "binds":' + $.toJSON(SelectedBindList) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				beforeSend: function ( xhr ) {
					Metronic.blockUI({
						zIndex: 20000,
						animate: true
					});
				},
				success : function(data, status) {
					Metronic.unblockUI();
					$('#PushModal').modal('hide');
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					Metronic.unblockUI();
					$('#PushModal').modal('hide');
					console.log('failue');
				}
			});

			event.preventDefault();
		});	
	}
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
