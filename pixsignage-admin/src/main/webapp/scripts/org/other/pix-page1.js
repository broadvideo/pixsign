var myurls = {
	'common.list' : 'page!pagelist.action',
	'common.add' : 'page!commonadd.action',
	'common.update' : 'page!update.action',
	'common.delete' : 'page!delete.action',
};

var CurrentPage;
var CurrentPageid;

$("#MyTable thead").css("display", "none");
$("#MyTable tbody").css("display", "none");
var pagehtml = '';
var oTable = $('#MyTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 16, 36, 72, 108 ],
						[ 16, 36, 72, 108 ] 
						],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : myurls['common.list'],
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.ratio, 'mData' : 'ratio', 'bSortable' : false }, 
					{'sTitle' : common.view.type, 'mData' : 'type', 'bSortable' : false }, 
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
	'fnServerParams': function(aoData) {
		aoData.push({'name':'pagepkgid','value':0 });
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 3 == 0) {
			pagehtml = '';
			pagehtml += '<div class="row" >';
		}
		pagehtml += '<div class="col-md-4 col-xs-4">';
		pagehtml += '<h3>' + aData.name + '</h3>';
		if (aData.ratio == 1) {
			pagehtml += '<h6><span class="label label-sm label-info">' + common.view.template_ratio_1 + '</span></h6>';
		} else if (aData.ratio == 2) {
			pagehtml += '<h6><span class="label label-sm label-success">' + common.view.template_ratio_2 + '</span></h6>';
		}

		if (aData.snapshot != null) {
			pagehtml += '<a class="fancybox" href="/pixsigdata' + aData.snapshot + '" title="' + aData.name + '">';
			pagehtml += '<div class="thumbs">';
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			pagehtml += '<img src="/pixsigdata' + aData.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
			pagehtml += '</div></a>';
		} else {
			pagehtml += '<div class="thumbs">';
			pagehtml += '</div>';
		}
		
		pagehtml += '<div privilegeid="101010">';
		pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-page"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a> </div>';

		pagehtml += '</div>';
		if ((iDisplayIndex+1) % 3 == 0 || (iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
			pagehtml += '</div>';
			if ((iDisplayIndex+1) != $('#MyTable').dataTable().fnGetData().length) {
				pagehtml += '<hr/>';
			}
			$('#PageContainer').append(pagehtml);
			$('.thumbs').each(function(i) {
				$(this).width($(this).parent().closest('div').width());
				$(this).height($(this).parent().closest('div').width());
			});
			$(".fancybox").fancybox({
				openEffect	: 'none',
				closeEffect	: 'none',
				closeBtn : false,
			});
		}
		return nRow;
	}
});
jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').select2();

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
	FormValidateOption.rules = {};
	FormValidateOption.rules['page.name'] = {};
	FormValidateOption.rules['page.name']['required'] = true;
	FormValidateOption.rules['page.templateid'] = {};
	FormValidateOption.rules['page.templateid']['required'] = true;
	$('#MyEditForm').validate(FormValidateOption);
	$.extend($("#MyEditForm").validate().settings, {
		rules: FormValidateOption.rules,
	});
	refreshForm('MyEditForm');
	$('#MyEditForm').attr('action', myurls['common.add']);
	$('.hide-update').css('display', 'block');
	CurrentPage = null;
	CurrentPageid = 0;
	$('#MyEditModal').modal();
});			


$('body').on('click', '.pix-update', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentPage = $('#MyTable').dataTable().fnGetData(index);
	CurrentPageid = CurrentPage.pageid;

	var action = myurls['common.update'];
	var formdata = new Object();
	for (var name in CurrentPage) {
		formdata['page.' + name] = CurrentPage[name];
	}
	FormValidateOption.rules = {};
	FormValidateOption.rules['pagepkg.name'] = {};
	FormValidateOption.rules['pagepkg.name']['required'] = true;
	FormValidateOption.rules['pagepkg.templateid'] = {};
	FormValidateOption.rules['pagepkg.templateid']['required'] = false;
	$('#MyEditForm').validate(FormValidateOption);
	$.extend($("#MyEditForm").validate().settings, {
		rules: FormValidateOption.rules,
	});
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', action);
	$('.hide-update').css('display', 'none');
	$('#MyEditModal').modal();
});

$('body').on('click', '.pix-delete', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentPage = $('#MyTable').dataTable().fnGetData(index);
	CurrentPageid = CurrentPage.pageid;
	var action = myurls['common.delete'];
	
	bootbox.confirm(common.tips.remove + CurrentPage.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : action,
				cache: false,
				data : {
					'page.pageid': CurrentPageid
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
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentPage = $('#MyTable').dataTable().fnGetData(index);
	CurrentPageid = CurrentPage.pageid;
	window.open('template-design.jsp?pageid=' + CurrentPageid);
});

var template_select_option = {
		placeholder: common.tips.detail_select,
		minimumInputLength: 0,
		ajax: { 
			url: 'page!templatelist.action',
			type: 'GET',
			dataType: 'json',
			data: function (term, page) {
				return {
					sSearch: term, 
					iDisplayStart: (page-1)*10,
					iDisplayLength: 10,
					pagepkgid: 0,
				};
			},
			results: function (data, page) {
				var more = (page * 10) < data.iTotalRecords; 
				return {
					results : $.map(data.aaData, function (item) { 
						return { 
							text:item.name, 
							id:item.pageid,
							page:item,
						};
					}),
					more: more
				};
			}
		},
		formatResult: function(data) {
			var width = 40;
			var height = 40 * data.page.height / data.page.width;
			if (data.page.width < data.page.height) {
				height = 40;
				width = 40 * data.page.width / data.page.height;
			}
			var html = '<span><img src="/pixsigdata' + data.page.snapshot + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.page.name + '</span>'
			return html;
		},
		formatSelection: function(data) {
			var width = 30;
			var height = 30 * height / width;
			if (data.page.width < data.page.height) {
				height = 30;
				width = 30 * width / height;
			}
			var html = '<span><img src="/pixsigdata' + data.page.snapshot + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.page.name + '</span>'
			return html;
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	};
	$("#TemplateSelect").select2(template_select_option);
