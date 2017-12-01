package com.broadvideo.pixsignage.action;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Sdomain;
import com.broadvideo.pixsignage.service.SdomainService;

@Scope("request")
@Controller("sdomainAction")
public class SdomainAction extends BaseDatatableAction {
	@SuppressWarnings("unused")
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Sdomain sdomain;

	private File logo;
	private String logoContentType;
	private String logoFileName;

	@Autowired
	private SdomainService sdomainService;

	public String doList() {
		try {
			List<Object> aaData = new ArrayList<Object>();
			List<Sdomain> sdomainList = sdomainService.selectList();
			for (int i = 0; i < sdomainList.size(); i++) {
				aaData.add(sdomainList.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("SdomainAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			sdomainService.addSdomain(sdomain);
			if (logo != null) {
				logger.info("Begin handle logo, {}", logoFileName);
				String newFileName = "/sdomain/" + sdomain.getCode() + "/logo.png";
				File fileToCreate = new File(CommonConfig.CONFIG_PIXDATA_HOME + newFileName);
				if (fileToCreate.exists()) {
					fileToCreate.delete();
				}
				FileUtils.moveFile(logo, fileToCreate);
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("SdomainAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			if (logo != null) {
				logger.info("Begin handle logo, {}", logoFileName);
				String newFileName = "/sdomain/" + sdomain.getCode() + "/logo.png";
				File fileToCreate = new File(CommonConfig.CONFIG_PIXDATA_HOME + newFileName);
				if (fileToCreate.exists()) {
					fileToCreate.delete();
				}
				FileUtils.moveFile(logo, fileToCreate);
			}
			sdomainService.updateSdomain(sdomain);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("SdomainAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			sdomainService.deleteSdomain("" + sdomain.getSdomainid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("SdomainAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doValidate() {
		try {
			if (sdomain.getName() != null) {
				if (sdomainService.validateName(sdomain)) {
					return SUCCESS;
				} else {
					setErrorcode(-1);
					setErrormsg("名称已存在");
					return ERROR;
				}
			}
			if (sdomain.getCode() != null) {
				if (sdomainService.validateCode(sdomain)) {
					return SUCCESS;
				} else {
					setErrorcode(-1);
					setErrormsg("编码已存在");
					return ERROR;
				}
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("SdomainAction doValidate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Sdomain getSdomain() {
		return sdomain;
	}

	public void setSdomain(Sdomain sdomain) {
		this.sdomain = sdomain;
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
