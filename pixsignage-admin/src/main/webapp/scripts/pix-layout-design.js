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

var RegionColors = [];
RegionColors[0] = '#BCC2F2';
RegionColors[1] = '#99CCFF';
RegionColors[2] = '#CCCC99';
RegionColors[3] = '#CCCC99';
RegionColors[4] = '#FFCCCC';
RegionColors[5] = '#FF99CC';
RegionColors[6] = '#CC99CC';
RegionColors[7] = '#FFFF99';
RegionColors[8] = '#CC9966';
RegionColors[9] = '#CC9966';

var RegionIcons = [];
RegionIcons[0] = 'fa-bank';
RegionIcons[1] = 'fa-bank';
RegionIcons[2] = 'fa-file-text-o';
RegionIcons[3] = 'fa-file-text-o';
RegionIcons[4] = 'fa-delicious';
RegionIcons[5] = 'fa-delicious';
RegionIcons[6] = 'fa-delicious';
RegionIcons[7] = 'fa-delicious';
RegionIcons[8] = 'fa-calendar-o';
RegionIcons[9] = 'fa-calendar-o';

var currentLayoutid = 0;
var currentLayout;
var currentLayoutdtl;
var tempRegions;
var tempLayoutdtls;

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
		if (iDisplayIndex % 2 == 0) {
			layouthtml = '';
			layouthtml += '<div class="row" >';
		}
		layouthtml += '<div class="col-md-6 col-xs-6">';
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
		if ((iDisplayIndex+1) % 2 == 0 || (iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
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
					scale = 1920/400;
				} else {
					scale = 800/400;
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

function refreshLayoutBgImageSelect1() {
	$("#LayoutBgImageSelect1").select2({
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
			if (currentLayout != null && currentLayout.bgimage != null) {
				callback({id: currentLayout.bgimage.imageid, text: currentLayout.bgimage.name, filepath: currentLayout.bgimage.filepath });
			}
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});
}

function refreshRegionBgImageSelect() {
	$("#RegionBgImageSelect").select2({
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
			if (currentLayoutdtl != null && currentLayoutdtl.bgimage != null) {
				callback({id: currentLayoutdtl.bgimage.imageid, text: currentLayoutdtl.bgimage.name, filepath: currentLayoutdtl.bgimage.filepath });
			}
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});
}


OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
FormValidateOption.rules['layout.name'] = {};
FormValidateOption.rules['layout.name']['required'] = true;
FormValidateOption.rules['layout.name']['minlength'] = 2;
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
	currentLayout = null;
	currentLayoutid = 0;
	refreshLayoutBgImageSelect1();
	$('#MyEditModal').modal();
});			


$('body').on('click', '.pix-update', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	currentLayout = $('#MyTable').dataTable().fnGetData(index);
	currentLayoutid = currentLayout.layoutid;

	var action = myurls['common.update'];
	var formdata = new Object();
	for (var name in currentLayout) {
		formdata['layout.' + name] = currentLayout[name];
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
	currentLayout = $('#MyTable').dataTable().fnGetData(index);
	currentLayoutid = currentLayout.layoutid;
	bootbox.confirm(common.tips.synclayout, function(result) {
		if (result == true) {
			$.ajax({
				type : 'GET',
				url : 'layout!sync.action',
				cache: false,
				data : {
					layoutid: currentLayoutid,
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
	currentLayout = $('#MyTable').dataTable().fnGetData(index);
	currentLayoutid = currentLayout.layoutid;
	var action = myurls['common.delete'];
	
	bootbox.confirm(common.tips.remove + currentLayout.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : action,
				cache: false,
				data : {
					'layout.layoutid': currentLayoutid
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


$.ajax({
	type : "GET",
	url : myurls['layout.regionlist'],
	data : {},
	success : function(data, status) {
		if (data.errorcode == 0) {
			tempRegions = data.aaData;
		} else {
			bootbox.alert(common.tips.error + data.errormsg);
		}
	},
	error : function() {
		bootbox.alert(common.tips.error);
	}
});

function regionPositionUpdate(e, ui) {
	var w = $(this).width() / $('#LayoutDiv').width();
	var h = $(this).height() / $('#LayoutDiv').height();
	var l = $(this).position().left / $('#LayoutDiv').width();
	var t = $(this).position().top / $('#LayoutDiv').height();
	$(this).css("width" , (100 * parseFloat(w)) + '%');
	$(this).css("height" , (100 * parseFloat(h)) + '%');
	$(this).css("left" , (100 * parseFloat(l)) + '%');
	$(this).css("top" , (100 * parseFloat(t)) + '%');

	var layoutdtlid = $(this).attr("layoutdtlid");
	var layoutdtls = tempLayoutdtls.filter(function (el) {
		return el.layoutdtlid == layoutdtlid;
	});
	layoutdtls[0].width = Math.round(currentLayout.width * w, 0);
	layoutdtls[0].height = Math.round(currentLayout.height * h, 0);
	layoutdtls[0].leftoffset = Math.round(currentLayout.width * l, 0);
	layoutdtls[0].topoffset = Math.round(currentLayout.height * t, 0);

	if (currentLayoutdtl != null && layoutdtls[0].layoutdtlid == currentLayoutdtl.layoutdtlid) {
		refreshSpinners();
	}
}

function regionBtnUpdate() {
	var regionbtnhtml = '';
	regionbtnhtml += '<a class="btn default btn-sm yellow" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"><i class="fa fa-plus"></i> ' + common.view.addregion + '  <i class="fa fa-angle-down"></i></a>';
	regionbtnhtml += '<ul class="dropdown-menu pull-right">';
	for (var i=0; i<tempRegions.length; i++) {
		var region = tempRegions[i];
		var layoutdtls = tempLayoutdtls.filter(function (el) {
			return el.regionid == region.regionid;
		});
		if (layoutdtls.length > 0) {
			regionbtnhtml += '<li><a href="javascript:;" data-id="" class="btn-sm disabled-link"><span class="disable-target">'+ region.name + ' </span></a></li>';
		} else {
			regionbtnhtml += '<li><a href="javascript:;" data-id="' + i + '" class="btn-sm pix-addregion"> '+ region.name + '</a></li>';
		}
	}
	regionbtnhtml += '</ul>';
	$('#RegionBtn').empty();
	$('#RegionBtn').append(regionbtnhtml);
}

function generateRegionHtml(layoutdtl) {
	var layoutdtlhtml = '';
	layoutdtlhtml += '<div id="region_' + layoutdtl.layoutdtlid + '" regionenabled="1" layoutdtlid="' + layoutdtl.layoutdtlid + '" name="' + layoutdtl.region.name + '"';
	layoutdtlhtml += 'ondblclick="" ';
	layoutdtlhtml += 'class="region ui-draggable ui-resizable" ';
	layoutdtlhtml += 'style="position: absolute; width:' + 100*layoutdtl.width/currentLayout.width + '%; height:' + 100*layoutdtl.height/currentLayout.height + '%; top: ' + 100*layoutdtl.topoffset/currentLayout.height + '%; left: ' + 100*layoutdtl.leftoffset/currentLayout.width + '%;">';
	layoutdtlhtml += ' <div id="region_bg_' + layoutdtl.layoutdtlid + '" style="position:absolute; width:100%; height:100%; background-color:' + RegionColors[layoutdtl.regionid] + '; opacity:.80; filter:alpha(opacity=80);">';
	if (layoutdtl.bgimage != null) {
		layoutdtlhtml += '<img src="/pixsigdata' + layoutdtl.bgimage.filepath+ '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
	}
	layoutdtlhtml += '<div id="region_selected_' + layoutdtl.layoutdtlid + '" width="100%" height="100%" style="display:none;position:absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0; background-color:#696969; opacity:.80; filter:alpha(opacity=80);" />';
	layoutdtlhtml += '</div>';

	layoutdtlhtml += '<div class="btn-group" style="z-index:50;">';
	layoutdtlhtml += ' <label class="btn btn-circle btn-default btn-xs">';
	layoutdtlhtml += ' <i class="fa ' + RegionIcons[layoutdtl.regionid] + '"></i> ' +  layoutdtl.region.name;
	layoutdtlhtml += ' </label>';
	layoutdtlhtml += ' <a class="btn btn-circle btn-default btn-xs pix-region-delete" data-id="' + layoutdtl.layoutdtlid + '" href="javascript:;">';
	layoutdtlhtml += ' <i class="fa fa-trash-o"></i> ';
	layoutdtlhtml += ' </a>';
	layoutdtlhtml += '</div>';
	
	layoutdtlhtml += '</div>';

	return layoutdtlhtml;
}

function redrawLayout() {
	$('#LayoutDiv').empty();
	if (currentLayout.bgimage != null) {
		$('#LayoutDiv').append('<img class="layout-bg" src="/pixsigdata' + currentLayout.bgimage.filepath+ '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
	}
	for (var i=0; i<tempLayoutdtls.length; i++) {
		$('#LayoutDiv').append(generateRegionHtml(tempLayoutdtls[i]));
	}
	$('#LayoutDiv').each(function(){
		$(this).find(".region")
			.draggable({
				containment: $('#LayoutDiv'),
				stop: regionPositionUpdate,
				drag: regionPositionUpdate
			})
			.resizable({
				containment: $('#LayoutDiv'),
				minWidth: 25,
				minHeight: 25,
				stop: regionPositionUpdate,
				resize: regionPositionUpdate
			});
		});
	regionBtnUpdate();
}

function refreshSpinners() {
	$('#spinner-x').spinner();
	$('#spinner-y').spinner();
	$('#spinner-w').spinner();
	$('#spinner-h').spinner();
	$('#spinner-x').spinner('setting', {value:parseInt(currentLayoutdtl.leftoffset), step: 1, min: 0, max: parseInt(currentLayout.width)-parseInt(currentLayoutdtl.width)});
	$('#spinner-y').spinner('setting', {value:parseInt(currentLayoutdtl.topoffset), step: 1, min: 0, max: parseInt(currentLayout.height)-parseInt(currentLayoutdtl.height)});
	$('#spinner-w').spinner('setting', {value:parseInt(currentLayoutdtl.width), step: 1, min: 1, max: parseInt(currentLayout.width)-parseInt(currentLayoutdtl.leftoffset)});
	$('#spinner-h').spinner('setting', {value:parseInt(currentLayoutdtl.height), step: 1, min: 1, max: parseInt(currentLayout.height)-parseInt(currentLayoutdtl.topoffset)});
}

//================================ 布局主页 =========================================
//在列表页面中点击布局设计
$('body').on('click', '.pix-layout', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	currentLayout = $('#MyTable').dataTable().fnGetData(index);
	currentLayoutid = currentLayout.layoutid;
	currentLayoutdtl = null;
	
	$('#LayoutEditForm').loadJSON(currentLayout);
	$('#LayoutEditForm .layout-title').html(currentLayout.name);
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
			if (currentLayout != null && currentLayout.bgimage != null) {
				callback({id: currentLayout.bgimage.imageid, text: currentLayout.bgimage.name, filepath: currentLayout.bgimage.filepath });
			}
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});

	$.ajax({
		type : "GET",
		url : myurls['layout.dtllist'],
		data : {'layoutid' : currentLayoutid},
		beforeSend: function ( xhr ) {
			Metronic.startPageLoading({animate: true});
		},
		success : function(data, status) {
			Metronic.stopPageLoading();
			if (data.errorcode == 0) {
				$('#LayoutdtlEditForm').css('display' , 'none');
				$('#LayoutEditForm').css('display' , 'block');
				$('.form-group').removeClass('has-error');
				$('.help-block').remove();
				if (currentLayout.width > currentLayout.height) {
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
				
				tempLayoutdtls = data.aaData;
				$('#LayoutDiv').attr('layoutid', currentLayout.layoutid);
				$('#LayoutDiv').attr('style', 'position:relative; margin-left:auto; margin-right:auto; border: 1px solid #000; background:#000000;');
				redrawLayout();
				$('#LayoutModal').modal();
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

FormValidateOption.rules = {};
FormValidateOption.rules['name'] = {};
FormValidateOption.rules['name']['required'] = true;
FormValidateOption.rules['name']['minlength'] = 2;
$('#LayoutEditForm').validate(FormValidateOption);

$(window).resize(function(e) {
	if (currentLayout != null && e.target == this) {
		var width = Math.floor($("#LayoutDiv").parent().width());
		var scale = currentLayout.width / width;
		var height = currentLayout.height / scale;
		$("#LayoutDiv").css("width" , width);
		$("#LayoutDiv").css("height" , height);
	}
});

$('#LayoutModal').on('shown.bs.modal', function (e) {
	if (currentLayout != null) {
		var width = Math.floor($("#LayoutDiv").parent().width());
		var scale = currentLayout.width / width;
		var height = currentLayout.height / scale;
		$("#LayoutDiv").css("width" , width);
		$("#LayoutDiv").css("height" , height);
	}
})

function leaveLayoutFocus(layout) {
	if ($('#LayoutEditForm').valid()) {
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();

		layout.name = $('#LayoutEditForm input[name=name]').attr('value');
		if ($('#LayoutBgImageSelect2').select2('data') != null) {
			layout.bgimageid =  $('#LayoutBgImageSelect2').select2('data').id;
			layout.bgimage = {};
			layout.bgimage.imageid = $('#LayoutBgImageSelect2').select2('data').id;
			layout.bgimage.name = $('#LayoutBgImageSelect2').select2('data').text;
			layout.bgimage.filepath = $('#LayoutBgImageSelect2').select2('data').filepath;
		}
		layout.description = $('#LayoutEditForm textarea').val();
		return true;
	}
	return false;
}

function leaveLayoutdtlFocus(layoutdtl) {
	if ($('#LayoutdtlEditForm').valid()) {
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();

		layoutdtl.intervaltime = $('#LayoutdtlEditForm input[name=intervaltime]').attr('value');
		layoutdtl.fitflag = $('#LayoutdtlEditForm input[name=fitflag]:checked').attr('value');
		layoutdtl.volume = $('#LayoutdtlEditForm input[name=volume]').attr('value');
		layoutdtl.direction = $('#LayoutdtlEditForm input[name=direction]:checked').attr('value');
		layoutdtl.speed = $('#LayoutdtlEditForm input[name=speed]:checked').attr('value');
		layoutdtl.color = $('#LayoutdtlEditForm input[name=color]').attr('value');
		layoutdtl.size = $('#LayoutdtlEditForm input[name=size]').attr('value');
		layoutdtl.dateformat = $('#LayoutdtlEditForm select[name=dateformat]').val();

		if ($('#RegionBgImageSelect').select2('data') != null) {
			layoutdtl.bgimageid =  $('#RegionBgImageSelect').select2('data').id;
			layoutdtl.bgimage = {};
			layoutdtl.bgimage.imageid = $('#RegionBgImageSelect').select2('data').id;
			layoutdtl.bgimage.name = $('#RegionBgImageSelect').select2('data').text;
			layoutdtl.bgimage.filepath = $('#RegionBgImageSelect').select2('data').filepath;
		}
		layoutdtl.bgcolor = $('#LayoutdtlEditForm input[name=bgcolor]').attr('value');
		layoutdtl.opacity = $('#LayoutdtlEditForm input[name=opacity]').attr('value');
		layoutdtl.zindex = $('#LayoutdtlEditForm input[name=zindex]:checked').attr('value');
		
		//layoutdtl.leftoffset = $('#LayoutdtlEditForm input[name=leftoffset]').attr('value');
		//layoutdtl.topoffset = $('#LayoutdtlEditForm input[name=topoffset]').attr('value');
		//layoutdtl.width = $('#LayoutdtlEditForm input[name=width]').attr('value');
		//layoutdtl.height = $('#LayoutdtlEditForm input[name=height]').attr('value');

		var regiondiv = $('#region_' + layoutdtl.layoutdtlid);
		regiondiv.attr('style', 'position:absolute; width:' + 100*layoutdtl.width/currentLayout.width + '%; height:' + 100*layoutdtl.height/currentLayout.height + '%; top: ' + 100*layoutdtl.topoffset/currentLayout.height + '%; left: ' + 100*layoutdtl.leftoffset/currentLayout.width + '%;');
		if (layoutdtl.bgimage != null) {
			var regionbgdiv = $('#region_bg_' + layoutdtl.layoutdtlid);
			regionbgdiv.empty();
			regionbgdiv.append('<img src="/pixsigdata' + layoutdtl.bgimage.filepath+ '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
			regionbgdiv.append('<div id="region_selected_' + layoutdtl.layoutdtlid + '" width="100%" height="100%" style="display:none;position:absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0; background-color:#696969; opacity:.80; filter:alpha(opacity=80);" />');
		}

		$('#region_selected_' + layoutdtl.layoutdtlid).css('display' , 'none');
		return true;
	}
	return false;
}

function enterLayoutdtlFocus(layoutdtl) {
	$('#LayoutEditForm').css('display' , 'none');
	$('#LayoutdtlEditForm').css('display' , 'block');
	$('#region_selected_' + layoutdtl.layoutdtlid).css('display' , 'block');
	$('.region-title').html(layoutdtl.region.name);
	if (layoutdtl.region.type == 0) {
		$('.textflag').css("display", "none");
		$('.dateflag').css("display", "none");
		$('.nontextflag').css("display", "block");
	} else if (layoutdtl.region.type == 1) {
		$('.nontextflag').css("display", "none");
		$('.dateflag').css("display", "none");
		$('.textflag').css("display", "block");
	} else if (layoutdtl.region.type == 2) {
		$('.nontextflag').css("display", "none");
		$('.textflag').css("display", "none");
		$('.dateflag').css("display", "block");
	}
	$('#LayoutdtlEditForm').loadJSON(layoutdtl);
	$('.colorPick').colorpicker();
	$('.colorPick').colorpicker('setValue', layoutdtl.color);
	$('.bgcolorPick').colorpicker();
	$('.bgcolorPick').colorpicker('setValue', layoutdtl.bgcolor);
	$(".intervalRange").ionRangeSlider({
		min: 5,
		max: 60,
		from: 10,
		type: 'single',
		step: 5,
		hasGrid: false
	});
	$(".intervalRange").ionRangeSlider("update", {
		from: layoutdtl.intervaltime
	});
	$(".sizeRange").ionRangeSlider({
		min: 10,
		max: 100,
		from: 50,
		type: 'single',
		step: 10,
		hasGrid: false
	});
	$(".sizeRange").ionRangeSlider("update", {
		from: layoutdtl.size
	});
	$(".volumeRange").ionRangeSlider({
		min: 0,
		max: 100,
		from: 0,
		type: 'single',
		step: 5,
		hasGrid: false
	});
	$(".volumeRange").ionRangeSlider("update", {
		from: layoutdtl.volume
	});
	$(".opacityRange").ionRangeSlider({
		min: 0,
		max: 255,
		from: 255,
		type: 'single',
		step: 5,
		hasGrid: false
	});
	$(".opacityRange").ionRangeSlider("update", {
		from: layoutdtl.opacity
	});
	refreshSpinners();
	refreshRegionBgImageSelect();	
}

$('#LayoutDiv').click(function(e){
	var scale = currentLayout.width / $('#LayoutDiv').width();
	var offset = $(this).offset();
	var posX = (e.pageX - offset.left) * scale;
	var posY = (e.pageY - offset.top) * scale;
	var layoutdtls = tempLayoutdtls.filter(function (el) {
		var width = parseInt(el.width);
		var height = parseInt(el.height);
		var leftoffset = parseInt(el.leftoffset);
		var topoffset = parseInt(el.topoffset);
		return (posX > leftoffset) && (posX < (leftoffset + width)) && (posY > topoffset) && (posY < (topoffset + height));
	});
	if (layoutdtls.length > 0) {
		layoutdtls.sort(function(a, b) {
			return (a.width + a.height - b.width - b.height);
		});
		/*
		var index = 10000;
		for (var i=0; i<layoutdtls.length; i++) {
			if (currentLayoutdtl != null && currentLayoutdtl.regionid == layoutdtls[i].regionid) {
				index = i;
				break;
			}
		}
		var oldLayoutdtl = currentLayoutdtl;
		if (index >= (layoutdtls.length -1)) {
			currentLayoutdtl = layoutdtls[0];
		} else {
			currentLayoutdtl = layoutdtls[index+1];
		}*/

		if (currentLayoutdtl == null && leaveLayoutFocus(currentLayout) || currentLayoutdtl != null && leaveLayoutdtlFocus(currentLayoutdtl)) {
			currentLayoutdtl = layoutdtls[0];
			enterLayoutdtlFocus(currentLayoutdtl);
		}
	}
});

$('#RegionBgImageSelect').on('change', function(e) {
	if ($('#RegionBgImageSelect').select2('data') != null) {
		currentLayoutdtl.bgimageid = $('#RegionBgImageSelect').select2('data').id;
		currentLayoutdtl.bgimage = {};
		currentLayoutdtl.bgimage.imageid = $('#RegionBgImageSelect').select2('data').id;
		currentLayoutdtl.bgimage.name = $('#RegionBgImageSelect').select2('data').text;
		currentLayoutdtl.bgimage.filepath = $('#RegionBgImageSelect').select2('data').filepath;
	}
	var regiondiv = $('#region_' + currentLayoutdtl.layoutdtlid);
	regiondiv.attr('style', 'position:absolute; width:' + 100*currentLayoutdtl.width/currentLayout.width + '%; height:' + 100*currentLayoutdtl.height/currentLayout.height + '%; top: ' + 100*currentLayoutdtl.topoffset/currentLayout.height + '%; left: ' + 100*currentLayoutdtl.leftoffset/currentLayout.width + '%;');
	if (currentLayoutdtl.bgimage != null) {
		var regionbgdiv = $('#region_bg_' + currentLayoutdtl.layoutdtlid);
		regionbgdiv.empty();
		regionbgdiv.append('<img src="/pixsigdata' + currentLayoutdtl.bgimage.filepath+ '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
	}
});	
$('#RegionBgImageRemove').on('click', function(e) {
	$('#RegionBgImageSelect').select2('val', '');
	currentLayoutdtl.bgimageid = 0;
	currentLayoutdtl.bgimage = null;
	redrawLayout();
	$('#region_selected_' + currentLayoutdtl.layoutdtlid).css('display' , 'block');
});	

$('#LayoutBgImageSelect2').on('change', function(e) {
	if ($('#LayoutBgImageSelect2').select2('data') != null) {
		currentLayout.bgimageid =  $('#LayoutBgImageSelect2').select2('data').id;
		currentLayout.bgimage = {};
		currentLayout.bgimage.imageid = $('#LayoutBgImageSelect2').select2('data').id;
		currentLayout.bgimage.name = $('#LayoutBgImageSelect2').select2('data').text;
		currentLayout.bgimage.filepath = $('#LayoutBgImageSelect2').select2('data').filepath;
	}
	if ($('#LayoutDiv .layout-bg').length == 0) {
		redrawLayout();
	} else {
		$('#LayoutDiv .layout-bg').attr('src', '/pixsigdata' + currentLayout.bgimage.filepath);
	}
});	
$('#LayoutBgImageRemove').on('click', function(e) {
	$('#LayoutBgImageSelect2').select2('val', '');
	currentLayout.bgimageid = 0;
	currentLayout.bgimage = null;
	redrawLayout();
});	

$('#spinner-x,#spinner-y,#spinner-w,#spinner-h').on("change", function(e) {
	currentLayoutdtl.leftoffset = $('#spinner-x').spinner('value');
	currentLayoutdtl.topoffset = $('#spinner-y').spinner('value');
	currentLayoutdtl.width = $('#spinner-w').spinner('value');
	currentLayoutdtl.height = $('#spinner-h').spinner('value');
	var regiondiv = $('#region_' + currentLayoutdtl.layoutdtlid);
	regiondiv.attr('style', 'position:absolute; width:' + 100*currentLayoutdtl.width/currentLayout.width + '%; height:' + 100*currentLayoutdtl.height/currentLayout.height + '%; top: ' + 100*currentLayoutdtl.topoffset/currentLayout.height + '%; left: ' + 100*currentLayoutdtl.leftoffset/currentLayout.width + '%;');

	refreshSpinners();
});	

//================================设计对话框=========================================
//在设计对话框中新增区域
$('body').on('click', '.pix-addregion', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	
	var layoutdtl = {};
	layoutdtl.layoutdtlid = 'R' + Math.round(Math.random()*100000000);
	layoutdtl.layoutid = currentLayoutid;
	layoutdtl.region = tempRegions[index];
	layoutdtl.regionid = tempRegions[index].regionid;
	layoutdtl.leftoffset = currentLayout.height * 0.1;
	layoutdtl.topoffset = currentLayout.width * 0.1;
	layoutdtl.width = currentLayout.width * 0.2;
	layoutdtl.height = currentLayout.height * 0.2;
	if (layoutdtl.region.type == 0) {
		layoutdtl.zindex = 0;
	} else {
		layoutdtl.zindex = 1;
	}
	layoutdtl.bgimageid = 0;
	layoutdtl.bgcolor = '#000000';
	if (currentLayout.bgimage != null) {
		layoutdtl.opacity = 0;
	} else {
		layoutdtl.opacity = 255;
	}
	layoutdtl.intervaltime = 10;
	layoutdtl.fitflag = 1;
	layoutdtl.volume = 50;
	layoutdtl.direction = 4;
	layoutdtl.speed = 2;
	layoutdtl.color = '#FFFFFF';
	layoutdtl.size = 50;
	layoutdtl.dateformat = 'yyyy-MM-dd HH:mm';
	tempLayoutdtls[tempLayoutdtls.length] = layoutdtl;
	
	$('#LayoutDiv').append(generateRegionHtml(layoutdtl));
	
	$('#LayoutDiv').each(function(){
	$('#region_'+layoutdtl.layoutdtlid)
		.draggable({
			containment: $('#LayoutDiv'),
			stop: regionPositionUpdate,
			drag: regionPositionUpdate
		})
		.resizable({
			containment: $('#LayoutDiv'),
			minWidth: 25,
			minHeight: 25,
			stop: regionPositionUpdate,
			resize: regionPositionUpdate
		});
	});
	regionBtnUpdate();
});

$('body').on('click', '.pix-region-delete', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	var layoutdtls = tempLayoutdtls.filter(function (el) {
		return el.layoutdtlid == index;
	});
	bootbox.confirm(common.tips.remove + layoutdtls[0].region.name, function(result) {
		if (result == true) {
			if (currentLayoutdtl != null && currentLayoutdtl.layoutdtlid == layoutdtls[0].layoutdtlid) {
				currentLayoutdtl = null;
				$('#LayoutdtlEditForm').css('display' , 'none');
				$('#LayoutEditForm .layout-title').html(currentLayout.name);
				$('#LayoutEditForm').css('display' , 'block');
				$('.form-group').removeClass('has-error');
				$('.help-block').remove();
			}
			$('#region_' + layoutdtls[0].layoutdtlid).remove();
			tempLayoutdtls.splice(tempLayoutdtls.indexOf(layoutdtls[0]), 1);
			regionBtnUpdate();
		}
	 });
});


//在设计对话框中进行提交
$('[type=submit]', $('#LayoutModal')).on('click', function(event) {
	if (currentLayoutdtl == null && leaveLayoutFocus(currentLayout) || currentLayoutdtl != null && leaveLayoutdtlFocus(currentLayoutdtl)) {
		for (var i=0; i<tempLayoutdtls.length; i++) {
			if (('' + tempLayoutdtls[i].layoutdtlid).indexOf('R') == 0) {
				tempLayoutdtls[i].layoutdtlid = '0';
			}
		}
		$.ajax({
			type : 'POST',
			url : myurls['layout.design'],
			data : '{"layout":' + $.toJSON(currentLayout) + ', "layoutdtls":' + $.toJSON(tempLayoutdtls) + '}',
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

