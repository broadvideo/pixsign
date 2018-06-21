package com.broadvideo.pixsignage.action.signage;

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

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.HourflowlogMapper;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("flowlogAction")
public class FlowlogAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private String downloadname;
	private InputStream inputStream;

	@Autowired
	private HourflowlogMapper hourflowlogMapper;
	@Autowired
	private DeviceMapper deviceMapper;

	public String doDeviceStatList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			String branchid = getParameter("branchid");
			if ((branchid == null || branchid.equals("")) && getLoginStaff().getBranchid() != null) {
				branchid = "" + getLoginStaff().getBranchid();
			}

			List<Object> aaData = new ArrayList<Object>();
			int count = hourflowlogMapper.selectDeviceStatCount("" + getLoginStaff().getOrgid(), branchid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<HashMap<String, Object>> list = hourflowlogMapper.selectDeviceStatList("" + getLoginStaff().getOrgid(),
					branchid, search, start, length);
			for (int i = 0; i < list.size(); i++) {
				// avedia2 code
				String terminalid = "" + list.get(i).get("terminalid");
				String onlineflag = "" + list.get(i).get("onlineflag");
				String amount3 = "" + list.get(i).get("amount3");
				logger.info("terminalid={},onlineflag={},amount1={}", terminalid, onlineflag, amount3);
				if (terminalid.startsWith("avedia2")
						&& (onlineflag.equals("0") || amount3.equals("[]") || amount3.equals("[null]"))) {
					int j = getLastOnlineData(list, i);
					list.get(i).put("deviceid", list.get(j).get("deviceid"));
					list.get(i).put("onlineflag", list.get(j).get("onlineflag"));
					list.get(i).put("amount1", list.get(j).get("amount1"));
					list.get(i).put("amount2", list.get(j).get("amount2"));
					list.get(i).put("amount3", list.get(j).get("amount3"));
					list.get(i).put("amount4", list.get(j).get("amount4"));
				}
				// avedia2 code
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("FlowlogAction doDeviceStatList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	// avedia2 code
	private int getLastOnlineData(List<HashMap<String, Object>> list, int index) {
		for (int i = index + 5; i < list.size() + index + 5; i++) {
			int j = i % list.size();
			HashMap<String, Object> data = list.get(j);
			String onlineflag = "" + data.get("onlineflag");
			String amount3 = "" + data.get("amount3");
			if (onlineflag.equals("1") && !amount3.equals("[]") && !amount3.equals("[null]")) {
				logger.info("getLastOnlineData avedia2 replace device {} to device {}", index, j);
				return j;
			}
		}
		return 0;
	}
	// avedia2 code

	public String doStatPeriodByDay() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String deviceid = getParameter("deviceid");
			String day = getParameter("day");
			day = day.replace("-", "");

			List<Object> aaData = new ArrayList<Object>();
			List<HashMap<String, Object>> list = hourflowlogMapper.statPeriodByDay(deviceid, day);
			for (int i = 0; i < list.size(); i++) {
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("FlowlogAction doStatPeriodByDay exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doStatCatalogByDay() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String deviceid = getParameter("deviceid");
			String day = getParameter("day");
			day = day.replace("-", "");

			List<Object> aaData = new ArrayList<Object>();
			List<HashMap<String, Object>> list = hourflowlogMapper.statCatalogByDay(deviceid, day);
			for (int i = 0; i < list.size(); i++) {
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("FlowlogAction doStatCatalogByDay exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doStatPeriodByMonth() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String deviceid = getParameter("deviceid");
			String month = getParameter("month");
			month = month.replace("-", "");

			List<Object> aaData = new ArrayList<Object>();
			List<HashMap<String, Object>> list = hourflowlogMapper.statPeriodByMonth(deviceid, month);
			for (int i = 0; i < list.size(); i++) {
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("FlowlogAction doStatPeriodByMonth exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doStatCatalogByMonth() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String deviceid = getParameter("deviceid");
			String month = getParameter("month");
			month = month.replace("-", "");

			List<Object> aaData = new ArrayList<Object>();
			List<HashMap<String, Object>> list = hourflowlogMapper.statCatalogByMonth(deviceid, month);
			for (int i = 0; i < list.size(); i++) {
				aaData.add(list.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("FlowlogAction doStatCatalogByMonth exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDownloadByDay() {
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

			// List<Device> devices = deviceMapper.selectList("" +
			// getLoginStaff().getOrgid(), null, null, "1", null, null,
			// null, null, null, null, null, null, "deviceid");
			List<HashMap<String, Object>> devices = hourflowlogMapper
					.selectDeviceStatList("" + getLoginStaff().getOrgid(), null, null, null, null);
			for (HashMap<String, Object> device : devices) {
				count++;
				row = sheet.createRow(count);
				cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue("" + device.get("terminalid") + "(" + device.get("name") + ")");
				for (int i = 0; i < 24; i++) {
					cell = row.createCell((i + 1), HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue("0");
				}

				// avedia2
				String deviceid = "" + device.get("deviceid");
				String terminalid = "" + device.get("terminalid");
				String onlineflag = "" + device.get("onlineflag");
				String amount3 = "" + device.get("amount3");
				logger.info("terminalid={},onlineflag={},amount1={}", terminalid, onlineflag, amount3);
				if (terminalid.startsWith("avedia2")
						&& (onlineflag.equals("0") || amount3.equals("[]") || amount3.equals("[null]"))) {
					int j = getLastOnlineData(devices, count - 1);
					deviceid = "" + devices.get(j).get("deviceid");
				}
				// avedia2
				List<HashMap<String, Object>> list = hourflowlogMapper.statPeriodByDay("" + deviceid, day);
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

			FileOutputStream fOut = new FileOutputStream("/tmp/flowlog-" + day + ".xls");
			workbook.write(fOut);
			fOut.flush();
			fOut.close();
			workbook.close();
			inputStream = new FileInputStream("/tmp/flowlog-" + day + ".xls");
			downloadname = "flowlog-" + day + ".xls";
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("FlowlogAction doDownloadByHour exception. ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDownloadByMonth() {
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

			// List<Device> devices = deviceMapper.selectList("" +
			// getLoginStaff().getOrgid(), null, null, "1", null, null,
			// null, null, null, null, null, null, "deviceid");
			List<HashMap<String, Object>> devices = hourflowlogMapper
					.selectDeviceStatList("" + getLoginStaff().getOrgid(), null, null, null, null);
			for (HashMap<String, Object> device : devices) {
				count++;
				row = sheet.createRow(count);
				cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue("" + device.get("terminalid") + "(" + device.get("name") + ")");
				for (int i = 0; i < maxDate; i++) {
					cell = row.createCell((i + 1), HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue("0");
				}

				// avedia2
				String deviceid = "" + device.get("deviceid");
				String terminalid = "" + device.get("terminalid");
				String onlineflag = "" + device.get("onlineflag");
				String amount3 = "" + device.get("amount3");
				logger.info("terminalid={},onlineflag={},amount1={}", terminalid, onlineflag, amount3);
				if (terminalid.startsWith("avedia2")
						&& (onlineflag.equals("0") || amount3.equals("[]") || amount3.equals("[null]"))) {
					int j = getLastOnlineData(devices, count - 1);
					deviceid = "" + devices.get(j).get("deviceid");
				}
				// avedia2
				List<HashMap<String, Object>> list = hourflowlogMapper.statPeriodByMonth("" + deviceid, month);
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

			FileOutputStream fOut = new FileOutputStream("/tmp/flowlog-" + month + ".xls");
			workbook.write(fOut);
			fOut.flush();
			fOut.close();
			workbook.close();
			inputStream = new FileInputStream("/tmp/flowlog-" + month + ".xls");
			downloadname = "flowlog-" + month + ".xls";
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("FlowlogAction doDownloadByDay exception. ", ex);
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
