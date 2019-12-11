var IntentModule = function () {
	var _intent = {};

	var init = function () {
		initIntentTable();
		initIntentEvent();
		initIntentEditModal();
	};

	var refresh = function () {
		$('#IntentTable').dataTable()._fnAjaxUpdate();
	};
	
	var initIntentTable = function () {
		$('#IntentTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'intent!list.action',
			'aoColumns' : [ {'sTitle' : 'Key', 'mData' : 'intentkey', 'bSortable' : false, 'sWidth' : '30%' },
							{'sTitle' : 'Type', 'mData' : 'intentid', 'bSortable' : false, 'sWidth' : '20%', 'sClass': 'autowrap' },
							{'sTitle' : 'Content', 'mData' : 'intentid', 'bSortable' : false, 'sWidth' : '30%', 'sClass': 'autowrap' },
							{'sTitle' : '', 'mData' : 'intentid', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : '', 'mData' : 'intentid', 'bSortable' : false, 'sWidth' : '10%' }],
			'order': [],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var typehtml = '';
				if (aData.relatetype == 1) {
					typehtml += '<span class="label label-sm label-success">' + common.view.video + '</span> ';
				} else if (aData.relatetype == 2) {
					typehtml += '<span class="label label-sm label-info">' + common.view.image + '</span> ';
				} else if (aData.relatetype == 3) {
					typehtml += '<span class="label label-sm label-warning">URL</span> ';
				}
				$('td:eq(1)', nRow).html(typehtml);
				var contenthtml = '';
				if (aData.relatevideo != null) {
					contenthtml += '<div class="thumbs" style="width: 100px; height: 100px;">';
					if (aData.relatevideo.thumbnail != '' && aData.relatevideo.thumbnail != null) {
						var thumbwidth = aData.relatevideo.width > aData.relatevideo.height? 100 : 100*aData.relatevideo.width/aData.relatevideo.height;
						contenthtml += '<img src="/pixsigdata' + aData.relatevideo.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" />';
					}
					contenthtml += '</div>';
					contenthtml += '<h6 class="pixtitle">' + aData.relatevideo.name + '</h6>';
				} else if (aData.relateimage != null) {
					contenthtml += '<div class="thumbs" style="width: 100px; height: 100px;">';
					if (aData.relateimage.thumbnail != '' && aData.relateimage.thumbnail != null) {
						var thumbwidth = aData.relateimage.width > aData.relateimage.height? 100 : 100*aData.relateimage.width/aData.relateimage.height;
						contenthtml += '<img src="/pixsigdata' + aData.relateimage.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" />';
					}
					contenthtml += '</div>';
					contenthtml += '<h6 class="pixtitle">' + aData.relateimage.name + '</h6>';
				} else if (aData.relateurl != null) {
					contenthtml += aData.relateurl;
				}
				$('td:eq(2)', nRow).html(contenthtml);
				$('td:eq(3)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
				$('td:eq(4)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
			}
		});
		$('#IntentTable_wrapper').addClass('form-inline');
		$('#IntentTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#IntentTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#IntentTable_wrapper .dataTables_length select').select2();
		$('#IntentTable').css('width', '100%').css('table-layout', 'fixed');
	};
	
	var initIntentEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_intent = $('#IntentTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _intent.intentkey, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'intent!delete.action',
						cache: false,
						data : {
							'intent.intentid': _intent.intentid
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

		$('body').on('click', '.pix-push', function(event) {
			bootbox.confirm('Please confirm whether to push intents to all devices', function(result) {
				if (result == true) {
					$.ajax({
						type : 'GET',
						url : 'intent!push.action',
						cache: false,
						data : {},
						dataType : 'json',
						contentType : 'application/json;charset=utf-8',
						beforeSend: function ( xhr ) {
							Metronic.startPageLoading({animate: true});
						},
						success : function(data, status) {
							Metronic.stopPageLoading();
							if (data.errorcode == 0) {
								bootbox.alert(common.tips.success);
							} else {
								bootbox.alert(common.tips.error + data.errormsg);
							}
						},
						error : function() {
							Metronic.stopPageLoading();
							console.log('failue');
						}
					});				
				}
			});
		});
	};

	var initIntentEditModal = function () {
		var RelateImageSelect = new FolderImageSelect($('#RelateImageSelect'));
		var RelateVideoSelect = new FolderVideoSelect($('#RelateVideoSelect'));
		
		$('#IntentEditForm input[name="intent.relatetype"]').change(function(e) {
			refreshRelateType();
		});
		function refreshRelateType() {
			var relatetype = $('#IntentEditForm input[name="intent.relatetype"]:checked').attr('value');
			if (relatetype == 1) {
				$('#RelateVideoSelect').css('display', '');
				$('#RelateImageSelect').css('display', 'none');
				$('#RelateText').css('display', 'none');
			} else if (relatetype == 2) {
				$('#RelateVideoSelect').css('display', 'none');
				$('#RelateImageSelect').css('display', '');
				$('#RelateText').css('display', 'none');
			} else {
				$('#RelateVideoSelect').css('display', 'none');
				$('#RelateImageSelect').css('display', 'none');
				$('#RelateText').css('display', '');
			}
		}

		var formHandler = new FormHandler($('#IntentEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['intent.name'] = {};
		formHandler.validateOption.rules['intent.name']['required'] = true;
		formHandler.validateOption.rules['intent.relatetype'] = {};
		formHandler.validateOption.rules['intent.relatetype']['required'] = true;
		formHandler.validateOption.submitHandler = function(form) {
			var relatetype = $('#IntentEditForm input[name="intent.relatetype"]:checked').attr('value');
			if (relatetype == 1) {
				$('#IntentEditForm input[name="intent.relateid"]').attr('value', RelateVideoSelect.getVideoid);
			} else if (relatetype == 2) {
				$('#IntentEditForm input[name="intent.relateid"]').attr('value', RelateImageSelect.getImageid);
			}
			$.ajax({
				type : 'POST',
				url : $('#IntentEditForm').attr('action'),
				data : $('#IntentEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#IntentEditModal').modal('hide');
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
		$('#IntentEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#IntentEditModal')).on('click', function(event) {
			if ($('#IntentEditForm').valid()) {
				$('#IntentEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#IntentEditForm').attr('action', 'intent!add.action');
			refreshRelateType();
			$('#IntentEditModal').modal();
		});			

		$('#IntentTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_intent = $('#IntentTable').dataTable().fnGetData(index);
			formHandler.setdata('intent', _intent);
			$('#IntentEditForm').attr('action', 'intent!update.action');
			refreshRelateType();
			if (_intent.relatetype == 1 && _intent.relatevideo != null) {
				RelateVideoSelect.setVideo(_intent.relatevideo);
			} else if (_intent.relatetype == 2 && _intent.relateimage != null) {
				RelateImageSelect.setImage(_intent.relateimage);
			} 
			$('#IntentEditModal').modal();
		});
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
