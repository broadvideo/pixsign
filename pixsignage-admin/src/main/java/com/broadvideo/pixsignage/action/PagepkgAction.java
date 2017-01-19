package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Pagepkg;
import com.broadvideo.pixsignage.service.PagepkgService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("pagepkgAction")
public class PagepkgAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Pagepkg pagepkg;

	@Autowired
	private PagepkgService pagepkgService;

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

			int count = pagepkgService.selectCount(getLoginStaff().getOrgid(), branchid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Pagepkg> pagepkgList = pagepkgService.selectList(getLoginStaff().getOrgid(), branchid, search, start,
					length);
			for (int i = 0; i < pagepkgList.size(); i++) {
				aaData.add(pagepkgList.get(i));
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
			pagepkg.setOrgid(getLoginStaff().getOrgid());
			pagepkg.setBranchid(getLoginStaff().getBranchid());
			pagepkg.setCreatestaffid(getLoginStaff().getStaffid());
			pagepkgService.addPagepkg(pagepkg);
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
			pagepkgService.updatePagepkg(pagepkg);
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
			pagepkgService.deletePagepkg("" + pagepkg.getPagepkgid());
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Pagepkg getPagepkg() {
		return pagepkg;
	}

	public void setPagepkg(Pagepkg pagepkg) {
		this.pagepkg = pagepkg;
	}
}
