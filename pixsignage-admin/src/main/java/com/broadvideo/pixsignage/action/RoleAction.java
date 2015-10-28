package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.common.SessionConstants;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Privilege;
import com.broadvideo.pixsignage.domain.Role;
import com.broadvideo.pixsignage.service.RoleService;

@Scope("request")
@Controller("roleAction")
public class RoleAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8099299402651516219L;

	private static final Logger log = Logger.getLogger(RoleAction.class);

	private Role role;

	@Autowired
	private RoleService roleService;

	public String doList() {
		try {
			String subsystem = (String) getSession().getAttribute(SessionConstants.SESSION_SUBSYSTEM);
			String vspid = null;
			String orgid = null;
			if (subsystem.equals(CommonConstants.SUBSYSTEM_VSP)) {
				vspid = "" + getLoginStaff().getVspid();
			} else {
				orgid = "" + getLoginStaff().getOrgid();
			}
			List<Object> aaData = new ArrayList<Object>();
			List<Role> roleList = roleService.selectList(subsystem, vspid, orgid);
			for (int i = 0; i < roleList.size(); i++) {
				aaData.add(roleList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doPrivilegeList() {
		try {
			List<Object> aaData = new ArrayList<Object>();
			List<Privilege> privilegeList = null;
			String subsystem = (String) getSession().getAttribute(SessionConstants.SESSION_SUBSYSTEM);
			if (subsystem != null && subsystem.equals(CommonConstants.SUBSYSTEM_VSP)) {
				privilegeList = roleService.selectVspPrivilegeTreeList();
			} else if (subsystem != null && subsystem.equals(CommonConstants.SUBSYSTEM_ORG)) {
				Org org = (Org) getSession().getAttribute(SessionConstants.SESSION_ORG);
				privilegeList = roleService.selectOrgPrivilegeTreeList(org);
			}

			for (int i = 0; i < privilegeList.size(); i++) {
				aaData.add(privilegeList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			role.setCreatestaffid(getLoginStaff().getStaffid());
			role.setSubsystem((String) getSession().getAttribute(SessionConstants.SESSION_SUBSYSTEM));
			role.setVspid(getLoginStaff().getVspid());
			role.setOrgid(getLoginStaff().getOrgid());
			roleService.addRole(role);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			roleService.updateRole(role);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			roleService.deleteRole("" + role.getRoleid());
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}
}
