package com.broadvideo.pixsignage.action.signage;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.domain.Templet;
import com.broadvideo.pixsignage.service.TempletService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("templetAction")
public class TempletAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Templet templet;

	@Autowired
	private TempletService templetService;

	public String doGet() {
		try {
			String templetid = getParameter("templetid");
			templet = templetService.selectByPrimaryKey(templetid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TempletAction doGet exception, ", ex);
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
			String templetflag = getParameter("templetflag");
			String touchflag = getParameter("touchflag");
			String homeflag = getParameter("homeflag");
			String publicflag = null;

			String orgid = "" + getLoginStaff().getOrgid();
			if (templetflag != null && templetflag.equals("2")) {
				orgid = "1";
				publicflag = "1";
			}

			int count = templetService.selectCount(orgid, ratio, touchflag, homeflag, publicflag, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Templet> templetList = templetService.selectList(orgid, ratio, touchflag, homeflag, publicflag, search,
					start, length);
			for (int i = 0; i < templetList.size(); i++) {
				aaData.add(templetList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TempletAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			templet.setOrgid(getLoginStaff().getOrgid());
			templet.setCreatestaffid(getLoginStaff().getStaffid());
			templet.setUuid(UUID.randomUUID().toString().replace("-", ""));

			String fromtempletid = getParameter("fromtempletid");
			if (fromtempletid != null) {
				templetService.copyTemplet(fromtempletid, templet);
			} else {
				templetService.addTemplet(templet);
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TempletAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			templetService.updateTemplet(templet);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TempletAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			templetService.deleteTemplet("" + templet.getTempletid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TempletAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDesign() {
		try {
			templet.setOrgid(getLoginStaff().getOrgid());
			templet.setCreatestaffid(getLoginStaff().getStaffid());
			templetService.design(templet);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TempletAction doDesign exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Templet getTemplet() {
		return templet;
	}

	public void setTemplet(Templet templet) {
		this.templet = templet;
	}

}
