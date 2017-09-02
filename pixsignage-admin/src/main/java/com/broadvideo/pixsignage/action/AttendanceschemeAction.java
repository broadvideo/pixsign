package com.broadvideo.pixsignage.action;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.domain.Attendancescheme;
import com.broadvideo.pixsignage.service.AttendanceService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("attendanceschemeAction")
public class AttendanceschemeAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());
	private Attendancescheme attendancescheme;
	@Autowired
	private AttendanceService attendanceService;


	public String doList() {
		try {

			PageInfo pageInfo = super.initPageInfo();
			Integer orgid = getLoginStaff().getOrgid();
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			PageResult pageResult = this.attendanceService.getAttendanceschemes(search, pageInfo, orgid);
			this.setiTotalRecords(pageResult.getTotalCount());
			this.setiTotalDisplayRecords(pageResult.getTotalCount());
			this.setAaData(pageResult.getResult());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AttendanceschemeAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}



	public String doAdd() {
		if (StringUtils.isBlank(attendancescheme.getName()) || StringUtils.isBlank(attendancescheme.getType())
				|| StringUtils.isBlank(attendancescheme.getTimeconfig())) {
			logger.error("attendancescheme  is invalid");
			renderError(RetCodeEnum.INVALID_ARGS, "Invalid args");
			return ERROR;
		}

		attendancescheme.setCreatestaffid(getLoginStaff().getStaffid());
		attendancescheme.setOrgid(getStaffOrgid());
		try {
			Integer id = this.attendanceService.addAttendancescheme(attendancescheme);
		} catch (Exception ex) {
			logger.error("attendanceschemeAction doAdd exception.", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
		return SUCCESS;
	}

	public String doUpdate() {
		if (StringUtils.isBlank(attendancescheme.getName()) || attendancescheme.getAttendanceschemeid() == null
				|| StringUtils.isBlank(attendancescheme.getTimeconfig())) {
			logger.error("attendancescheme  is invalid");
			renderError(RetCodeEnum.INVALID_ARGS, "Invalid args");
			return ERROR;
		}
		attendancescheme.setOrgid(getStaffOrgid());
		this.attendanceService.updateAttendancescheme(attendancescheme);
		return SUCCESS;
	}

	public String doDelete() {
		if (attendancescheme.getAttendanceschemeid() == null) {
			logger.error("attendanceschemeid is null");
			renderError(RetCodeEnum.INVALID_ARGS, "delete fail:attendanceschemeid is null");
			return ERROR;
		}
		try {
			this.attendanceService.deleteAttendancescheme(attendancescheme.getAttendanceschemeid(), getStaffOrgid());

		} catch (Exception ex) {
			logger.error("attendanceschemeAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;

		}
		return SUCCESS;

	}

	public String doUpdateEnableflag() {
		if (StringUtils.isBlank(attendancescheme.getEnableflag()) || attendancescheme.getAttendanceschemeid() == null) {
			logger.error("update enable flag:invalid args.");
			renderError(RetCodeEnum.INVALID_ARGS, "update enable flag:invalid args.");
			return ERROR;
		}
		this.attendanceService.updateEnableflag(attendancescheme.getAttendanceschemeid(),
				attendancescheme.getEnableflag(), getStaffOrgid());

		return SUCCESS;
	}

	public Attendancescheme getAttendancescheme() {
		return attendancescheme;
	}

	public void setAttendancescheme(Attendancescheme attendancescheme) {
		this.attendancescheme = attendancescheme;
	}




	
	



}
