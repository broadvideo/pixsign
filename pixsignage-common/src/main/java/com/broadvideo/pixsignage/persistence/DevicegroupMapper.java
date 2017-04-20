package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Devicegroup;

public interface DevicegroupMapper {
	Devicegroup selectByPrimaryKey(@Param(value = "devicegroupid") String devicegroupid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "type") String type, @Param(value = "search") String search);

	List<Devicegroup> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "type") String type, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "devicegroupid") String devicegroupid);

	// int insert(Devicegroup record);

	int insertSelective(Devicegroup record);

	int updateByPrimaryKeySelective(Devicegroup record);

	// int updateByPrimaryKey(Devicegroup record);

	int unbindDevices(@Param(value = "devicegroupid") String devicegroupid);

	int unbindDevicegrids(@Param(value = "devicegroupid") String devicegroupid);

}