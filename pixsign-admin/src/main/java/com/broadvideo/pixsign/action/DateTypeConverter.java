package com.broadvideo.pixsign.action;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.apache.struts2.util.StrutsTypeConverter;

import com.broadvideo.pixsign.common.CommonConstants;

public class DateTypeConverter extends StrutsTypeConverter {
	@Override
	public Object convertFromString(Map context, String[] values, Class toClass) {
		try {
			if (values[0].length() == 19) {
				return new SimpleDateFormat(CommonConstants.DateFormat_Full).parse(values[0]);
			} else if (values[0].length() == 10) {
				return new SimpleDateFormat(CommonConstants.DateFormat_Date).parse(values[0]);
			} else if (values[0].length() == 8) {
				return new SimpleDateFormat(CommonConstants.DateFormat_Time).parse(values[0]);
			} else {
				return null;
			}
		} catch (Exception e) {
			return null;
		}
	}

	@Override
	public String convertToString(Map context, Object o) {
		return new SimpleDateFormat(CommonConstants.DateFormat_Full).format((Date) o);
	}

}