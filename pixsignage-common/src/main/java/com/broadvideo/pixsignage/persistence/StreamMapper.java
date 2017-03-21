package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Stream;

public interface StreamMapper {
	Stream selectByPrimaryKey(@Param(value = "streamid") String streamid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search);

	List<Stream> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "streamid") String streamid);

	// int insert(Stream record);

	int insertSelective(Stream record);

	int updateByPrimaryKeySelective(Stream record);

	// int updateByPrimaryKey(Stream record);
}