package com.broadvideo.signage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.domain.Devicegroupdtl;
import com.broadvideo.signage.service.DevicegroupdtlService;

@Scope("request")
@Controller("devicegroupdtlAction")
public class DevicegroupdtlAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8995346009910480689L;

	private static final Logger log = Logger.getLogger(DevicegroupdtlAction.class);

	private Devicegroupdtl devicegroupdtl;
	private String[] ids;

	@Autowired
	private DevicegroupdtlService devicegroupdtlService;
		
	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String devicegroupid = getParameter("devicegroupid");
			
			int count = devicegroupdtlService.selectCountByDeviceGroup(devicegroupid);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Devicegroupdtl> devicegroupdtlList = devicegroupdtlService.selectListByDeviceGroup(devicegroupid, start, length);
			for (int i = 0; i < devicegroupdtlList.size(); i++) {
				aaData.add(devicegroupdtlList.get(i));
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
			devicegroupdtlService.addDevicegroupdtl(devicegroupdtl);
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
			devicegroupdtlService.deleteDevicegroupdtl(devicegroupdtl);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Devicegroupdtl getDevicegroupdtl() {
		return devicegroupdtl;
	}

	public void setDevicegroupdtl(Devicegroupdtl devicegroupdtl) {
		this.devicegroupdtl = devicegroupdtl;
	}

	public String[] getIds() {
		return ids;
	}

	public void setIds(String[] ids) {
		this.ids = ids;
	}

}
