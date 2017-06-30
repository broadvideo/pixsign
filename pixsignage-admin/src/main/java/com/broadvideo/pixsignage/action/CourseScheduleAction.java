package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.JsonMapper;
import com.broadvideo.pixsignage.common.ResponseUtil;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.common.Struts2Utils;
import com.broadvideo.pixsignage.domain.CourseSchedule;
import com.broadvideo.pixsignage.service.CourseScheduleService;

@Scope("request")
@Controller("courseScheduleAction")
public class CourseScheduleAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -22475458159844710L;
	private final Logger logger = LoggerFactory.getLogger(getClass());
	private CourseSchedule schedule;
	private JsonMapper jsonMapper = JsonMapper.nonNullMapper();
	@Autowired
	private CourseScheduleService scheduleService;

	public String addCourseSchedule() throws Exception {

		if (StringUtils.isBlank(schedule.getCoursename()) || StringUtils.isBlank(schedule.getTeachername())
				|| schedule.getPeriodtimedtlid() == null || schedule.getClassroomid() == null
				|| schedule.getCoursescheduleschemeid() == null) {

			logger.error("添加课表失败:Invalid args.");
			ResponseUtil.codeResponse(RetCodeEnum.INVALID_ARGS, "Invalid args.");
			return NONE;
		}
		schedule.setOrgid(getStaffOrgid());
		schedule.setCreatepsnid(getStaffid());
		try {
			Integer id = this.scheduleService.addCourseSchedule(schedule);
			ResponseUtil.idRetResonse(id, "");
			return NONE;
		} catch (Exception ex) {
			logger.error("添加课表异常：", ex);
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());

		}

		return NONE;
	}

	public String updateCourseSchedule() throws Exception {

		if (StringUtils.isBlank(schedule.getCoursename()) || StringUtils.isBlank(schedule.getTeachername())
				|| schedule.getPeriodtimedtlid() == null || schedule.getClassroomid() == null
				|| schedule.getCoursescheduleschemeid() == null || schedule.getId() == null) {

			logger.error("修改课表失败:Invalid args.");
			ResponseUtil.codeResponse(RetCodeEnum.INVALID_ARGS, "Invalid args.");
			return NONE;

		}
		schedule.setOrgid(getStaffOrgid());
		schedule.setUpdatepsnid(getStaffid());
		try {
			this.scheduleService.updateCourseSchedule(schedule);
			ResponseUtil.codeResponse(RetCodeEnum.SUCCESS, "");
			return NONE;
		} catch (Exception ex) {
			logger.error("修改课表异常：", ex);
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());

		}

		return NONE;
	}

	public String getClassroomSchedules() throws Exception {
		if (schedule.getClassroomid() == null || schedule.getCoursescheduleschemeid() == null) {
			logger.error("获取教室schedule失败:Invalid args.");
			ResponseUtil.codeResponse(RetCodeEnum.INVALID_ARGS, "Invalid args.");
			return NONE;
		}
		try {
			List<CourseSchedule> schedules = this.scheduleService.getClassroomCourseSchedules(
					schedule.getClassroomid(),
					schedule.getCoursescheduleschemeid(), getStaffOrgid());
			ResponseUtil.objectRetResponse(schedules, "");
			return NONE;
		} catch (Exception ex) {

			logger.error("获取教室Schedule异常：", ex);
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());
		}


		return NONE;
	}

	public String deleteCourseSchedule() throws ServiceException {

		String commaSplitIds = Struts2Utils.getRequest().getParameter("ids");
		if (StringUtils.isBlank(commaSplitIds)) {
			logger.error("删除schedule失败:Invalid args.");
			ResponseUtil.codeResponse(RetCodeEnum.INVALID_ARGS, "Invalid args.");
			return NONE;
		}
		String[] strIds = commaSplitIds.split(",");
        List<Integer> idList=new ArrayList<Integer>();
		for (String strId : strIds) {
			idList.add(Integer.parseInt(strId));
		}
		try {

			scheduleService.deleteCourseSchedules(idList, getStaffid(), getStaffOrgid());
			ResponseUtil.codeResponse(RetCodeEnum.SUCCESS, "");
			return NONE;

		} catch (Exception ex) {
			logger.error("删除Schedule异常！", ex);
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());
		}

		return NONE;
	}

	public CourseSchedule getSchedule() {
		return schedule;
	}

	public void setSchedule(CourseSchedule schedule) {
		this.schedule = schedule;
	}



}
