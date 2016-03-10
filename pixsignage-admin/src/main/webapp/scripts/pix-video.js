var myurls = {
	'common.list' : 'video!list.action',
	'common.add' : 'video!add.action',
	'common.update' : 'video!update.action',
	'common.delete' : 'video!delete.action',
	'branch.list' : 'branch!list.action'
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

function initMyTable() {
	//$(".fancybox").fancybox({
	//	openEffect	: 'none',
	//	closeEffect	: 'none'
	//});

	$("#MyTable thead").css("display", "none");
	$("#MyTable tbody").css("display", "none");
	
	var currentSelectBranchid = myBranchid;
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
			var videourl = '/pixsigdata' + aData.filepath;
			if (aData.filepath == null) {
				videohtml += '<img src="' + imageurl + '" alt="' + aData['name'] + '" width="100%" />';
			} else {
				//videohtml += '<a class="fancybox" href="/pixsigdata/image/gif/' + aData['videoid'] + '.gif" title="' + aData['name'] + '">';
				videohtml += '<a class="fancybox" href="' + videourl + '" title="' + aData['name'] + '">';
				videohtml += '<img src="' + imageurl + '" alt="' + aData['name'] + '" width="100%" /> </a>';
			}
			videohtml += '<h6>' + aData['videoid'] + '：' + aData['name'] + '<br>';
			var filesize = parseInt(aData['size'] / 1024);
			videohtml += '' + transferIntToComma(filesize) + 'KB</h6>';
			if (currentSelectBranchid == myBranchid) {
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
			aoData.push({'name':'branchid','value':currentSelectBranchid });
			aoData.push({'name':'type','value':myType });
		}
	});

	jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	jQuery('#MyTable_wrapper .dataTables_length select').select2();
	
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


	$.ajax({
		type : 'POST',
		url : myurls['branch.list'],
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var currentBranchTreeData = [];
				createBranchTreeData(data.aaData, currentBranchTreeData);
				createSelectBranchTree(currentBranchTreeData);
			} else {
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
		}
	});
	function createBranchTreeData(branches, treeData) {
		for (var i=0; i<branches.length; i++) {
			treeData[i] = {};
			treeData[i]['data'] = {};
			treeData[i]['data']['title'] = branches[i].name;
			treeData[i]['attr'] = {};
			treeData[i]['attr']['id'] = branches[i].branchid;
			treeData[i]['attr']['parentid'] = branches[i].parentid;
			if (treeData[i]['attr']['id'] == currentSelectBranchid) {
				treeData[i]['attr']['class'] = 'jstree-selected';
			} else {
				treeData[i]['attr']['class'] = 'jstree-unselected';
			}
			treeData[i]['children'] = [];
			createBranchTreeData(branches[i].children, treeData[i]['children']);
		}
	}
	function createSelectBranchTree(treeData) {
		$('#SelectBranchTree').jstree('destroy');
		$('#SelectBranchTree').jstree({
			'json_data' : {
				'data' : treeData
			},
			'plugins' : [ 'themes', 'json_data', 'ui' ],
			'core' : {
				'animation' : 100
			},
			'ui' : {
				'select_limit' : 1,
				'initially_select' : currentSelectBranchid,
			},
			'themes' : {
				'theme' : 'proton',
				'icons' : false,
			}
		});
		$('#SelectBranchTree').on('loaded.jstree', function() {
			$('#SelectBranchTree').jstree('open_all');
		});
	}
	
	var BranchidList = [];
	var BranchnameList = [];
	$("#SelectBranchTree").on("select_node.jstree", function(event, data) {
		currentSelectBranchid = data.rslt.obj.attr('id');
		BranchidList = data.inst.get_path('#' + data.rslt.obj.attr('id'), true);
		BranchnameList = data.inst.get_path('#' + data.rslt.obj.attr('id'), false); 
		initBranchBreadcrumb(currentSelectBranchid);
		refreshMyTable();
	});
	
	$('body').on('click', '.pix-branch', function(event) {
		currentSelectBranchid = $(event.target).attr('data-id');
		initBranchBreadcrumb(currentSelectBranchid);
		refreshMyTable();
	});

	$('body').on('click', '.pix-full', function(event) {
		bootbox.alert(common.tips.storage_full);
	});			

	function initBranchBreadcrumb(branchid) {
		var html = '';
		var active = '';
		for (var i=0; i<BranchidList.length; i++) {
			if (BranchidList[i] == branchid) {
				active = 'active';
			} else {
				active = '';
			}
			html += '<li class="' + active + '">';
			if (i == 0) {
				html += '<i class="fa fa-home"></i>';
			}
			if (BranchidList[i] == branchid) {
				html += BranchnameList[i];
			} else {
				html += '<a href="javascript:;" data-id="' + BranchidList[i] + '" class="pix-branch">' + BranchnameList[i] + '</a>';
			}
			if (i < BranchidList.length-1) {
				html += '<i class="fa fa-angle-right"></i>';
			}
			html += '</li>';
		}
		$('#BranchBreadcrumb').html(html);
	}
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
