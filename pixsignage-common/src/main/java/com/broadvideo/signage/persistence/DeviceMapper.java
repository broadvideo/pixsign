package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Device;

public interface DeviceMapper {
	Device selectByPrimaryKey(@Param(value = "deviceid") String deviceid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "metrolineid") String metrolineid, @Param(value = "metrostationid") String metrostationid,
			@Param(value = "metrotype") String metrotype, @Param(value = "metrodirection") String metrodirection,
			@Param(value = "search") String search);

	List<Device> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "metrolineid") String metrolineid, @Param(value = "metrostationid") String metrostationid,
			@Param(value = "metrotype") String metrotype, @Param(value = "metrodirection") String metrodirection,
			@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	int selectUnregisterCount(@Param(value = "orgid") String orgid, @Param(value = "search") String search);

	List<Device> selectUnregisterList(@Param(value = "orgid") String orgid, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	List<Device> selectByDeviceGroup(@Param(value = "devicegroupid") String devicegroupid);

	List<Device> selectByLayout(@Param(value = "layoutid") Integer layoutid);

	List<Device> selectByHardkey(@Param(value = "hardkey") String hardkey);

	List<Device> selectByTerminalid(@Param(value = "terminalid") String terminalid);

	List<Device> selectByOrgtype(@Param(value = "orgtype") String orgtype);

	int selectAvailCountByDeviceGroup(@Param(value = "orgid") int orgid, @Param(value = "branchid") int branchid,
			@Param(value = "devicegroupid") String devicegroupid);

	List<Device> selectAvailListByDeviceGroup(@Param(value = "orgid") int orgid,
			@Param(value = "branchid") int branchid, @Param(value = "devicegroupid") String devicegroupid,
			@Param(value = "start") String start, @Param(value = "length") String length);

	int insert(Device record);

	int insertSelective(Device record);

	int insertList(@Param(value = "devices") List<Device> devices);

	int updateByPrimaryKeySelective(Device record);

	int updateByPrimaryKey(Device record);

	int updateOnlineflag();

	int updateConfigstatus(@Param(value = "orgid") int orgid);

	int deleteByKeys(String ids);
}