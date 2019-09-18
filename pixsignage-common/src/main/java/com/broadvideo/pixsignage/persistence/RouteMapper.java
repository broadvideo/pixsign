package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Route;

public interface RouteMapper {
	Route selectByPrimaryKey(@Param(value = "routeid") String routeid);

	List<Route> selectList();

	Route selectByCode(@Param(value = "code") String code);

	int deleteByPrimaryKey(@Param(value = "routeid") String routeid);

	// int insert(Route record);

	int insertSelective(Route record);

	int updateByPrimaryKeySelective(Route record);

	// int updateByPrimaryKey(Route record);

}