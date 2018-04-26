var ImageModule = function () {
	var _image = {};

	var init = function () {
		initImageTable();
		initImageEvent();
		initImageEditModal();
		initUploadModal();
	};

	var refresh = function () {
		$('#ImageTable').dataTable()._fnAjaxUpdate();
	};
	
	var initImageTable = function () {
		$('#ImageTable thead').css('display', 'none');
		$('#ImageTable tbody').css('display', 'none');
		var imagehtml = '';
		$('#ImageTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 12, 24, 48, 96 ],
							[ 12, 24, 48, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'image!list.action',
			'aoColumns' : [{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }],
			'iDisplayLength' : 12,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#MediaContainer').length < 1) {
					$('#ImageTable').append('<div id="MediaContainer"></div>');
				}
				$('#MediaContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					imagehtml = '';
					imagehtml += '<div class="row" >';
				}
				imagehtml += '<div class="col-md-2 col-xs-2">';
				
				imagehtml += '<div id="ThumbContainer" style="position:relative">';
				var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
				imagehtml += '<div id="ImageThumb" class="thumbs">';
				imagehtml += '<img src="/pixsigdata' + aData.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				imagehtml += '<div class="mask">';
				imagehtml += '<div>';
				imagehtml += '<a class="btn default btn-sm green fancybox" href="/pixsigdata' + aData.filepath + '" title="' + aData.name + '"><i class="fa fa-search"></i></a>';
				imagehtml += '<a class="btn default btn-sm blue pix-update" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-pencil"></i></a>';
				imagehtml += '<a class="btn default btn-sm red pix-delete" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-trash-o"></i></a>';
				imagehtml += '</div>';
				imagehtml += '</div>';
				imagehtml += '</div>';

				imagehtml += '</div>';
				
				imagehtml += '<h6 class="pixtitle">' + aData.name + '<br>';
				var filesize = parseInt(aData.size / 1024);
				imagehtml += '(' + aData.imageid + ') ' + PixData.transferIntToComma(filesize) + ' KB</h6>';
				imagehtml += '</div>';
				
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#ImageTable').dataTable().fnGetData().length) {
					imagehtml += '</div>';
					if ((iDisplayIndex+1) != $('#ImageTable').dataTable().fnGetData().length) {
						imagehtml += '<hr/>';
					}
					$('#MediaContainer').append(imagehtml);
				}

				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#ImageTable #ImageThumb').each(function(i) {
					var height = $(this).closest('#ThumbContainer').parent().width();
					$(this).height(height);
					$(this).closest('#ThumbContainer').height(height);
					$(this).find('.mask').height(height+2);
					$(this).find('.mask').find('div').css('top', $(this).height()/2 - 10);
				});
				$('#ImageTable #RelateThumb').each(function(i) {
					var thumbwidth = $(this).find('img').attr('thumbwidth');
					var thumbheight = $(this).find('img').attr('thumbheight');
					$(this).css('position', 'absolute');
					$(this).css('left', (100-thumbwidth) + '%');
					$(this).css('top', '0');
					$(this).css('width', thumbwidth + '%');
				});
				$(".fancybox").fancybox({
					openEffect	: 'none',
					closeEffect	: 'none',
					closeBtn : false,
				});
			},
			'fnServerParams': function(aoData) { 
			}
		});
		$('#ImageTable_wrapper').addClass('form-inline');
		$('#ImageTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#ImageTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#ImageTable_wrapper .dataTables_length select').select2();
		$('#ImageTable').css('width', '100%');
	};
	
	var initImageEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_image = $('#ImageTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _image.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'image!delete.action',
						cache: false,
						data : {
							'image.imageid': _image.imageid
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

		$('body').on('click', '.pix-full', function(event) {
			bootbox.alert(common.tips.storage_full);
		});			
	};

	var initImageEditModal = function () {
		var formHandler = new FormHandler($('#ImageEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['image.name'] = {};
		formHandler.validateOption.rules['image.name']['required'] = true;
		formHandler.validateOption.rules['image.name']['minlength'] = 2;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#ImageEditForm').attr('action'),
				data : $('#ImageEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#ImageEditModal').modal('hide');
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
		$('#ImageEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#ImageEditModal')).on('click', function(event) {
			if ($('#ImageEditForm').valid()) {
				$('#ImageEditForm').submit();
			}
		});
		
		$('#ImageTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_image = $('#ImageTable').dataTable().fnGetData(index);
			formHandler.setdata('image', _image);
			$('#ImageEditForm').attr('action', 'image!update.action');
			$('#ImageEditModal').modal();
		});
	};
	
	var initUploadModal = function () {
		$('#UploadForm').fileupload({
			autoUpload: false,
			//disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
			disableImageResize: true,
			maxFileSize: 10240000,
			acceptFileTypes: /(\.|\/)(bmp|jpe?g|png|gif)$/i,
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
			url: $('#UploadForm').attr('action'),
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
