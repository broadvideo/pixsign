var PageSelect = function (container, touchctrl) {
	var _self = this;
	var _container = container;
	var _touchctrl = touchctrl;
	var _page = null;
	var timestamp = new Date().getTime();
	var PageTable = $(container).find('.pagetable');
	var TouchpageTable = $(container).find('.touchpagetable');

	var init = function() {
		var PageTree = new BranchTree(_container.find('#PageDiv'));
		_container.find('.pagetable thead').css('display', 'none');
		_container.find('.pagetable tbody').css('display', 'none');	
		var pagehtml = '';
		PageTable.dataTable({
			'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 12, 30, 48, 96 ],
							  [ 12, 30, 48, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'page!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'pageid', 'bSortable' : false }],
			'iDisplayLength' : 12,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if (PageTable.find('#PageContainer').length < 1) {
					PageTable.append('<div id="PageContainer"></div>');
				}
				PageTable.find('#PageContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					pagehtml = '';
					pagehtml += '<div class="row" >';
				}
				pagehtml += '<div class="col-md-2 col-xs-2">';
				
				pagehtml += '<div id="ThumbContainer" style="position:relative">';
				pagehtml += '<div id="PageThumb" class="thumbs">';
				if (aData.snapshot != null && aData.snapshot != '') {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					pagehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				pagehtml += '<div class="mask">';
				pagehtml += '<div>';
				pagehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
				pagehtml += '<a class="btn default btn-sm green pix-page-set" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
				pagehtml += '</div>';
				pagehtml += '</div>';
				pagehtml += '</div>';

				pagehtml += '</div>';

				pagehtml += '</div>';
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == PageTable.dataTable().fnGetData().length) {
					pagehtml += '</div>';
					if ((iDisplayIndex+1) != PageTable.dataTable().fnGetData().length) {
						pagehtml += '<hr/>';
					}
					PageTable.find('#PageContainer').append(pagehtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				PageTable.find('#PageContainer .thumbs').each(function(i) {
					$(this).width($(this).parent().width());
					$(this).height($(this).parent().width());
				});
				PageTable.find('#PageContainer .mask').each(function(i) {
					$(this).width($(this).parent().parent().width() + 2);
					$(this).height($(this).parent().parent().width() + 2);
				});
			},
			'fnServerParams': function(aoData) {
				aoData.push({'name':'branchid','value':PageTree.branchid });
				aoData.push({'name':'touchflag','value':'0' });
			}
		});
		_container.find('#PageDiv').find('.dataTables_wrapper').addClass('form-inline');
		_container.find('#PageDiv').find('.dataTables_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
		_container.find('#PageDiv').find('.dataTables_wrapper .dataTables_length select').addClass("form-control input-small"); 
		PageTable.css('width', '100%');

		//Touchpage table初始化
		var TouchpageTree = new BranchTree(_container.find('#TouchpageDiv'));
		_container.find('.touchpagetable thead').css('display', 'none');
		_container.find('.touchpagetable tbody').css('display', 'none');	
		var touchpagehtml = '';
		TouchpageTable.dataTable({
			'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 12, 30, 48, 96 ],
							  [ 12, 30, 48, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'page!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'pageid', 'bSortable' : false }],
			'iDisplayLength' : 12,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if (TouchpageTable.find('#TouchpageContainer').length < 1) {
					TouchpageTable.append('<div id="TouchpageContainer"></div>');
				}
				TouchpageTable.find('#TouchpageContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					touchpagehtml = '';
					touchpagehtml += '<div class="row" >';
				}
				touchpagehtml += '<div class="col-md-2 col-xs-2">';
				
				touchpagehtml += '<div id="ThumbContainer" style="position:relative">';
				touchpagehtml += '<div id="TouchpageThumb" class="thumbs">';
				if (aData.snapshot != null && aData.snapshot != '') {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					touchpagehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				touchpagehtml += '<div class="mask">';
				touchpagehtml += '<div>';
				touchpagehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
				touchpagehtml += '<a class="btn default btn-sm green pix-touchpage-set" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
				touchpagehtml += '</div>';
				touchpagehtml += '</div>';
				touchpagehtml += '</div>';

				touchpagehtml += '</div>';

				touchpagehtml += '</div>';
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == TouchpageTable.dataTable().fnGetData().length) {
					touchpagehtml += '</div>';
					if ((iDisplayIndex+1) != TouchpageTable.dataTable().fnGetData().length) {
						touchpagehtml += '<hr/>';
					}
					TouchpageTable.find('#TouchpageContainer').append(touchpagehtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				TouchpageTable.find('#TouchpageContainer .thumbs').each(function(i) {
					$(this).width($(this).parent().width());
					$(this).height($(this).parent().width());
				});
				TouchpageTable.find('#TouchpageContainer .mask').each(function(i) {
					$(this).width($(this).parent().parent().width() + 2);
					$(this).height($(this).parent().parent().width() + 2);
				});
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':TouchpageTree.branchid });
				aoData.push({'name':'touchflag','value':'1' });
				aoData.push({'name':'homeflag','value':'1' });
			}
		});
		_container.find('#TouchpageDiv').find('.dataTables_wrapper').addClass('form-inline');
		_container.find('#TouchpageDiv').find('.dataTables_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
		_container.find('#TouchpageDiv').find('.dataTables_wrapper .dataTables_length select').addClass("form-control input-small"); 
		TouchpageTable.css('width', '100%');

		if (!_touchctrl) {
			$('.touch-ctrl').css('display', 'none');
		} else {
			$('.touch-ctrl').css('display', '');
		}
		_container.find('#nav_tab1').click(function(event) {
			_container.find('#PageDiv').css('display', '');
			_container.find('#TouchpageDiv').css('display', 'none');
			PageTable.dataTable()._fnAjaxUpdate();
		});
		_container.find('#nav_tab2').click(function(event) {
			_container.find('#PageDiv').css('display', 'none');
			_container.find('#TouchpageDiv').css('display', '');
			TouchpageTable.dataTable()._fnAjaxUpdate();
		});

		_container.on('click', '.pix-page-set', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			_page = PageTable.dataTable().fnGetData(rowIndex);
			displayPageSnapshot();
		});
		_container.on('click', '.pix-touchpage-set', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			_page = TouchpageTable.dataTable().fnGetData(rowIndex);
			displayPageSnapshot();
		});

	}
	
	var displayPageSnapshot = function() {
		_container.find('#PageSnapshot').height(_container.find('#PageSnapshot').width());
		if (_page != null) {
			var snapshot = _page.snapshot;
			if (snapshot != null && snapshot != '') {
				_container.find('#PageSnapshot').css('background-image', 'url(/pixsigdata' + snapshot + ')');
				var owidth = _page.width;
				var oheight = _page.height;
				var background_size = 'auto';
				if (owidth >= _container.find('#PageSnapshot').width() || oheight >= _container.find('#PageSnapshot').height()) {
					background_size = 'contain';
				}
				_container.find('#PageSnapshot').css('background-size', background_size);
				_container.find('#PageSnapshot').css('background-position', 'center');
				_container.find('#PageSnapshot').css('background-repeat', 'no-repeat');
			} else {
				_container.find('#PageSnapshot').css('background-image', '');
			}
		} else {
			_container.find('#PageSnapshot').css('background-image', '');
		}
	};
	
	this.refresh = function() {
		_container.find('#PageSnapshot').height(_container.find('#PageSnapshot').width());
		PageTable.dataTable()._fnAjaxUpdate();
		TouchpageTable.dataTable()._fnAjaxUpdate();
	}
	
	this.setPage = function(page) {
		_page = page;
		displayPageSnapshot();
	}
	
	this.getPage = function() {
		return _page;
	}
	
	init();
};
