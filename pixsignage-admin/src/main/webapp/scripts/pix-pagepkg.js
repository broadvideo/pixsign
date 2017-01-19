var myurls = {
	'common.list' : 'pagepkg!list.action',
	'common.add' : 'pagepkg!add.action',
	'common.update' : 'pagepkg!update.action',
	'common.delete' : 'pagepkg!delete.action',
	'page.add' : 'page!commonadd.action',
	'page.delete' : 'page!delete.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}

$("#MyTable thead").css("display", "none");
$("#MyTable tbody").css("display", "none");
var oTable = $('#MyTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 10, 25, 50, 100 ],
					[ 10, 25, 50, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : myurls['common.list'],
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : common.view.detail, 'mData' : 'pagepkgid', 'bSortable' : false, 'sWidth' : '75%' },
					{'sTitle' : '', 'mData' : 'pagepkgid', 'bSortable' : false, 'sWidth' : '5%' },
					{'sTitle' : '', 'mData' : 'pagepkgid', 'bSortable' : false, 'sWidth' : '5%' },
					{'sTitle' : '', 'mData' : 'pagepkgid', 'bSortable' : false, 'sWidth' : '5%' }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#PagepkgContainer').length < 1) {
			$('#MyTable').append('<div id="PagepkgContainer" class="timeline"></div>');
		}
		$('#PagepkgContainer').html(''); 
		return true;
	},
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		var pkghtml = '<div class="timeline-item">';
		
		pkghtml += '<div class="timeline-badge">';
		pkghtml += '<img class="timeline-badge-userpic" src="/pixsigdata' + aData.snapshot + '">';
		pkghtml += '</div>';
		
		pkghtml += '<div class="timeline-body">';
		
		pkghtml += '<div class="timeline-body-arrow"></div>';
		pkghtml += '<div class="timeline-body-head">';
		pkghtml += '<div class="timeline-body-head-caption">';
		pkghtml += '<span class="timeline-body-title font-blue-madison">' + aData.name + '</span>';
		pkghtml += '<span class="timeline-body-time font-grey-cascade">' + aData.updatetime + '</span>';
		pkghtml += '</div>';
		pkghtml += '<div class="timeline-body-head-actions">';
		pkghtml += '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-sm green pix-page-add"><i class="fa fa-plus"></i> ' + common.view.page_add + '</a>';
		pkghtml += '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-sm blue pix-pagepkg-update"><i class="fa fa-pencil"></i> ' + common.view.pagepkg_edit + '</a>';
		pkghtml += '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-sm red pix-pagepkg-delete"><i class="fa fa-trash-o"></i> ' + common.view.pagepkg_remove + '</a> </p>';
		pkghtml += '</div>';
		pkghtml += '</div>';
		
		pkghtml += '<div class="timeline-body-content">';
		for (var i=0; i<aData.pages.length; i++) {
			var page = aData.pages[i];
			if (i % 6 == 0) {
				pkghtml += '<div class="row" >';
			}
			pkghtml += '<div class="col-md-2 col-xs-2">';
			if (page.snapshot != null) {
				pkghtml += '<a class="fancybox" href="/pixsigdata' + page.snapshot + '" title="' + page.name + '">';
				pkghtml += '<div class="thumbs">';
				var thumbwidth = page.width > page.height? 100 : 100*page.width/page.height;
				pkghtml += '<img src="/pixsigdata' + page.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + page.name + '" />';
				pkghtml += '</div></a>';
			} else {
				pkghtml += '<div class="thumbs">';
				pkghtml += '</div>';
			}
			pkghtml += '<div privilegeid="101010">';
			pkghtml += '<a href="javascript:;" data-id="' + page.pageid + '" class="btn default btn-xs blue pix-page-design"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
			if (page.entry != 1) {
				pkghtml += '<a href="javascript:;" data-id="' + page.pageid + '" class="btn default btn-xs red pix-page-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
			}
			pkghtml += '</div>';

			pkghtml += '</div>';

			if ((i+1) % 6 == 0 || (i+1) == aData.pages.length) {
				pkghtml += '</div>';
			}
		}
		pkghtml += '</div>';
		pkghtml += '</div>';
		pkghtml += '</div>';
		$('#PagepkgContainer').append(pkghtml);

		$(".fancybox").fancybox({
			openEffect	: 'none',
			closeEffect	: 'none',
			closeBtn : false,
		});
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#MyTable .thumbs').each(function(i) {
			console.log($(this).parent().closest('div').width());
			$(this).width($(this).parent().closest('div').width());
			$(this).height($(this).parent().closest('div').width());
		});
	}
});

$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
$('#MyTable_wrapper .dataTables_length select').select2();
$('#MyTable').css('width', '100%');

OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
OriginalFormData['PageEditForm'] = $('#PageEditForm').serializeObject();

function submitMyEditForm() {
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

function submitPageEditForm() {
	$.ajax({
		type : 'POST',
		url : $('#PageEditForm').attr('action'),
		data : $('#PageEditForm').serialize(),
		success : function(data, status) {
			if (data.errorcode == 0) {
				$('#PageEditModal').modal('hide');
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
$("#TemplateSelect1").select2(template_select_option);
$("#TemplateSelect2").select2(template_select_option);

$('body').on('click', '.pix-add', function(event) {
	FormValidateOption.rules = {};
	FormValidateOption.rules['pagepkg.name'] = {};
	FormValidateOption.rules['pagepkg.name']['required'] = true;
	FormValidateOption.rules['pagepkg.name']['minlength'] = 2;
	FormValidateOption.rules['pagepkg.templateid'] = {};
	FormValidateOption.rules['pagepkg.templateid']['required'] = true;
	FormValidateOption.submitHandler = submitMyEditForm;
	$('#MyEditForm').validate(FormValidateOption);
	$.extend($("#MyEditForm").validate().settings, {
		rules: FormValidateOption.rules,
	});
	refreshForm('MyEditForm');
	$('#MyEditForm').attr('action', myurls['common.add']);
	$('.hide-update').css('display', 'block');
	$('#MyEditModal').modal();
});			

$('body').on('click', '.pix-pagepkg-update', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	var item = $('#MyTable').dataTable().fnGetData(index);
	var formdata = new Object();
	for (var name in item) {
		formdata['pagepkg.' + name] = item[name];
	}
	FormValidateOption.rules = {};
	FormValidateOption.rules['pagepkg.name'] = {};
	FormValidateOption.rules['pagepkg.name']['required'] = true;
	FormValidateOption.rules['pagepkg.name']['minlength'] = 2;
	FormValidateOption.rules['pagepkg.templateid'] = {};
	FormValidateOption.rules['pagepkg.templateid']['required'] = false;
	FormValidateOption.submitHandler = submitMyEditForm;
	$('#MyEditForm').validate(FormValidateOption);
	$.extend($("#MyEditForm").validate().settings, {
		rules: FormValidateOption.rules,
	});
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', myurls['common.update']);
	$('.hide-update').css('display', 'none');
	$('#MyEditModal').modal();
});

$('body').on('click', '.pix-page-add', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	var item = $('#MyTable').dataTable().fnGetData(index);
	FormValidateOption.rules = {};
	FormValidateOption.rules['page.name'] = {};
	FormValidateOption.rules['page.name']['required'] = true;
	FormValidateOption.rules['page.name']['minlength'] = 2;
	FormValidateOption.rules['page.templateid'] = {};
	FormValidateOption.rules['page.templateid']['required'] = true;
	FormValidateOption.submitHandler = submitPageEditForm;
	$('#PageEditForm').validate(FormValidateOption);
	$.extend($("#PageEditForm").validate().settings, {
		rules: FormValidateOption.rules,
	});
	refreshForm('PageEditForm');
	$('#PageEditForm input[name="page.pagepkgid"]').val(item.pagepkgid);
	$('#PageEditForm').attr('action', myurls['page.add']);
	$('#PageEditModal').modal();
});			

$('body').on('click', '.pix-page-design', function(event) {
	var pageid = $(event.target).attr('data-id');
	if (pageid == undefined) {
		pageid = $(event.target).parent().attr('data-id');
	}
	window.open('template-design.jsp?pageid=' + pageid);
});

$('[type=submit]', $('#MyEditModal')).on('click', function(event) {
	if ($('#MyEditForm').valid()) {
		$('#MyEditForm').submit();
	}
});

$('[type=submit]', $('#PageEditModal')).on('click', function(event) {
	if ($('#PageEditForm').valid()) {
		$('#PageEditForm').submit();
	}
});

var currentItem;
$('body').on('click', '.pix-pagepkg-delete', function(event) {
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
					'pagepkg.pagepkgid': currentItem['pagepkgid']
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

$('body').on('click', '.pix-page-delete', function(event) {
	var pageid = $(event.target).attr('data-id');
	if (pageid == undefined) {
		pageid = $(event.target).parent().attr('data-id');
	}
	
	bootbox.confirm(common.tips.remove, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : myurls['page.delete'],
				cache: false,
				data : {
					'page.pageid': pageid
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

