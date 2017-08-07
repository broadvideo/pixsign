var WidgetModule = function () {
	var _widget = {};
	this.WidgetTree = new BranchTree($('#WidgetPortlet'));

	var init = function () {
		initWidgetTable();
		initWidgetEvent();
		initWidgetEditModal();
	};

	var refresh = function () {
		$('#WidgetTable').dataTable()._fnAjaxUpdate();
	};
	
	var initWidgetTable = function () {
		$('#WidgetTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'widget!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '15%' },
							{'sTitle' : common.view.url, 'mData' : 'url', 'bSortable' : false, 'sWidth' : '65%', 'sClass': 'autowrap' },
							{'sTitle' : '', 'mData' : 'widgetid', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : '', 'mData' : 'widgetid', 'bSortable' : false, 'sWidth' : '10%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(2)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
				$('td:eq(3)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':WidgetTree.branchid });
			}
		});
		$('#WidgetTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#WidgetTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#WidgetTable_wrapper .dataTables_length select').select2();
		$('#WidgetTable').css('width', '100%').css('table-layout', 'fixed');
	};
	
	var initWidgetEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_widget = $('#WidgetTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _widget.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'widget!delete.action',
						cache: false,
						data : {
							'widget.widgetid': _widget.widgetid
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

	var initWidgetEditModal = function () {
		var formHandler = new FormHandler($('#WidgetEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['widget.name'] = {};
		formHandler.validateOption.rules['widget.name']['required'] = true;
		formHandler.validateOption.rules['widget.url'] = {};
		formHandler.validateOption.rules['widget.url']['required'] = true;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#WidgetEditForm').attr('action'),
				data : $('#WidgetEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#WidgetEditModal').modal('hide');
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
		$('#WidgetEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#WidgetEditModal')).on('click', function(event) {
			if ($('#WidgetEditForm').valid()) {
				$('#WidgetEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#WidgetEditForm input[name="widget.branchid"').val(WidgetTree.branchid);
			$('#WidgetEditForm').attr('action', 'widget!add.action');
			$('#WidgetEditModal').modal();
		});			

		$('#WidgetTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_widget = $('#WidgetTable').dataTable().fnGetData(index);
			formHandler.setdata('widget', _widget);
			$('#WidgetEditForm').attr('action', 'widget!update.action');
			$('#WidgetEditModal').modal();
		});
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
