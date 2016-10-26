package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Bundle;

public interface BundleMapper {
	Bundle selectByPrimaryKey(@Param(value = "bundleid") String bundleid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "reviewflag") String reviewflag, @Param(value = "touchflag") String touchflag,
			@Param(value = "homeflag") String homeflag, @Param(value = "search") String search);

	List<Bundle> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "reviewflag") String reviewflag, @Param(value = "touchflag") String touchflag,
			@Param(value = "homeflag") String homeflag, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	List<Bundle> selectByLayout(@Param(value = "layoutid") String layoutid);

	List<Bundle> selectSubList(@Param(value = "homebundleid") String homebundleid);

	int deleteByPrimaryKey(@Param(value = "bundleid") String bundleid);

	// int insert(Bundle record);

	int insertSelective(Bundle record);

	int updateByPrimaryKeySelective(Bundle record);

	// int updateByPrimaryKey(Bundle record);
}