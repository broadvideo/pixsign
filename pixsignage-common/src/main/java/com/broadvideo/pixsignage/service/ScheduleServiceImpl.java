package com.broadvideo.pixsignage.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Bundle;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Schedule;
import com.broadvideo.pixsignage.domain.Scheduledtl;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.persistence.ScheduleMapper;
import com.broadvideo.pixsignage.persistence.ScheduledtlMapper;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.DateUtil;
import com.ibm.icu.util.Calendar;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service("scheduleService")
public class ScheduleServiceImpl implements ScheduleService {

	@Autowired
	private ScheduleMapper scheduleMapper;
	@Autowired
	private ScheduledtlMapper scheduledtlMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private OrgMapper orgMapper;

	@Autowired
	private BundleService bundleService;
	@Autowired
	private DevicefileService devicefileService;

	public List<Schedule> selectList(String scheduletype, String attachflag, String bindtype, String bindid,
			String playmode) {
		return scheduleMapper.selectList(scheduletype, attachflag, bindtype, bindid, playmode);
	}

	public List<HashMap<String, Object>> selectBindListByObj(String objtype, String objid) {
		return scheduleMapper.selectBindListByObj(objtype, objid);
	}

	@Transactional
	public void batch(String scheduletype, String attachflag, String bindtype, String bindid, Schedule[] schedules) {
		scheduledtlMapper.deleteByDtl(scheduletype, attachflag, bindtype, bindid, null, null);
		scheduleMapper.deleteByDtl(scheduletype, attachflag, bindtype, bindid, null, null);
		for (int i = 0; i < schedules.length; i++) {
			scheduleMapper.insertSelective(schedules[i]);
			List<Scheduledtl> scheduledtls = schedules[i].getScheduledtls();
			for (Scheduledtl scheduledtl : scheduledtls) {
				scheduledtl.setScheduleid(schedules[i].getScheduleid());
				scheduledtlMapper.insertSelective(scheduledtl);
			}
		}
		devicefileService.refreshDevicefiles(bindtype, bindid);
	}

	public JSONObject generateDeviceBundleScheduleJson(String deviceid) {
		List<Schedule> scheduleList = new ArrayList<Schedule>();
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());

		if (org.getBundleplanflag().equals("1") && device.getDefaultbundle() != null) {
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
			scheduledtl.setObjid(device.getDefaultbundleid());
			scheduledtl.setDuration(0);
			List<Scheduledtl> scheduledtls = new ArrayList<Scheduledtl>();
			scheduledtls.add(scheduledtl);
			schedule.setScheduledtls(scheduledtls);
			scheduleList.add(schedule);
		} else if (org.getBundleplanflag().equals("0")) {
			if (device.getDevicegroupid().intValue() == 0) {
				scheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Solo, "0", Schedule.BindType_Device,
						deviceid, Schedule.PlayMode_Daily);
			} else {
				scheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Solo, "0", Schedule.BindType_Devicegroup,
						"" + device.getDevicegroupid(), Schedule.PlayMode_Daily);
			}
		}

		List<Integer> bundleids = new ArrayList<Integer>();

		JSONArray scheduleJsonArray = new JSONArray();
		// generate final json
		for (Schedule schedule : scheduleList) {
			JSONObject scheduleJson = new JSONObject();
			scheduleJson.put("playmode", "daily");
			scheduleJson.put("start_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getStarttime()));
			JSONArray bundleidJsonArray = new JSONArray();
			for (Scheduledtl scheduledtl : schedule.getScheduledtls()) {
				if (scheduledtl.getObjtype().equals(Scheduledtl.ObjType_Bundle)) {
					Bundle bundle = bundleService.selectMiniByPrimaryKey("" + scheduledtl.getObjid());
					int d1 = Integer.parseInt(DateUtil.getDateStr(bundle.getStartdate(), "yyyyMMdd"));
					int d2 = Integer.parseInt(DateUtil.getDateStr(bundle.getEnddate(), "yyyyMMdd"));
					int now = Integer.parseInt(DateUtil.getDateStr(Calendar.getInstance().getTime(), "yyyyMMdd"));
					if (now >= d1 && now <= d2) {
						bundleidJsonArray.add(scheduledtl.getObjid());
						bundleids.add(scheduledtl.getObjid());
					}
				}
			}
			if (bundleidJsonArray.size() > 0) {
				scheduleJson.put("bundles", bundleidJsonArray);
				scheduleJsonArray.add(scheduleJson);
			}
		}

		JSONObject responseJson = new JSONObject();
		responseJson.put("bundle_schedules", scheduleJsonArray);
		responseJson.put("bundles", bundleService.generateBundleJsonArray(bundleids));

		return responseJson;
	}

	public JSONObject generateDevicegroupBundleScheduleJson(String devicegroupid) {
		List<Schedule> scheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Solo, "0",
				Schedule.BindType_Devicegroup, devicegroupid, Schedule.PlayMode_Daily);
		List<Integer> bundleids = new ArrayList<Integer>();

		JSONArray scheduleJsonArray = new JSONArray();
		// generate final json
		for (Schedule schedule : scheduleList) {
			JSONObject scheduleJson = new JSONObject();
			scheduleJson.put("playmode", "daily");
			scheduleJson.put("start_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getStarttime()));
			JSONArray bundleidJsonArray = new JSONArray();
			for (Scheduledtl scheduledtl : schedule.getScheduledtls()) {
				if (scheduledtl.getObjtype().equals(Scheduledtl.ObjType_Bundle)) {
					bundleidJsonArray.add(scheduledtl.getObjid());
					bundleids.add(scheduledtl.getObjid());
				}
			}
			scheduleJson.put("bundles", bundleidJsonArray);
			scheduleJsonArray.add(scheduleJson);
		}

		JSONObject responseJson = new JSONObject();
		responseJson.put("bundle_schedules", scheduleJsonArray);
		responseJson.put("bundles", bundleService.generateBundleJsonArray(bundleids));

		return responseJson;
	}

	public JSONObject generateScheduleJson(String deviceid) {
		List<Schedule> scheduleList = new ArrayList<Schedule>();
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());

		if (org.getBundleplanflag().equals("1") && device.getDefaultbundle() != null) {
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
			scheduledtl.setObjid(device.getDefaultbundleid());
			scheduledtl.setDuration(0);
			List<Scheduledtl> scheduledtls = new ArrayList<Scheduledtl>();
			scheduledtls.add(scheduledtl);
			schedule.setScheduledtls(scheduledtls);
			scheduleList.add(schedule);
		} else if (org.getBundleplanflag().equals("0")) {
			if (device.getDevicegroupid().intValue() == 0) {
				scheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Solo, "0", Schedule.BindType_Device,
						deviceid, Schedule.PlayMode_Daily);
			} else {
				scheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Solo, "0", Schedule.BindType_Devicegroup,
						"" + device.getDevicegroupid(), Schedule.PlayMode_Daily);
			}
		}

		List<Integer> bundleids = new ArrayList<Integer>();

		JSONArray scheduleJsonArray = new JSONArray();
		// generate final json
		for (Schedule schedule : scheduleList) {
			JSONObject scheduleJson = new JSONObject();
			scheduleJson.put("schedule_id", schedule.getScheduleid());
			scheduleJson.put("playmode", "daily");
			scheduleJson.put("start_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getStarttime()));
			if (schedule.getEndtime() != null) {
				scheduleJson.put("end_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getEndtime()));
			}
			JSONArray scheduledtlJsonArray = new JSONArray();
			for (Scheduledtl scheduledtl : schedule.getScheduledtls()) {
				if (scheduledtl.getObjtype().equals(Scheduledtl.ObjType_Bundle)) {
					JSONObject scheduledtlJson = new JSONObject();
					scheduledtlJson.put("scheduledtl_id", scheduledtl.getScheduledtlid());
					scheduledtlJson.put("media_type", "bundle");
					scheduledtlJson.put("media_id", scheduledtl.getObjid());
					scheduledtlJsonArray.add(scheduledtlJson);
					bundleids.add(scheduledtl.getObjid());
				} else {
					continue;
				}
			}
			scheduleJson.put("scheduledtls", scheduledtlJsonArray);
			scheduleJsonArray.add(scheduleJson);
		}

		JSONObject responseJson = new JSONObject();
		responseJson.put("schedules", scheduleJsonArray);
		responseJson.put("multi_schedules", new JSONArray());
		responseJson.put("bundles", bundleService.generateBundleJsonArray(bundleids));

		return responseJson;
	}
}
