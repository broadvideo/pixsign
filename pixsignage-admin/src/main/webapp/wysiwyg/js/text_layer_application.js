var text_editable = 'click';

/*set text font color*/
function set_text_font_color(color) {
	color_div = $('#text_font_color a').wColorPicker({
		color           : color,  // set init color
	    theme           : 'classic',  // set theme
	    opacity         : 0.8,        // opacity level
	    mode            : 'click',     // mode for palette (flat, hover, click)
	    position        : 'bl',       // position of palette, (tl, tc, tr, rt, rm, rb, br, bc, bl, lb, lm, lt)
	    generateButton  : false,       // if mode not flat generate button or not
	    dropperButton   : false,      // optional dropper button to use in other apps
	    effect          : 'slide',    // only used when not in flat mode (none, slide, fade)
	    showSpeed       : 200,        // show speed for effects
	    hideSpeed       : 200,        // hide speed for effects
	    onMouseover     : null,       // callback for color mouseover
	    onMouseout      : null,       // callback for color mouseout
	    onSelect        : change_text_font_color,
	    onDropper       : null        // callback when dropper is clicked
	});
	update_text_font_color(color);
}
function update_text_font_color(color) {
	$('#text_font_color').css('background-color', color.toUpperCase());
	$('#text_font_color').attr('color', color.toUpperCase());
}
function change_text_font_color(color) {
	update_text_font_color(color);
	$('.select_layer').find('.rotatable').css('color', color.toUpperCase());
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}

/*set text shadow color*/
function set_text_shadow_color(color) {
	$('#text_shadow_color a').wColorPicker({
		color           : color,  // set init color
	    theme           : 'classic',  // set theme
	    opacity         : 0.8,        // opacity level
	    mode            : 'click',     // mode for palette (flat, hover, click)
	    position        : 'bl',       // position of palette, (tl, tc, tr, rt, rm, rb, br, bc, bl, lb, lm, lt)
	    generateButton  : false,       // if mode not flat generate button or not
	    dropperButton   : false,      // optional dropper button to use in other apps
	    effect          : 'slide',    // only used when not in flat mode (none, slide, fade)
	    showSpeed       : 200,        // show speed for effects
	    hideSpeed       : 200,        // hide speed for effects
	    onMouseover     : null,       // callback for color mouseover
	    onMouseout      : null,       // callback for color mouseout
	    onSelect        : change_text_shadow_color,
	    onDropper       : null        // callback when dropper is clicked
	});
	update_text_shadow_color(color);
}
function update_text_shadow_color(color) {
	$('#text_shadow_color').css('background-color', color.toUpperCase());
	$('#text_shadow_color').attr('color', color.toUpperCase());
}
function change_text_shadow_color(color) {
	update_text_shadow_color(color);
	set_text_shadow();
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
function set_text_shadow() {
	var shadow_x = $("#text_shadow_x").val();
	var shadow_y = $("#text_shadow_y").val();
	var shadow_blur = $("#text_shadow_blur").val();
	var shadow_color = $('#text_shadow_color').attr('color');
	$('.select_layer').find('#rotatable').css('text-shadow', shadow_x + 'px' + ' ' + shadow_y + 'px' + ' ' + shadow_blur + 'px' + ' ' + shadow_color);
}


function pasteHtmlAtCaret(html, id) {
	var selected_div_id = $('.select_layer').attr('id');
	//document.getElementById(selected_div_id).focus();
	var sel, range;
	if (window.getSelection) {
		// IE9 and non-IE
		sel = window.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			range = sel.getRangeAt(0);
			range.deleteContents();
			// Range.createContextualFragment() would be useful here but is
			// non-standard and not supported in all browsers (IE9, for one)
			var el = document.createElement(selected_div_id);
			el.innerHTML = html;
			var frag = document.createDocumentFragment(), node, lastNode;
			while ((node = el.firstChild)) {
				lastNode = frag.appendChild(node);
			}
			range.insertNode(frag);

			// Preserve the selection
			if (lastNode) {
				range = range.cloneRange();
				range.setStartAfter(lastNode);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
			}
		}
	} else if (document.selection && document.selection.type != "Control") {
		document.selection.createRange().pasteHTML(html);
	}
}
function SelectText(element) {
	var doc = document
			, text = doc.getElementById(element)
			, range, selection
			;
	if (doc.body.createTextRange) {
		range = document.body.createTextRange();
		range.moveToElementText(text);
		range.select();
	} else if (window.getSelection) {
		selection = window.getSelection();
		range = document.createRange();
		range.selectNodeContents(text);
		selection.removeAllRanges();
		selection.addRange(range);
	}
}
jQuery.fn.selectText = function () {
	var doc = document;
	var element = this[0];
	console.log(this, element);
	if (doc.body.createTextRange) {
		var range = document.body.createTextRange();
		range.moveToElementText(element);
		range.select();
	} else if (window.getSelection) {
		var selection = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(element);
		selection.removeAllRanges();
		selection.addRange(range);
	}
};

$(document).keydown(function (e) {
	if ((e.which == 13 && text_editable == 'enter') || (e.which == 13 && text_editable == 'dblclick' && !e.ctrlKey && !e.shiftKey)) {
		if (window.getSelection) {
			var selection = window.getSelection(),
					range = selection.getRangeAt(0),
					br = document.createElement("br"),
					textNode = document.createTextNode("\u00a0"); //Passing " " directly will not end up being shown correctly
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
	var p = $(".select_layer");
	var position = p.position();
	switch (e.which) {
		case 37:
			if (position.left <= 0) {
				return false;
			}
			break;
		case 38:
			if (position.top <= 0) {
				return false;
			}
			break;
		case 39:
			parent_div_width = $("#fixedwidth").width();
			right = $(".select_layer").width() + position.left;
			if (right >= parent_div_width) {
				return false;
			}
			break;
		case 40:
			parent_div_height = $("#fixedwidth").height();
			bottom = $(".select_layer").height() + position.top;
			if (bottom >= parent_div_height) {
				return false;
			}
			break;
	}

});

$(document).ready(function () {
	/*set text shadow color in x direction spinner*/
	$('#text_shadow_x').spinner({
		min: -15,
		max: 15,
		increment: 'fast'
	});
	/*set text shadow color in y direction spinner*/
	$('#text_shadow_y').spinner({
		min: -15,
		max: 15,
		increment: 'fast'
	});
	/*set text shadow color blur spinner*/
	$('#text_shadow_blur').spinner({
		min: 0,
		max: 12,
		increment: 'fast'
	});
	/*text font size spinner*/
	$("#text_font_size").spinner({
		min: 0,
		max: 1000,
		increment: 'fast'
	});
	/*set line height spinner*/
	$("#line_space_text").spinner({
		min: 0,
		max: 100,
		increment: 'fast'
	});
	/*Apply padding for text layer spinner*/
	$('#spinnerfast').spinner({
		min: 0,
		max: 1000,
		increment: 'fast'
	});


	$(".text_div").live('click', function (e) {
		var that = this;
		setTimeout(function () {
			var dblclick = parseInt($(that).data('double'), 10);
			if (dblclick > 0) {
				$(that).data('double', dblclick - 1);
			} else {
				singleClick.call(that, e);
			}
		}, 200);
	}).live('dblclick', function (e) {
		$(this).data('double', 2);
		if (!$(this).hasClass('select_layer')) {
			$(this).addClass('select_layer');
		}
		doubleClick.call(this, e);
	});	   

	function singleClick(e) {
		if (!e.ctrlKey) {
			remove_all_selected_layers();
			if (text_editable === 'click') {
				$('.select_layer_list').remove();
				$(this).css('cursor', 'move');
				$(this).find('#rotatable').css('cursor', 'move');
				set_layer_position_using_arrows("click");
				var name = $(this).attr('id').split('div')[0];
				var number = $(this).attr('id').split('div')[1];
				var zone_id = $('#' + name + 'name' + number).attr('id');
				var lock_zone_class = $('#' + zone_id).find('.lock').attr('class');
				common_disable_properties(this);
				$("#image_div_settings").hide();
				$("#text_div_settings").show();
				$("#lock_particular_zone").attr("onclick", "lock_selectedall_zone();");
				$("#unlock_particular_zone").attr("onclick", "unlock_selectedall_zone();");
				if (lock_zone_class == 'lock') {
					$(this).find('.resizable').find('div.ui-resizable-handle').addClass('select');
					apply_all_functionality_as_permission();
					$(this).addClass('select_layer');
					$(this).draggable('enable');
					$(this).draggable({containtment:'#fixedwidth'});
					$(this).find('#rotatable').resizable('destroy');
					$(this).find('#rotatable').resizable({
						aspectRatio: false,
						handles: 'ne, nw, se, sw'
					});
					$(this).find(".ui-rotatable-handle").css("display", "block");
					common_rotatable();
//					common_resizable();
					$('#lock_particular_zone').removeClass("lock_main");
					$('#unlock_particular_zone').addClass("unlock_main");
				} else {
					$('.setting_div').block(block_option);
					$('#select_div_bring_to_front').attr('onclick', '').css('opacity', '0.3');
					$('#select_div_send_to_back').attr('onclick', '').css('opacity', '0.3');
					$('#lock_particular_zone').addClass("lock_main");
					$('#unlock_particular_zone').removeClass("unlock_main");
					$(this).draggable('disable');
					$(this).find('#rotatable').resizable('disable');
					$(this).find('div.ui-resizable-handle').addClass('select');
					$(this).find(".ui-rotatable-handle").css("display", "none");
				}
				$(".ui-rotatable-handle").css('background', '#EEEEEE');
				apply_coords(this);
				e.stopPropagation();
			} else {
				if (!$(this).hasClass('select_layer')) {
					$(this).addClass('select_layer');
				}
				//common_disable_properties(this);				
				e.stopPropagation();
			}
		}
	}

	function doubleClick(e) {
		if (!e.ctrlKey) {
			//$('.select_layer').find('#rotatable').removeClass('dblclick');
			if (!$(this).find('#rotatable').hasClass('dblclick')) {
				text_editable = 'dblclick';
				$(window).unbind('keydown');
				$(this).find('#rotatable').css('cursor', 'text');
				$(this).find('#rotatable').attr("contenteditable", true);
				$(this).find('#rotatable').css('word-wrap', 'break-word');
				$('.select_layer').find('#rotatable').trigger('focus');

				$('#border_box').css('display', 'none');
				$('#text_back_coloepicker').css('display', 'none');

				common_disable_properties(this);
				var name = $(this).attr('id').split('div')[0];
				var number = $(this).attr('id').split('div')[1];
				var zone_id = $('#' + name + 'name' + number).attr('id');
				var lock_zone_class = $('#' + zone_id).find('.lock').attr('class');

				$(this).draggable('disable');

				if (lock_zone_class == 'lock') {
					$(this).find('#rotatable').attr("contenteditable", true);
					//$(this).find('div.ui-resizable-handle').removeClass('select');
					//$(this).draggable('disable');
					//$(this).find('#rotatable').resizable('enable');

					//$(this).find(".ui-rotatable-handle").css("display", "block");
					common_rotatable();
					$('#lock_particular_zone').removeClass("lock_main");
					$('#unlock_particular_zone').addClass("unlock_main");
					$("#image_div_settings").hide();
					$('#text_div_settings').show();
				} else {
					//$(this).find('div.ui-resizable-handle').addClass('select');
					text_div_remove_onclick();
					$(this).find('#rotatable').attr("contenteditable", false);
					$('#lock_particular_zone').addClass("lock_main");
					$('#unlock_particular_zone').removeClass("unlock_main");
				}
				$(".ui-rotatable-handle").css('background', '#EEEEEE');
				apply_coords(this);
				e.stopPropagation();

				$("#create_li_list li").each(function () {
					all_zone_id = $(this).attr('id');
					$('#' + all_zone_id).find('.mem_per').remove();
				});
			}
			$('.select_layer').removeClass('ui-state-disabled');
			$('.select_layer').find("#rotatable").resizable('disable');
			$('.select_layer').find(".ui-rotatable-handle").css("display", "none");
			$('.select_layer').find('.ui-resizable-handle').removeClass('select');
			$('.select_layer').addClass('ui-state-disabled');
			$('.select_layer').draggable('disable');
			$('#font_size_settings').css('display', 'block');

			var ret = $(this).attr('id').split("_");
			$('.select_layer').find('#rotatable').find("p").attr('id', 'clstextedit_' + ret[1]);
			var texteditid = $('.select_layer').find('#rotatable').find("p").attr('id');

			$('.select_layer').find('#rotatable').attr("contenteditable", true);
			$('.select_layer').find('#rotatable').addClass('dblclick');
			//SelectText(texteditid);
			$('.select_layer').find('#rotatable').selectText();
			$('.select_layer').find('#rotatable').trigger('click');
		}
		// do something, "this" will be the DOM element
	}

	//Text zone focus out function
	$(".select_layer").find("#rotatable").live('focusout', function (e) {
		$('.text_div').find("#rotatable").removeClass('dblclick');
		$('.text_div').find("#rotatable").attr("contenteditable", false);
		text_editable = 'click';

	});

	// text zone keydown event
	$(".text_div").find('#rotatable').live('keydown', function (e) {
		var min_height = $(this).css('height');
		var h = $(this).find("p").height();
		if (h > parseInt(min_height)) {
			$(this).css('height', 'auto');
		}

		var min_width = $(this).css('width');
		var w = $(this).find("p").width();
		if (w > parseInt(min_width)) {
			$(this).css('width', 'auto');
		}
	});
});

function text_ticker() {
	var a = $("#diraction").val();
	$(".select_layer").find("#textticker_direction").val(a);

	var b = $("#duration").text();
	$(".select_layer").find("#textticker_duration").val(b);
}

function create_text_div(zoneid, text_val, z_index_value, zone_name, lock_zone_class, div_id, div_name, funct) {
	if (zoneid == undefined) {
		zoneid = 0;
	}
	create_text_div_procedure(zoneid, text_val, z_index_value, zone_name, lock_zone_class, div_id, div_name, funct);
	if (funct != 'init' && text_val == '') {
		makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
	}
}
/*create text layer*/
function create_text_div_procedure(zoneid, text_val, z_index_value, zone_name, lock_zone_class, div_id, div_name, funct) {
	var textdiv = document.createElement('div');
	textdiv.setAttribute('zoneid', zoneid);
	textdiv.setAttribute('zonetype', 'text');
	textdiv.className = 'text_div active';
	if (div_id) {
		var edit_id = div_id;
	} else {
		edit_id = img;
	}
	textdiv.unselectable = 'off';
	if (div_id) {
		textdiv.id = 'textdiv_' + div_id;
	} else {
		textdiv.id = 'textdiv_' + img;
		var layer_left = ((template_width / 2) - 75);
		$(textdiv).css('left', layer_left + 'px');
	}
	var rotate_div = document.createElement('div');
	rotate_div.className = 'rotatable';
	rotate_div.id = 'rotatable';
	//rotate_div.contentEditable = "true";
	rotate_div.addEventListener("paste", function(e) {
		// cancel paste
		e.preventDefault();

		// get text representation of clipboard
		var text = e.clipboardData.getData("text/plain");
//		console.log(e.clipboardData ,  text) ;  

		// insert text manually
//		document.execCommand("insertHTML", false, text);
		document.execCommand("insertText", false, text);
	});

	var p_tag = document.createElement('p');
	p_tag.className = 'clstextedit';
	p_tag.id = 'clstextedit_' + img;


	var resize_div = document.createElement('div');
	resize_div.className = 'resizable';
	resize_div.id = 'resizable';
	if (text_val == undefined || text_val == null) {
		text_val = "Double click to edit text";
	} else {
		text_val = text_val.replace(/&nbsp;/g, ' ');
	}
	$(p_tag).append(text_val);
	//rotate_div.innerHTML = text_val;
	$(textdiv).css('z-index', z_index);
	//$(rotate_div).css('line-height', 'normal');
	$(rotate_div).css('line-height', '15px');
	var tabindex = '';
	browser_check();
	if (isOpera) {
		$(rotate_div).css('-o-transform', 'matrix(1,0,0,1,0,0)');
	} else if (isFirefox) {
		tabindex = 'tabindex="0"';
		$(rotate_div).css('-moz-transform', 'matrix(1,0,0,1,0,0)');
	} else if (isChrome || isSafari) {
		$(rotate_div).css('-webkit-transform', 'matrix(1,0,0,1,0,0)');
	}
	common_disable_properties(textdiv);
	var border_style = '<div id="b_all_style"><input type="hidden" id="b_color" value=""/>';
	border_style += '<input type="hidden" id="b_style" value="">';
	border_style += '<input type="hidden" id="b_width" value="">';
	border_style += '<input type="hidden" id="permission" value="1">';
	border_style += '<input type="hidden" id="font_file" value="DroidSans.ttf">';
	border_style += '<input type="hidden" id="textticker_direction">';
	border_style += '<input type="hidden" id="textticker_duration">';
	border_style += '</div>';

	$(rotate_div).append(p_tag);
	$(resize_div).append(rotate_div);
	$(textdiv).append(resize_div);
	$(textdiv).append(border_style);
	$(textdiv).find('#rotatable').find('p').css('word-wrap', 'break-word');
	$(textdiv).find('#rotatable').find('p').css('white-space', 'pre-wrap');
	$('.fixedwidth').append(textdiv);	
	
	$(".text_div").draggable({
		containment: "#fixedwidth"
	});
	
	if (!div_id || funct == 'undo') {
		common_disable_properties(textdiv);
		apply_coords(textdiv);
		common_rotatable();
		$(".select_layer").draggable({
			containment: "#fixedwidth",
			drag: function (e, ui) {
				set_position_select_layer(ui.position.left, ui.position.top);
				create_error_select_layer_outof_range(this, ui.position.left, ui.position.top, '', 'click');
			}
		});
		$("#image_div_settings").hide();
		$('#text_div_settings').show();
		var width = $(rotate_div).width();
		var height = $(rotate_div).height();
		var new_l = $(textdiv).position().left;
		var new_t = $(textdiv).position().top;
		var left1 = Math.round(new_l * (original_width / template_width));
		var top1 = Math.round(new_t * (original_width / template_width));
		$(".select_layer").find('#height').val(Math.round(height * (original_width / template_width))).find('#width').val(Math.round(width * (original_width / template_width))).find('#left').val(left1).find('#top').val(top1);
	}
	common_resizable();
	if (old_id == null) {
		if (zone_name == undefined || zone_name == null) {
			var li_html = '<li class="level2" id="textname_' + img + '" zoneid="' + img + '" zonetype="text">';
			li_html += '<div id="' + img + '" class="dv_my dv_actv"><div class="dots"></div>';
			li_html += '<div style="float:left; width:20px;" class="chek">';
			li_html += '<label class="label_check c_on" for="checkbox-' + (parseInt(img) + 1) + '">';
			li_html += '<input name="sample-checkbox-' + (parseInt(img) + 1) + '" id="checkbox-' + (parseInt(img) + 1) + '" type="checkbox"/>';
			li_html += '</label></div>';
			li_html += '<div class="a"><img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;"></div>';
			li_html += '<div class="redapple">Text Area ' + img + '</div>';
			li_html += '<input type="hidden" id="zone_name" value="Text Area ' + img + '"/>';
			li_html += '<div class="lock" id="locktext_' + img + '" onclick="lock_zone(this.id);"></div>';
			li_html += '<!--<div class="etings" id="member_view_' + img + '"><img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;"></div>-->';
			li_html += '<div class="visible act" onclick="javascript:set_visible_and_unvisible_layer(this);">';
			li_html += '<img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;">';
			li_html += '</div></div></li>';
			$('#create_li_list').prepend(li_html);
		} else {
			var li_html = '<li class="level2" id="textname_' + div_id + '" zoneid="' + div_id + '" zonetype="text">';
			li_html += '<div id="' + div_id + '" class="dv_my ">';
			li_html += '<div class="dots"></div>';
			li_html += '<div style="float:left; width:20px;" class="chek">';
			li_html += '<label class="label_check c_off" for="checkbox-' + (parseInt(div_id) + 1) + '">';
			li_html += '<input name="sample-checkbox-' + (parseInt(div_id) + 1) + '" id="checkbox-' + (parseInt(div_id) + 1) + '" type="checkbox"/>';
			li_html += '</label></div>';
			li_html += '<div class="a"><img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;"></div>';
			li_html += '<div class="redapple">' + zone_name + '</div>';
			li_html += '<input type="hidden" id="zone_name" value="' + zone_name + '"/>';
			li_html += '<div class="' + lock_zone_class + '" id="locktext_' + div_id + '" onclick="lock_zone(this.id);"></div>';
			li_html += '<!--<div class="etings" id="member_view_' + div_id + '" ><img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;"></div>-->';
			li_html += '<div class="visible act" onclick="javascript:set_visible_and_unvisible_layer(this);">';
			li_html += '<img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;">';
			li_html += '</div></div></li>';
			$('#create_li_list').prepend(li_html);
		}
	}
	else {
		var number = old_id.split('name')[1];
		var mytext = number.replace('_', '');
		var li_html = '<li class="level2" id="textname_' + mytext + '" zoneid="' + mytext + '" zonetype="text">';
		li_html += '<div id="' + mytext + '" class="dv_my ">';
		li_html += '<div class="dots"></div>';
		li_html += '<div style="float:left; width:20px;" class="chek">';
		li_html += '<label class="label_check c_off" for="checkbox-' + (parseInt(mytext) + 1) + '">';
		li_html += '<input name="sample-checkbox-' + (parseInt(mytext) + 1) + '" id="checkbox-' + (parseInt(mytext) + 1) + '" type="checkbox"/>';
		li_html += '</label></div>';
		li_html += '<div class="a"><img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;"></div>';
		li_html += '<div class="redapple">' + retrive_zone_name + '</div>';
		li_html += '<div class="lock" id="locktext_' + mytext + '" onclick="lock_zone(this.id);"></div>';
		li_html += '<!--<div class="etings" id="member_view_' + mytext + '" ><img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;"></div>-->';
		li_html += '<div class="visible act" onclick="javascript:set_visible_and_unvisible_layer(this);" style="cursor: pointer;">';
		li_html += '<img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;">';
		li_html += '</div></div></li>';
		$('#create_li_list').prepend(li_html);
	}
	onload();
	apply_all_functionality_as_permission();
	/* Rename name of layer */
	editable_zone_name();
	j++;
	img++;
	z_index++;
}
/*set text-align*/
function set_text_alignment(alignment) {
//	var left = $('.select_layer').find('#rotatable').css('text-align');	
	$('.highlight').removeClass("highlight");
	if (alignment == 'left')
		$('#text_align_left').toggleClass("highlight");
	if (alignment == 'center')
		$('#text_align_center').toggleClass("highlight");
	if (alignment == 'right')
		$('#text_align_right').toggleClass("highlight");
	if (alignment == 'justify')
		$('#text_align_justify').toggleClass("highlight");
	$('.select_layer').find('#rotatable').css('text-align', alignment);
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
/*set text-align left*/
//function set_text_left() {
//	var left = $('.select_layer').find('#rotatable').css('text-align');
//	if (left == 'center' || left == 'right' || left == 'justify' || left == 'start' || left == undefined)
//	{
//		$('#text_align_right').removeClass("highlight");
//		$('#text_align_center').removeClass("highlight");
//		$('#text_align_justify').removeClass("highlight");
//		$('#text_align_left').toggleClass("highlight");
//		$('.select_layer').find('#rotatable').css('text-align', 'left');
//		makeHistory_Array($('.fixedwidth').html(),$('#create_li_list').html());
//	}
//}
/*set text-align center*/
//function set_text_center() {
//	var center = $('.select_layer').find('#rotatable').css('text-align');
//	if (center == 'right' || center == 'left' || center == 'justify' || center == 'start' || center == undefined)
//	{
//		$('#text_align_left').removeClass("highlight");
//		$('#text_align_right').removeClass("highlight");
//		$('#text_align_justify').removeClass("highlight");
//		$('#text_align_center').toggleClass("highlight");
//		$('.select_layer').find('#rotatable').css('text-align', 'center');
//		makeHistory_Array($('.fixedwidth').html(),$('#create_li_list').html());
//	}
//}
/*set text-align right*/
//function set_text_right() {
//	var right = $('.select_layer').find('#rotatable').css('text-align');
//	if (right == 'center' || right == 'left' || right == 'justify' || right == 'start' || right == undefined)
//	{
//		$('#text_align_left').removeClass("highlight");
//		$('#text_align_center').removeClass("highlight");
//		$('#text_align_justify').removeClass("highlight");
//		$('#text_align_right').toggleClass("highlight");
//		$('.select_layer').find('#rotatable').css('text-align', 'right');
//		makeHistory_Array($('.fixedwidth').html(),$('#create_li_list').html());
//	}
//}
/*set text-align justify*/
//function set_text_justify() {
//	var justify = $('.select_layer').find('#rotatable').css('text-align');
//	if (justify == 'right' || justify == 'left' || justify == 'center' || justify == 'start' || justify == undefined)
//	{
//		$('#text_align_left').removeClass("highlight");
//		$('#text_align_right').removeClass("highlight");
//		$('#text_align_center').removeClass("highlight");
//		$('#text_align_justify').toggleClass("highlight");
//		$('.select_layer').find('#rotatable').css('text-align', 'justify');
//		makeHistory_Array($('.fixedwidth').html(),$('#create_li_list').html());
//	}
//}
/*set font-weight*/
function set_text_bold() {
	var bold = $('.select_layer').find('#rotatable').css('font-weight');
	if (bold == '400' || bold == 'normal' || bold == undefined) {
		$('#text_font_bold').toggleClass('highlight');
		$('.select_layer').find('#rotatable').css('font-weight', 'bold');
	} else {
		$('#text_font_bold').removeClass('highlight');
		$('.select_layer').find('#rotatable').css('font-weight', 'normal');
	}
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
/*set font-style property*/
function set_text_italic() {
	var italic = $('.select_layer').find('#rotatable').css('font-style');
	if (italic == '' || italic == 'normal' || italic == undefined) {
		$('#text_font_italic').toggleClass("highlight");
		$('.select_layer').find('#rotatable').css('font-style', 'italic');
	}
	else
	{
		$('#text_font_italic').removeClass("highlight");
		$('.select_layer').find('#rotatable').css('font-style', 'normal');
	}
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
/*set text-decoration property*/
function set_text_underline() {
	var underline = $('.select_layer').find('#rotatable').find("p").css('text-decoration');
	if (underline == '' || underline == 'none' || underline == undefined)
	{
		$('#text_font_underline').toggleClass("highlight");
		$('.select_layer').find('#rotatable').find("p").css('text-decoration', 'underline');
	}
	else
	{
		$('#text_font_underline').removeClass("highlight");
		$('.select_layer').find('#rotatable').find("p").css('text-decoration', '');
		$('.select_layer').find('#rotatable').css('text-decoration', '');
	}
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
/*set text-decoration property*/
function set_text_strikethrough() {
	var linethrough = $('.select_layer').find('#rotatable').find("p").css('text-decoration');
	if (linethrough == '' || linethrough == 'none' || linethrough == undefined)
	{
		$('#text_font_strikethrough').toggleClass("highlight");
		$('.select_layer').find('#rotatable').find("p").css('text-decoration', 'line-through');
	}
	else
	{
		$('#text_font_strikethrough').removeClass("highlight");
		$('.select_layer').find('#rotatable').find("p").css('text-decoration', '');
		$('.select_layer').find('#rotatable').css('text-decoration', '');
	}
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
/*Apply unorder list property*/
function apply_unorder_list() {

	$('#text_unorder').addClass("highlight");
	$(".select_layer").find('#rotatable').resizable("destroy");

	var alldiv = $('.select_layer').find('#rotatable').find('#b_all_style');
	$('.select_layer').find('#rotatable').find('#b_all_style').remove();
	$('.select_layer').find('.ui-rotatable-handle').remove();
	$('.select_layer').find('br[type="_moz"]').remove();

	var val = $('.select_layer').find('#rotatable').find("p").html().replace(/\<div>/g, '<br>').replace(/\<\/div>/g, '');
	if (val.indexOf("<li>") < 0) {

		var myval = val.replace(/\_moz_dirty=""/g, '');
		var newText = myval.split("<br>");
		var Ulist = "<ul  id='ul_list' >";
		for (var i = 0; i < newText.length; i++) {
			if (i == newText.length - 1) {
				if (newText[i] != "") {
					Ulist += "<li>" + newText[i] + "</li>";
				}
			} else {
				Ulist += "<li>" + newText[i] + "</li>";
			}
		}
		$('.select_layer').find('#rotatable').find("p").html('');
		$('.select_layer').find('#rotatable').find("p").html(Ulist);
		$('.select_layer').find('#rotatable').append(alldiv);
		common_resizable();
		common_rotatable();
	}
	else {
		$('.select_layer').find('br[type="_moz"]').remove();
		var finalvalol = $('.select_layer').find('#rotatable').has('ol');
		var finalvalul = $('.select_layer').find('#rotatable').has('ul');
		if (finalvalol[0] == '[object HTMLDivElement]')
		{
			$('#text_order').removeClass("highlight");
			var myolinval = $('.select_layer').find('#ol_list').html();
			ul_val = myolinval.replace(/\<li>/g, '');
			ul_val2 = ul_val.replace(/\li/g, '');
			ul_val3 = ul_val2.replace(/\//g, '');
			ul_val4 = ul_val3.replace(/\<>/g, '<br>');
			$('.select_layer').find('#rotatable').find("p").html('');
			$('.select_layer').find('#rotatable').find("p").append(ul_val4);
			var finalval = $('.select_layer').find('#rotatable').find("p").html();
			if (finalval.indexOf("<li>") < 0) {

				var myfinalval = finalval.replace(/\_moz_dirty=""/g, '');
				var mynewText = myfinalval.split("<br>");
				var myUlist = "<ul  id='ul_list' >";
				for (var j = 0; j < mynewText.length; j++) {
					if (j == mynewText.length - 1) {
						if (mynewText[j] != "") {
							myUlist += "<li>" + mynewText[j] + "</li>";
						}
					} else {
						myUlist += "<li>" + mynewText[j] + "</li>";
					}
				}
				$('.select_layer').find('#rotatable').find("p").html('');
				$('.select_layer').find('#rotatable').find("p").html(myUlist);
				$('.select_layer').find('#rotatable').find("p").append(alldiv);
				common_resizable();
				common_rotatable();
			}
			else {
				var myinval = $('.select_layer').find('#rotatable').find("p").find('#ul_list').html();
				ul_val = myinval.replace(/\<li>/g, '');
				ul_val2 = ul_val.replace(/\li/g, '');
				ul_val3 = ul_val2.replace(/\//g, '');
				ul_val4 = ul_val3.replace(/\<>/g, '<br>');
				$('.select_layer').find('#rotatable').find("p").html('');
				$('.select_layer').find('#rotatable').find("p").append(ul_val4);
			}
		}
		else if (finalvalul[0] == '[object HTMLDivElement]') {
			$('#text_unorder').removeClass("highlight");
			$('#text_order').removeClass("highlight");
			var myinnrval = $('.select_layer').find('#rotatable').find("p").find('#ul_list').html();
			ul_val = myinnrval.replace(/\<li>/g, '');
			ul_val2 = ul_val.replace(/\li/g, '');
			ul_val3 = ul_val2.replace(/\//g, '');
			ul_val4 = ul_val3.replace(/\<>/g, '<br>');
			$('.select_layer').find('#rotatable').find("p").html('');
			$('.select_layer').find('#rotatable').find("p").append(ul_val4);
			$('.select_layer').find('#rotatable').find("p").append(alldiv);
			common_resizable();
			common_rotatable();
		}
	}
//	makeHistory_Array($('.fixedwidth').html(),$('#create_li_list').html());
}
/*Apply order list property*/
function apply_order_list() {

	$('#text_order').addClass("highlight");
	$(".select_layer").find('#rotatable').resizable("destroy");

	var alldiv = $('.select_layer').find('#rotatable').find('#b_all_style');
	$('.select_layer').find('#rotatable').find('#b_all_style').remove();
	$('.select_layer').find('.ui-rotatable-handle').remove();

	var val = $('.select_layer').find('#rotatable').find("p").html().replace(/\<div>/g, '<br>').replace(/\<\/div>/g, '');

	if (val.indexOf("<li>") < 0) {

		var myval = val.replace(/\_moz_dirty=""/g, '');
		var newText = myval.split("<br>");
		var olist = "<ol id='ol_list' >";
		for (var i = 0; i < newText.length; i++) {
			if (i == newText.length - 1) {
				if (newText[i] != "") {
					olist += "<li>" + newText[i] + "</li>";
				}
			} else {
				olist += "<li>" + newText[i] + "</li>";
			}
		}
		$('.select_layer').find('#rotatable').find("p").html('');
		$('.select_layer').find('#rotatable').find("p").html(olist);
		$('.select_layer').find('#rotatable').find("p").append(alldiv);
		common_resizable();
		common_rotatable();
	}
	else {
		var finalvalol = $('.select_layer').has('ol');
		var finalvalul = $('.select_layer').has('ul');
		if (finalvalul[0] == '[object HTMLDivElement]')
		{
			$('#text_unorder').removeClass("highlight");
			var myolinval = $('.select_layer').find('#rotatable').find("p").find('#ul_list').html();
			ol_val = myolinval.replace(/\<li>/g, '');
			ol_val2 = ol_val.replace(/\li/g, '');
			ol_val3 = ol_val2.replace(/\//g, '');
			ol_val4 = ol_val3.replace(/\<>/g, '<br>');
			$('.select_layer').find('#rotatable').find("p").html('');
			$('.select_layer').find('#rotatable').find("p").append(ol_val4);
			var finalval = $('.select_layer').find('#rotatable').find("p").html();
			if (finalval.indexOf("<li>") < 0) {

				var myfinalval = finalval.replace(/\_moz_dirty=""/g, '');
				var mynewText = myfinalval.split("<br>");
				var myolist = "<ol  id='ol_list' >";
				for (var j = 0; j < mynewText.length; j++) {
					if (j == mynewText.length - 1) {
						if (mynewText[j] != "") {
							myolist += "<li>" + mynewText[j] + "</li>";
						}
					} else {
						myolist += "<li>" + mynewText[j] + "</li>";
					}
				}
				$('.select_layer').find('#rotatable').find("p").html('');
				$('.select_layer').find('#rotatable').find("p").html(myolist);
				$('.select_layer').find('#rotatable').find("p").append(alldiv);
				common_resizable();
				common_rotatable();
			}
			else {
				var myinval = $('.select_layer').find('#rotatable').find("p").find('#ol_list').html();
				ol_val = myinval.replace(/\<li>/g, '');
				ol_val2 = ol_val.replace(/\li/g, '');
				ol_val3 = ol_val2.replace(/\//g, '');
				ol_val4 = ol_val3.replace(/\<>/g, '<br>');
				$('.select_layer').find('#rotatable').find("p").html('');
				$('.select_layer').find('#rotatable').find("p").append(ol_val4);
			}
		}
		else if (finalvalol[0] == '[object HTMLDivElement]') {

			$('#text_order').removeClass("highlight");
			var myinnrval = $('.select_layer').find('#rotatable').find("p").find('#ol_list').html();
			ol_val = myinnrval.replace(/\<li>/g, '');
			ol_val2 = ol_val.replace(/\li/g, '');
			ol_val3 = ol_val2.replace(/\//g, '');
			ol_val4 = ol_val3.replace(/\<>/g, '<br>');
			$('.select_layer').find('#rotatable').find("p").html('');
			$('.select_layer').find('#rotatable').find("p").append(ol_val4);
			$('.select_layer').find('#rotatable').find("p").append(alldiv);
			common_resizable();
			common_rotatable();
		}
	}
//	makeHistory_Array($('.fixedwidth').html(),$('#create_li_list').html());
}

/*set text color*/
function set_text_color() {
	var text_color = $("#color").val();
	set_text_font_color(text_color);
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
/*set text-shadow color*/
function chnage_shadow_color() {
	var backround_c = $("#color_shadow").val();
	set_text_shadow_color(backround_c);
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
/*remove all text related onclick functions when layer is locked*/
function text_div_remove_onclick() {
	$(this).draggable('disable');
	$(this).find("#rotatable").resizable('disable');
	$('#text_font_family').attr('disabled', true);
	$("#text_unorder").attr('onclick', '');
	$("#text_order").attr('onclick', '');
	$("#text_align_left").attr('onclick', '');
	$("#text_align_center").attr('onclick', '');
	$("#text_align_right").attr('onclick', '');
	$("#text_align_justify").attr('onclick', '');
	$("#text_font_bold").attr('onclick', '');
	$("#text_font_italic").attr('onclick', '');
	$("#text_font_underline").attr('onclick', '');
	$("#text_font_strikethrough").attr('onclick', '');
	$('#text_font_size').spinner('disable');
	$('#spinnerfast').spinner('disable');

	$('#alignment_title').show();
	$('#roate_title').show();
	$('#background_title').show();
	$('#border_title').show();
	$("#image_div_settings").hide();
	$("#text_div_settings").show();
	//	$(this).removeClass('select_layer');
	blank_allonclick_forlockdiv();
//	makeHistory_Array($('.fixedwidth').html(),$('#create_li_list').html());
}
/*set font-family*/
function set_font_family() {
	var value = $('#text_font_family').val();
	$('.select_layer').find('#rotatable').css('font-family', value);
	$('.font_family .jqTransformSelectWrapper span').html(formatString(value, 10, 7, 3));
	var font_file_val = $('#text_font_family option:selected').attr('data-font-file');
	$('.select_layer').find('#font_file').val('');
	$('.select_layer').find('#font_file').val(font_file_val);
//  $('.font_family > .jqTransformSelectWrapper div span').html(formatString(value, 10, 7, 3));
}
/*text-size of text layer*/
function set_text_font_size() {
	var myvalue = $('#text_font_size').val();
	$('.select_layer').find('#rotatable').css('font-size', myvalue + 'px');
	var min_height = $('.select_layer').find('#rotatable').css('height');
	var h = $('.select_layer').find('#rotatable').find('p').height();
	if (h > parseInt(min_height)) {
		$('.select_layer').find('#rotatable').css('height', 'auto');
	}

	var min_width = $('.select_layer').find('#rotatable').css('width');
	var w = $('.select_layer').find('#rotatable').find('p').width();
	if (w > parseInt(min_width)) {
		$('.select_layer').find('#rotatable').css('width', 'auto');
	}

}
/*padding of text layer*/
function apply_padding_text() {
	var pading_text = parseInt($('#spinnerfast').val());

	$('.select_layer').find('#rotatable').css('padding', pading_text + 'px');

	var h = $('#height_val').val();
	var w = $('#width_val').val();

	var width = w - pading_text * 2;
	var height = h - pading_text * 2;
	$('.select_layer').find('#rotatable').height(height);
	$('.select_layer').find('#rotatable').width(width);
	if ($('#fixedwidth').width() == original_width) {
		$('#div_width').val(Math.round(width));
		$('#div_height').val(Math.round(height));
	} else {
		$('#div_width').val(Math.round(width * (original_width / template_width)));
		$('#div_height').val(Math.round(height * (original_width / template_width)));
	}
}
/*line sapce of text layer*/
function set_line_space_text() {
	var line_hight = parseInt($('#line_space_text').val());
	$('.select_layer').find('#rotatable').css('line-height', line_hight + 'px');
}
