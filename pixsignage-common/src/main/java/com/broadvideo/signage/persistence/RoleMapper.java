package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Role;

public interface RoleMapper {
    Role selectByPrimaryKey(Integer roleid);
    List<Role> selectList(@Param(value="subsystem") String subsystem, 
    		@Param(value="vspid") String vspid, @Param(value="orgid") String orgid);

    int deleteByKeys(String ids);
    int deleteStaffroleByRoles(String ids);
    int deleteRoleprivilegeByRoles(String ids);

    int insert(Role record);
    int insertSelective(Role record);
    
    int insertRoleprivilege(@Param(value="roleid") String roleid, @Param(value="privilegeid") String privilegeid);

    int updateByPrimaryKeySelective(Role record);
    int updateByPrimaryKey(Role record);
}