var submitflag = false;

var CurrentObj;
var CurrentId;
var CurrentZone;

$('#MyTable thead').css('display', 'none');
$('#MyTable tbody').css('display', 'none');
var pagehtml = '';
var oTable = $('#MyTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 16, 36, 72, 108 ],
						[ 16, 36, 72, 108 ] 
						],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'page!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.ratio, 'mData' : 'ratio', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'pageid', 'bSortable' : false }],
	'iDisplayLength' : 16,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#PageContainer').length < 1) {
			$('#MyTable').append('<div id="PageContainer"></div>');
		}
		$('#PageContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 4 == 0) {
			pagehtml = '';
			pagehtml += '<div class="row" >';
		}
		pagehtml += '<div class="col-md-3 col-xs-3">';
		pagehtml += '<h3>' + aData.name + '</h3>';
		if (aData.ratio == 1) {
			pagehtml += '<h6><span class="label label-sm label-info">' + common.view.ratio_1 + '</span></h6>';
		} else if (aData.ratio == 2) {
			pagehtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_2 + '</span></h6>';
		}

		pagehtml += '<a href="javascript:;" pageid="' + aData.pageid + '" class="fancybox">';
		pagehtml += '<div class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			pagehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		}
		pagehtml += '</div></a>';
		
		pagehtml += '<div privilegeid="101010">';
		pagehtml += '<a href="javascript:;" pageid="' + aData.pageid + '" class="btn default btn-xs green pix-page"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
		pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
		pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
		pagehtml += '</div>';

		pagehtml += '</div>';
		if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
			pagehtml += '</div>';
			if ((iDisplayIndex+1) != $('#MyTable').dataTable().fnGetData().length) {
				pagehtml += '<hr/>';
			}
			$('#PageContainer').append(pagehtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('.thumbs').each(function(i) {
			$(this).width($(this).parent().closest('div').width());
			$(this).height($(this).parent().closest('div').width());
		});
		$('.fancybox').each(function(index,item) {
			$(this).click(function() {
				var pageid = $(this).attr('pageid');
				$.ajax({
					type : 'GET',
					url : 'page!get.action',
					data : {pageid: pageid},
					success : function(data, status) {
						if (data.errorcode == 0) {
							$.fancybox({
								openEffect	: 'none',
								closeEffect	: 'none',
								closeBtn : false,
						        padding : 0,
						        content: '<div id="PagePreview"></div>',
						    });
							redrawPagePreview($('#PagePreview'), data.page, 800);
						} else {
							bootbox.alert(common.tips.error + data.errormsg);
						}
					},
					error : function() {
						console.log('failue');
					}
				});
			    return false;
			})
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'touchflag','value':'0' });
	},
});
jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').select2();

$('#TemplateTable thead').css('display', 'none');
$('#TemplateTable tbody').css('display', 'none');
var templatehtml = '';
$('#TemplateTable').dataTable({
	'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 18, 30, 48, 96 ],
					  [ 18, 30, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'template!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'templateid', 'bSortable' : false }],
	'iDisplayLength' : 12,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#TemplateContainer').length < 1) {
			$('#TemplateTable').append('<div id="TemplateContainer"></div>');
		}
		$('#TemplateContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 4 == 0) {
			templatehtml = '';
			templatehtml += '<div class="row" >';
		}
		templatehtml += '<div class="col-md-3 col-xs-3">';
		templatehtml += '<a href="javascript:;" templateid="' + aData.templateid + '" class="fancybox">';
		templatehtml += '<div class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			templatehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		}
		templatehtml += '</div></a>';
		templatehtml += '<label class="radio-inline">';
		if (iDisplayIndex == 0) {
			templatehtml += '<input type="radio" name="page.templateid" value="' + aData.templateid + '" checked>';
		} else {
			templatehtml += '<input type="radio" name="page.templateid" value="' + aData.templateid + '">';
		}
		templatehtml += aData.name + '</label>';

		templatehtml += '</div>';
		if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#TemplateTable').dataTable().fnGetData().length) {
			templatehtml += '</div>';
			if ((iDisplayIndex+1) != $('#TemplateTable').dataTable().fnGetData().length) {
				templatehtml += '<hr/>';
			}
			$('#TemplateContainer').append(templatehtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#TemplateContainer .thumbs').each(function(i) {
			console.log($(this).parent().closest('div').width());
			$(this).width($(this).parent().closest('div').width());
			$(this).height($(this).parent().closest('div').width());
		});
		$('#TemplateContainer .fancybox').each(function(index,item) {
			$(this).click(function() {
				var templateid = $(this).attr('templateid');
				$.ajax({
					type : 'GET',
					url : 'template!get.action',
					data : {templateid: templateid},
					success : function(data, status) {
						if (data.errorcode == 0) {
							$.fancybox({
								openEffect	: 'none',
								closeEffect	: 'none',
								closeBtn : false,
						        padding : 0,
						        content: '<div id="TemplatePreview"></div>',
						    });
							redrawTemplatePreview($('#TemplatePreview'), data.template, 800, 1);
						} else {
							bootbox.alert(common.tips.error + data.errormsg);
						}
					},
					error : function() {
						console.log('failue');
					}
				});
			    return false;
			})
		});
	},
	'fnServerParams': function(aoData) {
		var templateflag = $('#MyEditForm input[name="templateflag"]:checked').val();
		var ratio = $('select[name="page.ratio"]').val();
		aoData.push({'name':'templateflag','value':templateflag });
		aoData.push({'name':'ratio','value':ratio });
	}
});
jQuery('#TemplateTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#TemplateTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#TemplateTable_wrapper .dataTables_length select').select2();

function refreshTemplate() {
	$('#MyEditForm input[name="page.templateid"]').val('0');
	var templateflag = $('#MyEditForm input[name="templateflag"]:checked').val();
	if (templateflag == 0) {
		$('.template-ctrl').css('display', 'none');
	} else {
		$('.template-ctrl').css('display', '');
		$('#TemplateTable').dataTable().fnDraw(true);
	}
}

OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
FormValidateOption.rules['page.name'] = {};
FormValidateOption.rules['page.name']['required'] = true;
FormValidateOption.submitHandler = function(form) {
	$.ajax({
		type : 'POST',
		url : $('#MyEditForm').attr('action'),
		data : $('#MyEditForm').serialize(),
		success : function(data, status) {
			if (data.errorcode == 0) {
				$('#MyEditModal').modal('hide');
				bootbox.alert(common.tips.success);
				$('#MyTable').dataTable().fnDraw(true);
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

$('#MyEditModal').on('shown.bs.modal', function (e) {
	refreshTemplate();
})

$('#MyEditForm input[name="templateflag"]').change(function(e) {
	refreshTemplate();
});

$('#MyEditForm select[name="page.ratio"]').on('change', function(e) {
	refreshTemplate();
});	

$('body').on('click', '.pix-add', function(event) {
	refreshForm('MyEditForm');
	$('#MyEditForm').attr('action', 'page!add.action');
	$('.hide-update').css('display', 'block');
	CurrentObj = null;
	CurrentId = 0;
	$('#MyEditModal').modal();
});			


$('body').on('click', '.pix-update', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentObj = $('#MyTable').dataTable().fnGetData(index);
	CurrentId = CurrentObj.pageid;

	var formdata = new Object();
	for (var name in CurrentObj) {
		formdata['page.' + name] = CurrentObj[name];
	}
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', 'page!update.action');
	$('.hide-update').css('display', 'none');
	$('#MyEditModal').modal();
});

$('body').on('click', '.pix-sync', function(event) {
	var target = $(event.target);
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		target = $(event.target).parent();
		index = $(event.target).parent().attr('data-id');
	}
	CurrentObj = $('#MyTable').dataTable().fnGetData(index);
	CurrentId = CurrentObj.pageid;
	bootbox.confirm(common.tips.synclayout, function(result) {
		if (result == true) {
			$.ajax({
				type : 'GET',
				url : 'page!sync.action',
				cache: false,
				data : {
					pageid: CurrentId,
				},
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				beforeSend: function ( xhr ) {
					Metronic.startPageLoading({animate: true});
				},
				success : function(data, status) {
					Metronic.stopPageLoading();
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					Metronic.stopPageLoading();
					console.log('failue');
				}
			});				
		}
	});
});

$('body').on('click', '.pix-delete', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentObj = $('#MyTable').dataTable().fnGetData(index);
	CurrentId = CurrentObj.pageid;
	bootbox.confirm(common.tips.remove + CurrentObj.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : 'page!delete.action',
				cache: false,
				data : {
					'page.pageid': CurrentId
				},
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#MyTable').dataTable()._fnAjaxUpdate();
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


$('body').on('click', '.pix-page', function(event) {
	var pageid = $(event.target).attr('pageid');
	if (pageid == undefined) {
		pageid = $(event.target).parent().attr('pageid');
	}
	$.ajax({
		type : 'GET',
		url : 'page!get.action',
		data : {pageid: pageid},
		success : function(data, status) {
			if (data.errorcode == 0) {
				CurrentObj = data.page;
				CurrentId = CurrentObj.pageid;
				CurrentZone = null;
				$('#PageModal').modal();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
});

$('[type=submit]', $('#PageModal')).on('click', function(event) {
	if (submitflag) {
		return;
	}
	submitflag = true;
	Metronic.blockUI({
		zIndex: 20000,
		animate: true
	});
	$('#snapshot_div').show();
	redrawPagePreview($('#snapshot_div'), CurrentObj, 1024);
	html2canvas($('#snapshot_div'), {
		onrendered: function(canvas) {
			//console.log(canvas.toDataURL());
			CurrentObj.snapshotdtl = canvas.toDataURL();
			$('#snapshot_div').hide();

			$.ajax({
				type : 'POST',
				url : 'page!design.action',
				data : '{"page":' + $.toJSON(CurrentObj) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					submitflag = false;
					Metronic.unblockUI();
					$('#PageModal').modal('hide');
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
						$('#MyTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					submitflag = false;
					Metronic.unblockUI();
					$('#PageModal').modal('hide');
					console.log('failue');
				}
			});
		}
	});
});
