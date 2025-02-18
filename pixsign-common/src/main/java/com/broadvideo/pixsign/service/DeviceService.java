package com.broadvideo.pixsign.service;

import java.util.List;

import com.broadvideo.pixsign.domain.Device;

import net.sf.json.JSONObject;

public interface DeviceService {
	public int selectCount(String orgid, String branchid, String subbranchflag, String type, String status,
			String onlineflag, String devicegroupid, String devicegridid, String cataitemid1, String cataitemid2,
			String search);

	public List<Device> selectList(String orgid, String branchid, String subbranchflag, String type, String status,
			String onlineflag, String devicegroupid, String devicegridid, String cataitemid1, String cataitemid2,
			String search, String start, String length, String order);

	public Device selectByPrimaryKey(String deviceid);

	public Device selectByHardkey(String hardkey);

	public Device selectByTerminalid(String terminalid);

	public void addDevice(Device device);

	public void updateDevice(Device device);

	public void updateDeviceSelective(Device device);

	public void bind(Device device);

	public void unbind(String deviceid);

	public void delete(String deviceid);

	public void updateUpgradeflag(String orgid, String branchid, String type, String upgradeflag);

	public void updateBundle(String[] deviceids, String defaultbundleid);

	public void updatePage(String[] deviceids, String defaultpageid);

	public void updateMedialist(String[] deviceids, String defaultmedialistid);

	public void updateOnlineflag();

	public void configall(String orgid) throws Exception;

	public void config(String deviceid) throws Exception;

	public void reboot(String deviceid) throws Exception;

	public void poweroff(String deviceid) throws Exception;

	public void screen(String deviceid) throws Exception;

	public void debug(String deviceid) throws Exception;

	public JSONObject generateBundleScheduleJson(Device device) throws Exception;

	public JSONObject generatePageScheduleJson(Device device) throws Exception;

	public JSONObject generateAllPagesJson(Device device) throws Exception;

	public JSONObject generateAllIntentsJson(Device device) throws Exception;

}
