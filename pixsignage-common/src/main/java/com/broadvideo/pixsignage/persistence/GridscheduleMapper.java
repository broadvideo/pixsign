package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Gridschedule;

public interface GridscheduleMapper {
	Gridschedule selectByPrimaryKey(@Param(value = "gridscheduleid") String gridscheduleid);

	List<Gridschedule> selectList(@Param(value = "devicegridid") String devicegridid,
			@Param(value = "playmode") String playmode, @Param(value = "fromdate") String fromdate,
			@Param(value = "todate") String todate);

	List<Integer> selectDevicegridByMediagrid(@Param(value = "mediagridid") String mediagridid);

	int deleteByPrimaryKey(@Param(value = "gridscheduleid") String gridscheduleid);

	int deleteByDtl(@Param(value = "devicegridid") String devicegridid, @Param(value = "playmode") String playmode,
			@Param(value = "playdate") String playdate, @Param(value = "starttime") String starttime);

	// int insert(Gridschedule record);

	int insertSelective(Gridschedule record);

	int updateByPrimaryKeySelective(Gridschedule record);

	// int updateByPrimaryKey(Gridschedule record);
}