package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Devicefile;

public interface DevicefileMapper {
	Devicefile selectByPrimaryKey(@Param(value = "devicefileid") String devicefileid);

	int selectCount(@Param(value = "deviceid") String deviceid, @Param(value = "objtype") String objtype,
			@Param(value = "status") String status);

	List<Devicefile> selectList(@Param(value = "deviceid") String deviceid, @Param(value = "objtype") String objtype,
			@Param(value = "status") String status, @Param(value = "start") String start,
			@Param(value = "length") String length);

	Devicefile selectByDeviceMedia(@Param(value = "deviceid") String deviceid, @Param(value = "objtype") String objtype,
			@Param(value = "objid") String objid);

	List<Devicefile> selectDownloading(@Param(value = "deviceid") String deviceid);

	void insertDeviceVideoFiles(@Param(value = "deviceid") String deviceid);

	void deleteDeviceVideoFiles(@Param(value = "deviceid") String deviceid);

	void insertDeviceImageFiles(@Param(value = "deviceid") String deviceid);

	void deleteDeviceImageFiles(@Param(value = "deviceid") String deviceid);

	void insertDevicegroupVideoFiles(@Param(value = "devicegroupid") String devicegroupid);

	void deleteDevicegroupVideoFiles(@Param(value = "devicegroupid") String devicegroupid);

	void insertDevicegroupImageFiles(@Param(value = "devicegroupid") String devicegroupid);

	void deleteDevicegroupImageFiles(@Param(value = "devicegroupid") String devicegroupid);

	int deleteByPrimaryKey(@Param(value = "devicefileid") String devicefileid);

	int deleteByObj(@Param(value = "objtype") String objtype, @Param(value = "objid") String objid);

	// int insert(Devicefile record);

	int insertSelective(Devicefile record);

	int updateByPrimaryKeySelective(Devicefile record);

	// int updateByPrimaryKey(Devicefile record);
}