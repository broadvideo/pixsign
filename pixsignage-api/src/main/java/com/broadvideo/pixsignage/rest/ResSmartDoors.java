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
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.ApiRetCodeEnum;
import com.broadvideo.pixsignage.common.DoorConst;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Smartbox;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.SmartboxMapper;
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
	@Autowired
	private SmartboxMapper smartboxMapper;

	@GET
	@Path("/{terminal_id}/smartbox")
	public String getSmartbox(@PathParam("terminal_id") String terminalId, @Context HttpServletRequest req) {
		logger.info("Entry req(smartbox) with terminial_id:{}", terminalId);
		if (StringUtils.isBlank(terminalId)) {
			return this.handleResult(ApiRetCodeEnum.INVALID_ARGS, "parameter(terminal_id) is empty.");
		}
		try {
			Device device = this.deviceMapper.selectByTerminalid(terminalId);
			if (device == null) {
				logger.error("Device(terminal_id:{}) not found.", terminalId);
				return this.handleResult(ApiRetCodeEnum.EXCEPTION, "terminal_id is not found.");
			}
			Smartbox smartbox = this.smartboxMapper.selectByTerminalid(terminalId, device.getOrgid());
			if (smartbox == null) {
				logger.error("terminal_id({}) not bind smartbox.", terminalId);
				JSONObject dataJson = new JSONObject();
				dataJson.put("terminal_id", terminalId);
				dataJson.put("door_version", DoorConst.DoorVersion.VERSION_UNKOWN.getVal());
				dataJson.put("stock_num", 0);
				return this.handleResult(ApiRetCodeEnum.SUCCESS, "success", dataJson);
			}
			JSONObject dataJson = new JSONObject();
			dataJson.put("terminal_id", smartbox.getTerminalid());
			dataJson.put("door_version", smartbox.getDoorversion());
			dataJson.put("stock_num", smartbox.getStocknum());
			return this.handleResult(ApiRetCodeEnum.SUCCESS, "success", dataJson);
		} catch (Exception ex) {
			logger.error("getSmartbox exception:", ex);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, ex.getMessage());

		}
	}

	@GET
	@Path("/{terminal_id}/door_authorize_state")
	public String getDoorAuthorizeState(@PathParam("terminal_id") String terminalId, @Context HttpServletRequest req) {
		logger.info("Entry req(door_authorize_state) with terminial_id:{}", terminalId);
		if (StringUtils.isBlank(terminalId)) {

			return this.handleResult(ApiRetCodeEnum.INVALID_ARGS, "parameter(terminal_id) is empty.");

		}
		try {
			JSONArray dataArr = smartdoorkeeperService.getDoorAuthorizeState(terminalId);
			Device device = this.deviceMapper.selectByTerminalid(terminalId);
			Smartbox smartbox = this.smartboxMapper.selectByTerminalid(terminalId, device.getOrgid());
			if (smartbox != null && DoorConst.DoorVersion.VERSION_2.getVal().equals(smartbox.getDoorversion())) {
				JSONArray newDataArr = new JSONArray();
				newDataArr.put(dataArr.getJSONObject(0));
				return this.handleResult(ApiRetCodeEnum.SUCCESS, "success", newDataArr);
			}

			return this.handleResult(ApiRetCodeEnum.SUCCESS, "success", dataArr);
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
			// v2版本字段
			Integer stocknum = requestJson.optInt("stock_num", 0);
			String extra = requestJson.optString("extra");
			TerminalBinding binding = smartdoorkeeperService.getBindingByTermminalid(terminalId);
			if (binding == null) {
				logger.error("No binding for terminalid({})", terminalId);
				return this.handleResult(ApiRetCodeEnum.EXCEPTION, "No binding.");

			}
			if (DoorConst.DoorVersion.VERSION_2.getVal().equals(binding.getDoorversion())) {

				smartdoorkeeperService.doorStateCallback(terminalId, doorType, actionType, state, stocknum, extra);

			} else {
				boolean isBinding = smartdoorkeeperService.isAuthorizedBinding(terminalId, doorType);
				if (!isBinding) {
					logger.error(
							"No Authorize binding:Invalid request(report_door_state) for terminalid({}),doorType({})",
							terminalId, doorType);
					return this.handleResult(ApiRetCodeEnum.EXCEPTION, "Report State Not found Authorized binding.");
				}
				smartdoorkeeperService.doorStateCallback(terminalId, doorType, actionType, state);

			}
			return this.handleResult(ApiRetCodeEnum.SUCCESS, "");
		} catch (Exception ex) {
			logger.error("reportDoorState exception:", ex);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, ex.getMessage());

		}
	}
}
