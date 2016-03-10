package com.broadvideo.pixsignage.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Branch;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Privilege;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.persistence.BranchMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.persistence.PrivilegeMapper;
import com.broadvideo.pixsignage.persistence.StaffMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

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

	public List<Org> selectList(String vspid) {
		return orgMapper.selectList(vspid);
	}

	public Org selectByCode(String code) {
		return orgMapper.selectByCode(code);
	}

	public Org selectByPrimaryKey(String orgid) {
		return orgMapper.selectByPrimaryKey(orgid);
	}

	@Transactional
	public void addOrg(Org org) {
		org.setCurrentdeviceidx(org.getMaxdevices());
		orgMapper.insertSelective(org);

		Branch branch = new Branch();
		branch.setOrgid(org.getOrgid());
		branch.setParentid(0);
		branch.setName("总部");
		branch.setCode(org.getCode() + "_TOP");
		branch.setStatus("1");
		branch.setDescription(org.getName() + "总部");
		branch.setCreatestaffid(org.getCreatestaffid());
		branchMapper.insertSelective(branch);

		Staff staff = new Staff();
		staff.setOrgid(org.getOrgid());
		staff.setBranchid(branch.getBranchid());
		staff.setLoginname("admin@" + org.getCode());
		staff.setPassword(CommonUtil.getPasswordMd5("admin@" + org.getCode(), "admin@" + org.getCode()));
		staff.setName(org.getName() + "管理员");
		staff.setStatus("1");
		staff.setDescription(org.getName() + "管理员");
		staff.setSubsystem(CommonConstants.SUBSYSTEM_ORG);
		staff.setCreatestaffid(org.getCreatestaffid());
		staffMapper.insertSelective(staff);
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

	@Transactional
	public void updateOrg(Org org) {
		Org oldOrg = orgMapper.selectByPrimaryKey("" + org.getOrgid());
		if (org.getMaxdevices() != null && org.getMaxdevices() > oldOrg.getCurrentdeviceidx()) {
			List<Device> devices = new ArrayList<Device>();
			for (int i = oldOrg.getCurrentdeviceidx(); i < org.getMaxdevices(); i++) {
				String terminalid = "" + (i + 1);
				int k = 5 - terminalid.length();
				for (int j = 0; j < k; j++) {
					terminalid = "0" + terminalid;
				}
				if (!org.getCode().equals("default")) {
					terminalid = org.getCode() + terminalid;
				}
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

	@Transactional
	public void deleteOrg(String orgid) {
		orgMapper.deleteByPrimaryKey(orgid);
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

	@Transactional
	public void updateCurrentdevices() {
		orgMapper.updateCurrentdevices();
	}

	@Transactional
	public void updateCurrentstorage() {
		orgMapper.updateCurrentstorage();
	}
}
