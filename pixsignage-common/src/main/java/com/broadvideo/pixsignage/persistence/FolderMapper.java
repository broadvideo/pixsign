package com.broadvideo.pixsignage.persistence;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Folder;

public interface FolderMapper {
	Folder selectByPrimaryKey(@Param(value = "folderid") String folderid);

	Folder selectRoot(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid);

	int deleteByPrimaryKey(@Param(value = "folderid") String folderid);

	// int insert(Folder record);

	int insertSelective(Folder record);

	int updateByPrimaryKeySelective(Folder record);

	// int updateByPrimaryKey(Folder record);
}