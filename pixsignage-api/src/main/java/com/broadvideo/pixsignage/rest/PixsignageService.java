package com.broadvideo.pixsignage.rest;

import java.io.File;
import java.io.FilenameFilter;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;
import java.util.Properties;

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
import org.apache.commons.io.comparator.LastModifiedFileComparator;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Crashreport;
import com.broadvideo.pixsignage.domain.Debugreport;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicefile;
import com.broadvideo.pixsignage.domain.Dvb;
import com.broadvideo.pixsignage.domain.Flowlog;
import com.broadvideo.pixsignage.domain.Onlinelog;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Weather;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.CrashreportMapper;
import com.broadvideo.pixsignage.persistence.DebugreportMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DvbMapper;
import com.broadvideo.pixsignage.persistence.FlowlogMapper;
import com.broadvideo.pixsignage.persistence.OnlinelogMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.service.BundleService;
import com.broadvideo.pixsignage.service.DevicefileService;
import com.broadvideo.pixsignage.service.WeatherService;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.EduCloudUtil;
import com.broadvideo.pixsignage.util.PixedxUtil;
import com.broadvideo.pixsignage.util.ipparse.IPSeeker;

@Component
@Consumes("application/json;charset=UTF-8")
@Produces("application/json;charset=UTF-8")
@Path("/v1.0")
public class PixsignageService {
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
	private DvbMapper dvbMapper;
	@Autowired
	private CrashreportMapper crashreportMapper;
	@Autowired
	private DebugreportMapper debugreportMapper;
	@Autowired
	private FlowlogMapper flowlogMapper;

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
			String iip = requestJson.getString("ip");
			String appname = requestJson.getString("app_name");
			String sign = requestJson.getString("sign");
			String version = requestJson.getString("version");
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
			String oldhardkey = hardkey;
			if (device != null && !device.getTerminalid().equals(terminalid)) {
				device.setHardkey(null);
				device.setStatus("0");
				deviceMapper.updateByPrimaryKey(device);
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
			} else if (!device.getType().equals(Device.Type_Sign)) {
				return handleResult(1010, "终端类型不匹配");
			} else if (device.getStatus().equals("1") && device.getHardkey() != null
					&& !device.getHardkey().equals(hardkey) && !device.getHardkey().equals(oldhardkey)) {
				return handleResult(1005, terminalid + "已经被别的终端注册.");
			} else if (other != null && device.getOther().length() > 0 && !device.getOther().equals(other)) {
				return handleResult(1007, terminalid + "登录位置不符，已经锁定.");
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
			device.setAppname(appname);
			device.setVname(version);
			device.setMtype(mtype);
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

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
			responseJson.put("msg_server", configMapper.selectValueByCode("ServerIP") + ":1883");
			JSONArray topicJsonArray = new JSONArray();
			responseJson.put("msg_topic", topicJsonArray);
			topicJsonArray.put("device-" + device.getDeviceid());
			if (device.getDevicegroup() != null) {
				topicJsonArray.put("group-" + device.getDevicegroup().getDevicegroupid());
			}
			topicJsonArray.put("org-" + device.getOrgid());

			Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
			if (org.getBackupvideo() != null) {
				JSONObject backupvideoJson = new JSONObject();
				// backupvideoJson.put("type", "video");
				backupvideoJson.put("id", org.getBackupvideoid());
				backupvideoJson.put("url",
						"http://" + configMapper.selectValueByCode("ServerIP") + ":"
								+ configMapper.selectValueByCode("ServerPort") + "/pixsigdata"
								+ org.getBackupvideo().getFilepath());
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

			responseJson.put("password_flag", Integer.parseInt(org.getDevicepassflag()));
			responseJson.put("password", org.getDevicepass());

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

			JSONObject requestJson = new JSONObject(request);
			String terminalid = requestJson.getString("terminal_id");
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device != null) {
				Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
				if (org.getUpgradeflag().equals("0")) {
					JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
					responseJson.put("version_name", "");
					responseJson.put("version_code", "0");
					responseJson.put("url", "");
					logger.info("Auto upgrade disabled, Pixsignage Service get-version response: {}",
							responseJson.toString());
					return responseJson.toString();
				}
			}

			String appname = requestJson.getString("app_name");
			String sign = requestJson.getString("sign");
			String subdir = "";
			if (sign != null && sign.length() > 0) {
				subdir = CONFIG_SIGNATURE.get(sign);
				if (subdir == null) {
					logger.error("no apk found with the sign {}", sign);
					JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功")
							.put("version_name", "").put("version_code", "0").put("url", "");
					logger.info("Pixsignage Service get-version response: {}", responseJson.toString());
					return responseJson.toString();
				}
				subdir = "/" + subdir;
			}

			File dir = new File("/opt/pixdata/app" + subdir);
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
				url = "http://" + configMapper.selectValueByCode("ServerIP") + ":"
						+ configMapper.selectValueByCode("ServerPort") + "/pixdata/app" + subdir + "/" + filename;
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
			logger.info("Pixsignage Service get-version response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Pixsignage Service get-version exception, ", e);
			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功").put("version_name", "")
					.put("version_code", "0").put("url", "");
			logger.info("Pixsignage Service get-version response: {}", responseJson.toString());
			return responseJson.toString();
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
			return handleResult(1002, "不支持此命令");
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
			return handleResult(1002, "不支持此命令");
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
			String bundleid = requestJson.getString("bundle_id");
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

			/*
			 * if (mediatype.equals("video")) { Playlog playlog = new Playlog();
			 * playlog.setOrgid(device.getOrgid());
			 * playlog.setBranchid(device.getBranchid());
			 * playlog.setDeviceid(device.getDeviceid());
			 * playlog.setVideoid(mediaid);
			 * playlog.setStarttime(Calendar.getInstance().getTime());
			 * playlogMapper.insertSelective(playlog); }
			 */

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
	@Path("report_dvb")
	public String reportdvb(String request) {
		try {
			logger.info("Pixsignage Service report_dvb: {}", request);
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

			JSONArray dvbJsonArray = requestJson.getJSONArray("dvbs");

			Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
			List<Dvb> oldDvbList = dvbMapper.selectList("" + device.getOrgid(), null, null, null, null, null);
			HashMap<String, Dvb> oldDvbHash = new HashMap<String, Dvb>();
			HashMap<String, Dvb> newDvbHash = new HashMap<String, Dvb>();
			for (Dvb dvb : oldDvbList) {
				oldDvbHash.put(dvb.getNumber(), dvb);
			}

			if (dvbJsonArray != null) {
				for (int i = 0; i < dvbJsonArray.length(); i++) {
					JSONObject dvbJson = dvbJsonArray.getJSONObject(i);
					String name = dvbJson.getString("name");
					String num = "" + dvbJson.getInt("num");
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

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
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

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
			Weather weather = weatherService.selectByCity(Weather.Type_Baidu, city);
			responseJson.put("weather", new JSONObject(weather.getWeather()));
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
				JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
				responseJson.put("weather", new JSONObject(weather.getWeather()));
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
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			long starttime = requestJson.getLong("start_time");
			long endtime = requestJson.getLong("end_time");

			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null || !device.getStatus().equals("1")) {
				return handleResult(1004, "无效终端号" + terminalid);
			}

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
			JSONArray scheduleJsonArray = new JSONArray();
			responseJson.put("schedules", scheduleJsonArray);

			if (device.getExternalid().length() > 0) {
				String pixedxip = configMapper.selectValueByCode("PixedxIP");
				String pixedxport = configMapper.selectValueByCode("PixedxPort");
				if (pixedxip.equals("www.jzjyy.cn")) {
					DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
					String s1 = dateFormat.format(new Date(starttime));
					String s2 = dateFormat.format(new Date(endtime));
					String s = EduCloudUtil.getScheduleList(device.getExternalid(), s1, s2);
					if (s.length() > 0) {
						JSONObject json = new JSONObject(s);
						JSONArray dataJsonArray = json.getJSONArray("result");
						if (dataJsonArray != null) {
							for (int i = 0; i < dataJsonArray.length(); i++) {
								JSONObject dataJson = dataJsonArray.getJSONObject(i);
								Date d1 = CommonUtil.parseDate(dataJson.getString("startTime"), "yyyyMMddHHmmss");
								Date d2 = CommonUtil.parseDate(dataJson.getString("endTime"), "yyyyMMddHHmmss");
								JSONObject scheduleJson = new JSONObject();
								scheduleJson.put("name", dataJson.getString("courseName"));
								scheduleJson.put("host", dataJson.getString("teacherName"));
								scheduleJson.put("start_time", d1.getTime());
								scheduleJson.put("end_time", d2.getTime());
								scheduleJsonArray.put(scheduleJson);
							}
						}
					}
				} else {
					String server = "http://" + pixedxip + ":" + pixedxport;
					String s = PixedxUtil.schedules(server, device.getExternalid(), "" + starttime, "" + endtime);
					if (s.length() > 0) {
						JSONObject json = new JSONObject(s);
						JSONArray dataJsonArray = json.getJSONArray("data");
						for (int i = 0; i < dataJsonArray.length(); i++) {
							JSONObject dataJson = dataJsonArray.getJSONObject(i);
							JSONObject scheduleJson = new JSONObject();
							scheduleJson.put("name", dataJson.getString("course_name"));
							scheduleJson.put("host", dataJson.getString("instructor"));
							scheduleJson.put("start_time", dataJson.getLong("start_time"));
							scheduleJson.put("end_time", dataJson.getLong("end_time"));
							scheduleJsonArray.put(scheduleJson);
						}
					}
				}
			}

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

			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/screen/" + device.getDeviceid()));
			String filename = CommonConfig.CONFIG_PIXDATA_HOME + "/screen/" + device.getDeviceid() + "/screen-"
					+ device.getDeviceid() + "-"
					+ new SimpleDateFormat("yyyyMMddHHmmss").format(Calendar.getInstance().getTime()) + ".jpg";
			logger.info("Save screen snapshot to: {}", filename);
			File file = new File(filename);
			FileUtils.copyInputStreamToFile(screenFile, file);
			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
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

			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/playlog/" + device.getDeviceid()));
			String tempname = CommonConfig.CONFIG_PIXDATA_HOME + "/playlog/" + device.getDeviceid() + "/playlog-"
					+ device.getDeviceid() + "-"
					+ new SimpleDateFormat("yyyyMMddHHmmssSSS").format(Calendar.getInstance().getTime()) + ".tmp";
			String filename = tempname.substring(0, tempname.length() - 4) + ".zip.ok";
			logger.info("Save playlog to: {}", filename);
			File tempfile = new File(tempname);
			FileUtils.copyInputStreamToFile(playlogFile, tempfile);
			FileUtils.moveFile(tempfile, new File(filename));
			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
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

			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/pflow/" + device.getDeviceid()));
			String tempname = CommonConfig.CONFIG_PIXDATA_HOME + "/pflow/" + device.getDeviceid() + "/pflow-"
					+ device.getTerminalid() + "-"
					+ new SimpleDateFormat("yyyyMMddHHmmssSSS").format(Calendar.getInstance().getTime()) + ".tmp";
			String filename = tempname.substring(0, tempname.length() - 4) + ".zip.ok";
			logger.info("Save pflow to: {}", filename);
			File tempfile = new File(tempname);
			FileUtils.copyInputStreamToFile(pflowFile, tempfile);
			FileUtils.moveFile(tempfile, new File(filename));
			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
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
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			long starttime = requestJson.getLong("start_time");
			long endtime = requestJson.getLong("end_time");
			int total = requestJson.getInt("total_delta");
			int male = requestJson.getInt("male_delta");
			int female = requestJson.getInt("female_delta");
			int age1 = requestJson.getInt("child_delta");
			int age2 = requestJson.getInt("juvenile_delta");
			int age3 = requestJson.getInt("youndster_delta");
			int age4 = requestJson.getInt("middle_delta");
			int age5 = requestJson.getInt("elder_delta");

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

			Flowlog flowlog = new Flowlog();
			flowlog.setOrgid(device.getOrgid());
			flowlog.setBranchid(device.getBranchid());
			flowlog.setDeviceid(device.getDeviceid());
			flowlog.setUuid("" + starttime);
			Calendar c1 = Calendar.getInstance();
			c1.setTimeInMillis(starttime);
			Calendar c2 = Calendar.getInstance();
			c2.setTimeInMillis(endtime);
			flowlog.setStarttime(c1.getTime());
			flowlog.setEndtime(c2.getTime());
			flowlog.setTotal(total);
			flowlog.setMale(male);
			flowlog.setFemale(female);
			flowlog.setAge1(age1);
			flowlog.setAge2(age2);
			flowlog.setAge3(age3);
			flowlog.setAge4(age4);
			flowlog.setAge5(age5);
			flowlogMapper.insertSelective(flowlog);

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
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

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "成功");
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
