var myurls = {
	'common.list' : 'layout!list.action',
	'common.add' : 'layout!add.action',
	'common.update' : 'layout!update.action',
	'common.delete' : 'layout!delete.action',
	'layout.dtllist' : 'layout!dtllist.action',
	'layout.dtlsync' : 'layout!dtlsync.action',
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
var currentLayoutdtl = {};
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

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}

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
		layouthtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-layout"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		layouthtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
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

function refreshLayoutBgImageSelect() {
	$("#LayoutBgImageSelect").select2({
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
			var html = '<span><img src="/pixsigdata' + media.filepath + '" height="40" /> ' + media.text + '</span>'
			return html;
		},
		formatSelection: function (media) {
			var html = '<span><img src="/pixsigdata' + media.filepath + '" height="40" /> ' + media.text + '</span>'
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
			var html = '<span><img src="/pixsigdata' + media.filepath + '" height="40" /> ' + media.text + '</span>'
			return html;
		},
		formatSelection: function (media) {
			var html = '<span><img src="/pixsigdata' + media.filepath + '" height="40" /> ' + media.text + '</span>'
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
	$('.layout-ratio').css('display', 'block');
	currentLayout = null;
	currentLayoutid = 0;
	refreshLayoutBgImageSelect();
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
	refreshLayoutBgImageSelect();
	$('#MyEditModal').modal();
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

function updateRegionInfo(e, ui) {
	var pos = $(this).position();
	var scale = $(this).attr("scale");
	var name = $(this).attr("name");
	$('.region-tip', this).html(name + ' ' + Math.round($(this).width() * scale, 0) + " x " + Math.round($(this).height() * scale, 0) + " (" + Math.round(pos.left * scale, 0) + "," + Math.round(pos.top * scale, 0) + ")");
}

function regionPositionUpdate(e, ui) {
	var width 	= $(this).css("width");
	var height 	= $(this).css("height");
	var top 	= $(this).css("top");
	var left 	= $(this).css("left");
	var layoutdtlid = $(this).attr("layoutdtlid");
	var name = $(this).attr("name");
	var scale = $(this).attr("scale");
	var pos = $(this).position();

	// Update the layoutdtl width / height attributes
	$(this).attr("width", width).attr("height", height);
	$('.region-tip', this).html(name + ' ' + Math.round($(this).width() * scale, 0) + " x " + Math.round($(this).height() * scale, 0) + " (" + Math.round(pos.left * scale, 0) + "," + Math.round(pos.top * scale, 0) + ")");

	var layoutdtls = tempLayoutdtls.filter(function (el) {
		return el.layoutdtlid == layoutdtlid;
	});
	layoutdtls[0].width = Math.round($(this).width() * scale, 0);
	layoutdtls[0].height = Math.round($(this).height() * scale, 0);
	layoutdtls[0].leftoffset = Math.round(pos.left * scale, 0);
	layoutdtls[0].topoffset = Math.round(pos.top * scale, 0);
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
	layoutdtlhtml += 'scale="' + currentLayout.scale + '" width="' + layoutdtl.width/currentLayout.scale + 'px" height="' + layoutdtl.height/currentLayout.scale + 'px" ';
	layoutdtlhtml += 'ondblclick="" ';
	layoutdtlhtml += 'class="region ui-draggable ui-resizable" ';
	layoutdtlhtml += 'style="position:absolute; width:' + layoutdtl.width/currentLayout.scale + 'px; height:' + layoutdtl.height/currentLayout.scale + 'px; top: ' + layoutdtl.topoffset/currentLayout.scale + 'px; left: ' + layoutdtl.leftoffset/currentLayout.scale + 'px;">';
	layoutdtlhtml += ' <div id="region_bg_' + layoutdtl.layoutdtlid + '" style="width:100%; height:100%; position:absolute; background-color:' + RegionColors[layoutdtl.regionid] + '; opacity:.80; filter:alpha(opacity=80);">';
	if (layoutdtl.bgimage != null) {
		layoutdtlhtml += '<img src="/pixsigdata' + layoutdtl.bgimage.filepath+ '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />';
	}
	layoutdtlhtml += '</div>';

	layoutdtlhtml += ' <div class="btn-group" style="z-index:50;">';
	layoutdtlhtml += ' <a class="btn btn-circle btn-default btn-xs" href="javascript:;" data-toggle="dropdown">';
	layoutdtlhtml += ' <i class="fa ' + RegionIcons[layoutdtl.regionid] + '"></i> ' +  layoutdtl.region.name + ' <i class="fa fa-angle-down"></i>';
	layoutdtlhtml += ' </a>';
	layoutdtlhtml += ' <ul class="dropdown-menu" role="menu">';
	layoutdtlhtml += ' <li><a class="pix-region-update" data-id="' + layoutdtl.layoutdtlid + '" href="javascript:;"><i class="fa fa-cog"></i> ' + common.view.option + ' </a></li>';
	layoutdtlhtml += ' <li><a class="pix-region-delete" data-id="' + layoutdtl.layoutdtlid + '" href="javascript:;"><i class="fa fa-trash-o"></i> ' + common.view.remove + ' </a></li>';
	layoutdtlhtml += ' </ul></div>';
	
	layoutdtlhtml += '</div>';

	return layoutdtlhtml;
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
				tempLayoutdtls = data.aaData;
				currentLayout.scale = Math.max(currentLayout.width, currentLayout.height) / 800;
				$('#LayoutDiv').attr('layoutid', currentLayout.layoutid);
				if (currentLayout.width > currentLayout.height) {
					$('#LayoutDiv').attr('style', 'margin-left:auto; margin-right:auto; position:relative; width:802px; height:' + (2+800*currentLayout.height/currentLayout.width) + 'px; border: 1px solid #000; background:#000000;');
				} else {
					$('#LayoutDiv').attr('style', 'margin-left:auto; margin-right:auto; position:relative; width:' + (2+800*currentLayout.width/currentLayout.height) + 'px; height:802px; border: 1px solid #000; background:#000000;');
				}
				$('#LayoutDiv').empty();
				if (currentLayout.bgimage != null) {
					$('#LayoutDiv').append('<img src="/pixsigdata' + currentLayout.bgimage.filepath+ '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
				}
				for (var i=0; i<tempLayoutdtls.length; i++) {
					$('#LayoutDiv').append(generateRegionHtml(tempLayoutdtls[i]));
				}
				
				$('#LayoutDiv').each(function(){
					$(this).find(".region")
						.draggable({
							containment: this,
							stop: regionPositionUpdate,
							drag: updateRegionInfo
						})
						.resizable({
							containment: this,
							minWidth: 25,
							minHeight: 25,
							stop: regionPositionUpdate,
							resize: updateRegionInfo
						});
					});
				regionBtnUpdate();
				
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
	layoutdtl.height = 90*currentLayout.scale;
	layoutdtl.width = 160*currentLayout.scale;
	layoutdtl.topoffset = 50*currentLayout.scale;
	layoutdtl.leftoffset = 50*currentLayout.scale;
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
			containment: this,
			stop: regionPositionUpdate,
			drag: updateRegionInfo
		})
		.resizable({
			containment: this,
			minWidth: 25,
			minHeight: 25,
			stop: regionPositionUpdate,
			resize: updateRegionInfo
		});
	});
	regionBtnUpdate();
});

//区域中点击选项的下拉菜单
$('body').on('click', '.pix-region-update', function(event) {
	var layoutdtls = tempLayoutdtls.filter(function (el) {
		return el.layoutdtlid == $(event.target).attr("data-id");
	});
	currentLayoutdtl = layoutdtls[0];
	if (currentLayoutdtl.region.type == 0) {
		$('.textflag').css("display", "none");
		$('.dateflag').css("display", "none");
		$('.nontextflag').css("display", "block");
	} else if (currentLayoutdtl.region.type == 1) {
		$('.nontextflag').css("display", "none");
		$('.dateflag').css("display", "none");
		$('.textflag').css("display", "block");
	} else if (currentLayoutdtl.region.type == 2) {
		$('.nontextflag').css("display", "none");
		$('.textflag').css("display", "none");
		$('.dateflag').css("display", "block");
	}
	$('#LayoutdtlEditForm').loadJSON(currentLayoutdtl);
	$('.colorPick').colorpicker();
	$('.colorPick').colorpicker('setValue', currentLayoutdtl.color);
	$('.bgcolorPick').colorpicker();
	$('.bgcolorPick').colorpicker('setValue', currentLayoutdtl.bgcolor);
	refreshRegionBgImageSelect();
	$('#LayoutModal').modal('hide');
	$('#LayoutdtlEditModal').modal();
});			


////区域中点击删除的下拉菜单
$('body').on('click', '.pix-region-delete', function(event) {
	var layoutdtls = tempLayoutdtls.filter(function (el) {
		return el.layoutdtlid == $(event.target).attr("data-id");
	});
	$('#region_' + layoutdtls[0].layoutdtlid).remove();
	tempLayoutdtls.splice(tempLayoutdtls.indexOf(layoutdtls[0]), 1);
	regionBtnUpdate();
});			


//在设计对话框中进行提交
$('[type=submit]', $('#LayoutModal')).on('click', function(event) {
	for (var i=0; i<tempLayoutdtls.length; i++) {
		if (('' + tempLayoutdtls[i].layoutdtlid).indexOf('R') == 0) {
			tempLayoutdtls[i].layoutdtlid = '0';
		}
	}
	$.ajax({
		type : 'POST',
		url : myurls['layout.dtlsync'],
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
});	


//==============================修改区域选项对话框====================================			
FormValidateOption.rules['volume'] = {};
FormValidateOption.rules['volume']['required'] = true;
FormValidateOption.rules['volume']['number'] = true;
FormValidateOption.rules['volume']['min'] = 0;
FormValidateOption.rules['volume']['max'] = 100;
FormValidateOption.rules['size'] = {};
FormValidateOption.rules['size']['required'] = true;
FormValidateOption.rules['size']['number'] = true;
FormValidateOption.rules['size']['min'] = 10;
FormValidateOption.rules['size']['max'] = 100;
FormValidateOption.rules['opacity'] = {};
FormValidateOption.rules['opacity']['required'] = true;
FormValidateOption.rules['opacity']['number'] = true;
FormValidateOption.rules['opacity']['min'] = 0;
FormValidateOption.rules['opacity']['max'] = 255;
FormValidateOption.rules['width'] = {};
FormValidateOption.rules['width']['required'] = true;
FormValidateOption.rules['width']['number'] = true;
FormValidateOption.rules['height'] = {};
FormValidateOption.rules['height']['required'] = true;
FormValidateOption.rules['height']['number'] = true;
FormValidateOption.rules['leftoffset'] = {};
FormValidateOption.rules['leftoffset']['required'] = true;
FormValidateOption.rules['leftoffset']['number'] = true;
FormValidateOption.rules['topoffset'] = {};
FormValidateOption.rules['topoffset']['required'] = true;
FormValidateOption.rules['topoffset']['number'] = true;
FormValidateOption.rules['zindex'] = {};
FormValidateOption.rules['zindex']['required'] = true;
FormValidateOption.rules['zindex']['number'] = true;
$('#LayoutdtlEditForm').validate(FormValidateOption);


//在修改区域选项对话框中进行提交
$('[type=submit]', $('#LayoutdtlEditModal')).on('click', function(event) {
	if ($('#LayoutdtlEditForm').valid()) {
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();

		currentLayoutdtl.intervaltime = $('#LayoutdtlEditModal input[name=intervaltime]').attr("value");
		currentLayoutdtl.fitflag = $('#LayoutdtlEditModal input[name=fitflag]:checked').attr("value");
		currentLayoutdtl.volume = $('#LayoutdtlEditModal input[name=volume]').attr("value");
		currentLayoutdtl.direction = $('#LayoutdtlEditModal input[name=direction]:checked').attr("value");
		currentLayoutdtl.speed = $('#LayoutdtlEditModal input[name=speed]:checked').attr("value");
		currentLayoutdtl.color = $('#LayoutdtlEditModal input[name=color]').attr("value");
		currentLayoutdtl.size = $('#LayoutdtlEditModal input[name=size]').attr("value");
		currentLayoutdtl.dateformat = $('#LayoutdtlEditModal select[name=dateformat]').val();

		if ($('#RegionBgImageSelect').select2('data') != null) {
			currentLayoutdtl.bgimageid =  $('#RegionBgImageSelect').select2('data').id;
			currentLayoutdtl.bgimage = {};
			currentLayoutdtl.bgimage.imageid = $('#RegionBgImageSelect').select2('data').id;
			currentLayoutdtl.bgimage.name = $('#RegionBgImageSelect').select2('data').text;
			currentLayoutdtl.bgimage.filepath = $('#RegionBgImageSelect').select2('data').filepath;
		}
		currentLayoutdtl.bgcolor = $('#LayoutdtlEditModal input[name=bgcolor]').attr("value");
		currentLayoutdtl.opacity = $('#LayoutdtlEditModal input[name=opacity]').attr("value");
		currentLayoutdtl.zindex = $('#LayoutdtlEditModal input[name=zindex]').attr("value");
		
		currentLayoutdtl.width = $('#LayoutdtlEditModal input[name=width]').attr("value");
		currentLayoutdtl.height = $('#LayoutdtlEditModal input[name=height]').attr("value");
		currentLayoutdtl.leftoffset = $('#LayoutdtlEditModal input[name=leftoffset]').attr("value");
		currentLayoutdtl.topoffset = $('#LayoutdtlEditModal input[name=topoffset]').attr("value");

		var regiondiv = $('#region_' + currentLayoutdtl.layoutdtlid);
		regiondiv.attr('width', currentLayoutdtl.width/currentLayout.scale + 'px');
		regiondiv.attr('height', currentLayoutdtl.height/currentLayout.scale + 'px');
		regiondiv.attr('style', 'position:absolute; width:' + currentLayoutdtl.width/currentLayout.scale + 'px; height:' + currentLayoutdtl.height/currentLayout.scale + 'px; top: ' + currentLayoutdtl.topoffset/currentLayout.scale + 'px; left: ' + currentLayoutdtl.leftoffset/currentLayout.scale + 'px;');
		if (currentLayoutdtl.bgimage != null) {
			var regionbgdiv = $('#region_bg_' + currentLayoutdtl.layoutdtlid);
			regionbgdiv.empty();
			regionbgdiv.append('<img src="/pixsigdata' + currentLayoutdtl.bgimage.filepath+ '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
		}
		
		$('.region-tip', regiondiv).html(regiondiv.attr('name') + ' ' + currentLayoutdtl.width + " x " + currentLayoutdtl.height + " (" + currentLayoutdtl.leftoffset + "," + currentLayoutdtl.topoffset + ")");

		$('#LayoutdtlEditModal').modal('hide');
	}
});	
