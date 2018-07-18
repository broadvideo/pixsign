package com.broadvideo.pixsignage.action.signage;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.io.comparator.LastModifiedFileComparator;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Planbind;
import com.broadvideo.pixsignage.domain.Schedule;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.service.DeviceService;
import com.broadvideo.pixsignage.service.PlanService;
import com.broadvideo.pixsignage.service.ScheduleService;
import com.broadvideo.pixsignage.util.EduCloudUtil;
import com.broadvideo.pixsignage.util.PixedxUtil;
import com.broadvideo.pixsignage.util.SqlUtil;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.ibm.icu.util.Calendar;

@SuppressWarnings("serial")
@Scope("request")
@Controller("deviceAction")
public class DeviceAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Device device;

	private String exportname;
	private InputStream inputStream;

	@Autowired
	private ConfigMapper configMapper;

	@Autowired
	private DeviceService deviceService;
	@Autowired
	private ScheduleService scheduleService;
	@Autowired
	private PlanService planService;

	public String doGet() {
		try {
			String deviceid = getParameter("deviceid");
			device = deviceService.selectByPrimaryKey(deviceid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction doGet exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doList() {
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
			String subbranchflag = getParameter("subbranchflag");
			if (subbranchflag == null) {
				subbranchflag = "1";
			}
			String status = getParameter("status");
			String onlineflag = getParameter("onlineflag");
			if (onlineflag != null && onlineflag.equals("")) {
				onlineflag = null;
			}
			String devicegroupid = getParameter("devicegroupid");
			String devicegridid = getParameter("devicegridid");
			String cataitemid1 = getParameter("cataitemid1");
			String cataitemid2 = getParameter("cataitemid2");
			String order = getParameter("order");
			if (order == null || order.equals("")) {
				order = "deviceid";
			}
			String orgid = null;
			if (getLoginStaff().getOrgid() != null) {
				orgid = "" + getLoginStaff().getOrgid();
			}

			int count = deviceService.selectCount(orgid, branchid, subbranchflag, status, onlineflag, devicegroupid,
					devicegridid, cataitemid1, cataitemid2, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Device> deviceList = deviceService.selectList(orgid, branchid, subbranchflag, status, onlineflag,
					devicegroupid, devicegridid, cataitemid1, cataitemid2, search, start, length, order);
			for (int i = 0; i < deviceList.size(); i++) {
				// avedia2 code
				String terminalid = deviceList.get(i).getTerminalid();
				String sstatus = deviceList.get(i).getStatus();
				String oflag = deviceList.get(i).getOnlineflag();
				if (terminalid.startsWith("avedia2") && sstatus.equals("1") && oflag.equals("0")) {
					int j = getLastOnlineDevice(deviceList, i);
					deviceList.get(i).setOnlineflag(deviceList.get(j).getOnlineflag());
					deviceList.get(i).setRefreshtime(deviceList.get(j).getRefreshtime());
				}
				// avedia2 code
				aaData.add(deviceList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	// avedia2 code
	private int getLastOnlineDevice(List<Device> list, int index) {
		for (int i = index + 5; i < list.size() + index + 5; i++) {
			int j = i % list.size();
			Device device = list.get(j);
			if (device.getStatus().equals("1") && device.getOnlineflag().equals("1")) {
				logger.info("getLastOnlineDevice avedia2 replace device {} to device {}", index, j);
				return j;
			}
		}
		return 0;
	}
	// avedia2 code

	public String doAdd() {
		try {
			device.setOrgid(getLoginStaff().getOrgid());
			device.setBranchid(getLoginStaff().getBranchid());
			deviceService.addDevice(device);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			deviceService.updateDeviceSelective(device);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			String deviceid = getParameter("deviceid");
			deviceService.unbind(deviceid);
			logger.info("Device unbind success, deviceid={}", deviceid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdateUpgradeflag() {
		try {
			String orgid = "" + getLoginStaff().getOrgid();
			String branchid = getParameter("branchid");
			String upgradeflag = getParameter("upgradeflag");
			deviceService.updateUpgradeflag(orgid, branchid, upgradeflag);
			logger.info("Device updateUpgradeflag success, orgid={},branchid={},upgradeflag={}", orgid, branchid,
					upgradeflag);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction doUpdateUpgradeflag exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdateBundle() {
		try {
			String defaultbundleid = getParameter("defaultbundleid");
			String deviceids = getParameter("deviceids");
			logger.info("Device doUpdateBundle, deviceids={},defaultbundleid={}", deviceids, defaultbundleid);
			deviceService.updateBundle(deviceids.split(","), defaultbundleid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction doUpdateBundle exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdatePage() {
		try {
			String defaultpageid = getParameter("defaultpageid");
			String deviceids = getParameter("deviceids");
			logger.info("Device doUpdatePage, deviceids={},defaultpageid={}", deviceids, defaultpageid);
			deviceService.updatePage(deviceids.split(","), defaultpageid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction doUpdatePage exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doSync() {
		try {
			String deviceid = getParameter("deviceid");
			logger.info("Device doSync, deviceid={}", deviceid);
			planService.syncPlan(Planbind.BindType_Device, deviceid);
			scheduleService.syncSchedule(Schedule.BindType_Device, deviceid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction schedule sync error", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doConfig() {
		try {
			String deviceid = getParameter("deviceid");
			logger.info("Device doConfig, deviceid={}", deviceid);
			if (deviceid != null && deviceid.length() > 0) {
				deviceService.config(deviceid);
				logger.info("Device config success, deviceid={}", deviceid);
			} else {
				deviceService.configall("" + getLoginStaff().getOrgid());
				logger.info("Device configall success, orgid={}", getLoginStaff().getOrgid());
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction push config error ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doReboot() {
		try {
			String deviceid = getParameter("deviceid");
			logger.info("Device doReboot, deviceid={}", deviceid);
			deviceService.reboot(deviceid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction reboot error ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doPoweroff() {
		try {
			String deviceid = getParameter("deviceid");
			logger.info("Device doPoweroff, deviceid={}", deviceid);
			deviceService.poweroff(deviceid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction poweroff error ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doScreen() {
		try {
			String deviceid = getParameter("deviceid");
			logger.info("Device doScreen, deviceid={}", deviceid);
			deviceService.screen(deviceid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("Device screen error ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doRoomList() {
		try {
			List<Object> aaData = new ArrayList<Object>();

			String schoolflag = getLoginStaff().getOrg().getSchoolflag();
			if (schoolflag.equals("1")) {
				// PIX
				String pixedxip = configMapper.selectValueByCode("ServerIP");
				String pixedxport = configMapper.selectValueByCode("ServerPort");
				String server = "http://" + pixedxip + ":" + pixedxport;
				String s = PixedxUtil.classrooms(server, getLoginStaff().getOrg().getCode());
				if (s.length() > 0) {
					JSONObject json = new JSONObject(s);
					JSONArray roomJsonArray = json.getJSONArray("data");
					for (int i = 0; i < roomJsonArray.length(); i++) {
						HashMap<String, String> room = new HashMap<String, String>();
						room.put("id", "" + roomJsonArray.getJSONObject(i).getInt("id"));
						room.put("name", roomJsonArray.getJSONObject(i).getString("name"));
						aaData.add(room);
					}
				}
			} else if (schoolflag.equals("2")) {
				// JYY
				String s = EduCloudUtil.getClassList(getLoginStaff().getOrg().getCode());
				if (s.length() > 0) {
					JSONObject json = new JSONObject(s);
					JSONArray roomJsonArray = json.getJSONArray("result");
					if (roomJsonArray != null) {
						for (int i = 0; i < roomJsonArray.length(); i++) {
							HashMap<String, String> room = new HashMap<String, String>();
							room.put("id", roomJsonArray.getJSONObject(i).getString("code"));
							room.put("name", roomJsonArray.getJSONObject(i).getString("name"));
							aaData.add(room);
						}
					}
				}
			}

			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction doRoomList error ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doScreenList() {
		try {
			String deviceid = getParameter("deviceid");
			File[] files = new File(CommonConfig.CONFIG_PIXDATA_HOME + "/screen/" + deviceid).listFiles();

			List<Object> aaData = new ArrayList<Object>();
			if (files != null && files.length > 0) {
				Arrays.sort(files, LastModifiedFileComparator.LASTMODIFIED_REVERSE);

				for (int i = 0; i < files.length; i++) {
					if (i >= 12) {
						break;
					}
					HashMap<String, String> screen = new HashMap<String, String>();
					screen.put("deviceid", deviceid);
					screen.put("createtime",
							new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(files[i].lastModified())));
					screen.put("screen", "/screen/" + deviceid + "/" + files[i].getName());
					aaData.add(screen);
				}
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction doScreenList error ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doQrcode() {
		try {
			String deviceid = getParameter("deviceid");
			Device device = deviceService.selectByPrimaryKey(deviceid);
			exportname = "qrcode-" + deviceid + ".png";
			String text = "http://180.96.19.239/pixwidget/widget/app.jsp?ip=" + device.getIip();

			BitMatrix bitMatrix = new MultiFormatWriter().encode(text, BarcodeFormat.QR_CODE, 400, 400);
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			MatrixToImageWriter.writeToStream(bitMatrix, "png", out);
			inputStream = new ByteArrayInputStream(out.toByteArray());

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction doQrcode exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUText() {
		try {
			String text = getParameter("text");
			String count = getParameter("count");
			String position = getParameter("position");
			String speed = getParameter("speed");
			String color = getParameter("color");
			String size = getParameter("size");
			String bgcolor = getParameter("bgcolor");
			String opacity = getParameter("opacity");
			logger.info("Send utext of {}: {}", getLoginStaff().getOrg().getCode(), text);
			deviceService.utext("" + getLoginStaff().getOrgid(), text, count, position, speed, color, size, bgcolor,
					opacity);
			logger.info("Device utext success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction utext error ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUCancel() {
		try {
			logger.info("Send ucancel of {}", getLoginStaff().getOrg().getCode());
			deviceService.ucancel("" + getLoginStaff().getOrgid());
			logger.info("Device ucancel success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction ucancel error ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doExport() {
		try {
			HSSFWorkbook workbook = new HSSFWorkbook();
			HSSFSheet sheet = workbook.createSheet();
			HSSFCellStyle style = workbook.createCellStyle();
			style.setWrapText(true);
			int count = 0;
			HSSFRow row;
			HSSFCell cell;

			List<Device> list = deviceService.selectList("" + getLoginStaff().getOrgid(),
					"" + getLoginStaff().getBranchid(), "1", "1", null, null, null, null, null, null, null, null,
					"default");
			for (int i = 0; i < list.size(); i++) {
				Device device = list.get(i);
				row = sheet.createRow(count);
				cell = row.createCell(0, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(device.getTerminalid());
				cell = row.createCell(1, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(device.getName());
				cell = row.createCell(2, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(device.getBranch().getName());
				cell = row.createCell(3, HSSFCell.CELL_TYPE_STRING);
				if (device.getOnlineflag().equals("1")) {
					cell.setCellValue("在线");
				} else {
					cell.setCellValue("离线");
				}
				cell = row.createCell(4, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(device.getIip());
				cell = row.createCell(5, HSSFCell.CELL_TYPE_STRING);
				cell.setCellValue(device.getAppname());
				count++;
			}

			sheet.setColumnWidth(0, 5000);
			sheet.setColumnWidth(1, 5000);
			sheet.setColumnWidth(2, 10000);
			sheet.setColumnWidth(3, 3000);
			sheet.setColumnWidth(4, 5000);
			sheet.setColumnWidth(5, 6000);

			exportname = "device-" + Calendar.getInstance().getTimeInMillis() + ".xls";
			FileOutputStream fOut = new FileOutputStream("/tmp/" + exportname);
			workbook.write(fOut);
			fOut.flush();
			fOut.close();
			workbook.close();
			inputStream = new FileInputStream("/tmp/" + exportname);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction doExport exception. ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Device getDevice() {
		return device;
	}

	public void setDevice(Device device) {
		this.device = device;
	}

	public String getExportname() {
		return exportname;
	}

	public void setExportname(String exportname) {
		this.exportname = exportname;
	}

	public InputStream getInputStream() {
		return inputStream;
	}

	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}

}
