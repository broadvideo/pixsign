var myurls = {
	'layout.list' : 'layout!list.action',
	'layout.get' : 'layout!get.action',
	'tpllayout.get' : 'tpllayout!get.action',
	'media.videolist' : 'media!videolist.action',
	'media.imagelist' : 'media!imagelist.action',
	'livesource.list' : 'livesource!list.action',
	'widgetsource.list' : 'widgetsource!list.action',
	'device.list' : 'device!list.action',
	'devicegroup.list' : 'devicegroup!list.action',
	'layout.wizard' : 'layout!wizard.action',
	'branch.list' : 'branch!list.action',
	'schedule.listbytask' : 'schedule!listbytask.action',
	'schedulefile.list' : 'schedulefile!list.action',
	'metroline.list' : 'metroline!list.action',
};

function initWizard() {
	initTab1();
	initTab2();
	initTab3();
	initTab4();
	initTab5();
	initTab6();
	initData1();
	
    var handleTitle = function(tab, navigation, index) {
        var total = navigation.find('li').length;
        var current = index + 1;
        // set wizard title
        $('.step-title', $('#MyWizard')).text('Step ' + (index + 1) + ' of ' + total);
        // set done steps
        jQuery('li', $('#MyWizard')).removeClass("done");
        var li_list = navigation.find('li');
        for (var i = 0; i < index; i++) {
            jQuery(li_list[i]).addClass("done");
        }

        if (current == 1) {
            $('#MyWizard').find('.button-previous').hide();
        } else {
            $('#MyWizard').find('.button-previous').show();
        }

        if (current >= total) {
            $('#MyWizard').find('.button-next').hide();
            $('#MyWizard').find('.button-submit').show();
        } else {
            $('#MyWizard').find('.button-next').show();
            $('#MyWizard').find('.button-submit').hide();
        }
        App.scrollTo($('.page-title'));
        $('.form-group').removeClass('has-error');
    };

    // default form wizard
    $('#MyWizard').bootstrapWizard({
        'nextSelector': '.button-next',
        'previousSelector': '.button-previous',
        onTabClick: function (tab, navigation, index, clickedIndex) {
            if ((clickedIndex-index)>1) {
                return false;
            }
            if (index == 0 && clickedIndex == 1) {
            	if ($('#TaskForm').valid() == false) {
            		return false;
            	} else {
            		initData2();
            	}
            } else if (index == 1 && clickedIndex == 2) {
            	if ($('#LayoutOptionForm').valid() == false) {
            		return false;
            	} else {
            		initData3();
            	}
            } else if (index == 2 && clickedIndex == 3) {
            	for (var i=0; i<currentLayoutData.regions.length; i++) {
            		if (currentLayoutData.regions[i].regiondtls.length == 0) {
                		bootbox.alert('每个区域需要添加至少一个内容。');
                		return false;
            		}
            	}
            } else if (index == 3 && clickedIndex == 4) {
            	if (deviceSelectedList.length == 0 && devicegroupSelectedList.length == 0) {
            		bootbox.alert('需要选择终端或者终端组。');
            		return false;
            	}
            } else if (index == 4 && clickedIndex == 5) {
            	if ($('#ScheduleForm').valid() == false) {
            		return false;
            	} else {
            		initData6();
            	}
            }
            //handleTitle(tab, navigation, clickedIndex);
        },
        onNext: function (tab, navigation, index) {
        	if (index == 1) {
            	if ($('#TaskForm').valid() == false) {
            		return false;
            	} else {
            		initData2();
            	}
        	} else if (index == 2) {
            	if ($('#LayoutOptionForm').valid() == false) {
            		return false;
            	} else {
            		initData3();
            	}
            } else if (index == 3) {
            	for (var i=0; i<currentLayoutData.regions.length; i++) {
            		if (currentLayoutData.regions[i].regiondtls.length == 0) {
                		bootbox.alert('每个区域需要添加至少一个内容。');
                		return false;
            		}
            	}
            } else if (index == 4) {
            	if (deviceSelectedList.length == 0 && devicegroupSelectedList.length == 0) {
            		bootbox.alert('需要选择终端或者终端组。');
            		return false;
            	}
            } else if (index == 5) {
            	if ($('#ScheduleForm').valid() == false) {
            		return false;
            	} else {
            		initData6();
            	}
            }
            //handleTitle(tab, navigation, index);
        },
        onPrevious: function (tab, navigation, index) {
            //handleTitle(tab, navigation, index);
        },
        onTabShow: function (tab, navigation, index) {
            var total = navigation.find('li').length;
            var current = index + 1;
            var $percent = (current / total) * 100;
            $('#MyWizard').find('.progress-bar').css({
                width: $percent + '%'
            });
            handleTitle(tab, navigation, index);
        }
    });

    $('#MyWizard').find('.button-previous').hide();
    $('#MyWizard .button-submit').click(function () {
    	submitData();
    }).hide();
	
}

function initTab1() {
    FormValidateOption.rules = {};
	FormValidateOption.rules['task.name'] = {};
	FormValidateOption.rules['task.name']['required'] = true;
	FormValidateOption.submitHandler = function(form) {
		$('#MyWizard').bootstrapWizard('next');
	};
	$('#TaskForm').validate(FormValidateOption);
}

function initTab2() {
	$('input[name="layout.option"]').click(function(e) {
		if ($('input[name="layout.option"]:checked').val() == 1) {
			$('.layout-option1').css('display', 'block');
			$('.layout-option2').css('display', 'none');
		    FormValidateOption.rules = {};
			FormValidateOption.rules['layout.name'] = {};
			FormValidateOption.rules['layout.name']['required'] = true;
			FormValidateOption.rules['layout.name']['minlength'] = 2;
			$('#LayoutOptionForm').validate(FormValidateOption);
		    $.extend($("#LayoutOptionForm").validate().settings, {
		    	rules: FormValidateOption.rules
			});
		} else {
			$('.layout-option1').css('display', 'none');
			$('.layout-option2').css('display', 'block');
		    FormValidateOption.rules = {};
			FormValidateOption.rules['layout.layoutid'] = {};
			FormValidateOption.rules['layout.layoutid']['required'] = true;
			FormValidateOption.ignore = ':not(:visible),:disabled';
			$('#LayoutOptionForm').validate(FormValidateOption);
		    $.extend($("#LayoutOptionForm").validate().settings, {
		    	rules: FormValidateOption.rules
			});
		}
	});  

    $("#LayoutSelect").select2({
        placeholder: "请选择节目单",
        //minimumResultsForSearch: -1,
        minimumInputLength: 0,
        ajax: { 
            url: myurls['layout.list'],
            type: 'GET',
            dataType: 'json',
            data: function (term, page) {
                return {
                	sSearch: term, // search term
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
            				id:item.layoutid,
            				item:item
            			};
            		}),
            		more: more
            	};
            }
        },
        formatResult: function (layout) {
        	return layout.text;
        },
        formatSelection: function (layout) {
        	return layout.text;
        },
        initSelection: function(element, callback) {
        	callback({id: currentevent.layoutid, text: currentevent.title });
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
    });
    $('#LayoutSelect').on("change", function() {
		var layout = $('#LayoutSelect').select2('data').item;
		var canvas = document.getElementById('LayoutCanvas');
		var ctx = canvas.getContext('2d');
		var scale;
		if (layout.width == 1920 || layout.width == 1080) {
			scale = 1920/200;
		} else {
			scale = 800/200;
		}
		canvas.width = Math.max(layout.width/scale, 250);
		canvas.height = Math.max(layout.height/scale, 120);
		for (var i=0; i<layout.regions.length; i++) {
			var width = layout.regions[i].width/scale;
			var height = layout.regions[i].height/scale;
			var top = layout.regions[i].topoffset/scale;
			var left = layout.regions[i].leftoffset/scale;
			ctx.fillStyle='#bcc2f2';
			ctx.fillRect(left,top,width,height);
			ctx.strokeStyle = "#000000";
			ctx.strokeRect(left,top,width,height);
		}
    });

    FormValidateOption.rules = {};
	FormValidateOption.rules['layout.name'] = {};
	FormValidateOption.rules['layout.name']['required'] = true;
	FormValidateOption.rules['layout.name']['minlength'] = 2;
	FormValidateOption.ignore = null;
	$('#LayoutOptionForm').validate(FormValidateOption);

	//Init LayoutTemplate
	$.ajax({
		type : "POST",
		url : "tpllayout!list.action",
		data : {'type' : '1'},
		success : function(data, status) {
			if (data.errorcode == 0) {
				/*
				for (var i=0; i<data.aaData.length; i++) {
					$("#TpllayoutSelect").append("<option value='" + data.aaData[i].tpllayoutid + "'>" + data.aaData[i].name + "</option>");
				}*/
				var tpllayoutTableHtml = '';
				tpllayoutTableHtml += '<tr>';
				for (var i=0; i<data.aaData.length; i++) {
					tpllayoutTableHtml += '<td><canvas id="TpllayoutCanvas' + data.aaData[i].tpllayoutid + '"></canvas></td>';
				}
				tpllayoutTableHtml += '</tr>';
				tpllayoutTableHtml += '<tr>';
				for (var i=0; i<data.aaData.length; i++) {
					tpllayoutTableHtml += '<td>';
					tpllayoutTableHtml += '<label class="radio-inline">';
					if (i == 0) {
						tpllayoutTableHtml += '<input type="radio" name="tpllayoutid" value="' + data.aaData[i].tpllayoutid + '" checked>';
					} else {
						tpllayoutTableHtml += '<input type="radio" name="tpllayoutid" value="' + data.aaData[i].tpllayoutid + '">';
					}
					tpllayoutTableHtml += data.aaData[i].name + '</label>';
					tpllayoutTableHtml += '</td>';
				}
				tpllayoutTableHtml += '</tr>';
				$('#TpllayoutTable').html(tpllayoutTableHtml);
				for (var i=0; i<data.aaData.length; i++) {
					initTpllayoutCanvas(data.aaData[i]);
				}
			} else {
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
		}
	});
	
	function initTpllayoutCanvas(tpllayout) {
		var canvas = document.getElementById('TpllayoutCanvas' + tpllayout.tpllayoutid);
		var ctx = canvas.getContext('2d');
		var scale;
		if (tpllayout.width == 1920 || tpllayout.width == 1080) {
			scale = 1920/200;
		} else {
			scale = 800/200;
		}
		canvas.width = Math.max(tpllayout.width/scale, 250);
		canvas.height = Math.max(tpllayout.height/scale, 120);
		for (var i=0; i<tpllayout.tplregions.length; i++) {
			var width = tpllayout.tplregions[i].width/scale;
			var height = tpllayout.tplregions[i].height/scale;
			var top = tpllayout.tplregions[i].topoffset/scale;
			var left = tpllayout.tplregions[i].leftoffset/scale;
			ctx.fillStyle='#bcc2f2';
			ctx.fillRect(left,top,width,height);
			ctx.strokeStyle = "#000000";
			ctx.strokeRect(left,top,width,height);
		}
	}

}


function initTab3() {
	//设计对话框中的右侧列表初始化
	$('#RegionDtlShowTable').dataTable({
		'sDom' : 't',
		'iDisplayLength' : -1,
		'aoColumns' : [ {'sTitle' : '#', 'bSortable' : false }, 
						{'sTitle' : '类型', 'bSortable' : false, 'sWidth' : '50px' }, 
						{'sTitle' : '内容', 'bSortable' : false, 'sClass': 'autowrap' }, 
						{'sTitle' : '时长', 'bSortable' : false, 'sWidth' : '50px' }],
		'oLanguage' : { 'sZeroRecords' : '列表为空',
						'sEmptyTable' : '列表为空' }
	});
				
	
	//在设计对话框的区域中增加媒体明细
	$('body').on('click', '.pix-region-dtl', function(event) {
		liveEditFlag = 1;
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
			} else if (regiondtl.mediatype == '4') {
				mediatype = '直播';
			} else if (regiondtl.mediatype == '5') {
				mediatype = '影片';
			} else if (regiondtl.mediatype == '6') {
				mediatype = '广告';
			} else if (regiondtl.mediatype == '7') {
				mediatype = 'Widget';
			} else if (regiondtl.mediatype == '8') {
				mediatype = 'Pixcast';
			} else {
				mediatype = '未知';
			}
			var duration = regiondtl.duration;
			if (duration == 0) {
				duration = '-';
			}
			$('#RegionDtlTable').dataTable().fnAddData([regiondtl.sequence, regiondtl.sequence, mediatype, regiondtl.raw, duration, regiondtl.regiondtlid]);
		}
		
		if (currentRegionData.code == 'PIDS-Main') {
			if (videoflag == 1) {
				$('.videoflag').css("display", "block");
			} else {
				$('.videoflag').css("display", "none");
			}
			if (liveflag == 1) {
				$('.liveflag').css("display", "block");
			} else {
				$('.liveflag').css("display", "none");
			}
			$('.imageflag').css("display", "none");
			$('.textflag').css("display", "none");
			$('.widgetflag').css("display", "none");
			
			if (videoflag == 1) {
				$('#nav_tab1').addClass('active');
				$('#portlet_tab1').addClass('active');
				$('#nav_tab5').removeClass('active');
				$('#portlet_tab5').removeClass('active');
				$('#nav_tab6').removeClass('active');
				$('#portlet_tab6').removeClass('active');
			} else if (liveflag == 1) {
				$('#nav_tab6').addClass('active');
				$('#portlet_tab6').addClass('active');
				$('#nav_tab1').removeClass('active');
				$('#portlet_tab1').removeClass('active');
				$('#nav_tab5').removeClass('active');
				$('#portlet_tab5').removeClass('active');
			}
		} else if (currentRegionData.code == 'PIDS-Text') {
			$('#nav_tab5').addClass('active');
			$('#portlet_tab5').addClass('active');
			$('#nav_tab1').removeClass('active');
			$('#portlet_tab1').removeClass('active');
			$('#nav_tab6').removeClass('active');
			$('#portlet_tab6').removeClass('active');
			$('.textflag').css("display", "block");
			$('.videoflag').css("display", "none");
			$('.imageflag').css("display", "none");
			$('.liveflag').css("display", "none");
			$('.widgetflag').css("display", "none");
		} else {
			if (videoflag == 1) {
				$('.videoflag').css("display", "block");
			} else {
				$('.videoflag').css("display", "none");
			}
			if (imageflag == 1) {
				$('.imageflag').css("display", "block");
			} else {
				$('.imageflag').css("display", "none");
			}
			if (textflag == 1) {
				$('.textflag').css("display", "block");
			} else {
				$('.textflag').css("display", "none");
			}
			if (liveflag == 1) {
				$('.liveflag').css("display", "block");
			} else {
				$('.liveflag').css("display", "none");
			}
			if (widgetflag == 1) {
				$('.widgetflag').css("display", "block");
			} else {
				$('.widgetflag').css("display", "none");
			}
			
			if (videoflag == 1) {
				$('#nav_tab1').addClass('active');
				$('#portlet_tab1').addClass('active');
			} else if (imageflag == 1) {
				$('#nav_tab2').addClass('active');
				$('#portlet_tab2').addClass('active');
			} else if (textflag == 1) {
				$('#nav_tab5').addClass('active');
				$('#portlet_tab5').addClass('active');
			} else if (liveflag == 1) {
				$('#nav_tab6').addClass('active');
				$('#portlet_tab6').addClass('active');
			} else if (widgetflag == 1) {
				$('#nav_tab7').addClass('active');
				$('#portlet_tab7').addClass('active');
			}
		}
		$('#RegionDtlModal').modal();
	});			
	
	initRegionEditModal();
	initRegionDtlModal();
}


function initTab4() {
	//编制计划对话框中的设备table初始化
	$('#DeviceTable').dataTable({
		'sDom' : "<'row'r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", //default layout without horizontal scroll(remove this setting to enable horizontal scroll for the table)
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['device.list'],
		'aoColumns' : [ {'sTitle' : '终端ID', 'mData' : 'terminalid', 'bSortable' : false }, 
		                {'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false }, 
		                {'sTitle' : '位置', 'mData' : 'position', 'bSortable' : false }, 
						{'sTitle' : '操作', 'mData' : 'deviceid', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-adddevice">增加</button>');
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			if ($('#MetrolineSelect').val() >= 0) {
		        aoData.push({'name':'metrolineid','value':$('#MetrolineSelect').val() });
			}
			if ($('#MetrostationSelect').val() >= 0) {
		        aoData.push({'name':'metrostationid','value':$('#MetrostationSelect').val() });
			}
			if ($('#MetrotypeSelect').val() >= 0) {
		        aoData.push({'name':'metrotype','value':$('#MetrotypeSelect').val() });
			}
			if ($('#MetrodirectionSelect').val() >= 0) {
		        aoData.push({'name':'metrodirection','value':$('#MetrodirectionSelect').val() });
			}
		}
	});
	
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
	jQuery('#DeviceGroupTable_wrapper .dataTables_filter input').addClass("form-control input-small"); // modify table search input
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
			device.rate = data.rate;
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

	$.ajax({
		type : 'POST',
		url : myurls['metroline.list'],
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				metrodata = data.aaData;
				$('#MetrolineSelect').empty();
				$('#MetrolineSelect').append('<option value="-1">全部</option>');
				$('#MetrostationSelect').empty();
				$('#MetrostationSelect').append('<option value="-1">全部</option>');
				for (var i=0; i<metrodata.length; i++) {
					$('#MetrolineSelect').append('<option value="' + metrodata[i].metrolineid + '">' +  metrodata[i].name + '</option>');
				}
			} else {
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
		}
	});

	$('#MetrolineSelect').change(function() {
		$('#MetrostationSelect').empty();
		$('#MetrostationSelect').append('<option value="-1">全部</option>');
		var metrolineid = $('#MetrolineSelect').val();
		var metrolines = metrodata.filter(function (el) {
			return el.metrolineid == metrolineid;
		});
		if (metrolines.length > 0) {
			var metrostations = metrolines[0].metrostations;
			if (metrostations.length > 0) {
				for (var i=0; i<metrostations.length; i++) {
					$('#MetrostationSelect').append('<option value="' + metrostations[i].metrostationid + '">' +  metrostations[i].name + '</option>');
				}
			}
		}
		
		$('#DeviceTable').dataTable()._fnAjaxUpdate();
	});

	$('#MetrostationSelect').change(function() {
		$('#DeviceTable').dataTable()._fnAjaxUpdate();
	});

	$('#MetrotypeSelect').change(function() {
		$('#MetrodirectionSelect').empty();
		$('#MetrodirectionSelect').append('<option value="-1">全部</option>');
		if ($('#MetrotypeSelect').val() == 1) {
			$('#MetrodirectionSelect').append('<option value="0">上行</option>');
			$('#MetrodirectionSelect').append('<option value="1">下行</option>');
		}
		
		$('#DeviceTable').dataTable()._fnAjaxUpdate();
	});

	$('#MetrodirectionSelect').change(function() {
		$('#DeviceTable').dataTable()._fnAjaxUpdate();
	});
}


function initTab5() {
	$('input[name="task.type"]').click(function(e) {
		if ($('input[name="task.type"]:checked').val() == 1) {
			$('.task-type1').css('display', 'block');
			FormValidateOption.rules = {};
			FormValidateOption.rules['starttime'] = {};
			FormValidateOption.rules['starttime']['required'] = true;
			FormValidateOption.rules['endtime'] = {};
			FormValidateOption.rules['endtime']['required'] = true;
			$('#ScheduleForm').validate(FormValidateOption);
		    $.extend($("#ScheduleForm").validate().settings, {
		    	rules: FormValidateOption.rules
			});
		} else {
			$('.task-type1').css('display', 'none');
			FormValidateOption.rules = {};
			$('#ScheduleForm').validate(FormValidateOption);
		    $.extend($("#ScheduleForm").validate().settings, {
		    	rules: FormValidateOption.rules
			});
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


function initTab6() {
	
}

function initData1() {
	var d = new Date().format('yyyyMMdd_hhmmss');
	$('input[name="task.name"]').attr('value', myUser + '_' + d);
}

function initData2() {
	liveDtlFlag = 0;
	liveEditFlag = 0;
	
	$('input[name="layout.option"][value="1"]').attr("checked", true);
	$('input[name="layout.option"][value="1"]').parent().addClass("checked");
	$('input[name="layout.option"][value="2"]').attr("checked", false);
	$('input[name="layout.option"][value="2"]').parent().removeClass("checked");
	$('input[name="layout.name"]').attr("value", $('input[name="task.name"]').val());
	$('textarea[name="layout.description"]').html('');
	$('input[name="layoutid"]').attr("value", '');
	$('.layout-option1').css('display', 'block');
	$('.layout-option2').css('display', 'none');

    FormValidateOption.rules = {};
	FormValidateOption.rules['layout.name'] = {};
	FormValidateOption.rules['layout.name']['required'] = true;
	FormValidateOption.rules['layout.name']['minlength'] = 2;
	$('#LayoutOptionForm').validate(FormValidateOption);
    $.extend($("#LayoutOptionForm").validate().settings, {
    	rules: FormValidateOption.rules
	});
}

function initData3() {
	if ($('input[name="layout.option"]:checked').val() == 1) {
		currentLayoutid = 0;
		//var tpllayoutid = $('#TpllayoutSelect').val();
		var tpllayoutid = $('input[name="tpllayoutid"]:checked').val();
		$.ajax({
			type : 'POST',
			url : myurls['tpllayout.get'],
			data : {'tpllayout.tpllayoutid' : tpllayoutid},
			success : function(data, status) {
				if (data.errorcode == 0) {
					var tpllayout = data.tpllayout;
					currentLayoutData = {};
					currentLayoutData.layoutid = 0;
					currentLayoutData.type = tpllayout.type;
					currentLayoutData.width = tpllayout.width;
					currentLayoutData.height = tpllayout.height;
					currentLayoutData.name = $('input[name="layout.name"]').val();
					currentLayoutData.description = $('textarea[name="layout.description"]').val();
					currentLayoutData.status = '1';
					currentLayoutData.regions = [];
					for (var i=0; i<tpllayout.tplregions.length; i++) {
						currentLayoutData.regions[i] = {};
						currentLayoutData.regions[i].layoutid = 0;
						currentLayoutData.regions[i].code = tpllayout.tplregions[i].code;
						currentLayoutData.regions[i].width = tpllayout.tplregions[i].width;
						currentLayoutData.regions[i].height = tpllayout.tplregions[i].height;
						currentLayoutData.regions[i].topoffset = tpllayout.tplregions[i].topoffset;
						currentLayoutData.regions[i].leftoffset = tpllayout.tplregions[i].leftoffset;
						currentLayoutData.regions[i].zindex = tpllayout.tplregions[i].zindex;
						currentLayoutData.regions[i].regionid = 'R' + Math.round(Math.random()*100000000);
						currentLayoutData.regions[i].regiondtls = [];
						if (currentLayoutData.regions[i].code == 'PIDS-Pixcast') {
							currentLayoutData.regions[i].regiondtls[0] = {};
							currentLayoutData.regions[i].regiondtls[0].regiondtlid = '0';
							currentLayoutData.regions[i].regiondtls[0].regionid = currentLayoutData.regions[i].regionid;
							currentLayoutData.regions[i].regiondtls[0].mediatype = '8';
							currentLayoutData.regions[i].regiondtls[0].raw = '列车到站信息';
							currentLayoutData.regions[i].regiondtls[0].duration = '0';
							currentLayoutData.regions[i].regiondtls[0].sequence = '1';
						}
					}
					
					refreshLayoutGUI();
				} else {
					bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert('出错了!');
			}
		});
	} else {
		currentLayoutid = $('#LayoutSelect').val();
		$.ajax({
			type : 'POST',
			url : myurls['layout.get'],
			data : {'layout.layoutid' : currentLayoutid},
			success : function(data, status) {
				if (data.errorcode == 0) {
					currentLayoutData = data.layout;
					refreshLayoutGUI();
            		if (liveDtlFlag == 1) {
                		bootbox.alert('媒体列表明细里包含直播内容，建议重新设置直播排期。');
            		}
				} else {
					bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert('出错了!');
			}
		});
	}
	initData4();
	initData5();
	
	function refreshLayoutGUI() {
		var layout = $('#layout');
		currentLayoutData.scale = currentLayoutData.width / 640;
		layout.attr('layoutid', currentLayoutData.layoutid);
		layout.attr('style', 'position:relative; width:642px; height:' + (2+640*currentLayoutData.height/currentLayoutData.width) + 'px; border: 1px solid #000; background:#000000;');
		layout.empty();
		for (var i=0; i<currentLayoutData.regions.length; i++) {
			var region = currentLayoutData.regions[i];
			var regionhtml = '';
			regionhtml += '<div id="region_' + region.regionid + '" regionenabled="1" regionid="' + region.regionid + '" layoutid="' + currentLayoutData.layoutid + '"';
			regionhtml += 'scale="' + currentLayoutData.scale + '" width="' + region.width/currentLayoutData.scale + 'px" height="' + region.height/currentLayoutData.scale + 'px" ';
			regionhtml += 'onclick="javascript:regiondtlRefresh(\'' + region.regionid + '\')" ondblclick="" ';
			regionhtml += 'class="region" ';
			regionhtml += 'style="text-align:center;position:absolute; width:' + region.width/currentLayoutData.scale + 'px; height:' + region.height/currentLayoutData.scale + 'px; top: ' + region.topoffset/currentLayoutData.scale + 'px; left: ' + region.leftoffset/currentLayoutData.scale + 'px;">';
			regionhtml += ' <div class="regionTransparency " style="width:100%; height:100%;"></div>';
			regionhtml += ' <div class="btn-group regionInfo " style="vertical-align:middle;">';
			if (region.code == 'PIDS-Main') {
				regionhtml += '   <button class="btn pix-region-dtl" data-id="' + region.regionid + '" href="javascript:;"><i class="fa fa-plus"></i>&nbsp;视频区域</button>';
			} else if (region.code == 'PIDS-Text') {
				regionhtml += '   <button class="btn pix-region-dtl" data-id="' + region.regionid + '" href="javascript:;"><i class="fa fa-plus"></i>&nbsp;文本区域</button>';
			} else if (region.code == 'PIDS-Pixcast') {
				regionhtml += '   <button class="btn" href="javascript:;">列车到站信息区域</button>';
			} else {
				regionhtml += '   <button class="btn pix-region-dtl" data-id="' + region.regionid + '" href="javascript:;"><i class="fa fa-plus"></i>&nbsp;媒体列表</button>';
			}
			regionhtml += ' </div><span style="height:100%; width:0; overflow:hidden; display:inline-block; vertical-align:middle;"> </span>';
			regionhtml += '</div>';
			layout.append(regionhtml);
		}
		
		if (currentLayoutData.regions.length > 0) {
			regiondtlRefresh(currentLayoutData.regions[0].regionid);
		}		
	}
}

function initData4() {
	$('#DeviceSelectedTable').dataTable().fnClearTable();
	$('#DeviceGroupSelectedTable').dataTable().fnClearTable();
	deviceSelectedList = [];
	devicegroupSelectedList = [];
}

function initData5() {
	$('.task-type').css('display', 'none');
	$('#ScheduleForm input[name="task.type"][value="1"]').attr("checked", false);
	$('#ScheduleForm input[name="task.type"][value="1"]').parent().addClass("checked");
	$('#ScheduleForm input[name="task.type"][value="2"]').attr("checked", true);
	$('#ScheduleForm input[name="task.type"][value="2"]').parent().removeClass("checked");
	$('#ScheduleForm input[name="starttime"]').attr("value", '');
	$('#ScheduleForm input[name="endtime"]').attr("value", '');
	$('.task-type1').css('display', 'none');
	FormValidateOption.rules = {};
	FormValidateOption.rules['endtime'] = {};
	FormValidateOption.rules['endtime']['required'] = true;
	$('#ScheduleForm').validate(FormValidateOption);
    $.extend($("#ScheduleForm").validate().settings, {
    	rules: FormValidateOption.rules
	});
}

function initData6() {
	var deviceRowspan = deviceSelectedList.length>1 ? deviceSelectedList.length : 1;
	var devicegroupRowspan = devicegroupSelectedList.length>1 ? devicegroupSelectedList.length : 1;
	var filesize = parseInt(currentMediaSum / 1024);
	var html = '';
	html += '<tr>';
	html += '<td>任务</td><td colspan="2">' + $('#TaskForm input[name="task.name"]').val() + '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>布局</td><td colspan="2">' + currentLayoutData.name + '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>视频总量</td><td colspan="2">' + transferIntToComma(filesize) + ' KB</td>';
	html += '</tr>';
	if ($('#ScheduleForm input[name="task.type"]:checked').val() == 1) {
		html += '<tr>';
		html += '<td rowspan="2">排期</td><td colspan="2">开始时间：' + $('#ScheduleForm input[name=starttime]').val() + '</td>';
		html += '</tr>';
		html += '<tr>';
		html += '<td colspan="2">结束时间：' + $('#ScheduleForm input[name=endtime]').val() + '</td>';
		html += '</tr>';
	} else {
		html += '<tr>';
		html += '<td>排期</td><td colspan="2">即时任务</td>';
		html += '</tr>';
	}
	html += '<tr>';
	html += '<td rowspan="'+ deviceRowspan + '">设备</td>';
	html += '<td>' + (deviceSelectedList.length>0? deviceSelectedList[0].name : '') + '</td>';
	if (deviceSelectedList[0].rate > 0) {
		html += '<td>下载估算时间：' + transferIntToTime(parseInt(filesize / deviceSelectedList[0].rate)) + '</td>';
	} else {
		html += '<td>下载估算时间：--</td>';
	}
	html += '</tr>';
	for (var i=1; i<deviceSelectedList.length; i++) {
		html += '<tr>';
		html += '<td>' + deviceSelectedList[i].name + '</td>';
		if (deviceSelectedList[i].rate > 0) {
			html += '<td>下载估算时间：' + transferIntToTime(parseInt(filesize / deviceSelectedList[i].rate)) + '</td>';
		} else {
			html += '<td>下载估算时间：--</td>';
		}
		html += '</tr>';
	}
	html += '<tr>';
	html += '<td rowspan="'+ devicegroupRowspan + '">设备组</td>';
	html += '<td colspan="2">' + (devicegroupSelectedList.length>0? devicegroupSelectedList[0].name : '') + '</td>';
	html += '</tr>';
	for (var i=1; i<devicegroupSelectedList.length; i++) {
		html += '<tr>';
		html += '<td colspan="2">' + devicegroupSelectedList[i].name + '</td>';
		html += '</tr>';
	}

	$('#ConfirmTable').empty();
	$('#ConfirmTable').append(html);
}

var currentLayoutData = {};
var currentRegionData = {};
var tempRegionDtlData = {};

var deviceSelectedList = [];
var devicegroupSelectedList = [];
var currentLayoutid = 0;
var currentMediaSum = 0;

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
		} else if (regiondtl.mediatype == '4') {
			mediatype = '直播';
			liveDtlFlag = 1;
		} else if (regiondtl.mediatype == '5') {
			mediatype = '影片';
		} else if (regiondtl.mediatype == '6') {
			mediatype = '广告';
		} else if (regiondtl.mediatype == '7') {
			mediatype = 'Widget';
		} else if (regiondtl.mediatype == '8') {
			mediatype = 'Pixcast';
		} else {
			mediatype = '未知';
		}
		var duration = regiondtl.duration;
		if (duration == 0) {
			duration = '-';
		}
		$('#RegionDtlShowTable').dataTable().fnAddData([regiondtl.sequence, mediatype, regiondtl.raw, duration]);
	}
}

//==============================修改区域选项对话框====================================			
function initRegionEditModal() {
	FormValidateOption.rules = {};
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
			$('#RegionEditForm .form-group').removeClass('has-error');
			$('#RegionEditForm .help-block').remove();

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

	FormValidateOption.rules = {};
	FormValidateOption.rules['uri'] = {};
	FormValidateOption.rules['uri']['required'] = true;
	FormValidateOption.rules['starttime'] = {};
	FormValidateOption.rules['starttime']['required'] = true;
	FormValidateOption.rules['endtime'] = {};
	FormValidateOption.rules['endtime']['required'] = true;
	$('#RegionDtlLiveForm').validate(FormValidateOption);
		
	FormValidateOption.rules = {};
	FormValidateOption.rules['uri'] = {};
	FormValidateOption.rules['uri']['required'] = true;
	FormValidateOption.rules['duration'] = {};
	FormValidateOption.rules['duration']['required'] = true;
	FormValidateOption.rules['duration']['number'] = true;
	$('#RegionDtlWidgetForm').validate(FormValidateOption);

	//在区域媒体列表对话框中进行提交
	$('#RegionDtlModal-Btn').on('click', function(event) {
		if ($('#RegionDtlLiveForm input[name=uri]').attr("value") != '') {
			bootbox.confirm("你并没有添加直播，确认不添加直播吗？", function(result) {
				if (result) {
					handleRegionDtlModalSubmit();
				}
			});
		} else {
			handleRegionDtlModalSubmit();
		}
		
	});
	$('#RegionDtlModal-Btn').on('click', function(event) {
		if ($('#RegionDtlWidgetForm input[name=uri]').attr("value") != '') {
			bootbox.confirm("你并没有添加Widget，确认不添加Widget吗？", function(result) {
				if (result) {
					handleRegionDtlModalSubmit();
				}
			});
		} else {
			handleRegionDtlModalSubmit();
		}
		
	});
	
	function handleRegionDtlModalSubmit() {
		currentRegionData.regiondtls = $.parseJSON($.toJSON(tempRegionDtlData));
		regiondtlRefresh(currentRegionData.regionid);
	    $('#RegionDtlModal').modal('hide');
	    
	    currentMediaSum = 0;
	    var tempArray = [];
	    for (var i=0; i<currentLayoutData.regions.length; i++) {
		    for (var j=0; j<currentLayoutData.regions[i].regiondtls.length; j++) {
		    	if (currentLayoutData.regions[i].regiondtls[j].mediatype == '2' || 
		    			currentLayoutData.regions[i].regiondtls[j].mediatype == '5' ||
		    			currentLayoutData.regions[i].regiondtls[j].mediatype == '6') {
		    		if (tempArray.indexOf(currentLayoutData.regions[i].regiondtls[j].mediaid) < 0) {
			    		currentMediaSum += currentLayoutData.regions[i].regiondtls[j].media.size;
			    		tempArray[tempArray.length] = currentLayoutData.regions[i].regiondtls[j].mediaid;
		    		}
		    	}
		    }
	    }
	}

	//初始化branch列表
	var myBranch;
	var BranchList = [];
	var currentBranchid = myBranchid;
	$.ajax({
		type : 'POST',
		url : myurls['branch.list'],
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				findMyBranch(data.aaData, 0);
				initBranchBreadcrumb(myBranchid, 1);
				initBranchBreadcrumb(myBranchid, 2);
			} else {
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
		}
	});
	function findMyBranch(branches, index) {
		for (var i=0; i<branches.length; i++) {
			if (myBranch == undefined) {
				BranchList[index] = branches[i];
				if (branches[i].branchid == myBranchid) {
					myBranch = branches[i];
					return;
				}
				findMyBranch(branches[i].children, index+1);
			}
		}
	}
	
	$('body').on('click', '.pix-branch', function(event) {
		currentBranchid = $(event.target).attr('data-id');
		var type = $(event.target).attr('type');
		initBranchBreadcrumb(currentBranchid, type);
		if (type == 1) {
			$('#RegionDtlVideoTable').dataTable()._fnAjaxUpdate();
		} else {
			$('#RegionDtlImageTable').dataTable()._fnAjaxUpdate();
		}
	});

	function initBranchBreadcrumb(branchid, type) {
		var html = '';
		var active = '';
		for (var i=0; i<BranchList.length; i++) {
			if (BranchList[i].branchid == branchid) {
				active = 'active';
			} else {
				active = '';
			}
			html += '<li class="' + active + '">';
			if (i == 0) {
				html += '<i class="fa fa-home"></i>';
			}
			if (BranchList[i].branchid == branchid) {
				html += BranchList[i].name;
			} else {
				html += '<a href="javascript:;" type="' + type + '" data-id="' + BranchList[i].branchid + '" class="pix-branch">' + BranchList[i].name + '</a>';
			}
			if (i < BranchList.length-1) {
				html += '<i class="fa fa-angle-right"></i>';
			}
			html += '</li>';
		}
		if (type == 1) {
			$('#BranchBreadcrumb-video').html(html);
		} else {
			$('#BranchBreadcrumb-image').html(html);
		}
	}
	
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
			videohtml += '<h6>' + aData['name'] + '<br>';
			var filesize = parseInt(aData['size'] / 1024);
			videohtml += '' + transferIntToComma(filesize) + 'KB</h6>';
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
		},
		'fnServerParams': function(aoData) { 
	        aoData.push({'name':'branchid','value':currentBranchid });
	        aoData.push({'name':'type','value':2 });
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
			imagehtml += '<h6>' + aData['name'] + '<br>';
			var filesize = parseInt(aData['size'] / 1024);
			imagehtml += '' + transferIntToComma(filesize) + 'KB</h6>';
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
		},
		'fnServerParams': function(aoData) { 
	        aoData.push({'name':'branchid','value':currentBranchid });
		}
	});
	jQuery('#RegionDtlImageTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); // modify table search input
	jQuery('#RegionDtlImageTable_wrapper .dataTables_length select').addClass("form-control input-small"); // modify table per page dropdown

	//直播列表初始化
    $("#LivesourceSelect").select2({
        placeholder: "请选择直播源",
        //minimumResultsForSearch: -1,
        minimumInputLength: 0,
        ajax: { 
            url: myurls['livesource.list'],
            type: 'GET',
            dataType: 'json',
            data: function (term, page) {
                return {
                	sSearch: term, // search term
                    iDisplayStart: (page-1)*10,
                    iDisplayLength: 10,
                };
            },
            results: function (data, page) {
            	var more = (page * 10) < data.iTotalRecords; 
            	return {
            		results : $.map(data.aaData, function (item) { 
            			return { 
            				text:item.name + '(' + item.uri + ')', 
            				id:item.uri,
            				item:item
            			};
            		}),
            		more: more
            	};
            }
        },
        formatResult: function (item) {
        	return item.text;
        },
        formatSelection: function (item) {
        	return item.id;
        },
        initSelection: function(element, callback) {
        	callback({id: currentevent.layoutid, text: currentevent.title });
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
    });
	
	//Widget列表初始化
    $("#WidgetsourceSelect").select2({
        placeholder: "请选择Widget",
        //minimumResultsForSearch: -1,
        minimumInputLength: 0,
        ajax: { 
            url: myurls['widgetsource.list'],
            type: 'GET',
            dataType: 'json',
            data: function (term, page) {
                return {
                	sSearch: term, // search term
                    iDisplayStart: (page-1)*10,
                    iDisplayLength: 10,
                };
            },
            results: function (data, page) {
            	var more = (page * 10) < data.iTotalRecords; 
            	return {
            		results : $.map(data.aaData, function (item) { 
            			return { 
            				text:item.name + '(' + item.uri + ')', 
            				id:item.uri,
            				item:item
            			};
            		}),
            		more: more
            	};
            }
        },
        formatResult: function (item) {
        	return item.text;
        },
        formatSelection: function (item) {
        	return item.id;
        },
        initSelection: function(element, callback) {
        	callback({id: currentevent.layoutid, text: currentevent.title });
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
    });
	
	//区域媒体列表选择对话框中的右侧选择列表初始化
	var regionDtlTable = $('#RegionDtlTable').dataTable({
		'sDom' : 't',
		'iDisplayLength' : -1,
		'aoColumns' : [ {'sTitle' : '', 'bSortable' : false }, 
						{'sTitle' : '#', 'bSortable' : false, }, 
						{'sTitle' : '类型', 'bSortable' : false, 'sWidth' : '50px' }, 
						{'sTitle' : '内容', 'bSortable' : false, 'sClass': 'autowrap' }, 
						{'sTitle' : '时长', 'bSortable' : false, 'sWidth' : '50px' },
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
		if (regiondtl.mediatype == '1' || regiondtl.mediatype == '2' || regiondtl.mediatype == '5' || regiondtl.mediatype == '6') {
	        sOut += '<form class="form-horizontal regiondtlform">';
	        sOut += '<div class="form-group">';
	        sOut += '<label class="col-md-3 control-label">时长<span class="required">*</span></label>';
	        sOut += '<div class="col-md-6"><input type="text" class="form-control" name="duration" value="' + regiondtl.duration + '"/></div>';
	        sOut += '<div class="col-md-3"><button data-id="" class="btn yellow btn-xs pix-updateregiondtl" href="javascript:;" >更新</button></div>';
	        sOut += '</div></form>';
		} else if (regiondtl.mediatype == '3') {
			sOut += '<form class="regiondtlform">';
			
			sOut += '<table class="col-md-12 col-sd-12">';
			
			sOut += '<tr>';
			sOut += '<td class="col-md-3 col-sd-3">';
	        sOut += '<label class="control-label">时长<span class="required">*</span></label>';
			sOut += '</td>';
			sOut += '<td class="col-md-8 col-sd-8">';
	        sOut += '<input type="text" class="form-control" name="duration" value="' + regiondtl.duration + '"/>';
			sOut += '</td>';
			sOut += '<td class="col-md-1 col-sd-1"></td>';
			sOut += '</tr>';
			sOut += '<tr>';
			sOut += '<td>';
	        sOut += '<label class="control-label">移动方向</label>';
			sOut += '</td>';
			sOut += '<td>';
	        sOut += '<select class="form-control" name="direction" ">';
	        sOut += '<option value="1" style="font-size:14px;padding:5px;" ' + (regiondtl.direction=='1'? 'selected':'') + '>静止</option>';
	        sOut += '<option value="2" style="font-size:14px;padding:5px;" ' + (regiondtl.direction=='2'? 'selected':'') + '>向上</option>';
	        sOut += '<option value="3" style="font-size:14px;padding:5px;" ' + (regiondtl.direction=='3'? 'selected':'') + '>向下</option>';
	        sOut += '<option value="4" style="font-size:14px;padding:5px;" ' + (regiondtl.direction=='4'? 'selected':'') + '>向左</option>';
	        sOut += '<option value="5" style="font-size:14px;padding:5px;" ' + (regiondtl.direction=='5'? 'selected':'') + '>向右</option>';
	        sOut += '</select>';
			sOut += '</td>';
			sOut += '<td></td>';
			sOut += '</tr>';
			sOut += '<tr>';
			sOut += '<td>';
	        sOut += '<label class="control-label">移动速度</label>';
			sOut += '</td>';
			sOut += '<td>';
	        sOut += '<select class="form-control" name="speed" ">';
	        sOut += '<option value="1" style="font-size:14px;padding:5px;" ' + (regiondtl.speed=='1'? 'selected':'') + '>慢</option>';
	        sOut += '<option value="2" style="font-size:14px;padding:5px;" ' + (regiondtl.speed=='2'? 'selected':'') + '>正常</option>';
	        sOut += '<option value="3" style="font-size:14px;padding:5px;" ' + (regiondtl.speed=='3'? 'selected':'') + '>快</option>';
	        sOut += '</select>';
			sOut += '</td>';
			sOut += '<td></td>';
			sOut += '</tr>';
			sOut += '<tr>';
			sOut += '<td>';
	        sOut += '<label class="control-label">颜色</label>';
			sOut += '</td>';
			sOut += '<td>';
	        sOut += '<div class="input-group colorpicker-component colorPick">';
	        sOut += '<input type="text" class="form-control" name="color" value="' + regiondtl.color + '"/>';
	        sOut += '<span class="input-group-addon"><i></i></span>';
	        sOut += '</div>';
			sOut += '</td>';
			sOut += '<td></td>';
			sOut += '</tr>';
			sOut += '<tr>';
			sOut += '<td>';
	        sOut += '<label class="control-label">大小<span class="required">*</span></label>';
			sOut += '</td>';
			sOut += '<td>';
	        sOut += '<input type="text" class="form-control" name="size" value="' + regiondtl.size + '"/>';
			sOut += '</td>';
			sOut += '<td></td>';
			sOut += '</tr>';
			sOut += '<tr>';
			sOut += '<td>';
	        sOut += '<label class="control-label">不透明度<span class="required">*</span></label>';
			sOut += '</td>';
			sOut += '<td>';
	        sOut += '<input type="text" class="form-control" name="opacity" value="' + regiondtl.opacity + '"/>';
			sOut += '</td>';
			sOut += '<td></td>';
			sOut += '</tr>';
			
			sOut += '<tr>';
			sOut += '<td>';
	        sOut += '<div class="form-group"><label class="control-label">内容<span class="required">*</span></label>';
			sOut += '</td>';
			sOut += '<td>';
	        sOut += '<textarea class="form-control" rows="3" class="form-control" name="raw">' + regiondtl.raw + '</textarea>';
	        sOut += '</div>';
			sOut += '</td>';
			sOut += '<td>';
	        sOut += '<button data-id="" class="btn yellow btn-xs pix-updateregiondtl_text" href="javascript:;" >更新</button>';
			sOut += '</td>';
			sOut += '</tr>';

			sOut += '</table></form>';
		} else if (regiondtl.mediatype == '4') {
			sOut += '<form class="regiondtlform">';
			sOut += '<table class="col-md-12 col-sd-12">';			
			sOut += '<tr>';
			sOut += '<td class="col-md-3 col-sd-3">';
	        sOut += '<label class="control-label">直播地址<span class="required">*</span></label>';
			sOut += '</td>';
			sOut += '<td class="col-md-8 col-sd-8">';
	        //sOut += '<input type="text" class="form-control" name="uri" value="' + regiondtl.uri + '"/>';
			sOut += '<input type="hidden" class="form-control select2 livesource" name="uri" value="' + regiondtl.uri + '"/>';
			sOut += '</td>';
			sOut += '<td class="col-md-1 col-sd-1"></td>';
			sOut += '</tr>';
			sOut += '<tr>';
			sOut += '<td>';
	        sOut += '<label class="control-label">开始时间<span class="required">*</span></label>';
			sOut += '</td>';
			sOut += '<td>';
			sOut += '<div class="input-group date form_datetime">';
			sOut += '<input type="text" size="16" readonly class="form-control" name="starttime" value="' + regiondtl.fromdate + '"/>';
			sOut += '<span class="input-group-btn">';
			sOut += '<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>';
			sOut += '</span>';
			sOut += '</div>';
			sOut += '</td>';
			sOut += '<td></td>';
			sOut += '</tr>';
			sOut += '<tr>';
			sOut += '<td>';
	        sOut += '<label class="control-label">结束时间<span class="required">*</span></label>';
			sOut += '</td>';
			sOut += '<td>';
			sOut += '<div class="input-group date form_datetime">';
			sOut += '<input type="text" size="16" readonly class="form-control" name="endtime" value="' + regiondtl.todate + '"/>';
			sOut += '<span class="input-group-btn">';
			sOut += '<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>';
			sOut += '</span>';
			sOut += '</div>';
			sOut += '</td>';
			sOut += '<td><button data-id="" class="btn yellow btn-xs pix-updateregiondtl_live" href="javascript:;" >更新</button></td>';
			sOut += '</tr>';
			sOut += '</table></form>';
		} else if (regiondtl.mediatype == '7') {
			sOut += '<form class="regiondtlform">';
			sOut += '<table class="col-md-12 col-sd-12">';			
			sOut += '<tr>';
			sOut += '<td class="col-md-3 col-sd-3">';
	        sOut += '<label class="control-label">Widget地址<span class="required">*</span></label>';
			sOut += '</td>';
			sOut += '<td class="col-md-8 col-sd-8">';
			sOut += '<input type="hidden" class="form-control select2 widgetsource" name="uri" value="' + regiondtl.uri + '"/>';
			sOut += '</td>';
			sOut += '<td class="col-md-1 col-sd-1"></td>';
			sOut += '</tr>';
			sOut += '<tr>';
			sOut += '<td>';
	        sOut += '<label class="control-label">时长<span class="required">*</span></label>';
			sOut += '</td>';
			sOut += '<td>';
	        sOut += '<input type="text" class="form-control" name="duration" value="' + regiondtl.duration + '"/>';
			sOut += '</td>';
			sOut += '<td><button data-id="" class="btn yellow btn-xs pix-updateregiondtl_widget" href="javascript:;" >更新</button></td>';
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
            $(".form_datetime").datetimepicker({
                autoclose: true,
                isRTL: App.isRTL(),
                format: "yyyy-mm-dd hh:ii:ss",
                pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
                language: "zh-CN",
                minuteStep: 5
            });

            $(".livesource").select2({
            	width: 300,
                placeholder: "请选择直播源",
                //minimumResultsForSearch: -1,
                minimumInputLength: 0,
                ajax: { 
                    url: myurls['livesource.list'],
                    type: 'GET',
                    dataType: 'json',
                    data: function (term, page) {
                        return {
                        	sSearch: term, // search term
                            iDisplayStart: (page-1)*10,
                            iDisplayLength: 10,
                        };
                    },
                    results: function (data, page) {
                    	var more = (page * 10) < data.iTotalRecords; 
                    	return {
                    		results : $.map(data.aaData, function (item) { 
                    			return { 
                    				text:item.name + '(' + item.uri + ')', 
                    				id:item.uri,
                    				item:item
                    			};
                    		}),
                    		more: more
                    	};
                    }
                },
                formatResult: function (item) {
                	return item.text;
                },
                formatSelection: function (item) {
                	return item.id;
                },
                initSelection: function(element, callback) {
                	callback({id: $(element).val(), text: $(element).val() });
                },
                dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
                escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
            });

            $(".widgetsource").select2({
            	width: 300,
                placeholder: "请选择Widget",
                //minimumResultsForSearch: -1,
                minimumInputLength: 0,
                ajax: { 
                    url: myurls['widgetsource.list'],
                    type: 'GET',
                    dataType: 'json',
                    data: function (term, page) {
                        return {
                        	sSearch: term, // search term
                            iDisplayStart: (page-1)*10,
                            iDisplayLength: 10,
                        };
                    },
                    results: function (data, page) {
                    	var more = (page * 10) < data.iTotalRecords; 
                    	return {
                    		results : $.map(data.aaData, function (item) { 
                    			return { 
                    				text:item.name + '(' + item.uri + ')', 
                    				id:item.uri,
                    				item:item
                    			};
                    		}),
                    		more: more
                    	};
                    }
                },
                formatResult: function (item) {
                	return item.text;
                },
                formatSelection: function (item) {
                	return item.id;
                },
                initSelection: function(element, callback) {
                	callback({id: $(element).val(), text: $(element).val() });
                },
                dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
                escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
            });

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
		regiondtl.media = {};
		regiondtl.media.size = data.size;
		
		tempRegionDtlData[tempRegionDtlData.length] = regiondtl;
		var duration = regiondtl.duration;
		if (duration == 0) {
			duration = '-';
		}
		$('#RegionDtlTable').dataTable().fnAddData([regiondtl.sequence, regiondtl.sequence, '视频', regiondtl.raw, duration, regiondtl.regiondtlid]);
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
		regiondtl.media = {};
		regiondtl.media.size = data.size;
		
		tempRegionDtlData[tempRegionDtlData.length] = regiondtl;
		var duration = regiondtl.duration;
		if (duration == 0) {
			duration = '-';
		}
		$('#RegionDtlTable').dataTable().fnAddData([regiondtl.sequence, regiondtl.sequence, '图片', regiondtl.raw, duration, regiondtl.regiondtlid]);
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
			var duration = regiondtl.duration;
			if (duration == 0) {
				duration = '-';
			}
			$('#RegionDtlTable').dataTable().fnAddData([regiondtl.sequence, regiondtl.sequence, '文本', regiondtl.raw, duration, regiondtl.regiondtlid]);
		}
	});			
	
	//区域媒体列表选择对话框中，增加直播到区域列表
	$('body').on('click', '.pix-addregionlivedtl', function(event) {
		if ($('#RegionDtlLiveForm').valid()) {
			$('.form-group').removeClass('has-error');
			$('.help-block').remove();

			var regiondtl = {};
			regiondtl.regiondtlid = 0;
			regiondtl.regionid = currentRegionData.regionid;
			regiondtl.mediatype = '4';
			regiondtl.mediaid = 0;
			regiondtl.uri = $('#RegionDtlLiveForm input[name=uri]').attr("value");
			regiondtl.fromdate = $('#RegionDtlLiveForm input[name=starttime]').attr("value");
			regiondtl.todate = $('#RegionDtlLiveForm input[name=endtime]').attr("value");
			regiondtl.raw = regiondtl.uri;
			regiondtl.duration = 0;
			regiondtl.sequence = tempRegionDtlData.length + 1;
			
			tempRegionDtlData[tempRegionDtlData.length] = regiondtl;
			var duration = regiondtl.duration;
			if (duration == 0) {
				duration = '-';
			}
			$('#RegionDtlTable').dataTable().fnAddData([regiondtl.sequence, regiondtl.sequence, '直播', regiondtl.uri, duration, regiondtl.regiondtlid]);

			$('#ScheduleForm input[name="starttime"]').attr("value", $('#RegionDtlLiveForm input[name=starttime]').attr("value"));
			$('#ScheduleForm input[name="endtime"]').attr("value", $('#RegionDtlLiveForm input[name=endtime]').attr("value"));
			$('#RegionDtlLiveForm input[name=starttime]').attr("value", '');
			$('#RegionDtlLiveForm input[name=endtime]').attr("value", '');
			$('#RegionDtlLiveForm input[name=uri]').attr("value", '');
		}
	});			
	
	//区域媒体列表选择对话框中，增加Widget到区域列表
	$('body').on('click', '.pix-addregionwidgetdtl', function(event) {
		if ($('#RegionDtlWidgetForm').valid()) {
			$('.form-group').removeClass('has-error');
			$('.help-block').remove();

			var regiondtl = {};
			regiondtl.regiondtlid = 0;
			regiondtl.regionid = currentRegionData.regionid;
			regiondtl.mediatype = '7';
			regiondtl.mediaid = 0;
			regiondtl.uri = $('#RegionDtlWidgetForm input[name=uri]').attr("value");
			regiondtl.raw = regiondtl.uri;
			regiondtl.duration = $('#RegionDtlWidgetForm input[name=duration]').attr("value");
			regiondtl.sequence = tempRegionDtlData.length + 1;
			
			tempRegionDtlData[tempRegionDtlData.length] = regiondtl;
			var duration = regiondtl.duration;
			if (duration == 0) {
				duration = '-';
			}
			$('#RegionDtlTable').dataTable().fnAddData([regiondtl.sequence, regiondtl.sequence, 'Widget', regiondtl.uri, duration, regiondtl.regiondtlid]);

			$('#RegionDtlWidgetForm input[name=uri]').attr("value", '');
			$('#RegionDtlWidgetForm input[name=duration]').attr("value", '0');
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

	$('body').on('click', '.pix-updateregiondtl_live', function(event) {
		event.preventDefault();
		var form = $(event.target).parents('form')[0];
		if ($(form).valid()) {
			var nTr = $(event.target).parents('tr')[1];
			var sequence = $(nTr).prev().children('td')[1].innerHTML;
			var uri = $('input[name=uri]', form).val();			
			tempRegionDtlData[sequence-1].uri = uri;
			tempRegionDtlData[sequence-1].raw = uri;
			tempRegionDtlData[sequence-1].fromdate = $('input[name=starttime]', form).val();
			tempRegionDtlData[sequence-1].todate = $('input[name=endtime]', form).val();
			$('#RegionDtlTable').dataTable().fnUpdate(uri, sequence-1, 3);
			
			$('.row-details', $(nTr).prev()).addClass('row-details-close').removeClass('row-details-open');
			regionDtlTable.fnClose($('.row-details', $(nTr).prev()).parents('tr')[0]);

			$('#ScheduleForm input[name="starttime"]').attr("value", $('input[name=starttime]', form).val());
			$('#ScheduleForm input[name="endtime"]').attr("value", $('input[name=endtime]', form).val());
		}
	});

	$('body').on('click', '.pix-updateregiondtl_widget', function(event) {
		event.preventDefault();
		var form = $(event.target).parents('form')[0];
		if ($(form).valid()) {
			var nTr = $(event.target).parents('tr')[1];
			var sequence = $(nTr).prev().children('td')[1].innerHTML;
			var uri = $('input[name=uri]', form).val();			
			tempRegionDtlData[sequence-1].uri = uri;
			tempRegionDtlData[sequence-1].raw = uri;
			tempRegionDtlData[sequence-1].duration = $('input[name=duration]', form).val();
			$('#RegionDtlTable').dataTable().fnUpdate(uri, sequence-1, 3);
			
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

function submitData() {
	for (var i=0; i<currentLayoutData.regions.length; i++) {
		if (('' + currentLayoutData.regions[i].regionid).indexOf('R') == 0) {
			currentLayoutData.regions[i].regionid = '0';
			for (var j=0; j<currentLayoutData.regions[i].regiondtls.length; j++) {
				currentLayoutData.regions[i].regiondtls[j].regionid = '0';
			}
		}
	}

	var schedules = [];
	for (var i=0; i<deviceSelectedList.length; i++) {
		var schedule = {};
		schedule.scheduleid = 0;
		schedule.type = $('#ScheduleForm input[name="task.type"]:checked').val();
		schedule.utype = '1';
		schedule.deviceid = deviceSelectedList[i].deviceid;
		schedule.devicegroupid = 0;
		schedule.layoutid = currentLayoutid;
		if (schedule.type == 1) {
			schedule.fromdate = $('#ScheduleForm input[name=starttime]').val();
			schedule.todate = $('#ScheduleForm input[name=endtime]').val();
		} else if ($('#ScheduleForm input[name=endtime]').attr('value') != '') {
			schedule.todate = $('#ScheduleForm input[name=endtime]').attr('value');
		}
		schedule.priority = 0;
		schedules[schedules.length] = schedule;
	}
	for (var i=0; i<devicegroupSelectedList.length; i++) {
		var schedule = {};
		schedule.scheduleid = 0;
		schedule.type = $('#ScheduleForm input[name="task.type"]:checked').val();
		schedule.utype = '1';
		schedule.deviceid = 0;
		schedule.devicegroupid = devicegroupSelectedList[i].devicegroupid;
		schedule.layoutid = currentLayoutid;
		if (schedule.type == 1) {
			schedule.fromdate = $('#ScheduleForm input[name=starttime]').val();
			schedule.todate = $('#ScheduleForm input[name=endtime]').val();
		} else if ($('#ScheduleForm input[name=endtime]').attr('value') != '') {
			schedule.todate = $('#ScheduleForm input[name=endtime]').attr('value');
		}
		schedule.priority = 0;
		schedules[schedules.length] = schedule;
	}

	var task = {};
	task.taskid = 0;
	task.type = $('#ScheduleForm input[name="task.type"]:checked').val();
	task.name = $('#TaskForm input[name="task.name"]').val();
	if (task.type == 1) {
		task.fromdate = $('#ScheduleForm input[name=starttime]').val();
		task.todate = $('#ScheduleForm input[name=endtime]').val();
	} else if ($('#ScheduleForm input[name=endtime]').attr('value') != '') {
		task.todate = $('#ScheduleForm input[name=endtime]').attr('value');
	}
	task.schedules = schedules;

	$.ajax({
		type : 'POST',
		url : myurls['layout.wizard'],
		data : '{"layout":' + $.toJSON(currentLayoutData) + ', "task":' + $.toJSON(task) + '}',
		dataType : 'json',
		contentType : 'application/json;charset=utf-8',
		beforeSend: function ( xhr ) {
			App.blockUI($('.button-submit'));
		},
		success : function(data, status) {
			App.unblockUI($('.button-submit'));
			if (data.errorcode == 0) {
				//bootbox.alert('操作成功');
				currentTaskid = data.dataid;
				$('#ScheduleTable').dataTable()._fnAjaxUpdate();
				$('#SchedulefileTable').dataTable()._fnAjaxUpdate();
				$('#ScheduleModal').modal();
				
				initData1();
				$('#MyWizard').bootstrapWizard('first');
			} else {
				bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
			}
		},
		error : function() {
			App.unblockUI($('.button-submit'));
			bootbox.alert('出错了!');
		}
	});
	
	event.preventDefault();
}


	var currentTaskid = 0;
	var currentScheduleid = 0;

	$('#ScheduleTable').dataTable({
		"sDom" : "<'row'<'col-md-6 col-sm-12'l>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", 
		"aLengthMenu" : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		"bProcessing" : true,
		"bServerSide" : true,
		"sAjaxSource" : myurls['schedule.listbytask'],
		'aoColumns' : [ {"sTitle" : "终端", "mData" : "device.name", "bSortable" : false }, 
						{"sTitle" : "类型", "mData" : "type", "bSortable" : false }, 
						//{"sTitle" : "起止时间", "mData" : "device.deviceid", "bSortable" : false }, 
						{"sTitle" : "视频总量", "mData" : "device.deviceid", "bSortable" : false }, 
						{"sTitle" : "已下载", "mData" : "device.deviceid", "bSortable" : false }, 
						{"sTitle" : "待下载", "mData" : "device.deviceid", "bSortable" : false }, 
						{"sTitle" : "开始下载时间", "mData" : "device.deviceid", "bSortable" : false }, 
						{"sTitle" : "剩余估算时间", "mData" : "device.deviceid", "bSortable" : false }, 
						{"sTitle" : "同步", "mData" : "syncstatus", "bSortable" : false }, 
						{"sTitle" : "状态", "mData" : "status", "bSortable" : false }],
		"iDisplayLength" : 10,
		"sPaginationType" : "bootstrap",
		"oLanguage" : DataTableLanguage,
		"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
			if (aData['type'] == 1) {
				$('td:eq(1)', nRow).html('<span class="label label-sm label-info">排期计划</span>');
			} else if (aData['type'] == 2) {
				$('td:eq(1)', nRow).html('<span class="label label-sm label-success">即时计划</span>');
			}
			//$('td:eq(2)', nRow).html(aData['fromdate'] + '～' + aData['todate']);
			$('td:eq(2)', nRow).html(transferIntToComma(parseInt(aData['filesize'] / 1024)) + ' KB');
			$('td:eq(3)', nRow).html(transferIntToComma(parseInt(aData['filesizecomplete'] / 1024)) + ' KB');
			var filesizeuncomplete = aData['filesize'] - aData['filesizecomplete'];
			$('td:eq(4)', nRow).html(transferIntToComma(parseInt( filesizeuncomplete / 1024)) + ' KB');
			if (aData['syncstarttime'] == null) {
				$('td:eq(5)', nRow).html('--');
			} else {
				$('td:eq(5)', nRow).html(aData['syncstarttime']);
			}
			if (aData.device.rate > 0) {
				var time = parseInt(filesizeuncomplete / aData.device.rate);
				$('td:eq(6)', nRow).html(''+ transferIntToTime(time));
			} else {
				$('td:eq(6)', nRow).html('--');
			}
			if (aData['syncstatus'] == 0) {
				$('td:eq(7)', nRow).html('<span class="label label-sm label-warning">待同步</span>');
			} else if (aData['syncstatus'] == 1) {
				$('td:eq(7)', nRow).html('<span class="label label-sm label-info">同步中</span>');
			} else if (aData['syncstatus'] == 2) {
				$('td:eq(7)', nRow).html('<span class="label label-sm label-success">已同步</span>');
			}
			if (aData['status'] == 0) {
				$('td:eq(8)', nRow).html('<span class="label label-sm label-default">失效</span>');
			} else if (aData['status'] == 1) {
				$('td:eq(8)', nRow).html('<span class="label label-sm label-success">有效</span>');
			}

			return nRow;
		},
		'fnServerParams': function(aoData) { 
	        aoData.push({'name':'taskid','value':currentTaskid });
	    }, 
	    'fnServerData': function ( sSource, aoData, fnCallback, oSettings ) {
	    	$.getJSON( sSource, aoData, function (json) {
	    		fnCallback(json);
	    		$('#ScheduleTable tbody tr:first').trigger('click');
	    	});
	    }
	});

    $('#ScheduleTable').on( 'click', 'tbody tr', function () {
        if (!$(this).hasClass('active')) {
        	$('#ScheduleTable tr.active').removeClass('active');
            $(this).addClass('active');
        }
        if ($('#ScheduleTable').dataTable().fnGetData(this) != null) {
            currentScheduleid = $('#ScheduleTable').dataTable().fnGetData(this)['scheduleid'];
            $('#SchedulefileTable').dataTable()._fnAjaxUpdate();
        }
    });
	
	$('#SchedulefileTable').dataTable({
		"sDom" : "<'row'<'col-md-6 col-sm-12'l>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", 
		"aLengthMenu" : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		"bProcessing" : true,
		"bServerSide" : true,
		"sAjaxSource" : myurls['schedulefile.list'],
		'aoColumns' : [ {"sTitle" : "类型", "mData" : "filetype", "bSortable" : false }, 
						{"sTitle" : "编号", "mData" : "fileid", "bSortable" : false }, 
						{"sTitle" : "文件名", "mData" : "filename", "bSortable" : false }, 
						{"sTitle" : "大小", "mData" : "filesize", "bSortable" : false }, 
						{"sTitle" : "进度", "mData" : "complete", "bSortable" : false }],
		"iDisplayLength" : 10,
		"sPaginationType" : "bootstrap",
		"oLanguage" : DataTableLanguage,
		"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
			if (aData['filetype'] == 0) {
				$('td:eq(0)', nRow).html('布局');
			} else if (aData['filetype'] == 1) {
				$('td:eq(0)', nRow).html('图片');
			} else if (aData['filetype'] == 2) {
				$('td:eq(0)', nRow).html('视频');
			} else if (aData['filetype'] == 3) {
				$('td:eq(0)', nRow).html('影片');
			} else if (aData['filetype'] == 4) {
				$('td:eq(0)', nRow).html('广告');
			}

			$('td:eq(3)', nRow).html(transferIntToComma(aData['filesize']));
			
			if (aData['complete'] == 0) {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-danger">' + aData['complete'] + '%</span>');
			} else if (aData['complete'] == 100) {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-success">' + aData['complete'] + '%</span>');
			} else {
				$('td:eq(4)', nRow).html('<span class="label label-sm label-warning">' + aData['complete'] + '%</span>');
			}
			return nRow;
		},
		'fnServerParams': function(aoData) { 
	        aoData.push({'name':'scheduleid','value':currentScheduleid });
	    } 
	});
