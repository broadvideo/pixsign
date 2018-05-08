var PageModule = function () {
	var _page;
	var _design;
	var _submitflag = false;
	this.PageTree = new BranchTree($('#PagePortlet'));

	var init = function () {
		_design = new PageDesignModule('page');
		initPageTable();
		initPageEvent();
		initPageEditModal();
		initPageDesignModal();
		initStaffPageModal();
		initCopyModal();
	};

	var refresh = function () {
		$('#PageTable').dataTable()._fnAjaxUpdate();
	};
	
	var initPageTable = function () {
		$('#PageTable thead').css('display', 'none');
		$('#PageTable tbody').css('display', 'none');
		$('#PageTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 16, 36, 72, 108 ],
								[ 16, 36, 72, 108 ] 
								],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'page!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }],
			'iDisplayLength' : 16,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#PageContainer').length < 1) {
					$('#PageTable').append('<div id="PageContainer"></div>');
				}
				$('#PageContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				var pagehtml = '';
				pagehtml += '<div class="row" >';
				pagehtml += '<div class="col-md-12 col-xs-12">';
				pagehtml += '<h3 class="pixtitle">' + aData.name + '</h3>';
				if (aData.reviewflag == 0) {
					pagehtml += '<h6><span class="label label-sm label-default">' + common.view.review_wait + '</span></h6>';
				} else if (aData.reviewflag == 1) {
					pagehtml += '<h6><span class="label label-sm label-success">' + common.view.review_passed + '</span></h6>';
				} else if (aData.reviewflag == 2) {
					pagehtml += '<h6><span class="label label-sm label-danger">' + common.view.review_rejected + '</span></h6>';
				}
				pagehtml += '<div class="util-btn-margin-bottom-5">';
				if (aData.editflag == 1) {
					pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm yellow pix-subpage-add"><i class="fa fa-plus"></i> ' + common.view.subpage + '</a>';
					pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				}
				if (aData.reviewflag == 1) {
					pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
					pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm yellow pix-savetemplate"><i class="fa fa-save"></i> ' + common.view.save_template + '</a>';
				}
				pagehtml += '</div>';
				pagehtml += '</div>';
				pagehtml += '</div>';

				pagehtml += '<div class="row" >';
				pagehtml += '<div class="col-md-4 col-xs-6">';
				pagehtml += '<a href="javascript:;" pageid="' + aData.pageid + '" class="fancybox">';
				pagehtml += '<div class="thumbs">';
				if (aData.snapshot != null && aData.snapshot != '') {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					pagehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				pagehtml += '</div></a>';
				if (aData.editflag == 1) {
					pagehtml += '<div class="util-btn-margin-bottom-5">';
					pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-page"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
					pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-copy"><i class="fa fa-copy"></i> ' + common.view.copy + '</a>';
					if (aData.privilegeflag == 1) {
						pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs purple pix-staffpage"><i class="fa fa-key"></i> ' + common.view.privilege + '</a>';
					}
					pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
					pagehtml += '</div>';
				}
				pagehtml += '</div>';
				pagehtml += '<div class="col-md-8 col-xs-6">';
				for (var i=0; i<aData.subpages.length; i++) {
					if (i % 4 == 0) {
						pagehtml += '<div class="row" >';
					}
					pagehtml += '<div class="col-md-3 col-xs-3">';
					pagehtml += '<h5 class="pixtitle">' + aData.subpages[i].name + '</h5>';
					pagehtml += '<a href="javascript:;" pageid="' + aData.subpages[i].pageid + '" sub-id="' + i + '" class="fancybox">';
					pagehtml += '<div class="thumbs">';
					if (aData.subpages[i].snapshot != null && aData.subpages[i].snapshot != '') {
						var subthumbwidth = aData.subpages[i].width > aData.subpages[i].height? 100 : 100*aData.subpages[i].width/aData.subpages[i].height;
						pagehtml += '<img src="/pixsigdata' + aData.subpages[i].snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + subthumbwidth + '%" />';
					}
					pagehtml += '</div></a>';
					if (aData.subpages[i].editflag == 1) {
						pagehtml += '<div class="util-btn-margin-bottom-5">';
						pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs blue pix-page"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
						if (aData.subpages[i].privilegeflag == 1) {
							pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs purple pix-staffpage"><i class="fa fa-key"></i> ' + common.view.privilege + '</a>';
						}
						pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs green pix-copy"><i class="fa fa-copy"></i> ' + common.view.copy + '</a>';
						pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
						pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
						pagehtml += '</div>';
					}
					pagehtml += '</div>';
					if ((i+1) % 4 == 0 || (i+1) == aData.subpages.length) {
						pagehtml += '</div>';
					}
					
				}
				pagehtml += '</div>';
				pagehtml += '</div>';

				pagehtml += '<hr/>';
				$('#PageContainer').append(pagehtml);
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('.thumbs').each(function(i) {
					$(this).width($(this).parent().closest('div').width());
					$(this).height($(this).parent().closest('div').width());
				});
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
								        title: pageid,
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
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':PageTree.branchid });
				aoData.push({'name':'touchflag','value':'1' });
				aoData.push({'name':'homeflag','value':'1' });
			}
		});
		$('#PageTable_wrapper').addClass('form-inline');
		$('#PageTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#PageTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#PageTable_wrapper .dataTables_length select').select2();
		$('#PageTable').css('width', '100%').css('table-layout', 'fixed');
	};
	
	var initPageEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			var subid = $(event.target).attr('sub-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
				subid = $(event.target).parent().attr('sub-id');
			}
			_page = $('#PageTable').dataTable().fnGetData(index);
			var pageid = _page.pageid;
			var name = _page.name;
			_design.Subobjects = _page.subpages;
			if (subid != undefined) {
				pageid = _page.subpages[subid].pageid;
				name = _page.subpages[subid].name;
			}

			bootbox.confirm(common.tips.remove + name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'page!delete.action',
						cache: false,
						data : {
							'page.pageid': pageid
						},
						success : function(data, status) {
							if (data.errorcode == 0) {
								$('#PageTable').dataTable()._fnAjaxUpdate();
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
			var target = $(event.target);
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				target = $(event.target).parent();
				index = $(event.target).parent().attr('data-id');
			}
			var page = $('#PageTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.synclayout, function(result) {
				if (result == true) {
					$.ajax({
						type : 'GET',
						url : 'page!sync.action',
						cache: false,
						data : {
							pageid: page.pageid,
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

		$('body').on('click', '.pix-savetemplate', function(event) {
			var target = $(event.target);
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				target = $(event.target).parent();
				index = $(event.target).parent().attr('data-id');
			}
			var page = $('#PageTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.savetemplate, function(result) {
				if (result == true) {
					$.ajax({
						type : 'GET',
						url : 'template!savefrompage.action',
						cache: false,
						data : {
							pageid: page.pageid,
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

	var initPageEditModal = function () {
		var formHandler1 = new FormHandler($('#PageEditForm'));
		formHandler1.validateOption.rules = {};
		formHandler1.validateOption.rules['page.name'] = {};
		formHandler1.validateOption.rules['page.name']['required'] = true;
		formHandler1.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#PageEditForm').attr('action'),
				data : $('#PageEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#PageEditModal').modal('hide');
						bootbox.alert(common.tips.success);
						$('#PageTable').dataTable().fnDraw(true);
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		};
		$('#PageEditForm').validate(formHandler1.validateOption);
		$('[type=submit]', $('#PageEditModal')).on('click', function(event) {
			if ($('#PageEditForm').valid()) {
				$('#PageEditForm').submit();
			}
		});

		var formHandler2 = new FormHandler($('#SubpageForm'));
		formHandler2.validateOption.rules = {};
		formHandler2.validateOption.rules['page.name'] = {};
		formHandler2.validateOption.rules['page.name']['required'] = true;
		formHandler2.validateOption.rules['page.homeidletime'] = {};
		formHandler2.validateOption.rules['page.homeidletime']['required'] = true;
		formHandler2.validateOption.rules['page.homeidletime']['number'] = true;
		formHandler2.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#SubpageForm').attr('action'),
				data : $('#SubpageForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#SubpageModal').modal('hide');
						bootbox.alert(common.tips.success);
						$('#PageTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		};
		$('#SubpageForm').validate(formHandler2.validateOption);
		$('[type=submit]', $('#SubpageModal')).on('click', function(event) {
			if ($('#SubpageForm').valid()) {
				$('#SubpageForm').submit();
			}
		});

		$('#TemplateTable thead').css('display', 'none');
		$('#TemplateTable tbody').css('display', 'none');
		$('#TemplateTable').dataTable({
			'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 18, 30, 48, 96 ],
							  [ 18, 30, 48, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'template!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'templateid', 'bSortable' : false }],
			'iDisplayLength' : 12,
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
				templatehtml += '<div class="col-md-4 col-xs-6">';
				templatehtml += '<a href="javascript:;" templateid="' + aData.templateid + '" class="fancybox">';
				templatehtml += '<div class="thumbs">';
				if (aData.snapshot != null) {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					templatehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				templatehtml += '</div></a>';
				templatehtml += '<label class="radio-inline">';
				if (iDisplayIndex == 0) {
					templatehtml += '<input type="radio" name="page.templateid" value="' + aData.templateid + '" checked>';
				} else {
					templatehtml += '<input type="radio" name="page.templateid" value="' + aData.templateid + '">';
				}
				templatehtml += aData.name + '</label>';
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
				$('#TemplateContainer .thumbs').each(function(i) {
					$(this).width($(this).parent().closest('div').width());
					$(this).height($(this).parent().closest('div').width());
				});
				$('#TemplateContainer .fancybox').each(function(index,item) {
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
				var templateflag = $('#PageEditForm input[name="templateflag"]:checked').val();
				var ratio = $('select[name="page.ratio"]').val();
				aoData.push({'name':'templateflag','value':templateflag });
				aoData.push({'name':'touchflag','value':'1' });
				aoData.push({'name':'homeflag','value':'1' });
				aoData.push({'name':'ratio','value':ratio });
			}
		});
		function refreshTemplate() {
			$('#PageEditForm input[name="page.templateid"]').val('0');
			var templateflag = $('#PageEditForm input[name="templateflag"]:checked').val();
			if (templateflag != 0 && $('#PageEditForm').attr('action') == 'page!add.action') {
				$('.template-ctrl').css('display', '');
				$('#TemplateTable').dataTable().fnDraw(true);
			} else {
				$('.template-ctrl').css('display', 'none');
			}
		}
		$('#PageEditModal').on('shown.bs.modal', function (e) {
			refreshTemplate();
		})
		$('#PageEditForm input[name="templateflag"]').change(function(e) {
			refreshTemplate();
		});
		$('#PageEditForm select[name="page.ratio"]').on('change', function(e) {
			refreshTemplate();
		});	

		function refreshFromPageTable() {
			var width = 100/(_design.Subobjects.length+1);
			var fromPageTableHtml = '';
			fromPageTableHtml += '<tr>';
			fromPageTableHtml += '<td style="padding: 0px 20px 0px 0px;" width="' + width + '%">';
			fromPageTableHtml += '<div class="thumbs" style="width:100px; height:100px;">';
			fromPageTableHtml += '</div></td>';
			for (var i=0; i<_design.Subobjects.length; i++) {
				var frompage = _design.Subobjects[i];
				fromPageTableHtml += '<td style="padding: 0px 20px 0px 0px;" width="' + width + '%">';
				fromPageTableHtml += '<a href="javascript:;" frompageid="' + frompage.pageid + '" class="fancybox">';
				fromPageTableHtml += '<div class="thumbs" style="width:100px; height:100px;">';
				if (frompage.snapshot != null) {
					var thumbwidth = frompage.width > frompage.height? 100 : 100*frompage.width/frompage.height;
					fromPageTableHtml += '<img src="/pixsigdata' + frompage.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + frompage.name + '" />';
				}
				fromPageTableHtml += '</div></a></td>';
			}
			fromPageTableHtml += '</tr>';
			fromPageTableHtml += '<tr>';
			fromPageTableHtml += '<td>';
			fromPageTableHtml += '<label class="radio-inline">';
			fromPageTableHtml += '<input type="radio" name="frompageid" value="0" checked>';
			fromPageTableHtml += common.view.blank + '</label>';
			fromPageTableHtml += '</td>';
			for (var i=0; i<_design.Subobjects.length; i++) {
				var frompage = _design.Subobjects[i];
				fromPageTableHtml += '<td>';
				fromPageTableHtml += '<label class="radio-inline">';
				fromPageTableHtml += '<input type="radio" name="frompageid" value="' + frompage.pageid + '">';
				fromPageTableHtml += frompage.name + '</label>';
				fromPageTableHtml += '</td>';
			}
			fromPageTableHtml += '</tr>';
			$('#FromPageTable').html(fromPageTableHtml);
			$('#FromPageTable').width(120 * (_design.Subobjects.length+1));

			$('#FromPageTable .fancybox').each(function(index,item) {
				$(this).click(function() {
					var pageid = $(this).attr('frompageid');
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
							        title: pageid,
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

		$('body').on('click', '.pix-add', function(event) {
			formHandler1.reset();
			$('#PageEditForm input[name="page.branchid"').val(PageTree.branchid);
			$('#PageEditForm').attr('action', 'page!add.action');
			$('.hide-update').css('display', 'block');
			$('#PageEditModal').modal();
		});			
		$('body').on('click', '.pix-subpage-add', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			var page = $('#PageTable').dataTable().fnGetData(index);
			_page = {};
			_page.branchid = PageTree.branchid;
			_page.name = '';
			_page.homeidletime = 0;
			_page.homepageid = page.pageid;
			_page.homeflag = 0;
			_page.ratio = page.ratio;
			_design.Subobjects = page.subpages;
			formHandler2.setdata('page', _page);
			$('#SubpageForm').attr('action', 'page!add.action');
			$('.hide-update').css('display', '');
			refreshFromPageTable();
			$('#SubpageModal').modal();
		});			
		$('#PageTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			var subid = $(event.target).attr('sub-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
				subid = $(event.target).parent().attr('sub-id');
			}
			_page = $('#PageTable').dataTable().fnGetData(index);
			if (subid == undefined) {
				formHandler1.setdata('page', _page);
				$('#PageEditForm').attr('action', 'page!update.action');
				$('.hide-update').css('display', 'none');
				$('#PageEditModal').modal();
			} else {
				_page = _page.subpages[subid];
				formHandler2.setdata('page', _page);
				$('#SubpageForm').attr('action', 'page!update.action');
				$('.hide-update').css('display', 'none');
				$('#SubpageModal').modal();
			}
		});
	};
	
	var initPageDesignModal = function () {
		$('body').on('click', '.pix-page', function(event) {
			var index = $(event.target).attr('data-id');
			var subid = $(event.target).attr('sub-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
				subid = $(event.target).parent().attr('sub-id');
			}
			_page = $('#PageTable').dataTable().fnGetData(index);
			var pageid = _page.pageid;
			_design.Subobjects = _page.subpages;
			if (subid != undefined) {
				pageid = _page.subpages[subid].pageid;
			}

			$.ajax({
				type : 'GET',
				url : 'page!get.action',
				data : {pageid: pageid},
				success : function(data, status) {
					if (data.errorcode == 0) {
						_design.Object = data.page;
						_design.Objectid = data.page.pageid;
						_design.Zone = null;
						if (_design.Object.limitflag == 0) {
							$('.limit-1').css('display', '');
						}
						$('.school-ctrl').css('display', 'none');
						$('.attendance-ctrl').css('display', 'none');
						if (SchoolCtrl) {
							$('.school-ctrl').css('display', '');
						}
						if (AttendanceCtrl) {
							$('.attendance-ctrl').css('display', '');
						}
						$('.diy-ctrl').css('display', DiyCtrl? '':'none');
						$('.meeting-ctrl').css('display', MeetingCtrl? '':'none');
						$('.estate-ctrl').css('display', EstateCtrl? '':'none');
						if (_design.Object.limitflag == 1) {
							$('.limit-1').css('display', 'none');
						}
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

					for (var i=0; i<_design.Object.pagezones.length; i++) {
						for (var j=0; j<_design.Object.pagezones[i].pagezonedtls.length; j++) {
							_design.Object.pagezones[i].pagezonedtls[j].image = undefined;
							_design.Object.pagezones[i].pagezonedtls[j].video = undefined;
						}
					}			
					$.ajax({
						type : 'POST',
						url : 'page!design.action',
						data : '{"page":' + $.toJSON(_design.Object) + '}',
						dataType : 'json',
						contentType : 'application/json;charset=utf-8',
						success : function(data, status) {
							_submitflag = false;
							Metronic.unblockUI();
							$('#PageModal').modal('hide');
							if (data.errorcode == 0) {
								bootbox.alert(common.tips.success);
								$('#PageTable').dataTable()._fnAjaxUpdate();
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
	
	var initStaffPageModal = function () {
		var pageid = 0;
		var selectedStaffs1 = [];
		var selectedStaffs2 = [];
		
		$('body').on('click', '.pix-staffpage', function(event) {
			var index = $(event.target).attr('data-id');
			var subid = $(event.target).attr('sub-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
				subid = $(event.target).parent().attr('sub-id');
			}
			_page = $('#PageTable').dataTable().fnGetData(index);
			pageid = _page.pageid;
			if (subid != undefined) {
				pageid = _page.subpages[subid].pageid;
			}
			selectedStaffs1 = [];
			selectedStaffs2 = [];
			$('#StaffTable1').dataTable().fnDraw(true);
			$('#StaffTable2').dataTable().fnDraw(true);
			$('#StaffPageModal').modal();
		});
		
		//待选择table初始化
		$('#StaffTable1').dataTable({
			'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'page!liststaff2select.action',
			'aoColumns' : [ {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'staffid', 'bSortable' : false, 'sWidth' : '10%' }, 
			                {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '30%' }, 
							{'sTitle' : common.view.loginname, 'mData' : 'loginname', 'bSortable' : false, 'sWidth' : '30%' }, 
							{'sTitle' : common.view.branch, 'mData' : 'branch.name', 'bSortable' : false, 'sWidth' : '30%' }],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
				if ( $.inArray(aData.staffid, selectedStaffs1) >= 0 ) {
					$(nRow).addClass('active');
					$('td:eq(0)', nRow).html('<input type="checkbox" id="StaffCheckA' + aData.staffid + '" checked />');
				} else {
					$('td:eq(0)', nRow).html('<input type="checkbox" id="StaffCheckA' + aData.staffid + '" />');
				}
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'pageid','value':pageid });
			} 
		});

		//已加入table初始化
		$('#StaffTable2').dataTable({
			'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'page!liststaff.action',
			'aoColumns' : [ {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'staffid', 'bSortable' : false, 'sWidth' : '10%' }, 
			                {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '30%' }, 
							{'sTitle' : common.view.loginname, 'mData' : 'loginname', 'bSortable' : false, 'sWidth' : '30%' }, 
							{'sTitle' : common.view.branch, 'mData' : 'branch.name', 'bSortable' : false, 'sWidth' : '30%' }],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				if ( $.inArray(aData.staffid, selectedStaffs2) >= 0 ) {
					$(nRow).addClass('active');
					$('td:eq(0)', nRow).html('<input type="checkbox" id="StaffCheckB' + aData.staffid + '" checked />');
				} else {
					$('td:eq(0)', nRow).html('<input type="checkbox" id="StaffCheckB' + aData.staffid + '" />');
				}
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'pageid','value':pageid });
			} 
		});

		$('#StaffTable1').on('click', 'tr', function () {
			var row = $('#StaffTable1').dataTable().fnGetData(this);
			if (row == null) return;
			var staffid = row.staffid;
			var index = $.inArray(staffid, selectedStaffs1);
			if (index >= 0) {
				selectedStaffs1.splice(index, 1);
				$('#StaffCheckA'+staffid).prop('checked', false);
			} else {
				selectedStaffs1.push(staffid);
				$('#StaffCheckA'+staffid).prop('checked', true);
			}
			$(this).toggleClass('active');
		});
		$('#CheckAll', $('#StaffTable1')).on('click', function() {
			var rows = $("#StaffTable1").dataTable().fnGetNodes();
			for (var i=0; i<rows.length; i++) {
				var staffid = $('#StaffTable1').dataTable().fnGetData(rows[i]).staffid;
				if (this.checked) {
					$(rows[i]).addClass('active');
				} else {
					$(rows[i]).removeClass('active');
				}
				$('#StaffCheckA'+staffid).prop('checked', this.checked);
				var index = $.inArray(staffid, selectedStaffs1);
				if (index == -1 && this.checked) {
					selectedStaffs1.push(staffid);
				} else if (index >= 0 && !this.checked) {
					selectedStaffs1.splice(index, 1);
				}
		    }
		} );

		$('#StaffTable2').on('click', 'tr', function () {
			var row = $('#StaffTable2').dataTable().fnGetData(this);
			if (row == null) return;
			var staffid = row.staffid;
			var index = $.inArray(staffid, selectedStaffs2);
			if (index >= 0) {
				selectedStaffs2.splice(index, 1);
				$('#StaffCheckB'+staffid).prop('checked', false);
			} else {
				selectedStaffs2.push(staffid);
				$('#StaffCheckB'+staffid).prop('checked', true);
			}
			$(this).toggleClass('active');
		});
		$('#CheckAll', $('#StaffTable2')).on('click', function() {
			var rows = $("#StaffTable2").dataTable().fnGetNodes();
			for (var i=0; i<rows.length; i++) {
				var staffid = $('#StaffTable2').dataTable().fnGetData(rows[i]).staffid;
				if (this.checked) {
					$(rows[i]).addClass('active');
				} else {
					$(rows[i]).removeClass('active');
				}
				$('#StaffCheckB'+staffid).prop('checked', this.checked);
				var index = $.inArray(staffid, selectedStaffs2);
				if (index == -1 && this.checked) {
					selectedStaffs2.push(staffid);
				} else if (index >= 0 && !this.checked) {
					selectedStaffs2.splice(index, 1);
				}
		    }
		} );

		$('body').on('click', '.pix-addstaff', function(event) {
			$.ajax({
				type : 'POST',
				url : 'page!addstaffs.action',
				data : '{"page":{"pageid":' + pageid + '}, "staffids":' + $.toJSON(selectedStaffs1) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					if (data.errorcode == 0) {
						selectedStaffs1 = [];
						selectedStaffs2 = [];
						$('#StaffTable1').dataTable()._fnAjaxUpdate();
						$('#StaffTable2').dataTable()._fnAjaxUpdate();
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

		$('body').on('click', '.pix-deletestaff', function(event) {
			$.ajax({
				type : 'POST',
				url : 'page!deletestaffs.action',
				data : '{"page":{"pageid":' + pageid + '}, "staffids":' + $.toJSON(selectedStaffs2) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					if (data.errorcode == 0) {
						selectedStaffs1 = [];
						selectedStaffs2 = [];
						$('#StaffTable1').dataTable()._fnAjaxUpdate();
						$('#StaffTable2').dataTable()._fnAjaxUpdate();
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
	
	var initCopyModal = function () {
		var pageid = 0;
		var selectedPages = [];
		
		$('body').on('click', '.pix-copy', function(event) {
			var index = $(event.target).attr('data-id');
			var subid = $(event.target).attr('sub-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
				subid = $(event.target).parent().attr('sub-id');
			}
			_page = $('#PageTable').dataTable().fnGetData(index);
			if (subid != undefined) {
				_page = _page.subpages[subid];
			}
			selectedPages = [];
			$('#PageSelectedTable').dataTable().fnClearTable();
			$('#CopyModal').modal();
		});
		
		var PageLibTree = new BranchTree($('#PageLibTab'));
		$('#PageLibTable thead').css('display', 'none');
		$('#PageLibTable tbody').css('display', 'none');
		$('#PageLibTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 18, 30, 48, 96 ],
							  [ 18, 30, 48, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'page!list.action',
			'aoColumns' : [{'sTitle' : '', 'mData' : 'name', 'bSortable' : false }],
			'iDisplayLength' : 18,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#PageLibContainer').length < 1) {
					$('#PageLibTable').append('<div id="PageLibContainer"></div>');
				}
				$('#PageLibContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					pagelibhtml = '';
					pagelibhtml += '<div class="row" >';
				}
				pagelibhtml += '<div class="col-md-2 col-xs-2">';
				
				pagelibhtml += '<div id="ThumbContainer" style="position:relative">';
				var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
				pagelibhtml += '<div id="PageLibThumb" class="thumbs">';
				if (aData.snapshot != null && aData.snapshot != '') {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					pagelibhtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				pagelibhtml += '<div class="mask">';
				pagelibhtml += '<div>';
				pagelibhtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
				pagelibhtml += '<a class="btn default btn-sm green pix-copypage-add" href="javascript:;" touch="0" data-id="' + iDisplayIndex + '" ><i class="fa fa-plus"></i></a>';
				pagelibhtml += '</div>';
				pagelibhtml += '</div>';
				pagelibhtml += '</div>';

				pagelibhtml += '</div>';

				pagelibhtml += '</div>';
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#PageLibTable').dataTable().fnGetData().length) {
					pagelibhtml += '</div>';
					if ((iDisplayIndex+1) != $('#PageLibTable').dataTable().fnGetData().length) {
						pagelibhtml += '<hr/>';
					}
					$('#PageLibContainer').append(pagelibhtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#PageLibContainer .thumbs').each(function(i) {
					$(this).height($(this).parent().width());
					$(this).width($(this).parent().width());
				});
				$('#PageLibContainer .mask').each(function(i) {
					$(this).height($(this).parent().parent().width() + 2);
				});
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':PageLibTree.branchid });
				aoData.push({'name':'touchflag','value':'0' });
				if (_page != undefined) {
					aoData.push({'name':'ratio','value':_page.ratio });
				}
			},
		});
		$('#PageLibTable_wrapper').addClass('form-inline');
		$('#PageLibTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#PageLibTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#PageLibTable_wrapper .dataTables_length select').select2();
		$('#PageLibTable').css('width', '100%').css('table-layout', 'fixed');

		var TouchpageLibTree = new BranchTree($('#TouchpageLibTab'));
		$('#TouchpageLibTable thead').css('display', 'none');
		$('#TouchpageLibTable tbody').css('display', 'none');
		$('#TouchpageLibTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 20, 30, 50 ],
							  [ 10, 20, 30, 50 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'page!list.action',
			'aoColumns' : [{'sTitle' : '', 'mData' : 'name', 'bSortable' : false }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#TouchpageLibContainer').length < 1) {
					$('#TouchpageLibTable').append('<div id="TouchpageLibContainer"></div>');
				}
				$('#TouchpageLibContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				var touchpagelibhtml = '';
				touchpagelibhtml += '<div class="row" >';
				touchpagelibhtml += '<div class="col-md-12 col-xs-12">';
				touchpagelibhtml += '<h3 class="pixtitle">' + aData.name + '</h3>';
				touchpagelibhtml += '</div>';
				touchpagelibhtml += '</div>';

				touchpagelibhtml += '<div class="row" >';
				touchpagelibhtml += '<div class="col-md-4 col-xs-6">';

				touchpagelibhtml += '<div id="ThumbContainer" style="position:relative">';
				var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
				touchpagelibhtml += '<div id="PageLibThumb" class="thumbs">';
				if (aData.snapshot != null && aData.snapshot != '') {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					touchpagelibhtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				touchpagelibhtml += '<div class="mask">';
				touchpagelibhtml += '<div>';
				touchpagelibhtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
				touchpagelibhtml += '<a class="btn default btn-sm green pix-copypage-add" href="javascript:;" touch="1" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
				touchpagelibhtml += '</div>';
				touchpagelibhtml += '</div>';
				touchpagelibhtml += '</div>';
				touchpagelibhtml += '</div>';
				
				touchpagelibhtml += '</div>';
				touchpagelibhtml += '<div class="col-md-8 col-xs-6">';
				for (var i=0; i<aData.subpages.length; i++) {
					if (i % 4 == 0) {
						touchpagelibhtml += '<div class="row" >';
					}
					touchpagelibhtml += '<div class="col-md-3 col-xs-3">';

					touchpagelibhtml += '<div id="ThumbContainer" style="position:relative">';
					var thumbwidth = aData.subpages[i].width > aData.subpages[i].height? 100 : 100*aData.subpages[i].width/aData.subpages[i].height;
					touchpagelibhtml += '<div id="PageLibThumb" class="thumbs">';
					if (aData.subpages[i].snapshot != null && aData.subpages[i].snapshot != '') {
						var thumbwidth = aData.subpages[i].width > aData.subpages[i].height? 100 : 100*aData.subpages[i].width/aData.subpages[i].height;
						touchpagelibhtml += '<img src="/pixsigdata' + aData.subpages[i].snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" />';
					}
					touchpagelibhtml += '<div class="mask">';
					touchpagelibhtml += '<div>';
					touchpagelibhtml += '<h6 class="pixtitle" style="color:white;">' + aData.subpages[i].name + '</h6>';
					touchpagelibhtml += '<a class="btn default btn-sm green pix-copypage-add" href="javascript:;" touch="1" data-id="' + iDisplayIndex + '" sub-id="' + i + '"><i class="fa fa-plus"></i></a>';
					touchpagelibhtml += '</div>';
					touchpagelibhtml += '</div>';
					touchpagelibhtml += '</div>';
					touchpagelibhtml += '</div>';
					
					touchpagelibhtml += '</div>';
					if ((i+1) % 4 == 0 || (i+1) == aData.subpages.length) {
						touchpagelibhtml += '</div>';
					}
					
				}
				touchpagelibhtml += '</div>';
				touchpagelibhtml += '</div>';

				touchpagelibhtml += '<hr/>';
				$('#TouchpageLibContainer').append(touchpagelibhtml);
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#TouchpageLibContainer .thumbs').each(function(i) {
					$(this).height($(this).parent().width());
					$(this).width($(this).parent().width());
				});
				$('#TouchpageLibContainer .mask').each(function(i) {
					$(this).height($(this).parent().parent().width() + 2);
				});
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':TouchpageLibTree.branchid });
				aoData.push({'name':'touchflag','value':'1' });
				aoData.push({'name':'homeflag','value':'1' });
				if (_page != undefined) {
					aoData.push({'name':'ratio','value':_page.ratio });
				}
			},
		});
		$('#TouchpageLibTable_wrapper').addClass('form-inline');
		$('#TouchpageLibTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#TouchpageLibTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#TouchpageLibTable_wrapper .dataTables_length select').select2();
		$('#TouchpageLibTable').css('width', '100%').css('table-layout', 'fixed');

		$('#PageSelectedTable').dataTable({
			'sDom' : 't',
			'iDisplayLength' : -1,
			'aoColumns' : [ {'sTitle' : '', 'bSortable' : false, 'sWidth' : '60px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sClass': 'autowrap' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' }],
			'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
			'oLanguage' : { 'sZeroRecords' : common.view.empty,
							'sEmptyTable' : common.view.empty }, 
			'ordering' : false,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(2)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn red btn-xs pix-copypage-delete"><i class="fa fa-trash-o"></i></button>');
				return nRow;
			}
		});

		$('#CopyModal').on('shown.bs.modal', function (e) {
			$('#PageLibTable').dataTable()._fnAjaxUpdate();
			$('#TouchpageLibTable').dataTable()._fnAjaxUpdate();
		})
		$('#nav_tab1').click(function(event) {
			$('#PageLibTable').dataTable()._fnAjaxUpdate();
		});
		$('#nav_tab2').click(function(event) {
			$('#TouchpageLibTable').dataTable()._fnAjaxUpdate();
		});

		$('body').on('click', '.pix-copypage-add', function(event) {
			var index = $(event.target).attr('data-id');
			var subid = $(event.target).attr('sub-id');
			var touch = $(event.target).attr('touch');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
				subid = $(event.target).parent().attr('sub-id');
				touch = $(event.target).parent().attr('touch');
			}
			var selectedPage; 
			if (touch == 0) {
				selectedPage = $('#PageLibTable').dataTable().fnGetData(index);
			} else {
				selectedPage = $('#TouchpageLibTable').dataTable().fnGetData(index);
			}
			if (subid != undefined) {
				selectedPage = selectedPage.subpages[subid];
			}
			var ps = selectedPages.filter(function (el) {
				return el == selectedPage.pageid;
			});
			console.log(selectedPage.pageid, _page.pageid);
			if (ps.length == 0 && selectedPage.pageid != _page.pageid) {
				selectedPages.push(selectedPage.pageid);
				var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"></div>';
				if (selectedPage.snapshot != null && selectedPage.snapshot != '') {
					thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="/pixsigdata' + selectedPage.snapshot + '" class="imgthumb" width="100%"></div>';
				}
				$('#PageSelectedTable').dataTable().fnAddData([thumbhtml, selectedPage.name, 0]);
			}
		});
		$('body').on('click', '.pix-copypage-delete', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			for (var i=rowIndex; i<$('#PageSelectedTable').dataTable().fnSettings().fnRecordsDisplay(); i++) {
				var data = $('#PageSelectedTable').dataTable().fnGetData(i);
				$('#PageSelectedTable').dataTable().fnUpdate(i, parseInt(i), 0);
			}
			$('#PageSelectedTable').dataTable().fnDeleteRow(rowIndex);
			selectedPages.splice(rowIndex, 1);
		});

		$('[type=submit]', $('#CopyModal')).on('click', function(event) {
			if (_submitflag) {
				return;
			}
			_submitflag = true;
			Metronic.blockUI({
				zIndex: 20000,
				animate: true
			});
			$.ajax({
				type : 'POST',
				url : 'page!copy.action',
				data: {
					'sourcepageid': _page.pageid,
					'destpageids': selectedPages.join(','),
				},
				success : function(data, status) {
					_submitflag = false;
					Metronic.unblockUI();
					$('#CopyModal').modal('hide');
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
						$('#PageTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					_submitflag = false;
					Metronic.unblockUI();
					$('#CopyModal').modal('hide');
					console.log('failue');
				}
			});
		});
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
