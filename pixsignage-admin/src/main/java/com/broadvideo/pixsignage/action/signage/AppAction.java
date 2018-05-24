package com.broadvideo.pixsignage.action.signage;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.App;
import com.broadvideo.pixsignage.persistence.AppMapper;

@Scope("request")
@Controller("appAction")
public class AppAction extends BaseDatatableAction {
	@SuppressWarnings("unused")
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private AppMapper appMapper;

	@Autowired
	protected ResourceBundleMessageSource messageSource;

	public String doList() {
		try {
			List<App> appList = null;
			if (getLoginStaff().getSubsystem().equals(CommonConstants.SUBSYSTEM_SYS)) {
				appList = appMapper.selectList();
			} else if (getLoginStaff().getSubsystem().equals(CommonConstants.SUBSYSTEM_VSP)) {
				appList = getLoginStaff().getVsp().getApplist();
			} else if (getLoginStaff().getSubsystem().equals(CommonConstants.SUBSYSTEM_ORG)) {
				appList = getLoginStaff().getOrg().getApplist();
			}
			if (appList == null) {
				appList = new ArrayList<App>();
			}
			/*
			 * if (appList != null) { for (App app : appList) {
			 * app.setDescription( messageSource.getMessage("app." +
			 * app.getName(), null, LocaleContextHolder.getLocale())); }
			 * 
			 * }
			 */
			List<Object> aaData = new ArrayList<Object>();
			for (App app : appList) {
				if (app.getAppfile() != null) {
					aaData.add(app);
				}
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AppAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

}