package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Playlog;

public interface PlaylogMapper {
	Playlog selectByPrimaryKey(@Param(value = "playlogid") String playlogid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid);

	List<Playlog> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "start") String start, @Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "playlogid") String playlogid);

	// int insert(Playlog record);

	int insertSelective(Playlog record);

	int updateByPrimaryKeySelective(Playlog record);

	// int updateByPrimaryKey(Playlog record);
}