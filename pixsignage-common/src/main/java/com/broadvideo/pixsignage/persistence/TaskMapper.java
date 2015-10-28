package com.broadvideo.pixsignage.persistence;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Task;

public interface TaskMapper {
	Task selectByPrimaryKey(@Param(value = "taskid") String taskid);

	int deleteByPrimaryKey(@Param(value = "taskid") String taskid);

	// int insert(Task record);

	int insertSelective(Task record);

	int updateByPrimaryKeySelective(Task record);

	// int updateByPrimaryKey(Task record);
}