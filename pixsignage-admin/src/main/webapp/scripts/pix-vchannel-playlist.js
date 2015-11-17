var myurls = {
	'common.list' : 'playlist!list.action',
	'common.add' : 'playlist!add.action',
	'common.update' : 'playlist!update.action',
	'common.delete' : 'playlist!delete.action',
	'playlist.dtllist' : 'playlist!dtllist.action',
	'playlist.dtlsync' : 'playlist!dtlsync.action',
	'video.list' : 'video!list.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

function initMyTable() {
	var oTable = $('#MyTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : common.view.createtime, 'mData' : 'createtime', 'bSortable' : false }, 
						{'sTitle' : common.view.operation, 'mData' : 'playlistid', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var dropdownBtn = '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-detail"><i class="fa fa-list-ul"></i> ' + common.view.detail + '</a>';
			dropdownBtn += '&nbsp;&nbsp;<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
			dropdownBtn += '&nbsp;&nbsp;<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
			$('td:eq(2)', nRow).html(dropdownBtn);
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
		currentItem = item;
		
		bootbox.confirm(common.tips.remove + currentItem.name, function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : myurls['common.delete'],
					cache: false,
					data : {
						'playlist.playlistid': currentItem['playlistid']
					},
					success : function(data, status) {
						if (data.errorcode == 0) {
							refreshMyTable();
						} else {
							bootbox.alert(common.tips.error + data.errormsg);
						}
					},
					error : function() {
						bootbox.alert(common.tips.error);
					}
				});				
			}
		 });
		
	});
}

function initMyEditModal() {
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	FormValidateOption.rules['playlist.name'] = {};
	FormValidateOption.rules['playlist.name']['required'] = true;
	FormValidateOption.rules['playlist.name']['minlength'] = 2;
	FormValidateOption.submitHandler = function(form) {
		$.ajax({
			type : 'POST',
			url : $('#MyEditForm').attr('action'),
			data : $('#MyEditForm').serialize(),
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
				bootbox.alert(common.tips.error);
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
		var action = myurls['common.add'];
		refreshForm('MyEditForm');
		$('#MyEditForm').attr('action', action);
		$('#MyEditModal').modal();
	});			

	
	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		var formdata = new Object();
		for (var name in item) {
			formdata['playlist.' + name] = item[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', myurls['common.update']);
		$('#MyEditModal').modal();
	});
}

//==============================播放列表明细对话框====================================			
function initPlaylistDtlModal() {
	var currentPlaylistid = 0;
	var currentPlaylist;
	var tempPlaylistdtls;
	
	$('body').on('click', '.pix-detail', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		currentPlaylist = $('#MyTable').dataTable().fnGetData(index);
		currentPlaylistid = currentPlaylist.playlistid;
		$('#PlaylistDtlTable').dataTable().fnClearTable();

		$.ajax({
			type : 'GET',
			url : myurls['playlist.dtllist'],
			data : {'playlistid' : currentPlaylistid},
			beforeSend: function ( xhr ) {
				Metronic.startPageLoading({animate: true});
			},
			success : function(data, status) {
				Metronic.stopPageLoading();
				if (data.errorcode == 0) {
					tempPlaylistdtls = data.aaData;
					for (var i=0; i<tempPlaylistdtls.length; i++) {
						var playlistdtl = tempPlaylistdtls[i];
						if (playlistdtl.video.type == 1) {
							mediatype = common.view.intvideo;
							medianame = playlistdtl.video.name;
						} else if (playlistdtl.video.type == 2) {
							mediatype = common.view.extvideo;
							medianame = playlistdtl.video.name;
						} else {
							mediatype = common.view.unknown;
						}
						$('#PlaylistDtlTable').dataTable().fnAddData([playlistdtl.sequence, mediatype, medianame, playlistdtl.playlistdtlid]);
					}
					
					$('#PlaylistDtlModal').modal();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				Metronic.stopPageLoading();
				bootbox.alert(common.tips.error);
			}
		});
	});
	
	//本地视频table初始化
	$('#IntVideoTable thead').css('display', 'none');
	$('#IntVideoTable tbody').css('display', 'none');	
	var intvideohtml = '';
	$('#IntVideoTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 12, 24, 48, 96 ],
						  [ 12, 24, 48, 96 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['video.list'],
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : common.view.filename, 'mData' : 'filename', 'bSortable' : false }, 
						{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false }, 
						{'sTitle' : common.view.operation, 'mData' : 'videoid', 'bSortable' : false }],
		'iDisplayLength' : 12,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnPreDrawCallback': function (oSettings) {
			if ($('#IntVideoContainer').length < 1) {
				$('#IntVideoTable').append('<div id="IntVideoContainer"></div>');
			}
			$('#IntVideoContainer').html(''); 
			return true;
		},
		'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			if (iDisplayIndex % 6 == 0) {
				intvideohtml = '';
				intvideohtml += '<div class="row" >';
			}
			intvideohtml += '<div class="col-md-2 col-xs-2">';
			if (aData['thumbnail'] == null) {
				intvideohtml += '<img src="../local/img/video.jpg" alt="' + aData['name'] + '" width="100%" />';
			} else {
				intvideohtml += '<img src="/pixsigdata' + aData['thumbnail'] + '" alt="' + aData['name'] + '" width="100%" />';
			}
			intvideohtml += '<h6>' + aData['name'] + '<br>';
			var filesize = parseInt(aData['size'] / 1024);
			intvideohtml += '' + transferIntToComma(filesize) + 'KB</h6>';
			intvideohtml += '<p><button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-playlistdtl-intvideo-add">' + common.view.add + '</button></p>';
			intvideohtml += '</div>';
			if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#IntVideoTable').dataTable().fnGetData().length) {
				intvideohtml += '</div>';
				if ((iDisplayIndex+1) != $('#IntVideoTable').dataTable().fnGetData().length) {
					intvideohtml += '<hr/>';
				}
				$('#IntVideoContainer').append(intvideohtml);
			}
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'type','value':1 });
		}
	});
	jQuery('#IntVideoTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
	jQuery('#IntVideoTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
	
	//引入视频table初始化
	$('#ExtVideoTable thead').css('display', 'none');
	$('#ExtVideoTable tbody').css('display', 'none');	
	var extvideohtml = '';
	$('#ExtVideoTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 12, 24, 48, 96 ],
						  [ 12, 24, 48, 96 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['video.list'],
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : common.view.filename, 'mData' : 'filename', 'bSortable' : false }, 
						{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false }, 
						{'sTitle' : common.view.operation, 'mData' : 'videoid', 'bSortable' : false }],
		'iDisplayLength' : 12,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnPreDrawCallback': function (oSettings) {
			if ($('#ExtVideoContainer').length < 1) {
				$('#ExtVideoTable').append('<div id="ExtVideoContainer"></div>');
			}
			$('#ExtVideoContainer').html(''); 
			return true;
		},
		'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			if (iDisplayIndex % 6 == 0) {
				extvideohtml = '';
				extvideohtml += '<div class="row" >';
			}
			extvideohtml += '<div class="col-md-2 col-xs-2">';
			if (aData['thumbnail'] == null) {
				extvideohtml += '<img src="../local/img/video.jpg" alt="' + aData['name'] + '" width="100%" />';
			} else {
				extvideohtml += '<img src="/pixsigdata' + aData['thumbnail'] + '" alt="' + aData['name'] + '" width="100%" />';
			}
			extvideohtml += '<h6>' + aData['name'] + '<br>';
			var filesize = parseInt(aData['size'] / 1024);
			extvideohtml += '' + transferIntToComma(filesize) + 'KB</h6>';
			extvideohtml += '<p><button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-playlistdtl-extvideo-add">' + common.view.add + '</button></p>';
			extvideohtml += '</div>';
			if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#ExtVideoTable').dataTable().fnGetData().length) {
				extvideohtml += '</div>';
				if ((iDisplayIndex+1) != $('#ExtVideoTable').dataTable().fnGetData().length) {
					extvideohtml += '<hr/>';
				}
				$('#ExtVideoContainer').append(extvideohtml);
			}
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'type','value':2 });
		}
	});
	jQuery('#ExtVideoTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
	jQuery('#ExtVideoTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
	
	//播放明细Table初始化
	$('#PlaylistDtlTable').dataTable({
		'sDom' : 't',
		'iDisplayLength' : -1,
		'aoColumns' : [ {'sTitle' : common.view.sequence, 'bSortable' : false, 'sWidth' : '50px' }, 
						{'sTitle' : common.view.type, 'bSortable' : false, 'sWidth' : '100px' }, 
						{'sTitle' : common.view.detail, 'bSortable' : false, 'sClass': 'autowrap' }, 
						{'sTitle' : common.view.operation, 'bSortable' : false }],
		'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
		'oLanguage' : { 'sZeroRecords' : common.view.empty,
						'sEmptyTable' : common.view.empty }, 
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn green btn-xs pix-playlistdtl-delete">' + common.view.remove + '</button>');
			return nRow;
		}
	});
	
	
	//增加本地视频到播放明细Table
	$('body').on('click', '.pix-playlistdtl-intvideo-add', function(event) {
		var data = $('#IntVideoTable').dataTable().fnGetData($(event.target).attr("data-id"));		
		var playlistdtl = {};
		playlistdtl.playlistdtlid = 0;
		playlistdtl.playlistid = currentPlaylist.playlistid;
		playlistdtl.videoid = data.videoid;
		playlistdtl.sequence = tempPlaylistdtls.length + 1;
		tempPlaylistdtls[tempPlaylistdtls.length] = playlistdtl;
		$('#PlaylistDtlTable').dataTable().fnAddData([playlistdtl.sequence, common.view.intvideo, data.name, playlistdtl.playlistdtlid]);
	});

	//增加引入视频到播放明细Table
	$('body').on('click', '.pix-playlistdtl-extvideo-add', function(event) {
		var data = $('#ExtVideoTable').dataTable().fnGetData($(event.target).attr("data-id"));		
		var playlistdtl = {};
		playlistdtl.playlistdtlid = 0;
		playlistdtl.playlistid = currentPlaylist.playlistid;
		playlistdtl.videoid = data.videoid;
		playlistdtl.sequence = tempPlaylistdtls.length + 1;
		tempPlaylistdtls[tempPlaylistdtls.length] = playlistdtl;
		$('#PlaylistDtlTable').dataTable().fnAddData([playlistdtl.sequence, common.view.extvideo, data.name, playlistdtl.playlistdtlid]);
	});

	
	//删除播放明细列表某行
	$('body').on('click', '.pix-playlistdtl-delete', function(event) {
		var rowIndex = $(event.target).attr("data-id");
		for (var i=rowIndex; i<$('#PlaylistDtlTable').dataTable().fnSettings().fnRecordsDisplay(); i++) {
			var data = $('#PlaylistDtlTable').dataTable().fnGetData(i);
			$('#PlaylistDtlTable').dataTable().fnUpdate(i, parseInt(i), 1);
		}
		$('#PlaylistDtlTable').dataTable().fnDeleteRow(rowIndex);
		
		for (var i=rowIndex; i<tempPlaylistdtls.length; i++) {
			tempPlaylistdtls[i].sequence = i;
		}
		tempPlaylistdtls.splice(rowIndex, 1);
	});

	$('[type=submit]', $('#PlaylistDtlModal')).on('click', function(event) {
		$.ajax({
			type : 'POST',
			url : myurls['playlist.dtlsync'],
			data : '{"playlist":' + $.toJSON(currentPlaylist) + ', "playlistdtls":' + $.toJSON(tempPlaylistdtls) + '}',
			dataType : 'json',
			contentType : 'application/json;charset=utf-8',
			beforeSend: function ( xhr ) {
				Metronic.startPageLoading({animate: true});
			},
			success : function(data, status) {
				Metronic.stopPageLoading();
				$('#PlaylistDtlModal').modal('hide');
				if (data.errorcode == 0) {
					bootbox.alert(common.tips.success);
					$('#MyTable').dataTable()._fnAjaxUpdate();
				} else {
					bootbox.alert(common.tips.error + data.errormsg);
				}
			},
			error : function() {
				Metronic.stopPageLoading();
				bootbox.alert(common.tips.error);
			}
		});
	});
	
}
