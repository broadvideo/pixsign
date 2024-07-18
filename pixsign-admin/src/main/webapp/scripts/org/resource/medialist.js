var MedialistModule = function () {
	var _medialist = {};
	this.MedialistTree = new BranchTree($('#MedialistPortlet'));

	var init = function () {
		initMedialistTable();
		initMedialistEvent();
		initMedialistEditModal();
		initMedialistDtlModal();
	};

	var refresh = function () {
		$('#MedialistTable').dataTable()._fnAjaxUpdate();
	};
	
	var initMedialistTable = function () {
		$('#MedialistTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'medialist!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '15%' }, 
			                {'sTitle' : common.view.detail, 'mData' : 'medialistid', 'bSortable' : false, 'sWidth' : '60%' },
							{'sTitle' : '', 'mData' : 'medialistid', 'bSortable' : false, 'sWidth' : '25%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var listhtml = '';
				for (var i=0; i<aData.medialistdtls.length; i++) {
					var medialistdtl = aData.medialistdtls[i];
					if (i % 6 == 0) {
						listhtml += '<div class="row" >';
					}
					listhtml += '<div class="col-md-2 col-xs-2">';
					if (medialistdtl.objtype == 1) {
						listhtml += '<div class="thumbs">';
						if (medialistdtl.video.thumbnail == null) {
							listhtml += '<img src="../img/video.jpg" class="imgthumb" width="100%" alt="' + medialistdtl.video.name + '" />';
						} else {
							listhtml += '<img src="/pixsigndata' + medialistdtl.video.thumbnail + '" class="imgthumb" width="100%" alt="' + medialistdtl.video.name + '" />';
						}
						listhtml += '</div>';
						listhtml += '<h6 class="pixtitle">' + medialistdtl.video.name + '</h6>';
					} else if (medialistdtl.objtype == 2) {
						var thumbwidth = medialistdtl.image.width > medialistdtl.image.height? 100 : 100*medialistdtl.image.width/medialistdtl.image.height;
						listhtml += '<div class="thumbs">';
						listhtml += '<img src="/pixsigndata' + medialistdtl.image.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + medialistdtl.image.name + '" />';
						listhtml += '</div>';
						listhtml += '<h6 class="pixtitle">' + medialistdtl.image.name + '</h6>';
					}
					listhtml += '</div>';
					if ((i+1) % 6 == 0 || (i+1) == aData.medialistdtls.length) {
						listhtml += '</div>';
					}
				}
				$('td:eq(1)', nRow).html(listhtml);
				
				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-detail"><i class="fa fa-list-ul"></i> ' + common.view.detail + '</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				buttonhtml += '</div>';
				$('td:eq(2)', nRow).html(buttonhtml);
				
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#MedialistTable .thumbs').each(function(i) {
					console.log($(this).parent().width());
					$(this).height($(this).parent().width());
				});
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':MedialistTree.branchid });
			}
		});
		$('#MedialistTable_wrapper').addClass('form-inline');
		$('#MedialistTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#MedialistTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#MedialistTable_wrapper .dataTables_length select').select2();
		$('#MedialistTable').css('width', '100%');
	};
	
	var initMedialistEvent = function () {
		$('body').on('click', '.pix-sync', function(event) {
			var target = $(event.target);
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				target = $(event.target).parent();
				index = $(event.target).parent().attr('data-id');
			}
			var medialist = $('#MedialistTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.syncmedialist, function(result) {
				if (result == true) {
					$.ajax({
						type : 'GET',
						url : 'medialist!sync.action',
						cache: false,
						data : {
							medialistid: medialist.medialistid,
						},
						dataType : 'json',
						contentType : 'application/json;charset=utf-8',
						beforeSend: function ( xhr ) {
							Metronic.startPageLoading({animate: true});
						},
						success : function(data, status) {
							Metronic.stopPageLoading();
							if (data.errorcode == 0) {
								bootbox.alert(common.tips.success);
							} else {
								bootbox.alert(common.tips.error + data.errormsg);
							}
						},
						error : function() {
							Metronic.stopPageLoading();
							console.log('failue');
						}
					});				
				}
			});
		});

		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_medialist = $('#MedialistTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _medialist.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'medialist!delete.action',
						cache: false,
						data : {
							'medialist.medialistid': _medialist.medialistid
						},
						success : function(data, status) {
							if (data.errorcode == 0) {
								refresh();
							} else {
								bootbox.alert(common.tips.error + data.errormsg);
							}
						},
						error : function() {
							console.log('failue');
						}
					});				
				}
			 });
		});
	};

	var initMedialistEditModal = function () {
		var formHandler = new FormHandler($('#MedialistEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['medialist.name'] = {};
		formHandler.validateOption.rules['medialist.name']['required'] = true;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#MedialistEditForm').attr('action'),
				data : $('#MedialistEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#MedialistEditModal').modal('hide');
						bootbox.alert(common.tips.success);
						refresh();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		};
		$('#MedialistEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#MedialistEditModal')).on('click', function(event) {
			if ($('#MedialistEditForm').valid()) {
				$('#MedialistEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#MedialistEditForm input[name="medialist.branchid"').val(MedialistTree.branchid);
			$('#MedialistEditForm').attr('action', 'medialist!add.action');
			$('#MedialistEditModal').modal();
		});			

		$('#MedialistTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_medialist = $('#MedialistTable').dataTable().fnGetData(index);
			formHandler.setdata('medialist', _medialist);
			$('#MedialistEditForm').attr('action', 'medialist!update.action');
			$('#MedialistEditModal').modal();
		});
	};
	
	var initMedialistDtlModal = function () {
		var tempMedialistdtls;

		$('body').on('click', '.pix-detail', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_medialist = $('#MedialistTable').dataTable().fnGetData(index);
			$('#MedialistDtlTable').dataTable().fnClearTable();

			$.ajax({
				type : 'GET',
				url : 'medialist!dtllist.action',
				data : {'medialistid' : _medialist.medialistid},
				beforeSend: function ( xhr ) {
					Metronic.startPageLoading({animate: true});
				},
				success : function(data, status) {
					Metronic.stopPageLoading();
					if (data.errorcode == 0) {
						tempMedialistdtls = data.aaData;
						for (var i=0; i<tempMedialistdtls.length; i++) {
							var medialistdtl = tempMedialistdtls[i];
							var thumbwidth = 100;
							var thumbnail = '';
							var thumbhtml = '';
							var medianame = '';
							if (medialistdtl.objtype == 1 && medialistdtl.video.type == 1) {
								mediatype = common.view.intvideo;
								medianame = medialistdtl.video.name;
								if (medialistdtl.video.thumbnail == null) {
									thumbnail = '../img/video.jpg';
								} else {
									thumbnail = '/pixsigndata' + medialistdtl.video.thumbnail;
								}
							} else if (medialistdtl.objtype == 1 && medialistdtl.video.type == 2) {
								mediatype = common.view.extvideo;
								medianame = medialistdtl.video.name;
								if (medialistdtl.video.thumbnail == null) {
									thumbnail = '../img/video.jpg';
								} else {
									thumbnail = '/pixsigndata' + medialistdtl.video.thumbnail;
								}
							} else if (medialistdtl.objtype == 2) {
								mediatype = common.view.image;
								medianame = medialistdtl.image.name;
								thumbwidth = medialistdtl.image.width > medialistdtl.image.height? 100 : 100*medialistdtl.image.width/medialistdtl.image.height;
								thumbnail = '/pixsigndata' + medialistdtl.image.thumbnail;
							} else {
								mediatype = common.view.unknown;
							}
							if (thumbnail != '') {
								thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + medianame + '"></div>';
							}
							$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, mediatype, thumbhtml, medianame, 0, 0, 0]);
						}
						
						$('#MedialistDtlModal').modal();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					Metronic.stopPageLoading();
					console.log('failue');
				}
			});
		});

		$('#MedialistDtlModal').on('shown.bs.modal', function (e) {
			$('#VideoTable').dataTable()._fnAjaxUpdate();
		})

		//视频table初始�?
		var VideoTree = new BranchTree($('#VideoTab'));
		$('#VideoTable thead').css('display', 'none');
		$('#VideoTable tbody').css('display', 'none');	
		var videohtml = '';
		$('#VideoTable').dataTable({
			'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 18, 36, 54, 72 ],
							  [ 18, 36, 54, 72 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'video!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'videoid', 'bSortable' : false }],
			'iDisplayLength' : 18,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#VideoContainer').length < 1) {
					$('#VideoTable').append('<div id="VideoContainer"></div>');
				}
				$('#VideoContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					videohtml = '';
					videohtml += '<div class="row" >';
				}
				videohtml += '<div class="col-md-2 col-xs-2">';

				videohtml += '<div id="ThumbContainer" style="position:relative">';
				var thumbnail = '../img/video.jpg';
				var thumbwidth = 100;
				if (aData.thumbnail != null) {
					thumbnail = '/pixsigndata' + aData.thumbnail;
					thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
				}
				videohtml += '<div id="VideoThumb" class="thumbs">';
				videohtml += '<img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				videohtml += '<div class="mask">';
				videohtml += '<div>';
				videohtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
				videohtml += '<a class="btn default btn-sm green pix-medialistdtl-intvideo-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
				videohtml += '</div>';
				videohtml += '</div>';
				videohtml += '</div>';

				videohtml += '</div>';

				videohtml += '</div>';
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#VideoTable').dataTable().fnGetData().length) {
					videohtml += '</div>';
					if ((iDisplayIndex+1) != $('#VideoTable').dataTable().fnGetData().length) {
						videohtml += '<hr/>';
					}
					$('#VideoContainer').append(videohtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#VideoContainer .thumbs').each(function(i) {
					$(this).height($(this).parent().width());
				});
				$('#VideoContainer .mask').each(function(i) {
					$(this).height($(this).parent().parent().width() + 2);
				});
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':VideoTree.branchid });
				aoData.push({'name':'folderid','value':VideoTree.folderid });
				aoData.push({'name':'type','value':1 });
			}
		});
		$('#VideoTable_wrapper').addClass('form-inline');
		$('#VideoTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
		$('#VideoTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
		$('#VideoTable').css('width', '100%');

		//图片table初始�?
		var ImageTree = new BranchTree($('#ImageTab'));
		$('#ImageTable thead').css('display', 'none');
		$('#ImageTable tbody').css('display', 'none');	
		var imagehtml = '';
		$('#ImageTable').dataTable({
			'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 18, 36, 54, 72 ],
							  [ 18, 36, 54, 72 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'image!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'imageid', 'bSortable' : false }],
			'iDisplayLength' : 18,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#ImageContainer').length < 1) {
					$('#ImageTable').append('<div id="ImageContainer"></div>');
				}
				$('#ImageContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					imagehtml = '';
					imagehtml += '<div class="row" >';
				}
				imagehtml += '<div class="col-md-2 col-xs-2">';
				
				imagehtml += '<div id="ThumbContainer" style="position:relative">';
				var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
				imagehtml += '<div id="ImageThumb" class="thumbs">';
				imagehtml += '<img src="/pixsigndata' + aData.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				imagehtml += '<div class="mask">';
				imagehtml += '<div>';
				imagehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
				imagehtml += '<a class="btn default btn-sm green pix-medialistdtl-image-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
				imagehtml += '</div>';
				imagehtml += '</div>';
				imagehtml += '</div>';

				imagehtml += '</div>';

				imagehtml += '</div>';
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#ImageTable').dataTable().fnGetData().length) {
					imagehtml += '</div>';
					if ((iDisplayIndex+1) != $('#ImageTable').dataTable().fnGetData().length) {
						imagehtml += '<hr/>';
					}
					$('#ImageContainer').append(imagehtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#ImageContainer .thumbs').each(function(i) {
					$(this).height($(this).parent().width());
				});
				$('#ImageContainer .mask').each(function(i) {
					$(this).height($(this).parent().parent().width() + 2);
				});
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':ImageTree.branchid });
				aoData.push({'name':'folderid','value':ImageTree.folderid });
			}
		});
		$('#ImageTable_wrapper').addClass('form-inline');
		$('#ImageTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
		$('#ImageTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
		$('#ImageTable').css('width', '100%');

		$('#nav_tab1').click(function(event) {
			$('#VideoTable').dataTable()._fnAjaxUpdate();
		});
		$('#nav_tab2').click(function(event) {
			$('#ImageTable').dataTable()._fnAjaxUpdate();
		});

		//播放明细Table初始�?
		$('#MedialistDtlTable').dataTable({
			'sDom' : 't',
			'iDisplayLength' : -1,
			'aoColumns' : [ {'sTitle' : '', 'bSortable' : false, 'sWidth' : '40px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '60px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '60px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sClass': 'autowrap' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' },
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' },
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '5%' }],
			'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
			'oLanguage' : { 'sZeroRecords' : common.view.empty,
							'sEmptyTable' : common.view.empty }, 
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(4)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-medialistdtl-up"><i class="fa fa-arrow-up"></i></button>');
				$('td:eq(5)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-medialistdtl-down"><i class="fa fa-arrow-down"></i></button>');
				$('td:eq(6)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn red btn-xs pix-medialistdtl-delete"><i class="fa fa-trash-o"></i></button>');
				return nRow;
			}
		});

		//增加本地视频到播放明细Table
		$('body').on('click', '.pix-medialistdtl-intvideo-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#VideoTable').dataTable().fnGetData(rowIndex);
			var medialistdtl = {};
			medialistdtl.medialistdtlid = 0;
			medialistdtl.medialistid = _medialist.medialistid;
			medialistdtl.objtype = '1';
			medialistdtl.objid = data.videoid;
			medialistdtl.sequence = tempMedialistdtls.length + 1;
			tempMedialistdtls[tempMedialistdtls.length] = medialistdtl;

			var thumbnail = '';
			if (data.thumbnail == null) {
				thumbnail = '../img/video.jpg';
			} else {
				thumbnail = '/pixsigndata' + data.thumbnail;
			}
			var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="100%" alt="' + data.name + '"></div>';
			$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, common.view.intvideo, thumbhtml, data.name, 0, 0, 0]);
		});

		//增加图片到播放明细Table
		$('body').on('click', '.pix-medialistdtl-image-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#ImageTable').dataTable().fnGetData(rowIndex);
			var medialistdtl = {};
			medialistdtl.medialistdtlid = 0;
			medialistdtl.medialistid = _medialist.medialistid;
			medialistdtl.objtype = '2';
			medialistdtl.objid = data.imageid;
			medialistdtl.sequence = tempMedialistdtls.length + 1;
			tempMedialistdtls[tempMedialistdtls.length] = medialistdtl;

			var thumbwidth = data.width > data.height? 100 : 100*data.width/data.height;
			var thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="/pixsigndata' + data.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + data.name + '"></div>';
			$('#MedialistDtlTable').dataTable().fnAddData([medialistdtl.sequence, common.view.image, thumbhtml, data.name, 0, 0, 0]);
		});


		//删除播放明细列表某行
		$('body').on('click', '.pix-medialistdtl-delete', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			for (var i=rowIndex; i<$('#MedialistDtlTable').dataTable().fnSettings().fnRecordsDisplay(); i++) {
				var data = $('#MedialistDtlTable').dataTable().fnGetData(i);
				$('#MedialistDtlTable').dataTable().fnUpdate(i, parseInt(i), 0);
			}
			$('#MedialistDtlTable').dataTable().fnDeleteRow(rowIndex);
			
			for (var i=rowIndex; i<tempMedialistdtls.length; i++) {
				tempMedialistdtls[i].sequence = i;
			}
			tempMedialistdtls.splice(rowIndex, 1);
		});

		//上移播放明细列表某行
		$('body').on('click', '.pix-medialistdtl-up', function(event) {
			var rowIndex = $(event.target).attr('data-id');
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			if (rowIndex == 0) {
				return;
			}
			rowIndex = parseInt(rowIndex);
			var movedDta = $('#MedialistDtlTable').dataTable().fnGetData(rowIndex).slice(0);
			var prevData = $('#MedialistDtlTable').dataTable().fnGetData(rowIndex-1).slice(0);
			$('#MedialistDtlTable').dataTable().fnUpdate(prevData[1], rowIndex, 1);
			$('#MedialistDtlTable').dataTable().fnUpdate(prevData[2], rowIndex, 2);
			$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[1], rowIndex-1, 1);
			$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[2], rowIndex-1, 2);
			
			var temp = tempMedialistdtls[rowIndex];
			tempMedialistdtls[rowIndex] =  tempMedialistdtls[rowIndex-1];
			tempMedialistdtls[rowIndex].sequence = rowIndex+1;
			tempMedialistdtls[rowIndex-1] = temp;
			tempMedialistdtls[rowIndex-1].sequence = rowIndex;
		});

		//下移播放明细列表某行
		$('body').on('click', '.pix-medialistdtl-down', function(event) {
			var rowIndex = $(event.target).attr('data-id');
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			if (rowIndex == $('#MedialistDtlTable').dataTable().fnSettings().fnRecordsDisplay() - 1) {
				return;
			}
			rowIndex = parseInt(rowIndex);
			var movedDta = $('#MedialistDtlTable').dataTable().fnGetData(rowIndex).slice(0);
			var nextData = $('#MedialistDtlTable').dataTable().fnGetData(rowIndex+1).slice(0);
			$('#MedialistDtlTable').dataTable().fnUpdate(nextData[1], rowIndex, 1);
			$('#MedialistDtlTable').dataTable().fnUpdate(nextData[2], rowIndex, 2);
			$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[1], rowIndex+1, 1);
			$('#MedialistDtlTable').dataTable().fnUpdate(movedDta[2], rowIndex+1, 2);
			
			var temp = tempMedialistdtls[rowIndex];
			tempMedialistdtls[rowIndex] = tempMedialistdtls[rowIndex+1];
			tempMedialistdtls[rowIndex].sequence = rowIndex+1;
			tempMedialistdtls[rowIndex+1] = temp;
			tempMedialistdtls[rowIndex+1].sequence = rowIndex+2;
		});

		$('[type=submit]', $('#MedialistDtlModal')).on('click', function(event) {
			$.ajax({
				type : 'POST',
				url : 'medialist!dtlsync.action',
				data : '{"medialist":' + $.toJSON(_medialist) + ', "medialistdtls":' + $.toJSON(tempMedialistdtls) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				beforeSend: function ( xhr ) {
					Metronic.startPageLoading({animate: true});
				},
				success : function(data, status) {
					Metronic.stopPageLoading();
					$('#MedialistDtlModal').modal('hide');
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
						$('#MedialistTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					Metronic.stopPageLoading();
					console.log('failue');
				}
			});
		});
	}
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
