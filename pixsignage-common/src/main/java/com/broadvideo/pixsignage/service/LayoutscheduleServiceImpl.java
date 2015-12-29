package com.broadvideo.pixsignage.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Layout;
import com.broadvideo.pixsignage.domain.Layoutdtl;
import com.broadvideo.pixsignage.domain.Layoutschedule;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.LayoutMapper;
import com.broadvideo.pixsignage.persistence.LayoutscheduleMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.util.ActiveMQUtil;
import com.broadvideo.pixsignage.util.CommonUtil;

@Service("layoutscheduleService")
public class LayoutscheduleServiceImpl implements LayoutscheduleService {
	@Autowired
	private LayoutscheduleMapper layoutscheduleMapper;
	@Autowired
	private LayoutMapper layoutMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;

	public List<Layoutschedule> selectList(String bindtype, String bindid) {
		return layoutscheduleMapper.selectList(bindtype, bindid, null, null, null);
	}

	@Transactional
	public void addLayoutschedule(Layoutschedule layoutschedule) {
		if (layoutschedule.getPlaydate() == null) {
			layoutscheduleMapper.deleteByDtl(layoutschedule.getBindtype(), "" + layoutschedule.getBindid(),
					layoutschedule.getPlaymode(), null,
					CommonConstants.DateFormat_Time.format(layoutschedule.getStarttime()));
		} else {
			layoutscheduleMapper.deleteByDtl(layoutschedule.getBindtype(), "" + layoutschedule.getBindid(),
					layoutschedule.getPlaymode(), CommonConstants.DateFormat_Date.format(layoutschedule.getPlaydate()),
					CommonConstants.DateFormat_Time.format(layoutschedule.getStarttime()));
		}
		layoutscheduleMapper.insertSelective(layoutschedule);
	}

	@Transactional
	public void updateLayoutschedule(Layoutschedule layoutschedule) {
		layoutscheduleMapper.updateByPrimaryKeySelective(layoutschedule);
	}

	@Transactional
	public void deleteLayoutschedule(String layoutscheduleid) {
		layoutscheduleMapper.deleteByPrimaryKey(layoutscheduleid);
	}

	@Transactional
	public void syncLayoutschedule(String bindtype, String bindid) throws Exception {
		Msgevent msgevent = new Msgevent();
		msgevent.setMsgtype(Msgevent.MsgType_Layout_Schedule);
		msgevent.setObjtype1(bindtype);
		msgevent.setObjid1(Integer.parseInt(bindid));
		msgevent.setObjtype2(Msgevent.ObjType_2_None);
		msgevent.setObjid2(0);
		msgevent.setStatus(Msgevent.Status_Wait);
		msgeventMapper.deleteByDtl(Msgevent.MsgType_Layout_Schedule, bindtype, bindid, null, null, null);
		msgeventMapper.insertSelective(msgevent);

		JSONObject msgJson = new JSONObject().put("msg_id", msgevent.getMsgeventid()).put("msg_type", "LAYOUT");
		JSONObject msgBodyJson = generateLayoutScheduleJson(msgevent.getObjtype1(), "" + msgevent.getObjid1());
		msgJson.put("msg_body", msgBodyJson);

		String topic = "";
		if (msgevent.getObjtype1().equals(Msgevent.ObjType_1_Device)) {
			topic = "device-" + msgevent.getObjid1();
		} else if (msgevent.getObjtype1().equals(Msgevent.ObjType_1_DeviceGroup)) {
			topic = "group-" + msgevent.getObjid1();
		}

		ActiveMQUtil.publish(topic, msgJson.toString());
		msgevent.setStatus(Msgevent.Status_Sent);
		msgevent.setSendtime(Calendar.getInstance().getTime());
		msgeventMapper.updateByPrimaryKeySelective(msgevent);
	}

	public JSONObject generateLayoutScheduleJson(String bindtype, String bindid) {
		// bindtype: 1-device 2-devicegroup
		if (bindtype.equals("1")) {
			Device device = deviceMapper.selectByPrimaryKey(bindid);
			if (device.getDevicegroup() != null) {
				bindtype = "2";
				bindid = "" + device.getDevicegroupid();
			}
		}

		HashMap<Integer, JSONObject> layoutHash = new HashMap<Integer, JSONObject>();

		JSONObject responseJson = new JSONObject();
		JSONArray layoutJsonArray = new JSONArray();
		responseJson.put("layouts", layoutJsonArray);
		JSONArray scheduleJsonArray = new JSONArray();
		responseJson.put("layout_schedules", scheduleJsonArray);

		List<Layoutschedule> finalscheduleList = new ArrayList<Layoutschedule>();
		List<Layoutschedule> layoutscheduleList = layoutscheduleMapper.selectList(bindtype, bindid, "2", null, null);
		String today = CommonConstants.DateFormat_Date.format(Calendar.getInstance().getTime());
		String tomorrow = CommonConstants.DateFormat_Date
				.format(new Date(Calendar.getInstance().getTimeInMillis() + 24 * 3600 * 1000));

		// Add the first schedule from 00:00
		if (layoutscheduleList.size() > 0 && !CommonConstants.DateFormat_Time
				.format(layoutscheduleList.get(0).getStarttime()).equals("00:00:00")) {
			Layoutschedule newschedule = new Layoutschedule();
			newschedule.setLayoutid(layoutscheduleList.get(layoutscheduleList.size() - 1).getLayoutid());
			String s = today + " 00:00:00";
			newschedule.setTempstarttime(CommonUtil.parseDate(s, CommonConstants.DateFormat_Full));
			finalscheduleList.add(newschedule);
		}
		// Add today schedules
		for (Layoutschedule layoutschedule : layoutscheduleList) {
			Layoutschedule newschedule = new Layoutschedule();
			newschedule.setLayoutid(layoutschedule.getLayoutid());
			String s = today + " " + CommonConstants.DateFormat_Time.format(layoutschedule.getStarttime());
			newschedule.setTempstarttime(CommonUtil.parseDate(s, CommonConstants.DateFormat_Full));
			finalscheduleList.add(newschedule);
		}
		// Add tomorrow schedules
		for (Layoutschedule layoutschedule : layoutscheduleList) {
			Layoutschedule newschedule = new Layoutschedule();
			newschedule.setLayoutid(layoutschedule.getLayoutid());
			String s = tomorrow + " " + CommonConstants.DateFormat_Time.format(layoutschedule.getStarttime());
			newschedule.setTempstarttime(CommonUtil.parseDate(s, CommonConstants.DateFormat_Full));
			finalscheduleList.add(newschedule);
		}

		// generate final json
		for (Layoutschedule layoutschedule : finalscheduleList) {
			JSONObject scheduleJson = new JSONObject();
			scheduleJson.put("layout_id", layoutschedule.getLayoutid());
			scheduleJson.put("start_time", CommonConstants.DateFormat_Full.format(layoutschedule.getTempstarttime()));
			scheduleJson.put("start_time_seconds", (long) (layoutschedule.getTempstarttime().getTime() / 1000));
			scheduleJsonArray.put(scheduleJson);

			if (layoutHash.get(layoutschedule.getLayoutid()) == null) {
				Layout layout = layoutMapper.selectByPrimaryKey("" + layoutschedule.getLayoutid());
				JSONObject layoutJson = new JSONObject();
				layoutJsonArray.put(layoutJson);

				layoutHash.put(layout.getLayoutid(), layoutJson);

				layoutJson.put("layout_id", layout.getLayoutid());
				layoutJson.put("width", layout.getWidth());
				layoutJson.put("height", layout.getHeight());
				layoutJson.put("bg_color", "#000000");
				JSONObject layoutBgImageJson = new JSONObject();
				layoutJson.put("bg_image", layoutBgImageJson);
				if (layout.getBgimage() != null) {
					layoutBgImageJson.put("id", layout.getBgimageid());
					layoutBgImageJson.put("url", "http://" + CommonConfig.CONFIG_SERVER_IP + ":"
							+ CommonConfig.CONFIG_SERVER_PORT + "/pixsigdata" + layout.getBgimage().getFilepath());
					layoutBgImageJson.put("file", layout.getBgimage().getFilename());
					layoutBgImageJson.put("size", layout.getBgimage().getSize());
				} else {
					layoutBgImageJson.put("id", 0);
					layoutBgImageJson.put("url", "");
					layoutBgImageJson.put("file", "");
					layoutBgImageJson.put("size", 0);
				}

				JSONArray regionJsonArray = new JSONArray();
				layoutJson.put("regions", regionJsonArray);
				for (Layoutdtl layoutdtl : layout.getLayoutdtls()) {
					JSONObject regionJson = new JSONObject();
					regionJsonArray.put(regionJson);
					regionJson.put("region_id", layoutdtl.getRegionid());
					regionJson.put("width", layoutdtl.getWidth());
					regionJson.put("height", layoutdtl.getHeight());
					regionJson.put("top", layoutdtl.getTopoffset());
					regionJson.put("left", layoutdtl.getLeftoffset());
					regionJson.put("zindex", layoutdtl.getZindex());
					String opacity = Integer.toHexString(layoutdtl.getOpacity());
					if (opacity.length() == 1) {
						opacity = "0" + opacity;
					}
					regionJson.put("bgcolor", "#" + opacity + layoutdtl.getBgcolor().substring(1));
					regionJson.put("type", layoutdtl.getRegion().getType());
					regionJson.put("interval", layoutdtl.getIntervaltime());
					if (layoutdtl.getDirection().equals("1")) {
						regionJson.put("direction", "none");
					} else if (layoutdtl.getDirection().equals("2")) {
						regionJson.put("direction", "up");
					} else if (layoutdtl.getDirection().equals("3")) {
						regionJson.put("direction", "down");
					} else if (layoutdtl.getDirection().equals("4")) {
						regionJson.put("direction", "left");
					} else if (layoutdtl.getDirection().equals("5")) {
						regionJson.put("direction", "right");
					}
					regionJson.put("speed", "" + layoutdtl.getSpeed());
					regionJson.put("color", "" + layoutdtl.getColor());
					regionJson.put("size", layoutdtl.getSize());
					if (layoutdtl.getDateformat() == null) {
						regionJson.put("date_format", "yyyy-MM-dd");
					} else {
						regionJson.put("date_format", layoutdtl.getDateformat());
					}
					regionJson.put("volume", 50);

					JSONObject regionBgImageJson = new JSONObject();
					regionJson.put("bg_image", regionBgImageJson);
					if (layoutdtl.getBgimage() != null) {
						regionBgImageJson.put("id", layoutdtl.getBgimageid());
						regionBgImageJson.put("url",
								"http://" + CommonConfig.CONFIG_SERVER_IP + ":" + CommonConfig.CONFIG_SERVER_PORT
										+ "/pixsigdata" + layoutdtl.getBgimage().getFilepath());
						regionBgImageJson.put("file", layoutdtl.getBgimage().getFilename());
						regionBgImageJson.put("size", layoutdtl.getBgimage().getSize());
					} else {
						regionBgImageJson.put("id", 0);
						regionBgImageJson.put("url", "");
						regionBgImageJson.put("file", "");
						regionBgImageJson.put("size", 0);
					}
				}
			}
		}

		return responseJson;
	}

}
