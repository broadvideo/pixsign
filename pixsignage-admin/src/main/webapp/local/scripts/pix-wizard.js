var myurls = {
	'layout.list' : 'layout!list.action',
	'medialist.list' : 'medialist!list.action',
	'text.list' : 'text!list.action',
	'stream.list' : 'stream!list.action',
	'dvb.list' : 'dvb!list.action',
	'widget.list' : 'widget!list.action',
	'device.list' : 'device!list.action',
	'devicegroup.list' : 'devicegroup!list.action',
	
	'layout.get' : 'layout!get.action',
	'tpllayout.get' : 'tpllayout!get.action',
	'layout.wizard' : 'layout!wizard.action',
	'branch.list' : 'branch!list.action',
	'schedule.listbytask' : 'schedule!listbytask.action',
	'schedulefile.list' : 'schedulefile!list.action',
};

var Layouts;
var CurrentLayout;
var CurrentTaskid;
var SelectedDeviceList = [];
var SelectedDevicegroupList = [];

function initWizard() {
	initTab1();
	initTab2();
	initTab3();
	initTab4();
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
            	if ($('#LayoutOptionForm').valid() == false) {
            		return false;
            	} else {
            		initData2();
            	}
            } else if (index == 1 && clickedIndex == 2) {
        		initData3();
            } else if (index == 2 && clickedIndex == 3) {
            	if (SelectedDeviceList.length == 0 && SelectedDevicegroupList.length == 0) {
            		bootbox.alert('需要选择终端或者终端组。');
            		return false;
            	} else {
            		initData4();
            	}
            }
        },
        onNext: function (tab, navigation, index) {
        	if (index == 1) {
            	if ($('#LayoutOptionForm').valid() == false) {
            		return false;
            	} else {
            		initData2();
            	}
        	} else if (index == 2) {
        		initData3();
            } else if (index == 3) {
            	if (SelectedDeviceList.length == 0 && SelectedDevicegroupList.length == 0) {
            		bootbox.alert('需要选择终端或者终端组。');
            		return false;
            	} else {
            		initData4();
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
		url : 'layout!list.action',
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				Layouts = data.aaData;
				var layoutTableHtml = '';
				layoutTableHtml += '<tr>';
				for (var i=0; i<Layouts.length; i++) {
					layoutTableHtml += '<td><canvas id="LayoutCanvas' + Layouts[i].layoutid + '"></canvas></td>';
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
					initLayoutCanvas(Layouts[i]);
				}
			} else {
				alert(data.errorcode + ": " + data.errormsg);
			}
		},
		error : function() {
			alert('failure');
		}
	});
	
	function initLayoutCanvas(layout) {
		var canvas = document.getElementById('LayoutCanvas' + layout.layoutid);
		var ctx = canvas.getContext('2d');
		var scale;
		if (layout.width == 1920 || layout.width == 1080) {
			scale = 1920/200;
		} else {
			scale = 800/200;
		}
		canvas.width = Math.max(layout.width/scale, 250);
		canvas.height = Math.max(layout.height/scale, 120);
		for (var i=0; i<layout.layoutdtls.length; i++) {
			var width = layout.layoutdtls[i].width/scale;
			var height = layout.layoutdtls[i].height/scale;
			var top = layout.layoutdtls[i].topoffset/scale;
			var left = layout.layoutdtls[i].leftoffset/scale;
			ctx.fillStyle='#bcc2f2';
			ctx.fillRect(left,top,width,height);
			ctx.strokeStyle = '#000000';
			ctx.strokeRect(left,top,width,height);
		}
	}
}

function initData1() {
    FormValidateOption.rules = {};
	$('#LayoutOptionForm').validate(FormValidateOption);
    $.extend($('#LayoutOptionForm').validate().settings, {
    	rules: FormValidateOption.rules
	});
}


function initTab2() {
	$('input[name="regiondtl.playmode"]').click(function(e) {
		refreshRegionDtlPlaymode();
	});
	refreshRegionDtlPlaymode();
	
	$('input[name="regiondtl.objtype"]').click(function(e) {
		refreshRegionDtlSelect();
	});
	refreshRegionDtlSelect();

	$('body').on('click', '.pix-regiondtl-add', function(event) {
		var regionid = $(event.target).attr('region-id');
		if (regionid == undefined) {
			regionid = $(event.target).parent().attr('region-id');
		}
		$('#RegionDtlForm input[name="regiondtl.regionid"]').attr('value', regionid);
		$('#RegionDtlForm input[name="regiondtl.playdate"]').attr('value', '');
		$('#RegionDtlForm input[name="regiondtl.starttime"]').attr('value', '');
		$('#RegionDtlForm input[name="regiondtl.endtime"]').attr('value', '');

		var regiontype = $(event.target).attr('region-type');
		if (regiontype == undefined) {
			regiontype = $(event.target).parent().attr('region-type');
		}
		
		var objtype = $('input[name="regiondtl.objtype"]:checked').val();
		if (regiontype == 0) {
			$('.objtype-0').css('display', 'block');
			$('.objtype-1').css('display', 'none');
			if (objtype == 2) {
				$('input[name="regiondtl.objtype"][value="1"]').attr('checked', true);
				$('input[name="regiondtl.objtype"][value="1"]').parent().addClass('checked');
				$('input[name="regiondtl.objtype"][value="2"]').attr('checked', false);
				$('input[name="regiondtl.objtype"][value="2"]').parent().removeClass('checked');
			}
		} else if (regiontype == 1) {
			$('.objtype-0').css('display', 'none');
			$('.objtype-1').css('display', 'block');
			if (objtype != 2) {
				$('input[name="regiondtl.objtype"][value="2"]').attr('checked', true);
				$('input[name="regiondtl.objtype"][value="2"]').parent().addClass('checked');
				$('input[name="regiondtl.objtype"][value="' + objtype + '"]').attr('checked', false);
				$('input[name="regiondtl.objtype"][value="' + objtype + '"]').parent().removeClass('checked');
			}
		}
		refreshRegionDtlSelect();

		$('#RegionDtlModal').modal();
	});

	$('[type=submit]', $('#RegionDtlModal')).on('click', function(event) {
		if ($('#RegionDtlForm').valid()) {
			$('#RegionDtlForm .form-group').removeClass('has-error');
			$('#RegionDtlForm .help-block').remove();
			$('#RegionDtlModal').modal('hide');
			
			var regiondtl = {};
			regiondtl.regionid = $('#RegionDtlForm input[name="regiondtl.regionid"]').attr('value');
			regiondtl.playmode = $('#RegionDtlForm input[name="regiondtl.playmode"]:checked').val();
			regiondtl.playdate = $('#RegionDtlForm input[name="regiondtl.playdate"]').attr('value');
			regiondtl.starttime = $('#RegionDtlForm input[name="regiondtl.starttime"]').attr('value');
			regiondtl.endtime = $('#RegionDtlForm input[name="regiondtl.endtime"]').attr('value');
			regiondtl.objtype = $('#RegionDtlForm input[name="regiondtl.objtype"]:checked').val();
			regiondtl.objid = $('#RegionDtlSelect').select2('data').id;

			var results = CurrentLayout.layoutdtls.filter(function (el) {
				return el.regionid == regiondtl.regionid;
			});
			var layoutdtl = results[0];
			layoutdtl.regiondtls[layoutdtl.regiondtls.length] = regiondtl;
			
			var playtime;
			if (regiondtl.playmode == 1) {
				playtime = '单次 ' + regiondtl.playdate + ' ' + regiondtl.starttime + '~' + regiondtl.endtime;
			} else {
				playtime = '每日 ' + regiondtl.starttime;
			}
			var objtype;
			if (regiondtl.objtype == 1) {
				objtype = '列表';
			} else if (regiondtl.objtype == 2) {
				objtype = '文本';
			} else if (regiondtl.objtype == 3) {
				objtype = '视频流';
			} else if (regiondtl.objtype == 4) {
				objtype = '数字频道';
			} else if (regiondtl.objtype == 5) {
				objtype = 'Widget';
			}
			var objname = $('#RegionDtlSelect').select2('data').text;
			$('#RegionDtlTable-' + regiondtl.regionid).dataTable().fnAddData([playtime, objtype, objname, regiondtl.regionid]);
		}
	});

	$('body').on('click', '.pix-regiondtl-delete', function(event) {
		var rowid = $(event.target).attr('row-id');
		var regionid = $(event.target).attr('region-id');
		$('#RegionDtlTable-' + regionid).dataTable().fnDeleteRow(rowid);
		var results = CurrentLayout.layoutdtls.filter(function (el) {
			return el.regionid == regionid;
		});
		var layoutdtl = results[0];
		layoutdtl.regiondtls.splice(rowid, 1);
	});

	function refreshRegionDtlPlaymode() {
		if ($('input[name="regiondtl.playmode"]:checked').val() == 1) {
			$('.playmode-1').css('display', 'block');
			FormValidateOption.rules = {};
			FormValidateOption.rules['regiondtl.playdate'] = {};
			FormValidateOption.rules['regiondtl.playdate']['required'] = true;
			FormValidateOption.rules['regiondtl.endtime'] = {};
			FormValidateOption.rules['regiondtl.endtime']['required'] = true;
		} else {
			$('.playmode-1').css('display', 'none');
			FormValidateOption.rules = {};
		}
		FormValidateOption.rules['regiondtl.starttime'] = {};
		FormValidateOption.rules['regiondtl.starttime']['required'] = true;
		FormValidateOption.rules['regiondtl.objid'] = {};
		FormValidateOption.rules['regiondtl.objid']['required'] = true;
		FormValidateOption.ignore = null;
		$('#RegionDtlForm').validate(FormValidateOption);
	    $.extend($('#RegionDtlForm').validate().settings, {
	    	rules: FormValidateOption.rules
		});
	}
	
	function refreshRegionDtlSelect() {
		var url;
		if ($('input[name="regiondtl.objtype"]:checked').val() == 1) {
			url = myurls['medialist.list']
		} else if ($('input[name="regiondtl.objtype"]:checked').val() == 2) {
			url = myurls['text.list']
		} else if ($('input[name="regiondtl.objtype"]:checked').val() == 3) {
			url = myurls['stream.list']
		} else if ($('input[name="regiondtl.objtype"]:checked').val() == 4) {
			url = myurls['dvb.list']
		} else if ($('input[name="regiondtl.objtype"]:checked').val() == 5) {
			url = myurls['widget.list']
		}
	    $('#RegionDtlSelect').select2({
	        placeholder: '请选择对应内容',
	        //minimumResultsForSearch: -1,
	        minimumInputLength: 0,
	        ajax: { 
	            url: url,
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
	            			if (item.medialistid) {
		            			return {
		            				text:item.name, 
		            				id:item.medialistid,
		            				item:item
		            			};
	            			} else if (item.textid) {
		            			return {
		            				text:item.name, 
		            				id:item.textid,
		            				item:item
		            			};
	            			} else if (item.streamid) {
		            			return {
		            				text:item.name + '(' + item.url + ')', 
		            				id:item.streamid,
		            				item:item
		            			};
	            			} else if (item.dvbid) {
		            			return {
		            				text:item.name, 
		            				id:item.dvbid,
		            				item:item
		            			};
	            			} else if (item.widgetid) {
		            			return {
		            				text:item.name + '(' + item.url + ')', 
		            				id:item.widgetid,
		            				item:item
		            			};
	            			}
	            		}),
	            		more: more
	            	};
	            }
	        },
	        formatResult: function (item) {
	        	return item.text;
	        },
	        formatSelection: function (item) {
	        	return item.text;
	        },
	        initSelection: function(element, callback) {
	        },
	        dropdownCssClass: 'bigdrop', 
	        escapeMarkup: function (m) { return m; } 
	    });
		$('#RegionDtlSelect').val('');
	}

	$('.form_date').datetimepicker({
        autoclose: true,
        isRTL: App.isRTL(),
        format: 'yyyy-mm-dd',
        pickerPosition: (App.isRTL() ? 'bottom-right' : 'bottom-left'),
        language: 'zh-CN',
        minuteStep: 5,
        startView: 2,
        minView: 2
    });

    $('.form_time').datetimepicker({
        autoclose: true,
        isRTL: App.isRTL(),
        format: 'hh:ii:ss',
        pickerPosition: (App.isRTL() ? 'bottom-right' : 'bottom-left'),
        language: 'zh-CN',
        minuteStep: 5,
        startView: 1,
        maxView: 1,
        formatViewType: 'time'
    });
}

function initData2() {
	var results = Layouts.filter(function (el) {
		return el.layoutid == $('input[name="layoutid"]:checked').val();
	});
	CurrentLayout = results[0];
	
	$('#tab2').empty();
	for (var i=0; i<CurrentLayout.layoutdtls.length; i++) {
		layoutdtl = CurrentLayout.layoutdtls[i];
		layoutdtl.regiondtls = [];
		var layoutdtlhtml = '';
		layoutdtlhtml += '<div class="row"><div class="col-md-12 col-sm-12">';
		layoutdtlhtml += '<div class="portlet box purple"><div class="portlet-title">';
		layoutdtlhtml += '<div class="caption"><i class="fa fa-calendar"></i>' + layoutdtl.region.name + '</div>';
		layoutdtlhtml += '<div class="actions">';
		layoutdtlhtml += '<a href="javascript:;" region-id="'+ layoutdtl.regionid + '" region-type="' + layoutdtl.region.type + '" class="btn btn-sm yellow pix-regiondtl-add"><i class="fa fa-plus"></i> 新增明细</a>';
		layoutdtlhtml += '</div></div>';
		layoutdtlhtml += '<div class="portlet-body"><div class="row"><div class="col-md-3 col-sm-3"><canvas id="LayoutCanvas-'+ layoutdtl.regionid + '"></canvas></div>';
		layoutdtlhtml += '<div class="col-md-9 col-sm-9"><div class="table-responsive">';
		layoutdtlhtml += '<table id="RegionDtlTable-' + layoutdtl.regionid + '" class="table table-condensed table-hover">';
		layoutdtlhtml += '<thead></thead><tbody></tbody></table>';
		layoutdtlhtml += '</div></div></div></div></div></div></div>';
		$('#tab2').append(layoutdtlhtml);
	}
	
	for (var i=0; i<CurrentLayout.layoutdtls.length; i++) {
		layoutdtl = CurrentLayout.layoutdtls[i];
		var canvas = document.getElementById('LayoutCanvas-' + layoutdtl.regionid);
		var ctx = canvas.getContext('2d');
		var scale;
		if (CurrentLayout.width == 1920 || CurrentLayout.width == 1080) {
			scale = 1920/200;
		} else {
			scale = 800/200;
		}
		canvas.width = Math.max(CurrentLayout.width/scale, 250);
		canvas.height = Math.max(CurrentLayout.height/scale, 120);
		for (var j=0; j<CurrentLayout.layoutdtls.length; j++) {
			var width = CurrentLayout.layoutdtls[j].width/scale;
			var height = CurrentLayout.layoutdtls[j].height/scale;
			var top = CurrentLayout.layoutdtls[j].topoffset/scale;
			var left = CurrentLayout.layoutdtls[j].leftoffset/scale;
			if (CurrentLayout.layoutdtls[j].regionid == layoutdtl.regionid) {
				ctx.fillStyle='#4537ef';
			} else {
				ctx.fillStyle='#bcc2f2';
			}
			ctx.fillRect(left,top,width,height);
			ctx.strokeStyle = '#000000';
			ctx.strokeRect(left,top,width,height);
		}
		
		$('#RegionDtlTable-' + layoutdtl.regionid).dataTable({
			'sDom' : 't',
			'iDisplayLength' : -1,
			'aoColumns' : [ {'sTitle' : '播放时间', 'bSortable' : false, 'sClass': 'autowrap' }, 
							{'sTitle' : '类型', 'bSortable' : false, 'sClass': 'autowrap' }, 
							{'sTitle' : '内容', 'bSortable' : false, 'sClass': 'autowrap' },
							{'sTitle' : '操作', 'bSortable' : false, 'sWidth' : '50px' }],
			'oLanguage' : { 'sZeroRecords' : '列表为空',
							'sEmptyTable' : '列表为空' },
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(3)', nRow).html('<button row-id="' + iDisplayIndex + '" region-id="' + aData[3] + '" class="btn green btn-xs pix-regiondtl-delete">移除</button>');
				return nRow;
			}
		});
	}
	
}


function initTab3() {
	//编制计划对话框中的设备table初始化
	$('#DeviceTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-12 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 20, 40, 60, 100 ],
						[ 20, 40, 60, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['device.list'],
		'aoColumns' : [ {'sTitle' : '终端ID', 'mData' : 'terminalid', 'bSortable' : false }, 
		                {'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false }, 
		                {'sTitle' : '位置', 'mData' : 'position', 'bSortable' : false }, 
						{'sTitle' : '操作', 'mData' : 'deviceid', 'bSortable' : false }],
		'iDisplayLength' : 20,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-adddevice">选择</button>');
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
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-12 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 20, 40, 60, 100 ],
						[ 20, 40, 60, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['devicegroup.list'],
		'aoColumns' : [ {'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : '操作', 'mData' : 'devicegroupid', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(1)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-adddevicegroup">选择</button>');
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
						{'sTitle' : '名称', 'bSortable' : false }, 
						{'sTitle' : '操作', 'bSortable' : false }],
		'oLanguage' : { 'sZeroRecords' : '列表为空',
						'sEmptyTable' : '列表为空' }, 
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(2)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-deletedevice">移除</button>');
			return nRow;
		}
	});
	
	//编制计划对话框中的右侧设备组选择列表初始化
	$('#SelectedDevicegroupTable').dataTable({
		'sDom' : 't',
		'iDisplayLength' : -1,
		'aoColumns' : [ {'sTitle' : '#', 'bSortable' : false }, 
						{'sTitle' : '名称', 'bSortable' : false }, 
						{'sTitle' : '操作', 'bSortable' : false }],
		'oLanguage' : { 'sZeroRecords' : '列表为空',
						'sEmptyTable' : '列表为空' }, 
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(2)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-deletedevicegroup">移除</button>');
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

function initData3() {
	$('#SelectedDeviceTable').dataTable().fnClearTable();
	$('#SelectedDevicegroupTable').dataTable().fnClearTable();
	SelectedDeviceList = [];
	SelectedDevicegroupList = [];
}


function initTab4() {
	
}

function initData4() {
	var deviceRowspan = SelectedDeviceList.length>1 ? SelectedDeviceList.length : 1;
	var devicegroupRowspan = SelectedDevicegroupList.length>1 ? SelectedDevicegroupList.length : 1;
	//var currentMediaSum = 0;
	//var filesize = parseInt(currentMediaSum / 1024);
	var html = '';
	html += '<tr>';
	html += '<td>布局</td><td>' + CurrentLayout.name + '</td>';
	html += '</tr>';
	//html += '<tr>';
	//html += '<td>视频总量</td><td>' + transferIntToComma(filesize) + ' KB</td>';
	//html += '</tr>';
	html += '<tr>';
	html += '<td rowspan="'+ deviceRowspan + '">设备</td>';
	html += '<td>' + (SelectedDeviceList.length>0? SelectedDeviceList[0].name : '') + '</td>';
	html += '</tr>';
	for (var i=1; i<SelectedDeviceList.length; i++) {
		html += '<tr>';
		html += '<td>' + SelectedDeviceList[i].name + '</td>';
		html += '</tr>';
	}
	html += '<tr>';
	html += '<td rowspan="'+ devicegroupRowspan + '">设备组</td>';
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
	$.ajax({
		type : 'POST',
		url : myurls['layout.wizard'],
		data : '{"layout":' + $.toJSON(CurrentLayout) + ', "devices":' + $.toJSON(SelectedDeviceList) + ', "devicegroups":' + $.toJSON(SelectedDevicegroupList) + '}',
		dataType : 'json',
		contentType : 'application/json;charset=utf-8',
		beforeSend: function ( xhr ) {
			App.blockUI($('.button-submit'));
		},
		success : function(data, status) {
			App.unblockUI($('.button-submit'));
			if (data.errorcode == 0) {
				bootbox.alert('操作成功');
				CurrentTaskid = data.dataid;
				//$('#ScheduleTable').dataTable()._fnAjaxUpdate();
				//$('#SchedulefileTable').dataTable()._fnAjaxUpdate();
				//$('#ScheduleModal').modal();
				
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
		"sAjaxSource" : myurls['device.listbytask'],
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
