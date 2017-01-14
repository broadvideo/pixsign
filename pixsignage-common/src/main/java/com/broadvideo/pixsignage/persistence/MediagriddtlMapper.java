package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Mediagriddtl;

public interface MediagriddtlMapper {
	Mediagriddtl selectByPrimaryKey(@Param(value = "mediagriddtlid") String mediagriddtlid);

	List<Mediagriddtl> selectList(@Param(value = "mediagridid") String mediagridid);

	int deleteByPrimaryKey(@Param(value = "mediagriddtlid") String mediagriddtlid);

	// int insert(Mediagriddtl record);

	int insertSelective(Mediagriddtl record);

	int updateByPrimaryKeySelective(Mediagriddtl record);

	// int updateByPrimaryKey(Mediagriddtl record);
}