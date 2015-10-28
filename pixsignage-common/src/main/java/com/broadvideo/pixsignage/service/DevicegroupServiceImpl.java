package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicegroupMapper;

@Service("devicegroupService")
public class DevicegroupServiceImpl implements DevicegroupService {

	@Autowired
	private DevicegroupMapper devicegroupMapper;
	@Autowired
	private DeviceMapper deviceMapper;

	public int selectCount(int orgid, int branchid, String search) {
		return devicegroupMapper.selectCount(orgid, branchid, search);
	}

	public List<Devicegroup> selectList(int orgid, int branchid, String search, String start, String length) {
		return devicegroupMapper.selectList(orgid, branchid, search, start, length);
	}

	@Transactional
	public void addDevice(Devicegroup devicegroup, Device device) {
		device.setDevicegroupid(devicegroup.getDevicegroupid());
		deviceMapper.updateByPrimaryKeySelective(device);
	}

	@Transactional
	public void deleteDevice(Devicegroup devicegroup, Device device) {
		device.setDevicegroupid(0);
		deviceMapper.updateByPrimaryKeySelective(device);
	}

	@Transactional
	public void addDevicegroup(Devicegroup devicegroup) {
		devicegroupMapper.insertSelective(devicegroup);
	}

	@Transactional
	public void updateDevicegroup(Devicegroup devicegroup) {
		devicegroupMapper.updateByPrimaryKeySelective(devicegroup);
	}

	@Transactional
	public void deleteDevicegroup(String devicegroupid) {
		devicegroupMapper.deleteByPrimaryKey(devicegroupid);
	}

}
