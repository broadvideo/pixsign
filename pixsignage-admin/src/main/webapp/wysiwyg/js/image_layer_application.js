/*set image shadow color*/
function set_image_shadow_color(color) {
	$('#image_shadow_color a').wColorPicker({
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
	    onSelect        : change_image_shadow_color,
	    onDropper       : null        // callback when dropper is clicked
	});
	update_image_shadow_color(color);
}
function update_image_shadow_color(color) {
	$('#image_shadow_color').css('background-color', color.toUpperCase());
	$('#image_shadow_color').attr('color', color.toUpperCase());
}
function change_image_shadow_color(color) {
	update_image_shadow_color(color);
	set_image_shadow();
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
function set_image_shadow() {
    var shadow_x = $('#image_shadow_x').val();
    var shadow_y = $('#image_shadow_y').val();
    var shadow_blur = $('#image_shadow_blur').val();
    var shadow_color = $('#image_shadow_color').attr('color');
    if (shadow_x != 0 || shadow_y != 0 || shadow_blur != 0) {
        $('.select_layer').find('#rotatable').css('box-shadow', shadow_x + 'px' + ' ' + shadow_y + 'px' + ' ' + shadow_blur + 'px' + ' ' + shadow_color);
    } else if (shadow_x == 0 && shadow_y == 0 && shadow_blur == 0) {
        $('.select_layer').find('#rotatable').css('box-shadow', 'none');
    }
}


var selected_img_file = "";
var image_type = "";
$(document).ready(function () {
	/*Slider for image opacity*/
	$('#background_opacity').slider({
		min: 0,
		max: 100,
		step: 1,
		value: 50,
		orientation: "horizontal",
		slide: function (e, ui) {
			$('#border_box').css('display', 'none');
			var mycolor = $('.select_layer').find('#rotatable').css('background-color');
			if (mycolor == 'transparent') {
				mycolor = $("#color_b").css('background-color');
			}
			if (mycolor) {
				var rgb = mycolor.replace(/[^\d,]/g, '').split(',');
				var r = rgb[0];
				var g = rgb[1];
				var b = rgb[2];
				$('.select_layer').find('#rotatable').css('background-color', 'rgba(' + r + ',' + g + ',' + b + ',' + ui.value / 100 + ')');
				$("#background_opacity_value").html(ui.value + "%");
			}
		}
	});
	$("#background_opacity_value").html(Math.round($("#background_opacity").slider("value")) + "%");
	/*Slider for set image layer opacity*/
	$("#image_opacity").slider({
		value: 100,
		min: 0,
		max: 100,
		step: 1,
		slide: function (event, ui) {
			$('#text_back_coloepicker').css('display', 'none');
			$('#border_box').css('display', 'none');
			$('.select_layer').find('#rotatable').children('.inner_div').css('opacity', ui.value / 100);
			$('#image_opacity_value').html(ui.value + '%');
		}
	});
	$('#image_opacity_value').html(Math.round($('#image_opacity').slider('value')) + '%');
	/*spinner for image box-shadow x direction*/
	$('#image_shadow_x').spinner({
		min: -15,
		max: 15,
		increment: 'fast'
	});
	/*spinner for image box-shadow y direction*/
	$('#image_shadow_y').spinner({
		min: -15,
		max: 15,
		increment: 'fast'
	});
	/*spinner for image box-shadow blur*/
	$('#image_shadow_blur').spinner({
		min: 0,
		max: 12,
		increment: 'fast'
	});
	/*spinner for padding of image layer*/
	$('#spinner_img').spinner({
		min: 0,
		max: 1000,
		increment: 'fast'
	});
	/*spinner for kenburn speed control*/
	$("#kenburn_duration_txt").spinner({
		min: 5,
		max: 15,
		increment: 'fast'
	});
	/*Upload image*/
	$('#pageimage').live('change', function () {
		var throberdiv = '<div id = "throberdiv"  >&nbsp;</div>';
		$(throberdiv).prependTo("body");
		$('#image_upload_form input[name="pageid"]').val(CurrentPage.pageid);
		$("#image_upload_form").ajaxForm({
			dataType: 'json',
			success: function (data) {
				$('#pageimage').val('');
				if (data.errorcode != 0) {
					$("#throberdiv").remove();
					bootbox.alert(common.tips.error + data.errormsg);
					return false;
				}

				var image_data = data.image;
				var w = image_data.width;
				var h = image_data.height;
				var new_w = $(".select_layer").find('#rotatable').width();
				var new_h = $(".select_layer").find('#rotatable').height();
				if (w > h) {
					new_h = (h / w) * new_w;
				} else {
					new_w = (w / h) * new_h;
				}

				$(".select_layer").find('#rotatable').width(new_w);
				$(".select_layer").find('#rotatable').height(Math.round(new_h));
				$('.select_layer').find('.inner_div').css('background-image', 'url(/pixsigdata' + image_data.filepath + ')');
				$('.select_layer').find('.inner_div').attr('content', image_data.filepath);
				$('.select_layer').find('.inner_div').attr('imageid', image_data.imageid);
				$('.select_layer').find('.inner_div').attr('owidth', image_data.width);
				$('.select_layer').find('.inner_div').attr('oheight', image_data.height);
				$(".select_layer").find('#rotatable').resizable('destroy');
				var div_width = parseInt(new_w) * (original_width / template_width);
				var div_height = parseInt(new_h) * (original_width / template_width);
				$(".select_layer").find('#width').val(div_width);
				$(".select_layer").find('#height').val(div_height);
				$(".select_layer").find('.rotatable').resizable("destroy");
				common_resizable(true);
				apply_coords($(".select_layer"));
				$("#throberdiv").remove();
			}
		}).submit();
	});

	/*click and double click event for image layer*/
	$(".select_layer").draggable({
		drag: function (e, ui) {
			set_position_select_layer(ui.position.left, ui.position.top);
			create_error_select_layer_outof_range(this, ui.position.left, ui.position.top, '', 'click');
		}
	});
	layer_list_show_over_tipsy();

	$(".image_div").live('click', function (e) {
		if (!e.ctrlKey) {
			$('.select_layer_list').remove();
			$(this).css('cursor', 'move');
			$(this).find('#rotatable').css('cursor', 'move');
			set_layer_position_using_arrows("click");
			$('#border_box').css('display', 'none');
			$('#text_back_coloepicker').css('display', 'none');
			$('#size_position').show();
			common_disable_properties(this);
			var name = $(this).attr('id').split('div')[0];
			var number = $(this).attr('id').split('div')[1];
			var zone_id = $('#' + name + 'name' + number).attr('id');
			var lock_zone_class = $('#' + zone_id).find('.lock').attr('class');
			console.log(lock_zone_class);

			$("#lock_particular_zone").attr("onclick", "lock_selectedall_zone();");
			$("#unlock_particular_zone").attr("onclick", "unlock_selectedall_zone();");
			if (lock_zone_class == 'lock') {
				$(this).find('.resizable').find('div.ui-resizable-handle').addClass('select');
				apply_all_functionality_as_permission();
				$('#apply_imageto_selecteddiv').attr('disabled', false);
				$('#alignment_title').show();
				$('#roate_title').show();
				$('#background_title').show();
				$('#border_title').show();

				$(this).addClass('select_layer');
				$("#image_div_settings").show();				
				$('#text_div_settings').hide();
				$('#lock_particular_zone').removeClass("lock_main");
				$('#unlock_particular_zone').addClass("unlock_main");
				$(this).draggable('enable');
//				$(this).find('#rotatable').resizable('enable');
				$(this).find('#rotatable').resizable('destroy');
				$(this).find('#rotatable').resizable({
					aspectRatio: false,
					handles: 'ne, nw, se, sw'
				});

				$(this).find(".ui-rotatable-handle").css("display", "block");

				common_rotatable();
				$('#lock_particular_zone').removeClass("lock_main");
				$('#unlock_particular_zone').addClass("unlock_main");
			} else {
				$('.setting_div').block(block_option);
				$('#select_div_bring_to_front').attr('onclick', '').css('opacity', '0.3');
				$('#select_div_send_to_back').attr('onclick', '').css('opacity', '0.3');
				$('#lock_particular_zone').addClass("lock_main");
				$('#unlock_particular_zone').removeClass("unlock_main");
				//$(this).draggable('disable');
				$(this).find('#rotatable').resizable('disable');
				$(this).find('div.ui-resizable-handle').addClass('select');
			}

			$(".ui-rotatable-handle").css('background', '#EEEEEE');
			apply_coords(this);
			e.stopPropagation();

			$("#create_li_list li").each(function () {
				all_zone_id = $(this).attr('id');
				$('#' + all_zone_id).find('.mem_per').remove();
			});
		}
	}).live('dblclick', function (e) {
		if (!e.ctrlKey) {
			open_media_library(0);
			e.stopPropagation();
		}
	});
});

function updateCropCoords(c) {
	$('#x').val(c.x);
	$('#y').val(c.y);
	$('#w').val(c.w);
	$('#h').val(c.h);
}


function create_image_div(zoneid, z_index_value, zone_name, lock_zone_class, div_id, img_background, div_name, funct) {
	if (zoneid == undefined) {
		zoneid = 0;
	}
	create_image_div_procedure(zoneid, z_index_value, zone_name, lock_zone_class, div_id, img_background, div_name, funct);
	if (funct != 'init') {
		makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
	}
}
function create_image_div_procedure(zoneid, z_index_value, zone_name, lock_zone_class, div_id, img_background, div_name, funct) {
	var imagediv = document.createElement('div');
	imagediv.setAttribute('zoneid', zoneid);
	imagediv.setAttribute('zonetype', 'image');
	imagediv.className = "image_div active";
//	var new_div_id = "";
	if (div_id) {
		imagediv.id = "imagediv_" + div_id;
	} else {
		imagediv.id = "imagediv_" + img;
		var layer_left = ((template_width / 2) - 75);
		$(imagediv).css('left', layer_left + 'px');
	}
	var rotate_div = document.createElement('div');
	rotate_div.className = 'rotatable';
	rotate_div.id = 'rotatable';
	var resize_div = document.createElement('div');
	resize_div.className = 'resizable';
	resize_div.id = 'resizable';
	var inner_image_div = document.createElement('div');
	inner_image_div.className = "inner_div";
	$(inner_image_div).attr('imageid', 0);
	$(inner_image_div).attr('content', '');
	$(imagediv).css('z-index', z_index);
	browser_check();
	if (isOpera) {
		$(rotate_div).css('-o-transform', 'matrix(1,0,0,1,0,0)');
	} else if (isFirefox) {
		$(rotate_div).css('-moz-transform', 'matrix(1,0,0,1,0,0)');
	} else if (isChrome || isSafari) {
		$(rotate_div).css('-webkit-transform', 'matrix(1,0,0,1,0,0)');
	}
	common_disable_properties(imagediv);
	var border_style = '<div id="b_all_style"><input type="hidden" id="b_color" value=""/>';
	border_style += '<input type="hidden" id="b_style" value="">';
	border_style += '<input type="hidden" id="b_width" value="">';
	border_style += '<input type="hidden" id="permission" value="1">';
	border_style += '<input type="hidden" id="kenuburn_effect" value="0">';
	border_style += '<input type="hidden" id="pulse_effect" value="0">';
	border_style += '<input type="hidden" id="images_arr_str" value="">';
	border_style += '<input type="hidden" id="playlist_settings_json_str" value="">';
	border_style += '<input type="hidden" id="playlist_common_effect" value="0">';
	border_style += '<input type="hidden" id="playlist_common_duration" value="0">';
	border_style += '<input type="hidden" id="kenburn_duration" value="8">';
	border_style += '</div>';
	$(rotate_div).append(inner_image_div);
	$(resize_div).append(rotate_div);
	$(imagediv).append(resize_div);
	$(imagediv).append(border_style);

	$('.fixedwidth').append(imagediv);
	if (!div_id || funct == 'undo') {
		common_disable_properties(imagediv);
		apply_coords('#' + $(imagediv).attr('id'));
		common_rotatable();
		$(".select_layer").draggable({
			drag: function (e, ui) {
				set_position_select_layer(ui.position.left, ui.position.top);
				create_error_select_layer_outof_range(this, ui.position.left, ui.position.top, '', 'click');
			}
		});
		$("#image_div_settings").show();
		$('#text_div_settings').hide();
		var width = $(rotate_div).width();
		var height = $(rotate_div).height();
		var new_l = $(imagediv).position().left;
		var new_t = $(imagediv).position().top;
		var left1 = Math.round(new_l * (original_width / template_width));
		var top1 = Math.round(new_t * (original_width / template_width));
		$(".select_layer").find('#height').val(Math.round(height * (original_width / template_width))).find('#width').val(Math.round(width * (original_width / template_width))).find('#left').val(left1).find('#top').val(top1);
	}
	if (img_background != 'no' && img_background != 'non' && img_background != undefined) {
		common_resizable(true);
	} else {
		common_resizable();
	}
	if (old_id == null) {
		if (zone_name == undefined || zone_name == null) {
			var li_html = '<li class="level2" id="imagename_' + img + '" zoneid="' + img + '" zonetype="image">';
			li_html += '<div id="' + img + '" class="dv_my dv_actv">';
			li_html += '<div class="dots"></div>';
			li_html += '<div style="float:left; width:20px;" class="chek">';
			li_html += '<label class="label_check c_on" for="checkbox-0' + (parseInt(img) + 1) + '">';
			li_html += '<input name="sample-checkbox-0' + (parseInt(img) + 1) + '" id="checkbox-0' + (parseInt(img) + 1) + '" type="checkbox" value="1" />';
			li_html += '</label></div>';
			li_html += '<div class="photo"><img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;"></div>';
			li_html += '<div class="redapple">Image ' + img + '</div>';
			li_html += '<input type="hidden" id="zone_name" value="Image ' + img + '"/>';
			li_html += '<div class="lock" id="lock_' + img + '" onclick="lock_zone(this.id);"></div>';
			li_html += '<!--<div class="etings" id="member_view_' + img + '" ><img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;"></div>-->';
			li_html += '<div class="visible act" onclick="javascript:set_visible_and_unvisible_layer(this);" style="cursor: pointer;">';
			li_html += '<img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;">';
			li_html += '</div></div></li>';
			$('#create_li_list').prepend(li_html);
		} else {
			var li_html = '<li class="level2" id="imagename_' + div_id + '" zoneid="' + div_id + '" zonetype="image">';
			li_html += '<div id="' + div_id + '" class="dv_my">';
			li_html += '<div class="dots"></div>';
			li_html += '<div style="float:left; width:20px;" class="chek">';
			li_html += '<label class="label_check c_off" for="checkbox-0' + (parseInt(div_id) + 1) + '">';
			li_html += '<input name="sample-checkbox-0' + (parseInt(div_id) + 1) + '" id="checkbox-0' + (parseInt(div_id) + 1) + '" type="checkbox" value="1" />';
			li_html += '</label></div>';
			li_html += '<div class="photo"><img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;"></div>';
			li_html += '<div class="redapple">' + zone_name + '</div>';
			li_html += '<input type="hidden" id="zone_name" value="' + zone_name + '"/>';
			li_html += '<div class="' + lock_zone_class + '" id="lock_' + div_id + '" onclick="lock_zone(this.id);"></div>';
			li_html += '<!--<div class="etings" id="member_view_' + div_id + '" ><img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;"></div>-->';
			li_html += '<div class="visible act" onclick="javascript:set_visible_and_unvisible_layer(this);" >';
			li_html += '<img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;">';
			li_html += '</div></div></li>';
			$('#create_li_list').prepend(li_html);
		}
	} else {
		var number = old_id.split('name')[1];
		var myimg = number.replace('_', '');
		var li_html = '<li class="level2" id="imagename_' + myimg + '" zoneid="' + myimg + '" zonetype="image">';
		li_html += '<div id="' + myimg + '" class="dv_my">';
		li_html += '<div class="dots"></div>';
		li_html += '<div style="float:left; width:20px;" class="chek">';
		li_html += '<label class="label_check c_off" for="checkbox-0' + (parseInt(myimg) + 1) + '">';
		li_html += '<input name="sample-checkbox-0' + (parseInt(myimg) + 1) + '" id="checkbox-0' + (parseInt(myimg) + 1) + '" type="checkbox" value="1" />';
		li_html += '</label></div>';
		li_html += '<div class="photo"><img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;"></div>';
		li_html += '<div class="redapple">' + retrive_zone_name + '</div>';
		li_html += '<input type="hidden" id="zone_name" value="Image ' + (parseInt(myimg) + 1) + '"/>';
		li_html += '<div class="lock" id="lock_' + myimg + '" onclick="lock_zone(this.id);"></div>';
		li_html += '<!--<div class="etings" id="member_view_' + myimg + '" ><img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;"></div>-->';
		li_html += '<div class="visible act" onclick="javascript:set_visible_and_unvisible_layer(this);" >';
		li_html += '<img src="' + base_ctx + '/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;">';
		li_html += '</div></div></li>';
		$('#create_li_list').prepend(li_html);
	}
	onload();
	apply_all_functionality_as_permission();
	/* Rename name of layer */
	editable_zone_name();
	i++;
	img++;
	z_index++;
}
/*shadow color tab toggle*/

/*padding of image layer*/
function apply_padding_image() {
	var pading_text = parseInt($('#spinner_img').val());
	$('.select_layer').find('#rotatable').css('padding', pading_text + 'px');

	var h = $('#height_val').val();
	var w = $('#width_val').val();

	var width = w - pading_text * 2;
	var height = h - pading_text * 2;
	$('.select_layer').find('#rotatable').height(height);
	$('.select_layer').find('#rotatable').width(width);
	if ($("#fixedwidth").width() == original_width) {
		$('#div_width').val(Math.round(width));
		$('#div_height').val(Math.round(height));
	} else {
		$('#div_width').val(Math.round(width * (original_width / template_width)));
		$('#div_height').val(Math.round(height * (original_width / template_width)));
	}
}
