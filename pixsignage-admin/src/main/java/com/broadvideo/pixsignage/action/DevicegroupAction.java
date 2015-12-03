package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.service.DevicegroupService;
import com.broadvideo.pixsignage.service.LayoutscheduleService;
import com.broadvideo.pixsignage.service.RegionscheduleService;

@Scope("request")
@Controller("devicegroupAction")
public class DevicegroupAction extends BaseDatatableAction {
	/**
	 * 
	 */
	private static final long serialVersionUID = 2945551468581743149L;

	private static final Logger log = Logger.getLogger(DevicegroupAction.class);

	private Devicegroup devicegroup;
	private Device device;

	@Autowired
	private DevicegroupService devicegroupService;
	@Autowired
	private LayoutscheduleService layoutscheduleService;
	@Autowired
	private RegionscheduleService regionscheduleService;

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
			layoutscheduleService.syncLayoutschedule("2", devicegroupid);
			regionscheduleService.syncRegionschedule("2", devicegroupid);
			log.error("Devicegroup schedule sync success");
			return SUCCESS;
		} catch (Exception ex) {
			log.error("Devicegroup schedule sync error: " + ex.getMessage());
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
