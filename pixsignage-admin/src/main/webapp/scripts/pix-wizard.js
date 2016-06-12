var myurls = {
	'image.list' : 'image!list.action',
	'device.list' : 'device!list.action',
	'devicegroup.list' : 'devicegroup!list.action',
	
	'bundle.wizard' : 'bundle!wizard.action',
	'schedulefile.list' : 'schedulefile!list.action',
};

var Layouts;
var CurrentTaskid;
var SelectedDeviceList = [];
var SelectedDevicegroupList = [];

$(window).resize(function(e) {
	if (e.target == this) {
		var width1 = Math.floor($("#LayoutDiv").parent().width());
		var width2 = Math.floor($("#BundleDiv").parent().width());
		var width = width1;
		if (width < width2) {
			width = width2;
		}
		if (CurrentLayout != null) {
			var scale = CurrentLayout.width / width;
			var height = CurrentLayout.height / scale;
			$("#LayoutDiv").css("width" , width);
			$("#LayoutDiv").css("height" , height);
			$("#BundleDiv").css("width" , width);
			$("#BundleDiv").css("height" , height);
		}
	}
});

function initWizard() {
	initTab1();
	initTab2();
	initTab3();
	initTab4();
	initTab5();
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
				if ($('#BundleOptionForm').valid()) {
					initData2();
				} else {
					return false;
				}
			} else if (index == 1 && clickedIndex == 2) {
				if (CurrentLayoutdtl == null && validLayout(CurrentLayout) || CurrentLayoutdtl != null && validLayoutdtl(CurrentLayoutdtl)) {
					initData3();
				} else {
					return false;
				}
			} else if (index == 2 && clickedIndex == 3) {
				if (CurrentBundledtl != null && validBundledtl(CurrentBundledtl)) {
					initData4();
				} else {
					return false;
				}
			} else if (index == 3 && clickedIndex == 4) {
				if (SelectedDeviceList.length == 0 && SelectedDevicegroupList.length == 0) {
					bootbox.alert(common.tips.device_missed);
					return false;
				} else {
					initData5();
				}
			}
		},
		onNext: function (tab, navigation, index) {
			if (index == 1) {
				if ($('#BundleOptionForm').valid()) {
					initData2();
				} else {
					return false;
				}
			} else if (index == 2) {
				if (CurrentLayoutdtl == null && validLayout(CurrentLayout) || CurrentLayoutdtl != null && validLayoutdtl(CurrentLayoutdtl)) {
					initData3();
				} else {
					return false;
				}
			} else if (index == 3) {
				if (CurrentBundledtl != null && validBundledtl(CurrentBundledtl)) {
					initData4();
				} else {
					return false;
				}
			} else if (index == 4) {
				if (SelectedDeviceList.length == 0 && SelectedDevicegroupList.length == 0) {
					bootbox.alert(common.tips.device_missed);
					return false;
				} else {
					initData5();
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
			
			if (index == 1) {
				redrawLayout($('#LayoutDiv'), CurrentLayout, CurrentLayoutdtl);
			} else if (index == 2) {
				enterBundledtlFocus(CurrentBundledtl);
				$('#IntVideoTable').dataTable()._fnAjaxUpdate();
			}
		}
	});

	$('#MyWizard').find('.button-previous').hide();
	$('#MyWizard .button-submit').click(function () {
		submitData();
	}).hide();
	
}

function initTab1() {
    $.ajax({
		type : 'POST',
		url : 'layout!publiclist.action',
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				Layouts = data.aaData;
				var layoutTableHtml = '';
				layoutTableHtml += '<tr>';
				for (var i=0; i<Layouts.length; i++) {
					layoutTableHtml += '<td style="padding: 0px 20px 0px 0px;"><div id="LayoutDiv-' + Layouts[i].layoutid + '"></div></td>';
				}
				layoutTableHtml += '</tr>';
				layoutTableHtml += '<tr>';
				for (var i=0; i<Layouts.length; i++) {
					layoutTableHtml += '<td>';
					layoutTableHtml += '<label class="radio-inline">';
					if (i == 0) {
						layoutTableHtml += '<input type="radio" name="layoutid" value="' + Layouts[i].layoutid + '" checked>';
					} else {
						layoutTableHtml += '<input type="radio" name="layoutid" value="' +Layouts[i].layoutid + '">';
					}
					layoutTableHtml += Layouts[i].name + '</label>';
					layoutTableHtml += '</td>';
				}
				layoutTableHtml += '</tr>';
				$('#LayoutTable').html(layoutTableHtml);
				for (var i=0; i<Layouts.length; i++) {
					var layout = Layouts[i];
					redrawLayoutPreview($('#LayoutDiv-' + layout.layoutid), layout, 200);
				}
			} else {
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
		}
	});
}

function initData1() {
    FormValidateOption.rules = {};
	FormValidateOption.rules['bundle.name'] = {};
	FormValidateOption.rules['bundle.name']['required'] = true;
	$('#BundleOptionForm').validate(FormValidateOption);
    $.extend($("#BundleOptionForm").validate().settings, {
		rules: FormValidateOption.rules
	});

	var d = new Date().format('yyyyMMdd-hhmmss');
	$('input[name="bundle.name"]').val(myUser + '-' + d);
}

function initTab2() {
	
}

function initData2() {
	var results = Layouts.filter(function (el) {
		return el.layoutid == $('input[name="layoutid"]:checked').val();
	});
	CurrentLayout = results[0];

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
							image:item, 
						};
					}),
					more: more
				};
			}
		},
		formatResult: function (data) {
			var width = 40;
			var height = 40 * data.image.height / data.image.width;
			if (data.image.width < data.image.height) {
				height = 40;
				width = 40 * data.image.width / data.image.height;
			}
			var html = '<span><img src="/pixsigdata' + data.image.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.image.name + '</span>'
			return html;
		},
		formatSelection: function (data) {
			var width = 30;
			var height = 30 * height / width;
			if (data.image.width < data.image.height) {
				height = 30;
				width = 30 * width / height;
			}
			var html = '<span><img src="/pixsigdata' + data.image.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.image.name + '</span>'
			return html;
		},
		initSelection: function(element, callback) {
			if (CurrentLayout != null && CurrentLayout.bgimage != null) {
				callback({id: CurrentLayout.bgimage.imageid, text: CurrentLayout.bgimage.name, image: CurrentLayout.bgimage });
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
		$('#LayoutCol1').attr('class', 'col-md-7 col-sm-7');
		$('#LayoutCol2').attr('class', 'col-md-5 col-sm-5');
	} else {
		$('#LayoutCol1').attr('class', 'col-md-5 col-sm-5');
		$('#LayoutCol2').attr('class', 'col-md-7 col-sm-7');
	}
	
	if (myBranchid == CurrentLayout.branchid) {
		$('#LayoutCol1').parent().unblock({
            onUnblock: function() {
            	$('#LayoutCol1').parent().css('position', '');
            	$('#LayoutCol1').parent().css('zoom', '');
            }
        });
	} else {
		$('#LayoutCol1').parent().block({
	        message: '',
	        baseZ: 1000,
	        centerY: false,
	        css: {
	            top: '10%',
	            border: '0',
	            padding: '0',
	            backgroundColor: 'none'
	        },
	        overlayCSS: {
	            backgroundColor: 'none',
	            opacity: 0,
	            cursor: 'not-allowed'
	        }
	    });
	}
}

function initTab3() {
}

function initData3() {
	CurrentBundle = {};
	CurrentBundle.name = $('#BundleOptionForm input[name="bundle.name"]').val();
	CurrentBundle.bundleid = 0;
	CurrentBundle.layoutid = CurrentLayout.layoutid;
	CurrentBundle.status = 1;
	CurrentBundle.layout = CurrentLayout;
	CurrentBundle.bundledtls = [];
	for (var i=0; i<CurrentLayout.layoutdtls.length; i++) {
		layoutdtl = CurrentLayout.layoutdtls[i];
		var bundledtl = {};
		bundledtl.bundledtlid = 'B' + Math.round(Math.random()*100000000);
		bundledtl.bundleid = CurrentBundle.bundleid;
		bundledtl.regionid = layoutdtl.regionid;
		bundledtl.medialist0 = {};
		bundledtl.medialist0.medialistid = 0;
		bundledtl.medialist0.medialistdtls = [];
		bundledtl.medialist0.type = 0;
		bundledtl.text0 = {};
		bundledtl.text0.textid = 0;
		bundledtl.text0.text = '';
		bundledtl.text0.type = 0;
		bundledtl.stream0 = {};
		bundledtl.stream0.streamid = 0;
		bundledtl.stream0.type = 0;
		bundledtl.widget0 = {};
		bundledtl.widget0.widgetid = 0;
		bundledtl.widget0.type = 0;
		if (layoutdtl.region.type == 0) {
			bundledtl.objtype = 1;
			bundledtl.medialist = {};
			bundledtl.medialist.medialistid = 0;
			bundledtl.medialist.medialistdtls = [];
			bundledtl.medialist.name = '';
			bundledtl.stream = {};
			bundledtl.stream.streamid = 0;
			bundledtl.stream.name = '';
			bundledtl.stream.url = '';
			bundledtl.widget = {};
			bundledtl.widget.widgetid = 0;
			bundledtl.widget.name = '';
			bundledtl.widget.url = '';
		} else if (layoutdtl.region.type == 1) {
			bundledtl.objtype = 2;
			bundledtl.text = {};
			bundledtl.text.textid = 0;
			bundledtl.text.name = '';
			bundledtl.text.text = '';
		} else {
			bundledtl.objtype = 0;
		}
		bundledtl.objid = 0;
		bundledtl.type = 0;
		bundledtl.layoutdtl = CurrentLayout.layoutdtls[i];
		CurrentBundle.bundledtls[i] = bundledtl;
	}
	CurrentBundledtl = CurrentBundle.bundledtls[0];

	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	if (CurrentBundle.layout.width > CurrentBundle.layout.height) {
		$('#BundleCol1').attr('class', 'col-md-3 col-sm-3');
		$('#BundleCol2').attr('class', 'col-md-9 col-sm-9');
	} else {
		$('#BundleCol1').attr('class', 'col-md-2 col-sm-2');
		$('#BundleCol2').attr('class', 'col-md-10 col-sm-10');
	}
}


function initTab4() {
	//编制计划对话框中的设备table初始化
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
						{'sTitle' : common.view.position, 'mData' : 'position', 'bSortable' : false }, 
						{'sTitle' : common.view.operation, 'mData' : 'deviceid', 'bSortable' : false }],
		'iDisplayLength' : 20,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-adddevice">' + common.view.add + '</button>');
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push( {'name':'devicegroupid','value':'0' })
		}
	});
	jQuery('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	jQuery('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
	
	//编制计划对话框中的设备组table初始化
	$('#DeviceGroupTable').dataTable({
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
		}
	});
	jQuery('#DeviceGroupTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	jQuery('#DeviceGroupTable_wrapper .dataTables_length select').addClass('form-control input-small');
	
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
		var data = $('#DeviceGroupTable').dataTable().fnGetData($(event.target).attr('data-id'));
		
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

function initData4() {
	$('#SelectedDeviceTable').dataTable().fnClearTable();
	$('#SelectedDevicegroupTable').dataTable().fnClearTable();
	SelectedDeviceList = [];
	SelectedDevicegroupList = [];
}


function initTab5() {
	
}

function initData5() {
	var deviceRowspan = SelectedDeviceList.length>1 ? SelectedDeviceList.length : 1;
	var devicegroupRowspan = SelectedDevicegroupList.length>1 ? SelectedDevicegroupList.length : 1;
	//var currentMediaSum = 0;
	//var filesize = parseInt(currentMediaSum / 1024);
	var html = '';
	html += '<tr>';
	html += '<td>' + common.view.layout + '</td><td>' + CurrentLayout.name + '</td>';
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
	for (var i=0; i<CurrentBundle.layout.layoutdtls.length; i++) {
		if (('' + CurrentBundle.layout.layoutdtls[i].layoutdtlid).indexOf('R') == 0) {
			CurrentBundle.layout.layoutdtls[i].layoutdtlid = '0';
		}
	}
	for (var i=0; i<CurrentBundle.bundledtls.length; i++) {
		if (('' + CurrentBundle.bundledtls[i].bundledtlid).indexOf('B') == 0) {
			CurrentBundle.bundledtls[i].bundledtlid = '0';
		}
	}
	
	$('#snapshot_div').show();
	redrawBundlePreview($('#snapshot_div'), CurrentBundle, 1024, 0);
	html2canvas($('#snapshot_div'), {
		onrendered: function(canvas) {
			console.log(canvas.toDataURL());
			CurrentBundle.snapshotdtl = canvas.toDataURL();
			$('#snapshot_div').hide();

			$.ajax({
				type : 'POST',
				url : myurls['bundle.wizard'],
				data : '{"bundle":' + $.toJSON(CurrentBundle) + ', "devices":' + $.toJSON(SelectedDeviceList) + ', "devicegroups":' + $.toJSON(SelectedDevicegroupList) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				beforeSend: function ( xhr ) {
					Metronic.startPageLoading({animate: true});
				},
				success : function(data, status) {
					Metronic.stopPageLoading();
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
					Metronic.stopPageLoading();
					bootbox.alert(common.tips.error);
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
