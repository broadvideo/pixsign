package com.broadvideo.pixsignage.common;

import java.util.Date;

public class CommonConfig {
	public static String CONFIG_SERVER_IP;
	public static String CONFIG_SERVER_PORT;

	public static String CONFIG_APP_VERSION_NAME;
	public static String CONFIG_APP_VERSION_CODE;
	public static String CONFIG_APP_VERSION_FILE;

	public static String CONFIG_PIXDATA_HOME = "/pixdata/pixsignage";
	public static String CONFIG_TEMP_HOME = "/pixdata/pixsignage/temp";
	public static String CONFIG_FFMPEG_HOME = "/opt/pix/ffmpeg";

	public static boolean LICENSE = false;
	public static boolean LICENSE_HOSTID_VERIFY = false;
	public static Date LICENSE_Expire;
	public static int LICENSE_MaxOrgs = 5;
	public static int LICENSE_MaxDevicesPerSigOrg = 5;
	public static int LICENSE_MaxStoragePerSigOrg = 5000;
	public static int LICENSE_MaxDevicesPerMovieOrg = 5;
	public static int LICENSE_MaxStoragePerMovieOrg = 5000;
}
