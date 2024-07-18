var License = function () {
	var init = function () {
		$.ajax({
			url: 'vsp!get.action',
			type : 'POST',
			dataType: 'json',
			success : function(data, status) {
				if (data.errorcode == 0) {
					var devicePercent = 100;
					if (data.vsp.maxdevices > 0) {
						devicePercent = Math.floor(100*data.vsp.currentdevices/data.vsp.maxdevices);
					}
					if (devicePercent > 100) devicePercent = 100;
					var classDeviceProgress = "progress-bar-success";
					if (devicePercent > 50 && devicePercent <= 80) {
						classDeviceProgress = "progress-bar-warning";
					} else if (devicePercent > 80) {
						classDeviceProgress = "progress-bar-danger";
					} 

					var storagePercent = 100;
					if (data.vsp.maxstorage > 0) {
						storagePercent = Math.floor(100*data.vsp.currentstorage/data.vsp.maxstorage);
					}
					if (storagePercent > 100) storagePercent = 100;
					var classStorageProgress = "progress-bar-success";
					if (storagePercent > 50 && storagePercent <= 80) {
						classStorageProgress = "progress-bar-warning";
					} else if (storagePercent > 80) {
						classStorageProgress = "progress-bar-danger";
					} 
					
					$('#CurrentDevices').html(common.view.currentdevices + ': ' + data.vsp.currentdevices + ' (' + devicePercent + '%)');
					$('#MaxDevices').html(data.vsp.maxdevices);
					$('#CurrentDevicesProgress').attr('class', 'progress-bar ' + classDeviceProgress);
					$('#CurrentDevicesProgress').attr('style', 'width: ' + devicePercent + '%');

					$('#CurrentStorage').html(common.view.currentstorage + ': ' + data.vsp.currentstorage + ' MB (' + storagePercent + '%)');
					$('#MaxStorage').html(data.vsp.maxstorage + ' MB');
					$('#CurrentStorageProgress').attr('class', 'progress-bar ' + classStorageProgress);
					$('#CurrentStorageProgress').attr('style', 'width: ' + storagePercent + '%');
				}
			}
		});
	};

	return {
		init: init,
	}
}();
