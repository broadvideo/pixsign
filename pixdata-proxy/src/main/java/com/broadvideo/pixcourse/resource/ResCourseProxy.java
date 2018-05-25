package com.broadvideo.pixcourse.resource;

import java.net.URL;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixcourse.common.ApiRetCodeEnum;
import com.broadvideo.pixcourse.common.AppException;
import com.broadvideo.pixcourse.service.ConfigDao;
import com.broadvideo.pixcourse.vo.RoomScheduleQueryReq;
import com.broadvideo.pixcourse.vo.StudentScheduleQueryReq;
import com.broadvideo.pixcourse.vo.TeacherScheduleQueryReq;
import com.broadvideo.pixcourse.vo.WristbandScheduleQueryReq;
import com.threeoa.bigdata.web.webservice.ViewQueryDetailWS;

@Component
@Path("/api/course/")
@Produces(MediaType.APPLICATION_JSON)
public class ResCourseProxy {

	private static Logger logger = LoggerFactory.getLogger(ResCourseProxy.class);
	private static ViewQueryDetailWS _courseService = null;
	private static String serverIP = null;
	private static Integer serverPort = null;
	@Autowired
	private ConfigDao configDao;
	private final static String USERNAME = "admin";
	private final static String PASSWORD = "13B3E9DC60323BE98717EC2B27572A87";
	private final static String code = "CourseServiceURL";

	public synchronized ViewQueryDetailWS getCourseService() {
		logger.info("######Init ViewQueryDetailWS.....");
		if (_courseService == null) {
			try {
				String courseServiceURL = configDao.selectValueByCode(code);
				if (StringUtils.isBlank(courseServiceURL)) {
					logger.error("code:{} is not config.", code);
				}
				// "http://" + SERVERIP + "/big-data/viewQueryDetailWS?wsdl"
				URL url = new URL(courseServiceURL);
				serverIP = url.getHost();
				serverPort = url.getPort();
				logger.info("Parse Url({}) serverIP:{}, serverPort:{}", courseServiceURL, serverIP, serverPort);
				_courseService = new ViewQueryDetailWS(url);
				logger.info("After init Service:{}", _courseService);
			} catch (Exception e) {
				logger.error("######Load wsdl error:", e);
			}
		}
		return _courseService;
	}

	public synchronized ViewQueryDetailWS getCourseService2() {
		logger.info("######Init ViewQueryDetailWS.....");
		if (_courseService == null) {
			try {
				String courseServiceURL = configDao.selectValueByCode(code);
				if (StringUtils.isBlank(courseServiceURL)) {
					logger.error("code:{} is not config.", code);
				}
				// "http://" + SERVERIP + "/big-data/viewQueryDetailWS?wsdl"
				URL url = new URL(courseServiceURL);

				serverIP = url.getHost();
				serverPort = url.getPort();
				logger.info("Parse Url({}) serverIP:{}, serverPort:{}", courseServiceURL, serverIP, serverPort);
				_courseService = new ViewQueryDetailWS(new URL(
						"file:/C:/Users/Bensonpc/Documents/viewQueryDetailWS.xml"));
				logger.info("After init Service:{}", _courseService);
			} catch (Exception e) {
				logger.error("######Load wsdl error:", e);
			}
		}
		return _courseService;
	}

	@Path("getDataByView")
	@POST
	public Response getDataByView(String request, @Context HttpServletRequest req) {

		logger.info("getDataByView with request body:{}", request);
		String respJson = null;
		try {

			respJson = getCourseService().getViewQueryDetailPort().getDataByView(wrapAuthInfo(request));
		} catch (Exception e) {
			logger.error("Call getDataByView with request body:{}  error.", request, e);
			throw new AppException(ApiRetCodeEnum.EXCEPTION, "getDataByView error:" + e.getMessage());
		}
		checkResp(respJson);

		return Response.status(Status.OK).entity(respJson).build();
	}

	@POST
	@Path("getCurrentWeekClassScheduleByStudent")
	public Response getCurrentWeekClassScheduleByStudent(@Context HttpServletRequest req,
			StudentScheduleQueryReq scheduleQueryReq) {

		logger.info("getCurrentWeekClassScheduleByStudent with params:{}", scheduleQueryReq);
		String respJson = null;
		try {
			respJson = getCourseService().getViewQueryDetailPort().getCurrentWeekClassScheduleByStudent(USERNAME,
					PASSWORD, scheduleQueryReq.getObjectid());
		} catch (Exception e) {
			logger.error("Call getCurrentWeekClassScheduleByStudent  error.", e);
			throw new AppException(ApiRetCodeEnum.EXCEPTION, "getCurrentWeekClassScheduleByStudent error:"
					+ e.getMessage());
		}
		checkResp(respJson);

		return Response.status(Status.OK).entity(respJson).build();
	}

	@POST
	@Path("getClassScheduleForTeacher")
	public Response getClassScheduleForTeacher(@Context HttpServletRequest req, TeacherScheduleQueryReq scheduleQueryReq) {

		logger.info("getClassScheduleForTeacher with params:{}", scheduleQueryReq);
		String respJson = null;
		try {

			respJson = getCourseService().getViewQueryDetailPort().getClassScheduleForTeacher(USERNAME, PASSWORD,
					scheduleQueryReq.getObjectid(), scheduleQueryReq.getYearid(), scheduleQueryReq.getSemesterid(),
					scheduleQueryReq.getWeeknum(), scheduleQueryReq.getDayofweek(), scheduleQueryReq.getPeroidofday(),
					scheduleQueryReq.getPagesize(), scheduleQueryReq.getPageno());
		} catch (Exception e) {
			logger.error("Call getClassScheduleForTeacher  error.", e);
			throw new AppException(ApiRetCodeEnum.EXCEPTION, "getClassScheduleForTeacher error:" + e.getMessage());
		}
		checkResp(respJson);

		return Response.status(Status.OK).entity(respJson).build();
	}

	@POST
	@Path("getCurrentWeekClassScheduleByClassroom")
	public Response getClassScheduleForClassroom(@Context HttpServletRequest req, RoomScheduleQueryReq scheduleQueryReq) {

		logger.info("getClassScheduleForClassroom with params:{}", scheduleQueryReq);
		String respJson = null;
		try {
			respJson = getCourseService().getViewQueryDetailPort().getCurrentWeekClassScheduleByClassroom(USERNAME,
					PASSWORD, scheduleQueryReq.getObjectid());

		} catch (Exception e) {
			logger.error("Call getCurrentWeekClassScheduleByClassroom  error.", e);
			throw new AppException(ApiRetCodeEnum.EXCEPTION, "getCurrentWeekClassScheduleByClassroom error:"
					+ e.getMessage());
		}
		checkResp(respJson);

		return Response.status(Status.OK).entity(respJson).build();
	}

	@POST
	@Path("getCurrentWeekClassScheduleByStudentWristbandId")
	public Response getCurrentWeekClassScheduleByStudentWristbandId(@Context HttpServletRequest req,
			WristbandScheduleQueryReq scheduleQueryReq) {

		logger.info("getCurrentWeekClassScheduleByStudentWristbandId with params:{}", scheduleQueryReq);
		String respJson = null;
		try {
			respJson = getCourseService().getViewQueryDetailPort().getCurrentWeekClassScheduleByStudentWristbandId(
					USERNAME, PASSWORD, scheduleQueryReq.getObjectid());

		} catch (Exception e) {
			logger.error("Call getCurrentWeekClassScheduleByStudentWristbandId  error.", e);
			throw new AppException(ApiRetCodeEnum.EXCEPTION, "getCurrentWeekClassScheduleByStudentWristbandId error:"
					+ e.getMessage());
		}
		checkResp(respJson);

		return Response.status(Status.OK).entity(respJson).build();
	}

	@POST
	@Path("getCurrentWeekClassScheduleByTeacherWristbandId")
	public Response getCurrentWeekClassScheduleByTeacherWristbandId(@Context HttpServletRequest req,
			WristbandScheduleQueryReq scheduleQueryReq) {

		logger.info("getCurrentWeekClassScheduleByTeacherWristbandId with params:{}", scheduleQueryReq);
		String respJson = null;
		try {
			respJson = getCourseService().getViewQueryDetailPort().getCurrentWeekClassScheduleByTeacherWristbandId(
					USERNAME, PASSWORD, scheduleQueryReq.getObjectid());

		} catch (Exception e) {
			logger.error("Call getCurrentWeekClassScheduleByTeacherWristbandId  error.", e);
			throw new AppException(ApiRetCodeEnum.EXCEPTION, "getCurrentWeekClassScheduleByTeacherWristbandId error:"
					+ e.getMessage());
		}
		checkResp(respJson);

		return Response.status(Status.OK).entity(respJson).build();
	}

	@GET
	@Path("/userPicture")
	public void getUserPicture(@Context HttpServletRequest req, @Context HttpServletResponse resp,
			@QueryParam("username") String username) {

		logger.info("getUserPicture with params:{}", username);
		try {
			if (_courseService == null) {
				getCourseService();
			}

			if (serverIP.indexOf("10.30.6.101") != -1) {// 武侯走80端口
				resp.sendRedirect("http://" + serverIP + "/oa/userPicture?username=" + username);

			} else {
				resp.sendRedirect("http://" + serverIP + ":" + serverPort + "/oa/userPicture?username=" + username);
			}

			// Response.created(new
			// URI("http://10.30.6.101/oa/userPicture?username=" +
			// username)).build();

		} catch (Exception e) {
			logger.error("Call getUserPicture  error.", e);
			throw new AppException(ApiRetCodeEnum.EXCEPTION, "getUserPicture error:" + e.getMessage());
		}

	}

	private String wrapAuthInfo(String request) {

		JSONObject reqJson = JSONObject.fromObject(request);
		reqJson.put("username", USERNAME);
		reqJson.put("password", PASSWORD);
		return reqJson.toString();

	}

	private void checkResp(String resp) {

		JSONObject respJson = JSONObject.fromObject(resp);
		if (respJson.containsKey("error")) {

			throw new AppException(ApiRetCodeEnum.EXCEPTION, respJson.getString("error"));
		}

	}

}
