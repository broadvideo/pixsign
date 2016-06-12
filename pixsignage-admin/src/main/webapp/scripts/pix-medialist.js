var myurls = {
	'common.list' : 'medialist!list.action',
	'common.add' : 'medialist!add.action',
	'common.update' : 'medialist!update.action',
	'common.delete' : 'medialist!delete.action',
	'medialist.dtllist' : 'medialist!dtllist.action',
	'medialist.dtlsync' : 'medialist!dtlsync.action',
	'video.list' : 'video!list.action',
	'image.list' : 'image!list.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
	if (CurBranchid == MyBranchid) {
		$('#BranchContentDiv .table-toolbar').css('display', 'block');
	} else {
		$('#BranchContentDiv .table-toolbar').css('display', 'none');
	}
}

function refreshTableFromBranchDropdown() {
	$('#IntVideoTable').dataTable()._fnAjaxUpdate();
	$('#ExtVideoTable').dataTable()._fnAjaxUpdate();
	$('#ImageTable').dataTable()._fnAjaxUpdate();
}

function initMyTable() {
	$('#MyTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' }, 
		                {'sTitle' : common.view.detail, 'mData' : 'medialistid', 'bSortable' : false, 'sWidth' : '75%' },
						{'sTitle' : '', 'mData' : 'medialistid', 'bSortable' : false, 'sWidth' : '5%' },
						{'sTitle' : '', 'mData' : 'medialistid', 'bSortable' : false, 'sWidth' : '5%' },
						{'sTitle' : '', 'mData' : 'medialistid', 'bSortable' : false, 'sWidth' : '5%' }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var listhtml = '';
			for (var i=0; i<aData.medialistdtls.length; i++) {
				var medialistdtl = aData.medialistdtls[i];
				if (i % 6 == 0) {
					listhtml += '<div class="row" >';
				}
				listhtml += '<div class="col-md-2 col-xs-2">';
				if (medialistdtl.objtype == 1) {
					listhtml += '<div class="thumbs">';
					if (medialistdtl.video.thumbnail == null) {
						listhtml += '<img src="../img/video.jpg" class="imgthumb" width="100%" alt="' + medialistdtl.video.name + '" />';
					} else {
						listhtml += '<img src="/pixsigdata' + medialistdtl.video.thumbnail + '" class="imgthumb" width="100%" alt="' + medialistdtl.video.name + '" />';
					}
					listhtml += '</div>';
					listhtml += '<h6 class="pixtitle">' + medialistdtl.video.name + '</h6>';
				} else if (medialistdtl.objtype == 2) {
					var thumbwidth = medialistdtl.image.width > medialistdtl.image.height? 100 : 100*medialistdtl.image.width/medialistdtl.image.height;
					listhtml += '<div class="thumbs">';
					listhtml += '<img src="/pixsigdata' + medialistdtl.image.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + medialistdtl.image.name + '" />';
					listhtml += '</div>';
					listhtml += '<h6 class="pixtitle">' + medialistdtl.image.name + '</h6>';
				}
				listhtml += '</div>';
				if ((i+1) % 6 == 0 || (i+1) == aData.medialistdtls.length) {
					listhtml += '</div>';
				}
			}
			$('td:eq(1)', nRow).html(listhtml);
			
			if (CurBranchid == MyBranchid) {
				$('td:eq(2)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-detail"><i class="fa fa-list-ul"></i> ' + common.view.detail + '</a>');
				$('td:eq(3)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
				$('td:eq(4)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
			} else {
				$('td:eq(2)', nRow).html('');
				$('td:eq(3)', nRow).html('');
				$('td:eq(4)', nRow).html('');
			}
			return nRow;
		},
		'fnDrawCallback': function(oSettings, json) {
			$('#MyTable .thumbs').each(function(i) {
				console.log($(this).parent().width());
				$(this).height($(this).parent().width());
			});
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':CurBranchid });
		}
	});

	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	$('#MyTable').css('width', '100%');

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
						'medialist.medialistid': currentItem['medialistid']
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
}

function initMyEditModal() {
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();

	FormValidateOption.rules['medialist.name'] = {};
	FormValidateOption.rules['medialist.name']['required'] = true;
	FormValidateOption.rules['medialist.name']['minlength'] = 2;
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

	$('body').on('click', '.pix-add', function(event) {
		var action = myurls['common.add'];
		refreshForm('MyEditForm');
		$('#MyEditForm').attr('action', action);
		$('#MyEditModal').modal();
	});			


	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in item) {
			formdata['medialist.' + name] = item[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', myurls['common.update']);
		$('#MyEditModal').modal();
	});
}

function initMedialistDtlModal() {
	var currentMedialistid = 0;
	var currentMedialist;
	var tempMedialistdtls;

	$('body').on('click', '.pix-detail', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		currentMedialist = $('#MyTable').dataTable().fnGetData(index);
		currentMedialistid = currentMedialist.medialistid;
		$('#MedialistDtlTable').dataTable().fnClearTable();

		$.ajax({
			type : 'GET',
			url : myurls['medialist.dtllist'],
			data : {'medialistid' : currentMedialistid},
			beforeSend: function ( xhr ) {
				Metronic.startPageLoading({animate: true});
			},
			success : function(data, status) {
				Metronic.stopPageLoading();
				if (data.errorcode == 0) {
					tempMedialistdtls = data.aaData;
					for (var i=0; i<tempMedialistdtls.length; i++) {
						var medialistdtl = tempMedialistdtls[i];
						var thumbwidth = 100;
						var thumbnail = '';
						var thumbhtml = '';
						var medianame = '';
						if (medialistdtl.objtype == 1 && medialistdtl.video.type == 1) {
							mediatype = common.view.intvideo;
							medianame = medialistdtl.video.name;
							if (medialistdtl.video.thumbnail == null) {
								thumbnail = '../img/video.jpg';
							} else {
								thumbnail = '/pixsigdata' + medialistdtl.video.thumbnail;
							}
						} else if (medialistdtl.objtype == 1 && medialistdtl.video.type == 2) {
							mediatype = common.view.extvideo;
							medianame = medialistdtl.video.name;
							if (medialistdtl.video.thumbnail == null) {
								thumbnail = '../img/video.jpg';
							} else {
								thumbnail = '/pixsigdata' + medialistdtl.video.thumbnail;
							}
						} else if (medialistdtl.objtype == 2) {
							mediatype = common.view.image;
							medianame = medialistdtl.image.name;
							thumbwidth = medialistdtl.image.width > medialistdtl.image.height? 100 : 100*medialistdtl.image.width/medialistdtl.image.height;
							thumbnail = '/pixsigdata' + medialistdtl.image.thumbnail;
						} else {
							mediatype = common.view.unknown;
						}
						if (thumbnail != '') {
							thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + medianame + '"></div>';
						}
						$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, mediatype, thumbhtml, medianame, 0, 0, 0]);
					}
					
					$('#MedialistDtlModal').modal();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				Metronic.stopPageLoading();
				bootbox.alert(common.tips.error);
			}
		});
	});

	$('#MedialistDtlModal').on('shown.bs.modal', function (e) {
		$('#IntVideoTable').dataTable()._fnAjaxUpdate();
	})

	//本地视频table初始化
	$('#IntVideoTable thead').css('display', 'none');
	$('#IntVideoTable tbody').css('display', 'none');	
	var intvideohtml = '';
	$('#IntVideoTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 18, 36, 54, 72 ],
						  [ 18, 36, 54, 72 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : 'video!list.action',
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : common.view.filename, 'mData' : 'filename', 'bSortable' : false }, 
						{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false }, 
						{'sTitle' : common.view.operation, 'mData' : 'videoid', 'bSortable' : false }],
		'iDisplayLength' : 18,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnPreDrawCallback': function (oSettings) {
			if ($('#IntVideoContainer').length < 1) {
				$('#IntVideoTable').append('<div id="IntVideoContainer"></div>');
			}
			$('#IntVideoContainer').html(''); 
			return true;
		},
		'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			if (iDisplayIndex % 6 == 0) {
				intvideohtml = '';
				intvideohtml += '<div class="row" >';
			}
			intvideohtml += '<div class="col-md-2 col-xs-2">';

			intvideohtml += '<div id="ThumbContainer" style="position:relative">';
			var thumbnail = '../img/video.jpg';
			var thumbwidth = 100;
			if (aData.thumbnail != null) {
				thumbnail = '/pixsigdata' + aData.thumbnail;
				thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			}
			intvideohtml += '<div id="VideoThumb" class="thumbs">';
			intvideohtml += '<img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
			if (aData.relate != null) {
				var thumbnail = '../img/video.jpg';
				var thumbwidth = 50;
				var thumbheight = 50;
				if (aData.relate.thumbnail != null) {
					thumbnail = '/pixsigdata' + aData.relate.thumbnail;
					aData.relate.width = aData.relate.width == null ? 100: aData.relate.width;
					aData.relate.height = aData.relate.height == null ? 100: aData.relate.height;
					thumbwidth = aData.relate.width > aData.relate.height ? 50 : 50*aData.relate.width/aData.relate.height;
					thumbheight = aData.relate.height > aData.relate.width ? 50 : 50*aData.relate.height/aData.relate.width;
				}
				intvideohtml += '<div id="RelateThumb">';
				intvideohtml += '<img src="' + thumbnail + '" width="100%" alt="' + aData.relate.name + '" thumbwidth="' + thumbwidth + '" thumbheight="' + thumbheight + '"/>';
				intvideohtml += '</div>';
			}
			intvideohtml += '<div class="mask">';
			intvideohtml += '<div>';
			intvideohtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
			intvideohtml += '<a class="btn default btn-sm green pix-medialistdtl-intvideo-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
			intvideohtml += '</div>';
			intvideohtml += '</div>';
			intvideohtml += '</div>';

			intvideohtml += '</div>';

			intvideohtml += '</div>';
			if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#IntVideoTable').dataTable().fnGetData().length) {
				intvideohtml += '</div>';
				if ((iDisplayIndex+1) != $('#IntVideoTable').dataTable().fnGetData().length) {
					intvideohtml += '<hr/>';
				}
				$('#IntVideoContainer').append(intvideohtml);
			}
			return nRow;
		},
		'fnDrawCallback': function(oSettings, json) {
			$('#IntVideoContainer .thumbs').each(function(i) {
				$(this).height($(this).parent().width());
			});
			$('#IntVideoContainer .mask').each(function(i) {
				$(this).height($(this).parent().parent().width() + 2);
			});
			$('#IntVideoContainer #RelateThumb').each(function(i) {
				var thumbwidth = $(this).find('img').attr('thumbwidth');
				var thumbheight = $(this).find('img').attr('thumbheight');
				$(this).css('position', 'absolute');
				$(this).css('left', (100-thumbwidth) + '%');
				$(this).css('top', '0');
				$(this).css('width', thumbwidth + '%');
			});
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':DropdownBranchid });
			aoData.push({'name':'type','value':1 });
		}
	});
	$('#IntVideoTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
	$('#IntVideoTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
	$('#IntVideoTable').css('width', '100%');

	//引入视频table初始化
	$('#ExtVideoTable thead').css('display', 'none');
	$('#ExtVideoTable tbody').css('display', 'none');	
	var extvideohtml = '';
	$('#ExtVideoTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 18, 36, 54, 72 ],
						  [ 18, 36, 54, 72 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : 'video!list.action',
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : common.view.filename, 'mData' : 'filename', 'bSortable' : false }, 
						{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false }, 
						{'sTitle' : common.view.operation, 'mData' : 'videoid', 'bSortable' : false }],
		'iDisplayLength' : 18,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnPreDrawCallback': function (oSettings) {
			if ($('#ExtVideoContainer').length < 1) {
				$('#ExtVideoTable').append('<div id="ExtVideoContainer"></div>');
			}
			$('#ExtVideoContainer').html(''); 
			return true;
		},
		'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			if (iDisplayIndex % 6 == 0) {
				extvideohtml = '';
				extvideohtml += '<div class="row" >';
			}
			extvideohtml += '<div class="col-md-2 col-xs-2">';

			extvideohtml += '<div id="ThumbContainer" style="position:relative">';
			var thumbnail = '../img/video.jpg';
			var thumbwidth = 100;
			if (aData.thumbnail != null) {
				thumbnail = '/pixsigdata' + aData.thumbnail;
				thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			}
			extvideohtml += '<div id="VideoThumb" class="thumbs">';
			extvideohtml += '<img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
			if (aData.relate != null) {
				var thumbnail = '../img/video.jpg';
				var thumbwidth = 50;
				var thumbheight = 50;
				if (aData.relate.thumbnail != null) {
					thumbnail = '/pixsigdata' + aData.relate.thumbnail;
					aData.relate.width = aData.relate.width == null ? 100: aData.relate.width;
					aData.relate.height = aData.relate.height == null ? 100: aData.relate.height;
					thumbwidth = aData.relate.width > aData.relate.height ? 50 : 50*aData.relate.width/aData.relate.height;
					thumbheight = aData.relate.height > aData.relate.width ? 50 : 50*aData.relate.height/aData.relate.width;
				}
				extvideohtml += '<div id="RelateThumb">';
				extvideohtml += '<img src="' + thumbnail + '" width="100%" alt="' + aData.relate.name + '" thumbwidth="' + thumbwidth + '" thumbheight="' + thumbheight + '"/>';
				extvideohtml += '</div>';
			}
			extvideohtml += '<div class="mask">';
			extvideohtml += '<div>';
			extvideohtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
			extvideohtml += '<a class="btn default btn-sm green pix-medialistdtl-extvideo-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
			extvideohtml += '</div>';
			extvideohtml += '</div>';
			extvideohtml += '</div>';

			extvideohtml += '</div>';

			extvideohtml += '</div>';
			if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#ExtVideoTable').dataTable().fnGetData().length) {
				extvideohtml += '</div>';
				if ((iDisplayIndex+1) != $('#ExtVideoTable').dataTable().fnGetData().length) {
					extvideohtml += '<hr/>';
				}
				$('#ExtVideoContainer').append(extvideohtml);
			}
			return nRow;
		},
		'fnDrawCallback': function(oSettings, json) {
			$('#ExtVideoContainer .thumbs').each(function(i) {
				$(this).height($(this).parent().width());
			});
			$('#ExtVideoContainer .mask').each(function(i) {
				$(this).height($(this).parent().parent().width() + 2);
			});
			$('#ExtVideoContainer #RelateThumb').each(function(i) {
				var thumbwidth = $(this).find('img').attr('thumbwidth');
				var thumbheight = $(this).find('img').attr('thumbheight');
				$(this).css('position', 'absolute');
				$(this).css('left', (100-thumbwidth) + '%');
				$(this).css('top', '0');
				$(this).css('width', thumbwidth + '%');
			});
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':DropdownBranchid });
			aoData.push({'name':'type','value':2 });
		}
	});
	$('#ExtVideoTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
	$('#ExtVideoTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
	$('#ExtVideoTable').css('width', '100%');

	//图片table初始化
	$('#ImageTable thead').css('display', 'none');
	$('#ImageTable tbody').css('display', 'none');	
	var imagehtml = '';
	$('#ImageTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 18, 36, 54, 72 ],
						  [ 18, 36, 54, 72 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : 'image!list.action',
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : common.view.filename, 'mData' : 'filename', 'bSortable' : false }, 
						{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false }, 
						{'sTitle' : common.view.operation, 'mData' : 'imageid', 'bSortable' : false }],
		'iDisplayLength' : 18,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnPreDrawCallback': function (oSettings) {
			if ($('#ImageContainer').length < 1) {
				$('#ImageTable').append('<div id="ImageContainer"></div>');
			}
			$('#ImageContainer').html(''); 
			return true;
		},
		'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			if (iDisplayIndex % 6 == 0) {
				imagehtml = '';
				imagehtml += '<div class="row" >';
			}
			imagehtml += '<div class="col-md-2 col-xs-2">';
			
			imagehtml += '<div class="thumbs">';
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			imagehtml += '<img src="/pixsigdata' + aData.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
			imagehtml += '<div class="mask">';
			imagehtml += '<div>';
			imagehtml += '<h6 style="color:white;" class="pixtitle">' + aData.name + '</h6>';
			imagehtml += '<a class="btn default btn-sm green pix-medialistdtl-image-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
			imagehtml += '</div>';
			imagehtml += '</div>';
			imagehtml += '</div>';

			imagehtml += '</div>';
			if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#ImageTable').dataTable().fnGetData().length) {
				imagehtml += '</div>';
				if ((iDisplayIndex+1) != $('#ImageTable').dataTable().fnGetData().length) {
					imagehtml += '<hr/>';
				}
				$('#ImageContainer').append(imagehtml);
			}
			return nRow;
		},
		'fnDrawCallback': function(oSettings, json) {
			$('#ImageContainer .thumbs').each(function(i) {
				$(this).height($(this).parent().width());
			});
			$('#ImageContainer .mask').each(function(i) {
				$(this).height($(this).parent().height() + 2);
			});
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':DropdownBranchid });
		}
	});
	$('#ImageTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
	$('#ImageTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
	$('#ImageTable').css('width', '100%');

	$('#nav_tab1').click(function(event) {
		$('#IntVideoTable').dataTable()._fnAjaxUpdate();
	});
	$('#nav_tab2').click(function(event) {
		$('#ExtVideoTable').dataTable()._fnAjaxUpdate();
	});
	$('#nav_tab3').click(function(event) {
		$('#ImageTable').dataTable()._fnAjaxUpdate();
	});

	//播放明细Table初始化
	$('#MedialistDtlTable').dataTable({
		'sDom' : 't',
		'iDisplayLength' : -1,
		'aoColumns' : [ {'sTitle' : '', 'bSortable' : false, 'sWidth' : '40px' }, 
						{'sTitle' : '', 'bSortable' : false, 'sWidth' : '60px' }, 
						{'sTitle' : '', 'bSortable' : false, 'sWidth' : '60px' }, 
						{'sTitle' : '', 'bSortable' : false, 'sClass': 'autowrap' }, 
						{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' },
						{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' },
						{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' }],
		'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
		'oLanguage' : { 'sZeroRecords' : common.view.empty,
						'sEmptyTable' : common.view.empty }, 
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(4)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-medialistdtl-up"><i class="fa fa-arrow-up"></i></button>');
			$('td:eq(5)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-medialistdtl-down"><i class="fa fa-arrow-down"></i></button>');
			$('td:eq(6)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn red btn-xs pix-medialistdtl-delete"><i class="fa fa-trash-o"></i></button>');
			return nRow;
		}
	});

	//增加本地视频到播放明细Table
	$('body').on('click', '.pix-medialistdtl-intvideo-add', function(event) {
		var rowIndex = $(event.target).attr("data-id");
		if (rowIndex == undefined) {
			rowIndex = $(event.target).parent().attr('data-id');
		}
		var data = $('#IntVideoTable').dataTable().fnGetData(rowIndex);
		var medialistdtl = {};
		medialistdtl.medialistdtlid = 0;
		medialistdtl.medialistid = currentMedialist.medialistid;
		medialistdtl.objtype = '1';
		medialistdtl.objid = data.videoid;
		medialistdtl.sequence = tempMedialistdtls.length + 1;
		tempMedialistdtls[tempMedialistdtls.length] = medialistdtl;

		var thumbnail = '';
		if (data.thumbnail == null) {
			thumbnail = '../img/video.jpg';
		} else {
			thumbnail = '/pixsigdata' + data.thumbnail;
		}
		var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="100%" alt="' + data.name + '"></div>';
		$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, common.view.intvideo, thumbhtml, data.name, 0, 0, 0]);
	});

	//增加引入视频到播放明细Table
	$('body').on('click', '.pix-medialistdtl-extvideo-add', function(event) {
		var rowIndex = $(event.target).attr("data-id");
		if (rowIndex == undefined) {
			rowIndex = $(event.target).parent().attr('data-id');
		}
		var data = $('#ExtVideoTable').dataTable().fnGetData(rowIndex);
		var medialistdtl = {};
		medialistdtl.medialistdtlid = 0;
		medialistdtl.medialistid = currentMedialist.medialistid;
		medialistdtl.objtype = '1';
		medialistdtl.objid = data.videoid;
		medialistdtl.sequence = tempMedialistdtls.length + 1;
		tempMedialistdtls[tempMedialistdtls.length] = medialistdtl;

		var thumbnail = '';
		if (data.thumbnail == null) {
			thumbnail = '../img/video.jpg';
		} else {
			thumbnail = '/pixsigdata' + data.thumbnail;
		}
		var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="100%" alt="' + data.name + '"></div>';
		$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, common.view.extvideo, thumbhtml, data.name, 0, 0, 0]);
	});

	//增加图片到播放明细Table
	$('body').on('click', '.pix-medialistdtl-image-add', function(event) {
		var rowIndex = $(event.target).attr("data-id");
		if (rowIndex == undefined) {
			rowIndex = $(event.target).parent().attr('data-id');
		}
		var data = $('#ImageTable').dataTable().fnGetData(rowIndex);
		var medialistdtl = {};
		medialistdtl.medialistdtlid = 0;
		medialistdtl.medialistid = currentMedialist.medialistid;
		medialistdtl.objtype = '2';
		medialistdtl.objid = data.imageid;
		medialistdtl.sequence = tempMedialistdtls.length + 1;
		tempMedialistdtls[tempMedialistdtls.length] = medialistdtl;

		var thumbwidth = data.width > data.height? 100 : 100*data.width/data.height;
		var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="/pixsigdata' + data.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + data.name + '"></div>';
		$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, common.view.image, thumbhtml, data.name, 0, 0, 0]);
	});


	//删除播放明细列表某行
	$('body').on('click', '.pix-medialistdtl-delete', function(event) {
		var rowIndex = $(event.target).attr("data-id");
		if (rowIndex == undefined) {
			rowIndex = $(event.target).parent().attr('data-id');
		}
		for (var i=rowIndex; i<$('#MedialistDtlTable').dataTable().fnSettings().fnRecordsDisplay(); i++) {
			var data = $('#MedialistDtlTable').dataTable().fnGetData(i);
			$('#MedialistDtlTable').dataTable().fnUpdate(i, parseInt(i), 0);
		}
		$('#MedialistDtlTable').dataTable().fnDeleteRow(rowIndex);
		
		for (var i=rowIndex; i<tempMedialistdtls.length; i++) {
			tempMedialistdtls[i].sequence = i;
		}
		tempMedialistdtls.splice(rowIndex, 1);
	});

	//上移播放明细列表某行
	$('body').on('click', '.pix-medialistdtl-up', function(event) {
		var rowIndex = $(event.target).attr('data-id');
		if (rowIndex == undefined) {
			rowIndex = $(event.target).parent().attr('data-id');
		}
		if (rowIndex == 0) {
			return;
		}
		rowIndex = parseInt(rowIndex);
		var movedDta = $('#MedialistDtlTable').dataTable().fnGetData(rowIndex).slice(0);
		var prevData = $('#MedialistDtlTable').dataTable().fnGetData(rowIndex-1).slice(0);
		$('#MedialistDtlTable').dataTable().fnUpdate(prevData[1], rowIndex, 1);
		$('#MedialistDtlTable').dataTable().fnUpdate(prevData[2], rowIndex, 2);
		$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[1], rowIndex-1, 1);
		$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[2], rowIndex-1, 2);
		
		var temp = tempMedialistdtls[rowIndex];
		tempMedialistdtls[rowIndex] =  tempMedialistdtls[rowIndex-1];
		tempMedialistdtls[rowIndex].sequence = rowIndex+1;
		tempMedialistdtls[rowIndex-1] = temp;
		tempMedialistdtls[rowIndex-1].sequence = rowIndex;
	});

	//下移播放明细列表某行
	$('body').on('click', '.pix-medialistdtl-down', function(event) {
		var rowIndex = $(event.target).attr('data-id');
		if (rowIndex == undefined) {
			rowIndex = $(event.target).parent().attr('data-id');
		}
		if (rowIndex == $('#MedialistDtlTable').dataTable().fnSettings().fnRecordsDisplay() - 1) {
			return;
		}
		rowIndex = parseInt(rowIndex);
		var movedDta = $('#MedialistDtlTable').dataTable().fnGetData(rowIndex).slice(0);
		var nextData = $('#MedialistDtlTable').dataTable().fnGetData(rowIndex+1).slice(0);
		$('#MedialistDtlTable').dataTable().fnUpdate(nextData[1], rowIndex, 1);
		$('#MedialistDtlTable').dataTable().fnUpdate(nextData[2], rowIndex, 2);
		$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[1], rowIndex+1, 1);
		$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[2], rowIndex+1, 2);
		
		var temp = tempMedialistdtls[rowIndex];
		tempMedialistdtls[rowIndex] = tempMedialistdtls[rowIndex+1];
		tempMedialistdtls[rowIndex].sequence = rowIndex+1;
		tempMedialistdtls[rowIndex+1] = temp;
		tempMedialistdtls[rowIndex+1].sequence = rowIndex+2;
	});

	$('[type=submit]', $('#MedialistDtlModal')).on('click', function(event) {
		$.ajax({
			type : 'POST',
			url : myurls['medialist.dtlsync'],
			data : '{"medialist":' + $.toJSON(currentMedialist) + ', "medialistdtls":' + $.toJSON(tempMedialistdtls) + '}',
			dataType : 'json',
			contentType : 'application/json;charset=utf-8',
			beforeSend: function ( xhr ) {
				Metronic.startPageLoading({animate: true});
			},
			success : function(data, status) {
				Metronic.stopPageLoading();
				$('#MedialistDtlModal').modal('hide');
				if (data.errorcode == 0) {
					bootbox.alert(common.tips.success);
					$('#MyTable').dataTable()._fnAjaxUpdate();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				Metronic.stopPageLoading();
				bootbox.alert(common.tips.error);
			}
		});
	});
}		
