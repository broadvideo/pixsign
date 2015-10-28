package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Config;

public interface ConfigMapper {
	List<Config> selectList();

	Config selectByCode(@Param(value = "code") String code);

	String selectValueByCode(@Param(value = "code") String code);

	int updateByPrimaryKeySelective(Config record);

	// int updateByPrimaryKey(Config record);
}