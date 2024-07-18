var BindSelect = function (container) {
	var _self = this;
	this.container = container;
	var _binds = [];

	var init = function() {
		//console.log('BindSelect init', _self.container, container, this.container);
		var BindTree1 = new BranchTree($(container).find('#BindTab1'));
		$(container).find('#BindTable1').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'device!list.action',
			'aoColumns' : [ {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
							{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.branch, 'mData' : 'branchid', 'bSortable' : false }, 
							{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false }],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(2)', nRow).html(aData.branch.name);
				$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-bind-device-add">' + common.view.add + '</button>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':BindTree1.branchid });
				aoData.push({'name':'devicegroupid','value':'0' });
			}
		});
		$(container).find('#BindTable1_wrapper').addClass('form-inline');
		$(container).find('#BindTable1_wrapper .dataTables_filter input').addClass('form-control input-small');
		$(container).find('#BindTable1_wrapper .dataTables_length select').addClass('form-control input-small');
		$(container).find('#BindTable1').css('width', '100%');

		var BindTree2 = new BranchTree($(container).find('#BindTab2'));
		$(container).find('#BindTable2').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'devicegroup!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.detail, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '80%' },
							{'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '10%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var listhtml = '';
				for (var i=0; i<aData.devices.length; i++) {
					listhtml += aData.devices[i].terminalid + ' ';
				}
				$('td:eq(1)', nRow).html(listhtml);
				$('td:eq(2)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-bind-devicegroup-add">' + common.view.add + '</button>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':BindTree2.branchid });
				aoData.push({'name':'type','value':'1' });
			}
		});
		$(container).find('#BindTable2_wrapper').addClass('form-inline');
		$(container).find('#BindTable2_wrapper .dataTables_filter input').addClass('form-control input-small');
		$(container).find('#BindTable2_wrapper .dataTables_length select').addClass('form-control input-small');
		$(container).find('#BindTable2').css('width', '100%');

		//SelectedBindTable初始化
		$(container).find('#SelectedBindTable').dataTable({
			'sDom' : 't',
			'iDisplayLength' : -1,
			'aoColumns' : [ {'sTitle' : '', 'bSortable' : false, 'sWidth' : '40px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '80px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '80px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '30px' }],
			'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
			'oLanguage' : { 'sZeroRecords' : common.view.empty,
							'sEmptyTable' : common.view.empty }, 
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(3)', nRow).html('<button index="' + iDisplayIndex + '" class="btn red btn-xs pix-bind-delete"><i class="fa fa-trash-o"></i></button>');
				return nRow;
			}
		});

		$(container).find('#nav_dtab1').click(function(event) {
			$(container).find('#BindTable1').dataTable()._fnAjaxUpdate();
		});
		$(container).find('#nav_dtab2').click(function(event) {
			$(container).find('#BindTable2').dataTable()._fnAjaxUpdate();
		});
		//增加Device到SelectedBindTable
		$('body').on('click', '.pix-bind-device-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $(container).find('#BindTable1').dataTable().fnGetData(rowIndex);
			if (_binds.filter(function (el) {
				return el.bindtype == 1 && el.bindid == data.deviceid;
			}).length > 0) {
				return;
			}
			var bind = {};
			bind.bindid = 0;
			bind.bindtype = 1;
			bind.bindid = data.deviceid;
			bind.device = data;
			_binds.push(bind);
			refreshSelectedBindTable();
		});
		//增加Devicegroup到SelectedBindTable
		$('body').on('click', '.pix-bind-devicegroup-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $(container).find('#BindTable2').dataTable().fnGetData(rowIndex);
			if (_binds.filter(function (el) {
				return el.bindtype == 2 && el.bindid == data.devicegroupid;
			}).length > 0) {
				return;
			}

			var bind = {};
			bind.bindid = 0;
			bind.bindtype = 2;
			bind.bindid = data.devicegroupid;
			bind.devicegroup = data;
			_binds.push(bind);
			refreshSelectedBindTable();
		});
		//删除SelectedBindTable
		$('body').on('click', '.pix-bind-delete', function(event) {
			var index = $(event.target).attr('index');
			if (index == undefined) {
				index = $(event.target).parent().attr('index');
			}
			_binds.splice(index, 1);
			refreshSelectedBindTable();
		});
	}
	
	function refreshSelectedBindTable() {
		$(container).find('#SelectedBindTable').dataTable().fnClearTable();
		for (var i=0; i<_binds.length; i++) {
			var bind = _binds[i];
			var bindtype = '';
			var bindname = '';

			if (bind.bindtype == 1) {
				bindtype = common.view.device;
				bindname = bind.device.terminalid;
			} else if (bind.bindtype == 2) {
				bindtype = common.view.devicegroup;
				bindname = bind.devicegroup.name;
			}
			$(container).find('#SelectedBindTable').dataTable().fnAddData([(i+1), bindtype, bindname, 0]);
		}
	}
	this.refresh = function(page) {
		$(container).find('#BindTable1').dataTable()._fnAjaxUpdate();
		$(container).find('#BindTable2').dataTable()._fnAjaxUpdate();
		refreshSelectedBindTable();
	}
	
	this.setBinds = function(binds) {
		_binds = binds;
	}
	
	this.getBinds = function() {
		return _binds;
	}
	
	init();
};
