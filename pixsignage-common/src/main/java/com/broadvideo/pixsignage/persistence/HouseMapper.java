package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.House;

public interface HouseMapper {
	House selectByPrimaryKey(@Param(value = "houseid") String houseid);

	int selectCount(@Param(value = "search") String search);

	List<House> selectList(@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	House selectByName(@Param(value = "name") String name);

	int deleteByPrimaryKey(@Param(value = "houseid") String houseid);

	// int insert(House record);

	int insertSelective(House record);

	int updateByPrimaryKeySelective(House record);

	// int updateByPrimaryKey(House record);
}