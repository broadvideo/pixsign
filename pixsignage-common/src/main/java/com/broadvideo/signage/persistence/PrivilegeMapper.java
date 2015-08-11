package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Privilege;

public interface PrivilegeMapper {
    Privilege selectByPrimaryKey(Integer privilegeid);
    
    List<Privilege> selectVspTreeList();
    List<Privilege> selectOrgTreeList(@Param(value="orgtype") String orgtype);
}