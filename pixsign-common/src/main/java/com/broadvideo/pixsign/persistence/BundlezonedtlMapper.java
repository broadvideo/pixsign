package com.broadvideo.pixsign.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Bundlezonedtl;

public interface BundlezonedtlMapper {
	Bundlezonedtl selectByPrimaryKey(@Param(value = "bundlezonedtlid") String bundlezonedtlid);

	List<Bundlezonedtl> selectList(@Param(value = "bundlezoneid") String bundlezoneid);

	int deleteByPrimaryKey(@Param(value = "bundlezonedtlid") String bundlezonedtlid);

	int deleteByBundlezone(@Param(value = "bundlezoneid") String bundlezoneid);

	int deleteByObj(@Param(value = "objtype") String objtype, @Param(value = "objid") String objid);

	// int insert(Bundlezonedtl record);

	int insertSelective(Bundlezonedtl record);

	int updateByPrimaryKeySelective(Bundlezonedtl record);

	// int updateByPrimaryKey(Bundlezonedtl record);
}