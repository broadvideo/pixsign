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

var CurrentVideo;
function initMyTable() {
	$("#MyTable thead").css("display", "none");
	$("#MyTable tbody").css("display", "none");
	
	var videohtml = '';
	var oTable = $('#MyTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 24, 48, 72, 96 ],
						[ 24, 48, 72, 96 ] 
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
		'iDisplayLength' : 24,
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
			
			videohtml += '<div id="ThumbContainer" style="position:relative">';
			var thumbnail = '../img/video.jpg';
			var thumbwidth = 100;
			if (aData.thumbnail != null) {
				thumbnail = '/pixsigdata' + aData.thumbnail;
				thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			}
			var videourl = '/pixsigdata/video/preview/' + aData.videoid + ".mp4";
			videohtml += '<div id="VideoThumb" class="thumbs">';
			videohtml += '<img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
			videohtml += '<div class="mask">';
			videohtml += '<div>';
			if (aData.filepath != null && aData.previewflag == 1) {
				videohtml += '<a class="btn default btn-sm green fancybox" href="' + videourl + '" title="' + aData.name + '"><i class="fa fa-search"></i></a>';
			}
			if (CurBranchid == MyBranchid) {
				videohtml += '<a class="btn default btn-sm blue pix-update" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-pencil"></i></a>';
				videohtml += '<a class="btn default btn-sm red pix-delete" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-trash-o"></i></a>';
			}
			videohtml += '</div>';
			videohtml += '</div>';
			videohtml += '</div>';

			if (aData.relate != null) {
				var thumbnail = '../img/video.jpg';
				var thumbwidth = 50;
				var thumbheight = 50;
				if (aData.relate.thumbnail != null) {
					thumbnail = '/pixsigdata' + aData.relate.thumbnail;
					console.log('thumbnail: ', thumbnail);
					aData.relate.width = aData.relate.width == null ? 100: aData.relate.width;
					aData.relate.height = aData.relate.height == null ? 100: aData.relate.height;
					console.log('width: ', aData.relate.width, ' height: ', aData.relate.height);
					thumbwidth = aData.relate.width > aData.relate.height ? 50 : 50*aData.relate.width/aData.relate.height;
					thumbheight = aData.relate.height > aData.relate.width ? 50 : 50*aData.relate.height/aData.relate.width;
				}
				var videourl = '/pixsigdata/video/preview/' + aData.relateid + ".mp4";
				if (aData.relate.filepath == null || aData.relate.previewflag != 1) {
					videohtml += '<div id="RelateThumb" class="thumbs">';
					videohtml += '<img src="' + thumbnail + '" class="imgthumb" width="100%" alt="' + aData.relate.name + '" thumbwidth="' + thumbwidth + '" thumbheight="' + thumbheight + '"/>';
					videohtml += '</div>';
				} else {
					var videourl = '/pixsigdata/video/preview/' + aData.relateid + ".mp4";
					videohtml += '<a class="fancybox" href="' + videourl + '" title="' + aData.relate.name + '">';
					videohtml += '<div id="RelateThumb" class="thumbs">';
					videohtml += '<img src="' + thumbnail + '" class="imgthumb" width="100%" alt="' + aData.relate.name + '" thumbwidth="' + thumbwidth + '" thumbheight="' + thumbheight + '"/>';
					videohtml += '</div>';
					videohtml += '</a>';
				}
			}

			//if (aData.filepath == null || aData.previewflag != 1) {
			//	videohtml += '<div id="VideoThumb" class="thumbs">';
			//	videohtml += '<img src="' + thumbnail + '" class="imgthumb" width="100%" alt="' + aData.name + '" />';
			//	videohtml += '</div>';
			//} else {
				//var videourl = '/pixsigdata/video/preview/' + aData.videoid + ".mp4";
				//videohtml += '<a class="fancybox" href="' + videourl + '" title="' + aData.name + '">';
				//videohtml += '<div id="VideoThumb" class="thumbs">';
				//var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
				//videohtml += '<img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				//videohtml += '</div>';
				//videohtml += '</a>';
			//}
			
			//if (aData.relate != null) {
			//	var relate_thumbnail = '/pixsigdata' + aData.relate.thumbnail;
			//	if (aData.relate.thumbnail == null) {
			//		relate_thumbnail = '../img/video.jpg';
			//	}
			//	if (aData.relate.filepath == null || aData.relate.previewflag != 1) {
			//		videohtml += '<div id="RelateThumb" class="thumbs">';
			//		videohtml += '<img src="' + relate_thumbnail + '" class="imgthumb" width="100%" alt="' + aData.relate.name + '" />';
			//		videohtml += '</div>';
			//	} else {
			//		var videourl = '/pixsigdata/video/preview/' + aData.relateid + ".mp4";
			//		videohtml += '<a class="fancybox" href="' + videourl + '" title="' + aData.relate.name + '">';
			//		videohtml += '<div id="RelateThumb" class="thumbs">';
			//		videohtml += '<img src="' + relate_thumbnail + '" class="imgthumb" width="50px" alt="' + aData.relate.name + '" />';
			//		videohtml += '</div>';
			//		videohtml += '</a>';
			//	}
			//}
			
			videohtml += '</div>';
			
			videohtml += '<h6 class="pixtitle">' + aData.name + '<br>';
			var filesize = parseInt(aData['size'] / 1024);
			videohtml += '(' + aData.videoid + ') ' + transferIntToComma(filesize) + ' KB</h6>';
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
					openEffect	: 'none',
					closeEffect	: 'none',
					closeBtn : false,
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
		'fnDrawCallback': function(oSettings, json) {
			$('#MyTable #VideoThumb').each(function(i) {
				var height = $(this).closest('#ThumbContainer').parent().width();
				$(this).height(height);
				$(this).closest('#ThumbContainer').height(height);
				$(this).find('.mask').height(height+2);
				$(this).find('.mask').find('div').css('top', $(this).height()/2 - 10);
			});
			$('#MyTable #RelateThumb').each(function(i) {
				var thumbwidth = $(this).find('img').attr('thumbwidth');
				var thumbheight = $(this).find('img').attr('thumbheight');
				$(this).css('position', 'absolute');
				$(this).css('left', (100-thumbwidth) + '%');
				$(this).css('top', '0');
				$(this).css('width', thumbwidth + '%');
			});
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':CurBranchid });
			aoData.push({'name':'folderid','value':CurFolderid });
			aoData.push({'name':'type','value':myType });
		}
	});

	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	
	$('body').on('click', '.pix-delete', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentVideo = $('#MyTable').dataTable().fnGetData(index);
		bootbox.confirm(common.tips.remove + CurrentVideo.name, function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : myurls['common.delete'],
					cache: false,
					data : {
						'video.videoid': CurrentVideo.videoid
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
	var currentEditFolderTreeData = [];
	var currentEditFolderid = 0;
	function createFolderTreeData(folderes, treeData) {
		for (var i=0; i<folderes.length; i++) {
			treeData[i] = {};
			treeData[i].id = folderes[i].folderid;
			treeData[i].text = folderes[i].name;
			treeData[i].state = {
				opened: true,
			}
			treeData[i].children = [];
			createFolderTreeData(folderes[i].children, treeData[i].children);
		}
	}
	function createEditFolderTree(treeData) {
		$('#EditFormFolderTree').jstree('destroy');
		$.ajax({
			type : 'POST',
			url : 'folder!list.action',
			data : {
				branchid: CurBranchid,
			},
			success : function(data, status) {
				if (data.errorcode == 0) {
					createFolderTreeData(data.aaData, currentEditFolderTreeData);
					$('#EditFormFolderTree').jstree({
						'core' : {
							'multiple' : false,
							'data' : treeData
						},
						'plugins' : ['unique'],
					});
					$('#EditFormFolderTree').on('loaded.jstree', function() {
						$('#EditFormFolderTree').jstree('select_node', currentEditFolderid);
					});
				} else {
					alert(data.errorcode + ": " + data.errormsg);
				}
			},
			error : function() {
				alert('failure');
			}
		});

	}
	
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	FormValidateOption.rules['video.name'] = {};
	FormValidateOption.rules['video.name']['required'] = true;
	FormValidateOption.rules['video.name']['minlength'] = 2;
	FormValidateOption.submitHandler = function(form) {
		$('#MyEditForm input[name="video.folderid"]').attr('value', $("#EditFormFolderTree").jstree('get_selected', false)[0]);
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
		CurrentVideo = $('#MyTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in CurrentVideo) {
			formdata['video.' + name] = CurrentVideo[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', myurls['common.update']);
		currentEditFolderid = CurrentVideo.folderid;
		createEditFolderTree(currentEditFolderTreeData);

		$("#RelateVideoSelect").select2({
			placeholder: common.tips.detail_select,
			minimumInputLength: 0,
			ajax: { 
				url: 'video!list.action',
				type: 'GET',
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
						results : $.map(data.aaData, function (item) { 
							return { 
								text:item.name, 
								id:item.videoid,
								thumbnail:item.thumbnail
							};
						}),
						more: more
					};
				}
			},
			formatResult: function (video) {
				var html = '<span><img src="/pixsigdata' + video.thumbnail + '" height="25" /> ' + video.text + '</span>'
				return html;
			},
			formatSelection: function (video) {
				var html = '<span><img src="/pixsigdata' + video.thumbnail + '" height="25" /> ' + video.text + '</span>'
				return html;
			},
			initSelection: function(element, callback) {
				if (CurrentVideo.relate != null) {
					callback({id: CurrentVideo.relateid, text: CurrentVideo.relate.name, thumbnail: CurrentVideo.relate.thumbnail });
				}
			},
			dropdownCssClass: "bigdrop", 
			escapeMarkup: function (m) { return m; } 
		});

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
