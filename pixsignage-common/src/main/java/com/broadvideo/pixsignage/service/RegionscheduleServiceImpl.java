package com.broadvideo.pixsignage.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Dvb;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Medialistdtl;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Region;
import com.broadvideo.pixsignage.domain.Regionschedule;
import com.broadvideo.pixsignage.domain.Stream;
import com.broadvideo.pixsignage.domain.Text;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.domain.Widget;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicefileMapper;
import com.broadvideo.pixsignage.persistence.DvbMapper;
import com.broadvideo.pixsignage.persistence.MedialistdtlMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.RegionMapper;
import com.broadvideo.pixsignage.persistence.RegionscheduleMapper;
import com.broadvideo.pixsignage.persistence.StreamMapper;
import com.broadvideo.pixsignage.persistence.TextMapper;
import com.broadvideo.pixsignage.persistence.WidgetMapper;
import com.broadvideo.pixsignage.util.ActiveMQUtil;
import com.broadvideo.pixsignage.util.CommonUtil;

@Service("regionscheduleService")
public class RegionscheduleServiceImpl implements RegionscheduleService {
	@Autowired
	private RegionscheduleMapper regionscheduleMapper;
	@Autowired
	private RegionMapper regionMapper;
	@Autowired
	private MedialistdtlMapper medialistdtlMapper;
	@Autowired
	private TextMapper textMapper;
	@Autowired
	private StreamMapper streamMapper;
	@Autowired
	private DvbMapper dvbMapper;
	@Autowired
	private WidgetMapper widgetMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;
	@Autowired
	private DevicefileMapper devicefileMapper;

	public List<Regionschedule> selectList(String bindtype, String bindid, String regionid, String playmode,
			String fromdate, String todate) {
		return regionscheduleMapper.selectList(bindtype, bindid, regionid, playmode, fromdate, todate);
	}

	@Transactional
	public void addRegionschedule(Regionschedule regionschedule) {
		if (regionschedule.getPlaydate() == null) {
			regionscheduleMapper.deleteByDtl(regionschedule.getBindtype(), "" + regionschedule.getBindid(),
					"" + regionschedule.getRegionid(), regionschedule.getPlaymode(), null,
					CommonConstants.DateFormat_Time.format(regionschedule.getStarttime()));
		} else {
			regionscheduleMapper.deleteByDtl(regionschedule.getBindtype(), "" + regionschedule.getBindid(),
					"" + regionschedule.getRegionid(), regionschedule.getPlaymode(),
					CommonConstants.DateFormat_Date.format(regionschedule.getPlaydate()),
					CommonConstants.DateFormat_Time.format(regionschedule.getStarttime()));
		}
		regionscheduleMapper.insertSelective(regionschedule);
		if (regionschedule.getBindtype().equals("1")) {
			devicefileMapper.deleteDeviceVideoFiles("" + regionschedule.getBindid());
			devicefileMapper.deleteDeviceImageFiles("" + regionschedule.getBindid());
			devicefileMapper.insertDeviceVideoFiles("" + regionschedule.getBindid());
			devicefileMapper.insertDeviceImageFiles("" + regionschedule.getBindid());
		} else if (regionschedule.getBindtype().equals("2")) {
			devicefileMapper.deleteDevicegroupVideoFiles("" + regionschedule.getBindid());
			devicefileMapper.deleteDevicegroupImageFiles("" + regionschedule.getBindid());
			devicefileMapper.insertDevicegroupVideoFiles("" + regionschedule.getBindid());
			devicefileMapper.insertDevicegroupImageFiles("" + regionschedule.getBindid());

		}
	}

	@Transactional
	public void updateRegionschedule(Regionschedule regionschedule) {
		regionscheduleMapper.updateByPrimaryKeySelective(regionschedule);
	}

	@Transactional
	public void deleteRegionschedule(String regionscheduleid) {
		Regionschedule regionschedule = regionscheduleMapper.selectByPrimaryKey(regionscheduleid);
		regionscheduleMapper.deleteByPrimaryKey(regionscheduleid);
		if (regionschedule.getBindtype().equals("1")) {
			devicefileMapper.deleteDeviceVideoFiles("" + regionschedule.getBindid());
			devicefileMapper.deleteDeviceImageFiles("" + regionschedule.getBindid());
			devicefileMapper.insertDeviceVideoFiles("" + regionschedule.getBindid());
			devicefileMapper.insertDeviceImageFiles("" + regionschedule.getBindid());
		} else if (regionschedule.getBindtype().equals("2")) {
			devicefileMapper.deleteDevicegroupVideoFiles("" + regionschedule.getBindid());
			devicefileMapper.deleteDevicegroupImageFiles("" + regionschedule.getBindid());
			devicefileMapper.insertDevicegroupVideoFiles("" + regionschedule.getBindid());
			devicefileMapper.insertDevicegroupImageFiles("" + regionschedule.getBindid());
		}
	}

	@Transactional
	public void syncRegionschedule(String bindtype, String bindid) throws Exception {
		List<Region> regionList = regionMapper.selectActiveList();
		for (Region region : regionList) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Region_Schedule);
			msgevent.setObjtype1(bindtype);
			msgevent.setObjid1(Integer.parseInt(bindid));
			msgevent.setObjtype2(Msgevent.ObjType_2_Region);
			msgevent.setObjid2(region.getRegionid());
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Region_Schedule, bindtype, "" + bindid,
					Msgevent.ObjType_2_Region, "" + region.getRegionid(), null);
			msgeventMapper.insertSelective(msgevent);

			JSONObject msgJson = new JSONObject().put("msg_id", msgevent.getMsgeventid()).put("msg_type", "REGION");
			JSONObject msgBodyJson = generateRegionScheduleJson(msgevent.getObjtype1(), "" + msgevent.getObjid1(),
					"" + msgevent.getObjid2());
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
	}

	public JSONObject generateRegionScheduleJson(String bindtype, String bindid, String regionid) {
		// bindtype: 1-device 2-devicegroup
		if (bindtype.equals("1")) {
			Device device = deviceMapper.selectByPrimaryKey(bindid);
			if (device.getDevicegroup() != null) {
				bindtype = "2";
				bindid = "" + device.getDevicegroupid();
			}
		}

		HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> imageHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> textHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> streamHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> dvbHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> widgetHash = new HashMap<Integer, JSONObject>();

		JSONObject responseJson = new JSONObject();
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
		String today = CommonConstants.DateFormat_Date.format(Calendar.getInstance().getTime());
		String tomorrow = CommonConstants.DateFormat_Date
				.format(new Date(Calendar.getInstance().getTimeInMillis() + 24 * 3600 * 1000));
		List<Regionschedule> regionscheduleList1 = regionscheduleMapper.selectList(bindtype, bindid, regionid, "2",
				null, null);
		List<Regionschedule> regionscheduleList2 = regionscheduleMapper.selectList(bindtype, bindid, regionid, "1",
				today, tomorrow);

		// Add the first schedule from 00:00
		if (regionscheduleList1.size() > 0 && !CommonConstants.DateFormat_Time
				.format(regionscheduleList1.get(0).getStarttime()).equals("00:00:00")) {
			Regionschedule newschedule = new Regionschedule();
			newschedule.setObjtype(regionscheduleList1.get(regionscheduleList1.size() - 1).getObjtype());
			newschedule.setObjid(regionscheduleList1.get(regionscheduleList1.size() - 1).getObjid());
			String s = today + " 00:00:00";
			newschedule.setTempstarttime(CommonUtil.parseDate(s, CommonConstants.DateFormat_Full));
			finalscheduleList.add(newschedule);
		}
		// Add today schedules
		for (Regionschedule regionschedule : regionscheduleList1) {
			Regionschedule newschedule = new Regionschedule();
			newschedule.setObjtype(regionschedule.getObjtype());
			newschedule.setObjid(regionschedule.getObjid());
			String s = today + " " + CommonConstants.DateFormat_Time.format(regionschedule.getStarttime());
			newschedule.setTempstarttime(CommonUtil.parseDate(s, CommonConstants.DateFormat_Full));
			finalscheduleList.add(newschedule);
		}
		// Add tomorrow schedules
		for (Regionschedule regionschedule : regionscheduleList1) {
			Regionschedule newschedule = new Regionschedule();
			newschedule.setObjtype(regionschedule.getObjtype());
			newschedule.setObjid(regionschedule.getObjid());
			String s = tomorrow + " " + CommonConstants.DateFormat_Time.format(regionschedule.getStarttime());
			newschedule.setTempstarttime(CommonUtil.parseDate(s, CommonConstants.DateFormat_Full));
			finalscheduleList.add(newschedule);
		}

		// merge
		for (Regionschedule regionschedule : regionscheduleList2) {
			Date starttime = CommonUtil.parseDate(
					CommonConstants.DateFormat_Date.format(regionschedule.getPlaydate()) + " "
							+ CommonConstants.DateFormat_Time.format(regionschedule.getStarttime()),
					CommonConstants.DateFormat_Full);
			Date endtime = CommonUtil.parseDate(
					CommonConstants.DateFormat_Date.format(regionschedule.getPlaydate()) + " "
							+ CommonConstants.DateFormat_Time.format(regionschedule.getEndtime()),
					CommonConstants.DateFormat_Full);
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
				if (temp.getTempstarttime().equals(starttime) || temp.getTempstarttime().equals(endtime)
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
			scheduleJson.put("start_time", CommonConstants.DateFormat_Full.format(regionschedule.getTempstarttime()));
			scheduleJson.put("start_time_seconds", (long) (regionschedule.getTempstarttime().getTime() / 1000));
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
			JSONArray playlistJsonArray = new JSONArray();
			scheduleJson.put("playlist", playlistJsonArray);
			scheduleJsonArray.put(scheduleJson);

			String objtype = regionschedule.getObjtype();
			String objid = "" + regionschedule.getObjid();
			if (objtype.equals("1")) {
				List<Medialistdtl> medialistdtls = medialistdtlMapper.selectList(objid);
				for (Medialistdtl medialistdtl : medialistdtls) {
					if (medialistdtl.getVideo() != null) {
						Video video = medialistdtl.getVideo();
						playlistJsonArray.put(new JSONObject().put("type", "video").put("id", video.getVideoid()));
						if (videoHash.get(medialistdtl.getObjid()) == null) {
							JSONObject videoJson = new JSONObject();
							videoJson.put("id", video.getVideoid());
							videoJson.put("url", "http://" + CommonConfig.CONFIG_SERVER_IP + ":"
									+ CommonConfig.CONFIG_SERVER_PORT + "/pixsigdata" + video.getFilepath());
							videoJson.put("file", video.getFilename());
							videoJson.put("size", video.getSize());
							videoHash.put(video.getVideoid(), videoJson);
							videoJsonArray.put(videoJson);
						}
					} else if (medialistdtl.getImage() != null) {
						Image image = medialistdtl.getImage();
						playlistJsonArray.put(new JSONObject().put("type", "image").put("id", image.getImageid()));
						if (imageHash.get(medialistdtl.getObjid()) == null) {
							JSONObject imageJson = new JSONObject();
							imageJson.put("id", image.getImageid());
							imageJson.put("url", "http://" + CommonConfig.CONFIG_SERVER_IP + ":"
									+ CommonConfig.CONFIG_SERVER_PORT + "/pixsigdata" + image.getFilepath());
							imageJson.put("file", image.getFilename());
							imageJson.put("size", image.getSize());
							imageHash.put(image.getImageid(), imageJson);
							imageJsonArray.put(imageJson);
						}
					}
				}
			} else if (objtype.equals("2")) {
				Text text = textMapper.selectByPrimaryKey(objid);
				if (text != null) {
					playlistJsonArray.put(new JSONObject().put("type", "text").put("id", text.getTextid()));
					if (textHash.get(text.getTextid()) == null) {
						JSONObject textJson = new JSONObject();
						textJson.put("id", text.getTextid());
						textJson.put("text", text.getText());
						textHash.put(text.getTextid(), textJson);
						textJsonArray.put(textJson);
					}
				}
			} else if (objtype.equals("3")) {
				Stream stream = streamMapper.selectByPrimaryKey(objid);
				if (stream != null) {
					playlistJsonArray.put(new JSONObject().put("type", "stream").put("id", stream.getStreamid()));
					if (streamHash.get(stream.getStreamid()) == null) {
						JSONObject streamJson = new JSONObject();
						streamJson.put("id", stream.getStreamid());
						streamJson.put("url", stream.getUrl());
						streamHash.put(stream.getStreamid(), streamJson);
						streamJsonArray.put(streamJson);
					}
				}
			} else if (objtype.equals("4")) {
				Dvb dvb = dvbMapper.selectByPrimaryKey(objid);
				if (dvb != null) {
					playlistJsonArray.put(new JSONObject().put("type", "dvb").put("id", dvb.getDvbid()));
					if (dvbHash.get(dvb.getDvbid()) == null) {
						JSONObject dvbJson = new JSONObject();
						dvbJson.put("id", dvb.getDvbid());
						dvbJson.put("frequency", dvb.getFrequency());
						dvbHash.put(dvb.getDvbid(), dvbJson);
						dvbJsonArray.put(dvbJson);
					}
				}
			} else if (objtype.equals("5")) {
				Widget widget = widgetMapper.selectByPrimaryKey(objid);
				if (widget != null) {
					playlistJsonArray.put(new JSONObject().put("type", "widget").put("id", widget.getWidgetid()));
					if (widgetHash.get(widget.getWidgetid()) == null) {
						JSONObject widgetJson = new JSONObject();
						widgetJson.put("id", widget.getWidgetid());
						widgetJson.put("url", widget.getUrl());
						widgetHash.put(widget.getWidgetid(), widgetJson);
						widgetJsonArray.put(widgetJson);
					}
				}
			}
		}

		return responseJson;
	}
}
