var myurls = {
	'common.list' : 'mediagrid!list.action',
	'common.add' : 'mediagrid!add.action',
	'common.update' : 'mediagrid!update.action',
	'common.delete' : 'mediagrid!delete.action',
	'mediagrid.dtllist' : 'mediagrid!dtllist.action',
	'mediagrid.design' : 'mediagrid!design.action',
	'video.list' : 'video!list.action',
	'image.list' : 'image!list.action',
};

var CurrentMediagridid = 0;
var CurrentMediagrid;
var CurrentMediagriddtl;
var CurrentFolderid = 0;

$(window).resize(function(e) {
	if (CurrentMediagrid != null && e.target == this) {
		var width = Math.floor($("#MediagridDiv").parent().width());
		var scale = CurrentMediagrid.width / width;
		var height = CurrentMediagrid.height / scale;
		$("#MediagridDiv").css("width" , width);
		$("#MediagridDiv").css("height" , height);
	}
	for (var i=0; i<$('#MyTable').dataTable().fnGetData().length; i++) {
		var mediagrid = $('#MyTable').dataTable().fnGetData(i);
		redrawMediagridPreview($('#MediagridDiv-' + mediagrid.mediagridid), mediagrid, Math.floor($('#MediagridDiv-' + mediagrid.mediagridid).parent().parent().width()));
	}
});

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

$("#MyTable thead").css("display", "none");
$("#MyTable tbody").css("display", "none");
var mediagridhtml = '';
var oTable = $('#MyTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 15, 30, 70, 100 ],
						[ 15, 30, 70, 100 ] 
						],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : myurls['common.list'],
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'mediagridid', 'bSortable' : false }],
	'iDisplayLength' : 15,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#MediagridContainer').length < 1) {
			$('#MyTable').append('<div id="MediagridContainer"></div>');
		}
		$('#MediagridContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 3 == 0) {
			mediagridhtml = '';
			mediagridhtml += '<div class="row" >';
		}
		mediagridhtml += '<div class="col-md-4 col-xs-4">';
		mediagridhtml += '<h3 class="pixtitle">' + aData.name + '</h3>';
		mediagridhtml += '<h6><span class="label label-sm label-info">' + aData.xcount + 'x' + aData.ycount + '</span> ';
		if (aData.ratio == 1) {
			mediagridhtml += '<span class="label label-sm label-info">' + common.view.ratio_1 + '</span>';
		} else if (aData.ratio == 2) {
			mediagridhtml += '<span class="label label-sm label-success">' + common.view.ratio_2 + '</span>';
		}
		if (aData.status == 0) {
			mediagridhtml += ' <span class="label label-sm label-warning">' + common.view.status_0 + '</span></h6>';
		} else if (aData.status == 1) {
			mediagridhtml += ' <span class="label label-sm label-success">' + common.view.status_1 + '</span></h6>';
		} else {
			mediagridhtml += ' <span class="label label-sm label-default">' + common.view.unknown + '</span></h6>';
		}
		mediagridhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="fancybox">';
		mediagridhtml += '<div id="MediagridDiv-'+ aData.mediagridid + '"></div></a>';
		mediagridhtml += '<div privilegeid="101010">';
		mediagridhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-mediagrid"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		mediagridhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
		mediagridhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a> </div>';

		mediagridhtml += '</div>';
		if ((iDisplayIndex+1) % 3 == 0 || (iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
			mediagridhtml += '</div>';
			if ((iDisplayIndex+1) != $('#MyTable').dataTable().fnGetData().length) {
				mediagridhtml += '<hr/>';
			}
			$('#MediagridContainer').append(mediagridhtml);
		}
		if ((iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
			for (var i=0; i<$('#MyTable').dataTable().fnGetData().length; i++) {
				var mediagrid = $('#MyTable').dataTable().fnGetData(i);
				redrawMediagridPreview($('#MediagridDiv-' + mediagrid.mediagridid), mediagrid, Math.floor($('#MediagridDiv-' + mediagrid.mediagridid).parent().parent().width()));
				$('.fancybox').each(function(index,item) {
					$(this).click(function() {
						var index = $(this).attr('data-id');
						var mediagrid = $('#MyTable').dataTable().fnGetData(index);
						$.fancybox({
					        padding : 0,
					        content: '<div id="MediagridPreview"></div>',
					    });
						redrawMediagridPreview($('#MediagridPreview'), mediagrid, 800);
					    return false;
					})
				});
			}
		}
		return nRow;
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurBranchid });
	}
});
jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').select2();

$.ajax({
	type : 'POST',
	url : 'gridlayout!list.action',
	data : {},
	success : function(data, status) {
		if (data.errorcode == 0) {
			var gridlayouts = data.aaData;
			var gridlayoutTableHtml = '';
			gridlayoutTableHtml += '<tr>';
			for (var i=0; i<gridlayouts.length; i++) {
				gridlayoutTableHtml += '<td style="padding: 0px 20px 0px 0px;"><div id="GridlayoutDiv-' + gridlayouts[i].gridlayoutid + '"></div></td>';
			}
			gridlayoutTableHtml += '</tr>';
			gridlayoutTableHtml += '<tr>';
			for (var i=0; i<gridlayouts.length; i++) {
				gridlayoutTableHtml += '<td>';
				gridlayoutTableHtml += '<label class="radio-inline">';
				if (i == 0) {
					gridlayoutTableHtml += '<input type="radio" name="mediagrid.gridlayoutcode" value="' + gridlayouts[i].gridlayoutcode + '" checked>';
				} else {
					gridlayoutTableHtml += '<input type="radio" name="mediagrid.gridlayoutcode" value="' +gridlayouts[i].gridlayoutcode + '">';
				}
				if (gridlayouts[i].ratio == 1) {
					gridlayoutTableHtml += gridlayouts[i].xcount + 'x' + gridlayouts[i].ycount + '(16:9)';
				} else {
					gridlayoutTableHtml += gridlayouts[i].xcount + 'x' + gridlayouts[i].ycount + '(9:16)';
				}
				gridlayoutTableHtml += '</label></td>';
			}
			gridlayoutTableHtml += '</tr>';
			$('#GridlayoutTable').html(gridlayoutTableHtml);
			for (var i=0; i<gridlayouts.length; i++) {
				var gridlayout = gridlayouts[i];
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

function redrawMediagrid(div, mediagrid, mediagriddtl) {
	if (mediagriddtl != null && (mediagriddtl.xcount > 1 || mediagriddtl.ycount > 1)) {
		$('.page-ctrl').css('display', 'none');
		$('.bundle-ctrl').css('display', 'none');
	} else {
		$('.page-ctrl').css('display', '');
		$('.bundle-ctrl').css('display', '');
	}
	div.empty();
	div.css('position', 'relative');
	div.css('margin-left', 'auto');
	div.css('margin-right', 'auto');
	div.css('border', '1px solid #000');
	for (var i=0; i<mediagrid.mediagriddtls.length; i++) {
		div.append('<div id="MediagriddtlDiv' + mediagrid.mediagriddtls[i].mediagriddtlid + '"></div>');
		if (mediagriddtl != null && mediagriddtl.mediagriddtlid == mediagrid.mediagriddtls[i].mediagriddtlid) {
			redrawMediagriddtl($('#MediagriddtlDiv' + mediagrid.mediagriddtls[i].mediagriddtlid), mediagrid, mediagrid.mediagriddtls[i], true);
		} else {
			redrawMediagriddtl($('#MediagriddtlDiv' + mediagrid.mediagriddtls[i].mediagriddtlid), mediagrid, mediagrid.mediagriddtls[i], false);
		}
	}
	for (var i=1; i<mediagrid.xcount; i++) {
		var html = '<div style="position:absolute; width:1px; height:100%; left:' + (i*100/mediagrid.xcount) + '%; top:0%; border: 1px dotted #000; ">';
		div.append(html);
	}
	for (var i=1; i<mediagrid.ycount; i++) {
		var html = '<div style="position:absolute; width:100%; height:1px; left:0%; top:' + (i*100/mediagrid.ycount) + '%; border: 1px dotted #000; ">';
		div.append(html);
	}

	var width, scale, height;
	if (mediagrid.width > mediagrid.height ) {
		width = Math.floor(div.parent().width());
		scale = mediagrid.width / width;
		height = mediagrid.height / scale;
	} else {
		height = Math.floor(div.parent().width() * 9 / 16);
		scale = mediagrid.height / height;
		width = mediagrid.width / scale;
	}
	div.css('width' , width);
	div.css('height' , height);
	updateAddDtlBtn();
}

function redrawMediagriddtl(div, mediagrid, mediagriddtl, selected) {
	div.empty();
	div.attr("class", "region ui-draggable ui-resizable");
	div.attr('mediagriddtlid', mediagriddtl.mediagriddtlid);
	div.css('position', 'absolute');
	div.css('width', 100*mediagriddtl.xcount/mediagrid.xcount + '%');
	div.css('height', 100*mediagriddtl.ycount/mediagrid.ycount + '%');
	div.css('top', 100*mediagriddtl.ypos/mediagrid.ycount + '%');
	div.css('left', 100*mediagriddtl.xpos/mediagrid.xcount + '%');
	var mediagriddtlhtml = '';
	var border = '1px solid #000000';
	if (selected) {
		border = '3px solid #FF0000';
	}
	var bgimage;
	if (mediagriddtl.video != null) {
		bgimage = '/pixsigdata' + mediagriddtl.video.thumbnail;
	} else if (mediagriddtl.image != null) {
		bgimage = '/pixsigdata' + mediagriddtl.image.thumbnail;
	} else if (mediagriddtl.page != null) {
		bgimage = '/pixsigdata' + mediagriddtl.page.snapshot;
	} else if (mediagriddtl.bundle != null) {
		bgimage = '/pixsigdata' + mediagriddtl.bundle.snapshot;
	}

	mediagriddtlhtml += '<div style="position:absolute; width:100%; height:100%; "></div>';
	mediagriddtlhtml += '<div style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
	if (bgimage != null) {
		mediagriddtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
	}
	mediagriddtlhtml += '</div>';
	//mediagriddtlhtml += '<div class="btn-group" style="z-index:50; opacity:0.5; ">';
	//mediagriddtlhtml += '<label class="btn btn-circle btn-default btn-xs">' + eval('common.view.region_mainflag_' + mediagriddtl.mainflag) + eval('common.view.region_type_' + mediagriddtl.type) + '</label>';
	//mediagriddtlhtml += '</div>';
	div.html(mediagriddtlhtml);

	div.draggable({
		containment: div.parent(),
		stop: function(e, ui) {
			redrawMediagrid($('#MediagridDiv'), CurrentMediagrid, CurrentMediagriddtl);
		},
		drag: regionPositionUpdate
	}).resizable({
		containment: div.parent(),
		minWidth: 25,
		minHeight: 25,
		stop: function(e, ui) {
			redrawMediagrid($('#MediagridDiv'), CurrentMediagrid, CurrentMediagriddtl);
		},
		resize: regionPositionUpdate
	});
}


OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
FormValidateOption.rules['mediagrid.name'] = {};
FormValidateOption.rules['mediagrid.name']['required'] = true;
FormValidateOption.submitHandler = function(form) {
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
	$('.mediagrid-ratio').css('display', 'block');
	$('#MyEditForm input[name="mediagrid.branchid"]').val(CurBranchid);
	CurrentMediagrid = null;
	CurrentMediagridid = 0;
	//refreshMediagridBgImageSelect1();
	$('#MyEditModal').modal();
});			


$('body').on('click', '.pix-sync', function(event) {
	var target = $(event.target);
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		target = $(event.target).parent();
		index = $(event.target).parent().attr('data-id');
	}
	CurrentMediagrid = $('#MyTable').dataTable().fnGetData(index);
	CurrentMediagridid = CurrentMediagrid.mediagridid;
	bootbox.confirm(common.tips.syncmediagrid, function(result) {
		if (result == true) {
			$.ajax({
				type : 'GET',
				url : 'mediagrid!sync.action',
				cache: false,
				data : {
					mediagridid: CurrentMediagridid,
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
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentMediagrid = $('#MyTable').dataTable().fnGetData(index);
	CurrentMediagridid = CurrentMediagrid.mediagridid;
	var action = myurls['common.delete'];
	
	bootbox.confirm(common.tips.remove + CurrentMediagrid.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : action,
				cache: false,
				data : {
					'mediagrid.mediagridid': CurrentMediagridid
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



function regionPositionUpdate(e, ui) {
	var xcount = CurrentMediagrid.xcount;
	var ycount = CurrentMediagrid.ycount;
	var x = Math.round($(this).position().left / ($('#MediagridDiv').width()/xcount));
	var y = Math.round($(this).position().top / ($('#MediagridDiv').height()/ycount));
	var w = Math.round($(this).width() / ($('#MediagridDiv').width()/xcount));
	var h = Math.round($(this).height() / ($('#MediagridDiv').height()/ycount));
	w = (w == 0) ? 1 : w;
	h = (h == 0) ? 1 : h;
	
	var mediagriddtlid = $(this).attr("mediagriddtlid");
	for (var i=0; i<CurrentMediagrid.mediagriddtls.length; i++) {
		var dtl = CurrentMediagrid.mediagriddtls[i];
		if (dtl.mediagriddtlid != mediagriddtlid) {
			var x1 = dtl.xpos;
			var y1 = dtl.ypos;
			var w1 = dtl.xcount;
			var h1 = dtl.ycount;
			//console.log(x1, y1, w1, h1);
			if ((y+h <= y1) || (y1+h1 <= y) || (x+w <= x1) || (x1+w1 <= x)) {
				continue;
			} else {
				return;
			}
		} else {
			if (dtl.objtype == 3 && (w > 1 || h > 1)) {
				return;
			}
		}
	}

	var mediagriddtls = CurrentMediagrid.mediagriddtls.filter(function (el) {
		return el.mediagriddtlid == mediagriddtlid;
	});
	mediagriddtls[0].xcount = w;
	mediagriddtls[0].ycount = h;
	mediagriddtls[0].xpos = x;
	mediagriddtls[0].ypos = y;
}

function updateAddDtlBtn() {
	var area = 0;
	for (var i=0; i<CurrentMediagrid.mediagriddtls.length; i++) {
		var dtl = CurrentMediagrid.mediagriddtls[i];
		area += dtl.xcount * dtl.ycount;
	}
	if (CurrentMediagrid.xcount * CurrentMediagrid.ycount > area) {
		$('.pix-dtl-add').removeClass('disabled');
		$('.pix-dtl-add').removeClass('default');
		$('.pix-dtl-add').addClass('yellow');
	} else {
		$('.pix-dtl-add').addClass('disabled');
		$('.pix-dtl-add').removeClass('yellow');
		$('.pix-dtl-add').addClass('default');
	}
}


$('#MediagridDiv').click(function(e){
	var xcount = CurrentMediagrid.xcount;
	var ycount = CurrentMediagrid.ycount;
	var offset = $(this).offset();
	var xpos = Math.floor((e.pageX - offset.left) / ($('#MediagridDiv').width()/xcount));
	var ypos = Math.floor((e.pageY - offset.top) / ($('#MediagridDiv').height()/ycount));

	var mediagriddtls = CurrentMediagrid.mediagriddtls.filter(function (el) {
		return (xpos >= el.xpos) && (xpos < (el.xpos + el.xcount)) && (ypos >= el.ypos) && (ypos < (el.ypos + el.ycount));
	});
	if (mediagriddtls.length > 0) {
		if (CurrentMediagriddtl == null || CurrentMediagriddtl != null && validMediagriddtl(CurrentMediagriddtl)) {
			CurrentMediagriddtl = mediagriddtls[0];
			enterMediagriddtlFocus(CurrentMediagriddtl);
		}
	}
});

function enterMediagriddtlFocus(mediagriddtl) {
	redrawMediagrid($('#MediagridDiv'), CurrentMediagrid, mediagriddtl);
	$('#MediagridEditForm').css('display' , 'none');
	$('#MediagriddtlEditForm').css('display' , 'block');
	$('.mediagriddtl-title').html('');
	$('#MediagriddtlEditForm').loadJSON(mediagriddtl);
	refreshMediaSelect();
}

function validMediagrid(mediagrid) {
	if ($('#MediagridEditForm').valid()) {
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();

		mediagrid.name = $('#MediagridEditForm input[name="mediagrid.name"]').attr('value');
		mediagrid.tags = $('#TagSelect').select2('val').join(',');
		return true;
	}
	return false;
}

function validMediagriddtl(mediagriddtl) {
	if ($('#MediagriddtlEditForm').valid()) {
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();

		mediagriddtl.objtype = $('#MediagriddtlEditForm input[name=objtype]:checked').attr('value');
		if ($('#MediaSelect').select2('data') != null) {
			mediagriddtl.objid =  $('#MediaSelect').select2('data').id;
			if (mediagriddtl.objtype == 1) {
				mediagriddtl.video = $('#MediaSelect').select2('data').video;
				mediagriddtl.image = null;
			} else {
				mediagriddtl.image = $('#MediaSelect').select2('data').image;
				mediagriddtl.video = null;
			}
		}
		return true;
	}
	return false;
}

$('#MediagriddtlEditForm input[name=objtype]').change(function(e) {
	CurrentMediagriddtl.objtype = $('#MediagriddtlEditForm input[name=objtype]:checked').attr('value');
	CurrentMediagriddtl.objid = 0;
	CurrentMediagriddtl.mmediaid = 0;
	CurrentMediagriddtl.video = null;
	CurrentMediagriddtl.image = null;
	CurrentMediagriddtl.page = null;
	CurrentMediagriddtl.bundle = null;
	refreshMediaSelect();
	redrawMediagrid($('#MediagridDiv'), CurrentMediagrid, CurrentMediagriddtl);
});

$('#MediaSelect').on('change', function(e) {
	if ($('#MediaSelect').select2('data') != null) {
		CurrentMediagriddtl.objid = $('#MediaSelect').select2('data').id;
		if (CurrentMediagriddtl.objtype == 1) {
			CurrentMediagriddtl.video = $('#MediaSelect').select2('data').video;
			CurrentMediagriddtl.image = null;
			CurrentMediagriddtl.page = null;
			CurrentMediagriddtl.bundle = null;
		} else if (CurrentMediagriddtl.objtype == 2) {
			CurrentMediagriddtl.image = $('#MediaSelect').select2('data').image;
			CurrentMediagriddtl.video = null;
			CurrentMediagriddtl.page = null;
			CurrentMediagriddtl.bundle = null;
		} else if (CurrentMediagriddtl.objtype == 3) {
			CurrentMediagriddtl.page = $('#MediaSelect').select2('data').page;
			CurrentMediagriddtl.video = null;
			CurrentMediagriddtl.image = null;
			CurrentMediagriddtl.bundle = null;
		} else if (CurrentMediagriddtl.objtype == 4) {
			CurrentMediagriddtl.bundle = $('#MediaSelect').select2('data').bundle;
			CurrentMediagriddtl.video = null;
			CurrentMediagriddtl.image = null;
			CurrentMediagriddtl.page = null;
		}
	}
	redrawMediagrid($('#MediagridDiv'), CurrentMediagrid, CurrentMediagriddtl);
});	


function refreshMediaSelect() {
	if (CurrentMediagriddtl != null && CurrentMediagriddtl.objtype == 1) {
		$("#MediaSelect").select2({
			placeholder: common.tips.detail_select,
			minimumInputLength: 0,
			ajax: {
				url: 'video!list.action',
				type: 'GET',
				dataType: 'json',
				data: function (term, page) {
					return {
						sSearch: term,
						iDisplayStart: (page-1)*10,
						iDisplayLength: 10,
						folderid: CurrentFolderid,
					};
				},
				results: function (data, page) {
					var more = (page * 10) < data.iTotalRecords; 
					return {
						results : $.map(data.aaData, function (item) { 
							return { 
								text:item.name, 
								id:item.videoid, 
								video:item, 
							};
						}),
						more: more
					};
				}
			},
			formatResult: function(data) {
				var width = 40;
				var height = 40 * data.video.height / data.video.width;
				if (data.video.width < data.video.height) {
					height = 40;
					width = 40 * data.video.width / data.video.height;
				}
				var html = '<span><img src="/pixsigdata' + data.video.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.video.name + '</span>'
				return html;
			},
			formatSelection: function(data) {
				var width = 30;
				var height = 30 * height / width;
				if (data.video.width < data.video.height) {
					height = 30;
					width = 30 * width / height;
				}
				var html = '<span><img src="/pixsigdata' + data.video.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/></span>'
				return html;
			},
			initSelection: function(element, callback) {
				if (CurrentMediagriddtl != null && CurrentMediagriddtl.video != null) {
					callback({id: CurrentMediagriddtl.video.videoid, text: CurrentMediagriddtl.video.name, video: CurrentMediagriddtl.video });
				}
			},
			dropdownCssClass: "bigdrop", 
			escapeMarkup: function (m) { return m; } 
		});
	} else if (CurrentMediagriddtl != null && CurrentMediagriddtl.objtype == 2) {
		$("#MediaSelect").select2({
			placeholder: common.tips.detail_select,
			minimumInputLength: 0,
			ajax: {
				url: 'image!list.action',
				type: 'GET',
				dataType: 'json',
				data: function (term, page) {
					return {
						sSearch: term,
						iDisplayStart: (page-1)*10,
						iDisplayLength: 10,
						folderid: CurrentFolderid,
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
			formatResult: function(data) {
				var width = 40;
				var height = 40 * data.image.height / data.image.width;
				if (data.image.width < data.image.height) {
					height = 40;
					width = 40 * data.image.width / data.image.height;
				}
				var html = '<span><img src="/pixsigdata' + data.image.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.image.name + '</span>'
				return html;
			},
			formatSelection: function(data) {
				var width = 30;
				var height = 30 * height / width;
				if (data.image.width < data.image.height) {
					height = 30;
					width = 30 * width / height;
				}
				var html = '<span><img src="/pixsigdata' + data.image.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/></span>'
				return html;
			},
			initSelection: function(element, callback) {
				if (CurrentMediagriddtl != null && CurrentMediagriddtl.image != null) {
					callback({id: CurrentMediagriddtl.image.imageid, text: CurrentMediagriddtl.image.name, image: CurrentMediagriddtl.image });
				}
			},
			dropdownCssClass: "bigdrop", 
			escapeMarkup: function (m) { return m; } 
		});
	} else if (CurrentMediagriddtl != null && CurrentMediagriddtl.objtype == 3) {
		$("#MediaSelect").select2({
			placeholder: common.tips.detail_select,
			minimumInputLength: 0,
			ajax: {
				url: 'page!list.action',
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
								id:item.pageid, 
								page:item, 
							};
						}),
						more: more
					};
				}
			},
			formatResult: function(data) {
				var width = 40;
				var height = 40 * data.page.height / data.page.width;
				if (data.page.width < data.page.height) {
					height = 40;
					width = 40 * data.page.width / data.page.height;
				}
				var html = '<span><img src="/pixsigdata' + data.page.snapshot + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.page.name + '</span>'
				return html;
			},
			formatSelection: function(data) {
				var width = 30;
				var height = 30 * height / width;
				if (data.page.width < data.page.height) {
					height = 30;
					width = 30 * width / height;
				}
				var html = '<span><img src="/pixsigdata' + data.page.snapshot + '" width="' + width + 'px" height="' + height + 'px"/></span>'
				return html;
			},
			initSelection: function(element, callback) {
				if (CurrentMediagriddtl != null && CurrentMediagriddtl.page != null) {
					callback({id: CurrentMediagriddtl.page.pageid, text: CurrentMediagriddtl.page.name, page: CurrentMediagriddtl.page });
				}
			},
			dropdownCssClass: "bigdrop", 
			escapeMarkup: function (m) { return m; } 
		});
	} else if (CurrentMediagriddtl != null && CurrentMediagriddtl.objtype == 4) {
		$("#MediaSelect").select2({
			placeholder: common.tips.detail_select,
			minimumInputLength: 0,
			ajax: {
				url: 'bundle!list.action',
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
								id:item.bundleid, 
								bundle:item, 
							};
						}),
						more: more
					};
				}
			},
			formatResult: function(data) {
				var width = 40;
				var height = 40 * data.bundle.height / data.bundle.width;
				if (data.bundle.width < data.bundle.height) {
					height = 40;
					width = 40 * data.bundle.width / data.bundle.height;
				}
				var html = '<span><img src="/pixsigdata' + data.bundle.snapshot + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.bundle.name + '</span>'
				return html;
			},
			formatSelection: function(data) {
				var width = 30;
				var height = 30 * height / width;
				if (data.bundle.width < data.bundle.height) {
					height = 30;
					width = 30 * width / height;
				}
				var html = '<span><img src="/pixsigdata' + data.bundle.snapshot + '" width="' + width + 'px" height="' + height + 'px"/></span>'
				return html;
			},
			initSelection: function(element, callback) {
				if (CurrentMediagriddtl != null && CurrentMediagriddtl.bundle != null) {
					callback({id: CurrentMediagriddtl.bundle.bundleid, text: CurrentMediagriddtl.bundle.name, bundle: CurrentMediagriddtl.bundle });
				}
			},
			dropdownCssClass: "bigdrop", 
			escapeMarkup: function (m) { return m; } 
		});
	}
}

//在设计对话框中新增区域
$('body').on('click', '.pix-dtl-add', function(event) {
	var xcount = CurrentMediagrid.xcount;
	var ycount = CurrentMediagrid.ycount;
	var find = false;
	for (var i=0; i<xcount; i++) {
		for (var j=0; j<ycount; j++) {
			var mediagriddtls = CurrentMediagrid.mediagriddtls.filter(function (el) {
				return (i >= el.xpos) && (i < (el.xpos + el.xcount)) && (j >= el.ypos) && (j < (el.ypos + el.ycount));
			});
			if (mediagriddtls.length == 0) {
				var mediagriddtl = {};
				mediagriddtl.mediagriddtlid = '-' + Math.round(Math.random()*100000000);
				mediagriddtl.mediagridid = CurrentMediagridid;
				mediagriddtl.xpos = i;
				mediagriddtl.ypos = j;
				mediagriddtl.xcount = 1;
				mediagriddtl.ycount = 1;
				mediagriddtl.objtype = 1;
				mediagriddtl.objid = 0;
				mediagriddtl.mmediaid = 0;
				CurrentMediagrid.mediagriddtls[CurrentMediagrid.mediagriddtls.length] = mediagriddtl;
				CurrentMediagriddtl = mediagriddtl;
				enterMediagriddtlFocus(CurrentMediagriddtl);
				return;
			}
		}
	}
	

});

$('body').on('click', '.pix-dtl-delete', function(event) {
	if (CurrentMediagrid.mediagriddtls.length == 1) {
		bootbox.alert(common.tips.region_remove_failed);
		return;
	}
	bootbox.confirm(common.tips.remove, function(result) {
		if (result == true) {
			CurrentMediagrid.mediagriddtls.splice(CurrentMediagrid.mediagriddtls.indexOf(CurrentMediagriddtl), 1);
			CurrentMediagriddtl = CurrentMediagrid.mediagriddtls[0];
			enterMediagriddtlFocus(CurrentMediagriddtl);
		}
	 });
});


$.ajax({
	type : 'POST',
	url : 'folder!list.action',
	data : { },
	success : function(data, status) {
		if (data.errorcode == 0) {
			var folders = data.aaData;
			CurrentFolderid = folders[0].folderid;
			
			var folderTreeDivData = [];
			createFolderTreeData(folders, folderTreeDivData);
			$('.foldertree').each(function() {
				$(this).jstree('destroy');
				$(this).jstree({
					'core' : {
						'multiple' : false,
						'data' : folderTreeDivData
					},
					'plugins' : ['unique', 'types'],
					'types' : {
						'default' : { 'icon' : 'fa fa-folder icon-state-warning icon-lg' }
					},
				});
				$(this).on('loaded.jstree', function() {
					$(this).jstree('select_node', CurrentFolderid);
				});
				$(this).on('select_node.jstree', function(event, data) {
					CurrentFolderid = data.instance.get_node(data.selected[0]).id;
					refreshMediaSelect();
				});
			});
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

//================================ 设计主页 =========================================
//在列表页面中点击设计
$('body').on('click', '.pix-mediagrid', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentMediagrid = $('#MyTable').dataTable().fnGetData(index);
	CurrentMediagridid = CurrentMediagrid.mediagridid;
	CurrentMediagriddtl = null;
	
	$('#MediagridEditForm').loadJSON(CurrentMediagrid);
	$('#TagSelect').select2('val', $(CurrentMediagrid.tags.split(',')));
	$('#MediagridEditForm .mediagrid-title').html(CurrentMediagrid.name);
	//refreshMediagridBgImageSelect2();

	$('#MediagriddtlEditForm').css('display' , 'none');
	$('#MediagridEditForm').css('display' , 'block');
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	
	$('#MediagridModal').modal();
});

$('#MediagridModal').on('shown.bs.modal', function (e) {
	redrawMediagrid($('#MediagridDiv'), CurrentMediagrid, null);
	//updateRegionBtns();
})

$.ajax({
	type : 'GET',
	url : 'org!get.action',
	data : '',
	success : function(data, status) {
		if (data.errorcode == 0) {
			var tags = $(data.org.tags.split(','));
			var taglist = [];
			for (var i=0; i<tags.length; i++) {
				taglist.push({
					id: tags[i],
					text: tags[i],
				})
			}
			$('#TagSelect').select2({
				multiple: true,
				minimumInputLength: 0,
				data: taglist,
				dropdownCssClass: "bigdrop", 
				escapeMarkup: function (m) { return m; } 
			});
		} else {
			bootbox.alert(common.tips.error + data.errormsg);
		}
	},
	error : function() {
		console.log('failue');
	}
});

//在设计对话框中进行提交
$('[type=submit]', $('#MediagridModal')).on('click', function(event) {
	if (CurrentMediagriddtl == null && validMediagrid(CurrentMediagrid) || CurrentMediagriddtl != null && validMediagriddtl(CurrentMediagriddtl)) {
		$('#snapshot_div').show();
		redrawMediagridPreview($('#snapshot_div'), CurrentMediagrid, 512, 0);
		html2canvas($('#snapshot_div')[0]).then(function(canvas) {
			CurrentMediagrid.snapshotdtl = canvas.toDataURL('image/jpeg');
			$('#snapshot_div').hide();

			$.ajax({
				type : 'POST',
				url : myurls['mediagrid.design'],
				data : '{"mediagrid":' + $.toJSON(CurrentMediagrid) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				beforeSend: function ( xhr ) {
					Metronic.startPageLoading({animate: true});
				},
				success : function(data, status) {
					Metronic.stopPageLoading();
					$('#MediagridModal').modal('hide');
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
						$('#MyTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					$('#MediagridModal').modal('hide');
					console.log('failue');
				}
			});
		});
		event.preventDefault();
	}
});	
