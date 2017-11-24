var OrgModule = function () {
	var _org = {};

	var init = function () {
		initOrgTable();
		initOrgEvent();
		initOrgEditModal();
	};

	var refresh = function () {
		$('#OrgTable').dataTable()._fnAjaxUpdate();
	};
	
	var initOrgTable = function () {
		$('#OrgTable').dataTable({
			'sDom' : 'rt',
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'org!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.code, 'mData' : 'code', 'bSortable' : false }, 
							{'sTitle' : common.view.expiretime, 'mData' : 'expiretime', 'bSortable' : false }, 
							{'sTitle' : common.view.maxdevices, 'mData' : 'maxdevices', 'bSortable' : false }, 
							{'sTitle' : common.view.currentdevices, 'mData' : 'currentdevices', 'bSortable' : false }, 
							{'sTitle' : common.view.maxstorage, 'mData' : 'maxstorage', 'bSortable' : false }, 
							{'sTitle' : common.view.currentstorage, 'mData' : 'currentstorage', 'bSortable' : false }, 
							{'sTitle' : '', 'mData' : 'orgid', 'bSortable' : false }],
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(5)', nRow).html(PixData.transferIntToComma(aData.maxstorage) + ' MB');
				$('td:eq(6)', nRow).html(PixData.transferIntToComma(aData.currentstorage) + ' MB');

				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs yellow pix-password"><i class="fa fa-lock"></i> ' + common.view.password_reset + '</a>';
				if (aData.code != 'default') {
					buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				}
				buttonhtml += '</div>';
				$('td:eq(7)', nRow).html(buttonhtml);
				return nRow;
			}
		});
		$('#OrgTable_wrapper').addClass('form-inline');
		$('#OrgTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#OrgTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#OrgTable_wrapper .dataTables_length select').select2();
		$('#OrgTable').css('width', '100%');
	};
	
	var initOrgEvent = function () {
		$('body').on('click', '.pix-password', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_org = $('#OrgTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.resetpassword + _org.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'org!resetpassword.action',
						cache: false,
						data : {
							'org.orgid': _org.orgid
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

		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_org = $('#OrgTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + _org.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'org!delete.action',
						cache: false,
						data : {
							'org.orgid': _org.orgid
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

		$('body').on('click', '.pix-full', function(event) {
			bootbox.alert(common.tips.org_full);
		});			
	};

	var initOrgEditModal = function () {
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
		
		function refreshTimezone() {
			$('#TimezoneSelect').select2({
				placeholder: common.tips.detail_select,
				minimumInputLength: 0,
				ajax: { 
					url: 'timezone!list.action',
					type: 'GET',
					dataType: 'json',
					data: function (term, page) {
						return {
							sSearch: term, 
							iDisplayStart: (page-1)*20,
							iDisplayLength: 20,
						};
					},
					results: function (data, page) {
						var more = (page * 10) < data.iTotalRecords; 
						return {
							results : $.map(data.aaData, function (item) { 
								return { 
									text:item.name, 
									id:item.name,
								};
							}),
							more: more
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
					if (_org != null) {
						callback({id: _org.timezone, text: _org.timezone });
					}
				},
				dropdownCssClass: "bigdrop", 
				escapeMarkup: function (m) { return m; } 
			});
		}

		function refreshVsp(org) {
			$.ajax({
				url: 'vsp!get.action',
				type : 'POST',
				dataType: "json",
				success : function(data, status) {
					if (data.errorcode == 0) {
						var max1 = parseInt(data.vsp.maxdevices) - parseInt(data.vsp.currentdevices);
						var max2 = parseInt(data.vsp.maxstorage) - parseInt(data.vsp.currentstorage);
						if (org != null) {
							max1 += org.maxdevices;
							max2 += org.maxstorage;
						}
						max1 = (max1 < 0 ? 0 : max1);
						max2 = (max2 < 0 ? 0 : max2);
						formHandler.validateOption.rules['org.maxdevices']['max'] = max1;
						formHandler.validateOption.rules['org.maxstorage']['max'] = max2;
						$.extend($('#OrgEditForm').validate().settings, {
							rules: formHandler.validateOption.rules
						});
						if (max1 == 0 || max2 == 0) {
							$('.pix-add').removeClass('pix-add').addClass('pix-full');
						} else {
							$('.pix-full').removeClass('pix-full').addClass('pix-add');
						}
					}
				}
			});
		}

		var formHandler = new FormHandler($('#OrgEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['org.name'] = {
			required: true,
			minlength: 2,
			remote: {
				url: 'org!validate.action',
				type: 'post',
				data: {
					'org.orgid': function() {
						return $('#OrgEditForm input[name="org.orgid"]').val();
					},
					'org.name': function() {
						return $('#OrgEditForm input[name="org.name"]').val();
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
		formHandler.validateOption.rules['org.code'] = {
			required: true,
			minlength: 2,
			remote: {
				url: 'org!validate.action',
				type: 'post',
				data: {
					'org.orgid': function() {
						return $('#OrgEditForm input[name="org.orgid"]').val();
					},
					'org.code': function() {
						return $('#OrgEditForm input[name="org.code"]').val();
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
			'org.name': {
				remote: common.tips.name_repeat
			},
			'org.code': {
				remote: common.tips.code_repeat
			},
		};
		formHandler.validateOption.rules['org.maxdevices'] = {};
		formHandler.validateOption.rules['org.maxdevices']['required'] = true;
		formHandler.validateOption.rules['org.maxdevices']['number'] = true;
		formHandler.validateOption.rules['org.maxdevices1'] = {};
		formHandler.validateOption.rules['org.maxdevices1']['required'] = true;
		formHandler.validateOption.rules['org.maxdevices1']['number'] = true;
		formHandler.validateOption.rules['org.maxdevices2'] = {};
		formHandler.validateOption.rules['org.maxdevices2']['required'] = true;
		formHandler.validateOption.rules['org.maxdevices2']['number'] = true;
		formHandler.validateOption.rules['org.maxstorage'] = {};
		formHandler.validateOption.rules['org.maxstorage']['required'] = true;
		formHandler.validateOption.rules['org.maxstorage']['number'] = true;
		
		formHandler.validateOption.submitHandler = function(form) {
			if ($('input[name="org.expireflag"]:checked').val() == 0) {
				$('input[name="org.expiretime"]').val('2037-01-01');
			}
			
			var checkboxes = $('#OrgEditForm').find('input[type="checkbox"]');
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
			$('#OrgEditForm input[name="org.apps"]').val(apps);
			var data = jQuery("#OrgEditForm").serializeArray();
			data = data.concat(
				jQuery('#OrgEditForm input[type=checkbox]:not(:checked)').map(
				function() {
					return {"name": this.name, "value": this.value};
				}).get()
			);

			var formData = new FormData();
			var inputs = $(':input', '#OrgEditForm');
			$.each(data, function (i, val) {
				formData.append(val.name, val.value);
			});
			$.each($('#OrgEditForm').find("input[type='file']"), function(i, tag) {
				$.each($(tag)[0].files, function(i, file) {
					formData.append(tag.name, file);
				});
			});
			
			$.ajax({
				type : 'POST',
				url : $('#OrgEditForm').attr('action'),
				data : formData,
				contentType: false,
				cache: false,
				processData: false,
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#OrgEditModal').modal('hide');
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
		$('#OrgEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#OrgEditModal')).on('click', function(event) {
			if ($('#OrgEditForm').valid()) {
				$('#OrgEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			refreshVsp(null);
			formHandler.reset();
			if ($('input[name="org.expireflag"]:checked').val() == 0) {
				$('.expiretime').css('display', 'none');
			} else {
				$('.expiretime').css('display', 'block');
			}
			$('#OrgEditForm').attr('action', 'org!add.action');
			$('#OrgEditForm input[name="org.code"]').removeAttr('readonly');
			
			$('.pix-ctrl').css('display', PixCtrl?'':'none');
			$('.bundle-ctrl').css('display', BundleCtrl?'':'none');
			$('.page-ctrl').css('display', PageCtrl?'':'none');
			$('.review-ctrl').css('display', ReviewCtrl?'':'none');
			$('.touch-ctrl').css('display', TouchCtrl?'':'none');
			$('.calendar-ctrl').css('display', CalendarCtrl?'':'none');
			$('.mscreen-ctrl').css('display', MscreenCtrl?'':'none');
			$('.lift-ctrl').css('display', LiftCtrl?'':'none');
			$('.flowrate-ctrl').css('display', FlowrateCtrl?'':'none');
			$('.tag-ctrl').css('display', TagCtrl?'':'none');
			$('.diy-ctrl').css('display', DiyCtrl?'':'none');
			$('.meeting-ctrl').css('display', MeetingCtrl?'':'none');
			$('.stream-ctrl').css('display', StreamCtrl?'':'none');
			$('.dvb-ctrl').css('display', DvbCtrl?'':'none');
			$('.videoin-ctrl').css('display', VideoinCtrl?'':'none');
			
			currentApps = {};
			refreshAppTreeData(currentAppTreeData);
			createAppTree(currentAppTreeData);
			refreshTimezone();
			$('#TimezoneSelect').select2('data', {
				id: 'Asia/Shanghai', 
				text: 'Asia/Shanghai'
			});
			
			$('#OrgEditModal').modal();
		});			

		$('body').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_org = $('#OrgTable').dataTable().fnGetData(index);
			refreshVsp(_org);
			formHandler.setdata('org', _org);
			if ($('input[name="org.expireflag"]:checked').val() == 0) {
				$('.expiretime').css('display', 'none');
			} else {
				$('.expiretime').css('display', 'block');
			}
			$('#OrgEditForm').attr('action', 'org!update.action');
			$('#OrgEditForm input[name="org.code"]').attr('readonly','readonly');
			$('.pix-ctrl').css('display', PixCtrl?'':'none');
			$('.bundle-ctrl').css('display', BundleCtrl?'':'none');
			$('.page-ctrl').css('display', PageCtrl?'':'none');
			$('.review-ctrl').css('display', ReviewCtrl?'':'none');
			$('.touch-ctrl').css('display', TouchCtrl?'':'none');
			$('.calendar-ctrl').css('display', CalendarCtrl?'':'none');
			$('.mscreen-ctrl').css('display', MscreenCtrl?'':'none');
			$('.lift-ctrl').css('display', LiftCtrl?'':'none');
			$('.flowrate-ctrl').css('display', FlowrateCtrl?'':'none');
			$('.tag-ctrl').css('display', TagCtrl?'':'none');
			$('.diy-ctrl').css('display', DiyCtrl?'':'none');
			$('.meeting-ctrl').css('display', MeetingCtrl?'':'none');
			$('.stream-ctrl').css('display', StreamCtrl?'':'none');
			$('.dvb-ctrl').css('display', DvbCtrl?'':'none');
			$('.videoin-ctrl').css('display', VideoinCtrl?'':'none');
			
			currentApps = {};
			if (_org.applist != null) {
				for (var i=0; i<_org.applist.length; i++) {
					currentApps[_org.applist[i].appid] = _org.applist[i];
				}
			}
			refreshAppTreeData(currentAppTreeData);
			createAppTree(currentAppTreeData);
			refreshTimezone();
			
			$('#OrgEditModal').modal();
		});

		$('input[name="org.expireflag"]').click(function(e) {
			if ($('input[name="org.expireflag"]:checked').val() == 0) {
				$('.expiretime').css('display', 'none');
			} else {
				$('.expiretime').css('display', 'block');
			}
		});  

		$('.form_datetime').datetimepicker({
			autoclose: true,
			isRTL: Metronic.isRTL(),
			format: 'yyyy-mm-dd',
			pickerPosition: (Metronic.isRTL() ? 'bottom-right' : 'bottom-left'),
			language: 'zh-CN',
			minView: 'month',
			todayBtn: true
		});
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
