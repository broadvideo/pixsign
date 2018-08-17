package com.broadvideo.pixsignage.service;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Bundle;
import com.broadvideo.pixsignage.domain.Bundlezone;
import com.broadvideo.pixsignage.domain.Bundlezonedtl;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.domain.Pagezone;
import com.broadvideo.pixsignage.domain.Pagezonedtl;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.BundleMapper;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.persistence.PageMapper;
import com.broadvideo.pixsignage.util.ActiveMQUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service("deviceService")
public class DeviceServiceImpl implements DeviceService {

	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;
	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private BundleMapper bundleMapper;
	@Autowired
	private PageMapper pageMapper;

	public int selectCount(String orgid, String branchid, String subbranchflag, String status, String onlineflag,
			String devicegroupid, String devicegridid, String cataitemid1, String cataitemid2, String search) {
		return deviceMapper.selectCount(orgid, branchid, subbranchflag, status, onlineflag, devicegroupid, devicegridid,
				cataitemid1, cataitemid2, search);
	}

	public List<Device> selectList(String orgid, String branchid, String subbranchflag, String status,
			String onlineflag, String devicegroupid, String devicegridid, String cataitemid1, String cataitemid2,
			String search, String start, String length, String order) {
		return deviceMapper.selectList(orgid, branchid, subbranchflag, status, onlineflag, devicegroupid, devicegridid,
				cataitemid1, cataitemid2, search, start, length, order);
	}

	public Device selectByPrimaryKey(String deviceid) {
		return deviceMapper.selectByPrimaryKey(deviceid);
	}

	public Device selectByHardkey(String hardkey) {
		return deviceMapper.selectByHardkey(hardkey);
	}

	public Device selectByTerminalid(String terminalid) {
		return deviceMapper.selectByTerminalid(terminalid);
	}

	@Transactional
	public void addDevice(Device device) {
		deviceMapper.insertSelective(device);
	}

	@Transactional
	public void updateDevice(Device device) {
		deviceMapper.updateByPrimaryKey(device);
	}

	@Transactional
	public void updateDeviceSelective(Device device) {
		deviceMapper.updateByPrimaryKeySelective(device);
		// deviceMapper.checkDevicegroup();
	}

	@Transactional
	public void unbind(String deviceid) {
		deviceMapper.unbind(deviceid);
	}

	@Transactional
	public void updateUpgradeflag(String orgid, String branchid, String upgradeflag) {
		deviceMapper.updateUpgradeflag(orgid, branchid, upgradeflag);
	}

	@Transactional
	public void updateBundle(String[] deviceids, String defaultbundleid) {
		for (int i = 0; i < deviceids.length; i++) {
			deviceMapper.updateBundle(deviceids[i], defaultbundleid);
		}
	}

	@Transactional
	public void updatePage(String[] deviceids, String defaultpageid) {
		for (int i = 0; i < deviceids.length; i++) {
			deviceMapper.updatePage(deviceids[i], defaultpageid);
		}
	}

	@Transactional
	public void updateOnlineflag() {
		deviceMapper.updateOnlineflag();
	}

	@Transactional
	public void configall(String orgid) throws Exception {
		List<Device> devices = deviceMapper.selectList(orgid, null, null, "1", "1", null, null, null, null, null, null,
				null, null);
		for (Device device : devices) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Device_Config);
			msgevent.setObjtype1(Msgevent.ObjType_1_Device);
			msgevent.setObjid1(device.getDeviceid());
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Device_Config, Msgevent.ObjType_1_Device,
					"" + device.getDeviceid(), null, null, null);
			msgeventMapper.insertSelective(msgevent);
		}

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		Org org = orgMapper.selectByPrimaryKey(orgid);
		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 0);
		msgJson.put("msg_type", "CONFIG");
		JSONObject msgBodyJson = new JSONObject();
		msgBodyJson.put("msg_server", serverip + ":1883");
		JSONArray topicJsonArray = new JSONArray();
		msgBodyJson.put("msg_topic", topicJsonArray);

		if (org.getBackupvideo() != null) {
			JSONObject backupvideoJson = new JSONObject();
			// backupvideoJson.put("type", "video");
			backupvideoJson.put("id", org.getBackupvideoid());
			backupvideoJson.put("url",
					"http://" + serverip + ":" + serverport + "/pixsigdata" + org.getBackupvideo().getFilepath());
			backupvideoJson.put("file", org.getBackupvideo().getFilename());
			backupvideoJson.put("size", org.getBackupvideo().getSize());
			msgBodyJson.put("backup_media", backupvideoJson);
		}

		if (org.getVolumeflag().equals("0")) {
			msgBodyJson.put("volume", -1);
		} else {
			msgBodyJson.put("volume", org.getVolume());
		}

		msgBodyJson.put("power_flag", Integer.parseInt(org.getPowerflag()));
		if (org.getPowerflag().equals("1")) {
			msgBodyJson.put("power_on_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweron()));
			msgBodyJson.put("power_off_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweroff()));
		}

		msgBodyJson.put("password_flag", Integer.parseInt(org.getDevicepassflag()));
		msgBodyJson.put("password", org.getDevicepass());
		msgJson.put("msg_body", msgBodyJson);

		String topic = "org-" + orgid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	@Transactional
	public void config(String deviceid) throws Exception {
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		if (device.getOnlineflag().equals(Device.Online)) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Device_Config);
			msgevent.setObjtype1(Msgevent.ObjType_1_Device);
			msgevent.setObjid1(Integer.parseInt(deviceid));
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Device_Config, Msgevent.ObjType_1_Device, deviceid, null, null,
					null);
			msgeventMapper.insertSelective(msgevent);
		}

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "CONFIG");
		JSONObject msgBodyJson = new JSONObject();
		msgBodyJson.put("msg_server", serverip + ":1883");
		JSONArray topicJsonArray = new JSONArray();
		topicJsonArray.add("device-" + deviceid);
		if (device.getDevicegroupid() > 0) {
			topicJsonArray.add("group-" + device.getDevicegroupid());
		}
		topicJsonArray.add("org-" + device.getOrgid());
		msgBodyJson.put("msg_topic", topicJsonArray);

		Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
		if (org.getBackupvideo() != null) {
			JSONObject backupvideoJson = new JSONObject();
			// backupvideoJson.put("type", "video");
			backupvideoJson.put("id", org.getBackupvideoid());
			backupvideoJson.put("url",
					"http://" + serverip + ":" + serverport + "/pixsigdata" + org.getBackupvideo().getFilepath());
			backupvideoJson.put("file", org.getBackupvideo().getFilename());
			backupvideoJson.put("size", org.getBackupvideo().getSize());
			msgBodyJson.put("backup_media", backupvideoJson);
		}

		if (device.getVolumeflag().equals("0")) {
			msgBodyJson.put("volume", -1);
		} else if (device.getVolumeflag().equals("1")) {
			msgBodyJson.put("volume", device.getVolume());
		} else {
			if (org.getVolumeflag().equals("0")) {
				msgBodyJson.put("volume", -1);
			} else {
				msgBodyJson.put("volume", org.getVolume());
			}
		}

		if (device.getPowerflag().equals("0")) {
			msgBodyJson.put("power_flag", 0);
		} else if (device.getPowerflag().equals("1")) {
			msgBodyJson.put("power_flag", 1);
			msgBodyJson.put("power_on_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(device.getPoweron()));
			msgBodyJson.put("power_off_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(device.getPoweroff()));
		} else {
			if (org.getPowerflag().equals("0")) {
				msgBodyJson.put("power_flag", 0);
			} else {
				msgBodyJson.put("power_flag", 1);
				msgBodyJson.put("power_on_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweron()));
				msgBodyJson.put("power_off_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweroff()));
			}
		}

		msgBodyJson.put("password_flag", Integer.parseInt(org.getDevicepassflag()));
		msgBodyJson.put("password", org.getDevicepass());
		if (org.getTagflag().equals("1") && device.getTagflag().equals("1")) {
			msgBodyJson.put("tag_flag", 1);
		} else {
			msgBodyJson.put("tag_flag", 0);
		}
		msgBodyJson.put("interval1", device.getInterval1());
		msgBodyJson.put("interval2", device.getInterval2());

		msgBodyJson.put("hotspot_flag", Integer.parseInt(device.getHotspotflag()));
		msgBodyJson.put("hotspot_ssid", device.getHotspotssid());
		msgBodyJson.put("hotspot_password", device.getHotspotpassword());
		msgBodyJson.put("hotspot_frequency", device.getHotspotfrequency());
		msgJson.put("msg_body", msgBodyJson);

		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	@Transactional
	public void reboot(String deviceid) throws Exception {
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		if (device.getOnlineflag().equals(Device.Online)) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Device_Reboot);
			msgevent.setObjtype1(Msgevent.ObjType_1_Device);
			msgevent.setObjid1(Integer.parseInt(deviceid));
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Device_Reboot, Msgevent.ObjType_1_Device, deviceid, null, null,
					null);
			msgeventMapper.insertSelective(msgevent);
		}

		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "REBOOT");
		JSONObject msgBodyJson = new JSONObject();
		msgJson.put("msg_body", msgBodyJson);

		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	@Transactional
	public void poweroff(String deviceid) throws Exception {
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		if (device.getOnlineflag().equals(Device.Online)) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Device_Poweroff);
			msgevent.setObjtype1(Msgevent.ObjType_1_Device);
			msgevent.setObjid1(Integer.parseInt(deviceid));
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Device_Poweroff, Msgevent.ObjType_1_Device, deviceid, null,
					null, null);
			msgeventMapper.insertSelective(msgevent);
		}

		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "POWEROFF");
		JSONObject msgBodyJson = new JSONObject();
		msgJson.put("msg_body", msgBodyJson);
		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	@Transactional
	public void screenoff(String deviceid) throws Exception {
		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "SCREENOFF");
		JSONObject msgBodyJson = new JSONObject();
		msgJson.put("msg_body", msgBodyJson);
		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	@Transactional
	public void screenon(String deviceid) throws Exception {
		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "SCREENON");
		JSONObject msgBodyJson = new JSONObject();
		msgJson.put("msg_body", msgBodyJson);
		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	@Transactional
	public void screen(String deviceid) throws Exception {
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		if (device.getOnlineflag().equals(Device.Online)) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Device_Screen);
			msgevent.setObjtype1(Msgevent.ObjType_1_Device);
			msgevent.setObjid1(Integer.parseInt(deviceid));
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Device_Screen, Msgevent.ObjType_1_Device, deviceid, null, null,
					null);
			msgeventMapper.insertSelective(msgevent);
		}

		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "SCREEN");
		JSONObject msgBodyJson = new JSONObject();
		msgJson.put("msg_body", msgBodyJson);

		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
		// msgevent.setStatus(Msgevent.Status_Sent);
		// msgevent.setSendtime(Calendar.getInstance().getTime());
		// msgeventMapper.updateByPrimaryKeySelective(msgevent);
	}

	@Transactional
	public void debug(String deviceid) throws Exception {
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		if (device.getOnlineflag().equals(Device.Online)) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Device_Debug);
			msgevent.setObjtype1(Msgevent.ObjType_1_Device);
			msgevent.setObjid1(Integer.parseInt(deviceid));
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Device_Debug, Msgevent.ObjType_1_Device, deviceid, null, null,
					null);
			msgeventMapper.insertSelective(msgevent);
		}

		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 1);
		msgJson.put("msg_type", "DEBUG");
		JSONObject msgBodyJson = new JSONObject();
		msgJson.put("msg_body", msgBodyJson);

		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
		// msgevent.setStatus(Msgevent.Status_Sent);
		// msgevent.setSendtime(Calendar.getInstance().getTime());
		// msgeventMapper.updateByPrimaryKeySelective(msgevent);
	}

	@Transactional
	public void utext(String orgid, String text, String count, String position, String speed, String color, String size,
			String bgcolor, String opacity) throws Exception {
		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 0);
		msgJson.put("msg_type", "UTEXT");
		JSONObject msgBodyJson = new JSONObject();
		msgBodyJson.put("text", text);
		msgBodyJson.put("count", Integer.parseInt(count));
		msgBodyJson.put("position", position);
		msgBodyJson.put("speed", Integer.parseInt(speed));
		msgBodyJson.put("color", color);
		msgBodyJson.put("size", Integer.parseInt(size));
		msgBodyJson.put("bgcolor", bgcolor);
		String s = Integer.toHexString(Integer.parseInt(opacity));
		if (s.length() == 1) {
			s = "0" + s;
		}
		msgBodyJson.put("bgcolor", "#" + s + bgcolor.trim().substring(1));
		msgJson.put("msg_body", msgBodyJson);

		String topic = "org-" + orgid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	@Transactional
	public void ucancel(String orgid) throws Exception {
		JSONObject msgJson = new JSONObject();
		msgJson.put("msg_id", 0);
		msgJson.put("msg_type", "UCANCEL");
		JSONObject msgBodyJson = new JSONObject();
		msgJson.put("msg_body", msgBodyJson);

		String topic = "org-" + orgid;
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	@Override
	@Transactional
	public void resetExternalid(String externalid) {
		this.deviceMapper.resetExternalid(externalid);
	}

	public JSONObject generateBundleJson(Device device) throws Exception {
		JSONObject resultJson = new JSONObject();

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		Map<String, Class> map = new HashMap<String, Class>();
		map.put("subbundles", Bundle.class);
		map.put("bundlezones", Bundlezone.class);
		map.put("bundlezonedtls", Bundlezonedtl.class);

		JSONArray bundleidJsonArray = new JSONArray();
		JSONArray bundleJsonArray = new JSONArray();
		JSONArray videoJsonArray = new JSONArray();
		JSONArray imageJsonArray = new JSONArray();
		HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> imageHash = new HashMap<Integer, JSONObject>();
		List<Bundle> bundleList = new ArrayList<Bundle>();

		Bundle defaultbundle = bundleMapper.selectByPrimaryKey("" + device.getDefaultbundleid());
		if (defaultbundle != null && !defaultbundle.getReviewflag().equals(Bundle.REVIEW_PASSED)) {
			JSONObject bundleJson = JSONObject.fromObject(defaultbundle.getJson());
			defaultbundle = (Bundle) JSONObject.toBean(bundleJson, Bundle.class, map);
		}
		if (defaultbundle != null) {
			bundleList.add(defaultbundle);
			for (Bundle subbundle : defaultbundle.getSubbundles()) {
				Bundle p = bundleMapper.selectByPrimaryKey("" + subbundle.getBundleid());
				if (p != null && !p.getReviewflag().equals(Page.REVIEW_PASSED)) {
					JSONObject bundleJson = JSONObject.fromObject(p.getJson());
					p = (Bundle) JSONObject.toBean(bundleJson, Bundle.class, map);
				}
				bundleList.add(p);
			}
		} else {
			return resultJson;
		}
		String jsonPath = "/bundle/" + device.getDefaultbundleid() + "/bundle-" + device.getDefaultbundleid() + ".json";
		File jsonFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + jsonPath);
		if (jsonFile.exists()) {
			JSONObject bundleJson = new JSONObject();
			bundleJson.put("bundle_id", device.getDefaultbundleid());
			bundleJson.put("url", "http://" + serverip + ":" + serverport + CommonConfig.CONFIG_PIXDATA_URL + jsonPath);
			bundleJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + jsonPath);
			bundleJson.put("file", jsonFile.getName());
			bundleJson.put("size", defaultbundle.getSize());
			bundleJson.put("checksum", defaultbundle.getMd5());

			bundleidJsonArray.add(device.getDefaultbundleid());
			bundleJsonArray.add(bundleJson);
		} else {
			return resultJson;
		}

		List<Video> videoList = new ArrayList<Video>();
		List<Image> imageList = new ArrayList<Image>();
		for (Bundle p : bundleList) {
			for (Bundlezone bundlezone : p.getBundlezones()) {
				for (Bundlezonedtl bundlezonedtl : bundlezone.getBundlezonedtls()) {
					if (bundlezonedtl.getVideo() != null) {
						if (videoHash.get(bundlezonedtl.getObjid()) == null) {
							Video video = bundlezonedtl.getVideo();
							JSONObject videoJson = new JSONObject();
							videoJson.put("id", video.getVideoid());
							videoJson.put("name", video.getName());
							videoJson.put("url", "http://" + serverip + ":" + serverport
									+ CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
							videoJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
							videoJson.put("file", video.getFilename());
							videoJson.put("size", video.getSize());
							videoJson.put("checksum", video.getMd5());
							videoJson.put("thumbnail", "http://" + serverip + ":" + serverport
									+ CommonConfig.CONFIG_PIXDATA_URL + video.getThumbnail());
							if (video.getRelateurl() != null && video.getRelateurl().length() > 0) {
								videoJson.put("relate_url", video.getRelateurl());
							} else {
								videoJson.put("relate_type", "image");
								videoJson.put("relate_id", video.getRelateid());
							}
							videoHash.put(video.getVideoid(), videoJson);
							videoJsonArray.add(videoJson);
							videoList.add(video);
						}
					} else if (imageHash.get(bundlezonedtl.getObjid()) == null) {
						Image image = bundlezonedtl.getImage();
						JSONObject imageJson = new JSONObject();
						imageJson.put("id", image.getImageid());
						imageJson.put("name", image.getName());
						imageJson.put("url", "http://" + serverip + ":" + serverport + CommonConfig.CONFIG_PIXDATA_URL
								+ image.getFilepath());
						imageJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + image.getFilepath());
						imageJson.put("file", image.getFilename());
						imageJson.put("size", image.getSize());
						imageJson.put("checksum", image.getMd5());
						imageJson.put("thumbnail", "http://" + serverip + ":" + serverport
								+ CommonConfig.CONFIG_PIXDATA_URL + image.getThumbnail());
						if (image.getRelateurl() != null && image.getRelateurl().length() > 0) {
							imageJson.put("relate_url", image.getRelateurl());
						} else {
							imageJson.put("relate_type", "image");
							imageJson.put("relate_id", image.getRelateid());
						}
						imageHash.put(image.getImageid(), imageJson);
						imageJsonArray.add(imageJson);
						imageList.add(image);
					}
				}
			}
		}
		for (Video video : videoList) {
			if (video.getRelateimage() != null && imageHash.get(video.getRelateid()) == null) {
				JSONObject imageJson = new JSONObject();
				imageJson.put("id", video.getRelateid());
				imageJson.put("name", video.getRelateimage().getName());
				imageJson.put("oname", video.getRelateimage().getOname());
				imageJson.put("url",
						"http://" + serverip + ":" + serverport + "/pixsigdata" + video.getRelateimage().getFilepath());
				imageJson.put("path", "/pixsigdata" + video.getRelateimage().getFilepath());
				imageJson.put("file", video.getRelateimage().getFilename());
				imageJson.put("size", video.getRelateimage().getSize());
				imageJson.put("thumbnail", "http://" + serverip + ":" + serverport + "/pixsigdata"
						+ video.getRelateimage().getThumbnail());
				imageJson.put("relate_url", "");
				imageHash.put(video.getRelateid(), imageJson);
				imageJsonArray.add(imageJson);
			}
		}
		for (Image image : imageList) {
			if (image.getRelateimage() != null && imageHash.get(image.getRelateid()) == null) {
				JSONObject imageJson = new JSONObject();
				imageJson.put("id", image.getRelateid());
				imageJson.put("name", image.getRelateimage().getName());
				imageJson.put("oname", image.getRelateimage().getOname());
				imageJson.put("url",
						"http://" + serverip + ":" + serverport + "/pixsigdata" + image.getRelateimage().getFilepath());
				imageJson.put("path", "/pixsigdata" + image.getRelateimage().getFilepath());
				imageJson.put("file", image.getRelateimage().getFilename());
				imageJson.put("size", image.getRelateimage().getSize());
				imageJson.put("thumbnail", "http://" + serverip + ":" + serverport + "/pixsigdata"
						+ image.getRelateimage().getThumbnail());
				imageJson.put("relate_url", "");
				imageHash.put(image.getRelateid(), imageJson);
				imageJsonArray.add(imageJson);
			}
		}

		resultJson.put("bundle_ids", bundleidJsonArray);
		resultJson.put("bundles", bundleJsonArray);
		resultJson.put("videos", videoJsonArray);
		resultJson.put("images", imageJsonArray);
		return resultJson;
	}

	public JSONObject generatePageJson(Device device) throws Exception {
		JSONObject resultJson = new JSONObject();

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		Map<String, Class> map = new HashMap<String, Class>();
		map.put("subpages", Page.class);
		map.put("pagezones", Pagezone.class);
		map.put("pagezonedtls", Pagezonedtl.class);

		JSONArray pageJsonArray = new JSONArray();
		JSONArray videoJsonArray = new JSONArray();
		HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();
		List<Page> pageList = new ArrayList<Page>();

		Page defaultpage = pageMapper.selectByPrimaryKey("" + device.getDefaultpageid());
		if (defaultpage != null && !defaultpage.getReviewflag().equals(Page.REVIEW_PASSED)) {
			JSONObject pageJson = JSONObject.fromObject(defaultpage.getJson());
			defaultpage = (Page) JSONObject.toBean(pageJson, Page.class, map);
		}
		if (defaultpage != null) {
			pageList.add(defaultpage);
			for (Page subpage : defaultpage.getSubpages()) {
				Page p = pageMapper.selectByPrimaryKey("" + subpage.getPageid());
				if (p != null && !p.getReviewflag().equals(Page.REVIEW_PASSED)) {
					JSONObject pageJson = JSONObject.fromObject(p.getJson());
					p = (Page) JSONObject.toBean(pageJson, Page.class, map);
				}
				pageList.add(p);
			}
		} else {
			return resultJson;
		}
		String zipPath = "/page/" + device.getDefaultpageid() + "/page-" + device.getDefaultpageid() + ".zip";
		File zipFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + zipPath);
		if (zipFile.exists()) {
			JSONObject pageJson = new JSONObject();
			pageJson.put("page_id", device.getDefaultpageid());
			pageJson.put("url", "http://" + serverip + ":" + serverport + CommonConfig.CONFIG_PIXDATA_URL + zipPath);
			pageJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + zipPath);
			pageJson.put("file", zipFile.getName());
			pageJson.put("size", defaultpage.getSize());
			pageJson.put("checksum", defaultpage.getMd5());
			pageJsonArray.add(pageJson);
			resultJson.put("page_id", device.getDefaultpageid());
		} else {
			return resultJson;
		}

		for (Page p : pageList) {
			for (Pagezone pagezone : p.getPagezones()) {
				for (Pagezonedtl pagezonedtl : pagezone.getPagezonedtls()) {
					if (pagezonedtl.getVideo() != null) {
						if (videoHash.get(pagezonedtl.getObjid()) == null) {
							Video video = pagezonedtl.getVideo();
							JSONObject videoJson = new JSONObject();
							videoJson.put("id", video.getVideoid());
							videoJson.put("name", video.getName());
							videoJson.put("url", "http://" + serverip + ":" + serverport
									+ CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
							videoJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
							videoJson.put("file", video.getFilename());
							videoJson.put("size", video.getSize());
							videoJson.put("checksum", video.getMd5());
							videoJson.put("thumbnail", "http://" + serverip + ":" + serverport
									+ CommonConfig.CONFIG_PIXDATA_URL + video.getThumbnail());
							videoHash.put(video.getVideoid(), videoJson);
							videoJsonArray.add(videoJson);
						}
					}
				}
			}
		}
		resultJson.put("pages", pageJsonArray);
		resultJson.put("videos", videoJsonArray);
		return resultJson;
	}
}
