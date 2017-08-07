var FolderVideoSelect = function (container) {
	var _self = this;
	var _folderid = 0;
	var _container = container;

	var init = function() {
		$.ajax({
			type : 'POST',
			url : 'folder!list.action',
			data : {},
			success : function(data, status) {
				if (data.errorcode == 0) {
					var folders = data.aaData;
					_folderid = folders[0].folderid;			
					var folderTreeDivData = [];
					createFolderTreeData(folders, folderTreeDivData);
					$(_container).find('.foldertree').each(function() {
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
							$(this).jstree('select_node', _folderid);
						});
						$(this).on('select_node.jstree', function(event, data) {
							_folderid = data.instance.get_node(data.selected[0]).id;
							_self.refresh();
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

		$(_container).find('.remove').on('click', function(e) {
			$(_container).find('.select2').select2('val', '');
			$(_container).find('.select2').val('0');
		});	
	}
	
	var createFolderTreeData = function(folders, treeData) {
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
	
	this.refresh = function(media) {
		$(_container).find('.select2').select2({
			placeholder: common.tips.detail_select,
			minimumInputLength: 0,
			ajax: {
				url: 'video!list.action',
				type: 'GET',
				dataType: 'json',
				data: function (term, page) {
					return {
						sSearch: term,
						iDisplayStart: (page-1)*10,
						iDisplayLength: 10,
						folderid: _folderid,
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
				if (media != null && media.relate != null) {
					callback({id: media.relateid, text: media.relate.name, video: media.relate });
				}
			},
			dropdownCssClass: 'bigdrop', 
			escapeMarkup: function (m) { return m; } 
		});
	}
	
	init();
};
