package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Gridlayout;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicegridMapper;
import com.broadvideo.pixsignage.persistence.DevicegroupMapper;
import com.broadvideo.pixsignage.persistence.GridlayoutMapper;

@Service("devicegroupService")
public class DevicegroupServiceImpl implements DevicegroupService {

	@Autowired
	private DevicegroupMapper devicegroupMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private DevicegridMapper devicegridMapper;
	@Autowired
	private GridlayoutMapper gridlayoutMapper;

	public Devicegroup selectByPrimaryKey(String devicegroupid) {
		return devicegroupMapper.selectByPrimaryKey(devicegroupid);
	}

	public int selectCount(String orgid, String branchid, String type, String search) {
		return devicegroupMapper.selectCount(orgid, branchid, type, search);
	}

	public List<Devicegroup> selectList(String orgid, String branchid, String type, String search, String start,
			String length) {
		return devicegroupMapper.selectList(orgid, branchid, type, search, start, length);
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
	public void addDevicegrids(Devicegroup devicegroup, String[] devicegridids) {
		for (int i = 0; i < devicegridids.length; i++) {
			devicegridMapper.updateDevicegroup(devicegridids[i], "" + devicegroup.getDevicegroupid());
		}
	}

	@Transactional
	public void deleteDevicegrids(Devicegroup devicegroup, String[] devicegridids) {
		for (int i = 0; i < devicegridids.length; i++) {
			devicegridMapper.updateDevicegroup(devicegridids[i], "0");
		}
	}

	@Transactional
	public void addDevicegroup(Devicegroup devicegroup) {
		if (devicegroup.getType().equals(Devicegroup.Type_Devicegrid)) {
			Gridlayout gridlayout = gridlayoutMapper.selectByCode(devicegroup.getGridlayoutcode());
			devicegroup.setXcount(gridlayout.getXcount());
			devicegroup.setYcount(gridlayout.getYcount());
			devicegroup.setRatio(gridlayout.getRatio());
			devicegroup.setWidth(gridlayout.getWidth());
			devicegroup.setHeight(gridlayout.getHeight());
		}
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
