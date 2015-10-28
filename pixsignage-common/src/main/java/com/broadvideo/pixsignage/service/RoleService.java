package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Privilege;
import com.broadvideo.pixsignage.domain.Role;

public interface RoleService {
	public List<Role> selectList(String subsystem, String vspid, String orgid);

	public List<Privilege> selectVspPrivilegeTreeList();

	public List<Privilege> selectOrgPrivilegeTreeList(Org org);

	public void addRole(Role role);

	public void updateRole(Role role);

	public void deleteRole(String roleid);
}
