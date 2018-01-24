package com.broadvideo.pixsignage.rest;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.domain.House;
import com.broadvideo.pixsignage.domain.House;
import com.broadvideo.pixsignage.persistence.HouseMapper;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Component
@Produces("application/json;charset=UTF-8")
@Path("/estate")
public class EstateService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private HouseMapper houseMapper;

	@GET
	@Path("list")
	@Produces("application/json;charset=UTF-8")
	public String list() {
		try {
			logger.info("Estate list");
			List<House> houses = houseMapper.selectList(null, null, null);
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONArray housesJson = new JSONArray();
			for (House house : houses) {
				JSONObject houseJson = new JSONObject();
				houseJson.put("house_id", house.getHouseid());
				houseJson.put("name", house.getName());
				if (house.getThumbnail() != null) {
					houseJson.put("thumbnail", "/pixsigdata" + house.getThumbnail());
				} else {
					houseJson.put("thumbnail", "/pixsignate/img/house.png");
				}
				houseJson.put("zip", "/pixsigdata" + house.getZip());
				houseJson.put("checksum", house.getChecksum());
				housesJson.add(houseJson);
			}
			responseJson.put("houses", housesJson);
			logger.info("Estate list response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Estate list exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	// ==============================================================================
	// Other
	// ==============================================================================
	private String handleResult(int code, String message) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("code", code);
		responseJson.put("message", message);
		logger.info("Admin response: {}", responseJson.toString());
		return responseJson.toString();
	}
}
