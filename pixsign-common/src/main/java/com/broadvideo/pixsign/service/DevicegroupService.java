package com.broadvideo.pixsign.service;

import java.util.List;

import com.broadvideo.pixsign.domain.Devicegroup;

public interface DevicegroupService {
	public Devicegroup selectByPrimaryKey(String devicegroupid);

	public int selectCount(String orgid, String branchid, String type, String gridlayoutcode, String search);

	public List<Devicegroup> selectList(String orgid, String branchid, String type, String gridlayoutcode,
			String search, String start, String length);

	public void updateBundle(String[] devicegroupids, String defaultbundleid);

	public void updatePage(String[] devicegroupids, String defaultpageid);

	public void addDevices(Devicegroup devicegroup, String[] deviceids);

	public void deleteDevices(Devicegroup devicegroup, String[] deviceids);

	public void addDevicegroup(Devicegroup devicegroup);

	public void updateDevicegroup(Devicegroup devicegroup);

	public void deleteDevicegroup(String devicegroupid);

}
