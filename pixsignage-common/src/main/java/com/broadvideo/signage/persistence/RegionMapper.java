package com.broadvideo.signage.persistence;

import com.broadvideo.signage.domain.Region;

public interface RegionMapper {
    Region selectByPrimaryKey(Integer regionid);

    int deleteByPrimaryKey(Integer regionid);
    int deleteByLayout(Integer layoutid);

    int insert(Region record);
    int insertSelective(Region record);

    int updateByPrimaryKeySelective(Region record);
    int updateByPrimaryKey(Region record);
}