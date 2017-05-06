package com.broadvideo.pixsignage.rest;

import java.io.File;
import java.io.FilenameFilter;
import java.util.Arrays;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.apache.commons.io.comparator.LastModifiedFileComparator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegrid;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicegridMapper;
import com.broadvideo.pixsignage.persistence.StaffMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Component
@Produces("application/json;charset=UTF-8")
@Path("/ctrl")
public class CtrlService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private DevicegridMapper devicegridMapper;

	// ==============================================================================
	// System Interface
	// ==============================================================================
	@GET
	@Path("login")
	@Produces("application/json;charset=UTF-8")
	public String login(@QueryParam("username") String username, @QueryParam("password") String password) {
		try {
			logger.info("Ctrl login: username={},password={}", username, password);
			Staff staff = staffMapper.login(username, password);

			if (staff != null && staff.getOrg() != null) {
				String token = CommonUtil.getMd5(username, "" + Math.random());
				staff.setToken(token);
				staffMapper.updateByPrimaryKeySelective(staff);
				JSONObject responseJson = new JSONObject();
				responseJson.put("code", 0);
				responseJson.put("message", "成功");
				JSONObject dataJson = new JSONObject();
				dataJson.put("token", token);
				responseJson.put("data", dataJson);
				logger.info("Ctrl login response: {}", responseJson.toString());
				return responseJson.toString();
			} else {
				return handleResult(1003, "登录失败");
			}
		} catch (Exception e) {
			logger.error("Ctrl login exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("devices")
	@Produces("application/json;charset=UTF-8")
	public String devices(@QueryParam("start") String start, @QueryParam("length") String length,
			@QueryParam("status") String status, @QueryParam("token") String token) {
		try {
			logger.info("Ctrl devices: start={},length={},status={},token={}", start, length, status, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			List<Device> devices = deviceMapper.selectList("" + staff.getOrgid(), "" + staff.getBranchid(), status,
					null, null, null, null, start, length, "deviceid");
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONObject dataJson = new JSONObject();
			JSONArray devicesJson = new JSONArray();
			for (Device device : devices) {
				JSONObject deviceJson = new JSONObject();
				deviceJson.put("terminal_id", device.getTerminalid());
				deviceJson.put("name", device.getName());
				deviceJson.put("status", device.getStatus());
				devicesJson.add(deviceJson);
			}
			dataJson.put("devices", devicesJson);
			responseJson.put("data", dataJson);
			logger.info("Ctrl devices response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Ctrl devices exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("devicegrids")
	@Produces("application/json;charset=UTF-8")
	public String devicegrids(@QueryParam("start") String start, @QueryParam("length") String length,
			@QueryParam("token") String token) {
		try {
			logger.info("Ctrl devicegrids: start={},length={},token={}", start, length, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			List<Devicegrid> devicegrids = devicegridMapper.selectList("" + staff.getOrgid(), "" + staff.getBranchid(),
					null, null, null, start, length);
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONObject dataJson = new JSONObject();
			JSONArray devicegridsJson = new JSONArray();
			for (Devicegrid devicegrid : devicegrids) {
				JSONObject devicegridJson = new JSONObject();
				devicegridJson.put("device_grid_id", "" + devicegrid.getDevicegridid());
				devicegridJson.put("xcount", devicegrid.getXcount());
				devicegridJson.put("ycount", devicegrid.getYcount());
				devicegridJson.put("ratio", devicegrid.getRatio());
				JSONArray devicesJson = new JSONArray();
				for (Device device : devicegrid.getDevices()) {
					JSONObject deviceJson = new JSONObject();
					deviceJson.put("terminal_id", device.getTerminalid());
					deviceJson.put("name", device.getName());
					deviceJson.put("xpos", device.getXpos());
					deviceJson.put("ypos", device.getYpos());
					deviceJson.put("status", device.getStatus());
					devicesJson.add(deviceJson);
				}
				devicegridJson.put("devices", devicesJson);
				devicegridsJson.add(devicegridJson);
			}
			dataJson.put("devicegrids", devicegridsJson);
			responseJson.put("data", dataJson);
			logger.info("Ctrl devicegrids response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Ctrl devicegrids exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("bind")
	@Produces("application/json;charset=UTF-8")
	public String bind(@QueryParam("terminal_id") String terminalid, @QueryParam("hardkey") String hardkey,
			@QueryParam("token") String token) {
		try {
			logger.info("Ctrl bind: terminal_id={},hardkey={},token={}", terminalid, hardkey, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device != null && !device.getTerminalid().equals(terminalid)) {
				device.setHardkey(null);
				device.setStatus("0");
				deviceMapper.updateByPrimaryKey(device);
			}

			device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult(1004, "无效终端号" + terminalid);
			} else if (device.getStatus().equals("1") && device.getHardkey() != null
					&& !device.getHardkey().equals(hardkey)) {
				return handleResult(1005, terminalid + "已经被别的终端注册.");
			}
			device.setHardkey(hardkey);
			device.setStatus("1");
			deviceMapper.updateByPrimaryKey(device);

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Ctrl bind response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Ctrl bind exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("unbind")
	@Produces("application/json;charset=UTF-8")
	public String unbind(@QueryParam("terminal_id") String terminalid, @QueryParam("token") String token) {
		try {
			logger.info("Ctrl unbind: terminal_id={},token={}", terminalid, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult(1004, "无效终端号" + terminalid);
			}
			device.setHardkey(null);
			device.setStatus("0");
			deviceMapper.updateByPrimaryKey(device);

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Ctrl unbind response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Ctrl unbind exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("getversion")
	@Produces("application/json;charset=UTF-8")
	public String getversion(@QueryParam("appname") String appname) {
		try {
			logger.info("Ctrl getversion: appname={}", appname);

			File dir = new File("/pixdata/pixsignage/app");
			File[] files = dir.listFiles(new FilenameFilter() {
				@Override
				public boolean accept(File dir, String name) {
					return name.startsWith(appname + "-") && name.endsWith((".apk"));
				}
			});
			Arrays.sort(files, LastModifiedFileComparator.LASTMODIFIED_REVERSE);

			String vname = "";
			String vcode = "0";
			String url = "";
			if (files.length > 0) {
				String filename = files[0].getName();
				url = "/pixsigdata/app/" + filename;
				String[] apks = filename.split("-");
				if (apks.length >= 3) {
					vname = apks[1];
					vcode = apks[2];
					if (vcode.indexOf(".") > 0) {
						vcode = vcode.substring(0, vcode.indexOf("."));
					}
				}
			}

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONObject dataJson = new JSONObject();
			dataJson.put("name", vname);
			dataJson.put("code", vcode);
			dataJson.put("url", url);
			dataJson.put("mincode", vcode);
			responseJson.put("data", dataJson);
			logger.info("Ctrl getversion response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Ctrl getversion exception, ", e);
			return handleResult(2001, "系统异常");
		}
	}

	// ==============================================================================
	// Other
	// ==============================================================================
	private String handleResult(int code, String message) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("code", code);
		responseJson.put("message", message);
		logger.info("Ctrl response: {}", responseJson.toString());
		return responseJson.toString();
	}
}
