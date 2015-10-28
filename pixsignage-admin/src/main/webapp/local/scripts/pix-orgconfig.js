var myurls = {
	'common.list' : 'org!list.action',
	'common.update' : 'org!update.action',
	'video.list' : 'video!list.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

function initMyTable() {
	var oTable = $('#MyTable').dataTable({
		'sDom' : 'rt',
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['common.list'],
		'aoColumns' : [ {"sTitle" : "名称", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "创建时间", "mData" : "createtime", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "orgid", "bSortable" : false }],
		'iDisplayLength' : 1,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var data = $('#MyTable').dataTable().fnGetData(iDisplayIndex);
			var dropdownBtn = '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-sm blue pix-update"><i class="fa fa-edit"></i>&nbsp;&nbsp;编辑</a>';
			$('td:eq(2)', nRow).html(dropdownBtn);
			return nRow;
		}
	});

    jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small'); // modify table search input
    jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small'); // modify table per page dropdown
    jQuery('#MyTable_wrapper .dataTables_length select').select2(); // initialize select2 dropdown
	
}

function initMyEditModal() {
	var currentConfig;
    OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	FormValidateOption.submitHandler = function(form) {
		$.ajax({
			type : 'POST',
			url : $('#MyEditForm').attr('action'),
			data : $('#MyEditForm').serialize(),
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#MyEditModal').modal('hide');
					bootbox.alert('操作成功');
					refreshMyTable();
				} else {
					bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert('出错了!');
			}
		});
	};
	$('#MyEditForm').validate(FormValidateOption);

	$('[type=submit]', $('#MyEditModal')).on('click', function(event) {
		if ($('#MyEditForm').valid()) {
			$('#MyEditForm').submit();
		}
	});
	
	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		currentorg = $('#MyTable').dataTable().fnGetData(index);
		var action = myurls['common.update'];
		var formdata = new Object();
		for (var name in currentorg) {
			formdata['org.' + name] = currentorg[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		$('#MyEditForm').attr('action', action);
		
	    $("#BackupMediaSelect").select2({
	        placeholder: "请选择垫片视频",
	        minimumInputLength: 0,
	        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
	            url: myurls['video.list'],
	            type: 'GET',
	            dataType: 'json',
	            data: function (term, page) {
	                return {
	                	sSearch: term, // search term
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
	            				id:item.videoid 
	            			};
	            		}),
	            		more: more
	            	};
	            }
	        },
	        formatResult: function (media) {
	        	return media.text;
	        },
	        formatSelection: function (media) {
	        	return media.text;
	        },
	        initSelection: function(element, callback) {
	        	callback({id: currentorg.backupvideoid, text: currentorg.backupvideo.name });
	        },
	        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
	        escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
	    });

	    $('#MyEditModal').modal();
	});

}


