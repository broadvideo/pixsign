var myurls = {
	'common.list' : 'layout!list.action',
	'common.add' : 'layout!add.action',
	'common.update' : 'layout!update.action',
	'common.delete' : 'layout!delete.action',
	'layout.dtllist' : 'layout!dtllist.action',
	'layout.dtlsync' : 'layout!dtlsync.action',
	'layout.regionlist' : 'layout!regionlist.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}

function initMyTable() {
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
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var data = $('#MyTable').dataTable().fnGetData(iDisplayIndex);
			
			var ratioHtml = '';
			if (data['ratio'] == 1) {
				ratioHtml = common.view.ratio_1;
			} else if (data['ratio'] == 2) {
				ratioHtml = common.view.ratio_2;
			} else if (data['ratio'] == 3) {
				ratioHtml = common.view.ratio_3;
			} else if (data['ratio'] == 4) {
				ratioHtml = common.view.ratio_4;
			} 
			$('td:eq(1)', nRow).html(ratioHtml);
			var typeHtml = '';
			if (data['type'] == 0) {
				typeHtml = common.view.type_0;
			} else if (data['type'] == 1) {
				typeHtml = common.view.type_1;
			} 
			$('td:eq(2)', nRow).html(typeHtml);
			
			var dropdownBtn = '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-layout"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
			dropdownBtn += '&nbsp;&nbsp;<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
			dropdownBtn += '&nbsp;&nbsp;<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
			$('td:eq(3)', nRow).html(dropdownBtn);
			return nRow;
		}
	});

	var currentItem;
	$('body').on('click', '.pix-delete', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		currentItem = $('#MyTable').dataTable().fnGetData(index);
		var action = myurls['common.delete'];
		
		bootbox.confirm(common.tips.remove + currentItem.name, function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : action,
					cache: false,
					data : {
						'layout.layoutid': currentItem['layoutid']
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
}


function initMyEditModal() {
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
		$('#MyEditModal').modal();
	});			

	
	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var data = $('#MyTable').dataTable().fnGetData(index);
		var action = myurls['common.update'];
		var formdata = new Object();
		for (var name in data) {
			formdata['layout.' + name] = data[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', action);
		$('.layout-ratio').css('display', 'none');
		$('#MyEditModal').modal();
	});

}

var currentLayoutid = 0;
var currentLayout;
var currentLayoutdtl = {};
var tempRegions;
var tempLayoutdtls;

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

function initLayoutModal() {
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
					currentLayout.scale = currentLayout.width / 800;
					$('#LayoutDiv').attr('layoutid', currentLayout.layoutid);
					$('#LayoutDiv').attr('style', 'position:relative; width:802px; height:' + (2+800*currentLayout.height/currentLayout.width) + 'px; border: 1px solid #000; background:#000000;');
					$('#LayoutDiv').empty();
					for (var i=0; i<tempLayoutdtls.length; i++) {
						var layoutdtl = tempLayoutdtls[i];
						var layoutdtlhtml = '';
						layoutdtlhtml += '<div id="region_' + layoutdtl.layoutdtlid + '" regionenabled="1" layoutdtlid="' + layoutdtl.layoutdtlid + '" name="' + layoutdtl.region.name + '"';
						layoutdtlhtml += 'scale="' + currentLayout.scale + '" width="' + layoutdtl.width/currentLayout.scale + 'px" height="' + layoutdtl.height/currentLayout.scale + 'px" ';
						layoutdtlhtml += 'ondblclick="" ';
						layoutdtlhtml += 'class="region ui-draggable ui-resizable" ';
						layoutdtlhtml += 'style="position:absolute; width:' + layoutdtl.width/currentLayout.scale + 'px; height:' + layoutdtl.height/currentLayout.scale + 'px; top: ' + layoutdtl.topoffset/currentLayout.scale + 'px; left: ' + layoutdtl.leftoffset/currentLayout.scale + 'px;">';
						layoutdtlhtml += ' <div class="regionTransparency " style="width:100%; height:100%;"></div>';
						layoutdtlhtml += ' <div class="btn-group regionInfo pull-right">';
						layoutdtlhtml += '  <button class="btn dropdown-toggle" data-toggle="dropdown">';
						layoutdtlhtml += '   <span class="region-tip">' + layoutdtl.region.name + ' ' + layoutdtl.width + ' x ' + layoutdtl.height + ' (' + layoutdtl.leftoffset + ',' + layoutdtl.topoffset + ')</span>';
						layoutdtlhtml += '   <span class="caret"></span>';
						layoutdtlhtml += '  </button>';
						layoutdtlhtml += '  <ul class="dropdown-menu">';
						layoutdtlhtml += '   <li><a class="pix-region-update" data-id="' + layoutdtl.layoutdtlid + '" href="javascript:;">' + common.view.option + '</a></li>';
						layoutdtlhtml += '   <li><a class="pix-region-delete" data-id="' + layoutdtl.layoutdtlid + '" href="javascript:;">' + common.view.remove + '</a></li>';
						layoutdtlhtml += '  </ul>';
						layoutdtlhtml += ' </div>';
						layoutdtlhtml += '</div>';
						$('#LayoutDiv').append(layoutdtlhtml);
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
		layoutdtl.height = 100*currentLayout.scale;
		layoutdtl.width = 100*currentLayout.scale;
		layoutdtl.topoffset = 50*currentLayout.scale;
		layoutdtl.leftoffset = 50*currentLayout.scale;
		layoutdtl.zindex = 0;
		layoutdtl.intervaltime = 10;
		layoutdtl.direction = 4;
		layoutdtl.speed = 2;
		layoutdtl.color = '#FFFFFF';
		layoutdtl.size = 50;
		layoutdtl.opacity = 100;
		layoutdtl.region = tempRegions[index];
		layoutdtl.regionid = tempRegions[index].regionid;
		tempLayoutdtls[tempLayoutdtls.length] = layoutdtl;
		
		var layoutdtlhtml = '';
		layoutdtlhtml += '<div id="region_' + layoutdtl.layoutdtlid + '" regionenabled="1" layoutdtlid="' + layoutdtl.layoutdtlid + '" name="' + layoutdtl.region.name + '"';
		layoutdtlhtml += 'scale="' + currentLayout.scale + '" width="' + layoutdtl.width/currentLayout.scale + 'px" height="' + layoutdtl.height/currentLayout.scale + 'px" ';
		layoutdtlhtml += 'ondblclick="" ';
		layoutdtlhtml += 'class="region ui-draggable ui-resizable" ';
		layoutdtlhtml += 'style="position:absolute; width:' + layoutdtl.width/currentLayout.scale + 'px; height:' + layoutdtl.height/currentLayout.scale + 'px; top: ' + layoutdtl.topoffset/currentLayout.scale + 'px; left: ' + layoutdtl.leftoffset/currentLayout.scale + 'px;">';
		layoutdtlhtml += ' <div class="regionTransparency " style="width:100%; height:100%;"></div>';
		layoutdtlhtml += ' <div class="btn-group regionInfo pull-right">';
		layoutdtlhtml += '  <button class="btn dropdown-toggle" data-toggle="dropdown">';
		layoutdtlhtml += '   <span class="region-tip">' + layoutdtl.region.name + ' ' + layoutdtl.width + ' x ' + layoutdtl.height + ' (' + layoutdtl.leftoffset + ',' + layoutdtl.topoffset + ')</span>';
		layoutdtlhtml += '   <span class="caret"></span>';
		layoutdtlhtml += '  </button>';
		layoutdtlhtml += '  <ul class="dropdown-menu">';
		layoutdtlhtml += '   <li><a class="pix-region-update" data-id="' + layoutdtl.layoutdtlid + '" href="javascript:;">' + common.view.option + '</a></li>';
		layoutdtlhtml += '   <li><a class="pix-region-delete" data-id="' + layoutdtl.layoutdtlid + '" href="javascript:;">' + common.view.remove + '</a></li>';
		layoutdtlhtml += '  </ul>';
		layoutdtlhtml += ' </div>';
		layoutdtlhtml += '</div>';
		$('#LayoutDiv').append(layoutdtlhtml);
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
			$('.nontextflag').css("display", "block");
			$('.textflag').css("display", "none");
		} else {
			$('.nontextflag').css("display", "none");
			$('.textflag').css("display", "block");
		}
		$('#LayoutdtlEditForm').loadJSON(currentLayoutdtl);
		$('.colorPick').colorpicker();
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
}


//==============================修改区域选项对话框====================================			
function initLayoutdtlEditModal() {
	FormValidateOption.rules['size'] = {};
	FormValidateOption.rules['size']['required'] = true;
	FormValidateOption.rules['size']['number'] = true;
	FormValidateOption.rules['size']['min'] = 10;
	FormValidateOption.rules['size']['max'] = 100;
	FormValidateOption.rules['opacity'] = {};
	FormValidateOption.rules['opacity']['required'] = true;
	FormValidateOption.rules['opacity']['number'] = true;
	FormValidateOption.rules['opacity']['min'] = 0;
	FormValidateOption.rules['opacity']['max'] = 100;
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
			currentLayoutdtl.direction = $('#LayoutdtlEditModal input[name=direction]:checked').attr("value");
			currentLayoutdtl.speed = $('#LayoutdtlEditModal input[name=speed]:checked').attr("value");
			currentLayoutdtl.color = $('#LayoutdtlEditModal input[name=color]').attr("value");
			currentLayoutdtl.size = $('#LayoutdtlEditModal input[name=size]').attr("value");
			currentLayoutdtl.opacity = $('#LayoutdtlEditModal input[name=opacity]').attr("value");
			
			currentLayoutdtl.width = $('#LayoutdtlEditModal input[name=width]').attr("value");
			currentLayoutdtl.height = $('#LayoutdtlEditModal input[name=height]').attr("value");
			currentLayoutdtl.leftoffset = $('#LayoutdtlEditModal input[name=leftoffset]').attr("value");
			currentLayoutdtl.topoffset = $('#LayoutdtlEditModal input[name=topoffset]').attr("value");
			currentLayoutdtl.zindex = $('#LayoutdtlEditModal input[name=zindex]').attr("value");

			var regiondiv = $('#region_' + currentLayoutdtl.layoutdtlid);
			regiondiv.attr('width', currentLayoutdtl.width/currentLayout.scale + 'px');
			regiondiv.attr('height', currentLayoutdtl.height/currentLayout.scale + 'px');
			regiondiv.attr('style', 'position:absolute; width:' + currentLayoutdtl.width/currentLayout.scale + 'px; height:' + currentLayoutdtl.height/currentLayout.scale + 'px; top: ' + currentLayoutdtl.topoffset/currentLayout.scale + 'px; left: ' + currentLayoutdtl.leftoffset/currentLayout.scale + 'px;');
			
			$('.region-tip', regiondiv).html(regiondiv.attr('name') + ' ' + currentLayoutdtl.width + " x " + currentLayoutdtl.height + " (" + currentLayoutdtl.leftoffset + "," + currentLayoutdtl.topoffset + ")");

			$('#LayoutdtlEditModal').modal('hide');
		}
	});	
}
	
