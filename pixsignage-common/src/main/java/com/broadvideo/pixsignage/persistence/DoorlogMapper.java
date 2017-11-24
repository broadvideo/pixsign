package com.broadvideo.pixsignage.persistence;

import com.broadvideo.pixsignage.domain.Doorlog;

public interface DoorlogMapper {
    int deleteByPrimaryKey(Integer doorlogid);

    int insert(Doorlog record);

    int insertSelective(Doorlog record);

    Doorlog selectByPrimaryKey(Integer doorlogid);

    int updateByPrimaryKeySelective(Doorlog record);

    int updateByPrimaryKey(Doorlog record);
}