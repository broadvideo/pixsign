package com.broadvideo.pixsignage.util;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.apache.commons.codec.digest.DigestUtils;

import com.gif4j.GifEncoder;

public class CommonUtil {

	public static String getPasswordMd5(String loginname, String password) {
		return DigestUtils.md5Hex(loginname + "&PixSG&" + password);
	}

	public static String getMd5(String source, String salt) {
		return DigestUtils.md5Hex(source + salt);
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
