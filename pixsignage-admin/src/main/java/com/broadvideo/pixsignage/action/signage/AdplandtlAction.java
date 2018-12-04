package com.broadvideo.pixsignage.action.signage;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.domain.Adplandtl;
import com.broadvideo.pixsignage.service.AdplandtlService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("adplandtlAction")
public class AdplandtlAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Adplandtl adplandtl;

	@Autowired
	private AdplandtlService adplandtlService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String adplanid = getParameter("adplanid");

			List<Object> aaData = new ArrayList<Object>();
			int count = adplandtlService.selectCount(adplanid);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Adplandtl> adplandtlList = adplandtlService.selectList(adplanid, start, length);
			for (int i = 0; i < adplandtlList.size(); i++) {
				aaData.add(adplandtlList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AdplandtlAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			adplandtl.setOrgid(getLoginStaff().getOrgid());
			adplandtlService.addAdplandtl(adplandtl);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AdplandtlAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			adplandtlService.updateAdplandtl(adplandtl);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AdplandtlAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			adplandtlService.deleteAdplandtl("" + adplandtl.getAdplandtlid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AdplandtlAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Adplandtl getAdplandtl() {
		return adplandtl;
	}

	public void setAdplandtl(Adplandtl adplandtl) {
		this.adplandtl = adplandtl;
	}

}
