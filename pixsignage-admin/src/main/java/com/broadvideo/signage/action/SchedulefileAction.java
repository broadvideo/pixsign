package com.broadvideo.signage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.domain.Schedulefile;
import com.broadvideo.signage.service.SchedulefileService;

@Scope("request")
@Controller("schedulefileAction")
public class SchedulefileAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6345737028791229029L;

	private static final Logger log = Logger.getLogger(SchedulefileAction.class);

	private Schedulefile schedulefile;
	private String[] ids;

	@Autowired
	private SchedulefileService schedulefileService;
	
	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String scheduleid = getParameter("scheduleid");
			
			int count = schedulefileService.selectCountBySchedule(scheduleid);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Schedulefile> schedulefileList = schedulefileService.selectBySchedule(scheduleid, start, length);
			for (int i = 0; i < schedulefileList.size(); i++) {
				aaData.add(schedulefileList.get(i));
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

	public Schedulefile getSchedulefile() {
		return schedulefile;
	}

	public void setSchedulefile(Schedulefile schedulefile) {
		this.schedulefile = schedulefile;
	}

	public String[] getIds() {
		return ids;
	}

	public void setIds(String[] ids) {
		this.ids = ids;
	}

}
