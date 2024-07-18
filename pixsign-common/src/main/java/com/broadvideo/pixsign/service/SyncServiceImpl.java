package com.broadvideo.pixsign.service;

import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsign.domain.Device;
import com.broadvideo.pixsign.domain.Msgevent;
import com.broadvideo.pixsign.domain.Org;
import com.broadvideo.pixsign.domain.Plan;
import com.broadvideo.pixsign.domain.Planbind;
import com.broadvideo.pixsign.domain.Scheduledtl;
import com.broadvideo.pixsign.persistence.DeviceMapper;
import com.broadvideo.pixsign.persistence.MsgeventMapper;
import com.broadvideo.pixsign.persistence.OrgMapper;
import com.broadvideo.pixsign.persistence.PlanMapper;

@Service("syncService")
public class SyncServiceImpl implements SyncService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private PlanMapper planMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;
	@Autowired
	private OrgMapper orgMapper;

	@Autowired
	private ScheduleService scheduleService;
	@Autowired
	private PlanService planService;

	@Transactional
	public void sync(String bindtype, String bindid, boolean isMQ) throws Exception {
		if (bindtype.equals(Planbind.BindType_Device)) {
			Device device = deviceMapper.selectByPrimaryKey(bindid);
			if (device != null && device.getOnlineflag().equals(Device.Online)) {
				syncEvent(bindid);
			}
		} else if (bindtype.equals(Planbind.BindType_Devicegroup)) {
			List<Device> devices = deviceMapper.selectByDevicegroup(bindid);
			for (Device device : devices) {
				if (device.getOnlineflag().equals(Device.Online)) {
					syncEvent("" + device.getDeviceid());
				}
			}
		}
	}

	private void syncEvent(String deviceid) throws Exception {
		Msgevent msgevent = new Msgevent();
		msgevent.setMsgtype(Msgevent.MsgType_Bundle);
		msgevent.setObjtype1(Msgevent.ObjType_1_Device);
		msgevent.setObjid1(Integer.parseInt(deviceid));
		msgevent.setObjtype2(Msgevent.ObjType_2_None);
		msgevent.setObjid2(0);
		msgevent.setStatus(Msgevent.Status_Wait);
		msgeventMapper.deleteByDtl(Msgevent.MsgType_Bundle, Msgevent.ObjType_1_Device, "" + deviceid, null, null, null);
		msgeventMapper.insertSelective(msgevent);

		msgevent = new Msgevent();
		msgevent.setMsgtype(Msgevent.MsgType_Page);
		msgevent.setObjtype1(Msgevent.ObjType_1_Device);
		msgevent.setObjid1(Integer.parseInt(deviceid));
		msgevent.setObjtype2(Msgevent.ObjType_2_None);
		msgevent.setObjid2(0);
		msgevent.setStatus(Msgevent.Status_Wait);
		msgeventMapper.deleteByDtl(Msgevent.MsgType_Page, Msgevent.ObjType_1_Device, "" + deviceid, null, null, null);
		msgeventMapper.insertSelective(msgevent);

		msgevent = new Msgevent();
		msgevent.setMsgtype(Msgevent.MsgType_Medialist);
		msgevent.setObjtype1(Msgevent.ObjType_1_Device);
		msgevent.setObjid1(Integer.parseInt(deviceid));
		msgevent.setObjtype2(Msgevent.ObjType_2_None);
		msgevent.setObjid2(0);
		msgevent.setStatus(Msgevent.Status_Wait);
		msgeventMapper.deleteByDtl(Msgevent.MsgType_Medialist, Msgevent.ObjType_1_Device, "" + deviceid, null, null,
				null);
		msgeventMapper.insertSelective(msgevent);

		logger.info("Generate sync event, deviceid={}", deviceid);
	}

	@Transactional
	public void syncPlan(String planid) throws Exception {
		Plan plan = planMapper.selectByPrimaryKey(planid);
		if (plan != null) {
			List<Planbind> planbinds = plan.getPlanbinds();
			for (Planbind planbind : planbinds) {
				sync(planbind.getBindtype(), "" + planbind.getBindid(), false);
			}
		}
	}

	@Transactional
	public void syncByBundle(String orgid, String bundleid) throws Exception {
		Org org = orgMapper.selectByPrimaryKey(orgid);
		if (org.getBundleplanflag().equals("0")) {
			List<HashMap<String, Object>> bindList = scheduleService.selectBindListByObj(Scheduledtl.ObjType_Bundle,
					bundleid);
			for (HashMap<String, Object> bindObj : bindList) {
				sync(bindObj.get("bindtype").toString(), bindObj.get("bindid").toString(), true);
			}
		} else {
			List<Device> deviceList = deviceMapper.selectByDefaultbundle(bundleid);
			for (Device device : deviceList) {
				sync(Planbind.BindType_Device, "" + device.getDeviceid(), true);
			}
		}
	}

	@Transactional
	public void syncByPage(String orgid, String pageid) throws Exception {
		List<Device> deviceList = deviceMapper.selectByDefaultpage(pageid);
		for (Device device : deviceList) {
			sync("1", "" + device.getDeviceid(), false);
		}
	}

	@Transactional
	public void syncByMedialist(String medialistid) throws Exception {
		List<Device> deviceList = deviceMapper.selectByDefaultmedialist(medialistid);
		for (Device device : deviceList) {
			sync("1", "" + device.getDeviceid(), false);
		}
	}
}
