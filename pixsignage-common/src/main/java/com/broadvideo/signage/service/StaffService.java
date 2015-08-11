package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Staff;

public interface StaffService {
	public int selectCount(String subsystem, String vspid, String orgid, String search);
	public List<Staff> selectList(String subsystem, String vspid, String orgid, String search, String start, String length);
	List<Staff> selectByLoginname(String loginname, String subsystem, String vspid, String orgid);
	List<Staff> selectByOrgLogin(String loginname, String password, String orgcode);
	
	public void addStaff(Staff staff);
	public void updateStaff(Staff staff);
	public void resetPassword(Staff staff);
	public boolean updatePassword(Staff staff);
	public void deleteStaff(String[] ids);
	
	public boolean validateLoginname(Staff staff, String subsystem, String vspid, String orgid);
}
