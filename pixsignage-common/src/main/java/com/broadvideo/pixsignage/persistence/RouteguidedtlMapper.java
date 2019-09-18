package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Routeguidedtl;

public interface RouteguidedtlMapper {
	Routeguidedtl selectByPrimaryKey(@Param(value = "routeguidedtlid") String routeguidedtlid);

	List<Routeguidedtl> selectList(@Param(value = "routeguideid") String routeguideid);

	int deleteByPrimaryKey(@Param(value = "routeguidedtlid") String routeguidedtlid);

	// int insert(Routeguidedtl record);

	int insertSelective(Routeguidedtl record);

	int updateByPrimaryKeySelective(Routeguidedtl record);

	// int updateByPrimaryKey(Routeguidedtl record);

}