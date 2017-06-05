var submitflag = false;

var CurrentPlan;
var CurrentPlanid;
var CurrentPlandtl;
var CurrentPlandtls;
var CurrentPlanbinds;

var Gridlayouts;

var CurrentMediaBranchid;
var CurrentMediaFolderid;

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
					{'sTitle' : common.view.devicegrid, 'mData' : 'planid', 'bSortable' : false, 'sWidth' : '35%' },
					{'sTitle' : '', 'mData' : 'planid', 'bSortable' : false, 'sWidth' : '10%' }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		var playtimehtml = '';
		if (aData.startdate == '1970-01-01') {
			playtimehtml += common.view.unlimited;
		} else {
			playtimehtml += aData.startdate;
		}
		playtimehtml += ' ~ ';
		if (aData.enddate == '2037-01-01') {
			playtimehtml += common.view.unlimited;
		} else {
			playtimehtml += aData.enddate;
		}
		playtimehtml += '<br/>';
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

				planhtml += '<a href="javascript:;" data-index="' + iDisplayIndex + '" plandtl-index="' + i + '" class="fancybox">';
				planhtml += '<div class="thumbs">';

				if (plandtl.objtype == 2) {
					name = plandtl.page.name;
					thumbwidth = plandtl.page.width > plandtl.page.height? 100 : 100*plandtl.page.width/plandtl.page.height;
					planhtml += '<img src="/pixsigdata' + plandtl.page.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
				} else if (plandtl.objtype == 3) {
					name = plandtl.video.name;
					thumbwidth = plandtl.video.width > plandtl.video.height? 100 : 100*plandtl.video.width/plandtl.video.height;
					planhtml += '<img src="/pixsigdata' + plandtl.video.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" />';
				} else if (plandtl.objtype == 4) {
					name = plandtl.image.name;
					thumbwidth = plandtl.image.width > plandtl.image.height? 100 : 100*plandtl.image.width/plandtl.image.height;
					planhtml += '<img src="/pixsigdata' + plandtl.image.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" />';
				} else if (plandtl.objtype == 9) {
					name = plandtl.mediagrid.name;
					thumbwidth = plandtl.mediagrid.width > plandtl.mediagrid.height? 100 : 100*plandtl.mediagrid.width/plandtl.mediagrid.height;
					planhtml += '<img src="/pixsigdata' + plandtl.mediagrid.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
				}
				planhtml += '</div>';
				planhtml += '</a>';
				planhtml += '<h6 class="pixtitle">' + name + '</h6>';
				if (plandtl.duration > 0) {
					planhtml += '<h6 class="pixtitle">' + transferIntToTime(plandtl.duration) + '</h6>';
				}
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
		
		var devicegridhtml = '';
		var devicegrouphtml = '';
		for (var i=0; i<aData.planbinds.length; i++) {
			var planbind = aData.planbinds[i];
			if (planbind.bindtype == 2) {
				devicegrouphtml += planbind.devicegroup.name + ' ';
			} else if (planbind.bindtype == 3) {
				devicegridhtml += planbind.devicegrid.name + ' ';
			}
		}
		if (devicegridhtml != '') {
			devicegridhtml = common.view.devicegrid + ': ' + devicegridhtml + '<br/>';
		}
		if (devicegrouphtml != '') {
			devicegrouphtml = common.view.devicegridgroup + ': ' + devicegrouphtml;
		}
		$('td:eq(2)', nRow).html(devicegridhtml + devicegrouphtml);
	
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
		aoData.push({'name':'plantype','value':2 });
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
			var data_index = $(this).attr('data-index');
			var plandtl_index = $(this).attr('plandtl-index');
			var plan = $('#PlanTable').dataTable().fnGetData(data_index);
			var plandtl = plan.plandtls[plandtl_index];

			$.fancybox({
				openEffect	: 'none',
				closeEffect	: 'none',
				closeBtn : false,
				padding : 0,
				content: '<div id="MediagridPreview"></div>',
			});
			if (plandtl.objtype == 9) {
				redrawMediagridPreview($('#MediagridPreview'), plandtl.mediagrid, 800);
			} else {
				var thumbnail;
				if (plandtl.video != null) {
					thumbnail = '/pixsigdata' + plandtl.video.thumbnail;
				} else if (plandtl.image != null) {
					thumbnail = '/pixsigdata' + plandtl.image.thumbnail;
				} else if (plandtl.page != null) {
					thumbnail = '/pixsigdata' + plandtl.page.snapshot;
				} else if (plandtl.bundle != null) {
					thumbnail = '/pixsigdata' + plandtl.bundle.snapshot;
				}
				Gridlayouts.filter(function (el) {
					return el.gridlayoutcode == plan.gridlayoutcode;
				})
				redrawSologridPreview($('#MediagridPreview'), Gridlayouts[0], thumbnail, 800);
			}
			
			return false;
		})
	});
}


$.ajax({
	type : 'POST',
	url : 'gridlayout!list.action',
	data : {},
	success : function(data, status) {
		if (data.errorcode == 0) {
			Gridlayouts = data.aaData;
			var gridlayoutTableHtml = '';
			gridlayoutTableHtml += '<tr>';
			for (var i=0; i<Gridlayouts.length; i++) {
				gridlayoutTableHtml += '<td style="padding: 0px 20px 0px 0px;"><div id="GridlayoutDiv-' + Gridlayouts[i].gridlayoutid + '"></div></td>';
			}
			gridlayoutTableHtml += '</tr>';
			gridlayoutTableHtml += '<tr>';
			for (var i=0; i<Gridlayouts.length; i++) {
				gridlayoutTableHtml += '<td>';
				gridlayoutTableHtml += '<label class="radio-inline">';
				if (i == 0) {
					gridlayoutTableHtml += '<input type="radio" name="plan.gridlayoutcode" value="' + Gridlayouts[i].gridlayoutcode + '" checked>';
				} else {
					gridlayoutTableHtml += '<input type="radio" name="plan.gridlayoutcode" value="' +Gridlayouts[i].gridlayoutcode + '">';
				}
				if (Gridlayouts[i].ratio == 1) {
					gridlayoutTableHtml += Gridlayouts[i].xcount + 'x' + Gridlayouts[i].ycount + '(16:9)';
				} else {
					gridlayoutTableHtml += Gridlayouts[i].xcount + 'x' + Gridlayouts[i].ycount + '(9:16)';
				}
				gridlayoutTableHtml += '</label></td>';
			}
			gridlayoutTableHtml += '</tr>';
			$('#GridlayoutTable').html(gridlayoutTableHtml);
			for (var i=0; i<Gridlayouts.length; i++) {
				var gridlayout = Gridlayouts[i];
				redrawGridlayout($('#GridlayoutDiv-' + gridlayout.gridlayoutid), gridlayout, 200);
			}
		} else {
			bootbox.alert(common.tips.error + data.errormsg);
		}
	},
	error : function() {
		console.log('failue');
	}
});

function redrawGridlayout(div, gridlayout, maxsize) {
	div.empty();
	div.attr('style', 'position:relative; margin-left:0; margin-right:auto; border: 0px solid #000; background:#FFFFFF;');
	for (var i=0; i<gridlayout.xcount; i++) {
		for (var j=0; j<gridlayout.ycount; j++) {
			var html = '<div style="position: absolute; width:' + (100/gridlayout.xcount);
			html += '%; height:' + (100/gridlayout.ycount);
			html += '%; left: ' + (i*100/gridlayout.xcount);
			html += '%; top: ' + (j*100/gridlayout.ycount);
			html += '%; border: 1px dotted #000; ">';
			div.append(html);
		}
	}
	var scale, width, height;
	if (gridlayout.width > gridlayout.height ) {
		width = maxsize;
		scale = gridlayout.width / width;
		height = gridlayout.height / scale;
		div.css('width' , width);
		div.css('height' , height);
	} else {
		height = maxsize * 9 / 16;
		scale = gridlayout.height / height;
		width = gridlayout.width / scale;
		div.css('width' , width);
		div.css('height' , height);
	}
}

$('body').on('click', '.pix-add', function(event) {
	CurrentPlan = {};
	CurrentPlandtls = [];
	CurrentPlanbinds = [];
	CurrentPlanid = 0;
	CurrentPlan.planid = 0;
	CurrentPlan.plantype = 2;
	CurrentPlan.startdate = '1970-01-01';
	CurrentPlan.enddate = '2037-01-01';
	CurrentPlan.starttime = '00:00:00';
	CurrentPlan.endtime = '00:00:00';
	initWizard();
	$('.plan-layout').css('display', '');
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
	$('.plan-layout').css('display', 'none');
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

//本地视频table初始化
$('#MediagridTable thead').css('display', 'none');
$('#MediagridTable tbody').css('display', 'none');	
var mediagridhtml = '';
$('#MediagridTable').dataTable({
	'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 12, 30, 48, 96 ],
					  [ 12, 30, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'mediagrid!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'mediagridid', 'bSortable' : false }],
	'iDisplayLength' : 12,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#MediagridContainer').length < 1) {
			$('#MediagridTable').append('<div id="MediagridContainer"></div>');
		}
		$('#MediagridContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 6 == 0) {
			mediagridhtml = '';
			mediagridhtml += '<div class="row" >';
		}
		mediagridhtml += '<div class="col-md-2 col-xs-2">';

		mediagridhtml += '<div id="ThumbContainer" style="position:relative">';
		var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
		mediagridhtml += '<div id="MediagridThumb" class="thumbs">';
		mediagridhtml += '<img src="/pixsigdata' + aData.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
		mediagridhtml += '<div class="mask">';
		mediagridhtml += '<div>';
		mediagridhtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
		mediagridhtml += '<a class="btn default btn-sm green pix-plandtl-mediagrid-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
		mediagridhtml += '</div>';
		mediagridhtml += '</div>';
		mediagridhtml += '</div>';

		mediagridhtml += '</div>';

		mediagridhtml += '</div>';
		if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#MediagridTable').dataTable().fnGetData().length) {
			mediagridhtml += '</div>';
			if ((iDisplayIndex+1) != $('#MediagridTable').dataTable().fnGetData().length) {
				mediagridhtml += '<hr/>';
			}
			$('#MediagridContainer').append(mediagridhtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#MediagridContainer .thumbs').each(function(i) {
			$(this).height($(this).parent().width());
		});
		$('#MediagridContainer .mask').each(function(i) {
			$(this).height($(this).parent().parent().width() + 2);
		});
	},
	'fnServerParams': function(aoData) {
		if (CurrentPlan != null) {
			aoData.push({'name':'gridlayoutcode','value':CurrentPlan.gridlayoutcode });
		}
		aoData.push({'name':'status','value':1 });
	}
});
$('#MediagridTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
$('#MediagridTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
$('#MediagridTable').css('width', '100%');

//视频table初始化
$('#VideoTable thead').css('display', 'none');
$('#VideoTable tbody').css('display', 'none');	
var videohtml = '';
$('#VideoTable').dataTable({
	'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 12, 30, 48, 96 ],
					  [ 12, 30, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'video!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'videoid', 'bSortable' : false }],
	'iDisplayLength' : 12,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#VideoContainer').length < 1) {
			$('#VideoTable').append('<div id="VideoContainer"></div>');
		}
		$('#VideoContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 6 == 0) {
			videohtml = '';
			videohtml += '<div class="row" >';
		}
		videohtml += '<div class="col-md-2 col-xs-2">';

		videohtml += '<div id="ThumbContainer" style="position:relative">';
		var thumbnail = '../img/video.jpg';
		var thumbwidth = 100;
		if (aData.thumbnail != null) {
			thumbnail = '/pixsigdata' + aData.thumbnail;
			thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
		}
		videohtml += '<div id="VideoThumb" class="thumbs">';
		videohtml += '<img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		videohtml += '<div class="mask">';
		videohtml += '<div>';
		videohtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
		videohtml += '<a class="btn default btn-sm green pix-plandtl-video-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
		videohtml += '</div>';
		videohtml += '</div>';
		videohtml += '</div>';

		videohtml += '</div>';

		videohtml += '</div>';
		if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#VideoTable').dataTable().fnGetData().length) {
			videohtml += '</div>';
			if ((iDisplayIndex+1) != $('#VideoTable').dataTable().fnGetData().length) {
				videohtml += '<hr/>';
			}
			$('#VideoContainer').append(videohtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#VideoContainer .thumbs').each(function(i) {
			$(this).height($(this).parent().width());
		});
		$('#VideoContainer .mask').each(function(i) {
			$(this).height($(this).parent().parent().width() + 2);
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurrentMediaBranchid });
		aoData.push({'name':'folderid','value':CurrentMediaFolderid });
		aoData.push({'name':'type','value':1 });
	}
});
$('#VideoTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
$('#VideoTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
$('#VideoTable').css('width', '100%');

//图片table初始化
$('#ImageTable thead').css('display', 'none');
$('#ImageTable tbody').css('display', 'none');	
var imagehtml = '';
$('#ImageTable').dataTable({
	'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 12, 30, 48, 96 ],
					  [ 12, 30, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'image!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'imageid', 'bSortable' : false }],
	'iDisplayLength' : 12,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#ImageContainer').length < 1) {
			$('#ImageTable').append('<div id="ImageContainer"></div>');
		}
		$('#ImageContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 6 == 0) {
			imagehtml = '';
			imagehtml += '<div class="row" >';
		}
		imagehtml += '<div class="col-md-2 col-xs-2">';
		
		imagehtml += '<div id="ThumbContainer" style="position:relative">';
		var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
		imagehtml += '<div id="ImageThumb" class="thumbs">';
		imagehtml += '<img src="/pixsigdata' + aData.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		imagehtml += '<div class="mask">';
		imagehtml += '<div>';
		imagehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
		imagehtml += '<a class="btn default btn-sm green pix-plandtl-image-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
		imagehtml += '</div>';
		imagehtml += '</div>';
		imagehtml += '</div>';

		imagehtml += '</div>';

		imagehtml += '</div>';
		if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#ImageTable').dataTable().fnGetData().length) {
			imagehtml += '</div>';
			if ((iDisplayIndex+1) != $('#ImageTable').dataTable().fnGetData().length) {
				imagehtml += '<hr/>';
			}
			$('#ImageContainer').append(imagehtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#ImageContainer .thumbs').each(function(i) {
			$(this).height($(this).parent().width());
		});
		$('#ImageContainer .mask').each(function(i) {
			$(this).height($(this).parent().parent().width() + 2);
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurrentMediaBranchid });
		aoData.push({'name':'folderid','value':CurrentMediaFolderid });
	}
});
$('#ImageTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
$('#ImageTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
$('#ImageTable').css('width', '100%');

//SelectedDtlTable初始化
$('#SelectedDtlTable').dataTable({
	'sDom' : 't',
	'iDisplayLength' : -1,
	'aoColumns' : [ {'sTitle' : '', 'bSortable' : false, 'sWidth' : '40px' }, 
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '80px' }, 
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '60px' }, 
					{'sTitle' : '', 'bSortable' : false, 'sClass': 'autowrap' }, 
					{'sTitle' : common.view.duration, 'bSortable' : false, 'sWidth' : '60px' },
					{'sTitle' : common.view.maxtimes, 'bSortable' : false, 'sWidth' : '60px' },
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '30px' },
					{'sTitle' : '', 'bSortable' : false, 'sWidth' : '30px' }],
	'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
	'oLanguage' : { 'sZeroRecords' : common.view.empty,
					'sEmptyTable' : common.view.empty }, 
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(6)', nRow).html('<button index="' + iDisplayIndex + '" class="btn blue btn-xs pix-plandtl-update"><i class="fa fa-edit"></i></button>');
		$('td:eq(7)', nRow).html('<button index="' + iDisplayIndex + '" class="btn red btn-xs pix-plandtl-delete"><i class="fa fa-trash-o"></i></button>');
		return nRow;
	}
});

$('#DevicegridTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 20, 40, 60, 100 ],
					[ 20, 40, 60, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'devicegrid!list.action',
	'aoColumns' : [ {'sTitle' : '', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '20%' }, 
					{'sTitle' : '', 'mData' : 'devicegridid', 'bSortable' : false, 'sWidth' : '35%' },
					{'sTitle' : '', 'mData' : 'devicegridid', 'bSortable' : false, 'sWidth' : '35%' },
					{'sTitle' : '', 'mData' : 'devicegridid', 'bSortable' : false, 'sWidth' : '10%' }],
	'iDisplayLength' : 20,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		var snapshothtml = '';
		snapshothtml += '<a href="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="gridfancybox">';
		var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
		snapshothtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '" />';
		snapshothtml += '</a>';
		$('td:eq(1)', nRow).html(snapshothtml);
		var devicegridhtml = '';
		for (var i=0; i<aData.devices.length; i++) {
			devicegridhtml += aData.devices[i].terminalid + '<br/>';
		}
		$('td:eq(2)', nRow).html(devicegridhtml);
		$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-planbind-devicegrid-add">' + common.view.add + '</button>');
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$(".gridfancybox").fancybox({
			openEffect	: 'none',
			closeEffect	: 'none',
			closeBtn : false,
		});
	},
	'fnServerParams': function(aoData) { 
		if (CurrentPlan != null) {
			aoData.push({'name':'gridlayoutcode','value':CurrentPlan.gridlayoutcode });
		}
		aoData.push({'name':'devicegroupid','value':'0' });
	}
});
$('#DevicegridTable_wrapper .dataTables_filter input').addClass('form-control input-small');
$('#DevicegridTable_wrapper .dataTables_length select').addClass('form-control input-small');
$('#DevicegridTable').css('width', '100%');

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
		for (var i=0; i<aData.devicegrids.length; i++) {
			listhtml += aData.devicegrids[i].name + ' ';
		}
		$('td:eq(1)', nRow).html(listhtml);
		$('td:eq(2)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-planbind-devicegroup-add">' + common.view.add + '</button>');
		return nRow;
	},
	'fnServerParams': function(aoData) { 
		//aoData.push({'name':'branchid','value':CurrentDeviceBranchid });
		if (CurrentPlan != null) {
			aoData.push({'name':'gridlayoutcode','value':CurrentPlan.gridlayoutcode });
		}
		aoData.push({'name':'type','value':'2' });
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
	$('#MediagridDiv').css('display', '');
	$('#VideoDiv').css('display', 'none');
	$('#ImageDiv').css('display', 'none');
	$('#PageDiv').css('display', 'none');
	$('#MediagridTable').dataTable()._fnAjaxUpdate();
});
$('#nav_tab2').click(function(event) {
	$('#MediagridDiv').css('display', 'none');
	$('#VideoDiv').css('display', '');
	$('#ImageDiv').css('display', 'none');
	$('#PageDiv').css('display', 'none');
	$('#VideoTable').dataTable()._fnAjaxUpdate();
});
$('#nav_tab3').click(function(event) {
	$('#MediagridDiv').css('display', 'none');
	$('#VideoDiv').css('display', 'none');
	$('#ImageDiv').css('display', '');
	$('#PageDiv').css('display', 'none');
	$('#ImageTable').dataTable()._fnAjaxUpdate();
});
$('#nav_tab4').click(function(event) {
	$('#MediagridDiv').css('display', 'none');
	$('#VideoDiv').css('display', 'none');
	$('#ImageDiv').css('display', 'none');
	$('#PageDiv').css('display', '');
	$('#PageTable').dataTable()._fnAjaxUpdate();
});
//增加Mediagrid到SelectedDtlTable
$('body').on('click', '.pix-plandtl-mediagrid-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#MediagridTable').dataTable().fnGetData(rowIndex);
	var plandtl = {};
	plandtl.plandtlid = 0;
	plandtl.planid = CurrentPlan.planid;
	plandtl.objtype = 9;
	plandtl.objid = data.mediagridid;
	plandtl.mediagrid = data;
	plandtl.sequence = CurrentPlandtls.length + 1;
	plandtl.maxtimes = 0;
	if (plandtl.mediagrid.mediagriddtls[0].objtype == 2) {
		plandtl.duration = 10;
	} else if (plandtl.mediagrid.mediagriddtls[0].objtype == 3) {
		plandtl.duration = 30;
	} else {
		plandtl.duration = 0;
	}
	CurrentPlandtls.push(plandtl);
	refreshSelectedDtlTable();
});
//增加Video到SelectedDtlTable
$('body').on('click', '.pix-plandtl-video-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#VideoTable').dataTable().fnGetData(rowIndex);
	var plandtl = {};
	plandtl.plandtlid = 0;
	plandtl.planid = CurrentPlan.planid;
	plandtl.objtype = 3;
	plandtl.objid = data.videoid;
	plandtl.video = data;
	plandtl.sequence = CurrentPlandtls.length + 1;
	plandtl.maxtimes = 0;
	plandtl.duration = 0;
	CurrentPlandtls.push(plandtl);
	refreshSelectedDtlTable();
});
//增加Image到SelectedDtlTable
$('body').on('click', '.pix-plandtl-image-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#ImageTable').dataTable().fnGetData(rowIndex);
	var plandtl = {};
	plandtl.plandtlid = 0;
	plandtl.planid = CurrentPlan.planid;
	plandtl.objtype = 4;
	plandtl.objid = data.imageid;
	plandtl.image = data;
	plandtl.sequence = CurrentPlandtls.length + 1;
	plandtl.maxtimes = 0;
	plandtl.duration = 10;
	CurrentPlandtls.push(plandtl);
	refreshSelectedDtlTable();
});
$('body').on('click', '.pix-plandtl-update', function(event) {
	var index = $(event.target).attr('index');
	if (index == undefined) {
		index = $(event.target).parent().attr('index');
	}
	CurrentPlandtl = CurrentPlandtls[index];
	FormValidateOption.rules = {};
	if (CurrentPlandtl.duration == 0) {
		$('#PlandtlForm .plandtl-duration').css('display', 'none');
	} else {
		FormValidateOption.rules['duration'] = {};
		FormValidateOption.rules['duration']['required'] = true;
		FormValidateOption.rules['duration']['number'] = true;
		$('#PlandtlForm .plandtl-duration').css('display', '');
	}
	FormValidateOption.rules['maxtimes'] = {};
	FormValidateOption.rules['maxtimes']['required'] = true;
	FormValidateOption.rules['maxtimes']['number'] = true;
	$('#PlandtlForm').validate(FormValidateOption);

	$('#PlandtlForm input[name=duration]').val(CurrentPlandtl.duration);
	$('#PlandtlForm input[name=maxtimes]').val(CurrentPlandtl.maxtimes);
	$('#PlandtlModal').modal();
});
$('[type=submit]', $('#PlandtlModal')).on('click', function(event) {
	if ($('#PlandtlForm').valid()) {
		CurrentPlandtl.duration = $('#PlandtlForm input[name=duration]').val();
		CurrentPlandtl.maxtimes = $('#PlandtlForm input[name=maxtimes]').val();
		$('#PlandtlModal').modal('hide');
		refreshSelectedDtlTable();
	}
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
	$('#DevicegridDiv').css('display', '');
	$('#DevicegroupDiv').css('display', 'none');
	$('#DevicegridTable').dataTable()._fnAjaxUpdate();
});
$('#nav_dtab2').click(function(event) {
	$('#DevicegridDiv').css('display', 'none');
	$('#DevicegroupDiv').css('display', '');
	$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
});
//增加Devicegrid到SelectedBindTable
$('body').on('click', '.pix-planbind-devicegrid-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#DevicegridTable').dataTable().fnGetData(rowIndex);
	if (CurrentPlanbinds.filter(function (el) {
		return el.bindtype == 3 && el.bindid == data.devicegridid;
	}).length > 0) {
		return;
	}
	var planbind = {};
	planbind.planbindid = 0;
	planbind.planid = CurrentPlan.planid;
	planbind.bindtype = 3;
	planbind.bindid = data.devicegridid;
	planbind.devicegrid = data;
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
				$('#MediagridTable').dataTable()._fnAjaxUpdate();
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
	$('input[name="plan.startdate.unlimited"]').click(function(e) {
		if ($('input[name="plan.startdate.unlimited"]').attr('checked')) {
			$('input[name="plan.startdate"]').parent().css('display', 'none');
		} else {
			$('input[name="plan.startdate"]').parent().css('display', '');
			$('input[name="plan.startdate"]').val(new Date().format('yyyy') + '-' + new Date().format('MM') + '-' + new Date().format('dd'));
		}
	});  
	$('input[name="plan.enddate.unlimited"]').click(function(e) {
		if ($('input[name="plan.enddate.unlimited"]').attr('checked')) {
			$('input[name="plan.enddate"]').parent().css('display', 'none');
		} else {
			$('input[name="plan.enddate"]').parent().css('display', '');
			$('input[name="plan.enddate"]').val(new Date().format('yyyy') + '-' + new Date().format('MM') + '-' + new Date().format('dd'));
		}
	});  
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
	if (CurrentPlan.startdate == '1970-01-01') {
		$('input[name="plan.startdate.unlimited"]').attr('checked', 'checked');
		$('input[name="plan.startdate.unlimited"]').parent().addClass('checked');
		$('input[name="plan.startdate"]').parent().css('display', 'none');
	} else {
		$('input[name="plan.startdate.unlimited"]').removeAttr('checked');
		$('input[name="plan.startdate.unlimited"]').parent().removeClass('checked');
		$('input[name="plan.startdate"]').parent().css('display', '');
		$('input[name="plan.startdate"]').val(CurrentPlan.startdate);
	}
	if (CurrentPlan.enddate == '2037-01-01') {
		$('input[name="plan.enddate.unlimited"]').attr('checked', 'checked');
		$('input[name="plan.enddate.unlimited"]').parent().addClass('checked');
		$('input[name="plan.enddate"]').parent().css('display', 'none');
	} else {
		$('input[name="plan.enddate.unlimited"]').removeAttr('checked');
		$('input[name="plan.enddate.unlimited"]').parent().removeClass('checked');
		$('input[name="plan.enddate"]').parent().css('display', '');
		$('input[name="plan.enddate"]').val(CurrentPlan.enddate);
	}
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
	initMediaBranchTree();
}

function initData2() {
	refreshMediaTable();
	refreshSelectedDtlTable();
}

function initTab3() {
}

function initData3() {
	$('#DevicegridTable').dataTable()._fnAjaxUpdate();
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
		CurrentPlandtls[i].page = undefined;
		CurrentPlandtls[i].video = undefined;
		CurrentPlandtls[i].image = undefined;
		CurrentPlandtls[i].mediagrid = undefined;
	}
	for (var i=0; i<CurrentPlanbinds.length; i++) {
		CurrentPlanbinds[i].devicegrid = undefined;
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
	if (CurrentPlan.planid == 0) {
		CurrentPlan.gridlayoutcode = $('input[name="plan.gridlayoutcode"]:checked').val();
		CurrentPlandtls = [];
		CurrentPlanbinds = [];
	}
	if ($('input[name="plan.startdate.unlimited"]').attr('checked')) {
		CurrentPlan.startdate = '1970-01-01';
	} else {
		CurrentPlan.startdate = $('input[name="plan.startdate"]').val();
	}
	if ($('input[name="plan.enddate.unlimited"]').attr('checked')) {
		CurrentPlan.enddate = '2037-01-01';
	} else {
		CurrentPlan.enddate = $('input[name="plan.enddate"]').val();
	}
	if ($('input[name="plan.fulltime"]').attr('checked')) {
		CurrentPlan.starttime = '00:00:00';
		CurrentPlan.endtime = '00:00:00';
	} else {
		CurrentPlan.starttime = $('input[name="plan.starttime"]').val();
		CurrentPlan.endtime = $('input[name="plan.endtime"]').val();
	}
	if (parseInt(CurrentPlan.startdate.replace(/\-/g,'')) > parseInt(CurrentPlan.enddate.replace(/\-/g,''))) {
		bootbox.alert(common.tips.date_error);
		return false;
	}
	console.log(CurrentPlan);
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

function refreshMediaTable() {
	$('#MediagridTable').dataTable()._fnAjaxUpdate();
	$('#VideoTable').dataTable()._fnAjaxUpdate();
	$('#ImageTable').dataTable()._fnAjaxUpdate();
	//$('#PageTable').dataTable()._fnAjaxUpdate();
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

		if (plandtl.objtype == 2) {
			mediatype = common.view.solopage;
			medianame = plandtl.page.name;
			thumbwidth = plandtl.page.width > plandtl.page.height? 100 : 100*plandtl.page.width/plandtl.page.height;
			thumbnail = '/pixsigdata' + plandtl.page.snapshot;
		} else if (plandtl.objtype == 3) {
			mediatype = common.view.solovideo;
			medianame = plandtl.video.name;
			thumbwidth = plandtl.video.width > plandtl.video.height? 100 : 100*plandtl.video.width/plandtl.video.height;
			thumbnail = '/pixsigdata' + plandtl.video.thumbnail;
		} else if (plandtl.objtype == 4) {
			mediatype = common.view.soloimage;
			medianame = plandtl.image.name;
			thumbwidth = plandtl.image.width > plandtl.image.height? 100 : 100*plandtl.image.width/plandtl.image.height;
			thumbnail = '/pixsigdata' + plandtl.image.thumbnail;
		} else if (plandtl.objtype == 9) {
			mediatype = common.view.mediagrid;
			medianame = plandtl.mediagrid.name;
			thumbwidth = plandtl.mediagrid.width > plandtl.mediagrid.height? 100 : 100*plandtl.mediagrid.width/plandtl.mediagrid.height;
			thumbnail = '/pixsigdata' + plandtl.mediagrid.snapshot;
		}
		if (thumbnail != '') {
			thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + medianame + '"></div>';
		}
		var duration = plandtl.duration > 0? transferIntToTime(plandtl.duration) : '-';
		var maxtimes = plandtl.maxtimes > 0? plandtl.maxtimes : '-';
		$('#SelectedDtlTable').dataTable().fnAddData([plandtl.sequence, mediatype, thumbhtml, medianame, duration, maxtimes, 0, 0]);
	}
}

function refreshSelectedBindTable() {
	$('#SelectedBindTable').dataTable().fnClearTable();
	for (var i=0; i<CurrentPlanbinds.length; i++) {
		var planbind = CurrentPlanbinds[i];
		var bindtype = '';
		var bindname = '';

		if (planbind.bindtype == 2) {
			bindtype = common.view.devicegridgroup;
			bindname = planbind.devicegroup.name;
		} else if (planbind.bindtype == 3) {
			bindtype = common.view.devicegrid;
			bindname = planbind.devicegrid.name;
		}
		$('#SelectedBindTable').dataTable().fnAddData([(i+1), bindtype, bindname, 0]);
	}
}


function initMediaBranchTree() {
	$.ajax({
		type : 'POST',
		url : 'branch!list.action',
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var branches = data.aaData;
				CurrentMediaBranchid = branches[0].branchid;
				
				if ( $("#MediaBranchTreeDiv").length > 0 ) {
					if (branches[0].children.length == 0) {
						$('#MediaBranchTreeDiv').css('display', 'none');
						CurrentMediaFolderid = null;
						initMediaFolderTree();
						refreshMediaTable();
					} else {
						var branchTreeDivData = [];
						createBranchTreeData(branches, branchTreeDivData);
						$('#MediaBranchTreeDiv').jstree('destroy');
						$('#MediaBranchTreeDiv').jstree({
							'core' : {
								'multiple' : false,
								'data' : branchTreeDivData
							},
							'plugins' : ['unique'],
						});
						$('#MediaBranchTreeDiv').on('loaded.jstree', function() {
							$('#MediaBranchTreeDiv').jstree('select_node', CurrentMediaBranchid);
						});
						$('#MediaBranchTreeDiv').on('select_node.jstree', function(event, data) {
							CurrentMediaBranchid = data.instance.get_node(data.selected[0]).id;
							CurrentMediaFolderid = null;
							initMediaFolderTree();
							refreshMediaTable();
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


function initMediaFolderTree() {
	$.ajax({
		type : 'POST',
		url : 'folder!list.action',
		data : {
			branchid: CurrentMediaBranchid
		},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var folders = data.aaData;
				CurrentMediaFolderid = folders[0].folderid;
				
				if ( $("#MediaFolderTreeDiv").length > 0 ) {
					var folderTreeDivData = [];
					createFolderTreeData(folders, folderTreeDivData);
					$('#MediaFolderTreeDiv').jstree('destroy');
					$('#MediaFolderTreeDiv').jstree({
						'core' : {
							'multiple' : false,
							'data' : folderTreeDivData
						},
						'plugins' : ['unique', 'types'],
						'types' : {
							'default' : { 'icon' : 'fa fa-folder icon-state-warning icon-lg' }
						},
					});
					$('#MediaFolderTreeDiv').on('loaded.jstree', function() {
						$('#MediaFolderTreeDiv').jstree('select_node', CurrentMediaFolderid);
					});
					$('#MediaFolderTreeDiv').on('select_node.jstree', function(event, data) {
						CurrentMediaFolderid = data.instance.get_node(data.selected[0]).id;
						refreshMediaTable();
					});
				}
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
	function createFolderTreeData(folders, treeData) {
		if (folders == null) return;
		for (var i=0; i<folders.length; i++) {
			treeData[i] = {};
			treeData[i].id = folders[i].folderid;
			treeData[i].text = folders[i].name;
			treeData[i].state = {
				opened: true,
			}
			treeData[i].children = [];
			createFolderTreeData(folders[i].children, treeData[i].children);
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
