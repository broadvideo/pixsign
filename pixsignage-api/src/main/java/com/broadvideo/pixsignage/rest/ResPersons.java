package com.broadvideo.pixsignage.rest;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.ApiRetCodeEnum;
import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Config;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Person;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.PersonMapper;
import com.broadvideo.pixsignage.service.DeviceService;

@Component
@Path("/persons")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ResPersons extends ResBase {
	private Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private DeviceService deviceService;
	@Autowired
	private PersonMapper personMapper;
	@Autowired
	private ConfigMapper configMapper;

	@GET
	@Path("/")
	public String getPersonList(String request, @Context HttpServletRequest req,
			@QueryParam("terminal_id") String terminalid, @QueryParam("ts") Long ts) {
		if (StringUtils.isBlank(terminalid)) {
			return handleResult(ApiRetCodeEnum.INVALID_ARGS, "terminalid不允许为空");
		}
		try {
			logger.info("getPersonList for terminalid:{},ts:{}", terminalid, ts);
			Date lastupdatetime=null;
			if (ts != null && ts > 0) {
				lastupdatetime=new Date(ts);
			}
			Device device=deviceService.selectByTerminalid(terminalid);
			if(device==null){
				logger.error("Device(terminalid:{})不存在.", terminalid);
				throw new ServiceException("Device(terminalid:" + terminalid + ")不存在.");
			}
			Config config = configMapper.selectByCode("ServerIP");
			List<Person> personlist = this.personMapper.selectChangePersons(device.getOrgid(), lastupdatetime);
			long returnts = System.currentTimeMillis();
			JSONObject returnDataJson = new JSONObject();
			returnDataJson.put("ts", returnts);
			JSONArray updatedArr=new JSONArray();
			JSONArray deletedArr=new JSONArray();
			for(Person  person : personlist){
				if(GlobalFlag.VALID.equals(person.getStatus())){
					JSONObject updatedJson=new JSONObject();
					updatedJson.put("person_id",person.getPersonid());
					updatedJson.put("person_no", person.getPersonno() != null ? person.getPersonno() : "");
					updatedJson.put("name", person.getName());
					updatedJson.put("avatar", getImageUrl(config.getValue(), person.getAvatar()));
					updatedJson.put("image_url", getImageUrl(config.getValue(), person.getImageurl()));
					updatedJson.put("image_content", "");
					updatedJson.put("rfid", person.getRfid() != null ? person.getRfid() : "");
					updatedArr.put(updatedJson);
				} else if (GlobalFlag.DELETE.equals(person.getStatus())) {
					deletedArr.put(person.getPersonid());
				}
			}
			returnDataJson.put("updated_data", updatedArr);
			returnDataJson.put("deleted_data", deletedArr);

			return this.handleResult(RetCodeEnum.SUCCESS, "success", returnDataJson);
		} catch (Exception e) {

			logger.error("getPersonList exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}



}
