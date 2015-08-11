package com.broadvideo.signage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.signage.domain.Org;
import com.broadvideo.signage.domain.Privilege;
import com.broadvideo.signage.domain.Role;
import com.broadvideo.signage.persistence.PrivilegeMapper;
import com.broadvideo.signage.persistence.RoleMapper;

@Service("roleService")
public class RoleServiceImpl implements RoleService {

	@Autowired
	private RoleMapper roleMapper;
	@Autowired
	private PrivilegeMapper privilegeMapper;

	public List<Role> selectList(String subsystem, String vspid, String orgid) {
		return roleMapper.selectList(subsystem, vspid, orgid);
	}

	public List<Privilege> selectVspPrivilegeTreeList() {
		return privilegeMapper.selectVspTreeList();
	}

	public List<Privilege> selectOrgPrivilegeTreeList(Org org) {
		List<Privilege> pList = privilegeMapper.selectOrgTreeList(org.getOrgtype());
		for (int i = 0; i < pList.size(); i++) {
			List<Privilege> secondPrivileges = pList.get(i).getChildren();
			for (int j = secondPrivileges.size(); j > 0; j--) {
				Privilege privilege = secondPrivileges.get(j - 1);
				if (privilege.getPrivilegeid() == 20101 && org.getVideoflag().equals("0")
						|| privilege.getPrivilegeid() == 20102 && org.getImageflag().equals("0")
						|| privilege.getPrivilegeid() == 20103 && org.getLiveflag().equals("0")
						|| privilege.getPrivilegeid() == 20104 && org.getWidgetflag().equals("0")) {
					secondPrivileges.remove(j - 1);
				}
			}
		}
		return pList;
	}

	@Transactional
	public void addRole(Role role) {
		roleMapper.insert(role);
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
	public void deleteRole(String[] ids) {
		String s = "";
		if (ids.length > 0)
			s = ids[0];
		for (int i = 1; i < ids.length; i++) {
			s += "," + ids[i];
		}
		roleMapper.deleteStaffroleByRoles(s);
		roleMapper.deleteRoleprivilegeByRoles(s);
		roleMapper.deleteByKeys(s);
	}

}
