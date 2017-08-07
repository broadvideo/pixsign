var DVBModule = function () {
	var _dvb = {};
	this.DVBTree = new BranchTree($('#DVBPortlet'));

	var init = function () {
		initDVBTable();
		initDVBEvent();
		initDVBEditModal();
	};

	var refresh = function () {
		$('#DVBTable').dataTable()._fnAjaxUpdate();
	};
	
	var initDVBTable = function () {
		$('#DVBTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'dvb!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '30%' },
							{'sTitle' : common.view.frequence, 'mData' : 'frequency', 'bSortable' : false, 'sWidth' : '30%' },
							{'sTitle' : common.view.channelnumber, 'mData' : 'number', 'bSortable' : false, 'sWidth' : '30%' },
							{'sTitle' : '', 'mData' : 'dvbid', 'bSortable' : false, 'sWidth' : '5%' },
							{'sTitle' : '', 'mData' : 'dvbid', 'bSortable' : false, 'sWidth' : '5%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(3)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
				$('td:eq(4)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':DVBTree.branchid });
			}
		});
		$('#DVBTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DVBTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DVBTable_wrapper .dataTables_length select').select2();
		$('#DVBTable').css('width', '100%');
	};
	
	var initDVBEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_dvb = $('#DVBTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _dvb.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'dvb!delete.action',
						cache: false,
						data : {
							'dvb.dvbid': _dvb.dvbid
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

	var initDVBEditModal = function () {
		var formHandler = new FormHandler($('#DVBEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['dvb.name'] = {};
		formHandler.validateOption.rules['dvb.name']['required'] = true;
		formHandler.validateOption.rules['dvb.frequency'] = {};
		formHandler.validateOption.rules['dvb.frequency']['required'] = true;
		formHandler.validateOption.rules['dvb.number'] = {};
		formHandler.validateOption.rules['dvb.number']['required'] = true;
		formHandler.validateOption.rules['dvb.number']['number'] = true;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#DVBEditForm').attr('action'),
				data : $('#DVBEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#DVBEditModal').modal('hide');
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
		$('#DVBEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#DVBEditModal')).on('click', function(event) {
			if ($('#DVBEditForm').valid()) {
				$('#DVBEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#DVBEditForm input[name="dvb.branchid"').val(DVBTree.branchid);
			$('#DVBEditForm').attr('action', 'dvb!add.action');
			$('#DVBEditModal').modal();
		});			

		$('#DVBTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_dvb = $('#DVBTable').dataTable().fnGetData(index);
			formHandler.setdata('dvb', _dvb);
			$('#DVBEditForm').attr('action', 'dvb!update.action');
			$('#DVBEditModal').modal();
		});
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
