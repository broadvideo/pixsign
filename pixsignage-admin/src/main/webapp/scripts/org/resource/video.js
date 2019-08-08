var VideoModule = function () {
	var _video = {};
	this.VideoTree = new BranchTree($('#VideoPortlet'));

	var init = function () {
		initVideoTable();
		initVideoEvent();
		initVideoEditModal();
		initUploadModal();
	};

	var refresh = function () {
		$('#VideoTable').dataTable()._fnAjaxUpdate();
	};
	
	var initVideoTable = function () {
		$('#VideoTable thead').css('display', 'none');
		$('#VideoTable tbody').css('display', 'none');
		var videohtml = '';
		$('#VideoTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 24, 48, 72, 96 ],
							[ 24, 48, 72, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'video!list.action',
			'aoColumns' : [
							{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.filename, 'mData' : 'filename', 'bSortable' : false }, 
							{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false }, 
							{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'orgid', 'bSortable' : false }],
			'iDisplayLength' : 24,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#MediaContainer').length < 1) {
					$('#VideoTable').append('<div id="MediaContainer"></div>');
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
				var thumbnail = '../../img/video.jpg';
				var thumbwidth = 100;
				if (aData.thumbnail != null) {
					thumbnail = '/pixsigdata' + aData.thumbnail;
					thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
				}
				videohtml += '<div id="VideoThumb" class="thumbs">';
				videohtml += '<img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				videohtml += '<div class="mask">';
				videohtml += '<div>';
				if (aData.filepath != null && aData.previewflag == 1) {
					var previewwidth = 760;
					if (aData.width > aData.height) {
						previewwidth = 760;
						previewheight = previewwidth * aData.height / aData.width;
					} else {
						previewheight = 760;
						previewwidth = previewheight * aData.width / aData.height;
					}
					var videourl = '/pixsigdata/video/preview/' + aData.videoid + '.mp4';
					videohtml += '<a class="btn default btn-sm green videofancybox" href="' + videourl + '" + previewwidth="' + previewwidth + '" + previewheight="' + previewheight + '"><i class="fa fa-search"></i></a>';
				}
				videohtml += '<a class="btn default btn-sm blue pix-update" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-pencil"></i></a>';
				videohtml += '<a class="btn default btn-sm red pix-delete" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-trash-o"></i></a>';
				videohtml += '</div>';
				videohtml += '</div>';
				videohtml += '</div>';

				if (aData.relateimage != null) {
					aData.relateimage.width = aData.relateimage.width == null ? 100: aData.relateimage.width;
					aData.relateimage.height = aData.relateimage.height == null ? 100: aData.relateimage.height;
					thumbwidth = aData.relateimage.width > aData.relateimage.height ? 50 : 50*aData.relateimage.width/aData.relateimage.height;
					thumbheight = aData.relateimage.height > aData.relateimage.width ? 50 : 50*aData.relateimage.height/aData.relateimage.width;
					videohtml += '<a class="imagefancybox" href="/pixsigdata' + aData.relateimage.filepath + '" title="' + aData.relateimage.name + '">';
					videohtml += '<div id="RelateThumb" class="thumbs">';
					videohtml += '<img src="/pixsigdata' + aData.relateimage.thumbnail + '" class="imgthumb" width="100%" alt="' + aData.relateimage.name + '" thumbwidth="' + thumbwidth + '" thumbheight="' + thumbheight + '"/>';
					videohtml += '</div>';
					videohtml += '</a>';
				} else if (aData.relatevideo != null) {
					var relatethumbnail = '../../img/video.jpg';
					if (aData.relatevideo.thumbnail != null) {
						relatethumbnail = '/pixsigdata' + aData.relatevideo.thumbnail;
					}
					aData.relatevideo.width = aData.relatevideo.width == null ? 100: aData.relatevideo.width;
					aData.relatevideo.height = aData.relatevideo.height == null ? 100: aData.relatevideo.height;
					thumbwidth = aData.relatevideo.width > aData.relatevideo.height ? 50 : 50*aData.relatevideo.width/aData.relatevideo.height;
					thumbheight = aData.relatevideo.height > aData.relatevideo.width ? 50 : 50*aData.relatevideo.height/aData.relatevideo.width;
					if (aData.relatevideo.filepath != null && aData.relatevideo.previewflag == 1) {
						var previewwidth = 760;
						if (aData.relatevideo.width > aData.relatevideo.height) {
							previewwidth = 760;
							previewheight = previewwidth * aData.relatevideo.height / aData.relatevideo.width;
						} else {
							previewheight = 760;
							previewwidth = previewheight * aData.relatevideo.width / aData.relatevideo.height;
						}
						var videourl = '/pixsigdata/video/preview/' + aData.relatevideo.videoid + '.mp4';
						videohtml += '<a class="videofancybox" href="' + videourl + '" previewwidth="' + previewwidth + '" previewheight="' + previewheight + '">';
						videohtml += '<div id="RelateThumb" class="thumbs">';
						videohtml += '<img src="' + relatethumbnail + '" class="imgthumb" width="100%" alt="' + aData.relatevideo.name + '" thumbwidth="' + thumbwidth + '" thumbheight="' + thumbheight + '"/>';
						videohtml += '</div>';
						videohtml += '</a>';
					} else {
						videohtml += '<div id="RelateThumb" class="thumbs">';
						videohtml += '<img src="' + relatethumbnail + '" class="imgthumb" width="100%" alt="' + aData.relatevideo.name + '" thumbwidth="' + thumbwidth + '" thumbheight="' + thumbheight + '"/>';
						videohtml += '</div>';
					}
				}
				videohtml += '</div>';
				
				videohtml += '<h6 class="pixtitle">' + aData.name + '<br>';
				var filesize = parseInt(aData['size'] / 1024);
				videohtml += '(' + aData.videoid + ') ' + PixData.transferIntToComma(filesize) + ' KB</h6>';
				videohtml += '</div>';

				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#VideoTable').dataTable().fnGetData().length) {
					videohtml += '</div>';
					if ((iDisplayIndex+1) != $('#VideoTable').dataTable().fnGetData().length) {
						videohtml += '<hr/>';
					}
					$('#MediaContainer').append(videohtml);
				}
				$('.videofancybox').click(function() {
					var href = this.href;
					var previewwidth = $(this).attr('previewwidth');
					var previewheight = $(this).attr('previewheight');
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
			                    file: href,
			                    width: previewwidth,
			                    height: previewheight,
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
				$('#VideoTable #VideoThumb').each(function(i) {
					var height = $(this).closest('#ThumbContainer').parent().width();
					$(this).height(height);
					$(this).closest('#ThumbContainer').height(height);
					$(this).find('.mask').height(height+2);
					$(this).find('.mask').find('div').css('top', $(this).height()/2 - 10);
				});
				$('#VideoTable #RelateThumb').each(function(i) {
					var thumbwidth = $(this).find('img').attr('thumbwidth');
					var thumbheight = $(this).find('img').attr('thumbheight');
					$(this).css('position', 'absolute');
					$(this).css('left', (100-thumbwidth) + '%');
					$(this).css('top', '0');
					$(this).css('width', thumbwidth + '%');
				});
				$('.imagefancybox').fancybox({
					openEffect	: 'none',
					closeEffect	: 'none',
					closeBtn : false,
				});
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':VideoTree.branchid });
				aoData.push({'name':'folderid','value':VideoTree.folderid });
				aoData.push({'name':'type','value':'1' });
			}
		});
		$('#VideoTable_wrapper').addClass('form-inline');
		$('#VideoTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#VideoTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#VideoTable_wrapper .dataTables_length select').select2();
		$('#VideoTable').css('width', '100%');
	};
	
	var initVideoEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_video = $('#VideoTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _video.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'video!delete.action',
						cache: false,
						data : {
							'video.videoid': _video.videoid
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

	var initVideoEditModal = function () {
		var RelateImageSelect = new FolderImageSelect($('#RelateImageSelect'));
		var RelateVideoSelect = new FolderVideoSelect($('#RelateVideoSelect'));
		
		$('#VideoEditForm input[name="video.relatetype"]').change(function(e) {
			refreshRelateType();
		});
		function refreshRelateType() {
			var relatetype = $('#VideoEditForm input[name="video.relatetype"]:checked').attr('value');
			if (relatetype == 1) {
				$('#RelateVideoSelect').css('display', '');
				$('#RelateImageSelect').css('display', 'none');
				$('#RelateText').css('display', 'none');
			} else if (relatetype == 2) {
				$('#RelateVideoSelect').css('display', 'none');
				$('#RelateImageSelect').css('display', '');
				$('#RelateText').css('display', 'none');
			} else {
				$('#RelateVideoSelect').css('display', 'none');
				$('#RelateImageSelect').css('display', 'none');
				$('#RelateText').css('display', '');
			}
		}

		var EditFolderTreeData = [];
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
		function createEditFolderTree() {
			$('#EditFormFolderTree').jstree('destroy');
			$.ajax({
				type : 'POST',
				url : 'folder!list.action',
				data : {
					branchid: _video.branchid,
				},
				success : function(data, status) {
					if (data.errorcode == 0) {
						createFolderTreeData(data.aaData, EditFolderTreeData);
						$('#EditFormFolderTree').jstree({
							'core' : {
								'multiple' : false,
								'data' : EditFolderTreeData
							},
							'plugins' : ['unique'],
						});
						$('#EditFormFolderTree').on('loaded.jstree', function() {
							$('#EditFormFolderTree').jstree('select_node', _video.folderid);
						});
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});

		}
		
		var formHandler = new FormHandler($('#VideoEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['video.name'] = {};
		formHandler.validateOption.rules['video.name']['required'] = true;
		formHandler.validateOption.rules['video.name']['minlength'] = 2;
		formHandler.validateOption.submitHandler = function(form) {
			$('#VideoEditForm input[name="video.folderid"]').attr('value', $('#EditFormFolderTree').jstree('get_selected', false)[0]);
			var relatetype = $('#VideoEditForm input[name="video.relatetype"]:checked').attr('value');
			if (relatetype == 1) {
				$('#VideoEditForm input[name="video.relateid"]').attr('value', RelateVideoSelect.getVideoid);
			} else if (relatetype == 2) {
				$('#VideoEditForm input[name="video.relateid"]').attr('value', RelateImageSelect.getImageid);
			}
			$.ajax({
				type : 'POST',
				url : $('#VideoEditForm').attr('action'),
				data : $('#VideoEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#VideoEditModal').modal('hide');
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
		$('#VideoEditForm').validate(formHandler.validateOption);

		//Init Tags
		/*
		$.ajax({
			type : 'GET',
			url : 'org!get.action',
			data : '',
			success : function(data, status) {
				if (data.errorcode == 0) {
					var tags = $(data.org.tags.split(','));
					var taglist = [];
					for (var i=0; i<tags.length; i++) {
						taglist.push({
							id: tags[i],
							text: tags[i],
						})
					}
					$('#TagSelect').select2({
						multiple: true,
						minimumInputLength: 0,
						data: taglist,
						dropdownCssClass: 'bigdrop', 
						escapeMarkup: function (m) { return m; } 
					});
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
		*/
		$('[type=submit]', $('#VideoEditModal')).on('click', function(event) {
			if ($('#VideoEditForm').valid()) {
				$('#VideoEditForm').submit();
			}
		});
		
		$('#VideoTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_video = $('#VideoTable').dataTable().fnGetData(index);
			formHandler.setdata('video', _video);
			$('#VideoEditForm').attr('action', 'video!update.action');
			//$('#TagSelect').select2('val', $(_video.tags.split(',')));
			createEditFolderTree();
			refreshRelateType();
			if (_video.relatetype == 1 && _video.relatevideo != null) {
				RelateVideoSelect.setVideo(_video.relatevideo);
			} else if (_video.relatetype == 2 && _video.relateimage != null) {
				RelateImageSelect.setImage(_video.relateimage);
			} 
			$('#VideoEditModal').modal();
		});
	};
	
	var initUploadModal = function () {
		$('#UploadForm').fileupload({
			autoUpload: false,
			//disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
			disableImageResize: true,
			maxFileSize: 2147483648,
			acceptFileTypes: /(\.|\/)(mp4)$/i,
			//acceptFileTypes: /(\.|\/)(mp4|ts|mov|mkv|avi|wmv|mpg|flv)$/i,
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
