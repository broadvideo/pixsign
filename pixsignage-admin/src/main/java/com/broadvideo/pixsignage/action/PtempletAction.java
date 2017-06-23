package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Ptemplet;
import com.broadvideo.pixsignage.service.PtempletService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("ptempletAction")
public class PtempletAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Ptemplet ptemplet;

	@Autowired
	private PtempletService ptempletService;

	public String doGet() {
		try {
			String ptempletid = getParameter("ptempletid");
			ptemplet = ptempletService.selectByPrimaryKey(ptempletid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PtempletAction doGet exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			String ratio = getParameter("ratio");
			String ptempletflag = getParameter("ptempletflag");
			String publicflag = null;

			String orgid = "" + getLoginStaff().getOrgid();
			if (ptempletflag != null && ptempletflag.equals("2")) {
				orgid = "1";
				publicflag = "1";
			}

			int count = ptempletService.selectCount(orgid, ratio, publicflag, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Ptemplet> ptempletList = ptempletService.selectList(orgid, ratio, publicflag, search, start, length);
			for (int i = 0; i < ptempletList.size(); i++) {
				aaData.add(ptempletList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PtempletAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			ptemplet.setOrgid(getLoginStaff().getOrgid());
			ptemplet.setCreatestaffid(getLoginStaff().getStaffid());
			ptemplet.setUuid(UUID.randomUUID().toString().replace("-", ""));

			String fromptempletid = getParameter("fromptempletid");
			if (fromptempletid != null) {
				ptempletService.copyPtemplet(fromptempletid, ptemplet);
			} else {
				ptempletService.addPtemplet(ptemplet);
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PtempletAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			ptempletService.updatePtemplet(ptemplet);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PtempletAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			ptempletService.deletePtemplet("" + ptemplet.getPtempletid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PtempletAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDesign() {
		try {
			ptemplet.setOrgid(getLoginStaff().getOrgid());
			ptemplet.setCreatestaffid(getLoginStaff().getStaffid());
			ptempletService.design(ptemplet);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PtempletAction doDesign exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Ptemplet getPtemplet() {
		return ptemplet;
	}

	public void setPtemplet(Ptemplet ptemplet) {
		this.ptemplet = ptemplet;
	}

}
