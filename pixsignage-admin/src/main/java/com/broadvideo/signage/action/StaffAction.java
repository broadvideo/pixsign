package com.broadvideo.signage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.common.CommonConstants;
import com.broadvideo.signage.common.SessionConstants;
import com.broadvideo.signage.domain.Staff;
import com.broadvideo.signage.service.StaffService;

@Scope("request")
@Controller("staffAction")
public class StaffAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1831856884812531473L;

	private static final Logger log = Logger.getLogger(StaffAction.class);

	private Staff staff;
	private String[] ids;
	private String loginname;

	@Autowired
	private StaffService staffService;
	
	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = null;
			if (getParameter("sSearch") != null) {
				search = new String(getParameter("sSearch").trim().getBytes("ISO-8859-1"),"utf-8");
			}

			String subsystem = (String)getSession().getAttribute(SessionConstants.SESSION_SUBSYSTEM);
			String vspid = null;
			String orgid = null;
			if (subsystem.equals(CommonConstants.SUBSYSTEM_VSP)) {
				vspid = "" + getLoginStaff().getVspid();
			} else {
				orgid = "" + getLoginStaff().getOrgid();
			}

			int count = staffService.selectCount(subsystem, vspid, orgid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Staff> staffList = staffService.selectList(subsystem, vspid, orgid, search, start, length);
			for (int i = 0; i < staffList.size(); i++) {
				aaData.add(staffList.get(i));
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
			staff.setCreatestaffid(getLoginStaff().getStaffid());
			staff.setSubsystem((String)getSession().getAttribute(SessionConstants.SESSION_SUBSYSTEM));
			staff.setVspid(getLoginStaff().getVspid());
			staff.setOrgid(getLoginStaff().getOrgid());
			staffService.addStaff(staff);
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
			staffService.updateStaff(staff);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doResetPassword() {
		try {
			staffService.resetPassword(staff);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdatePassword() {
		try {
			if (staffService.updatePassword(staff)) {
				return SUCCESS;
			} else {
				setErrorcode(-1);
				return ERROR;
			}
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
				staffService.deleteStaff(ids);
			}
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doValidate() {
		try {
			if (staff.getLoginname() != null) {
				String subsystem = (String)getSession().getAttribute(SessionConstants.SESSION_SUBSYSTEM);
				String vspid = null;
				String orgid = null;
				if (subsystem.equals(CommonConstants.SUBSYSTEM_VSP)) {
					vspid = "" + getLoginStaff().getVspid();
				} else {
					orgid = "" + getLoginStaff().getOrgid();
				}
				if (staffService.validateLoginname(staff, subsystem, vspid, orgid)) {
					return SUCCESS;
				} else {
					setErrorcode(-1);
					setErrormsg("登录名已存在");
					return ERROR;
				}
			}
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Staff getStaff() {
		return staff;
	}

	public void setStaff(Staff staff) {
		this.staff = staff;
	}

	public String[] getIds() {
		return ids;
	}

	public void setIds(String[] ids) {
		this.ids = ids;
	}

	public String getLoginname() {
		return loginname;
	}

	public void setLoginname(String loginname) {
		this.loginname = loginname;
	}

}
