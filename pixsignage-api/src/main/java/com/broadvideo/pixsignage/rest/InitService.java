package com.broadvideo.pixsignage.rest;

import java.io.StringReader;

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

import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.service.ConfigService;
import com.broadvideo.pixsignage.service.OrgService;

@Component
@Produces("application/xml")
@Path("/init")
public class InitService {

	private static final Logger log = Logger.getLogger(InitService.class);

	@Autowired
	private ConfigService configService;
	@Autowired
	private OrgService orgService;

	@Produces("application/xml")
	@Consumes("application/xml")
	@POST
	public String init(String request) {
		log.info("Init request: " + request);
		try {
			Document reqdoc = new SAXBuilder().build(new InputSource(new StringReader(request)));
			Element reqroot = reqdoc.getRootElement();
			if (!reqroot.getName().equals("request")) {
				return handleError("-1", "Fail: request format error");
			}

			String orgcode = reqroot.getChildText("orgcode");
			if (orgcode == null || orgcode.equals("")) {
				return handleError("-1", "Fail: orgcode is null");
			}
			Org org = orgService.selectByCode(orgcode);
			if (org == null) {
				return handleError("-1", "Fail: org not found");
			}

			String serverip = configService.selectValueByCode("ServerIP");
			String serverport = configService.selectValueByCode("ServerPort");

			Element rsproot = new Element("response");
			Document rspdoc = new Document(rsproot);
			if (!org.getOrgtype().equals("2") && org.getBackupvideo() != null) {
				Element filesElement = new Element("files");
				Element fileElement = new Element("file");
				rsproot.addContent(filesElement);
				filesElement.addContent(fileElement);
				fileElement.addContent(new Element("type").setText("video"));
				fileElement.addContent(new Element("id").setText("backup" + org.getBackupvideo().getVideoid()));
				fileElement.addContent(new Element("downloadmode").setText("0"));
				fileElement.addContent(new Element("uri").setText(org.getBackupvideo().getFilename()));
				fileElement.addContent(new Element("name").setText(org.getBackupvideo().getFilename()));
				fileElement.addContent(new Element("size").setText("" + org.getBackupvideo().getSize()));
				fileElement.addContent(new Element("md5").setText(org.getBackupvideo().getMd5()));
			}
			Element configElement = new Element("config");
			rsproot.addContent(configElement);
			configElement.addContent(
					new Element("serviceurl").setText("http://" + serverip + ":" + serverport + "/pixservice/rest/"));
			configElement.addContent(
					new Element("staturl").setText("http://" + serverip + ":" + serverport + "/pixservice/rest/"));
			configElement.addContent(new Element("asp").setText("16*9"));
			configElement.addContent(new Element("volume").setText("50"));
			configElement.addContent(new Element("port").setText("HDMI?HDMI_1080p60"));
			configElement.addContent(new Element("loglevel").setText("info"));
			configElement.addContent(new Element("refreshtime").setText("60"));
			configElement.addContent(new Element("videodownloadmode").setText("0"));
			configElement.addContent(
					new Element("videodownloadserver").setText("http://" + serverip + ":" + serverport + "/video/"));
			configElement.addContent(
					new Element("imgdownloadserver").setText("http://" + serverip + ":" + serverport + "/image/"));
			configElement.addContent(new Element("xlfdownloadserver").setText(
					"http://" + serverip + ":" + serverport + "/pixorg/web/org/layout!download.action?layoutid="));
			if (org.getBackupvideo() != null) {
				configElement
						.addContent(new Element("backupfileid").setText("backup" + org.getBackupvideo().getVideoid()));
			}

			rsproot.setAttribute("code", "0");
			rsproot.setAttribute("message", "Success");
			XMLOutputter xmlOutput = new XMLOutputter();
			xmlOutput.setFormat(Format.getPrettyFormat().setEncoding("UTF-8"));
			String response = xmlOutput.outputString(rspdoc);
			log.info("Init response: " + response);
			return response;
		} catch (Exception ex) {
			ex.printStackTrace();
			return handleError("-1", "Fail: " + ex.getMessage());
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
		log.info("Init response: " + response);
		return response;
	}
}
