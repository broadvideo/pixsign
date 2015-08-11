package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Deviceevent;

public interface DeviceeventService {
	public int selectCount(String deviceid);
	public List<Deviceevent> selectList(String deviceid, String start, String length);
	
	public void addDeviceevent(Deviceevent deviceevent);
}
