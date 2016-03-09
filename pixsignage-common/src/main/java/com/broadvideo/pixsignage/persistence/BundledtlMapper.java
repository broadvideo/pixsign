package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Bundledtl;

public interface BundledtlMapper {
	Bundledtl selectByPrimaryKey(@Param(value = "bundledtlid") String bundledtlid);

	List<Bundledtl> selectList(@Param(value = "bundleid") String bundleid);

	Bundledtl selectByRegion(@Param(value = "bundleid") String bundleid, @Param(value = "regionid") String regionid);

	int deleteByPrimaryKey(@Param(value = "bundledtlid") String bundledtlid);

	int clearByObj(@Param(value = "objtype") String objtype, @Param(value = "objid") String objid);

	// int insert(Bundledtl record);

	int insertSelective(Bundledtl record);

	int updateByPrimaryKeySelective(Bundledtl record);

	// int updateByPrimaryKey(Bundledtl record);
}