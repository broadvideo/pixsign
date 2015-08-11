var myurls = {
	"common.list" : "tpllayout!list.action",
	"common.add" : "tpllayout!add.action",
	"common.update" : "tpllayout!update.action",
	"common.delete" : "tpllayout!delete.action",
	"tpllayout.get" : "tpllayout!get.action",
	"tpllayout.updatewithregion" : "tpllayout!updatewithregion.action",
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
		'aoColumns' : [ {"sTitle" : "名称", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "宽高比", "mData" : "ratio", "bSortable" : false }, 
						{"sTitle" : "类型", "mData" : "type", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "tpllayoutid", "bSortable" : false }],
		'iDisplayLength' : -1,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var data = $('#MyTable').dataTable().fnGetData(iDisplayIndex);
			
			var ratioHtml = '';
			if (data['ratio'] == 1) {
				ratioHtml = '宽屏 16:9';
			} else if (data['ratio'] == 2) {
				ratioHtml = '高屏 9:16';
			} else if (data['ratio'] == 3) {
				ratioHtml = '宽屏 4:3';
			} else if (data['ratio'] == 4) {
				ratioHtml = '高屏 3:4';
			} 
			$('td:eq(1)', nRow).html(ratioHtml);
			var typeHtml = '';
			if (data['type'] == 0) {
				typeHtml = '普通布局';
			} else if (data['type'] == 1) {
				typeHtml = '紧急布局';
			} 
			$('td:eq(2)', nRow).html(typeHtml);
			
			var dropdownBtn = '<div class="btn-group">';
			dropdownBtn += '<a class="btn default btn-sm blue" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">操作  <i class="fa fa-angle-down"></i></a>';
			dropdownBtn += '<ul class="dropdown-menu pull-right">';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-layout"><i class="fa fa-stack-overflow"></i> 设计</a></li>';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-update"><i class="fa fa-edit"></i> 编辑</a></li>';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-delete"><i class="fa fa-trash-o"></i> 删除</a></li>';
			dropdownBtn += '</ul></div>';
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
		
		bootbox.confirm('请确认是否删除"' + currentItem.name + '"', function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : action,
					cache: false,
					data : {
						'ids': currentItem['tpllayoutid']
					},
					success : function(data, status) {
						if (data.errorcode == 0) {
							refreshMyTable();
						} else {
							bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
						}
					},
					error : function() {
						bootbox.alert('出错了！');
					}
				});				
			}
         });
		
	});
}


function initMyEditModal() {
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	FormValidateOption.rules['tpllayout.name'] = {};
	FormValidateOption.rules['tpllayout.name']['required'] = true;
	FormValidateOption.rules['tpllayout.name']['minlength'] = 2;
	FormValidateOption.submitHandler = function(form) {
		$.ajax({
			type : 'POST',
			url : $('#MyEditForm').attr('action'),
			data : $('#MyEditForm').serialize(),
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#MyEditModal').modal('hide');
					bootbox.alert('操作成功');
					refreshMyTable();
				} else {
					bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert('出错了!');
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
		$('.tpllayout-ratio').css('display', 'block');
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
			formdata['tpllayout.' + name] = data[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', action);
		$('.tpllayout-ratio').css('display', 'none');
		$('#MyEditModal').modal();
	});

}


var currentLayoutData = {};
var currentRegionData = {};

var currentLayoutid = 0;

function updateRegionInfo(e, ui) {
    var pos = $(this).position();
    var scale = $(this).attr("scale");
    $('.region-tip', this).html(currentRegionData.code + ' ' + Math.round($(this).width() * scale, 0) + " x " + Math.round($(this).height() * scale, 0) + " (" + Math.round(pos.left * scale, 0) + "," + Math.round(pos.top * scale, 0) + ")");
}

function regionPositionUpdate(e, ui) {

	var width 	= $(this).css("width");
	var height 	= $(this).css("height");
	var top 	= $(this).css("top");
	var left 	= $(this).css("left");
	var regionid = $(this).attr("regionid");
	var layoutid = $(this).attr("layoutid");
	var scale = $(this).attr("scale");
	var pos = $(this).position();

    // Update the region width / height attributes
    $(this).attr("width", width).attr("height", height);
    $('.region-tip', this).html(currentRegionData.code + ' ' + Math.round($(this).width() * scale, 0) + " x " + Math.round($(this).height() * scale, 0) + " (" + Math.round(pos.left * scale, 0) + "," + Math.round(pos.top * scale, 0) + ")");

	var region = currentLayoutData.tplregions.filter(function (el) {
		return el.tplregionid == regionid;
	});
	region[0].width = Math.round($(this).width() * scale, 0);
	region[0].height = Math.round($(this).height() * scale, 0);
	region[0].leftoffset = Math.round(pos.left * scale, 0);
	region[0].topoffset = Math.round(pos.top * scale, 0);
}


function initLayoutModal() {
	
	//================================ 布局主页 =========================================
	//在列表页面中点击布局设计
	$('body').on('click', '.pix-layout', function(event) {
		var layoutModal = $('#LayoutModal');
		var data = $('#MyTable').dataTable().fnGetData($(event.target).attr("data-id"));
		var tpllayoutid = data.tpllayoutid;
		
		$.ajax({
			type : "POST",
			url : myurls['tpllayout.get'],
			data : {"tpllayout.tpllayoutid" : tpllayoutid},
			success : function(data, status) {
				if (data.errorcode == 0) {
					currentLayoutData = data.tpllayout;
					var layout = $('#layout');
					currentLayoutData.scale = currentLayoutData.width / 800;
					layout.attr('layoutid', currentLayoutData.tpllayoutid);
					layout.attr('style', 'position:relative; width:802px; height:' + (2+800*currentLayoutData.height/currentLayoutData.width) + 'px; border: 1px solid #000; background:#000000;');
					layout.empty();
					for (var i=0; i<data.tpllayout.tplregions.length; i++) {
						var region = data.tpllayout.tplregions[i];
						var regionhtml = '';
						regionhtml += '<div id="region_' + region.tplregionid + '" regionenabled="1" regionid="' + region.tplregionid + '" layoutid="' + currentLayoutData.tpllayoutid + '"';
						regionhtml += 'scale="' + currentLayoutData.scale + '" width="' + region.width/currentLayoutData.scale + 'px" height="' + region.height/currentLayoutData.scale + 'px" ';
						regionhtml += 'ondblclick="" ';
						regionhtml += 'class="region ui-draggable ui-resizable" ';
						regionhtml += 'style="position:absolute; width:' + region.width/currentLayoutData.scale + 'px; height:' + region.height/currentLayoutData.scale + 'px; top: ' + region.topoffset/currentLayoutData.scale + 'px; left: ' + region.leftoffset/currentLayoutData.scale + 'px;">';
						regionhtml += ' <div class="regionTransparency " style="width:100%; height:100%;"></div>';
						regionhtml += ' <div class="btn-group regionInfo pull-right">';
						regionhtml += '  <button class="btn dropdown-toggle" data-toggle="dropdown">';
						regionhtml += '   <span class="region-tip">' + region.code + ' ' + region.width + ' x ' + region.height + ' (' + region.leftoffset + ',' + region.topoffset + ')</span>';
						regionhtml += '   <span class="caret"></span>';
						regionhtml += '  </button>';
						regionhtml += '  <ul class="dropdown-menu">';
						regionhtml += '   <li><a class="pix-region-update" data-id="' + region.tplregionid + '" href="javascript:;" title="选项">选项</a></li>';
						regionhtml += '   <li><a class="pix-region-delete" data-id="' + region.tplregionid + '" href="javascript:;" title="删除">删除</a></li>';
						regionhtml += '  </ul>';
						regionhtml += ' </div>';
						regionhtml += '</div>';
						layout.append(regionhtml);
					}
					
					layout.each(function(){
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
					
					layoutModal.modal();
				} else {
					bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert('出错了!');
			}
		});
		
	});

	
	//================================设计对话框=========================================
	//在设计对话框中新增区域
	$('body').on('click', '.pix-addregion', function(event) {
		var region = {};
		region.tplregionid = 'R' + Math.round(Math.random()*100000000);
		region.tpllayoutid = currentLayoutData.tpllayoutid;
		region.height = 100*currentLayoutData.scale;
		region.width = 100*currentLayoutData.scale;
		region.topoffset = 50*currentLayoutData.scale;
		region.leftoffset = 50*currentLayoutData.scale;
		region.zindex = 0;
		currentLayoutData.tplregions[currentLayoutData.tplregions.length] = region;
		
		var layout = $('#layout');
		var regionhtml = '';
		regionhtml += '<div id="region_' + region.tplregionid + '" regionenabled="1" regionid="' + region.tplregionid + '" layoutid="' + currentLayoutData.tpllayoutid + '"';
		regionhtml += 'scale="' + currentLayoutData.scale + '" width="' + region.width/currentLayoutData.scale + 'px" height="' + region.height/currentLayoutData.scale + 'px" ';
		regionhtml += 'ondblclick="" ';
		regionhtml += 'class="region ui-draggable ui-resizable" ';
		regionhtml += 'style="position:absolute; width:' + region.width/currentLayoutData.scale + 'px; height:' + region.height/currentLayoutData.scale + 'px; top: ' + region.topoffset/currentLayoutData.scale + 'px; left: ' + region.leftoffset/currentLayoutData.scale + 'px;">';
		regionhtml += ' <div class="regionTransparency " style="width:100%; height:100%;"></div>';
		regionhtml += ' <div class="btn-group regionInfo pull-right">';
		regionhtml += '  <button class="btn dropdown-toggle" data-toggle="dropdown">';
		regionhtml += '   <span class="region-tip">' + region.code + ' ' + region.width + ' x ' + region.height + ' (' + region.leftoffset + ',' + region.topoffset + ')</span>';
		regionhtml += '   <span class="caret"></span>';
		regionhtml += '  </button>';
		regionhtml += '  <ul class="dropdown-menu">';
		regionhtml += '   <li><a class="pix-region-update" data-id="' + region.tplregionid + '" href="javascript:;" title="选项">选项</a></li>';
		regionhtml += '   <li><a class="pix-region-delete" data-id="' + region.tplregionid + '" href="javascript:;" title="删除">删除</a></li>';
		regionhtml += '  </ul>';
		regionhtml += ' </div>';
		regionhtml += '</div>';
		layout.append(regionhtml);
		layout.each(function(){
		$('#region_'+region.tplregionid)
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
	});
	
	//在设计对话框的区域中点击区域选项的下拉菜单
	$('body').on('click', '.pix-region-update', function(event) {
		var region = currentLayoutData.tplregions.filter(function (el) {
			return el.tplregionid == $(event.target).attr("data-id");
		});
		currentRegionData = region[0];
		$('#RegionEditForm').loadJSON(currentRegionData);
		$('#LayoutModal').modal('hide');
		$('#RegionEditModal').modal();
	});			

	
	////在设计对话框的区域中点击删除的下拉菜单
	$('body').on('click', '.pix-region-delete', function(event) {
		var region = currentLayoutData.tplregions.filter(function (el) {
			return el.tplregionid == $(event.target).attr("data-id");
		});
		$('#region_' + region[0].tplregionid).remove();
		currentLayoutData.tplregions.splice(currentLayoutData.tplregions.indexOf(region[0]), 1);
	});			


	//在设计对话框中进行提交
	$('#LayoutModal-Btn').on('click', function(event) {
		for (var i=0; i<currentLayoutData.tplregions.length; i++) {
			if (('' + currentLayoutData.tplregions[i].tplregionid).indexOf('R') == 0) {
				currentLayoutData.tplregions[i].tplregionid = '0';
			}
		}
		$.ajax({
			type : 'POST',
			url : myurls['tpllayout.updatewithregion'],
			data : '{"tpllayout":' + $.toJSON(currentLayoutData) + '}',
			dataType : 'json',
			contentType : 'application/json;charset=utf-8',
			success : function(data, status) {
				$('#LayoutModal').modal('hide');
				if (data.errorcode == 0) {
					bootbox.alert('操作成功');
					$('#MyTable').dataTable()._fnAjaxUpdate();
				} else {
					bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
				}
			},
			error : function() {
				$('#LayoutModal').modal('hide');
				bootbox.alert('出错了!');
			}
		});

		event.preventDefault();
	});	

	
}


//==============================修改区域选项对话框====================================			
function initRegionEditModal() {
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
	$('#RegionEditForm').validate(FormValidateOption);

	
	//在修改区域选项对话框中进行提交
	$('#RegionEditModal-Btn').on('click', function(event) {
		if ($('#RegionEditForm').valid()) {
			$('.form-group').removeClass('has-error');
			$('.help-block').remove();

			currentRegionData.width = $('#RegionEditModal input[name=width]').attr("value");
			currentRegionData.height = $('#RegionEditModal input[name=height]').attr("value");
			currentRegionData.leftoffset = $('#RegionEditModal input[name=leftoffset]').attr("value");
			currentRegionData.topoffset = $('#RegionEditModal input[name=topoffset]').attr("value");
			currentRegionData.zindex = $('#RegionEditModal input[name=zindex]').attr("value");
			currentRegionData.code = $('#RegionEditModal input[name=code]').attr("value");

			var regiondiv = $('#region_' + currentRegionData.tplregionid);
			regiondiv.attr('width', currentRegionData.width/currentLayoutData.scale + 'px');
			regiondiv.attr('height', currentRegionData.height/currentLayoutData.scale + 'px');
			regiondiv.attr('style', 'position:absolute; width:' + currentRegionData.width/currentLayoutData.scale + 'px; height:' + currentRegionData.height/currentLayoutData.scale + 'px; top: ' + currentRegionData.topoffset/currentLayoutData.scale + 'px; left: ' + currentRegionData.leftoffset/currentLayoutData.scale + 'px;');
			
		    $('.region-tip', regiondiv).html(currentRegionData.code + ' ' + currentRegionData.width + " x " + currentRegionData.height + " (" + currentRegionData.leftoffset + "," + currentRegionData.topoffset + ")");

		    $('#RegionEditModal').modal('hide');
		}
	});	

}
	
