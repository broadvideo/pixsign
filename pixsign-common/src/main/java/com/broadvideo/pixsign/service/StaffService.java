package com.broadvideo.pixsign.service;

import java.util.List;

import com.broadvideo.pixsign.domain.Staff;

public interface StaffService {
	public int selectCount(String subsystem, String orgid, String branchid, String search);

	public List<Staff> selectList(String subsystem, String orgid, String branchid, String search,
			String start, String length);

	public void addStaff(Staff staff);

	public void updateStaff(Staff staff);

	public boolean updatePassword(Staff staff);

	public void resetPassword(String staffid);

	public void deleteStaff(String staffid);

	public boolean validateLoginname(Staff staff);

	Integer syncStaff(Staff staff, Integer orgid);
}
