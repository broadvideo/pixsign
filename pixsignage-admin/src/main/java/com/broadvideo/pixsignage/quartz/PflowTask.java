package com.broadvideo.pixsignage.quartz;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.util.Calendar;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Pflowlog;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.PflowlogMapper;

public class PflowTask {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean workflag = false;

	@Autowired
	private PflowlogMapper pflowlogMapper;
	@Autowired
	private DeviceMapper deviceMapper;

	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;

			File[] subdirs = new File(CommonConfig.CONFIG_PIXDATA_HOME + "/pflow").listFiles(new FilenameFilter() {
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
						logger.error("Handle {} error: {}", zipfile.getAbsolutePath(), e.getMessage());
					}
					String newfilename = zipfile.getAbsolutePath().substring(0, zipfile.getAbsolutePath().length() - 3);
					zipfile.renameTo(new File(newfilename));
				}
			}
		} catch (Exception e) {
			logger.error("PflowTask Quartz Task error: {}", e.getMessage());
		}
		workflag = false;
	}

	private void handleZipFile(File zipfile, Device device) throws Exception {
		logger.info("Beging to handle {}", zipfile.getAbsolutePath());
		ZipInputStream zin = new ZipInputStream(new FileInputStream(zipfile));
		BufferedInputStream Bin = new BufferedInputStream(zin);
		String temp = "/pixdata/pixsignage/pflow/temp";
		FileUtils.cleanDirectory(new File(temp));
		ZipEntry entry;
		while ((entry = zin.getNextEntry()) != null && !entry.isDirectory()) {
			File csv = new File(temp, entry.getName());
			if (!csv.exists()) {
				(new File(csv.getParent())).mkdirs();
			}
			FileOutputStream out = new FileOutputStream(csv);
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

		File[] csvs = new File(CommonConfig.CONFIG_PIXDATA_HOME + "/pflow/temp").listFiles();
		for (int i = 0; i < csvs.length; i++) {
			File csv = csvs[i];
			if (!csv.getName().endsWith(".csv")) {
				continue;
			}
			List<String> lines = FileUtils.readLines(csv);
			for (String line : lines) {
				if (line.length() > 0) {
					String[] ss = line.split(",");
					if (ss.length >= 2) {
						// 2017-01-01 00:00:00
						if (Long.parseLong(ss[0]) < 1483200000000L) {
							continue;
						}
						Pflowlog pflowlog = new Pflowlog();
						pflowlog.setOrgid(device.getOrgid());
						pflowlog.setBranchid(device.getBranchid());
						pflowlog.setDeviceid(device.getDeviceid());
						Calendar c1 = Calendar.getInstance();
						c1.setTimeInMillis(Long.parseLong(ss[0]));
						Calendar c2 = Calendar.getInstance();
						c2.setTimeInMillis(Long.parseLong(ss[1]));
						pflowlog.setStarttime(c1.getTime());
						pflowlog.setEndtime(c2.getTime());
						pflowlog.setDuration((int) Math.ceil((c2.getTimeInMillis() - c1.getTimeInMillis()) / 1000));
						pflowlogMapper.insertSelective(pflowlog);
					}
				}
			}
		}
	}

}
