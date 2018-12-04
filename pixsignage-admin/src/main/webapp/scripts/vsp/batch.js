var BatchModule = function () {
	var _batch = {};
	this.BatchTree = new BranchTree($('#BatchPortlet'));

	var init = function () {
		initBatchTable();
		initBatchEvent();
		initBatchEditModal();
	};

	var refresh = function () {
		$('#BatchTable').dataTable()._fnAjaxUpdate();
	};
	
	var initBatchTable = function () {
		$('#BatchTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'batch!list.action',
			'aoColumns' : [ {'sTitle' : '批次', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '30%' },
							{'sTitle' : '型号', 'mData' : 'modelid', 'bSortable' : false, 'sWidth' : '30%' },
							{'sTitle' : '数量', 'mData' : 'amount', 'bSortable' : false, 'sWidth' : '30%' },
							{'sTitle' : '', 'mData' : 'batchid', 'bSortable' : false, 'sWidth' : '5%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(3)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':BatchTree.branchid });
			}
		});
		$('#BatchTable_wrapper').addClass('form-inline');
		$('#BatchTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#BatchTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#BatchTable_wrapper .dataTables_length select').select2();
		$('#BatchTable').css('width', '100%');
	};
	
	var initBatchEvent = function () {
	};

	var initBatchEditModal = function () {
		var modellist = [];
		$.ajax({
			type : 'post',
			url : 'model!list.action',
			data : {},
			success : function(data, status) {
				if (data.errorcode == 0) {
					for (var i=0; i<data.aaData.length; i++) {
						modellist.push({id: data.aaData[i].modelid, text: data.aaData[i].name });
						$('#ModelSelect').select2({
							minimumResultsForSearch: -1,
							minimumInputLength: 0,
							data: modellist,
							dropdownCssClass: 'bigdrop', 
							escapeMarkup: function (m) { return m; } 
						});
					}
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});

		var formHandler = new FormHandler($('#BatchEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['batch.modelid'] = {};
		formHandler.validateOption.rules['batch.modelid']['required'] = true;
		formHandler.validateOption.rules['batch.amount'] = {};
		formHandler.validateOption.rules['batch.amount']['required'] = true;
		formHandler.validateOption.rules['batch.amount']['number'] = true;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#BatchEditForm').attr('action'),
				data : $('#BatchEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#BatchEditModal').modal('hide');
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
		$('#BatchEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#BatchEditModal')).on('click', function(event) {
			if ($('#BatchEditForm').valid()) {
				$('#BatchEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#BatchEditForm').attr('action', 'batch!add.action');
			$('#BatchEditModal').modal();
		});			
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
