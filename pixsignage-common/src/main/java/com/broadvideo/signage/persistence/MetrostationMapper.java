package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Metrostation;

public interface MetrostationMapper {
	Metrostation selectByPrimaryKey(@Param(value = "metrostationid") String metrostationid);

	List<Metrostation> selectByMetroline(@Param(value = "metrolineid") String metrolineid);

	int deleteByPrimaryKey(Integer metrostationid);

	int insert(Metrostation record);

	int insertSelective(Metrostation record);

	int updateByPrimaryKeySelective(Metrostation record);

	int updateByPrimaryKey(Metrostation record);
}