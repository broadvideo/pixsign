package com.broadvideo.pixsignage.action;

import java.io.File;
import java.io.FilenameFilter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.io.comparator.LastModifiedFileComparator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.App;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.persistence.AppMapper;

@Scope("request")
@Controller("appAction")
public class AppAction extends BaseDatatableAction {
	@SuppressWarnings("unused")
	private Logger logger = LoggerFactory.getLogger(getClass());

	private App app;

	@Autowired
	private AppMapper appMapper;

	@Autowired
	protected ResourceBundleMessageSource messageSource;

	public String doList() {
		try {
			List<App> appList;
			if (getLoginStaff().getVsp() == null) {
				appList = appMapper.selectList();
			} else if (getLoginStaff().getVsp().getApplist() == null) {
				appList = new ArrayList<App>();
			} else {
				appList = getLoginStaff().getVsp().getApplist();
			}
			if (appList != null) {
				for (App app : appList) {
					app.setDescription(
							messageSource.getMessage("app." + app.getName(), null, LocaleContextHolder.getLocale()));
				}

			}
			List<Object> aaData = new ArrayList<Object>();
			for (int i = 0; i < appList.size(); i++) {
				aaData.add(appList.get(i));
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

	public String doFileList() {
		try {
			List<Object> aaData = new ArrayList<Object>();
			Org org = getLoginStaff().getOrg();
			if (org != null && org.getApplist() != null) {
				List<App> applist = org.getApplist();
				for (App app : applist) {
					HashMap<String, String> hash = getAppFile(app.getName(), app.getSubdir(), app.getMainboard(),
							messageSource.getMessage("app." + app.getName(), null, LocaleContextHolder.getLocale()));
					if (hash != null) {
						aaData.add(hash);
					}
				}
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("Device doAPPList error ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	private HashMap<String, String> getAppFile(String appname, String subdir, String mainboard, String description) {
		HashMap<String, String> app = new HashMap<String, String>();
		app.put("mainboard", mainboard);
		app.put("description", description);
		app.put("file", "");
		app.put("url", "");
		app.put("vname", "");
		app.put("vcode", "");
		app.put("time", "");

		File dir = new File("/opt/pixdata/app/" + subdir);
		File[] files = dir.listFiles(new FilenameFilter() {
			@Override
			public boolean accept(File dir, String name) {
				return name.startsWith(appname + "-") && name.endsWith((".apk"));
			}
		});

		if (files != null && files.length > 0) {
			Arrays.sort(files, LastModifiedFileComparator.LASTMODIFIED_REVERSE);

			String vname = "";
			String vcode = "0";
			String filename = files[0].getName();
			String[] apks = filename.split("-");
			if (apks.length >= 3) {
				vname = apks[1];
				vcode = apks[2];
				if (vcode.indexOf(".") > 0) {
					vcode = vcode.substring(0, vcode.indexOf("."));
				}
			}

			app.put("file", files[0].getName());
			app.put("url", "/pixdata/app/" + subdir + "/" + files[0].getName());
			app.put("vname", vname);
			app.put("vcode", vcode);
			app.put("time", "" + new File("/opt/pixdata/app/" + subdir + "/" + files[0].getName()).lastModified());
		}
		return app;
	}

}
