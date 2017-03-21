package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Oplog;
import com.broadvideo.pixsignage.service.OplogService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("oplogAction")
public class OplogAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Oplog oplog;

	@Autowired
	private OplogService oplogService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);

			List<Object> aaData = new ArrayList<Object>();
			int count = oplogService.selectCount("" + getLoginStaff().getOrgid(), null, null, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Oplog> oplogList = oplogService.selectList("" + getLoginStaff().getOrgid(), null, null, search, start,
					length);
			for (int i = 0; i < oplogList.size(); i++) {
				aaData.add(oplogList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("OplogAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Oplog getOplog() {
		return oplog;
	}

	public void setOplog(Oplog oplog) {
		this.oplog = oplog;
	}

}
