package com.broadvideo.signage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.domain.Schedule;
import com.broadvideo.signage.service.ScheduleService;

@Scope("request")
@Controller("scheduleAction")
public class ScheduleAction extends BaseDatatableAction {
	/**
	 * 
	 */
	private static final long serialVersionUID = 5193894383596351395L;

	private static final Logger log = Logger.getLogger(ScheduleAction.class);

	private Schedule schedule;
	
	private List<Schedule> schedules;
	private int deviceid;
	private String[] ids;

	@Autowired
	private ScheduleService scheduleService;
	
	public String doListByDevice() {
		try {
			String deviceid = getParameter("deviceid");
			List<Object> aaData = new ArrayList<Object>();
			List<Schedule> scheduleList = scheduleService.selectByDevice(deviceid);
			for (int i = 0; i < scheduleList.size(); i++) {
				aaData.add(scheduleList.get(i));
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

	public String doListByTask() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String taskid = getParameter("taskid");

			int count = scheduleService.selectCountByTask(taskid);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Schedule> scheduleList = scheduleService.selectByTask(taskid, start, length);
			for (int i = 0; i < scheduleList.size(); i++) {
				aaData.add(scheduleList.get(i));
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
			schedule.setCreatestaffid(getLoginStaff().getStaffid());
			scheduleService.addSchedule(schedule);
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
			scheduleService.updateSchedule(schedule);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doBatchAdd() {
		try {
			for (int i=0; i<schedules.size(); i++) {
				schedules.get(i).setCreatestaffid(getLoginStaff().getStaffid());
			}
			scheduleService.batchAdd(schedules);
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
			if (ids != null) {
				scheduleService.deleteSchedule(ids);
			}
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Schedule getSchedule() {
		return schedule;
	}

	public void setSchedule(Schedule schedule) {
		this.schedule = schedule;
	}

	public List<Schedule> getSchedules() {
		return schedules;
	}

	public void setSchedules(List<Schedule> schedules) {
		this.schedules = schedules;
	}

	public int getDeviceid() {
		return deviceid;
	}

	public void setDeviceid(int deviceid) {
		this.deviceid = deviceid;
	}

	public String[] getIds() {
		return ids;
	}

	public void setIds(String[] ids) {
		this.ids = ids;
	}
	
}
