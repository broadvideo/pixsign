var ReviewModule = function () {
	var _page;
	var _pagezone;
	var _submitflag = false;

	var init = function () {
		initPageTable();
		initReviewModal();
		initPageModal();
	};

	var refresh = function () {
		$('#PageTable').dataTable()._fnAjaxUpdate();
	};
	
	var initPageTable = function () {
		$('#PageTable thead').css('display', 'none');
		$('#PageTable tbody').css('display', 'none');
		$('#PageTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 16, 36, 72, 108 ],
								[ 16, 36, 72, 108 ] 
								],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'page!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }],
			'iDisplayLength' : 16,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#PageContainer').length < 1) {
					$('#PageTable').append('<div id="PageContainer"></div>');
				}
				$('#PageContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 4 == 0) {
					pagehtml = '';
					pagehtml += '<div class="row" >';
				}
				pagehtml += '<div class="col-md-3 col-xs-3">';
				pagehtml += '<h3 class="pixtitle">' + aData.name + '</h3>';

				pagehtml += '<a href="javascript:;" pageid="' + aData.pageid + '" class="fancybox">';
				pagehtml += '<div class="thumbs">';
				if (aData.snapshot != null) {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					pagehtml += '<img src="/pixsigndata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				pagehtml += '</div></a>';

				pagehtml += '<div privilegeid="101010">';
				//pagehtml += '<a href="javascript:;" pageid="' + aData.pageid + '" class="btn default btn-xs blue pix-detail"><i class="fa fa-stack-overflow"></i> ' + common.view.detail + '</a>';
				pagehtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-review"><i class="fa fa-eye"></i> ' + common.view.review + '</a> </div>';

				pagehtml += '</div>';
				if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#PageTable').dataTable().fnGetData().length) {
					pagehtml += '</div>';
					if ((iDisplayIndex+1) != $('#PageTable').dataTable().fnGetData().length) {
						pagehtml += '<hr/>';
					}
					$('#PageContainer').append(pagehtml);
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
						var pageid = $(this).attr('pageid');
						$.ajax({
							type : 'GET',
							url : 'page!get.action',
							data : {pageid: pageid},
							success : function(data, status) {
								if (data.errorcode == 0) {
									$.fancybox({
										openEffect	: 'none',
										closeEffect	: 'none',
										closeBtn : false,
								        padding : 0,
								        content: '<div id="PagePreview"></div>',
								        title: pageid,
								    });
									PagePreviewModule.preview($('#PagePreview'), data.page, 800);
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
		$('#PageTable_wrapper').addClass('form-inline');
		$('#PageTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#PageTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#PageTable_wrapper .dataTables_length select').select2();
		$('#PageTable').css('width', '100%').css('table-layout', 'fixed');
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
				url : 'page!review.action',
				data : $('#ReviewForm').serialize(),
				success : function(data, status) {
					_submitflag = false;
					Metronic.unblockUI();
					$('#ReviewModal').modal('hide');
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
						$('#PageTable').dataTable()._fnAjaxUpdate();
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
			_page = $('#PageTable').dataTable().fnGetData(index);
			$('#ReviewForm input[name="page.pageid"]').val(_page.pageid);
			$('#ReviewModal').modal();
		});

	};
	
	var initPageModal = function () {
		$('#PagezonedtlTable').dataTable({
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
			if (_page != null && _page != undefined && e.target == this) {
				var width = Math.floor($('#PageDiv').parent().width());
				var scale = _page.width / width;
				var height = _page.height / scale;
				$('#PageDiv').css('width', width);
				$('#PageDiv').css('height', height);
			}
		});

		$('body').on('click', '.pix-detail', function(event) {
			var pageid = $(event.target).attr('pageid');
			if (pageid == undefined) {
				pageid = $(event.target).parent().attr('pageid');
			}
			$.ajax({
				type : 'GET',
				url : 'page!get.action',
				data : {pageid: pageid},
				success : function(data, status) {
					if (data.errorcode == 0) {
						_page = data.page;
						_pagezone = _page.pagezones[0];
						
						$('.form-group').removeClass('has-error');
						$('.help-block').remove();
						if (_page.width > _page.height) {
							$('#PageCol1').attr('class', 'col-md-6 col-sm-6');
							$('#PageCol2').attr('class', 'col-md-6 col-sm-6');
						} else {
							$('#PageCol1').attr('class', 'col-md-5 col-sm-5');
							$('#PageCol2').attr('class', 'col-md-7 col-sm-7');
						}
						$('#PageModal').modal();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		});

		$('#PageModal').on('shown.bs.modal', function (e) {
			$('.pagezone-content').css('display', 'none');
			$('.pagezone-dtl').css('display', 'none');
			$('#PageDiv').empty();
			$('#PageDiv').css('position', 'relative');
			$('#PageDiv').css('margin-left', 'auto');
			$('#PageDiv').css('margin-right', 'auto');
			$('#PageDiv').css('border', '1px solid #000');
			
			var scale;
			if (_page.width > _page.height) {
				var width = Math.floor($('#PageDiv').parent().width());
				scale = _page.width / width;
				var height = _page.height / scale;
			} else {
				var height = Math.floor($('#PageDiv').parent().width());
				scale = _page.height / height;
				var width = _page.width / scale;
			}
			$('#PageDiv').css('width' , width);
			$('#PageDiv').css('height' , height);
			
			var zones = _page.pagezones;
			for (var i = 0; i < zones.length; i++) {
				var zone = zones[i];
				var zonedtls = zone.pagezonedtls;

				var zone_div = document.createElement('div');
				zone_div.id = 'PagezoneDiv' + zone.pagezoneid;
				var background_div = document.createElement('div');
				background_div.id = 'background';
				var inner_div = document.createElement('div');
				inner_div.id = 'inner';
				$(zone_div).append(background_div);
				$(zone_div).append(inner_div);
				$('#PageDiv').append(zone_div);

				$(zone_div).css({
					'position': 'absolute',
					'width': 100*zone.width/_page.width + '%',
					'height': 100*zone.height/_page.height + '%',
					'top': 100*zone.topoffset/_page.height + '%', 
					'left': 100*zone.leftoffset/_page.width + '%', 
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
					$(background_div).css({'background-image': 'url(/pixsigndata' + zone.bgimage.thumbnail + ')' });
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
						$(zone_div).find('img').attr('src', '/pixsigndata' + zonedtls[0].video.thumbnail);
						$(zone_div).find('img').attr('width', '100%');
						$(zone_div).find('img').attr('height', '100%');
					} else if (zonedtls.length > 0 && zonedtls[0].image != null) {
						$(zone_div).find('img').attr('src', '/pixsigndata' + zonedtls[0].image.thumbnail);
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
					$(inner_div).find('span').html('深圳 20 ~ 17�? 多云转小�? <img src="http://api.map.baidu.com/images/weather/day/duoyun.png" /><img src="http://api.map.baidu.com/images/weather/night/xiaoyu.png" />');
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
						$(inner_div).find('img').attr('src', '/pixsignage/img/region/region-navigate-h.jpg');
					} else {
						$(inner_div).find('img').attr('src', '/pixsignage/img/region/region-navigate-v.jpg');
					}
					$(inner_div).find('img').attr('width', '100%');
					$(inner_div).find('img').attr('height', '100%');
				} else if (zone.type == 9) {
					//Control Zone
					var img_element = document.createElement('img');
					$(inner_div).append(img_element);
					$(inner_div).find('img').attr('src', '/pixsignage/img/region/region-qrcode.jpg');
					$(inner_div).find('img').attr('width', '100%');
					$(inner_div).find('img').attr('height', '100%');
				} else if (zone.type == 14) {
					//Stream Zone
					var img_element = document.createElement('img');
					$(inner_div).append(img_element);
					$(inner_div).find('img').attr('src', '/pixsignage/img/region/region-stream.jpg');
					$(inner_div).find('img').attr('width', '100%');
					$(inner_div).find('img').attr('height', '100%');
				} else if (zone.type == 15) {
					//VideoIn Zone
					var img_element = document.createElement('img');
					$(inner_div).append(img_element);
					$(inner_div).find('img').attr('src', '/pixsignage/img/region/region-videoin.jpg');
					$(inner_div).find('img').attr('width', '100%');
					$(inner_div).find('img').attr('height', '100%');
				} else if (zone.type == 16) {
					//DVB Zone
					var img_element = document.createElement('img');
					$(inner_div).append(img_element);
					$(inner_div).find('img').attr('src', '/pixsignage/img/region/region-dvb.jpg');
					$(inner_div).find('img').attr('width', '100%');
					$(inner_div).find('img').attr('height', '100%');
				} else {
					var p_element = document.createElement('p');
					$(p_element).html(eval('common.view.pagezone_type_' + zone.type));
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

		function enterPagezoneFocus(pagezone) {
			$('#PageDiv div').css('border', '0px');
			$('#PagezoneDiv' + pagezone.pagezoneid).css('border', '3px solid #FF0000');
			$('.pagezone-title').html(eval('common.view.region_mainflag_' + pagezone.mainflag) + eval('common.view.region_type_' + pagezone.type));
			
			if (_pagezone.type == 1) {
				$('.pagezone-content').css('display', 'none');
				$('.pagezone-dtl').css('display', 'block');
				
				$('#PagezonedtlTable').dataTable().fnClearTable();
				if (_pagezone.pagezonedtls != null) {
					for (var i=0; i<_pagezone.pagezonedtls.length; i++) {
						var pagezonedtl = _pagezone.pagezonedtls[i];
						var thumbwidth = 100;
						var thumbnail = '';
						var thumbhtml = '';
						var medianame = '';
						if (pagezonedtl.objtype == 1) {
							mediatype = common.view.video;
							medianame = pagezonedtl.video.name;
							if (pagezonedtl.video.thumbnail == null) {
								thumbnail = '/pixsignage/img/video.jpg';
							} else {
								thumbnail = '/pixsigndata' + pagezonedtl.video.thumbnail;
							}
							thumbhtml += '<a href="/pixsigndata/video/preview/' + pagezonedtl.video.videoid + '.mp4" class="fancybox">';
							thumbhtml += '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%"></div></a>';
						} else if (pagezonedtl.objtype == 2) {
							mediatype = common.view.image;
							medianame = pagezonedtl.image.name;
							thumbwidth = pagezonedtl.image.width > pagezonedtl.image.height? 100 : 100*pagezonedtl.image.width/pagezonedtl.image.height;
							thumbnail = '/pixsigndata' + pagezonedtl.image.thumbnail;
							thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + medianame + '"></div>';
						} else {
							mediatype = common.view.unknown;
						}
						$('#PagezonedtlTable').dataTable().fnAddData([pagezonedtl.sequence, mediatype, thumbhtml, medianame]);
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
			} else if (_pagezone.type == 2 || _pagezone.type == 3 || _pagezone.type == 4) {
				$('.pagezone-content').css('display', 'block');
				$('.pagezone-dtl').css('display', 'none');
				$('.pagezone-content').html(_pagezone.content);
			} else if (_pagezone.type == 14) {
				$('.pagezone-content').css('display', 'none');
				$('.pagezone-dtl').css('display', 'block');
				$('#PagezonedtlTable').dataTable().fnClearTable();
				if (_pagezone.pagezonedtls != null) {
					for (var i=0; i<_pagezone.pagezonedtls.length; i++) {
						var pagezonedtl = _pagezone.pagezonedtls[i];
						if (pagezonedtl.objtype == 5) {
							$('#PagezonedtlTable').dataTable().fnAddData([pagezonedtl.sequence, common.view.stream, '', pagezonedtl.stream.url]);
						}
					}
				}
			} else {
				$('.pagezone-type').css('display', 'none');
				$('.pagezone-content').css('display', 'none');
				$('.pagezone-dtl').css('display', 'none');
			}
		}

		$('#PageDiv').click(function(e){
			var scale = _page.width / $('#PageDiv').width();
			var offset = $(this).offset();
			var posX = (e.pageX - offset.left) * scale;
			var posY = (e.pageY - offset.top) * scale;
			
			var pagezones = _page.pagezones.filter(function (el) {
				var width = parseInt(el.width);
				var height = parseInt(el.height);
				var leftoffset = parseInt(el.leftoffset);
				var topoffset = parseInt(el.topoffset);
				return (posX > leftoffset) && (posX < (leftoffset + width)) && (posY > topoffset) && (posY < (topoffset + height));
			});
			if (pagezones.length > 0) {
				pagezones.sort(function(a, b) {
					return (a.width + a.height - b.width - b.height);
				});

				//_pagezone = pagezones[0];
				var index = 10000;
				for (var i=0; i<pagezones.length; i++) {
					if (_pagezone != null && _pagezone.pagezoneid == pagezones[i].pagezoneid) {
						index = i;
						break;
					}
				}
				var oldPagezone = _pagezone;
				if (index >= (pagezones.length -1)) {
					_pagezone = pagezones[0];
				} else {
					_pagezone = pagezones[index+1];
				}
				enterPagezoneFocus(_pagezone);
			}
		});

	}
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
