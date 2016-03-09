var myurls = {
	'common.list' : 'layout!list.action',
	'common.add' : 'layout!add.action',
	'common.update' : 'layout!update.action',
	'common.delete' : 'layout!delete.action',
	'layout.dtllist' : 'layout!dtllist.action',
	'layout.design' : 'layout!design.action',
	'layout.regionlist' : 'layout!regionlist.action',
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
});

function drawCanvasRegion(ctx, layoutdtl, left, top, width, height, fill) {
	if (layoutdtl.bgimage != null) {
		var region_bgimage = new Image();
		region_bgimage.src = '/pixsigdata' + layoutdtl.bgimage.filepath;
		region_bgimage.onload = function(img, ctx, left, top, width, height) {
			return function() {
				ctx.drawImage(img, left, top, width, height);
			}
		}(region_bgimage, ctx, left, top, width, height);
	} else {
		if (fill) {
			ctx.fillStyle = RegionColors[layoutdtl.regionid];
			ctx.fillRect(left,top,width,height);
		}
	}
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 2;
	ctx.strokeRect(left,top,width,height);
};

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
		layouthtml += '<h3>' + aData.name + '</h3>';
		if (aData.ratio == 1) {
			layouthtml += '<h4>' + common.view.ratio_1 + '</h4>';
		} else if (aData.ratio == 2) {
			layouthtml += '<h4>' + common.view.ratio_2 + '</h4>';
		} else if (aData.ratio == 3) {
			layouthtml += '<h4>' + common.view.ratio_3 + '</h4>';
		} else if (aData.ratio == 4) {
			layouthtml += '<h4>' + common.view.ratio_4 + '</h4>';
		}
		layouthtml += '<canvas id="LayoutCanvas-'+ aData.layoutid + '"></canvas>';
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
				var canvas = document.getElementById('LayoutCanvas-' + layout.layoutid);
				var ctx = canvas.getContext('2d');
				var scale;
				if (layout.width == 1920 || layout.width == 1080) {
					scale = 1920/250;
				} else {
					scale = 800/250;
				}
				canvas.width = layout.width/scale;
				canvas.height = layout.height/scale;
				
				if (layout.bgimage != null) {
					var layout_bgimage = new Image();
					layout_bgimage.src = '/pixsigdata' + layout.bgimage.filepath;
					layout_bgimage.onload = function(img, layout, ctx, canvaswidth, canvasheight) {
						return function() {
							//ctx.globalAlpha = 0.2;
							ctx.drawImage(img, 0, 0, canvaswidth, canvasheight);
							for (var j=0; j<layout.layoutdtls.length; j++) {
								var layoutdtl = layout.layoutdtls[j];
								var width = layoutdtl.width/scale;
								var height = layoutdtl.height/scale;
								var top = layoutdtl.topoffset/scale;
								var left = layoutdtl.leftoffset/scale;
								drawCanvasRegion(ctx, layoutdtl, left, top, width, height, false);
							}
						}
					}(layout_bgimage, layout, ctx, canvas.width, canvas.height);
				} else {
					for (var j=0; j<layout.layoutdtls.length; j++) {
						var layoutdtl = layout.layoutdtls[j];
						var left = layoutdtl.leftoffset/scale;
						var top = layoutdtl.topoffset/scale;
						var width = layoutdtl.width/scale;
						var height = layoutdtl.height/scale;
						drawCanvasRegion(ctx, layoutdtl, left, top, width, height, true);
					}
				}

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
					bootbox.alert(common.tips.error);
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
					bootbox.alert(common.tips.error);
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
	$("#LayoutBgImageSelect2").select2({
		placeholder: common.tips.detail_select,
		minimumInputLength: 0,
		ajax: {
			url: myurls['image.list'],
			type: 'GET',
			dataType: 'json',
			data: function (term, page) {
				return {
					sSearch: term,
					iDisplayStart: (page-1)*10,
					iDisplayLength: 10,
				};
			},
			results: function (data, page) {
				var more = (page * 10) < data.iTotalRecords; 
				return {
					results : $.map(data.aaData, function (item) { 
						return { 
							text:item.name, 
							id:item.imageid, 
							filepath:item.filepath, 
						};
					}),
					more: more
				};
			}
		},
		formatResult: function (media) {
			var html = '<span><img src="/pixsigdata' + media.filepath + '" height="25" /> ' + media.text + '</span>'
			return html;
		},
		formatSelection: function (media) {
			var html = '<span><img src="/pixsigdata' + media.filepath + '" height="25" /> ' + media.text + '</span>'
			return html;
		},
		initSelection: function(element, callback) {
			if (CurrentLayout != null && CurrentLayout.bgimage != null) {
				callback({id: CurrentLayout.bgimage.imageid, text: CurrentLayout.bgimage.name, filepath: CurrentLayout.bgimage.filepath });
			}
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});

	$('#LayoutdtlEditForm').css('display' , 'none');
	$('#LayoutEditForm').css('display' , 'block');
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	if (CurrentLayout.width > CurrentLayout.height) {
		$('#LayoutModal .modal-dialog').removeClass('modal-layout2');
		$('#LayoutModal .modal-dialog').addClass('modal-layout1');
		$('#LayoutCol1').removeClass('col-md-6');
		$('#LayoutCol1').removeClass('col-sm-6');
		$('#LayoutCol1').addClass('col-md-8');
		$('#LayoutCol1').addClass('col-sm-8');
		$('#LayoutCol2').removeClass('col-md-6');
		$('#LayoutCol2').removeClass('col-sm-6');
		$('#LayoutCol2').addClass('col-md-4');
		$('#LayoutCol2').addClass('col-sm-4');
	} else {
		$('#LayoutModal .modal-dialog').removeClass('modal-layout1');
		$('#LayoutModal .modal-dialog').addClass('modal-layout2');
		$('#LayoutCol1').removeClass('col-md-8');
		$('#LayoutCol1').removeClass('col-sm-8');
		$('#LayoutCol1').addClass('col-md-6');
		$('#LayoutCol1').addClass('col-sm-6');
		$('#LayoutCol2').removeClass('col-md-4');
		$('#LayoutCol2').removeClass('col-sm-4');
		$('#LayoutCol2').addClass('col-md-6');
		$('#LayoutCol2').addClass('col-sm-6');
	}
	
	$('#LayoutDiv').attr('layoutid', CurrentLayout.layoutid);
	$('#LayoutDiv').attr('style', 'position:relative; margin-left:auto; margin-right:auto; border: 1px solid #000; background:#000000;');
	redrawLayout();
	$('#LayoutModal').modal();
	
});

$('#LayoutModal').on('shown.bs.modal', function (e) {
	if (CurrentLayout != null) {
		var width = Math.floor($("#LayoutDiv").parent().width());
		var scale = CurrentLayout.width / width;
		var height = CurrentLayout.height / scale;
		$("#LayoutDiv").css("width" , width);
		$("#LayoutDiv").css("height" , height);
	}
})


//在设计对话框中进行提交
$('[type=submit]', $('#LayoutModal')).on('click', function(event) {
	if (CurrentLayoutdtl == null && leaveLayoutFocus(CurrentLayout) || CurrentLayoutdtl != null && leaveLayoutdtlFocus(CurrentLayoutdtl)) {
		for (var i=0; i<CurrentLayout.layoutdtls.length; i++) {
			if (('' + CurrentLayout.layoutdtls[i].layoutdtlid).indexOf('R') == 0) {
				CurrentLayout.layoutdtls[i].layoutdtlid = '0';
			}
		}
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
				bootbox.alert(common.tips.error);
			}
		});

		event.preventDefault();
	}
});	

