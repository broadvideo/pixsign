package com.broadvideo.pixsignage.quartz;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.service.DeviceService;
import com.broadvideo.pixsignage.service.OnlinelogService;
import com.broadvideo.pixsignage.service.OrgService;

public class DeviceTask {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean workflag = false;

	@Autowired
	private DeviceService deviceService;
	@Autowired
	private OnlinelogService onlinelogService;
	@Autowired
	private OrgService orgService;

	public void work() {
		if (workflag) {
			return;
		}
		workflag = true;
		logger.info("Start Device Quartz Task to update device & org.");
		try {
			deviceService.updateOnlineflag();
			onlinelogService.updateAll();
			orgService.updateCurrentdevices();
			orgService.updateCurrentstorage();
		} catch (Exception e) {
			logger.error("Device Quartz Task error: {}", e.getMessage());
		}
		workflag = false;
	}
}
