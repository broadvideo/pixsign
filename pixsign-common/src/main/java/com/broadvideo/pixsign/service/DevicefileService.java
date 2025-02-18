package com.broadvideo.pixsign.service;

import java.util.List;

import com.broadvideo.pixsign.domain.Devicefile;

public interface DevicefileService {
	public int selectCount(String deviceid, String objtype, String status);

	public List<Devicefile> selectList(String deviceid, String objtype, String status, String start, String length);

	public Devicefile selectByDeviceMedia(String deviceid, String objtype, String objid);

	public List<Devicefile> selectDownloading(String deviceid);

	public void addDevicefile(Devicefile devicefile);

	public void updateDevicefile(Devicefile devicefile);

	public void deleteDevicefile(String devicefileid);

	public void clearByDevice(String deviceid);

	public void refreshDevicefiles(String bindtype, String bindid);
}
