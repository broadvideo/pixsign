package com.broadvideo.signage.pixtrans;

import java.io.File;
import java.io.StringReader;
import java.net.URL;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
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
import com.broadvideo.signage.domain.Media;
import com.broadvideo.signage.domain.Org;
import com.broadvideo.signage.domain.Staff;
import com.broadvideo.signage.persistence.MediaMapper;
import com.broadvideo.signage.persistence.OrgMapper;
import com.broadvideo.signage.persistence.StaffMapper;
import com.broadvideo.signage.util.CommonUtil;

@Component
@Produces("application/xml")
@Path("/pixtrans")
public class PixtransService {

	private static final Logger log = Logger.getLogger(PixtransService.class);

	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private MediaMapper mediaMapper;

	@POST
	@Produces("application/xml")
	@Consumes("application/xml")
	public String command(String request) {
		log.info("Pixtrans request: " + request);
		String command = "Unknown";
		try {
			Document doc = new SAXBuilder().build(new InputSource(new StringReader(request)));
			Element root = doc.getRootElement();
			if (!root.getName().equals("Cmd") || root.getChild("taskCmd") == null
					|| root.getChild("taskContent") == null) {
				return handleError(command, "Request format error");
			}

			command = root.getChild("taskCmd").getText();
			if (command.equals("Register")) {
				return handleRegisterRequest(command, root.getChild("taskContent"));
			} else if (command.equals("UploadFile")) {
				return handleUploadRequest(command, root.getChild("taskContent"));
			} else if (command.equals("Notify")) {
				return handleNotifyRequest(command, root.getChild("taskContent"));
			} else {
				throw new Exception("Request format error");
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			return handleError(command, ex.getMessage());
		}

	}

	private String handleRegisterRequest(String command, Element task) {
		if (task.getChild("UserName") == null || task.getChild("Organization") == null
				|| task.getChild("TIME_STAMP") == null || task.getChild("TOKEN") == null) {
			return handleError(command, "Register request format error");
		}
		String loginname = task.getChild("UserName").getText();
		String orgcode = task.getChild("Organization").getText();
		String timestamp = task.getChild("TIME_STAMP").getText();
		String token = task.getChild("TOKEN").getText();

		Org org = orgMapper.selectByCode(orgcode);
		if (org == null) {
			return handleError(command, "Org not found");
		}
		List<Staff> staffs = staffMapper.selectByLoginname(loginname, "2", null, "" + org.getOrgid());
		if (staffs.size() == 0) {
			return handleError(command, "Staff not found");
		}
		String ctoken = DigestUtils.md5Hex(orgcode + "&" + timestamp + "&" + staffs.get(0).getPassword());
		System.out.println("ctoken: " + ctoken);
		if (!ctoken.equals(token)) {
			return handleError(command, "Login failed");
		}

		Element root = new Element("CmdResp");
		Document doc = new Document(root);
		root.addContent(new Element("taskCmd").setText(command));
		root.addContent(new Element("errorCode").setText("0"));
		root.addContent(new Element("errorDetail").setText(""));
		Element responseElement = new Element("RegisterResponse");
		responseElement.addContent(new Element("UploaderKEY").setText(staffs.get(0).getToken()));
		responseElement.addContent(new Element("StoragePath").setText(""));
		responseElement.addContent(new Element("StorageEntryUrl").setText(""));
		root.addContent(responseElement);

		XMLOutputter xmlOutput = new XMLOutputter();
		xmlOutput.setFormat(Format.getPrettyFormat().setEncoding("UTF-8"));
		return xmlOutput.outputString(doc);
	}

	private String handleUploadRequest(String command, Element task) {
		if (task.getChild("UploaderKEY") == null || task.getChild("File") == null) {
			return handleError(command, "UploadFile request format error");
		}
		String uploadkey = task.getChild("UploaderKEY").getText();
		Element fileElement = task.getChild("File");
		if (fileElement.getChild("Name") == null) {
			return handleError(command, "UploadFile request format error");
		}
		String name = fileElement.getChild("Name").getText();
		String description = "";
		if (fileElement.getChild("Desc") != null) {
			description = fileElement.getChild("Desc").getText();
		}

		List<Staff> staffs = staffMapper.selectByUploadkey(uploadkey);
		if (staffs.size() == 0) {
			return handleError(command, "Uploadkey error");
		}
		Staff staff = staffs.get(0);

		Org org = orgMapper.selectByPrimaryKey(staff.getOrgid());
		if (org.getCurrentstorage() >= org.getMaxstorage()) {
			return handleError(command, "Storage license is full");
		}

		Media media = new Media();
		media.setOrgid(staff.getOrgid());
		media.setBranchid(staff.getBranchid());
		media.setType("2");
		media.setName(name);
		media.setFilename("");
		media.setContenttype("");
		media.setStatus("0");
		media.setDescription(description);
		media.setPreviewduration(0);
		media.setCreatestaffid(staff.getStaffid());
		media.setComplete(0);
		media.setUploadtype("1");
		mediaMapper.insert(media);

		Element root = new Element("CmdResp");
		Document doc = new Document(root);
		root.addContent(new Element("taskCmd").setText(command));
		root.addContent(new Element("errorCode").setText("0"));
		root.addContent(new Element("errorDetail").setText(""));
		Element responseElement = new Element("UploadFileResponse");
		responseElement.addContent(new Element("File_ID").setText("" + media.getMediaid()));
		root.addContent(responseElement);

		XMLOutputter xmlOutput = new XMLOutputter();
		xmlOutput.setFormat(Format.getPrettyFormat().setEncoding("UTF-8"));
		return xmlOutput.outputString(doc);
	}

	private String handleNotifyRequest(String command, Element task) {
		if (task.getChild("UploaderKEY") == null || task.getChild("FileList") == null) {
			return handleError(command, "Notify request format error");
		}
		String uploadkey = task.getChild("UploaderKEY").getText();
		List<Staff> staffs = staffMapper.selectByUploadkey(uploadkey);
		if (staffs.size() == 0) {
			return handleError(command, "Uploadkey error");
		}
		Staff staff = staffs.get(0);

		List<Element> fileElements = task.getChild("FileList").getChildren("File");
		Element fileListRespElement = new Element("FileList");
		String errorCode = "0";
		String errorDetail = "";
		for (int i = 0; i < fileElements.size(); i++) {
			Element fileElement = fileElements.get(i);
			Element fileRespElement = new Element("File");
			fileListRespElement.addContent(fileRespElement);

			if (fileElement.getChild("id") == null) {
				fileRespElement.addContent(new Element("id").setText("Unknown"));
				fileRespElement.addContent(new Element("RespCode").setText("-1"));
				errorCode = "-1";
				errorDetail = "Notify request format error: id not found";
				continue;
			}
			String mediaid = fileElement.getChild("id").getText();
			fileRespElement.addContent(new Element("id").setText(mediaid));
			if (fileElement.getChild("Status") == null) {
				fileRespElement.addContent(new Element("RespCode").setText("-1"));
				errorCode = "-1";
				errorDetail = "Notify request with file id " + mediaid + " format error";
				continue;
			}

			Media media = mediaMapper.selectByPrimaryKey(mediaid);
			if (media == null || !media.getUploadtype().equals("1")) {
				fileRespElement.addContent(new Element("RespCode").setText("-1"));
				errorCode = "-1";
				errorDetail = "File with id " + mediaid + " not found";
				continue;
			}
			if (media.getCreatestaffid() != staff.getStaffid()) {
				fileRespElement.addContent(new Element("RespCode").setText("-1"));
				errorCode = "-1";
				errorDetail = "File with id " + mediaid + " not match with the uploadkey";
				continue;
			}

			String status = fileElement.getChild("Status").getText();
			if (status.equals("Finished")) {
				if (fileElement.getChild("DownloadURL") == null || fileElement.getChild("Hash") == null
						|| fileElement.getChild("Size") == null) {
					fileRespElement.addContent(new Element("RespCode").setText("-1"));
					errorCode = "-1";
					errorDetail = "Notify request with file id " + mediaid + " format error";
					continue;
				}
				if (fileElement.getChild("PreviewURL") != null) {
					try {
						URL previewurl = new URL(fileElement.getChild("PreviewURL").getText());
						File thumbnailFile = new File(CommonConfig.CONFIG_TEMP_HOME + "/preview_" + mediaid + ".jpg");
						FileUtils.copyURLToFile(previewurl, thumbnailFile);
						media.setThumbnail(CommonUtil.generateThumbnail(thumbnailFile, 120));
						thumbnailFile.delete();
					} catch (Exception ex) {
						System.out.println("Download preview url error: "
								+ fileElement.getChild("PreviewURL").getText());
						ex.printStackTrace();
					}
				}
				media.setStatus("1");
				media.setComplete(100);
				media.setUri(fileElement.getChild("DownloadURL").getText());
				media.setMd5(fileElement.getChild("Hash").getText());
				media.setSize(Long.parseLong(fileElement.getChild("Size").getText()));
			} else if (status.equals("Uploading")) {
				if (fileElement.getChild("Percent") == null) {
					fileRespElement.addContent(new Element("RespCode").setText("-1"));
					errorCode = "-1";
					errorDetail = "Notify request with file id " + mediaid + " format error";
					continue;
				}
				media.setStatus("0");
				media.setComplete(Integer.parseInt(fileElement.getChild("Percent").getText()));
			} else if (status.equals("Fail")) {
				media.setStatus("2");
				if (fileElement.getChild("ErrorDetail") != null) {
					media.setDescription(fileElement.getChild("ErrorDetail").getText());
				}
			} else {
				fileRespElement.addContent(new Element("RespCode").setText("-1"));
				errorCode = "-1";
				errorDetail = "Notify request with file id " + mediaid + " format error";
				continue;
			}
			fileRespElement.addContent(new Element("RespCode").setText("0"));
			mediaMapper.updateByPrimaryKeySelective(media);
		}

		Element root = new Element("CmdResp");
		Document doc = new Document(root);
		root.addContent(new Element("taskCmd").setText(command));
		root.addContent(new Element("errorCode").setText(errorCode));
		root.addContent(new Element("errorDetail").setText(errorDetail));
		Element responseElement = new Element("NotifyResponse");
		responseElement.addContent(fileListRespElement);
		root.addContent(responseElement);

		XMLOutputter xmlOutput = new XMLOutputter();
		xmlOutput.setFormat(Format.getPrettyFormat().setEncoding("UTF-8"));
		return xmlOutput.outputString(doc);
	}

	private String handleError(String command, String error) {
		Element root = new Element("CmdResp");
		Document doc = new Document(root);
		root.addContent(new Element("taskCmd").setText(command));
		root.addContent(new Element("errorCode").setText("-1"));
		root.addContent(new Element("errorDetail").setText(error));

		XMLOutputter xmlOutput = new XMLOutputter();
		xmlOutput.setFormat(Format.getPrettyFormat().setEncoding("UTF-8"));
		return xmlOutput.outputString(doc);
	}
}