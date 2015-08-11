package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Schedule;
import com.broadvideo.signage.domain.Schedulefile;

public interface SchedulefileService {
	public int selectCountBySchedule(String scheduleid);
	public List<Schedulefile> selectBySchedule(String scheduleid, String start, String length);
	public List<Schedulefile> selectByFile(String deviceid, String filetype, String fileid);
	public List<Schedulefile> selectDownloadingFileBySchedule(String scheduleid);
	public long selectFilesizecompleteBySchedule(String scheduleid);
	
	public void addSchedulefile(Schedulefile schedulefile);
	public void updateSchedulefile(Schedulefile schedulefile);
	public void deleteSchedulefile(String[] ids);
	
	public void insertSchedulefileBySchedule(Schedule schedule);
}
