package com.broadvideo.pixsign.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsign.domain.Devicegroup;
import com.broadvideo.pixsign.persistence.DeviceMapper;
import com.broadvideo.pixsign.persistence.DevicegroupMapper;

@Service("devicegroupService")
public class DevicegroupServiceImpl implements DevicegroupService {

	@Autowired
	private DevicegroupMapper devicegroupMapper;
	@Autowired
	private DeviceMapper deviceMapper;

	public Devicegroup selectByPrimaryKey(String devicegroupid) {
		return devicegroupMapper.selectByPrimaryKey(devicegroupid);
	}

	public int selectCount(String orgid, String branchid, String type, String gridlayoutcode, String search) {
		return devicegroupMapper.selectCount(orgid, branchid, type, gridlayoutcode, search);
	}

	public List<Devicegroup> selectList(String orgid, String branchid, String type, String gridlayoutcode,
			String search, String start, String length) {
		return devicegroupMapper.selectList(orgid, branchid, type, gridlayoutcode, search, start, length);
	}

	@Transactional
	public void updateBundle(String[] devicegroupids, String defaultbundleid) {
		for (int i = 0; i < devicegroupids.length; i++) {
			devicegroupMapper.updateBundle(devicegroupids[i], defaultbundleid);
		}
	}

	@Transactional
	public void updatePage(String[] devicegroupids, String defaultpageid) {
		for (int i = 0; i < devicegroupids.length; i++) {
			devicegroupMapper.updatePage(devicegroupids[i], defaultpageid);
		}
	}

	@Transactional
	public void addDevices(Devicegroup devicegroup, String[] deviceids) {
		for (int i = 0; i < deviceids.length; i++) {
			deviceMapper.updateDevicegroup(deviceids[i], "" + devicegroup.getDevicegroupid());
		}
	}

	@Transactional
	public void deleteDevices(Devicegroup devicegroup, String[] deviceids) {
		for (int i = 0; i < deviceids.length; i++) {
			deviceMapper.updateDevicegroup(deviceids[i], "0");
		}
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
		devicegroupMapper.unbindDevices(devicegroupid);
		devicegroupMapper.unbindDevicegrids(devicegroupid);
		devicegroupMapper.deleteByPrimaryKey(devicegroupid);
	}

}
