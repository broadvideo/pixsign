package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.domain.Classroom;
import com.broadvideo.pixsignage.domain.Courseschedule;


/**
 * 教室接口
 * 
 * @author charles
 *
 */
public interface ClassroomService {

	PageResult getClassrooms(String search, PageInfo page, Integer orgId);

	Integer addClassroom(Classroom classroom);

	void deleteClassroom(List<Integer> idList, Integer optPsnId, Integer orgId);

	void updateClassroom(Classroom classroom);

	Classroom loadClassroom(Integer id, Integer orgId);

	Classroom loadClassroomByName(String name, Integer orgId);

	List<Classroom> getClassroomsByOrgCode(String orgCode);

	List<Classroom> getClassrooms(Integer orgId);

	List<Courseschedule> getClassroomSchedules(Integer classroomId);


}
