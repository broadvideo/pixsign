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
import com.broadvideo.pixsignage.domain.Meetingroom;
import com.broadvideo.pixsignage.service.MeetingroomService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("meetingroomAction")
public class MeetingroomAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());
	private Meetingroom meetingroom;
	private String[] equipmentids;
	@Autowired
	private MeetingroomService meetingroomService;

	public String doList() {
		try {
			PageInfo pageInfo = super.initPageInfo();
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			Integer locationid=null;
			if (StringUtils.isNotBlank(getParameter("locationid"))) {
				locationid=NumberUtils.toInt(getParameter("locationid"));
			}
			PageResult pageResult = this.meetingroomService.getMeetingroomList(search, locationid,
					pageInfo,
					getStaffOrgid());
			this.setiTotalRecords(pageResult.getTotalCount());
			this.setiTotalDisplayRecords(pageResult.getTotalCount());
			this.setAaData(pageResult.getResult());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("meetingroomAction doList exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			meetingroom.setCreatestaffid(getStaffid());
			meetingroom.setCreatetime(new Date());
			meetingroom.setOrgid(getStaffOrgid());
			meetingroomService.addMeetingroom(meetingroom);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doAdd exception", ex);
			renderError(ex, null);
			return ERROR;
		}
	}

	public String addEquipments() {

		if (meetingroom == null || meetingroom.getMeetingroomid() == null || equipmentids == null) {
			logger.error("addEquipments:Invalid args.");
			renderError(-1, "缺少参数.");
			return ERROR;
		}
		try {
		meetingroom.setOrgid(getStaffOrgid());
		meetingroom.setUpdatestaffid(getStaffid());
			this.meetingroomService.addEquipments(meetingroom, equipmentids);
		} catch (Exception ex) {
			logger.error("addEquipments exception", ex);
			renderError(ex, null);
			return ERROR;

		}

		return SUCCESS;
	}

	public String deleteEquipments() {
		if (meetingroom == null || meetingroom.getMeetingroomid() == null || equipmentids == null) {
			logger.error("deleteEquipments:Invalid args.");
			renderError(-1, "缺少参数.");
			return ERROR;
		}
		try {
			meetingroom.setUpdatestaffid(getStaffid());
			meetingroom.setOrgid(getStaffOrgid());
			this.meetingroomService.deleteEquipments(meetingroom, equipmentids);
		} catch (Exception ex) {
			logger.error("deleteEquipments exception", ex);
			renderError(ex, null);
			return ERROR;

		}
		return SUCCESS;
	}

	public String doUpdate() {
		try {

			meetingroom.setUpdatetime(new Date());
			meetingroom.setUpdatestaffid(getStaffid());
			meetingroom.setOrgid(getStaffOrgid());
			meetingroomService.updateMeetingroom(meetingroom);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doUpdate exception", ex);
			renderError(ex, null);
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			meetingroom.setUpdatestaffid(getStaffid());
			meetingroom.setOrgid(getStaffOrgid());
			meetingroomService.deleteMeetingroom(meetingroom);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doDelete exception", ex);
			renderError(ex, null);
			return ERROR;
		}
	}

	public String doValidate() {
		try {
			if (meetingroom.getName() != null) {
				meetingroom.setOrgid(getStaffOrgid());
				if (meetingroomService.validateNameCode(meetingroom)) {
					return SUCCESS;
				} else {
					setErrorcode(-1);
					setErrormsg("名称已存在");
					return ERROR;
				}
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doValidate exception", ex);
			renderError(ex, null);
			return ERROR;
		}
	}

	public String listUnbindTerminals() {

		try {
			List devices = this.meetingroomService.listUnbindTerminals(getStaffOrgid());
			this.setAaData(devices);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("meetingroomAction listUnbindTerminals exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}

	public Meetingroom getMeetingroom() {
		return meetingroom;
	}

	public void setMeetingroom(Meetingroom meetingroom) {
		this.meetingroom = meetingroom;
	}

	public String[] getEquipmentids() {
		return equipmentids;
	}

	public void setEquipmentids(String[] equipmentids) {
		this.equipmentids = equipmentids;
	}



}
