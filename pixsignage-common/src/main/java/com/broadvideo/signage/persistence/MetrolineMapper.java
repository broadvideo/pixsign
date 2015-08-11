package com.broadvideo.signage.persistence;

import java.util.List;

import com.broadvideo.signage.domain.Metroline;

public interface MetrolineMapper {
	Metroline selectByPrimaryKey(Integer metrolineid);

	List<Metroline> selectList();

	int deleteByPrimaryKey(Integer metrolineid);

	int insert(Metroline record);

	int insertSelective(Metroline record);

	int updateByPrimaryKeySelective(Metroline record);

	int updateByPrimaryKey(Metroline record);
}