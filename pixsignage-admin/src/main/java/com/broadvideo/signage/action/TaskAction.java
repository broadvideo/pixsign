package com.broadvideo.signage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.domain.Task;
import com.broadvideo.signage.service.TaskService;

@Scope("request")
@Controller("taskAction")
public class TaskAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 7855910663935831647L;

	private static final Logger log = Logger.getLogger(TaskAction.class);

	private Task task;
	private String[] ids;

	@Autowired
	private TaskService taskService;
	
	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = null;
			if (getParameter("sSearch") != null) {
				search = new String(getParameter("sSearch").trim().getBytes("ISO-8859-1"),"utf-8");
			}
			
			int count = taskService.selectCount(getLoginStaff().getOrgid(), getLoginStaff().getBranchid(), search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Task> taskList = taskService.selectList(getLoginStaff().getOrgid(), getLoginStaff().getBranchid(), search, start, length);
			for (int i = 0; i < taskList.size(); i++) {
				aaData.add(taskList.get(i));
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
			task.setOrgid(getLoginStaff().getOrgid());
			task.setBranchid(getLoginStaff().getBranchid());
			task.setCreatestaffid(getLoginStaff().getStaffid());
			taskService.addTask(task);
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
			taskService.updateTask(task);
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
				taskService.deleteTask(ids);
			}
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Task getTask() {
		return task;
	}

	public void setTask(Task task) {
		this.task = task;
	}

	public String[] getIds() {
		return ids;
	}

	public void setIds(String[] ids) {
		this.ids = ids;
	}

}
