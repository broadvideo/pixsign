var submitflag = false;

var ZoneLimits = [];
ZoneLimits['0'] = 1000;
ZoneLimits['1'] = 1000;
ZoneLimits['11'] = 1;
ZoneLimits['12'] = 1;
ZoneLimits['13'] = 1;
ZoneLimits['14'] = 1;

var ZoneRatios = [];

var PageScale = 1;

var CurrentPage;
var CurrentPageid;
var CurrentPagezone;

var CurrentMediaBranchid;
var CurrentMediaFolderid;

$('#MyTable thead').css('display', 'none');
$('#MyTable tbody').css('display', 'none');
var pagehtml = '';
var oTable = $('#MyTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 16, 36, 72, 108 ],
						[ 16, 36, 72, 108 ] 
						],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'page!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.ratio, 'mData' : 'ratio', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'pageid', 'bSortable' : false }],
	'iDisplayLength' : 16,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#PageContainer').length < 1) {
			$('#MyTable').append('<div id="PageContainer"></div>');
		}
		$('#PageContainer').html(''); 
		return true;
	},
	'fnServerParams': function(aoData) {
		aoData.push({'name':'pagepkgid','value':0 });
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 4 == 0) {
			pagehtml = '';
			pagehtml += '<div class="row" >';
		}
		pagehtml += '<div class="col-md-3 col-xs-3">';
		pagehtml += '<h3>' + aData.name + '</h3>';
		if (aData.ratio == 1) {
			pagehtml += '<h6><span class="label label-sm label-info">' + common.view.template_ratio_1 + '</span></h6>';
		} else if (aData.ratio == 2) {
			pagehtml += '<h6><span class="label label-sm label-success">' + common.view.template_ratio_2 + '</span></h6>';
		}

		if (aData.snapshot != null) {
			pagehtml += '<a class="fancybox" href="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" title="' + aData.name + '">';
			pagehtml += '<div class="thumbs">';
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			pagehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + aData.timestamp  + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
			pagehtml += '</div></a>';
		} else {
			pagehtml += '<div class="thumbs">';
			pagehtml += '</div>';
		}
		
		pagehtml += '<div privilegeid="101010">';
		pagehtml += '<a href="javascript:;" pageid="' + aData.pageid + '" class="btn default btn-xs green pix-page"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
		pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-push"><i class="fa fa-desktop"></i> ' + common.view.device + '</a>';
		pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
		pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
		pagehtml += '</div>';

		pagehtml += '</div>';
		if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
			pagehtml += '</div>';
			if ((iDisplayIndex+1) != $('#MyTable').dataTable().fnGetData().length) {
				pagehtml += '<hr/>';
			}
			$('#PageContainer').append(pagehtml);
			$('.thumbs').each(function(i) {
				$(this).width($(this).parent().closest('div').width());
				$(this).height($(this).parent().closest('div').width());
			});
			$('.fancybox').fancybox({
				openEffect	: 'none',
				closeEffect	: 'none',
				closeBtn : false,
			});
		}
		return nRow;
	}
});
jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').select2();

$('#TemplateTable thead').css('display', 'none');
$('#TemplateTable tbody').css('display', 'none');
var templatehtml = '';
$('#TemplateTable').dataTable({
	'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 18, 30, 48, 96 ],
					  [ 18, 30, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'template!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'templateid', 'bSortable' : false }],
	'iDisplayLength' : 12,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#TemplateContainer').length < 1) {
			$('#TemplateTable').append('<div id="TemplateContainer"></div>');
		}
		$('#TemplateContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 4 == 0) {
			templatehtml = '';
			templatehtml += '<div class="row" >';
		}
		templatehtml += '<div class="col-md-3 col-xs-3">';
		templatehtml += '<a href="javascript:;" templateid="' + aData.templateid + '" class="fancybox">';
		templatehtml += '<div class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			templatehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		}
		templatehtml += '</div></a>';
		templatehtml += '<label class="radio-inline">';
		if (iDisplayIndex == 0) {
			templatehtml += '<input type="radio" name="page.templateid" value="' + aData.templateid + '" checked>';
		} else {
			templatehtml += '<input type="radio" name="page.templateid" value="' + aData.templateid + '">';
		}
		templatehtml += aData.name + '</label>';

		templatehtml += '</div>';
		if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#TemplateTable').dataTable().fnGetData().length) {
			templatehtml += '</div>';
			if ((iDisplayIndex+1) != $('#TemplateTable').dataTable().fnGetData().length) {
				templatehtml += '<hr/>';
			}
			$('#TemplateContainer').append(templatehtml);
		}
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('#TemplateContainer .thumbs').each(function(i) {
			console.log($(this).parent().closest('div').width());
			$(this).width($(this).parent().closest('div').width());
			$(this).height($(this).parent().closest('div').width());
		});
		$('#TemplateContainer .fancybox').each(function(index,item) {
			$(this).click(function() {
				var templateid = $(this).attr('templateid');
				$.ajax({
					type : 'GET',
					url : 'template!get.action',
					data : {templateid: templateid},
					success : function(data, status) {
						if (data.errorcode == 0) {
							$.fancybox({
								openEffect	: 'none',
								closeEffect	: 'none',
								closeBtn : false,
						        padding : 0,
						        content: '<div id="TemplatePreview"></div>',
						    });
							redrawTemplatePreview($('#TemplatePreview'), data.template, 800, 1);
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
		var templateflag = $('#MyEditForm input[name="templateflag"]:checked').val();
		var ratio = $('select[name="page.ratio"]').val();
		aoData.push({'name':'templateflag','value':templateflag });
		aoData.push({'name':'ratio','value':ratio });
	}
});
jQuery('#TemplateTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#TemplateTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#TemplateTable_wrapper .dataTables_length select').select2();

function refreshTemplate() {
	$('#MyEditForm input[name="page.templateid"]').val('0');
	var templateflag = $('#MyEditForm input[name="templateflag"]:checked').val();
	if (templateflag == 0) {
		$('.template-ctrl').css('display', 'none');
	} else {
		$('.template-ctrl').css('display', '');
		$('#TemplateTable').dataTable().fnDraw(true);
	}
}

OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
FormValidateOption.rules['page.name'] = {};
FormValidateOption.rules['page.name']['required'] = true;
FormValidateOption.submitHandler = function(form) {
	$.ajax({
		type : 'POST',
		url : $('#MyEditForm').attr('action'),
		data : $('#MyEditForm').serialize(),
		success : function(data, status) {
			if (data.errorcode == 0) {
				$('#MyEditModal').modal('hide');
				bootbox.alert(common.tips.success);
				$('#MyTable').dataTable().fnDraw(true);
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

$('#MyEditModal').on('shown.bs.modal', function (e) {
	refreshTemplate();
})

$('#MyEditForm input[name="templateflag"]').change(function(e) {
	refreshTemplate();
});

$('#MyEditForm select[name="page.ratio"]').on('change', function(e) {
	refreshTemplate();
});	

$('body').on('click', '.pix-add', function(event) {
	refreshForm('MyEditForm');
	$('#MyEditForm').attr('action', 'page!add.action');
	$('.hide-update').css('display', 'block');
	CurrentPage = null;
	CurrentPageid = 0;
	$('#MyEditModal').modal();
});			


$('body').on('click', '.pix-update', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentPage = $('#MyTable').dataTable().fnGetData(index);
	CurrentPageid = CurrentPage.pageid;

	var formdata = new Object();
	for (var name in CurrentPage) {
		formdata['page.' + name] = CurrentPage[name];
	}
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', 'page!update.action');
	$('.hide-update').css('display', 'none');
	$('#MyEditModal').modal();
});

$('body').on('click', '.pix-sync', function(event) {
	var target = $(event.target);
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		target = $(event.target).parent();
		index = $(event.target).parent().attr('data-id');
	}
	CurrentPage = $('#MyTable').dataTable().fnGetData(index);
	CurrentPageid = CurrentPage.pageid;
	bootbox.confirm(common.tips.synclayout, function(result) {
		if (result == true) {
			$.ajax({
				type : 'GET',
				url : 'page!sync.action',
				cache: false,
				data : {
					pageid: CurrentPageid,
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
	CurrentPage = $('#MyTable').dataTable().fnGetData(index);
	CurrentPageid = CurrentPage.pageid;
	bootbox.confirm(common.tips.remove + CurrentPage.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : 'page!delete.action',
				cache: false,
				data : {
					'page.pageid': CurrentPageid
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


$('body').on('click', '.pix-page', function(event) {
	var pageid = $(event.target).attr('pageid');
	if (pageid == undefined) {
		pageid = $(event.target).parent().attr('pageid');
	}
	$.ajax({
		type : 'GET',
		url : 'page!get.action',
		data : {pageid: pageid},
		success : function(data, status) {
			if (data.errorcode == 0) {
				CurrentPage = data.page;
				CurrentPageid = CurrentPage.pageid;
				CurrentPagezone = null;
				$('#PageModal').modal();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
});

$('#PageModal').on('shown.bs.modal', function (e) {
	$('#PagezoneEditPanel').css('display' , 'none');
	$('#PageDiv').empty();
	$('#PageDiv').css('position', 'relative');
	$('#PageDiv').css('margin-left', 'auto');
	$('#PageDiv').css('margin-right', 'auto');
	$('#PageDiv').css('border', '1px solid #000');
	if (CurrentPage.width > CurrentPage.height) {
		var width = Math.floor($('#PageDiv').parent().width());
		PageScale = CurrentPage.width / width;
		var height = CurrentPage.height / PageScale;
	} else {
		var height = Math.floor($('#PageDiv').parent().width());
		PageScale = CurrentPage.height / height;
		var width = CurrentPage.width / PageScale;
	}
	$('#PageDiv').css('width' , width);
	$('#PageDiv').css('height' , height);
	
	var pagezones = CurrentPage.pagezones;
	for (var i=0; i<pagezones.length; i++) {
		if (pagezones[i].type == '0') {
			createTextzone(pagezones[i]);
		} else if (pagezones[i].type == '1') {
			createImagezone(pagezones[i]);
		} else {
			createOtherzone(pagezones[i]);
		}
		initOperation(pagezones[i]);
	}
	unselectAllZones();
})

function updatePagezonePos(e, ui) {
	var pagezoneid = $(this).attr('pagezoneid');
	var pagezones = CurrentPage.pagezones.filter(function (el) {
		return el.pagezoneid == pagezoneid;
	});

	var l = $(this).position().left / $('#PageDiv').width();
	var t = $(this).position().top / $('#PageDiv').height();
	var w = $(this).width() / $('#PageDiv').width();
	var h = $(this).height() / $('#PageDiv').height();
	/*
	if (ZoneRatios[pagezones[0].type] != undefined) {
		var w = $(this).width() / $('#PageDiv').width();
		var h = $(this).width() / parseFloat(ZoneRatios[pagezones[0].type]) / $('#PageDiv').height();
		if (t + h > 1) {
			h = 1 - t;
			w = h * $('#PageDiv').height() * parseFloat(ZoneRatios[pagezones[0].type]) / $('#PageDiv').width();
		}
	}*/
	//$(this).css('width' , (100 * parseFloat(w)) + '%');
	//$(this).css('height' , (100 * parseFloat(h)) + '%');
	//$(this).css('left' , (100 * parseFloat(l)) + '%');
	//$(this).css('top' , (100 * parseFloat(t)) + '%');

	pagezones[0].width = Math.round(CurrentPage.width * w, 0);
	pagezones[0].height = Math.round(CurrentPage.height * h, 0);
	pagezones[0].leftoffset = Math.round(CurrentPage.width * l, 0);
	pagezones[0].topoffset = Math.round(CurrentPage.height * t, 0);
	refreshLocSpinners(pagezones[0]);
}

function initOperation(pagezone) {
	var pagezoneDiv = $('#PagezoneDiv' + pagezone.pagezoneid);
	$(pagezoneDiv).draggable({
		containment: '#PageDiv',
		//stop: regionPositionUpdate,
		drag: updatePagezonePos,
	});
	
	$(pagezoneDiv).resizable({
		containment: '#PageDiv',
		aspectRatio: false,
		handles: 'ne, nw, se, sw',
		stop: updatePagezonePos,
	});
	if (isOpera) {
		var tr = $(pagezoneDiv).css('-o-transform').replace('matrix(', '').replace(')', '');
	} else if (isFirefox) {
		tr = $(pagezoneDiv).css('-moz-transform').replace('matrix(', '').replace(')', '');
	} else if (isChrome || isSafari) {
		tr = $(pagezoneDiv).css('-webkit-transform').replace('matrix(', '').replace(')', '');
	}
	$(pagezoneDiv).find('#rotatable').rotatable({
		mtx: [tr], 
		onrotate: function (a) {
			//set_rotation_angle_spinner_value(a);
		}
	});
}

function refreshPagezone(pagezone) {
	var pagezoneDiv = $('#PagezoneDiv' + pagezone.pagezoneid);
	$(pagezoneDiv).css({
		'position': 'absolute',
		'width': 100*pagezone.width/CurrentPage.width + '%',
		'height': 100*pagezone.height/CurrentPage.height + '%',
		'top': 100*pagezone.topoffset/CurrentPage.height + '%', 
		'left': 100*pagezone.leftoffset/CurrentPage.width + '%', 
		'z-index': pagezone.zindex,
		'-moz-transform': pagezone.transform,
		'-webkit-transform': pagezone.transform,
	});
	$(pagezoneDiv).find('#background').css({
		'position': 'absolute',
		'width': '100%',
		'height': '100%',
		'background': pagezone.bgcolor, 
		'opacity': parseInt(pagezone.bgopacity)/255, 
	});
	if (pagezone.type == 0) {
		var shadow = '';
		shadow += (parseInt(pagezone.shadowh) / PageScale) + 'px ';
		shadow += (parseInt(pagezone.shadowv) / PageScale) + 'px ';
		shadow += (parseInt(pagezone.shadowblur) / PageScale) + 'px ';
		shadow += pagezone.shadowcolor;
		$(pagezoneDiv).find('#rotatable').css({
			'position': 'absolute',
			'height': '100%', 
			'width': '100%', 
			'color': pagezone.color, 
			'font-family': pagezone.fontfamily, 
			'font-size': (parseInt(pagezone.fontsize) / PageScale) + 'px', 
			'text-decoration': pagezone.decoration, 
			'text-align': pagezone.align, 
			'font-weight': pagezone.fontweight, 
			'font-style': pagezone.fontstyle, 
			'line-height': (parseInt(pagezone.lineheight) / PageScale) + 'px', 
			'text-shadow': shadow,  
			'padding': (parseInt(pagezone.padding) / PageScale) + 'px', 
			'border-color': pagezone.bdcolor, 
			'border-style': pagezone.bdstyle, 
			'border-width': (parseInt(pagezone.bdwidth) / PageScale) + 'px', 
			'border-top-right-radius': (parseInt(pagezone.bdtr) / PageScale) + 'px', 
			'border-top-left-radius': (parseInt(pagezone.bdtl) / PageScale) + 'px', 
			'border-bottom-left-radius': (parseInt(pagezone.bdbl) / PageScale) + 'px', 
			'border-bottom-right-radius': (parseInt(pagezone.bdbr) / PageScale) + 'px',
			'word-wrap': 'break-word',
		});
		$(pagezoneDiv).find('p').css({
			'word-wrap': 'break-word',
			'white-space': 'pre-wrap',
			'text-decoration': pagezone.decoration,
		});
	} else if (pagezone.type == 1) {
		var shadow = '';
		shadow += (parseInt(pagezone.shadowh) / PageScale) + 'px ';
		shadow += (parseInt(pagezone.shadowv) / PageScale) + 'px ';
		shadow += (parseInt(pagezone.shadowblur) / PageScale) + 'px ';
		shadow += pagezone.shadowcolor;
		$(pagezoneDiv).find('#rotatable').css({
			'position': 'absolute',
			'height': '100%', 
			'width': '100%', 
			'box-shadow': shadow, 
			'padding': (parseInt(pagezone.padding) / PageScale) + 'px', 
			'opacity': parseInt(pagezone.opacity)/255,
		});
		$(pagezoneDiv).find('img').css({
			'border-color': pagezone.bdcolor, 
			'border-style': pagezone.bdstyle, 
			'border-width': (parseInt(pagezone.bdwidth) / PageScale) + 'px', 
			'border-top-right-radius': (parseInt(pagezone.bdtr) / PageScale) + 'px', 
			'border-top-left-radius': (parseInt(pagezone.bdtl) / PageScale) + 'px', 
			'border-bottom-left-radius': (parseInt(pagezone.bdbl) / PageScale) + 'px', 
			'border-bottom-right-radius': (parseInt(pagezone.bdbr) / PageScale) + 'px', 
		})
		if (pagezone.content != '' && pagezone.content != 'no' && pagezone.content != 'non') {
			$(pagezoneDiv).find('img').attr('src', '/pixsigdata' + pagezone.content);
			$(pagezoneDiv).find('img').attr('width', '100%');
			$(pagezoneDiv).find('img').attr('height', '100%');
			$(pagezoneDiv).find('#rotatable').attr('imageid', pagezone.objid);
			$(pagezoneDiv).find('#rotatable').attr('content', pagezone.content);
			$(pagezoneDiv).find('#rotatable').attr('owidth', pagezone.width);
			$(pagezoneDiv).find('#rotatable').attr('oheight', pagezone.height);
		}
	} else {
		$(pagezoneDiv).find('#rotatable').css({
			'position': 'absolute',
			'height': '100%', 
			'width': '100%', 
			'color': '#FFFFFF', 
			'font-size': (50 / PageScale) + 'px', 
			'padding': (parseInt(pagezone.padding) / PageScale) + 'px', 
			'border-color': pagezone.bdcolor, 
			'border-style': pagezone.bdstyle, 
			'border-width': (parseInt(pagezone.bdwidth) / PageScale) + 'px', 
			'border-top-right-radius': (parseInt(pagezone.bdtr) / PageScale) + 'px', 
			'border-top-left-radius': (parseInt(pagezone.bdtl) / PageScale) + 'px', 
			'border-bottom-left-radius': (parseInt(pagezone.bdbl) / PageScale) + 'px', 
			'border-bottom-right-radius': (parseInt(pagezone.bdbr) / PageScale) + 'px',
			'word-wrap': 'break-word',
		});
		$(pagezoneDiv).find('p').css({
			'word-wrap': 'break-word',
			'text-align': 'center',
			'overflow': 'hidden',
			'text-overflow': 'clip',
			'white-space': 'nowrap',
		});
	}
}

function createTextzone(pagezone) {
	var pagezone_div = document.createElement('div');
	pagezone_div.id = 'PagezoneDiv' + pagezone.pagezoneid;
	pagezone_div.className = 'pagezone text_div active resizable';
	pagezone_div.unselectable = 'off';
	$(pagezone_div).attr('pagezoneid', pagezone.pagezoneid);
	$(pagezone_div).attr('zonetype', 'text');

	var background_div = document.createElement('div');
	background_div.id = 'background';

	var inner_div = document.createElement('div');
	inner_div.id = 'rotatable';
	inner_div.addEventListener('paste', function(e) {
		// cancel paste
		e.preventDefault();
		// get text representation of clipboard
		var text = e.clipboardData.getData('text/plain');
		// insert text manually
		//document.execCommand('insertHTML', false, text);
		document.execCommand('insertText', false, text);
	});

	var p_element = document.createElement('p');
	p_element.className = 'clstextedit';
	var text_val = pagezone.content;
	if (text_val == undefined || text_val == null || text_val == '') {
		text_val = 'Double click to edit';
	} else {
		text_val = text_val.replace(/&nbsp;/g, ' ');
	}
	$(p_element).append(text_val);

	$(inner_div).append(p_element);
	$(pagezone_div).append(background_div);
	$(pagezone_div).append(inner_div);
	$('#PageDiv').append(pagezone_div);	

	refreshPagezone(pagezone);
}

function createImagezone(pagezone) {
	var pagezone_div = document.createElement('div');
	pagezone_div.id = 'PagezoneDiv' + pagezone.pagezoneid;
	pagezone_div.className = 'pagezone image_div active resizable';
	pagezone_div.unselectable = 'off';
	$(pagezone_div).attr('pagezoneid', pagezone.pagezoneid);
	$(pagezone_div).attr('zonetype', 'image');

	var background_div = document.createElement('div');
	background_div.id = 'background';

	var inner_div = document.createElement('div');
	inner_div.id = 'rotatable';
	$(inner_div).attr('imageid', 0);
	$(inner_div).attr('content', '');
	
	var img_element = document.createElement('img');

	$(inner_div).append(img_element);
	$(pagezone_div).append(background_div);
	$(pagezone_div).append(inner_div);
	$('#PageDiv').append(pagezone_div);

	refreshPagezone(pagezone);
}

function createOtherzone(pagezone) {
	var pagezone_div = document.createElement('div');
	pagezone_div.id = 'PagezoneDiv' + pagezone.pagezoneid;
	pagezone_div.className = 'pagezone image_div active resizable';
	$(pagezone_div).attr('pagezoneid', pagezone.pagezoneid);

	var background_div = document.createElement('div');
	background_div.id = 'background';

	var inner_div = document.createElement('div');
	inner_div.id = 'rotatable';
	
	var p_element = document.createElement('p');
	$(p_element).append(eval('common.view.pagezone_type_' + pagezone.type));

	$(inner_div).append(p_element);
	$(pagezone_div).append(background_div);
	$(pagezone_div).append(inner_div);
	$('#PageDiv').append(pagezone_div);

	refreshPagezone(pagezone);
}

function unselectAllZones() {
	for (var i=0; i<CurrentPage.pagezones.length; i++) {
		pagezone = CurrentPage.pagezones[i];
		var pagezonediv = $('#PagezoneDiv' + pagezone.pagezoneid);
		$(pagezonediv).css('z-index', pagezone.zindex);
		$(pagezonediv).css('cursor', 'default');
		$(pagezonediv).find('#rotatable').css('cursor', 'default');
		$(pagezonediv).removeClass('select_layer');
		$(pagezonediv).draggable('disable');
		$(pagezonediv).resizable('disable');
		$(pagezonediv).find('div.ui-resizable-handle').removeClass('select');
		$(pagezonediv).find('.ui-rotatable-handle').css('display', 'none');
	}
}

function selectZone(pagezone) {
	var pagezonediv = $('#PagezoneDiv' + pagezone.pagezoneid);
	//$(pagezonediv).css('z-index', '1000');
	$(pagezonediv).css('cursor', 'move');
	$(pagezonediv).find('#rotatable').css('cursor', 'move');
	$(pagezonediv).addClass('select_layer');
	$(pagezonediv).draggable('enable');
	$(pagezonediv).resizable('enable');
	$(pagezonediv).find('div.ui-resizable-handle').addClass('select');
	$(pagezonediv).find('.ui-rotatable-handle').css('display', 'block');
}

$('#PageDiv').live('click', function (e) {
	var that = this;
	setTimeout(function () {
		var dblclick = parseInt($(that).data('double'), 10);
		if (dblclick > 0) {
			$(that).data('double', dblclick - 1);
		} else {
			pagezoneClick.call(that, e, false);
		}
	}, 200);
});
$('#PageDiv').live('dblclick', function (e) {
	$(this).data('double', 2);
	pagezoneClick.call(this, e, true);
});	   

function pagezoneClick(e, dblclick){
	var scale = CurrentPage.width / $('#PageDiv').width();
	var offset = $(this).offset();
	var posX = (e.pageX - offset.left) * scale;
	var posY = (e.pageY - offset.top) * scale;
	var pagezones = CurrentPage.pagezones.filter(function (el) {
		var width = parseInt(el.width);
		var height = parseInt(el.height);
		var leftoffset = parseInt(el.leftoffset);
		var topoffset = parseInt(el.topoffset);
		return (posX > leftoffset) && (posX < (leftoffset + width)) && (posY > topoffset) && (posY < (topoffset + height));
	});
	if (pagezones.length > 0) {
		pagezones.sort(function(a, b) {
			return (parseInt(a.width) + parseInt(a.height) - parseInt(b.width) - parseInt(b.height));
		});

		if (validPagezone(CurrentPagezone)) {
			if ($('#rotatable[contenteditable=true]').length > 0) {
				return;
			}
			if (dblclick) {
				if (pagezones[0].type == 0) {
					CurrentPagezone = pagezones[0];
					var pagezonediv = $('#PagezoneDiv' + CurrentPagezone.pagezoneid);
					if (!$(pagezonediv).find('#rotatable').hasClass('dblclick')) {
						unselectAllZones();
						selectZone(CurrentPagezone);

						text_editable = 'dblclick';
						$(window).unbind('keydown');
						$(pagezonediv).find('#rotatable').css('cursor', 'text');
						$(pagezonediv).find('#rotatable').attr('contenteditable', true);
						$(pagezonediv).find('#rotatable').css('word-wrap', 'break-word');
						$(pagezonediv).find('#rotatable').trigger('focus');
						$(pagezonediv).draggable('disable');
						$('.ui-rotatable-handle').css('background', '#EEEEEE');
						//e.stopPropagation();
						$(pagezonediv).trigger('dblclick');
					}
					$(pagezonediv).resizable('disable');
					$(pagezonediv).find('.ui-rotatable-handle').css('display', 'none');
					$(pagezonediv).find('.ui-resizable-handle').removeClass('select');
					$(pagezonediv).draggable('disable');

					$(pagezonediv).find('#rotatable').attr('contenteditable', true);
					$(pagezonediv).find('#rotatable').addClass('dblclick');
					//$('.select_layer').find('#rotatable').selectText();
					$(pagezonediv).find('#rotatable').trigger('click');
					enterPagezoneFocus(CurrentPagezone);
				} else if (pagezones[0].type == 1) {
					CurrentPagezone = pagezones[0];
					$('#ImageLibraryModal').modal();
				} else {
					return;
				}
			} else {
				CurrentPagezone = pagezones[0];
				unselectAllZones();
				selectZone(CurrentPagezone)
				enterPagezoneFocus(CurrentPagezone);
			}
			
			e.stopPropagation();
		}
	}
}

//Text zone focus out function
$('.select_layer').find('#rotatable').live('focusout', function (e) {
	$('.text_div').find('#rotatable').removeClass('dblclick');
	$('.text_div').find('#rotatable').attr('contenteditable', false);
	text_editable = 'click';
});

function enterPagezoneFocus(pagezone) {
	if (pagezone == null) {
		$('#PagezoneEditPanel').css('display' , 'none');
		return;
	}
	$('#PagezoneEditPanel').css('display' , '');
	$('.pagezone-ctl').css('display', 'none');
	$('.zonetype-' + pagezone.type).css('display', 'block');
	$('#PagezoneEditForm1').loadJSON(pagezone);
	$('#PagezoneEditForm2').loadJSON(pagezone);
	$('#PagezoneEditForm3').loadJSON(pagezone);
	$('#PagezoneEditForm4').loadJSON(pagezone);
	$('#PagezoneEditForm5').loadJSON(pagezone);

	$('.colorPick').wColorPicker({
		theme			: 'classic',  // set theme
		opacity			: 0.8,		// opacity level
		color			: pagezone.color,  // set init color
		mode			: 'click',	 // mode for palette (flat, hover, click)
		position		: 'br',	   // position of palette, (tl, tc, tr, rt, rm, rb, br, bc, bl, lb, lm, lt)
		generateButton	: false,	   // if mode not flat generate button or not
		dropperButton	: false,	  // optional dropper button to use in other apps
		effect			: 'slide',	// only used when not in flat mode (none, slide, fade)
		showSpeed		: 200,		// show speed for effects
		hideSpeed		: 200,		// hide speed for effects
		onMouseover		: null,	   // callback for color mouseover
		onMouseout		: null,	   // callback for color mouseout
		onSelect		: function(color){
			if (color.indexOf('#') == 0) {
				$('.colorPick i').css('background', color);
				$('.colorPick input').val(color);
				CurrentPagezone.color = color;
				refreshPagezone(CurrentPagezone);
			}
		},
		onDropper	   : null		// callback when dropper is clicked
	});
	$('.colorPick i').css('background', pagezone.color);
	$('.colorPick input').val(pagezone.color);
	
	$('.bgcolorPick').wColorPicker({
		theme			: 'classic',  // set theme
		opacity			: 0.8,		// opacity level
		color			: pagezone.bgcolor,  // set init color
		mode			: 'click',	 // mode for palette (flat, hover, click)
		position		: 'br',	   // position of palette, (tl, tc, tr, rt, rm, rb, br, bc, bl, lb, lm, lt)
		generateButton	: false,	   // if mode not flat generate button or not
		dropperButton   : false,	  // optional dropper button to use in other apps
		effect			: 'slide',	// only used when not in flat mode (none, slide, fade)
		showSpeed		: 200,		// show speed for effects
		hideSpeed		: 200,		// hide speed for effects
		onMouseover		: null,	   // callback for color mouseover
		onMouseout		: null,	   // callback for color mouseout
		onSelect		: function(color) {
			if (color.indexOf('#') == 0) {
				$('.bgcolorPick i').css('background', color);
				$('.bgcolorPick input').val(color);
				CurrentPagezone.bgcolor = color;
				refreshPagezone(CurrentPagezone);
			}
		},
		onDropper		: null		// callback when dropper is clicked
	});
	$('.bgcolorPick i').css('background', pagezone.bgcolor);
	$('.bgcolorPick input').val(pagezone.bgcolor);

	$('.shadowcolorPick').wColorPicker({
		theme			: 'classic',  // set theme
		opacity			: 0.8,		// opacity level
		color			: pagezone.shadowcolor,  // set init color
		mode			: 'click',	 // mode for palette (flat, hover, click)
		position		: 'br',	   // position of palette, (tl, tc, tr, rt, rm, rb, br, bc, bl, lb, lm, lt)
		generateButton	: false,	   // if mode not flat generate button or not
		dropperButton   : false,	  // optional dropper button to use in other apps
		effect			: 'slide',	// only used when not in flat mode (none, slide, fade)
		showSpeed		: 200,		// show speed for effects
		hideSpeed		: 200,		// hide speed for effects
		onMouseover		: null,	   // callback for color mouseover
		onMouseout		: null,	   // callback for color mouseout
		onSelect		: function(color) {
			if (color.indexOf('#') == 0) {
				$('.shadowcolorPick i').css('background', color);
				$('.shadowcolorPick input').val(color);
				CurrentPagezone.shadowcolor = color;
				refreshPagezone(CurrentPagezone);
			}
		},
		onDropper		: null		// callback when dropper is clicked
	});
	$('.shadowcolorPick i').css('background', pagezone.shadowcolor);
	$('.shadowcolorPick input').val(pagezone.shadowcolor);

	$('.bdcolorPick').wColorPicker({
		theme			: 'classic',  // set theme
		opacity			: 0.8,		// opacity level
		color			: pagezone.bdcolor,  // set init color
		mode			: 'click',	 // mode for palette (flat, hover, click)
		position		: 'br',	   // position of palette, (tl, tc, tr, rt, rm, rb, br, bc, bl, lb, lm, lt)
		generateButton	: false,	   // if mode not flat generate button or not
		dropperButton   : false,	  // optional dropper button to use in other apps
		effect			: 'slide',	// only used when not in flat mode (none, slide, fade)
		showSpeed		: 200,		// show speed for effects
		hideSpeed		: 200,		// hide speed for effects
		onMouseover		: null,	   // callback for color mouseover
		onMouseout		: null,	   // callback for color mouseout
		onSelect		: function(color) {
			if (color.indexOf('#') == 0) {
				$('.bdcolorPick i').css('background', color);
				$('.bdcolorPick input').val(color);
				CurrentPagezone.bdcolor = color;
				refreshPagezone(CurrentPagezone);
			}
		},
		onDropper		: null		// callback when dropper is clicked
	});
	$('.bdcolorPick i').css('background', pagezone.bdcolor);
	$('.bdcolorPick input').val(pagezone.bdcolor);

	$('.opacityRange').ionRangeSlider({
		min: 0,
		max: 255,
		from: 255,
		type: 'single',
		step: 5,
		hasGrid: false,
		onChange: function(data) {
			CurrentPagezone.opacity = $('input[name=opacity]').val();
			refreshPagezone(CurrentPagezone);
		}
	});
	$('.opacityRange').ionRangeSlider('update', {
		from: pagezone.opacity
	});

	$('.bgopacityRange').ionRangeSlider({
		min: 0,
		max: 255,
		from: 255,
		type: 'single',
		step: 5,
		hasGrid: false,
		onChange: function(data) {
			CurrentPagezone.bgopacity = $('input[name=bgopacity]').val();
			refreshPagezone(CurrentPagezone);
		}
	});
	$('.bgopacityRange').ionRangeSlider('update', {
		from: pagezone.bgopacity
	});

	$('#spinner-fontsize').spinner();
	$('#spinner-fontsize').spinner('setting', {value:parseInt(pagezone.fontsize), step: 1, min: 12, max: 255});
	$('#spinner-lineheight').spinner();
	$('#spinner-lineheight').spinner('setting', {value:parseInt(pagezone.lineheight), step: 1, min: 0, max: 255});
	$('#spinner-padding').spinner();
	$('#spinner-padding').spinner('setting', {value:parseInt(pagezone.padding), step: 1, min: 0, max: 255});

	$('#spinner-shadowh').spinner();
	$('#spinner-shadowh').spinner('setting', {value:parseInt(pagezone.shadowh), step: 1, min: -99, max: 99});
	$('#spinner-shadowv').spinner();
	$('#spinner-shadowv').spinner('setting', {value:parseInt(pagezone.shadowv), step: 1, min: -99, max: 99});
	$('#spinner-shadowblur').spinner();
	$('#spinner-shadowblur').spinner('setting', {value:parseInt(pagezone.shadowblur), step: 1, min: 0, max: 99});
	
	$('#spinner-bdwidth').spinner();
	$('#spinner-bdwidth').spinner('setting', {value:parseInt(pagezone.bdwidth), step: 1, min: 0, max: 99});
	$('#spinner-bdtl').spinner();
	$('#spinner-bdtl').spinner('setting', {value:parseInt(pagezone.bdtl), step: 1, min: 0, max: 255});
	$('#spinner-bdtr').spinner();
	$('#spinner-bdtr').spinner('setting', {value:parseInt(pagezone.bdtr), step: 1, min: 0, max: 255});
	$('#spinner-bdbl').spinner();
	$('#spinner-bdbl').spinner('setting', {value:parseInt(pagezone.bdbl), step: 1, min: 0, max: 255});
	$('#spinner-bdbr').spinner();
	$('#spinner-bdbr').spinner('setting', {value:parseInt(pagezone.bdbr), step: 1, min: 0, max: 255});

	refreshLocSpinners(pagezone);
	refreshFontStyle();
	refreshFontFamilySelect();
	refreshBdstyleSelect();
}

function refreshLocSpinners(pagezone) {
	$('#spinner-x').spinner();
	$('#spinner-x').spinner('setting', {value:parseInt(pagezone.leftoffset), step: 1, min: 0, max: parseInt(CurrentPage.width)-parseInt(pagezone.width)});
	$('#spinner-y').spinner();
	$('#spinner-y').spinner('setting', {value:parseInt(pagezone.topoffset), step: 1, min: 0, max: parseInt(CurrentPage.height)-parseInt(pagezone.height)});
	$('#spinner-w').spinner();
	$('#spinner-w').spinner('setting', {value:parseInt(pagezone.width), step: 1, min: 1, max: parseInt(CurrentPage.width)-parseInt(pagezone.leftoffset)});
	$('#spinner-h').spinner();
	$('#spinner-h').spinner('setting', {value:parseInt(pagezone.height), step: 1, min: 1, max: parseInt(CurrentPage.height)-parseInt(pagezone.topoffset)});
}

$('.collapse').on('shown.bs.collapse', function () {
	$('.opacityRange').ionRangeSlider('update');
	$('.bgopacityRange').ionRangeSlider('update');
});

$('.spinner').on('change', function(e) {
	CurrentPagezone.fontsize = $('#spinner-fontsize').spinner('value');
	CurrentPagezone.lineheight = $('#spinner-lineheight').spinner('value');
	CurrentPagezone.padding = $('#spinner-padding').spinner('value');
	CurrentPagezone.leftoffset = $('#spinner-x').spinner('value');
	CurrentPagezone.topoffset = $('#spinner-y').spinner('value');
	CurrentPagezone.width = $('#spinner-w').spinner('value');
	CurrentPagezone.height = $('#spinner-h').spinner('value');
	CurrentPagezone.shadowh = $('#spinner-shadowh').spinner('value');
	CurrentPagezone.shadowv = $('#spinner-shadowv').spinner('value');
	CurrentPagezone.shadowblur = $('#spinner-shadowblur').spinner('value');
	CurrentPagezone.bdwidth = $('#spinner-bdwidth').spinner('value');
	CurrentPagezone.bdtl = $('#spinner-bdtl').spinner('value');
	CurrentPagezone.bdtr = $('#spinner-bdtr').spinner('value');
	CurrentPagezone.bdbl = $('#spinner-bdbl').spinner('value');
	CurrentPagezone.bdbr = $('#spinner-bdbr').spinner('value');
	refreshPagezone(CurrentPagezone);
});	

$('.pix-bold').on('click', function(event) {
	if (CurrentPagezone.fontweight == 'bold') {
		CurrentPagezone.fontweight = 'normal';
	} else {
		CurrentPagezone.fontweight = 'bold';
	}
	refreshFontStyle();
	refreshPagezone(CurrentPagezone);
});	
$('.pix-italic').on('click', function(event) {
	if (CurrentPagezone.fontstyle == 'italic') {
		CurrentPagezone.fontstyle = 'normal';
	} else {
		CurrentPagezone.fontstyle = 'italic';
	}
	refreshFontStyle();
	refreshPagezone(CurrentPagezone);
});	
$('.pix-underline').on('click', function(event) {
	if (CurrentPagezone.decoration == 'underline') {
		CurrentPagezone.decoration = 'none';
	} else {
		CurrentPagezone.decoration = 'underline';
	}
	refreshFontStyle();
	refreshPagezone(CurrentPagezone);
});	
$('.pix-strikethrough').on('click', function(event) {
	if (CurrentPagezone.decoration == 'line-through') {
		CurrentPagezone.decoration = 'none';
	} else {
		CurrentPagezone.decoration = 'line-through';
	}
	refreshFontStyle();
	refreshPagezone(CurrentPagezone);
});
$('.pix-align-left').on('click', function(event) {
	if (CurrentPagezone.align == 'left') {
		CurrentPagezone.align = '';
	} else {
		CurrentPagezone.align = 'left';
	}
	refreshFontStyle();
	refreshPagezone(CurrentPagezone);
});	
$('.pix-align-right').on('click', function(event) {
	if (CurrentPagezone.align == 'right') {
		CurrentPagezone.align = '';
	} else {
		CurrentPagezone.align = 'right';
	}
	refreshFontStyle();
	refreshPagezone(CurrentPagezone);
});	
$('.pix-align-center').on('click', function(event) {
	if (CurrentPagezone.align == 'center') {
		CurrentPagezone.align = '';
	} else {
		CurrentPagezone.align = 'center';
	}
	refreshFontStyle();
	refreshPagezone(CurrentPagezone);
});	
$('.pix-align-justify').on('click', function(event) {
	if (CurrentPagezone.align == 'justify') {
		CurrentPagezone.align = '';
	} else {
		CurrentPagezone.align = 'justify';
	}
	refreshFontStyle();
	refreshPagezone(CurrentPagezone);
});	

function refreshFontStyle() {
	if (CurrentPagezone.fontweight == 'bold') {
		$('.pix-bold').removeClass('default');
		$('.pix-bold').addClass('blue');
	} else {
		$('.pix-bold').removeClass('blue');
		$('.pix-bold').addClass('default');
	}
	if (CurrentPagezone.fontstyle == 'italic') {
		$('.pix-italic').removeClass('default');
		$('.pix-italic').addClass('blue');
	} else {
		$('.pix-italic').removeClass('blue');
		$('.pix-italic').addClass('default');
	}
	if (CurrentPagezone.decoration == 'underline') {
		$('.pix-underline').removeClass('default');
		$('.pix-underline').addClass('blue');
		$('.pix-strikethrough').removeClass('blue');
		$('.pix-strikethrough').addClass('default');
	} else if (CurrentPagezone.decoration == 'line-through') {
		$('.pix-underline').removeClass('blue');
		$('.pix-underline').addClass('default');
		$('.pix-strikethrough').removeClass('default');
		$('.pix-strikethrough').addClass('blue');
	} else {
		$('.pix-underline').removeClass('blue');
		$('.pix-underline').addClass('default');
		$('.pix-strikethrough').removeClass('blue');
		$('.pix-strikethrough').addClass('default');
	}
	if (CurrentPagezone.align == 'left') {
		$('.pix-align-left').removeClass('default');
		$('.pix-align-left').addClass('blue');
		$('.pix-align-right').removeClass('blue');
		$('.pix-align-right').addClass('default');
		$('.pix-align-center').removeClass('blue');
		$('.pix-align-center').addClass('default');
		$('.pix-align-justify').removeClass('blue');
		$('.pix-align-justify').addClass('default');
	} else if (CurrentPagezone.align == 'right') {
		$('.pix-align-left').removeClass('blue');
		$('.pix-align-left').addClass('default');
		$('.pix-align-right').removeClass('default');
		$('.pix-align-right').addClass('blue');
		$('.pix-align-center').removeClass('blue');
		$('.pix-align-center').addClass('default');
		$('.pix-align-justify').removeClass('blue');
		$('.pix-align-justify').addClass('default');
	} else if (CurrentPagezone.align == 'center') {
		$('.pix-align-left').removeClass('blue');
		$('.pix-align-left').addClass('default');
		$('.pix-align-right').removeClass('blue');
		$('.pix-align-right').addClass('default');
		$('.pix-align-center').removeClass('default');
		$('.pix-align-center').addClass('blue');
		$('.pix-align-justify').removeClass('blue');
		$('.pix-align-justify').addClass('default');
	} else if (CurrentPagezone.align == 'justify') {
		$('.pix-align-left').removeClass('blue');
		$('.pix-align-left').addClass('default');
		$('.pix-align-right').removeClass('blue');
		$('.pix-align-right').addClass('default');
		$('.pix-align-center').removeClass('blue');
		$('.pix-align-center').addClass('default');
		$('.pix-align-justify').removeClass('default');
		$('.pix-align-justify').addClass('blue');
	} else {
		$('.pix-align-left').removeClass('blue');
		$('.pix-align-left').addClass('default');
		$('.pix-align-right').removeClass('blue');
		$('.pix-align-right').addClass('default');
		$('.pix-align-center').removeClass('blue');
		$('.pix-align-center').addClass('default');
		$('.pix-align-justify').removeClass('blue');
		$('.pix-align-justify').addClass('default');
	}
}

function refreshFontFamilySelect() {
	var families = ['actor', 'advent pro', 'Architects Daughter', 'arial', 'Ariblk', 'arizonia', 'armata', 'AvantGardeLT Bookoblique', 
	                'AvantGardeLT Demi', 'BankGothicBold', 'BankGothicMedium', 'Bebas', 'belgrano', 'belleza', 'berlinsans', 'Bookman old', 
	                'Bookman old bi', 'Bookman old bold', 'Bookman old italic', 'candara', 'Century_Gothic', 'Century_Gothic_Bold', 
	                'ChaparralPro', 'ChaparralProBold', 'ComicSansMS', 'Cooper Std Black', 'Courgette-Regular', 'Curlz MT', 
	                'DJBAlmostPerfect', 'Diplomata', 'DiplomataSC', 'doppio one', 'DroidSans', 'electrolize', 'Eras BD', 'Forte', 'Fradm', 
	                'Fradmcn', 'Fradmit', 'Frahv', 'Frahvit', 'Framd', 'Framdcn', 'Framdit', 'FrederickatheGreat', 'fredoka one', 'Freeskpt', 
	                'Futura XBlk BT', 'gadugi', 'GoboldBoldItalic', 'Gothambold', 'Gothambook', 'Gothammedium', 'Humanist521', 'karla', 
	                'londrina solid', 'MV Boli', 'marven pro', 'MfReallyAwesome', 'MyriadPro', 'norican', 'nova slim', 'nunito', 'orbitron', 
	                'overlock', 'PT sana narrow', 'parisienne', 'Permanent Marker', 'philosopher', 'pontano sans', 'pratas', 'quando', 
	                'quixotic', 'RobotoBold', 'RobotoMedium', 'RobotoRegular', 'rockwell', 'RockwellExtraBold', 'russo one', 'Rye', 'sanchez', 
	                'sarina', 'Scandinavian', 'Scandinavian Black', 'SegoePrint', 'SegoeUI', 'SegoeUIB', 'signika', 'SketchBlock', 
	                'Taco modern', 'texgyreadventor-bold', 'Timesnewroman', 'trocchi', 'TwentyEightDaysLater', 'VastShadow', 'Verdana', 
	                'yesteryear', 'twentyDaysLater'];
	var familylist = [];
	for (var i=0; i<families.length; i++) {
		familylist.push({
			id: families[i],
			text: families[i],
		})
	}
	$('#FontFamilySelect').select2({
		placeholder: common.tips.detail_select,
		minimumInputLength: 0,
		data: familylist,
		formatResult: function(data) {
			return '<span style="font-family: ' + data.text + '">' + data.text + '</span>'
		},
		formatSelection: function(data) {
			return '<span style="font-family: ' + data.text + '">' + data.text + '</span>'
		},
		initSelection: function(element, callback) {
			if (CurrentPagezone != null) {
				callback({id: CurrentPagezone.fontfamily, text: CurrentPagezone.fontfamily });
			}
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});
}
$('#FontFamilySelect').on('change', function(e) {
	if ($('#FontFamilySelect').select2('data') != null) {
		CurrentPagezone.fontfamily = $('#FontFamilySelect').select2('data').id;
	}
	refreshPagezone(CurrentPagezone);
});	

function refreshBdstyleSelect() {
	var bdstylelist = [
		{id: 'solid', text: 'solid'},
		{id: 'dashed', text: 'dashed'},
		{id: 'dotted', text: 'dotted'},
	];
	$('#BdstyleSelect').select2({
		placeholder: common.tips.detail_select,
		minimumInputLength: 0,
		data: bdstylelist,
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});
}
$('#BdstyleSelect').on('change', function(e) {
	if ($('#BdstyleSelect').select2('data') != null) {
		CurrentPagezone.bdstyle = $('#BdstyleSelect').select2('data').id;
	}
	refreshPagezone(CurrentPagezone);
});	

function validPagezone(pagezone) {
	if (pagezone != null && pagezone.type == 0) {
		var pagezoneDiv = $('#PagezoneDiv' + pagezone.pagezoneid);
		var content = $(pagezoneDiv).find('p').html();
		console.log(content);
		if (content != 'Double click to edit') {
			pagezone.content = content;
		} else {
			pagezone.content = '';
		}
	}
	return true;
}

var template_select_option = {
	placeholder: common.tips.detail_select,
	minimumInputLength: 0,
	ajax: { 
		url: 'page!templatelist.action',
		type: 'GET',
		dataType: 'json',
		data: function (term, page) {
			return {
				sSearch: term, 
				iDisplayStart: (page-1)*10,
				iDisplayLength: 10,
				pagepkgid: 0,
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
		var html = '<span><img src="/pixsigdata' + data.page.snapshot + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.page.name + '</span>'
		return html;
	},
	dropdownCssClass: 'bigdrop', 
	escapeMarkup: function (m) { return m; } 
};

$('#TemplateSelect').select2(template_select_option);



//新增pagezone
$('body').on('click', '.pix-addzone', function(event) {
	var zonetype = $(event.target).attr('zonetype');
	if (zonetype == undefined) {
		zonetype = $(event.target).parent().attr('zonetype');
	}
	
	var pagezones = CurrentPage.pagezones.filter(function (el) {
		return el.type == zonetype;
	});
	if (pagezones.length >= ZoneLimits[zonetype] ) {
		return;
	}
	
	var pagezone = {};
	pagezone.pagezoneid = '-' + Math.round(Math.random()*100000000);
	pagezone.pageid = CurrentPageid;
	pagezone.name = 'Zone_' + zonetype;
	pagezone.type = zonetype;
	pagezone.leftoffset = CurrentPage.height * 0.1;
	pagezone.topoffset = CurrentPage.width * 0.1;
	if (ZoneRatios[zonetype] != undefined) {
		pagezone.width = CurrentPage.width * 0.2;
		pagezone.height = CurrentPage.width * 0.2 / ZoneRatios[zonetype];
	} else {
		pagezone.width = CurrentPage.width * 0.2;
		pagezone.height = CurrentPage.height * 0.2;
	}
	if (pagezone.type == 1) {
		pagezone.zindex = 51;
	} else {
		pagezone.zindex = 52;
	}
	pagezone.transform = 'matrix(1, 0, 0, 1, 0, 0)';
	pagezone.bdcolor = '#000000';
	pagezone.bdstyle = 'solid';
	pagezone.bdwidth = 0;
	pagezone.bdtl = 0;
	pagezone.bdtr = 0;
	pagezone.bdbl = 0;
	pagezone.bdbr = 0;
	pagezone.bgcolor = '#999999';
	pagezone.bgopacity = 120;
	pagezone.opacity = 255;
	pagezone.padding = 0;
	pagezone.shadowh = 0;
	pagezone.shadowv = 0;
	pagezone.shadowblur = 0;
	pagezone.shadowcolor = '#000000';
	pagezone.color = '#FFFFFF';
	pagezone.fontfamily = 'DroidSans';
	pagezone.fontsize = 40;
	pagezone.fontweight = 'normal';
	pagezone.fontstyle = 'normal';
	pagezone.decoration = 'none';
	pagezone.align = 'start';
	pagezone.lineheight = 80;
	pagezone.content = '';
	
	CurrentPage.pagezones[CurrentPage.pagezones.length] = pagezone;
	
	unselectAllZones();
	if (zonetype == 0) {
		createTextzone(pagezone);
	} else if (zonetype == 1) {
		createImagezone(pagezone);
	} else {
		createOtherzone(pagezone);
	}
	CurrentPagezone = pagezone;
	initOperation(pagezone);
	selectZone(CurrentPagezone);
	enterPagezoneFocus(pagezone);
});


//图片table初始化
$('#ImageTable thead').css('display', 'none');
$('#ImageTable tbody').css('display', 'none');	
var imagehtml = '';
$('#ImageTable').dataTable({
	'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 18, 30, 48, 96 ],
					  [ 18, 30, 48, 96 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'image!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.filename, 'mData' : 'filename', 'bSortable' : false }, 
					{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'imageid', 'bSortable' : false }],
	'iDisplayLength' : 18,
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
		imagehtml += '<a class="btn default btn-sm green pix-pagezone-image-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
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
$('#ImageTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
$('#ImageTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
$('#ImageTable').css('width', '100%');

$('#ImageLibraryModal').on('shown.bs.modal', function (e) {
	refreshMediaTable();
	var pagezoneDiv = $('#PagezoneDiv' + CurrentPagezone.pagezoneid);
	$('#ImageLibraryPreview').height($('#ImageLibraryPreview').width());
	$('#ImageLibraryPreview').attr('imageid', CurrentPagezone.objid);
	$('#ImageLibraryPreview').attr('content', CurrentPagezone.content);
	$('#ImageLibraryPreview').attr('owidth', $(pagezoneDiv).find('#rotatable').attr('owidth'));
	$('#ImageLibraryPreview').attr('oheight', $(pagezoneDiv).find('#rotatable').attr('oheight'));
	displayLibraryPreview();
})

function displayLibraryPreview() {
	var backgroundimage = $('#ImageLibraryPreview').attr('content');
	if (backgroundimage != '') {
		$('#ImageLibraryPreview').css('background-image', 'url(/pixsigdata' + backgroundimage + ')');
		var owidth = parseInt($('#ImageLibraryPreview').attr('owidth'));
		var oheight = parseInt($('#ImageLibraryPreview').attr('oheight'));
		var background_size = 'auto auto';
		if (owidth >= $('#ImageLibraryPreview').width() || oheight >= $('#ImageLibraryPreview').height()) {
			if (owidth > oheight) {
				background_size = '100% auto';
			} else {
				background_size = 'auto 100%';
			}
		}
		$('#ImageLibraryPreview').css('background-size', background_size);
		$('#ImageLibraryPreview').css('background-position', 'center');
		$('#ImageLibraryPreview').css('background-repeat', 'no-repeat');
	} else {
		$('#ImageLibraryPreview').css('background-image', '');
	}
}

$('body').on('click', '.pix-image-library', function(event) {
	$('#ImageLibraryModal').modal();
});

$('body').on('click', '.pix-pagezone-image-add', function(event) {
	var rowIndex = $(event.target).attr('data-id');
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#ImageTable').dataTable().fnGetData(rowIndex);
	$('#ImageLibraryPreview').attr('imageid', data.imageid);
	$('#ImageLibraryPreview').attr('content', data.filepath);
	$('#ImageLibraryPreview').attr('owidth', data.width);
	$('#ImageLibraryPreview').attr('oheight', data.height);
	displayLibraryPreview();
});

$('#ImageLibraryModal button[type=submit]').click(function(event) {
	CurrentPagezone.objid = $('#ImageLibraryPreview').attr('imageid');
	CurrentPagezone.content = $('#ImageLibraryPreview').attr('content');
	refreshPagezone(CurrentPagezone);
	$('#ImageLibraryModal').modal('hide');
});

initMediaBranchTree();
function initMediaBranchTree() {
	$.ajax({
		type : 'POST',
		url : 'branch!list.action',
		data : {},
		success : function(data, status) {
			if (data.errorcode == 0) {
				var branches = data.aaData;
				CurrentMediaBranchid = branches[0].branchid;
				
				if ( $('#MediaBranchTreeDiv').length > 0 ) {
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
				
				if ( $('#MediaFolderTreeDiv').length > 0 ) {
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
function refreshMediaTable() {
	$('#ImageTable').dataTable()._fnAjaxUpdate();
}

$('[type=submit]', $('#PageModal')).on('click', function(event) {
	if (submitflag) {
		return;
	}
	submitflag = true;
	Metronic.blockUI({
		zIndex: 20000,
		animate: true
	});
	$('#snapshot_div').show();
	redrawPagePreview($('#snapshot_div'), CurrentPage, 1024);
	html2canvas($('#snapshot_div'), {
		onrendered: function(canvas) {
			//console.log(canvas.toDataURL());
			CurrentPage.snapshotdtl = canvas.toDataURL();
			$('#snapshot_div').hide();

			$.ajax({
				type : 'POST',
				url : 'page!design.action',
				data : '{"page":' + $.toJSON(CurrentPage) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					submitflag = false;
					Metronic.unblockUI();
					$('#PageModal').modal('hide');
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
					$('#PageModal').modal('hide');
					console.log('failue');
				}
			});
		}
	});
});


$(document).keydown(function (e) {
	if (e.which == 13 && text_editable == 'dblclick') {
		if (window.getSelection) {
			var selection = window.getSelection();
			var range = selection.getRangeAt(0);
			var br = document.createElement('br');
			var textNode = document.createTextNode('\u00a0'); //Passing ' ' directly will not end up being shown correctly
			range.deleteContents();//required or not?
			range.insertNode(br);
			range.collapse(false);
			range.insertNode(textNode);
			range.selectNodeContents(textNode);
			selection.removeAllRanges();
			selection.addRange(range);
			return false;
		}
	}
	if (CurrentPagezone != null) {
		var pagezonediv = $('#PagezoneDiv' + CurrentPagezone.pagezoneid);
		var status = $(pagezonediv).find('#rotatable').hasClass('dblclick');
		if ((e.which == 46) && (status === false) && ((e.target.tagName).toLowerCase() !== 'input')) {
			bootbox.confirm(common.tips.remove + eval('common.view.pagezone_type_' + CurrentPagezone.type), function(result) {
				if (result == true) {
					CurrentPage.pagezones.splice(CurrentPage.pagezones.indexOf(CurrentPagezone), 1);
					CurrentPagezone = null;
					$(pagezonediv).remove();
					enterPagezoneFocus(CurrentPagezone);
				}
			 });
		}
	}
});


// 推送终端
$('#PushModal').on('shown.bs.modal', function (e) {
	initDeviceBranchTree();
})

var SelectedDeviceList = [];
var SelectedDevicegroupList = [];
var CurrentDeviceBranchid;

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
						$('#DeviceGroupTable').dataTable()._fnAjaxUpdate();
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
							$('#DeviceGroupTable').dataTable()._fnAjaxUpdate();
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

//推送对话框中的设备table初始化
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
					{'sTitle' : common.view.operation, 'mData' : 'deviceid', 'bSortable' : false }],
	'iDisplayLength' : 20,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
		$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-adddevice">' + common.view.add + '</button>');
		return nRow;
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'branchid','value':CurrentDeviceBranchid });
		aoData.push({'name':'devicegroupid','value':'0' });
	}
});
jQuery('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');

//推送对话框中的设备组table初始化
$('#DeviceGroupTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 20, 40, 60, 100 ],
					[ 20, 40, 60, 100 ] 
					],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'devicegroup!list.action',
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

//推送对话框中的右侧设备选择列表初始化
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

//推送对话框中的右侧设备组选择列表初始化
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

//推送对话框中，增加终端到终端列表
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

//推送对话框中，增加终端组到终端组列表
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

//推送对话框中，删除设备列表某行
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

//推送对话框中，删除设备组列表某行
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
	CurrentPage = $('#MyTable').dataTable().fnGetData(index);
	CurrentPageid = CurrentPage.pageid;
	
	$('#SelectedDeviceTable').dataTable().fnClearTable();
	$('#SelectedDevicegroupTable').dataTable().fnClearTable();
	SelectedDeviceList = [];
	SelectedDevicegroupList = [];
	$('#PushModal').modal();
});

//在终端对话框中进行提交
$('[type=submit]', $('#PushModal')).on('click', function(event) {
	$.ajax({
		type : 'POST',
		url : 'page!push.action',
		data : '{"page": { "pageid":' + CurrentPage.pageid + '}, "devices":' + $.toJSON(SelectedDeviceList) + ', "devicegroups":' + $.toJSON(SelectedDevicegroupList) + '}',
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

