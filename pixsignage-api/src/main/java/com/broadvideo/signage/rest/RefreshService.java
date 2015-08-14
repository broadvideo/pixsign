package com.broadvideo.signage.rest;

import java.io.StringReader;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.apache.log4j.Logger;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.xml.sax.InputSource;

import com.broadvideo.signage.common.CommonConfig;
import com.broadvideo.signage.domain.Device;
import com.broadvideo.signage.domain.Schedule;
import com.broadvideo.signage.domain.Schedulefile;
import com.broadvideo.signage.service.DeviceService;
import com.broadvideo.signage.service.ScheduleService;
import com.broadvideo.signage.service.SchedulefileService;

@Component
@Produces("application/xml")
@Path("/refresh")
public class RefreshService {
	private static final Logger log = Logger.getLogger(RefreshService.class);

	@Autowired
	private DeviceService deviceService;
	@Autowired
	private ScheduleService scheduleService;
	@Autowired
	private SchedulefileService schedulefileService;

	@Produces("application/xml")
	@Consumes("application/xml")
	@POST
	public String refresh(String request) {
		log.info("Refresh request: " + request);

		try {
			Document reqdoc = new SAXBuilder().build(new InputSource(new StringReader(request)));
			Element reqroot = reqdoc.getRootElement();
			if (!reqroot.getName().equals("request")) {
				return handleError("-1", "Fail: request format error");
			}
			String hardkey = reqroot.getAttributeValue("hardkey");
			if (hardkey == null || hardkey.equals("")) {
				return handleError("2001", "Fail: hardkey cannot be null.");
			}
			List<Device> devices = deviceService.selectByHardkey(hardkey);
			if (devices.size() == 0) {
				return handleError("2002", "Fail: Device with hardkey '" + hardkey + "' is not registered.");
			}

			Device device = devices.get(0);

			String status = reqroot.getChildText("status");
			if (status != null && status.trim().length() == 1) {
				device.setOnlineflag(status.trim());
				/*
				 * if (status.trim().equals("3")) {
				 * movielogService.updateByType(""+device.getDeviceid(), "1",
				 * "2"); movielogService.updateByType(""+device.getDeviceid(),
				 * "3", "4"); }
				 */
			} else {
				device.setOnlineflag("1");
			}

			try {
				device.setRate(Integer.parseInt(reqroot.getChildText("speed")));
			} catch (Exception e) {
			}

			if (reqroot.getChildText("layout") != null) {
				try {
					device.setOnlinelayoutid(Integer.parseInt(reqroot.getChildText("layout")));
				} catch (Exception e) {
					device.setOnlinelayoutid(0);
				}
			}

			if (reqroot.getChildText("video") != null) {
				try {
					device.setOnlinemediaid(Integer.parseInt(reqroot.getChildText("video")));
				} catch (Exception e) {
					device.setOnlinemediaid(0);
				}
			}

			device.setLastservertime(Calendar.getInstance().getTime());

			SimpleDateFormat dateformat = new SimpleDateFormat("yyyyMMddHHmmss");
			if (reqroot.getChildText("time") != null) {
				try {
					device.setLastlocaltime(dateformat.parse(reqroot.getChildText("time")));
				} catch (Exception e) {
					device.setLastlocaltime(Calendar.getInstance().getTime());
				}
			}

			Element rsproot = new Element("response");
			Document rspdoc = new Document(rsproot);
			rsproot.addContent(new Element("time").setText(dateformat.format(Calendar.getInstance().getTime())));

			setScheduleAndFileResponses(rsproot, device);
			setConfigResponses(rsproot, device);
			setUpgradeResponses(rsproot, device);

			boolean refreshFlag = false;
			if (device.getSchedulestatus().equals("1")) {
				refreshFlag = true;
				device.setSchedulestatus("2");
			}
			if (device.getConfigstatus().equals("1")) {
				refreshFlag = true;
				device.setConfigstatus("0");
			}

			if (device.getUpgradestatus().equals("1")) {
				refreshFlag = true;
				device.setUpgradestatus("2");
			}
			if (reqroot.getChildText("deviceversion") != null) {
				if (device.getUpgradeversion().equals(reqroot.getChildText("deviceversion"))) {
					device.setUpgradestatus("0");
					device.setUpgradeversion("");
				}
				device.setVersion(reqroot.getChildText("deviceversion"));
			}

			deviceService.updateDevice(device);

			rsproot.setAttribute("code", "0");
			rsproot.setAttribute("message", "Success");
			XMLOutputter xmlOutput = new XMLOutputter();
			xmlOutput.setFormat(Format.getPrettyFormat().setEncoding("UTF-8"));
			String response = xmlOutput.outputString(rspdoc);
			if (refreshFlag) {
				log.info(
						"Refresh response to " + device.getHardkey() + "(" + device.getTerminalid() + "): " + response);
			} else {
				log.info(
						"Refresh response to " + device.getHardkey() + "(" + device.getTerminalid() + "): " + response);
			}
			return response;
		} catch (Exception ex) {
			ex.printStackTrace();
			return handleError("-1", ex.getMessage());
		}
	}

	private void setScheduleAndFileResponses(Element response, Device device) {
		Element schedulesElement = new Element("schedules");
		response.addContent(schedulesElement);
		Element filesElement = new Element("files");
		response.addContent(filesElement);

		Map<String, Schedulefile> schedulefileHash = new HashMap<String, Schedulefile>();

		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		if (device.getSchedulestatus().equals("1")) {
			List<Schedule> schedules = scheduleService.selectListToSyncByDevice("" + device.getDeviceid());
			for (int i = 0; i < schedules.size(); i++) {
				Schedule schedule = schedules.get(i);
				Element scheduleElement = new Element("schedule");
				scheduleElement.addContent(new Element("id").setText("" + schedule.getScheduleid()));
				scheduleElement.addContent(new Element("layout").setText("" + schedule.getLayoutid()));
				scheduleElement.addContent(new Element("priority").setText("" + schedule.getScheduleid()));

				if (schedule.getType() != null && schedule.getType().equals("2")) {
					scheduleElement.addContent(new Element("type").setText("urgent"));
				} else {
					scheduleElement.addContent(new Element("type").setText("normal"));
				}
				scheduleElement.addContent(new Element("from").setText(dateFormat.format(schedule.getFromdate())));
				scheduleElement.addContent(new Element("to").setText(dateFormat.format(schedule.getTodate())));
				schedulesElement.addContent(scheduleElement);

				schedulefileService.insertSchedulefileBySchedule(schedule);
				List<Schedulefile> schedulefiles = schedulefileService.selectBySchedule("" + schedule.getScheduleid(),
						null, null);

				for (int j = 0; j < schedulefiles.size(); j++) {
					Schedulefile schedulefile = schedulefiles.get(j);
					if (schedulefile.getFiletype().equals("0")) {
						Element fileElement = new Element("file");
						fileElement.addContent(new Element("id").setText("" + schedulefile.getFileid()));
						fileElement.addContent(new Element("type").setText("layout"));
						fileElement.addContent(new Element("downloadmode").setText("0"));
						fileElement.addContent(new Element("name").setText(schedulefile.getFilename()));
						fileElement.addContent(new Element("uri").setText("http://" + CommonConfig.CONFIG_SERVER_IP
								+ ":" + CommonConfig.CONFIG_SERVER_PORT
								+ "/pixsignage/org/layout!download.action?layoutid=" + schedulefile.getFileid()));
						fileElement.addContent(new Element("size").setText("" + schedulefile.getFilesize()));
						fileElement.addContent(new Element("md5").setText(schedulefile.getMd5()));
						filesElement.addContent(fileElement);
					} else if (schedulefile.getFiletype().equals("1") || // image
							schedulefile.getFiletype().equals("2") || // video
							schedulefile.getFiletype().equals("4")) { // advert
						if (schedulefileHash.get("" + schedulefile.getFileid()) == null) {
							Element fileElement = new Element("file");
							fileElement.addContent(new Element("id").setText("" + schedulefile.getFileid()));
							if (schedulefile.getFiletype().equals("1")) {
								fileElement.addContent(new Element("type").setText("image"));
							} else {
								fileElement.addContent(new Element("type").setText("video"));
							}
							if (schedulefile.getUploadtype().equals("0")) {
								fileElement.addContent(new Element("downloadmode").setText("0"));
								fileElement.addContent(new Element("uri").setText("http://"
										+ CommonConfig.CONFIG_SERVER_IP + ":" + CommonConfig.CONFIG_SERVER_PORT
										+ "/pixsigdata" + schedulefile.getFilename()));
							} else if (schedulefile.getUploadtype().equals("1")) {
								fileElement.addContent(new Element("downloadmode").setText("2"));
								fileElement.addContent(new Element("uri").setText(schedulefile.getFileuri()));
							}
							fileElement.addContent(new Element("name").setText(schedulefile.getFilename()));
							fileElement.addContent(new Element("size").setText("" + schedulefile.getFilesize()));
							fileElement.addContent(new Element("md5").setText(schedulefile.getMd5()));
							filesElement.addContent(fileElement);
							schedulefileHash.put("" + schedulefile.getFileid(), schedulefile);
						}
					}
				}

				if (schedulefiles.size() == 0) {
					schedule.setSyncstatus("2");
					schedule.setSyncstarttime(Calendar.getInstance().getTime());
					schedule.setSyncendtime(schedule.getSyncstarttime());
				} else {
					schedule.setSyncstatus("1");
					schedule.setSyncstarttime(Calendar.getInstance().getTime());
				}
				scheduleService.updateSchedule(schedule);
			}

		}

	}

	private void setConfigResponses(Element response, Device device) {
		Element configElement = new Element("config");
		response.addContent(configElement);
	}

	private void setUpgradeResponses(Element response, Device device) {
		Element upgradeElement = new Element("upgrade");
		response.addContent(upgradeElement);
	}

	private String handleError(String code, String message) {
		Element root = new Element("response");
		Document doc = new Document(root);
		root.setAttribute("code", code);
		root.setAttribute("message", message);

		XMLOutputter xmlOutput = new XMLOutputter();
		xmlOutput.setFormat(Format.getPrettyFormat().setEncoding("UTF-8"));
		String response = xmlOutput.outputString(doc);
		log.info("Refresh response: " + response);
		return response;
	}
}
