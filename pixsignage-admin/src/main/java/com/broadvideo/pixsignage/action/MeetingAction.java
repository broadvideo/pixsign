package com.broadvideo.pixsignage.action;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
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
	private InputStream inputStream;
	private String downloadname;
	@Autowired
	private MeetingService meetingService;

	public String doList() {
		try {
			PageInfo pageInfo = super.initPageInfo();
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			if (meeting == null) {
				meeting = new Meeting();
			}
			meeting.setSearch(search);
			meeting.setOrgid(getStaffOrgid());
			List<String> auditstatuslist = new ArrayList<String>();
			// 查询审核通过或者不需要审核的会议列表
			auditstatuslist.add(Meeting.NONE_FOR_AUDIT);
			auditstatuslist.add(Meeting.SUCCESS_FOR_AUDIT);
			meeting.setAuditstatuslist(auditstatuslist);
			PageResult pageResult = this.meetingService.getMeetingList(meeting, pageInfo);
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

	public String doAuditList() {

		try {
			PageInfo pageInfo = super.initPageInfo();
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);

			if (meeting == null) {
				meeting = new Meeting();
			}
			meeting.setSearch(search);
			meeting.setOrgid(getStaffOrgid());
			List<String> auditstatuslist = new ArrayList<String>();
			auditstatuslist.add(Meeting.REFUSE_FOR_AUDIT);
			auditstatuslist.add(Meeting.WAITING_FOR_AUDIT);
			meeting.setAuditstatuslist(auditstatuslist);
			PageResult pageResult = this.meetingService.getAuditMeetingList(meeting, pageInfo);
			this.setiTotalRecords(pageResult.getTotalCount());
			this.setiTotalDisplayRecords(pageResult.getTotalCount());
			this.setAaData(pageResult.getResult());
			return SUCCESS;
		} catch (Exception ex) {

			logger.error("meetingAction doAuditList exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}

	public String doAuditMeeting() {
		if (meeting == null || meeting.getMeetingid() == null || StringUtils.isBlank(meeting.getAuditstatus())) {
			logger.error("Audit meeting invliad args.");
			this.renderError(RetCodeEnum.EXCEPTION, "缺少参数！");
			return ERROR;
		}
		try {
			meeting.setUpdatestaffid(getStaffid());
			meeting.setOrgid(getStaffOrgid());
			this.meetingService.auditMeeting(meeting);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doAuditMeeting exception.", ex);
			this.renderError(ex, ex.getMessage());
			return ERROR;

		}

	}

	public String doExportMeetings() {

		PageInfo pageInfo = super.initPageInfo();
		String search = getParameter("sSearch");
		search = SqlUtil.likeEscapeH(search);
		if (meeting == null) {
			meeting = new Meeting();
		}
		pageInfo.setStart(0);
		pageInfo.setLength(99999);
		meeting.setSearch(search);
		meeting.setOrgid(getStaffOrgid());
		PageResult pageResult = this.meetingService.getMeetingList(meeting, pageInfo);
		List<Meeting> dataList = pageResult.getResult();
		try {
			byte[] genBytes = this.meetingService.genExportExcel(dataList, getStaffOrgid());
			this.downloadname = "meetings.xls";
			this.inputStream = new ByteArrayInputStream(genBytes);

		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return SUCCESS;
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

	public InputStream getInputStream() {
		return inputStream;
	}

	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}

	public String getDownloadname() {
		return downloadname;
	}

	public void setDownloadname(String downloadname) {
		this.downloadname = downloadname;
	}

}
