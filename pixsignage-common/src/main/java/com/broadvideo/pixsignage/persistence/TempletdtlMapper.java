package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Templetdtl;

public interface TempletdtlMapper {
	Templetdtl selectByPrimaryKey(@Param(value = "templetdtlid") String templetdtlid);

	List<Templetdtl> selectList(@Param(value = "templetid") String templetid);

	int deleteByPrimaryKey(@Param(value = "templetdtlid") String templetdtlid);

	int clearByObj(@Param(value = "objtype") String objtype, @Param(value = "objid") String objid);

	// int insert(Templetdtl record);

	int insertSelective(Templetdtl record);

	int insertList(@Param(value = "templetdtls") List<Templetdtl> templetdtls);

	int updateByPrimaryKeySelective(Templetdtl record);

	// int updateByPrimaryKey(Templetdtl record);
}