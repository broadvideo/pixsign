package com.broadvideo.pixsignage.persistence;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Pflowlog;

public interface PflowlogMapper {
	Pflowlog selectByPrimaryKey(@Param(value = "pflowlogid") String pflowlogid);

	int selectDeviceStatCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search);

	List<HashMap<String, Object>> selectDeviceStatList(@Param(value = "orgid") String orgid,
			@Param(value = "branchid") String branchid, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	List<HashMap<String, Object>> statByDay(@Param(value = "deviceid") String deviceid,
			@Param(value = "month") String month);

	List<HashMap<String, Object>> statByHour(@Param(value = "deviceid") String deviceid,
			@Param(value = "day") String day);

	// int insert(Pflowlog record);

	int insertSelective(Pflowlog record);

	int updateByPrimaryKeySelective(Pflowlog record);

	// int updateByPrimaryKey(Pflowlog record);

}