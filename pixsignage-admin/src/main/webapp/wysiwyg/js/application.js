var block_option = {
	message: '',
	baseZ: 1000,
	centerY: false,
	css: {
		top: '10%',
		border: '0',
		padding: '0',
		backgroundColor: 'none'
	},
	overlayCSS: {
		backgroundColor: '#FFFFFF',
		opacity: 0.3,
		cursor: 'default'
	}
};

var undo_click = false;
var image_div_array = new Array();
var allchecked_div_array = new Array();
var undo_array = new Array();
var history_array = new Array();
var history_counter = -1;
var image_div_array_clone = new Array();
var text_div_array_clone = new Array();
var allchecked_div_array_clone = new Array();
var allselected_div_array = new Array();
var alldiv_array = new Array();
var li_array = new Array();
var all_zone_id = null;
var bordercolor = null;
var color_shadow = null;
var color_div = null;
var isOpera = null;
var isFirefox = null;
var isSafari = null;
var isChrome = null;
var innertext = null;
var old_id = null;
var retrive_zone_name = null;
var lock_div_z_index = null;
var x = 0;
var y = 0;
var index_highest;
var redo = '';
var i = 1;
var j = 1;
var text_val;
var image_selected_div = {
	background_image_selected_div: "",
	height_selected_div: "",
	opacity_selected_div: "",
	padding_selected_div: "",
	backgroundcolor_selected_div: "",
	bordercolor_selected_div: "",
	borderstyle_selected_div: "",
	borderwidth_selected_div: "",
	width_selected_div: "",
	x_axis: "",
	y_axis: "",
	z_index: "",
	div_id: ""
};
var last_selected_div = {
	image: "",
	text: ""
};
var last_selected_div_clone = {
	image: "",
	text: ""
};
var last_created_div = {
	last_created_image_div: "",
	last_created_text_div: ""
};

var alldiv = {
	div_id: ""
};
var store_all_div = {
	all_div_list: "",
	zone_name: ""
};
var store_all_image_zones = {
	zone_id: "",
	zone_name: ""
};
var store_all_text_zones = {
	zone_id: "",
	zone_name: ""
};
var zone_data = new Array();

//check
function lockzone_proc(div_id) {
	$('#' + div_id).draggable('disable');
	$('#' + div_id).find("#rotatable").resizable('disable');
	$('#' + div_id).find(".ui-rotatable-handle").css("display", "none");
	$('#' + div_id).find('div.ui-resizable-handle').addClass('select');
	$('.setting_div').block(block_option);
}

//check
function unlockzone_proc(div_id) {
	$('#' + div_id).draggable('enable');
	$('#' + div_id).find("#rotatable").resizable('enable');
	$('#' + div_id).find(".ui-rotatable-handle").css("display", "block");
	$('#' + div_id).addClass('select_layer');
	$('.setting_div').unblock();
	if (div_id.match(/textdiv/g) == 'textdiv') {
		$('#' + div_id).find("#rotatable").attr("contenteditable", true);
		$("#image_div_settings").hide();
		$('#text_div_settings').show();
	} else {
		$("#image_div_settings").show();
		$('#text_div_settings').hide();
	}
}


//Check
function lock_zone(lock_zone_id) {
	console.log(lock_zone_id);
	var zone_id = $('#' + lock_zone_id).parent().attr('id');
	$('#' + zone_id).children('.chek').children().attr('class', 'label_check c_on');
	$('#' + lock_zone_id).parent().attr('class', 'dv_my dv_actv');
	$('#' + lock_zone_id).toggleClass('lock_hover');
	var div_id = $('#' + lock_zone_id).parent().parent().attr('id').replace('name_', 'div_');
	if ($('#' + lock_zone_id).hasClass('lock_hover')) {
		lockzone_proc(div_id);
	} else {
		unlockzone_proc(div_id);
	}
}

//Check
/*lock all seleted layer*/
function lock_selectedall_zone() {
	$('#lock_particular_zone').addClass('lock_main');
	$('#unlock_particular_zone').removeClass('unlock_main');
	$('#lock_selected_zone').addClass('lock_f');
	$('#unlock_selected_zone').removeClass('unlock_f');
	$('.dv_actv').each(function () {
		$(this).find('.lock').addClass('lock_hover');
		var zoneid = $(this).parent().attr('zoneid');
		var zonetype = $(this).parent().attr('zonetype');
		var div_id = zonetype + 'div_' + zoneid;
		lockzone_proc(div_id);
	});
}
/*unlock all seleted layer*/
function unlock_selectedall_zone() {
	$('#lock_particular_zone').removeClass("lock_main");
	$('#unlock_particular_zone').addClass("unlock_main");
	$('#lock_selected_zone').removeClass("lock_f");
	$('#unlock_selected_zone').addClass("unlock_f");
	$('.dv_actv').each(function () {
		$(this).find('.lock').removeClass('lock_hover');
		var zoneid = $(this).parent().attr('zoneid');
		var zonetype = $(this).parent().attr('zonetype');
		var div_id = zonetype + 'div_' + zoneid;
		unlockzone_proc(div_id);
	});
}

/*get largest z-index*/
function get_largest_zindex() {
	var zones = get_all_zones();
	var largest_zindex = 0;
	for (d = 0; d < zones.length; d++) {
		var zindex = parseInt(zones[d].img_z_index);
		if (zindex > largest_zindex) {
			largest_zindex = zindex;
		}
	}
	return largest_zindex;
}


/*set background color*/
function set_background_color(color) {
	$('#background_color a').wColorPicker('setColor', color);
}
function change_background_color(color) {
	$('#background_color').css('background-color', color.toUpperCase());
	$('#background_color').attr('color', color.toUpperCase());
	var value = color.toUpperCase().replace('#', '');
	var r = parseInt((value).substring(0, 2), 16);
	var g = parseInt((value).substring(2, 4), 16);
	var b = parseInt((value).substring(4, 6), 16);
	var a = $('#background_opacity').slider('option', 'value');
	$('.select_layer').find('#rotatable').css('background-color', 'rgba(' + r + ',' + g + ',' + b + ',' + a / 100 + ')');
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}

/*set border color*/
function set_border_color(color) {
	$('#border_color a').wColorPicker('setColor', color);
}
function change_border_color(color) {
	$('#border_color').css('background-color', color.toUpperCase());
	$('#border_color').attr('color', color.toUpperCase());
	$('.select_layer').find('#rotatable').css('border-color', color.toUpperCase());
	$('.select_layer').find('#b_color').val(color.toUpperCase());
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}

$(document).ready(function () {
	$('.fixedwidth').droppable({
		drop: function (event, ui) {
			makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
		}
	});

	$('#background_color a').wColorPicker({
		theme: 'classic',
		opacity: 0.8,
		mode: 'click',
		position: 'tl',
		generateButton: false,
		dropperButton: false,
		effect: 'slide',
		showSpeed: 200,
		hideSpeed: 200,
		onMouseover: null,
		onMouseout: null,
		onSelect: change_background_color,
		onDropper: null
	});

	$('#border_color a').wColorPicker({
		theme: 'classic',
		opacity: 0.8,
		mode: 'click',
		position: 'tl',
		generateButton: false,
		dropperButton: false,
		effect: 'slide',
		showSpeed: 200,
		hideSpeed: 200,
		onMouseover: null,
		onMouseout: null,
		onSelect: change_background_color,
		onDropper: null
	});

	set_image_shadow_color('#000000');
	set_text_shadow_color('#000000');
	
	$("#spinner_width").val(0);
	$("#set_ruler").val(0);

	/*spinner for width of layer in SIZE & POSITION of setting tab*/
	$('#div_width').spinner({
		min: 0,
		max: 1920,
		increment: 'fast'
	});
	/*spinner for height of layer in SIZE & POSITION of setting tab*/
	$('#div_height').spinner({
		min: 0,
		max: 1080,
		increment: 'fast'
	});
	/*spinner for left of layer in SIZE & POSITION of setting tab*/
	$('#div_x_axis').spinner({
		max: 20000,
		increment: 'fast'
	});
	/*spinner for top of layer in SIZE & POSITION of setting tab*/
	$('#div_y_axis').spinner({
		max: 20000,
		increment: 'fast'
	});
	/*spinner for angle of layer in ROTATE of setting tab*/
	$('#rotate_selected_div').spinner({
		min: -360,
		max: 360,
		increment: 'fast'
	});
	/*spinner for border of layer in BORDERS of setting tab*/
	$('#spinner_width').spinner({
		min: 0,
		max: 1000,
		increment: 'fast'
	});
	/*spinner for top-right-border-radius of layer in BORDERS of setting tab*/
	$('#border_top_right').spinner({
		min: 0,
		max: 1000,
		increment: 'fast'
	});
	/*spinner for top-left-border-radius of layer in BORDERS of setting tab*/
	$('#border_top_left').spinner({
		min: 0,
		max: 1000,
		increment: 'fast'
	});
	/*spinner for bottom-left-border-radius of layer in BORDERS of setting tab*/
	$('#border_bottom_left').spinner({
		min: 0,
		max: 1000,
		increment: 'fast'
	});
	/*spinner for bottom-right-border-radius of layer in BORDERS of setting tab*/
	$('#border_bottom_right').spinner({
		min: 0,
		max: 1000,
		increment: 'fast'
	});
	/*toggle upload image*/
	$('#image_select_title').click(function () {
		$('#image_select_div').toggle();
		$('#img_library').hide();
		$('#text_font_div').hide();
		$('#text_align_div').hide();
		$('#text_space_div').hide();
		$('#alignment_div').hide();
		$('#rotate_div').hide();
		$('#size_position_div').hide();
		$('#border_div').hide();
		$('#alignment_div').hide();
		$('#rotate_div').hide();
		$('#size_position_div').hide();
		$('#border_div').hide();
		$('#text_shadow_div').hide();
		$('#text_ticker_div').hide();
		$('#background_div').hide();
		$('#image_setting_div').hide();
		$('#image_shadow_div').hide();
		$('#div_image_effects').hide();
		$('#div_image_cropping').hide();
	});
	/*toggle image setting*/
	$('#image_setting_title').click(function () {
		$('#image_setting_div').toggle();
		$('#image_select_div').hide();
		$('#alignment_div').hide();
		$('#rotate_div').hide();
		$('#size_position_div').hide();
		$('#border_div').hide();
		$('#background_div').hide();
		$('#image_shadow_div').hide();
		$('#div_image_effects').hide();
		$('#div_image_filter_effects').hide();
		$('#div_image_cropping').hide();
	});
	/*toggle image shadow*/
	$('#image_shadow_title').click(function () {
		$('#image_shadow_div').toggle();
		$('#div_image_cropping').hide();
		$('#image_setting_div').hide();
		$('#img_library').hide();
		$('#image_select_div').hide();
		$('#alignment_div').hide();
		$('#rotate_div').hide();
		$('#size_position_div').hide();
		$('#border_div').hide();
		$('#background_div').hide();
		$('#div_image_effects').hide();
		$('#div_image_filter_effects').hide();
	});
	/*toggle text font*/
	$('#text_font_title').click(function () {
		$('#text_font_div').toggle();
		$('#text_align_div').hide();
		$('#text_space_div').hide();
		$('#alignment_div').hide();
		$('#rotate_div').hide();
		$('#size_position_div').hide();
		$('#border_div').hide();
		$('#image_select_div').hide();
		$('#background_div').hide();
		$('#img_library').hide();
		$('#text_shadow_div').hide();
		$('#text_ticker_div').hide();
		$('#image_setting_div').hide();
		$('#image_shadow_div').hide();
		$('#div_image_effects').hide();
		$('#div_image_cropping').hide();
	});
	/*toggle text shadow*/
	$('#text_shadow_title').click(function () {
		$('#text_shadow_div').toggle();
		$('#img_library').hide();
		$('#image_select_div').hide();
		$('#text_font_div').hide();
		$('#text_align_div').hide();
		$('#text_space_div').hide();
		$('#alignment_div').hide();
		$('#rotate_div').hide();
		$('#size_position_div').hide();
		$('#border_div').hide();
		$('#text_ticker_div').hide();
		$('#background_div').hide();
		$('#image_setting_div').hide();
		$('#image_shadow_div').hide();
		$('#div_image_effects').hide();
		$('#div_image_filter_effects').hide();
		$('#div_image_cropping').hide();
	});
	$('#text_align_title').click(function () {
		$('#text_align_div').toggle();
		$('#text_font_div').hide();
		$('#text_space_div').hide();
		$('#alignment_div').hide();
		$('#rotate_div').hide();
		$('#size_position_div').hide();
		$('#border_div').hide();
		$('#image_select_div').hide();
		$('#background_div').hide();
		$('#img_library').hide();
		$('#text_shadow_div').hide();
		$('#text_ticker_div').hide();
		$('#image_setting_div').hide();
		$('#image_shadow_div').hide();
		$('#div_image_effects').hide();
		$('#div_image_filter_effects').hide();
		$('#div_image_cropping').hide();
	});
	$('#text_space_title').click(function () {
		$('#text_space_div').toggle();
		$('#text_font_div').hide();
		$('#text_align_div').hide();
		$('#alignment_div').hide();
		$('#rotate_div').hide();
		$('#size_position_div').hide();
		$('#border_div').hide();
		$('#image_select_div').hide();
		$('#background_div').hide();
		$('#img_library').hide();
		$('#text_shadow_div').hide();
		$('#text_ticker_div').hide();
		$('#image_setting_div').hide();
		$('#image_shadow_div').hide();
		$('#div_image_effects').hide();
		$('#div_image_filter_effects').hide();
		$('#div_image_cropping').hide();
	});

	$('#alignment_title').click(function () {
		$('#alignment_div').toggle();
		$('#text_font_div').hide();
		$('#text_align_div').hide();
		$('#text_space_div').hide();
		$('#rotate_div').hide();
		$('#size_position_div').hide();
		$('#border_div').hide();
		$('#image_select_div').hide();
		$('#background_div').hide();
		$('#img_library').hide();
		$('#text_shadow_div').hide();
		$('#text_ticker_div').hide();
		$('#image_setting_div').hide();
		$('#image_shadow_div').hide();
		$('#div_image_effects').hide();
		$('#div_image_filter_effects').hide();
		$('#div_image_cropping').hide();
	});
	$('#rotate_title').click(function () {
		$('#rotate_div').toggle();
		$('#text_font_div').hide();
		$('#text_align_div').hide();
		$('#text_space_div').hide();
		$('#alignment_div').hide();
		$('#size_position_div').hide();
		$('#border_div').hide();
		$('#image_select_div').hide();
		$('#background_div').hide();
		$('#text_shadow_div').hide();
		$('#text_ticker_div').hide();
		$('#image_setting_div').hide();
		$('#image_shadow_div').hide();
		$('#div_image_effects').hide();
		$('#div_image_cropping').hide();
	});
	$('#size_position_title').click(function () {
		$('#size_position_div').toggle();
		$('#text_font_div').hide();
		$('#text_align_div').hide();
		$('#text_space_div').hide();
		$('#alignment_div').hide();
		$('#rotate_div').hide();
		$('#border_div').hide();
		$('#image_select_div').hide();
		$('#background_div').hide();
		$('#img_library').hide();
		$('#text_shadow_div').hide();
		$('#text_ticker_div').hide();
		$('#image_setting_div').hide();
		$('#image_shadow_div').hide();
		$('#div_image_effects').hide();
		$('#div_image_filter_effects').hide();
		$('#div_image_cropping').hide();
	});
	$('#background_title').click(function () {
		$('#background_div').toggle();
		$('#text_font_div').hide();
		$('#text_align_div').hide();
		$('#text_space_div').hide();
		$('#alignment_div').hide();
		$('#rotate_div').hide();
		$('#size_position_div').hide();
		$('#border_div').hide();
		$('#image_select_div').hide();
		$('#img_library').hide();
		$('#text_shadow_div').hide();
		$('#text_ticker_div').hide();
		$('#image_setting_div').hide();
		$('#image_shadow_div').hide();
		$('#div_image_effects').hide();
		$('#div_image_filter_effects').hide();
		$('#div_image_cropping').hide();
	});
	$('#border_title').click(function () {
		$('#border_div').toggle();
		$('#text_font_div').hide();
		$('#text_align_div').hide();
		$('#text_space_div').hide();
		$('#alignment_div').hide();
		$('#rotate_div').hide();
		$('#size_position_div').hide();
		$('#image_select_div').hide();
		$('#background_div').hide();
		$('#img_library').hide();
		$('#text_shadow_div').hide();
		$('#text_ticker_div').hide();
		$('#image_setting_div').hide();
		$('#image_shadow_div').hide();
		$('#div_image_effects').hide();
		$('#div_image_filter_effects').hide();
		$('#div_image_cropping').hide();
	});


	/*click on image library in setting tab open media library*/
	$('#image_library').click(function () {
		open_media_library(0);
	});

	$('.fixedwidth').click(function (e) {
		if (!e.ctrlKey) {
			remove_all_selected_layers();
		}
	});

	$(document).keydown(function (e) {
		var status = $('.select_layer').find('#rotatable').hasClass('dblclick');
		if ((e.which == 46) && (status === false) && ((e.target.tagName).toLowerCase() !== 'input')) {
			deleted_selected_all();
		}
	});
	
	init_media_library();
});

function remove_all_selected_layers() {
	blank_allonclick_forlockdiv();
//	$('#select_div_bring_to_front').attr('onclick', '').css('opacity', '0.3');
//	$('#select_div_send_to_back').attr('onclick', '').css('opacity', '0.3');
	$('#create_li_list li').each(function () {
		all_zone_id = $(this).attr('id');
		$('#' + all_zone_id).children().removeClass('dv_actv');
		$('#' + all_zone_id).children().children('.chek').children().removeClass();
		$('#' + all_zone_id).children().children('.chek').children().addClass('label_check c_off');
	});
	$('.round_border').val('');
	$('.select_layer_list').remove();
	$("#border_box").css('display', 'none');
	$("#text_back_coloepicker").css("display", "none");
	$('.ruler_top').remove();
	$('.ruler_left').remove();

	$(".image_div").find('div.ui-resizable-handle').removeClass('select');
	$(".text_div").find('div.ui-resizable-handle').removeClass('select');
	$('.image_div').draggable('disable');
	$('.text_div').draggable('disable');
	$('.image_div').find("#rotatable").resizable('disable');
	$('.text_div').find("#rotatable").resizable('disable');
	$(".image_div").removeClass('select_layer');
	$(".text_div").removeClass('select_layer');
	$('.image_div').find(".ui-rotatable-handle").css("display", "none");
	$('.text_div').find(".ui-rotatable-handle").css("display", "none");
	
	$('#div_width').val('');
	$('#div_height').val('');
	$('#div_x_axis').val('');
	$('#div_y_axis').val('');
	
	set_border_color('#ffffff');
	set_background_color('#999999');

	$('#background_opacity').slider('disable');
	$("#background_opacity_value").html(0 + '%');

	$("#border_type option").each(function () {
		$('.setting_border_type').find(".jqTransformSelectWrapper span").text('solid');
	});

	$("#spinner_width").val('');
	$('#text_font_size').val('');

	$('#text_font_family option').each(function () {
		$('.setting_font_family').find(".jqTransformSelectWrapper span").text('DroidSans');
	});
	$("#image_div_settings").hide();
	$('#text_div_settings').hide();
}

function element_ruler(obj, x_axis, y_axis, width, height, padding, set_variable) {
	if (obj && $("#set_ruler").val() == '1') {
		var top2 = parseInt(y_axis) + parseInt(height) + (parseInt(padding) * 2);
		var left2 = parseInt(x_axis) + parseInt(width) + (parseInt(padding) * 2);
		if (set_variable == 'onclick') {
			var id = $('.select_layer').attr('id').split('_')[1];
			$('.ruler_top').remove();
			$('.ruler_left').remove();

			$(obj).before('<div id="top1' + id + '" class="ruler_top" style="top:' + y_axis + 'px;"></div>');
			$(obj).before('<div id="top2' + id + '" class="ruler_top" style="top:' + top2 + 'px;"></div>');
			$(obj).before('<div id="left1' + id + '" class="ruler_left" style="left:' + x_axis + 'px;"></div>');
			$(obj).before('<div id="left2' + id + '" class="ruler_left" style="left:' + left2 + 'px;"></div>');
		} else if (set_variable == 'off') {
			id = obj.split('_')[1];
			$('#top1' + id).remove();
			$('#top2' + id).remove();
			$('#left1' + id).remove();
			$('#left2' + id).remove();
		} else if (set_variable == 'on') {
			id = obj.split('_')[1];
			$('#top1' + id).remove();
			$('#top2' + id).remove();
			$('#left1' + id).remove();
			$('#left2' + id).remove();
			$(obj).before('<div id="top1' + id + '" class="ruler_top" style="top:' + y_axis + 'px;"></div>');
			$(obj).before('<div id="top2' + id + '" class="ruler_top" style="top:' + top2 + 'px;"></div>');
			$(obj).before('<div id="left1' + id + '" class="ruler_left" style="left:' + x_axis + 'px;"></div>');
			$(obj).before('<div id="left2' + id + '" class="ruler_left" style="left:' + left2 + 'px;"></div>');
		}
		$('.ruler_top').css('width', original_width);
		$('.ruler_left').css('height', original_height);
	}
}
function apply_coords(obj) {
	var selected_layer = $(obj);
	var div_id = selected_layer.attr('id');
	var number = div_id.split('div')[1];
	var name = div_id.split('div')[0];
	$('.level2').find('.dv_my').removeClass('dv_actv');
	$('#' + name + 'name' + number).find('.dv_my').addClass('dv_actv');
	$('.label_check').removeClass('c_on').addClass('c_off');
	$('#' + name + 'name' + number).find('.label_check').removeClass('c_off').addClass('c_on');
//	selected_layer.removeClass('ui-state-disabled');
//	selected_layer.removeClass('ui-draggable-disabled');
//	selected_layer.prop('aria-disabled',false);
	var width = selected_layer.find('#rotatable').width();
	var height = selected_layer.find('#rotatable').height();
	var x_axis = selected_layer.position().left;
	var y_axis = selected_layer.position().top;
	var orignal_line_hight = selected_layer.find('#rotatable').css('line-height').replace('px', '');
	var border_color = selected_layer.find('#b_color').val();
	var border_width = selected_layer.find('#b_width').val();
	var border_style = selected_layer.find('#b_style').val();
	var text_font_family = selected_layer.find('#rotatable').css('font-family');
	var text_font_size = selected_layer.find('#rotatable').css('font-size').replace('px', '');
	var color = selected_layer.find('.rotatable').css('color');
	var div_background = selected_layer.find('#rotatable').css('background-color');
	var font_style = selected_layer.find('#rotatable').css('font-style');
	var font_weight = selected_layer.find('#rotatable').css('font-weight');
	var text_decoration = selected_layer.find("p").css('text-decoration');
	var text_align = selected_layer.find('#rotatable').css('text-align');
	var text_ul = selected_layer.find('ul li').length;
	var text_ol = selected_layer.find('ol li').length;
	var text_div_padding = selected_layer.find('.rotatable').css('padding-top').replace('px', '');
	var text_shadow = selected_layer.find('#rotatable').css('text-shadow');
	var box_shadow = selected_layer.find('#rotatable').css('box-shadow');
	var img_opacity = selected_layer.find('.inner_div').css('opacity');
	var border_radius_top_right = selected_layer.find('#rotatable').css('border-top-right-radius').replace('px', '');
	var border_radius_top_left = selected_layer.find('#rotatable').css('border-top-left-radius').replace('px', '');
	var border_radius_bottom_left = selected_layer.find('#rotatable').css('border-bottom-left-radius').replace('px', '');
	var border_radius_bottom_right = selected_layer.find('#rotatable').css('border-bottom-right-radius').replace('px', '');
	var text_ticker_style = selected_layer.find("#textticker_direction").val();
	var text_ticker_duration = selected_layer.find("#textticker_duration").val();
	var font_file = selected_layer.find('#font_file').val();
	if (font_file == "") {
		var font_file_val = $("#text_font_family option:selected").attr("data-font-file");
		selected_layer.find('#font_file').val(font_file_val);
	}

	if (img_opacity) {
		$('#image_opacity').slider('option', 'value', img_opacity * 100);
		$('#image_opacity_value').html(Math.round(img_opacity * 100) + '%');
	}

	element_ruler(obj, x_axis, y_axis, width, height, text_div_padding, 'onclick');
	set_position_select_layer(x_axis, y_axis);

	var img_kenburn_effect = selected_layer.find('#kenuburn_effect').val();

	/*if (img_kenburn_effect != undefined) {
	 set_image_effect_select_layer(img_kenburn_effect);
	 }*/

	// pulse animation effect
	var img_pulse_effect = selected_layer.find('#pulse_effect').val();

	//slideshow animation effect

	var img_slideshow_effect = selected_layer.find('#images_arr_str').val();
	/*if (img_pulse_effect != undefined) {
	 $('#image_effect_pulse').removeAttr('checked');
	 if (img_pulse_effect == "1") {
	 $('#image_effect_pulse').attr('checked', 'checked');
	 }
	 }*/
	// Animation effect
	if (img_pulse_effect == "0" || img_pulse_effect == '') {
		img_pulse_effect = "0";
	}

	/* if (img_pulse_effect != "0") {
	 $('#image_effect_pulse').removeAttr('checked');
	 if (img_pulse_effect == "1") {
	 $('#image_effect_pulse').attr('checked', 'checked');
	 }
	 }*/

	//if (img_pulse_effect != "0")	
	$('#img_effect_pulse option').each(function () {
		if ($(this).val() == img_pulse_effect) {
			$(this).attr('selected', 'selected');
			$('.img_effect_pulse').find(".jqTransformSelectWrapper span").text(img_pulse_effect);
		}
	});

	$('#img_effect_pulse option').each(function () {
		if ($(this).val() == 'slideshow' && img_slideshow_effect != '') {
			$(this).attr('selected', 'selected');
			$('.img_effect_pulse').find(".jqTransformSelectWrapper span").text('slideshow');
		}
	});

	if (img_pulse_effect == 'kenburn') {
		//kenburn_duration_val = selected_layer.find('#kenburn_duration').val();
		//$("#kduration_outer_div").css("display","block");				
		//$("#kenburn_duration_txt").val(kenburn_duration_val);		
	}

	/*}else{
	 selected_layer.find('#pulse_effect').val('0');
	 $('#img_effect_pulse option').val('0');
	 }*/

	if ($("#fixedwidth").width() == original_width) {
		$('.ruler_top').css("width", original_width + 'px');
		$('.ruler_left').css('height', original_height + 'px');
	} else {
		$('.ruler_top').css('width', template_width + 'px');
		$('.ruler_left').css('height', template_height + 'px');
	}

	browser_check();
	if (isOpera) {
		var scaley = selected_layer.find('#rotatable').css('-o-transform');
	} else if (isFirefox) {
		scaley = selected_layer.find('#rotatable').css('-moz-transform');
	} else if (isChrome || isSafari) {
		scaley = selected_layer.find('#rotatable').css('-webkit-transform');
	}

	var values = scaley.split('(')[1];

	values = values.split(')')[0];
	values = values.split(',');
	var a = values[0];
	var b = values[1];
	var c = values[2];
	var d = values[3];

	var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
	$("#rotate_selected_div").val(angle);

	if (text_shadow && text_shadow != 'none') {
		var shadow1 = text_shadow.split(')');
		var shadow_color = shadow1[0] + ')';
		var shadow2 = shadow1[1].split(' ');
		var shadow_x = (shadow2[1].replace("px", ""));
		var shadow_y = (shadow2[2].replace("px", ""));
		var shadow_blur = (shadow2[3].replace("px", ""));
		$("#text_shadow_x").val(Math.round(shadow_x));
		$("#text_shadow_y").val(Math.round(shadow_y));
		$("#text_shadow_blur").val(Math.round(shadow_blur));

		var hex_color = rgb2hex(shadow_color);
		set_text_shadow_color(hex_color);
	}
	if (box_shadow && box_shadow != 'none') {
		shadow1 = box_shadow.split(')');
		shadow_color = shadow1[0] + ')';
		shadow2 = shadow1[1].split(' ');
		shadow_x = (shadow2[1].replace("px", ""));
		shadow_y = (shadow2[2].replace("px", ""));
		shadow_blur = (shadow2[3].replace("px", ""));
		$("#image_shadow_x").val(Math.round(shadow_x));
		$("#image_shadow_y").val(Math.round(shadow_y));
		$("#image_shadow_blur").val(Math.round(shadow_blur));
		hex_color = rgb2hex(shadow_color);
		set_image_shadow_color(hex_color);
	}

	var w = parseInt(width) + parseInt(text_div_padding * 2);
	var h = parseInt(height) + parseInt(text_div_padding * 2);
	$('#width_val').val(w);
	$("#height_val").val(h);
	$('#line_space_text').val(Math.round(orignal_line_hight));
	if ($("#fixedwidth").width() == original_width) {
		$('#div_width').val(Math.round(width));
		$('#div_height').val(Math.round(height));
		$('#div_x_axis').val(Math.round(x_axis));
		$('#div_y_axis').val(Math.round(y_axis));
		$('#border_top_right').val(Math.round(border_radius_top_right * (original_width / template_width)));
		$('#border_top_left').val(Math.round(border_radius_top_left * (original_width / template_width)));
		$('#border_bottom_left').val(Math.round(border_radius_bottom_left * (original_width / template_width)));
		$('#border_bottom_right').val(Math.round(border_radius_bottom_right * (original_width / template_width)));
	} else {
		$('#div_width').val(Math.round(width * (original_width / template_width)));
		$('#div_height').val(Math.round(height * (original_width / template_width)));
		$('#div_x_axis').val(Math.round(x_axis * (original_width / template_width)));
		$('#div_y_axis').val(Math.round(y_axis * (original_width / template_width)));
		$('#border_top_right').val(Math.round(border_radius_top_right));
		$('#border_top_left').val(Math.round(border_radius_top_left));
		$('#border_bottom_left').val(Math.round(border_radius_bottom_left));
		$('#border_bottom_right').val(Math.round(border_radius_bottom_right));
	}
	if (border_width && border_width != undefined) {
		$("#spinner_width").val(Math.round(border_width));
	} else {
		$("#spinner_width").val('0');
	}

	$('#text_unorder').removeClass('highlight');
	$('#text_order').removeClass('highlight');

	$('#spinnerfast').val(Math.round(text_div_padding));
	$('#spinner_img').val(Math.round(text_div_padding));

	if (text_ul != 0) {
		$('#text_unorder').addClass('highlight');
	}
	if (text_ol != 0) {
		$('#text_order').addClass('highlight');
	}

	$('#text_align_left').removeClass('highlight');
	$('#text_align_right').removeClass('highlight');
	$('#text_align_center').removeClass('highlight');
	$('#text_align_justify').removeClass('highlight');
	if (text_align == 'left') {
		$('#text_align_left').addClass('highlight');
	}
	if (text_align == 'right') {
		$('#text_align_right').addClass('highlight');
	}
	if (text_align == 'center') {
		$('#text_align_center').addClass('highlight');
	}
	if (text_align == 'justify') {
		$('#text_align_justify').addClass('highlight');
	}

	$('#text_font_italic').removeClass('highlight');
	$('#text_font_bold').removeClass('highlight');
	$('#text_font_underline').removeClass('highlight');
	$('#text_font_strikethrough').removeClass('highlight');
	
	if (font_style == 'italic') {
		$('#text_font_italic').addClass('highlight');
	}
	if (font_weight == 'bold' || font_weight == '700') {
		$('#text_font_bold').addClass('highlight');
	}
	if (text_decoration == 'underline') {
		$('#text_font_underline').addClass('highlight');
	}
	 if (text_decoration == 'line-through') {
		$('#text_font_strikethrough').addClass('highlight');
	}
	if (text_font_family) {
		$('#text_font_family option').each(function () {
			text_font_family = text_font_family.replace(/'/g, "");
			if ($(this).val() == text_font_family) {
				$(this).attr('selected', 'selected');
				$('.setting_font_family').find(".jqTransformSelectWrapper span").text(text_font_family);
			}
		});
	}

	$('#text_font_size').val(Math.round(text_font_size));

	//	for border color
	if (border_color && border_color != '') {
		set_border_color(border_color);
	} else {
		set_border_color('#ffffff');
	}

	//	for background color
	if (div_background && div_background != 'transparent') {
		if (/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.test(div_background)) {
			div_background = div_background.split('(')[1];
			div_background = div_background.split(',');
			var r = div_background[0];
			var g = div_background[1];
			var b = div_background[2].replace(')', '');
			$('#background_opacity').slider('option', 'value', 100);
			$('#background_opacity_value').html(100 + '%');
			div_background = 'rgb(' + r + ',' + g + ',' + b + ')';
			var background_hex = rgb2hex(div_background);
		} else {
			div_background = div_background.split('(')[1];
			div_background = div_background.split(',');
			r = div_background[0];
			g = div_background[1];
			b = div_background[2];
			var a = div_background[3].replace(')', '');
			$('#background_opacity').slider('option', 'value', a * 100);
			$('#background_opacity_value').html(Math.round(a * 100) + '%');
			div_background = 'rgb(' + r + ',' + g + ',' + b + ')';
			background_hex = rgb2hex(div_background);
		}
		set_background_color(background_hex);
	}

	var hex = rgb2hex(color);
	set_text_font_color(hex);
	if (border_style) {
		$("#border_type option").each(function () {
			if ($(this).val() == border_style) {
				$(this).attr('selected', 'selected');
				$('.setting_border_type').find(".jqTransformSelectWrapper span").text(border_style);
			}
		});
	}
	$("#diraction").val(text_ticker_style);
	$("#duration").val(text_ticker_duration);
}
function rgb2hex(rgb) {
	rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	return (rgb && rgb.length === 4) ? '#' +
			("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
			("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
			("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

//把common setting disable, 锁定状态，禁止置顶和置底
function blank_allonclick_forlockdiv() {
	$('#select_div_top').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_bottom').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_left').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_right').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_horizontal_stretch').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_vertical_stretch').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_rotate_left').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_rotate_right').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_flip_vertical').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_flip_horizontal').attr('onclick', '').css('opacity', '0.3');
	$('#rotate_selected_div').spinner('disable').css('opacity', '0.3');
	$('#spinner_width').spinner('disable').css('opacity', '0.3');
	$('#border_top_left').spinner('disable').css('opacity', '0.3');
	$('#border_top_right').spinner('disable').css('opacity', '0.3');
	$('#border_bottom_left').spinner('disable').css('opacity', '0.3');
	$('#border_bottom_right').spinner('disable').css('opacity', '0.3');
	$('#border_type').prop('disabled', true);
	$('#div_width').spinner('disable').css('opacity', '0.3');
	$('#div_height').spinner('disable').css('opacity', '0.3');
	$('#div_x_axis').spinner('disable').css('opacity', '0.3');
	$('#div_y_axis').spinner('disable').css('opacity', '0.3');
	$('#line_space_text').spinner('disable').css('opacity', '0.3');
	$('#background_opacity').slider('disable');

	$('#lock_particular_zone').addClass("lock_main");
	$('#unlock_particular_zone').removeClass("unlock_main");
	$('#select_div_bring_to_front').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_send_to_back').attr('onclick', '').css('opacity', '0.3');
}

//把common setting disable
function disable_common_settings() {
	$('#select_div_top').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_bottom').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_left').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_right').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_horizontal_stretch').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_vertical_stretch').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_rotate_left').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_rotate_right').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_flip_vertical').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_flip_horizontal').attr('onclick', '').css('opacity', '0.3');
	$('#rotate_selected_div').spinner('disable').css('opacity', '0.3');
	$('#border_top_left').spinner('disable');
	$('#border_top_right').spinner('disable');
	$('#border_bottom_left').spinner('disable');
	$('#border_bottom_right').spinner('disable');
	$('#border_type').prop('disabled', true);
	$('#div_width').spinner('disable').css('opacity', '0.3');
	$('#div_height').spinner('disable').css('opacity', '0.3');
	$('#div_x_axis').spinner('disable').css('opacity', '0.3');
	$('#div_y_axis').spinner('disable').css('opacity', '0.3');
	$('#quickColor2_back').attr('onclick', '');
	$('#quickColor_border').attr('onclick', '');
	$("#spinner_width").spinner('disable');
	$('#background_opacity').slider('disable');
}

//把所有 setting enable，解锁状态，允许置顶和置底
function apply_all_functionality_as_permission() {
	console.log('apply_all_functionality_as_permission');
	$('.setting_div').unblock();
	
	$('#text_font_size').spinner('enable').css('opacity', '');
	$('#spinnerfast').spinner('enable').css('opacity', '');
	$('#text_font_family').attr('disabled', false).css('opacity', '');
	$('#text_unorder').attr('onclick', 'apply_unorder_list()').css('opacity', '');
	$('#text_order').attr('onclick', 'apply_order_list()').css('opacity', '');
	$('#text_align_left').attr('onclick', 'set_text_alignment("left")').css('opacity', '');
	$('#text_align_center').attr('onclick', 'set_text_alignment("center")').css('opacity', '');
	$('#text_align_right').attr('onclick', 'set_text_alignment("right")').css('opacity', '');
	$('#text_align_justify').attr('onclick', 'set_text_alignment("justify")').css('opacity', '');
	$('#text_font_bold').attr('onclick', 'set_text_bold()').css('opacity', '');
	$('#text_font_italic').attr('onclick', 'set_text_italic()').css('opacity', '');
	$('#text_font_underline').attr('onclick', 'set_text_underline()').css('opacity', '');
	$('#text_font_strikethrough').attr('onclick', 'set_text_strikethrough()').css('opacity', '');
	
	$('#alignment_title').show();
	$('#rotate_title').show();
	$('#background_title').show();
	$('#border_title').show();

	$('#border_type').attr('disabled', false);
	$('#select_div_top').attr('onclick', 'select_div_top()').css('opacity', '');
	$('#select_div_bottom').attr('onclick', 'select_div_bottom()').css('opacity', '');
	$('#select_div_left').attr('onclick', 'select_div_left()').css('opacity', '');
	$('#select_div_right').attr('onclick', 'select_div_right()').css('opacity', '');
	$('#select_div_horizontal_stretch').attr('onclick', 'select_div_horizontal_stretch()').css('opacity', '');
	$('#select_div_vertical_stretch').attr('onclick', 'select_div_vertical_stretch()').css('opacity', '');
	$('#select_div_rotate_left').attr('onclick', 'select_div_rotate_left()').css('opacity', '');
	$('#select_div_rotate_right').attr('onclick', 'select_div_rotate_right()').css('opacity', '');
	$('#select_div_flip_vertical').attr('onclick', 'select_div_flip_vertical()').css('opacity', '');
	$('#select_div_flip_horizontal').attr('onclick', 'select_div_flip_horizontal()').css('opacity', '');
	$('#rotate_selected_div').spinner('enable').css('opacity', '');
//	$("#quickColor2_back").attr('onclick', 'set_textdiv_background()').css('opacity', '');
//	$("#quickColor_border").attr('onclick', 'set_div_border_color()').css('opacity', '');
//	$('#spinner_width').spinner('enable');
//	$('#border_top_left').spinner('enable');
//	$('#border_top_right').spinner('enable');
//	$('#border_bottom_left').spinner('enable');
//	$('#border_bottom_right').spinner('enable');
//	$('#border_type').removeAttr('disabled');
	$('#div_width').spinner('enable').css('opacity', '');
	$('#div_height').spinner('enable').css('opacity', '');
	$('#div_x_axis').spinner('enable').css('opacity', '');
	$('#div_y_axis').spinner('enable').css('opacity', '');
	$('#line_space_text').spinner('enable').css('opacity', '');
	$('#spinner_width').spinner('enable').css('opacity', '');
	$('#border_top_right').spinner('enable').css('opacity', '');
	$('#border_top_left').spinner('enable').css('opacity', '');
	$('#border_bottom_left').spinner('enable').css('opacity', '');
	$('#border_bottom_right').spinner('enable').css('opacity', '');
	$('#background_opacity').slider('enable');

	$('#lock_particular_zone').removeClass('lock_main');
	$('#unlock_particular_zone').addClass('unlock_main');
	$('#select_div_bring_to_front').attr('onclick', 'select_div_bring_to_front()').css('opacity', '');
	$('#select_div_send_to_back').attr('onclick', 'select_div_send_to_back()').css('opacity', '');
}

//Begin alignment_div Settings
function select_div_top() {
	$('.select_layer').css('top', '').css('top', '0');
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
function select_div_bottom() {
	$('.select_layer').css('top', '').css('top', 'auto').css('bottom', '0');
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
function select_div_left() {
	$('.select_layer').css('right', '').css('right', 'auto').css('left', '0');
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
function select_div_right() {
	$('.select_layer').css('left', '').css('left', 'auto').css('right', '0');
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
function select_div_vertical_stretch() {
	var selected_layer = $('.select_layer');
	var padding = (selected_layer.find('#rotatable').css('padding-top').replace('px', '')) * 2;
	if (selected_layer.attr('class').indexOf("text_div") != -1) {
		selected_layer.find('#rotatable').css('height', '');
		selected_layer.css('top', '').css('top', '0');
		var original_height1 = $('.fixedwidth').height();

		if (original_height1 == original_height) {
			selected_layer.find('#rotatable').css('height', original_height + 'px');
		} else {
			var new_height = parseInt(template_height) + (padding);
			if (original_height1 < new_height) {
				selected_layer.find('#rotatable').css('height', template_height - padding + 'px');
				$("#height_val").val(template_height - padding);
			} else {
				selected_layer.find('#rotatable').css('height', template_height + 'px');
				$("#height_val").val(template_height);
			}

		}
	} else {
		var imageSrc = selected_layer.find('.inner_div').css('background-image')
				.replace(/"/g, '')
				.replace(/url\(|\)$/ig, '');

		var image = new Image();
		image.src = imageSrc;

		var w = image.width,
				h = image.height;

		var new_w = selected_layer.find('#rotatable').css('width').replace('px', '');
		original_height1 = $('.fixedwidth').height();
		if (original_height1 == original_height) {
			var new_h = original_height;
			new_w = original_width;
		} else {
			new_h = template_height;
			new_w = template_width;
		}

		if (w > h) {
			new_h = (h / w) * new_w;
			selected_layer.css('left', '').css('left', '0px');
		} else {
			new_w = (w / h) * new_h;
			selected_layer.css('top', '').css('top', '0px');
		}
		selected_layer.find('#rotatable').css('height', '');

		var new_width = parseInt(new_w) + (padding);
		var original_width = $('.fixedwidth').width();
		new_height = parseInt(new_h) + (padding);

		if (original_width < new_width || original_height1 < new_height) {
			selected_layer.find('#rotatable').css('width', new_w - padding + 'px');
			selected_layer.find('#rotatable').css('height', new_h - padding + 'px');
			$('#height_val').val(new_h - padding);
			$('#width_val').val(new_w - padding);
		} else {
			selected_layer.find('#rotatable').css('height', new_h + 'px');
			selected_layer.find('#rotatable').css('width', new_w + 'px');
			$('#height_val').val(new_h);
			$('#width_val').val(new_w);
		}
	}
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
function select_div_horizontal_stretch() {
	var selected_layer = $('.select_layer');
	var padding = (selected_layer.find('#rotatable').css('padding-top').replace('px', '')) * 2;
	if (selected_layer.attr('class').indexOf("text_div") != -1 || $('.select_layer').find('.inner_div').css('background-image') == 'none' || $('.select_layer').find('.inner_div').css('background-image') == 'no') {
		selected_layer.css('left', '').css('left', '0');
		selected_layer.find('#rotatable').css('width', '');
		var original_width1 = $('.fixedwidth').width();
		if (original_width1 == original_width) {
			selected_layer.find('#rotatable').css('width', original_width + 'px');
		} else {
			var new_width = parseInt(template_width) + (padding);
			if (original_width1 < new_width) {
				selected_layer.find('#rotatable').css('width', template_width - padding + 'px');
				$('#width_val').val(template_width - padding);
			} else {
				selected_layer.find('#rotatable').css('width', template_width + 'px');
				$('#width_val').val(template_width);
			}
		}
	} else {
		var imageSrc = selected_layer.find('.inner_div').css('background-image')
				.replace(/"/g, '')
				.replace(/url\(|\)$/ig, '');
		var image = new Image();
		image.src = imageSrc;
		var w = image.width,
				h = image.height;
		original_width1 = $('.fixedwidth').width();
		var new_h = selected_layer.find('#rotatable').css('height').replace('px', '');
		if (original_width1 == original_width) {
			var new_w = original_width;
			new_h = original_height;
		} else {
			new_w = template_width;
			new_h = template_height;
		}
		if (w > h) {
			new_h = (h / w) * new_w;
			selected_layer.css('left', '');
			selected_layer.css('left', '0px');
		} else {
			new_w = (w / h) * new_h;
			selected_layer.css('top', '');
			selected_layer.css('top', '0px');
		}
		selected_layer.find('#rotatable').css('height', '');


		new_width = parseInt(new_w) + (padding);
		var original_height = $('.fixedwidth').height();
		var new_height = parseInt(new_h) + (padding);

		if (original_width1 < new_width || original_height < new_height) {
			selected_layer.find('#rotatable').css('width', new_w - padding + 'px');
			selected_layer.find('#rotatable').css('height', new_h - padding + 'px');
			$('#height_val').val(new_h - padding);
			$('#width_val').val(new_w - padding);
		} else {
			selected_layer.find('#rotatable').css('height', new_h + 'px');
			$('#height_val').val(new_h);
			selected_layer.find('#rotatable').css('width', new_w + 'px');
			$('#width_val').val(new_w);
		}
	}
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
//End alignment_div Settings

//Begin rotate_div Settings
function select_div_rotate_left() {
	browser_check();
	var $img = $('.select_layer').find('.rotatable');
	if (isOpera) {
		var scaley = $img.css('-o-transform');
	} else if (isFirefox) {
		scaley = $img.css('-moz-transform');
	} else if (isChrome || isSafari) {
		scaley = $img.css('-webkit-transform');
	}

	var values = scaley.split('(')[1];

	values = values.split(')')[0];
	values = values.split(',');
	var a = values[0];
	var b = values[1];
	var c = values[2];
	var d = values[3];

	var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

	var new_angle = (parseInt(angle)) - 90 + 'deg';
	if (isOpera) {
		$img.css('-o-transform', 'rotate(' + new_angle + ')');
	} else if (isFirefox) {
		$img.css('-moz-transform', 'rotate(' + new_angle + ')');
	} else if (isChrome || isSafari) {
		$img.css('-webkit-transform', 'rotate(' + new_angle + ')');
	}

	$("#rotate_selected_div").val(angle - 90);
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
function select_div_rotate_right() {
	var $img = $('.select_layer').find('.rotatable');

	if (isOpera) {
		var scaley = $img.css('-o-transform');
	} else if (isFirefox) {
		scaley = $img.css('-moz-transform');
	} else if (isChrome || isSafari) {
		scaley = $img.css('-webkit-transform');
	}

	var values = scaley.split('(')[1];

	values = values.split(')')[0];
	values = values.split(',');
	var a = values[0];
	var b = values[1];

	var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

	var new_angle = (parseInt(angle)) + 90 + 'deg';
	if (isOpera) {
		$img.css('-o-transform', 'rotate(' + new_angle + ')');
	} else if (isFirefox) {
		$img.css('-moz-transform', 'rotate(' + new_angle + ')');
	} else if (isChrome || isSafari) {
		$img.css('-webkit-transform', 'rotate(' + new_angle + ')');
	}

	$("#rotate_selected_div").val(angle + 90);
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
function select_div_flip_vertical() {
	var $img = $('.select_layer').find('.rotatable');
	browser_check();
	if (isOpera) {
		var scaley = $img.css('-o-transform');
	} else if (isFirefox) {
		scaley = $img.css('-moz-transform');
	} else if (isChrome || isSafari) {
		scaley = $img.css('-webkit-transform');
	}

	var mat = scaley.split("(")[1];

	var m3 = mat.split(",")[2];
	var m4 = mat.split(",")[3];
	var m11 = mat.split(",")[0];
	var m22 = mat.split(",")[1];
	var m33 = -(m3);
	var m44 = -(m4);
	var m55 = mat.split(",")[4];
	var m66 = mat.split(",")[5].replace(")", "");
	if (isOpera) {
		$img.css('-o-transform', 'matrix(' + m11 + ',' + m22 + ',' + m33 + ',' + m44 + ',' + m55 + ',' + m66 + ')');
		var tr = $img.css('-o-transform').replace("matrix(", "").replace(")", "");
	} else if (isFirefox) {
		$img.css('-moz-transform', 'matrix(' + m11 + ',' + m22 + ',' + m33 + ',' + m44 + ',' + m55 + ',' + m66 + ')');
		tr = $img.css('-moz-transform').replace("matrix(", "").replace(")", "");
	} else if (isChrome || isSafari) {
		$img.css('-webkit-transform', 'matrix(' + m11 + ',' + m22 + ',' + m33 + ',' + m44 + ',' + m55 + ',' + m66 + ')');
		tr = $img.css('-webkit-transform').replace("matrix(", "").replace(")", "");
	}

	$img.rotatable({
		mtx: [tr]
	});
	var angle = Math.round(Math.atan2(m22, m11) * (180 / Math.PI));
	$("#rotate_selected_div").val(angle);
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
function select_div_flip_horizontal() {
	var $img = $('.select_layer').find('.rotatable');
	browser_check();
	if (isOpera) {
		var scaley = $img.css('-o-transform');
	} else if (isFirefox) {
		scaley = $img.css('-moz-transform');
	} else if (isChrome || isSafari) {
		scaley = $img.css('-webkit-transform');
	}

	var mat = scaley.split("(")[1];
	var m1 = mat.split(",")[0];
	var m2 = mat.split(",")[1];

	var m11 = -(m1);
	var m22 = -(m2);
	var m33 = mat.split(",")[2];
	var m44 = mat.split(",")[3];
	var m55 = mat.split(",")[4];
	var m66 = mat.split(",")[5].replace(")", "");
	if (isOpera) {
		$img.css('-o-transform', 'matrix(' + m11 + ',' + m22 + ',' + m33 + ',' + m44 + ',' + m55 + ',' + m66 + ')');
		var tr = $img.css('-o-transform').replace("matrix(", "").replace(")", "");
	} else if (isOpera || isFirefox) {
		$img.css('-moz-transform', 'matrix(' + m11 + ',' + m22 + ',' + m33 + ',' + m44 + ',' + m55 + ',' + m66 + ')');
		tr = $img.css('-moz-transform').replace("matrix(", "").replace(")", "");
	} else if (isChrome || isSafari) {
		$img.css('-webkit-transform', 'matrix(' + m11 + ',' + m22 + ',' + m33 + ',' + m44 + ',' + m55 + ',' + m66 + ')');
		tr = $img.css('-webkit-transform').replace("matrix(", "").replace(")", "");
	}
	$img.rotatable({
		mtx: [tr]
	});
	var angle = Math.round(Math.atan2(m22, m11) * (180 / Math.PI));
	$("#rotate_selected_div").val(angle);
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
function select_div_reset() {
	browser_check();
	var $img = $('.select_layer').find('.rotatable');
	if (isOpera) {
		$img.css('-o-transform', 'matrix(1,0,0,1,0,0)');
	} else if (isOpera || isFirefox) {
		$img.css('-moz-transform', 'matrix(1,0,0,1,0,0)');
	} else if (isChrome || isSafari) {
		$img.css('-webkit-transform', 'matrix(1,0,0,1,0,0)');
	}
	$("#rotate_selected_div").val(0);
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
function rotate_selected_div() {
	var $img = $('.select_layer').find("#rotatable");
	browser_check();
	var rotate_degree = parseInt($('#rotate_selected_div').val());
	if (rotate_degree >= 360) {
		var degree = rotate_degree % 360;
		$('#rotate_selected_div').val(degree);
	} else if (rotate_degree >= -360) {
		degree = rotate_degree % -360;
		$('#rotate_selected_div').val(degree);
	} else if (isNaN(rotate_degree)) {
		degree = '0';
		$('#rotate_selected_div').val(degree);
	} else {
		degree = rotate_degree;
	}
	if (isOpera) {
		$img.css("-o-transform", "rotate(" + degree + "deg)");
	} else if (isFirefox) {
		$img.css("-moz-transform", "rotate(" + degree + "deg)");
	} else if (isChrome || isSafari) {
		$img.css("-webkit-transform", "rotate(" + degree + "deg)");
	}
}
//End rotate_div Settings

//Begin size_position_div Settings
function apply_div_width() {
	var selected_layer = $('.select_layer');
	var id = selected_layer.attr('id');
	var image = id.match(/imagediv/g);
	var text = id.match(/textdiv/g);
	if (text == 'textdiv' || selected_layer.find('.inner_div').css('background-image') == 'none') {
		var inserted_width = $('#div_width').val().replace('px', '');
		if ($("#fixedwidth").width() == original_width) {
			var new_w = inserted_width;
		} else {
			new_w = (inserted_width) / (original_width / template_width);
		}
		selected_layer.find('#rotatable').width(Math.round(new_w));
		selected_layer.find('#width').val(Math.round(inserted_width));
	} else {

		var imageSrc = selected_layer.find('.inner_div').css('background-image')
				.replace(/"/g, '')
				.replace(/url\(|\)$/ig, '');

		var image = new Image();
		image.src = imageSrc;

		var w = image.width,
				h = image.height;
		inserted_width = $('#div_width').val().replace('px', '');
		if ($("#fixedwidth").width() == original_width) {
			new_w = inserted_width;
			var new_h = $('#div_height').val().replace('px', '');
		} else {
			new_w = (inserted_width) / (original_width / template_width);
			new_h = ($('#div_height').val().replace('px', '')) / (original_width / template_width);
		}
		selected_layer.find('#width').val(Math.round(inserted_width));
		new_h = (h / w) * new_w;

		selected_layer.find('#rotatable').width(Math.round(new_w));
		selected_layer.find('#rotatable').height(Math.round(new_h));
		if ($("#fixedwidth").width() == original_width) {
			$('#div_height').val(Math.round(new_h));
			selected_layer.find('#height').val(Math.round(new_h));
		} else {
			$('#div_height').val(Math.round(new_h * (original_width / template_width)));
			selected_layer.find('#height').val(Math.round(new_h * (original_width / template_width)));
		}

	}
	var width = $('#' + id).find('#rotatable').width();
	var height = $('#' + id).find('#rotatable').height();
	var x_axis = $('#' + id).position().left;
	var y_axis = $('#' + id).position().top;
	var text_div_padding = $('#' + id).find('.rotatable').css('padding-top').replace('px', '');
	element_ruler('#' + id, x_axis, y_axis, width, height, text_div_padding, 'onclick');
	var w = parseInt(width) + parseInt(text_div_padding * 2);
	var h = parseInt(height) + parseInt(text_div_padding * 2);
	$('#width_val').val(w);
	$("#height_val").val(h);
}
function apply_div_height() {
	var selected_layer = $('.select_layer');
	var id = selected_layer.attr('id');
	var image_zone = id.match(/imagediv/g);
	var text = id.match(/textdiv/g);
	if (text == 'textdiv' || selected_layer.find('.inner_div').css('background-image') == 'none') {
		var inserted_height = $('#div_height').val().replace('px', '');
		if ($("#fixedwidth").width() == original_width) {
			var new_h = inserted_height;
		} else {
			new_h = (inserted_height) / (original_width / template_width);
		}

		selected_layer.find('#rotatable').height(Math.round(new_h));
		selected_layer.find('#height').val(inserted_height);
	} else {
		var imageSrc = selected_layer.find('.inner_div').css('background-image')
				.replace(/"/g, '')
				.replace(/url\(|\)$/ig, '');

		var image = new Image();
		image.src = imageSrc;

		var w = image.width,
				h = image.height;
		var inserted_height = $('#div_height').val().replace('px', '');
		if ($("#fixedwidth").width() == original_width) {
			new_h = inserted_height;
		} else {
			new_h = inserted_height / (original_width / template_width);
		}
		selected_layer.find('#height').val(inserted_height);
		var new_w = $('.select_layer').find('#rotatable').css('width').replace('px', '');

		new_w = (w / h) * new_h;

		selected_layer.find('#rotatable').width(Math.round(new_w));
		selected_layer.find('#rotatable').height(Math.round(new_h));
		if ($("#fixedwidth").width() == original_width) {
			$('#div_width').val(Math.round(new_w));
			selected_layer.find('#height').val(Math.round(new_w));
		} else {
			$('#div_width').val(Math.round(new_w * (original_width / template_width)));
			selected_layer.find('#height').val(Math.round(new_w * (original_width / template_width)));
		}

	}
	var width = $('#' + id).find('#rotatable').width();
	var height = $('#' + id).find('#rotatable').height();
	var x_axis = $('#' + id).position().left;
	var y_axis = $('#' + id).position().top;
	var text_div_padding = $('#' + id).find('.rotatable').css('padding-top').replace('px', '');
	element_ruler('#' + id, x_axis, y_axis, width, height, text_div_padding, 'onclick');
	var w = parseInt(width) + parseInt(text_div_padding * 2);
	var h = parseInt(height) + parseInt(text_div_padding * 2);
	$('#width_val').val(w);
	$("#height_val").val(h);
}
function apply_div_x_axis() {
	var id = $('.select_layer').attr('id');
	var inserted_x_axis = $('#div_x_axis').val();
	if ($("#fixedwidth").width() == original_width) {
		var x_axis = inserted_x_axis;
	} else {
		x_axis = (inserted_x_axis) / (original_width / template_width);
	}
	$('.select_layer').css('left', Math.round(x_axis));
	if ($('#' + id).hasClass('image_div') || $('#' + id).hasClass('text_div')) {
		var width = $('#' + id).find('#rotatable').width();
		var height = $('#' + id).find('#rotatable').height();
		var text_div_padding = $('#' + id).find('.rotatable').css('padding-top').replace('px', '');
	} else {
		width = $('#' + id).width();
		height = $('#' + id).height();
		text_div_padding = 0;
	}
	var x_axis = $('#' + id).position().left;
	var y_axis = $('#' + id).position().top;
	$('.select_layer').find('#left').val(Math.round(inserted_x_axis));
	element_ruler('#' + id, x_axis, y_axis, width, height, text_div_padding, 'onclick');
}
function apply_div_y_axis() {
	var id = $('.select_layer').attr('id');
	var inserted_y_axis = $('#div_y_axis').val();
	if ($("#fixedwidth").width() == original_width) {
		var y_axis = inserted_y_axis;
	} else {
		y_axis = (inserted_y_axis) / (original_width / template_width);
	}
	$('.select_layer').css('top', Math.round(y_axis));
	var x_axis = $('#' + id).position().left;
	var y_axis = $('#' + id).position().top;
	if ($('#' + id).hasClass('image_div') || $('#' + id).hasClass('text_div')) {
		var width = $('#' + id).find('#rotatable').width();
		var height = $('#' + id).find('#rotatable').height();
		var text_div_padding = $('#' + id).find('.rotatable').css('padding-top').replace('px', '');
	} else {
		width = $('#' + id).width();
		height = $('#' + id).height();
		text_div_padding = 0;
	}
	$('.select_layer').find('#top').val(Math.round(inserted_y_axis));
	element_ruler('#' + id, x_axis, y_axis, width, height, text_div_padding, 'onclick');
}
//End size_position_div Settings

//Being border_div Settings
function set_border_style() {
	var selected_layer = $('.select_layer');
	var style = $("#border_type").val();
	var id = selected_layer.attr('id');
	if (selected_layer.hasClass('chart_div')) {
		var myDiv = document.getElementById(id);
		var myCanvas = myDiv.getElementsByTagName('canvas')[0];
		var $img = selected_layer.find(myCanvas);
	} else {
		$img = selected_layer.find('#rotatable');
	}
	$img.css('border-style', style);
	selected_layer.find('#b_style').val('');
	selected_layer.find('#b_style').val(style);
}
function set_border_width() {
	var selected_layer = $('.select_layer');
	var border_width = $("#spinner_width").val();
	var id = selected_layer.attr('id');

	$img = selected_layer.find('#rotatable');
	$img.css('border-width', border_width + 'px');
	selected_layer.find('#b_width').val('');
	selected_layer.find('#b_width').val(border_width);
}
function set_round_border_top_right() {
	var selected_layer = $('.select_layer');
	var top_right = $('#border_top_right').val();
	selected_layer.find('.rotatable').css('border-top-right-radius', top_right + 'px');
	selected_layer.find('.inner_div').css('border-top-right-radius', top_right + 'px');
}
function set_round_border_top_left() {
	var selected_layer = $('.select_layer');
	var top_left = $('#border_top_left').val();
	selected_layer.find('.rotatable').css('border-top-left-radius', top_left + 'px');
	selected_layer.find('.inner_div').css('border-top-left-radius', top_left + 'px');
}
function set_round_border_bottom_left() {
	var selected_layer = $('.select_layer');
	var bottom_left = $('#border_bottom_left').val();
	selected_layer.find('.rotatable').css('border-bottom-left-radius', bottom_left + 'px');
	selected_layer.find('.inner_div').css('border-bottom-left-radius', bottom_left + 'px');
}
function set_round_border_bottom_right() {
	var selected_layer = $('.select_layer');
	var bottom_right = $('#border_bottom_right').val();
	selected_layer.find('.rotatable').css('border-bottom-right-radius', bottom_right + 'px');
	selected_layer.find('.inner_div').css('border-bottom-right-radius', bottom_right + 'px');
}
//End border_div Settings


function select_div_bring_to_front() {
	var throberdiv = '<div id = "throberdiv">&nbsp;</div>';
	$(throberdiv).prependTo("body");
	setTimeout(function () {
		var select_div_zindex = parseInt($('.select_layer').css("z-index"));
		var large_z1 = get_largest_zindex();
		var p2 = large_z1;
		var images2 = get_all_zones();
		while (p2 >= 0) {
			for (m = 0; m < images2.length; m++) {
				if (p2 == images2[m].img_z_index) {
					if (select_div_zindex < images2[m].img_z_index) {
						var new_zindex = images2[m].img_z_index;
						var new_div_id = images2[m].div_id;
					}
				}
			}
			p2--;
		}
		$('.select_layer').css("z-index", new_zindex);
		$('#' + new_div_id).css("z-index", select_div_zindex);
		sortable_layre_list();
		$('#throberdiv').remove();
	}, 1000);
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
function select_div_send_to_back() {
	var throberdiv = '<div id = "throberdiv">&nbsp;</div>';
	$(throberdiv).prependTo("body");
	setTimeout(function () {
		var select_div_zindex = parseInt($('.select_layer').css("z-index"));

		var p2 = 0;
		var large_z1 = get_largest_zindex();
		var images2 = get_all_zones();
		while (p2 <= large_z1) {
			for (m = 0; m < images2.length; m++) {
				if (p2 == images2[m].img_z_index) {
					if (select_div_zindex > images2[m].img_z_index) {
						var new_zindex = images2[m].img_z_index;
						var new_div_id = images2[m].div_id;
					}
				}
			}
			p2++;
		}
		$('.select_layer').css("z-index", new_zindex);
		$('#' + new_div_id).css("z-index", select_div_zindex);
		sortable_layre_list();
		$('#throberdiv').remove();
	}, 1000);
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}


function browser_check() {
	isOpera = !!(window.opera && window.opera.version);  // Opera 8.0+
	isFirefox = testCSS('MozBoxSizing');				 // FF 0.8+
	isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
	isChrome = !isSafari && testCSS('WebkitTransform');  // Chrome 1+
	function testCSS(prop) {
		return prop in document.documentElement.style;
	}
}

function get_all_zones() {
	var zone_array = new Array();
	browser_check();
	$('.image_div').each(function (e) {
		var $this = $(this);
		if (isOpera) {
			var transform = $this.find('#rotatable').css('-o-transform');
			$this.find('#rotatable').css('-o-transform', 'matrix(1,0,0,1,0,0)');
		} else if (isFirefox) {
			transform = $this.find('#rotatable').css('-moz-transform');
			$this.find('#rotatable').css('-moz-transform', 'matrix(1,0,0,1,0,0)');
		} else if (isChrome || isSafari) {
			transform = $this.find('#rotatable').css('-webkit-transform');
			$this.find('#rotatable').css('-webkit-transform', 'matrix(1,0,0,1,0,0)');
		}

		if ($this.hasClass('active')) {
			var act = 'active';
		} else {
			act = 'deactive';
		}
		var name = $this.attr('id').split('div')[0];
		var number = $this.attr('id').split('div')[1];
		var zone_id = $('#' + name + 'name' + number).attr('id');
		var lock_zone_class = $('#' + zone_id).find('.lock').attr('class');
		var zone_name = $('#' + zone_id).find('.redapple').html();
		var image_data = {
			pagezoneid: $this.attr('zoneid'),
			type: '1',
			status: act == 'active' ? '1' : '0',
			height: $this.find('#rotatable').height(),
			width: $this.find('#rotatable').width(),
			topoffset: $this.position().top,
			leftoffset: $this.position().left,
			zindex: $this.css('z-index'),
			transform: transform,
			bdcolor: $this.find('#b_color').val(),
			bdstyle: $this.find('#b_style').val(),
			bdwidth: $this.find('#b_width').val(),
			bdtl: $this.find('#rotatable').css('border-top-left-radius'),
			bdtr: $this.find('#rotatable').css('border-top-right-radius'),
			bdbl: $this.find('#rotatable').css('border-bottom-left-radius'),
			bdbr: $this.find('#rotatable').css('border-bottom-right-radius'),
			bgcolor: $this.find('#rotatable').css('background-color'),
			opacity: $this.find('.inner_div').css('opacity'),
			padding: $this.find('#rotatable').css('padding-top'),
			shadow: $this.find('#rotatable').css('box-shadow'),
			content: $this.find('.inner_div').attr('content'),
			imageid: $this.find('.inner_div').attr('imageid'),
			videoid: '',

			layer_mode: act,
			img_name: 'image',
			img_top: $this.position().top,
			img_left: $this.position().left,
			img_height: $this.find('#rotatable').height(),
			img_width: $this.find('#rotatable').width(),
			img_background_image: $this.find('.inner_div').attr('content'),
			img_transform: transform,
			img_border_color: $this.find('#b_color').val(),
			img_border_style: $this.find('#b_style').val(),
			img_border_width: $this.find('#b_width').val(),
			img_background_color: $this.find('#rotatable').css('background-color'), 
			img_z_index: $this.css('z-index'), 
			img_padding: $this.find('#rotatable').css('padding-top'), 
			img_opacity: $this.find('.inner_div').css('opacity'),
			img_shadow: $this.find('#rotatable').css('box-shadow'),
			zone_name: zone_name,
			lock_zone_class: lock_zone_class,
			div_id: $this.attr('id'),
			border_top_right: $this.find('#rotatable').css('border-top-right-radius'),
			border_top_left: $this.find('#rotatable').css('border-top-left-radius'),
			border_bottom_left: $this.find('#rotatable').css('border-bottom-left-radius'),
			border_bottom_right: $this.find('#rotatable').css('border-bottom-right-radius'),
			img_kenburn_effect: $this.find('#kenuburn_effect').val(),
			//img_kenburn_duration: $this.find('#kenburn_duration').val(),
			img_pulse_effect: $this.find('#pulse_effect').val(),
			multiple_images_str: $this.find("#images_arr_str").val(),
			playlist_settings_json_str: $this.find("#playlist_settings_json_str").val(),
			playlist_common_effect: $this.find("#playlist_common_effect").val(),
			playlist_common_duration: $this.find("#playlist_common_duration").val()
		};
		zone_array.push(image_data);

		if (isOpera) {
			$this.find('#rotatable').css('-o-transform', transform);
		} else if (isFirefox) {
			$this.find('#rotatable').css('-moz-transform', transform);
		} else if (isChrome || isSafari) {
			$this.find('#rotatable').css('-webkit-transform', transform);
		}
	});

	$('.text_div').each(function (e) {
		var $this = $(this);
		var name = $this.attr('id').split('div')[0];
		var number = $this.attr('id').split('div')[1];
		var zone_id = $('#' + name + 'name' + number).attr('id');
		var zone_name = $('#' + zone_id).find('.redapple').html();
		var lock_zone_class = $('#' + zone_id).find('.lock').attr('class');
		if (isOpera) {
			var transform = $this.find('#rotatable').css('-o-transform');
			$this.find('#rotatable').css('-o-transform', 'matrix(1,0,0,1,0,0)');
		} else if (isFirefox) {
			transform = $this.find('#rotatable').css('-moz-transform');
			$this.find('#rotatable').css('-moz-transform', 'matrix(1,0,0,1,0,0)');
		} else if (isChrome || isSafari) {
			transform = $this.find('#rotatable').css('-webkit-transform');
			$this.find('#rotatable').css('-webkit-transform', 'matrix(1,0,0,1,0,0)');
		}

		var texthtml = $this.find('#rotatable').html().replace(/\<div>/g, '');
		//texthtml = texthtml.replace(/[\u200B-\u200D\uFEFF]/g, '####');
		texthtml = texthtml.replace(/ /g, "&nbsp;");
		// console.log(eval(texthtml));
		var strip_text = strip_tags(texthtml, '<br><br/><ul><ol><li>');

//		var text = document.createElement('div');
//		text.className = "txt";
//		$(text).append(texthtml);
//		$(text).find('.ui-resizable-handle').remove();
//		$(text).find('#b_all_style').remove();
//		$(text).find('span').remove();
//		$(text).find('.ui-rotatable-handle').remove();
//		$(text).html($(text).html().replace(/\<div>/g, '<br>'));


		if ($this.hasClass('active')) {
			var act = 'active';
		} else {
			act = 'deactive';
		}
		//twidth=$this.find('#rotatable').width();   
		//twidth=twidth+1;
		//$this.find('#rotatable').width(twidth);		   
		var text_data = {
			pagezoneid: $this.attr('zoneid'),
			type: '0',
			status: act == 'active' ? '1' : '0',
			height: $this.find('#rotatable').height(),
			width: $this.find('#rotatable').width(),
			topoffset: $this.position().top,
			leftoffset: $this.position().left,
			zindex: $this.css('z-index'),
			transform: transform,
			bdcolor: $this.find('#b_color').val(),
			bdstyle: $this.find('#b_style').val(),
			bdwidth: $this.find('#b_width').val(),
			bdtl: $this.find('#rotatable').css('border-top-left-radius'),
			bdtr: $this.find('#rotatable').css('border-top-right-radius'),
			bdbl: $this.find('#rotatable').css('border-bottom-left-radius'),
			bdbr: $this.find('#rotatable').css('border-bottom-right-radius'),
			bgcolor: $this.find('#rotatable').css('background-color'),
			padding: $this.find('#rotatable').css('padding-top'),
			shadow: $this.find('#rotatable').css('text-shadow'),
			color: $this.find('#rotatable').css('color'),
			fontfamily: $this.find('#rotatable').css('font-family'),
			fontsize: $this.find('#rotatable').css('font-size'),
			fontweight: $this.find('#rotatable').css('font-weight'),
			fontstyle: $this.find('#rotatable').css('font-style'),
			decoration: $this.find('#rotatable').find("p").css('text-decoration'),
			align: $this.find('#rotatable').css('text-align'),
			lineheight: $this.find('#rotatable').css("line-height"),
			content: strip_text,
			imageid: '',
			videoid: '',

			layer_mode: act,
			img_name: 'text',
			text_top: $this.position().top,
			text_left: $this.position().left,
			text_height: $this.find('#rotatable').height(),
			text_width: $this.find('#rotatable').width(),
			text_html: strip_text,
			text_transform: transform,
			text_color: $this.find('#rotatable').css('color'),
			text_font_family: $this.find('#rotatable').css('font-family'),
			text_font_file: $this.find('#font_file').val(),
			text_font_size: $this.find('#rotatable').css('font-size'),
			text_decoration: $this.find('#rotatable').find("p").css('text-decoration'),
			text_align: $this.find('#rotatable').css('text-align'),
			text_font_weight: $this.find('#rotatable').css('font-weight'),
			text_font_style: $this.find('#rotatable').css('font-style'),
			text_border_color: $this.find('#b_color').val(),
			text_border_style: $this.find('#b_style').val(),
			text_border_width: $this.find('#b_width').val(),
			text_padding: $this.find('#rotatable').css('padding-top'),
			text_background_color: $this.find('#rotatable').css('background-color'), 
			img_z_index: $this.css('z-index'),
			text_ticker_style: $this.find('#textticker_direction').val(),
			text_ticker_duration: $this.find('#textticker_duration').val(),
			zone_name: zone_name,
			text_line_height: $this.find('#rotatable').css("line-height"),
			lock_zone_class: lock_zone_class,
			div_id: $this.attr('id'),
			text_shadow: $this.find('#rotatable').css('text-shadow'),
			border_top_right: $this.find('#rotatable').css('border-top-right-radius'),
			border_top_left: $this.find('#rotatable').css('border-top-left-radius'),
			border_bottom_left: $this.find('#rotatable').css('border-bottom-left-radius'),
			border_bottom_right: $this.find('#rotatable').css('border-bottom-right-radius')
		};

		zone_array.push(text_data);
		if (isOpera) {
			$this.find('#rotatable').css('-o-transform', transform);
		} else if (isOpera || isFirefox) {
			$this.find('#rotatable').css('-moz-transform', transform);
		} else if (isChrome || isSafari) {
			$this.find('#rotatable').css('-webkit-transform', transform);
		}
	});
	return zone_array;
}

function strip_tags(input, allowed) {
	// making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
	allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); 
	var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
			commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
	return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
		return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
	});
}

function save_all_values(action) {
	remove_all_selected_layers();
	$('.editor_screen').animate({
		scrollTop: $("#fixedwidth").height()
	}, 'fast');

	if (action == 'exit') {
		 window.close();
	} else {
		$('.ruler_left').remove();
		$('.ruler_top').remove();

		$('#action').val(action);

		$("#hider").hide();
		$("#popup_box").hide();

		$('.text_div').removeClass('select_layer');
		$('.image_div').removeClass('select_layer');

		bootbox.confirm('Are you sure you want to save data?', function(result) {
			if (result == true) {
				if ($("#fixedwidth").width() == original_width) {
					template_zoom_out();
					$("#zoom_out").unbind('click');
				}
				if ($("#fixedwidth").width() == template_width) {
					var image_array = get_all_zones();
					CurrentPage.pagezones = [];
					for (m = 0; m < image_array.length; m++) {
						var pagezone = {};
						pagezone.pagezoneid = image_array[m].pagezoneid;
						pagezone.name = image_array[m].zone_name;
						pagezone.type = image_array[m].type;
						pagezone.status = image_array[m].status;
						pagezone.height = image_array[m].height;
						pagezone.width = image_array[m].width;
						pagezone.topoffset = image_array[m].topoffset;
						pagezone.leftoffset = image_array[m].leftoffset;
						pagezone.zindex = image_array[m].zindex;
						pagezone.transform = image_array[m].transform;
						pagezone.bdcolor = image_array[m].bdcolor;
						pagezone.bdstyle = image_array[m].bdstyle;
						pagezone.bdwidth = image_array[m].bdwidth;
						pagezone.bdtl = image_array[m].bdtl;
						pagezone.bdtr = image_array[m].bdtr;
						pagezone.bdbl = image_array[m].bdbl;
						pagezone.bdbr = image_array[m].bdbr;
						pagezone.bgcolor = image_array[m].bgcolor;
						pagezone.opacity = image_array[m].opacity;
						pagezone.padding = image_array[m].padding;
						pagezone.shadow = image_array[m].shadow;
						pagezone.color = image_array[m].color;
						pagezone.fontfamily = image_array[m].fontfamily;
						pagezone.fontsize = image_array[m].fontsize;
						pagezone.fontweight = image_array[m].fontweight;
						pagezone.fontstyle = image_array[m].fontstyle;
						pagezone.decoration = image_array[m].decoration;
						pagezone.align = image_array[m].align;
						pagezone.lineheight = image_array[m].lineheight;
						pagezone.content = image_array[m].content;
						pagezone.imageid = image_array[m].imageid;
						pagezone.videoid = image_array[m].videoid;
						
						CurrentPage.pagezones.push(pagezone);
					}
					$('#snapshot_div').show();
					generate_preview('#snapshot_div');
	 				html2canvas($('#snapshot_div'), {
						onrendered: function(canvas) {
							console.log(canvas.toDataURL());
							CurrentPage.snapshotdtl = canvas.toDataURL();
							$('#snapshot_div').hide();
							$.ajax({
								type : 'POST',
								url: 'page!save.action',
								data: '{"page":' + $.toJSON(CurrentPage) + '}',
								dataType : 'json',
								contentType : 'application/json;charset=utf-8',
								beforeSend: function () {
									var throberdiv = "<div id='throberdiv'></div>";
									$(throberdiv).prependTo("body");
								},
								success: function(data){
									$("#throberdiv").remove();
									if (data.errorcode == 0) {
										bootbox.alert("Template has been saved successfully.");
									} else {
										bootbox.alert("There is some technical problem while saving template data.Please try again.");
									}
								}
							});
						}
					});
	 				
				}
			}
		});
	}
}

function generate_preview(previewdiv) {
	$(previewdiv).html('');
	images = get_all_zones();

	for (m = 0; m < images.length; m++) {
		if (images[m].layer_mode == 'active') {
			if (images[m].img_name == 'image') {
				var imagediv = document.createElement('div');
				imagediv.className = "image_html";
				imagediv.id = "imagehtml_" + m;
				var inner_image_div = document.createElement('div');
				inner_image_div.className = "inner_div";
				$(imagediv).append(inner_image_div);
				$(previewdiv).append(imagediv);

				$(imagediv).css('top', (images[m].img_top) + 'px');
				$(imagediv).css('left', (images[m].img_left) + 'px');
				$(imagediv).css('height', images[m].img_height + 'px');
				$(imagediv).css('width', images[m].img_width + 'px');
				$(imagediv).css('-moz-transform', images[m].img_transform);
				$(imagediv).css('-webkit-transform', images[m].img_transform);
				if (images[m].img_background_image != '' && images[m].img_background_image != 'no' && images[m].zone_content != 'non') {
					if (images[m].img_kenburn_effect == "1") {
						//console.log("image kenburn = "+images[m].img_kenburn_effect);
						var temp_imgs = '/pixsigdata' + images[m].img_background_image;
						$(imagediv).css('overflow', 'hidden');
						$(imagediv).css('position', 'relative');
						var kimg_div = document.createElement('div');
						kimg_div.className = 'slideshow';
						kimg_div.id = 'slideshow_' + m;
						$(imagediv).find('.inner_div').append(kimg_div);

						var str = "<img id='img_1' src='" + temp_imgs + "' alt=''>";
						str += "<img id='img_2' src='" + temp_imgs + "' alt=''>";
						str += "<img id='img_3' src='" + temp_imgs + "' alt=''>";
						str += "<img id='img_4' src='" + temp_imgs + "' alt=''>";
						$(imagediv).find('.inner_div').find("#slideshow_" + m).html(str);
						var imagesdata = $(imagediv).find('.inner_div').find("#slideshow_" + m).find('img');
						var speed_duration = 8000;//images[m].img_kenburn_duration * 1000;						
						kenburns(imagesdata, $(imagediv).height(), imagediv.width(), m,speed_duration);
					} else if (images[m].img_pulse_effect != "0") {					 
						$(imagediv).find('.inner_div').css('background-image', 'url(/pixsigdata' + images[m].img_background_image + ')');
						$(imagediv).find('.inner_div').addClass(images[m].img_pulse_effect);
					} else if(images[m].multiple_images_str != ""){
						//imagediv.find('.inner_div').css('background-image', 'url(' + path_url + 'images/' + images[m].img_background_image + ')');
						$(imagediv).find('.inner_div').append('<div id = "playlistImages_' + m + '" class="playlist" ></div>');
						cnt = 1;
						playlist_effect_str = images[m].playlist_settings_json_str;
						$.each($.parseJSON(playlist_effect_str), function (index, value) {
							$("#playlistImages_" + m).append("<img id='img_" + (cnt++) + "' src='"+path_url + "uploads/media/category/images/" + index + "' data-duration='" + value.duration + "' data-effect='" + value.effect + "' />");
						});
						var playlist_images = $(imagediv).find('.inner_div').find("#playlistImages_" + m).find('img');
						generate_playlist(playlist_images, m, $(imagediv).height(), $(imagediv).width());
					} else {
						$(imagediv).find('.inner_div').css('background-image', 'url(/pixsigdata' + images[m].img_background_image + ')');
					}
				}
				$(imagediv).css('border-color', images[m].img_border_color);
				$(imagediv).css('border-style', images[m].img_border_style);
				$(imagediv).css('border-width', images[m].img_border_width + 'px');
				$(imagediv).css('background-color', images[m].img_background_color);
				$(imagediv).css('z-index', images[m].img_z_index);
				$(imagediv).find('.inner_div').css('opacity', images[m].img_opacity);
				$(imagediv).css('padding', images[m].img_padding);
				$(imagediv).css('box-shadow', images[m].img_shadow);
				$(imagediv).css('border-top-right-radius', images[m].border_top_right);
				$(imagediv).css('border-top-left-radius', images[m].border_top_left);
				$(imagediv).css('border-bottom-left-radius', images[m].border_bottom_left);
				$(imagediv).css('border-bottom-right-radius', images[m].border_bottom_right);
				$(imagediv).find('.inner_div').css('border-top-right-radius', images[m].border_top_right);
				$(imagediv).find('.inner_div').css('border-top-left-radius', images[m].border_top_left);
				$(imagediv).find('.inner_div').css('border-bottom-left-radius', images[m].border_bottom_left);
				$(imagediv).find('.inner_div').css('border-bottom-right-radius', images[m].border_bottom_right);
			} else if (images[m].img_name == 'text') {
				var p_ele = document.createElement('p');
				p_ele.className = 'clstextedit';
				p_ele.id = 'clstextedit_' + m;
				var textdiv = document.createElement('div');
				textdiv.className = 'text_html';
				textdiv.id = 'texthtml_' + m;
				p_ele.innerHTML = images[m].text_html;
				$(textdiv).append(p_ele);
				$(previewdiv).append(textdiv);

				$(textdiv).css('top', images[m].text_top + 'px');
				$(textdiv).css('left', images[m].text_left + 'px');
				$(textdiv).css('height', images[m].text_height + 'px');
				$(textdiv).css('width', (images[m].text_width + 1) + 'px');
				$(textdiv).css('-moz-transform', images[m].text_transform);
				$(textdiv).css('-webkit-transform', images[m].text_transform);
				$(textdiv).css('color', images[m].text_color);
				$(textdiv).css('font-family', images[m].text_font_family);
				$(textdiv).css('font-size', images[m].text_font_size);
				$(textdiv).find("p").css('text-decoration', images[m].text_decoration);
				$(textdiv).css('text-align', images[m].text_align);
				$(textdiv).css('font-weight', images[m].text_font_weight);
				$(textdiv).css('font-style', images[m].text_font_style);
				$(textdiv).css('border-color', images[m].text_border_color);
				$(textdiv).css('border-style', images[m].text_border_style);
				$(textdiv).css('border-width', images[m].text_border_width + 'px');
				$(textdiv).css('background-color', images[m].text_background_color);
				$(textdiv).css('padding', images[m].text_padding);
				$(textdiv).css('z-index', images[m].img_z_index);
				$(textdiv).css('text-shadow', images[m].text_shadow);
				$(textdiv).css('line-height', images[m].text_line_height);
				$(textdiv).css('border-top-right-radius', images[m].border_top_right);
				$(textdiv).css('border-top-left-radius', images[m].border_top_left);
				$(textdiv).css('border-bottom-left-radius', images[m].border_bottom_left);
				$(textdiv).css('border-bottom-right-radius', images[m].border_bottom_right);
				$(textdiv).css('word-wrap', 'break-word');
				$(textdiv).css('overflow', 'hidden');

				if(images[m].text_ticker_style) {
					text_ticker_function($(textdiv), images[m].text_ticker_style, images[m].text_ticker_duration);
				}
			}
		}
	}
	$('.ruler_top').remove();
	$('.ruler_left').remove();
	$("#set_ruler").val('0');
	$('.grid_btn').removeClass('grid_btn_active');
}



function editable_zone_name() {
	$('#create_li_list li').each(function () {
		$(this).find('.redapple').editable(function(value, settings) {
			console.log(value);
			return(value);
		  }, {
			style: 'padding:4px;margin:-5px 0 0 0px;',
			tooltip: 'Click to edit...',
			width: '150px',
			height: '20px',
			maxlength: 25,
			onblur: 'submit'
		});
	});
}


function set_layer_position_using_arrows(event_click) {
	$(window).unbind('keydown');
	$(window).keydown(function (e) {
		console.log(e.keyCode);
		$('.select_layer').each(function () {
			var id1 = this.id;
			var layer = $('#' + id1);
			if ($('#' + id1).find('.ui-resizable-handle').css('display') == 'block') {
				if (e.keyCode == 37) {
					var left = parseInt(layer.position().left) - 1;
					var top = parseInt(layer.position().top);
					layer.css('left', left);
					var arrow = 'arrow';
					if (event_click == 'click') {
						if ($("#fixedwidth").width() == original_width) {
							$('#div_x_axis').val(Math.round(left));
						} else {
							$('#div_x_axis').val(Math.round(left * (original_width / template_width)));
						}
					}
				}
				if (e.keyCode == 38) {
					top = parseInt(layer.position().top) - 1;
					left = parseInt(layer.position().left);
					layer.css('top', top);
					arrow = 'arrow';
					if (event_click == 'click') {
						if ($("#fixedwidth").width() == original_width) {
							$('#div_y_axis').val(Math.round(top));
						} else {
							$('#div_y_axis').val(Math.round(top * (original_width / template_width)));
						}
					}
				}
				if (e.keyCode == 39) {
					top = parseInt(layer.position().top);
					left = parseInt(layer.position().left) + 1;
					layer.css('left', left);
					arrow = 'arrow';
					if (event_click == 'click') {
						if ($("#fixedwidth").width() == original_width) {
							$('#div_x_axis').val(Math.round(left));
						} else {
							$('#div_x_axis').val(Math.round(left * (original_width / template_width)));
						}
					}
				}
				if (e.keyCode == 40) {
					top = parseInt(layer.position().top) + 1;
					left = parseInt(layer.position().left);
					layer.css('top', top);
					arrow = 'arrow';
					if (event_click == 'click') {
						if ($("#fixedwidth").width() == original_width) {
							$('#div_y_axis').val(Math.round(top));
						} else {
							$('#div_y_axis').val(Math.round(top * (original_width / template_width)));
						}
					}
				}
			}
			create_error_select_layer_outof_range(this, left, top, arrow, event_click);
		});
	});
}
function set_rotation_angle_spinner_value(scaley) {
	var values = scaley.split('(')[1];
	values = values.split(')')[0];
	values = values.split(',');
	var a = values[0];
	var b = values[1];
	var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
	$('#rotate_selected_div').val(Math.round(angle));
}
function set_position_select_layer(x_axis, y_axis) {
	if ($("#fixedwidth").width() == original_width) {
		var left1 = Math.round(x_axis);
		var top1 = Math.round(y_axis);
	} else {
		var left1 = Math.round(x_axis * (original_width / template_width));
		var top1 = Math.round(y_axis * (original_width / template_width));
	}
	$('#div_x_axis').val(left1);
	$('#div_y_axis').val(top1);
	$('.select_layer').find('#left').val(left1);
	$('.select_layer').find('#top').val(top1);
}

function set_image_effect_select_layer(img_kenburg_effect) {
	$('#image_effect_kenburn').removeAttr('checked');
	if (img_kenburg_effect == "1") {
		$('#image_effect_kenburn').attr('checked', 'checked');
	}
}
function create_error_select_layer_outof_range(obj, x_axis, y_axis, events, event_click) {
	var selected_obj = $(obj);
	var div_id = selected_obj.attr('id');
	var number = div_id.split('div')[1];
	var name = div_id.split('div')[0];
	if (selected_obj.hasClass('image_div') || selected_obj.hasClass('text_div')) {
		var text_div_padding = selected_obj.find('.rotatable').css('padding-top').replace('px', '');
		var width = selected_obj.find('#rotatable').width();
		var height = selected_obj.find('#rotatable').height();
	} else {
		text_div_padding = 0;
		width = selected_obj.width();
		height = selected_obj.height();
	}
	var new_x_axis = width + x_axis;
	var new_y_axis = height + y_axis;
	selected_obj.css('bottom', '');
	selected_obj.css('right', '');
	if (x_axis < 0 || new_x_axis > template_width || new_x_axis > original_width || y_axis < 0 || new_y_axis > template_height || new_y_axis > original_height) {
		$('#' + name + 'name' + number).css('border', '1px solid red');
	} else {
		$('#' + name + 'name' + number).css('border', '');
	}
	if ((events == 'arrow') || events == 'drag') {
		var ruler_var = 'on';
		element_ruler('#' + div_id, x_axis, y_axis, width, height, text_div_padding, ruler_var);
	} else if (event_click == 'click') {
		ruler_var = 'onclick';
		element_ruler('#' + div_id, x_axis, y_axis, width, height, text_div_padding, ruler_var);
	}
}
function sortable_layre_list() {
	var p3 = 0;
	var large_z3 = get_largest_zindex();
	var images3 = get_all_zones();
	var liContents = [];
	while (p3 <= large_z3) {
		for (m = 0; m < images3.length; m++) {
			if (p3 == images3[m].img_z_index) {

				var name = images3[m].div_id.split("div")[0];
				var number = images3[m].div_id.split("div")[1];
				liContents.push($('#' + name + "name" + number));
			}
		}
		p3++;
	}
	liContents.sort(function (a, b) {
		return (b - a);
	});
	for (i = 0; i < images3.length; i++) {
		$("#create_li_list").prepend(liContents.pop());
	}
}
function select_multiple_layers_active(obj) {
	console.log('select_multiple_layers_active', obj);
	$(obj).toggleClass('grouped');

	$('#select_div_top').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_bottom').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_left').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_right').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_horizontal_stretch').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_vertical_stretch').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_rotate_left').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_rotate_right').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_flip_vertical').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_flip_horizontal').attr('onclick', '').css('opacity', '0.3');
	$('#rotate_selected_div').spinner('disable').css('opacity', '0.3');
	$('#div_width').spinner('disable').css('opacity', '0.3');
	$('#div_height').spinner('disable').css('opacity', '0.3');
	$('#div_x_axis').spinner('disable').css('opacity', '0.3');
	$('#div_y_axis').spinner('disable').css('opacity', '0.3');
	$('#line_space_text').spinner('disable').css('opacity', '0.3');
	$('#background_opacity').slider('disable');

	$('#lock_particular_zone').addClass("lock_main");
	$('#unlock_particular_zone').removeClass("unlock_main");
	$('#select_div_bring_to_front').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_send_to_back').attr('onclick', '').css('opacity', '0.3');

	var zoneid = $(obj).attr('zoneid');
	var zonetype = $(obj).attr('zonetype');
	var zonelabel = $('#' + zonetype + 'name_' + zoneid);
	
	$('.image_div').draggable('disable');
	$('.text_div').draggable('disable');
	$('.image_div').find('#rotatable').resizable('disable');
	$('.text_div').find('#rotatable').resizable('disable');
	$('.image_div').find('.ui-rotatable-handle').css('display', 'none');
	$('.text_div').find('.ui-rotatable-handle').css('display', 'none');
	$('.select_layer').find('div.ui-resizable-handle').addClass('select');

	var width = $(obj).find('#rotatable').width();
	var height = $(obj).find('#rotatable').height();
	var x_axis = $(obj).position().left;
	var y_axis = $(obj).position().top;
	var padding = $(obj).find('#rotatable').css('padding-top').replace('px', '');

	if (zonelabel.find('.label_check').attr('class') == 'label_check c_off') {
		$('.image_div').find('.ui-rotatable-handle').css('display', 'none');
		$('.text_div').find('.ui-rotatable-handle').css('display', 'none');
		$(obj).find('.ui-rotatable-handle').css('display', 'block');
		element_ruler('#' + $(obj).attr('id'), x_axis, y_axis, width, height, padding, 'on');
		zonelabel.find('.label_check').attr('class', 'label_check c_on');
		zonelabel.find('.dv_my').addClass('dv_actv');
		if (zonelabel.find('.lock').attr('class') == 'lock') {
			$(obj).find('#rotatable').resizable('option', 'disabled', true);
			$(obj).find('div.ui-resizable-handle').addClass('select');
			$(obj).addClass('select_layer');
		} else {
			$(obj).find('#rotatable').resizable('option', 'disabled', true);
			$(obj).removeClass('select_layer');
			$(obj).find('div.ui-resizable-handle').addClass('select');
		}

	} else if (zonelabel.find('.label_check').attr('class') == 'label_check c_on') {
		$('.image_div').find('.ui-rotatable-handle').css('display', 'none');
		$('.text_div').find('.ui-rotatable-handle').css('display', 'none');

		element_ruler('#' + $(obj).attr('id'), x_axis, y_axis, width, height, padding, 'off');
		zonelabel.find('.label_check').attr('class', 'label_check c_off');
		zonelabel.find('.dv_my').removeClass('dv_actv');
		$(obj).removeClass('select_layer');
		$(obj).find('#rotatable').resizable('disable');
		$(obj).find('div.ui-resizable-handle').removeClass('select');
	}

	set_layer_position_using_arrows("ctrl_click");
//	$('#select_div_bring_to_front').attr('onclick', '').css('opacity', '0.3');
//	$('#select_div_send_to_back').attr('onclick', '').css('opacity', '0.3');
	$('#select_div_reset').attr('onclick', '');
	$('#rotate_selected_div').spinner('disable');
	$('#unlock_particular_zone').attr('onclick', '');
	$('#lock_particular_zone').attr('onclick', '');
	$('#lock_particular_zone').removeClass("lock_main");
	$('#unlock_particular_zone').removeClass("unlock_main");
	var count = 0;
	$('.select_layer').each(function () {
		if ($(this).hasClass("text_div")) {
			count++;
		}
	});

	if ($('.select_layer').length == 1 && $('.select_layer').length != 0) {
		if ($('.select_layer').hasClass('image_div')) {
			$("#image_div_settings").show();
		} else if ($('.select_layer').hasClass('text_div')) {
			$('#text_div_settings').show();
			$('#line_space_text').spinner('enable');
		} else {
			$('#text_div_settings').hide();
			$("#image_div_settings").hide();
		}
	} else {
		if ($('.select_layer').length == count) {
			$('#text_div_settings').show();
			$('#line_space_text').spinner('enable');
		} else {
			$('#text_div_settings').hide();
			$("#image_div_settings").hide();
		}
		$('.image_div').find(".ui-rotatable-handle").css("display", "none");
		$('.text_div').find(".ui-rotatable-handle").css("display", "none");
	}
	$(".select_layer").draggable({
		disabled: false,
		start: function (event, ui) {
			posTopArray = [];
			posLeftArray = [];
			if ($(this).hasClass("select_layer")) {		// Loop through each element and store beginning start and left positions
				$(".select_layer").each(function (i) {
					thiscsstop = $(this).css('top');
					if (thiscsstop == 'auto')
						thiscsstop = 0; // For IE
					thiscssleft = $(this).css('left');
					if (thiscssleft == 'auto')
						thiscssleft = 0; // For IE
					posTopArray[i] = parseInt(thiscsstop);
					posLeftArray[i] = parseInt(thiscssleft);
				});
			}
			begintop = $(this).offset().top; // Dragged element top position
			beginleft = $(this).offset().left; // Dragged element left position
		},
		drag: function (event, ui) {
			var topdiff = $(this).offset().top - begintop; // Current distance dragged element has traveled vertically
			var leftdiff = $(this).offset().left - beginleft; // Current distance dragged element has traveled horizontally
			if ($(this).hasClass("select_layer")) {
				$(".select_layer").each(function (i) {
					$(this).css('top', posTopArray[i] + topdiff); // Move element veritically - current css top + distance dragged element has travelled vertically
					$(this).css('left', posLeftArray[i] + leftdiff); // Move element horizontally - current css left + distance dragged element has travelled horizontally
					create_error_select_layer_outof_range(this, posLeftArray[i] + leftdiff, posTopArray[i] + topdiff, 'drag', '');
				});
			}
		}
	});
	return false;
}
function get_layer_list_on_right_click_and_select_layer() {
	$('.image_div, .text_div').live('mousedown', function (e) {
		if (e.which == 3) {
			var x1 = Math.round((e.pageX - $('#fixedwidth').offset().left));
			var y1 = Math.round((e.pageY - $('#fixedwidth').offset().top));
			$('.select_layer_list').remove();
			$('#fixedwidth').append('<div class="select_layer_list" style="left:' + x1 + 'px;top:' + y1 + 'px;"><div id="cat_list_close" style="top:-4px;right:4px;font-size:15px;">x</div><ul></ul></div>');
			var laregst_zindex = get_largest_zindex();
			var all_zones = get_all_zones();
			var p = 0, m = 0, z = 0;
			while (p <= laregst_zindex) {
				for (m = 0; m < all_zones.length; m++) {
					if (p == all_zones[m].img_z_index) {
						var height1 = $('#' + all_zones[m].div_id).height();
						var width1 = $('#' + all_zones[m].div_id).width();
						var left1 = $('#' + all_zones[m].div_id).position().left;
						var top1 = $('#' + all_zones[m].div_id).position().top;
						var left2 = parseInt(left1) + parseInt(width1);
						var top2 = parseInt(top1) + parseInt(height1);
						if ((x1 >= left1 && x1 <= left2) && (y1 >= top1 && y1 <= top2)) {
							var id = all_zones[m].div_id;
							var name = id.split('div')[0];
							var number = id.split('div')[1];
							var layer_name = $('#' + name + 'name' + number).find('.redapple').html();
							if ($('#' + name + 'div' + number).hasClass('select_layer')) {
								$('.select_layer_list').find('ul').prepend('<li id="' + name + 'list' + number + '"><input type="checkbox" checked="checked" name="' + layer_name + '" id="' + name + 'list' + number + '" ><label>' + layer_name + '</label></li>');
							} else {
								$('.select_layer_list').find('ul').prepend('<li id="' + name + 'list' + number + '"><input type="checkbox" name="' + layer_name + '" id="' + name + 'list' + number + '"><label>' + layer_name + '</label></li>');
							}
						}
					}
				}
				p++;
			}
			$('.select_layer_list').jqTransform();
			$('.select_layer_list').find('#cat_list_close').click(function (e) {
				$('.select_layer_list').remove();
				e.stopPropagation();
			});
			$('.select_layer_list').find('ul').find('input:checkbox').click(function (e) {
				var li_id = this.id;
				var name = li_id.split('list')[0];
				var number = li_id.split('list')[1];
				select_multiple_layers_active($('#' + name + 'div' + number));

			});
			$('.select_layer_list').click(function (e) {
				e.stopPropagation();
			});
		}
	});
}

var thumb_width = 0;
function init_media_library() {
	$('#ImageLibraryPreview').css('background-position', 'center');
	$('#ImageLibraryPreview').css('background-repeat', 'no-repeat');
	$('#ImageTable thead').css('display', 'none');
	$('#ImageTable tbody').css('display', 'none');	
	var imagehtml = '';
	$('#ImageTable').dataTable({
		'sDom' : 'rt<"row"<"col-md-5 col-sm-5"i><"col-md-7 col-sm-7"p>>', 
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : 'image!list.action',
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }],
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
			if (iDisplayIndex % 4 == 0) {
				imagehtml = '';
				imagehtml += '<div class="row" >';
			}
			imagehtml += '<div class="col-md-3 col-xs-3">';
			if (thumb_width > 0) {
				imagehtml += '<div class="thumbs" id="thumbs_2352" style="width:' + thumb_width + 'px; height:' + thumb_width + 'px;">';
			} else {
				imagehtml += '<div class="thumbs" id="thumbs_2352">';
			}
			var new_width = 100;
			if (aData.width < aData.height) {
				new_width = 100*aData.width/aData.height;
			}
			imagehtml += '<img src="/pixsigdata' + aData.thumbnail + '" imageid="' + aData.imageid + '" owidth="' + aData.width + '" oheight="' + aData.height + '" content="' + aData.filepath + '" class="imgthumb" width="' + new_width + '%" />';
			imagehtml += '</div>';
			
			imagehtml += '</div>';
			if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#ImageTable').dataTable().fnGetData().length) {
				imagehtml += '</div>';
				if ((iDisplayIndex+1) != $('#ImageTable').dataTable().fnGetData().length) {
					imagehtml += '<hr/>';
				}
				$('#ImageContainer').append(imagehtml);
				$('.thumbs').each(function(i) {
					$(this).click(function(event) {
						$("#ImageLibraryPreview").attr('imageid', $(this).find('.imgthumb').attr('imageid'));
						$("#ImageLibraryPreview").attr('content', $(this).find('.imgthumb').attr('content'));
						$("#ImageLibraryPreview").attr('owidth', $(this).find('.imgthumb').attr('owidth'));
						$("#ImageLibraryPreview").attr('oheight', $(this).find('.imgthumb').attr('oheight'));
						display_preview_image($('#ImageLibraryPreview'));
					});
				});
			}
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push(
				{'name':'objtype','value':$('#ImageTable').attr('objtype') },
				{'name':'objid','value':$('#ImageTable').attr('objid') }
			);
		}
	});
	$('#ImageTable').css('width', '100%');
}
function open_media_library(is_slideshow) {
	var objtype, objid;
	if (CurrentPage.pagepkgid == 0) {
		$('#pagepkg_tab').css('display', 'none');
		$('#pagepkg_tab').removeClass('active');
		$('#public_tab').removeClass('active');
		$('#template_tab').addClass('active');
		$('#ImageTable').attr('objtype', 1);;
		$('#ImageTable').attr('objid', CurrentPage.pageid);;
	} else {
		$('#pagepkg_tab').css('display', 'block');
		$('#pagepkg_tab').addClass('active');
		$('#public_tab').removeClass('active');
		$('#template_tab').removeClass('active');
		$('#ImageTable').attr('objtype', 2);;
		$('#ImageTable').attr('objid', CurrentPage.pagepkgid);;
	}
	$('#ImageTable').dataTable()._fnAjaxUpdate();
	
	$('#ImageLibraryPreview').attr('imageid', $('.select_layer').find('.inner_div').attr('imageid'));
	$('#ImageLibraryPreview').attr('content', $('.select_layer').find('.inner_div').attr('content'));
	$('#ImageLibraryPreview').attr('owidth', $('.select_layer').find('.inner_div').attr('owidth'));
	$('#ImageLibraryPreview').attr('oheight', $('.select_layer').find('.inner_div').attr('oheight'));

	$('#ImageLibraryModal').modal();
}
$('#ImageLibraryModal').on('shown.bs.modal', function (e) {
	$('.thumbs').each(function(i) {
		thumb_width = $(this).width();
		$(this).height($(this).width());
	});
	$('#ImageLibraryPreview').height($('#ImageLibraryPreview').width());
	display_preview_image($('#ImageLibraryPreview'));
})
$('#ImageLibraryModal #public_tab').click(function(event) {
	$('#ImageTable').attr('objtype', 0);;
	$('#ImageTable').attr('objid', 0);;
	$('#ImageTable').dataTable()._fnAjaxUpdate();
});	
$('#ImageLibraryModal #template_tab').click(function(event) {
	$('#ImageTable').attr('objtype', 1);;
	$('#ImageTable').attr('objid', CurrentPage.pageid);;
	$('#ImageTable').dataTable()._fnAjaxUpdate();
});	
$('#ImageLibraryModal #pagepkg_tab').click(function(event) {
	$('#ImageTable').attr('objtype', 2);;
	$('#ImageTable').attr('objid', CurrentPage.pagepkgid);;
	$('#ImageTable').dataTable()._fnAjaxUpdate();
});	
$('#ImageLibraryModal button[type=submit]').click(function(event) {
	var imageid = $('#ImageLibraryPreview').attr('imageid');
	var content = $('#ImageLibraryPreview').attr('content');
	var owidth = parseInt($('#ImageLibraryPreview').attr('owidth'));
	var oheight = parseInt($('#ImageLibraryPreview').attr('oheight'));

	var new_w = $(".select_layer").find('#rotatable').width();
	var new_h = $(".select_layer").find('#rotatable').height();
	if (owidth >= new_w || oheight >= new_h) {
		if (owidth/new_w > oheight/new_h) {
			new_h = (oheight / owidth) * new_w;
		} else {
			new_w = (owidth / oheight) * new_h;
		}
	}
	
	$(".select_layer").find('#rotatable').width(new_w);
	$(".select_layer").find('#rotatable').height(Math.round(new_h));
	$('.select_layer').find('.inner_div').css('background-image', 'url(/pixsigdata' + content + ')');
	$('.select_layer').find('.inner_div').attr('content', content);
	$('.select_layer').find('.inner_div').attr('imageid', imageid);
	$('.select_layer').find('.inner_div').attr('owidth', owidth);
	$('.select_layer').find('.inner_div').attr('oheight', oheight);
	$(".select_layer").find('#rotatable').resizable('destroy');
	var div_width = parseInt(new_w) * (original_width / template_width);
	var div_height = parseInt(new_h) * (original_width / template_width);
	$(".select_layer").find('#width').val(div_width);
	$(".select_layer").find('#height').val(div_height);
	$(".select_layer").find('.rotatable').resizable("destroy");
	common_resizable(true);
	apply_coords($(".select_layer"));
	
	$('#ImageLibraryModal').modal('hide');
});

function display_preview_image(div) {
	var backgroundimage = div.attr('content');
	if (backgroundimage != '') {
		div.css('background-image', 'url(/pixsigdata' + backgroundimage + ')');
		var owidth = parseInt(div.attr('owidth'));
		var oheight = parseInt(div.attr('oheight'));
		var background_size = "auto auto";
		if (owidth >= div.width() || oheight >= div.height()) {
			if (owidth > oheight) {
				background_size = "100% auto";
			} else {
				background_size = "auto 100%";
			}
		}
		div.css('background-size', background_size);
	} else {
		div.css('background-image', '');
	}
}



function set_visible_and_unvisible_layer(layer) {
	var list_id = $(layer).parents('.level2').attr('id');
	var number = list_id.split('name')[1];
	var name = list_id.split('name')[0];
	var $list_id = $('#' + list_id);
	if ($('#' + name + 'div' + number).hasClass('active')) {
		$('#' + name + 'div' + number).removeClass('active');
		$('#' + name + 'div' + number).addClass('deactive');
		$('#' + name + 'div' + number).css('visibility', 'hidden');
		$list_id.find('div.dv_my > .visible').removeClass('act');
		$list_id.find('div.dv_my > .visible').addClass('dact');
		$list_id.find('div.dv_my > .visible').css('background', 'url(../wysiwyg/images/editor/i-eye.png) -7px -3px no-repeat');
		$list_id.find('.dact').qtip('destroy');
		$list_id.find('.dact').qtip({
			style: {
				classes: 'ui-tooltip-dark ui-tooltip-shadow'
			},
			content: {
				text: 'Inactive'
			},
			position: {
				my: 'bottom center', // Position my top left...
				at: 'top center' // at the bottom right of...								
			}
		});
	} else {
		$('#' + name + 'div' + number).removeClass('deactive');
		$('#' + name + 'div' + number).addClass('active');
		$('#' + name + 'div' + number).css('visibility', 'visible');
		$list_id.find('div.dv_my > .visible').removeClass('dact');
		$list_id.find('div.dv_my > .visible').addClass('act');
		$list_id.find('div.dv_my > .visible').css('background', '');
		$list_id.find('.act').qtip('destroy');
		$list_id.find('.act').qtip({
			style: {
				classes: 'ui-tooltip-dark ui-tooltip-shadow'
			},
			content: {
				text: 'Active'
			},
			position: {
				my: 'bottom center', // Position my top left...
				at: 'top center' // at the bottom right of...								
			}
		});
	}
}
function layer_list_show_over_tipsy() {
	$('.level2').each(function () {
		$(this).find('.a').qtip({
			style: {
				classes: 'ui-tooltip-dark ui-tooltip-shadow'
			},
			content: {
				text: 'Text Layer'
			},
			position: {
				my: 'bottom center', // Position my top left...
				at: 'top center' // at the bottom right of...								
			}
		});
	});

	$('.level2').each(function () {
		$(this).find('.photo').qtip({
			style: {
				classes: 'ui-tooltip-dark ui-tooltip-shadow'
			},
			content: {
				text: 'Image Layer'
			},
			position: {
				my: 'bottom center', // Position my top left...
				at: 'top center' // at the bottom right of...								
			}
		});
	});
	$('.level2').each(function () {
		$(this).find('.act').qtip({
			style: {
				classes: 'ui-tooltip-dark ui-tooltip-shadow'
			},
			content: {
				text: 'Active'
			},
			position: {
				my: 'bottom center', // Position my top left...
				at: 'top center' // at the bottom right of...								
			}
		});
	});
}
function common_rotatable() {
	var $img = $('.select_layer').find('#rotatable');
	browser_check();
	if (isOpera) {
		var tr = $img.css('-o-transform').replace("matrix(", "").replace(")", "");
	} else if (isFirefox) {
		tr = $img.css('-moz-transform').replace("matrix(", "").replace(")", "");
	} else if (isChrome || isSafari) {
		tr = $img.css('-webkit-transform').replace("matrix(", "").replace(")", "");
	}
	console.log(tr);
	$(".select_layer").find(".ui-rotatable-handle").remove();
	$img.rotatable({mtx: [tr], onrotate: function (a) {
			console.log(a);
			set_rotation_angle_spinner_value(a);
		}
//		, stop: function(event, ui) {
//			console.log('rotate stop');
//			makeHistory_Array($('.fixedwidth').html(),$('#create_li_list').html());
//		}
	});
//	makeHistory_Array($('.fixedwidth').html(),$('#create_li_list').html());
}

function common_resizable(flag) {
	if (flag == null || flag == undefined) {
		flag = false;
	} else {
		flag = true;
	}
	$(".image_div, .text_div").find('.rotatable').resizable({
		aspectRatio: flag,
		handles: 'ne, nw, se, sw',
		stop: function (e, ui) {
			var selected_layer = $(".select_layer");
			var l = selected_layer.position().left;
			var t = selected_layer.position().top;
			var new_l = l + ui.position.left;
			var new_t = t + ui.position.top;
			selected_layer.css("left", Math.round(new_l));
			selected_layer.css("top", Math.round(new_t));
			$(this).css("left", 0);
			$(this).css("top", 0);
			var width = Math.round($(this).width() * (original_width / template_width));
			var height = Math.round($(this).height() * (original_width / template_width));
			var left1 = Math.round(new_l * (original_width / template_width));
			var top1 = Math.round(new_t * (original_width / template_width));
			selected_layer.find('#height').val(height);
			selected_layer.find('#width').val(width);
			selected_layer.find('#left').val(left1);
			selected_layer.find('#top').val(top1);
			apply_coords(".select_layer");
		}
	});
}
function common_disable_properties(obj) {
	$('.image_div').draggable('disable');
	$('.text_div').draggable('disable');
//	$('.image_div #resizable #rotatable').resizable('disable');
//	$('.text_div #resizable #rotatable').resizable('disable');
	$('.image_div').find('#rotatable').resizable('disable');
	$('.text_div').find('#rotatable').resizable('disable');
	$(".image_div").find('div.ui-resizable-handle').removeClass('select');
	$(".text_div").find('div.ui-resizable-handle').removeClass('select');
	$('.text_div').removeClass('select_layer');
	$('.image_div').removeClass('select_layer');
	if (obj != null)
		$(obj).addClass('select_layer');
	$('.image_div').find(".ui-rotatable-handle").css("display", "none");
	$('.text_div').find(".ui-rotatable-handle").css("display", "none");
}

function text_ticker_function(obj, direction_val, duration_val) {
	obj.marquee({
		direction: direction_val,
		duration: duration_val
	})
}
