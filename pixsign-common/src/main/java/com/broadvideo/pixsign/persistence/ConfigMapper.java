package com.broadvideo.pixsign.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Config;

public interface ConfigMapper {
	List<Config> selectList();

	Config selectByCode(@Param(value = "code") String code);

	String selectValueByCode(@Param(value = "code") String code);

	int updateValue(@Param(value = "code") String code, @Param(value = "value") String value);

	int updateByPrimaryKeySelective(Config record);

	// int updateByPrimaryKey(Config record);
}