var submitflag = false;
var myurls = {
	'common.list' : 'devicegrid!list.action',
	'common.add' : 'devicegrid!add.action',
	'common.update' : 'devicegrid!update.action',
	'common.delete' : 'devicegrid!delete.action',
	'devicegrid.design' : 'devicegrid!design.action',
	'device.list' : 'device!list.action',
};

var CurrentDevicegridid = 0;
var CurrentDevicegrid;
var CurrentXPos = -1;
var CurrentYPos = -1;
var Gridlayouts = [];

$(window).resize(function(e) {
	if (CurrentDevicegrid != null && e.target == this) {
		var width = Math.floor($("#DevicegridDiv").parent().width());
		var scale = CurrentDevicegrid.width / width;
		var height = CurrentDevicegrid.height / scale;
		$("#DevicegridDiv").css("width" , width);
		$("#DevicegridDiv").css("height" , height);
	}
	for (var i=0; i<$('#MyTable').dataTable().fnGetData().length; i++) {
		var devicegrid = $('#MyTable').dataTable().fnGetData(i);
		redrawDevicegridPreview($('#DevicegridDiv-' + devicegrid.devicegridid), devicegrid, Math.floor($('#DevicegridDiv-' + devicegrid.devicegridid).parent().parent().parent().width()), true);
	}
});

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

$("#MyTable thead").css("display", "none");
$("#MyTable tbody").css("display", "none");
var devicegridhtml = '';
var oTable = $('#MyTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 16, 36, 72, 108 ],
					[ 16, 36, 72, 108 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : myurls['common.list'],
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'devicegridid', 'bSortable' : false }],
	'iDisplayLength' : 16,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#DevicegridContainer').length < 1) {
			$('#MyTable').append('<div id="DevicegridContainer"></div>');
		}
		$('#DevicegridContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 4 == 0) {
			devicegridhtml = '';
			devicegridhtml += '<div class="row" >';
		}
		devicegridhtml += '<div class="col-md-3 col-xs-3">';
		devicegridhtml += '<h3 class="pixtitle">' + aData.name + '</h3>';
		devicegridhtml += '<h6><span class="label label-sm label-info">' + aData.xcount + 'x' + aData.ycount + '</span>';
		if (aData.ratio == 1) {
			devicegridhtml += ' <span class="label label-sm label-info">' + common.view.ratio_1 + '</span></h6>';
		} else if (aData.ratio == 2) {
			devicegridhtml += ' <span class="label label-sm label-success">' + common.view.ratio_2 + '</span></h6>';
		} else {
			devicegridhtml += ' <span class="label label-sm label-default">' + common.view.unknown + '</span></h6>';
		}
	
		devicegridhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="fancybox">';
		devicegridhtml += '<div class="thumbs">';
		var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
		devicegridhtml += '<div id="DevicegridDiv-'+ aData.devicegridid + '" class="imgthumb" style="width: ' + thumbwidth + '%"></div>';
		devicegridhtml += '</div></a>';
		
		devicegridhtml += '<div privilegeid="101010">';
		devicegridhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-devicegrid"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		devicegridhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
		devicegridhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a> </div>';

		devicegridhtml += '</div>';
		if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
			devicegridhtml += '</div>';
			if ((iDisplayIndex+1) != $('#MyTable').dataTable().fnGetData().length) {
				devicegridhtml += '<hr/>';
			}
			$('#DevicegridContainer').append(devicegridhtml);
		}

		if ((iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
			for (var i=0; i<$('#MyTable').dataTable().fnGetData().length; i++) {
				var devicegrid = $('#MyTable').dataTable().fnGetData(i);
				redrawDevicegridPreview($('#DevicegridDiv-' + devicegrid.devicegridid), devicegrid, Math.floor($('#DevicegridDiv-' + devicegrid.devicegridid).parent().parent().parent().width()), true);
			}
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('.thumbs').each(function(i) {
			$(this).width($(this).parent().closest('div').width());
			$(this).height($(this).parent().closest('div').width());
		});
		$('.fancybox').each(function(index,item) {
			$(this).click(function() {
				var index = $(this).attr('data-id');
				var devicegrid = $('#MyTable').dataTable().fnGetData(index);
				$.fancybox({
			        padding : 0,
			        content: '<div id="DevicegridPreview"></div>',
			    });
				redrawDevicegridPreview($('#DevicegridPreview'), devicegrid, 640, true);
			    return false;
			})
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurBranchid });
	},
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
					gridlayoutTableHtml += '<input type="radio" name="devicegrid.gridlayoutcode" value="' + Gridlayouts[i].gridlayoutcode + '" checked>';
				} else {
					gridlayoutTableHtml += '<input type="radio" name="devicegrid.gridlayoutcode" value="' +Gridlayouts[i].gridlayoutcode + '">';
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
	div.attr('style', 'position:relative; margin-left:0; margin-right:auto; border: 1px solid #000; background:#FFFFFF;');
	for (var i=0; i<gridlayout.xcount; i++) {
		for (var j=0; j<gridlayout.ycount; j++) {
			var html = '<div style="position: absolute; width:' + (100/gridlayout.xcount);
			html += '%; height:' + (100/gridlayout.ycount);
			html += '%; left: ' + (i*100/gridlayout.xcount);
			html += '%; top: ' + (j*100/gridlayout.ycount);
			html += '%; border: 1px solid #000; ">';
			div.append(html);
		}
	}
	var scale, width, height;
	if (gridlayout.width > gridlayout.height ) {
		width = maxsize;
		scale = gridlayout.width / width;
		height = gridlayout.height / scale;
		div.css('width', width);
		div.css('height', height);
	} else {
		height = maxsize;
		scale = gridlayout.height / height;
		width = gridlayout.width / scale;
		div.css('width', width);
		div.css('height', height);
	}
}

function redrawDevicegridPreview(div, devicegrid, maxsize, fbgcolor) {
	div.empty();
	div.attr('devicegridid', devicegrid.devicegridid);
	div.attr('style', 'position:relative; margin-left:0; margin-right:auto; border: 1px solid #000; background:#FFFFFF;');

	var rotate90 = '';
	if (devicegrid.ratio == 2) {
		rotate90 = 'rotate90';
	}
	for (var i=0; i<devicegrid.xcount; i++) {
		for (var j=0; j<devicegrid.ycount; j++) {
			var terminalid = '';
			var bgcolor = '#FFFFFF';
			for (var k=0; k<devicegrid.devices.length; k++) {
				var device = devicegrid.devices[k];
				if (device.xpos == i && device.ypos == j) {
					terminalid = device.terminalid;
					if (device.status == 0) {
						bgcolor = '#FFFFFF';
					} else if (device.onlineflag == 1) {
						bgcolor = '#35aa47';
					} else {
						bgcolor = '#C6C6C6';
					}
				}
			}
			if (!fbgcolor) {
				bgcolor = '#FFFFFF';
			}
			var html = '<div style="position: absolute; width:' + (100/devicegrid.xcount);
			html += '%; height:' + (100/devicegrid.ycount);
			html += '%; left: ' + (i*100/devicegrid.xcount);
			html += '%; top: ' + (j*100/devicegrid.ycount);
			html += '%; border: 1px solid #000; ">';
			html += '<div class="' + rotate90 + '" style="position:absolute; width:100%; height:100%; background:' + bgcolor + '">';
			html += '<p class="grid-font" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:#000; font-size:12px; ">';
			html += terminalid;
			html += '</p>';
			html += '</div>';
			html += '</div>';
			div.append(html);
			
		}
	}

	var width, scale, height;
	if (devicegrid.width > devicegrid.height ) {
		width = maxsize;
		scale = devicegrid.width / width;
		height = devicegrid.height / scale;
	} else {
		height = maxsize;
		scale = devicegrid.height / height;
		width = devicegrid.width / scale;
	}
	div.css('width' , width);
	div.css('height' , height);

	$(div).find('.grid-font').each(function() {
		var text = $(this).html();
		if (devicegrid.ratio == 1) {
			var lineheight = devicegrid.height / devicegrid.ycount / scale;
			$(this).css('font-size', 0.3 * lineheight + 'px');
			$(this).css('line-height', lineheight + 'px');
		} else {
			var lineheight = devicegrid.width / devicegrid.xcount / scale;
			$(this).css('font-size', 0.3 * lineheight + 'px');
			$(this).css('line-height', lineheight + 'px');
		}	
	});

	$(div).find('.rotate90').each(function() {
		$(this).css('width', $(this).parent().height());
		$(this).css('height', $(this).parent().width());
		$(this).css('top', ($(this).parent().height()-$(this).parent().width())/2);
		$(this).css('left', ($(this).parent().width()-$(this).parent().height())/2);
	});
}

function redrawDevicegrid(div, devicegrid) {
	div.empty();
	div.css('position', 'relative');
	div.css('margin-left', 'auto');
	div.css('margin-right', 'auto');
	div.css('border', '1px solid #000');
	var rotate90 = '';
	if (devicegrid.ratio == 2) {
		rotate90 = 'rotate90';
	}
	for (var i=0; i<devicegrid.xcount; i++) {
		for (var j=0; j<devicegrid.ycount; j++) {
			var terminalid = '';
			if (devicegrid.devicearray[i][j] != null) {
				terminalid = devicegrid.devicearray[i][j].terminalid;
			}
			div.append('<div id="DevicegriddtlDiv-' + i + '-' + j + '"></div>');
			var devicediv = $('#DevicegriddtlDiv-' + i + '-' + j);
			devicediv.empty();
			devicediv.css('position', 'absolute');
			devicediv.css('width', 100/devicegrid.xcount + '%');
			devicediv.css('height', 100/devicegrid.ycount + '%');
			devicediv.css('left', i*100/devicegrid.xcount + '%');
			devicediv.css('top', j*100/devicegrid.ycount + '%');
			var html = '';
			var border = '1px solid #000000';
			if (CurrentXPos == i && CurrentYPos == j) {
				border = '3px solid #FF0000';
			}
			html += '<div style="position:absolute; width:100%; height:100%; "></div>';
			html += '<div class="' + rotate90 + '" style="position:absolute; width:100%; height:100%; border:' + border + '; ">';
			html += '<p class="grid-font" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:#000; font-size:12px; ">';
			html += terminalid;
			html += '</p>';
			html += '</div>';
			devicediv.html(html);
		}
	}

	var width, scale, height;
	if (devicegrid.width > devicegrid.height ) {
		width = Math.floor(div.parent().width());
		scale = devicegrid.width / width;
		height = devicegrid.height / scale;
	} else {
		height = Math.floor(div.parent().width() * 9 / 16);
		scale = devicegrid.height / height;
		width = devicegrid.width / scale;
	}
	div.css('width' , width);
	div.css('height' , height);
	$(div).find('.grid-font').each(function() {
		var text = $(this).html();
		if (devicegrid.ratio == 1) {
			var lineheight = devicegrid.height / devicegrid.ycount / scale;
			$(this).css('font-size', 0.3 * lineheight + 'px');
			$(this).css('line-height', lineheight + 'px');
		} else {
			var lineheight = devicegrid.width / devicegrid.xcount / scale;
			$(this).css('font-size', 0.3 * lineheight + 'px');
			$(this).css('line-height', lineheight + 'px');
		}
	});

	$(div).find('.rotate90').each(function() {
		$(this).css('width', $(this).parent().height());
		$(this).css('height', $(this).parent().width());
		$(this).css('top', ($(this).parent().height()-$(this).parent().width())/2);
		$(this).css('left', ($(this).parent().width()-$(this).parent().height())/2);
	});
}


OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
FormValidateOption.rules['devicegrid.name'] = {};
FormValidateOption.rules['devicegrid.name']['required'] = true;
FormValidateOption.submitHandler = function(form) {
	var gridlayoutcode = $('input[name="devicegrid.gridlayoutcode"]:checked').val();
	var gridlayout = Gridlayouts.filter(function (el) {
		return (el.gridlayoutcode == gridlayoutcode);
	})[0];
	$('#snapshot_div').show();
	redrawGridlayout($('#snapshot_div'), gridlayout, 512);	
	
	html2canvas($('#snapshot_div'), {
		onrendered: function(canvas) {
			console.log(canvas.toDataURL());
			$('#MyEditForm input[name="devicegrid.snapshotdtl"]').val(canvas.toDataURL());
			$('#snapshot_div').hide();

			$.ajax({
				type : 'POST',
				url : $('#MyEditForm').attr('action'),
				data : $('#MyEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						submitflag = false;
						Metronic.unblockUI();
						$('#MyEditModal').modal('hide');
						bootbox.alert(common.tips.success);
						$('#MyTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					submitflag = false;
					Metronic.unblockUI();
					$('#MyEditModal').modal('hide');
					console.log('failue');
				}
			});
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
	$('.devicegrid-ratio').css('display', 'block');
	$('#MyEditForm input[name="devicegrid.branchid"]').val(CurBranchid);
	CurrentDevicegrid = null;
	CurrentDevicegridid = 0;
	//refreshDevicegridBgImageSelect1();
	$('#MyEditModal').modal();
});			


$('body').on('click', '.pix-sync', function(event) {
	var target = $(event.target);
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		target = $(event.target).parent();
		index = $(event.target).parent().attr('data-id');
	}
	CurrentDevicegrid = $('#MyTable').dataTable().fnGetData(index);
	CurrentDevicegridid = CurrentDevicegrid.devicegridid;
	bootbox.confirm(common.tips.sync + CurrentDevicegrid.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'GET',
				url : 'devicegrid!sync.action',
				cache: false,
				data : {
					devicegridid: CurrentDevicegridid,
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
	CurrentDevicegrid = $('#MyTable').dataTable().fnGetData(index);
	CurrentDevicegridid = CurrentDevicegrid.devicegridid;
	var action = myurls['common.delete'];
	
	bootbox.confirm(common.tips.remove + CurrentDevicegrid.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : action,
				cache: false,
				data : {
					'devicegrid.devicegridid': CurrentDevicegridid
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

$('#DevicegridDiv').click(function(e){
	var xcount = CurrentDevicegrid.xcount;
	var ycount = CurrentDevicegrid.ycount;
	var offset = $(this).offset();
	var xpos = Math.floor((e.pageX - offset.left) / ($('#DevicegridDiv').width()/xcount));
	var ypos = Math.floor((e.pageY - offset.top) / ($('#DevicegridDiv').height()/ycount));

	if (xpos >= 0 && xpos < xcount && ypos >= 0 && ypos < ycount) {
		if (CurrentXPos == -1 && CurrentYPos == -1 || CurrentXPos >=0 && CurrentYPos >= 0 && validDevicegriddtl()) {
			CurrentXPos = xpos;
			CurrentYPos = ypos;
			redrawDevicegrid($('#DevicegridDiv'), CurrentDevicegrid);
			$('#DevicegridEditForm').css('display' , 'none');
			$('#DevicegriddtlEditForm').css('display' , 'block');
			$('.devicegriddtl-title').html('');
			refreshDeviceSelect();
		}
	}
});

function validDevicegrid() {
	if ($('#DevicegridEditForm').valid()) {
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();
		CurrentDevicegrid.name = $('#DevicegridEditForm input[name="name"]').attr('value');
		return true;
	}
	return false;
}

function validDevicegriddtl() {
	if ($('#DevicegriddtlEditForm').valid()) {
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();
		if ($('#DeviceSelect').select2('data') != null) {
			CurrentDevicegrid.devicearray[CurrentXPos][CurrentYPos] =  $('#DeviceSelect').select2('data').device;
		} else {
			CurrentDevicegrid.devicearray[CurrentXPos][CurrentYPos] =  null;
		}
		return true;
	}
	return false;
}

$('#DeviceSelect').on('change', function(e) {
	if ($('#DeviceSelect').select2('data') != null) {
		CurrentDevicegrid.devicearray[CurrentXPos][CurrentYPos] =  $('#DeviceSelect').select2('data').device;
	} else {
		CurrentDevicegrid.devicearray[CurrentXPos][CurrentYPos] =  null;
	}
	redrawDevicegrid($('#DevicegridDiv'), CurrentDevicegrid);
});	


function refreshDeviceSelect() {
	$('#DeviceSelect').select2({
		placeholder: common.tips.detail_select,
		minimumInputLength: 0,
		ajax: {
			url: 'device!list.action',
			type: 'GET',
			dataType: 'json',
			data: function (term, page) {
				return {
					sSearch: term,
					iDisplayStart: (page-1)*10,
					iDisplayLength: 10,
					devicegridid: 0,
					branchid: CurBranchid,
				};
			},
			results: function (data, page) {
				var more = (page * 10) < data.iTotalRecords; 
				return {
					results : $.map(data.aaData, function (item) {
						for (var i=0; i<CurrentDevicegrid.xcount; i++) {
							for (var j=0; j<CurrentDevicegrid.ycount; j++) {
								var device = CurrentDevicegrid.devicearray[i][j];
								if (!(CurrentXPos == i && CurrentYPos == j) && device != null && device.deviceid == item.deviceid) {
									return null;
								}
							}
						}
						return { 
							text:item.name, 
							id:item.deviceid, 
							device:item, 
						};
					}),
					more: more
				};
			}
		},
		formatResult: function(data) {
			return '<span>' + data.device.terminalid + '(' + data.device.name + ')' + '</span>';
		},
		formatSelection: function(data) {
			return '<span>' + data.device.terminalid + '(' + data.device.name + ')' + '</span>';
		},
		initSelection: function(element, callback) {
			console.log(CurrentXPos, CurrentYPos, CurrentDevicegrid.devicearray[CurrentXPos][CurrentYPos]);
			if (CurrentDevicegrid.devicearray[CurrentXPos][CurrentYPos] != null) {
				var device = CurrentDevicegrid.devicearray[CurrentXPos][CurrentYPos];
				callback({id: device.deviceid, text: device.name, device: device });
			}
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});
	if (CurrentDevicegrid.devicearray[CurrentXPos][CurrentYPos] != null) {
		$('#DeviceSelect').select2('val', CurrentDevicegrid.devicearray[CurrentXPos][CurrentYPos]);
	}
}



//================================ 设计主页 =========================================
//在列表页面中点击设计
$('body').on('click', '.pix-devicegrid', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentDevicegrid = $('#MyTable').dataTable().fnGetData(index);
	CurrentDevicegridid = CurrentDevicegrid.devicegridid;
	CurrentXPos = -1;
	CurrentYPos = -1;
	CurrentDevicegrid.devicearray = [];
	for (var i=0; i<CurrentDevicegrid.xcount; i++) {
		CurrentDevicegrid.devicearray[i] = [];
		for (var j=0; j<CurrentDevicegrid.ycount; j++) {
			CurrentDevicegrid.devicearray[i][j] = null;
		}
	}
	for (var i=0; i<CurrentDevicegrid.devices.length; i++) {
		var device = CurrentDevicegrid.devices[i];
		CurrentDevicegrid.devicearray[device.xpos][device.ypos] = device;
	}
	
	$('#DevicegridEditForm').loadJSON(CurrentDevicegrid);
	$('#DevicegridEditForm .devicegrid-title').html(CurrentDevicegrid.name);

	$('#DevicegriddtlEditForm').css('display' , 'none');
	$('#DevicegridEditForm').css('display' , 'block');
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	
	$('#DevicegridModal').modal();
});

$('#DevicegridModal').on('shown.bs.modal', function (e) {
	redrawDevicegrid($('#DevicegridDiv'), CurrentDevicegrid);
});


//在设计对话框中进行提交
$('[type=submit]', $('#DevicegridModal')).on('click', function(event) {
	if (CurrentXPos == -1 && CurrentYPos == -1 && validDevicegrid() || CurrentXPos >=0 && CurrentYPos >= 0 && validDevicegriddtl()) {
		if (submitflag) {
			return;
		}
		submitflag = true;
		Metronic.blockUI({
			zIndex: 20000,
			animate: true
		});

		CurrentDevicegrid.devices = [];
		for (var i=0; i<CurrentDevicegrid.xcount; i++) {
			for (var j=0; j<CurrentDevicegrid.ycount; j++) {
				if (CurrentDevicegrid.devicearray[i][j] != null) {
					var device = {};
					device.deviceid = CurrentDevicegrid.devicearray[i][j].deviceid;
					device.terminalid = CurrentDevicegrid.devicearray[i][j].terminalid;
					device.devicegridid = CurrentDevicegrid.devicegridid;
					device.xpos = i;
					device.ypos = j;
					CurrentDevicegrid.devices.push(device);
				}
			}
		}
		
		$('#snapshot_div').show();
		redrawDevicegridPreview($('#snapshot_div'), CurrentDevicegrid, 512, false);
		html2canvas($('#snapshot_div'), {
			onrendered: function(canvas) {
				console.log(canvas.toDataURL());
				CurrentDevicegrid.snapshotdtl = canvas.toDataURL();
				$('#snapshot_div').hide();

				$.ajax({
					type : 'POST',
					url : myurls['devicegrid.design'],
					data : '{"devicegrid":' + $.toJSON(CurrentDevicegrid) + '}',
					dataType : 'json',
					contentType : 'application/json;charset=utf-8',
					success : function(data, status) {
						submitflag = false;
						Metronic.unblockUI();
						$('#DevicegridModal').modal('hide');
						if (data.errorcode == 0) {
							bootbox.alert(common.tips.success);
							$('#MyTable').dataTable()._fnAjaxUpdate();
						} else {
							bootbox.alert(common.tips.error + data.errormsg);
						}
					},
					error : function() {
						submitflag = false;
						Metronic.unblockUI();
						$('#DevicegridModal').modal('hide');
						console.log('failue');
					}
				});
			}
		});

		event.preventDefault();
	}
});	