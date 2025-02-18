package com.broadvideo.pixsign.action;

import java.util.Calendar;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsign.common.CommonConstants;
import com.broadvideo.pixsign.domain.Branch;
import com.broadvideo.pixsign.domain.Oplog;
import com.broadvideo.pixsign.domain.Org;
import com.broadvideo.pixsign.domain.Privilege;
import com.broadvideo.pixsign.domain.Staff;
import com.broadvideo.pixsign.persistence.BranchMapper;
import com.broadvideo.pixsign.persistence.OplogMapper;
import com.broadvideo.pixsign.persistence.OrgMapper;
import com.broadvideo.pixsign.persistence.StaffMapper;
import com.broadvideo.pixsign.service.PrivilegeService;
import com.broadvideo.pixsign.util.CommonUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("loginAction")
public class LoginAction extends BaseAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private String username;
	private String password;
	private String code;
	private Staff staff;

	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private BranchMapper branchMapper;
	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private OplogMapper oplogMapper;
	@Autowired
	private PrivilegeService privilegeService;

	public String doPing() {
		return SUCCESS;
	}

	public String doLogin() throws Exception {
		username = username.trim();
		password = password.trim();
		logger.info("Login start, username={}, password={}, md5={}, code={}", username, password,
				CommonUtil.getPasswordMd5(username, password), code);
		staff = staffMapper.login(username, CommonUtil.getPasswordMd5(username, password));
		if (staff == null) {
			logger.error("Login failed for username & password not match, username={}, password={}, md5={}, code={}",
					username, password, CommonUtil.getPasswordMd5(username, password), code);
			setErrorcode(-1);
			return ERROR;
		}

		if (username.equals("root")) {
			// SYS super user
			staff.setSubsystem(CommonConstants.SUBSYSTEM_SYS);
		} else if (username.equals("admin")) {
			// ORG super user
			if (code == null || code.equals("")) {
				code = "default";
			}
			Org org = orgMapper.selectByCode(code);
			if (org == null) {
				logger.error("Login failed for org not found, username={}, password={}, md5={}, code={}", username,
						password, CommonUtil.getPasswordMd5(username, password), code);
				setErrorcode(-1);
				return ERROR;
			}
			staff.setSubsystem(CommonConstants.SUBSYSTEM_ORG);
			staff.setOrgid(org.getOrgid());
			staff.setOrg(org);
			List<Branch> branchRoot = branchMapper.selectRoot("" + org.getOrgid());
			staff.setBranchid(branchRoot.get(0).getBranchid());
			staff.setBranch(branchRoot.get(0));
		}

		if (staff.getSubsystem().equals(CommonConstants.SUBSYSTEM_ORG)) {
			Oplog oplog = new Oplog();
			oplog.setOrgid(staff.getOrgid());
			oplog.setBranchid(staff.getBranchid());
			oplog.setStaffid(staff.getStaffid());
			oplog.setType("1");
			oplogMapper.insertSelective(oplog);
		}

		if (staff.getOrg() != null && staff.getOrg().getExpireflag().equals("1")
				&& staff.getOrg().getExpiretime().getTime() < Calendar.getInstance().getTime().getTime()) {
			logger.error("Login failed for time expire, username={}, password={}, md5={}, code={}", username, password,
					CommonUtil.getPasswordMd5(username, password), code);
			setErrorcode(-1);
			return ERROR;
		}

		HttpSession session = super.getSession();
		String token = UUID.randomUUID().toString().replaceAll("-", "");
		session.setAttribute(CommonConstants.SESSION_TOKEN, token);
		session.setAttribute(CommonConstants.SESSION_STAFF, staff);
		session.setAttribute(CommonConstants.SESSION_SUBSYSTEM, staff.getSubsystem());
		if (staff.getSubsystem().equals(CommonConstants.SUBSYSTEM_SYS)) {
			List<Privilege> pList = privilegeService.selectSysTreeList();
			session.setAttribute(CommonConstants.SESSION_PRIVILEGES, pList);
		} else if (staff.getSubsystem().equals(CommonConstants.SUBSYSTEM_ORG)) {
			List<Privilege> pList = privilegeService.selectOrgTreeList(staff.getOrg());
			session.setAttribute(CommonConstants.SESSION_PRIVILEGES, pList);
			session.setAttribute(CommonConstants.SESSION_ORG, staff.getOrg());
		}

		return SUCCESS;
	}

	public String doLogout() throws Exception {
		HttpSession session = super.getSession();
		Staff staff = (Staff) session.getAttribute(CommonConstants.SESSION_STAFF);
		if (session != null) {
			session.removeAttribute(CommonConstants.SESSION_TOKEN);
			session.removeAttribute(CommonConstants.SESSION_STAFF);
			session.removeAttribute(CommonConstants.SESSION_VSP);
			session.removeAttribute(CommonConstants.SESSION_ORG);
			session.removeAttribute(CommonConstants.SESSION_PRIVILEGES);
			session.removeAttribute(CommonConstants.SESSION_SUBSYSTEM);
			session.invalidate();
		}
		if (staff.getSourcetype().equals("2")) {
			getHttpServletResponse().sendRedirect("http://www.jzjyy.cn/zhxy/j_spring_security_logout");
		} else {
			getHttpServletResponse().sendRedirect(getHttpServletRequest().getRequestURI());
		}
		return SUCCESS;
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

	public Staff getStaff() {
		return staff;
	}

	public void setStaff(Staff staff) {
		this.staff = staff;
	}
}
