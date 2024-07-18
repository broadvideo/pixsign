var HouseModule = function () {
	var _house = {};

	var init = function () {
		initHouseTable();
		initHouseEvent();
		initUploadModal();
	};

	var refresh = function () {
		$('#HouseTable').dataTable()._fnAjaxUpdate();
	};
	
	var initHouseTable = function () {
		$('#HouseTable thead').css('display', 'none');
		$('#HouseTable tbody').css('display', 'none');
		var househtml = '';
		$('#HouseTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 24, 48, 72, 96 ],
							[ 24, 48, 72, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'house!list.action',
			'aoColumns' : [
							{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'orgid', 'bSortable' : false }],
			'iDisplayLength' : 24,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#MediaContainer').length < 1) {
					$('#HouseTable').append('<div id="MediaContainer"></div>');
				}
				$('#MediaContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					househtml = '';
					househtml += '<div class="row" >';
				}
				househtml += '<div class="col-md-2 col-xs-2">';
				
				househtml += '<div id="ThumbContainer" style="position:relative">';
				aData.width = aData.width == 0? 100 : aData.width;
				aData.height = aData.height == 0? 100 : aData.height;
				var thumbnail = aData.thumbnail == null? '/pixsignage/img/house.png' : '/pixsigndata' + aData.thumbnail;
				var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
				househtml += '<div id="HouseThumb" class="thumbs">';
				househtml += '<img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				househtml += '<div class="mask">';
				househtml += '<div>';
				househtml += '<a class="btn default btn-sm red pix-delete" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-trash-o"></i></a>';
				househtml += '</div>';
				househtml += '</div>';
				househtml += '</div>';

				househtml += '</div>';
				
				househtml += '<h6 class="pixtitle">' + aData.name + '</h6>';
				househtml += '</div>';
				
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#HouseTable').dataTable().fnGetData().length) {
					househtml += '</div>';
					if ((iDisplayIndex+1) != $('#HouseTable').dataTable().fnGetData().length) {
						househtml += '<hr/>';
					}
					$('#MediaContainer').append(househtml);
				}

				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#HouseTable #HouseThumb').each(function(i) {
					var height = $(this).closest('#ThumbContainer').parent().width();
					$(this).height(height);
					$(this).closest('#ThumbContainer').height(height);
					$(this).find('.mask').height(height+2);
					$(this).find('.mask').find('div').css('top', $(this).height()/2 - 10);
				});
			}
		});
		$('#HouseTable_wrapper').addClass('form-inline');
		$('#HouseTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#HouseTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#HouseTable_wrapper .dataTables_length select').select2();
		$('#HouseTable').css('width', '100%');
	};
	
	var initHouseEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_house = $('#HouseTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _house.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'house!delete.action',
						cache: false,
						data : {
							'house.houseid': _house.houseid
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
			maxFileSize: 102400000,
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
