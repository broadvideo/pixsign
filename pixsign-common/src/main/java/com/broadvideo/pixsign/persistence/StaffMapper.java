package com.broadvideo.pixsign.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Privilege;
import com.broadvideo.pixsign.domain.Staff;

public interface StaffMapper {
	Staff selectByPrimaryKey(@Param(value = "staffid") String staffid);

	int selectCount(@Param(value = "subsystem") String subsystem, 
			@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search);

	List<Staff> selectList(@Param(value = "subsystem") String subsystem, 
			@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	List<Staff> selectBranchStaffs(@Param("branchid") String branchid, @Param("orgid") String orgid);

	List<Staff> selectByLoginname(@Param(value = "loginname") String loginname);

	Staff selectByToken(@Param(value = "token") String token);

	Staff selectBySource(@Param(value = "sourcetype") String sourcetype, @Param(value = "sourceid") String sourceid);

	Staff selectByUuid(@Param("uuid") String uuid, @Param("orgid") String orgid);

	Staff login(@Param(value = "loginname") String loginname, @Param(value = "password") String password);

	int deleteByPrimaryKey(@Param(value = "staffid") String staffid);

	int deleteByOrg(@Param(value = "orgid") String orgid);

	// int insert(Staff record);

	int insertSelective(Staff record);

	int updateByPrimaryKeySelective(Staff record);

	// int updateByPrimaryKey(Staff record);

	int clearStaffPrivileges(@Param(value = "staff") Staff staff);

	int assignStaffPrivileges(@Param(value = "staff") Staff staff,
			@Param(value = "privileges") List<Privilege> privileges);

	int changeBranch(@Param(value = "branchid1") String branchid1, @Param(value = "branchid2") String branchid2);

}