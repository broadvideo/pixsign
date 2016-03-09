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
import com.broadvideo.pixsignage.domain.Layoutschedule;
import com.broadvideo.pixsignage.domain.Region;
import com.broadvideo.pixsignage.domain.Regionschedule;
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
	private Layoutschedule[] layoutschedules;
	private Regionschedule[] regionschedules;

	@Autowired
	private LayoutService layoutService;
	@Autowired
	private RegionService regionService;
	@Autowired
	private BundleService bundleService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String type = getParameter("type");
			List<Object> aaData = new ArrayList<Object>();
			List<Layout> layoutList = layoutService.selectList("" + getLoginStaff().getOrgid(), type);
			for (int i = 0; i < layoutList.size(); i++) {
				aaData.add(layoutList.get(i));
			}
			this.setAaData(aaData);
			this.setiTotalRecords(layoutList.size());
			this.setiTotalDisplayRecords(layoutList.size());

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
			layout.setOrgid(getLoginStaff().getOrgid());
			layout.setCreatestaffid(getLoginStaff().getStaffid());
			layoutService.addLayout(layout);
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
			layoutService.updateLayout(layout);
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
			layoutService.deleteLayout("" + layout.getLayoutid());
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
			String layoutid = getParameter("layoutid");
			bundleService.syncBundleLayoutByLayout(layoutid);
			logger.info("Layout schedule sync success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("Device schedule sync error", ex);
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
			ex.printStackTrace();
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
			ex.printStackTrace();
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
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doWizard() {
		try {
			String taskid = layoutService.handleWizard(getLoginStaff(), layout, devices, devicegroups);
			setDataid(taskid);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doLayoutschedulesAdd() {
		try {
			if (devices != null) {
				layoutService.addLayoutschedules(layoutschedules, devices);
			}
			if (devicegroups != null) {
				layoutService.addLayoutschedules(layoutschedules, devicegroups);
			}
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doRegionschedulesAdd() {
		try {
			if (devices != null) {
				layoutService.addRegionschedules(regionschedules, devices);
			}
			if (devicegroups != null) {
				layoutService.addRegionschedules(regionschedules, devicegroups);
			}
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
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

	public Layoutschedule[] getLayoutschedules() {
		return layoutschedules;
	}

	public void setLayoutschedules(Layoutschedule[] layoutschedules) {
		this.layoutschedules = layoutschedules;
	}

	public Regionschedule[] getRegionschedules() {
		return regionschedules;
	}

	public void setRegionschedules(Regionschedule[] regionschedules) {
		this.regionschedules = regionschedules;
	}
}
