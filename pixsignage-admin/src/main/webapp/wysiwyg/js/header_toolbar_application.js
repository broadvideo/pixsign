var timer = null;
var cnt_val = [];

/*Delete all layers*/
function delete_all_zones() {
	$("#create_li_list li").each(function() {
		zone_id = $(this).attr('id');
		remove_actv_class(zone_id);
		select_div(zone_id);
	});
	deleted_selected_all();
}
function remove_actv_class(zone_id) {
	$('#' + zone_id).children().removeClass('dv_actv');
	if ($('#' + zone_id).children().children('.chek').children().attr('class') == 'label_check c_on') {
		var zone_class = $('#' + zone_id).children().children('.chek').children().attr('class');
		$('#' + zone_id).children().children('.chek').children().removeClass(zone_class);
		var n = zone_class.replace("c_on", "c_off");
		$('#' + zone_id).children().children('.chek').children().addClass(n);
		var name = zone_id.split('name')[0];
		var number = zone_id.split('name')[1];
		var div_id = $('#' + name + 'div' + number).attr('id');
		$("#" + div_id).find("#rotatable").resizable('disable');
	}
}
function select_div(zone_id) {
	if ($('#' + zone_id).children().children('.chek').children().attr('class') == 'label_check c_off') {
		var zone_class = $('#' + zone_id).children().children('.chek').children().attr('class');
		$('#' + zone_id).children().children('.chek').children().removeClass(zone_class);
		var n = zone_class.replace("c_off", "c_on");
		$('#' + zone_id).children().children('.chek').children().addClass(n);
		var zone_actv_class = $('#' + zone_id).children().attr('class');
		var new_actv_class = zone_actv_class.replace("dv_my", "dv_my dv_actv");
		$('#' + zone_id).children().addClass(new_actv_class);
		var name = zone_id.split('name')[0];
		var number = zone_id.split('name')[1];
		var div_id = $('#' + name + 'div' + number).attr('id');
		$("#" + div_id).addClass('select_layer');
		$("#" + div_id).find("#rotatable").resizable('disable');
		$("#" + div_id).draggable('disable');
	}
}

function deleted_selected_all() {
	zone_data = [];
	var funct = 'delete';
	if ($('.dv_actv').length != 0) {
		bootbox.confirm('Are you sure you want to delete it?', function(result) {
			if (result == true) {
				if ($('#fixedwidth').find('.select_layer').attr('class')) {
					image_div_array = [];
					allchecked_div_array = [];
					$('.dv_actv').each(function() {
						var zone_id = $(this).parent().attr('id');
						var lock_zone_class = $('#' + zone_id).find('.lock').attr('class');
						var name = $(this).parent().attr('id').split('name')[0];
						var number = $(this).parent().attr('id').split('name')[1];
						var div_id = $('#' + name + 'div' + number).attr('id');
						if ($('#' + name + 'div' + number).hasClass('image_div')) {
							var div_image_type = div_id.match(/imagediv/g);
						} else if ($('#' + name + 'div' + number).hasClass('text_div')) {
							var div_text_type = div_id.match(/textdiv/g);
						}
						delete_zone_as_client_type(lock_zone_class, zone_id, div_id, funct, div_image_type, div_text_type);
					});
				}
				makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
			}
		});
	}
}

function delete_zone_as_client_type(lock_zone_class, zone_id, div_id, funct, div_image_type, div_text_type) {
	store_all_div =
			{
				zone_name: $('#' + zone_id).find('.redapple').html(),
				lock_zone_class: lock_zone_class,
				div_id: div_id,
				zone_id: zone_id,
				funct: funct
			};
	allchecked_div_array.push(store_all_div);
	delete_selectedzone_procedure(lock_zone_class, div_id, zone_id, funct);
}
function delete_selectedzone_procedure(lock_zone_class, div_id, zone_id, funct) {
	store_all_data_of_div(lock_zone_class, div_id, zone_id, funct);
}

function store_selected_all() {

	zone_data = [];
	var funct = 'delete';
	var selected_li = new Array();
	$('.dv_actv').each(function() {
		selected_li.push(this);
	});
	if (selected_li.length != 0) {
//		$('#popup_background').fadeIn('slow');
//		$('#popup_dialog').fadeIn('slow');
//		$('#popup_dialog').find('.dialog_msg').html('Are you sure you want to delete it?');
//	$('.dialog_msg').css('margin-left','-57px');
//		$('#popup_dialog').find("#ok").unbind('click');
//		$('#popup_dialog').find('#ok').bind("click", function() {
//			$('#popup_background').fadeOut('slow');
//			$('#popup_dialog').fadeOut('slow');
//		$('.dialog_msg').css('margin-left','-28px');
		if ($('#fixedwidth').find('.select_layer').attr('class')) {
//				image_div_array = [];
//				allchecked_div_array = [];
			$('.dv_actv').each(function() {
				var zone_id = $(this).parent().attr('id');
				var lock_zone_class = $('#' + zone_id).find('.lock').attr('class');
				var name = $(this).parent().attr('id').split('name')[0];
				var number = $(this).parent().attr('id').split('name')[1];
				var div_id = $('#' + name + 'div' + number).attr('id');
				if ($('#' + name + 'div' + number).hasClass('image_div')) {
					var div_image_type = div_id.match(/imagediv/g);
				} else if ($('#' + name + 'div' + number).hasClass('text_div')) {
					var div_text_type = div_id.match(/textdiv/g);
				}
				delete_zone_as_client_type(lock_zone_class, zone_id, div_id, funct, div_image_type, div_text_type);
			});
		}
		//$('#popup_background').fadeIn('slow');
		//$('#popup_dialog_ok').fadeIn('slow');
		//$('#popup_dialog_ok').find('.dialog_msg').html('Data has been deleted successfully.');
//		});
	}
}

/*Store all layers that is deleted and copy*/
function store_all_data_of_div(lock_zone_class, div_id, zone_id, funct) {
	browser_check();
	var $div_id = $("#" + div_id);
	if (lock_zone_class == 'lock') {
		if ($div_id.hasClass('image_div')) {
			if (isOpera) {
				var transform = $div_id.find('#rotatable').css('-o-transform');
			} else if (isFirefox) {
				transform = $div_id.find('#rotatable').css('-moz-transform');
			} else if (isChrome || isSafari) {
				transform = $div_id.find('#rotatable').css('-webkit-transform');
			}
			lock_zone_class = $('#' + zone_id).find('.lock').attr('class');
			var zone_name = $('#' + zone_id).find('.redapple').html();

			var image_data = {
				img_name: 'image',
				img_top: $div_id.position().top,
				img_left: $div_id.position().left,
				img_height: $div_id.find('#rotatable').height(),
				img_width: $div_id.find('#rotatable').width(),
				img_background_image: $div_id.find('.inner_div').css('background-image'),
				img_transform: transform,
				img_border_color: $div_id.find('#b_color').val(),
				img_border_style: $div_id.find('#b_style').val(),
				img_border_width: $div_id.find('#b_width').val(),
				img_background_color: $div_id.find('#rotatable').css('background-color'),
				img_z_index: $div_id.css('z-index'),
				img_padding: $div_id.find('#rotatable').css('padding-top'),
				img_opacity: $div_id.find('.inner_div').css('opacity'),
				img_shadow: $div_id.find('#rotatable').css('box-shadow'),
				zone_name: zone_name,
				lock_zone_class: lock_zone_class,
				div_id: div_id,
				border_top_right: $div_id.find('#rotatable').css('border-top-right-radius'),
				border_top_left: $div_id.find('#rotatable').css('border-top-left-radius'),
				border_bottom_left: $div_id.find('#rotatable').css('border-bottom-left-radius'),
				border_bottom_right: $div_id.find('#rotatable').css('border-bottom-right-radius'),
				img_kenburn_effect: $div_id.find('#kenuburn_effect').val(),
				img_pulse_effect: $div_id.find('#pulse_effect').val(),
				multiple_images_str: $div_id.find("#images_arr_str").val(),
				playlist_settings_json_str: $div_id.find("#playlist_settings_json_str").val()
			};
			zone_data.push(image_data);
		} else if ($div_id.hasClass('text_div')) {
			if (isOpera) {
				transform = $div_id.find('#rotatable').css('-o-transform');
			} else if (isFirefox) {
				transform = $div_id.find('#rotatable').css('-moz-transform');
			} else if (isChrome || isSafari) {
				transform = $div_id.find('#rotatable').css('-webkit-transform');
			}

			zone_name = $('#' + zone_id).find('.redapple').html();
			lock_zone_class = $('#' + zone_id).find('.lock').attr('class');
			$div_id.resizable("destroy");
			var alldiv = $div_id.find('#rotatable').find("p").find('div');
			$div_id.find('#rotatable').find("p").find('div').remove();
			myinneretxt = $div_id.find('#rotatable').find("p").html();

			var text_data = {
				img_name: 'text',
				text_top: $div_id.position().top,
				text_left: $div_id.position().left,
				text_height: $div_id.find('#rotatable').height(),
				text_width: $div_id.find('#rotatable').width(),
				text_html: myinneretxt,
				text_transform: transform,
				text_color: $div_id.find('#rotatable').css('color'),
				text_font_family: $div_id.find('#rotatable').css('font-family'),
				text_font_file: $div_id.find('#font_file').val(),
				text_font_size: $div_id.find('#rotatable').css('font-size'),
				text_decoration: $div_id.find('#rotatable').find("p").css('text-decoration'),
				text_align: $div_id.find('#rotatable').css('text-align'),
				text_font_weight: $div_id.find('#rotatable').css('font-weight'),
				text_font_style: $div_id.find('#rotatable').css('font-style'),
				text_border_color: $div_id.find('#b_color').val(),
				text_border_style: $div_id.find('#b_style').val(),
				text_border_width: $div_id.find('#b_width').val(),
				text_padding: $div_id.find('#rotatable').css('padding-top'),
				text_background_color: $div_id.find('#rotatable').css('background-color'),
				img_z_index: $div_id.css('z-index'),
				zone_name: zone_name,
				text_line_height: $div_id.find('#rotatable').css("line-height"),
				lock_zone_class: lock_zone_class,
				div_id: div_id,
				text_shadow: $div_id.find('#rotatable').css('text-shadow'),
				border_top_right: $div_id.find('#rotatable').css('border-top-right-radius'),
				border_top_left: $div_id.find('#rotatable').css('border-top-left-radius'),
				border_bottom_left: $div_id.find('#rotatable').css('border-bottom-left-radius'),
				border_bottom_right: $div_id.find('#rotatable').css('border-bottom-right-radius')
			};

			zone_data.push(text_data);
			$div_id.find('#rotatable').find("p").append(alldiv);
		}

		if (funct == 'delete') {
			if ($div_id.hasClass('select_layer')) {
				var div_int_id = div_id.split('_')[1];
				$('#top1' + div_int_id).remove();
				$('#top2' + div_int_id).remove();
				$('#left1' + div_int_id).remove();
				$('#left2' + div_int_id).remove();
			}
			$('#' + zone_id).remove();
			$div_id.remove();
//			makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
			z_index = $('#create_li_list li').length;
		}
	} else {
		lockzone_proc(div_id);
	}
}

/*Retrive all layers that is deleted and copy (undo)*/
function retrive_all_data_of_div(funct, div_id) {
//	var images1 = get_all_zones();
	var deleted_zindex = new Array();
	for (var i = 0; i < zone_data.length; i++) {
		if (zone_data[i].img_name == 'image') {
			if (funct == 'undo') {
				var id = zone_data[i].div_id;
				var div_name = id.split('_')[0];
				var div_num = id.split('_')[1];
				create_image_div(zone_data[i].img_z_index, zone_data[i].zone_name, zone_data[i].lock_zone_class, div_num, zone_data[i].img_background_image, div_name, funct);
				$('#' + id).css('top', (zone_data[i].img_top) + 'px');
				$('#' + id).css('left', (zone_data[i].img_left) + 'px');
				$('#' + id).css('z-index', zone_data[i].img_z_index);
				deleted_zindex.push(zone_data[i].img_z_index);
//				$('.zoom4').css('opacity', '0.3');
//				$('.zoom3').css('opacity', '');
			} else if (funct == 'copy') {
				create_image_div();
				id = $('.select_layer').attr('id');
				var left_new = parseInt($('#' + div_id).css('left'));
				var top_new = parseInt($('#' + div_id).css('top'));
				$('#' + id).css('top', top_new + 20);
				$('#' + id).css('left', left_new - 12);
				$('#' + id).css('z-index', parseInt(zone_data[i].img_z_index) + 1);
			} else {
				create_image_div();
				id = $('.select_layer').attr('id');
				$('#' + id).css('top', y + 'px');
				$('#' + id).css('left', x + 'px');

			}

			$('#' + id).find('#rotatable').css('height', zone_data[i].img_height + 'px');
			$('#' + id).find('#rotatable').css('width', zone_data[i].img_width + 'px');
			$('#' + id).find('#rotatable').css('-moz-transform', zone_data[i].img_transform);
			$('#' + id).find('#rotatable').css('-webkit-transform', zone_data[i].img_transform);
			$('#' + id).find('.inner_div').css('background-image', zone_data[i].img_background_image);
			$('#' + id).find('#rotatable').css('border-color', zone_data[i].img_border_color);
			$('#' + id).find('#rotatable').css('border-style', zone_data[i].img_border_style);
			$('#' + id).find('#rotatable').css('border-width', zone_data[i].img_border_width + 'px');
			$('#' + id).find('#b_color').val(zone_data[i].img_border_color);
			$('#' + id).find('#b_style').val(zone_data[i].img_border_style);
			$('#' + id).find('#b_width').val(zone_data[i].img_border_width);			
			$('#' + id).find('#rotatable').css('background-color', zone_data[i].img_background_color);
			$('#' + id).find('.inner_div').css('opacity', zone_data[i].img_opacity);
			$('#' + id).find('#rotatable').css('padding', zone_data[i].img_padding);
			$('#' + id).find('#rotatable').css('box-shadow', zone_data[i].img_shadow);
			$('#' + id).find('#rotatable').css('border-top-right-radius', zone_data[i].border_top_right);
			$('#' + id).find('#rotatable').css('border-top-left-radius', zone_data[i].border_top_left);
			$('#' + id).find('#rotatable').css('border-bottom-left-radius', zone_data[i].border_bottom_left);
			$('#' + id).find('#rotatable').css('border-bottom-right-radius', zone_data[i].border_bottom_right);
			$('#' + id).find('#kenuburn_effect').val(zone_data[i].img_kenburn_effect);
			$('#' + id).find('#pulse_effect').val(zone_data[i].img_pulse_effect);
			$('#' + id).find('#images_arr_str').val(zone_data[i].multiple_images_str);
			$('#' + id).find('#playlist_settings_json_str').val(zone_data[i].playlist_settings_json_str);
			apply_coords('#' + id);
		} else if (zone_data[i].img_name == 'text') {
			if (funct == 'undo') {
//				console.log('retrive_all_data_of_div:',funct);
				id = zone_data[i].div_id;
				div_name = id.split('_')[0];
				div_num = id.split('_')[1];
				create_text_div(zone_data[i].text_html, zone_data[i].img_z_index, zone_data[i].zone_name, zone_data[i].lock_zone_class, div_num, div_name, funct);
				$('#' + id).css('top', zone_data[i].text_top + 'px');
				$('#' + id).css('left', zone_data[i].text_left + 'px');
				$('#' + id).css('z-index', zone_data[i].img_z_index);
				deleted_zindex.push(zone_data[i].img_z_index);
//				$('.zoom4').css('opacity', '0.3');
//				$('.zoom3').css('opacity', '');
			} else if (funct == 'copy') {
				create_text_div(zone_data[i].text_html);
				id = $('.select_layer').attr('id');
				var left_new = parseInt($('#' + div_id).css('left'));
				var top_new = parseInt($('#' + div_id).css('top'));
				$('#' + id).css('top', top_new + 20);
				$('#' + id).css('left', left_new - 12);
				$('#' + id).css('z-index', parseInt(zone_data[i].img_z_index) + 1);
			} else {
				create_text_div(zone_data[i].text_html);
				id = $('.select_layer').attr('id');
				$('#' + id).css('top', y + 'px');
				$('#' + id).css('left', x + 'px');
			}

			$('#' + id).find('#rotatable').css('height', zone_data[i].text_height + 'px');
			$('#' + id).find('#rotatable').css('width', zone_data[i].text_width + 'px');
			$('#' + id).find('#rotatable').css('-moz-transform', zone_data[i].text_transform);
			$('#' + id).find('#rotatable').css('-webkit-transform', zone_data[i].text_transform);
			$('#' + id).find('#rotatable').css('color', zone_data[i].text_color);
			$('#' + id).find('#rotatable').css('font-family', zone_data[i].text_font_family);
			$('#' + id).find('#font_file').val(zone_data[i].text_font_file);
			$('#' + id).find('#rotatable').css('font-size', zone_data[i].text_font_size);
			$('#' + id).find('#rotatable').find("p").css('text-decoration', zone_data[i].text_decoration);
			$('#' + id).find('#rotatable').css('text-align', zone_data[i].text_align);
			$('#' + id).find('#rotatable').css('font-weight', zone_data[i].text_font_weight);
			$('#' + id).find('#rotatable').css('font-style', zone_data[i].text_font_style);
			$('#' + id).find('#rotatable').css('border-color', zone_data[i].text_border_color);
			$('#' + id).find('#rotatable').css('border-style', zone_data[i].text_border_style);
			$('#' + id).find('#rotatable').css('border-width', zone_data[i].text_border_width + 'px');
			$('#' + id).find('#b_color').val(zone_data[i].text_border_color);
			$('#' + id).find('#b_style').val(zone_data[i].text_border_style);
			$('#' + id).find('#b_width').val(zone_data[i].text_border_width);
			$('#' + id).find('#rotatable').css('background-color', zone_data[i].text_background_color);
			$('#' + id).find('#rotatable').css('padding', zone_data[i].text_padding);
			$('#' + id).find('#rotatable').css('line-height', zone_data[i].text_line_height);
			$('#' + id).find('#rotatable').css('text-shadow', zone_data[i].text_shadow);
			$('#' + id).find('#rotatable').css('border-top-right-radius', zone_data[i].border_top_right);
			$('#' + id).find('#rotatable').css('border-top-left-radius', zone_data[i].border_top_left);
			$('#' + id).find('#rotatable').css('border-bottom-left-radius', zone_data[i].border_bottom_left);
			$('#' + id).find('#rotatable').css('border-bottom-right-radius', zone_data[i].border_bottom_right);
			$('#' + id).find('#rotatable').find('p').css('word-wrap', 'break-word');
			if (funct == 'copy') {
				makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
			}
			apply_coords('#' + id);
		}
	}
	zone_data = [];
//	if(funct == 'undo'){
//		var large_z = get_largest_zindex();
//		var p = 0,m = 0,z = 0,d = 0;
//		
//		while(p <= large_z){  
//			for(m=0;m<images1.length;m++){
//				if(p == images1[m].img_z_index){
//					for(d=0;d<deleted_zindex.length;d++){
//						if(deleted_zindex[d] == images1[m].img_z_index){
//						   
//							$("#"+images1[m].div_id).css('z-index',++z);
//							z++;
//						}else{
//							$("#"+images1[m].div_id).css('z-index', z);
//							z++;
//						}
//					}				  
//					
//				}
//			}
//			p++;
//		}
//	}

//	var p2=0;
//	var large_z1 = $("#create_li_list li").length;
//	var images2 = get_all_zones();
//  
//	var liContents = [];
//	while(p2 <= large_z1){  
//		for(m=0;m<images2.length;m++){
//			if(p2 == images2[m].img_z_index){
//				var name = images2[m].div_id.split("div")[0];
//				var number = images2[m].div_id.split("div")[1];
//				liContents.push($("#"+name+"name"+number));
//			}
//		}
//		p2++;
//	}
//	liContents.sort(function (a, b) {
//		return (b - a);
//	});
//	for (i = 0; i < large_z1; i++) {
//		$("#create_li_list").append(liContents.pop());
//	}
//	onload();
}



//function undo_deleted_div() {
//	var funct = 'undo';
//	redo = 'redo';
//	retrive_all_data_of_div(funct);
//}
//
//function redo_deleted_div() {
////	if (redo == 'redo') {
//	for (var i = 0; i < allchecked_div_array.length; i++) {
//		delete_selectedzone_procedure(allchecked_div_array[i].lock_zone_class, allchecked_div_array[i].div_id, allchecked_div_array[i].zone_id, allchecked_div_array[i].funct);
//	}
////	}
//	redo = '';
//}
/*Clone of layer*/
function cloneof_selected_div() {
	zone_data = [];
	$('.dv_actv').each(function() {
		var zone_id = $(this).parent().attr('id');
		var lock_zone_class = $('#' + zone_id).find('.lock').attr('class');
		var name = $(this).parent().attr('id').split('name')[0];
		var number = $(this).parent().attr('id').split('name')[1];
		var div_id = $('#' + name + 'div' + number).attr('id');
		var funct = 'copy';

		delete_selectedzone_procedure(lock_zone_class, div_id, zone_id, funct);
		retrive_all_data_of_div(funct, div_id);
	});

}
/*Template preview*/
function show_template_preview() {
	$('#popup_background').fadeIn('slow');
	$('#preview_outer_div').fadeIn('slow');
	if ($("#fixedwidth").width() == original_width) {
		template_zoom_out();
		$("#zoom_out").unbind('click');
	}
	generate_preview('#preview_div');
}

function text_ticker_function(obj, direction_val, duration_val) {
	obj.marquee({
		direction: direction_val,
		duration: duration_val,
		gap: 100,
		duplicated: true
	})
}
function kenburns(images, element_height, element_width, image_div_int,speed_duration) {
	numberOfImages = images.length;
	for (i = 0; i < numberOfImages; i++) {
		var t = new Image();
		t.src = images[i].src;
		var width = t.width;
		var w = t.width;
		var height = t.height;
		var h = t.height;

		if (element_height < element_width) {
			if (width > height && (width < (element_width) || width >= (element_width))) {

				var new_h = (element_height + 200);
				var new_w1 = parseInt((w * (new_h)) / h);
				if (new_w1 <= element_width) {
					var new_w = (element_width + 200);
					//$(this).attr('width', new_w);
					images[i].width = new_w;
				} else {
					//console.log("in height");
					images[i].height = new_h;
				}

			} else if (width < height && height < (element_height) || height >= (element_height)) {
				new_w = (element_width + 200);
				images[i].width = new_w;

			} else if (width > height && height > element_height) {
				new_w = (element_width + 200);
				images[i].width = new_w;
			} else {
				new_w = (element_width + 200);
				images[i].width = new_w;
			}
		} else if (element_height > element_width) {
			if (width > height && (width < (element_width) || width >= (element_width))) {
				var new_h = (element_height + 200);
				images[i].height = new_h;
				//console.log("in height");
			} else if (width < height && (height < (element_height)) || height >= (element_height)) {

				new_w = (element_width + 200);
				var new_h1 = parseInt((new_w * h) / w);
				if (new_h1 <= element_height) {
					new_h = (element_height + 200);
					images[i].height = new_h;
					//console.log("in height");
				} else {
					images[i].width = new_w;
				}

			} else if (height > width) {
				new_h = (element_height + 200);
				images[i].height = new_h;
				//console.log("in height");
			} else {
				new_h = (element_height + 200);
				images[i].height = new_h;
				//console.log("in height");
			}
		} else {
			if (width > height && (width < (element_width) || width >= (element_width))) {
				var new_h = (element_height + 200);
				images[i].height = new_h;
			} else if (width < height && height < (element_height) || height >= (element_height)) {
				new_w = (element_width + 200);
				images[i].width = new_w;
			} else {
				new_h = (element_height + 200);
				images[i].height = new_h;
				//console.log("in height");
			}
		}
	}

	cnt_val[image_div_int] = Math.floor(Math.random() * (4 - 1 + 1) + 1);
	$('#slideshow_' + image_div_int).find("#img_" + cnt_val[image_div_int]).addClass("fx");
	window.setInterval(function() {
		var random_cnt = Math.floor(Math.random() * (4 - 1 + 1) + 1);
	 var playlist_cnt_val = [];
function generate_playlist(images, image_div_int, element_height, element_width) {
	playlist_image_id_cnt = 1;
	playlist_cnt_val[image_div_int] = 1;
	$('#playlistImages_' + image_div_int).find("#img_" + playlist_cnt_val[image_div_int]).css("display", "block");
	playlist_process(playlist_cnt_val[image_div_int]);
	function playlist_process(i) {
		delay_time = ($('#playlistImages_' + image_div_int).find("#img_" + i).attr("data-duration") * 1000);
		effect_val = $('#playlistImages_' + image_div_int).find("#img_" + i).attr("data-effect");
		$('#playlistImages_' + image_div_int).find("img").attr("class", "");

		if (effect_val == 'random') {
			effect_val = playlist_effect_arr[Math.floor(Math.random() * playlist_effect_arr.length)];
		}		
		$('#playlistImages_' + image_div_int).find("#img_" + i).addClass(effect_val)
				.fadeIn(300)
				.delay(delay_time)
				.fadeOut(300, function () {
					nos_img = $('#playlistImages_' + image_div_int).find("img").length;
					$('#playlistImages_' + image_div_int).find("img").removeClass(effect_val);
					if (playlist_cnt_val[image_div_int] < nos_img) {
						playlist_cnt_val[image_div_int]++;
					} else {
						playlist_cnt_val[image_div_int] = 1;
					}
					playlist_process(playlist_cnt_val[image_div_int]);
				});
	}
}   while (random_cnt == cnt_val[image_div_int]) {
			random_cnt = Math.floor(Math.random() * (4 - 1 + 1) + 1);
		}
		cnt_val[image_div_int] = random_cnt;
		kenBurns_process(cnt_val[image_div_int]);
	}, speed_duration);

	function kenBurns_process(i) {
		console.log("i=" + i);
		$('#slideshow_' + image_div_int).find('img').removeClass("fx");
		$('#slideshow_' + image_div_int).find("#img_" + i).addClass("fx");
	}

}

var playlist_cnt_val = [];
function generate_playlist(images, image_div_int, element_height, element_width) {
	playlist_image_id_cnt = 1;
	playlist_cnt_val[image_div_int] = 1;
	$('#playlistImages_' + image_div_int).find("#img_" + playlist_cnt_val[image_div_int]).css("display", "block");
	playlist_process(playlist_cnt_val[image_div_int]);
	function playlist_process(i) {
		delay_time = ($('#playlistImages_' + image_div_int).find("#img_" + i).attr("data-duration") * 1000);
		effect_val = $('#playlistImages_' + image_div_int).find("#img_" + i).attr("data-effect");
		$('#playlistImages_' + image_div_int).find("img").attr("class", "");

		if (effect_val == 'random') {
			effect_val = playlist_effect_arr[Math.floor(Math.random() * playlist_effect_arr.length)];
		}		
		$('#playlistImages_' + image_div_int).find("#img_" + i).addClass(effect_val)
				.fadeIn(300)
				.delay(delay_time)
				.fadeOut(300, function () {
					nos_img = $('#playlistImages_' + image_div_int).find("img").length;
					$('#playlistImages_' + image_div_int).find("img").removeClass(effect_val);
					if (playlist_cnt_val[image_div_int] < nos_img) {
						playlist_cnt_val[image_div_int]++;
					} else {
						playlist_cnt_val[image_div_int] = 1;
					}
					playlist_process(playlist_cnt_val[image_div_int]);
				});
	}
}

/*Ruler*/
function set_ruler() {
	var set_ruler_val = $("#set_ruler").val();
	console.log('set_ruler_val', set_ruler_val);
	if (set_ruler_val == '0') {
		$("#set_ruler").val('1');
		$(".grid_btn").addClass('grid_btn_active');
		$('.select_layer').each(function() {
			var id = this.id;
			var width = $(this).width();
			var height = $(this).height();
			var x_axis = $(this).position().left;
			var y_axis = $(this).position().top;
			var padding = $(this).css('padding-top').replace('px', '');
			element_ruler('#' + id, x_axis, y_axis, width, height, padding, 'on');
		});
	} else {
		new_val = '0';
		$("#set_ruler").val('0');
		$(".grid_btn").removeClass('grid_btn_active');
		$('.ruler_top').remove();
		$('.ruler_left').remove();
	}
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
/*Discard data*/
function discard_all() {
	console.log('discard arr..............', undo_array);
	$('.ruler_top').remove();
	$('.ruler_left').remove();
	if ($("#fixedwidth").width() == original_width) {
		template_zoom_out();
		$("#zoom_out").unbind('click');
	}
	old_id = null;
	$('#fixedwidth').html('');
	$('#create_li_list').html('');
	fill_data();
	$("#zoom_in").unbind('click');
}
/*Template zoom in mod*/
function template_zoom_in() {

	if (original_height != $("#fixedwidth").height() && original_width != $("#fixedwidth").width()) {
		$("#fixedwidth").parent().css('overflow', 'auto');
		if (original_width >= '1024') {
			$(".outer_fixedwidth").css('width', '1024px');
			$("#fixedwidth").css('width', original_width + 'px');
		} else {
			$(".outer_fixedwidth").css('width', original_width + 'px');
			$("#fixedwidth").css('width', original_width + 'px');
		}
		$('.editor_screen').height('');
		$('.editor_screen').css('overflow-y', '');

		$("#fixedwidth").css('height', original_height + 'px');
		if (original_height >= '576') {
			$(".outer_fixedwidth").css('height', '576px');
		} else {
			$(".outer_fixedwidth").css('height', original_height + 'px');
		}
	}
	browser_check();
	$(".text_div").each(function() {
		if (isOpera) {
			var transform = $(this).find('#rotatable').css('-o-transform');
			$(this).find('#rotatable').css('-o-transform', 'matrix(1,0,0,1,0,0)');
		} else if (isFirefox) {
			transform = $(this).find('#rotatable').css('-moz-transform');
			$(this).find('#rotatable').css('-moz-transform', 'matrix(1,0,0,1,0,0)');
		} else if (isChrome || isSafari) {
			transform = $(this).find('#rotatable').css('-webkit-transform');
			$(this).find('#rotatable').css('-webkit-transform', 'matrix(1,0,0,1,0,0)');
		}
		var line_height = Math.round(($(this).find('#rotatable').css('line-height').replace("px", "")) * (original_width / template_width));
		var new_height = Math.round(($(this).find('#rotatable').height()) * (original_width / template_width));
		var new_width = Math.round(($(this).find('#rotatable').width()) * (original_width / template_width));
		var new_top = Math.round(($(this).position().top) * (original_width / template_width));
		var new_left = Math.round(($(this).position().left) * (original_width / template_width));

		if ($(this).find('#b_width').val() && $(this).find('#b_width').val() != undefined) {
			var border_width = $(this).find('#b_width').val();
			var new_border_width = Math.round((border_width) * (original_width / template_width));
		} else {
			new_border_width = "0";
		}
		$(this).find('#b_width').val(new_border_width);
		var shadow = $(this).find('#rotatable').css('text-shadow');
		var shadow1 = shadow.split(')');
		var sh = shadow1[1];
		var shadow_color = shadow1[0] + ')';

		if (shadow1[1]) {
			var shadow2 = shadow1[1].split(' ');
			var shadow_x = (shadow2[1].replace("px", "")) * (original_width / template_width);
			var shadow_y = (shadow2[2].replace("px", "")) * (original_width / template_width);
			var shadow_blur = (shadow2[3].replace("px", "")) * (original_width / template_width);
		}
		var font_size = $(this).find('#rotatable').css('font-size').replace('px', '');
		var new_font_size = Math.round((font_size) * (original_width / template_width));
		var new_padding = Math.round(($(this).find('#rotatable').css('padding-top').replace('px', '')) * (original_width / template_width));


		var border_top_right1 = parseInt($(this).find('#rotatable').css('border-top-right-radius').replace('px', ''));
		var border_top_left1 = parseInt($(this).find('#rotatable').css('border-top-left-radius').replace('px', ''));
		var border_bottom_left1 = parseInt($(this).find('#rotatable').css('border-bottom-left-radius').replace('px', ''));
		var border_bottom_right1 = parseInt($(this).find('#rotatable').css('border-bottom-right-radius').replace('px', ''));
		var new_top_right1 = Math.round(border_top_right1 * (original_width / template_width));
		var new_top_left1 = Math.round(border_top_left1 * (original_width / template_width));
		var new_bottom_left1 = Math.round(border_bottom_left1 * (original_width / template_width));
		var new_bottom_right1 = Math.round(border_bottom_right1 * (original_width / template_width));
		$(this).find('#ol_list').css('margin-left', '20px');
		$(this).find('#ul_list').css('margin-left', '20px');
		$(this).find('#rotatable').height(new_height);
		$(this).find('#rotatable').width(new_width);
		$(this).css("top", new_top);
		$(this).css("left", new_left);
		$(this).find('#rotatable').css("border-width", new_border_width);
		$(this).find('#rotatable').css("font-size", new_font_size);
		$(this).find('#rotatable').css("padding", new_padding + 'px');
		$(this).find('#rotatable').css("line-height", line_height + "px");
		$(this).find('#rotatable').css('border-top-right-radius', new_top_right1 + 'px');
		$(this).find('#rotatable').css('border-top-left-radius', new_top_left1 + 'px');
		$(this).find('#rotatable').css('border-bottom-left-radius', new_bottom_left1 + 'px');
		$(this).find('#rotatable').css('border-bottom-right-radius', new_bottom_right1 + 'px');
		if (isOpera) {
			$(this).find('#rotatable').css('-o-transform', transform);
		} else if (isFirefox) {
			$(this).find('#rotatable').css('-moz-transform', transform);
		} else if (isChrome || isSafari) {
			$(this).find('#rotatable').css('-webkit-transform', transform);
		}
		$(this).find('#rotatable').css("text-shadow", shadow_x + 'px' + ' ' + shadow_y + 'px' + ' ' + shadow_blur + 'px' + ' ' + shadow_color);

	});
	$(".image_div").each(function() {
		if (isOpera) {
			var transform = $(this).find('#rotatable').css('-o-transform');
			$(this).find('#rotatable').css('-o-transform', 'matrix(1,0,0,1,0,0)');
		} else if (isFirefox) {
			transform = $(this).find('#rotatable').css('-moz-transform');
			$(this).find('#rotatable').css('-moz-transform', 'matrix(1,0,0,1,0,0)');
		} else if (isChrome || isSafari) {
			transform = $(this).find('#rotatable').css('-webkit-transform');
			$(this).find('#rotatable').css('-webkit-transform', 'matrix(1,0,0,1,0,0)');
		}

		var new_height = Math.round(($(this).find('#rotatable').height()) * (original_width / template_width));
		var new_width = Math.round(($(this).find('#rotatable').width()) * (original_width / template_width));
		var new_top = Math.round(($(this).position().top) * (original_width / template_width));
		var new_left = Math.round(($(this).position().left) * (original_width / template_width));
		if ($(this).find('#b_width').val() && $(this).find('#b_width').val() != undefined) {
			var border_width = $(this).find('#b_width').val();
			var new_border_width = Math.round(parseInt(border_width) * (original_width / template_width));
		} else {
			new_border_width = "0";
		}
		$(this).find('#b_width').val(new_border_width);
		var font_size = $(this).find('#rotatable').css('font-size').replace('px', '');
		var new_font_size = Math.round((font_size) * (original_width / template_width));
		var new_padding = Math.round(($(this).find('#rotatable').css('padding-top').replace("px", "")) * (original_width / template_width));

		var shadow = $(this).find('#rotatable').css('box-shadow');
		var shadow1 = shadow.split(')');
		var shadow_color = shadow1[0] + ')';

		if (shadow1[1]) {
			var shadow2 = shadow1[1].split(' ');
			var shadow_x = (shadow2[1].replace("px", "")) * (original_width / template_width);
			var shadow_y = (shadow2[2].replace("px", "")) * (original_width / template_width);
			var shadow_blur = (shadow2[3].replace("px", "")) * (original_width / template_width);
		}

		var border_top_right1 = parseInt($(this).find('#rotatable').css('border-top-right-radius').replace('px', ''));
		var border_top_left1 = parseInt($(this).find('#rotatable').css('border-top-left-radius').replace('px', ''));
		var border_bottom_left1 = parseInt($(this).find('#rotatable').css('border-bottom-left-radius').replace('px', ''));
		var border_bottom_right1 = parseInt($(this).find('#rotatable').css('border-bottom-right-radius').replace('px', ''));
		var new_top_right1 = Math.round(border_top_right1 * (original_width / template_width));
		var new_top_left1 = Math.round(border_top_left1 * (original_width / template_width));
		var new_bottom_left1 = Math.round(border_bottom_left1 * (original_width / template_width));
		var new_bottom_right1 = Math.round(border_bottom_right1 * (original_width / template_width));
		$(this).find('#rotatable').height(new_height);
		$(this).find('#rotatable').width(new_width);
		$(this).css("top", new_top);
		$(this).css("left", new_left);
		$(this).find('#rotatable').css("border-width", new_border_width);
		$(this).find('#rotatable').css("font-size", new_font_size);
		$(this).find('#rotatable').css("padding", new_padding + "px");
		$(this).find('#rotatable').css('border-top-right-radius', new_top_right1 + 'px');
		$(this).find('#rotatable').css('border-top-left-radius', new_top_left1 + 'px');
		$(this).find('#rotatable').css('border-bottom-left-radius', new_bottom_left1 + 'px');
		$(this).find('#rotatable').css('border-bottom-right-radius', new_bottom_right1 + 'px');
		$(this).find('.inner_div').css('border-top-right-radius', new_top_right1 + 'px');
		$(this).find('.inner_div').css('border-top-left-radius', new_top_left1 + 'px');
		$(this).find('.inner_div').css('border-bottom-left-radius', new_bottom_left1 + 'px');
		$(this).find('.inner_div').css('border-bottom-right-radius', new_bottom_right1 + 'px');
		if (isOpera) {
			$(this).find('#rotatable').css('-o-transform', transform);
		} else if (isFirefox) {
			$(this).find('#rotatable').css('-moz-transform', transform);
		} else if (isChrome || isSafari) {
			$(this).find('#rotatable').css('-webkit-transform', transform);
		}
		$(this).find('#rotatable').css("box-shadow", Math.round(shadow_x) + 'px' + ' ' + Math.round(shadow_y) + 'px' + ' ' + Math.round(shadow_blur) + 'px' + ' ' + shadow_color);

	});

	remove_all_selected_layers();
	$("#zoom_out").bind('click', function() {
		template_zoom_out();
		$("#zoom_out").unbind('click');
	});
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
/* Template zoom out mod */
function template_zoom_out() {
	$("#fixedwidth").parent().css('overflow', '');
	if (original_height > original_width) {
		$('.editor_screen').height('576');
		$('.editor_screen').css('overflow-y', 'scroll');
	}
	$(".outer_fixedwidth").css('height', template_height + 'px');
	$(".outer_fixedwidth").css('width', template_width + 'px');
	$("#fixedwidth").css('height', template_height + 'px');
	$("#fixedwidth").css('width', template_width + 'px');
	browser_check();
	$(".text_div").each(function() {
		if (isOpera) {
			var transform = $(this).find('#rotatable').css('-o-transform');
			$(this).find('#rotatable').css('-o-transform', 'matrix(1,0,0,1,0,0)');
		} else if (isFirefox) {
			transform = $(this).find('#rotatable').css('-moz-transform');
			$(this).find('#rotatable').css('-moz-transform', 'matrix(1,0,0,1,0,0)');
		} else if (isChrome || isSafari) {
			transform = $(this).find('#rotatable').css('-webkit-transform');
			$(this).find('#rotatable').css('-webkit-transform', 'matrix(1,0,0,1,0,0)');
		}
		var line_height = Math.round(($(this).find('#rotatable').css('line-height').replace("px", "")) / (original_width / template_width));
		var new_height = Math.round(($(this).find('#rotatable').height()) / (original_width / template_width));
		var new_width = Math.round(($(this).find('#rotatable').width()) / (original_width / template_width));
		var new_top = Math.round(($(this).position().top) / (original_width / template_width));
		var new_left = Math.round(($(this).position().left) / (original_width / template_width));
		if ($(this).find('#b_width').val() && $(this).find('#b_width').val() != undefined) {
			var border_width = $(this).find('#b_width').val();
			var new_border_width = Math.round((border_width) / (original_width / template_width));
		} else {
			new_border_width = "0";
		}
		$(this).find('#b_width').val(new_border_width);
		var shadow = $(this).find('#rotatable').css('text-shadow');
		var shadow1 = shadow.split(')');
		var shadow_color = shadow1[0] + ')';

		if (shadow1[1]) {
			var shadow2 = shadow1[1].split(' ');
			var shadow_x = (shadow2[1].replace("px", "")) / (original_width / template_width);
			var shadow_y = (shadow2[2].replace("px", "")) / (original_width / template_width);
			var shadow_blur = (shadow2[3].replace("px", "")) / (original_width / template_width);
		}
		var font_size = $(this).find('#rotatable').css('font-size').replace('px', '');
		var new_font_size = Math.round((font_size) / (original_width / template_width));
		var new_padding = Math.round(($(this).find('#rotatable').css('padding-top').replace("px", "")) / (original_width / template_width));

		var border_top_right2 = parseInt($(this).find('#rotatable').css('border-top-right-radius').replace('px', ''));
		var border_top_left2 = parseInt($(this).find('#rotatable').css('border-top-left-radius').replace('px', ''));
		var border_bottom_left2 = parseInt($(this).find('#rotatable').css('border-bottom-left-radius').replace('px', ''));
		var border_bottom_right2 = parseInt($(this).find('#rotatable').css('border-bottom-right-radius').replace('px', ''));
		var new_top_right = Math.round(border_top_right2 / (original_width / template_width));
		var new_top_left = Math.round(border_top_left2 / (original_width / template_width));
		var new_bottom_left = Math.round(border_bottom_left2 / (original_width / template_width));
		var new_bottom_right = Math.round(border_bottom_right2 / (original_width / template_width));

		$(this).find('#ol_list').removeAttr('style');
		$(this).find('#ul_list').removeAttr('style');

		$(this).find('#rotatable').css("line-height", line_height + 'px');
		$(this).find('#rotatable').height(new_height);
		$(this).find('#rotatable').width(new_width);
		$(this).css("top", new_top);
		$(this).css("left", new_left);
		$(this).find('#rotatable').css("border-width", new_border_width);
		$(this).find('#rotatable').css("font-size", new_font_size);
		$(this).find('#rotatable').css("padding", new_padding + "px");
		$(this).find('#rotatable').css('border-top-right-radius', new_top_right + 'px');
		$(this).find('#rotatable').css('border-top-left-radius', new_top_left + 'px');
		$(this).find('#rotatable').css('border-bottom-left-radius', new_bottom_left + 'px');
		$(this).find('#rotatable').css('border-bottom-right-radius', new_bottom_right + 'px');
		if (isOpera) {
			$(this).find('#rotatable').css('-o-transform', transform);
		} else if (isFirefox) {
			$(this).find('#rotatable').css('-moz-transform', transform);
		} else if (isChrome || isSafari) {
			$(this).find('#rotatable').css('-webkit-transform', transform);
		}
		$(this).find('#rotatable').css("text-shadow", shadow_x + 'px' + ' ' + shadow_y + 'px' + ' ' + shadow_blur + 'px' + ' ' + shadow_color);

	});

	$(".image_div").each(function() {
		if (isOpera) {
			var transform = $(this).find('#rotatable').css('-o-transform');
			$(this).find('#rotatable').css('-o-transform', 'matrix(1,0,0,1,0,0)');
		} else if (isFirefox) {
			transform = $(this).find('#rotatable').css('-moz-transform');
			$(this).find('#rotatable').css('-moz-transform', 'matrix(1,0,0,1,0,0)');
		} else if (isChrome || isSafari) {
			transform = $(this).find('#rotatable').css('-webkit-transform');
			$(this).find('#rotatable').css('-webkit-transform', 'matrix(1,0,0,1,0,0)');
		}
		var new_height = Math.round(($(this).find('#rotatable').height()) / (original_width / template_width));
		var new_width = Math.round(($(this).find('#rotatable').width()) / (original_width / template_width));
		var new_top = Math.round(($(this).position().top) / (original_width / template_width));
		var new_left = Math.round(($(this).position().left) / (original_width / template_width));
		if ($(this).find('#b_width').val()) {
			var border_width = $(this).find('#b_width').val();
			var new_border_width = Math.round((border_width) / (original_width / template_width));
		} else {
			new_border_width = "0";
		}
		$(this).find('#b_width').val(new_border_width);
		var font_size = $(this).find('#rotatable').css('font-size').replace('px', '');
		var new_font_size = Math.round((font_size) / (original_width / template_width));
		var new_padding = Math.round(($(this).find('#rotatable').css('padding-top').replace('px', '')) / (original_width / template_width));

		var shadow = $(this).find('#rotatable').css('box-shadow');
		if (shadow != 'none') {
			var shadow1 = shadow.split(')');
			var shadow_color = shadow1[0] + ')';
			var shadow2 = shadow1[1].split(' ');
			var shadow_x = (shadow2[1].replace("px", "")) / (original_width / template_width);
			var shadow_y = (shadow2[2].replace("px", "")) / (original_width / template_width);
			var shadow_blur = (shadow2[3].replace("px", "")) / (original_width / template_width);
		}

		var border_top_right2 = parseInt($(this).find('#rotatable').css('border-top-right-radius').replace('px', ''));
		var border_top_left2 = parseInt($(this).find('#rotatable').css('border-top-left-radius').replace('px', ''));
		var border_bottom_left2 = parseInt($(this).find('#rotatable').css('border-bottom-left-radius').replace('px', ''));
		var border_bottom_right2 = parseInt($(this).find('#rotatable').css('border-bottom-right-radius').replace('px', ''));
		var new_top_right = Math.round(border_top_right2 / (original_width / template_width));
		var new_top_left = Math.round(border_top_left2 / (original_width / template_width));
		var new_bottom_left = Math.round(border_bottom_left2 / (original_width / template_width));
		var new_bottom_right = Math.round(border_bottom_right2 / (original_width / template_width));
		$(this).find('#rotatable').height(new_height);
		$(this).find('#rotatable').width(new_width);
		$(this).css("top", new_top);
		$(this).css("left", new_left);
		$(this).find('#rotatable').css("border-width", new_border_width);
		$(this).find('#rotatable').css("font-size", new_font_size);
		$(this).find('#rotatable').css("padding", new_padding + "px");
		$(this).find('#rotatable').css('border-top-right-radius', new_top_right + 'px');
		$(this).find('#rotatable').css('border-top-left-radius', new_top_left + 'px');
		$(this).find('#rotatable').css('border-bottom-left-radius', new_bottom_left + 'px');
		$(this).find('#rotatable').css('border-bottom-right-radius', new_bottom_right + 'px');
		$(this).find('.inner_div').css('border-top-right-radius', new_top_right + 'px');
		$(this).find('.inner_div').css('border-top-left-radius', new_top_left + 'px');
		$(this).find('.inner_div').css('border-bottom-left-radius', new_bottom_left + 'px');
		$(this).find('.inner_div').css('border-bottom-right-radius', new_bottom_right + 'px');
		if (isOpera) {
			$(this).find('#rotatable').css('-o-transform', transform);
		} else if (isFirefox) {
			$(this).find('#rotatable').css('-moz-transform', transform);
		} else if (isChrome || isSafari) {
			$(this).find('#rotatable').css('-webkit-transform', transform);
		}
		$(this).find('#rotatable').css("box-shadow", Math.round(shadow_x) + 'px' + ' ' + Math.round(shadow_y) + 'px' + ' ' + Math.round(shadow_blur) + 'px' + ' ' + shadow_color);
	});

	remove_all_selected_layers();
	$("#zoom_in").bind('click', function() {
		template_zoom_in();
		$("#zoom_in").unbind('click');
	});
	makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
}
// ************** New Unod Redo Functionality ********************/

//function store_data_for_undo(div_id, activity_name, activity_value) {
//	var undo_json = {};
//	undo_json.activity = activity_name;
//	undo_json.div_id = div_id;
//	if (activity_name == 'create_text' || activity_name == 'create_image' || activity_name == 'delete_text') {
//		browser_check();
//		var $div_id = $("#" + div_id);
//		if (isOpera) {
//			var transform = $div_id.find('#rotatable').css('-o-transform');
//		} else if (isFirefox) {
//			transform = $div_id.find('#rotatable').css('-moz-transform');
//		} else if (isChrome || isSafari) {
//			transform = $div_id.find('#rotatable').css('-webkit-transform');
//		}
////	console.log($div_id);
//		var id = div_id;
//		var div_num = id.split('_')[1];
//		if ($div_id.hasClass('image_div')) {
//			var zone_id = 'imagename_' + div_num;
//			var lock_zone_class = $('#' + zone_id).find('.lock').attr('class');
//			var zone_name = $('#' + zone_id).find('.redapple').text();
//			var undo_zone_data = {
//				img_name: 'image',
//				zone_top: $div_id.position().top,
//				zone_left: $div_id.position().left,
//				zone_height: $div_id.find('#rotatable').height(),
//				zone_width: $div_id.find('#rotatable').width(),
//				img_background_image: $div_id.find('.inner_div').css('background-image'),
//				zone_transform: transform,
//				zone_border_color: $div_id.find('#b_color').val(),
//				zone_border_style: $div_id.find('#b_style').val(),
//				zone_border_width: $div_id.find('#b_width').val(),
//				zone_background_color: $div_id.find('#rotatable').css('background-color'),
//				zone_z_index: $div_id.css('z-index'),
//				zone_padding: $div_id.find('#rotatable').css('padding-top'),
//				zone_opacity: $div_id.find('.inner_div').css('opacity'),
//				zone_shadow: $div_id.find('#rotatable').css('box-shadow'),
//				zone_name: zone_name,
//				lock_zone_class: lock_zone_class,
//				div_id: div_id,
//				border_top_right: $div_id.find('#rotatable').css('border-top-right-radius'),
//				border_top_left: $div_id.find('#rotatable').css('border-top-left-radius'),
//				border_bottom_left: $div_id.find('#rotatable').css('border-bottom-left-radius'),
//				border_bottom_right: $div_id.find('#rotatable').css('border-bottom-right-radius')
//			};
//		}
//		if ($div_id.hasClass('text_div')) {
//			var zone_id = 'textname_' + div_num;
//			var lock_zone_class = $('#' + zone_id).find('.lock').attr('class');
//			var zone_name = $('#' + zone_id).find('.redapple').text();
//			var undo_zone_data = {
//				img_name: 'text',
//				zone_top: $div_id.position().top,
//				zone_left: $div_id.position().left,
//				zone_height: $div_id.find('#rotatable').height(),
//				zone_width: $div_id.find('#rotatable').width(),
//				text_html: $div_id.find('#rotatable').find("p").html(),
//				zone_transform: transform,
//				text_color: $div_id.find('#rotatable').css('color'),
//				text_font_family: $div_id.find('#rotatable').css('font-family'),
//				text_font_size: $div_id.find('#rotatable').css('font-size'),
//				text_decoration: $div_id.find('#rotatable').css('text-decoration'),
//				text_align: $div_id.find('#rotatable').css('text-align'),
//				text_font_weight: $div_id.find('#rotatable').css('font-weight'),
//				text_font_style: $div_id.find('#rotatable').css('font-style'),
//				zone_border_color: $div_id.find('#b_color').val(),
//				zone_border_style: $div_id.find('#b_style').val(),
//				zone_border_width: $div_id.find('#b_width').val(),
//				zone_padding: $div_id.find('#rotatable').css('padding-top'),
//				zone_background_color: $div_id.find('#rotatable').css('background-color'),
//				zone_z_index: $div_id.css('z-index'),
//				zone_name: $.trim(zone_name),
//				text_line_height: $div_id.find('#rotatable').css("line-height"),
//				lock_zone_class: lock_zone_class,
//				div_id: div_id,
//				zone_shadow: $div_id.find('#rotatable').css('text-shadow'),
//				border_top_right: $div_id.find('#rotatable').css('border-top-right-radius'),
//				border_top_left: $div_id.find('#rotatable').css('border-top-left-radius'),
//				border_bottom_left: $div_id.find('#rotatable').css('border-bottom-left-radius'),
//				border_bottom_right: $div_id.find('#rotatable').css('border-bottom-right-radius')
//			};
////		console.log('text-alignment',$div_id.find('#rotatable').css('text-align'));
//		}
//		undo_json.zone_data = undo_zone_data;
//	} else if (activity_name == 'text_alignment') {
//		undo_json.activity_value = activity_value;
//	}
////	console.log('json........',undo_json);
//	undo_array.push(undo_json);
////	if(undo_array.length > 5){
////		undo_array.shift();
////	}
////	console.log('store arr..............', undo_array);
//}

//function get_stored_undo_data(div_id, activity) {
//	var index = -1;
//	var json;
//	for (var i = 0; i < undo_array.length; i++) {
//		json = undo_array[i];
////		console.log('json',json);
//		if (json.div_id === div_id && json.activity === activity) {
//			index = i;
//		}
//	}
//	if (index !== -1) {
//		undo_array.splice(index, 1);
//	}
//	return json;
//}
//
//function restore_undo_data(div_data) {
//	console.log(div_data);
//	if (div_data.activity == 'create_text' || div_data.activity == 'delete_text' || div_data.activity == 'delete_image' || div_data.activity == 'create_image') {
//		var zone_data = div_data.zone_data;
//		var id = div_data.div_id;
//		var div_name = id.split('_')[0];
//		var div_num = id.split('_')[1];
//		if (zone_data != undefined) {
//			if (zone_data.img_name == 'text') {
//				if (div_data.activity == 'create_text') {
//					create_text_div(zone_data.text_html, zone_data.zone_z_index, zone_data.zone_name, zone_data.lock_zone_class, div_num, div_name, 'undo');
//
//					$('#' + id).find('#rotatable').css('color', zone_data.text_color);
//					$('#' + id).find('#rotatable').css('font-family', zone_data.text_font_family);
//					$('#' + id).find('#rotatable').css('font-size', zone_data.text_font_size);
//					$('#' + id).find('#rotatable').css('text-decoration', zone_data.text_decoration);
//					$('#' + id).find('#rotatable').css('text-align', zone_data.text_align);
//					$('#' + id).find('#rotatable').css('font-weight', zone_data.text_font_weight);
//					$('#' + id).find('#rotatable').css('font-style', zone_data.text_font_style);
//					$('#' + id).find('#rotatable').css('line-height', zone_data.text_line_height);
//				}
//			}
//			if (zone_data.img_name == 'image') {
//				if (div_data.activity == 'create_image') {
//					create_image_div(zone_data.zone_z_index, zone_data.zone_name, zone_data.lock_zone_class, div_num, zone_data.img_background_image, div_name, 'undo');
//					$('#' + id).find('.inner_div').css('background-image', zone_data.img_background_image);
//				}
//			}
//			$('#' + id).css('top', zone_data.zone_top + 'px');
//			$('#' + id).css('left', zone_data.zone_left + 'px');
//			$('#' + id).css('z-index', zone_data.zone_z_index);
//			$('#' + id).find('#rotatable').css('height', zone_data.zone_height + 'px');
//			$('#' + id).find('#rotatable').css('width', zone_data.zone_width + 'px');
//			$('#' + id).find('#rotatable').css('-moz-transform', zone_data.zone_transform);
//			$('#' + id).find('#rotatable').css('-webkit-transform', zone_data.zone_transform);
//			$('#' + id).find('#rotatable').css('border-color', zone_data.zone_border_color);
//			$('#' + id).find('#rotatable').css('border-style', zone_data.zone_border_style);
//			$('#' + id).find('#rotatable').css('border-width', zone_data.zone_border_width + 'px');
//			$('#' + id).find('#b_color').val(zone_data.zone_border_color);
//			$('#' + id).find('#b_style').val(zone_data.zone_border_style);
//			$('#' + id).find('#b_width').val(zone_data.zone_border_width);
//			$('#' + id).find('#rotatable').css('background-color', zone_data.zone_background_color);
//			$('#' + id).find('#rotatable').css('padding', zone_data.zone_padding);
//			$('#' + id).find('#rotatable').css('border-top-right-radius', zone_data.border_top_right);
//			$('#' + id).find('#rotatable').css('border-top-left-radius', zone_data.border_top_left);
//			$('#' + id).find('#rotatable').css('border-bottom-left-radius', zone_data.border_bottom_left);
//			$('#' + id).find('#rotatable').css('border-bottom-right-radius', zone_data.border_bottom_right);
//			$('#' + id).find('#rotatable').css('text-shadow', zone_data.zone_shadow);
//			$('#' + id).find('#rotatable').find('p').css('word-wrap', 'break-word');
//		}
//	} else if (div_data.activity == 'text_alignment') {
//		var value = div_data.activity_value;
//		set_text_alignment(value);
//	}
//}

function undo_div() {
	undoHistory();
	updateUndo_RedoUI();
}

function redo_div() {
	redoHistory();
	updateUndo_RedoUI();
}

function updateUndo_RedoUI() {
//	alert(history_counter);
	if (history_counter !== 0) {
		$('#btnUndo').attr('onclick', "undo_div();");
		$('#btnUndo').css('opacity', '1');
	} else {
		$('#btnUndo').attr('onclick', "");
		$('#btnUndo').css('opacity', '0.3');
	}
	if (history_counter < (history_array.length - 1)) {
		$('#btnRedo').attr('onclick', "redo_div();");
		$('#btnRedo').css('opacity', '1');
	} else {
		$('#btnRedo').attr('onclick', "");
		$('#btnRedo').css('opacity', '0.3');
	}
}
function makeHistory_Array(html_data, list_data) {
	history_counter++;
	if (history_counter < history_array.length) {
		history_array.length = history_counter;
	}
//	undo_array.push(history_counter);
	var json = {};
	json.html_data = html_data;
	json.list_data = list_data;
	history_array.push(json);
	updateUndo_RedoUI();
//	console.log('h arr ....',history_array);
	if (history_array.length > 5) {
//		console.log('length > 5');
		history_array.shift();
		history_counter = history_array.length - 1;
		history_array = history_array.filter(function() {
			return true;
		});
		// set the current index to the end		
//		history_counter--;
	}
//	console.log(undo_array);
}

function undoHistory() {
	if (history_counter > 0) {
//		if(undo_click == false){
//			history_counter = history_counter - 2;		
//		}else {
		history_counter--;
//		}
//		   console.log(history_array.length);
//		   console.log(history_counter);
		var html_data = history_array[history_counter].html_data;
		var list_data = history_array[history_counter].list_data;
		$('.fixedwidth').html(html_data);
		$('#create_li_list').html(list_data);
		init_functionality();
//		undo_click = true;
//		common_disable_properties(null);
	}
//	if(history_counter == 0){
//		history_counter = history_array.length;
//	}
//	console.log('undo_array',undo_array);
}

function redoHistory() {
//	console.log('history_counter',history_counter);
//	console.log('history_array',history_array.length);
	if (history_counter < history_array.length - 1) {
		history_counter++;
		var html_data = history_array[history_counter].html_data;
		var list_data = history_array[history_counter].list_data;
		$('.fixedwidth').html(html_data);
		$('#create_li_list').html(list_data);
		init_functionality();
	}
}

function init_functionality() {
	$(".image_div, .text_div").draggable({
		drag: function(e, ui) {
			set_position_select_layer(ui.position.left, ui.position.top);
			create_error_select_layer_outof_range(this, ui.position.left, ui.position.top, '', 'click');
		}
	});
	$('#create_li_list').sortable({
		handle: '.dots',
		items: "li:not(.ui-state-disabled)",
		containment: 'parent',
		stop: function() {
			var zindex = $('#create_li_list li').length;
			$("#create_li_list li").each(function() {
				var name = this.id.split('name')[0];
				var number = this.id.split('name')[1];
				if (name == 'image') {
					$('#' + name + 'div' + number).css('z-index', --zindex);
				} else {
					$('#' + name + 'div' + number).css('z-index', --zindex);
				}
			});
		}
	});
	onload();
	editable_zone_name();
	layer_list_show_over_tipsy();
}
