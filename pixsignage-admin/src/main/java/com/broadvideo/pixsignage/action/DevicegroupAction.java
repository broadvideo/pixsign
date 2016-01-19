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
import com.broadvideo.pixsignage.service.DevicegroupService;
import com.broadvideo.pixsignage.service.LayoutService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("devicegroupAction")
public class DevicegroupAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Devicegroup devicegroup;
	private Device device;

	@Autowired
	private DevicegroupService devicegroupService;
	@Autowired
	private LayoutService layoutService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");

			int count = devicegroupService.selectCount("" + getLoginStaff().getOrgid(),
					"" + getLoginStaff().getBranchid(), search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Devicegroup> devicegroupList = devicegroupService.selectList("" + getLoginStaff().getOrgid(),
					"" + getLoginStaff().getBranchid(), search, start, length);
			for (int i = 0; i < devicegroupList.size(); i++) {
				aaData.add(devicegroupList.get(i));
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
			devicegroup.setOrgid(getLoginStaff().getOrgid());
			devicegroup.setBranchid(getLoginStaff().getBranchid());
			devicegroup.setCreatestaffid(getLoginStaff().getStaffid());

			devicegroupService.addDevicegroup(devicegroup);
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
			devicegroupService.updateDevicegroup(devicegroup);
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
			devicegroupService.deleteDevicegroup("" + devicegroup.getDevicegroupid());
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDeviceAdd() {
		try {
			devicegroupService.addDevice(devicegroup, device);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDeviceDelete() {
		try {
			devicegroupService.deleteDevice(devicegroup, device);
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
			String devicegroupid = getParameter("devicegroupid");
			layoutService.syncLayoutschedule("2", devicegroupid);
			layoutService.syncRegionschedule("2", devicegroupid);
			logger.error("Devicegroup schedule sync success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("Devicegroup schedule sync error: " + ex.getMessage());
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Devicegroup getDevicegroup() {
		return devicegroup;
	}

	public void setDevicegroup(Devicegroup devicegroup) {
		this.devicegroup = devicegroup;
	}

	public Device getDevice() {
		return device;
	}

	public void setDevice(Device device) {
		this.device = device;
	}
}
