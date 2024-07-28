package com.broadvideo.pixsign.task;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsign.common.CommonConfig;
import com.broadvideo.pixsign.domain.Dailyplaylog;
import com.broadvideo.pixsign.domain.Device;
import com.broadvideo.pixsign.domain.Monthlyplaylog;
import com.broadvideo.pixsign.persistence.DailyplaylogMapper;
import com.broadvideo.pixsign.persistence.DeviceMapper;
import com.broadvideo.pixsign.persistence.MonthlyplaylogMapper;

import net.sf.json.JSONObject;

public class PlaylogTask {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean workflag = false;

	@Autowired
	private DailyplaylogMapper dailyplaylogMapper;
	@Autowired
	private MonthlyplaylogMapper monthlyplaylogMapper;
	@Autowired
	private DeviceMapper deviceMapper;

	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;

			File[] subdirs = new File(CommonConfig.CONFIG_PIXDATA_HOME + "/playlog").listFiles(new FilenameFilter() {
				@Override
				public boolean accept(File file, String name) {
					return file.isDirectory();
				}
			});
			for (int i = 0; i < subdirs.length; i++) {
				File subdir = subdirs[i];
				String deviceid = subdir.getName();
				Device device = deviceMapper.selectByPrimaryKey(deviceid);
				if (device == null) {
					continue;
				}
				File[] zipfiles = subdir.listFiles();
				for (int j = 0; j < zipfiles.length; j++) {
					File zipfile = zipfiles[j];
					if (!zipfile.getName().endsWith(".zip.ok")) {
						continue;
					}
					try {
						handleZipFile(zipfile, device);
					} catch (Exception e) {
						logger.error("Handle {} error. ", zipfile.getAbsolutePath(), e);
					}
					// String newfilename =
					// zipfile.getAbsolutePath().substring(0,
					// zipfile.getAbsolutePath().length() - 3);
					// zipfile.renameTo(new File(newfilename));
					FileUtils.deleteQuietly(zipfile);
				}
			}
		} catch (Exception e) {
			logger.error("PlaylogTask Quartz Task error: {}", e.getMessage());
		}
		workflag = false;
	}

	private void handleZipFile(File zipfile, Device device) throws Exception {
		logger.info("Begin to handle {}", zipfile.getAbsolutePath());
		ZipInputStream zin = new ZipInputStream(new FileInputStream(zipfile));
		BufferedInputStream Bin = new BufferedInputStream(zin);
		String temp = "/pixdata/pixsign/playlog/temp";
		FileUtils.cleanDirectory(new File(temp));
		ZipEntry entry;
		while ((entry = zin.getNextEntry()) != null && !entry.isDirectory()) {
			File dtlFile = new File(temp, entry.getName());
			if (!dtlFile.exists()) {
				(new File(dtlFile.getParent())).mkdirs();
			}
			FileOutputStream out = new FileOutputStream(dtlFile);
			BufferedOutputStream Bout = new BufferedOutputStream(out);
			int b;
			while ((b = Bin.read()) != -1) {
				Bout.write(b);
			}
			Bout.close();
			out.close();
		}
		Bin.close();
		zin.close();

		File[] dtlFiles = new File(CommonConfig.CONFIG_PIXDATA_HOME + "/playlog/temp").listFiles();
		for (int i = 0; i < dtlFiles.length; i++) {
			File dtlFile = dtlFiles[i];
			List<String> lines = FileUtils.readLines(dtlFile);
			for (String line : lines) {
				long starttime = 0;
				long endtime = 0;
				String mediatype = "";
				String mediaid = "";

				if (line.startsWith("{")) {
					// JSON format
					JSONObject json = JSONObject.fromObject(line);
					starttime = json.getLong("start_time");
					endtime = json.getLong("end_time");
					mediatype = json.getString("media_type");
					mediaid = json.getString("media_id");
				} else {
					// CSV format
					String[] ss = line.split(",");
					if (ss.length >= 7) {
						if (!ss[0].equals("0")) {
							continue;
						}
						starttime = Long.parseLong(ss[5]);
						endtime = Long.parseLong(ss[6]);
						mediatype = ss[3];
						mediaid = ss[4];
					}
				}

				Calendar c1 = Calendar.getInstance();
				c1.setTimeInMillis(starttime);
				Calendar c2 = Calendar.getInstance();
				c2.setTimeInMillis(endtime);
				int duration = (int) Math.ceil((c2.getTimeInMillis() - c1.getTimeInMillis()) / 1000);
				// 2017-01-01 00:00:00
				if (c1.getTimeInMillis() < 1483200000000L) {
					continue;
				}
				if (mediatype.equals("video")) {
					if (duration == 0) {
						continue;
					}
					mediatype = "1";
				} else if (mediatype.equals("image")) {
					mediatype = "2";
				} else {
					continue;
				}

				String playdate = new SimpleDateFormat("yyyyMMdd").format(c1.getTime());
				Dailyplaylog dailyplaylog = dailyplaylogMapper.selectByDetail("" + device.getDeviceid(), mediatype,
						mediaid, playdate);
				if (dailyplaylog != null) {
					dailyplaylog.setTotal(dailyplaylog.getTotal() + 1);
					dailyplaylogMapper.updateByPrimaryKeySelective(dailyplaylog);
				} else {
					dailyplaylog = new Dailyplaylog();
					dailyplaylog.setOrgid(device.getOrgid());
					dailyplaylog.setBranchid(device.getBranchid());
					dailyplaylog.setDeviceid(device.getDeviceid());
					dailyplaylog.setMediatype(mediatype);
					dailyplaylog.setMediaid(Integer.parseInt(mediaid));
					dailyplaylog.setPlaydate(playdate);
					dailyplaylog.setTotal(1);
					dailyplaylogMapper.insertSelective(dailyplaylog);
				}

				String playmonth = new SimpleDateFormat("yyyyMM").format(c1.getTime());
				Monthlyplaylog monthlyplaylog = monthlyplaylogMapper.selectByDetail("" + device.getDeviceid(),
						mediatype, mediaid, playmonth);
				if (monthlyplaylog != null) {
					monthlyplaylog.setTotal(monthlyplaylog.getTotal() + 1);
					monthlyplaylogMapper.updateByPrimaryKeySelective(monthlyplaylog);
				} else {
					monthlyplaylog = new Monthlyplaylog();
					monthlyplaylog.setOrgid(device.getOrgid());
					monthlyplaylog.setBranchid(device.getBranchid());
					monthlyplaylog.setDeviceid(device.getDeviceid());
					monthlyplaylog.setMediatype(mediatype);
					monthlyplaylog.setMediaid(Integer.parseInt(mediaid));
					monthlyplaylog.setPlaymonth(playmonth);
					monthlyplaylog.setTotal(1);
					monthlyplaylogMapper.insertSelective(monthlyplaylog);
				}
			}
		}
	}

}
