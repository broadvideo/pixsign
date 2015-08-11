package com.broadvideo.signage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.domain.Devicefile;
import com.broadvideo.signage.domain.Media;
import com.broadvideo.signage.service.DevicefileService;

@Scope("request")
@Controller("devicefileAction")
public class DevicefileAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5403823367113545215L;

	private static final Logger log = Logger.getLogger(DevicefileAction.class);

	private Devicefile devicefile;
	private String[] ids;

	private Media media;
	private String[] deviceids;

	@Autowired
	private DevicefileService devicefileService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String filetype = getParameter("filetype");
			String deviceid = getParameter("deviceid");

			int count = devicefileService.selectCountByDevice(filetype, deviceid);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Devicefile> devicefileList = devicefileService.selectByDevice(deviceid, filetype, null, start, length);
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

	public String doAdd() {
		try {
			devicefileService.addDevicefile(devicefile);
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
			devicefileService.updateDevicefile(devicefile);
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
				devicefileService.deleteDevicefile(ids);
			}
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

	public String[] getDeviceids() {
		return deviceids;
	}

	public void setDeviceids(String[] deviceids) {
		this.deviceids = deviceids;
	}

}
