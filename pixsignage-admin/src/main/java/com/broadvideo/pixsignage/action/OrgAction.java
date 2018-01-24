package com.broadvideo.pixsignage.action;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.service.OrgService;

@Scope("request")
@Controller("orgAction")
public class OrgAction extends BaseDatatableAction {
	@SuppressWarnings("unused")
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Org org;

	private File logo;
	private String logoContentType;
	private String logoFileName;

	@Autowired
	private OrgService orgService;

	public String doList() {
		try {
			List<Object> aaData = new ArrayList<Object>();
			List<Org> orgList;
			if (getLoginStaff().getVspid() == null && getLoginStaff().getOrgid() == null) {
				orgList = orgService.selectList(null, null);
			} else if (getLoginStaff().getVspid() == null) {
				orgList = orgService.selectList(null, "" + getLoginStaff().getOrgid());
			} else {
				orgList = orgService.selectList("" + getLoginStaff().getVspid(), null);
			}
			for (int i = 0; i < orgList.size(); i++) {
				aaData.add(orgList.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("OrgAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			org.setCreatestaffid(getLoginStaff().getStaffid());
			org.setVspid(getLoginStaff().getVspid());
			org.setCurrentdevices(0);
			org.setCurrentstorage((long) 0);
			orgService.addOrg(org);
			if (logo != null) {
				logger.info("Begin handle logo, {}", logoFileName);
				String newFileName = "/org/" + org.getOrgid() + "." + FilenameUtils.getExtension(logoFileName);
				File fileToCreate = new File(CommonConfig.CONFIG_PIXDATA_HOME + newFileName);
				if (fileToCreate.exists()) {
					fileToCreate.delete();
				}
				FileUtils.moveFile(logo, fileToCreate);
				org.setLogo(newFileName);
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("OrgAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			if (logo != null) {
				logger.info("Begin handle logo, {}", logoFileName);
				String newFileName = "/org/" + org.getOrgid() + "." + FilenameUtils.getExtension(logoFileName);
				File fileToCreate = new File(CommonConfig.CONFIG_PIXDATA_HOME + newFileName);
				if (fileToCreate.exists()) {
					fileToCreate.delete();
				}
				FileUtils.moveFile(logo, fileToCreate);
				org.setLogo(newFileName);
			}
			orgService.updateOrg(org);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("OrgAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doResetPassword() {
		try {
			orgService.resetPassword("" + org.getOrgid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("OrgAction doResetPassword exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			orgService.deleteOrg("" + org.getOrgid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("OrgAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doValidate() {
		try {
			if (org.getName() != null) {
				if (orgService.validateName(org)) {
					return SUCCESS;
				} else {
					setErrorcode(-1);
					setErrormsg("名称已存在");
					return ERROR;
				}
			}
			if (org.getCode() != null) {
				if (orgService.validateCode(org)) {
					return SUCCESS;
				} else {
					setErrorcode(-1);
					setErrormsg("编码已存在");
					return ERROR;
				}
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("OrgAction doValidate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doGet() {
		try {
			org = orgService.selectByPrimaryKey("" + getLoginStaff().getOrgid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("OrgAction doGet exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Org getOrg() {
		return org;
	}

	public void setOrg(Org org) {
		this.org = org;
	}

	public File getLogo() {
		return logo;
	}

	public void setLogo(File logo) {
		this.logo = logo;
	}

	public String getLogoContentType() {
		return logoContentType;
	}

	public void setLogoContentType(String logoContentType) {
		this.logoContentType = logoContentType;
	}

	public String getLogoFileName() {
		return logoFileName;
	}

	public void setLogoFileName(String logoFileName) {
		this.logoFileName = logoFileName;
	}
}
