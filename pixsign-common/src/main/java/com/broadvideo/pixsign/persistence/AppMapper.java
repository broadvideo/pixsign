package com.broadvideo.pixsign.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.App;

public interface AppMapper {
	App selectByPrimaryKey(@Param(value = "appid") String appid);

	App select(@Param(value = "name") String name, @Param(value = "mtype") String mtype);

	List<App> selectList();

	int deleteByPrimaryKey(@Param(value = "appid") String appid);

	// int insert(App record);

	int insertSelective(App record);

	int updateByPrimaryKeySelective(App record);

	// int updateByPrimaryKey(App record);
}