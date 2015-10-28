package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;

public interface DevicegroupService {
	public int selectCount(int orgid, int branchid, String search);

	public List<Devicegroup> selectList(int orgid, int branchid, String search, String start, String length);

	public void addDevice(Devicegroup devicegroup, Device device);

	public void deleteDevice(Devicegroup devicegroup, Device device);

	public void addDevicegroup(Devicegroup devicegroup);

	public void updateDevicegroup(Devicegroup devicegroup);

	public void deleteDevicegroup(String devicegroupid);

}
