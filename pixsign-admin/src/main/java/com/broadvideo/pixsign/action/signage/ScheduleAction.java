package com.broadvideo.pixsign.action.signage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsign.action.BaseDatatableAction;
import com.broadvideo.pixsign.domain.Schedule;
import com.broadvideo.pixsign.service.ScheduleService;
import com.broadvideo.pixsign.service.SyncService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("scheduleAction")
public class ScheduleAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private String scheduletype;
	private String attachflag;
	private String bindtype;
	private String bindid;
	private Schedule[] schedules;

	@Autowired
	private ScheduleService scheduleService;
	@Autowired
	private SyncService syncService;

	public String doBatch() {
		try {
			scheduleService.batch(scheduletype, attachflag, bindtype, bindid, schedules);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("ScheduleAction doBatchAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String getScheduletype() {
		return scheduletype;
	}

	public void setScheduletype(String scheduletype) {
		this.scheduletype = scheduletype;
	}

	public String getAttachflag() {
		return attachflag;
	}

	public void setAttachflag(String attachflag) {
		this.attachflag = attachflag;
	}

	public String getBindtype() {
		return bindtype;
	}

	public void setBindtype(String bindtype) {
		this.bindtype = bindtype;
	}

	public String getBindid() {
		return bindid;
	}

	public void setBindid(String bindid) {
		this.bindid = bindid;
	}

	public Schedule[] getSchedules() {
		return schedules;
	}

	public void setSchedules(Schedule[] schedules) {
		this.schedules = schedules;
	}

}
