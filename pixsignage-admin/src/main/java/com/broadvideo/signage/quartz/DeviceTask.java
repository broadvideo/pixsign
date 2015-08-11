package com.broadvideo.signage.quartz;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.signage.service.DeviceService;
import com.broadvideo.signage.service.OrgService;

public class DeviceTask {
	private static final Logger log = Logger.getLogger(DeviceTask.class);

	private static boolean workflag = false;

	@Autowired
	private DeviceService deviceService;
	@Autowired
	private OrgService orgService;

	public void work() {
		if (workflag) {
			return;
		}
		workflag = true;
		log.info("Start Device Quartz Task to update device & org.");
		try {
			deviceService.updateOnlineflag();
			orgService.updateCurrentdevices();
			orgService.updateCurrentstorage();
		} catch (Exception e) {
			log.error("Device Quartz Task error: " + e.getMessage());
		}
		workflag = false;
	}
}
