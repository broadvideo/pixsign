package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Gridscheduledtl;

public interface GridscheduledtlMapper {
	Gridscheduledtl selectByPrimaryKey(@Param(value = "gridscheduledtlid") String gridscheduledtlid);

	List<Gridscheduledtl> selectList(@Param(value = "gridscheduleid") String gridscheduleid);

	int deleteByPrimaryKey(@Param(value = "gridscheduledtlid") String gridscheduledtlid);

	int deleteByDtl(@Param(value = "devicegridid") String devicegridid, @Param(value = "playmode") String playmode,
			@Param(value = "playdate") String playdate, @Param(value = "starttime") String starttime);

	int deleteByGridschedule(@Param(value = "gridscheduleid") String gridscheduleid);

	int deleteByMediagrid(@Param(value = "mediagridid") String mediagridid);

	// int insert(Gridscheduledtl record);

	int insertSelective(Gridscheduledtl record);

	int updateByPrimaryKeySelective(Gridscheduledtl record);

	// int updateByPrimaryKey(Gridscheduledtl record);
}