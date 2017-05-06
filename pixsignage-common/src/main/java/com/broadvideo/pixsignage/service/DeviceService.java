package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Device;

public interface DeviceService {
	public int selectCount(String orgid, String branchid, String status, String onlineflag, String devicegroupid,
			String devicegridid, String search);

	public List<Device> selectList(String orgid, String branchid, String status, String onlineflag,
			String devicegroupid, String devicegridid, String search, String start, String length, String order);

	public Device selectByPrimaryKey(String deviceid);

	public Device selectByHardkey(String hardkey);

	public Device selectByTerminalid(String terminalid);

	public List<Device> selectByOrgtype(String orgtype);

	public void addDevice(Device device);

	public void updateDevice(Device device);

	public void updateDeviceSelective(Device device);

	public void deleteDevice(String deviceid);

	public void updateOnlineflag();

	public void configall(String orgid) throws Exception;

	public void config(String deviceid) throws Exception;

	public void reboot(String deviceid) throws Exception;

	public void poweroff(String deviceid) throws Exception;

	public void screen(String deviceid) throws Exception;

	public void debug(String deviceid) throws Exception;

	public void utext(String orgid, String text, String count, String position, String speed, String color, String size,
			String bgcolor, String opacity) throws Exception;

	public void ucancel(String orgid) throws Exception;
}
