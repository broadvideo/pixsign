package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Playlog;
import com.broadvideo.pixsignage.service.PlaylogService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("playlogAction")
public class PlaylogAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Playlog playlog;

	@Autowired
	private PlaylogService playlogService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");

			List<Object> aaData = new ArrayList<Object>();
			int count = playlogService.selectCount("" + getLoginStaff().getOrgid(), null);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Playlog> playlogList = playlogService.selectList("" + getLoginStaff().getOrgid(), null, start, length);
			for (int i = 0; i < playlogList.size(); i++) {
				aaData.add(playlogList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PlaylogAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Playlog getPlaylog() {
		return playlog;
	}

	public void setPlaylog(Playlog playlog) {
		this.playlog = playlog;
	}

}
