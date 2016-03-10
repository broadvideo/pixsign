package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.persistence.StaffMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

@Service("staffService")
public class StaffServiceImpl implements StaffService {

	@Autowired
	private StaffMapper staffMapper;

	public int selectCount(String subsystem, String vspid, String orgid, String search) {
		return staffMapper.selectCount(subsystem, vspid, orgid, search);
	}

	public List<Staff> selectList(String subsystem, String vspid, String orgid, String search, String start,
			String length) {
		return staffMapper.selectList(subsystem, vspid, orgid, search, start, length);
	}

	@Transactional
	public void addStaff(Staff staff) {
		String loginname = staff.getLoginname();
		staff.setPassword(CommonUtil.getPasswordMd5(loginname, staff.getPassword()));
		staffMapper.insertSelective(staff);
		staffMapper.updateByPrimaryKeySelective(staff);
		if (staff.getRoles().size() > 0) {
			staffMapper.assignStaffRoles(staff, staff.getRoles());
		}
	}

	@Transactional
	public void updateStaff(Staff staff) {
		staff.setPassword(null);
		staffMapper.updateByPrimaryKeySelective(staff);
		staffMapper.clearStaffRoles(staff);
		if (staff.getRoles().size() > 0) {
			staffMapper.assignStaffRoles(staff, staff.getRoles());
		}
	}

	@Transactional
	public void resetPassword(Staff staff) {
		Staff oldStaff = staffMapper.selectByPrimaryKey("" + staff.getStaffid());

		Staff newStaff = new Staff();
		newStaff.setStaffid(staff.getStaffid());
		newStaff.setPassword(CommonUtil.getPasswordMd5(oldStaff.getLoginname(), staff.getPassword()));
		staffMapper.updateByPrimaryKeySelective(newStaff);
	}

	@Transactional
	public boolean updatePassword(Staff staff) {
		Staff oldStaff = staffMapper.selectByPrimaryKey("" + staff.getStaffid());
		if (staff.getOldpassword() == null || staff.getOldpassword().trim().length() == 0) {
			return false;
		}
		if (!oldStaff.getPassword()
				.equals(CommonUtil.getPasswordMd5(oldStaff.getLoginname(), staff.getOldpassword()))) {
			return false;
		}

		Staff newStaff = new Staff();
		newStaff.setStaffid(staff.getStaffid());
		newStaff.setPassword(CommonUtil.getPasswordMd5(oldStaff.getLoginname(), staff.getPassword()));
		staffMapper.updateByPrimaryKeySelective(newStaff);
		return true;
	}

	@Transactional
	public void deleteStaff(String staffid) {
		staffMapper.deleteByPrimaryKey(staffid);
	}

	public boolean validateLoginname(Staff staff) {
		List<Staff> list = staffMapper.selectByLoginname(staff.getLoginname());
		if (list.size() == 0) {
			return true;
		} else {
			return (staff.getStaffid() == list.get(0).getStaffid());
		}
	}

}
