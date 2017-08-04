package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.service.StatService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("statAction")
public class StatAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private String stattype;

	@Autowired
	private StatService statService;

	public String statDevices() {
		try {
			String branchid = null;
			if (getLoginStaff().getBranch().getParentid().intValue() > 0) {
				branchid = "" + getLoginStaff().getBranchid();
			}

			List<Object> aaData = new ArrayList<Object>();
			List<HashMap<String, String>> statList = statService.statDevices("" + getLoginStaff().getOrgid(), branchid);
			for (int i = 0; i < statList.size(); i++) {
				aaData.add(statList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("statDevices exception ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doStat() {
		try {
			String orgid = "" + getLoginStaff().getOrgid();

			List<Object> aaData = new ArrayList<Object>();
			List<HashMap<String, String>> statList = new ArrayList<HashMap<String, String>>();
			if (stattype.equals("0")) {
				statList = statService.statFilesizeSum(orgid);
			} else if (stattype.equals("1")) {
				statList = statService.statVideoCount(orgid);
			} else if (stattype.equals("2")) {
				statList = statService.statImageCount(orgid);
			}
			for (int i = 0; i < statList.size(); i++) {
				aaData.add(statList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doStat exception ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String getStattype() {
		return stattype;
	}

	public void setStattype(String stattype) {
		this.stattype = stattype;
	}

}
