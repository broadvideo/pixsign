var PageModule = function () {
	var _page = {};
	this._orgid = 1;

	var init = function () {
		initPageTable();
		initPageEvent();
		initPageEditModal();
		initOrgSelect();
		initUploadModal();
	};

	var refresh = function () {
		$('#PageTable').dataTable().fnDraw(true);
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
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.ratio, 'mData' : 'ratio', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'pageid', 'bSortable' : false }],
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
				if (iDisplayIndex % 4 == 0) {
					pagehtml = '';
					pagehtml += '<div class="row" >';
				}
				pagehtml += '<div class="col-md-3 col-xs-3">';
				pagehtml += '<h3>' + aData.name + '</h3>';
				if (aData.ratio == 1) {
					pagehtml += '<h6><span class="label label-sm label-info">' + common.view.ratio_1 + '</span></h6>';
				} else if (aData.ratio == 2) {
					pagehtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_2 + '</span></h6>';
				}

				pagehtml += '<a href="javascript:;" pageid="' + aData.pageid + '" class="fancybox">';
				pagehtml += '<div class="thumbs">';
				if (aData.snapshot != null) {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					pagehtml += '<img src="/pixsigndata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				pagehtml += '</div></a>';
				
				pagehtml += '<div class="util-btn-margin-bottom-5">';
				pagehtml += '<a href="page!export.action?pageid=' + aData.pageid + '" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-export"><i class="fa fa-download"></i> ' + common.view.export + '</a>';
				pagehtml += '</div>';

				pagehtml += '</div>';
				if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#PageTable').dataTable().fnGetData().length) {
					pagehtml += '</div>';
					if ((iDisplayIndex+1) != $('#PageTable').dataTable().fnGetData().length) {
						pagehtml += '<hr/>';
					}
					$('#PageContainer').append(pagehtml);
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
				aoData.push({'name':'orgid','value':_orgid });
				aoData.push({'name':'homeflag','value':'1' });
			},
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
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_page = $('#PageTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _page.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'page!delete.action',
						cache: false,
						data : {
							'page.pageid': _page.pageid
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

	var initPageEditModal = function () {
		var formHandler = new FormHandler($('#PageEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['page.name'] = {};
		formHandler.validateOption.rules['page.name']['required'] = true;
		formHandler.validateOption.rules['page.name']['minlength'] = 2;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#PageEditForm').attr('action'),
				data : $('#PageEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#PageEditModal').modal('hide');
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
		};
		$('#PageEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#PageEditModal')).on('click', function(event) {
			if ($('#PageEditForm').valid()) {
				$('#PageEditForm').submit();
			}
		});
		
		$('#PageTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_page = $('#PageTable').dataTable().fnGetData(index);
			formHandler.setdata('page', _page);
			$('#PageEditForm').attr('action', 'page!update.action');
			$('#PageEditModal').modal();
		});
	};
	
	var initOrgSelect = function () {
	    $('#OrgSelect').select2({
	        placeholder: '',
	        minimumInputLength: 0,
	        ajax: { 
	            url: 'org!list.action',
	            type: 'get',
	            dataType: 'json',
	            data: function (term, page) {
	                return {
	                	sSearch: term, 
	                    iDisplayStart: (page-1)*10,
	                    iDisplayLength: 10,
	                };
	            },
	            results: function (data, page) {
	            	var more = (page * 10) < data.iTotalRecords; 
	            	return {
	            		results : $.map(data.aaData, function (org) { 
	            			return { 
	            				text:org.name, 
	            				id:org.orgid,
	            				item:org
	            			};
	            		}),
	            		more: more
	            	};
	            }
	        },
	        formatResult: function (item) {
	        	return item.text;
	        },
	        formatSelection: function (item) {
	        	return item.text;
	        },
			initSelection: function(element, callback) {
				callback({id: '1', text: 'default' });
			},
	        dropdownCssClass: 'bigdrop', 
	        escapeMarkup: function (m) { return m; } 
	    });

	    $('#OrgSelect').on('change', function(e) {
	    	_orgid = $(this).val();
	    	refresh();
	    });
	};
	
	var initUploadModal = function () {
		$('#UploadForm').fileupload({
			disableImageResize: false,
			autoUpload: false,
			disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
			maxFileSize: 204800000,
			acceptFileTypes: /(\.|\/)(zip|ZIP)$/i,
			// Uncomment the following to send cross-domain cookies:
			//xhrFields: {withCredentials: true},				
		});

		// Enable iframe cross-domain access via redirect option:
		$('#UploadForm').fileupload(
			'option',
			'redirect',
			window.location.href.replace(
				/\/[^\/]*$/,
				'/cors/result.html?%s'
			)
		);

		// Upload server status check for browsers with CORS support:
		if ($.support.cors) {
			$.ajax({
				type: 'HEAD'
			}).fail(function () {
				$('<div class="alert alert-danger"/>')
					.text('Upload server currently unavailable - ' +
							new Date())
					.appendTo('#UploadForm');
			});
		}

		// Load & display existing files:
		$('#UploadForm').addClass('fileupload-processing');
		$.ajax({
			// Uncomment the following to send cross-domain cookies:
			//xhrFields: {withCredentials: true},
			url: $('#UploadForm').attr("action"),
			dataType: 'json',
			context: $('#UploadForm')[0]
		}).always(function () {
			$(this).removeClass('fileupload-processing');
		}).done(function (result) {
			$(this).fileupload('option', 'done')
			.call(this, $.Event('done'), {result: result});
		});

		$('#UploadForm').bind('fileuploadsubmit', function (e, data) {
			var inputs = data.context.find(':input');
			data.formData = inputs.serializeArray();
		}); 

		$('body').on('click', '.pix-add', function(event) {
			$('#UploadForm').find('.cancel').click();
			$('#UploadForm .files').html('');
			$('#UploadModal').modal();
		});			

		$('body').on('click', '.pix-upload-close', function(event) {
			refresh();
		});
	};

	return {
		init: init,
		refresh: refresh,
	}
	
}();
