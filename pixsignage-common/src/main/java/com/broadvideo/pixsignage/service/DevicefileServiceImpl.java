package com.broadvideo.pixsignage.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Devicefile;
import com.broadvideo.pixsignage.persistence.DevicefileMapper;

@Service("devicefileService")
public class DevicefileServiceImpl implements DevicefileService {

	private static final Logger log = Logger.getLogger(DevicefileServiceImpl.class);

	@Autowired
	private DevicefileMapper devicefileMapper;

	public int selectCount(String deviceid, String objtype, String status) {
		return devicefileMapper.selectCount(deviceid, objtype, status);
	}

	public List<Devicefile> selectList(String deviceid, String objtype, String status, String start, String length) {
		return devicefileMapper.selectList(deviceid, objtype, status, start, length);
	}

	public Devicefile selectByDeviceMedia(String deviceid, String objtype, String objid) {
		return devicefileMapper.selectByDeviceMedia(deviceid, objtype, objid);
	}

	public List<Devicefile> selectDownloading(String deviceid) {
		return devicefileMapper.selectDownloading(deviceid);
	}

	@Transactional
	public void addDevicefile(Devicefile devicefile) {
		devicefileMapper.insertSelective(devicefile);
	}

	@Transactional
	public void updateDevicefile(Devicefile devicefile) {
		devicefileMapper.updateByPrimaryKeySelective(devicefile);
	}

	@Transactional
	public void deleteDevicefile(String devicefileid) {
		devicefileMapper.deleteByPrimaryKey(devicefileid);
	}

	@Transactional
	public void updateDevicefileByDevice(String deviceid) {
		List<Devicefile> imagefiles = devicefileMapper.selectList(deviceid, "1", null, null, null);
		List<Devicefile> videofiles = devicefileMapper.selectList(deviceid, "2", null, null, null);

	}

}
