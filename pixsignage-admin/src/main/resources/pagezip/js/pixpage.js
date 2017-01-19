function show() {
	console.log($('#PageDiv').width(), $('#PageDiv').height());
	var width = $('#PageDiv').width();
	if (Page.width > Page.height) {
		var scale = width / 1024;
	} else {
		var scale = width / 576;
	}
	$('#PageDiv').html('');

	for (m = 0; m < Page.pagezones.length; m++) {
		var pagezone = Page.pagezones[m];
		if (pagezone.status == '1') {
			if (pagezone.type == '1') {
				var imagediv = document.createElement('div');
				imagediv.className = "image_html";
				imagediv.id = "imagehtml_" + m;
				var inner_image_div = document.createElement('div');
				inner_image_div.className = "inner_div";
				$(imagediv).append(inner_image_div);
				$('#PageDiv').append(imagediv);

				$(imagediv).css('top', (parseInt(pagezone.topoffset) * scale) + 'px');
				$(imagediv).css('left', (parseInt(pagezone.leftoffset) * scale) + 'px');
				$(imagediv).css('height', (parseInt(pagezone.height) * scale) + 'px');
				$(imagediv).css('width', (parseInt(pagezone.width) * scale) + 'px');
				$(imagediv).css('-moz-transform', pagezone.transform);
				$(imagediv).css('-webkit-transform', pagezone.transform);
				if (pagezone.content != '' && pagezone.content != 'no' && pagezone.content != 'non') {
					$(imagediv).find('.inner_div').css('background-image', 'url(' + pagezone.content + ')');
				}
				$(imagediv).css('border-color', pagezone.bdcolor);
				$(imagediv).css('border-style', pagezone.bdstyle);
				$(imagediv).css('border-width', (parseInt(pagezone.bdwidth) * scale) + 'px');
				$(imagediv).css('background-color', pagezone.bgcolor);
				$(imagediv).css('z-index', pagezone.zindex);
				$(imagediv).find('.inner_div').css('opacity', pagezone.opacity);
				$(imagediv).css('padding', pagezone.padding);
				$(imagediv).css('box-shadow', pagezone.shadow);
				$(imagediv).css('border-top-right-radius', pagezone.bdtr);
				$(imagediv).css('border-top-left-radius', pagezone.bdtl);
				$(imagediv).css('border-bottom-left-radius', pagezone.bdbl);
				$(imagediv).css('border-bottom-right-radius', pagezone.bdbr);
				$(imagediv).find('.inner_div').css('border-top-right-radius', pagezone.bdtr);
				$(imagediv).find('.inner_div').css('border-top-left-radius', pagezone.bdtl);
				$(imagediv).find('.inner_div').css('border-bottom-left-radius', pagezone.bdbl);
				$(imagediv).find('.inner_div').css('border-bottom-right-radius', pagezone.bdbr);
			} else if (pagezone.type == '0') {
				var p_ele = document.createElement('p');
				p_ele.className = 'clstextedit';
				p_ele.id = 'clstextedit_' + m;
				var textdiv = document.createElement('div');
				textdiv.className = 'text_html';
				textdiv.id = 'texthtml_' + m;
				p_ele.innerHTML = pagezone.content;
				$(textdiv).append(p_ele);
				$('#PageDiv').append(textdiv);

				$(textdiv).css('top', (parseInt(pagezone.topoffset) * scale) + 'px');
				$(textdiv).css('left', (parseInt(pagezone.leftoffset) * scale) + 'px');
				$(textdiv).css('height', (parseInt(pagezone.height) * scale) + 'px');
				$(textdiv).css('width', ((parseInt(pagezone.width) + 1) * scale) + 'px');
				$(textdiv).css('-moz-transform', pagezone.transform);
				$(textdiv).css('-webkit-transform', pagezone.transform);
				$(textdiv).css('color', pagezone.color);
				$(textdiv).css('font-family', pagezone.fontfamily);
				$(textdiv).css('font-size', parseInt(pagezone.fontsize) * scale);
				$(textdiv).find("p").css('text-decoration', pagezone.decoration);
				$(textdiv).css('text-align', pagezone.align);
				$(textdiv).css('font-weight', pagezone.fontweight);
				$(textdiv).css('font-style', pagezone.fontstyle);
				$(textdiv).css('border-color', pagezone.bdcolor);
				$(textdiv).css('border-style', pagezone.bdstyle);
				$(textdiv).css('border-width', (parseInt(pagezone.bdwidth) * scale) + 'px');
				$(textdiv).css('background-color', pagezone.bgcolor);
				$(textdiv).css('padding', pagezone.padding);
				$(textdiv).css('z-index', pagezone.zindex);
				$(textdiv).css('text-shadow', pagezone.shadow);
				$(textdiv).css('line-height', (parseInt(pagezone.lineheight) * scale) + 'px');
				$(textdiv).css('border-top-right-radius', pagezone.bdtr);
				$(textdiv).css('border-top-left-radius', pagezone.bdtl);
				$(textdiv).css('border-bottom-left-radius', pagezone.bdbl);
				$(textdiv).css('border-bottom-right-radius', pagezone.bdbr);
				$(textdiv).css('word-wrap', 'break-word');
				$(textdiv).css('overflow', 'hidden');
			}
		}
	}
}

$(window).resize(function(e) {
	show();
});
