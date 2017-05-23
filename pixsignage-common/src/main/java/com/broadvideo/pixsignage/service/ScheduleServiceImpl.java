package com.broadvideo.pixsignage.service;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegrid;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Mediagrid;
import com.broadvideo.pixsignage.domain.Mediagriddtl;
import com.broadvideo.pixsignage.domain.Mmediadtl;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Schedule;
import com.broadvideo.pixsignage.domain.Scheduledtl;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicegridMapper;
import com.broadvideo.pixsignage.persistence.MmediadtlMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.ScheduleMapper;
import com.broadvideo.pixsignage.persistence.ScheduledtlMapper;
import com.broadvideo.pixsignage.util.ActiveMQUtil;

@Service("scheduleService")
public class ScheduleServiceImpl implements ScheduleService {

	@Autowired
	private ScheduleMapper scheduleMapper;
	@Autowired
	private ScheduledtlMapper scheduledtlMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private DevicegridMapper devicegridMapper;
	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private MmediadtlMapper mmediadtlMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;

	@Autowired
	private BundleService bundleService;
	@Autowired
	private DevicefileService devicefileService;

	public List<Schedule> selectList(String scheduletype, String bindtype, String bindid, String playmode) {
		return scheduleMapper.selectList(scheduletype, bindtype, bindid, playmode);
	}

	@Transactional
	public void batch(String scheduletype, String bindtype, String bindid, Schedule[] schedules) {
		scheduledtlMapper.deleteByDtl(scheduletype, bindtype, bindid, null, null);
		scheduleMapper.deleteByDtl(scheduletype, bindtype, bindid, null, null);
		for (int i = 0; i < schedules.length; i++) {
			scheduleMapper.insertSelective(schedules[i]);
			List<Scheduledtl> scheduledtls = schedules[i].getScheduledtls();
			for (Scheduledtl scheduledtl : scheduledtls) {
				scheduledtl.setScheduleid(schedules[i].getScheduleid());
				scheduledtlMapper.insertSelective(scheduledtl);
			}
		}
		devicefileService.refreshDevicefiles(bindtype, bindid);
	}

	@Transactional
	private void generateSyncEvent(int deviceid) {
		Msgevent msgevent = new Msgevent();
		msgevent.setMsgtype(Msgevent.MsgType_Schedule);
		msgevent.setObjtype1(Msgevent.ObjType_1_Device);
		msgevent.setObjid1(deviceid);
		msgevent.setObjtype2(Msgevent.ObjType_2_None);
		msgevent.setObjid2(0);
		msgevent.setStatus(Msgevent.Status_Wait);
		msgeventMapper.deleteByDtl(Msgevent.MsgType_Schedule, Msgevent.ObjType_1_Device, "" + deviceid, null, null,
				null);
		msgeventMapper.insertSelective(msgevent);

		msgevent = new Msgevent();
		msgevent.setMsgtype(Msgevent.MsgType_Bundle_Schedule);
		msgevent.setObjtype1(Msgevent.ObjType_1_Device);
		msgevent.setObjid1(deviceid);
		msgevent.setObjtype2(Msgevent.ObjType_2_None);
		msgevent.setObjid2(0);
		msgevent.setStatus(Msgevent.Status_Wait);
		msgeventMapper.deleteByDtl(Msgevent.MsgType_Bundle_Schedule, Msgevent.ObjType_1_Device, "" + deviceid, null,
				null, null);
		msgeventMapper.insertSelective(msgevent);
	}

	@Transactional
	public void syncSchedule(String bindtype, String bindid) throws Exception {
		if (bindtype.equals(Schedule.BindType_Device)) {
			Device device = deviceMapper.selectByPrimaryKey(bindid);
			if (device.getOnlineflag().equals(Device.Online)) {
				generateSyncEvent(Integer.parseInt(bindid));
			}
			JSONObject msgJson = new JSONObject().put("msg_id", 1).put("msg_type", "BUNDLE");
			JSONObject msgBodyJson = generateBundleScheduleJson(bindtype, bindid);
			msgJson.put("msg_body", msgBodyJson);
			String topic = "device-" + bindid;
			ActiveMQUtil.publish(topic, msgJson.toString());
		} else if (bindtype.equals(Schedule.BindType_Devicegroup)) {
			List<Device> devices = deviceMapper.selectByDevicegroup(bindid);
			for (Device device : devices) {
				if (device.getOnlineflag().equals(Device.Online)) {
					generateSyncEvent(device.getDeviceid());
				}
			}
			List<Devicegrid> devicegrids = devicegridMapper.selectByDevicegroup(bindid);
			for (Devicegrid devicegrid : devicegrids) {
				devices = devicegrid.getDevices();
				for (Device device : devices) {
					if (device.getOnlineflag().equals(Device.Online)) {
						generateSyncEvent(device.getDeviceid());
					}
				}
			}
			JSONObject msgJson = new JSONObject().put("msg_id", 1).put("msg_type", "BUNDLE");
			JSONObject msgBodyJson = generateBundleScheduleJson(bindtype, bindid);
			msgJson.put("msg_body", msgBodyJson);
			String topic = "group-" + bindid;
			ActiveMQUtil.publish(topic, msgJson.toString());
		} else if (bindtype.equals(Schedule.BindType_Devicegrid)) {
			List<Device> devices = deviceMapper.selectByDevicegrid(bindid);
			for (Device device : devices) {
				if (device.getOnlineflag().equals(Device.Online)) {
					generateSyncEvent(device.getDeviceid());
				}
			}
		}

	}

	@Transactional
	public void syncScheduleByBundle(String bundleid) throws Exception {
		List<HashMap<String, Object>> bindList = scheduleMapper.selectBindListByObj(Scheduledtl.ObjType_Bundle,
				bundleid);
		for (HashMap<String, Object> bindObj : bindList) {
			syncSchedule(bindObj.get("bindtype").toString(), bindObj.get("bindid").toString());
		}
	}

	@Transactional
	public void syncScheduleByMediagrid(String mediagridid) throws Exception {
		List<HashMap<String, Object>> bindList = scheduleMapper.selectBindListByObj(Scheduledtl.ObjType_Mediagrid,
				mediagridid);
		for (HashMap<String, Object> bindObj : bindList) {
			syncSchedule(bindObj.get("bindtype").toString(), bindObj.get("bindid").toString());
		}
	}

	public JSONObject generateBundleScheduleJson(String bindtype, String bindid) {
		if (bindtype.equals(Schedule.BindType_Device)) {
			Device device = deviceMapper.selectByPrimaryKey(bindid);
			if (device.getDevicegroup() != null) {
				bindtype = "2";
				bindid = "" + device.getDevicegroupid();
			}
		}

		List<Integer> bundleids = new ArrayList<Integer>();

		JSONArray scheduleJsonArray = new JSONArray();
		// generate final json
		List<Schedule> scheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Solo, bindtype, bindid,
				Schedule.PlayMode_Daily);
		for (Schedule schedule : scheduleList) {
			JSONObject scheduleJson = new JSONObject();
			// scheduleJson.put("bundle_id",
			// schedule.getBundle().getBundleid());
			scheduleJson.put("playmode", "daily");
			scheduleJson.put("start_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getStarttime()));
			JSONArray bundleidJsonArray = new JSONArray();
			scheduleJson.put("bundles", bundleidJsonArray);
			for (Scheduledtl scheduledtl : schedule.getScheduledtls()) {
				bundleidJsonArray.put(scheduledtl.getObjid());
				bundleids.add(scheduledtl.getObjid());
			}
			scheduleJsonArray.put(scheduleJson);
		}

		JSONObject responseJson = new JSONObject();
		responseJson.put("bundle_schedules", scheduleJsonArray);
		responseJson.put("bundles", bundleService.generateBundleJsonArray(bundleids));

		return responseJson;
	}

	private JSONObject generateSoloScheduleJson(String deviceid) {
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		// bindtype: 1-device 2-devicegroup
		String bindtype = "1";
		String bindid = deviceid;
		if (device.getDevicegroup() != null) {
			bindtype = "2";
			bindid = "" + device.getDevicegroupid();
		}

		List<Integer> bundleids = new ArrayList<Integer>();

		JSONArray scheduleJsonArray = new JSONArray();
		// generate final json
		List<Schedule> scheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Solo, bindtype, bindid,
				Schedule.PlayMode_Daily);
		for (Schedule schedule : scheduleList) {
			JSONObject scheduleJson = new JSONObject();
			scheduleJsonArray.put(scheduleJson);
			scheduleJson.put("schedule_id", schedule.getScheduleid());
			scheduleJson.put("playmode", "daily");
			scheduleJson.put("start_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getStarttime()));
			if (schedule.getEndtime() != null) {
				scheduleJson.put("end_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getEndtime()));
			}
			JSONArray scheduledtlJsonArray = new JSONArray();
			scheduleJson.put("scheduledtls", scheduledtlJsonArray);
			for (Scheduledtl scheduledtl : schedule.getScheduledtls()) {
				JSONObject scheduledtlJson = new JSONObject();
				scheduledtlJson.put("scheduledtl_id", scheduledtl.getScheduledtlid());
				scheduledtlJson.put("media_type", "bundle");
				scheduledtlJson.put("media_id", scheduledtl.getObjid());
				scheduledtlJsonArray.put(scheduledtlJson);
				bundleids.add(scheduledtl.getObjid());
			}
		}

		JSONObject responseJson = new JSONObject();
		responseJson.put("schedules", scheduleJsonArray);
		responseJson.put("bundles", bundleService.generateBundleJsonArray(bundleids));

		return responseJson;
	}

	private JSONObject generateMultiScheduleJson(String deviceid) {
		JSONObject responseJson = new JSONObject();
		JSONArray scheduleJsonArray = new JSONArray();
		responseJson.put("multi_schedules", scheduleJsonArray);

		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		String devicegridid = "" + device.getDevicegridid();
		int xpos = device.getXpos();
		int ypos = device.getYpos();

		if (device.getDevicegridid().intValue() == 0) {
			return responseJson;
		}

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");

		// generate final json
		List<Schedule> scheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Multi,
				Schedule.BindType_Devicegrid, devicegridid, Schedule.PlayMode_Daily);
		for (Schedule schedule : scheduleList) {
			JSONObject scheduleJson = new JSONObject();
			scheduleJsonArray.put(scheduleJson);
			scheduleJson.put("schedule_id", schedule.getScheduleid());
			scheduleJson.put("playmode", "daily");
			scheduleJson.put("start_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getStarttime()));
			if (schedule.getEndtime() != null) {
				scheduleJson.put("end_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getEndtime()));
			}
			scheduleJson.put("interval", schedule.getIntervaltime());
			JSONArray scheduledtlJsonArray = new JSONArray();
			scheduleJson.put("scheduledtls", scheduledtlJsonArray);
			for (Scheduledtl scheduledtl : schedule.getScheduledtls()) {
				if (scheduledtl.getObjtype().equals(Scheduledtl.ObjType_Page)) {
					String zipPath = "/page/" + scheduledtl.getObjid() + "/page-" + scheduledtl.getObjid() + ".zip";
					File zipFile = new File("/pixdata/pixsignage" + zipPath);
					if (zipFile.exists()) {
						JSONObject scheduledtlJson = new JSONObject();
						scheduledtlJson.put("scheduledtl_id", scheduledtl.getScheduledtlid());
						scheduledtlJson.put("media_type", "page");
						scheduledtlJson.put("media_master", "1");
						scheduledtlJson.put("media_id", scheduledtl.getObjid());
						scheduledtlJson.put("url", "http://" + serverip + ":" + serverport + "/pixsigdata" + zipPath);
						scheduledtlJson.put("file", zipFile.getName());
						scheduledtlJson.put("size", FileUtils.sizeOf(zipFile));
						if (scheduledtl.getDuration() > 0) {
							scheduledtlJson.put("duration", scheduledtl.getDuration());
						} else if (xpos == 0 && ypos == 0) {
							scheduledtlJson.put("duration", 30);
						} else {
							scheduledtlJson.put("duration", 0);
						}
						scheduledtlJsonArray.put(scheduledtlJson);
					}
				} else if (scheduledtl.getObjtype().equals(Scheduledtl.ObjType_Video)) {
					JSONObject scheduledtlJson = new JSONObject();
					Video video = scheduledtl.getVideo();
					scheduledtlJson.put("scheduledtl_id", scheduledtl.getScheduledtlid());
					scheduledtlJson.put("media_type", "video");
					scheduledtlJson.put("media_master", "1");
					scheduledtlJson.put("media_id", scheduledtl.getObjid());
					scheduledtlJson.put("url",
							"http://" + serverip + ":" + serverport + "/pixsigdata" + video.getFilepath());
					scheduledtlJson.put("file", video.getFilename());
					scheduledtlJson.put("size", video.getSize());
					scheduledtlJson.put("duration", scheduledtl.getDuration());
					scheduledtlJsonArray.put(scheduledtlJson);
				} else if (scheduledtl.getObjtype().equals(Scheduledtl.ObjType_Image)) {
					JSONObject scheduledtlJson = new JSONObject();
					Image image = scheduledtl.getImage();
					scheduledtlJson.put("scheduledtl_id", scheduledtl.getScheduledtlid());
					scheduledtlJson.put("media_type", "image");
					scheduledtlJson.put("media_master", "1");
					scheduledtlJson.put("media_id", scheduledtl.getObjid());
					scheduledtlJson.put("url",
							"http://" + serverip + ":" + serverport + "/pixsigdata" + image.getFilepath());
					scheduledtlJson.put("file", image.getFilename());
					scheduledtlJson.put("size", image.getSize());
					if (scheduledtl.getDuration() > 0) {
						scheduledtlJson.put("duration", scheduledtl.getDuration());
					} else if (xpos == 0 && ypos == 0) {
						scheduledtlJson.put("duration", 10);
					} else {
						scheduledtlJson.put("duration", 0);
					}
					scheduledtlJsonArray.put(scheduledtlJson);
				} else if (scheduledtl.getObjtype().equals(Scheduledtl.ObjType_Mediagrid)) {
					Mediagrid mediagrid = scheduledtl.getMediagrid();
					if (!mediagrid.getStatus().equals(Mediagrid.Status_Active)) {
						continue;
					}
					List<Mediagriddtl> mediagriddtls = mediagrid.getMediagriddtls();

					Mediagriddtl mastergriddtl = null;
					for (Mediagriddtl mediagriddtl : mediagriddtls) {
						if (mediagriddtl.getXpos().intValue() == 0 && mediagriddtl.getYpos().intValue() == 0) {
							mastergriddtl = mediagriddtl;
							break;
						}
					}

					for (Mediagriddtl mediagriddtl : mediagriddtls) {
						int x = xpos - mediagriddtl.getXpos().intValue();
						int y = ypos - mediagriddtl.getYpos().intValue();
						if (x >= 0 && x < mediagriddtl.getXcount().intValue() && y >= 0
								&& y < mediagriddtl.getYcount().intValue()) {
							if (mediagriddtl.getObjtype().equals(Mediagriddtl.ObjType_Page)) {
								String zipPath = "/page/" + mediagriddtl.getObjid() + "/page-" + mediagriddtl.getObjid()
										+ ".zip";
								File zipFile = new File("/pixdata/pixsignage" + zipPath);
								if (zipFile.exists()) {
									JSONObject scheduledtlJson = new JSONObject();
									scheduledtlJson.put("scheduledtl_id", scheduledtl.getScheduledtlid());
									scheduledtlJson.put("media_type", "page");
									if (mastergriddtl != null
											&& mastergriddtl.getObjtype().equals(mediagriddtl.getObjtype())
											&& mastergriddtl.getObjid().intValue() == mediagriddtl.getObjid()
													.intValue()) {
										scheduledtlJson.put("media_master", "1");
									} else {
										scheduledtlJson.put("media_master", "0");
									}
									scheduledtlJson.put("media_id", mediagriddtl.getObjid());
									scheduledtlJson.put("url",
											"http://" + serverip + ":" + serverport + "/pixsigdata" + zipPath);
									scheduledtlJson.put("file", zipFile.getName());
									scheduledtlJson.put("size", FileUtils.sizeOf(zipFile));
									if (scheduledtl.getDuration() > 0) {
										scheduledtlJson.put("duration", scheduledtl.getDuration());
									} else if (xpos == 0 && ypos == 0) {
										scheduledtlJson.put("duration", 30);
									} else {
										scheduledtlJson.put("duration", 0);
									}
									scheduledtlJsonArray.put(scheduledtlJson);
								}
							} else {
								Mmediadtl mmediadtl = mmediadtlMapper.selectByPos("" + mediagriddtl.getMmediaid(),
										"" + x, "" + y);
								if (mmediadtl != null && mediagriddtl.getObjtype().equals(Mediagriddtl.ObjType_Video)) {
									JSONObject scheduledtlJson = new JSONObject();
									scheduledtlJson.put("scheduledtl_id", scheduledtl.getScheduledtlid());
									scheduledtlJson.put("media_type", "cropvideo");
									if (mastergriddtl != null
											&& mastergriddtl.getObjtype().equals(mediagriddtl.getObjtype())
											&& mastergriddtl.getObjid().intValue() == mediagriddtl.getObjid()
													.intValue()) {
										scheduledtlJson.put("media_master", "1");
									} else {
										scheduledtlJson.put("media_master", "0");
									}
									scheduledtlJson.put("media_id", mmediadtl.getMmediadtlid());
									scheduledtlJson.put("url", "http://" + serverip + ":" + serverport + "/pixsigdata"
											+ mmediadtl.getFilepath());
									scheduledtlJson.put("file", mmediadtl.getFilename());
									scheduledtlJson.put("size", mmediadtl.getSize());
									scheduledtlJson.put("duration", scheduledtl.getDuration());
									scheduledtlJsonArray.put(scheduledtlJson);
								} else if (mmediadtl != null
										&& mediagriddtl.getObjtype().equals(Mediagriddtl.ObjType_Image)) {
									JSONObject scheduledtlJson = new JSONObject();
									scheduledtlJson.put("scheduledtl_id", scheduledtl.getScheduledtlid());
									scheduledtlJson.put("media_type", "cropimage");
									if (mastergriddtl != null
											&& mastergriddtl.getObjtype().equals(mediagriddtl.getObjtype())
											&& mastergriddtl.getObjid().intValue() == mediagriddtl.getObjid()
													.intValue()) {
										scheduledtlJson.put("media_master", "1");
									} else {
										scheduledtlJson.put("media_master", "0");
									}
									scheduledtlJson.put("media_id", mmediadtl.getMmediadtlid());
									scheduledtlJson.put("url", "http://" + serverip + ":" + serverport + "/pixsigdata"
											+ mmediadtl.getFilepath());
									scheduledtlJson.put("file", mmediadtl.getFilename());
									scheduledtlJson.put("size", mmediadtl.getSize());
									if (scheduledtl.getDuration() > 0) {
										scheduledtlJson.put("duration", scheduledtl.getDuration());
									} else if (xpos == 0 && ypos == 0) {
										scheduledtlJson.put("duration", 10);
									} else {
										scheduledtlJson.put("duration", 0);
									}
									scheduledtlJsonArray.put(scheduledtlJson);
								}
							}
						}
					}
				}

			}
		}

		return responseJson;
	}

	public JSONObject generateScheduleJson(String deviceid) {
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		JSONObject response = generateSoloScheduleJson(deviceid);
		JSONArray multiJSONArray = new JSONArray();
		if (device.getDevicegridid().intValue() > 0) {
			multiJSONArray = generateMultiScheduleJson(deviceid).getJSONArray("multi_schedules");
		}
		response.put("multi_schedules", multiJSONArray);
		return response;
	}

	private JSONObject generateMultiScheduleJson_old(String deviceid) {
		JSONObject responseJson = new JSONObject();
		JSONArray scheduleJsonArray = new JSONArray();
		responseJson.put("multi_schedules", scheduleJsonArray);

		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		String devicegridid = "" + device.getDevicegridid();
		int xpos = device.getXpos();
		int ypos = device.getYpos();

		if (device.getDevicegridid().intValue() == 0) {
			return responseJson;
		}

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");

		// generate final json
		List<Schedule> scheduleList = scheduleMapper.selectList(Schedule.ScheduleType_Multi,
				Schedule.BindType_Devicegrid, devicegridid, Schedule.PlayMode_Daily);
		for (Schedule schedule : scheduleList) {
			JSONObject scheduleJson = new JSONObject();
			scheduleJsonArray.put(scheduleJson);
			scheduleJson.put("schedule_id", schedule.getScheduleid());
			scheduleJson.put("playmode", "daily");
			scheduleJson.put("start_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getStarttime()));
			if (schedule.getEndtime() != null) {
				scheduleJson.put("end_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getEndtime()));
			}
			scheduleJson.put("interval", schedule.getIntervaltime());
			JSONArray scheduledtlJsonArray = new JSONArray();
			scheduleJson.put("scheduledtls", scheduledtlJsonArray);
			for (Scheduledtl scheduledtl : schedule.getScheduledtls()) {
				if (scheduledtl.getObjtype().equals(Scheduledtl.ObjType_Page)) {
					String zipPath = "/page/" + scheduledtl.getObjid() + "/page-" + scheduledtl.getObjid() + ".zip";
					File zipFile = new File("/pixdata/pixsignage" + zipPath);
					if (zipFile.exists()) {
						JSONObject scheduledtlJson = new JSONObject();
						scheduledtlJson.put("scheduledtl_id", scheduledtl.getScheduledtlid());
						scheduledtlJson.put("media_type", "page");
						scheduledtlJson.put("media_master", "1");
						scheduledtlJson.put("media_id", scheduledtl.getObjid());
						scheduledtlJson.put("url", "http://" + serverip + ":" + serverport + "/pixsigdata" + zipPath);
						scheduledtlJson.put("file", zipFile.getName());
						scheduledtlJson.put("size", FileUtils.sizeOf(zipFile));
						if (scheduledtl.getDuration() > 0) {
							scheduledtlJson.put("duration", scheduledtl.getDuration());
						} else if (xpos == 0 && ypos == 0) {
							scheduledtlJson.put("duration", 30);
						} else {
							scheduledtlJson.put("duration", 0);
						}
						scheduledtlJsonArray.put(scheduledtlJson);
					}
				} else if (scheduledtl.getObjtype().equals(Scheduledtl.ObjType_Video)) {
					JSONObject scheduledtlJson = new JSONObject();
					Video video = scheduledtl.getVideo();
					scheduledtlJson.put("scheduledtl_id", scheduledtl.getScheduledtlid());
					scheduledtlJson.put("media_type", "video");
					scheduledtlJson.put("media_master", "1");
					scheduledtlJson.put("media_id", scheduledtl.getObjid());
					scheduledtlJson.put("url",
							"http://" + serverip + ":" + serverport + "/pixsigdata" + video.getFilepath());
					scheduledtlJson.put("file", video.getFilename());
					scheduledtlJson.put("size", video.getSize());
					scheduledtlJson.put("duration", scheduledtl.getDuration());
					scheduledtlJsonArray.put(scheduledtlJson);
				} else if (scheduledtl.getObjtype().equals(Scheduledtl.ObjType_Image)) {
					JSONObject scheduledtlJson = new JSONObject();
					Image image = scheduledtl.getImage();
					scheduledtlJson.put("scheduledtl_id", scheduledtl.getScheduledtlid());
					scheduledtlJson.put("media_type", "image");
					scheduledtlJson.put("media_master", "1");
					scheduledtlJson.put("media_id", scheduledtl.getObjid());
					scheduledtlJson.put("url",
							"http://" + serverip + ":" + serverport + "/pixsigdata" + image.getFilepath());
					scheduledtlJson.put("file", image.getFilename());
					scheduledtlJson.put("size", image.getSize());
					if (scheduledtl.getDuration() > 0) {
						scheduledtlJson.put("duration", scheduledtl.getDuration());
					} else if (xpos == 0 && ypos == 0) {
						scheduledtlJson.put("duration", 10);
					} else {
						scheduledtlJson.put("duration", 0);
					}
					scheduledtlJsonArray.put(scheduledtlJson);
				} else if (scheduledtl.getObjtype().equals(Scheduledtl.ObjType_Mediagrid)) {
					Mediagrid mediagrid = scheduledtl.getMediagrid();
					if (!mediagrid.getStatus().equals(Mediagrid.Status_Active)) {
						continue;
					}
					List<Mediagriddtl> mediagriddtls = mediagrid.getMediagriddtls();

					Mediagriddtl mastergriddtl = null;
					for (Mediagriddtl mediagriddtl : mediagriddtls) {
						if (mediagriddtl.getXpos().intValue() == 0 && mediagriddtl.getYpos().intValue() == 0) {
							mastergriddtl = mediagriddtl;
							break;
						}
					}

					for (Mediagriddtl mediagriddtl : mediagriddtls) {
						int x = xpos - mediagriddtl.getXpos().intValue();
						int y = ypos - mediagriddtl.getYpos().intValue();
						if (x >= 0 && x < mediagriddtl.getXcount().intValue() && y >= 0
								&& y < mediagriddtl.getYcount().intValue()) {
							if (mediagriddtl.getObjtype().equals(Mediagriddtl.ObjType_Page)) {
								String zipPath = "/page/" + mediagriddtl.getObjid() + "/page-" + mediagriddtl.getObjid()
										+ ".zip";
								File zipFile = new File("/pixdata/pixsignage" + zipPath);
								if (zipFile.exists()) {
									JSONObject scheduledtlJson = new JSONObject();
									scheduledtlJson.put("scheduledtl_id", scheduledtl.getScheduledtlid());
									scheduledtlJson.put("media_type", "page");
									if (mastergriddtl != null
											&& mastergriddtl.getObjtype().equals(mediagriddtl.getObjtype())
											&& mastergriddtl.getObjid().intValue() == mediagriddtl.getObjid()
													.intValue()) {
										scheduledtlJson.put("media_master", "1");
									} else {
										scheduledtlJson.put("media_master", "0");
									}
									scheduledtlJson.put("media_id", mediagriddtl.getObjid());
									scheduledtlJson.put("url",
											"http://" + serverip + ":" + serverport + "/pixsigdata" + zipPath);
									scheduledtlJson.put("file", zipFile.getName());
									scheduledtlJson.put("size", FileUtils.sizeOf(zipFile));
									if (scheduledtl.getDuration() > 0) {
										scheduledtlJson.put("duration", scheduledtl.getDuration());
									} else if (xpos == 0 && ypos == 0) {
										scheduledtlJson.put("duration", 30);
									} else {
										scheduledtlJson.put("duration", 0);
									}
									scheduledtlJsonArray.put(scheduledtlJson);
								}
							} else {
								Mmediadtl mmediadtl = mmediadtlMapper.selectByPos("" + mediagriddtl.getMmediaid(),
										"" + x, "" + y);
								if (mmediadtl != null && mediagriddtl.getObjtype().equals(Mediagriddtl.ObjType_Video)) {
									JSONObject scheduledtlJson = new JSONObject();
									scheduledtlJson.put("scheduledtl_id", scheduledtl.getScheduledtlid());
									scheduledtlJson.put("media_type", "video");
									if (mastergriddtl != null
											&& mastergriddtl.getObjtype().equals(mediagriddtl.getObjtype())
											&& mastergriddtl.getObjid().intValue() == mediagriddtl.getObjid()
													.intValue()) {
										scheduledtlJson.put("media_master", "1");
									} else {
										scheduledtlJson.put("media_master", "0");
									}
									scheduledtlJson.put("media_id", mmediadtl.getMmediadtlid());
									scheduledtlJson.put("url", "http://" + serverip + ":" + serverport + "/pixsigdata"
											+ mmediadtl.getFilepath());
									scheduledtlJson.put("file", mmediadtl.getFilename());
									scheduledtlJson.put("size", mmediadtl.getSize());
									scheduledtlJson.put("duration", scheduledtl.getDuration());
									scheduledtlJsonArray.put(scheduledtlJson);
								} else if (mmediadtl != null
										&& mediagriddtl.getObjtype().equals(Mediagriddtl.ObjType_Image)) {
									JSONObject scheduledtlJson = new JSONObject();
									scheduledtlJson.put("scheduledtl_id", scheduledtl.getScheduledtlid());
									scheduledtlJson.put("media_type", "image");
									if (mastergriddtl != null
											&& mastergriddtl.getObjtype().equals(mediagriddtl.getObjtype())
											&& mastergriddtl.getObjid().intValue() == mediagriddtl.getObjid()
													.intValue()) {
										scheduledtlJson.put("media_master", "1");
									} else {
										scheduledtlJson.put("media_master", "0");
									}
									scheduledtlJson.put("media_id", mmediadtl.getMmediadtlid());
									scheduledtlJson.put("url", "http://" + serverip + ":" + serverport + "/pixsigdata"
											+ mmediadtl.getFilepath());
									scheduledtlJson.put("file", mmediadtl.getFilename());
									scheduledtlJson.put("size", mmediadtl.getSize());
									if (scheduledtl.getDuration() > 0) {
										scheduledtlJson.put("duration", scheduledtl.getDuration());
									} else if (xpos == 0 && ypos == 0) {
										scheduledtlJson.put("duration", 10);
									} else {
										scheduledtlJson.put("duration", 0);
									}
									scheduledtlJsonArray.put(scheduledtlJson);
								}
							}
						}
					}
				}

			}
		}

		return responseJson;
	}

	public JSONObject generateScheduleJson_old(String deviceid) {
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		JSONObject response = generateSoloScheduleJson(deviceid);
		JSONArray multiJSONArray = new JSONArray();
		if (device.getDevicegridid().intValue() > 0) {
			multiJSONArray = generateMultiScheduleJson_old(deviceid).getJSONArray("multi_schedules");
		}
		response.put("multi_schedules", multiJSONArray);
		return response;
	}

}
