package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Org;

public interface OrgMapper {
	Org selectByPrimaryKey(@Param(value = "orgid") String orgid);

	List<Org> selectList(@Param(value = "vspid") String vspid, @Param(value = "orgid") String orgid);

	List<Org> selectByName(@Param(value = "name") String name);

	Org selectByCode(@Param(value = "code") String code);

	int deleteByPrimaryKey(@Param(value = "orgid") String orgid);

	// int insert(Org record);

	int insertSelective(Org record);

	int updateByPrimaryKeySelective(Org record);

	// int updateByPrimaryKey(Org record);

	int updateCurrentdevices();

	int updateCurrentstorage();
}