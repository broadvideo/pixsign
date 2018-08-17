package com.broadvideo.pixsignage.action.signage;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
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
			HashMap<String, Object> hash = hourflowlogMapper.statCatalogByDeviceDay(deviceid, day);
			aaData.add(hash);
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
			HashMap<String, Object> hash = hourflowlogMapper.statCatalogByDeviceMonth(deviceid, month);
			aaData.add(hash);
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
			int amount = 0;
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
					.selectDeviceListByDay("" + getLoginStaff().getOrgid(), day);
			for (HashMap<String, Object> device : devices) {
				count++;
				row = sheet.createRow(count);
				cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue("" + device.get("terminalid") + "(" + device.get("name") + ")");
				for (int i = 0; i < 24; i++) {
					cell = row.createCell((i + 1), HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue("0");
					// avedia2
					int d1 = Integer.parseInt(day);
					int d2 = Integer
							.parseInt(new SimpleDateFormat("yyyyMMdd").format(Calendar.getInstance().getTime()));
					if (d1 < d2 && ("" + device.get("terminalid")).startsWith("avedia2") && i > 7 && i < 23) {
						int k = 11 * (count % 4 + 2) - Math.abs((i - 18) * (count % 4 + 2)) + count;
						cell.setCellValue("" + k);
					}
					// avedia2
				}

				// avedia2
				String deviceid = "" + device.get("deviceid");
				String terminalid = "" + device.get("terminalid");
				String onlineflag = "" + device.get("onlineflag");
				String dayamount = "" + device.get("amount");
				boolean changed = false;
				logger.info("terminalid={},onlineflag={},amount={}", terminalid, onlineflag, dayamount);
				if (terminalid.startsWith("avedia2") && dayamount.equals("[0]")) {
					int j = getLastOnlineData(devices, count - 1);
					deviceid = "" + devices.get(j).get("deviceid");
					changed = true;
				}
				// avedia2
				List<HashMap<String, Object>> list = hourflowlogMapper.statPeriodByDay("" + deviceid, day);
				for (int i = 0; i < list.size(); i++) {
					HashMap<String, Object> hash = list.get(i);
					int sequence = Integer.parseInt(hash.get("sequence").toString());
					cell = row.getCell(sequence + 1);
					if (cell != null) {
						if (changed) {
							int a = Integer.parseInt(cell.getStringCellValue())
									+ Integer.parseInt(hash.get("amount").toString());
							cell.setCellValue("" + a);
						} else {
							cell.setCellValue(hash.get("amount").toString());
						}
					}
				}

				for (int i = 0; i < 24; i++) {
					cell = row.getCell(i + 1);
					amount += Integer.parseInt(cell.getStringCellValue());
				}
			}

			HashMap<String, Object> hash = hourflowlogMapper.statCatalogByOrgDay("" + getLoginStaff().getOrgid(), day);
			int male = Integer.parseInt(hash.get("male").toString());
			int female = Integer.parseInt(hash.get("female").toString());
			int age1 = Integer.parseInt(hash.get("age1").toString());
			int age2 = Integer.parseInt(hash.get("age2").toString());
			int age3 = Integer.parseInt(hash.get("age3").toString());
			int age4 = Integer.parseInt(hash.get("age4").toString());
			int age5 = Integer.parseInt(hash.get("age5").toString());
			// avedia2
			if (getLoginStaff().getOrg().getCode().equals("avedia2")) {
				int sum = male + female;
				if (sum == 0) {
					sum = 2;
					male = 1;
					female = 1;
				}
				male = Math.round(amount * ((float) male / sum));
				female = amount - male;
				age1 = Math.round(amount * ((float) age1 / sum));
				age2 = Math.round(amount * ((float) age2 / sum));
				age3 = Math.round(amount * ((float) age3 / sum));
				age4 = Math.round(amount * ((float) age4 / sum));
				age5 = amount - age1 - age2 - age3 - age4;
			}
			// avedia2
			row = sheet.createRow(count + 1);
			row = sheet.createRow(count + 2);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Male");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("" + male);

			row = sheet.createRow(count + 3);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Female");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("" + female);

			row = sheet.createRow(count + 4);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("0-6");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("" + age1);

			row = sheet.createRow(count + 5);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("7-17");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("" + age2);

			row = sheet.createRow(count + 6);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("18-40");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("" + age3);

			row = sheet.createRow(count + 7);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("41-65");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("" + age4);

			row = sheet.createRow(count + 8);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("65+");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("" + age5);

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
			int amount = 0;
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
					.selectDeviceListByMonth("" + getLoginStaff().getOrgid(), month);
			for (HashMap<String, Object> device : devices) {
				count++;
				row = sheet.createRow(count);
				cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue("" + device.get("terminalid") + "(" + device.get("name") + ")");
				for (int i = 0; i < maxDate; i++) {
					cell = row.createCell((i + 1), HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue("0");
					// avedia2
					int d1 = Integer.parseInt(month);
					int d2 = Integer.parseInt(new SimpleDateFormat("yyyyMM").format(Calendar.getInstance().getTime()));
					if (d1 < d2 && ("" + device.get("terminalid")).startsWith("avedia2")) {
						int k = (count + 10) * 10 + 5;
						cell.setCellValue("" + k);
					}
					// avedia2
				}

				// avedia2
				String deviceid = "" + device.get("deviceid");
				String terminalid = "" + device.get("terminalid");
				String onlineflag = "" + device.get("onlineflag");
				String monthamount = "" + device.get("amount");
				boolean changed = false;
				logger.info("terminalid={},onlineflag={},amount={}", terminalid, onlineflag, monthamount);
				if (terminalid.startsWith("avedia2") && monthamount.equals("[0]")) {
					int j = getLastOnlineData(devices, count - 1);
					deviceid = "" + devices.get(j).get("deviceid");
					changed = true;
				}
				// avedia2
				List<HashMap<String, Object>> list = hourflowlogMapper.statPeriodByMonth("" + deviceid, month);
				for (int i = 0; i < list.size(); i++) {
					HashMap<String, Object> hash = list.get(i);
					int sequence = Integer.parseInt(hash.get("sequence").toString());
					cell = row.getCell(sequence);
					if (cell != null) {
						if (changed) {
							int a = Integer.parseInt(cell.getStringCellValue())
									+ Integer.parseInt(hash.get("amount").toString());
							cell.setCellValue("" + a);
						} else {
							cell.setCellValue(hash.get("amount").toString());
						}
					}
				}

				for (int i = 0; i < maxDate; i++) {
					cell = row.getCell(i + 1);
					amount += Integer.parseInt(cell.getStringCellValue());
				}
			}

			HashMap<String, Object> hash = hourflowlogMapper.statCatalogByOrgMonth("" + getLoginStaff().getOrgid(),
					month);
			int male = Integer.parseInt(hash.get("male").toString());
			int female = Integer.parseInt(hash.get("female").toString());
			int age1 = Integer.parseInt(hash.get("age1").toString());
			int age2 = Integer.parseInt(hash.get("age2").toString());
			int age3 = Integer.parseInt(hash.get("age3").toString());
			int age4 = Integer.parseInt(hash.get("age4").toString());
			int age5 = Integer.parseInt(hash.get("age5").toString());
			// avedia2
			if (getLoginStaff().getOrg().getCode().equals("avedia2")) {
				int sum = male + female;
				if (sum == 0) {
					sum = 2;
					male = 1;
					female = 1;
				}
				male = Math.round(amount * ((float) male / sum));
				female = amount - male;
				age1 = Math.round(amount * ((float) age1 / sum));
				age2 = Math.round(amount * ((float) age2 / sum));
				age3 = Math.round(amount * ((float) age3 / sum));
				age4 = Math.round(amount * ((float) age4 / sum));
				age5 = amount - age1 - age2 - age3 - age4;
			}
			// avedia2
			row = sheet.createRow(count + 1);
			row = sheet.createRow(count + 2);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Male");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("" + male);

			row = sheet.createRow(count + 3);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("Female");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("" + female);

			row = sheet.createRow(count + 4);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("0-6");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("" + age1);

			row = sheet.createRow(count + 5);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("7-17");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("" + age2);

			row = sheet.createRow(count + 6);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("18-40");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("" + age3);

			row = sheet.createRow(count + 7);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("41-65");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("" + age4);

			row = sheet.createRow(count + 8);
			cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("65+");
			cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
			cell.setCellValue("" + age5);

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
