package com.broadvideo.pixsignage.rest;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.ApiRetCodeEnum;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.persistence.PersonMapper;
import com.broadvideo.pixsignage.persistence.StaffMapper;
import com.broadvideo.pixsignage.service.DeviceService;
import com.broadvideo.pixsignage.util.CommonUtil;

@Component
@Path("/users")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ResUsers extends ResBase {
	private Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private DeviceService deviceService;
	@Autowired
	private PersonMapper personMapper;
	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private OrgMapper orgMapper;
	@POST
	@Path("/auth")
	public String userAuth(String request, @Context HttpServletRequest req) {

		try {
			logger.info("userAuth for request body:{}", request);
			JSONObject requestJson = new JSONObject(request);
			final String username = requestJson.getString("username").trim();
			final String password = requestJson.getString("password").trim();
			logger.info("Login start, username={}, password={}, md5={}", username, password,
					CommonUtil.getPasswordMd5(username, password));
			Staff staff = staffMapper.login(username, CommonUtil.getPasswordMd5(username, password));
			if (staff == null) {
				logger.error("Login failed for username & password not match, username={}, password={}, md5={}",
						username, password, CommonUtil.getPasswordMd5(username, password));
				return this.handleResult(ApiRetCodeEnum.EXCEPTION, "用户名或密码错误.");

			}
			JSONObject dataJson=new JSONObject();
			dataJson.put("staff_id", staff.getStaffid());
			dataJson.put("name",staff.getName());
			dataJson.put("avatar","");
			Integer orgid=staff.getOrgid();
			if(orgid==null){
			   Org org = orgMapper.selectByCode("default");
				if (org == null) {
					return this.handleResult(ApiRetCodeEnum.EXCEPTION, "获取用户org异常.");

				}
				orgid = org.getOrgid();
			}
			dataJson.put("org_id", orgid);

			return this.handleResult(RetCodeEnum.SUCCESS, "success", dataJson);
		} catch (Exception e) {

			logger.error("userAuth exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}



}
