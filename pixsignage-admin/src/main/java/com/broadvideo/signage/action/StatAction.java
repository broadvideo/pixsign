package com.broadvideo.signage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.domain.Stat;
import com.broadvideo.signage.service.StatService;

@Scope("request")
@Controller("statAction")
public class StatAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6787078292757444608L;

	private static final Logger log = Logger.getLogger(StatAction.class);

	private String stattype;

	@Autowired
	private StatService statService;
	
	public String doStat() {
		try {
			String orgid = "" + getLoginStaff().getOrgid();

			List<Object> aaData = new ArrayList<Object>();
			List<Stat> statList = new ArrayList<Stat>();
			if (stattype.equals("0")) {
				statList = statService.selectFilesizeSum(orgid);
			} else if (stattype.equals("1")) {
				statList = statService.selectMediaCount(orgid, "1");
			} else if (stattype.equals("2")) {
				statList = statService.selectMediaCount(orgid, "2");
			} else if (stattype.equals("3")) {
				statList = statService.selectMediaCount(orgid, "3");
			} else if (stattype.equals("4")) {
				statList = statService.selectMediaCount(orgid, "4");
			} 
			for (int i = 0; i < statList.size(); i++) {
				aaData.add(statList.get(i));
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

	public String getStattype() {
		return stattype;
	}

	public void setStattype(String stattype) {
		this.stattype = stattype;
	}

}
