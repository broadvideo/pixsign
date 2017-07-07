package com.broadvideo.pixsignage.service;

import java.io.File;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.domain.Pagezone;
import com.broadvideo.pixsignage.domain.Pagezonedtl;
import com.broadvideo.pixsignage.domain.Schedule;
import com.broadvideo.pixsignage.domain.Scheduledtl;
import com.broadvideo.pixsignage.domain.Template;
import com.broadvideo.pixsignage.domain.Templatezone;
import com.broadvideo.pixsignage.domain.Templatezonedtl;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.PageMapper;
import com.broadvideo.pixsignage.persistence.PagezoneMapper;
import com.broadvideo.pixsignage.persistence.PagezonedtlMapper;
import com.broadvideo.pixsignage.persistence.ScheduleMapper;
import com.broadvideo.pixsignage.persistence.ScheduledtlMapper;
import com.broadvideo.pixsignage.persistence.TemplateMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

@Service("pageService")
public class PageServiceImpl implements PageService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private PageMapper pageMapper;
	@Autowired
	private PagezoneMapper pagezoneMapper;
	@Autowired
	private PagezonedtlMapper pagezonedtlMapper;
	@Autowired
	private TemplateMapper templateMapper;
	@Autowired
	private ScheduleMapper scheduleMapper;
	@Autowired
	private ScheduledtlMapper scheduledtlMapper;
	@Autowired
	private ConfigMapper configMapper;

	@Autowired
	private ScheduleService scheduleService;

	public Page selectByPrimaryKey(String pageid) {
		return pageMapper.selectByPrimaryKey(pageid);
	}

	public int selectCount(String orgid, String branchid, String search) {
		return pageMapper.selectCount(orgid, branchid, search);
	}

	public List<Page> selectList(String orgid, String branchid, String search, String start, String length) {
		return pageMapper.selectList(orgid, branchid, search, start, length);
	}

	@Transactional
	public void addPage(Page page) throws Exception {
		if (page.getName() == null || page.getName().equals("")) {
			page.setName("UNKNOWN");
		}
		Template template = templateMapper.selectByPrimaryKey("" + page.getTemplateid());
		if (template == null) {
			// Create page from blank
			if (page.getRatio().equals("1")) {
				// 16:9
				page.setWidth(1920);
				page.setHeight(1080);
			} else if (page.getRatio().equals("2")) {
				// 9:16
				page.setWidth(1080);
				page.setHeight(1920);
			}
			page.setUpdatetime(Calendar.getInstance().getTime());
			pageMapper.insertSelective(page);

			if (page.getName().equals("UNKNOWN")) {
				page.setName("PAGE-" + page.getPageid());
			}
			pageMapper.updateByPrimaryKeySelective(page);
		} else {
			// Create page from template
			page.setTemplateid(template.getTemplateid());
			page.setRatio(template.getRatio());
			page.setHeight(template.getHeight());
			page.setWidth(template.getWidth());
			page.setUpdatetime(Calendar.getInstance().getTime());
			pageMapper.insertSelective(page);
			if (page.getName().equals("UNKNOWN")) {
				page.setName("PAGE-" + template.getTemplateid());
			}
			if (template.getSnapshot() != null) {
				String snapshotFilePath = "/page/" + page.getPageid() + "/snapshot/" + page.getPageid() + ".png";
				File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + template.getSnapshot()), snapshotFile);
				page.setSnapshot(snapshotFilePath);
			}
			pageMapper.updateByPrimaryKeySelective(page);

			List<Templatezone> templatezones = template.getTemplatezones();
			for (Templatezone templatezone : templatezones) {
				Pagezone pagezone = new Pagezone();
				pagezone.setPageid(page.getPageid());
				if (page.getHomeflag().equals("0")) {
					pagezone.setHomepageid(page.getHomepageid());
				} else {
					pagezone.setHomepageid(page.getPageid());
				}
				pagezone.setType(templatezone.getType());
				pagezone.setHeight(templatezone.getHeight());
				pagezone.setWidth(templatezone.getWidth());
				pagezone.setTopoffset(templatezone.getTopoffset());
				pagezone.setLeftoffset(templatezone.getLeftoffset());
				pagezone.setZindex(templatezone.getZindex());
				pagezone.setTransform(templatezone.getTransform());
				pagezone.setBdcolor(templatezone.getBdcolor());
				pagezone.setBdstyle(templatezone.getBdstyle());
				pagezone.setBdwidth(templatezone.getBdwidth());
				pagezone.setBdradius(templatezone.getBdradius());
				pagezone.setBgcolor(templatezone.getBgcolor());
				pagezone.setBgopacity(templatezone.getBgopacity());
				pagezone.setOpacity(templatezone.getOpacity());
				pagezone.setPadding(templatezone.getPadding());
				pagezone.setShadowh(templatezone.getShadowh());
				pagezone.setShadowv(templatezone.getShadowv());
				pagezone.setShadowblur(templatezone.getShadowblur());
				pagezone.setShadowcolor(templatezone.getShadowcolor());
				pagezone.setColor(templatezone.getColor());
				pagezone.setFontfamily(templatezone.getFontfamily());
				pagezone.setFontsize(templatezone.getFontsize());
				pagezone.setFontweight(templatezone.getFontweight());
				pagezone.setFontstyle(templatezone.getFontstyle());
				pagezone.setDecoration(templatezone.getDecoration());
				pagezone.setAlign(templatezone.getAlign());
				pagezone.setLineheight(templatezone.getLineheight());
				pagezone.setContent(templatezone.getContent());
				pagezoneMapper.insertSelective(pagezone);
				for (Templatezonedtl templatezonedtl : templatezone.getTemplatezonedtls()) {
					Pagezonedtl pagezonedtl = new Pagezonedtl();
					pagezonedtl.setPagezoneid(pagezone.getPagezoneid());
					pagezonedtl.setObjtype(templatezonedtl.getObjtype());
					pagezonedtl.setObjid(templatezonedtl.getObjid());
					pagezonedtl.setSequence(templatezonedtl.getSequence());
					pagezonedtlMapper.insertSelective(pagezonedtl);
				}
			}

		}
	}

	@Transactional
	public void copyPage(String frompageid, Page page) throws Exception {
		if (page.getName() == null || page.getName().equals("")) {
			page.setName("UNKNOWN");
		}
		Page frompage = pageMapper.selectByPrimaryKey(frompageid);
		if (frompage == null) {
			// Create page from blank
			if (page.getRatio().equals("1")) {
				// 16:9
				page.setWidth(1920);
				page.setHeight(1080);
			} else if (page.getRatio().equals("2")) {
				// 9:16
				page.setWidth(1080);
				page.setHeight(1920);
			}
			pageMapper.insertSelective(page);

			if (page.getName().equals("UNKNOWN")) {
				page.setName("TEMPLET-" + page.getPageid());
			}
			pageMapper.updateByPrimaryKeySelective(page);
		} else {
			// Copy page
			page.setPageid(frompage.getPageid());
			page.setTemplateid(frompage.getTemplateid());
			page.setRatio(frompage.getRatio());
			page.setHeight(frompage.getHeight());
			page.setWidth(frompage.getWidth());
			pageMapper.insertSelective(page);
			if (page.getName().equals("UNKNOWN")) {
				page.setName("TEMPLET-" + page.getPageid());
			}
			if (frompage.getSnapshot() != null) {
				String snapshotFilePath = "/page/" + page.getPageid() + "/snapshot/" + page.getPageid() + ".png";
				File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + frompage.getSnapshot()), snapshotFile);
				page.setSnapshot(snapshotFilePath);
			}
			pageMapper.updateByPrimaryKeySelective(page);

			List<Pagezone> frompagezones = frompage.getPagezones();
			for (Pagezone frompagezone : frompagezones) {
				Pagezone pagezone = new Pagezone();
				pagezone.setPageid(page.getPageid());
				if (page.getHomeflag().equals("0")) {
					pagezone.setHomepageid(page.getHomepageid());
				} else {
					pagezone.setHomepageid(page.getPageid());
				}
				pagezone.setType(frompagezone.getType());
				pagezone.setHeight(frompagezone.getHeight());
				pagezone.setWidth(frompagezone.getWidth());
				pagezone.setTopoffset(frompagezone.getTopoffset());
				pagezone.setLeftoffset(frompagezone.getLeftoffset());
				pagezone.setZindex(frompagezone.getZindex());
				pagezone.setTransform(frompagezone.getTransform());
				pagezone.setBdcolor(frompagezone.getBdcolor());
				pagezone.setBdstyle(frompagezone.getBdstyle());
				pagezone.setBdwidth(frompagezone.getBdwidth());
				pagezone.setBdradius(frompagezone.getBdradius());
				pagezone.setBgcolor(frompagezone.getBgcolor());
				pagezone.setBgopacity(frompagezone.getBgopacity());
				pagezone.setOpacity(frompagezone.getOpacity());
				pagezone.setPadding(frompagezone.getPadding());
				pagezone.setShadowh(frompagezone.getShadowh());
				pagezone.setShadowv(frompagezone.getShadowv());
				pagezone.setShadowblur(frompagezone.getShadowblur());
				pagezone.setShadowcolor(frompagezone.getShadowcolor());
				pagezone.setColor(frompagezone.getColor());
				pagezone.setFontfamily(frompagezone.getFontfamily());
				pagezone.setFontsize(frompagezone.getFontsize());
				pagezone.setFontweight(frompagezone.getFontweight());
				pagezone.setFontstyle(frompagezone.getFontstyle());
				pagezone.setDecoration(frompagezone.getDecoration());
				pagezone.setAlign(frompagezone.getAlign());
				pagezone.setLineheight(frompagezone.getLineheight());
				pagezone.setContent(frompagezone.getContent());
				pagezoneMapper.insertSelective(pagezone);
				for (Pagezonedtl frompagezonedtl : frompagezone.getPagezonedtls()) {
					Pagezonedtl pagezonedtl = new Pagezonedtl();
					pagezonedtl.setPagezoneid(pagezone.getPagezoneid());
					pagezonedtl.setObjtype(frompagezonedtl.getObjtype());
					pagezonedtl.setObjid(frompagezonedtl.getObjid());
					pagezonedtl.setSequence(frompagezonedtl.getSequence());
					pagezonedtlMapper.insertSelective(pagezonedtl);
				}
			}
		}
	}

	@Transactional
	public void updatePage(Page page) {
		page.setUpdatetime(Calendar.getInstance().getTime());
		pageMapper.updateByPrimaryKeySelective(page);
	}

	@Transactional
	public void deletePage(String pageid) {
		pageMapper.deleteByPrimaryKey(pageid);
	}

	@Transactional
	public void design(Page page) throws Exception {
		if (page.getName() == null || page.getName().equals("")) {
			page.setName("UNKNOWN");
		}

		pageMapper.updateByPrimaryKeySelective(page);
		int pageid = page.getPageid();
		List<Pagezone> pagezones = page.getPagezones();
		List<Pagezone> oldpagezones = pagezoneMapper.selectList("" + pageid);
		HashMap<Integer, Pagezone> hash = new HashMap<Integer, Pagezone>();
		for (Pagezone pagezone : pagezones) {
			if (pagezone.getPagezoneid() > 0) {
				hash.put(pagezone.getPagezoneid(), pagezone);
			}
		}
		for (int i = 0; i < oldpagezones.size(); i++) {
			Pagezone oldPagezone = oldpagezones.get(i);
			if (hash.get(oldPagezone.getPagezoneid()) == null) {
				pagezonedtlMapper.deleteByPagezone("" + oldpagezones.get(i).getPagezoneid());
				pagezoneMapper.deleteByPrimaryKey("" + oldpagezones.get(i).getPagezoneid());
			}
		}
		for (Pagezone pagezone : pagezones) {
			if (page.getHomeflag().equals("0")) {
				pagezone.setHomepageid(page.getHomepageid());
			} else {
				pagezone.setHomepageid(page.getPageid());
			}
			if (pagezone.getPagezoneid() <= 0) {
				pagezone.setPageid(pageid);
				pagezoneMapper.insertSelective(pagezone);
			} else {
				pagezoneMapper.updateByPrimaryKeySelective(pagezone);
				pagezonedtlMapper.deleteByPagezone("" + pagezone.getPagezoneid());
			}
			for (Pagezonedtl pagezonedtl : pagezone.getPagezonedtls()) {
				pagezonedtl.setPagezoneid(pagezone.getPagezoneid());
				pagezonedtlMapper.insertSelective(pagezonedtl);
			}
		}

		String snapshotdtl = page.getSnapshotdtl();
		if (snapshotdtl.startsWith("data:image/png;base64,")) {
			snapshotdtl = snapshotdtl.substring(22);
		}
		String snapshotFilePath = "/page/" + page.getPageid() + "/snapshot/" + page.getPageid() + ".png";
		File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
		page.setSnapshot(snapshotFilePath);
		page.setUpdatetime(Calendar.getInstance().getTime());
		pageMapper.updateByPrimaryKeySelective(page);
	}

	@Transactional
	public void push(Page page, Device[] devices, Devicegroup[] devicegroups) throws Exception {
		// Handle device schedule
		for (int i = 0; i < devices.length; i++) {
			Device device = devices[i];

			scheduledtlMapper.deleteByDtl(Schedule.ScheduleType_Solo, Schedule.BindType_Device,
					"" + device.getDeviceid(), null, null);
			scheduleMapper.deleteByDtl(Schedule.ScheduleType_Solo, Schedule.BindType_Device, "" + device.getDeviceid(),
					null, null);
			Schedule schedule = new Schedule();
			schedule.setScheduletype(Schedule.ScheduleType_Solo);
			schedule.setBindtype(Schedule.BindType_Device);
			schedule.setBindid(device.getDeviceid());
			schedule.setPlaymode(Schedule.PlayMode_Daily);
			schedule.setStarttime(CommonUtil.parseDate("00:00:00", CommonConstants.DateFormat_Time));
			scheduleMapper.insertSelective(schedule);

			Scheduledtl scheduledtl = new Scheduledtl();
			scheduledtl.setScheduleid(schedule.getScheduleid());
			scheduledtl.setObjtype(Scheduledtl.ObjType_Page);
			scheduledtl.setObjid(page.getPageid());
			scheduledtl.setSequence(1);
			scheduledtlMapper.insertSelective(scheduledtl);
		}

		// Handle devicegroup schedule
		for (int i = 0; i < devicegroups.length; i++) {
			Devicegroup devicegroup = devicegroups[i];

			scheduledtlMapper.deleteByDtl(Schedule.ScheduleType_Solo, Schedule.BindType_Devicegroup,
					"" + devicegroup.getDevicegroupid(), null, null);
			scheduleMapper.deleteByDtl(Schedule.ScheduleType_Solo, Schedule.BindType_Devicegroup,
					"" + devicegroup.getDevicegroupid(), null, null);
			Schedule schedule = new Schedule();
			schedule.setScheduletype(Schedule.ScheduleType_Solo);
			schedule.setBindtype(Schedule.BindType_Devicegroup);
			schedule.setBindid(devicegroup.getDevicegroupid());
			schedule.setPlaymode(Schedule.PlayMode_Daily);
			schedule.setStarttime(CommonUtil.parseDate("00:00:00", CommonConstants.DateFormat_Time));
			scheduleMapper.insertSelective(schedule);

			Scheduledtl scheduledtl = new Scheduledtl();
			scheduledtl.setScheduleid(schedule.getScheduleid());
			scheduledtl.setObjtype(Scheduledtl.ObjType_Page);
			scheduledtl.setObjid(page.getPageid());
			scheduledtl.setSequence(1);
			scheduledtlMapper.insertSelective(scheduledtl);
		}

		// Handle sync
		for (int i = 0; i < devices.length; i++) {
			scheduleService.syncSchedule("1", "" + devices[i].getDeviceid());
		}
		for (int i = 0; i < devicegroups.length; i++) {
			scheduleService.syncSchedule("2", "" + devicegroups[i].getDevicegroupid());
		}
	}

	private JSONObject generatePageJson(String pageid) {
		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		Page page = pageMapper.selectByPrimaryKey(pageid);
		HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();

		JSONObject responseJson = new JSONObject();
		responseJson.put("page_id", page.getPageid());
		responseJson.put("name", page.getName());
		responseJson.put("thumbnail", "http://" + serverip + ":" + serverport + "/pixsigdata" + page.getSnapshot());

		JSONArray videoJsonArray = new JSONArray();
		responseJson.put("videos", videoJsonArray);

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
						if (video.getRelate() != null) {
							videoJson.put("relate_id", video.getRelateid());
						} else {
							videoJson.put("relate_id", 0);
						}
						videoHash.put(video.getVideoid(), videoJson);
						videoJsonArray.put(videoJson);
					}
				}
			}
		}

		String zipPath = "/page/" + page.getPageid() + "/page-" + page.getPageid() + ".zip";
		File zipFile = new File("/pixdata/pixsignage" + zipPath);
		if (zipFile.exists()) {
			responseJson.put("url", "http://" + serverip + ":" + serverport + "/pixsigdata" + zipPath);
			responseJson.put("file", zipFile.getName());
			responseJson.put("size", FileUtils.sizeOf(zipFile));
		}

		String checksum = DigestUtils.md5Hex(responseJson.toString());
		responseJson.put("checksum", checksum);

		return responseJson;
	}

	public JSONArray generatePageJsonArray(List<Integer> pageids) {
		HashMap<Integer, JSONObject> pageHash = new HashMap<Integer, JSONObject>();
		JSONArray pageJSONArray = new JSONArray();
		for (Integer pageid : pageids) {
			if (pageHash.get(pageid) == null) {
				JSONObject pageJson = generatePageJson("" + pageid);
				pageJSONArray.put(pageJson);
				pageHash.put(pageid, pageJson);
			}
		}
		return pageJSONArray;
	}
}
