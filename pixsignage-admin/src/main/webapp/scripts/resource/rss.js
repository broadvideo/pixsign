var RSSModule = function () {
	var _rss = {};
	this.RSSTree = new BranchTree($('#RSSPortlet'));

	var init = function () {
		initRSSTable();
		initRSSEvent();
		initRSSEditModal();
	};

	var refresh = function () {
		$('#RSSTable').dataTable()._fnAjaxUpdate();
	};
	
	var initRSSTable = function () {
		$('#RSSTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'rss!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '15%' },
							{'sTitle' : common.view.url, 'mData' : 'url', 'bSortable' : false, 'sWidth' : '65%', 'sClass': 'autowrap' },
							{'sTitle' : '', 'mData' : 'rssid', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : '', 'mData' : 'rssid', 'bSortable' : false, 'sWidth' : '10%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(2)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
				$('td:eq(3)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':RSSTree.branchid });
			}
		});
		$('#RSSTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#RSSTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#RSSTable_wrapper .dataTables_length select').select2();
		$('#RSSTable').css('width', '100%').css('table-layout', 'fixed');
	};
	
	var initRSSEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_rss = $('#RSSTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _rss.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'rss!delete.action',
						cache: false,
						data : {
							'rss.rssid': _rss.rssid
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

	var initRSSEditModal = function () {
		var formHandler = new FormHandler($('#RSSEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['rss.name'] = {};
		formHandler.validateOption.rules['rss.name']['required'] = true;
		formHandler.validateOption.rules['rss.url'] = {};
		formHandler.validateOption.rules['rss.url']['required'] = true;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#RSSEditForm').attr('action'),
				data : $('#RSSEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#RSSEditModal').modal('hide');
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
		$('#RSSEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#RSSEditModal')).on('click', function(event) {
			if ($('#RSSEditForm').valid()) {
				$('#RSSEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#RSSEditForm input[name="rss.branchid"').val(RSSTree.branchid);
			$('#RSSEditForm').attr('action', 'rss!add.action');
			$('#RSSEditModal').modal();
		});			

		$('#RSSTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_rss = $('#RSSTable').dataTable().fnGetData(index);
			formHandler.setdata('rss', _rss);
			$('#RSSEditForm').attr('action', 'rss!update.action');
			$('#RSSEditModal').modal();
		});
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
