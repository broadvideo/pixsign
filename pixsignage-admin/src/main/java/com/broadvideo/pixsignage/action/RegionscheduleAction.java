package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Regionschedule;
import com.broadvideo.pixsignage.service.RegionscheduleService;

@Scope("request")
@Controller("regionscheduleAction")
public class RegionscheduleAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7041066156892935918L;

	private static final Logger log = Logger.getLogger(RegionscheduleAction.class);

	private Regionschedule regionschedule;

	@Autowired
	private RegionscheduleService regionscheduleService;

	public String doList() {
		try {
			String bindtype = getParameter("bindtype");
			String bindid = getParameter("bindid");
			String regionid = getParameter("regionid");
			String playmode = getParameter("playmode");
			String fromdate = null;
			if (playmode == null) {
				playmode = "2";
			} else if (playmode.equals("1")) {
				fromdate = CommonConstants.DateFormat_Date.format(Calendar.getInstance().getTime());
			}
			List<Object> aaData = new ArrayList<Object>();
			List<Regionschedule> regionscheduleList = regionscheduleService.selectList(bindtype, bindid, regionid,
					playmode, fromdate, null);
			for (int i = 0; i < regionscheduleList.size(); i++) {
				aaData.add(regionscheduleList.get(i));
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
			regionscheduleService.addRegionschedule(regionschedule);
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
			regionscheduleService.updateRegionschedule(regionschedule);
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
			regionscheduleService.deleteRegionschedule("" + regionschedule.getRegionscheduleid());
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
			String bindtype = getParameter("bindtype");
			String bindid = getParameter("bindid");
			if (bindtype != null && bindid != null) {
				regionscheduleService.syncRegionschedule(bindtype, bindid);
				log.error("Region schedule sync success");
			}
			return SUCCESS;
		} catch (Exception ex) {
			log.error("Region schedule sync error: " + ex.getMessage());
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Regionschedule getRegionschedule() {
		return regionschedule;
	}

	public void setRegionschedule(Regionschedule regionschedule) {
		this.regionschedule = regionschedule;
	}

}
