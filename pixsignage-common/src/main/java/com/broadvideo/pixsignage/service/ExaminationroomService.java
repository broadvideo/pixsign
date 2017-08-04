package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.domain.Examinationroom;

public interface ExaminationroomService {
	PageResult getExaminationroomList(String search, PageInfo page, Integer orgid);

	Integer addExaminationroom(Examinationroom examinationroom);

	void updateExaminationroom(Examinationroom examinationroom);

	void deleteExaminationroom(Integer examinationroomid, Integer orgid);

	List<Examinationroom> getExaminationroomsByClassroomid(Integer classroomid);

}
