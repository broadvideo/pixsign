package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Deviceevent;

public interface DeviceeventMapper {
    Deviceevent selectByPrimaryKey(Integer deviceeventid);
    int selectCount(@Param(value="deviceid") String deviceid);
    List<Deviceevent> selectList(@Param(value="deviceid") String deviceid, 
    		@Param(value="start") String start, @Param(value="length") String length);

    int insert(Deviceevent record);
    int insertSelective(Deviceevent record);
}