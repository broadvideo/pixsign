package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.App;

public interface AppMapper {
	App selectByPrimaryKey(@Param(value = "appid") String appid);

	List<App> selectList();

	int deleteByPrimaryKey(@Param(value = "appid") String appid);

	// int insert(App record);

	int insertSelective(App record);

	int updateByPrimaryKeySelective(App record);

	// int updateByPrimaryKey(App record);
}