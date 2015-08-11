package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Config;

public interface ConfigMapper {
	Config selectByPrimaryKey(Integer configid);

	List<Config> selectList();

	Config selectByCode(@Param(value = "code") String code);

	String selectValueByCode(@Param(value = "code") String code);

	int deleteByPrimaryKey(Integer configid);

	int insert(Config record);

	int insertSelective(Config record);

	int updateByPrimaryKeySelective(Config record);

	int updateByPrimaryKey(Config record);
}