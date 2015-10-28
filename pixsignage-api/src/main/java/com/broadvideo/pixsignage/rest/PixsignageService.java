package com.broadvideo.pixsignage.rest;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Crashreport;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicefile;
import com.broadvideo.pixsignage.domain.Dvb;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Layout;
import com.broadvideo.pixsignage.domain.Layoutdtl;
import com.broadvideo.pixsignage.domain.Layoutschedule;
import com.broadvideo.pixsignage.domain.Medialistdtl;
import com.broadvideo.pixsignage.domain.Medialistdtl;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Regionschedule;
import com.broadvideo.pixsignage.domain.Stream;
import com.broadvideo.pixsignage.domain.Text;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.domain.Widget;
import com.broadvideo.pixsignage.persistence.CrashreportMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicefileMapper;
import com.broadvideo.pixsignage.persistence.DvbMapper;
import com.broadvideo.pixsignage.persistence.LayoutMapper;
import com.broadvideo.pixsignage.persistence.LayoutscheduleMapper;
import com.broadvideo.pixsignage.persistence.MedialistdtlMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.persistence.RegionscheduleMapper;
import com.broadvideo.pixsignage.persistence.StreamMapper;
import com.broadvideo.pixsignage.persistence.TextMapper;
import com.broadvideo.pixsignage.persistence.WidgetMapper;

@Component
@Consumes("application/json;charset=UTF-8")
@Produces("application/json;charset=UTF-8")
@Path("/v1.0")
public class PixsignageService {

	private static final Logger log = Logger.getLogger(PixsignageService.class);

	private SimpleDateFormat outformat = new SimpleDateFormat("yyyyMMddHHmmss");
	private SimpleDateFormat fullformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd");
	private SimpleDateFormat timeformat = new SimpleDateFormat("HH:mm:ss");

	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private TextMapper textMapper;
	@Autowired
	private StreamMapper streamMapper;
	@Autowired
	private DvbMapper dvbMapper;
	@Autowired
	private WidgetMapper widgetMapper;
	@Autowired
	private MedialistdtlMapper medialistdtlMapper;
	@Autowired
	private LayoutMapper layoutMapper;
	@Autowired
	private LayoutscheduleMapper layoutscheduleMapper;
	@Autowired
	private RegionscheduleMapper regionscheduleMapper;
	@Autowired
	private DevicefileMapper devicefileMapper;
	@Autowired
	private CrashreportMapper crashreportMapper;

	@POST
	@Path("init")
	public String init(String request) {
		try {
			log.info("Pixsignage Service init: " + request);
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			String ip = requestJson.getString("ip");
			String mac = requestJson.getString("mac");
			String version = requestJson.getString("version");

			if (hardkey == null || hardkey.equals("")) {
				return handleResult("1002", "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult("1003", "终端号不能为空");
			}

			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device != null && !device.getTerminalid().equals(terminalid)) {
				device.setHardkey(null);
				device.setStatus("0");
				deviceMapper.updateByPrimaryKey(device);
			}

			device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult("1004", "无效终端号" + terminalid);
			} else if (device.getStatus().equals("1") && device.getHardkey() != null
					&& !device.getHardkey().equals(hardkey)) {
				return handleResult("1005", terminalid + "已经被别的终端注册.");
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

			JSONObject responseJson = new JSONObject().put("code", "0").put("message", "成功");
			responseJson.put("msg_server", CommonConfig.CONFIG_SERVER_IP);
			String msgtopic = device.getTerminalid();
			if (device.getDevicegroup() != null) {
				msgtopic += ",group-" + device.getDevicegroup().getDevicegroupid();
			}
			responseJson.put("msg_topic", msgtopic);
			Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
			if (org.getBackupvideo() != null) {
				JSONObject backupvideoJson = new JSONObject();
				backupvideoJson.put("type", "video");
				backupvideoJson.put("id", "" + org.getBackupvideoid());
				backupvideoJson.put("url", "http://" + CommonConfig.CONFIG_SERVER_IP + ":"
						+ CommonConfig.CONFIG_SERVER_PORT + "/pixsigdata" + org.getBackupvideo().getFilename());
				backupvideoJson.put("size", "" + org.getBackupvideo().getSize());
				responseJson.put("backup_media", backupvideoJson);
			}
			log.info("Pixsignage Service init response: " + responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return handleResult("1001", "系统异常:" + e.getMessage());
		}
	}

	@POST
	@Path("get_version")
	public String getversion(String request) {
		try {
			log.info("Pixsignage Service get_version: " + request);
			JSONObject responseJson = new JSONObject().put("code", "0").put("message", "成功");
			responseJson.put("version_name", CommonConfig.CONFIG_APP_VERSION_NAME);
			responseJson.put("version_code", CommonConfig.CONFIG_APP_VERSION_CODE);
			responseJson.put("name", "http://" + CommonConfig.CONFIG_SERVER_IP + ":" + CommonConfig.CONFIG_SERVER_PORT
					+ "/pixdata/app/" + CommonConfig.CONFIG_APP_VERSION_FILE);
			log.info("Pixsignage Service get_version response: " + responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return handleResult("1001", "系统异常:" + e.getMessage());
		}
	}

	@POST
	@Path("get_layout")
	public String getlayout(String request) {
		try {
			log.info("Pixsignage Service get_layout: " + request);
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult("1002", "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult("1003", "终端号不能为空");
			}
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult("1004", "无效终端号" + terminalid);
			} else if (!device.getStatus().equals("1") || !device.getHardkey().equals(hardkey)) {
				return handleResult("1006", "硬件码和终端号不匹配");
			}

			JSONObject responseJson = new JSONObject().put("code", "0").put("message", "成功");
			JSONArray layoutJsonArray = new JSONArray();
			responseJson.put("layouts", layoutJsonArray);
			JSONArray layoutScheduleJsonArray = new JSONArray();
			responseJson.put("layout_schedules", layoutScheduleJsonArray);

			List<Layoutschedule> layoutscheduleList;
			if (device.getDevicegroupid() > 0) {
				layoutscheduleList = layoutscheduleMapper.selectList("2", "" + device.getDevicegroupid());
			} else {
				layoutscheduleList = layoutscheduleMapper.selectList("1", "" + device.getDeviceid());
			}

			for (Layoutschedule layoutschedule : layoutscheduleList) {
				Layout layout = layoutMapper.selectByPrimaryKey("" + layoutschedule.getLayoutid());
				JSONObject layoutJson = new JSONObject();
				layoutJsonArray.put(layoutJson);
				layoutJson.put("layout_id", "" + layout.getLayoutid());
				layoutJson.put("width", "" + layout.getWidth());
				layoutJson.put("height", "" + layout.getHeight());
				layoutJson.put("bg_color", "#000000");
				JSONArray regionJsonArray = new JSONArray();
				layoutJson.put("regions", regionJsonArray);
				for (Layoutdtl layoutdtl : layout.getLayoutdtls()) {
					JSONObject regionJson = new JSONObject();
					regionJsonArray.put(regionJson);
					regionJson.put("region_id", "" + layoutdtl.getRegionid());
					regionJson.put("width", "" + layoutdtl.getWidth());
					regionJson.put("height", "" + layoutdtl.getHeight());
					regionJson.put("top", "" + layoutdtl.getTopoffset());
					regionJson.put("left", "" + layoutdtl.getLeftoffset());
					regionJson.put("zindex", "" + layoutdtl.getZindex());
					regionJson.put("type", "" + layoutdtl.getRegion().getType());
					if (layoutdtl.getRegion().getType().equals("0")) {
						regionJson.put("interval", "" + layoutdtl.getIntervaltime());
					} else {
						regionJson.put("direction", "" + layoutdtl.getDirection());
						regionJson.put("speed", "" + layoutdtl.getSpeed());
						regionJson.put("color", "" + layoutdtl.getColor());
						regionJson.put("size", "" + layoutdtl.getSize());
						regionJson.put("opacity", "" + layoutdtl.getOpacity());
					}
				}

				JSONObject layoutScheduleJson = new JSONObject();
				layoutScheduleJsonArray.put(layoutScheduleJson);
				layoutScheduleJson.put("layout_id", "" + layoutschedule.getLayoutid());
				if (layoutschedule.getStarttime() != null) {
					layoutScheduleJson.put("start_time", outformat.format(layoutschedule.getStarttime()));
				} else {
					layoutScheduleJson.put("start_time", "");
				}
				if (layoutschedule.getEndtime() != null) {
					layoutScheduleJson.put("end_time", outformat.format(layoutschedule.getEndtime()));
				} else {
					layoutScheduleJson.put("end_time", "");
				}
			}

			log.info("Pixsignage Service get_layout response: " + responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return handleResult("1001", "系统异常:" + e.getMessage());
		}
	}

	@POST
	@Path("get_region")
	public String getregion(String request) {
		try {
			log.info("Pixsignage Service get_region: " + request);
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			String regionid = requestJson.getString("region_id");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult("1002", "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult("1003", "终端号不能为空");
			}
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult("1004", "无效终端号" + terminalid);
			} else if (!device.getStatus().equals("1") || !device.getHardkey().equals(hardkey)) {
				return handleResult("1006", "硬件码和终端号不匹配");
			}
			if (regionid == null || regionid.equals("")) {
				return handleResult("1007", "region_id不能为空");
			}

			HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();
			HashMap<Integer, JSONObject> imageHash = new HashMap<Integer, JSONObject>();
			HashMap<Integer, JSONObject> textHash = new HashMap<Integer, JSONObject>();
			HashMap<Integer, JSONObject> streamHash = new HashMap<Integer, JSONObject>();
			HashMap<Integer, JSONObject> dvbHash = new HashMap<Integer, JSONObject>();
			HashMap<Integer, JSONObject> widgetHash = new HashMap<Integer, JSONObject>();

			JSONObject responseJson = new JSONObject().put("code", "0").put("message", "成功");
			responseJson.put("region_id", regionid);
			JSONArray videoJsonArray = new JSONArray();
			responseJson.put("videos", videoJsonArray);
			JSONArray imageJsonArray = new JSONArray();
			responseJson.put("images", imageJsonArray);
			JSONArray textJsonArray = new JSONArray();
			responseJson.put("texts", textJsonArray);
			JSONArray streamJsonArray = new JSONArray();
			responseJson.put("streams", streamJsonArray);
			JSONArray dvbJsonArray = new JSONArray();
			responseJson.put("dvbs", dvbJsonArray);
			JSONArray widgetJsonArray = new JSONArray();
			responseJson.put("widgets", widgetJsonArray);
			JSONArray scheduleJsonArray = new JSONArray();
			responseJson.put("schedules", scheduleJsonArray);

			List<Regionschedule> finalscheduleList = new ArrayList<Regionschedule>();
			List<Regionschedule> regionscheduleList1;
			List<Regionschedule> regionscheduleList2;
			Calendar.getInstance().getTime();
			String today = dateformat.format(Calendar.getInstance().getTime());
			String tomorrow = dateformat.format(new Date(Calendar.getInstance().getTimeInMillis() + 24 * 3600 * 1000));
			if (device.getDevicegroupid() > 0) {
				regionscheduleList1 = regionscheduleMapper.selectList("2", "" + device.getDevicegroupid(), regionid,
						"2", null, null);
				regionscheduleList2 = regionscheduleMapper.selectList("2", "" + device.getDevicegroupid(), regionid,
						"1", today, tomorrow);
			} else {
				regionscheduleList1 = regionscheduleMapper.selectList("1", "" + device.getDeviceid(), regionid, "2",
						null, null);
				regionscheduleList2 = regionscheduleMapper.selectList("1", "" + device.getDeviceid(), regionid, "1",
						today, tomorrow);
			}

			for (Regionschedule regionschedule : regionscheduleList1) {
				Regionschedule newschedule = new Regionschedule();
				newschedule.setObjtype(regionschedule.getObjtype());
				newschedule.setObjid(regionschedule.getObjid());
				newschedule.setTempstarttime(
						fullformat.parse(today + " " + timeformat.format(regionschedule.getStarttime())));
				finalscheduleList.add(newschedule);
			}
			for (Regionschedule regionschedule : regionscheduleList1) {
				Regionschedule newschedule = new Regionschedule();
				newschedule.setObjtype(regionschedule.getObjtype());
				newschedule.setObjid(regionschedule.getObjid());
				newschedule.setTempstarttime(
						fullformat.parse(tomorrow + " " + timeformat.format(regionschedule.getStarttime())));
				finalscheduleList.add(newschedule);
			}

			// merge
			for (Regionschedule regionschedule : regionscheduleList2) {
				Date starttime = fullformat.parse(dateformat.format(regionschedule.getPlaydate()) + " "
						+ timeformat.format(regionschedule.getStarttime()));
				Date endtime = fullformat.parse(dateformat.format(regionschedule.getPlaydate()) + " "
						+ timeformat.format(regionschedule.getEndtime()));
				Regionschedule newschedule = new Regionschedule();
				newschedule.setObjtype(regionschedule.getObjtype());
				newschedule.setObjid(regionschedule.getObjid());
				newschedule.setTempstarttime(starttime);

				Iterator<Regionschedule> it = finalscheduleList.iterator();
				Regionschedule lastClosedSchedule = null;
				Regionschedule lastRemoveSchedule = null;
				int index = 0;
				while (it.hasNext()) {
					Regionschedule temp = it.next();
					if (temp.getTempstarttime().before(starttime)) {
						lastClosedSchedule = temp;
						index++;
					}
					if (temp.getTempstarttime().equals(starttime)
							|| temp.getTempstarttime().after(starttime) && temp.getTempstarttime().before(endtime)) {
						lastRemoveSchedule = temp;
						it.remove();
					}
				}
				if (lastRemoveSchedule != null) {
					lastRemoveSchedule.setTempstarttime(endtime);
					finalscheduleList.add(index, newschedule);
					finalscheduleList.add(index + 1, lastRemoveSchedule);
				} else if (lastClosedSchedule != null) {
					lastRemoveSchedule = new Regionschedule();
					lastRemoveSchedule.setObjtype(lastClosedSchedule.getObjtype());
					lastRemoveSchedule.setObjid(lastClosedSchedule.getObjid());
					lastRemoveSchedule.setTempstarttime(endtime);
					finalscheduleList.add(index, newschedule);
					finalscheduleList.add(index + 1, lastRemoveSchedule);
				} else {
					finalscheduleList.add(index, newschedule);
				}
			}

			// generate final json
			for (Regionschedule regionschedule : finalscheduleList) {
				JSONObject scheduleJson = new JSONObject();
				scheduleJson.put("start_time", outformat.format(regionschedule.getTempstarttime()));
				if (regionschedule.getObjtype().equals("1")) {
					scheduleJson.put("type", "list");
				} else if (regionschedule.getObjtype().equals("2")) {
					scheduleJson.put("type", "text");
				} else if (regionschedule.getObjtype().equals("3")) {
					scheduleJson.put("type", "stream");
				} else if (regionschedule.getObjtype().equals("4")) {
					scheduleJson.put("type", "dvb");
				} else if (regionschedule.getObjtype().equals("5")) {
					scheduleJson.put("type", "widget");
				}
				JSONArray dtlJsonArray = new JSONArray();
				scheduleJson.put("dtls", dtlJsonArray);
				scheduleJsonArray.put(scheduleJson);

				String objtype = regionschedule.getObjtype();
				String objid = "" + regionschedule.getObjid();
				if (objtype.equals("1")) {
					List<Medialistdtl> medialistdtls = medialistdtlMapper.selectList(objid);
					for (Medialistdtl medialistdtl : medialistdtls) {
						if (medialistdtl.getVideo() != null) {
							Video video = medialistdtl.getVideo();
							dtlJsonArray.put("video-" + video.getVideoid());
							if (videoHash.get(medialistdtl.getObjid()) == null) {
								JSONObject videoJson = new JSONObject();
								videoJson.put("id", "video-" + video.getVideoid());
								videoJson.put("url", "http://" + CommonConfig.CONFIG_SERVER_IP + ":"
										+ CommonConfig.CONFIG_SERVER_PORT + "/pixsigdata" + video.getFilename());
								videoJson.put("size", "" + video.getSize());
								videoHash.put(video.getVideoid(), videoJson);
								videoJsonArray.put(videoJson);
							}
						} else if (medialistdtl.getImage() != null) {
							Image image = medialistdtl.getImage();
							dtlJsonArray.put("image-" + image.getImageid());
							if (imageHash.get(medialistdtl.getObjid()) == null) {
								JSONObject imageJson = new JSONObject();
								imageJson.put("id", "image-" + image.getImageid());
								imageJson.put("url", "http://" + CommonConfig.CONFIG_SERVER_IP + ":"
										+ CommonConfig.CONFIG_SERVER_PORT + "/pixsigdata" + image.getFilename());
								imageJson.put("size", "" + image.getSize());
								imageHash.put(image.getImageid(), imageJson);
								imageJsonArray.put(imageJson);
							}
						}
					}
				} else if (objtype.equals("2")) {
					Text text = textMapper.selectByPrimaryKey(objid);
					if (text != null) {
						dtlJsonArray.put("text-" + text.getTextid());
						if (textHash.get(text.getTextid()) == null) {
							JSONObject textJson = new JSONObject();
							textJson.put("id", "text-" + text.getTextid());
							textJson.put("text", text.getText());
							textHash.put(text.getTextid(), textJson);
							textJsonArray.put(textJson);
						}
					}
				} else if (objtype.equals("3")) {
					Stream stream = streamMapper.selectByPrimaryKey(objid);
					if (stream != null) {
						dtlJsonArray.put("stream-" + stream.getStreamid());
						if (streamHash.get(stream.getStreamid()) == null) {
							JSONObject streamJson = new JSONObject();
							streamJson.put("id", "stream-" + stream.getStreamid());
							streamJson.put("url", stream.getUrl());
							streamHash.put(stream.getStreamid(), streamJson);
							streamJsonArray.put(streamJson);
						}
					}
				} else if (objtype.equals("4")) {
					Dvb dvb = dvbMapper.selectByPrimaryKey(objid);
					if (dvb != null) {
						dtlJsonArray.put("dvb-" + dvb.getDvbid());
						if (dvbHash.get(dvb.getDvbid()) == null) {
							JSONObject dvbJson = new JSONObject();
							dvbJson.put("id", "dvb-" + dvb.getDvbid());
							dvbJson.put("frequency", dvb.getFrequency());
							dvbHash.put(dvb.getDvbid(), dvbJson);
							dvbJsonArray.put(dvbJson);
						}
					}
				} else if (objtype.equals("5")) {
					Widget widget = widgetMapper.selectByPrimaryKey(objid);
					if (widget != null) {
						dtlJsonArray.put("widget-" + widget.getWidgetid());
						if (widgetHash.get(widget.getWidgetid()) == null) {
							JSONObject widgetJson = new JSONObject();
							widgetJson.put("id", "widget-" + widget.getWidgetid());
							widgetJson.put("url", widget.getUrl());
							widgetHash.put(widget.getWidgetid(), widgetJson);
							widgetJsonArray.put(widgetJson);
						}
					}
				}
			}

			log.info("Pixsignage Service get_region response: " + responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return handleResult("1001", "系统异常:" + e.getMessage());
		}
	}

	@POST
	@Path("report_status")
	public String reportstatus(String request) {
		try {
			log.info("Pixsignage Service report_status: " + request);
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			String status = requestJson.getString("status");

			if (hardkey == null || hardkey.equals("")) {
				return handleResult("1002", "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult("1003", "终端号不能为空");
			}
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult("1004", "无效终端号" + terminalid);
			} else if (!device.getStatus().equals("1") || !device.getHardkey().equals(hardkey)) {
				return handleResult("1006", "硬件码和终端号不匹配");
			}

			device.setOnlineflag("1");
			deviceMapper.updateByPrimaryKeySelective(device);

			JSONObject responseJson = new JSONObject().put("code", "0").put("message", "成功");
			return responseJson.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return handleResult("1001", "系统异常:" + e.getMessage());
		}
	}

	@POST
	@Path("report_file")
	public String reportfile(String request) {
		try {
			log.info("Pixsignage Service report_file: " + request);
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult("1002", "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult("1003", "终端号不能为空");
			}
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult("1004", "无效终端号" + terminalid);
			} else if (!device.getStatus().equals("1") || !device.getHardkey().equals(hardkey)) {
				return handleResult("1006", "硬件码和终端号不匹配");
			}

			JSONArray fileJsonArray = requestJson.getJSONArray("files");
			for (int i = 0; i < fileJsonArray.length(); i++) {
				JSONObject fileJson = fileJsonArray.getJSONObject(i);
				String id = fileJson.getString("id");
				int progress = Integer.parseInt(fileJson.getString("progress"));
				String status = fileJson.getString("status");
				String desc = fileJson.getString("desc");
				if (id.startsWith("video-")) {
					id = id.substring(6);
					Devicefile devicefile = devicefileMapper.selectByDeviceMedia("" + device.getDeviceid(), "1", id);
					if (devicefile != null) {
						devicefile.setProgress(progress);
						devicefile.setStatus(status);
						devicefile.setDescription(desc);
						devicefile.setUpdatetime(Calendar.getInstance().getTime());
						devicefileMapper.updateByPrimaryKeySelective(devicefile);
					}
				} else if (id.startsWith("image-")) {
					id = id.substring(6);
					Devicefile devicefile = devicefileMapper.selectByDeviceMedia("" + device.getDeviceid(), "2", id);
					if (devicefile != null) {
						devicefile.setProgress(progress);
						devicefile.setStatus(status);
						devicefile.setDescription(desc);
						devicefile.setUpdatetime(Calendar.getInstance().getTime());
						devicefileMapper.updateByPrimaryKeySelective(devicefile);
					}
				}
			}

			JSONObject responseJson = new JSONObject().put("code", "0").put("message", "成功");
			return responseJson.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return handleResult("1001", "系统异常:" + e.getMessage());
		}
	}

	@POST
	@Path("report_msg")
	public String reportmsg(String request) {
		try {
			log.info("Pixsignage Service report_msg: " + request);
			JSONObject requestJson = new JSONObject(request);
			String hardkey = requestJson.getString("hardkey");
			String terminalid = requestJson.getString("terminal_id");
			if (hardkey == null || hardkey.equals("")) {
				return handleResult("1002", "硬件码不能为空");
			}
			if (terminalid == null || terminalid.equals("")) {
				return handleResult("1003", "终端号不能为空");
			}
			Device device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult("1004", "无效终端号" + terminalid);
			} else if (!device.getStatus().equals("1") || !device.getHardkey().equals(hardkey)) {
				return handleResult("1006", "硬件码和终端号不匹配");
			}

			String msguuid = requestJson.getString("msg_uuid");

			JSONObject responseJson = new JSONObject().put("code", "0").put("message", "成功");
			return responseJson.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return handleResult("1001", "系统异常:" + e.getMessage());
		}
	}

	@POST
	@Path("report_crash")
	public String reportcrash(String request) {
		try {
			log.info("Pixsignage Service report_crash: " + request);
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

			JSONObject responseJson = new JSONObject().put("code", "0").put("message", "成功");
			return responseJson.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return handleResult("1001", "系统异常:" + e.getMessage());
		}
	}

	private String handleResult(String code, String message) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("code", code);
		responseJson.put("message", message);
		log.info("Pixsignage Service response: " + responseJson.toString());
		return responseJson.toString();
	}

}
