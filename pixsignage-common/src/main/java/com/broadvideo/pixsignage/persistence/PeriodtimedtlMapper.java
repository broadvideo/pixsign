package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Periodtimedtl;

public interface PeriodtimedtlMapper {
	int deleteByPrimaryKey(Integer periodtimedtlid);
    int insert(Periodtimedtl record);

    int insertSelective(Periodtimedtl record);

	Periodtimedtl selectByPrimaryKey(Integer periodtimedtlid);

	List<Periodtimedtl> selectPeriodTimeDtls(@Param("coursescheduleschemeid") Integer coursescheduleschemeid,
			@Param("orgid") Integer orgid);

    int updateByPrimaryKeySelective(Periodtimedtl record);

    int updateByPrimaryKey(Periodtimedtl record);

	int countPeriodDtlsBy(@Param("coursescheduleschemeid") Integer coursescheduleschemeid, @Param("orgid") Integer orgid);
}