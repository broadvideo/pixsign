package com.broadvideo.pixsignage.action.signage;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.domain.Wxdevice;
import com.broadvideo.pixsignage.service.WxdeviceService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("wxdeviceAction")
public class WxdeviceAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Wxdevice wxdevice;

	@Autowired
	private WxdeviceService wxdeviceService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String wxdeviceapplyid = getParameter("wxdeviceapplyid");

			List<Object> aaData = new ArrayList<Object>();
			int count = wxdeviceService.selectCount("" + getLoginStaff().getOrgid(), wxdeviceapplyid);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Wxdevice> wxdeviceList = wxdeviceService.selectList("" + getLoginStaff().getOrgid(), wxdeviceapplyid,
					start, length);
			for (int i = 0; i < wxdeviceList.size(); i++) {
				aaData.add(wxdeviceList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("WxdeviceAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doBind() {
		try {
			wxdevice.setBindtime(Calendar.getInstance().getTime());
			wxdeviceService.updateWxdevice(wxdevice);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("WxdeviceAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Wxdevice getWxdevice() {
		return wxdevice;
	}

	public void setWxdevice(Wxdevice wxdevice) {
		this.wxdevice = wxdevice;
	}

}
