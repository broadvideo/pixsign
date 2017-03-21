package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Dvb;
import com.broadvideo.pixsignage.service.DvbService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("dvbAction")
public class DvbAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Dvb dvb;

	@Autowired
	private DvbService dvbService;

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

			List<Object> aaData = new ArrayList<Object>();
			int count = dvbService.selectCount("" + getLoginStaff().getOrgid(), branchid, "1", search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Dvb> dvbList = dvbService.selectList("" + getLoginStaff().getOrgid(), branchid, "1", search, start,
					length);
			for (int i = 0; i < dvbList.size(); i++) {
				aaData.add(dvbList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DvbAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			dvb.setOrgid(getLoginStaff().getOrgid());
			dvb.setBranchid(getLoginStaff().getBranchid());
			dvb.setCreatestaffid(getLoginStaff().getStaffid());
			dvbService.addDvb(dvb);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DvbAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			dvbService.updateDvb(dvb);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DvbAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			dvbService.deleteDvb("" + dvb.getDvbid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DvbAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Dvb getDvb() {
		return dvb;
	}

	public void setDvb(Dvb dvb) {
		this.dvb = dvb;
	}

}
