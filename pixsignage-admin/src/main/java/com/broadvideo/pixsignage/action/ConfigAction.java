package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Config;
import com.broadvideo.pixsignage.service.ConfigService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("configAction")
public class ConfigAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Config config;

	@Autowired
	private ConfigService configService;

	public String doList() {
		try {
			List<Object> aaData = new ArrayList<Object>();
			List<Config> configList = configService.selectList();
			for (int i = 0; i < configList.size(); i++) {
				aaData.add(configList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("ConfigAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			String serverip = getParameter("serverip");
			String serverport = getParameter("serverport");
			String pixedxip = getParameter("pixedxip");
			String pixedxport = getParameter("pixedxport");

			configService.updateValue("ServerIP", serverip);
			configService.updateValue("ServerPort", serverport);
			configService.updateValue("PixedxIP", pixedxip);
			configService.updateValue("PixedxPort", pixedxport);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("ConfigAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Config getConfig() {
		return config;
	}

	public void setConfig(Config config) {
		this.config = config;
	}

}
