package com.broadvideo.pixsignage.util;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.imageio.ImageIO;

import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.gif4j.GifEncoder;

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
			logger.error("parseDate " + s + " exception: ", e);
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
			logger.info(ioe.toString());
		}
		return result;
	}

	public static byte[] generateThumbnail(File file, int width) throws IOException {
		BufferedImage img = ImageIO.read(file);
		int h = img.getHeight();
		int w = img.getWidth();

		byte[] thumbnail;
		if (w >= width) {
			int nw = width;
			int nh = (nw * h) / w;
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			BufferedImage dest = new BufferedImage(nw, nh, BufferedImage.TYPE_4BYTE_ABGR);
			dest.getGraphics().drawImage(img, 0, 0, nw, nh, null);
			GifEncoder.encode(dest, out);
			// ImageIO.write(dest, "gif", out);
			thumbnail = out.toByteArray();
			out.close();
		} else {
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			GifEncoder.encode(img, out);
			thumbnail = out.toByteArray();
			out.close();
		}
		return thumbnail;
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
