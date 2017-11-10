package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.service.PageService;
import com.broadvideo.pixsignage.service.PlanService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("pageAction")
public class PageAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Page page;
	private Device[] devices;
	private Devicegroup[] devicegroups;

	@Autowired
	private PageService pageService;
	@Autowired
	private PlanService planService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}
			String touchflag = getParameter("touchflag");
			String homeflag = getParameter("homeflag");

			int count = pageService.selectCount("" + getLoginStaff().getOrgid(), branchid, touchflag, homeflag, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Page> pageList = pageService.selectList("" + getLoginStaff().getOrgid(), branchid, touchflag, homeflag,
					search, start, length);
			for (int i = 0; i < pageList.size(); i++) {
				aaData.add(pageList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doGet() {
		try {
			String pageid = getParameter("pageid");
			page = pageService.selectByPrimaryKey(pageid);
			if (page == null) {
				setErrorcode(-1);
				setErrormsg("Not found");
				return ERROR;
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doGet exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			page.setOrgid(getLoginStaff().getOrgid());
			page.setCreatestaffid(getLoginStaff().getStaffid());
			String frompageid = getParameter("frompageid");
			if (frompageid != null) {
				pageService.copyPage(frompageid, page);
			} else {
				pageService.addPage(page);
			}
			if (page.getHomeflag().equals("1")) {
				pageService.makeHtmlZip("" + page.getPageid());
			} else {
				pageService.makeHtmlZip("" + page.getHomepageid());
			}

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			pageService.updatePage(page);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			pageService.deletePage("" + page.getPageid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doSync() {
		try {
			String pageid = getParameter("pageid");
			planService.syncPlanByPage(pageid);
			logger.info("Page sync success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doSync exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDesign() {
		try {
			page.setOrgid(getLoginStaff().getOrgid());
			page.setCreatestaffid(getLoginStaff().getStaffid());
			pageService.design(page);
			if (page.getHomeflag().equals("1")) {
				pageService.makeHtmlZip("" + page.getPageid());
			} else {
				pageService.makeHtmlZip("" + page.getHomepageid());
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doDesign exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Page getPage() {
		return page;
	}

	public void setPage(Page page) {
		this.page = page;
	}

	public Device[] getDevices() {
		return devices;
	}

	public void setDevices(Device[] devices) {
		this.devices = devices;
	}

	public Devicegroup[] getDevicegroups() {
		return devicegroups;
	}

	public void setDevicegroups(Devicegroup[] devicegroups) {
		this.devicegroups = devicegroups;
	}

}
