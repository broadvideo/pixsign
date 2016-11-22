package com.broadvideo.pixsignage.persistence;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Wxinfo;

public interface WxinfoMapper {
	Wxinfo selectByPrimaryKey(@Param(value = "wxinfoid") String wxinfoid);

	Wxinfo selectByOrg(@Param(value = "orgid") String orgid);

	int deleteByPrimaryKey(@Param(value = "wxinfoid") String wxinfoid);

	// int insert(Wxinfo record);

	int insertSelective(Wxinfo record);

	int updateByPrimaryKeySelective(Wxinfo record);

	// int updateByPrimaryKey(Wxinfo record);
}