package com.broadvideo.pixsignage.service;

import java.util.Date;
import java.util.List;

import com.broadvideo.pixsignage.domain.CourseSchedule;

public interface CourseScheduleService {

	Integer addCourseSchedule(CourseSchedule schedule);

	void updateCourseSchedule(CourseSchedule schedule);

	CourseSchedule getCourseSchedule(Integer id, Integer orgId);

	List<CourseSchedule> getClassroomCourseSchedules(Integer classroomId, Integer scheduleSchemeId, Integer orgId);

	void deleteCourseSchedule(Integer id, Integer optPsnId, Integer orgId);

	void deleteCourseSchedules(List<Integer> ids, Integer optPsnId, Integer orgId);

	void deleteCourseSchedulesByClassroomId(List<Integer> classroomIdList, Integer optPsnId, Integer orgId);

	/**
	 * 获取当前上课时间的课表记录
	 * 
	 * @param schemeid
	 * @param classroomId
	 * @param classTime
	 * @return
	 */
	CourseSchedule getCurCourseSchedule(Integer schemeId, Integer classroomId, Date classTime, Integer orgId);


}
