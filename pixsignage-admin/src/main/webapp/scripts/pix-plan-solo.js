var submitflag = false;

var CurrentPlan;
var CurrentPlanid;
var CurrentPlandtl;
var CurrentPlandtls;
var CurrentPlanbinds;

var CurrentDeviceBranchid;

var timestamp = new Date().getTime();

function refreshPlan() {
	$('#PlanTable').dataTable()._fnAjaxUpdate();
}			

$('#PlanTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 10, 25, 50, 100 ],
					[ 10, 25, 50, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'plan!list.action',
	'aoColumns' : [ {'sTitle' : common.view.playtime, 'mData' : 'planid', 'bSortable' : false, 'sWidth' : '20%' }, 
	                {'sTitle' : common.view.detail, 'mData' : 'planid', 'bSortable' : false, 'sWidth' : '40%' },
					{'sTitle' : common.view.device, 'mData' : 'planid', 'bSortable' : false, 'sWidth' : '35%' },
					{'sTitle' : '', 'mData' : 'planid', 'bSortable' : false, 'sWidth' : '10%' }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		var playtimehtml = '';
		if (aData.starttime == '00:00:00' && aData.endtime == '00:00:00') {
			playtimehtml += common.view.fulltime;
		} else {
			playtimehtml += aData.starttime + ' ~ ' + aData.endtime;
		}
		$('td:eq(0)', nRow).html(playtimehtml);

		var planhtml = '';
		if (aData.plandtls.length > 0) {
			for (var i=0; i<aData.plandtls.length; i++) {
				var plandtl = aData.plandtls[i];
				var name;
				var thumbwidth;
				if (i % 4 == 0) {
					planhtml += '<div class="row" >';
				}
				planhtml += '<div class="col-md-3 col-xs-3">';

				planhtml += '<a href="javascript:;" bundleid="' + plandtl.objid + '" class="fancybox">';
				planhtml += '<div class="thumbs">';
				if (plandtl.bundle.snapshot != null) {
					var thumbwidth = plandtl.bundle.width > plandtl.bundle.height? 100 : 100*plandtl.bundle.width/plandtl.bundle.height;
					planhtml += '<img src="/pixsigdata' + plandtl.bundle.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + plandtl.bundle.name + '" />';
				} else {
					planhtml += '<img src="/pixsignage/img/blank.png" class="imgthumb" width="100%" />';
				}
				planhtml += '</div>';
				planhtml += '</a>';
				planhtml += '<h6 class="pixtitle">' + name + '</h6>';
				if (plandtl.maxtimes > 0) {
					planhtml += '<h6 class="pixtitle">' + plandtl.maxtimes + '</h6>';
				}
				planhtml += '</div>';
				if ((i+1) % 4 == 0 || (i+1) == aData.plandtls.length) {
					planhtml += '</div>';
				}
			}
		} else {
			planhtml = '';
		}
		$('td:eq(1)', nRow).html(planhtml);
		
		var devicehtml = '';
		var devicegrouphtml = '';
		for (var i=0; i<aData.planbinds.length; i++) {
			var planbind = aData.planbinds[i];
			if (planbind.bindtype == 1) {
				devicehtml += planbind.device.terminalid + ' ';
			} else if (planbind.bindtype == 2) {
				devicegrouphtml += planbind.devicegroup.name + ' ';
			}
		}
		if (devicehtml != '') {
			devicehtml = common.view.device + ': ' + devicehtml + '<br/>';
		}
		if (devicegrouphtml != '') {
			devicegrouphtml = common.view.devicegroup + ': ' + devicegrouphtml;
		}
		$('td:eq(2)', nRow).html(devicehtml + devicegrouphtml);
	
		var operhtml = '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a><br/>';
		operhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a><br/>';
		operhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
		$('td:eq(3)', nRow).html(operhtml);

		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#PlanTable .thumbs').each(function(i) {
			$(this).width($(this).parent().closest('div').width());
			$(this).height($(this).parent().closest('div').width());
		});
		refreshFancybox();
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'plantype','value':1 });
	}
});
$('#PlanTable_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#PlanTable_wrapper .dataTables_length select').addClass('form-control input-small');
$('#PlanTable_wrapper .dataTables_length select').select2();
$('#PlanTable').css('width', '100%');

$('body').on('click', '.pix-sync', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentPlan = $('#PlanTable').dataTable().fnGetData(index);
	bootbox.confirm(common.tips.sync, function(result) {
		if (result == true) {
			$.ajax({
				type : 'GET',
				url : 'plan!sync.action',
				cache: false,
				data : { planid: CurrentPlan.planid },
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
					console.log('failue');
				}
			});				
		}
	});
});

function refreshFancybox() {
	$('.fancybox').each(function(index,item) {
		$(this).click(function() {
			var bundleid = $(this).attr('bundleid');
			$.ajax({
				type : 'GET',
				url : 'bundle!get.action',
				data : {bundleid: bundleid},
				success : function(data, status) {
					if (data.errorcode == 0) {
						$.fancybox({
							openEffect	: 'none',
							closeEffect	: 'none',
							closeBtn : false,
					        padding : 0,
					        content: '<div id="BundlePreview"></div>',
					    });
						redrawBundlePreview($('#BundlePreview'), data.bundle, 800, 1);
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
}

$('body').on('click', '.pix-add', function(event) {
	CurrentPlan = {};
	CurrentPlandtls = [];
	CurrentPlanbinds = [];
	CurrentPlanid = 0;
	CurrentPlan.planid = 0;
	CurrentPlan.plantype = 1;
	CurrentPlan.startdate = '1970-01-01';
	CurrentPlan.enddate = '2037-01-01';
	CurrentPlan.starttime = '00:00:00';
	CurrentPlan.endtime = '00:00:00';
	initWizard();
	$('#PlanModal').modal();
});

$('body').on('click', '.pix-update', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentPlan = $('#PlanTable').dataTable().fnGetData(index);
	CurrentPlandtls = CurrentPlan.plandtls;
	CurrentPlanbinds = CurrentPlan.planbinds;
	initWizard();
	$('#PlanModal').modal();
});

$('body').on('click', '.pix-delete', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentPlan = $('#PlanTable').dataTable().fnGetData(index);
	bootbox.confirm(common.tips.remove, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : 'plan!delete.action',
				cache: false,
				data : {
					'plan.planid': CurrentPlan.planid
				},
				success : function(data, status) {
					if (data.errorcode == 0) {
						refreshPlan();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});				
		}
	 });
	
});

//Bundle table初始化
$('#BundleTable thead').css('display', 'none');
$('#BundleTable tbody').css('display', 'none');	
var bundlehtml = '';
$('#BundleTable').dataTable({
	'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 12, 30, 48, 96 ],
					  [ 12, 30, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'bundle!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'bundleid', 'bSortable' : false }],
	'iDisplayLength' : 12,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#BundleContainer').length < 1) {
			$('#BundleTable').append('<div id="BundleContainer"></div>');
		}
		$('#BundleContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 6 == 0) {
			bundlehtml = '';
			bundlehtml += '<div class="row" >';
		}
		bundlehtml += '<div class="col-md-2 col-xs-2">';
		
		bundlehtml += '<div id="ThumbContainer" style="position:relative">';
		bundlehtml += '<div id="BundleThumb" class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			bundlehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		} else {
			bundlehtml += '<img src="/pixsignage/img/blank.png" class="imgthumb" width="100%" />';
		}
		bundlehtml += '<div class="mask">';
		bundlehtml += '<div>';
		bundlehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
		bundlehtml += '<a class="btn default btn-sm green pix-plandtl-bundle-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
		bundlehtml += '</div>';
		bundlehtml += '</div>';
		bundlehtml += '</div>';

		bundlehtml += '</div>';

		bundlehtml += '</div>';
		if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#BundleTable').dataTable().fnGetData().length) {
			bundlehtml += '</div>';
			if ((iDisplayIndex+1) != $('#BundleTable').dataTable().fnGetData().length) {
				bundlehtml += '<hr/>';
			}
			$('#BundleContainer').append(bundlehtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#BundleContainer .thumbs').each(function(i) {
			$(this).width($(this).parent().width());
			$(this).height($(this).parent().width());
		});
		$('#BundleContainer .mask').each(function(i) {
			$(this).width($(this).parent().parent().width() + 2);
			$(this).height($(this).parent().parent().width() + 2);
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'touchflag','value':'0' });
	}
});
$('#BundleTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
$('#BundleTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
$('#BundleTable').css('width', '100%');

//Touchbundle table初始化
$('#TouchbundleTable thead').css('display', 'none');
$('#TouchbundleTable tbody').css('display', 'none');	
var touchbundlehtml = '';
$('#TouchbundleTable').dataTable({
	'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 12, 30, 48, 96 ],
					  [ 12, 30, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'bundle!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'bundleid', 'bSortable' : false }],
	'iDisplayLength' : 12,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#TouchbundleContainer').length < 1) {
			$('#TouchbundleTable').append('<div id="TouchbundleContainer"></div>');
		}
		$('#TouchbundleContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 6 == 0) {
			touchbundlehtml = '';
			touchbundlehtml += '<div class="row" >';
		}
		touchbundlehtml += '<div class="col-md-2 col-xs-2">';
		
		touchbundlehtml += '<div id="ThumbContainer" style="position:relative">';
		touchbundlehtml += '<div id="TouchbundleThumb" class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			touchbundlehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		} else {
			touchbundlehtml += '<img src="/pixsignage/img/blank.png" class="imgthumb" width="100%" />';
		}
		touchbundlehtml += '<div class="mask">';
		touchbundlehtml += '<div>';
		touchbundlehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
		touchbundlehtml += '<a class="btn default btn-sm green pix-plandtl-touchbundle-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
		touchbundlehtml += '</div>';
		touchbundlehtml += '</div>';
		touchbundlehtml += '</div>';

		touchbundlehtml += '</div>';

		touchbundlehtml += '</div>';
		if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#TouchbundleTable').dataTable().fnGetData().length) {
			touchbundlehtml += '</div>';
			if ((iDisplayIndex+1) != $('#TouchbundleTable').dataTable().fnGetData().length) {
				touchbundlehtml += '<hr/>';
			}
			$('#TouchbundleContainer').append(touchbundlehtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#TouchbundleContainer .thumbs').each(function(i) {
			$(this).height($(this).parent().width());
		});
		$('#TouchbundleContainer .mask').each(function(i) {
			$(this).height($(this).parent().parent().width() + 2);
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'touchflag','value':'1' });
		aoData.push({'name':'homeflag','value':'1' });
	}
});
$('#TouchbundleTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
$('#TouchbundleTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
$('#TouchbundleTable').css('width', '100%');

//SelectedDtlTable初始化
$('#SelectedDtlTable').dataTable({
	'sDom' : 't',
	'iDisplayLength' : -1,
	'aoColumns' : [ {'sTitle' : '', 'bSortable' : false, 'sWidth' : '40px' }, 
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '80px' }, 
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '60px' }, 
					{'sTitle' : '', 'bSortable' : false, 'sClass': 'autowrap' }, 
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '30px' }],
	'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
	'oLanguage' : { 'sZeroRecords' : common.view.empty,
					'sEmptyTable' : common.view.empty }, 
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(4)', nRow).html('<button index="' + iDisplayIndex + '" class="btn red btn-xs pix-plandtl-delete"><i class="fa fa-trash-o"></i></button>');
		return nRow;
	}
});

$('#DeviceTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 20, 40, 60, 100 ],
					[ 20, 40, 60, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'device!list.action',
	'aoColumns' : [ {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
					{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.position, 'mData' : 'position', 'bSortable' : false }, 
					{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false }],
	'iDisplayLength' : 20,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-planbind-device-add">' + common.view.add + '</button>');
		return nRow;
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurrentDeviceBranchid });
		aoData.push({'name':'devicegroupid','value':'0' });
	}
});
$('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
$('#DeviceTable').css('width', '100%');

$('#DevicegroupTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 20, 40, 60, 100 ],
					[ 20, 40, 60, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'devicegroup!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' }, 
					{'sTitle' : common.view.detail, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '80%' },
					{'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '10%' }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		var listhtml = '';
		for (var i=0; i<aData.devices.length; i++) {
			listhtml += aData.devices[i].terminalid + ' ';
		}
		$('td:eq(1)', nRow).html(listhtml);
		$('td:eq(2)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-planbind-devicegroup-add">' + common.view.add + '</button>');
		return nRow;
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurrentDeviceBranchid });
		aoData.push({'name':'type','value':'1' });
	}
});
$('#DevicegroupTable_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#DevicegroupTable_wrapper .dataTables_length select').addClass('form-control input-small');
$('#DevicegroupTable').css('width', '100%');

//SelectedBindTable初始化
$('#SelectedBindTable').dataTable({
	'sDom' : 't',
	'iDisplayLength' : -1,
	'aoColumns' : [ {'sTitle' : '', 'bSortable' : false, 'sWidth' : '40px' }, 
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '80px' }, 
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '80px' }, 
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '30px' }],
	'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
	'oLanguage' : { 'sZeroRecords' : common.view.empty,
					'sEmptyTable' : common.view.empty }, 
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(3)', nRow).html('<button index="' + iDisplayIndex + '" class="btn red btn-xs pix-planbind-delete"><i class="fa fa-trash-o"></i></button>');
		return nRow;
	}
});

$('#nav_tab1').click(function(event) {
	$('#BundleDiv').css('display', '');
	$('#TouchbundleDiv').css('display', 'none');
	$('#BundleTable').dataTable()._fnAjaxUpdate();
});
$('#nav_tab2').click(function(event) {
	$('#BundleDiv').css('display', 'none');
	$('#TouchbundleDiv').css('display', '');
	$('#TouchbundleTable').dataTable()._fnAjaxUpdate();
});
//增加Bundle到SelectedDtlTable
$('body').on('click', '.pix-plandtl-bundle-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#BundleTable').dataTable().fnGetData(rowIndex);
	var plandtl = {};
	plandtl.plandtlid = 0;
	plandtl.planid = CurrentPlan.planid;
	plandtl.objtype = 1;
	plandtl.objid = data.bundleid;
	plandtl.bundle = data;
	plandtl.sequence = CurrentPlandtls.length + 1;
	plandtl.maxtimes = 0;
	plandtl.duration = 0;
	CurrentPlandtls.push(plandtl);
	refreshSelectedDtlTable();
});
//增加Touchbundle到SelectedDtlTable
$('body').on('click', '.pix-plandtl-touchbundle-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#TouchbundleTable').dataTable().fnGetData(rowIndex);
	var plandtl = {};
	plandtl.plandtlid = 0;
	plandtl.planid = CurrentPlan.planid;
	plandtl.objtype = 1;
	plandtl.objid = data.bundleid;
	plandtl.bundle = data;
	plandtl.sequence = CurrentPlandtls.length + 1;
	plandtl.maxtimes = 0;
	plandtl.duration = 0;
	CurrentPlandtls.push(plandtl);
	refreshSelectedDtlTable();
});
//删除SelectedDtlTable
$('body').on('click', '.pix-plandtl-delete', function(event) {
	var index = $(event.target).attr('index');
	if (index == undefined) {
		index = $(event.target).parent().attr('index');
	}
	for (var i=index; i<CurrentPlandtls.length; i++) {
		CurrentPlandtls[i].sequence = i;
	}
	CurrentPlandtls.splice(index, 1);
	refreshSelectedDtlTable();
});

$('#nav_dtab1').click(function(event) {
	$('#DeviceDiv').css('display', '');
	$('#DevicegroupDiv').css('display', 'none');
	$('#DeviceTable').dataTable()._fnAjaxUpdate();
});
$('#nav_dtab2').click(function(event) {
	$('#DeviceDiv').css('display', 'none');
	$('#DevicegroupDiv').css('display', '');
	$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
});
//增加Device到SelectedBindTable
$('body').on('click', '.pix-planbind-device-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#DeviceTable').dataTable().fnGetData(rowIndex);
	if (CurrentPlanbinds.filter(function (el) {
		return el.bindtype == 1 && el.bindid == data.deviceid;
	}).length > 0) {
		return;
	}
	var planbind = {};
	planbind.planbindid = 0;
	planbind.planid = CurrentPlan.planid;
	planbind.bindtype = 1;
	planbind.bindid = data.deviceid;
	planbind.device = data;
	CurrentPlanbinds.push(planbind);
	refreshSelectedBindTable();
});
//增加Devicegroup到SelectedBindTable
$('body').on('click', '.pix-planbind-devicegroup-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#DevicegroupTable').dataTable().fnGetData(rowIndex);
	if (CurrentPlanbinds.filter(function (el) {
		return el.bindtype == 2 && el.bindid == data.devicegroupid;
	}).length > 0) {
		return;
	}

	var planbind = {};
	planbind.planbindid = 0;
	planbind.planid = CurrentPlan.planid;
	planbind.bindtype = 2;
	planbind.bindid = data.devicegroupid;
	planbind.devicegroup = data;
	CurrentPlanbinds.push(planbind);
	refreshSelectedBindTable();
});
//删除SelectedBindTable
$('body').on('click', '.pix-planbind-delete', function(event) {
	var index = $(event.target).attr('index');
	if (index == undefined) {
		index = $(event.target).parent().attr('index');
	}
	CurrentPlanbinds.splice(index, 1);
	refreshSelectedBindTable();
});

function initWizard() {
	initTab1();
	initTab2();
	initTab3();
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
				if (validPlanOption()) {
					initData2();
				} else {
					return false;
				}
			} else if (index == 1 && clickedIndex == 2) {
				if (validPlandtl()) {
					initData3();
				} else {
					return false;
				}
			} 
		},
		onNext: function (tab, navigation, index) {
			if (index == 1) {
				if (validPlanOption()) {
					initData2();
				} else {
					return false;
				}
			} else if (index == 2) {
				if (validPlandtl()) {
					initData3();
				} else {
					return false;
				}
			}
		},
		onPrevious: function (tab, navigation, index) {
		},
		onTabShow: function (tab, navigation, index) {
			handleTitle(tab, navigation, index);
			if (index == 1) {
				$('#BundleTable').dataTable()._fnAjaxUpdate();
			} else if (index == 2) {
			}
		}
	});

	$('#MyWizard').find('.button-previous').hide();
	$('#MyWizard .button-submit').click(function () {
		if (validPlanbind()) {
			submitData();
		}
	}).hide();
	
	$('#MyWizard').bootstrapWizard('first');
}

function initTab1() {
	$('input[name="plan.fulltime"]').click(function(e) {
		if ($('input[name="plan.fulltime"]').attr('checked')) {
			$('input[name="plan.starttime"]').parent().css('display', 'none');
			$('input[name="plan.endtime"]').parent().css('display', 'none');
		} else {
			$('input[name="plan.starttime"]').parent().css('display', '');
			$('input[name="plan.endtime"]').parent().css('display', '');
			$('input[name="plan.starttime"]').val('00:00:00');
			$('input[name="plan.endtime"]').val('00:00:00');
		}
	});  
}

function initData1() {
	$('#PlanOptionForm').loadJSON(CurrentPlan);
	if (CurrentPlan.starttime == '00:00:00' && CurrentPlan.endtime == '00:00:00') {
		$('input[name="plan.fulltime"]').attr('checked', 'checked');
		$('input[name="plan.fulltime"]').parent().addClass('checked');
		$('input[name="plan.starttime"]').parent().css('display', 'none');
		$('input[name="plan.endtime"]').parent().css('display', 'none');
	} else {
		$('input[name="plan.fulltime"]').removeAttr('checked');
		$('input[name="plan.fulltime"]').parent().removeClass('checked');
		$('input[name="plan.starttime"]').parent().css('display', '');
		$('input[name="plan.endtime"]').parent().css('display', '');
		$('input[name="plan.starttime"]').val(CurrentPlan.starttime);
		$('input[name="plan.endtime"]').val(CurrentPlan.endtime);
	}
}

function initTab2() {
}

function initData2() {
	$('#BundleTable').dataTable()._fnAjaxUpdate();
	$('#TouchbundleTable').dataTable()._fnAjaxUpdate();
	refreshSelectedDtlTable();
}

function initTab3() {
	initDeviceBranchTree();
}

function initData3() {
	$('#DeviceTable').dataTable()._fnAjaxUpdate();
	$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
	refreshSelectedBindTable();
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
	
	for (var i=0; i<CurrentPlandtls.length; i++) {
		CurrentPlandtls[i].bundle = undefined;
	}
	for (var i=0; i<CurrentPlanbinds.length; i++) {
		CurrentPlanbinds[i].device = undefined;
		CurrentPlanbinds[i].devicegroup = undefined;
	}
	CurrentPlan.plandtls = CurrentPlandtls;
	CurrentPlan.planbinds = CurrentPlanbinds;
	
	$.ajax({
		type : 'POST',
		url : 'plan!design.action',
		data : '{"plan":' + $.toJSON(CurrentPlan) + '}',
		dataType : 'json',
		contentType : 'application/json;charset=utf-8',
		success : function(data, status) {
			submitflag = false;
			Metronic.unblockUI();
			$('#PlanModal').modal('hide');
			if (data.errorcode == 0) {
				bootbox.alert(common.tips.success);
				$('#PlanTable').dataTable()._fnAjaxUpdate();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			submitflag = false;
			Metronic.unblockUI();
			$('#PlanModal').modal('hide');
			console.log('failue');
		}
	});
}

function validPlanOption() {
	if ($('input[name="plan.fulltime"]').attr('checked')) {
		CurrentPlan.starttime = '00:00:00';
		CurrentPlan.endtime = '00:00:00';
	} else {
		CurrentPlan.starttime = $('input[name="plan.starttime"]').val();
		CurrentPlan.endtime = $('input[name="plan.endtime"]').val();
	}
	return true;
}

function validPlandtl() {
	if (CurrentPlandtls.length == 0) {
		bootbox.alert(common.tips.plandtl_zero);
		return false;
	}
	return true;
}

function validPlanbind() {
	if (CurrentPlanbinds.length == 0) {
		bootbox.alert(common.tips.planbind_zero);
		return false;
	}
	return true;
}

function refreshSelectedDtlTable() {
	$('#SelectedDtlTable').dataTable().fnClearTable();
	for (var i=0; i<CurrentPlandtls.length; i++) {
		var plandtl = CurrentPlandtls[i];
		var mediatype = '';
		var thumbwidth = 100;
		var thumbnail = '';
		var thumbhtml = '';
		var medianame = '';

		if (plandtl.objtype == 1) {
			if (plandtl.bundle.snapshot != null) {
				thumbwidth = plandtl.bundle.width > plandtl.bundle.height? 100 : 100*plandtl.bundle.width/plandtl.bundle.height;
				thumbnail = '/pixsigdata' + plandtl.bundle.snapshot + '?t=' + timestamp;
			} else {
				thumbnail = '/pixsignage/img/blank.png';
			}
			mediatype = common.view.solopage;
			medianame = plandtl.bundle.name;
			if (plandtl.bundle.touchflag == 0) {
				mediatype = common.view.bundle;
			} else if (plandtl.bundle.touchflag == 1) {
				mediatype = common.view.touchbundle;
			}
		}
		if (thumbnail != '') {
			thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + medianame + '"></div>';
		}
		$('#SelectedDtlTable').dataTable().fnAddData([plandtl.sequence, mediatype, thumbhtml, medianame, 0]);
	}
}

function refreshSelectedBindTable() {
	$('#SelectedBindTable').dataTable().fnClearTable();
	for (var i=0; i<CurrentPlanbinds.length; i++) {
		var planbind = CurrentPlanbinds[i];
		var bindtype = '';
		var bindname = '';

		if (planbind.bindtype == 1) {
			bindtype = common.view.device;
			bindname = planbind.device.terminalid;
		} else if (planbind.bindtype == 2) {
			bindtype = common.view.devicegroup;
			bindname = planbind.devicegroup.name;
		}
		$('#SelectedBindTable').dataTable().fnAddData([(i+1), bindtype, bindname, 0]);
	}
}


function initDeviceBranchTree() {
	$.ajax({
		type : 'POST',
		url : 'branch!list.action',
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var branches = data.aaData;
				CurrentDeviceBranchid = branches[0].branchid;
				
				if ( $("#DeviceBranchTreeDiv").length > 0 ) {
					if (branches[0].children.length == 0) {
						$('#DeviceBranchTreeDiv').css('display', 'none');
						$('#DeviceTable').dataTable()._fnAjaxUpdate();
						$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
					} else {
						var branchTreeDivData = [];
						createBranchTreeData(branches, branchTreeDivData);
						$('#DeviceBranchTreeDiv').jstree('destroy');
						$('#DeviceBranchTreeDiv').jstree({
							'core' : {
								'multiple' : false,
								'data' : branchTreeDivData
							},
							'plugins' : ['unique'],
						});
						$('#DeviceBranchTreeDiv').on('loaded.jstree', function() {
							$('#DeviceBranchTreeDiv').jstree('select_node', CurrentDeviceBranchid);
						});
						$('#DeviceBranchTreeDiv').on('select_node.jstree', function(event, data) {
							CurrentDeviceBranchid = data.instance.get_node(data.selected[0]).id;
							$('#DeviceTable').dataTable()._fnAjaxUpdate();
							$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
						});
					}
				}
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
	function createBranchTreeData(branches, treeData) {
		for (var i=0; i<branches.length; i++) {
			treeData[i] = {};
			treeData[i].id = branches[i].branchid;
			treeData[i].text = branches[i].name;
			treeData[i].state = {
				opened: true,
			}
			treeData[i].children = [];
			createBranchTreeData(branches[i].children, treeData[i].children);
		}
	}	
}

$('.form_time').datetimepicker({
	autoclose: true,
	isRTL: Metronic.isRTL(),
	format: 'hh:ii:ss',
	pickerPosition: (Metronic.isRTL() ? 'bottom-right' : 'bottom-left'),
	language: 'zh-CN',
	minuteStep: 5,
	startView: 1,
	maxView: 1,
	formatViewType: 'time'
});
$(".form_date").datetimepicker({
	autoclose: true,
	isRTL: Metronic.isRTL(),
	format: "yyyy-mm-dd",
	pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left"),
	language: "zh-CN",
	minView: 'month',
	todayBtn: true
});
