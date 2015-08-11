package com.broadvideo.signage.rest;

import java.io.StringReader;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

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

import com.broadvideo.signage.domain.Device;
import com.broadvideo.signage.domain.Devicefile;
import com.broadvideo.signage.domain.Schedule;
import com.broadvideo.signage.domain.Schedulefile;
import com.broadvideo.signage.service.DeviceService;
import com.broadvideo.signage.service.DevicefileService;
import com.broadvideo.signage.service.ScheduleService;
import com.broadvideo.signage.service.SchedulefileService;

@Component
@Produces("application/xml")
@Path("/reportfiles")
public class ReportfilesService {

	private static final Logger log = Logger.getLogger(ReportfilesService.class);
	
	@Autowired
	private DeviceService deviceService;
	@Autowired
	private ScheduleService scheduleService;
	@Autowired
	private DevicefileService devicefileService;
	@Autowired
	private SchedulefileService schedulefileService;

	@Produces("application/xml")
	@Consumes("application/xml")
	@POST
	public String reportfiles(String request) {
		log.info("Reportfiles request: " + request);
		
		try {
			Document reqdoc = new SAXBuilder().build(new InputSource(new StringReader(request)));
			Element reqroot = reqdoc.getRootElement();
			if (!reqroot.getName().equals("request")) {
				return handleError("-1", "Fail: request format error");
			}
			String hardkey = reqroot.getAttributeValue("hardkey");
			if (hardkey == null || hardkey.equals("")) {
				return handleError("3001", "Fail: hardkey cannot be null.");
			} 
			List<Device> devices = deviceService.selectByHardkey(hardkey);
			if (devices.size() == 0) {
				return handleError("3002", "Fail: Device with hardkey '" + hardkey + "' is not registered.");
			}
			
			Device device = devices.get(0);

			if (reqroot.getChildText("rate") != null) {
				try {
					device.setRate(Integer.parseInt(reqroot.getChildText("rate")));
				} catch (Exception ex) {}
			}
			if (reqroot.getChildText("time") != null) {
				SimpleDateFormat dateformat = new SimpleDateFormat("yyyyMMddHHmmss");
				try {
					device.setLastlocaltime(dateformat.parse(reqroot.getChildText("time")));
				} catch (Exception e) {
					device.setLastlocaltime(Calendar.getInstance().getTime());
				}
			}

			if (reqroot.getChild("files") != null) {
				List<Element> fileElementList = reqroot.getChild("files").getChildren("file");
				if (fileElementList != null) {
					for (Element fileElement : fileElementList) {
						String filetype = fileElement.getChildText("type");
						String fileid = fileElement.getChildText("id");;
						if (filetype != null && fileid != null) {
							if (filetype.equals("layout")) {
								handleFile(fileElement, ""+device.getDeviceid(), "0");
							} else if (filetype.equals("image")) {
								handleFile(fileElement, ""+device.getDeviceid(), "1");
								filetype = "1";
							} else if (filetype.equals("video")) {
								handleFile(fileElement, ""+device.getDeviceid(), "2");
								handleFile(fileElement, ""+device.getDeviceid(), "4");
							} else if (filetype.equals("movie")) {
								handleOtherFile(fileElement, ""+device.getDeviceid(), "3");
							} else if (filetype.equals("license")) {
								handleOtherFile(fileElement, ""+device.getDeviceid(), "9");
							} else {
								continue;
							}
						}
					}
				}			
			}
			
			List<Devicefile> devicefiles = devicefileService.selectDownloadingFileByDevice(""+device.getDeviceid());
			if (devicefiles.size() == 0) {
				device.setSchedulestatus("0");
			}
			
			deviceService.updateDevice(device);
			
			Element rsproot = new Element("response");
			Document rspdoc = new Document(rsproot);
			rsproot.setAttribute("code", "0");
			rsproot.setAttribute("message", "Success");
			XMLOutputter xmlOutput = new XMLOutputter();
			xmlOutput.setFormat(Format.getPrettyFormat().setEncoding("UTF-8"));
			String response = xmlOutput.outputString(rspdoc);
			log.info("Reportfiles response: " + response);
			return response;
		} catch (Exception ex) {
			ex.printStackTrace();
			return handleError("-1", ex.getMessage());
		}			
	}
	
	private void handleFile(Element fileElement, String deviceid, String filetype) {
		String fileid = fileElement.getChildText("id");
		String complete = fileElement.getChildText("complete");
		String status = fileElement.getChildText("status");
		String desc = fileElement.getChildText("desc");

		List<Devicefile> devicefiles = devicefileService.selectByFile(deviceid, filetype, fileid);
		if (devicefiles != null && devicefiles.size() == 1) {
			Devicefile devicefile = devicefiles.get(0);
			if (complete != null) {
				try {
					devicefile.setComplete(Integer.parseInt(complete));
				} catch (Exception ex) {}
			}
			if (status != null && (status.equals("0")||status.equals("1")||status.equals("2"))) {
				devicefile.setStatus(status);
			} else {
				if (complete != null && complete.equals("100")) {
					devicefile.setStatus("1");
				} else {
					devicefile.setStatus("0");
				}
			}
			if (desc != null) {
				devicefile.setDescription(desc);
			}
			devicefile.setUpdatetime(Calendar.getInstance().getTime());
			devicefileService.updateDevicefile(devicefile);
		}
		
		List<Schedulefile> schedulefiles = schedulefileService.selectByFile(deviceid, filetype, fileid);
		for (int j=0; j<schedulefiles.size(); j++) {
			Schedulefile schedulefile = schedulefiles.get(j);

			if (complete != null) {
				try {
					schedulefile.setComplete(Integer.parseInt(complete));
				} catch (Exception ex) {}
			}
			if (status != null && (status.equals("0")||status.equals("1")||status.equals("2"))) {
				schedulefile.setStatus(status);
			} else {
				if (complete != null && complete.equals("100")) {
					schedulefile.setStatus("1");
				} else {
					schedulefile.setStatus("0");
				}
			}
			if (desc != null) {
				schedulefile.setDescription(desc);
			}
			
			schedulefile.setUpdatetime(Calendar.getInstance().getTime());
			schedulefileService.updateSchedulefile(schedulefile);
			
			Schedule schedule = new Schedule();
			schedule.setScheduleid(schedulefile.getScheduleid());
			long filesizecomplete = schedulefileService.selectFilesizecompleteBySchedule(""+schedulefile.getScheduleid());
			schedule.setFilesizecomplete(filesizecomplete);
			schedule.setSyncendtime(Calendar.getInstance().getTime());
			if (schedulefile.getStatus().equals("1")) {
				if (schedulefileService.selectDownloadingFileBySchedule(""+schedulefile.getScheduleid()).size() == 0) {
					schedule.setSyncstatus("2");
				}
			}
			scheduleService.updateSchedule(schedule);
		}
	}

	private void handleOtherFile(Element fileElement, String deviceid, String filetype) {
		String fileid = fileElement.getChildText("id");
		String complete = fileElement.getChildText("complete");
		String status = fileElement.getChildText("status");
		String desc = fileElement.getChildText("desc");

		List<Devicefile> devicefiles = devicefileService.selectByFile(deviceid, filetype, fileid);
		if (devicefiles != null && devicefiles.size() == 1) {
			Devicefile devicefile = devicefiles.get(0);
			if (complete != null) {
				try {
					devicefile.setComplete(Integer.parseInt(complete));
				} catch (Exception ex) {}
			}
			if (status != null && (status.equals("0")||status.equals("1")||status.equals("2"))) {
				devicefile.setStatus(status);
			} else {
				if (complete != null && complete.equals("100")) {
					devicefile.setStatus("1");
				} else {
					devicefile.setStatus("0");
				}
			}
			if (desc != null) {
				devicefile.setDescription(desc);
			}
			devicefile.setUpdatetime(Calendar.getInstance().getTime());
			devicefileService.updateDevicefile(devicefile);
		}
	}

	private String handleError(String code, String message) {
		Element root = new Element("response");
		Document doc = new Document(root);
		root.setAttribute("code", code);
		root.setAttribute("message", message);
		
		XMLOutputter xmlOutput = new XMLOutputter();
		xmlOutput.setFormat(Format.getPrettyFormat().setEncoding("UTF-8"));
		String response = xmlOutput.outputString(doc);
		log.info("Reportfiles response: " + response);
		return response;
	}
}
