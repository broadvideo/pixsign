var TemplateModule = function () {
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
				if (iDisplayIndex % 4 == 0) {
					templatehtml = '';
					templatehtml += '<div class="row" >';
				}
				templatehtml += '<div class="col-md-3 col-xs-3">';
				templatehtml += '<h3>' + aData.name + '</h3>';
				if (aData.ratio == 1) {
					templatehtml += '<h6><span class="label label-sm label-info">' + common.view.ratio_1 + '</span></h6>';
				} else if (aData.ratio == 2) {
					templatehtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_2 + '</span></h6>';
				} else if (aData.ratio == 3) {
					templatehtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_3 + '</span></h6>';
				} else if (aData.ratio == 4) {
					templatehtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_4 + '</span></h6>';
				} else if (aData.ratio == 5) {
					templatehtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_5 + '</span></h6>';
				} else if (aData.ratio == 6) {
					templatehtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_6 + '</span></h6>';
				}

				templatehtml += '<a href="javascript:;" templateid="' + aData.templateid + '" class="fancybox">';
				templatehtml += '<div class="thumbs">';
				if (aData.snapshot != null && aData.snapshot != '') {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					templatehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				templatehtml += '</div></a>';
				
				templatehtml += '<div privilegeid="101010">';
				templatehtml += '<a href="javascript:;" templateid="' + aData.templateid + '" class="btn default btn-xs green pix-template"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
				templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				templatehtml += '</div>';

				templatehtml += '</div>';
				if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#TemplateTable').dataTable().fnGetData().length) {
					templatehtml += '</div>';
					if ((iDisplayIndex+1) != $('#TemplateTable').dataTable().fnGetData().length) {
						templatehtml += '<hr/>';
					}
					$('#TemplateContainer').append(templatehtml);
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
				aoData.push({'name':'touchflag','value':'0' });
			},
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
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			var template = $('#TemplateTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + template.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'template!delete.action',
						cache: false,
						data : {
							'template.templateid': template.templateid
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

	var initTemplateEditModal = function () {
		var formHandler = new FormHandler($('#TemplateEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['template.name'] = {};
		formHandler.validateOption.rules['template.name']['required'] = true;
		formHandler.validateOption.submitHandler = function(form) {
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
		$('#TemplateEditForm').validate(formHandler.validateOption);
		$('[type=submit]', $('#TemplateEditModal')).on('click', function(event) {
			if ($('#TemplateEditForm').valid()) {
				$('#TemplateEditForm').submit();
			}
		});

		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#TemplateEditForm').attr('action', 'template!add.action');
			$('.hide-update').css('display', 'block');
			$('#TemplateEditModal').modal();
		});			

		$('#TemplateTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			formHandler.setdata('template', $('#TemplateTable').dataTable().fnGetData(index));
			$('#TemplateEditForm').attr('action', 'template!update.action');
			$('.hide-update').css('display', 'none');
			$('#TemplateEditModal').modal();
		});
	};
	
	var initTemplateDesignModal = function () {
		$('body').on('click', '.pix-template', function(event) {
			var templateid = $(event.target).attr('templateid');
			if (templateid == undefined) {
				templateid = $(event.target).parent().attr('templateid');
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
							_design.Object.pagezones[i].touchpageid = _design.Object.pagezones[i].touchtemplateid;
							_design.Object.pagezones[i].pagezonedtls = _design.Object.pagezones[i].templatezonedtls;
							for (var j=0; j<_design.Object.pagezones[i].pagezonedtls.length; j++) {
								_design.Object.pagezones[i].pagezonedtls[j].pagezonedtlid = _design.Object.pagezones[i].pagezonedtls[j].templatezonedtlid;
								_design.Object.pagezones[i].pagezonedtls[j].pagezoneid = _design.Object.pagezones[i].pagezonedtls[j].templatezoneid;
							}
						}
						_design.Objectid = _design.Object.pageid;
						_design.Zone = null;
						$('.school-ctrl').css('display', SchoolCtrl?'':'none');
						$('.diy-ctrl').css('display', DiyCtrl?'':'none');
						$('.meeting-ctrl').css('display', MeetingCtrl? '':'none');
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
			PagePreviewModule.preview($('#snapshot_div'), _design.Object, 1024);
			html2canvas($('#snapshot_div'), {
				onrendered: function(canvas) {
					//console.log(canvas.toDataURL());
					_design.Object.snapshotdtl = canvas.toDataURL();
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
						_design.Object.templatezones[i].touchtemplateid = _design.Object.templatezones[i].touchpageid;
						_design.Object.templatezones[i].touchpageid = undefined;
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
		});
	}
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
