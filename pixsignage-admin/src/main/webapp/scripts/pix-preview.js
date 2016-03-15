//Layout Preview
function redrawLayoutPreview(div, layout, maxsize) {
	div.empty();
	div.attr('layoutid', layout.layoutid);
	div.attr('style', 'position:relative; margin-left:0; margin-right:auto; border: 1px solid #000; background:#000000;');
	if (layout.bgimage != null) {
		div.append('<img class="layout-bg" src="/pixsigdata' + layout.bgimage.filepath+ '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
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
	if (layoutdtl.region.type != 0) {
		layoutdtlhtml += ' <div style="position:absolute; width:100%; height:100%; background:' + layoutdtl.bgcolor;
		layoutdtlhtml += '; opacity:' + layoutdtl.opacity/255 + '; "></div>';
	} else {
		layoutdtlhtml += ' <div style="position:absolute; width:100%; height:100%; background:' + RegionColors[layoutdtl.regionid];
		layoutdtlhtml += '; "></div>';
	}
	layoutdtlhtml += ' <div style="position:absolute; width:100%; height:100%; ">';
	if (layoutdtl.region.type == 1) {
		if (layoutdtl.direction == 4) {
			layoutdtlhtml += '<marquee class="layout-font" layoutdtlindex="' + layoutdtlindex + '" direction="left" behavior="scroll" scrollamount="1" scrolldelay="0" loop="-1" style="color:' + layoutdtl.color + '; font-size:12px; ">';
			layoutdtlhtml += '滚动文本';
			layoutdtlhtml += '</marquee>';
		} else {
			layoutdtlhtml += '<p class="layout-font" layoutdtlindex="' + layoutdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + layoutdtl.color + '; font-size:12px; ">';
			layoutdtlhtml += '静止文本';
			layoutdtlhtml += '</p>';
		}
	} else if (layoutdtl.region.type == 2) {
		layoutdtlhtml += '<p class="layout-font" layoutdtlindex="' + layoutdtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + layoutdtl.color + '; font-size:12px; ">';
		layoutdtlhtml += new Date().pattern(layoutdtl.dateformat);
		layoutdtlhtml += '</p>';
	} else if (layoutdtl.bgimage != null) {
		layoutdtlhtml += '<img src="/pixsigdata' + layoutdtl.bgimage.filepath+ '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
	}
	layoutdtlhtml += '</div>';
	layoutdtlhtml += '</div>';
	return layoutdtlhtml;
}

//Bundle Preview
function redrawBundlePreview(div, bundle, maxsize) {
	div.empty();
	div.attr('bundleid', bundle.bundleid);
	div.attr('style', 'position:relative; margin-left:0; margin-right:auto; border: 1px solid #000; background:#000000;');
	if (bundle.layout.bgimage != null) {
		div.append('<img class="layout-bg" src="/pixsigdata' + bundle.layout.bgimage.filepath+ '" width="100%" height="100%" style="right: 0; bottom: 0; position: absolute; top: 0; left: 0; z-index: 0" />');
	}
	for (var i=0; i<bundle.bundledtls.length; i++) {
		div.append(getBundledtlPreviewHtml(bundle, i));
	}
	var scale, width, height;
	if (bundle.layout.width > bundle.layout.height ) {
		width = maxsize;
		scale = bundle.layout.width / width;
		height = bundle.layout.height / scale;
		div.css('width' , width);
		div.css('height' , height);
	} else {
		height = maxsize;
		scale = bundle.layout.height / height;
		width = bundle.layout.width / scale;
		div.css('width' , width);
		div.css('height' , height);
	}
	$(div).find('.bundle-font').each(function() {
		var bundledtl = bundle.bundledtls[$(this).attr('bundledtlindex')];
		var fontsize = bundledtl.layoutdtl.size * bundledtl.layoutdtl.height / 100 / scale;
		var text = $(this).html();
		$(this).css('font-size', fontsize + 'px');
		$(this).css('line-height', bundledtl.layoutdtl.height / scale + 'px');
		if (fontsize < 9) {
			$(this).html('');
		}
	});
}

function getBundledtlPreviewHtml(bundle, bundledtlindex) {
	var bundledtl = bundle.bundledtls[bundledtlindex];
	var bgimage = null;
	if (bundledtl.objtype == 1 && bundledtl.medialist.medialistdtls.length > 0) {
		var medialistdtl = bundledtl.medialist.medialistdtls[0];
		if (medialistdtl.objtype == 1 && medialistdtl.video.thumbnail != null) {
			bgimage = '/pixsigdata' + medialistdtl.video.thumbnail;
		} else if (medialistdtl.objtype == 2 && medialistdtl.image.filepath != null) {
			bgimage = '/pixsigdata' + medialistdtl.image.filepath;
		}
	}
	
	var bundledtlhtml = '';
	bundledtlhtml += '<div style="position: absolute; width:' + 100*bundledtl.layoutdtl.width/bundle.layout.width;
	bundledtlhtml += '%; height:' + 100*bundledtl.layoutdtl.height/bundle.layout.height;
	bundledtlhtml += '%; top: ' + 100*bundledtl.layoutdtl.topoffset/bundle.layout.height;
	bundledtlhtml += '%; left: ' + 100*bundledtl.layoutdtl.leftoffset/bundle.layout.width;
	bundledtlhtml += '%; border: 1px solid #000; ">';

	if (bundledtl.layoutdtl.region.type == 0) {
		if (bundledtl.objtype == 3) {
			bundledtlhtml += ' <div style="position:absolute; width:100%; height:100%; background:#A4C2F4; "></div>';
		} else if (bundledtl.objtype == 5) {
			bundledtlhtml += ' <div style="position:absolute; width:100%; height:100%; background:#FFF2CC; "></div>';
		} else {
			bundledtlhtml += ' <div style="position:absolute; width:100%; height:100%; background:#B4A7D6; "></div>';
		}
	} else {
		bundledtlhtml += ' <div style="position:absolute; width:100%; height:100%; background:' + bundledtl.layoutdtl.bgcolor;
		bundledtlhtml += '; opacity:' + bundledtl.layoutdtl.opacity/255 + '; "></div>';
	}

	bundledtlhtml += ' <div style="position:absolute; width:100%; height:100%; ">';
	if (bundledtl.layoutdtl.region.type == 1) {
		if (bundledtl.layoutdtl.direction == 4) {
			bundledtlhtml += '<marquee class="bundle-font" bundledtlindex="' + bundledtlindex + '" direction="left" behavior="scroll" scrollamount="1" scrolldelay="0" loop="-1" style="color:' + bundledtl.layoutdtl.color + '; font-size:12px; ">';
			bundledtlhtml += bundledtl.text.text;
			bundledtlhtml += '</marquee>';
		} else {
			bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.layoutdtl.color + '; font-size:12px; ">';
			bundledtlhtml += bundledtl.text.text;
			bundledtlhtml += '</p>';
		}
	} else if (bundledtl.layoutdtl.region.type == 2) {
		bundledtlhtml += '<p class="bundle-font" bundledtlindex="' + bundledtlindex + '" style="text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; color:' + bundledtl.layoutdtl.color + '; font-size:12px; ">';
		bundledtlhtml += new Date().pattern(bundledtl.layoutdtl.dateformat);
		bundledtlhtml += '</p>';
	} else if (bgimage != null) {
		bundledtlhtml += '<img src="' + bgimage + '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
	} else if (bundledtl.layoutdtl.bgimage != null) {
		bundledtlhtml += '<img src="/pixsigdata' + bundledtl.layoutdtl.bgimage.filepath+ '" width="100%" height="100%" style="position: absolute; right: 0; bottom: 0; top: 0; left: 0; z-index: 0" />';
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
		layout_bgimage.src = '/pixsigdata' + layout.bgimage.filepath;
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
				} else if (medialistdtl.objtype == 2 && medialistdtl.image.filepath != null) {
					bgimage = '/pixsigdata' + medialistdtl.image.filepath;
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
		region_bgimage.src = '/pixsigdata' + layoutdtl.bgimage.filepath;
		region_bgimage.onload = function(img, ctx, left, top, width, height) {
			return function() {
				ctx.drawImage(img, left, top, width, height);
			}
		}(region_bgimage, ctx, left, top, width, height);
	} else {
		if (fill) {
			ctx.fillStyle = RegionColors[layoutdtl.regionid];
			ctx.fillRect(left,top,width,height);
		}
	}
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 2;
	ctx.strokeRect(left,top,width,height);
};

