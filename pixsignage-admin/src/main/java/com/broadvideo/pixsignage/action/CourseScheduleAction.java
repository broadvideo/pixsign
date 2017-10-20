package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Courseschedule;
import com.broadvideo.pixsignage.service.CourseScheduleService;
import com.broadvideo.pixsignage.util.JsonMapper;

@Scope("request")
@Controller("courseScheduleAction")
public class CourseScheduleAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -22475458159844710L;
	private final Logger logger = LoggerFactory.getLogger(getClass());
	private Courseschedule courseschedule;
	private JsonMapper jsonMapper = JsonMapper.nonNullMapper();
	@Autowired
	private CourseScheduleService scheduleService;

	public String addCourseSchedule() throws Exception {

		if (StringUtils.isBlank(courseschedule.getCoursename())
				|| courseschedule.getPeriodtimedtlid() == null || courseschedule.getClassroomid() == null
				|| courseschedule.getCoursescheduleschemeid() == null) {

			logger.error("添加课表失败:Invalid args.");
			renderError(-1, "Invalid args.");
			return ERROR;
		}
		courseschedule.setOrgid(getStaffOrgid());
		courseschedule.setCreatepsnid(getStaffid());
		try {
			Integer id = this.scheduleService.addCourseSchedule(courseschedule);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("添加课表异常：", ex);
			renderError(-1, ex.getMessage());
			return ERROR;

		}

	}

	public String updateCourseSchedule() throws Exception {

		if (StringUtils.isBlank(courseschedule.getCoursename())
				|| courseschedule.getPeriodtimedtlid() == null || courseschedule.getClassroomid() == null
				|| courseschedule.getCoursescheduleschemeid() == null || courseschedule.getCoursescheduleid() == null) {

			logger.error("修改课表失败:Invalid args.");
			renderError(-1, "Invalid args.");
			return ERROR;

		}
		courseschedule.setOrgid(getStaffOrgid());
		courseschedule.setUpdatepsnid(getStaffid());
		try {
			this.scheduleService.updateCourseSchedule(courseschedule);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("修改课表异常：", ex);
			renderError(-1, ex.getMessage());
			return ERROR;
		}

	}

	public String getClassroomSchedules() throws Exception {
		if (courseschedule.getClassroomid() == null || courseschedule.getCoursescheduleschemeid() == null) {
			logger.error("获取教室schedule失败:Invalid args.");
			renderError(-1, "获取教室schedule失败:Invalid args.");
			return ERROR;
		}
		try {
			List schedules = this.scheduleService.getClassroomCourseSchedules(
					courseschedule.getClassroomid(),
					courseschedule.getCoursescheduleschemeid(), getStaffOrgid());
			this.setAaData(schedules);
			return SUCCESS;

		} catch (Exception ex) {

			logger.error("获取教室Schedule异常：", ex);
			renderError(-1, ex.getMessage());
			return ERROR;
		}

	}

	public String deleteCourseSchedule() throws ServiceException {

		String commaSplitIds = getParameter("ids");
		if (StringUtils.isBlank(commaSplitIds)) {
			logger.error("删除schedule失败:Invalid args.");
			renderError(-1, "删除schedule失败:Invalid args.");
			return ERROR;
		}
		String[] strIds = commaSplitIds.split(",");
        List<Integer> idList=new ArrayList<Integer>();
		for (String strId : strIds) {
			idList.add(Integer.parseInt(strId));
		}
		try {
			scheduleService.deleteCourseSchedules(idList, getStaffid(), getStaffOrgid());
			return SUCCESS;

		} catch (Exception ex) {
			logger.error("删除Schedule异常！", ex);
			renderError(-1, ex.getMessage());
			return ERROR;
		}

	}

	public Courseschedule getCourseschedule() {
		return courseschedule;
	}

	public void setCourseschedule(Courseschedule courseschedule) {
		this.courseschedule = courseschedule;
	}




}
