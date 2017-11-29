var SdomainModule = function () {
	var _sdomain = {};

	var init = function () {
		initSdomainTable();
		initSdomainEvent();
		initSdomainEditModal();
	};

	var refresh = function () {
		$('#SdomainTable').dataTable()._fnAjaxUpdate();
	};
	
	var initSdomainTable = function () {
		$('#SdomainTable').dataTable({
			'sDom' : 'rt',
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'sdomain!list.action',
			'aoColumns' : [ {'sTitle' : '', 'mData' : 'sdomainid', 'bSortable' : false }, 
							{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.code, 'mData' : 'code', 'bSortable' : false }, 
							{'sTitle' : '', 'mData' : 'sdomainid', 'bSortable' : false }],
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(0)', nRow).html('<img src="/pixsigdata/sdomain/' + aData.code + '/logo.png" width="50" />');
				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				buttonhtml += '</div>';
				$('td:eq(3)', nRow).html(buttonhtml);
				return nRow;
			}
		});
		$('#SdomainTable_wrapper').addClass('form-inline');
		$('#SdomainTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#SdomainTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#SdomainTable_wrapper .dataTables_length select').select2();
		$('#SdomainTable').css('width', '100%');
	};
	
	var initSdomainEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_sdomain = $('#SdomainTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _sdomain.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'sdomain!delete.action',
						cache: false,
						data : {
							'sdomain.sdomainid': _sdomain.sdomainid
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

	var initSdomainEditModal = function () {
		var formHandler = new FormHandler($('#SdomainEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['sdomain.name'] = {
			required: true,
			minlength: 2,
			remote: {
				url: 'sdomain!validate.action',
				type: 'post',
				data: {
					'sdomain.sdomainid': function() {
						return $('#SdomainEditForm input[name="sdomain.sdomainid"]').val();
					},
					'sdomain.name': function() {
						return $('#SdomainEditForm input[name="sdomain.name"]').val();
					}
				},
				dataFilter: function(responseString) {
					var response = $.parseJSON(responseString);
					if (response.errorcode == 0) {
						return true;
					}
					return false;
				}
			}
		};
		formHandler.validateOption.rules['sdomain.code'] = {
			required: true,
			minlength: 2,
			remote: {
				url: 'sdomain!validate.action',
				type: 'post',
				data: {
					'sdomain.sdomainid': function() {
						return $('#SdomainEditForm input[name="sdomain.sdomainid"]').val();
					},
					'sdomain.code': function() {
						return $('#SdomainEditForm input[name="sdomain.code"]').val();
					}
				},
				dataFilter: function(responseString) {
					var response = $.parseJSON(responseString);
					if (response.errorcode == 0) {
						return true;
					}
					return false;
				}
			}
		};
		formHandler.validateOption.messages = {
			'sdomain.name': {
				remote: common.tips.name_repeat
			},
			'sdomain.code': {
				remote: common.tips.code_repeat
			},
		};
		
		formHandler.validateOption.submitHandler = function(form) {
			var data = jQuery("#SdomainEditForm").serializeArray();
			var formData = new FormData();
			var inputs = $(':input', '#SdomainEditForm');
			$.each(data, function (i, val) {
				formData.append(val.name, val.value);
			});
			$.each($('#SdomainEditForm').find("input[type='file']"), function(i, tag) {
				$.each($(tag)[0].files, function(i, file) {
					formData.append(tag.name, file);
				});
			});
			
			$.ajax({
				type : 'POST',
				url : $('#SdomainEditForm').attr('action'),
				data : formData,
				contentType: false,
				cache: false,
				processData: false,
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#SdomainEditModal').modal('hide');
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
		$('#SdomainEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#SdomainEditModal')).on('click', function(event) {
			if ($('#SdomainEditForm').valid()) {
				$('#SdomainEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#SdomainEditForm').attr('action', 'sdomain!add.action');
			$('#SdomainEditForm input[name="sdomain.code"]').removeAttr('readonly');
			$('#SdomainEditModal').modal();
		});			

		$('body').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_sdomain = $('#SdomainTable').dataTable().fnGetData(index);
			formHandler.setdata('sdomain', _sdomain);
			$('#SdomainEditForm').attr('action', 'sdomain!update.action');
			$('#SdomainEditForm input[name="sdomain.code"]').attr('readonly','readonly');
			$('#SdomainEditModal').modal();
		});
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
