var StreamModule = function () {
	var _stream = {};
	this.StreamTree = new BranchTree($('#StreamPortlet'));

	var init = function () {
		initStreamTable();
		initStreamEvent();
		initStreamEditModal();
	};

	var refresh = function () {
		$('#StreamTable').dataTable()._fnAjaxUpdate();
	};
	
	var initStreamTable = function () {
		$('#StreamTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'stream!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '15%' },
							{'sTitle' : common.view.url, 'mData' : 'url', 'bSortable' : false, 'sWidth' : '65%', 'sClass': 'autowrap' },
							{'sTitle' : '', 'mData' : 'streamid', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : '', 'mData' : 'streamid', 'bSortable' : false, 'sWidth' : '10%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(2)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
				$('td:eq(3)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':StreamTree.branchid });
			}
		});
		$('#StreamTable_wrapper').addClass('form-inline');
		$('#StreamTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#StreamTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#StreamTable_wrapper .dataTables_length select').select2();
		$('#StreamTable').css('width', '100%').css('table-layout', 'fixed');
	};
	
	var initStreamEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_stream = $('#StreamTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _stream.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'stream!delete.action',
						cache: false,
						data : {
							'stream.streamid': _stream.streamid
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

	var initStreamEditModal = function () {
		var formHandler = new FormHandler($('#StreamEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['stream.name'] = {};
		formHandler.validateOption.rules['stream.name']['required'] = true;
		formHandler.validateOption.rules['stream.url'] = {};
		formHandler.validateOption.rules['stream.url']['required'] = true;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#StreamEditForm').attr('action'),
				data : $('#StreamEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#StreamEditModal').modal('hide');
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
		$('#StreamEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#StreamEditModal')).on('click', function(event) {
			if ($('#StreamEditForm').valid()) {
				$('#StreamEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#StreamEditForm input[name="stream.branchid"').val(StreamTree.branchid);
			$('#StreamEditForm').attr('action', 'stream!add.action');
			$('#StreamEditModal').modal();
		});			

		$('#StreamTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_stream = $('#StreamTable').dataTable().fnGetData(index);
			formHandler.setdata('stream', _stream);
			$('#StreamEditForm').attr('action', 'stream!update.action');
			$('#StreamEditModal').modal();
		});
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
