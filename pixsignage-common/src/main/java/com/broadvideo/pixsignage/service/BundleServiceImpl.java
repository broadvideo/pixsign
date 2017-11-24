package com.broadvideo.pixsignage.service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Audio;
import com.broadvideo.pixsignage.domain.Bundle;
import com.broadvideo.pixsignage.domain.Bundledtl;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Dvb;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Medialist;
import com.broadvideo.pixsignage.domain.Medialistdtl;
import com.broadvideo.pixsignage.domain.Rss;
import com.broadvideo.pixsignage.domain.Schedule;
import com.broadvideo.pixsignage.domain.Scheduledtl;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.domain.Stream;
import com.broadvideo.pixsignage.domain.Templet;
import com.broadvideo.pixsignage.domain.Templetdtl;
import com.broadvideo.pixsignage.domain.Text;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.domain.Widget;
import com.broadvideo.pixsignage.persistence.BundleMapper;
import com.broadvideo.pixsignage.persistence.BundledtlMapper;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.MedialistMapper;
import com.broadvideo.pixsignage.persistence.MedialistdtlMapper;
import com.broadvideo.pixsignage.persistence.RssMapper;
import com.broadvideo.pixsignage.persistence.ScheduleMapper;
import com.broadvideo.pixsignage.persistence.ScheduledtlMapper;
import com.broadvideo.pixsignage.persistence.StreamMapper;
import com.broadvideo.pixsignage.persistence.TempletMapper;
import com.broadvideo.pixsignage.persistence.TextMapper;
import com.broadvideo.pixsignage.persistence.WidgetMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

@Service("bundleService")
public class BundleServiceImpl implements BundleService {

	@Autowired
	private BundleMapper bundleMapper;
	@Autowired
	private BundledtlMapper bundledtlMapper;
	@Autowired
	private TempletMapper templetMapper;
	@Autowired
	private ScheduleMapper scheduleMapper;
	@Autowired
	private ScheduledtlMapper scheduledtlMapper;
	@Autowired
	private MedialistMapper medialistMapper;
	@Autowired
	private MedialistdtlMapper medialistdtlMapper;
	@Autowired
	private TextMapper textMapper;
	@Autowired
	private StreamMapper streamMapper;
	@Autowired
	private WidgetMapper widgetMapper;
	@Autowired
	private RssMapper rssMapper;
	@Autowired
	private ConfigMapper configMapper;

	@Autowired
	private MedialistService medialistService;
	@Autowired
	private TextService textService;
	@Autowired
	private StreamService streamService;
	@Autowired
	private WidgetService widgetService;
	@Autowired
	private RssService rssService;
	@Autowired
	private DevicefileService devicefileService;
	@Autowired
	private ScheduleService scheduleService;

	public Bundle selectByPrimaryKey(String bundleid) {
		return bundleMapper.selectByPrimaryKey(bundleid);
	}

	public int selectCount(String orgid, String branchid, String reviewflag, String touchflag, String homeflag,
			String search) {
		return bundleMapper.selectCount(orgid, branchid, reviewflag, touchflag, homeflag, search);
	}

	public List<Bundle> selectList(String orgid, String branchid, String reviewflag, String touchflag, String homeflag,
			String search, String start, String length) {
		return bundleMapper.selectList(orgid, branchid, reviewflag, touchflag, homeflag, search, start, length);
	}

	@Transactional
	public void addBundle(Bundle bundle) throws Exception {
		if (bundle.getName() == null || bundle.getName().equals("")) {
			bundle.setName("UNKNOWN");
		}
		Templet templet = templetMapper.selectByPrimaryKey("" + bundle.getTempletid());
		if (templet == null) {
			// Create bundle from blank
			if (bundle.getRatio().equals("1")) {
				// 16:9
				bundle.setWidth(1920);
				bundle.setHeight(1080);
			} else if (bundle.getRatio().equals("2")) {
				// 9:16
				bundle.setWidth(1080);
				bundle.setHeight(1920);
			} else if (bundle.getRatio().equals("3")) {
				// 4:3
				bundle.setWidth(1920);
				bundle.setHeight(1440);
			} else if (bundle.getRatio().equals("4")) {
				// 3:4
				bundle.setWidth(1440);
				bundle.setHeight(1920);
			} else if (bundle.getRatio().equals("5")) {
				// 16:3
				bundle.setWidth(1920);
				bundle.setHeight(360);
			} else if (bundle.getRatio().equals("6")) {
				// 3:16
				bundle.setWidth(360);
				bundle.setHeight(1920);
			}
			bundleMapper.insertSelective(bundle);

			if (bundle.getName().equals("UNKNOWN")) {
				bundle.setName("BUNDLE-" + bundle.getBundleid());
			}
			bundleMapper.updateByPrimaryKeySelective(bundle);

			Bundledtl bundledtl = new Bundledtl();
			bundledtl.setBundleid(bundle.getBundleid());
			bundledtl.setType(Bundledtl.Type_PLAY);
			bundledtl.setMainflag("1");
			if (bundle.getHomeflag().equals("0")) {
				bundledtl.setHomebundleid(bundle.getHomebundleid());
			} else {
				bundledtl.setHomebundleid(bundle.getBundleid());
			}
			bundledtl.setWidth((int) (bundle.getWidth() / 2));
			bundledtl.setHeight((int) (bundle.getHeight() / 2));
			bundledtl.setTopoffset((int) (bundle.getHeight() / 4));
			bundledtl.setLeftoffset((int) (bundle.getWidth() / 4));
			bundledtl.setBgcolor("#FFFFFF");
			bundledtl.setOpacity(0);
			bundledtl.setZindex(0);
			bundledtl.setSleeptime(0);
			bundledtl.setIntervaltime(10);
			bundledtl.setDirection("4");
			bundledtl.setSpeed("2");
			bundledtl.setColor("#FFFFFF");
			bundledtl.setSize(50);
			bundledtl.setObjtype(Bundledtl.ObjType_NONE);
			bundledtl.setObjid(0);
			bundledtlMapper.insertSelective(bundledtl);

			Medialist medialist = new Medialist();
			medialist.setOrgid(bundle.getOrgid());
			medialist.setBranchid(0);
			medialist.setName(bundle.getName() + "-" + bundledtl.getBundledtlid());
			medialist.setType(Medialist.Type_Private);
			medialist.setCreatestaffid(bundle.getCreatestaffid());
			medialistMapper.insertSelective(medialist);
			bundledtl.setObjtype(Bundledtl.ObjType_Medialist);
			bundledtl.setObjid(medialist.getMedialistid());
			bundledtlMapper.updateByPrimaryKeySelective(bundledtl);
		} else {
			// Create bundle from templet
			Hashtable<Integer, Integer> bundleidHash = new Hashtable<Integer, Integer>();
			ArrayList<Templet> templetList = new ArrayList<Templet>();

			bundle.setTempletid(templet.getTempletid());
			bundle.setRatio(templet.getRatio());
			bundle.setHeight(templet.getHeight());
			bundle.setWidth(templet.getWidth());
			bundle.setBgcolor(templet.getBgcolor());
			bundle.setBgimageid(templet.getBgimageid());
			bundle.setHomeidletime(templet.getHomeidletime());
			bundleMapper.insertSelective(bundle);
			if (bundle.getName().equals("UNKNOWN")) {
				bundle.setName("BUNDLE-" + bundle.getBundleid());
			}
			if (templet.getSnapshot() != null) {
				String snapshotFilePath = "/bundle/" + bundle.getBundleid() + "/snapshot/" + bundle.getBundleid()
						+ ".png";
				File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + templet.getSnapshot()), snapshotFile);
				bundle.setSnapshot(snapshotFilePath);
			}
			bundleMapper.updateByPrimaryKeySelective(bundle);
			bundleidHash.put(templet.getTempletid(), bundle.getBundleid());
			templetList.add(templet);

			List<Templet> subtemplets = templet.getSubtemplets();
			for (Templet s : subtemplets) {
				Templet subtemplet = templetMapper.selectByPrimaryKey("" + s.getTempletid());
				Bundle subbundle = new Bundle();
				subbundle.setOrgid(bundle.getOrgid());
				subbundle.setBranchid(bundle.getBranchid());
				subbundle.setTempletid(subtemplet.getTempletid());
				subbundle.setName(subtemplet.getName());
				subbundle.setRatio(subtemplet.getRatio());
				subbundle.setHeight(subtemplet.getHeight());
				subbundle.setWidth(subtemplet.getWidth());
				subbundle.setBgcolor(subtemplet.getBgcolor());
				subbundle.setBgimageid(subtemplet.getBgimageid());
				subbundle.setTouchflag(subtemplet.getTouchflag());
				subbundle.setHomeflag(subtemplet.getHomeflag());
				subbundle.setHomebundleid(bundle.getBundleid());
				subbundle.setHomeidletime(subtemplet.getHomeidletime());
				bundleMapper.insertSelective(subbundle);
				bundleidHash.put(subtemplet.getTempletid(), subbundle.getBundleid());
				templetList.add(subtemplet);
				if (subtemplet.getSnapshot() != null) {
					String snapshotFilePath = "/bundle/" + subbundle.getBundleid() + "/snapshot/"
							+ subbundle.getBundleid() + ".png";
					File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
					FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + subtemplet.getSnapshot()),
							snapshotFile);
					subbundle.setSnapshot(snapshotFilePath);
					bundleMapper.updateByPrimaryKeySelective(subbundle);
				}
			}

			for (Templet t : templetList) {
				List<Templetdtl> templetdtls = t.getTempletdtls();
				for (Templetdtl templetdtl : templetdtls) {
					Bundledtl bundledtl = new Bundledtl();
					bundledtl.setBundleid(bundleidHash.get(t.getTempletid()));
					if (bundle.getHomeflag().equals("0")) {
						bundledtl.setHomebundleid(bundle.getHomebundleid());
					} else {
						bundledtl.setHomebundleid(bundle.getBundleid());
					}
					bundledtl.setTempletdtlid(templetdtl.getTempletdtlid());
					bundledtl.setType(templetdtl.getType());
					bundledtl.setMainflag(templetdtl.getMainflag());
					bundledtl.setHeight(templetdtl.getHeight());
					bundledtl.setWidth(templetdtl.getWidth());
					bundledtl.setTopoffset(templetdtl.getTopoffset());
					bundledtl.setLeftoffset(templetdtl.getLeftoffset());
					bundledtl.setZindex(templetdtl.getZindex());
					bundledtl.setBgcolor(templetdtl.getBgcolor());
					bundledtl.setOpacity(templetdtl.getOpacity());
					bundledtl.setBgimageid(templetdtl.getBgimageid());
					bundledtl.setSleeptime(templetdtl.getSleeptime());
					bundledtl.setIntervaltime(templetdtl.getIntervaltime());
					bundledtl.setAnimation(templetdtl.getAnimation());
					bundledtl.setDirection(templetdtl.getDirection());
					bundledtl.setSpeed(templetdtl.getSpeed());
					bundledtl.setColor(templetdtl.getColor());
					bundledtl.setSize(templetdtl.getSize());
					bundledtl.setDateformat(templetdtl.getDateformat());
					bundledtl.setFitflag(templetdtl.getFitflag());
					bundledtl.setVolume(templetdtl.getVolume());
					bundledtl.setReferflag(Bundledtl.ReferFlag_Private);
					bundledtl.setObjtype(templetdtl.getObjtype());
					bundledtl.setTouchlabel(templetdtl.getTouchlabel());
					bundledtl.setTouchtype(templetdtl.getTouchtype());
					Integer touchbundleid = bundleidHash.get(templetdtl.getTouchtempletid());
					if (touchbundleid == null) {
						touchbundleid = 0;
					}
					bundledtl.setTouchbundleid(touchbundleid);
					bundledtl.setTouchapk(templetdtl.getTouchapk());

					if (templetdtl.getObjtype().equals(Templetdtl.ObjType_Medialist)) {
						Medialist temp = medialistMapper.selectByPrimaryKey("" + templetdtl.getObjid());
						Medialist medialist = new Medialist();
						medialist.setOrgid(bundle.getOrgid());
						medialist.setBranchid(bundle.getBranchid());
						medialist.setName(bundle.getName() + "-" + templetdtl.getTempletdtlid());
						medialist.setType(Medialist.Type_Private);
						medialist.setCreatestaffid(bundle.getCreatestaffid());
						medialistMapper.insertSelective(medialist);
						for (Medialistdtl md : temp.getMedialistdtls()) {
							Medialistdtl medialistdtl = new Medialistdtl();
							medialistdtl.setMedialistid(medialist.getMedialistid());
							medialistdtl.setObjtype(md.getObjtype());
							medialistdtl.setObjid(md.getObjid());
							medialistdtl.setSequence(md.getSequence());
							medialistdtlMapper.insertSelective(medialistdtl);
						}
						bundledtl.setObjid(medialist.getMedialistid());
					} else if (templetdtl.getObjtype().equals(Templetdtl.ObjType_Text)) {
						Text temp = textMapper.selectByPrimaryKey("" + templetdtl.getObjid());
						Text text = new Text();
						text.setOrgid(bundle.getOrgid());
						text.setBranchid(bundle.getBranchid());
						text.setName(bundle.getName() + "-" + templetdtl.getTempletdtlid());
						text.setType(Text.Type_Private);
						text.setCreatestaffid(bundle.getCreatestaffid());
						text.setText(temp.getText());
						textMapper.insertSelective(text);
						bundledtl.setObjid(text.getTextid());
					} else if (templetdtl.getObjtype().equals(Templetdtl.ObjType_Widget)) {
						Widget temp = widgetMapper.selectByPrimaryKey("" + templetdtl.getObjid());
						Widget widget = new Widget();
						widget.setOrgid(bundle.getOrgid());
						widget.setBranchid(bundle.getBranchid());
						widget.setName(bundle.getName() + "-" + templetdtl.getTempletdtlid());
						widget.setType(Widget.Type_Private);
						widget.setCreatestaffid(bundle.getCreatestaffid());
						widget.setUrl(temp.getUrl());
						widgetMapper.insertSelective(widget);
						bundledtl.setObjid(widget.getWidgetid());
					} else if (templetdtl.getObjtype().equals(Templetdtl.ObjType_Rss)) {
						Rss temp = rssMapper.selectByPrimaryKey("" + templetdtl.getObjid());
						Rss rss = new Rss();
						rss.setOrgid(bundle.getOrgid());
						rss.setBranchid(bundle.getBranchid());
						rss.setName(bundle.getName() + "-" + templetdtl.getTempletdtlid());
						rss.setType(Rss.Type_Private);
						rss.setCreatestaffid(bundle.getCreatestaffid());
						rss.setUrl(temp.getUrl());
						rssMapper.insertSelective(rss);
						bundledtl.setObjid(rss.getRssid());
					} else {
						bundledtl.setObjid(templetdtl.getObjid());
					}
					bundledtlMapper.insertSelective(bundledtl);
				}
			}

		}
	}

	@Transactional
	public void copyBundle(String frombundleid, Bundle bundle) throws Exception {
		if (bundle.getName() == null || bundle.getName().equals("")) {
			bundle.setName("UNKNOWN");
		}
		Bundle frombundle = bundleMapper.selectByPrimaryKey(frombundleid);
		if (frombundle == null) {
			// Create bundle from blank
			if (bundle.getRatio().equals("1")) {
				// 16:9
				bundle.setWidth(1920);
				bundle.setHeight(1080);
			} else if (bundle.getRatio().equals("2")) {
				// 9:16
				bundle.setWidth(1080);
				bundle.setHeight(1920);
			} else if (bundle.getRatio().equals("3")) {
				// 4:3
				bundle.setWidth(1920);
				bundle.setHeight(1440);
			} else if (bundle.getRatio().equals("4")) {
				// 3:4
				bundle.setWidth(1440);
				bundle.setHeight(1920);
			} else if (bundle.getRatio().equals("5")) {
				// 16:3
				bundle.setWidth(1920);
				bundle.setHeight(360);
			} else if (bundle.getRatio().equals("6")) {
				// 3:16
				bundle.setWidth(360);
				bundle.setHeight(1920);
			}
			bundleMapper.insertSelective(bundle);

			if (bundle.getName().equals("UNKNOWN")) {
				bundle.setName("BUNDLE-" + bundle.getBundleid());
			}
			bundleMapper.updateByPrimaryKeySelective(bundle);

			Bundledtl bundledtl = new Bundledtl();
			bundledtl.setBundleid(bundle.getBundleid());
			bundledtl.setType(Bundledtl.Type_PLAY);
			bundledtl.setMainflag("1");
			if (bundle.getHomeflag().equals("0")) {
				bundledtl.setHomebundleid(bundle.getHomebundleid());
			} else {
				bundledtl.setHomebundleid(bundle.getBundleid());
			}
			bundledtl.setWidth((int) (bundle.getWidth() / 2));
			bundledtl.setHeight((int) (bundle.getHeight() / 2));
			bundledtl.setTopoffset((int) (bundle.getHeight() / 4));
			bundledtl.setLeftoffset((int) (bundle.getWidth() / 4));
			bundledtl.setBgcolor("#000000");
			if (bundledtl.getBgimageid() != null && bundledtl.getBgimageid() > 0) {
				bundledtl.setOpacity(0);
			} else {
				bundledtl.setOpacity(255);
			}
			bundledtl.setZindex(0);
			bundledtl.setSleeptime(0);
			bundledtl.setIntervaltime(10);
			bundledtl.setDirection("4");
			bundledtl.setSpeed("2");
			bundledtl.setColor("#FFFFFF");
			bundledtl.setSize(50);
			bundledtl.setObjtype(Bundledtl.ObjType_NONE);
			bundledtl.setObjid(0);
			bundledtlMapper.insertSelective(bundledtl);

			Medialist medialist = new Medialist();
			medialist.setOrgid(bundle.getOrgid());
			medialist.setBranchid(0);
			medialist.setName(bundle.getName() + "-" + bundledtl.getBundledtlid());
			medialist.setType(Medialist.Type_Private);
			medialist.setCreatestaffid(bundle.getCreatestaffid());
			medialistMapper.insertSelective(medialist);
			bundledtl.setObjtype(Bundledtl.ObjType_Medialist);
			bundledtl.setObjid(medialist.getMedialistid());
			bundledtlMapper.updateByPrimaryKeySelective(bundledtl);
		} else {
			// Copy bundle
			Hashtable<Integer, Integer> bundleidHash = new Hashtable<Integer, Integer>();
			ArrayList<Bundle> frombundleList = new ArrayList<Bundle>();

			bundle.setTempletid(frombundle.getTempletid());
			bundle.setRatio(frombundle.getRatio());
			bundle.setHeight(frombundle.getHeight());
			bundle.setWidth(frombundle.getWidth());
			bundle.setBgcolor(frombundle.getBgcolor());
			bundle.setBgimageid(frombundle.getBgimageid());
			bundle.setHomeidletime(frombundle.getHomeidletime());
			bundleMapper.insertSelective(bundle);
			if (bundle.getName().equals("UNKNOWN")) {
				bundle.setName("BUNDLE-" + bundle.getBundleid());
			}
			if (frombundle.getSnapshot() != null) {
				String snapshotFilePath = "/bundle/" + bundle.getBundleid() + "/snapshot/" + bundle.getBundleid()
						+ ".png";
				File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + frombundle.getSnapshot()), snapshotFile);
				bundle.setSnapshot(snapshotFilePath);
			}
			bundleMapper.updateByPrimaryKeySelective(bundle);
			bundleidHash.put(frombundle.getTempletid(), bundle.getBundleid());
			frombundleList.add(frombundle);

			List<Bundle> fromsubbundles = frombundle.getSubbundles();
			for (Bundle s : fromsubbundles) {
				Bundle fromsubbundle = bundleMapper.selectByPrimaryKey("" + s.getBundleid());
				Bundle subbundle = new Bundle();
				subbundle.setOrgid(bundle.getOrgid());
				subbundle.setBranchid(bundle.getBranchid());
				subbundle.setTempletid(fromsubbundle.getTempletid());
				subbundle.setName(fromsubbundle.getName());
				subbundle.setRatio(fromsubbundle.getRatio());
				subbundle.setHeight(fromsubbundle.getHeight());
				subbundle.setWidth(fromsubbundle.getWidth());
				subbundle.setBgcolor(fromsubbundle.getBgcolor());
				subbundle.setBgimageid(fromsubbundle.getBgimageid());
				subbundle.setTouchflag(fromsubbundle.getTouchflag());
				subbundle.setHomeflag(fromsubbundle.getHomeflag());
				subbundle.setHomebundleid(bundle.getBundleid());
				subbundle.setHomeidletime(fromsubbundle.getHomeidletime());
				bundleMapper.insertSelective(subbundle);
				bundleidHash.put(fromsubbundle.getTempletid(), subbundle.getBundleid());
				frombundleList.add(fromsubbundle);
				if (fromsubbundle.getSnapshot() != null) {
					String snapshotFilePath = "/bundle/" + subbundle.getBundleid() + "/snapshot/"
							+ subbundle.getBundleid() + ".png";
					File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
					FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + fromsubbundle.getSnapshot()),
							snapshotFile);
					subbundle.setSnapshot(snapshotFilePath);
					bundleMapper.updateByPrimaryKeySelective(subbundle);
				}
			}

			for (Bundle t : frombundleList) {
				List<Bundledtl> frombundledtls = t.getBundledtls();
				for (Bundledtl frombundledtl : frombundledtls) {
					Bundledtl bundledtl = new Bundledtl();
					bundledtl.setBundleid(bundleidHash.get(t.getTempletid()));
					if (bundle.getHomeflag().equals("0")) {
						bundledtl.setHomebundleid(bundle.getHomebundleid());
					} else {
						bundledtl.setHomebundleid(bundle.getBundleid());
					}
					bundledtl.setTempletdtlid(frombundledtl.getTempletdtlid());
					bundledtl.setType(frombundledtl.getType());
					bundledtl.setMainflag(frombundledtl.getMainflag());
					bundledtl.setHeight(frombundledtl.getHeight());
					bundledtl.setWidth(frombundledtl.getWidth());
					bundledtl.setTopoffset(frombundledtl.getTopoffset());
					bundledtl.setLeftoffset(frombundledtl.getLeftoffset());
					bundledtl.setZindex(frombundledtl.getZindex());
					bundledtl.setBgcolor(frombundledtl.getBgcolor());
					bundledtl.setOpacity(frombundledtl.getOpacity());
					bundledtl.setBgimageid(frombundledtl.getBgimageid());
					bundledtl.setSleeptime(frombundledtl.getSleeptime());
					bundledtl.setIntervaltime(frombundledtl.getIntervaltime());
					bundledtl.setAnimation(frombundledtl.getAnimation());
					bundledtl.setDirection(frombundledtl.getDirection());
					bundledtl.setSpeed(frombundledtl.getSpeed());
					bundledtl.setColor(frombundledtl.getColor());
					bundledtl.setSize(frombundledtl.getSize());
					bundledtl.setDateformat(frombundledtl.getDateformat());
					bundledtl.setFitflag(frombundledtl.getFitflag());
					bundledtl.setVolume(frombundledtl.getVolume());
					bundledtl.setReferflag(Bundledtl.ReferFlag_Private);
					bundledtl.setObjtype(frombundledtl.getObjtype());
					bundledtl.setTouchlabel(frombundledtl.getTouchlabel());
					bundledtl.setTouchtype(frombundledtl.getTouchtype());
					Integer touchbundleid = bundleidHash.get(frombundledtl.getTouchbundleid());
					if (touchbundleid == null) {
						touchbundleid = 0;
					}
					bundledtl.setTouchbundleid(touchbundleid);
					bundledtl.setTouchapk(frombundledtl.getTouchapk());

					if (frombundledtl.getObjtype().equals(Templetdtl.ObjType_Medialist)) {
						Medialist temp = medialistMapper.selectByPrimaryKey("" + frombundledtl.getObjid());
						Medialist medialist = new Medialist();
						medialist.setOrgid(bundle.getOrgid());
						medialist.setBranchid(bundle.getBranchid());
						medialist.setName(bundle.getName() + "-" + frombundledtl.getTempletdtlid());
						medialist.setType(Medialist.Type_Private);
						medialist.setCreatestaffid(bundle.getCreatestaffid());
						medialistMapper.insertSelective(medialist);
						for (Medialistdtl md : temp.getMedialistdtls()) {
							Medialistdtl medialistdtl = new Medialistdtl();
							medialistdtl.setMedialistid(medialist.getMedialistid());
							medialistdtl.setObjtype(md.getObjtype());
							medialistdtl.setObjid(md.getObjid());
							medialistdtl.setSequence(md.getSequence());
							medialistdtlMapper.insertSelective(medialistdtl);
						}
						bundledtl.setObjid(medialist.getMedialistid());
					} else if (frombundledtl.getObjtype().equals(Templetdtl.ObjType_Text)) {
						Text temp = textMapper.selectByPrimaryKey("" + frombundledtl.getObjid());
						Text text = new Text();
						text.setOrgid(bundle.getOrgid());
						text.setBranchid(bundle.getBranchid());
						text.setName(bundle.getName() + "-" + frombundledtl.getTempletdtlid());
						text.setType(Text.Type_Private);
						text.setCreatestaffid(bundle.getCreatestaffid());
						text.setText(temp.getText());
						textMapper.insertSelective(text);
						bundledtl.setObjid(text.getTextid());
					} else if (frombundledtl.getObjtype().equals(Templetdtl.ObjType_Widget)) {
						Widget temp = widgetMapper.selectByPrimaryKey("" + frombundledtl.getObjid());
						Widget widget = new Widget();
						widget.setOrgid(bundle.getOrgid());
						widget.setBranchid(bundle.getBranchid());
						widget.setName(bundle.getName() + "-" + frombundledtl.getTempletdtlid());
						widget.setType(Widget.Type_Private);
						widget.setCreatestaffid(bundle.getCreatestaffid());
						widget.setUrl(temp.getUrl());
						widgetMapper.insertSelective(widget);
						bundledtl.setObjid(widget.getWidgetid());
					} else if (frombundledtl.getObjtype().equals(Templetdtl.ObjType_Rss)) {
						Rss temp = rssMapper.selectByPrimaryKey("" + frombundledtl.getObjid());
						Rss rss = new Rss();
						rss.setOrgid(bundle.getOrgid());
						rss.setBranchid(bundle.getBranchid());
						rss.setName(bundle.getName() + "-" + frombundledtl.getTempletdtlid());
						rss.setType(Rss.Type_Private);
						rss.setCreatestaffid(bundle.getCreatestaffid());
						rss.setUrl(temp.getUrl());
						rssMapper.insertSelective(rss);
						bundledtl.setObjid(rss.getRssid());
					} else {
						bundledtl.setObjid(frombundledtl.getObjid());
					}
					bundledtlMapper.insertSelective(bundledtl);
				}
			}

		}
	}

	@Transactional
	public void updateBundle(Bundle bundle) {
		bundleMapper.updateByPrimaryKeySelective(bundle);
	}

	@Transactional
	public void deleteBundle(String bundleid) {
		bundleMapper.deleteByPrimaryKey(bundleid);
	}

	@Transactional
	public void design(Bundle bundle) throws Exception {
		if (bundle.getName() == null || bundle.getName().equals("")) {
			bundle.setName("UNKNOWN");
		}

		bundleMapper.updateByPrimaryKeySelective(bundle);
		int bundleid = bundle.getBundleid();
		List<Bundledtl> bundledtls = bundle.getBundledtls();
		List<Bundledtl> oldbundledtls = bundledtlMapper.selectList("" + bundleid);
		HashMap<Integer, Bundledtl> hash = new HashMap<Integer, Bundledtl>();
		for (Bundledtl bundledtl : bundledtls) {
			if (bundledtl.getBundledtlid() <= 0) {
				bundledtl.setBundleid(bundleid);
				bundledtlMapper.insertSelective(bundledtl);
			} else {
				hash.put(bundledtl.getBundledtlid(), bundledtl);
			}
		}
		for (int i = 0; i < oldbundledtls.size(); i++) {
			Bundledtl oldBundledtl = oldbundledtls.get(i);
			if (hash.get(oldBundledtl.getBundledtlid()) == null) {
				// Remove old private records
				if (oldBundledtl.getObjtype().equals(Bundledtl.ObjType_Medialist)) {
					medialistService.deleteMedialist("" + oldBundledtl.getObjid());
				} else if (oldBundledtl.getObjtype().equals(Bundledtl.ObjType_Text)) {
					textService.deleteText("" + oldBundledtl.getObjid());
				} else if (oldBundledtl.getObjtype().equals(Bundledtl.ObjType_Stream)) {
					streamService.deleteStream("" + oldBundledtl.getObjid());
				} else if (oldBundledtl.getObjtype().equals(Bundledtl.ObjType_Widget)) {
					widgetService.deleteWidget("" + oldBundledtl.getObjid());
				} else if (oldBundledtl.getObjtype().equals(Bundledtl.ObjType_Rss)) {
					rssService.deleteRss("" + oldBundledtl.getObjid());
				}
				bundledtlMapper.deleteByPrimaryKey("" + oldbundledtls.get(i).getBundledtlid());
			}
		}

		for (Bundledtl bundledtl : bundledtls) {
			if (bundle.getHomeflag().equals("0")) {
				bundledtl.setHomebundleid(bundle.getHomebundleid());
			} else {
				bundledtl.setHomebundleid(bundle.getBundleid());
			}
			Bundledtl oldBundledtl = bundledtlMapper.selectByPrimaryKey("" + bundledtl.getBundledtlid());
			if (oldBundledtl.getReferflag().equals(Bundledtl.ReferFlag_Private)
					&& (!oldBundledtl.getObjtype().equals(bundledtl.getObjtype())
							|| oldBundledtl.getObjid().intValue() != bundledtl.getObjid().intValue())) {
				// Remove old private records
				if (oldBundledtl.getObjtype().equals(Bundledtl.ObjType_Medialist)) {
					medialistService.deleteMedialist("" + oldBundledtl.getObjid());
				} else if (oldBundledtl.getObjtype().equals(Bundledtl.ObjType_Text)) {
					textService.deleteText("" + oldBundledtl.getObjid());
				} else if (oldBundledtl.getObjtype().equals(Bundledtl.ObjType_Stream)) {
					streamService.deleteStream("" + oldBundledtl.getObjid());
				} else if (oldBundledtl.getObjtype().equals(Bundledtl.ObjType_Widget)) {
					widgetService.deleteWidget("" + oldBundledtl.getObjid());
				} else if (oldBundledtl.getObjtype().equals(Bundledtl.ObjType_Rss)) {
					rssService.deleteRss("" + oldBundledtl.getObjid());
				}
			}
			if (bundledtl.getReferflag().equals(Bundledtl.ReferFlag_Private)) {
				if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Medialist)) {
					Medialist medialist = bundledtl.getMedialist();
					Medialist oldMedialist = medialistMapper.selectByPrimaryKey("" + bundledtl.getObjid());
					List<Medialistdtl> oldmedialistdtls;
					if (oldMedialist == null) {
						medialist.setOrgid(bundle.getOrgid());
						medialist.setBranchid(0);
						medialist.setName(bundle.getName() + "-" + bundledtl.getBundledtlid());
						medialist.setType(Medialist.Type_Private);
						medialist.setCreatestaffid(bundle.getCreatestaffid());
						medialistMapper.insertSelective(medialist);
						oldmedialistdtls = new ArrayList<Medialistdtl>();
					} else {
						oldmedialistdtls = oldMedialist.getMedialistdtls();
					}

					HashMap<Integer, Medialistdtl> medialistdtlhash = new HashMap<Integer, Medialistdtl>();
					for (Medialistdtl medialistdtl : medialist.getMedialistdtls()) {
						medialistdtl.setMedialistid(medialist.getMedialistid());
						if (medialistdtl.getMedialistdtlid() == 0) {
							medialistdtlMapper.insertSelective(medialistdtl);
						} else {
							medialistdtlMapper.updateByPrimaryKeySelective(medialistdtl);
							medialistdtlhash.put(medialistdtl.getMedialistdtlid(), medialistdtl);
						}
					}
					for (int i = 0; i < oldmedialistdtls.size(); i++) {
						if (medialistdtlhash.get(oldmedialistdtls.get(i).getMedialistdtlid()) == null) {
							medialistdtlMapper.deleteByPrimaryKey("" + oldmedialistdtls.get(i).getMedialistdtlid());
						}
					}

					bundledtl.setObjid(medialist.getMedialistid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Text)) {
					Text text = bundledtl.getText();
					Text oldText = textMapper.selectByPrimaryKey("" + bundledtl.getObjid());
					if (oldText == null) {
						text.setOrgid(bundle.getOrgid());
						text.setBranchid(0);
						text.setName(bundle.getName() + "-" + bundledtl.getBundledtlid());
						text.setType(Medialist.Type_Private);
						text.setCreatestaffid(bundle.getCreatestaffid());
						textMapper.insertSelective(text);
					} else {
						text.setTextid(bundledtl.getObjid());
						textMapper.updateByPrimaryKeySelective(text);
					}
					bundledtl.setObjid(text.getTextid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Stream)) {
					Stream stream = bundledtl.getStream();
					Stream oldStream = streamMapper.selectByPrimaryKey("" + bundledtl.getObjid());
					if (oldStream == null) {
						stream.setOrgid(bundle.getOrgid());
						stream.setBranchid(0);
						stream.setName(bundle.getName() + "-" + bundledtl.getBundledtlid());
						stream.setType(Medialist.Type_Private);
						stream.setCreatestaffid(bundle.getCreatestaffid());
						streamMapper.insertSelective(stream);
					} else {
						stream.setStreamid(bundledtl.getObjid());
						streamMapper.updateByPrimaryKeySelective(stream);
					}
					bundledtl.setObjid(stream.getStreamid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Widget)) {
					Widget widget = bundledtl.getWidget();
					Widget oldWidget = widgetMapper.selectByPrimaryKey("" + bundledtl.getObjid());
					if (oldWidget == null) {
						widget.setOrgid(bundle.getOrgid());
						widget.setBranchid(0);
						widget.setName(bundle.getName() + "-" + bundledtl.getBundledtlid());
						widget.setType(Medialist.Type_Private);
						widget.setCreatestaffid(bundle.getCreatestaffid());
						widgetMapper.insertSelective(widget);
					} else {
						widget.setWidgetid(bundledtl.getObjid());
						widgetMapper.updateByPrimaryKeySelective(widget);
					}
					bundledtl.setObjid(widget.getWidgetid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Rss)) {
					Rss rss = bundledtl.getRss();
					Rss oldRss = rssMapper.selectByPrimaryKey("" + bundledtl.getObjid());
					if (oldRss == null) {
						rss.setOrgid(bundle.getOrgid());
						rss.setBranchid(0);
						rss.setName(bundle.getName() + "-" + bundledtl.getBundledtlid());
						rss.setType(Medialist.Type_Private);
						rss.setCreatestaffid(bundle.getCreatestaffid());
						rssMapper.insertSelective(rss);
					} else {
						rss.setRssid(bundledtl.getObjid());
						rssMapper.updateByPrimaryKeySelective(rss);
					}
					bundledtl.setObjid(rss.getRssid());
				}
			}

			bundledtlMapper.updateByPrimaryKeySelective(bundledtl);
		}

		List<HashMap<String, Object>> bindList = scheduleMapper.selectBindListByObj(Scheduledtl.ObjType_Bundle,
				"" + bundle.getBundleid());
		if (bundle.getHomeflag().equals("0")) {
			bindList = scheduleMapper.selectBindListByObj(Scheduledtl.ObjType_Bundle, "" + bundle.getHomebundleid());
		}
		for (HashMap<String, Object> bindObj : bindList) {
			devicefileService.refreshDevicefiles(bindObj.get("bindtype").toString(), bindObj.get("bindid").toString());
		}

		String snapshotdtl = bundle.getSnapshotdtl();
		if (snapshotdtl.startsWith("data:image/png;base64,")) {
			snapshotdtl = snapshotdtl.substring(22);
		}
		String snapshotFilePath = "/bundle/" + bundle.getBundleid() + "/snapshot/" + bundle.getBundleid() + ".png";
		File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
		bundle.setSnapshot(snapshotFilePath);
		bundleMapper.updateByPrimaryKeySelective(bundle);
	}

	@Transactional
	public void push(Bundle bundle, Device[] devices, Devicegroup[] devicegroups) throws Exception {
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
			scheduledtl.setObjtype(Scheduledtl.ObjType_Bundle);
			scheduledtl.setObjid(bundle.getBundleid());
			scheduledtl.setSequence(1);
			scheduledtlMapper.insertSelective(scheduledtl);

			devicefileService.refreshDevicefiles(Schedule.BindType_Device, "" + device.getDeviceid());
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
			scheduledtl.setObjtype(Scheduledtl.ObjType_Bundle);
			scheduledtl.setObjid(bundle.getBundleid());
			scheduledtl.setSequence(1);
			scheduledtlMapper.insertSelective(scheduledtl);

			devicefileService.refreshDevicefiles(Schedule.BindType_Devicegroup, "" + devicegroup.getDevicegroupid());
		}

		// Handle sync
		for (int i = 0; i < devices.length; i++) {
			scheduleService.syncSchedule("1", "" + devices[i].getDeviceid());
		}
		for (int i = 0; i < devicegroups.length; i++) {
			scheduleService.syncSchedule("2", "" + devicegroups[i].getDevicegroupid());
		}
	}

	@Transactional
	public void handleWizard(Staff staff, Bundle bundle, Device[] devices, Devicegroup[] devicegroups)
			throws Exception {
		if (bundle.getName() == null || bundle.getName().equals("")) {
			bundle.setName("UNKNOWN");
		}
		List<Bundledtl> bundledtls = bundle.getBundledtls();

		// Handle bundle
		bundleMapper.insertSelective(bundle);
		if (bundle.getName().equals("UNKNOWN")) {
			bundle.setName("BUNDLE-" + bundle.getBundleid());
		}
		for (Bundledtl bundledtl : bundledtls) {
			bundledtl.setBundleid(bundle.getBundleid());
			if (bundle.getHomeflag().equals("0")) {
				bundledtl.setHomebundleid(bundle.getHomebundleid());
			} else {
				bundledtl.setHomebundleid(bundle.getBundleid());
			}
			if (bundledtl.getReferflag().equals(Bundledtl.ReferFlag_Private)) {
				if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Medialist)) {
					Medialist medialist = bundledtl.getMedialist();
					medialist.setOrgid(bundle.getOrgid());
					medialist.setBranchid(bundle.getBranchid());
					medialist.setName(bundle.getName() + "-" + bundledtl.getTempletdtlid());
					medialist.setType(Medialist.Type_Private);
					medialist.setCreatestaffid(staff.getStaffid());
					medialistMapper.insertSelective(medialist);
					for (Medialistdtl medialistdtl : medialist.getMedialistdtls()) {
						medialistdtl.setMedialistid(medialist.getMedialistid());
						medialistdtlMapper.insertSelective(medialistdtl);
					}
					bundledtl.setObjid(medialist.getMedialistid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Text)) {
					Text text = bundledtl.getText();
					text.setOrgid(bundle.getOrgid());
					text.setBranchid(bundle.getBranchid());
					text.setName(bundle.getName() + "-" + bundledtl.getTempletdtlid());
					text.setType(Medialist.Type_Private);
					text.setCreatestaffid(staff.getStaffid());
					textMapper.insertSelective(text);
					bundledtl.setObjid(text.getTextid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Stream)) {
					Stream stream = bundledtl.getStream();
					stream.setOrgid(bundle.getOrgid());
					stream.setBranchid(bundle.getBranchid());
					stream.setName(bundle.getName() + "-" + bundledtl.getTempletdtlid());
					stream.setType(Medialist.Type_Private);
					stream.setCreatestaffid(staff.getStaffid());
					streamMapper.insertSelective(stream);
					bundledtl.setObjid(stream.getStreamid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Widget)) {
					Widget widget = bundledtl.getWidget();
					widget.setOrgid(bundle.getOrgid());
					widget.setBranchid(bundle.getBranchid());
					widget.setName(bundle.getName() + "-" + bundledtl.getTempletdtlid());
					widget.setType(Medialist.Type_Private);
					widget.setCreatestaffid(staff.getStaffid());
					widgetMapper.insertSelective(widget);
					bundledtl.setObjid(widget.getWidgetid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Rss)) {
					Rss rss = bundledtl.getRss();
					rss.setOrgid(bundle.getOrgid());
					rss.setBranchid(bundle.getBranchid());
					rss.setName(bundle.getName() + "-" + bundledtl.getTempletdtlid());
					rss.setType(Medialist.Type_Private);
					rss.setCreatestaffid(staff.getStaffid());
					rssMapper.insertSelective(rss);
					bundledtl.setObjid(rss.getRssid());
				}
			}
			bundledtlMapper.insertSelective(bundledtl);
		}

		String snapshotdtl = bundle.getSnapshotdtl();
		if (snapshotdtl.startsWith("data:image/png;base64,")) {
			snapshotdtl = snapshotdtl.substring(22);
		}
		String snapshotFilePath = "/bundle/" + bundle.getBundleid() + "/snapshot/" + bundle.getBundleid() + ".png";
		File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
		bundle.setSnapshot(snapshotFilePath);
		bundleMapper.updateByPrimaryKeySelective(bundle);

		push(bundle, devices, devicegroups);
	}

	public void syncBundleByTemplet(String templetid) throws Exception {
	}

	public void setBundleReviewWait(String bundleid) {
		Bundle bundle = bundleMapper.selectByPrimaryKey(bundleid);
		if (bundle != null && bundle.getHomebundleid() > 0) {
			bundle = bundleMapper.selectByPrimaryKey("" + bundle.getHomebundleid());
		}
		if (bundle != null) {
			bundle.setReviewflag(Bundle.REVIEW_WAIT);
			if (bundle.getReviewflag().equals(Bundle.REVIEW_PASSED)) {
				JSONObject bundleJson = generateBundleJson("" + bundle.getBundleid());
				bundle.setJson(bundleJson.toString());
			}
			bundleMapper.updateByPrimaryKeySelective(bundle);
			List<Bundle> subbundles = bundle.getSubbundles();
			if (subbundles != null) {
				for (Bundle b : subbundles) {
					b.setReviewflag(Bundle.REVIEW_WAIT);
					if (b.getReviewflag().equals(Bundle.REVIEW_PASSED)) {
						JSONObject bundleJson = generateBundleJson("" + b.getBundleid());
						b.setJson(bundleJson.toString());
					}
					bundleMapper.updateByPrimaryKeySelective(b);
				}
			}
		}
	}

	public void setBundleReviewResut(String bundleid, String reviewflag, String comment) {
		Bundle bundle = bundleMapper.selectByPrimaryKey(bundleid);
		if (bundle != null && bundle.getHomebundleid() > 0) {
			bundle = bundleMapper.selectByPrimaryKey("" + bundle.getHomebundleid());
		}
		if (bundle != null) {
			bundle.setReviewflag(reviewflag);
			bundle.setComment(comment);
			bundleMapper.updateByPrimaryKeySelective(bundle);
			List<Bundle> subbundles = bundle.getSubbundles();
			if (subbundles != null) {
				for (Bundle b : subbundles) {
					b.setReviewflag(reviewflag);
					b.setComment(comment);
					bundleMapper.updateByPrimaryKeySelective(b);
				}
			}
		}
	}

	public JSONObject generateBundleJson(String bundleid) {
		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		Bundle bundle = bundleMapper.selectByPrimaryKey(bundleid);

		if (!bundle.getReviewflag().equals(Bundle.REVIEW_PASSED) && bundle.getJson() != null) {
			return new JSONObject(bundle.getJson());
		}

		HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> imageHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> textHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> streamHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> dvbHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> widgetHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> rssHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> audioHash = new HashMap<Integer, JSONObject>();

		JSONObject responseJson = new JSONObject();
		responseJson.put("bundle_id", bundle.getBundleid());
		responseJson.put("name", bundle.getName());
		responseJson.put("thumbnail", "http://" + serverip + ":" + serverport + "/pixsigdata" + bundle.getSnapshot());
		responseJson.put("touch_flag", bundle.getTouchflag());
		responseJson.put("home_flag", bundle.getHomeflag());
		responseJson.put("home_bundle_id", bundle.getHomebundleid());
		responseJson.put("home_idle", bundle.getHomeidletime());

		JSONArray videoJsonArray = new JSONArray();
		responseJson.put("videos", videoJsonArray);
		JSONArray imageJsonArray = new JSONArray();
		responseJson.put("images", imageJsonArray);
		JSONArray textJsonArray = new JSONArray();
		responseJson.put("texts", textJsonArray);
		JSONArray streamJsonArray = new JSONArray();
		responseJson.put("streams", streamJsonArray);
		JSONArray widgetJsonArray = new JSONArray();
		responseJson.put("widgets", widgetJsonArray);
		JSONArray dvbJsonArray = new JSONArray();
		responseJson.put("dvbs", dvbJsonArray);
		JSONArray rssJsonArray = new JSONArray();
		responseJson.put("rsses", rssJsonArray);
		JSONArray audioJsonArray = new JSONArray();
		responseJson.put("audios", audioJsonArray);

		responseJson.put("layout_id", bundle.getTempletid());
		responseJson.put("width", bundle.getWidth());
		responseJson.put("height", bundle.getHeight());
		responseJson.put("bg_color", "#000000");
		JSONObject bundleBgImageJson = new JSONObject();
		responseJson.put("bg_image", bundleBgImageJson);
		if (bundle.getBgimage() != null) {
			bundleBgImageJson.put("id", bundle.getBgimageid());
			bundleBgImageJson.put("name", bundle.getBgimage().getName());
			bundleBgImageJson.put("url",
					"http://" + serverip + ":" + serverport + "/pixsigdata" + bundle.getBgimage().getFilepath());
			bundleBgImageJson.put("path", "/pixsigdata" + bundle.getBgimage().getFilepath());
			bundleBgImageJson.put("file", bundle.getBgimage().getFilename());
			bundleBgImageJson.put("size", bundle.getBgimage().getSize());
			bundleBgImageJson.put("thumbnail",
					"http://" + serverip + ":" + serverport + "/pixsigdata" + bundle.getBgimage().getThumbnail());
			if (imageHash.get(bundle.getBgimageid()) == null) {
				imageHash.put(bundle.getBgimageid(), bundleBgImageJson);
				imageJsonArray.put(bundleBgImageJson);
			}
		} else {
			bundleBgImageJson.put("id", 0);
			bundleBgImageJson.put("name", "");
			bundleBgImageJson.put("url", "");
			bundleBgImageJson.put("path", "");
			bundleBgImageJson.put("file", "");
			bundleBgImageJson.put("size", 0);
			bundleBgImageJson.put("thumbnail", "");
		}

		List<Video> videoList = new ArrayList<Video>();
		List<Image> imageList = new ArrayList<Image>();
		JSONArray regionJsonArray = new JSONArray();
		responseJson.put("regions", regionJsonArray);
		for (Bundledtl bundledtl : bundle.getBundledtls()) {
			JSONObject regionJson = new JSONObject();
			regionJsonArray.put(regionJson);
			if (bundledtl.getMainflag().equals("1")) {
				regionJson.put("region_id", 1);
			} else {
				regionJson.put("region_id", bundledtl.getBundledtlid());
			}
			regionJson.put("main_flag", bundledtl.getMainflag());
			regionJson.put("width", bundledtl.getWidth());
			regionJson.put("height", bundledtl.getHeight());
			regionJson.put("top", bundledtl.getTopoffset());
			regionJson.put("left", bundledtl.getLeftoffset());
			regionJson.put("zindex", bundledtl.getZindex());
			String opacity = Integer.toHexString(bundledtl.getOpacity());
			if (opacity.length() == 1) {
				opacity = "0" + opacity;
			}
			regionJson.put("bgcolor", "#" + opacity + bundledtl.getBgcolor().trim().substring(1));
			regionJson.put("type", bundledtl.getType());
			regionJson.put("sleep", bundledtl.getSleeptime());
			regionJson.put("interval", bundledtl.getIntervaltime());
			regionJson.put("animation", bundledtl.getAnimation());
			regionJson.put("fit_flag", Integer.parseInt(bundledtl.getFitflag()));
			if (bundledtl.getDirection().equals("1")) {
				regionJson.put("direction", "none");
			} else if (bundledtl.getDirection().equals("2")) {
				regionJson.put("direction", "up");
			} else if (bundledtl.getDirection().equals("3")) {
				regionJson.put("direction", "down");
			} else if (bundledtl.getDirection().equals("4")) {
				regionJson.put("direction", "left");
			} else if (bundledtl.getDirection().equals("5")) {
				regionJson.put("direction", "right");
			}
			regionJson.put("speed", Integer.parseInt(bundledtl.getSpeed()));
			regionJson.put("color", "" + bundledtl.getColor());
			regionJson.put("size", bundledtl.getSize());
			if (bundledtl.getDateformat() == null) {
				regionJson.put("date_format", "yyyy-MM-dd");
			} else {
				regionJson.put("date_format", bundledtl.getDateformat());
			}
			regionJson.put("volume", bundledtl.getVolume());

			if (bundledtl.getType().equals(Bundledtl.Type_TOUCH)) {
				regionJson.put("touch_label", bundledtl.getTouchlabel());
				regionJson.put("touch_type", bundledtl.getTouchtype());
				regionJson.put("touch_bundle_id", bundledtl.getTouchbundleid());
				regionJson.put("touch_apk", bundledtl.getTouchapk());
			}

			JSONObject regionBgImageJson = new JSONObject();
			regionJson.put("bg_image", regionBgImageJson);
			if (bundledtl.getBgimage() != null) {
				regionBgImageJson.put("id", bundledtl.getBgimageid());
				regionBgImageJson.put("name", bundledtl.getBgimage().getName());
				regionBgImageJson.put("url",
						"http://" + serverip + ":" + serverport + "/pixsigdata" + bundledtl.getBgimage().getFilepath());
				regionBgImageJson.put("path", "/pixsigdata" + bundledtl.getBgimage().getFilepath());
				regionBgImageJson.put("file", bundledtl.getBgimage().getFilename());
				regionBgImageJson.put("size", bundledtl.getBgimage().getSize());
				regionBgImageJson.put("thumbnail", "http://" + serverip + ":" + serverport + "/pixsigdata"
						+ bundledtl.getBgimage().getThumbnail());
				if (imageHash.get(bundledtl.getBgimageid()) == null) {
					imageHash.put(bundledtl.getBgimageid(), regionBgImageJson);
					imageJsonArray.put(regionBgImageJson);
				}
			} else {
				regionBgImageJson.put("id", 0);
				regionBgImageJson.put("name", "");
				regionBgImageJson.put("url", "");
				regionBgImageJson.put("path", "");
				regionBgImageJson.put("file", "");
				regionBgImageJson.put("size", 0);
				regionBgImageJson.put("thumbnail", "");
			}

			JSONArray playlistJsonArray = new JSONArray();
			regionJson.put("playlist", playlistJsonArray);

			String objtype = bundledtl.getObjtype();
			if (objtype.equals(Bundledtl.ObjType_Medialist)) {
				List<Medialistdtl> medialistdtls = bundledtl.getMedialist().getMedialistdtls();
				for (Medialistdtl medialistdtl : medialistdtls) {
					if (medialistdtl.getVideo() != null) {
						Video video = medialistdtl.getVideo();
						playlistJsonArray.put(new JSONObject().put("type", "video").put("id", video.getVideoid()));
						if (videoHash.get(medialistdtl.getObjid()) == null) {
							JSONObject videoJson = new JSONObject();
							videoJson.put("id", video.getVideoid());
							videoJson.put("name", video.getName());
							videoJson.put("oname", video.getOname());
							videoJson.put("url",
									"http://" + serverip + ":" + serverport + "/pixsigdata" + video.getFilepath());
							videoJson.put("path", "/pixsigdata" + video.getFilepath());
							videoJson.put("file", video.getFilename());
							videoJson.put("size", video.getSize());
							videoJson.put("thumbnail",
									"http://" + serverip + ":" + serverport + "/pixsigdata" + video.getThumbnail());
							if (video.getRelate() != null) {
								videoJson.put("relate_id", video.getRelateid());
							} else {
								videoJson.put("relate_id", 0);
							}
							videoJson.put("tags", video.getTags());
							videoHash.put(video.getVideoid(), videoJson);
							videoJsonArray.put(videoJson);
							videoList.add(video);
						}
					} else if (medialistdtl.getImage() != null) {
						Image image = medialistdtl.getImage();
						playlistJsonArray.put(new JSONObject().put("type", "image").put("id", image.getImageid()));
						if (imageHash.get(medialistdtl.getObjid()) == null) {
							JSONObject imageJson = new JSONObject();
							imageJson.put("id", image.getImageid());
							imageJson.put("name", image.getName());
							imageJson.put("oname", image.getOname());
							imageJson.put("url",
									"http://" + serverip + ":" + serverport + "/pixsigdata" + image.getFilepath());
							imageJson.put("path", "/pixsigdata" + image.getFilepath());
							imageJson.put("file", image.getFilename());
							imageJson.put("size", image.getSize());
							imageJson.put("thumbnail",
									"http://" + serverip + ":" + serverport + "/pixsigdata" + image.getThumbnail());
							if (image.getRelate() != null) {
								imageJson.put("relate_id", image.getRelateid());
							} else {
								imageJson.put("relate_id", 0);
							}
							imageHash.put(image.getImageid(), imageJson);
							imageJsonArray.put(imageJson);
							imageList.add(image);
						}
					} else if (medialistdtl.getStream() != null) {
						Stream stream = medialistdtl.getStream();
						playlistJsonArray.put(new JSONObject().put("type", "stream").put("id", stream.getStreamid()));
						if (streamHash.get(medialistdtl.getObjid()) == null) {
							JSONObject streamJson = new JSONObject();
							streamJson.put("id", stream.getStreamid());
							streamJson.put("url", stream.getUrl());
							streamHash.put(stream.getStreamid(), streamJson);
							streamJsonArray.put(streamJson);
						}
					} else if (medialistdtl.getAudio() != null) {
						Audio audio = medialistdtl.getAudio();
						playlistJsonArray.put(new JSONObject().put("type", "audio").put("id", audio.getAudioid()));
						if (audioHash.get(medialistdtl.getObjid()) == null) {
							JSONObject audioJson = new JSONObject();
							audioJson.put("id", audio.getAudioid());
							audioJson.put("name", audio.getName());
							audioJson.put("url",
									"http://" + serverip + ":" + serverport + "/pixsigdata" + audio.getFilepath());
							audioJson.put("path", "/pixsigdata" + audio.getFilepath());
							audioJson.put("file", audio.getFilename());
							audioJson.put("size", audio.getSize());
							audioHash.put(audio.getAudioid(), audioJson);
							audioJsonArray.put(audioJson);
						}
					}
				}
			} else if (objtype.equals(Bundledtl.ObjType_Text)) {
				Text text = bundledtl.getText();
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
			} else if (objtype.equals(Bundledtl.ObjType_Stream)) {
				Stream stream = bundledtl.getStream();
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
			} else if (objtype.equals(Bundledtl.ObjType_Widget)) {
				Widget widget = bundledtl.getWidget();
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
			} else if (objtype.equals(Bundledtl.ObjType_Dvb)) {
				Dvb dvb = bundledtl.getDvb();
				if (dvb != null) {
					playlistJsonArray.put(new JSONObject().put("type", "dvb").put("id", dvb.getDvbid()));
					if (dvbHash.get(dvb.getDvbid()) == null) {
						JSONObject dvbJson = new JSONObject();
						dvbJson.put("id", dvb.getDvbid());
						dvbJson.put("number", dvb.getNumber());
						dvbHash.put(dvb.getDvbid(), dvbJson);
						dvbJsonArray.put(dvbJson);
					}
				}
			} else if (objtype.equals(Bundledtl.ObjType_Rss)) {
				Rss rss = bundledtl.getRss();
				if (rss != null) {
					playlistJsonArray.put(new JSONObject().put("type", "rss").put("id", rss.getRssid()));
					if (rssHash.get(rss.getRssid()) == null) {
						JSONObject rssJson = new JSONObject();
						rssJson.put("id", rss.getRssid());
						rssJson.put("url", rss.getUrl());
						rssHash.put(rss.getRssid(), rssJson);
						rssJsonArray.put(rssJson);
					}
				}
			}

		}

		for (Video video : videoList) {
			if (video.getRelate() != null && videoHash.get(video.getRelateid()) == null) {
				JSONObject videoJson = new JSONObject();
				videoJson.put("id", video.getRelateid());
				videoJson.put("name", video.getRelate().getName());
				videoJson.put("oname", video.getRelate().getOname());
				videoJson.put("url",
						"http://" + serverip + ":" + serverport + "/pixsigdata" + video.getRelate().getFilepath());
				videoJson.put("path", "/pixsigdata" + video.getRelate().getFilepath());
				videoJson.put("file", video.getRelate().getFilename());
				videoJson.put("size", video.getRelate().getSize());
				videoJson.put("thumbnail",
						"http://" + serverip + ":" + serverport + "/pixsigdata" + video.getRelate().getThumbnail());
				videoJson.put("relate_id", 0);
				videoJson.put("tags", video.getRelate().getTags());
				videoHash.put(video.getRelateid(), videoJson);
				videoJsonArray.put(videoJson);
			}
		}
		for (Image image : imageList) {
			if (image.getRelate() != null && imageHash.get(image.getRelateid()) == null) {
				JSONObject imageJson = new JSONObject();
				imageJson.put("id", image.getRelateid());
				imageJson.put("name", image.getRelate().getName());
				imageJson.put("oname", image.getRelate().getOname());
				imageJson.put("url",
						"http://" + serverip + ":" + serverport + "/pixsigdata" + image.getRelate().getFilepath());
				imageJson.put("path", "/pixsigdata" + image.getRelate().getFilepath());
				imageJson.put("file", image.getRelate().getFilename());
				imageJson.put("size", image.getRelate().getSize());
				imageJson.put("thumbnail",
						"http://" + serverip + ":" + serverport + "/pixsigdata" + image.getRelate().getThumbnail());
				imageJson.put("relate_id", 0);
				imageHash.put(image.getRelateid(), imageJson);
				imageJsonArray.put(imageJson);
			}
		}

		String checksum = DigestUtils.md5Hex(responseJson.toString());
		responseJson.put("checksum", checksum);

		return responseJson;
	}

	public JSONArray generateBundleJsonArray(List<Integer> bundleids) {
		HashMap<Integer, JSONObject> bundleHash = new HashMap<Integer, JSONObject>();
		JSONArray bundleJSONArray = new JSONArray();
		for (Integer bundleid : bundleids) {
			if (bundleHash.get(bundleid) == null) {
				JSONObject bundleJson = generateBundleJson("" + bundleid);
				bundleJSONArray.put(bundleJson);
				bundleHash.put(bundleid, bundleJson);
			}
			List<Bundle> subbundles = bundleMapper.selectSubList("" + bundleid);
			for (Bundle subbundle : subbundles) {
				if (bundleHash.get(subbundle.getBundleid()) == null) {
					JSONObject bundleJson = generateBundleJson("" + subbundle.getBundleid());
					bundleJSONArray.put(bundleJson);
					bundleHash.put(subbundle.getBundleid(), bundleJson);
				}
			}
		}
		return bundleJSONArray;
	}

}
