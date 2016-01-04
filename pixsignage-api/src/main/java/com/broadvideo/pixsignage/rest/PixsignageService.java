package com.broadvideo.pixsignage.rest;

import java.io.File;
import java.io.FilenameFilter;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

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
import com.broadvideo.pixsignage.persistence.CrashreportMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicefileMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.service.LayoutscheduleService;
import com.broadvideo.pixsignage.service.RegionscheduleService;

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
	private DevicefileMapper devicefileMapper;
	@Autowired
	private CrashreportMapper crashreportMapper;

	@Autowired
	private LayoutscheduleService layoutscheduleService;
	@Autowired
	private RegionscheduleService regionscheduleService;

	@POST
	@Path("init")
	public String init(String request) {
		try {
			logger.info("Pixsignage Service init: {}", request);
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			String ip = requestJson.getString("ip");
			String mac = requestJson.getString("mac");
			String version = requestJson.getString("version");

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
			}

			responseJson.put("power_flag", org.getPowerflag());
			if (org.getPowerflag().equals("1")) {
				responseJson.put("power_on_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweron()));
				responseJson.put("power_off_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweron()));
			}

			logger.info("Pixsignage Service init response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			e.printStackTrace();
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
			e.printStackTrace();
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
				responseJson = layoutscheduleService.generateLayoutScheduleJson("2", "" + device.getDevicegroupid());
			} else {
				responseJson = layoutscheduleService.generateLayoutScheduleJson("1", "" + device.getDeviceid());
			}
			responseJson.put("code", 0).put("message", "成功");
			logger.info("Pixsignage Service get_layout response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			e.printStackTrace();
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
				responseJson = regionscheduleService.generateRegionScheduleJson("2", "" + device.getDevicegroupid(),
						"" + regionid);
			} else {
				responseJson = regionscheduleService.generateRegionScheduleJson("1", "" + device.getDeviceid(),
						"" + regionid);
			}
			responseJson.put("code", 0).put("message", "成功");

			logger.info("Pixsignage Service get_region response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			e.printStackTrace();
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

			device.setOnlineflag("1");
			device.setRefreshtime(Calendar.getInstance().getTime());
			deviceMapper.updateByPrimaryKeySelective(device);

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
			return responseJson.toString();
		} catch (Exception e) {
			e.printStackTrace();
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
					Devicefile devicefile = devicefileMapper.selectByDeviceMedia("" + device.getDeviceid(), "1",
							"" + id);
					if (devicefile != null) {
						devicefile.setProgress(progress);
						devicefile.setStatus(status);
						devicefile.setDescription(desc);
						devicefile.setUpdatetime(Calendar.getInstance().getTime());
						devicefileMapper.updateByPrimaryKeySelective(devicefile);
					}
				} else if (type.equals("image")) {
					Devicefile devicefile = devicefileMapper.selectByDeviceMedia("" + device.getDeviceid(), "2",
							"" + id);
					if (devicefile != null) {
						devicefile.setProgress(progress);
						devicefile.setStatus(status);
						devicefile.setDescription(desc);
						devicefile.setUpdatetime(Calendar.getInstance().getTime());
						devicefileMapper.updateByPrimaryKeySelective(devicefile);
					}
				}
			}

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
			return responseJson.toString();
		} catch (Exception e) {
			e.printStackTrace();
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
			e.printStackTrace();
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
