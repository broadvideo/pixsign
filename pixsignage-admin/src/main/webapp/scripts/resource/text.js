var TextModule = function () {
	var _text = {};
	this.TextTree = new BranchTree($('#TextPortlet'));

	var init = function () {
		initTextTable();
		initTextEvent();
		initTextEditModal();
	};

	var refresh = function () {
		$('#TextTable').dataTable()._fnAjaxUpdate();
	};
	
	var initTextTable = function () {
		$('#TextTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'text!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '15%' },
							{'sTitle' : common.view.text, 'mData' : 'text', 'bSortable' : false, 'sWidth' : '65%', 'sClass': 'autowrap' },
							{'sTitle' : '', 'mData' : 'textid', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : '', 'mData' : 'textid', 'bSortable' : false, 'sWidth' : '10%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(2)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
				$('td:eq(3)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':TextTree.branchid });
			}
		});
		$('#TextTable_wrapper').addClass('form-inline');
		$('#TextTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#TextTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#TextTable_wrapper .dataTables_length select').select2();
		$('#TextTable').css('width', '100%').css('table-layout', 'fixed');
	};
	
	var initTextEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_text = $('#TextTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _text.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'text!delete.action',
						cache: false,
						data : {
							'text.textid': _text.textid
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

	var initTextEditModal = function () {
		var formHandler = new FormHandler($('#TextEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['text.name'] = {};
		formHandler.validateOption.rules['text.name']['required'] = true;
		formHandler.validateOption.rules['text.text'] = {};
		formHandler.validateOption.rules['text.text']['required'] = true;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#TextEditForm').attr('action'),
				data : $('#TextEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#TextEditModal').modal('hide');
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
		$('#TextEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#TextEditModal')).on('click', function(event) {
			if ($('#TextEditForm').valid()) {
				$('#TextEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#TextEditForm input[name="text.branchid"').val(TextTree.branchid);
			$('#TextEditForm textarea[name="text.text"]').val('');
			$('#TextEditForm').attr('action', 'text!add.action');
			$('#TextEditModal').modal();
		});			

		$('#TextTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_text = $('#TextTable').dataTable().fnGetData(index);
			formHandler.setdata('text', _text);
			$('#TextEditForm textarea[name="text.text"]').val(_text.text);
			$('#TextEditForm').attr('action', 'text!update.action');
			$('#TextEditModal').modal();
		});
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
