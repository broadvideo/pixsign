package com.broadvideo.pixsignage.rest;

import java.io.File;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
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

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Appfile;
import com.broadvideo.pixsignage.domain.Branch;
import com.broadvideo.pixsignage.domain.Crashreport;
import com.broadvideo.pixsignage.domain.Debugreport;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicefile;
import com.broadvideo.pixsignage.domain.Devicefilehis;
import com.broadvideo.pixsignage.domain.Devicegrid;
import com.broadvideo.pixsignage.domain.Dvb;
import com.broadvideo.pixsignage.domain.Hourflowlog;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Onlinelog;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Text;
import com.broadvideo.pixsignage.domain.Weather;
import com.broadvideo.pixsignage.persistence.AppfileMapper;
import com.broadvideo.pixsignage.persistence.BranchMapper;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.CrashreportMapper;
import com.broadvideo.pixsignage.persistence.DebugreportMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicefilehisMapper;
import com.broadvideo.pixsignage.persistence.DevicegridMapper;
import com.broadvideo.pixsignage.persistence.DvbMapper;
import com.broadvideo.pixsignage.persistence.HourflowlogMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.OnlinelogMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.persistence.TextMapper;
import com.broadvideo.pixsignage.service.DevicefileService;
import com.broadvideo.pixsignage.service.PlanService;
import com.broadvideo.pixsignage.service.WeatherService;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.ipparse.IPSeeker;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Component
@Consumes("application/json;charset=UTF-8")
@Produces("application/json;charset=UTF-8")
@Path("/pixsign2c")
public class Pixsign2cService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private BranchMapper branchMapper;
	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private AppfileMapper appfileMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;
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
	private DevicegridMapper devicegridMapper;
	@Autowired
	private DevicefilehisMapper devicefilehisMapper;
	@Autowired
	private TextMapper textMapper;

	@Autowired
	private PlanService planService;
	@Autowired
	private DevicefileService devicefileService;
	@Autowired
	private WeatherService weatherService;

	@POST
	@Path("init")
	public String init(String request, @Context HttpServletRequest req) {
		try {
			logger.info("Pixsign2c Service init: {}, from {}, {}", request, req.getRemoteAddr(), req.getRemoteHost());
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String mac = requestJson.optString("mac");
			String iip = requestJson.optString("ip");
			String ostype = requestJson.optString("os_type");
			if (ostype.equals("windows")) {
				ostype = "2";
			} else {
				ostype = "1";
			}
			String appname = requestJson.optString("app_name");
			String sign = requestJson.optString("sign");
			String vname = requestJson.optString("version_name");
			int vcode = requestJson.optInt("version_code");
			String ip = req.getRemoteAddr();
			String other = requestJson.optString("other");
			String boardinfo = "";
			if (requestJson.getJSONObject("boardinfo") != null) {
				boardinfo = requestJson.getJSONObject("boardinfo").toString();
			}

			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}

			String mtype = null;
			if (sign != null) {
				if (sign.startsWith("win")) {
					mtype = sign;
				} else {
					mtype = CommonConfig.CONFIG_SIGNATURE.get(sign);
				}
			}
			if (mtype == null) {
				mtype = "debug";
			}

			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null || !device.getStatus().equals("1")) {
				String checkcode = CommonUtil.getMd5(hardkey, CommonConfig.SYSTEM_ID);
				String qrcode = "http://" + configMapper.selectValueByCode("ServerIP") + ":"
						+ configMapper.selectValueByCode("ServerPort")
						+ "/pixsignage/youwang/app.jsp?appname=pixsign2c&hardkey=" + hardkey + "&checkcode="
						+ checkcode;
				JSONObject responseJson = new JSONObject();
				responseJson.put("code", 2002);
				responseJson.put("message", "终端未注册");
				responseJson.put("qrcode", qrcode);
				logger.info("Pixsign2c Service init response: {}", responseJson.toString());
				return responseJson.toString();
			}

			Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
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
				logger.error("Pixsign2c Service ip seek exception: {}", e.getMessage());
			}

			device.setHardkey(hardkey);
			device.setTerminalid(hardkey);
			device.setIp(ip);
			device.setIip(iip);
			device.setMac(mac);
			device.setOstype(ostype);
			device.setAppname(appname);
			device.setSign(sign);
			device.setVname(vname);
			device.setVcode(vcode);
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
			responseJson.put("name", device.getName());
			responseJson.put("msg_server", configMapper.selectValueByCode("ServerIP") + ":1883");
			JSONArray topicJsonArray = new JSONArray();
			responseJson.put("msg_topic", topicJsonArray);
			topicJsonArray.add("device-" + device.getDeviceid());
			if (device.getDevicegroupid() > 0) {
				topicJsonArray.add("group-" + device.getDevicegroupid());
			}
			topicJsonArray.add("org-" + device.getOrgid());

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
			responseJson.put("devicegrid_id", device.getDevicegridid());
			responseJson.put("xpos", device.getXpos());
			responseJson.put("ypos", device.getYpos());
			if (device.getXpos().intValue() == 0 && device.getYpos().intValue() == 0) {
				responseJson.put("master_flag", 1);
			} else {
				responseJson.put("master_flag", 0);
			}
			JSONArray griddtlArray = new JSONArray();
			Devicegrid devicegrid = devicegridMapper.selectByPrimaryKey("" + device.getDevicegridid());
			if (devicegrid != null) {
				List<Device> devices = devicegrid.getDevices();
				for (Device d : devices) {
					griddtlArray.add(d.getTerminalid());
				}
			}
			responseJson.put("devicegrid_dtls", griddtlArray);

			logger.info("Pixsign2c Service init response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsign2c Service init exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("get_schedule")
	public String getschedule(String request) {
		try {
			logger.info("Pixsign2c Service get_schedule: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null) {
				return handleResult(1004, "无效终端" + hardkey);
			}

			JSONObject responseJson;
			responseJson = planService.generateBundlePlanJson("" + device.getDeviceid());
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Pixsign2c Service get_schedule response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsign2c Service get_schedule exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("get_plan")
	public String getplan(String request) {
		try {
			logger.info("Pixsign2c Service get_plan: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null) {
				return handleResult(1004, "无效终端" + hardkey);
			}

			JSONObject responseJson;
			responseJson = planService.generatePlanJson("" + device.getDeviceid());
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Pixsign2c Service get_plan response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsign2c Service get_plan exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_status")
	public String reportstatus(String request) {
		try {
			logger.info("Pixsign2c Service report_status: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			long sdcard_free_bytes = requestJson.optLong("sdcard_free_bytes");
			long sdcard_total_bytes = requestJson.optLong("sdcard_total_bytes");
			String temperature = requestJson.optString("temperature");

			JSONObject locationJson = requestJson.getJSONObject("location");

			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null) {
				return handleResult(1004, "无效终端" + hardkey);
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

			device.setStorageavail(sdcard_free_bytes);
			device.setStorageused(sdcard_total_bytes - sdcard_free_bytes);
			device.setTemperature(temperature);
			device.setOnlineflag("1");
			device.setRefreshtime(Calendar.getInstance().getTime());
			deviceMapper.updateByPrimaryKeySelective(device);

			onlinelogMapper.updateLast2Online("" + device.getDeviceid());

			/*
			 * if (mediatype.equals("video")) { Playlog playlog = new Playlog();
			 * playlog.setOrgid(device.getOrgid());
			 * playlog.setBranchid(device.getBranchid());
			 * playlog.setDeviceid(device.getDeviceid());
			 * playlog.setVideoid(mediaid);
			 * playlog.setStarttime(Calendar.getInstance().getTime());
			 * playlogMapper.insertSelective(playlog); }
			 */

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsign2c Service report_status exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("refresh")
	public String refresh(String request) {
		try {
			logger.info("Pixsign2c Service refresh: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			JSONObject locationJson = requestJson.getJSONObject("location");
			long freebytes = requestJson.optLong("sdcard_free_bytes");
			long totalbytes = requestJson.optLong("sdcard_total_bytes");
			String temperature = requestJson.optString("temperature");
			int downloadspeed = requestJson.optInt("download_speed");
			long downloadbytes = requestJson.optLong("total_download_bytes");
			String networkmode = requestJson.optString("network_mode", "0");
			int networksignal = requestJson.optInt("signal_strength");
			int brightness = requestJson.optInt("brightness");

			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null) {
				return handleResult(1004, "无效终端" + hardkey);
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
			responseJson.put("timestamp", Calendar.getInstance().getTimeInMillis());

			if (device.getUpgradeflag().equals("0")) {
				responseJson.put("version_name", "");
				responseJson.put("version_code", "0");
				responseJson.put("url", "");
				responseJson.put("path", "");
				logger.info("Auto upgrade disabled: {}", device.getTerminalid());
			} else {
				String ostype = device.getOstype();
				String appname = device.getAppname();
				String sign = device.getSign();
				String mtype = null;
				if (ostype.equals("2")) {
					mtype = sign;
				} else {
					if (sign != null && sign.length() > 0) {
						mtype = CommonConfig.CONFIG_SIGNATURE.get(sign);
					}
					if (mtype == null) {
						logger.info("sign {} unrecognized, set as debug", sign);
						mtype = "debug";
					}
				}

				Appfile appfile = null;
				if (device.getUpgradeflag().equals("1")) {
					appfile = appfileMapper.selectLatest(appname, mtype);
				} else if (device.getUpgradeflag().equals("2")) {
					appfile = appfileMapper.selectByPrimaryKey("" + device.getAppfileid());
				}
				if (appfile == null) {
					responseJson.put("version_name", "");
					responseJson.put("version_code", "0");
					responseJson.put("url", "");
					responseJson.put("path", "");
					logger.info("Appfile not found, disabled upgrade: {}", device.getTerminalid());
				} else {
					String url = "http://" + configMapper.selectValueByCode("ServerIP") + ":"
							+ configMapper.selectValueByCode("ServerPort") + "/pixsigdata" + appfile.getFilepath();
					String path = "/pixsigdata" + appfile.getFilepath();
					responseJson.put("version_name", appfile.getVname());
					responseJson.put("version_code", "" + appfile.getVcode());
					responseJson.put("url", url);
					responseJson.put("path", path);
				}
			}

			Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
			JSONArray eventJsonArray = new JSONArray();
			responseJson.put("events", eventJsonArray);
			List<Msgevent> msgevents = msgeventMapper.selectList(null, Msgevent.ObjType_1_Device,
					"" + device.getDeviceid(), null, Msgevent.Status_Wait);
			for (Msgevent msgevent : msgevents) {
				JSONObject eventJson = new JSONObject();
				if (msgevent.getMsgtype().equals(Msgevent.MsgType_Schedule)) {
					eventJson.put("event_type", "schedule");
					eventJson.put("event_content", planService.generateBundlePlanJson("" + device.getDeviceid()));
				} else if (msgevent.getMsgtype().equals(Msgevent.MsgType_Plan)) {
					eventJson.put("event_type", "plan");
					eventJson.put("event_content", planService.generatePlanJson("" + device.getDeviceid()));
				} else if (msgevent.getMsgtype().equals(Msgevent.MsgType_Device_Config)) {
					eventJson.put("event_type", "config");
					JSONObject contentJson = new JSONObject();
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
						contentJson.put("backup_media", backupvideoJson);
					}
					if (device.getVolumeflag().equals("0")) {
						contentJson.put("volume", -1);
					} else if (device.getVolumeflag().equals("1")) {
						contentJson.put("volume", device.getVolume());
					} else {
						if (org.getVolumeflag().equals("0")) {
							contentJson.put("volume", -1);
						} else {
							contentJson.put("volume", org.getVolume());
						}
					}
					if (device.getPowerflag().equals("0")) {
						contentJson.put("power_flag", 0);
					} else if (device.getPowerflag().equals("1")) {
						contentJson.put("power_flag", 1);
						contentJson.put("power_on_time",
								new SimpleDateFormat(CommonConstants.DateFormat_Time).format(device.getPoweron()));
						contentJson.put("power_off_time",
								new SimpleDateFormat(CommonConstants.DateFormat_Time).format(device.getPoweroff()));
					} else {
						if (org.getPowerflag().equals("0")) {
							contentJson.put("power_flag", 0);
						} else {
							contentJson.put("power_flag", 1);
							contentJson.put("power_on_time",
									new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweron()));
							contentJson.put("power_off_time",
									new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweroff()));
						}
					}
					contentJson.put("password_flag", Integer.parseInt(org.getDevicepassflag()));
					contentJson.put("password", org.getDevicepass());
					eventJson.put("event_content", contentJson);
				} else if (msgevent.getMsgtype().equals(Msgevent.MsgType_Device_Reboot)) {
					eventJson.put("event_type", "reboot");
					eventJson.put("event_content", new JSONObject());
				} else if (msgevent.getMsgtype().equals(Msgevent.MsgType_Device_Poweroff)) {
					eventJson.put("event_type", "poweroff");
					eventJson.put("event_content", new JSONObject());
				} else if (msgevent.getMsgtype().equals(Msgevent.MsgType_Device_Screen)) {
					eventJson.put("event_type", "screen");
					eventJson.put("event_content", new JSONObject());
				} else if (msgevent.getMsgtype().equals(Msgevent.MsgType_Device_UText)) {
					eventJson.put("event_type", "utext");
					eventJson.put("event_content", new JSONObject());
				} else if (msgevent.getMsgtype().equals(Msgevent.MsgType_Device_UCancel)) {
					eventJson.put("event_type", "ucancel");
					eventJson.put("event_content", new JSONObject());
				} else if (msgevent.getMsgtype().equals(Msgevent.MsgType_Device_Debug)) {
					eventJson.put("event_type", "debug");
					eventJson.put("event_content", new JSONObject());
				}
				msgevent.setStatus(Msgevent.Status_Sent);
				msgeventMapper.updateByPrimaryKeySelective(msgevent);
				eventJsonArray.add(eventJson);
			}

			if (responseJson.optString("url").length() > 0 || responseJson.getJSONArray("events").size() > 0) {
				logger.info("Pixsign2c Service refresh response: {}", responseJson.toString());
			} else {
				logger.info("Pixsign2c Service refresh response: {}", responseJson.toString());
			}
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsign2c Service refresh exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_file")
	public String reportfile(String request) {
		try {
			logger.info("Pixsign2c Service report_file: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null) {
				return handleResult(1004, "无效终端" + hardkey);
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
			logger.error("Pixsign2c Service report_file exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_dvb")
	public String reportdvb(String request) {
		try {
			logger.info("Pixsign2c Service report_dvb: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null) {
				return handleResult(1004, "无效终端" + hardkey);
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
			logger.error("Pixsign2c Service report_dvb exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_crash")
	public String reportcrash(String request) {
		try {
			logger.info("Pixsign2c Service report_crash: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
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
			crashreport.setTerminalid(hardkey);
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
			logger.error("Pixsign2c Service report_crash exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("get_weather")
	@Produces("application/json;charset=UTF-8")
	public String getweather(@QueryParam("hardkey") String hardkey, @QueryParam("city") String city) {
		try {
			logger.info("Pixsign2c Service get_weather: hardkey={},city={}", hardkey, city);

			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null) {
				return handleResult(1004, "无效终端" + hardkey);
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
			logger.error("Pixsign2c Service get_weather exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("get_yahoo_weather")
	@Produces("application/json;charset=UTF-8")
	public String get_yahoo_weather(@QueryParam("hardkey") String hardkey, @QueryParam("city") String city) {
		try {
			logger.info("Pixsign2c Service get_yahoo_weather: hardkey={},city={}", hardkey, city);

			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null) {
				return handleResult(1004, "无效终端" + hardkey);
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
			logger.error("Pixsign2c Service get_yahoo_weather exception", e);
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
			logger.info("Pixsign2c Service report_screen: {}, screenHeader: {}", request, screenHeader);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null) {
				return handleResult(1004, "无效终端" + hardkey);
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
			logger.info("Pixsign2c Service report_screen response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsign2c Service report_screen exception", e);
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
			logger.info("Pixsign2c Service report_playlog: {}, playlogHeader: {}", request, playlogHeader);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null) {
				return handleResult(1004, "无效终端" + hardkey);
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
			logger.info("Save {} playlog to: {}", hardkey, dir + "/" + filename);
			File tempfile = new File(dir, tempname);
			FileUtils.copyInputStreamToFile(playlogFile, tempfile);
			FileUtils.moveFile(tempfile, new File(dir, okname));
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Pixsign2c Service report_playlog response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsign2c Service report_playlog exception", e);
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
			logger.info("Pixsign2c Service report_pflow: {}, pflowHeader: {}", request, pflowHeader);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null) {
				return handleResult(1004, "无效终端" + hardkey);
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
			logger.info("Pixsign2c Service report_pflow response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsign2c Service report_pflow exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_flowrate")
	public String reportflowrate(String request) {
		try {
			logger.info("Pixsign2c Service report_flowrate: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
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
			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null) {
				return handleResult(1004, "无效终端" + hardkey);
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
			logger.error("Pixsign2c Service report_flowrate exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("upload_file")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String reportfile(@FormDataParam("meta") String request,
			@FormDataParam("file") FormDataContentDisposition fileHeader, @FormDataParam("file") InputStream fileFile) {
		try {
			logger.info("Pixsign2c Service upload_file: {}, fileHeader: {}", request, fileHeader);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null) {
				return handleResult(1004, "无效终端" + hardkey);
			}

			String ext = FilenameUtils.getExtension(fileHeader.getFileName().toLowerCase());
			if (ext == null || ext.length() == 0) {
				ext = "";
			} else {
				ext = "." + ext;
			}
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/file/" + device.getDeviceid()));
			String filename = "/file/" + device.getDeviceid() + "/file-" + device.getDeviceid() + "-"
					+ new SimpleDateFormat("yyyyMMddHHmmss").format(Calendar.getInstance().getTime()) + ext;
			logger.info("Save upload file to: {}", CommonConfig.CONFIG_PIXDATA_HOME + filename);
			File file = new File(CommonConfig.CONFIG_PIXDATA_HOME + filename);
			FileUtils.copyInputStreamToFile(fileFile, file);
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			responseJson.put("url", "http://" + configMapper.selectValueByCode("ServerIP") + ":"
					+ configMapper.selectValueByCode("ServerPort") + "/pixsigdata" + filename);
			responseJson.put("path", "/pixsigdata" + filename);
			logger.info("Pixsign2c Service upload_file response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsign2c Service upload_file exception", e);
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
			logger.info("Pixsign2c Service report_debug: {}, debugHeader: {}", request, debugHeader);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null) {
				return handleResult(1004, "无效终端" + hardkey);
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
			logger.info("Pixsign2c Service report_debug response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsign2c Service report_debug exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("get_text")
	@Produces("application/json;charset=UTF-8")
	public String gettext(String request) {
		try {
			logger.info("Pixsign2c Service get_text: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null) {
				return handleResult(1004, "无效终端" + hardkey);
			}
			Branch branch = branchMapper.selectByPrimaryKey("" + device.getBranchid());
			String branchid1 = "" + branch.getBranchid();
			String branchid2 = "" + branch.getParentid();
			String branchid3 = "" + branch.getParentid2();
			String branchid4 = "" + branch.getParentid3();

			List<Text> texts1 = textMapper.selectList("" + device.getOrgid(), branchid1, null, null, null);
			List<Text> texts2 = textMapper.selectList("" + device.getOrgid(), branchid2, null, null, null);
			List<Text> texts3 = textMapper.selectList("" + device.getOrgid(), branchid3, null, null, null);
			List<Text> texts4 = textMapper.selectList("" + device.getOrgid(), branchid4, null, null, null);
			List<String> texts = new ArrayList<String>();
			for (Text text : texts1) {
				texts.add(text.getText());
			}
			for (Text text : texts2) {
				texts.add(text.getText());
			}
			for (Text text : texts3) {
				texts.add(text.getText());
			}
			for (Text text : texts4) {
				texts.add(text.getText());
			}

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONArray textJsonArray = new JSONArray();
			String s = "";
			for (String text : texts) {
				s += text;
				textJsonArray.add(text);
			}
			responseJson.put("texts", textJsonArray);
			responseJson.put("checksum", DigestUtils.md5Hex(s));

			logger.info("Pixsign2c Service get_text response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsign2c Service get_text exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	private String handleResult(int code, String message) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("code", code);
		responseJson.put("message", message);
		logger.info("Pixsign2c Service response: {}", responseJson.toString());
		return responseJson.toString();
	}

}
