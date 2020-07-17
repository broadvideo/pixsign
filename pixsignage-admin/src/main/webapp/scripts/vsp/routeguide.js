var RouteguideModule = function () {
	var _routeguide = {};
	var _routeguidedtl = {};

	var init = function () {
		initRouteguideTable();
		initRouteguideEvent();
		initRouteguideEditModal();
		initRouteguidedtlModal();
	};

	var refresh = function () {
		$('#RouteguideTable').dataTable()._fnAjaxUpdate();
	};
	
	var initRouteguideTable = function () {
		$('#RouteguideTable').dataTable({
			'sDom' : 'rt',
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'routeguide!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.code, 'mData' : 'code', 'bSortable' : false }, 
							{'sTitle' : '类型', 'mData' : 'type', 'bSortable' : false }, 
							{'sTitle' : '下载', 'mData' : 'routeguideid', 'bSortable' : false }, 
							{'sTitle' : '时间', 'mData' : 'createtime', 'bSortable' : false }, 
							{'sTitle' : '', 'mData' : 'routeguideid', 'bSortable' : false }],
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var typehtml = '';
				if (aData.type == 1) {
					typehtml += '<span class="label label-sm label-default">单层</span> ';
				} else if (aData.type == 2) {
					typehtml += '<span class="label label-sm label-success">双层</span> ';
				}
				$('td:eq(2)', nRow).html(typehtml);
				
				$('td:eq(3)', nRow).html('<a href="/pixsigdata/routeguide/' + aData.routeguideid + '/' + aData.code + '.zip">' + aData.code + '.zip</a>');
				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-zip"><i class="fa fa-edit"></i> 打包</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-routeguidedtl"><i class="fa fa-list-ul"></i> 明细</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				buttonhtml += '</div>';
				$('td:eq(5)', nRow).html(buttonhtml);
				return nRow;
			}
		});
		$('#RouteguideTable_wrapper').addClass('form-inline');
		$('#RouteguideTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#RouteguideTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#RouteguideTable_wrapper .dataTables_length select').select2();
		$('#RouteguideTable').css('width', '100%');
	};
	
	var initRouteguideEvent = function () {
		$('body').on('click', '.pix-zip', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_routeguide = $('#RouteguideTable').dataTable().fnGetData(index);
			bootbox.confirm('请确认是否打包' + _routeguide.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'routeguide!zip.action',
						cache: false,
						data : {
							'routeguide.routeguideid': _routeguide.routeguideid
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

		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_routeguide = $('#RouteguideTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _routeguide.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'routeguide!delete.action',
						cache: false,
						data : {
							'routeguide.routeguideid': _routeguide.routeguideid
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

	var initRouteguideEditModal = function () {
		var formHandler = new FormHandler($('#RouteguideEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['routeguide.name'] = {};
		formHandler.validateOption.rules['routeguide.name']['required'] = true;
		formHandler.validateOption.rules['routeguide.code'] = {
			required: true,
			minlength: 2,
			remote: {
				url: 'routeguide!validate.action',
				type: 'post',
				data: {
					'routeguide.routeguideid': function() {
						return $('#RouteguideEditForm input[name="routeguide.routeguideid"]').val();
					},
					'routeguide.code': function() {
						return $('#RouteguideEditForm input[name="routeguide.code"]').val();
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
			'routeguide.code': {
				remote: common.tips.code_repeat
			},
		};
		
		formHandler.validateOption.submitHandler = function(form) {
			var data = jQuery("#RouteguideEditForm").serializeArray();
			var formData = new FormData();
			$.each(data, function (i, val) {
				formData.append(val.name, val.value);
			});
			$.each($('#RouteguideEditForm').find("input[type='file']"), function(i, tag) {
				$.each($(tag)[0].files, function(i, file) {
					formData.append(tag.name, file);
				});
			});
			
			$.ajax({
				type : 'POST',
				url : $('#RouteguideEditForm').attr('action'),
				data : formData,
				contentType: false,
				cache: false,
				processData: false,
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#RouteguideEditModal').modal('hide');
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
		$('#RouteguideEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#RouteguideEditModal')).on('click', function(event) {
			if ($('#RouteguideEditForm').valid()) {
				$('#RouteguideEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#RouteguideEditForm').attr('action', 'routeguide!add.action');
			$('#RouteguideEditForm input[name="routeguide.code"]').removeAttr('readonly');
			$('#RouteguideEditModal').modal();
		});			

		$('body').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_routeguide = $('#RouteguideTable').dataTable().fnGetData(index);
			formHandler.setdata('routeguide', _routeguide);
			$('#RouteguideEditForm').attr('action', 'routeguide!update.action');
			$('#RouteguideEditForm input[name="routeguide.code"]').attr('readonly','readonly');
			$('#RouteguideEditModal').modal();
		});
	};
	
	var initRouteguidedtlModal = function () {
		$('body').on('click', '.pix-routeguidedtl', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_routeguide = $('#RouteguideTable').dataTable().fnGetData(index);
			$('#RouteguidedtlTable').dataTable()._fnAjaxUpdate();
			$('#RouteguidedtlModal').modal();
		});

		$('#RouteguidedtlTable').dataTable({
			'sDom' : 'rt',
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'routeguidedtl!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'routeguidedtlid', 'bSortable' : false }, 
							{'sTitle' : common.view.code, 'mData' : 'routeguidedtlid', 'bSortable' : false }, 
							{'sTitle' : '', 'mData' : 'routeguidedtlid', 'bSortable' : false }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(0)', nRow).html(aData.route.name);
				$('td:eq(1)', nRow).html(aData.route.code);
				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-routeguidedtl-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-routeguidedtl-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				buttonhtml += '</div>';
				$('td:eq(2)', nRow).html(buttonhtml);
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'routeguideid','value':_routeguide.routeguideid });
			} 
		});
		$('#RouteguidedtlTable_wrapper').addClass('form-inline');
		$('#RouteguidedtlTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
		$('#RouteguidedtlTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
		$('#RouteguidedtlTable').css('width', '100%').css('table-layout', 'fixed');

		function refreshRoute() {
			$('#RouteSelect').select2({
				placeholder: common.tips.detail_select,
				minimumInputLength: 0,
				ajax: { 
					url: 'routeguide!routelist.action',
					type: 'GET',
					dataType: 'json',
					results: function (data, page) {
						return {
							results : $.map(data.aaData, function (item) { 
								return { 
									text:item.name, 
									id:item.routeid,
								};
							}),
						};
					}
				},
				formatResult: function (data) {
					return data.text;
				},
				formatSelection: function (data) {
					return data.text;
				},
				initSelection: function(element, callback) {
					if (_routeguidedtl != null) {
						callback({id: _routeguidedtl.routeid, text: _routeguidedtl.route.name });
					}
				},
				dropdownCssClass: "bigdrop", 
				escapeMarkup: function (m) { return m; } 
			});
		}

		var formHandler = new FormHandler($('#RouteguidedtlEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['routeguidedtl.routeid'] = {};
		formHandler.validateOption.rules['routeguidedtl.routeid']['required'] = true;
		formHandler.validateOption.rules['routeguidedtl.routelines'] = {};
		formHandler.validateOption.rules['routeguidedtl.routelines']['required'] = true;
		
		formHandler.validateOption.submitHandler = function(form) {
			if ($('#RouteSelect').select2('data') != null) {
				console.log($('#RouteSelect').select2('data').id);
				$('#RouteguidedtlEditForm input[name="routeguidedtl.routeid"]').val($('#RouteSelect').select2('data').id);
			}
			var data = jQuery("#RouteguidedtlEditForm").serializeArray();
			var formData = new FormData();
			$.each(data, function (i, val) {
				formData.append(val.name, val.value);
			});
			$.ajax({
				type : 'POST',
				url : $('#RouteguidedtlEditForm').attr('action'),
				data : formData,
				contentType: false,
				cache: false,
				processData: false,
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#RouteguidedtlEditModal').modal('hide');
						refresh();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
					$('#RouteguidedtlTable').dataTable()._fnAjaxUpdate();
					$('#RouteguidedtlModal').modal('show');
				},
				error : function() {
					console.log('failue');
				}
			});
		};
		$('#RouteguidedtlEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#RouteguidedtlEditModal')).on('click', function(event) {
			if ($('#RouteguidedtlEditForm').valid()) {
				$('#RouteguidedtlEditForm').submit();
			}
		});
		$('[type=button]', $('#RouteguidedtlEditModal')).on('click', function(event) {
			console.log('xxi');
			$('#RouteguidedtlModal').modal('show');
		});
		
		$('body').on('click', '.pix-routeguidedtl-add', function(event) {
			formHandler.reset();
			$('#RouteguidedtlEditForm').attr('action', 'routeguidedtl!add.action');
			$('#RouteguidedtlEditForm input[name="routeguidedtl.routeguideid"]').val(_routeguide.routeguideid);
			refreshRoute();
			$('#RouteguidedtlModal').modal('hide');
			$('#RouteguidedtlEditModal').modal();
		});			

		$('body').on('click', '.pix-routeguidedtl-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_routeguidedtl = $('#RouteguidedtlTable').dataTable().fnGetData(index);
			formHandler.setdata('routeguidedtl', _routeguidedtl);
			$('#RouteguidedtlEditForm').attr('action', 'routeguidedtl!update.action');
			refreshRoute();
			$('#RouteguidedtlModal').modal('hide');
			$('#RouteguidedtlEditModal').modal();
		});

		$('body').on('click', '.pix-routeguidedtl-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_routeguidedtl = $('#RouteguidedtlTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _routeguidedtl.route.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'routeguidedtl!delete.action',
						cache: false,
						data : {
							'routeguidedtl.routeguidedtlid': _routeguidedtl.routeguidedtlid
						},
						success : function(data, status) {
							if (data.errorcode == 0) {
								$('#RouteguidedtlTable').dataTable()._fnAjaxUpdate();
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

		$('.pix-routeguidedtl-design').on('click', function(event) {
			$('#DesignForm input[name="id"]').val(_routeguide.routeguideid);
			$('#DesignForm input[name="index"]').val(1);
			$('#DesignForm').submit();
		});

		$('.pix-routeguidedtl-design2').on('click', function(event) {
			$('#DesignForm input[name="id"]').val(_routeguide.routeguideid);
			$('#DesignForm input[name="index"]').val(2);
			$('#DesignForm').submit();
		});
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
