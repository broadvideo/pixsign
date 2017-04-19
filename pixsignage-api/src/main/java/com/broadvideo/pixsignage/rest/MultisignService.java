package com.broadvideo.pixsignage.rest;

import java.io.File;
import java.io.FilenameFilter;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

import org.apache.commons.io.comparator.LastModifiedFileComparator;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.domain.Crashreport;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Onlinelog;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.CrashreportMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.OnlinelogMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.service.ScheduleService;
import com.broadvideo.pixsignage.util.ipparse.IPSeeker;

@Component
@Consumes("application/json;charset=UTF-8")
@Produces("application/json;charset=UTF-8")
@Path("/multisign")
public class MultisignService {
	private static Hashtable<String, String> CONFIG_SIGNATURE = new Hashtable<String, String>();

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
	private MsgeventMapper msgeventMapper;
	@Autowired
	private CrashreportMapper crashreportMapper;

	@Autowired
	private ScheduleService scheduleService;

	@POST
	@Path("init")
	public String init(String request, @Context HttpServletRequest req) {
		try {
			logger.info("Multisign Service init: {}, from {}, {}", request, req.getRemoteAddr(), req.getRemoteHost());
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			String mac = requestJson.getString("mac");
			String iip = requestJson.getString("ip");
			String appname = requestJson.getString("app_name");
			String sign = requestJson.getString("sign");
			String vname = requestJson.getString("version_name");
			int vcode = requestJson.getInt("version_code");
			String ip = req.getRemoteAddr();
			String other = requestJson.getString("other");

			if (hardkey == null || hardkey.equals("")) {
				return handleResult(1002, "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult(1003, "终端号不能为空");
			}

			String mtype = "";
			if (sign != null && sign.length() > 0) {
				mtype = CONFIG_SIGNATURE.get(sign);
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
				logger.error("Multisign Service ip seek exception", e);
			}

			if (!device.getStatus().equals("1")) {
				device.setActivetime(Calendar.getInstance().getTime());
			}
			device.setHardkey(hardkey);
			device.setIp(ip);
			device.setIip(iip);
			device.setMac(mac);
			device.setAppname(appname);
			device.setSign(sign);
			device.setVname(vname);
			device.setVcode(vcode);
			device.setMtype(mtype);
			device.setStatus("1");
			device.setSchedulestatus("0");
			device.setFilestatus("0");
			device.setOnlineflag("1");
			device.setRefreshtime(Calendar.getInstance().getTime());
			deviceMapper.updateByPrimaryKey(device);

			onlinelogMapper.updateLast2Offline("" + device.getDeviceid());
			Onlinelog onlinelog = new Onlinelog();
			onlinelog.setOrgid(device.getOrgid());
			onlinelog.setBranchid(device.getBranchid());
			onlinelog.setDeviceid(device.getDeviceid());
			onlinelog.setOnlinetime(Calendar.getInstance().getTime());
			onlinelogMapper.insertSelective(onlinelog);

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
			responseJson.put("device_grid_id", device.getDevicegridid());
			responseJson.put("xpos", device.getXpos());
			responseJson.put("ypos", device.getYpos());
			if (device.getXpos().intValue() == 0 && device.getYpos().intValue() == 0) {
				responseJson.put("master_flag", 1);
			} else {
				responseJson.put("master_flag", 0);
			}

			logger.info("Multisign Service init response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Multisign Service init exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("get_schedule")
	public String getschedule(String request) {
		try {
			logger.info("Multisign Service get_schedule: {}", request);
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

			JSONArray multiJSONArray = scheduleService.generateScheduleJson("" + device.getDeviceid())
					.getJSONArray("multi_schedules");
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0).put("message", "成功");
			responseJson.put("schedules", multiJSONArray);
			logger.info("Multisign Service get_schedule response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Multisign Service get_schedule exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("refresh")
	public String refresh(String request) {
		try {
			if (CONFIG_SIGNATURE.size() == 0) {
				Properties properties = new Properties();
				InputStream is = this.getClass().getResourceAsStream("/signature.properties");
				properties.load(is);
				CONFIG_SIGNATURE = new Hashtable<String, String>();
				Iterator<Entry<Object, Object>> it = properties.entrySet().iterator();
				while (it.hasNext()) {
					Entry<Object, Object> entry = it.next();
					CONFIG_SIGNATURE.put(entry.getValue().toString(), entry.getKey().toString());
				}
				is.close();
			}

			logger.info("Multisign Service refresh: {}", request);
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			String status = requestJson.getString("status");
			String mediatype = requestJson.getString("media_type");
			int mediaid = requestJson.getInt("media_id");
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

			onlinelogMapper.updateLast2Online("" + device.getDeviceid());

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");

			String vname = "";
			String vcode = "0";
			String url = "";
			Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
			if (org.getUpgradeflag().equals("0")) {
				logger.info("Auto upgrade disabled, Multisign Service get-version response: {}",
						responseJson.toString());
			} else {
				String appname = device.getAppname();
				String sign = device.getSign();
				String subdir = "";
				if (sign != null && sign.length() > 0) {
					subdir = CONFIG_SIGNATURE.get(sign);
					if (subdir == null) {
						subdir = "debug";
						logger.info("sign {} unrecognized, set as debug", sign);
					}
					subdir = "/" + subdir;
					File dir = new File("/opt/pixdata/app" + subdir);
					File[] files = dir.listFiles(new FilenameFilter() {
						@Override
						public boolean accept(File dir, String name) {
							return name.startsWith(appname + "-") && name.endsWith((".apk"));
						}
					});
					if (files.length > 0) {
						Arrays.sort(files, LastModifiedFileComparator.LASTMODIFIED_REVERSE);
						String filename = files[0].getName();
						url = "http://" + configMapper.selectValueByCode("ServerIP") + ":"
								+ configMapper.selectValueByCode("ServerPort") + "/pixdata/app" + subdir + "/"
								+ filename;
						String[] apks = filename.split("-");
						if (apks.length >= 3) {
							vname = apks[1];
							vcode = apks[2];
							if (vcode.indexOf(".") > 0) {
								vcode = vcode.substring(0, vcode.indexOf("."));
							}
							int v = 0;
							try {
								v = Integer.parseInt(vcode);
							} catch (Exception e) {
								v = 0;
							}
							if (device.getVcode() < v) {
								responseJson.put("version_name", vname);
								responseJson.put("version_code", vcode);
								responseJson.put("url", url);
							}
						}
					}
				}
			}

			JSONArray eventJsonArray = new JSONArray();
			responseJson.put("events", eventJsonArray);
			if (device.getDevicegridid() > 0) {
				List<Msgevent> msgevents = msgeventMapper.selectList(Msgevent.MsgType_Schedule,
						Msgevent.ObjType_1_Device, "" + device.getDeviceid(), null, Msgevent.Status_Wait);
				if (msgevents.size() > 0) {
					Msgevent msgevent = msgevents.get(0);
					JSONObject eventJson = new JSONObject();
					eventJsonArray.put(eventJson);
					eventJson.put("event_type", "schedule");
					JSONObject contentJson = new JSONObject();
					contentJson.put("schedules", scheduleService.generateScheduleJson("" + device.getDeviceid())
							.getJSONArray("multi_schedules"));
					eventJson.put("event_content", contentJson);
					msgevent.setStatus(Msgevent.Status_Sent);
					msgeventMapper.updateByPrimaryKeySelective(msgevent);
				}
			}

			if (responseJson.getString("url").length() > 0 || responseJson.getJSONArray("events").length() > 0) {
				logger.info("Multisign Service refresh response: {}", responseJson.toString());
			}
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Multisign Service refresh exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("report_crash")
	public String reportcrash(String request) {
		try {
			logger.info("Multisign Service report_crash: {}", request);
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
			logger.error("Multisign Service report_crash exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	private String handleResult(int code, String message) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("code", code);
		responseJson.put("message", message);
		logger.info("Multisign Service response: {}", responseJson.toString());
		return responseJson.toString();
	}

}
