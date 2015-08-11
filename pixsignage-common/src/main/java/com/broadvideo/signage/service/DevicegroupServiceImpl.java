package com.broadvideo.signage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.signage.domain.Devicegroup;
import com.broadvideo.signage.persistence.DevicegroupMapper;

@Service("devicegroupService")
public class DevicegroupServiceImpl implements DevicegroupService {

	@Autowired
	private DevicegroupMapper devicegroupMapper ;
	
	public int selectCount(int orgid, int branchid, String search) {
		return devicegroupMapper.selectCount(orgid, branchid, search);
	}
	
	public List<Devicegroup> selectList(int orgid, int branchid, String search, String start, String length) {
		return devicegroupMapper.selectList(orgid, branchid, search, start, length);
	}
	
	public List<Devicegroup> selectByDevice(String deviceid) {
		return devicegroupMapper.selectByDevice(deviceid);
	}
	
	@Transactional
	public void addDevicegroup(Devicegroup devicegroup) {
		devicegroupMapper.insert(devicegroup);
	}
	
	public void updateDevicegroup(Devicegroup devicegroup) {
		devicegroupMapper.updateByPrimaryKeySelective(devicegroup);
	}
	
	public void deleteDevicegroup(String[] ids) {
		String s = "";
		if (ids.length > 0) s = ids[0];
		for (int i=1; i<ids.length; i++) {
			s += "," + ids[i];
		}
		devicegroupMapper.deleteByKeys(s);
	}

}
