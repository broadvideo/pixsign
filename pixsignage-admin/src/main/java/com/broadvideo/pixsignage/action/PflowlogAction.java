package com.broadvideo.pixsignage.action;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Calendar;
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

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.PflowlogMapper;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("pflowlogAction")
public class PflowlogAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private String downloadname;
	private InputStream inputStream;

	@Autowired
	private PflowlogMapper pflowlogMapper;
	@Autowired
	private DeviceMapper deviceMapper;

	public String doDeviceStatList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);

			List<Object> aaData = new ArrayList<Object>();
			int count = pflowlogMapper.selectDeviceStatCount("" + getLoginStaff().getOrgid(), null, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<HashMap<String, Object>> list = pflowlogMapper.selectDeviceStatList("" + getLoginStaff().getOrgid(),
					null, search, start, length);
			for (int i = 0; i < list.size(); i++) {
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PflowlogAction doDeviceStatList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doStatByHour() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String deviceid = getParameter("deviceid");
			String day = getParameter("day");
			day = day.replace("-", "");

			List<Object> aaData = new ArrayList<Object>();
			List<HashMap<String, Object>> list = pflowlogMapper.statByHour(deviceid, day);
			for (int i = 0; i < list.size(); i++) {
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PflowlogAction doStatByHour exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doStatByDay() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String deviceid = getParameter("deviceid");
			String month = getParameter("month");
			month = month.replace("-", "");

			List<Object> aaData = new ArrayList<Object>();
			List<HashMap<String, Object>> list = pflowlogMapper.statByDay(deviceid, month);
			for (int i = 0; i < list.size(); i++) {
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PflowlogAction doStatByDay exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDownloadByHour() {
		try {
			String day = getParameter("day");
			day = day.replace("-", "");

			HSSFWorkbook workbook = new HSSFWorkbook();
			HSSFSheet sheet = workbook.createSheet();
			HSSFCellStyle style = workbook.createCellStyle();
			style.setWrapText(true);
			int count = 0;
			HSSFRow row = sheet.createRow(count);
			HSSFCell cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Device");
			for (int i = 0; i < 24; i++) {
				String s = "" + i;
				if (s.length() == 1) {
					s = "0" + s;
				}
				s += ":00";
				cell = row.createCell((i + 1), HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(s);
			}

			List<Device> devices = deviceMapper.selectList("" + getLoginStaff().getOrgid(), null, Device.Type_Sign, "1",
					null, null, null, null, null, "deviceid");
			for (Device device : devices) {
				count++;
				row = sheet.createRow(count);
				cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(device.getTerminalid() + "(" + device.getName() + ")");
				for (int i = 0; i < 24; i++) {
					cell = row.createCell((i + 1), HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue("0");
				}

				List<HashMap<String, Object>> list = pflowlogMapper.statByHour("" + device.getDeviceid(), day);
				for (int i = 0; i < list.size(); i++) {
					HashMap<String, Object> hash = list.get(i);
					int sequence = Integer.parseInt(hash.get("sequence").toString());
					cell = row.getCell(sequence + 1);
					if (cell != null) {
						cell.setCellValue(hash.get("amount").toString());
					}
				}
			}

			sheet.autoSizeColumn(0);
			for (int i = 0; i < 24; i++) {
				sheet.autoSizeColumn(i + 1);
			}

			FileOutputStream fOut = new FileOutputStream("/tmp/pflowlog-" + day + ".xls");
			workbook.write(fOut);
			fOut.flush();
			fOut.close();
			workbook.close();
			inputStream = new FileInputStream("/tmp/pflowlog-" + day + ".xls");
			downloadname = "pflowlog-" + day + ".xls";
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PflowlogAction doDownloadByHour exception. ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDownloadByDay() {
		try {
			String month = getParameter("month");
			month = month.replace("-", "");

			Calendar cal = Calendar.getInstance();
			cal.set(Calendar.YEAR, Integer.parseInt(month.substring(0, 4)));
			cal.set(Calendar.MONTH, Integer.parseInt(month.substring(4, 6)) - 1);
			int maxDate = cal.getActualMaximum(Calendar.DATE);

			HSSFWorkbook workbook = new HSSFWorkbook();
			HSSFSheet sheet = workbook.createSheet();
			HSSFCellStyle style = workbook.createCellStyle();
			style.setWrapText(true);
			int count = 0;
			HSSFRow row = sheet.createRow(count);
			HSSFCell cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Device");
			for (int i = 0; i < maxDate; i++) {
				String s = "" + (i + 1);
				if (s.length() == 1) {
					s = "0" + s;
				}
				s = month.substring(4, 6) + "-" + s;
				cell = row.createCell((i + 1), HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(s);
			}

			List<Device> devices = deviceMapper.selectList("" + getLoginStaff().getOrgid(), null, Device.Type_Sign, "1",
					null, null, null, null, null, "deviceid");
			for (Device device : devices) {
				count++;
				row = sheet.createRow(count);
				cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(device.getTerminalid() + "(" + device.getName() + ")");
				for (int i = 0; i < maxDate; i++) {
					cell = row.createCell((i + 1), HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue("0");
				}

				List<HashMap<String, Object>> list = pflowlogMapper.statByDay("" + device.getDeviceid(), month);
				for (int i = 0; i < list.size(); i++) {
					HashMap<String, Object> hash = list.get(i);
					int sequence = Integer.parseInt(hash.get("sequence").toString());
					cell = row.getCell(sequence);
					if (cell != null) {
						cell.setCellValue(hash.get("amount").toString());
					}
				}
			}

			sheet.autoSizeColumn(0);
			for (int i = 0; i < maxDate; i++) {
				sheet.autoSizeColumn(i + 1);
			}

			FileOutputStream fOut = new FileOutputStream("/tmp/pflowlog-" + month + ".xls");
			workbook.write(fOut);
			fOut.flush();
			fOut.close();
			workbook.close();
			inputStream = new FileInputStream("/tmp/pflowlog-" + month + ".xls");
			downloadname = "pflowlog-" + month + ".xls";
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PflowlogAction doDownloadByDay exception. ", ex);
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
