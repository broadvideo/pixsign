package com.broadvideo.pixsignage.service;

import java.util.HashMap;
import java.util.List;

import com.broadvideo.pixsignage.domain.Schedule;

import net.sf.json.JSONObject;

public interface ScheduleService {
	public List<Schedule> selectList(String scheduletype, String attachflag, String bindtype, String bindid,
			String playmode);

	public List<HashMap<String, Object>> selectBindListByObj(String objtype, String objid);

	public void batch(String scheduletype, String attachflag, String bindtype, String bindid, Schedule[] schedules);

	public JSONObject generateDeviceBundleScheduleJson(String deviceid);

	public JSONObject generateDevicegroupBundleScheduleJson(String devicegroupid);

	public JSONObject generateScheduleJson(String deviceid);

}
