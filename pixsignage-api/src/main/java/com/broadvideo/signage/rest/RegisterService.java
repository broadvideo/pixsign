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

import com.broadvideo.signage.domain.Branch;
import com.broadvideo.signage.domain.Device;
import com.broadvideo.signage.domain.Org;
import com.broadvideo.signage.service.BranchService;
import com.broadvideo.signage.service.ConfigService;
import com.broadvideo.signage.service.DeviceService;
import com.broadvideo.signage.service.OrgService;
import com.sun.jersey.spi.resource.Singleton;

@Singleton
@Component
@Produces("application/xml")
@Path("/register")
public class RegisterService {

	private static final Logger log = Logger.getLogger(RegisterService.class);

	@Autowired
	private ConfigService configService;
	@Autowired
	private DeviceService deviceService;
	@Autowired
	private OrgService orgService;
	@Autowired
	private BranchService branchService;

	@Produces("application/xml")
	@Consumes("application/xml")
	@POST
	public synchronized String register(String request) {
		log.info("Register request: " + request);

		try {
			Document reqdoc = new SAXBuilder().build(new InputSource(new StringReader(request)));
			Element reqroot = reqdoc.getRootElement();
			if (!reqroot.getName().equals("request")) {
				return handleError("-1", "Fail: request format error");
			}
			String hardkey = reqroot.getAttributeValue("hardkey");
			if (hardkey == null || hardkey.equals("")) {
				return handleError("1001", "Fail: hardkey cannot be null.");
			}
			String terminalid = reqroot.getChildText("terminalid");
			if (terminalid == null || terminalid.equals("")) {
				return handleError("1003", "Fail: terminalid cannot be null.");
			}

			String serverip = configService.selectValueByCode("ServerIP");
			String serverport = configService.selectValueByCode("ServerPort");

			Device device;
			List<Device> devices = deviceService.selectByHardkey(hardkey);
			if (devices.size() > 0) {
				device = devices.get(0);
				if (!device.getTerminalid().equals(terminalid)) {
					device.setHardkey(null);
					device.setStatus("0");
					deviceService.updateDevice(device);
				}
			}

			devices = deviceService.selectByTerminalid(terminalid);
			if (devices.size() == 0) {
				return handleError("1004", "Fail: terminalid '" + terminalid + "' invalid.");
			} else {
				device = devices.get(0);
				if (device.getStatus().equals("1") && !device.getHardkey().equals(hardkey)) {
					Element rsproot = new Element("response");
					Document rspdoc = new Document(rsproot);
					rsproot.setAttribute("code", "1005");
					rsproot.setAttribute("message", "Fail: device with terminalid '" + terminalid
							+ "' has already been registered.");
					rsproot.addContent(new Element("groupcode").setText(device.getGroupcode()));
					rsproot.addContent(new Element("pixcastserver").setText(serverip + ":" + serverport));
					XMLOutputter xmlOutput = new XMLOutputter();
					xmlOutput.setFormat(Format.getPrettyFormat().setEncoding("UTF-8"));
					String response = xmlOutput.outputString(rspdoc);
					log.info("Register response: " + response);
					return response;
				}
			}

			String orgcode = reqroot.getChildText("orgcode");
			if (orgcode == null || orgcode.trim().equals("")) {
				return handleError("1006", "Fail: orgcode cannot be null.");
			}
			Org org = orgService.selectByCode(orgcode.trim());
			if (org == null) {
				return handleError("1007", "Fail: org with code '" + orgcode + "' cannot be found.");
			}

			if (device.getOrgid() != org.getOrgid()) {
				return handleError("1008", "Fail: terminalid and orgcode not match.");
			}

			String branchcode = reqroot.getChildText("branchcode");
			List<Branch> branches;
			if (branchcode == null || branchcode.trim().equals("")) {
				branches = branchService.selectRoot(org.getOrgid());
			} else {
				branches = branchService.selectByCode(branchcode.trim(), "" + org.getOrgid());
				if (branches.size() == 0) {
					return handleError("1009", "Fail: branch with code '" + branchcode + "' cannot be found.");
				}
			}

			String type = reqroot.getChildText("type");
			if (type == null || (!type.equals("1") && !type.equals("2"))) {
				return handleError("1010", "Fail: type should be 1 or 2.");
			}

			if (org.getCurrentdevices() >= org.getMaxdevices()) {
				return handleError("1011", "Fail: device license is full.");
			}

			String name = reqroot.getChildText("name");
			if (name == null || name.trim().equals("")) {
				name = terminalid;
			}

			device.setHardkey(hardkey);
			device.setType(type);
			device.setTerminalid(terminalid);
			device.setOrgid(org.getOrgid());
			device.setBranchid(branches.get(0).getBranchid());
			// device.setName(name);
			// device.setPosition(reqroot.getChildText("position"));
			device.setIp(reqroot.getChildText("ip"));
			device.setMac(reqroot.getChildText("mac"));

			device.setStatus("1");
			device.setSchedulestatus("0");
			device.setFilestatus("0");
			device.setConfigstatus("0");
			device.setDescription("");
			device.setOnlineflag("1"); // 在线
			device.setOnlinelayoutid(0);
			device.setOnlinemediaid(0);
			device.setRate(0);
			device.setUpgradestatus("0");
			device.setUpgradeversion("");
			device.setLastservertime(Calendar.getInstance().getTime());

			if (reqroot.getChildText("time") != null) {
				SimpleDateFormat dateformat = new SimpleDateFormat("yyyyMMddHHmmss");
				try {
					device.setLastlocaltime(dateformat.parse(reqroot.getChildText("time")));
				} catch (Exception e) {
					device.setLastlocaltime(Calendar.getInstance().getTime());
				}
			}

			deviceService.updateDevice(device);

			Element rsproot = new Element("response");
			Document rspdoc = new Document(rsproot);
			rsproot.setAttribute("code", "0");
			rsproot.setAttribute("message", "Success: device 'hardkey:" + hardkey + ", terminalid:" + terminalid
					+ "' registered.");
			if (device.getGroupcode() != null && device.getGroupcode().length() > 0) {
				rsproot.addContent(new Element("groupcode").setText(device.getTerminalid() + ","
						+ device.getGroupcode()));
			} else {
				rsproot.addContent(new Element("groupcode").setText(device.getTerminalid()));
			}
			rsproot.addContent(new Element("pixcastserver").setText(serverip + ":" + serverport));
			XMLOutputter xmlOutput = new XMLOutputter();
			xmlOutput.setFormat(Format.getPrettyFormat().setEncoding("UTF-8"));
			String response = xmlOutput.outputString(rspdoc);
			log.info("Register response: " + response);
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
		log.info("Register response: " + response);
		return response;
	}

}
