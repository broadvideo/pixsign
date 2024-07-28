package com.broadvideo.pixsign.util;

import java.util.UUID;

/**
 * uuid生成器
 * 
 * @author charles
 *
 */
public class UUIDUtils {

	public static String generateUUID() {

		String uuid = UUID.randomUUID().toString().toLowerCase();

		return uuid.replaceAll("-", "");

	}

}