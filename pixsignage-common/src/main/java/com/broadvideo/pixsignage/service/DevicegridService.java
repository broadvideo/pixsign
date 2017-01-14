package com.broadvideo.pixsignage.service;

import java.util.List;

import org.json.JSONObject;

import com.broadvideo.pixsignage.domain.Devicegrid;
import com.broadvideo.pixsignage.domain.Gridschedule;

public interface DevicegridService {
	public int selectCount(String orgid, String branchid, String search);

	public List<Devicegrid> selectList(String orgid, String branchid, String search, String start, String length);

	public void design(Devicegrid devicegrid);

	public void addDevicegrid(Devicegrid devicegrid);

	public void updateDevicegrid(Devicegrid devicegrid);

	public void deleteDevicegrid(String devicegridid);

	public void addSchedules(Gridschedule[] gridschedules);

	public void syncSchedule(String devicegridid);

	public JSONObject generateScheduleJson(String devicegridid);
}
