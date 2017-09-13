package com.broadvideo.pixsignage.persistence;

import com.broadvideo.pixsignage.domain.Dailyflowlog;

public interface DailyflowlogMapper {
    int deleteByPrimaryKey(Integer dailyflowlogid);

    int insert(Dailyflowlog record);

    int insertSelective(Dailyflowlog record);

    Dailyflowlog selectByPrimaryKey(Integer dailyflowlogid);

    int updateByPrimaryKeySelective(Dailyflowlog record);

    int updateByPrimaryKey(Dailyflowlog record);
}