package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Pagezonedtl;

public interface PagezonedtlMapper {
	Pagezonedtl selectByPrimaryKey(@Param(value = "pagezonedtlid") String pagezonedtlid);

	List<Pagezonedtl> selectList(@Param(value = "pagezoneid") String pagezoneid);

	int deleteByPrimaryKey(@Param(value = "pagezonedtlid") String pagezonedtlid);

	int deleteByPagezone(@Param(value = "pagezoneid") String pagezoneid);

	int deleteByObj(@Param(value = "objtype") String objtype, @Param(value = "objid") String objid);

	// int insert(Pagezonedtl record);

	int insertSelective(Pagezonedtl record);

	int updateByPrimaryKeySelective(Pagezonedtl record);

	// int updateByPrimaryKey(Pagezonedtl record);
}