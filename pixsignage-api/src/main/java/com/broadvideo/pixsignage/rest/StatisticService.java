package com.broadvideo.pixsignage.rest;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.persistence.DeviceMapper;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Component
@Produces("application/json;charset=UTF-8")
@Path("/stat")
public class StatisticService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private DeviceMapper deviceMapper;

	@GET
	@Path("device_locations")
	@Produces("application/json;charset=UTF-8")
	public String device_locations() {
		try {
			logger.info("Stat devices");
			List<Device> devices = deviceMapper.selectList(null, null, "1", null, null, null, null, null, null, null,
					null, null, "deviceid");
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONArray locationsJson = new JSONArray();
			for (Device device : devices) {
				if (device.getLatitude().length() > 0 && device.getLongitude().length() > 0) {
					JSONObject locationJson = new JSONObject();
					locationJson.put("name", device.getName());
					locationJson.put("count", 1);
					locationJson.put("longitude", device.getLongitude());
					locationJson.put("latitude", device.getLatitude());
					locationsJson.add(locationJson);
				}
			}
			responseJson.put("locations", locationsJson);
			logger.info("Stat device_locations response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Stat device_locations exception, ", e);
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
