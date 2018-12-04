package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Model;

public interface ModelMapper {
	Model selectByPrimaryKey(@Param(value = "modelid") String modelid);

	List<Model> selectList();

	// int deleteByPrimaryKey(@Param(value = "modelid") String modelid);

	// int insert(Model record);

	int insertSelective(Model record);

	int updateByPrimaryKeySelective(Model record);

	// int updateByPrimaryKey(Model record);

	int updateCurrentdevices();
}