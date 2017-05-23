var myurls = {
	'common.list' : 'image!list.action',
	'common.add' : 'image!add.action',
	'common.update' : 'image!update.action',
	'common.delete' : 'image!delete.action'
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
	/*
	if (CurBranchid == MyBranchid) {
		$('#BranchContentDiv .table-toolbar').css('display', 'block');
	} else {
		$('#BranchContentDiv .table-toolbar').css('display', 'none');
	}*/
}			

var CurrentImage;
function initMyTable() {
	$("#MyTable thead").css("display", "none");
	$("#MyTable tbody").css("display", "none");
	
	var imagehtml = '';
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

			if (aData.relate != null) {
				aData.relate.width = aData.relate.width == null ? 100: aData.relate.width;
				aData.relate.height = aData.relate.height == null ? 100: aData.relate.height;
				thumbwidth = aData.relate.width > aData.relate.height ? 50 : 50*aData.relate.width/aData.relate.height;
				thumbheight = aData.relate.height > aData.relate.width ? 50 : 50*aData.relate.height/aData.relate.width;
				imagehtml += '<a class="fancybox" href="/pixsigdata' + aData.relate.filepath + '" title="' + aData.relate.name + '">';
				imagehtml += '<div id="RelateThumb" class="thumbs">';
				imagehtml += '<img src="/pixsigdata' + aData.relate.thumbnail + '" class="imgthumb" width="100%" alt="' + aData.relate.name + '" thumbwidth="' + thumbwidth + '" thumbheight="' + thumbheight + '"/>';
				imagehtml += '</div>';
				imagehtml += '</a>';
			}

			imagehtml += '</div>';
			
			imagehtml += '<h6 class="pixtitle">' + aData.name + '<br>';
			var filesize = parseInt(aData.size / 1024);
			imagehtml += '(' + aData.imageid + ') ' + transferIntToComma(filesize) + ' KB</h6>';
			imagehtml += '</div>';
			
			if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
				imagehtml += '</div>';
				if ((iDisplayIndex+1) != $('#MyTable').dataTable().fnGetData().length) {
					imagehtml += '<hr/>';
				}
				$('#MediaContainer').append(imagehtml);
			}

			return nRow;
		},
		'fnDrawCallback': function(oSettings, json) {
			$('#MyTable #ImageThumb').each(function(i) {
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
			$(".fancybox").fancybox({
				openEffect	: 'none',
				closeEffect	: 'none',
				closeBtn : false,
			});
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':CurBranchid });
			aoData.push({'name':'folderid','value':CurFolderid });
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
		CurrentImage = $('#MyTable').dataTable().fnGetData(index);
		bootbox.confirm(common.tips.remove + CurrentImage.name, function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : myurls['common.delete'],
					cache: false,
					data : {
						'image.imageid': CurrentImage.imageid
					},
					success : function(data, status) {
						if (data.errorcode == 0) {
							refreshMyTable();
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
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});

	}
	
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	FormValidateOption.rules['image.name'] = {};
	FormValidateOption.rules['image.name']['required'] = true;
	FormValidateOption.rules['image.name']['minlength'] = 2;
	FormValidateOption.submitHandler = function(form) {
		$('#MyEditForm input[name="image.folderid"]').attr('value', $("#EditFormFolderTree").jstree('get_selected', false)[0]);
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
				console.log('failue');
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
		CurrentImage = $('#MyTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in CurrentImage) {
			formdata['image.' + name] = CurrentImage[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', myurls['common.update']);
		currentEditFolderid = CurrentImage.folderid;
		createEditFolderTree(currentEditFolderTreeData);
		refreshRelateImageSelect();

		$('#MyEditModal').modal();
	});

}

function refreshRelateImageSelect(folderid) {
	$("#RelateImageSelect").select2({
		placeholder: common.tips.detail_select,
		minimumInputLength: 0,
		ajax: {
			url: 'image!list.action',
			type: 'GET',
			dataType: 'json',
			data: function (term, page) {
				return {
					sSearch: term,
					iDisplayStart: (page-1)*10,
					iDisplayLength: 10,
					folderid: folderid,
				};
			},
			results: function (data, page) {
				var more = (page * 10) < data.iTotalRecords; 
				return {
					results : $.map(data.aaData, function (item) { 
						return { 
							text:item.name, 
							id:item.imageid, 
							image:item, 
						};
					}),
					more: more
				};
			}
		},
		formatResult: function(data) {
			var width = 40;
			var height = 40 * data.image.height / data.image.width;
			if (data.image.width < data.image.height) {
				height = 40;
				width = 40 * data.image.width / data.image.height;
			}
			var html = '<span><img src="/pixsigdata' + data.image.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.image.name + '</span>'
			return html;
		},
		formatSelection: function(data) {
			var width = 30;
			var height = 30 * height / width;
			if (data.image.width < data.image.height) {
				height = 30;
				width = 30 * width / height;
			}
			var html = '<span><img src="/pixsigdata' + data.image.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/></span>'
			return html;
		},
		initSelection: function(element, callback) {
			if (CurrentImage != null && CurrentImage.relate != null) {
				callback({id: CurrentImage.relateid, text: CurrentImage.relate.name, image: CurrentImage.relate });
			}
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});
}


function initUploadModal() {
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

$.ajax({
	type : 'POST',
	url : 'folder!list.action',
	data : { },
	success : function(data, status) {
		if (data.errorcode == 0) {
			var folders = data.aaData;
			var folderid = folders[0].folderid;			
			var folderTreeDivData = [];
			createFolderTreeData(folders, folderTreeDivData);
			$('.foldertree').each(function() {
				$(this).jstree('destroy');
				$(this).jstree({
					'core' : {
						'multiple' : false,
						'data' : folderTreeDivData
					},
					'plugins' : ['unique', 'types'],
					'types' : {
						'default' : { 'icon' : 'fa fa-folder icon-state-warning icon-lg' }
					},
				});
				$(this).on('loaded.jstree', function() {
					$(this).jstree('select_node', folderid);
				});
				$(this).on('select_node.jstree', function(event, data) {
					folderid = data.instance.get_node(data.selected[0]).id;
					refreshRelateImageSelect(folderid);
				});
			});
		} else {
			bootbox.alert(common.tips.error + data.errormsg);
		}
	},
	error : function() {
		console.log('failue');
	}
});
function createFolderTreeData(folders, treeData) {
	if (folders == null) return;
	for (var i=0; i<folders.length; i++) {
		treeData[i] = {};
		treeData[i].id = folders[i].folderid;
		treeData[i].text = folders[i].name;
		treeData[i].state = {
			opened: true,
		}
		treeData[i].children = [];
		createFolderTreeData(folders[i].children, treeData[i].children);
	}
}
$('#RelateImageRemove').on('click', function(e) {
	$('#RelateImageSelect').select2('val', '');
	$('#RelateImageSelect').val('0');
	CurrentImage.relateid = 0;
	CurrentImage.relate = null;
});	
