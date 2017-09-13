var AudioModule = function () {
	var _audio = {};
	this.AudioTree = new BranchTree($('#AudioPortlet'));

	var init = function () {
		initAudioTable();
		initAudioEvent();
		initAudioEditModal();
		initUploadModal();
	};

	var refresh = function () {
		$('#AudioTable').dataTable()._fnAjaxUpdate();
	};
	
	var initAudioTable = function () {
		$('#AudioTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'audio!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.filename, 'mData' : 'filename', 'bSortable' : false }, 
							{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false }, 
							{'sTitle' : '', 'mData' : 'audioid', 'bSortable' : false },
							{'sTitle' : '', 'mData' : 'audioid', 'bSortable' : false }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				$('td:eq(3)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
				$('td:eq(4)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':AudioTree.branchid });
			}
		});
		$('#AudioTable_wrapper').addClass('form-inline');
		$('#AudioTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#AudioTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#AudioTable_wrapper .dataTables_length select').select2();
	};
	
	var initAudioEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_audio = $('#AudioTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _audio.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'audio!delete.action',
						cache: false,
						data : {
							'audio.audioid': _audio.audioid
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

	var initAudioEditModal = function () {
		var formHandler = new FormHandler($('#AudioEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['audio.name'] = {};
		formHandler.validateOption.rules['audio.name']['required'] = true;
		formHandler.validateOption.rules['audio.name']['minlength'] = 2;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#AudioEditForm').attr('action'),
				data : $('#AudioEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#AudioEditModal').modal('hide');
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
		$('#AudioEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#AudioEditModal')).on('click', function(event) {
			if ($('#AudioEditForm').valid()) {
				$('#AudioEditForm').submit();
			}
		});
		
		$('#AudioTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_audio = $('#AudioTable').dataTable().fnGetData(index);
			formHandler.setdata('audio', _audio);
			$('#AudioEditForm').attr('action', 'audio!update.action');
			$('#AudioEditModal').modal();
		});
	};
	
	var initUploadModal = function () {
		$('#UploadForm').fileupload({
			disableImageResize: false,
			autoUpload: false,
			disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
			maxFileSize: 20480000,
			acceptFileTypes: /(\.|\/)(mp3|aac|wma)$/i,
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
