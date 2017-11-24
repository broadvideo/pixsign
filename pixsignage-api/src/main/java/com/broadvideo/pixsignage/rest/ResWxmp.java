package com.broadvideo.pixsignage.rest;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.service.WxMpService;
import com.broadvideo.pixsignage.service.WxmpMsgTypeHandlers;

@Component
@Path("/wxmp")
public class ResWxmp extends ResBase {
	@Autowired
	private WxMpService wxmpService;
	@Autowired
	private DeviceMapper deviceMapper;

	@GET
	@Path("/{org_id}/callback")
	public String wxmpCallbackForGet(String request, @PathParam("org_id") Integer orgid, @Context HttpServletRequest req) {

		return wxmpCallback(request, orgid, req);

	}

	@POST
	@Path("/{org_id}/callback")
	public String wxmpCallbackForPost(String request, @PathParam("org_id") Integer orgid,
			@Context HttpServletRequest req) {

		return wxmpCallback(request, orgid, req);

	}

	private String wxmpCallback(String request, Integer orgid, HttpServletRequest req) {
		try {
			logger.info("wxmpcallback with body:" + request);
			String signature = req.getParameter("signature");
			String echostr = req.getParameter("echostr");
			String timestamp = req.getParameter("timestamp");
			String nonce = req.getParameter("nonce");
			boolean isVerify = wxmpService.verifySignature(signature, timestamp, nonce, orgid);
			if (!isVerify) {
				logger.error("signature verify fail.");
				return "";
			}
			if (StringUtils.isNotBlank(echostr)) {
				logger.info("signature({}) verify success,return echostr:{}", signature, echostr);
				return echostr;
			}
			//处理其他回调时间
			return WxmpMsgTypeHandlers.doHandle(request, orgid);
	
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}




}
