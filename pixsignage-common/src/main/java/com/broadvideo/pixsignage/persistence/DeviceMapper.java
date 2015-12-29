package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Device;

public interface DeviceMapper {
	Device selectByPrimaryKey(@Param(value = "deviceid") String deviceid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "status") String status, @Param(value = "devicegroupid") String devicegroupid,
			@Param(value = "search") String search);

	List<Device> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "status") String status, @Param(value = "devicegroupid") String devicegroupid,
			@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	int selectUnregisterCount(@Param(value = "orgid") String orgid, @Param(value = "search") String search);

	List<Device> selectUnregisterList(@Param(value = "orgid") String orgid, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	Device selectByHardkey(@Param(value = "hardkey") String hardkey);

	Device selectByTerminalid(@Param(value = "terminalid") String terminalid);

	List<Device> selectByOrgtype(@Param(value = "orgtype") String orgtype);

	int deleteByPrimaryKey(@Param(value = "deviceid") String deviceid);

	// int insert(Device record);

	int insertSelective(Device record);

	int insertList(@Param(value = "devices") List<Device> devices);

	int updateByPrimaryKeySelective(Device record);

	int updateByPrimaryKey(Device record);

	int updateOnlineflag();
}