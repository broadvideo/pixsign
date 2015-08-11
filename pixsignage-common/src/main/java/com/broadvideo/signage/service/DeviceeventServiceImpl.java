package com.broadvideo.signage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.signage.domain.Deviceevent;
import com.broadvideo.signage.persistence.DeviceeventMapper;

@Service("deviceeventService")
public class DeviceeventServiceImpl implements DeviceeventService {

	@Autowired
	private DeviceeventMapper deviceeventMapper ;
	
	public int selectCount(String deviceid) {
		return deviceeventMapper.selectCount(deviceid);
	}
	
	public List<Deviceevent> selectList(String deviceid, String start, String length) {
		return deviceeventMapper.selectList(deviceid, start, length);
	}

	public void addDeviceevent(Deviceevent deviceevent) {
		deviceeventMapper.insert(deviceevent);
	}

}
