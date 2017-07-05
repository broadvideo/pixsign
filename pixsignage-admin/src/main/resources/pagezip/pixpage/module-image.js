var ImageZone = function () {
	var slider_option = {
		auto: true,
		controls: false,
		pager: false,
		pause: 10000,
	};

	var init = function () {
		$('#PageDiv div[zonetype=2]').each(function() {
			var pagezoneid = $(this).attr('zoneid');
			var pagezones = Page.pagezones.filter(function (el) {
				return el.pagezoneid == pagezoneid;
			});
			
			var pagezonedtls = pagezones[0].pagezonedtls;
			if (pagezonedtls.length == 1 && pagezonedtls[0].image != null) {
				var img_element = document.createElement('img');
				$(img_element).attr('src', 'image/' + pagezonedtls[0].image.filename);
				$(img_element).attr('width', '100%');
				$(img_element).attr('height', '100%');
				$(this).find('#PagezoneCT').append(img_element);
			} else if (pagezonedtls.length > 1) {
				var ul_element = document.createElement('ul');
				$(ul_element).addClass('bxslider');
				for (var i=0; i<pagezonedtls.length; i++) {
					if (pagezonedtls[i].image != null) {
						$(ul_element).append('<li><img src="image/' + pagezonedtls[i].image.filename + '" width="100%" height="100%"/></li>');
					}
				}
				$(this).find('#PagezoneCT').append(ul_element);
				$(ul_element).bxSlider(slider_option);
				resize($(this));
			}
		});
	};
	
	var resize = function (div) {
		$(div).find('.bx-wrapper').css({
			height: $(div).height(),
			border: '0px',
		});
		$(div).find('.bx-viewport').css({
			height: $(div).height(),
		});
		$(div).find('.bx-viewport').find('img').css({
			height: $(div).height(),
		});
	}

	return {
		init: init,
		resize: resize,
	};
}();
