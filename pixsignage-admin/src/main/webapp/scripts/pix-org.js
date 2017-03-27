var myurls = {
	'common.list' : 'org!list.action',
	'common.add' : 'org!add.action',
	'common.update' : 'org!update.action',
	'common.delete' : 'org!delete.action',
	'org.validate' : 'org!validate.action',
	'vsp.get' : 'vsp!get.action',
	'app.list' : 'app!list.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}

var CurrentVsp;
function initMyTable() {
	var oTable = $('#MyTable').dataTable({
		'sDom' : 'rt',
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ]
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : common.view.code, 'mData' : 'code', 'bSortable' : false }, 
						{'sTitle' : common.view.expiretime, 'mData' : 'expiretime', 'bSortable' : false }, 
						{'sTitle' : common.view.maxdevices, 'mData' : 'maxdevices', 'bSortable' : false }, 
						{'sTitle' : common.view.currentdevices, 'mData' : 'currentdevices', 'bSortable' : false }, 
						{'sTitle' : common.view.maxstorage, 'mData' : 'maxstorage', 'bSortable' : false }, 
						{'sTitle' : common.view.currentstorage, 'mData' : 'currentstorage', 'bSortable' : false }, 
						{'sTitle' : '', 'mData' : 'orgid', 'bSortable' : false },
						{'sTitle' : '', 'mData' : 'orgid', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(5)', nRow).html(transferIntToComma(aData.maxstorage) + ' MB');
			$('td:eq(6)', nRow).html(transferIntToComma(aData.currentstorage) + ' MB');

			$('td:eq(7)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
			if (aData.code != 'default') {
				$('td:eq(8)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
			} else {
				$('td:eq(8)', nRow).html('');
			}
			return nRow;
		}
	});

	jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	jQuery('#MyTable_wrapper .dataTables_length select').select2();
	
	
	var currentItem;
	$('body').on('click', '.pix-delete', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		var action = myurls['common.delete'];
		currentItem = item;
		
		bootbox.confirm(common.tips.remove + currentItem.name, function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : action,
					cache: false,
					data : {
						'org.orgid': currentItem['orgid']
					},
					success : function(data, status) {
						if (data.errorcode == 0) {
							refreshMyTable();
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
}

function refreshVsp(org) {
	$.ajax({
		url: myurls['vsp.get'],
		type : 'POST',
		dataType: "json",
		success : function(data, status) {
			if (data.errorcode == 0) {
				var max1 = parseInt(data.vsp.maxdevices - data.vsp.currentdevices);
				var max2 = parseInt(data.vsp.maxstorage - data.vsp.currentstorage);
				if (org != null) {
					max1 += org.maxdevices;
					max2 += org.maxstorage;
				}
				max1 = (max1 < 0 ? 0 : max1);
				max2 = (max2 < 0 ? 0 : max2);
				FormValidateOption.rules['org.maxdevices']['max'] = max1;
				FormValidateOption.rules['org.maxstorage']['max'] = max2;
				$.extend($('#MyEditForm').validate().settings, {
					rules: FormValidateOption.rules
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

function initMyEditModal() {
	var currentAppTreeData = [];
	var currentApps = {};
	
	$.ajax({
		type : 'POST',
		url : myurls['app.list'],
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
			treeData[i].text = apps[i].mainboard + ' - ' + apps[i].description + '(' + apps[i].name + ')';
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

	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	FormValidateOption.rules = {};
	FormValidateOption.rules['org.name'] = {
		required: true,
		minlength: 2,
		remote: {
			url: myurls['org.validate'],
			type: 'post',
			data: {
				'org.orgid': function() {
					return $('#MyEditForm input[name="org.orgid"]').val();
				},
				'org.name': function() {
					return $('#MyEditForm input[name="org.name"]').val();
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
	FormValidateOption.rules['org.code'] = {
			required: true,
			minlength: 2,
			remote: {
				url: myurls['org.validate'],
				type: 'post',
				data: {
					'org.orgid': function() {
						return $('#MyEditForm input[name="org.orgid"]').val();
					},
					'org.code': function() {
						return $('#MyEditForm input[name="org.code"]').val();
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
	FormValidateOption.messages = {
		'org.name': {
			remote: common.tips.name_repeat
		},
		'org.code': {
			remote: common.tips.code_repeat
		},
	};
	FormValidateOption.rules['org.maxdevices'] = {};
	FormValidateOption.rules['org.maxdevices']['required'] = true;
	FormValidateOption.rules['org.maxdevices']['number'] = true;
	FormValidateOption.rules['org.maxstorage'] = {};
	FormValidateOption.rules['org.maxstorage']['required'] = true;
	FormValidateOption.rules['org.maxstorage']['number'] = true;
	
	FormValidateOption.submitHandler = function(form) {
		if ($('input[name="org.expireflag"]:checked').val() == 0) {
			$('input[name="org.expiretime"]').val('2037-01-01');
		}
		
		var checkboxes = $('#MyEditForm').find('input[type="checkbox"]');
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
		$('#MyEditForm input[name="org.apps"]').val(apps);

		var data = jQuery("#MyEditForm").serializeArray();
		data = data.concat(
			jQuery('#MyEditForm input[type=checkbox]:not(:checked)').map(
				function() {
					return {"name": this.name, "value": this.value};
				}).get()
		);
		
		$.ajax({
			type : 'POST',
			url : $('#MyEditForm').attr('action'),
			data : data,
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#MyEditModal').modal('hide');
					bootbox.alert(common.tips.success);
					refreshMyTable();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	};
	$('#MyEditForm').validate(FormValidateOption);

	$('[type=submit]', $('#MyEditModal')).on('click', function(event) {
		if ($('#MyEditForm').valid()) {
			$('#MyEditForm').submit();
		}
	});
	
	$('body').on('click', '.pix-add', function(event) {
		//if ($('#MyTable').dataTable().fnGetData().length >= MaxOrgs) {
		//	bootbox.alert(common.tips.maxorgs);
		//	return;
		//}
		refreshVsp(null);
		
		var action = myurls['common.add'];
		refreshForm('MyEditForm');
		var checkboxes = $('#MyEditForm').find('input[type="checkbox"]');
		$.each( checkboxes, function( index, checkbox ) {
			$(checkbox).val('1');
			$(checkbox).attr('checked', 'checked');
			$(checkbox).parent().addClass('checked');
		});
		if ($('input[name="org.expireflag"]:checked').val() == 0) {
			$('.expiretime').css('display', 'none');
		} else {
			$('.expiretime').css('display', 'block');
		}
		$('#MyEditForm').attr('action', action);
		$('#MyEditForm input[name="org.code"]').removeAttr('readonly');

		$('.pix-ctrl').css('display', PixCtrl?'':'none');
		$('.review-ctrl').css('display', ReviewCtrl?'':'none');
		$('.touch-ctrl').css('display', TouchCtrl?'':'none');
		$('.calendar-ctrl').css('display', CalendarCtrl?'':'none');
		$('.mscreen-ctrl').css('display', MscreenCtrl?'':'none');
		$('.lift-ctrl').css('display', LiftCtrl?'':'none');
		$('.stream-ctrl').css('display', StreamCtrl?'':'none');
		$('.dvb-ctrl').css('display', DvbCtrl?'':'none');
		$('.videoin-ctrl').css('display', VideoinCtrl?'':'none');
		
		currentApps = {};
		refreshAppTreeData(currentAppTreeData);
		createAppTree(currentAppTreeData);
		
		$('#MyEditModal').modal();
	});			

	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);

		refreshVsp(item);
		
		var action = myurls['common.update'];
		var formdata = new Object();
		for (var name in item) {
			formdata['org.' + name] = item[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		var checkboxes = $('#MyEditForm').find('input[type="checkbox"]');
		$.each( checkboxes, function( index, checkbox ) {
			if (formdata[$(checkbox).attr('name')] == 0) {
				$(checkbox).removeAttr('checked');
				$(checkbox).parent().removeClass('checked');
			} else {
				$(checkbox).attr('checked');
				$(checkbox).parent().addClass('checked');
			}
		});
		if ($('input[name="org.expireflag"]:checked').val() == 0) {
			$('.expiretime').css('display', 'none');
		} else {
			$('.expiretime').css('display', 'block');
		}
		$('#MyEditForm').attr('action', action);
		$('#MyEditForm input[name="org.code"]').attr('readonly','readonly');
		$('.pix-ctrl').css('display', PixCtrl?'':'none');
		$('.review-ctrl').css('display', ReviewCtrl?'':'none');
		$('.touch-ctrl').css('display', TouchCtrl?'':'none');
		$('.calendar-ctrl').css('display', CalendarCtrl?'':'none');
		$('.mscreen-ctrl').css('display', MscreenCtrl?'':'none');
		$('.lift-ctrl').css('display', LiftCtrl?'':'none');
		$('.stream-ctrl').css('display', StreamCtrl?'':'none');
		$('.dvb-ctrl').css('display', DvbCtrl?'':'none');
		$('.videoin-ctrl').css('display', VideoinCtrl?'':'none');
		
		currentApps = {};
		if (item.applist != null) {
			for (var i=0; i<item.applist.length; i++) {
				currentApps[item.applist[i].appid] = item.applist[i];
			}
		}
		refreshAppTreeData(currentAppTreeData);
		createAppTree(currentAppTreeData);
		
		$('#MyEditModal').modal();
	});

	$('input[name="org.expireflag"]').click(function(e) {
		if ($('input[name="org.expireflag"]:checked').val() == 0) {
			$('.expiretime').css('display', 'none');
		} else {
			$('.expiretime').css('display', 'block');
		}
	});  

	$(".form_datetime").datetimepicker({
		autoclose: true,
		isRTL: Metronic.isRTL(),
		format: "yyyy-mm-dd",
		pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left"),
		language: "zh-CN",
		minView: 'month',
		todayBtn: true
	});
}

