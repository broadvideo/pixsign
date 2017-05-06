package com.broadvideo.pixsignage.task;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.persistence.OnlinelogMapper;
import com.broadvideo.pixsignage.service.DeviceService;
import com.broadvideo.pixsignage.service.OrgService;

public class DeviceTask {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean workflag = false;

	@Autowired
	private DeviceService deviceService;
	@Autowired
	private OnlinelogMapper onlinelogMapper;
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
			onlinelogMapper.updateAll();
			orgService.updateCurrentdevices();
			orgService.updateCurrentstorage();
		} catch (Exception e) {
			logger.error("Device Quartz Task error: {}", e.getMessage());
		}
		workflag = false;
	}
}