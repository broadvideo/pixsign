package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Batch;

public interface BatchMapper {
	Batch selectByPrimaryKey(@Param(value = "batchid") String batchid);

	int selectCount(@Param(value = "search") String search);

	List<Batch> selectList(@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	// int deleteByPrimaryKey(@Param(value = "batchid") String batchid);

	// int insert(Batch record);

	int insertSelective(Batch record);

	int updateByPrimaryKeySelective(Batch record);

	// int updateByPrimaryKey(Batch record);

	int updateCurrentdevices();
}