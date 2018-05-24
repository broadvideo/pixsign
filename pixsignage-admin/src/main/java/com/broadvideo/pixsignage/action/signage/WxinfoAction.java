package com.broadvideo.pixsignage.action.signage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.domain.Wxinfo;
import com.broadvideo.pixsignage.service.WxinfoService;

@Scope("request")
@Controller("wxinfoAction")
public class WxinfoAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Wxinfo wxinfo;

	@Autowired
	private WxinfoService wxinfoService;

	public String doUpdate() {
		try {
			Wxinfo oldwxinfo = wxinfoService.selectByOrg("" + getLoginStaff().getOrgid());
			wxinfo.setWxinfoid(oldwxinfo.getWxinfoid());
			wxinfo.setOrgid(getLoginStaff().getOrgid());
			wxinfoService.updateWxinfo(wxinfo);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("WxinfoAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doGet() {
		try {
			wxinfo = wxinfoService.selectByOrg("" + getLoginStaff().getOrgid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("WxinfoAction doGet exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Wxinfo getWxinfo() {
		return wxinfo;
	}

	public void setWxinfo(Wxinfo wxinfo) {
		this.wxinfo = wxinfo;
	}
}
