package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Catalog;

public interface CatalogMapper {
	Catalog selectByPrimaryKey(@Param(value = "catalogid") String catalogid);

	List<Catalog> selectList(@Param(value = "orgid") String orgid, @Param(value = "status") String status);

	int deleteByPrimaryKey(@Param(value = "catalogid") String catalogid);

	// int insert(Catalog record);

	int insertSelective(Catalog record);

	int updateByPrimaryKeySelective(Catalog record);

	// int updateByPrimaryKey(Catalog record);
}