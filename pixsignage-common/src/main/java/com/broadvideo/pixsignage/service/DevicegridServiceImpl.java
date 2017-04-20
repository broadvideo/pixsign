package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegrid;
import com.broadvideo.pixsignage.domain.Gridlayout;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicegridMapper;
import com.broadvideo.pixsignage.persistence.GridlayoutMapper;

@Service("devicegridService")
public class DevicegridServiceImpl implements DevicegridService {

	@Autowired
	private DevicegridMapper devicegridMapper;
	@Autowired
	private GridlayoutMapper gridlayoutMapper;
	@Autowired
	private DeviceMapper deviceMapper;

	public Devicegrid selectByPrimaryKey(String devicegridid) {
		return devicegridMapper.selectByPrimaryKey(devicegridid);
	}

	public int selectCount(String orgid, String branchid, String gridlayoutcode, String devicegroupid, String search) {
		return devicegridMapper.selectCount(orgid, branchid, gridlayoutcode, devicegroupid, search);
	}

	public List<Devicegrid> selectList(String orgid, String branchid, String gridlayoutcode, String devicegroupid,
			String search, String start, String length) {
		return devicegridMapper.selectList(orgid, branchid, gridlayoutcode, devicegroupid, search, start, length);
	}

	@Transactional
	public void design(Devicegrid devicegrid) {
		devicegridMapper.unbindDevices("" + devicegrid.getDevicegridid());
		List<Device> devices = devicegrid.getDevices();
		for (Device device : devices) {
			deviceMapper.updateByPrimaryKeySelective(device);
		}
	}

	@Transactional
	public void addDevicegrid(Devicegrid devicegrid) {
		Gridlayout gridlayout = gridlayoutMapper.selectByCode(devicegrid.getGridlayoutcode());
		devicegrid.setXcount(gridlayout.getXcount());
		devicegrid.setYcount(gridlayout.getYcount());
		devicegrid.setRatio(gridlayout.getRatio());
		devicegrid.setWidth(gridlayout.getWidth());
		devicegrid.setHeight(gridlayout.getHeight());
		devicegridMapper.insertSelective(devicegrid);
	}

	@Transactional
	public void updateDevicegrid(Devicegrid devicegrid) {
		devicegridMapper.updateByPrimaryKeySelective(devicegrid);
	}

	@Transactional
	public void deleteDevicegrid(String devicegridid) {
		devicegridMapper.unbindDevices(devicegridid);
		devicegridMapper.deleteByPrimaryKey(devicegridid);
	}

}
