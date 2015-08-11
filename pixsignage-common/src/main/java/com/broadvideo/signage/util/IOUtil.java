package com.broadvideo.signage.util;

import java.io.File;

public class IOUtil {

	public static void deleteFile(File oldPath) {
		if (oldPath.isDirectory()) {
			File[] files = oldPath.listFiles();
			for (File file : files) {
				deleteFile(file);
			}
			oldPath.delete();
		} else {
			oldPath.delete();
		}
	}
	
	public static void mkdirs(String path) {
		if (path != null) {
			new File(path).mkdirs();
		}
	}
}
