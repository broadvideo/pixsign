package com.broadvideo.pixsign.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Devicegroup;

public interface DevicegroupMapper {
	Devicegroup selectByPrimaryKey(@Param(value = "devicegroupid") String devicegroupid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "type") String type, @Param(value = "gridlayoutcode") String gridlayoutcode,
			@Param(value = "search") String search);

	List<Devicegroup> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "type") String type, @Param(value = "gridlayoutcode") String gridlayoutcode,
			@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	List<Devicegroup> selectByDefaultbundle(@Param(value = "defaultbundleid") String defaultbundleid);

	List<Devicegroup> selectByDefaultpage(@Param(value = "defaultpageid") String defaultpageid);

	int updateBundle(@Param(value = "devicegroupid") String devicegroupid,
			@Param(value = "defaultbundleid") String defaultbundleid);

	int updatePage(@Param(value = "devicegroupid") String devicegroupid,
			@Param(value = "defaultpageid") String defaultpageid);

	int deleteByPrimaryKey(@Param(value = "devicegroupid") String devicegroupid);

	// int insert(Devicegroup record);

	int insertSelective(Devicegroup record);

	int updateByPrimaryKeySelective(Devicegroup record);

	// int updateByPrimaryKey(Devicegroup record);

	int unbindDevices(@Param(value = "devicegroupid") String devicegroupid);

	int unbindDevicegrids(@Param(value = "devicegroupid") String devicegroupid);

}