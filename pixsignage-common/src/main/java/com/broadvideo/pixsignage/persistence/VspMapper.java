package com.broadvideo.pixsignage.persistence;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Vsp;

public interface VspMapper {
	Vsp selectByPrimaryKey(@Param(value = "vspid") String vspid);

	int deleteByPrimaryKey(@Param(value = "vspid") String vspid);

	// int insert(Vsp record);

	int insertSelective(Vsp record);

	int updateByPrimaryKeySelective(Vsp record);

	// int updateByPrimaryKey(Vsp record);
}