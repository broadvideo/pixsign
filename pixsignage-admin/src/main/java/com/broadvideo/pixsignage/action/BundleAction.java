package com.broadvideo.pixsignage.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Bundle;
import com.broadvideo.pixsignage.domain.Bundleschedule;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.service.BundleService;
import com.broadvideo.pixsignage.service.ImageService;
import com.broadvideo.pixsignage.service.VideoService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("bundleAction")
public class BundleAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Bundle bundle;
	private Device[] devices;
	private Devicegroup[] devicegroups;
	private Bundleschedule[] bundleschedules;

	private String exportname;
	private InputStream inputStream;

	@Autowired
	private BundleService bundleService;
	@Autowired
	private VideoService videoService;
	@Autowired
	private ImageService imageService;

	public String doGet() {
		try {
			String bundleid = getParameter("bundleid");
			bundle = bundleService.selectByPrimaryKey(bundleid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("OrgAction doGet exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}
			String reviewflag = getParameter("reviewflag");
			String touchflag = getParameter("touchflag");
			String homeflag = getParameter("homeflag");

			int count = bundleService.selectCount("" + getLoginStaff().getOrgid(), branchid, reviewflag, touchflag,
					homeflag, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Bundle> bundleList = bundleService.selectList("" + getLoginStaff().getOrgid(), branchid, reviewflag,
					touchflag, homeflag, search, start, length);
			for (int i = 0; i < bundleList.size(); i++) {
				aaData.add(bundleList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			bundle.setOrgid(getLoginStaff().getOrgid());
			bundle.setBranchid(getLoginStaff().getBranchid());
			bundle.setCreatestaffid(getLoginStaff().getStaffid());
			if (getLoginStaff().getOrg().getReviewflag().equals(Org.FUNCTION_ENABLED)) {
				if (bundle.getHomebundleid() != null && bundle.getHomebundleid() > 0) {
					bundleService.setBundleReviewWait("" + bundle.getHomebundleid());
				}
				bundle.setReviewflag(Bundle.REVIEW_WAIT);
			} else {
				bundle.setReviewflag(Bundle.REVIEW_PASSED);
			}
			bundleService.addBundle(bundle);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			bundleService.updateBundle(bundle);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			bundleService.deleteBundle("" + bundle.getBundleid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doSync() {
		try {
			String bundleid = getParameter("bundleid");
			bundleService.syncBundle(bundleid);
			logger.info("Bundle sync success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doSync exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doReview() {
		try {
			bundleService.setBundleReviewResut("" + bundle.getBundleid(), bundle.getReviewflag(), bundle.getComment());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doReview exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDesign() {
		try {
			if (getLoginStaff().getOrg().getReviewflag().equals(Org.FUNCTION_ENABLED)) {
				bundleService.setBundleReviewWait("" + bundle.getBundleid());
				bundle.setReviewflag(null);
				bundle.setJson(null);
			}
			bundle.setCreatestaffid(getLoginStaff().getStaffid());
			bundleService.design(bundle);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doDesign exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doPush() {
		try {
			bundleService.push(bundle, devices, devicegroups);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doSchedule exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doWizard() {
		try {
			bundle.setOrgid(getLoginStaff().getOrgid());
			bundle.setBranchid(getLoginStaff().getBranchid());
			bundle.setCreatestaffid(getLoginStaff().getStaffid());
			bundleService.handleWizard(getLoginStaff(), bundle, devices, devicegroups);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doWizard exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doBundleschedulesAdd() {
		try {
			bundleService.addBundleschedules(bundleschedules);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("BundleAction doBundleschedulesAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doExport() {
		try {
			String bundleid = getParameter("bundleid");
			String exportDir = "/pixdata/pixsignage/export/bundle/" + bundleid;
			exportname = "bundle.zip";
			FileUtils.forceMkdir(new File(exportDir));

			JSONObject bundleJson = bundleService.generateBundleJson(bundleid);
			JSONObject bundleScheduleJson = new JSONObject();
			JSONArray bundleJsonArray = new JSONArray();
			bundleScheduleJson.put("bundles", bundleJsonArray);
			bundleJsonArray.put(bundleJson);
			JSONArray scheduleJsonArray = new JSONArray();
			bundleScheduleJson.put("bundle_schedules", scheduleJsonArray);
			JSONObject scheduleJson = new JSONObject();
			scheduleJson.put("bundle_id", Integer.parseInt(bundleid));
			scheduleJson.put("playmode", "daily");
			scheduleJson.put("start_time", "00:00:00");
			scheduleJsonArray.put(scheduleJson);

			File bundleFile = new File(exportDir, "bundle.jsf");
			File bundleScheduleFile = new File(exportDir, "bundle-schedule.jsf");
			File zipFile = new File(exportDir, "bundle.zip");

			boolean exists = false;
			if (bundleFile.exists() && zipFile.exists()) {
				String bundleStr = FileUtils.readFileToString(bundleFile, "UTF-8");
				if (bundleStr.equals(bundleJson.toString())) {
					exists = true;
				}
			}

			if (!exists) {
				FileUtils.writeStringToFile(bundleFile, bundleJson.toString(), "UTF-8", false);
				FileUtils.writeStringToFile(bundleScheduleFile, bundleScheduleJson.toString(), "UTF-8", false);

				JSONArray videoJsonArray = bundleJson.getJSONArray("videos");
				JSONArray imageJsonArray = bundleJson.getJSONArray("images");

				if (zipFile.exists()) {
					zipFile.delete();
				}
				ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFile));
				zip(out, bundleFile, "bundle.jsf");
				zip(out, bundleScheduleFile, "bundle-schedule.jsf");
				out.putNextEntry(new ZipEntry("video/"));
				for (int i = 0; i < videoJsonArray.length(); i++) {
					JSONObject videoJson = videoJsonArray.getJSONObject(i);
					logger.info("videoJson: " + videoJson.toString());
					String videoid = "" + videoJson.getInt("id");
					logger.info("videoid: " + videoid);
					Video video = videoService.selectByPrimaryKey(videoid);
					File videoFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + video.getFilepath());
					zip(out, videoFile, "video/" + video.getFilename());
				}
				out.putNextEntry(new ZipEntry("image/"));
				for (int i = 0; i < imageJsonArray.length(); i++) {
					JSONObject imageJson = imageJsonArray.getJSONObject(i);
					String imageid = "" + imageJson.getInt("id");
					Image image = imageService.selectByPrimaryKey(imageid);
					File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + image.getFilepath());
					zip(out, imageFile, "image/" + image.getFilename());
				}
				out.close();
			}

			inputStream = new FileInputStream(zipFile);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doExport exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	private void zip(ZipOutputStream out, File f, String base) throws Exception {
		if (f.isDirectory()) {
			File[] fl = f.listFiles();
			if (fl.length == 0) {
				out.putNextEntry(new ZipEntry(base + "/")); // 创建zip压缩进入点base
			}
			for (int i = 0; i < fl.length; i++) {
				if (base.equals("")) {
					zip(out, fl[i], fl[i].getName()); // 递归遍历子文件夹
				} else {
					zip(out, fl[i], base + "/" + fl[i].getName()); // 递归遍历子文件夹
				}
			}
		} else {
			out.putNextEntry(new ZipEntry(base)); // 创建zip压缩进入点base
			FileInputStream in = new FileInputStream(f);
			byte[] b = new byte[1000];
			int len = -1;
			while ((len = in.read(b)) != -1) {
				out.write(b, 0, len);
			}
			in.close();
		}
	}

	public Bundle getBundle() {
		return bundle;
	}

	public void setBundle(Bundle bundle) {
		this.bundle = bundle;
	}

	public Device[] getDevices() {
		return devices;
	}

	public void setDevices(Device[] devices) {
		this.devices = devices;
	}

	public Devicegroup[] getDevicegroups() {
		return devicegroups;
	}

	public void setDevicegroups(Devicegroup[] devicegroups) {
		this.devicegroups = devicegroups;
	}

	public Bundleschedule[] getBundleschedules() {
		return bundleschedules;
	}

	public void setBundleschedules(Bundleschedule[] bundleschedules) {
		this.bundleschedules = bundleschedules;
	}

	public String getExportname() {
		return exportname;
	}

	public void setExportname(String exportname) {
		this.exportname = exportname;
	}

	public InputStream getInputStream() {
		return inputStream;
	}

	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}

}
