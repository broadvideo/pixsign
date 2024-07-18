package com.broadvideo.pixsign.service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsign.common.CommonConfig;
import com.broadvideo.pixsign.domain.Image;
import com.broadvideo.pixsign.domain.Page;
import com.broadvideo.pixsign.domain.Pagezone;
import com.broadvideo.pixsign.domain.Pagezonedtl;
import com.broadvideo.pixsign.domain.Template;
import com.broadvideo.pixsign.domain.Templatezone;
import com.broadvideo.pixsign.domain.Templatezonedtl;
import com.broadvideo.pixsign.persistence.ImageMapper;
import com.broadvideo.pixsign.persistence.PageMapper;
import com.broadvideo.pixsign.persistence.TemplateMapper;
import com.broadvideo.pixsign.persistence.TemplatezoneMapper;
import com.broadvideo.pixsign.persistence.TemplatezonedtlMapper;
import com.broadvideo.pixsign.util.CommonUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service("templateService")
public class TemplateServiceImpl implements TemplateService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private TemplateMapper templateMapper;
	@Autowired
	private TemplatezoneMapper templatezoneMapper;
	@Autowired
	private TemplatezonedtlMapper templatezonedtlMapper;
	@Autowired
	private ImageMapper imageMapper;
	@Autowired
	private PageMapper pageMapper;

	public Template selectByPrimaryKey(String templateid) {
		return templateMapper.selectByPrimaryKey(templateid);
	}

	public Template selectByUuid(String uuid) {
		return templateMapper.selectByUuid(uuid);
	}

	public int selectCount(String orgid, String ratio, String touchflag, String homeflag, String publicflag,
			String search) {
		return templateMapper.selectCount(orgid, ratio, touchflag, homeflag, publicflag, search);
	}

	public List<Template> selectList(String orgid, String ratio, String touchflag, String homeflag, String publicflag,
			String search, String start, String length) {
		return templateMapper.selectList(orgid, ratio, touchflag, homeflag, publicflag, search, start, length);
	}

	@Transactional
	public void addTemplate(Template template) {
		if (template.getName() == null || template.getName().equals("")) {
			template.setName("UNKNOWN");
		}
		if (template.getRatio().equals("1")) {
			// 16:9
			template.setWidth(1920);
			template.setHeight(1080);
		} else if (template.getRatio().equals("2")) {
			// 9:16
			template.setWidth(1080);
			template.setHeight(1920);
		}
		templateMapper.insertSelective(template);

		if (template.getName().equals("UNKNOWN")) {
			template.setName("TEMPLATE-" + template.getTemplateid());
		}
		templateMapper.updateByPrimaryKeySelective(template);
	}

	@Transactional
	public void copyTemplate(String fromtemplateid, Template template) throws Exception {
		if (template.getName() == null || template.getName().equals("")) {
			template.setName("UNKNOWN");
		}
		Template fromtemplate = templateMapper.selectByPrimaryKey(fromtemplateid);
		if (fromtemplate == null) {
			// Create template from blank
			if (template.getRatio().equals("1")) {
				// 16:9
				template.setWidth(1920);
				template.setHeight(1080);
			} else if (template.getRatio().equals("2")) {
				// 9:16
				template.setWidth(1080);
				template.setHeight(1920);
			}
			templateMapper.insertSelective(template);

			if (template.getName().equals("UNKNOWN")) {
				template.setName("TEMPLATE-" + template.getTemplateid());
			}
			templateMapper.updateByPrimaryKeySelective(template);
		} else {
			// Copy template
			template.setTemplateid(fromtemplate.getTemplateid());
			template.setRatio(fromtemplate.getRatio());
			template.setHeight(fromtemplate.getHeight());
			template.setWidth(fromtemplate.getWidth());
			template.setLimitflag(fromtemplate.getLimitflag());
			templateMapper.insertSelective(template);
			if (template.getName().equals("UNKNOWN")) {
				template.setName("TEMPLATE-" + template.getTemplateid());
			}
			if (fromtemplate.getSnapshot() != null) {
				String snapshotFilePath = "/template/" + template.getTemplateid() + "/snapshot/"
						+ template.getTemplateid() + ".jpg";
				File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + fromtemplate.getSnapshot()),
						snapshotFile);
				template.setSnapshot(snapshotFilePath);
			}
			templateMapper.updateByPrimaryKeySelective(template);

			List<Templatezone> fromtemplatezones = fromtemplate.getTemplatezones();
			for (Templatezone fromtemplatezone : fromtemplatezones) {
				Templatezone templatezone = new Templatezone();
				templatezone.setTemplateid(template.getTemplateid());
				if (template.getHomeflag().equals("0")) {
					templatezone.setHometemplateid(template.getHometemplateid());
				} else {
					templatezone.setHometemplateid(template.getTemplateid());
				}
				templatezone.setType(fromtemplatezone.getType());
				templatezone.setHeight(fromtemplatezone.getHeight());
				templatezone.setWidth(fromtemplatezone.getWidth());
				templatezone.setTopoffset(fromtemplatezone.getTopoffset());
				templatezone.setLeftoffset(fromtemplatezone.getLeftoffset());
				templatezone.setZindex(fromtemplatezone.getZindex());
				templatezone.setTransform(fromtemplatezone.getTransform());
				templatezone.setBdcolor(fromtemplatezone.getBdcolor());
				templatezone.setBdstyle(fromtemplatezone.getBdstyle());
				templatezone.setBdwidth(fromtemplatezone.getBdwidth());
				templatezone.setBdradius(fromtemplatezone.getBdradius());
				templatezone.setBgcolor(fromtemplatezone.getBgcolor());
				templatezone.setBgopacity(fromtemplatezone.getBgopacity());
				templatezone.setOpacity(fromtemplatezone.getOpacity());
				templatezone.setPadding(fromtemplatezone.getPadding());
				templatezone.setShadowh(fromtemplatezone.getShadowh());
				templatezone.setShadowv(fromtemplatezone.getShadowv());
				templatezone.setShadowblur(fromtemplatezone.getShadowblur());
				templatezone.setShadowcolor(fromtemplatezone.getShadowcolor());
				templatezone.setColor(fromtemplatezone.getColor());
				templatezone.setFontfamily(fromtemplatezone.getFontfamily());
				templatezone.setFontsize(fromtemplatezone.getFontsize());
				templatezone.setFontweight(fromtemplatezone.getFontweight());
				templatezone.setFontstyle(fromtemplatezone.getFontstyle());
				templatezone.setDecoration(fromtemplatezone.getDecoration());
				templatezone.setAlign(fromtemplatezone.getAlign());
				templatezone.setLineheight(fromtemplatezone.getLineheight());
				templatezone.setRowss(fromtemplatezone.getRowss());
				templatezone.setColss(fromtemplatezone.getColss());
				templatezone.setRules(fromtemplatezone.getRules());
				templatezone.setRulecolor(fromtemplatezone.getRulecolor());
				templatezone.setRulewidth(fromtemplatezone.getRulewidth());
				templatezone.setDateformat(fromtemplatezone.getDateformat());
				templatezone.setDiyid(fromtemplatezone.getDiyid());
				templatezone.setTouchtype(fromtemplatezone.getTouchtype());
				templatezone.setTouchid(fromtemplatezone.getTouchid());
				templatezone.setFixflag(fromtemplatezone.getFixflag());
				templatezone.setDiyactionid(fromtemplatezone.getDiyactionid());
				templatezone.setAnimationinit(fromtemplatezone.getAnimationinit());
				templatezone.setAnimationinitdelay(fromtemplatezone.getAnimationinitdelay());
				templatezone.setAnimationclick(fromtemplatezone.getAnimationclick());
				templatezone.setVolume(fromtemplatezone.getVolume());
				templatezone.setSpeed(fromtemplatezone.getSpeed());
				templatezone.setIntervaltime(fromtemplatezone.getIntervaltime());
				templatezone.setEffect(fromtemplatezone.getEffect());
				templatezone.setContent(fromtemplatezone.getContent());
				templatezoneMapper.insertSelective(templatezone);
				for (Templatezonedtl fromtemplatezonedtl : fromtemplatezone.getTemplatezonedtls()) {
					Templatezonedtl templatezonedtl = new Templatezonedtl();
					templatezonedtl.setTemplatezoneid(templatezone.getTemplatezoneid());
					templatezonedtl.setObjtype(fromtemplatezonedtl.getObjtype());
					templatezonedtl.setObjid(fromtemplatezonedtl.getObjid());
					templatezonedtl.setSequence(fromtemplatezonedtl.getSequence());
					templatezonedtlMapper.insertSelective(templatezonedtl);
				}
			}
		}
	}

	@Transactional
	public void updateTemplate(Template template) {
		templateMapper.updateByPrimaryKeySelective(template);
	}

	@Transactional
	public void deleteTemplate(String templateid) {
		Template template = templateMapper.selectByPrimaryKey(templateid);
		if (template != null) {
			for (Template subtemplate : template.getSubtemplates()) {
				templateMapper.deleteByPrimaryKey("" + subtemplate.getTemplateid());
			}
		}
		templateMapper.deleteByPrimaryKey(templateid);
	}

	@Transactional
	public void design(Template template) throws Exception {
		if (template.getName() == null || template.getName().equals("")) {
			template.setName("UNKNOWN");
		}

		templateMapper.updateByPrimaryKeySelective(template);
		int templateid = template.getTemplateid();
		List<Templatezone> templatezones = template.getTemplatezones();
		List<Templatezone> oldtemplatezones = templatezoneMapper.selectList("" + templateid);
		HashMap<Integer, Templatezone> hash = new HashMap<Integer, Templatezone>();
		for (Templatezone templatezone : templatezones) {
			if (templatezone.getTemplatezoneid() > 0) {
				hash.put(templatezone.getTemplatezoneid(), templatezone);
			}
		}
		for (int i = 0; i < oldtemplatezones.size(); i++) {
			Templatezone oldTemplatezone = oldtemplatezones.get(i);
			if (hash.get(oldTemplatezone.getTemplatezoneid()) == null) {
				templatezonedtlMapper.deleteByTemplatezone("" + oldtemplatezones.get(i).getTemplatezoneid());
				templatezoneMapper.deleteByPrimaryKey("" + oldtemplatezones.get(i).getTemplatezoneid());
			}
		}
		for (Templatezone templatezone : templatezones) {
			if (template.getHomeflag().equals("0")) {
				templatezone.setHometemplateid(template.getHometemplateid());
			} else {
				templatezone.setHometemplateid(template.getTemplateid());
			}
			if (templatezone.getTemplatezoneid() <= 0) {
				templatezone.setTemplateid(templateid);
				templatezoneMapper.insertSelective(templatezone);
			} else {
				templatezoneMapper.updateByPrimaryKeySelective(templatezone);
				templatezonedtlMapper.deleteByTemplatezone("" + templatezone.getTemplatezoneid());
			}
			if (templatezone.getTemplatezonedtls() != null) {
				for (Templatezonedtl templatezonedtl : templatezone.getTemplatezonedtls()) {
					templatezonedtl.setTemplatezoneid(templatezone.getTemplatezoneid());
					templatezonedtlMapper.insertSelective(templatezonedtl);
				}
			}
		}

		String snapshotdtl = template.getSnapshotdtl();
		if (snapshotdtl != null && snapshotdtl.startsWith("data:image/jpeg;base64,")) {
			snapshotdtl = snapshotdtl.substring(23);
			String snapshotFilePath = "/template/" + template.getTemplateid() + "/snapshot/" + template.getTemplateid()
					+ ".jpg";
			File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
			FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
			template.setSnapshot(snapshotFilePath);
			templateMapper.updateByPrimaryKeySelective(template);
		}
	}

	@Transactional
	public void saveFromPage(String pageid) throws Exception {
		Page page = pageMapper.selectByPrimaryKey(pageid);
		if (page == null) {
			return;
		}

		Template oldTemplate = templateMapper.selectByUuid(page.getUuid());
		if (oldTemplate != null) {
			deleteTemplate("" + oldTemplate.getTemplateid());
		}
		Template template = new Template();
		Hashtable<Integer, Integer> templateidHash = new Hashtable<Integer, Integer>();
		ArrayList<Page> pageList = new ArrayList<Page>();

		template.setOrgid(page.getOrgid());
		template.setName(page.getName());
		template.setRatio(page.getRatio());
		template.setHeight(page.getHeight());
		template.setWidth(page.getWidth());
		template.setHomeidletime(page.getHomeidletime());
		template.setLimitflag(page.getLimitflag());
		template.setTouchflag(page.getTouchflag());
		template.setHomeflag(page.getHomeflag());
		template.setUuid(page.getUuid());
		templateMapper.insertSelective(template);
		if (page.getSnapshot() != null) {
			String snapshotFilePath = "/template/" + template.getTemplateid() + "/snapshot/" + template.getTemplateid()
					+ ".jpg";
			File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
			FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + page.getSnapshot()), snapshotFile);
			template.setSnapshot(snapshotFilePath);
		}
		templateMapper.updateByPrimaryKeySelective(template);
		templateidHash.put(page.getPageid(), template.getTemplateid());
		pageList.add(page);

		List<Page> subpages = page.getSubpages();
		for (Page s : subpages) {
			Page subpage = pageMapper.selectByPrimaryKey("" + s.getPageid());
			Template subtemplate = new Template();
			subtemplate.setOrgid(template.getOrgid());
			subtemplate.setUuid(UUID.randomUUID().toString().replace("-", ""));
			subtemplate.setName(subpage.getName());
			subtemplate.setRatio(subpage.getRatio());
			subtemplate.setHeight(subpage.getHeight());
			subtemplate.setWidth(subpage.getWidth());
			subtemplate.setTouchflag(subpage.getTouchflag());
			subtemplate.setHomeflag(subpage.getHomeflag());
			subtemplate.setHometemplateid(template.getTemplateid());
			subtemplate.setHomeidletime(subpage.getHomeidletime());
			subtemplate.setLimitflag(subpage.getLimitflag());
			subtemplate.setCreatestaffid(template.getCreatestaffid());
			templateMapper.insertSelective(subtemplate);
			templateidHash.put(subpage.getPageid(), subtemplate.getTemplateid());
			pageList.add(subpage);
			if (subpage.getSnapshot() != null) {
				String snapshotFilePath = "/template/" + subtemplate.getTemplateid() + "/snapshot/"
						+ subtemplate.getTemplateid() + ".jpg";
				File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + subpage.getSnapshot()), snapshotFile);
				subtemplate.setSnapshot(snapshotFilePath);
				templateMapper.updateByPrimaryKeySelective(subtemplate);
			}
		}

		for (Page t : pageList) {
			List<Pagezone> pagezones = t.getPagezones();
			for (Pagezone pagezone : pagezones) {
				Templatezone templatezone = new Templatezone();
				templatezone.setTemplateid(templateidHash.get(t.getPageid()));
				if (template.getHomeflag().equals("0")) {
					templatezone.setHometemplateid(template.getHometemplateid());
				} else {
					templatezone.setHometemplateid(template.getTemplateid());
				}
				templatezone.setType(pagezone.getType());
				templatezone.setHeight(pagezone.getHeight());
				templatezone.setWidth(pagezone.getWidth());
				templatezone.setTopoffset(pagezone.getTopoffset());
				templatezone.setLeftoffset(pagezone.getLeftoffset());
				templatezone.setZindex(pagezone.getZindex());
				templatezone.setTransform(pagezone.getTransform());
				templatezone.setBdcolor(pagezone.getBdcolor());
				templatezone.setBdstyle(pagezone.getBdstyle());
				templatezone.setBdwidth(pagezone.getBdwidth());
				templatezone.setBdradius(pagezone.getBdradius());
				templatezone.setBgcolor(pagezone.getBgcolor());
				templatezone.setBgopacity(pagezone.getBgopacity());
				templatezone.setOpacity(pagezone.getOpacity());
				templatezone.setPadding(pagezone.getPadding());
				templatezone.setShadowh(pagezone.getShadowh());
				templatezone.setShadowv(pagezone.getShadowv());
				templatezone.setShadowblur(pagezone.getShadowblur());
				templatezone.setShadowcolor(pagezone.getShadowcolor());
				templatezone.setColor(pagezone.getColor());
				templatezone.setFontfamily(pagezone.getFontfamily());
				templatezone.setFontsize(pagezone.getFontsize());
				templatezone.setFontweight(pagezone.getFontweight());
				templatezone.setFontstyle(pagezone.getFontstyle());
				templatezone.setDecoration(pagezone.getDecoration());
				templatezone.setAlign(pagezone.getAlign());
				templatezone.setLineheight(pagezone.getLineheight());
				templatezone.setRowss(pagezone.getRowss());
				templatezone.setColss(pagezone.getColss());
				templatezone.setRules(pagezone.getRules());
				templatezone.setRulecolor(pagezone.getRulecolor());
				templatezone.setRulewidth(pagezone.getRulewidth());
				templatezone.setDateformat(pagezone.getDateformat());
				templatezone.setDiyid(pagezone.getDiyid());
				templatezone.setTouchtype(pagezone.getTouchtype());
				Integer touchid = templateidHash.get(pagezone.getTouchid());
				if (touchid == null) {
					touchid = 0;
				}
				templatezone.setTouchid(touchid);
				templatezone.setFixflag(pagezone.getFixflag());
				templatezone.setDiyactionid(pagezone.getDiyactionid());
				templatezone.setAnimationinit(pagezone.getAnimationinit());
				templatezone.setAnimationinitdelay(pagezone.getAnimationinitdelay());
				templatezone.setAnimationclick(pagezone.getAnimationclick());
				templatezone.setVolume(pagezone.getVolume());
				templatezone.setSpeed(pagezone.getSpeed());
				templatezone.setIntervaltime(pagezone.getIntervaltime());
				templatezone.setEffect(pagezone.getEffect());
				templatezone.setContent(pagezone.getContent());
				templatezoneMapper.insertSelective(templatezone);
				for (Pagezonedtl pagezonedtl : pagezone.getPagezonedtls()) {
					Templatezonedtl templatezonedtl = new Templatezonedtl();
					templatezonedtl.setTemplatezoneid(templatezone.getTemplatezoneid());
					templatezonedtl.setObjtype(pagezonedtl.getObjtype());
					templatezonedtl.setObjid(pagezonedtl.getObjid());
					templatezonedtl.setSequence(pagezonedtl.getSequence());
					templatezonedtlMapper.insertSelective(templatezonedtl);
				}
			}
		}
	}

	public void exportZip(String templateid) throws Exception {
		ArrayList<Template> templateList = new ArrayList<Template>();
		HashMap<Integer, Image> imageHash = new HashMap<Integer, Image>();
		Template template = templateMapper.selectByPrimaryKey(templateid);
		templateList.add(template);
		for (Template subtemplate : template.getSubtemplates()) {
			Template p = templateMapper.selectByPrimaryKey("" + subtemplate.getTemplateid());
			templateList.add(p);
		}
		for (Template p : templateList) {
			for (Templatezone templatezone : p.getTemplatezones()) {
				if (templatezone.getType() == Templatezone.Type_Image
						|| templatezone.getType() == Templatezone.Type_Button) {
					for (Templatezonedtl templatezonedtl : templatezone.getTemplatezonedtls()) {
						Image image = templatezonedtl.getImage();
						if (image != null && imageHash.get(image.getImageid()) == null) {
							imageHash.put(image.getImageid(), image);
						}
					}
				}
			}
		}

		String saveDir = CommonConfig.CONFIG_PIXDATA_HOME + "/template/" + templateid;
		String zipname = "template-" + template.getUuid() + ".zip";
		FileUtils.forceMkdir(new File(saveDir));
		File zipFile = new File(saveDir, zipname);
		if (zipFile.exists()) {
			zipFile.delete();
		}
		ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFile));
		out.putNextEntry(new ZipEntry("image/"));

		Iterator<Entry<Integer, Image>> iter = imageHash.entrySet().iterator();
		while (iter.hasNext()) {
			Entry<Integer, Image> entry = iter.next();
			Image image = entry.getValue();
			File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + image.getFilepath());
			CommonUtil.zip(out, imageFile, "image/" + image.getFilename());
		}

		for (Template t : templateList) {
			String templateDir = CommonConfig.CONFIG_PIXDATA_HOME + "/template/" + t.getTemplateid();
			File jsfFile = new File(templateDir, "" + t.getTemplateid() + ".jsf");
			FileUtils.writeStringToFile(jsfFile, JSONObject.fromObject(t).toString(2), "UTF-8", false);
			String jsfname = "index.jsf";
			String jpgname = "index.jpg";
			if (t.getHomeflag().equals("0")) {
				jsfname = "" + t.getTemplateid() + ".jsf";
				jpgname = "" + t.getTemplateid() + ".jpg";
			}
			CommonUtil.zip(out, jsfFile, jsfname);
			if (t.getSnapshot() != null) {
				File snapshot = new File(CommonConfig.CONFIG_PIXDATA_HOME + t.getSnapshot());
				CommonUtil.zip(out, snapshot, jpgname);
			}
		}
		out.close();
	}

	@Transactional
	public void importZip(File zipFile) throws Exception {
		String fileName = zipFile.getName();
		logger.info("Begin to import template {}", fileName);
		fileName = fileName.substring(0, fileName.lastIndexOf("."));
		String unzipFilePath = CommonConfig.CONFIG_PIXDATA_HOME + "/import/" + fileName;
		FileUtils.deleteQuietly(new File(unzipFilePath));
		CommonUtil.unzip(zipFile, unzipFilePath, false);
		FileUtils.forceDelete(zipFile);

		HashMap<Integer, Template> templateHash = new HashMap<Integer, Template>();
		HashMap<Integer, Image> imageHash = new HashMap<Integer, Image>();

		Date now = Calendar.getInstance().getTime();
		File indexJsf = new File(unzipFilePath, "index.jsf");
		logger.info("parse {}", indexJsf.getAbsoluteFile());
		JSONObject templateJson = JSONObject.fromObject(FileUtils.readFileToString(indexJsf, "UTF-8"));
		Map<String, Class> map = new HashMap<String, Class>();
		map.put("subtemplates", Template.class);
		map.put("templatezones", Templatezone.class);
		map.put("templatezonedtls", Templatezonedtl.class);
		Template template = (Template) JSONObject.toBean(templateJson, Template.class, map);
		Integer fromTemplateid = template.getTemplateid();
		Template oldTemplate = templateMapper.selectByUuid(template.getUuid());
		if (oldTemplate != null) {
			deleteTemplate("" + oldTemplate.getTemplateid());
		}
		template.setOrgid(1);
		template.setCreatetime(now);
		templateMapper.insertSelective(template);
		String snapshotFilePath = "/template/" + template.getTemplateid() + "/snapshot/" + template.getTemplateid()
				+ ".jpg";
		template.setSnapshot(snapshotFilePath);
		File fromSnapshotFile = new File(unzipFilePath, "index.jpg");
		File toSnapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		if (fromSnapshotFile.exists()) {
			FileUtils.copyFile(fromSnapshotFile, toSnapshotFile);
		}
		templateMapper.updateByPrimaryKeySelective(template);
		templateHash.put(fromTemplateid, template);
		logger.info("Add template oldid={}, newid={}", fromTemplateid, template.getTemplateid());

		for (Template subtemplate : template.getSubtemplates()) {
			File jsf = new File(unzipFilePath, "" + subtemplate.getTemplateid() + ".jsf");
			logger.info("parse {}", jsf.getAbsoluteFile());
			JSONObject json = JSONObject.fromObject(FileUtils.readFileToString(jsf, "UTF-8"));
			Template t = (Template) JSONObject.toBean(json, Template.class, map);
			fromTemplateid = t.getTemplateid();
			t.setOrgid(1);
			t.setHometemplateid(template.getTemplateid());
			t.setCreatetime(now);
			templateMapper.insertSelective(t);
			snapshotFilePath = "/template/" + t.getTemplateid() + "/snapshot/" + t.getTemplateid() + ".jpg";
			t.setSnapshot(snapshotFilePath);
			fromSnapshotFile = new File(unzipFilePath, "" + fromTemplateid + ".jpg");
			toSnapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
			if (fromSnapshotFile.exists()) {
				FileUtils.copyFile(fromSnapshotFile, toSnapshotFile);
			}
			templateMapper.updateByPrimaryKeySelective(t);
			templateHash.put(fromTemplateid, t);
			logger.info("Add subtemplate oldid={}, newid={}", fromTemplateid, t.getTemplateid());
		}

		Iterator<Entry<Integer, Template>> iter = templateHash.entrySet().iterator();
		while (iter.hasNext()) {
			Entry<Integer, Template> entry = iter.next();
			Template t = entry.getValue();
			for (Templatezone templatezone : t.getTemplatezones()) {
				for (Templatezonedtl templatezonedtl : templatezone.getTemplatezonedtls()) {
					Image image = templatezonedtl.getImage();
					if (image != null && imageHash.get(image.getImageid()) == null) {
						Integer fromImageid = image.getImageid();
						Image toImage = imageMapper.selectByUuid(image.getUuid());
						if (toImage == null) {
							// Insert image
							File fromFile = new File(unzipFilePath + "/image", image.getFilename());
							toImage = new Image();
							toImage.setUuid(image.getUuid());
							toImage.setOrgid(1);
							toImage.setBranchid(1);
							toImage.setFolderid(1);
							toImage.setName(image.getName());
							toImage.setFilename(image.getFilename());
							toImage.setStatus("9");
							toImage.setObjtype("0");
							toImage.setObjid(0);
							toImage.setCreatestaffid(1);
							imageMapper.insertSelective(toImage);
							String newFileName = "" + toImage.getImageid() + "."
									+ FilenameUtils.getExtension(fromFile.getName());
							String imageFilePath, thumbFilePath;
							imageFilePath = "/image/upload/" + newFileName;
							thumbFilePath = "/image/thumb/" + newFileName;
							File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + imageFilePath);
							File thumbFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + thumbFilePath);
							if (imageFile.exists()) {
								imageFile.delete();
							}
							if (thumbFile.exists()) {
								thumbFile.delete();
							}
							FileUtils.copyFile(fromFile, imageFile);
							CommonUtil.resizeImage(imageFile, thumbFile, 640);

							BufferedImage img = ImageIO.read(imageFile);
							toImage.setWidth(img.getWidth());
							toImage.setHeight(img.getHeight());
							toImage.setFilepath(imageFilePath);
							toImage.setThumbnail(thumbFilePath);
							toImage.setFilename(newFileName);
							toImage.setSize(FileUtils.sizeOf(imageFile));
							FileInputStream fis = new FileInputStream(imageFile);
							toImage.setMd5(DigestUtils.md5Hex(fis));
							fis.close();
							toImage.setStatus("1");
							imageMapper.updateByPrimaryKeySelective(toImage);
							logger.info("Add image oldid={}, newid={}", fromImageid, toImage.getImageid());
						}
						imageHash.put(fromImageid, toImage);
					}
				}
			}
		}

		iter = templateHash.entrySet().iterator();
		while (iter.hasNext()) {
			Entry<Integer, Template> entry = iter.next();
			Template t = entry.getValue();
			for (Templatezone templatezone : t.getTemplatezones()) {
				templatezone.setTemplateid(templateHash.get(templatezone.getTemplateid()).getTemplateid());
				templatezone.setHometemplateid(template.getTemplateid());
				Template touchTemplate = templateHash.get(templatezone.getTouchid());
				if (touchTemplate != null) {
					templatezone.setTouchid(touchTemplate.getTemplateid());
				} else {
					templatezone.setTouchid(0);
				}
				templatezoneMapper.insertSelective(templatezone);
				for (Templatezonedtl templatezonedtl : templatezone.getTemplatezonedtls()) {
					if (templatezonedtl.getObjtype().equals("2")) {
						templatezonedtl.setTemplatezoneid(templatezone.getTemplatezoneid());
						templatezonedtl.setObjid(imageHash.get(templatezonedtl.getObjid()).getImageid());
						templatezonedtlMapper.insertSelective(templatezonedtl);
					}
				}
			}
		}
	}

	@Transactional
	public String fetch(String sourceid) throws Exception {
		String server = "http://signagecreator.com/wysiwyg_editor/template/fetch_last_data_template";
		logger.info("Send fetch_last_data_template message to {}, {}", server, sourceid);

		RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
				.setConnectionRequestTimeout(30000).build();
		CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
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

		JSONObject rspJson = JSONObject.fromObject(s);
		String name = rspJson.getString("template_name");
		Template template = new Template();
		List<Templatezone> templatezones = new ArrayList<Templatezone>();
		template.setOrgid(1);
		template.setUuid(UUID.randomUUID().toString().replace("-", ""));
		template.setPublicflag("1");
		template.setHomeflag("1");
		template.setName(name);
		template.setRatio("1");
		template.setWidth(1920);
		template.setHeight(1080);
		template.setDescription(sourceid);
		template.setStatus("0");
		addTemplate(template);

		FileUtils.forceMkdir(
				new File(CommonConfig.CONFIG_PIXDATA_HOME + "/template/" + template.getTemplateid() + "/image"));
		FileUtils.forceMkdir(
				new File(CommonConfig.CONFIG_PIXDATA_HOME + "/template/" + template.getTemplateid() + "/thumb"));
		FileUtils.forceMkdir(
				new File(CommonConfig.CONFIG_PIXDATA_HOME + "/template/" + template.getTemplateid() + "/snapshot"));

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
				templatezone.setType(Templatezone.Type_Image);
			} else if (zoneStrucJson.getString("img_name").equals("text")) {
				templatezone.setType(Templatezone.Type_Text);
			}
			if (templatezone.getType() == Templatezone.Type_Image) {
				logger.info("add template zone: {}", zoneStrucJson.getString("zone_name"));
				if (zoneContent.equals("no") || zoneContent.equals("non")) {
					zoneContent = "";
					logger.info("Ignore to import this image.");
					continue;
				}
				templatezone.setHeight(Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("img_height"))));
				templatezone.setWidth(Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("img_width"))));
				templatezone.setTopoffset(Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("img_top"))));
				templatezone.setLeftoffset(Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("img_left"))));
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
				templatezone.setBdradius(Math.round(
						1.875f * Integer.parseInt(zoneStrucJson.getString("border_top_left").replace("px", ""))));
				templatezone.setBgcolor(zoneStrucJson.getString("img_background_color"));
				templatezone.setOpacity(255 * Integer.parseInt(zoneStrucJson.getString("img_opacity")));
				templatezone.setPadding(Math
						.round(1.875f * Integer.parseInt(zoneStrucJson.getString("img_padding").replace("px", ""))));
				logger.info("image shadow: {}", zoneStrucJson.getString("img_shadow"));
				templatezone.setShadowh(0);
				templatezone.setShadowv(0);
				templatezone.setShadowblur(0);
				templatezone.setShadowcolor("#000000");
				templatezone.setContent(zoneContent);
				if (zoneContent.length() > 0) {
					int statusCode = download2File(
							"http://signagecreator.com/wysiwyg_editor/uploads/media/category/images/" + zoneContent,
							CommonConfig.CONFIG_TEMP_HOME + "/" + zoneContent);
					if (statusCode == 200) {
						File downloadFile = new File(CommonConfig.CONFIG_TEMP_HOME + "/" + zoneContent);
						Image image = new Image();
						image.setOrgid(1);
						image.setBranchid(1);
						image.setName(zoneContent);
						image.setUuid(UUID.randomUUID().toString().replace("-", ""));
						image.setFilename(zoneContent);
						image.setObjtype("1");
						image.setObjid(template.getTemplateid());
						image.setStatus("9");
						image.setDescription(zoneContent);
						image.setCreatestaffid(3);
						imageMapper.insertSelective(image);

						String newFileName = "" + image.getImageid() + "." + FilenameUtils.getExtension(zoneContent);
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
						imageMapper.updateByPrimaryKeySelective(image);
						templatezone.setContent(image.getFilepath());

						Templatezonedtl templatezonedtl = new Templatezonedtl();
						templatezonedtl.setTemplatezoneid(0);
						templatezonedtl.setObjtype("2");
						templatezonedtl.setObjid(image.getImageid());
						templatezonedtl.setSequence(1);
						List<Templatezonedtl> templatezonedtls = new ArrayList<Templatezonedtl>();
						templatezonedtls.add(templatezonedtl);
						templatezone.setTemplatezonedtls(templatezonedtls);
					} else {
						logger.error("download image error, return {}", statusCode);
					}
				}
			} else if (templatezone.getType() == Templatezone.Type_Text) {
				logger.info("add template zone: {}", zoneStrucJson.getString("zone_name"));
				templatezone.setHeight(Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("text_height"))));
				templatezone.setWidth(Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("text_width"))));
				templatezone.setTopoffset(Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("text_top"))));
				templatezone.setLeftoffset(Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("text_left"))));
				templatezone.setZindex(Integer.parseInt(zoneStrucJson.getString("img_z_index")));
				templatezone.setTransform(zoneStrucJson.getString("text_transform"));
				templatezone.setBdcolor(zoneStrucJson.getString("text_border_color"));
				templatezone.setBdstyle(zoneStrucJson.getString("text_border_style"));
				try {
					templatezone.setBdwidth(
							Math.round(1.875f * Integer.parseInt(zoneStrucJson.getString("text_border_width"))));
				} catch (Exception e) {
					templatezone.setBdwidth(0);
				}
				templatezone.setBdradius(Math.round(
						1.875f * Integer.parseInt(zoneStrucJson.getString("border_top_left").replace("px", ""))));
				templatezone.setBgcolor(zoneStrucJson.getString("text_background_color"));
				templatezone.setPadding(Math
						.round(1.875f * Integer.parseInt(zoneStrucJson.getString("text_padding").replace("px", ""))));
				logger.info("text shadow: {}", zoneStrucJson.getString("text_shadow"));
				templatezone.setShadowh(0);
				templatezone.setShadowv(0);
				templatezone.setShadowblur(0);
				templatezone.setShadowcolor("#000000");
				templatezone.setColor(zoneStrucJson.getString("text_color"));
				String fontfamily = zoneStrucJson.getString("text_font_family");
				if (fontfamily != null) {
					templatezone
							.setFontfamily(fontfamily.replaceAll("'", "").replaceAll("\"", "").replaceAll(" ", "_"));
				}
				templatezone.setFontsize(Math
						.round(1.875f * Integer.parseInt(zoneStrucJson.getString("text_font_size").replace("px", ""))));
				templatezone.setFontweight(zoneStrucJson.getString("text_font_weight"));
				templatezone.setFontstyle(zoneStrucJson.getString("text_font_style"));
				templatezone.setDecoration(zoneStrucJson.getString("text_decoration"));
				templatezone.setAlign(zoneStrucJson.getString("text_align"));
				templatezone.setLineheight(Math.round(
						1.875f * Float.parseFloat(zoneStrucJson.getString("text_line_height").replace("px", ""))));
				templatezone.setContent(zoneContent);
			} else {
				logger.error("unknown template zone type");
			}
			templatezones.add(templatezone);
		}
		template.setTemplatezones(templatezones);
		design(template);

		String snapshotFilePath = "/template/" + template.getTemplateid() + "/snapshot/" + template.getTemplateid()
				+ ".jpg";
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
		templateMapper.updateByPrimaryKeySelective(template);

		logger.info("Fetch finished: sourceid={}, templateid={}", sourceid, template.getTemplateid());
		return "" + template.getTemplateid();
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

}
