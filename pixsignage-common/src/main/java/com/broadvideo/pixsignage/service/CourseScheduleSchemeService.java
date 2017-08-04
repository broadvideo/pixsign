package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Courseschedulescheme;

public interface CourseScheduleSchemeService {

	Integer addScheme(Courseschedulescheme scheduleScheme) throws ServiceException;

	PageResult<Courseschedulescheme> getSchemes(String searchKey, PageInfo page, Integer orgId)
			throws ServiceException;

	Courseschedulescheme loadScheme(Integer id, Integer orgId) throws ServiceException;

	Courseschedulescheme loadSchemeByName(String name, Integer orgId) throws ServiceException;

	void updateScheme(Courseschedulescheme scheduleScheme) throws ServiceException;

	void changeSchemeFlag(Integer id, String enableFlag, Integer psnId, Integer orgId)
			throws ServiceException;

	void deleteSchemes(List<Integer> ids, Integer optPsnId, Integer orgId) throws ServiceException;

	void addPeriodTimeDtls(Courseschedulescheme scheduleScheme, Integer optPsnId, Integer orgId)
			throws ServiceException;

	void updatePeriodTimeDtls(Courseschedulescheme scheduleScheme, Integer optPsnId, Integer orgId)
			throws ServiceException;

	Courseschedulescheme getSchemeDtl(Integer id, Integer orgId);

	int countSchemeDtl(Integer id, Integer orgId);

	Courseschedulescheme getEnableScheme(Integer orgId);

}
