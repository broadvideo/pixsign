package com.broadvideo.pixsignage.action.signage;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.domain.Adplan;
import com.broadvideo.pixsignage.service.AdplanService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("adplanAction")
public class AdplanAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Adplan adplan;

	@Autowired
	private AdplanService adplanService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");

			List<Object> aaData = new ArrayList<Object>();
			int count = adplanService.selectCount("" + getLoginStaff().getOrgid());
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Adplan> adplanList = adplanService.selectList("" + getLoginStaff().getOrgid(), start, length);
			for (int i = 0; i < adplanList.size(); i++) {
				aaData.add(adplanList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AdplanAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			adplan.setOrgid(getLoginStaff().getOrgid());
			adplanService.addAdplan(adplan);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AdplanAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			adplanService.updateAdplan(adplan);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AdplanAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			adplanService.deleteAdplan("" + adplan.getAdplanid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AdplanAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Adplan getAdplan() {
		return adplan;
	}

	public void setAdplan(Adplan adplan) {
		this.adplan = adplan;
	}

}
