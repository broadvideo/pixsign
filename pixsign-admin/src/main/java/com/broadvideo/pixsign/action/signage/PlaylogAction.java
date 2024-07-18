package com.broadvideo.pixsign.action.signage;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsign.action.BaseDatatableAction;
import com.broadvideo.pixsign.domain.Device;
import com.broadvideo.pixsign.persistence.DailyplaylogMapper;
import com.broadvideo.pixsign.persistence.DeviceMapper;
import com.broadvideo.pixsign.persistence.MonthlyplaylogMapper;

@SuppressWarnings("serial")
@Scope("request")
@Controller("playlogAction")
public class PlaylogAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private String downloadname;
	private InputStream inputStream;

	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private DailyplaylogMapper dailyplaylogMapper;
	@Autowired
	private MonthlyplaylogMapper monthlyplaylogMapper;

	public String doStatAll() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String length = getParameter("length");

			String branchid = "" + getLoginStaff().getBranchid();
			if (branchid.equals("" + getLoginStaff().getOrg().getTopbranchid())) {
				branchid = null;
			}
			List<Object> aaData = new ArrayList<Object>();
			List<HashMap<String, Object>> list = monthlyplaylogMapper.statAll("" + getLoginStaff().getOrgid(), branchid,
					length);
			for (int i = 0; i < list.size(); i++) {
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PlaylogAction doStatAll exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doStatByPeriod() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String deviceid = getParameter("deviceid");
			String from = getParameter("from");
			from = from.replace("-", "");
			String to = getParameter("to");
			to = to.replace("-", "");

			List<Object> aaData = new ArrayList<Object>();
			List<HashMap<String, Object>> list = dailyplaylogMapper.statByPeriod(deviceid, from, to);
			for (int i = 0; i < list.size(); i++) {
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PlaylogAction doStatByPeriod exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doStatByDay() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String deviceid = getParameter("deviceid");
			String day = getParameter("day");
			day = day.replace("-", "");

			List<Object> aaData = new ArrayList<Object>();
			List<HashMap<String, Object>> list = dailyplaylogMapper.statByDay(deviceid, day);
			for (int i = 0; i < list.size(); i++) {
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PlaylogAction doStatByDay exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doStatByMonth() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String deviceid = getParameter("deviceid");
			String month = getParameter("month");
			month = month.replace("-", "");

			List<Object> aaData = new ArrayList<Object>();
			List<HashMap<String, Object>> list = dailyplaylogMapper.statByMonth(deviceid, month);
			for (int i = 0; i < list.size(); i++) {
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PlaylogAction doStatPeriodByMonth exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDownloadByPeriod() {
		try {
			String deviceid = getParameter("deviceid");
			String from = getParameter("from");
			from = from.replace("-", "");
			String to = getParameter("to");
			to = to.replace("-", "");

			HSSFWorkbook workbook = new HSSFWorkbook();
			HSSFSheet sheet = workbook.createSheet();
			HSSFCellStyle style = workbook.createCellStyle();
			style.setWrapText(true);
			int count = 0;
			HSSFRow row;
			HSSFCell cell;

			row = sheet.createRow(count);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Type");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Name");
			cell = row.createCell(2, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Amount");

			List<HashMap<String, Object>> list = dailyplaylogMapper.statByPeriod(deviceid, from, to);
			for (int i = 0; i < list.size(); i++) {
				HashMap<String, Object> hash = list.get(i);
				row = sheet.createRow(count);
				if (hash.get("mediatype").toString().equals("1")) {
					cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue("Video");
					cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
					ArrayList<HashMap> videos = (ArrayList<HashMap>) hash.get("video");
					cell.setCellValue(videos.get(0).get("name").toString());
					cell = row.createCell(2, HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue(hash.get("amount").toString());
				} else {
					cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue("Image");
					cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
					ArrayList<HashMap> images = (ArrayList<HashMap>) hash.get("image");
					cell.setCellValue(images.get(0).get("name").toString());
					cell = row.createCell(2, HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue(hash.get("amount").toString());
				}
				count++;
			}

			sheet.setColumnWidth(0, 3000);
			sheet.setColumnWidth(1, 10000);
			sheet.setColumnWidth(2, 3000);

			FileOutputStream fOut = new FileOutputStream("/tmp/playlog-" + deviceid + "-" + from + "-" + to + ".xls");
			workbook.write(fOut);
			fOut.flush();
			fOut.close();
			workbook.close();
			inputStream = new FileInputStream("/tmp/playlog-" + deviceid + "-" + from + "-" + to + ".xls");
			downloadname = "playlog-" + deviceid + "-" + from + "-" + to + ".xls";
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PlaylogAction doDownloadByDay exception. ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDownloadByDay() {
		try {
			String deviceid = getParameter("deviceid");
			String day = getParameter("day");
			day = day.replace("-", "");

			Device device = deviceMapper.selectByPrimaryKey(deviceid);

			HSSFWorkbook workbook = new HSSFWorkbook();
			HSSFSheet sheet = workbook.createSheet();
			HSSFCellStyle style = workbook.createCellStyle();
			style.setWrapText(true);
			int count = 0;
			HSSFRow row;
			HSSFCell cell;

			row = sheet.createRow(count);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Day");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Device");
			cell = row.createCell(2, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Position");
			cell = row.createCell(3, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Type");
			cell = row.createCell(4, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Name");
			cell = row.createCell(5, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Amount");

			List<HashMap<String, Object>> list = dailyplaylogMapper.statByDay(deviceid, day);
			for (int i = 0; i < list.size(); i++) {
				HashMap<String, Object> hash = list.get(i);
				row = sheet.createRow(count);
				cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(day);
				cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(device.getName());
				cell = row.createCell(2, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(device.getPosition());
				if (hash.get("mediatype").toString().equals("1")) {
					cell = row.createCell(3, HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue("Video");
					cell = row.createCell(4, HSSFCell.CELL_TYPE_STRING);
					ArrayList<HashMap> videos = (ArrayList<HashMap>) hash.get("video");
					if (videos.size() > 0) {
						cell.setCellValue(videos.get(0).get("name").toString());
					}
				} else {
					cell = row.createCell(3, HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue("Image");
					cell = row.createCell(4, HSSFCell.CELL_TYPE_STRING);
					ArrayList<HashMap> images = (ArrayList<HashMap>) hash.get("image");
					if (images.size() > 0) {
						cell.setCellValue(images.get(0).get("name").toString());
					}
				}
				cell = row.createCell(5, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(hash.get("amount").toString());
				count++;
			}

			sheet.setColumnWidth(0, 3000);
			sheet.setColumnWidth(1, 10000);
			sheet.setColumnWidth(2, 3000);

			FileOutputStream fOut = new FileOutputStream("/tmp/playlog-" + deviceid + "-" + day + ".xls");
			workbook.write(fOut);
			fOut.flush();
			fOut.close();
			workbook.close();
			inputStream = new FileInputStream("/tmp/playlog-" + deviceid + "-" + day + ".xls");
			downloadname = "playlog-" + deviceid + "-" + day + ".xls";
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PlaylogAction doDownloadByDay exception. ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDownloadByMonth() {
		try {
			String deviceid = getParameter("deviceid");
			String month = getParameter("month");
			month = month.replace("-", "");

			Device device = deviceMapper.selectByPrimaryKey(deviceid);

			HSSFWorkbook workbook = new HSSFWorkbook();
			HSSFSheet sheet = workbook.createSheet();
			HSSFCellStyle style = workbook.createCellStyle();
			style.setWrapText(true);
			int count = 0;
			HSSFRow row;
			HSSFCell cell;

			row = sheet.createRow(count);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Month");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Device");
			cell = row.createCell(2, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Position");
			cell = row.createCell(3, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Type");
			cell = row.createCell(4, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Name");
			cell = row.createCell(5, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Amount");

			List<HashMap<String, Object>> list = dailyplaylogMapper.statByMonth(deviceid, month);
			for (int i = 0; i < list.size(); i++) {
				HashMap<String, Object> hash = list.get(i);
				row = sheet.createRow(count);
				cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(month);
				cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(device.getName());
				cell = row.createCell(2, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(device.getPosition());
				if (hash.get("mediatype").toString().equals("1")) {
					cell = row.createCell(3, HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue("Video");
					cell = row.createCell(4, HSSFCell.CELL_TYPE_STRING);
					ArrayList<HashMap> videos = (ArrayList<HashMap>) hash.get("video");
					cell.setCellValue(videos.get(0).get("name").toString());
				} else {
					cell = row.createCell(3, HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue("Image");
					cell = row.createCell(4, HSSFCell.CELL_TYPE_STRING);
					ArrayList<HashMap> images = (ArrayList<HashMap>) hash.get("image");
					cell.setCellValue(images.get(0).get("name").toString());
				}
				cell = row.createCell(5, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(hash.get("amount").toString());
				count++;
			}

			sheet.setColumnWidth(0, 3000);
			sheet.setColumnWidth(1, 10000);
			sheet.setColumnWidth(2, 3000);

			FileOutputStream fOut = new FileOutputStream("/tmp/playlog-" + deviceid + "-" + month + ".xls");
			workbook.write(fOut);
			fOut.flush();
			fOut.close();
			workbook.close();
			inputStream = new FileInputStream("/tmp/playlog-" + deviceid + "-" + month + ".xls");
			downloadname = "playlog-" + deviceid + "-" + month + ".xls";
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PlaylogAction doDownloadByMonth exception. ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String getDownloadname() {
		return downloadname;
	}

	public void setDownloadname(String downloadname) {
		this.downloadname = downloadname;
	}

	public InputStream getInputStream() {
		return inputStream;
	}

	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}
}
