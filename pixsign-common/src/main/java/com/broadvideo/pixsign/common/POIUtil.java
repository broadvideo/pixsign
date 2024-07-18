package com.broadvideo.pixsign.common;

import java.util.Locale;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;

/**
 * 返回字符串的Cell
 * 
 * @author charles
 *
 */
public class POIUtil {

	private static DataFormatter formatter = new DataFormatter(Locale.SIMPLIFIED_CHINESE);

	public static String formatCellValue(Cell cell) {

		if (cell == null) {
			return null;
		}
		return formatter.formatCellValue(cell);

	}

}
