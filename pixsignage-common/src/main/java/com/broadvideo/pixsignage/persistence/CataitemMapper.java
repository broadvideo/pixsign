package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Cataitem;

public interface CataitemMapper {
	Cataitem selectByPrimaryKey(@Param(value = "cataitemid") String cataitemid);

	List<Cataitem> selectListByCatalog(@Param(value = "catalogid") String catalogid);

	int deleteByPrimaryKey(@Param(value = "cataitemid") String cataitemid);

	// int insert(Cataitem record);

	int insertSelective(Cataitem record);

	int updateByPrimaryKeySelective(Cataitem record);

	// int updateByPrimaryKey(Cataitem record);
}