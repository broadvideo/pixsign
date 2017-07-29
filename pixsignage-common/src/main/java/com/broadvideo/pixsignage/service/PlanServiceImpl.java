package com.broadvideo.pixsignage.service;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegrid;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Mediagrid;
import com.broadvideo.pixsignage.domain.Mediagriddtl;
import com.broadvideo.pixsignage.domain.Mmediadtl;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.domain.Pagezone;
import com.broadvideo.pixsignage.domain.Pagezonedtl;
import com.broadvideo.pixsignage.domain.Plan;
import com.broadvideo.pixsignage.domain.Planbind;
import com.broadvideo.pixsignage.domain.Plandtl;
import com.broadvideo.pixsignage.domain.Schedule;
import com.broadvideo.pixsignage.domain.Scheduledtl;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicegridMapper;
import com.broadvideo.pixsignage.persistence.DevicegroupMapper;
import com.broadvideo.pixsignage.persistence.MmediadtlMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.PageMapper;
import com.broadvideo.pixsignage.persistence.PlanMapper;
import com.broadvideo.pixsignage.persistence.PlanbindMapper;
import com.broadvideo.pixsignage.persistence.PlandtlMapper;
import com.broadvideo.pixsignage.persistence.ScheduleMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

@Service("planService")
public class PlanServiceImpl implements PlanService {

	@Autowired
	private PlanMapper planMapper;
	@Autowired
	private PlandtlMapper plandtlMapper;
	@Autowired
	private PlanbindMapper planbindMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private DevicegridMapper devicegridMapper;
	@Autowired
	private DevicegroupMapper devicegroupMapper;
	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private MmediadtlMapper mmediadtlMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;
	@Autowired
	private PageMapper pageMapper;

	@Autowired
	private ScheduleMapper scheduleMapper;

	public int selectCount(String orgid, String branchid, String plantype) {
		return planMapper.selectCount(orgid, branchid, plantype);
	}

	public List<Plan> selectList(String orgid, String branchid, String plantype, String start, String length) {
		return planMapper.selectList(orgid, branchid, plantype, start, length);
	}

	public List<Plan> selectListByBind(String plantype, String bindtype, String bindid) {
		return planMapper.selectListByBind(plantype, bindtype, bindid);
	}

	@Transactional
	public void addPlan(Plan plan) {
		planMapper.insertSelective(plan);
		for (Plandtl plandtl : plan.getPlandtls()) {
			plandtl.setPlanid(plan.getPlanid());
			plandtlMapper.insertSelective(plandtl);
		}
		for (Planbind planbind : plan.getPlanbinds()) {
			planbind.setPlanid(plan.getPlanid());
			planbindMapper.insertSelective(planbind);
		}
	}

	@Transactional
	public void updatePlan(Plan plan) {
		planMapper.updateByPrimaryKeySelective(plan);
		plandtlMapper.deleteByPlan("" + plan.getPlanid());
		for (Plandtl plandtl : plan.getPlandtls()) {
			plandtl.setPlanid(plan.getPlanid());
			plandtlMapper.insertSelective(plandtl);
		}
		planbindMapper.deleteByPlan("" + plan.getPlanid());
		for (Planbind planbind : plan.getPlanbinds()) {
			planbind.setPlanid(plan.getPlanid());
			planbindMapper.insertSelective(planbind);
		}
	}

	@Transactional
	public void deletePlan(String planid) {
		planMapper.deleteByPrimaryKey(planid);
	}

	@Transactional
	private void generateSyncEvent(int deviceid) {
		Msgevent msgevent = new Msgevent();
		msgevent.setMsgtype(Msgevent.MsgType_Plan);
		msgevent.setObjtype1(Msgevent.ObjType_1_Device);
		msgevent.setObjid1(deviceid);
		msgevent.setObjtype2(Msgevent.ObjType_2_None);
		msgevent.setObjid2(0);
		msgevent.setStatus(Msgevent.Status_Wait);
		msgeventMapper.deleteByDtl(Msgevent.MsgType_Plan, Msgevent.ObjType_1_Device, "" + deviceid, null, null, null);
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
	public void syncPlan(String planid) throws Exception {
		Plan plan = planMapper.selectByPrimaryKey(planid);
		if (plan != null) {
			List<Planbind> planbinds = plan.getPlanbinds();
			for (Planbind planbind : planbinds) {
				syncPlan(planbind.getBindtype(), "" + planbind.getBindid());
			}
		}
	}

	@Transactional
	public void syncPlan(String bindtype, String bindid) throws Exception {
		if (bindtype.equals(Planbind.BindType_Device)) {
			Device device = deviceMapper.selectByPrimaryKey(bindid);
			if (device.getOnlineflag().equals(Device.Online)) {
				generateSyncEvent(Integer.parseInt(bindid));
			}
		} else if (bindtype.equals(Planbind.BindType_Devicegroup)) {
			List<Device> devices = deviceMapper.selectByDevicegroup(bindid);
			for (Device device : devices) {
				if (device.getOnlineflag().equals(Device.Online)) {
					generateSyncEvent(Integer.parseInt(bindid));
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
		} else if (bindtype.equals(Planbind.BindType_Devicegrid)) {
			List<Device> devices = deviceMapper.selectByDevicegrid(bindid);
			for (Device device : devices) {
				if (device.getOnlineflag().equals(Device.Online)) {
					generateSyncEvent(device.getDeviceid());
				}
			}
		}
	}

	@Transactional
	public void syncPlanByPage(String pageid) throws Exception {
		List<HashMap<String, Object>> bindList = planMapper.selectBindListByObj(Plandtl.ObjType_Page, pageid);
		for (HashMap<String, Object> bindObj : bindList) {
			syncPlan(bindObj.get("bindtype").toString(), bindObj.get("bindid").toString());
		}
	}

	@Transactional
	public void syncPlanByMediagrid(String mediagridid) throws Exception {
		List<HashMap<String, Object>> bindList = planMapper.selectBindListByObj(Plandtl.ObjType_Mediagrid, mediagridid);
		for (HashMap<String, Object> bindObj : bindList) {
			syncPlan(bindObj.get("bindtype").toString(), bindObj.get("bindid").toString());
		}
	}

	private JSONArray generateSoloPlanJson(String deviceid) {
		JSONArray planJsonArray = new JSONArray();

		Device device = deviceMapper.selectByPrimaryKey(deviceid);

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");

		// generate final json
		List<Plan> planList;
		if (device.getDevicegroupid().intValue() == 0) {
			planList = planMapper.selectListByBind(Plan.PlanType_Solo, Planbind.BindType_Device, deviceid);
		} else {
			planList = planMapper.selectListByBind(Plan.PlanType_Solo, Planbind.BindType_Devicegroup,
					"" + device.getDevicegroupid());
		}
		for (Plan plan : planList) {
			JSONObject planJson = new JSONObject();
			planJsonArray.put(planJson);
			planJson.put("plan_id", plan.getPlanid());
			planJson.put("priority", plan.getPriority());
			planJson.put("play_mode", "daily");
			planJson.put("start_date",
					new SimpleDateFormat(CommonConstants.DateFormat_Date).format(plan.getStartdate()));
			planJson.put("end_date", new SimpleDateFormat(CommonConstants.DateFormat_Date).format(plan.getEnddate()));
			planJson.put("start_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(plan.getStarttime()));
			planJson.put("end_time", new SimpleDateFormat(CommonConstants.DateFormat_Time).format(plan.getEndtime()));

			JSONArray plandtlJsonArray = new JSONArray();
			JSONArray videoJsonArray = new JSONArray();
			HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();
			HashMap<Integer, Page> pageHash = new HashMap<Integer, Page>();
			for (Plandtl plandtl : plan.getPlandtls()) {
				if (plandtl.getObjtype().equals(Plandtl.ObjType_Page)) {
					Page page = pageMapper.selectByPrimaryKey("" + plandtl.getObjid());
					if (page != null && pageHash.get(page.getPageid()) == null) {
						pageHash.put(page.getPageid(), page);
						for (Page subpage : page.getSubpages()) {
							Page p = pageMapper.selectByPrimaryKey("" + subpage.getPageid());
							pageHash.put(p.getPageid(), p);
						}
					}

					String zipPath = "/page/" + plandtl.getObjid() + "/page-" + plandtl.getObjid() + ".zip";
					File zipFile = new File("/pixdata/pixsignage" + zipPath);
					if (zipFile.exists()) {
						JSONObject plandtlJson = new JSONObject();
						plandtlJson.put("plandtl_id", plandtl.getPlandtlid());
						plandtlJson.put("media_type", "page");
						plandtlJson.put("media_id", plandtl.getObjid());
						plandtlJson.put("url", "http://" + serverip + ":" + serverport + "/pixsigdata" + zipPath);
						plandtlJson.put("file", zipFile.getName());
						plandtlJson.put("size", FileUtils.sizeOf(zipFile));
						if (plandtl.getDuration() > 0) {
							plandtlJson.put("duration", plandtl.getDuration());
						}
						plandtlJsonArray.put(plandtlJson);
					}
				}

			}
			Iterator<Entry<Integer, Page>> iter = pageHash.entrySet().iterator();
			while (iter.hasNext()) {
				Entry<Integer, Page> entry = iter.next();
				Page page = entry.getValue();
				for (Pagezone pagezone : page.getPagezones()) {
					for (Pagezonedtl pagezonedtl : pagezone.getPagezonedtls()) {
						if (pagezonedtl.getVideo() != null) {
							if (videoHash.get(pagezonedtl.getObjid()) == null) {
								Video video = pagezonedtl.getVideo();
								JSONObject videoJson = new JSONObject();
								videoJson.put("id", video.getVideoid());
								videoJson.put("name", video.getName());
								videoJson.put("url",
										"http://" + serverip + ":" + serverport + "/pixsigdata" + video.getFilepath());
								videoJson.put("file", video.getFilename());
								videoJson.put("size", video.getSize());
								videoJson.put("thumbnail",
										"http://" + serverip + ":" + serverport + "/pixsigdata" + video.getThumbnail());
								videoHash.put(video.getVideoid(), videoJson);
								videoJsonArray.put(videoJson);
							}
						}
					}
				}
			}
			planJson.put("plandtls", plandtlJsonArray);
			planJson.put("videos", videoJsonArray);
		}

		return planJsonArray;
	}

	private JSONArray generateMultiPlanJson(String deviceid) {
		JSONArray planJsonArray = new JSONArray();

		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		String devicegridid = "" + device.getDevicegridid();
		int xpos = device.getXpos();
		int ypos = device.getYpos();

		if (device.getDevicegridid().intValue() == 0) {
			return planJsonArray;
		}

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");

		// generate final json
		List<Plan> planList;
		Devicegrid devicegrid = devicegridMapper.selectByPrimaryKey(devicegridid);
		if (devicegrid.getDevicegroupid().intValue() == 0) {
			planList = planMapper.selectListByBind(Plan.PlanType_Multi, Planbind.BindType_Devicegrid, devicegridid);
		} else {
			planList = planMapper.selectListByBind(Plan.PlanType_Multi, Planbind.BindType_Devicegroup,
					"" + devicegrid.getDevicegroupid());
		}
		for (Plan plan : planList) {
			JSONObject planJson = new JSONObject();
			planJsonArray.put(planJson);
			planJson.put("plan_id", plan.getPlanid());
			planJson.put("priority", plan.getPriority());
			planJson.put("play_mode", "daily");
			planJson.put("start_date",
					new SimpleDateFormat(CommonConstants.DateFormat_Date).format(plan.getStartdate()));
			planJson.put("end_date", new SimpleDateFormat(CommonConstants.DateFormat_Date).format(plan.getEnddate()));
			planJson.put("start_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(plan.getStarttime()));
			planJson.put("end_time", new SimpleDateFormat(CommonConstants.DateFormat_Time).format(plan.getEndtime()));
			JSONArray plandtlJsonArray = new JSONArray();
			planJson.put("plandtls", plandtlJsonArray);
			for (Plandtl plandtl : plan.getPlandtls()) {
				if (plandtl.getObjtype().equals(Plandtl.ObjType_Page)) {
					String zipPath = "/page/" + plandtl.getObjid() + "/page-" + plandtl.getObjid() + ".zip";
					File zipFile = new File("/pixdata/pixsignage" + zipPath);
					if (zipFile.exists()) {
						JSONObject plandtlJson = new JSONObject();
						plandtlJson.put("plandtl_id", plandtl.getPlandtlid());
						plandtlJson.put("media_type", "page");
						plandtlJson.put("media_master", "1");
						plandtlJson.put("media_id", plandtl.getObjid());
						plandtlJson.put("url", "http://" + serverip + ":" + serverport + "/pixsigdata" + zipPath);
						plandtlJson.put("file", zipFile.getName());
						plandtlJson.put("size", FileUtils.sizeOf(zipFile));
						if (plandtl.getDuration() > 0) {
							plandtlJson.put("duration", plandtl.getDuration());
						} else if (xpos == 0 && ypos == 0) {
							plandtlJson.put("duration", 30);
						} else {
							plandtlJson.put("duration", 0);
						}
						plandtlJson.put("max_times", plandtl.getMaxtimes());
						plandtlJson.put("tags", "");
						plandtlJsonArray.put(plandtlJson);
					}
				} else if (plandtl.getObjtype().equals(Plandtl.ObjType_Video)) {
					JSONObject plandtlJson = new JSONObject();
					Video video = plandtl.getVideo();
					plandtlJson.put("plandtl_id", plandtl.getPlandtlid());
					plandtlJson.put("media_type", "video");
					plandtlJson.put("media_master", "1");
					plandtlJson.put("media_id", plandtl.getObjid());
					plandtlJson.put("url",
							"http://" + serverip + ":" + serverport + "/pixsigdata" + video.getFilepath());
					plandtlJson.put("file", video.getFilename());
					plandtlJson.put("size", video.getSize());
					plandtlJson.put("duration", plandtl.getDuration());
					plandtlJson.put("max_times", plandtl.getMaxtimes());
					plandtlJson.put("tags", video.getTags());
					plandtlJsonArray.put(plandtlJson);
				} else if (plandtl.getObjtype().equals(Plandtl.ObjType_Image)) {
					JSONObject plandtlJson = new JSONObject();
					Image image = plandtl.getImage();
					plandtlJson.put("plandtl_id", plandtl.getPlandtlid());
					plandtlJson.put("media_type", "image");
					plandtlJson.put("media_master", "1");
					plandtlJson.put("media_id", plandtl.getObjid());
					plandtlJson.put("url",
							"http://" + serverip + ":" + serverport + "/pixsigdata" + image.getFilepath());
					plandtlJson.put("file", image.getFilename());
					plandtlJson.put("size", image.getSize());
					if (plandtl.getDuration() > 0) {
						plandtlJson.put("duration", plandtl.getDuration());
					} else if (xpos == 0 && ypos == 0) {
						plandtlJson.put("duration", 10);
					} else {
						plandtlJson.put("duration", 0);
					}
					plandtlJson.put("max_times", plandtl.getMaxtimes());
					plandtlJson.put("tags", "");
					plandtlJsonArray.put(plandtlJson);
				} else if (plandtl.getObjtype().equals(Plandtl.ObjType_Mediagrid)) {
					Mediagrid mediagrid = plandtl.getMediagrid();
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
									JSONObject plandtlJson = new JSONObject();
									plandtlJson.put("plandtl_id", plandtl.getPlandtlid());
									plandtlJson.put("media_type", "page");
									if (mastergriddtl != null
											&& mastergriddtl.getObjtype().equals(mediagriddtl.getObjtype())
											&& mastergriddtl.getObjid().intValue() == mediagriddtl.getObjid()
													.intValue()) {
										plandtlJson.put("media_master", "1");
									} else {
										plandtlJson.put("media_master", "0");
									}
									plandtlJson.put("media_id", mediagriddtl.getObjid());
									plandtlJson.put("url",
											"http://" + serverip + ":" + serverport + "/pixsigdata" + zipPath);
									plandtlJson.put("file", zipFile.getName());
									plandtlJson.put("size", FileUtils.sizeOf(zipFile));
									if (plandtl.getDuration() > 0) {
										plandtlJson.put("duration", plandtl.getDuration());
									} else if (xpos == 0 && ypos == 0) {
										plandtlJson.put("duration", 30);
									} else {
										plandtlJson.put("duration", 0);
									}
									plandtlJson.put("max_times", plandtl.getMaxtimes());
									plandtlJson.put("tags", "");
									plandtlJsonArray.put(plandtlJson);
								}
							} else {
								Mmediadtl mmediadtl = mmediadtlMapper.selectByPos("" + mediagriddtl.getMmediaid(),
										"" + x, "" + y);
								if (mmediadtl != null && mediagriddtl.getObjtype().equals(Mediagriddtl.ObjType_Video)) {
									JSONObject plandtlJson = new JSONObject();
									plandtlJson.put("plandtl_id", plandtl.getPlandtlid());
									plandtlJson.put("media_type", "cropvideo");
									if (mastergriddtl != null
											&& mastergriddtl.getObjtype().equals(mediagriddtl.getObjtype())
											&& mastergriddtl.getObjid().intValue() == mediagriddtl.getObjid()
													.intValue()) {
										plandtlJson.put("media_master", "1");
									} else {
										plandtlJson.put("media_master", "0");
									}
									plandtlJson.put("media_id", mmediadtl.getMmediadtlid());
									plandtlJson.put("url", "http://" + serverip + ":" + serverport + "/pixsigdata"
											+ mmediadtl.getFilepath());
									plandtlJson.put("file", mmediadtl.getFilename());
									plandtlJson.put("size", mmediadtl.getSize());
									plandtlJson.put("duration", plandtl.getDuration());
									plandtlJson.put("max_times", plandtl.getMaxtimes());
									plandtlJson.put("tags", "");
									plandtlJsonArray.put(plandtlJson);
								} else if (mmediadtl != null
										&& mediagriddtl.getObjtype().equals(Mediagriddtl.ObjType_Image)) {
									JSONObject plandtlJson = new JSONObject();
									plandtlJson.put("plandtl_id", plandtl.getPlandtlid());
									plandtlJson.put("media_type", "cropimage");
									if (mastergriddtl != null
											&& mastergriddtl.getObjtype().equals(mediagriddtl.getObjtype())
											&& mastergriddtl.getObjid().intValue() == mediagriddtl.getObjid()
													.intValue()) {
										plandtlJson.put("media_master", "1");
									} else {
										plandtlJson.put("media_master", "0");
									}
									plandtlJson.put("media_id", mmediadtl.getMmediadtlid());
									plandtlJson.put("url", "http://" + serverip + ":" + serverport + "/pixsigdata"
											+ mmediadtl.getFilepath());
									plandtlJson.put("file", mmediadtl.getFilename());
									plandtlJson.put("size", mmediadtl.getSize());
									if (plandtl.getDuration() > 0) {
										plandtlJson.put("duration", plandtl.getDuration());
									} else if (xpos == 0 && ypos == 0) {
										plandtlJson.put("duration", 10);
									} else {
										plandtlJson.put("duration", 0);
									}
									plandtlJson.put("max_times", plandtl.getMaxtimes());
									plandtlJson.put("tags", "");
									plandtlJsonArray.put(plandtlJson);
								}
							}
						}
					}
				}

			}
		}

		return planJsonArray;
	}

	public JSONObject generatePlanJson(String deviceid) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("plans", generateSoloPlanJson(deviceid));
		responseJson.put("multi_plans", generateMultiPlanJson(deviceid));
		return responseJson;
	}

	@Transactional
	public void upgrade2multiplan() {
		int count = planMapper.selectCount(null, null, Plan.PlanType_Multi);
		if (count > 0) {
			return;
		}
		List<Devicegrid> devicegrids = devicegridMapper.selectList(null, null, null, "0", null, null, null);
		for (Devicegrid devicegrid : devicegrids) {
			List<Schedule> schedules = scheduleMapper.selectList(Schedule.ScheduleType_Multi,
					Schedule.BindType_Devicegrid, "" + devicegrid.getDevicegridid(), Schedule.PlayMode_Daily);
			for (Schedule schedule : schedules) {
				Plan plan = new Plan();
				plan.setOrgid(devicegrid.getOrgid());
				plan.setBranchid(devicegrid.getBranchid());
				plan.setPlantype(Plan.PlanType_Multi);
				plan.setGridlayoutcode(devicegrid.getGridlayoutcode());
				plan.setStartdate(CommonUtil.parseDate("1970-01-01", CommonConstants.DateFormat_Date));
				plan.setEnddate(CommonUtil.parseDate("2037-01-01", CommonConstants.DateFormat_Date));
				plan.setStarttime(schedule.getStarttime());
				plan.setEndtime(schedule.getEndtime());
				plan.setCreatetime(schedule.getCreatetime());
				planMapper.insertSelective(plan);

				Planbind planbind = new Planbind();
				planbind.setPlanid(plan.getPlanid());
				planbind.setBindtype(Planbind.BindType_Devicegrid);
				planbind.setBindid(devicegrid.getDevicegridid());
				planbindMapper.insertSelective(planbind);

				for (Scheduledtl scheduledtl : schedule.getScheduledtls()) {
					Plandtl plandtl = new Plandtl();
					plandtl.setPlanid(plan.getPlanid());
					plandtl.setObjtype(scheduledtl.getObjtype());
					plandtl.setObjid(scheduledtl.getObjid());
					plandtl.setDuration(scheduledtl.getDuration());
					plandtl.setMaxtimes(0);
					plandtl.setSequence(scheduledtl.getSequence());
					plandtlMapper.insertSelective(plandtl);
				}

			}
		}

		List<Devicegroup> devicegroups = devicegroupMapper.selectList(null, null, "2", null, null, null, null);
		for (Devicegroup devicegroup : devicegroups) {
			List<Schedule> schedules = scheduleMapper.selectList(Schedule.ScheduleType_Multi,
					Schedule.BindType_Devicegroup, "" + devicegroup.getDevicegroupid(), Schedule.PlayMode_Daily);
			for (Schedule schedule : schedules) {
				Plan plan = new Plan();
				plan.setOrgid(devicegroup.getOrgid());
				plan.setBranchid(devicegroup.getBranchid());
				plan.setPlantype(Plan.PlanType_Multi);
				plan.setGridlayoutcode(devicegroup.getGridlayoutcode());
				plan.setStartdate(CommonUtil.parseDate("1970-01-01", CommonConstants.DateFormat_Date));
				plan.setEnddate(CommonUtil.parseDate("2037-01-01", CommonConstants.DateFormat_Date));
				plan.setStarttime(schedule.getStarttime());
				plan.setEndtime(schedule.getEndtime());
				plan.setCreatetime(schedule.getCreatetime());
				planMapper.insertSelective(plan);

				Planbind planbind = new Planbind();
				planbind.setPlanid(plan.getPlanid());
				planbind.setBindtype(Planbind.BindType_Devicegroup);
				planbind.setBindid(devicegroup.getDevicegroupid());
				planbindMapper.insertSelective(planbind);

				for (Scheduledtl scheduledtl : schedule.getScheduledtls()) {
					Plandtl plandtl = new Plandtl();
					plandtl.setPlanid(plan.getPlanid());
					plandtl.setObjtype(scheduledtl.getObjtype());
					plandtl.setObjid(scheduledtl.getObjid());
					plandtl.setDuration(scheduledtl.getDuration());
					plandtl.setMaxtimes(0);
					plandtl.setSequence(scheduledtl.getSequence());
					plandtlMapper.insertSelective(plandtl);
				}

			}
		}
	}

}
