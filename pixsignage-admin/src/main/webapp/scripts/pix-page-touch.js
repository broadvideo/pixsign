var submitflag = false;

var CurrentObj;
var CurrentSubObjs;
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
		var pagehtml = '';
		pagehtml += '<div class="row" >';
		pagehtml += '<div class="col-md-12 col-xs-12">';
		pagehtml += '<h3 class="pixtitle">' + aData.name + '</h3>';
		if (aData.ratio == 1) {
			pagehtml += '<h6><span class="label label-sm label-info">' + common.view.ratio_1 + '</span></h6>';
		} else if (aData.ratio == 2) {
			pagehtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_2 + '</span></h6>';
		}
		pagehtml += '<div privilegeid="101010">';
		pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm yellow pix-subpage-add"><i class="fa fa-plus"></i> ' + common.view.subpage + '</a>';
		pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
		//pagehtml += '<a href="page!export.action?pageid=' + aData.pageid + '" data-id="' + iDisplayIndex + '" class="btn default btn-sm green pix-export"><i class="fa fa-download"></i> ' + common.view.export + '</a>';
		pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a> </div>';
		pagehtml += '</div>';
		pagehtml += '</div>';

		pagehtml += '<div class="row" >';
		pagehtml += '<div class="col-md-4 col-xs-6">';
		pagehtml += '<a href="javascript:;" pageid="' + aData.pageid + '" class="fancybox">';
		pagehtml += '<div class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			pagehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		}
		pagehtml += '</div></a>';
		pagehtml += '<div privilegeid="101010">';
		pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-page"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
		pagehtml += '</div>';
		pagehtml += '</div>';
		pagehtml += '<div class="col-md-8 col-xs-6">';
		for (var i=0; i<aData.subpages.length; i++) {
			if (i % 4 == 0) {
				pagehtml += '<div class="row" >';
			}
			pagehtml += '<div class="col-md-3 col-xs-3">';
			pagehtml += '<h5 class="pixtitle">' + aData.subpages[i].name + '</h5>';
			pagehtml += '<a href="javascript:;" pageid="' + aData.subpages[i].pageid + '" sub-id="' + i + '" class="fancybox">';
			pagehtml += '<div class="thumbs">';
			if (aData.subpages[i].snapshot != null) {
				var subthumbwidth = aData.subpages[i].width > aData.subpages[i].height? 100 : 100*aData.subpages[i].width/aData.subpages[i].height;
				pagehtml += '<img src="/pixsigdata' + aData.subpages[i].snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + subthumbwidth + '%" />';
			}
			pagehtml += '</div></a>';
			pagehtml += '<div privilegeid="101010">';
			pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs blue pix-page"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
			pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
			pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
			pagehtml += '</div>';
			pagehtml += '</div>';
			if ((i+1) % 4 == 0 || (i+1) == aData.subpages.length) {
				pagehtml += '</div>';
			}
			
		}
		pagehtml += '</div>';
		pagehtml += '</div>';

		pagehtml += '<hr/>';
		$('#PageContainer').append(pagehtml);
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
		aoData.push({'name':'touchflag','value':'1' });
		aoData.push({'name':'homeflag','value':'1' });
	}
});
jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').select2();

$('#TemplateTable thead').css('display', 'none');
$('#TemplateTable tbody').css('display', 'none');
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
		var templatehtml = '';
		templatehtml += '<div class="row" >';
		templatehtml += '<div class="col-md-4 col-xs-6">';
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
		templatehtml += '<div class="col-md-8 col-xs-6">';
		for (var i=0; i<aData.subtemplates.length; i++) {
			if (i % 4 == 0) {
				templatehtml += '<div class="row" >';
			}
			templatehtml += '<div class="col-md-3 col-xs-3">';
			templatehtml += '<h5 class="pixtitle">' + aData.subtemplates[i].name + '</h5>';
			templatehtml += '<a href="javascript:;" templateid="' + aData.subtemplates[i].templateid + '" sub-id="' + i + '" class="fancybox">';
			templatehtml += '<div class="thumbs">';
			if (aData.subtemplates[i].snapshot != null) {
				var subthumbwidth = aData.subtemplates[i].width > aData.subtemplates[i].height? 100 : 100*aData.subtemplates[i].width/aData.subtemplates[i].height;
				templatehtml += '<img src="/pixsigdata' + aData.subtemplates[i].snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + subthumbwidth + '%" />';
			}
			templatehtml += '</div></a>';
			templatehtml += '</div>';
			if ((i+1) % 4 == 0 || (i+1) == aData.subtemplates.length) {
				templatehtml += '</div>';
			}
			
		}
		templatehtml += '</div>';
		templatehtml += '</div>';

		templatehtml += '<hr/>';
		$('#TemplateContainer').append(templatehtml);
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#TemplateContainer .thumbs').each(function(i) {
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
							redrawPagePreview($('#TemplatePreview'), data.template, 800);
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
		aoData.push({'name':'touchflag','value':'1' });
		aoData.push({'name':'homeflag','value':'1' });
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

$('#MyEditModal').on('shown.bs.modal', function (e) {
	refreshTemplate();
})

$('#MyEditForm input[name="templateflag"]').change(function(e) {
	refreshTemplate();
});

$('#MyEditForm select[name="page.ratio"]').on('change', function(e) {
	refreshTemplate();
});	

function refreshFromPageTable() {
	var width = 100/(CurrentSubObjs.length+1);
	var fromPageTableHtml = '';
	fromPageTableHtml += '<tr>';
	fromPageTableHtml += '<td style="padding: 0px 20px 0px 0px;" width="' + width + '%">';
	fromPageTableHtml += '<div class="thumbs" style="width:100px; height:100px;">';
	fromPageTableHtml += '</div></td>';
	for (var i=0; i<CurrentSubObjs.length; i++) {
		var frompage = CurrentSubObjs[i];
		fromPageTableHtml += '<td style="padding: 0px 20px 0px 0px;" width="' + width + '%">';
		fromPageTableHtml += '<a href="javascript:;" frompageid="' + frompage.pageid + '" class="fancybox">';
		fromPageTableHtml += '<div class="thumbs" style="width:100px; height:100px;">';
		if (frompage.snapshot != null) {
			var thumbwidth = frompage.width > frompage.height? 100 : 100*frompage.width/frompage.height;
			fromPageTableHtml += '<img src="/pixsigdata' + frompage.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + frompage.name + '" />';
		}
		fromPageTableHtml += '</div></a></td>';
	}
	fromPageTableHtml += '</tr>';
	fromPageTableHtml += '<tr>';
	fromPageTableHtml += '<td>';
	fromPageTableHtml += '<label class="radio-inline">';
	fromPageTableHtml += '<input type="radio" name="frompageid" value="0" checked>';
	fromPageTableHtml += common.view.blank + '</label>';
	fromPageTableHtml += '</td>';
	for (var i=0; i<CurrentSubObjs.length; i++) {
		var frompage = CurrentSubObjs[i];
		fromPageTableHtml += '<td>';
		fromPageTableHtml += '<label class="radio-inline">';
		fromPageTableHtml += '<input type="radio" name="frompageid" value="' + frompage.pageid + '">';
		fromPageTableHtml += frompage.name + '</label>';
		fromPageTableHtml += '</td>';
	}
	fromPageTableHtml += '</tr>';
	$('#FromPageTable').html(fromPageTableHtml);
	$('#FromPageTable').width(120 * (CurrentSubObjs.length+1));

	$('#FromPageTable .fancybox').each(function(index,item) {
		$(this).click(function() {
			var pageid = $(this).attr('frompageid');
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
}

OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
var validateOption1 = {};
$.extend(validateOption1, FormValidateOption);
validateOption1.rules['page.name'] = {};
validateOption1.rules['page.name']['required'] = true;
validateOption1.submitHandler = function(form) {
	$.ajax({
		type : 'POST',
		url : $('#MyEditForm').attr('action'),
		data : $('#MyEditForm').serialize(),
		success : function(data, status) {
			if (data.errorcode == 0) {
				$('#MyEditModal').modal('hide');
				bootbox.alert(common.tips.success);
				$('#MyTable').dataTable()._fnAjaxUpdate();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
};
$('#MyEditForm').validate(validateOption1);
$('[type=submit]', $('#MyEditModal')).on('click', function(event) {
	if ($('#MyEditForm').valid()) {
		$('#MyEditForm').submit();
	}
});

var validateOption2 = {};
$.extend(validateOption2, FormValidateOption);
validateOption2.rules['page.name'] = {};
validateOption2.rules['page.name']['required'] = true;
validateOption2.rules['page.homeidletime'] = {};
validateOption2.rules['page.homeidletime']['required'] = true;
validateOption2.rules['page.homeidletime']['number'] = true;
validateOption2.submitHandler = function(form) {
	$.ajax({
		type : 'POST',
		url : $('#SubpageForm').attr('action'),
		data : $('#SubpageForm').serialize(),
		success : function(data, status) {
			if (data.errorcode == 0) {
				$('#SubpageModal').modal('hide');
				bootbox.alert(common.tips.success);
				$('#MyTable').dataTable()._fnAjaxUpdate();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
};
$('#SubpageForm').validate(validateOption2);
$('[type=submit]', $('#SubpageModal')).on('click', function(event) {
	if ($('#SubpageForm').valid()) {
		$('#SubpageForm').submit();
	}
});
$('body').on('click', '.pix-add', function(event) {
	refreshForm('MyEditForm');
	$('#MyEditForm').attr('action', 'page!add.action');
	$('.hide-update').css('display', 'block');
	CurrentObj = null;
	CurrentId = 0;
	$('#MyEditModal').modal();
});			
$('body').on('click', '.pix-subpage-add', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentObj = $('#MyTable').dataTable().fnGetData(index);
	CurrentSubObjs = CurrentObj.subpages;
	var formdata = new Object();
	formdata['page.name'] = '';
	formdata['page.homeidletime'] = '0';
	formdata['page.homepageid'] = CurrentObj.pageid;
	formdata['page.homeflag'] = '0';
	formdata['page.ratio'] = CurrentObj.ratio;
	$('#SubpageForm').loadJSON(formdata);
	$('#SubpageForm').attr('action', 'page!add.action');
	$('.hide-update').css('display', '');
	refreshFromPageTable();
	$('#SubpageModal').modal();
});			
$('body').on('click', '.pix-update', function(event) {
	var index = $(event.target).attr('data-id');
	var subid = $(event.target).attr('sub-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
		subid = $(event.target).parent().attr('sub-id');
	}
	CurrentObj = $('#MyTable').dataTable().fnGetData(index);
	if (subid == undefined) {
		var formdata = new Object();
		for (var name in CurrentObj) {
			formdata['page.' + name] = CurrentObj[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', 'page!update.action');
		$('.hide-update').css('display', 'none');
		$('#MyEditModal').modal();
	} else {
		CurrentObj = CurrentObj.subpages[subid];
		var formdata = new Object();
		for (var name in CurrentObj) {
			formdata['page.' + name] = CurrentObj[name];
		}
		$('#SubpageForm').loadJSON(formdata);
		$('#SubpageForm').attr('action', 'page!update.action');
		$('.hide-update').css('display', 'none');
		$('#SubpageModal').modal();
	}

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
	var subid = $(event.target).attr('sub-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
		subid = $(event.target).parent().attr('sub-id');
	}
	CurrentObj = $('#MyTable').dataTable().fnGetData(index);
	var pageid = CurrentObj.pageid;
	var name = CurrentObj.name;
	CurrentSubObjs = CurrentObj.subpages;
	if (subid != undefined) {
		pageid = CurrentObj.subpages[subid].pageid;
		name = CurrentObj.subpages[subid].name;
	}

	bootbox.confirm(common.tips.remove + name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : 'page!delete.action',
				cache: false,
				data : {
					'page.pageid': pageid
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
	var index = $(event.target).attr('data-id');
	var subid = $(event.target).attr('sub-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
		subid = $(event.target).parent().attr('sub-id');
	}
	CurrentObj = $('#MyTable').dataTable().fnGetData(index);
	var pageid = CurrentObj.pageid;
	CurrentSubObjs = CurrentObj.subpages;
	if (subid != undefined) {
		pageid = CurrentObj.subpages[subid].pageid;
	}

	$.ajax({
		type : 'GET',
		url : 'page!get.action',
		data : {pageid: pageid},
		success : function(data, status) {
			if (data.errorcode == 0) {
				CurrentObj = data.page;
				CurrentObj.pageid = CurrentObj.pageid;
				CurrentObj.pagezones = CurrentObj.pagezones;
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

			for (var i=0; i<CurrentObj.pagezones.length; i++) {
				for (var j=0; j<CurrentObj.pagezones[i].pagezonedtls.length; j++) {
					CurrentObj.pagezones[i].pagezonedtls[j].image = undefined;
					CurrentObj.pagezones[i].pagezonedtls[j].video = undefined;
				}
			}			
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

function refreshSubPageSelect() {
	var data = [];
	if (CurrentSubObjs != null) {
		for (var i=0; i<CurrentSubObjs.length; i++) {
			data.push({
				id: CurrentSubObjs[i].pageid,
				name: CurrentSubObjs[i].name,
				page: CurrentSubObjs[i]
			})
		}
	}
	
	$('#SubPageSelect').select2({
		placeholder: common.tips.detail_select,
		//minimumResultsForSearch: -1,
		minimumInputLength: 0,
		data: data,
		formatResult: function (item) {
			if (item.page != null && item.page.snapshot != null) {
				return '<span><img src="/pixsigdata' + item.page.snapshot + '" height="25" /> ' + item.name + '</span>';
			} else {
				return '<span>' + item.name + '</span>';
			}
		},
		formatSelection: function (item) {
			return item.name;				
		},
		dropdownCssClass: 'bigdrop', 
		escapeMarkup: function (m) { return m; } 
	});
	var touchpages = CurrentSubObjs.filter(function (el) {
		return el.pageid == CurrentZone.touchpageid;
	});
	if (touchpages.length > 0) {
		$('#SubPageSelect').select2('data', {id: touchpages[0].pageid, name: touchpages[0].name, page: touchpages[0] });
	} else {
		$('#SubPageSelect').select2('val', '');
	}
}
