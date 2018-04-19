var DiyModule = function () {
	var _diy = {};
	this.DiyTree = new BranchTree($('#DiyPortlet'));

	var init = function () {
		initDiyTable();
		initDiyEvent();
		initUploadModal();
	};

	var refresh = function () {
		$('#DiyTable').dataTable()._fnAjaxUpdate();
	};
	
	var initDiyTable = function () {
		$('#DiyTable thead').css('display', 'none');
		$('#DiyTable tbody').css('display', 'none');
		var diyhtml = '';
		$('#DiyTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 24, 48, 72, 96 ],
							[ 24, 48, 72, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'diy!list.action',
			'aoColumns' : [
							{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'orgid', 'bSortable' : false }],
			'iDisplayLength' : 24,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#MediaContainer').length < 1) {
					$('#DiyTable').append('<div id="MediaContainer"></div>');
				}
				$('#MediaContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					diyhtml = '';
					diyhtml += '<div class="row" >';
				}
				diyhtml += '<div class="col-md-2 col-xs-2">';
				
				diyhtml += '<div id="ThumbContainer" style="position:relative">';
				var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
				diyhtml += '<div id="DiyThumb" class="thumbs">';
				diyhtml += '<img src="/pixsigdata' + aData.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				diyhtml += '<div class="mask">';
				diyhtml += '<div>';
				diyhtml += '<a class="btn default btn-sm green fancybox" href="/pixsigdata' + aData.snapshot + '" title="' + aData.name + '"><i class="fa fa-search"></i></a>';
				diyhtml += '<a class="btn default btn-sm red pix-delete" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-trash-o"></i></a>';
				diyhtml += '</div>';
				diyhtml += '</div>';
				diyhtml += '</div>';

				diyhtml += '</div>';
				
				diyhtml += '<h6 class="pixtitle">' + aData.name + '<br>';
				diyhtml += '(' + aData.version + ') ' + aData.code + '</h6>';
				diyhtml += '</div>';
				
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#DiyTable').dataTable().fnGetData().length) {
					diyhtml += '</div>';
					if ((iDisplayIndex+1) != $('#DiyTable').dataTable().fnGetData().length) {
						diyhtml += '<hr/>';
					}
					$('#MediaContainer').append(diyhtml);
				}

				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#DiyTable #DiyThumb').each(function(i) {
					var height = $(this).closest('#ThumbContainer').parent().width();
					$(this).height(height);
					$(this).closest('#ThumbContainer').height(height);
					$(this).find('.mask').height(height+2);
					$(this).find('.mask').find('div').css('top', $(this).height()/2 - 10);
				});
				$('#DiyTable #RelateThumb').each(function(i) {
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
				aoData.push({'name':'branchid','value':DiyTree.branchid });
				aoData.push({'name':'folderid','value':DiyTree.folderid });
			}
		});
		$('#DiyTable_wrapper').addClass('form-inline');
		$('#DiyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DiyTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DiyTable_wrapper .dataTables_length select').select2();
		$('#DiyTable').css('width', '100%');
	};
	
	var initDiyEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_diy = $('#DiyTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _diy.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'diy!delete.action',
						cache: false,
						data : {
							'diy.diyid': _diy.diyid
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

	var initUploadModal = function () {
		$('#UploadForm').fileupload({
			autoUpload: false,
			//disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
			disableImageResize: true,
			maxFileSize: 10240000,
			acceptFileTypes: /(\.|\/)(zip)$/i,
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
