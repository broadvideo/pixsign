package com.broadvideo.pixsignage.action.signage;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.domain.Vchannelschedule;
import com.broadvideo.pixsignage.service.VchannelscheduleService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("vchannelscheduleAction")
public class VchannelscheduleAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Vchannelschedule vchannelschedule;

	@Autowired
	private VchannelscheduleService vchannelscheduleService;

	public String doList() {
		try {
			String vchannelid = getParameter("vchannelid");
			List<Object> aaData = new ArrayList<Object>();
			List<Vchannelschedule> vchannelscheduleList = vchannelscheduleService.selectList(vchannelid);
			for (int i = 0; i < vchannelscheduleList.size(); i++) {
				aaData.add(vchannelscheduleList.get(i));
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
			vchannelscheduleService.addVchannelschedule(vchannelschedule);
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
			vchannelscheduleService.updateVchannelschedule(vchannelschedule);
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
			vchannelscheduleService.deleteVchannelschedule("" + vchannelschedule.getVchannelscheduleid());
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
			String vchannelid = getParameter("vchannelid");
			if (vchannelid != null) {
				vchannelscheduleService.syncVchannelschedule(vchannelid);
				logger.error("Vchannel schedule sync success");
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("Vchannel schedule sync error: " + ex.getMessage());
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Vchannelschedule getVchannelschedule() {
		return vchannelschedule;
	}

	public void setVchannelschedule(Vchannelschedule vchannelschedule) {
		this.vchannelschedule = vchannelschedule;
	}

}
