package com.broadvideo.pixsign.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Bundlezone;

public interface BundlezoneMapper {
	Bundlezone selectByPrimaryKey(@Param(value = "bundlezoneid") String bundlezoneid);

	List<Bundlezone> selectList(@Param(value = "bundleid") String bundleid);

	int deleteByPrimaryKey(@Param(value = "bundlezoneid") String bundlezoneid);

	// int insert(Bundlezone record);

	int insertSelective(Bundlezone record);

	int updateByPrimaryKeySelective(Bundlezone record);

	int updateByPrimaryKeyWithBLOBs(Bundlezone record);

	// int updateByPrimaryKey(Bundlezone record);
}