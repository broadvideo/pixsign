package com.broadvideo.pixsignage.service;

import java.util.List;

import org.json.JSONObject;

import com.broadvideo.pixsignage.domain.Regionschedule;

public interface RegionscheduleService {
	public List<Regionschedule> selectList(String bindtype, String bindid, String regionid, String playmode,
			String fromdate, String todate);

	public void addRegionschedule(Regionschedule regionschedule);

	public void updateRegionschedule(Regionschedule regionschedule);

	public void deleteRegionschedule(String regionscheduleid);

	public void syncRegionschedule(String bindtype, String bindid) throws Exception;

	public JSONObject generateRegionScheduleJson(String bindtype, String bindid, String regionid);
}
