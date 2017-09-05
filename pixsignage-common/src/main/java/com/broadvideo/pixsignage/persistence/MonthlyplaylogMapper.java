package com.broadvideo.pixsignage.persistence;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Monthlyplaylog;

public interface MonthlyplaylogMapper {
	Monthlyplaylog selectByPrimaryKey(@Param(value = "monthlyplaylogid") String monthlyplaylogid);

	Monthlyplaylog selectByDetail(@Param(value = "deviceid") String deviceid,
			@Param(value = "mediatype") String mediatype, @Param(value = "mediaid") String mediaid,
			@Param(value = "month") String month);

	List<HashMap<String, Object>> statAll(@Param(value = "orgid") String orgid, @Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "monthlyplaylogid") String monthlyplaylogid);

	// int insert(Monthlyplaylog record);

	int insertSelective(Monthlyplaylog record);

	int updateByPrimaryKeySelective(Monthlyplaylog record);

	// int updateByPrimaryKey(Monthlyplaylog record);
}