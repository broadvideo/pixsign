package com.broadvideo.signage.action;

import java.util.Calendar;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.common.CommonConfig;
import com.broadvideo.signage.common.CommonConstants;
import com.broadvideo.signage.common.SessionConstants;
import com.broadvideo.signage.domain.Org;
import com.broadvideo.signage.domain.Privilege;
import com.broadvideo.signage.domain.Staff;
import com.broadvideo.signage.persistence.OrgMapper;
import com.broadvideo.signage.persistence.PrivilegeMapper;
import com.broadvideo.signage.persistence.StaffMapper;
import com.broadvideo.signage.util.CommonUtil;

@Scope("request")
@Controller("loginAction")
public class LoginAction extends BaseAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -594090078526298467L;

	private static final Logger log = Logger.getLogger(LoginAction.class);

	private String subsystem;
	private String username;
	private String password;
	private String code;

	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private PrivilegeMapper privilegeMapper;

	public String doLogin() throws Exception {
		if (!CommonConfig.LICENSE_HOSTID_VERIFY) {
			log.error("Login failed for license HostID verified");
			setErrorcode(-1);
			return ERROR;
		}
		if (CommonConfig.LICENSE_Expire.getTime() < Calendar.getInstance().getTime().getTime()) {
			log.error("Login failed for license expired");
			setErrorcode(-1);
			return ERROR;
		}

		Staff staff;
		List<Privilege> pList;
		if (subsystem != null && subsystem.equals(CommonConstants.SUBSYSTEM_VSP)) {
			if (code == null || code.equals("")) {
				code = "root";
			}
			staff = staffMapper.loginWithVsp(username, CommonUtil.getPasswordMd5(username, password), code);
			pList = privilegeMapper.selectVspTreeList();
		} else if (subsystem != null && subsystem.equals(CommonConstants.SUBSYSTEM_ORG)) {
			Org org = orgMapper.selectByCode(code);
			if (org != null) {
				if (org.getExpireflag().equals("1")
						&& org.getExpiretime().getTime() < Calendar.getInstance().getTime().getTime()) {
					log.error("Login failed for time expire, username=" + username + ", password="
							+ CommonUtil.getPasswordMd5(username, password) + ", code=" + code + ", subsystem="
							+ subsystem);
					setErrorcode(-1);
					return ERROR;
				}
				staff = staffMapper.loginWithOrg(username, CommonUtil.getPasswordMd5(username, password), code);
				pList = privilegeMapper.selectOrgTreeList(org.getOrgtype());
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
			} else {
				log.error("Login failed, username=" + username + ", password="
						+ CommonUtil.getPasswordMd5(username, password) + ", code=" + code + ", subsystem="
						+ subsystem);
				setErrorcode(-1);
				return ERROR;
			}
		} else {
			setErrorcode(-1);
			return ERROR;
		}

		if (staff != null) {
			HttpSession session = super.getSession();
			String token = UUID.randomUUID().toString().replaceAll("-", "");
			session.setAttribute(SessionConstants.SESSION_TOKEN, token);
			session.setAttribute(SessionConstants.SESSION_STAFF, staff);
			session.setAttribute(SessionConstants.SESSION_PRIVILEGES, pList);
			session.setAttribute(SessionConstants.SESSION_SUBSYSTEM, subsystem);

			Org org = orgMapper.selectByPrimaryKey(staff.getOrgid());
			if (org != null) {
				session.setAttribute(SessionConstants.SESSION_ORG, org);
			}
			return SUCCESS;
		}

		log.error("Login failed, username=" + username + ", password=" + CommonUtil.getPasswordMd5(username, password)
				+ ", code=" + code + ", subsystem=" + subsystem);
		setErrorcode(-1);
		return ERROR;
	}

	public String doLogout() throws Exception {
		HttpSession session = super.getSession();
		if (session != null) {
			session.removeAttribute(SessionConstants.SESSION_TOKEN);
			session.removeAttribute(SessionConstants.SESSION_STAFF);
			session.removeAttribute(SessionConstants.SESSION_ORG);
			session.removeAttribute(SessionConstants.SESSION_PRIVILEGES);
			session.removeAttribute(SessionConstants.SESSION_SUBSYSTEM);

			session.invalidate();
		}
		getHttpServletResponse().sendRedirect(getHttpServletRequest().getContextPath());
		return SUCCESS;
	}

	public String getSubsystem() {
		return subsystem;
	}

	public void setSubsystem(String subsystem) {
		this.subsystem = subsystem;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
}
