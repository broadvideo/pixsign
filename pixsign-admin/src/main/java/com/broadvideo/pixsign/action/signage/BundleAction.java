package com.broadvideo.pixsign.action.signage;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsign.action.BaseDatatableAction;
import com.broadvideo.pixsign.common.CommonConfig;
import com.broadvideo.pixsign.domain.Bundle;
import com.broadvideo.pixsign.domain.Org;
import com.broadvideo.pixsign.service.BundleService;
import com.broadvideo.pixsign.service.SyncService;
import com.broadvideo.pixsign.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("bundleAction")
public class BundleAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Bundle bundle;
	private HashMap<String, Object>[] binds;

	private String exportname;
	private InputStream inputStream;

	@Autowired
	private BundleService bundleService;
	@Autowired
	private SyncService syncService;

	public String doGet() {
		try {
			String bundleid = getParameter("bundleid");
			bundle = bundleService.selectByPrimaryKey(bundleid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doGet exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

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
			String reviewflag = getParameter("reviewflag");
			String touchflag = getParameter("touchflag");
			String homeflag = getParameter("homeflag");

			int count = bundleService.selectCount("" + getLoginStaff().getOrgid(), branchid, reviewflag, touchflag,
					homeflag, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Bundle> bundleList = bundleService.selectList("" + getLoginStaff().getOrgid(), branchid, reviewflag,
					touchflag, homeflag, search, start, length);
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
			if (bundle.getBranchid() == null) {
				bundle.setBranchid(getLoginStaff().getBranchid());
			}
			bundle.setCreatestaffid(getLoginStaff().getStaffid());
			if (getLoginStaff().getOrg().getReviewflag().equals(Org.FUNCTION_ENABLED)) {
				if (bundle.getHomebundleid() != null && bundle.getHomebundleid() > 0) {
					bundleService.setBundleReviewWait("" + bundle.getHomebundleid());
				}
				bundle.setReviewflag(Bundle.REVIEW_WAIT);
			} else {
				bundle.setReviewflag(Bundle.REVIEW_PASSED);
			}

			String frombundleid = getParameter("frombundleid");
			if (frombundleid != null) {
				bundleService.copyBundle(frombundleid, bundle);
			} else {
				bundleService.addBundle(bundle);
			}

			if (bundle.getHomeflag().equals("1")) {
				bundleService.makeJsonFile("" + bundle.getBundleid());
			} else {
				bundleService.makeJsonFile("" + bundle.getHomebundleid());
			}

			logger.info("Bundle add success, bundleid={}", bundle.getBundleid());
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
			if (bundle.getHomeflag().equals("1")) {
				bundleService.makeJsonFile("" + bundle.getBundleid());
			} else {
				bundleService.makeJsonFile("" + bundle.getHomebundleid());
			}
			logger.info("Bundle update success, bundleid={}", bundle.getBundleid());
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
			logger.info("Bundle delete success, bundleid={}", bundle.getBundleid());
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
			syncService.syncByBundle("" + getLoginStaff().getOrgid(), bundleid);
			logger.info("Bundle sync success, bundleid={}", bundleid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doSync exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doReview() {
		try {
			bundleService.setBundleReviewResut("" + bundle.getBundleid(), bundle.getReviewflag(), bundle.getComment());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doReview exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDesign() {
		try {
			logger.info("BundleAction doDesign bundleid={}", bundle.getBundleid());
			if (getLoginStaff().getOrg().getReviewflag().equals(Org.FUNCTION_ENABLED)) {
				bundleService.setBundleReviewWait("" + bundle.getBundleid());
				bundle.setReviewflag(null);
				bundle.setJson(null);
			}
			bundle.setCreatestaffid(getLoginStaff().getStaffid());
			bundleService.design(bundle);
			if (!getLoginStaff().getOrg().getReviewflag().equals(Org.FUNCTION_ENABLED)) {
				if (bundle.getHomeflag().equals("1")) {
					bundleService.makeJsonFile("" + bundle.getBundleid());
				} else {
					bundleService.makeJsonFile("" + bundle.getHomebundleid());
				}
			}
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
			bundleService.push(bundle, binds);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doPush exception, ", ex);
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
			bundleService.handleWizard(getLoginStaff(), bundle, binds);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doWizard exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doExport() {
		try {
			String bundleid = getParameter("bundleid");
			logger.info("BundleAction doExport, staff={}, bundleid={}", getLoginStaff().getLoginname(), bundleid);
			exportname = "bundle.zip";
			File zipFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + "/bundle/" + bundleid, "bundle-export.zip");
			inputStream = new FileInputStream(zipFile);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doExport exception, ", ex);
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

	public HashMap<String, Object>[] getBinds() {
		return binds;
	}

	public void setBinds(HashMap<String, Object>[] binds) {
		this.binds = binds;
	}

	public String getExportname() {
		return exportname;
	}

	public void setExportname(String exportname) {
		this.exportname = exportname;
	}

	public InputStream getInputStream() {
		return inputStream;
	}

	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}

}
