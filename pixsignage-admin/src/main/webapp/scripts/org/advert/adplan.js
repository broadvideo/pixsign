var AdplanModule = function () {
	var _adplan;
	var _adplandtl;

	var init = function () {
		initAdplanTable();
		initAdplanEvent();
		initAdplanEditModal();
		initAdplandtlModal();
		initAdplandtlEditModal();
	};

	var refresh = function () {
		$('#AdplanTable').dataTable()._fnAjaxUpdate();
	};
	
	var initAdplanTable = function () {
		$('#AdplanTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'adplan!list.action',
			'aoColumns' : [ {'sTitle' : '广告位', 'mData' : 'adplace', 'bSortable' : false, 'sWidth' : '25%' },
							{'sTitle' : '终端组', 'mData' : 'devicegroup.name', 'bSortable' : false, 'sWidth' : '30%' },
							{'sTitle' : '每秒单价(按月)', 'mData' : 'unitprice', 'bSortable' : false, 'sWidth' : '30%' },
							{'sTitle' : '', 'mData' : 'adplanid', 'bSortable' : false, 'sWidth' : '5%' },
							{'sTitle' : '', 'mData' : 'adplanid', 'bSortable' : false, 'sWidth' : '5%' },
							{'sTitle' : '', 'mData' : 'adplanid', 'bSortable' : false, 'sWidth' : '5%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(2)', nRow).html((aData.unitprice/100).toFixed(2));
				$('td:eq(3)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-detail"><i class="fa fa-list-ul"></i> ' + common.view.detail + '</a>');
				$('td:eq(4)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
				$('td:eq(5)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
			}
		});
		$('#AdplanTable_wrapper').addClass('form-inline');
		$('#AdplanTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#AdplanTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#AdplanTable_wrapper .dataTables_length select').select2();
		$('#AdplanTable').css('width', '100%');
	};
	
	var initAdplanEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_adplan = $('#AdplanTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'adplan!delete.action',
						cache: false,
						data : {
							'adplan.adplanid': _adplan.adplanid
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

		$('body').on('click', '.pix-adplandtl-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_adplandtl = $('#AdplandtlTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'adplandtl!delete.action',
						cache: false,
						data : {
							'adplandtl.adplandtlid': _adplandtl.adplandtlid
						},
						success : function(data, status) {
							if (data.errorcode == 0) {
								$('#AdplandtlTable').dataTable()._fnAjaxUpdate();
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

	var initAdplanEditModal = function () {
		$('#DevicegroupSelect').select2({
			placeholder: common.tips.detail_select,
			minimumInputLength: 0,
			ajax: { 
				url: 'devicegroup!list.action',
				type: 'GET',
				dataType: 'json',
				data: function (term, page) {
					return {
						type: 1,
						sSearch: term, 
						iDisplayStart: (page-1)*10,
						iDisplayLength: 10,
					};
				},
				results: function (data, page) {
					var more = (page * 10) < data.iTotalRecords; 
					return {
						results : $.map(data.aaData, function (item) { 
							return { 
								text:item.name, 
								id:item.devicegroupid,
								devicegroup:item, 
							};
						}),
						more: more
					};
				}
			},
			formatResult: function(data) {
				return '<span>' + data.devicegroup.name + '</span>';
			},
			formatSelection: function(data) {
				return '<span>' + data.devicegroup.name + '</span>';
			},
			dropdownCssClass: 'bigdrop', 
			escapeMarkup: function (m) { return m; } 
		});

		var formHandler = new FormHandler($('#AdplanEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['adplan.adplace'] = {};
		formHandler.validateOption.rules['adplan.adplace']['required'] = true;
		formHandler.validateOption.rules['adplan.devicegroupid'] = {};
		formHandler.validateOption.rules['adplan.devicegroupid']['required'] = true;
		formHandler.validateOption.rules['adplan.unitprice'] = {};
		formHandler.validateOption.rules['adplan.unitprice']['required'] = true;
		formHandler.validateOption.rules['adplan.unitprice']['number'] = true;
		formHandler.validateOption.submitHandler = function(form) {
			$.ajax({
				type : 'POST',
				url : $('#AdplanEditForm').attr('action'),
				data : $('#AdplanEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#AdplanEditModal').modal('hide');
						bootbox.alert(common.tips.success);
						refresh();
					} else {
						$('#AdplanEditModal').modal('hide');
						bootbox.alert(common.tips.error);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		};
		$('#AdplanEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#AdplanEditModal')).on('click', function(event) {
			if ($('#AdplanEditForm').valid()) {
				$('#AdplanEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-add', function(event) {
			formHandler.reset();
			$('#DevicegroupSelect').select2('data', null);
			$('#AdplanEditForm').attr('action', 'adplan!add.action');
			$('.hide-update').css('display', 'block');
			$('#AdplanEditModal').modal();
		});			

		$('#AdplanTable').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_adplan = $('#AdplanTable').dataTable().fnGetData(index);
			formHandler.setdata('adplan', _adplan);
			$('#AdplanEditForm').attr('action', 'adplan!update.action');
			$('.hide-update').css('display', 'none');
			$('#AdplanEditModal').modal();
		});
	};
	
	var initAdplandtlModal = function () {
		$('#AdplandtlTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'adplandtl!list.action',
			'aoColumns' : [ {'sTitle' : '广告位', 'mData' : 'adplace', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : '终端组', 'mData' : 'devicegroup.name', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : '', 'mData' : 'adplanid', 'bSortable' : false, 'sWidth' : '5%' },
							{'sTitle' : '', 'mData' : 'adplanid', 'bSortable' : false, 'sWidth' : '15%' },
							{'sTitle' : '单次时长(秒)', 'mData' : 'duration', 'bSortable' : false, 'sWidth' : '15%' },
							{'sTitle' : '循环内次数', 'mData' : 'times', 'bSortable' : false, 'sWidth' : '15%' },
							{'sTitle' : '单价', 'mData' : 'unitprice', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : '总价', 'mData' : 'amount', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : '周期', 'mData' : 'starttime', 'bSortable' : false, 'sWidth' : '20%' },
							{'sTitle' : '', 'mData' : 'adplanid', 'bSortable' : false, 'sWidth' : '5%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var thumbwidth = 100;
				var thumbhtml = '';
				var playhtml = '';
				if (aData.adtype == 1 && aData.video != null) {
					thumbhtml += '<div class="thumbs" style="width:40px; height:40px;"><img src="/pixsigdata' + aData.video.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%"></div>';
					playhtml = common.view.video + ': ' + aData.video.name;
				} else if (aData.adtype == 2 && aData.image != null) {
					thumbwidth = aData.image.width > aData.image.height? 100 : 100*aData.image.width/aData.image.height;
					thumbhtml += '<div class="thumbs" style="width:40px; height:40px;"><img src="/pixsigdata' + aData.image.thumbnail + '" class="imgthumb" width="' + thumbwidth + '%"></div>';
					playhtml += common.view.image + ': ' + aData.image.name;
				}
				$('td:eq(2)', nRow).html(thumbhtml);
				$('td:eq(3)', nRow).html(playhtml);
				$('td:eq(6)', nRow).html((aData.unitprice/100).toFixed(2));
				$('td:eq(7)', nRow).html((aData.amount/100).toFixed(2));
				$('td:eq(8)', nRow).html(aData.starttime + ' ~ ' + aData.endtime);
				$('td:eq(9)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-adplandtl-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				if (_adplan != null) {
					aoData.push({'name':'adplanid','value':_adplan.adplanid });
				}
			}
		});
		$('#AdplandtlTable_wrapper').addClass('form-inline');
		$('#AdplandtlTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#AdplandtlTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#AdplandtlTable_wrapper .dataTables_length select').select2();
		$('#AdplandtlTable').css('width', '100%');

		$('body').on('click', '.pix-detail', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			_adplan = $('#AdplanTable').dataTable().fnGetData(index);
			$('#AdplandtlTable').dataTable()._fnAjaxUpdate();
			$('#AdplandtlModal').modal();
		});
		
	};
	
	var initAdplandtlEditModal = function () {
		var folderid;
		$.ajax({
			type : 'POST',
			url : 'folder!list.action',
			data : { },
			success : function(data, status) {
				if (data.errorcode == 0) {
					var folders = data.aaData;
					folderid = folders[0].folderid;
					
					var folderTreeDivData = [];
					createFolderTreeData(folders, folderTreeDivData);
					$('.foldertree').each(function() {
						$(this).jstree('destroy');
						$(this).jstree({
							'core' : {
								'multiple' : false,
								'data' : folderTreeDivData
							},
							'plugins' : ['unique', 'types'],
							'types' : {
								'default' : { 'icon' : 'fa fa-folder icon-state-warning icon-lg' }
							},
						});
						$(this).on('loaded.jstree', function() {
							$(this).jstree('select_node', folderid);
						});
						$(this).on('select_node.jstree', function(event, data) {
							folderid = data.instance.get_node(data.selected[0]).id;
							refreshAdvertSelect();
						});
					});
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				console.log('failue');
			}
		});
		function createFolderTreeData(folders, treeData) {
			if (folders == null) return;
			for (var i=0; i<folders.length; i++) {
				treeData[i] = {};
				treeData[i].id = folders[i].folderid;
				treeData[i].text = folders[i].name;
				treeData[i].state = {
					opened: true,
				}
				treeData[i].children = [];
				createFolderTreeData(folders[i].children, treeData[i].children);
			}
		}
		
		$('#AdplandtlEditForm input[name="adplandtl.adtype"]').change(function(e) {
			refreshAdvertSelect();
		});

		function refreshAdvertSelect() {
			var adtype = $('#AdplandtlEditForm input[name="adplandtl.adtype"]:checked').attr('value');
			console.log(adtype);
			if (adtype == 1) {
				$('#AdvertSelect').select2({
					placeholder: common.tips.detail_select,
					minimumInputLength: 0,
					ajax: {
						url: 'video!list.action',
						type: 'GET',
						dataType: 'json',
						data: function (term, page) {
							return {
								adflag: 1,
								sSearch: term,
								iDisplayStart: (page-1)*10,
								iDisplayLength: 10,
								folderid: folderid,
							};
						},
						results: function (data, page) {
							var more = (page * 10) < data.iTotalRecords; 
							return {
								results : $.map(data.aaData, function (item) { 
									return { 
										text:item.name, 
										id:item.videoid, 
										video:item, 
									};
								}),
								more: more
							};
						}
					},
					formatResult: function(data) {
						var width = 40;
						var height = 40 * data.video.height / data.video.width;
						if (data.video.width < data.video.height) {
							height = 40;
							width = 40 * data.video.width / data.video.height;
						}
						var html = '<span><img src="/pixsigdata' + data.video.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.video.name + '</span>'
						return html;
					},
					formatSelection: function(data) {
						var width = 30;
						var height = 30 * height / width;
						if (data.video.width < data.video.height) {
							height = 30;
							width = 30 * width / height;
						}
						var html = '<span><img src="/pixsigdata' + data.video.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/></span>'
						return html;
					},
					initSelection: function(element, callback) {
					},
					dropdownCssClass: 'bigdrop', 
					escapeMarkup: function (m) { return m; } 
				});
			} else if (adtype == 2) {
				$('#AdvertSelect').select2({
					placeholder: common.tips.detail_select,
					minimumInputLength: 0,
					ajax: {
						url: 'image!list.action',
						type: 'GET',
						dataType: 'json',
						data: function (term, page) {
							return {
								adflag: 1,
								sSearch: term,
								iDisplayStart: (page-1)*10,
								iDisplayLength: 10,
								folderid: folderid,
							};
						},
						results: function (data, page) {
							var more = (page * 10) < data.iTotalRecords; 
							return {
								results : $.map(data.aaData, function (item) { 
									return { 
										text:item.name, 
										id:item.imageid, 
										image:item, 
									};
								}),
								more: more
							};
						}
					},
					formatResult: function(data) {
						var width = 40;
						var height = 40 * data.image.height / data.image.width;
						if (data.image.width < data.image.height) {
							height = 40;
							width = 40 * data.image.width / data.image.height;
						}
						var html = '<span><img src="/pixsigdata' + data.image.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/> ' + data.image.name + '</span>'
						return html;
					},
					formatSelection: function(data) {
						var width = 30;
						var height = 30 * height / width;
						if (data.image.width < data.image.height) {
							height = 30;
							width = 30 * width / height;
						}
						var html = '<span><img src="/pixsigdata' + data.image.thumbnail + '" width="' + width + 'px" height="' + height + 'px"/></span>'
						return html;
					},
					initSelection: function(element, callback) {
					},
					dropdownCssClass: 'bigdrop', 
					escapeMarkup: function (m) { return m; } 
				});
			}
		}

		var formHandler = new FormHandler($('#AdplandtlEditForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['adplandtl.adid'] = {};
		formHandler.validateOption.rules['adplandtl.adid']['required'] = true;
		formHandler.validateOption.rules['adplandtl.times'] = {};
		formHandler.validateOption.rules['adplandtl.times']['required'] = true;
		formHandler.validateOption.rules['adplandtl.times']['number'] = true;
		formHandler.validateOption.rules['adplandtl.starttime'] = {};
		formHandler.validateOption.rules['adplandtl.starttime']['required'] = true;
		formHandler.validateOption.rules['adplandtl.months'] = {};
		formHandler.validateOption.rules['adplandtl.months']['required'] = true;
		formHandler.validateOption.rules['adplandtl.months']['number'] = true;
		formHandler.validateOption.submitHandler = function(form) {
			$('#AdplandtlEditForm input[name="adplandtl.adplanid"]').val(_adplan.adplanid);
			$('#AdplandtlEditForm input[name="adplandtl.adplace"]').val(_adplan.adplace);
			$('#AdplandtlEditForm input[name="adplandtl.devicegroupid"]').val(_adplan.devicegroupid);
			$('#AdplandtlEditForm input[name="adplandtl.unitprice"]').val(_adplan.unitprice);
			var starttime = $('#AdplandtlEditForm input[name="adplandtl.starttime"]').val();
			$('#AdplandtlEditForm input[name="adplandtl.starttime"]').val(starttime + '-01 00:00:00');
			$.ajax({
				type : 'POST',
				url : $('#AdplandtlEditForm').attr('action'),
				data : $('#AdplandtlEditForm').serialize(),
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#AdplandtlEditModal').modal('hide');
						bootbox.alert(common.tips.success);
						$('#AdplandtlTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
		};
		$('#AdplandtlEditForm').validate(formHandler.validateOption);

		$('[type=submit]', $('#AdplandtlEditModal')).on('click', function(event) {
			if ($('#AdplandtlEditForm').valid()) {
				$('#AdplandtlEditForm').submit();
			}
		});
		
		$('body').on('click', '.pix-adplandtl-add', function(event) {
			formHandler.reset();
			refreshAdvertSelect();
			$('#AdplandtlEditForm').attr('action', 'adplandtl!add.action');
			$('#AdplandtlEditModal').modal();
		});			

		$('.form_datetime').datetimepicker({
			autoclose: true,
			isRTL: Metronic.isRTL(),
			format: 'yyyy-mm',
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
