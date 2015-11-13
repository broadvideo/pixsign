package com.broadvideo.pixsignage.service;

import java.util.List;

import org.json.JSONObject;

import com.broadvideo.pixsignage.domain.Layoutschedule;

public interface LayoutscheduleService {
	public List<Layoutschedule> selectList(String bindtype, String bindid);

	public void addLayoutschedule(Layoutschedule layoutschedule);

	public void updateLayoutschedule(Layoutschedule layoutschedule);

	public void deleteLayoutschedule(String layoutscheduleid);

	public void syncLayoutschedule(String bindtype, String bindid) throws Exception;

	public JSONObject generateLayoutScheduleJson(String bindtype, String bindid);
}
