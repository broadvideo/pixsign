var FlowlogModule = function () {
	var _device = {};
	this.DeviceTree = new BranchTree($('#DevicePortlet'));

	var init = function () {
		initDeviceTable();
		initChartModal();
		initDownloadModal();
	};

	var refresh = function () {
		$('#DeviceTable').dataTable()._fnAjaxUpdate();
	};
	
	var initDeviceTable = function () {
		$('#DeviceTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'flowlog!devicestatlist.action',
			'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' },
							{'sTitle' : common.view.onlineflag, 'mData' : 'onlineflag', 'bSortable' : false, 'sWidth' : '5%' },
							{'sTitle' : common.view.current_hour, 'mData' : 'amount1', 'bSortable' : false, 'sWidth' : '15%' },
							{'sTitle' : common.view.previous_hour, 'mData' : 'amount2', 'bSortable' : false, 'sWidth' : '15%' },
							{'sTitle' : common.view.today, 'mData' : 'amount3', 'bSortable' : false, 'sWidth' : '15%' },
							{'sTitle' : common.view.yesterday, 'mData' : 'amount4', 'bSortable' : false, 'sWidth' : '15%' },
							{'sTitle' : common.view.detail, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '5%' }],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(0)', nRow).html(aData.terminalid + '(' + aData.name + ')');
				if (aData.onlineflag == 1) {
					$('td:eq(1)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
				} else if (aData.onlineflag == 0) {
					$('td:eq(1)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
				} else if (aData.onlineflag == 9) {
					$('td:eq(1)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
				}
				$('td:eq(6)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-chart"><i class="fa fa-list-ul"></i> ' + common.view.more + '</a>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':DeviceTree.branchid });
			}
		});
		$('#DeviceTable_wrapper').addClass('form-inline');
		$('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DeviceTable_wrapper .dataTables_length select').select2();
		$('#DeviceTable').css('width', '100%');
	};
	
	var initChartModal = function () {
		$('body').on('click', '.pix-chart', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			$('input[name="flowlog.statdate"]').val(new Date().format('yyyy') + '-' + new Date().format('MM') + '-' + new Date().format('dd'));
			_device = $('#DeviceTable').dataTable().fnGetData(index);
			$('#ChartModal').modal();
		});

		$('#ChartModal').on('shown.bs.modal', function (e) {
			refreshStatByDayChart();
			refreshStatByMonthChart();
		})

		$('input[name="flowlog.statdate"]').on('change', function(e) {
			refreshStatByDayChart();
		});

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
		$('#MonthSelect1').select2({
			placeholder: '',
			minimumInputLength: 0,
			data: MonthData,
		});
		$('#MonthSelect1').select2('val', MonthData[0].id);
		$('#MonthSelect2').select2({
			placeholder: '',
			minimumInputLength: 0,
			data: MonthData,
		});
		$('#MonthSelect2').select2('val', MonthData[0].id);
		$('#MonthSelect2').on('change', function(e) {
			refreshStatByMonthChart();
		});

		function refreshStatByDayChart() {
			$('#StatLoding1').show();
			$('#StatByDayPlot').hide();
			$('#StatByDayPlot2').hide();

			$.ajax({
				url: 'flowlog!statperiodbyday.action',
				type : 'POST',
				data : {
					'deviceid': _device.deviceid,
					'day': $('input[name="flowlog.statdate"]').val(),
				},
				dataType: "json",
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#StatLoding1').hide();
						$('#StatByDayPlot').show();
						$('#StatByDayPlot2').show();
						initStatByDayPlot(data.aaData);
						initStatByDayBar(data.aaData);
					}
				}
			});
		}
		
		function initStatByDayPlot(data) {
			var ticks = [];
			ticks.push([1, '00:00']);
			ticks.push([3, '02:00']);
			ticks.push([5, '04:00']);
			ticks.push([7, '06:00']);
			ticks.push([9, '08:00']);
			ticks.push([11, '10:00']);
			ticks.push([13, '12:00']);
			ticks.push([15, '14:00']);
			ticks.push([17, '16:00']);
			ticks.push([19, '18:00']);
			ticks.push([21, '20:00']);
			ticks.push([23, '22:00']);
			
			var options = {
				series: {
					lines: {
						show: true,
						lineWidth: 2,
						fill: true,
						fillColor: {
							colors: [{opacity: 0.05}, {opacity: 0.01}]
						}
					},
					points: {show: true },
					shadowSize: 2
				},
				grid: {
					hoverable: true,
					clickable: true,
					tickColor: "#eee",
					borderWidth: 0
				},
				colors: ["#d12610"],
				xaxis: {
					ticks: ticks,
					tickDecimals: 0
				},
				yaxis: {
					ticks: 11,
					tickDecimals: 0
				}
			};

			var statdata = [];
			var series = {};
			series.label = $('input[name="flowlog.statdate"]').val();
			series.data = [];
			
			for (var i=0; i<24; i++) {
				series.data[i] = [i+1, 0];
			}
			for (var i=0; i<data.length; i++) {
				var sequence = parseInt(data[i].sequence);
				var amount = data[i].amount;
				series.data[sequence-1] = [sequence, amount];
			}
			statdata.push(series);
			$.plot("#StatByDayPlot", statdata, options);

			var prevStatByDayPoint = null;
			$("#StatByDayPlot").bind("plothover", function (event, pos, item) {
				//$("#x").text(pos.x.toFixed(2));
				//$("#y").text(pos.y.toFixed(2));
				if (item) {
					console.log(prevStatByDayPoint, item.dataIndex);
					if (prevStatByDayPoint != item.dataIndex) {
						prevStatByDayPoint = item.dataIndex;
						$("#StatByDayTooltip").remove();
						var x = item.datapoint[0], y = item.datapoint[1];
						var title = $('input[name="flowlog.statdate"]').val() + ' ' + (x-1) + ':00';
						$('<div id="StatByDayTooltip" class="chart-tooltip"><div class="date">' + title + '<\/div><div class="label label-success">' + y + '<\/div><\/div>').css({
							position: 'absolute',
							display: 'none',
							top: item.pageY - 70,
							width: 130,
							left: item.pageX - 40,
							border: '0px solid #ccc',
							padding: '2px 6px',
							'background-color': '#fff',
							'z-index': 999999,
						}).appendTo("body").fadeIn(200);
					}
				} else {
					$("#StatByDayTooltip").remove();
					prevStatByDayPoint = null;
				}
			});
		}
		
		function initStatByDayBar(data) {
			var ticks = [];
			ticks.push([0.5, '00:00']);
			ticks.push([2.5, '02:00']);
			ticks.push([4.5, '04:00']);
			ticks.push([6.5, '06:00']);
			ticks.push([8.5, '08:00']);
			ticks.push([10.5, '10:00']);
			ticks.push([12.5, '12:00']);
			ticks.push([14.5, '14:00']);
			ticks.push([16.5, '16:00']);
			ticks.push([18.5, '18:00']);
			ticks.push([20.5, '20:00']);
			ticks.push([22.5, '22:00']);

			var statdata = [];
			for (var i=0; i<24; i++) {
				statdata.push([i, 0]);
			}
			for (var i=0; i<data.length; i++) {
				var sequence = parseInt(data[i].sequence);
				var amount = data[i].amount;
				console.log(sequence,amount);
				statdata[sequence][1] = amount;
			}
			
			var options = {
				series: {
					bars: {show: true}
				},
				bars: {
					barWidth: 0.8,
					lineWidth: 0,
					shadowSize: 0,
					align: 'left'
				},
				grid: {
					tickColor: "#eee",
					borderColor: "#eee",
					borderWidth: 1
				},
				xaxis: {
					ticks: ticks,
					tickDecimals: 0
				},
				colors: ['#c1004F']
			};
			
			$.plot($("#StatByDayBar"), [{
				data: statdata,
				lines: {
					lineWidth: 1,
				},
				shadowSize: 0
			}], options);
		}
		
		function refreshStatByMonthChart() {
			$('#StatLoding2').show();
			$('#StatByMonthPlot').hide();
			$('#StatByMonthPlot2').hide();

			$.ajax({
				url: 'flowlog!statperiodbymonth.action',
				type : 'POST',
				data : {
					'deviceid': _device.deviceid,
					'month': $('#MonthSelect2').select2('data').text,
				},
				dataType: "json",
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#StatLoding2').hide();
						$('#StatByMonthPlot').show();
						initStatByMonthPlot(data.aaData);
						initStatByMonthBar(data.aaData);
					}
				}
			});
		}
		
		function initStatByMonthPlot(data) {
			var month = parseInt($('#MonthSelect2').select2('data').month, 10);
			var d = new Date($('#MonthSelect2').select2('data').year, month, 0);
			var daycount = d.getDate();
			
			var ticks = [];
			ticks.push([2, $('#MonthSelect2').select2('data').month + '-02']);
			ticks.push([6, $('#MonthSelect2').select2('data').month + '-06']);
			ticks.push([10, $('#MonthSelect2').select2('data').month + '-10']);
			ticks.push([14, $('#MonthSelect2').select2('data').month + '-14']);
			ticks.push([18, $('#MonthSelect2').select2('data').month + '-18']);
			ticks.push([22, $('#MonthSelect2').select2('data').month + '-22']);
			ticks.push([26, $('#MonthSelect2').select2('data').month + '-26']);
			ticks.push([daycount, $('#MonthSelect2').select2('data').month + '-' + daycount]);
			
			var options = {
				series: {
					lines: {
						show: true,
						lineWidth: 2,
						fill: true,
						fillColor: {
							colors: [{opacity: 0.05}, {opacity: 0.01}]
						}
					},
					points: {show: true },
					shadowSize: 2
				},
				grid: {
					hoverable: true,
					clickable: true,
					tickColor: "#eee",
					borderWidth: 0
				},
				colors: ["#37b7f3"],
				xaxis: {
					ticks: ticks,
					tickDecimals: 0
				},
				yaxis: {
					ticks: 11,
					tickDecimals: 0
				}
			};

			var statdata = [];
			var series = {};
			series.label = $('#MonthSelect2').select2('data').text;
			series.data = [];
			
			for (var i=0; i<daycount; i++) {
				series.data[i] = [i+1, 0];
			}
			for (var i=0; i<data.length; i++) {
				var sequence = parseInt(data[i].sequence);
				var amount = data[i].amount;
				series.data[sequence-1] = [sequence, amount];
			}
			statdata.push(series);
			$.plot("#StatByMonthPlot", statdata, options);

			var prevStatByMonthPoint = null;
			$("#StatByMonthPlot").bind("plothover", function (event, pos, item) {
				//$("#x").text(pos.x.toFixed(2));
				//$("#y").text(pos.y.toFixed(2));
				if (item) {
					console.log(prevStatByMonthPoint, item.dataIndex);
					if (prevStatByMonthPoint != item.dataIndex) {
						prevStatByMonthPoint = item.dataIndex;
						$("#StatByMonthTooltip").remove();
						var x = item.datapoint[0], y = item.datapoint[1];
						var title = $('#MonthSelect2').select2('data').text + '-' + x;
						$('<div id="StatByMonthTooltip" class="chart-tooltip"><div class="date">' + title + '<\/div><div class="label label-success">' + y + '<\/div><\/div>').css({
							position: 'absolute',
							display: 'none',
							top: item.pageY - 70,
							width: 80,
							left: item.pageX - 40,
							border: '0px solid #ccc',
							padding: '2px 6px',
							'background-color': '#fff',
							'z-index': 999999,
						}).appendTo("body").fadeIn(200);
					}
				} else {
					$("#StatByMonthTooltip").remove();
					prevStatByMonthPoint = null;
				}
			});
		}

		function initStatByMonthBar(data) {
			var month = parseInt($('#MonthSelect2').select2('data').month, 10);
			var d = new Date($('#MonthSelect2').select2('data').year, month, 0);
			var daycount = d.getDate();
			
			var ticks = [];
			ticks.push([1.6, $('#MonthSelect2').select2('data').month + '-02']);
			ticks.push([5.6, $('#MonthSelect2').select2('data').month + '-06']);
			ticks.push([9.6, $('#MonthSelect2').select2('data').month + '-10']);
			ticks.push([13.6, $('#MonthSelect2').select2('data').month + '-14']);
			ticks.push([17.6, $('#MonthSelect2').select2('data').month + '-18']);
			ticks.push([21.6, $('#MonthSelect2').select2('data').month + '-22']);
			ticks.push([25.6, $('#MonthSelect2').select2('data').month + '-26']);
			ticks.push([daycount-0.4, $('#MonthSelect2').select2('data').month + '-' + daycount]);

			var statdata = [];
			for (var i=0; i<daycount; i++) {
				statdata.push([i, 0]);
			}
			for (var i=0; i<data.length; i++) {
				var sequence = data[i].sequence;
				var amount = data[i].amount;
				statdata[sequence-1][1] = amount;
			}
			
			var options = {
				series: {
					bars: {show: true}
				},
				bars: {
					barWidth: 0.8,
					lineWidth: 0,
					shadowSize: 0,
					align: 'left'
				},
				grid: {
					tickColor: "#eee",
					borderColor: "#eee",
					borderWidth: 1
				},
				xaxis: {
					ticks: ticks,
					tickDecimals: 0
				},
				colors: ['#691BB8']
			};
			
			$.plot($("#StatByMonthBar"), [{
				data: statdata,
				lines: {
					lineWidth: 1,
				},
				shadowSize: 0
			}], options);
		}
	};
	
	var initDownloadModal = function () {
		var formHandler = new FormHandler($('#DownloadByDayForm'));
		formHandler.validateOption.rules = {};
		formHandler.validateOption.rules['day'] = {};
		formHandler.validateOption.rules['day']['required'] = true;
		formHandler.validateOption.submitHandler = null;
		$('#DownloadByDayForm').validate(formHandler.validateOption);

		$('body').on('click', '.pix-downloadbyday', function(event) {
			$('#DownloadByDayModal').modal();
		});
		$('[type=submit]', $('#DownloadByDayModal')).on('click', function(event) {
			if ($('#DownloadByDayForm').valid()) {
				$('#DownloadByDayForm').submit();
				$('#DownloadByDayModal').modal('hide');
			}
		});

		$('body').on('click', '.pix-downloadbymonth', function(event) {
			$('#DownloadByMonthModal').modal();
		});
		$('[type=submit]', $('#DownloadByMonthModal')).on('click', function(event) {
			if ($('#DownloadByMonthForm').valid()) {
				$('#DownloadByMonthForm').submit();
				$('#DownloadByMonthModal').modal('hide');
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
