var myurls = {
	'org.get' : 'org!get.action',
	'device.list' : 'device!list.action',
	'video.list' : 'video!list.action',
	'stat' : 'stat.action',
};

function initLicense() {
	$.ajax({
		url: myurls['org.get'],
		type : 'POST',
		dataType: "json",
		success : function(data, status) {
			if (data.errorcode == 0) {
				var devicePercent = 100;
				if (data.org.maxdevices > 0) {
					devicePercent = Math.floor(100*data.org.currentdevices/data.org.maxdevices);
				}
				if (devicePercent > 100) devicePercent = 100;
				var classDeviceProgress = "progress-bar-success";
				if (devicePercent > 50 && devicePercent <= 80) {
					classDeviceProgress = "progress-bar-warning";
				} else if (devicePercent > 80) {
					classDeviceProgress = "progress-bar-danger";
				} 

				var storagePercent = 100;
				if (data.org.maxstorage > 0) {
					storagePercent = Math.floor(100*data.org.currentstorage/data.org.maxstorage);
				}
				if (storagePercent > 100) storagePercent = 100;
				var classStorageProgress = "progress-bar-success";
				if (storagePercent > 50 && storagePercent <= 80) {
					classStorageProgress = "progress-bar-warning";
				} else if (storagePercent > 80) {
					classStorageProgress = "progress-bar-danger";
				} 
				
				if (data.org.expireflag == 0) {
					$('#ExpireTime').html(common.view.expiretime + ': ' + common.view.unlimited);
				} else {
					$('#ExpireTime').html(common.view.expiretime + ': ' + data.org.expiretime);
				}
				$('#CurrentDevices').html(common.view.currentdevices + ': ' + data.org.currentdevices + ' (' + devicePercent + '%)');
				$('#MaxDevices').html(data.org.maxdevices);
				$('#CurrentDevicesProgress').attr('class', 'progress-bar ' + classDeviceProgress);
				$('#CurrentDevicesProgress').attr('style', 'width: ' + devicePercent + '%');

				$('#CurrentStorage').html(common.view.currentstorage + ': ' + data.org.currentstorage + ' MB (' + storagePercent + '%)');
				$('#MaxStorage').html(data.org.maxstorage + ' MB');
				$('#CurrentStorageProgress').attr('class', 'progress-bar ' + classStorageProgress);
				$('#CurrentStorageProgress').attr('style', 'width: ' + storagePercent + '%');
			}
		}
	});
	
}

function initDeviceTable() {
	var oTable = $('#DeviceTable').dataTable({
		'sDom' : 'rt',
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['device.list'],
		'aoColumns' : [ {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false },
						{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : common.view.online, 'mData' : 'onlineflag', 'bSortable' : false }],
		'iDisplayLength' : 5,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var data = $('#DeviceTable').dataTable().fnGetData(iDisplayIndex);

			if (data['onlineflag'] == 9) {
				$('td:eq(2)', nRow).html('<span class="label label-sm label-default">' + common.view.offline + '</span>');
			} else if (data['onlineflag'] == 1) {
				$('td:eq(2)', nRow).html('<span class="label label-sm label-success">' + common.view.online + '</span>');
			} else if (data['onlineflag'] == 0) {
				$('td:eq(2)', nRow).html('<span class="label label-sm label-info">' + common.view.idle + '</span>');
			}
			return nRow;
		}
	});
	
}

function initTaskTable() {
	var oTable = $('#VideoTable').dataTable({
		'sDom' : 'rt',
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['video.list'],
		'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
						{'sTitle' : common.view.size, 'mData' : 'size', 'bSortable' : false }, 
						{'sTitle' : common.view.uploadtime, 'mData' : 'createtime', 'bSortable' : false }],
		'iDisplayLength' : 5,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(1)', nRow).html(transferIntToComma(parseInt(aData['size'] / 1024)) + ' KB');
			return nRow;
		}
	});
	
}

function initMediaChart() {
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
	
	var options = {
		series: {
			lines: {
				show: true,
				lineWidth: 2,
				fill: true,
				fillColor: {
					colors: [{
							opacity: 0.05
						}, {
							opacity: 0.01
						}
					]
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
			tickColor: "#eee",
			borderWidth: 0
		},
		colors: ["#d12610", "#37b7f3", "#52e136"],
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

	$('#MediaStatLoding').hide();
	$('#MediaStat').show();

	$.plot("#MediaStatPlot", statdata, options);
	
	if (imageflag == 1) {
		$.ajax({
			url: myurls['stat'],
			type : 'POST',
			data : {'stattype': '1'},
			dataType: "json",
			success : function(data, status) {
				if (data.errorcode == 0) {
					onDataReceived(data.aaData, '1');
				}
			}
		});
	}
	if (videoflag == 1) {
		$.ajax({
			url: myurls['stat'],
			type : 'POST',
			data : {'stattype': '2'},
			dataType: "json",
			success : function(data, status) {
				if (data.errorcode == 0) {
					onDataReceived(data.aaData, '2');
				}
			}
		});
	}
	
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
		$.plot("#MediaStatPlot", statdata, options);
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
		}).appendTo("body").fadeIn(200);
	}

	var previousPoint = null;
	$("#MediaStatPlot").bind("plothover", function (event, pos, item) {
		//$("#x").text(pos.x.toFixed(2));
		//$("#y").text(pos.y.toFixed(2));
		if (item) {
			if (previousPoint != item.dataIndex) {
				previousPoint = item.dataIndex;

				$("#tooltip").remove();
				showTooltip(item);
			}
		} else {
			$("#tooltip").remove();
			previousPoint = null;
		}
	});

}


function initFileChart() {
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
	
	var options = {
		series: {
			lines: {
				show: true,
				lineWidth: 2,
				fill: true,
				fillColor: {
					colors: [{
							opacity: 0.05
						}, {
							opacity: 0.01
						}
					]
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
			tickColor: "#eee",
			borderWidth: 0
		},
		colors: ["#d12610", "#37b7f3", "#52e136"],
		xaxis: {
			ticks: ticks,
			tickDecimals: 0
		},
		yaxis: {
			ticks: 11,
			tickDecimals: 0,
			tickFormatter: function formatter(val, axis) {
				if (val > 10000000000)
					return (val / 1000000000).toFixed(axis.tickDecimals) + " GB";
				else if (val > 1000000)
					return (val / 1000000).toFixed(axis.tickDecimals) + " MB";
				else if (val > 1000)
					return (val / 1000).toFixed(axis.tickDecimals) + " KB";
				else
					return val.toFixed(axis.tickDecimals) + " B";
			}
		}
	};
	
	var statdata = [];

	$('#FileStatLoding').hide();
	$('#FileStat').show();

	$.plot("#FileStatPlot", statdata, options);
	
	$.ajax({
		url: myurls['stat'],
		type : 'POST',
		data : {'stattype': '0'},
		dataType: "json",
		success : function(data, status) {
			if (data.errorcode == 0) {
				onDataReceived(data.aaData);
			}
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
		$.plot("#FileStatPlot", statdata, options);
	}
	
	function showTooltip(item) {
		//
		var x = item.datapoint[0];
		var y = item.datapoint[1];
		if (y > 10000000000)
			y = (y / 1000000000).toFixed(2) + " GB";
		else if (y > 1000000)
			y = (y / 1000000).toFixed(2) + " MB";
		else if (y > 1000)
			y = (y / 1000).toFixed(2) + " KB";
		else
			y = y.toFixed(0) + " B";

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
		}).appendTo("body").fadeIn(200);
	}

	var previousPoint = null;
	$("#FileStatPlot").bind("plothover", function (event, pos, item) {
		//$("#x").text(pos.x.toFixed(2));
		//$("#y").text(pos.y.toFixed(2));
		if (item) {
			if (previousPoint != item.dataIndex) {
				previousPoint = item.dataIndex;

				$("#tooltip").remove();
				showTooltip(item);
			}
		} else {
			$("#tooltip").remove();
			previousPoint = null;
		}
	});
}