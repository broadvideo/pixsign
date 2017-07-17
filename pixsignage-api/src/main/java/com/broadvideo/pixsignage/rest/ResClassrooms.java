package com.broadvideo.pixsignage.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.ApiRetCodeEnum;
import com.broadvideo.pixsignage.domain.Classroom;
import com.broadvideo.pixsignage.domain.Config;
import com.broadvideo.pixsignage.domain.Courseschedule;
import com.broadvideo.pixsignage.domain.Courseschedulescheme;
import com.broadvideo.pixsignage.domain.Periodtimedtl;
import com.broadvideo.pixsignage.domain.Schoolclass;
import com.broadvideo.pixsignage.domain.Student;
import com.broadvideo.pixsignage.persistence.ClassroomMapper;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.SchoolclassMapper;
import com.broadvideo.pixsignage.persistence.StudentMapper;
import com.broadvideo.pixsignage.service.ClassroomService;
import com.broadvideo.pixsignage.service.CourseScheduleSchemeService;
import com.broadvideo.pixsignage.util.Base64;
import com.broadvideo.pixsignage.util.DateUtil;

@Component
@Path("/classrooms")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ResClassrooms {

	private Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private ClassroomService classroomService;
	@Autowired
	private CourseScheduleSchemeService coursescheduleschemeService;
	@Autowired
	private StudentMapper studentMapper;
	@Autowired
	private ClassroomMapper classroomMapper;
	@Autowired
	private SchoolclassMapper schoolclassMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private ConfigMapper configMapper;


	@GET
	@Path("/")
	public String list(@Context HttpServletRequest req, @QueryParam("org_code") String orgCode) {
		logger.debug("Get classrooms(orgCode={}) request...", orgCode);
		if (StringUtils.isBlank(orgCode)) {
			return handleResult(ApiRetCodeEnum.INVALID_ARGS, "org_code is null!");

		}

		try {
			List<Classroom> classrooms = this.classroomService.getClassroomsByOrgCode(orgCode);
			List<Map<String, Object>> data = new ArrayList<Map<String, Object>>();
			if (classrooms != null) {
				for (Classroom classroom : classrooms) {
					Map<String, Object> classroomMap = new HashMap<String, Object>();
					classroomMap.put("id", classroom.getClassroomid());
					classroomMap.put("name", classroom.getName());
					data.add(classroomMap);
				}
			}
			return this.handleResult(ApiRetCodeEnum.SUCCESS, "success", data);
		} catch (Exception e) {

			logger.error("Get classrooms exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}

	@GET
	@Path("/{classroom_id}/schedules")
	public String getClassroomSchedules(@Context HttpServletRequest req,
			@PathParam("classroom_id") Integer classroomId) {
		logger.debug("Get ClassroomSchedules(classroomId={}) request...", classroomId);
		if (classroomId == null) {
			logger.error("classroom_id参数为空！");
			return this.handleResult(ApiRetCodeEnum.INVALID_ARGS, "classroom_id is null.");
		}
		try {
			JSONObject respJson = new JSONObject();
			Classroom classroom = this.classroomMapper.selectByPrimaryKey(classroomId);
			Courseschedulescheme scheme = coursescheduleschemeService.getEnableScheme(classroom.getOrgid());
			Courseschedulescheme schemedtl = coursescheduleschemeService.getSchemeDtl(
					scheme.getCoursescheduleschemeid(), scheme.getOrgid());
			JSONObject schemeJson = this.buildSchemeJson(schemedtl);
			List<Courseschedule> schedules = classroomService.getClassroomSchedules(classroomId);
			List<Map<String, Object>> scheduleList = new ArrayList<Map<String, Object>>();
			if (schedules != null) {
				for (Courseschedule schedule : schedules) {
					Map<String, Object> scheduleMap = new HashMap<String, Object>();
					scheduleMap.put("id", schedule.getCoursescheduleid());
					scheduleMap.put("course_id", schedule.getCourseid());
					scheduleMap.put("course_name", schedule.getCoursename());
					scheduleMap.put("teacher_name", schedule.getTeachername());
					scheduleMap.put("teacher_id", schedule.getTeacherid());
					scheduleMap.put("workday", schedule.getWorkday());
					scheduleMap.put("type", schedule.getPeriodtimedtl().getType());
					scheduleMap.put("period_num", schedule.getPeriodtimedtl().getPeriodnum());
					scheduleMap.put("start_time",
							DateUtil.formatShorttime(schedule.getPeriodtimedtl().getShortstarttime(), null));
					scheduleMap.put("end_time",
							DateUtil.formatShorttime(schedule.getPeriodtimedtl().getShortendtime(), null));
					scheduleList.add(scheduleMap);
				}


			}
			respJson.put("retcode", ApiRetCodeEnum.SUCCESS);
			respJson.put("message", "success");
			respJson.put("scheme", schemeJson);
			respJson.put("course_schedules", scheduleList);
			return respJson.toString();
		} catch (Exception e) {
			logger.error("Get classroom schedules exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());

		}

	}

	@GET
	@Path("/{classroom_id}/students")
	public String getClassroomStudents(@Context HttpServletRequest req, @PathParam("classroom_id") Integer classroomId) {
		logger.debug("Get getClassroomStudents(classroomId={}) request...", classroomId);
		if (classroomId == null) {
			logger.error("classroom_id参数为空！");
			return handleResult(ApiRetCodeEnum.INVALID_ARGS, "classroom_id is null.");
		}
		try {
			Classroom classroom = this.classroomMapper.selectByPrimaryKey(classroomId);
			if (classroom == null) {
				logger.error("no classroom found:classroom_id={}", classroomId);
				return handleResult(ApiRetCodeEnum.EXCEPTION, "classroom_id(" + classroomId + ") not found.");
			}
			Schoolclass schoolclass = schoolclassMapper.selectByClassroomid(classroom.getOrgid(), classroomId);
			if (schoolclass == null) {
				logger.error("classroom_id={} not bind schooclass.", classroomId);
				return handleResult(ApiRetCodeEnum.EXCEPTION, "classroom_id(" + classroomId + ") not bind schoolclass.");

			}
			List<Student> students = studentMapper.selectList(schoolclass.getOrgid() + "",
					schoolclass.getSchoolclassid()
					+ "", null, "0",
					"" + Integer.MAX_VALUE);
			List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
			for (Student student : students) {
				Map<String, Object> dataMap = new HashMap<String, Object>();
				dataMap.put("id", student.getStudentid());
				dataMap.put("name", student.getName());
				dataMap.put("student_no", student.getStudentno());
				dataMap.put("hard_id", student.getHardid());
				String serverIP = "192.168.0.71";
				Config config = configMapper.selectByCode("ServerIP");
				if (config != null) {
					serverIP = config.getValue();
				}

				dataMap.put("avatar", "http://" + serverIP + "/pixsigdata/image/avatar/" + student.getStudentno()
						+ ".jpg");
				dataList.add(dataMap);
			}

			return this.handleResult(ApiRetCodeEnum.SUCCESS, "success", dataList);
		} catch (Exception e) {
			logger.error("Get classroom schedules exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());

		}

	}

	@GET
	@Path("/{classroom_id}/messagesum")
	public String getClassroomMsgSum(@Context HttpServletRequest req, @PathParam("classroom_id") Integer classroomId) {
		logger.debug("Get getClassroomMsgSum(classroomId={}) request...", classroomId);

		try {
			Classroom classroom = this.classroomMapper.selectByPrimaryKey(classroomId);
			Schoolclass schoolclass = this.schoolclassMapper.selectByClassroomid(classroom.getOrgid(), classroomId);
			String url = "http://school.wkmip.cn/mobile/interface/statistics?school_id=1"
					+ "&class_name=" + java.net.URLEncoder.encode(schoolclass.getName(), "UTF-8");
			logger.info("get messagesum from wkmip: {}", url);
			RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
					.setConnectionRequestTimeout(30000).build();
			CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
			HttpGet httpget = new HttpGet(url);
			CloseableHttpResponse response = httpclient.execute(httpget);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				String s = EntityUtils.toString(response.getEntity());
				httpclient.close();
				logger.info("get messagesum from wkmip response: {}", s);
				return s;
			} else {
				httpclient.close();
				logger.error("call get messagesum  response code: {}", status);
				return Base64.encode("[]".getBytes());
			}
		} catch (Exception e) {
			logger.error("call get messagesum error: {}", e.getMessage());
			return Base64.encode("[]".getBytes());
		}



	}
	private String handleResult(int code, String message) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		logger.info("Classroom Service response: {}", responseJson.toString());
		return responseJson.toString();
	}

	private String handleResult(int code, String message, List<Map<String, Object>> data) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		responseJson.put("data", data);
		logger.info("Classroom Service response: {}", responseJson.toString());
		return responseJson.toString();
	}

	private JSONObject buildSchemeJson(Courseschedulescheme scheme) {
		JSONObject schemeJson = new JSONObject();
		String[] workdaysArr=scheme.getWorkdays().split(",");
		int[] intWorkdays = new int[workdaysArr.length];
		for (int i = 0; i < workdaysArr.length; i++) {

			intWorkdays[i] = Integer.parseInt(workdaysArr[i]);
		}
		schemeJson.put("workdays", intWorkdays);
		JSONObject morningJson = new JSONObject();
		morningJson.put("periods", scheme.getMorningperiods());
		morningJson.put("dtls", this.buildPeriodtimedtls(scheme.getMorningperiodtimedtls()));
		schemeJson.put("morning", morningJson);
		JSONObject afternoonJson = new JSONObject();
		afternoonJson.put("periods", scheme.getAfternoonperiods());
		afternoonJson.put("dtls", this.buildPeriodtimedtls(scheme.getAfternoonperiodtimedtls()));
		schemeJson.put("afternoon", afternoonJson);
		JSONObject nightJson = new JSONObject();
		nightJson.put("periods", scheme.getNightperiods());
		nightJson.put("dtls", this.buildPeriodtimedtls(scheme.getNightperiodtimedtls()));
		schemeJson.put("night", nightJson);
		return schemeJson;

	}

	private List<Map<String, Object>> buildPeriodtimedtls(List<Periodtimedtl> periodtimedtls) {
		List<Map<String, Object>> dtls = new ArrayList<Map<String, Object>>();
		for (Periodtimedtl periodtimedtl : periodtimedtls) {
			Map<String, Object> morningDtlMap = new HashMap<String, Object>();
			morningDtlMap.put("period_num", periodtimedtl.getPeriodnum());
			morningDtlMap.put("start_time", periodtimedtl.getShortstarttime());
			morningDtlMap.put("end_time", periodtimedtl.getShortendtime());
			dtls.add(morningDtlMap);

		}

		return dtls;
	}


}
