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
import com.broadvideo.pixsignage.domain.Branch;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Privilege;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.domain.Vsp;
import com.broadvideo.pixsignage.persistence.BranchMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.persistence.StaffMapper;
import com.broadvideo.pixsignage.persistence.VspMapper;
import com.broadvideo.pixsignage.service.OrgService;
import com.broadvideo.pixsignage.service.PrivilegeService;
import com.broadvideo.pixsignage.util.CommonUtil;

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
	private VspMapper vspMapper;
	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private BranchMapper branchMapper;
	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private PrivilegeService privilegeService;
	@Autowired
	private OrgService orgService;

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
				CommonConfig.LICENSE_MaxDevicesPerSigOrg = 25;
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

			Org org = orgService.selectByCode("default");
			if (org.getMaxdevices() < CommonConfig.LICENSE_MaxDevicesPerSigOrg) {
				org.setMaxdevices(CommonConfig.LICENSE_MaxDevicesPerSigOrg);
				org.setMaxstorage((long) CommonConfig.LICENSE_MaxStoragePerSigOrg);
				orgService.updateOrg(org);
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

		staff = staffMapper.login(username, CommonUtil.getPasswordMd5(username, password));
		if (staff == null) {
			logger.error("Login failed for staff not found, username=" + username + ", password="
					+ CommonUtil.getPasswordMd5(username, password) + ", code=" + code);
			setErrorcode(-1);
			return ERROR;
		}

		if (code == null || code.equals("")) {
			code = "default";
		}
		if (username.equals("root")) {
			// SYS super user
			staff.setSubsystem(CommonConstants.SUBSYSTEM_SYS);
		} else if (username.equals("super")) {
			// VSP super user
			Vsp vsp = vspMapper.selectByCode(code);
			if (vsp == null) {
				logger.error("Login failed for vsp not found, username=" + username + ", password="
						+ CommonUtil.getPasswordMd5(username, password) + ", code=" + code);
				setErrorcode(-1);
				return ERROR;
			}
			staff.setSubsystem(CommonConstants.SUBSYSTEM_VSP);
			staff.setVspid(vsp.getVspid());
			staff.setVsp(vsp);
		} else if (username.equals("admin")) {
			// ORG super user
			Org org = orgMapper.selectByCode(code);
			if (org == null) {
				logger.error("Login failed for org not found, username=" + username + ", password="
						+ CommonUtil.getPasswordMd5(username, password) + ", code=" + code);
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

		if (staff.getOrg() != null && staff.getOrg().getExpireflag().equals("1")
				&& staff.getOrg().getExpiretime().getTime() < Calendar.getInstance().getTime().getTime()) {
			logger.error("Login failed for time expire, username=" + username + ", password="
					+ CommonUtil.getPasswordMd5(username, password) + ", code=" + code);
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
		} else if (staff.getSubsystem().equals(CommonConstants.SUBSYSTEM_VSP)) {
			List<Privilege> pList = privilegeService.selectVspTreeList();
			session.setAttribute(CommonConstants.SESSION_PRIVILEGES, pList);
			session.setAttribute(CommonConstants.SESSION_VSP, staff.getVsp());
		} else if (staff.getSubsystem().equals(CommonConstants.SUBSYSTEM_ORG)) {
			List<Privilege> pList = privilegeService.selectOrgTreeList(staff.getOrg().getOrgtype());
			session.setAttribute(CommonConstants.SESSION_PRIVILEGES, pList);
			session.setAttribute(CommonConstants.SESSION_ORG, staff.getOrg());
		}

		return SUCCESS;
	}

	public String doLogout() throws Exception {
		HttpSession session = super.getSession();
		if (session != null) {
			session.removeAttribute(CommonConstants.SESSION_TOKEN);
			session.removeAttribute(CommonConstants.SESSION_STAFF);
			session.removeAttribute(CommonConstants.SESSION_VSP);
			session.removeAttribute(CommonConstants.SESSION_ORG);
			session.removeAttribute(CommonConstants.SESSION_PRIVILEGES);
			session.removeAttribute(CommonConstants.SESSION_SUBSYSTEM);
			session.invalidate();
		}
		getHttpServletResponse().sendRedirect(getHttpServletRequest().getRequestURI());
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
