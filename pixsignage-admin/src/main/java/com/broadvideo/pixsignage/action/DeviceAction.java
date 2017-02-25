package com.broadvideo.pixsignage.action;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.io.comparator.LastModifiedFileComparator;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.service.BundleService;
import com.broadvideo.pixsignage.service.DeviceService;
import com.broadvideo.pixsignage.util.EduCloudUtil;
import com.broadvideo.pixsignage.util.PixedxUtil;
import com.broadvideo.pixsignage.util.SqlUtil;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;

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
	private BundleService bundleService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}
			String type = getParameter("type");
			String status = getParameter("status");
			String devicegroupid = getParameter("devicegroupid");
			String order = getParameter("order");
			if (order == null || order.equals("")) {
				order = "deviceid";
			}

			int count = deviceService.selectCount("" + getLoginStaff().getOrgid(), branchid, type, status, null,
					devicegroupid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Device> deviceList = deviceService.selectList("" + getLoginStaff().getOrgid(), branchid, type, status,
					null, devicegroupid, search, start, length, order);
			for (int i = 0; i < deviceList.size(); i++) {
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
			deviceService.deleteDevice("" + device.getDeviceid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doGet() {
		try {
			int deviceid = device.getDeviceid();
			device = deviceService.selectByPrimaryKey("" + deviceid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DeviceAction doGet exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doSync() {
		try {
			String deviceid = getParameter("deviceid");
			bundleService.syncBundleSchedule("1", deviceid);
			logger.info("Device schedule sync success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("Device schedule sync error", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doConfig() {
		try {
			String deviceid = getParameter("deviceid");
			if (deviceid != null && deviceid.length() > 0) {
				deviceService.config(deviceid);
			} else {
				deviceService.configall("" + getLoginStaff().getOrgid());
			}
			logger.info("Device push config success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("Device push config error ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doReboot() {
		try {
			String deviceid = getParameter("deviceid");
			deviceService.reboot(deviceid);
			logger.info("Device reboot success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("Device reboot error ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doPoweroff() {
		try {
			String deviceid = getParameter("deviceid");
			deviceService.poweroff(deviceid);
			logger.info("Device poweroff success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("Device poweroff error ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doScreen() {
		try {
			String deviceid = getParameter("deviceid");
			deviceService.screen(deviceid);
			logger.info("Device screen success");
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

			String pixedxip = configMapper.selectValueByCode("PixedxIP");
			String pixedxport = configMapper.selectValueByCode("PixedxPort");
			if (pixedxip.equals("www.jzjyy.cn")) {
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
			} else {
				String server = "http://" + pixedxip + ":" + pixedxport;
				String s = PixedxUtil.classrooms(server);
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
			}

			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("Device doRoomList error ", ex);
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
					if (i >= 10) {
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
			logger.error("Device doScreenList error ", ex);
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
			logger.error("doExport exception, ", ex);
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
			logger.error("Device utext error ", ex);
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
			logger.error("Device ucancel error ", ex);
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
