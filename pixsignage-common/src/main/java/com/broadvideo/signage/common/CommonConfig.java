package com.broadvideo.signage.common;

import java.util.Date;

public class CommonConfig {
	public static String CONFIG_SERVER_IP;

	public static String CONFIG_IMAGE_HOME = "/opt/pix/storage/image";
	public static String CONFIG_VIDEO_HOME = "/opt/pix/storage/video";
	public static String CONFIG_TEMP_HOME = "/opt/pix/storage/tmp";
	public static String CONFIG_FFMPEG_HOME = "/opt/pix/ffmpeg";
	public static String CONFIG_THUMB_DEFAULT = "/opt/pix/pixorg/WebRoot/web/local/img/video.jpg";

	public static boolean LICENSE = false;
	public static boolean LICENSE_HOSTID_VERIFY = false;
	public static Date LICENSE_Expire;
	public static int LICENSE_MaxOrgs = 5;
	public static int LICENSE_MaxDevicesPerSigOrg = 5;
	public static int LICENSE_MaxStoragePerSigOrg = 5000;
	public static int LICENSE_MaxDevicesPerMovieOrg = 5;
	public static int LICENSE_MaxStoragePerMovieOrg = 5000;
}
