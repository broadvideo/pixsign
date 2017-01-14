package com.broadvideo.pixsignage.quartz;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicegroupMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;

public class ActivemqDailyTask {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean workflag = false;

	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private DevicegroupMapper devicegroupMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;

	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;

			List<Device> deviceList = deviceMapper.selectList(null, null, "1", "1", "0", null, null, null, "deviceid");
			for (Device device : deviceList) {
				logger.info("Insert layout & region schedule msgevent for device {}", device.getTerminalid());
				insertBundleMsgevent("1", device.getDeviceid());
			}

			List<Devicegroup> devicegroupList = devicegroupMapper.selectList(null, null, null, null, null);
			for (Devicegroup devicegroup : devicegroupList) {
				logger.info("Insert layout & region schedule msgevent for devicegroup {}", devicegroup.getName());
				insertBundleMsgevent("2", devicegroup.getDevicegroupid());
			}

		} catch (Exception e) {
			logger.error("ActivemqDailyTask Quartz Task error: {}", e.getMessage());
		}
		workflag = false;
	}

	private void insertBundleMsgevent(String bindtype, int bindid) {
		Msgevent msgevent = new Msgevent();
		msgevent.setMsgtype(Msgevent.MsgType_Bundle_Schedule);
		msgevent.setObjtype1(bindtype);
		msgevent.setObjid1(bindid);
		msgevent.setObjtype2(Msgevent.ObjType_2_None);
		msgevent.setObjid2(0);
		msgevent.setStatus(Msgevent.Status_Wait);
		msgeventMapper.deleteByDtl(Msgevent.MsgType_Bundle_Schedule, bindtype, "" + bindid, null, null, null);
		msgeventMapper.insertSelective(msgevent);
	}
}
