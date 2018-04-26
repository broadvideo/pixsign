var DeviceTable = function () {
	var init = function () {
		$('#DeviceTable').dataTable({
			'sDom' : 'rt',
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'device!list.action',
			'aoColumns' : [ {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false },
							{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.online, 'mData' : 'onlineflag', 'bSortable' : false }],
			'iDisplayLength' : 7,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				if (aData.status == 0) {
					$('td:eq(2)', nRow).html('<span class="label label-sm label-default">' + common.view.unregister + '</span>');
				} else if (aData.onlineflag == 1) {
					$('td:eq(2)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
				} else if (aData.onlineflag == 0) {
					$('td:eq(2)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
				} else if (aData.onlineflag == 9) {
					$('td:eq(2)', nRow).html('<span class="label label-sm label-warning">' + common.view.offline + '</span>');
				}
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'order','value':'refreshtime' });
			}
		});
	};

	return {
		init: init,
	}
}();

var DeviceChart = function () {
	var init = function () {
		$.ajax({
			url: 'stat!devices.action',
			type : 'POST',
			data : {},
			dataType: 'json',
			success : function(data, status) {
				if (data.errorcode == 0 && data.aaData.length > 0) {
					var statdata = [];
					for (var i=0; i<data.aaData.length; i++) {
						statdata[i] = {};
						if (data.aaData[i].label == '1') {
							statdata[i].label = common.view.online + '(' + data.aaData[i].value + ')';
						} else if (data.aaData[i].label == '0') {
							statdata[i].label = common.view.offline + '(' + data.aaData[i].value + ')';
						//} else if (data.aaData[i].label == '0-0') {
						//	statdata[i].label = common.view.unregister + '(' + data.aaData[i].value + ')';
						} else {
							statdata[i].label = common.view.unknown + '(' + data.aaData[i].value + ')';
						}
						statdata[i].data = data.aaData[i].value;
					}

				    $.plot($('#DeviceChart'), statdata, {
				        series: {
				            pie: {
				                show: true,
				                radius: 1,
				                label: {
				                    show: true,
				                    radius: 3 / 4,
				                    formatter: function(label, series) {
			                            return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">' + label + '<br/>' + Math.round(series.percent) + '%</div>';
				                    },
				                    background: {
				                        opacity: 0.5
				                    }
				                }
				            }
				        },
				        legend: {
				            show: true
				        }
				    });
				}
			}
		});
	};

	return {
		init: init,
	}
}();

var MediaChart = function () {
	var init = function () {
		if (!jQuery.plot) {
			return;
		}

		var ticks = [];
		ticks.push([2, new Date(new Date()-28*86400000).format('MM-dd')]);
		ticks.push([6, new Date(new Date()-24*86400000).format('MM-dd')]);
		ticks.push([10, new Date(new Date()-20*86400000).format('MM-dd')]);
		ticks.push([14, new Date(new Date()-16*86400000).format('MM-dd')]);
		ticks.push([18, new Date(new Date()-12*86400000).format('MM-dd')]);
		ticks.push([22, new Date(new Date()-8*86400000).format('MM-dd')]);
		ticks.push([26, new Date(new Date()-4*86400000).format('MM-dd')]);
		ticks.push([30, new Date().format('MM-dd')]);
		
		$('#MediaStatLoding').hide();
		$('#MediaStat').show();

		var statdata = [];
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
				points: {
					show: true
				},
				shadowSize: 2
			},
			grid: {
				hoverable: true,
				clickable: true,
				tickColor: '#eee',
				borderWidth: 0
			},
			colors: ['#d12610', '#37b7f3', '#52e136'],
			xaxis: {
				ticks: ticks,
				tickDecimals: 0
			},
			yaxis: {
				ticks: 11,
				tickDecimals: 0
			}
		};
				
		$.plot('#MediaStatPlot', statdata, options);
		
		$.ajax({
			url: 'stat.action',
			type : 'POST',
			data : {'stattype': '1'},
			dataType: 'json',
			success : function(data, status) {
				if (data.errorcode == 0) {
					onDataReceived(data.aaData, '1');
				}
			}
		});
		$.ajax({
			url: 'stat.action',
			type : 'POST',
			data : {'stattype': '2'},
			dataType: 'json',
			success : function(data, status) {
				if (data.errorcode == 0) {
					onDataReceived(data.aaData, '2');
				}
			}
		});

		var previousPoint = null;
		$('#MediaStatPlot').bind('plothover', function (event, pos, item) {
			//$('#x').text(pos.x.toFixed(2));
			//$('#y').text(pos.y.toFixed(2));
			if (item) {
				if (previousPoint != item.dataIndex) {
					previousPoint = item.dataIndex;

					$('#tooltip').remove();
					showTooltip(item);
				}
			} else {
				$('#tooltip').remove();
				previousPoint = null;
			}
		});

		function onDataReceived(data, type) {
			var series = {};
			if (type == '1') {
				series.label = common.view.video;
			} else if (type == '2') {
				series.label = common.view.image;
			} 
			series.data = [];
			
			var today = new Date();
			for (var i=0; i<30; i++) {
				series.data[i] = [i+1, 0];
			}
			for (var i=0; i<data.length; i++) {
				series.data[29-data[i].sequence] = [30-data[i].sequence, data[i].value];
			}
			statdata.push(series);
			$.plot('#MediaStatPlot', statdata, options);
		}
		
		function showTooltip(item) {
			//
			var x = item.datapoint[0],
			y = item.datapoint[1];

			var title = new Date(new Date()-(30-x)*86400000).format('yyyy-MM-dd');
			$('<div id="tooltip" class="chart-tooltip"><div class="date">' + title + '<\/div><div class="label label-success">' + item.series.label + ': ' + y + '<\/div><\/div>').css({
				position: 'absolute',
				display: 'none',
				top: item.pageY - 100,
				width: 80,
				left: item.pageX - 40,
				border: '0px solid #ccc',
				padding: '2px 6px',
				'background-color': '#fff',
			}).appendTo('body').fadeIn(200);
		}

	};

	return {
		init: init,
	}
}();

var FileChart = function () {
	var init = function () {
		if (!jQuery.plot) {
			return;
		}

		var ticks = [];
		ticks.push([2, new Date(new Date()-28*86400000).format('MM-dd')]);
		ticks.push([6, new Date(new Date()-24*86400000).format('MM-dd')]);
		ticks.push([10, new Date(new Date()-20*86400000).format('MM-dd')]);
		ticks.push([14, new Date(new Date()-16*86400000).format('MM-dd')]);
		ticks.push([18, new Date(new Date()-12*86400000).format('MM-dd')]);
		ticks.push([22, new Date(new Date()-8*86400000).format('MM-dd')]);
		ticks.push([26, new Date(new Date()-4*86400000).format('MM-dd')]);
		ticks.push([30, new Date().format('MM-dd')]);
		
		$('#FileStatLoding').hide();
		$('#FileStat').show();

		var statdata = [];
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
				points: {
					show: true
				},
				shadowSize: 2
			},
			grid: {
				hoverable: true,
				clickable: true,
				tickColor: '#eee',
				borderWidth: 0
			},
			colors: ['#d12610', '#37b7f3', '#52e136'],
			xaxis: {
				ticks: ticks,
				tickDecimals: 0
			},
			yaxis: {
				ticks: 11,
				tickDecimals: 0,
				tickFormatter: function formatter(val, axis) {
					if (val > 10000000000)
						return (val / 1000000000).toFixed(axis.tickDecimals) + ' GB';
					else if (val > 1000000)
						return (val / 1000000).toFixed(axis.tickDecimals) + ' MB';
					else if (val > 1000)
						return (val / 1000).toFixed(axis.tickDecimals) + ' KB';
					else
						return val.toFixed(axis.tickDecimals) + ' B';
				}
			}
		};
		
		$.plot('#FileStatPlot', statdata, options);
		
		$.ajax({
			url: 'stat.action',
			type : 'POST',
			data : {'stattype': '0'},
			dataType: 'json',
			success : function(data, status) {
				if (data.errorcode == 0) {
					onDataReceived(data.aaData);
				}
			}
		});

		var previousPoint = null;
		$('#FileStatPlot').bind('plothover', function (event, pos, item) {
			//$('#x').text(pos.x.toFixed(2));
			//$('#y').text(pos.y.toFixed(2));
			if (item) {
				if (previousPoint != item.dataIndex) {
					previousPoint = item.dataIndex;

					$('#tooltip').remove();
					showTooltip(item);
				}
			} else {
				$('#tooltip').remove();
				previousPoint = null;
			}
		});

		function onDataReceived(data) {
			var series = {};
			series.label = common.view.downloaddata;
			series.data = [];
			
			var today = new Date();
			for (var i=0; i<30; i++) {
				series.data[i] = [i+1, 0];
			}
			for (var i=0; i<data.length; i++) {
				series.data[29-data[i].sequence] = [30-data[i].sequence, data[i].value];
			}
			statdata.push(series);
			$.plot('#FileStatPlot', statdata, options);
		}
		
		function showTooltip(item) {
			var x = item.datapoint[0];
			var y = item.datapoint[1];
			if (y > 10000000000)
				y = (y / 1000000000).toFixed(2) + ' GB';
			else if (y > 1000000)
				y = (y / 1000000).toFixed(2) + ' MB';
			else if (y > 1000)
				y = (y / 1000).toFixed(2) + ' KB';
			else
				y = y.toFixed(0) + ' B';

			var title = new Date(new Date()-(30-x)*86400000).format('yyyy-MM-dd');
			$('<div id="tooltip" class="chart-tooltip"><div class="date">' + title + '<\/div><div class="label label-success">' + y + '<\/div><\/div>').css({
				position: 'absolute',
				display: 'none',
				top: item.pageY - 100,
				width: 80,
				left: item.pageX - 40,
				border: '0px solid #ccc',
				padding: '2px 6px',
				'background-color': '#fff',
			}).appendTo('body').fadeIn(200);
		}
	};

	return {
		init: init,
	}
}();

