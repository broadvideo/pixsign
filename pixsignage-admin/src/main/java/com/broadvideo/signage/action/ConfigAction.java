package com.broadvideo.signage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.domain.Config;
import com.broadvideo.signage.service.ConfigService;

@Scope("request")
@Controller("configAction")
public class ConfigAction extends BaseDatatableAction {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1943403502114062588L;

	private static final Logger log = Logger.getLogger(ConfigAction.class);

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
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			configService.updateConfig(config);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
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
