package com.broadvideo.pixsignage.rest;

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
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
import com.broadvideo.pixsignage.domain.Attendance;
import com.broadvideo.pixsignage.domain.Courseschedule;
import com.broadvideo.pixsignage.domain.Courseschedulescheme;
import com.broadvideo.pixsignage.domain.Student;
import com.broadvideo.pixsignage.persistence.AttendanceMapper;
import com.broadvideo.pixsignage.persistence.StudentMapper;
import com.broadvideo.pixsignage.service.CourseScheduleSchemeService;
import com.broadvideo.pixsignage.service.CourseScheduleService;
import com.broadvideo.pixsignage.util.Base64;

@Component
@Path("/students")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ResStudents {

	private Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private AttendanceMapper attendancelogMapper;
	@Autowired
	private StudentMapper studentMapper;
	@Autowired
	private CourseScheduleSchemeService courseScheduleSchemeService;
	@Autowired
	private CourseScheduleService courseScheduleService;

	@POST
	@Path("/{student_id}/attendance")
	public String doStudentAttend(String request, @Context HttpServletRequest req) {
		if (StringUtils.isBlank(request)) {
			return handleResult(ApiRetCodeEnum.INVALID_ARGS, "Request body is empty.");

		}
		try {
		JSONObject requestJson = new JSONObject(request);
		String hardId = requestJson.getString("hard_id");
		Integer studentId = requestJson.getInt("student_id");
		Integer classroomId = requestJson.getInt("classroom_id");
		Integer courseScheduleId = requestJson.getInt("course_schedule_id");
		Long eventTimeTs = requestJson.getLong("event_time");

			Student student = this.studentMapper.selectByPrimaryKey(studentId + "");
		Attendance attendancelog = new Attendance();
		attendancelog.setClassroomid(classroomId);
		attendancelog.setCoursescheduleid(courseScheduleId);
			Date curDate = new Date();
			attendancelog.setEventtime(curDate);
		attendancelog.setStudentid(studentId);
			attendancelog.setCreatetime(curDate);
			Courseschedulescheme scheme = courseScheduleSchemeService.getEnableScheme(student.getOrgid());
			if (scheme != null) {
				Courseschedule courseSchedule = this.courseScheduleService.getCurCourseSchedule(
						scheme.getCoursescheduleschemeid(),
						classroomId, curDate, student.getOrgid());
				if (courseSchedule != null) {
					attendancelog.setCoursescheduleid(courseSchedule.getCoursescheduleid());
				}

			}

			attendancelog.setSchoolclassid(student.getSchoolclassid());
			attendancelog.setOrgid(student.getOrgid());
		this.attendancelogMapper.insertSelective(attendancelog);

			return this.handleResult(ApiRetCodeEnum.SUCCESS, "success");
		} catch (Exception e) {

			logger.error("doStudentAttend exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}

	@GET
	@Path("/{student_id}/messages")
	public String getMessages(@Context HttpServletRequest req, @PathParam("student_id") Integer studentId,
			@QueryParam("terminal_id") String terminalId) {
		if (studentId == null) {
			return handleResult(ApiRetCodeEnum.INVALID_ARGS, "studentId  is empty.");
		}
		try {
			try{
		        Student student=this.studentMapper.selectByPrimaryKey(studentId+"");
				String url = "http://school.wkmip.cn/mobile/interface/note?school_id=1&student_no="
						+ student.getStudentno() + "&student_idcard=";
				logger.info("get messages from wkmip: {}", url);
				RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
						.setConnectionRequestTimeout(30000).build();
				CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
				HttpGet httpget = new HttpGet(url);
				CloseableHttpResponse response = httpclient.execute(httpget);
				int status = response.getStatusLine().getStatusCode();
				if (status == 200) {
					String s = EntityUtils.toString(response.getEntity());
					httpclient.close();
					logger.info("get messages from wkmip response: {}", s);
					return s;
				} else {
					httpclient.close();
					logger.error("call get messages  response code: {}", status);
					return Base64.encode("[]".getBytes());
				}
			} catch (Exception e) {
				logger.error("call get messages error: {}", e.getMessage());
				return Base64.encode("[]".getBytes());
			}


		} catch (Exception e) {

			logger.error("getMessages exception.", e);
			return Base64.encode("[]".getBytes());
		}

	}

	@POST
	@Path("/{student_id}/message")
	public String sendMessage(String request, @Context HttpServletRequest req,
			@PathParam("student_id") Integer studentId) {
		if (studentId == null || StringUtils.isBlank(request)) {
			return handleResult(ApiRetCodeEnum.INVALID_ARGS, "studentId or request body is empty.");
		}

		try {
			JSONObject requestBodyJson = new JSONObject(request);
			studentId = requestBodyJson.getInt("student_id");
			String image = requestBodyJson.getString("image");
			String text = requestBodyJson.getString("text");
			String audio = requestBodyJson.getString("audio");
			long msgtime = requestBodyJson.getLong("msg_time");
			logger.info("sendMessage request body:\n{}", request);

			return this.handleResult(ApiRetCodeEnum.SUCCESS, "success");

		} catch (Exception e) {

			logger.error("sendMessage exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());


		}


}
	private String handleResult(int code, String message) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		logger.info("Student Service response: {}", responseJson.toString());
		return responseJson.toString();
	}

	private String handleResult(int code, String message, List<Map<String, Object>> data) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		responseJson.put("data", data);
		logger.info("Student Service response: {}", responseJson.toString());
		return responseJson.toString();
	}


}
