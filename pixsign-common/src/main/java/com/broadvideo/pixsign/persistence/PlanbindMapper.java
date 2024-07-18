package com.broadvideo.pixsign.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Planbind;

public interface PlanbindMapper {
	Planbind selectByPrimaryKey(@Param(value = "planbindid") String planbindid);

	List<Planbind> selectList(@Param(value = "planid") String planid);

	int deleteByPrimaryKey(@Param(value = "planbindid") String planbindid);

	int deleteByPlan(@Param(value = "planid") String planid);

	// int insert(Planbind record);

	int insertSelective(Planbind record);

	int updateByPrimaryKeySelective(Planbind record);

	// int updateByPrimaryKey(Planbind record);
}