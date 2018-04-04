package com.broadvideo.pixsignage.rest;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.ApiRetCodeEnum;
import com.broadvideo.pixsignage.domain.Config;
import com.broadvideo.pixsignage.persistence.ConfigMapper;

@Component
@Path("/configs")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ResConfigs extends ResBase {
	private Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private ConfigMapper configMapper;

	@GET
	@Path("/getConfig")
	public String getConfig(String request, @Context HttpServletRequest req, @QueryParam("code") String code) {

		try {
			logger.info("getConfig for code:{}", code);
			Config config = this.configMapper.selectByCode(code);
			JSONObject data = new JSONObject();
			if (config != null) {
				data.put("code", code);
				data.put("value", config.getValue());
			}
			return this.handleResult(ApiRetCodeEnum.SUCCESS, "", data);
		} catch (Exception e) {

			logger.error("getConfig exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}
}
