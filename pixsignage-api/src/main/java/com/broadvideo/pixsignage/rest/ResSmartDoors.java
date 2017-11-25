package com.broadvideo.pixsignage.rest;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.ApiRetCodeEnum;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.service.SmartdoorkeeperService;
import com.broadvideo.pixsignage.vo.TerminalBinding;

@Component
@Path("/terminals")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ResSmartDoors extends ResBase {
	@Autowired
	private DeviceMapper deviceMapper;
	@Resource(name = "smartdoorkeeperService")
	private SmartdoorkeeperService smartdoorkeeperService;

	@GET
	@Path("/{terminal_id}/door_authorize_state")
	public String getDoorAuthorizeState(@PathParam("terminal_id") String terminalId,
			@Context HttpServletRequest req) {
		logger.info("Entry req(door_authorize_state) with terminial_id:{}", terminalId);
		if (StringUtils.isBlank(terminalId)) {

			return this.handleResult(ApiRetCodeEnum.INVALID_ARGS, "parameter(terminal_id) is empty.");

		}
		try {
			JSONObject resultData = smartdoorkeeperService.getDoorAuthorizeState(terminalId);
			return this.handleResult(ApiRetCodeEnum.SUCCESS, "success", resultData);
		} catch (Exception ex) {
			logger.error("getDoorAuthorizeState exception:", ex);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, ex.getMessage());

		}
	}

	@POST
	@Path("/{terminal_id}/report_door_state")
	public String reportDoorState(String request, @Context HttpServletRequest req,
			@PathParam("terminal_id") String terminalId) {
		logger.info("Entry req(report_door_state) with terminal_id:{},bodyJson:{}", terminalId, request);
		if (StringUtils.isBlank(terminalId)) {
			logger.info("terminalId({}) is null", terminalId);
			return handleResult(ApiRetCodeEnum.INVALID_ARGS, "parameter(terminal_id) is empty.");
		}
		try {
		JSONObject requestJson = new JSONObject(request);
		String doorType = requestJson.getString("door_type");
		String actionType = requestJson.optString("action_type");
		String state = requestJson.optString("state");
		TerminalBinding binding = smartdoorkeeperService.getAuthorizedBinding(terminalId);
		if (binding == null || !binding.getDoortype().equals(doorType)) {
			logger.error("Invalid request for doorType({})and  binding({})", doorType, binding);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, "Invalid binding.");
		}
		smartdoorkeeperService.doorStateCallback(terminalId, actionType, state);
		return this.handleResult(ApiRetCodeEnum.SUCCESS, "");
		} catch (Exception ex) {
			logger.error("reportDoorState exception:", ex);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, ex.getMessage());

		}
	}



}
