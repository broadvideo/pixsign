package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Schedule;

public interface ScheduleMapper {	
    Schedule selectByPrimaryKey(Integer scheduleid);
	List<Schedule> selectListToSyncByDevice(@Param(value="deviceid") String deviceid);
	List<Schedule> selectByDevice(@Param(value="deviceid") String deviceid);
	List<Schedule> selectByDeviceAndDate(@Param(value="deviceid") String deviceid,
			@Param(value="date") String date);
	int selectCountByTask(@Param(value="taskid") String taskid);
	List<Schedule> selectByTask(@Param(value="taskid") String taskid, 
			@Param(value="start") String start, @Param(value="length") String length);
	List<Schedule> selectByLayout(@Param(value="layoutid") String layoutid);
	
    int deleteByKeys(String ids);
    int insert(Schedule record);
    int insertSelective(Schedule record);
    int updateStatusByDevice(@Param(value="deviceid") String deviceid, @Param(value="status") String status);
    int updateByPrimaryKeySelective(Schedule record);
    int updateByPrimaryKey(Schedule record);
}