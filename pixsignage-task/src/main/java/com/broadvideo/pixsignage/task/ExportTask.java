package com.broadvideo.pixsignage.task;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Bundle;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.domain.Pagezone;
import com.broadvideo.pixsignage.domain.Pagezonedtl;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.service.BundleService;
import com.broadvideo.pixsignage.service.ImageService;
import com.broadvideo.pixsignage.service.PageService;
import com.broadvideo.pixsignage.service.VideoService;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service("exportTask")
public class ExportTask extends Thread {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").setPrettyPrinting().create();

	@Autowired
	private BundleService bundleService;
	@Autowired
	private PageService pageService;
	@Autowired
	private VideoService videoService;
	@Autowired
	private ImageService imageService;

	public void run() {
		logger.info("Start Export Task.");

		while (true) {
			try {
				List<Bundle> bundles = bundleService.selectExportList();
				for (Bundle bundle : bundles) {
					logger.info("Begin to export bundle, bundleid={}", bundle.getBundleid());
					String exportdir = "/pixdata/pixsignage/bundle/" + bundle.getBundleid();
					JSONObject bundleJson = bundleService.generateBundleJson("" + bundle.getBundleid());
					JSONObject bundleScheduleJson = new JSONObject();
					JSONArray bundleJsonArray = new JSONArray();
					bundleJsonArray.add(bundleJson);
					bundleScheduleJson.put("bundles", bundleJsonArray);
					JSONArray scheduleJsonArray = new JSONArray();
					JSONObject scheduleJson = new JSONObject();
					scheduleJson.put("playmode", "daily");
					scheduleJson.put("start_time", "00:00:00");
					JSONArray bundleArray = new JSONArray();
					bundleArray.add(bundle.getBundleid());
					scheduleJson.put("bundles", bundleArray);
					scheduleJsonArray.add(scheduleJson);
					bundleScheduleJson.put("bundle_schedules", scheduleJsonArray);

					File bundleFile = new File(exportdir, "bundle.jsf");
					File bundleScheduleFile = new File(exportdir, "bundle-schedule.jsf");
					File zipFile = new File(exportdir, "bundle-export.zip");

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
						CommonUtil.zip(out, bundleFile, "bundle.jsf");
						CommonUtil.zip(out, bundleScheduleFile, "bundle-schedule.jsf");
						out.putNextEntry(new ZipEntry("video/"));
						for (int i = 0; i < videoJsonArray.size(); i++) {
							JSONObject videoJson = videoJsonArray.getJSONObject(i);
							String videoid = "" + videoJson.getInt("id");
							Video video = videoService.selectByPrimaryKey(videoid);
							File videoFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + video.getFilepath());
							CommonUtil.zip(out, videoFile, "video/" + video.getFilename());
						}
						out.putNextEntry(new ZipEntry("image/"));
						for (int i = 0; i < imageJsonArray.size(); i++) {
							JSONObject imageJson = imageJsonArray.getJSONObject(i);
							String imageid = "" + imageJson.getInt("id");
							Image image = imageService.selectByPrimaryKey(imageid);
							File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + image.getFilepath());
							CommonUtil.zip(out, imageFile, "image/" + image.getFilename());
						}

						String bundleDir = CommonConfig.CONFIG_PIXDATA_HOME + "/bundle/" + bundle.getBundleid();
						File jsfFile = new File(bundleDir, "" + bundle.getBundleid() + ".jsf");
						Bundle fullbundle = bundleService.selectByPrimaryKey("" + bundle.getBundleid());
						FileUtils.writeStringToFile(jsfFile, gson.toJson(fullbundle), "UTF-8", false);
						String jsfname = "index.jsf";
						String jpgname = "index.jpg";
						if (bundle.getHomeflag().equals("0")) {
							jsfname = "" + bundle.getBundleid() + ".jsf";
							jpgname = "" + bundle.getBundleid() + ".jpg";
						}
						CommonUtil.zip(out, jsfFile, jsfname);
						if (bundle.getSnapshot() != null) {
							File snapshot = new File(CommonConfig.CONFIG_PIXDATA_HOME + bundle.getSnapshot());
							CommonUtil.zip(out, snapshot, jpgname);
						}

						out.close();
					}

					bundle.setExportflag("1");
					bundle.setExportsize(FileUtils.sizeOf(zipFile));
					bundleService.updateBundle(bundle);

					logger.info("Bundle export successfully, bundleid={}", bundle.getBundleid());
				}

				List<Page> pages = pageService.selectExportList();
				for (Page page : pages) {
					logger.info("Begin to export page, pageid={}", page.getPageid());
					String exportdir = "/pixdata/pixsignage/page/" + page.getPageid();
					FileUtils.forceMkdir(new File(exportdir));
					File zipFile = new File(exportdir, "page-export.zip");
					if (zipFile.exists()) {
						zipFile.delete();
					}

					ArrayList<Page> pageList = new ArrayList<Page>();
					HashMap<Integer, Video> videoHash = new HashMap<Integer, Video>();
					page = pageService.selectByPrimaryKey("" + page.getPageid());
					page.setExportflag("1");
					pageService.updatePage(page);
					pageList.add(page);
					for (Page subpage : page.getSubpages()) {
						Page p = pageService.selectByPrimaryKey("" + subpage.getPageid());
						pageList.add(p);
					}
					for (Page p : pageList) {
						for (Pagezone pagezone : p.getPagezones()) {
							if (pagezone.getType() == Pagezone.Type_Video) {
								for (Pagezonedtl pagezonedtl : pagezone.getPagezonedtls()) {
									Video video = pagezonedtl.getVideo();
									if (video != null && videoHash.get(video.getVideoid()) == null) {
										videoHash.put(video.getVideoid(), video);
									}
								}
							}
						}
					}

					ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFile));
					out.putNextEntry(new ZipEntry("video/"));

					Iterator<Entry<Integer, Video>> iter = videoHash.entrySet().iterator();
					while (iter.hasNext()) {
						Entry<Integer, Video> entry = iter.next();
						Video video = entry.getValue();
						File videoFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + video.getFilepath());
						CommonUtil.zip(out, videoFile, "video/" + video.getFilename());
					}

					for (Page p : pageList) {
						String pageDir = CommonConfig.CONFIG_PIXDATA_HOME + "/page/" + p.getPageid();
						File jsfFile = new File(pageDir, "" + p.getPageid() + ".jsf");
						FileUtils.writeStringToFile(jsfFile, gson.toJson(p), "UTF-8", false);
						String jsfname = "index.jsf";
						String jpgname = "index.jpg";
						if (p.getHomeflag().equals("0")) {
							jsfname = "" + p.getPageid() + ".jsf";
							jpgname = "" + p.getPageid() + ".jpg";
						}
						CommonUtil.zip(out, jsfFile, jsfname);
						if (p.getSnapshot() != null) {
							File snapshot = new File(CommonConfig.CONFIG_PIXDATA_HOME + p.getSnapshot());
							CommonUtil.zip(out, snapshot, jpgname);
						}
					}

					File pagezipFile = new File(exportdir, "page-" + page.getPageid() + ".zip");
					if (pagezipFile.exists()) {
						CommonUtil.zip(out, pagezipFile, "page-" + page.getPageid() + ".zip");
					}
					out.close();

					page = pageService.selectByPrimaryKey("" + page.getPageid());
					page.setExportsize(FileUtils.sizeOf(zipFile));
					pageService.updatePage(page);

					logger.info("Page export successfully, pageid={}", page.getPageid());
				}
				Thread.sleep(30000);
			} catch (Exception ex) {
				logger.error("Export Task error: {}", ex);
			}
		}
	}
}
