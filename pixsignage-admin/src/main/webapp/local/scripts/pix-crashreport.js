var myurls = {
	'crashreport.list' : 'crashreport!list.action',
	'crashreport.get' : 'crashreport!get.action',
};

function refreshMyTable() {
	$('#MyTable').dataTable()._fnAjaxUpdate();
}			

function initMyTable() {
	$('#MyTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['crashreport.list'],
		'aoColumns' : [ {'sTitle' : '硬件码', 'mData' : 'hardkey', 'bSortable' : false }, 
						{'sTitle' : '终端号', 'mData' : 'terminalid', 'bSortable' : false }, 
						{'sTitle' : '设备IP', 'mData' : 'clientip', 'bSortable' : false }, 
						{'sTitle' : '设备名称', 'mData' : 'clientname', 'bSortable' : false }, 
						{'sTitle' : '系统版本', 'mData' : 'os', 'bSortable' : false }, 
						{'sTitle' : '应用名称', 'mData' : 'appname', 'bSortable' : false }, 
						{'sTitle' : '版本名', 'mData' : 'vname', 'bSortable' : false }, 
						{'sTitle' : '版本号', 'mData' : 'vcode', 'bSortable' : false }, 
						{'sTitle' : '创建时间', 'mData' : 'createtime', 'bSortable' : false }, 
						{'sTitle' : '更多', 'mData' : 'crashreportid', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var data = $('#MyTable').dataTable().fnGetData(iDisplayIndex);
			$('td:eq(9)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-detail"><i class="fa fa-credit-card"></i>&nbsp;&nbsp;更多</a>');
			return nRow;
		}
	});

	jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small'); 
	jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
	jQuery('#MyTable_wrapper .dataTables_length select').select2(); 
	
	$('body').on('click', '.pix-detail', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var item = $('#MyTable').dataTable().fnGetData(index);
		$.ajax({
			type : "POST",
			url : myurls['crashreport.get'],
			data : {"crashreport.crashreportid" : item.crashreportid},
			success : function(data, status) {
				if (data.errorcode == 0) {
					var formdata = new Object();
					for (var name in data.crashreport) {
						formdata['crashreport.' + name] = data.crashreport[name];
					}
					$('#CrashDtlForm').loadJSON(formdata);
					$('#CrashDtlModal').modal();
				} else {
					bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert('出错了!');
			}
		});
		
	});
	
}
