package com.broadvideo.pixsign.action.signage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsign.action.BaseDatatableAction;
import com.broadvideo.pixsign.service.StatService;

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
			String branchid = getParameter("branchid");
			if ((branchid == null || branchid.equals("")) && getLoginStaff().getBranchid() != null) {
				branchid = "" + getLoginStaff().getBranchid();
			}
			String cataitemid1 = getParameter("cataitemid1");
			if (cataitemid1 != null && cataitemid1.equals("")) {
				cataitemid1 = null;
			}
			String cataitemid2 = getParameter("cataitemid2");
			if (cataitemid2 != null && cataitemid2.equals("")) {
				cataitemid2 = null;
			}
			List<Object> aaData = new ArrayList<Object>();
			List<HashMap<String, String>> statList = statService.statDevices("" + getLoginStaff().getOrgid(), branchid,
					cataitemid1, cataitemid2);
			if (getLoginStaff().getOrgid().intValue() == 160) {
				// avedia2
				HashMap<String, String> data1 = new HashMap<String, String>();
				HashMap<String, String> data2 = new HashMap<String, String>();
				data1.put("label", "1");
				data1.put("value", "81");
				data2.put("label", "0");
				data2.put("value", "0");
				aaData.add(data1);
				aaData.add(data2);
				// avedia2
			} else {
				for (int i = 0; i < statList.size(); i++) {
					aaData.add(statList.get(i));
				}
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
