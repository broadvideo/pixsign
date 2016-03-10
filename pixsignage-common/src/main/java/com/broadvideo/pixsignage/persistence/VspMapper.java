package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Vsp;

public interface VspMapper {
	Vsp selectByPrimaryKey(@Param(value = "vspid") String vspid);

	List<Vsp> selectList();

	List<Vsp> selectByName(@Param(value = "name") String name);

	Vsp selectByCode(@Param(value = "code") String code);

	int deleteByPrimaryKey(@Param(value = "vspid") String vspid);

	// int insert(Vsp record);

	int insertSelective(Vsp record);

	int updateByPrimaryKeySelective(Vsp record);

	// int updateByPrimaryKey(Vsp record);
}