package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Layout;

public interface LayoutMapper {
	Layout selectByPrimaryKey(@Param(value = "layoutid") String layoutid);

	List<Layout> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "type") String type);

	int deleteByPrimaryKey(@Param(value = "layoutid") String layoutid);

	// int insert(Layout record);

	int insertSelective(Layout record);

	int updateByPrimaryKeySelective(Layout record);

	// int updateByPrimaryKey(Layout record);
}