var TempletModule = function () {
	var _templet;
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
				var templethtml = '';
				templethtml += '<div class="row" >';
				templethtml += '<div class="col-md-12 col-xs-12">';
				templethtml += '<h3 class="pixtitle">' + aData.name + '</h3>';
				if (aData.ratio == 1) {
					templethtml += '<h6><span class="label label-sm label-info">' + common.view.ratio_1 + '</span></h6>';
				} else if (aData.ratio == 2) {
					templethtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_2 + '</span></h6>';
				}
				templethtml += '<div privilegeid="101010">';
				templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm yellow pix-subtemplet-add"><i class="fa fa-plus"></i> ' + common.view.subtemplet + '</a>';
				templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a> </div>';
				templethtml += '</div>';
				templethtml += '</div>';

				templethtml += '<div class="row" >';
				templethtml += '<div class="col-md-4 col-xs-6">';
				templethtml += '<a href="javascript:;" templetid="' + aData.templetid + '" class="fancybox">';
				templethtml += '<div class="thumbs">';
				if (aData.snapshot != null) {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					templethtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				templethtml += '</div></a>';
				templethtml += '<div privilegeid="101010">';
				templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-templet"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
				templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				templethtml += '</div>';
				templethtml += '</div>';
				templethtml += '<div class="col-md-8 col-xs-6">';
				for (var i=0; i<aData.subtemplets.length; i++) {
					if (i % 4 == 0) {
						templethtml += '<div class="row" >';
					}
					templethtml += '<div class="col-md-3 col-xs-3">';
					templethtml += '<h5 class="pixtitle">' + aData.subtemplets[i].name + '</h5>';
					templethtml += '<a href="javascript:;" templetid="' + aData.subtemplets[i].templetid + '" sub-id="' + i + '" class="fancybox">';
					templethtml += '<div class="thumbs">';
					if (aData.subtemplets[i].snapshot != null) {
						var subthumbwidth = aData.subtemplets[i].width > aData.subtemplets[i].height? 100 : 100*aData.subtemplets[i].width/aData.subtemplets[i].height;
						templethtml += '<img src="/pixsigdata' + aData.subtemplets[i].snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + subthumbwidth + '%" />';
					}
					templethtml += '</div></a>';
					templethtml += '<div privilegeid="101010">';
					templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs blue pix-templet"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
					templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
					templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
					templethtml += '</div>';
					templethtml += '</div>';
					if ((i+1) % 4 == 0 || (i+1) == aData.subtemplets.length) {
						templethtml += '</div>';
					}
					
				}
				templethtml += '</div>';
				templethtml += '</div>';

				templethtml += '<hr/>';
				$('#TempletContainer').append(templethtml);
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
				aoData.push({'name':'touchflag','value':'1' });
				aoData.push({'name':'homeflag','value':'1' });
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
			var subid = $(event.target).attr('sub-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
				subid = $(event.target).parent().attr('sub-id');
			}
			_templet = $('#TempletTable').dataTable().fnGetData(index);
			var templetid = _templet.templetid;
			var name = _templet.name;
			_design.Subobjects = _templet.subtemplets;
			if (subid != undefined) {
				templetid = _templet.subtemplets[subid].templetid;
				name = _templet.subtemplets[subid].name;
			}

			bootbox.confirm(common.tips.remove + name, function(result) {
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
		var formHandler1 = new FormHandler($('#TempletEditForm'));
		formHandler1.validateOption.rules = {};
		formHandler1.validateOption.rules['templet.name'] = {};
		formHandler1.validateOption.rules['templet.name']['required'] = true;
		formHandler1.validateOption.submitHandler = function(form) {
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
		$('#TempletEditForm').validate(formHandler1.validateOption);
		$('[type=submit]', $('#TempletEditModal')).on('click', function(event) {
			if ($('#TempletEditForm').valid()) {
				$('#TempletEditForm').submit();
			}
		});

		var formHandler2 = new FormHandler($('#SubtempletForm'));
		formHandler2.validateOption.rules = {};
		formHandler2.validateOption.rules['templet.name'] = {};
		formHandler2.validateOption.rules['templet.name']['required'] = true;
		formHandler2.validateOption.rules['templet.homeidletime'] = {};
		formHandler2.validateOption.rules['templet.homeidletime']['required'] = true;
		formHandler2.validateOption.rules['templet.homeidletime']['number'] = true;
		formHandler2.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#SubtempletForm').attr('action'),
				data : $('#SubtempletForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#SubtempletModal').modal('hide');
						bootbox.alert(common.tips.success);
						$('#TempletTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		};
		$('#SubtempletForm').validate(formHandler2.validateOption);
		$('[type=submit]', $('#SubtempletModal')).on('click', function(event) {
			if ($('#SubtempletForm').valid()) {
				$('#SubtempletForm').submit();
			}
		});

		function refreshFromTempletTable() {
			var width = 100/(_design.Subobjects.length+1);
			var fromTempletTableHtml = '';
			fromTempletTableHtml += '<tr>';
			fromTempletTableHtml += '<td style="padding: 0px 20px 0px 0px;" width="' + width + '%">';
			fromTempletTableHtml += '<div class="thumbs" style="width:100px; height:100px;">';
			fromTempletTableHtml += '</div></td>';
			for (var i=0; i<_design.Subobjects.length; i++) {
				var fromtemplet = _design.Subobjects[i];
				fromTempletTableHtml += '<td style="padding: 0px 20px 0px 0px;" width="' + width + '%">';
				fromTempletTableHtml += '<a href="javascript:;" fromtempletid="' + fromtemplet.templetid + '" class="fancybox">';
				fromTempletTableHtml += '<div class="thumbs" style="width:100px; height:100px;">';
				if (fromtemplet.snapshot != null) {
					var thumbwidth = fromtemplet.width > fromtemplet.height? 100 : 100*fromtemplet.width/fromtemplet.height;
					fromTempletTableHtml += '<img src="/pixsigdata' + fromtemplet.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + fromtemplet.name + '" />';
				}
				fromTempletTableHtml += '</div></a></td>';
			}
			fromTempletTableHtml += '</tr>';
			fromTempletTableHtml += '<tr>';
			fromTempletTableHtml += '<td>';
			fromTempletTableHtml += '<label class="radio-inline">';
			fromTempletTableHtml += '<input type="radio" name="fromtempletid" value="0" checked>';
			fromTempletTableHtml += common.view.blank + '</label>';
			fromTempletTableHtml += '</td>';
			for (var i=0; i<_design.Subobjects.length; i++) {
				var fromtemplet = _design.Subobjects[i];
				fromTempletTableHtml += '<td>';
				fromTempletTableHtml += '<label class="radio-inline">';
				fromTempletTableHtml += '<input type="radio" name="fromtempletid" value="' + fromtemplet.templetid + '">';
				fromTempletTableHtml += fromtemplet.name + '</label>';
				fromTempletTableHtml += '</td>';
			}
			fromTempletTableHtml += '</tr>';
			$('#FromTempletTable').html(fromTempletTableHtml);
			$('#FromTempletTable').width(120 * (_design.Subobjects.length+1));

			$('#FromTempletTable .fancybox').each(function(index,item) {
				$(this).click(function() {
					var templetid = $(this).attr('fromtempletid');
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
								PagePreviewModule.preview($('#TempletPreview'), data.templet, 800);
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

		$('body').on('click', '.pix-add', function(event) {
			formHandler1.reset();
			$('#TempletEditForm').attr('action', 'templet!add.action');
			$('.hide-update').css('display', 'block');
			$('#TempletEditModal').modal();
		});			

		$('body').on('click', '.pix-subtemplet-add', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			var templet = $('#TempletTable').dataTable().fnGetData(index);
			_templet = {};
			_templet.name = '';
			_templet.homeidletime = 0;
			_templet.hometempletid = templet.templetid;
			_templet.homeflag = 0;
			_templet.ratio = templet.ratio;
			_design.Subobjects = templet.subtemplets;
			formHandler2.setdata('templet', _templet);
			$('#SubtempletForm').attr('action', 'templet!add.action');
			$('.hide-update').css('display', '');
			refreshFromTempletTable();
			$('#SubtempletModal').modal();
		});			

		$('#TempletTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			var subid = $(event.target).attr('sub-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
				subid = $(event.target).parent().attr('sub-id');
			}
			_templet = $('#TempletTable').dataTable().fnGetData(index);
			if (subid == undefined) {
				formHandler1.setdata('templet', _templet);
				$('#TempletEditForm').attr('action', 'templet!update.action');
				$('.hide-update').css('display', 'none');
				$('#TempletEditModal').modal();
			} else {
				_templet = _templet.subtemplets[subid];
				formHandler2.setdata('templet', _templet);
				$('#SubtempletForm').attr('action', 'templet!update.action');
				$('.hide-update').css('display', 'none');
				$('#SubtempletModal').modal();
			}
		});
	};
	
	var initTempletDesignModal = function () {
		$('#TempletModal').on('shown.bs.modal', function (e) {
			_design.show();
		})

		$('body').on('click', '.pix-templet', function(event) {
			var index = $(event.target).attr('data-id');
			var subid = $(event.target).attr('sub-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
				subid = $(event.target).parent().attr('sub-id');
			}
			_templet = $('#TempletTable').dataTable().fnGetData(index);
			var templetid = _templet.templetid;
			_design.Subobjects = _templet.subtemplets;
			if (subid != undefined) {
				templetid = _templet.subtemplets[subid].templetid;
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
						$('.stream-ctrl').css('display', StreamCtrl? '':'none');
						$('.dvb-ctrl').css('display', DvbCtrl? '':'none');
						$('.videoin-ctrl').css('display', VideoinCtrl? '':'none');
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
