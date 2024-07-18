package com.broadvideo.pixsign.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Timezone;

public interface TimezoneMapper {
	Timezone selectByPrimaryKey(@Param(value = "timezoneid") String timezoneid);

	int selectCount(@Param(value = "search") String search);

	List<Timezone> selectList(@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);
}