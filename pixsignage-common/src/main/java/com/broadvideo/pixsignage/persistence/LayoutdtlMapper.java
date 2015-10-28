package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Layoutdtl;

public interface LayoutdtlMapper {
	Layoutdtl selectByPrimaryKey(@Param(value = "layoutdtlid") String layoutdtlid);

	List<Layoutdtl> selectList(@Param(value = "layoutid") String layoutid);

	int deleteByPrimaryKey(@Param(value = "layoutdtlid") String layoutdtlid);

	// int insert(Layoutdtl record);

	int insertSelective(Layoutdtl record);

	int updateByPrimaryKeySelective(Layoutdtl record);

	// int updateByPrimaryKey(Layoutdtl record);
}