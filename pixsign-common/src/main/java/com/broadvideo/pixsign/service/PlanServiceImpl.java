package com.broadvideo.pixsign.service;

import java.io.File;
import java.io.FileInputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsign.common.CommonConstants;
import com.broadvideo.pixsign.domain.Device;
import com.broadvideo.pixsign.domain.Org;
import com.broadvideo.pixsign.domain.Page;
import com.broadvideo.pixsign.domain.Pagezone;
import com.broadvideo.pixsign.domain.Pagezonedtl;
import com.broadvideo.pixsign.domain.Plan;
import com.broadvideo.pixsign.domain.Planbind;
import com.broadvideo.pixsign.domain.Plandtl;
import com.broadvideo.pixsign.domain.Video;
import com.broadvideo.pixsign.persistence.ConfigMapper;
import com.broadvideo.pixsign.persistence.DeviceMapper;
import com.broadvideo.pixsign.persistence.DevicegroupMapper;
import com.broadvideo.pixsign.persistence.OrgMapper;
import com.broadvideo.pixsign.persistence.PageMapper;
import com.broadvideo.pixsign.persistence.PlanMapper;
import com.broadvideo.pixsign.persistence.PlanbindMapper;
import com.broadvideo.pixsign.persistence.PlandtlMapper;
import com.broadvideo.pixsign.persistence.ScheduleMapper;
import com.broadvideo.pixsign.util.CommonUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

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
	private DevicegroupMapper devicegroupMapper;
	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private PageMapper pageMapper;
	@Autowired
	private OrgMapper orgMapper;

	@Autowired
	private ScheduleMapper scheduleMapper;
	@Autowired
	private BundleService bundleService;

	public int selectCount(String orgid, String branchid, String subbranchflag, String plantype, String search) {
		return planMapper.selectCount(orgid, branchid, subbranchflag, plantype, search);
	}

	public List<Plan> selectList(String orgid, String branchid, String subbranchflag, String plantype, String start,
			String length, String search) {
		return planMapper.selectList(orgid, branchid, subbranchflag, plantype, start, length, search);
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

	public JSONObject generateBundlePlanJson(String deviceid) {
		JSONObject responseJson = new JSONObject();
		List<Integer> bundleids = new ArrayList<Integer>();
		JSONArray planJsonArray = new JSONArray();
		List<Plan> planList;
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		if (device.getDevicegroupid().intValue() == 0) {
			planList = planMapper.selectListByBind(Plan.PlanType_Bundle, Planbind.BindType_Device, deviceid);
		} else {
			planList = planMapper.selectListByBind(Plan.PlanType_Bundle, Planbind.BindType_Devicegroup,
					"" + device.getDevicegroupid());
		}
		for (Plan plan : planList) {
			JSONObject planJson = new JSONObject();
			planJson.put("schedule_id", plan.getPlanid());
			planJson.put("priority", plan.getPriority());
			planJson.put("play_mode", "daily");
			planJson.put("start_date",
					new SimpleDateFormat(CommonConstants.DateFormat_Date).format(plan.getStartdate()));
			planJson.put("end_date", new SimpleDateFormat(CommonConstants.DateFormat_Date).format(plan.getEnddate()));
			planJson.put("start_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(plan.getStarttime()));
			planJson.put("end_time", new SimpleDateFormat(CommonConstants.DateFormat_Time).format(plan.getEndtime()));

			JSONArray plandtlJsonArray = new JSONArray();
			for (Plandtl plandtl : plan.getPlandtls()) {
				if (plandtl.getObjtype().equals(Plandtl.ObjType_Bundle)) {
					JSONObject plandtlJson = new JSONObject();
					plandtlJson.put("scheduledtl_id", plandtl.getPlandtlid());
					plandtlJson.put("media_type", "bundle");
					plandtlJson.put("media_id", plandtl.getObjid());
					plandtlJsonArray.add(plandtlJson);
					bundleids.add(plandtl.getObjid());
				}

			}
			planJson.put("scheduledtls", plandtlJsonArray);
			planJsonArray.add(planJson);
		}
		responseJson.put("schedules", planJsonArray);
		responseJson.put("bundles", bundleService.generateBundleJsonArray(bundleids));
		return responseJson;
	}

	private JSONArray generatePagePlanJson(String deviceid) throws Exception {
		JSONArray planJsonArray = new JSONArray();

		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		Map<String, Class> map = new HashMap<String, Class>();
		map.put("subpages", Page.class);
		map.put("pagezones", Pagezone.class);
		map.put("pagezonedtls", Pagezonedtl.class);

		// generate final json
		List<Plan> planList = new ArrayList<Plan>();
		if (org.getPageplanflag().equals("1") && device.getDefaultpage() != null) {
			Plan plan = new Plan();
			plan.setPlanid(0);
			plan.setPlantype(Plan.PlanType_Page);
			plan.setStartdate(CommonUtil.parseDate("1970-01-01", CommonConstants.DateFormat_Date));
			plan.setEnddate(CommonUtil.parseDate("2037-01-01", CommonConstants.DateFormat_Date));
			plan.setStarttime(CommonUtil.parseDate("00:00:00", CommonConstants.DateFormat_Time));
			plan.setEndtime(CommonUtil.parseDate("00:00:00", CommonConstants.DateFormat_Time));
			plan.setPriority(0);
			Plandtl plandtl = new Plandtl();
			plandtl.setPlandtlid(0);
			plandtl.setPlanid(0);
			plandtl.setObjtype(Plandtl.ObjType_Page);
			plandtl.setObjid(device.getDefaultpageid());
			plandtl.setDuration(60);
			plandtl.setMaxtimes(0);
			List<Plandtl> plandtls = new ArrayList<Plandtl>();
			plandtls.add(plandtl);
			plan.setPlandtls(plandtls);
			planList.add(plan);

		} else if (org.getPageplanflag().equals("0")) {
			if (device.getDevicegroupid().intValue() == 0) {
				planList = planMapper.selectListByBind(Plan.PlanType_Page, Planbind.BindType_Device, deviceid);
			} else {
				planList = planMapper.selectListByBind(Plan.PlanType_Page, Planbind.BindType_Devicegroup,
						"" + device.getDevicegroupid());
			}
		}

		for (Plan plan : planList) {
			JSONObject planJson = new JSONObject();
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
					if (page != null && !page.getReviewflag().equals(Page.REVIEW_PASSED)) {
						JSONObject pageJson = JSONObject.fromObject(page.getJson());
						page = (Page) JSONObject.toBean(pageJson, Page.class, map);
					}
					if (page != null && pageHash.get(page.getPageid()) == null) {
						pageHash.put(page.getPageid(), page);
						for (Page subpage : page.getSubpages()) {
							Page p = pageMapper.selectByPrimaryKey("" + subpage.getPageid());
							if (p != null && !p.getReviewflag().equals(Page.REVIEW_PASSED)) {
								JSONObject pageJson = JSONObject.fromObject(p.getJson());
								p = (Page) JSONObject.toBean(pageJson, Page.class, map);
							}
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
						plandtlJson.put("url", "http://" + serverip + ":" + serverport + "/pixsigndata" + zipPath);
						plandtlJson.put("path", "/pixsigndata" + zipPath);
						plandtlJson.put("file", zipFile.getName());
						plandtlJson.put("size", FileUtils.sizeOf(zipFile));
						plandtlJson.put("checksum", DigestUtils.md5Hex(new FileInputStream(zipFile)));
						if (plandtl.getDuration() > 0) {
							plandtlJson.put("duration", plandtl.getDuration());
						}
						plandtlJsonArray.add(plandtlJson);
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
										"http://" + serverip + ":" + serverport + "/pixsigndata" + video.getFilepath());
								videoJson.put("path", "/pixsigndata" + video.getFilepath());
								videoJson.put("file", video.getFilename());
								videoJson.put("size", video.getSize());
								videoJson.put("thumbnail",
										"http://" + serverip + ":" + serverport + "/pixsigndata" + video.getThumbnail());
								videoHash.put(video.getVideoid(), videoJson);
								videoJsonArray.add(videoJson);
							}
						}
					}
				}
			}
			planJson.put("plandtls", plandtlJsonArray);
			planJson.put("videos", videoJsonArray);
			planJsonArray.add(planJson);
		}

		return planJsonArray;
	}

	public JSONObject generatePlanJson(String deviceid) throws Exception {
		JSONObject responseJson = new JSONObject();
		responseJson.put("plans", generatePagePlanJson(deviceid));
		return responseJson;
	}

}
