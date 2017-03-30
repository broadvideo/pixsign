package com.broadvideo.pixsignage.persistence;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Hourplaylog;

public interface HourplaylogMapper {
	Hourplaylog selectByPrimaryKey(@Param(value = "hourplaylogid") String hourplaylogid);

	Hourplaylog selectByDetail(@Param(value = "deviceid") String deviceid, @Param(value = "mediatype") String mediatype,
			@Param(value = "mediaid") String mediaid, @Param(value = "hour") String hour);

	List<HashMap<String, Object>> statByPeriod(@Param(value = "deviceid") String deviceid,
			@Param(value = "from") String from, @Param(value = "to") String to);

	List<HashMap<String, Object>> statByHour(@Param(value = "deviceid") String deviceid,
			@Param(value = "hour") String hour);

	List<HashMap<String, Object>> statByDay(@Param(value = "deviceid") String deviceid,
			@Param(value = "day") String day);

	List<HashMap<String, Object>> statByMonth(@Param(value = "deviceid") String deviceid,
			@Param(value = "month") String month);

	int deleteByPrimaryKey(@Param(value = "hourplaylogid") String hourplaylogid);

	// int insert(Hourplaylog record);

	int insertSelective(Hourplaylog record);

	int updateByPrimaryKeySelective(Hourplaylog record);

	// int updateByPrimaryKey(Hourplaylog record);
}