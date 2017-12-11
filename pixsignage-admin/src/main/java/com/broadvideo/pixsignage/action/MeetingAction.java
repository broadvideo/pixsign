package com.broadvideo.pixsignage.action;

import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.domain.Meeting;
import com.broadvideo.pixsignage.service.MeetingService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("meetingAction")
public class MeetingAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());
	private Meeting meeting;
	@Autowired
	private MeetingService meetingService;

	public String doList() {
		try {
			PageInfo pageInfo = super.initPageInfo();
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			Integer locationid=null;
			if (StringUtils.isNotBlank(getParameter("locationid"))) {
				locationid=NumberUtils.toInt(getParameter("locationid"));
			}
			PageResult pageResult = this.meetingService.getMeetingList(search, locationid, pageInfo, getStaffOrgid());
			this.setiTotalRecords(pageResult.getTotalCount());
			this.setiTotalDisplayRecords(pageResult.getTotalCount());
			this.setAaData(pageResult.getResult());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("meetingAction doList exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}




	public String doListAttendees() {

		try {
			List attendees = this.meetingService.getMeetingAttendees(meeting.getMeetingid(), getStaffid());
			this.setAaData(attendees);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("meetingAction doList exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}


	public String doUpdate() {
		try {

			meeting.setUpdatetime(new Date());
			meeting.setUpdatestaffid(getStaffid());
			meeting.setOrgid(getStaffOrgid());
			meetingService.updateMeeting(meeting);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doUpdate exception", ex);
			renderError(ex, null);
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			meeting.setUpdatestaffid(getStaffid());
			meeting.setOrgid(getStaffOrgid());
			meetingService.deleteMeeting(meeting);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doDelete exception", ex);
			renderError(ex, null);
			return ERROR;
		}
	}


	public Meeting getMeeting() {
		return meeting;
	}

	public void setMeeting(Meeting meeting) {
		this.meeting = meeting;
	}

}
