package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Sdomain;

public interface SdomainMapper {
	Sdomain selectByPrimaryKey(@Param(value = "sdomainid") String sdomainid);

	List<Sdomain> selectList();

	List<Sdomain> selectByName(@Param(value = "name") String name);

	Sdomain selectByCode(@Param(value = "code") String code);

	int deleteByPrimaryKey(@Param(value = "sdomainid") String sdomainid);

	// int insert(Sdomain record);

	int insertSelective(Sdomain record);

	int updateByPrimaryKeySelective(Sdomain record);

	// int updateByPrimaryKey(Sdomain record);
}