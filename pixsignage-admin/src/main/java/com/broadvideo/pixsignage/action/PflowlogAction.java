package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Pflowlog;
import com.broadvideo.pixsignage.persistence.PflowlogMapper;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("pflowlogAction")
public class PflowlogAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Pflowlog pflowlog;

	@Autowired
	private PflowlogMapper pflowlogMapper;

	public String doDeviceStatList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);

			List<Object> aaData = new ArrayList<Object>();
			int count = pflowlogMapper.selectDeviceStatCount("" + getLoginStaff().getOrgid(), null, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<HashMap<String, Object>> list = pflowlogMapper.selectDeviceStatList("" + getLoginStaff().getOrgid(),
					null, search, start, length);
			for (int i = 0; i < list.size(); i++) {
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PflowlogAction doDeviceStatList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doStatByHour() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String deviceid = getParameter("deviceid");
			String day = getParameter("day");

			List<Object> aaData = new ArrayList<Object>();
			List<HashMap<String, Object>> list = pflowlogMapper.statByHour(deviceid, day);
			for (int i = 0; i < list.size(); i++) {
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PflowlogAction doStatByHour exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doStatByDay() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String deviceid = getParameter("deviceid");
			String month = getParameter("month");

			List<Object> aaData = new ArrayList<Object>();
			List<HashMap<String, Object>> list = pflowlogMapper.statByDay(deviceid, month);
			for (int i = 0; i < list.size(); i++) {
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PflowlogAction doStatByDay exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Pflowlog getPflowlog() {
		return pflowlog;
	}

	public void setPflowlog(Pflowlog pflowlog) {
		this.pflowlog = pflowlog;
	}

}
