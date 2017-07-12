//Layout Preview
function redrawLayoutPreview(div, layout, maxsize) {
	div.empty();
	div.attr('layoutid', layout.layoutid);
	div.attr('style', 'position:relative; margin-left:0; margin-right:auto; border: 1px solid #000; background:#FFFFFF;');
	if (layout.bgimage != null) {
		div.append('<img class="layout-bg" src="/pixsigdata' + layout.bgimage.thumbnail + '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
	}
	for (var i=0; i<layout.layoutdtls.length; i++) {
		div.append(getLayoutdtlPreviewHtml(layout, i));
	}
	var scale, width, height;
	if (layout.width > layout.height ) {
		width = maxsize;
		scale = layout.width / width;
		height = layout.height / scale;
		div.css('width' , width);
		div.css('height' , height);
	} else {
		height = maxsize;
		scale = layout.height / height;
		width = layout.width / scale;
		div.css('width' , width);
		div.css('height' , height);
	}
	$(div).find('.layout-font').each(function() {
		var layoutdtl = layout.layoutdtls[$(this).attr('layoutdtlindex')];
		var fontsize = layoutdtl.size * layoutdtl.height / 100 / scale;
		var text = $(this).html();
		$(this).css('font-size', fontsize + 'px');
		$(this).css('line-height', layoutdtl.height / scale + 'px');
		if (fontsize < 9) {
			$(this).html('');
		} else {
			$(this).find('img').each(function() {
				$(this).css('height', fontsize + 'px');
				$(this).css('display', 'inline');
			});
		}
	});
}

function getLayoutdtlPreviewHtml(layout, layoutdtlindex) {
	var layoutdtl = layout.layoutdtls[layoutdtlindex];
	var layoutdtlhtml = '';
	layoutdtlhtml += '<div style="position: absolute; width:' + 100*layoutdtl.width/layout.width;
	layoutdtlhtml += '%; height:' + 100*layoutdtl.height/layout.height;
	layoutdtlhtml += '%; top: ' + 100*layoutdtl.topoffset/layout.height;
	layoutdtlhtml += '%; left: ' + 100*layoutdtl.leftoffset/layout.width;
	layoutdtlhtml += '%; border: 1px solid #000; ">';
	var bgcolor = layoutdtl.bgcolor;
	var bgimage = '';
	if (layoutdtl.bgimage != null) {
		bgimage = '/pixsigdata' + layoutdtl.bgimage.thumbnail;
	} else if (layoutdtl.mainflag == 1) {
		bgimage = '../img/region/region-play-main.jpg';
	} else if (layoutdtl.type == '0') {
		bgimage = '../img/region/region-play.jpg';
	} else if (layoutdtl.type == '4') {
		bgimage = '../img/region/region-videoin.jpg';
	} else if (layoutdtl.type == '5') {
		bgimage = '../img/region/region-dvb.jpg';
	} else if (layoutdtl.type == '6') {
		bgimage = '../img/region/region-stream.jpg';
	} else if (layoutdtl.type == '8') {
		if (layoutdtl.width > layoutdtl.height) {
			bgimage = '../img/region/region-navigate-h.jpg';
		} else {
			bgimage = '../img/region/region-navigate-v.jpg';
		}
	} else if (layoutdtl.type == '9') {
		bgimage = '../img/region/region-qrcode.jpg';
	}

	if (layoutdtl.type != 0) {
		layoutdtlhtml += ' <div style="position:absolute; width:100%; height:100%; background:' + bgcolor;
		layoutdtlhtml += '; opacity:' + layoutdtl.opacity/255 + '; "></div>';
	} else {
		layoutdtlhtml += ' <div style="position:absolute; width:100%; height:100%; background:' + bgcolor;
		layoutdtlhtml += '; "></div>';
	}
	layoutdtlhtml += ' <div style="position:absolute; width:100%; height:100%; ">';
	if (layoutdtl.type == '0' || layoutdtl.type == '4' || layoutdtl.type == '5' || layoutdtl.type == '6' || layoutdtl.type == '8' || layoutdtl.type == '9') {
		layoutdtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
	} else if (layoutdtl.type == '1') {
		if (layoutdtl.direction == 4) {
			layoutdtlhtml += '<marquee class="layout-font" layoutdtlindex="' + layoutdtlindex + '" direction="left" behavior="scroll" scrollamount="1" scrolldelay="0" loop="-1" style="color:' + layoutdtl.color + '; font-size:12px; ">';
			layoutdtlhtml += '滚动文本';
			layoutdtlhtml += '</marquee>';
		} else {
			layoutdtlhtml += '<p class="layout-font" layoutdtlindex="' + layoutdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + layoutdtl.color + '; font-size:12px; ">';
			layoutdtlhtml += '静止文本';
			layoutdtlhtml += '</p>';
		}
	} else if (layoutdtl.type == '2') {
		layoutdtlhtml += '<p class="layout-font" layoutdtlindex="' + layoutdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + layoutdtl.color + '; font-size:12px; ">';
		layoutdtlhtml += new Date().pattern(layoutdtl.dateformat);
		layoutdtlhtml += '</p>';
	} else if (layoutdtl.type == '3') {
		layoutdtlhtml += '<div class="layout-font" layoutdtlindex="' + layoutdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + layoutdtl.color + '; font-size:12px; ">';
		layoutdtlhtml += '深圳 20 ~ 17℃ 多云转小雨 ';
		layoutdtlhtml += '<img src="http://api.map.baidu.com/images/weather/day/duoyun.png" />';
		layoutdtlhtml += '<img src="http://api.map.baidu.com/images/weather/night/xiaoyu.png" />';
		layoutdtlhtml += '</div>';
	} else {
		if (bgimage != '') {
			layoutdtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
		}
		layoutdtlhtml += '<p class="layout-font" layoutdtlindex="' + layoutdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + layoutdtl.color + '; font-size:12px; ">';
		layoutdtlhtml += eval('common.view.region_mainflag_' + layoutdtl.mainflag) + eval('common.view.region_type_' + layoutdtl.type);
		layoutdtlhtml += '</p>';
	}
	layoutdtlhtml += '</div>';
	layoutdtlhtml += '</div>';
	return layoutdtlhtml;
}

//Bundle Preview
function redrawBundlePreview(div, bundle, maxsize, dynamic) {
	div.empty();
	div.attr('bundleid', bundle.bundleid);
	//div.attr('style', 'position:relative; margin-left:0; margin-right:auto; border: 1px solid #000; background:#FFFFFF;');
	div.attr('style', 'position:relative; margin-left:0; margin-right:auto; background:#FFFFFF;');
	if (bundle.bgimage != null) {
		div.append('<img class="layout-bg" src="/pixsigdata' + bundle.bgimage.thumbnail + '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
	}
	for (var i=0; i<bundle.bundledtls.length; i++) {
		div.append(getBundledtlPreviewHtml(bundle, i, dynamic));
	}
	var scale, width, height;
	if (bundle.width > bundle.height ) {
		width = maxsize;
		scale = bundle.width / width;
		height = bundle.height / scale;
		div.css('width' , width);
		div.css('height' , height);
	} else {
		height = maxsize;
		scale = bundle.height / height;
		width = bundle.width / scale;
		div.css('width' , width);
		div.css('height' , height);
	}
	$(div).find('.bundle-font').each(function() {
		var bundledtl = bundle.bundledtls[$(this).attr('bundledtlindex')];
		var fontsize = bundledtl.size * bundledtl.height / 100 / scale;
		var text = $(this).html();
		$(this).css('font-size', fontsize + 'px');
		$(this).css('line-height', bundledtl.height / scale + 'px');
		if (fontsize < 9) {
			$(this).html('');
			$(this).find('img').each(function() {
				$(this).css('display', 'none');
			});
		} else {
			$(this).find('img').each(function() {
				$(this).css('height', fontsize + 'px');
				$(this).css('display', 'inline');
			});
		}
	});
}

function getBundledtlPreviewHtml(bundle, bundledtlindex, dynamic) {
	var bundledtl = bundle.bundledtls[bundledtlindex];
	var bgimage = '';
	if (bundledtl.bgimage != null) {
		bgimage = '/pixsigdata' + bundledtl.bgimage.thumbnail;
	} else if (bundledtl.mainflag == 1) {
		bgimage = '../img/region/region-play-main.jpg';
	} else if (bundledtl.type == '0') {
		bgimage = '../img/region/region-play.jpg';
	} else if (bundledtl.type == '4') {
		bgimage = '../img/region/region-videoin.jpg';
	} else if (bundledtl.type == '5') {
		bgimage = '../img/region/region-dvb.jpg';
	} else if (bundledtl.type == '6') {
		bgimage = '../img/region/region-stream.jpg';
	} else if (bundledtl.type == '8') {
		if (bundledtl.width > bundledtl.height) {
			bgimage = '../img/region/region-navigate-h.jpg';
		} else {
			bgimage = '../img/region/region-navigate-v.jpg';
		}
	} else if (bundledtl.type == '9') {
		bgimage = '../img/region/region-qrcode.jpg';
	}
	if (bundledtl.type == '0') {
		if (bundledtl.objtype == 1 && bundledtl.medialist.medialistdtls.length > 0) {
			var medialistdtl = bundledtl.medialist.medialistdtls[0];
			if (medialistdtl.objtype == 1 && medialistdtl.video.thumbnail != null) {
				bgimage = '/pixsigdata' + medialistdtl.video.thumbnail;
			} else if (medialistdtl.objtype == 2 && medialistdtl.image.filename != null) {
				bgimage = '/pixsigdata' + medialistdtl.image.thumbnail;
			}
		} else if (bundledtl.objtype == 5) {
			bgimage = '../img/region/region-widget.jpg';
		}
	}
	
	var bundledtlhtml = '';
	bundledtlhtml += '<div style="position: absolute; width:' + 100*bundledtl.width/bundle.width;
	bundledtlhtml += '%; height:' + 100*bundledtl.height/bundle.height;
	bundledtlhtml += '%; top: ' + 100*bundledtl.topoffset/bundle.height;
	bundledtlhtml += '%; left: ' + 100*bundledtl.leftoffset/bundle.width;
	//bundledtlhtml += '%; border: 1px solid #000; ">';
	bundledtlhtml += '%; ">';

	bundledtlhtml += ' <div style="position:absolute; width:100%; height:100%; background:' + bundledtl.bgcolor;
	bundledtlhtml += '; opacity:' + bundledtl.opacity/255 + '; "></div>';

	bundledtlhtml += ' <div style="position:absolute; width:100%; height:100%; ">';
	if (bundledtl.type == '0' || bundledtl.type == '4' || bundledtl.type == '5' || bundledtl.type == '6' || bundledtl.type == '8' || bundledtl.type == '9') {
		bundledtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
	} else if (bundledtl.type == 1) {
		if (bundledtl.direction == 4 && dynamic == 1) {
			bundledtlhtml += '<marquee class="bundle-font" bundledtlindex="' + bundledtlindex + '" direction="left" behavior="scroll" scrollamount="1" scrolldelay="0" loop="-1" style="color:' + bundledtl.color + '; font-size:12px; font-weight:bold; ">';
			bundledtlhtml += bundledtl.text.text;
			bundledtlhtml += '</marquee>';
		} else {
			bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.color + '; font-size:12px; font-weight:bold; ">';
			bundledtlhtml += bundledtl.text.text;
			bundledtlhtml += '</p>';
		}
	} else if (bundledtl.type == 2) {
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.color + '; font-size:12px; font-weight:bold; ">';
		bundledtlhtml += new Date().pattern(bundledtl.dateformat);
		bundledtlhtml += '</p>';
	} else if (bundledtl.type == 3) {
		bundledtlhtml += '<div class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.color + '; font-size:12px; font-weight:bold; ">';
		bundledtlhtml += '深圳 20 ~ 17℃ 多云转小雨 ';
		bundledtlhtml += '<img src="../img/duoyun.png" />';
		bundledtlhtml += '<img src="../img/xiaoyu.png" />';
		bundledtlhtml += '</div>';
	} else if (bundledtl.type == 7) {
		if (bgimage != '') {
			bundledtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
		}
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.color + '; font-size:12px; ">';
		if (bundledtl.touchlabel != null) {
			bundledtlhtml += bundledtl.touchlabel;
		} else {
			bundledtlhtml += eval('common.view.region_type_7');
		}
		bundledtlhtml += '</p>';
	} else {
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.color + '; font-size:12px; ">';
		bundledtlhtml += eval('common.view.region_mainflag_' + bundledtl.mainflag) + eval('common.view.region_type_' + bundledtl.type);
		bundledtlhtml += '</p>';
	}
	bundledtlhtml += '</div>';
	bundledtlhtml += '</div>';
	return bundledtlhtml;
}

// Layout Canvase Preview
function redrawLayoutCanvasPreview(canvas, layout) {
	var ctx = canvas.getContext('2d');
	var scale;
	if (layout.width == 1920 || layout.width == 1080) {
		scale = 1920/160;
	} else {
		scale = 800/160;
	}
	canvas.width = layout.width/scale;
	canvas.height = layout.height/scale;

	if (layout.bgimage != null) {
		var layout_bgimage = new Image();
		layout_bgimage.src = '/pixsigdata' + layout.bgimage.thumbnail;
		layout_bgimage.onload = function(img, layout, ctx, canvaswidth, canvasheight) {
			return function() {
				//ctx.globalAlpha = 0.2;
				ctx.drawImage(img, 0, 0, canvaswidth, canvasheight);
				for (var j=0; j<layout.layoutdtls.length; j++) {
					var layoutdtl = layout.layoutdtls[j];
					var width = layoutdtl.width/scale;
					var height = layoutdtl.height/scale;
					var top = layoutdtl.topoffset/scale;
					var left = layoutdtl.leftoffset/scale;
					drawCanvasRegion(ctx, null, layoutdtl, left, top, width, height, false);
				}
			}
		}(layout_bgimage, layout, ctx, canvas.width, canvas.height);
	} else {
		for (var j=0; j<layout.layoutdtls.length; j++) {
			var layoutdtl = layout.layoutdtls[j];
			var width = layoutdtl.width/scale;
			var height = layoutdtl.height/scale;
			var top = layoutdtl.topoffset/scale;
			var left = layoutdtl.leftoffset/scale;
			drawCanvasRegion(ctx, null, layoutdtl, left, top, width, height, true);
		}
	}
}

function drawCanvasRegion(ctx, bundle, layoutdtl, left, top, width, height, fill) {
	var bgimage = null;
	if (bundle != null) {
		for (var i=0; i<bundle.bundledtls.length; i++) {
			var bundledtl = bundle.bundledtls[i];
			if (bundledtl.regionid == layoutdtl.regionid && bundledtl.objtype == 1 && bundledtl.medialist.medialistdtls.length > 0) {
				var medialistdtl = bundledtl.medialist.medialistdtls[0];
				if (medialistdtl.objtype == 1 && medialistdtl.video.thumbnail != null) {
					bgimage = '/pixsigdata' + medialistdtl.video.thumbnail;
				} else if (medialistdtl.objtype == 2 && medialistdtl.image.filename != null) {
					bgimage = '/pixsigdata' + medialistdtl.image.thumbnail;
				}
			}
		}
	}
	if (bgimage != null) {
		var region_bgimage = new Image();
		region_bgimage.src = bgimage;
		region_bgimage.onload = function(img, ctx, left, top, width, height) {
			return function() {
				ctx.drawImage(img, left, top, width, height);
			}
		}(region_bgimage, ctx, left, top, width, height);
	} else if (layoutdtl.bgimage != null) {
		var region_bgimage = new Image();
		region_bgimage.src = '/pixsigdata' + layoutdtl.bgimage.thumbnail;
		region_bgimage.onload = function(img, ctx, left, top, width, height) {
			return function() {
				ctx.drawImage(img, left, top, width, height);
			}
		}(region_bgimage, ctx, left, top, width, height);
	} else {
		if (fill) {
			ctx.fillStyle = RegionColors[layoutdtl.type];
			ctx.fillRect(left,top,width,height);
		}
	}
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 2;
	ctx.strokeRect(left,top,width,height);
};


//Templet Preview
function redrawTempletPreview(div, templet, maxsize, dynamic) {
	div.empty();
	div.attr('templetid', templet.templetid);
	div.attr('style', 'position:relative; margin-left:0; margin-right:auto; background:#FFFFFF;');
	if (templet.bgimage != null) {
		div.append('<img class="layout-bg" src="/pixsigdata' + templet.bgimage.thumbnail + '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
	}
	for (var i=0; i<templet.templetdtls.length; i++) {
		div.append(getTempletdtlPreviewHtml(templet, i, dynamic));
	}
	var scale, width, height;
	if (templet.width > templet.height ) {
		width = maxsize;
		scale = templet.width / width;
		height = templet.height / scale;
		div.css('width' , width);
		div.css('height' , height);
	} else {
		height = maxsize;
		scale = templet.height / height;
		width = templet.width / scale;
		div.css('width' , width);
		div.css('height' , height);
	}
	$(div).find('.templet-font').each(function() {
		var templetdtl = templet.templetdtls[$(this).attr('templetdtlindex')];
		var fontsize = templetdtl.size * templetdtl.height / 100 / scale;
		var text = $(this).html();
		$(this).css('font-size', fontsize + 'px');
		$(this).css('line-height', templetdtl.height / scale + 'px');
		if (fontsize < 9) {
			$(this).html('');
			$(this).find('img').each(function() {
				$(this).css('display', 'none');
			});
		} else {
			$(this).find('img').each(function() {
				$(this).css('height', fontsize + 'px');
				$(this).css('display', 'inline');
			});
		}
	});
}

function getTempletdtlPreviewHtml(templet, templetdtlindex, dynamic) {
	var templetdtl = templet.templetdtls[templetdtlindex];
	var bgimage = '';
	if (templetdtl.bgimage != null) {
		bgimage = '/pixsigdata' + templetdtl.bgimage.thumbnail;
	} else if (templetdtl.mainflag == 1) {
		bgimage = '../img/region/region-play-main.jpg';
	} else if (templetdtl.type == '0') {
		bgimage = '../img/region/region-play.jpg';
	} else if (templetdtl.type == '4') {
		bgimage = '../img/region/region-videoin.jpg';
	} else if (templetdtl.type == '5') {
		bgimage = '../img/region/region-dvb.jpg';
	} else if (templetdtl.type == '6') {
		bgimage = '../img/region/region-stream.jpg';
	} else if (templetdtl.type == '8') {
		if (templetdtl.width > templetdtl.height) {
			bgimage = '../img/region/region-navigate-h.jpg';
		} else {
			bgimage = '../img/region/region-navigate-v.jpg';
		}
	} else if (templetdtl.type == '9') {
		bgimage = '../img/region/region-qrcode.jpg';
	}
	if (templetdtl.type == '0') {
		if (templetdtl.objtype == 1 && templetdtl.medialist.medialistdtls.length > 0) {
			var medialistdtl = templetdtl.medialist.medialistdtls[0];
			if (medialistdtl.objtype == 1 && medialistdtl.video.thumbnail != null) {
				bgimage = '/pixsigdata' + medialistdtl.video.thumbnail;
			} else if (medialistdtl.objtype == 2 && medialistdtl.image.filename != null) {
				bgimage = '/pixsigdata' + medialistdtl.image.thumbnail;
			}
		} else if (templetdtl.objtype == 5) {
			bgimage = '../img/region/region-widget.jpg';
		}
	}
	
	var templetdtlhtml = '';
	templetdtlhtml += '<div style="position: absolute; width:' + 100*templetdtl.width/templet.width;
	templetdtlhtml += '%; height:' + 100*templetdtl.height/templet.height;
	templetdtlhtml += '%; top: ' + 100*templetdtl.topoffset/templet.height;
	templetdtlhtml += '%; left: ' + 100*templetdtl.leftoffset/templet.width;
	templetdtlhtml += '%; ">';

	templetdtlhtml += ' <div style="position:absolute; width:100%; height:100%; background:' + templetdtl.bgcolor;
	templetdtlhtml += '; opacity:' + templetdtl.opacity/255 + '; "></div>';

	templetdtlhtml += ' <div style="position:absolute; width:100%; height:100%; ">';
	if (templetdtl.type == '0' || templetdtl.type == '4' || templetdtl.type == '5' || templetdtl.type == '6' || templetdtl.type == '8' || templetdtl.type == '9') {
		templetdtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
	} else if (templetdtl.type == 1) {
		if (templetdtl.direction == 4 && dynamic == 1) {
			templetdtlhtml += '<marquee class="templet-font" templetdtlindex="' + templetdtlindex + '" direction="left" behavior="scroll" scrollamount="1" scrolldelay="0" loop="-1" style="color:' + templetdtl.color + '; font-size:12px; font-weight:bold; ">';
			templetdtlhtml += templetdtl.text.text;
			templetdtlhtml += '</marquee>';
		} else {
			templetdtlhtml += '<p class="templet-font" templetdtlindex="' + templetdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + templetdtl.color + '; font-size:12px; font-weight:bold; ">';
			templetdtlhtml += templetdtl.text.text;
			templetdtlhtml += '</p>';
		}
	} else if (templetdtl.type == 2) {
		templetdtlhtml += '<p class="templet-font" templetdtlindex="' + templetdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + templetdtl.color + '; font-size:12px; font-weight:bold; ">';
		templetdtlhtml += new Date().pattern(templetdtl.dateformat);
		templetdtlhtml += '</p>';
	} else if (templetdtl.type == 3) {
		templetdtlhtml += '<div class="templet-font" templetdtlindex="' + templetdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + templetdtl.color + '; font-size:12px; font-weight:bold; ">';
		templetdtlhtml += '深圳 20 ~ 17℃ 多云转小雨 ';
		templetdtlhtml += '<img src="../img/duoyun.png" />';
		templetdtlhtml += '<img src="../img/xiaoyu.png" />';
		templetdtlhtml += '</div>';
	} else if (templetdtl.type == 7) {
		if (bgimage != '') {
			templetdtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
		}
		templetdtlhtml += '<p class="templet-font" templetdtlindex="' + templetdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + templetdtl.color + '; font-size:12px; ">';
		if (templetdtl.touchlabel != null) {
			templetdtlhtml += templetdtl.touchlabel;
		} else {
			templetdtlhtml += eval('common.view.region_type_7');
		}
		templetdtlhtml += '</p>';
	} else {
		templetdtlhtml += '<p class="templet-font" templetdtlindex="' + templetdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + templetdtl.color + '; font-size:12px; ">';
		templetdtlhtml += eval('common.view.region_mainflag_' + templetdtl.mainflag) + eval('common.view.region_type_' + templetdtl.type);
		templetdtlhtml += '</p>';
	}
	templetdtlhtml += '</div>';
	templetdtlhtml += '</div>';
	return templetdtlhtml;
}

function redrawMediagridPreview(div, mediagrid, maxsize) {
	div.empty();
	div.attr('mediagridid', mediagrid.mediagridid);
	div.attr('style', 'position:relative; margin-left:0; margin-right:auto; border: 1px solid #000; background:#FFFFFF;');
	for (var i=0; i<mediagrid.mediagriddtls.length; i++) {
		var mediagriddtl = mediagrid.mediagriddtls[i];
		var mediagriddtlhtml = '';
		mediagriddtlhtml += '<div style="position: absolute; width:' + 100*mediagriddtl.xcount/mediagrid.xcount;
		mediagriddtlhtml += '%; height:' + 100*mediagriddtl.ycount/mediagrid.ycount;
		mediagriddtlhtml += '%; left: ' + 100*mediagriddtl.xpos/mediagrid.xcount;
		mediagriddtlhtml += '%; top: ' + 100*mediagriddtl.ypos/mediagrid.ycount;
		mediagriddtlhtml += '%; border: 1px solid #000; ">';
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
		mediagriddtlhtml += ' <div style="position:absolute; width:100%; height:100%; ">';
		if (bgimage != null) {
			mediagriddtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
		}
		mediagriddtlhtml += '</div>';
		mediagriddtlhtml += '</div>';
		div.append(mediagriddtlhtml);
	}
	for (var i=0; i<mediagrid.xcount; i++) {
		for (var j=0; j<mediagrid.ycount; j++) {
			var html = '<div style="position: absolute; width:' + (100/mediagrid.xcount);
			html += '%; height:' + (100/mediagrid.ycount);
			html += '%; left: ' + (i*100/mediagrid.xcount);
			html += '%; top: ' + (j*100/mediagrid.ycount);
			html += '%; border: 1px dotted #000; ">';
			div.append(html);
		}
	}

	if (mediagrid.width > mediagrid.height ) {
		width = maxsize;
		scale = mediagrid.width / width;
		height = mediagrid.height / scale;
	} else {
		height = maxsize * 9 / 16;
		scale = mediagrid.height / height;
		width = mediagrid.width / scale;
	}
	div.css('width' , width);
	div.css('height' , height);
}

function redrawSologridPreview(div, grid, thumbnail, maxsize) {
	div.empty();
	div.attr('style', 'position:relative; margin-left:0; margin-right:auto; border: 1px solid #000; background:#FFFFFF;');
	for (var i=0; i<grid.xcount; i++) {
		for (var j=0; j<grid.ycount; j++) {
			var html = '';
			html += '<div style="position: absolute; width:' + 100/grid.xcount;
			html += '%; height:' + 100/grid.ycount;
			html += '%; left: ' + 100*i/grid.xcount;
			html += '%; top: ' + 100*j/grid.ycount;
			html += '%; border: 1px solid #000; ">';
			html += ' <div style="position:absolute; width:100%; height:100%; ">';
			html += '<img src="' + thumbnail + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
			html += '</div>';
			html += '</div>';
			div.append(html);
		}
	}
	for (var i=0; i<grid.xcount; i++) {
		for (var j=0; j<grid.ycount; j++) {
			var html = '<div style="position: absolute; width:' + (100/grid.xcount);
			html += '%; height:' + (100/grid.ycount);
			html += '%; left: ' + (i*100/grid.xcount);
			html += '%; top: ' + (j*100/grid.ycount);
			html += '%; border: 1px dotted #000; ">';
			div.append(html);
		}
	}

	if (grid.width > grid.height ) {
		width = maxsize;
		scale = grid.width / width;
		height = grid.height / scale;
	} else {
		height = maxsize * 9 / 16;
		scale = grid.height / height;
		width = grid.width / scale;
	}
	div.css('width' , width);
	div.css('height' , height);
}

//Page & Template Preview
function redrawPagePreview(container, page, maxsize) {
	$(container).empty();
	var scale, width, height;
	if (page.width > page.height ) {
		width = maxsize;
		scale = page.width / width;
		height = page.height / scale;
		$(container).css('width' , width);
		$(container).css('height' , height);
	} else {
		height = maxsize;
		scale = page.height / height;
		width = page.width / scale;
		$(container).css('width' , width);
		$(container).css('height' , height);
	}
	var zones;
	if (typeof(page.pagezones) != 'undefined') {
		zones = page.pagezones;
	} else {
		zones = page.templatezones;
	}
	for (var i = 0; i < zones.length; i++) {
		var zone = zones[i];
		var zonedtls;
		if (typeof(zone.pagezonedtls) != 'undefined') {
			zonedtls = zone.pagezonedtls;
		} else {
			zonedtls = zone.templatezonedtls;
		}

		var zone_div = document.createElement('div');
		var background_div = document.createElement('div');
		var inner_div = document.createElement('div');
		$(zone_div).append(background_div);
		$(zone_div).append(inner_div);
		$(container).append(zone_div);

		$(zone_div).css({
			'position': 'absolute',
			'width': 100*zone.width/page.width + '%',
			'height': 100*zone.height/page.height + '%',
			'top': 100*zone.topoffset/page.height + '%', 
			'left': 100*zone.leftoffset/page.width + '%', 
			'z-index': zone.zindex,
			'-moz-transform': zone.transform,
			'-webkit-transform': zone.transform,
		});
		$(background_div).css({
			'position': 'absolute',
			'width': '100%',
			'height': '100%',
			'background': zone.bgcolor, 
			'opacity': parseInt(zone.bgopacity)/255, 
		});
		$(inner_div).css({
			'position': 'absolute',
			'height': '100%', 
			'width': '100%', 
			'padding': (parseInt(zone.padding) / scale) + 'px', 
		});
		var shadow = '';
		shadow += (parseInt(zone.shadowh) / scale) + 'px ';
		shadow += (parseInt(zone.shadowv) / scale) + 'px ';
		shadow += (parseInt(zone.shadowblur) / scale) + 'px ';
		shadow += zone.shadowcolor;
		if (zone.type == 1) {
			//Video Zone
			var img_element = document.createElement('img');
			$(inner_div).append(img_element);
			$(inner_div).css({
				'box-shadow': shadow, 
				'opacity': parseInt(zone.opacity)/255,
			});
			$(zone_div).find('img').css({
				'box-sizing': 'border-box',
				'border-color': zone.bdcolor, 
				'border-style': zone.bdstyle, 
				'border-width': (parseInt(zone.bdwidth) / scale) + 'px', 
				'border-radius': (parseInt(zone.bdradius) / scale) + 'px', 
			});
			if (zonedtls.length > 0 && zonedtls[0].video != null) {
				$(zone_div).find('img').attr('src', '/pixsigdata' + zonedtls[0].video.thumbnail);
				$(zone_div).find('img').attr('width', '100%');
				$(zone_div).find('img').attr('height', '100%');
			}
		} else if (zone.type == '2') {
			//Image Zone
			var img_element = document.createElement('img');
			$(inner_div).append(img_element);
			$(inner_div).css({
				'box-shadow': shadow, 
				'opacity': parseInt(zone.opacity)/255,
			});
			$(zone_div).find('img').css({
				'box-sizing': 'border-box',
				'border-color': zone.bdcolor, 
				'border-style': zone.bdstyle, 
				'border-width': (parseInt(zone.bdwidth) / scale) + 'px', 
				'border-radius': (parseInt(zone.bdradius) / scale) + 'px', 
			});
			if (zonedtls.length > 0 && zonedtls[0].image != null) {
				$(zone_div).find('img').attr('src', '/pixsigdata' + zonedtls[0].image.filepath);
				$(zone_div).find('img').attr('width', '100%');
				$(zone_div).find('img').attr('height', '100%');
			}
		} else if (zone.type == '3') {
			var p_element = document.createElement('p');
			$(p_element).html(zone.content);
			$(inner_div).append(p_element);			
			$(inner_div).css({
				'box-sizing': 'border-box',
				'border-color': zone.bdcolor, 
				'border-style': zone.bdstyle, 
				'border-width': (parseInt(zone.bdwidth) / scale) + 'px', 
				'border-radius': (parseInt(zone.bdradius) / scale) + 'px', 
				'color': zone.color, 
				'font-family': zone.fontfamily, 
				'font-size': (parseInt(zone.fontsize) / scale) + 'px', 
				'text-decoration': zone.decoration, 
				'text-align': zone.align, 
				'font-weight': zone.fontweight, 
				'font-style': zone.fontstyle, 
				'line-height': (parseInt(zone.lineheight) / scale) + 'px', 
				'text-shadow': shadow, 
				'word-wrap': 'break-word',
			});
			$(p_element).css({
				'word-wrap': 'break-word',
				'white-space': 'pre-wrap',
				'text-decoration': zone.decoration,
			});
		} else if (zone.type == '4') {
			var p_element = document.createElement('p');
			$(p_element).html(zone.content);
			$(inner_div).append(p_element);
			$(inner_div).css({
				'box-sizing': 'border-box',
				'border-color': zone.bdcolor, 
				'border-style': zone.bdstyle, 
				'border-width': (parseInt(zone.bdwidth) / scale) + 'px', 
				'border-radius': (parseInt(zone.bdradius) / scale) + 'px', 
				'color': zone.color, 
				'font-family': zone.fontfamily, 
				'font-size': (parseInt(zone.fontsize) / scale) + 'px', 
				'text-decoration': zone.decoration, 
				'text-align': zone.align, 
				'font-weight': zone.fontweight, 
				'font-style': zone.fontstyle, 
				'line-height': (parseInt(zone.lineheight) / scale) + 'px', 
				'text-shadow': shadow, 
				'word-wrap': 'break-word',
			});
			$(p_element).css({
				'word-wrap': 'break-word',
				'white-space': 'pre-wrap',
				'text-decoration': zone.decoration,
			});
		} else if (zone.type == '5') {
			var p_element = document.createElement('p');
			$(p_element).html(new Date().pattern(zone.dateformat));
			$(inner_div).append(p_element);
			$(inner_div).css({
				'box-sizing': 'border-box',
				'border-color': zone.bdcolor, 
				'border-style': zone.bdstyle, 
				'border-width': (parseInt(zone.bdwidth) / scale) + 'px', 
				'border-radius': (parseInt(zone.bdradius) / scale) + 'px', 
				'color': zone.color, 
				'font-family': zone.fontfamily, 
				'font-size': (parseInt(zone.fontsize) / scale) + 'px', 
				'text-decoration': zone.decoration, 
				'text-align': zone.align, 
				'font-weight': zone.fontweight, 
				'font-style': zone.fontstyle, 
				'line-height': (parseInt(zone.lineheight) / scale) + 'px', 
				'text-shadow': shadow, 
				'word-wrap': 'break-word',
			});
			$(p_element).css({
				'word-wrap': 'break-word',
				'white-space': 'pre-wrap',
				'text-decoration': zone.decoration,
			});
		} else if (zone.type == '7') {
			var p_element = document.createElement('p');
			$(p_element).html(zone.content);
			$(inner_div).append(p_element);			
			$(inner_div).css({
				'box-sizing': 'border-box',
				'border-color': zone.bdcolor, 
				'border-style': zone.bdstyle, 
				'border-width': (parseInt(zone.bdwidth) / scale) + 'px', 
				'border-radius': (parseInt(zone.bdradius) / scale) + 'px', 
				'color': zone.color, 
				'font-family': zone.fontfamily, 
				'font-size': (parseInt(zone.fontsize) / scale) + 'px', 
				'text-decoration': zone.decoration, 
				'text-align': zone.align, 
				'font-weight': zone.fontweight, 
				'font-style': zone.fontstyle, 
				'line-height': (parseInt(zone.lineheight) / scale) + 'px', 
				'text-shadow': shadow, 
				'word-wrap': 'break-word',
			});
			if (zonedtls.length > 0 && zonedtls[0].image != null) {
				$(inner_div).css('background-image', 'url(/pixsigdata' + zonedtls[0].image.filepath + ')');
				$(inner_div).css('background-size', '100% 100%');
				$(inner_div).css('background-position', 'center');
				$(inner_div).css('background-repeat', 'no-repeat');
			}
			$(p_element).css({
				'word-wrap': 'break-word',
				'white-space': 'pre-wrap',
				'text-decoration': zone.decoration,
			});
		} else {
			var p_element = document.createElement('p');
			$(p_element).html(eval('common.view.pagezone_type_' + zone.type));
			$(inner_div).append(p_element);
			$(inner_div).css({
				'box-sizing': 'border-box',
				'border-color': zone.bdcolor, 
				'border-style': zone.bdstyle, 
				'border-width': (parseInt(zone.bdwidth) / scale) + 'px', 
				'border-radius': (parseInt(zone.bdradius) / scale) + 'px', 
				'color': zone.color, 
				'font-size': (60 / scale) + 'px', 
				'word-wrap': 'break-word',
			});
			$(p_element).css({
				'word-wrap': 'break-word',
				'text-align': 'center',
				'overflow': 'hidden',
				'text-overflow': 'clip',
				'white-space': 'nowrap',
			});
		}
	}
}

