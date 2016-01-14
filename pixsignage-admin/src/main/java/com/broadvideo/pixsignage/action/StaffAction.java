package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.service.StaffService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("staffAction")
public class StaffAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Staff staff;

	@Autowired
	private StaffService staffService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);

			String subsystem = (String) getSession().getAttribute(CommonConstants.SESSION_SUBSYSTEM);
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
			staff.setSubsystem((String) getSession().getAttribute(CommonConstants.SESSION_SUBSYSTEM));
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
			staffService.deleteStaff("" + staff.getStaffid());
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
				String subsystem = (String) getSession().getAttribute(CommonConstants.SESSION_SUBSYSTEM);
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
}
