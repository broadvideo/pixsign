package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.persistence.DeviceMapper;

@Service("deviceService")
public class DeviceServiceImpl implements DeviceService {

	@Autowired
	private DeviceMapper deviceMapper;

	public int selectCount(String orgid, String branchid, String devicegroupid, String search) {
		return deviceMapper.selectCount(orgid, branchid, devicegroupid, search);
	}

	public List<Device> selectList(String orgid, String branchid, String devicegroupid, String search, String start,
			String length) {
		return deviceMapper.selectList(orgid, branchid, devicegroupid, search, start, length);
	}

	public int selectUnregisterCount(String orgid, String search) {
		return deviceMapper.selectUnregisterCount(orgid, search);
	}

	public List<Device> selectUnregisterList(String orgid, String search, String start, String length) {
		return deviceMapper.selectUnregisterList(orgid, search, start, length);
	}

	public Device selectByPrimaryKey(String deviceid) {
		return deviceMapper.selectByPrimaryKey(deviceid);
	}

	public Device selectByHardkey(String hardkey) {
		return deviceMapper.selectByHardkey(hardkey);
	}

	public Device selectByTerminalid(String terminalid) {
		return deviceMapper.selectByTerminalid(terminalid);
	}

	public List<Device> selectByOrgtype(String orgtype) {
		return deviceMapper.selectByOrgtype(orgtype);
	}

	@Transactional
	public void addDevice(Device device) {
		deviceMapper.insertSelective(device);
	}

	@Transactional
	public void updateDevice(Device device) {
		deviceMapper.updateByPrimaryKey(device);
	}

	@Transactional
	public void updateDeviceSelective(Device device) {
		deviceMapper.updateByPrimaryKeySelective(device);
	}

	@Transactional
	public void deleteDevice(String deviceid) {
		deviceMapper.deleteByPrimaryKey(deviceid);
	}

	@Transactional
	public void updateOnlineflag() {
		deviceMapper.updateOnlineflag();
	}
}
