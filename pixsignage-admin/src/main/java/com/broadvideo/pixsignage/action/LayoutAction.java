package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Layout;
import com.broadvideo.pixsignage.domain.Layoutdtl;
import com.broadvideo.pixsignage.domain.Region;
import com.broadvideo.pixsignage.service.BundleService;
import com.broadvideo.pixsignage.service.LayoutService;
import com.broadvideo.pixsignage.service.RegionService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("layoutAction")
public class LayoutAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Layout layout;

	private Device[] devices;
	private Devicegroup[] devicegroups;

	@Autowired
	private LayoutService layoutService;
	@Autowired
	private RegionService regionService;
	@Autowired
	private BundleService bundleService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}

			List<Object> aaData = new ArrayList<Object>();
			List<Layout> layoutList = layoutService.selectList("" + getLoginStaff().getOrgid(), branchid);
			for (int i = 0; i < layoutList.size(); i++) {
				aaData.add(layoutList.get(i));
			}
			this.setAaData(aaData);
			this.setiTotalRecords(layoutList.size());
			this.setiTotalDisplayRecords(layoutList.size());

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("LayoutAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doPublicList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}

			List<Object> aaData = new ArrayList<Object>();
			List<Layout> layoutList = layoutService.selectPublicList("" + getLoginStaff().getOrgid(), branchid);
			for (int i = 0; i < layoutList.size(); i++) {
				aaData.add(layoutList.get(i));
			}
			this.setAaData(aaData);
			this.setiTotalRecords(layoutList.size());
			this.setiTotalDisplayRecords(layoutList.size());

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("LayoutAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			layout.setOrgid(getLoginStaff().getOrgid());
			layout.setBranchid(getLoginStaff().getBranchid());
			layout.setCreatestaffid(getLoginStaff().getStaffid());
			layoutService.addLayout(layout);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("LayoutAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			layoutService.updateLayout(layout);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("LayoutAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			layoutService.deleteLayout("" + layout.getLayoutid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("LayoutAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doSync() {
		try {
			String layoutid = getParameter("layoutid");
			// bundleService.syncBundleByLayout(layoutid);
			logger.info("Layout sync success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("LayoutAction doSync exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDtlList() {
		try {
			String layoutid = getParameter("layoutid");
			List<Object> aaData = new ArrayList<Object>();
			List<Layoutdtl> layoutdtlList = layoutService.selectLayoutdtlList(layoutid);
			for (int i = 0; i < layoutdtlList.size(); i++) {
				aaData.add(layoutdtlList.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("LayoutAction doDtlList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDesign() {
		try {
			layoutService.design(layout);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("LayoutAction doDesign exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doRegionList() {
		try {
			String active = getParameter("active");
			List<Object> aaData = new ArrayList<Object>();
			List<Region> regionList;
			if (active == null) {
				regionList = regionService.selectList();
			} else {
				regionList = regionService.selectActiveList();
			}
			for (int i = 0; i < regionList.size(); i++) {
				aaData.add(regionList.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("LayoutAction doRegionList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Layout getLayout() {
		return layout;
	}

	public void setLayout(Layout layout) {
		this.layout = layout;
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
}
