package com.broadvideo.pixsignage.action;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.UUID;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Privilege;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.persistence.StaffMapper;
import com.broadvideo.pixsignage.service.PrivilegeService;
import com.broadvideo.pixsignage.util.CommonUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("loginAction")
public class LoginAction extends BaseAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private String subsystem;
	private String username;
	private String password;
	private String code;

	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private PrivilegeService privilegeService;

	public String doLogin() throws Exception {
		if (!CommonConfig.LICENSE) {
			SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			if (System.getProperties().getProperty("os.name").startsWith("Windows")) {
				CommonConfig.LICENSE_HOSTID_VERIFY = true;
				try {
					CommonConfig.LICENSE_Expire = sf.parse("2037-01-01 00:00:00");
				} catch (Exception e) {
				}
				CommonConfig.LICENSE_MaxOrgs = 10;
				CommonConfig.LICENSE_MaxDevicesPerSigOrg = 20;
				CommonConfig.LICENSE_MaxStoragePerSigOrg = 3000;
				CommonConfig.LICENSE_MaxDevicesPerMovieOrg = 20;
				CommonConfig.LICENSE_MaxStoragePerMovieOrg = 3000;
			}

			ServletContext licensecontext = getHttpServletRequest().getSession().getServletContext()
					.getContext("/pixlicense");
			if (licensecontext == null) {
				logger.error("License init error: context of license is null");
			} else if (licensecontext.getAttribute("HostIDVerify") == null) {
				logger.error("License init error: HostIDVerify is null");
			} else {
				CommonConfig.LICENSE_HOSTID_VERIFY = (Boolean) licensecontext.getAttribute("HostIDVerify");
				CommonConfig.LICENSE_Expire = sf.parse((String) licensecontext.getAttribute("Expire"));
				CommonConfig.LICENSE_MaxOrgs = Integer.parseInt((String) licensecontext.getAttribute("MaxOrgs"));
				CommonConfig.LICENSE_MaxDevicesPerSigOrg = Integer
						.parseInt((String) licensecontext.getAttribute("MaxDevicesPerSigOrg"));
				CommonConfig.LICENSE_MaxStoragePerSigOrg = Integer
						.parseInt((String) licensecontext.getAttribute("MaxStoragePerSigOrg"));
				CommonConfig.LICENSE_MaxDevicesPerMovieOrg = Integer
						.parseInt((String) licensecontext.getAttribute("MaxDevicesPerMovieOrg"));
				CommonConfig.LICENSE_MaxStoragePerMovieOrg = Integer
						.parseInt((String) licensecontext.getAttribute("MaxStoragePerMovieOrg"));
				logger.info("License HostID verify: " + CommonConfig.LICENSE_HOSTID_VERIFY);
				logger.info("License Expire: " + sf.format(CommonConfig.LICENSE_Expire));
				logger.info("License MaxOrgs: " + CommonConfig.LICENSE_MaxOrgs);
				logger.info("License MaxDevicesPerSigOrg: " + CommonConfig.LICENSE_MaxDevicesPerSigOrg);
				logger.info("License MaxStoragePerSigOrg: " + CommonConfig.LICENSE_MaxStoragePerSigOrg);
				logger.info("License MaxDevicesPerMovieOrg: " + CommonConfig.LICENSE_MaxDevicesPerMovieOrg);
				logger.info("License MaxStoragePerMovieOrg: " + CommonConfig.LICENSE_MaxStoragePerMovieOrg);
				CommonConfig.LICENSE = true;
			}
		}

		if (!CommonConfig.LICENSE_HOSTID_VERIFY) {
			logger.error("Login failed for license HostID verified");
			setErrorcode(-1);
			return ERROR;
		}
		if (CommonConfig.LICENSE_Expire.getTime() < Calendar.getInstance().getTime().getTime()) {
			logger.error("Login failed for license expired");
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
			pList = privilegeService.selectVspTreeList();
		} else if (subsystem != null && subsystem.equals(CommonConstants.SUBSYSTEM_ORG)) {
			Org org = orgMapper.selectByCode(code);
			if (org != null) {
				if (org.getExpireflag().equals("1")
						&& org.getExpiretime().getTime() < Calendar.getInstance().getTime().getTime()) {
					logger.error("Login failed for time expire, username=" + username + ", password="
							+ CommonUtil.getPasswordMd5(username, password) + ", code=" + code + ", subsystem="
							+ subsystem);
					setErrorcode(-1);
					return ERROR;
				}
				staff = staffMapper.loginWithOrg(username, CommonUtil.getPasswordMd5(username, password), code);
				pList = privilegeService.selectOrgTreeList(org.getOrgtype());
				for (int i = 0; i < pList.size(); i++) {
					List<Privilege> secondPrivileges = pList.get(i).getChildren();
					for (int j = secondPrivileges.size(); j > 0; j--) {
						Privilege privilege = secondPrivileges.get(j - 1);
						/*
						 * if (privilege.getPrivilegeid() == 20102 &&
						 * org.getVideoflag().equals("0") ||
						 * privilege.getPrivilegeid() == 20103 &&
						 * org.getVideoflag().equals("0") ||
						 * privilege.getPrivilegeid() == 20104 &&
						 * org.getImageflag().equals("0") ||
						 * privilege.getPrivilegeid() == 20105 &&
						 * org.getTextflag().equals("0") ||
						 * privilege.getPrivilegeid() == 20106 &&
						 * org.getStreamflag().equals("0") ||
						 * privilege.getPrivilegeid() == 20107 &&
						 * org.getDvbflag().equals("0") ||
						 * privilege.getPrivilegeid() == 20108 &&
						 * org.getWidgetflag().equals("0")) {
						 * secondPrivileges.remove(j - 1); }
						 */
					}
				}
			} else {
				logger.error("Login failed, username=" + username + ", password="
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
			session.setAttribute(CommonConstants.SESSION_TOKEN, token);
			session.setAttribute(CommonConstants.SESSION_STAFF, staff);
			session.setAttribute(CommonConstants.SESSION_PRIVILEGES, pList);
			session.setAttribute(CommonConstants.SESSION_SUBSYSTEM, subsystem);

			Org org = orgMapper.selectByPrimaryKey("" + staff.getOrgid());
			if (org != null) {
				session.setAttribute(CommonConstants.SESSION_ORG, org);
			}
			return SUCCESS;
		}

		logger.error("Login failed, username=" + username + ", password="
				+ CommonUtil.getPasswordMd5(username, password) + ", code=" + code + ", subsystem=" + subsystem);
		setErrorcode(-1);
		return ERROR;
	}

	public String doLogout() throws Exception {
		HttpSession session = super.getSession();
		if (session != null) {
			session.removeAttribute(CommonConstants.SESSION_TOKEN);
			session.removeAttribute(CommonConstants.SESSION_STAFF);
			session.removeAttribute(CommonConstants.SESSION_ORG);
			session.removeAttribute(CommonConstants.SESSION_PRIVILEGES);
			session.removeAttribute(CommonConstants.SESSION_SUBSYSTEM);

			session.invalidate();
		}

		getHttpServletResponse().sendRedirect(getHttpServletRequest().getRequestURI());
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
