package com.broadvideo.pixsignage.action;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FilenameFilter;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.io.comparator.LastModifiedFileComparator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.service.BundleService;
import com.broadvideo.pixsignage.service.DeviceService;
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
			String status = getParameter("status");
			String devicegroupid = getParameter("devicegroupid");
			String order = getParameter("order");
			if (order == null || order.equals("")) {
				order = "deviceid";
			}

			int count = deviceService.selectCount("" + getLoginStaff().getOrgid(), branchid, status, devicegroupid,
					search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Device> deviceList = deviceService.selectList("" + getLoginStaff().getOrgid(), branchid, status,
					devicegroupid, search, start, length, order);
			for (int i = 0; i < deviceList.size(); i++) {
				aaData.add(deviceList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
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
			ex.printStackTrace();
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
			ex.printStackTrace();
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
			ex.printStackTrace();
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
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doSync() {
		try {
			String deviceid = getParameter("deviceid");
			bundleService.syncBundleLayout("1", deviceid);
			bundleService.syncBundleRegions("1", deviceid);
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

	public String doAPPList() {
		try {
			List<Object> aaData = new ArrayList<Object>();
			if (getLoginStaff().getOrg().getVspid().intValue() == 3) { // AK
				HashMap<String, String> app1 = getAppFile("DigitalBox_LAUNCHER_UWIN_JIM", "a83t", "A83T", "Launcher版");
				if (app1 != null) {
					aaData.add(app1);
				}
			} else {
				HashMap<String, String> app1 = getAppFile("DigitalBox_APP_UWIN_SINGLE", "a83t", "A83T", "开机自启App版(单屏)");
				if (app1 != null) {
					aaData.add(app1);
				}
				HashMap<String, String> app2 = getAppFile("DigitalBox_LAUNCHER_UWIN_SINGLE", "a83t", "A83T",
						"Launcher版(单屏)");
				if (app2 != null) {
					aaData.add(app2);
				}
				HashMap<String, String> app3 = getAppFile("DigitalBox_LAUNCHER_UWIN", "a83t", "A83T", "Launcher版(双屏)");
				if (app3 != null) {
					aaData.add(app3);
				}

				HashMap<String, String> app4 = getAppFile("DigitalBox_APP", "3288", "RK3288", "开机自启App版");
				if (app4 != null) {
					aaData.add(app4);
				}
				HashMap<String, String> app5 = getAppFile("DigitalBox_LAUNCHER", "3288", "RK3288", "Launcher版");
				if (app5 != null) {
					aaData.add(app5);
				}
				HashMap<String, String> app6 = getAppFile("DigitalBox_LAUNCHER_SHANXI", "3288", "RK3288",
						"Launcher版(支持投影仪控制)");
				if (app6 != null) {
					aaData.add(app6);
				}
			}

			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("Device doAPPList error ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	private HashMap<String, String> getAppFile(String appname, String subdir, String mainboard, String description) {
		File dir = new File("/opt/pixdata/app/" + subdir);
		File[] files = dir.listFiles(new FilenameFilter() {
			@Override
			public boolean accept(File dir, String name) {
				return name.startsWith(appname + "-") && name.endsWith((".apk"));
			}
		});

		if (files != null && files.length > 0) {
			Arrays.sort(files, LastModifiedFileComparator.LASTMODIFIED_REVERSE);

			String vname = "";
			String vcode = "0";
			String filename = files[0].getName();
			String[] apks = filename.split("-");
			if (apks.length >= 3) {
				vname = apks[1];
				vcode = apks[2];
				if (vcode.indexOf(".") > 0) {
					vcode = vcode.substring(0, vcode.indexOf("."));
				}
			}

			HashMap<String, String> app = new HashMap<String, String>();
			app.put("mainboard", mainboard);
			app.put("description", description);
			app.put("file", files[0].getName());
			app.put("url", "/pixdata/app/" + subdir + "/" + files[0].getName());
			app.put("vname", vname);
			app.put("vcode", vcode);
			app.put("time", "" + new File("/opt/pixdata/app/" + subdir + "/" + files[0].getName()).lastModified());
			return app;
		} else {
			return null;
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
