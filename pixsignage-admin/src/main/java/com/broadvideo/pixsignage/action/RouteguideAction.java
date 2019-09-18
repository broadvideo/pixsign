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
import com.broadvideo.pixsignage.domain.Route;
import com.broadvideo.pixsignage.domain.Routeguide;
import com.broadvideo.pixsignage.service.RouteguideService;
import com.broadvideo.pixsignage.util.CommonUtil;

@Scope("request")
@Controller("routeguideAction")
public class RouteguideAction extends BaseDatatableAction {
	@SuppressWarnings("unused")
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Routeguide routeguide;

	private File pic;
	private String picContentType;
	private String picFileName;

	@Autowired
	private RouteguideService routeguideService;

	public String doList() {
		try {
			List<Object> aaData = new ArrayList<Object>();
			List<Routeguide> routeguideList = routeguideService.selectList();
			for (int i = 0; i < routeguideList.size(); i++) {
				aaData.add(routeguideList.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("RouteguideAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doRouteList() {
		try {
			List<Object> aaData = new ArrayList<Object>();
			List<Route> routeList = routeguideService.selectRouteList();
			for (int i = 0; i < routeList.size(); i++) {
				aaData.add(routeList.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("RouteguideAction doRouteList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			routeguideService.addRouteguide(routeguide);
			if (pic != null) {
				logger.info("Begin handle pic, {}", picFileName);
				String newFileName = "/routeguide/" + routeguide.getRouteguideid() + "/" + "guide.png";
				File fileToCreate = new File(CommonConfig.CONFIG_PIXDATA_HOME + newFileName);
				if (fileToCreate.exists()) {
					fileToCreate.delete();
				}
				CommonUtil.resizeImage(pic, fileToCreate, 1920);
				FileUtils.deleteQuietly(pic);
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("RouteguideAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			if (pic != null) {
				logger.info("Begin handle pic, {}", picFileName);
				String newFileName = "/routeguide/" + routeguide.getRouteguideid() + "/" + "guide.png";
				File fileToCreate = new File(CommonConfig.CONFIG_PIXDATA_HOME + newFileName);
				if (fileToCreate.exists()) {
					fileToCreate.delete();
				}
				CommonUtil.resizeImage(pic, fileToCreate, 1920);
				FileUtils.deleteQuietly(pic);
			}
			routeguideService.updateRouteguide(routeguide);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("RouteguideAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			routeguideService.deleteRouteguide("" + routeguide.getRouteguideid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("RouteguideAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doZip() {
		try {
			routeguideService.zipRouteguide("" + routeguide.getRouteguideid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("RouteguideAction doZip exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doValidate() {
		try {
			if (routeguide.getCode() != null) {
				if (routeguideService.validateCode(routeguide)) {
					return SUCCESS;
				} else {
					setErrorcode(-1);
					setErrormsg("编码已存在");
					return ERROR;
				}
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("RouteguideAction doValidate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Routeguide getRouteguide() {
		return routeguide;
	}

	public void setRouteguide(Routeguide routeguide) {
		this.routeguide = routeguide;
	}

	public File getPic() {
		return pic;
	}

	public void setPic(File pic) {
		this.pic = pic;
	}

	public String getPicContentType() {
		return picContentType;
	}

	public void setPicContentType(String picContentType) {
		this.picContentType = picContentType;
	}

	public String getPicFileName() {
		return picFileName;
	}

	public void setPicFileName(String picFileName) {
		this.picFileName = picFileName;
	}
}
