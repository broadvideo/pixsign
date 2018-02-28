package com.broadvideo.pixsignage.service;

import java.io.File;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.UUID;
import java.util.Vector;

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
import com.broadvideo.pixsignage.persistence.ImageMapper;
import com.broadvideo.pixsignage.persistence.ScheduleMapper;
import com.broadvideo.pixsignage.persistence.ScheduledtlMapper;
import com.broadvideo.pixsignage.persistence.TempletMapper;
import com.broadvideo.pixsignage.persistence.VideoMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

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
				subbundle.setUpdatetime(bundle.getUpdatetime());
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
						+ ".png";
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
		if (snapshotdtl.startsWith("data:image/png;base64,")) {
			snapshotdtl = snapshotdtl.substring(22);
		}
		String snapshotFilePath = "/bundle/" + bundle.getBundleid() + "/snapshot/" + bundle.getBundleid() + ".png";
		File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
		bundle.setSnapshot(snapshotFilePath);
		bundle.setUpdatetime(Calendar.getInstance().getTime());
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
					+ "/snapshot/" + sourcebundleid + ".png");
			if (fromSnapshotFile.exists()) {
				String snapshotFilePath = "/bundle/" + destbundleidList[i] + "/snapshot/" + destbundleidList[i]
						+ ".png";
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

			devicefileService.refreshDevicefiles("" + bind.get("bindtype"), "" + bind.get("bindid"));
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
		if (snapshotdtl.startsWith("data:image/png;base64,")) {
			snapshotdtl = snapshotdtl.substring(22);
		}
		String snapshotFilePath = "/bundle/" + bundle.getBundleid() + "/snapshot/" + bundle.getBundleid() + ".png";
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
		for (Bundlezone bundlezone : bundle.getBundlezones()) {
			JSONObject regionJson = new JSONObject();
			regionJsonArray.put(regionJson);
			if (bundlezone.getMainflag().equals("1")) {
				regionJson.put("region_id", 1);
			} else {
				regionJson.put("region_id", bundlezone.getBundlezoneid());
			}
			regionJson.put("type", bundlezone.getType());
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
			regionJson.put("bg_image", regionBgImageJson);
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

			byte type = bundlezone.getType();
			if (type == Bundlezone.Type_PLAY) {
				List<Bundlezonedtl> bundlezonedtls = bundlezone.getBundlezonedtls();
				for (Bundlezonedtl bundlezonedtl : bundlezonedtls) {
					if (bundlezonedtl.getVideo() != null) {
						Video video = bundlezonedtl.getVideo();
						playlistJsonArray.put(new JSONObject().put("type", "video").put("id", video.getVideoid()));
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
					} else if (bundlezonedtl.getImage() != null) {
						Image image = bundlezonedtl.getImage();
						playlistJsonArray.put(new JSONObject().put("type", "image").put("id", image.getImageid()));
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
							if (image.getRelate() != null) {
								imageJson.put("relate_id", image.getRelateid());
							} else {
								imageJson.put("relate_id", 0);
							}
							imageHash.put(image.getImageid(), imageJson);
							imageJsonArray.put(imageJson);
							imageList.add(image);
						}
					}
				}
			} else if (type == Bundlezone.Type_WIDGET) {
				playlistJsonArray.put(new JSONObject().put("type", "widget").put("id", bundlezone.getBundlezoneid()));
				if (widgetHash.get(bundlezone.getBundlezoneid()) == null) {
					JSONObject widgetJson = new JSONObject();
					widgetJson.put("id", bundlezone.getBundlezoneid());
					widgetJson.put("url", bundlezone.getContent());
					widgetHash.put(bundlezone.getBundlezoneid(), widgetJson);
					widgetJsonArray.put(widgetJson);
				}
			} else if (type == Bundlezone.Type_TEXT || type == Bundlezone.Type_SCROLL) {
				playlistJsonArray.put(new JSONObject().put("type", "text").put("id", bundlezone.getBundlezoneid()));
				if (textHash.get(bundlezone.getBundlezoneid()) == null) {
					JSONObject textJson = new JSONObject();
					textJson.put("id", bundlezone.getBundlezoneid());
					textJson.put("text", bundlezone.getContent());
					textHash.put(bundlezone.getBundlezoneid(), textJson);
					textJsonArray.put(textJson);
				}
			} else if (type == Bundlezone.Type_RSS) {
				playlistJsonArray.put(new JSONObject().put("type", "rss").put("id", bundlezone.getBundlezoneid()));
				if (rssHash.get(bundlezone.getBundlezoneid()) == null) {
					JSONObject rssJson = new JSONObject();
					rssJson.put("id", bundlezone.getBundlezoneid());
					rssJson.put("url", bundlezone.getContent());
					rssHash.put(bundlezone.getBundlezoneid(), rssJson);
					rssJsonArray.put(rssJson);
				}
			} else if (type == Bundlezone.Type_STREAM) {
				List<Bundlezonedtl> bundlezonedtls = bundlezone.getBundlezonedtls();
				for (Bundlezonedtl bundlezonedtl : bundlezonedtls) {
					if (bundlezonedtl.getStream() != null) {
						Stream stream = bundlezonedtl.getStream();
						playlistJsonArray.put(new JSONObject().put("type", "stream").put("id", stream.getStreamid()));
						if (streamHash.get(bundlezonedtl.getObjid()) == null) {
							JSONObject streamJson = new JSONObject();
							streamJson.put("id", stream.getStreamid());
							streamJson.put("url", stream.getUrl());
							streamHash.put(stream.getStreamid(), streamJson);
							streamJsonArray.put(streamJson);
						}
					}
				}
			} else if (type == Bundlezone.Type_AUDIO) {
				List<Bundlezonedtl> bundlezonedtls = bundlezone.getBundlezonedtls();
				for (Bundlezonedtl bundlezonedtl : bundlezonedtls) {
					if (bundlezonedtl.getAudio() != null) {
						Audio audio = bundlezonedtl.getAudio();
						playlistJsonArray.put(new JSONObject().put("type", "audio").put("id", audio.getAudioid()));
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
							audioJsonArray.put(audioJson);
						}
					}
				}
			} else if (type == Bundlezone.Type_DVB) {
				List<Bundlezonedtl> bundlezonedtls = bundlezone.getBundlezonedtls();
				for (Bundlezonedtl bundlezonedtl : bundlezonedtls) {
					if (bundlezonedtl.getDvb() != null) {
						Dvb dvb = bundlezonedtl.getDvb();
						playlistJsonArray.put(new JSONObject().put("type", "dvb").put("id", dvb.getDvbid()));
						if (dvbHash.get(dvb.getDvbid()) == null) {
							JSONObject dvbJson = new JSONObject();
							dvbJson.put("id", dvb.getDvbid());
							dvbJson.put("number", dvb.getNumber());
							dvbHash.put(dvb.getDvbid(), dvbJson);
							dvbJsonArray.put(dvbJson);
						}
					}
				}
			} else if (type == Bundlezone.Type_TOUCH) {
				if (bundlezone.getTouchtype().equals("3")) {
					Video video = videoMapper.selectByPrimaryKey("" + bundlezone.getTouchobjid());
					if (video != null) {
						playlistJsonArray.put(new JSONObject().put("type", "video").put("id", video.getVideoid()));
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
					}
				} else if (bundlezone.getTouchtype().equals("4")) {
					Image image = imageMapper.selectByPrimaryKey("" + bundlezone.getTouchobjid());
					if (image != null) {
						playlistJsonArray.put(new JSONObject().put("type", "image").put("id", image.getImageid()));
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
							if (image.getRelate() != null) {
								imageJson.put("relate_id", image.getRelateid());
							} else {
								imageJson.put("relate_id", 0);
							}
							imageHash.put(image.getImageid(), imageJson);
							imageJsonArray.put(imageJson);
							imageList.add(image);
						}
					}
				} else if (bundlezone.getTouchtype().equals("5")) {
					playlistJsonArray
							.put(new JSONObject().put("type", "widget").put("id", bundlezone.getBundlezoneid()));
					if (widgetHash.get(bundlezone.getBundlezoneid()) == null) {
						JSONObject widgetJson = new JSONObject();
						widgetJson.put("id", bundlezone.getBundlezoneid());
						widgetJson.put("url", bundlezone.getContent());
						widgetHash.put(bundlezone.getBundlezoneid(), widgetJson);
						widgetJsonArray.put(widgetJson);
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
