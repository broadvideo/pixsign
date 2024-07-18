package com.broadvideo.pixsign.action.signage;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsign.action.BaseDatatableAction;
import com.broadvideo.pixsign.domain.Devicegroup;
import com.broadvideo.pixsign.domain.Planbind;
import com.broadvideo.pixsign.service.DevicegroupService;
import com.broadvideo.pixsign.service.SyncService;
import com.broadvideo.pixsign.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("devicegroupAction")
public class DevicegroupAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Devicegroup devicegroup;
	private String[] detailids;

	@Autowired
	private DevicegroupService devicegroupService;
	@Autowired
	private SyncService syncService;

	public String doGet() {
		try {
			String devicegroupid = getParameter("devicegroupid");
			devicegroup = devicegroupService.selectByPrimaryKey(devicegroupid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DevicegroupAction doGet exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			String type = getParameter("type");
			String gridlayoutcode = getParameter("gridlayoutcode");
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}

			int count = devicegroupService.selectCount("" + getLoginStaff().getOrgid(), branchid, type, gridlayoutcode,
					search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Devicegroup> devicegroupList = devicegroupService.selectList("" + getLoginStaff().getOrgid(), branchid,
					type, gridlayoutcode, search, start, length);
			for (int i = 0; i < devicegroupList.size(); i++) {
				aaData.add(devicegroupList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DevicegroupAction doList exception", ex);
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
			logger.error("DevicegroupAction doAdd exception", ex);
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
			logger.error("DevicegroupAction doUpdate exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			String devicegroupid = getParameter("devicegroupid");
			devicegroupService.deleteDevicegroup(devicegroupid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DevicegroupAction doDelete exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAddDevices() {
		try {
			devicegroupService.addDevices(devicegroup, detailids);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DevicegroupAction doAddDevices exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDeleteDevices() {
		try {
			devicegroupService.deleteDevices(devicegroup, detailids);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DevicegroupAction doDeleteDevices exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdateBundle() {
		try {
			String defaultbundleid = getParameter("defaultbundleid");
			String devicegroupids = getParameter("devicegroupids");
			logger.info("Devicegroup doUpdateBundle, devicegroupids={},defaultbundleid={}", devicegroupids,
					defaultbundleid);
			devicegroupService.updateBundle(devicegroupids.split(","), defaultbundleid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DevicegroupAction doUpdateBundle exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdatePage() {
		try {
			String defaultpageid = getParameter("defaultpageid");
			String devicegroupids = getParameter("devicegroupids");
			logger.info("Devicegroup doUpdatePage, devicegroupids={},defaultpageid={}", devicegroupids, defaultpageid);
			devicegroupService.updatePage(devicegroupids.split(","), defaultpageid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DevicegroupAction doUpdatePage exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doSync() {
		try {
			String devicegroupid = getParameter("devicegroupid");
			logger.info("Devicegroup doSync, devicegroupid={}", devicegroupid);
			syncService.sync(Planbind.BindType_Devicegroup, devicegroupid, true);
			logger.info("Devicegroup doSync success, devicegroupid={}", devicegroupid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DevicegroupAction doSync exception" + ex.getMessage());
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

	public String[] getDetailids() {
		return detailids;
	}

	public void setDetailids(String[] detailids) {
		this.detailids = detailids;
	}
}
