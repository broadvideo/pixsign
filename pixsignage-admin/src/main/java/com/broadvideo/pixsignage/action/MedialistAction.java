package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Medialist;
import com.broadvideo.pixsignage.domain.Medialistdtl;
import com.broadvideo.pixsignage.service.MedialistService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("medialistAction")
public class MedialistAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Medialist medialist;
	private Medialistdtl[] medialistdtls;

	@Autowired
	private MedialistService medialistService;

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

			int count = medialistService.selectCount(getLoginStaff().getOrgid(), branchid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Medialist> medialistList = medialistService.selectList(getLoginStaff().getOrgid(), branchid, search,
					start, length);
			for (int i = 0; i < medialistList.size(); i++) {
				aaData.add(medialistList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			medialist.setOrgid(getLoginStaff().getOrgid());
			medialist.setBranchid(getLoginStaff().getBranchid());
			medialist.setCreatestaffid(getLoginStaff().getStaffid());
			medialistService.addMedialist(medialist);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			medialistService.updateMedialist(medialist);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			medialistService.deleteMedialist("" + medialist.getMedialistid());
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDtlList() {
		try {
			String medialistid = getParameter("medialistid");
			List<Object> aaData = new ArrayList<Object>();
			List<Medialistdtl> medialistdtlList = medialistService.selectMedialistdtlList(medialistid);
			for (int i = 0; i < medialistdtlList.size(); i++) {
				aaData.add(medialistdtlList.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDtlSync() {
		try {
			medialistService.syncMedialistdtlList(medialist, medialistdtls);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Medialist getMedialist() {
		return medialist;
	}

	public void setMedialist(Medialist medialist) {
		this.medialist = medialist;
	}

	public Medialistdtl[] getMedialistdtls() {
		return medialistdtls;
	}

	public void setMedialistdtls(Medialistdtl[] medialistdtls) {
		this.medialistdtls = medialistdtls;
	}
}
