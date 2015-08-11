var myTable = $('#MyTable');

function refreshMyTable() {
	myTable.dataTable()._fnAjaxUpdate();
}

var MyTable = function() {
	return {
		init : function() {
			if (!jQuery().dataTable) {
				return;
			}

			myTable.dataTable({
				"sDom" : "<'row'<'col-md-6 col-sm-12'l><'col-md-12 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", //default layout without horizontal scroll(remove this setting to enable horizontal scroll for the table)
				"aLengthMenu" : [ [ 10, 25, 50, 100 ],
								[ 10, 25, 50, 100 ] // change per page values here
								],
				"bProcessing" : true,
				"bServerSide" : true,
				"sAjaxSource" : myurls['common.list'],
				"aoColumns" : mytable_columns,
				"iDisplayLength" : 10,
				"sPaginationType" : "bootstrap",
				"oLanguage" : {
					"sZeroRecords" : '没有匹配的数据',
					"sProcessing" : '<i class="fa fa-coffee"></i>　获取数据中...',
					"sEmptyTable" : '没有匹配的数据',
					"sLengthMenu" : "每页显示 _MENU_ 记录",
					"sInfo" : "从 _START_ 到 _END_ (共 _TOTAL_ 条数据)",
					"sInfoEmpty" : "从 0 到 0 (共 0 条数据)",
					"sSearch" : "搜索:",
					"oPaginate" : {
						"sPrevious" : "前一页",
						"sNext" : "后一页"
					}
				},
				"fnRowCallback" : mytable_fnRowCallback
			});

			jQuery('#MyTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); // modify table search input
			jQuery('#MyTable_wrapper .dataTables_length select').addClass("form-control input-small"); // modify table per page dropdown


		}
	};
}();

