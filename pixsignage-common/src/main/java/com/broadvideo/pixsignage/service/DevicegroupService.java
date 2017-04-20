package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Devicegroup;

public interface DevicegroupService {
	public Devicegroup selectByPrimaryKey(String devicegroupid);

	public int selectCount(String orgid, String branchid, String type, String search);

	public List<Devicegroup> selectList(String orgid, String branchid, String type, String search, String start,
			String length);

	public void addDevices(Devicegroup devicegroup, String[] deviceids);

	public void deleteDevices(Devicegroup devicegroup, String[] deviceids);

	public void addDevicegrids(Devicegroup devicegroup, String[] devicegridids);

	public void deleteDevicegrids(Devicegroup devicegroup, String[] devicegridids);

	public void addDevicegroup(Devicegroup devicegroup);

	public void updateDevicegroup(Devicegroup devicegroup);

	public void deleteDevicegroup(String devicegroupid);

}
