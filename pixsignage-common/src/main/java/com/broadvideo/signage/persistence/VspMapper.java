package com.broadvideo.signage.persistence;

import com.broadvideo.signage.domain.Vsp;

public interface VspMapper {
    int deleteByPrimaryKey(Integer vspid);

    int insert(Vsp record);

    int insertSelective(Vsp record);

    Vsp selectByPrimaryKey(Integer vspid);

    int updateByPrimaryKeySelective(Vsp record);

    int updateByPrimaryKey(Vsp record);
}