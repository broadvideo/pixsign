package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Bundle;
import com.broadvideo.pixsignage.domain.Bundleschedule;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.service.BundleService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("bundleAction")
public class BundleAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Bundle bundle;
	private Device[] devices;
	private Devicegroup[] devicegroups;
	private Bundleschedule[] bundleschedules;

	@Autowired
	private BundleService bundleService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}

			int count = bundleService.selectCount("" + getLoginStaff().getOrgid(), branchid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Bundle> bundleList = bundleService.selectList("" + getLoginStaff().getOrgid(), branchid, search, start,
					length);
			for (int i = 0; i < bundleList.size(); i++) {
				aaData.add(bundleList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			bundle.setOrgid(getLoginStaff().getOrgid());
			bundle.setBranchid(getLoginStaff().getBranchid());
			bundle.setCreatestaffid(getLoginStaff().getStaffid());
			bundleService.addBundle(bundle);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			bundleService.updateBundle(bundle);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			bundleService.deleteBundle("" + bundle.getBundleid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doSync() {
		try {
			String bundleid = getParameter("bundleid");
			bundleService.syncBundle(bundleid);
			logger.info("Bundle sync success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doSync exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDesign() {
		try {
			bundle.setCreatestaffid(getLoginStaff().getStaffid());
			bundleService.design(bundle);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doDesign exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doPush() {
		try {
			bundleService.push(bundle, devices, devicegroups);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doSchedule exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doWizard() {
		try {
			bundle.setOrgid(getLoginStaff().getOrgid());
			bundle.setBranchid(getLoginStaff().getBranchid());
			bundle.setCreatestaffid(getLoginStaff().getStaffid());
			bundleService.handleWizard(getLoginStaff(), bundle, devices, devicegroups);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doWizard exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doBundleschedulesAdd() {
		try {
			bundleService.addBundleschedules(bundleschedules);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doBundleschedulesAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Bundle getBundle() {
		return bundle;
	}

	public void setBundle(Bundle bundle) {
		this.bundle = bundle;
	}

	public Device[] getDevices() {
		return devices;
	}

	public void setDevices(Device[] devices) {
		this.devices = devices;
	}

	public Devicegroup[] getDevicegroups() {
		return devicegroups;
	}

	public void setDevicegroups(Devicegroup[] devicegroups) {
		this.devicegroups = devicegroups;
	}

	public Bundleschedule[] getBundleschedules() {
		return bundleschedules;
	}

	public void setBundleschedules(Bundleschedule[] bundleschedules) {
		this.bundleschedules = bundleschedules;
	}

}
