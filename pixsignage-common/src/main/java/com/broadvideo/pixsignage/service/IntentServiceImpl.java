package com.broadvideo.pixsignage.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Intent;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.domain.Pagezone;
import com.broadvideo.pixsignage.domain.Pagezonedtl;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.IntentMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service("intentService")
public class IntentServiceImpl implements IntentService {

	@Autowired
	private IntentMapper intentMapper;
	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;

	public int selectCount(String orgid, String search) {
		return intentMapper.selectCount(orgid, search);
	}

	public List<Intent> selectList(String orgid, String search, String start, String length) {
		return intentMapper.selectList(orgid, search, start, length);
	}

	public Intent selectByPrimaryKey(String intentid) {
		return intentMapper.selectByPrimaryKey(intentid);
	}

	@Transactional
	public void addIntent(Intent intent) {
		intentMapper.insertSelective(intent);
	}

	@Transactional
	public void updateIntent(Intent intent) {
		intentMapper.updateByPrimaryKeySelective(intent);
	}

	@Transactional
	public void deleteIntent(String intentid) {
		intentMapper.deleteByPrimaryKey(intentid);
	}
	
	@Transactional
	public void pushall(String orgid) {
		List<Device> devices = deviceMapper.selectList(orgid, null, null, null, "1", "1", null, null, null, null, null,
				null, null, null);
		for (Device device : devices) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Intent_Push);
			msgevent.setObjtype1(Msgevent.ObjType_1_Device);
			msgevent.setObjid1(device.getDeviceid());
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Intent_Push, Msgevent.ObjType_1_Device,
					"" + device.getDeviceid(), null, null, null);
			msgeventMapper.insertSelective(msgevent);
		}
	}

	public JSONObject generateAllIntentsJson(String orgid) throws Exception {
		JSONObject resultJson = new JSONObject();

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		String cdnserver = configMapper.selectValueByCode("CDNServer");
		String downloadurl = "http://" + serverip + ":" + serverport;
		if (cdnserver != null && cdnserver.trim().length() > 0) {
			downloadurl = "http://" + cdnserver;
		}
		Map<String, Class> map = new HashMap<String, Class>();
		map.put("subpages", Page.class);
		map.put("pagezones", Pagezone.class);
		map.put("pagezonedtls", Pagezonedtl.class);

		JSONArray intentJsonArray = new JSONArray();
		JSONArray videoJsonArray = new JSONArray();
		JSONArray imageJsonArray = new JSONArray();
		JSONArray pageJsonArray = new JSONArray();
		HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> imageHash = new HashMap<Integer, JSONObject>();

		List<Intent> intentList = intentMapper.selectList(orgid, null, null, null);
		for (Intent intent : intentList) {
			if (intent.getRelatevideo() != null) {
				if (videoHash.get(intent.getRelateid()) == null) {
					Video video = intent.getRelatevideo();
					JSONObject videoJson = new JSONObject();
					videoJson.put("id", video.getVideoid());
					videoJson.put("name", video.getName());
					videoJson.put("key", intent.getIntentkey());
					videoJson.put("url", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
					videoJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + video.getFilepath());
					videoJson.put("file", video.getFilename());
					videoJson.put("size", video.getSize());
					videoJson.put("checksum", video.getMd5());
					videoJson.put("thumbnail", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + video.getThumbnail());
					videoHash.put(video.getVideoid(), videoJson);
					videoJsonArray.add(videoJson);

					JSONObject intentJson = new JSONObject();
					intentJson.put("intent_id", intent.getIntentid());
					intentJson.put("key", intent.getIntentkey());
					intentJson.put("relatetype", "video");
					intentJson.put("relateid", intent.getRelateid());
					intentJsonArray.add(intentJson);
				}
			} else if (intent.getRelateimage() != null) {
				if (imageHash.get(intent.getRelateid()) == null) {
					Image image = intent.getRelateimage();
					JSONObject imageJson = new JSONObject();
					imageJson.put("id", image.getImageid());
					imageJson.put("name", image.getName());
					imageJson.put("key", intent.getIntentkey());
					imageJson.put("url", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + image.getFilepath());
					imageJson.put("path", CommonConfig.CONFIG_PIXDATA_URL + image.getFilepath());
					imageJson.put("file", image.getFilename());
					imageJson.put("size", image.getSize());
					imageJson.put("checksum", image.getMd5());
					imageJson.put("thumbnail", downloadurl + CommonConfig.CONFIG_PIXDATA_URL + image.getThumbnail());
					imageHash.put(image.getImageid(), imageJson);
					imageJsonArray.add(imageJson);

					JSONObject intentJson = new JSONObject();
					intentJson.put("intent_id", intent.getIntentid());
					intentJson.put("key", intent.getIntentkey());
					intentJson.put("relatetype", "image");
					intentJson.put("relateid", intent.getRelateid());
					intentJsonArray.add(intentJson);
				}
			}
		}

		resultJson.put("intents", intentJsonArray);
		resultJson.put("videos", videoJsonArray);
		resultJson.put("images", imageJsonArray);
		resultJson.put("pages", pageJsonArray);
		return resultJson;
	}

}
