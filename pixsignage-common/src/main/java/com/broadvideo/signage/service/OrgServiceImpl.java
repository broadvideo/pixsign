package com.broadvideo.signage.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.signage.common.CommonConstants;
import com.broadvideo.signage.domain.Branch;
import com.broadvideo.signage.domain.Device;
import com.broadvideo.signage.domain.Org;
import com.broadvideo.signage.domain.Privilege;
import com.broadvideo.signage.domain.Staff;
import com.broadvideo.signage.persistence.BranchMapper;
import com.broadvideo.signage.persistence.DeviceMapper;
import com.broadvideo.signage.persistence.OrgMapper;
import com.broadvideo.signage.persistence.PrivilegeMapper;
import com.broadvideo.signage.persistence.StaffMapper;
import com.broadvideo.signage.util.CommonUtil;

@Service("orgService")
public class OrgServiceImpl implements OrgService {

	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private PrivilegeMapper privilegeMapper;
	@Autowired
	private BranchMapper branchMapper;
	@Autowired
	private DeviceMapper deviceMapper;

	public List<Org> selectList() {
		return orgMapper.selectList();
	}

	public Org selectByCode(String code) {
		return orgMapper.selectByCode(code);
	}

	public Org selectByPrimaryKey(Integer orgid) {
		return orgMapper.selectByPrimaryKey(orgid);
	}

	@Transactional
	public void addOrg(Org org) {
		org.setCurrentdeviceidx(org.getMaxdevices());
		orgMapper.insert(org);

		Branch branch = new Branch();
		branch.setOrgid(org.getOrgid());
		branch.setParentid(0);
		branch.setName("总部");
		branch.setCode(org.getCode() + "_TOP");
		branch.setStatus("1");
		branch.setDescription(org.getName() + "总部");
		branch.setCreatestaffid(org.getCreatestaffid());
		branchMapper.insert(branch);

		Staff staff = new Staff();
		staff.setOrgid(org.getOrgid());
		staff.setBranchid(branch.getBranchid());
		staff.setLoginname("admin");
		staff.setPassword(CommonUtil.getPasswordMd5("admin", "admin"));
		staff.setName("管理员");
		staff.setStatus("1");
		staff.setDescription(org.getName() + "管理员");
		staff.setSubsystem(CommonConstants.SUBSYSTEM_ORG);
		staff.setCreatestaffid(org.getCreatestaffid());
		staffMapper.insert(staff);
		staff.setToken("admin_" + DigestUtils.md5Hex("admin&uploadkey&" + staff.getStaffid()));
		staffMapper.updateByPrimaryKeySelective(staff);
		Privilege privilege = privilegeMapper.selectByPrimaryKey(CommonConstants.PRIVILEGE_SUPER);
		ArrayList<Privilege> privileges = new ArrayList<Privilege>();
		privileges.add(privilege);
		staffMapper.assignStaffPrivileges(staff, privileges);

		List<Device> devices = new ArrayList<Device>();
		for (int i = 0; i < org.getMaxdevices(); i++) {
			String terminalid = "" + (i + 1);
			int k = 5 - terminalid.length();
			for (int j = 0; j < k; j++) {
				terminalid = "0" + terminalid;
			}
			terminalid = org.getCode() + terminalid;
			Device device = new Device();
			device.setOrgid(org.getOrgid());
			device.setBranchid(branch.getBranchid());
			device.setTerminalid(terminalid);
			device.setName(terminalid);
			device.setStatus("0");
			devices.add(device);
		}
		deviceMapper.insertList(devices);
	}

	public void updateOrg(Org org) {
		Org oldOrg = orgMapper.selectByPrimaryKey(org.getOrgid());
		if (org.getMaxdevices() != null && org.getMaxdevices() > oldOrg.getCurrentdeviceidx()) {
			List<Device> devices = new ArrayList<Device>();
			for (int i = oldOrg.getCurrentdeviceidx(); i < org.getMaxdevices(); i++) {
				String terminalid = "" + (i + 1);
				int k = 5 - terminalid.length();
				for (int j = 0; j < k; j++) {
					terminalid = "0" + terminalid;
				}
				terminalid = org.getCode() + terminalid;
				List<Branch> branches = branchMapper.selectRoot(org.getOrgid());
				Device device = new Device();
				device.setOrgid(org.getOrgid());
				device.setBranchid(branches.get(0).getBranchid());
				device.setTerminalid(terminalid);
				device.setName(terminalid);
				device.setStatus("0");
				devices.add(device);
			}
			deviceMapper.insertList(devices);
			org.setCurrentdeviceidx(org.getMaxdevices());
		}
		orgMapper.updateByPrimaryKeySelective(org);
	}

	public void deleteOrg(String[] ids) {
		String s = "";
		if (ids.length > 0)
			s = ids[0];
		for (int i = 1; i < ids.length; i++) {
			s += "," + ids[i];
		}
		orgMapper.deleteByKeys(s);
	}

	public boolean validateName(Org org) {
		List<Org> list = orgMapper.selectByName(org.getName());
		if (list.size() == 0) {
			return true;
		} else {
			return (org.getOrgid() == list.get(0).getOrgid());
		}
	}

	public boolean validateCode(Org org) {
		Org oldOrg = orgMapper.selectByCode(org.getCode());
		if (oldOrg == null) {
			return true;
		} else {
			return (org.getOrgid() == oldOrg.getOrgid());
		}
	}

	public void updateCurrentdevices() {
		orgMapper.updateCurrentdevices();
	}

	public void updateCurrentstorage() {
		orgMapper.updateCurrentstorage();
	}
}
