package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Org;

public interface OrgMapper {
	Org selectByPrimaryKey(Integer orgid);

	List<Org> selectList();

	List<Org> selectByName(@Param(value = "name") String name);

	Org selectByCode(@Param(value = "code") String code);

	int deleteByKeys(String ids);

	int insert(Org record);

	int insertSelective(Org record);

	int updateByPrimaryKeySelective(Org record);

	int updateByPrimaryKey(Org record);

	int updateCurrentdevices();

	int updateCurrentstorage();
}