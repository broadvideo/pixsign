package com.broadvideo.signage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.signage.domain.Device;
import com.broadvideo.signage.domain.Devicegroupdtl;
import com.broadvideo.signage.persistence.DeviceMapper;
import com.broadvideo.signage.persistence.DevicegroupdtlMapper;

@Service("devicegroupdtlService")
public class DevicegroupdtlServiceImpl implements DevicegroupdtlService {

	@Autowired
	private DevicegroupdtlMapper devicegroupdtlMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	
	public int selectCountByDeviceGroup(String devicegroupid) {
		return devicegroupdtlMapper.selectCountByDeviceGroup(devicegroupid);
	}
	
	public List<Devicegroupdtl> selectListByDeviceGroup(String devicegroupid, String start, String length) {
		return devicegroupdtlMapper.selectListByDeviceGroup(devicegroupid, start, length);
	}
	
	@Transactional
	public void addDevicegroupdtl(Devicegroupdtl devicegroupdtl) {
		devicegroupdtlMapper.insert(devicegroupdtl);
		updateDeviceGroupcode(""+devicegroupdtl.getDeviceid());
	}
	
	@Transactional
	public void deleteDevicegroupdtl(Devicegroupdtl devicegroupdtl) {
		System.out.println(devicegroupdtl.getDevicegroupdtlid());
		System.out.println(devicegroupdtl.getDeviceid());
		devicegroupdtlMapper.deleteByKeys(""+devicegroupdtl.getDevicegroupdtlid());
		updateDeviceGroupcode(""+devicegroupdtl.getDeviceid());
	}
	
	private void updateDeviceGroupcode(String deviceid) {
		String groupcode = "";
		List<Devicegroupdtl> devicegroupdtls = devicegroupdtlMapper.selectListByDevice(deviceid);
		for (Devicegroupdtl devicegroupdtl : devicegroupdtls) {
			if (groupcode.length() > 0) {
				groupcode += ",";
			}
			groupcode += devicegroupdtl.getDevicegroup().getCode();
		}
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		device.setGroupcode(groupcode);
		deviceMapper.updateByPrimaryKeySelective(device);
	}

}
