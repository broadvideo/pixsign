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
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.ApiRetCodeEnum;
import com.broadvideo.pixsignage.common.DateUtil;
import com.broadvideo.pixsignage.domain.Classroom;
import com.broadvideo.pixsignage.domain.CourseSchedule;
import com.broadvideo.pixsignage.domain.Schoolclass;
import com.broadvideo.pixsignage.domain.Student;
import com.broadvideo.pixsignage.persistence.ClassroomMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.SchoolclassMapper;
import com.broadvideo.pixsignage.persistence.StudentMapper;
import com.broadvideo.pixsignage.service.ClassroomService;

@Component
@Path("/classrooms")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ResClassrooms {

	private Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private ClassroomService classroomService;
	@Autowired
	private StudentMapper studentMapper;
	@Autowired
	private ClassroomMapper classroomMapper;
	@Autowired
	private SchoolclassMapper schoolclassMapper;
	@Autowired
	private DeviceMapper deviceMapper;


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
					classroomMap.put("id", classroom.getId());
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
			List<CourseSchedule> schedules = classroomService.getClassroomSchedules(classroomId);
			List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();

			if (schedules != null) {
				for (CourseSchedule schedule : schedules) {
					Map<String, Object> scheduleMap = new HashMap<String, Object>();
					scheduleMap.put("id", schedule.getId());
					scheduleMap.put("course_id", schedule.getCourseid());
					scheduleMap.put("course_name", schedule.getCoursename());
					scheduleMap.put("instructor", schedule.getTeachername());
					scheduleMap.put("workday", schedule.getWorkday());
					scheduleMap.put("start_time",
							DateUtil.formatShorttime(schedule.getPeriodTimeDtl().getShortstarttime(), null));
					scheduleMap.put("end_time",
							DateUtil.formatShorttime(schedule.getPeriodTimeDtl().getShortendtime(), null));
					dataList.add(scheduleMap);
				}


			}

			return this.handleResult(ApiRetCodeEnum.SUCCESS, "success", dataList);
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
				dataMap.put("avatar",
						"http://" + req.getServerName() + "/pixsigdata/image/avatar/" + student.getStudentno() + ".jpg");
				dataList.add(dataMap);
			}

			return this.handleResult(ApiRetCodeEnum.SUCCESS, "success", dataList);
		} catch (Exception e) {
			logger.error("Get classroom schedules exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());

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


}
