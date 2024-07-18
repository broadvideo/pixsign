package com.broadvideo.pixsign.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Audio;

public interface AudioMapper {
	Audio selectByPrimaryKey(@Param(value = "audioid") String audioid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search);

	List<Audio> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "audioid") String audioid);

	// int insert(Audio record);

	int insertSelective(Audio record);

	int updateByPrimaryKeySelective(Audio record);

	// int updateByPrimaryKey(Audio record);
}