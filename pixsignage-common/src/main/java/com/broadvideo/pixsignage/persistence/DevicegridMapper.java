package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Devicegrid;

public interface DevicegridMapper {
	Devicegrid selectByPrimaryKey(@Param(value = "devicegridid") String devicegridid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "gridlayoutcode") String gridlayoutcode,
			@Param(value = "devicegroupid") String devicegroupid, @Param(value = "search") String search);

	List<Devicegrid> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "gridlayoutcode") String gridlayoutcode,
			@Param(value = "devicegroupid") String devicegroupid, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	List<Devicegrid> selectByDevicegroup(@Param(value = "devicegroupid") String devicegroupid);

	int deleteByPrimaryKey(@Param(value = "devicegridid") String devicegridid);

	// int insert(Devicegrid record);

	int insertSelective(Devicegrid record);

	int updateByPrimaryKeySelective(Devicegrid record);

	int updateDevicegroup(@Param(value = "devicegridid") String devicegridid,
			@Param(value = "devicegroupid") String devicegroupid);

	// int updateByPrimaryKey(Devicegrid record);

	int unbindDevices(@Param(value = "devicegridid") String devicegridid);

}