var submitflag = false;

var CurrentObj;
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
	'fnServerParams': function(aoData) {
		aoData.push({'name':'templatepkgid','value':0 });
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 4 == 0) {
			templatehtml = '';
			templatehtml += '<div class="row" >';
		}
		templatehtml += '<div class="col-md-3 col-xs-3">';
		templatehtml += '<h3>' + aData.name + '</h3>';
		if (aData.ratio == 1) {
			templatehtml += '<h6><span class="label label-sm label-info">' + common.view.ratio_1 + '</span></h6>';
		} else if (aData.ratio == 2) {
			templatehtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_2 + '</span></h6>';
		} else if (aData.ratio == 3) {
			templatehtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_3 + '</span></h6>';
		} else if (aData.ratio == 4) {
			templatehtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_4 + '</span></h6>';
		} else if (aData.ratio == 5) {
			templatehtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_5 + '</span></h6>';
		} else if (aData.ratio == 6) {
			templatehtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_6 + '</span></h6>';
		}

		templatehtml += '<a href="javascript:;" templateid="' + aData.templateid + '" class="fancybox">';
		templatehtml += '<div class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			templatehtml += '<img src="/pixsigndata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		}
		templatehtml += '</div></a>';

		templatehtml += '<div privilegeid="101010">';
		templatehtml += '<a href="javascript:;" templateid="' + aData.templateid + '" class="btn default btn-xs green pix-template"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		//templatehtml += '<a href="template!export.action?templateid=' + aData.templateid + '" data-id="' + iDisplayIndex + '" class="btn default btn-xs green"><i class="fa fa-download"></i> ' + common.view.export + '</a>';
		templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
		templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
		templatehtml += '</div>';

		templatehtml += '</div>';
		if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
			templatehtml += '</div>';
			if ((iDisplayIndex+1) != $('#MyTable').dataTable().fnGetData().length) {
				templatehtml += '<hr/>';
			}
			$('#TemplateContainer').append(templatehtml);
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
		aoData.push({'name':'touchflag','value':'0' });
	}
});
jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').select2();

OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
FormValidateOption.rules['template.name'] = {};
FormValidateOption.rules['template.name']['required'] = true;
FormValidateOption.submitHandler = function(form) {
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
$('#MyEditForm').validate(FormValidateOption);

$('[type=submit]', $('#MyEditModal')).on('click', function(event) {
	if ($('#MyEditForm').valid()) {
		$('#MyEditForm').submit();
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


$('body').on('click', '.pix-update', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentObj = $('#MyTable').dataTable().fnGetData(index);
	CurrentId = CurrentObj.templateid;

	var formdata = new Object();
	for (var name in CurrentObj) {
		formdata['template.' + name] = CurrentObj[name];
	}
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', 'template!update.action');
	$('.hide-update').css('display', 'none');
	$('#MyEditModal').modal();
});

$('body').on('click', '.pix-delete', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentObj = $('#MyTable').dataTable().fnGetData(index);
	CurrentId = CurrentObj.templateid;
	bootbox.confirm(common.tips.remove + CurrentObj.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : 'template!delete.action',
				cache: false,
				data : {
					'template.templateid': CurrentId
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
	var templateid = $(event.target).attr('templateid');
	if (templateid == undefined) {
		templateid = $(event.target).parent().attr('templateid');
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
