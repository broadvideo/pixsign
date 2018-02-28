package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Templetzonedtl;

public interface TempletzonedtlMapper {
	Templetzonedtl selectByPrimaryKey(@Param(value = "templetzonedtlid") String templetzonedtlid);

	List<Templetzonedtl> selectList(@Param(value = "templetzoneid") String templetzoneid);

	int deleteByPrimaryKey(@Param(value = "templetzonedtlid") String templetzonedtlid);

	int deleteByTempletzone(@Param(value = "templetzoneid") String templetzoneid);

	int deleteByObj(@Param(value = "objtype") String objtype, @Param(value = "objid") String objid);

	// int insert(Templetzonedtl record);

	int insertSelective(Templetzonedtl record);

	int updateByPrimaryKeySelective(Templetzonedtl record);

	// int updateByPrimaryKey(Templetzonedtl record);
}