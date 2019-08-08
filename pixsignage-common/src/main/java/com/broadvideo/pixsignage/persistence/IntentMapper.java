package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Intent;

public interface IntentMapper {
	Intent selectByPrimaryKey(@Param(value = "intentid") String intentid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "search") String search);

	List<Intent> selectList(@Param(value = "orgid") String orgid, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "intentid") String intentid);

	// int insert(Intent record);

	int insertSelective(Intent record);

	int updateByPrimaryKeySelective(Intent record);

	// int updateByPrimaryKey(Intent record);
}