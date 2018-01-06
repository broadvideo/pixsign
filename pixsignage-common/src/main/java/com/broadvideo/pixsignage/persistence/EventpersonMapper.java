package com.broadvideo.pixsignage.persistence;

import com.broadvideo.pixsignage.domain.Eventperson;

public interface EventpersonMapper {
    int deleteByPrimaryKey(Integer eventpersonid);

    int insert(Eventperson record);

    int insertSelective(Eventperson record);

    Eventperson selectByPrimaryKey(Integer eventpersonid);

    int updateByPrimaryKeySelective(Eventperson record);

    int updateByPrimaryKey(Eventperson record);
}