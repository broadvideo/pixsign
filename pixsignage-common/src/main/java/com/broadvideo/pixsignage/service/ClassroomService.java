package com.broadvideo.pixsignage.service;

import java.util.List;
import java.util.Map;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.domain.Classroom;
import com.broadvideo.pixsignage.domain.CourseSchedule;


/**
 * 教室接口
 * 
 * @author charles
 *
 */
public interface ClassroomService {

	void getClassrooms(String searchKey, PageInfo<Map<String, Object>> page, Integer orgId);

	Integer addClassroom(Classroom classroom);

	void deleteClassroom(List<Integer> idList, Integer optPsnId, Integer orgId);

	void updateClassroom(Classroom classroom);

	Classroom loadClassroom(Integer id, Integer orgId);

	List<Classroom> getClassroomsByOrgCode(String orgCode);

	List<Classroom> getClassrooms(Integer orgId);

	List<CourseSchedule> getClassroomSchedules(Integer classroomId);


}
