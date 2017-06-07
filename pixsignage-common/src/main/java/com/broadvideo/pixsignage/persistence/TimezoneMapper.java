package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Timezone;

public interface TimezoneMapper {
	Timezone selectByPrimaryKey(@Param(value = "timezoneid") String timezoneid);

	int selectCount(@Param(value = "search") String search);

	List<Timezone> selectList(@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);
}