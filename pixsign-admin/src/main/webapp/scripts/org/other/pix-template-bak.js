var submitflag = false;

var ZoneLimits = [];
ZoneLimits['0'] = 1000;
ZoneLimits['1'] = 1000;
ZoneLimits['11'] = 1;
ZoneLimits['12'] = 1;
ZoneLimits['13'] = 1;
ZoneLimits['14'] = 1;

var ZoneRatios = [];

var TemplateScale = 1;

var CurrentTemplate;
var CurrentTemplateid;
var CurrentTemplatezone;

var CurrentMediaBranchid;
var CurrentMediaFolderid;

$('#MyTable thead').css('display', 'none');
$('#MyTable tbody').css('display', 'none');
var templatehtml = '';
var oTable = $('#MyTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 16, 36, 72, 108 ],
						[ 16, 36, 72, 108 ] 
						],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : 'template!list.action',
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.ratio, 'mData' : 'ratio', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'templateid', 'bSortable' : false }],
	'iDisplayLength' : 16,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#TemplateContainer').length < 1) {
			$('#MyTable').append('<div id="TemplateContainer"></div>');
		}
		$('#TemplateContainer').html(''); 
		return true;
	},
	'fnServerParams': function(aoData) {
		aoData.push({'name':'templatepkgid','value':0 });
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 4 == 0) {
			templatehtml = '';
			templatehtml += '<div class="row" >';
		}
		templatehtml += '<div class="col-md-3 col-xs-3">';
		templatehtml += '<h3>' + aData.name + '</h3>';
		if (aData.ratio == 1) {
			templatehtml += '<h6><span class="label label-sm label-info">' + common.view.template_ratio_1 + '</span></h6>';
		} else if (aData.ratio == 2) {
			templatehtml += '<h6><span class="label label-sm label-success">' + common.view.template_ratio_2 + '</span></h6>';
		}

		if (aData.snapshot != null) {
			templatehtml += '<a class="fancybox" href="/pixsigndata' + aData.snapshot + '?t=' + new Date().getTime() + '" title="' + aData.name + '">';
			templatehtml += '<div class="thumbs">';
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			templatehtml += '<img src="/pixsigndata' + aData.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
			templatehtml += '</div></a>';
		} else {
			templatehtml += '<div class="thumbs">';
			templatehtml += '</div>';
		}
		
		templatehtml += '<div privilegeid="101010">';
		templatehtml += '<a href="javascript:;" templateid="' + aData.templateid + '" class="btn default btn-xs green pix-template"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
		templatehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
		templatehtml += '</div>';

		templatehtml += '</div>';
		if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
			templatehtml += '</div>';
			if ((iDisplayIndex+1) != $('#MyTable').dataTable().fnGetData().length) {
				templatehtml += '<hr/>';
			}
			$('#TemplateContainer').append(templatehtml);
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

OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
FormValidateOption.rules['template.name'] = {};
FormValidateOption.rules['template.name']['required'] = true;
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
	refreshForm('MyEditForm');
	$('#MyEditForm').attr('action', 'template!add.action');
	$('.hide-update').css('display', 'block');
	CurrentTemplate = null;
	CurrentTemplateid = 0;
	$('#MyEditModal').modal();
});			


$('body').on('click', '.pix-update', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentTemplate = $('#MyTable').dataTable().fnGetData(index);
	CurrentTemplateid = CurrentTemplate.templateid;

	var formdata = new Object();
	for (var name in CurrentTemplate) {
		formdata['template.' + name] = CurrentTemplate[name];
	}
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', 'template!update.action');
	$('.hide-update').css('display', 'none');
	$('#MyEditModal').modal();
});

$('body').on('click', '.pix-delete', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentTemplate = $('#MyTable').dataTable().fnGetData(index);
	CurrentTemplateid = CurrentTemplate.templateid;
	bootbox.confirm(common.tips.remove + CurrentTemplate.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : 'template!delete.action',
				cache: false,
				data : {
					'template.templateid': CurrentTemplateid
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


$('body').on('click', '.pix-template', function(event) {
	var templateid = $(event.target).attr('templateid');
	if (templateid == undefined) {
		templateid = $(event.target).parent().attr('templateid');
	}
	$.ajax({
		type : 'GET',
		url : 'template!get.action',
		data : {templateid: templateid},
		success : function(data, status) {
			if (data.errorcode == 0) {
				CurrentTemplate = data.template;
				CurrentTemplateid = CurrentTemplate.templateid;
				CurrentTemplatezone = null;
				$('#TemplateModal').modal();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
});

$('#TemplateModal').on('shown.bs.modal', function (e) {
	$('#TemplatezoneEditPanel').css('display' , 'none');
	$('#TemplateDiv').empty();
	$('#TemplateDiv').css('position', 'relative');
	$('#TemplateDiv').css('margin-left', 'auto');
	$('#TemplateDiv').css('margin-right', 'auto');
	$('#TemplateDiv').css('border', '1px solid #000');
	if (CurrentTemplate.width > CurrentTemplate.height) {
		var width = Math.floor($('#TemplateDiv').parent().width());
		TemplateScale = CurrentTemplate.width / width;
		var height = CurrentTemplate.height / TemplateScale;
	} else {
		var height = Math.floor($('#TemplateDiv').parent().width());
		TemplateScale = CurrentTemplate.height / height;
		var width = CurrentTemplate.width / TemplateScale;
	}
	$('#TemplateDiv').css('width' , width);
	$('#TemplateDiv').css('height' , height);
	
	var templatezones = CurrentTemplate.templatezones;
	for (var i=0; i<templatezones.length; i++) {
		if (templatezones[i].type == '0') {
			createTextzone(templatezones[i]);
		} else if (templatezones[i].type == '1') {
			createImagezone(templatezones[i]);
		} else {
			createOtherzone(templatezones[i]);
		}
		initOperation(templatezones[i]);
	}
	unselectAllZones();
})

function updateTemplatezonePos(e, ui) {
	var templatezoneid = $(this).attr('templatezoneid');
	var templatezones = CurrentTemplate.templatezones.filter(function (el) {
		return el.templatezoneid == templatezoneid;
	});

	var l = $(this).position().left / $('#TemplateDiv').width();
	var t = $(this).position().top / $('#TemplateDiv').height();
	var w = $(this).width() / $('#TemplateDiv').width();
	var h = $(this).height() / $('#TemplateDiv').height();
	/*
	if (ZoneRatios[templatezones[0].type] != undefined) {
		var w = $(this).width() / $('#TemplateDiv').width();
		var h = $(this).width() / parseFloat(ZoneRatios[templatezones[0].type]) / $('#TemplateDiv').height();
		if (t + h > 1) {
			h = 1 - t;
			w = h * $('#TemplateDiv').height() * parseFloat(ZoneRatios[templatezones[0].type]) / $('#TemplateDiv').width();
		}
	}*/
	//$(this).css('width' , (100 * parseFloat(w)) + '%');
	//$(this).css('height' , (100 * parseFloat(h)) + '%');
	//$(this).css('left' , (100 * parseFloat(l)) + '%');
	//$(this).css('top' , (100 * parseFloat(t)) + '%');

	templatezones[0].width = Math.round(CurrentTemplate.width * w, 0);
	templatezones[0].height = Math.round(CurrentTemplate.height * h, 0);
	templatezones[0].leftoffset = Math.round(CurrentTemplate.width * l, 0);
	templatezones[0].topoffset = Math.round(CurrentTemplate.height * t, 0);
	refreshLocSpinners(templatezones[0]);
}

function initOperation(templatezone) {
	var templatezoneDiv = $('#TemplatezoneDiv' + templatezone.templatezoneid);
	$(templatezoneDiv).draggable({
		containment: '#TemplateDiv',
		//stop: regionPositionUpdate,
		drag: updateTemplatezonePos,
	});
	
	$(templatezoneDiv).resizable({
		containment: '#TemplateDiv',
		aspectRatio: false,
		handles: 'ne, nw, se, sw',
		stop: updateTemplatezonePos,
	});
	if (isOpera) {
		var tr = $(templatezoneDiv).css('-o-transform').replace('matrix(', '').replace(')', '');
	} else if (isFirefox) {
		tr = $(templatezoneDiv).css('-moz-transform').replace('matrix(', '').replace(')', '');
	} else if (isChrome || isSafari) {
		tr = $(templatezoneDiv).css('-webkit-transform').replace('matrix(', '').replace(')', '');
	}
	$(templatezoneDiv).find('#rotatable').rotatable({
		mtx: [tr], 
		onrotate: function (a) {
			//set_rotation_angle_spinner_value(a);
		}
	});
}

function refreshTemplatezone(templatezone) {
	var templatezoneDiv = $('#TemplatezoneDiv' + templatezone.templatezoneid);
	$(templatezoneDiv).css({
		'position': 'absolute',
		'width': 100*templatezone.width/CurrentTemplate.width + '%',
		'height': 100*templatezone.height/CurrentTemplate.height + '%',
		'top': 100*templatezone.topoffset/CurrentTemplate.height + '%', 
		'left': 100*templatezone.leftoffset/CurrentTemplate.width + '%', 
		'z-index': templatezone.zindex,
		'-moz-transform': templatezone.transform,
		'-webkit-transform': templatezone.transform,
	});
	$(templatezoneDiv).find('#background').css({
		'position': 'absolute',
		'width': '100%',
		'height': '100%',
		'background': templatezone.bgcolor, 
		'opacity': parseInt(templatezone.bgopacity)/255, 
	});
	if (templatezone.type == 0) {
		var shadow = '';
		shadow += (parseInt(templatezone.shadowh) / TemplateScale) + 'px ';
		shadow += (parseInt(templatezone.shadowv) / TemplateScale) + 'px ';
		shadow += (parseInt(templatezone.shadowblur) / TemplateScale) + 'px ';
		shadow += templatezone.shadowcolor;
		$(templatezoneDiv).find('#rotatable').css({
			'position': 'absolute',
			'height': '100%', 
			'width': '100%', 
			'color': templatezone.color, 
			'font-family': templatezone.fontfamily, 
			'font-size': (parseInt(templatezone.fontsize) / TemplateScale) + 'px', 
			'text-decoration': templatezone.decoration, 
			'text-align': templatezone.align, 
			'font-weight': templatezone.fontweight, 
			'font-style': templatezone.fontstyle, 
			'line-height': (parseInt(templatezone.lineheight) / TemplateScale) + 'px', 
			'text-shadow': shadow,  
			'padding': (parseInt(templatezone.padding) / TemplateScale) + 'px', 
			'border-color': templatezone.bdcolor, 
			'border-style': templatezone.bdstyle, 
			'border-width': (parseInt(templatezone.bdwidth) / TemplateScale) + 'px', 
			'border-top-right-radius': (parseInt(templatezone.bdtr) / TemplateScale) + 'px', 
			'border-top-left-radius': (parseInt(templatezone.bdtl) / TemplateScale) + 'px', 
			'border-bottom-left-radius': (parseInt(templatezone.bdbl) / TemplateScale) + 'px', 
			'border-bottom-right-radius': (parseInt(templatezone.bdbr) / TemplateScale) + 'px',
			'word-wrap': 'break-word',
		});
		$(templatezoneDiv).find('p').css({
			'word-wrap': 'break-word',
			'white-space': 'pre-wrap',
			'text-decoration': templatezone.decoration,
		});
	} else if (templatezone.type == 1) {
		var shadow = '';
		shadow += (parseInt(templatezone.shadowh) / TemplateScale) + 'px ';
		shadow += (parseInt(templatezone.shadowv) / TemplateScale) + 'px ';
		shadow += (parseInt(templatezone.shadowblur) / TemplateScale) + 'px ';
		shadow += templatezone.shadowcolor;
		$(templatezoneDiv).find('#rotatable').css({
			'position': 'absolute',
			'height': '100%', 
			'width': '100%', 
			'box-shadow': shadow, 
			'padding': (parseInt(templatezone.padding) / TemplateScale) + 'px', 
			'opacity': parseInt(templatezone.opacity)/255,
		});
		$(templatezoneDiv).find('img').css({
			'border-color': templatezone.bdcolor, 
			'border-style': templatezone.bdstyle, 
			'border-width': (parseInt(templatezone.bdwidth) / TemplateScale) + 'px', 
			'border-top-right-radius': (parseInt(templatezone.bdtr) / TemplateScale) + 'px', 
			'border-top-left-radius': (parseInt(templatezone.bdtl) / TemplateScale) + 'px', 
			'border-bottom-left-radius': (parseInt(templatezone.bdbl) / TemplateScale) + 'px', 
			'border-bottom-right-radius': (parseInt(templatezone.bdbr) / TemplateScale) + 'px', 
		})
		if (templatezone.content != '' && templatezone.content != 'no' && templatezone.content != 'non') {
			$(templatezoneDiv).find('img').attr('src', '/pixsigndata' + templatezone.content);
			$(templatezoneDiv).find('img').attr('width', '100%');
			$(templatezoneDiv).find('img').attr('height', '100%');
			$(templatezoneDiv).find('#rotatable').attr('imageid', templatezone.objid);
			$(templatezoneDiv).find('#rotatable').attr('content', templatezone.content);
			$(templatezoneDiv).find('#rotatable').attr('owidth', templatezone.width);
			$(templatezoneDiv).find('#rotatable').attr('oheight', templatezone.height);
		}
	} else {
		$(templatezoneDiv).find('#rotatable').css({
			'position': 'absolute',
			'height': '100%', 
			'width': '100%', 
			'color': '#FFFFFF', 
			'font-size': (50 / TemplateScale) + 'px', 
			'padding': (parseInt(templatezone.padding) / TemplateScale) + 'px', 
			'border-color': templatezone.bdcolor, 
			'border-style': templatezone.bdstyle, 
			'border-width': (parseInt(templatezone.bdwidth) / TemplateScale) + 'px', 
			'border-top-right-radius': (parseInt(templatezone.bdtr) / TemplateScale) + 'px', 
			'border-top-left-radius': (parseInt(templatezone.bdtl) / TemplateScale) + 'px', 
			'border-bottom-left-radius': (parseInt(templatezone.bdbl) / TemplateScale) + 'px', 
			'border-bottom-right-radius': (parseInt(templatezone.bdbr) / TemplateScale) + 'px',
			'word-wrap': 'break-word',
		});
		$(templatezoneDiv).find('p').css({
			'word-wrap': 'break-word',
			'text-align': 'center',
			'overflow': 'hidden',
			'text-overflow': 'clip',
			'white-space': 'nowrap',
		});
	}
}

function createTextzone(templatezone) {
	var templatezone_div = document.createElement('div');
	templatezone_div.id = 'TemplatezoneDiv' + templatezone.templatezoneid;
	templatezone_div.className = 'templatezone text_div active resizable';
	templatezone_div.unselectable = 'off';
	$(templatezone_div).attr('templatezoneid', templatezone.templatezoneid);
	$(templatezone_div).attr('zonetype', 'text');

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
	var text_val = templatezone.content;
	if (text_val == undefined || text_val == null || text_val == '') {
		text_val = 'Double click to edit';
	} else {
		text_val = text_val.replace(/&nbsp;/g, ' ');
	}
	$(p_element).append(text_val);

	$(inner_div).append(p_element);
	$(templatezone_div).append(background_div);
	$(templatezone_div).append(inner_div);
	$('#TemplateDiv').append(templatezone_div);	

	refreshTemplatezone(templatezone);
}

function createImagezone(templatezone) {
	var templatezone_div = document.createElement('div');
	templatezone_div.id = 'TemplatezoneDiv' + templatezone.templatezoneid;
	templatezone_div.className = 'templatezone image_div active resizable';
	templatezone_div.unselectable = 'off';
	$(templatezone_div).attr('templatezoneid', templatezone.templatezoneid);
	$(templatezone_div).attr('zonetype', 'image');

	var background_div = document.createElement('div');
	background_div.id = 'background';

	var inner_div = document.createElement('div');
	inner_div.id = 'rotatable';
	$(inner_div).attr('imageid', 0);
	$(inner_div).attr('content', '');
	
	var img_element = document.createElement('img');

	$(inner_div).append(img_element);
	$(templatezone_div).append(background_div);
	$(templatezone_div).append(inner_div);
	$('#TemplateDiv').append(templatezone_div);

	refreshTemplatezone(templatezone);
}

function createOtherzone(templatezone) {
	var templatezone_div = document.createElement('div');
	templatezone_div.id = 'TemplatezoneDiv' + templatezone.templatezoneid;
	templatezone_div.className = 'templatezone image_div active resizable';
	$(templatezone_div).attr('templatezoneid', templatezone.templatezoneid);

	var background_div = document.createElement('div');
	background_div.id = 'background';

	var inner_div = document.createElement('div');
	inner_div.id = 'rotatable';
	
	var p_element = document.createElement('p');
	$(p_element).append(eval('common.view.pagezone_type_' + templatezone.type));

	$(inner_div).append(p_element);
	$(templatezone_div).append(background_div);
	$(templatezone_div).append(inner_div);
	$('#TemplateDiv').append(templatezone_div);

	refreshTemplatezone(templatezone);
}

function unselectAllZones() {
	for (var i=0; i<CurrentTemplate.templatezones.length; i++) {
		templatezone = CurrentTemplate.templatezones[i];
		var templatezonediv = $('#TemplatezoneDiv' + templatezone.templatezoneid);
		$(templatezonediv).css('z-index', templatezone.zindex);
		$(templatezonediv).css('cursor', 'default');
		$(templatezonediv).find('#rotatable').css('cursor', 'default');
		$(templatezonediv).removeClass('select_layer');
		$(templatezonediv).draggable('disable');
		$(templatezonediv).resizable('disable');
		$(templatezonediv).find('div.ui-resizable-handle').removeClass('select');
		$(templatezonediv).find('.ui-rotatable-handle').css('display', 'none');
	}
}

function selectZone(templatezone) {
	var templatezonediv = $('#TemplatezoneDiv' + templatezone.templatezoneid);
	//$(templatezonediv).css('z-index', '1000');
	$(templatezonediv).css('cursor', 'move');
	$(templatezonediv).find('#rotatable').css('cursor', 'move');
	$(templatezonediv).addClass('select_layer');
	$(templatezonediv).draggable('enable');
	$(templatezonediv).resizable('enable');
	$(templatezonediv).find('div.ui-resizable-handle').addClass('select');
	$(templatezonediv).find('.ui-rotatable-handle').css('display', 'block');
}

$('#TemplateDiv').live('click', function (e) {
	var that = this;
	setTimeout(function () {
		var dblclick = parseInt($(that).data('double'), 10);
		if (dblclick > 0) {
			$(that).data('double', dblclick - 1);
		} else {
			templatezoneClick.call(that, e, false);
		}
	}, 200);
});
$('#TemplateDiv').live('dblclick', function (e) {
	$(this).data('double', 2);
	templatezoneClick.call(this, e, true);
});	   

function templatezoneClick(e, dblclick){
	var scale = CurrentTemplate.width / $('#TemplateDiv').width();
	var offset = $(this).offset();
	var posX = (e.pageX - offset.left) * scale;
	var posY = (e.pageY - offset.top) * scale;
	var templatezones = CurrentTemplate.templatezones.filter(function (el) {
		var width = parseInt(el.width);
		var height = parseInt(el.height);
		var leftoffset = parseInt(el.leftoffset);
		var topoffset = parseInt(el.topoffset);
		return (posX > leftoffset) && (posX < (leftoffset + width)) && (posY > topoffset) && (posY < (topoffset + height));
	});
	if (templatezones.length > 0) {
		templatezones.sort(function(a, b) {
			return (parseInt(a.width) + parseInt(a.height) - parseInt(b.width) - parseInt(b.height));
		});

		if (validTemplatezone(CurrentTemplatezone)) {
			if ($('#rotatable[contenteditable=true]').length > 0) {
				return;
			}
			if (dblclick) {
				if (templatezones[0].type == 0) {
					CurrentTemplatezone = templatezones[0];
					var templatezonediv = $('#TemplatezoneDiv' + CurrentTemplatezone.templatezoneid);
					if (!$(templatezonediv).find('#rotatable').hasClass('dblclick')) {
						unselectAllZones();
						selectZone(CurrentTemplatezone);

						text_editable = 'dblclick';
						$(window).unbind('keydown');
						$(templatezonediv).find('#rotatable').css('cursor', 'text');
						$(templatezonediv).find('#rotatable').attr('contenteditable', true);
						$(templatezonediv).find('#rotatable').css('word-wrap', 'break-word');
						$(templatezonediv).find('#rotatable').trigger('focus');
						$(templatezonediv).draggable('disable');
						$('.ui-rotatable-handle').css('background', '#EEEEEE');
						//e.stopPropagation();
						$(templatezonediv).trigger('dblclick');
					}
					$(templatezonediv).resizable('disable');
					$(templatezonediv).find('.ui-rotatable-handle').css('display', 'none');
					$(templatezonediv).find('.ui-resizable-handle').removeClass('select');
					$(templatezonediv).draggable('disable');

					$(templatezonediv).find('#rotatable').attr('contenteditable', true);
					$(templatezonediv).find('#rotatable').addClass('dblclick');
					//$('.select_layer').find('#rotatable').selectText();
					$(templatezonediv).find('#rotatable').trigger('click');
					enterTemplatezoneFocus(CurrentTemplatezone);
				} else if (templatezones[0].type == 1) {
					CurrentTemplatezone = templatezones[0];
					$('#ImageLibraryModal').modal();
				} else {
					return;
				}
			} else {
				CurrentTemplatezone = templatezones[0];
				unselectAllZones();
				selectZone(CurrentTemplatezone)
				enterTemplatezoneFocus(CurrentTemplatezone);
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

function enterTemplatezoneFocus(templatezone) {
	if (templatezone == null) {
		$('#TemplatezoneEditPanel').css('display' , 'none');
		return;
	}
	$('#TemplatezoneEditPanel').css('display' , '');
	$('.templatezone-ctl').css('display', 'none');
	$('.zonetype-' + templatezone.type).css('display', 'block');
	$('#TemplatezoneEditForm1').loadJSON(templatezone);
	$('#TemplatezoneEditForm2').loadJSON(templatezone);
	$('#TemplatezoneEditForm3').loadJSON(templatezone);
	$('#TemplatezoneEditForm4').loadJSON(templatezone);
	$('#TemplatezoneEditForm5').loadJSON(templatezone);

	$('.colorPick').wColorPicker({
		theme			: 'classic',  // set theme
		opacity			: 0.8,		// opacity level
		color			: templatezone.color,  // set init color
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
				CurrentTemplatezone.color = color;
				refreshTemplatezone(CurrentTemplatezone);
			}
		},
		onDropper	   : null		// callback when dropper is clicked
	});
	$('.colorPick i').css('background', templatezone.color);
	$('.colorPick input').val(templatezone.color);
	
	$('.bgcolorPick').wColorPicker({
		theme			: 'classic',  // set theme
		opacity			: 0.8,		// opacity level
		color			: templatezone.bgcolor,  // set init color
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
				CurrentTemplatezone.bgcolor = color;
				refreshTemplatezone(CurrentTemplatezone);
			}
		},
		onDropper		: null		// callback when dropper is clicked
	});
	$('.bgcolorPick i').css('background', templatezone.bgcolor);
	$('.bgcolorPick input').val(templatezone.bgcolor);

	$('.shadowcolorPick').wColorPicker({
		theme			: 'classic',  // set theme
		opacity			: 0.8,		// opacity level
		color			: templatezone.shadowcolor,  // set init color
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
				CurrentTemplatezone.shadowcolor = color;
				refreshTemplatezone(CurrentTemplatezone);
			}
		},
		onDropper		: null		// callback when dropper is clicked
	});
	$('.shadowcolorPick i').css('background', templatezone.shadowcolor);
	$('.shadowcolorPick input').val(templatezone.shadowcolor);

	$('.bdcolorPick').wColorPicker({
		theme			: 'classic',  // set theme
		opacity			: 0.8,		// opacity level
		color			: templatezone.bdcolor,  // set init color
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
				CurrentTemplatezone.bdcolor = color;
				refreshTemplatezone(CurrentTemplatezone);
			}
		},
		onDropper		: null		// callback when dropper is clicked
	});
	$('.bdcolorPick i').css('background', templatezone.bdcolor);
	$('.bdcolorPick input').val(templatezone.bdcolor);

	$('.opacityRange').ionRangeSlider({
		min: 0,
		max: 255,
		from: 255,
		type: 'single',
		step: 5,
		hasGrid: false,
		onChange: function(data) {
			CurrentTemplatezone.opacity = $('input[name=opacity]').val();
			refreshTemplatezone(CurrentTemplatezone);
		}
	});
	$('.opacityRange').ionRangeSlider('update', {
		from: templatezone.opacity
	});

	$('.bgopacityRange').ionRangeSlider({
		min: 0,
		max: 255,
		from: 255,
		type: 'single',
		step: 5,
		hasGrid: false,
		onChange: function(data) {
			CurrentTemplatezone.bgopacity = $('input[name=bgopacity]').val();
			refreshTemplatezone(CurrentTemplatezone);
		}
	});
	$('.bgopacityRange').ionRangeSlider('update', {
		from: templatezone.bgopacity
	});

	$('#spinner-fontsize').spinner();
	$('#spinner-fontsize').spinner('setting', {value:parseInt(templatezone.fontsize), step: 1, min: 12, max: 255});
	$('#spinner-lineheight').spinner();
	$('#spinner-lineheight').spinner('setting', {value:parseInt(templatezone.lineheight), step: 1, min: 0, max: 255});
	$('#spinner-padding').spinner();
	$('#spinner-padding').spinner('setting', {value:parseInt(templatezone.padding), step: 1, min: 0, max: 255});

	$('#spinner-shadowh').spinner();
	$('#spinner-shadowh').spinner('setting', {value:parseInt(templatezone.shadowh), step: 1, min: -99, max: 99});
	$('#spinner-shadowv').spinner();
	$('#spinner-shadowv').spinner('setting', {value:parseInt(templatezone.shadowv), step: 1, min: -99, max: 99});
	$('#spinner-shadowblur').spinner();
	$('#spinner-shadowblur').spinner('setting', {value:parseInt(templatezone.shadowblur), step: 1, min: 0, max: 99});
	
	$('#spinner-bdwidth').spinner();
	$('#spinner-bdwidth').spinner('setting', {value:parseInt(templatezone.bdwidth), step: 1, min: 0, max: 99});
	$('#spinner-bdtl').spinner();
	$('#spinner-bdtl').spinner('setting', {value:parseInt(templatezone.bdtl), step: 1, min: 0, max: 255});
	$('#spinner-bdtr').spinner();
	$('#spinner-bdtr').spinner('setting', {value:parseInt(templatezone.bdtr), step: 1, min: 0, max: 255});
	$('#spinner-bdbl').spinner();
	$('#spinner-bdbl').spinner('setting', {value:parseInt(templatezone.bdbl), step: 1, min: 0, max: 255});
	$('#spinner-bdbr').spinner();
	$('#spinner-bdbr').spinner('setting', {value:parseInt(templatezone.bdbr), step: 1, min: 0, max: 255});

	refreshLocSpinners(templatezone);
	refreshFontStyle();
	refreshFontFamilySelect();
	refreshBdstyleSelect();
}

function refreshLocSpinners(templatezone) {
	$('#spinner-x').spinner();
	$('#spinner-x').spinner('setting', {value:parseInt(templatezone.leftoffset), step: 1, min: 0, max: parseInt(CurrentTemplate.width)-parseInt(templatezone.width)});
	$('#spinner-y').spinner();
	$('#spinner-y').spinner('setting', {value:parseInt(templatezone.topoffset), step: 1, min: 0, max: parseInt(CurrentTemplate.height)-parseInt(templatezone.height)});
	$('#spinner-w').spinner();
	$('#spinner-w').spinner('setting', {value:parseInt(templatezone.width), step: 1, min: 1, max: parseInt(CurrentTemplate.width)-parseInt(templatezone.leftoffset)});
	$('#spinner-h').spinner();
	$('#spinner-h').spinner('setting', {value:parseInt(templatezone.height), step: 1, min: 1, max: parseInt(CurrentTemplate.height)-parseInt(templatezone.topoffset)});
}

$('.collapse').on('shown.bs.collapse', function () {
	$('.opacityRange').ionRangeSlider('update');
	$('.bgopacityRange').ionRangeSlider('update');
});

$('.spinner').on('change', function(e) {
	CurrentTemplatezone.fontsize = $('#spinner-fontsize').spinner('value');
	CurrentTemplatezone.lineheight = $('#spinner-lineheight').spinner('value');
	CurrentTemplatezone.padding = $('#spinner-padding').spinner('value');
	CurrentTemplatezone.leftoffset = $('#spinner-x').spinner('value');
	CurrentTemplatezone.topoffset = $('#spinner-y').spinner('value');
	CurrentTemplatezone.width = $('#spinner-w').spinner('value');
	CurrentTemplatezone.height = $('#spinner-h').spinner('value');
	CurrentTemplatezone.shadowh = $('#spinner-shadowh').spinner('value');
	CurrentTemplatezone.shadowv = $('#spinner-shadowv').spinner('value');
	CurrentTemplatezone.shadowblur = $('#spinner-shadowblur').spinner('value');
	CurrentTemplatezone.bdwidth = $('#spinner-bdwidth').spinner('value');
	CurrentTemplatezone.bdtl = $('#spinner-bdtl').spinner('value');
	CurrentTemplatezone.bdtr = $('#spinner-bdtr').spinner('value');
	CurrentTemplatezone.bdbl = $('#spinner-bdbl').spinner('value');
	CurrentTemplatezone.bdbr = $('#spinner-bdbr').spinner('value');
	refreshTemplatezone(CurrentTemplatezone);
});	

$('.pix-bold').on('click', function(event) {
	if (CurrentTemplatezone.fontweight == 'bold') {
		CurrentTemplatezone.fontweight = 'normal';
	} else {
		CurrentTemplatezone.fontweight = 'bold';
	}
	refreshFontStyle();
	refreshTemplatezone(CurrentTemplatezone);
});	
$('.pix-italic').on('click', function(event) {
	if (CurrentTemplatezone.fontstyle == 'italic') {
		CurrentTemplatezone.fontstyle = 'normal';
	} else {
		CurrentTemplatezone.fontstyle = 'italic';
	}
	refreshFontStyle();
	refreshTemplatezone(CurrentTemplatezone);
});	
$('.pix-underline').on('click', function(event) {
	if (CurrentTemplatezone.decoration == 'underline') {
		CurrentTemplatezone.decoration = 'none';
	} else {
		CurrentTemplatezone.decoration = 'underline';
	}
	refreshFontStyle();
	refreshTemplatezone(CurrentTemplatezone);
});	
$('.pix-strikethrough').on('click', function(event) {
	if (CurrentTemplatezone.decoration == 'line-through') {
		CurrentTemplatezone.decoration = 'none';
	} else {
		CurrentTemplatezone.decoration = 'line-through';
	}
	refreshFontStyle();
	refreshTemplatezone(CurrentTemplatezone);
});
$('.pix-align-left').on('click', function(event) {
	if (CurrentTemplatezone.align == 'left') {
		CurrentTemplatezone.align = '';
	} else {
		CurrentTemplatezone.align = 'left';
	}
	refreshFontStyle();
	refreshTemplatezone(CurrentTemplatezone);
});	
$('.pix-align-right').on('click', function(event) {
	if (CurrentTemplatezone.align == 'right') {
		CurrentTemplatezone.align = '';
	} else {
		CurrentTemplatezone.align = 'right';
	}
	refreshFontStyle();
	refreshTemplatezone(CurrentTemplatezone);
});	
$('.pix-align-center').on('click', function(event) {
	if (CurrentTemplatezone.align == 'center') {
		CurrentTemplatezone.align = '';
	} else {
		CurrentTemplatezone.align = 'center';
	}
	refreshFontStyle();
	refreshTemplatezone(CurrentTemplatezone);
});	
$('.pix-align-justify').on('click', function(event) {
	if (CurrentTemplatezone.align == 'justify') {
		CurrentTemplatezone.align = '';
	} else {
		CurrentTemplatezone.align = 'justify';
	}
	refreshFontStyle();
	refreshTemplatezone(CurrentTemplatezone);
});	

function refreshFontStyle() {
	if (CurrentTemplatezone.fontweight == 'bold') {
		$('.pix-bold').removeClass('default');
		$('.pix-bold').addClass('blue');
	} else {
		$('.pix-bold').removeClass('blue');
		$('.pix-bold').addClass('default');
	}
	if (CurrentTemplatezone.fontstyle == 'italic') {
		$('.pix-italic').removeClass('default');
		$('.pix-italic').addClass('blue');
	} else {
		$('.pix-italic').removeClass('blue');
		$('.pix-italic').addClass('default');
	}
	if (CurrentTemplatezone.decoration == 'underline') {
		$('.pix-underline').removeClass('default');
		$('.pix-underline').addClass('blue');
		$('.pix-strikethrough').removeClass('blue');
		$('.pix-strikethrough').addClass('default');
	} else if (CurrentTemplatezone.decoration == 'line-through') {
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
	if (CurrentTemplatezone.align == 'left') {
		$('.pix-align-left').removeClass('default');
		$('.pix-align-left').addClass('blue');
		$('.pix-align-right').removeClass('blue');
		$('.pix-align-right').addClass('default');
		$('.pix-align-center').removeClass('blue');
		$('.pix-align-center').addClass('default');
		$('.pix-align-justify').removeClass('blue');
		$('.pix-align-justify').addClass('default');
	} else if (CurrentTemplatezone.align == 'right') {
		$('.pix-align-left').removeClass('blue');
		$('.pix-align-left').addClass('default');
		$('.pix-align-right').removeClass('default');
		$('.pix-align-right').addClass('blue');
		$('.pix-align-center').removeClass('blue');
		$('.pix-align-center').addClass('default');
		$('.pix-align-justify').removeClass('blue');
		$('.pix-align-justify').addClass('default');
	} else if (CurrentTemplatezone.align == 'center') {
		$('.pix-align-left').removeClass('blue');
		$('.pix-align-left').addClass('default');
		$('.pix-align-right').removeClass('blue');
		$('.pix-align-right').addClass('default');
		$('.pix-align-center').removeClass('default');
		$('.pix-align-center').addClass('blue');
		$('.pix-align-justify').removeClass('blue');
		$('.pix-align-justify').addClass('default');
	} else if (CurrentTemplatezone.align == 'justify') {
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
			if (CurrentTemplatezone != null) {
				callback({id: CurrentTemplatezone.fontfamily, text: CurrentTemplatezone.fontfamily });
			}
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});
}
$('#FontFamilySelect').on('change', function(e) {
	if ($('#FontFamilySelect').select2('data') != null) {
		CurrentTemplatezone.fontfamily = $('#FontFamilySelect').select2('data').id;
	}
	refreshTemplatezone(CurrentTemplatezone);
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
		CurrentTemplatezone.bdstyle = $('#BdstyleSelect').select2('data').id;
	}
	refreshTemplatezone(CurrentTemplatezone);
});	

function validTemplatezone(templatezone) {
	if (templatezone != null && templatezone.type == 0) {
		var templatezoneDiv = $('#TemplatezoneDiv' + templatezone.templatezoneid);
		var content = $(templatezoneDiv).find('p').html();
		console.log(content);
		if (content != 'Double click to edit') {
			templatezone.content = content;
		} else {
			templatezone.content = '';
		}
	}
	return true;
}

var template_select_option = {
	placeholder: common.tips.detail_select,
	minimumInputLength: 0,
	ajax: { 
		url: 'template!templatelist.action',
		type: 'GET',
		dataType: 'json',
		data: function (term, template) {
			return {
				sSearch: term, 
				iDisplayStart: (template-1)*10,
				iDisplayLength: 10,
				templatepkgid: 0,
			};
		},
		results: function (data, template) {
			var more = (template * 10) < data.iTotalRecords; 
			return {
				results : $.map(data.aaData, function (item) { 
					return { 
						text:item.name, 
						id:item.templateid,
						template:item,
					};
				}),
				more: more
			};
		}
	},
	formatResult: function(data) {
		var width = 40;
		var height = 40 * data.template.height / data.template.width;
		if (data.template.width < data.template.height) {
			height = 40;
			width = 40 * data.template.width / data.template.height;
		}
		var html = '<span><img src="/pixsigndata' + data.template.snapshot + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.template.name + '</span>'
		return html;
	},
	formatSelection: function(data) {
		var width = 30;
		var height = 30 * height / width;
		if (data.template.width < data.template.height) {
			height = 30;
			width = 30 * width / height;
		}
		var html = '<span><img src="/pixsigndata' + data.template.snapshot + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.template.name + '</span>'
		return html;
	},
	dropdownCssClass: 'bigdrop', 
	escapeMarkup: function (m) { return m; } 
};

$('#TemplateSelect').select2(template_select_option);



//新增templatezone
$('body').on('click', '.pix-addzone', function(event) {
	var zonetype = $(event.target).attr('zonetype');
	if (zonetype == undefined) {
		zonetype = $(event.target).parent().attr('zonetype');
	}
	
	var templatezones = CurrentTemplate.templatezones.filter(function (el) {
		return el.type == zonetype;
	});
	if (templatezones.length >= ZoneLimits[zonetype] ) {
		return;
	}
	
	var templatezone = {};
	templatezone.templatezoneid = '-' + Math.round(Math.random()*100000000);
	templatezone.templateid = CurrentTemplateid;
	templatezone.name = 'Zone_' + zonetype;
	templatezone.type = zonetype;
	templatezone.leftoffset = CurrentTemplate.height * 0.1;
	templatezone.topoffset = CurrentTemplate.width * 0.1;
	if (ZoneRatios[zonetype] != undefined) {
		templatezone.width = CurrentTemplate.width * 0.2;
		templatezone.height = CurrentTemplate.width * 0.2 / ZoneRatios[zonetype];
	} else {
		templatezone.width = CurrentTemplate.width * 0.2;
		templatezone.height = CurrentTemplate.height * 0.2;
	}
	if (templatezone.type == 1) {
		templatezone.zindex = 51;
	} else {
		templatezone.zindex = 52;
	}
	templatezone.transform = 'matrix(1, 0, 0, 1, 0, 0)';
	templatezone.bdcolor = '#000000';
	templatezone.bdstyle = 'solid';
	templatezone.bdwidth = 0;
	templatezone.bdtl = 0;
	templatezone.bdtr = 0;
	templatezone.bdbl = 0;
	templatezone.bdbr = 0;
	templatezone.bgcolor = '#999999';
	templatezone.bgopacity = 120;
	templatezone.opacity = 255;
	templatezone.padding = 0;
	templatezone.shadowh = 0;
	templatezone.shadowv = 0;
	templatezone.shadowblur = 0;
	templatezone.shadowcolor = '#000000';
	templatezone.color = '#FFFFFF';
	templatezone.fontfamily = 'DroidSans';
	templatezone.fontsize = 40;
	templatezone.fontweight = 'normal';
	templatezone.fontstyle = 'normal';
	templatezone.decoration = 'none';
	templatezone.align = 'start';
	templatezone.lineheight = 80;
	templatezone.content = '';
	
	CurrentTemplate.templatezones[CurrentTemplate.templatezones.length] = templatezone;
	
	unselectAllZones();
	if (zonetype == 0) {
		createTextzone(templatezone);
	} else if (zonetype == 1) {
		createImagezone(templatezone);
	} else {
		createOtherzone(templatezone);
	}
	CurrentTemplatezone = templatezone;
	initOperation(templatezone);
	selectZone(CurrentTemplatezone);
	enterTemplatezoneFocus(templatezone);
});


//图片table初始�?
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
		imagehtml += '<img src="/pixsigndata' + aData.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		imagehtml += '<div class="mask">';
		imagehtml += '<div>';
		imagehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
		imagehtml += '<a class="btn default btn-sm green pix-templatezone-image-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
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
	var templatezoneDiv = $('#TemplatezoneDiv' + CurrentTemplatezone.templatezoneid);
	$('#ImageLibraryPreview').height($('#ImageLibraryPreview').width());
	$('#ImageLibraryPreview').attr('imageid', CurrentTemplatezone.objid);
	$('#ImageLibraryPreview').attr('content', CurrentTemplatezone.content);
	$('#ImageLibraryPreview').attr('owidth', $(templatezoneDiv).find('#rotatable').attr('owidth'));
	$('#ImageLibraryPreview').attr('oheight', $(templatezoneDiv).find('#rotatable').attr('oheight'));
	displayLibraryPreview();
})

function displayLibraryPreview() {
	var backgroundimage = $('#ImageLibraryPreview').attr('content');
	if (backgroundimage != '') {
		$('#ImageLibraryPreview').css('background-image', 'url(/pixsigndata' + backgroundimage + ')');
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

$('body').on('click', '.pix-templatezone-image-add', function(event) {
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
	CurrentTemplatezone.objid = $('#ImageLibraryPreview').attr('imageid');
	CurrentTemplatezone.content = $('#ImageLibraryPreview').attr('content');
	refreshTemplatezone(CurrentTemplatezone);
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

$('[type=submit]', $('#TemplateModal')).on('click', function(event) {
	if (submitflag) {
		return;
	}
	submitflag = true;
	Metronic.blockUI({
		zIndex: 20000,
		animate: true
	});
	$('#snapshot_div').show();
	redrawPagePreview($('#snapshot_div'), CurrentTemplate, 1024);
	html2canvas($('#snapshot_div'), {
		onrendered: function(canvas) {
			//console.log(canvas.toDataURL());
			CurrentTemplate.snapshotdtl = canvas.toDataURL();
			$('#snapshot_div').hide();

			$.ajax({
				type : 'POST',
				url : 'template!design.action',
				data : '{"template":' + $.toJSON(CurrentTemplate) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					submitflag = false;
					Metronic.unblockUI();
					$('#TemplateModal').modal('hide');
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
					$('#TemplateModal').modal('hide');
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
	if (CurrentTemplatezone != null) {
		var templatezonediv = $('#TemplatezoneDiv' + CurrentTemplatezone.templatezoneid);
		var status = $(templatezonediv).find('#rotatable').hasClass('dblclick');
		if ((e.which == 46) && (status === false) && ((e.target.tagName).toLowerCase() !== 'input')) {
			bootbox.confirm(common.tips.remove + eval('common.view.templatezone_type_' + CurrentTemplatezone.type), function(result) {
				if (result == true) {
					CurrentTemplate.templatezones.splice(CurrentTemplate.templatezones.indexOf(CurrentTemplatezone), 1);
					CurrentTemplatezone = null;
					$(templatezonediv).remove();
					enterTemplatezoneFocus(CurrentTemplatezone);
				}
			 });
		}
	}
});
