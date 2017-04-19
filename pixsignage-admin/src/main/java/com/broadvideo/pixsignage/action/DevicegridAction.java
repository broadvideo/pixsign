package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Devicegrid;
import com.broadvideo.pixsignage.service.DevicegridService;
import com.broadvideo.pixsignage.service.ScheduleService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("devicegridAction")
public class DevicegridAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Devicegrid devicegrid;

	@Autowired
	private DevicegridService devicegridService;
	@Autowired
	private ScheduleService scheduleService;

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

			int count = devicegridService.selectCount("" + getLoginStaff().getOrgid(), branchid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Devicegrid> devicegridList = devicegridService.selectList("" + getLoginStaff().getOrgid(), branchid,
					search, start, length);
			for (int i = 0; i < devicegridList.size(); i++) {
				aaData.add(devicegridList.get(i));
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
			devicegrid.setOrgid(getLoginStaff().getOrgid());
			devicegrid.setBranchid(getLoginStaff().getBranchid());
			devicegridService.addDevicegrid(devicegrid);
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
			devicegridService.updateDevicegrid(devicegrid);
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
			devicegridService.deleteDevicegrid("" + devicegrid.getDevicegridid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doDelete exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDesign() {
		try {
			devicegridService.design(devicegrid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doDesign exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doSync() {
		try {
			String devicegridid = getParameter("devicegridid");
			scheduleService.syncSchedule("3", devicegridid);
			logger.info("Devicegrid schedule sync success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("Devicegrid schedule sync error: " + ex.getMessage());
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Devicegrid getDevicegrid() {
		return devicegrid;
	}

	public void setDevicegrid(Devicegrid devicegrid) {
		this.devicegrid = devicegrid;
	}
}
