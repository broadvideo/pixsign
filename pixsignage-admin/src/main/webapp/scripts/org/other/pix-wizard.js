var myurls = {
	'templet.list' : 'templet!list.action',
	'image.list' : 'image!list.action',
	'device.list' : 'device!list.action',
	'devicegroup.list' : 'devicegroup!list.action',
	
	'bundle.wizard' : 'bundle!wizard.action',
	'schedulefile.list' : 'schedulefile!list.action',
};

var submitflag = false;

var CurrentBundleid = 0;
var CurrentBundle;
var CurrentBundledtl;
var CurrentSubBundles;

var CurrentTaskid;
var SelectedDeviceList = [];
var SelectedDevicegroupList = [];
var CurrentDeviceBranchid;

var CurrentMediaBranchid;
var CurrentMediaFolderid;

$(window).resize(function(e) {
	if (CurrentBundle != null && e.target == this) {
		var width = Math.floor($('#LayoutDiv').parent().width());
		var scale = CurrentBundle.width / width;
		var height = CurrentBundle.height / scale;
		$('#LayoutDiv').css('width', width);
		$('#LayoutDiv').css('height', height);

		var width = Math.floor($('#BundleDiv').parent().width());
		var scale = CurrentBundle.width / width;
		var height = CurrentBundle.height / scale;
		$('#BundleDiv').css('width', width);
		$('#BundleDiv').css('height', height);
	}
});

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
		$('.step-title', $('#MyWizard')).text('Step ' + (index + 1) + ' of ' + total);
		jQuery('li', $('#MyWizard')).removeClass('done');
		var li_list = navigation.find('li');
		for (var i = 0; i < index; i++) {
			jQuery(li_list[i]).addClass('done');
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
		Metronic.scrollTo($('.page-title'));
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
				if ($('#TempletOptionForm').valid()) {
					initData2();
				} else {
					return false;
				}
			} else if (index == 1 && clickedIndex == 2) {
				if (validBundleOption(CurrentBundle)) {
					initData3();
				} else {
					return false;
				}
			} else if (index == 2 && clickedIndex == 3) {
				if (CurrentBundledtl != null && validLayoutdtl(CurrentBundledtl)) {
					initData4();
				} else {
					return false;
				}
			} else if (index == 3 && clickedIndex == 4) {
				if (CurrentBundledtl != null && validBundledtl(CurrentBundledtl)) {
					initData5();
				} else {
					return false;
				}
			} else if (index == 4 && clickedIndex == 5) {
				if (SelectedDeviceList.length == 0 && SelectedDevicegroupList.length == 0) {
					bootbox.alert(common.tips.device_missed);
					return false;
				} else {
					initData6();
				}
			}
		},
		onNext: function (tab, navigation, index) {
			if (index == 1) {
				if ($('#TempletOptionForm').valid()) {
					initData2();
				} else {
					return false;
				}
			} else if (index == 2) {
				if (validBundleOption(CurrentBundle)) {
					initData3();
				} else {
					return false;
				}
			} else if (index == 3) {
				if (CurrentBundledtl != null && validLayoutdtl(CurrentBundledtl)) {
					initData4();
				} else {
					return false;
				}
			} else if (index == 4) {
				if (CurrentBundledtl != null && validBundledtl(CurrentBundledtl)) {
					initData5();
				} else {
					return false;
				}
			} else if (index == 5) {
				if (SelectedDeviceList.length == 0 && SelectedDevicegroupList.length == 0) {
					bootbox.alert(common.tips.device_missed);
					return false;
				} else {
					initData6();
				}
			}
		},
		onPrevious: function (tab, navigation, index) {
		},
		onTabShow: function (tab, navigation, index) {
			var total = navigation.find('li').length;
			var current = index + 1;
			var $percent = (current / total) * 100;
			$('#MyWizard').find('.progress-bar').css({
				width: $percent + '%'
			});
			handleTitle(tab, navigation, index);
			
			if (index == 2) {
				redrawLayout($('#LayoutDiv'), CurrentBundle, CurrentBundledtl);
				enterLayoutdtlFocus(CurrentBundledtl);
			} else if (index == 3) {
				enterBundledtlFocus(CurrentBundledtl);
				$('#VideoTable').dataTable()._fnAjaxUpdate();
			}
		}
	});

	$('#MyWizard').find('.button-previous').hide();
	$('#MyWizard .button-submit').click(function () {
		submitData();
	}).hide();
	
}

function initTab1() {
	$('#TempletTable thead').css('display', 'none');
	$('#TempletTable tbody').css('display', 'none');
	var templethtml = '';
	$('#TempletTable').dataTable({
		'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 12, 30, 48, 96 ],
						  [ 12, 30, 48, 96 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : 'templet!list.action',
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }],
		'iDisplayLength' : 12,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : PixData.tableLanguage,
		'fnPreDrawCallback': function (oSettings) {
			if ($('#TempletContainer').length < 1) {
				$('#TempletTable').append('<div id="TempletContainer"></div>');
			}
			$('#TempletContainer').html(''); 
			return true;
		},
		'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			if (iDisplayIndex % 4 == 0) {
				templethtml = '';
				templethtml += '<div class="row" >';
			}
			templethtml += '<div class="col-md-3 col-xs-3">';
			templethtml += '<a href="javascript:;" templetid="' + aData.templetid + '" class="fancybox">';
			templethtml += '<div class="thumbs">';
			if (aData.snapshot != null) {
				var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
				templethtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
			}
			templethtml += '</div></a>';
			templethtml += '<label class="radio-inline">';
			if (iDisplayIndex == 0) {
				templethtml += '<input type="radio" name="bundle.templetid" value="' + aData.templetid + '" checked>';
			} else {
				templethtml += '<input type="radio" name="bundle.templetid" value="' + aData.templetid + '">';
			}
			templethtml += aData.name + '</label>';

			templethtml += '</div>';
			if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#TempletTable').dataTable().fnGetData().length) {
				templethtml += '</div>';
				if ((iDisplayIndex+1) != $('#TempletTable').dataTable().fnGetData().length) {
					templethtml += '<hr/>';
				}
				$('#TempletContainer').append(templethtml);
			}
			return nRow;
		},
		'fnDrawCallback': function(oSettings, json) {
			$('#TempletContainer .thumbs').each(function(i) {
				$(this).width($(this).parent().closest('div').width());
				$(this).height($(this).parent().closest('div').width());
			});
			$('.fancybox').each(function(index,item) {
				$(this).click(function() {
					var templetid = $(this).attr('templetid');
					$.ajax({
						type : 'GET',
						url : 'templet!get.action',
						data : {templetid: templetid},
						success : function(data, status) {
							if (data.errorcode == 0) {
								$.fancybox({
									openEffect	: 'none',
									closeEffect	: 'none',
									closeBtn : false,
							        padding : 0,
							        content: '<div id="TempletPreview"></div>',
							    });
								redrawTempletPreview($('#TempletPreview'), data.templet, 800, 1);
							} else {
								bootbox.alert(common.tips.error + data.errormsg);
							}
						},
						error : function() {
							console.log('failue');
						}
					});
				    return false;
				})
			});
		},
		'fnServerParams': function(aoData) {
			var templetflag = $('#TempletOptionForm input[name="templetflag"]:checked').val();
			var ratio = $('select[name="bundle.ratio"]').val();
			aoData.push({'name':'templetflag','value':templetflag });
			aoData.push({'name':'touchflag','value':'0' });
			aoData.push({'name':'ratio','value':ratio });
		}
	});
	jQuery('#TempletTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	jQuery('#TempletTable_wrapper .dataTables_length select').addClass('form-control input-small');
	jQuery('#TempletTable_wrapper .dataTables_length select').select2();

	$('#TempletOptionForm input[name="templetflag"]').change(function(e) {
		refreshTemplet();
	});

	$('#TempletOptionForm select[name="bundle.ratio"]').on('change', function(e) {
		refreshTemplet();
	});	
}

function refreshTemplet() {
	$('#TempletOptionForm input[name="bundle.templetid"]').val('0');
	var templetflag = $('#TempletOptionForm input[name="templetflag"]:checked').val();
	if (templetflag == 0) {
		$('.templet-ctrl').css('display', 'none');
	} else {
		$('.templet-ctrl').css('display', '');
		$('#TempletTable').dataTable().fnDraw(true);
	}
}

function initData1() {
	refreshTemplet();
	/*
    FormValidateOption.rules = {};
	FormValidateOption.rules['bundle.name'] = {};
	FormValidateOption.rules['bundle.name']['required'] = true;
	$('#BundleOptionForm').validate(FormValidateOption);
    $.extend($("#BundleOptionForm").validate().settings, {
		rules: FormValidateOption.rules
	});

	var d = new Date().format('yyyyMMdd-hhmmss');
	$('input[name="bundle.name"]').val(myUser + '-' + d);
	*/
}

function initTab2() {
	
}

function initData2() {
	var ratio = $('select[name="bundle.ratio"]').val();
	var templetflag = $('#TempletOptionForm input[name="templetflag"]:checked').val();
	var templetid;
	if (templetflag == 0) {
		CurrentBundle = {};
		CurrentBundle.bundleid = 0;
		CurrentBundle.homebundleid = 0;
		CurrentBundle.templetid = 0;
		CurrentBundle.touchflag = 0;
		CurrentBundle.homeflag = 1;
		CurrentBundle.status = 1;
		CurrentBundle.bundledtls = [];
		if (ratio == 1) {
			// 16:9
			CurrentBundle.width = 1920;
			CurrentBundle.height = 1080;
		} else if (ratio == 2) {
			// 9:16
			CurrentBundle.width = 1080;
			CurrentBundle.height = 1920;
		} else if (ratio == 3) {
			// 4:3
			CurrentBundle.width = 1920;
			CurrentBundle.height = 1440;
		} else if (ratio == 4) {
			// 3:4
			CurrentBundle.width = 1440;
			CurrentBundle.height = 1920;
		}
		CurrentBundledtl = {};
		CurrentBundledtl.bundleid = 0;
		CurrentBundledtl.bundledtlid = '-' + Math.round(Math.random()*100000000);
		CurrentBundledtl.type = 0;
		CurrentBundledtl.mainflag = 1;
		CurrentBundledtl.homeflag = 1;
		CurrentBundledtl.homebundleid = 0;
		CurrentBundledtl.width = CurrentBundle.width / 2;
		CurrentBundledtl.height = CurrentBundle.height / 2;
		CurrentBundledtl.topoffset = CurrentBundle.height / 4;
		CurrentBundledtl.leftoffset = CurrentBundle.width / 4;
		CurrentBundledtl.bgimageid = 0;
		CurrentBundledtl.bgcolor = '#000000';
		CurrentBundledtl.opacity = 255;
		CurrentBundledtl.zindex = 0;
		CurrentBundledtl.sleeptime = 0;
		CurrentBundledtl.intervaltime =10;
		CurrentBundledtl.animation = 'None';
		CurrentBundledtl.fitflag = 1;
		CurrentBundledtl.volume = 50;
		CurrentBundledtl.direction = 4;
		CurrentBundledtl.speed = 2;
		CurrentBundledtl.color = '#FFFFFF';
		CurrentBundledtl.size = 50;
		CurrentBundledtl.dateformat = 'yyyy-MM-dd HH:mm';
		CurrentBundledtl.referflag = 0;
		CurrentBundledtl.objtype = 1;
		CurrentBundledtl.objid = 0;
		CurrentBundledtl.medialist = {};
		CurrentBundledtl.medialist.medialistid = 0;
		CurrentBundledtl.medialist.medialistdtls = [];
		CurrentBundledtl.medialist.name = '';
		CurrentBundledtl.medialist0 = CurrentBundledtl.medialist;
		CurrentBundledtl.widget = {};
		CurrentBundledtl.widget.widgetid = 0;
		CurrentBundledtl.widget.name = '';
		CurrentBundledtl.widget.url = '';
		CurrentBundledtl.widget0 = CurrentBundledtl.widget;
		
		CurrentBundle.bundledtls.push(CurrentBundledtl);
		$('#BundleOptionForm').loadJSON(CurrentBundle);
		refreshLayoutBgImageSelect2();
	} else {
		templetid = $('#TempletOptionForm input[name="bundle.templetid"]:checked').val();
		$.ajax({
			type : 'GET',
			url : 'templet!get.action',
			data : {templetid: templetid},
			success : function(data, status) {
				if (data.errorcode == 0) {
					CurrentBundle = data.templet;
					CurrentBundle.bundledtls = data.templet.templetdtls;
					CurrentBundledtl = CurrentBundle.bundledtls[0];
					CurrentBundle.bundleid = 0;
					for (var i=0; i<CurrentBundle.bundledtls.length; i++) {
						var bundledtl = CurrentBundle.bundledtls[i];
						bundledtl.referflag = 0;
						bundledtl.bundleid = 0;
						bundledtl.bundledtlid = '-' + Math.round(Math.random()*100000000);
						bundledtl.medialist0 = {};
						bundledtl.medialist0.medialistid = 0;
						bundledtl.medialist0.medialistdtls = [];
						bundledtl.medialist0.type = 0;
						bundledtl.text0 = {};
						bundledtl.text0.textid = 0;
						bundledtl.text0.type = 0;
						bundledtl.stream0 = {};
						bundledtl.stream0.streamid = 0;
						bundledtl.stream0.type = 0;
						bundledtl.widget0 = {};
						bundledtl.widget0.widgetid = 0;
						bundledtl.widget0.type = 0;
						bundledtl.rss0 = {};
						bundledtl.rss0.rssid = 0;
						bundledtl.rss0.type = 0;
						if (bundledtl.objtype == 1 && bundledtl.medialist != null) {
							bundledtl.medialist.medialistid = 0;
							bundledtl.medialist0 = bundledtl.medialist;
						}
						if (bundledtl.objtype == 2 &&  bundledtl.text != null) {
							bundledtl.text.textid = 0;
							bundledtl.text0 = bundledtl.text;
						}
						if (bundledtl.objtype == 3 &&  bundledtl.stream != null) {
							bundledtl.stream.streamid = 0;
							bundledtl.stream0 = bundledtl.stream;
						}
						if (bundledtl.objtype == 5 &&  bundledtl.widget != null) {
							bundledtl.widget.widgetid = 0;
							bundledtl.widget0 = bundledtl.widget;
						}
						if (bundledtl.objtype == 7 &&  bundledtl.rss != null) {
							bundledtl.rss.rssid = 0;
							bundledtl.rss0 = bundledtl.rss;
						}
						$('#BundleOptionForm').loadJSON(CurrentBundle);
						refreshLayoutBgImageSelect2();
					}
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	}
}

function initTab3() {
	
}

function initData3() {
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	if (CurrentBundle.width > CurrentBundle.height) {
		$('#LayoutCol1').attr('class', 'col-md-7 col-sm-7');
		$('#LayoutCol2').attr('class', 'col-md-5 col-sm-5');
	} else {
		$('#LayoutCol1').attr('class', 'col-md-5 col-sm-5');
		$('#LayoutCol2').attr('class', 'col-md-7 col-sm-7');
	}
	$('.touch-ctrl').css('display', TouchCtrl?'':'none');
	$('.calendar-ctrl').css('display', SchoolCtrl?'':'none');
	$('.lift-ctrl').css('display', LiftCtrl?'':'none');
	$('.stream-ctrl').css('display', StreamCtrl?'':'none');
	$('.dvb-ctrl').css('display', DvbCtrl?'':'none');
	$('.videoin-ctrl').css('display', VideoinCtrl?'':'none');
	updateRegionBtns();
}

function initTab4() {
}

function initData4() {
	CurrentBundledtl = CurrentBundle.bundledtls[0];

	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	if (CurrentBundle.width > CurrentBundle.height) {
		$('#BundleCol1').attr('class', 'col-md-3 col-sm-3');
		$('#BundleCol2').attr('class', 'col-md-9 col-sm-9');
	} else {
		$('#BundleCol1').attr('class', 'col-md-2 col-sm-2');
		$('#BundleCol2').attr('class', 'col-md-10 col-sm-10');
	}
}


function initTab5() {
	//编制计划对话框中的设备table初始化
	var DeviceTree = new BranchTree($('#DeviceTab'));
	$('#DeviceTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 20, 40, 60, 100 ],
						[ 20, 40, 60, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['device.list'],
		'aoColumns' : [ {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
						{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : common.view.branch, 'mData' : 'branchid', 'bSortable' : false }, 
						{'sTitle' : common.view.operation, 'mData' : 'deviceid', 'bSortable' : false }],
		'iDisplayLength' : 20,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(2)', nRow).html(aData.branch.name);
			$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-adddevice">' + common.view.add + '</button>');
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':DeviceTree.branchid });
			aoData.push({'name':'devicegroupid','value':'0' });
		}
	});
	jQuery('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	jQuery('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
	
	//编制计划对话框中的设备组table初始化
	var DevicegroupTree = new BranchTree($('#DevicegroupTab'));
	$('#DevicegroupTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 20, 40, 60, 100 ],
						[ 20, 40, 60, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['devicegroup.list'],
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : common.view.operation, 'mData' : 'devicegroupid', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(1)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-adddevicegroup">' + common.view.add + '</button>');
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'branchid','value':DevicegroupTree.branchid });
			aoData.push({'name':'type','value':'1' });
		}
	});
	jQuery('#DevicegroupTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	jQuery('#DevicegroupTable_wrapper .dataTables_length select').addClass('form-control input-small');
	
	$('#nav_dtab1').click(function(event) {
		$('#DeviceTable').dataTable()._fnAjaxUpdate();
	});
	$('#nav_dtab2').click(function(event) {
		$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
	});

	//编制计划对话框中的右侧设备选择列表初始化
	$('#SelectedDeviceTable').dataTable({
		'sDom' : 't',
		'iDisplayLength' : -1,
		'aoColumns' : [ {'sTitle' : '#', 'bSortable' : false }, 
						{'sTitle' : common.view.name, 'bSortable' : false }, 
						{'sTitle' : common.view.operation, 'bSortable' : false }],
		'oLanguage' : { 'sZeroRecords' : common.view.empty,
						'sEmptyTable' : common.view.empty }, 
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(2)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-deletedevice">' + common.view.remove + '</button>');
			return nRow;
		}
	});
	
	//编制计划对话框中的右侧设备组选择列表初始化
	$('#SelectedDevicegroupTable').dataTable({
		'sDom' : 't',
		'iDisplayLength' : -1,
		'aoColumns' : [ {'sTitle' : '#', 'bSortable' : false }, 
						{'sTitle' : common.view.name, 'bSortable' : false }, 
						{'sTitle' : common.view.operation, 'bSortable' : false }],
		'oLanguage' : { 'sZeroRecords' : common.view.empty,
						'sEmptyTable' : common.view.empty }, 
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(2)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-deletedevicegroup">' + common.view.remove + '</button>');
			return nRow;
		}
	});

	//编制计划对话框中，增加终端到终端列表
	$('body').on('click', '.pix-adddevice', function(event) {
		var data = $('#DeviceTable').dataTable().fnGetData($(event.target).attr('data-id'));
		
		var d = SelectedDeviceList.filter(function (el) {
			return el.deviceid == data.deviceid;
		});	
		if (d.length == 0) {
			var device = {};
			device.deviceid = data.deviceid;
			device.name = data.name;
			device.rate = data.rate;
			device.sequence = SelectedDeviceList.length + 1;
			
			SelectedDeviceList[SelectedDeviceList.length] = device;
			$('#SelectedDeviceTable').dataTable().fnAddData([device.sequence, device.name, device.deviceid]);
		}
	});

	//编制计划对话框中，增加终端组到终端组列表
	$('body').on('click', '.pix-adddevicegroup', function(event) {
		var data = $('#DevicegroupTable').dataTable().fnGetData($(event.target).attr('data-id'));
		
		var d = SelectedDevicegroupList.filter(function (el) {
			return el.devicegroupid == data.devicegroupid;
		});	
		if (d.length == 0) {
			var devicegroup = {};
			devicegroup.devicegroupid = data.devicegroupid;
			devicegroup.name = data.name;
			devicegroup.sequence = SelectedDevicegroupList.length + 1;
			
			SelectedDevicegroupList[SelectedDevicegroupList.length] = devicegroup;
			$('#SelectedDevicegroupTable').dataTable().fnAddData([devicegroup.sequence, devicegroup.name, devicegroup.devicegroupid]);
		}
	});

	//编制计划对话框中，删除设备列表某行
	$('body').on('click', '.pix-deletedevice', function(event) {
		var rowIndex = $(event.target).attr('data-id');
		for (var i=rowIndex; i<$('#SelectedDeviceTable').dataTable().fnSettings().fnRecordsDisplay(); i++) {
			var data = $('#SelectedDeviceTable').dataTable().fnGetData(i);
			$('#SelectedDeviceTable').dataTable().fnUpdate(i, parseInt(i), 0);
		}
		$('#SelectedDeviceTable').dataTable().fnDeleteRow(rowIndex);
		
		for (var i=rowIndex; i<SelectedDeviceList.length; i++) {
			SelectedDeviceList[i].sequence = i;
		}
		SelectedDeviceList.splice(rowIndex, 1);
	});
	
	//编制计划对话框中，删除设备组列表某行
	$('body').on('click', '.pix-deletedevicegroup', function(event) {
		var rowIndex = $(event.target).attr('data-id');
		for (var i=rowIndex; i<$('#SelectedDevicegroupTable').dataTable().fnSettings().fnRecordsDisplay(); i++) {
			var data = $('#SelectedDevicegroupTable').dataTable().fnGetData(i);
			$('#SelectedDevicegroupTable').dataTable().fnUpdate(i, parseInt(i), 0);
		}
		$('#SelectedDevicegroupTable').dataTable().fnDeleteRow(rowIndex);
		
		for (var i=rowIndex; i<SelectedDevicegroupList.length; i++) {
			SelectedDevicegroupList[i].sequence = i;
		}
		SelectedDevicegroupList.splice(rowIndex, 1);
	});
}

function initData5() {
	$('#SelectedDeviceTable').dataTable().fnClearTable();
	$('#SelectedDevicegroupTable').dataTable().fnClearTable();
	SelectedDeviceList = [];
	SelectedDevicegroupList = [];
}


function initTab6() {
	
}

function initData6() {
	var deviceRowspan = SelectedDeviceList.length>1 ? SelectedDeviceList.length : 1;
	var devicegroupRowspan = SelectedDevicegroupList.length>1 ? SelectedDevicegroupList.length : 1;
	//var currentMediaSum = 0;
	//var filesize = parseInt(currentMediaSum / 1024);
	var html = '';
	html += '<tr>';
	html += '<td>' + common.view.bundle + '</td><td>' + CurrentBundle.name + '</td>';
	html += '</tr>';
	//html += '<tr>';
	//html += '<td>视频总量</td><td>' + transferIntToComma(filesize) + ' KB</td>';
	//html += '</tr>';
	html += '<tr>';
	html += '<td rowspan="'+ deviceRowspan + '">' + common.view.device + '</td>';
	html += '<td>' + (SelectedDeviceList.length>0? SelectedDeviceList[0].name : '') + '</td>';
	html += '</tr>';
	for (var i=1; i<SelectedDeviceList.length; i++) {
		html += '<tr>';
		html += '<td>' + SelectedDeviceList[i].name + '</td>';
		html += '</tr>';
	}
	html += '<tr>';
	html += '<td rowspan="'+ devicegroupRowspan + '">' + common.view.devicegroup + '</td>';
	html += '<td>' + (SelectedDevicegroupList.length>0? SelectedDevicegroupList[0].name : '') + '</td>';
	html += '</tr>';
	for (var i=1; i<SelectedDevicegroupList.length; i++) {
		html += '<tr>';
		html += '<td>' + SelectedDevicegroupList[i].name + '</td>';
		html += '</tr>';
	}

	$('#ConfirmTable').empty();
	$('#ConfirmTable').append(html);
}

function submitData() {
	if (submitflag) {
		return;
	}
	submitflag = true;
	Metronic.blockUI({
		zIndex: 20000,
		animate: true
	});
	$('#snapshot_div').show();
	redrawBundlePreview($('#snapshot_div'), CurrentBundle, 512, 0);
	html2canvas($('#snapshot_div'), {
		onrendered: function(canvas) {
			//console.log(canvas.toDataURL());
			CurrentBundle.snapshotdtl = canvas.toDataURL();
			$('#snapshot_div').hide();

			for (var i=0; i<CurrentBundle.bundledtls.length; i++) {
				var bundledtl = CurrentBundle.bundledtls[i];
				bundledtl.medialist0 = undefined;
				bundledtl.text0 = undefined;
				bundledtl.widget0 = undefined;
				bundledtl.stream0 = undefined;
				bundledtl.rss0 = undefined;
				if (bundledtl.medialist != undefined) {
					for (var j=0; j<bundledtl.medialist.medialistdtls.length; j++) {
						var medialistdtl = bundledtl.medialist.medialistdtls[j];
						medialistdtl.image = undefined;
						medialistdtl.video = undefined;
						medialistdtl.stream = undefined;
						medialistdtl.audio = undefined;
					}
				} 
			}
			
			$.ajax({
				type : 'POST',
				url : myurls['bundle.wizard'],
				data : '{"bundle":' + $.toJSON(CurrentBundle) + ', "devices":' + $.toJSON(SelectedDeviceList) + ', "devicegroups":' + $.toJSON(SelectedDevicegroupList) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					Metronic.unblockUI();
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
						//CurrentTaskid = data.dataid;
						//$('#ScheduleTable').dataTable()._fnAjaxUpdate();
						//$('#SchedulefileTable').dataTable()._fnAjaxUpdate();
						//$('#ScheduleModal').modal();
						initData1();
						$('#MyWizard').bootstrapWizard('first');
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
						initData1();
						$('#MyWizard').bootstrapWizard('first');
					}
				},
				error : function() {
					Metronic.unblockUI();
					console.log('failue');
				}
			});
		}
	});
}


	var currentTaskid = 0;
	var currentScheduleid = 0;

	$('#ScheduleTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['device.listbytask'],
		'aoColumns' : [ {'sTitle' : '终端', 'mData' : 'device.name', 'bSortable' : false }, 
						{'sTitle' : '类型', 'mData' : 'type', 'bSortable' : false }, 
						//{'sTitle' : '起止时间', 'mData' : 'device.deviceid', 'bSortable' : false }, 
						{'sTitle' : '视频总量', 'mData' : 'device.deviceid', 'bSortable' : false }, 
						{'sTitle' : '已下载', 'mData' : 'device.deviceid', 'bSortable' : false }, 
						{'sTitle' : '待下载', 'mData' : 'device.deviceid', 'bSortable' : false }, 
						{'sTitle' : '开始下载时间', 'mData' : 'device.deviceid', 'bSortable' : false }, 
						{'sTitle' : '剩余估算时间', 'mData' : 'device.deviceid', 'bSortable' : false }, 
						{'sTitle' : '同步', 'mData' : 'syncstatus', 'bSortable' : false }, 
						{'sTitle' : '状态', 'mData' : 'status', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
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
		'sDom' : '<"row"<"col-md-6 col-sm-12"l>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['schedulefile.list'],
		'aoColumns' : [ {'sTitle' : '类型', 'mData' : 'filetype', 'bSortable' : false }, 
						{'sTitle' : '编号', 'mData' : 'fileid', 'bSortable' : false }, 
						{'sTitle' : '文件名', 'mData' : 'filename', 'bSortable' : false }, 
						{'sTitle' : '大小', 'mData' : 'filesize', 'bSortable' : false }, 
						{'sTitle' : '进度', 'mData' : 'complete', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
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
