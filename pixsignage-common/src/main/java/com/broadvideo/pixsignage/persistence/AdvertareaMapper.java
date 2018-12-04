package com.broadvideo.pixsignage.persistence;

import com.broadvideo.pixsignage.domain.Advertarea;

public interface AdvertareaMapper {
    int deleteByPrimaryKey(Integer advertareaid);

    int insert(Advertarea record);

    int insertSelective(Advertarea record);

    Advertarea selectByPrimaryKey(Integer advertareaid);

    int updateByPrimaryKeySelective(Advertarea record);

    int updateByPrimaryKey(Advertarea record);
}