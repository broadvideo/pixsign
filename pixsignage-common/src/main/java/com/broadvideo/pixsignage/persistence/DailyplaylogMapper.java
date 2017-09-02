package com.broadvideo.pixsignage.persistence;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Dailyplaylog;

public interface DailyplaylogMapper {
	Dailyplaylog selectByPrimaryKey(@Param(value = "dailyplaylogid") String dailyplaylogid);

	Dailyplaylog selectByDetail(@Param(value = "deviceid") String deviceid,
			@Param(value = "mediatype") String mediatype, @Param(value = "mediaid") String mediaid,
			@Param(value = "day") String day);

	List<HashMap<String, Object>> statByPeriod(@Param(value = "deviceid") String deviceid,
			@Param(value = "from") String from, @Param(value = "to") String to);

	List<HashMap<String, Object>> statByDay(@Param(value = "deviceid") String deviceid,
			@Param(value = "day") String day);

	List<HashMap<String, Object>> statByMonth(@Param(value = "deviceid") String deviceid,
			@Param(value = "month") String month);

	int deleteByPrimaryKey(@Param(value = "dailyplaylogid") String dailyplaylogid);

	// int insert(Dailyplaylog record);

	int insertSelective(Dailyplaylog record);

	int updateByPrimaryKeySelective(Dailyplaylog record);

	// int updateByPrimaryKey(Dailyplaylog record);
}