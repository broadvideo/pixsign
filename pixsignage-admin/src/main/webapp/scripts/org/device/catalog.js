var CatalogModule = function () {
	var _catalog1 = {};
	var _catalog2 = {};
	var _cataitem = {};

	var init = function () {
		initTable();
		initCatalogEditModal();
		initCataitemEditModal();
		initCataitemDtlModal();
	};

	var refresh = function () {
		$.ajax({
			type : 'GET',
			url : 'catalog!list.action',
			data : {},
			success : function(data, status) {
				if (data.errorcode == 0) {
					if (data.aaData[0].type == 1) {
						_catalog1 = data.aaData[0];
					} else if (data.aaData[0].type == 2) {
						_catalog2 = data.aaData[0];
					}
					if (data.aaData[1].type == 1) {
						_catalog1 = data.aaData[1];
					} else if (data.aaData[1].type == 2) {
						_catalog2 = data.aaData[1];
					}
					$('.catalog-name1').html(_catalog1.name);
					$('.catalog-name2').html(_catalog2.name);
					if (_catalog1.status == 1) {
						$('.catalog-status1').html(common.view.valid);
						$('.catalog-status1').removeClass('badge-default');
						$('.catalog-status1').addClass('badge-success');
					} else {
						$('.catalog-status1').html(common.view.invalid);
						$('.catalog-status1').removeClass('badge-success');
						$('.catalog-status1').addClass('badge-default');
					}
					if (_catalog2.status == 1) {
						$('.catalog-status2').html(common.view.valid);
						$('.catalog-status2').removeClass('badge-default');
						$('.catalog-status2').addClass('badge-success');
					} else {
						$('.catalog-status2').html(common.view.invalid);
						$('.catalog-status2').removeClass('badge-success');
						$('.catalog-status2').addClass('badge-default');
					}

					$('#CataitemTable1').dataTable().fnClearTable();
					for (var i=0; i<_catalog1.cataitems.length; i++) {
						$('#CataitemTable1').dataTable().fnAddData(_catalog1.cataitems[i]);
					}
					$('#CataitemTable2').dataTable().fnClearTable();
					for (var i=0; i<_catalog2.cataitems.length; i++) {
						$('#CataitemTable2').dataTable().fnAddData(_catalog2.cataitems[i]);
					}
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	};
	
	var initTable = function () {
		$('#CataitemTable1').dataTable({
			'sDom' : 't',
			'iDisplayLength' : -1,
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '40px' }, 
							{'sTitle' : common.view.operation, 'mData' : 'cataitemid', 'bSortable' : false, 'sWidth' : '30px' }],
			'oLanguage' : { 'sZeroRecords' : common.view.empty,
							'sEmptyTable' : common.view.empty }, 
			'ordering' : false,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-detail"><i class="fa fa-list-ul"></i> ' + common.view.detail + '</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				buttonhtml += '</div>';
				$('td:eq(1)', nRow).html(buttonhtml);
				return nRow;
			}
		});
		$('#CataitemTable1').css('width', '100%');
		
		$('#CataitemTable2').dataTable({
			'sDom' : 't',
			'iDisplayLength' : -1,
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '40px' }, 
							{'sTitle' : common.view.operation, 'mData' : 'cataitemid', 'bSortable' : false, 'sWidth' : '30px' }],
			'oLanguage' : { 'sZeroRecords' : common.view.empty,
							'sEmptyTable' : common.view.empty }, 
			'ordering' : false,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-detail"><i class="fa fa-list-ul"></i> ' + common.view.detail + '</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				buttonhtml += '</div>';
				$('td:eq(1)', nRow).html(buttonhtml);
				return nRow;
			}
		});
		$('#CataitemTable2').css('width', '100%');
		
		refresh();
	};
	
	var initCatalogEditModal = function () {
		var formHandler = new FormHandler($('#CatalogEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['catalog.name'] = {};
		formHandler.validateOption.rules['catalog.name']['required'] = true;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#CatalogEditForm').attr('action'),
				data : $('#CatalogEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#CatalogEditModal').modal('hide');
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
		$('#CatalogEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#CatalogEditModal')).on('click', function(event) {
			if ($('#CatalogEditForm').valid()) {
				$('#CatalogEditForm').submit();
			}
		});
		$('body').on('click', '.pix-catalog-update1', function(event) {
			formHandler.setdata('catalog', _catalog1);
			$('#CatalogEditForm').attr('action', 'catalog!update.action');
			$('#CatalogEditModal').modal();
		});
		$('body').on('click', '.pix-catalog-update2', function(event) {
			formHandler.setdata('catalog', _catalog2);
			$('#CatalogEditForm').attr('action', 'catalog!update.action');
			$('#CatalogEditModal').modal();
		});
	};
	
	var initCataitemEditModal = function () {
		var formHandler = new FormHandler($('#CataitemEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['cataitem.name'] = {};
		formHandler.validateOption.rules['cataitem.name']['required'] = true;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#CataitemEditForm').attr('action'),
				data : $('#CataitemEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#CataitemEditModal').modal('hide');
						bootbox.alert(common.tips.success);
						refresh();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.item('failue');
				}
			});
		};
		$('#CataitemEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#CataitemEditModal')).on('click', function(event) {
			if ($('#CataitemEditForm').valid()) {
				$('#CataitemEditForm').submit();
			}
		});
		$('body').on('click', '.pix-cataitem-add1', function(event) {
			formHandler.reset();
			$('#CataitemEditForm input[name="cataitem.catalogid"').val(_catalog1.catalogid);
			$('#CataitemEditForm').attr('action', 'catalog!additem.action');
			$('#CataitemEditModal').modal();
		});			
		$('body').on('click', '.pix-cataitem-add2', function(event) {
			formHandler.reset();
			$('#CataitemEditForm input[name="cataitem.catalogid"').val(_catalog2.catalogid);
			$('#CataitemEditForm').attr('action', 'catalog!additem.action');
			$('#CataitemEditModal').modal();
		});			
		$('#CataitemTable1').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_cataitem = $('#CataitemTable1').dataTable().fnGetData(index);
			formHandler.setdata('cataitem', _cataitem);
			$('#CataitemEditForm').attr('action', 'catalog!updateitem.action');
			$('#CataitemEditModal').modal();
		});
		$('#CataitemTable2').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_cataitem = $('#CataitemTable2').dataTable().fnGetData(index);
			formHandler.setdata('cataitem', _cataitem);
			$('#CataitemEditForm').attr('action', 'catalog!updateitem.action');
			$('#CataitemEditModal').modal();
		});

		$('#CataitemTable1').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_cataitem = $('#CataitemTable1').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _cataitem.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'catalog!deleteitem.action',
						cache: false,
						data : {
							'cataitem.cataitemid': _cataitem.cataitemid
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
		$('#CataitemTable2').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_cataitem = $('#CataitemTable2').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _cataitem.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'catalog!deleteitem.action',
						cache: false,
						data : {
							'cataitem.cataitemid': _cataitem.cataitemid
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
	
	var initCataitemDtlModal = function () {
		var cataitemid1 = null;
		var cataitemid2 = null;
		var selectedDevices = [];
		
		$('#CataitemTable1').on('click', '.pix-detail', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_cataitem = $('#CataitemTable1').dataTable().fnGetData(index);
			cataitemid1 = _cataitem.cataitemid;
			cataitemid2 = null;
			selectedDevices = [];
			$('#LeftDeviceTable').dataTable().fnDraw(true);
			$('#RightDeviceTable').dataTable().fnDraw(true);
			$('#CataitemDtlModal').modal();
		});
		$('#CataitemTable2').on('click', '.pix-detail', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_cataitem = $('#CataitemTable2').dataTable().fnGetData(index);
			cataitemid1 = null;
			cataitemid2 = _cataitem.cataitemid;
			selectedDevices = [];
			$('#LeftDeviceTable').dataTable().fnDraw(true);
			$('#RightDeviceTable').dataTable().fnDraw(true);
			$('#CataitemDtlModal').modal();
		});
		
		var DeviceTree = new BranchTree($('#DevicePortlet'));
		$('#LeftDeviceTable').dataTable({
			'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'device!list.action',
			'aoColumns' : [ {'sTitle' : '<input type="checkbox" id="CheckAll" />', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '10%' }, 
			                {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false, 'sWidth' : '40%' }, 
							{'sTitle' : common.view.branch, 'mData' : 'branchid', 'bSortable' : false, 'sWidth' : '25%' },
							{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '25%' }],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
				if ( $.inArray(aData.deviceid, selectedDevices) >= 0 ) {
					$(nRow).addClass('active');
					$('td:eq(0)', nRow).html('<input type="checkbox" id="LeftCheck' + aData.deviceid + '" checked />');
				} else {
					$('td:eq(0)', nRow).html('<input type="checkbox" id="LeftCheck' + aData.deviceid + '" />');
				}

				$('td:eq(1)', nRow).html(aData.terminalid + '(' + aData.name + ')');
				$('td:eq(2)', nRow).html(aData.branch.name);
				$('td:eq(3)', nRow).html('');
				if (cataitemid1 != null) {
					var cataitems = _catalog1.cataitems.filter(function (el) {
						return el.cataitemid == aData.cataitemid1;
					});
					if (cataitems.length > 0) {
						$('td:eq(3)', nRow).html(cataitems[0].name);
					} else {
						$('td:eq(3)', nRow).html('');
					}
				} else if (cataitemid2 != null) {
					var cataitems = _catalog2.cataitems.filter(function (el) {
						return el.cataitemid == aData.cataitemid2;
					});
					if (cataitems.length > 0) {
						$('td:eq(3)', nRow).html(cataitems[0].name);
					} else {
						$('td:eq(3)', nRow).html('');
					}
				}
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':DeviceTree.branchid });
			} 
		});

		$('#RightDeviceTable').dataTable({
			'sDom' : '<"row"r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'device!list.action',
			'aoColumns' : [ {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false, 'sWidth' : '40%' }, 
							{'sTitle' : common.view.branch, 'mData' : 'branchid', 'bSortable' : false, 'sWidth' : '30%' },
							{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '30%' }],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(0)', nRow).html(aData.terminalid + '(' + aData.name + ')');
				$('td:eq(1)', nRow).html(aData.branch.name);
				$('td:eq(2)', nRow).html('');
				if (cataitemid1 != null) {
					var cataitems = _catalog1.cataitems.filter(function (el) {
						return el.cataitemid == aData.cataitemid1;
					});
					if (cataitems.length > 0) {
						$('td:eq(2)', nRow).html(cataitems[0].name);
					} else {
						$('td:eq(2)', nRow).html('');
					}
				} else if (cataitemid2 != null) {
					var cataitems = _catalog2.cataitems.filter(function (el) {
						return el.cataitemid == aData.cataitemid2;
					});
					if (cataitems.length > 0) {
						$('td:eq(2)', nRow).html(cataitems[0].name);
					} else {
						$('td:eq(2)', nRow).html('');
					}
				}
				return nRow;
			},
			'fnServerParams': function(aoData) {
				if (cataitemid1 != null) {
					aoData.push({'name':'cataitemid1','value':cataitemid1 });
				}
				if (cataitemid2 != null) {
					aoData.push({'name':'cataitemid2','value':cataitemid2 });
				}
			} 
		});

		$('#LeftDeviceTable').on('click', 'tr', function () {
			var row = $('#LeftDeviceTable').dataTable().fnGetData(this);
			if (row == null) return;
			var deviceid = row.deviceid;
			var index = $.inArray(deviceid, selectedDevices);
			if (index >= 0) {
				selectedDevices.splice(index, 1);
				$('#LeftCheck'+deviceid).prop('checked', false);
			} else {
				selectedDevices.push(deviceid);
				$('#LeftCheck'+deviceid).prop('checked', true);
			}
			$(this).toggleClass('active');
		});
		$('#CheckAll', $('#LeftDeviceTable')).on('click', function() {
			var rows = $("#LeftDeviceTable").dataTable().fnGetNodes();
			for (var i=0; i<rows.length; i++) {
				var deviceid = $('#LeftDeviceTable').dataTable().fnGetData(rows[i]).deviceid;
				if (this.checked) {
					$(rows[i]).addClass('active');
				} else {
					$(rows[i]).removeClass('active');
				}
				$('#LeftCheck'+deviceid).prop('checked', this.checked);
				var index = $.inArray(deviceid, selectedDevices);
				if (index == -1 && this.checked) {
					selectedDevices.push(deviceid);
				} else if (index >= 0 && !this.checked) {
					selectedDevices.splice(index, 1);
				}
		    }
		} );

		$('body').on('click', '.pix-adddevice', function(event) {
			$.ajax({
				type : 'POST',
				url : 'catalog!adddevices.action',
				data : '{"cataitem":' + $.toJSON(_cataitem) + ', "detailids":' + $.toJSON(selectedDevices) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					if (data.errorcode == 0) {
						selectedDevices = [];
						$('#LeftDeviceTable').dataTable()._fnAjaxUpdate();
						$('#RightDeviceTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		});

	};

	return {
		init: init,
		refresh: refresh,
	}
	
}();
