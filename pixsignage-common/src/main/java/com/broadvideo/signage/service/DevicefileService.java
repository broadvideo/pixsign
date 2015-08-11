package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Devicefile;

public interface DevicefileService {
	public int selectCountByDevice(String filetype, String deviceid);

	public List<Devicefile> selectByDevice(String deviceid, String filetype, String syncstatus, String start,
			String length);

	public List<Devicefile> selectByFile(String deviceid, String filetype, String fileid);

	public List<Devicefile> selectDownloadingFileByDevice(String deviceid);

	public void addDevicefile(Devicefile devicefile);

	public void updateDevicefile(Devicefile devicefile);

	public void deleteDevicefile(String[] ids);

	public void updateDevicefileByDevice(String deviceid);
}
