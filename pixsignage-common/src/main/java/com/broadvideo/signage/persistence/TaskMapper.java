package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Task;

public interface TaskMapper {
	Task selectByPrimaryKey(Integer taskid);
    int selectCount(@Param(value="orgid") int orgid, @Param(value="branchid") int branchid, @Param(value="search") String search);
    List<Task> selectList(@Param(value="orgid") int orgid, @Param(value="branchid") int branchid, @Param(value="search") String search, 
    		@Param(value="start") String start, @Param(value="length") String length);

    int insert(Task record);
    int insertSelective(Task record);
    int updateByPrimaryKeySelective(Task record);
    int updateByPrimaryKey(Task record);
    int deleteByKeys(String ids);
}