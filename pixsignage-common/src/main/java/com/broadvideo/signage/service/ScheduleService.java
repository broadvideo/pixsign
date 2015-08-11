package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Schedule;

public interface ScheduleService {
	public List<Schedule> selectListToSyncByDevice(String deviceid);
	public List<Schedule> selectByDevice(String deviceid);
	
	public int selectCountByTask(String taskid);
	public List<Schedule> selectByTask(String taskid, String start, String length);
	
	public void addSchedule(Schedule schedule);
	public void updateSchedule(Schedule schedule);
	public void deleteSchedule(String[] ids);
	
	public void batchAdd(List<Schedule> schedules);
	
}
