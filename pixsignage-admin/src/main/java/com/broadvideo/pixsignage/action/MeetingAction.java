package com.broadvideo.pixsignage.action;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.NPOIFSFileSystem;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
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
			String exportExcelFlag = getParameter("exportexcel");
			search = SqlUtil.likeEscapeH(search);
			if (meeting == null) {
				meeting = new Meeting();
			}
			meeting.setSearch(search);
			meeting.setOrgid(getStaffOrgid());
			if (StringUtils.isNotBlank(exportExcelFlag)) {
				return doExportMeetings(pageInfo);
			} else {
				PageResult pageResult = this.meetingService.getMeetingList(meeting, pageInfo);
				this.setiTotalRecords(pageResult.getTotalCount());
				this.setiTotalDisplayRecords(pageResult.getTotalCount());
				this.setAaData(pageResult.getResult());
				return SUCCESS;
			}
		} catch (Exception ex) {
			logger.error("meetingAction doList exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}


	public String doExportMeetings(PageInfo pageInfo) {
		pageInfo.setStart(0);
		pageInfo.setLength(19999);
		PageResult pageResult = this.meetingService.getMeetingList(meeting, pageInfo);
		List<Meeting> dataList = pageResult.getResult();
		try {
			File templateXls = new File("template_meeting.xls");
			NPOIFSFileSystem fs = new NPOIFSFileSystem(templateXls);
			HSSFWorkbook wb = new HSSFWorkbook(fs.getRoot(), true);
			ByteArrayOutputStream targetFile = new ByteArrayOutputStream();

		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return NONE;
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

	public static void main(String[] args) throws Exception {

		InputStream inp = new FileInputStream("workbook.xls");
		Workbook wb = WorkbookFactory.create(inp);

	}

}
