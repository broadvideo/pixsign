var BundleSelect = function (container, touchctrl) {
	var _self = this;
	var _container = container;
	var _touchctrl = touchctrl;
	var _bundle = null;
	var timestamp = new Date().getTime();
	var BundleTable = $(container).find('.bundletable');
	var TouchbundleTable = $(container).find('.touchbundletable');

	var init = function() {
		var BundleTree = new BranchTree(_container.find('#BundleDiv'));
		_container.find('.bundletable thead').css('display', 'none');
		_container.find('.bundletable tbody').css('display', 'none');	
		var bundlehtml = '';
		BundleTable.dataTable({
			'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 12, 30, 48, 96 ],
							  [ 12, 30, 48, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'bundle!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'bundleid', 'bSortable' : false }],
			'iDisplayLength' : 12,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if (BundleTable.find('#BundleContainer').length < 1) {
					BundleTable.append('<div id="BundleContainer"></div>');
				}
				BundleTable.find('#BundleContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					bundlehtml = '';
					bundlehtml += '<div class="row" >';
				}
				bundlehtml += '<div class="col-md-2 col-xs-2">';
				
				bundlehtml += '<div id="ThumbContainer" style="position:relative">';
				bundlehtml += '<div id="BundleThumb" class="thumbs">';
				if (aData.snapshot != null && aData.snapshot != '') {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					bundlehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				bundlehtml += '<div class="mask">';
				bundlehtml += '<div>';
				bundlehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
				bundlehtml += '<a class="btn default btn-sm green pix-bundle-set" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
				bundlehtml += '</div>';
				bundlehtml += '</div>';
				bundlehtml += '</div>';

				bundlehtml += '</div>';

				bundlehtml += '</div>';
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == BundleTable.dataTable().fnGetData().length) {
					bundlehtml += '</div>';
					if ((iDisplayIndex+1) != BundleTable.dataTable().fnGetData().length) {
						bundlehtml += '<hr/>';
					}
					BundleTable.find('#BundleContainer').append(bundlehtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				BundleTable.find('#BundleContainer .thumbs').each(function(i) {
					$(this).width($(this).parent().width());
					$(this).height($(this).parent().width());
				});
				BundleTable.find('#BundleContainer .mask').each(function(i) {
					$(this).width($(this).parent().parent().width() + 2);
					$(this).height($(this).parent().parent().width() + 2);
				});
			},
			'fnServerParams': function(aoData) {
				aoData.push({'name':'branchid','value':BundleTree.branchid });
				aoData.push({'name':'touchflag','value':'0' });
			}
		});
		_container.find('#BundleDiv').find('.dataTables_wrapper').addClass('form-inline');
		_container.find('#BundleDiv').find('.dataTables_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
		_container.find('#BundleDiv').find('.dataTables_wrapper .dataTables_length select').addClass("form-control input-small"); 
		BundleTable.css('width', '100%');

		//Touchbundle table初始化
		var TouchbundleTree = new BranchTree(_container.find('#TouchbundleDiv'));
		_container.find('.touchbundletable thead').css('display', 'none');
		_container.find('.touchbundletable tbody').css('display', 'none');	
		var touchbundlehtml = '';
		TouchbundleTable.dataTable({
			'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 12, 30, 48, 96 ],
							  [ 12, 30, 48, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'bundle!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'bundleid', 'bSortable' : false }],
			'iDisplayLength' : 12,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if (TouchbundleTable.find('#TouchbundleContainer').length < 1) {
					TouchbundleTable.append('<div id="TouchbundleContainer"></div>');
				}
				TouchbundleTable.find('#TouchbundleContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					touchbundlehtml = '';
					touchbundlehtml += '<div class="row" >';
				}
				touchbundlehtml += '<div class="col-md-2 col-xs-2">';
				
				touchbundlehtml += '<div id="ThumbContainer" style="position:relative">';
				touchbundlehtml += '<div id="TouchbundleThumb" class="thumbs">';
				if (aData.snapshot != null && aData.snapshot != '') {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					touchbundlehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				}
				touchbundlehtml += '<div class="mask">';
				touchbundlehtml += '<div>';
				touchbundlehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
				touchbundlehtml += '<a class="btn default btn-sm green pix-touchbundle-set" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
				touchbundlehtml += '</div>';
				touchbundlehtml += '</div>';
				touchbundlehtml += '</div>';

				touchbundlehtml += '</div>';

				touchbundlehtml += '</div>';
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == TouchbundleTable.dataTable().fnGetData().length) {
					touchbundlehtml += '</div>';
					if ((iDisplayIndex+1) != TouchbundleTable.dataTable().fnGetData().length) {
						touchbundlehtml += '<hr/>';
					}
					TouchbundleTable.find('#TouchbundleContainer').append(touchbundlehtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				TouchbundleTable.find('#TouchbundleContainer .thumbs').each(function(i) {
					$(this).width($(this).parent().width());
					$(this).height($(this).parent().width());
				});
				TouchbundleTable.find('#TouchbundleContainer .mask').each(function(i) {
					$(this).width($(this).parent().parent().width() + 2);
					$(this).height($(this).parent().parent().width() + 2);
				});
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':TouchbundleTree.branchid });
				aoData.push({'name':'touchflag','value':'1' });
				aoData.push({'name':'homeflag','value':'1' });
			}
		});
		_container.find('#TouchbundleDiv').find('.dataTables_wrapper').addClass('form-inline');
		_container.find('#TouchbundleDiv').find('.dataTables_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
		_container.find('#TouchbundleDiv').find('.dataTables_wrapper .dataTables_length select').addClass("form-control input-small"); 
		TouchbundleTable.css('width', '100%');

		if (!_touchctrl) {
			$('.touch-ctrl').css('display', 'none');
		} else {
			$('.touch-ctrl').css('display', '');
		}
		_container.find('#nav_tab1').click(function(event) {
			_container.find('#BundleDiv').css('display', '');
			_container.find('#TouchbundleDiv').css('display', 'none');
			BundleTable.dataTable()._fnAjaxUpdate();
		});
		_container.find('#nav_tab2').click(function(event) {
			_container.find('#BundleDiv').css('display', 'none');
			_container.find('#TouchbundleDiv').css('display', '');
			TouchbundleTable.dataTable()._fnAjaxUpdate();
		});

		_container.on('click', '.pix-bundle-set', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			_bundle = BundleTable.dataTable().fnGetData(rowIndex);
			displayBundleSnapshot();
		});
		_container.on('click', '.pix-touchbundle-set', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			_bundle = TouchbundleTable.dataTable().fnGetData(rowIndex);
			displayBundleSnapshot();
		});

	}
	
	var displayBundleSnapshot = function() {
		_container.find('#BundleSnapshot').height(_container.find('#BundleSnapshot').width());
		if (_bundle != null) {
			var snapshot = _bundle.snapshot;
			if (snapshot != null && snapshot != '') {
				_container.find('#BundleSnapshot').css('background-image', 'url(/pixsigdata' + snapshot + ')');
				var owidth = _bundle.width;
				var oheight = _bundle.height;
				var background_size = 'auto';
				if (owidth >= _container.find('#BundleSnapshot').width() || oheight >= _container.find('#BundleSnapshot').height()) {
					background_size = 'contain';
				}
				_container.find('#BundleSnapshot').css('background-size', background_size);
				_container.find('#BundleSnapshot').css('background-position', 'center');
				_container.find('#BundleSnapshot').css('background-repeat', 'no-repeat');
			} else {
				_container.find('#BundleSnapshot').css('background-image', '');
			}
		} else {
			_container.find('#BundleSnapshot').css('background-image', '');
		}
	};
	
	this.refresh = function() {
		_container.find('#BundleSnapshot').height(_container.find('#BundleSnapshot').width());
		BundleTable.dataTable()._fnAjaxUpdate();
		TouchbundleTable.dataTable()._fnAjaxUpdate();
	}
	
	this.setBundle = function(bundle) {
		_bundle = bundle;
		displayBundleSnapshot();
	}
	
	this.getBundle = function() {
		return _bundle;
	}
	
	init();
};
