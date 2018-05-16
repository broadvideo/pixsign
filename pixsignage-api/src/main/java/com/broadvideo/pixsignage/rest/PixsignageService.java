package com.broadvideo.pixsignage.rest;

import java.io.File;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.io.FileUtils;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Appfile;
import com.broadvideo.pixsignage.domain.Crashreport;
import com.broadvideo.pixsignage.domain.Debugreport;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicefile;
import com.broadvideo.pixsignage.domain.Devicefilehis;
import com.broadvideo.pixsignage.domain.Dvb;
import com.broadvideo.pixsignage.domain.Hourflowlog;
import com.broadvideo.pixsignage.domain.Onlinelog;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Schedule;
import com.broadvideo.pixsignage.domain.Weather;
import com.broadvideo.pixsignage.persistence.AppfileMapper;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.CrashreportMapper;
import com.broadvideo.pixsignage.persistence.DebugreportMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicefilehisMapper;
import com.broadvideo.pixsignage.persistence.DvbMapper;
import com.broadvideo.pixsignage.persistence.HourflowlogMapper;
import com.broadvideo.pixsignage.persistence.OnlinelogMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.service.DevicefileService;
import com.broadvideo.pixsignage.service.ScheduleService;
import com.broadvideo.pixsignage.service.WeatherService;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.EduCloudUtil;
import com.broadvideo.pixsignage.util.PixedxUtil;
import com.broadvideo.pixsignage.util.ipparse.IPSeeker;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Component
@Consumes("application/json;charset=UTF-8")
@Produces("application/json;charset=UTF-8")
@Path("/v1.0")
public class PixsignageService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private AppfileMapper appfileMapper;
	@Autowired
	private OnlinelogMapper onlinelogMapper;
	@Autowired
	private DvbMapper dvbMapper;
	@Autowired
	private CrashreportMapper crashreportMapper;
	@Autowired
	private DebugreportMapper debugreportMapper;
	@Autowired
	private HourflowlogMapper hourflowlogMapper;
	@Autowired
	private DevicefilehisMapper devicefilehisMapper;

	@Autowired
	private ScheduleService scheduleService;
	@Autowired
	private DevicefileService devicefileService;
	@Autowired
	private WeatherService weatherService;

	@POST
	@Path("init")
	public String init(String request, @Context HttpServletRequest req) {
		try {
			logger.info("Pixsignage Service init: {}, from {}, {}", request, req.getRemoteAddr(), req.getRemoteHost());
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
			String mac = requestJson.optString("mac");
			String iip = requestJson.optString("ip");
			String ostype = requestJson.optString("os_type");
			if (ostype.equals("windows")) {
				ostype = "2";
			} else if (ostype.equals("linux")) {
				ostype = "3";
			} else {
				ostype = "1";
			}
			String appname = requestJson.optString("app_name");
			String sign = requestJson.optString("sign");
			String version = requestJson.optString("version");
			String vname = requestJson.optString("version_name");
			int vcode = requestJson.optInt("version_code");
			String ip = req.getRemoteAddr();
			String other = requestJson.optString("other");
			String boardinfo = "";
			if (requestJson.optJSONObject("boardinfo") != null) {
				boardinfo = requestJson.optJSONObject("boardinfo").toString();
			}

			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult(1003, "终端号不能为空");
			}

			String mtype = null;
			if (sign != null) {
				if (sign.startsWith("win") || sign.equals("linux")) {
					mtype = sign;
				} else {
					mtype = CommonConfig.CONFIG_SIGNATURE.get(sign);
				}
			}
			if (mtype == null) {
				mtype = "debug";
			}

			Device device = deviceMapper.selectByHardkey(hardkey);
			String oldhardkey = hardkey;
			if (device != null && !device.getTerminalid().equals(terminalid)) {
				logger.info("unbind old device {} for the same hardkey {}", device.getTerminalid(), hardkey);
				deviceMapper.unbind("" + device.getDeviceid());
			}
			if (device == null) {
				int index = hardkey.indexOf("-");
				if (index > 0) {
					oldhardkey = hardkey.substring(0, index);
				}
			}

			device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult(1004, "无效终端号" + terminalid);
			} else if (device.getStatus().equals("1") && device.getHardkey() != null
					&& !device.getHardkey().equals(hardkey) && !device.getHardkey().equals(oldhardkey)) {
				return handleResult(1005, terminalid + "已经被别的终端注册.");
			} else if (other != null && device.getOther().length() > 0 && !device.getOther().equals(other)) {
				return handleResult(1007, terminalid + "登录位置不符，已经锁定.");
			}

			Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
			String maxdetail = org.getMaxdetail();
			String[] maxs = maxdetail.split(",");
			int max1 = Integer.parseInt(maxs[0]);
			int max2 = Integer.parseInt(maxs[1]);
			int max3 = Integer.parseInt(maxs[2]);
			int max4 = Integer.parseInt(maxs[3]);
			int max5 = Integer.parseInt(maxs[4]);
			int max6 = Integer.parseInt(maxs[5]);
			if (appname.startsWith("DigitalBox_") && !appname.equals("DigitalBox_LAUNCHER_UWIN")) {
				// 单面屏
				int currentDevices = deviceMapper.selectMaxCount1("" + device.getOrgid());
				if (!device.getStatus().equals("1") && currentDevices >= max1) {
					return handleResult(1010, "Android单面屏授权数已达上限.");
				}
			} else if (appname.equals("DigitalBox_LAUNCHER_UWIN")) {
				// 双面屏
				int currentDevices = deviceMapper.selectMaxCount2("" + device.getOrgid());
				if (!device.getStatus().equals("1") && currentDevices >= max2) {
					return handleResult(1010, "Android双面屏授权数已达上限.");
				}
			} else if (appname.startsWith("DigitalBox2_")) {
				// H5标牌
				int currentDevices = deviceMapper.selectMaxCount3("" + device.getOrgid());
				if (!device.getStatus().equals("1") && currentDevices >= max3) {
					return handleResult(1010, "Android H5标牌授权数已达上限.");
				}
			} else if (appname.startsWith("TeaTable_")) {
				// 茶几
				int currentDevices = deviceMapper.selectMaxCount4("" + device.getOrgid());
				if (!device.getStatus().equals("1") && currentDevices >= max4) {
					return handleResult(1010, "Android茶几终端授权数已达上限.");
				}
			} else if (appname.startsWith("PixMultiSign")) {
				// 联屏
				int currentDevices = deviceMapper.selectMaxCount5("" + device.getOrgid());
				if (!device.getStatus().equals("1") && currentDevices >= max5) {
					return handleResult(1010, "Android联屏终端授权数已达上限.");
				}
			} else if (ostype.equals("2")) {
				// windows
				int currentDevices = deviceMapper.selectMaxCount6("" + device.getOrgid());
				if (!device.getStatus().equals("1") && currentDevices >= max6) {
					return handleResult(1010, "Windows终端授权数已达上限.");
				}
			}

			try {
				IPSeeker ipseeker = new IPSeeker("qqwry.dat", "/opt/pix/conf");
				String location = ipseeker.getCountry(ip);
				logger.info("Get the location from {}: {}", ip, location);
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
				if (!city.equals("局域网")) {
					device.setCity(city);
				}
			} catch (Exception e) {
				logger.error("Pixsignage Service ip seek exception", e);
			}

			if (!device.getStatus().equals("1")) {
				device.setActivetime(Calendar.getInstance().getTime());
			}
			device.setHardkey(hardkey);
			device.setIp(ip);
			device.setIip(iip);
			device.setMac(mac);
			device.setOstype(ostype);
			device.setAppname(appname);
			device.setSign(sign);
			if (version.length() > 0) {
				device.setVname(version);
			} else if (vname.length() > 0) {
				device.setVname(vname);
				device.setVcode(vcode);
			}
			device.setMtype(mtype);
			device.setBoardinfo(boardinfo);
			device.setStatus("1");
			device.setSchedulestatus("0");
			device.setFilestatus("0");
			device.setOnlineflag("1");
			device.setType("1");
			device.setRefreshtime(Calendar.getInstance().getTime());
			deviceMapper.updateByPrimaryKey(device);

			onlinelogMapper.updateLast2Offline("" + device.getDeviceid());
			Onlinelog onlinelog = new Onlinelog();
			onlinelog.setOrgid(device.getOrgid());
			onlinelog.setBranchid(device.getBranchid());
			onlinelog.setDeviceid(device.getDeviceid());
			onlinelog.setOnlinetime(Calendar.getInstance().getTime());
			onlinelogMapper.insertSelective(onlinelog);

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			responseJson.put("terminalid", device.getTerminalid());
			responseJson.put("msg_server", configMapper.selectValueByCode("ServerIP") + ":1883");
			JSONArray topicJsonArray = new JSONArray();
			topicJsonArray.add("device-" + device.getDeviceid());
			if (device.getDevicegroupid() > 0) {
				topicJsonArray.add("group-" + device.getDevicegroupid());
			}
			topicJsonArray.add("org-" + device.getOrgid());
			responseJson.put("msg_topic", topicJsonArray);

			if (org.getBackupvideo() != null) {
				JSONObject backupvideoJson = new JSONObject();
				// backupvideoJson.put("type", "video");
				backupvideoJson.put("id", org.getBackupvideoid());
				backupvideoJson.put("url",
						"http://" + configMapper.selectValueByCode("ServerIP") + ":"
								+ configMapper.selectValueByCode("ServerPort") + "/pixsigdata"
								+ org.getBackupvideo().getFilepath());
				backupvideoJson.put("path", "/pixsigdata" + org.getBackupvideo().getFilepath());
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
							"http://" + configMapper.selectValueByCode("ServerIP") + ":"
									+ configMapper.selectValueByCode("ServerPort") + "/pixsigdata"
									+ defaultOrg.getBackupvideo().getFilepath());
					backupvideoJson.put("path", "/pixsigdata" + defaultOrg.getBackupvideo().getFilepath());
					backupvideoJson.put("file", defaultOrg.getBackupvideo().getFilename());
					backupvideoJson.put("size", defaultOrg.getBackupvideo().getSize());
					responseJson.put("backup_media", backupvideoJson);
				}
			}

			if (device.getVolumeflag().equals("0")) {
				responseJson.put("volume", -1);
			} else if (device.getVolumeflag().equals("1")) {
				responseJson.put("volume", device.getVolume());
			} else {
				if (org.getVolumeflag().equals("0")) {
					responseJson.put("volume", -1);
				} else {
					responseJson.put("volume", org.getVolume());
				}
			}

			if (device.getPowerflag().equals("0")) {
				responseJson.put("power_flag", 0);
			} else if (device.getPowerflag().equals("1")) {
				responseJson.put("power_flag", 1);
				responseJson.put("power_on_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(device.getPoweron()));
				responseJson.put("power_off_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(device.getPoweroff()));
			} else {
				if (org.getPowerflag().equals("0")) {
					responseJson.put("power_flag", 0);
				} else {
					responseJson.put("power_flag", 1);
					responseJson.put("power_on_time",
							new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweron()));
					responseJson.put("power_off_time",
							new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweroff()));
				}
			}

			responseJson.put("password_flag", Integer.parseInt(org.getDevicepassflag()));
			responseJson.put("password", org.getDevicepass());
			if (org.getTagflag().equals("1") && device.getTagflag().equals("1")) {
				responseJson.put("tag_flag", 1);
			} else {
				responseJson.put("tag_flag", 0);
			}
			responseJson.put("tags", device.getTags());
			responseJson.put("interval1", device.getInterval1());
			responseJson.put("interval2", device.getInterval2());
			responseJson.put("timestamp", Calendar.getInstance().getTimeInMillis());
			responseJson.put("hotspot_flag", Integer.parseInt(device.getHotspotflag()));
			responseJson.put("hotspot_ssid", device.getHotspotssid());
			responseJson.put("hotspot_password", device.getHotspotpassword());
			responseJson.put("hotspot_frequency", device.getHotspotfrequency());

			logger.info("Pixsignage Service init response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service init exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("get-version")
	public String getversion(String request) {
		try {
			logger.info("Pixsignage Service get-version: {}", request);

			JSONObject requestJson = JSONObject.fromObject(request);
			String terminalid = requestJson.optString("terminal_id");
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null || device.getUpgradeflag().equals("0")) {
				JSONObject responseJson = new JSONObject();
				responseJson.put("code", 0);
				responseJson.put("message", "成功");
				responseJson.put("version_name", "");
				responseJson.put("version_code", "0");
				responseJson.put("url", "");
				logger.info("Auto upgrade disabled, Pixsignage Service get-version response: {}",
						responseJson.toString());
				return responseJson.toString();
			}

			String appname = requestJson.optString("app_name");
			String sign = requestJson.optString("sign");
			String mtype = null;
			if (sign != null) {
				if (sign.startsWith("win")) {
					mtype = sign;
				} else {
					mtype = CommonConfig.CONFIG_SIGNATURE.get(sign);
				}
			}
			if (mtype == null) {
				logger.info("sign {} unrecognized, set as debug", sign);
				mtype = "debug";
			}

			Appfile appfile = null;
			if (device.getUpgradeflag().equals("1")) {
				appfile = appfileMapper.selectLatest(appname, mtype);
			} else if (device.getUpgradeflag().equals("2")) {
				appfile = appfileMapper.selectByPrimaryKey("" + device.getAppfileid());
			}
			if (appfile == null) {
				JSONObject responseJson = new JSONObject();
				responseJson.put("code", 0);
				responseJson.put("message", "成功");
				responseJson.put("version_name", "");
				responseJson.put("version_code", "0");
				responseJson.put("url", "");
				logger.info("Appfile not found, Pixsignage Service get-version response: {}", responseJson.toString());
				return responseJson.toString();
			}

			String url = "http://" + configMapper.selectValueByCode("ServerIP") + ":"
					+ configMapper.selectValueByCode("ServerPort") + "/pixsigdata" + appfile.getFilepath();
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			responseJson.put("version_name", appfile.getVname());
			responseJson.put("version_code", "" + appfile.getVcode());
			responseJson.put("url", url);
			logger.info("Pixsignage Service get-version response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service get-version exception, ", e);
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			responseJson.put("version_name", "");
			responseJson.put("version_code", "0");
			responseJson.put("url", "");
			logger.info("Pixsignage Service get-version response: {}", responseJson.toString());
			return responseJson.toString();
		}
	}

	@POST
	@Path("get_bundle")
	public String getbundle(String request) {
		try {
			logger.info("Pixsignage Service get_bundle: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
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

			JSONObject responseJson = scheduleService.generateBundleScheduleJson(Schedule.BindType_Device,
					"" + device.getDeviceid());
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Pixsignage Service get_bundle response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service get_bundle exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_status")
	public String reportstatus(String request) {
		try {
			logger.info("Pixsignage Service report_status: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
			long freebytes = requestJson.optLong("sdcard_free_bytes");
			long totalbytes = requestJson.optLong("sdcard_total_bytes");
			String temperature = requestJson.optString("temperature");
			int downloadspeed = requestJson.optInt("download_speed");
			long downloadbytes = requestJson.optLong("total_download_bytes");
			String networkmode = requestJson.optString("network_mode", "0");
			int networksignal = requestJson.optInt("signal_strength");
			int brightness = requestJson.optInt("brightness");

			JSONObject locationJson = requestJson.optJSONObject("location");

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
				String latitude = locationJson.optString("latitude");
				String longitude = locationJson.optString("lontitude");
				String city = locationJson.optString("city");
				String addr1 = locationJson.optString("addr");
				String addr2 = locationJson.optString("desc");
				device.setLatitude(latitude);
				device.setLongitude(longitude);
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

			device.setStorageavail(freebytes);
			device.setStorageused(totalbytes - freebytes);
			device.setTemperature(temperature);
			device.setDownloadspeed(downloadspeed);
			device.setDownloadbytes(downloadbytes);
			device.setNetworkmode(networkmode);
			device.setNetworksignal(networksignal);
			device.setBrightness(brightness);
			device.setOnlineflag("1");
			device.setRefreshtime(Calendar.getInstance().getTime());
			deviceMapper.updateByPrimaryKeySelective(device);

			onlinelogMapper.updateLast2Online("" + device.getDeviceid());

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			responseJson.put("tags", device.getTags());
			responseJson.put("interval1", device.getInterval1());
			responseJson.put("interval2", device.getInterval2());
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
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
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
			for (int i = 0; i < fileJsonArray.size(); i++) {
				JSONObject fileJson = fileJsonArray.getJSONObject(i);
				String type = fileJson.optString("type");
				int id = fileJson.optInt("id");
				int progress = fileJson.optInt("progress");
				String status = fileJson.optString("status");
				String desc = fileJson.optString("desc");
				String objtype = "";
				if (type.equals("video")) {
					objtype = Devicefile.ObjType_Video;
				} else if (type.equals("image")) {
					objtype = Devicefile.ObjType_Image;
				} else if (type.equals("cropvideo")) {
					objtype = Devicefile.ObjType_CropVideo;
				} else if (type.equals("cropimage")) {
					objtype = Devicefile.ObjType_CropImage;
				} else {
					continue;
				}
				Devicefile devicefile = devicefileService.selectByDeviceMedia("" + device.getDeviceid(), objtype,
						"" + id);
				if (devicefile == null) {
					devicefile = new Devicefile();
					devicefile.setDeviceid(device.getDeviceid());
					devicefile.setObjtype(objtype);
					devicefile.setObjid(id);
					devicefile.setProgress(progress);
					devicefile.setStatus(status);
					devicefile.setDescription(desc);
					devicefile.setUpdatetime(Calendar.getInstance().getTime());
					devicefileService.addDevicefile(devicefile);
					if (status.equals("2")) {
						Devicefilehis devicefilehis = new Devicefilehis();
						devicefilehis.setDeviceid(device.getDeviceid());
						devicefilehis.setObjtype(objtype);
						devicefilehis.setObjid(id);
						devicefilehis.setSize(devicefile.getSize());
						devicefilehisMapper.insertSelective(devicefilehis);
					}
				} else {
					if (!devicefile.getStatus().equals("2") && status.equals("2")) {
						Devicefilehis devicefilehis = new Devicefilehis();
						devicefilehis.setDeviceid(device.getDeviceid());
						devicefilehis.setObjtype(objtype);
						devicefilehis.setObjid(id);
						devicefilehis.setSize(devicefile.getSize());
						devicefilehisMapper.insertSelective(devicefilehis);
					}
					devicefile.setProgress(progress);
					devicefile.setStatus(status);
					devicefile.setDescription(desc);
					devicefile.setUpdatetime(Calendar.getInstance().getTime());
					devicefileService.updateDevicefile(devicefile);
				}
			}

			String fullflag = requestJson.optString("full_flag");
			if (fullflag != null && fullflag.equals("1")) {
				devicefileService.clearByDevice("" + device.getDeviceid());
			}

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service report_file exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_dvb")
	public String reportdvb(String request) {
		try {
			logger.info("Pixsignage Service report_dvb: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
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

			JSONArray dvbJsonArray = requestJson.getJSONArray("dvbs");

			Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
			List<Dvb> oldDvbList = dvbMapper.selectList("" + device.getOrgid(), null, null, null, null, null);
			HashMap<String, Dvb> oldDvbHash = new HashMap<String, Dvb>();
			HashMap<String, Dvb> newDvbHash = new HashMap<String, Dvb>();
			for (Dvb dvb : oldDvbList) {
				oldDvbHash.put(dvb.getNumber(), dvb);
			}

			if (dvbJsonArray != null) {
				for (int i = 0; i < dvbJsonArray.size(); i++) {
					JSONObject dvbJson = dvbJsonArray.getJSONObject(i);
					String name = dvbJson.optString("name");
					String num = "" + dvbJson.optInt("num");
					Dvb dvb = oldDvbHash.get(num);
					if (dvb != null) {
						dvb.setBranchid(org.getTopbranchid());
						dvb.setName(name);
						dvb.setStatus("1");
						dvbMapper.updateByPrimaryKeySelective(dvb);
						newDvbHash.put(num, dvb);
					} else {
						dvb = new Dvb();
						dvb.setBranchid(org.getTopbranchid());
						dvb.setOrgid(org.getOrgid());
						dvb.setStatus("1");
						dvb.setType(Dvb.Type_Public);
						dvb.setName(name);
						dvb.setNumber(num);
						dvbMapper.insertSelective(dvb);
						newDvbHash.put(num, dvb);
					}
				}
			}

			for (Dvb dvb : oldDvbList) {
				if (newDvbHash.get(dvb.getNumber()) == null) {
					dvbMapper.deleteByPrimaryKey("" + dvb.getDvbid());
				}
			}

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service report_dvb exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_crash")
	public String reportcrash(String request) {
		try {
			logger.info("Pixsignage Service report_crash: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
			String clientip = requestJson.optString("client_ip");
			String clientname = requestJson.optString("client_name");
			String os = requestJson.optString("os");
			String appname = requestJson.optString("app_name");
			String vname = requestJson.optString("version_name");
			String vcode = requestJson.optString("version_code");
			String stack = requestJson.optString("stack");
			String resolution = requestJson.optString("resolution");
			String other = requestJson.optString("other");

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

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service report_crash exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("get_weather")
	@Produces("application/json;charset=UTF-8")
	public String getweather(@QueryParam("hardkey") String hardkey, @QueryParam("terminal_id") String terminalid,
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

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			Weather weather = weatherService.selectByCity(Weather.Type_Baidu, city);
			responseJson.put("weather", JSONObject.fromObject(weather.getWeather()));
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service get_weather exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("get_yahoo_weather")
	@Produces("application/json;charset=UTF-8")
	public String get_yahoo_weather(@QueryParam("terminal_id") String terminalid, @QueryParam("city") String city) {
		try {
			logger.info("Pixsignage Service get_yahoo_weather: terminal_id={},city={}", terminalid, city);

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

			Weather weather = weatherService.selectByCity(Weather.Type_Yahoo, city);
			if (weather.getWeather() != null && weather.getWeather().length() > 0) {
				JSONObject responseJson = new JSONObject();
				responseJson.put("code", 0);
				responseJson.put("message", "成功");
				responseJson.put("weather", JSONObject.fromObject(weather.getWeather()));
				return responseJson.toString();
			} else {
				return handleResult(1009, "天气无法获得");
			}
		} catch (Exception e) {
			logger.error("Pixsignage Service get_yahoo_weather exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("get_calendar")
	@Produces("application/json;charset=UTF-8")
	public String getcalendar(String request) {
		try {
			logger.info("Pixsignage Service get_calendar: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
			long starttime = requestJson.optLong("start_time");
			long endtime = requestJson.optLong("end_time");

			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null || !device.getStatus().equals("1")) {
				return handleResult(1004, "无效终端号" + terminalid);
			}

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONArray scheduleJsonArray = new JSONArray();

			Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());

			if (device.getExternalid().length() > 0) {
				String pixedxip = configMapper.selectValueByCode("ServerIP");
				String pixedxport = configMapper.selectValueByCode("ServerPort");
				if (org.getSchoolflag().equals("1")) {
					String server = "http://" + pixedxip + ":" + pixedxport;
					String s = PixedxUtil.schedules(server, device.getExternalid());
					if (s.length() > 0) {
						JSONObject json = JSONObject.fromObject(s);
						JSONArray dataJsonArray = json.getJSONArray("data");

						long t = starttime;
						while (t < endtime) {
							Calendar c = Calendar.getInstance();
							c.setFirstDayOfWeek(Calendar.MONDAY);
							c.setTimeInMillis(t);
							int workday = c.get(Calendar.DAY_OF_WEEK) - 1;
							logger.info("Current timestamp={}, workday={}", t, workday);
							for (int i = 0; i < dataJsonArray.size(); i++) {
								JSONObject dataJson = dataJsonArray.getJSONObject(i);
								if (dataJson.optInt("workday") == workday) {
									String s1 = dataJson.optString("start_time");
									String s2 = dataJson.optString("end_time");
									int h1 = Integer.parseInt(s1.substring(0, 2));
									int m1 = Integer.parseInt(s1.substring(3, 5));
									int h2 = Integer.parseInt(s2.substring(0, 2));
									int m2 = Integer.parseInt(s2.substring(3, 5));
									c.set(Calendar.HOUR_OF_DAY, h1);
									c.set(Calendar.MINUTE, m1);
									c.set(Calendar.SECOND, 0);
									c.set(Calendar.MILLISECOND, 0);
									long l1 = c.getTimeInMillis();
									c.set(Calendar.HOUR_OF_DAY, h2);
									c.set(Calendar.MINUTE, m2);
									c.set(Calendar.SECOND, 0);
									c.set(Calendar.MILLISECOND, 0);
									long l2 = c.getTimeInMillis();
									JSONObject scheduleJson = new JSONObject();
									scheduleJson.put("name", dataJson.optString("course_name"));
									scheduleJson.put("host", dataJson.optString("instructor"));
									scheduleJson.put("start_time", l1);
									scheduleJson.put("end_time", l2);
									scheduleJsonArray.add(scheduleJson);
								}
							}
							t += 86400000L;
						}
					}
				} else if (org.getSchoolflag().equals("2")) {
					DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
					String s1 = dateFormat.format(new Date(starttime));
					String s2 = dateFormat.format(new Date(endtime));
					String s = EduCloudUtil.getScheduleList(device.getExternalid(), s1, s2);
					if (s.length() > 0) {
						JSONObject json = JSONObject.fromObject(s);
						JSONArray dataJsonArray = json.getJSONArray("result");
						if (dataJsonArray != null) {
							for (int i = 0; i < dataJsonArray.size(); i++) {
								JSONObject dataJson = dataJsonArray.getJSONObject(i);
								Date d1 = CommonUtil.parseDate(dataJson.optString("startTime"), "yyyyMMddHHmmss");
								Date d2 = CommonUtil.parseDate(dataJson.optString("endTime"), "yyyyMMddHHmmss");
								JSONObject scheduleJson = new JSONObject();
								scheduleJson.put("name", dataJson.optString("courseName"));
								scheduleJson.put("host", dataJson.optString("teacherName"));
								scheduleJson.put("start_time", d1.getTime());
								scheduleJson.put("end_time", d2.getTime());
								scheduleJsonArray.add(scheduleJson);
							}
						}
					}
				}
			}
			responseJson.put("schedules", scheduleJsonArray);

			logger.info("Pixsignage Service get_calendar response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service get_calendar exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_screen")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String reportscreen(@FormDataParam("meta") String request,
			@FormDataParam("screen") FormDataContentDisposition screenHeader,
			@FormDataParam("screen") InputStream screenFile) {
		try {
			logger.info("Pixsignage Service report_screen: {}, screenHeader: {}", request, screenHeader);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
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

			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/screen/" + device.getDeviceid()));
			String filename = CommonConfig.CONFIG_PIXDATA_HOME + "/screen/" + device.getDeviceid() + "/screen-"
					+ device.getDeviceid() + "-"
					+ new SimpleDateFormat("yyyyMMddHHmmss").format(Calendar.getInstance().getTime()) + ".jpg";
			logger.info("Save screen snapshot to: {}", filename);
			File file = new File(filename);
			FileUtils.copyInputStreamToFile(screenFile, file);
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Pixsignage Service report_screen response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service report_screen exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_playlog")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String reportplaylog(@FormDataParam("meta") String request,
			@FormDataParam("playlog") FormDataContentDisposition playlogHeader,
			@FormDataParam("playlog") InputStream playlogFile) {
		try {
			logger.info("Pixsignage Service report_playlog: {}, playlogHeader: {}", request, playlogHeader);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
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

			String filename = playlogHeader.getFileName();
			String okname = filename + ".ok";
			String tempname = filename + ".tmp";
			File dir = new File(CommonConfig.CONFIG_PIXDATA_HOME + "/playlog/" + device.getDeviceid());
			FileUtils.forceMkdir(dir);
			if (new File(dir, filename).exists() || new File(dir, okname).exists()
					|| new File(dir, tempname).exists()) {
				return handleResult(1001, "文件已存在");
			}
			logger.info("Save {} playlog to: {}", terminalid, dir + "/" + filename);
			File tempfile = new File(dir, tempname);
			FileUtils.copyInputStreamToFile(playlogFile, tempfile);
			FileUtils.moveFile(tempfile, new File(dir, okname));
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Pixsignage Service report_playlog response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service report_playlog exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_pflow")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String reportpflow(@FormDataParam("meta") String request,
			@FormDataParam("pflow") FormDataContentDisposition pflowHeader,
			@FormDataParam("pflow") InputStream pflowFile) {
		try {
			logger.info("Pixsignage Service report_pflow: {}, pflowHeader: {}", request, pflowHeader);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
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

			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/pflow/" + device.getDeviceid()));
			String tempname = CommonConfig.CONFIG_PIXDATA_HOME + "/pflow/" + device.getDeviceid() + "/pflow-"
					+ device.getTerminalid() + "-"
					+ new SimpleDateFormat("yyyyMMddHHmmssSSS").format(Calendar.getInstance().getTime()) + ".tmp";
			String filename = tempname.substring(0, tempname.length() - 4) + ".zip.ok";
			logger.info("Save pflow to: {}", filename);
			File tempfile = new File(tempname);
			FileUtils.copyInputStreamToFile(pflowFile, tempfile);
			FileUtils.moveFile(tempfile, new File(filename));
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Pixsignage Service report_pflow response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service report_pflow exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_flowrate")
	public String reportflowrate(String request) {
		try {
			logger.info("Pixsignage Service report_flowrate: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
			long timestamp = requestJson.optLong("timestamp");
			JSONArray recordJsonArray = requestJson.getJSONArray("records");
			int total = recordJsonArray.size();
			int male = 0;
			int female = 0;
			int age1 = 0;
			int age2 = 0;
			int age3 = 0;
			int age4 = 0;
			int age5 = 0;
			for (int i = 0; i < total; i++) {
				JSONObject recordJson = recordJsonArray.getJSONObject(i);
				timestamp = recordJson.optLong("enterInTime");
				int age = recordJson.optInt("age");
				int sex = recordJson.optInt("sex");
				if (age <= 6) {
					age1++;
				} else if (age <= 17) {
					age2++;
				} else if (age <= 40) {
					age3++;
				} else if (age <= 65) {
					age4++;
				} else {
					age5++;
				}
				if (sex == 0) {
					male++;
				} else {
					female++;
				}
			}

			if (total < 0 || male < 0 || female < 0 || age1 < 0 || age2 < 0 || age3 < 0 || age4 < 0 || age5 < 0) {
				return handleResult(1020, "数据错误");
			}
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

			Calendar c = Calendar.getInstance();
			c.setTimeInMillis(timestamp);
			String flowdate = new SimpleDateFormat("yyyyMMdd").format(c.getTime());
			String flowhour = new SimpleDateFormat("yyyyMMddHH").format(c.getTime());
			Hourflowlog hourflowlog = hourflowlogMapper.selectByDetail("" + device.getDeviceid(), flowhour);
			if (hourflowlog != null) {
				hourflowlog.setTotal(hourflowlog.getTotal() + total);
				hourflowlog.setMale(hourflowlog.getMale() + male);
				hourflowlog.setFemale(hourflowlog.getFemale() + female);
				hourflowlog.setAge1(hourflowlog.getAge1() + age1);
				hourflowlog.setAge2(hourflowlog.getAge2() + age2);
				hourflowlog.setAge3(hourflowlog.getAge3() + age3);
				hourflowlog.setAge4(hourflowlog.getAge4() + age4);
				hourflowlog.setAge5(hourflowlog.getAge5() + age5);
				hourflowlogMapper.updateByPrimaryKeySelective(hourflowlog);
			} else {
				hourflowlog = new Hourflowlog();
				hourflowlog.setOrgid(device.getOrgid());
				hourflowlog.setBranchid(device.getBranchid());
				hourflowlog.setDeviceid(device.getDeviceid());
				hourflowlog.setFlowdate(flowdate);
				hourflowlog.setFlowhour(flowhour);
				hourflowlog.setTotal(total);
				hourflowlog.setMale(male);
				hourflowlog.setFemale(female);
				hourflowlog.setAge1(age1);
				hourflowlog.setAge2(age2);
				hourflowlog.setAge3(age3);
				hourflowlog.setAge4(age4);
				hourflowlog.setAge5(age5);
				hourflowlogMapper.insertSelective(hourflowlog);
			}

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service report_flowrate exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_flowrate1")
	public String reportflowrate1(String request) {
		try {
			logger.info("Pixsignage Service report_flowrate: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
			long starttime = requestJson.optLong("start_time");
			int total = requestJson.optInt("total_delta");
			int male = requestJson.optInt("male_delta");
			int female = requestJson.optInt("female_delta");
			int age1 = requestJson.optInt("child_delta");
			int age2 = requestJson.optInt("juvenile_delta");
			int age3 = requestJson.optInt("youndster_delta");
			int age4 = requestJson.optInt("middle_delta");
			int age5 = requestJson.optInt("elder_delta");

			if (total < 0 || male < 0 || female < 0 || age1 < 0 || age2 < 0 || age3 < 0 || age4 < 0 || age5 < 0) {
				return handleResult(1020, "数据错误");
			}
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

			Calendar c = Calendar.getInstance();
			c.setTimeInMillis(starttime);
			String flowdate = new SimpleDateFormat("yyyyMMdd").format(c.getTime());
			String flowhour = new SimpleDateFormat("yyyyMMddHH").format(c.getTime());
			Hourflowlog hourflowlog = hourflowlogMapper.selectByDetail("" + device.getDeviceid(), flowhour);
			if (hourflowlog != null) {
				hourflowlog.setTotal(hourflowlog.getTotal() + total);
				hourflowlog.setMale(hourflowlog.getMale() + male);
				hourflowlog.setFemale(hourflowlog.getFemale() + female);
				hourflowlog.setAge1(hourflowlog.getAge1() + age1);
				hourflowlog.setAge2(hourflowlog.getAge2() + age2);
				hourflowlog.setAge3(hourflowlog.getAge3() + age3);
				hourflowlog.setAge4(hourflowlog.getAge4() + age4);
				hourflowlog.setAge5(hourflowlog.getAge5() + age5);
				hourflowlogMapper.updateByPrimaryKeySelective(hourflowlog);
			} else {
				hourflowlog = new Hourflowlog();
				hourflowlog.setOrgid(device.getOrgid());
				hourflowlog.setBranchid(device.getBranchid());
				hourflowlog.setDeviceid(device.getDeviceid());
				hourflowlog.setFlowdate(flowdate);
				hourflowlog.setFlowhour(flowhour);
				hourflowlog.setTotal(total);
				hourflowlog.setMale(male);
				hourflowlog.setFemale(female);
				hourflowlog.setAge1(age1);
				hourflowlog.setAge2(age2);
				hourflowlog.setAge3(age3);
				hourflowlog.setAge4(age4);
				hourflowlog.setAge5(age5);
				hourflowlogMapper.insertSelective(hourflowlog);
			}

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service report_flowrate exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_debug")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String reportdebug(@FormDataParam("meta") String request,
			@FormDataParam("debug") FormDataContentDisposition debugHeader,
			@FormDataParam("debug") InputStream debugFile) {
		try {
			logger.info("Pixsignage Service report_debug: {}, debugHeader: {}", request, debugHeader);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
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

			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/debug/" + device.getDeviceid()));
			String filepath = "/debug/" + device.getDeviceid() + "/debug-" + device.getDeviceid() + "-"
					+ new SimpleDateFormat("yyyyMMddHHmmss").format(Calendar.getInstance().getTime()) + ".zip";
			logger.info("Save debug zip to: {}", CommonConfig.CONFIG_PIXDATA_HOME + filepath);
			File file = new File(CommonConfig.CONFIG_PIXDATA_HOME + filepath);
			FileUtils.copyInputStreamToFile(debugFile, file);

			Debugreport debugreport = new Debugreport();
			debugreport.setDeviceid(device.getDeviceid());
			debugreport.setHardkey(hardkey);
			debugreport.setFilepath(filepath);
			debugreportMapper.insertSelective(debugreport);

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Pixsignage Service report_debug response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service report_debug exception", e);
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
