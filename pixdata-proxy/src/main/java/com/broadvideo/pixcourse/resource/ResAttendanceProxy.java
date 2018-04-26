package com.broadvideo.pixcourse.resource;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
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
import com.broadvideo.pixcourse.common.HttpClientUtils;
import com.broadvideo.pixcourse.common.HttpClientUtils.SimpleHttpResponse;
import com.broadvideo.pixcourse.service.ConfigDao;

@Component
@Path("/api/attendance")
@Produces(MediaType.APPLICATION_JSON)
public class ResAttendanceProxy {

	private static Logger logger = LoggerFactory.getLogger(ResAttendanceProxy.class);
	@Autowired
	private ConfigDao configDao;
	// "http://10.30.6.102:8088/ClassPlate";
	private static String _attendanceServiceUrl = null;
	private final static String code = "AttendanceServiceURL";

	public synchronized String getServiceUrl() {
		if (_attendanceServiceUrl == null) {
			_attendanceServiceUrl = configDao.selectValueByCode(code);
			if (StringUtils.isBlank(_attendanceServiceUrl)) {
				logger.error("code:{} is not config.", code);
			}
			logger.info("Fetch AttendanceServiceBase:{}", _attendanceServiceUrl);
		}
		return _attendanceServiceUrl;

	}

	@GET
	@Path("GetCurrenDayAndWeekKqReport")
	public Response getCurrenDayAndWeekKqReport(@Context HttpServletRequest req, @QueryParam("cardID") String cardID) {

		logger.info("GetCurrenDayAndWeekKqReport with cardID:{}", cardID);
		String respJson = null;

		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("cardID", cardID);
		SimpleHttpResponse response = null;
		try {
			response = HttpClientUtils.doGet(getServiceUrl() + "/" + "GetCurrenDayAndWeekKqReport", paramMap, null);
			logger.info("GetCurrenDayAndWeekKqReport resp with statuscode:{},body{}", response.getStatusCode(),
					response.getBody());
			respJson = response.getBody();
		} catch (Exception e) {
			logger.error("Call GetCurrenDayAndWeekKqReport cardID:{} error.", cardID, e);
			throw new AppException(ApiRetCodeEnum.EXCEPTION, "GetCurrenDayAndWeekKqReport:" + e.getMessage());
		}
		checkResp(respJson);
		return Response.status(Status.OK).entity(respJson).build();
	}

	@GET
	@Path("GetHistotyClassKQreportData")
	public Response GetHistotyClassKQreportData(@Context HttpServletRequest req,
			@QueryParam("lesson_id") String lessonId, @QueryParam("classroom_id") String classroomId) {

		logger.info("GetHistotyClassKQreportData with lesson_id:{},classroom_id", lessonId, classroomId);
		String respJson = null;
		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("lesson_id", lessonId);
		paramMap.put("classroom_id", classroomId);
		SimpleHttpResponse response = null;
		try {
			response = HttpClientUtils.doGet(getServiceUrl() + "/" + "GetHistotyClassKQreportData", paramMap, null);
			logger.info("GetHistotyClassKQreportData resp with statuscode:{},body{}", response.getStatusCode(),
					response.getBody());
			respJson = response.getBody();
		} catch (Exception e) {
			logger.error("Call GetHistotyClassKQreportData lessionId:{},classroomId:{} error.", lessonId, classroomId,
					e);
			throw new AppException(ApiRetCodeEnum.EXCEPTION, "GetHistotyClassKQreportData:" + e.getMessage());
		}
		checkResp(respJson);
		return Response.status(Status.OK).entity(respJson).build();
	}

	private void checkResp(String resp) {

		JSONObject respJson = JSONObject.fromObject(resp);
		if (respJson.containsKey("errorMsg")) {
			throw new AppException(ApiRetCodeEnum.EXCEPTION, respJson.getString("errorMsg"));
		}

	}
}
