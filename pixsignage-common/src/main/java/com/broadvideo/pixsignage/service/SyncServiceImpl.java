package com.broadvideo.pixsignage.service;

import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegrid;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Plan;
import com.broadvideo.pixsignage.domain.Planbind;
import com.broadvideo.pixsignage.domain.Plandtl;
import com.broadvideo.pixsignage.domain.Scheduledtl;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicegridMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.persistence.PlanMapper;
import com.broadvideo.pixsignage.util.ActiveMQUtil;

import net.sf.json.JSONObject;

@Service("syncService")
public class SyncServiceImpl implements SyncService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private PlanMapper planMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private DevicegridMapper devicegridMapper;
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
				if (isMQ) {
					syncScheduleMQ(bindid);
					syncBundleMQ2Device(bindid);
				}
			}
		} else if (bindtype.equals(Planbind.BindType_Devicegroup)) {
			List<Device> devices = deviceMapper.selectByDevicegroup(bindid);
			for (Device device : devices) {
				if (device.getOnlineflag().equals(Device.Online)) {
					syncEvent("" + device.getDeviceid());
					if (isMQ) {
						syncScheduleMQ("" + device.getDeviceid());
					}
				}
			}
			if (isMQ) {
				syncBundleMQ2Devicegroup(bindid);
			}

			List<Devicegrid> devicegrids = devicegridMapper.selectByDevicegroup(bindid);
			for (Devicegrid devicegrid : devicegrids) {
				devices = devicegrid.getDevices();
				for (Device device : devices) {
					if (device.getOnlineflag().equals(Device.Online)) {
						syncEvent("" + device.getDeviceid());
						if (isMQ) {
							syncScheduleMQ("" + device.getDeviceid());
						}
					}
				}
			}
		} else if (bindtype.equals(Planbind.BindType_Devicegrid)) {
			List<Device> devices = deviceMapper.selectByDevicegrid(bindid);
			for (Device device : devices) {
				if (device.getOnlineflag().equals(Device.Online)) {
					syncEvent("" + device.getDeviceid());
					if (isMQ) {
						syncScheduleMQ("" + device.getDeviceid());
					}
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

	private void syncScheduleMQ(String deviceid) throws Exception {
		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "SCHEDULE");
		JSONObject msgBodyJson = planService.generateBundlePlanJson("" + deviceid);
		msgJson.put("msg_body", msgBodyJson);
		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	private void syncBundleMQ2Device(String deviceid) throws Exception {
		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "BUNDLE");
		JSONObject msgBodyJson = scheduleService.generateDeviceBundleScheduleJson(deviceid);
		msgJson.put("msg_body", msgBodyJson);
		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	private void syncBundleMQ2Devicegroup(String devicegroupid) throws Exception {
		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "BUNDLE");
		JSONObject msgBodyJson = scheduleService.generateDevicegroupBundleScheduleJson(devicegroupid);
		msgJson.put("msg_body", msgBodyJson);
		String topic = "group-" + devicegroupid;
		ActiveMQUtil.publish(topic, msgJson.toString());
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
		/*
		 * Org org = orgMapper.selectByPrimaryKey(orgid); if
		 * (org.getPlanflag().equals("1")) { List<Device> deviceList =
		 * deviceMapper.selectByDefaultpage(pageid); for (Device device : deviceList) {
		 * syncPlan("1", "" + device.getDeviceid()); } } else { List<HashMap<String,
		 * Object>> bindList = planMapper.selectBindListByObj(Plandtl.ObjType_Page,
		 * pageid); for (HashMap<String, Object> bindObj : bindList) {
		 * syncPlan(bindObj.get("bindtype").toString(),
		 * bindObj.get("bindid").toString()); } }
		 */
	}

	@Transactional
	public void syncByMediagrid(String mediagridid) throws Exception {
		List<HashMap<String, Object>> bindList = planMapper.selectBindListByObj(Plandtl.ObjType_Mediagrid, mediagridid);
		for (HashMap<String, Object> bindObj : bindList) {
			sync(bindObj.get("bindtype").toString(), bindObj.get("bindid").toString(), false);
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
