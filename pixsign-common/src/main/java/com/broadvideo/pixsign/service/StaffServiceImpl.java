package com.broadvideo.pixsign.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsign.common.CommonConstants;
import com.broadvideo.pixsign.domain.Role;
import com.broadvideo.pixsign.domain.Staff;
import com.broadvideo.pixsign.persistence.StaffMapper;
import com.broadvideo.pixsign.util.CommonUtil;

@Service("staffService")
public class StaffServiceImpl implements StaffService {

	@Autowired
	private StaffMapper staffMapper;

	public int selectCount(String subsystem, String vspid, String orgid, String branchid, String search) {
		return staffMapper.selectCount(subsystem, vspid, orgid, branchid, search);
	}

	public List<Staff> selectList(String subsystem, String vspid, String orgid, String branchid, String search,
			String start, String length) {
		return staffMapper.selectList(subsystem, vspid, orgid, branchid, search, start, length);
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
	public void resetPassword(String staffid) {
		Staff staff = staffMapper.selectByPrimaryKey(staffid);
		staff.setPassword(CommonUtil.getPasswordMd5(staff.getLoginname(), staff.getLoginname()));
		staffMapper.updateByPrimaryKeySelective(staff);
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
			return (staff.getStaffid().intValue() == list.get(0).getStaffid().intValue());
		}
	}

	@Override
	public Integer syncStaff(Staff staff, Integer orgid) {
		Staff qStaff = this.staffMapper.selectByUuid(staff.getUuid(), orgid + "");
		staff.setOrgid(orgid);
		staff.setSubsystem(CommonConstants.SUBSYSTEM_ORG);
		staff.setPassword(staff.getUuid());
		staff.setRoles(new ArrayList<Role>());
		if (qStaff != null) {
			staff.setStaffid(qStaff.getStaffid());
			this.updateStaff(staff);
		} else {
			this.addStaff(staff);
		}
		return staff.getStaffid();
	}

}
