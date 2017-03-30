var myurls = {
	'device.list' : 'device!list.action',
	'hourplaylog.statbyhour' : 'hourplaylog!statbyhour.action',
	'hourplaylog.statbyday' : 'hourplaylog!statbyday.action',
	'hourplaylog.statbymonth' : 'hourplaylog!statbymonth.action',
	'hourplaylog.statbyperiod' : 'hourplaylog!statbyperiod.action',
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
		'sAjaxSource' : myurls['device.list'],
		'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'deviceid', 'bSortable' : false },
		                {'sTitle' : common.view.onlineflag, 'mData' : 'onlineflag', 'bSortable' : false },
						{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false },
						{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false },
						{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false },
						{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(0)', nRow).html(aData.terminalid + '(' + aData.name + ')');
			if (aData.onlineflag == 1) {
				$('td:eq(1)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
			} else if (aData.onlineflag == 0) {
				$('td:eq(1)', nRow).html('<span class="label label-sm label-info">' + common.view.idle + '</span>');
			} else if (aData.onlineflag == 9) {
				$('td:eq(1)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
			}
			$('td:eq(2)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-stathour"><i class="fa fa-list-ul"></i> ' + common.view.hourstat + '</a>');
			$('td:eq(3)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-statday"><i class="fa fa-list-ul"></i> ' + common.view.daystat + '</a>');
			$('td:eq(4)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-statmonth"><i class="fa fa-list-ul"></i> ' + common.view.monthstat + '</a>');
			$('td:eq(5)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-statperiod"><i class="fa fa-list-ul"></i> ' + common.view.periodstat + '</a>');
			return nRow;
		}
	});

	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	$('#MyTable').css('width', '100%');
	
}

function initDetailModal() {
	var CurrentDevice;
	var CurrentDeviceid = 0;
	var StatType = 0; //0-hour 1-day 2-month 3-period
	var StatUrl = myurls['hourplaylog.statbyhour'];
	var PlaylogTable;

	$('body').on('click', '.pix-stathour', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentDevice = $('#MyTable').dataTable().fnGetData(index);
		CurrentDeviceid = CurrentDevice.deviceid;
		StatType = 0;
		StatUrl = myurls['hourplaylog.statbyhour'];
		$('.stat-hour').css('display', '');
		$('.stat-day').css('display', 'none');
		$('.stat-month').css('display', 'none');
		$('.stat-period').css('display', 'none');
		$('.pix-download').attr('href', 'hourplaylog!downloadbyhour.action?deviceid=' + CurrentDeviceid + '&hour=' + $('input[name="playlog.stathour"]').val());
		PlaylogTable.fnSettings().sAjaxSource = StatUrl;
		PlaylogTable.fnDraw();
		$('#PlaylogModal').modal();
	});

	$('body').on('click', '.pix-statday', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentDevice = $('#MyTable').dataTable().fnGetData(index);
		CurrentDeviceid = CurrentDevice.deviceid;
		StatType = 1;
		StatUrl = myurls['hourplaylog.statbyday'];
		$('.stat-hour').css('display', 'none');
		$('.stat-day').css('display', '');
		$('.stat-month').css('display', 'none');
		$('.stat-period').css('display', 'none');
		$('.pix-download').attr('href', 'hourplaylog!downloadbyday.action?deviceid=' + CurrentDeviceid + '&day=' + $('input[name="playlog.statday"]').val());
		PlaylogTable.fnSettings().sAjaxSource = StatUrl;
		PlaylogTable.fnDraw();
		$('#PlaylogModal').modal();
	});

	$('body').on('click', '.pix-statmonth', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentDevice = $('#MyTable').dataTable().fnGetData(index);
		CurrentDeviceid = CurrentDevice.deviceid;
		StatType = 2;
		StatUrl = myurls['hourplaylog.statbymonth'];
		$('.stat-hour').css('display', 'none');
		$('.stat-day').css('display', 'none');
		$('.stat-month').css('display', '');
		$('.stat-period').css('display', 'none');
		$('.pix-download').attr('href', 'hourplaylog!downloadbymonth.action?deviceid=' + CurrentDeviceid + '&month=' + $('#MonthSelect').select2('data').text);
		PlaylogTable.fnSettings().sAjaxSource = StatUrl;
		PlaylogTable.fnDraw();
		$('#PlaylogModal').modal();
	});

	$('body').on('click', '.pix-statperiod', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentDevice = $('#MyTable').dataTable().fnGetData(index);
		CurrentDeviceid = CurrentDevice.deviceid;
		StatType = 3;
		StatUrl = myurls['hourplaylog.statbyperiod'];
		$('.stat-hour').css('display', 'none');
		$('.stat-day').css('display', 'none');
		$('.stat-month').css('display', 'none');
		$('.stat-period').css('display', '');
		$('.pix-download').attr('href', 'hourplaylog!downloadbyperiod.action?deviceid=' + CurrentDeviceid + '&from=' + $('input[name="playlog.statfrom"]').val() + '&to=' + $('input[name="playlog.statto"]').val());
		PlaylogTable.fnSettings().sAjaxSource = StatUrl;
		PlaylogTable.fnDraw();
		$('#PlaylogModal').modal();
	});

	$('input[name="playlog.stathour"]').val(new Date().format('yyyy') + '-' + new Date().format('MM') + '-' + new Date().format('dd') + ' ' + new Date().format('hh') + ':00');
	$('input[name="playlog.statday"]').val(new Date().format('yyyy') + '-' + new Date().format('MM') + '-' + new Date().format('dd'));
	$('input[name="playlog.statfrom"]').val(new Date().format('yyyy') + '-' + new Date().format('MM') + '-' + new Date().format('dd'));
	$('input[name="playlog.statto"]').val(new Date().format('yyyy') + '-' + new Date().format('MM') + '-' + new Date().format('dd'));

	var CurrentMonth = new Date().format('yyyy-MM');
	var MonthData = [];
	var yy = new Date().getFullYear();
	var mm = new Date().getMonth();
	for (var i=0; i<12; i++) {
		MonthData[i] = {};
		MonthData[i].id = new Date(yy, mm-i, 1).format('yyyy-MM');
		MonthData[i].text = new Date(yy, mm-i, 1).format('yyyy-MM');
		MonthData[i].value = new Date(yy, mm-i, 1).format('yyyyMM');
		MonthData[i].year = new Date(yy, mm-i, 1).format('yyyy');
		MonthData[i].month = new Date(yy, mm-i, 1).format('MM');
	}
	$('#MonthSelect').select2({
		placeholder: '',
		minimumInputLength: 0,
		data: MonthData,
	});
	$('#MonthSelect').select2('val', MonthData[0].id);

	$('input[name="playlog.stathour"]').on('change', function(e) {
		$('.pix-download').attr('href', 'hourplaylog!downloadbyhour.action?deviceid=' + CurrentDeviceid + '&hour=' + $('input[name="playlog.stathour"]').val());
		$('#PlaylogTable').dataTable().fnDraw(true);
	});
	$('input[name="playlog.statday"]').on('change', function(e) {
		$('.pix-download').attr('href', 'hourplaylog!downloadbyday.action?deviceid=' + CurrentDeviceid + '&day=' + $('input[name="playlog.statday"]').val());
		$('#PlaylogTable').dataTable().fnDraw(true);
	});
	$('#MonthSelect').on('change', function(e) {
		$('.pix-download').attr('href', 'hourplaylog!downloadbymonth.action?deviceid=' + CurrentDeviceid + '&month=' + $('#MonthSelect').select2('data').text);
		$('#PlaylogTable').dataTable().fnDraw(true);
	});
	$('input[name="playlog.statfrom"]').on('change', function(e) {
		$('.pix-download').attr('href', 'hourplaylog!downloadbyperiod.action?deviceid=' + CurrentDeviceid + '&from=' + $('input[name="playlog.statfrom"]').val() + '&to=' + $('input[name="playlog.statto"]').val());
		$('#PlaylogTable').dataTable().fnDraw(true);
	});
	$('input[name="playlog.statto"]').on('change', function(e) {
		$('.pix-download').attr('href', 'hourplaylog!downloadbyperiod.action?deviceid=' + CurrentDeviceid + '&from=' + $('input[name="playlog.statfrom"]').val() + '&to=' + $('input[name="playlog.statto"]').val());
		$('#PlaylogTable').dataTable().fnDraw(true);
	});

	PlaylogTable = $('#PlaylogTable').dataTable({
		'sDom' : 'rt', 
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : StatUrl,
		'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : common.view.stat_period, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : '', 'mData' : 'mediaid', 'bSortable' : false, 'sWidth' : '5%' },
						{'sTitle' : '', 'mData' : 'mediaid', 'bSortable' : false, 'sWidth' : '45%' },
						{'sTitle' : common.view.amount, 'mData' : 'amount', 'bSortable' : false, 'sWidth' : '10%' }],
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(0)', nRow).html(CurrentDevice.terminalid + '(' + CurrentDevice.name + ')');
			if (StatType == 0) {
				$('td:eq(1)', nRow).html($('input[name="playlog.stathour"]').val());
			} else if (StatType == 1) {
				$('td:eq(1)', nRow).html($('input[name="playlog.statday"]').val());
			} else if (StatType == 2) {
				$('td:eq(1)', nRow).html($('#MonthSelect').select2('data').text);
			} else {
				$('td:eq(1)', nRow).html($('input[name="playlog.statfrom"]').val() + ' ~ ' + $('input[name="playlog.statto"]').val());
			}

			var thumbwidth = 100;
			var thumbhtml = '';
			var playhtml = '';
			if (aData.mediatype == 1) {
				thumbhtml += '<div class="thumbs" style="width:40px; height:40px;"><img src="/pixsigdata' + aData.video[0].thumbnail + '" class="imgthumb" width="' + thumbwidth + '%"></div>';
				playhtml = common.view.video + ': ' + aData.video[0].name;
			} else if (aData.mediatype == 2) {
				thumbwidth = aData.image[0].width > aData.image[0].height? 100 : 100*aData.image[0].width/aData.image[0].height;
				thumbhtml += '<div class="thumbs" style="width:40px; height:40px;"><img src="/pixsigdata' + aData.image[0].thumbnail + '" class="imgthumb" width="' + thumbwidth + '%"></div>';
				playhtml += common.view.image + ': ' + aData.image[0].name;
			}
			$('td:eq(2)', nRow).html(thumbhtml);
			$('td:eq(3)', nRow).html(playhtml);
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			aoData.push({'name':'deviceid','value':CurrentDeviceid });
			if (StatType == 0) {
				aoData.push({'name':'hour','value':$('input[name="playlog.stathour"]').val() });
			} else if (StatType == 1) {
				aoData.push({'name':'day','value':$('input[name="playlog.statday"]').val() });
			} else if (StatType == 2) {
				aoData.push({'name':'month','value':$('#MonthSelect').select2('data').text });
			} else {
				aoData.push({'name':'from','value':$('input[name="playlog.statfrom"]').val() });
				aoData.push({'name':'to','value':$('input[name="playlog.statto"]').val() });
			}
		} 
	});
	jQuery('#PlaylogTable_wrapper .dataTables_filter input').addClass('form-control input-medium'); 
	jQuery('#PlaylogTable_wrapper .dataTables_length select').addClass('form-control input-small'); 
	$('#PlaylogTable').css('width', '100%').css('table-layout', 'fixed');
}

$(".form_datetime_hour").datetimepicker({
	autoclose: true,
	isRTL: Metronic.isRTL(),
	format: "yyyy-mm-dd hh:ii",
	pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left"),
	language: "zh-CN",
	minView: 'day',
	todayBtn: true
});

$(".form_datetime_day").datetimepicker({
	autoclose: true,
	isRTL: Metronic.isRTL(),
	format: "yyyy-mm-dd",
	pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left"),
	language: "zh-CN",
	minView: 'month',
	todayBtn: true
});
