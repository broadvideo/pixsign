var myurls = {
	'pflowlog.devicestatlist' : 'pflowlog!devicestatlist.action',
	'pflowlog.statbyhour' : 'pflowlog!statbyhour.action',
	'pflowlog.statbyday' : 'pflowlog!statbyday.action',
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
		'sAjaxSource' : myurls['pflowlog.devicestatlist'],
		'aoColumns' : [ {'sTitle' : common.view.device, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '20%' },
		                {'sTitle' : common.view.onlineflag, 'mData' : 'onlineflag', 'bSortable' : false, 'sWidth' : '5%' },
						{'sTitle' : common.view.current_hour, 'mData' : 'amount1', 'bSortable' : false, 'sWidth' : '15%' },
						{'sTitle' : common.view.previous_hour, 'mData' : 'amount2', 'bSortable' : false, 'sWidth' : '15%' },
						{'sTitle' : common.view.today, 'mData' : 'amount3', 'bSortable' : false, 'sWidth' : '15%' },
						{'sTitle' : common.view.yesterday, 'mData' : 'amount4', 'bSortable' : false, 'sWidth' : '15%' },
						{'sTitle' : common.view.detail, 'mData' : 'deviceid', 'bSortable' : false, 'sWidth' : '5%' }],
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
			$('td:eq(6)', nRow).html('<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-chart"><i class="fa fa-list-ul"></i> ' + common.view.more + '</a>');
			return nRow;
		}
	});

	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	$('#MyTable').css('width', '100%');
	
}

function initDeviceChart() {
	if (!jQuery.plot) {
		return;
	}

	var CurrentDevice;
	var CurrentDeviceid = 0;
	var SelectedYear = new Date().format('yyyy');
	var SelectedMonth = new Date().format('MM');
	var SelectedDay = new Date().format('dd');
	
	$('body').on('click', '.pix-chart', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		CurrentDevice = $('#MyTable').dataTable().fnGetData(index);
		CurrentDeviceid = CurrentDevice.deviceid;		
		$('#ChartModal').modal();
	});

	$('#ChartModal').on('shown.bs.modal', function (e) {
		refreshStatByHourChart();
		refreshStatByDayChart();
	})

	function refreshStatByHourChart() {
		$('#StatLoding1').show();
		$('#StatByHourPlot').hide();
		$('#StatByHourPlot2').hide();

		$.ajax({
			url: myurls['pflowlog.statbyhour'],
			type : 'POST',
			data : {
				'deviceid': CurrentDeviceid,
				'day': '' + SelectedYear + SelectedMonth + SelectedDay,
			},
			dataType: "json",
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#StatLoding1').hide();
					$('#StatByHourPlot').show();
					$('#StatByHourPlot2').show();
					initStatByHourPlot(data.aaData);
					initStatByHourBar(data.aaData);
				}
			}
		});
	}
	
	function initStatByHourPlot(data) {
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
		series.label = SelectedYear + '-' + SelectedMonth + '-' + SelectedDay;
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
		$.plot("#StatByHourPlot", statdata, options);

		var prevStatByHourPoint = null;
		$("#StatByHourPlot").bind("plothover", function (event, pos, item) {
			//$("#x").text(pos.x.toFixed(2));
			//$("#y").text(pos.y.toFixed(2));
			if (item) {
				console.log(prevStatByHourPoint, item.dataIndex);
				if (prevStatByHourPoint != item.dataIndex) {
					prevStatByHourPoint = item.dataIndex;
					$("#StatByHourTooltip").remove();
					var x = item.datapoint[0], y = item.datapoint[1];
					var title = SelectedYear + '-' + SelectedMonth + '-' + SelectedDay + ' ' + (x-1) + ':00';
					$('<div id="StatByHourTooltip" class="chart-tooltip"><div class="date">' + title + '<\/div><div class="label label-success">' + y + '<\/div><\/div>').css({
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
				$("#StatByHourTooltip").remove();
				prevStatByHourPoint = null;
			}
		});
	}
	
	function initStatByHourBar(data) {
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
		
		$.plot($("#StatByHourBar"), [{
	        data: statdata,
	        lines: {
	            lineWidth: 1,
	        },
	        shadowSize: 0
	    }], options);
	}
	
	function refreshStatByDayChart() {
		$('#StatLoding2').show();
		$('#StatByDayPlot').hide();
		$('#StatByDayPlot2').hide();

		$.ajax({
			url: myurls['pflowlog.statbyday'],
			type : 'POST',
			data : {
				'deviceid': CurrentDeviceid,
				'month': '' + SelectedYear + SelectedMonth,
			},
			dataType: "json",
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#StatLoding2').hide();
					$('#StatByDayPlot').show();
					$('#StatByDayPlot2').show();
					initStatByDayPlot(data.aaData);
					initStatByDayBar(data.aaData);
				}
			}
		});
	}
	
	function initStatByDayPlot(data) {
		var month = parseInt(SelectedMonth, 10);
		var d = new Date(SelectedYear, month, 0);
		var daycount = d.getDate();
		
		var ticks = [];
		ticks.push([2, SelectedMonth + '-02']);
		ticks.push([6, SelectedMonth + '-06']);
		ticks.push([10, SelectedMonth + '-10']);
		ticks.push([14, SelectedMonth + '-14']);
		ticks.push([18, SelectedMonth + '-18']);
		ticks.push([22, SelectedMonth + '-22']);
		ticks.push([26, SelectedMonth + '-26']);
		ticks.push([daycount, SelectedMonth + '-' + daycount]);
		
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
		series.label = SelectedYear + '-' + SelectedMonth;
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
					var title = SelectedYear + '-' + SelectedMonth + '-' + x;
					$('<div id="StatByDayTooltip" class="chart-tooltip"><div class="date">' + title + '<\/div><div class="label label-success">' + y + '<\/div><\/div>').css({
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
				$("#StatByDayTooltip").remove();
				prevStatByDayPoint = null;
			}
		});
	}

	function initStatByDayBar(data) {
		var month = parseInt(SelectedMonth, 10);
		var d = new Date(SelectedYear, month, 0);
		var daycount = d.getDate();
		
		var ticks = [];
		ticks.push([1.6, SelectedMonth + '-02']);
		ticks.push([5.6, SelectedMonth + '-06']);
		ticks.push([9.6, SelectedMonth + '-10']);
		ticks.push([13.6, SelectedMonth + '-14']);
		ticks.push([17.6, SelectedMonth + '-18']);
		ticks.push([21.6, SelectedMonth + '-22']);
		ticks.push([25.6, SelectedMonth + '-26']);
		ticks.push([daycount-0.4, SelectedMonth + '-' + daycount]);

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
		
		$.plot($("#StatByDayBar"), [{
	        data: statdata,
	        lines: {
	            lineWidth: 1,
	        },
	        shadowSize: 0
	    }], options);
	}

}
