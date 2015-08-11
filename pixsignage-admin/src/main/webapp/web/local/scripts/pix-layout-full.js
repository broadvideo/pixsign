var myurls = {
	"common.list" : "layout!list.action",
	"common.add" : "layout!add.action",
	"common.update" : "layout!update.action",
	"common.delete" : "layout!delete.action",
	"layout.get" : "layout!get.action",
	"layout.updatewithregion" : "layout!updatewithregion.action",
	"media.videolist" : "media!videolist.action",
	"media.imagelist" : "media!imagelist.action",
	"device.list" : "device!list.action",
	"devicegroup.list" : "devicegroup!list.action",
	"schedule.batchadd" : "schedule!batchadd.action",
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

function initMyTable() {
	var oTable = $('#MyTable').dataTable({
		'sDom' : "<'row'<'col-md-6 col-sm-12'l><'col-md-12 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", //default layout without horizontal scroll(remove this setting to enable horizontal scroll for the table)
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [ {"sTitle" : "名称", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "创建者", "mData" : "createstaffid", "bSortable" : false }, 
						{"sTitle" : "创建时间", "mData" : "createtime", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "layoutid", "bSortable" : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var data = $('#MyTable').dataTable().fnGetData(iDisplayIndex);
			var dropdownBtn = '<div class="btn-group">';
			dropdownBtn += '<a class="btn default btn-sm blue" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">操作  <i class="fa fa-angle-down"></i></a>';
			dropdownBtn += '<ul class="dropdown-menu pull-right">';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-layout"><i class="fa fa-stack-overflow"></i> 设计</a></li>';
			dropdownBtn += '<li><a href="preview.jsp?layoutid=' + data['layoutid'] + '" target="_blank" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-preview"><i class="fa fa-dashboard"></i> 预览</a></li>';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-schedule"><i class="fa fa-calendar"></i> 编制计划</a></li>';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-update"><i class="fa fa-edit"></i> 编辑</a></li>';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-delete"><i class="fa fa-trash-o"></i> 删除</a></li>';
			dropdownBtn += '<li><a href="layout!download.action?layoutid=' + data['layoutid'] + '" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-download"><i class="fa fa-download"></i> 下载XLF</a></li>';
			dropdownBtn += '</ul></div>';
			$('td:eq(3)', nRow).html(dropdownBtn);
			return nRow;
		}
	});

    jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small'); // modify table search input
    jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small'); // modify table per page dropdown
    jQuery('#MyTable_wrapper .dataTables_length select').select2(); // initialize select2 dropdown
	
    
	var currentItem;
	$('body').on('click', '.pix-delete', function(event) {
		var item = $('#MyTable').dataTable().fnGetData($(event.target).attr('data-id'));
		var action = myurls['common.delete'];
		currentItem = item;
		
		bootbox.confirm('请确认是否删除"' + currentItem.name + '"', function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : action,
					cache: false,
					data : {
						'ids': currentItem['layoutid']
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
		$('#MyEditModal').modal();
	});			

	
	$('body').on('click', '.pix-update', function(event) {
		var data = $('#MyTable').dataTable().fnGetData($(event.target).attr('data-id'));
		var action = myurls['common.update'];
		var formdata = new Object();
		for (var name in data) {
			formdata['layout.' + name] = data[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', action);
		$('#MyEditModal').modal();
	});

}






var currentLayoutData = {};
var currentRegionData = {};
var tempRegionDtlData = {};

var deviceSelectedList = [];
var devicegroupSelectedList = [];
var currentLayoutid = 0;

function updateRegionInfo(e, ui) {
    var pos = $(this).position();
    var scale = $(this).attr("scale");
    $('.region-tip', this).html(Math.round($(this).width() * scale, 0) + " x " + Math.round($(this).height() * scale, 0) + " (" + Math.round(pos.left * scale, 0) + "," + Math.round(pos.top * scale, 0) + ")");
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
    $('.region-tip', this).html(Math.round($(this).width() * scale, 0) + " x " + Math.round($(this).height() * scale, 0) + " (" + Math.round(pos.left * scale, 0) + "," + Math.round(pos.top * scale, 0) + ")");

	var region = currentLayoutData.regions.filter(function (el) {
		return el.regionid == regionid;
	});
	region[0].width = Math.round($(this).width() * scale, 0);
	region[0].height = Math.round($(this).height() * scale, 0);
	region[0].leftoffset = Math.round(pos.left * scale, 0);
	region[0].topoffset = Math.round(pos.top * scale, 0);
}

function regiondtlRefresh(regionid) {
	var region = currentLayoutData.regions.filter(function (el) {
		return el.regionid == regionid;
	});
	$('#RegionDtlShowTable').dataTable().fnClearTable();
	var mediatype;
	for (var i=0; i<region[0].regiondtls.length; i++) {
		var regiondtl = region[0].regiondtls[i];
		if (regiondtl.mediatype == '1') {
			mediatype = '图片';
		} else if (regiondtl.mediatype == '2') {
			mediatype = '视频';
		} else if (regiondtl.mediatype == '3') {
			mediatype = '文本';
		} else {
			mediatype = '未知';
		}
		$('#RegionDtlShowTable').dataTable().fnAddData([regiondtl.sequence, mediatype, regiondtl.raw, regiondtl.duration]);
	}
}


function initLayoutModal() {
	
	//================================ 布局主页 =========================================
	//在列表页面中点击布局设计
	$('body').on('click', '.pix-layout', function(event) {
		var layoutModal = $('#LayoutModal');
		var data = $('#MyTable').dataTable().fnGetData($(event.target).attr("data-id"));
		var layoutid = data.layoutid;
		
		$.ajax({
			type : "POST",
			url : myurls['layout.get'],
			data : {"layout.layoutid" : layoutid},
			success : function(data, status) {
				if (data.errorcode == 0) {
					currentLayoutData = data.layout;
					var layout = $('#layout');
					currentLayoutData.scale = currentLayoutData.width / 800;
					layout.attr('layoutid', currentLayoutData.layoutid);
					layout.attr('style', 'position:relative; width:802px; height:' + (2+800*currentLayoutData.height/currentLayoutData.width) + 'px; border: 1px solid #000; background:#000000;');
					layout.empty();
					for (var i=0; i<data.layout.regions.length; i++) {
						var region = data.layout.regions[i];
						var regionhtml = '';
						regionhtml += '<div id="region_' + region.regionid + '" regionenabled="1" regionid="' + region.regionid + '" layoutid="' + currentLayoutData.layoutid + '"';
						regionhtml += 'scale="' + currentLayoutData.scale + '" width="' + region.width/currentLayoutData.scale + 'px" height="' + region.height/currentLayoutData.scale + 'px" ';
						regionhtml += 'onclick="javascript:regiondtlRefresh(\'' + region.regionid + '\')" ondblclick="" ';
						regionhtml += 'class="region ui-draggable ui-resizable" ';
						regionhtml += 'style="position:absolute; width:' + region.width/currentLayoutData.scale + 'px; height:' + region.height/currentLayoutData.scale + 'px; top: ' + region.topoffset/currentLayoutData.scale + 'px; left: ' + region.leftoffset/currentLayoutData.scale + 'px;">';
						regionhtml += ' <div class="regionTransparency " style="width:100%; height:100%;"></div>';
						regionhtml += ' <div class="btn-group regionInfo pull-right">';
						regionhtml += '  <button class="btn dropdown-toggle" data-toggle="dropdown">';
						regionhtml += '   <span class="region-tip">' + region.width + ' x ' + region.height + ' (' + region.leftoffset + ',' + region.topoffset + ')</span>';
						regionhtml += '   <span class="caret"></span>';
						regionhtml += '  </button>';
						regionhtml += '  <ul class="dropdown-menu">';
						regionhtml += '   <li><a class="pix-region-dtl" data-id="' + region.regionid + '" href="javascript:;" title="媒体列表">媒体列表</a></li>';
						regionhtml += '   <li><a class="pix-region-update" data-id="' + region.regionid + '" href="javascript:;" title="选项">选项</a></li>';
						regionhtml += '   <li><a class="pix-region-delete" data-id="' + region.regionid + '" href="javascript:;" title="删除">删除</a></li>';
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
					
					if (data.layout.regions.length > 0) {
						regiondtlRefresh(data.layout.regions[0].regionid);
					}
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
	//设计对话框中的右侧列表初始化
	$('#RegionDtlShowTable').dataTable({
		"sDom" : "t",
		"iDisplayLength" : -1,
		"aoColumns" : [ {"sTitle" : "#", "bSortable" : false }, 
						{"sTitle" : "类型", "bSortable" : false }, 
						{"sTitle" : "内容", "bSortable" : false }, 
						{"sTitle" : "时长", "bSortable" : false }],
		"oLanguage" : { "sZeroRecords" : '列表为空',
						"sEmptyTable" : '列表为空' }
	});
				
	//在设计对话框中新增区域
	$('body').on('click', '.pix-addregion', function(event) {
		var region = {};
		region.regionid = 'R' + Math.round(Math.random()*100000000);
		region.layoutid = currentLayoutData.layoutid;
		region.height = 100*currentLayoutData.scale;
		region.width = 100*currentLayoutData.scale;
		region.topoffset = 50*currentLayoutData.scale;
		region.leftoffset = 50*currentLayoutData.scale;
		region.zindex = 0;
		region.regiondtls = [];
		currentLayoutData.regions[currentLayoutData.regions.length] = region;
		
		var layout = $('#layout');
		var regionhtml = '';
		regionhtml += '<div id="region_' + region.regionid + '" regionenabled="1" regionid="' + region.regionid + '" layoutid="' + currentLayoutData.layoutid + '"';
		regionhtml += 'scale="' + currentLayoutData.scale + '" width="' + region.width/currentLayoutData.scale + 'px" height="' + region.height/currentLayoutData.scale + 'px" ';
		regionhtml += 'onclick="javascript:regiondtlRefresh(\'' + region.regionid + '\')" ondblclick="" ';
		regionhtml += 'class="region ui-draggable ui-resizable" ';
		regionhtml += 'style="position:absolute; width:' + region.width/currentLayoutData.scale + 'px; height:' + region.height/currentLayoutData.scale + 'px; top: ' + region.topoffset/currentLayoutData.scale + 'px; left: ' + region.leftoffset/currentLayoutData.scale + 'px;">';
		regionhtml += ' <div class="regionTransparency " style="width:100%; height:100%;"></div>';
		regionhtml += ' <div class="btn-group regionInfo pull-right">';
		regionhtml += '  <button class="btn dropdown-toggle" data-toggle="dropdown">';
		regionhtml += '   <span class="region-tip">' + region.width + ' x ' + region.height + ' (' + region.leftoffset + ',' + region.topoffset + ')</span>';
		regionhtml += '   <span class="caret"></span>';
		regionhtml += '  </button>';
		regionhtml += '  <ul class="dropdown-menu">';
		regionhtml += '   <li><a class="pix-region-dtl" data-id="' + region.regionid + '" href="javascript:;" title="媒体列表">媒体列表</a></li>';
		regionhtml += '   <li><a class="pix-region-update" data-id="' + region.regionid + '" href="javascript:;" title="选项">选项</a></li>';
		regionhtml += '   <li><a class="pix-region-delete" data-id="' + region.regionid + '" href="javascript:;" title="删除">删除</a></li>';
		regionhtml += '  </ul>';
		regionhtml += ' </div>';
		regionhtml += '</div>';
		layout.append(regionhtml);
		layout.each(function(){
		$('#region_'+region.regionid)
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
	
	//在设计对话框的区域中点击媒体列表的下拉菜单
	$('body').on('click', '.pix-region-dtl', function(event) {
		var region = currentLayoutData.regions.filter(function (el) {
			return el.regionid == $(event.target).attr("data-id");
		});
		currentRegionData = region[0];
		tempRegionDtlData = $.parseJSON($.toJSON(currentRegionData.regiondtls));
		$('#RegionDtlTable').dataTable().fnClearTable();
		var mediatype;
		for (var i=0; i<tempRegionDtlData.length; i++) {
			var regiondtl = tempRegionDtlData[i];
			if (regiondtl.mediatype == '1') {
				mediatype = '图片';
			} else if (regiondtl.mediatype == '2') {
				mediatype = '视频';
			} else if (regiondtl.mediatype == '3') {
				mediatype = '文本';
			} else {
				mediatype = '未知';
			}
			$('#RegionDtlTable').dataTable().fnAddData([regiondtl.sequence, regiondtl.sequence, mediatype, regiondtl.raw, regiondtl.duration, regiondtl.regiondtlid]);
		}
		$('#LayoutModal').modal('hide');
		$('#RegionDtlModal').modal();
	});			

	
	//在设计对话框的区域中点击区域选项的下拉菜单
	$('body').on('click', '.pix-region-update', function(event) {
		var region = currentLayoutData.regions.filter(function (el) {
			return el.regionid == $(event.target).attr("data-id");
		});
		currentRegionData = region[0];
		$('#RegionEditForm').loadJSON(currentRegionData);
		$('#LayoutModal').modal('hide');
		$('#RegionEditModal').modal();
	});			

	
	////在设计对话框的区域中点击删除的下拉菜单
	$('body').on('click', '.pix-region-delete', function(event) {
		var region = currentLayoutData.regions.filter(function (el) {
			return el.regionid == $(event.target).attr("data-id");
		});
		$('#region_' + region[0].regionid).remove();
		currentLayoutData.regions.splice(currentLayoutData.regions.indexOf(region[0]), 1);
	});			


	//在设计对话框中进行提交
	$('#LayoutModal-Btn').on('click', function(event) {
		for (var i=0; i<currentLayoutData.regions.length; i++) {
			if (('' + currentLayoutData.regions[i].regionid).indexOf('R') == 0) {
				currentLayoutData.regions[i].regionid = '0';
				for (var j=0; j<currentLayoutData.regions[i].regiondtls.length; j++) {
					currentLayoutData.regions[i].regiondtls[j].regionid = '0';
				}
			}
		}
		$.ajax({
			type : 'POST',
			url : myurls['layout.updatewithregion'],
			data : '{"layout":' + $.toJSON(currentLayoutData) + '}',
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

			var regiondiv = $('#region_' + currentRegionData.regionid);
			regiondiv.attr('width', currentRegionData.width/currentLayoutData.scale + 'px');
			regiondiv.attr('height', currentRegionData.height/currentLayoutData.scale + 'px');
			regiondiv.attr('style', 'position:absolute; width:' + currentRegionData.width/currentLayoutData.scale + 'px; height:' + currentRegionData.height/currentLayoutData.scale + 'px; top: ' + currentRegionData.topoffset/currentLayoutData.scale + 'px; left: ' + currentRegionData.leftoffset/currentLayoutData.scale + 'px;');
			
		    $('.region-tip', regiondiv).html(currentRegionData.width + " x " + currentRegionData.height + " (" + currentRegionData.leftoffset + "," + currentRegionData.topoffset + ")");

		    $('#RegionEditModal').modal('hide');
		}
	});	

}
	

//==============================区域媒体列表对话框====================================			
function initRegionDtlModal() {
	FormValidateOption.rules = {};
	FormValidateOption.rules['duration'] = {};
	FormValidateOption.rules['duration']['required'] = true;
	FormValidateOption.rules['duration']['number'] = true;
	FormValidateOption.rules['size'] = {};
	FormValidateOption.rules['size']['required'] = true;
	FormValidateOption.rules['size']['number'] = true;
	FormValidateOption.rules['size']['max'] = 100;
	FormValidateOption.rules['opacity'] = {};
	FormValidateOption.rules['opacity']['required'] = true;
	FormValidateOption.rules['opacity']['number'] = true;
	FormValidateOption.rules['opacity']['max'] = 100;
	FormValidateOption.rules['raw'] = {};
	FormValidateOption.rules['raw']['required'] = true;
	$('#RegionDtlTextForm').validate(FormValidateOption);

	
	//在区域媒体列表对话框中进行提交
	$('#RegionDtlModal-Btn').on('click', function(event) {
		currentRegionData.regiondtls = $.parseJSON($.toJSON(tempRegionDtlData));
		regiondtlRefresh(currentRegionData.regionid);
	    $('#RegionDtlModal').modal('hide');
	});	

	//区域媒体列表选择对话框中的视频table初始化
	$("#RegionDtlVideoTable thead").css("display", "none");
	$("#RegionDtlVideoTable tbody").css("display", "none");	
	var videohtml = '';
	$('#RegionDtlVideoTable').dataTable({
		"sDom" : "<'row'<'col-md-6 col-sm-12'l><'col-md-12 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", //default layout without horizontal scroll(remove this setting to enable horizontal scroll for the table)
		"aLengthMenu" : [ [ 12, 24, 48, 96 ],
		                  [ 12, 24, 48, 96 ] // change per page values here
						],
		"bProcessing" : true,
		"bServerSide" : true,
		"sAjaxSource" : myurls['media.videolist'],
		"aoColumns" : [ {"sTitle" : "视频名称", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "文件名", "mData" : "filename", "bSortable" : false }, 
						{"sTitle" : "文件大小", "mData" : "size", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "mediaid", "bSortable" : false }],
		"iDisplayLength" : 12,
		"sPaginationType" : "bootstrap",
		"oLanguage" : DataTableLanguage,
		"fnPreDrawCallback": function (oSettings) {
			if ($('#VideoContainer').length < 1) {
				$('#RegionDtlVideoTable').append('<div id="VideoContainer"></div>');
			}
			$('#VideoContainer').html(''); 
			return true;
		},
		"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			if (iDisplayIndex % 4 == 0) {
				videohtml = '';
				videohtml += '<div class="row" >';
			}
			videohtml += '<div class="col-md-3 col-xs-3">';
			videohtml += '<img src="media!getthumb.action?mediaid=' + aData['mediaid'] + '" alt="' + aData['name'] + '" />';
			videohtml += '<h6>' + aData['name'] + '</h6>';
			videohtml += '<p><button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-addregionvideodtl">增加</button></p>';
			videohtml += '</div>';
			if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#RegionDtlVideoTable').dataTable().fnGetData().length) {
				videohtml += '</div>';
				if ((iDisplayIndex+1) != $('#RegionDtlVideoTable').dataTable().fnGetData().length) {
					videohtml += '<hr/>';
				}
				$('#VideoContainer').append(videohtml);
			}
			return nRow;
		}

	});
	jQuery('#RegionDtlVideoTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); // modify table search input
	jQuery('#RegionDtlVideoTable_wrapper .dataTables_length select').addClass("form-control input-small"); // modify table per page dropdown
	
	//区域媒体列表选择对话框中的图片table初始化
	$("#RegionDtlImageTable thead").css("display", "none");
	$("#RegionDtlImageTable tbody").css("display", "none");	
	var imagehtml = '';
	$('#RegionDtlImageTable').dataTable({
		"sDom" : "<'row'<'col-md-6 col-sm-12'l><'col-md-12 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", //default layout without horizontal scroll(remove this setting to enable horizontal scroll for the table)
		"aLengthMenu" : [ [ 12, 24, 48, 96 ],
		                  [ 12, 24, 48, 96 ] // change per page values here
						],
		"bProcessing" : true,
		"bServerSide" : true,
		"sAjaxSource" : myurls['media.imagelist'],
		"aoColumns" : [ {"sTitle" : "图片名称", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "文件名", "mData" : "filename", "bSortable" : false }, 
						{"sTitle" : "文件大小", "mData" : "size", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "mediaid", "bSortable" : false }],
		"iDisplayLength" : 12,
		"sPaginationType" : "bootstrap",
		"oLanguage" : DataTableLanguage,
		"fnPreDrawCallback": function (oSettings) {
			if ($('#ImageContainer').length < 1) {
				$('#RegionDtlImageTable').append('<div id="ImageContainer"></div>');
			}
			$('#ImageContainer').html(''); 
			return true;
		},
		"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			if (iDisplayIndex % 4 == 0) {
				imagehtml = '';
				imagehtml += '<div class="row" >';
			}
			imagehtml += '<div class="col-md-3 col-xs-3">';
			imagehtml += '<img src="media!getthumb.action?mediaid=' + aData['mediaid'] + '" alt="' + aData['name'] + '" />';
			imagehtml += '<h6>' + aData['name'] + '</h6>';
			imagehtml += '<p><button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-addregionimagedtl">增加</button></p>';
			imagehtml += '</div>';
			if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#RegionDtlImageTable').dataTable().fnGetData().length) {
				imagehtml += '</div>';
				if ((iDisplayIndex+1) != $('#RegionDtlImageTable').dataTable().fnGetData().length) {
					imagehtml += '<hr/>';
				}
				$('#ImageContainer').append(imagehtml);
			}
			return nRow;
		}		
	});
	jQuery('#RegionDtlImageTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); // modify table search input
	jQuery('#RegionDtlImageTable_wrapper .dataTables_length select').addClass("form-control input-small"); // modify table per page dropdown

	
	//区域媒体列表选择对话框中的右侧选择列表初始化
	var regionDtlTable = $('#RegionDtlTable').dataTable({
		'sDom' : 't',
		'iDisplayLength' : -1,
		'aoColumns' : [ {'sTitle' : '', 'bSortable' : false }, 
		                {'sTitle' : '#', 'bSortable' : false }, 
						{'sTitle' : '类型', 'bSortable' : false }, 
						{'sTitle' : '内容', 'bSortable' : false }, 
						{'sTitle' : '时长', 'bSortable' : false },
						{'sTitle' : '操作', 'bSortable' : false }],
		'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
		'oLanguage' : { 'sZeroRecords' : '列表为空',
						'sEmptyTable' : '列表为空' }, 
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(5)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-deleteregiondtl">移除</button>');
			var rowdetail = '<span class="row-details row-details-close"></span>';
			$('td:eq(0)', nRow).html(rowdetail);
			return nRow;
		}
	});

    function fnFormatDetails ( oTable, nTr )
    {
        var aData = regionDtlTable.fnGetData( nTr );
        var regiondtl = tempRegionDtlData[aData[1]-1];
        var sOut = '';
		if (regiondtl.mediatype == '1' || regiondtl.mediatype == '2') {
	        sOut += '<form class="form-horizontal regiondtlform">';
	        sOut += '<div class="form-group">';
	        sOut += '<label class="col-md-3 control-label" style="font-size:10px;">时长<span class="required">*</span></label>';
	        sOut += '<div class="col-md-6"><input type="text" class="form-control" style="height:20px;font-size:14px;line-height:20px;" name="duration" value="' + regiondtl.duration + '"/></div>';
	        sOut += '<div class="col-md-3"><button data-id="" class="btn yellow btn-xs pix-updateregiondtl" href="javascript:;" >更新</button></div>';
	        sOut += '</div></form>';
		} else if (regiondtl.mediatype == '3') {
			sOut += '<form class="regiondtlform">';
			
			sOut += '<table>';
			
			sOut += '<tr>';
			sOut += '<td colspan="2">';
	        sOut += '<div class="form-group"><label class="control-label" style="font-size:10px;">时长<span class="required">*</span></label>';
	        sOut += '<input type="text" class="form-control" style="width:80px;height:20px;font-size:14px;line-height:20px;" name="duration" value="' + regiondtl.duration + '"/>';
	        sOut += '</div>';
			sOut += '</td>';
			sOut += '<td>';
	        sOut += '<label class="control-label" style="font-size:10px;">移动方向</label>';
			sOut += '</td>';
			sOut += '<td>';
	        sOut += '<select style="height:20px;" name="direction" ">';
	        sOut += '<option value="1" style="font-size:14px;padding:5px;" ' + (regiondtl.direction=='1'? 'selected':'') + '>静止</option>';
	        sOut += '<option value="2" style="font-size:14px;padding:5px;" ' + (regiondtl.direction=='2'? 'selected':'') + '>向上</option>';
	        sOut += '<option value="3" style="font-size:14px;padding:5px;" ' + (regiondtl.direction=='3'? 'selected':'') + '>向下</option>';
	        sOut += '<option value="4" style="font-size:14px;padding:5px;" ' + (regiondtl.direction=='4'? 'selected':'') + '>向左</option>';
	        sOut += '<option value="5" style="font-size:14px;padding:5px;" ' + (regiondtl.direction=='5'? 'selected':'') + '>向右</option>';
	        sOut += '</select>';
			sOut += '</td>';
			sOut += '<td>';
	        sOut += '<label class="control-label" style="font-size:10px;">移动速度</label>';
			sOut += '</td>';
			sOut += '<td>';
	        sOut += '<select style="height:20px;" name="speed" ">';
	        sOut += '<option value="1" style="font-size:14px;padding:5px;" ' + (regiondtl.speed=='1'? 'selected':'') + '>慢</option>';
	        sOut += '<option value="2" style="font-size:14px;padding:5px;" ' + (regiondtl.speed=='2'? 'selected':'') + '>正常</option>';
	        sOut += '<option value="3" style="font-size:14px;padding:5px;" ' + (regiondtl.speed=='3'? 'selected':'') + '>快</option>';
	        sOut += '</select>';
			sOut += '</td>';

			sOut += '</tr>';

			sOut += '<tr>';
			sOut += '<td>';
	        sOut += '<label class="control-label" style="font-size:10px;">颜色</label>';
			sOut += '</td>';
			sOut += '<td>';
	        sOut += '<div class="input-group colorpicker-component colorPick">';
	        sOut += '<input type="text" class="form-control" style="width:80px;height:20px;font-size:14px;line-height:20px;" name="color" value="' + regiondtl.color + '"/>';
	        sOut += '<span class="input-group-addon" style="width:20px;height:20px;padding:0 4px;margin:0;"><i></i></span>';
	        sOut += '</div>';
			sOut += '</td>';
			sOut += '<td colspan="2">';
	        sOut += '<div class="form-group"><label class="control-label" style="font-size:10px;">大小<span class="required">*</span></label>';
	        sOut += '<input type="text" class="form-control" style="width:80px;height:20px;font-size:14px;line-height:20px;" name="size" value="' + regiondtl.size + '"/>';
	        sOut += '</div>';
			sOut += '</td>';
			sOut += '<td colspan="2">';
	        sOut += '<div class="form-group"><label class="control-label" style="font-size:10px;">不透明度<span class="required">*</span></label>';
	        sOut += '<input type="text" class="form-control" style="width:80px;height:20px;font-size:14px;line-height:20px;" name="opacity" value="' + regiondtl.opacity + '"/>';
	        sOut += '</div>';
			sOut += '</td>';
			sOut += '</tr>';
			
			sOut += '<tr>';
			sOut += '<td colspan="5">';
	        sOut += '<div class="form-group"><label class="control-label" style="font-size:10px;">内容<span class="required">*</span></label>';
	        sOut += '<textarea class="form-control" rows="3" class="form-control" style="width:350px;font-size:14px;" name="raw">' + regiondtl.raw + '</textarea>';
	        sOut += '</div>';
			sOut += '</td>';
			sOut += '<td>';
	        sOut += '<button data-id="" class="btn yellow btn-xs pix-updateregiondtl_text" href="javascript:;" >更新</button>';
			sOut += '</td>';
			sOut += '</tr>';

			sOut += '</table></form>';
		}

        return sOut;
    }

    $('#RegionDtlTable').on('click', ' tbody td .row-details', function () {
        var nTr = $(this).parents('tr')[0];
        if ( regionDtlTable.fnIsOpen(nTr) )
        {
            /* This row is already open - close it */
            $(this).addClass('row-details-close').removeClass('row-details-open');
            regionDtlTable.fnClose( nTr );
        }
        else
        {
            /* Open this row */                
            $(this).addClass('row-details-open').removeClass('row-details-close');
            regionDtlTable.fnOpen( nTr, fnFormatDetails(regionDtlTable, nTr), 'details' );
            $('.colorPick').colorpicker();
            $('.regiondtlform').validate(FormValidateOption);
        }
    });
    
	//区域媒体列表选择对话框中，增加视频到区域列表
	$('body').on('click', '.pix-addregionvideodtl', function(event) {
		var data = $('#RegionDtlVideoTable').dataTable().fnGetData($(event.target).attr("data-id"));
		
		var regiondtl = {};
		regiondtl.regiondtlid = 0;
		regiondtl.regionid = currentRegionData.regionid;
		regiondtl.mediatype = '2';
		regiondtl.mediaid = data.mediaid;
		regiondtl.duration = '0';
		regiondtl.raw = data.name;
		regiondtl.sequence = tempRegionDtlData.length + 1;
		
		tempRegionDtlData[tempRegionDtlData.length] = regiondtl;
		$('#RegionDtlTable').dataTable().fnAddData([regiondtl.sequence, regiondtl.sequence, '视频', regiondtl.raw, regiondtl.duration, regiondtl.regiondtlid]);
	});

	//区域媒体列表选择对话框中，增加图片到区域列表
	$('body').on('click', '.pix-addregionimagedtl', function(event) {
		var data = $('#RegionDtlImageTable').dataTable().fnGetData($(event.target).attr("data-id"));
		
		var regiondtl = {};
		regiondtl.regiondtlid = 0;
		regiondtl.regionid = currentRegionData.regionid;
		regiondtl.mediatype = '1';
		regiondtl.mediaid = data.mediaid;
		regiondtl.duration = '10';
		regiondtl.raw = data.name;
		regiondtl.sequence = tempRegionDtlData.length + 1;
		
		tempRegionDtlData[tempRegionDtlData.length] = regiondtl;
		$('#RegionDtlTable').dataTable().fnAddData([regiondtl.sequence, regiondtl.sequence, '图片', regiondtl.raw, regiondtl.duration, regiondtl.regiondtlid]);
	});

	//区域媒体列表选择对话框中，增加文本到区域列表
	$('body').on('click', '.pix-addregiontextdtl', function(event) {
		if ($('#RegionDtlTextForm').valid()) {
			$('.form-group').removeClass('has-error');
			$('.help-block').remove();

			var regiondtl = {};
			regiondtl.regiondtlid = 0;
			regiondtl.regionid = currentRegionData.regionid;
			regiondtl.mediatype = '3';
			regiondtl.mediaid = 0;
			regiondtl.duration = $('#RegionDtlTextForm input[name=duration]').attr("value");
			regiondtl.direction = $('#RegionDtlTextForm input[name=direction]:checked').attr("value");
			regiondtl.speed = $('#RegionDtlTextForm input[name=speed]:checked').attr("value");
			regiondtl.color = $('#RegionDtlTextForm input[name=color]').attr("value");
			regiondtl.size = $('#RegionDtlTextForm input[name=size]').attr("value");
			regiondtl.opacity = $('#RegionDtlTextForm input[name=opacity]').attr("value");
			regiondtl.raw = $('#RegionDtlTextForm textarea[name=raw]').val();
			regiondtl.sequence = tempRegionDtlData.length + 1;
			
			tempRegionDtlData[tempRegionDtlData.length] = regiondtl;
			$('#RegionDtlTable').dataTable().fnAddData([regiondtl.sequence, regiondtl.sequence, '文本', regiondtl.raw, regiondtl.duration, regiondtl.regiondtlid]);
		}
	});			
	
	//区域媒体列表选择对话框中，删除区域列表某行
	$('body').on('click', '.pix-deleteregiondtl', function(event) {
		var rowIndex = $(event.target).attr("data-id");
		for (var i=rowIndex; i<$('#RegionDtlTable').dataTable().fnSettings().fnRecordsDisplay(); i++) {
			var data = $('#RegionDtlTable').dataTable().fnGetData(i);
			$('#RegionDtlTable').dataTable().fnUpdate(i, parseInt(i), 1);
		}
		$('#RegionDtlTable').dataTable().fnDeleteRow(rowIndex);
		
		for (var i=rowIndex; i<tempRegionDtlData.length; i++) {
			tempRegionDtlData[i].sequence = i;
		}
		tempRegionDtlData.splice(rowIndex, 1);
	});
	
	//区域媒体列表选择对话框中，更新区域列表某行
	$('body').on('click', '.pix-updateregiondtl', function(event) {
		event.preventDefault();
		var form = $(event.target).parents('form')[0];
		if ($(form).valid()) {
			var nTr = $(event.target).parents('tr')[0];
			var sequence = $(nTr).prev().children('td')[1].innerHTML;
			var duration = $('input[name=duration]', form).val();
			tempRegionDtlData[sequence-1].duration = duration;
			$('#RegionDtlTable').dataTable().fnUpdate(duration, sequence-1, 4);
			
			$('.row-details', $(nTr).prev()).addClass('row-details-close').removeClass('row-details-open');
			regionDtlTable.fnClose($('.row-details', $(nTr).prev()).parents('tr')[0]);
		}
	});
	$('body').on('click', '.pix-updateregiondtl_text', function(event) {
		event.preventDefault();
		var form = $(event.target).parents('form')[0];
		if ($(form).valid()) {
			var nTr = $(event.target).parents('tr')[1];
			var sequence = $(nTr).prev().children('td')[1].innerHTML;
			var duration = $('input[name=duration]', form).val();
			var direction = $('select[name=direction]', form).val();
			var speed = $('select[name=speed]', form).val();
			var color = $('input[name=color]', form).val();
			var size = $('input[name=size]', form).val();
			var opacity = $('input[name=opacity]', form).val();
			var raw = $('textarea', form).val();
			
			tempRegionDtlData[sequence-1].duration = duration;
			tempRegionDtlData[sequence-1].direction = direction;
			tempRegionDtlData[sequence-1].speed = speed;
			tempRegionDtlData[sequence-1].color = color;
			tempRegionDtlData[sequence-1].size = size;
			tempRegionDtlData[sequence-1].opacity = opacity;
			tempRegionDtlData[sequence-1].raw = raw;
			
			$('#RegionDtlTable').dataTable().fnUpdate(raw, sequence-1, 3);
			$('#RegionDtlTable').dataTable().fnUpdate(duration, sequence-1, 4);
			
			$('.row-details', $(nTr).prev()).addClass('row-details-close').removeClass('row-details-open');
			regionDtlTable.fnClose($('.row-details', $(nTr).prev()).parents('tr')[0]);
		}
	});

	//初始化文本编辑界面
    $("#RegionDtlTextSize").ionRangeSlider({
        min: 10,
        max: 100,
        type: 'single',
        step: 1,
        postfix: " px",
        prettify: false,
        hasGrid: false
    });
    $("#RegionDtlTextOpacity").ionRangeSlider({
        min: 0,
        max: 100,
        type: 'single',
        step: 1,
        postfix: "",
        prettify: false,
        hasGrid: false
    }); 
    $('.colorPick').colorpicker();
}


//==============================编制计划对话框====================================		
function initScheduleModal() {
	FormValidateOption.rules = {};
	FormValidateOption.rules['starttime'] = {};
	FormValidateOption.rules['starttime']['required'] = true;
	FormValidateOption.rules['endtime'] = {};
	FormValidateOption.rules['endtime']['required'] = true;
	$('#ScheduleForm').validate(FormValidateOption);
	
	//在列表页面中点击编制计划
	$('body').on('click', '.pix-schedule', function(event) {
		var scheduleModal = $('#ScheduleModal');
		var data = $('#MyTable').dataTable().fnGetData($(event.target).attr("data-id"));
		currentLayoutid = data.layoutid;
		scheduleModal.modal();				
	});	
	
	//编制计划对话框中的设备table初始化
	$('#DeviceTable').dataTable({
		"sDom" : "<'row'<'col-md-6 col-sm-12'l><'col-md-12 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", //default layout without horizontal scroll(remove this setting to enable horizontal scroll for the table)
		"aLengthMenu" : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		"bProcessing" : true,
		"bServerSide" : true,
		"sAjaxSource" : myurls['device.list'],
		"aoColumns" : [ {"sTitle" : "名称", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "位置", "mData" : "position", "bSortable" : false }, 
						{"sTitle" : "硬编码", "mData" : "hardkey", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "deviceid", "bSortable" : false }],
		"iDisplayLength" : 10,
		"sPaginationType" : "bootstrap",
		"oLanguage" : DataTableLanguage,
		"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
			$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-adddevice">增加</button>');
			return nRow;
		}
	});
	jQuery('#DeviceTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); // modify table search input
	jQuery('#DeviceTable_wrapper .dataTables_length select').addClass("form-control input-small"); // modify table per page dropdown
	
	//编制计划对话框中的设备组table初始化
	$('#DeviceGroupTable').dataTable({
		"sDom" : "<'row'<'col-md-6 col-sm-12'l><'col-md-12 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", //default layout without horizontal scroll(remove this setting to enable horizontal scroll for the table)
		"aLengthMenu" : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		"bProcessing" : true,
		"bServerSide" : true,
		"sAjaxSource" : myurls['devicegroup.list'],
		"aoColumns" : [ {"sTitle" : "名称", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "devicegroupid", "bSortable" : false }],
		"iDisplayLength" : 10,
		"sPaginationType" : "bootstrap",
		"oLanguage" : DataTableLanguage,
		"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
			$('td:eq(1)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-adddevicegroup">增加</button>');
			return nRow;
		}
	});
	jQuery('#DeviceGroupTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); // modify table search input
	jQuery('#DeviceGroupTable_wrapper .dataTables_length select').addClass("form-control input-small"); // modify table per page dropdown
	
	//编制计划对话框中的右侧设备选择列表初始化
	$('#DeviceSelectedTable').dataTable({
		"sDom" : "t",
		"iDisplayLength" : -1,
		"aoColumns" : [ {"sTitle" : "#", "bSortable" : false }, 
						{"sTitle" : "名称", "bSortable" : false }, 
						{"sTitle" : "操作", "bSortable" : false }],
		"oLanguage" : { "sZeroRecords" : '列表为空',
						"sEmptyTable" : '列表为空' }, 
		"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
			$('td:eq(2)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-deletedevice">移除</button>');
			return nRow;
		}
	});
	
	//编制计划对话框中的右侧设备组选择列表初始化
	$('#DeviceGroupSelectedTable').dataTable({
		"sDom" : "t",
		"iDisplayLength" : -1,
		"aoColumns" : [ {"sTitle" : "#", "bSortable" : false }, 
						{"sTitle" : "名称", "bSortable" : false }, 
						{"sTitle" : "操作", "bSortable" : false }],
		"oLanguage" : { "sZeroRecords" : '列表为空',
						"sEmptyTable" : '列表为空' }, 
		"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
			$('td:eq(2)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-deletedevicegroup">移除</button>');
			return nRow;
		}
	});

	//编制计划对话框中，增加终端到终端列表
	$('body').on('click', '.pix-adddevice', function(event) {
		var data = $('#DeviceTable').dataTable().fnGetData($(event.target).attr("data-id"));
		
		var d = deviceSelectedList.filter(function (el) {
			return el.deviceid == data.deviceid;
		});	
		if (d.length == 0) {
			var device = {};
			device.deviceid = data.deviceid;
			device.name = data.name;
			device.sequence = deviceSelectedList.length + 1;
			
			deviceSelectedList[deviceSelectedList.length] = device;
			$('#DeviceSelectedTable').dataTable().fnAddData([device.sequence, device.name, device.deviceid]);
		}
	});

	//编制计划对话框中，增加终端组到终端组列表
	$('body').on('click', '.pix-adddevicegroup', function(event) {
		var data = $('#DeviceGroupTable').dataTable().fnGetData($(event.target).attr("data-id"));
		
		var d = devicegroupSelectedList.filter(function (el) {
			return el.devicegroupid == data.devicegroupid;
		});	
		if (d.length == 0) {
			var devicegroup = {};
			devicegroup.devicegroupid = data.devicegroupid;
			devicegroup.name = data.name;
			devicegroup.sequence = devicegroupSelectedList.length + 1;
			
			devicegroupSelectedList[devicegroupSelectedList.length] = devicegroup;
			$('#DeviceGroupSelectedTable').dataTable().fnAddData([devicegroup.sequence, devicegroup.name, devicegroup.devicegroupid]);
		}
	});

	//编制计划对话框中，删除设备列表某行
	$('body').on('click', '.pix-deletedevice', function(event) {
		var rowIndex = $(event.target).attr("data-id");
		for (var i=rowIndex; i<$('#DeviceSelectedTable').dataTable().fnSettings().fnRecordsDisplay(); i++) {
			var data = $('#DeviceSelectedTable').dataTable().fnGetData(i);
			$('#DeviceSelectedTable').dataTable().fnUpdate(i, parseInt(i), 0);
		}
		$('#DeviceSelectedTable').dataTable().fnDeleteRow(rowIndex);
		
		for (var i=rowIndex; i<deviceSelectedList.length; i++) {
			deviceSelectedList[i].sequence = i;
		}
		deviceSelectedList.splice(rowIndex, 1);
	});
	
	//编制计划对话框中，删除设备组列表某行
	$('body').on('click', '.pix-deletedevicegroup', function(event) {
		var rowIndex = $(event.target).attr("data-id");
		for (var i=rowIndex; i<$('#DeviceGroupSelectedTable').dataTable().fnSettings().fnRecordsDisplay(); i++) {
			var data = $('#DeviceGroupSelectedTable').dataTable().fnGetData(i);
			$('#DeviceGroupSelectedTable').dataTable().fnUpdate(i, parseInt(i), 0);
		}
		$('#DeviceGroupSelectedTable').dataTable().fnDeleteRow(rowIndex);
		
		for (var i=rowIndex; i<devicegroupSelectedList.length; i++) {
			devicegroupSelectedList[i].sequence = i;
		}
		devicegroupSelectedList.splice(rowIndex, 1);
	});
	
	//在编制计划对话框中进行提交
	$('#ScheduleModal-Btn').on('click', function(event) {
		if ($('#ScheduleForm').valid()) {
			var schedules = [];
			for (var i=0; i<deviceSelectedList.length; i++) {
				var schedule = {};
				schedule.scheduleid = 0;
				schedule.deviceid = deviceSelectedList[i].deviceid;
				schedule.devicegroupid = 0;
				schedule.layoutid = currentLayoutid;
				schedule.fromdate = $('#ScheduleForm input[name=starttime]').attr('value') + ':00';
				schedule.todate = $('#ScheduleForm input[name=endtime]').attr('value') + ':00';
				schedule.priority = 0;
				schedules[schedules.length] = schedule;
			}
			for (var i=0; i<devicegroupSelectedList.length; i++) {
				var schedule = {};
				schedule.scheduleid = 0;
				schedule.deviceid = 0;
				schedule.devicegroupid = devicegroupSelectedList[i].devicegroupid;
				schedule.layoutid = currentLayoutid;
				schedule.fromdate = $('#ScheduleForm input[name=starttime]').attr('value') + ':00';
				schedule.todate = $('#ScheduleForm input[name=endtime]').attr('value') + ':00';
				schedule.priority = 0;
				schedules[schedules.length] = schedule;
			}
			
			$.ajax({
				type : 'POST',
				url : myurls['schedule.batchadd'],
				data : '{"schedules":' + $.toJSON(schedules) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					$('#ScheduleModal').modal('hide');
					if (data.errorcode == 0) {
						bootbox.alert('操作成功');
					} else {
						bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
					}
				},
				error : function() {
					$('#ScheduleModal').modal('hide');
					bootbox.alert('出错了!');
				}
			});

			event.preventDefault();
		}
	});	
	
	
    $(".form_datetime").datetimepicker({
        autoclose: true,
        isRTL: App.isRTL(),
        format: "yyyy-mm-dd hh:ii:ss",
        pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
        language: "zh-CN",
        minuteStep: 5
    });


}
