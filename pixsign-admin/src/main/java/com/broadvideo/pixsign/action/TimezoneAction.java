package com.broadvideo.pixsign.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsign.domain.Timezone;
import com.broadvideo.pixsign.persistence.TimezoneMapper;
import com.broadvideo.pixsign.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("timezoneAction")
public class TimezoneAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private TimezoneMapper timezoneMapper;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);

			List<Object> aaData = new ArrayList<Object>();
			int count = timezoneMapper.selectCount(search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Timezone> timezoneList = timezoneMapper.selectList(search, start, length);
			for (int i = 0; i < timezoneList.size(); i++) {
				aaData.add(timezoneList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TimezoneAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}
}
