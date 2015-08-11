package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Media;

public interface MediaMapper {
	Media selectByPrimaryKey(@Param(value = "mediaid") String mediaid);

	Media selectWithBLOBsByPrimaryKey(@Param(value = "mediaid") String mediaid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "type") String type, @Param(value = "genre") String genre,
			@Param(value = "search") String search);

	List<Media> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "type") String type, @Param(value = "genre") String genre,
			@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	int deleteByKeys(String ids);

	int insert(Media record);

	int insertSelective(Media record);

	int updateByPrimaryKeySelective(Media record);

	int updateByPrimaryKeyWithBLOBs(Media record);

	int updateByPrimaryKey(Media record);
}