package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.service.BundleService;
import com.broadvideo.pixsignage.service.DevicegroupService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("devicegroupAction")
public class DevicegroupAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Devicegroup devicegroup;
	private String[] deviceids;

	@Autowired
	private DevicegroupService devicegroupService;
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

			int count = devicegroupService.selectCount("" + getLoginStaff().getOrgid(), branchid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Devicegroup> devicegroupList = devicegroupService.selectList("" + getLoginStaff().getOrgid(), branchid,
					search, start, length);
			for (int i = 0; i < devicegroupList.size(); i++) {
				aaData.add(devicegroupList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doList exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			devicegroup.setOrgid(getLoginStaff().getOrgid());
			devicegroup.setCreatestaffid(getLoginStaff().getStaffid());
			devicegroupService.addDevicegroup(devicegroup);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doAdd exception", ex);
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
			logger.error("doUpdate exception", ex);
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
			logger.error("doDelete exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAddDevices() {
		try {
			devicegroupService.addDevices(devicegroup, deviceids);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doAddDevices exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDeleteDevices() {
		try {
			devicegroupService.deleteDevices(devicegroup, deviceids);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doDeleteDevices exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doSync() {
		try {
			String devicegroupid = getParameter("devicegroupid");
			bundleService.syncBundleSchedule("2", devicegroupid);
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

	public String[] getDeviceids() {
		return deviceids;
	}

	public void setDeviceids(String[] deviceids) {
		this.deviceids = deviceids;
	}
}
