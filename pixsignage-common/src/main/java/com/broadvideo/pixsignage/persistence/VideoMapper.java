package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.domain.Video;

public interface VideoMapper {
	Video selectByPrimaryKey(@Param(value = "videoid") String videoid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "type") String type, @Param(value = "search") String search);

	List<Video> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "type") String type, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	Video selectByUuid(@Param(value = "uuid") String uuid);

	int deleteByPrimaryKey(@Param(value = "videoid") String videoid);

	// int insert(Video record);

	int insertSelective(Video record);

	int updateByPrimaryKeySelective(Video record);

	// int updateByPrimaryKey(Video record);
}