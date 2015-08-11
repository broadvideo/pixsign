package com.broadvideo.signage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.domain.Device;
import com.broadvideo.signage.domain.Media;
import com.broadvideo.signage.service.DeviceService;

@Scope("request")
@Controller("deviceAction")
public class DeviceAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3726318006551230634L;

	private static final Logger log = Logger.getLogger(DeviceAction.class);

	private Device device;
	private String[] ids;

	private Media media;

	@Autowired
	private DeviceService deviceService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String branchid = getParameter("branchid");
			String metrolineid = getParameter("metrolineid");
			String metrostationid = getParameter("metrostationid");
			String metrotype = getParameter("metrotype");
			String metrodirection = getParameter("metrodirection");

			String search = null;
			if (getParameter("sSearch") != null) {
				search = new String(getParameter("sSearch").trim().getBytes("ISO-8859-1"), "utf-8");
			}

			if (branchid == null) {
				branchid = "" + getLoginStaff().getBranchid();
			}

			int count = deviceService.selectCount("" + getLoginStaff().getOrgid(), branchid, metrolineid,
					metrostationid, metrotype, metrodirection, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Device> deviceList = deviceService.selectList("" + getLoginStaff().getOrgid(), branchid, metrolineid,
					metrostationid, metrotype, metrodirection, search, start, length);
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
			List<Device> deviceList = deviceService.selectUnregisterList("" + getLoginStaff().getOrgid(), search,
					start, length);
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

	public String doAvailListByDeviceGroup() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String devicegroupid = getParameter("devicegroupid");

			int count = deviceService.selectAvailCountByDeviceGroup(getLoginStaff().getOrgid(), getLoginStaff()
					.getBranchid(), devicegroupid);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Device> deviceList = deviceService.selectAvailListByDeviceGroup(getLoginStaff().getOrgid(),
					getLoginStaff().getBranchid(), devicegroupid, start, length);
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
			deviceService.updateDevice(device);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doConfig() {
		try {
			deviceService.configDevice(device);
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
			if (ids != null) {
				deviceService.deleteDevice(ids);
			}
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

	public Device getDevice() {
		return device;
	}

	public void setDevice(Device device) {
		this.device = device;
	}

	public String[] getIds() {
		return ids;
	}

	public void setIds(String[] ids) {
		this.ids = ids;
	}

	public Media getMedia() {
		return media;
	}

	public void setMedia(Media media) {
		this.media = media;
	}

}
