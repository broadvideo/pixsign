package com.broadvideo.pixsignage.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
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
import org.apache.commons.lang3.math.NumberUtils;
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
import com.broadvideo.pixsignage.common.AttendanceStateEnum;
import com.broadvideo.pixsignage.domain.Attendance;
import com.broadvideo.pixsignage.domain.Attendanceevent;
import com.broadvideo.pixsignage.domain.Classroom;
import com.broadvideo.pixsignage.domain.Config;
import com.broadvideo.pixsignage.domain.Courseschedule;
import com.broadvideo.pixsignage.domain.Courseschedulescheme;
import com.broadvideo.pixsignage.domain.Examinationroom;
import com.broadvideo.pixsignage.domain.Periodtimedtl;
import com.broadvideo.pixsignage.domain.Schoolclass;
import com.broadvideo.pixsignage.domain.Student;
import com.broadvideo.pixsignage.persistence.ClassroomMapper;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.SchoolclassMapper;
import com.broadvideo.pixsignage.persistence.StudentMapper;
import com.broadvideo.pixsignage.service.AttendanceService;
import com.broadvideo.pixsignage.service.ClassroomService;
import com.broadvideo.pixsignage.service.CourseScheduleSchemeService;
import com.broadvideo.pixsignage.service.CourseScheduleService;
import com.broadvideo.pixsignage.service.ExaminationroomService;
import com.broadvideo.pixsignage.service.StudentService;
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
	private CourseScheduleService courseScheduleService;
	@Autowired
	private CourseScheduleSchemeService coursescheduleschemeService;
	@Autowired
	private ExaminationroomService examinationroomService;
	@Autowired
	private StudentService studentService;
	@Autowired
	private AttendanceService attendanceService;
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
	public String getClassroomSchedules(@Context HttpServletRequest req, @PathParam("classroom_id") Integer classroomId) {
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
					schoolclass.getSchoolclassid() + "", null, "0", "" + Integer.MAX_VALUE);
			List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
			String serverIP = "192.168.0.71";
			Config config = configMapper.selectByCode("ServerIP");
			if (config != null) {
				serverIP = config.getValue();
			}
			for (Student student : students) {
				Map<String, Object> dataMap = new HashMap<String, Object>();
				dataMap.put("id", student.getStudentid());
				dataMap.put("name", student.getName());
				dataMap.put("student_no", student.getStudentno());
				dataMap.put("hard_id", student.getHardid());
				String avatarpath = null;
				String avatar = student.getAvatar();
				if (StringUtils.isNotBlank(avatar)) {
					avatarpath = "http://" + serverIP + "/pixsigdata" + avatar;
				} else {
					avatarpath = "http://" + serverIP + "/pixsigdata/image/avatar/" + student.getStudentno() + ".jpg";
				}
				dataMap.put("avatar", avatarpath);

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
			String url = "http://school.wkmip.cn/mobile/interface/statistics?school_id=1" + "&class_name="
					+ java.net.URLEncoder.encode(schoolclass.getName(), "UTF-8");
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

	@GET
	@Path("/{classroom_id}/examinationrooms")
	public String getClassroomExaminationrooms(@Context HttpServletRequest req,
			@PathParam("classroom_id") Integer classroomId) {
		logger.debug("getClassroomExaminationrooms(classroomId={}) request...", classroomId);
		try {
			List<Examinationroom> examinationrooms = this.examinationroomService
					.getExaminationroomsByClassroomid(classroomId);
			List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
			if (examinationrooms != null && examinationrooms.size() > 0) {
				for (Examinationroom examinationroom : examinationrooms) {
					Map<String, Object> dataMap = new HashMap<String, Object>();
					dataMap.put("id", examinationroom.getExaminationroomid());
					dataMap.put("name", examinationroom.getName());
					dataMap.put("description", examinationroom.getDescription());
					dataMap.put("coursename", examinationroom.getCoursename());
					dataMap.put("starttime", examinationroom.getStarttime().getTime());
					dataMap.put("endtime", examinationroom.getEndtime().getTime());
					dataList.add(dataMap);
				}

			}
			return this.handleResult(ApiRetCodeEnum.SUCCESS, "success", dataList);
		} catch (Exception ex) {
			logger.error("getClassroomExaminationrooms exception.", ex);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, ex.getMessage());

		}

	}

	@GET
	@Path("/{classroom_id}/attendanceevents")
	public String getClassroomAttendanceevents(@Context HttpServletRequest req,
			@PathParam("classroom_id") Integer classroomId) {
		String yyyyMMdd = req.getParameter("time");
		if (StringUtils.isBlank(yyyyMMdd)) {
			yyyyMMdd = DateUtil.getDateStr(new Date(), "yyyyMMdd");
		}
		Classroom classroom = this.classroomMapper.selectByPrimaryKey(classroomId);
		if (classroom == null) {
			return this.handleResult(ApiRetCodeEnum.EXCEPTION,
					String.format("classroomid:%s is not found.", classroomId),
					new ArrayList());
		}
		final int orgid = classroom.getOrgid();
		List<Attendanceevent> attendanceevents = attendanceService.getAttendanceevents(classroomId, yyyyMMdd, orgid);
		List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
		for (Attendanceevent event : attendanceevents) {
			Map<String, Object> dataMap = new HashMap<String, Object>();
			logger.info("######starttime:{},endtime:{}", event.getStarttime(), event.getEndtime());
			dataMap.put("id", event.getAttendanceeventid());
			dataMap.put("type", event.getType());
			dataMap.put("name", event.getName() == null ? " " : event.getName());
			dataMap.put("start_time", event.getStarttime().getTime());
			dataMap.put("end_time", event.getEndtime().getTime());
			dataList.add(dataMap);
		}
		return this.handleResult(ApiRetCodeEnum.SUCCESS, "success", dataList);

	}

	@GET
	@Path("/{classroom_id}/attendancesummary")
	public String getClassroomAttendancesummary(@Context HttpServletRequest req,
			@PathParam("classroom_id") Integer classroomId) {
		String eventId = req.getParameter("event_id");

		logger.info("req attendancesummary");
		if (StringUtils.isBlank(eventId) || !NumberUtils.isNumber(eventId)) {

			logger.error("event_id is null or not a number.");
			return this.handleResult(ApiRetCodeEnum.INVALID_ARGS, "event_id is null or not a number.");

		}
		Classroom classroom = this.classroomMapper.selectByPrimaryKey(classroomId);
		final int orgid = classroom.getOrgid();
		Schoolclass schoolclass = this.schoolclassMapper.selectByClassroomid(orgid, classroomId);
		List<Student> students = this.studentService.getSchoolclassStudents(schoolclass.getSchoolclassid(), orgid);
		int total = students.size();
		List<Attendance> attendances = this.attendanceService.getAttendancesByEventid(
				NumberUtils.toInt(eventId),
				classroomId, orgid);
		Attendanceevent attendanceevent = this.attendanceService.getAttendanceevent(NumberUtils.toInt(eventId), orgid);
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("event_id", attendanceevent.getAttendanceeventid());
		resultMap.put("event_name", attendanceevent.getName());
		resultMap.put("total", total);
		Config config = configMapper.selectByCode("ServerIP");
		final String serverIP = config.getValue();
		HashSet<Integer> idSet = new HashSet<Integer>();
		List<Map<String, Object>> dtls = new ArrayList<Map<String, Object>>();
		for (Attendance attendance : attendances) {
			Map<String, Object> dtl = new HashMap<String, Object>();
			if (idSet.contains(attendance.getStudentid())) {
				logger.info("studentid:{} exists,ingore this record.", attendance.getStudentid());
				continue;
			}
			dtl.put("student_id", attendance.getStudentid());
			dtl.put("student_no", attendance.getStudent().getStudentno());
			dtl.put("student_name", attendance.getStudent().getName());
			String avatarpath = "http://" + serverIP + "/pixsigdata" + attendance.getStudent().getAvatar();
			dtl.put("state", AttendanceStateEnum.PRESENT);
			dtl.put("avatar", avatarpath);
			dtl.put("event_time", attendance.getEventtime().getTime());
			dtls.add(dtl);
			idSet.add(attendance.getStudentid());
		}
		final int availTotal = idSet.size();
		resultMap.put("avail_total", availTotal);
		if (total > availTotal) {
			for (Student student : students) {
				if (idSet.contains(student.getStudentid())) {
					continue;
				}
				Map<String, Object> absentdtl = new HashMap<String, Object>();
				absentdtl.put("student_id", student.getStudentid());
				absentdtl.put("student_no", student.getStudentno());
				absentdtl.put("student_name", student.getName());
				String avatarpath = "http://" + serverIP + "/pixsigdata/image/avatar/" + student.getStudentno()
						+ ".jpg";
				absentdtl.put("state", AttendanceStateEnum.ABSENT);
				absentdtl.put("avatar", avatarpath);
				absentdtl.put("event_time", -1);
				dtls.add(absentdtl);
			}
		}
		resultMap.put("dtls", dtls);
		return this.handleResult(ApiRetCodeEnum.SUCCESS, "success", resultMap);

	}

	private String handleResult(int code, String message) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		logger.info("Classroom Service response: {}", responseJson.toString());
		return responseJson.toString();
	}

	private String handleResult(int code, String message, List data) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		responseJson.put("data", data);
		logger.info("Classroom Service response: {}", responseJson.toString());
		return responseJson.toString();
	}

	private String handleResult(int code, String message, Object data) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		responseJson.put("data", data);
		logger.info("Classroom Service response: {}", responseJson.toString());
		return responseJson.toString();
	}

	private JSONObject buildSchemeJson(Courseschedulescheme scheme) {
		JSONObject schemeJson = new JSONObject();
		String[] workdaysArr = scheme.getWorkdays().split(",");
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
