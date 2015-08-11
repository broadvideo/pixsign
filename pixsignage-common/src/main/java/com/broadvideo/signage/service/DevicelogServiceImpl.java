package com.broadvideo.signage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.signage.domain.Devicelog;
import com.broadvideo.signage.persistence.DevicelogMapper;

@Service("devicelogService")
public class DevicelogServiceImpl implements DevicelogService {

	@Autowired
	private DevicelogMapper devicelogMapper ;
	
	public int selectCount(String deviceid) {
		return devicelogMapper.selectCount(deviceid);
	}
	
	public List<Devicelog> selectList(String deviceid, String start, String length) {
		return devicelogMapper.selectList(deviceid, start, length);
	}

	public void addDevicelog(Devicelog devicelog) {
		devicelogMapper.insert(devicelog);
	}

}
