var ModelModule = function () {
	var _model = {};

	var init = function () {
		initModelTable();
		initModelEvent();
		initModelEditModal();
	};

	var refresh = function () {
		$('#ModelTable').dataTable()._fnAjaxUpdate();
	};
	
	var initModelTable = function () {
		$('#ModelTable').dataTable({
			'sDom' : 'rt',
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'model!list.action',
			'aoColumns' : [ {'sTitle' : '名称', 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : '型号', 'mData' : 'model', 'bSortable' : false }, 
							{'sTitle' : '前缀', 'mData' : 'prefix', 'bSortable' : false }, 
							{'sTitle' : '终端数', 'mData' : 'currentdeviceidx', 'bSortable' : false }, 
							{'sTitle' : '', 'mData' : 'modelid', 'bSortable' : false }],
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				buttonhtml += '</div>';
				$('td:eq(4)', nRow).html(buttonhtml);
				return nRow;
			}
		});
		$('#ModelTable_wrapper').addClass('form-inline');
		$('#ModelTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#ModelTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#ModelTable_wrapper .dataTables_length select').select2();
		$('#ModelTable').css('width', '100%');
	};
	
	var initModelEvent = function () {
	};

	var initModelEditModal = function () {
		var formHandler = new FormHandler($('#ModelEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['model.name'] = {};
		formHandler.validateOption.rules['model.name']['required'] = true;
		formHandler.validateOption.rules['model.model'] = {};
		formHandler.validateOption.rules['model.model']['required'] = true;
		formHandler.validateOption.rules['model.prefix'] = {};
		formHandler.validateOption.rules['model.prefix']['required'] = true;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#ModelEditForm').attr('action'),
				data : $('#ModelEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#ModelEditModal').modal('hide');
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
		$('#ModelEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#ModelEditModal')).on('click', function(event) {
			if ($('#ModelEditForm').valid()) {
				$('#ModelEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#ModelEditForm').attr('action', 'model!add.action');
			$('#ModelEditModal').modal();
		});			

		$('body').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_model = $('#ModelTable').dataTable().fnGetData(index);
			formHandler.setdata('model', _model);
			$('#ModelEditForm').attr('action', 'model!update.action');
			$('#ModelEditModal').modal();
		});
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
