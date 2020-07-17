package com.broadvideo.pixsignage.service;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Adplan;
import com.broadvideo.pixsignage.domain.Adplandtl;
import com.broadvideo.pixsignage.domain.Bundle;
import com.broadvideo.pixsignage.domain.Bundlezone;
import com.broadvideo.pixsignage.domain.Bundlezonedtl;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Medialistdtl;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.domain.Pagezone;
import com.broadvideo.pixsignage.domain.Pagezonedtl;
import com.broadvideo.pixsignage.domain.Schedule;
import com.broadvideo.pixsignage.domain.Scheduledtl;
import com.broadvideo.pixsignage.domain.Stream;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.exception.PixException;
import com.broadvideo.pixsignage.persistence.AdplanMapper;
import com.broadvideo.pixsignage.persistence.AdplandtlMapper;
import com.broadvideo.pixsignage.persistence.BundleMapper;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicefileMapper;
import com.broadvideo.pixsignage.persistence.DevicefilehisMapper;
import com.broadvideo.pixsignage.persistence.DevicegroupMapper;
import com.broadvideo.pixsignage.persistence.MedialistdtlMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.persistence.PageMapper;
import com.broadvideo.pixsignage.persistence.ScheduleMapper;
import com.broadvideo.pixsignage.persistence.VideoMapper;
import com.broadvideo.pixsignage.util.ActiveMQUtil;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.DateUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service("deviceService")
public class DeviceServiceImpl implements DeviceService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private DevicegroupMapper devicegroupMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;
	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private BundleMapper bundleMapper;
	@Autowired
	private PageMapper pageMapper;
	@Autowired
	private ScheduleMapper scheduleMapper;
	@Autowired
	private MedialistdtlMapper medialistdtlMapper;
	@Autowired
	private AdplanMapper adplanMapper;
	@Autowired
	private AdplandtlMapper adplandtlMapper;
	@Autowired
	private VideoMapper videoMapper;
	@Autowired
	private DevicefileMapper devicefileMapper;
	@Autowired
	private DevicefilehisMapper devicefilehisMapper;

	@Autowired
	private BundleService bundleService;

	public int selectCount(String orgid, String branchid, String subbranchflag, String type, String status,
			String onlineflag, String devicegroupid, String devicegridid, String cataitemid1, String cataitemid2,
			String search) {
		return deviceMapper.selectCount(orgid, branchid, subbranchflag, type, status, onlineflag, devicegroupid,
				devicegridid, cataitemid1, cataitemid2, search);
	}

	public List<Device> selectList(String orgid, String branchid, String subbranchflag, String type, String status,
			String onlineflag, String devicegroupid, String devicegridid, String cataitemid1, String cataitemid2,
			String search, String start, String length, String order) {
		return deviceMapper.selectList(orgid, branchid, subbranchflag, type, status, onlineflag, devicegroupid,
				devicegridid, cataitemid1, cataitemid2, search, start, length, order);
	}

	public Device selectByPrimaryKey(String deviceid) {
		return deviceMapper.selectByPrimaryKey(deviceid);
	}

	public Device selectByHardkey(String hardkey) {
		return deviceMapper.selectByHardkey(hardkey);
	}

	public Device selectByTerminalid(String terminalid) {
		return deviceMapper.selectByTerminalid(terminalid);
	}

	@Transactional
	public synchronized void addDevice(Device device) {
		Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
		int currentdeviceidx = org.getCurrentdeviceidx();
		String maxdetail = org.getMaxdetail();
		String[] maxs = maxdetail.split(",");
		int t = Integer.parseInt(device.getType());
		int max = maxs.length > t - 1 ? Integer.parseInt(maxs[t - 1]) : 0;
		int currentTypeCount = deviceMapper.selectCountByType("" + device.getOrgid(), device.getType(), null);
		if (currentTypeCount >= max) {
			throw new PixException(3002,
					"Device has reached the upper limit, type=" + device.getType() + ", max=" + max);
		}

		if (device.getType().equals(Device.Type_3DFanSolo) || device.getType().equals(Device.Type_3DFanWall) || device.getType().equals(Device.Type_Cloudia)) {
			Device d = deviceMapper.selectByTerminalid(device.getTerminalid());
			if (d != null) {
				throw new PixException(3003, "Device terminalid duplicated, terminalid=" + device.getTerminalid());
			}
			device.setHardkey(device.getTerminalid());
			device.setStatus("1");
			device.setActivetime(Calendar.getInstance().getTime());
			deviceMapper.insertSelective(device);
			org.setCurrentdeviceidx(currentdeviceidx + 1);
			orgMapper.updateByPrimaryKeySelective(org);
			logger.info("Add one new device, name={}, orgid={}, type={}, terminalid={}", device.getName(),
					device.getOrgid(), device.getType(), device.getTerminalid());
		} else {
			String terminalid = "" + device.getType();
			String orgid = "" + device.getOrgid();
			int k = 3 - orgid.length();
			for (int i = 0; i < k; i++) {
				orgid = "0" + orgid;
			}
			String tid = "" + (org.getCurrentdeviceidx() + 1);
			k = 4 - tid.length();
			for (int i = 0; i < k; i++) {
				tid = "0" + tid;
			}
			terminalid = terminalid + orgid + tid;

			// Generate the check digit
			int[] terminalidArr = new int[terminalid.length()];
			for (int i = 0; i < terminalid.length(); i++) {
				terminalidArr[i] = Integer.valueOf(String.valueOf(terminalid.charAt(i)));
			}
			int sum = 0;
			for (int i = 0; i < terminalid.length(); i++) {
				if (i % 2 == 0) {
					sum += terminalidArr[terminalid.length() - i - 1] * 3;
				} else {
					sum += terminalidArr[terminalid.length() - i - 1];
				}
			}
			terminalid = terminalid + ((10 - sum % 10) % 10);

			device.setTerminalid(terminalid);
			device.setStatus("0");
			deviceMapper.insertSelective(device);
			org.setCurrentdeviceidx(currentdeviceidx + 1);
			orgMapper.updateByPrimaryKeySelective(org);
			logger.info("Add one new device, name={}, orgid={}, type={}, terminalid={}", device.getName(),
					device.getOrgid(), device.getType(), device.getTerminalid());
		}
	}

	@Transactional
	public void updateDevice(Device device) {
		deviceMapper.updateByPrimaryKey(device);
	}

	@Transactional
	public void updateDeviceSelective(Device device) {
		device.setTerminalid(null);
		deviceMapper.updateByPrimaryKeySelective(device);
		// deviceMapper.checkDevicegroup();
	}

	@Transactional
	public void bind(Device device) {
		String terminalid = device.getTerminalid();
		String hardkey = device.getHardkey();
		if (hardkey == null || hardkey.equals("")) {
			throw new PixException(3004, "Device hardkey error");
		}

		Device device2 = deviceMapper.selectByHardkey(hardkey);
		if (device2 != null && !device2.getTerminalid().equals(terminalid)) {
			throw new PixException(3005, "Device hardkey has been binded, hardkey=" + hardkey);
		}
		device.setActivetime(Calendar.getInstance().getTime());
		device.setHardkey(hardkey);
		device.setStatus("1");
		deviceMapper.updateByPrimaryKeySelective(device);
	}

	@Transactional
	public void unbind(String deviceid) {
		deviceMapper.unbind(deviceid);
	}

	@Transactional
	public void delete(String deviceid) {
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
		int currentdeviceidx = org.getCurrentdeviceidx();
		org.setCurrentdeviceidx(currentdeviceidx - 1);
		orgMapper.updateByPrimaryKeySelective(org);
		deviceMapper.deleteByPrimaryKey(deviceid);
	}

	@Transactional
	public void updateUpgradeflag(String orgid, String branchid, String type, String upgradeflag) {
		deviceMapper.updateUpgradeflag(orgid, branchid, type, upgradeflag);
	}

	@Transactional
	public void updateBundle(String[] deviceids, String defaultbundleid) {
		for (int i = 0; i < deviceids.length; i++) {
			deviceMapper.updateBundle(deviceids[i], defaultbundleid);
		}
	}

	@Transactional
	public void updatePage(String[] deviceids, String defaultpageid) {
		for (int i = 0; i < deviceids.length; i++) {
			deviceMapper.updatePage(deviceids[i], defaultpageid);
		}
	}

	public void updateMedialist(String[] deviceids, String defaultmedialistid) {
		for (int i = 0; i < deviceids.length; i++) {
			deviceMapper.updateMedialist(deviceids[i], defaultmedialistid);
		}
	}

	@Transactional
	public void updateOnlineflag() {
		deviceMapper.updateOnlineflag();
	}

	@Transactional
	public void configall(String orgid) throws Exception {
		List<Device> devices = deviceMapper.selectList(orgid, null, null, null, "1", "1", null, null, null, null, null,
				null, null, null);
		for (Device device : devices) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Device_Config);
			msgevent.setObjtype1(Msgevent.ObjType_1_Device);
			msgevent.setObjid1(device.getDeviceid());
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Device_Config, Msgevent.ObjType_1_Device,
					"" + device.getDeviceid(), null, null, null);
			msgeventMapper.insertSelective(msgevent);
		}

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		Org org = orgMapper.selectByPrimaryKey(orgid);
		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 0);
		msgJson.put("msg_type", "CONFIG");
		JSONObject msgBodyJson = new JSONObject();
		msgBodyJson.put("msg_server", serverip + ":1883");
		JSONArray topicJsonArray = new JSONArray();
		msgBodyJson.put("msg_topic", topicJsonArray);

		if (org.getBackupvideo() != null) {
			JSONObject backupvideoJson = new JSONObject();
			// backupvideoJson.put("type", "video");
			backupvideoJson.put("id", org.getBackupvideoid());
			backupvideoJson.put("url",
					"http://" + serverip + ":" + serverport + "/pixsigdata" + org.getBackupvideo().getFilepath());
			backupvideoJson.put("file", org.getBackupvideo().getFilename());
			backupvideoJson.put("size", org.getBackupvideo().getSize());
			msgBodyJson.put("backup_media", backupvideoJson);
		}

		if (org.getVolumeflag().equals("0")) {
			msgBodyJson.put("volume", -1);
		} else {
			msgBodyJson.put("volume", org.getVolume());
		}

		msgBodyJson.put("power_flag", Integer.parseInt(org.getPowerflag()));
		if (org.getPowerflag().equals("1")) {
			msgBodyJson.put("power_on_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweron()));
			msgBodyJson.put("power_off_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweroff()));
		}

		msgBodyJson.put("password_flag", Integer.parseInt(org.getDevicepassflag()));
		msgBodyJson.put("password", org.getDevicepass());
		msgJson.put("msg_body", msgBodyJson);

		String topic = "org-" + orgid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	@Transactional
	public void config(String deviceid) throws Exception {
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		if (device.getOnlineflag().equals(Device.Online)) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Device_Config);
			msgevent.setObjtype1(Msgevent.ObjType_1_Device);
			msgevent.setObjid1(Integer.parseInt(deviceid));
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Device_Config, Msgevent.ObjType_1_Device, deviceid, null, null,
					null);
			msgeventMapper.insertSelective(msgevent);
		}

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "CONFIG");
		JSONObject msgBodyJson = new JSONObject();
		msgBodyJson.put("msg_server", serverip + ":1883");
		JSONArray topicJsonArray = new JSONArray();
		topicJsonArray.add("device-" + deviceid);
		if (device.getDevicegroupid() > 0) {
			topicJsonArray.add("group-" + device.getDevicegroupid());
		}
		topicJsonArray.add("org-" + device.getOrgid());
		msgBodyJson.put("msg_topic", topicJsonArray);

		Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
		if (org.getBackupvideo() != null) {
			JSONObject backupvideoJson = new JSONObject();
			// backupvideoJson.put("type", "video");
			backupvideoJson.put("id", org.getBackupvideoid());
			backupvideoJson.put("url",
					"http://" + serverip + ":" + serverport + "/pixsigdata" + org.getBackupvideo().getFilepath());
			backupvideoJson.put("file", org.getBackupvideo().getFilename());
			backupvideoJson.put("size", org.getBackupvideo().getSize());
			msgBodyJson.put("backup_media", backupvideoJson);
		}

		if (device.getVolumeflag().equals("0")) {
			msgBodyJson.put("volume", -1);
		} else if (device.getVolumeflag().equals("1")) {
			msgBodyJson.put("volume", device.getVolume());
		} else {
			if (org.getVolumeflag().equals("0")) {
				msgBodyJson.put("volume", -1);
			} else {
				msgBodyJson.put("volume", org.getVolume());
			}
		}

		if (device.getPowerflag().equals("0")) {
			msgBodyJson.put("power_flag", 0);
		} else if (device.getPowerflag().equals("1")) {
			msgBodyJson.put("power_flag", 1);
			msgBodyJson.put("power_on_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(device.getPoweron()));
			msgBodyJson.put("power_off_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(device.getPoweroff()));
		} else {
			if (org.getPowerflag().equals("0")) {
				msgBodyJson.put("power_flag", 0);
			} else {
				msgBodyJson.put("power_flag", 1);
				msgBodyJson.put("power_on_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweron()));
				msgBodyJson.put("power_off_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweroff()));
			}
		}

		msgBodyJson.put("password_flag", Integer.parseInt(org.getDevicepassflag()));
		msgBodyJson.put("password", org.getDevicepass());
		if (org.getTagflag().equals("1") && device.getTagflag().equals("1")) {
			msgBodyJson.put("tag_flag", 1);
		} else {
			msgBodyJson.put("tag_flag", 0);
		}
		msgBodyJson.put("interval1", device.getInterval1());
		msgBodyJson.put("interval2", device.getInterval2());

		msgBodyJson.put("hotspot_flag", Integer.parseInt(device.getHotspotflag()));
		msgBodyJson.put("hotspot_ssid", device.getHotspotssid());
		msgBodyJson.put("hotspot_password", device.getHotspotpassword());
		msgBodyJson.put("hotspot_frequency", device.getHotspotfrequency());
		msgJson.put("msg_body", msgBodyJson);

		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	@Transactional
	public void reboot(String deviceid) throws Exception {
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		if (device.getOnlineflag().equals(Device.Online)) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Device_Reboot);
			msgevent.setObjtype1(Msgevent.ObjType_1_Device);
			msgevent.setObjid1(Integer.parseInt(deviceid));
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Device_Reboot, Msgevent.ObjType_1_Device, deviceid, null, null,
					null);
			msgeventMapper.insertSelective(msgevent);
		}

		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "REBOOT");
		JSONObject msgBodyJson = new JSONObject();
		msgJson.put("msg_body", msgBodyJson);

		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	@Transactional
	public void poweroff(String deviceid) throws Exception {
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		if (device.getOnlineflag().equals(Device.Online)) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Device_Poweroff);
			msgevent.setObjtype1(Msgevent.ObjType_1_Device);
			msgevent.setObjid1(Integer.parseInt(deviceid));
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Device_Poweroff, Msgevent.ObjType_1_Device, deviceid, null,
					null, null);
			msgeventMapper.insertSelective(msgevent);
		}

		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "POWEROFF");
		JSONObject msgBodyJson = new JSONObject();
		msgJson.put("msg_body", msgBodyJson);
		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	@Transactional
	public void screenoff(String deviceid) throws Exception {
		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "SCREENOFF");
		JSONObject msgBodyJson = new JSONObject();
		msgJson.put("msg_body", msgBodyJson);
		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	@Transactional
	public void screenon(String deviceid) throws Exception {
		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "SCREENON");
		JSONObject msgBodyJson = new JSONObject();
		msgJson.put("msg_body", msgBodyJson);
		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	@Transactional
	public void screen(String deviceid) throws Exception {
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		if (device.getOnlineflag().equals(Device.Online)) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Device_Screen);
			msgevent.setObjtype1(Msgevent.ObjType_1_Device);
			msgevent.setObjid1(Integer.parseInt(deviceid));
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Device_Screen, Msgevent.ObjType_1_Device, deviceid, null, null,
					null);
			msgeventMapper.insertSelective(msgevent);
		}

		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "SCREEN");
		JSONObject msgBodyJson = new JSONObject();
		msgJson.put("msg_body", msgBodyJson);

		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
		// msgevent.setStatus(Msgevent.Status_Sent);
		// msgevent.setSendtime(Calendar.getInstance().getTime());
		// msgeventMapper.updateByPrimaryKeySelective(msgevent);
	}

	@Transactional
	public void debug(String deviceid) throws Exception {
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		if (device.getOnlineflag().equals(Device.Online)) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Device_Debug);
			msgevent.setObjtype1(Msgevent.ObjType_1_Device);
			msgevent.setObjid1(Integer.parseInt(deviceid));
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Device_Debug, Msgevent.ObjType_1_Device, deviceid, null, null,
					null);
			msgeventMapper.insertSelective(msgevent);
		}

		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "DEBUG");
		JSONObject msgBodyJson = new JSONObject();
		msgJson.put("msg_body", msgBodyJson);

		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
		// msgevent.setStatus(Msgevent.Status_Sent);
		// msgevent.setSendtime(Calendar.getInstance().getTime());
		// msgeventMapper.updateByPrimaryKeySelective(msgevent);
	}

	@Transactional
	public void utext(String orgid, String text, String count, String position, String speed, String color, String size,
			String bgcolor, String opacity) throws Exception {
		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 0);
		msgJson.put("msg_type", "UTEXT");
		JSONObject msgBodyJson = new JSONObject();
		msgBodyJson.put("text", text);
		msgBodyJson.put("count", Integer.parseInt(count));
		msgBodyJson.put("position", position);
		msgBodyJson.put("speed", Integer.parseInt(speed));
		msgBodyJson.put("color", color);
		msgBodyJson.put("size", Integer.parseInt(size));
		msgBodyJson.put("bgcolor", bgcolor);
		String s = Integer.toHexString(Integer.parseInt(opacity));
		if (s.length() == 1) {
			s = "0" + s;
		}
		msgBodyJson.put("bgcolor", "#" + s + bgcolor.trim().substring(1));
		msgJson.put("msg_body", msgBodyJson);

		String topic = "org-" + orgid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	@Transactional
	public void ucancel(String orgid) throws Exception {
		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 0);
		msgJson.put("msg_type", "UCANCEL");
		JSONObject msgBodyJson = new JSONObject();
		msgJson.put("msg_body", msgBodyJson);

		String topic = "org-" + orgid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	public void resetExternalid(String externalid) {
		this.deviceMapper.resetExternalid(externalid);
	}

	public JSONObject generateBundleJson(Device device) throws Exception {
		JSONObject resultJson = new JSONObject();

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		String cdnserver = configMapper.selectValueByCode("CDNServer");
		String downloadurl = "http://" + serverip + ":" + serverport;
		if (cdnserver != null && cdnserver.trim().length() > 0) {
			downloadurl = "http://" + cdnserver;
		}
		Map<String, Class> map = new HashMap<String, Class>();
		map.put("subbundles", Bundle.class);
		map.put("bundlezones", Bundlezone.class);
		map.put("bundlezonedtls", Bundlezonedtl.class);

		JSONArray solobundleidJsonArray = new JSONArray();
		JSONArray mainscheduleJsonArray = new JSONArray();
		JSONArray attachscheduleJsonArray = new JSONArray();
		JSONArray bundleJsonArray = new JSONArray();
		JSONArray videoJsonArray = new JSONArray();
		JSONArray imageJsonArray = new JSONArray();
		JSONArray streamJsonArray = new JSONArray();
		JSONArray pageJsonArray = new JSONArray();
		HashMap<Integer, JSONObject> bundleHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> imageHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> streamHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> pageHash = new HashMap<Integer, JSONObject>();

		List<Schedule> mainscheduleList = new ArrayList<Schedule>();
		List<Schedule> attachscheduleList = new ArrayList<Schedule>();
		List<Bundle> bundleList = new ArrayList<Bundle>();

		Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
		if (org.getBundleplanflag().equals("0")) {
			if (device.getDevicegroupid().intValue() == 0) {
				mainscheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Solo, "0", Schedule.BindType_Device,
						"" + device.getDeviceid(), Schedule.PlayMode_Daily);
				attachscheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Solo, "1",
						Schedule.BindType_Device, "" + device.getDeviceid(), Schedule.PlayMode_Daily);
			} else {
				mainscheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Solo, "0",
						Schedule.BindType_Devicegroup, "" + device.getDevicegroupid(), Schedule.PlayMode_Daily);
				attachscheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Solo, "1",
						Schedule.BindType_Devicegroup, "" + device.getDevicegroupid(), Schedule.PlayMode_Daily);
			}
		} else {
			int defaultbundleid = 0;
			if (device.getDevicegroupid() > 0) {
				Devicegroup devicegroup = devicegroupMapper.selectByPrimaryKey("" + device.getDevicegroupid());
				defaultbundleid = devicegroup.getDefaultbundleid();
			} else {
				defaultbundleid = device.getDefaultbundleid();
			}
			if (defaultbundleid == 0) {
				defaultbundleid = org.getDefaultbundleid();
			}
			Schedule schedule = new Schedule();
			schedule.setScheduleid(0);
			schedule.setScheduletype(Schedule.ScheduleType_Solo);
			schedule.setPlaymode(Schedule.PlayMode_Daily);
			schedule.setStarttime(CommonUtil.parseDate("00:00:00", CommonConstants.DateFormat_Time));
			schedule.setEndtime(CommonUtil.parseDate("00:00:00", CommonConstants.DateFormat_Time));
			Scheduledtl scheduledtl = new Scheduledtl();
			scheduledtl.setScheduledtlid(0);
			scheduledtl.setScheduleid(0);
			scheduledtl.setObjtype(Scheduledtl.ObjType_Bundle);
			scheduledtl.setObjid(defaultbundleid);
			scheduledtl.setDuration(0);
			List<Scheduledtl> scheduledtls = new ArrayList<Scheduledtl>();
			scheduledtls.add(scheduledtl);
			schedule.setScheduledtls(scheduledtls);
			mainscheduleList.add(schedule);
		}

		// main schedule
		for (int i = 0; i < mainscheduleList.size(); i++) {
			Schedule schedule = mainscheduleList.get(i);
			JSONObject scheduleJson = new JSONObject();
			JSONArray bundleidJsonArray = new JSONArray();
			for (Scheduledtl scheduledtl : schedule.getScheduledtls()) {
				if (scheduledtl.getObjtype().equals(Scheduledtl.ObjType_Bundle)) {
					if (bundleHash.get(scheduledtl.getObjid()) == null) {
						Bundle bundle = bundleMapper.selectByPrimaryKey("" + scheduledtl.getObjid());
						int d1 = Integer.parseInt(DateUtil.getDateStr(bundle.getStartdate(), "yyyyMMdd"));
						int d2 = Integer.parseInt(DateUtil.getDateStr(bundle.getEnddate(), "yyyyMMdd"));
						int now = Integer.parseInt(DateUtil.getDateStr(Calendar.getInstance().getTime(), "yyyyMMdd"));
						if (now < d1 || now > d2) {
							continue;
						}

						if (!bundle.getReviewflag().equals(Bundle.REVIEW_PASSED)) {
							JSONObject bundleJson = JSONObject.fromObject(bundle.getJson());
							bundle = (Bundle) JSONObject.toBean(bundleJson, Bundle.class, map);
						}
						bundleList.add(bundle);
						for (Bundle subbundle : bundle.getSubbundles()) {
							Bundle b = bundleMapper.selectByPrimaryKey("" + subbundle.getBundleid());
							if (b != null && !b.getReviewflag().equals(Page.REVIEW_PASSED)) {
								JSONObject bundleJson = JSONObject.fromObject(b.getJson());
								b = (Bundle) JSONObject.toBean(bundleJson, Bundle.class, map);
							}
							bundleList.add(b);
						}

						String jsonPath = "/bundle/" + bundle.getBundleid() + "/bundle-" + bundle.getBundleid()
								+ ".json";
						File jsonFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + jsonPath);
						if (!jsonFile.exists()) {
							bundleService.makeJsonFile("" + bundle.getBundleid());
						}
						JSONObject bundleJson = new JSONObject();
						bundleJson.put("bundle_id", bundle.getBundleid());
						bundleJson.put("url", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + jsonPath);
						bundleJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + jsonPath);
						bundleJson.put("file", jsonFile.getName());
						bundleJson.put("size", bundle.getSize());
						bundleJson.put("checksum", bundle.getMd5());
						bundleHash.put(bundle.getBundleid(), bundleJson);
						bundleJsonArray.add(bundleJson);
					}

					bundleidJsonArray.add(scheduledtl.getObjid());
					if (i == 0) {
						solobundleidJsonArray.add(scheduledtl.getObjid());
					}
				}
			}
			if (bundleidJsonArray.size() > 0) {
				scheduleJson.put("start_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getStarttime()));
				scheduleJson.put("bundle_ids", bundleidJsonArray);
				mainscheduleJsonArray.add(scheduleJson);
			}
		}

		// attach schedule
		for (int i = 0; i < attachscheduleList.size(); i++) {
			Schedule schedule = attachscheduleList.get(i);
			JSONObject scheduleJson = new JSONObject();
			JSONArray bundleidJsonArray = new JSONArray();
			for (Scheduledtl scheduledtl : schedule.getScheduledtls()) {
				if (scheduledtl.getObjtype().equals(Scheduledtl.ObjType_Bundle)) {
					if (bundleHash.get(scheduledtl.getObjid()) == null) {
						Bundle bundle = bundleMapper.selectByPrimaryKey("" + scheduledtl.getObjid());
						int d1 = Integer.parseInt(DateUtil.getDateStr(bundle.getStartdate(), "yyyyMMdd"));
						int d2 = Integer.parseInt(DateUtil.getDateStr(bundle.getEnddate(), "yyyyMMdd"));
						int now = Integer.parseInt(DateUtil.getDateStr(Calendar.getInstance().getTime(), "yyyyMMdd"));
						if (now < d1 || now > d2) {
							continue;
						}

						if (!bundle.getReviewflag().equals(Bundle.REVIEW_PASSED)) {
							JSONObject bundleJson = JSONObject.fromObject(bundle.getJson());
							bundle = (Bundle) JSONObject.toBean(bundleJson, Bundle.class, map);
						}
						bundleList.add(bundle);
						for (Bundle subbundle : bundle.getSubbundles()) {
							Bundle b = bundleMapper.selectByPrimaryKey("" + subbundle.getBundleid());
							if (b != null && !b.getReviewflag().equals(Page.REVIEW_PASSED)) {
								JSONObject bundleJson = JSONObject.fromObject(b.getJson());
								b = (Bundle) JSONObject.toBean(bundleJson, Bundle.class, map);
							}
							bundleList.add(b);
						}

						String jsonPath = "/bundle/" + bundle.getBundleid() + "/bundle-" + bundle.getBundleid()
								+ ".json";
						File jsonFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + jsonPath);
						if (!jsonFile.exists()) {
							bundleService.makeJsonFile("" + bundle.getBundleid());
						}
						JSONObject bundleJson = new JSONObject();
						bundleJson.put("bundle_id", bundle.getBundleid());
						bundleJson.put("url", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + jsonPath);
						bundleJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + jsonPath);
						bundleJson.put("file", jsonFile.getName());
						bundleJson.put("size", bundle.getSize());
						bundleJson.put("checksum", bundle.getMd5());
						bundleHash.put(bundle.getBundleid(), bundleJson);
						bundleJsonArray.add(bundleJson);
					}

					bundleidJsonArray.add(scheduledtl.getObjid());
				}
			}
			if (bundleidJsonArray.size() > 0) {
				scheduleJson.put("start_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getStarttime()));
				scheduleJson.put("bundle_ids", bundleidJsonArray);
				attachscheduleJsonArray.add(scheduleJson);
			}
		}

		List<Video> videoList = new ArrayList<Video>();
		List<Image> imageList = new ArrayList<Image>();
		for (Bundle b : bundleList) {
			for (Bundlezone bundlezone : b.getBundlezones()) {
				for (Bundlezonedtl bundlezonedtl : bundlezone.getBundlezonedtls()) {
					if (bundlezonedtl.getVideo() != null) {
						if (videoHash.get(bundlezonedtl.getObjid()) == null) {
							Video video = bundlezonedtl.getVideo();
							JSONObject videoJson = new JSONObject();
							videoJson.put("id", video.getVideoid());
							videoJson.put("name", video.getName());
							videoJson.put("url", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
							videoJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
							videoJson.put("file", video.getFilename());
							videoJson.put("size", video.getSize());
							videoJson.put("checksum", video.getMd5());
							videoJson.put("thumbnail",
									downloadurl + CommonConfig.CONFIG_PIXDATA_URL + video.getThumbnail());
							if (video.getRelatetype().equals("1")) {
								videoJson.put("relate_type", "video");
								videoJson.put("relate_id", video.getRelateid());
							} else if (video.getRelatetype().equals("2")) {
								videoJson.put("relate_type", "image");
								videoJson.put("relate_id", video.getRelateid());
							} else if (video.getRelatetype().equals("3")) {
								videoJson.put("relate_type", "link");
								videoJson.put("relate_url", video.getRelateurl());
							} else if (video.getRelatetype().equals("4")) {
								videoJson.put("relate_type", "apk");
								videoJson.put("relate_url", video.getRelateurl());
							}
							videoHash.put(video.getVideoid(), videoJson);
							videoJsonArray.add(videoJson);
							videoList.add(video);
						}
					} else if (bundlezonedtl.getImage() != null) {
						if (imageHash.get(bundlezonedtl.getObjid()) == null) {
							Image image = bundlezonedtl.getImage();
							JSONObject imageJson = new JSONObject();
							imageJson.put("id", image.getImageid());
							imageJson.put("name", image.getName());
							imageJson.put("url", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + image.getFilepath());
							imageJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + image.getFilepath());
							imageJson.put("file", image.getFilename());
							imageJson.put("size", image.getSize());
							imageJson.put("checksum", image.getMd5());
							imageJson.put("thumbnail",
									downloadurl + CommonConfig.CONFIG_PIXDATA_URL + image.getThumbnail());
							if (image.getRelatetype().equals("1")) {
								imageJson.put("relate_type", "video");
								imageJson.put("relate_id", image.getRelateid());
							} else if (image.getRelatetype().equals("2")) {
								imageJson.put("relate_type", "image");
								imageJson.put("relate_id", image.getRelateid());
							} else if (image.getRelatetype().equals("3")) {
								imageJson.put("relate_type", "link");
								imageJson.put("relate_url", image.getRelateurl());
							} else if (image.getRelatetype().equals("4")) {
								imageJson.put("relate_type", "apk");
								imageJson.put("relate_url", image.getRelateurl());
							}
							imageHash.put(image.getImageid(), imageJson);
							imageJsonArray.add(imageJson);
							imageList.add(image);
						}
					} else if (bundlezonedtl.getStream() != null) {
						if (streamHash.get(bundlezonedtl.getObjid()) == null) {
							Stream stream = bundlezonedtl.getStream();
							JSONObject streamJson = new JSONObject();
							streamJson.put("id", stream.getStreamid());
							streamJson.put("name", stream.getName());
							streamJson.put("url", stream.getUrl());
							streamHash.put(stream.getStreamid(), streamJson);
							streamJsonArray.add(streamJson);
						}
					} else if (bundlezonedtl.getPage() != null) {
						if (pageHash.get(bundlezonedtl.getObjid()) == null) {
							Page page = bundlezonedtl.getPage();
							String zipPath = "/page/" + page.getPageid() + "/page-" + page.getPageid() + ".zip";
							JSONObject pageJson = new JSONObject();
							pageJson.put("id", page.getPageid());
							pageJson.put("name", page.getName());
							pageJson.put("url", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + zipPath);
							pageJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + zipPath);
							pageJson.put("file", "page-" + page.getPageid() + ".zip");
							pageJson.put("size", page.getSize());
							pageJson.put("checksum", page.getMd5());
							pageJson.put("snapshot",
									downloadurl + CommonConfig.CONFIG_PIXDATA_URL + page.getSnapshot());
							pageHash.put(page.getPageid(), pageJson);
							pageJsonArray.add(pageJson);
						}
					}
				}
			}
		}

		for (Video video : videoList) {
			if (video.getRelatevideo() != null && videoHash.get(video.getRelateid()) == null) {
				JSONObject videoJson = new JSONObject();
				videoJson.put("id", video.getRelateid());
				videoJson.put("name", video.getRelatevideo().getName());
				videoJson.put("oname", video.getRelatevideo().getOname());
				videoJson.put("url", downloadurl + "/pixsigdata" + video.getRelatevideo().getFilepath());
				videoJson.put("path", "/pixsigdata" + video.getRelatevideo().getFilepath());
				videoJson.put("file", video.getRelatevideo().getFilename());
				videoJson.put("size", video.getRelatevideo().getSize());
				videoJson.put("checksum", video.getRelatevideo().getMd5());
				videoJson.put("thumbnail", downloadurl + "/pixsigdata" + video.getRelatevideo().getThumbnail());
				videoJson.put("relate_url", "");
				videoHash.put(video.getRelateid(), videoJson);
				videoJsonArray.add(videoJson);
			} else if (video.getRelateimage() != null && imageHash.get(video.getRelateid()) == null) {
				JSONObject imageJson = new JSONObject();
				imageJson.put("id", video.getRelateid());
				imageJson.put("name", video.getRelateimage().getName());
				imageJson.put("oname", video.getRelateimage().getOname());
				imageJson.put("url", downloadurl + "/pixsigdata" + video.getRelateimage().getFilepath());
				imageJson.put("path", "/pixsigdata" + video.getRelateimage().getFilepath());
				imageJson.put("file", video.getRelateimage().getFilename());
				imageJson.put("size", video.getRelateimage().getSize());
				imageJson.put("checksum", video.getRelateimage().getMd5());
				imageJson.put("thumbnail", downloadurl + "/pixsigdata" + video.getRelateimage().getThumbnail());
				imageJson.put("relate_url", "");
				imageHash.put(video.getRelateid(), imageJson);
				imageJsonArray.add(imageJson);
			}
		}
		for (Image image : imageList) {
			if (image.getRelateimage() != null && imageHash.get(image.getRelateid()) == null) {
				JSONObject imageJson = new JSONObject();
				imageJson.put("id", image.getRelateid());
				imageJson.put("name", image.getRelateimage().getName());
				imageJson.put("oname", image.getRelateimage().getOname());
				imageJson.put("url", downloadurl + "/pixsigdata" + image.getRelateimage().getFilepath());
				imageJson.put("path", "/pixsigdata" + image.getRelateimage().getFilepath());
				imageJson.put("file", image.getRelateimage().getFilename());
				imageJson.put("size", image.getRelateimage().getSize());
				imageJson.put("checksum", image.getRelateimage().getMd5());
				imageJson.put("thumbnail", downloadurl + "/pixsigdata" + image.getRelateimage().getThumbnail());
				imageJson.put("relate_url", "");
				imageHash.put(image.getRelateid(), imageJson);
				imageJsonArray.add(imageJson);
			} else if (image.getRelatevideo() != null && videoHash.get(image.getRelateid()) == null) {
				JSONObject videoJson = new JSONObject();
				videoJson.put("id", image.getRelateid());
				videoJson.put("name", image.getRelatevideo().getName());
				videoJson.put("oname", image.getRelatevideo().getOname());
				videoJson.put("url", downloadurl + "/pixsigdata" + image.getRelatevideo().getFilepath());
				videoJson.put("path", "/pixsigdata" + image.getRelatevideo().getFilepath());
				videoJson.put("file", image.getRelatevideo().getFilename());
				videoJson.put("size", image.getRelatevideo().getSize());
				videoJson.put("checksum", image.getRelatevideo().getMd5());
				videoJson.put("thumbnail", downloadurl + "/pixsigdata" + image.getRelatevideo().getThumbnail());
				videoJson.put("relate_url", "");
				videoHash.put(image.getRelateid(), videoJson);
				videoJsonArray.add(videoJson);
			}
		}

		resultJson.put("bundle_ids", solobundleidJsonArray);
		resultJson.put("schedules", mainscheduleJsonArray);
		resultJson.put("attachschedules", attachscheduleJsonArray);
		resultJson.put("bundles", bundleJsonArray);
		resultJson.put("videos", videoJsonArray);
		resultJson.put("images", imageJsonArray);
		resultJson.put("streams", streamJsonArray);
		resultJson.put("pages", pageJsonArray);
		return resultJson;
	}

	public JSONObject generatePageJson(Device device) throws Exception {
		JSONObject resultJson = new JSONObject();

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		String cdnserver = configMapper.selectValueByCode("CDNServer");
		String downloadurl = "http://" + serverip + ":" + serverport;
		if (cdnserver != null && cdnserver.trim().length() > 0) {
			downloadurl = "http://" + cdnserver;
		}
		Map<String, Class> map = new HashMap<String, Class>();
		map.put("subpages", Page.class);
		map.put("pagezones", Pagezone.class);
		map.put("pagezonedtls", Pagezonedtl.class);

		JSONArray pageJsonArray = new JSONArray();
		JSONArray videoJsonArray = new JSONArray();
		HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();
		List<Page> pageList = new ArrayList<Page>();

		Page defaultpage = pageMapper.selectByPrimaryKey("" + device.getDefaultpageid());
		if (defaultpage != null && !defaultpage.getReviewflag().equals(Page.REVIEW_PASSED)) {
			JSONObject pageJson = JSONObject.fromObject(defaultpage.getJson());
			defaultpage = (Page) JSONObject.toBean(pageJson, Page.class, map);
		}
		if (defaultpage != null) {
			pageList.add(defaultpage);
			for (Page subpage : defaultpage.getSubpages()) {
				Page p = pageMapper.selectByPrimaryKey("" + subpage.getPageid());
				if (p != null && !p.getReviewflag().equals(Page.REVIEW_PASSED)) {
					JSONObject pageJson = JSONObject.fromObject(p.getJson());
					p = (Page) JSONObject.toBean(pageJson, Page.class, map);
				}
				pageList.add(p);
			}
		} else {
			return resultJson;
		}
		String zipPath = "/page/" + device.getDefaultpageid() + "/page-" + device.getDefaultpageid() + ".zip";
		File zipFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + zipPath);
		if (zipFile.exists()) {
			JSONObject pageJson = new JSONObject();
			pageJson.put("page_id", device.getDefaultpageid());
			pageJson.put("url", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + zipPath);
			pageJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + zipPath);
			pageJson.put("file", zipFile.getName());
			pageJson.put("size", defaultpage.getSize());
			pageJson.put("checksum", defaultpage.getMd5());
			pageJsonArray.add(pageJson);
			resultJson.put("page_id", device.getDefaultpageid());
		} else {
			return resultJson;
		}

		for (Page p : pageList) {
			for (Pagezone pagezone : p.getPagezones()) {
				for (Pagezonedtl pagezonedtl : pagezone.getPagezonedtls()) {
					if (pagezonedtl.getVideo() != null) {
						if (videoHash.get(pagezonedtl.getObjid()) == null) {
							Video video = pagezonedtl.getVideo();
							JSONObject videoJson = new JSONObject();
							videoJson.put("id", video.getVideoid());
							videoJson.put("name", video.getName());
							videoJson.put("url", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
							videoJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
							videoJson.put("file", video.getFilename());
							videoJson.put("size", video.getSize());
							videoJson.put("checksum", video.getMd5());
							videoJson.put("thumbnail",
									downloadurl + CommonConfig.CONFIG_PIXDATA_URL + video.getThumbnail());
							videoHash.put(video.getVideoid(), videoJson);
							videoJsonArray.add(videoJson);
						}
					}
				}
			}
		}
		resultJson.put("pages", pageJsonArray);
		resultJson.put("videos", videoJsonArray);
		return resultJson;
	}

	public JSONObject generateAllPagesJson(Device device) throws Exception {
		JSONObject resultJson = new JSONObject();

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		String cdnserver = configMapper.selectValueByCode("CDNServer");
		String downloadurl = "http://" + serverip + ":" + serverport;
		if (cdnserver != null && cdnserver.trim().length() > 0) {
			downloadurl = "http://" + cdnserver;
		}
		Map<String, Class> map = new HashMap<String, Class>();
		map.put("subpages", Page.class);
		map.put("pagezones", Pagezone.class);
		map.put("pagezonedtls", Pagezonedtl.class);

		JSONArray pageJsonArray = new JSONArray();
		JSONArray videoJsonArray = new JSONArray();
		HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();
		List<Page> pageList = new ArrayList<Page>();

		List<Page> allpageList = pageMapper.selectList("" + device.getOrgid(), null, null, null, null, "1", null, null,
				null);

		for (Page page : allpageList) {
			page = pageMapper.selectByPrimaryKey("" + page.getPageid());
			if (page != null && !page.getReviewflag().equals(Page.REVIEW_PASSED)) {
				JSONObject pageJson = JSONObject.fromObject(page.getJson());
				page = (Page) JSONObject.toBean(pageJson, Page.class, map);
			}
			if (page != null) {
				pageList.add(page);
				for (Page subpage : page.getSubpages()) {
					Page p = pageMapper.selectByPrimaryKey("" + subpage.getPageid());
					if (p != null && !p.getReviewflag().equals(Page.REVIEW_PASSED)) {
						JSONObject pageJson = JSONObject.fromObject(p.getJson());
						p = (Page) JSONObject.toBean(pageJson, Page.class, map);
					}
					pageList.add(p);
				}
				String zipPath = "/page/" + page.getPageid() + "/page-" + page.getPageid() + ".zip";
				File zipFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + zipPath);
				if (zipFile.exists()) {
					JSONObject pageJson = new JSONObject();
					pageJson.put("page_id", page.getPageid());
					pageJson.put("name", page.getName());
					pageJson.put("url", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + zipPath);
					pageJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + zipPath);
					pageJson.put("file", zipFile.getName());
					pageJson.put("size", page.getSize());
					pageJson.put("checksum", page.getMd5());
					pageJsonArray.add(pageJson);
					resultJson.put("page_id", page.getPageid());
				}
			}
		}

		for (Page p : pageList) {
			for (Pagezone pagezone : p.getPagezones()) {
				for (Pagezonedtl pagezonedtl : pagezone.getPagezonedtls()) {
					if (pagezonedtl.getVideo() != null) {
						if (videoHash.get(pagezonedtl.getObjid()) == null) {
							Video video = pagezonedtl.getVideo();
							JSONObject videoJson = new JSONObject();
							videoJson.put("id", video.getVideoid());
							videoJson.put("name", video.getName());
							videoJson.put("url", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
							videoJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
							videoJson.put("file", video.getFilename());
							videoJson.put("size", video.getSize());
							videoJson.put("checksum", video.getMd5());
							videoJson.put("thumbnail",
									downloadurl + CommonConfig.CONFIG_PIXDATA_URL + video.getThumbnail());
							videoHash.put(video.getVideoid(), videoJson);
							videoJsonArray.add(videoJson);
						}
					}
				}
			}
		}
		resultJson.put("pages", pageJsonArray);
		resultJson.put("videos", videoJsonArray);
		return resultJson;
	}

	public JSONObject generateAllIntentsJson(Device device) throws Exception {
		JSONObject resultJson = new JSONObject();

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		String cdnserver = configMapper.selectValueByCode("CDNServer");
		String downloadurl = "http://" + serverip + ":" + serverport;
		if (cdnserver != null && cdnserver.trim().length() > 0) {
			downloadurl = "http://" + cdnserver;
		}
		Map<String, Class> map = new HashMap<String, Class>();
		map.put("subpages", Page.class);
		map.put("pagezones", Pagezone.class);
		map.put("pagezonedtls", Pagezonedtl.class);

		JSONArray pageJsonArray = new JSONArray();
		JSONArray videoJsonArray = new JSONArray();
		HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();
		List<Page> pageList = new ArrayList<Page>();

		List<Page> allpageList = pageMapper.selectList("" + device.getOrgid(), null, null, null, null, "1", null, null,
				null);

		for (Page page : allpageList) {
			page = pageMapper.selectByPrimaryKey("" + page.getPageid());
			if (page != null && !page.getReviewflag().equals(Page.REVIEW_PASSED)) {
				JSONObject pageJson = JSONObject.fromObject(page.getJson());
				page = (Page) JSONObject.toBean(pageJson, Page.class, map);
			}
			if (page != null) {
				pageList.add(page);
				for (Page subpage : page.getSubpages()) {
					Page p = pageMapper.selectByPrimaryKey("" + subpage.getPageid());
					if (p != null && !p.getReviewflag().equals(Page.REVIEW_PASSED)) {
						JSONObject pageJson = JSONObject.fromObject(p.getJson());
						p = (Page) JSONObject.toBean(pageJson, Page.class, map);
					}
					pageList.add(p);
				}
				String zipPath = "/page/" + page.getPageid() + "/page-" + page.getPageid() + ".zip";
				File zipFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + zipPath);
				if (zipFile.exists()) {
					JSONObject pageJson = new JSONObject();
					pageJson.put("page_id", page.getPageid());
					pageJson.put("key", page.getName());
					pageJson.put("url", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + zipPath);
					pageJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + zipPath);
					pageJson.put("file", zipFile.getName());
					pageJson.put("size", page.getSize());
					pageJson.put("checksum", page.getMd5());
					pageJsonArray.add(pageJson);
					resultJson.put("page_id", page.getPageid());
				}
			}
		}

		List<Video> allvideoList = videoMapper.selectList("" + device.getOrgid(), null, null, null, null, null, null,
				null, null, null);
		for (Video video : allvideoList) {
			if (video.getTags() != null && video.getTags().length() > 0) {
				JSONObject videoJson = new JSONObject();
				videoJson.put("id", video.getVideoid());
				videoJson.put("name", video.getName());
				videoJson.put("key", video.getTags());
				videoJson.put("url", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
				videoJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
				videoJson.put("file", video.getFilename());
				videoJson.put("size", video.getSize());
				videoJson.put("checksum", video.getMd5());
				videoJson.put("thumbnail", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + video.getThumbnail());
				videoJsonArray.add(videoJson);
			}
		}
		/*
		 * for (Page p : pageList) { for (Pagezone pagezone : p.getPagezones())
		 * { for (Pagezonedtl pagezonedtl : pagezone.getPagezonedtls()) { if
		 * (pagezonedtl.getVideo() != null) { if
		 * (videoHash.get(pagezonedtl.getObjid()) == null) { Video video =
		 * pagezonedtl.getVideo(); JSONObject videoJson = new JSONObject();
		 * videoJson.put("id", video.getVideoid()); videoJson.put("name",
		 * video.getName()); videoJson.put("url", downloadurl +
		 * CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
		 * videoJson.put("path", CommonConfig.CONFIG_PIXDATA_URL +
		 * video.getFilepath()); videoJson.put("file", video.getFilename());
		 * videoJson.put("size", video.getSize()); videoJson.put("checksum",
		 * video.getMd5()); videoJson.put("thumbnail", downloadurl +
		 * CommonConfig.CONFIG_PIXDATA_URL + video.getThumbnail());
		 * videoHash.put(video.getVideoid(), videoJson);
		 * videoJsonArray.add(videoJson); } } } } }
		 */

		resultJson.put("pages", pageJsonArray);
		resultJson.put("videos", videoJsonArray);
		return resultJson;
	}

	public JSONObject generateMedialistJson(Device device) throws Exception {
		JSONObject resultJson = new JSONObject();

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		String cdnserver = configMapper.selectValueByCode("CDNServer");
		String downloadurl = "http://" + serverip + ":" + serverport;
		if (cdnserver != null && cdnserver.trim().length() > 0) {
			downloadurl = "http://" + cdnserver;
		}

		JSONArray medialistdtlJsonArray = new JSONArray();
		JSONArray videoJsonArray = new JSONArray();
		HashMap<Integer, Video> videoHash = new HashMap<Integer, Video>();

		List<Medialistdtl> medialistdtls = medialistdtlMapper.selectList("" + device.getDefaultmedialistid());
		for (Medialistdtl medialistdtl : medialistdtls) {
			JSONObject medialistdtlJson = new JSONObject();
			if (medialistdtl.getVideo() != null) {
				if (videoHash.get(medialistdtl.getObjid()) == null) {
					Video video = medialistdtl.getVideo();
					videoHash.put(medialistdtl.getObjid(), video);
					JSONObject videoJson = new JSONObject();
					videoJson.put("id", video.getVideoid());
					videoJson.put("name", video.getName());
					videoJson.put("oname", video.getOname());
					videoJson.put("duration", video.getDuration());
					videoJson.put("url", downloadurl + "/pixsigdata" + video.getFilepath());
					videoJson.put("path", "/pixsigdata" + video.getFilepath());
					videoJson.put("file", video.getFilename());
					videoJson.put("size", video.getSize());
					videoJson.put("checksum", video.getMd5());
					videoJson.put("thumbnail", downloadurl + "/pixsigdata" + video.getThumbnail());
					videoJsonArray.add(videoJson);
				}
				medialistdtlJson.put("id", medialistdtl.getObjid());
				medialistdtlJson.put("type", "video");
				medialistdtlJsonArray.add(medialistdtlJson);
			}
		}

		resultJson.put("playlist_dtls", medialistdtlJsonArray);
		resultJson.put("videos", videoJsonArray);
		return resultJson;
	}

	public JSONObject generateAdplanJson(Device device) throws Exception {
		JSONObject resultJson = new JSONObject();

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		String cdnserver = configMapper.selectValueByCode("CDNServer");
		String downloadurl = "http://" + serverip + ":" + serverport;
		if (cdnserver != null && cdnserver.trim().length() > 0) {
			downloadurl = "http://" + cdnserver;
		}

		JSONArray adplansJsonArray = new JSONArray();
		JSONArray videoJsonArray = new JSONArray();
		JSONArray imageJsonArray = new JSONArray();
		HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> imageHash = new HashMap<Integer, JSONObject>();
		List<Video> videoList = new ArrayList<Video>();
		List<Image> imageList = new ArrayList<Image>();

		List<Adplan> adplans = adplanMapper.selectByDevicegroup("" + device.getDevicegroupid());
		for (Adplan adplan : adplans) {
			List<Adplandtl> adplandtls = adplandtlMapper.selectActiveList("" + adplan.getAdplanid());
			JSONObject adplanJson = new JSONObject();
			adplanJson.put("advert_place", adplan.getAdplace());
			JSONArray adplandtlsJsonArray = new JSONArray();
			if (adplandtls.size() == 0) {
				adplanJson.put("advert_plandtls", adplandtlsJsonArray);
				adplansJsonArray.add(adplanJson);
				continue;
			}
			int[] counterArray = new int[adplandtls.size()];
			for (int i = 0; i < adplandtls.size(); i++) {
				Adplandtl adplandtl = adplandtls.get(i);
				counterArray[i] = adplandtl.getTimes();

				if (adplandtl.getVideo() != null) {
					if (videoHash.get(adplandtl.getAdid()) == null) {
						Video video = adplandtl.getVideo();
						JSONObject videoJson = new JSONObject();
						videoJson.put("id", video.getVideoid());
						videoJson.put("name", video.getName());
						videoJson.put("url", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
						videoJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
						videoJson.put("file", video.getFilename());
						videoJson.put("size", video.getSize());
						videoJson.put("checksum", video.getMd5());
						videoJson.put("thumbnail",
								downloadurl + CommonConfig.CONFIG_PIXDATA_URL + video.getThumbnail());
						if (video.getRelateurl() != null && video.getRelateurl().length() > 0) {
							videoJson.put("relate_url", video.getRelateurl());
						} else {
							videoJson.put("relate_type", "image");
							videoJson.put("relate_id", video.getRelateid());
						}
						videoHash.put(video.getVideoid(), videoJson);
						videoJsonArray.add(videoJson);
						videoList.add(video);
					}
				} else if (imageHash.get(adplandtl.getAdid()) == null) {
					Image image = adplandtl.getImage();
					JSONObject imageJson = new JSONObject();
					imageJson.put("id", image.getImageid());
					imageJson.put("name", image.getName());
					imageJson.put("url", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + image.getFilepath());
					imageJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + image.getFilepath());
					imageJson.put("file", image.getFilename());
					imageJson.put("size", image.getSize());
					imageJson.put("checksum", image.getMd5());
					imageJson.put("thumbnail", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + image.getThumbnail());
					if (image.getRelatetype().equals("2")) {
						imageJson.put("relate_type", "image");
						imageJson.put("relate_id", image.getRelateid());
					} else if (image.getRelatetype().equals("3")) {
						imageJson.put("relate_type", "link");
						imageJson.put("relate_url", image.getRelateurl());
					} else if (image.getRelatetype().equals("4")) {
						imageJson.put("relate_type", "apk");
						imageJson.put("relate_url", image.getRelateurl());
					}
					imageHash.put(image.getImageid(), imageJson);
					imageJsonArray.add(imageJson);
					imageList.add(image);
				}
			}

			while (counterArray[0] > 0) {
				for (int i = 0; i < adplandtls.size(); i++) {
					if (counterArray[i] <= 0) {
						break;
					}
					Adplandtl adplandtl = adplandtls.get(i);
					JSONObject adplandtlJson = new JSONObject();
					adplandtlJson.put("id", adplandtl.getAdid());
					if (adplandtl.getAdtype().equals("1")) {
						adplandtlJson.put("type", "video");
					} else {
						adplandtlJson.put("type", "image");
					}
					adplandtlsJsonArray.add(adplandtlJson);
					counterArray[i]--;
				}
			}
			adplanJson.put("advert_plandtls", adplandtlsJsonArray);
			adplansJsonArray.add(adplanJson);
		}

		for (Video video : videoList) {
			if (video.getRelateimage() != null && imageHash.get(video.getRelateid()) == null) {
				JSONObject imageJson = new JSONObject();
				imageJson.put("id", video.getRelateid());
				imageJson.put("name", video.getRelateimage().getName());
				imageJson.put("oname", video.getRelateimage().getOname());
				imageJson.put("url", downloadurl + "/pixsigdata" + video.getRelateimage().getFilepath());
				imageJson.put("path", "/pixsigdata" + video.getRelateimage().getFilepath());
				imageJson.put("file", video.getRelateimage().getFilename());
				imageJson.put("size", video.getRelateimage().getSize());
				imageJson.put("checksum", video.getRelateimage().getMd5());
				imageJson.put("thumbnail", downloadurl + "/pixsigdata" + video.getRelateimage().getThumbnail());
				imageJson.put("relate_url", "");
				imageHash.put(video.getRelateid(), imageJson);
				imageJsonArray.add(imageJson);
			}
		}
		for (Image image : imageList) {
			if (image.getRelateimage() != null && imageHash.get(image.getRelateid()) == null) {
				JSONObject imageJson = new JSONObject();
				imageJson.put("id", image.getRelateid());
				imageJson.put("name", image.getRelateimage().getName());
				imageJson.put("oname", image.getRelateimage().getOname());
				imageJson.put("url", downloadurl + "/pixsigdata" + image.getRelateimage().getFilepath());
				imageJson.put("path", "/pixsigdata" + image.getRelateimage().getFilepath());
				imageJson.put("file", image.getRelateimage().getFilename());
				imageJson.put("size", image.getRelateimage().getSize());
				imageJson.put("checksum", image.getRelateimage().getMd5());
				imageJson.put("thumbnail", downloadurl + "/pixsigdata" + image.getRelateimage().getThumbnail());
				imageJson.put("relate_url", "");
				imageHash.put(image.getRelateid(), imageJson);
				imageJsonArray.add(imageJson);
			}
		}

		resultJson.put("advert_plans", adplansJsonArray);
		resultJson.put("videos", videoJsonArray);
		resultJson.put("images", imageJsonArray);
		return resultJson;
	}

}
