package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Schedule;

import net.sf.json.JSONObject;

public interface ScheduleService {
	public List<Schedule> selectList(String scheduletype, String bindtype, String bindid, String playmode);

	public void batch(String scheduletype, String bindtype, String bindid, Schedule[] schedules);

	public void syncSchedule(String bindtype, String bindid) throws Exception;

	public void syncScheduleByBundle(String bundleid) throws Exception;

	public void syncScheduleByPage(String pageid) throws Exception;

	public void syncScheduleByMediagrid(String mediagridid) throws Exception;

	public JSONObject generateDeviceBundleScheduleJson(String deviceid);

	public JSONObject generateDevicegroupBundleScheduleJson(String devicegroupid);

	public JSONObject generateScheduleJson(String deviceid);

}
