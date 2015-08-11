package com.broadvideo.signage.rest;

import java.io.StringReader;
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
import com.broadvideo.signage.domain.Deviceevent;
import com.broadvideo.signage.domain.Devicelog;
import com.broadvideo.signage.service.DeviceService;
import com.broadvideo.signage.service.DeviceeventService;
import com.broadvideo.signage.service.DevicelogService;

@Component
@Produces("application/xml")
@Path("/reportlogs")
public class ReportlogsService {
	
	private static final Logger log = Logger.getLogger(ReportlogsService.class);

	@Autowired
	private DeviceService deviceService;
	@Autowired
	private DevicelogService devicelogService;
	@Autowired
	private DeviceeventService deviceeventService;
	
	@Produces("application/xml")
	@Consumes("application/xml")
	@POST
	public String reportlogs(String request) {
		log.debug("Reportlogs request: " + request);
		
		try {
			Document reqdoc = new SAXBuilder().build(new InputSource(new StringReader(request)));
			Element reqroot = reqdoc.getRootElement();
			if (!reqroot.getName().equals("request")) {
				return handleError("-1", "Fail: request format error");
			}
			String hardkey = reqroot.getAttributeValue("hardkey");
			if (hardkey == null || hardkey.equals("")) {
				return handleError("4001", "Fail: hardkey cannot be null.");
			} 
			List<Device> devices = deviceService.selectByHardkey(hardkey);
			if (devices.size() == 0) {
				return handleError("4002", "Fail: Device with hardkey '" + hardkey + "' is not registered.");
			}
			
			Device device = devices.get(0);

			String type = reqroot.getChildText("type");
			if (type == null) {
				type = "0";
			}
			String level = reqroot.getChildText("level");
			if (level != null && level.equals("debug")) {
				level = "1";
			} else if (level != null && level.equals("info")) {
				level = "2";
			} else if (level != null && level.equals("error")) {
				level = "3";
			} else if (level != null && level.equals("fatal")) {
				level = "4";
			} else {
				level = "2";
			}
			String message = reqroot.getChildText("message");
			String previd = reqroot.getChildText("previd");
			String prevduration = reqroot.getChildText("prevduration");
			String nextid = reqroot.getChildText("nextid");
			
			if (type.equals("0")) {
				Devicelog devicelog = new Devicelog();
				devicelog.setDeviceid(device.getDeviceid());
				devicelog.setLevel(level);
				devicelog.setMessage(message);
				devicelogService.addDevicelog(devicelog);
			} else {
				Deviceevent deviceevent = new Deviceevent();
				deviceevent.setDeviceid(device.getDeviceid());
				deviceevent.setType(type);
				deviceevent.setMessage(message);
				deviceevent.setPrevid(0);
				deviceevent.setPrevduration(0);
				deviceevent.setNextid(0);
				try {
					if (previd != null) {
						deviceevent.setPrevid(Integer.parseInt(previd));
					}
				} catch (Exception ex) {}
				try {
					if (prevduration != null) {
						deviceevent.setPrevduration(Integer.parseInt(prevduration));
					}
				} catch (Exception ex) {}
				try {
					if (nextid != null) {
						deviceevent.setNextid(Integer.parseInt(nextid));
					}
				} catch (Exception ex) {}
				deviceeventService.addDeviceevent(deviceevent);
			}
			
			Element rsproot = new Element("response");
			Document rspdoc = new Document(rsproot);
			rsproot.setAttribute("code", "0");
			rsproot.setAttribute("message", "Success");
			XMLOutputter xmlOutput = new XMLOutputter();
			xmlOutput.setFormat(Format.getPrettyFormat().setEncoding("UTF-8"));
			String response = xmlOutput.outputString(rspdoc);
			log.debug("Reportlogs response: " + response);
			return response;
		} catch (Exception ex) {
			ex.printStackTrace();
			return handleError("-1", ex.getMessage());
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
		log.debug("Reportlogs response: " + response);
		return response;
	}

}
