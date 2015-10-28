package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Dvb;
import com.broadvideo.pixsignage.service.DvbService;

@Scope("request")
@Controller("dvbAction")
public class DvbAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4489965421350738986L;

	private static final Logger log = Logger.getLogger(DvbAction.class);

	private Dvb dvb;

	@Autowired
	private DvbService dvbService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			List<Object> aaData = new ArrayList<Object>();
			int count = dvbService.selectCount("" + getLoginStaff().getOrgid());
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Dvb> dvbList = dvbService.selectList("" + getLoginStaff().getOrgid(), start, length);
			for (int i = 0; i < dvbList.size(); i++) {
				aaData.add(dvbList.get(i));
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
			dvb.setOrgid(getLoginStaff().getOrgid());
			dvb.setCreatestaffid(getLoginStaff().getStaffid());
			dvbService.addDvb(dvb);
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
			dvbService.updateDvb(dvb);
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
			dvbService.deleteDvb("" + dvb.getDvbid());
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Dvb getDvb() {
		return dvb;
	}

	public void setDvb(Dvb dvb) {
		this.dvb = dvb;
	}

}
