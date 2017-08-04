package com.broadvideo.pixsignage.action;

import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.domain.Examinationroom;
import com.broadvideo.pixsignage.service.ExaminationroomService;
import com.broadvideo.pixsignage.util.DateUtil;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("examinationroomAction")
public class ExaminationroomAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Examinationroom examinationroom;
	@Autowired
	private ExaminationroomService examinationroomService;



	public String doList() {
		try {
			PageInfo pageInfo=super.initPageInfo();
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			PageResult pageResult = examinationroomService.getExaminationroomList(search, pageInfo, getLoginStaff()
					.getOrgid());
			this.setiTotalRecords(pageResult.getTotalCount());
			this.setiTotalDisplayRecords(pageResult.getTotalCount());
			this.setAaData(pageResult.getResult());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("ExaminationroomAction doList exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {

		try {
			if (examinationroom == null || StringUtils.isBlank(examinationroom.getName())
					|| StringUtils.isBlank(examinationroom.getCoursename())
					|| examinationroom.getStrstarttime() == null || examinationroom.getStrendtime() == null
					|| examinationroom.getClassroomid() == null) {
				renderError(RetCodeEnum.INVALID_ARGS, "Invalid args");
				return ERROR;
			}
			Date starttime = DateUtil.getDate(examinationroom.getStrstarttime(), "yyyy-MM-dd HH:mm");
			examinationroom.setStarttime(starttime);
			Date endtime = DateUtil.getDate(examinationroom.getStrendtime(), "yyyy-MM-dd HH:mm");
			if (starttime.getTime() >= endtime.getTime()) {
				renderError(RetCodeEnum.INVALID_ARGS, "Invalid args");
				return ERROR;
			}
			examinationroom.setEndtime(endtime);
			examinationroom.setOrgid(getLoginStaff().getOrgid());
			examinationroom.setCreatestaffid(getLoginStaff().getStaffid());
			this.examinationroomService.addExaminationroom(examinationroom);
			return SUCCESS;
		} catch (Exception ex) {

			logger.error("ExaminationroomAction doAdd exception, ", ex);
			renderError(ex, ex.getMessage());
			return ERROR;
		}

	}

	public String doUpdate() {
		try {
			if (examinationroom == null || StringUtils.isBlank(examinationroom.getName())
					|| StringUtils.isBlank(examinationroom.getCoursename())
					|| examinationroom.getStrstarttime() == null || examinationroom.getStrendtime() == null
					|| examinationroom.getClassroomid() == null) {
				renderError(RetCodeEnum.INVALID_ARGS, "Invalid args");
				return ERROR;
			}
			Date starttime = DateUtil.getDate(examinationroom.getStrstarttime(), "yyyy-MM-dd HH:mm");
			examinationroom.setStarttime(starttime);
			Date endtime = DateUtil.getDate(examinationroom.getStrendtime(), "yyyy-MM-dd HH:mm");
			examinationroom.setEndtime(endtime);
			if (starttime.getTime() >= endtime.getTime()) {
				renderError(RetCodeEnum.INVALID_ARGS, "Invalid args");
				return ERROR;

			}
			examinationroomService.updateExaminationroom(examinationroom);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("ExaminationroomAction doUpdate exception, ", ex);
			renderError(ex, ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			if (examinationroom == null || examinationroom.getExaminationroomid() == null) {
				renderError(RetCodeEnum.INVALID_ARGS, "Invalid args");
				return ERROR;
			}
			examinationroomService.deleteExaminationroom(examinationroom.getExaminationroomid(), getLoginStaff()
					.getOrgid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("ExaminationroomAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Examinationroom getExaminationroom() {
		return examinationroom;
	}

	public void setExaminationroom(Examinationroom examinationroom) {
		this.examinationroom = examinationroom;
	}



	
	



}
