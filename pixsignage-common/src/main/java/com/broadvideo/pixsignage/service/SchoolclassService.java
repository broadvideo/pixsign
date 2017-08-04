package com.broadvideo.pixsignage.service;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.domain.Schoolclass;

public interface SchoolclassService {

	Integer addSchoolclass(Schoolclass schoolclass);

	boolean hasBind(Integer classroomid, Integer excludeschoolclassid);

	PageResult getSchoolclassList(String search, PageInfo page, Integer orgid);

	void upateSchoolclass(Schoolclass schoolclass);

	void deleteSchoolclass(Integer schoolclassid, Integer orgid);

	Schoolclass loadSchoolclassByName(String name, Integer orgid);

}
