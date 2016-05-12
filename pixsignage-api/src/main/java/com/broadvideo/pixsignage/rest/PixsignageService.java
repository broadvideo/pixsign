package com.broadvideo.pixsignage.rest;

import java.io.File;
import java.io.FilenameFilter;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;

import org.apache.commons.io.comparator.LastModifiedFileComparator;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Crashreport;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicefile;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Weather;
import com.broadvideo.pixsignage.persistence.CrashreportMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.service.BundleService;
import com.broadvideo.pixsignage.service.DevicefileService;
import com.broadvideo.pixsignage.service.WeatherService;
import com.broadvideo.pixsignage.util.ipparse.IPSeeker;

@Component
@Consumes("application/json;charset=UTF-8")
@Produces("application/json;charset=UTF-8")
@Path("/v1.0")
public class PixsignageService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private CrashreportMapper crashreportMapper;

	@Autowired
	private BundleService bundleService;
	@Autowired
	private DevicefileService devicefileService;
	@Autowired
	private WeatherService weatherService;

	@POST
	@Path("init")
	public String init(String request, @Context HttpServletRequest req) {
		try {
			logger.info("Pixsignage Service init: {}, from {}, {}", request, req.getRemoteAddr(), req.getRemoteHost());
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			String mac = requestJson.getString("mac");
			String version = requestJson.getString("version");
			String ip = req.getRemoteAddr();

			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult(1003, "终端号不能为空");
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

			IPSeeker ipseeker = new IPSeeker("qqwry.dat", "/opt/pix/conf");
			String location = ipseeker.getArea(ip);
			int index1 = location.indexOf("省");
			int index2 = location.indexOf("市");
			if (index2 < 0) {
				index2 = location.length();
			}
			if (index1 >= 0 && index1 < index2) {
				index1 = index1 + "省".length();
			} else {
				index1 = 0;
			}
			String city = location.substring(index1, index2);
			if (!city.equals("对方和您在同一内部网")) {
				device.setCity(city);
			}

			if (!device.getStatus().equals("1")) {
				device.setActivetime(Calendar.getInstance().getTime());
			}
			device.setHardkey(hardkey);
			device.setIp(ip);
			device.setMac(mac);
			device.setVersion(version);
			device.setStatus("1");
			device.setSchedulestatus("0");
			device.setFilestatus("0");
			device.setOnlineflag("1");
			device.setType("1");
			device.setRefreshtime(Calendar.getInstance().getTime());
			deviceMapper.updateByPrimaryKey(device);

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
			responseJson.put("msg_server", CommonConfig.CONFIG_SERVER_IP + ":1883");
			JSONArray topicJsonArray = new JSONArray();
			responseJson.put("msg_topic", topicJsonArray);
			topicJsonArray.put("device-" + device.getDeviceid());
			if (device.getDevicegroup() != null) {
				topicJsonArray.put("group-" + device.getDevicegroup().getDevicegroupid());
			}

			Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
			if (org.getBackupvideo() != null) {
				JSONObject backupvideoJson = new JSONObject();
				// backupvideoJson.put("type", "video");
				backupvideoJson.put("id", org.getBackupvideoid());
				backupvideoJson.put("url", "http://" + CommonConfig.CONFIG_SERVER_IP + ":"
						+ CommonConfig.CONFIG_SERVER_PORT + "/pixsigdata" + org.getBackupvideo().getFilepath());
				backupvideoJson.put("file", org.getBackupvideo().getFilename());
				backupvideoJson.put("size", org.getBackupvideo().getSize());
				responseJson.put("backup_media", backupvideoJson);
			} else {
				Org defaultOrg = orgMapper.selectByPrimaryKey("1");
				if (defaultOrg.getBackupvideo() != null) {
					JSONObject backupvideoJson = new JSONObject();
					// backupvideoJson.put("type", "video");
					backupvideoJson.put("id", defaultOrg.getBackupvideoid());
					backupvideoJson.put("url",
							"http://" + CommonConfig.CONFIG_SERVER_IP + ":" + CommonConfig.CONFIG_SERVER_PORT
									+ "/pixsigdata" + defaultOrg.getBackupvideo().getFilepath());
					backupvideoJson.put("file", defaultOrg.getBackupvideo().getFilename());
					backupvideoJson.put("size", defaultOrg.getBackupvideo().getSize());
					responseJson.put("backup_media", backupvideoJson);
				}
			}

			responseJson.put("power_flag", Integer.parseInt(org.getPowerflag()));
			if (org.getPowerflag().equals("1")) {
				responseJson.put("power_on_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweron()));
				responseJson.put("power_off_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweroff()));
			}

			responseJson.put("password", org.getDevicepass());

			logger.info("Pixsignage Service init response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service init exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("get_version")
	public String getversion(String request) {
		try {
			logger.info("Pixsignage Service get_version: {}", request);
			File dir = new File("/opt/pixdata/app");
			File[] files = dir.listFiles(new FilenameFilter() {
				@Override
				public boolean accept(File dir, String name) {
					return name.startsWith("DigitalBox-") && name.endsWith((".apk"));
				}
			});
			Arrays.sort(files, LastModifiedFileComparator.LASTMODIFIED_REVERSE);

			String vname = "";
			String vcode = "0";
			String url = "";
			if (files.length > 0) {
				String filename = files[0].getName();
				url = "http://" + CommonConfig.CONFIG_SERVER_IP + ":" + CommonConfig.CONFIG_SERVER_PORT
						+ "/pixdata/app/" + filename;
				String[] apks = filename.split("-");
				if (apks.length >= 3) {
					vname = apks[1];
					vcode = apks[2];
					if (vcode.indexOf(".") > 0) {
						vcode = vcode.substring(0, vcode.indexOf("."));
					}
				}
			}

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
			responseJson.put("version_name", vname);
			responseJson.put("version_code", vcode);
			responseJson.put("url", url);
			logger.info("Pixsignage Service get_version response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service get_version exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("get_bundle")
	public String getbundle(String request) {
		try {
			logger.info("Pixsignage Service get_bundle: {}", request);
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult(1003, "终端号不能为空");
			}
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult(1004, "无效终端号" + terminalid);
			} else if (!device.getStatus().equals("1") || !device.getHardkey().equals(hardkey)) {
				return handleResult(1006, "硬件码和终端号不匹配");
			}

			JSONObject responseJson;
			if (device.getDevicegroupid() > 0) {
				responseJson = bundleService.generateBundleScheduleJson("2", "" + device.getDevicegroupid());
				devicefileService.refreshDevicefiles("2", "" + device.getDevicegroupid());
			} else {
				responseJson = bundleService.generateBundleScheduleJson("1", "" + device.getDeviceid());
				devicefileService.refreshDevicefiles("1", "" + device.getDeviceid());
			}
			responseJson.put("code", 0).put("message", "成功");
			logger.info("Pixsignage Service get_bundle response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service get_bundle exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("get_layout")
	public String getlayout(String request) {
		try {
			logger.info("Pixsignage Service get_layout: {}", request);
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult(1003, "终端号不能为空");
			}
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult(1004, "无效终端号" + terminalid);
			} else if (!device.getStatus().equals("1") || !device.getHardkey().equals(hardkey)) {
				return handleResult(1006, "硬件码和终端号不匹配");
			}

			JSONObject responseJson;
			if (device.getDevicegroupid() > 0) {
				responseJson = bundleService.generateBundleLayoutJson("2", "" + device.getDevicegroupid());
				devicefileService.refreshDevicefiles("2", "" + device.getDevicegroupid());
			} else {
				responseJson = bundleService.generateBundleLayoutJson("1", "" + device.getDeviceid());
				devicefileService.refreshDevicefiles("1", "" + device.getDeviceid());
			}
			responseJson.put("code", 0).put("message", "成功");
			logger.info("Pixsignage Service get_layout response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service get_layout exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("get_region")
	public String getregion(String request) {
		try {
			logger.info("Pixsignage Service get_region: {}", request);
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			int regionid = requestJson.getInt("region_id");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult(1003, "终端号不能为空");
			}
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult(1004, "无效终端号" + terminalid);
			} else if (!device.getStatus().equals("1") || !device.getHardkey().equals(hardkey)) {
				return handleResult(1006, "硬件码和终端号不匹配");
			}
			if (regionid == 0) {
				return handleResult(1007, "无效region_id");
			}

			JSONObject responseJson;
			if (device.getDevicegroupid() > 0) {
				responseJson = bundleService.generateBundleRegionJson("2", "" + device.getDevicegroupid(),
						"" + regionid);
			} else {
				responseJson = bundleService.generateBundleRegionJson("1", "" + device.getDeviceid(), "" + regionid);
			}
			responseJson.put("code", 0).put("message", "成功");

			logger.info("Pixsignage Service get_region response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service get_region exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_status")
	public String reportstatus(String request) {
		try {
			logger.info("Pixsignage Service report_status: {}", request);
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			String status = requestJson.getString("status");
			JSONObject locationJson = requestJson.getJSONObject("location");

			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult(1003, "终端号不能为空");
			}
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult(1004, "无效终端号" + terminalid);
			} else if (!device.getStatus().equals("1") || !device.getHardkey().equals(hardkey)) {
				return handleResult(1006, "硬件码和终端号不匹配");
			}

			if (locationJson != null) {
				String latitude = locationJson.getString("latitude");
				String lontitude = locationJson.getString("lontitude");
				String city = locationJson.getString("city");
				String addr1 = locationJson.getString("addr");
				String addr2 = locationJson.getString("desc");
				device.setLatitude(latitude);
				device.setLontitude(lontitude);
				if (city != null && city.length() > 0) {
					int index = city.indexOf("市");
					if (index > 0) {
						city = city.substring(0, index);
					}
					device.setCity(city);
				}
				device.setAddr1(addr1);
				device.setAddr2(addr2);
			}

			device.setOnlineflag("1");
			device.setRefreshtime(Calendar.getInstance().getTime());
			deviceMapper.updateByPrimaryKeySelective(device);

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service report_status exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_file")
	public String reportfile(String request) {
		try {
			logger.info("Pixsignage Service report_file: {}", request);
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult(1003, "终端号不能为空");
			}
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult(1004, "无效终端号" + terminalid);
			} else if (!device.getStatus().equals("1") || !device.getHardkey().equals(hardkey)) {
				return handleResult(1006, "硬件码和终端号不匹配");
			}

			JSONArray fileJsonArray = requestJson.getJSONArray("files");
			for (int i = 0; i < fileJsonArray.length(); i++) {
				JSONObject fileJson = fileJsonArray.getJSONObject(i);
				String type = fileJson.getString("type");
				int id = fileJson.getInt("id");
				int progress = fileJson.getInt("progress");
				String status = fileJson.getString("status");
				String desc = fileJson.getString("desc");
				if (type.equals("video")) {
					Devicefile devicefile = devicefileService.selectByDeviceMedia("" + device.getDeviceid(), "1",
							"" + id);
					if (devicefile != null) {
						devicefile.setProgress(progress);
						devicefile.setStatus(status);
						devicefile.setDescription(desc);
						devicefile.setUpdatetime(Calendar.getInstance().getTime());
						devicefileService.updateDevicefile(devicefile);
					}
				} else if (type.equals("image")) {
					Devicefile devicefile = devicefileService.selectByDeviceMedia("" + device.getDeviceid(), "2",
							"" + id);
					if (devicefile != null) {
						devicefile.setProgress(progress);
						devicefile.setStatus(status);
						devicefile.setDescription(desc);
						devicefile.setUpdatetime(Calendar.getInstance().getTime());
						devicefileService.updateDevicefile(devicefile);
					}
				}
			}

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service report_file exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_crash")
	public String reportcrash(String request) {
		try {
			logger.info("Pixsignage Service report_crash: {}", request);
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			String clientip = requestJson.getString("client_ip");
			String clientname = requestJson.getString("client_name");
			String os = requestJson.getString("os");
			String appname = requestJson.getString("app_name");
			String vname = requestJson.getString("version_name");
			String vcode = requestJson.getString("version_code");
			String stack = requestJson.getString("stack");
			String resolution = requestJson.getString("resolution");
			String other = requestJson.getString("other");

			Crashreport crashreport = new Crashreport();
			crashreport.setHardkey(hardkey);
			crashreport.setTerminalid(terminalid);
			crashreport.setClientip(clientip);
			crashreport.setClientname(clientname);
			crashreport.setOs(os);
			crashreport.setAppname(appname);
			crashreport.setVname(vname);
			crashreport.setVcode(vcode);
			crashreport.setStack(stack);
			crashreport.setResolution(resolution);
			crashreport.setOther(other);
			crashreportMapper.insertSelective(crashreport);

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service report_crash exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("get_weather")
	@Produces("application/json;charset=UTF-8")
	public String get_weather(@QueryParam("hardkey") String hardkey, @QueryParam("terminal_id") String terminalid,
			@QueryParam("city") String city) {
		try {
			logger.info("Pixsignage Service get_weather: hardkey={},terminal_id={},city={}", hardkey, terminalid, city);

			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null || !device.getStatus().equals("1")) {
				return handleResult(1004, "无效终端号" + terminalid);
			}
			if (city == null || city.length() == 0) {
				city = device.getCity();
			}
			if (city == null || city.length() == 0) {
				return handleResult(1008, "无效城市");
			}

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
			Weather weather = weatherService.selectByCity(city);
			responseJson.put("weather", new JSONObject(weather.getWeather()));
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service get_weather exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	private String handleResult(int code, String message) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("code", code);
		responseJson.put("message", message);
		logger.info("Pixsignage Service response: {}", responseJson.toString());
		return responseJson.toString();
	}

}
