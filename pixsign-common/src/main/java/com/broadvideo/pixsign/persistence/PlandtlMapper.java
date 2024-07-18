package com.broadvideo.pixsign.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Plandtl;

public interface PlandtlMapper {
	Plandtl selectByPrimaryKey(@Param(value = "plandtlid") String plandtlid);

	List<Plandtl> selectList(@Param(value = "planid") String planid);

	int deleteByPrimaryKey(@Param(value = "plandtlid") String plandtlid);

	int deleteByPlan(@Param(value = "planid") String planid);

	int deleteByObj(@Param(value = "objtype") String objtype, @Param(value = "objid") String objid);

	// int insert(Plandtl record);

	int insertSelective(Plandtl record);

	int updateByPrimaryKeySelective(Plandtl record);

	// int updateByPrimaryKey(Plandtl record);
}