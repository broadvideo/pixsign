package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Layout;
import com.broadvideo.pixsignage.domain.Layoutdtl;
import com.broadvideo.pixsignage.domain.Region;
import com.broadvideo.pixsignage.service.LayoutService;

@Scope("request")
@Controller("layoutAction")
public class LayoutAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8023500547905441044L;

	private static final Logger log = Logger.getLogger(LayoutAction.class);

	private Layout layout;
	private Layoutdtl[] layoutdtls;
	private Device[] devices;
	private Devicegroup[] devicegroups;

	@Autowired
	private LayoutService layoutService;

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

	public String doDtlSync() {
		try {
			layoutService.syncLayoutdtlList(layout, layoutdtls);
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
				regionList = layoutService.selectRegionList();
			} else {
				regionList = layoutService.selectActiveRegionList();
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

	public Layout getLayout() {
		return layout;
	}

	public void setLayout(Layout layout) {
		this.layout = layout;
	}

	public Layoutdtl[] getLayoutdtls() {
		return layoutdtls;
	}

	public void setLayoutdtls(Layoutdtl[] layoutdtls) {
		this.layoutdtls = layoutdtls;
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
