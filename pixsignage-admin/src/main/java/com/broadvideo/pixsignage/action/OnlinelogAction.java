package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Onlinelog;
import com.broadvideo.pixsignage.persistence.OnlinelogMapper;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("onlinelogAction")
public class OnlinelogAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Onlinelog onlinelog;

	@Autowired
	private OnlinelogMapper onlinelogMapper;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String deviceid = getParameter("deviceid");

			List<Object> aaData = new ArrayList<Object>();
			int count = onlinelogMapper.selectCount("" + getLoginStaff().getOrgid(), deviceid);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Onlinelog> onlinelogList = onlinelogMapper.selectList("" + getLoginStaff().getOrgid(), deviceid, start,
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

	public String doDeviceStatList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);

			List<Object> aaData = new ArrayList<Object>();
			int count = onlinelogMapper.selectDeviceStatCount("" + getLoginStaff().getOrgid(), null, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<HashMap<String, Object>> list = onlinelogMapper.selectDeviceStatList("" + getLoginStaff().getOrgid(),
					null, search, start, length);
			for (int i = 0; i < list.size(); i++) {
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("OnlinelogAction doDeviceStatList exception, ", ex);
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
