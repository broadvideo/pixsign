package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Schedulefile;

public interface SchedulefileMapper {
    Schedulefile selectByPrimaryKey(Integer schedulefileid);
    int selectCountBySchedule(@Param(value="scheduleid") String scheduleid);
    List<Schedulefile> selectBySchedule(@Param(value="scheduleid") String scheduleid, 
    		@Param(value="start") String start, @Param(value="length") String length);
    List<Schedulefile> selectByFile(@Param(value="deviceid") String deviceid, 
    		@Param(value="filetype") String filetype, @Param(value="fileid") String fileid);
    List<Schedulefile> selectDownloadingFileBySchedule(@Param(value="scheduleid") String scheduleid);
    long selectFilesizecompleteBySchedule(@Param(value="scheduleid") String scheduleid);

    int insert(Schedulefile record);
    int insertSelective(Schedulefile record);
    int updateByPrimaryKeySelective(Schedulefile record);
    int updateByPrimaryKey(Schedulefile record);
    int deleteByKeys(String ids);
    int deleteBySchedule(@Param(value="scheduleid") String scheduleid);
}