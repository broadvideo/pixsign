package com.broadvideo.pixsignage.service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;
import java.util.Vector;

import javax.imageio.ImageIO;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Audio;
import com.broadvideo.pixsignage.domain.Bundle;
import com.broadvideo.pixsignage.domain.Bundlezone;
import com.broadvideo.pixsignage.domain.Bundlezonedtl;
import com.broadvideo.pixsignage.domain.Dvb;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Schedule;
import com.broadvideo.pixsignage.domain.Scheduledtl;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.domain.Stream;
import com.broadvideo.pixsignage.domain.Templet;
import com.broadvideo.pixsignage.domain.Templetzone;
import com.broadvideo.pixsignage.domain.Templetzonedtl;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.BundleMapper;
import com.broadvideo.pixsignage.persistence.BundlezoneMapper;
import com.broadvideo.pixsignage.persistence.BundlezonedtlMapper;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.ImageMapper;
import com.broadvideo.pixsignage.persistence.ScheduleMapper;
import com.broadvideo.pixsignage.persistence.ScheduledtlMapper;
import com.broadvideo.pixsignage.persistence.TempletMapper;
import com.broadvideo.pixsignage.persistence.VideoMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service("bundleService")
public class BundleServiceImpl implements BundleService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private BundleMapper bundleMapper;
	@Autowired
	private BundlezoneMapper bundlezoneMapper;
	@Autowired
	private BundlezonedtlMapper bundlezonedtlMapper;
	@Autowired
	private TempletMapper templetMapper;
	@Autowired
	private ScheduleMapper scheduleMapper;
	@Autowired
	private ScheduledtlMapper scheduledtlMapper;
	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private VideoMapper videoMapper;
	@Autowired
	private ImageMapper imageMapper;
	@Autowired
	private DeviceMapper deviceMapper;

	@Autowired
	private ScheduleService scheduleService;

	public Bundle selectMiniByPrimaryKey(String bundleid) {
		return bundleMapper.selectMiniByPrimaryKey(bundleid);
	}

	public Bundle selectBaseByPrimaryKey(String bundleid) {
		return bundleMapper.selectBaseByPrimaryKey(bundleid);
	}

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

	public List<Bundle> selectExportList() {
		return bundleMapper.selectExportList();
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
			} else if (bundle.getRatio().equals("7")) {
				// 1920x313
				bundle.setWidth(1920);
				bundle.setHeight(313);
			} else if (bundle.getRatio().equals("8")) {
				// 313x1920
				bundle.setWidth(313);
				bundle.setHeight(1920);
			}
			bundle.setUuid(UUID.randomUUID().toString().replace("-", ""));
			bundle.setUpdatetime(Calendar.getInstance().getTime());
			bundleMapper.insertSelective(bundle);

			if (bundle.getName().equals("UNKNOWN")) {
				bundle.setName("BUNDLE-" + bundle.getBundleid());
			}
			bundleMapper.updateByPrimaryKeySelective(bundle);
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
			bundle.setUuid(UUID.randomUUID().toString().replace("-", ""));
			bundle.setUpdatetime(Calendar.getInstance().getTime());
			bundleMapper.insertSelective(bundle);
			if (bundle.getName().equals("UNKNOWN")) {
				bundle.setName("BUNDLE-" + bundle.getBundleid());
			}
			if (templet.getSnapshot() != null) {
				String snapshotFilePath = "/bundle/" + bundle.getBundleid() + "/snapshot/" + bundle.getBundleid()
						+ ".jpg";
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
				subbundle.setUpdatetime(bundle.getUpdatetime());
				bundleMapper.insertSelective(subbundle);
				bundleidHash.put(subtemplet.getTempletid(), subbundle.getBundleid());
				templetList.add(subtemplet);
				if (subtemplet.getSnapshot() != null) {
					String snapshotFilePath = "/bundle/" + subbundle.getBundleid() + "/snapshot/"
							+ subbundle.getBundleid() + ".jpg";
					File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
					FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + subtemplet.getSnapshot()),
							snapshotFile);
					subbundle.setSnapshot(snapshotFilePath);
					bundleMapper.updateByPrimaryKeySelective(subbundle);
				}
			}

			for (Templet t : templetList) {
				List<Templetzone> templetzones = t.getTempletzones();
				for (Templetzone templetzone : templetzones) {
					Bundlezone bundlezone = new Bundlezone();
					bundlezone.setBundleid(bundleidHash.get(t.getTempletid()));
					if (bundle.getHomeflag().equals("0")) {
						bundlezone.setHomebundleid(bundle.getHomebundleid());
					} else {
						bundlezone.setHomebundleid(bundle.getBundleid());
					}
					bundlezone.setType(templetzone.getType());
					bundlezone.setMainflag(templetzone.getMainflag());
					bundlezone.setHeight(templetzone.getHeight());
					bundlezone.setWidth(templetzone.getWidth());
					bundlezone.setTopoffset(templetzone.getTopoffset());
					bundlezone.setLeftoffset(templetzone.getLeftoffset());
					bundlezone.setZindex(templetzone.getZindex());
					bundlezone.setBgcolor(templetzone.getBgcolor());
					bundlezone.setBgopacity(templetzone.getBgopacity());
					bundlezone.setBgimageid(templetzone.getBgimageid());
					bundlezone.setSleeptime(templetzone.getSleeptime());
					bundlezone.setIntervaltime(templetzone.getIntervaltime());
					bundlezone.setAnimation(templetzone.getAnimation());
					bundlezone.setSpeed(templetzone.getSpeed());
					bundlezone.setColor(templetzone.getColor());
					bundlezone.setSize(templetzone.getSize());
					bundlezone.setDateformat(templetzone.getDateformat());
					bundlezone.setFitflag(templetzone.getFitflag());
					bundlezone.setVolume(templetzone.getVolume());
					bundlezone.setTouchlabel(templetzone.getTouchlabel());
					bundlezone.setTouchtype(templetzone.getTouchtype());
					Integer touchobjid = 0;
					if (templetzone.getTouchtype().equals("2")) {
						touchobjid = bundleidHash.get(templetzone.getTouchobjid());
						if (touchobjid == null) {
							touchobjid = 0;
						}
					}
					bundlezone.setTouchobjid(touchobjid);
					bundlezone.setContent(templetzone.getContent());
					bundlezoneMapper.insertSelective(bundlezone);
					for (Templetzonedtl templetzonedtl : templetzone.getTempletzonedtls()) {
						Bundlezonedtl bundlezonedtl = new Bundlezonedtl();
						bundlezonedtl.setBundlezoneid(bundlezone.getBundlezoneid());
						bundlezonedtl.setObjtype(templetzonedtl.getObjtype());
						bundlezonedtl.setObjid(templetzonedtl.getObjid());
						bundlezonedtl.setSequence(templetzonedtl.getSequence());
						bundlezonedtlMapper.insertSelective(bundlezonedtl);
					}
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
			} else if (bundle.getRatio().equals("7")) {
				// 1920x313
				bundle.setWidth(1920);
				bundle.setHeight(313);
			} else if (bundle.getRatio().equals("8")) {
				// 313x1920
				bundle.setWidth(313);
				bundle.setHeight(1920);
			}
			bundle.setUuid(UUID.randomUUID().toString().replace("-", ""));
			bundle.setUpdatetime(Calendar.getInstance().getTime());
			bundleMapper.insertSelective(bundle);

			if (bundle.getName().equals("UNKNOWN")) {
				bundle.setName("BUNDLE-" + bundle.getBundleid());
			}
			bundleMapper.updateByPrimaryKeySelective(bundle);
		} else {
			// Copy bundle
			bundle.setTempletid(frombundle.getTempletid());
			bundle.setRatio(frombundle.getRatio());
			bundle.setHeight(frombundle.getHeight());
			bundle.setWidth(frombundle.getWidth());
			bundle.setBgcolor(frombundle.getBgcolor());
			bundle.setBgimageid(frombundle.getBgimageid());
			bundle.setHomeidletime(frombundle.getHomeidletime());
			bundle.setUuid(UUID.randomUUID().toString().replace("-", ""));
			bundle.setUpdatetime(Calendar.getInstance().getTime());
			bundleMapper.insertSelective(bundle);
			if (bundle.getName().equals("UNKNOWN")) {
				bundle.setName("BUNDLE-" + bundle.getBundleid());
			}
			if (frombundle.getSnapshot() != null) {
				String snapshotFilePath = "/bundle/" + bundle.getBundleid() + "/snapshot/" + bundle.getBundleid()
						+ ".jpg";
				File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + frombundle.getSnapshot()), snapshotFile);
				bundle.setSnapshot(snapshotFilePath);
			}
			bundleMapper.updateByPrimaryKeySelective(bundle);

			List<Bundlezone> frombundlezones = frombundle.getBundlezones();
			for (Bundlezone frombundlezone : frombundlezones) {
				Bundlezone bundlezone = new Bundlezone();
				bundlezone.setBundleid(bundle.getBundleid());
				if (bundle.getHomeflag().equals("0")) {
					bundlezone.setHomebundleid(bundle.getHomebundleid());
				} else {
					bundlezone.setHomebundleid(bundle.getBundleid());
				}
				bundlezone.setType(frombundlezone.getType());
				bundlezone.setMainflag(frombundlezone.getMainflag());
				bundlezone.setHeight(frombundlezone.getHeight());
				bundlezone.setWidth(frombundlezone.getWidth());
				bundlezone.setTopoffset(frombundlezone.getTopoffset());
				bundlezone.setLeftoffset(frombundlezone.getLeftoffset());
				bundlezone.setZindex(frombundlezone.getZindex());
				bundlezone.setBgcolor(frombundlezone.getBgcolor());
				bundlezone.setBgopacity(frombundlezone.getBgopacity());
				bundlezone.setBgimageid(frombundlezone.getBgimageid());
				bundlezone.setSleeptime(frombundlezone.getSleeptime());
				bundlezone.setIntervaltime(frombundlezone.getIntervaltime());
				bundlezone.setAnimation(frombundlezone.getAnimation());
				bundlezone.setSpeed(frombundlezone.getSpeed());
				bundlezone.setColor(frombundlezone.getColor());
				bundlezone.setSize(frombundlezone.getSize());
				bundlezone.setDateformat(frombundlezone.getDateformat());
				bundlezone.setFitflag(frombundlezone.getFitflag());
				bundlezone.setVolume(frombundlezone.getVolume());
				bundlezone.setTouchlabel(frombundlezone.getTouchlabel());
				bundlezone.setTouchtype(frombundlezone.getTouchtype());
				bundlezone.setTouchobjid(frombundlezone.getTouchobjid());
				bundlezone.setContent(frombundlezone.getContent());
				bundlezoneMapper.insertSelective(bundlezone);
				for (Bundlezonedtl frombundlezonedtl : frombundlezone.getBundlezonedtls()) {
					Bundlezonedtl bundlezonedtl = new Bundlezonedtl();
					bundlezonedtl.setBundlezoneid(bundlezone.getBundlezoneid());
					bundlezonedtl.setObjtype(frombundlezonedtl.getObjtype());
					bundlezonedtl.setObjid(frombundlezonedtl.getObjid());
					bundlezonedtl.setSequence(frombundlezonedtl.getSequence());
					bundlezonedtlMapper.insertSelective(bundlezonedtl);
				}
			}
		}
	}

	@Transactional
	public void updateBundle(Bundle bundle) {
		bundle.setUpdatetime(Calendar.getInstance().getTime());
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
		List<Bundlezone> bundlezones = bundle.getBundlezones();
		List<Bundlezone> oldbundlezones = bundlezoneMapper.selectList("" + bundleid);
		HashMap<Integer, Bundlezone> hash = new HashMap<Integer, Bundlezone>();
		for (Bundlezone bundlezone : bundlezones) {
			if (bundlezone.getBundlezoneid() > 0) {
				hash.put(bundlezone.getBundlezoneid(), bundlezone);
			}
		}
		for (int i = 0; i < oldbundlezones.size(); i++) {
			Bundlezone oldBundlezone = oldbundlezones.get(i);
			if (hash.get(oldBundlezone.getBundlezoneid()) == null) {
				bundlezonedtlMapper.deleteByBundlezone("" + oldbundlezones.get(i).getBundlezoneid());
				bundlezoneMapper.deleteByPrimaryKey("" + oldbundlezones.get(i).getBundlezoneid());
			}
		}
		for (Bundlezone bundlezone : bundlezones) {
			if (bundle.getHomeflag().equals("0")) {
				bundlezone.setHomebundleid(bundle.getHomebundleid());
			} else {
				bundlezone.setHomebundleid(bundle.getBundleid());
			}
			if (bundlezone.getBundlezoneid() <= 0) {
				bundlezone.setBundleid(bundleid);
				bundlezoneMapper.insertSelective(bundlezone);
			} else {
				bundlezoneMapper.updateByPrimaryKeySelective(bundlezone);
				bundlezonedtlMapper.deleteByBundlezone("" + bundlezone.getBundlezoneid());
			}
			for (Bundlezonedtl bundlezonedtl : bundlezone.getBundlezonedtls()) {
				bundlezonedtl.setBundlezoneid(bundlezone.getBundlezoneid());
				bundlezonedtlMapper.insertSelective(bundlezonedtl);
			}
		}

		String snapshotdtl = bundle.getSnapshotdtl();
		if (snapshotdtl.startsWith("data:image/jpeg;base64,")) {
			snapshotdtl = snapshotdtl.substring(23);
		}
		String snapshotFilePath = "/bundle/" + bundle.getBundleid() + "/snapshot/" + bundle.getBundleid() + ".jpg";
		File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
		bundle.setSnapshot(snapshotFilePath);
		bundle.setUpdatetime(Calendar.getInstance().getTime());

		if (bundle.getHomeflag().equals("1")) {
			bundle.setExportflag("0");
		} else {
			Bundle homebundle = bundleMapper.selectByPrimaryKey("" + bundle.getHomebundleid());
			homebundle.setExportflag("0");
			bundleMapper.updateByPrimaryKeySelective(homebundle);
		}
		bundleMapper.updateByPrimaryKeySelective(bundle);
	}

	public void copySingleBundle(String sourcebundleid, String destbundleids) throws Exception {
		String[] destbundleidList = destbundleids.split(",");
		Bundle sourcebundle = bundleMapper.selectByPrimaryKey(sourcebundleid);
		Vector<Integer> bundleidVector = new Vector<Integer>();
		for (int i = 0; i < destbundleidList.length; i++) {
			logger.info("Copy bundle from sourcebundleid={}, destbundleid={}", sourcebundleid, destbundleidList[i]);
			Bundle destbundle = bundleMapper.selectByPrimaryKey(destbundleidList[i]);
			bundleMapper.clearBundlezones(destbundleidList[i]);
			destbundle.setHomeidletime(sourcebundle.getHomeidletime());
			File fromSnapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + "/bundle/" + sourcebundleid
					+ "/snapshot/" + sourcebundleid + ".jpg");
			if (fromSnapshotFile.exists()) {
				String snapshotFilePath = "/bundle/" + destbundleidList[i] + "/snapshot/" + destbundleidList[i]
						+ ".jpg";
				File toSnapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				destbundle.setSnapshot(snapshotFilePath);
				FileUtils.copyFile(fromSnapshotFile, toSnapshotFile);
			}
			bundleMapper.updateByPrimaryKeySelective(destbundle);
			if (destbundle.getHomeflag().equals("1")) {
				if (bundleidVector.indexOf(destbundle.getBundleid()) < 0) {
					bundleidVector.add(destbundle.getBundleid());
				}
			} else {
				if (bundleidVector.indexOf(destbundle.getHomebundleid()) < 0) {
					bundleidVector.add(destbundle.getHomebundleid());
				}
			}

			for (Bundlezone bundlezone : sourcebundle.getBundlezones()) {
				bundlezone.setBundleid(destbundle.getBundleid());
				bundlezone.setHomebundleid(destbundle.getHomebundleid());
				if (bundlezone.getTouchtype().equals("2")) {
					Bundle touchBundle = bundleMapper.selectByPrimaryKey("" + bundlezone.getTouchobjid());
					if (touchBundle == null
							|| touchBundle.getHomebundleid().intValue() != destbundle.getHomebundleid()) {
						bundlezone.setTouchtype("9");
						bundlezone.setTouchobjid(0);
					}
				}
				bundlezoneMapper.insertSelective(bundlezone);
				for (Bundlezonedtl bundlezonedtl : bundlezone.getBundlezonedtls()) {
					bundlezonedtl.setBundlezoneid(bundlezone.getBundlezoneid());
					bundlezonedtlMapper.insertSelective(bundlezonedtl);
				}
			}
		}
		for (int bundleid : bundleidVector) {
			makeJsonFile("" + bundleid);
		}
	}

	public void makeJsonFile(String bundleid) throws Exception {
		logger.info("Making json file bundleid={}", bundleid);
		ArrayList<Bundle> bundleList = new ArrayList<Bundle>();

		Bundle mainbundle = bundleMapper.selectByPrimaryKey(bundleid);
		bundleList.add(mainbundle);
		for (Bundle subbundle : mainbundle.getSubbundles()) {
			bundleList.add(bundleMapper.selectByPrimaryKey("" + subbundle.getBundleid()));
		}

		JSONArray bundleJsonArray = new JSONArray();
		for (Bundle bundle : bundleList) {
			JSONObject bundleJson = new JSONObject();
			bundleJson.put("bundle_id", bundle.getBundleid());
			bundleJson.put("name", bundle.getName());
			bundleJson.put("touch_flag", bundle.getTouchflag());
			bundleJson.put("home_flag", bundle.getHomeflag());
			bundleJson.put("home_bundle_id", bundle.getHomebundleid());
			bundleJson.put("home_idle", bundle.getHomeidletime());

			bundleJson.put("width", bundle.getWidth());
			bundleJson.put("height", bundle.getHeight());
			bundleJson.put("bg_color", "#000000");

			JSONArray zoneJsonArray = new JSONArray();
			for (Bundlezone bundlezone : bundle.getBundlezones()) {
				JSONObject zoneJson = new JSONObject();
				zoneJson.put("zone_id", bundlezone.getBundlezoneid());
				zoneJson.put("main_flag", bundlezone.getMainflag());
				zoneJson.put("width", bundlezone.getWidth());
				zoneJson.put("height", bundlezone.getHeight());
				zoneJson.put("top", bundlezone.getTopoffset());
				zoneJson.put("left", bundlezone.getLeftoffset());
				zoneJson.put("zindex", bundlezone.getZindex());
				zoneJson.put("type", bundlezone.getType());
				zoneJson.put("sleep", bundlezone.getSleeptime());
				zoneJson.put("interval", bundlezone.getIntervaltime());
				zoneJson.put("speed", Integer.parseInt(bundlezone.getSpeed()));
				zoneJson.put("color", "" + bundlezone.getColor());
				zoneJson.put("size", bundlezone.getSize());
				if (bundlezone.getDateformat() == null) {
					zoneJson.put("date_format", "yyyy-MM-dd");
				} else {
					zoneJson.put("date_format", bundlezone.getDateformat());
				}
				zoneJson.put("fit_flag", Integer.parseInt(bundlezone.getFitflag()));
				String opacity = Integer.toHexString(bundlezone.getBgopacity());
				if (opacity.length() == 1) {
					opacity = "0" + opacity;
				}
				zoneJson.put("bgcolor", "#" + opacity + bundlezone.getBgcolor().trim().substring(1));
				zoneJson.put("volume", bundlezone.getVolume());
				zoneJson.put("animation", bundlezone.getAnimation());

				if (bundlezone.getType().equals(Bundlezone.Type_TOUCH)) {
					zoneJson.put("touch_label", bundlezone.getTouchlabel());
					if (bundlezone.getTouchtype().equals("2")) {
						zoneJson.put("touch_type", "2");
						zoneJson.put("touch_bundle_id", bundlezone.getTouchobjid());
						zoneJson.put("touch_apk", "");
					} else if (bundlezone.getTouchtype().equals("3") || bundlezone.getTouchtype().equals("4")
							|| bundlezone.getTouchtype().equals("5")) {
						zoneJson.put("touch_type", "3");
						zoneJson.put("touch_bundle_id", 0);
						zoneJson.put("touch_apk", "");
					} else if (bundlezone.getTouchtype().equals("6")) {
						zoneJson.put("touch_type", "4");
						zoneJson.put("touch_bundle_id", 0);
						zoneJson.put("touch_apk", bundlezone.getContent());
					} else {
						zoneJson.put("touch_type", bundlezone.getTouchtype());
						zoneJson.put("touch_bundle_id", 0);
						zoneJson.put("touch_apk", "");
					}
				}
				if (bundlezone.getType().equals(Bundlezone.Type_ADVERT)) {
					zoneJson.put("advert_place", bundlezone.getContent());
				}
				zoneJson.put("content", bundlezone.getContent());

				JSONArray zonedtlJsonArray = new JSONArray();
				for (Bundlezonedtl bundlezonedtl : bundlezone.getBundlezonedtls()) {
					JSONObject zonedtlJson = new JSONObject();
					if (bundlezonedtl.getObjtype().equals("1")) {
						zonedtlJson.put("id", bundlezonedtl.getObjid());
						zonedtlJson.put("type", "video");
						zonedtlJsonArray.add(zonedtlJson);
					} else if (bundlezonedtl.getObjtype().equals("2")) {
						zonedtlJson.put("id", bundlezonedtl.getObjid());
						zonedtlJson.put("type", "image");
						zonedtlJsonArray.add(zonedtlJson);
					} else if (bundlezonedtl.getObjtype().equals("6")) {
						zonedtlJson.put("id", bundlezonedtl.getObjid());
						zonedtlJson.put("type", "audio");
						zonedtlJsonArray.add(zonedtlJson);
					}
				}
				zoneJson.put("zonedtls", zonedtlJsonArray);
				zoneJsonArray.add(zoneJson);
			}
			bundleJson.put("zones", zoneJsonArray);
			bundleJsonArray.add(bundleJson);
		}

		String saveDir = CommonConfig.CONFIG_PIXDATA_HOME + "/bundle/" + bundleid;
		String jsonname = "bundle-" + bundleid + ".json";
		FileUtils.forceMkdir(new File(saveDir));
		File jsonFile = new File(saveDir, jsonname);
		if (jsonFile.exists()) {
			jsonFile.delete();
		}
		FileUtils.writeStringToFile(jsonFile, bundleJsonArray.toString(2), "UTF-8", false);

		mainbundle.setSize(FileUtils.sizeOf(jsonFile));
		FileInputStream fis = new FileInputStream(jsonFile);
		mainbundle.setMd5(DigestUtils.md5Hex(fis));
		bundleMapper.updateByPrimaryKeySelective(mainbundle);
	}

	@Transactional
	public void push(Bundle bundle, HashMap<String, Object>[] binds) throws Exception {
		for (int i = 0; i < binds.length; i++) {
			HashMap<String, Object> bind = binds[i];
			logger.info("Push bundle to device: bindtype={}, bindid={}", bind.get("bindtype"), bind.get("bindid"));
			scheduledtlMapper.deleteByDtl(Schedule.ScheduleType_Solo, "" + bind.get("bindtype"),
					"" + bind.get("bindid"), null, null);
			scheduleMapper.deleteByDtl(Schedule.ScheduleType_Solo, "" + bind.get("bindtype"), "" + bind.get("bindid"),
					null, null);
			Schedule schedule = new Schedule();
			schedule.setScheduletype(Schedule.ScheduleType_Solo);
			schedule.setBindtype("" + bind.get("bindtype"));
			schedule.setBindid(Integer.parseInt("" + bind.get("bindid")));
			schedule.setPlaymode(Schedule.PlayMode_Daily);
			schedule.setStarttime(CommonUtil.parseDate("00:00:00", CommonConstants.DateFormat_Time));
			scheduleMapper.insertSelective(schedule);

			Scheduledtl scheduledtl = new Scheduledtl();
			scheduledtl.setScheduleid(schedule.getScheduleid());
			scheduledtl.setObjtype(Scheduledtl.ObjType_Bundle);
			scheduledtl.setObjid(bundle.getBundleid());
			scheduledtl.setSequence(1);
			scheduledtlMapper.insertSelective(scheduledtl);

			String bindtype = "" + bind.get("bindtype");
			if (bindtype.equals(Schedule.BindType_Device)) {
				deviceMapper.updateBundle("" + bind.get("bindid"), "" + bundle.getBundleid());
			} else if (bind.get("bindtype").equals(Schedule.BindType_Devicegroup)) {

			}
			// devicefileService.refreshDevicefiles("" + bind.get("bindtype"),
			// "" + bind.get("bindid"));
		}

		// Handle sync
		for (int i = 0; i < binds.length; i++) {
			HashMap<String, Object> bind = binds[i];
			scheduleService.syncSchedule("" + bind.get("bindtype"), "" + bind.get("bindid"));
		}
	}

	@Transactional
	public void handleWizard(Staff staff, Bundle bundle, HashMap<String, Object>[] binds) throws Exception {
		if (bundle.getName() == null || bundle.getName().equals("")) {
			bundle.setName("UNKNOWN");
		}
		List<Bundlezone> bundlezones = bundle.getBundlezones();

		// Handle bundle
		bundleMapper.insertSelective(bundle);
		if (bundle.getName().equals("UNKNOWN")) {
			bundle.setName("BUNDLE-" + bundle.getBundleid());
		}
		for (Bundlezone bundlezone : bundlezones) {
			bundlezone.setBundleid(bundle.getBundleid());
			if (bundle.getHomeflag().equals("0")) {
				bundlezone.setHomebundleid(bundle.getHomebundleid());
			} else {
				bundlezone.setHomebundleid(bundle.getBundleid());
			}
			bundlezone.setBundleid(bundle.getBundleid());
			bundlezoneMapper.insertSelective(bundlezone);
			for (Bundlezonedtl bundlezonedtl : bundlezone.getBundlezonedtls()) {
				bundlezonedtl.setBundlezoneid(bundlezone.getBundlezoneid());
				bundlezonedtlMapper.insertSelective(bundlezonedtl);
			}
		}

		String snapshotdtl = bundle.getSnapshotdtl();
		if (snapshotdtl.startsWith("data:image/jpeg;base64,")) {
			snapshotdtl = snapshotdtl.substring(23);
		}
		String snapshotFilePath = "/bundle/" + bundle.getBundleid() + "/snapshot/" + bundle.getBundleid() + ".jpg";
		File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
		bundle.setSnapshot(snapshotFilePath);
		bundleMapper.updateByPrimaryKeySelective(bundle);

		push(bundle, binds);
	}

	public void setBundleReviewWait(String bundleid) {
		Bundle bundle = bundleMapper.selectByPrimaryKey(bundleid);
		if (bundle != null && bundle.getHomebundleid() > 0) {
			bundle = bundleMapper.selectByPrimaryKey("" + bundle.getHomebundleid());
		}
		if (bundle != null) {
			if (bundle.getReviewflag().equals(Bundle.REVIEW_PASSED)) {
				JSONObject bundleJson = generateBundleJson("" + bundle.getBundleid());
				bundle.setJson(bundleJson.toString());
			}
			bundle.setReviewflag(Bundle.REVIEW_WAIT);
			bundleMapper.updateByPrimaryKeySelective(bundle);
			List<Bundle> subbundles = bundle.getSubbundles();
			if (subbundles != null) {
				for (Bundle b : subbundles) {
					if (b.getReviewflag().equals(Bundle.REVIEW_PASSED)) {
						JSONObject bundleJson = generateBundleJson("" + b.getBundleid());
						b.setJson(bundleJson.toString());
					}
					b.setReviewflag(Bundle.REVIEW_WAIT);
					bundleMapper.updateByPrimaryKeySelective(b);
				}
			}
		}
	}

	public void setBundleReviewResut(String bundleid, String reviewflag, String comment) throws Exception {
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

			if (reviewflag.equals(Bundle.REVIEW_PASSED)) {
				makeJsonFile("" + bundle.getBundleid());
			}
		}
	}

	public JSONObject generateBundleJson(String bundleid) {
		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		Bundle bundle = bundleMapper.selectByPrimaryKey(bundleid);

		if (!bundle.getReviewflag().equals(Bundle.REVIEW_PASSED) && bundle.getJson() != null) {
			return JSONObject.fromObject(bundle.getJson());
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
		JSONArray imageJsonArray = new JSONArray();
		JSONArray textJsonArray = new JSONArray();
		JSONArray streamJsonArray = new JSONArray();
		JSONArray widgetJsonArray = new JSONArray();
		JSONArray dvbJsonArray = new JSONArray();
		JSONArray rssJsonArray = new JSONArray();
		JSONArray audioJsonArray = new JSONArray();

		responseJson.put("layout_id", bundle.getTempletid());
		responseJson.put("width", bundle.getWidth());
		responseJson.put("height", bundle.getHeight());
		responseJson.put("bg_color", "#000000");
		JSONObject bundleBgImageJson = new JSONObject();
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
				imageJsonArray.add(bundleBgImageJson);
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
		responseJson.put("bg_image", bundleBgImageJson);

		List<Video> videoList = new ArrayList<Video>();
		List<Image> imageList = new ArrayList<Image>();
		JSONArray regionJsonArray = new JSONArray();
		for (Bundlezone bundlezone : bundle.getBundlezones()) {
			JSONObject regionJson = new JSONObject();
			if (bundlezone.getMainflag().equals("1")) {
				regionJson.put("region_id", 1);
			} else {
				regionJson.put("region_id", bundlezone.getBundlezoneid());
			}
			Byte type = 0;
			if (bundlezone.getType() == 1) {
				type = 0; // Play
			} else if (bundlezone.getType() == 2) {
				type = 0; // Web
			} else if (bundlezone.getType() == 3) {
				type = 1; // Text
			} else if (bundlezone.getType() == 4) {
				type = 1; // Scroll
			} else if (bundlezone.getType() == 5) {
				type = 2; // Time
			} else if (bundlezone.getType() == 6) {
				type = 3; // Weather
			} else if (bundlezone.getType() == 7) {
				type = 7; // Button
			} else if (bundlezone.getType() == 8) {
				type = 8; // Navigate
			} else if (bundlezone.getType() == 9) {
				type = 9; // Control
			} else if (bundlezone.getType() == 12) {
				type = 12; // RSS
			} else if (bundlezone.getType() == 13) {
				type = 13; // Audio
			} else if (bundlezone.getType() == 14) {
				type = 6; // Stream
			} else if (bundlezone.getType() == 15) {
				type = 4; // VideoIn
			} else if (bundlezone.getType() == 16) {
				type = 5; // DVB
			} else {
				type = bundlezone.getType();
			}
			regionJson.put("type", type);
			regionJson.put("main_flag", bundlezone.getMainflag());
			regionJson.put("width", bundlezone.getWidth());
			regionJson.put("height", bundlezone.getHeight());
			regionJson.put("top", bundlezone.getTopoffset());
			regionJson.put("left", bundlezone.getLeftoffset());
			regionJson.put("zindex", bundlezone.getZindex());
			String opacity = Integer.toHexString(bundlezone.getBgopacity());
			if (opacity.length() == 1) {
				opacity = "0" + opacity;
			}
			regionJson.put("bgcolor", "#" + opacity + bundlezone.getBgcolor().trim().substring(1));
			regionJson.put("sleep", bundlezone.getSleeptime());
			regionJson.put("interval", bundlezone.getIntervaltime());
			regionJson.put("animation", bundlezone.getAnimation());
			regionJson.put("fit_flag", Integer.parseInt(bundlezone.getFitflag()));
			if (bundlezone.getType() == Bundlezone.Type_SCROLL) {
				regionJson.put("direction", "left");
			} else {
				regionJson.put("direction", "none");
			}
			regionJson.put("speed", Integer.parseInt(bundlezone.getSpeed()));
			regionJson.put("color", "" + bundlezone.getColor());
			regionJson.put("size", bundlezone.getSize());
			if (bundlezone.getDateformat() == null) {
				regionJson.put("date_format", "yyyy-MM-dd");
			} else {
				regionJson.put("date_format", bundlezone.getDateformat());
			}
			regionJson.put("volume", bundlezone.getVolume());

			if (bundlezone.getType().equals(Bundlezone.Type_TOUCH)) {
				regionJson.put("touch_label", bundlezone.getTouchlabel());
				if (bundlezone.getTouchtype().equals("2")) {
					regionJson.put("touch_type", "2");
					regionJson.put("touch_bundle_id", bundlezone.getTouchobjid());
					regionJson.put("touch_apk", "");
				} else if (bundlezone.getTouchtype().equals("3") || bundlezone.getTouchtype().equals("4")
						|| bundlezone.getTouchtype().equals("5")) {
					regionJson.put("touch_type", "3");
					regionJson.put("touch_bundle_id", 0);
					regionJson.put("touch_apk", "");
				} else if (bundlezone.getTouchtype().equals("6")) {
					regionJson.put("touch_type", "4");
					regionJson.put("touch_bundle_id", 0);
					regionJson.put("touch_apk", bundlezone.getContent());
				} else {
					regionJson.put("touch_type", bundlezone.getTouchtype());
					regionJson.put("touch_bundle_id", 0);
					regionJson.put("touch_apk", "");
				}
			}

			JSONObject regionBgImageJson = new JSONObject();
			if (bundlezone.getBgimage() != null) {
				regionBgImageJson.put("id", bundlezone.getBgimageid());
				regionBgImageJson.put("name", bundlezone.getBgimage().getName());
				regionBgImageJson.put("url", "http://" + serverip + ":" + serverport + "/pixsigdata"
						+ bundlezone.getBgimage().getFilepath());
				regionBgImageJson.put("path", "/pixsigdata" + bundlezone.getBgimage().getFilepath());
				regionBgImageJson.put("file", bundlezone.getBgimage().getFilename());
				regionBgImageJson.put("size", bundlezone.getBgimage().getSize());
				regionBgImageJson.put("thumbnail", "http://" + serverip + ":" + serverport + "/pixsigdata"
						+ bundlezone.getBgimage().getThumbnail());
				if (imageHash.get(bundlezone.getBgimageid()) == null) {
					imageHash.put(bundlezone.getBgimageid(), regionBgImageJson);
					imageJsonArray.add(regionBgImageJson);
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
			regionJson.put("bg_image", regionBgImageJson);

			JSONArray playlistJsonArray = new JSONArray();

			type = bundlezone.getType();
			if (type == Bundlezone.Type_PLAY) {
				List<Bundlezonedtl> bundlezonedtls = bundlezone.getBundlezonedtls();
				for (Bundlezonedtl bundlezonedtl : bundlezonedtls) {
					if (bundlezonedtl.getVideo() != null) {
						Video video = bundlezonedtl.getVideo();
						JSONObject playlistJson = new JSONObject();
						playlistJson.put("type", "video");
						playlistJson.put("id", video.getVideoid());
						playlistJsonArray.add(playlistJson);
						if (videoHash.get(bundlezonedtl.getObjid()) == null) {
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
							videoJson.put("relate_type", "image");
							if (video.getRelateimage() != null) {
								videoJson.put("relate_id", video.getRelateid());
							} else {
								videoJson.put("relate_id", 0);
							}
							videoJson.put("tags", video.getTags());
							videoHash.put(video.getVideoid(), videoJson);
							videoJsonArray.add(videoJson);
							videoList.add(video);
						}
					} else if (bundlezonedtl.getImage() != null) {
						Image image = bundlezonedtl.getImage();
						JSONObject playlistJson = new JSONObject();
						playlistJson.put("type", "image");
						playlistJson.put("id", image.getImageid());
						playlistJsonArray.add(playlistJson);
						if (imageHash.get(bundlezonedtl.getObjid()) == null) {
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
							imageJson.put("relate_type", "image");
							if (image.getRelateimage() != null) {
								imageJson.put("relate_id", image.getRelateid());
							} else {
								imageJson.put("relate_id", 0);
							}
							imageHash.put(image.getImageid(), imageJson);
							imageJsonArray.add(imageJson);
							imageList.add(image);
						}
					}
				}
			} else if (type == Bundlezone.Type_WIDGET) {
				JSONObject playlistJson = new JSONObject();
				playlistJson.put("type", "widget");
				playlistJson.put("id", bundlezone.getBundlezoneid());
				playlistJsonArray.add(playlistJson);
				if (widgetHash.get(bundlezone.getBundlezoneid()) == null) {
					JSONObject widgetJson = new JSONObject();
					widgetJson.put("id", bundlezone.getBundlezoneid());
					widgetJson.put("url", bundlezone.getContent());
					widgetHash.put(bundlezone.getBundlezoneid(), widgetJson);
					widgetJsonArray.add(widgetJson);
				}
			} else if (type == Bundlezone.Type_TEXT || type == Bundlezone.Type_SCROLL) {
				JSONObject playlistJson = new JSONObject();
				playlistJson.put("type", "text");
				playlistJson.put("id", bundlezone.getBundlezoneid());
				playlistJsonArray.add(playlistJson);
				if (textHash.get(bundlezone.getBundlezoneid()) == null) {
					JSONObject textJson = new JSONObject();
					textJson.put("id", bundlezone.getBundlezoneid());
					textJson.put("text", bundlezone.getContent());
					textHash.put(bundlezone.getBundlezoneid(), textJson);
					textJsonArray.add(textJson);
				}
			} else if (type == Bundlezone.Type_RSS) {
				JSONObject playlistJson = new JSONObject();
				playlistJson.put("type", "rss");
				playlistJson.put("id", bundlezone.getBundlezoneid());
				playlistJsonArray.add(playlistJson);
				if (rssHash.get(bundlezone.getBundlezoneid()) == null) {
					JSONObject rssJson = new JSONObject();
					rssJson.put("id", bundlezone.getBundlezoneid());
					rssJson.put("url", bundlezone.getContent());
					rssHash.put(bundlezone.getBundlezoneid(), rssJson);
					rssJsonArray.add(rssJson);
				}
			} else if (type == Bundlezone.Type_STREAM) {
				List<Bundlezonedtl> bundlezonedtls = bundlezone.getBundlezonedtls();
				for (Bundlezonedtl bundlezonedtl : bundlezonedtls) {
					if (bundlezonedtl.getStream() != null) {
						Stream stream = bundlezonedtl.getStream();
						JSONObject playlistJson = new JSONObject();
						playlistJson.put("type", "stream");
						playlistJson.put("id", stream.getStreamid());
						playlistJsonArray.add(playlistJson);
						if (streamHash.get(bundlezonedtl.getObjid()) == null) {
							JSONObject streamJson = new JSONObject();
							streamJson.put("id", stream.getStreamid());
							streamJson.put("url", stream.getUrl());
							streamHash.put(stream.getStreamid(), streamJson);
							streamJsonArray.add(streamJson);
						}
					}
				}
			} else if (type == Bundlezone.Type_AUDIO) {
				List<Bundlezonedtl> bundlezonedtls = bundlezone.getBundlezonedtls();
				for (Bundlezonedtl bundlezonedtl : bundlezonedtls) {
					if (bundlezonedtl.getAudio() != null) {
						Audio audio = bundlezonedtl.getAudio();
						JSONObject playlistJson = new JSONObject();
						playlistJson.put("type", "audio");
						playlistJson.put("id", audio.getAudioid());
						playlistJsonArray.add(playlistJson);
						if (audioHash.get(bundlezonedtl.getObjid()) == null) {
							JSONObject audioJson = new JSONObject();
							audioJson.put("id", audio.getAudioid());
							audioJson.put("name", audio.getName());
							audioJson.put("url",
									"http://" + serverip + ":" + serverport + "/pixsigdata" + audio.getFilepath());
							audioJson.put("path", "/pixsigdata" + audio.getFilepath());
							audioJson.put("file", audio.getFilename());
							audioJson.put("size", audio.getSize());
							audioHash.put(audio.getAudioid(), audioJson);
							audioJsonArray.add(audioJson);
						}
					}
				}
			} else if (type == Bundlezone.Type_DVB) {
				List<Bundlezonedtl> bundlezonedtls = bundlezone.getBundlezonedtls();
				for (Bundlezonedtl bundlezonedtl : bundlezonedtls) {
					if (bundlezonedtl.getDvb() != null) {
						Dvb dvb = bundlezonedtl.getDvb();
						JSONObject playlistJson = new JSONObject();
						playlistJson.put("type", "dvb");
						playlistJson.put("id", dvb.getDvbid());
						playlistJsonArray.add(playlistJson);
						if (dvbHash.get(dvb.getDvbid()) == null) {
							JSONObject dvbJson = new JSONObject();
							dvbJson.put("id", dvb.getDvbid());
							dvbJson.put("number", dvb.getNumber());
							dvbHash.put(dvb.getDvbid(), dvbJson);
							dvbJsonArray.add(dvbJson);
						}
					}
				}
			} else if (type == Bundlezone.Type_TOUCH) {
				if (bundlezone.getTouchtype().equals("3")) {
					Video video = videoMapper.selectByPrimaryKey("" + bundlezone.getTouchobjid());
					if (video != null) {
						JSONObject playlistJson = new JSONObject();
						playlistJson.put("type", "video");
						playlistJson.put("id", video.getVideoid());
						playlistJsonArray.add(playlistJson);
						if (videoHash.get(video.getVideoid()) == null) {
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
							videoJson.put("relate_type", "image");
							if (video.getRelateimage() != null) {
								videoJson.put("relate_id", video.getRelateid());
							} else {
								videoJson.put("relate_id", 0);
							}
							videoJson.put("tags", video.getTags());
							videoHash.put(video.getVideoid(), videoJson);
							videoJsonArray.add(videoJson);
							videoList.add(video);
						}
					}
				} else if (bundlezone.getTouchtype().equals("4")) {
					Image image = imageMapper.selectByPrimaryKey("" + bundlezone.getTouchobjid());
					if (image != null) {
						JSONObject playlistJson = new JSONObject();
						playlistJson.put("type", "image");
						playlistJson.put("id", image.getImageid());
						playlistJsonArray.add(playlistJson);
						if (imageHash.get(image.getImageid()) == null) {
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
							imageJson.put("relate_type", "image");
							if (image.getRelateimage() != null) {
								imageJson.put("relate_id", image.getRelateid());
							} else {
								imageJson.put("relate_id", 0);
							}
							imageHash.put(image.getImageid(), imageJson);
							imageJsonArray.add(imageJson);
							imageList.add(image);
						}
					}
				} else if (bundlezone.getTouchtype().equals("5")) {
					JSONObject playlistJson = new JSONObject();
					playlistJson.put("type", "widget");
					playlistJson.put("id", bundlezone.getBundlezoneid());
					playlistJsonArray.add(playlistJson);
					if (widgetHash.get(bundlezone.getBundlezoneid()) == null) {
						JSONObject widgetJson = new JSONObject();
						widgetJson.put("id", bundlezone.getBundlezoneid());
						widgetJson.put("url", bundlezone.getContent());
						widgetHash.put(bundlezone.getBundlezoneid(), widgetJson);
						widgetJsonArray.add(widgetJson);
					}
				}
			}
			regionJson.put("playlist", playlistJsonArray);
			regionJsonArray.add(regionJson);
		}
		responseJson.put("regions", regionJsonArray);

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
				imageJson.put("relate_type", "image");
				imageJson.put("relate_id", 0);
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
				imageJson.put("relate_type", "image");
				imageJson.put("relate_id", 0);
				imageHash.put(image.getRelateid(), imageJson);
				imageJsonArray.add(imageJson);
			}
		}
		responseJson.put("videos", videoJsonArray);
		responseJson.put("images", imageJsonArray);
		responseJson.put("texts", textJsonArray);
		responseJson.put("streams", streamJsonArray);
		responseJson.put("widgets", widgetJsonArray);
		responseJson.put("dvbs", dvbJsonArray);
		responseJson.put("rsses", rssJsonArray);
		responseJson.put("audios", audioJsonArray);

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
				bundleJSONArray.add(bundleJson);
				bundleHash.put(bundleid, bundleJson);
			}
			List<Bundle> subbundles = bundleMapper.selectSubList("" + bundleid);
			for (Bundle subbundle : subbundles) {
				if (bundleHash.get(subbundle.getBundleid()) == null) {
					JSONObject bundleJson = generateBundleJson("" + subbundle.getBundleid());
					bundleJSONArray.add(bundleJson);
					bundleHash.put(subbundle.getBundleid(), bundleJson);
				}
			}
		}
		return bundleJSONArray;
	}

	@Transactional
	public Bundle importZip(Integer orgid, Integer branchid, File zipFile) throws Exception {
		String fileName = zipFile.getName();
		logger.info("Begin to import bundle {}", fileName);
		fileName = fileName.substring(0, fileName.lastIndexOf("."));
		String unzipFilePath = CommonConfig.CONFIG_PIXDATA_HOME + "/import/" + fileName;
		FileUtils.deleteQuietly(new File(unzipFilePath));
		CommonUtil.unzip(zipFile, unzipFilePath, false);
		FileUtils.forceDelete(zipFile);

		HashMap<Integer, Bundle> bundleHash = new HashMap<Integer, Bundle>();
		HashMap<Integer, Video> videoHash = new HashMap<Integer, Video>();
		HashMap<Integer, Image> imageHash = new HashMap<Integer, Image>();
		List<Image> imageList = new ArrayList<Image>();
		List<Video> videoList = new ArrayList<Video>();

		Date now = Calendar.getInstance().getTime();
		File indexJsf = new File(unzipFilePath, "index.jsf");
		logger.info("parse {}", indexJsf.getAbsoluteFile());
		JSONObject bundleJson = JSONObject.fromObject(FileUtils.readFileToString(indexJsf, "UTF-8"));
		Map<String, Class> map = new HashMap<String, Class>();
		map.put("subbundles", Bundle.class);
		map.put("bundlezones", Bundlezone.class);
		map.put("bundlezonedtls", Bundlezonedtl.class);
		Bundle bundle = (Bundle) JSONObject.toBean(bundleJson, Bundle.class, map);
		Integer fromBundleid = bundle.getBundleid();
		bundle.setOrgid(orgid);
		bundle.setBranchid(branchid);
		bundle.setCreatetime(now);
		Bundle oldBundle = bundleMapper.selectByUuid("" + orgid, bundle.getUuid());
		if (oldBundle != null) {
			bundleMapper.clearSubbundles("" + oldBundle.getBundleid());
			bundleMapper.clearBundlezones("" + oldBundle.getBundleid());
			bundle.setBundleid(oldBundle.getBundleid());
			bundleMapper.updateByPrimaryKeySelective(bundle);
		} else {
			bundleMapper.insertSelective(bundle);
		}
		File fromSnapshotFile = new File(unzipFilePath, "index.jpg");
		if (fromSnapshotFile.exists()) {
			String snapshotFilePath = "/bundle/" + bundle.getBundleid() + "/snapshot/" + bundle.getBundleid() + ".jpg";
			File toSnapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
			bundle.setSnapshot(snapshotFilePath);
			FileUtils.copyFile(fromSnapshotFile, toSnapshotFile);
			bundleMapper.updateByPrimaryKeySelective(bundle);
		}
		bundleHash.put(fromBundleid, bundle);
		logger.info("Add bundle oldid={}, newid={}", fromBundleid, bundle.getBundleid());

		for (Bundle subbundle : bundle.getSubbundles()) {
			File jsf = new File(unzipFilePath, "" + subbundle.getBundleid() + ".jsf");
			logger.info("parse {}", jsf.getAbsoluteFile());
			JSONObject json = JSONObject.fromObject(FileUtils.readFileToString(jsf, "UTF-8"));
			Bundle p = (Bundle) JSONObject.toBean(json, Bundle.class, map);
			fromBundleid = p.getBundleid();
			p.setOrgid(orgid);
			p.setBranchid(branchid);
			p.setHomebundleid(bundle.getBundleid());
			p.setCreatetime(now);
			bundleMapper.insertSelective(p);
			fromSnapshotFile = new File(unzipFilePath, "" + fromBundleid + ".jpg");
			if (fromSnapshotFile.exists()) {
				String snapshotFilePath = "/bundle/" + p.getBundleid() + "/snapshot/" + p.getBundleid() + ".jpg";
				p.setSnapshot(snapshotFilePath);
				File toSnapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				FileUtils.copyFile(fromSnapshotFile, toSnapshotFile);
				bundleMapper.updateByPrimaryKeySelective(p);
			}
			bundleHash.put(fromBundleid, p);
			logger.info("Add subbundle oldid={}, newid={}", fromBundleid, p.getBundleid());
		}

		Iterator<Entry<Integer, Bundle>> bundleIter = bundleHash.entrySet().iterator();
		while (bundleIter.hasNext()) {
			Entry<Integer, Bundle> entry = bundleIter.next();
			Bundle t = entry.getValue();
			for (Bundlezone bundlezone : t.getBundlezones()) {
				for (Bundlezonedtl bundlezonedtl : bundlezone.getBundlezonedtls()) {
					Image image = bundlezonedtl.getImage();
					Video video = bundlezonedtl.getVideo();
					Image relateImage = null;
					if (image != null && image.getRelateimage() != null) {
						relateImage = image.getRelateimage();
					}
					if (video != null && video.getRelateimage() != null) {
						relateImage = video.getRelateimage();
					}

					// Handle relate image
					if (relateImage != null && imageHash.get(relateImage.getImageid()) == null) {
						Integer fromImageid = relateImage.getImageid();
						Image toImage = imageMapper.selectByUuid(relateImage.getUuid());
						if (toImage == null) {
							// Insert image
							File fromFile = new File(unzipFilePath + "/image", relateImage.getFilename());
							toImage = new Image();
							toImage.setUuid(relateImage.getUuid());
							toImage.setOrgid(1);
							toImage.setBranchid(1);
							toImage.setFolderid(1);
							toImage.setName(relateImage.getName());
							toImage.setFilename(relateImage.getFilename());
							toImage.setStatus("9");
							toImage.setObjtype("0");
							toImage.setObjid(0);
							toImage.setRelateid(0);
							toImage.setCreatestaffid(1);
							imageMapper.insertSelective(toImage);
							String newFileName = "" + toImage.getImageid() + "."
									+ FilenameUtils.getExtension(fromFile.getName());
							String imageFilePath, thumbFilePath;
							imageFilePath = "/image/upload/" + newFileName;
							thumbFilePath = "/image/thumb/" + newFileName;
							File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + imageFilePath);
							File thumbFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + thumbFilePath);
							if (imageFile.exists()) {
								imageFile.delete();
							}
							if (thumbFile.exists()) {
								thumbFile.delete();
							}
							FileUtils.copyFile(fromFile, imageFile);
							CommonUtil.resizeImage(imageFile, thumbFile, 640);

							BufferedImage img = ImageIO.read(imageFile);
							toImage.setWidth(img.getWidth());
							toImage.setHeight(img.getHeight());
							toImage.setFilepath(imageFilePath);
							toImage.setThumbnail(thumbFilePath);
							toImage.setFilename(newFileName);
							toImage.setSize(FileUtils.sizeOf(imageFile));
							FileInputStream fis = new FileInputStream(imageFile);
							toImage.setMd5(DigestUtils.md5Hex(fis));
							fis.close();
							toImage.setStatus("1");
							imageMapper.updateByPrimaryKeySelective(toImage);
							imageList.add(toImage);
							logger.info("Add image oldid={}, newid={}", fromImageid, toImage.getImageid());
						}
						imageHash.put(fromImageid, toImage);
					}

					if (image != null) {
						Integer fromImageid = image.getImageid();
						Image toImage = imageMapper.selectByUuid(image.getUuid());
						if (toImage == null) {
							// Insert image
							File fromFile = new File(unzipFilePath + "/image", image.getFilename());
							toImage = new Image();
							toImage.setUuid(image.getUuid());
							toImage.setOrgid(1);
							toImage.setBranchid(1);
							toImage.setFolderid(1);
							toImage.setName(image.getName());
							toImage.setFilename(image.getFilename());
							toImage.setStatus("9");
							toImage.setObjtype("0");
							toImage.setObjid(0);
							toImage.setRelateid(image.getRelateid());
							toImage.setCreatestaffid(1);
							imageMapper.insertSelective(toImage);
							String newFileName = "" + toImage.getImageid() + "."
									+ FilenameUtils.getExtension(fromFile.getName());
							String imageFilePath, thumbFilePath;
							imageFilePath = "/image/upload/" + newFileName;
							thumbFilePath = "/image/thumb/" + newFileName;
							File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + imageFilePath);
							File thumbFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + thumbFilePath);
							if (imageFile.exists()) {
								imageFile.delete();
							}
							if (thumbFile.exists()) {
								thumbFile.delete();
							}
							FileUtils.copyFile(fromFile, imageFile);
							CommonUtil.resizeImage(imageFile, thumbFile, 640);

							BufferedImage img = ImageIO.read(imageFile);
							toImage.setWidth(img.getWidth());
							toImage.setHeight(img.getHeight());
							toImage.setFilepath(imageFilePath);
							toImage.setThumbnail(thumbFilePath);
							toImage.setFilename(newFileName);
							toImage.setSize(FileUtils.sizeOf(imageFile));
							FileInputStream fis = new FileInputStream(imageFile);
							toImage.setMd5(DigestUtils.md5Hex(fis));
							fis.close();
							toImage.setStatus("1");
							imageMapper.updateByPrimaryKeySelective(toImage);
							logger.info("Add image oldid={}, newid={}", fromImageid, toImage.getImageid());
						} else {
							toImage.setRelateid(image.getRelateid());
						}
						imageList.add(toImage);
						imageHash.put(fromImageid, toImage);
					}

					if (video != null) {
						Integer fromVideoid = video.getVideoid();
						Video toVideo = videoMapper.selectByUuid(video.getUuid());
						if (toVideo == null) {
							// Insert video
							File fromFile = new File(unzipFilePath + "/video", video.getFilename());
							toVideo = new Video();
							toVideo.setUuid(video.getUuid());
							toVideo.setOrgid(1);
							toVideo.setBranchid(1);
							toVideo.setFolderid(1);
							toVideo.setType(Video.TYPE_INTERNAL);
							toVideo.setName(video.getName());
							toVideo.setOname(video.getOname());
							toVideo.setFilename(video.getFilename());
							toVideo.setFormat(video.getFormat());
							toVideo.setSize(video.getSize());
							toVideo.setMd5(video.getMd5());
							toVideo.setRelateid(video.getRelateid());
							toVideo.setStatus("9");
							toVideo.setCreatestaffid(1);
							videoMapper.insertSelective(toVideo);
							String newFileName = "" + toVideo.getVideoid() + "."
									+ FilenameUtils.getExtension(fromFile.getName());
							String videoFilePath, thumbFilePath;
							videoFilePath = "/video/upload/" + newFileName;
							thumbFilePath = "/video/snapshot/" + toVideo.getVideoid() + ".jpg";
							File videoFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + videoFilePath);
							File thumbFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + thumbFilePath);
							if (videoFile.exists()) {
								videoFile.delete();
							}
							if (thumbFile.exists()) {
								thumbFile.delete();
							}
							FileUtils.moveFile(fromFile, videoFile);

							try {
								// Generate preview gif
								FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/snapshot"));
								String command = CommonConfig.CONFIG_FFMPEG_CMD + " -i "
										+ CommonConfig.CONFIG_PIXDATA_HOME + videoFilePath
										+ " -y -f image2 -ss 5 -vframes 1 " + CommonConfig.CONFIG_PIXDATA_HOME
										+ thumbFilePath;
								logger.info("Begin to generate preview and thumbnail: " + command);
								CommonUtil.execCommand(command);
								if (!thumbFile.exists()) {
									command = CommonConfig.CONFIG_FFMPEG_CMD + " -i " + CommonConfig.CONFIG_PIXDATA_HOME
											+ videoFilePath + " -y -f image2 -ss 1 -vframes 1 "
											+ CommonConfig.CONFIG_PIXDATA_HOME + thumbFilePath;
									CommonUtil.execCommand(command);
								}
								if (thumbFile.exists()) {
									BufferedImage img = ImageIO.read(thumbFile);
									toVideo.setWidth(img.getWidth());
									toVideo.setHeight(img.getHeight());
									toVideo.setThumbnail("/video/snapshot/" + toVideo.getVideoid() + ".jpg");
									logger.info("Finish thumbnail generating.");
								} else {
									logger.info("Failed to generate thumbnail.");
								}

							} catch (IOException ex) {
								logger.info("Video parse error, file={}", videoFilePath, ex);
							}

							toVideo.setFilename(newFileName);
							toVideo.setFilepath(videoFilePath);
							toVideo.setThumbnail(thumbFilePath);
							toVideo.setFilename(newFileName);
							toVideo.setStatus("1");
							videoMapper.updateByPrimaryKeySelective(toVideo);
							logger.info("Add video oldid={}, newid={}", fromVideoid, toVideo.getVideoid());
						} else {
							toVideo.setRelateid(video.getRelateid());
						}
						videoList.add(toVideo);
						videoHash.put(fromVideoid, toVideo);
					}

				}
			}
		}

		for (Image image : imageList) {
			if (image.getRelateid() > 0) {
				image.setRelateid(imageHash.get(image.getRelateid()).getImageid());
				imageMapper.updateByPrimaryKeySelective(image);
			}
		}
		for (Video video : videoList) {
			if (video.getRelateid() > 0) {
				video.setRelateid(imageHash.get(video.getRelateid()).getImageid());
				videoMapper.updateByPrimaryKeySelective(video);
			}
		}

		bundleIter = bundleHash.entrySet().iterator();
		while (bundleIter.hasNext()) {
			Entry<Integer, Bundle> entry = bundleIter.next();
			Bundle t = entry.getValue();
			for (Bundlezone bundlezone : t.getBundlezones()) {
				bundlezone.setBundleid(bundleHash.get(bundlezone.getBundleid()).getBundleid());
				bundlezone.setHomebundleid(bundle.getBundleid());
				Bundle touchBundle = bundleHash.get(bundlezone.getTouchobjid());
				if (touchBundle != null) {
					bundlezone.setTouchobjid(touchBundle.getBundleid());
				} else {
					bundlezone.setTouchobjid(0);
				}
				bundlezoneMapper.insertSelective(bundlezone);
				for (Bundlezonedtl bundlezonedtl : bundlezone.getBundlezonedtls()) {
					if (bundlezonedtl.getObjtype().equals(Bundlezonedtl.ObjType_Video)) {
						bundlezonedtl.setBundlezoneid(bundlezone.getBundlezoneid());
						bundlezonedtl.setObjid(videoHash.get(bundlezonedtl.getObjid()).getVideoid());
						bundlezonedtlMapper.insertSelective(bundlezonedtl);
					} else if (bundlezonedtl.getObjtype().equals(Bundlezonedtl.ObjType_Image)) {
						bundlezonedtl.setBundlezoneid(bundlezone.getBundlezoneid());
						bundlezonedtl.setObjid(imageHash.get(bundlezonedtl.getObjid()).getImageid());
						bundlezonedtlMapper.insertSelective(bundlezonedtl);
					}
				}
			}
		}

		return bundle;
	}

}
