package com.broadvideo.pixsignage.service;

import java.util.Date;
import java.util.List;

import com.broadvideo.pixsignage.domain.Courseschedule;

public interface CourseScheduleService {

	Integer addCourseSchedule(Courseschedule schedule);

	void updateCourseSchedule(Courseschedule schedule);

	Courseschedule getCourseSchedule(Integer id, Integer orgId);

	List<Courseschedule> getClassroomCourseSchedules(Integer classroomId, Integer scheduleSchemeId, Integer orgId);

	List<Courseschedule> getClassroomCourseSchedules(Integer classroomId, Integer workday, Integer scheduleSchemeId,
			Integer orgId);

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
	Courseschedule getCurCourseSchedule(Integer schemeId, Integer classroomId, Date classTime, Integer orgId);


}
