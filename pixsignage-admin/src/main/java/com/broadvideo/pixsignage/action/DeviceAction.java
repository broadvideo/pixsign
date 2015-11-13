package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.service.DeviceService;
import com.broadvideo.pixsignage.service.LayoutscheduleService;
import com.broadvideo.pixsignage.service.RegionscheduleService;

@Scope("request")
@Controller("deviceAction")
public class DeviceAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3726318006551230634L;

	private static final Logger log = Logger.getLogger(DeviceAction.class);

	private Device device;

	@Autowired
	private DeviceService deviceService;
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
			String branchid = getParameter("branchid");
			String devicegroupid = getParameter("devicegroupid");

			if (branchid == null) {
				branchid = "" + getLoginStaff().getBranchid();
			}

			int count = deviceService.selectCount("" + getLoginStaff().getOrgid(), branchid, devicegroupid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Device> deviceList = deviceService.selectList("" + getLoginStaff().getOrgid(), branchid, devicegroupid,
					search, start, length);
			for (int i = 0; i < deviceList.size(); i++) {
				aaData.add(deviceList.get(i));
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

	public String doUnregisterList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = null;
			if (getParameter("sSearch") != null) {
				search = new String(getParameter("sSearch").trim().getBytes("ISO-8859-1"), "utf-8");
			}

			int count = deviceService.selectUnregisterCount("" + getLoginStaff().getOrgid(), search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Device> deviceList = deviceService.selectUnregisterList("" + getLoginStaff().getOrgid(), search, start,
					length);
			for (int i = 0; i < deviceList.size(); i++) {
				aaData.add(deviceList.get(i));
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
			device.setOrgid(getLoginStaff().getOrgid());
			device.setBranchid(getLoginStaff().getBranchid());

			device.setHardkey(device.getName());
			deviceService.addDevice(device);
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
			deviceService.updateDeviceSelective(device);
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
			deviceService.deleteDevice("" + device.getDeviceid());
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doGet() {
		try {
			int deviceid = device.getDeviceid();
			device = deviceService.selectByPrimaryKey("" + deviceid);
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
			String deviceid = getParameter("deviceid");
			layoutscheduleService.syncLayoutschedule("1", deviceid);
			regionscheduleService.syncRegionschedule("1", deviceid);
			log.error("Device schedule sync success");
			return SUCCESS;
		} catch (Exception ex) {
			log.error("Device schedule sync error: " + ex.getMessage());
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Device getDevice() {
		return device;
	}

	public void setDevice(Device device) {
		this.device = device;
	}

}
