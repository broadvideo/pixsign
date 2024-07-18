package com.broadvideo.pixsign.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsign.common.CommonConstants;
import com.broadvideo.pixsign.domain.Privilege;
import com.broadvideo.pixsign.domain.Staff;
import com.broadvideo.pixsign.domain.Vsp;
import com.broadvideo.pixsign.persistence.PrivilegeMapper;
import com.broadvideo.pixsign.persistence.StaffMapper;
import com.broadvideo.pixsign.persistence.VspMapper;
import com.broadvideo.pixsign.util.CommonUtil;

@Service("vspService")
public class VspServiceImpl implements VspService {

	@Autowired
	private VspMapper vspMapper;
	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private PrivilegeMapper privilegeMapper;

	@Autowired
	protected ResourceBundleMessageSource messageSource;

	public List<Vsp> selectList() {
		return vspMapper.selectList();
	}

	public Vsp selectByCode(String code) {
		return vspMapper.selectByCode(code);
	}

	public Vsp selectByPrimaryKey(String vspid) {
		/*
		 * Vsp vsp = vspMapper.selectByPrimaryKey(vspid); List<App> appList =
		 * vsp.getApplist(); if (appList != null) { for (App app : appList) {
		 * app.setDescription( messageSource.getMessage("app." + app.getName(),
		 * null, LocaleContextHolder.getLocale())); }
		 * 
		 * }
		 */
		return vspMapper.selectByPrimaryKey(vspid);
	}

	@Transactional
	public void addVsp(Vsp vsp) {
		vspMapper.insertSelective(vsp);
		Staff staff = new Staff();
		staff.setVspid(vsp.getVspid());
		staff.setLoginname("super@" + vsp.getCode());
		staff.setPassword(CommonUtil.getPasswordMd5("super@" + vsp.getCode(), "super@" + vsp.getCode()));
		staff.setName(vsp.getName() + " Admin");
		staff.setStatus("1");
		staff.setDescription(vsp.getName() + " Admin");
		staff.setSubsystem(CommonConstants.SUBSYSTEM_VSP);
		staff.setCreatestaffid(vsp.getCreatestaffid());
		staffMapper.insertSelective(staff);
		staffMapper.updateByPrimaryKeySelective(staff);
		Privilege privilege = privilegeMapper.selectByPrimaryKey(CommonConstants.PRIVILEGE_SUPER);
		ArrayList<Privilege> privileges = new ArrayList<Privilege>();
		privileges.add(privilege);
		staffMapper.assignStaffPrivileges(staff, privileges);
	}

	@Transactional
	public void updateVsp(Vsp vsp) {
		vspMapper.updateByPrimaryKeySelective(vsp);
	}

	@Transactional
	public void deleteVsp(String vspid) {
		staffMapper.deleteByVsp(vspid);
		vspMapper.deleteByPrimaryKey(vspid);
	}

	public boolean validateName(Vsp vsp) {
		List<Vsp> list = vspMapper.selectByName(vsp.getName());
		if (list.size() == 0) {
			return true;
		} else {
			return (vsp.getVspid() == list.get(0).getVspid());
		}
	}

	public boolean validateCode(Vsp vsp) {
		Vsp oldVsp = vspMapper.selectByCode(vsp.getCode());
		if (oldVsp == null) {
			return true;
		} else {
			return (vsp.getVspid() == oldVsp.getVspid());
		}
	}
}
