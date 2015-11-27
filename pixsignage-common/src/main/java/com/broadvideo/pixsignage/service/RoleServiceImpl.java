package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Privilege;
import com.broadvideo.pixsignage.domain.Role;
import com.broadvideo.pixsignage.persistence.RoleMapper;

@Service("roleService")
public class RoleServiceImpl implements RoleService {

	@Autowired
	private RoleMapper roleMapper;
	@Autowired
	private PrivilegeService privilegeService;

	public List<Role> selectList(String subsystem, String vspid, String orgid) {
		return roleMapper.selectList(subsystem, vspid, orgid);
	}

	public List<Privilege> selectVspPrivilegeTreeList() {
		return privilegeService.selectVspTreeList();
	}

	public List<Privilege> selectOrgPrivilegeTreeList(Org org) {
		List<Privilege> pList = privilegeService.selectOrgTreeList(org.getOrgtype());
		for (int i = 0; i < pList.size(); i++) {
			List<Privilege> secondPrivileges = pList.get(i).getChildren();
			for (int j = secondPrivileges.size(); j > 0; j--) {
				Privilege privilege = secondPrivileges.get(j - 1);
				/*
				 * if (privilege.getPrivilegeid() == 20102 &&
				 * org.getVideoflag().equals("0") || privilege.getPrivilegeid()
				 * == 20103 && org.getVideoflag().equals("0") ||
				 * privilege.getPrivilegeid() == 20104 &&
				 * org.getImageflag().equals("0") || privilege.getPrivilegeid()
				 * == 20105 && org.getTextflag().equals("0") ||
				 * privilege.getPrivilegeid() == 20106 &&
				 * org.getStreamflag().equals("0") || privilege.getPrivilegeid()
				 * == 20107 && org.getDvbflag().equals("0") ||
				 * privilege.getPrivilegeid() == 20108 &&
				 * org.getWidgetflag().equals("0")) { secondPrivileges.remove(j
				 * - 1); }
				 */
			}
		}
		return pList;
	}

	@Transactional
	public void addRole(Role role) {
		roleMapper.insertSelective(role);
		for (int i = 0; i < role.getPrivileges().size(); i++) {
			roleMapper.insertRoleprivilege("" + role.getRoleid(), "" + role.getPrivileges().get(i).getPrivilegeid());
		}
	}

	@Transactional
	public void updateRole(Role role) {
		roleMapper.updateByPrimaryKeySelective(role);
		roleMapper.deleteRoleprivilegeByRoles("" + role.getRoleid());
		for (int i = 0; i < role.getPrivileges().size(); i++) {
			roleMapper.insertRoleprivilege("" + role.getRoleid(), "" + role.getPrivileges().get(i).getPrivilegeid());
		}
	}

	@Transactional
	public void deleteRole(String roleid) {
		roleMapper.deleteStaffroleByRoles(roleid);
		roleMapper.deleteRoleprivilegeByRoles(roleid);
		roleMapper.deleteByPrimaryKey(roleid);
	}

}
