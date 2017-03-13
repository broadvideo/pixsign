var myurls = {
	'common.list' : 'layout!list.action',
	'common.add' : 'layout!add.action',
	'common.update' : 'layout!update.action',
	'common.delete' : 'layout!delete.action',
	'layout.dtllist' : 'layout!dtllist.action',
	'layout.design' : 'layout!design.action',
	'image.list' : 'image!list.action',
};

$(window).resize(function(e) {
	if (CurrentLayout != null && e.target == this) {
		var width = Math.floor($("#LayoutDiv").parent().width());
		var scale = CurrentLayout.width / width;
		var height = CurrentLayout.height / scale;
		$("#LayoutDiv").css("width" , width);
		$("#LayoutDiv").css("height" , height);
	}
	for (var i=0; i<$('#MyTable').dataTable().fnGetData().length; i++) {
		var layout = $('#MyTable').dataTable().fnGetData(i);
		redrawLayoutPreview($('#LayoutDiv-' + layout.layoutid), layout, Math.floor($('#LayoutDiv-' + layout.layoutid).parent().parent().width()));
	}
});

$("#MyTable thead").css("display", "none");
$("#MyTable tbody").css("display", "none");
var layouthtml = '';
var oTable = $('#MyTable').dataTable({
	'sDom' : 'rt',
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : myurls['common.list'],
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.ratio, 'mData' : 'ratio', 'bSortable' : false }, 
					{'sTitle' : common.view.type, 'mData' : 'type', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'layoutid', 'bSortable' : false }],
	'iDisplayLength' : -1,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#LayoutContainer').length < 1) {
			$('#MyTable').append('<div id="LayoutContainer"></div>');
		}
		$('#LayoutContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 3 == 0) {
			layouthtml = '';
			layouthtml += '<div class="row" >';
		}
		layouthtml += '<div class="col-md-4 col-xs-4">';
		layouthtml += '<h3 class="pixtitle">' + aData.name + '</h3>';
		if (aData.ratio == 1) {
			layouthtml += '<h6><span class="label label-sm label-info">' + common.view.ratio_1 + '</span>';
		} else if (aData.ratio == 2) {
			layouthtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_2 + '</span>';
		} else if (aData.ratio == 3) {
			layouthtml += '<h6><span class="label label-sm label-info">' + common.view.ratio_3 + '</span>';
		} else if (aData.ratio == 4) {
			layouthtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_4 + '</span>';
		} else if (aData.ratio == 5) {
			layouthtml += '<h6><span class="label label-sm label-success">' + common.view.ratio_5 + '</span>';
		}
		if (aData.type == 0) {
			layouthtml += ' <span class="label label-sm label-default">' + common.view.type_0 + '</span></h6>';
		} else if (aData.type == 1) {
			layouthtml += ' <span class="label label-sm label-warning">' + common.view.type_1 + '</span></h6>';
		} else {
			layouthtml += ' <span class="label label-sm label-default">' + common.view.unknown + '</span></h6>';
		}
		layouthtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="fancybox">';
		layouthtml += '<div id="LayoutDiv-'+ aData.layoutid + '"></div></a>';
		layouthtml += '<div privilegeid="101010">';
		layouthtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-layout"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		layouthtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
		layouthtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a> </div>';

		layouthtml += '</div>';
		if ((iDisplayIndex+1) % 3 == 0 || (iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
			layouthtml += '</div>';
			if ((iDisplayIndex+1) != $('#MyTable').dataTable().fnGetData().length) {
				layouthtml += '<hr/>';
			}
			$('#LayoutContainer').append(layouthtml);
		}
		if ((iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
			for (var i=0; i<$('#MyTable').dataTable().fnGetData().length; i++) {
				var layout = $('#MyTable').dataTable().fnGetData(i);
				redrawLayoutPreview($('#LayoutDiv-' + layout.layoutid), layout, Math.floor($('#LayoutDiv-' + layout.layoutid).parent().parent().width()));
				$('.fancybox').each(function(index,item) {
					$(this).click(function() {
						var index = $(this).attr('data-id');
						var layout = $('#MyTable').dataTable().fnGetData(index);
						$.fancybox({
					        padding : 0,
					        content: '<div id="LayoutPreview"></div>',
					    });
						redrawLayoutPreview($('#LayoutPreview'), layout, 800);
					    return false;
					})
				});
			}
		}
		return nRow;
	}
});

OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
FormValidateOption.rules['layout.name'] = {};
FormValidateOption.rules['layout.name']['required'] = true;
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
	var action = myurls['common.add'];
	refreshForm('MyEditForm');
	$('#MyEditForm').attr('action', action);
	$('.layout-ratio').css('display', 'block');
	CurrentLayout = null;
	CurrentLayoutid = 0;
	refreshLayoutBgImageSelect1();
	$('#MyEditModal').modal();
});			


$('body').on('click', '.pix-update', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentLayout = $('#MyTable').dataTable().fnGetData(index);
	CurrentLayoutid = CurrentLayout.layoutid;

	var action = myurls['common.update'];
	var formdata = new Object();
	for (var name in CurrentLayout) {
		formdata['layout.' + name] = CurrentLayout[name];
	}
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', action);
	$('.layout-ratio').css('display', 'none');
	refreshLayoutBgImageSelect1();
	$('#MyEditModal').modal();
});

$('body').on('click', '.pix-sync', function(event) {
	var target = $(event.target);
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		target = $(event.target).parent();
		index = $(event.target).parent().attr('data-id');
	}
	CurrentLayout = $('#MyTable').dataTable().fnGetData(index);
	CurrentLayoutid = CurrentLayout.layoutid;
	bootbox.confirm(common.tips.synclayout, function(result) {
		if (result == true) {
			$.ajax({
				type : 'GET',
				url : 'layout!sync.action',
				cache: false,
				data : {
					layoutid: CurrentLayoutid,
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
	CurrentLayout = $('#MyTable').dataTable().fnGetData(index);
	CurrentLayoutid = CurrentLayout.layoutid;
	var action = myurls['common.delete'];
	
	bootbox.confirm(common.tips.remove + CurrentLayout.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : action,
				cache: false,
				data : {
					'layout.layoutid': CurrentLayoutid
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



//================================ 布局主页 =========================================
//在列表页面中点击布局设计
$('body').on('click', '.pix-layout', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentLayout = $('#MyTable').dataTable().fnGetData(index);
	CurrentLayoutid = CurrentLayout.layoutid;
	CurrentLayoutdtl = null;
	
	$('#LayoutEditForm').loadJSON(CurrentLayout);
	$('#LayoutEditForm .layout-title').html(CurrentLayout.name);
	refreshLayoutBgImageSelect2();
	$('select[name="dateformat"] option').each(function() {
		$(this).html(new Date().pattern($(this).attr('value')));
	});

	$('#LayoutdtlEditForm').css('display' , 'none');
	$('#LayoutEditForm').css('display' , 'block');
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	if (CurrentLayout.width > CurrentLayout.height) {
		$('#LayoutModal .modal-dialog').removeClass('modal-layout2');
		$('#LayoutModal .modal-dialog').addClass('modal-layout1');
		$('#LayoutCol1').attr('class', 'col-md-8 col-sm-8');
		$('#LayoutCol2').attr('class', 'col-md-4 col-sm-4');
	} else {
		$('#LayoutModal .modal-dialog').removeClass('modal-layout1');
		$('#LayoutModal .modal-dialog').addClass('modal-layout2');
		$('#LayoutCol1').attr('class', 'col-md-6 col-sm-6');
		$('#LayoutCol2').attr('class', 'col-md-6 col-sm-6');
	}
	
	$('.touch-ctrl').css('display', TouchCtrl?'':'none');
	$('.calendar-ctrl').css('display', CalendarCtrl?'':'none');
	$('.lift-ctrl').css('display', LiftCtrl?'':'none');
	$('.stream-ctrl').css('display', StreamCtrl?'':'none');
	$('.dvb-ctrl').css('display', DvbCtrl?'':'none');
	$('.videoin-ctrl').css('display', VideoinCtrl?'':'none');

	$('#LayoutModal').modal();
});

$('#LayoutModal').on('shown.bs.modal', function (e) {
	redrawLayout($('#LayoutDiv'), CurrentLayout, null);
	updateRegionBtns();
})


//在设计对话框中进行提交
$('[type=submit]', $('#LayoutModal')).on('click', function(event) {
	if (CurrentLayoutdtl == null && validLayout(CurrentLayout) || CurrentLayoutdtl != null && validLayoutdtl(CurrentLayoutdtl)) {
		$.ajax({
			type : 'POST',
			url : myurls['layout.design'],
			data : '{"layout":' + $.toJSON(CurrentLayout) + '}',
			dataType : 'json',
			contentType : 'application/json;charset=utf-8',
			beforeSend: function ( xhr ) {
				Metronic.startPageLoading({animate: true});
			},
			success : function(data, status) {
				Metronic.stopPageLoading();
				$('#LayoutModal').modal('hide');
				if (data.errorcode == 0) {
					bootbox.alert(common.tips.success);
					$('#MyTable').dataTable()._fnAjaxUpdate();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				$('#LayoutModal').modal('hide');
				console.log('failue');
			}
		});

		event.preventDefault();
	}
});	

