package com.broadvideo.pixsignage.util;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.imageio.ImageIO;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.log4j.Logger;

import com.gif4j.GifEncoder;

public class CommonUtil {
	private static final Logger log = Logger.getLogger(CommonUtil.class);

	public static String getPasswordMd5(String loginname, String password) {
		return DigestUtils.md5Hex(loginname + "&PixSG&" + password);
	}

	public static String getMd5(String source, String salt) {
		return DigestUtils.md5Hex(source + salt);
	}

	public static Date parseDate(String s, SimpleDateFormat format) {
		Date date = null;
		try {
			date = format.parse(s);
		} catch (Exception e) {
		}
		return date;
	}

	public static int execCommand(String command) {
		int result = 0;
		InputStream fis = null;
		BufferedReader bufferedReader = null;
		try {
			log.info("start to run command: " + command);
			Process process = Runtime.getRuntime().exec(command);
			fis = process.getInputStream();
			bufferedReader = new BufferedReader(new InputStreamReader(fis));
			result = process.waitFor();
			String line = null;
			while ((line = bufferedReader.readLine()) != null) {
				log.info(line);
			}
		} catch (Exception ioe) {
			result = -1;
			log.info(ioe.toString());
		} finally {
			if (fis != null) {
				try {
					fis.close();
				} catch (Exception e) {
				}
			}
			if (bufferedReader != null) {
				try {
					bufferedReader.close();
				} catch (Exception e) {
				}
			}
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
