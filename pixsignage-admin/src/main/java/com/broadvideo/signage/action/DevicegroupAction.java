package com.broadvideo.signage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.domain.Device;
import com.broadvideo.signage.domain.Devicegroup;
import com.broadvideo.signage.service.DeviceService;
import com.broadvideo.signage.service.DevicegroupService;

@Scope("request")
@Controller("devicegroupAction")
public class DevicegroupAction extends BaseDatatableAction {
	/**
	 * 
	 */
	private static final long serialVersionUID = 2945551468581743149L;

	private static final Logger log = Logger.getLogger(DevicegroupAction.class);

	private Devicegroup devicegroup;
	private String[] ids;

	@Autowired
	private DevicegroupService devicegroupService;
	@Autowired
	private DeviceService deviceService;
	
	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = null;
			if (getParameter("sSearch") != null) {
				search = new String(getParameter("sSearch").trim().getBytes("ISO-8859-1"),"utf-8");
			}
			
			int count = devicegroupService.selectCount(getLoginStaff().getOrgid(), getLoginStaff().getBranchid(), search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Devicegroup> devicegroupList = devicegroupService.selectList(getLoginStaff().getOrgid(), getLoginStaff().getBranchid(), search, start, length);
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
			if (ids != null) {
				devicegroupService.deleteDevicegroup(ids);
			}
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
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

	public String[] getIds() {
		return ids;
	}

	public void setIds(String[] ids) {
		this.ids = ids;
	}

}
