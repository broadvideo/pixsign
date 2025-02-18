var myurls = {
	'bundle.list' : 'bundle!list.action',
	'bundle.add' : 'bundle!add.action',
	'bundle.update' : 'bundle!update.action',
	'bundle.delete' : 'bundle!delete.action',
	'bundle.design' : 'bundle!design.action',
	'bundle.push' : 'bundle!push.action',
	'templet.list' : 'templet!list.action',
	'image.list' : 'image!list.action',
	'device.list' : 'device!list.action',
	'devicegroup.list' : 'devicegroup!list.action',
};

var CurrentBundleid = 0;
var CurrentBundle;
var CurrentBundledtl;
var CurrentSubBundles;

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

var BundleTree = new BranchTree($('#BundlePortlet'));
$("#MyTable thead").css("display", "none");
$("#MyTable tbody").css("display", "none");
$('#MyTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 10, 20, 30, 40 ],
						[ 10, 20, 30, 40 ] 
						],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : myurls['bundle.list'],
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'bundleid', 'bSortable' : false }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#BundleContainer').length < 1) {
			$('#MyTable').append('<div id="BundleContainer"></div>');
		}
		$('#BundleContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		var bundlehtml = '';
		bundlehtml += '<div class="row" >';
		bundlehtml += '<div class="col-md-12 col-xs-12">';
		bundlehtml += '<h3 class="pixtitle">' + aData.name + '</h3>';
		if (aData.reviewflag == 0) {
			bundlehtml += '<h6><span class="label label-sm label-default">' + common.view.review_wait + '</span></h6>';
		} else if (aData.reviewflag == 1) {
			bundlehtml += '<h6><span class="label label-sm label-success">' + common.view.review_passed + '</span></h6>';
		} else if (aData.reviewflag == 2) {
			bundlehtml += '<h6><span class="label label-sm label-danger">' + common.view.review_rejected + '</span></h6>';
		}
		bundlehtml += '<div privilegeid="101010">';
		bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm yellow pix-subbundle-add"><i class="fa fa-plus"></i> ' + common.view.subbundle + '</a>';
		if (aData.reviewflag == 1) {
			bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm blue pix-push"><i class="fa fa-desktop"></i> ' + common.view.device + '</a>';
			bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
			bundlehtml += '<a href="bundle!export.action?bundleid=' + aData.bundleid + '" data-id="' + iDisplayIndex + '" class="btn default btn-sm green pix-export"><i class="fa fa-download"></i> ' + common.view.export + '</a>';
		}
		bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a> </div>';
		bundlehtml += '</div>';
		bundlehtml += '</div>';

		bundlehtml += '<div class="row" >';
		bundlehtml += '<div class="col-md-4 col-xs-6">';
		bundlehtml += '<a href="javascript:;" bundleid="' + aData.bundleid + '" class="fancybox">';
		bundlehtml += '<div class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			bundlehtml += '<img src="/pixsigndata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		}
		bundlehtml += '</div></a>';
		bundlehtml += '<div privilegeid="101010">';
		bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-bundle"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		bundlehtml += '</div>';
		bundlehtml += '</div>';
		bundlehtml += '<div class="col-md-8 col-xs-6">';
		for (var i=0; i<aData.subbundles.length; i++) {
			if (i % 4 == 0) {
				bundlehtml += '<div class="row" >';
			}
			bundlehtml += '<div class="col-md-3 col-xs-3">';
			bundlehtml += '<h5 class="pixtitle">' + aData.subbundles[i].name + '</h5>';
			bundlehtml += '<a href="javascript:;" bundleid="' + aData.subbundles[i].bundleid + '" sub-id="' + i + '" class="fancybox">';
			bundlehtml += '<div class="thumbs">';
			if (aData.subbundles[i].snapshot != null) {
				var subthumbwidth = aData.subbundles[i].width > aData.subbundles[i].height? 100 : 100*aData.subbundles[i].width/aData.subbundles[i].height;
				bundlehtml += '<img src="/pixsigndata' + aData.subbundles[i].snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + subthumbwidth + '%" />';
			}
			bundlehtml += '</div></a>';
			bundlehtml += '<div privilegeid="101010">';
			bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs blue pix-bundle"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
			bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
			bundlehtml += '</div>';
			bundlehtml += '</div>';
			if ((i+1) % 4 == 0 || (i+1) == aData.subbundles.length) {
				bundlehtml += '</div>';
			}
			
		}
		bundlehtml += '</div>';
		bundlehtml += '</div>';

		bundlehtml += '<hr/>';
		$('#BundleContainer').append(bundlehtml);
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('.thumbs').each(function(i) {
			$(this).width($(this).parent().closest('div').width());
			$(this).height($(this).parent().closest('div').width());
		});
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
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':BundleTree.branchid });
		aoData.push({'name':'touchflag','value':'1' });
		aoData.push({'name':'homeflag','value':'1' });
	}
});
jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').select2();


$('#TempletTable thead').css('display', 'none');
$('#TempletTable tbody').css('display', 'none');
$('#TempletTable').dataTable({
	'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 18, 30, 48, 96 ],
					  [ 18, 30, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : myurls['templet.list'],
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'templetid', 'bSortable' : false }],
	'iDisplayLength' : 12,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#TempletContainer').length < 1) {
			$('#TempletTable').append('<div id="TempletContainer"></div>');
		}
		$('#TempletContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		var templethtml = '';
		templethtml += '<div class="row" >';
		templethtml += '<div class="col-md-4 col-xs-6">';
		templethtml += '<a href="javascript:;" templetid="' + aData.templetid + '" class="fancybox">';
		templethtml += '<div class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			templethtml += '<img src="/pixsigndata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
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
		templethtml += '<div class="col-md-8 col-xs-6">';
		for (var i=0; i<aData.subtemplets.length; i++) {
			if (i % 4 == 0) {
				templethtml += '<div class="row" >';
			}
			templethtml += '<div class="col-md-3 col-xs-3">';
			templethtml += '<h5 class="pixtitle">' + aData.subtemplets[i].name + '</h5>';
			templethtml += '<a href="javascript:;" templetid="' + aData.subtemplets[i].templetid + '" sub-id="' + i + '" class="fancybox">';
			templethtml += '<div class="thumbs">';
			if (aData.subtemplets[i].snapshot != null) {
				var subthumbwidth = aData.subtemplets[i].width > aData.subtemplets[i].height? 100 : 100*aData.subtemplets[i].width/aData.subtemplets[i].height;
				templethtml += '<img src="/pixsigndata' + aData.subtemplets[i].snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + subthumbwidth + '%" />';
			}
			templethtml += '</div></a>';
			templethtml += '</div>';
			if ((i+1) % 4 == 0 || (i+1) == aData.subtemplets.length) {
				templethtml += '</div>';
			}
			
		}
		templethtml += '</div>';
		templethtml += '</div>';

		templethtml += '<hr/>';
		$('#TempletContainer').append(templethtml);
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#TempletContainer .thumbs').each(function(i) {
			$(this).width($(this).parent().closest('div').width());
			$(this).height($(this).parent().closest('div').width());
		});
		$('#TempletContainer .fancybox').each(function(index,item) {
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
		var templetflag = $('#MyEditForm input[name="templetflag"]:checked').val();
		var ratio = $('select[name="bundle.ratio"]').val();
		aoData.push({'name':'templetflag','value':templetflag });
		aoData.push({'name':'touchflag','value':'1' });
		aoData.push({'name':'homeflag','value':'1' });
		aoData.push({'name':'ratio','value':ratio });
	}
});
jQuery('#TempletTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#TempletTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#TempletTable_wrapper .dataTables_length select').select2();

function refreshTemplet() {
	$('#MyEditForm input[name="bundle.templetid"]').val('0');
	var templetflag = $('#MyEditForm input[name="templetflag"]:checked').val();
	if (templetflag == 0) {
		$('.templet-ctrl').css('display', 'none');
	} else {
		$('.templet-ctrl').css('display', '');
		$('#TempletTable').dataTable().fnDraw(true);
	}
}


function refreshFromBundleTable() {
	var width = 100/(CurrentSubBundles.length+1);
	var fromBundleTableHtml = '';
	fromBundleTableHtml += '<tr>';
	fromBundleTableHtml += '<td style="padding: 0px 20px 0px 0px;" width="' + width + '%">';
	fromBundleTableHtml += '<div class="thumbs" style="width:100px; height:100px;">';
	fromBundleTableHtml += '</div></td>';
	for (var i=0; i<CurrentSubBundles.length; i++) {
		var frombundle = CurrentSubBundles[i];
		fromBundleTableHtml += '<td style="padding: 0px 20px 0px 0px;" width="' + width + '%">';
		fromBundleTableHtml += '<a href="javascript:;" frombundleid="' + frombundle.bundleid + '" class="fancybox">';
		fromBundleTableHtml += '<div class="thumbs" style="width:100px; height:100px;">';
		if (frombundle.snapshot != null) {
			var thumbwidth = frombundle.width > frombundle.height? 100 : 100*frombundle.width/frombundle.height;
			fromBundleTableHtml += '<img src="/pixsigndata' + frombundle.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + frombundle.name + '" />';
		}
		fromBundleTableHtml += '</div></a></td>';
	}
	fromBundleTableHtml += '</tr>';
	fromBundleTableHtml += '<tr>';
	fromBundleTableHtml += '<td>';
	fromBundleTableHtml += '<label class="radio-inline">';
	fromBundleTableHtml += '<input type="radio" name="frombundleid" value="0" checked>';
	fromBundleTableHtml += common.view.blank + '</label>';
	fromBundleTableHtml += '</td>';
	for (var i=0; i<CurrentSubBundles.length; i++) {
		var frombundle = CurrentSubBundles[i];
		fromBundleTableHtml += '<td>';
		fromBundleTableHtml += '<label class="radio-inline">';
		fromBundleTableHtml += '<input type="radio" name="frombundleid" value="' + frombundle.bundleid + '">';
		fromBundleTableHtml += frombundle.name + '</label>';
		fromBundleTableHtml += '</td>';
	}
	fromBundleTableHtml += '</tr>';
	$('#FromBundleTable').html(fromBundleTableHtml);
	$('#FromBundleTable').width(120 * (CurrentSubBundles.length+1));

	$('#FromBundleTable .fancybox').each(function(index,item) {
		$(this).click(function() {
			var bundleid = $(this).attr('frombundleid');
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


OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();

FormValidateOption.rules = {};
FormValidateOption.rules['homeidletime'] = {};
FormValidateOption.rules['homeidletime']['required'] = true;
FormValidateOption.rules['homeidletime']['number'] = true;
FormValidateOption.submitHandler = null;
$('#BundleOptionForm').validate(FormValidateOption);

$('#MyEditModal').on('shown.bs.modal', function (e) {
	refreshTemplet();
})

$('#MyEditForm input[name="templetflag"]').change(function(e) {
	refreshTemplet();
});

$('#MyEditForm select[name="bundle.ratio"]').on('change', function(e) {
	refreshTemplet();
});	

$('body').on('click', '.pix-add', function(event) {
	var action = myurls['bundle.add'];
	refreshForm('MyEditForm');
	$('#MyEditForm input[name="bundle.branchid"').val(BundleTree.branchid);
	$('#MyEditForm').attr('action', action);
	CurrentBundle = null;
	CurrentBundleid = 0;
	$('#MyEditModal').modal();
});			
$('[type=submit]', $('#MyEditModal')).on('click', function(event) {
	if ($('#MyEditForm').valid()) {
		$.ajax({
			type : 'POST',
			url : $('#MyEditForm').attr('action'),
			data : $('#MyEditForm').serialize(),
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#MyEditModal').modal('hide');
					bootbox.alert(common.tips.success);
					$('#MyTable').dataTable()._fnAjaxUpdate();
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

$('body').on('click', '.pix-subbundle-add', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentBundle = $('#MyTable').dataTable().fnGetData(index);
	CurrentBundleid = CurrentBundle.bundleid;
	CurrentSubBundles = CurrentBundle.subbundles;
	var formdata = new Object();
	formdata['bundle.name'] = '';
	formdata['bundle.homebundleid'] = CurrentBundleid;
	formdata['bundle.homeflag'] = '0';
	formdata['bundle.ratio'] = CurrentBundle.ratio;
	formdata['bundle.branchid'] = PageTree.branchid;
	$('#SubbundleForm').loadJSON(formdata);
	refreshFromBundleTable();
	$('#SubbundleModal').modal();
});			
$('[type=submit]', $('#SubbundleModal')).on('click', function(event) {
	$.ajax({
		type : 'POST',
		url : myurls['bundle.add'],
		data : $('#SubbundleForm').serialize(),
		success : function(data, status) {
			if (data.errorcode == 0) {
				$('#SubbundleModal').modal('hide');
				bootbox.alert(common.tips.success);
				$('#MyTable').dataTable()._fnAjaxUpdate();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
});

$('body').on('click', '.pix-sync', function(event) {
	var target = $(event.target);
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		target = $(event.target).parent();
		index = $(event.target).parent().attr('data-id');
	}
	CurrentBundle = $('#MyTable').dataTable().fnGetData(index);
	CurrentBundleid = CurrentBundle.bundleid;
	bootbox.confirm(common.tips.synclayout, function(result) {
		if (result == true) {
			$.ajax({
				type : 'GET',
				url : 'bundle!sync.action',
				cache: false,
				data : {
					bundleid: CurrentBundleid,
				},
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

$('body').on('click', '.pix-delete', function(event) {
	var index = $(event.target).attr('data-id');
	var subid = $(event.target).attr('sub-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
		subid = $(event.target).parent().attr('sub-id');
	}
	CurrentBundle = $('#MyTable').dataTable().fnGetData(index);
	var bundleid = CurrentBundle.bundleid;
	var name = CurrentBundle.name;
	CurrentSubBundles = CurrentBundle.subbundles;
	if (subid != undefined) {
		bundleid = CurrentBundle.subbundles[subid].bundleid;
		name = CurrentBundle.subbundles[subid].name;
	}

	bootbox.confirm(common.tips.remove + name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : myurls['bundle.delete'],
				cache: false,
				data : {
					'bundle.bundleid': bundleid
				},
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#MyTable').dataTable()._fnAjaxUpdate();
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


//在列表页面中点击内容包设�?
$('body').on('click', '.pix-bundle', function(event) {
	var index = $(event.target).attr('data-id');
	var subid = $(event.target).attr('sub-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
		subid = $(event.target).parent().attr('sub-id');
	}
	CurrentBundle = $('#MyTable').dataTable().fnGetData(index);
	var bundleid = CurrentBundle.bundleid;
	CurrentSubBundles = CurrentBundle.subbundles;
	if (subid != undefined) {
		bundleid = CurrentBundle.subbundles[subid].bundleid;
	}

	$.ajax({
		type : 'GET',
		url : 'bundle!get.action',
		data : {bundleid: bundleid},
		success : function(data, status) {
			if (data.errorcode == 0) {
				CurrentBundle = data.bundle;
				CurrentBundleid = CurrentBundle.bundleid;
				CurrentBundledtl = CurrentBundle.bundledtls[0];
				for (var i=0; i<CurrentBundle.bundledtls.length; i++) {
					var bundledtl = CurrentBundle.bundledtls[i];
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
					if (bundledtl.referflag == 0 && bundledtl.objtype == 1 && bundledtl.medialist != null) {
						bundledtl.medialist0 = bundledtl.medialist;
					}
					if (bundledtl.referflag == 1 && bundledtl.objtype == 1 && bundledtl.medialist != null) {
						bundledtl.medialist1 = bundledtl.medialist;
					}
					if (bundledtl.referflag == 0 && bundledtl.objtype == 2 &&  bundledtl.text != null) {
						bundledtl.text0 = bundledtl.text;
					}
					if (bundledtl.referflag == 1 && bundledtl.objtype == 2 && bundledtl.text != null) {
						bundledtl.text1 = bundledtl.text;
					}
					if (bundledtl.referflag == 0 && bundledtl.objtype == 3 &&  bundledtl.stream != null) {
						bundledtl.stream0 = bundledtl.stream;
					}
					if (bundledtl.referflag == 1 && bundledtl.objtype == 3 && bundledtl.stream != null) {
						bundledtl.stream1 = bundledtl.stream;
					}
					if (bundledtl.referflag == 0 && bundledtl.objtype == 5 &&  bundledtl.widget != null) {
						bundledtl.widget0 = bundledtl.widget;
					}
					if (bundledtl.referflag == 1 && bundledtl.objtype == 5 && bundledtl.widget != null) {
						bundledtl.widget1 = bundledtl.widget;
					}

					if (bundledtl.referflag == 1 && bundledtl.objtype == 6 && bundledtl.dvb != null) {
						bundledtl.dvb1 = bundledtl.dvb;
					}

					if (bundledtl.referflag == 0 && bundledtl.objtype == 7 &&  bundledtl.rss != null) {
						bundledtl.rss0 = bundledtl.rss;
					}
					if (bundledtl.referflag == 1 && bundledtl.objtype == 7 && bundledtl.rss != null) {
						bundledtl.rss1 = bundledtl.rss;
					}
				}
				
				initWizard();
				$('#BundleModal').modal();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
});

$('#PushModal').on('shown.bs.modal', function (e) {
	initDeviceBranchTree();
})



var SelectedDeviceList = [];
var SelectedDevicegroupList = [];
var CurrentDeviceBranchid;

function initDeviceBranchTree() {
	$("#DeviceBranchTreeDiv").jstree('destroy');
	$("#DeviceBranchTreeDiv").jstree({
		'core' : {
			'multiple' : false,
			'data' : {
				'url': function(node) {
					return 'branch!listnode.action';
				},
				'data': function(node) {
					return {
						'id': node.id,
					}
				}
			}
		},
		'plugins' : ['unique'],
	});
	$("#DeviceBranchTreeDiv").on('loaded.jstree', function() {
		CurrentDeviceBranchid = $("#DeviceBranchTreeDiv").jstree(true).get_json('#')[0].id;
		$("#DeviceBranchTreeDiv").jstree('select_node', CurrentDeviceBranchid);
	});
	$("#DeviceBranchTreeDiv").on('select_node.jstree', function(event, data) {
		CurrentDeviceBranchid = data.instance.get_node(data.selected[0]).id;
		$('#DeviceTable').dataTable()._fnAjaxUpdate();
		$('#DeviceGroupTable').dataTable()._fnAjaxUpdate();
	});
}

//编制计划对话框中的设备table初始�?
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
		aoData.push({'name':'branchid','value':CurrentDeviceBranchid });
		aoData.push({'name':'devicegroupid','value':'0' });
		aoData.push({'name':'type','value':'1' });
	}
});
jQuery('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');

//编制计划对话框中的设备组table初始�?
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
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurrentDeviceBranchid });
		aoData.push({'name':'type','value':'1' });
	}
});
jQuery('#DeviceGroupTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#DeviceGroupTable_wrapper .dataTables_length select').addClass('form-control input-small');

$('#nav_dtab1').click(function(event) {
	$('#DeviceDiv').css('display', '');
	$('#DeviceGroupDiv').css('display', 'none');
	$('#DeviceTable').dataTable()._fnAjaxUpdate();
});
$('#nav_dtab2').click(function(event) {
	$('#DeviceDiv').css('display', 'none');
	$('#DeviceGroupDiv').css('display', '');
	$('#DeviceGroupTable').dataTable()._fnAjaxUpdate();
});

//编制计划对话框中的右侧设备选择列表初始�?
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

//编制计划对话框中的右侧设备组选择列表初始�?
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

//编制计划对话框中，删除设备列表某�?
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

//在列表页面中点击终端
$('body').on('click', '.pix-push', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentBundle = $('#MyTable').dataTable().fnGetData(index);
	CurrentBundleid = CurrentBundle.bundleid;
	
	$('#SelectedDeviceTable').dataTable().fnClearTable();
	$('#SelectedDevicegroupTable').dataTable().fnClearTable();
	SelectedDeviceList = [];
	SelectedDevicegroupList = [];
	$('#PushModal').modal();
});

//在终端对话框中进行提�?
$('[type=submit]', $('#PushModal')).on('click', function(event) {
	$.ajax({
		type : 'POST',
		url : myurls['bundle.push'],
		data : '{"bundle": { "bundleid":' + CurrentBundle.bundleid + '}, "devices":' + $.toJSON(SelectedDeviceList) + ', "devicegroups":' + $.toJSON(SelectedDevicegroupList) + '}',
		dataType : 'json',
		contentType : 'application/json;charset=utf-8',
		beforeSend: function ( xhr ) {
			Metronic.startPageLoading({animate: true});
		},
		success : function(data, status) {
			Metronic.stopPageLoading();
			$('#PushModal').modal('hide');
			if (data.errorcode == 0) {
				bootbox.alert(common.tips.success);
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			$('#PushModal').modal('hide');
			console.log('failue');
		}
	});

	event.preventDefault();
});	

