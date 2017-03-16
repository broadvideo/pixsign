package com.broadvideo.pixsignage.persistence;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Flowlog;

public interface FlowlogMapper {
	Flowlog selectByPrimaryKey(@Param(value = "flowlogid") String flowlogid);

	int selectDeviceStatCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search);

	List<HashMap<String, Object>> selectDeviceStatList(@Param(value = "orgid") String orgid,
			@Param(value = "branchid") String branchid, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	List<HashMap<String, Object>> statPeriodByDay(@Param(value = "deviceid") String deviceid,
			@Param(value = "day") String day);

	List<HashMap<String, Object>> statPeriodByMonth(@Param(value = "deviceid") String deviceid,
			@Param(value = "month") String month);

	List<HashMap<String, Object>> statCatalogByDay(@Param(value = "deviceid") String deviceid,
			@Param(value = "day") String day);

	List<HashMap<String, Object>> statCatalogByMonth(@Param(value = "deviceid") String deviceid,
			@Param(value = "month") String month);

	// int insert(Flowlog record);

	int insertSelective(Flowlog record);

	int updateByPrimaryKeySelective(Flowlog record);

	// int updateByPrimaryKey(Flowlog record);
}