package com.broadvideo.pixsignage.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DateUtil {

	private final static Logger logger = LoggerFactory.getLogger(DateUtil.class);
	public static Long getTimeStamp(String strDate) {

		DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = null;
		try {
			date = df.parse(strDate);
		} catch (ParseException e) {
			e.printStackTrace();
			return null;
		}
		return date.getTime();

	}

	public static Date getDate(String strDate) {

		DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = null;
		try {
			date = df.parse(strDate);
		} catch (ParseException e) {
			e.printStackTrace();
			return null;
		}
		return date;

	}

	public static Date getDate(String strDate, String pattern) {

		DateFormat df = new SimpleDateFormat(pattern);
		Date date = null;
		try {
			date = df.parse(strDate);
		} catch (ParseException e) {
			e.printStackTrace();
			return null;
		}
		return date;

	}

	public static String getDateStr(Date date, String pattern) {

		DateFormat df = new SimpleDateFormat(pattern);
		return df.format(date);

	}

	public static String formatShorttime(String shortTime, String pattern) throws Exception {

		try {
			if (pattern == null || pattern.trim().length() == 0) {

				pattern = "HH:mm";
			}
			DateFormat df = new SimpleDateFormat(pattern);
			Date dShortTime = df.parse(shortTime);
			return df.format(dShortTime);
		} catch (Exception ex) {
			logger.error("Format shortTime:{} exception.", shortTime, ex);
			throw ex;

		}

	}

	public static int getWorkday(Date date) {

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int workday = calendar.get(Calendar.DAY_OF_WEEK);
		if (workday == 1) {
			workday = 7;
		} else {
			workday = workday - 1;
		}

		return workday;

	}

	public static Date add(Date date, int calendarField, int amount) {
		if (date == null) {
			throw new IllegalArgumentException("The date must not be null");
		}
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		c.add(calendarField, amount);
		return c.getTime();
	}

	public static void main(String[] args) {

		Date date = DateUtil.getDate("207-08-24 12:00", "yyyy-MM-dd HH:mm");

		Date plusDate = DateUtil.add(date, Calendar.MINUTE, 10);
		System.out.println("plusDate:" + plusDate);

	}

}
