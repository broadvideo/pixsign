package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Medialistdtl;

public interface MedialistdtlMapper {
	Medialistdtl selectByPrimaryKey(@Param(value = "medialistdtlid") String medialistdtlid);

	List<Medialistdtl> selectList(@Param(value = "medialistid") String medialistid);

	int deleteByPrimaryKey(@Param(value = "medialistdtlid") String medialistdtlid);

	int deleteByMedialist(@Param(value = "medialistid") String medialistid);

	int deleteByObj(@Param(value = "objtype") String objtype, @Param(value = "objid") String objid);

	// int insert(Medialistdtl record);

	int insertSelective(Medialistdtl record);

	int updateByPrimaryKeySelective(Medialistdtl record);

	// int updateByPrimaryKey(Medialistdtl record);
}