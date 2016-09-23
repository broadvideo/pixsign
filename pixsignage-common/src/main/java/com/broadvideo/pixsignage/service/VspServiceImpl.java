package com.broadvideo.pixsignage.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Privilege;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.domain.Vsp;
import com.broadvideo.pixsignage.persistence.PrivilegeMapper;
import com.broadvideo.pixsignage.persistence.StaffMapper;
import com.broadvideo.pixsignage.persistence.VspMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

@Service("vspService")
public class VspServiceImpl implements VspService {

	@Autowired
	private VspMapper vspMapper;
	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private PrivilegeMapper privilegeMapper;

	public List<Vsp> selectList() {
		return vspMapper.selectList();
	}

	public Vsp selectByCode(String code) {
		return vspMapper.selectByCode(code);
	}

	public Vsp selectByPrimaryKey(String vspid) {
		return vspMapper.selectByPrimaryKey(vspid);
	}

	@Transactional
	public void addVsp(Vsp vsp) {
		vspMapper.insertSelective(vsp);
		Staff staff = new Staff();
		staff.setVspid(vsp.getVspid());
		staff.setLoginname("super@" + vsp.getCode());
		staff.setPassword(CommonUtil.getPasswordMd5("super@" + vsp.getCode(), "super@" + vsp.getCode()));
		staff.setName(vsp.getName() + "管理员");
		staff.setStatus("1");
		staff.setDescription(vsp.getName() + "管理员");
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
