package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Onlinelog;
import com.broadvideo.pixsignage.service.OnlinelogService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("onlinelogAction")
public class OnlinelogAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Onlinelog onlinelog;

	@Autowired
	private OnlinelogService onlinelogService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");

			List<Object> aaData = new ArrayList<Object>();
			int count = onlinelogService.selectCount("" + getLoginStaff().getOrgid(), null);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Onlinelog> onlinelogList = onlinelogService.selectList("" + getLoginStaff().getOrgid(), null, start,
					length);
			for (int i = 0; i < onlinelogList.size(); i++) {
				aaData.add(onlinelogList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("OnlinelogAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Onlinelog getOnlinelog() {
		return onlinelog;
	}

	public void setOnlinelog(Onlinelog onlinelog) {
		this.onlinelog = onlinelog;
	}

}
