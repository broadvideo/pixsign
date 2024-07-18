var ConfigModule = function () {
	var _role = {};

	var init = function () {
		initConfigTable();
		initConfigEditModal();
	};

	var refresh = function () {
		$.ajax({
			type : 'GET',
			url : 'config!list.action',
			data : '',
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#ConfigTable').dataTable().fnClearTable();

					for (var i=0; i<data.aaData.length; i++) {
						var config = data.aaData[i];
						if (config.code == 'ServerIP') {
							$('#ConfigTable').dataTable().fnAddData([common.view.config_serverip, config.value]);
							$('#ConfigEditForm input[name=serverip]').val(config.value);
						} else if (config.code == 'ServerPort') {
							$('#ConfigTable').dataTable().fnAddData([common.view.config_serverport, config.value]);
							$('#ConfigEditForm input[name=serverport]').val(config.value);
						} else if (config.code == 'CDNServer') {
							$('#ConfigTable').dataTable().fnAddData([common.view.config_cdnserver, config.value]);
							$('#ConfigEditForm input[name=cdnserver]').val(config.value);
						}
					}
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	};
	
	var initConfigTable = function () {
		$('#ConfigTable').dataTable({
			'sDom' : 't',
			'iDisplayLength' : -1,
			'bSort' : false,
			'aoColumns' : [ {'sTitle' : common.view.name, 'bSortable' : false, 'sWidth' : '25%' },
							{'sTitle' : common.view.value, 'bSortable' : false, 'sWidth' : '75%' }],
			'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
			'oLanguage' : { 'sZeroRecords' : common.view.empty,
							'sEmptyTable' : common.view.empty }, 
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			}
		});
		$('#ConfigTable').css('width', '100%');
		refresh();
	};
	
	var initConfigEvent = function () {
		$('#ConfigTable').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_role = $('#ConfigTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _role.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'role!delete.action',
						cache: false,
						data : {
							'role.roleid': _role.roleid
						},
						success : function(data, status) {
							if (data.errorcode == 0) {
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
				}
			 });
		});
	};

	var initConfigEditModal = function () {
		var formHandler = new FormHandler($('#ConfigEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['serverip'] = {};
		formHandler.validateOption.rules['serverip']['required'] = true;
		formHandler.validateOption.rules['serverport'] = {};
		formHandler.validateOption.rules['serverport']['required'] = true;
		formHandler.validateOption.rules['serverport']['number'] = true;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#ConfigEditForm').attr('action'),
				data : $('#ConfigEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#ConfigEditModal').modal('hide');
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
		$('#ConfigEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#ConfigEditModal')).on('click', function(event) {
			if ($('#ConfigEditForm').valid()) {
				$('#ConfigEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-update', function(event) {
			$('#ConfigEditForm').attr('action', 'config!update.action');
			$('#ConfigEditModal').modal();
		});
	};

	return {
		init: init,
		refresh: refresh,
	}
	
}();
