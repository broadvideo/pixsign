package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Templatezonedtl;

public interface TemplatezonedtlMapper {
	Templatezonedtl selectByPrimaryKey(@Param(value = "templatezonedtlid") String templatezonedtlid);

	List<Templatezonedtl> selectList(@Param(value = "templatezoneid") String templatezoneid);

	int deleteByPrimaryKey(@Param(value = "templatezonedtlid") String templatezonedtlid);

	int deleteByTemplatezone(@Param(value = "templatezoneid") String templatezoneid);

	int deleteByObj(@Param(value = "objtype") String objtype, @Param(value = "objid") String objid);

	// int insert(Templatezonedtl record);

	int insertSelective(Templatezonedtl record);

	int updateByPrimaryKeySelective(Templatezonedtl record);

	// int updateByPrimaryKey(Templatezonedtl record);
}