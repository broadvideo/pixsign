package com.broadvideo.pixsignage.action.signage;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.domain.Mediagrid;
import com.broadvideo.pixsignage.domain.Mediagriddtl;
import com.broadvideo.pixsignage.service.MediagridService;
import com.broadvideo.pixsignage.service.PlanService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("mediagridAction")
public class MediagridAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Mediagrid mediagrid;

	@Autowired
	private MediagridService mediagridService;
	@Autowired
	private PlanService planService;

	public String doGet() {
		try {
			String mediagridid = getParameter("mediagridid");
			mediagrid = mediagridService.selectByPrimaryKey(mediagridid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("MediagridAction doGet exception, ", ex);
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
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}
			String status = getParameter("status");
			String gridlayoutcode = getParameter("gridlayoutcode");

			int count = mediagridService.selectCount("" + getLoginStaff().getOrgid(), branchid, status, gridlayoutcode,
					search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Mediagrid> mediagridList = mediagridService.selectList("" + getLoginStaff().getOrgid(), branchid,
					status, gridlayoutcode, search, start, length);
			for (int i = 0; i < mediagridList.size(); i++) {
				aaData.add(mediagridList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("MediagridAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			mediagrid.setOrgid(getLoginStaff().getOrgid());
			mediagridService.addMediagrid(mediagrid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("MediagridAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			mediagridService.updateMediagrid(mediagrid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("MediagridAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			mediagridService.deleteMediagrid("" + mediagrid.getMediagridid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("MediagridAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doSync() {
		try {
			String mediagridid = getParameter("mediagridid");
			planService.syncPlanByMediagrid(mediagridid);
			logger.info("Mediagrid sync success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("MediagridAction doSync exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDtlList() {
		try {
			String mediagridid = getParameter("mediagridid");
			List<Object> aaData = new ArrayList<Object>();
			List<Mediagriddtl> mediagriddtlList = mediagridService.selectMediagriddtlList(mediagridid);
			for (int i = 0; i < mediagriddtlList.size(); i++) {
				aaData.add(mediagriddtlList.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("MediagridAction doDtlList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDesign() {
		try {
			mediagridService.design(mediagrid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("MediagridAction doDesign exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Mediagrid getMediagrid() {
		return mediagrid;
	}

	public void setMediagrid(Mediagrid mediagrid) {
		this.mediagrid = mediagrid;
	}
}
