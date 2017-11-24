package com.broadvideo.pixsignage.rest;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.ApiRetCodeEnum;
import com.broadvideo.pixsignage.domain.Classroom;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.service.ClassroomService;

@Component
@Path("/terminals")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ResTerminals {

	private Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private ClassroomService classroomService;
	@Autowired
	private DeviceMapper deviceMapper;

	@GET
	@Path("/{terminal_id}/classroom")
	public String getClassroomByTerminalId(@Context HttpServletRequest req, @PathParam("terminal_id") String terminalId) {
		try {
		Device device = deviceMapper.selectByTerminalid(terminalId);
		String externalId = device.getExternalid();
			if (StringUtils.isBlank(externalId)) {
				return this.handleResult(ApiRetCodeEnum.EXCEPTION, "No binding classroom.");
			}
		logger.info("terminal_id={} fetch externalid={}", terminalId, externalId);
		Classroom classroom = classroomService.loadClassroom(NumberUtils.toInt(externalId), device.getOrgid());
			if (classroom == null) {
				return this.handleResult(ApiRetCodeEnum.EXCEPTION, "classroom not found.");
			}
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", ApiRetCodeEnum.SUCCESS);
		responseJson.put("message", "success");
		JSONObject classroomJson = new JSONObject();
			classroomJson.put("id", classroom.getClassroomid());
		classroomJson.put("name", classroom.getName());
		classroomJson.put("description", classroom.getDescription());
			responseJson.put("classroom", classroomJson);

			return responseJson.toString();
		} catch (Exception ex) {
			logger.error("getClassroomByTerminalId exception.", ex);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, ex.getMessage());

		}
	}

	private String handleResult(int code, String message) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		logger.info("Terminal Service response: {}", responseJson.toString());
		return responseJson.toString();
	}

	private String handleResult(int code, String message, List<Map<String, Object>> data) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("retcode", code);
		responseJson.put("message", message);
		responseJson.put("data", data);
		logger.info("Terminal Service response: {}", responseJson.toString());
		return responseJson.toString();
	}


}
