package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.CourseScheduleScheme;

public interface CourseScheduleSchemeService {

	Integer addScheme(CourseScheduleScheme scheduleScheme) throws ServiceException;

	void getSchemes(String searchKey, PageInfo<CourseScheduleScheme> page, Integer orgId)
			throws ServiceException;

	CourseScheduleScheme loadScheme(Integer id, Integer orgId) throws ServiceException;

	void updateScheme(CourseScheduleScheme scheduleScheme) throws ServiceException;

	void changeSchemeFlag(Integer id, String enableFlag, Integer psnId, Integer orgId)
			throws ServiceException;

	void deleteSchemes(List<Integer> ids, Integer optPsnId, Integer orgId) throws ServiceException;

	void addPeriodTimeDtls(CourseScheduleScheme scheduleScheme, Integer optPsnId, Integer orgId)
			throws ServiceException;

	void updatePeriodTimeDtls(CourseScheduleScheme scheduleScheme, Integer optPsnId, Integer orgId)
			throws ServiceException;

	CourseScheduleScheme getSchemeDtl(Integer id, Integer orgId);

	int countSchemeDtl(Integer id, Integer orgId);

	CourseScheduleScheme getEnableScheme(Integer orgId);

}
