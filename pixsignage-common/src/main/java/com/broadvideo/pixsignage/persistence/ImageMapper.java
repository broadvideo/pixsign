package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Image;

public interface ImageMapper {
	Image selectByPrimaryKey(@Param(value = "imageid") String imageid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "folderid") String folderid, @Param(value = "objtype") String objtype,
			@Param(value = "objid") String objid, @Param(value = "search") String search);

	List<Image> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "folderid") String folderid, @Param(value = "objtype") String objtype,
			@Param(value = "objid") String objid, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "imageid") String imageid);

	// int insert(Image record);

	int insertSelective(Image record);

	int updateByPrimaryKeySelective(Image record);

	// int updateByPrimaryKey(Image record);
}