package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Devicelog;

public interface DevicelogMapper {
    Devicelog selectByPrimaryKey(Integer devicelogid);
    int selectCount(@Param(value="deviceid") String deviceid);
    List<Devicelog> selectList(@Param(value="deviceid") String deviceid, 
    		@Param(value="start") String start, @Param(value="length") String length);

    int insert(Devicelog record);
    int insertSelective(Devicelog record);
}