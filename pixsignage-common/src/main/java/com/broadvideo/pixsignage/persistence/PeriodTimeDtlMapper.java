package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.PeriodTimeDtl;

public interface PeriodTimeDtlMapper {
    int deleteByPrimaryKey(Integer id);
    int insert(PeriodTimeDtl record);

    int insertSelective(PeriodTimeDtl record);

    PeriodTimeDtl selectByPrimaryKey(Integer id);

	List<PeriodTimeDtl> selectPeriodTimeDtls(@Param("courseScheduleSchemeId") Integer courseScheduleSchemeId,
			@Param("orgId") Integer orgId);

    int updateByPrimaryKeySelective(PeriodTimeDtl record);

    int updateByPrimaryKey(PeriodTimeDtl record);

	int countPeriodDtlsBy(@Param("courseScheduleSchemeId") Integer courseScheduleSchemeId, @Param("orgId") Integer orgId);
}