package com.broadvideo.pixsignage.quartz;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Region;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicegroupMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.RegionMapper;

public class ActivemqDailyTask {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean workflag = false;

	@Autowired
	private RegionMapper regionMapper;
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

			List<Region> regionList = regionMapper.selectActiveList();

			List<Device> deviceList = deviceMapper.selectList(null, null, "1", "0", null, null, null);
			for (Device device : deviceList) {
				logger.info("Insert layout & region schedule msgevent for device {}", device.getTerminalid());
				insertLayoutMsgevent("1", device.getDeviceid());
				for (Region region : regionList) {
					insertRegionMsgevent("1", device.getDeviceid(), region.getRegionid());
				}
			}

			List<Devicegroup> devicegroupList = devicegroupMapper.selectList(null, null, null, null, null);
			for (Devicegroup devicegroup : devicegroupList) {
				logger.info("Insert layout & region schedule msgevent for devicegroup {}", devicegroup.getName());
				insertLayoutMsgevent("2", devicegroup.getDevicegroupid());
				for (Region region : regionList) {
					insertRegionMsgevent("2", devicegroup.getDevicegroupid(), region.getRegionid());
				}
			}

		} catch (Exception e) {
			logger.error("ActivemqDailyTask Quartz Task error: {}", e.getMessage());
		}
		workflag = false;
	}

	private void insertLayoutMsgevent(String bindtype, int bindid) {
		Msgevent msgevent = new Msgevent();
		msgevent.setMsgtype(Msgevent.MsgType_Layout_Schedule);
		msgevent.setObjtype1(bindtype);
		msgevent.setObjid1(bindid);
		msgevent.setObjtype2(Msgevent.ObjType_2_None);
		msgevent.setObjid2(0);
		msgevent.setStatus(Msgevent.Status_Wait);
		msgeventMapper.deleteByDtl(Msgevent.MsgType_Layout_Schedule, bindtype, "" + bindid, null, null, null);
		msgeventMapper.insertSelective(msgevent);
	}

	private void insertRegionMsgevent(String bindtype, int bindid, int regionid) {
		Msgevent msgevent = new Msgevent();
		msgevent.setMsgtype(Msgevent.MsgType_Region_Schedule);
		msgevent.setObjtype1(bindtype);
		msgevent.setObjid1(bindid);
		msgevent.setObjtype2(Msgevent.ObjType_2_Region);
		msgevent.setObjid2(regionid);
		msgevent.setStatus(Msgevent.Status_Wait);
		msgeventMapper.deleteByDtl(Msgevent.MsgType_Region_Schedule, bindtype, "" + bindid, Msgevent.ObjType_2_Region,
				"" + regionid, null);
		msgeventMapper.insertSelective(msgevent);
	}
}
