package com.broadvideo.signage.persistence;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Metroplatform;

public interface MetroplatformMapper {
	Metroplatform selectByPrimaryKey(Integer metroplatformid);

	Metroplatform select(@Param(value = "metrolineid") String metrolineid,
			@Param(value = "metrostationid") String metrostationid, @Param(value = "direction") String direction);

	int deleteByPrimaryKey(Integer metroplatformid);

	int insert(Metroplatform record);

	int insertSelective(Metroplatform record);

	int updateByPrimaryKeySelective(Metroplatform record);

	int updateByPrimaryKey(Metroplatform record);
}