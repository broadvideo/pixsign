package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Routeguide;

public interface RouteguideMapper {
	Routeguide selectByPrimaryKey(@Param(value = "routeguideid") String routeguideid);

	List<Routeguide> selectList();

	Routeguide selectByCode(@Param(value = "code") String code);

	int deleteByPrimaryKey(@Param(value = "routeguideid") String routeguideid);

	// int insert(Routeguide record);

	int insertSelective(Routeguide record);

	int updateByPrimaryKeySelective(Routeguide record);

	// int updateByPrimaryKey(Routeguide record);

}