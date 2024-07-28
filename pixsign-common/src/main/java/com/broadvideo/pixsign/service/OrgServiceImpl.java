package com.broadvideo.pixsign.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsign.common.CommonConstants;
import com.broadvideo.pixsign.domain.Branch;
import com.broadvideo.pixsign.domain.Org;
import com.broadvideo.pixsign.domain.Privilege;
import com.broadvideo.pixsign.domain.Staff;
import com.broadvideo.pixsign.persistence.OrgMapper;
import com.broadvideo.pixsign.persistence.PrivilegeMapper;
import com.broadvideo.pixsign.persistence.StaffMapper;
import com.broadvideo.pixsign.util.CommonUtil;

@Service("orgService")
public class OrgServiceImpl implements OrgService {

	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private PrivilegeMapper privilegeMapper;

	@Autowired
	private BranchService branchService;
	@Autowired
	protected ResourceBundleMessageSource messageSource;

	public List<Org> selectList(String orgid) {
		return orgMapper.selectList(orgid);
	}

	public Org selectByCode(String code) {
		return orgMapper.selectByCode(code);
	}

	public Org selectByPrimaryKey(String orgid) {
		/*
		 * Org org = orgMapper.selectByPrimaryKey(orgid); List<App> appList =
		 * org.getApplist(); if (appList != null) { for (App app : appList) {
		 * app.setDescription( messageSource.getMessage("app." + app.getName(), null,
		 * LocaleContextHolder.getLocale())); }
		 * 
		 * }
		 */
		return orgMapper.selectByPrimaryKey(orgid);
	}

	@Transactional
	public void addOrg(Org org) {
		orgMapper.insertSelective(org);

		Branch branch = new Branch();
		branch.setOrgid(org.getOrgid());
		branch.setParentid(0);
		branch.setName(messageSource.getMessage("global.headquarter", null, LocaleContextHolder.getLocale()));
		branch.setStatus("1");
		branch.setDescription(org.getName() + " "
				+ messageSource.getMessage("global.headquarter", null, LocaleContextHolder.getLocale()));
		branch.setCreatestaffid(org.getCreatestaffid());
		branchService.addBranch(branch);

		org.setTopbranchid(branch.getBranchid());
		orgMapper.updateByPrimaryKeySelective(org);

		Staff staff = new Staff();
		staff.setOrgid(org.getOrgid());
		staff.setBranchid(branch.getBranchid());
		staff.setLoginname("admin@" + org.getCode());
		staff.setPassword(CommonUtil.getPasswordMd5("admin@" + org.getCode(), "admin@" + org.getCode()));
		staff.setName(org.getName() + " Admin");
		staff.setStatus("1");
		staff.setDescription(org.getName() + " Admin");
		staff.setSubsystem(CommonConstants.SUBSYSTEM_ORG);
		staff.setCreatestaffid(org.getCreatestaffid());
		staffMapper.insertSelective(staff);
		Privilege privilege = privilegeMapper.selectByPrimaryKey(CommonConstants.PRIVILEGE_SUPER);
		ArrayList<Privilege> privileges = new ArrayList<Privilege>();
		privileges.add(privilege);
		staffMapper.assignStaffPrivileges(staff, privileges);
	}

	@Transactional
	public void updateOrg(Org org) {
		orgMapper.updateByPrimaryKeySelective(org);
	}

	@Transactional
	public void resetPassword(String orgid) {
		Org org = orgMapper.selectByPrimaryKey(orgid);
		List<Staff> staffs = staffMapper.selectByLoginname("admin@" + org.getCode());
		if (staffs.size() > 0) {
			Staff staff = staffs.get(0);
			staff.setPassword(CommonUtil.getPasswordMd5(staff.getLoginname(), staff.getLoginname()));
			staffMapper.updateByPrimaryKeySelective(staff);
		}
	}

	@Transactional
	public void deleteOrg(String orgid) {
		staffMapper.deleteByOrg(orgid);
		orgMapper.deleteByPrimaryKey(orgid);
	}

	public boolean validateName(Org org) {
		List<Org> list = orgMapper.selectByName(org.getName());
		if (list.size() == 0) {
			return true;
		} else {
			return (org.getOrgid().intValue() == list.get(0).getOrgid().intValue());
		}
	}

	public boolean validateCode(Org org) {
		Org oldOrg = orgMapper.selectByCode(org.getCode());
		if (oldOrg == null) {
			return true;
		} else {
			return (org.getOrgid().intValue() == oldOrg.getOrgid().intValue());
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
