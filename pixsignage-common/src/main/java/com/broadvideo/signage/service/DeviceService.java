package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Device;

public interface DeviceService {
	public int selectCount(String orgid, String branchid, String metrolineid, String metrostationid, String metrotype,
			String metrodirection, String search);

	public List<Device> selectList(String orgid, String branchid, String metrolineid, String metrostationid,
			String metrotype, String metrodirection, String search, String start, String length);

	public int selectUnregisterCount(String orgid, String search);

	public List<Device> selectUnregisterList(String orgid, String search, String start, String length);

	public Device selectByPrimaryKey(String deviceid);

	public List<Device> selectByDeviceGroup(String devicegroupid);

	public List<Device> selectByHardkey(String hardkey);

	public List<Device> selectByTerminalid(String terminalid);

	public List<Device> selectByOrgtype(String orgtype);

	public int selectAvailCountByDeviceGroup(int orgid, int branchid, String devicegroupid);

	public List<Device> selectAvailListByDeviceGroup(int orgid, int branchid, String devicegroupid, String start,
			String length);

	public void addDevice(Device device);

	public void updateDevice(Device device);

	public void configDevice(Device device);

	public void deleteDevice(String[] ids);

	public void updateOnlineflag();

}
