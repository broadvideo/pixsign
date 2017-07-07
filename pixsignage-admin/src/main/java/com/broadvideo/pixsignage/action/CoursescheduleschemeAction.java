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

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Courseschedulescheme;
import com.broadvideo.pixsignage.domain.Periodtimedtl;
import com.broadvideo.pixsignage.service.CourseScheduleSchemeService;
import com.broadvideo.pixsignage.util.JsonMapper;
import com.broadvideo.pixsignage.util.Struts2Utils;


@Scope("request")
@Controller("coursescheduleschemeAction")
public class CoursescheduleschemeAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -46107223899391735L;
	private final Logger logger = LoggerFactory.getLogger(getClass());
	private Courseschedulescheme courseschedulescheme;
	private JsonMapper jsonMapper = JsonMapper.nonNullMapper();
	@Autowired
	private CourseScheduleSchemeService coursescheduleschemeService;

	public String doList() throws Exception {
		try {
			PageInfo pageInfo = super.initPageInfo();
			String searchKey = getParameter("sSearch");
			Integer orgId = getStaffOrgid();
			PageResult pageResult=this.coursescheduleschemeService.getSchemes(searchKey, pageInfo, orgId);
			this.setAaData(pageResult.getResult());
			this.setiTotalRecords(pageResult.getTotalCount());
			this.setiTotalDisplayRecords(pageResult.getTotalCount());
			return SUCCESS;
		
		} catch (Exception ex) {
			logger.error("获取课表方案配置列表出现异常！", ex);
			renderError(-1, ex.getMessage());
			return ERROR;
		}


	}
	public String getEnableCourseScheduleScheme() throws Exception{
		try {
			this.courseschedulescheme = this.coursescheduleschemeService.getEnableScheme(getStaffOrgid());
			return SUCCESS;
		} catch (Exception ex) {
			renderError(-1, ex.getMessage());
			return ERROR;

		}
		
	}


	public String addCourseScheduleScheme() throws Exception {

		if (StringUtils.isBlank(courseschedulescheme.getName()) || StringUtils.isBlank(courseschedulescheme.getWorkdays())) {
			logger.error("添加课表方案失败：缺少必要参数！");
			renderError(-1, "Invalid args.");
			return ERROR;
		}
		courseschedulescheme.setCreatepsnid(getStaffid());
		courseschedulescheme.setOrgid(getStaffOrgid());
		try {
			Integer id = coursescheduleschemeService.addScheme(courseschedulescheme);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("添加课表方案出现异常:", ex);
			renderError(-1, ex.getMessage());
			return ERROR;

		}

	}

	public String getCourseScheduleScheme() throws Exception {

		String id = Struts2Utils.getParameter("id");
		if (StringUtils.isBlank(id) || !NumberUtils.isNumber(id)) {
			logger.error("获取scheduleconfig参数id无效！");
			renderError(-1, "Invalid args.");
			return ERROR;
		}
		try {
			courseschedulescheme = this.coursescheduleschemeService.loadScheme(NumberUtils.toInt(id),
				getStaffOrgid());

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("获取课表方案明细出现异常！", ex);
			renderError(-1, ex.getMessage());
			return ERROR;

		}

	}

	public String updateCourseScheduleScheme() throws ServiceException {
		if (courseschedulescheme.getCoursescheduleschemeid() == null
				|| StringUtils.isBlank(courseschedulescheme.getName())
				|| StringUtils.isBlank(courseschedulescheme.getWorkdays())) {

			logger.error("修改课表方案失败：缺少必要参数！");
			renderError(-1, "Invalid args.");
			return ERROR;

		}

		courseschedulescheme.setOrgid(getStaffOrgid());
		courseschedulescheme.setUpdatepsnid(getStaffid());
		try {
			this.coursescheduleschemeService.updateScheme(courseschedulescheme);

			return SUCCESS;
		} catch (Exception ex) {

			logger.error("修改课表方案出现异常：", ex.getMessage());
			renderError(-1, ex.getMessage());
			return ERROR;
		}

	}

	public String deleteCourseScheduleScheme() throws Exception {
		String ids = Struts2Utils.getParameter("ids");
		if (StringUtils.isBlank(ids)) {
			logger.error("删除课表方案失败：缺少参数Ids！");
			renderError(-1, "Invalid args.");
			return ERROR;
		}

		String[] strIds = ids.split(",");
		List<Integer> idList = new ArrayList<Integer>();
		for (String strId : strIds) {
			idList.add(NumberUtils.toInt(strId));
		}
		try {
			this.coursescheduleschemeService.deleteSchemes(idList, getStaffid(),
					getStaffOrgid());

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("删除课表方案异常：", ex);
			renderError(-1, ex.getMessage());
			return ERROR;
		}
	}

	public String updateCourseScheduleSchemeFlag() throws Exception {
		if (courseschedulescheme.getCoursescheduleschemeid() == null
				|| StringUtils.isBlank(courseschedulescheme.getEnableflag())) {

			logger.error("修改课表方案状态失败：缺少必要参数！");
			renderError(-1, "Invalid args.");
			return ERROR;
		}
		try {
			this.coursescheduleschemeService.changeSchemeFlag(courseschedulescheme.getCoursescheduleschemeid(),
					courseschedulescheme.getEnableflag(),
					getStaffid(), getStaffOrgid());
			return SUCCESS;
		} catch (Exception ex) {

			logger.error("修改课表方案状态异常:", ex.getMessage());
			renderError(-1, ex.getMessage());
			return ERROR;
		}


	}

	public String updatePeriodTimeDtls() throws Exception {
		String requestBody = IOUtils.toString(getHttpServletRequest().getInputStream());
		logger.info("updatePeriodTimes reqbody:{}", requestBody);
		Courseschedulescheme scheduleScheme = jsonMapper.fromJson(requestBody, Courseschedulescheme.class);
		if (!isPeriodTimesValidForUpdate(scheduleScheme)) {
			logger.error("修改课表方案明细失败：缺少必要参数！");
			renderError(-1, "Invalid args.");
			return ERROR;
		}
		try {
			this.coursescheduleschemeService.updatePeriodTimeDtls(scheduleScheme, getStaffid(),
					getStaffOrgid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("修改上课时间明细异常！", ex);
			renderError(-1, ex.getMessage());
			return ERROR;
		}


	}

	public String addPeriodTimeDtls() throws Exception {

		String requestBody =IOUtils.toString(getHttpServletRequest().getInputStream());
		logger.info("addPeriodTimes reqbody:{}", requestBody);
		Courseschedulescheme scheduleScheme = jsonMapper.fromJson(requestBody, Courseschedulescheme.class);
		if (!isPeriodTimesValidForAdd(scheduleScheme)) {
			logger.error("添加课表方案明细失败：缺少必要参数！");
			renderError(-1, "Invalid args.");
			return ERROR;
		}
		try {
			this.coursescheduleschemeService.addPeriodTimeDtls(scheduleScheme, getStaffid(),
					getStaffOrgid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("添加上课时间明细异常！", ex);
			renderError(-1, ex.getMessage());
			return ERROR;

		}
	}

	public String getCourseScheduleSchemeDtl() throws Exception {
		if (courseschedulescheme.getCoursescheduleschemeid() == null) {
			logger.error("获取课表方案详情失败：缺少必要参数！");
			renderError(-1, "Invalid args.");
			return ERROR;
		}
		try {
			this.courseschedulescheme = this.coursescheduleschemeService.getSchemeDtl(
					courseschedulescheme.getCoursescheduleschemeid(),
					getStaffOrgid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("获取课表详情异常：", ex);
			renderError(-1, ex.getMessage());
			return ERROR;
		}

	}

	private boolean isPeriodTimesValidForAdd(Courseschedulescheme scheme) throws Exception {

		List<Periodtimedtl> dtls = new ArrayList<Periodtimedtl>();
		dtls.addAll(scheme.getMorningperiodtimedtls());
		dtls.addAll(scheme.getAfternoonperiodtimedtls());
		dtls.addAll(scheme.getNightperiodtimedtls());
		for (Periodtimedtl dtl : dtls) {

			if (StringUtils.isBlank(dtl.getShortstarttime()) || StringUtils.isBlank(dtl.getShortendtime())) {

				return false;

			}

		}

		return true;
	}

	private boolean isPeriodTimesValidForUpdate(Courseschedulescheme scheme) throws Exception {

		List<Periodtimedtl> dtls = new ArrayList<Periodtimedtl>();
		dtls.addAll(scheme.getMorningperiodtimedtls());
		dtls.addAll(scheme.getAfternoonperiodtimedtls());
		dtls.addAll(scheme.getNightperiodtimedtls());
		for (Periodtimedtl dtl : dtls) {

			if (dtl.getPeriodtimedtlid() == null || StringUtils.isBlank(dtl.getShortstarttime())
					|| StringUtils.isBlank(dtl.getShortendtime())) {

				return false;

			}

		}

		return true;
	}

	public Courseschedulescheme getCourseschedulescheme() {
		return courseschedulescheme;
	}

	public void setCourseschedulescheme(Courseschedulescheme courseschedulescheme) {
		this.courseschedulescheme = courseschedulescheme;
	}

	/**
	 * 如果缺少get方法，每次请求都会重新创建scheduleScheme，导致数据丢失
	 * 
	 * @return
	 */

}
