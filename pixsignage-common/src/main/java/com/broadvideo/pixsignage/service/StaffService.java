package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Staff;

public interface StaffService {
	public int selectCount(String subsystem, String vspid, String orgid, String search);

	public List<Staff> selectList(String subsystem, String vspid, String orgid, String search, String start,
			String length);

	public void addStaff(Staff staff);

	public void updateStaff(Staff staff);

	public boolean updatePassword(Staff staff);

	public void resetPassword(String staffid);

	public void deleteStaff(String staffid);

	public boolean validateLoginname(Staff staff);
}
