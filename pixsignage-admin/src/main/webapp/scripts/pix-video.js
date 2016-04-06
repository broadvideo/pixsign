var myurls = {
	'common.list' : 'video!list.action',
	'common.add' : 'video!add.action',
	'common.update' : 'video!update.action',
	'common.delete' : 'video!delete.action'
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
	if (CurBranchid == MyBranchid) {
		$('#BranchContentDiv .table-toolbar').css('display', 'block');
	} else {
		$('#BranchContentDiv .table-toolbar').css('display', 'none');
	}
}			

function initMyTable() {
	//$(".fancybox").fancybox({
	//	openEffect	: 'none',
	//	closeEffect	: 'none'
	//});

	$("#MyTable thead").css("display", "none");
	$("#MyTable tbody").css("display", "none");
	
	var videohtml = '';
	var oTable = $('#MyTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 12, 24, 48, 96 ],
						[ 12, 24, 48, 96 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [
						{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : common.view.filename, 'mData' : 'filename', 'bSortable' : false }, 
						{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false }, 
						{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false }, 
						{'sTitle' : common.view.operation, 'mData' : 'orgid', 'bSortable' : false }],
		'iDisplayLength' : 12,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnPreDrawCallback': function (oSettings) {
			if ($('#MediaContainer').length < 1) {
				$('#MyTable').append('<div id="MediaContainer"></div>');
			}
			$('#MediaContainer').html(''); 
			return true;
		},
		'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			if (iDisplayIndex % 6 == 0) {
				videohtml = '';
				videohtml += '<div class="row" >';
			}
			videohtml += '<div class="col-md-2 col-xs-2">';
			var imageurl = '/pixsigdata' + aData.thumbnail;
			if (aData.thumbnail == null) {
				imageurl = '../local/img/video.jpg';
			}
			if (aData.filepath == null || aData.previewflag != 1) {
				videohtml += '<img src="' + imageurl + '" alt="' + aData['name'] + '" width="100%" />';
			} else {
				//videohtml += '<a class="fancybox" href="/pixsigdata/image/gif/' + aData['videoid'] + '.gif" title="' + aData['name'] + '">';
				var videourl = '/pixsigdata/video/preview/' + aData.videoid + ".mp4";
				videohtml += '<a class="fancybox" href="' + videourl + '" title="' + aData['name'] + '">';
				videohtml += '<img src="' + imageurl + '" alt="' + aData['name'] + '" width="100%" /> </a>';
			}
			videohtml += '<h6>' + aData['videoid'] + '：' + aData['name'] + '<br>';
			var filesize = parseInt(aData['size'] / 1024);
			videohtml += '' + transferIntToComma(filesize) + 'KB</h6>';
			if (CurBranchid == MyBranchid) {
				videohtml += '<p><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-pencil"></i> </a>';
				videohtml += '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> </a> </p>';
			}
			videohtml += '</div>';
			if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
				videohtml += '</div>';
				if ((iDisplayIndex+1) != $('#MyTable').dataTable().fnGetData().length) {
					videohtml += '<hr/>';
				}
				$('#MediaContainer').append(videohtml);
			}
			$('.fancybox').click(function() {
				var myVideo = this.href;
				$.fancybox({
		            padding : 0,
		            content: '<div id="video_container">Loading the player ... </div>',
		            afterShow: function(){
		            	jwplayer.key='rMF5t+PiENAlr4SobpLajtNkDjTaqzQToz13+5sNGLI=';
		                jwplayer('video_container').setup({ 
		                	stretching: 'fill',
		                	image: '/pixres/global/plugins/jwplayer/preview.jpg',
		                    file: myVideo,
		                    width: 760,
		                    height: 428,
		                    autostart: true,
		                    primary: 'flash', 
		                    bufferlength:10,
		                    flashplayer: '/pixres/global/plugins/jwplayer/jwplayer.flash.swf'
		                });
		            }
		        });
		        return false;
			});

			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':CurBranchid });
			aoData.push({'name':'type','value':myType });
		}
	});

	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	
	var currentItem;
	$('body').on('click', '.pix-delete', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		currentItem = item;
		
		bootbox.confirm(common.tips.remove + currentItem.name, function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : myurls['common.delete'],
					cache: false,
					data : {
						'video.videoid': currentItem['videoid']
					},
					success : function(data, status) {
						if (data.errorcode == 0) {
							refreshMyTable();
						} else {
							bootbox.alert(common.tips.error + data.errormsg);
						}
					},
					error : function() {
						bootbox.alert(common.tips.error);
					}
				});				
			}
		 });
	});


	$('body').on('click', '.pix-full', function(event) {
		bootbox.alert(common.tips.storage_full);
	});			
}

function initMyEditModal() {
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	FormValidateOption.rules['video.name'] = {};
	FormValidateOption.rules['video.name']['required'] = true;
	FormValidateOption.rules['video.name']['minlength'] = 2;
	FormValidateOption.submitHandler = function(form) {
		$.ajax({
			type : 'POST',
			url : $('#MyEditForm').attr('action'),
			data : $('#MyEditForm').serialize(),
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#MyEditModal').modal('hide');
					bootbox.alert(common.tips.success);
					refreshMyTable();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert(common.tips.error);
			}
		});
	};
	$('#MyEditForm').validate(FormValidateOption);
	
	$('[type=submit]', $('#MyEditModal')).on('click', function(event) {
		if ($('#MyEditForm').valid()) {
			$('#MyEditForm').submit();
		}
	});
	
	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in item) {
			formdata['video.' + name] = item[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', myurls['common.update']);
		$('#MyEditModal').modal();
	});

}

function initUploadModal() {
	$('#UploadForm').fileupload({
		disableImageResize: false,
		autoUpload: false,
		disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
		maxFileSize: 2147483648,
		acceptFileTypes: /(\.|\/)(mp4|ts|mov|mkv|avi|wmv|mpg|flv)$/i,
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
		refreshMyTable();
	});
	
	
}
