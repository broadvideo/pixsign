package com.broadvideo.pixsignage.util;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.charset.Charset;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

public class ZipUtil {
	static final int BUFFER = 2048;

	public static void unzip(String srcZip, String destDir) throws Exception {
		try {
			if (!destDir.endsWith("/")) {
				destDir = destDir + "/";
			}
			File destDirFile = new File(destDir);
			if (!destDirFile.exists()) {
				destDirFile.mkdir();
			}
			ZipFile zipFile = new ZipFile(srcZip, Charset.forName("GB2312"));
			Enumeration emu = zipFile.entries();
			int i = 0;
			while (emu.hasMoreElements()) {
				ZipEntry entry = (ZipEntry) emu.nextElement();
				// 会把目录作为一个file读出一次，所以只建立目录就可以，之下的文件还会被迭代到。
				if (entry.isDirectory()) {
					new File(destDir + entry.getName()).mkdirs();
					continue;
				}
				BufferedInputStream bis = new BufferedInputStream(zipFile.getInputStream(entry));
				File file = new File(destDir + entry.getName());
				// 加入这个的原因是zipfile读取文件是随机读取的，这就造成可能先读取一个文件
				// 而这个文件所在的目录还没有出现过，所以要建出目录来。
				File parent = file.getParentFile();
				if (parent != null && (!parent.exists())) {
					parent.mkdirs();
				}
				FileOutputStream fos = new FileOutputStream(file);
				BufferedOutputStream bos = new BufferedOutputStream(fos, BUFFER);

				int count;
				byte data[] = new byte[BUFFER];
				while ((count = bis.read(data, 0, BUFFER)) != -1) {
					bos.write(data, 0, count);
				}
				bos.flush();
				bos.close();
				bis.close();
			}
			zipFile.close();
		} catch (Exception e) {
			e.printStackTrace();
			throw new Exception("Unzip fail:" + e.getMessage());
		}

	}

	public void zip(String srcDir, String destZip) throws Exception {

		try {
			BufferedInputStream origin = null;
			FileOutputStream dest = new FileOutputStream(destZip);
			ZipOutputStream out = new ZipOutputStream(new BufferedOutputStream(dest));
			byte data[] = new byte[BUFFER];
			File f = new File(srcDir);
			File files[] = f.listFiles();

			for (int i = 0; i < files.length; i++) {
				FileInputStream fi = new FileInputStream(files[i]);
				origin = new BufferedInputStream(fi, BUFFER);
				ZipEntry entry = new ZipEntry(files[i].getName());
				out.putNextEntry(entry);
				int count;
				while ((count = origin.read(data, 0, BUFFER)) != -1) {
					out.write(data, 0, count);
				}
				origin.close();
			}
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
			throw new Exception("zip fail:" + e.getMessage());
		}

	}

	public static void main(String[] args) {

		String zipFile = "D:\\zipfile\\input\\moment-2.22.1.zip";
		File file = new File(zipFile);
		System.out.println("path:" + file.getPath() + ",absolute path:" + file.getAbsolutePath());

	}
}