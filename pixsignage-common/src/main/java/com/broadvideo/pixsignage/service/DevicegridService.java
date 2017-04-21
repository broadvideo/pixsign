package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Devicegrid;

public interface DevicegridService {
	public Devicegrid selectByPrimaryKey(String devicegridid);

	public int selectCount(String orgid, String branchid, String gridlayoutcode, String devicegroupid, String search);

	public List<Devicegrid> selectList(String orgid, String branchid, String gridlayoutcode, String devicegroupid,
			String search, String start, String length);

	public void design(Devicegrid devicegrid) throws Exception;

	public void addDevicegrid(Devicegrid devicegrid) throws Exception;

	public void updateDevicegrid(Devicegrid devicegrid);

	public void deleteDevicegrid(String devicegridid);
}
