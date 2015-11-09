package com.broadvideo.pixsignage.service;

import java.io.File;
import java.text.SimpleDateFormat;
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
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Dvb;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Layout;
import com.broadvideo.pixsignage.domain.Layoutdtl;
import com.broadvideo.pixsignage.domain.Layoutschedule;
import com.broadvideo.pixsignage.domain.Medialistdtl;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Region;
import com.broadvideo.pixsignage.domain.Regionschedule;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.domain.Stream;
import com.broadvideo.pixsignage.domain.Task;
import com.broadvideo.pixsignage.domain.Text;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.domain.Widget;
import com.broadvideo.pixsignage.persistence.DevicefileMapper;
import com.broadvideo.pixsignage.persistence.DvbMapper;
import com.broadvideo.pixsignage.persistence.LayoutMapper;
import com.broadvideo.pixsignage.persistence.LayoutdtlMapper;
import com.broadvideo.pixsignage.persistence.LayoutscheduleMapper;
import com.broadvideo.pixsignage.persistence.MedialistdtlMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.RegionMapper;
import com.broadvideo.pixsignage.persistence.RegionscheduleMapper;
import com.broadvideo.pixsignage.persistence.StreamMapper;
import com.broadvideo.pixsignage.persistence.TaskMapper;
import com.broadvideo.pixsignage.persistence.TextMapper;
import com.broadvideo.pixsignage.persistence.WidgetMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

@Service("layoutService")
public class LayoutServiceImpl implements LayoutService {

	@Autowired
	private LayoutMapper layoutMapper;
	@Autowired
	private LayoutdtlMapper layoutdtlMapper;
	@Autowired
	private RegionMapper regionMapper;
	@Autowired
	private TaskMapper taskMapper;
	@Autowired
	private LayoutscheduleMapper layoutscheduleMapper;
	@Autowired
	private RegionscheduleMapper regionscheduleMapper;
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
	private DevicefileMapper devicefileMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;

	public Layout selectByPrimaryKey(String layoutid) {
		return layoutMapper.selectByPrimaryKey(layoutid);
	}

	public List<Layout> selectList(String orgid, String type) {
		return layoutMapper.selectList(orgid, type);
	}

	public List<Layoutdtl> selectLayoutdtlList(String layoutid) {
		return layoutdtlMapper.selectList(layoutid);
	}

	public List<Region> selectRegionList() {
		return regionMapper.selectList();
	}

	public List<Region> selectActiveRegionList() {
		return regionMapper.selectActiveList();
	}

	@Transactional
	public void addLayout(Layout layout) {
		if (layout.getRatio().equals("1")) {
			// 16:9
			layout.setWidth(1920);
			layout.setHeight(1080);
		} else if (layout.getRatio().equals("2")) {
			// 9:16
			layout.setWidth(1080);
			layout.setHeight(1920);
		} else if (layout.getRatio().equals("3")) {
			// 4:3
			layout.setWidth(800);
			layout.setHeight(600);
		} else if (layout.getRatio().equals("4")) {
			// 3:4
			layout.setWidth(600);
			layout.setHeight(800);
		}
		layoutMapper.insertSelective(layout);

		Layoutdtl layoutdtl = new Layoutdtl();
		layoutdtl.setLayoutid(layout.getLayoutid());
		layoutdtl.setRegionid(1);
		layoutdtl.setWidth(layout.getWidth());
		layoutdtl.setHeight(layout.getHeight());
		layoutdtl.setTopoffset(0);
		layoutdtl.setLeftoffset(0);
		layoutdtl.setZindex(0);
		layoutdtl.setIntervaltime(10);
		layoutdtl.setDirection("4");
		layoutdtl.setSpeed("2");
		layoutdtl.setColor("#FFFFFF");
		layoutdtl.setSize(30);
		layoutdtl.setOpacity(100);
		layoutdtlMapper.insertSelective(layoutdtl);
	}

	@Transactional
	public void updateLayout(Layout layout) {
		layoutMapper.updateByPrimaryKeySelective(layout);
	}

	@Transactional
	public void deleteLayout(String layoutid) {
		layoutMapper.deleteByPrimaryKey(layoutid);
	}

	@Transactional
	public void syncLayoutdtlList(Layout layout, Layoutdtl[] layoutdtls) {
		int layoutid = layout.getLayoutid();
		List<Layoutdtl> oldlayoutdtls = layoutdtlMapper.selectList("" + layoutid);
		HashMap<Integer, Layoutdtl> hash = new HashMap<Integer, Layoutdtl>();
		for (int i = 0; i < layoutdtls.length; i++) {
			Layoutdtl layoutdtl = layoutdtls[i];
			if (layoutdtl.getLayoutdtlid() == 0) {
				layoutdtl.setLayoutid(layoutid);
				layoutdtlMapper.insertSelective(layoutdtl);
			} else {
				layoutdtlMapper.updateByPrimaryKeySelective(layoutdtl);
				hash.put(layoutdtl.getLayoutdtlid(), layoutdtl);
			}
		}
		for (int i = 0; i < oldlayoutdtls.size(); i++) {
			if (hash.get(oldlayoutdtls.get(i).getLayoutdtlid()) == null) {
				layoutdtlMapper.deleteByPrimaryKey("" + oldlayoutdtls.get(i).getLayoutdtlid());
			}
		}
	}

	@Transactional
	public String handleWizard(Staff staff, Layout layout, Device[] devices, Devicegroup[] devicegroups) {
		SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat timeformat = new SimpleDateFormat("HH:mm:ss");

		Task task = new Task();
		task.setOrgid(staff.getOrgid());
		task.setBranchid(staff.getBranchid());
		task.setCreatestaffid(staff.getStaffid());
		task.setName(staff.getName() + "-" + layout.getName() + "-"
				+ new SimpleDateFormat("yyyyMMdd").format(System.currentTimeMillis()) + "-"
				+ new SimpleDateFormat("HHmm").format(System.currentTimeMillis()));
		taskMapper.insertSelective(task);

		List<Layoutdtl> layoutdtls = layout.getLayoutdtls();

		for (int i = 0; i < devices.length; i++) {
			Device device = devices[i];
			layoutscheduleMapper.deleteByBind("1", "" + device.getDeviceid());
			Layoutschedule layoutschedule = new Layoutschedule();
			layoutschedule.setBindtype("1");
			layoutschedule.setBindid(device.getDeviceid());
			layoutschedule.setLayoutid(layout.getLayoutid());
			layoutschedule.setPlaymode("2");
			try {
				layoutschedule.setStarttime(CommonConstants.DateFormat_Time.parse("00:00:00"));
			} catch (Exception e) {
			}
			layoutscheduleMapper.insertSelective(layoutschedule);

			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Layout_Schedule);
			msgevent.setObjtype1(Msgevent.ObjType_1_Device);
			msgevent.setObjid1(device.getDeviceid());
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Layout_Schedule, Msgevent.ObjType_1_Device,
					"" + device.getDeviceid(), null, null, null);
			msgeventMapper.insertSelective(msgevent);

			regionscheduleMapper.deleteByBind("1", "" + device.getDeviceid());
			for (Layoutdtl layoutdtl : layoutdtls) {
				List<HashMap<String, String>> regiondtls = layoutdtl.getRegiondtls();
				for (HashMap<String, String> regiondtl : regiondtls) {
					Regionschedule regionschedule = new Regionschedule();
					regionschedule.setBindtype("1");
					regionschedule.setBindid(device.getDeviceid());
					regionschedule.setRegionid(layoutdtl.getRegionid());
					regionschedule.setPlaymode(regiondtl.get("playmode"));
					if (regiondtl.get("playdate") != null) {
						try {
							regionschedule.setPlaydate(dateformat.parse(regiondtl.get("playdate")));
						} catch (Exception e) {
						}
					}
					if (regiondtl.get("starttime") != null) {
						try {
							regionschedule.setStarttime(timeformat.parse(regiondtl.get("starttime")));
						} catch (Exception e) {
						}
					}
					if (regiondtl.get("endtime") != null) {
						try {
							regionschedule.setEndtime(timeformat.parse(regiondtl.get("endtime")));
						} catch (Exception e) {
						}
					}
					regionschedule.setObjtype(regiondtl.get("objtype"));
					regionschedule.setObjid(Integer.parseInt(regiondtl.get("objid")));
					regionschedule.setTaskid(task.getTaskid());
					regionscheduleMapper.insertSelective(regionschedule);
				}

				msgevent = new Msgevent();
				msgevent.setMsgtype(Msgevent.MsgType_Region_Schedule);
				msgevent.setObjtype1(Msgevent.ObjType_1_Device);
				msgevent.setObjid1(device.getDeviceid());
				msgevent.setObjtype2(Msgevent.ObjType_2_Region);
				msgevent.setObjid2(layoutdtl.getRegionid());
				msgevent.setStatus(Msgevent.Status_Wait);
				msgeventMapper.deleteByDtl(Msgevent.MsgType_Region_Schedule, Msgevent.ObjType_1_Device,
						"" + device.getDeviceid(), Msgevent.ObjType_2_Region, "" + layoutdtl.getRegionid(), null);
				msgeventMapper.insertSelective(msgevent);
			}

			devicefileMapper.deleteDeviceVideoFiles("" + device.getDeviceid());
			devicefileMapper.deleteDeviceImageFiles("" + device.getDeviceid());
			devicefileMapper.insertDeviceVideoFiles("" + device.getDeviceid(), "" + task.getTaskid());
			devicefileMapper.insertDeviceImageFiles("" + device.getDeviceid(), "" + task.getTaskid());
		}

		for (int i = 0; i < devicegroups.length; i++) {
			Devicegroup devicegroup = devicegroups[i];
			layoutscheduleMapper.deleteByBind("2", "" + devicegroup.getDevicegroupid());
			Layoutschedule layoutschedule = new Layoutschedule();
			layoutschedule.setBindtype("2");
			layoutschedule.setBindid(devicegroup.getDevicegroupid());
			layoutschedule.setLayoutid(layout.getLayoutid());
			layoutschedule.setPlaymode("2");
			try {
				layoutschedule.setStarttime(CommonConstants.DateFormat_Time.parse("00:00:00"));
			} catch (Exception e) {
			}
			layoutscheduleMapper.insertSelective(layoutschedule);

			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Layout_Schedule);
			msgevent.setObjtype1(Msgevent.ObjType_1_DeviceGroup);
			msgevent.setObjid1(devicegroup.getDevicegroupid());
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Layout_Schedule, Msgevent.ObjType_1_DeviceGroup,
					"" + devicegroup.getDevicegroupid(), null, null, null);
			msgeventMapper.insertSelective(msgevent);

			regionscheduleMapper.deleteByBind("2", "" + devicegroup.getDevicegroupid());
			for (Layoutdtl layoutdtl : layoutdtls) {
				List<HashMap<String, String>> regiondtls = layoutdtl.getRegiondtls();
				for (HashMap<String, String> regiondtl : regiondtls) {
					Regionschedule regionschedule = new Regionschedule();
					regionschedule.setBindtype("2");
					regionschedule.setBindid(devicegroup.getDevicegroupid());
					regionschedule.setRegionid(layoutdtl.getRegionid());
					regionschedule.setPlaymode(regiondtl.get("playmode"));
					if (regiondtl.get("playdate") != null) {
						try {
							regionschedule.setPlaydate(dateformat.parse(regiondtl.get("playdate")));
						} catch (Exception e) {
						}
					}
					if (regiondtl.get("starttime") != null) {
						try {
							regionschedule.setStarttime(timeformat.parse(regiondtl.get("starttime")));
						} catch (Exception e) {
						}
					}
					if (regiondtl.get("endtime") != null) {
						try {
							regionschedule.setEndtime(timeformat.parse(regiondtl.get("endtime")));
						} catch (Exception e) {
						}
					}
					regionschedule.setObjtype(regiondtl.get("objtype"));
					regionschedule.setObjid(Integer.parseInt(regiondtl.get("objid")));
					regionschedule.setTaskid(task.getTaskid());
					regionscheduleMapper.insertSelective(regionschedule);
				}

				msgevent = new Msgevent();
				msgevent.setMsgtype(Msgevent.MsgType_Region_Schedule);
				msgevent.setObjtype1(Msgevent.ObjType_1_DeviceGroup);
				msgevent.setObjid1(devicegroup.getDevicegroupid());
				msgevent.setObjtype2(Msgevent.ObjType_2_Region);
				msgevent.setObjid2(layoutdtl.getRegionid());
				msgevent.setStatus(Msgevent.Status_Wait);
				msgeventMapper.deleteByDtl(Msgevent.MsgType_Region_Schedule, Msgevent.ObjType_1_DeviceGroup,
						"" + devicegroup.getDevicegroupid(), Msgevent.ObjType_2_Region, "" + layoutdtl.getRegionid(),
						null);
				msgeventMapper.insertSelective(msgevent);
			}

			devicefileMapper.deleteDevicegroupVideoFiles("" + devicegroup.getDevicegroupid());
			devicefileMapper.deleteDevicegroupImageFiles("" + devicegroup.getDevicegroupid());
			devicefileMapper.insertDevicegroupVideoFiles("" + devicegroup.getDevicegroupid(), "" + task.getTaskid());
			devicefileMapper.insertDevicegroupImageFiles("" + devicegroup.getDevicegroupid(), "" + task.getTaskid());
		}

		return "" + task.getTaskid();
	}

	public JSONObject generateLayoutScheduleJson(String bindtype, String bindid) {
		// bindtype: 1-device 2-devicegroup
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
					regionJson.put("type", layoutdtl.getRegion().getType());
					regionJson.put("interval", layoutdtl.getIntervaltime());
					regionJson.put("direction", "" + layoutdtl.getDirection());
					regionJson.put("speed", "" + layoutdtl.getSpeed());
					regionJson.put("color", "" + layoutdtl.getColor());
					regionJson.put("size", layoutdtl.getSize());
					regionJson.put("opacity", layoutdtl.getOpacity());
				}
			}
		}

		return responseJson;
	}

	public JSONObject generateRegionScheduleJson(String bindtype, String bindid, String regionid) {
		// bindtype: 1-device 2-devicegroup
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
									+ CommonConfig.CONFIG_SERVER_PORT + "/pixsigdata" + video.getFilename());
							videoJson.put("file", new File(video.getFilename()).getName());
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
									+ CommonConfig.CONFIG_SERVER_PORT + "/pixsigdata" + image.getFilename());
							imageJson.put("file", new File(image.getFilename()).getName());
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
