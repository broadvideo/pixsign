package com.broadvideo.pixsignage.persistence;

import com.broadvideo.pixsignage.domain.Smartboxlog;

public interface SmartboxlogMapper {
    int deleteByPrimaryKey(Integer smartboxlogid);

    int insert(Smartboxlog record);

    int insertSelective(Smartboxlog record);

    Smartboxlog selectByPrimaryKey(Integer smartboxlogid);

    int updateByPrimaryKeySelective(Smartboxlog record);

    int updateByPrimaryKey(Smartboxlog record);
}