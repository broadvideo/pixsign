package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Devicelog;

public interface DevicelogService {
	public int selectCount(String deviceid);
	public List<Devicelog> selectList(String deviceid, String start, String length);
	
	public void addDevicelog(Devicelog devicelog);
}
