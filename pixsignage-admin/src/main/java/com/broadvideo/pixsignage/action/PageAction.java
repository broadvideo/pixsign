package com.broadvideo.pixsignage.action;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.imageio.ImageIO;

import org.apache.commons.codec.binary.Base64;
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
import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.domain.Pagezone;
import com.broadvideo.pixsignage.service.ImageService;
import com.broadvideo.pixsignage.service.PageService;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.SqlUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@SuppressWarnings("serial")
@Scope("request")
@Controller("pageAction")
public class PageAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static Hashtable<String, String> CONFIG_FONTS = new Hashtable<String, String>();

	private Page page;
	private Image image;

	private File pageimage;
	private String pageimageFileName;

	@Autowired
	private PageService pageService;
	@Autowired
	private ImageService imageService;

	public String doTemplateList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);

			int count = pageService.selectTemplateCount(search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Page> pageList = pageService.selectTemplateList(search, start, length);
			for (int i = 0; i < pageList.size(); i++) {
				aaData.add(pageList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doTemplateList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doPageList() {
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

			int count = pageService.selectPageCount("" + getLoginStaff().getOrgid(), branchid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Page> pageList = pageService.selectPageList("" + getLoginStaff().getOrgid(), branchid, search, start,
					length);
			for (int i = 0; i < pageList.size(); i++) {
				aaData.add(pageList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doPageList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doGet() {
		try {
			String pageid = getParameter("pageid");
			page = pageService.selectByPrimaryKey(pageid);
			if (page == null) {
				setErrorcode(-1);
				setErrormsg("Not found");
				return ERROR;
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doGet exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doFetch() {
		try {
			String sourceid = getParameter("sourceid");
			if (sourceid != null) {
				String server = "http://signagecreator.com/wysiwyg_editor/template/fetch_last_data_template";
				logger.info("Send page message to {}, {}", server, sourceid);

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
					logger.error("Get page response code: {}", status);
					httpclient.close();
				}
				String s = EntityUtils.toString(response.getEntity());
				logger.info("Get page response: {}", s);
				httpclient.close();

				/*
				 * Client c = Client.create(); WebResource r =
				 * c.resource(server); MultivaluedMap<String, String> params =
				 * new MultivaluedMapImpl(); params.add("node", sourceid);
				 * String s =
				 * r.type(MediaType.APPLICATION_FORM_URLENCODED).accept(
				 * MediaType.APPLICATION_JSON_TYPE) .post(String.class, params);
				 * logger.info("Get page response: {}", s);
				 */
				JSONObject rspJson = JSONObject.fromObject(s);
				String name = rspJson.getString("template_name");
				Page t = new Page();
				t.setOrgid(1);
				t.setBranchid(1);
				t.setName(name);
				t.setType("1");
				t.setRatio("1");
				t.setWidth(1920);
				t.setHeight(1080);
				t.setDescription(sourceid);
				t.setStatus("0");
				pageService.addTemplatePage(t);

				FileUtils.forceMkdir(
						new File(CommonConfig.CONFIG_PIXDATA_HOME + "/template/" + t.getPageid() + "/image"));
				FileUtils.forceMkdir(
						new File(CommonConfig.CONFIG_PIXDATA_HOME + "/template/" + t.getPageid() + "/thumb"));
				FileUtils.forceMkdir(
						new File(CommonConfig.CONFIG_PIXDATA_HOME + "/template/" + t.getPageid() + "/snapshot"));

				JSONArray zoneArrays = rspJson.getJSONArray("template_value");
				for (int i = 0; i < zoneArrays.size(); i++) {
					JSONObject zoneJson = zoneArrays.getJSONObject(i);
					String zoneStructure = zoneJson.getString("zone_structure");
					String zoneContent = zoneJson.getString("zone_content");
					logger.info("zoneStructure: {}", zoneStructure);
					logger.info("zoneContent: {}", zoneContent);
					JSONObject zoneStrucJson = JSONObject.fromObject(zoneStructure);
					Pagezone tz = new Pagezone();
					tz.setPageid(t.getPageid());
					tz.setName(zoneStrucJson.getString("zone_name"));
					if (zoneStrucJson.getString("img_name").equals("image")) {
						tz.setType("1");
					} else if (zoneStrucJson.getString("img_name").equals("text")) {
						tz.setType("0");
					}
					if (zoneStrucJson.getString("layer_mode").equals("active")
							|| zoneStrucJson.getString("layer_mode").equals("")) {
						tz.setStatus("1");
					} else {
						tz.setStatus("0");
					}
					if (tz.getType().equals("1")) {
						tz.setHeight(zoneStrucJson.getString("img_height"));
						tz.setWidth(zoneStrucJson.getString("img_width"));
						tz.setTopoffset(zoneStrucJson.getString("img_top"));
						tz.setLeftoffset(zoneStrucJson.getString("img_left"));
						tz.setZindex(Integer.parseInt(zoneStrucJson.getString("img_z_index")));
						tz.setTransform(zoneStrucJson.getString("img_transform"));
						tz.setBdcolor(zoneStrucJson.getString("img_border_color"));
						tz.setBdstyle(zoneStrucJson.getString("img_border_style"));
						tz.setBdwidth(zoneStrucJson.getString("img_border_width"));
						tz.setBdtl(zoneStrucJson.getString("border_top_left"));
						tz.setBdtr(zoneStrucJson.getString("border_top_right"));
						tz.setBdbl(zoneStrucJson.getString("border_bottom_left"));
						tz.setBdbr(zoneStrucJson.getString("border_bottom_right"));
						tz.setBgcolor(zoneStrucJson.getString("img_background_color"));
						tz.setOpacity(Integer.parseInt(zoneStrucJson.getString("img_opacity")));
						tz.setPadding(zoneStrucJson.getString("img_padding"));
						tz.setShadow(zoneStrucJson.getString("img_shadow"));
						if (zoneContent.equals("no")) {
							zoneContent = "";
						}
						tz.setContent(zoneContent);
						if (zoneContent.length() > 0) {
							int statusCode = download2File(
									"http://signagecreator.com/wysiwyg_editor/uploads/media/category/images/"
											+ zoneContent,
									CommonConfig.CONFIG_TEMP_HOME + "/" + zoneContent);
							if (statusCode == 200) {
								File downloadFile = new File(CommonConfig.CONFIG_TEMP_HOME + "/" + zoneContent);
								BufferedImage img = ImageIO.read(downloadFile);
								Image image = new Image();
								image.setOrgid(getLoginStaff().getOrgid());
								image.setBranchid(getLoginStaff().getBranchid());
								image.setName(zoneContent);
								image.setWidth(img.getWidth());
								image.setHeight(img.getHeight());
								image.setFilename(zoneContent);
								image.setObjtype("1");
								image.setObjid(t.getPageid());
								image.setStatus("9");
								image.setDescription(zoneContent);
								image.setCreatestaffid(getLoginStaff().getStaffid());
								imageService.addImage(image);

								String newFileName = "" + image.getImageid() + "."
										+ FilenameUtils.getExtension(zoneContent);
								String imageFilePath, thumbFilePath;
								imageFilePath = "/template/" + t.getPageid() + "/image/" + newFileName;
								thumbFilePath = "/template/" + t.getPageid() + "/thumb/" + newFileName;
								File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + imageFilePath);
								File thumbFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + thumbFilePath);
								if (imageFile.exists()) {
									imageFile.delete();
								}
								if (thumbFile.exists()) {
									thumbFile.delete();
								}
								FileUtils.moveFile(downloadFile, imageFile);
								FileUtils.writeByteArrayToFile(thumbFile, CommonUtil.generateThumbnail(imageFile, 640));

								image.setFilepath(imageFilePath);
								image.setThumbnail(thumbFilePath);
								image.setFilename(newFileName);
								image.setSize(FileUtils.sizeOf(imageFile));
								FileInputStream fis = new FileInputStream(imageFile);
								image.setMd5(DigestUtils.md5Hex(fis));
								fis.close();
								image.setStatus("1");
								imageService.updateImage(image);
								tz.setImageid("" + image.getImageid());
								tz.setContent(image.getFilepath());
							} else {
								logger.error("download image error, return {}", statusCode);
							}
						}
					} else if (tz.getType().equals("0")) {
						tz.setHeight(zoneStrucJson.getString("text_height"));
						tz.setWidth(zoneStrucJson.getString("text_width"));
						tz.setTopoffset(zoneStrucJson.getString("text_top"));
						tz.setLeftoffset(zoneStrucJson.getString("text_left"));
						tz.setZindex(Integer.parseInt(zoneStrucJson.getString("img_z_index")));
						tz.setTransform(zoneStrucJson.getString("text_transform"));
						tz.setBdcolor(zoneStrucJson.getString("text_border_color"));
						tz.setBdstyle(zoneStrucJson.getString("text_border_style"));
						tz.setBdwidth(zoneStrucJson.getString("text_border_width"));
						tz.setBdtl(zoneStrucJson.getString("border_top_left"));
						tz.setBdtr(zoneStrucJson.getString("border_top_right"));
						tz.setBdbl(zoneStrucJson.getString("border_bottom_left"));
						tz.setBdbr(zoneStrucJson.getString("border_bottom_right"));
						tz.setBgcolor(zoneStrucJson.getString("text_background_color"));
						tz.setPadding(zoneStrucJson.getString("text_padding"));
						tz.setShadow(zoneStrucJson.getString("text_shadow"));
						tz.setColor(zoneStrucJson.getString("text_color"));
						String fontfamily = zoneStrucJson.getString("text_font_family");
						if (fontfamily != null) {
							tz.setFontfamily(fontfamily.replaceAll("'", ""));
						}
						tz.setFontsize(zoneStrucJson.getString("text_font_size"));
						tz.setFontweight(zoneStrucJson.getString("text_font_weight"));
						tz.setFontstyle(zoneStrucJson.getString("text_font_style"));
						tz.setDecoration(zoneStrucJson.getString("text_decoration"));
						tz.setAlign(zoneStrucJson.getString("text_align"));
						tz.setLineheight(zoneStrucJson.getString("text_line_height"));
						tz.setContent(zoneContent);
					}
					pageService.addPagezone(tz);
				}

				String snapshotFilePath = "/template/" + t.getPageid() + "/snapshot/" + t.getPageid() + ".png";
				int statusCode = download2File("http://signagecreator.com/assets/template/admin/" + sourceid + ".jpg",
						CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				if (statusCode == 200) {
					File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
					BufferedImage img = ImageIO.read(snapshotFile);
					t.setSnapshot(snapshotFilePath);
					if (img.getWidth() < img.getHeight()) {
						t.setRatio("2");
						t.setWidth(1080);
						t.setHeight(1920);
					}
				}
				t.setStatus("1");
				pageService.updatePage(t);

				page = pageService.selectByPrimaryKey("" + t.getPageid());
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

	public String doTemplateAdd() {
		try {
			page.setOrgid(0);
			page.setBranchid(0);
			page.setCreatestaffid(getLoginStaff().getStaffid());
			pageService.addTemplatePage(page);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doTemplateAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doCommonAdd() {
		try {
			page.setOrgid(getLoginStaff().getOrgid());
			page.setBranchid(getLoginStaff().getBranchid());
			page.setCreatestaffid(getLoginStaff().getStaffid());
			pageService.addCommonPage(page);
			makePageZip("" + page.getPageid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doCommonAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			pageService.updatePage(page);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			pageService.deletePage("" + page.getPageid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doImageUpload() {
		try {
			String pageid = getParameter("pageid");
			logger.info("Upload one image, pageid={}, pageimage={}", pageid, pageimage);
			Page page = pageService.selectByPrimaryKey(pageid);
			if (pageimage != null && page != null) {
				logger.info("Upload one image for page {}", page.getName());

				BufferedImage img = ImageIO.read(pageimage);
				Image image = new Image();
				image.setOrgid(getLoginStaff().getOrgid());
				image.setBranchid(getLoginStaff().getBranchid());
				image.setName(pageimageFileName);
				image.setWidth(img.getWidth());
				image.setHeight(img.getHeight());
				image.setFilename(pageimageFileName);
				if (page.getPagepkgid().intValue() == 0) {
					image.setObjtype("1");
					image.setObjid(page.getPageid());
				} else {
					image.setObjtype("2");
					image.setObjid(page.getPagepkgid());
				}
				image.setStatus("9");
				image.setDescription(pageimageFileName);
				image.setCreatestaffid(getLoginStaff().getStaffid());
				imageService.addImage(image);

				String newFileName = "" + image.getImageid() + "." + FilenameUtils.getExtension(pageimageFileName);
				String imageFilePath, thumbFilePath;
				if (image.getObjtype().equals("1")) {
					imageFilePath = "/template/" + pageid + "/image/" + newFileName;
					thumbFilePath = "/template/" + pageid + "/thumb/" + newFileName;
				} else {
					imageFilePath = "/pagepkg/" + page.getPagepkgid() + "/image/" + newFileName;
					thumbFilePath = "/pagepkg/" + page.getPagepkgid() + "/thumb/" + newFileName;
				}
				File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + imageFilePath);
				File thumbFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + thumbFilePath);
				if (imageFile.exists()) {
					imageFile.delete();
				}
				if (thumbFile.exists()) {
					thumbFile.delete();
				}
				FileUtils.moveFile(pageimage, imageFile);
				FileUtils.writeByteArrayToFile(thumbFile, CommonUtil.generateThumbnail(imageFile, 640));

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

	public String doSave() {
		try {
			String snapshotdtl = page.getSnapshotdtl();
			if (snapshotdtl.startsWith("data:image/png;base64,")) {
				snapshotdtl = snapshotdtl.substring(22);
			}
			String snapshotFilePath;
			if (page.getPagepkgid().intValue() == 0 && page.getTemplateflag().equals("0")) {
				snapshotFilePath = "/page/" + page.getPageid() + "/snapshot/" + page.getPageid() + ".png";
			} else if (page.getPagepkgid().intValue() == 0 && page.getTemplateflag().equals("1")) {
				snapshotFilePath = "/template/" + page.getPageid() + "/snapshot/" + page.getPageid() + ".png";
			} else {
				snapshotFilePath = "/pagepkg/" + page.getPagepkgid() + "/snapshot/" + page.getPageid() + ".png";
			}
			File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
			FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
			page.setSnapshot(snapshotFilePath);
			pageService.savePage(page);
			makePageZip("" + page.getPageid());

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doSave exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	private void makePageZip(String pageid) throws Exception {
		if (CONFIG_FONTS.size() == 0) {
			Properties properties = new Properties();
			InputStream is = this.getClass().getResourceAsStream("/fonts.properties");
			properties.load(is);
			CONFIG_FONTS = new Hashtable<String, String>();
			Iterator<Entry<Object, Object>> it = properties.entrySet().iterator();
			while (it.hasNext()) {
				Entry<Object, Object> entry = it.next();
				CONFIG_FONTS.put(entry.getKey().toString(), entry.getValue().toString());
			}
			is.close();
		}

		if (page.getPagepkgid().intValue() > 0 || page.getTemplateflag().equals("1")) {
			return;
		}
		Page page = pageService.selectByPrimaryKey(pageid);
		page.setSnapshotdtl(null);
		String saveDir = CommonConfig.CONFIG_PIXDATA_HOME + "/page/" + page.getPageid();
		if (page.getTemplateflag().equals("1")) {
			saveDir = CommonConfig.CONFIG_PIXDATA_HOME + "/template/" + page.getPageid();
		}
		String zipname = "page-" + page.getPageid() + ".zip";
		FileUtils.forceMkdir(new File(saveDir));

		File zipFile = new File(saveDir, zipname);
		if (zipFile.exists()) {
			zipFile.delete();
		}
		ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFile));
		out.putNextEntry(new ZipEntry("css/"));
		out.putNextEntry(new ZipEntry("js/"));
		out.putNextEntry(new ZipEntry("fonts/"));
		out.putNextEntry(new ZipEntry("image/"));
		ClassLoader classLoader = getClass().getClassLoader();
		ArrayList<String> fontList = new ArrayList<String>();
		for (Pagezone pagezone : page.getPagezones()) {
			if (pagezone.getType().equals(Pagezone.Type_Image)) {
				Image image = imageService.selectByPrimaryKey(pagezone.getImageid());
				if (image != null) {
					pagezone.setContent("./image/" + image.getFilename());
					File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + image.getFilepath());
					zip(out, imageFile, "image/" + image.getFilename());
				}
			}
			if (pagezone.getType().equals(Pagezone.Type_Text) && pagezone.getFontfamily().length() > 0) {
				String font = CONFIG_FONTS.get(pagezone.getFontfamily());
				if (font != null && fontList.indexOf(font) < 0) {
					fontList.add(font);
				}
			}
		}
		for (String font : fontList) {
			if (classLoader.getResource("/pagezip/fonts/" + font) != null) {
				File fontFile = new File(classLoader.getResource("/pagezip/fonts/" + font).getFile());
				zip(out, fontFile, "fonts/" + font);
			} else {
				logger.error("font file {} not exists", font);
			}
		}
		File dataFile = new File(saveDir, "data.js");
		FileUtils.writeStringToFile(dataFile, "var Page=" + JSONObject.fromObject(page).toString(2), "UTF-8", false);
		zip(out, dataFile, "data.js");

		zip(out, new File(classLoader.getResource("/pagezip/css/pixpage.css").getFile()), "css/pixpage.css");
		zip(out, new File(classLoader.getResource("/pagezip/js/pixpage.js").getFile()), "js/pixpage.js");
		zip(out, new File(classLoader.getResource("/pagezip/js/jquery.min.js").getFile()), "js/jquery.min.js");
		zip(out, new File(classLoader.getResource("/pagezip/index.html").getFile()), "index.html");
		out.close();
	}

	private void zip(ZipOutputStream out, File f, String base) throws Exception {
		if (f.isDirectory()) {
			File[] fl = f.listFiles();
			if (fl.length == 0) {
				out.putNextEntry(new ZipEntry(base + "/")); // 创建zip压缩进入点base
			}
			for (int i = 0; i < fl.length; i++) {
				if (base.equals("")) {
					zip(out, fl[i], fl[i].getName()); // 递归遍历子文件夹
				} else {
					zip(out, fl[i], base + "/" + fl[i].getName()); // 递归遍历子文件夹
				}
			}
		} else {
			out.putNextEntry(new ZipEntry(base)); // 创建zip压缩进入点base
			FileInputStream in = new FileInputStream(f);
			byte[] b = new byte[1000];
			int len = -1;
			while ((len = in.read(b)) != -1) {
				out.write(b, 0, len);
			}
			in.close();
		}
	}

	private int download2File(String url, String filepath) throws Exception {
		File file = new File(filepath);
		if (file.exists()) {
			file.delete();
		}

		RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
				.setConnectionRequestTimeout(30000).build();
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

	public Page getPage() {
		return page;
	}

	public void setPage(Page page) {
		this.page = page;
	}

	public Image getImage() {
		return image;
	}

	public void setImage(Image image) {
		this.image = image;
	}

	public File getPageimage() {
		return pageimage;
	}

	public void setPageimage(File pageimage) {
		this.pageimage = pageimage;
	}

	public String getPageimageFileName() {
		return pageimageFileName;
	}

	public void setPageimageFileName(String pageimageFileName) {
		this.pageimageFileName = pageimageFileName;
	}
}
