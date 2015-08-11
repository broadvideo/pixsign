package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Devicegroup;

public interface DevicegroupService {
	public int selectCount(int orgid, int branchid, String search);
	public List<Devicegroup> selectList(int orgid, int branchid, String search, String start, String length);
	public List<Devicegroup> selectByDevice(String deviceid);
	
	public void addDevicegroup(Devicegroup devicegroup);
	public void updateDevicegroup(Devicegroup devicegroup);
	public void deleteDevicegroup(String[] ids);
	
}
