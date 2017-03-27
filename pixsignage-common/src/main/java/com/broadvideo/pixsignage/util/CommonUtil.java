package com.broadvideo.pixsignage.util;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

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
