package com.broadvideo.pixsign.util;

import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

import javax.imageio.ImageIO;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.coobird.thumbnailator.Thumbnails;

public class CommonUtil {
	private static Logger logger = LoggerFactory.getLogger(CommonUtil.class);

	public static String getPasswordMd5(String loginname, String password) {
		return DigestUtils.md5Hex(loginname + "&PixSG&" + password);
	}

	public static String getMd5(String source, String salt) {
		return DigestUtils.md5Hex(source + salt);
	}

	public static Date parseDate(String s, String format) {
		Date date = null;
		try {
			date = new SimpleDateFormat(format).parse(s);
		} catch (Exception e) {
			logger.error("parseDate {} exception: {}", s, e.getMessage());
		}
		return date;
	}

	public static void zip(ZipOutputStream out, File f, String base) throws Exception {
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

	public static void unzip(File zipFile, String unzipFilePath, boolean includeZipFileName) throws Exception {
		// 如果解压后的文件保存路径包含压缩文件的文件名，则追加该文件名到解压路径
		if (includeZipFileName) {
			String fileName = zipFile.getName();
			fileName = fileName.substring(0, fileName.lastIndexOf("."));
			unzipFilePath = unzipFilePath + "/" + fileName;
		}
		// 创建解压缩文件保存的路径
		File unzipFileDir = new File(unzipFilePath);
		if (!unzipFileDir.exists() || !unzipFileDir.isDirectory()) {
			unzipFileDir.mkdirs();
		}

		// 开始解压
		ZipFile zip = new ZipFile(zipFile, Charset.forName("GBK"));
		Enumeration<? extends ZipEntry> entries = zip.entries();
		// 循环对压缩包里的每一个文件进行解压
		while (entries.hasMoreElements()) {
			ZipEntry entry = entries.nextElement();
			if (entry.isDirectory()) {
				new File(unzipFilePath + "/" + entry.getName()).mkdirs();
				continue;
			}
			// 构建压缩包中一个文件解压后保存的文件全路径
			String entryFilePath = unzipFilePath + "/" + entry.getName();
			// 构建解压后保存的文件夹路径
			int index = entryFilePath.lastIndexOf("/");
			String entryDirPath = null;
			if (index != -1) {
				entryDirPath = entryFilePath.substring(0, index);
			} else {
				entryDirPath = "";
			}
			File entryDir = new File(entryDirPath);
			if (!entryDir.exists() || !entryDir.isDirectory()) {
				entryDir.mkdirs();
			}

			// 创建解压文件
			File entryFile = new File(entryFilePath);

			// 写入文件
			BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(entryFile));
			BufferedInputStream bis = new BufferedInputStream(zip.getInputStream(entry));
			int count = 0;
			byte[] buffer = new byte[1024];
			while ((count = bis.read(buffer, 0, 1024)) != -1) {
				bos.write(buffer, 0, count);
			}
			bos.flush();
			bos.close();
			bis.close();
		}
		zip.close();
	}

	public static int execCommand(String command) {
		int result = 0;
		try {
			logger.info("start to run command: {}", command);
			Process process = Runtime.getRuntime().exec(command);
			StreamGobbler errorGobbler = new StreamGobbler(process.getErrorStream(), "ERROR");
			errorGobbler.start();
			StreamGobbler outGobbler = new StreamGobbler(process.getInputStream(), "STDOUT");
			outGobbler.start();
			result = process.waitFor();
		} catch (Exception ioe) {
			result = -1;
			logger.error(ioe.toString());
		}
		return result;
	}

	public static boolean resizeImage(File srcFile, File destFile, int max) throws IOException {
		BufferedImage img = ImageIO.read(srcFile);

		int h = img.getHeight();
		int w = img.getWidth();
		if (w >= h && w > max) {
			int nw = max;
			int nh = (nw * h) / w;
			logger.info("resizeImage image from {} x {} to {} x {}", w, h, nw, nh);
			// BufferedImage thumbnail = Scalr.resize(img,
			// Scalr.Method.BALANCED, max);
			// ImageIO.write(thumbnail, "jpg", destFile);
			Thumbnails.of(srcFile).size(nw, nh).outputQuality(1).toFile(destFile);
			return true;
		} else if (h > w && h > max) {
			int nh = max;
			int nw = (nh * w) / h;
			logger.info("resizeImage image from {} x {} to {} x {}", w, h, nw, nh);
			// BufferedImage thumbnail = Scalr.resize(img, Scalr.Method.QUALITY,
			// max);
			// ImageIO.write(thumbnail, "jpg", destFile);
			Thumbnails.of(srcFile).size(nw, nh).outputQuality(1).toFile(destFile);
			return true;
		} else {
			FileUtils.copyFile(srcFile, destFile);
			return false;
		}
	}

	public static void sleep(long milliseconds) {
		try {
			Thread.currentThread().sleep(milliseconds);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}

class StreamGobbler extends Thread {
	private static Logger logger = LoggerFactory.getLogger(StreamGobbler.class);
	InputStream is;
	String type;
	OutputStream os;

	StreamGobbler(InputStream is, String type) {
		this(is, type, null);
	}

	StreamGobbler(InputStream is, String type, OutputStream redirect) {
		this.is = is;
		this.type = type;
		this.os = redirect;
	}

	public void run() {
		InputStreamReader isr = null;
		BufferedReader br = null;
		try {
			isr = new InputStreamReader(is);
			br = new BufferedReader(isr);
			String line = null;
			while ((line = br.readLine()) != null) {
				logger.info("{}> {}", type, line);
			}
		} catch (IOException ioe) {
			logger.error("", ioe);
		} finally {
			try {
				br.close();
				isr.close();
			} catch (IOException e) {
				logger.error("", e);
			}
		}
	}
}
