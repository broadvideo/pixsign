package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Bundleschedule;
import com.broadvideo.pixsignage.service.BundleService;
import com.broadvideo.pixsignage.service.BundlescheduleService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("bundlescheduleAction")
public class BundlescheduleAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Bundleschedule bundleschedule;

	@Autowired
	private BundlescheduleService bundlescheduleService;
	@Autowired
	private BundleService bundleService;

	public String doList() {
		try {
			String bindtype = getParameter("bindtype");
			String bindid = getParameter("bindid");
			List<Object> aaData = new ArrayList<Object>();
			List<Bundleschedule> bundlescheduleList = bundlescheduleService.selectList(bindtype, bindid);
			for (int i = 0; i < bundlescheduleList.size(); i++) {
				aaData.add(bundlescheduleList.get(i));
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

	public String doAdd() {
		try {
			bundlescheduleService.addBundleschedule(bundleschedule);
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
			bundlescheduleService.updateBundleschedule(bundleschedule);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			bundlescheduleService.deleteBundleschedule("" + bundleschedule.getBundlescheduleid());
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doSync() {
		try {
			String bindtype = getParameter("bindtype");
			String bindid = getParameter("bindid");
			if (bindtype != null && bindid != null) {
				bundleService.syncBundleLayout(bindtype, bindid);
				bundleService.syncBundleRegions(bindtype, bindid);
				logger.error("Bundle schedule sync success");
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("Bundle schedule sync error: " + ex.getMessage());
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Bundleschedule getBundleschedule() {
		return bundleschedule;
	}

	public void setBundleschedule(Bundleschedule bundleschedule) {
		this.bundleschedule = bundleschedule;
	}

}
