package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Devicefile;
import com.broadvideo.pixsignage.service.DevicefileService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("devicefileAction")
public class DevicefileAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Devicefile devicefile;

	@Autowired
	private DevicefileService devicefileService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String objtype = getParameter("objtype");
			String deviceid = getParameter("deviceid");

			int count = devicefileService.selectCount(deviceid, objtype, null);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Devicefile> devicefileList = devicefileService.selectList(deviceid, objtype, null, start, length);
			for (int i = 0; i < devicefileList.size(); i++) {
				aaData.add(devicefileList.get(i));
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

	public Devicefile getDevicefile() {
		return devicefile;
	}

	public void setDevicefile(Devicefile devicefile) {
		this.devicefile = devicefile;
	}
}
