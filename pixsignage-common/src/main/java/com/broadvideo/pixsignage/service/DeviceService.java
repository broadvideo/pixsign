package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Device;

public interface DeviceService {
	public int selectCount(String orgid, String branchid, String status, String devicegroupid, String search);

	public List<Device> selectList(String orgid, String branchid, String status, String devicegroupid, String search,
			String start, String length);

	public int selectUnregisterCount(String orgid, String search);

	public List<Device> selectUnregisterList(String orgid, String search, String start, String length);

	public Device selectByPrimaryKey(String deviceid);

	public Device selectByHardkey(String hardkey);

	public Device selectByTerminalid(String terminalid);

	public List<Device> selectByOrgtype(String orgtype);

	public void addDevice(Device device);

	public void updateDevice(Device device);

	public void updateDeviceSelective(Device device);

	public void deleteDevice(String deviceid);

	public void updateOnlineflag();

}
