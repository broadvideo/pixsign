package com.broadvideo.pixsignage.persistence;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Hourflowlog;

public interface HourflowlogMapper {
	Hourflowlog selectByPrimaryKey(@Param(value = "hourflowlogid") String hourflowlogid);

	Hourflowlog selectByDetail(@Param(value = "deviceid") String deviceid, @Param(value = "flowhour") String flowhour);

	int selectDeviceStatCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search);

	List<HashMap<String, Object>> selectDeviceStatList(@Param(value = "orgid") String orgid,
			@Param(value = "branchid") String branchid, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	List<HashMap<String, Object>> selectDeviceListByDay(@Param(value = "orgid") String orgid,
			@Param(value = "day") String day);

	List<HashMap<String, Object>> selectDeviceListByMonth(@Param(value = "orgid") String orgid,
			@Param(value = "month") String month);

	List<HashMap<String, Object>> statPeriodByDay(@Param(value = "deviceid") String deviceid,
			@Param(value = "day") String day);

	List<HashMap<String, Object>> statPeriodByMonth(@Param(value = "deviceid") String deviceid,
			@Param(value = "month") String month);

	HashMap<String, Object> statCatalogByDeviceDay(@Param(value = "deviceid") String deviceid,
			@Param(value = "day") String day);

	HashMap<String, Object> statCatalogByDeviceMonth(@Param(value = "deviceid") String deviceid,
			@Param(value = "month") String month);

	HashMap<String, Object> statCatalogByOrgDay(@Param(value = "orgid") String orgid, @Param(value = "day") String day);

	HashMap<String, Object> statCatalogByOrgMonth(@Param(value = "orgid") String orgid,
			@Param(value = "month") String month);

	// int insert(Hourflowlog record);

	int insertSelective(Hourflowlog record);

	int updateByPrimaryKeySelective(Hourflowlog record);

	// int updateByPrimaryKey(Hourflowlog record);
}