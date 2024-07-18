package com.broadvideo.pixsign.service;

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

import com.broadvideo.pixsign.common.CommonConfig;
import com.broadvideo.pixsign.common.CommonConstants;
import com.broadvideo.pixsign.domain.Audio;
import com.broadvideo.pixsign.domain.Bundle;
import com.broadvideo.pixsign.domain.Bundlezone;
import com.broadvideo.pixsign.domain.Bundlezonedtl;
import com.broadvideo.pixsign.domain.Device;
import com.broadvideo.pixsign.domain.Devicegroup;
import com.broadvideo.pixsign.domain.Image;
import com.broadvideo.pixsign.domain.Msgevent;
import com.broadvideo.pixsign.domain.Org;
import com.broadvideo.pixsign.domain.Page;
import com.broadvideo.pixsign.domain.Pagezone;
import com.broadvideo.pixsign.domain.Pagezonedtl;
import com.broadvideo.pixsign.domain.Plan;
import com.broadvideo.pixsign.domain.Planbind;
import com.broadvideo.pixsign.domain.Plandtl;
import com.broadvideo.pixsign.domain.Schedule;
import com.broadvideo.pixsign.domain.Scheduledtl;
import com.broadvideo.pixsign.domain.Stream;
import com.broadvideo.pixsign.domain.Video;
import com.broadvideo.pixsign.exception.PixException;
import com.broadvideo.pixsign.persistence.BundleMapper;
import com.broadvideo.pixsign.persistence.ConfigMapper;
import com.broadvideo.pixsign.persistence.DeviceMapper;
import com.broadvideo.pixsign.persistence.DevicegroupMapper;
import com.broadvideo.pixsign.persistence.MsgeventMapper;
import com.broadvideo.pixsign.persistence.OrgMapper;
import com.broadvideo.pixsign.persistence.PageMapper;
import com.broadvideo.pixsign.persistence.PlanMapper;
import com.broadvideo.pixsign.persistence.ScheduleMapper;
import com.broadvideo.pixsign.persistence.VideoMapper;
import com.broadvideo.pixsign.util.CommonUtil;
import com.broadvideo.pixsign.util.DateUtil;

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
	private PlanMapper planMapper;
	@Autowired
	private VideoMapper videoMapper;

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
		
		/*
		String maxdetail = org.getMaxdetail();
		String[] maxs = maxdetail.split(",");
		int t = Integer.parseInt(device.getType());
		int max = maxs.length > t - 1 ? Integer.parseInt(maxs[t - 1]) : 0;
		int currentTypeCount = deviceMapper.selectCountByType("" + device.getOrgid(), device.getType(), null);
		if (currentTypeCount >= max) {
			throw new PixException(3002,
					"Device has reached the upper limit, type=" + device.getType() + ", max=" + max);
		}
		*/

		if (device.getType().equals(Device.Type_3DFanSolo) || device.getType().equals(Device.Type_3DFanWall)
				|| device.getType().equals(Device.Type_Cloudia)) {
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
	}

	public JSONObject generateBundleScheduleJson(Device device) throws Exception {
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
		JSONArray audioJsonArray = new JSONArray();
		JSONArray streamJsonArray = new JSONArray();
		JSONArray pageJsonArray = new JSONArray();
		HashMap<Integer, JSONObject> bundleHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> imageHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> audioHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> streamHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> pageHash = new HashMap<Integer, JSONObject>();

		List<Schedule> mainscheduleList = new ArrayList<Schedule>();
		List<Schedule> attachscheduleList = new ArrayList<Schedule>();
		List<Bundle> bundleList = new ArrayList<Bundle>();

		String scheduleType = "";
		Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
		if (org.getBundleplanflag().equals("0")) {
			scheduleType = "1";
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
		} else if (org.getBundleplanflag().equals("1")) {
			scheduleType = "1";
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

			if (device.getDevicegroupid().intValue() == 0) {
				attachscheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Solo, "1",
						Schedule.BindType_Device, "" + device.getDeviceid(), Schedule.PlayMode_Daily);
			} else {
				attachscheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Solo, "1",
						Schedule.BindType_Devicegroup, "" + device.getDevicegroupid(), Schedule.PlayMode_Daily);
			}
		} else if (org.getBundleplanflag().equals("2")) {
			// 按日期排schedule
			scheduleType = "2";

			if (device.getDevicegroupid().intValue() == 0) {
				attachscheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Solo, "1",
						Schedule.BindType_Device, "" + device.getDeviceid(), Schedule.PlayMode_Daily);
			} else {
				attachscheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Solo, "1",
						Schedule.BindType_Devicegroup, "" + device.getDevicegroupid(), Schedule.PlayMode_Daily);
			}
		}

		// main schedule
		if (org.getBundleplanflag().equals("2")) {
			// 按日期排schedule
			List<Plan> planList;
			if (device.getDevicegroupid().intValue() == 0) {
				planList = planMapper.selectListByBind(Plan.PlanType_Bundle, Planbind.BindType_Device,
						"" + device.getDeviceid());
			} else {
				planList = planMapper.selectListByBind(Plan.PlanType_Bundle, Planbind.BindType_Devicegroup,
						"" + device.getDevicegroupid());
			}
			for (Plan plan : planList) {
				JSONObject planJson = new JSONObject();
				planJson.put("schedule_id", plan.getPlanid());
				planJson.put("priority", plan.getPriority());
				planJson.put("play_mode", "daily");
				planJson.put("start_date",
						new SimpleDateFormat(CommonConstants.DateFormat_Date).format(plan.getStartdate()));
				planJson.put("end_date",
						new SimpleDateFormat(CommonConstants.DateFormat_Date).format(plan.getEnddate()));
				planJson.put("start_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(plan.getStarttime()));
				planJson.put("end_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(plan.getEndtime()));

				JSONArray plandtlJsonArray = new JSONArray();
				for (Plandtl plandtl : plan.getPlandtls()) {
					if (plandtl.getObjtype().equals(Plandtl.ObjType_Bundle)) {
						JSONObject plandtlJson = new JSONObject();
						plandtlJson.put("scheduledtl_id", plandtl.getPlandtlid());
						plandtlJson.put("media_type", "bundle");
						plandtlJson.put("media_id", plandtl.getObjid());
						plandtlJsonArray.add(plandtlJson);

						if (bundleHash.get(plandtl.getObjid()) == null) {
							Bundle bundle = bundleMapper.selectByPrimaryKey("" + plandtl.getObjid());
							int d1 = Integer.parseInt(DateUtil.getDateStr(bundle.getStartdate(), "yyyyMMdd"));
							int d2 = Integer.parseInt(DateUtil.getDateStr(bundle.getEnddate(), "yyyyMMdd"));
							int now = Integer
									.parseInt(DateUtil.getDateStr(Calendar.getInstance().getTime(), "yyyyMMdd"));
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
					}

				}
				planJson.put("scheduledtls", plandtlJsonArray);
				mainscheduleJsonArray.add(planJson);
			}

		} else {
			// 旧模式
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
							int now = Integer
									.parseInt(DateUtil.getDateStr(Calendar.getInstance().getTime(), "yyyyMMdd"));
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
					} else if (bundlezonedtl.getAudio() != null) {
						if (audioHash.get(bundlezonedtl.getObjid()) == null) {
							Audio audio = bundlezonedtl.getAudio();
							JSONObject audioJson = new JSONObject();
							audioJson.put("id", audio.getAudioid());
							audioJson.put("name", audio.getName());
							audioJson.put("url", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + audio.getFilepath());
							audioJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + audio.getFilepath());
							audioJson.put("file", audio.getFilename());
							audioJson.put("size", audio.getSize());
							audioJson.put("checksum", audio.getMd5());
							audioHash.put(audio.getAudioid(), audioJson);
							audioJsonArray.add(audioJson);
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
				videoJson.put("url", downloadurl + "/pixsigndata" + video.getRelatevideo().getFilepath());
				videoJson.put("path", "/pixsigndata" + video.getRelatevideo().getFilepath());
				videoJson.put("file", video.getRelatevideo().getFilename());
				videoJson.put("size", video.getRelatevideo().getSize());
				videoJson.put("checksum", video.getRelatevideo().getMd5());
				videoJson.put("thumbnail", downloadurl + "/pixsigndata" + video.getRelatevideo().getThumbnail());
				videoJson.put("relate_url", "");
				videoHash.put(video.getRelateid(), videoJson);
				videoJsonArray.add(videoJson);
			} else if (video.getRelateimage() != null && imageHash.get(video.getRelateid()) == null) {
				JSONObject imageJson = new JSONObject();
				imageJson.put("id", video.getRelateid());
				imageJson.put("name", video.getRelateimage().getName());
				imageJson.put("oname", video.getRelateimage().getOname());
				imageJson.put("url", downloadurl + "/pixsigndata" + video.getRelateimage().getFilepath());
				imageJson.put("path", "/pixsigndata" + video.getRelateimage().getFilepath());
				imageJson.put("file", video.getRelateimage().getFilename());
				imageJson.put("size", video.getRelateimage().getSize());
				imageJson.put("checksum", video.getRelateimage().getMd5());
				imageJson.put("thumbnail", downloadurl + "/pixsigndata" + video.getRelateimage().getThumbnail());
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
				imageJson.put("url", downloadurl + "/pixsigndata" + image.getRelateimage().getFilepath());
				imageJson.put("path", "/pixsigndata" + image.getRelateimage().getFilepath());
				imageJson.put("file", image.getRelateimage().getFilename());
				imageJson.put("size", image.getRelateimage().getSize());
				imageJson.put("checksum", image.getRelateimage().getMd5());
				imageJson.put("thumbnail", downloadurl + "/pixsigndata" + image.getRelateimage().getThumbnail());
				imageJson.put("relate_url", "");
				imageHash.put(image.getRelateid(), imageJson);
				imageJsonArray.add(imageJson);
			} else if (image.getRelatevideo() != null && videoHash.get(image.getRelateid()) == null) {
				JSONObject videoJson = new JSONObject();
				videoJson.put("id", image.getRelateid());
				videoJson.put("name", image.getRelatevideo().getName());
				videoJson.put("oname", image.getRelatevideo().getOname());
				videoJson.put("url", downloadurl + "/pixsigndata" + image.getRelatevideo().getFilepath());
				videoJson.put("path", "/pixsigndata" + image.getRelatevideo().getFilepath());
				videoJson.put("file", image.getRelatevideo().getFilename());
				videoJson.put("size", image.getRelatevideo().getSize());
				videoJson.put("checksum", image.getRelatevideo().getMd5());
				videoJson.put("thumbnail", downloadurl + "/pixsigndata" + image.getRelatevideo().getThumbnail());
				videoJson.put("relate_url", "");
				videoHash.put(image.getRelateid(), videoJson);
				videoJsonArray.add(videoJson);
			}
		}

		// resultJson.put("bundle_ids", solobundleidJsonArray);
		resultJson.put("schedule_type", scheduleType);
		resultJson.put("schedules", mainscheduleJsonArray);
		resultJson.put("attachschedules", attachscheduleJsonArray);
		resultJson.put("bundles", bundleJsonArray);
		resultJson.put("videos", videoJsonArray);
		resultJson.put("images", imageJsonArray);
		resultJson.put("audios", audioJsonArray);
		resultJson.put("streams", streamJsonArray);
		resultJson.put("pages", pageJsonArray);
		return resultJson;
	}

	public JSONObject generatePageScheduleJson(Device device) throws Exception {
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
		 * for (Page p : pageList) { for (Pagezone pagezone : p.getPagezones()) { for
		 * (Pagezonedtl pagezonedtl : pagezone.getPagezonedtls()) { if
		 * (pagezonedtl.getVideo() != null) { if (videoHash.get(pagezonedtl.getObjid())
		 * == null) { Video video = pagezonedtl.getVideo(); JSONObject videoJson = new
		 * JSONObject(); videoJson.put("id", video.getVideoid()); videoJson.put("name",
		 * video.getName()); videoJson.put("url", downloadurl +
		 * CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath()); videoJson.put("path",
		 * CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath()); videoJson.put("file",
		 * video.getFilename()); videoJson.put("size", video.getSize());
		 * videoJson.put("checksum", video.getMd5()); videoJson.put("thumbnail",
		 * downloadurl + CommonConfig.CONFIG_PIXDATA_URL + video.getThumbnail());
		 * videoHash.put(video.getVideoid(), videoJson); videoJsonArray.add(videoJson);
		 * } } } } }
		 */

		resultJson.put("pages", pageJsonArray);
		resultJson.put("videos", videoJsonArray);
		return resultJson;
	}

}
