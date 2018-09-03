var ReviewModule = function () {
	var _bundle;
	var _bundlezone;
	var _submitflag = false;

	var init = function () {
		initBundleTable();
		initReviewModal();
		initBundleModal();
	};

	var refresh = function () {
		$('#BundleTable').dataTable()._fnAjaxUpdate();
	};
	
	var initBundleTable = function () {
		$('#BundleTable thead').css('display', 'none');
		$('#BundleTable tbody').css('display', 'none');
		$('#BundleTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 16, 36, 72, 108 ],
								[ 16, 36, 72, 108 ] 
								],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'bundle!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }],
			'iDisplayLength' : 16,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#BundleContainer').length < 1) {
					$('#BundleTable').append('<div id="BundleContainer"></div>');
				}
				$('#BundleContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 4 == 0) {
					bundlehtml = '';
					bundlehtml += '<div class="row" >';
				}
				bundlehtml += '<div class="col-md-3 col-xs-3">';
				bundlehtml += '<h3 class="pixtitle">' + aData.name + '</h3>';

				bundlehtml += '<a href="javascript:;" bundleid="' + aData.bundleid + '" class="fancybox">';
				bundlehtml += '<div class="thumbs">';
				if (aData.snapshot != null) {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					bundlehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				bundlehtml += '</div></a>';

				bundlehtml += '<div privilegeid="101010">';
				bundlehtml += '<a href="javascript:;" bundleid="' + aData.bundleid + '" class="btn default btn-xs blue pix-detail"><i class="fa fa-stack-overflow"></i> ' + common.view.detail + '</a>';
				bundlehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-review"><i class="fa fa-eye"></i> ' + common.view.review + '</a> </div>';

				bundlehtml += '</div>';
				if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#BundleTable').dataTable().fnGetData().length) {
					bundlehtml += '</div>';
					if ((iDisplayIndex+1) != $('#BundleTable').dataTable().fnGetData().length) {
						bundlehtml += '<hr/>';
					}
					$('#BundleContainer').append(bundlehtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('.thumbs').each(function(i) {
					$(this).width($(this).parent().closest('div').width());
					$(this).height($(this).parent().closest('div').width());
				});
				$('.fancybox').each(function(index,item) {
					$(this).click(function() {
						var bundleid = $(this).attr('bundleid');
						$.ajax({
							type : 'GET',
							url : 'bundle!get.action',
							data : {bundleid: bundleid},
							success : function(data, status) {
								if (data.errorcode == 0) {
									$.fancybox({
										openEffect	: 'none',
										closeEffect	: 'none',
										closeBtn : false,
								        padding : 0,
								        content: '<div id="BundlePreview"></div>',
								        title: bundleid,
								    });
									BundlePreviewModule.preview($('#BundlePreview'), data.bundle, 800);
								} else {
									bootbox.alert(common.tips.error + data.errormsg);
								}
							},
							error : function() {
								console.log('failue');
							}
						});
					    return false;
					})
				});
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'reviewflag','value':'0' });
				aoData.push({'name':'homeflag','value':'1' });
			}
		});
		$('#BundleTable_wrapper').addClass('form-inline');
		$('#BundleTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#BundleTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#BundleTable_wrapper .dataTables_length select').select2();
		$('#BundleTable').css('width', '100%').css('table-layout', 'fixed');
	};
	
	var initReviewModal = function () {
		var formHandler = new FormHandler($('#ReviewForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.submitHandler = function(form) {
			if (_submitflag) {
				return;
			}
			_submitflag = true;
			Metronic.blockUI({
				zIndex: 20000,
				animate: true
			});
			$.ajax({
				type : 'POST',
				url : 'bundle!review.action',
				data : $('#ReviewForm').serialize(),
				success : function(data, status) {
					_submitflag = false;
					Metronic.unblockUI();
					$('#ReviewModal').modal('hide');
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
						$('#BundleTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					_submitflag = false;
					Metronic.unblockUI();
					$('#ReviewModal').modal('hide');
					console.log('failue');
				}
			});
		};
		$('#ReviewForm').validate(formHandler.validateOption);
		$('[type=submit]', $('#ReviewModal')).on('click', function(event) {
			if ($('#ReviewForm').valid()) {
				$('#ReviewForm').submit();
			}
		});

		$('body').on('click', '.pix-review', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_bundle = $('#BundleTable').dataTable().fnGetData(index);
			$('#ReviewForm input[name="bundle.bundleid"]').val(_bundle.bundleid);
			$('#ReviewModal').modal();
		});

	};
	
	var initBundleModal = function () {
		$('#BundlezonedtlTable').dataTable({
			'sDom' : 't',
			'iDisplayLength' : -1,
			'aoColumns' : [ {'sTitle' : '', 'bSortable' : false }, 
							{'sTitle' : '', 'bSortable' : false }, 
							{'sTitle' : '', 'bSortable' : false }, 
							{'sTitle' : '', 'bSortable' : false }],
			'oLanguage' : { 'sZeroRecords' : common.view.empty,
							'sEmptyTable' : common.view.empty }, 
		});

		$(window).resize(function(e) {
			if (_bundle != null && _bundle != undefined && e.target == this) {
				var width = Math.floor($('#BundleDiv').parent().width());
				var scale = _bundle.width / width;
				var height = _bundle.height / scale;
				$('#BundleDiv').css('width', width);
				$('#BundleDiv').css('height', height);
			}
		});

		$('body').on('click', '.pix-detail', function(event) {
			var bundleid = $(event.target).attr('bundleid');
			if (bundleid == undefined) {
				bundleid = $(event.target).parent().attr('bundleid');
			}
			$.ajax({
				type : 'GET',
				url : 'bundle!get.action',
				data : {bundleid: bundleid},
				success : function(data, status) {
					if (data.errorcode == 0) {
						_bundle = data.bundle;
						_bundlezone = _bundle.bundlezones[0];
						
						$('.form-group').removeClass('has-error');
						$('.help-block').remove();
						if (_bundle.width > _bundle.height) {
							$('#BundleCol1').attr('class', 'col-md-6 col-sm-6');
							$('#BundleCol2').attr('class', 'col-md-6 col-sm-6');
						} else {
							$('#BundleCol1').attr('class', 'col-md-5 col-sm-5');
							$('#BundleCol2').attr('class', 'col-md-7 col-sm-7');
						}
						$('#BundleModal').modal();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		});

		$('#BundleModal').on('shown.bs.modal', function (e) {
			$('.bundlezone-content').css('display', 'none');
			$('.bundlezone-dtl').css('display', 'none');
			$('#BundleDiv').empty();
			$('#BundleDiv').css('position', 'relative');
			$('#BundleDiv').css('margin-left', 'auto');
			$('#BundleDiv').css('margin-right', 'auto');
			$('#BundleDiv').css('border', '1px solid #000');
			
			var scale;
			if (_bundle.width > _bundle.height) {
				var width = Math.floor($('#BundleDiv').parent().width());
				scale = _bundle.width / width;
				var height = _bundle.height / scale;
			} else {
				var height = Math.floor($('#BundleDiv').parent().width());
				scale = _bundle.height / height;
				var width = _bundle.width / scale;
			}
			$('#BundleDiv').css('width' , width);
			$('#BundleDiv').css('height' , height);
			
			var zones = _bundle.bundlezones;
			for (var i = 0; i < zones.length; i++) {
				var zone = zones[i];
				var zonedtls = zone.bundlezonedtls;

				var zone_div = document.createElement('div');
				zone_div.id = 'BundlezoneDiv' + zone.bundlezoneid;
				var background_div = document.createElement('div');
				background_div.id = 'background';
				var inner_div = document.createElement('div');
				inner_div.id = 'inner';
				$(zone_div).append(background_div);
				$(zone_div).append(inner_div);
				$('#BundleDiv').append(zone_div);

				$(zone_div).css({
					'position': 'absolute',
					'width': 100*zone.width/_bundle.width + '%',
					'height': 100*zone.height/_bundle.height + '%',
					'top': 100*zone.topoffset/_bundle.height + '%', 
					'left': 100*zone.leftoffset/_bundle.width + '%', 
					'z-index': zone.zindex,
					'-moz-transform': 'matrix(1, 0, 0, 1, 0, 0)',
					'-webkit-transform': 'matrix(1, 0, 0, 1, 0, 0)',
				});
				$(background_div).css({
					'position': 'absolute',
					'width': '100%',
					'height': '100%',
					'opacity': parseInt(zone.bgopacity)/255, 
					'background-color': zone.bgcolor,
					'background-size': '100% 100%',
					'background-repeat': 'no-repeat',
				});
				if (zone.bgimage != null) {
					$(background_div).css({'background-image': 'url(/pixsigdata' + zone.bgimage.thumbnail + ')' });
				} else {
					$(background_div).css({'background-image': 'none'});
				}
				$(inner_div).css({
					'position': 'absolute',
					'height': '100%', 
					'width': '100%', 
				});
				if (zone.type == 1) {
					//Play Zone
					var img_element = document.createElement('img');
					$(inner_div).append(img_element);
					if (zonedtls.length > 0 && zonedtls[0].video != null) {
						$(zone_div).find('img').attr('src', '/pixsigdata' + zonedtls[0].video.thumbnail);
						$(zone_div).find('img').attr('width', '100%');
						$(zone_div).find('img').attr('height', '100%');
					} else if (zonedtls.length > 0 && zonedtls[0].image != null) {
						$(zone_div).find('img').attr('src', '/pixsigdata' + zonedtls[0].image.thumbnail);
						$(zone_div).find('img').attr('width', '100%');
						$(zone_div).find('img').attr('height', '100%');
					}
				} else if (zone.type == '2') {
					//Widget Zone
					var p_element = document.createElement('p');
					$(p_element).html(zone.content);
					$(inner_div).append(p_element);
					$(inner_div).css({
						'box-sizing': 'border-box',
						'text-align': 'left', 
						'word-wrap': 'break-word',
					});
				} else if (zone.type == '3' || zone.type == '4') {
					//Text & Scroll Zone
					var p_element = document.createElement('p');
					$(p_element).html(zone.content);
					$(inner_div).append(p_element);			
					$(inner_div).css({
						'box-sizing': 'border-box',
						'color': zone.color, 
						'text-align': 'center', 
						'font-size': Math.ceil(zone.size * zone.height / 100 / scale) + 'px', 
						'line-height': Math.ceil(zone.height / scale) + 'px', 
						'word-wrap': 'break-word',
					});
					$(p_element).css({
						'text-align': 'center', 
						'word-wrap': 'break-word',
						'white-space': 'pre-wrap',
					});
				} else if (zone.type == 5) {
					//Date Zone
					var p_element = document.createElement('p');
					$(p_element).html(new Date().pattern(zone.dateformat));
					$(inner_div).append(p_element);			
					$(inner_div).css({
						'box-sizing': 'border-box',
						'color': zone.color, 
						'text-align': 'center', 
						'font-size': Math.ceil(zone.size * zone.height / 100 / scale) + 'px', 
						'line-height': Math.ceil(zone.height / scale) + 'px', 
						'word-wrap': 'break-word',
					});
					$(p_element).css({
						'text-align': 'center', 
						'word-wrap': 'break-word',
						'white-space': 'pre-wrap',
					});
				} else if (zone.type == 6) {
					//Weather Zone
					var span_element = document.createElement('span');
					$(inner_div).append(span_element);
					$(inner_div).find('span').css({
						'text-align': 'center',
						'overflow': 'hidden',
						'text-overflow': 'clip',
						'white-space': 'nowrap',
						'color': zone.color,
						'font-size': Math.ceil(zone.size * zone.height / 100 / scale) + 'px', 
						'line-height': Math.ceil(zone.height / scale) + 'px', 
					});
					$(inner_div).find('span').html('深圳 20 ~ 17℃ 多云转小雨 <img src="http://api.map.baidu.com/images/weather/day/duoyun.png" /><img src="http://api.map.baidu.com/images/weather/night/xiaoyu.png" />');
					$(inner_div).find('img').each(function() {
						$(this).css('height', Math.ceil(zone.size * zone.height / 100 / scale) + 'px');
						$(this).css('display', 'inline');
					});
				} else if (zone.type == 7) {
					//Button Zone
					var p_element = document.createElement('p');
					$(p_element).html(zone.touchlabel);
					$(inner_div).append(p_element);			
					$(inner_div).css({
						'box-sizing': 'border-box',
						'color': zone.color, 
						'text-align': 'center', 
						'font-size': Math.ceil(zone.size * zone.height / 100 / scale) + 'px', 
						'line-height': Math.ceil(zone.height / scale) + 'px', 
						'word-wrap': 'break-word',
					});
					$(p_element).css({
						'text-align': 'center', 
						'word-wrap': 'break-word',
						'white-space': 'pre-wrap',
					});
				} else if (zone.type == 8) {
					//Navigator Zone
					var img_element = document.createElement('img');
					$(inner_div).append(img_element);
					if (zone.width > zone.height) {
						$(inner_div).find('img').attr('src', '/pixsignage/img/zone/zone-navigate-h.jpg');
					} else {
						$(inner_div).find('img').attr('src', '/pixsignage/img/zone/zone-navigate-v.jpg');
					}
					$(inner_div).find('img').attr('width', '100%');
					$(inner_div).find('img').attr('height', '100%');
				} else if (zone.type == 9) {
					//Control Zone
					var img_element = document.createElement('img');
					$(inner_div).append(img_element);
					$(inner_div).find('img').attr('src', '/pixsignage/img/zone/zone-qrcode.jpg');
					$(inner_div).find('img').attr('width', '100%');
					$(inner_div).find('img').attr('height', '100%');
				} else if (zone.type == 14) {
					//Stream Zone
					var img_element = document.createElement('img');
					$(inner_div).append(img_element);
					$(inner_div).find('img').attr('src', '/pixsignage/img/zone/zone-stream.jpg');
					$(inner_div).find('img').attr('width', '100%');
					$(inner_div).find('img').attr('height', '100%');
				} else if (zone.type == 15) {
					//VideoIn Zone
					var img_element = document.createElement('img');
					$(inner_div).append(img_element);
					$(inner_div).find('img').attr('src', '/pixsignage/img/zone/zone-videoin.jpg');
					$(inner_div).find('img').attr('width', '100%');
					$(inner_div).find('img').attr('height', '100%');
				} else if (zone.type == 16) {
					//DVB Zone
					var img_element = document.createElement('img');
					$(inner_div).append(img_element);
					$(inner_div).find('img').attr('src', '/pixsignage/img/zone/zone-dvb.jpg');
					$(inner_div).find('img').attr('width', '100%');
					$(inner_div).find('img').attr('height', '100%');
				} else if (zone.type == 101 || zone.type == 102) {
					//Massage Zone
					var img_element = document.createElement('img');
					$(inner_div).append(img_element);
					$(inner_div).find('img').attr('src', '/pixsignage/img/zone/zone-' + zone.type + '.jpg');
					$(inner_div).find('img').attr('width', '100%');
					$(inner_div).find('img').attr('height', '100%');
				} else {
					var p_element = document.createElement('p');
					$(p_element).html(eval('common.view.bundlezone_type_' + zone.type));
					$(inner_div).append(p_element);
					$(inner_div).css({
						'box-sizing': 'border-box',
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
		});

		function enterBundlezoneFocus(bundlezone) {
			$('#BundleDiv div').css('border', '0px');
			$('#BundlezoneDiv' + bundlezone.bundlezoneid).css('border', '3px solid #FF0000');
			$('.bundlezone-title').html(eval('common.view.region_mainflag_' + bundlezone.mainflag) + eval('common.view.region_type_' + bundlezone.type));
			
			if (_bundlezone.type == 1) {
				$('.bundlezone-content').css('display', 'none');
				$('.bundlezone-dtl').css('display', 'block');
				
				$('#BundlezonedtlTable').dataTable().fnClearTable();
				if (_bundlezone.bundlezonedtls != null) {
					for (var i=0; i<_bundlezone.bundlezonedtls.length; i++) {
						var bundlezonedtl = _bundlezone.bundlezonedtls[i];
						var thumbwidth = 100;
						var thumbnail = '';
						var thumbhtml = '';
						var medianame = '';
						if (bundlezonedtl.objtype == 1) {
							mediatype = common.view.video;
							medianame = bundlezonedtl.video.name;
							if (bundlezonedtl.video.thumbnail == null) {
								thumbnail = '/pixsignage/img/video.jpg';
							} else {
								thumbnail = '/pixsigdata' + bundlezonedtl.video.thumbnail;
							}
							thumbhtml += '<a href="/pixsigdata/video/preview/' + bundlezonedtl.video.videoid + '.mp4" class="fancybox">';
							thumbhtml += '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%"></div></a>';
						} else if (bundlezonedtl.objtype == 2) {
							mediatype = common.view.image;
							medianame = bundlezonedtl.image.name;
							thumbwidth = bundlezonedtl.image.width > bundlezonedtl.image.height? 100 : 100*bundlezonedtl.image.width/bundlezonedtl.image.height;
							thumbnail = '/pixsigdata' + bundlezonedtl.image.thumbnail;
							thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + medianame + '"></div>';
						} else {
							mediatype = common.view.unknown;
						}
						$('#BundlezonedtlTable').dataTable().fnAddData([bundlezonedtl.sequence, mediatype, thumbhtml, medianame]);
					}
					$('.fancybox').click(function() {
						var myVideo = this.href;
						$.fancybox({
							openEffect	: 'none',
							closeEffect	: 'none',
							closeBtn : false,
				            padding : 0,
				            content: '<div id="video_container">Loading the player ... </div>',
				            afterShow: function(){
				            	jwplayer.key='rMF5t+PiENAlr4SobpLajtNkDjTaqzQToz13+5sNGLI=';
				                jwplayer('video_container').setup({ 
				                	stretching: 'fill',
				                	image: '/pixres/global/plugins/jwplayer/preview.jpg',
				                    file: myVideo,
				                    width: 760,
				                    height: 428,
				                    autostart: true,
				                    primary: 'flash', 
				                    bufferlength:10,
				                    flashplayer: '/pixres/global/plugins/jwplayer/jwplayer.flash.swf'
				                });
				            }
				        });
				        return false;
					});
				}
			} else if (_bundlezone.type == 2 || _bundlezone.type == 3 || _bundlezone.type == 4) {
				$('.bundlezone-content').css('display', 'block');
				$('.bundlezone-dtl').css('display', 'none');
				$('.bundlezone-content').html(_bundlezone.content);
			} else if (_bundlezone.type == 14) {
				$('.bundlezone-content').css('display', 'none');
				$('.bundlezone-dtl').css('display', 'block');
				$('#BundlezonedtlTable').dataTable().fnClearTable();
				if (_bundlezone.bundlezonedtls != null) {
					for (var i=0; i<_bundlezone.bundlezonedtls.length; i++) {
						var bundlezonedtl = _bundlezone.bundlezonedtls[i];
						if (bundlezonedtl.objtype == 5) {
							$('#BundlezonedtlTable').dataTable().fnAddData([bundlezonedtl.sequence, common.view.stream, '', bundlezonedtl.stream.url]);
						}
					}
				}
			} else {
				$('.bundlezone-type').css('display', 'none');
				$('.bundlezone-content').css('display', 'none');
				$('.bundlezone-dtl').css('display', 'none');
			}
		}

		$('#BundleDiv').click(function(e){
			var scale = _bundle.width / $('#BundleDiv').width();
			var offset = $(this).offset();
			var posX = (e.pageX - offset.left) * scale;
			var posY = (e.pageY - offset.top) * scale;
			
			var bundlezones = _bundle.bundlezones.filter(function (el) {
				var width = parseInt(el.width);
				var height = parseInt(el.height);
				var leftoffset = parseInt(el.leftoffset);
				var topoffset = parseInt(el.topoffset);
				return (posX > leftoffset) && (posX < (leftoffset + width)) && (posY > topoffset) && (posY < (topoffset + height));
			});
			if (bundlezones.length > 0) {
				bundlezones.sort(function(a, b) {
					return (a.width + a.height - b.width - b.height);
				});

				//_bundlezone = bundlezones[0];
				var index = 10000;
				for (var i=0; i<bundlezones.length; i++) {
					if (_bundlezone != null && _bundlezone.bundlezoneid == bundlezones[i].bundlezoneid) {
						index = i;
						break;
					}
				}
				var oldBundlezone = _bundlezone;
				if (index >= (bundlezones.length -1)) {
					_bundlezone = bundlezones[0];
				} else {
					_bundlezone = bundlezones[index+1];
				}
				enterBundlezoneFocus(_bundlezone);
			}
		});

	}
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
