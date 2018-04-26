var VspModule = function () {
	var _vsp = {};

	var init = function () {
		initVspTable();
		initVspEvent();
		initVspEditModal();
	};

	var refresh = function () {
		$('#VspTable').dataTable()._fnAjaxUpdate();
	};
	
	var initVspTable = function () {
		$('#VspTable').dataTable({
			'sDom' : 'rt',
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'vsp!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.code, 'mData' : 'code', 'bSortable' : false }, 
							{'sTitle' : common.view.maxdevices, 'mData' : 'maxdevices', 'bSortable' : false }, 
							{'sTitle' : common.view.currentdevices, 'mData' : 'currentdevices', 'bSortable' : false }, 
							{'sTitle' : common.view.maxstorage, 'mData' : 'maxstorage', 'bSortable' : false }, 
							{'sTitle' : common.view.currentstorage, 'mData' : 'currentstorage', 'bSortable' : false }, 
							{'sTitle' : '', 'mData' : 'vspid', 'bSortable' : false },
							{'sTitle' : '', 'mData' : 'vspid', 'bSortable' : false }],
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(4)', nRow).html(PixData.transferIntToComma(aData.maxstorage) + ' MB');
				$('td:eq(5)', nRow).html(PixData.transferIntToComma(aData.currentstorage) + ' MB');
				$('td:eq(6)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
				if (aData.code != 'default') {
					$('td:eq(7)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
				} else {
					$('td:eq(7)', nRow).html('');
				}
				return nRow;
			}
		});
		$('#VspTable_wrapper').addClass('form-inline');
		$('#VspTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#VspTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#VspTable_wrapper .dataTables_length select').select2();
		$('#VspTable').css('width', '100%');
	};
	
	var initVspEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_vsp = $('#VspTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _vsp.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'vsp!delete.action',
						cache: false,
						data : {
							'vsp.vspid': _vsp.vspid
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

	var initVspEditModal = function () {
		var currentAppTreeData = [];
		var currentApps = {};
		
		$.ajax({
			type : 'POST',
			url : 'app!list.action',
			data : {},
			success : function(data, status) {
				if (data.errorcode == 0) {
					createAppTreeData(data.aaData, currentAppTreeData);
					createAppTree(currentAppTreeData);
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
		
		function createAppTreeData(apps, treeData) {
			for (var i=0; i<apps.length; i++) {
				treeData[i] = {};
				treeData[i].id = apps[i].appid;
				treeData[i].text = apps[i].mtype + ' - ' + apps[i].sname;
				treeData[i].state = {
					opened: true,
					checked: currentApps[treeData[i].id] == undefined? false : true,
				}
				treeData[i].children = [];
			}
		}
		function refreshAppTreeData(treeData) {
			for (var i=0; i<treeData.length; i++) {
				treeData[i].state = {
					opened: true,
					checked: currentApps[treeData[i].id] == undefined? false : true,
				}
			}
		}
		function createAppTree(treeData) {
			$('#AppTree').jstree('destroy');
			$('#AppTree').jstree({
				'core' : {
					'data' : treeData
				},
				'checkbox' : {
					'checked_parent_open' : true,
					'three_state' : false,
					'tie_selection' : false,
				},
				'plugins' : ['checkbox'],
			});
		}
		
		var formHandler = new FormHandler($('#VspEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['vsp.name'] = {
			required: true,
			minlength: 2,
			remote: {
				url: 'vsp!validate.action',
				type: 'post',
				data: {
					'vsp.vspid': function() {
						return $('#VspEditForm input[name="vsp.vspid"]').val();
					},
					'vsp.name': function() {
						return $('#VspEditForm input[name="vsp.name"]').val();
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
		formHandler.validateOption.rules['vsp.code'] = {
			required: true,
			minlength: 2,
			remote: {
				url: 'vsp!validate.action',
				type: 'post',
				data: {
					'vsp.vspid': function() {
						return $('#VspEditForm input[name="vsp.vspid"]').val();
					},
					'vsp.code': function() {
						return $('#VspEditForm input[name="vsp.code"]').val();
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
			'vsp.name': {
				remote: common.tips.name_repeat
			},
			'vsp.code': {
				remote: common.tips.code_repeat
			},
		};
		formHandler.validateOption.rules['vsp.maxdevices'] = {};
		formHandler.validateOption.rules['vsp.maxdevices']['required'] = true;
		formHandler.validateOption.rules['vsp.maxdevices']['number'] = true;
		formHandler.validateOption.rules['vsp.maxstorage'] = {};
		formHandler.validateOption.rules['vsp.maxstorage']['required'] = true;
		formHandler.validateOption.rules['vsp.maxdevices']['number'] = true;
		
		formHandler.validateOption.submitHandler = function(form) {
			var checkboxes = $('#VspEditForm').find('input[type="checkbox"]');
			$.each( checkboxes, function( key, value ) {
				if (value.checked === false) {
					value.value = 0;
				} else {
					value.value = 1;
				}
			});

			var apps = '';
			var applist = $("#AppTree").jstree('get_checked', false);
			for (var i=0; i<applist.length; i++) {
				if (apps == '') {
					apps += applist[i];
				} else {
					apps += ',' + applist[i];
				}
			}
			$('#VspEditForm input[name="vsp.apps"]').val(apps);
			var data = jQuery("#VspEditForm").serializeArray();
			data = data.concat(
				jQuery('#VspEditForm input[type=checkbox]:not(:checked)').map(
					function() { return {'name': this.name, 'value': this.value}; }
				).get()
			);
			
			var feature = $('input[name="vsp.bundleflag"]').val() + $('input[name="vsp.pageflag"]').val()
			+ $('input[name="vsp.sscreenflag"]').val() + $('input[name="vsp.mscreenflag"]').val()
			+ $('input[name="vsp.reviewflag"]').val() + $('input[name="vsp.touchflag"]').val()
			+ $('input[name="vsp.streamflag"]').val() + $('input[name="vsp.dvbflag"]').val()
			+ $('input[name="vsp.videoinflag"]').val() + $('input[name="vsp.widgetflag"]').val()
			+ $('input[name="vsp.rssflag"]').val() + $('input[name="vsp.diyflag"]').val()
			+ $('input[name="vsp.flowrateflag"]').val() + $('input[name="vsp.tagflag"]').val()
			+ $('input[name="vsp.schoolflag"]').val() + $('input[name="vsp.meetingflag"]').val()
			+ $('input[name="vsp.vipflag"]').val() + $('input[name="vsp.estateflag"]').val()
			+ $('input[name="vsp.liftflag"]').val() + $('input[name="vsp.attendanceflag"]').val()
			+ '00000000000000000000';
			data.push({'name': 'vsp.feature', 'value': feature});

			$.ajax({
				type : 'POST',
				url : $('#VspEditForm').attr('action'),
				data : data,
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#VspEditModal').modal('hide');
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
		$('#VspEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#VspEditModal')).on('click', function(event) {
			if ($('#VspEditForm').valid()) {
				$('#VspEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#VspEditForm').attr('action', 'vsp!add.action');
			$('#VspEditForm input[name="vsp.code"]').removeAttr('readonly');
			
			currentApps = {};
			refreshAppTreeData(currentAppTreeData);
			createAppTree(currentAppTreeData);
			
			$('#VspEditModal').modal();
		});			

		$('body').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_vsp = $('#VspTable').dataTable().fnGetData(index);
			formHandler.setdata('vsp', _vsp);
			$('#VspEditForm').attr('action', 'vsp!update.action');
			$('#VspEditForm input[name="vsp.code"]').attr('readonly','readonly');
			
			currentApps = {};
			if (_vsp.applist != null) {
				for (var i=0; i<_vsp.applist.length; i++) {
					currentApps[_vsp.applist[i].appid] = _vsp.applist[i];
				}
			}
			refreshAppTreeData(currentAppTreeData);
			createAppTree(currentAppTreeData);
			
			$('#VspEditModal').modal();
		});

		$('input[name="vsp.expireflag"]').click(function(e) {
			if ($('input[name="vsp.expireflag"]:checked').val() == 0) {
				$('.expiretime').css('display', 'none');
			} else {
				$('.expiretime').css('display', 'block');
			}
		});  
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
