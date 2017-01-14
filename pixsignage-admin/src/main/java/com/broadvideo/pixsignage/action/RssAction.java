package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Rss;
import com.broadvideo.pixsignage.service.RssService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("rssAction")
public class RssAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Rss rss;

	@Autowired
	private RssService rssService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}

			List<Object> aaData = new ArrayList<Object>();
			int count = rssService.selectCount("" + getLoginStaff().getOrgid(), branchid);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Rss> rssList = rssService.selectList("" + getLoginStaff().getOrgid(), branchid, start, length);
			for (int i = 0; i < rssList.size(); i++) {
				aaData.add(rssList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("RssAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			rss.setOrgid(getLoginStaff().getOrgid());
			rss.setBranchid(getLoginStaff().getBranchid());
			rss.setCreatestaffid(getLoginStaff().getStaffid());
			rssService.addRss(rss);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("RssAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			rssService.updateRss(rss);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("RssAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			rssService.deleteRss("" + rss.getRssid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("RssAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Rss getRss() {
		return rss;
	}

	public void setRss(Rss rss) {
		this.rss = rss;
	}

}
