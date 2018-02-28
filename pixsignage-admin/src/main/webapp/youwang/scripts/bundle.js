var BundleModule = function () {
	var _bundle;
	var _design;
	var _submitflag = false;

	var init = function () {
		_design = new BundleDesignModule('bundle');
		initBundleTable();
		initBundleEvent();
		initBundleEditModal();
		initBundleDesignModal();
	};

	var refresh = function () {
		$('#BundleTable').dataTable()._fnAjaxUpdate();
	};
	
	var initBundleTable = function () {
		$('#BundleTable thead').css('display', 'none');
		$('#BundleTable tbody').css('display', 'none');
		$('#BundleTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 12, 24, 48, 96 ],
							[ 12, 24, 48, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'bundle!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }],
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
				bundlehtml += '<h3>' + aData.name + '</h3>';

				bundlehtml += '<a href="javascript:;" bundleid="' + aData.bundleid + '" class="fancybox">';
				bundlehtml += '<div class="thumbs">';
				if (aData.snapshot != null && aData.snapshot != '') {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					bundlehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				bundlehtml += '</div></a>';
				
				bundlehtml += '<div class="util-btn-margin-bottom-5">';
				bundlehtml += '<a href="javascript:;" bundleid="' + aData.bundleid + '" class="btn default btn-xs blue pix-bundle"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
				bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
				bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
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
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
