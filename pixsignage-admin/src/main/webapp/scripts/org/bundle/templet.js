var TempletModule = function () {
	var _design;
	var _submitflag = false;

	var init = function () {
		_design = new BundleDesignModule('templet');
		initTempletTable();
		initTempletEvent();
		initTempletEditModal();
		initTempletDesignModal();
	};

	var refresh = function () {
		$('#TempletTable').dataTable()._fnAjaxUpdate();
	};
	
	var initTempletTable = function () {
		$('#TempletTable thead').css('display', 'none');
		$('#TempletTable tbody').css('display', 'none');
		$('#TempletTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 16, 36, 72, 108 ],
								[ 16, 36, 72, 108 ] 
								],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'templet!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }],
			'iDisplayLength' : 16,
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
				templethtml += '<h3>' + aData.name + '</h3>';

				templethtml += '<a href="javascript:;" templetid="' + aData.templetid + '" class="fancybox">';
				templethtml += '<div class="thumbs">';
				if (aData.snapshot != null && aData.snapshot != '') {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					templethtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				templethtml += '</div></a>';
				
				templethtml += '<div class="util-btn-margin-bottom-5">';
				templethtml += '<a href="javascript:;" templetid="' + aData.templetid + '" class="btn default btn-xs blue pix-templet"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
				templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				templethtml += '</div>';

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
				$('.thumbs').each(function(i) {
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
				aoData.push({'name':'touchflag','value':'0' });
			},
		});
		$('#TempletTable_wrapper').addClass('form-inline');
		$('#TempletTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#TempletTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#TempletTable_wrapper .dataTables_length select').select2();
		$('#TempletTable').css('width', '100%').css('table-layout', 'fixed');
	};
	
	var initTempletEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			var templet = $('#TempletTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + templet.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'templet!delete.action',
						cache: false,
						data : {
							'templet.templetid': templet.templetid
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
	};

	var initTempletEditModal = function () {
		var formHandler = new FormHandler($('#TempletEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['templet.name'] = {};
		formHandler.validateOption.rules['templet.name']['required'] = true;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#TempletEditForm').attr('action'),
				data : $('#TempletEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#TempletEditModal').modal('hide');
						bootbox.alert(common.tips.success);
						$('#TempletTable').dataTable().fnDraw(true);
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		};
		$('#TempletEditForm').validate(formHandler.validateOption);
		$('[type=submit]', $('#TempletEditModal')).on('click', function(event) {
			if ($('#TempletEditForm').valid()) {
				$('#TempletEditForm').submit();
			}
		});

		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#TempletEditForm').attr('action', 'templet!add.action');
			$('.hide-update').css('display', 'block');
			$('#TempletEditModal').modal();
		});			

		$('#TempletTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			formHandler.setdata('templet', $('#TempletTable').dataTable().fnGetData(index));
			$('#TempletEditForm').attr('action', 'templet!update.action');
			$('.hide-update').css('display', 'none');
			$('#TempletEditModal').modal();
		});
	};
	
	var initTempletDesignModal = function () {
		$('#TempletModal').on('shown.bs.modal', function (e) {
			_design.show();
		})

		$('body').on('click', '.pix-templet', function(event) {
			var templetid = $(event.target).attr('templetid');
			if (templetid == undefined) {
				templetid = $(event.target).parent().attr('templetid');
			}
			$.ajax({
				type : 'GET',
				url : 'templet!get.action',
				data : {templetid: templetid},
				success : function(data, status) {
					if (data.errorcode == 0) {
						_design.Object = data.templet;
						_design.Object.bundleid = _design.Object.templetid;
						_design.Object.bundlezones = _design.Object.templetzones;
						for (var i=0; i<_design.Object.bundlezones.length; i++) {
							_design.Object.bundlezones[i].bundlezoneid = _design.Object.bundlezones[i].templetzoneid;
							_design.Object.bundlezones[i].bundleid = _design.Object.bundlezones[i].templetid;
							_design.Object.bundlezones[i].bundlezonedtls = _design.Object.bundlezones[i].templetzonedtls;
							for (var j=0; j<_design.Object.bundlezones[i].bundlezonedtls.length; j++) {
								_design.Object.bundlezones[i].bundlezonedtls[j].bundlezonedtlid = _design.Object.bundlezones[i].bundlezonedtls[j].templetzonedtlid;
								_design.Object.bundlezones[i].bundlezonedtls[j].bundlezoneid = _design.Object.bundlezones[i].bundlezonedtls[j].templetzoneid;
							}
						}
						_design.Objectid = _design.Object.bundleid;
						_design.Zone = null;
						$('.touch-ctrl').css('display', TouchCtrl? '':'none');
						$('.rss-ctrl').css('display', RssCtrl? '':'none');
						$('.stream-ctrl').css('display', StreamCtrl? '':'none');
						$('.dvb-ctrl').css('display', DvbCtrl? '':'none');
						$('.videoin-ctrl').css('display', VideoinCtrl? '':'none');
						$('.massage-ctrl').css('display', MassageCtrl? '':'none');
						$('#TempletModal').modal();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		});

		$('[type=submit]', $('#TempletModal')).on('click', function(event) {
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

					_design.Object.templetid = _design.Object.bundleid;
					_design.Object.bundleid = undefined;
					_design.Object.templetzones = _design.Object.bundlezones;
					_design.Object.bundlezones = undefined;
					for (var i=0; i<_design.Object.templetzones.length; i++) {
						_design.Object.templetzones[i].templetzoneid = _design.Object.templetzones[i].bundlezoneid;
						_design.Object.templetzones[i].bundlezoneid = undefined;
						_design.Object.templetzones[i].templetid = _design.Object.templetzones[i].bundleid;
						_design.Object.templetzones[i].bundleid = undefined;
						_design.Object.templetzones[i].templetzonedtls = _design.Object.templetzones[i].bundlezonedtls;
						_design.Object.templetzones[i].bundlezonedtls = undefined;
						for (var j=0; j<_design.Object.templetzones[i].templetzonedtls.length; j++) {
							_design.Object.templetzones[i].templetzonedtls[j].templetzonedtlid = _design.Object.templetzones[i].templetzonedtls[j].bundlezonedtlid;
							_design.Object.templetzones[i].templetzonedtls[j].bundlezonedtlid = undefined;
							_design.Object.templetzones[i].templetzonedtls[j].templetzoneid = _design.Object.templetzones[i].templetzonedtls[j].bundlezoneid;
							_design.Object.templetzones[i].templetzonedtls[j].bundlezoneid = undefined;
							_design.Object.templetzones[i].templetzonedtls[j].image = undefined;
							_design.Object.templetzones[i].templetzonedtls[j].video = undefined;
							_design.Object.templetzones[i].templetzonedtls[j].stream = undefined;
							_design.Object.templetzones[i].templetzonedtls[j].dvb = undefined;
						}
					}
					$.ajax({
						type : 'POST',
						url : 'templet!design.action',
						data : '{"templet":' + $.toJSON(_design.Object) + '}',
						dataType : 'json',
						contentType : 'application/json;charset=utf-8',
						success : function(data, status) {
							_submitflag = false;
							Metronic.unblockUI();
							$('#TempletModal').modal('hide');
							if (data.errorcode == 0) {
								bootbox.alert(common.tips.success);
								$('#TempletTable').dataTable()._fnAjaxUpdate();
							} else {
								bootbox.alert(common.tips.error + data.errormsg);
							}
						},
						error : function() {
							_submitflag = false;
							Metronic.unblockUI();
							$('#TempletModal').modal('hide');
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
