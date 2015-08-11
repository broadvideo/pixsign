package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Devicegroupdtl;

public interface DevicegroupdtlService {
	public int selectCountByDeviceGroup(String devicegroupid);
	public List<Devicegroupdtl> selectListByDeviceGroup(String devicegroupid, String start, String length);

	public void addDevicegroupdtl(Devicegroupdtl devicegroupdtl);
	public void deleteDevicegroupdtl(Devicegroupdtl devicegroupdtl);
}
