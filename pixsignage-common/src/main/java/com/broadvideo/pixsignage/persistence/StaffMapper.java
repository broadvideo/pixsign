package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Privilege;
import com.broadvideo.pixsignage.domain.Role;
import com.broadvideo.pixsignage.domain.Staff;

public interface StaffMapper {
	Staff selectByPrimaryKey(@Param(value = "staffid") String staffid);

	int selectCount(@Param(value = "subsystem") String subsystem, @Param(value = "vspid") String vspid,
			@Param(value = "orgid") String orgid, @Param(value = "search") String search);

	List<Staff> selectList(@Param(value = "subsystem") String subsystem, @Param(value = "vspid") String vspid,
			@Param(value = "orgid") String orgid, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	List<Staff> selectByLoginname(@Param(value = "loginname") String loginname);

	Staff login(@Param(value = "loginname") String loginname, @Param(value = "password") String password);

	int deleteByPrimaryKey(@Param(value = "staffid") String staffid);

	// int insert(Staff record);

	int insertSelective(Staff record);

	int updateByPrimaryKeySelective(Staff record);

	// int updateByPrimaryKey(Staff record);

	int clearStaffPrivileges(@Param(value = "staff") Staff staff);

	int assignStaffPrivileges(@Param(value = "staff") Staff staff,
			@Param(value = "privileges") List<Privilege> privileges);

	int clearStaffRoles(@Param(value = "staff") Staff staff);

	int assignStaffRoles(@Param(value = "staff") Staff staff, @Param(value = "roles") List<Role> roles);

}