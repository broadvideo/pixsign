package com.broadvideo.pixsignage.rest;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.ApiRetCodeEnum;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.service.DeviceService;
import com.broadvideo.pixsignage.service.WxMpService;
import com.broadvideo.pixsignage.vo.MpQRCode;

@Component
@Path("/qrcodes")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ResQRCodes extends ResBase {

	@Resource(name = "wxmpservice")
	private WxMpService wxmpService;
	@Autowired
	private DeviceService deviceService;

	@POST
	@Path("/wxmp_qrcode")
	public String getWxmpQRCode(String request, @Context HttpServletRequest req,
			@QueryParam("terminal_id") String terminalId) {
		if (StringUtils.isBlank(terminalId)) {
			return handleResult(ApiRetCodeEnum.INVALID_ARGS, "parameter(terminal_id) is empty.");
		}
		try {
			logger.info("GetWxmpQRCode with terminalId:{}", terminalId);
			Device device=deviceService.selectByTerminalid(terminalId);
			if(device==null){
				return handleResult(ApiRetCodeEnum.TERMINAL_NOT_FOUND, "terminal_id:"+terminalId+"not found.");
			}
			try {
				MpQRCode mpqrcode = wxmpService.getQRCode(terminalId, device.getOrgid());
				Map<String, Object> dataMap = new HashMap<String, Object>();
				dataMap.put("url", mpqrcode.getUrl());
				return handleResult(ApiRetCodeEnum.SUCCESS, "", dataMap);
			} catch (Exception ex) {
				logger.error("getWxmpQRCode exception", ex);
				return handleResult(ApiRetCodeEnum.EXCEPTION, ex.getMessage());

			}

		} catch (Exception e) {

			logger.error("getWxmpQRCode exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}





}
