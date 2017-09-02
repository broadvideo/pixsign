var AppfileModule = function () {
	var _appfile = {};

	var init = function () {
		initAppfileTable();
		initAppfileEvent();
		initAppfileEditModal();
		initUploadModal();
	};

	var refresh = function () {
		$('#AppfileTable').dataTable()._fnAjaxUpdate();
	};
	
	var initAppfileTable = function () {
		$('#AppfileTable').dataTable({
			'sDom' : 'rt',
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ]
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'appfile!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '15%' }, 
							{'sTitle' : common.view.versioncode, 'mData' : 'vname', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.mtype, 'mData' : 'mtype', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.download, 'mData' : 'filename', 'bSortable' : false, 'sWidth' : '30%' }, 
							{'sTitle' : common.view.latest, 'mData' : 'appfileid', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false, 'sWidth' : '15%' }, 
							{'sTitle' : '', 'mData' : 'appfileid', 'bSortable' : false, 'sWidth' : '10%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(1)', nRow).html(aData.vname + '(' + aData.vcode + ')');
				$('td:eq(3)', nRow).html(PixData.transferIntToByte(aData.size));
				$('td:eq(4)', nRow).html('<a href="/pixsigdata' + aData.filepath + '">' + aData.filename + '</a>');
				if (aData.latestflag == 1) {
					$('td:eq(5)', nRow).html('<span class="label label-sm label-success">' + common.view.latest + '</span>');
				} else {
					$('td:eq(5)', nRow).html('');
				}
				var html = '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				html += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				$('td:eq(7)', nRow).html(html);
				return nRow;
			}
		});
		$('#AppfileTable').css('width', '100%');
	};
	
	var initAppfileEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_appfile = $('#AppfileTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _appfile.filename, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'appfile!delete.action',
						cache: false,
						data : {
							'appfile.appfileid': _appfile.appfileid
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

	var initAppfileEditModal = function () {
		var formHandler = new FormHandler($('#AppfileEditForm'));

		$('[type=submit]', $('#AppfileEditModal')).on('click', function(event) {
			$.ajax({
				type : 'POST',
				url : $('#AppfileEditForm').attr('action'),
				data : $('#AppfileEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#AppfileEditModal').modal('hide');
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
		});
		
		$('body').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_appfile = $('#AppfileTable').dataTable().fnGetData(index);
			formHandler.setdata('appfile', _appfile);
			$('#AppfileEditForm textarea[name="appfile.description"]').val(_appfile.description);
			$('#AppfileEditForm').attr('action', 'appfile!update.action');
			$('#AppfileEditModal').modal();
		});
	};
	
	var initUploadModal = function () {
		$('#UploadForm').fileupload({
			autoUpload: false,
			//disableAppfileResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
			disableAppfileResize: true,
			maxFileSize: 102400000,
			acceptFileTypes: /(\.|\/)(apk|exe)$/i,
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
