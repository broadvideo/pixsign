package com.broadvideo.pixsignage.rest;

import java.io.File;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Calendar;
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
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Onlinelog;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Weather;
import com.broadvideo.pixsignage.persistence.AppfileMapper;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.CrashreportMapper;
import com.broadvideo.pixsignage.persistence.DebugreportMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicefilehisMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.OnlinelogMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.service.DeviceService;
import com.broadvideo.pixsignage.service.DevicefileService;
import com.broadvideo.pixsignage.service.PageService;
import com.broadvideo.pixsignage.service.WeatherService;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.ipparse.IPSeeker;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Component
@Consumes("application/json;charset=UTF-8")
@Produces("application/json;charset=UTF-8")
@Path("/v3.0")
public class PixsignageService3 {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private OnlinelogMapper onlinelogMapper;
	@Autowired
	private AppfileMapper appfileMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;
	@Autowired
	private CrashreportMapper crashreportMapper;
	@Autowired
	private DebugreportMapper debugreportMapper;
	@Autowired
	private DevicefilehisMapper devicefilehisMapper;

	@Autowired
	private DeviceService deviceService;
	@Autowired
	private PageService pageService;
	@Autowired
	private DevicefileService devicefileService;
	@Autowired
	private WeatherService weatherService;

	@POST
	@Path("init")
	public String init(String request, @Context HttpServletRequest req) {
		try {
			logger.info("Pixsignage3 Service init: {}, from {}, {}", request, req.getRemoteAddr(), req.getRemoteHost());
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
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
			String vname = requestJson.optString("version_name");
			int vcode = requestJson.optInt("version_code");
			String ip = req.getRemoteAddr();
			String other = requestJson.optString("other");
			String boardinfo = "";
			if (requestJson.getJSONObject("boardinfo") != null) {
				boardinfo = requestJson.getJSONObject("boardinfo").toString();
			}

			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1007, "硬件码不能为空");
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

			String checkcode = CommonUtil.getMd5(hardkey, CommonConfig.SYSTEM_ID);
			String qrcode = "http://" + configMapper.selectValueByCode("ServerIP") + ":"
					+ configMapper.selectValueByCode("ServerPort")
					+ "/pixsignage/app.jsp?appname=PixSignagePhone&hardkey=" + hardkey + "&checkcode=" + checkcode;

			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device == null || device.getStatus().equals("0")) {
				JSONObject responseJson = new JSONObject();
				responseJson.put("code", 1002);
				responseJson.put("message", "终端未注册");
				responseJson.put("qrcode", qrcode);
				logger.info("Pixsignage3 Service init response: {}", responseJson.toString());
				return responseJson.toString();
			}

			Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
			try {
				IPSeeker ipseeker = new IPSeeker("qqwry.dat", "/opt/pix/conf");
				String location = ipseeker.getCountry(ip);
				ipseeker.close();
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
				logger.error("Pixsignage3 Service ip seek exception: {}", e.getMessage());
			}

			device.setHardkey(hardkey);
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
			responseJson.put("qrcode", qrcode);
			responseJson.put("terminal_id", device.getTerminalid());
			responseJson.put("name", device.getName());

			String boardtype = device.getBoardtype();
			if (boardtype.length() == 0) {
				boardtype = org.getBoardtype();
				if (boardtype.indexOf(",") > 0) {
					boardtype = boardtype.substring(0, boardtype.indexOf(","));
				}
				if (boardtype.length() == 0) {
					boardtype = "Common";
				}
			}
			responseJson.put("board_type", boardtype);

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

			responseJson.put("password_flag", org.getDevicepassflag());
			responseJson.put("password", org.getDevicepass());
			responseJson.put("timestamp", Calendar.getInstance().getTimeInMillis());

			logger.info("Pixsignage3 Service init response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage3 Service init exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("bind")
	public String bind(String request, @Context HttpServletRequest req) {
		try {
			logger.info("Pixsignage3 Service bind: {}, from {}, {}", request, req.getRemoteAddr(), req.getRemoteHost());
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");

			Device device1 = deviceMapper.selectByTerminalid(terminalid);
			if (device1 == null) {
				return handleResult(1008, "无效终端号" + terminalid);
			} else if (device1.getStatus().equals("1") && device1.getHardkey() != null
					&& !device1.getHardkey().equals(hardkey)) {
				return handleResult(1005, terminalid + "已经被别的终端注册.");
			}

			Device device2 = deviceMapper.selectByHardkey(hardkey);
			if (device2 != null && !device2.getTerminalid().equals(terminalid)) {
				logger.info("unbind old device {} for the same hardkey {}", device2.getTerminalid(), hardkey);
				deviceMapper.unbind("" + device2.getDeviceid());
			}

			device1.setActivetime(Calendar.getInstance().getTime());
			device1.setHardkey(hardkey);
			device1.setStatus("1");
			deviceMapper.updateByPrimaryKey(device1);

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Pixsignage3 bind response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage3 bind exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("get_page")
	public String getpage(String request) {
		try {
			logger.info("Pixsignage3 Service get_page: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1007, "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult(1008, "终端号不能为空");
			}
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult(1009, "无效终端号" + terminalid);
			} else if (device.getStatus().equals("0") || !device.getHardkey().equals(hardkey)) {
				return handleResult(1010, "硬件码和终端号不匹配");
			}

			JSONObject responseJson = deviceService.generatePageJson(device);
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Pixsignage3 Service get_page response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage3 Service get_page exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("refresh")
	public String refresh(String request) {
		try {
			logger.info("Pixsignage3 Service refresh: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
			JSONObject locationJson = requestJson.optJSONObject("location");
			long freebytes = requestJson.optLong("sdcard_free_bytes");
			long totalbytes = requestJson.optLong("sdcard_total_bytes");
			String temperature = requestJson.optString("temperature");
			int downloadspeed = requestJson.optInt("download_speed");
			long downloadbytes = requestJson.optLong("total_download_bytes");
			int networkmode = requestJson.optInt("network_mode");
			int networksignal = requestJson.optInt("signal_strength");
			int brightness = requestJson.optInt("brightness");

			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1007, "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult(1008, "终端号不能为空");
			}
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult(1009, "无效终端号" + terminalid);
			} else if (device.getStatus().equals("0") || !device.getHardkey().equals(hardkey)) {
				return handleResult(1010, "硬件码和终端号不匹配");
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
			device.setNetworkmode("" + networkmode);
			device.setNetworksignal(networksignal);
			device.setBrightness(brightness);
			device.setOnlineflag("1");
			device.setRefreshtime(Calendar.getInstance().getTime());
			deviceMapper.updateByPrimaryKeySelective(device);

			onlinelogMapper.updateLast2Online("" + device.getDeviceid());

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
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
				if (ostype.equals("2") || ostype.equals("3")) {
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
			List<Msgevent> msgevents = msgeventMapper.selectList(null, "" + Msgevent.ObjType_1_Device,
					"" + device.getDeviceid(), null, "" + Msgevent.Status_Wait);
			for (Msgevent msgevent : msgevents) {
				JSONObject eventJson = new JSONObject();
				if (msgevent.getMsgtype().equals(Msgevent.MsgType_Schedule)) {
					eventJson.put("event_type", "bundle");
					eventJson.put("event_content", deviceService.generateBundleJson(device));
				} else if (msgevent.getMsgtype().equals(Msgevent.MsgType_Plan)) {
					eventJson.put("event_type", "page");
					eventJson.put("event_content", deviceService.generatePageJson(device));
				} else if (msgevent.getMsgtype().equals(Msgevent.MsgType_Device_Config)) {
					eventJson.put("event_type", "config");
					JSONObject contentJson = new JSONObject();
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
					contentJson.put("password_flag", org.getDevicepassflag());
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
				} else if (msgevent.getMsgtype().equals(Msgevent.MsgType_Device_Debug)) {
					eventJson.put("event_type", "debug");
					eventJson.put("event_content", new JSONObject());
				}
				msgevent.setStatus(Msgevent.Status_Sent);
				msgeventMapper.updateByPrimaryKeySelective(msgevent);
				eventJsonArray.add(eventJson);
			}
			responseJson.put("events", eventJsonArray);

			if (responseJson.optString("url").length() > 0 || responseJson.getJSONArray("events").size() > 0) {
				logger.info("Pixsignage3 Service refresh response: {}", responseJson.toString());
			}
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage3 Service refresh exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_file")
	public String reportfile(String request) {
		try {
			logger.info("Pixsignage3 Service report_file: {}", request);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1007, "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult(1008, "终端号不能为空");
			}
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult(1009, "无效终端号" + terminalid);
			} else if (device.getStatus().equals("0") || !device.getHardkey().equals(hardkey)) {
				return handleResult(1010, "硬件码和终端号不匹配");
			}

			JSONArray fileJsonArray = requestJson.getJSONArray("files");
			for (int i = 0; i < fileJsonArray.size(); i++) {
				JSONObject fileJson = fileJsonArray.getJSONObject(i);
				String type = fileJson.optString("type");
				int id = fileJson.optInt("id");
				int progress = fileJson.optInt("progress");
				int status = fileJson.optInt("status");
				String desc = fileJson.optString("desc");
				String objtype = "0";
				if (type.equals("video")) {
					objtype = Devicefile.ObjType_Video;
				} else if (type.equals("page")) {
					objtype = Devicefile.ObjType_Page;
				} else {
					continue;
				}
				Devicefile devicefile = devicefileService.selectByDeviceMedia("" + device.getDeviceid(), "" + objtype,
						"" + id);
				if (devicefile == null) {
					devicefile = new Devicefile();
					devicefile.setDeviceid(device.getDeviceid());
					devicefile.setObjtype(objtype);
					devicefile.setObjid(id);
					devicefile.setProgress(progress);
					devicefile.setStatus("" + status);
					devicefile.setDescription(desc);
					devicefile.setUpdatetime(Calendar.getInstance().getTime());
					devicefileService.addDevicefile(devicefile);
					if (status == 2) {
						Devicefilehis devicefilehis = new Devicefilehis();
						devicefilehis.setDeviceid(device.getDeviceid());
						devicefilehis.setObjtype(objtype);
						devicefilehis.setObjid(id);
						devicefilehis.setSize(devicefile.getSize());
						devicefilehisMapper.insertSelective(devicefilehis);
					}
				} else {
					if (!devicefile.getStatus().equals("2") && status == 2) {
						Devicefilehis devicefilehis = new Devicefilehis();
						devicefilehis.setDeviceid(device.getDeviceid());
						devicefilehis.setObjtype(objtype);
						devicefilehis.setObjid(id);
						devicefilehis.setSize(devicefile.getSize());
						devicefilehisMapper.insertSelective(devicefilehis);
					}
					devicefile.setProgress(progress);
					devicefile.setStatus("" + status);
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
			logger.error("Pixsignage3 Service report_file exception", e);
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
			logger.info("Pixsignage3 Service report_screen: {}, screenHeader: {}", request, screenHeader);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1007, "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult(1008, "终端号不能为空");
			}
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult(1009, "无效终端号" + terminalid);
			} else if (device.getStatus().equals("0") || !device.getHardkey().equals(hardkey)) {
				return handleResult(1010, "硬件码和终端号不匹配");
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
			logger.info("Pixsignage3 Service report_screen response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage3 Service report_screen exception", e);
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
			logger.info("Pixsignage3 Service report_debug: {}, debugHeader: {}", request, debugHeader);
			JSONObject requestJson = JSONObject.fromObject(request);
			String hardkey = requestJson.optString("hardkey");
			String terminalid = requestJson.optString("terminal_id");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1007, "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult(1008, "终端号不能为空");
			}
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult(1009, "无效终端号" + terminalid);
			} else if (device.getStatus().equals("0") || !device.getHardkey().equals(hardkey)) {
				return handleResult(1010, "硬件码和终端号不匹配");
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
			logger.info("Pixsignage3 Service report_debug response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage3 Service report_debug exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_crash")
	public String reportcrash(String request) {
		try {
			logger.info("Pixsignage3 Service report_crash: {}", request);
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
			logger.error("Pixsignage3 Service report_crash exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("get_baidu_weather")
	@Produces("application/json;charset=UTF-8")
	public String get_baidu_weather(@QueryParam("terminal_id") String terminalid, @QueryParam("city") String city) {
		try {
			logger.info("Pixsignage3 Service get_baidu_weather: terminal_id={},city={}", terminalid, city);

			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult(1004, "无效终端号" + terminalid);
			}
			if (city == null || city.length() == 0) {
				city = device.getCity();
			}
			if (city == null || city.length() == 0) {
				Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
				city = org.getCity();
			}
			if (city == null || city.length() == 0) {
				city = "深圳";
			}

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			responseJson.put("city", city);
			Weather weather = weatherService.selectByCity(Weather.Type_Baidu, city);
			responseJson.put("weather", JSONObject.fromObject(weather.getWeather()));
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage3 Service get_baidu_weather exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("get_yahoo_weather")
	@Produces("application/json;charset=UTF-8")
	public String get_yahoo_weather(@QueryParam("terminal_id") String terminalid, @QueryParam("city") String city) {
		try {
			logger.info("Pixsignage3 Service get_yahoo_weather: terminal_id={},city={}", terminalid, city);

			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult(1004, "无效终端号" + terminalid);
			}
			if (city == null || city.length() == 0) {
				city = device.getCity();
			}
			if (city == null || city.length() == 0) {
				Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
				city = org.getCity();
			}
			if (city == null || city.length() == 0) {
				city = "深圳";
			}

			Weather weather = weatherService.selectByCity(Weather.Type_Yahoo, city);
			if (weather.getWeather() != null && weather.getWeather().length() > 0) {
				JSONObject responseJson = new JSONObject();
				responseJson.put("code", 0);
				responseJson.put("message", "成功");
				responseJson.put("city", city);
				responseJson.put("weather", JSONObject.fromObject(weather.getWeather()));
				return responseJson.toString();
			} else {
				return handleResult(1009, "天气无法获得");
			}
		} catch (Exception e) {
			logger.error("Pixsignage3 Service get_yahoo_weather exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	private String handleResult(int code, String message) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("code", code);
		responseJson.put("message", message);
		logger.info("Pixsignage3 Service response: {}", responseJson.toString());
		return responseJson.toString();
	}

}
