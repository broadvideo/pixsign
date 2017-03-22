package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Playlog;
import com.broadvideo.pixsignage.persistence.PlaylogMapper;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("playlogAction")
public class PlaylogAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Playlog playlog;

	@Autowired
	private PlaylogMapper playlogMapper;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String deviceid = getParameter("deviceid");
			String day = getParameter("day");
			day = day.replace("-", "");
			if (day.equals("")) {
				day = null;
			}

			List<Object> aaData = new ArrayList<Object>();
			int count = playlogMapper.selectCount("" + getLoginStaff().getOrgid(), deviceid, day);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Playlog> playlogList = playlogMapper.selectList("" + getLoginStaff().getOrgid(), deviceid, day, start,
					length);
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

	public String doDeviceStatList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);

			List<Object> aaData = new ArrayList<Object>();
			int count = playlogMapper.selectDeviceStatCount("" + getLoginStaff().getOrgid(), null, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<HashMap<String, Object>> list = playlogMapper.selectDeviceStatList("" + getLoginStaff().getOrgid(),
					null, search, start, length);
			for (int i = 0; i < list.size(); i++) {
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PlaylogAction doDeviceStatList exception, ", ex);
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
