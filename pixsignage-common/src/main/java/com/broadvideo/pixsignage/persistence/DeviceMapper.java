package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Device;

public interface DeviceMapper {
	Device selectByPrimaryKey(@Param(value = "deviceid") String deviceid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "subbranchflag") String subbranchflag, @Param(value = "status") String status,
			@Param(value = "onlineflag") String onlineflag, @Param(value = "devicegroupid") String devicegroupid,
			@Param(value = "devicegridid") String devicegridid, @Param(value = "cataitemid1") String cataitemid1,
			@Param(value = "cataitemid2") String cataitemid2, @Param(value = "search") String search);

	List<Device> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "subbranchflag") String subbranchflag, @Param(value = "status") String status,
			@Param(value = "onlineflag") String onlineflag, @Param(value = "devicegroupid") String devicegroupid,
			@Param(value = "devicegridid") String devicegridid, @Param(value = "cataitemid1") String cataitemid1,
			@Param(value = "cataitemid2") String cataitemid2, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length,
			@Param(value = "order") String order);

	List<Device> selectByDevicegroup(@Param(value = "devicegroupid") String devicegroupid);

	List<Device> selectByDevicegrid(@Param(value = "devicegridid") String devicegridid);

	Device selectByHardkey(@Param(value = "hardkey") String hardkey);

	Device selectByTerminalid(@Param(value = "terminalid") String terminalid);

	int selectCountByOstype(@Param(value = "orgid") String orgid, @Param(value = "ostype") String ostype);

	int unbind(@Param(value = "deviceid") String deviceid);

	int updateUpgradeflag(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "upgradeflag") String upgradeflag);

	// int insert(Device record);

	int insertSelective(Device record);

	int insertList(@Param(value = "devices") List<Device> devices);

	int updateByPrimaryKeySelective(Device record);

	int updateByPrimaryKey(Device record);

	int updateDevicegroup(@Param(value = "deviceid") String deviceid,
			@Param(value = "devicegroupid") String devicegroupid);

	int updateBranch(@Param(value = "deviceid") String deviceid, @Param(value = "branchid") String branchid);

	int changeBranch(@Param(value = "branchid1") String branchid1, @Param(value = "branchid2") String branchid2);

	int updateTags(@Param(value = "branchid") String branchid, @Param(value = "tags") String tags);

	int updateCataitemid1(@Param(value = "deviceid") String deviceid, @Param(value = "cataitemid1") String cataitemid1);

	int updateCataitemid2(@Param(value = "deviceid") String deviceid, @Param(value = "cataitemid2") String cataitemid2);

	int checkDevicegroup();

	int updateOnlineflag();

	int checkAppfile(@Param(value = "appfileid") String appfileid);

	int resetExternalid(String externalid);

}