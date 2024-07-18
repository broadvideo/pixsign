package com.broadvideo.pixsign.common;

import java.util.Calendar;
import java.util.Hashtable;

public class CommonConfig {
	public static String CONFIG_ACTIVEMQ_SERVER = "pixsignage-mq";

	public static String CONFIG_PIXDATA_HOME = "/pixdata/pixsign";
	public static String CONFIG_TEMP_HOME = "/pixdata/pixsign/temp";
	public static String CONFIG_FFMPEG_CMD = "/opt/pix/ffmpeg/ffmpeg";
	public static String CONFIG_PAGE_HOME = "/opt/pix/pixsignage-page";
	public static String CONFIG_PIXDATA_URL = "/pixsigndata";

	public static String CONFIG_VCSS_SERVER = "http://127.0.0.1:6060/";

	public static String SYSTEM_ID = "";
	public static String SYSTEM_COPYRIGHT = "";
	public static String SYSTEM_ICP = "";

	public static String CURRENT_APPVERSION;
	public static String CURRENT_DBVERSION;

	public static long Timestamp = Calendar.getInstance().getTimeInMillis();

	public static Hashtable<String, String> CONFIG_SIGNATURE;

	// public static boolean LICENSE = false;
	// public static boolean LICENSE_HOSTID_VERIFY = false;
	// public static Date LICENSE_Expire;
	// public static int LICENSE_MaxOrgs = 5;
	// public static int LICENSE_MaxDevicesPerSigOrg = 5;
	// public static int LICENSE_MaxStoragePerSigOrg = 5000;
	// public static int LICENSE_MaxDevicesPerMovieOrg = 5;
	// public static int LICENSE_MaxStoragePerMovieOrg = 5000;
}
