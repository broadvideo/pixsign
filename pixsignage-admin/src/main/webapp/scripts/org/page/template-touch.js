var TemplateModule = function () {
	var _template;
	var _design;
	var _submitflag = false;
	//this.TemplateTree = new BranchTree($('#TemplatePortlet'));

	var init = function () {
		_design = new PageDesignModule('template');
		initTemplateTable();
		initTemplateEvent();
		initTemplateEditModal();
		initTemplateDesignModal();
	};

	var refresh = function () {
		$('#TemplateTable').dataTable()._fnAjaxUpdate();
	};
	
	var initTemplateTable = function () {
		$('#TemplateTable thead').css('display', 'none');
		$('#TemplateTable tbody').css('display', 'none');
		$('#TemplateTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 16, 36, 72, 108 ],
								[ 16, 36, 72, 108 ] 
								],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'template!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }],
			'iDisplayLength' : 16,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#TemplateContainer').length < 1) {
					$('#TemplateTable').append('<div id="TemplateContainer"></div>');
				}
				$('#TemplateContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				var templatehtml = '';
				templatehtml += '<div class="row" >';
				templatehtml += '<div class="col-md-12 col-xs-12">';
				templatehtml += '<h3 class="pixtitle">' + aData.name + '</h3>';
				if (aData.ratio == 1) {
					templatehtml += '<h6><span class="label label-sm label-info">' + common.view.ratio_1 + '</span></h6>';
				} else if (aData.ratio == 2) {
					templatehtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_2 + '</span></h6>';
				}
				templatehtml += '<div privilegeid="101010">';
				templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm yellow pix-subtemplate-add"><i class="fa fa-plus"></i> ' + common.view.subtemplate + '</a>';
				//templatehtml += '<a href="template!export.action?templateid=' + aData.templateid + '" data-id="' + iDisplayIndex + '" class="btn default btn-sm green pix-export"><i class="fa fa-download"></i> ' + common.view.export + '</a>';
				templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a> </div>';
				templatehtml += '</div>';
				templatehtml += '</div>';

				templatehtml += '<div class="row" >';
				templatehtml += '<div class="col-md-4 col-xs-6">';
				templatehtml += '<a href="javascript:;" templateid="' + aData.templateid + '" class="fancybox">';
				templatehtml += '<div class="thumbs">';
				if (aData.snapshot != null) {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					templatehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				templatehtml += '</div></a>';
				templatehtml += '<div privilegeid="101010">';
				templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-template"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
				templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				templatehtml += '</div>';
				templatehtml += '</div>';
				templatehtml += '<div class="col-md-8 col-xs-6">';
				for (var i=0; i<aData.subtemplates.length; i++) {
					if (i % 4 == 0) {
						templatehtml += '<div class="row" >';
					}
					templatehtml += '<div class="col-md-3 col-xs-3">';
					templatehtml += '<h5 class="pixtitle">' + aData.subtemplates[i].name + '</h5>';
					templatehtml += '<a href="javascript:;" templateid="' + aData.subtemplates[i].templateid + '" sub-id="' + i + '" class="fancybox">';
					templatehtml += '<div class="thumbs">';
					if (aData.subtemplates[i].snapshot != null) {
						var subthumbwidth = aData.subtemplates[i].width > aData.subtemplates[i].height? 100 : 100*aData.subtemplates[i].width/aData.subtemplates[i].height;
						templatehtml += '<img src="/pixsigdata' + aData.subtemplates[i].snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + subthumbwidth + '%" />';
					}
					templatehtml += '</div></a>';
					templatehtml += '<div privilegeid="101010">';
					templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs blue pix-template"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
					templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
					templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
					templatehtml += '</div>';
					templatehtml += '</div>';
					if ((i+1) % 4 == 0 || (i+1) == aData.subtemplates.length) {
						templatehtml += '</div>';
					}
					
				}
				templatehtml += '</div>';
				templatehtml += '</div>';

				templatehtml += '<hr/>';
				$('#TemplateContainer').append(templatehtml);
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('.thumbs').each(function(i) {
					$(this).width($(this).parent().closest('div').width());
					$(this).height($(this).parent().closest('div').width());
				});
				$('.fancybox').each(function(index,item) {
					$(this).click(function() {
						var templateid = $(this).attr('templateid');
						$.ajax({
							type : 'GET',
							url : 'template!get.action',
							data : {templateid: templateid},
							success : function(data, status) {
								if (data.errorcode == 0) {
									$.fancybox({
										openEffect	: 'none',
										closeEffect	: 'none',
										closeBtn : false,
								        padding : 0,
								        content: '<div id="TemplatePreview"></div>',
								        title: templateid,
								    });
									PagePreviewModule.preview($('#TemplatePreview'), data.template, 800);
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
			}
		});
		$('#TemplateTable_wrapper').addClass('form-inline');
		$('#TemplateTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#TemplateTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#TemplateTable_wrapper .dataTables_length select').select2();
		$('#TemplateTable').css('width', '100%').css('table-layout', 'fixed');
	};
	
	var initTemplateEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			var subid = $(event.target).attr('sub-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
				subid = $(event.target).parent().attr('sub-id');
			}
			_template = $('#TemplateTable').dataTable().fnGetData(index);
			var templateid = _template.templateid;
			var name = _template.name;
			_design.Subobjects = _template.subtemplates;
			if (subid != undefined) {
				templateid = _template.subtemplates[subid].templateid;
				name = _template.subtemplates[subid].name;
			}

			bootbox.confirm(common.tips.remove + name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'template!delete.action',
						cache: false,
						data : {
							'template.templateid': templateid
						},
						success : function(data, status) {
							if (data.errorcode == 0) {
								$('#TemplateTable').dataTable()._fnAjaxUpdate();
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

	var initTemplateEditModal = function () {
		var formHandler1 = new FormHandler($('#TemplateEditForm'));
		formHandler1.validateOption.rules = {};
		formHandler1.validateOption.rules['template.name'] = {};
		formHandler1.validateOption.rules['template.name']['required'] = true;
		formHandler1.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#TemplateEditForm').attr('action'),
				data : $('#TemplateEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#TemplateEditModal').modal('hide');
						bootbox.alert(common.tips.success);
						$('#TemplateTable').dataTable().fnDraw(true);
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		};
		$('#TemplateEditForm').validate(formHandler1.validateOption);
		$('[type=submit]', $('#TemplateEditModal')).on('click', function(event) {
			if ($('#TemplateEditForm').valid()) {
				$('#TemplateEditForm').submit();
			}
		});

		var formHandler2 = new FormHandler($('#SubtemplateForm'));
		formHandler2.validateOption.rules = {};
		formHandler2.validateOption.rules['template.name'] = {};
		formHandler2.validateOption.rules['template.name']['required'] = true;
		formHandler2.validateOption.rules['template.homeidletime'] = {};
		formHandler2.validateOption.rules['template.homeidletime']['required'] = true;
		formHandler2.validateOption.rules['template.homeidletime']['number'] = true;
		formHandler2.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#SubtemplateForm').attr('action'),
				data : $('#SubtemplateForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#SubtemplateModal').modal('hide');
						bootbox.alert(common.tips.success);
						$('#TemplateTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		};
		$('#SubtemplateForm').validate(formHandler2.validateOption);
		$('[type=submit]', $('#SubtemplateModal')).on('click', function(event) {
			if ($('#SubtemplateForm').valid()) {
				$('#SubtemplateForm').submit();
			}
		});

		function refreshFromTemplateTable() {
			var width = 100/(_design.Subobjects.length+1);
			var fromTemplateTableHtml = '';
			fromTemplateTableHtml += '<tr>';
			fromTemplateTableHtml += '<td style="padding: 0px 20px 0px 0px;" width="' + width + '%">';
			fromTemplateTableHtml += '<div class="thumbs" style="width:100px; height:100px;">';
			fromTemplateTableHtml += '</div></td>';
			for (var i=0; i<_design.Subobjects.length; i++) {
				var fromtemplate = _design.Subobjects[i];
				fromTemplateTableHtml += '<td style="padding: 0px 20px 0px 0px;" width="' + width + '%">';
				fromTemplateTableHtml += '<a href="javascript:;" fromtemplateid="' + fromtemplate.templateid + '" class="fancybox">';
				fromTemplateTableHtml += '<div class="thumbs" style="width:100px; height:100px;">';
				if (fromtemplate.snapshot != null) {
					var thumbwidth = fromtemplate.width > fromtemplate.height? 100 : 100*fromtemplate.width/fromtemplate.height;
					fromTemplateTableHtml += '<img src="/pixsigdata' + fromtemplate.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + fromtemplate.name + '" />';
				}
				fromTemplateTableHtml += '</div></a></td>';
			}
			fromTemplateTableHtml += '</tr>';
			fromTemplateTableHtml += '<tr>';
			fromTemplateTableHtml += '<td>';
			fromTemplateTableHtml += '<label class="radio-inline">';
			fromTemplateTableHtml += '<input type="radio" name="fromtemplateid" value="0" checked>';
			fromTemplateTableHtml += common.view.blank + '</label>';
			fromTemplateTableHtml += '</td>';
			for (var i=0; i<_design.Subobjects.length; i++) {
				var fromtemplate = _design.Subobjects[i];
				fromTemplateTableHtml += '<td>';
				fromTemplateTableHtml += '<label class="radio-inline">';
				fromTemplateTableHtml += '<input type="radio" name="fromtemplateid" value="' + fromtemplate.templateid + '">';
				fromTemplateTableHtml += fromtemplate.name + '</label>';
				fromTemplateTableHtml += '</td>';
			}
			fromTemplateTableHtml += '</tr>';
			$('#FromTemplateTable').html(fromTemplateTableHtml);
			$('#FromTemplateTable').width(120 * (_design.Subobjects.length+1));

			$('#FromTemplateTable .fancybox').each(function(index,item) {
				$(this).click(function() {
					var templateid = $(this).attr('fromtemplateid');
					$.ajax({
						type : 'GET',
						url : 'template!get.action',
						data : {templateid: templateid},
						success : function(data, status) {
							if (data.errorcode == 0) {
								$.fancybox({
									openEffect	: 'none',
									closeEffect	: 'none',
									closeBtn : false,
									padding : 0,
									content: '<div id="TemplatePreview"></div>',
							        title: templateid,
								});
								PagePreviewModule.preview($('#TemplatePreview'), data.template, 800);
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
			$('#TemplateEditForm').attr('action', 'template!add.action');
			$('.hide-update').css('display', 'block');
			$('#TemplateEditModal').modal();
		});			
		$('body').on('click', '.pix-subtemplate-add', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			var template = $('#TemplateTable').dataTable().fnGetData(index);
			_template = {};
			_template.name = '';
			_template.homeidletime = 0;
			_template.hometemplateid = template.templateid;
			_template.homeflag = 0;
			_template.ratio = template.ratio;
			_design.Subobjects = template.subtemplates;
			formHandler2.setdata('template', _template);
			$('#SubtemplateForm').attr('action', 'template!add.action');
			$('.hide-update').css('display', '');
			refreshFromTemplateTable();
			$('#SubtemplateModal').modal();
		});			
		$('#TemplateTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			var subid = $(event.target).attr('sub-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
				subid = $(event.target).parent().attr('sub-id');
			}
			_template = $('#TemplateTable').dataTable().fnGetData(index);
			if (subid == undefined) {
				formHandler1.setdata('template', _template);
				$('#TemplateEditForm').attr('action', 'template!update.action');
				$('.hide-update').css('display', 'none');
				$('#TemplateEditModal').modal();
			} else {
				_template = _template.subtemplates[subid];
				formHandler2.setdata('template', _template);
				$('#SubtemplateForm').attr('action', 'template!update.action');
				$('.hide-update').css('display', 'none');
				$('#SubtemplateModal').modal();
			}
		});
	};
	
	var initTemplateDesignModal = function () {
		$('body').on('click', '.pix-template', function(event) {
			var index = $(event.target).attr('data-id');
			var subid = $(event.target).attr('sub-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
				subid = $(event.target).parent().attr('sub-id');
			}
			_template = $('#TemplateTable').dataTable().fnGetData(index);
			var templateid = _template.templateid;
			_design.Subobjects = _template.subtemplates;
			if (subid != undefined) {
				templateid = _template.subtemplates[subid].templateid;
			}

			$.ajax({
				type : 'GET',
				url : 'template!get.action',
				data : {templateid: templateid},
				success : function(data, status) {
					if (data.errorcode == 0) {
						_design.Object = data.template;
						_design.Object.pageid = _design.Object.templateid;
						_design.Object.pagezones = _design.Object.templatezones;
						for (var i=0; i<_design.Object.pagezones.length; i++) {
							_design.Object.pagezones[i].pagezoneid = _design.Object.pagezones[i].templatezoneid;
							_design.Object.pagezones[i].pageid = _design.Object.pagezones[i].templateid;
							_design.Object.pagezones[i].pagezonedtls = _design.Object.pagezones[i].templatezonedtls;
							for (var j=0; j<_design.Object.pagezones[i].pagezonedtls.length; j++) {
								_design.Object.pagezones[i].pagezonedtls[j].pagezonedtlid = _design.Object.pagezones[i].pagezonedtls[j].templatezonedtlid;
								_design.Object.pagezones[i].pagezonedtls[j].pagezoneid = _design.Object.pagezones[i].pagezonedtls[j].templatezoneid;
							}
						}
						_design.Objectid = data.template.templateid;
						_design.Zone = null;
						$('.school-ctrl').css('display', 'none');
						$('.attendance-ctrl').css('display', 'none');
						if (SchoolCtrl) {
							$('.school-ctrl').css('display', '');
						}
						if (AttendanceCtrl) {
							$('.attendance-ctrl').css('display', '');
						}
						$('.diy-ctrl').css('display', DiyCtrl?'':'none');
						$('.estate-ctrl').css('display', EstateCtrl? '':'none');
						$('#PageModal').modal();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		});

		$('[type=submit]', $('#PageModal')).on('click', function(event) {
			if (_submitflag) {
				return;
			}
			_submitflag = true;
			Metronic.blockUI({
				zIndex: 20000,
				animate: true
			});
			$('#snapshot_div').show();
			PagePreviewModule.preview($('#snapshot_div'), _design.Object, 800);
			domtoimage.toJpeg($('#snapshot_div')[0], { bgcolor: '#FFFFFF', quality: 0.95 })
			.then(function (dataUrl) {
				_design.Object.snapshotdtl = dataUrl;
				$('#snapshot_div').hide();

				_design.Object.templateid = _design.Object.pageid;
				_design.Object.pageid = undefined;
				_design.Object.templatezones = _design.Object.pagezones;
				_design.Object.pagezones = undefined;
				for (var i=0; i<_design.Object.templatezones.length; i++) {
					_design.Object.templatezones[i].templatezoneid = _design.Object.templatezones[i].pagezoneid;
					_design.Object.templatezones[i].pagezoneid = undefined;
					_design.Object.templatezones[i].templateid = _design.Object.templatezones[i].pageid;
					_design.Object.templatezones[i].pageid = undefined;
					_design.Object.templatezones[i].templatezonedtls = _design.Object.templatezones[i].pagezonedtls;
					_design.Object.templatezones[i].pagezonedtls = undefined;
					for (var j=0; j<_design.Object.templatezones[i].templatezonedtls.length; j++) {
						_design.Object.templatezones[i].templatezonedtls[j].templatezonedtlid = _design.Object.templatezones[i].templatezonedtls[j].pagezonedtlid;
						_design.Object.templatezones[i].templatezonedtls[j].pagezonedtlid = undefined;
						_design.Object.templatezones[i].templatezonedtls[j].templatezoneid = _design.Object.templatezones[i].templatezonedtls[j].pagezoneid;
						_design.Object.templatezones[i].templatezonedtls[j].pagezoneid = undefined;
						_design.Object.templatezones[i].templatezonedtls[j].image = undefined;
						_design.Object.templatezones[i].templatezonedtls[j].video = undefined;
					}
				}			
				$.ajax({
					type : 'POST',
					url : 'template!design.action',
					data : '{"template":' + $.toJSON(_design.Object) + '}',
					dataType : 'json',
					contentType : 'application/json;charset=utf-8',
					success : function(data, status) {
						_submitflag = false;
						Metronic.unblockUI();
						$('#PageModal').modal('hide');
						if (data.errorcode == 0) {
							bootbox.alert(common.tips.success);
							$('#TemplateTable').dataTable()._fnAjaxUpdate();
						} else {
							bootbox.alert(common.tips.error + data.errormsg);
						}
					},
					error : function() {
						_submitflag = false;
						Metronic.unblockUI();
						$('#PageModal').modal('hide');
						console.log('failue');
					}
				});
			})
			.catch(function (error) {
				_submitflag = false;
				$('#snapshot_div').hide();
				Metronic.unblockUI();
				$('#PageModal').modal('hide');
				bootbox.alert(common.tips.error + error);
				console.error('oops, something went wrong!', error);
		    });
			/*
			html2canvas($('#snapshot_div'), {
				onrendered: function(canvas) {
					//console.log(canvas.toDataURL('image/jpeg'));
					_design.Object.snapshotdtl = canvas.toDataURL('image/jpeg');
					$('#snapshot_div').hide();

					_design.Object.templateid = _design.Object.pageid;
					_design.Object.pageid = undefined;
					_design.Object.templatezones = _design.Object.pagezones;
					_design.Object.pagezones = undefined;
					for (var i=0; i<_design.Object.templatezones.length; i++) {
						_design.Object.templatezones[i].templatezoneid = _design.Object.templatezones[i].pagezoneid;
						_design.Object.templatezones[i].pagezoneid = undefined;
						_design.Object.templatezones[i].templateid = _design.Object.templatezones[i].pageid;
						_design.Object.templatezones[i].pageid = undefined;
						_design.Object.templatezones[i].templatezonedtls = _design.Object.templatezones[i].pagezonedtls;
						_design.Object.templatezones[i].pagezonedtls = undefined;
						for (var j=0; j<_design.Object.templatezones[i].templatezonedtls.length; j++) {
							_design.Object.templatezones[i].templatezonedtls[j].templatezonedtlid = _design.Object.templatezones[i].templatezonedtls[j].pagezonedtlid;
							_design.Object.templatezones[i].templatezonedtls[j].pagezonedtlid = undefined;
							_design.Object.templatezones[i].templatezonedtls[j].templatezoneid = _design.Object.templatezones[i].templatezonedtls[j].pagezoneid;
							_design.Object.templatezones[i].templatezonedtls[j].pagezoneid = undefined;
							_design.Object.templatezones[i].templatezonedtls[j].image = undefined;
							_design.Object.templatezones[i].templatezonedtls[j].video = undefined;
						}
					}			
					$.ajax({
						type : 'POST',
						url : 'template!design.action',
						data : '{"template":' + $.toJSON(_design.Object) + '}',
						dataType : 'json',
						contentType : 'application/json;charset=utf-8',
						success : function(data, status) {
							_submitflag = false;
							Metronic.unblockUI();
							$('#PageModal').modal('hide');
							if (data.errorcode == 0) {
								bootbox.alert(common.tips.success);
								$('#TemplateTable').dataTable()._fnAjaxUpdate();
							} else {
								bootbox.alert(common.tips.error + data.errormsg);
							}
						},
						error : function() {
							_submitflag = false;
							Metronic.unblockUI();
							$('#PageModal').modal('hide');
							console.log('failue');
						}
					});
				}
			});
			*/
		});
	}
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
