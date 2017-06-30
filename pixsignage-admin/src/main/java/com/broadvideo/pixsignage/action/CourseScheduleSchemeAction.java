package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.JsonMapper;
import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageRetRespEntity;
import com.broadvideo.pixsignage.common.ResponseUtil;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.common.Struts2Utils;
import com.broadvideo.pixsignage.domain.CourseScheduleScheme;
import com.broadvideo.pixsignage.domain.PeriodTimeDtl;
import com.broadvideo.pixsignage.service.CourseScheduleSchemeService;


@Scope("request")
@Controller("courseScheduleSchemeAction")
public class CourseScheduleSchemeAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -46107223899391735L;
	private final Logger logger = LoggerFactory.getLogger(getClass());
	private PageInfo<CourseScheduleScheme> page = new PageInfo<CourseScheduleScheme>(10);
	private CourseScheduleScheme scheduleScheme;
	private JsonMapper jsonMapper = JsonMapper.nonNullMapper();
	@Autowired
	private CourseScheduleSchemeService scheduleSchemeService;

	public String listCourseScheduleSchemes() throws Exception {
		try {
			String strPageNo = Struts2Utils.getParameter("pageNo");
			String strPageSize = Struts2Utils.getParameter("pageSize");
			String searchKey = Struts2Utils.getParameter("searchKey");
			Integer orgId = getStaffOrgid();
			if (NumberUtils.isNumber(strPageNo)) {
				page.setPageNo(NumberUtils.toInt(strPageNo));
			}
			if (NumberUtils.isNumber(strPageSize)) {
				page.setPageSize(NumberUtils.toInt(strPageSize));
			}
			this.scheduleSchemeService.getSchemes(searchKey, page, orgId);
			List<CourseScheduleScheme> results = page.getResult();
			int recordsTotal = (results == null ? 0 : page.getTotalCount());

			PageRetRespEntity respEntity = new PageRetRespEntity(RetCodeEnum.SUCCESS, null, recordsTotal, recordsTotal,
					results);
			ResponseUtil.responseJson(respEntity);
		} catch (Exception ex) {
			logger.error("获取课表方案配置列表出现异常！", ex);
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());
		}

		return NONE;

	}
	public String getEnableCourseScheduleScheme() throws Exception{
		try {
			CourseScheduleScheme scheme = this.scheduleSchemeService.getEnableScheme(getStaffOrgid());
			ResponseUtil.objectRetResponse(scheme, "");
			return NONE;
		} catch (Exception ex) {

			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());
		}
		
		return NONE;
	}


	public String addCourseScheduleScheme() throws Exception {

		if (StringUtils.isBlank(scheduleScheme.getName()) || StringUtils.isBlank(scheduleScheme.getWorkdays())) {
			logger.error("添加课表方案失败：缺少必要参数！");
			ResponseUtil.codeResponse(RetCodeEnum.INVALID_ARGS, "Invalid args.");
			return NONE;
		}
		scheduleScheme.setCreatepsnid(getStaffid());
		scheduleScheme.setOrgid(getStaffOrgid());
		try {
			Integer id = scheduleSchemeService.addScheme(scheduleScheme);
			ResponseUtil.idRetResonse(id, "success");
			return NONE;
		} catch (Exception ex) {
			logger.error("添加课表方案出现异常:", ex);
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());

		}

		return NONE;
	}

	public String getCourseScheduleScheme() throws Exception {

		String id = Struts2Utils.getParameter("id");
		if (StringUtils.isBlank(id) || !NumberUtils.isNumber(id)) {

			logger.error("获取scheduleconfig参数id无效！");
			ResponseUtil.codeResponse(RetCodeEnum.INVALID_ARGS, "Invalid args:id");
			return NONE;
		}
		try {
			CourseScheduleScheme scheduleScheme = this.scheduleSchemeService.loadScheme(NumberUtils.toInt(id),
				getStaffOrgid());
			ResponseUtil.objectRetResponse(scheduleScheme, "success");
			return NONE;
		} catch (Exception ex) {
			logger.error("获取课表方案明细出现异常！", ex);
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());

		}

		return NONE;
	}

	public String updateCourseScheduleScheme() throws ServiceException {
		if (scheduleScheme.getId() == null || StringUtils.isBlank(scheduleScheme.getName())
				|| StringUtils.isBlank(scheduleScheme.getWorkdays())) {

			logger.error("修改课表方案失败：缺少必要参数！");
			ResponseUtil.codeResponse(RetCodeEnum.INVALID_ARGS, "Invalid args.");
			return NONE;

		}

		scheduleScheme.setOrgid(getStaffOrgid());
		scheduleScheme.setUpdatepsnid(getStaffid());
		try {
			this.scheduleSchemeService.updateScheme(scheduleScheme);
			ResponseUtil.codeResponse(RetCodeEnum.SUCCESS, "success");
			return NONE;
		} catch (Exception ex) {

			logger.error("修改课表方案出现异常：", ex.getMessage());
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());
		}
		return NONE;
	}

	public String deleteCourseScheduleScheme() throws Exception {
		String ids = Struts2Utils.getParameter("ids");
		if (StringUtils.isBlank(ids)) {
			logger.error("删除课表方案失败：缺少参数Ids！");
			ResponseUtil.codeResponse(RetCodeEnum.INVALID_ARGS, "Ids is empty.");
			return NONE;
		}

		String[] strIds = ids.split(",");
		List<Integer> idList = new ArrayList<Integer>();
		for (String strId : strIds) {
			idList.add(NumberUtils.toInt(strId));
		}
		try {
			this.scheduleSchemeService.deleteSchemes(idList, getStaffid(),
					getStaffOrgid());
			ResponseUtil.codeResponse(RetCodeEnum.SUCCESS, "message");
			return NONE;
		} catch (Exception ex) {
			logger.error("删除课表方案异常：", ex);
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());
		}
		return NONE;
	}

	public String updateCourseScheduleSchemeFlag() throws Exception {
		if (scheduleScheme.getId() == null || StringUtils.isBlank(scheduleScheme.getEnableflag())) {

			logger.error("修改课表方案状态失败：缺少必要参数！");
			ResponseUtil.codeResponse(RetCodeEnum.INVALID_ARGS, "Invalid args.");
			return NONE;
		}
		try {
			this.scheduleSchemeService.changeSchemeFlag(scheduleScheme.getId(), scheduleScheme.getEnableflag(),
					getStaffid(), getStaffOrgid());
			ResponseUtil.codeResponse(RetCodeEnum.SUCCESS, "success.");
			return NONE;
		} catch (Exception ex) {

			logger.error("修改课表方案状态异常:", ex.getMessage());
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());
		}


		return NONE;
	}

	public String updatePeriodTimeDtls() throws Exception {
		String requestBody = IOUtils.toString(getHttpServletRequest().getInputStream());
		logger.info("updatePeriodTimes reqbody:{}", requestBody);
		CourseScheduleScheme scheduleScheme = jsonMapper.fromJson(requestBody, CourseScheduleScheme.class);
		if (!isPeriodTimesValidForUpdate(scheduleScheme)) {
			logger.error("修改课表方案明细失败：缺少必要参数！");
			ResponseUtil.codeResponse(RetCodeEnum.INVALID_ARGS, "Invalid args.");
			return NONE;
		}
		try {
			this.scheduleSchemeService.updatePeriodTimeDtls(scheduleScheme, getStaffid(),
					getStaffOrgid());
			ResponseUtil.codeResponse(RetCodeEnum.SUCCESS, "success.");
			return NONE;
		} catch (Exception ex) {
			logger.error("修改上课时间明细异常！", ex);
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());

		}

		return NONE;
	}

	public String addPeriodTimeDtls() throws Exception {

		String requestBody =IOUtils.toString(getHttpServletRequest().getInputStream());
		logger.info("addPeriodTimes reqbody:{}", requestBody);
		CourseScheduleScheme scheduleScheme = jsonMapper.fromJson(requestBody, CourseScheduleScheme.class);
		if (!isPeriodTimesValidForAdd(scheduleScheme)) {
			logger.error("添加课表方案明细失败：缺少必要参数！");
			ResponseUtil.codeResponse(RetCodeEnum.INVALID_ARGS, "Invalid args.");
			return NONE;
		}
		try {
			this.scheduleSchemeService.addPeriodTimeDtls(scheduleScheme, getStaffid(),
					getStaffOrgid());
			ResponseUtil.codeResponse(RetCodeEnum.SUCCESS, "success.");
			return NONE;
		} catch (Exception ex) {
			logger.error("添加上课时间明细异常！", ex);
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());

		}

		return NONE;
	}

	public String getCourseScheduleSchemeDtl() throws Exception {
		if (scheduleScheme.getId() == null) {
			logger.error("获取课表方案详情失败：缺少必要参数！");
			ResponseUtil.codeResponse(RetCodeEnum.INVALID_ARGS, "Invalid args.");
			return NONE;
		}
		try {
			CourseScheduleScheme scheme = this.scheduleSchemeService.getSchemeDtl(scheduleScheme.getId(),
					getStaffOrgid());
			ResponseUtil.objectRetResponse(scheme, "");
		} catch (Exception ex) {
			logger.error("获取课表详情异常：", ex);
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());
		}

		return NONE;
	}

	private boolean isPeriodTimesValidForAdd(CourseScheduleScheme scheme) throws Exception {

		List<PeriodTimeDtl> dtls = new ArrayList<PeriodTimeDtl>();
		dtls.addAll(scheme.getMorningPeriodTimeDtls());
		dtls.addAll(scheme.getAfternoonPeriodTimeDtls());
		dtls.addAll(scheme.getNightPeriodTimeDtls());
		for (PeriodTimeDtl dtl : dtls) {

			if (StringUtils.isBlank(dtl.getShortstarttime()) || StringUtils.isBlank(dtl.getShortendtime())) {

				return false;

			}

		}

		return true;
	}

	private boolean isPeriodTimesValidForUpdate(CourseScheduleScheme scheme) throws Exception {

		List<PeriodTimeDtl> dtls = new ArrayList<PeriodTimeDtl>();
		dtls.addAll(scheme.getMorningPeriodTimeDtls());
		dtls.addAll(scheme.getAfternoonPeriodTimeDtls());
		dtls.addAll(scheme.getNightPeriodTimeDtls());
		for (PeriodTimeDtl dtl : dtls) {

			if (dtl.getId() == null || StringUtils.isBlank(dtl.getShortstarttime())
					|| StringUtils.isBlank(dtl.getShortendtime())) {

				return false;

			}

		}

		return true;
	}

	/**
	 * 如果缺少get方法，每次请求都会重新创建scheduleScheme，导致数据丢失
	 * 
	 * @return
	 */
	public CourseScheduleScheme getScheduleScheme() {
		return scheduleScheme;
	}

	public void setScheduleScheme(CourseScheduleScheme scheduleScheme) {
		this.scheduleScheme = scheduleScheme;
	}
}
