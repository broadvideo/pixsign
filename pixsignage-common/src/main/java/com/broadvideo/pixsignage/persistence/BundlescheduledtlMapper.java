package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Bundlescheduledtl;

public interface BundlescheduledtlMapper {
	Bundlescheduledtl selectByPrimaryKey(@Param(value = "bundlescheduledtlid") String bundlescheduledtlid);

	List<Bundlescheduledtl> selectList(@Param(value = "bundlescheduleid") String bundlescheduleid);

	int deleteByPrimaryKey(@Param(value = "bundlescheduledtlid") String bundlescheduledtlid);

	int deleteByDtl(@Param(value = "bindtype") String bindtype, @Param(value = "bindid") String bindid,
			@Param(value = "playmode") String playmode, @Param(value = "playdate") String playdate,
			@Param(value = "starttime") String starttime);

	int deleteByBundleschedule(@Param(value = "bundlescheduleid") String bundlescheduleid);

	int deleteByBundle(@Param(value = "bundleid") String bundleid);

	// int insert(Bundlescheduledtl record);

	int insertSelective(Bundlescheduledtl record);

	int updateByPrimaryKeySelective(Bundlescheduledtl record);

	// int updateByPrimaryKey(Bundlescheduledtl record);
}