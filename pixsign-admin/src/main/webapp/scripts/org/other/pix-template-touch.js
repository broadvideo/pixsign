var submitflag = false;

var CurrentObj;
var CurrentSubObjs;
var CurrentId;
var CurrentZone;

$('#MyTable thead').css('display', 'none');
$('#MyTable tbody').css('display', 'none');
var templatehtml = '';
var oTable = $('#MyTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 16, 36, 72, 108 ],
						[ 16, 36, 72, 108 ] 
						],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'template!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.ratio, 'mData' : 'ratio', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'templateid', 'bSortable' : false }],
	'iDisplayLength' : 16,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#TemplateContainer').length < 1) {
			$('#MyTable').append('<div id="TemplateContainer"></div>');
		}
		$('#TemplateContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		var templatehtml = '';
		templatehtml += '<div class="row" >';
		templatehtml += '<div class="col-md-12 col-xs-12">';
		templatehtml += '<h3 class="pixtitle">' + aData.name + '</h3>';
		if (aData.ratio == 1) {
			templatehtml += '<h6><span class="label label-sm label-info">' + common.view.ratio_1 + '</span></h6>';
		} else if (aData.ratio == 2) {
			templatehtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_2 + '</span></h6>';
		}
		templatehtml += '<div privilegeid="101010">';
		templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm yellow pix-subtemplate-add"><i class="fa fa-plus"></i> ' + common.view.subtemplate + '</a>';
		//templatehtml += '<a href="template!export.action?templateid=' + aData.templateid + '" data-id="' + iDisplayIndex + '" class="btn default btn-sm green"><i class="fa fa-download"></i> ' + common.view.export + '</a>';
		templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a> </div>';
		templatehtml += '</div>';
		templatehtml += '</div>';

		templatehtml += '<div class="row" >';
		templatehtml += '<div class="col-md-4 col-xs-6">';
		templatehtml += '<a href="javascript:;" templateid="' + aData.templateid + '" class="fancybox">';
		templatehtml += '<div class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			templatehtml += '<img src="/pixsigndata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		}
		templatehtml += '</div></a>';
		templatehtml += '<div privilegeid="101010">';
		templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-template"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
		templatehtml += '</div>';
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
				templatehtml += '<img src="/pixsigndata' + aData.subtemplates[i].snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + subthumbwidth + '%" />';
			}
			templatehtml += '</div></a>';
			templatehtml += '<div privilegeid="101010">';
			templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs blue pix-template"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
			templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
			templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
			templatehtml += '</div>';
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
		$('.thumbs').each(function(i) {
			$(this).width($(this).parent().closest('div').width());
			$(this).height($(this).parent().closest('div').width());
		});
		$('.fancybox').each(function(index,item) {
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
						        title: templateid,
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
		aoData.push({'name':'touchflag','value':'1' });
		aoData.push({'name':'homeflag','value':'1' });
	}
});
jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').select2();

function refreshFromTemplateTable() {
	var width = 100/(CurrentSubObjs.length+1);
	var fromTemplateTableHtml = '';
	fromTemplateTableHtml += '<tr>';
	fromTemplateTableHtml += '<td style="padding: 0px 20px 0px 0px;" width="' + width + '%">';
	fromTemplateTableHtml += '<div class="thumbs" style="width:100px; height:100px;">';
	fromTemplateTableHtml += '</div></td>';
	for (var i=0; i<CurrentSubObjs.length; i++) {
		var fromtemplate = CurrentSubObjs[i];
		fromTemplateTableHtml += '<td style="padding: 0px 20px 0px 0px;" width="' + width + '%">';
		fromTemplateTableHtml += '<a href="javascript:;" fromtemplateid="' + fromtemplate.templateid + '" class="fancybox">';
		fromTemplateTableHtml += '<div class="thumbs" style="width:100px; height:100px;">';
		if (fromtemplate.snapshot != null) {
			var thumbwidth = fromtemplate.width > fromtemplate.height? 100 : 100*fromtemplate.width/fromtemplate.height;
			fromTemplateTableHtml += '<img src="/pixsigndata' + fromtemplate.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + fromtemplate.name + '" />';
		}
		fromTemplateTableHtml += '</div></a></td>';
	}
	fromTemplateTableHtml += '</tr>';
	fromTemplateTableHtml += '<tr>';
	fromTemplateTableHtml += '<td>';
	fromTemplateTableHtml += '<label class="radio-inline">';
	fromTemplateTableHtml += '<input type="radio" name="fromtemplateid" value="0" checked>';
	fromTemplateTableHtml += common.view.blank + '</label>';
	fromTemplateTableHtml += '</td>';
	for (var i=0; i<CurrentSubObjs.length; i++) {
		var fromtemplate = CurrentSubObjs[i];
		fromTemplateTableHtml += '<td>';
		fromTemplateTableHtml += '<label class="radio-inline">';
		fromTemplateTableHtml += '<input type="radio" name="fromtemplateid" value="' + fromtemplate.templateid + '">';
		fromTemplateTableHtml += fromtemplate.name + '</label>';
		fromTemplateTableHtml += '</td>';
	}
	fromTemplateTableHtml += '</tr>';
	$('#FromTemplateTable').html(fromTemplateTableHtml);
	$('#FromTemplateTable').width(120 * (CurrentSubObjs.length+1));

	$('#FromTemplateTable .fancybox').each(function(index,item) {
		$(this).click(function() {
			var templateid = $(this).attr('fromtemplateid');
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
					        title: templateid,
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
}

OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
var validateOption1 = {};
$.extend(validateOption1, FormValidateOption);
validateOption1.rules['template.name'] = {};
validateOption1.rules['template.name']['required'] = true;
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
validateOption2.rules['template.name'] = {};
validateOption2.rules['template.name']['required'] = true;
validateOption2.rules['template.homeidletime'] = {};
validateOption2.rules['template.homeidletime']['required'] = true;
validateOption2.rules['template.homeidletime']['number'] = true;
validateOption2.submitHandler = function(form) {
	$.ajax({
		type : 'POST',
		url : $('#SubtemplateForm').attr('action'),
		data : $('#SubtemplateForm').serialize(),
		success : function(data, status) {
			if (data.errorcode == 0) {
				$('#SubtemplateModal').modal('hide');
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
$('#SubtemplateForm').validate(validateOption2);
$('[type=submit]', $('#SubtemplateModal')).on('click', function(event) {
	if ($('#SubtemplateForm').valid()) {
		$('#SubtemplateForm').submit();
	}
});
$('body').on('click', '.pix-add', function(event) {
	refreshForm('MyEditForm');
	$('#MyEditForm').attr('action', 'template!add.action');
	$('.hide-update').css('display', 'block');
	CurrentObj = null;
	CurrentId = 0;
	$('#MyEditModal').modal();
});			
$('body').on('click', '.pix-subtemplate-add', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentObj = $('#MyTable').dataTable().fnGetData(index);
	CurrentSubObjs = CurrentObj.subtemplates;
	var formdata = new Object();
	formdata['template.name'] = '';
	formdata['template.homeidletime'] = '0';
	formdata['template.hometemplateid'] = CurrentObj.templateid;
	formdata['template.homeflag'] = '0';
	formdata['template.ratio'] = CurrentObj.ratio;
	$('#SubtemplateForm').loadJSON(formdata);
	$('#SubtemplateForm').attr('action', 'template!add.action');
	$('.hide-update').css('display', '');
	refreshFromTemplateTable();
	$('#SubtemplateModal').modal();
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
			formdata['template.' + name] = CurrentObj[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', 'template!update.action');
		$('.hide-update').css('display', 'none');
		$('#MyEditModal').modal();
	} else {
		CurrentObj = CurrentObj.subtemplates[subid];
		var formdata = new Object();
		for (var name in CurrentObj) {
			formdata['template.' + name] = CurrentObj[name];
		}
		$('#SubtemplateForm').loadJSON(formdata);
		$('#SubtemplateForm').attr('action', 'template!update.action');
		$('.hide-update').css('display', 'none');
		$('#SubtemplateModal').modal();
	}

});

$('body').on('click', '.pix-delete', function(event) {
	var index = $(event.target).attr('data-id');
	var subid = $(event.target).attr('sub-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
		subid = $(event.target).parent().attr('sub-id');
	}
	CurrentObj = $('#MyTable').dataTable().fnGetData(index);
	var templateid = CurrentObj.templateid;
	var name = CurrentObj.name;
	CurrentSubObjs = CurrentObj.subtemplates;
	if (subid != undefined) {
		templateid = CurrentObj.subtemplates[subid].templateid;
		name = CurrentObj.subtemplates[subid].name;
	}

	bootbox.confirm(common.tips.remove + name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : 'template!delete.action',
				cache: false,
				data : {
					'template.templateid': templateid
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

$('body').on('click', '.pix-template', function(event) {
	var index = $(event.target).attr('data-id');
	var subid = $(event.target).attr('sub-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
		subid = $(event.target).parent().attr('sub-id');
	}
	CurrentObj = $('#MyTable').dataTable().fnGetData(index);
	var templateid = CurrentObj.templateid;
	CurrentSubObjs = CurrentObj.subtemplates;
	if (subid != undefined) {
		templateid = CurrentObj.subtemplates[subid].templateid;
	}

	$.ajax({
		type : 'GET',
		url : 'template!get.action',
		data : {templateid: templateid},
		success : function(data, status) {
			if (data.errorcode == 0) {
				CurrentObj = data.template;
				CurrentObj.pageid = CurrentObj.templateid;
				CurrentObj.pagezones = CurrentObj.templatezones;
				for (var i=0; i<CurrentObj.pagezones.length; i++) {
					CurrentObj.pagezones[i].pagezoneid = CurrentObj.pagezones[i].templatezoneid;
					CurrentObj.pagezones[i].pageid = CurrentObj.pagezones[i].templateid;
					CurrentObj.pagezones[i].touchpageid = CurrentObj.pagezones[i].touchtemplateid;
					CurrentObj.pagezones[i].pagezonedtls = CurrentObj.pagezones[i].templatezonedtls;
					for (var j=0; j<CurrentObj.pagezones[i].pagezonedtls.length; j++) {
						CurrentObj.pagezones[i].pagezonedtls[j].pagezonedtlid = CurrentObj.pagezones[i].pagezonedtls[j].templatezonedtlid;
						CurrentObj.pagezones[i].pagezonedtls[j].pagezoneid = CurrentObj.pagezones[i].pagezonedtls[j].templatezoneid;
					}
				}
				CurrentId = CurrentObj.pageid;
				CurrentZone = null;
				$('.calendar-ctrl').css('display', CalendarCtrl?'':'none');
				$('.diy-ctrl').css('display', DiyCtrl?'':'none');
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

			CurrentObj.templateid = CurrentObj.pageid;
			CurrentObj.pageid = undefined;
			CurrentObj.templatezones = CurrentObj.pagezones;
			CurrentObj.pagezones = undefined;
			for (var i=0; i<CurrentObj.templatezones.length; i++) {
				CurrentObj.templatezones[i].templatezoneid = CurrentObj.templatezones[i].pagezoneid;
				CurrentObj.templatezones[i].pagezoneid = undefined;
				CurrentObj.templatezones[i].templateid = CurrentObj.templatezones[i].pageid;
				CurrentObj.templatezones[i].pageid = undefined;
				CurrentObj.templatezones[i].touchtemplateid = CurrentObj.templatezones[i].touchpageid;
				CurrentObj.templatezones[i].touchpageid = undefined;
				CurrentObj.templatezones[i].templatezonedtls = CurrentObj.templatezones[i].pagezonedtls;
				CurrentObj.templatezones[i].pagezonedtls = undefined;
				for (var j=0; j<CurrentObj.templatezones[i].templatezonedtls.length; j++) {
					CurrentObj.templatezones[i].templatezonedtls[j].templatezonedtlid = CurrentObj.templatezones[i].templatezonedtls[j].pagezonedtlid;
					CurrentObj.templatezones[i].templatezonedtls[j].pagezonedtlid = undefined;
					CurrentObj.templatezones[i].templatezonedtls[j].templatezoneid = CurrentObj.templatezones[i].templatezonedtls[j].pagezoneid;
					CurrentObj.templatezones[i].templatezonedtls[j].pagezoneid = undefined;
					CurrentObj.templatezones[i].templatezonedtls[j].image = undefined;
					CurrentObj.templatezones[i].templatezonedtls[j].video = undefined;
				}
			}			
			$.ajax({
				type : 'POST',
				url : 'template!design.action',
				data : '{"template":' + $.toJSON(CurrentObj) + '}',
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
				id: CurrentSubObjs[i].templateid,
				name: CurrentSubObjs[i].name,
				template: CurrentSubObjs[i]
			})
		}
	}
	
	$('#SubPageSelect').select2({
		placeholder: common.tips.detail_select,
		//minimumResultsForSearch: -1,
		minimumInputLength: 0,
		data: data,
		formatResult: function (item) {
			if (item.template != null && item.template.snapshot != null) {
				return '<span><img src="/pixsigndata' + item.template.snapshot + '" height="25" /> ' + item.name + '</span>';
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
	var touchtemplates = CurrentSubObjs.filter(function (el) {
		return el.templateid == CurrentZone.touchpageid;
	});
	if (touchtemplates.length > 0) {
		$('#SubPageSelect').select2('data', {id: touchtemplates[0].templateid, name: touchtemplates[0].name, template: touchtemplates[0] });
	} else {
		$('#SubPageSelect').select2('val', '');
	}
}
