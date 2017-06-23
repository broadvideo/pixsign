var submitflag = false;

var ZoneLimits = [];
ZoneLimits['0'] = 1000;
ZoneLimits['1'] = 1000;
ZoneLimits['11'] = 1;
ZoneLimits['12'] = 1;
ZoneLimits['13'] = 1;

var ZoneRatios = [];
ZoneRatios['11'] = 0.8333; //5:6
ZoneRatios['12'] = 1.7699; //1000:565

var PtempletScale = 1;

var myurls = {
	'ptemplet.list' : 'ptemplet!list.action',
	'ptemplet.add' : 'ptemplet!add.action',
	'ptemplet.update' : 'ptemplet!update.action',
	'ptemplet.delete' : 'ptemplet!delete.action',
	'ptemplet.design' : 'ptemplet!design.action',
};

var CurrentPtemplet;
var CurrentPtempletid;
var CurrentPtempletzone;

var CurrentMediaBranchid;
var CurrentMediaFolderid;

$("#MyTable thead").css("display", "none");
$("#MyTable tbody").css("display", "none");
var ptemplethtml = '';
var oTable = $('#MyTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 16, 36, 72, 108 ],
						[ 16, 36, 72, 108 ] 
						],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : myurls['ptemplet.list'],
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.ratio, 'mData' : 'ratio', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'ptempletid', 'bSortable' : false }],
	'iDisplayLength' : 16,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#PtempletContainer').length < 1) {
			$('#MyTable').append('<div id="PtempletContainer"></div>');
		}
		$('#PtempletContainer').html(''); 
		return true;
	},
	'fnServerParams': function(aoData) {
		aoData.push({'name':'ptempletpkgid','value':0 });
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		if (iDisplayIndex % 3 == 0) {
			ptemplethtml = '';
			ptemplethtml += '<div class="row" >';
		}
		ptemplethtml += '<div class="col-md-4 col-xs-4">';
		ptemplethtml += '<h3>' + aData.name + '</h3>';
		if (aData.ratio == 1) {
			ptemplethtml += '<h6><span class="label label-sm label-info">' + common.view.template_ratio_1 + '</span></h6>';
		} else if (aData.ratio == 2) {
			ptemplethtml += '<h6><span class="label label-sm label-success">' + common.view.template_ratio_2 + '</span></h6>';
		}

		if (aData.snapshot != null) {
			ptemplethtml += '<a class="fancybox" href="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" title="' + aData.name + '">';
			ptemplethtml += '<div class="thumbs">';
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			ptemplethtml += '<img src="/pixsigdata' + aData.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
			ptemplethtml += '</div></a>';
		} else {
			ptemplethtml += '<div class="thumbs">';
			ptemplethtml += '</div>';
		}
		
		ptemplethtml += '<div privilegeid="101010">';
		ptemplethtml += '<a href="javascript:;" ptempletid="' + aData.ptempletid + '" class="btn default btn-xs blue pix-ptemplet"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		ptemplethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a> </div>';

		ptemplethtml += '</div>';
		if ((iDisplayIndex+1) % 3 == 0 || (iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
			ptemplethtml += '</div>';
			if ((iDisplayIndex+1) != $('#MyTable').dataTable().fnGetData().length) {
				ptemplethtml += '<hr/>';
			}
			$('#PtempletContainer').append(ptemplethtml);
			$('.thumbs').each(function(i) {
				$(this).width($(this).parent().closest('div').width());
				$(this).height($(this).parent().closest('div').width());
			});
			$(".fancybox").fancybox({
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
FormValidateOption.rules['ptemplet.name'] = {};
FormValidateOption.rules['ptemplet.name']['required'] = true;
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
	$('#MyEditForm').attr('action', myurls['ptemplet.add']);
	$('.hide-update').css('display', 'block');
	CurrentPtemplet = null;
	CurrentPtempletid = 0;
	$('#MyEditModal').modal();
});			


$('body').on('click', '.pix-update', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentPtemplet = $('#MyTable').dataTable().fnGetData(index);
	CurrentPtempletid = CurrentPtemplet.ptempletid;

	var formdata = new Object();
	for (var name in CurrentPtemplet) {
		formdata['ptemplet.' + name] = CurrentPtemplet[name];
	}
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$('#MyEditForm').attr('action', myurls['ptemplet.update']);
	$('.hide-update').css('display', 'none');
	$('#MyEditModal').modal();
});

$('body').on('click', '.pix-delete', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentPtemplet = $('#MyTable').dataTable().fnGetData(index);
	CurrentPtempletid = CurrentPtemplet.ptempletid;
	var action = myurls['ptemplet.delete'];
	
	bootbox.confirm(common.tips.remove + CurrentPtemplet.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : action,
				cache: false,
				data : {
					'ptemplet.ptempletid': CurrentPtempletid
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


$('body').on('click', '.pix-ptemplet', function(event) {
	var ptempletid = $(event.target).attr('ptempletid');
	if (ptempletid == undefined) {
		ptempletid = $(event.target).parent().attr('ptempletid');
	}
	$.ajax({
		type : 'GET',
		url : 'ptemplet!get.action',
		data : {ptempletid: ptempletid},
		success : function(data, status) {
			if (data.errorcode == 0) {
				CurrentPtemplet = data.ptemplet;
				CurrentPtempletid = CurrentPtemplet.ptempletid;
				CurrentPtempletzone = null;
				$('#PtempletModal').modal();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
});

$('#PtempletModal').on('shown.bs.modal', function (e) {
	$('#PtempletzoneEditPanel').css('display' , 'none');
	redrawPtemplet($('#PtempletDiv'), CurrentPtemplet);
})

function updatePtempletzonePos(e, ui) {
	console.log($(this));
	var ptempletzoneid = $(this).attr("ptempletzoneid");
	console.log('ptempletzoneid', ptempletzoneid);
	var ptempletzones = CurrentPtemplet.ptempletzones.filter(function (el) {
		return el.ptempletzoneid == ptempletzoneid;
	});

	var l = $(this).position().left / $('#PtempletDiv').width();
	var t = $(this).position().top / $('#PtempletDiv').height();
	var w = $(this).width() / $('#PtempletDiv').width();
	var h = $(this).height() / $('#PtempletDiv').height();
	/*
	if (ZoneRatios[ptempletzones[0].type] != undefined) {
		var w = $(this).width() / $('#PtempletDiv').width();
		var h = $(this).width() / parseFloat(ZoneRatios[ptempletzones[0].type]) / $('#PtempletDiv').height();
		if (t + h > 1) {
			h = 1 - t;
			w = h * $('#PtempletDiv').height() * parseFloat(ZoneRatios[ptempletzones[0].type]) / $('#PtempletDiv').width();
		}
	}*/
	//$(this).css("width" , (100 * parseFloat(w)) + '%');
	//$(this).css("height" , (100 * parseFloat(h)) + '%');
	//$(this).css("left" , (100 * parseFloat(l)) + '%');
	//$(this).css("top" , (100 * parseFloat(t)) + '%');

	ptempletzones[0].width = Math.round(CurrentPtemplet.width * w, 0);
	ptempletzones[0].height = Math.round(CurrentPtemplet.height * h, 0);
	ptempletzones[0].leftoffset = Math.round(CurrentPtemplet.width * l, 0);
	ptempletzones[0].topoffset = Math.round(CurrentPtemplet.height * t, 0);
}

function redrawPtemplet(div, ptemplet) {
	div.empty();
	div.css('position', 'relative');
	div.css('margin-left', 'auto');
	div.css('margin-right', 'auto');
	div.css('border', '1px solid #000');
	var width = Math.floor(div.parent().width()) - 40;
	PtempletScale = ptemplet.width / width;
	var height = ptemplet.height / PtempletScale;
	div.css('width' , width);
	div.css('height' , height);
	
	var ptempletzones = ptemplet.ptempletzones;
	for (var i=0; i<ptempletzones.length; i++) {
		if (ptemplet.ptempletzones[i].type == '0') {
			createTextzone(ptempletzones[i]);
		} else if (ptempletzones[i].type == '1') {
			createImagezone(ptempletzones[i]);
		}
	}
	
	for (var i=0; i<ptempletzones.length; i++) {
		initOperation(ptempletzones[i]);
	}

	common_disable_properties();
}

function initOperation(ptempletzone) {
	var ptempletzoneDiv = $('#PtempletzoneDiv' + ptempletzone.ptempletzoneid);
	$(ptempletzoneDiv).draggable({
		containment: "#PtempletDiv",
		//stop: regionPositionUpdate,
		drag: updatePtempletzonePos,
	});
	
	$(ptempletzoneDiv).resizable({
		containment: "#PtempletDiv",
		aspectRatio: false,
		handles: 'ne, nw, se, sw',
		stop: updatePtempletzonePos,
	});
	if (isOpera) {
		var tr = $(ptempletzoneDiv).css('-o-transform').replace("matrix(", "").replace(")", "");
	} else if (isFirefox) {
		tr = $(ptempletzoneDiv).css('-moz-transform').replace("matrix(", "").replace(")", "");
	} else if (isChrome || isSafari) {
		tr = $(ptempletzoneDiv).css('-webkit-transform').replace("matrix(", "").replace(")", "");
	}
	$(ptempletzoneDiv).find('#rotatable').rotatable({
		mtx: [tr], 
		onrotate: function (a) {
			//set_rotation_angle_spinner_value(a);
		}
	});
}

function refreshPtempletzone(ptempletzone) {
	var ptempletzoneDiv = $('#PtempletzoneDiv' + ptempletzone.ptempletzoneid);
	if (ptempletzone.type == 0) {
		$(ptempletzoneDiv).css({
			'position': 'absolute',
			'width': 100*ptempletzone.width/CurrentPtemplet.width + '%',
			'height': 100*ptempletzone.height/CurrentPtemplet.height + '%',
			'top': 100*ptempletzone.topoffset/CurrentPtemplet.height + '%', 
			'left': 100*ptempletzone.leftoffset/CurrentPtemplet.width + '%', 
			//'z-index': ptempletzone.zindex,
			'-moz-transform': ptempletzone.transform,
			'-webkit-transform': ptempletzone.transform,
		});
		$(ptempletzoneDiv).find('#background').css({
			'position': 'absolute',
			'width': '100%',
			'height': '100%',
			'background': ptempletzone.bgcolor, 
			'opacity': parseInt(ptempletzone.bgopacity)/255, 
		});
		$(ptempletzoneDiv).find('#rotatable').css({
			'position': 'absolute',
			'height': '100%', 
			'width': '100%', 
			'color': ptempletzone.color, 
			'font-family': ptempletzone.fontfamily, 
			'font-size': (parseInt(ptempletzone.fontsize) / PtempletScale) + 'px', 
			'text-decoration': ptempletzone.decoration, 
			'text-align': ptempletzone.align, 
			'font-weight': ptempletzone.fontweight, 
			'font-style': ptempletzone.fontstyle, 
			'line-height': (parseInt(ptempletzone.lineheight) / PtempletScale) + 'px', 
			'text-shadow': ptempletzone.shadow, 
			'border-color': ptempletzone.bdcolor, 
			'border-style': ptempletzone.bdstyle, 
			'border-width': (parseInt(ptempletzone.bdwidth) / PtempletScale) + 'px', 
			'padding': (parseInt(ptempletzone.padding) / PtempletScale) + 'px', 
			'border-top-right-radius': (parseInt(ptempletzone.bdtr) / PtempletScale) + 'px', 
			'border-top-left-radius': (parseInt(ptempletzone.bdtl) / PtempletScale) + 'px', 
			'border-bottom-left-radius': (parseInt(ptempletzone.bdbl) / PtempletScale) + 'px', 
			'border-bottom-right-radius': (parseInt(ptempletzone.bdbr) / PtempletScale) + 'px',
			'word-wrap': 'break-word',
		});
		$(ptempletzoneDiv).find('p').css({
			'word-wrap': 'break-word',
			'white-space': 'pre-wrap',
			'text-decoration': ptempletzone.decoration,
		});
	} else if (ptempletzone.type == 1) {
		$(ptempletzoneDiv).css({
			'position': 'absolute',
			'width': 100*ptempletzone.width/CurrentPtemplet.width + '%',
			'height': 100*ptempletzone.height/CurrentPtemplet.height + '%',
			'top': 100*ptempletzone.topoffset/CurrentPtemplet.height + '%', 
			'left': 100*ptempletzone.leftoffset/CurrentPtemplet.width + '%', 
			//'z-index': ptempletzone.zindex,
			'-moz-transform': ptempletzone.transform,
			'-webkit-transform': ptempletzone.transform,
		});
		$(ptempletzoneDiv).find('#background').css({
			'position': 'absolute',
			'width': '100%',
			'height': '100%',
			'background': ptempletzone.bgcolor, 
			'opacity': parseInt(ptempletzone.bgopacity)/255, 
		});
		$(ptempletzoneDiv).find('#rotatable').css({
			'position': 'absolute',
			'height': '100%', 
			'width': '100%', 
			'border-color': ptempletzone.bdcolor, 
			'border-style': ptempletzone.bdstyle, 
			'border-width': ptempletzone.bdwidth, 
			'padding': (parseInt(ptempletzone.padding) / PtempletScale) + 'px', 
			'box-shadow': ptempletzone.shadow, 
			'border-top-right-radius': (parseInt(ptempletzone.bdtr) / PtempletScale) + 'px', 
			'border-top-left-radius': (parseInt(ptempletzone.bdtl) / PtempletScale) + 'px', 
			'border-bottom-left-radius': (parseInt(ptempletzone.bdbl) / PtempletScale) + 'px', 
			'border-bottom-right-radius': (parseInt(ptempletzone.bdbr) / PtempletScale) + 'px', 
			'opacity': parseInt(ptempletzone.opacity)/255,
		});
		if (ptempletzone.content != '' && ptempletzone.content != 'no' && ptempletzone.content != 'non') {
			$(ptempletzoneDiv).find('img').attr('src', '/pixsigdata' + ptempletzone.content);
			$(ptempletzoneDiv).find('img').attr('width', '100%');
			$(ptempletzoneDiv).find('img').attr('height', '100%');
			$(ptempletzoneDiv).find('#rotatable').attr('imageid', ptempletzone.imageid);
			$(ptempletzoneDiv).find('#rotatable').attr('content', ptempletzone.content);
			$(ptempletzoneDiv).find('#rotatable').attr('owidth', ptempletzone.width);
			$(ptempletzoneDiv).find('#rotatable').attr('oheight', ptempletzone.height);
		}
	}
}

function createTextzone(ptempletzone) {
	var ptempletzone_div = document.createElement('div');
	ptempletzone_div.id = 'PtempletzoneDiv' + ptempletzone.ptempletzoneid;
	ptempletzone_div.className = 'ptempletzone text_div active resizable';
	ptempletzone_div.unselectable = 'off';
	$(ptempletzone_div).attr('ptempletzoneid', ptempletzone.ptempletzoneid);
	$(ptempletzone_div).attr('zonetype', 'text');

	var background_div = document.createElement('div');
	background_div.id = 'background';

	var inner_div = document.createElement('div');
	inner_div.id = 'rotatable';
	inner_div.addEventListener("paste", function(e) {
		// cancel paste
		e.preventDefault();
		// get text representation of clipboard
		var text = e.clipboardData.getData("text/plain");
		// insert text manually
		//document.execCommand("insertHTML", false, text);
		document.execCommand("insertText", false, text);
	});

	var p_element = document.createElement('p');
	p_element.className = 'clstextedit';
	var text_val = ptempletzone.content;
	if (text_val == undefined || text_val == null || text_val == '') {
		text_val = "Double click to edit";
	} else {
		text_val = text_val.replace(/&nbsp;/g, ' ');
	}
	$(p_element).append(text_val);

	$(inner_div).append(p_element);
	$(ptempletzone_div).append(background_div);
	$(ptempletzone_div).append(inner_div);
	$('#PtempletDiv').append(ptempletzone_div);	

	refreshPtempletzone(ptempletzone);
}

function createImagezone(ptempletzone) {
	var ptempletzone_div = document.createElement('div');
	ptempletzone_div.id = 'PtempletzoneDiv' + ptempletzone.ptempletzoneid;
	ptempletzone_div.className = 'ptempletzone image_div active resizable';
	ptempletzone_div.unselectable = 'off';
	$(ptempletzone_div).attr('ptempletzoneid', ptempletzone.ptempletzoneid);
	$(ptempletzone_div).attr('zonetype', 'image');

	var background_div = document.createElement('div');
	background_div.id = 'background';

	var inner_div = document.createElement('div');
	inner_div.id = 'rotatable';
	$(inner_div).attr('imageid', 0);
	$(inner_div).attr('content', '');
	
	var img_element = document.createElement('img');

	$(inner_div).append(img_element);
	$(ptempletzone_div).append(background_div);
	$(ptempletzone_div).append(inner_div);
	$('#PtempletDiv').append(ptempletzone_div);

	refreshPtempletzone(ptempletzone);
}

function common_disable_properties(obj) {
	$('.ptempletzone').draggable('disable');
	$('.ptempletzone').resizable('disable');
	$(".ptempletzone").find('div.ui-resizable-handle').removeClass('select');
	$('.ptempletzone').removeClass('select_layer');
	if (obj != null) {
		$(obj).addClass('select_layer');
	}
	$('.ptempletzone').find(".ui-rotatable-handle").css("display", "none");
}

$('#PtempletDiv').live('click', function (e) {
	var that = this;
	setTimeout(function () {
		var dblclick = parseInt($(that).data('double'), 10);
		if (dblclick > 0) {
			$(that).data('double', dblclick - 1);
		} else {
			console.log('single click');
			ptempletzoneClick.call(that, e, false);
		}
	}, 200);
});
$('#PtempletDiv').live('dblclick', function (e) {
	$(this).data('double', 2);
	console.log('double click');
	ptempletzoneClick.call(this, e, true);
});	   

function ptempletzoneClick(e, dblclick){
	var scale = CurrentPtemplet.width / $('#PtempletDiv').width();
	var offset = $(this).offset();
	var posX = (e.pageX - offset.left) * scale;
	var posY = (e.pageY - offset.top) * scale;
	var ptempletzones = CurrentPtemplet.ptempletzones.filter(function (el) {
		var width = parseInt(el.width);
		var height = parseInt(el.height);
		var leftoffset = parseInt(el.leftoffset);
		var topoffset = parseInt(el.topoffset);
		return (posX > leftoffset) && (posX < (leftoffset + width)) && (posY > topoffset) && (posY < (topoffset + height));
	});
	if (ptempletzones.length > 0) {
		ptempletzones.sort(function(a, b) {
			return (parseInt(a.width) + parseInt(a.height) - parseInt(b.width) - parseInt(b.height));
		});

		if (validPtempletzone(CurrentPtempletzone)) {
			if ($('#rotatable[contenteditable=true]').length > 0) {
				return;
			}
			if (dblclick) {
				if (ptempletzones[0].type == 0) {
					CurrentPtempletzone = ptempletzones[0];
					var ptempletzonediv = $('#PtempletzoneDiv' + CurrentPtempletzone.ptempletzoneid);
					if (!$(ptempletzonediv).find('#rotatable').hasClass('dblclick')) {
						text_editable = 'dblclick';
						$(window).unbind('keydown');
						$(ptempletzonediv).find('#rotatable').css('cursor', 'text');
						$(ptempletzonediv).find('#rotatable').attr("contenteditable", true);
						$(ptempletzonediv).find('#rotatable').css('word-wrap', 'break-word');
						$('.select_layer').find('#rotatable').trigger('focus');

						$('#border_box').css('display', 'none');

						common_disable_properties($(ptempletzonediv));

						$(ptempletzonediv).draggable('disable');

						$(ptempletzonediv).find('#rotatable').attr("contenteditable", true);
						$(".ui-rotatable-handle").css('background', '#EEEEEE');
						//e.stopPropagation();
						$(ptempletzonediv).trigger('dblclick');
					}
					$('.select_layer').resizable('disable');
					$('.select_layer').find(".ui-rotatable-handle").css("display", "none");
					$('.select_layer').find('.ui-resizable-handle').removeClass('select');
					$('.select_layer').draggable('disable');

					$('.select_layer').find('#rotatable').attr("contenteditable", true);
					$('.select_layer').find('#rotatable').addClass('dblclick');
					//$('.select_layer').find('#rotatable').selectText();
					$('.select_layer').find('#rotatable').trigger('click');
					enterPtempletzoneFocus(CurrentPtempletzone);
				} else if (ptempletzones[0].type == 1) {
					CurrentPtempletzone = ptempletzones[0];
					$('#ImageLibraryModal').modal();
				} else {
					return;
				}
			} else {
				CurrentPtempletzone = ptempletzones[0];
				$('.ptempletzone').css('cursor', 'default');
				$('.ptempletzone').find('#rotatable').css('cursor', 'default');
				$('.ptempletzone').removeClass('select_layer');
				$('.ptempletzone').draggable('disable');
				$('.ptempletzone').resizable('disable');
				$(".ptempletzone").find('div.ui-resizable-handle').removeClass('select');
				$('.ptempletzone').find(".ui-rotatable-handle").css("display", "none");
				var ptempletzonediv = $('#PtempletzoneDiv' + CurrentPtempletzone.ptempletzoneid);
				$(ptempletzonediv).css('cursor', 'move');
				$(ptempletzonediv).find('#rotatable').css('cursor', 'move');
				$(ptempletzonediv).addClass('select_layer');
				$(ptempletzonediv).draggable('enable');
				$(ptempletzonediv).resizable('enable');
				$(ptempletzonediv).find(".ui-rotatable-handle").css("display", "block");
				enterPtempletzoneFocus(CurrentPtempletzone);
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
	//CurrentPtempletzone.content = $(this).find('p').html();
});

function enterPtempletzoneFocus(ptempletzone) {
	if (ptempletzone == null) {
		$('#PtempletzoneEditPanel').css('display' , 'none');
		return;
	}
	$('#PtempletzoneEditPanel').css('display' , '');
	$('.ptempletzone-ctl').css('display', 'none');
	$('.zonetype-' + ptempletzone.type).css('display', 'block');
	$('#PtempletzoneEditForm1').loadJSON(ptempletzone);
	$('#PtempletzoneEditForm2').loadJSON(ptempletzone);
	$('#PtempletzoneEditForm3').loadJSON(ptempletzone);
	$('#PtempletzoneEditForm4').loadJSON(ptempletzone);

	$('.colorPick').wColorPicker({
		theme			: 'classic',  // set theme
		opacity			: 0.8,		// opacity level
		color			: ptempletzone.color,  // set init color
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
				$(".colorPick i").css('background', color);
				$(".colorPick input").val(color);
				CurrentPtempletzone.color = color;
				refreshPtempletzone(CurrentPtempletzone);
			}
		},
		onDropper	   : null		// callback when dropper is clicked
	});
	$(".colorPick i").css('background', ptempletzone.color);
	$(".colorPick input").val(ptempletzone.color);
	
	$('.bgcolorPick').wColorPicker({
		theme			: 'classic',  // set theme
		opacity			: 0.8,		// opacity level
		color			: ptempletzone.bgcolor,  // set init color
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
				$(".bgcolorPick i").css('background', color);
				$(".bgcolorPick input").val(color);
				CurrentPtempletzone.bgcolor = color;
				refreshPtempletzone(CurrentPtempletzone);
			}
		},
		onDropper		: null		// callback when dropper is clicked
	});
	$(".bgcolorPick i").css('background', ptempletzone.bgcolor);
	$(".bgcolorPick input").val(ptempletzone.bgcolor);

	$(".opacityRange").ionRangeSlider({
		min: 0,
		max: 255,
		from: 255,
		type: 'single',
		step: 5,
		hasGrid: false,
		onChange: function(data) {
			CurrentPtempletzone.opacity = $('input[name=opacity]').val();
			refreshPtempletzone(CurrentPtempletzone);
		}
	});
	$(".opacityRange").ionRangeSlider("update", {
		from: ptempletzone.opacity
	});

	$(".bgopacityRange").ionRangeSlider({
		min: 0,
		max: 255,
		from: 255,
		type: 'single',
		step: 5,
		hasGrid: false,
		onChange: function(data) {
			CurrentPtempletzone.bgopacity = $('input[name=bgopacity]').val();
			refreshPtempletzone(CurrentPtempletzone);
		}
	});
	$(".bgopacityRange").ionRangeSlider("update", {
		from: ptempletzone.bgopacity
	});

	$('#spinner-fontsize').spinner();
	$('#spinner-fontsize').spinner('setting', {value:parseInt(ptempletzone.fontsize), step: 1, min: 12, max: 255});
	$('#spinner-lineheight').spinner();
	$('#spinner-lineheight').spinner('setting', {value:parseInt(ptempletzone.lineheight), step: 1, min: 0, max: 255});
	$('#spinner-padding').spinner();
	$('#spinner-padding').spinner('setting', {value:parseInt(ptempletzone.padding), step: 1, min: 0, max: 255});
	$('#spinner-x').spinner();
	$('#spinner-x').spinner('setting', {value:parseInt(ptempletzone.leftoffset), step: 1, min: 0, max: parseInt(CurrentPtemplet.width)-parseInt(ptempletzone.width)});
	$('#spinner-y').spinner();
	$('#spinner-y').spinner('setting', {value:parseInt(ptempletzone.topoffset), step: 1, min: 0, max: parseInt(CurrentPtemplet.height)-parseInt(ptempletzone.height)});
	$('#spinner-w').spinner();
	$('#spinner-w').spinner('setting', {value:parseInt(ptempletzone.width), step: 1, min: 1, max: parseInt(CurrentPtemplet.width)-parseInt(ptempletzone.leftoffset)});
	$('#spinner-h').spinner();
	$('#spinner-h').spinner('setting', {value:parseInt(ptempletzone.height), step: 1, min: 1, max: parseInt(CurrentPtemplet.height)-parseInt(ptempletzone.topoffset)});
	
	refreshFontStyle();
	refreshFontFamilySelect();
}

$('.collapse').on('shown.bs.collapse', function () {
	$('.opacityRange').ionRangeSlider('update');
	$('.bgopacityRange').ionRangeSlider('update');
});

$('#spinner-fontsize,#spinner-lineheight,#spinner-padding,#spinner-x,#spinner-y,#spinner-w,#spinner-h').on('change', function(e) {
	CurrentPtempletzone.fontsize = $('#spinner-fontsize').spinner('value');
	console.log(CurrentPtempletzone.fontsize);
	CurrentPtempletzone.lineheight = $('#spinner-lineheight').spinner('value');
	CurrentPtempletzone.padding = $('#spinner-padding').spinner('value');
	CurrentPtempletzone.leftoffset = $('#spinner-x').spinner('value');
	CurrentPtempletzone.topoffset = $('#spinner-y').spinner('value');
	CurrentPtempletzone.width = $('#spinner-w').spinner('value');
	CurrentPtempletzone.height = $('#spinner-h').spinner('value');
	refreshPtempletzone(CurrentPtempletzone);
});	

$('.pix-bold').on('click', function(event) {
	if (CurrentPtempletzone.fontweight == 'bold') {
		CurrentPtempletzone.fontweight = 'normal';
	} else {
		CurrentPtempletzone.fontweight = 'bold';
	}
	refreshFontStyle();
	refreshPtempletzone(CurrentPtempletzone);
});	
$('.pix-italic').on('click', function(event) {
	if (CurrentPtempletzone.fontstyle == 'italic') {
		CurrentPtempletzone.fontstyle = 'normal';
	} else {
		CurrentPtempletzone.fontstyle = 'italic';
	}
	refreshFontStyle();
	refreshPtempletzone(CurrentPtempletzone);
});	
$('.pix-underline').on('click', function(event) {
	if (CurrentPtempletzone.decoration == 'underline') {
		CurrentPtempletzone.decoration = 'none';
	} else {
		CurrentPtempletzone.decoration = 'underline';
	}
	refreshFontStyle();
	refreshPtempletzone(CurrentPtempletzone);
});	
$('.pix-strikethrough').on('click', function(event) {
	if (CurrentPtempletzone.decoration == 'line-through') {
		CurrentPtempletzone.decoration = 'none';
	} else {
		CurrentPtempletzone.decoration = 'line-through';
	}
	refreshFontStyle();
	refreshPtempletzone(CurrentPtempletzone);
});
$('.pix-align-left').on('click', function(event) {
	if (CurrentPtempletzone.align == 'left') {
		CurrentPtempletzone.align = '';
	} else {
		CurrentPtempletzone.align = 'left';
	}
	refreshFontStyle();
	refreshPtempletzone(CurrentPtempletzone);
});	
$('.pix-align-right').on('click', function(event) {
	if (CurrentPtempletzone.align == 'right') {
		CurrentPtempletzone.align = '';
	} else {
		CurrentPtempletzone.align = 'right';
	}
	refreshFontStyle();
	refreshPtempletzone(CurrentPtempletzone);
});	
$('.pix-align-center').on('click', function(event) {
	if (CurrentPtempletzone.align == 'center') {
		CurrentPtempletzone.align = '';
	} else {
		CurrentPtempletzone.align = 'center';
	}
	refreshFontStyle();
	refreshPtempletzone(CurrentPtempletzone);
});	
$('.pix-align-justify').on('click', function(event) {
	if (CurrentPtempletzone.align == 'justify') {
		CurrentPtempletzone.align = '';
	} else {
		CurrentPtempletzone.align = 'justify';
	}
	refreshFontStyle();
	refreshPtempletzone(CurrentPtempletzone);
});	

function refreshFontStyle() {
	if (CurrentPtempletzone.fontweight == 'bold') {
		$('.pix-bold').removeClass('default');
		$('.pix-bold').addClass('blue');
	} else {
		$('.pix-bold').removeClass('blue');
		$('.pix-bold').addClass('default');
	}
	if (CurrentPtempletzone.fontstyle == 'italic') {
		$('.pix-italic').removeClass('default');
		$('.pix-italic').addClass('blue');
	} else {
		$('.pix-italic').removeClass('blue');
		$('.pix-italic').addClass('default');
	}
	if (CurrentPtempletzone.decoration == 'underline') {
		$('.pix-underline').removeClass('default');
		$('.pix-underline').addClass('blue');
		$('.pix-strikethrough').removeClass('blue');
		$('.pix-strikethrough').addClass('default');
	} else if (CurrentPtempletzone.decoration == 'line-through') {
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
	if (CurrentPtempletzone.align == 'left') {
		$('.pix-align-left').removeClass('default');
		$('.pix-align-left').addClass('blue');
		$('.pix-align-right').removeClass('blue');
		$('.pix-align-right').addClass('default');
		$('.pix-align-center').removeClass('blue');
		$('.pix-align-center').addClass('default');
		$('.pix-align-justify').removeClass('blue');
		$('.pix-align-justify').addClass('default');
	} else if (CurrentPtempletzone.align == 'right') {
		$('.pix-align-left').removeClass('blue');
		$('.pix-align-left').addClass('default');
		$('.pix-align-right').removeClass('default');
		$('.pix-align-right').addClass('blue');
		$('.pix-align-center').removeClass('blue');
		$('.pix-align-center').addClass('default');
		$('.pix-align-justify').removeClass('blue');
		$('.pix-align-justify').addClass('default');
	} else if (CurrentPtempletzone.align == 'center') {
		$('.pix-align-left').removeClass('blue');
		$('.pix-align-left').addClass('default');
		$('.pix-align-right').removeClass('blue');
		$('.pix-align-right').addClass('default');
		$('.pix-align-center').removeClass('default');
		$('.pix-align-center').addClass('blue');
		$('.pix-align-justify').removeClass('blue');
		$('.pix-align-justify').addClass('default');
	} else if (CurrentPtempletzone.align == 'justify') {
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
	$("#FontFamilySelect").select2({
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
			if (CurrentPtempletzone != null) {
				callback({id: CurrentPtempletzone.fontfamily, text: CurrentPtempletzone.fontfamily });
			}
		},
		dropdownCssClass: "bigdrop", 
		escapeMarkup: function (m) { return m; } 
	});
}

$('#FontFamilySelect').on('change', function(e) {
	if ($('#FontFamilySelect').select2('data') != null) {
		CurrentPtempletzone.fontfamily = $('#FontFamilySelect').select2('data').id;
	}
	refreshPtempletzone(CurrentPtempletzone);
});	

function validPtempletzone(ptempletzone) {
	/*
	if ($('#PtempletzoneEditForm').valid()) {
		ptempletzone.sleeptime = $('#PtempletzoneEditForm input[name=sleeptime]').attr('value');
		ptempletzone.intervaltime = $('#PtempletzoneEditForm input[name=intervaltime]').attr('value');
		ptempletzone.animation =  $('#AnimationSelect').select2('val');
		ptempletzone.fitflag = $('#PtempletzoneEditForm input[name=fitflag]:checked').attr('value');
		ptempletzone.volume = $('#PtempletzoneEditForm input[name=volume]').attr('value');
		ptempletzone.direction = $('#PtempletzoneEditForm input[name=direction]:checked').attr('value');
		ptempletzone.speed = $('#PtempletzoneEditForm input[name=speed]:checked').attr('value');
		ptempletzone.color = $('#PtempletzoneEditForm input[name=color]').attr('value');
		ptempletzone.size = $('#PtempletzoneEditForm input[name=size]').attr('value');
		ptempletzone.dateformat = $('#PtempletzoneEditForm select[name=dateformat]').val();

		if ($('#ZoneBgImageSelect').select2('data') != null) {
			ptempletzone.bgimageid =  $('#ZoneBgImageSelect').select2('data').id;
			ptempletzone.bgimage = $('#ZoneBgImageSelect').select2('data').image;
		}
		ptempletzone.bgcolor = $('#PtempletzoneEditForm input[name=bgcolor]').attr('value');
		ptempletzone.opacity = $('#PtempletzoneEditForm input[name=opacity]').attr('value');
		ptempletzone.zindex = $('#PtempletzoneEditForm input[name=zindex]:checked').attr('value');

		return true;
	}
	return false;*/
	return true;
}

var template_select_option = {
	placeholder: common.tips.detail_select,
	minimumInputLength: 0,
	ajax: { 
		url: 'ptemplet!templatelist.action',
		type: 'GET',
		dataType: 'json',
		data: function (term, ptemplet) {
			return {
				sSearch: term, 
				iDisplayStart: (ptemplet-1)*10,
				iDisplayLength: 10,
				ptempletpkgid: 0,
			};
		},
		results: function (data, ptemplet) {
			var more = (ptemplet * 10) < data.iTotalRecords; 
			return {
				results : $.map(data.aaData, function (item) { 
					return { 
						text:item.name, 
						id:item.ptempletid,
						ptemplet:item,
					};
				}),
				more: more
			};
		}
	},
	formatResult: function(data) {
		var width = 40;
		var height = 40 * data.ptemplet.height / data.ptemplet.width;
		if (data.ptemplet.width < data.ptemplet.height) {
			height = 40;
			width = 40 * data.ptemplet.width / data.ptemplet.height;
		}
		var html = '<span><img src="/pixsigdata' + data.ptemplet.snapshot + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.ptemplet.name + '</span>'
		return html;
	},
	formatSelection: function(data) {
		var width = 30;
		var height = 30 * height / width;
		if (data.ptemplet.width < data.ptemplet.height) {
			height = 30;
			width = 30 * width / height;
		}
		var html = '<span><img src="/pixsigdata' + data.ptemplet.snapshot + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.ptemplet.name + '</span>'
		return html;
	},
	dropdownCssClass: "bigdrop", 
	escapeMarkup: function (m) { return m; } 
};

$("#TemplateSelect").select2(template_select_option);



//新增ptempletzone
$('body').on('click', '.pix-addzone', function(event) {
	var zonetype = $(event.target).attr('zonetype');
	if (zonetype == undefined) {
		zonetype = $(event.target).parent().attr('zonetype');
	}
	
	var ptempletzones = CurrentPtemplet.ptempletzones.filter(function (el) {
		return el.type == zonetype;
	});
	if (ptempletzones.length >= ZoneLimits[zonetype] ) {
		return;
	}
	
	var ptempletzone = {};
	ptempletzone.ptempletzoneid = '-' + Math.round(Math.random()*100000000);
	ptempletzone.ptempletid = CurrentPtempletid;
	ptempletzone.name = 'Zone_' + zonetype;
	ptempletzone.type = zonetype;
	ptempletzone.leftoffset = CurrentPtemplet.height * 0.1;
	ptempletzone.topoffset = CurrentPtemplet.width * 0.1;
	if (ZoneRatios[zonetype] != undefined) {
		ptempletzone.width = CurrentPtemplet.width * 0.2;
		ptempletzone.height = CurrentPtemplet.width * 0.2 / ZoneRatios[zonetype];
	} else {
		ptempletzone.width = CurrentPtemplet.width * 0.2;
		ptempletzone.height = CurrentPtemplet.height * 0.2;
	}
	if (ptempletzone.type == 0) {
		ptempletzone.zindex = 102;
	} else {
		ptempletzone.zindex = 101;
	}
	ptempletzone.transform = 'matrix(1, 0, 0, 1, 0, 0)';
	ptempletzone.bdcolor = '#FFFFFF';
	ptempletzone.bdstyle = '';
	ptempletzone.bdwidth = 0;
	ptempletzone.bdtl = 0;
	ptempletzone.bdtr = 0;
	ptempletzone.bdbl = 0;
	ptempletzone.bdbr = 0;
	ptempletzone.bgcolor = '#999999';
	ptempletzone.bgopacity = 120;
	ptempletzone.opacity = 255;
	ptempletzone.padding = 0;
	ptempletzone.shadow = 'none';
	ptempletzone.color = '#FFFFFF';
	ptempletzone.fontfamily = 'DroidSans';
	ptempletzone.fontsize = 40;
	ptempletzone.fontweight = 'normal';
	ptempletzone.fontstyle = 'normal';
	ptempletzone.decoration = 'none';
	ptempletzone.align = 'start';
	ptempletzone.lineheight = 80;
	ptempletzone.content = '';
	
	console.log(ptempletzone);
	
	CurrentPtemplet.ptempletzones[CurrentPtemplet.ptempletzones.length] = ptempletzone;
	
	common_disable_properties();
	if (zonetype == 0) {
		createTextzone(ptempletzone);
	} else if (zonetype == 1) {
		createImagezone(ptempletzone);
	}
	CurrentPtempletzone = ptempletzone;
	initOperation(ptempletzone);
	enterPtempletzoneFocus(ptempletzone);
});


$(document).keydown(function (e) {
	if (CurrentPtempletzone != null) {
		var ptempletzonediv = $('#PtempletzoneDiv' + CurrentPtempletzone.ptempletzoneid);
		var status = $(ptempletzonediv).find('#rotatable').hasClass('dblclick');
		if ((e.which == 46) && (status === false) && ((e.target.tagName).toLowerCase() !== 'input')) {
			bootbox.confirm(common.tips.remove + eval('common.view.ptempletzone_type_' + CurrentPtempletzone.type), function(result) {
				if (result == true) {
					CurrentPtemplet.ptempletzones.splice(CurrentPtemplet.ptempletzones.indexOf(CurrentPtempletzone), 1);
					CurrentPtempletzone = null;
					$(ptempletzonediv).remove();
					enterPtempletzoneFocus(CurrentPtempletzone);
				}
			 });
		}
	}
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
		imagehtml += '<a class="btn default btn-sm green pix-ptempletzone-image-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
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

$('#ImageLibraryModal').on('shown.bs.modal', function (e) {
	refreshMediaTable();
	var ptempletzoneDiv = $('#PtempletzoneDiv' + CurrentPtempletzone.ptempletzoneid);
	$('#ImageLibraryPreview').height($('#ImageLibraryPreview').width());
	$("#ImageLibraryPreview").attr('imageid', CurrentPtempletzone.imageid);
	$("#ImageLibraryPreview").attr('content', CurrentPtempletzone.content);
	$("#ImageLibraryPreview").attr('owidth', $(ptempletzoneDiv).find('#rotatable').attr('owidth'));
	$("#ImageLibraryPreview").attr('oheight', $(ptempletzoneDiv).find('#rotatable').attr('oheight'));
	display_preview_image();
})

function display_preview_image() {
	var backgroundimage = $("#ImageLibraryPreview").attr('content');
	if (backgroundimage != '') {
		$('#ImageLibraryPreview').css('background-image', 'url(/pixsigdata' + backgroundimage + ')');
		var owidth = parseInt($("#ImageLibraryPreview").attr('owidth'));
		var oheight = parseInt($("#ImageLibraryPreview").attr('oheight'));
		var background_size = "auto auto";
		if (owidth >= $('#ImageLibraryPreview').width() || oheight >= $('#ImageLibraryPreview').height()) {
			if (owidth > oheight) {
				background_size = "100% auto";
			} else {
				background_size = "auto 100%";
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

$('body').on('click', '.pix-ptempletzone-image-add', function(event) {
	var rowIndex = $(event.target).attr("data-id");
	if (rowIndex == undefined) {
		rowIndex = $(event.target).parent().attr('data-id');
	}
	var data = $('#ImageTable').dataTable().fnGetData(rowIndex);
	$("#ImageLibraryPreview").attr('imageid', data.imageid);
	$("#ImageLibraryPreview").attr('content', data.filepath);
	$("#ImageLibraryPreview").attr('owidth', data.width);
	$("#ImageLibraryPreview").attr('oheight', data.height);
	display_preview_image();
});

$('#ImageLibraryModal button[type=submit]').click(function(event) {
	CurrentPtempletzone.imageid = $('#ImageLibraryPreview').attr('imageid');
	CurrentPtempletzone.content = $('#ImageLibraryPreview').attr('content');
	refreshPtempletzone(CurrentPtempletzone);
	$('#ImageLibraryModal').modal('hide');
});

function refreshMediaTable() {
	$('#ImageTable').dataTable()._fnAjaxUpdate();
}

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

$('[type=submit]', $('#PtempletModal')).on('click', function(event) {
	if (submitflag) {
		return;
	}
	submitflag = true;
	Metronic.blockUI({
		zIndex: 20000,
		animate: true
	});
	$('#snapshot_div').show();
	redrawPtempletPreview($('#snapshot_div'), CurrentPtemplet, 1024);
	html2canvas($('#snapshot_div'), {
		onrendered: function(canvas) {
			//console.log(canvas.toDataURL());
			CurrentPtemplet.snapshotdtl = canvas.toDataURL();
			$('#snapshot_div').hide();

			$.ajax({
				type : 'POST',
				url : myurls['ptemplet.design'],
				data : '{"ptemplet":' + $.toJSON(CurrentPtemplet) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					submitflag = false;
					Metronic.unblockUI();
					$('#PtempletModal').modal('hide');
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
					$('#PtempletModal').modal('hide');
					console.log('failue');
				}
			});
		}
	});
});

