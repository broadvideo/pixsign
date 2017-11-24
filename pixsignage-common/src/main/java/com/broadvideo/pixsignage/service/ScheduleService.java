package com.broadvideo.pixsignage.service;

import java.util.List;

import org.json.JSONObject;

import com.broadvideo.pixsignage.domain.Schedule;

public interface ScheduleService {
	public List<Schedule> selectList(String scheduletype, String bindtype, String bindid, String playmode);

	public void batch(String scheduletype, String bindtype, String bindid, Schedule[] schedules);

	public void syncSchedule(String bindtype, String bindid) throws Exception;

	public void syncScheduleByBundle(String bundleid) throws Exception;

	public void syncScheduleByPage(String pageid) throws Exception;

	public void syncScheduleByMediagrid(String mediagridid) throws Exception;

	public JSONObject generateBundleScheduleJson(String bindtype, String bindid);

	public JSONObject generateScheduleJson(String deviceid);

}
