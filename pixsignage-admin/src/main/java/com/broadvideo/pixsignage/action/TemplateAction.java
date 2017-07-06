package com.broadvideo.pixsignage.action;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Template;
import com.broadvideo.pixsignage.domain.Templatezone;
import com.broadvideo.pixsignage.domain.Templatezonedtl;
import com.broadvideo.pixsignage.service.ImageService;
import com.broadvideo.pixsignage.service.TemplateService;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.SqlUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@SuppressWarnings("serial")
@Scope("request")
@Controller("templateAction")
public class TemplateAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Template template;

	private Image image;
	private File templateimage;
	private String templateimageFileName;

	@Autowired
	private TemplateService templateService;
	@Autowired
	private ImageService imageService;

	public String doFetch() {
		try {
			String sourceid = getParameter("sourceid");
			if (sourceid != null) {
				String server = "http://signagecreator.com/wysiwyg_editor/template/fetch_last_data_template";
				logger.info("Send fetch_last_data_template message to {}, {}", server, sourceid);

				RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000)
						.setConnectTimeout(5000).setConnectionRequestTimeout(30000).build();
				CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig)
						.build();
				HttpPost httppost = new HttpPost(server);
				httppost.setHeader(HTTP.CONTENT_TYPE, "application/x-www-form-urlencoded; charset=UTF-8");
				httppost.setHeader("Referer",
						"http://signagecreator.com/wysiwyg_editor/template/edit_wysiwyg_editor/" + sourceid + "/0/1");
				httppost.setHeader("User-Agent",
						"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2236.0 Safari/537.36");

				List<NameValuePair> params = new ArrayList<NameValuePair>();
				params.add(new BasicNameValuePair("node", sourceid));
				httppost.setEntity(new UrlEncodedFormEntity(params));
				CloseableHttpResponse response = httpclient.execute(httppost);
				int status = response.getStatusLine().getStatusCode();
				if (status != 200) {
					logger.error("Get fetch_last_data_template response code: {}", status);
					httpclient.close();
				}
				String s = EntityUtils.toString(response.getEntity());
				logger.info("Get fetch_last_data_template response: {}", s);
				httpclient.close();

				/*
				 * Client c = Client.create(); WebResource r =
				 * c.resource(server); MultivaluedMap<String, String> params =
				 * new MultivaluedMapImpl(); params.add("node", sourceid);
				 * String s =
				 * r.type(MediaType.APPLICATION_FORM_URLENCODED).accept(
				 * MediaType.APPLICATION_JSON_TYPE) .post(String.class, params);
				 * logger.info("Get fetch_last_data_template response: {}", s);
				 */
				JSONObject rspJson = JSONObject.fromObject(s);
				String name = rspJson.getString("template_name");
				Template template = new Template();
				List<Templatezone> templatezones = new ArrayList<Templatezone>();
				template.setOrgid(1);
				template.setUuid(UUID.randomUUID().toString().replace("-", ""));
				template.setPublicflag("1");
				template.setName(name);
				template.setRatio("1");
				template.setWidth(1920);
				template.setHeight(1080);
				template.setDescription(sourceid);
				template.setStatus("0");
				templateService.addTemplate(template);

				FileUtils.forceMkdir(new File(
						CommonConfig.CONFIG_PIXDATA_HOME + "/template/" + template.getTemplateid() + "/image"));
				FileUtils.forceMkdir(new File(
						CommonConfig.CONFIG_PIXDATA_HOME + "/template/" + template.getTemplateid() + "/thumb"));
				FileUtils.forceMkdir(new File(
						CommonConfig.CONFIG_PIXDATA_HOME + "/template/" + template.getTemplateid() + "/snapshot"));

				JSONArray zoneArrays = rspJson.getJSONArray("template_value");
				for (int i = 0; i < zoneArrays.size(); i++) {
					JSONObject zoneJson = zoneArrays.getJSONObject(i);
					String zoneStructure = zoneJson.getString("zone_structure");
					String zoneContent = zoneJson.getString("zone_content");
					logger.info("zoneStructure: {}", zoneStructure);
					logger.info("zoneContent: {}", zoneContent);
					JSONObject zoneStrucJson = JSONObject.fromObject(zoneStructure);
					Templatezone templatezone = new Templatezone();
					templatezone.setTemplatezoneid(0);
					templatezone.setTemplateid(template.getTemplateid());
					if (zoneStrucJson.getString("img_name").equals("image")) {
						templatezone.setType(Templatezone.Type_IMAGE);
					} else if (zoneStrucJson.getString("img_name").equals("text")) {
						templatezone.setType(Templatezone.Type_TEXT);
					}
					if (templatezone.getType() == Templatezone.Type_IMAGE) {
						logger.info("add template zone: {}", zoneStrucJson.getString("zone_name"));
						templatezone.setHeight(
								Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("img_height"))));
						templatezone
								.setWidth(Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("img_width"))));
						templatezone.setTopoffset(
								Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("img_top"))));
						templatezone.setLeftoffset(
								Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("img_left"))));
						templatezone.setZindex(Integer.parseInt(zoneStrucJson.getString("img_z_index")));
						templatezone.setTransform(zoneStrucJson.getString("img_transform"));
						templatezone.setBdcolor(zoneStrucJson.getString("img_border_color"));
						templatezone.setBdstyle(zoneStrucJson.getString("img_border_style"));
						try {
							templatezone.setBdwidth(
									Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("img_border_width"))));
						} catch (Exception e) {
							templatezone.setBdwidth(0);
						}
						templatezone.setBdradius(Math.round(1.875f
								* Integer.parseInt(zoneStrucJson.getString("border_top_left").replace("px", ""))));
						templatezone.setBgcolor(zoneStrucJson.getString("img_background_color"));
						templatezone.setOpacity(255 * Integer.parseInt(zoneStrucJson.getString("img_opacity")));
						templatezone.setPadding(Math.round(
								1.875f * Integer.parseInt(zoneStrucJson.getString("img_padding").replace("px", ""))));
						logger.info("image shadow: {}", zoneStrucJson.getString("img_shadow"));
						templatezone.setShadowh(0);
						templatezone.setShadowv(0);
						templatezone.setShadowblur(0);
						templatezone.setShadowcolor("#000000");
						if (zoneContent.equals("no")) {
							zoneContent = "";
						}
						templatezone.setContent(zoneContent);
						if (zoneContent.length() > 0) {
							int statusCode = download2File(
									"http://signagecreator.com/wysiwyg_editor/uploads/media/category/images/"
											+ zoneContent,
									CommonConfig.CONFIG_TEMP_HOME + "/" + zoneContent);
							if (statusCode == 200) {
								File downloadFile = new File(CommonConfig.CONFIG_TEMP_HOME + "/" + zoneContent);
								Image image = new Image();
								image.setOrgid(getLoginStaff().getOrgid());
								image.setBranchid(getLoginStaff().getBranchid());
								image.setName(zoneContent);
								image.setFilename(zoneContent);
								image.setObjtype("1");
								image.setObjid(template.getTemplateid());
								image.setStatus("9");
								image.setDescription(zoneContent);
								image.setCreatestaffid(getLoginStaff().getStaffid());
								imageService.addImage(image);

								String newFileName = "" + image.getImageid() + "."
										+ FilenameUtils.getExtension(zoneContent);
								String imageFilePath, thumbFilePath;
								imageFilePath = "/template/" + template.getTemplateid() + "/image/" + newFileName;
								thumbFilePath = "/template/" + template.getTemplateid() + "/thumb/" + newFileName;
								File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + imageFilePath);
								File thumbFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + thumbFilePath);
								if (imageFile.exists()) {
									imageFile.delete();
								}
								if (thumbFile.exists()) {
									thumbFile.delete();
								}
								CommonUtil.resizeImage(downloadFile, imageFile, 3840);
								CommonUtil.resizeImage(imageFile, thumbFile, 640);
								FileUtils.deleteQuietly(downloadFile);

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
								templatezone.setContent(image.getFilepath());

								Templatezonedtl templatezonedtl = new Templatezonedtl();
								templatezonedtl.setTemplatezoneid(0);
								templatezonedtl.setObjtype("2");
								templatezonedtl.setObjid(image.getImageid());
								List<Templatezonedtl> templatezonedtls = new ArrayList<Templatezonedtl>();
								templatezonedtls.add(templatezonedtl);
								templatezone.setTemplatezonedtls(templatezonedtls);
							} else {
								logger.error("download image error, return {}", statusCode);
							}
						}
					} else if (templatezone.getType() == Templatezone.Type_TEXT) {
						logger.info("add template zone: {}", zoneStrucJson.getString("zone_name"));
						templatezone.setHeight(
								Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("text_height"))));
						templatezone
								.setWidth(Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("text_width"))));
						templatezone.setTopoffset(
								Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("text_top"))));
						templatezone.setLeftoffset(
								Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("text_left"))));
						templatezone.setZindex(Integer.parseInt(zoneStrucJson.getString("img_z_index")));
						templatezone.setTransform(zoneStrucJson.getString("text_transform"));
						templatezone.setBdcolor(zoneStrucJson.getString("text_border_color"));
						templatezone.setBdstyle(zoneStrucJson.getString("text_border_style"));
						try {
							templatezone.setBdwidth(Math
									.round(1.875f * Integer.parseInt(zoneStrucJson.getString("text_border_width"))));
						} catch (Exception e) {
							templatezone.setBdwidth(0);
						}
						templatezone.setBdradius(Math.round(1.875f
								* Integer.parseInt(zoneStrucJson.getString("border_top_left").replace("px", ""))));
						templatezone.setBgcolor(zoneStrucJson.getString("text_background_color"));
						templatezone.setPadding(Math.round(
								1.875f * Integer.parseInt(zoneStrucJson.getString("text_padding").replace("px", ""))));
						logger.info("text shadow: {}", zoneStrucJson.getString("text_shadow"));
						templatezone.setShadowh(0);
						templatezone.setShadowv(0);
						templatezone.setShadowblur(0);
						templatezone.setShadowcolor("#000000");
						templatezone.setColor(zoneStrucJson.getString("text_color"));
						String fontfamily = zoneStrucJson.getString("text_font_family");
						if (fontfamily != null) {
							templatezone.setFontfamily(
									fontfamily.replaceAll("'", "").replaceAll("\"", "").replaceAll(" ", "_"));
						}
						templatezone.setFontsize(Math.round(1.875f
								* Integer.parseInt(zoneStrucJson.getString("text_font_size").replace("px", ""))));
						templatezone.setFontweight(zoneStrucJson.getString("text_font_weight"));
						templatezone.setFontstyle(zoneStrucJson.getString("text_font_style"));
						templatezone.setDecoration(zoneStrucJson.getString("text_decoration"));
						templatezone.setAlign(zoneStrucJson.getString("text_align"));
						templatezone.setLineheight(Math.round(1.875f
								* Float.parseFloat(zoneStrucJson.getString("text_line_height").replace("px", ""))));
						templatezone.setContent(zoneContent);
					} else {
						logger.error("unknown template zone type");
					}
					templatezones.add(templatezone);
					template.setTemplatezones(templatezones);
					templateService.design(template);
				}

				String snapshotFilePath = "/template/" + template.getTemplateid() + "/snapshot/"
						+ template.getTemplateid() + ".png";
				int statusCode = download2File("http://signagecreator.com/assets/template/admin/" + sourceid + ".jpg",
						CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				if (statusCode == 200) {
					File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
					BufferedImage img = ImageIO.read(snapshotFile);
					template.setSnapshot(snapshotFilePath);
					if (img.getWidth() < img.getHeight()) {
						template.setRatio("2");
						template.setWidth(1080);
						template.setHeight(1920);
					}
				}
				template.setStatus("1");
				templateService.updateTemplate(template);

				template = templateService.selectByPrimaryKey("" + template.getTemplateid());
				logger.info("Fetch finished: {}", sourceid);
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doGet exception, ", ex);
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
			String publicflag = null;

			String orgid = "" + getLoginStaff().getOrgid();
			if (templateflag != null && templateflag.equals("2")) {
				orgid = "1";
				publicflag = "1";
			}

			int count = templateService.selectCount(orgid, ratio, publicflag, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Template> templateList = templateService.selectList(orgid, ratio, publicflag, search, start, length);
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
			template.setOrgid(getLoginStaff().getOrgid());
			template.setCreatestaffid(getLoginStaff().getStaffid());
			templateService.design(template);
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

	private int download2File(String url, String filepath) throws Exception {
		File file = new File(filepath);
		if (file.exists()) {
			file.delete();
		}

		RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(60000).setConnectTimeout(60000)
				.setConnectionRequestTimeout(60000).build();
		CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
		try {
			HttpGet httpget = new HttpGet(url);
			CloseableHttpResponse response = httpclient.execute(httpget);
			int status = response.getStatusLine().getStatusCode();
			if (status == 200) {
				FileOutputStream fileOutputStream = new FileOutputStream(file);
				fileOutputStream.write(EntityUtils.toByteArray(response.getEntity()));
				fileOutputStream.close();
			}
			return status;
		} finally {
			httpclient.close();
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

}
