package com.broadvideo.pixsignage.action;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Template;
import com.broadvideo.pixsignage.service.ImageService;
import com.broadvideo.pixsignage.service.TemplateService;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("templateAction")
public class TemplateAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Template template;

	private Image image;
	private File templateimage;
	private String templateimageFileName;

	private String exportname;
	private InputStream inputStream;

	@Autowired
	private TemplateService templateService;
	@Autowired
	private ImageService imageService;

	public String doFetch() {
		try {
			String sourceid = getParameter("sourceid");
			if (sourceid != null) {
				String templateid = templateService.fetch(sourceid);
				template = templateService.selectByPrimaryKey(templateid);
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doFetch exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doGet() {
		try {
			String templateid = getParameter("templateid");
			template = templateService.selectByPrimaryKey(templateid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TemplateAction doGet exception, ", ex);
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
			String ratio = getParameter("ratio");
			String templateflag = getParameter("templateflag");
			String touchflag = getParameter("touchflag");
			String homeflag = getParameter("homeflag");
			String publicflag = null;

			String orgid = "" + getLoginStaff().getOrgid();
			if (templateflag != null && templateflag.equals("2")) {
				orgid = "1";
				publicflag = "1";
			}

			int count = templateService.selectCount(orgid, ratio, touchflag, homeflag, publicflag, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Template> templateList = templateService.selectList(orgid, ratio, touchflag, homeflag, publicflag,
					search, start, length);
			for (int i = 0; i < templateList.size(); i++) {
				aaData.add(templateList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TemplateAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			template.setOrgid(getLoginStaff().getOrgid());
			template.setCreatestaffid(getLoginStaff().getStaffid());
			template.setUuid(UUID.randomUUID().toString().replace("-", ""));
			String fromtemplateid = getParameter("fromtemplateid");
			if (fromtemplateid != null) {
				templateService.copyTemplate(fromtemplateid, template);
			} else {
				templateService.addTemplate(template);
			}
			logger.info("Template add, templateid={}", template.getTemplateid());
			if (template.getHomeflag().equals("1")) {
				templateService.exportZip("" + template.getTemplateid());
			} else {
				templateService.exportZip("" + template.getHometemplateid());
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TemplateAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			logger.info("Template update, templateid={}", template.getTemplateid());
			templateService.updateTemplate(template);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TemplateAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			logger.info("Template delete, templateid={}", template.getTemplateid());
			templateService.deleteTemplate("" + template.getTemplateid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TemplateAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDesign() {
		try {
			logger.info("Template design, templateid={}", template.getTemplateid());
			template.setOrgid(getLoginStaff().getOrgid());
			template.setCreatestaffid(getLoginStaff().getStaffid());
			templateService.design(template);
			if (template.getHomeflag().equals("1")) {
				templateService.exportZip("" + template.getTemplateid());
			} else {
				templateService.exportZip("" + template.getHometemplateid());
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TemplateAction doDesign exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doImageUpload() {
		try {
			String templateid = getParameter("templateid");
			logger.info("Upload one image, templateid={}, templateimage={}", templateid, templateimage);
			Template template = templateService.selectByPrimaryKey(templateid);
			if (templateimage != null && template != null) {
				logger.info("Upload one image for template {}", template.getName());

				Image image = new Image();
				image.setOrgid(getLoginStaff().getOrgid());
				image.setBranchid(getLoginStaff().getBranchid());
				image.setName(templateimageFileName);
				image.setFilename(templateimageFileName);
				image.setObjtype("1");
				image.setObjid(template.getTemplateid());
				image.setStatus("9");
				image.setDescription(templateimageFileName);
				image.setCreatestaffid(getLoginStaff().getStaffid());
				imageService.addImage(image);

				String newFileName = "" + image.getImageid() + "." + FilenameUtils.getExtension(templateimageFileName);
				String imageFilePath, thumbFilePath;
				imageFilePath = "/template/" + templateid + "/image/" + newFileName;
				thumbFilePath = "/template/" + templateid + "/thumb/" + newFileName;
				File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + imageFilePath);
				File thumbFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + thumbFilePath);
				if (imageFile.exists()) {
					imageFile.delete();
				}
				if (thumbFile.exists()) {
					thumbFile.delete();
				}
				CommonUtil.resizeImage(templateimage, imageFile, 3840);
				CommonUtil.resizeImage(imageFile, thumbFile, 640);
				FileUtils.deleteQuietly(templateimage);

				BufferedImage img = ImageIO.read(imageFile);
				image.setWidth(img.getWidth());
				image.setHeight(img.getHeight());
				image.setFilepath(imageFilePath);
				image.setThumbnail(thumbFilePath);
				image.setFilename(newFileName);
				image.setSize(FileUtils.sizeOf(imageFile));
				FileInputStream fis = new FileInputStream(imageFile);
				image.setMd5(DigestUtils.md5Hex(fis));
				fis.close();
				image.setStatus("1");
				imageService.updateImage(image);
				setImage(image);
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doImageUpload exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doExport() {
		try {
			String templateid = getParameter("templateid");
			logger.info("Template export, templateid={}", templateid);
			Template template = templateService.selectByPrimaryKey(templateid);
			exportname = "template-" + template.getUuid() + ".zip";
			File zipFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + "/template/" + templateid, exportname);
			inputStream = new FileInputStream(zipFile);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TemplateAction doExport exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Template getTemplate() {
		return template;
	}

	public void setTemplate(Template template) {
		this.template = template;
	}

	public Image getImage() {
		return image;
	}

	public void setImage(Image image) {
		this.image = image;
	}

	public File getTemplateimage() {
		return templateimage;
	}

	public void setTemplateimage(File templateimage) {
		this.templateimage = templateimage;
	}

	public String getTemplateimageFileName() {
		return templateimageFileName;
	}

	public void setTemplateimageFileName(String templateimageFileName) {
		this.templateimageFileName = templateimageFileName;
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
